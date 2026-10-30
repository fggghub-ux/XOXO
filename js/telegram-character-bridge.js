// Personal Telegram character connection. Reuse Tonghuaji's existing context exporter.
(function () {
    'use strict';
    const LEGACY_SERVICE = 'https://tonghuaji-telegram-bridge.satokoishikawa222.workers.dev';
    function validateServiceUrl(value) {
        let url;
        try { url = new URL(String(value || '').trim()); } catch { throw new Error('请填写自己部署的 Worker HTTPS 地址'); }
        if (url.protocol !== 'https:' || !url.hostname || url.username || url.password ||
            url.search || url.hash || !['','/'].includes(url.pathname)) throw new Error('Worker 地址必须是 HTTPS 根地址，不可包含路径或密钥');
        if (['localhost','127.0.0.1'].includes(url.hostname.toLowerCase())) throw new Error('Worker 必须使用公网 HTTPS 地址');
        return url.origin;
    }
    const serviceFor = config => validateServiceUrl(typeof config?.serviceUrl === 'string' ? config.serviceUrl :
        (config?.syncKey ? LEGACY_SERVICE : ''));
    const KEY_PREFIX = 'telegramCharacterPersonal_';
    const recordId = () => KEY_PREFIX + String(document.documentElement.dataset.accessQq || '') + '_' + String(wcGetCurrentAccountId());
    const contacts = () => typeof wcContactsList !== 'undefined' && Array.isArray(wcContactsList) ? wcContactsList : [];
    const randomHex = length => Array.from(crypto.getRandomValues(new Uint8Array(length)), number => number.toString(16).padStart(2, '0')).join('');

    async function read() {
        return (await wcReadLayoutRecord(recordId()))?.data || {};
    }
    let writeSequence = Promise.resolve();
    function save(id, data) {
        const write = writeSequence.catch(() => {}).then(async () => {
            if (!db || !appSettingsLoaded || recordId() !== id) throw new Error('童话集账号已切换');
            const old = (await wcReadLayoutRecord(id))?.data || {};
            return new Promise((resolve, reject) => {
                const transaction = db.transaction([storeName], 'readwrite');
                transaction.objectStore(storeName).put({ id, data: { ...old, ...data } });
                transaction.oncomplete = () => resolve();
                transaction.onerror = transaction.onabort = () => reject(transaction.error || new Error('Telegram 设置保存失败'));
            });
        });
        writeSequence = write;
        return write;
    }
    let lastContextPush = 0;
    let contextTask = null;
    async function refreshRemoteContext() {
        if (contextTask || Date.now() - lastContextPush < 240000) return contextTask;
        contextTask = (async () => {
            if (!db || !appSettingsLoaded || document.visibilityState === 'hidden') return;
            const id = recordId(), saved = await read();
            if (!saved.contactId || !/^[a-f0-9]{64}$/i.test(String(saved.syncKey || '')) ||
                !contacts().some(item => String(item.id) === String(saved.contactId))) return;
            const data = await snapshot(saved.contactId);
            if (recordId() !== id) return;
            const response = await fetch(serviceFor(saved) + '/v1/context', {
                method: 'POST', redirect: 'error', credentials: 'omit',
                signal: AbortSignal.timeout(30000),
                headers: { Authorization: 'Bearer ' + saved.syncKey, 'Content-Type': 'application/json' },
                body: JSON.stringify(data)
            });
            if (!response.ok) throw new Error('TG 上下文自动更新失败（HTTP ' + response.status + '）');
            lastContextPush = Date.now();
        })();
        try { return await contextTask; } finally { contextTask = null; }
    }
    const blobUrls = new Map();
    const objectUrls = new Set();
    const visibleMedia = new Map();
    let visibleMessages = new Set();
    const mediaPending = new Set(), mediaQueue = [];
    let mediaRunning = 0, mediaRenderPending = false;
    async function cacheHistoryMedia(cacheId, image, ownerId) {
        if (recordId() !== ownerId) throw new Error('童话集账号已切换');
        await new Promise((resolve, reject) => {
            const transaction = db.transaction([storeName], 'readwrite');
            transaction.objectStore(storeName).put({ id: cacheId, data: image });
            transaction.oncomplete = resolve;
            transaction.onerror = transaction.onabort = () => reject(transaction.error || new Error('TG 图片缓存保存失败'));
        });
    }
    function queueVisibleMedia(message, media) {
        const key = media.cacheId;
        if (!key || !visibleMessages.has(message) || visibleMedia.has(key) || mediaPending.has(key)) return;
        mediaPending.add(key);
        mediaQueue.push({ message, media, ownerId: recordId() });
        void drainMediaQueue();
    }
    async function drainMediaQueue() {
        while (mediaRunning < 2 && mediaQueue.length) {
            const job = mediaQueue.shift();
            if (!visibleMessages.has(job.message) || recordId() !== job.ownerId) { mediaPending.delete(job.media.cacheId); continue; }
            mediaRunning++;
            void (async () => {
                try {
                    let image = (await wcReadLayoutRecord(job.media.cacheId))?.data;
                    if (!image?.blob?.arrayBuffer) {
                        const config = await read();
                        if (recordId() !== job.ownerId) return;
                        image = await downloadHistoryMedia(job.media, config.syncKey, serviceFor(config));
                        if (image) await cacheHistoryMedia(job.media.cacheId, image, job.ownerId);
                    }
                    if (recordId() !== job.ownerId || !visibleMessages.has(job.message)) return;
                    visibleMedia.set(job.media.cacheId, image || null);
                    showStoredMedia(job.message);
                    if (!mediaRenderPending && image && typeof wcRenderChatMessages === 'function') {
                        mediaRenderPending = true;
                        window.setTimeout(() => {
                            mediaRenderPending = false;
                            if (recordId() === job.ownerId && String(wcCurrentChatContactId) === String(job.message.tgContactId)) {
                                const area = document.getElementById('wc-chat-area');
                                wcRenderChatMessages(job.message.tgContactId, { preserveScroll: true,
                                    previousHeight: area?.scrollHeight || 0, previousTop: area?.scrollTop || 0 });
                            }
                        }, 0);
                    }
                } catch (error) { console.debug('TG visible image deferred:', error?.message || error); }
                finally { mediaPending.delete(job.media.cacheId); mediaRunning--; void drainMediaQueue(); }
            })();
        }
    }
    function showStoredMedia(message) {
        const files = Array.isArray(message?.qqMedia) ? message.qqMedia : [];
        const images = files.map(item => {
            if (item?.blob?.arrayBuffer) return item;
            queueVisibleMedia(message, item);
            return visibleMedia.get(item.cacheId);
        });
        const urls = images.filter(item => item?.blob?.arrayBuffer).map(item => {
            let value = blobUrls.get(item.blob);
            if (!value) {
                value = URL.createObjectURL(item.blob);
                blobUrls.set(item.blob, value);
                objectUrls.add(value);
            }
            return value;
        });
        if (urls.length) message.imageUrl = urls.length === 1 ? urls[0] : urls;
        else if (files.some(item => item.cacheId)) message.imageUrl = null;
        return Boolean(urls.length);
    }
    function prepareVisibleMedia(messages) {
        visibleMessages = new Set(messages.filter(message => message.sourceChannel === 'tg'));
        const wanted = new Set(messages.flatMap(message => (message.qqMedia || []).map(media => media.cacheId)));
        for (const key of visibleMedia.keys()) if (!wanted.has(key)) visibleMedia.delete(key);
        const visible = new Set(messages.flatMap(message => message.sourceChannel === 'tg'
            ? (message.qqMedia || []).map(media => media.blob || visibleMedia.get(media.cacheId)?.blob) : []));
        for (const [blob, url] of blobUrls) {
            if (visible.has(blob)) continue;
            URL.revokeObjectURL(url);
            objectUrls.delete(url);
            blobUrls.delete(blob);
        }
        for (const message of messages) if (message.sourceChannel === 'tg') showStoredMedia(message);
    }
    async function downloadHistoryMedia(part, token, service) {
        const id = String(part?.id || '');
        const file = String(part?.tgFile || '');
        // Older imported history may contain a media caption without a recoverable asset reference.
        if (!/^[a-f0-9]{64}$/.test(id) && !file) return null;
        const uri = service + '/v1/media?' + (/^[a-f0-9]{64}$/.test(id) ? 'id=' + encodeURIComponent(id) : 'tgFile=' + encodeURIComponent(file));
        const result = await fetch(uri, {
            headers: { Authorization: 'Bearer ' + token }, credentials: 'omit',
            redirect: 'error', cache: 'no-store', signal: AbortSignal.timeout(20000)
        });
        if (!result.ok) {
            if (result.status === 404) {
                const meta = await result.json().catch(() => ({}));
                if (meta.error === 'telegram_format_unsupported')
                    return null;
            }
            throw new Error('TG 表情图片下载失败（HTTP ' + result.status + '），同步位置未推进');
        }
        const mime = String(result.headers?.get('content-type') || '').split(';')[0].trim();
        if (!/^image\/(?:webp|png|jpeg|gif)$/.test(mime)) return null;
        const blob = await result.blob();
        if (!blob.size || blob.size > 8000000) throw new Error('TG 图片内容无效或超出 8MB，同步位置未推进');
        return { id: id || file, blob, mime, label: String(part.label || '表情包').slice(0, 120) };
    }

    let pulling = null;
    let pauseRequested = false;
    let historyProgress = { active: false, more: false, processed: 0, remaining: null };
    const progressListeners = new Set();
    const yieldToPage = () => new Promise(resolve => window.setTimeout(resolve, 0));
    function reportHistory(value) {
        historyProgress = { ...historyProgress, ...value };
        for (const listener of progressListeners) listener(historyProgress);
    }
    async function pullHistory(options = {}) {
        if (pulling) {
            const count = await pulling;
            return options.manual && historyProgress.more && !pauseRequested
                ? count + await pullHistory(options) : count;
        }
        pauseRequested = false;
        pulling = (async () => {
            if (!db || !appSettingsLoaded || document.visibilityState === 'hidden') return 0;
            const id = recordId(), saved = await read();
            const contactId = String(saved.contactId || '');
            const token = String(saved.syncKey || '');
            if (!contactId || !/^[a-f0-9]{64}$/i.test(token) ||
                !contacts().some(item => String(item.id) === contactId)) return 0;
            const service = serviceFor(saved);
            const restoreOldPictures = saved.mediaRepairVersion !== '20261029-lazy-media-cache';
            let cursor = restoreOldPictures ? (saved.repairCursor || { stamp: 0, after: 0 }) : (saved.cursor || { stamp: 0, after: 0 });
            let imported = 0;
            let processed = 0, until = 0;
            reportHistory({ active: true, more: true, failed: false, processed: 0, remaining: null, stage: '正在读取 TG 记录' });
            const byId = new Map((wcChatMessagesByContact[contactId] || []).map(item => [String(item.id), item]));
            let finished = false;
            for (let page = 0; page < (options.manual ? Infinity : 1); page++) {
                if (pauseRequested || document.visibilityState === 'hidden') break;
                if (recordId() !== id) throw new Error('童话集账号已切换，已暂停 TG 记录同步');
                const before = imported;
                const uri = service + '/v1/history?stamp=' + Number(cursor.stamp || 0) +
                    '&after=' + Number(cursor.after || 0) + '&limit=12' + (until ? '&until=' + until : '');
                const response = await fetch(uri, {
                    headers: { Authorization: 'Bearer ' + token }, credentials: 'omit',
                    redirect: 'error', cache: 'no-store', signal: AbortSignal.timeout(20000)
                });
                const result = await response.json().catch(() => ({}));
                if (!response.ok || !result.ok) {
                    const error = new Error(response.status === 401
                        ? '同步密钥与云端不一致，请核对本页密钥与 Worker 中的 TG_SYNC_KEY。正常同步无需重新激活机器人。'
                        : 'TG 聊天记录拉取失败（HTTP ' + response.status + '）');
                    error.status = response.status; throw error;
                }
                if (recordId() !== id) throw new Error('童话集账号已切换，已暂停 TG 记录同步');
                until = result.until || until;
                const events = result.events || [];
                const getExisting = remoteId => byId.get(String(remoteId));
                const add = (remoteId, text, type, stamp) => {
                    const existing = getExisting(remoteId);
                    if (existing) return existing;
                    if (!text) return null;
                    const message = wcAppendChatMessage(text, type, contactId, null, null, false, null, null, {
                        remoteMessageId: remoteId, sourceChannel: 'tg', createdAt: stamp, batchImport: true
                    });
                    if (!message) throw new Error('TG 聊天记录写入失败');
                    message.sourceChannel = 'tg';
                    byId.set(remoteId, message);
                    imported++;
                    return message;
                };
                const attach = async (message, media) => {
                    if (!message || !media) return;
                    const attached = Array.isArray(message.qqMedia) ? message.qqMedia : [];
                    const mediaId = media.id || media.tgFile;
                    if (!mediaId) return;
                    const cacheId = id + '_media_' + mediaId;
                    const old = attached.find(item => item.id === mediaId);
                    if (old?.blob?.arrayBuffer) {
                        reportHistory({ stage: '正在整理旧图片缓存，避免重复加载' });
                        await cacheHistoryMedia(cacheId, old, id);
                    }
                    const reference = { ...media, id: mediaId, cacheId };
                    const text = (media.kind === 'image' ? '[图片] ' : '[表情] ') + String(media.label || '');
                    if (old?.cacheId === cacheId && !old.blob && message.text === text) return;
                    message.qqMedia = [...attached.filter(item => item.id !== mediaId), reference];
                    message.tgContactId = contactId;
                    message.isSticker = media.kind !== 'image';
                    message.text = text;
                    imported++;
                };
                for (const event of events) {
                    const time = Number(event.createdAt) || Date.now();
                    const sender = add('tg_in_' + event.id, String(event.text || ''), 'sent', time);
                    if (sender && event.kind !== 'reaction' && event.telegramMessageId &&
                        !sender.telegramMessageIds?.includes(event.telegramMessageId)) {
                        sender.telegramMessageIds = [event.telegramMessageId]; imported++;
                    }
                    if (event.inputMedia) await attach(sender, event.inputMedia);
                    for (const [index, part] of (event.parts || []).entries()) {
                        if (part.type === 'reaction') continue;
                        const value = part.type === 'text' ? String(part.text || '') :
                            '[表情] ' + String(part.label || '表情包');
                        const replyTime = Number(part.createdAt) || Number(event.updatedAt) || time + index + 1;
                        const message = add('tg_out_' + event.id + ':part:' + index, value, 'received', replyTime);
                        if (message && part.telegramMessageIds?.length &&
                            JSON.stringify(message.telegramMessageIds) !== JSON.stringify(part.telegramMessageIds)) {
                            message.telegramMessageIds = part.telegramMessageIds; imported++;
                        }
                        if (part.type === 'media') await attach(message, part);
                    }
                    await yieldToPage();
                }
                const findTarget = (remoteId, telegramId) => (remoteId && getExisting(remoteId)) ||
                    (wcChatMessagesByContact[contactId] || []).find(message =>
                        message.sourceChannel === 'tg' && message.telegramMessageIds?.includes(telegramId));
                const applyReaction = (target, emojis, userId, stamp, sequence) => {
                    if (!target) return;
                    const version = {stamp:Number(stamp) || 0,sequence:Number(sequence) || 0};
                    const previous = target.telegramReactionVersions?.[userId];
                    if (previous && (previous.stamp > version.stamp ||
                        previous.stamp === version.stamp && previous.sequence > version.sequence)) return;
                    const reactions = [...(target.reactions || []).filter(item =>
                        !(item && typeof item === 'object' && item.source === 'tg' && item.userId === userId)),
                        ...emojis.filter(emoji => typeof emoji === 'string' && !/[<>]/.test(emoji))
                            .map(emoji => ({emoji,userId,source:'tg'}))];
                    if (JSON.stringify(target.reactions || []) !== JSON.stringify(reactions)) {
                        target.reactions = reactions; imported++;
                    }
                    if (JSON.stringify(previous) !== JSON.stringify(version)) {
                        target.telegramReactionVersions = {...target.telegramReactionVersions,[userId]:version}; imported++;
                    }
                };
                // Resolve references after all messages on the page exist locally.
                for (const event of result.events || []) {
                    const sender = getExisting('tg_in_' + event.id);
                    const quote = event.reply;
                    const target = quote && findTarget(null, quote.messageId);
                    if (sender && target && sender.replyTo !== target.id) { sender.replyTo = target.id; imported++; }
                    if (event.reaction) applyReaction(findTarget(event.reaction.targetRemoteId,event.reaction.target),
                        event.reaction.next || [], 'user',event.createdAt,event.id);
                    for (const [index, part] of (event.parts || []).entries()) {
                        if (part.type === 'reaction') {
                            if (!part.unavailable) applyReaction(findTarget(part.targetRemoteId,part.target),
                                part.emoji ? [part.emoji] : [], 'char',part.createdAt,event.id * 1000 + index);
                            continue;
                        }
                        const message = getExisting('tg_out_' + event.id + ':part:' + index);
                        const replied = findTarget(part.replyRemoteId,part.replyTo);
                        if (message && replied && message.replyTo !== replied.id) { message.replyTo = replied.id; imported++; }
                    }
                }
                reportHistory({ stage: '正在保存本批记录到本机' });
                if (imported !== before) (wcChatMessagesByContact[contactId] || []).sort((a, b) => Number(a.createdAt || 0) - Number(b.createdAt || 0));
                // Always persist before advancing the cursor, including retries after a failed write.
                if (events.length && await wcSaveChatContactData(contactId) !== true)
                    throw new Error('TG 聊天记录还没有保存到 IndexedDB，请重试');
                if (recordId() !== id) throw new Error('童话集账号已切换，已暂停 TG 记录同步');
                cursor = result.cursor || cursor;
                if (!result.more) finished = true;
                await save(id, { cursor, ...(restoreOldPictures ? { repairCursor: finished ? null : cursor } : {}),
                    ...(restoreOldPictures && finished ? { mediaRepairVersion: '20261029-lazy-media-cache' } : {}) });
                processed += events.length;
                reportHistory({ processed, remaining: Number.isFinite(result.remaining) ? result.remaining : null,
                    more: !finished, stage: finished ? '记录已保存，同步完成' : '本批已保存，可随时暂停后继续' });
                await yieldToPage();
                if (finished) break;
            }
            if (imported) {
                if (String(wcCurrentChatContactId) === contactId) wcRenderChatMessages(contactId);
                if (typeof wcRenderChatList === 'function') wcRenderChatList();
                // Reuse the existing memory-summary queue after a successful local history import.
                try {
                    const contact = contacts().find(item => String(item.id) === contactId);
                    const api = contact && wcResolveChatApi(contact.apiConfig);
                    if (api && typeof wcQueueChatMemoryTurn === 'function') wcQueueChatMemoryTurn(api, contactId);
                } catch (error) { console.debug('TG memory summary deferred:', error?.message || error); }
            }
            return imported;
        })();
        try { return await pulling; }
        catch (error) {
            reportHistory({ failed: true, ...(error.status === 401 ? { more: false, remaining: null } : {}),
                stage: '同步已停止：' + (error?.message || '请重试') });
            throw error;
        }
        finally { pulling = null; reportHistory({ active: false }); }
    }
    async function snapshot(contactId, allowedApiIds) {
        const contact = contacts().find(item => String(item.id) === String(contactId));
        if (!contact) throw new Error('请选择要绑定的童话集角色');
        const api = wcResolveChatApi(contact.apiConfig);
        if (!api?.url || !api?.key || !api?.model) throw new Error('请先为当前角色配置私聊模型 API');
        const allowed = allowedApiIds || (await read()).allowedApiIds || [];
        const presets = typeof apiDataList !== 'undefined' && Array.isArray(apiDataList) ? apiDataList : [];
        const packApi = item => ({ url: item.url, key: item.key, model: item.model, temperature: item.temperature ?? 0.8 });
        const apiProfiles = [{ id: 'role', name: '角色网页 API', api: packApi(api) },
            ...presets.filter(item => allowed.includes(String(item.id)) && item.url && item.key && item.model)
                .map(item => ({ id: 'preset:' + item.id, name: String(item.name || item.model).slice(0, 60), api: packApi(item) }))];
        // Export the SAME compiled prompt slots used for native WeChat model requests,
        // without requesting the model. Do not route through the QQ-specific exporter:
        // that path flattens slots and causes Telegram to inject the same lore again.
        const template = await wcRequestApiReply({ contactId, tokenPreviewOnly: true,
            tgPromptExport: true });
        if (template?.source !== 'tonghuaji-native-chat-compiler' || template.version !== 1 ||
            !Array.isArray(template.leading) || !Array.isArray(template.after) ||
            !Array.isArray(template.depth))
            throw new Error('童话集原生提示词尚未准备好，请刷新网页后重新同步 TG');
        const limit = Math.max(1, Math.min(500, Number(template.historyLimit) || 80));
        const history = (wcChatMessagesByContact[contactId] || []).filter(item =>
            ['sent', 'received'].includes(item?.type) && !item.isSystemHidden && !item.isBlocked && String(item.text || '').trim()
        ).slice(-limit).map(item => ({
            id: String(item.id), type: item.type, text: String(item.text),
            createdAt: window.WcChatTemporal.readTimestamp(item.createdAt)
        }));
        return {
            contactId: String(contact.id), name: String(contact.name || contact.remark || '角色'),
            history, runtime: {
                // The native prompt is already assembled. These legacy fields are
                // deliberately empty so the Worker cannot append duplicate QQ lore.
                prompt: '原生网页预设由 nativePromptTemplate 完整承载',
                contextPrompt: '',
                worldbooks: [],
                historyLimit: limit,
                historyEnabled: template.historyEnabled !== false,
                onlineNarrationEnabled: contact.onlineNarrationEnabled === true,
                nativePromptTemplate: template,
                api: packApi(api), apiProfiles,
                timeZone: template.temporal?.userTimeZone || Intl.DateTimeFormat().resolvedOptions().timeZone || 'Asia/Shanghai',
                mediaAssets: []
            }
        };
    }

    async function prepareStickerFile(blob) {
        if (!blob || !blob.size) throw new Error('图片内容为空');
        if (blob.type === 'image/gif') return blob;
        // Normalize static stickers to Telegram's 512px WebP requirements.
        let objectUrl = '';
        try {
            objectUrl = URL.createObjectURL(blob);
            const image = await new Promise((resolve, reject) => {
                const element = new Image();
                element.onload = () => resolve(element);
                element.onerror = () => reject(new Error('图片格式无法解码'));
                element.src = objectUrl;
            });
            const longer = Math.max(image.naturalWidth, image.naturalHeight);
            if (!longer) throw new Error('图片尺寸无效');
            const canvas = document.createElement('canvas');
            canvas.width = Math.max(1, Math.round(image.naturalWidth * 512 / longer));
            canvas.height = Math.max(1, Math.round(image.naturalHeight * 512 / longer));
            const context = canvas.getContext('2d');
            if (!context) throw new Error('图片转换不可用');
            context.drawImage(image, 0, 0, canvas.width, canvas.height);
            for (const quality of [0.88, 0.72, 0.55]) {
                const result = await new Promise(resolve => canvas.toBlob(resolve, 'image/webp', quality));
                if (result?.type === 'image/webp' && result.size <= 490000) return result;
            }
            // Preserve a real image when the browser cannot encode a Telegram sticker.
            return blob;
        } catch {
            return blob;
        } finally {
            if (objectUrl) URL.revokeObjectURL(objectUrl);
        }
    }
    async function boundStickerPool(contact) {
        const pool = typeof wcGetRepairEmojiPool === 'function' ? wcGetRepairEmojiPool(contact) :
            (typeof wcEmojiGroups === 'undefined' ? [] :
                wcEmojiGroups.filter(group => contact.boundEmojiGroups?.includes('all') ||
                    contact.boundEmojiGroups?.includes(group.id)).flatMap(group => group.emojis || []));
        if (!Array.isArray(pool)) return [];
        if (pool.length > 500) throw new Error('角色绑定表情包超过 500 个，请缩小绑定范围后再同步');
        return pool.filter(item => item && typeof item.url === 'string' && item.url.trim());
    }
    async function uploadStickerSource(item, key, service) {
        const url = item.url.trim();
        const requestMedia = async (body, json = false) => {
            const answer = await fetch(service + '/v1/media', {
                method: 'POST', redirect: 'error', credentials: 'omit', signal: AbortSignal.timeout(45000),
                headers: {
                    Authorization: 'Bearer ' + key,
                    'Content-Type': json ? 'application/json' : 'application/octet-stream'
                },
                body: json ? JSON.stringify({ url }) : body
            });
            const result = await answer.json().catch(() => ({}));
            if (!answer.ok || !result.ok) throw new Error(result.error || 'HTTP ' + answer.status);
            return { id: result.id, mime: result.mime, kind: 'sticker',
                label: String(item.desc || '表情包').slice(0, 120) };
        };
        try {
            const downloaded = await fetch(url, { signal: AbortSignal.timeout(16000) });
            if (!downloaded.ok) throw new Error('图片下载失败');
            const blob = await prepareStickerFile(await downloaded.blob());
            if (blob.size > 4000000) throw new Error('图片超出 4MB 上传限制');
            return await requestMedia(await blob.arrayBuffer());
        } catch (error) {
            // Public HTTPS assets may block browser CORS while remaining accessible from Cloudflare.
            if (!url.startsWith('https://')) throw error;
            return requestMedia(null, true);
        }
    }
    async function syncBoundStickers(contactId, syncKey, currentId, show, service) {
        const contact = contacts().find(item => String(item.id) === String(contactId));
        if (!contact) throw new Error('绑定角色已不存在');
        const pool = await boundStickerPool(contact);
        const mediaAssets = [], problems = [], seen = new Set();
        for (let index = 0; index < pool.length; index++) {
            if (recordId() !== currentId) throw new Error('账号已切换，表情同步已停止');
            const item = pool[index];
            show('正在同步童话集表情包：' + (index + 1) + '/' + pool.length +
                '，已成功 ' + mediaAssets.length + ' 个' + (problems.length ? '，失败 ' + problems.length + ' 个' : ''));
            try {
                const media = await uploadStickerSource(item, syncKey, service);
                // Identical image bytes may appear in multiple bound groups.
                if (!seen.has(media.id)) { seen.add(media.id); mediaAssets.push(media); }
            } catch (error) {
                problems.push(String(item.desc || '未命名表情').slice(0, 28) + '：' + (error?.message || '不可读取'));
            }
        }
        return { mediaAssets, total: pool.length, problems };
    }


    function openDeployGuide() {
        const previous = document.getElementById('wc-tg-deploy-guide');
        if (previous) { previous.remove(); return; }
        const layer = document.createElement('div');
        layer.id = 'wc-tg-deploy-guide';
        const steps = [
            ['先准备运行环境 / 创建 Worker',
             '新用户从这里开始：注册自己的 <a href="https://dash.cloudflare.com" target="_blank" rel="noopener noreferrer">Cloudflare 账号</a> 并验证邮箱，进入 Dashboard → Workers &amp; Pages → Create application → Create Worker。' +
             '这里的 Worker 就是托管的机器人运行环境，不需要先租阿里云服务器、安装 Linux、配置 Docker 容器，也不需要购买 Cloudflare Containers。' +
             '部署最初的示例 Worker 后，再用下一步的完整源码替换即可。D1 数据库与 Queue 将在后面单独创建。'],
            ['创建自己的 TG 机器人',
             '在 Telegram 打开 <a href="https://t.me/BotFather" target="_blank" rel="noopener noreferrer">@BotFather</a>，发送 /newbot，创建自己的 Bot 并保存 Token。准备你的 Telegram 数字 Chat ID（不是 @用户名）。Bot Token 只放自己的 Cloudflare Secret。'],
            ['部署自己的 Cloudflare Worker',
             '回到自己在第一步创建的 Worker → Edit code。先删除默认 Hello World 代码，粘贴下面的独立部署源码完整内容，保存并部署。' +
             '复制其 workers.dev HTTPS 根地址，例如 https://your-worker.your-account.workers.dev。第一次 /health 显示部分 false 是正常的，要先完成后面的资源绑定。' +
             '<div class="tg-guide-cta"><button type="button" data-guide-file="worker">复制完整 Worker 源码</button><a href="/tools/telegram-character-bridge/worker-standalone.mjs" target="_blank" rel="noopener noreferrer">查看源码</a></div>'],
            ['创建 D1 数据库和 Queue',
             '在自己的 Cloudflare 创建 D1 数据库，执行建表 SQL，并为 Worker 添加 D1 绑定，名称必须是 DB。创建 Queue，生产者绑定名必须是 TG_QUEUE；给队列添加当前 Worker 作为消费者，批量大小 1，最大并发 1。' +
             '<div class="tg-guide-cta"><button type="button" data-guide-file="sql">复制完整 SQL</button><a href="/tools/telegram-character-bridge/schema.sql" target="_blank" rel="noopener noreferrer">查看 SQL</a></div>'],
            ['添加 5 个 Cloudflare Secret',
             '在 Worker → Settings → Variables and Secrets 中添加以下密钥，名称要完全一致。不要把 Token 或密钥写进 Worker 源码。' +
             '<pre>TG_BOT_TOKEN       BotFather 的机器人 Token\nTG_OWNER_CHAT_ID   自己的 Telegram 数字 ID\nTG_SETUP_KEY       激活用独立随机密钥\nTG_SYNC_KEY        和童话集页面相同的同步密钥\nTG_WEBHOOK_SECRET  另一条独立随机密钥</pre>' +
             '<button type="button" data-guide-random>生成并复制一条随机密钥</button>'],
            ['激活自己的 Webhook',
             '在童话集 TG 接入页填写你的 Worker HTTPS 根地址，先点击“检查我的 Worker”，再临时填写 TG_SETUP_KEY，点击“激活我的机器人”。成功后应该显示你的 @机器人用户名。'],
            ['同步角色并开始聊天',
             '选择当前童话集角色，生成同步密钥，并把同一个值放进 Cloudflare Secret TG_SYNC_KEY；点击“同步当前角色”。随后去自己创建的 Bot 发送 /状态，检查聊天历史是否启用。']
        ];
        const cards = steps.map(([heading,body], index) =>
            '<div class="tg-guide-step"><b class="tg-guide-num">' + (index + 1) +
            '</b><div class="tg-guide-detail"><strong>' + heading + '</strong><p>' + body + '</p></div></div>'
        ).join('');
        const faq = [
            ['Failed to fetch / CORS 错误？','确认自己的 Worker 地址为完整 HTTPS 根地址；若童话集使用自定义域名，需要自行把该 Origin 加进 Worker 允许列表。'],
            ['401 Unauthorized？','童话集 TG_SYNC_KEY 与你的 Worker 中 TG_SYNC_KEY 必须一致。'],
            ['TG 机器人一直不回复？','检查 TG_OWNER_CHAT_ID、TG_WEBHOOK_SECRET、Webhook 和 Queue consumer 的设置，以及模型 API 是否正常。'],
            ['角色忘了上下文？','在童话集角色预设启用“聊天历史”槽位，重新同步角色，并发送 /状态 检查。'],
            ['连发很多条为什么会重复回复？','新版以最后一条消息为准，停止发送满 15 秒才会调用模型，整组用户消息只处理一次。若问题仍出现，检查 Worker 是否更新到最新版，Queue 消费者是否设为并发 1。'],
            ['Cloudflare Containers / Docker 容器还要创建吗？','本方案不需要 Docker 容器、VPS 或服务器。仅需要 Worker + D1 + Queue。若改用阿里云 Docker，需要另做适配后端，不能直接运行这个 Worker。'],
            ['能共用开发者的 TG 机器人吗？','不能。每位用户必须拥有自己的 Worker、数据库、Queue、Bot Token 和密钥。']
        ];
        layer.innerHTML = '<style>' +
            '#wc-tg-deploy-guide{position:fixed;inset:0;z-index:2147483500;background:rgba(0,0,0,.4);display:flex;align-items:flex-end;justify-content:center;color:#111;font-family:inherit}' +
            '#wc-tg-deploy-guide .tg-guide-sheet{width:100%;max-width:720px;max-height:90dvh;border-radius:26px 26px 0 0;overflow:hidden;background:#f5f5f7;display:flex;flex-direction:column}' +
            '#wc-tg-deploy-guide .tg-guide-handle{width:44px;height:5px;border-radius:4px;background:#c9c9ce;align-self:center;margin:10px 0 2px}' +
            '#wc-tg-deploy-guide .tg-guide-header{display:flex;align-items:center;justify-content:space-between;padding:14px 22px;background:#fff;border-bottom:1px solid #ebebee}' +
            '#wc-tg-deploy-guide .tg-guide-header strong{font-size:18px;font-weight:700}' +
            '#wc-tg-deploy-guide button{cursor:pointer;font:inherit}' +
            '#wc-tg-deploy-guide .tg-guide-close{background:transparent;border:0;color:#007aff;font-size:16px;font-weight:600;padding:7px 0}' +
            '#wc-tg-deploy-guide .tg-guide-content{overflow-y:auto;overscroll-behavior:contain;-webkit-overflow-scrolling:touch;padding:18px 18px max(22px,env(safe-area-inset-bottom))}' +
            '#wc-tg-deploy-guide .tg-guide-card{background:#fff;border-radius:22px;padding:20px;margin:0 0 16px}' +
            '#wc-tg-deploy-guide .tg-guide-chip{display:inline-block;background:#f1f1f3;border-radius:9px;color:#666;padding:6px 10px;font-size:12px;font-weight:700;margin-bottom:16px}' +
            '#wc-tg-deploy-guide .tg-guide-step{display:grid;grid-template-columns:32px minmax(0,1fr);gap:12px;margin-bottom:22px}' +
            '#wc-tg-deploy-guide .tg-guide-step:last-child{margin-bottom:0}' +
            '#wc-tg-deploy-guide .tg-guide-num{height:32px;width:32px;border-radius:50%;display:flex;justify-content:center;align-items:center;color:#fff;background:#007aff;font-size:15px}' +
            '#wc-tg-deploy-guide .tg-guide-detail strong{display:block;font-size:15px;line-height:1.4}' +
            '#wc-tg-deploy-guide .tg-guide-detail p{margin:7px 0 0;color:#777;line-height:1.7;font-size:13px}' +
            '#wc-tg-deploy-guide a{color:#007aff;text-decoration:none}' +
            '#wc-tg-deploy-guide .tg-guide-cta{margin-top:10px;display:flex;flex-wrap:wrap;gap:9px;align-items:center}' +
            '#wc-tg-deploy-guide .tg-guide-cta button,#wc-tg-deploy-guide .tg-guide-detail button,#wc-tg-deploy-guide .tg-guide-docs{border:1px solid #e7e7eb;border-radius:10px;background:#f5f5f7;color:#333;padding:8px 12px;font-size:12px;font-weight:600;min-height:36px;display:inline-block}' +
            '#wc-tg-deploy-guide pre{white-space:pre-wrap;overflow-wrap:anywhere;background:#f5f5f7;padding:13px;border-radius:11px;font-size:11px;color:#333;line-height:1.65;margin:10px 0}' +
            '#wc-tg-deploy-guide .tg-guide-card h3{font-size:15px;margin:0 0 12px}' +
            '#wc-tg-deploy-guide .tg-guide-faq{padding:13px 0;border-top:1px solid #eee;font-weight:650;font-size:14px}' +
            '#wc-tg-deploy-guide .tg-guide-faq p{font-size:13px;color:#777;line-height:1.65;font-weight:400;margin:7px 0 0}' +
            '#wc-tg-deploy-guide .tg-guide-feedback{font-size:13px;color:#777;line-height:1.5;min-height:20px}' +
            '</style><div class="tg-guide-sheet" role="dialog" aria-modal="true" aria-label="TG 接入指南">' +
            '<div class="tg-guide-handle" aria-hidden="true"></div>' +
            '<div class="tg-guide-header"><strong>TG 接入指南</strong><button type="button" class="tg-guide-close" data-guide-close>完成</button></div>' +
            '<div class="tg-guide-content"><section class="tg-guide-card"><span class="tg-guide-chip">详细部署教程 · 个人独立部署</span>' + cards + '</section>' +
            '<section class="tg-guide-card"><h3>电脑端 Wrangler 部署</h3><p style="color:#777;line-height:1.7;font-size:13px">也可以用 Windows / macOS 终端部署，包含 D1、Queue、Secret 和完整命令。</p>' +
            '<a class="tg-guide-docs" href="/tools/telegram-character-bridge/DEPLOY.md" target="_blank" rel="noopener noreferrer">打开详细部署文档</a> ' +
            '<a class="tg-guide-docs" href="/tools/telegram-character-bridge/wrangler.example.toml" target="_blank" rel="noopener noreferrer">查看 Wrangler 模板</a></section>' +
            '<section class="tg-guide-card"><span class="tg-guide-chip">常见问题排查</span>' +
            faq.map(([q,a]) => '<div class="tg-guide-faq">Q：' + q + '<p>' + a + '</p></div>').join('') + '</section>' +
            '<p class="tg-guide-feedback" data-guide-feedback role="status"></p></div></div>';
        const close = () => { document.removeEventListener('keydown', onKeyDown); layer.remove(); };
        const onKeyDown = event => { if (event.key === 'Escape') close(); };
        layer.addEventListener('click', event => { if (event.target === layer) close(); });
        layer.querySelector('[data-guide-close]').onclick = close;
        document.addEventListener('keydown', onKeyDown);
        const feedback = layer.querySelector('[data-guide-feedback]');
        layer.querySelectorAll('[data-guide-file]').forEach(button => {
            button.onclick = async () => {
                const path = button.dataset.guideFile === 'worker'
                    ? '/tools/telegram-character-bridge/worker-standalone.mjs'
                    : '/tools/telegram-character-bridge/schema.sql';
                try {
                    const reply = await fetch(path, { cache: 'no-store' });
                    if (!reply.ok) throw new Error('HTTP ' + reply.status);
                    const content = await reply.text();
                    if (!content.includes(button.dataset.guideFile === 'worker' ? 'export default' : 'CREATE TABLE'))
                        throw new Error('静态资源还没有发布到网站');
                    await navigator.clipboard.writeText(content);
                    feedback.textContent = '已复制完整代码，请粘贴到你自己的 Cloudflare 配置界面';
                } catch (error) {
                    feedback.textContent = '复制失败：' + (error?.message || '网络错误') +
                        '。请尝试点击“查看源码 / 查看 SQL”，或联系童话集管理员发布部署文件';
                }
            };
        });
        layer.querySelector('[data-guide-random]').onclick = async () => {
            try {
                await navigator.clipboard.writeText(randomHex(32));
                feedback.textContent = '随机密钥已复制；每个 Secret 要独立生成自己的值';
            } catch { feedback.textContent = '复制失败，请检查剪贴板权限'; }
        };
        document.body.appendChild(layer);
    }

    function createPanel(host) {
        let panel = host.querySelector('#wc-tg-character-settings');
        if (panel) return panel;
        panel = document.createElement('section');
        panel.id = 'wc-tg-character-settings';
        panel.hidden = true;
        panel.innerHTML = `
            <style>
                #wc-tg-character-settings{color:#111;padding:20px 20px 32px;font-family:inherit;box-sizing:border-box}
                #wc-tg-character-settings[hidden]{display:none}
                #wc-tg-character-settings .tg-note{margin:10px 4px 20px;color:#85858b;font-size:12px;line-height:1.65;font-weight:400}
                #wc-tg-character-settings .tg-card{border:1px solid #ebebee;border-radius:16px;padding:3px 16px;background:#fff}
                #wc-tg-character-settings label{display:block;padding:12px 0;font-size:13px;color:#777}
                #wc-tg-character-settings label+label{border-top:1px solid #eee}
                #wc-tg-character-settings .tg-character-row{display:flex;align-items:center;gap:14px;padding:12px 0;border-bottom:1px solid #eee}
                #wc-tg-character-settings .tg-character-row>span{flex:none;font-size:13px;color:#777}
                #wc-tg-character-settings input{box-sizing:border-box;display:block;width:100%;margin-top:8px;padding:6px 0;border:0;outline:0;background:transparent;color:#111;font:inherit;font-size:16px}
                #wc-tg-character-settings .tg-actions{display:grid;gap:10px;margin-top:18px}
                #wc-tg-character-settings button{min-height:46px;padding:12px 16px;border:1px solid #e5e5e9;border-radius:13px;background:#fff;color:#161616;font:inherit;font-size:15px;font-weight:600}
                #wc-tg-character-settings button.tg-primary{background:#171719;border-color:#171719;color:#fff}
                #wc-tg-character-settings button:disabled{opacity:.5}
                #wc-tg-character-settings .tg-character-row button{flex:1;min-width:0;min-height:38px;padding:6px 0;border:0;border-radius:0;background:transparent;color:#007aff;text-align:right;font-size:15px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;cursor:pointer}
                #wc-tg-character-settings .tg-status{margin:18px 0 0;font-size:13px;line-height:1.65;color:#555;white-space:pre-wrap;overflow-wrap:anywhere}
                #wc-tg-character-settings progress{display:block;width:100%;height:6px;margin:10px 0;accent-color:#171719}
                #wc-tg-character-settings .tg-section-title{margin:24px 16px 9px;color:#85858b;font-size:12px;font-weight:500;letter-spacing:.03em}
                #wc-tg-character-settings .tg-api-entry{display:flex;align-items:center;gap:12px;width:100%;min-height:72px;padding:16px;border:1px solid #ebebee;border-radius:16px;text-align:left}
                #wc-tg-character-settings .tg-api-entry>span:first-child{flex:1;min-width:0}
                #wc-tg-character-settings .tg-api-entry strong{display:block;font-size:15px;font-weight:600}
                #wc-tg-character-settings .tg-api-entry small{display:block;margin-top:5px;font-size:12px;font-weight:400;color:#8e8e93;line-height:1.5;overflow-wrap:anywhere}
                #wc-tg-character-settings .tg-api-count{flex:none;font-size:13px;font-weight:400;color:#8e8e93;white-space:nowrap}
                #wc-tg-character-settings .tg-api-count::after{content:'';display:inline-block;width:6px;height:6px;margin-left:9px;border-top:1.5px solid #b5b5ba;border-right:1.5px solid #b5b5ba;transform:rotate(45deg)}
                #wc-tg-character-settings .tg-sync-actions{display:grid;gap:10px;margin-top:18px}
                #wc-tg-character-settings .tg-sync-actions button{min-height:50px;border-radius:15px}
                #wc-tg-character-settings .tg-tools{margin-top:24px;border:1px solid #ebebee;border-radius:16px;background:#fff;overflow:hidden}
                #wc-tg-character-settings .tg-tools summary{display:flex;align-items:center;justify-content:space-between;gap:12px;min-height:52px;padding:0 16px;cursor:pointer;list-style:none;font-size:14px;font-weight:600}
                #wc-tg-character-settings .tg-tools summary::-webkit-details-marker{display:none}
                #wc-tg-character-settings .tg-tools summary span{color:#8e8e93;font-size:12px;font-weight:400}
                #wc-tg-character-settings .tg-tools .tg-actions{margin:0;padding:4px 12px 12px;gap:0}
                #wc-tg-character-settings .tg-tools button{border:0;border-radius:0;text-align:left;min-height:48px;padding:12px 4px;font-size:14px;font-weight:500}
                #wc-tg-character-settings .tg-tools button+button{border-top:1px solid #f0f0f2}
                #wc-tg-character-settings .tg-tools label{padding:16px 4px;font-size:12px;line-height:1.5}
                #wc-tg-character-settings .tg-status:empty{display:none}
                #wc-tg-character-settings [data-tg-progress]{margin-top:18px;padding:16px;border:1px solid #ebebee;border-radius:16px;background:#fff}
                #wc-tg-character-settings [data-tg-progress][hidden]{display:none}
                #wc-tg-character-settings [data-tg-progress] .tg-status{margin-top:10px;font-size:12px;color:#74747a}
                #wc-tg-character-settings .tg-progress-title{display:block;font-size:14px;font-weight:600}
                #wc-tg-character-settings [data-tg-pause]{width:100%;margin-top:14px;min-height:40px;font-size:13px;background:#f4f4f6;border:0}
                #wc-tg-api-sheet{box-sizing:border-box;width:min(100%,440px);max-width:100%;max-height:min(82dvh,740px);margin:auto auto 0;padding:0;border:0;border-radius:26px 26px 0 0;background:#f4f4f6;color:#111;font-family:inherit;overflow:hidden}
                #wc-tg-api-sheet::backdrop{background:rgba(0,0,0,.32)}
                #wc-tg-api-sheet:not([open]){display:none}
                #wc-tg-api-sheet[open]{display:flex;flex-direction:column}
                #wc-tg-character-settings .tg-sheet-header{flex:none;padding:12px 24px 18px;text-align:center}
                #wc-tg-character-settings .tg-sheet-handle{width:34px;height:5px;margin:0 auto 20px;border-radius:4px;background:#d2d2d7}
                #wc-tg-character-settings .tg-sheet-header h3{margin:0;font-size:19px;font-weight:650}
                #wc-tg-character-settings .tg-sheet-header p{margin:8px 0 0;color:#8e8e93;font-size:12px;font-weight:400;line-height:1.6}
                #wc-tg-character-settings .tg-sheet-scroll{flex:1;min-height:0;overflow-y:auto;overscroll-behavior:contain;padding:0 20px 16px;-webkit-overflow-scrolling:touch}
                #wc-tg-character-settings [data-tg-api-list]{padding:0 16px;border-radius:16px;background:#fff;overflow:hidden}
                #wc-tg-character-settings .tg-api-option{display:flex;align-items:center;margin:0;min-height:64px;padding:13px 0;gap:16px;box-sizing:border-box;cursor:pointer}
                #wc-tg-character-settings .tg-api-option+label{border-top:1px solid #f0f0f2}
                #wc-tg-character-settings .tg-api-info{flex:1;min-width:0;font-size:15px;font-weight:600;color:#111;overflow-wrap:anywhere}
                #wc-tg-character-settings .tg-api-info small{display:block;margin-top:5px;color:#8e8e93;font-size:12px;font-weight:400;line-height:1.5}
                #wc-tg-character-settings .tg-api-option input{appearance:none;-webkit-appearance:none;position:relative;display:block;width:23px;height:23px;margin:0;padding:0;flex:none;border:1.5px solid #d1d1d6;border-radius:50%;background:#fff;cursor:pointer}
                #wc-tg-character-settings .tg-api-option input:checked{background:#171719;border-color:#171719}
                #wc-tg-character-settings .tg-api-option input:checked::after{content:'';position:absolute;left:7px;top:4px;width:5px;height:9px;border:solid #fff;border-width:0 1.7px 1.7px 0;transform:rotate(45deg)}
                #wc-tg-character-settings .tg-api-option input:focus-visible{outline:2px solid #8e8e93;outline-offset:3px}
                #wc-tg-character-settings .tg-api-empty{margin:0;padding:28px 12px;text-align:center;color:#8e8e93;font-size:13px;line-height:1.7}
                #wc-tg-character-settings .tg-sheet-footer{flex:none;padding:12px 20px max(20px,env(safe-area-inset-bottom));border-top:1px solid #e7e7eb;background:#f4f4f6;display:grid;gap:9px}
                #wc-tg-character-settings .tg-sheet-footer button{width:100%;min-height:49px;border:0;border-radius:15px}
                @media(prefers-reduced-motion:no-preference){#wc-tg-api-sheet[open]{animation:tg-api-sheet-in .2s ease-out}@keyframes tg-api-sheet-in{from{transform:translateY(24px);opacity:0}to{transform:translateY(0);opacity:1}}}
            </style>
            <p class="tg-note">每个用户部署自己的 Telegram 机器人和 Cloudflare Worker。只有你本人填写的 Worker 会收到角色上下文，Bot Token 仅放在自己的 Cloudflare Secret 中。</p>
            <div class="tg-card">
                <label>我的 Worker HTTPS 地址<input data-tg-service type="url" inputmode="url" autocomplete="url" spellcheck="false" placeholder="https://your-worker.your-account.workers.dev"></label>
                <div class="tg-character-row"><span>绑定角色</span><button type="button" data-tg-character>选择绑定角色</button></div>
                <label>专用同步密钥<input data-tg-key type="password" autocomplete="off" spellcheck="false" placeholder="64 位十六进制密钥"></label>
            </div>
            <h3 class="tg-section-title">模型与线路</h3>
            <button type="button" class="tg-api-entry" data-tg-api-open aria-haspopup="dialog"><span><strong>备用 API</strong><small data-tg-api-summary>选择可在 TG 中切换的线路</small></span><span class="tg-api-count" data-tg-api-count>未选择</span></button>
            <p class="tg-note">同步后，在 TG 发送 /api 即可查看并切换。</p>
            <h3 class="tg-section-title">双向同步</h3>
            <div class="tg-sync-actions">
                <button class="tg-primary" type="button" data-tg-sync>同步当前角色到 TG</button>
                <button type="button" data-tg-pull>从 TG 同步聊天记录</button>
            </div>
            <p class="tg-status" data-tg-status role="status"></p>
            <div data-tg-progress hidden><strong class="tg-progress-title">同步进度</strong><progress aria-label="TG 同步进度"></progress><p class="tg-status" data-tg-progress-text role="status"></p><button type="button" data-tg-pause hidden>暂停记录同步</button></div>
            <details class="tg-tools"><summary>连接与部署<span>首次接入 / 维护</span></summary><div class="tg-actions">
                <button type="button" data-tg-guide>查看 TG 专属部署教程</button>
                <button type="button" data-tg-check>检查我的 Worker</button>
                <button type="button" data-tg-generate>生成同步密钥</button>
                <button type="button" data-tg-copy>复制密钥（用于 Cloudflare Secret）</button>
                <label>Webhook 激活密钥（临时输入，不保存）<input data-tg-setup type="password" autocomplete="off" spellcheck="false" placeholder="TG_SETUP_KEY"></label>
                <button type="button" data-tg-activate>激活我的机器人</button>
            </div></details>
            <dialog id="wc-tg-api-sheet" aria-labelledby="wc-tg-api-title">
                <header class="tg-sheet-header"><div class="tg-sheet-handle" aria-hidden="true"></div><h3 id="wc-tg-api-title">选择备用 API</h3><p>选择允许在 TG 使用的预设<br>保存后，点击同步角色生效。</p></header>
                <div class="tg-sheet-scroll"><div data-tg-api-list></div><p class="tg-note">仅所选预设会加密同步到你的 Worker，网页使用的 API 保持不变。</p></div>
                <footer class="tg-sheet-footer"><button type="button" class="tg-primary" data-tg-api-done>保存选择</button><button type="button" data-tg-api-cancel>取消</button></footer>
            </dialog>
        `;
        host.appendChild(panel);
        panel.hidden = false;
        return panel;
    }
    async function mount(host) {
        const id = recordId();
        const panel = createPanel(host);
        const picker = panel.querySelector('[data-tg-character]');
        const secret = panel.querySelector('[data-tg-key]');
        const serviceInput = panel.querySelector('[data-tg-service]');
        const setupInput = panel.querySelector('[data-tg-setup]');
        const status = panel.querySelector('[data-tg-status]');
        const saved = await read();
        if (recordId() !== id) throw new Error('童话集账号已切换，请重新打开 TG 设置');
        let selectedContactId = String(saved.contactId || '');
        const apiList = panel.querySelector('[data-tg-api-list]');
        apiList.replaceChildren();
        const presets = typeof apiDataList !== 'undefined' && Array.isArray(apiDataList) ? apiDataList : [];
        for (const api of presets) {
            const label = document.createElement('label'), input = document.createElement('input');
            const info = document.createElement('span'), model = document.createElement('small');
            label.className = 'tg-api-option'; input.type = 'checkbox'; input.value = String(api.id);
            input.checked = (saved.allowedApiIds || []).includes(String(api.id));
            info.className = 'tg-api-info'; info.textContent = String(api.name || api.model || '未命名预设');
            model.textContent = String(api.model || '尚未选择模型'); info.append(model);
            label.append(info, input);
            apiList.append(label);
        }
        if (!presets.length) {
            const empty = document.createElement('p'); empty.className = 'tg-api-empty';
            empty.textContent = '还没有可选的 API 预设，请先在 API 设置中添加。'; apiList.append(empty);
        }
        const apiSheet = panel.querySelector('#wc-tg-api-sheet');
        const apiOpen = panel.querySelector('[data-tg-api-open]');
        let apiSelectionBeforeOpen = [];
        const selectedApis = () => Array.from(apiList.querySelectorAll('input:checked'), input => input.value);
        const renderApiSummary = () => {
            const selected = selectedApis();
            panel.querySelector('[data-tg-api-count]').textContent = selected.length ? selected.length + ' 项' : '未选择';
            const names = presets.filter(api => selected.includes(String(api.id))).map(api => api.name || api.model || '未命名预设');
            panel.querySelector('[data-tg-api-summary]').textContent = names.length ? names.slice(0, 2).join('、') +
                (names.length > 2 ? ' 等 ' + names.length + ' 项' : '') : '仅使用角色当前的 API';
        };
        const closeApiSheet = commit => {
            if (!commit) apiList.querySelectorAll('input').forEach(input => { input.checked = apiSelectionBeforeOpen.includes(input.value); });
            renderApiSummary(); apiSheet.close(); apiOpen.focus();
        };
        apiOpen.onclick = () => {
            if (recordId() !== id) return;
            apiSelectionBeforeOpen = selectedApis();
            apiSheet.showModal();
        };
        panel.querySelector('[data-tg-api-done]').onclick = () => closeApiSheet(true);
        panel.querySelector('[data-tg-api-cancel]').onclick = () => closeApiSheet(false);
        apiSheet.oncancel = event => { event.preventDefault(); closeApiSheet(false); };
        apiSheet.onclick = event => {
            if (event.target !== apiSheet) return;
            const bounds = apiSheet.getBoundingClientRect();
            if (event.clientX < bounds.left || event.clientX > bounds.right || event.clientY < bounds.top || event.clientY > bounds.bottom) closeApiSheet(false);
        };
        renderApiSummary();
        const progress = panel.querySelector('[data-tg-progress]');
        const meter = progress.querySelector('progress');
        const progressText = panel.querySelector('[data-tg-progress-text]');
        const pause = panel.querySelector('[data-tg-pause]');
        const stage = message => {
            progress.hidden = false; meter.removeAttribute('value'); progressText.textContent = message;
        };
        if (panel._tgHistoryListener) progressListeners.delete(panel._tgHistoryListener);
        panel._tgHistoryListener = value => {
            progress.hidden = false;
            const total = value.remaining === null ? null : value.processed + value.remaining;
            if (value.failed) { meter.max = 1; meter.value = 0; }
            else if (total !== null) { meter.max = Math.max(1, total); meter.value = total ? value.processed : 1; }
            else meter.removeAttribute('value');
            progressText.textContent = value.stage + '\n已处理 ' + value.processed + ' 条 TG 记录' +
                (total !== null ? ' / ' + total + ' 条' : '') +
                (!value.active && value.more ? '\n尚有记录待同步，点击同步继续；已保存的位置会保留。' : '');
            pause.hidden = !value.active; pause.disabled = false;
        };
        progressListeners.add(panel._tgHistoryListener);
        if (historyProgress.active) panel._tgHistoryListener(historyProgress);
        pause.onclick = () => { pauseRequested = true; pause.disabled = true; pause.textContent = '本批保存后暂停…'; };
        let contactLoadError = '';
        const refreshContacts = async () => {
            try {
                if (typeof window.wcReloadContactsFromStorage === 'function') await window.wcReloadContactsFromStorage();
                contactLoadError = '';
            } catch (error) {
                contactLoadError = error?.message || '联系人读取失败';
            }
            if (recordId() !== id) throw new Error('童话集账号已切换，请重新打开 TG 设置');
            return contacts();
        };
        const renderSelected = () => {
            const selected = contacts().find(item => String(item.id) === selectedContactId);
            picker.textContent = selected ? (selected.name || selected.remark || '未命名角色') : '选择绑定角色';
        };
        const list = await refreshContacts();
        if (!list.some(item => String(item.id) === selectedContactId)) selectedContactId = '';
        renderSelected();
        secret.value = saved.syncKey || '';
        serviceInput.value = typeof saved.serviceUrl === 'string' ? saved.serviceUrl :
            (saved.syncKey ? LEGACY_SERVICE : '');
        const show = message => { status.textContent = message; };
        picker.onclick = async () => {
            try {
                const latest = await refreshContacts();
                if (!latest.length) {
                    show(contactLoadError || '当前童话集账号还没有可绑定的角色，请先在联系人创建角色。');
                    return;
                }
                if (typeof window.openUniversalSelect !== 'function') {
                    show('角色选择弹窗尚未加载，请重新打开个人热点。');
                    return;
                }
                window.openUniversalSelect({
                    title: '选择绑定角色',
                    items: latest.map(contact => ({ label: contact.name || contact.remark || '未命名角色', value: String(contact.id) })),
                    currentValue: selectedContactId,
                    searchable: true,
                    onSelect: value => {
                        if (recordId() !== id) return;
                        selectedContactId = String(value);
                        renderSelected();
                        show('已选择角色，点击“同步当前角色”后才会更新 TG 机器人。');
                    }
                });
            } catch (error) {
                show(error?.message || '角色列表读取失败，请重新打开 TG 设置');
            }
        };
        const busy = async task => {
            panel.querySelectorAll('button,select,input').forEach(node => { node.disabled = true; });
            try { await task(); }
            catch (error) {
                show(error?.message || '连接失败，请稍后重试');
                if (!progress.hidden) { meter.max = 1; meter.value = 0; progressText.textContent = '同步已停止，已保存的进度会保留。\n' + (error?.message || '请稍后重试'); }
            }
            finally { panel.querySelectorAll('button,select,input').forEach(node => { node.disabled = false; }); }
        };
        const confirmChange = async (title, message, action) => {
            if (typeof showCustomConfirm === 'function') return await showCustomConfirm(title, message, action, true);
            return window.confirm(title + '\n\n' + message);
        };
        panel.querySelector('[data-tg-guide]').onclick = openDeployGuide;
        const probeWorker = async () => {
            const service = validateServiceUrl(serviceInput.value);
            const reply = await fetch(service + '/health', {
                method: 'GET', redirect: 'error', cache: 'no-store', signal: AbortSignal.timeout(12000)
            });
            const state = await reply.json().catch(() => ({}));
            if (!reply.ok || state.service !== 'tonghuaji-telegram-bridge')
                throw new Error('不是可用的童话集 TG Worker（HTTP ' + reply.status + '）');
            return state;
        };
        panel.querySelector('[data-tg-check]').onclick = () => busy(async () => {
            const info = await probeWorker();
            const flags = [
                ['Bot Token', info.token_configured], ['用户 Chat ID', info.owner_restriction_configured],
                ['D1 数据库', info.storage_ready], ['消息 Queue', info.queue_ready],
                ['TG_SYNC_KEY', info.sync_ready], ['Webhook Secret', info.webhook_ready],
                ['激活密钥', info.setup_ready]
            ];
            show('已连接：' + validateServiceUrl(serviceInput.value) + '\n' +
                flags.map(([name,ready]) => (ready ? '已配置：' : '缺少：') + name).join('\n') +
                '\n确认所有项目已配置，然后激活 Webhook 并同步角色。');
        });
        panel.querySelector('[data-tg-activate]').onclick = () => busy(async () => {
            const service = validateServiceUrl(serviceInput.value), setupKey = setupInput.value.trim();
            if (setupKey.length < 16) throw new Error('请填写至少 16 字符的 TG_SETUP_KEY');
            const info = await probeWorker();
            if (!info.token_configured || !info.owner_restriction_configured ||
                !info.webhook_ready || !info.setup_ready)
                throw new Error('还缺少 TG_BOT_TOKEN、TG_OWNER_CHAT_ID、TG_WEBHOOK_SECRET 或 TG_SETUP_KEY');
            if (!await confirmChange('重新设置机器人连接？',
                '这会重新设置 TG 消息接收地址。正常聊天和同步记录不需要重复激活；如果只是提示 401，请取消并检查同步密钥。', '确认激活')) return;
            const reply = await fetch(service + '/activate', {
                method: 'POST', redirect: 'error', credentials: 'omit',
                headers: { Authorization: 'Bearer ' + setupKey },
                signal: AbortSignal.timeout(18000)
            });
            const body = await reply.json().catch(() => ({}));
            if (!reply.ok || !body.connected) throw new Error(body.error === 'forbidden' ?
                '激活密钥错误，请检查 TG_SETUP_KEY' :
                'Webhook 激活失败：' + (body.error || reply.status));
            setupInput.value = '';
            show('机器人激活成功：' + String(body.bot || '你的机器人') +
                '\n接下来同步你选择的角色即可。');
        });
        panel.querySelector('[data-tg-generate]').onclick = () => busy(async () => {
            if (!await confirmChange('生成新的同步密钥？',
                '现有机器人不需要重新生成密钥。新密钥必须与云端一致才能使用；生成后仅作为草稿，不会覆盖当前保存的连接。', '生成草稿')) return;
            secret.value = randomHex(32);
            show('新密钥仅作为草稿，当前保存的连接未修改。请完成云端配置后再同步角色；已有机器人请勿随意更换云端密钥。');
        });
        panel.querySelector('[data-tg-copy]').onclick = () => busy(async () => {
            if (!/^[a-f0-9]{64}$/i.test(secret.value.trim())) throw new Error('请先生成 64 位同步密钥');
            await navigator.clipboard.writeText(secret.value.trim());
            show('密钥已复制，当前保存的连接未修改。已有机器人正常使用时，无需更换云端密钥。');
        });
        panel.querySelector('[data-tg-pull]').onclick = () => busy(async () => {
            pause.textContent = '暂停记录同步';
            const count = await pullHistory({ manual: true });
            show(historyProgress.more ? '同步已暂停，已保存进度，再次点击可继续。' : count ? 'TG 聊天记录已同步到童话集，并保存到本地数据库。'
                : '已经是最新的聊天记录，没有需要新增的消息。');
        });
        panel.querySelector('[data-tg-sync]').onclick = () => busy(async () => {
            if (recordId() !== id) throw new Error('童话集账号已切换，请重新打开 TG 设置');
            const syncKey = secret.value.trim(), contactId = selectedContactId;
            const service = validateServiceUrl(serviceInput.value);
            if (!/^[a-f0-9]{64}$/i.test(syncKey)) throw new Error('请先填写 64 位同步密钥');
            if (!contactId) throw new Error('请先选择角色');
            const active = await read();
            if (active.syncKey && (active.syncKey !== syncKey || serviceFor(active) !== service || String(active.contactId) !== contactId) &&
                !await confirmChange('更改 TG 绑定配置？', '角色、Worker 地址或同步密钥与当前连接不同。确认后才会更新绑定，请检查所选角色和地址。', '确认更改')) return;
            stage('1 / 5 · 正在检查 Worker 连接…');
            const health = await fetch(service + '/health', { signal: AbortSignal.timeout(12000), cache: 'no-store' });
            if (!health.ok) throw new Error('Worker 检查失败（HTTP ' + health.status + '）');
            const state = await health.json();
            if (state.phase !== 'role-sync' || !state.owner_restriction_configured) {
                throw new Error('你的 Worker 尚未完成个人角色接入配置，请检查所需密钥。');
            }
            if (!state.storage_ready) throw new Error('你的 Worker 尚未绑定 D1 数据库 DB');
            if (!state.queue_ready) throw new Error('你的 Worker 缺少 TG_QUEUE 绑定');
            if (!state.sync_ready) throw new Error('请先将本页生成的密钥保存到你的 Cloudflare Worker：TG_SYNC_KEY（Secret）');
            const former = await read();
            const formerService = typeof former.serviceUrl === 'string' ? former.serviceUrl :
                (former.syncKey ? LEGACY_SERVICE : '');
            // Only pull history when the saved connection is the same fully configured endpoint.
            // First-time setup and key rotation must not query the old or empty Worker address.
            if (String(former.contactId || '') === contactId &&
                formerService === service && String(former.syncKey || '') === syncKey) {
                show('正在合并 TG 历史和童话集聊天记录…');
                pause.textContent = '暂停记录同步';
                await pullHistory({ manual: true });
                if (historyProgress.more) throw new Error('历史同步已暂停，已保留进度；继续完成后再同步角色。');
            }
            stage('2 / 5 · 正在组装角色、人设、世界书和记忆…');
            show('正在读取当前角色的人设、世界书、记忆和聊天记录…');
            const allowedApiIds = Array.from(apiList.querySelectorAll('input:checked'), input => input.value);
            const payload = await snapshot(contactId, allowedApiIds);
            const stickers = await syncBoundStickers(contactId, syncKey, id, message => { show(message); stage('3 / 5 · ' + message); }, service);
            payload.runtime.mediaAssets = stickers.mediaAssets;
            if (recordId() !== id) throw new Error('童话集账号已切换，已停止同步');
            stage('4 / 5 · 正在上传角色及 ' + payload.history.length + ' 条上下文，等待云端加密保存（最长 30 秒）…');
            const response = await fetch(service + '/v1/sync', {
                method: 'POST', redirect: 'error', credentials: 'omit', signal: AbortSignal.timeout(30000),
                headers: { Authorization: 'Bearer ' + syncKey, 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });
            const result = await response.json().catch(() => ({}));
            if (!response.ok || !result.ok) throw new Error(result.error || 'Telegram 角色同步失败（HTTP ' + response.status + '）');
            stage('5 / 5 · 云端已保存，正在保存本机绑定…');
            const priorService = typeof saved.serviceUrl === 'string' ? saved.serviceUrl :
                (saved.syncKey ? LEGACY_SERVICE : '');
            await save(id, { contactId, syncKey, serviceUrl: service, allowedApiIds,
                ...(String(saved.contactId || '') !== contactId || priorService !== service ?
                    { cursor: { stamp: 0, after: 0 }, mediaRepairVersion: '' } : {}) });
            lastContextPush = Date.now();
            meter.max = 1; meter.value = 1; progressText.textContent = '同步完成 · 5 / 5';
            show('角色与表情包同步成功。童话集表情：' + stickers.mediaAssets.length + '/' +
                stickers.total + ' 个可在 TG 使用。' +
                (result.api_switch_supported ? '\nTG 发送 /api 查看或切换已授权的 API。' : '\n当前 Worker 版本较旧，请更新 Worker 后使用 TG 快捷切换 API。') +
                (stickers.problems.length ? '\\n未同步 ' + stickers.problems.length + ' 个：' +
                    stickers.problems.slice(0, 4).join('；') : '') +
                '\\n现在可以去 Telegram 联系自己的机器人了。');
        });
        show(!list.length ? (contactLoadError || '当前童话集账号还没有可绑定的角色，请先在联系人创建角色。')
            : saved.syncKey ? '已读取本机的 TG 绑定资料。请选择角色并同步。'
            : '先打开部署教程创建自己的 Worker 和 Bot，然后回来绑定角色并同步。');
    }
    window.TelegramCharacterBridge = { mount, pullHistory, prepareMessageMedia: showStoredMedia, prepareVisibleMedia };
    window.addEventListener('pagehide', () => {
        for (const url of objectUrls) URL.revokeObjectURL(url);
        objectUrls.clear();
        blobUrls.clear();
        visibleMedia.clear(); visibleMessages.clear();
    });
    const autoPull = () => {
        if (document.visibilityState === 'hidden' || !db || !appSettingsLoaded || pauseRequested) return;
        void pullHistory()
            .then(() => {
                if (historyProgress.more && !pauseRequested) setTimeout(autoPull, 1500);
                else if (!historyProgress.more) return refreshRemoteContext();
            })
            .catch(error => console.debug('TG history sync paused:', error?.message || error));
    };
    setTimeout(autoPull, 5000);
    window.addEventListener('focus', autoPull);
    document.addEventListener('visibilitychange', autoPull);
    setInterval(autoPull, 60000);
})();




