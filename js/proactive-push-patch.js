/**
 * 童话集 - 主动消息推送桥接
 * Keep local scheduling as the reliable fallback and sync Cloudflare Push when available.
 */

(function() {
    const getCurrentContact = () => {
        const currentId = typeof wcCurrentChatContactId === 'undefined' ? null : wcCurrentChatContactId;
        return typeof wcContactsList !== 'undefined' && Array.isArray(wcContactsList)
            ? wcContactsList.find(item => String(item.id) === String(currentId))
            : null;
    };

    const localToggle = window.wcToggleProactiveMessages;
    const localSaveInterval = window.wcSaveProactiveMessageInterval;

    if (typeof localToggle === 'function') {
        window.wcToggleProactiveMessages = async function() {
            const contact = getCurrentContact();
            if (!contact) return;

            const enabling = contact.proactiveMessageEnabled !== true;
            const backendEnabled = localStorage.getItem(`proactive_enabled_${contact.id}`) === 'true';

            if (!enabling && backendEnabled) {
                const message = '该角色已开启“设置 → 后端消息”。请先在那里关闭后端消息，再关闭微信主动消息。';
                if (typeof showCustomAlert === 'function') showCustomAlert('请先关闭后端消息', message);
                else if (typeof showToast === 'function') showToast(message);
                return;
            }

            await localToggle();
        };
    }

    if (typeof localSaveInterval === 'function') {
        window.wcSaveProactiveMessageInterval = async function(value) {
            await localSaveInterval(value);

            const contact = getCurrentContact();
            if (!contact?.proactiveMessageEnabled || contact.proactivePushRegistered !== true
                || !window.ProactivePush || typeof window.ProactivePush.updateConfig !== 'function') {
                return;
            }

            try {
                await window.ProactivePush.updateConfig(contact.id, contact.proactiveMessageIntervalMinutes || null);
            } catch (error) {
                console.warn('主动消息推送频率同步失败，已保留本地设置：', error);
                delete contact.proactivePushRegistered;
                await wcSaveContactsDataAsync();
            }
        };
    }

    console.log('主动消息推送桥接模块已加载');
})();

(function loadCrossAppBridge() {
    if (window.CrossAppBridge || window.MessageWechatBridge || document.querySelector('script[data-cross-app-bridge], script[data-message-wechat-bridge]')) return;
    const script = document.createElement('script');
    script.src = 'js/message-wechat-bridge.js?v=20261010-wechat-group-private-bridge-v1';
    script.async = false;
    script.dataset.crossAppBridge = 'true';
    script.dataset.messageWechatBridge = 'true';
    script.addEventListener('error', () => console.error('跨 App 通道桥加载失败'), { once: true });
    (document.head || document.documentElement).appendChild(script);
})();

(function loadWechatLinkParser() {
    if (window.__wcRichLinkParserInstalled || document.querySelector('script[data-wechat-link-parser]')) return;
    const script = document.createElement('script');
    script.src = 'js/wechat-link-parser.js?v=20260928-apizero-v1';
    script.async = false;
    script.dataset.wechatLinkParser = 'true';
    script.addEventListener('error', () => console.error('微信链接增强解析模块加载失败'), { once: true });
    (document.head || document.documentElement).appendChild(script);
})();
