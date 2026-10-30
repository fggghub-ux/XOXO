(function () {
    'use strict';

    const CONFIG_ID = 'weixinCloudAssistantConfig';
    const DEFAULT_DEPLOY_PROXY_URL = 'https://tonghuaji-weixin-deploy-gamma.vercel.app';
    const RUNTIME_ACTION = 'sync-runtime';
    const QR_ACTION = 'create-qr';
    const QR_STATUS_ACTION = 'qr-status';
    const STATUS_ACTION = 'status';
    const POLL_ACTION = 'poll';
    const pollTimers = new Map();

    function getCurrentAccountId() {
        return typeof wcGetCurrentAccountId === 'function' ? wcGetCurrentAccountId() : 'default';
    }

    function getAssistantTokenSessionKey() {
        return CONFIG_ID + '_assistantToken_' + getCurrentAccountId();
    }

    function readAssistantToken() {
        try { return sessionStorage.getItem(getAssistantTokenSessionKey()) || ''; } catch (_) { return ''; }
    }

    function rememberAssistantToken(token) {
        try {
            if (token) sessionStorage.setItem(getAssistantTokenSessionKey(), token);
        } catch (_) {}
    }

    function createAssistantToken() {
        const bytes = new Uint8Array(32);
        crypto.getRandomValues(bytes);
        return Array.from(bytes, byte => byte.toString(16).padStart(2, '0')).join('');
    }

    function normalizeSupabaseRef(value) {
        const input = String(value || '').trim();
        if (!input) return '';
        if (/^[a-z0-9]{15,40}$/i.test(input)) return input;
        try {
            const url = new URL(input);
            const host = url.hostname.toLowerCase();
            const match = host.match(/^([a-z0-9-]+)\.supabase\.co$/i);
            if (match) return match[1];
        } catch (_) {}
        const direct = input.match(/^https:\/\/([a-z0-9-]+)\.supabase\.co(?:\/.*)?$/i);
        if (direct) return direct[1];
        return input;
    }

    function resolveQrImageSrc(value) {
        const input = String(value || '').trim();
        if (!input) return '';
        if (/^data:image\/[a-z0-9.+-]+;base64,/i.test(input)) return input;
        if (!/^https?:\/\//i.test(input) && input.length > 100) return 'data:image/png;base64,' + input;
        if (/^https?:\/\//i.test(input)) return '';
        if (/^[A-Za-z0-9+/=]+$/.test(input)) return 'data:image/png;base64,' + input;
        return input;
    }

    function loadQrCodeLibrary() {
        if (window.QRCode) return Promise.resolve(window.QRCode);
        if (window.__weixinCloudQrPromise) return window.__weixinCloudQrPromise;
        window.__weixinCloudQrPromise = new Promise((resolve, reject) => {
            const script = document.createElement('script');
            script.src = 'js/vendor/qrcode.min.js';
            script.onload = () => window.QRCode ? resolve(window.QRCode) : reject(new Error('二维码组件加载失败'));
            script.onerror = () => reject(new Error('二维码组件加载失败'));
            document.head.appendChild(script);
        });
        return window.__weixinCloudQrPromise;
    }

    async function createQrImage(text) {
        const value = String(text || '').trim();
        if (!value) return '';
        try {
            const QRCode = await loadQrCodeLibrary();
            const holder = document.createElement('div');
            holder.style.cssText = 'position:fixed;left:-9999px;top:-9999px;width:1024px;height:1024px;';
            document.body.appendChild(holder);
            try {
                new QRCode(holder, { text: value, width: 1024, height: 1024, correctLevel: QRCode.CorrectLevel.M });
                const image = holder.querySelector('img');
                if (image?.src) return image.src;
                const canvas = holder.querySelector('canvas');
                if (canvas) return canvas.toDataURL('image/png');
            } finally {
                holder.remove();
            }
        } catch (_) {}
        return '';
    }

    function readConfig() {
        return new Promise((resolve) => {
            if (!db || !storeName) return resolve(null);
            const request = db.transaction([storeName], 'readonly').objectStore(storeName).get(CONFIG_ID + '_' + getCurrentAccountId());
            request.onsuccess = () => resolve(request.result || null);
            request.onerror = () => resolve(null);
        });
    }

    function saveConfig(config) {
        return new Promise((resolve, reject) => {
            if (!db || !storeName) return reject(new Error('数据库尚未准备好'));
            const transaction = db.transaction([storeName], 'readwrite');
            const { assistantToken, ...safeConfig } = config;
            transaction.objectStore(storeName).put({ id: CONFIG_ID + '_' + getCurrentAccountId(), ...safeConfig });
            transaction.oncomplete = () => resolve();
            transaction.onerror = () => reject(transaction.error || new Error('保存失败'));
        });
    }

    async function request(config, action, payload) {
        const url = String(config.functionUrl || '').trim().replace(/\/+$/, '');
        if (!/^https:\/\/[a-z0-9-]+\.functions\.supabase\.co\/[a-z0-9_-]+$/i.test(url)) throw new Error('云函数地址不正确');
        const response = await fetch(DEFAULT_DEPLOY_PROXY_URL.replace(/\/+$/, '') + '/api/weixin/function-proxy', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ functionUrl: url, token: config.assistantToken, action, payload })
        });
        const body = await response.json().catch(() => ({}));
        if (!response.ok) throw new Error(body.error || ('云助手请求失败：HTTP ' + response.status));
        return body;
    }

    function buildRuntime(contact, config) {
        if (!contact) throw new Error('请选择要同步的微信角色');
        const api = (typeof apiDataList !== 'undefined' ? apiDataList : []).find(item => item.id === apiConnectedId);
        if (!api || !api.url || !api.key || !api.model) throw new Error('请先在 API 连接中配置并连接一个模型');
        const history = Array.isArray(wcChatMessagesByContact?.[contact.id]) ? wcChatMessagesByContact[contact.id].slice(-80) : [];
        return {
            version: 1,
            accountId: getCurrentAccountId(),
            botId: config.botId,
            botServerUrl: config.botServerUrl || '',
            contactId: contact.id,
            contact: { id: contact.id, name: contact.name || '角色', persona: contact.persona || contact.desc || '', avatar: contact.avatar || '' },
            model: { url: api.url, key: api.key, model: api.model, temperature: api.temperature === undefined ? 0.8 : api.temperature },
            history: history.map(item => ({ id: item.id, role: item.type === 'sent' ? 'user' : 'assistant', content: String(item.text || ''), createdAt: item.createdAt || Date.now() })),
            updatedAt: new Date().toISOString()
        };
    }

    function startCloudPolling(config, statusEl) {
        const botId = String(config?.botId || '').trim();
        const assistantToken = String(config?.assistantToken || '').trim();
        if (!botId || !assistantToken) return;
        const key = getCurrentAccountId() + ':' + botId;
        const previous = pollTimers.get(key);
        if (previous) clearInterval(previous);
        const poll = async () => {
            try {
                await request(config, POLL_ACTION, { botId });
            } catch (error) {
                if (statusEl) statusEl.textContent = '微信消息轮询失败：' + (error?.message || String(error));
            }
        };
        poll();
        pollTimers.set(key, setInterval(poll, 12000));
    }

    function createHotspotPage() {
        let page = document.getElementById('weixinHotspotSettingsUI');
        if (page) return page;

        page = document.createElement('div');
        page.id = 'weixinHotspotSettingsUI';
        page.className = 'hotspot-settings-container';
        page.innerHTML = `
            <style>
                #weixinHotspotSettingsUI .hotspot-channel-switch{display:flex;flex-shrink:0;position:relative;margin:8px 20px 16px;padding:4px;border-radius:13px;background:#eeeef0;gap:4px}
                #weixinHotspotSettingsUI .hotspot-channel-switch button{flex:1;min-height:36px;border:0;border-radius:10px;background:transparent;color:#777;font:inherit;font-size:14px;font-weight:600;transition:background .2s,color .2s,box-shadow .2s}
                #weixinHotspotSettingsUI .hotspot-channel-switch button[aria-selected="true"]{background:#fff;color:#111;box-shadow:0 2px 7px #0000000c}
                #weixinHotspotSettingsUI [data-hotspot-panel][hidden]{display:none!important}
                #weixinHotspotSettingsUI .hotspot-qq-panel,#weixinHotspotSettingsUI .hotspot-tg-panel{min-height:0}
                #weixinHotspotSettingsUI [data-hotspot-qq-status]{font-size:14px;color:#777;line-height:1.6}
                @media(prefers-reduced-motion:reduce){#weixinHotspotSettingsUI .hotspot-channel-switch button{transition:none}}
            </style>
            <div class="hotspot-nav-bar">
                <div class="hotspot-back-btn" data-wc-close>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#000" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="15 18 9 12 15 6"></polyline></svg>
                </div>
                <div class="hotspot-nav-title">个人热点</div>
            </div>
            <div class="hotspot-channel-switch" role="tablist" aria-label="接入方式">
                <button type="button" role="tab" id="hotspot-weixin-tab" data-hotspot-channel="weixin" aria-controls="hotspot-weixin-panel" aria-selected="true">微信接入</button>
                <button type="button" role="tab" id="hotspot-qq-tab" data-hotspot-channel="qq" aria-controls="hotspot-qq-panel" aria-selected="false" tabindex="-1">QQ 接入</button>
                <button type="button" role="tab" id="hotspot-tg-tab" data-hotspot-channel="tg" aria-controls="hotspot-tg-panel" aria-selected="false" tabindex="-1">TG 接入</button>
            </div>
            <div class="hotspot-content" id="hotspot-weixin-panel" data-hotspot-panel="weixin" role="tabpanel" aria-labelledby="hotspot-weixin-tab">
                <div class="hotspot-hero-card">
                    <div class="hotspot-hero-icon-bg">
                        <svg viewBox="0 0 24 24" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="fill: none !important; stroke: white; width: 28px; height: 28px;"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"></path><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"></path></svg>
                    </div>
                    <div class="hotspot-hero-title">个人热点</div>
                    <div class="hotspot-hero-desc">通过 Supabase 云函数与微信 Bot 互联，支持在云端同步角色会话与持久化消息接收。<span>进一步了解...</span></div>
                </div>

                <div class="hotspot-section-title">连接与服务配置</div>
                <div class="hotspot-card-group">
                    <div class="hotspot-input-row">
                        <span class="hotspot-input-label">项目 Ref</span>
                        <input class="hotspot-input" data-wc-ref placeholder="项目地址或 Ref (一键部署)">
                    </div>
                    <div class="hotspot-input-row">
                        <span class="hotspot-input-label">Access Token</span>
                        <input class="hotspot-input" data-wc-access type="password" placeholder="仅本次部署使用">
                    </div>
                    <div class="hotspot-input-row">
                        <span class="hotspot-input-label">云函数地址</span>
                        <input class="hotspot-input" data-wc-function placeholder="https://...functions.supabase.co/...">
                    </div>
                    <div class="hotspot-input-row">
                        <span class="hotspot-input-label">专用令牌</span>
                        <input class="hotspot-input" data-wc-token type="password" placeholder="自动生成或自定义令牌">
                    </div>
                </div>

                <div class="hotspot-section-title">角色绑定</div>
                <div class="hotspot-card-group">
                    <div class="hotspot-input-row" data-wc-contact-row style="cursor: pointer;">
                        <span class="hotspot-input-label">目标角色</span>
                        <div style="flex: 1; display: flex; align-items: center; justify-content: flex-end; gap: 6px;">
                            <span id="hotspotContactNameText" style="font-size: 15px; color: #007aff;">选择绑定角色</span>
                            <svg class="set-chevron" viewBox="0 0 8 13"><path d="M1.5 1.5L6.5 6.5L1.5 11.5"/></svg>
                        </div>
                    </div>
                </div>

                <div class="hotspot-section-title">操作</div>
                <div class="hotspot-card-group">
                    <div class="hotspot-btn-row hotspot-btn-blue" data-wc-save>保存连接配置</div>
                    <div class="hotspot-btn-row hotspot-btn-blue" data-wc-deploy>一键部署到我的 Supabase</div>
                    <div class="hotspot-btn-row hotspot-btn-green" data-wc-bind>扫码绑定微信 Bot</div>
                    <div class="hotspot-btn-row hotspot-btn-green" data-wc-sync>同步角色到云端</div>
                </div>

                <div class="hotspot-section-title">状态与二维码</div>
                <div class="hotspot-status-card">
                    <div class="hotspot-status-text" data-wc-status>就绪</div>
                </div>
            </div>
            <div class="hotspot-content hotspot-qq-panel" id="hotspot-qq-panel" data-hotspot-panel="qq" role="tabpanel" aria-labelledby="hotspot-qq-tab" hidden>
                <div data-hotspot-qq-mount></div>
                <p data-hotspot-qq-status hidden></p>
            </div>
            <div class="hotspot-content hotspot-tg-panel" id="hotspot-tg-panel" data-hotspot-panel="tg" role="tabpanel" aria-labelledby="hotspot-tg-tab" hidden>
                <div data-hotspot-tg-mount></div>
                <p data-hotspot-tg-status hidden></p>
            </div>
        `;
        page.dataset.channel = 'weixin';
        page.querySelectorAll('[data-hotspot-channel]').forEach(button => {
            button.onclick = () => { void selectHotspotChannel(page, button.dataset.hotspotChannel); };
        });
        page.querySelector('[role="tablist"]').onkeydown = event => {
            if (!['ArrowLeft', 'ArrowRight'].includes(event.key)) return;
            event.preventDefault();
            const channels = ['weixin', 'qq', 'tg'];
            const index = channels.indexOf(page.dataset.channel);
            const next = Math.min(channels.length - 1, Math.max(0, index + (event.key === 'ArrowRight' ? 1 : -1)));
            const channel = channels[next];
            void selectHotspotChannel(page, channel);
            page.querySelector('[data-hotspot-channel="' + channel + '"]').focus();
        };
        let swipeStart = null;
        page.addEventListener('touchstart', event => {
            const point = event.touches.length === 1 ? event.touches[0] : null;
            const bounds = page.getBoundingClientRect();
            swipeStart = point && point.clientX > bounds.left + 24 && point.clientX < bounds.right - 24
                && !event.target.closest('input,textarea,select,button,[contenteditable="true"]')
                ? { x: point.clientX, y: point.clientY } : null;
        }, { passive: true });
        page.addEventListener('touchend', event => {
            const start = swipeStart; swipeStart = null;
            const point = event.changedTouches[0];
            if (!start || !point) return;
            const dx = point.clientX - start.x, dy = point.clientY - start.y;
            if (Math.abs(dx) > 64 && Math.abs(dy) < 32) {
                const channels = ['weixin', 'qq', 'tg'];
                const next = Math.min(2, Math.max(0, channels.indexOf(page.dataset.channel) + (dx < 0 ? 1 : -1)));
                void selectHotspotChannel(page, channels[next]);
            }
        }, { passive: true });
        page.addEventListener('touchcancel', () => { swipeStart = null; }, { passive: true });
        const host = document.querySelector('.iphone') || document.body;
        host.appendChild(page);
        return page;
    }

    async function selectHotspotChannel(page, channel) {
        channel = ['weixin', 'qq', 'tg'].includes(channel) ? channel : 'weixin';
        page.dataset.channel = channel;
        page.querySelectorAll('[data-hotspot-channel]').forEach(button => {
            const active = button.dataset.hotspotChannel === channel;
            button.setAttribute('aria-selected', String(active));
            button.tabIndex = active ? 0 : -1;
        });
        page.querySelectorAll('[data-hotspot-panel]').forEach(panel => { panel.hidden = panel.dataset.hotspotPanel !== channel; });
        if (channel === 'tg') {
            const mount = page.querySelector('[data-hotspot-tg-mount]');
            const status = page.querySelector('[data-hotspot-tg-status]');
            if (mount.querySelector('#wc-tg-character-settings') || mount.dataset.loading === 'true') return;
            status.hidden = false; status.textContent = '正在读取 TG 接入设置…';
            mount.dataset.loading = 'true';
            try {
                if (typeof window.TelegramCharacterBridge?.mount !== 'function') throw new Error('TG 接入组件尚未就绪，请刷新页面后重试');
                await window.TelegramCharacterBridge.mount(mount);
                status.hidden = true;
            } catch (error) { status.textContent = error.message || 'TG 接入设置读取失败'; }
            finally { mount.dataset.loading = 'false'; }
            return;
        }
        if (channel !== 'qq') return;
        const mount = page.querySelector('[data-hotspot-qq-mount]');
        const status = page.querySelector('[data-hotspot-qq-status]');
        if (mount.querySelector('#wc-qq-character-settings') || mount.dataset.loading === 'true') return;
        status.hidden = false; status.textContent = '正在读取 QQ 接入设置…';
        mount.dataset.loading = 'true';
        try {
            if (typeof window.QqCharacterBridge?.mount !== 'function') throw new Error('QQ 接入组件尚未就绪，请刷新页面后重试');
            await window.QqCharacterBridge.mount(mount);
            status.hidden = true;
        } catch (error) { status.textContent = error.message || 'QQ 接入设置读取失败'; }
        finally { mount.dataset.loading = 'false'; }
    }

    function closeWeixinCloudSettings() {
        const page = document.getElementById('weixinHotspotSettingsUI');
        if (!page) return;

        page.classList.remove('show');
        window.setTimeout(() => {
            if (!page.classList.contains('show')) {
                page.style.display = 'none';
            }
        }, 300);
    }

    window.closeWeixinCloudSettings = closeWeixinCloudSettings;

    window.openWeixinCloudSettings = async function (options = {}) {
        const page = createHotspotPage();
        const config = await readConfig() || {};
        const functionInput = page.querySelector('[data-wc-function]');
        const refInput = page.querySelector('[data-wc-ref]');
        const accessInput = page.querySelector('[data-wc-access]');
        const tokenInput = page.querySelector('[data-wc-token]');
        const contactRow = page.querySelector('[data-wc-contact-row]');
        const contactNameText = page.querySelector('#hotspotContactNameText');
        const status = page.querySelector('[data-wc-status]');

        let selectedContactId = config.contactId || '';

        function updateSelectedContactDisplay() {
            const list = (typeof wcContactsList !== 'undefined' && Array.isArray(wcContactsList)) ? wcContactsList : [];
            const target = list.find(c => String(c.id) === String(selectedContactId));
            if (contactNameText) {
                contactNameText.textContent = target ? (target.name || '未命名角色') : '选择绑定角色';
            }
        }

        functionInput.value = config.functionUrl || '';
        refInput.value = config.supabaseRef || '';
        tokenInput.value = readAssistantToken();
        updateSelectedContactDisplay();

        if (contactRow) {
            contactRow.onclick = () => {
                const list = (typeof wcContactsList !== 'undefined' && Array.isArray(wcContactsList)) ? wcContactsList : [];
                const items = list.map(contact => ({
                    label: contact.name || '未命名角色',
                    value: String(contact.id)
                }));
                if (typeof openUniversalSelect === 'function') {
                    openUniversalSelect({
                        title: '选择绑定角色',
                        items: items,
                        currentValue: selectedContactId,
                        searchable: true,
                        onSelect: (val) => {
                            selectedContactId = val;
                            updateSelectedContactDisplay();
                        }
                    });
                }
            };
        }

        page.querySelector('[data-wc-close]').onclick = closeWeixinCloudSettings;

        page.style.display = 'flex';
        setTimeout(() => {
            page.classList.add('show');
        }, 10);
        void selectHotspotChannel(page, options.channel || page.dataset.channel);

        const current = () => ({ ...config, functionUrl: functionInput.value.trim(), supabaseRef: normalizeSupabaseRef(refInput.value), assistantToken: tokenInput.value.trim(), contactId: selectedContactId });

        page.querySelector('[data-wc-save]').onclick = async () => {
            const next = current();
            if (!next.functionUrl || !next.assistantToken || !next.contactId) { status.textContent = '请填写云函数地址、令牌并选择角色'; return; }
            rememberAssistantToken(next.assistantToken);
            await saveConfig(next); Object.assign(config, { ...next, assistantToken: '' }); status.textContent = '已保存连接配置';
        };

        page.querySelector('[data-wc-deploy]').onclick = async () => {
            try {
                const ref = normalizeSupabaseRef(refInput.value);
                const accessToken = accessInput.value.trim();
                const assistantToken = tokenInput.value.trim() || createAssistantToken();
                if (!ref || !accessToken) throw new Error('请填写 Supabase 项目地址或 ref，以及 Access Token');
                tokenInput.value = assistantToken;
                status.textContent = '正在部署云函数…';
                const response = await fetch(DEFAULT_DEPLOY_PROXY_URL.replace(/\/+$/, '') + '/api/weixin/deploy-function', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ ref, token: accessToken, assistantToken }) });
                const result = await response.json().catch(() => ({}));
                if (!response.ok) throw new Error(result.error || ('部署失败：HTTP ' + response.status));
                functionInput.value = result.functionUrl || ('https://' + ref + '.functions.supabase.co/tonghuaji-weixin-assistant');
                rememberAssistantToken(assistantToken);
                await saveConfig({ ...current(), functionUrl: functionInput.value });
                accessInput.value = '';
                status.textContent = '云函数部署成功，可以扫码绑定了。';
            } catch (error) { status.textContent = error.message || String(error); }
        };

        page.querySelector('[data-wc-bind]').onclick = async () => {
            let timer = null;
            try {
                const next = current();
                if (!next.functionUrl || !next.assistantToken || !next.contactId) throw new Error('请先保存连接并选择角色');
                const qr = await request(next, QR_ACTION, {});
                const imageContent = qr.qrcodeImage || qr.qrcode_img_content || '';
                const image = resolveQrImageSrc(imageContent) || await createQrImage(imageContent);
                if (!image) throw new Error('未获得二维码');
                status.innerHTML = '<div style="display:inline-flex;flex-direction:column;align-items:center;gap:10px;padding:0;background:transparent;border:0;box-shadow:none"><img alt="微信登录二维码" src="' + String(image).replace(/"/g, '&quot;') + '" style="width:220px;height:220px;display:block;object-fit:contain;background:#fff;border:0;box-shadow:none;border-radius:12px"><div>请用微信扫码确认</div></div>';
                let attempts = 0;
                timer = setInterval(async () => {
                    try {
                        attempts += 1;
                        const result = await request(next, QR_STATUS_ACTION, { qrcode: qr.qrcode });
                        const resultStatus = String(result.status || result.state || '').toLowerCase();
                        if ((resultStatus === 'scanned' || resultStatus === 'scaned') && !result.botToken) {
                            status.textContent = '已扫码，等待微信确认…';
                        }
                        if (result.botToken) {
                            const botId = result.botId || result.botToken;
                            const botServerUrl = result.botServerUrl || result.baseUrl || result.baseurl || '';
                            await request(next, 'bind-bot', { botId, botToken: result.botToken, botServerUrl });
                            clearInterval(timer);
                            next.botId = botId;
                            next.botServerUrl = botServerUrl;
                            await saveConfig(next);
                            Object.assign(config, next);
                            status.textContent = '微信 Bot 已绑定，请同步角色后开始聊天';
                        } else if (attempts >= 90) {
                            clearInterval(timer);
                            status.textContent = '二维码已超时，请重新扫码绑定';
                        }
                    } catch (error) {
                        clearInterval(timer);
                        status.textContent = '绑定失败：' + (error?.message || String(error));
                    }
                }, 2000);
            } catch (error) {
                if (timer) clearInterval(timer);
                status.textContent = error.message || String(error);
            }
        };

        page.querySelector('[data-wc-sync]').onclick = async () => {
            try {
                const next = current();
                if (!next.botId) throw new Error('请先扫码绑定微信 Bot');
                status.textContent = '正在同步…';
                await request(next, RUNTIME_ACTION, { runtime: buildRuntime((typeof wcContactsList !== 'undefined' && Array.isArray(wcContactsList) ? wcContactsList : []).find(item => item.id === next.contactId), next) });
                await saveConfig(next);
                Object.assign(config, next);
                startCloudPolling(next, status);
                status.textContent = '角色已同步到云端，当前页面已开始接收微信消息';
            } catch (error) { status.textContent = error.message || String(error); }
        };
    };
})();

