/**
 * 童话集 - 主动消息推送集成
 * 与 Cloudflare Worker 配合使用
 */

(function() {
    // ===== 配置项 =====
    const WORKER_URL = 'https://ovevol.dpdns.org';
    const VAPID_PUBLIC_KEY = 'BFJUFLeWg1roESXUcMgSsk4BVU7e7uwgmz9FS8KNZCAowmaRwLu-PG3vCiRpAxkLV9T7hBOtHiCsW0Ku8J6sQeo';
    const syncTimers = new Map();
    const syncTasks = new Map();
    let subscriptionTask = Promise.resolve();
    let workerUpdateRequested = false;
    const sceneClientId = crypto.randomUUID();
    let scenePauseTask = Promise.resolve();
    let scenePauseSequence = 0;
    let scenePauseTimer = null;

    function remoteContacts() {
        return typeof wcContactsList === 'undefined' ? [] : wcContactsList.filter(contact =>
            contact.proactivePushRegistered === true || localStorage.getItem(`proactive_enabled_${contact.id}`) === 'true');
    }

    function syncMeetingPause() {
        clearTimeout(scenePauseTimer);
        const active = window.isMeetingSceneActive?.() === true;
        const sequence = ++scenePauseSequence;
        if (!remoteContacts().length) return Promise.resolve(false);
        let headers;
        try { headers = requestHeaders(); } catch (_) { return Promise.resolve(false); }
        const task = scenePauseTask.catch(() => false).then(async () => {
            if (sequence !== scenePauseSequence) return false;
            // Refresh the bridge before allowing the next cloud turn after leaving the scene.
            if (!active) await Promise.all(remoteContacts().map(contact => syncProactivePush(contact.id)));
            if (sequence !== scenePauseSequence) return false;
            const response = await fetch(`${WORKER_URL}/pause`, { method: 'POST', headers,
                keepalive: !active, body: JSON.stringify({ active, clientId: sceneClientId, sequence }) });
            if (!response.ok) throw new Error('见面期间的云端消息暂停同步失败');
            return true;
        });
        scenePauseTask = task;
        task.then(() => {
            if (sequence === scenePauseSequence && active) scenePauseTimer = setTimeout(syncMeetingPause, 4 * 60000);
        }, error => {
            console.debug('Meeting cloud pause sync deferred:', error);
            if (sequence === scenePauseSequence) scenePauseTimer = setTimeout(syncMeetingPause, 30000);
        });
        return task;
    }

    function getAccessToken() {
        try { return JSON.parse(localStorage.getItem('tonghuajiAccessSessionV2') || 'null')?.access_token || ''; } catch { return ''; }
    }

    function requestHeaders() {
        let session = null;
        try { session = JSON.parse(localStorage.getItem('tonghuajiAccessSessionV2') || 'null'); } catch {}
        const token = session?.access_token || '';
        if (!token) throw new Error('请重新登录后再设置后端消息');
        return { 'Content-Type': 'application/json', Authorization: `Bearer ${token}`, 'X-Proactive-Auth-Provider': 'supabase' };
    }

    // ===== 工具函数 =====
    function urlBase64ToUint8Array(base64String) {
        const padding = '='.repeat((4 - base64String.length % 4) % 4);
        const base64 = (base64String + padding)
            .replace(/\-/g, '+')
            .replace(/_/g, '/');
        const rawData = window.atob(base64);
        const outputArray = new Uint8Array(rawData.length);
        for (let i = 0; i < rawData.length; ++i) {
            outputArray[i] = rawData.charCodeAt(i);
        }
        return outputArray;
    }

    function getProactiveContactProfile(contact) {
        const fields = [contact?.persona, contact?.description, contact?.desc, contact?.profile, contact?.characterPrompt, contact?.systemPrompt];
        return [...new Set(fields.map(value => String(value || '').trim()).filter(Boolean))].join('\n\n').slice(0, 16000);
    }

    function getProactiveHistory(contactId) {
        const records = typeof wcChatMessagesByContact !== 'undefined' && Array.isArray(wcChatMessagesByContact?.[contactId])
            ? wcChatMessagesByContact[contactId]
            : [];
        return records
            .filter(item => item?.type === 'sent' || item?.type === 'received')
            .slice(-80)
            .map(item => ({ id: item.id, type: item.type, text: String(item.text || ''), createdAt: window.WcChatTemporal.readTimestamp(item.createdAt) }))
            .filter(item => item.text.trim());
    }

    async function getProactiveRuntime(contactId) {
        const contact = typeof wcContactsList !== 'undefined'
            ? wcContactsList.find(item => String(item.id) === String(contactId)) : null;
        const api = typeof wcResolveChatApi === 'function' ? wcResolveChatApi(contact?.apiConfig) : null;
        if (!contact || !api?.url || !api?.key || !api?.model) throw new Error('请先配置并连接角色的 API 模型');
        const record = typeof wcReadLayoutRecord === 'function' ? await wcReadLayoutRecord('contactsAppData') : null;
        const sourceId = String(contact.linkedContactId || (String(contact.id).startsWith('char_') ? String(contact.id).slice(5) : ''));
        const sourceContact = record?.data?.contacts?.find(item => String(item.id) === sourceId);
        const user = record?.data?.users?.find(item => item.id === appSettings?.wc_current_user_id);
        const userLocation = String(appSettings?.wc_user_weather_location || '').trim();
        const charLocation = String(contact.weatherLocation || '').trim();
        const resolve = typeof window.wcResolveRealLocation === 'function' ? window.wcResolveRealLocation : null;
        const locations = await Promise.all([userLocation && resolve ? Promise.resolve().then(() => resolve(userLocation)).catch(() => null) : null,
            charLocation && resolve ? Promise.resolve().then(() => resolve(charLocation)).catch(() => null) : null]);
        const userTimeZone = window.WcChatTemporal.validTimeZone(locations[0]?.timezone
            || Intl.DateTimeFormat().resolvedOptions().timeZone);
        const charTimeZone = charLocation ? window.WcChatTemporal.validTimeZone(locations[1]?.timezone, '') : userTimeZone;
        const intervalMinutes = typeof wcGetProactiveMessageIntervalMinutes === 'function'
            ? wcGetProactiveMessageIntervalMinutes(contact) : (Number(contact.proactiveMessageIntervalMinutes) > 0 ? Number(contact.proactiveMessageIntervalMinutes) : null);
        const temporal = window.WcChatTemporal.build({ history: wcChatMessagesByContact[contactId] || [] });
        const acknowledgedMessageIds = (wcChatMessagesByContact[contactId] || [])
            .filter(item => item?.sourceChannel === 'proactive').map(item => String(item.id));
        if (acknowledgedMessageIds.length) {
            const saved = typeof wcSaveChatContactData === 'function' ? await wcSaveChatContactData(contactId)
                : (typeof wcSaveChatData === 'function' ? await wcSaveChatData() : false);
            if (saved !== true) {
                throw new Error('后台消息尚未成功保存，将保留云端记录等待重试');
            }
        }
        let timeEnabled = typeof wcIsTimeAwarenessEnabled === 'function'
            ? wcIsTimeAwarenessEnabled(contactId) : contact.timeAwarenessEnabled !== false;
        if (typeof wcLoadCustomPresetSettings === 'function') wcLoadCustomPresetSettings();
        if (typeof wcCustomPresetsList !== 'undefined') {
            const presetId = contact.activeCustomPresetId || appSettings?.wc_active_custom_preset_id || 'default_preset';
            const preset = wcCustomPresetsList.find(item => item.id === presetId);
            if (preset?.blocks?.find(block => block.id === 'time_awareness')?.enabled === false) timeEnabled = false;
        }
        const replyFormat = typeof window.wcRequestApiReply === 'function'
            ? await window.wcRequestApiReply({ contactId, proactive: true, proactiveFormatOnly: true }) : null;
        if (typeof window.wcRequestApiReply === 'function' && !replyFormat?.prompt) {
            throw new Error('无法读取当前聊天格式，稍后会重试同步');
        }
        return { contactId, intervalMinutes, ...(replyFormat ? { replyFormat } : {}),
            contact: { id: contactId, name: contact.name || sourceContact?.name || contact.remark || '角色',
                persona: getProactiveContactProfile(sourceContact) || getProactiveContactProfile(contact) },
            user: { name: user?.name || appSettings?.wc_current_user_name || 'User', persona: String(user?.persona || '').slice(0, 16000) },
            timing: { enabled: timeEnabled,
                userTimeZone, charTimeZone, lastUserAt: temporal.latestUser?.timestamp || 0,
                previousUserAt: temporal.previousUser?.timestamp || 0,
                lastMeetingAt: window.getMeetingProactiveActivityAt?.(contactId) || 0 },
            model: { url: api.url, key: api.key, model: api.model, temperature: api.temperature ?? 0.8 },
            history: getProactiveHistory(contactId),
            acknowledgedMessageIds };
    }

    function receiveSyncedMessages(contactId, result) {
        if (window.isMeetingSceneActive?.()) return;
        const before = wcChatMessagesByContact[contactId]?.length || 0;
        (Array.isArray(result?.messages) ? result.messages : []).forEach(message => {
            window.wcReceiveBackendMessage?.(contactId, message);
        });
        if ((wcChatMessagesByContact[contactId]?.length || 0) > before) {
            if (String(wcCurrentChatContactId) === String(contactId)) wcRenderChatMessages(contactId);
            // The append hook schedules a second sync to acknowledge persisted messages.
        }
    }

    function getPushSupportMessage() {
        return '当前环境不支持后台通知。请使用支持推送通知的浏览器；iPhone 需使用 iOS 16.4 或更高版本，并将童话集添加到主屏幕后再试。';
    }

    function getCurrentPushSubscription(expiredEndpoint = '') {
        const task = subscriptionTask.catch(() => null).then(async () => {
            if (!isProactivePushSupported() || Notification.permission !== 'granted') return null;
            let registration = await navigator.serviceWorker.getRegistration();
            if (!registration) registration = await navigator.serviceWorker.register('/sw.js', { updateViaCache: 'none' });
            if (!workerUpdateRequested && typeof registration.update === 'function') {
                workerUpdateRequested = true;
                try { await registration.update(); } catch (error) { console.debug('Push worker update deferred:', error); }
            }
            if (!registration.active && navigator.serviceWorker.ready) registration = await navigator.serviceWorker.ready;
            if (!registration?.pushManager) throw new Error(getPushSupportMessage());
            let subscription = await registration.pushManager.getSubscription();
            const expectedKey = urlBase64ToUint8Array(VAPID_PUBLIC_KEY);
            const existingKey = subscription?.options?.applicationServerKey;
            const bytes = existingKey ? new Uint8Array(existingKey) : null;
            const wrongKey = bytes && (bytes.length !== expectedKey.length || bytes.some((value, index) => value !== expectedKey[index]));
            if (subscription && (wrongKey || (expiredEndpoint && subscription.endpoint === expiredEndpoint))) {
                await subscription.unsubscribe();
                subscription = null;
            }
            if (!subscription) subscription = await registration.pushManager.subscribe({ userVisibleOnly: true, applicationServerKey: expectedKey });
            return subscription;
        });
        subscriptionTask = task;
        return task;
    }

    // ===== 注册推送订阅 =====
    async function registerProactivePush(contactId, characterName, avatar, intervalMinutes) {
        try {
            if (!isProactivePushSupported()) {
                throw new Error(getPushSupportMessage());
            }

            // 1. 请求通知权限
            const permission = await Notification.requestPermission();
            if (permission !== 'granted') {
                throw new Error('需要开启通知权限');
            }

            // Refresh the current browser subscription before uploading it to the Worker.
            const subscription = await getCurrentPushSubscription();
            if (!subscription) throw new Error(getPushSupportMessage());

            // 4. 发送到 Worker
            const userId = (typeof appSettings !== 'undefined' && appSettings.wc_current_user_id)
                ? appSettings.wc_current_user_id
                : 'default';
            const runtime = await getProactiveRuntime(contactId);

            const response = await fetch(`${WORKER_URL}/register`, {
                method: 'POST',
                headers: requestHeaders(),
                body: JSON.stringify({ ...runtime, userId, subscription: subscription.toJSON(),
                    characterName: runtime.contact.name, avatar: avatar || null })
            });

            if (!response.ok) {
                const error = await response.json().catch(() => ({}));
                const message = error.message || error.error || '注册失败';
                if (/Cannot read properties of undefined.*put/i.test(message)) {
                    throw new Error('云端主动消息服务未配置 KV 存储，请管理员完成 Worker 部署');
                }
                throw new Error(message);
            }

            const result = await response.json();
            receiveSyncedMessages(contactId, result);
            console.log('推送订阅注册成功:', result);
            if (window.isMeetingSceneActive?.()) void syncMeetingPause().catch(() => {});
            return true;

        } catch (error) {
            console.error('注册推送订阅失败:', error);
            throw error;
        }
    }

    async function performProactivePushSync(contactId) {
        const runtime = await getProactiveRuntime(contactId);
        let subscription = null;
        const contact = wcContactsList.find(item => String(item.id) === String(contactId));
        const backendEnabled = contact?.proactivePushRegistered === true
            || localStorage.getItem(`proactive_enabled_${contactId}`) === 'true';
        try { if (backendEnabled) subscription = await getCurrentPushSubscription(); }
        catch (error) { console.debug('Push subscription refresh deferred:', error); }
        const sendSync = () => fetch(`${WORKER_URL}/sync`, { method: 'POST', headers: requestHeaders(),
            body: JSON.stringify({ ...runtime, ...(subscription ? { subscription: subscription.toJSON() } : {}) }) });
        let response = await sendSync();
        if (!response.ok) throw new Error('同步后端消息配置失败');
        let result = await response.json();
        if (result.subscriptionInvalid && subscription) {
            subscription = await getCurrentPushSubscription(subscription.endpoint);
            response = await sendSync();
            if (!response.ok) throw new Error('更新后台通知订阅失败');
            result = await response.json();
            if (result.subscriptionInvalid) throw new Error('后台通知订阅已失效，请重新开启后端消息');
        }
        receiveSyncedMessages(contactId, result);
        return true;
    }

    function syncProactivePush(contactId) {
        const previous = syncTasks.get(contactId) || Promise.resolve();
        const task = previous.catch(() => false).then(() => performProactivePushSync(contactId));
        syncTasks.set(contactId, task);
        task.finally(() => { if (syncTasks.get(contactId) === task) syncTasks.delete(contactId); }).catch(() => {});
        return task;
    }

    function syncProactivePushForChat(contactId) {
        const enabled = wcContactsList.some(contact => String(contact.id) === String(contactId)
            && contact.proactiveMessageEnabled === true)
            || localStorage.getItem(`proactive_enabled_${contactId}`) === 'true';
        if (!enabled) return Promise.resolve(false);
        clearTimeout(syncTimers.get(contactId));
        syncTimers.delete(contactId);
        return syncProactivePush(contactId);
    }

    function scheduleProactivePushSync(contactId) {
        const contactEnabled = typeof wcContactsList !== 'undefined'
            && Array.isArray(wcContactsList)
            && wcContactsList.some(contact => String(contact.id) === String(contactId) && contact.proactiveMessageEnabled === true);
        const settingsEnabled = localStorage.getItem(`proactive_enabled_${contactId}`) === 'true';
        if (!contactId || (!contactEnabled && !settingsEnabled)) return;
        clearTimeout(syncTimers.get(contactId));
        syncTimers.set(contactId, setTimeout(() => {
            syncProactivePush(contactId).catch(error => console.debug('后端消息上下文同步失败:', error));
        }, 1200));
    }

    // ===== 取消推送订阅 =====
    async function unregisterProactivePush(contactId) {
        try {
            const userId = (typeof appSettings !== 'undefined' && appSettings.wc_current_user_id)
                ? appSettings.wc_current_user_id
                : 'default';

            const response = await fetch(`${WORKER_URL}/unregister`, {
                method: 'POST',
                headers: requestHeaders(),
                body: JSON.stringify({
                    userId,
                    contactId
                })
            });

            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.message || '取消订阅失败');
            }

            console.log('推送订阅已取消');
            return true;

        } catch (error) {
            console.error('取消推送订阅失败:', error);
            throw error;
        }
    }

    // ===== 更新推送配置 =====
    async function updateProactivePushConfig(contactId) {
        // Read the canonical chat setting, including null when the field is cleared.
        return syncProactivePush(contactId);
    }

    async function getProactivePushStatus(contactId) {
        const response = await fetch(`${WORKER_URL}/status?contactId=${encodeURIComponent(contactId)}`, { headers: requestHeaders() });
        if (!response.ok) throw new Error('无法读取后端消息状态');
        return response.json();
    }

    async function testProactivePush(contactId) {
        const response = await fetch(`${WORKER_URL}/test`, { method: 'POST', headers: requestHeaders(), body: JSON.stringify({ contactId }) });
        const result = await response.json().catch(() => ({}));
        if (!response.ok) throw new Error(result.error || '测试通知发送失败');
        return result;
    }

    // ===== 检查是否支持推送 =====
    function isProactivePushSupported() {
        return 'serviceWorker' in navigator &&
               'PushManager' in window &&
               'Notification' in window;
    }

    // ===== 导出到全局 =====
    window.ProactivePush = {
        register: registerProactivePush,
        sync: syncProactivePush,
        syncForChat: syncProactivePushForChat,
        scheduleSync: scheduleProactivePushSync,
        unregister: unregisterProactivePush,
        updateConfig: updateProactivePushConfig,
        getStatus: getProactivePushStatus,
        test: testProactivePush,
        isSupported: isProactivePushSupported,
        getSupportMessage: getPushSupportMessage,
        syncMeetingPause,
        WORKER_URL,
        VAPID_PUBLIC_KEY
    };

    function refreshEnabledContexts() {
        if (document.visibilityState === 'hidden' || typeof wcContactsList === 'undefined') return;
        wcContactsList.filter(contact => contact.proactivePushRegistered === true
            || localStorage.getItem(`proactive_enabled_${contact.id}`) === 'true')
            .forEach(contact => scheduleProactivePushSync(contact.id));
    }
    window.addEventListener('load', refreshEnabledContexts);
    window.addEventListener('pageshow', refreshEnabledContexts);
    window.addEventListener('wechat:account-changed', refreshEnabledContexts);
    document.addEventListener('visibilitychange', refreshEnabledContexts);
    window.addEventListener('meeting:scene-change', () => { void syncMeetingPause().catch(() => {}); });
    window.addEventListener('pageshow', () => {
        if (window.isMeetingSceneActive?.()) void syncMeetingPause().catch(() => {});
    });
    document.addEventListener('visibilitychange', () => {
        if (window.isMeetingSceneActive?.()) void syncMeetingPause().catch(() => {});
    });

    console.log('ProactivePush 模块已加载');
})();


