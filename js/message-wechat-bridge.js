(function () {
    'use strict';

    if (window.CrossAppBridge?.__tonghuajiCrossAppBridge) return;

    const storeId = 'layoutStore';
    const smsMarker = '你现在正通过手机短信 (iMessage) 与对方交流';
    let activeAccountId = '';
    let refreshPromise = null;
    const CROSS_APP_HISTORY_MAX_AGE_MS = 7 * 24 * 60 * 60 * 1000;
    const CROSS_APP_HISTORY_LIMIT = 8;
    const CROSS_APP_CONTINUITY_MS = 3 * 60 * 60 * 1000;
    const CROSS_APP_RECENT_BACKGROUND_MS = 24 * 60 * 60 * 1000;
    const CROSS_APP_CONTEXT_TAG = '<cross_app_context>';
    const CROSS_APP_RULES_TAG = '<cross_app_channel_rules>';
    const channelAdapters = new Map();

    function getCurrentAccountId() {
        try {
            if (typeof appSettings !== 'undefined' && appSettings && appSettings.wc_current_user_id) {
                return String(appSettings.wc_current_user_id);
            }
        } catch (error) {}
        return '';
    }

    function getLayoutDb() {
        try {
            if (typeof db !== 'undefined' && db && db.objectStoreNames?.contains(storeId)) return db;
        } catch (error) {}
        return window.db && window.db.objectStoreNames?.contains(storeId) ? window.db : null;
    }

    function readLayoutRecord(id) {
        const database = getLayoutDb();
        if (!database || !id) return Promise.resolve(null);
        return new Promise((resolve) => {
            try {
                const transaction = database.transaction([storeId], 'readonly');
                const request = transaction.objectStore(storeId).get(id);
                request.onsuccess = () => resolve(request.result || null);
                request.onerror = () => resolve(null);
            } catch (error) {
                resolve(null);
            }
        });
    }

    function normalizeSmsRecord(record) {
        return {
            conversations: Array.isArray(record?.conversations) ? record.conversations : [],
            identities: Array.isArray(record?.identities) ? record.identities : []
        };
    }

    async function refreshSmsCache(force = false) {
        const accountId = getCurrentAccountId();
        if (!accountId) return null;
        if (!force && activeAccountId === accountId && window.messageAppData && Array.isArray(window.messageAppData.conversations)) {
            return window.messageAppData;
        }
        if (refreshPromise) await refreshPromise.catch(() => null);
        if (!force && activeAccountId === accountId && window.messageAppData && Array.isArray(window.messageAppData.conversations)) {
            return window.messageAppData;
        }

        refreshPromise = (async () => {
            const record = await readLayoutRecord(`messageAppData_${accountId}`);
            if (getCurrentAccountId() !== accountId) return null;
            const normalized = normalizeSmsRecord(record);
            window.messageAppData = normalized;
            activeAccountId = accountId;
            return normalized;
        })();

        try {
            return await refreshPromise;
        } finally {
            refreshPromise = null;
        }
    }

    function normalizeKey(value) {
        return String(value || '').trim().toLowerCase();
    }

    function extractCharacterName(systemText) {
        const text = String(systemText || '');
        const legacyMatch = text.match(/角色名：\s*([^\n<]+)/);
        if (legacyMatch) return legacyMatch[1].trim();

        const meetingProfile = text.match(/<character_profile>[\s\S]*?<name>([\s\S]*?)<\/name>[\s\S]*?<\/character_profile>/i);
        return meetingProfile ? String(meetingProfile[1] || '').trim() : '';
    }

    function getWechatContacts() {
        try {
            if (typeof wcContactsList !== 'undefined' && Array.isArray(wcContactsList)) return wcContactsList;
        } catch (error) {}
        return Array.isArray(window.wcContactsList) ? window.wcContactsList : [];
    }

    function findWechatContact(characterName) {
        const target = normalizeKey(characterName);
        if (!target) return null;
        return getWechatContacts().find((contact) => {
            return [contact?.remark, contact?.name, contact?.account, contact?.phone]
                .some(value => normalizeKey(value) === target);
        }) || null;
    }

    function resolveCurrentWechatContact(systemText, preferSystemIdentity = false) {
        const identity = getRequestBridgeIdentity(systemText);
        if (identity) {
            if (identity.accountId !== getCurrentAccountId()) return null;
            return getWechatContacts().find(contact => String(contact.id) === identity.contactId) || null;
        }
        const groupIdentity = getGroupBridgeIdentity(systemText);
        if (groupIdentity) {
            return groupIdentity.contactId
                ? getWechatContacts().find(contact => String(contact.id) === groupIdentity.contactId) || null
                : null;
        }
        const systemCharacter = extractCharacterName(systemText);
        if (preferSystemIdentity && systemCharacter) {
            const matched = findWechatContact(systemCharacter);
            if (matched) return matched;
        }

        let contactId = '';
        try {
            if (typeof wcCurrentChatContactId !== 'undefined' && wcCurrentChatContactId) {
                contactId = String(wcCurrentChatContactId);
            }
        } catch (error) {}
        const contacts = getWechatContacts();
        if (contactId) {
            const current = contacts.find(contact => String(contact?.id || '') === contactId);
            if (current) return current;
        }
        return findWechatContact(systemCharacter);
    }

    function contentToText(content) {
        if (typeof content === 'string') return content;
        if (!Array.isArray(content)) return '';
        return content.map(part => typeof part?.text === 'string' ? part.text : '').filter(Boolean).join('\n');
    }

    function estimateDiagnosticTokens(text) {
        const estimator = typeof window.wcEstimatePromptTokens === 'function'
            ? window.wcEstimatePromptTokens
            : (value => Math.max(1, Math.ceil(String(value || '').length / 3)));
        const value = String(text || '').trim();
        return value ? estimator(value) : 0;
    }

    function publishCrossAppTokenDiagnostics(currentChannel, sections, contextBlock, ruleBlock) {
        const diagnostic = {
            currentChannelId: currentChannel?.id || '',
            currentChannelLabel: currentChannel?.label || '',
            contextTokens: estimateDiagnosticTokens(contextBlock),
            ruleTokens: estimateDiagnosticTokens(ruleBlock),
            sources: Array.isArray(sections)
                ? sections.map(section => ({
                    id: section?.channelId || '',
                    label: section?.label || section?.channelId || '其他 App',
                    tokens: estimateDiagnosticTokens(section?.text || '')
                })).filter(source => source.id || source.tokens > 0)
                : [],
            updatedAt: Date.now()
        };
        window.wcLastCrossAppTokenBreakdown = diagnostic;
        if (typeof window.wcApplyCrossAppTokenBreakdown === 'function') {
            window.wcApplyCrossAppTokenBreakdown(diagnostic);
        }
    }

    function parseMessageTimestamp(value) {
        if (value instanceof Date) return value.getTime();
        const numeric = Number(value);
        if (Number.isFinite(numeric) && numeric > 0) {
            return numeric < 1e12 ? numeric * 1000 : numeric;
        }
        const parsed = Date.parse(String(value || ''));
        return Number.isFinite(parsed) ? parsed : 0;
    }

    function isRecentCrossAppMessage(message, now = Date.now()) {
        const timestamp = parseMessageTimestamp(message?.time ?? message?.createdAt ?? 0);
        if (!timestamp || timestamp > now + 5 * 60 * 1000) return false;
        return now - timestamp <= CROSS_APP_HISTORY_MAX_AGE_MS;
    }

    function pad2(value) {
        return String(value).padStart(2, '0');
    }

    function formatLocalTimestamp(timestamp) {
        const value = parseMessageTimestamp(timestamp);
        if (!value) return '时间未知';
        const date = new Date(value);
        return date.getFullYear() + '-' + pad2(date.getMonth() + 1) + '-' + pad2(date.getDate())
            + ' ' + pad2(date.getHours()) + ':' + pad2(date.getMinutes());
    }

    function describeTimeGap(timestamp, now = Date.now()) {
        const value = parseMessageTimestamp(timestamp);
        if (!value || value > now) return '';
        const gapMs = now - value;
        const minutes = Math.floor(gapMs / 60000);
        if (minutes < 10) return '刚刚';
        if (minutes < 60) return '约' + minutes + '分钟前';
        const hours = Math.floor(minutes / 60);
        if (hours < 24) return '约' + hours + '小时前';
        const days = Math.floor(hours / 24);
        return '约' + days + '天前';
    }

    function getHistoryBand(timestamp, now = Date.now()) {
        const value = parseMessageTimestamp(timestamp);
        if (!value) return '历史';
        const gapMs = Math.max(0, now - value);
        if (gapMs <= CROSS_APP_CONTINUITY_MS) return '近期';
        if (gapMs <= CROSS_APP_RECENT_BACKGROUND_MS) return '背景';
        return '历史';
    }

    function formatSmsEntry(message) {
        const text = String(message?.text || '').trim();
        if (!text) return null;
        const timestamp = parseMessageTimestamp(message?.time ?? message?.createdAt ?? 0);
        if (!timestamp) return null;

        let actor = message?.type === 'sent' ? 'user' : 'character';
        let actorLabel = actor === 'user' ? '用户' : '角色';
        if (message?.type === 'sent' && message?.senderIdentity?.type === 'disguise') {
            const label = String(message.senderIdentity.label || '未知伪装身份').trim();
            const desc = String(message.senderIdentity.desc || '未知').trim();
            actorLabel = '用户（伪装号码 ' + label + '，身份描述：' + desc + '）';
        }

        return { actor, actorLabel, text, timestamp };
    }

    function buildSmsHistory(record, contact, now = Date.now()) {
        if (!record || !Array.isArray(record.conversations) || !contact) return [];
        const keys = new Set([
            contact.id,
            contact.linkedContactId,
            contact.name,
            contact.remark,
            contact.phone,
            contact.account
        ].filter(Boolean).map(normalizeKey));
        const conversation = record.conversations.find(item => {
            if (!item || item.isDeleted) return false;
            return keys.has(normalizeKey(item.id)) || keys.has(normalizeKey(item.sender));
        });
        if (!conversation || !Array.isArray(conversation.messages)) return [];

        return conversation.messages
            .filter(message => message && message.text && isRecentCrossAppMessage(message, now))
            .slice(-CROSS_APP_HISTORY_LIMIT)
            .map(formatSmsEntry)
            .filter(Boolean);
    }

    async function readWechatHistory(contactId, now = Date.now()) {
        const accountId = getCurrentAccountId();
        if (!accountId || !contactId) return [];
        let conversations = null;
        try {
            if (typeof wcChatMessagesByContact !== 'undefined' && wcChatMessagesByContact && typeof wcChatMessagesByContact === 'object') {
                conversations = wcChatMessagesByContact;
            }
        } catch (error) {}
        if (!Array.isArray(conversations?.[contactId])) {
            const scoped = await readLayoutRecord('wechatChatData_' + accountId);
            const legacy = scoped || await readLayoutRecord('wechatChatData');
            conversations = legacy?.conversations || legacy?.messages || conversations || {};
        }

        const list = Array.isArray(conversations?.[contactId]) ? conversations[contactId] : [];
        return list
            .filter(message => message && typeof message.text === 'string' && message.type !== 'system_event' && isRecentCrossAppMessage(message, now))
            .slice(-CROSS_APP_HISTORY_LIMIT)
            .map(message => {
                let text = String(message.text || '').trim();
                if (!text) return null;
                if (message.isVoice) text = '[语音消息: ' + text + ']';
                const timestamp = parseMessageTimestamp(message?.createdAt ?? message?.time ?? 0);
                if (!timestamp) return null;
                const actor = message.type === 'sent' ? 'user' : 'character';
                return {
                    actor,
                    actorLabel: actor === 'user' ? '用户' : '角色',
                    text,
                    timestamp
                };
            })
            .filter(Boolean);
    }

    async function readGroupHistoryForWechat(contactId, now = Date.now()) {
        const accountId = getCurrentAccountId();
        if (!accountId || !contactId) return [];
        const record = await readLayoutRecord('wechatGroupData_' + accountId);
        const groups = (Array.isArray(record?.groups) ? record.groups : [])
            .filter(group => !group.archived && (group.members || []).some(member =>
                String(member.id) === String(contactId) && member.kind !== 'npc'))
            .slice(-6);
        const collected = [];
        for (const group of groups) {
            const self = group.members.find(member => String(member.id) === String(contactId));
            if (!self) continue;
            const stored = await readLayoutRecord('wechatGroupMessages_' + accountId + '::' + group.id);
            const rows = Array.isArray(stored?.messages) ? stored.messages : [];
            const minimum = group.historyVisible ? 0 : Number(self.historyFromSequence) || 0;
            const visible = rows.filter(message => message && !message.recalled &&
                message.includeInContext !== false && message.senderId !== 'system' &&
                Number(message.sequence) >= minimum);
            const allowed = new Set(visible.map(message => String(message.id)));
            (group.summaryChunks || []).slice(-2).forEach(chunk => {
                if (Number(chunk.fromSequence) < minimum ||
                    !(chunk.sourceIds || []).length ||
                    !chunk.sourceIds.every(id => allowed.has(String(id)))) return;
                const time = parseMessageTimestamp(chunk.createdAt);
                if (!time || time > now || now - time > CROSS_APP_HISTORY_MAX_AGE_MS) return;
                const text = String(chunk.text || '').trim().slice(0, 550);
                if (text) collected.push({ actor: 'character',
                    actorLabel: '群聊「' + String(group.name || '群聊').slice(0, 35) + '」已发生的公开经历摘要',
                    text, timestamp: time });
            });
            visible.slice(-5).forEach(message => {
                const timestamp = parseMessageTimestamp(message.createdAt);
                if (!timestamp || timestamp > now || now - timestamp > CROSS_APP_HISTORY_MAX_AGE_MS) return;
                collected.push({
                    actor: message.senderId === 'user' ? 'user' : 'character',
                    actorLabel: '群聊「' + String(group.name || '群聊').slice(0, 35) +
                        '」·' + String(message.senderName || '成员').slice(0, 35),
                    text: String(message.text || '').slice(0, 500), timestamp
                });
            });
        }
        return collected.sort((a, b) => a.timestamp - b.timestamp).slice(-8);
    }

    function getGroupBridgeIdentity(systemText) {
        const match = String(systemText || '').match(/<wc_group_bridge\s+contact="([^"]*)"\s+allow_private="(true|false)"\s*\/>/);
        if (!match) return null;
        let contactId = '';
        try { contactId = decodeURIComponent(match[1]); } catch (_) { return null; }
        return { contactId, allowPrivate: match[2] === 'true' };
    }

    function getRequestBridgeIdentity(systemText) {
        const match = String(systemText || '').match(/<cross_app_identity\s+channel="(wechat|meeting)"\s+contact="([^"]*)"\s+account="([^"]*)"(?:\s+read_online="(true|false)"\s+mode="(normal|if|dream)")?\s*\/>/);
        if (!match) return null;
        try {
            return { channel: match[1], contactId: decodeURIComponent(match[2]),
                accountId: decodeURIComponent(match[3]), readOnline: match[4] !== 'false', mode: match[5] || 'normal' };
        } catch (_) {
            return { channel: match[1], contactId: '', accountId: '', readOnline: false, mode: 'normal' };
        }
    }

    function registerChannel(adapter) {
        if (!adapter || typeof adapter !== 'object') throw new TypeError('CrossAppBridge adapter must be an object');
        const id = normalizeKey(adapter.id);
        if (!id) throw new TypeError('CrossAppBridge adapter.id is required');
        if (typeof adapter.detectRequest !== 'function') throw new TypeError('CrossAppBridge adapter.detectRequest is required');
        if (typeof adapter.loadHistory !== 'function') throw new TypeError('CrossAppBridge adapter.loadHistory is required');

        const normalized = {
            id,
            label: String(adapter.label || adapter.id || id),
            priority: Number.isFinite(Number(adapter.priority)) ? Number(adapter.priority) : 0,
            bridgeWithWechat: adapter.bridgeWithWechat !== false,
            bridgeSources: Array.isArray(adapter.bridgeSources) ? adapter.bridgeSources.map(normalizeKey).filter(Boolean) : null,
            legacyMarkers: Array.isArray(adapter.legacyMarkers) ? adapter.legacyMarkers.map(String).filter(Boolean) : [],
            maxAgeMs: Number.isFinite(Number(adapter.maxAgeMs)) ? Math.max(0, Number(adapter.maxAgeMs)) : CROSS_APP_HISTORY_MAX_AGE_MS,
            limit: Number.isFinite(Number(adapter.limit)) ? Math.max(1, Number(adapter.limit)) : CROSS_APP_HISTORY_LIMIT,
            detectRequest: adapter.detectRequest,
            loadHistory: adapter.loadHistory,
            currentRule: adapter.currentRule,
            refresh: typeof adapter.refresh === 'function' ? adapter.refresh : null
        };
        channelAdapters.set(id, normalized);
        return normalized;
    }

    function unregisterChannel(id) {
        const key = normalizeKey(id);
        if (!key || key === 'wechat' || key === 'sms') return false;
        return channelAdapters.delete(key);
    }

    function resolveCurrentChannel(systemText) {
        const identity = getRequestBridgeIdentity(systemText);
        if (identity) return channelAdapters.get(identity.channel) || null;
        const adapters = Array.from(channelAdapters.values()).sort((a, b) => b.priority - a.priority);
        for (const adapter of adapters) {
            try {
                if (adapter.detectRequest(systemText)) return adapter;
            } catch (error) {
                console.warn('Cross-app channel detection failed for ' + adapter.id + ':', error);
            }
        }
        return null;
    }

    function startsWithLegacyMarker(message, markers) {
        if (!Array.isArray(markers) || markers.length === 0) return false;
        const text = contentToText(message?.content).trimStart();
        if (!text) return false;
        return markers.some(marker => text.startsWith(marker));
    }

    function removeForeignLegacyMessages(payload, currentChannelId) {
        if (!payload || !Array.isArray(payload.messages)) return 0;
        const markers = [];
        channelAdapters.forEach(adapter => {
            if (adapter.id !== currentChannelId) markers.push(...adapter.legacyMarkers);
        });
        if (markers.length === 0) return 0;

        const before = payload.messages.length;
        payload.messages = payload.messages.filter(message => {
            if (message?.role === 'system') return true;
            return !startsWithLegacyMarker(message, markers);
        });
        return before - payload.messages.length;
    }

    function normalizeHistoryEntries(entries, adapter, now = Date.now()) {
        if (!Array.isArray(entries)) return [];
        const maxAgeMs = adapter?.maxAgeMs ?? CROSS_APP_HISTORY_MAX_AGE_MS;
        const limit = adapter?.limit ?? CROSS_APP_HISTORY_LIMIT;
        return entries
            .map(entry => {
                const timestamp = parseMessageTimestamp(entry?.timestamp ?? entry?.time ?? entry?.createdAt ?? 0);
                const text = String(entry?.text ?? entry?.content ?? '').trim();
                if (!timestamp || !text) return null;
                if (timestamp > now + 5 * 60 * 1000 || now - timestamp > maxAgeMs) return null;
                const actor = entry?.actor === 'character' || entry?.role === 'assistant' ? 'character' : 'user';
                return {
                    actor,
                    actorLabel: String(entry?.actorLabel || (actor === 'user' ? '用户' : '角色')),
                    text,
                    timestamp
                };
            })
            .filter(Boolean)
            .sort((a, b) => a.timestamp - b.timestamp)
            .slice(-limit);
    }

    function buildHistorySection(adapter, entries, now = Date.now()) {
        const normalized = normalizeHistoryEntries(entries, adapter, now);
        if (normalized.length === 0) return null;
        const latestTimestamp = normalized[normalized.length - 1].timestamp;
        const lines = normalized.map(entry => {
            return '[' + formatLocalTimestamp(entry.timestamp) + ']'
                + '[' + getHistoryBand(entry.timestamp, now) + ']'
                + '[' + entry.actorLabel + '] ' + entry.text;
        });
        return {
            channelId: adapter.id,
            label: adapter.label,
            latestTimestamp,
            text: '<source app="' + adapter.id + '" label="' + adapter.label + '">\n'
                + '最近互动：' + describeTimeGap(latestTimestamp, now) + '\n'
                + lines.join('\n')
                + '\n</source>'
        };
    }

    function buildGapDirective(latestTimestamp, now = Date.now()) {
        if (!latestTimestamp) return '';
        const gapMs = Math.max(0, now - latestTimestamp);
        const gapText = describeTimeGap(latestTimestamp, now);
        if (gapMs > CROSS_APP_RECENT_BACKGROUND_MS) {
            return '时间间隔判断：最近一条跨 App 记录距今' + gapText + '。此前场景已经结束，不是实时连续场景；除非用户本轮明确提到或当前话题直接相关，否则禁止主动续接、追问、复述该旧话题。';
        }
        if (gapMs > CROSS_APP_CONTINUITY_MS) {
            return '时间间隔判断：最近一条跨 App 记录距今' + gapText + '。它只属于近期背景，不要当成刚刚发生，也不要无缘由继续上一段话题。';
        }
        return '时间间隔判断：最近一条跨 App 记录距今' + gapText + '。可以在当前话题确实自然衔接时参考，但它仍不是本轮新消息。';
    }

    function buildCrossAppContext(currentChannel, sections, now = Date.now()) {
        const validSections = sections.filter(Boolean);
        if (validSections.length === 0) return '';
        const latestTimestamp = Math.max(...validSections.map(section => section.latestTimestamp || 0));
        return [
            CROSS_APP_CONTEXT_TAG,
            '说明：以下内容来自其他 App 中已经发生的历史记录，用于共享关系事实与近期背景；它们不是当前 ' + currentChannel.label + ' 会话中的连续消息。',
            '当前时间：' + formatLocalTimestamp(now),
            buildGapDirective(latestTimestamp, now),
            '',
            validSections.map(section => section.text).join('\n\n'),
            '',
            '使用规则：',
            '1. 时间距离优先于文本顺序判断。标记为“历史”的内容默认视为已经结束的场景。',
            '2. 除非用户本轮明确提到、追问，或当前话题与旧记录直接相关，否则不要主动翻旧账、续接旧场景或重复追问。',
            '3. 可以继承已经发生的关系事实，但不要把旧消息描述成“刚刚”“刚才”或仍在实时进行。',
            '4. 这些记录只提供背景，不改变当前回复通道；回复必须留在当前 App，除非本轮明确要求切换通道。',
            '</cross_app_context>'
        ].filter(Boolean).join('\n');
    }

    function appendSystemBlock(payload, block, tag) {
        if (!block || !payload || !Array.isArray(payload.messages)) return false;
        const systemMessage = payload.messages.find(message => message?.role === 'system' && typeof message.content === 'string');
        if (!systemMessage) return false;
        if (tag && systemMessage.content.includes(tag)) return false;
        systemMessage.content = systemMessage.content + '\n\n' + block;
        return true;
    }

    function getSourceChannelIds(currentChannel) {
        if (Array.isArray(currentChannel.bridgeSources) && currentChannel.bridgeSources.length > 0) {
            return currentChannel.bridgeSources.filter(id => id !== currentChannel.id && channelAdapters.has(id));
        }
        if (currentChannel.id === 'wechat') {
            return Array.from(channelAdapters.values())
                .filter(adapter => adapter.id !== 'wechat' && adapter.bridgeWithWechat)
                .map(adapter => adapter.id);
        }
        if (currentChannel.bridgeWithWechat && channelAdapters.has('wechat')) return ['wechat'];
        return [];
    }

    async function loadSourceSections(currentChannel, payload, systemText, now = Date.now()) {
        const accountId = getCurrentAccountId();
        const identity = getRequestBridgeIdentity(systemText);
        if (identity && identity.accountId !== accountId) return [];
        if (currentChannel.id === 'meeting' && identity?.readOnline === false) return [];
        const contact = resolveCurrentWechatContact(systemText, currentChannel.id === 'meeting');
        const sourceIds = getSourceChannelIds(currentChannel);
        const sections = [];

        for (const sourceId of sourceIds) {
            // The meeting prompt already contains the same recent online transcript.
            if (currentChannel.id === 'meeting' && sourceId === 'wechat' && systemText.includes('<online_chat_context>')) continue;
            const adapter = channelAdapters.get(sourceId);
            if (!adapter) continue;
            try {
                const entries = await adapter.loadHistory({
                    currentChannel,
                    payload,
                    systemText,
                    contact,
                    now
                });
                if (accountId !== getCurrentAccountId()) return [];
                const section = buildHistorySection(adapter, entries, now);
                if (section) sections.push(section);
            } catch (error) {
                console.warn('Cross-app history load failed for ' + sourceId + ':', error);
            }
        }
        return sections;
    }

    function getUserName() {
        try {
            if (typeof appSettings !== 'undefined' && appSettings?.wc_current_user_name) {
                return String(appSettings.wc_current_user_name);
            }
        } catch (error) {}
        return 'User';
    }

    function buildWechatCurrentRule() {
        return '当前正在微信聊天。回复遵守本轮的微信输出协议，普通文字使用 chat 频道的 say 帧；仅在用户本轮明确要求使用短信、iMessage 或信息 App 时才使用 sms。不要仅因为跨 App 历史中出现过短信就切换通道。';
    }

    function buildSmsCurrentRule(payload) {
        const lastUser = [...payload.messages].reverse().find(message => message?.role === 'user');
        const lastUserText = contentToText(lastUser?.content);
        let identityRule = '';
        if (lastUserText.includes('[来自伪装号码')) {
            identityRule = ' 本轮短信使用了伪装号码/身份；请依据该伪装身份及其描述互动，不要仅因为共享历史存在就自动认定为真实用户，除非对话中已有合理识破依据。';
        } else if (lastUserText.includes('[短信]')) {
            identityRule = ' 本轮短信来自用户真实主号，对方就是“' + getUserName() + '”，与微信中的 User 是同一个人，不要当成陌生号码。';
        }
        return '当前正在手机短信（iMessage）中聊天。微信与短信可以共享已经发生的关系事实，但界面和消息记录保持独立；回复必须留在短信。' + identityRule;
    }

    function isMeetingRequest(systemText) {
        const text = String(systemText || '');
        return getRequestBridgeIdentity(text)?.channel === 'meeting' || text.includes('<meeting_identity>')
            || (text.includes('<core_rules>') && text.includes('线下相见'));
    }

    function buildMeetingCurrentRule({ systemText } = {}) {
        const mode = getRequestBridgeIdentity(systemText)?.mode || 'normal';
        const scene = mode === 'dream' ? '当前是梦境场景，梦中事件不等于现实事实。'
            : mode === 'if' ? '当前是独立 IF 线，剧情不等于现实微信主线的事实。'
                : '当前正在同一现实主线中的线下见面。';
        return scene + '微信中的近期聊天只作为带时间的背景；不要把它当成当前线上对话，也不要把回复写成微信消息。是否继承线上经历以及回写记忆，以当前故事的读取、同步开关为准。';
    }

    async function bridgePayload(payload, systemText) {
        const currentChannel = resolveCurrentChannel(systemText);
        if (!currentChannel) return false;

        removeForeignLegacyMessages(payload, currentChannel.id);

        const now = Date.now();
        const sections = await loadSourceSections(currentChannel, payload, systemText, now);
        const contextBlock = buildCrossAppContext(currentChannel, sections, now);
        if (contextBlock) appendSystemBlock(payload, contextBlock, CROSS_APP_CONTEXT_TAG);

        let specificRule = '';
        try {
            specificRule = typeof currentChannel.currentRule === 'function'
                ? currentChannel.currentRule({ payload, systemText, now })
                : String(currentChannel.currentRule || '');
        } catch (error) {
            console.warn('Cross-app current-channel rule failed for ' + currentChannel.id + ':', error);
        }

        const ruleBlock = [
            CROSS_APP_RULES_TAG,
            '跨 App 通道规则：跨 App 历史只作为带时间的背景资料，不属于当前连续对话。旧记录不能因为被注入就自动成为当前话题。',
            specificRule,
            '</cross_app_channel_rules>'
        ].filter(Boolean).join('\n');
        appendSystemBlock(payload, ruleBlock, CROSS_APP_RULES_TAG);
        publishCrossAppTokenDiagnostics(currentChannel, sections, contextBlock, ruleBlock);
        return true;
    }

    function isWechatChatRequest(systemText) {
        const text = String(systemText || '');
        return getRequestBridgeIdentity(text)?.channel === 'wechat' || (!text.includes(smsMarker)
            && text.includes('<char_settings>')
            && (text.includes('"type":"sms"') || text.includes('发短信:')));
    }

    function installFetchBridge() {
        if (typeof window.fetch !== 'function' || window.fetch.__tonghuajiCrossAppBridge) return;
        const previousFetch = window.fetch.bind(window);

        const wrappedFetch = async (input, init) => {
            const method = String(init?.method || input?.method || 'GET').toUpperCase();
            if (method !== 'POST' || !init || typeof init.body !== 'string') {
                return previousFetch(input, init);
            }

            let payload = null;
            try {
                payload = JSON.parse(init.body);
            } catch (error) {
                return previousFetch(input, init);
            }
            if (!payload || !Array.isArray(payload.messages) || payload.messages.length === 0) {
                return previousFetch(input, init);
            }

            const firstSystem = payload.messages.find(message => message?.role === 'system' && typeof message.content === 'string');
            if (!firstSystem) return previousFetch(input, init);
            // Semantic prompt blocks are separate system messages in modern presets.
            const systemText = payload.messages.filter(message => message?.role === 'system')
                .map(message => contentToText(message.content)).filter(Boolean).join('\n\n');
            let changed = false;

            try {
                changed = await bridgePayload(payload, systemText);
            } catch (error) {
                console.warn('跨 App 上下文桥接失败，已回退原请求:', error);
            }

            if (!changed) return previousFetch(input, init);
            return previousFetch(input, { ...init, body: JSON.stringify(payload) });
        };

        Object.defineProperty(wrappedFetch, '__tonghuajiCrossAppBridge', { value: true });
        window.fetch = wrappedFetch;
    }

    function watchAccountChanges() {
        const check = () => {
            const accountId = getCurrentAccountId();
            if (!accountId) {
                activeAccountId = '';
                window.messageAppData = normalizeSmsRecord(null);
                return;
            }
            if (accountId !== activeAccountId) {
                refreshSmsCache(true).catch(() => {});
            }
        };
        check();
        window.addEventListener('wechat:account-changed', check);
        document.addEventListener('visibilitychange', () => {
            if (!document.hidden) check();
        });
    }

    registerChannel({
        id: 'wechat',
        label: '微信',
        priority: 10,
        bridgeWithWechat: false,
        legacyMarkers: ['[微信]'],
        detectRequest: isWechatChatRequest,
        loadHistory: async ({ contact, now, currentChannel, systemText }) => {
            if (currentChannel?.id === 'wechat-group') {
                if (!getGroupBridgeIdentity(systemText)?.allowPrivate) return [];
                return contact ? readWechatHistory(contact.id, now).then(items => items.slice(-4)) : [];
            }
            return contact ? readWechatHistory(contact.id, now) : [];
        },
        currentRule: buildWechatCurrentRule
    });

    registerChannel({
        id: 'wechat-group',
        label: '微信群聊',
        priority: 95,
        bridgeWithWechat: true,
        bridgeSources: ['wechat'],
        maxAgeMs: 3 * 24 * 60 * 60 * 1000,
        limit: 4,
        detectRequest: systemText => Boolean(getGroupBridgeIdentity(systemText)),
        loadHistory: async ({ contact, now }) => contact ? readGroupHistoryForWechat(contact.id, now) : [],
        currentRule: () => '当前是群聊，只能以当前发言成员身份回复群内公开消息。只有群主显式允许时才可参考自己与用户的近期私聊；即使允许，也不能未经用户同意在群内公开私聊原文、敏感细节或私人秘密。绝不能泄露其他成员的私聊和内心。'
    });

    registerChannel({
        id: 'sms',
        label: '手机短信（iMessage）',
        priority: 100,
        bridgeWithWechat: true,
        legacyMarkers: ['[短信]', '[来自伪装号码'],
        detectRequest: systemText => String(systemText || '').includes(smsMarker),
        loadHistory: async ({ contact, now }) => {
            const smsData = await refreshSmsCache(false);
            return buildSmsHistory(smsData, contact, now);
        },
        currentRule: ({ payload }) => buildSmsCurrentRule(payload),
        refresh: () => refreshSmsCache(true)
    });

    registerChannel({
        id: 'meeting',
        label: '线下见面',
        priority: 80,
        bridgeWithWechat: true,
        maxAgeMs: CROSS_APP_HISTORY_MAX_AGE_MS,
        limit: CROSS_APP_HISTORY_LIMIT,
        legacyMarkers: [],
        detectRequest: isMeetingRequest,
        loadHistory: async ({ contact, now }) => {
            if (!contact || typeof window.getMeetingRecentBridgeHistory !== 'function') return [];
            return window.getMeetingRecentBridgeHistory(contact.id, now);
        },
        currentRule: buildMeetingCurrentRule
    });

    // Co-reading in the reading app: the character's annotations and chapter reflections, and the book
    // being read together. Only records created under the current WeChat account are shared, and the
    // reading app is never a reply channel itself.
    const READING_BRIDGE_MAX_AGE_MS = 30 * 24 * 60 * 60 * 1000;

    function clipBridgeText(value, limit) {
        const text = String(value || '').replace(/\s+/g, ' ').trim();
        return text.length > limit ? text.slice(0, limit - 1) + '…' : text;
    }

    async function readReadingBooks() {
        try {
            if (window.readenAppDataReady && typeof window.readenAppDataReady.then === 'function') {
                await Promise.race([window.readenAppDataReady, new Promise(resolve => setTimeout(resolve, 1500))]);
            }
        } catch (error) {}
        try {
            if (typeof readenBooksData !== 'undefined' && Array.isArray(readenBooksData)) return readenBooksData;
        } catch (error) {}
        const record = await readLayoutRecord('readenAppData');
        return Array.isArray(record?.data?.books) ? record.data.books : [];
    }

    async function readReadingHistoryForWechat(contact) {
        if (!contact) return [];
        const accountId = getCurrentAccountId();
        const ids = new Set([contact.id, contact.linkedContactId].filter(Boolean).map(String));
        const matchesContact = item => ids.has(String(item?.contactId || ''))
            || Boolean(item?.linkedContactId && ids.has(String(item.linkedContactId)));
        const books = await readReadingBooks();
        const entries = [];
        books.forEach(book => {
            const title = clipBridgeText(book?.title || '未命名书籍', 40);
            let sharedCount = 0;
            (Array.isArray(book?.annotations) ? book.annotations : []).forEach(annotation => {
                if (!annotation || annotation.status === 'deleted' || annotation.authorType !== 'character') return;
                // Records without an account (made before this bridge existed) stay inside the reading app.
                if (typeof annotation.accountId !== 'string' || annotation.accountId !== accountId) return;
                if (!matchesContact(annotation)) return;
                const chapterTitle = clipBridgeText(annotation.chapter?.title || '', 30);
                if (annotation.kind === 'chapter_reflection') {
                    entries.push({ actor: 'character', actorLabel: '阅读共读·《' + title + '》' + chapterTitle + ' 章末感想',
                        text: clipBridgeText(annotation.content, 180), timestamp: annotation.createdAt });
                    sharedCount += 1;
                } else if (annotation.kind === 'character_annotation') {
                    entries.push({ actor: 'character', actorLabel: '阅读共读·《' + title + '》' + chapterTitle + ' 批注',
                        text: '对原文「' + clipBridgeText(annotation.anchor?.quote, 40) + '」：' + clipBridgeText(annotation.content, 140),
                        timestamp: annotation.createdAt });
                    sharedCount += 1;
                }
            });
            const coReading = book?.coReading;
            if (sharedCount > 0 && coReading?.enabled && matchesContact(coReading)) {
                const chapters = Array.isArray(book.chapters) ? book.chapters : [];
                const chapterIndex = Math.max(0, Number(book.currentChapterIndex) || 0);
                const chapterTitle = clipBridgeText(chapters[chapterIndex]?.title || ('第' + (chapterIndex + 1) + '章'), 30);
                entries.push({ actor: 'user', actorLabel: '阅读共读·进度',
                    text: '用户正在和你一起读《' + title + '》，目前读到' + chapterTitle + '（共 ' + (chapters.length || 1) + ' 章）。不要剧透后面的内容。',
                    timestamp: book.lastReadTime || coReading.updatedAt });
            }
        });
        return entries;
    }

    registerChannel({
        id: 'reading',
        label: '阅读共读',
        priority: 0,
        bridgeWithWechat: true,
        maxAgeMs: READING_BRIDGE_MAX_AGE_MS,
        limit: 6,
        legacyMarkers: [],
        detectRequest: () => false,
        loadHistory: async ({ contact }) => readReadingHistoryForWechat(contact)
    });

    async function refreshChannel(id = 'sms') {
        const adapter = channelAdapters.get(normalizeKey(id));
        if (!adapter?.refresh) return null;
        return adapter.refresh();
    }

    const publicApi = Object.freeze({
        __tonghuajiCrossAppBridge: true,
        registerChannel,
        unregisterChannel,
        refresh: refreshChannel,
        getAccountId: getCurrentAccountId,
        getChannels: () => Array.from(channelAdapters.values()).map(adapter => ({
            id: adapter.id,
            label: adapter.label,
            bridgeWithWechat: adapter.bridgeWithWechat,
            priority: adapter.priority
        }))
    });

    window.CrossAppBridge = publicApi;
    window.MessageWechatBridge = publicApi;

    installFetchBridge();
    watchAccountChanges();
})();
