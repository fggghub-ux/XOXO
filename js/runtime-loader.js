(function () {
    'use strict';

    const allowedHosts = new Set([
        'ovonline.qzz.io',
        'www.ovonline.qzz.io',
        'fairytales.dpdns.org',
        'fairytale-ovo.pages.dev',
        'tong-ddc.pages.dev',
        'tonghuaji.vercel.app',
        'localhost',
        '127.0.0.1',
        '[::1]'
    ]);
    const resourceGateRoot = '/_tonghuaji_gate';
    const resourceGateRequestTimeoutMs = 9000;
    const assetVersions = Object.freeze(/* BUILD_ASSET_VERSIONS */ {});
    const developmentAssetVersions = Object.freeze({
        'js/today-app.js': '20261027-call-life-context-v1',
        'js/db.js': '20261029-memory-storage-guard-v1',
        'js/utils.js': '20261027-api-cache-usage-v1',
        'js/desktop.js': '20261026-readen-page-turn-v1',
        'js/fanfiction-app.js': '20261027-fanfiction-scene-review-v1',
        'js/swipe-back.js': '20261023-fanfiction-shadow-swipe-v5',
        'js/theme-app.js': '20261027-meeting-font-sync-v1',
        'js/icity.js': '20261024-character-record-purge-v3',
        'js/dynamic-island.js': '20261026-island-startup-restore-v7',
        'js/settings-app-admin-v2.js': '20261027-api-cache-usage-v1',
        'js/meeting-app.js': '20261027-meeting-font-sync-v1',
        'js/message-wechat-bridge.js': '20261026-readen-coreading-bridge-v1',
        'js/meeting-document.js': '20261027-meeting-font-sync-v1',
        'js/call.js': '20261027-call-interruption-v1',
        'js/character-record-cleanup.js': '20261024-character-record-purge-v3',
        'js/contacts.js': '20261024-character-record-purge-v3',
        'js/voice-imggen.js': '20261009-meeting-scene-images-v1',
        'js/anonymous-feedback.js': '20261008-image-preview-v2',
        'js/message-app.js': '20261008-message-keyboard-calibration-v2',
        'js/business.js': '20261014-business-message-navigation-v1',
        'js/photos-app.js': '20261023-photo-description-icon-v1',
        'js/twitter.js': '20261028-forum-delayed-discussions-v1',
        'js/store.js': '20261028-store-account-payment-refund-v1',
        'js/weixin-cloud.js': '20261022-hotspot-channel-switch-v1',
        'js/swipe-back.js': '20261023-fanfiction-shadow-swipe-v5',
        'js/worldbook.js': '20261007-worldbook-swipe-finish-v2',
        'js/widget.js': '20261009-widget-image-menu-v1',
        'js/wechat-auth.js': '20261024-character-record-purge-v3',
        'js/wechat-template.js': '20261026-wechat-reroll-original-svg-v3',
        'js/wechat-emoji.js': '20261012-emoji-group-click-through-v1',
        'js/meeting-invitations.js': '20261025-meeting-continuity-v1',
        'js/couple-avatar-context.js': '20261022-couple-avatar-ios-v2',
        'js/chat-temporal-context.js': '20261021-initiative-boundary-v1',
        'js/qq-character-bridge.js': '20261024-character-record-purge-v3',
        'js/telegram-character-bridge.js': '20261029-tg-sticker-vision-v4',
        'js/proactive-push.js': '20261026-remove-fallback-login-v1',
        'js/wechat-chat.js': '20261029-tg-batch-import-v1',
        'js/wechat-wallet.js': '20261019-group-packet-checkout-v2',
        'js/wechat-settings.js': '20261025-meeting-pause-v1',
        'js/wechat.js': '20261028-native-tg-live-clock-v1',
        'js/game-center-app.js': '20261011-stardew-resource-actions-v1',
        'js/wechat-group.js': '20261026-group-character-media-imessage-compact-v1',
        'js/wechat-group-games.js': '20261021-mahjong-orientation-toggle-v1',
        'js/memory.js': '20261029-memory-storage-guard-v1',
        'js/memory-v2.js': '20261029-memory-storage-guard-v1',
        'js/music-app.js': '20261028-playlist-cycle-queue-v2',
        'js/music-app-shell.js': '20261012-playback-cleanup-v1',
        'js/charphone-forum.js': '20261012-forum-anonymous-v1',
        'js/charphone.js': '20261024-character-record-purge-v3',
        'fullscreen.js': '20261027-fullscreen-resume-v1',
        'js/sw-register.js': '20261027-no-controller-reload-v1'
    });
    const runtimeLoaderDevelopmentVersion = (() => {
        try {
            const loaderSource = document.currentScript?.src || '';
            if (!loaderSource) return '';
            return new URL(loaderSource, window.location.href).searchParams.get('v') || '';
        } catch (_) {
            return '';
        }
    })();
    const bootstrapScriptPaths = Object.freeze([
        'js/access-auth-admin-v2.js'
    ]);
    const startupScriptPaths = Object.freeze([
        'js/sw-register.js',
        'js/meeting-document.js',
        'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/leaflet.js',
        'js/utils.js',
        'js/character-record-cleanup.js',
        'js/db.js',
        'js/desktop.js',
        'js/music-app.js',
        'js/music-app-shell.js',
        'js/meeting-app.js',
        'js/theme-app.js',
        'js/contacts.js',
        'fullscreen.js',
        'js/widget.js',
        'js/settings-app-admin-v2.js',
        'js/anonymous-feedback.js',
        'js/swipe-back.js',
        'js/worldbook.js',
        'js/vendor/jsQR.min.js',
        'js/vendor/pako_inflate.min.js',
        'js/voice-imggen.js',
        'js/photos-app.js',
        'js/semantic-memory.js',
        'js/memory.js',
        'js/memory-v2.js',
        'js/weixin-cloud.js',
        'js/wechat-template.js',
        'js/wechat-auth.js',
        'js/chat-temporal-context.js',
        'js/couple-avatar-context.js',
        'js/meeting-invitations.js',
        'js/wechat-chat.js',
        'js/wechat-settings.js',
        'js/proactive-push.js',
        'js/proactive-push-patch.js',
        'js/proactive-message-settings.js',
        'js/wechat-emoji.js',
        'js/wechat-moments.js',
        'js/wechat-wallet.js',
        'js/wechat.js',
        'js/qq-character-bridge.js',
        'js/telegram-character-bridge.js',
        'js/wechat-mahjong-rules.js',
        'js/wechat-group-games.js',
        'js/wechat-group.js',
        'js/icity.js',
        'js/message-app.js',
        'js/message-wechat-bridge.js',
        'js/call.js',
        'js/mcp-app.js',
        'js/game-center-app.js',
        'js/today-app.js',
        'js/search.js',
        'js/universal-select.js',
        'js/business.js',
        'js/twitter.js',
        'js/store.js',
        'js/dynamic-island.js',
        'js/charphone-forum.js',
        'js/charphone.js',
        'js/fanfiction-app.js'
    ]);

    let startupPromise = null;
    let bootstrapPromise = null;
    const runtimeScriptPromises = new Map();

    function normalizedHost(value) {
        return String(value || '').trim().toLowerCase().replace(/\.$/, '');
    }

    function isAllowedHost() {
        return allowedHosts.has(normalizedHost(window.location.hostname));
    }

    function runtimeError(message, code) {
        const error = new Error(message);
        error.code = code;
        return error;
    }

    function renderBlockedPage(title, message) {
        const render = () => {
            document.title = title;
            document.documentElement.classList.remove('app-access-pending', 'app-access-ready');
            document.body.replaceChildren();
            Object.assign(document.body.style, {
                margin: '0',
                minHeight: '100vh',
                display: 'grid',
                placeItems: 'center',
                padding: '24px',
                boxSizing: 'border-box',
                color: '#1d1d1f',
                background: '#f2f3f5',
                fontFamily: '-apple-system, BlinkMacSystemFont, "PingFang SC", sans-serif'
            });
            const panel = document.createElement('main');
            Object.assign(panel.style, {
                width: 'min(100%, 360px)',
                padding: '30px 24px',
                boxSizing: 'border-box',
                border: '1px solid rgba(255, 255, 255, .82)',
                borderRadius: '28px',
                background: 'rgba(255, 255, 255, .72)',
                boxShadow: '0 18px 50px rgba(60, 72, 88, .12)',
                textAlign: 'center'
            });
            const heading = document.createElement('h1');
            heading.textContent = title;
            Object.assign(heading.style, { margin: '0 0 10px', fontSize: '22px' });
            const description = document.createElement('p');
            description.textContent = message;
            Object.assign(description.style, { margin: '0', color: '#767680', fontSize: '14px', lineHeight: '1.7' });
            panel.append(heading, description);
            document.body.append(panel);
        };
        if (document.body) render();
        else document.addEventListener('DOMContentLoaded', render, { once: true });
    }

    function waitForDocument() {
        if (document.readyState !== 'loading') return Promise.resolve();
        return new Promise(resolve => document.addEventListener('DOMContentLoaded', resolve, { once: true }));
    }

    function waitForBody() {
        if (document.body) return Promise.resolve();
        if (typeof MutationObserver !== 'function' || !document.documentElement) return waitForDocument();
        return new Promise(resolve => {
            const observer = new MutationObserver(() => {
                if (!document.body) return;
                observer.disconnect();
                resolve();
            });
            observer.observe(document.documentElement, { childList: true });
        });
    }

    function versionedPath(source) {
        if (/^https?:\/\//i.test(source)) return source;
        const cleanPath = source.split('?')[0];
        const productionVersion = assetVersions[cleanPath];
        if (productionVersion) {
            return `${cleanPath}?runtime=${encodeURIComponent(productionVersion)}`;
        }
        const developmentAssetVersion = developmentAssetVersions[cleanPath];
        if (developmentAssetVersion) {
            return `${cleanPath}?v=${encodeURIComponent(developmentAssetVersion)}`;
        }
        if (runtimeLoaderDevelopmentVersion) {
            return `${cleanPath}?v=${encodeURIComponent(runtimeLoaderDevelopmentVersion)}`;
        }
        return cleanPath;
    }

    function appendOrderedScript(source) {
        if (runtimeScriptPromises.has(source)) return runtimeScriptPromises.get(source);
        const resolvedSource = versionedPath(source);
        const promise = new Promise((resolve, reject) => {
            const script = document.createElement('script');
            script.src = resolvedSource;
            script.async = false;
            script.dataset.runtimeSource = source;
            script.addEventListener('load', resolve, { once: true });
            script.addEventListener('error', () => reject(runtimeError(`运行文件加载失败：${source}`, 'RUNTIME_ASSET_FAILED')), { once: true });
            (document.body || document.head).append(script);
        });
        runtimeScriptPromises.set(source, promise);
        promise.catch(() => runtimeScriptPromises.delete(source));
        return promise;
    }

    async function loadScripts(scriptPaths, dispatchLifecycleEvents) {
        const pending = scriptPaths.map(source => appendOrderedScript(source));
        await Promise.all(pending);
        if (!dispatchLifecycleEvents) return;
        document.dispatchEvent(new Event('DOMContentLoaded'));
        window.dispatchEvent(new Event('DOMContentLoaded'));
        if (document.readyState === 'complete') window.dispatchEvent(new Event('load'));
        window.dispatchEvent(new Event('tonghuaji:runtime-ready'));
    }

    function loadBootstrapScripts() {
        return loadScripts(bootstrapScriptPaths, false);
    }

    function loadStartupScripts() {
        return loadScripts(startupScriptPaths, true);
    }

    async function verifySession() {
        const controller = new AbortController();
        const timeout = window.setTimeout(() => controller.abort(), resourceGateRequestTimeoutMs);
        try {
            const response = await fetch(resourceGateRoot + '/session', {
                method: 'GET', credentials: 'same-origin', cache: 'no-store', signal: controller.signal
            });
            const payload = await response.json().catch(() => null);
            if (!response.ok || !payload || !/^[1-9]\d{4,11}$/.test(String(payload.qq || ''))) {
                const error = runtimeError(payload && payload.message || '登录验证失败，请重试。',
                    [401, 403].includes(response.status) ? 'RUNTIME_SESSION_INVALID' : 'RUNTIME_KEY_UNAVAILABLE');
                error.status = response.status;
                throw error;
            }
            return { qq: payload.qq, provider: payload.provider, session: payload.session };
        } catch (error) {
            if (error.code) throw error;
            throw runtimeError('无法连接登录验证服务，请检查网络后重试。', 'RUNTIME_KEY_UNAVAILABLE');
        } finally { window.clearTimeout(timeout); }
    }

    function startProtectedScripts() {
        if (!startupPromise) {
            if (window.tonghuajiRescue) window.tonghuajiRescue.startupStarted();
            startupPromise = waitForDocument()
                .then(loadStartupScripts)
                .catch(async error => {
                    // A gate can expire while startup files are downloading. Recover through the login page.
                    try { await verifySession(); }
                    catch (verificationError) {
                        if (verificationError.code === 'RUNTIME_SESSION_INVALID') {
                            const returnPath = window.location.pathname + window.location.search + window.location.hash;
                            window.location.replace('/login?return=' + encodeURIComponent(returnPath || '/'));
                            throw verificationError;
                        }
                    }
                    renderBlockedPage('启动失败', '运行文件加载失败，请检查网络后刷新页面。');
                    if (window.tonghuajiRescue) window.tonghuajiRescue.reportFailure('运行文件未能完整加载，可先导出已保存的本地数据。');
                    throw error;
                });
        }
        return startupPromise;
    }

    async function startRuntime(session, onVerified) {
        const verification = await verifySession(session);
        await startProtectedScripts();
        if (typeof onVerified === 'function') onVerified(verification);
        return verification;
    }

    if (!isAllowedHost()) {
        renderBlockedPage('此地址未获授权', '为保护账号数据与正式版本，童话集已停止加载。');
        return;
    }

    window.tonghuajiRuntime = Object.freeze({
        verify: verifySession,
        start: startRuntime,
        ensureScript: appendOrderedScript
    });

    bootstrapPromise = waitForBody()
        .then(loadBootstrapScripts)
        .catch(error => {
            renderBlockedPage('启动失败', '登录组件加载失败，请检查网络后刷新页面。');
            throw error;
        });
}());

