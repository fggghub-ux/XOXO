{
    const accessGateHTML = `<main id="appAccessGate" aria-live="polite">
    <section class="app-access-panel" data-access-active-view="login" aria-label="童话集账号登录">
        <header class="app-access-brand">
            <h1>童话集</h1>
            <p>使用售后群内的 QQ 账号继续</p>
        </header>

        <div class="app-access-tabs" data-access-tabs role="tablist" aria-label="账号操作">
            <button class="app-access-tab is-active" type="button" data-access-tab="login" data-access-action="show-login" role="tab" aria-selected="true">登录</button>
            <button class="app-access-tab" type="button" data-access-tab="setup" data-access-action="show-setup" role="tab" aria-selected="false">设置密码</button>
        </div>

        <div class="app-access-content">
            <form class="app-access-form" data-access-view="login" novalidate>
                <label class="app-access-field"><input name="qq" inputmode="numeric" autocomplete="username" maxlength="12" placeholder="QQ 号" required></label>
                <label class="app-access-field has-password"><input id="appAccessLoginPassword" name="password" type="password" autocomplete="current-password" minlength="8" placeholder="密码" required><button class="app-access-password-toggle" type="button" data-access-action="toggle-access-password" data-password-target="appAccessLoginPassword" aria-label="显示密码" aria-pressed="false" title="显示密码"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle><path class="app-access-eye-slash" d="m4 4 16 16"></path></svg></button></label>
                <button class="app-access-primary" type="submit">登录</button>
                <div class="app-access-actions"><button class="app-access-link" type="button" data-access-action="show-setup">首次注册？设置密码</button><button class="app-access-link" type="button" data-access-action="show-recovery">忘记密码？</button></div>
            </form>

            <form class="app-access-form" data-access-view="setup" hidden novalidate>
                <p class="app-access-hint">售后群成员可直接注册<br>请妥善保管您的登录密码</p>
                <label class="app-access-field"><input name="qq" inputmode="numeric" autocomplete="username" maxlength="12" placeholder="售后群 QQ 号" required></label>
                <label class="app-access-field has-password"><input id="appAccessSetupPassword" name="password" type="password" autocomplete="new-password" minlength="8" placeholder="设置新密码" required><button class="app-access-password-toggle" type="button" data-access-action="toggle-access-password" data-password-target="appAccessSetupPassword" aria-label="显示密码" aria-pressed="false" title="显示密码"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle><path class="app-access-eye-slash" d="m4 4 16 16"></path></svg></button></label>
                <label class="app-access-field has-password"><input id="appAccessSetupPasswordConfirm" name="passwordConfirm" type="password" autocomplete="new-password" minlength="8" placeholder="确认密码" required><button class="app-access-password-toggle" type="button" data-access-action="toggle-access-password" data-password-target="appAccessSetupPasswordConfirm" aria-label="显示密码" aria-pressed="false" title="显示密码"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle><path class="app-access-eye-slash" d="m4 4 16 16"></path></svg></button></label>
                <button class="app-access-primary" type="submit">注册并进入</button>
            </form>

            <form class="app-access-form" data-access-view="recovery" hidden novalidate>
                <p class="app-access-hint">请输入您绑定的 QQ 号<br>我们将向您发送重置密码的邮件</p>
                <label class="app-access-field"><input name="qq" inputmode="numeric" autocomplete="username" maxlength="12" placeholder="绑定的 QQ 号" required></label>
                <button class="app-access-primary" type="submit">发送重置邮件</button>
                <div class="app-access-actions is-centered"><button class="app-access-link" type="button" data-access-action="show-login">返回登录</button></div>
            </form>

            <form class="app-access-form" data-access-view="reset" hidden novalidate>
                <p class="app-access-hint">请设置新的登录密码</p>
                <label class="app-access-field has-password"><input id="appAccessResetPassword" name="password" type="password" autocomplete="new-password" minlength="8" placeholder="新密码" required><button class="app-access-password-toggle" type="button" data-access-action="toggle-access-password" data-password-target="appAccessResetPassword" aria-label="显示密码" aria-pressed="false" title="显示密码"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle><path class="app-access-eye-slash" d="m4 4 16 16"></path></svg></button></label>
                <label class="app-access-field has-password"><input id="appAccessResetPasswordConfirm" name="passwordConfirm" type="password" autocomplete="new-password" minlength="8" placeholder="确认新密码" required><button class="app-access-password-toggle" type="button" data-access-action="toggle-access-password" data-password-target="appAccessResetPasswordConfirm" aria-label="显示密码" aria-pressed="false" title="显示密码"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle><path class="app-access-eye-slash" d="m4 4 16 16"></path></svg></button></label>
                <button class="app-access-primary" type="submit">更新密码</button>
            </form>

            <section class="app-access-form" data-access-view="devices" hidden>
                <div class="app-access-devices" data-access-device-list></div>
                <button class="app-access-primary" type="button" data-access-action="retry-device">重新校验此浏览器</button>
                <div class="app-access-actions is-centered"><button class="app-access-link" type="button" data-access-action="show-login">返回登录</button></div>
            </section>
            <p class="app-access-notice" data-access-notice role="status"></p>
        </div>
    </section>
</main>`;
    document.documentElement.classList.add('app-access-checking');
    document.body.insertAdjacentHTML('afterbegin', accessGateHTML);
    const waiting = document.createElement('section');
    waiting.className = 'app-access-check-state';
    waiting.hidden = true;
    waiting.setAttribute('role', 'alert');
    waiting.innerHTML = '<p data-access-check-message></p><button type="button" data-access-retry hidden>重试</button>';
    document.getElementById('appAccessGate').append(waiting);
}
(function () {
    'use strict';

    const SESSION_KEY = 'tonghuajiAccessSessionV2';
    const DEVICE_KEY = 'tonghuajiAccessDeviceV1';
    const LOGIN_NOTICE_KEY = 'tonghuajiAccessLoginNoticeV1';
    const RESOURCE_GATE_ROOT = '/_tonghuaji_gate';
    const REQUEST_TIMEOUT_MS = 12000;
    const SLOW_REQUEST_NOTICE_MS = 4800;
    let activeQq = '';
    let appStartRequested = false;
    let appStarted = false;
    let currentSession = null;

    function getRuntimeController() {
        const runtime = window.tonghuajiRuntime;
        if (!runtime || typeof runtime.start !== 'function' || typeof runtime.verify !== 'function') {
            throw new Error('运行组件尚未就绪，请刷新页面后重试。');
        }
        return runtime;
    }

    async function clearResourceGateSession() {
        try {
            await fetch(RESOURCE_GATE_ROOT + '/logout', {
                method: 'POST',
                credentials: 'same-origin',
                cache: 'no-store',
                keepalive: true
            });
        } catch (error) {}
    }

    function saveRefreshedSession(nextSession) {
        if (!nextSession || !nextSession.access_token) return currentSession;
        const previous = currentSession || readStoredSession() || {};
        const merged = Object.assign({}, previous, nextSession);
        if (!nextSession.user && previous.user) merged.user = previous.user;
        saveSession(merged);
        return merged;
    }

    function requestRuntimeAccess(session, onVerified) {
        let markedReady = false;
        const markReadyAfterVerification = verification => {
            let resolvedVerification = verification;
            if (verification && verification.session && verification.session.access_token) {
                const refreshedSession = saveRefreshedSession(verification.session);
                resolvedVerification = Object.assign({}, verification, { session: refreshedSession });
            }
            if (typeof onVerified === 'function') onVerified(resolvedVerification);
            document.documentElement.classList.remove('app-access-pending', 'app-access-checking');
            document.documentElement.classList.add('app-access-ready');
            markedReady = true;
        };
        return getRuntimeController().start(session, markReadyAfterVerification).catch(error => {
            if (markedReady) {
                document.documentElement.classList.remove('app-access-ready');
                document.documentElement.classList.add('app-access-pending');
            }
            throw error;
        });
    }

    function getRedirectUrl() {
        return `${location.origin}${location.pathname}`;
    }

    function normalizeQq(value) {
        return String(value || '')
            .replace(/[０-９]/g, character => String.fromCharCode(character.charCodeAt(0) - 0xFEE0))
            .replace(/[\s\u200B-\u200D\uFEFF]/g, '');
    }

    function isQq(value) {
        return /^[1-9]\d{4,11}$/.test(normalizeQq(value));
    }

    function isValidDeviceId(value) {
        return /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(String(value || ''));
    }

    function createDeviceId() {
        return crypto.randomUUID ? crypto.randomUUID() : `${Date.now()}-${Math.random().toString(16).slice(2)}`;
    }

    function setDeviceIdForQq(qq) {
        const normalizedQq = normalizeQq(qq);
        if (!isQq(normalizedQq)) return getDeviceId();
        const scopedKey = DEVICE_KEY + ':' + normalizedQq;
        let deviceId = '';
        try { deviceId = localStorage.getItem(scopedKey) || ''; } catch (error) {}
        if (!isValidDeviceId(deviceId)) {
            deviceId = createDeviceId();
            try { localStorage.setItem(scopedKey, deviceId); } catch (error) {}
        }
        try { localStorage.setItem(DEVICE_KEY, deviceId); } catch (error) {}
        return deviceId;
    }

    function getDeviceId() {
        let deviceId = '';
        try { deviceId = localStorage.getItem(DEVICE_KEY) || ''; } catch (error) {}
        if (!isValidDeviceId(deviceId)) {
            deviceId = createDeviceId();
            try { localStorage.setItem(DEVICE_KEY, deviceId); } catch (error) {}
        }
        return deviceId;
    }

    function getDeviceLabel() {
        const platform = (navigator.userAgentData && navigator.userAgentData.platform) || navigator.platform || '浏览器';
        return String(platform).slice(0, 64) || '浏览器';
    }

    function getBrowserLabel() {
        const userAgent = navigator.userAgent || '';
        const match = userAgent.match(/(Edg|OPR|Chrome|CriOS|Firefox|FxiOS|Version)\/([\d.]+)/);
        if (!match) return '未知浏览器';
        const names = { Edg: 'Microsoft Edge', OPR: 'Opera', Chrome: 'Chrome', CriOS: 'Chrome', Firefox: 'Firefox', FxiOS: 'Firefox', Version: 'Safari' };
        return `${names[match[1]] || match[1]} ${match[2]}`.slice(0, 96);
    }

    function setNamespace(qq) {
        activeQq = qq;
        document.documentElement.dataset.accessQq = qq;
    }

    function saveSession(session) {
        const safeSession = Object.assign({}, session, { backend: true });
        delete safeSession.refresh_token;
        currentSession = safeSession;
        localStorage.setItem(SESSION_KEY, JSON.stringify(safeSession));
    }

    function clearSession(clearResourceGate = true) {
        currentSession = null;
        localStorage.removeItem(SESSION_KEY);
        if (clearResourceGate) void clearResourceGateSession();
    }

    window.addEventListener('tonghuaji:resource-session-refreshed', event => {
        const nextSession = event && event.detail;
        if (nextSession && nextSession.access_token) saveRefreshedSession(nextSession);
    });

    function readStoredSession() {
        try {
            const session = JSON.parse(localStorage.getItem(SESSION_KEY) || 'null');
            // Retired fallback sessions are discarded so the user signs in again normally.
            if (session && session.provider === 'cf-fallback') return null;
            return session && session.access_token && (session.backend || session.refresh_token) ? session : null;
        } catch (error) {
            return null;
        }
    }

    function makeNetworkError(message, code, cause) {
        const error = new Error(message);
        error.code = code;
        if (cause) error.cause = cause;
        return error;
    }

    async function request(path, options) {
        const requestOptions = options || {};
        const controller = typeof AbortController === 'function' ? new AbortController() : null;
        const timeoutId = controller ? window.setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS) : 0;
        try {
            const response = await fetch(RESOURCE_GATE_ROOT + path, {
                ...requestOptions,
                signal: controller ? controller.signal : requestOptions.signal,
                credentials: 'same-origin',
                cache: 'no-store',
                headers: {
                    'Content-Type': 'application/json',
                    ...(requestOptions.headers ? requestOptions.headers : {})
                }
            });
            const text = await response.text();
            let body = null;
            try { body = text ? JSON.parse(text) : null; } catch (error) { body = { message: text }; }
            if (!response.ok) {
                const message = body && (body.msg || body.message || body.error_description || body.error) || '请求失败，请稍后重试。';
                const requestError = new Error(message);
                requestError.code = body && body.code;
                requestError.status = response.status;
                throw requestError;
            }
            return body;
        } catch (error) {
            const message = String(error && error.message || '');
            if (error && error.name === 'AbortError') {
                throw makeNetworkError('登录服务响应超时，请切换网络或稍后重试。', 'NETWORK_TIMEOUT', error);
            }
            if (error instanceof TypeError || /failed to fetch|networkerror|load failed/i.test(message)) {
                throw makeNetworkError('网络连接失败，请切换网络或稍后重试。', 'NETWORK_FAILED', error);
            }
            throw error;
        } finally {
            if (timeoutId) window.clearTimeout(timeoutId);
        }
    }

    function authRequest(path, method, body, token) {
        if (path === '/user' && method === 'PUT') {
            return request('/password', { method: 'POST', body: JSON.stringify({
                password: body.password,
                recovery_token: currentSession && currentSession.recovery ? currentSession.access_token : undefined
            }) });
        }
        throw new Error('不支持的账号操作。');
    }

    function rpc(name, body) {
        return request('/rpc', { method: 'POST', body: JSON.stringify({ name, args: body || {} }) }).then(payload => payload.result);
    }

    function loginDetails() {
        return { device_id: getDeviceId(), device_label: getDeviceLabel(), device_browser: getBrowserLabel() };
    }

    function fastLoginRequest(qq, password, setup = false) {
        setDeviceIdForQq(qq);
        return request(setup ? '/setup' : '/login', {
            method: 'POST', body: JSON.stringify({ email: qq + '@qq.com', password, ...loginDetails() })
        });
    }

    function getElements() {
        return {
            gate: document.getElementById('appAccessGate'),
            notice: document.querySelector('[data-access-notice]'),
            forms: Array.from(document.querySelectorAll('[data-access-view]')),
            devices: document.querySelector('[data-access-device-list]')
        };
    }

    function showView(name) {
        document.documentElement.classList.remove('app-access-checking');
        const { forms } = getElements();
        forms.forEach(form => { form.hidden = form.dataset.accessView !== name; });
        const panel = document.querySelector('.app-access-panel');
        if (panel) panel.dataset.accessActiveView = name;
        const tabs = Array.from(document.querySelectorAll('[data-access-tab]'));
        tabs.forEach(tab => {
            const active = tab.dataset.accessTab === name;
            tab.classList.toggle('is-active', active);
            tab.setAttribute('aria-selected', String(active));
        });
        const tabList = document.querySelector('[data-access-tabs]');
        if (tabList) tabList.hidden = name !== 'login' && name !== 'setup';
        setNotice('');
    }

    function setNotice(message, isError) {
        const { notice } = getElements();
        if (!notice) return;
        notice.textContent = message || '';
        notice.classList.toggle('is-error', Boolean(isError));
    }

    function setBusy(form, busy) {
        form.querySelectorAll('button').forEach(element => { element.disabled = busy; });
    }

    function friendlyError(error) {
        const message = String(error && error.message || '');
        const code = String(error && error.code || '');

        if (/[\u4e00-\u9fff]/.test(message)) return message;
        if (message === 'DEVICE_LIMIT') return '当前账号最多可登录两台设备，请先退出或移除一台旧设备。';
        if (message === 'DEVICE_REVOKED') return '当前设备已被退出，请重新登录。';
        if (message === 'DEVICE_NOT_FOUND') return '未找到该设备记录，请刷新后重试。';
        if (/ACCESS_NOT_GRANTED|paid|entitlement/i.test(message)) return '该 QQ 账号尚未获得登录授权，请联系管理员。';
        if (/AUTH_REQUIRED|JWT|token.*(expired|invalid)|session.*(expired|invalid)/i.test(message)) return '登录状态已失效，请重新登录。';
        if (/Invalid login credentials|invalid_credentials/i.test(message)) return 'QQ 号或密码不正确。';
        if (message === 'INVALID_LOGIN') return 'QQ 号或密码不正确。';
        if (message === 'ACCOUNT_ALREADY_SET') return '该 QQ 已设置过备用密码，请直接登录。';
        if (message === 'PASSWORD_INVALID') return '密码至少需要 8 位。';
        if (message === 'RATE_LIMITED') return '尝试次数过多，请 10 分钟后再试。';
        if (message === 'SESSION_INVALID') return '备用登录状态已失效，请重新登录。';
        if (/Email not confirmed/i.test(message)) return '请先到 QQ 邮箱完成验证，再登录。';
        if (/User already registered|already.*(registered|exists)/i.test(message)) return '该 QQ 账号已注册，请直接登录。';
        if (/Password should be at least|weak password/i.test(message)) return '密码至少需要 8 位，请重新设置。';
        if (/New password should be different/i.test(message)) return '新密码不能与当前密码相同。';
        if (/rate limit|too many requests|over_request_rate_limit/i.test(message) || code === 'over_request_rate_limit') return '操作过于频繁，请稍后再试。';
        if (/network|networkerror|failed to fetch|load failed|timeout|timed out|ECONN|ENOTFOUND/i.test(message)) return '网络连接失败，请检查网络后重试。';
        if (/duplicate key|unique constraint|postgres|database|internal server error|PGRST|42P|23P/i.test(message) || /^5\d\d$/.test(code)) return '服务暂时繁忙，请稍后重试。';
        if (/not found|does not exist|could not find the function/i.test(message)) return '服务正在更新，请稍后刷新页面重试。';
        if (/forbidden|permission denied|not authorized/i.test(message) || code === '403') return '当前账号没有执行此操作的权限。';
        if (message) return '操作失败，请稍后重试。';
        if (error && error.message === 'DEVICE_LIMIT') return '已达到两个浏览器上限，请先移除一个旧浏览器。';
        if (error && /资格|paid|开通|entitlement/i.test(error.message)) return '该 QQ 尚未开通登录资格。';
        if (error && /Invalid login credentials/i.test(error.message)) return 'QQ 号或密码不正确。';
        if (error && /New password should be different from the old password/i.test(error.message)) return '新密码不能与当前密码相同。';
        if (error && /Email not confirmed/i.test(error.message)) return '请先到 QQ 邮箱完成验证，再登录。';
        return (error && error.message) || '操作失败，请稍后重试。';
    }

    function formQq(form) {
        return normalizeQq(new FormData(form).get('qq'));
    }

    function formPassword(form, field) {
        return String(new FormData(form).get(field || 'password') || '');
    }

    async function completeFastAccess(payload) {
        const session = payload && payload.session;
        const qq = normalizeQq(payload && payload.qq);
        if (!session || !session.access_token || !isQq(qq)) throw new Error('登录服务响应异常，请稍后重试。');
        setNamespace(qq);
        setDeviceIdForQq(qq);
        saveSession(session);
        await requestRuntimeAccess(currentSession);
        startApplicationIfReady();
    }

    async function completeAccess() {
        await completeFastAccess(await request('/claim', { method: 'POST', body: JSON.stringify(loginDetails()) }));
    }

    async function submitLogin(form) {
        const qq = formQq(form);
        const password = formPassword(form);
        if (!isQq(qq)) throw new Error('请输入正确的 QQ 号。');
        if (password.length < 8) throw new Error('密码至少需要 8 位。');
        await completeFastAccess(await fastLoginRequest(qq, password));
    }

    async function submitSetup(form) {
        const qq = formQq(form);
        const password = formPassword(form);
        if (!isQq(qq)) throw new Error('请输入正确的 QQ 号。');
        if (password.length < 8) throw new Error('密码至少需要 8 位。');
        if (password !== formPassword(form, 'passwordConfirm')) throw new Error('两次输入的密码不一致。');
        await completeFastAccess(await fastLoginRequest(qq, password, true));
    }

    async function submitRecovery(form) {
        const qq = formQq(form);
        if (!isQq(qq)) throw new Error('请输入正确的 QQ 号。');
        await request('/recover', { method: 'POST', body: JSON.stringify({ qq }) });
        setNotice('若账号已开通，重置邮件已发送到 QQ 邮箱。');
    }

    async function submitReset(form) {
        const password = formPassword(form);
        if (password.length < 8) throw new Error('密码至少需要 8 位。');
        if (password !== formPassword(form, 'passwordConfirm')) throw new Error('两次输入的密码不一致。');
        await authRequest('/user', 'PUT', { password });
        history.replaceState({}, '', getRedirectUrl());
        clearSession(false);
        showView('login');
        setNotice('密码已更新，请使用新密码登录。');
    }

    async function listDevices() {
        const devices = await rpc('list_my_access_devices', { p_current_device_id: getDeviceId() });
        const { devices: container } = getElements();
        if (!container) return;
        container.replaceChildren();
        (Array.isArray(devices) ? devices : []).forEach(device => {
            const item = document.createElement('div');
            item.className = 'app-access-device';
            const text = document.createElement('div');
            const title = document.createElement('strong');
            title.textContent = device.is_current ? `${device.device_label || '当前浏览器'}（当前）` : (device.device_label || '浏览器');
            const time = document.createElement('small');
            time.textContent = `最近使用：${new Date(device.last_seen_at).toLocaleString('zh-CN')}`;
            text.append(title, time);
            item.append(text);
            if (!device.is_current) {
                const button = document.createElement('button');
                button.type = 'button';
                button.textContent = '移除';
                button.addEventListener('click', async () => {
                    button.disabled = true;
                    try {
                        await rpc('revoke_my_access_device', { p_device_id: device.device_id });
                        await listDevices();
                        setNotice('已移除旧浏览器，现在可以重新校验此浏览器。');
                    } catch (error) {
                        setNotice(friendlyError(error), true);
                    } finally {
                        button.disabled = false;
                    }
                });
                item.append(button);
            }
            container.append(item);
        });
    }

    function setLoginSecurityNotice(message, isError) {
        const notice = document.getElementById('loginSecurityNotice');
        if (!notice) return;
        notice.textContent = message || '';
        notice.classList.toggle('is-error', Boolean(isError));
    }

    function setLoginSecurityPasswordNotice(message, isError) {
        const notice = document.getElementById('loginSecurityPasswordNotice');
        if (!notice) return;
        notice.textContent = message || '';
        notice.classList.toggle('is-error', Boolean(isError));
    }

    function formatDeviceTime(value) {
        const timestamp = new Date(value);
        return Number.isNaN(timestamp.getTime()) ? '未记录' : timestamp.toLocaleString('zh-CN');
    }

    async function revokeLoginSecurityDevice(device, button) {
        const message = `确定要退出“${device.device_label || '此设备'}”吗？该设备将返回登录页。`;
        const confirmed = typeof showCustomConfirm === 'function'
            ? await showCustomConfirm('退出设备登录', message, '退出登录', true)
            : window.confirm(message);
        if (!confirmed) return;
        button.disabled = true;
        setLoginSecurityNotice('');
        try {
            await rpc('revoke_my_access_device', { p_device_id: device.device_id });
            await loadLoginSecurityDevices();
            setLoginSecurityNotice('已退出该设备登录。');
        } catch (error) {
            setLoginSecurityNotice(friendlyError(error), true);
            button.disabled = false;
        }
    }

    function renderLoginSecurityDevices(devices) {
        const container = document.getElementById('loginSecurityDeviceList');
        if (!container) return;
        container.replaceChildren();
        if (!devices.length) {
            const empty = document.createElement('p');
            empty.className = 'login-security-device-empty';
            empty.textContent = '暂无已登录设备';
            container.append(empty);
            return;
        }
        devices.forEach(device => {
            const item = document.createElement('article');
            item.className = 'login-security-device';
            const title = document.createElement('div');
            title.className = 'login-security-device-title';
            const name = document.createElement('span');
            name.textContent = device.device_label || '未知设备';
            title.append(name);
            if (device.is_current) {
                const current = document.createElement('span');
                current.className = 'login-security-device-current';
                current.textContent = '当前设备';
                title.append(current);
            } else {
                const removeButton = document.createElement('button');
                removeButton.type = 'button';
                removeButton.className = 'login-security-device-remove';
                removeButton.textContent = '移除登录';
                removeButton.setAttribute('aria-label', `移除${device.device_label || '此设备'}的登录`);
                removeButton.addEventListener('click', () => revokeLoginSecurityDevice(device, removeButton));
                title.append(removeButton);
            }
            const browser = document.createElement('div');
            browser.className = 'login-security-device-meta';
            browser.textContent = `浏览器：${device.device_browser || '未记录'}`;
            const ip = document.createElement('div');
            ip.className = 'login-security-device-meta';
            ip.textContent = `IP：${device.ip_address || '未记录'}`;
            const lastSeen = document.createElement('div');
            lastSeen.className = 'login-security-device-meta';
            lastSeen.textContent = `最近使用：${formatDeviceTime(device.last_seen_at)}`;
            item.append(title, browser, ip, lastSeen);
            container.append(item);
        });
    }

    async function loadLoginSecurityDevices() {
        const devices = await rpc('list_my_access_devices_with_details', {
            p_current_device_id: getDeviceId()
        });
        renderLoginSecurityDevices(Array.isArray(devices) ? devices : []);
    }

    async function submitLoginSecurityPassword(form) {
        const data = new FormData(form);
        const newPassword = String(data.get('newPassword') || '');
        const confirmedPassword = String(data.get('newPasswordConfirm') || '');
        if (!currentSession || !currentSession.access_token) throw new Error('登录状态已失效，请重新登录。');
        if (newPassword.length < 8) throw new Error('新密码至少需要 8 位。');
        if (newPassword !== confirmedPassword) throw new Error('两次输入的新密码不一致。');
        await authRequest('/user', 'PUT', { password: newPassword });
        form.reset();
        setLoginSecurityPasswordNotice('密码已更新成功。');
        
        // 密码修改成功后，延迟 1.5 秒自动收起层叠卡片
        setTimeout(() => {
            if (typeof window.closeLsChangePwdSheet === 'function') {
                window.closeLsChangePwdSheet();
            }
            setLoginSecurityPasswordNotice(''); // 清空提示，为下次打开做准备
        }, 1500);
    }

    window.openLoginSecurityApp = function () {
        const page = document.getElementById('loginSecurityUI');
        if (!page) return;
        const qq = document.getElementById('loginSecurityBoundQq');
        if (qq) qq.textContent = activeQq || '--';
        setLoginSecurityNotice('');
        setLoginSecurityPasswordNotice('');
        
        // 每次打开页面时，自动检测并渲染真实设备模型
        if (typeof window.lsRenderCurrentDevice === 'function') {
            window.lsRenderCurrentDevice();
        }

        page.style.display = 'flex';
        page.setAttribute('aria-hidden', 'false');
        requestAnimationFrame(() => page.classList.add('show'));
        loadLoginSecurityDevices().catch(error => setLoginSecurityNotice(friendlyError(error), true));
    };

    window.closeLoginSecurityApp = function () {
        const page = document.getElementById('loginSecurityUI');
        if (!page) return;
        page.classList.remove('show');
        page.setAttribute('aria-hidden', 'true');
        window.setTimeout(() => { page.style.display = 'none'; }, 300);
    };

    // 全局真实的退出登录逻辑
    window.lsPerformLogout = async function () {
        const confirmed = typeof showCustomConfirm === 'function'
            ? await showCustomConfirm('退出登录', '确定要退出当前账号吗？', '退出', true)
            : window.confirm('确定要退出当前账号吗？');
        if (!confirmed) return;
        
        // Clear the server-side resource gate before returning to the login gate.
        try {
            await request('/logout', { method: 'POST', body: '{}' });
            clearSession(false);
            location.replace('/login');
        } catch (error) { setLoginSecurityNotice(friendlyError(error), true); }
    };

    // --- 登录与安全页面专属 UI 交互与真实设备检测逻辑 ---
    window.openLsChangePwdSheet = function () {
        const mainPage = document.getElementById('lsMainPage');
        const overlay = document.getElementById('lsSheetOverlay');
        const sheet = document.getElementById('lsChangePwdSheet');
        if (mainPage) mainPage.classList.add('scaled');
        if (overlay) overlay.classList.add('show');
        if (sheet) sheet.classList.add('show');
    };

    window.closeLsChangePwdSheet = function () {
        const mainPage = document.getElementById('lsMainPage');
        const overlay = document.getElementById('lsSheetOverlay');
        const sheet = document.getElementById('lsChangePwdSheet');
        if (mainPage) mainPage.classList.remove('scaled');
        if (overlay) overlay.classList.remove('show');
        if (sheet) sheet.classList.remove('show');
    };

    window.checkLsPwdInput = function () {
        const inputs = document.querySelectorAll('.ls-sheet-input-group input');
        const btn = document.getElementById('lsContinueBtn');
        if (!inputs.length || !btn) return;
        if (inputs[0].value.length > 0 || (inputs[1] && inputs[1].value.length > 0)) {
            btn.classList.add('active');
        } else {
            btn.classList.remove('active');
        }
    };

    window.lsRenderCurrentDevice = function () {
        const ua = navigator.userAgent || navigator.vendor || window.opera;
        let deviceType = 'pc';
        let deviceName = '电脑设备';

        if (/iPad|Macintosh/i.test(ua) && 'ontouchend' in document) {
            deviceType = 'ipad';
            deviceName = 'iPad';
        } else if (/iPhone|iPod/i.test(ua)) {
            deviceType = 'ios';
            deviceName = 'iPhone';
        } else if (/Android/i.test(ua)) {
            deviceType = 'android';
            deviceName = 'Android 设备';
        } else if (/Macintosh/i.test(ua)) {
            deviceType = 'pc';
            deviceName = 'MacBook';
        } else if (/Windows/i.test(ua)) {
            deviceType = 'pc';
            deviceName = 'Windows PC';
        }

        const svgs = {
            ios: `<svg viewBox="0 0 100 200" xmlns="http://www.w3.org/2000/svg"><rect x="5" y="5" width="90" height="190" rx="18" fill="#d1d1d6" stroke="#b0b0b5" stroke-width="2"/><rect x="8" y="8" width="84" height="184" rx="14" fill="#000"/><rect x="10" y="10" width="80" height="180" rx="12" fill="url(#lsIosGrad)"/><rect x="35" y="16" width="30" height="8" rx="4" fill="#000"/><rect x="3" y="50" width="2" height="10" rx="1" fill="#b0b0b5"/><rect x="3" y="70" width="2" height="20" rx="1" fill="#b0b0b5"/><rect x="3" y="100" width="2" height="20" rx="1" fill="#b0b0b5"/><rect x="95" y="75" width="2" height="30" rx="1" fill="#b0b0b5"/><rect x="20" y="40" width="60" height="20" rx="4" fill="rgba(255,255,255,0.3)"/><rect x="20" y="70" width="60" height="60" rx="8" fill="rgba(255,255,255,0.2)"/><defs><linearGradient id="lsIosGrad" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stop-color="#4facfe" /><stop offset="100%" stop-color="#00f2fe" /></linearGradient></defs></svg>`,
            android: `<svg viewBox="0 0 100 200" xmlns="http://www.w3.org/2000/svg"><rect x="5" y="5" width="90" height="190" rx="10" fill="#2c2c2e" stroke="#888" stroke-width="1.5"/><rect x="6.5" y="6.5" width="87" height="187" rx="8" fill="#000"/><rect x="8" y="8" width="84" height="184" rx="6" fill="url(#lsAndroidGrad)"/><circle cx="50" cy="15" r="2.5" fill="#000"/><rect x="95" y="45" width="2" height="25" rx="1" fill="#888"/><rect x="95" y="80" width="2" height="12" rx="1" fill="#888"/><rect x="16" y="30" width="40" height="16" rx="8" fill="rgba(255,255,255,0.25)"/><rect x="16" y="170" width="68" height="12" rx="6" fill="rgba(255,255,255,0.3)"/><circle cx="24" cy="150" r="6" fill="rgba(255,255,255,0.2)"/><circle cx="41" cy="150" r="6" fill="rgba(255,255,255,0.2)"/><circle cx="58" cy="150" r="6" fill="rgba(255,255,255,0.2)"/><circle cx="75" cy="150" r="6" fill="rgba(255,255,255,0.2)"/><defs><linearGradient id="lsAndroidGrad" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stop-color="#8E2DE2" /><stop offset="100%" stop-color="#4A00E0" /></linearGradient></defs></svg>`,
            pc: `<svg viewBox="0 0 240 160" xmlns="http://www.w3.org/2000/svg"><rect x="20" y="20" width="200" height="120" rx="8" fill="#d1d1d6" stroke="#b0b0b5" stroke-width="2"/><rect x="22" y="22" width="196" height="116" rx="6" fill="#000"/><rect x="24" y="24" width="192" height="106" rx="4" fill="url(#lsMacGrad)"/><path d="M 5 140 L 235 140 L 240 148 L 0 148 Z" fill="#b0b0b5"/><rect x="100" y="140" width="40" height="4" rx="2" fill="#8e8e93"/><rect x="80" y="60" width="80" height="40" rx="4" fill="rgba(255,255,255,0.2)"/><defs><linearGradient id="lsMacGrad" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stop-color="#ff9a9e" /><stop offset="100%" stop-color="#fecfef" /></linearGradient></defs></svg>`,
            ipad: `<svg viewBox="0 0 150 200" xmlns="http://www.w3.org/2000/svg"><rect x="5" y="10" width="140" height="180" rx="12" fill="#d1d1d6" stroke="#b0b0b5" stroke-width="2"/><rect x="10" y="15" width="130" height="170" rx="8" fill="#000"/><rect x="12" y="17" width="126" height="166" rx="6" fill="url(#lsIpadGrad)"/><circle cx="75" cy="13.5" r="1.5" fill="#333"/><rect x="30" y="40" width="90" height="30" rx="6" fill="rgba(255,255,255,0.3)"/><rect x="30" y="80" width="40" height="40" rx="6" fill="rgba(255,255,255,0.2)"/><rect x="80" y="80" width="40" height="40" rx="6" fill="rgba(255,255,255,0.2)"/><defs><linearGradient id="lsIpadGrad" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stop-color="#a18cd1" /><stop offset="100%" stop-color="#fbc2eb" /></linearGradient></defs></svg>`
        };

        const iconContainer = document.getElementById('lsDeviceIconContainer');
        const nameLabel = document.getElementById('lsDeviceNameLabel');
        if(iconContainer) iconContainer.innerHTML = svgs[deviceType];
        if(nameLabel) nameLabel.innerText = deviceName;
    };

    async function showDeviceLimit() {
        showView('devices');
        setNotice('此账号已在两个浏览器中使用。移除一个旧浏览器后再继续。', true);
        await listDevices();
    }

    function startApplicationIfReady() {
        if (!appStartRequested || appStarted || !activeQq) return;
        appStarted = true;
        if (typeof initDB === 'function') initDB();
    }

    window.startTonghuajiApp = function () {
        appStartRequested = true;
        startApplicationIfReady();
    };

    async function handleFormSubmit(event) {
        event.preventDefault();
        const form = event.currentTarget;
        setBusy(form, true);
        setNotice('');
        const slowNoticeTimer = window.setTimeout(() => {
            setNotice('登录服务响应较慢，正在继续尝试连接...');
        }, SLOW_REQUEST_NOTICE_MS);
        try {
            if (form.dataset.accessView === 'login') await submitLogin(form);
            if (form.dataset.accessView === 'setup') await submitSetup(form);
            if (form.dataset.accessView === 'recovery') await submitRecovery(form);
            if (form.dataset.accessView === 'reset') await submitReset(form);
        } catch (error) {
            if (error && error.message === 'DEVICE_LIMIT') await showDeviceLimit();
            else setNotice(friendlyError(error), true);
        } finally {
            window.clearTimeout(slowNoticeTimer);
            setBusy(form, false);
        }
    }

    function bindUi() {
        document.querySelectorAll('[data-access-view]').forEach(form => form.addEventListener('submit', handleFormSubmit));

        // Login & Security is injected later by settings-app-admin-v2.js.
        // Use delegated handlers so password toggles, refresh and submit work regardless of script load order.
        document.addEventListener('submit', async event => {
            const passwordForm = event.target && event.target.closest
                ? event.target.closest('[data-login-security-password-form]')
                : null;
            if (!passwordForm) return;
            event.preventDefault();
            const submit = passwordForm.querySelector('button[type="submit"]');
            if (submit) submit.disabled = true;
            setLoginSecurityPasswordNotice('');
            try {
                await submitLoginSecurityPassword(passwordForm);
            } catch (error) {
                setLoginSecurityPasswordNotice(friendlyError(error), true);
            } finally {
                if (submit) submit.disabled = false;
            }
        });

        document.querySelectorAll('[data-access-action]').forEach(button => {
            button.addEventListener('click', async () => {
                const action = button.dataset.accessAction;
                if (action === 'show-login') showView('login');
                if (action === 'show-setup') showView('setup');
                if (action === 'show-recovery') showView('recovery');
                if (action === 'toggle-access-password') {
                    const input = document.getElementById(button.dataset.passwordTarget);
                    if (!input) return;
                    const visible = input.type === 'password';
                    input.type = visible ? 'text' : 'password';
                    button.classList.toggle('is-visible', visible);
                    button.setAttribute('aria-pressed', String(visible));
                    button.setAttribute('aria-label', visible ? '隐藏密码' : '显示密码');
                    button.title = visible ? '隐藏密码' : '显示密码';
                }
                if (action === 'retry-device') {
                    button.disabled = true;
                    try { await completeAccess(currentSession); } catch (error) {
                        if (error && error.message === 'DEVICE_LIMIT') await showDeviceLimit();
                        else setNotice(friendlyError(error), true);
                    } finally { button.disabled = false; }
                }
            });
        });

        document.addEventListener('click', async event => {
            const button = event.target && event.target.closest
                ? event.target.closest('[data-login-security-action]')
                : null;
            if (!button) return;

            const action = button.dataset.loginSecurityAction;
            if (action === 'refresh-devices') {
                button.disabled = true;
                setLoginSecurityNotice('');
                try {
                    await loadLoginSecurityDevices();
                } catch (error) {
                    setLoginSecurityNotice(friendlyError(error), true);
                } finally {
                    button.disabled = false;
                }
                return;
            }

            if (action === 'toggle-password') {
                const input = document.getElementById(button.dataset.passwordTarget);
                if (!input) return;
                const visible = input.type === 'password';
                input.type = visible ? 'text' : 'password';
                button.classList.toggle('is-visible', visible);
                button.setAttribute('aria-pressed', String(visible));
                button.setAttribute('aria-label', visible ? '隐藏密码' : '显示密码');
                button.title = visible ? '隐藏密码' : '显示密码';
            }
        });
    }

    async function bootstrapRecovery() {
        const params = new URLSearchParams(location.hash.replace(/^#/, ''));
        if (params.get('type') !== 'recovery' || !params.get('access_token')) return false;
        currentSession = { access_token: params.get('access_token'), recovery: true };
        history.replaceState({}, '', getRedirectUrl());
        document.documentElement.classList.remove('app-access-checking');
        showView('reset');
        setNotice('请设置新的登录密码。');
        return true;
    }

    let uiBound = false;
    let bootstrapInFlight = null;
    function showStartupError(error) {
        const state = document.querySelector('.app-access-check-state');
        const message = document.querySelector('[data-access-check-message]');
        const retry = document.querySelector('[data-access-retry]');
        document.documentElement.classList.add('app-access-checking');
        if (message) message.textContent = friendlyError(error);
        if (state) state.hidden = false;
        if (retry) retry.hidden = false;
    }

    async function restoreApplication() {
        document.documentElement.classList.add('app-access-checking');
        const state = document.querySelector('.app-access-check-state');
        const message = document.querySelector('[data-access-check-message]');
        const retry = document.querySelector('[data-access-retry]');
        if (state) state.hidden = true;
        if (message) message.textContent = '';
        if (retry) retry.hidden = true;
        if (!uiBound) {
            bindUi();
            uiBound = true;
            if (retry) retry.addEventListener('click', () => { void bootstrap().catch(showStartupError); });
        }
        if (await bootstrapRecovery()) return;
        try {
            let payload;
            try { payload = await request('/session', { method: 'GET' }); }
            catch (error) {
                const legacy = readStoredSession();
                if (error.status !== 401 || !legacy || legacy.backend) throw error;
                const qq = legacy.qq || (legacy.user && String(legacy.user.email || '').split('@')[0]);
                if (isQq(qq)) setDeviceIdForQq(qq);
                payload = await request('/establish', { method: 'POST', body: JSON.stringify({ ...legacy, device_id: getDeviceId() }) });
            }
            await completeFastAccess(payload);
        } catch (error) {
            if (error.status === 401 || error.status === 403 || /DEVICE_REVOKED|SESSION_REVOKED|ACCESS_NOT_GRANTED|AUTH_REQUIRED/.test(error.message)) {
                clearSession(false);
                document.documentElement.classList.remove('app-access-checking');
                showView('login');
                const notice = sessionStorage.getItem(LOGIN_NOTICE_KEY);
                if (notice) { sessionStorage.removeItem(LOGIN_NOTICE_KEY); setNotice(notice, true); }
                return;
            }
            showStartupError(error);
        }
    }

    function bootstrap() {
        if (!bootstrapInFlight) bootstrapInFlight = restoreApplication().finally(() => { bootstrapInFlight = null; });
        return bootstrapInFlight;
    }

    // The access gate is inserted before this IIFE, so auth bootstrap does not need to wait for unrelated external scripts.
    bootstrap().catch(showStartupError);
}());
