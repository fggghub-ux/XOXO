// Self-hosted QQ connections. Credentials and cursors live in the existing IndexedDB.
(function () {
    'use strict';
    const tasks = new Map();
    const timers = new Map();
    const lastPush = new Map();
    const writes = new Map();
    let polling = false;
    let cancelLogin = () => {};
    let imageUrls = new WeakMap();
    const allocatedUrls = new Set();
    function prepareMessageMedia(message) {
        if (!Array.isArray(message?.qqMedia)) return;
        const urls = message.qqMedia.map(media => {
            if (!media.blob || typeof media.blob.arrayBuffer !== 'function') return '';
            let url = imageUrls.get(media.blob);
            if (!url) { url = URL.createObjectURL(media.blob); imageUrls.set(media.blob, url); allocatedUrls.add(url); }
            return url;
        }).filter(Boolean);
        if (urls.length) message.imageUrl = urls.length === 1 ? urls[0] : urls;
    }
    const version = '20261023-qq-context-origin-v1';
    const randomHex = count => Array.from(crypto.getRandomValues(new Uint8Array(count)), b => b.toString(16).padStart(2, '0')).join('');
    const owner = () => String(document.documentElement.dataset.accessQq || '');
    const account = () => String(wcGetCurrentAccountId());
    const recordId = () => 'qqCharacterBridge_' + owner() + '_' + account();
    const guard = id => { if (id !== recordId()) throw new Error('账号已切换，请重新打开 QQ 接入设置'); };
    async function config() { return (await wcReadLayoutRecord(recordId()))?.data || { connections: [] }; }
    function save(id, data) {
        if (!db || !appSettingsLoaded) return Promise.reject(new Error('数据尚未准备好'));
        return new Promise((resolve, reject) => {
            const tx = db.transaction([storeName], 'readwrite');
            (window.CharacterRecordCleanup?.wrap(tx.objectStore(storeName)) || tx.objectStore(storeName)).put({ id, data });
            tx.oncomplete = () => resolve(true);
            tx.onerror = tx.onabort = () => reject(tx.error || new Error('QQ 设置保存失败'));
        });
    }
    function update(id, mutate) {
        const task = (writes.get(id) || Promise.resolve()).catch(() => {}).then(async () => {
            const data = (await wcReadLayoutRecord(id))?.data || { connections: [] };
            guard(id);
            mutate(data);
            await save(id, data);
            return data;
        });
        writes.set(id, task);
        task.finally(() => { if (writes.get(id) === task) writes.delete(id); }).catch(() => {});
        return task;
    }
    async function hash(value) {
        return Array.from(new Uint8Array(await crypto.subtle.digest('SHA-256', new TextEncoder().encode(value))), b => b.toString(16).padStart(2, '0')).join('');
    }
    function serverUrl(value) {
        const address = String(value || '').trim();
        if (!address) throw new Error('请先填写自己的服务器地址');
        const invalidAddress = '服务器地址请填写完整的 HTTPS 域名，例如 https://qq.example.com';
        let url;
        try { url = new URL(address); }
        catch { throw new Error(invalidAddress); }
        if (url.protocol !== 'https:' || url.username || url.password || url.search || url.hash || url.pathname !== '/') {
            throw new Error(invalidAddress);
        }
        return url.origin;
    }
    async function request(connection, action, data = {}) {
        const response = await fetch(serverUrl(connection.url) + '/v1/' + action, { method: 'POST',
            headers: { Authorization: 'Bearer ' + connection.token, 'Content-Type': 'application/json' },
            body: JSON.stringify(data), signal: AbortSignal.timeout(20000), redirect: 'error', credentials: 'omit' });
        const result = await response.json().catch(() => ({}));
        if (action === 'qq-login' && response.status === 404) throw new Error('服务器尚不支持前端扫码，请展开部署与更新，生成部署／更新命令');
        if (!response.ok || !result.ok) throw new Error(result.error || '无法连接自己的 QQ 服务器，请检查地址、证书和服务状态');
        return result;
    }
    async function snapshot(contactId, connection, configId) {
        const contact = wcContactsList.find(item => String(item.id) === String(contactId));
        const api = wcResolveChatApi(contact?.apiConfig);
        if (!contact || !api?.url || !api?.key || !api?.model) throw new Error('请先配置当前角色的私聊 API');
        const format = await wcRequestApiReply({ contactId, qqContextOnly: true });
        if (!format?.prompt) throw new Error('角色上下文尚未准备好，请稍后重试');
        const limit = Math.max(80, Math.min(500, Number(format.historyLimit) || 0));
        const messages = (wcChatMessagesByContact[contactId] || []).filter(item => ['sent', 'received'].includes(item?.type)
            && !item.isSystemHidden && !item.isBlocked && String(item.text || '').trim()).slice(-limit);
        const history = [], mediaAssets = [], nextCache = {};
        let mediaReady;
        const mediaRequest = async (body, json = false) => {
            const response = await fetch(serverUrl(connection.url) + '/v1/media?scope=' + encodeURIComponent(connection.scope), {
                method: 'POST', headers: { Authorization: 'Bearer ' + connection.token, 'Content-Type': json ? 'application/json' : 'application/octet-stream' },
                body: json ? JSON.stringify(body) : body, signal: AbortSignal.timeout(60000), redirect: 'error', credentials: 'omit' });
            const result = await response.json().catch(() => ({})); guard(configId);
            if (!response.ok || !result.ok) throw new Error(result.error || '图片同步失败，请先更新自己的角色服务器');
            return result;
        };
        const upload = async (source, kind, label) => {
            if (!mediaReady) mediaReady = (async () => {
                const state = await request(connection, 'status'); guard(configId);
                if (!state.media) throw new Error('服务器尚不支持图片与表情包，请先执行新生成的部署／更新命令');
                const ids = [...new Set(Object.values(connection.mediaCache || {}).map(item => item.id))].filter(value => /^[a-f0-9]{64}$/.test(value));
                return new Set(ids.length ? (await mediaRequest({ ids: ids.slice(0, 600) }, true)).ids : []);
            })();
            const existing = await mediaReady;
            let key, body, json = false;
            if (source.blob && typeof source.blob.arrayBuffer === 'function') {
                body = await source.blob.arrayBuffer(); key = await hashBytes(body);
            } else {
                const src = String(source.url || ''); key = await hash(src);
                const cached = nextCache[key] || connection.mediaCache?.[key];
                if (cached && existing.has(cached.id)) { nextCache[key] = cached; return { ...cached, kind, label }; }
                if (/^https?:\/\//i.test(src)) { body = { url: src }; json = true; }
                else {
                    if (!/^(?:blob:|data:image\/)/i.test(src)) throw new Error('表情包或图片地址无效');
                    const response = await fetch(src); body = await response.arrayBuffer();
                }
            }
            guard(configId);
            if (!json && body.byteLength > 8 * 1024 * 1024) throw new Error('单张图片或表情包不能超过 8 MiB');
            const cached = nextCache[key] || connection.mediaCache?.[key];
            const media = cached && existing.has(cached.id) ? cached : await mediaRequest(body, json);
            const stored = { id: media.id, mime: media.mime, size: media.size }; nextCache[key] = stored; existing.add(stored.id);
            return { ...stored, kind, label };
        };
        const pool = typeof wcGetRepairEmojiPool === 'function' ? wcGetRepairEmojiPool(contact) :
            (typeof wcEmojiGroups === 'undefined' ? [] : wcEmojiGroups.filter(group => contact.boundEmojiGroups?.includes('all')
                || contact.boundEmojiGroups?.includes(group.id)).flatMap(group => group.emojis || []));
        if (pool.length > 500) throw new Error('角色绑定表情包超过 500 项，请缩小绑定范围后同步');
        for (const emoji of pool) if (emoji.url) mediaAssets.push(await upload({ url: emoji.url }, 'sticker', String(emoji.desc || '表情包').slice(0, 120)));
        for (let index = 0; index < messages.length; index++) {
            const item = messages[index], images = [];
            if (index >= messages.length - 40) {
                const sources = item.qqMedia?.length ? item.qqMedia : (Array.isArray(item.imageUrl) ? item.imageUrl : item.imageUrl ? [item.imageUrl] : [])
                    .filter(url => !(typeof wcIsPlaceholderImageSrc === 'function' && wcIsPlaceholderImageSrc(url))).map(url => ({ url }));
                for (const source of sources.slice(0, 4)) {
                    const sticker = source.sticker === true || /^\[(?:表情|表情包)\]/.test(item.text);
                    const label = String(source.label || item.text || '聊天图片').slice(0, 120);
                    const media = await upload(source, 'image', label); images.push({ id: media.id, mime: media.mime, label, sticker });
                    if (!sticker) mediaAssets.push(media);
                }
            }
            history.push({ id: item.id, type: item.type, text: String(item.text), createdAt: window.WcChatTemporal.readTimestamp(item.createdAt), ...(images.length ? { images } : {}) });
        }
        const uniqueAssets = [...new Map(mediaAssets.map(asset => [asset.kind + ':' + asset.id, asset])).values()];
        if (uniqueAssets.length > 600) throw new Error('本轮图片和表情包资源超过 600 项，请缩小角色表情包绑定范围');
        if (mediaReady) await update(configId, data => {
            const current = data.connections.find(item => item.scope === connection.scope);
            if (!current) throw new Error('QQ 连接已移除'); current.mediaCache = nextCache;
        });
        return { name: contact.name || contact.remark || '角色', history,
            runtime: { ...format, api: { url: api.url, key: api.key, model: api.model, temperature: api.temperature ?? 0.8 },
                mediaOrigin: serverUrl(connection.url), mediaAssets: uniqueAssets,
                timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone || 'Asia/Shanghai' } };
    }
    async function hashBytes(value) {
        return Array.from(new Uint8Array(await crypto.subtle.digest('SHA-256', value)), b => b.toString(16).padStart(2, '0')).join('');
    }
    async function importEvents(contactId, result, id, connection) {
        guard(id);
        let changed = false;
        const imagesFor = async images => {
            const media = [];
            for (const image of images) {
                const existing = (wcChatMessagesByContact[contactId] || []).flatMap(message => message.qqMedia || []).find(item => item.id === image.id && item.blob?.arrayBuffer);
                if (existing) { media.push({ ...image, blob: existing.blob }); continue; }
                const response = await fetch(serverUrl(connection.url) + '/v1/media?scope=' + encodeURIComponent(connection.scope) + '&id=' + encodeURIComponent(image.id), {
                    headers: { Authorization: 'Bearer ' + connection.token }, signal: AbortSignal.timeout(20000), credentials: 'omit', redirect: 'error' });
                if (!response.ok) throw new Error('QQ 图片下载未完成，记录与同步位置已保留');
                const blob = await response.blob(); guard(id);
                if (blob.size > 8 * 1024 * 1024) throw new Error('QQ 图片超过当前同步容量');
                media.push({ ...image, blob });
            }
            return media;
        };
        for (const event of result.events || []) {
            if (event.type === 'sent') {
                const media = event.images?.length ? await imagesFor(event.images) : [];
                const message = wcAppendChatMessage(event.text, 'sent', contactId, null, null, false, null, null,
                    { remoteMessageId: event.id, sourceChannel: 'qq', createdAt: event.createdAt });
                if (media.length) { message.qqMedia = media; prepareMessageMedia(message); }
            } else if (event.type === 'received') {
                if (event.parts?.some(part => part.type === 'image')) {
                    const auxiliary = event.text.split('\n').map(line => JSON.parse(line)).filter(frame => frame.channel !== 'chat');
                    for (let index = 0; index < event.parts.length; index++) {
                        const part = event.parts[index], media = part.type === 'image' ? await imagesFor([part]) : [];
                        const text = part.type === 'text' ? part.text : (part.sticker ? '[表情] ' : '[图片] ') + part.label;
                        const message = window.wcReceiveBackendMessage(contactId, { ...event, id: event.id + ':part:' + index,
                            text: [...(index === 0 ? auxiliary : []), { channel: 'chat', kind: 'say', text }].map(frame => JSON.stringify(frame)).join('\n'),
                            createdAt: event.createdAt + index, sourceChannel: 'qq' });
                        if (!message) throw new Error('QQ 回复尚未成功解析，已保留服务器原记录');
                        if (media.length) { message.qqMedia = media; prepareMessageMedia(message); }
                    }
                } else {
                    const message = window.wcReceiveBackendMessage(contactId, { ...event, sourceChannel: 'qq' });
                    if (!message) throw new Error('QQ 回复尚未成功解析，已保留服务器原记录');
                }
            } else throw new Error('QQ 消息类型无法识别，已停止推进同步位置');
            changed = true;
        }
        if (changed && await wcSaveChatContactData(contactId) !== true) throw new Error('QQ 聊天记录未保存成功，稍后会重新同步');
        guard(id);
        if (changed && String(wcCurrentChatContactId) === String(contactId)) wcRenderChatMessages(contactId);
        return changed;
    }
    function sync(contactId, { push = false, operation = 'sync' } = {}) {
        const id = recordId(), key = id + ':' + contactId;
        const previous = tasks.get(key) || Promise.resolve();
        const task = previous.catch(() => {}).then(async () => {
            guard(id);
            let saved = await config();
            const connection = saved.connections.find(item => String(item.contactId) === String(contactId));
            if (!connection) return;
            let result, changed = false;
            const transfer = async (content = {}, action = 'sync') => {
                do {
                    result = await request(connection, 'sync', { scope: connection.scope, cursor: connection.cursor || 0,
                        mediaOrigin: serverUrl(connection.url), ...content, operation: action });
                    guard(id);
                    changed = await importEvents(contactId, result, id, connection) || changed;
                    // Advance only after both the conversation transaction and the cursor transaction succeed.
                    await update(id, data => {
                        const current = data.connections.find(item => item.scope === connection.scope);
                        if (!current) throw new Error('QQ 连接已移除');
                        Object.assign(current, { cursor: Math.max(Number(current.cursor) || 0, result.cursor), active: result.active,
                            enabled: result.enabled, updatedAt: result.updatedAt });
                    });
                    connection.cursor = result.cursor;
                    content = {}; action = 'sync';
                } while (result.hasMore);
            };
            try {
                // Recover QQ records before exporting context; a cold client may not have its API ready yet.
                // Initial activation still supplies the runtime needed to create a new server role.
                if (push && operation === 'sync') await transfer();
                const content = push ? await snapshot(contactId, connection, id) : {};
                guard(id);
                await transfer(content, operation);
                if (push) lastPush.set(key, Date.now());
                return result;
            } finally {
                if (changed && id === recordId()) {
                    try {
                        const api = wcResolveChatApi(wcContactsList.find(item => String(item.id) === String(contactId))?.apiConfig);
                        if (api) wcQueueChatMemoryTurn(api, contactId);
                    } catch (error) { console.debug('QQ memory summary deferred:', error.message); }
                }
            }
        });
        tasks.set(key, task);
        task.finally(() => { if (tasks.get(key) === task) tasks.delete(key); }).catch(() => {});
        return task;
    }
    function scheduleSync(contactId) {
        const id = recordId(), key = id + ':' + contactId;
        if (!owner()) return;
        clearTimeout(timers.get(key));
        timers.set(key, setTimeout(() => {
            timers.delete(key);
            if (recordId() === id) void sync(contactId, { push: true }).catch(() => {});
        }, 5000));
    }
    async function poll() {
        if (polling || !owner() || document.visibilityState === 'hidden' || !appSettingsLoaded
            || (typeof navigator !== 'undefined' && navigator.onLine === false)
            || (typeof wcChatDataHydrated !== 'undefined' && !wcChatDataHydrated)) return;
        polling = true;
        try {
            const id = recordId(), saved = await config();
            for (const connection of saved.connections) {
                guard(id);
                if (!wcContactsList.some(item => String(item.id) === String(connection.contactId))) continue;
                const key = id + ':' + connection.contactId;
                if (tasks.has(key)) continue;
                try { await sync(connection.contactId, { push: Date.now() - (lastPush.get(key) || 0) > 180000 }); }
                catch (error) { guard(id); console.debug('QQ role sync deferred:', error.message); }
            }
        } catch (error) { console.debug('QQ connection sync deferred:', error.message); }
        finally { polling = false; }
    }
    function close() { cancelLogin(); document.getElementById('wc-qq-character-settings')?.remove(); }
    async function openSettings(options = {}) {
        close();
        const id = recordId();
        if (!/^[1-9]\d{4,11}$/.test(owner())) throw new Error('请先登录童话集');
        if (typeof window.wcReloadContactsFromStorage === 'function') {
            await window.wcReloadContactsFromStorage();
            guard(id);
        }
        const saved = await config(); guard(id);
        const contacts = typeof wcContactsList !== 'undefined' && Array.isArray(wcContactsList) ? wcContactsList : [];
        let contactId = String(options.contactId || saved.selectedContactId || saved.connections[0]?.contactId || contacts[0]?.id || '');
        if (!contacts.some(item => String(item.id) === contactId)) contactId = String(contacts[0]?.id || '');
        let connection = saved.connections.find(item => String(item.contactId) === contactId);
        const page = document.createElement('section');
        page.id = 'wc-qq-character-settings'; page.hidden = true;
        page.className = options.host ? 'qq-embedded' : '';
        page.setAttribute('role', options.host ? 'region' : 'dialog');
        if (!options.host) page.setAttribute('aria-modal', 'true');
        page.setAttribute('aria-label', 'QQ 私聊接入');
        page.innerHTML = `<style>
          #wc-qq-character-settings{position:absolute;inset:0;z-index:12500;background:#fff;color:#111;display:flex;flex-direction:column;font-family:inherit}
          #wc-qq-character-settings[hidden]{display:none}
          #wc-qq-character-settings .qq-content{overflow-y:auto;flex:1;padding:20px 20px max(32px,env(safe-area-inset-bottom));-webkit-overflow-scrolling:touch}
          #wc-qq-character-settings p{font-size:13px;line-height:1.7;color:#777;margin:0 0 20px}
          #wc-qq-character-settings .qq-card{background:#fff;border:1px solid #e9e9ec;border-radius:18px;padding:4px 16px;margin-bottom:18px}
          #wc-qq-character-settings label{display:block;padding:14px 0;font-size:13px;color:#777}
          #wc-qq-character-settings label+label{border-top:1px solid #eee}
          #wc-qq-character-settings input{display:block;box-sizing:border-box;width:100%;margin-top:8px;padding:3px 0;border:0;outline:none;background:transparent;color:#111;font:inherit;font-size:16px}
          #wc-qq-character-settings select{display:block;box-sizing:border-box;width:100%;margin-top:8px;padding:3px 0;border:0;outline:none;background:transparent;color:#111;font:inherit;font-size:16px}
          #wc-qq-character-settings.qq-embedded{position:relative;inset:auto;z-index:auto;background:transparent}
          #wc-qq-character-settings.qq-embedded>nav{display:none}
          #wc-qq-character-settings.qq-embedded .qq-content{overflow:visible;padding:0 20px 24px;flex:none}
          #wc-qq-character-settings .qq-action{width:100%;border:1px solid #e5e5ea;border-radius:14px;padding:15px;margin:0 0 10px;background:#fff;color:#111;font:inherit;font-size:15px;font-weight:600;cursor:pointer}
          #wc-qq-character-settings .qq-action:active:not(:disabled){background:#e5e5ea}
          #wc-qq-character-settings .qq-action.qq-primary{background:#171719;border-color:#171719;color:#fff}
          #wc-qq-character-settings .qq-action.qq-primary:active:not(:disabled){background:#303033;border-color:#303033}
          #wc-qq-character-settings .qq-action:disabled{opacity:.45}
          #wc-qq-character-settings textarea{box-sizing:border-box;width:100%;min-height:160px;border:1px solid #ddd;border-radius:12px;padding:12px;background:#fafafa;color:#333;font-size:12px;resize:vertical}
          #wc-qq-character-settings [data-status]{white-space:pre-wrap;color:#555;margin:12px 0}
          #wc-qq-character-settings details{font-size:14px;margin:12px 0 22px}
          #wc-qq-character-settings summary{padding:12px 0;font-weight:600;cursor:pointer}
          #wc-qq-character-settings .qq-login-card{padding:18px;text-align:center}
          #wc-qq-character-settings .qq-login-card[hidden],#wc-qq-character-settings .qq-login-card [hidden]{display:none}
          #wc-qq-character-settings .qq-login-card img{display:block;width:min(240px,100%);height:auto;margin:12px auto;background:#fff;-webkit-touch-callout:default;user-select:auto}
          #wc-qq-character-settings .qq-login-card p{margin:10px 0}
          #wc-qq-character-settings .qq-login-card a{display:block;box-sizing:border-box;text-decoration:none}
        </style>
        <nav class="wc-settings-navbar"><button type="button" class="wc-settings-nav-btn-left" data-close aria-label="返回"><svg viewBox="0 0 24 24"><polyline points="14 18 8 12 14 6"/></svg></button><strong class="wc-settings-nav-title">QQ 私聊接入</strong><div class="wc-settings-nav-save"></div></nav>
        <div class="qq-content"><p>部署到自己的服务器，使用自己登录的 QQ 与角色聊天。人设、聊天上下文、记忆、世界书及角色 API 配置会发送到你填写的服务器。</p>
          <div class="qq-card"><label>目标角色<select data-contact aria-label="QQ 接入角色"></select></label></div>
          <div class="qq-card"><label>自己的服务器地址<input data-url type="url" placeholder="https://qq.example.com" autocapitalize="none" spellcheck="false"></label><label>部署密钥<input data-token type="password" autocomplete="new-password" placeholder="部署时生成的密钥" autocapitalize="none" spellcheck="false"></label></div>
          <button class="qq-action" data-qq-login>扫码登录角色 QQ</button>
          <button class="qq-action" data-login-switch>切换 QQ 账号</button>
          <div class="qq-card qq-login-card" data-login-panel hidden>
            <strong>登录角色专用 QQ</strong>
            <p data-login-status role="status"></p><img data-login-image alt="角色 QQ 登录二维码" hidden>
            <p>请用角色专用的另一个 QQ 扫码并确认登录。用当前手机操作时，可保存二维码，再到该 QQ 的扫一扫中从相册识别。</p>
            <a class="qq-action" data-login-save download="character-qq-login.png" hidden>保存二维码</a>
            <button class="qq-action" data-login-refresh>刷新二维码</button>
            <button class="qq-action" data-login-hide>收起</button>
          </div>
          <button class="qq-action qq-primary" data-connect>连接、同步并使用当前角色</button>
          <button class="qq-action" data-sync>立即同步上下文与 QQ 记录</button>
          <p>QQ 连发消息会在停发 30 秒后一起回复，每条新消息重新计时；发完也可在 QQ 发送 /回复 立即开始。文字、图片和表情包记录仍逐条保存。</p>
          <button class="qq-action" data-pause>暂停当前角色的 QQ 回复</button>
          <button class="qq-action" data-unlink>解除当前角色的连接</button>
          <p data-status role="status"></p>
          <details><summary>部署与更新 · 自己的服务器</summary>
            <p>准备一台已安装 Docker Compose 或 Podman + podman-compose 的 Linux 服务器（需要能运行 docker compose），并将上方域名解析到服务器。确保 80、443、6100 端口可用。填写地址后生成命令，整条复制到自己的服务器终端运行。命令会自动识别首次部署或更新。</p>
            <button class="qq-action" data-generate>生成部署／更新命令</button><textarea data-command aria-label="部署或更新命令" readonly hidden></textarea><button class="qq-action" data-copy hidden>复制命令</button>
            <p>首次部署后点击“扫码登录角色 QQ”。已有部署请使用原部署密钥，在原服务器运行更新命令，完成后直接点“连接、同步并使用当前角色”；更新保留 QQ 登录和角色绑定，无需重新扫码。</p>
          </details>
          <p>QQ 中发送 /角色 查看列表，发送 /切换 序号 切换角色，/暂停 暂停，/继续 恢复。只有当前登录童话集账号绑定的 QQ 能与角色私聊。客户端关闭后使用上次同步的资料；新消息在下次打开时同步回来。</p>
        </div>`;
        const find = selector => page.querySelector(selector);
        const picker = find('[data-contact]');
        picker.innerHTML = contacts.length ? '<option value="">请选择要接入 QQ 的角色</option>'
            : '<option value="">当前微信面具账号下暂无角色</option>';
        picker.disabled = !contacts.length;
        contacts.forEach(contact => {
            const option = document.createElement('option');
            option.value = String(contact.id); option.textContent = contact.name || contact.remark || '未命名角色';
            picker.appendChild(option);
        });
        picker.value = contactId;
        find('[data-url]').value = connection?.url || saved.draft?.url || saved.connections[0]?.url || '';
        find('[data-token]').value = connection?.token || saved.draft?.token || saved.connections[0]?.token || '';
        const status = message => { find('[data-status]').textContent = message; };
        let loginEpoch = 0, loginTimer = null, imageUrl = '', qrText = '', loginConnection = null, loginStarted = 0;
        const clearLoginImage = () => {
            if (imageUrl) URL.revokeObjectURL(imageUrl);
            imageUrl = ''; qrText = '';
            find('[data-login-image]').hidden = true; find('[data-login-image]').removeAttribute?.('src');
            find('[data-login-save]').hidden = true; find('[data-login-save]').removeAttribute?.('href');
        };
        const stopLogin = () => {
            loginEpoch++; clearTimeout(loginTimer); loginTimer = null; loginConnection = null;
            clearLoginImage(); find('[data-login-panel]').hidden = true;
        };
        cancelLogin = stopLogin;
        const currentLogin = epoch => epoch === loginEpoch && id === recordId() && page.isConnected !== false
            && loginConnection?.url === find('[data-url]').value.trim().replace(/\/$/, '')
            && loginConnection?.token === find('[data-token]').value.trim();
        const showLogin = async (result, epoch) => {
            if (!currentLogin(epoch)) return false;
            const messages = { online: `角色 QQ${result.accountQq ? ' ' + result.accountQq : ''} 已登录，请选择角色后点击“连接、同步并使用当前角色”。`,
                scanned: '已扫码，等待 QQ 确认并完成登录…', waiting: '请用角色专用 QQ 扫码确认',
                restarting: '正在切换 QQ 账号，等待新的登录二维码…角色回复已暂停，登录后请点击“连接、同步并使用当前角色”恢复。',
                pending: 'QQ 登录组件正在准备二维码，请稍候…', offline: '角色 QQ 已离线，请刷新二维码重新登录',
                error: 'QQ 登录未成功，请刷新二维码后重试' };
            find('[data-login-status]').textContent = messages[result.state] || messages.pending;
            const value = typeof result.qrcode === 'string' ? result.qrcode.slice(0, 4096) : '';
            if (!value || result.state === 'online' || result.state === 'scanned') clearLoginImage();
            else if (value !== qrText) {
                clearLoginImage();
                if (!window.QRCode) await window.tonghuajiRuntime.ensureScript('js/vendor/qrcode.min.js');
                if (!currentLogin(epoch)) return false;
                const holder = document.createElement('div');
                const qr = new window.QRCode(holder, { width: 256, height: 256, correctLevel: window.QRCode.CorrectLevel.M });
                // Keep the existing QR renderer on canvas; export only a temporary PNG Blob.
                qr.makeImage = () => {}; qr.makeCode(value);
                const canvas = document.createElement('canvas'); canvas.width = canvas.height = 384;
                const drawing = canvas.getContext('2d'); drawing.fillStyle = '#fff'; drawing.fillRect(0, 0, 384, 384);
                drawing.drawImage(holder.querySelector('canvas'), 64, 64);
                const blob = await new Promise(resolve => canvas.toBlob(resolve, 'image/png'));
                if (!currentLogin(epoch)) return false;
                if (!blob) throw new Error('二维码图片生成失败，请重试');
                imageUrl = URL.createObjectURL(blob); qrText = value;
                find('[data-login-image]').src = imageUrl; find('[data-login-image]').hidden = false;
                find('[data-login-save]').href = imageUrl; find('[data-login-save]').hidden = false;
            }
            return !['online', 'error', 'offline'].includes(result.state);
        };
        const scheduleLogin = epoch => {
            clearTimeout(loginTimer);
            loginTimer = setTimeout(async () => {
                if (!currentLogin(epoch)) { if (epoch === loginEpoch) stopLogin(); return; }
                if (Date.now() - loginStarted > 180000) {
                    clearLoginImage(); find('[data-login-status]').textContent = '二维码等待已超时，请刷新二维码'; return;
                }
                if (document.visibilityState === 'hidden' || page.closest?.('[data-hotspot-panel]')?.hidden) { scheduleLogin(epoch); return; }
                try {
                    const result = await request(loginConnection, 'qq-login', { operation: 'status' });
                    if (await showLogin(result, epoch)) scheduleLogin(epoch);
                } catch (error) {
                    if (currentLogin(epoch)) { clearLoginImage(); find('[data-login-status]').textContent = error.message || '登录状态读取失败，请重新获取二维码'; }
                }
            }, 3000);
        };
        const clearCommand = () => {
            find('[data-command]').value = ''; find('[data-command]').hidden = true; find('[data-copy]').hidden = true;
        };
        find('[data-url]').oninput = find('[data-token]').oninput = () => { stopLogin(); clearCommand(); };
        find('[data-login-hide]').onclick = stopLogin;
        status(!contacts.length ? '当前微信面具账号下还没有角色，请先在微信中添加角色，再重新打开 QQ 接入。'
            : connection ? `已保存连接${connection.active ? ' · 当前角色' : ''}\n资料同步：${connection.updatedAt ? new Date(connection.updatedAt).toLocaleString() : '等待同步'}` : '尚未连接自己的 QQ 服务器');
        const requireContact = () => {
            if (!contacts.some(item => String(item.id) === String(contactId))) throw new Error('请先选择要接入 QQ 的角色');
        };
        picker.onchange = async () => {
            stopLogin(); clearCommand();
            const selected = picker.value;
            contactId = selected;
            try {
                const current = await config(); guard(id);
                if (contactId !== selected) return;
                connection = current.connections.find(item => String(item.contactId) === selected);
                find('[data-url]').value = connection?.url || current.draft?.url || current.connections[0]?.url || '';
                find('[data-token]').value = connection?.token || current.draft?.token || current.connections[0]?.token || '';
                await update(id, data => { data.selectedContactId = selected; });
                status(connection ? '已读取此角色的 QQ 连接配置' : '此角色尚未连接 QQ，可以复用上方服务器配置');
            } catch (error) { status(error.message); }
        };
        const act = handler => async () => {
            page.querySelectorAll('button:not([data-close]),select').forEach(b => { b.disabled = true; });
            try { guard(id); await handler(); }
            catch (error) { status(error.message || '操作失败，请重试'); }
            finally {
                page.querySelectorAll('button,select').forEach(b => { b.disabled = false; });
                picker.disabled = !contacts.length;
            }
        };
        find('[data-close]').onclick = close;
        const beginLogin = async operation => {
            stopLogin();
            const epoch = loginEpoch;
            const next = { url: serverUrl(find('[data-url]').value), token: find('[data-token]').value.trim() };
            if (!/^[a-f0-9]{64}$/i.test(next.token)) throw new Error('请先填写部署时生成的 64 位部署密钥');
            find('[data-url]').value = next.url;
            loginConnection = next; loginStarted = Date.now();
            find('[data-login-panel]').hidden = false;
            find('[data-login-status]').textContent = operation === 'switch' ? '正在请求切换角色 QQ…' : '正在读取角色 QQ 二维码…';
            try {
                const state = await request(next, 'status'); guard(id);
                if (!currentLogin(epoch)) return;
                if (state.ownerQq !== owner()) throw new Error('服务器的 OWNER_QQ 与当前童话集登录 QQ 不一致');
                if (!state.loginQr) throw new Error('服务器尚不支持前端扫码，请展开部署与更新，生成部署／更新命令');
                if (operation === 'switch' && !state.loginSwitch) throw new Error('服务器尚不支持切换 QQ，请展开部署与更新，生成部署／更新命令并在原服务器执行');
                await update(id, data => { data.draft = next; });
                if (!currentLogin(epoch)) return;
                const result = await request(next, 'qq-login', { operation });
                if (await showLogin(result, epoch)) scheduleLogin(epoch);
            } catch (error) {
                if (currentLogin(epoch)) { clearLoginImage(); find('[data-login-status]').textContent = error.message; }
                throw error;
            }
        };
        find('[data-qq-login]').onclick = act(() => beginLogin('status'));
        find('[data-login-refresh]').onclick = act(() => beginLogin('refresh'));
        find('[data-login-switch]').onclick = act(async () => {
            const message = '将退出这台角色服务器当前登录的 QQ，并暂停角色回复。角色资料和聊天记录保留，新号扫码登录后点击“连接、同步并使用当前角色”恢复。';
            const confirmed = typeof showCustomConfirm === 'function'
                ? await showCustomConfirm('切换 QQ 账号', message, '切换账号', true) : window.confirm(message);
            if (confirmed) { guard(id); await beginLogin('switch'); }
        });
        find('[data-connect]').onclick = act(async () => {
            requireContact();
            const next = { contactId, url: serverUrl(find('[data-url]').value.trim()), token: find('[data-token]').value.trim(), cursor: 0,
                scope: await hash(JSON.stringify([owner(), account(), String(contactId)])) };
            if (!/^[a-f0-9]{64}$/i.test(next.token)) throw new Error('部署密钥应为 64 位十六进制，请从自己的部署配置中复制');
            const state = await request(next, 'status'); guard(id);
            if (state.ownerQq !== owner()) throw new Error('服务器的 OWNER_QQ 与当前童话集登录 QQ 不一致');
            await update(id, data => {
                const existing = data.connections.find(c => String(c.contactId) === String(contactId));
                if (existing && existing.url !== next.url) throw new Error('请先解除旧服务器连接，再更换服务器');
                if (existing) { next.cursor = existing.cursor; next.mediaCache = existing.mediaCache; }
                data.connections = data.connections.filter(c => String(c.contactId) !== String(contactId)); data.connections.push(next);
            });
            status('正在同步角色资料、绑定表情包和图片，首次上传可能需要一些时间…');
            await sync(contactId, { push: true, operation: 'activate' });
            let latest = await request(next, 'status'); guard(id);
            if (latest.connected) { status('已连接，当前角色已启用。现在可以到 QQ 发送文字、图片和表情包。'); return; }
            if (!latest.loginQr) throw new Error('资料已同步。请先更新自己的角色服务器，再检查 QQ 登录与消息通道');
            status('角色资料已同步，正在检查 QQ 登录与消息通道…');
            const login = await request(next, 'qq-login', { operation: latest.channelSetup ? 'connect' : 'status' }); guard(id);
            if (login.state !== 'online') {
                status(login.state === 'restarting' ? '角色资料已同步，QQ 正在切号，请等待登录完成后再连接。'
                    : login.state === 'scanned' ? '角色资料已同步，请在 QQ 中确认登录，完成后再点击连接。'
                    : '角色资料已同步。QQ 尚未登录，请点击“扫码登录角色 QQ”完成登录。');
                return;
            }
            if (!latest.channelSetup) throw new Error('QQ 已登录，但消息通道尚未连接。请展开部署与更新，在原服务器执行新生成的更新命令后再点击连接');
            for (let attempt = 0; attempt < 4; attempt++) {
                await new Promise(resolve => setTimeout(resolve, 1500)); guard(id);
                latest = await request(next, 'status'); guard(id);
                if (latest.connected) break;
            }
            status(latest.connected ? 'QQ 已登录，消息通道已接通。当前角色已启用，可以到 QQ 发送文字、图片和表情包。'
                : 'QQ 已登录，角色资料已同步，但消息通道仍未连通。请稍后再点连接；若仍失败，请检查角色服务日志，无需重复扫码。');
        });
        const requireConnection = async () => {
            requireContact();
            if (!(await config()).connections.some(c => String(c.contactId) === String(contactId))) throw new Error('请先连接自己的服务器');
        };
        find('[data-sync]').onclick = act(async () => {
            await requireConnection(); status('正在同步上下文、图片与 QQ 记录…');
            await sync(contactId, { push: true }); status('上下文、绑定表情包、图片与 QQ 记录已同步');
        });
        find('[data-pause]').onclick = act(async () => { await requireConnection(); await sync(contactId, { operation: 'pause' }); status('已暂停当前角色的 QQ 回复'); });
        find('[data-unlink]').onclick = act(async () => {
            await requireConnection();
            await sync(contactId, { operation: 'unlink' }); guard(id);
            await update(id, data => { data.connections = data.connections.filter(c => String(c.contactId) !== String(contactId)); });
            status('已解除连接。客户端原聊天记录保留。');
        });
        const quote = s => "'" + String(s).replace(/'/g, "'\\''") + "'";
        const deploymentSources = async (files, marker) => Promise.all(files.map(async file => {
            const response = await fetch('js/qq-deploy/' + file + '?v=' + version, { credentials: 'same-origin', cache: 'no-store', redirect: 'error' });
            if (!response.ok) throw new Error('部署文件未加载成功，请刷新童话集后重试');
            const source = await response.text();
            if (source.startsWith('<') || source.includes(marker)) throw new Error('部署文件校验失败');
            return { file, source };
        }));
        const commandSources = (sources, marker) => "bash <<'" + marker + "'\nset -euo pipefail\numask 077\nthj_staging=$(mktemp -d)\ntrap 'rm -rf -- \"$thj_staging\"' EXIT\ncd \"$thj_staging\"\n"
            + sources.map(({ file, source }, i) => `cat > ${file} <<'${marker}_${i}'\n${source}\n${marker}_${i}`).join('\n') + '\n';
        const showCommand = command => {
            // Preserve script line breaks when mobile terminals flatten clipboard text.
            const escaped = command.replace(/\\/g, '\\\\').replace(/\r/g, '\\r').replace(/\n/g, '\\n');
            find('[data-command]').value = "printf '%b' " + quote(escaped) + ' | bash';
            find('[data-command]').hidden = false; find('[data-copy]').hidden = false;
        };
        find('[data-generate]').onclick = act(async () => {
            clearCommand();
            const url = serverUrl(find('[data-url]').value.trim());
            const domain = new URL(url).hostname;
            if (!/^[a-z0-9](?:[a-z0-9.-]*[a-z0-9])?$/i.test(domain) || !domain.includes('.') || /^\d[\d.]+$/.test(domain)) throw new Error('一键部署需要已解析到自己服务器的域名');
            const current = await config(); guard(id);
            const bound = current.connections.find(item => item.url === url);
            const known = bound || (current.draft?.url === url ? current.draft : null);
            const token = find('[data-token]').value.trim() || known?.token || randomHex(32);
            if (!/^[a-f0-9]{64}$/.test(token)) throw new Error('部署密钥格式不正确');
            if (bound?.token && bound.token !== token) throw new Error('此服务器已有绑定，请使用原部署密钥更新；更新不会更换密钥或要求重新扫码');
            find('[data-token]').value = token;
            const webui = randomHex(32), napcat = randomHex(32), marker = 'THJ_' + randomHex(8);
            const sources = await deploymentSources(['server.mjs', 'context.mjs', 'install.sh'], marker);
            guard(id);
            const variables = { THJ_DOMAIN: domain, THJ_OWNER_QQ: owner(), THJ_TOKEN: token, THJ_ORIGIN: location.origin, THJ_NAPCAT_TOKEN: napcat, THJ_WEBUI_TOKEN: webui };
            const command = commandSources(sources, marker) + `thj_install_dir="\${THJ_INSTALL_DIR:-$HOME/tonghuaji-qq}"
if [ -f "$thj_install_dir/.env" ]; then
grep -Fqx ${quote('BRIDGE_TOKEN=' + token)} "$thj_install_dir/.env" || { echo 'Deployment token mismatch. Use the original deployment token; existing login and data were preserved.' >&2; exit 1; }
grep -Eq '^WEBUI_TOKEN=.+$' "$thj_install_dir/.env" || { echo 'WEBUI_TOKEN is missing from the original role deployment.' >&2; exit 1; }
grep -Eq '@api path /v1/status /v1/sync( /v1/qq-login)?( /v1/media)?$' "$thj_install_dir/Caddyfile" || { echo 'Custom Caddyfile found. Add /v1/qq-login and /v1/media to the existing API matcher before updating.' >&2; exit 1; }
thj_backup="$thj_install_dir/update-backup-$(date +%Y%m%d%H%M%S)-$$"
install -d -m 700 "$thj_backup"
cp -p "$thj_install_dir/server.mjs" "$thj_install_dir/context.mjs" "$thj_install_dir/Caddyfile" "$thj_backup/"
sed 's|@api path /v1/status /v1/sync.*$|@api path /v1/status /v1/sync /v1/qq-login /v1/media|' "$thj_install_dir/Caddyfile" > Caddyfile.next
# Keep container identities and bind-mount inodes; older Podman Compose recreates dependencies on up.
(cd "$thj_install_dir" && docker compose stop https bridge)
if ! { cat server.mjs > "$thj_install_dir/server.mjs" && cat context.mjs > "$thj_install_dir/context.mjs" && cat Caddyfile.next > "$thj_install_dir/Caddyfile"; }; then
    cat "$thj_backup/server.mjs" > "$thj_install_dir/server.mjs"
    cat "$thj_backup/context.mjs" > "$thj_install_dir/context.mjs"
    cat "$thj_backup/Caddyfile" > "$thj_install_dir/Caddyfile"
    (cd "$thj_install_dir" && docker compose start bridge https)
    echo 'Update write failed. Original source files restored; QQ login was preserved.' >&2
    exit 1
fi
(cd "$thj_install_dir" && docker compose start bridge https)
echo 'Return to QQ access and connect/sync the current character. Existing QQ login is preserved.'
else
if [ -e "$thj_install_dir/compose.yaml" ] || [ -e "$thj_install_dir/data/state.enc" ]; then
    echo 'Original .env is missing. Restore it before updating the role deployment.' >&2
    exit 1
fi
` + Object.entries(variables).map(([key, value]) => 'export ' + key + '=' + quote(value)).join('\n')
                + '\nbash install.sh\nfi\n' + marker;
            await update(id, data => { data.draft = { url, token }; });
            showCommand(command);
            status('命令已生成。整条复制到自己的服务器执行：首次部署后扫码；已有部署保留 QQ 登录、角色绑定与原密钥，更新后直接点击“连接、同步并使用当前角色”，无需重新扫码。');
        });
        find('[data-copy]').onclick = act(async () => {
            try { await navigator.clipboard.writeText(find('[data-command]').value); status('部署／更新命令已复制'); }
            catch { find('[data-command]').focus(); find('[data-command]').select(); status('请长按或使用系统复制功能复制已选中的命令'); }
        });
        (options.host || document.getElementById('wechatAppUI')).appendChild(page); page.hidden = false;
    }
    window.QqCharacterBridge = {
        open: () => typeof window.openWeixinCloudSettings === 'function'
            ? window.openWeixinCloudSettings({ channel: 'qq' }) : openSettings().catch(error => showToast(error.message)),
        mount: host => openSettings({ host }), sync, scheduleSync, prepareMessageMedia,
        syncForChat: contactId => sync(contactId).catch(error => {
            console.debug('QQ history pull deferred:', error.message);
        }) };
    window.addEventListener('contacts:characters-deleted', event => {
        if (!event.detail?.recordsPurged) return;
        close(); timers.forEach(clearTimeout); timers.clear(); lastPush.clear();
    });
    window.addEventListener('wechat:account-changed', () => {
        allocatedUrls.forEach(url => URL.revokeObjectURL(url)); allocatedUrls.clear(); imageUrls = new WeakMap();
        close(); timers.forEach(clearTimeout); timers.clear(); lastPush.clear();
        setTimeout(() => void poll(), 1000);
    });
    window.addEventListener('pageshow', () => poll());
    window.addEventListener('online', () => poll());
    document.addEventListener('visibilitychange', () => { if (document.visibilityState === 'visible') return poll(); });
    setInterval(() => void poll(), 20000);
    setTimeout(() => void poll(), 3000);
})();

