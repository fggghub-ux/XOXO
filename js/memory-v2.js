(function () {
    'use strict';

    if (window.MemoryV2?.__unifiedEngine) return;

    const DB_NAME = 'iOSDesktopDB';
    const STORE_NAME = 'layoutStore';
    const MEMORY_ITEMS_KEY = 'memoryItemsV1';
    const MEMORY_SUMMARIES_KEY = 'memorySummariesV1';
    const EVENT_NODES_KEY = 'memoryEventNodesV1';
    const CONTACTS_KEY = 'wechatContactsData';
    const CONTACTS_APP_KEY = 'contactsAppData';
    const CHATS_KEY = 'wechatChatData';
    const MIGRATION_KEY = 'memoryEngineV2Migration';
    const LEGACY_MIGRATION_BACKUP_KEY = 'memoryLegacyMigrationBackupV1';
    const SCHEMA_VERSION = 10;
    const SUBJECT_KINDS = new Set(['user', 'character', 'shared', 'unknown']);
    const AI_MEMORY_TYPES = new Set(['fact', 'preference', 'habit', 'relationship', 'promise', 'plan', 'event', 'emotion', 'fragment']);
    const AI_REVIEW_BATCH_SIZE = 6;
    const AI_REVIEW_MIN_CONFIDENCE = 0.72;
    const UNRESOLVED_TYPES = new Set(['plan', 'promise']);
    const DORMANT_EVENT_DAYS = 45;
    const AWAKENED_ACTIVE_DAYS = 7;
    const DUE_SOON_MS = 36 * 60 * 60 * 1000;
    const DUE_RECENTLY_MS = 18 * 60 * 60 * 1000;
    const SUMMARY_INDEX_LIMIT = 3;
    const SUMMARY_EVIDENCE_LIMIT = 4;
    const SEMANTIC_INDEX_KEY = 'memoryV2SemanticIndexV1';
    const SEMANTIC_TEXT_REVISION = 'record-segments-v1';
    const SEMANTIC_MIN_COSINE = 0.51;
    const SENSITIVE_AUTO_MEMORY = /(过敏|疾病|病史|诊断|药物|医院|怀孕|流产|住址|地址|身份证|银行卡|工资|收入|债务|欠债|性经历|创伤|自杀)/i;
    const COMPLETE_MARKER = /(做完|完成了?|搞定|办完|考完|结束了|已经去了|已经见到|兑现|处理完)/;
    const CANCEL_MARKER = /(取消了?|不去了|不做了|算了|改天|不用了|不打算|不准备了)/;
    const EVENT_SIGNAL = /(今天|今晚|明天|后天|昨天|刚刚|上次|周末|下周|下个月|考试|考完|作业|论文|见面|见到|约好|约定|计划|准备|打算|答应|承诺|发生|吵架|去了|回来|开始|结束|完成|取消|出发|到达|旅行|面试|上课|放假|搬家|收到|买了|聚会)/;
    const EVENT_OBSERVATION_LIMIT = 24;
    const EVENT_NODE_RELEVANCE_THRESHOLD = 13;
    const EVENT_ARCHIVE_DAYS = 180;
    const EVENT_MAX_ACTIVE_RESOLVED = 160;
    const MANUAL_RELATIONSHIP_NODE_PREFIX = 'event_manual_relationship_';
    const runtimeActivation = new Map();
    const eventRuntimeActivation = new Map();
    const turnBindings = new Map();
    let semanticIndex = { account: '', version: '', loaded: false, entries: [], loading: null, running: false, scheduled: false, retryAt: 0 };
    const semanticQueryCache = new Map();
    const semanticVectorRequests = new Map();
    let eventNodeMutationPromise = Promise.resolve();

    const ENTITY_PATTERNS = [
        ['entity:user:mother', /(我妈|妈妈|母亲|老妈|妈咪)/],
        ['entity:user:father', /(我爸|爸爸|父亲|老爸|爹)/],
        ['entity:user:parents', /(父母|爸妈|家长)/],
        ['entity:user:roommate', /(室友|舍友)/],
        ['entity:user:teacher', /(老师|导师|班主任|教授)/],
        ['entity:user:classmate', /(同学|同桌)/],
        ['entity:user:friend', /(朋友|闺蜜|兄弟|好友)/],
        ['entity:user:boss', /(老板|上司|领导)/],
        ['entity:user:colleague', /(同事|同僚)/],
        ['entity:user:sibling', /(姐姐|妹妹|哥哥|弟弟|姐|妹|哥|弟)/],
        ['entity:user:grandparent', /(奶奶|爷爷|外婆|外公|姥姥|姥爷)/],
        ['entity:user:cat', /(猫咪|小猫|猫猫|猫)/],
        ['entity:user:dog', /(狗狗|小狗|狗)/]
    ];

    const state = {
        installed: false,
        migrating: false,
        migrationPromise: null,
        items: [],
        summaries: [],
        eventNodes: [],
        contacts: new Map(),
        addressBookContacts: new Map(),
        userMasks: new Map(),
        conversations: {},
        userId: '',
        lastMigration: null,
        lastConsolidation: null,
        lastLifecycleUpdate: null,
        lastWake: null,
        lastEventNode: null,
        lastEvaluation: null
    };

    function normalizeText(value) {
        return String(value || '').replace(/\s+/g, ' ').trim();
    }

    function getSettings() {
        if (typeof appSettings !== 'undefined' && appSettings) return appSettings;
        if (typeof window.appSettings !== 'undefined' && window.appSettings) return window.appSettings;
        return null;
    }

    function getDynamicUserId() {
        return String(getSettings()?.wc_current_user_id || 'default');
    }

    function getIsolatedKey(key) {
        return key + '_' + getDynamicUserId();
    }

    function openStore() {
        return new Promise((resolve) => {
            const request = indexedDB.open(DB_NAME);
            request.onerror = () => resolve(null);
            request.onsuccess = () => {
                const database = request.result;
                if (!database.objectStoreNames.contains(STORE_NAME)) {
                    database.close();
                    resolve(null);
                    return;
                }
                resolve(database);
            };
        });
    }

    async function readRecords(keys, options = {}) {
        const accountId = getDynamicUserId();
        const database = await openStore();
        if (!database) throw new Error('MEMORY_STORAGE_READ_FAILED');
        return new Promise((resolve, reject) => {
            const output = {};
            const transaction = database.transaction(STORE_NAME, 'readonly');
            const store = (window.CharacterRecordCleanup?.wrap(transaction.objectStore(STORE_NAME)) || transaction.objectStore(STORE_NAME));
            keys.forEach((logicalKey) => {
                const isolatedKey = options.exact ? logicalKey : logicalKey + '_' + accountId;
                const request = store.get(isolatedKey);
                request.onsuccess = () => {
                    if (request.result || options.exact) {
                        output[logicalKey] = request.result;
                        return;
                    }
                    if (logicalKey.startsWith('memory')) { output[logicalKey] = null; return; }
                    const legacyRequest = store.get(logicalKey);
                    legacyRequest.onsuccess = () => { output[logicalKey] = legacyRequest.result || null; };
                    legacyRequest.onerror = () => { output[logicalKey] = null; };
                };
                request.onerror = () => { output[logicalKey] = null; };
            });
            transaction.oncomplete = () => { database.close(); resolve(output); };
            transaction.onabort = transaction.onerror = () => { database.close(); reject(new Error('MEMORY_STORAGE_READ_FAILED')); };
        });
    }

    async function writeMemoryItems(items, accountId = getDynamicUserId()) {
        return writeRecords([{ id: MEMORY_ITEMS_KEY + '_' + accountId, schemaVersion: SCHEMA_VERSION, items }], { accountId });
    }

    async function writeEventNodes(nodes) {
        return writeRecords([{ id: getIsolatedKey(EVENT_NODES_KEY), schemaVersion: SCHEMA_VERSION, items: nodes }]);
    }

    function queueEventNodeMutation(work) {
        const run = eventNodeMutationPromise.then(work, work);
        eventNodeMutationPromise = run.catch(() => null);
        return run;
    }

    async function writeRecords(records, options = {}) {
        const accountId = options.accountId || getDynamicUserId();
        const storage = window.MemoryApp?.storage;
        if (!storage || accountId !== getDynamicUserId()) return false;
        const expected = options.expected || new Map();
        if (!options.expected) {
            for (const [key, items] of [[MEMORY_ITEMS_KEY, state.items], [MEMORY_SUMMARIES_KEY, state.summaries], [EVENT_NODES_KEY, state.eventNodes]]) {
                const id = key + '_' + accountId;
                if (records.some(record => record?.id === id)) expected.set(id, storage.arrayVersion(items));
            }
        }
        return storage.write(records.filter(Boolean), { accountId, expected });
    }

    function getConversations(record) {
        if (!record || typeof record !== 'object') return {};
        const value = record.conversations || record.messages;
        return value && typeof value === 'object' ? value : {};
    }

    function getContacts(record) {
        return Array.isArray(record?.contacts) ? record.contacts.filter((contact) => contact && contact.id) : [];
    }

    function getAddressBookContacts(record) {
        return Array.isArray(record?.data?.contacts) ? record.data.contacts.filter((contact) => contact && contact.id) : [];
    }

    function getUserMasks(record) {
        return Array.isArray(record?.data?.users) ? record.data.users.filter((user) => user && user.id) : [];
    }

    function getMessageActor(message) {
        if (!message || typeof message !== 'object') return '';
        const rawType = String(message.type || '').toLowerCase();
        const rawRole = String(message.role || message.senderRole || message.authorRole || '').toLowerCase();
        if (rawType === 'sent' || rawRole === 'user' || rawRole === 'sender' || message.isUser === true || message.fromMe === true || message.sentByUser === true) return 'user';
        if (rawType === 'received' || rawRole === 'assistant' || rawRole === 'character' || rawRole === 'receiver' || message.isUser === false || message.fromMe === false || message.sentByUser === false) return 'character';
        return '';
    }

    function getSourceActors(item, conversations) {
        const refs = Array.isArray(item?.sourceRefs) ? item.sourceRefs : [];
        const messages = Array.isArray(conversations?.[item?.bindingId]) ? conversations[item.bindingId] : [];
        if (!refs.length || !messages.length) return [];
        const byId = new Map(messages.map((message) => [String(message?.id || message?.msgId || message?.localId || ''), message]));
        return refs.map((ref) => byId.get(String(ref?.messageId || ''))).filter(Boolean).map(getMessageActor).filter(Boolean);
    }

    function createTerms(value) {
        const text = normalizeText(value).toLowerCase();
        const terms = new Set();
        const stop = new Set(['我们', '你们', '他们', '这个', '那个', '就是', '因为', '所以', '还是', '已经', '可以', '不是', '没有', '一个', '什么', '怎么', '现在', '今天', '真的', '感觉', '知道', '觉得', '然后']);
        (text.match(/[a-z0-9]{2,}/g) || []).forEach((term) => terms.add(term));
        (text.match(/[\u4e00-\u9fff]+/g) || []).forEach((block) => {
            for (let index = 0; index < block.length - 1; index += 1) {
                const term = block.slice(index, index + 2);
                if (!stop.has(term)) terms.add(term);
            }
        });
        return Array.from(terms).slice(0, 48);
    }

    function getDisplayNames(bindingId) {
        const id = String(bindingId || '');
        const wcContact = state.contacts.get(id);
        const linkedId = String(wcContact?.linkedContactId || '');
        const addressContact = (linkedId && state.addressBookContacts.get(linkedId))
            || state.addressBookContacts.get(id)
            || null;
        const maskId = getDynamicUserId();
        const userMask = state.userMasks.get(maskId) || null;
        return {
            user: normalizeText(userMask?.name) || normalizeText(getSettings()?.wc_current_user_name) || '用户',
            character: normalizeText(addressContact?.name) || normalizeText(wcContact?.name) || '角色'
        };
    }

    function extractNamedEntities(text) {
        const content = normalizeText(text);
        const names = new Set();
        const patterns = [/(?:叫|名叫|名字是)([\u4e00-\u9fff]{2,4})/g, /(?:室友|舍友|朋友|闺蜜|同学|同事|老师|导师|老板|上司)([\u4e00-\u9fff]{2,4})(?=[，。！？、\s]|$)/g];
        patterns.forEach((pattern) => {
            let match;
            while ((match = pattern.exec(content))) names.add(match[1]);
        });
        return Array.from(names).slice(0, 8);
    }

    function getKnownNamedEntityIds(bindingId) {
        const prefix = 'entity:name:';
        const ids = new Set();
        state.items.forEach((item) => {
            if (!item || item.bindingId !== bindingId) return;
            (Array.isArray(item?.v2?.entityIds) ? item.v2.entityIds : []).forEach((id) => {
                if (String(id).startsWith(prefix)) ids.add(String(id));
            });
        });
        return Array.from(ids);
    }

    function extractEntityIds(bindingId, text) {
        const content = normalizeText(text);
        if (!content) return [];
        const ids = new Set();
        const names = getDisplayNames(bindingId);
        ENTITY_PATTERNS.forEach(([id, pattern]) => { if (pattern.test(content)) ids.add(id); });
        if (names.character !== '角色' && content.includes(names.character)) ids.add('character:' + bindingId);
        if (names.user !== '用户' && content.includes(names.user)) ids.add('user:self');
        extractNamedEntities(content).forEach((name) => ids.add('entity:name:' + name));
        getKnownNamedEntityIds(bindingId).forEach((id) => {
            const name = id.slice('entity:name:'.length);
            if (name && content.includes(name)) ids.add(id);
        });
        return Array.from(ids);
    }

    function enrichKnownNamedEntities(items) {
        const namesByBinding = new Map();
        (Array.isArray(items) ? items : []).forEach((item) => {
            if (!item?.bindingId) return;
            const names = (Array.isArray(item?.v2?.entityIds) ? item.v2.entityIds : []).filter((id) => String(id).startsWith('entity:name:'));
            if (!names.length) return;
            if (!namesByBinding.has(item.bindingId)) namesByBinding.set(item.bindingId, new Set());
            names.forEach((id) => namesByBinding.get(item.bindingId).add(String(id)));
        });
        return (Array.isArray(items) ? items : []).map((item) => {
            if (!item?.bindingId || !item?.v2) return item;
            const known = namesByBinding.get(item.bindingId);
            if (!known?.size) return item;
            const before = Array.isArray(item.v2.entityIds) ? item.v2.entityIds : [];
            const entityIds = new Set(before);
            known.forEach((id) => {
                const name = id.slice('entity:name:'.length);
                if (name && normalizeText(item.content).includes(name)) entityIds.add(id);
            });
            if (entityIds.size === before.length) return item;
            return { ...item, v2: { ...item.v2, entityIds: Array.from(entityIds) } };
        });
    }

    function buildEntityGraph(bindingId) {
        const nodes = new Map();
        const edges = new Map();
        state.items.filter((item) => item && item.bindingId === bindingId && item.status === 'active').forEach((item) => {
            const ids = Array.from(new Set((Array.isArray(item?.v2?.entityIds) ? item.v2.entityIds : []).filter((id) => String(id).startsWith('entity:'))));
            ids.forEach((id) => {
                if (!nodes.has(id)) nodes.set(id, { id, weight: 0, memoryIds: new Set(), memoryTypes: new Set() });
                const node = nodes.get(id);
                node.weight += 1;
                node.memoryIds.add(item.id);
                if (item?.v2?.memoryType) node.memoryTypes.add(item.v2.memoryType);
            });
            for (let left = 0; left < ids.length; left += 1) {
                for (let right = left + 1; right < ids.length; right += 1) {
                    const pair = [ids[left], ids[right]].sort();
                    const key = pair.join('|');
                    if (!edges.has(key)) edges.set(key, { from: pair[0], to: pair[1], weight: 0, memoryIds: new Set() });
                    const edge = edges.get(key);
                    edge.weight += 1;
                    edge.memoryIds.add(item.id);
                }
            }
        });
        return {
            bindingId,
            nodes: Array.from(nodes.values()).map((node) => ({ ...node, memoryIds: Array.from(node.memoryIds), memoryTypes: Array.from(node.memoryTypes) })),
            edges: Array.from(edges.values()).map((edge) => ({ ...edge, memoryIds: Array.from(edge.memoryIds) }))
        };
    }

    function getGraphNeighborWeights(bindingId, directIds) {
        const direct = new Set(directIds || []);
        const weights = new Map();
        buildEntityGraph(bindingId).edges.forEach((edge) => {
            if (direct.has(edge.from) && !direct.has(edge.to)) weights.set(edge.to, Math.max(weights.get(edge.to) || 0, edge.weight));
            if (direct.has(edge.to) && !direct.has(edge.from)) weights.set(edge.from, Math.max(weights.get(edge.from) || 0, edge.weight));
        });
        return weights;
    }

    function classifyMemoryType(item) {
        const content = normalizeText(item?.content);
        const lifecycle = item?.lifecycle || {};
        if (item?.kind === 'summary' || item?.tier === 'L2') return 'summary';
        if (/答应|承诺|说好|约定|保证/.test(content)) return 'promise';
        if (/计划|准备|打算|明天|后天|周末|下周|下个月|到时候|等会|待会/.test(content)) return 'plan';
        if (/不喜欢|喜欢|不爱吃|爱吃|讨厌|偏好|最爱|最喜欢/.test(content)) return 'preference';
        if (/每天|经常|通常|习惯|总是|一直|每次/.test(content)) return 'habit';
        if (/恋人|情侣|分手|复合|同居|订婚|结婚|关系|朋友|家人|在一起|对象/.test(content)) return 'relationship';
        if (/焦虑|紧张|难过|生气|开心|害怕|担心|委屈|失落|想念|情绪/.test(content)) return 'emotion';
        if (/我(?:才|已经|今年)?(?:是|叫|读|学|工作|来自|大[一二三四]|高[一二三]|初[一二三])/.test(content)) return 'fact';
        if (lifecycle.kind === 'event' || /昨天|今天|刚刚|上次|那次|曾经|发生|去了|一起|见面/.test(content)) return 'event';
        return item?.kind === 'fragment' ? 'fragment' : 'fact';
    }

    function inferIdentity(item, contacts, conversations) {
        const bindingId = String(item?.bindingId || '');
        const prior = item?.v2 && typeof item.v2 === 'object' ? item.v2 : null;
        if (prior?.identityLocked === true && SUBJECT_KINDS.has(prior.subjectKind)) return { subjectKind: prior.subjectKind, subjectId: prior.subjectId || (prior.subjectKind === 'user' ? 'user:self' : prior.subjectKind + ':' + bindingId), confidence: 1, source: 'identity_locked' };
        const contact = contacts.get(bindingId);
        const characterName = normalizeText(contact?.remark || contact?.name);
        const userName = normalizeText(getSettings()?.wc_current_user_name);
        const explicitKind = { character: 'character', character_persona: 'character', user_persona: 'user', user: 'user', shared: 'shared', shared_experience: 'shared' }[item?.subjectType];
        if (explicitKind && ['summary_verified', 'user_confirmed', 'user_quote'].includes(item?.authority)) {
            return { subjectKind: explicitKind, subjectId: subjectIdForKind(bindingId, explicitKind), confidence: 0.95, source: 'verified_subject' };
        }
        const actors = new Set(getSourceActors(item, conversations));
        if (prior?.identitySource === 'ai_assisted' && SUBJECT_KINDS.has(prior.subjectKind) && prior.subjectKind !== 'unknown' && Number(prior.identityConfidence) >= AI_REVIEW_MIN_CONFIDENCE) return { subjectKind: prior.subjectKind, subjectId: prior.subjectId || subjectIdForKind(bindingId, prior.subjectKind), confidence: Number(prior.identityConfidence), source: 'ai_assisted' };
        const content = normalizeText(item?.content);
        const sourceIds = new Set((item?.sourceRefs || []).map(ref => String(ref?.messageId || '')));
        const directFirstPersonQuote = item?.authority === 'user_quote' && /^我(?:是|在|才|不|没|很|喜欢|讨厌|想|要|会|能|有|已经|正在|准备)/.test(content)
            && (conversations[bindingId] || []).some(message => sourceIds.has(String(message?.id || message?.msgId || message?.localId || '')) && normalizeText(message.text) === content);
        if (directFirstPersonQuote && actors.size === 1) {
            const subjectKind = [...actors][0];
            return { subjectKind, subjectId: subjectIdForKind(bindingId, subjectKind), confidence: 0.95, source: 'direct_first_person_quote' };
        }
        if (item?.subjectType === 'character_persona') return { subjectKind: 'character', subjectId: 'character:' + bindingId, confidence: 0.9, source: 'legacy_character_subject' };
        if (characterName && content.includes(characterName)) return { subjectKind: 'character', subjectId: 'character:' + bindingId, confidence: 0.92, source: 'explicit_character_name' };
        if (userName && content.includes(userName)) return { subjectKind: 'user', subjectId: 'user:self', confidence: 0.92, source: 'explicit_user_name' };
        if (item?.authority === 'summary_verified') return { subjectKind: 'shared', subjectId: 'shared:' + bindingId, confidence: 0.72, source: 'verified_summary' };
        const sourceType = String(item?.sourceRefs?.[0]?.type || '');
        const firstPerson = /(^|[，。！？、\s])(我|我的|本人|咱)(?=$|[，。！？、\s]|[\u4e00-\u9fff])/.test(content);
        const thirdPerson = /(^|[，。！？、\s])(他|她|对方|角色)(?=$|[，。！？、\s]|[\u4e00-\u9fff])/.test(content);
        if ((sourceType === 'manual' || sourceType === 'manual_edit' || item?.authority === 'user_confirmed') && firstPerson) return { subjectKind: 'user', subjectId: 'user:self', confidence: 0.9, source: 'manual_first_person' };
        if (item?.tier === 'L1' && item?.authority === 'user_quote') return { subjectKind: 'user', subjectId: 'user:self', confidence: 0.9, source: 'legacy_user_quote' };
        if (sourceType === 'manual' || sourceType === 'manual_edit' || item?.authority === 'user_confirmed') {
            if (thirdPerson) return { subjectKind: 'unknown', subjectId: 'unknown', confidence: 0.35, source: 'ambiguous_manual_third_person' };
            return { subjectKind: 'user', subjectId: 'user:self', confidence: 0.72, source: 'manual_user_entry' };
        }
        return { subjectKind: 'unknown', subjectId: 'unknown', confidence: 0.2, source: 'insufficient_evidence' };
    }

    function importanceFor(item, memoryType) {
        if (item?.authority === 'user_confirmed') return 0.98;
        if (memoryType === 'relationship' || memoryType === 'promise') return 0.9;
        if (memoryType === 'plan') return 0.84;
        if (item?.tier === 'L1') return 0.78;
        if (item?.tier === 'L2') return 0.68;
        return 0.42;
    }

    function stabilityFor(item, memoryType) {
        if (item?.lifecycle?.kind === 'stable' || ['preference', 'habit', 'fact', 'relationship'].includes(memoryType)) return 'stable';
        if (UNRESOLVED_TYPES.has(memoryType)) return 'until_resolved';
        return 'temporary';
    }

    function inferDueAt(item) {
        const type = item?.v2?.memoryType || item?.memoryType;
        if (!UNRESOLVED_TYPES.has(type)) return 0;
        const content = normalizeText(item?.content);
        const baseTime = Date.parse(item?.createdAt || item?.updatedAt || '') || Date.now();
        const base = new Date(baseTime);
        const atLocal = (offset, hour = 9) => {
            const date = new Date(baseTime);
            date.setHours(hour, 0, 0, 0);
            date.setDate(date.getDate() + offset);
            return date.getTime();
        };
        const fullDate = content.match(/(20\d{2})年(\d{1,2})月(\d{1,2})日/);
        if (fullDate) return new Date(Number(fullDate[1]), Number(fullDate[2]) - 1, Number(fullDate[3]), 9, 0, 0, 0).getTime();
        const monthDay = content.match(/(?:^|\D)(\d{1,2})月(\d{1,2})日/);
        if (monthDay) {
            let date = new Date(base.getFullYear(), Number(monthDay[1]) - 1, Number(monthDay[2]), 9, 0, 0, 0);
            if (date.getTime() < baseTime - 86400000) date = new Date(base.getFullYear() + 1, Number(monthDay[1]) - 1, Number(monthDay[2]), 9, 0, 0, 0);
            return date.getTime();
        }
        if (/后天/.test(content)) return atLocal(2);
        if (/明天|明早|明晚/.test(content)) return atLocal(1, /明晚/.test(content) ? 19 : 9);
        if (/今天|今晚/.test(content)) return atLocal(0, /今晚/.test(content) ? 19 : 12);
        if (/周末/.test(content)) {
            const daysUntilSaturday = (6 - base.getDay() + 7) % 7 || 7;
            return atLocal(daysUntilSaturday, 10);
        }
        return 0;
    }

    function normalizeEventText(value) {
        return normalizeText(value)
            .replace(/考完(?:试)?/g, '考试')
            .replace(/见到了?|见着了?|碰见了?/g, '见面')
            .replace(/做完了?|完成了?|搞定了?|办完了?|处理完了?/g, '完成')
            .replace(/取消了?|不去了|不做了|算了|不用了|改天/g, '取消')
            .replace(/已经/g, '');
    }

    function getEventTerms(value) {
        const generic = new Set(['今天', '明天', '后天', '昨天', '周末', '下周', '计划', '准备', '打算', '完成', '取消']);
        return createTerms(normalizeEventText(value)).filter((term) => !generic.has(term)).slice(0, 32);
    }

    function getEventTopicAnchors(value) {
        const content = normalizeEventText(value);
        const anchors = new Set();
        const rules = [
            ['exam', /(考试|考研|考公|考证|测验|笔试|面试考试)/],
            ['homework', /(作业|功课|练习题|课程作业)/],
            ['paper', /(论文|毕业论文|开题|答辩)/],
            ['meeting', /(见面|约会|碰面|会面)/],
            ['travel', /(旅行|旅游|出发|到达|航班|高铁|火车|酒店)/],
            ['class', /(上课|课程|课堂|补课)/],
            ['move', /(搬家|搬宿舍|搬寝室)/],
            ['purchase', /(购买|买了|下单|快递|收货)/],
            ['party', /(聚会|聚餐|饭局)/],
            ['work', /(上班|工作|会议|汇报|项目|加班)/]
        ];
        rules.forEach(([anchor, pattern]) => { if (pattern.test(content)) anchors.add(anchor); });
        return Array.from(anchors);
    }

    function eventResolutionNeedsTopicMatch(observation) {
        return observation?.state === 'completed' || observation?.state === 'cancelled';
    }

    const RELATIONSHIP_STAGE_LABELS = Object.freeze({
        married: '已婚/伴侣',
        engaged: '已订婚',
        cohabiting: '同居伴侣',
        reconciled: '已复合',
        separated: '已分开',
        partners: '恋爱关系',
        friends: '朋友关系',
        family: '家人关系'
    });

    function normalizeRelationshipStageValue(value) {
        const stage = String(value || '').trim();
        if (!stage || stage === 'auto') return '';
        return Object.prototype.hasOwnProperty.call(RELATIONSHIP_STAGE_LABELS, stage) ? stage : '';
    }

    function explicitRelationshipStage(content) {
        const text = normalizeText(content);
        if (!text || /如果|假如|假设|要是|倘若|也许|可能|希望|想象|[‘’“”「」『』"？?]/.test(text)) return null;
        const rules = [
            ['married', '已婚/伴侣', /(我们(?:已经)?结婚了?|我们是夫妻|你是我(?:丈夫|妻子)|我是你(?:丈夫|妻子))/],
            ['engaged', '已订婚', /(我们(?:已经)?订婚了?|你是我(?:未婚夫|未婚妻)|我是你(?:未婚夫|未婚妻))/],
            ['cohabiting', '同居伴侣', /(我们(?:开始|已经)?同居了?|我们住到一起了?)/],
            ['reconciled', '已复合', /(我们(?:已经)?复合了?|我们重新在一起了?)/],
            ['separated', '已分开', /(我们(?:已经)?分手了?|我们(?:已经)?分开了?|我们现在是前任)/],
            ['partners', '恋爱关系', /(我们(?:已经)?在一起了?|我们是(?:恋人|情侣)|你是我(?:男朋友|女朋友|对象)|我是你(?:男朋友|女朋友|对象))/],
            ['friends', '朋友关系', /(我们(?:只是|就是|是)(?:普通)?朋友|我们现在是朋友|只是普通朋友)/],
            ['family', '家人关系', /(我们是家人|我们已经是一家人)/]
        ];
        for (const clause of text.split(/[，,。；;！!]+/)) {
            if (/不觉得|并非|并不是|还不是|不是说|没有确认|不代表|不算|假的|不是真的|开玩笑/.test(clause)) continue;
            for (const [stage, label, pattern] of rules) {
                const match = pattern.exec(clause.trim());
                if (!match) continue;
                const prefix = clause.trim().slice(0, match.index);
                if (!/^(?:现在|目前|其实|终于|所以|而且|从今天起)*$/.test(prefix)) continue;
                return { stage, label };
            }
        }
        return null;
    }

    function shouldObserveEvent(text, actor = 'user', force = false) {
        const content = normalizeText(text);
        if (!content || content.length < 3 || SENSITIVE_AUTO_MEMORY.test(content)) return false;
        if (force) return true;
        if (actor === 'character') return /答应|承诺|说好|约定|计划|明天|后天|周末|完成|取消|见面/.test(content);
        return EVENT_SIGNAL.test(content) || COMPLETE_MARKER.test(content) || CANCEL_MARKER.test(content);
    }

    function getEventObservationState(text) {
        if (CANCEL_MARKER.test(text)) return 'cancelled';
        if (COMPLETE_MARKER.test(text)) return 'completed';
        if (/计划|准备|打算|明天|后天|周末|下周|下个月|约好|约定|答应|承诺/.test(text)) return 'open';
        return 'occurred';
    }

    function createEventObservation(payload = {}) {
        const text = normalizeText(payload.text).slice(-2200);
        const bindingId = String(payload.bindingId || '').trim();
        const sourceApp = String(payload.sourceApp || 'unknown').trim().toLowerCase();
        const sourceId = String(payload.sourceId || '').trim() || (sourceApp + ':' + Date.now());
        const occurredAtValue = Number(payload.occurredAt);
        const occurredAt = Number.isFinite(occurredAtValue) ? new Date(occurredAtValue).toISOString() : (payload.occurredAt ? new Date(payload.occurredAt).toISOString() : new Date().toISOString());
        const actor = ['user', 'character', 'shared'].includes(payload.actor) ? payload.actor : 'user';
        const reality = ['dream', 'if'].includes(payload.reality) ? payload.reality : 'reality';
        const timelineId = reality === 'if' ? String(payload.timelineId || '').trim() : '';
        const privateSource = payload.private === true || /^(private|私人)$/i.test(String(payload.visibility || '').trim());
        const stateValue = reality !== 'reality' ? 'occurred' : getEventObservationState(text);
        const dueAt = reality !== 'reality' ? 0 : inferDueAt({ content: text, createdAt: occurredAt, updatedAt: occurredAt, memoryType: stateValue === 'open' ? 'plan' : 'event', v2: { memoryType: stateValue === 'open' ? 'plan' : 'event' } });
        return {
            id: sourceApp + ':' + sourceId,
            sourceApp, sourceId, bindingId, actor, text, occurredAt, reality, timelineId,
            access: privateSource ? 'private' : 'shared',
            state: stateValue,
            dueAt: Number(dueAt) || 0,
            terms: getEventTerms(text),
            topicAnchors: getEventTopicAnchors(text),
            entityIds: extractEntityIds(bindingId, text)
        };
    }

    function rebuildEventNode(node, observations) {
        const sorted = observations.slice().sort((left, right) => String(left.occurredAt || '').localeCompare(String(right.occurredAt || '')));
        const first = sorted[0];
        const last = sorted[sorted.length - 1];
        const visibleObservations = sorted.filter((observation) => observation.access !== 'private');
        const visibleFirst = visibleObservations[0] || first;
        const visibleLast = visibleObservations[visibleObservations.length - 1] || last;
        let eventState = 'occurred';
        let dueAt = 0;
        sorted.forEach((observation) => {
            if (observation.state === 'open') eventState = 'open';
            if (observation.state === 'completed' || observation.state === 'cancelled') eventState = observation.state;
            if (!dueAt && Number(observation.dueAt) > 0) dueAt = Number(observation.dueAt);
        });
        let visibleState = 'occurred';
        let visibleDueAt = 0;
        visibleObservations.forEach((observation) => {
            if (observation.state === 'open') visibleState = 'open';
            if (observation.state === 'completed' || observation.state === 'cancelled') visibleState = observation.state;
            if (!visibleDueAt && Number(observation.dueAt) > 0) visibleDueAt = Number(observation.dueAt);
        });
        const entityIds = Array.from(new Set(sorted.flatMap((observation) => observation.entityIds || [])));
        const terms = Array.from(new Set(sorted.flatMap((observation) => observation.terms || []))).slice(0, 48);
        const visibleEntityIds = Array.from(new Set(visibleObservations.flatMap((observation) => observation.entityIds || [])));
        const visibleTerms = Array.from(new Set(visibleObservations.flatMap((observation) => observation.terms || []))).slice(0, 48);
        const bindingIds = Array.from(new Set(visibleObservations.map((observation) => observation.bindingId).filter(Boolean)));
        const sourceApps = Array.from(new Set(sorted.map((observation) => observation.sourceApp).filter(Boolean)));
        const visibleSourceApps = Array.from(new Set(visibleObservations.map((observation) => observation.sourceApp).filter(Boolean)));
        const topicAnchors = Array.from(new Set(sorted.flatMap((observation) => observation.topicAnchors || []))).slice(0, 16);
        const visibleTopicAnchors = Array.from(new Set(visibleObservations.flatMap((observation) => observation.topicAnchors || []))).slice(0, 16);
        const visibleRelationshipSignals = visibleObservations
            .filter(observation => observation.reality !== 'dream' && observation.reality !== 'if')
            .map((observation) => ({ observation, relation: explicitRelationshipStage(observation.text) }))
            .filter((entry) => entry.relation);
        const latestRelationshipSignal = visibleRelationshipSignals[visibleRelationshipSignals.length - 1] || null;
        const openObservation = visibleObservations.length
            ? visibleObservations.find((observation) => observation.state === 'open')
            : sorted.find((observation) => observation.state === 'open');
        const canonical = openObservation || (visibleObservations.length ? visibleFirst : first) || last;
        const scope = visibleObservations.length === 0 ? 'private' : (visibleObservations.some((observation) => !observation.bindingId) ? 'global' : 'binding');
        const now = new Date().toISOString();
        const manual = node?.manualOverride && typeof node.manualOverride === 'object' ? { ...node.manualOverride } : null;
        const hasManualState = manual && ['open', 'occurred', 'completed', 'cancelled'].includes(manual.state);
        const hasManualDueAt = manual && Object.prototype.hasOwnProperty.call(manual, 'dueAt');
        const hasManualRelationship = manual && Object.prototype.hasOwnProperty.call(manual, 'relationshipStage');
        const manualRelationshipStage = hasManualRelationship ? normalizeRelationshipStageValue(manual.relationshipStage) : '';
        const manualText = normalizeText(manual?.text);
        const manualBindingId = bindingIds[0] || '';
        const effectiveVisibleTerms = manualText ? getEventTerms(manualText) : visibleTerms;
        const effectiveVisibleEntityIds = manualText ? extractEntityIds(manualBindingId, manualText) : visibleEntityIds;
        const effectiveVisibleTopicAnchors = manualText ? getEventTopicAnchors(manualText) : visibleTopicAnchors;
        const latestObservationAt = Date.parse(last?.occurredAt || '');
        const compactedAt = Date.parse(node?.compactedAt || '');
        const retainedCompaction = node?.archiveReason === 'retention_compaction'
            && Number.isFinite(compactedAt)
            && (!Number.isFinite(latestObservationAt) || latestObservationAt <= compactedAt);
        const hidden = manual?.hidden === true;
        const effectiveState = hasManualState ? manual.state : eventState;
        const effectiveVisibleState = visibleObservations.length ? (hasManualState ? manual.state : visibleState) : 'private';
        const effectiveDueAt = hasManualDueAt ? Math.max(0, Number(manual.dueAt) || 0) : dueAt;
        const effectiveVisibleDueAt = visibleObservations.length ? (hasManualDueAt ? Math.max(0, Number(manual.dueAt) || 0) : visibleDueAt) : 0;
        const effectiveRelationshipStage = hasManualRelationship ? manualRelationshipStage : (latestRelationshipSignal?.relation?.stage || '');
        const effectiveRelationshipLabel = hasManualRelationship
            ? (effectiveRelationshipStage ? (manual.relationshipLabel || RELATIONSHIP_STAGE_LABELS[effectiveRelationshipStage] || '') : '')
            : (latestRelationshipSignal?.relation?.label || '');
        const effectiveRelationshipText = hasManualRelationship
            ? (effectiveRelationshipStage ? normalizeText(manual.relationshipText || manualText || canonical?.text || '') : '')
            : normalizeText(latestRelationshipSignal?.observation?.text || '');
        const effectiveRelationshipAt = hasManualRelationship && effectiveRelationshipStage
            ? (manual.updatedAt || now)
            : (latestRelationshipSignal?.observation?.occurredAt || '');
        return {
            ...(node || {}),
            id: node?.id || ('event_node_' + Date.now() + '_' + Math.random().toString(36).slice(2, 8)),
            schemaVersion: SCHEMA_VERSION,
            status: hidden || retainedCompaction || !sorted.length ? 'archived' : 'active',
            state: effectiveState,
            visibleState: effectiveVisibleState,
            canonicalText: manualText || normalizeText(canonical?.text || ''),
            latestText: normalizeText(visibleLast?.text || last?.text || ''),
            terms, entityIds, visibleTerms: effectiveVisibleTerms, visibleEntityIds: effectiveVisibleEntityIds, topicAnchors, visibleTopicAnchors: effectiveVisibleTopicAnchors, bindingIds, sourceApps, visibleSourceApps, scope,
            visibleRelationshipStage: effectiveRelationshipStage,
            visibleRelationshipLabel: effectiveRelationshipLabel,
            visibleRelationshipText: effectiveRelationshipText,
            visibleRelationshipAt: effectiveRelationshipAt,
            dueAt: effectiveDueAt,
            visibleDueAt: effectiveVisibleDueAt,
            observations: sorted.slice(-EVENT_OBSERVATION_LIMIT),
            manualOverride: manual,
            createdAt: node?.createdAt || first?.occurredAt || now,
            updatedAt: manual?.updatedAt || last?.occurredAt || now,
            resolvedAt: effectiveState === 'completed' || effectiveState === 'cancelled' ? (manual?.updatedAt || last?.occurredAt || now) : ''
        };
    }

    function hydrateEventNode(node) {
        if (!node || !node.id) return null;
        const observations = (Array.isArray(node.observations) ? node.observations : []).map((observation) => ({
            ...observation,
            text: normalizeText(observation?.text),
            terms: Array.isArray(observation?.terms) ? observation.terms : getEventTerms(observation?.text),
            topicAnchors: Array.isArray(observation?.topicAnchors) ? observation.topicAnchors : getEventTopicAnchors(observation?.text),
            entityIds: Array.isArray(observation?.entityIds) ? observation.entityIds : extractEntityIds(observation?.bindingId, observation?.text),
            access: observation?.access === 'private' ? 'private' : 'shared'
        })).filter((observation) => observation.text);
        if (!observations.length && node.status === 'archived' && ['source_removed', 'remote_deleted'].includes(String(node.archiveReason || ''))) {
            return {
                ...node,
                schemaVersion: SCHEMA_VERSION,
                status: 'archived',
                observations: [],
                bindingIds: Array.isArray(node.bindingIds) ? node.bindingIds.filter(Boolean) : [],
                sourceApps: [],
                visibleSourceApps: [],
                terms: [],
                visibleTerms: [],
                entityIds: [],
                visibleEntityIds: [],
                topicAnchors: [],
                visibleTopicAnchors: [],
                visibleRelationshipStage: '',
                visibleRelationshipLabel: '',
                visibleRelationshipText: '',
                visibleRelationshipAt: '',
                dueAt: 0,
                visibleDueAt: 0,
                updatedAt: node.updatedAt || node.deletedAt || new Date().toISOString()
            };
        }
        return rebuildEventNode(node, observations);
    }

    function eventBindingCompatible(node, bindingId) {
        const bindings = Array.isArray(node?.bindingIds) ? node.bindingIds : [];
        if (!bindingId || bindings.length === 0) return true;
        return bindings.includes(bindingId);
    }

    function scoreEventNodeMatch(node, observation) {
        if (!node || node.status !== 'active') return -Infinity;
        const observations = node.observations || [];
        const nodeReality = observations[0]?.reality || 'reality';
        if (!observations.length || observations.some(row => (row.reality || 'reality') !== nodeReality) ||
            nodeReality !== (observation.reality || 'reality')) return -Infinity;
        if (nodeReality === 'if' && (!observation.timelineId ||
            observations.some(row => row.timelineId !== observation.timelineId))) return -Infinity;
        const bindingCompatible = eventBindingCompatible(node, observation.bindingId);
        if (!bindingCompatible && node.bindingIds?.length && observation.bindingId) return -Infinity;
        const nodeTerms = new Set(node.terms || []);
        const observationTerms = new Set(observation.terms || []);
        let termOverlap = 0;
        observationTerms.forEach((term) => { if (nodeTerms.has(term)) termOverlap += 1; });
        const nodeEntities = new Set(node.visibleEntityIds || node.entityIds || []);
        let entityOverlap = 0;
        (observation.entityIds || []).forEach((id) => { if (nodeEntities.has(id)) entityOverlap += 1; });
        const nodeAnchors = new Set(node.visibleTopicAnchors || node.topicAnchors || []);
        let topicOverlap = 0;
        (observation.topicAnchors || []).forEach((anchor) => { if (nodeAnchors.has(anchor)) topicOverlap += 1; });
        const bindingBoost = observation.bindingId && (node.bindingIds || []).includes(observation.bindingId) ? 7 : 2;
        const resolutionBoost = eventResolutionNeedsTopicMatch(observation) && node.state === 'open' && topicOverlap > 0 ? 10 : 0;
        const dueBoost = observation.dueAt && node.dueAt && Math.abs(observation.dueAt - node.dueAt) <= 2 * 86400000 ? 6 : 0;
        if (eventResolutionNeedsTopicMatch(observation) && (observation.topicAnchors || []).length > 0 && topicOverlap === 0 && termOverlap === 0 && entityOverlap === 0) return -Infinity;
        return termOverlap * 9 + entityOverlap * 12 + topicOverlap * 14 + bindingBoost + resolutionBoost + dueBoost;
    }

    function findEventNodeForObservation(nodes, observation) {
        const sourceKey = observation.sourceApp + ':' + observation.sourceId;
        const exact = nodes.find((node) => (node.observations || []).some((entry) => entry.sourceApp + ':' + entry.sourceId === sourceKey));
        if (exact) return exact;
        const ranked = nodes
            .map((node) => ({ node, score: scoreEventNodeMatch(node, observation) }))
            .filter((entry) => Number.isFinite(entry.score))
            .sort((left, right) => right.score - left.score);
        if (ranked[0]?.score >= EVENT_NODE_RELEVANCE_THRESHOLD) return ranked[0].node;
        if (eventResolutionNeedsTopicMatch(observation) && (observation.topicAnchors || []).length === 0) {
            const observationTime = Date.parse(observation.occurredAt || '');
            const open = nodes.filter((node) => {
                if (node.status !== 'active' || node.state !== 'open' || !eventBindingCompatible(node, observation.bindingId) ||
                    (node.observations || []).some(row => (row.reality || 'reality') !== (observation.reality || 'reality') ||
                        (observation.reality === 'if' && row.timelineId !== observation.timelineId))) return false;
                const nodeTime = Date.parse(node.updatedAt || node.createdAt || '');
                if (!Number.isFinite(observationTime) || !Number.isFinite(nodeTime)) return false;
                return Math.abs(observationTime - nodeTime) <= 3 * 86400000;
            });
            if (open.length === 1) return open[0];
        }
        return null;
    }

    function mergeEventObservation(nodes, observation, force = false) {
        const list = (Array.isArray(nodes) ? nodes : []).map(hydrateEventNode).filter(Boolean);
        const sourceKey = observation.sourceApp + ':' + observation.sourceId;
        const existing = list.find((node) => (node.observations || []).some((entry) => entry.sourceApp + ':' + entry.sourceId === sourceKey));
        if (existing && !force && !shouldObserveEvent(observation.text, observation.actor, false)) {
            const remaining = (existing.observations || []).filter((entry) => entry.sourceApp + ':' + entry.sourceId !== sourceKey);
            const updated = rebuildEventNode(existing, remaining);
            const next = remaining.length ? list.map((node) => node.id === existing.id ? updated : node) : list.filter((node) => node.id !== existing.id);
            return { nodes: next, node: remaining.length ? updated : null, removed: true };
        }
        const target = existing || findEventNodeForObservation(list, observation);
        if (!target) {
            const created = rebuildEventNode(null, [observation]);
            return { nodes: [...list, created], node: created, created: true };
        }
        const observations = (target.observations || []).filter((entry) => entry.sourceApp + ':' + entry.sourceId !== sourceKey);
        observations.push(observation);
        const updated = rebuildEventNode({ ...target, archiveReason: target.archiveReason === 'retention_compaction' ? '' : target.archiveReason, compactedAt: target.archiveReason === 'retention_compaction' ? '' : target.compactedAt }, observations);
        return { nodes: list.map((node) => node.id === target.id ? updated : node), node: updated, created: false };
    }

    function canAutoLinkMemoryToEventNode(item, node) {
        if ((node?.observations || []).some(row=>row.reality && row.reality !== 'reality')) return false;
        if (!item?.v2 || item.status !== 'active' || item.tier !== 'L1' || item.v2.eventLinkBlocked === true) return false;
        if (!node || node.status !== 'active' || node.scope === 'private') return false;
        if ((node.bindingIds || []).length && !(node.bindingIds || []).includes(item.bindingId)) return false;
        const nodeTerms = new Set(node.visibleTerms || []);
        const nodeEntities = new Set(node.visibleEntityIds || []);
        let termOverlap = 0;
        getEventTerms(item.content).forEach((term) => { if (nodeTerms.has(term)) termOverlap += 1; });
        let entityOverlap = 0;
        (item.v2.entityIds || []).forEach((id) => { if (nodeEntities.has(id)) entityOverlap += 1; });
        return termOverlap > 0 || entityOverlap > 0;
    }

    function scoreMemoryEventNode(item, node) {
        if (!canAutoLinkMemoryToEventNode(item, node)) return -Infinity;
        const nodeTerms = new Set(node.visibleTerms || []);
        const nodeEntities = new Set(node.visibleEntityIds || []);
        let termOverlap = 0;
        getEventTerms(item.content).forEach((term) => { if (nodeTerms.has(term)) termOverlap += 1; });
        let entityOverlap = 0;
        (item.v2.entityIds || []).forEach((id) => { if (nodeEntities.has(id)) entityOverlap += 1; });
        const bindingBoost = (node.bindingIds || []).includes(item.bindingId) ? 6 : 0;
        const openBoost = (node.visibleState || node.state) === 'open' ? 2 : 0;
        return termOverlap * 9 + entityOverlap * 12 + bindingBoost + openBoost;
    }

    async function linkMemoryItemsToEventNode(node) {
        if (!node || node.scope === 'private') return 0;
        let linked = 0;
        const next = state.items.map((item) => {
            if (!canAutoLinkMemoryToEventNode(item, node)) return item;
            if (item.v2.eventNodeId === node.id) return item;
            linked += 1;
            return { ...item, v2: { ...item.v2, eventNodeId: node.id, eventNodeLinkedAt: new Date().toISOString() } };
        });
        if (linked && await writeMemoryItems(next)) state.items = next;
        return linked;
    }

    function compactEventNodeList(nodes, now = Date.now()) {
        const list = (Array.isArray(nodes) ? nodes : []).map(hydrateEventNode).filter(Boolean);
        const resolvedActive = list
            .filter((node) => node.status === 'active' && ['completed', 'cancelled', 'occurred'].includes(node.visibleState))
            .filter((node) => !node.visibleRelationshipStage && !node.manualOverride)
            .sort((left, right) => String(right.updatedAt || '').localeCompare(String(left.updatedAt || '')));
        const overflowIds = new Set(resolvedActive.slice(EVENT_MAX_ACTIVE_RESOLVED).map((node) => node.id));
        let archived = 0;
        const compactedAt = new Date(now).toISOString();
        const next = list.map((node) => {
            if (node.status !== 'active' || node.visibleState === 'open' || node.visibleRelationshipStage || node.manualOverride) return node;
            const timestamp = Date.parse(node.updatedAt || node.createdAt || '');
            const ageDays = Number.isFinite(timestamp) ? Math.max(0, (now - timestamp) / 86400000) : 0;
            if (ageDays < EVENT_ARCHIVE_DAYS && !overflowIds.has(node.id)) return node;
            archived += 1;
            return { ...node, status: 'archived', archiveReason: 'retention_compaction', compactedAt };
        });
        return { nodes: next, archived };
    }

    async function compactEventNodes() {
        if (!isCurrentAccountState()) await migrate();
        const result = compactEventNodeList(state.eventNodes);
        if (!result.archived || !changed(state.eventNodes, result.nodes)) return result.archived;
        if (!await writeEventNodes(result.nodes)) return 0;
        state.eventNodes = result.nodes;
        await reconcileMemoryEventLinks();
        return result.archived;
    }

    function memoryStillMatchesEventNode(item, node) {
        if ((node?.observations || []).some(row=>row.reality && row.reality !== 'reality')) return false;
        if (!item?.v2?.eventNodeId || !node || node.status !== 'active') return false;
        if ((node.bindingIds || []).length && !(node.bindingIds || []).includes(item.bindingId)) return false;
        const terms = new Set(node.visibleTerms || []);
        const entities = new Set(node.visibleEntityIds || []);
        let termOverlap = 0;
        getEventTerms(item.content).forEach((term) => { if (terms.has(term)) termOverlap += 1; });
        let entityOverlap = 0;
        (item.v2.entityIds || []).forEach((id) => { if (entities.has(id)) entityOverlap += 1; });
        return termOverlap > 0 || entityOverlap > 0;
    }

    async function reconcileMemoryEventLinks() {
        const nodes = new Map(state.eventNodes.map((node) => [node.id, node]));
        let changedCount = 0;
        const next = state.items.map((item) => {
            const nodeId = item?.v2?.eventNodeId;
            if (!nodeId) return item;
            if (item?.v2?.eventLinkBlocked === true) {
                const v2 = { ...item.v2 };
                delete v2.eventNodeId;
                delete v2.eventNodeLinkedAt;
                changedCount += 1;
                return { ...item, v2 };
            }
            const node = nodes.get(nodeId);
            if (memoryStillMatchesEventNode(item, node)) return item;
            const v2 = { ...item.v2 };
            delete v2.eventNodeId;
            delete v2.eventNodeLinkedAt;
            changedCount += 1;
            return { ...item, v2 };
        });
        if (changedCount && await writeMemoryItems(next)) state.items = next;
        return changedCount;
    }

    function subjectIdForKind(bindingId, subjectKind) {
        if (subjectKind === 'user') return 'user:self';
        if (subjectKind === 'character') return 'character:' + String(bindingId || '');
        if (subjectKind === 'shared') return 'shared:' + String(bindingId || '');
        return 'unknown';
    }

    function subjectTypeForKind(subjectKind) {
        if (subjectKind === 'user') return 'user_persona';
        if (subjectKind === 'character') return 'character_persona';
        if (subjectKind === 'shared') return 'shared_experience';
        return 'unknown';
    }

    function applyMemoryIdentityOverride(item, subjectKind, now = new Date().toISOString()) {
        if (!item || !SUBJECT_KINDS.has(subjectKind)) return item;
        const subjectId = subjectIdForKind(item.bindingId, subjectKind);
        return {
            ...item,
            subjectType: subjectTypeForKind(subjectKind),
            subjectId,
            updatedAt: now,
            revision: Math.max(1, Number(item.revision) || 1) + 1,
            v2: {
                ...(item.v2 || {}),
                subjectKind,
                subjectId,
                identityLocked: true,
                identityConfidence: 1,
                identitySource: 'identity_locked',
                identityCorrectionAuthority: 'user_confirmed',
                identityCorrectedAt: now
            }
        };
    }

    function clearMemoryIdentityOverride(item, now = new Date().toISOString()) {
        if (!item?.v2) return item;
        const v2 = { ...item.v2 };
        delete v2.identityLocked;
        delete v2.identityCorrectionAuthority;
        delete v2.identityCorrectedAt;
        delete v2.subjectKind;
        delete v2.subjectId;
        delete v2.identityConfidence;
        delete v2.identitySource;
        const cleared = {
            ...item,
            subjectType: '',
            subjectId: '',
            v2,
            updatedAt: now,
            revision: Math.max(1, Number(item.revision) || 1) + 1
        };
        return migrateItem(cleared, state.contacts, state.conversations, now);
    }

    function blockMemoryEventLinkRecord(item, now = new Date().toISOString()) {
        if (!item?.v2) return item;
        const v2 = {
            ...item.v2,
            eventLinkBlocked: true,
            eventLinkBlockAuthority: 'user_confirmed',
            eventLinkBlockedAt: now
        };
        delete v2.eventNodeId;
        delete v2.eventNodeLinkedAt;
        return { ...item, v2, updatedAt: now, revision: Math.max(1, Number(item.revision) || 1) + 1 };
    }

    function unblockMemoryEventLinkRecord(item, now = new Date().toISOString()) {
        if (!item?.v2) return item;
        const v2 = { ...item.v2 };
        delete v2.eventLinkBlocked;
        delete v2.eventLinkBlockAuthority;
        delete v2.eventLinkBlockedAt;
        delete v2.eventNodeId;
        delete v2.eventNodeLinkedAt;
        return { ...item, v2, updatedAt: now, revision: Math.max(1, Number(item.revision) || 1) + 1 };
    }

    async function updateMemoryIdentity(memoryId, subjectKind) {
        if (!isCurrentAccountState()) await migrate();
        const kind = String(subjectKind || '').trim();
        if (!SUBJECT_KINDS.has(kind)) return null;
        const index = state.items.findIndex((item) => item?.id === String(memoryId || ''));
        if (index < 0) return null;
        const updated = applyMemoryIdentityOverride(state.items[index], kind);
        const next = state.items.map((item, itemIndex) => itemIndex === index ? updated : item);
        if (!await writeMemoryItems(next)) return null;
        state.items = next;
        return getMemoryTrace(updated.id);
    }

    async function resetMemoryIdentity(memoryId) {
        if (!isCurrentAccountState()) await migrate();
        const index = state.items.findIndex((item) => item?.id === String(memoryId || ''));
        if (index < 0) return null;
        const updated = clearMemoryIdentityOverride(state.items[index]);
        const next = state.items.map((item, itemIndex) => itemIndex === index ? updated : item);
        if (!await writeMemoryItems(next)) return null;
        state.items = next;
        return getMemoryTrace(updated.id);
    }

    async function blockMemoryEventLink(memoryId) {
        if (!isCurrentAccountState()) await migrate();
        const index = state.items.findIndex((item) => item?.id === String(memoryId || ''));
        if (index < 0) return null;
        const updated = blockMemoryEventLinkRecord(state.items[index]);
        const next = state.items.map((item, itemIndex) => itemIndex === index ? updated : item);
        if (!await writeMemoryItems(next)) return null;
        state.items = next;
        return getMemoryTrace(updated.id);
    }

    async function resetMemoryEventLink(memoryId) {
        if (!isCurrentAccountState()) await migrate();
        const index = state.items.findIndex((item) => item?.id === String(memoryId || ''));
        if (index < 0) return null;
        let updated = unblockMemoryEventLinkRecord(state.items[index]);
        const candidates = state.eventNodes
            .filter((node) => node?.status === 'active')
            .map((node) => ({ node, score: scoreMemoryEventNode(updated, node) }))
            .filter((entry) => Number.isFinite(entry.score))
            .sort((left, right) => right.score - left.score || String(right.node.updatedAt || '').localeCompare(String(left.node.updatedAt || '')));
        const best = candidates[0]?.node || null;
        if (best) {
            updated = {
                ...updated,
                v2: {
                    ...updated.v2,
                    eventNodeId: best.id,
                    eventNodeLinkedAt: new Date().toISOString()
                }
            };
        }
        const next = state.items.map((item, itemIndex) => itemIndex === index ? updated : item);
        if (!await writeMemoryItems(next)) return null;
        state.items = next;
        return getMemoryTrace(updated.id);
    }

    function normalizedManualEventPatch(node, patch = {}) {
        const previous = node?.manualOverride && typeof node.manualOverride === 'object' ? { ...node.manualOverride } : {};
        const next = { ...previous, authority: 'user_confirmed', updatedAt: new Date().toISOString() };
        if (Object.prototype.hasOwnProperty.call(patch, 'text')) {
            const text = normalizeText(patch.text);
            if (text) next.text = text.slice(0, 2200);
            else delete next.text;
        }
        if (Object.prototype.hasOwnProperty.call(patch, 'state')) {
            const value = String(patch.state || '').trim();
            if (value === 'auto' || !value) delete next.state;
            else if (['open', 'occurred', 'completed', 'cancelled'].includes(value)) next.state = value;
        }
        if (Object.prototype.hasOwnProperty.call(patch, 'dueAt')) {
            if (patch.dueAt === 'auto' || patch.dueAt === null) delete next.dueAt;
            else {
                const numeric = Number(patch.dueAt);
                const parsed = Number.isFinite(numeric) ? numeric : Date.parse(String(patch.dueAt || ''));
                next.dueAt = Number.isFinite(parsed) && parsed > 0 ? parsed : 0;
            }
        }
        if (Object.prototype.hasOwnProperty.call(patch, 'relationshipStage')) {
            const raw = String(patch.relationshipStage || '').trim();
            if (raw === 'auto') {
                delete next.relationshipStage;
                delete next.relationshipLabel;
                delete next.relationshipText;
            } else {
                const stage = normalizeRelationshipStageValue(raw);
                next.relationshipStage = stage;
                next.relationshipLabel = stage ? RELATIONSHIP_STAGE_LABELS[stage] : '';
                next.relationshipText = stage ? normalizeText(patch.relationshipText || patch.text || next.text || node?.canonicalText || '') : '';
            }
        }
        if (Object.prototype.hasOwnProperty.call(patch, 'hidden')) next.hidden = patch.hidden === true;
        return next;
    }

    async function updateEventNode(nodeId, patch = {}) {
        return queueEventNodeMutation(async () => {
            if (!isCurrentAccountState()) await migrate();
            const id = String(nodeId || '').trim();
            const index = state.eventNodes.findIndex((node) => node?.id === id);
            if (index < 0) return null;
            const target = state.eventNodes[index];
            const manualOverride = normalizedManualEventPatch(target, patch);
            const updated = rebuildEventNode({ ...target, manualOverride, archiveReason: '', compactedAt: '' }, target.observations || []);
            const next = state.eventNodes.map((node, nodeIndex) => nodeIndex === index ? updated : node);
            if (!await writeEventNodes(next)) return null;
            state.eventNodes = next;
            await reconcileMemoryEventLinks();
            if (updated.status === 'active') await linkMemoryItemsToEventNode(updated);
            state.lastEventNode = { id: updated.id, state: updated.visibleState || updated.state, sourceApps: updated.visibleSourceApps || [], at: new Date().toISOString(), manual: true };
            return updated;
        });
    }

    async function resetEventNodeOverride(nodeId) {
        return queueEventNodeMutation(async () => {
            if (!isCurrentAccountState()) await migrate();
            const id = String(nodeId || '').trim();
            const index = state.eventNodes.findIndex((node) => node?.id === id);
            if (index < 0) return null;
            const target = state.eventNodes[index];
            const updated = rebuildEventNode({ ...target, manualOverride: null, archiveReason: '', compactedAt: '' }, target.observations || []);
            const next = state.eventNodes.map((node, nodeIndex) => nodeIndex === index ? updated : node);
            if (!await writeEventNodes(next)) return null;
            state.eventNodes = next;
            await reconcileMemoryEventLinks();
            if (updated.status === 'active') await linkMemoryItemsToEventNode(updated);
            return updated;
        });
    }

    async function archiveEventNode(nodeId) {
        return updateEventNode(nodeId, { hidden: true });
    }

    async function restoreEventNode(nodeId) {
        return updateEventNode(nodeId, { hidden: false });
    }

    async function deleteEventNode(nodeId) {
        return queueEventNodeMutation(async () => {
            if (!isCurrentAccountState()) await migrate();
            const id = String(nodeId || '').trim();
            if (!id) return false;
            const target = state.eventNodes.find((node) => node?.id === id);
            if (!target) return false;
            const next = state.eventNodes.filter((node) => node?.id !== id);
            if (!await writeEventNodes(next)) return false;
            state.eventNodes = next;
            await reconcileMemoryEventLinks();
            state.lastEventNode = {
                id,
                state: 'deleted',
                sourceApps: target.visibleSourceApps || target.sourceApps || [],
                at: new Date().toISOString(),
                manual: true
            };
            return true;
        });
    }

    async function createManualEvent(payload = {}) {
        return queueEventNodeMutation(async () => {
            if (!isCurrentAccountState()) await migrate();
            const bindingId = String(payload.bindingId || '').trim();
            const text = normalizeText(payload.text);
            if (!bindingId || !text) return null;
            const now = new Date().toISOString();
            const sourceId = 'manual_' + Date.now() + '_' + Math.random().toString(36).slice(2, 8);
            const observation = {
                id: 'manual:' + sourceId,
                sourceApp: 'manual',
                sourceId,
                bindingId,
                actor: ['user', 'character', 'shared'].includes(payload.actor) ? payload.actor : 'shared',
                text: text.slice(0, 2200),
                occurredAt: payload.occurredAt ? new Date(payload.occurredAt).toISOString() : now,
                access: 'shared',
                state: getEventObservationState(text),
                dueAt: 0,
                terms: getEventTerms(text),
                topicAnchors: getEventTopicAnchors(text),
                entityIds: extractEntityIds(bindingId, text)
            };
            let created = rebuildEventNode(null, [observation]);
            created = rebuildEventNode({
                ...created,
                manualOverride: normalizedManualEventPatch(created, {
                    text,
                    state: payload.state || 'auto',
                    dueAt: Object.prototype.hasOwnProperty.call(payload, 'dueAt') ? payload.dueAt : 'auto',
                    relationshipStage: Object.prototype.hasOwnProperty.call(payload, 'relationshipStage') ? payload.relationshipStage : 'auto',
                    relationshipText: payload.relationshipText || text
                })
            }, created.observations);
            const next = [...state.eventNodes, created];
            if (!await writeEventNodes(next)) return null;
            state.eventNodes = next;
            await linkMemoryItemsToEventNode(created);
            return created;
        });
    }

    async function setRelationshipOverride(bindingId, stage, content = '') {
        return queueEventNodeMutation(async () => {
            if (!isCurrentAccountState()) await migrate();
            const id = MANUAL_RELATIONSHIP_NODE_PREFIX + String(bindingId || '').trim();
            if (!bindingId) return null;
            const normalizedStage = normalizeRelationshipStageValue(stage);
            if (!normalizedStage) return null;
            const now = new Date().toISOString();
            const label = RELATIONSHIP_STAGE_LABELS[normalizedStage] || '关系';
            const text = normalizeText(content) || ('手动确认关系：' + label);
            const existingIndex = state.eventNodes.findIndex((node) => node?.id === id);
            const observation = {
                id: 'manual:relationship:' + bindingId,
                sourceApp: 'manual',
                sourceId: 'relationship:' + bindingId,
                bindingId: String(bindingId),
                actor: 'shared',
                text,
                occurredAt: now,
                access: 'shared',
                state: 'occurred',
                dueAt: 0,
                terms: getEventTerms(text),
                topicAnchors: getEventTopicAnchors(text),
                entityIds: extractEntityIds(bindingId, text)
            };
            const seed = existingIndex >= 0 ? state.eventNodes[existingIndex] : { id, createdAt: now };
            const manualOverride = {
                ...(seed.manualOverride || {}),
                authority: 'user_confirmed',
                relationshipStage: normalizedStage,
                relationshipLabel: label,
                relationshipText: text,
                text,
                state: 'occurred',
                updatedAt: now,
                hidden: false
            };
            const updated = rebuildEventNode({ ...seed, id, manualOverride, archiveReason: '', compactedAt: '' }, [observation]);
            const next = existingIndex >= 0
                ? state.eventNodes.map((node, index) => index === existingIndex ? updated : node)
                : [...state.eventNodes, updated];
            if (!await writeEventNodes(next)) return null;
            state.eventNodes = next;
            return getRelationshipState(bindingId);
        });
    }

    async function clearRelationshipOverride(bindingId) {
        return queueEventNodeMutation(async () => {
            if (!isCurrentAccountState()) await migrate();
            const id = MANUAL_RELATIONSHIP_NODE_PREFIX + String(bindingId || '').trim();
            const next = state.eventNodes.filter((node) => node?.id !== id);
            if (next.length === state.eventNodes.length) return false;
            if (!await writeEventNodes(next)) return false;
            state.eventNodes = next;
            await reconcileMemoryEventLinks();
            return true;
        });
    }

    function splitEventObservation(nodes, nodeId, sourceApp, sourceId) {
        const list = (Array.isArray(nodes) ? nodes : []).map(hydrateEventNode).filter(Boolean);
        const index = list.findIndex((node) => node.id === nodeId);
        if (index < 0) return { nodes: list, sourceNode: null, detachedNode: null };
        const target = list[index];
        const observations = Array.isArray(target.observations) ? target.observations : [];
        if (observations.length < 2) return { nodes: list, sourceNode: target, detachedNode: null };
        const detachIndex = observations.findIndex((entry) => entry.sourceApp === sourceApp && String(entry.sourceId || '') === String(sourceId || ''));
        if (detachIndex < 0) return { nodes: list, sourceNode: target, detachedNode: null };
        const detachedObservation = observations[detachIndex];
        const remaining = observations.filter((_, observationIndex) => observationIndex !== detachIndex);
        const sourceNode = rebuildEventNode({ ...target, archiveReason: '', compactedAt: '' }, remaining);
        const detachedNode = rebuildEventNode(null, [detachedObservation]);
        const next = list.map((node, nodeIndex) => nodeIndex === index ? sourceNode : node);
        next.push(detachedNode);
        return { nodes: next, sourceNode, detachedNode };
    }

    async function detachEventObservation(nodeId, sourceApp, sourceId) {
        return queueEventNodeMutation(async () => {
            if (!isCurrentAccountState()) await migrate();
            const result = splitEventObservation(state.eventNodes, String(nodeId || ''), String(sourceApp || '').trim().toLowerCase(), String(sourceId || '').trim());
            if (!result.detachedNode || !changed(state.eventNodes, result.nodes)) return null;
            if (!await writeEventNodes(result.nodes)) return null;
            state.eventNodes = result.nodes;
            await reconcileMemoryEventLinks();
            if (result.sourceNode?.status === 'active') await linkMemoryItemsToEventNode(result.sourceNode);
            if (result.detachedNode?.status === 'active') await linkMemoryItemsToEventNode(result.detachedNode);
            return {
                sourceNodeId: result.sourceNode?.id || '',
                detachedNodeId: result.detachedNode?.id || ''
            };
        });
    }

    function createEventNodeTombstone(node, reason = 'source_removed', at = new Date().toISOString()) {
        return {
            ...(node || {}),
            id: node?.id || ('event_node_deleted_' + Date.now()),
            schemaVersion: SCHEMA_VERSION,
            status: 'archived',
            archiveReason: reason,
            deletedAt: at,
            updatedAt: at,
            observations: [],
            state: node?.state || 'occurred',
            visibleState: 'archived',
            dueAt: 0,
            visibleDueAt: 0,
            visibleSourceApps: [],
            visibleTerms: [],
            visibleEntityIds: [],
            visibleTopicAnchors: [],
            visibleRelationshipStage: '',
            visibleRelationshipLabel: '',
            visibleRelationshipText: '',
            visibleRelationshipAt: ''
        };
    }

    async function removeExternalEventObservations(payload = {}) {
        return queueEventNodeMutation(async () => {
            if (!isCurrentAccountState()) await migrate();
            const sourceApp = String(payload.sourceApp || '').trim().toLowerCase();
            const sourceIds = new Set((Array.isArray(payload.sourceIds) ? payload.sourceIds : [payload.sourceId]).map((value) => String(value || '').trim()).filter(Boolean));
            if (!sourceApp || !sourceIds.size) return false;
            const touchedNodeIds = new Set();
            const next = [];
            const removedAt = new Date().toISOString();
            state.eventNodes.forEach((node) => {
                const observations = (node.observations || []).filter((entry) => {
                    const matched = entry.sourceApp === sourceApp && sourceIds.has(String(entry.sourceId || ''));
                    if (matched) touchedNodeIds.add(node.id);
                    return !matched;
                });
                if (observations.length === (node.observations || []).length) {
                    next.push(node);
                    return;
                }
                if (observations.length) next.push(rebuildEventNode({ ...node, archiveReason: '', compactedAt: '' }, observations));
                else next.push(createEventNodeTombstone(node, 'source_removed', removedAt));
            });
            if (!touchedNodeIds.size) return false;
            const compacted = compactEventNodeList(next);
            if (!await writeEventNodes(compacted.nodes)) return false;
            state.eventNodes = compacted.nodes;
            await reconcileMemoryEventLinks();
            for (const nodeId of touchedNodeIds) {
                const node = state.eventNodes.find((entry) => entry.id === nodeId);
                if (node?.status === 'active') await linkMemoryItemsToEventNode(node);
            }
            return true;
        });
    }

    async function observeExternalEvent(payload = {}) {
        return queueEventNodeMutation(async () => {
            if (!isCurrentAccountState()) await migrate();
            const observation = createEventObservation(payload);
            const sourceKey = observation.sourceApp + ':' + observation.sourceId;
            const existing = state.eventNodes.find((node) => (node.observations || []).some((entry) => entry.sourceApp + ':' + entry.sourceId === sourceKey));
            const force = payload.force === true;
            if (!existing && !shouldObserveEvent(observation.text, observation.actor, force)) return null;
            const result = mergeEventObservation(state.eventNodes, observation, force);
            if (!changed(state.eventNodes, result.nodes)) return result.node;
            const compacted = compactEventNodeList(result.nodes);
            if (!await writeEventNodes(compacted.nodes)) return null;
            state.eventNodes = compacted.nodes;
            state.lastEventNode = result.node ? { id: result.node.id, state: result.node.state, sourceApps: result.node.sourceApps, at: new Date().toISOString() } : null;
            if (result.node) await linkMemoryItemsToEventNode(result.node);
            return result.node;
        });
    }

    async function removeExternalEventObservation(payload = {}) {
        return removeExternalEventObservations(payload);
    }

    function eventVisibleToBinding(node, bindingId) {
        if (!node || node.scope === 'private') return false;
        if (node.scope === 'global') return true;
        if (!bindingId) return true;
        return (node.bindingIds || []).includes(bindingId);
    }

    function normalizeEventTimestamp(value) {
        if (value instanceof Date) return value.getTime();
        const numeric = Number(value);
        if (Number.isFinite(numeric) && numeric > 0) {
            return numeric < 1e12 ? numeric * 1000 : numeric;
        }
        const parsed = Date.parse(String(value || ''));
        return Number.isFinite(parsed) ? parsed : 0;
    }

    function getEventNodeLatestTimestamp(node, bindingId) {
        let latest = 0;
        (node?.observations || []).forEach((observation) => {
            if (!observation || observation.access === 'private') return;
            if (bindingId && observation.bindingId && String(observation.bindingId) !== String(bindingId)) return;
            latest = Math.max(latest, normalizeEventTimestamp(observation.occurredAt));
        });
        if (latest > 0) return latest;
        return normalizeEventTimestamp(node?.createdAt || node?.updatedAt || 0);
    }

    function eventRecencyPenalty(node, bindingId, now = Date.now()) {
        if ((node?.visibleState || node?.state) === 'open') return 0;
        const timestamp = getEventNodeLatestTimestamp(node, bindingId);
        if (!timestamp) return 10;
        const ageDays = Math.max(0, (now - timestamp) / 86400000);
        if (ageDays <= 1) return 0;
        if (ageDays <= 7) return 2;
        if (ageDays <= 30) return 8;
        if (ageDays <= 90) return 14;
        return 18;
    }

    function eventRuntimePenalty(node) {
        const entry = eventRuntimeActivation.get(node?.id);
        if (!entry) return 0;
        const elapsed = Date.now() - entry.at;
        return elapsed < 120000 ? 18 : elapsed < 600000 ? 8 : Math.min(5, entry.count || 0);
    }

    function scoreEventNodeForQuery(node, bindingId, query) {
        if (!node || node.status !== 'active' || !eventVisibleToBinding(node, bindingId)) return -Infinity;
        const queryTerms = new Set(getEventTerms(query));
        const queryEntities = new Set(extractEntityIds(bindingId, query));
        let termOverlap = 0;
        (node.visibleTerms || []).forEach((term) => { if (queryTerms.has(term)) termOverlap += 1; });
        let entityOverlap = 0;
        (node.visibleEntityIds || []).forEach((id) => { if (queryEntities.has(id)) entityOverlap += 1; });
        if (!termOverlap && !entityOverlap) return -Infinity;
        const bindingBoost = bindingId && (node.bindingIds || []).includes(bindingId) ? 7 : 0;
        const openBoost = node.visibleState === 'open' ? 5 : 0;
        const baseScore = termOverlap * 9 + entityOverlap * 12 + bindingBoost + openBoost;
        return baseScore - eventRecencyPenalty(node, bindingId);
    }

    function getRelevantEventNodes(bindingId, query, limit = 2) {
        return state.eventNodes
            .map((node) => ({ node, score: scoreEventNodeForQuery(node, bindingId, query) }))
            .filter((entry) => Number.isFinite(entry.score) && entry.score >= EVENT_NODE_RELEVANCE_THRESHOLD)
            .sort((left, right) => right.score - left.score || String(right.node.updatedAt || '').localeCompare(String(left.node.updatedAt || '')))
            .slice(0, Math.max(1, Math.min(3, Number(limit) || 2)));
    }

    function getDueEventNode(bindingId, now = Date.now()) {
        return state.eventNodes
            .filter((node) => node && node.status === 'active' && node.visibleState === 'open' && eventVisibleToBinding(node, bindingId) && (node.bindingIds || []).includes(bindingId) && Number(node.visibleDueAt) > 0)
            .filter((node) => node.visibleDueAt - now <= DUE_SOON_MS && now - node.visibleDueAt <= DUE_RECENTLY_MS)
            .sort((left, right) => Math.abs(left.visibleDueAt - now) - Math.abs(right.visibleDueAt - now))[0] || null;
    }

    function formatEventNode(node, prefix = '跨 App 事件：') {
        if (!node) return '';
        const sourceLabels = { wechat: '微信', sms: '短信', meeting: '见面', diary: '日记', icity: 'Diary' };
        const sources = (node.visibleSourceApps || []).map((source) => sourceLabels[source] || source).join(' / ');
        const visibleState = node.visibleState || node.state;
        const stateLabel = ({ open: '待续', completed: '已完成', cancelled: '已取消', occurred: '已发生' })[visibleState] || visibleState;
        const ifStory = (node.observations || []).some(row => row.reality === 'if');
        const note = ifStory ? '【IF线／平行世界，非现实事实】' : '';
        const displayState = ifStory ? '虚构剧情' : stateLabel;
        return `${prefix}${note}${node.canonicalText}${sources ? `（来源：${sources}；状态：${displayState}）` : `（状态：${displayState}）`}`;
    }

    async function observeChatTurnEvents(bindingId, sourceMessages, turnId) {
        const messages = Array.isArray(sourceMessages) ? sourceMessages : [];
        for (const message of messages.slice(-8)) {
            const actor = getMessageActor(message);
            if (!actor) continue;
            const text = normalizeText(message?.text);
            if (!shouldObserveEvent(text, actor, false)) continue;
            await observeExternalEvent({
                sourceApp: 'wechat',
                sourceId: String(message?.id || turnId || Date.now()),
                bindingId, actor, text, occurredAt: message?.time || message?.createdAt || Date.now()
            });
        }
    }

    function computedMemoryState(item, now = Date.now()) {
        if (!item || item.status !== 'active') return item?.status || 'archived';
        const type = item?.v2?.memoryType || item?.memoryType || '';
        const explicit = item?.v2?.memoryState;
        if (explicit === 'superseded') return 'superseded';
        if (UNRESOLVED_TYPES.has(type) || type === 'relationship' || item.authority === 'user_confirmed') return 'active';
        const awakenedAt = Date.parse(item?.v2?.lastAwakenedAt || '');
        if (Number.isFinite(awakenedAt) && now - awakenedAt <= AWAKENED_ACTIVE_DAYS * 86400000) return 'awakened';
        if (item.tier !== 'L1') return explicit || 'active';
        const timestamp = Date.parse(item?.v2?.reinforcedAt || item.updatedAt || item.createdAt || '');
        if (!Number.isFinite(timestamp)) return explicit || 'active';
        const ageDays = Math.max(0, (now - timestamp) / 86400000);
        if ((type === 'event' || type === 'emotion') && ageDays >= DORMANT_EVENT_DAYS) return 'dormant';
        return explicit === 'dormant' ? 'dormant' : 'active';
    }

    function candidateScoreFor(item, memoryType, identity) {
        if (item?.tier !== 'L3' || item?.status !== 'active' || SENSITIVE_AUTO_MEMORY.test(String(item?.content || ''))) return 0;
        if (memoryType === 'fragment' || identity.subjectKind === 'unknown') return 0;
        const content = normalizeText(item.content);
        if (content.length < 4 || content.length > 180 || content.startsWith('[')) return 0;
        const base = { promise: 0.92, plan: 0.88, relationship: 0.9, preference: 0.78, habit: 0.78, emotion: 0.62, event: 0.58, fact: 0.76 }[memoryType] || 0;
        const emphatic = /一直|总是|每天|最喜欢|最爱|特别|非常|一定|答应|保证|约定/.test(content) ? 0.08 : 0;
        return Math.max(0, Math.min(1, base + emphatic + (identity.confidence >= 0.9 ? 0.04 : 0)));
    }

    function migrateItem(item, contacts, conversations, migratedAt) {
        if (!item || !item.id || !item.bindingId || !item.content) return item;
        const prior = item.v2 && typeof item.v2 === 'object' ? item.v2 : {};
        const identity = inferIdentity(item, contacts, conversations);
        const memoryType = prior?.aiReview?.status && AI_MEMORY_TYPES.has(prior.memoryType)
            ? prior.memoryType
            : classifyMemoryType(item);
        const entityIds = Array.from(new Set([identity.subjectId, item.bindingId ? 'character:' + item.bindingId : '', ...extractEntityIds(item.bindingId, item.content), ...(Array.isArray(prior.entityIds) ? prior.entityIds : [])].filter(Boolean)));
        const dueAt = Number(prior.dueAt) || inferDueAt({ ...item, v2: { ...prior, memoryType } });
        const nextV2 = {
            ...prior, version: 5, memoryType, subjectKind: identity.subjectKind, subjectId: identity.subjectId,
            identityConfidence: identity.confidence, identitySource: identity.source, entityIds,
            importance: Number.isFinite(prior.importance) ? prior.importance : importanceFor(item, memoryType),
            confidence: Number.isFinite(prior.confidence) ? prior.confidence : Math.max(0.35, identity.confidence),
            stability: prior.stability || stabilityFor(item, memoryType),
            candidateScore: item.tier === 'L3' ? candidateScoreFor(item, memoryType, identity) : Number(prior.candidateScore) || 0,
            memoryState: prior.memoryState || (item.status === 'superseded' ? 'superseded' : 'active'),
            reinforcementCount: Math.max(0, Number(prior.reinforcementCount) || 0), dueAt: dueAt || 0,
            migratedAt: prior.migratedAt || migratedAt
        };
        const migrated = {
            ...item, schemaVersion: Math.max(SCHEMA_VERSION, Number(item.schemaVersion) || 0),
            subjectType: identity.subjectKind === 'character' ? 'character_persona' : identity.subjectKind === 'user' ? 'user_persona' : identity.subjectKind === 'shared' ? 'shared_experience' : 'unknown',
            subjectId: identity.subjectId, memoryType, v2: nextV2
        };
        migrated.v2.memoryState = computedMemoryState(migrated);
        return migrated;
    }

    function getSummaryIndexText(summary) {
        if (!summary || !Array.isArray(summary.sections)) return '';
        return normalizeText(summary.sections.map((section) => {
            const details = section?.details && typeof section.details === 'object' ? Object.values(section.details) : [];
            return [section?.title, section?.content, ...details].filter(Boolean).join(' ');
        }).join(' '));
    }

    function migrateSummary(summary, migratedAt) {
        if (!summary || !summary.id || !summary.bindingId) return summary;
        const indexText = getSummaryIndexText(summary);
        const sectionSourceIds = Array.isArray(summary.sections) ? summary.sections.flatMap((section) => Array.isArray(section?.sourceMessageIds) ? section.sourceMessageIds : []) : [];
        const sourceMessageIds = Array.from(new Set([...(Array.isArray(summary.sourceMessageIds) ? summary.sourceMessageIds : []), ...sectionSourceIds].map(String).filter(Boolean)));
        const entityIds = Array.from(new Set([...(Array.isArray(summary?.v2?.entityIds) ? summary.v2.entityIds : []), ...extractEntityIds(summary.bindingId, indexText)]));
        return {
            ...summary,
            schemaVersion: Math.max(SCHEMA_VERSION, Number(summary.schemaVersion) || 0),
            v2: {
                ...(summary.v2 || {}),
                version: 5,
                indexOnly: true,
                subjectKind: 'shared',
                subjectId: 'shared:' + String(summary.bindingId),
                identityConfidence: 0.95,
                identitySource: 'summary_sources',
                sourceMessageIds,
                entityIds,
                indexTerms: createTerms(indexText).slice(0, 32),
                evidencePolicy: 'source_memory_required',
                migratedAt: summary.v2?.migratedAt || migratedAt
            }
        };
    }

    function getSummaryEvidence(summary, limit = SUMMARY_EVIDENCE_LIMIT) {
        if (!summary) return [];
        const sourceIds = new Set((Array.isArray(summary?.v2?.sourceMessageIds) ? summary.v2.sourceMessageIds : summary.sourceMessageIds || []).map(String));
        if (!sourceIds.size) return [];
        return state.items
            .filter((item) => item && item.bindingId === summary.bindingId && item.status === 'active' && item.tier === 'L1')
            .map((item) => {
                const refs = Array.isArray(item.sourceRefs) ? item.sourceRefs : [];
                const overlap = refs.reduce((count, ref) => count + (ref?.messageId && sourceIds.has(String(ref.messageId)) ? 1 : 0), 0);
                if (!overlap) return null;
                const sourceQuality = item.authority === 'user_confirmed' ? 10 : item.authority === 'user_quote' ? 8 : item.authority === 'summary_verified' ? 2 : 4;
                const tierBoost = item.tier === 'L1' ? 4 : 1;
                return { item, score: overlap * 12 + sourceQuality + tierBoost + authorityRank(item) };
            })
            .filter(Boolean)
            .sort((left, right) => right.score - left.score || String(right.item.updatedAt || right.item.createdAt || '').localeCompare(String(left.item.updatedAt || left.item.createdAt || '')))
            .slice(0, Math.max(1, Math.min(8, Number(limit) || SUMMARY_EVIDENCE_LIMIT)))
            .map((entry) => entry.item);
    }

    function formatSummaryIndexTime(summary) {
        const section = Array.isArray(summary?.sections) ? summary.sections[0] : null;
        const range = section?.timeRange || {};
        const start = normalizeText(range.start || summary?.createdAt || '');
        const end = normalizeText(range.end || summary?.updatedAt || '');
        if (start && end && start !== end) return start + ' ~ ' + end;
        return start || end || '未标注时间';
    }

    function buildSummaryIndexPrompt(bindingId, currentOnly = false) {
        const candidates = state.summaries
            .filter((summary) => summary && summary.bindingId === bindingId && summary.status === 'active')
            .sort((left, right) => String(right.updatedAt || right.createdAt || '').localeCompare(String(left.updatedAt || left.createdAt || '')));
        const summaries = currentOnly
            ? (() => {
                const working = candidates.find((summary) => summary.slot === 'working');
                if (working) return [working];
                const latestChapter = candidates.find((summary) => summary.slot === 'chapter');
                return latestChapter ? [latestChapter] : [];
            })()
            : candidates.slice(0, SUMMARY_INDEX_LIMIT);
        const currentState = buildCurrentStatePrompt(bindingId);
        if (!summaries.length) return currentState;
        const blocks = summaries.map((summary) => {
            const indexText = getSummaryIndexText(summary);
            const sectionTitle = normalizeText(summary?.sections?.[0]?.title) || '近况';
            const clues = (summary?.v2?.indexTerms || createTerms(indexText)).slice(0, 10).join('、');
            const evidence = getSummaryEvidence(summary).map((item) => '- ' + formatItem(item)).join('\n');
            const lead = [
                `索引：${sectionTitle}｜${formatSummaryIndexTime(summary)}`,
                clues ? `线索词：${clues}` : '',
                indexText ? `摘要线索（不可单独作为事实）：${indexText.slice(0, 320)}` : ''
            ].filter(Boolean).join('\n');
            return evidence ? `${lead}\n可核对记忆：\n${evidence}` : `${lead}\n可核对记忆：暂无；不要把摘要线索当成已确认事实。`;
        });
        return ['【摘要索引】以下摘要只用于定位相关记忆，不是事实证据；事实、人物身份、关系状态与计划状态以带来源的具体记忆为准。', ...blocks, currentState].filter(Boolean).join('\n\n');
    }


    // Derived embeddings are stored separately from authored memories and may be rebuilt.
    function semanticBackend() {
        const service = window.SemanticMemory;
        const backend = service?.getEmbeddingBackend?.();
        return service?.embed && backend?.ready && backend?.version ? backend : null;
    }

    function semanticFingerprint(text) {
        let value = 2166136261;
        const input = SEMANTIC_TEXT_REVISION + ':' + text;
        for (let i = 0; i < input.length; i += 1) {
            value = Math.imul(value ^ input.charCodeAt(i), 16777619);
        }
        return (value >>> 0).toString(16) + ':' + text.length;
    }

    function splitSemanticText(value) {
        const text = normalizeText(value);
        if (!text) return [];
        const parts = [];
        let offset = 0;
        while (offset < text.length && parts.length < 64) {
            let end = Math.min(text.length, offset + 520);
            if (end < text.length) {
                const boundary = Math.max(text.lastIndexOf('。', end), text.lastIndexOf('；', end), text.lastIndexOf('！', end), text.lastIndexOf('？', end));
                if (boundary > offset + 260) end = boundary + 1;
            }
            parts.push(text.slice(offset, end));
            if (end >= text.length) break;
            offset = Math.max(offset + 1, end - 40);
        }
        return parts;
    }

    function semanticSources() {
        const sources = [];
        const add = (kind, item, text, bindingId = '') => {
            splitSemanticText(text).forEach((part, partIndex) => {
                const key = kind + ':' + item.id + ':' + partIndex;
                sources.push({
                    key, kind, sourceId: String(item.id), bindingId: String(bindingId),
                    fingerprint: semanticFingerprint(part), text: part
                });
            });
        };
        state.items.filter((item) =>
            item?.status === 'active' && item.tier === 'L1' && item.content &&
            item?.v2?.subjectKind !== 'unknown'
        ).forEach((item) => add('memory', item, item.content, item.bindingId));
        state.summaries.filter((item) =>
            item?.status === 'active' && Array.isArray(item.sections)
        ).forEach((item) => add('summary', item, getSummaryIndexText(item), item.bindingId));
        state.eventNodes.filter((node) =>
            node?.status === 'active' && node.scope !== 'private' && node.canonicalText
        ).forEach((node) => add('event', node, node.canonicalText));
        return sources;
    }

    async function ensureSemanticIndex(backend) {
        const account = getDynamicUserId();
        if (semanticIndex.account !== account || semanticIndex.version !== backend.version) {
            semanticIndex = {
                account, version: backend.version, loaded: false, entries: [],
                loading: null, running: false, scheduled: false, retryAt: 0, rebuild: null
            };
            semanticQueryCache.clear();
        }
        const holder = semanticIndex;
        if (holder.loaded) return holder;
        if (!holder.loading) {
            holder.loading = (async () => {
                const saved = (await readRecords([SEMANTIC_INDEX_KEY]))[SEMANTIC_INDEX_KEY];
                if (semanticIndex !== holder) return holder;
                holder.entries = saved?.version === backend.version && saved?.textRevision === SEMANTIC_TEXT_REVISION
                    && Array.isArray(saved.entries) ? saved.entries : [];
                holder.rebuild = saved?.version === backend.version && saved?.textRevision === SEMANTIC_TEXT_REVISION
                    && saved?.rebuild && typeof saved.rebuild === 'object' ? saved.rebuild : null;
                holder.loaded = true;
                return holder;
            })().catch(() => {
                holder.loaded = true;
                holder.entries = [];
                return holder;
            });
        }
        return holder.loading;
    }

    function validSemanticSource(record, sources) {
        const current = sources.get(record.key);
        return Boolean(current &&
            current.bindingId === record.bindingId &&
            current.fingerprint === record.fingerprint &&
            Array.isArray(record.values) &&
            record.values.length === record.dimensions &&
            record.dimensions > 0 &&
            record.values.every(Number.isFinite));
    }

    function scheduleSemanticIndex() {
        const backend = semanticBackend();
        if (!backend || !isCurrentAccountState()) return;
        const holder = semanticIndex;
        if (holder.scheduled || holder.running || Date.now() < holder.retryAt) return;
        holder.scheduled = true;
        const queue = typeof window.requestIdleCallback === 'function'
            ? (callback) => window.requestIdleCallback(callback, { timeout: 2500 })
            : (callback) => setTimeout(callback, 750);
        queue(() => {
            holder.scheduled = false;
            void fillSemanticIndex(backend);
        });
    }

    async function requestSemanticVector(text, maxWaitMs = 900) {
        const accountId = getDynamicUserId();
        const version = semanticBackend()?.version || '';
        const key = accountId + ':' + version + ':' + text;
        let entry = semanticVectorRequests.get(key);
        if (!entry) {
            let hardTimeout;
            entry = { settled: false };
            entry.promise = Promise.race([
                Promise.resolve().then(() => window.SemanticMemory.embed(text)).catch(() => null),
                new Promise(resolve => { hardTimeout = setTimeout(() => resolve(null), 30000); })
            ]).then(result => {
                clearTimeout(hardTimeout);
                entry.settled = true;
                const valid = accountId === getDynamicUserId() && version === semanticBackend()?.version
                    && result?.version === version && Array.isArray(result.values) && result.values.length > 0
                    && result.values.length === Number(result.dimensions) && result.values.every(Number.isFinite);
                if (!valid) { if (semanticVectorRequests.get(key) === entry) semanticVectorRequests.delete(key); return null; }
                return result;
            });
            semanticVectorRequests.set(key, entry);
            if (semanticVectorRequests.size > 64) {
                for (const [oldKey, oldEntry] of semanticVectorRequests) {
                    if (oldEntry.settled && oldKey !== key) semanticVectorRequests.delete(oldKey);
                    if (semanticVectorRequests.size <= 64) break;
                }
            }
        }
        let timeoutId;
        try {
            return await Promise.race([entry.promise, new Promise(resolve => { timeoutId = setTimeout(() => resolve(null), maxWaitMs); })]);
        } finally { clearTimeout(timeoutId); }
    }

    async function fillSemanticIndex(backend) {
        if (semanticBackend()?.version !== backend.version || !isCurrentAccountState()) return;
        const holder = await ensureSemanticIndex(backend);
        if (holder.running || semanticIndex !== holder || Date.now() < holder.retryAt) return;
        holder.running = true;
        try {
            const sources = new Map(semanticSources().map((entry) => [entry.key, entry]));
            const current = holder.entries.filter((entry) => validSemanticSource(entry, sources));
            const known = new Set(current.map((entry) => entry.key));
            const pending = Array.from(sources.values()).filter((entry) => !known.has(entry.key)).slice(0, 4);
            const additions = [];
            for (const source of pending) {
                const response = await requestSemanticVector(source.text, 12000);
                if (semanticIndex !== holder || semanticBackend()?.version !== backend.version || !isCurrentAccountState()) return;
                if (!response) throw new Error('SEMANTIC_INDEX_EMBED_UNAVAILABLE');
                if (response?.version !== backend.version || !Array.isArray(response.values) ||
                    response.values.length !== Number(response.dimensions) ||
                    !response.values.length || !response.values.every(Number.isFinite)) continue;
                additions.push({
                    key: source.key, sourceId: source.sourceId, kind: source.kind,
                    bindingId: source.bindingId, fingerprint: source.fingerprint,
                    dimensions: response.values.length, values: response.values
                });
            }
            if (semanticIndex !== holder || !isCurrentAccountState()) return;
            const latest = new Map(semanticSources().map((entry) => [entry.key, entry]));
            const next = [...current, ...additions].filter((entry) => validSemanticSource(entry, latest));
            if (pending.length || next.length !== holder.entries.length) {
                const saved = await writeRecords([{
                    id: getIsolatedKey(SEMANTIC_INDEX_KEY),
                    version: backend.version, textRevision: SEMANTIC_TEXT_REVISION,
                    entries: next, rebuild: holder.rebuild || null
                }]);
                if (!saved) throw new Error('SEMANTIC_INDEX_SAVE_FAILED');
                if (semanticIndex === holder) holder.entries = next;
            }
            if (pending.length === 4 && additions.length && semanticIndex === holder) {
                setTimeout(() => scheduleSemanticIndex(), 500);
            }
        } catch (error) {
            holder.retryAt = Date.now() + 60000;
            console.debug('Semantic memory index deferred:', String(error?.message || error));
        } finally {
            holder.running = false;
        }
    }

    function scopedSemanticSources(bindingId) {
        const scope = String(bindingId || '');
        if (!scope) return [];
        const events = new Map(state.eventNodes.map((node) => [String(node.id), node]));
        return semanticSources().filter((source) => source.kind === 'event'
            ? eventVisibleToBinding(events.get(source.sourceId), scope)
            : source.bindingId === scope);
    }

    async function getSemanticRebuildStatus(bindingId) {
        const backend = semanticBackend();
        if (!isCurrentAccountState()) await migrate(true);
        if (!isCurrentAccountState()) throw new Error('MEMORY_ACCOUNT_CHANGED');
        const sources = scopedSemanticSources(bindingId);
        if (!backend) return {
            ready: false, mode: 'idle', model: '', total: sources.length,
            indexed: 0, rebuilt: 0, remaining: sources.length, resumable: false
        };
        const holder = await ensureSemanticIndex(backend);
        if (holder !== semanticIndex || !isCurrentAccountState()) throw new Error('MEMORY_ACCOUNT_CHANGED');
        const live = new Map(semanticSources().map((source) => [source.key, source]));
        const records = new Map(holder.entries.filter((record) => validSemanticSource(record, live))
            .map((record) => [record.key, record]));
        const session = holder.rebuild?.bindingId === String(bindingId) && holder.rebuild?.status === 'running'
            ? holder.rebuild : null;
        const rebuilt = session ? sources.filter((source) => records.get(source.key)?.rebuildGeneration === session.generation).length : 0;
        return {
            ready: true, mode: backend.mode, model: backend.model || '',
            total: sources.length,
            indexed: sources.filter((source) => records.has(source.key)).length,
            rebuilt,
            remaining: session ? sources.length - rebuilt : sources.length,
            resumable: Boolean(session),
            running: Boolean(holder.running)
        };
    }

    // Re-embed existing memory sources only. Authored L1/L2/event content is never modified.
    // The old index stays searchable until each replacement vector has been saved.
    async function rebuildSemanticIndex(bindingId, options = {}) {
        const scope = String(bindingId || '');
        if (!scope) throw new Error('请先选择需要整理的角色。');
        const backend = semanticBackend();
        if (!backend) throw new Error('请先在记忆设置中配置并保存向量 API，或启用本地向量模型。');
        if (!isCurrentAccountState()) await migrate(true);
        if (!isCurrentAccountState()) throw new Error('MEMORY_ACCOUNT_CHANGED');
        const holder = await ensureSemanticIndex(backend);
        if (holder !== semanticIndex || !isCurrentAccountState()) throw new Error('MEMORY_ACCOUNT_CHANGED');
        if (holder.running) throw new Error('向量索引正在更新，请稍后重试。');
        const account = getDynamicUserId();
        const sources = scopedSemanticSources(scope);
        if (!sources.length) return { total: 0, processed: 0, remaining: 0, completed: true, model: backend.model || '' };
        const maxEntries = Math.max(1, Math.min(40, Math.floor(Number(options.maxEntries) || 24)));
        const session = holder.rebuild?.bindingId === scope && holder.rebuild?.status === 'running'
            ? holder.rebuild : {
                bindingId: scope,
                generation: String(Date.now()) + ':' + Math.random().toString(36).slice(2, 8),
                status: 'running',
                createdAt: new Date().toISOString()
            };
        const token = session.generation;
        const onProgress = typeof options.onProgress === 'function' ? options.onProgress : () => {};
        const check = () => {
            if (semanticIndex !== holder || getDynamicUserId() !== account ||
                !isCurrentAccountState() || semanticBackend()?.version !== backend.version) {
                throw new Error('向量模型或账号已切换，请重新打开整理页面。');
            }
        };
        const save = async (entries, rebuild) => {
            check();
            const success = await writeRecords([{
                id: SEMANTIC_INDEX_KEY + '_' + account,
                version: backend.version,
                textRevision: SEMANTIC_TEXT_REVISION,
                entries,
                rebuild
            }]);
            if (!success) throw new Error('向量索引保存失败，已保存的部分下次可以继续。');
            check();
            holder.entries = entries;
            holder.rebuild = rebuild;
        };
        holder.running = true;
        let processed = 0;
        try {
            const live = new Map(semanticSources().map((source) => [source.key, source]));
            let records = new Map(holder.entries.filter((record) => validSemanticSource(record, live))
                .map((record) => [record.key, record]));
            const pending = sources.filter((source) =>
                records.get(source.key)?.rebuildGeneration !== token);
            for (const source of pending.slice(0, maxEntries)) {
                check();
                const result = await requestSemanticVector(source.text, 12000);
                check();
                const fresh = new Map(semanticSources().map((entry) => [entry.key, entry]));
                if (fresh.get(source.key)?.fingerprint !== source.fingerprint ||
                    fresh.get(source.key)?.bindingId !== source.bindingId) {
                    throw new Error('记忆内容在整理期间发生变化，请再次点击以继续。');
                }
                if (!result || result.version !== backend.version ||
                    !Array.isArray(result.values) || !result.values.length ||
                    result.values.length !== Number(result.dimensions) ||
                    !result.values.every(Number.isFinite)) {
                    throw new Error('向量 API 没有返回有效结果，已保存的向量不会丢失。');
                }
                records.set(source.key, {
                    key: source.key, sourceId: source.sourceId, kind: source.kind,
                    bindingId: source.bindingId, fingerprint: source.fingerprint,
                    dimensions: result.values.length, values: result.values,
                    rebuildGeneration: token
                });
                // Persist each successful replacement so an interruption never loses completed work.
                await save(Array.from(records.values()).filter((record) => validSemanticSource(record, fresh)), session);
                processed += 1;
                const remaining = sources.filter((entry) => records.get(entry.key)?.rebuildGeneration !== token).length;
                onProgress({ processed, total: sources.length, remaining, maxEntries });
            }
            check();
            const latest = new Map(semanticSources().map((entry) => [entry.key, entry]));
            const remaining = scopedSemanticSources(scope).filter((entry) =>
                records.get(entry.key)?.rebuildGeneration !== token ||
                !validSemanticSource(records.get(entry.key), latest)).length;
            if (!remaining) await save(Array.from(records.values()).filter((record) => validSemanticSource(record, latest)),
                { ...session, status: 'completed', finishedAt: new Date().toISOString() });
            semanticQueryCache.clear();
            return { total: sources.length, processed, remaining, completed: remaining === 0, model: backend.model || '' };
        } finally {
            holder.running = false;
        }
    }

    function semanticCosine(left, right) {
        if (!Array.isArray(left) || !Array.isArray(right) || left.length !== right.length) return 0;
        let dot = 0, leftNorm = 0, rightNorm = 0;
        for (let i = 0; i < left.length; i += 1) {
            dot += left[i] * right[i];
            leftNorm += left[i] * left[i];
            rightNorm += right[i] * right[i];
        }
        return leftNorm && rightNorm ? dot / Math.sqrt(leftNorm * rightNorm) : 0;
    }

    function semanticQuery(bindingId, query) {
        const input = normalizeText(query);
        if (input.length >= 15) return input.slice(0, 400);
        const messages = Array.isArray(state.conversations[bindingId]) ? state.conversations[bindingId] : [];
        const earlier = messages.slice(-12).reverse().find((message) =>
            message?.type === 'sent' && normalizeText(message.text) !== input
        );
        return earlier ? normalizeText(earlier.text).slice(-110) + '；' + input : input;
    }

    async function getSemanticMatches(bindingId, query, limit = 3) {
        const backend = semanticBackend();
        if (!backend || !query || !isCurrentAccountState()) return [];
        const holder = await ensureSemanticIndex(backend);
        if (holder !== semanticIndex) return [];
        scheduleSemanticIndex();
        const sources = new Map(semanticSources().map((entry) => [entry.key, entry]));
        const valid = holder.entries.filter((entry) =>
            validSemanticSource(entry, sources) &&
            (entry.kind === 'event'
                ? eventVisibleToBinding(state.eventNodes.find((node) => node.id === entry.sourceId), bindingId)
                : entry.bindingId === String(bindingId))
        );
        if (!valid.length) return [];
        const expanded = semanticQuery(bindingId, query);
        const accountId = getDynamicUserId();
        const cacheKey = accountId + ':' + backend.version + ':' + bindingId + ':' + expanded;
        let queryVector = semanticQueryCache.get(cacheKey);
        if (!queryVector) {
            const response = await requestSemanticVector(expanded, 900);
            if (!response || response.version !== backend.version || !Array.isArray(response.values) ||
                response.values.length !== Number(response.dimensions) || !response.values.every(Number.isFinite)) return [];
            if (accountId !== getDynamicUserId() || semanticBackend()?.version !== backend.version) return [];
            queryVector = response.values;
            semanticQueryCache.set(cacheKey, queryVector);
            if (semanticQueryCache.size > 16) semanticQueryCache.delete(semanticQueryCache.keys().next().value);
        }
        if (!isCurrentAccountState() || semanticBackend()?.version !== backend.version) return [];
        const fresh = new Map(semanticSources().map((entry) => [entry.key, entry]));
        return valid.map((entry) => ({
            entry,
            score: semanticCosine(queryVector, entry.values),
            source: fresh.get(entry.key)
        })).filter(({ entry, score, source }) =>
            score >= SEMANTIC_MIN_COSINE && source &&
            source.fingerprint === entry.fingerprint &&
            (entry.kind !== 'event' || eventVisibleToBinding(state.eventNodes.find((node) => node.id === entry.sourceId), bindingId)) &&
            entry.dimensions === queryVector.length
        ).sort((a, b) => b.score - a.score)
            .slice(0, Math.max(1, Math.min(4, Number(limit) || 3)));
    }

    function formatSemanticMatch(match, bindingId) {
        const { entry, source } = match;
        if (entry.kind === 'memory') {
            const item = state.items.find((row) => row.id === entry.sourceId && row.bindingId === entry.bindingId && row.status === 'active');
            return item ? formatItem(item, '相关记忆：') : '';
        }
        if (entry.kind === 'event') {
            const node = state.eventNodes.find((row) => row.id === entry.sourceId && row.status === 'active');
            return node && eventVisibleToBinding(node, bindingId) ? formatEventNode(node) : '';
        }
        const summary = state.summaries.find((row) =>
            row.id === entry.sourceId && row.bindingId === entry.bindingId && row.status === 'active'
        );
        if (!summary) return '';
        return '历史摘要线索（' + formatSummaryIndexTime(summary) + '，请按已核实来源判断）：' + source.text.slice(0, 420);
    }

    function changed(before, after) {
        return JSON.stringify(before || null) !== JSON.stringify(after || null);
    }

    async function migrate(force = false) {
        if (state.migrationPromise) return state.migrationPromise;
        state.migrationPromise = (async () => {
            state.migrating = true;
            try {
                const userId = getDynamicUserId();
                if (!await window.MemoryApp.storage.ensure()) throw new Error('MEMORY_STORAGE_UNAVAILABLE');
                const records = await readRecords([MEMORY_ITEMS_KEY, MEMORY_SUMMARIES_KEY, EVENT_NODES_KEY, CONTACTS_KEY, CONTACTS_APP_KEY, CHATS_KEY, 'wechatChatContactIndex', MIGRATION_KEY]);
                if (getDynamicUserId() !== userId) throw new Error('MEMORY_ACCOUNT_CHANGED');
                const memoryRecord = records[MEMORY_ITEMS_KEY];
                const summaryRecord = records[MEMORY_SUMMARIES_KEY];
                const eventNodeRecord = records[EVENT_NODES_KEY];
                const previousReport = records[MIGRATION_KEY];
                const storage = window.MemoryApp.storage;
                const expected = new Map([[MEMORY_ITEMS_KEY, memoryRecord], [MEMORY_SUMMARIES_KEY, summaryRecord], [EVENT_NODES_KEY, eventNodeRecord]]
                    .map(([key, record]) => [key + '_' + userId, storage.version(record)]));
                const storedItems = Array.isArray(memoryRecord?.items) ? memoryRecord.items : [];
                const originalItems = storedItems.filter((item) => item?.tier !== 'L3' && item?.kind !== 'fragment');
                const originalSummaries = Array.isArray(summaryRecord?.items) ? summaryRecord.items : [];
                const originalEventNodes = Array.isArray(eventNodeRecord?.items) ? eventNodeRecord.items.map(hydrateEventNode).filter(Boolean) : [];
                storage.track(originalItems, memoryRecord);
                storage.track(originalSummaries, summaryRecord);
                storage.track(originalEventNodes, eventNodeRecord);
                const contacts = getContacts(records[CONTACTS_KEY]);
                const contactMap = new Map(contacts.map((contact) => [String(contact.id), contact]));
                const addressBookContacts = getAddressBookContacts(records[CONTACTS_APP_KEY]);
                const userMasks = getUserMasks(records[CONTACTS_APP_KEY]);
                const conversations = { ...getConversations(records[CHATS_KEY]) };
                const contactIds = Array.isArray(records.wechatChatContactIndex?.contactIds) ? records.wechatChatContactIndex.contactIds : [];
                const keys = contactIds.map(id => 'wechatChatContactData_' + userId + '_' + id);
                const incremental = keys.length ? await readRecords(keys, { exact: true }) : {};
                if (userId !== getDynamicUserId()) throw new Error('MEMORY_ACCOUNT_CHANGED');
                contactIds.forEach((id, index) => { if (Array.isArray(incremental[keys[index]]?.messages)) conversations[id] = incremental[keys[index]].messages; });
                state.contacts = contactMap;
                state.addressBookContacts = new Map(addressBookContacts.map((contact) => [String(contact.id), contact]));
                state.userMasks = new Map(userMasks.map((user) => [String(user.id), user]));
                const migrationTime = new Date().toISOString();
                const current = !force && previousReport?.userId === userId && Number(previousReport?.schemaVersion) === SCHEMA_VERSION && Number(memoryRecord?.schemaVersion || 0) === SCHEMA_VERSION && (!summaryRecord || Number(summaryRecord?.schemaVersion || 0) === SCHEMA_VERSION) && (!eventNodeRecord || Number(eventNodeRecord?.schemaVersion || 0) === SCHEMA_VERSION);
                if (current) {
                    if (originalItems.length !== storedItems.length) {
                        if (!await writeRecords([{ id: getIsolatedKey(MEMORY_ITEMS_KEY), schemaVersion: SCHEMA_VERSION, items: originalItems }], { expected })) throw new Error('MEMORY_MIGRATION_SAVE_FAILED');
                    }
                    if (getDynamicUserId() !== userId) throw new Error('MEMORY_ACCOUNT_CHANGED');
                    state.items = originalItems; state.summaries = originalSummaries; state.eventNodes = originalEventNodes; state.conversations = conversations; state.userId = userId; state.lastMigration = previousReport;
                    return previousReport;
                }
                const migratedItems = enrichKnownNamedEntities(originalItems.map((item) => migrateItem(item, contactMap, conversations, migrationTime)));
                const migratedSummaries = originalSummaries.map((summary) => migrateSummary(summary, migrationTime));
                const report = {
                    id: getIsolatedKey(MIGRATION_KEY), schemaVersion: SCHEMA_VERSION, userId, total: migratedItems.length,
                    changed: (storedItems.length - originalItems.length) + migratedItems.reduce((count, item, index) => count + (changed(originalItems[index], item) ? 1 : 0), 0),
                    summariesChanged: migratedSummaries.reduce((count, item, index) => count + (changed(originalSummaries[index], item) ? 1 : 0), 0),
                    unknown: migratedItems.filter((item) => item?.v2?.subjectKind === 'unknown').length, eventNodes: originalEventNodes.length, migratedAt: migrationTime
                };
                storage.track(migratedItems, memoryRecord);
                storage.track(migratedSummaries, summaryRecord);
                const writes = [];
                if (!memoryRecord || Number(memoryRecord.schemaVersion) !== SCHEMA_VERSION || changed(storedItems, migratedItems)) writes.push({ id: getIsolatedKey(MEMORY_ITEMS_KEY), schemaVersion: SCHEMA_VERSION, items: migratedItems });
                if (summaryRecord && (Number(summaryRecord.schemaVersion) !== SCHEMA_VERSION || changed(originalSummaries, migratedSummaries))) writes.push({ id: getIsolatedKey(MEMORY_SUMMARIES_KEY), schemaVersion: SCHEMA_VERSION, items: migratedSummaries });
                if (eventNodeRecord && (Number(eventNodeRecord.schemaVersion) !== SCHEMA_VERSION || changed(eventNodeRecord.items, originalEventNodes))) writes.push({ id: getIsolatedKey(EVENT_NODES_KEY), schemaVersion: SCHEMA_VERSION, items: originalEventNodes });
                if (writes.length || !previousReport || Number(previousReport.schemaVersion) !== SCHEMA_VERSION) writes.push(report);
                if (getDynamicUserId() !== userId) throw new Error('MEMORY_ACCOUNT_CHANGED');
                if (writes.length && !await writeRecords(writes, { expected })) throw new Error('MEMORY_MIGRATION_SAVE_FAILED');
                if (getDynamicUserId() !== userId) throw new Error('MEMORY_ACCOUNT_CHANGED');
                state.items = migratedItems; state.summaries = migratedSummaries; state.eventNodes = originalEventNodes; state.conversations = conversations; state.userId = userId; state.lastMigration = report;
                window.dispatchEvent(new CustomEvent('memoryv2:migrated', { detail: report }));
                return report;
            } finally {
                state.migrating = false;
                state.migrationPromise = null;
            }
        })();
        return state.migrationPromise;
    }

    function normalizeApiCompletionUrl(url) {
        const base = String(url || '').trim().replace(/\/+$/, '');
        return /\/chat\/completions$/i.test(base) ? base : base + '/chat/completions';
    }

    async function getConnectedMemoryApi() {
        const records = await readRecords(['apiData']);
        const record = records.apiData;
        const list = Array.isArray(record?.list) ? record.list : [];
        const api = list.find((item) => item && item.id === record?.connectedId) || null;
        if (!api?.url || !api?.key || !api?.model) return null;
        return { id: api.id, name: normalizeText(api.name || api.model || '当前 API'), url: api.url, key: api.key, model: api.model };
    }

    function isAiReviewCandidate(item) {
        if (!item || !item.id || item.status === 'archived' || item.status === 'superseded') return false;
        if (item?.v2?.identityLocked === true) return false;
        if (item?.v2?.aiReview?.status === 'resolved' || item?.v2?.aiReview?.status === 'unresolved') return false;
        const subjectKind = item?.v2?.subjectKind || 'unknown';
        const confidence = Number(item?.v2?.identityConfidence) || 0;
        return subjectKind === 'unknown' || confidence < 0.5;
    }

    function getAiReviewCandidates() {
        const candidates = state.items.filter(isAiReviewCandidate);
        const safe = candidates.filter((item) => !SENSITIVE_AUTO_MEMORY.test(String(item?.content || '')));
        return { candidates: safe, sensitive: candidates.length - safe.length, reviewed: state.items.filter((item) => item?.v2?.aiReview?.status === 'resolved' || item?.v2?.aiReview?.status === 'unresolved').length };
    }

    function getAiReviewContext(item) {
        const messages = Array.isArray(state.conversations?.[item.bindingId]) ? state.conversations[item.bindingId] : [];
        const sourceIds = new Set((Array.isArray(item.sourceRefs) ? item.sourceRefs : []).map((ref) => String(ref?.messageId || '')).filter(Boolean));
        const selected = new Set();
        messages.forEach((message, index) => {
            const id = String(message?.id || message?.msgId || message?.localId || '');
            if (!sourceIds.has(id)) return;
            for (let offset = -2; offset <= 2; offset += 1) { const next = index + offset; if (next >= 0 && next < messages.length) selected.add(next); }
        });
        const names = getDisplayNames(item.bindingId);
        return Array.from(selected).sort((a,b)=>a-b).slice(0,8).map((index) => {
            const message = messages[index];
            const actor = getMessageActor(message);
            const speaker = actor === 'user' ? names.user : actor === 'character' ? names.character : '未知发送方';
            return speaker + '：' + normalizeText(message?.text).slice(0,420);
        }).filter((line) => !line.endsWith('：'));
    }

    function buildAiReviewPayload(items) {
        return items.map((item) => {
            const names = getDisplayNames(item.bindingId);
            return { id: item.id, userName: names.user, characterName: names.character, memory: normalizeText(item.content).slice(0,900), currentSubject: item?.v2?.subjectKind || 'unknown', currentType: item?.v2?.memoryType || item.memoryType || 'fragment', context: getAiReviewContext(item) };
        });
    }

    function parseAiReviewResponse(value) {
        let textValue = String(value || '').trim();
        textValue = textValue.replace(/^```(?:json)?\s*/i, '').replace(/\s*```$/i, '').trim();
        const firstBrace = textValue.indexOf('{');
        const lastBrace = textValue.lastIndexOf('}');
        if (firstBrace >= 0 && lastBrace > firstBrace) textValue = textValue.slice(firstBrace, lastBrace + 1);
        const parsed = JSON.parse(textValue);
        return Array.isArray(parsed) ? parsed : (Array.isArray(parsed?.results) ? parsed.results : []);
    }

    async function requestAiMemoryReview(api, items) {
        const systemPrompt = [
            '你是童话集记忆迁移校对器，只做结构化分类，不改写记忆正文。',
            '根据记忆正文和少量来源上下文判断主体与记忆类型。',
            'subjectKind 只能是 user、character、shared、unknown。',
            'memoryType 只能是 fact、preference、habit、relationship、promise、plan、event、emotion、fragment。',
            '上下文不足以确定他/她/对方是谁时必须返回 unknown，严禁猜测。',
            'confidence 为 0 到 1；note 只写一句可核对依据，不要输出思维过程。',
            '只输出 JSON 对象，格式为 {"results":[{"id":"...","subjectKind":"unknown","memoryType":"fact","confidence":0.4,"note":"上下文未明确主体"}]}。'
        ].join('\n');
        const response = await fetch(normalizeApiCompletionUrl(api.url), { method: 'POST', headers: { Authorization: 'Bearer ' + api.key, 'Content-Type': 'application/json' }, body: JSON.stringify({ model: api.model, temperature: 0.1, messages: [{ role: 'system', content: systemPrompt }, { role: 'user', content: JSON.stringify({ items: buildAiReviewPayload(items) }) }] }) });
        if (!response.ok) { let detail = ''; try { detail = await response.text(); } catch (_) {} throw new Error('AI 请求失败：HTTP ' + response.status + (detail ? ' - ' + detail.replace(/\s+/g, ' ').slice(0,180) : '')); }
        const result = await response.json();
        const raw = result?.choices?.[0]?.message?.content ?? result?.choices?.[0]?.text ?? result?.output_text ?? '';
        return parseAiReviewResponse(raw);
    }

    function applyAiReviewResult(item, result, api, reviewedAt) {
        if (!item?.v2 || item.v2.identityLocked === true) return item;
        const requestedKind = SUBJECT_KINDS.has(String(result?.subjectKind || '')) ? String(result.subjectKind) : 'unknown';
        const confidence = Math.max(0, Math.min(1, Number(result?.confidence) || 0));
        const memoryType = AI_MEMORY_TYPES.has(String(result?.memoryType || '')) ? String(result.memoryType) : (item.v2.memoryType || item.memoryType || 'fragment');
        const resolvedKind = requestedKind !== 'unknown' && confidence >= AI_REVIEW_MIN_CONFIDENCE ? requestedKind : 'unknown';
        const subjectId = subjectIdForKind(item.bindingId, resolvedKind);
        const nextV2 = { ...item.v2, memoryType, subjectKind: resolvedKind, subjectId, identityConfidence: resolvedKind === 'unknown' ? Math.min(confidence,0.55) : confidence, identitySource: resolvedKind === 'unknown' ? 'insufficient_evidence' : 'ai_assisted', stability: stabilityFor(item,memoryType), aiReview: { status: resolvedKind === 'unknown' ? 'unresolved' : 'resolved', confidence, note: normalizeText(result?.note).slice(0,220), model: String(api?.model || ''), reviewedAt } };
        nextV2.dueAt = inferDueAt({ ...item, memoryType, v2: nextV2 }) || 0;
        return { ...item, subjectType: subjectTypeForKind(resolvedKind), subjectId, memoryType, v2: nextV2 };
    }

    async function scanAiReviewCandidates() {
        if (!isCurrentAccountState()) await migrate();
        const found = getAiReviewCandidates();
        const api = await getConnectedMemoryApi();
        return { count: found.candidates.length, skippedSensitive: found.sensitive, alreadyReviewed: found.reviewed, apiConfigured: Boolean(api), apiName: api?.name || '', model: api?.model || '' };
    }

    async function reviewUncertainMemoriesWithAI(options = {}) {
        if (!isCurrentAccountState()) await migrate();
        const accountId = getDynamicUserId();
        const assertAccount = () => { if (accountId !== getDynamicUserId() || state.userId !== accountId) throw new Error('MEMORY_ACCOUNT_CHANGED'); };
        const api = await getConnectedMemoryApi();
        assertAccount();
        if (!api) throw new Error('请先在 API 设置中连接一个可用的聊天模型。');
        const found = getAiReviewCandidates();
        const candidates = found.candidates;
        const total = candidates.length;
        if (!total) return { total:0, processed:0, resolved:0, unresolved:0, failed:0, skippedSensitive:found.sensitive, model:api.model };
        let workingItems = state.items.slice(); let processed=0, resolved=0, unresolved=0, failed=0;
        const reviewedAt = new Date().toISOString();
        for (let offset=0; offset<candidates.length; offset+=AI_REVIEW_BATCH_SIZE) {
            const batch = candidates.slice(offset, offset + AI_REVIEW_BATCH_SIZE);
            try {
                assertAccount();
                const results = await requestAiMemoryReview(api, batch);
                assertAccount();
                const map = new Map(results.map((result)=>[String(result?.id || ''), result]));
                workingItems = workingItems.map((item) => {
                    if (!batch.some((candidate)=>candidate.id===item?.id)) return item;
                    const result = map.get(String(item.id));
                    if (!result) { failed += 1; return item; }
                    const updated = applyAiReviewResult(item,result,api,reviewedAt);
                    if (updated?.v2?.aiReview?.status === 'resolved') resolved += 1; else unresolved += 1;
                    return updated;
                });
            } catch (error) { assertAccount(); console.warn('AI memory review batch failed:', error); failed += batch.length; }
            processed += batch.length;
            const detail = { processed,total,resolved,unresolved,failed,skippedSensitive:found.sensitive,model:api.model };
            if (typeof options.onProgress === 'function') { try { options.onProgress(detail); } catch (_) {} }
            window.dispatchEvent(new CustomEvent('memoryv2:ai-review-progress',{detail}));
        }
        assertAccount();
        if (changed(state.items,workingItems)) {
            if (!await writeMemoryItems(workingItems, accountId)) throw new Error('AI 整理结果保存失败。');
            state.items = workingItems;
            const bindingIds = Array.from(new Set(workingItems.map((item)=>item?.bindingId).filter(Boolean)));
            for (const bindingId of bindingIds.slice(0,24)) await consolidateBinding(bindingId);
            await reconcileMemoryEventLinks();
        }
        if (typeof window.MemoryApp?.preload === 'function') await window.MemoryApp.preload();
        const report = { total,processed,resolved,unresolved,failed,skippedSensitive:found.sensitive,model:api.model,reviewedAt };
        window.dispatchEvent(new CustomEvent('memoryv2:ai-review-complete',{detail:report}));
        return report;
    }
    function isLegacyMemoryItem(item) {
        if (!item || typeof item !== 'object') return false;
        return Number(item.schemaVersion || 0) < SCHEMA_VERSION
            || !item.v2
            || Number(item.v2.version || 0) < 4
            || !SUBJECT_KINDS.has(item.v2.subjectKind);
    }

    function isLegacySummaryRecord(summary) {
        if (!summary || typeof summary !== 'object') return false;
        return Number(summary.schemaVersion || 0) < SCHEMA_VERSION
            || summary?.v2?.indexOnly !== true
            || Number(summary?.v2?.version || 0) < 4;
    }

    async function scanLegacyData() {
        const userId = getDynamicUserId();
        const records = await readRecords([MEMORY_ITEMS_KEY, MEMORY_SUMMARIES_KEY, EVENT_NODES_KEY, MIGRATION_KEY, LEGACY_MIGRATION_BACKUP_KEY]);
        const items = Array.isArray(records[MEMORY_ITEMS_KEY]?.items) ? records[MEMORY_ITEMS_KEY].items : [];
        const summaries = Array.isArray(records[MEMORY_SUMMARIES_KEY]?.items) ? records[MEMORY_SUMMARIES_KEY].items : [];
        const eventNodes = Array.isArray(records[EVENT_NODES_KEY]?.items) ? records[EVENT_NODES_KEY].items : [];
        const legacyItems = items.filter(isLegacyMemoryItem);
        const legacySummaries = summaries.filter(isLegacySummaryRecord);
        const memoryRecordSchema = Number(records[MEMORY_ITEMS_KEY]?.schemaVersion || 0);
        const summaryRecordSchema = Number(records[MEMORY_SUMMARIES_KEY]?.schemaVersion || 0);
        const eventRecordSchema = Number(records[EVENT_NODES_KEY]?.schemaVersion || 0);
        return {
            userId,
            schemaVersion: SCHEMA_VERSION,
            totalItems: items.length,
            totalSummaries: summaries.length,
            totalEventNodes: eventNodes.length,
            legacyItems: legacyItems.length,
            legacySummaries: legacySummaries.length,
            memoryRecordSchema,
            summaryRecordSchema,
            eventRecordSchema,
            alreadyCurrent: legacyItems.length === 0
                && legacySummaries.length === 0
                && (!records[MEMORY_ITEMS_KEY] || memoryRecordSchema === SCHEMA_VERSION)
                && (!records[MEMORY_SUMMARIES_KEY] || summaryRecordSchema === SCHEMA_VERSION)
                && (!records[EVENT_NODES_KEY] || eventRecordSchema === SCHEMA_VERSION),
            backupExists: Boolean(records[LEGACY_MIGRATION_BACKUP_KEY]),
            lastMigration: records[MIGRATION_KEY] || null
        };
    }

    async function createLegacyMigrationBackupIfNeeded(scan) {
        if (!scan || scan.backupExists || (!scan.legacyItems && !scan.legacySummaries)) return false;
        const records = await readRecords([MEMORY_ITEMS_KEY, MEMORY_SUMMARIES_KEY, EVENT_NODES_KEY]);
        const createdAt = new Date().toISOString();
        const backup = {
            id: getIsolatedKey(LEGACY_MIGRATION_BACKUP_KEY),
            backupVersion: 1,
            userId: getDynamicUserId(),
            createdAt,
            sourceSchema: {
                memory: Number(records[MEMORY_ITEMS_KEY]?.schemaVersion || 0),
                summary: Number(records[MEMORY_SUMMARIES_KEY]?.schemaVersion || 0),
                event: Number(records[EVENT_NODES_KEY]?.schemaVersion || 0)
            },
            memoryRecord: records[MEMORY_ITEMS_KEY] || null,
            summaryRecord: records[MEMORY_SUMMARIES_KEY] || null,
            eventNodeRecord: records[EVENT_NODES_KEY] || null
        };
        return writeRecords([backup]);
    }

    async function migrateLegacyData() {
        const startedAt = new Date().toISOString();
        const before = await scanLegacyData();
        const backupCreated = await createLegacyMigrationBackupIfNeeded(before);
        const migration = await migrate(true);
        const bindingIds = Array.from(new Set(state.items.map((item) => String(item?.bindingId || '')).filter(Boolean)));
        let consolidatedBindings = 0;
        for (const bindingId of bindingIds) {
            await consolidateBinding(bindingId);
            consolidatedBindings += 1;
        }
        const lifecycle = await persistLifecycleStates();
        const archivedEvents = await compactEventNodes();
        await reconcileMemoryEventLinks();
        if (typeof window.MemoryApp?.preload === 'function') await window.MemoryApp.preload();
        const after = await scanLegacyData();
        const report = {
            mode: 'local_script',
            startedAt,
            finishedAt: new Date().toISOString(),
            currentSchema: SCHEMA_VERSION,
            scanned: before.totalItems,
            legacyItemsFound: before.legacyItems,
            legacySummariesFound: before.legacySummaries,
            migratedItems: Number(migration?.changed || 0),
            migratedSummaries: Number(migration?.summariesChanged || 0),
            unknownAfterMigration: Number(migration?.unknown || 0),
            eventNodes: state.eventNodes.length,
            consolidatedBindings,
            lifecycleUpdated: Number(lifecycle?.updated || lifecycle || 0),
            archivedEvents: Number(archivedEvents || 0),
            backupCreated,
            backupExists: backupCreated || before.backupExists,
            alreadyCurrentBeforeRun: before.alreadyCurrent,
            alreadyCurrentAfterRun: after.alreadyCurrent
        };
        window.dispatchEvent(new CustomEvent('memoryv2:manual-migration-complete', { detail: report }));
        return report;
    }

    function isCurrentAccountState() {
        return state.userId === getDynamicUserId();
    }

    function getItemByContent(bindingId, content, tier) {
        const clean = normalizeText(String(content || '').replace(/^状态已更新：/, ''));
        return state.items.filter((item) => item && item.bindingId === bindingId && normalizeText(item.content) === clean && (!tier || item.tier === tier)).sort((a, b) => String(b.updatedAt || b.createdAt || '').localeCompare(String(a.updatedAt || a.createdAt || '')))[0] || null;
    }

    function formatItem(item, prefix = '') {
        if (!item) return '';
        const names = getDisplayNames(item.bindingId);
        const subject = item?.v2?.subjectKind || 'unknown';
        const label = subject === 'user' ? `用户（${names.user}）` : subject === 'character' ? `角色（${names.character}）` : subject === 'shared' ? `共同经历（${names.user} ↔ ${names.character}）` : `主体未确认（不要推断为用户或${names.character}）`;
        return `${prefix}${label}：${normalizeText(item.content)}`;
    }

    function labelList(bindingId, values, tier) {
        return (Array.isArray(values) ? values : []).map((value) => {
            const item = getItemByContent(bindingId, value, tier);
            return item ? formatItem(item) : normalizeText(value);
        }).filter(Boolean);
    }

    function addIdentityHeader(bindingId, summary) {
        if (!summary) return summary;
        const names = getDisplayNames(bindingId);
        return `【身份基准】用户=${names.user}；角色=${names.character}。以下内容按来源区分主体；主体未确认的内容不要擅自归到另一方。摘要仅作为检索索引，若摘要与具体记忆冲突，以带来源的具体记忆为准。\n${summary}`;
    }

    function authorityRank(item) {
        return ({ user_confirmed: 5, user_quote: 4, summary_verified: 3, v2_observed: 2 })[item?.authority] || 1;
    }

    function getMemoryTypeLabel(type) {
        return ({
            fact: '事实',
            preference: '偏好',
            habit: '习惯',
            relationship: '关系',
            promise: '承诺',
            plan: '计划',
            event: '事件',
            emotion: '情绪',
            fragment: '片段',
            summary: '摘要'
        })[String(type || '')] || '记忆';
    }

    function getMemoryStateLabel(stateValue) {
        return ({
            active: '活跃',
            dormant: '沉睡',
            awakened: '重新唤醒',
            superseded: '已被替代',
            archived: '已归档'
        })[String(stateValue || '')] || String(stateValue || '活跃');
    }

    function getAuthorityLabel(authority) {
        return ({
            user_confirmed: '用户手动确认',
            user_quote: '聊天原话',
            summary_verified: '摘要提炼',
            v2_observed: '系统巩固'
        })[String(authority || '')] || '自动记录';
    }

    function getIdentitySourceLabel(source) {
        return ({
            identity_locked: '主体已人工锁定',
            source_message: '按原消息发送方判断',
            mixed_source_messages: '来自双方消息',
            legacy_character_subject: '沿用旧角色主体标记',
            explicit_character_name: '正文明确提到角色名',
            explicit_user_name: '正文明确提到用户名',
            verified_summary: '来自带来源的摘要提炼',
            manual_first_person: '手动记录中的第一人称',
            legacy_user_quote: '旧版用户原话记录',
            ambiguous_manual_third_person: '手动记录但第三人称主体不明确',
            manual_user_entry: '用户手动记录',
            insufficient_evidence: '缺少足够主体依据',
            ai_assisted: 'AI 结合有限来源上下文辅助判断'
        })[String(source || '')] || '自动判断';
    }

    function getSubjectTraceLabel(item) {
        const names = getDisplayNames(item?.bindingId);
        const subject = item?.v2?.subjectKind || 'unknown';
        if (subject === 'user') return '用户（' + names.user + '）';
        if (subject === 'character') return '角色（' + names.character + '）';
        if (subject === 'shared') return '共同经历（' + names.user + ' ↔ ' + names.character + '）';
        return '主体未确认';
    }

    function getEntityDisplayLabel(bindingId, entityId) {
        const id = String(entityId || '');
        const names = getDisplayNames(bindingId);
        const fixed = {
            'user:self': names.user,
            ['character:' + bindingId]: names.character,
            'entity:user:mother': '妈妈',
            'entity:user:father': '爸爸',
            'entity:user:parents': '父母',
            'entity:user:roommate': '室友',
            'entity:user:teacher': '老师',
            'entity:user:classmate': '同学',
            'entity:user:friend': '朋友',
            'entity:user:boss': '老板/上司',
            'entity:user:colleague': '同事',
            'entity:user:sibling': '兄弟姐妹',
            'entity:user:grandparent': '祖辈',
            'entity:user:cat': '猫',
            'entity:user:dog': '狗'
        };
        if (fixed[id]) return fixed[id];
        if (id.startsWith('entity:name:')) return id.slice('entity:name:'.length);
        if (id.startsWith('shared:')) return names.user + ' ↔ ' + names.character;
        if (id.startsWith('character:')) return names.character;
        return '';
    }

    function resolveSourceTimestamp(message, ref) {
        const value = message?.time ?? message?.timestamp ?? message?.createdAt ?? message?.date ?? ref?.createdAt ?? '';
        const numeric = Number(value);
        if (Number.isFinite(numeric) && numeric > 0) return numeric < 100000000000 ? numeric * 1000 : numeric;
        const parsed = Date.parse(String(value || ''));
        return Number.isFinite(parsed) ? parsed : 0;
    }

    function getMemorySourceEvidence(item) {
        const refs = Array.isArray(item?.sourceRefs) ? item.sourceRefs : [];
        const messages = Array.isArray(state.conversations?.[item?.bindingId]) ? state.conversations[item.bindingId] : [];
        const byId = new Map(messages.map((message) => [String(message?.id || message?.msgId || message?.localId || ''), message]));
        return refs.slice(-12).map((ref) => {
            const refType = String(ref?.type || '');
            if (refType === 'manual' || refType === 'manual_edit') {
                return {
                    kind: 'manual',
                    sourceType: refType,
                    actor: 'user',
                    actorLabel: '用户手动' + (refType === 'manual_edit' ? '修订' : '添加'),
                    text: normalizeText(item?.content),
                    timestamp: resolveSourceTimestamp(null, ref),
                    live: true
                };
            }
            const messageId = String(ref?.messageId || '');
            const message = messageId ? byId.get(messageId) : null;
            const actor = message ? getMessageActor(message) : '';
            const names = getDisplayNames(item?.bindingId);
            const actorLabel = actor === 'user'
                ? '用户（' + names.user + '）'
                : actor === 'character'
                    ? '角色（' + names.character + '）'
                    : refType === 'summary_source'
                        ? '摘要来源消息'
                        : '来源消息';
            return {
                kind: 'message',
                sourceType: refType || 'message',
                messageId,
                actor,
                actorLabel,
                text: normalizeText(message?.text || ref?.quote || ''),
                timestamp: resolveSourceTimestamp(message, ref),
                live: Boolean(message)
            };
        }).filter((entry) => entry.kind === 'manual' || entry.text || entry.messageId);
    }

    function getTraceEventNode(item) {
        const nodeId = String(item?.v2?.eventNodeId || '');
        if (!nodeId) return null;
        const node = state.eventNodes.find((entry) => entry?.id === nodeId);
        if (!node || !eventVisibleToBinding(node, item.bindingId)) return null;
        return {
            id: node.id,
            status: node.status,
            state: node.visibleState || node.state,
            text: node.canonicalText,
            latestText: node.latestText || '',
            dueAt: Number(node.visibleDueAt) || 0,
            sourceApps: node.visibleSourceApps || [],
            relationshipStage: node.visibleRelationshipStage || '',
            relationshipLabel: node.visibleRelationshipLabel || '',
            observationCount: (node.observations || []).filter((observation) => observation?.access !== 'private').length
        };
    }

    function calculateMemoryEvidence(item, sources, eventNode) {
        const authority = String(item?.authority || '');
        let score = ({
            user_confirmed: 0.95,
            user_quote: 0.84,
            summary_verified: 0.62,
            v2_observed: 0.68
        })[authority] || 0.5;
        const liveSources = sources.filter((source) => source.live && source.kind === 'message').length;
        const quotedSources = sources.filter((source) => source.kind === 'message' && source.text).length;
        const manualSources = sources.filter((source) => source.kind === 'manual').length;
        if (liveSources) score += Math.min(0.08, liveSources * 0.03);
        else if (quotedSources) score += 0.02;
        if (manualSources || authority === 'user_confirmed') score = Math.max(score, 0.96);
        const reinforcementCount = Math.max(0, Number(item?.v2?.reinforcementCount) || 0);
        if (reinforcementCount > 1) score += Math.min(0.06, (reinforcementCount - 1) * 0.015);
        if (eventNode && eventNode.sourceApps.length > 1) score += 0.035;
        const identityConfidence = Math.max(0, Math.min(1, Number(item?.v2?.identityConfidence) || 0));
        score = score * 0.82 + identityConfidence * 0.18;
        if (authority === 'summary_verified') score = Math.min(score, 0.78);
        if (item?.v2?.subjectKind === 'unknown') score = Math.min(score, 0.52);
        score = Math.max(0.2, Math.min(0.99, score));

        const reasons = [];
        if (authority === 'user_confirmed') reasons.push('这条记忆由用户手动确认。');
        else if (liveSources) reasons.push('可以回溯到 ' + liveSources + ' 条仍存在的原始聊天消息。');
        else if (quotedSources) reasons.push('原消息当前不可直接读取，但仍保留来源引用或原句摘录。');
        if (authority === 'summary_verified') reasons.push('这条记忆由摘要提炼而来，摘要本身不是事实证据。');
        if (authority === 'v2_observed') reasons.push('这条记忆由重复片段或稳定模式巩固形成。');
        if (reinforcementCount > 1) reasons.push('相近内容曾重复出现 ' + reinforcementCount + ' 次。');
        if (eventNode) reasons.push('已关联到事件节点“' + normalizeText(eventNode.text).slice(0, 80) + '”。');
        if (eventNode?.sourceApps?.length > 1) reasons.push('该事件由多个 App 的记录共同支持。');
        if (item?.v2?.identityLocked === true) reasons.push('主体由用户手动纠正并已锁定，自动识别不会覆盖。');
        if (item?.v2?.identitySource === 'ai_assisted') {
            reasons.push('主体由 AI 根据这条记忆及有限来源上下文辅助判断，用户仍可手动纠正。');
            if (item?.v2?.aiReview?.note) reasons.push('AI 校对依据：' + normalizeText(item.v2.aiReview.note).slice(0, 120));
        }
        if (item?.v2?.eventLinkBlocked === true) reasons.push('用户已解除事件关联并阻止自动重新挂载。');
        if (item?.v2?.subjectKind === 'unknown') reasons.push('主体仍未确认，因此不会自动归到用户或角色。');
        if (item?.status === 'superseded') reasons.push('这条记忆已经被更新版本替代。');
        else if (item?.status === 'archived') reasons.push('这条记忆当前已归档，不参与正常召回。');

        const percent = Math.round(score * 100);
        return {
            score: percent,
            level: percent >= 85 ? 'high' : percent >= 65 ? 'medium' : 'low',
            label: percent >= 85 ? '高' : percent >= 65 ? '中' : '低',
            note: '仅表示来源可追溯程度与主体确定性，不代表现实真伪。',
            reasons
        };
    }

    function getMemoryTrace(memoryId) {
        const item = state.items.find((entry) => entry?.id === String(memoryId || ''));
        if (!item) return null;
        const sources = getMemorySourceEvidence(item);
        const eventNode = getTraceEventNode(item);
        const evidence = calculateMemoryEvidence(item, sources, eventNode);
        const entityLabels = Array.from(new Set((item?.v2?.entityIds || [])
            .map((id) => getEntityDisplayLabel(item.bindingId, id))
            .filter(Boolean)));
        return {
            id: item.id,
            bindingId: item.bindingId,
            content: item.content,
            tier: item.tier,
            status: item.status,
            authority: item.authority,
            authorityLabel: getAuthorityLabel(item.authority),
            memoryType: item?.v2?.memoryType || item.memoryType || 'fragment',
            memoryTypeLabel: getMemoryTypeLabel(item?.v2?.memoryType || item.memoryType || 'fragment'),
            subjectKind: item?.v2?.subjectKind || 'unknown',
            subjectLabel: getSubjectTraceLabel(item),
            identitySource: item?.v2?.identitySource || '',
            identitySourceLabel: getIdentitySourceLabel(item?.v2?.identitySource || ''),
            identityConfidence: Math.round(Math.max(0, Math.min(1, Number(item?.v2?.identityConfidence) || 0)) * 100),
            identityLocked: item?.v2?.identityLocked === true,
            identityCorrectedAt: item?.v2?.identityCorrectedAt || '',
            eventLinkBlocked: item?.v2?.eventLinkBlocked === true,
            eventLinkBlockedAt: item?.v2?.eventLinkBlockedAt || '',
            memoryState: computedMemoryState(item),
            memoryStateLabel: getMemoryStateLabel(computedMemoryState(item)),
            evidence,
            sources,
            entities: entityLabels,
            eventNode,
            reinforcementCount: Math.max(0, Number(item?.v2?.reinforcementCount) || 0),
            createdAt: item.createdAt || '',
            updatedAt: item.updatedAt || ''
        };
    }

    function getEventNodeTrace(nodeId, bindingId = '') {
        const node = state.eventNodes.find((entry) => entry?.id === String(nodeId || ''));
        if (!node) return null;
        if (bindingId && !eventVisibleToBinding(node, bindingId)) return null;
        const visibleObservations = (node.observations || [])
            .filter((observation) => observation?.access !== 'private')
            .map((observation) => ({
                sourceApp: observation.sourceApp,
                sourceId: observation.sourceId,
                actor: observation.actor,
                text: observation.text,
                occurredAt: observation.occurredAt
            }));
        const linkedMemories = state.items
            .filter((item) => item?.v2?.eventNodeId === node.id && (!bindingId || item.bindingId === bindingId))
            .map((item) => {
                const sources = getMemorySourceEvidence(item);
                const evidence = calculateMemoryEvidence(item, sources, null);
                return {
                    id: item.id,
                    content: item.content,
                    memoryType: item?.v2?.memoryType || item.memoryType || 'fragment',
                    memoryTypeLabel: getMemoryTypeLabel(item?.v2?.memoryType || item.memoryType || 'fragment'),
                    subjectLabel: getSubjectTraceLabel(item),
                    evidence: { score: evidence.score, level: evidence.level, label: evidence.label },
                    status: item.status
                };
            });
        return {
            id: node.id,
            status: node.status,
            state: bindingId ? (node.visibleState || node.state) : node.state,
            text: node.canonicalText,
            latestText: node.latestText || '',
            sourceApps: bindingId ? (node.visibleSourceApps || []) : (node.sourceApps || []),
            observations: visibleObservations,
            linkedMemories,
            updatedAt: node.updatedAt || ''
        };
    }

    function sourceRefKey(ref) {
        return [ref?.type || '', ref?.messageId || '', ref?.summaryId || '', ref?.quote || ''].join('|');
    }

    function mergeSourceRefs(left, right) {
        const map = new Map();
        [...(Array.isArray(left) ? left : []), ...(Array.isArray(right) ? right : [])].forEach((ref) => { if (ref) map.set(sourceRefKey(ref), ref); });
        return Array.from(map.values()).slice(-12);
    }

    function preferenceSignature(item) {
        if (item?.v2?.memoryType !== 'preference') return null;
        let value = normalizeText(item.content).toLowerCase();
        const negative = /不喜欢吃|不喜欢|不爱吃|讨厌/.test(value);
        const positive = /喜欢吃|喜欢|爱吃|最爱|最喜欢|偏好/.test(value);
        if (!negative && !positive) return null;
        value = value.replace(/不喜欢吃|不喜欢|不爱吃|讨厌|喜欢吃|喜欢|爱吃|最喜欢|最爱|偏好/g, '').replace(/^(我|我的|用户|角色|他|她|本人|咱)+/, '').replace(/[，。！？、,.!?\s]/g, '').replace(/^(现在|最近|一直|真的|特别|非常)+/, '').replace(/[了的呢啊呀吧]+$/g, '');
        return !value || value.length > 60 ? null : { key: value, polarity: negative ? -1 : 1 };
    }

    function fragmentKey(item) {
        const type = item?.v2?.memoryType || item?.memoryType || 'fact';
        const subject = item?.v2?.subjectKind || 'unknown';
        const preference = preferenceSignature(item);
        if (preference) return `${subject}|${type}|${preference.key}|${preference.polarity}`;
        return `${subject}|${type}|${createTerms(item?.content).slice(0, 6).sort().join('/')}`;
    }

    function canPromoteFragment(item, sameKeyCount) {
        if (!item || item.tier !== 'L3' || item.status !== 'active' || Number(item?.v2?.candidateScore) < 0.78) return false;
        const type = item.v2.memoryType;
        if (item.v2.subjectKind === 'unknown' || type === 'fragment' || SENSITIVE_AUTO_MEMORY.test(item.content)) return false;
        if (UNRESOLVED_TYPES.has(type) || type === 'relationship') return true;
        if (type === 'fact' && /我(?:才|已经|今年)?(?:是|叫|读|学|工作|来自|大[一二三四]|高[一二三]|初[一二三])/.test(item.content)) return true;
        return (type === 'preference' || type === 'habit') && (sameKeyCount >= 2 || /一直|总是|每天|通常|最喜欢|最爱|特别|非常/.test(item.content));
    }

    function createPromotedMemory(fragment, now) {
        return migrateItem({
            id: 'memory_v2_' + Date.now() + '_' + Math.random().toString(36).slice(2, 8), schemaVersion: SCHEMA_VERSION,
            bindingId: fragment.bindingId, kind: 'memory', tier: 'L1', status: 'active', authority: 'v2_observed',
            subjectType: fragment.subjectType, subjectId: fragment.subjectId, visibility: 'current_binding', content: fragment.content,
            lifecycle: UNRESOLVED_TYPES.has(fragment.v2.memoryType) ? { kind: 'event', state: 'open' } : { kind: 'stable', state: 'open' },
            keywords: createTerms(fragment.content), sourceRefs: mergeSourceRefs([], fragment.sourceRefs), revision: 1,
            retrievalStats: { injectedCount: 0, lastInjectedAt: '', lastInjectedTurn: '', lastScore: 0, lastReasons: [] }, memoryType: fragment.v2.memoryType,
            v2: { ...fragment.v2, version: 5, memoryState: 'active', confidence: Math.max(0.72, Number(fragment.v2.confidence) || 0), reinforcementCount: 1, promotedFrom: fragment.id, promotedAt: now },
            createdAt: now, updatedAt: now
        }, state.contacts, state.conversations, now);
    }

    function consolidateItems(items, bindingId) {
        const now = new Date().toISOString();
        let next = items.map((item) => item);
        const scoped = () => next.filter((item) => item && item.bindingId === bindingId && item.status === 'active');
        const exact = new Map();
        scoped().filter((item) => item.tier === 'L1').forEach((item) => {
            const key = `${item?.v2?.subjectKind || ''}|${item?.v2?.memoryType || ''}|${normalizeText(item.content).toLowerCase()}`;
            if (!exact.has(key)) exact.set(key, []);
            exact.get(key).push(item);
        });
        exact.forEach((group) => {
            if (group.length < 2) return;
            const sorted = group.slice().sort((a, b) => authorityRank(b) - authorityRank(a) || String(b.updatedAt || '').localeCompare(String(a.updatedAt || '')));
            const keeper = sorted[0];
            const duplicates = new Set(sorted.slice(1).map((item) => item.id));
            const refs = sorted.reduce((all, item) => mergeSourceRefs(all, item.sourceRefs), []);
            next = next.map((item) => item.id === keeper.id ? { ...item, sourceRefs: refs, updatedAt: now, v2: { ...item.v2, reinforcementCount: Math.max(Number(item.v2?.reinforcementCount) || 0, group.length), confidence: Math.min(0.98, 0.72 + group.length * 0.06), reinforcedAt: now } } : duplicates.has(item.id) ? { ...item, status: 'superseded', archiveReason: 'v2_duplicate', supersededBy: keeper.id, updatedAt: now, v2: { ...item.v2, memoryState: 'superseded', supersededReason: 'duplicate' } } : item);
        });
        const preferences = new Map();
        scoped().filter((item) => item.tier === 'L1' && item?.v2?.memoryType === 'preference').forEach((item) => {
            const sig = preferenceSignature(item);
            if (!sig) return;
            const key = `${item.v2.subjectKind}|${sig.key}`;
            if (!preferences.has(key)) preferences.set(key, []);
            preferences.get(key).push({ item, sig });
        });
        preferences.forEach((group) => {
            if (new Set(group.map((entry) => entry.sig.polarity)).size < 2) return;
            const newest = group.slice().sort((a, b) => String(b.item.updatedAt || '').localeCompare(String(a.item.updatedAt || '')))[0].item;
            next = next.map((item) => group.some((entry) => entry.item.id === item.id) && item.id !== newest.id ? { ...item, status: 'superseded', archiveReason: 'v2_conflict', supersededBy: newest.id, updatedAt: now, v2: { ...item.v2, memoryState: 'superseded', supersededReason: 'preference_changed' } } : item);
        });
        return { items: next, promoted: 0, changed: changed(items, next), at: now };
    }

    async function consolidateBinding(bindingId) {
        if (!bindingId) return null;
        await migrate();
        const result = consolidateItems(state.items, bindingId);
        if (result.changed && await writeMemoryItems(result.items)) state.items = result.items;
        state.lastConsolidation = { bindingId, promoted: result.promoted, changed: result.changed, at: result.at };
        return state.lastConsolidation;
    }

    function resolutionTerms(item) {
        return createTerms(item?.content).filter((term) => !['明天', '后天', '周末', '计划', '准备', '打算', '答应', '约定'].includes(term)).slice(0, 12);
    }

    async function resolveOpenItemsFromTurn(bindingId, sourceMessages) {
        const userText = (Array.isArray(sourceMessages) ? sourceMessages : []).filter((message) => getMessageActor(message) === 'user' || String(message?.type || '') === 'sent').map((message) => normalizeText(message?.text)).filter(Boolean).join(' ');
        if (!userText || (!COMPLETE_MARKER.test(userText) && !CANCEL_MARKER.test(userText))) return 0;
        const resolution = CANCEL_MARKER.test(userText) ? 'cancelled' : 'completed';
        const userTerms = new Set(createTerms(userText));
        let closed = 0;
        const now = new Date().toISOString();
        const next = state.items.map((item) => {
            if (!item || item.bindingId !== bindingId || item.status !== 'active' || item.tier !== 'L1' || !UNRESOLVED_TYPES.has(item?.v2?.memoryType) || item?.lifecycle?.state === 'closed') return item;
            if (resolutionTerms(item).filter((term) => userTerms.has(term)).length < 1) return item;
            closed += 1;
            return { ...item, lifecycle: { ...(item.lifecycle || {}), state: 'closed', endedAt: now, resolution }, updatedAt: now, v2: { ...item.v2, memoryState: 'active', resolvedAt: now, resolution } };
        });
        if (closed && await writeMemoryItems(next)) {
            state.items = next;
            state.lastLifecycleUpdate = { bindingId, closed, resolution, at: now };
        }
        return closed;
    }

    async function persistLifecycleStates() {
        const now = Date.now();
        let changedCount = 0;
        const next = state.items.map((item) => {
            if (!item?.v2 || item.status !== 'active') return item;
            const computed = computedMemoryState(item, now);
            if (computed === item.v2.memoryState) return item;
            changedCount += 1;
            return { ...item, v2: { ...item.v2, memoryState: computed, memoryStateUpdatedAt: new Date(now).toISOString() } };
        });
        if (changedCount && await writeMemoryItems(next)) state.items = next;
        return changedCount;
    }

    function relationshipStage(content) {
        const relation = explicitRelationshipStage(content);
        return relation ? [relation.stage, relation.label] : ['unknown', ''];
    }

    function getRelationshipHistory(bindingId, limit = 8) {
        const memoryEntries = state.items
            .filter((item) => item && item.bindingId === bindingId && item.tier === 'L1' && (item?.v2?.memoryType || item?.memoryType) === 'relationship' && item.status === 'active')
            .map((item) => {
                const [stage, label] = relationshipStage(normalizeText(item.content));
                return { id: item.id, stage, label, content: item.content, at: item.createdAt || item.updatedAt || '', status: item.status, source: 'memory' };
            }).filter(entry => entry.stage !== 'unknown');
        const eventEntries = state.eventNodes
            .filter((node) => node && node.status === 'active' && eventVisibleToBinding(node, bindingId) && node.visibleRelationshipStage)
            .map((node) => ({
                id: 'event:' + node.id,
                stage: node.visibleRelationshipStage,
                label: node.visibleRelationshipLabel || relationshipStage(node.visibleRelationshipText || node.canonicalText)[1],
                content: node.visibleRelationshipText || node.canonicalText,
                at: node.visibleRelationshipAt || node.updatedAt || node.createdAt || '',
                status: 'active',
                source: node.manualOverride?.relationshipStage ? 'manual_override' : 'event_node',
                eventNodeId: node.id
            }));
        const ordered = [...memoryEntries, ...eventEntries]
            .sort((left, right) => String(left.at || '').localeCompare(String(right.at || '')));
        const deduped = [];
        ordered.forEach((entry) => {
            const previous = deduped[deduped.length - 1];
            const previousAt = Date.parse(previous?.at || '');
            const currentAt = Date.parse(entry.at || '');
            const sameStage = previous && previous.stage === entry.stage;
            const closeInTime = Number.isFinite(previousAt) && Number.isFinite(currentAt) && Math.abs(currentAt - previousAt) <= 6 * 60 * 60 * 1000;
            const sameText = previous && normalizeText(previous.content).toLowerCase() === normalizeText(entry.content).toLowerCase();
            if (sameStage && (closeInTime || sameText)) {
                if (previous.source !== 'memory' && entry.source === 'memory') deduped[deduped.length - 1] = entry;
                return;
            }
            deduped.push(entry);
        });
        return deduped.slice(-Math.max(1, Math.min(20, Number(limit) || 8)));
    }

    function getRelationshipState(bindingId) {
        const history = getRelationshipHistory(bindingId, 20).filter((entry) => entry.status === 'active');
        return history[history.length - 1] || { stage: 'unknown', label: '', id: '', content: '', at: '', source: '' };
    }

    function getEventActor(node) {
        const visible = (node?.observations || []).filter((observation) => observation?.access !== 'private');
        const open = visible.slice().reverse().find((observation) => observation.state === 'open');
        const latest = open || visible[visible.length - 1];
        return ['user', 'character', 'shared'].includes(latest?.actor) ? latest.actor : 'shared';
    }

    function getCurrentState(bindingId, now = Date.now()) {
        if (!isCurrentAccountState()) return { bindingId, relationship: null, userOpenItems: [], characterOpenItems: [], sharedOpenItems: [], recentChanges: [] };
        const visibleNodes = state.eventNodes
            .filter((node) => node && node.status === 'active' && eventVisibleToBinding(node, bindingId))
            .sort((left, right) => String(right.updatedAt || '').localeCompare(String(left.updatedAt || '')));
        const openItems = visibleNodes
            .filter((node) => node.visibleState === 'open')
            .slice(0, 6)
            .map((node) => ({
                id: node.id,
                actor: getEventActor(node),
                text: node.canonicalText,
                dueAt: Number(node.visibleDueAt) || 0,
                sourceApps: node.visibleSourceApps || []
            }));
        const recentCutoff = now - 7 * 86400000;
        const recentChanges = visibleNodes
            .filter((node) => {
                if (!['completed', 'cancelled', 'occurred'].includes(node.visibleState)) return false;
                const timestamp = Date.parse(node.updatedAt || node.createdAt || '');
                return Number.isFinite(timestamp) && timestamp >= recentCutoff;
            })
            .slice(0, 4)
            .map((node) => ({
                id: node.id,
                state: node.visibleState,
                actor: getEventActor(node),
                text: node.canonicalText || node.latestText,
                latestText: node.latestText || '',
                at: node.updatedAt || '',
                sourceApps: node.visibleSourceApps || []
            }));
        return {
            bindingId,
            relationship: getRelationshipState(bindingId),
            userOpenItems: openItems.filter((entry) => entry.actor === 'user'),
            characterOpenItems: openItems.filter((entry) => entry.actor === 'character'),
            sharedOpenItems: openItems.filter((entry) => entry.actor === 'shared'),
            recentChanges
        };
    }

    function buildCurrentStatePrompt(bindingId) {
        const current = getCurrentState(bindingId);
        const lines = ['【当前状态投影】以下仅来自明确记录的事件状态，不推测未表达的心理或关系。'];
        if (current.relationship?.stage && current.relationship.stage !== 'unknown') {
            lines.push('关系：' + current.relationship.label + '｜' + normalizeText(current.relationship.content));
        }
        const formatOpen = (label, values) => {
            const items = values.slice(0, 2).map((entry) => {
                const due = entry.dueAt ? '｜时间：' + new Date(entry.dueAt).toISOString() : '';
                return normalizeText(entry.text) + due;
            });
            if (items.length) lines.push(label + '：' + items.join('；'));
        };
        formatOpen('用户待续', current.userOpenItems);
        formatOpen('角色待续', current.characterOpenItems);
        formatOpen('共同待续', current.sharedOpenItems);
        if (current.recentChanges.length) {
            const stateLabels = { completed: '已完成', cancelled: '已取消', occurred: '已发生' };
            lines.push('最近变化：' + current.recentChanges.slice(0, 3).map((entry) => {
                const base = normalizeText(entry.text);
                const latest = normalizeText(entry.latestText);
                const detail = latest && latest !== base ? base + ' → ' + latest : base;
                return (stateLabels[entry.state] || entry.state) + '｜' + detail;
            }).join('；'));
        }
        return lines.length > 1 ? lines.join('\n') : '';
    }

    function getDueItems(bindingId, now = Date.now()) {
        return state.items.filter((item) => item && item.bindingId === bindingId && item.status === 'active' && item.tier === 'L1' && UNRESOLVED_TYPES.has(item?.v2?.memoryType) && item?.lifecycle?.state !== 'closed').map((item) => ({ item, dueAt: Number(item?.v2?.dueAt) || inferDueAt(item) })).filter(({ dueAt }) => dueAt > 0 && dueAt - now <= DUE_SOON_MS && now - dueAt <= DUE_RECENTLY_MS).sort((a, b) => Math.abs(a.dueAt - now) - Math.abs(b.dueAt - now));
    }

    function getEntityMatches(bindingId, query, limit = 2) {
        const queryIds = new Set(extractEntityIds(bindingId, query));
        if (!queryIds.size) return [];
        const neighborWeights = getGraphNeighborWeights(bindingId, queryIds);
        const queryTerms = new Set(createTerms(query));
        return state.items.filter((item) => item && item.bindingId === bindingId && item.status === 'active' && item.tier === 'L1').map((item) => {
            const itemIds = new Set([...(item?.v2?.entityIds || []), ...extractEntityIds(bindingId, item.content)]);
            let directOverlap = 0;
            let graphBoost = 0;
            queryIds.forEach((id) => { if (itemIds.has(id)) directOverlap += 1; });
            neighborWeights.forEach((weight, id) => { if (itemIds.has(id)) graphBoost += Math.min(3, weight) * 4; });
            if (!directOverlap && !graphBoost) return null;
            let lexical = 0;
            const itemTerms = new Set(createTerms(item.content));
            queryTerms.forEach((term) => { if (itemTerms.has(term)) lexical += 1; });
            const memoryState = computedMemoryState(item);
            return { item, memoryState, directOverlap, graphBoost, score: directOverlap * 16 + graphBoost + lexical * 5 + authorityRank(item) + (Number(item?.v2?.importance) || 0.4) * 5 - (memoryState === 'dormant' ? 3 : 0) };
        }).filter(Boolean).sort((a, b) => b.score - a.score).slice(0, Math.max(1, Math.min(5, Number(limit) || 2)));
    }

    async function awakenItem(item, turnId) {
        if (!isCurrentAccountState() || !item || computedMemoryState(item) !== 'dormant') return;
        const accountId = state.userId;
        const now = new Date().toISOString();
        const next = state.items.map((entry) => entry.id === item.id ? { ...entry, v2: { ...entry.v2, memoryState: 'awakened', lastAwakenedAt: now }, updatedAt: entry.updatedAt } : entry);
        if (getDynamicUserId() !== accountId) return;
        if (await writeMemoryItems(next) && getDynamicUserId() === accountId) {
            state.items = next;
            state.lastWake = { id: item.id, bindingId: item.bindingId, at: now, turnId: String(turnId || '') };
        }
    }

    function runtimePenalty(item) {
        const entry = runtimeActivation.get(item.id);
        if (!entry) return 0;
        const elapsed = Date.now() - entry.at;
        return elapsed < 120000 ? 18 : elapsed < 600000 ? 8 : Math.min(5, entry.count || 0);
    }

    function scoreRelevant(item, query) {
        if (!item || item.status !== 'active' || item?.v2?.subjectKind === 'unknown') return -Infinity;
        const queryTerms = new Set(createTerms(query));
        let matched = 0;
        createTerms(item.content).forEach((term) => { if (queryTerms.has(term)) matched += 1; });
        const type = item?.v2?.memoryType || item?.memoryType || 'fact';
        const typeBoost = (/关系|我们|恋人|朋友|在一起|分手|复合/.test(query) && type === 'relationship' ? 12 : 0) + (/明天|后天|周末|计划|约好|答应|记得/.test(query) && UNRESOLVED_TYPES.has(type) ? 12 : 0) + (/喜欢|讨厌|爱吃|偏好|习惯/.test(query) && (type === 'preference' || type === 'habit') ? 10 : 0) + (/难过|开心|生气|害怕|焦虑|想念/.test(query) && type === 'emotion' ? 8 : 0);
        if (!matched && !typeBoost) return -Infinity;
        const timestamp = Date.parse(item.updatedAt || item.createdAt || '');
        const ageDays = Number.isFinite(timestamp) ? Math.max(0, (Date.now() - timestamp) / 86400000) : 30;
        return matched * 9 + typeBoost + (Number(item?.v2?.importance) || 0.4) * 7 + (Number(item?.v2?.confidence) || 0.5) * 5 + authorityRank(item) + Math.max(0, 5 - ageDays / 7) + (UNRESOLVED_TYPES.has(type) && item?.lifecycle?.state !== 'closed' ? 7 : 0);
    }

    function retrieveRelevant(bindingId, query, limit = 3) {
        if (!query) return [];
        return state.items.filter((item) => item && item.bindingId === bindingId && item.status === 'active' && item.tier === 'L1').map((item) => ({ item, score: scoreRelevant(item, query) })).filter((entry) => Number.isFinite(entry.score) && entry.score >= 17).sort((a, b) => b.score - a.score).slice(0, Math.max(1, Math.min(4, Number(limit) || 3)));
    }

    function unique(values, limit) {
        const seen = new Set();
        const output = [];
        for (const value of values) {
            const key = normalizeText(value).replace(/^(待续事项|临近事项|相关记忆|实体关联记忆|被话题唤起的旧记忆|关系状态|跨 App 事件|跨 App 临近事项)[^：]*：/, '').toLowerCase();
            if (!key || seen.has(key)) continue;
            seen.add(key);
            output.push(value);
            if (output.length >= limit) break;
        }
        return output;
    }

    function promptExtras(bindingId) {
        const extras = [];
        const due = getDueItems(bindingId)[0];
        if (due) extras.push(formatItem(due.item, `临近事项（${due.dueAt <= Date.now() ? '刚到时间' : '临近时间'}，仅在自然时机提及）：`));
        const dueEventNode = getDueEventNode(bindingId);
        if (dueEventNode) extras.push(formatEventNode(dueEventNode, '跨 App 临近事项：'));
        const relation = getRelationshipState(bindingId);
        if (relation.id) {
            const item = state.items.find((entry) => entry?.id === relation.id);
            if (item) extras.push(formatItem(item, `关系状态（${relation.label}，以已记录事实为准）：`));
        }
        return extras.slice(0, 2);
    }

    async function relevantExtras(bindingId, query, turnId, limit = 3) {
        const entity = getEntityMatches(bindingId, query, 3);
        const lexical = retrieveRelevant(bindingId, query, 3);
        const eventNodes = getRelevantEventNodes(bindingId, query, 3);
        const vectorMatches = await getSemanticMatches(bindingId, query, limit).catch(() => []);
        const result = [];
        const seen = new Set();
        const add = (key, value) => {
            if (!value || seen.has(key)) return;
            seen.add(key);
            result.push(value);
        };
        if (eventNodes.length) add('event:' + eventNodes[0].node.id, formatEventNode(eventNodes[0].node));
        for (const match of vectorMatches) {
            const key = match.entry.kind + ':' + match.entry.sourceId;
            add(key, formatSemanticMatch(match, bindingId));
        }
        for (const entry of [...entity, ...lexical]) {
            const item = entry.item;
            if (!item || item.status !== 'active') continue;
            const dormant = computedMemoryState(item) === 'dormant';
            if (dormant) await awakenItem(item, turnId);
            add('memory:' + item.id, formatItem(item, dormant ? '被话题唤起的旧记忆：' : '相关记忆：'));
        }
        for (const entry of eventNodes.slice(1)) add('event:' + entry.node.id, formatEventNode(entry.node));
        return isCurrentAccountState() ? result.slice(0, Math.max(1, Math.min(6, Number(limit) || 3))) : [];
    }
    function getEventSyncPayload(node, bindingId = '') {
        if (!node?.id) return null;
        const requestedBinding = String(bindingId || '');
        const isDeletion = node.status === 'archived' && ['source_removed', 'remote_deleted'].includes(String(node.archiveReason || ''));
        if (isDeletion) {
            if (requestedBinding && (node.bindingIds || []).length && !(node.bindingIds || []).includes(requestedBinding)) return null;
            return {
                id: node.id,
                schemaVersion: SCHEMA_VERSION,
                status: 'archived',
                archiveReason: node.archiveReason,
                deletedAt: node.deletedAt || node.updatedAt || '',
                updatedAt: node.updatedAt || node.deletedAt || '',
                createdAt: node.createdAt || '',
                bindingIds: Array.isArray(node.bindingIds) ? node.bindingIds.filter(Boolean) : [],
                scope: node.scope || ((node.bindingIds || []).length ? 'binding' : 'global'),
                observations: [],
                canonicalText: '',
                latestText: ''
            };
        }
        if (!eventVisibleToBinding(node, requestedBinding)) return null;
        const visibleObservations = (node.observations || []).filter((observation) => {
            if (observation?.access === 'private') return false;
            if (!requestedBinding) return true;
            return !observation.bindingId || String(observation.bindingId) === requestedBinding;
        });
        if (!visibleObservations.length) return null;
        const rebuilt = rebuildEventNode({
            ...node,
            observations: visibleObservations,
            manualOverride: node.manualOverride ? { ...node.manualOverride } : null
        }, visibleObservations);
        return {
            ...rebuilt,
            observations: visibleObservations,
            entityIds: rebuilt.visibleEntityIds || [],
            terms: rebuilt.visibleTerms || [],
            topicAnchors: rebuilt.visibleTopicAnchors || [],
            sourceApps: rebuilt.visibleSourceApps || []
        };
    }

    function eventSyncContent(node) {
        if (!node) return '';
        if (node.status === 'archived' && ['source_removed', 'remote_deleted'].includes(String(node.archiveReason || ''))) {
            return '[童话集事件已删除] ' + String(node.id || '');
        }
        return JSON.stringify({
            text: normalizeText(node.canonicalText),
            latestText: normalizeText(node.latestText),
            state: node.visibleState || node.state || '',
            status: node.status || 'active',
            dueAt: Number(node.visibleDueAt || node.dueAt) || 0,
            relationship: node.visibleRelationshipStage || '',
            manualUpdatedAt: node.manualOverride?.updatedAt || '',
            sources: (node.observations || []).map((observation) => [
                observation.sourceApp || '',
                observation.sourceId || '',
                normalizeText(observation.text),
                observation.occurredAt || ''
            ]),
            updatedAt: node.updatedAt || ''
        });
    }

    function eventNodeToSyncRecord(node, bindingId = '') {
        const payload = getEventSyncPayload(node, bindingId);
        if (!payload) return null;
        const recordBindingId = String(bindingId || payload.bindingIds?.[0] || '');
        if (!recordBindingId) return null;
        const deleted = payload.status === 'archived' && ['source_removed', 'remote_deleted'].includes(String(payload.archiveReason || ''));
        const timestamp = Date.parse(payload.updatedAt || payload.createdAt || '');
        return {
            id: 'eventnode:' + payload.id,
            eventNodeId: payload.id,
            bindingId: recordBindingId,
            kind: 'event_node',
            tier: 'L1',
            status: deleted ? 'archived' : 'active',
            content: eventSyncContent(payload),
            recordType: 'event_node',
            eventNode: payload,
            revision: Number.isFinite(timestamp) ? Math.max(1, Math.floor(timestamp / 1000)) : 1,
            createdAt: payload.createdAt || payload.updatedAt || new Date().toISOString(),
            updatedAt: payload.updatedAt || payload.createdAt || new Date().toISOString(),
            archiveReason: deleted ? payload.archiveReason : ''
        };
    }

    function eventObservationKey(observation) {
        return String(observation?.sourceApp || '') + ':' + String(observation?.sourceId || '');
    }

    function mergeSyncedEventNodePair(localNode, incomingNode) {
        const localTime = Date.parse(localNode?.updatedAt || localNode?.createdAt || '') || 0;
        const incomingTime = Date.parse(incomingNode?.updatedAt || incomingNode?.createdAt || '') || 0;
        const incomingIsDeletion = incomingNode?.status === 'archived' && ['source_removed', 'remote_deleted'].includes(String(incomingNode?.archiveReason || ''));
        const localIsDeletion = localNode?.status === 'archived' && ['source_removed', 'remote_deleted'].includes(String(localNode?.archiveReason || ''));
        if (incomingIsDeletion && incomingTime >= localTime) {
            return createEventNodeTombstone({ ...localNode, ...incomingNode, id: localNode.id }, incomingNode.archiveReason || 'remote_deleted', incomingNode.updatedAt || new Date().toISOString());
        }
        if (localIsDeletion && localTime > incomingTime) return localNode;

        const incomingPreferred = incomingTime >= localTime;
        const observationMap = new Map();
        const addObservations = (values, overwrite) => {
            (Array.isArray(values) ? values : []).forEach((observation) => {
                const key = eventObservationKey(observation);
                if (!key || key === ':') return;
                if (!observationMap.has(key) || overwrite) observationMap.set(key, observation);
            });
        };
        addObservations(incomingPreferred ? localNode?.observations : incomingNode?.observations, false);
        addObservations(incomingPreferred ? incomingNode?.observations : localNode?.observations, true);

        const localManualTime = Date.parse(localNode?.manualOverride?.updatedAt || '') || 0;
        const incomingManualTime = Date.parse(incomingNode?.manualOverride?.updatedAt || '') || 0;
        const manualOverride = incomingManualTime >= localManualTime
            ? (incomingNode?.manualOverride ? { ...incomingNode.manualOverride } : localNode?.manualOverride || null)
            : (localNode?.manualOverride ? { ...localNode.manualOverride } : incomingNode?.manualOverride || null);
        const base = incomingPreferred ? incomingNode : localNode;
        return rebuildEventNode({
            ...base,
            id: localNode.id,
            manualOverride,
            archiveReason: base?.archiveReason || '',
            compactedAt: base?.compactedAt || ''
        }, Array.from(observationMap.values()));
    }

    function normalizeSyncedEventRecord(record) {
        if (!record || (record.recordType !== 'event_node' && record.kind !== 'event_node')) return null;
        const raw = record.eventNode && typeof record.eventNode === 'object' ? record.eventNode : null;
        const eventNodeId = String(raw?.id || record.eventNodeId || String(record.id || '').replace(/^eventnode:/, ''));
        if (!eventNodeId) return null;
        if (record.status === 'archived' && ['source_removed', 'remote_deleted'].includes(String(record.archiveReason || raw?.archiveReason || ''))) {
            return createEventNodeTombstone({
                ...(raw || {}),
                id: eventNodeId,
                bindingIds: Array.isArray(raw?.bindingIds) && raw.bindingIds.length ? raw.bindingIds : [record.bindingId].filter(Boolean),
                scope: raw?.scope || 'binding',
                updatedAt: record.updatedAt || raw?.updatedAt || new Date().toISOString()
            }, record.archiveReason || raw?.archiveReason || 'remote_deleted', record.updatedAt || raw?.updatedAt || new Date().toISOString());
        }
        if (!raw) return null;
        return hydrateEventNode({ ...raw, id: eventNodeId, updatedAt: record.updatedAt || raw.updatedAt || '' });
    }

    async function mergeSyncedEventRecords(records) {
        const incomingRecords = (Array.isArray(records) ? records : []).filter((record) => record && (record.recordType === 'event_node' || record.kind === 'event_node'));
        if (!incomingRecords.length) return { count: 0, aliases: new Map(), touchedNodeIds: [] };
        let next = state.eventNodes.slice();
        const aliases = new Map();
        const touched = new Set();

        incomingRecords.forEach((record) => {
            const incomingNode = normalizeSyncedEventRecord(record);
            if (!incomingNode) return;
            const incomingId = incomingNode.id;
            let index = next.findIndex((node) => node.id === incomingId);

            if (index < 0 && (incomingNode.observations || []).length) {
                const incomingKeys = new Set((incomingNode.observations || []).map(eventObservationKey).filter((key) => key && key !== ':'));
                index = next.findIndex((node) => (node.observations || []).some((observation) => incomingKeys.has(eventObservationKey(observation))));
            }

            if (index >= 0) {
                const localNode = next[index];
                aliases.set(incomingId, localNode.id);
                const merged = mergeSyncedEventNodePair(localNode, incomingNode);
                next[index] = merged;
                touched.add(merged.id);
            } else {
                next.push(incomingNode);
                aliases.set(incomingId, incomingId);
                touched.add(incomingId);
            }
        });

        if (!changed(state.eventNodes, next)) return { count: incomingRecords.length, aliases, touchedNodeIds: Array.from(touched) };
        if (!await writeEventNodes(next)) return { count: 0, aliases: new Map(), touchedNodeIds: [] };
        state.eventNodes = next;
        return { count: incomingRecords.length, aliases, touchedNodeIds: Array.from(touched) };
    }

    function runEvaluation() {
        const now = new Date().toISOString();
        const oldItems = state.items;
        const oldContacts = state.contacts;
        const oldAddressBookContacts = state.addressBookContacts;
        const oldUserMasks = state.userMasks;
        const oldConversations = state.conversations;
        const oldSummaries = state.summaries;
        const oldEventNodes = state.eventNodes;
        const oldUser = state.userId;
        try {
            state.userId = getDynamicUserId();
            state.contacts = new Map([['role-a', { id: 'role-a', linkedContactId: 'address-role-a', name: '微信同步名', remark: '微信备注名' }]]);
            state.addressBookContacts = new Map([['address-role-a', { id: 'address-role-a', name: '通讯录角色名' }]]);
            state.userMasks = new Map([[getDynamicUserId(), { id: getDynamicUserId(), name: '用户面具名' }]]);
            state.conversations = { 'role-a': [{ id: 'u1', type: 'sent', text: '我才大二' }, { id: 'c1', type: 'received', text: '我不喜欢巧克力' }] };
            const fixture = (id, content, extras = {}) => ({ id, bindingId: 'role-a', content, kind: 'memory', tier: 'L1', status: 'active', authority: 'user_confirmed', sourceRefs: [], createdAt: now, updatedAt: now, ...extras });
            const user = inferIdentity(fixture('u', '我才大二', { authority: 'user_quote', sourceRefs: [{ messageId: 'u1' }] }), state.contacts, state.conversations);
            const character = inferIdentity(fixture('c', '我不喜欢巧克力', { tier: 'L3', authority: 'user_quote', sourceRefs: [{ messageId: 'c1' }] }), state.contacts, state.conversations);
            const named = extractEntityIds('role-a', '我的室友叫张三，他今天又忘带钥匙');
            const plan = migrateItem(fixture('plan', '明天要考试', { authority: 'user_quote' }), state.contacts, state.conversations, now);
            const namedRoommate = migrateItem(fixture('named-roommate', '我的室友叫张三', { authority: 'user_quote' }), state.contacts, state.conversations, now);
            const roommateEvent = migrateItem(fixture('roommate-event', '室友上次借了我的钥匙', { authority: 'user_quote' }), state.contacts, state.conversations, now);
            const evidenceFact = migrateItem(fixture('evidence-fact', '我才大二', { authority: 'user_quote', sourceRefs: [{ messageId: 'u1' }] }), state.contacts, state.conversations, now);
            state.items = enrichKnownNamedEntities([
                migrateItem(fixture('old', '我妈上次因为学习的事情说了我', { authority: 'user_quote', createdAt: '2026-06-01T00:00:00.000Z', updatedAt: '2026-06-01T00:00:00.000Z' }), state.contacts, state.conversations, now),
                plan,
                migrateItem(fixture('rel1', '我们是朋友'), state.contacts, state.conversations, now),
                migrateItem(fixture('rel2', '我们已经在一起，是恋人', { updatedAt: '2026-09-01T00:00:00.000Z' }), state.contacts, state.conversations, now),
                namedRoommate,
                roommateEvent,
                evidenceFact
            ]);
            state.summaries = [migrateSummary({
                id: 'summary-role-a', bindingId: 'role-a', slot: 'working', tier: 'L2', status: 'active',
                sourceMessageIds: ['u1'], sections: [{ title: '近况', content: '用户正在读大学。', sourceMessageIds: ['u1'], timeRange: { start: now, end: now } }],
                createdAt: now, updatedAt: now
            }, now)];
            const graphMatches = getEntityMatches('role-a', '张三又忘带钥匙了', 5);
            const summaryIndex = buildSummaryIndexPrompt('role-a', true);
            const baselineRelationshipHistory = getRelationshipHistory('role-a');
            const baselineRelationshipState = getRelationshipState('role-a');

            const planObservation = createEventObservation({
                sourceApp: 'wechat',
                sourceId: 'wechat-plan',
                bindingId: 'role-a',
                actor: 'user',
                text: '明天要考试',
                occurredAt: now
            });
            const planMerge = mergeEventObservation([], planObservation);
            const diaryCompletion = createEventObservation({
                sourceApp: 'diary',
                sourceId: 'diary-complete',
                actor: 'user',
                text: '今天考完了',
                occurredAt: new Date(Date.parse(now) + 3600000).toISOString(),
                visibility: '公开'
            });
            const crossAppMerge = mergeEventObservation(planMerge.nodes, diaryCompletion);
            const crossAppNode = crossAppMerge.node;

            const moviePlan = createEventObservation({
                sourceApp: 'wechat',
                sourceId: 'movie-plan',
                bindingId: 'role-a',
                actor: 'user',
                text: '明天准备去看电影',
                occurredAt: now
            });
            const movieNode = mergeEventObservation([], moviePlan);
            const homeworkCompletion = createEventObservation({
                sourceApp: 'diary',
                sourceId: 'homework-complete',
                actor: 'user',
                text: '今天作业做完了',
                occurredAt: new Date(Date.parse(now) + 3600000).toISOString()
            });
            const unrelatedResolution = mergeEventObservation(movieNode.nodes, homeworkCompletion);

            const privatePlan = createEventObservation({
                sourceApp: 'diary',
                sourceId: 'private-plan',
                actor: 'user',
                text: '明天要和张三见面',
                occurredAt: now,
                visibility: '私人',
                private: true
            });
            const privateMerge = mergeEventObservation([], privatePlan);
            const smsObservation = createEventObservation({
                sourceApp: 'sms',
                sourceId: 'sms-topic',
                bindingId: 'role-a',
                actor: 'user',
                text: '张三刚刚见到了',
                occurredAt: new Date(Date.parse(now) + 7200000).toISOString()
            });
            const privateThenKnown = mergeEventObservation(privateMerge.nodes, smsObservation).node;

            const relationshipEvent = rebuildEventNode(null, [createEventObservation({
                sourceApp: 'meeting',
                sourceId: 'relationship-change',
                bindingId: 'role-a',
                actor: 'shared',
                text: '我们分手了',
                occurredAt: new Date(Date.parse(now) + 10800000).toISOString()
            })]);
            state.eventNodes = [relationshipEvent, crossAppNode, unrelatedResolution.nodes.find((node) => node.state === 'open')].filter(Boolean);
            const relationshipFromEvent = getRelationshipState('role-a');
            const currentState = getCurrentState('role-a', Date.parse(now) + 10800000);
            const statePrompt = buildCurrentStatePrompt('role-a');
            const casualFriendEvent = rebuildEventNode(null, [createEventObservation({
                sourceApp: 'meeting',
                sourceId: 'friend-meal',
                bindingId: 'role-a',
                actor: 'user',
                text: '今天和朋友吃了顿饭',
                occurredAt: new Date(Date.parse(now) + 14400000).toISOString()
            })]);

            const manualBase = rebuildEventNode(null, [createEventObservation({
                sourceApp: 'wechat',
                sourceId: 'manual-base',
                bindingId: 'role-a',
                actor: 'user',
                text: '明天准备去看电影',
                occurredAt: now
            })]);
            const manualEdited = rebuildEventNode({
                ...manualBase,
                manualOverride: normalizedManualEventPatch(manualBase, {
                    text: '周六去看电影',
                    state: 'completed',
                    dueAt: 0,
                    relationshipStage: 'auto'
                })
            }, manualBase.observations);
            const oldResolved = rebuildEventNode(null, [createEventObservation({
                sourceApp: 'wechat',
                sourceId: 'old-resolved',
                bindingId: 'role-a',
                actor: 'user',
                text: '考试结束了',
                occurredAt: '2025-01-01T00:00:00.000Z'
            })]);
            const oldRelationship = rebuildEventNode(null, [createEventObservation({
                sourceApp: 'meeting',
                sourceId: 'old-relationship',
                bindingId: 'role-a',
                actor: 'shared',
                text: '我们分手了',
                occurredAt: '2025-01-01T00:00:00.000Z'
            })]);
            const compactedFixture = compactEventNodeList([oldResolved, oldRelationship], Date.parse('2026-10-02T00:00:00.000Z'));
            const splitFixture = splitEventObservation(crossAppMerge.nodes, crossAppNode.id, 'diary', 'diary-complete');
            const traceMemory = state.items.find((item) => item.id === 'evidence-fact');
            traceMemory.v2 = { ...traceMemory.v2, eventNodeId: crossAppNode.id };
            state.eventNodes = [relationshipEvent, crossAppNode, unrelatedResolution.nodes.find((node) => node.state === 'open')].filter(Boolean);
            const memoryTrace = getMemoryTrace('evidence-fact');
            const eventTrace = getEventNodeTrace(crossAppNode.id, 'role-a');
            const characterCorrected = applyMemoryIdentityOverride(evidenceFact, 'character', now);
            const characterCorrectedMigrated = migrateItem(characterCorrected, state.contacts, state.conversations, now);
            const blockedEventMemory = blockMemoryEventLinkRecord({ ...evidenceFact, v2: { ...evidenceFact.v2, eventNodeId: crossAppNode.id } }, now);
            const manualIdentityFixture = migrateItem(fixture('manual-identity-reset', '她最近有点忙', {
                authority: 'user_confirmed',
                sourceRefs: [{ type: 'manual', createdAt: now }]
            }), state.contacts, state.conversations, now);
            const manuallyCharacter = applyMemoryIdentityOverride(manualIdentityFixture, 'character', now);
            const resetManualIdentity = clearMemoryIdentityOverride(manuallyCharacter, now);
            const syncedPrivateMix = eventNodeToSyncRecord(privateThenKnown, 'role-a');
            const deletedEventRecord = eventNodeToSyncRecord(createEventNodeTombstone(crossAppNode, 'source_removed', now), 'role-a');
            const aiFixture = migrateItem(fixture('ai-review-fixture', '她不喜欢巧克力', {
                authority: 'user_confirmed',
                sourceRefs: [{ type: 'manual', createdAt: now }]
            }), state.contacts, state.conversations, now);
            const aiResolvedFixture = applyAiReviewResult(aiFixture, {
                id: 'ai-review-fixture',
                subjectKind: 'character',
                memoryType: 'preference',
                confidence: 0.91,
                note: '上下文明确指向当前角色'
            }, { model: 'test-model' }, now);
            const aiUnresolvedFixture = applyAiReviewResult(aiFixture, {
                id: 'ai-review-fixture',
                subjectKind: 'character',
                memoryType: 'preference',
                confidence: 0.45,
                note: '证据不足'
            }, { model: 'test-model' }, now);

            const cases = [
                { name: '用户身份', pass: user.subjectKind === 'user' },
                { name: '角色身份', pass: character.subjectKind === 'character' },
                { name: '具体人名实体', pass: named.includes('entity:name:张三') && named.includes('entity:user:roommate') },
                { name: '旧事件 dormant', pass: computedMemoryState(state.items[0]) === 'dormant' },
                { name: '计划时间', pass: Number(plan.v2.dueAt) > 0 },
                { name: '关系历史', pass: baselineRelationshipHistory.length === 2 && baselineRelationshipState.stage === 'partners' },
                { name: '实体图谱可由人名关联到室友旧事件', pass: graphMatches.some((entry) => entry.item?.id === 'roommate-event') },
                { name: '摘要仅作索引并附带来源记忆', pass: summaryIndex.includes('摘要索引') && summaryIndex.includes('不可单独作为事实') && summaryIndex.includes('我才大二') },
                { name: '跨 App 同一事件合并为单节点', pass: crossAppMerge.nodes.length === 1 && crossAppNode?.state === 'completed' && crossAppNode?.sourceApps?.includes('wechat') && crossAppNode?.sourceApps?.includes('diary') },
                { name: '不同主题的完成事件不会误关唯一待办', pass: unrelatedResolution.nodes.length === 2 && unrelatedResolution.nodes.some((node) => node.state === 'open' && node.canonicalText.includes('电影')) && unrelatedResolution.nodes.some((node) => node.state === 'completed' && node.canonicalText.includes('作业')) },
                { name: '私人日记节点不直接暴露给角色', pass: privateMerge.node?.scope === 'private' && eventVisibleToBinding(privateMerge.node, 'role-a') === false },
                { name: '私人来源与已知渠道合并后不泄露原句', pass: privateThenKnown?.scope === 'binding' && privateThenKnown?.canonicalText === '张三刚刚见到了' && privateThenKnown?.visibleDueAt === 0 && privateThenKnown?.visibleSourceApps?.length === 1 && privateThenKnown.visibleSourceApps[0] === 'sms' },
                { name: '明确跨 App 关系事件进入关系历史', pass: relationshipFromEvent.stage === 'separated' && relationshipFromEvent.source === 'event_node' },
                { name: '普通提到朋友不会误判双方关系', pass: !casualFriendEvent.visibleRelationshipStage },
                { name: '事件节点可投影当前待续与最近变化', pass: currentState.userOpenItems.some((entry) => entry.text.includes('电影')) && currentState.recentChanges.some((entry) => entry.text.includes('考试')) },
                { name: '当前状态投影可进入摘要索引层', pass: statePrompt.includes('当前状态投影') && statePrompt.includes('已分开') },
                { name: '手动事件修订可覆盖文本状态和时间', pass: manualEdited.canonicalText === '周六去看电影' && manualEdited.visibleState === 'completed' && manualEdited.visibleDueAt === 0 && manualEdited.manualOverride?.authority === 'user_confirmed' && manualEdited.visibleTopicAnchors.includes('meeting') === false && manualEdited.visibleTerms.some((term) => term.includes('电影')) },
                { name: '旧普通事件会压缩归档但关系事件保留', pass: compactedFixture.nodes.find((node) => node.id === oldResolved.id)?.status === 'archived' && compactedFixture.nodes.find((node) => node.id === oldRelationship.id)?.status === 'active' },
                { name: '误关联来源可手动拆分且不删除来源', pass: splitFixture.nodes.length === 2 && splitFixture.sourceNode?.sourceApps?.includes('wechat') && !splitFixture.sourceNode?.sourceApps?.includes('diary') && splitFixture.detachedNode?.sourceApps?.includes('diary') },
                { name: '记忆证据链可回溯原消息和关联事件', pass: memoryTrace?.sources?.some((source) => source.messageId === 'u1' && source.actor === 'user') && memoryTrace?.eventNode?.id === crossAppNode.id && memoryTrace?.evidence?.score >= 80 },
                { name: '事件节点可反查关联记忆', pass: eventTrace?.linkedMemories?.some((memory) => memory.id === 'evidence-fact') },
                { name: '手动主体纠正锁定后不会被自动推断覆盖', pass: characterCorrectedMigrated?.v2?.subjectKind === 'character' && characterCorrectedMigrated?.v2?.identityLocked === true && characterCorrectedMigrated?.v2?.identityConfidence === 1 },
                { name: '手动解除事件关联后阻止自动重挂', pass: blockedEventMemory?.v2?.eventLinkBlocked === true && !blockedEventMemory?.v2?.eventNodeId && canAutoLinkMemoryToEventNode(blockedEventMemory, crossAppNode) === false },
                { name: '恢复自动主体会清除人工顶层标记并重新判断', pass: resetManualIdentity?.v2?.identityLocked !== true && resetManualIdentity?.v2?.subjectKind === 'unknown' && resetManualIdentity?.subjectType === 'unknown' },
                { name: 'Event 同步不会带出私人 observation', pass: syncedPrivateMix?.eventNode?.observations?.length === 1 && syncedPrivateMix.eventNode.observations[0].sourceApp === 'sms' && !JSON.stringify(syncedPrivateMix).includes('明天要和张三见面') },
                { name: 'Event 删除墓碑可驱动远端删除', pass: deletedEventRecord?.status === 'archived' && deletedEventRecord?.archiveReason === 'source_removed' },
                { name: '旧版记忆扫描只标记未升级记录', pass: isLegacyMemoryItem({ schemaVersion: 3, content: '旧记忆' }) === true && isLegacyMemoryItem(evidenceFact) === false },
                { name: 'AI 高置信度可辅助确认主体且不锁死人为状态', pass: aiResolvedFixture?.v2?.subjectKind === 'character' && aiResolvedFixture?.v2?.identitySource === 'ai_assisted' && aiResolvedFixture?.v2?.identityLocked !== true && aiResolvedFixture?.v2?.memoryType === 'preference' },
                { name: 'AI 低置信度不会强行猜主体', pass: aiUnresolvedFixture?.v2?.subjectKind === 'unknown' && aiUnresolvedFixture?.v2?.aiReview?.status === 'unresolved' },
                { name: '记忆显示名优先使用通讯录角色名和用户面具名', pass: getDisplayNames('role-a').character === '通讯录角色名' && getDisplayNames('role-a').user === '用户面具名' }
            ];
            return { passed: cases.every((entry) => entry.pass), cases };
        } finally {
            state.items = oldItems;
            state.contacts = oldContacts;
            state.addressBookContacts = oldAddressBookContacts;
            state.userMasks = oldUserMasks;
            state.conversations = oldConversations;
            state.summaries = oldSummaries;
            state.eventNodes = oldEventNodes;
            state.userId = oldUser;
        }
    }

    function installWrappers() {
        const app = window.MemoryApp;
        if (!app || app.__memoryUnifiedV2Wrapped) return false;
        const original = {
            preload: app.preload, refresh: app.refresh, enqueueChatTurn: app.enqueueChatTurn, completeChatTurn: app.completeChatTurn,
            completeSummary: app.completeSummary, mergeSyncRecords: app.mergeSyncRecords, getSyncSnapshot: app.getSyncSnapshot,
            getPromptMemories: app.getPromptMemories, getPromptSummary: app.getPromptSummary, getCurrentPromptSummary: app.getCurrentPromptSummary,
            getRelevantFragments: app.getRelevantFragments, getRelevantFragmentsAsync: app.getRelevantFragmentsAsync,
            getRetrievalStatus: app.getRetrievalStatus
        };
        if (typeof original.enqueueChatTurn === 'function') {
            app.enqueueChatTurn = async function (payload) {
                if (payload?.turnId) turnBindings.set(String(payload.turnId), { bindingId: String(payload.bindingId || ''), sourceMessages: Array.isArray(payload.sourceMessages) ? payload.sourceMessages : [] });
                return original.enqueueChatTurn.apply(this, arguments);
            };
        }
        if (typeof original.completeChatTurn === 'function') {
            app.completeChatTurn = async function (turnId) {
                const result = await original.completeChatTurn.apply(this, arguments);
                const turn = turnBindings.get(String(turnId || ''));
                turnBindings.delete(String(turnId || ''));
                if (result) {
                    await migrate(true);
                    if (turn?.bindingId) {
                        await observeChatTurnEvents(turn.bindingId, turn.sourceMessages, turnId);
                        await resolveOpenItemsFromTurn(turn.bindingId, turn.sourceMessages);
                        await consolidateBinding(turn.bindingId);
                    }
                    if (typeof original.preload === 'function') await original.preload.call(app);
                }
                return result;
            };
        }
        if (typeof original.completeSummary === 'function') {
            app.completeSummary = async function (job) {
                const result = await original.completeSummary.apply(this, arguments);
                if (result) {
                    await migrate(true);
                    if (job?.bindingId) await consolidateBinding(job.bindingId);
                    if (typeof original.preload === 'function') await original.preload.call(app);
                }
                return result;
            };
        }
        if (typeof original.getSyncSnapshot === 'function') {
            app.getSyncSnapshot = function (bindingId, scope = {}) {
                const base = original.getSyncSnapshot.apply(this, arguments);
                if (!isCurrentAccountState()) {
                    void migrate(true);
                    return base;
                }
                const eventRecords = state.eventNodes
                    .map((node) => eventNodeToSyncRecord(node, bindingId))
                    .filter(Boolean);
                const existingIds = new Set((Array.isArray(base) ? base : []).map((record) => String(record?.id || '')));
                return [...(Array.isArray(base) ? base : []), ...eventRecords.filter((record) => !existingIds.has(record.id))];
            };
        }
        if (typeof original.mergeSyncRecords === 'function') {
            app.mergeSyncRecords = async function (records, options = {}) {
                const incoming = Array.isArray(records) ? records : [];
                const eventRecords = incoming.filter((record) => record && (record.recordType === 'event_node' || record.kind === 'event_node'));
                const syncEvents = eventRecords.length ? await mergeSyncedEventRecords(eventRecords) : { count: 0, aliases: new Map(), touchedNodeIds: [] };
                const normalRecords = incoming
                    .filter((record) => !record || (record.recordType !== 'event_node' && record.kind !== 'event_node'))
                    .map((record) => {
                        const eventNodeId = record?.v2?.eventNodeId;
                        const alias = eventNodeId ? syncEvents.aliases.get(String(eventNodeId)) : '';
                        if (!alias || alias === eventNodeId) return record;
                        return { ...record, v2: { ...record.v2, eventNodeId: alias } };
                    });
                const memoryResult = normalRecords.length
                    ? await original.mergeSyncRecords.call(this, normalRecords, options)
                    : 0;
                const total = (Number(memoryResult) || 0) + (Number(syncEvents.count) || 0);
                if (total) {
                    await migrate(true);
                    await reconcileMemoryEventLinks();
                    for (const nodeId of syncEvents.touchedNodeIds || []) {
                        const node = state.eventNodes.find((entry) => entry.id === nodeId);
                        if (node?.status === 'active') await linkMemoryItemsToEventNode(node);
                    }
                    const bindingIds = Array.from(new Set(incoming.map((item) => item?.bindingId).filter(Boolean))).slice(0, 6);
                    for (const bindingId of bindingIds) await consolidateBinding(bindingId);
                    if (typeof original.preload === 'function') await original.preload.call(app);
                }
                return total;
            };
        }
        if (typeof original.preload === 'function') {
            app.preload = async function () {
                const result = await original.preload.apply(this, arguments);
                await migrate();
                return result;
            };
        }
        if (typeof original.refresh === 'function') {
            app.refresh = async function () {
                const result = await original.refresh.apply(this, arguments);
                await migrate();
                return result;
            };
        }
        if (typeof original.getPromptMemories === 'function') {
            app.getPromptMemories = function (bindingId, limit = 6) {
                if (!isCurrentAccountState()) { void migrate(true); return []; }
                const originals = labelList(bindingId, original.getPromptMemories.apply(this, arguments), 'L1');
                return unique([...promptExtras(bindingId), ...originals], Math.max(1, Math.min(12, Number(limit) || 6)));
            };
        }
        if (typeof original.getRetrievalStatus === 'function') {
            app.getRetrievalStatus = function (bindingId) {
                const originalStatus = original.getRetrievalStatus.apply(this, arguments);
                const backend = semanticBackend();
                const rawBackend = window.SemanticMemory?.getEmbeddingBackend?.();
                const semanticActive = Boolean(backend && semanticIndex.loaded &&
                    semanticIndex.account === getDynamicUserId() && semanticIndex.version === backend.version);
                const indexedCount = semanticActive
                    ? semanticIndex.entries.filter((entry) => entry.bindingId === String(bindingId) ||
                        (entry.kind === 'event' && eventVisibleToBinding(state.eventNodes.find((node) => node.id === entry.sourceId), bindingId))).length
                    : 0;
                if (backend) scheduleSemanticIndex();
                return {
                    ...originalStatus,
                    mode: indexedCount ? (backend?.mode === 'remote' ? 'remote-vector' : 'semantic') : 'curated-memory',
                    semanticReady: Boolean(backend),
                    semanticStatus: backend ? (indexedCount ? 'ready' : 'indexing') : (rawBackend?.status === 'error' ? 'degraded' : 'not-configured'),
                    semanticRuntimeStatus: rawBackend?.runtimeStatus || 'idle',
                    semanticRuntimeMode: rawBackend?.runtimeMode || 'idle',
                    embeddingBackend: backend?.mode || 'disabled',
                    embeddingModel: backend?.model || '',
                    semanticVectorCount: indexedCount
                };
            };
        }
        if (typeof original.getRelevantFragments === 'function') {
            app.getRelevantFragments = function (bindingId, query, limit = 3) {
                if (!isCurrentAccountState()) { void migrate(true); return []; }
                const memoryExtras = getEntityMatches(bindingId, query, 2).map(({ item }) => formatItem(item, '相关记忆：'));
                const eventExtras = getRelevantEventNodes(bindingId, query, 2).map(({ node }) => formatEventNode(node));
                return unique([...eventExtras, ...memoryExtras], Math.max(1, Math.min(6, Number(limit) || 3)));
            };
        }

            if (typeof original.getRelevantFragmentsAsync === 'function') {
            app.getRelevantFragmentsAsync = async function (bindingId, query, limit = 3, turnId = '') {
                if (!isCurrentAccountState()) await migrate(true);
                if (!isCurrentAccountState()) return [];
                const extras = await relevantExtras(bindingId, query, turnId, limit);
                if (!isCurrentAccountState()) return [];
                return unique(extras, Math.max(1, Math.min(6, Number(limit) || 3)));
            };
        }

            if (typeof original.getPromptSummary === 'function') app.getPromptSummary = function (bindingId) {
            if (!isCurrentAccountState()) { void migrate(true); return ''; }
            const indexed = buildSummaryIndexPrompt(bindingId, false);
            return addIdentityHeader(bindingId, indexed || original.getPromptSummary.apply(this, arguments));
        };
        if (typeof original.getCurrentPromptSummary === 'function') app.getCurrentPromptSummary = function (bindingId) {
            if (!isCurrentAccountState()) { void migrate(true); return ''; }
            const indexed = buildSummaryIndexPrompt(bindingId, true);
            return addIdentityHeader(bindingId, indexed || original.getCurrentPromptSummary.apply(this, arguments));
        };
        Object.defineProperty(app, '__memoryUnifiedV2Wrapped', { value: true, configurable: false });
        state.installed = true;
        return true;
    }

    async function bootstrap() {
        if (!window.MemoryApp) return false;
        await migrate();
        await persistLifecycleStates();
        await compactEventNodes();
        if (typeof window.MemoryApp.preload === 'function') await window.MemoryApp.preload();
        state.lastEvaluation = runEvaluation();
        if (!state.lastEvaluation.passed) console.warn('Memory Engine V2 evaluation failed:', state.lastEvaluation);
        installWrappers();
        scheduleSemanticIndex();
        window.dispatchEvent(new CustomEvent('memoryv2:ready', { detail: { userId: state.userId, migration: state.lastMigration, evaluation: state.lastEvaluation } }));
        return true;
    }

    window.addEventListener('contacts:characters-deleted', event => {
        if (!event.detail?.recordsPurged || !window.CharacterRecordCleanup) return;
        state.items = window.CharacterRecordCleanup.clean({ id: MEMORY_ITEMS_KEY, items: state.items }).items;
        state.summaries = window.CharacterRecordCleanup.clean({ id: MEMORY_SUMMARIES_KEY, items: state.summaries }).items;
        state.eventNodes = window.CharacterRecordCleanup.clean({ id: EVENT_NODES_KEY, items: state.eventNodes }).items;
        runtimeActivation.clear(); eventRuntimeActivation.clear(); semanticQueryCache.clear();
        semanticIndex.entries = []; semanticIndex.loaded = false;
        void Promise.resolve(state.migrationPromise).catch(() => {}).then(() => migrate(true))
            .catch(error => console.warn('Deleted character memory index refresh failed:', error));
    });

    window.MemoryV2 = Object.freeze({
        __unifiedEngine: true,
        migrate: () => migrate(true),
        scanLegacyData: () => scanLegacyData(),
        migrateLegacyData: () => migrateLegacyData(),
        scanAiReviewCandidates: () => scanAiReviewCandidates(),
        reviewUncertainMemoriesWithAI: (options = {}) => reviewUncertainMemoriesWithAI(options),
        consolidate: (bindingId) => consolidateBinding(bindingId),
        retrieve: (bindingId, query, limit = 4) => retrieveRelevant(bindingId, query, limit).map(({ item, score }) => ({ id: item.id, score, memoryType: item?.v2?.memoryType, subjectKind: item?.v2?.subjectKind, memoryState: computedMemoryState(item), content: item.content })),
        getEntityMatches: (bindingId, query, limit = 3) => getEntityMatches(bindingId, query, limit).map(({ item, score, memoryState }) => ({ id: item.id, score, memoryState, memoryType: item?.v2?.memoryType, entities: item?.v2?.entityIds || [], content: item.content })),
        getRelationshipState,
        getRelationshipHistory,
        getCurrentState,
        getEntityGraph: (bindingId) => buildEntityGraph(bindingId),
        getSummaryIndex: (bindingId, currentOnly = false) => buildSummaryIndexPrompt(bindingId, Boolean(currentOnly)),
        getSemanticRebuildStatus: (bindingId) => getSemanticRebuildStatus(bindingId),
        rebuildSemanticIndex: (bindingId, options = {}) => rebuildSemanticIndex(bindingId, options),
        refreshSemanticIndex: () => scheduleSemanticIndex(),
        getMemoryTrace: (memoryId) => getMemoryTrace(memoryId),
        getEventNodeTrace: (nodeId, bindingId = '') => getEventNodeTrace(nodeId, bindingId),
        updateMemoryIdentity: (memoryId, subjectKind) => updateMemoryIdentity(memoryId, subjectKind),
        resetMemoryIdentity: (memoryId) => resetMemoryIdentity(memoryId),
        blockMemoryEventLink: (memoryId) => blockMemoryEventLink(memoryId),
        resetMemoryEventLink: (memoryId) => resetMemoryEventLink(memoryId),
        observeExternalEvent: (payload) => observeExternalEvent(payload),
        removeExternalEventObservation: (payload) => removeExternalEventObservation(payload),
        removeExternalEventObservations: (payload) => removeExternalEventObservations(payload),
        detachEventObservation: (nodeId, sourceApp, sourceId) => detachEventObservation(nodeId, sourceApp, sourceId),
        createManualEvent: (payload) => createManualEvent(payload),
        updateEventNode: (nodeId, patch) => updateEventNode(nodeId, patch),
        resetEventNodeOverride: (nodeId) => resetEventNodeOverride(nodeId),
        archiveEventNode: (nodeId) => archiveEventNode(nodeId),
        restoreEventNode: (nodeId) => restoreEventNode(nodeId),
        deleteEventNode: (nodeId) => deleteEventNode(nodeId),
        setRelationshipOverride: (bindingId, stage, content = '') => setRelationshipOverride(bindingId, stage, content),
        clearRelationshipOverride: (bindingId) => clearRelationshipOverride(bindingId),
        compactEventNodes: () => compactEventNodes(),
        getEventNodes: (bindingId = '', includeArchived = false) => state.eventNodes.filter((node) => (includeArchived || node.status === 'active') && (!bindingId || eventVisibleToBinding(node, bindingId))).map((node) => ({ id: node.id, status: node.status, state: bindingId ? (node.visibleState || node.state) : node.state, canonicalText: node.canonicalText, latestText: node.latestText, dueAt: bindingId ? (node.visibleDueAt || 0) : (node.dueAt || 0), bindingIds: node.bindingIds || [], sourceApps: bindingId ? (node.visibleSourceApps || []) : (node.sourceApps || []), entityIds: bindingId ? (node.visibleEntityIds || []) : (node.entityIds || []), relationshipStage: node.visibleRelationshipStage || '', relationshipLabel: node.visibleRelationshipLabel || '', relationshipText: node.visibleRelationshipText || '', manualEdited: Boolean(node.manualOverride), manualHidden: node.manualOverride?.hidden === true, manualState: node.manualOverride?.state || '', manualDueAt: Object.prototype.hasOwnProperty.call(node.manualOverride || {}, 'dueAt') ? Number(node.manualOverride.dueAt) || 0 : null, manualRelationshipStage: Object.prototype.hasOwnProperty.call(node.manualOverride || {}, 'relationshipStage') ? String(node.manualOverride.relationshipStage || '') : null, observations: (node.observations || []).filter((observation) => observation?.access !== 'private').map((observation) => ({ sourceApp: observation.sourceApp, sourceId: observation.sourceId, actor: observation.actor, text: observation.text, occurredAt: observation.occurredAt, reality: observation.reality || 'reality' })), observationCount: (node.observations || []).length, updatedAt: node.updatedAt })),
        getDueItems: (bindingId) => getDueItems(bindingId).map(({ item, dueAt }) => ({ id: item.id, content: item.content, dueAt: new Date(dueAt).toISOString(), lifecycle: item.lifecycle || null })),
        runLifecycleMaintenance: async () => { await migrate(); const lifecycle = await persistLifecycleStates(); const archivedEvents = await compactEventNodes(); return { lifecycle, archivedEvents }; },
        runEvaluation,
        inspectIdentity: (bindingId, content) => {
            const item = getItemByContent(bindingId, content);
            return item ? { id: item.id, subjectType: item.subjectType, subjectId: item.subjectId, memoryType: item.memoryType, v2: item.v2 } : null;
        },
        getState: () => ({ installed: state.installed, migrating: state.migrating, userId: state.userId, itemCount: state.items.length, summaryCount: state.summaries.length, eventNodeCount: state.eventNodes.length, unknownCount: state.items.filter((item) => item?.v2?.subjectKind === 'unknown').length, lastMigration: state.lastMigration, lastConsolidation: state.lastConsolidation, lastLifecycleUpdate: state.lastLifecycleUpdate, lastWake: state.lastWake, lastEventNode: state.lastEventNode, lastEvaluation: state.lastEvaluation })
    });

    let bootstrapStarted = false;
    let accountChangeBootstrapRetries = 0;
    const startBootstrapWhenReady = () => {
        if (bootstrapStarted || !window.MemoryApp) return;
        bootstrapStarted = true;
        void bootstrap().catch((error) => {
            console.warn('Memory V2 bootstrap deferred:', String(error?.message || error));
            if (String(error?.message || error) === 'MEMORY_ACCOUNT_CHANGED' && accountChangeBootstrapRetries < 2) {
                accountChangeBootstrapRetries += 1;
                bootstrapStarted = false;
                setTimeout(startBootstrapWhenReady, 200);
            }
        });
    };

    startBootstrapWhenReady();
    if (!bootstrapStarted) {
        window.addEventListener('tonghuaji:memory-app-ready', startBootstrapWhenReady, { once: true });
    }

    window.addEventListener('semanticmemory:status', () => scheduleSemanticIndex());
    document.addEventListener('visibilitychange', () => {
        if (document.visibilityState === 'visible' && window.MemoryApp) {
            if (!isCurrentAccountState()) void migrate(true);
            else void persistLifecycleStates();
        }
    });
})();


