/* Private-chat meeting invitations share the existing chat persistence and meeting bridge. */
(function (root) {
    'use strict';
    const marker = '[见面邀请]';
    const labels = { pending: '待回应', accepted: '已接受', rejected: '已拒绝' };
    let activeDialog = null;
    let busy = false;

    function accountId() {
        return typeof wcGetCurrentAccountId === 'function' ? String(wcGetCurrentAccountId() || '') : '';
    }
    function contacts() { return typeof wcContactsList !== 'undefined' && Array.isArray(wcContactsList) ? wcContactsList : []; }
    function history(contactId) {
        return typeof wcChatMessagesByContact !== 'undefined' && Array.isArray(wcChatMessagesByContact[contactId])
            ? wcChatMessagesByContact[contactId] : [];
    }
    function clean(value, limit) { return String(value || '').replace(/[\u0000-\u001f]/g, ' ').trim().slice(0, limit); }
    function isMarker(text) { return String(text || '').trim().startsWith(marker); }
    function decode(text) {
        const match = String(text || '').trim().match(/^\[见面邀请\]\s*([^|\n]{1,80})\s*\|\s*([\s\S]{1,400})$/);
        if (!match) return null;
        const time = clean(match[1], 80), reason = clean(match[2], 400);
        return time && reason ? { time, reason } : null;
    }
    function encode(value) {
        if (!value || typeof value !== 'object') return '';
        const parsed = decode(value.text || value.content);
        const reason = clean(value.reason || value.scenario || parsed?.reason || value.text || value.content, 400).replace(/\|/g, '｜');
        const time = clean(value.time || parsed?.time || '时间待商量', 80).replace(/\|/g, '｜');
        return reason ? marker + ' ' + time + ' | ' + reason : '';
    }
    function canOffer(contactId) {
        const owner = accountId();
        const contact = contacts().find(item => String(item.id) === String(contactId));
        if (!owner || owner === 'default' || !contact || contact.isGroup || contact.type === 'group' || contact.isBlacklisted) return false;
        const messages = history(contactId).filter(item => !item.isRecalled);
        const invitations = messages.filter(item => item.meetingInvite?.accountId === owner);
        if (invitations.some(item => item.meetingInvite.state === 'pending')) return false;
        const last = invitations[invitations.length - 1]?.meetingInvite;
        // A decision is not a new user message and must not trigger another unsolicited invitation.
        if (last?.resolvedAt && !messages.some(item => item.type === 'sent' && Number(item.createdAt) > last.resolvedAt)) return false;
        return true;
    }
    function create(contactId, text) {
        const value = decode(text);
        if (!value || !canOffer(contactId)) return null;
        const contact = contacts().find(item => String(item.id) === String(contactId));
        const settings = typeof appSettings !== 'undefined' ? appSettings : {};
        return {
            version: 1, accountId: accountId(), contactId: String(contactId), state: 'pending',
            charName: clean(contact.name || contact.remark || '角色', 100),
            userName: clean(settings.wc_current_user_name || '你', 100),
            from: clean(contact.weatherLocation, 160) || '角色所在地未填写',
            to: clean(settings.wc_user_weather_location, 160) || '用户所在地未填写',
            time: value.time, reason: value.reason, createdAt: Date.now()
        };
    }
    function summary(invite) {
        const state = labels[invite?.state] || '已失效';
        return `[见面邀约，${state}] ${invite?.charName || '角色'} → ${invite?.userName || '用户'}；`
            + `时间：${invite?.time || '待商量'}；出发：${invite?.from || '未填写'}；目的地：${invite?.to || '未填写'}；`
            + `邀请语：${invite?.reason || ''}。`
            + (invite?.state === 'accepted' ? '用户已接受本次邀约，后续进展以当前见面状态、线下记录和最新真实发言为准；不得当作仍待回应，也不得在已有线下互动后仍按尚未见面处理。'
                : invite?.state === 'rejected' ? '用户已拒绝本次见面，不要继续催促或当成已经见面。' : '用户尚未同意，不得代替用户接受或进入线下。');
    }
    function intentPrompt(contactId) {
        if (!canOffer(contactId)) return '';
        const contact = contacts().find(item => String(item.id) === String(contactId));
        return `【见面邀约动作】当你符合人设地决定主动约见，或用户提出见面而你决定答应时，必须随本轮回复附上一条独立的见面邀约动作，不能只口头说“来找你”“等你来”而遗漏卡片。
先自然表达，再输出 {"channel":"action","id":"meet1","kind":"meeting_invite","time":"约定时间","reason":"符合人设的邀请语或见面安排"}，本轮最多一条。
没有明确的时间依据就填写“时间待商量”；不得编造用户位置、空闲时间或已经同意，不要因为聊天中出现“见面”二字就强行邀约。
这项动作在你确实想见对方或同意见面时使用；单纯回忆过去、假设、谈论第三人、决定拒绝见面，均不发送。
双方位置由客户端读取现有设置。旧式独立 say 消息“[见面邀请] 约定时间 | 邀请语”仍能识别，但优先使用上述动作。
只有用户实际点击接受后才进入线下；等待时继续正常聊天。尊重拒绝，不要立刻重复邀请，不输出协议或按钮操作说明。`
            + (contact?.longDistanceModeEnabled ? '\n当前启用了异地模式：只能提出有依据的未来见面计划，不得声称已经抵达、立即见面或瞬间跨越距离。' : '');
    }
    const people = '<svg viewBox="0 0 32 32" fill="currentColor" aria-hidden="true"><circle cx="12" cy="10" r="4.3"/><path d="M3.7 24.5c0-5.2 3.4-8.3 8.3-8.3s8.3 3.1 8.3 8.3c0 1-.7 1.6-1.6 1.6H5.3c-.9 0-1.6-.6-1.6-1.6Z"/><g opacity=".4"><circle cx="23.3" cy="11" r="3.7"/><path d="M21.6 18c5.1-.5 8.3 2.1 8.3 6.5 0 1-.6 1.6-1.5 1.6h-5.5c.7-2.9-.1-5.9-1.3-8.1Z"/></g></svg>';
    const chevron = '<svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="m9 5 7 7-7 7" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg>';
    function renderCard(message) {
        const invite = message.meetingInvite;
        const card = document.createElement('button');
        card.type = 'button';
        card.className = 'wc-meeting-invite-card' + (invite.state === 'rejected' ? ' is-rejected' : '');
        card.setAttribute('aria-label', '查看见面邀请');
        card.innerHTML = `<div class="wc-meeting-invite-main"><span class="wc-meeting-invite-glyph">${people}</span><div class="wc-meeting-invite-copy"><strong>见面邀请</strong><span class="wc-meeting-invite-time"></span><span class="wc-meeting-invite-state"></span></div></div><div class="wc-meeting-invite-view">查看邀请${chevron}</div>`;
        card.querySelector('.wc-meeting-invite-time').textContent = invite.time;
        const state = card.querySelector('.wc-meeting-invite-state');
        state.textContent = labels[invite.state] || '已失效';
        state.hidden = invite.state === 'pending';
        return card;
    }
    function ownedMessage(contactId, messageId, owner) {
        if (accountId() !== owner) return null;
        const message = history(contactId).find(item => String(item.id) === String(messageId));
        const invite = message?.meetingInvite;
        return !message?.isRecalled && message?.type === 'received' && invite?.accountId === owner
            && invite.contactId === String(contactId) ? message : null;
    }
    function refresh(contactId) {
        if (typeof wcRenderChatList === 'function') wcRenderChatList();
        if (typeof wcCurrentChatContactId !== 'undefined' && String(wcCurrentChatContactId) === String(contactId)
            && typeof wcRenderChatMessages === 'function') wcRenderChatMessages(contactId);
        root.ProactivePush?.scheduleSync?.(contactId);
        root.QqCharacterBridge?.scheduleSync?.(contactId);
    }
    function open(messageId, contactId) {
        if (busy) return;
        activeDialog?.close();
        const owner = accountId(), message = ownedMessage(contactId, messageId, owner);
        if (!message) { root.showToast?.('这份邀约已失效或不属于当前面具账号'); return; }
        const invite = message.meetingInvite;
        const overlay = document.createElement('div');
        overlay.className = 'wc-meeting-invite-overlay';
        overlay.tabIndex = -1;
        overlay.innerHTML = `<section class="wc-meeting-ticket-screen" role="dialog" aria-modal="true" aria-labelledby="wcMeetingTicketTitle"><header><button type="button" data-action="back" aria-label="返回聊天">${chevron}</button><span>见面邀约</span><i></i></header><div class="wc-meeting-ticket-scroll"><div class="wc-meeting-ticket-intro"><small>AN INVITATION FOR YOU</small><h2 id="wcMeetingTicketTitle">下一站，见你。</h2><p></p></div><article class="wc-meeting-ticket"><div class="wc-meeting-ticket-top"><div class="wc-meeting-ticket-label"><span>见面通行票</span><span>ONE WAY</span></div><div class="wc-meeting-ticket-route"><div><strong data-field="from"></strong><small>FROM</small></div><span aria-hidden="true">⟶</span><div><strong data-field="to"></strong><small>TO</small></div></div><div class="wc-meeting-ticket-date"><small>约定时间</small><strong data-field="time"></strong></div><div class="wc-meeting-ticket-facts"><div><small>发起人</small><strong data-field="charName"></strong></div><div><small>受邀人</small><strong data-field="userName"></strong></div><div><small>票面状态</small><strong data-field="state"></strong></div></div></div><div class="wc-meeting-ticket-tear"><span></span></div><div class="wc-meeting-ticket-bottom"><p data-field="reason"></p><span class="wc-meeting-ticket-signature"></span><div class="wc-meeting-ticket-barcode" aria-hidden="true"></div><div class="wc-meeting-ticket-serial"><span></span><span>KEEP THIS MOMENT</span></div></div></article></div><footer class="wc-meeting-ticket-actions"><p role="status"></p><div><button type="button" data-action="accept"></button><button type="button" data-action="reject">拒绝见面</button></div><button type="button" data-action="close"></button></footer></section>`;
        const previousFocus = document.activeElement;
        const close = (force = false) => {
            if (busy && !force) return;
            root.removeEventListener('wechat:account-changed', onAccountChange);
            overlay.remove();
            if (activeDialog?.overlay === overlay) activeDialog = null;
            if (accountId() === owner && previousFocus?.isConnected) previousFocus.focus({ preventScroll: true });
        };
        const onAccountChange = () => close(true);
        activeDialog = { overlay, close };
        root.addEventListener('wechat:account-changed', onAccountChange);
        overlay.querySelector('.wc-meeting-ticket-intro p').textContent = invite.charName + '想与你见面。';
        ['from', 'to', 'time', 'charName', 'userName', 'reason'].forEach(field => {
            overlay.querySelector('[data-field="' + field + '"]').textContent = invite[field];
        });
        overlay.querySelector('.wc-meeting-ticket-signature').textContent = '— ' + invite.charName;
        overlay.querySelector('.wc-meeting-ticket-serial span').textContent = 'TH · ' + String(message.id).replace(/[^a-zA-Z0-9]/g, '').slice(-12).toUpperCase();
        const accept = overlay.querySelector('[data-action="accept"]');
        const reject = overlay.querySelector('[data-action="reject"]');
        const later = overlay.querySelector('[data-action="close"]');
        const status = overlay.querySelector('[role="status"]');
        const update = () => {
            const state = message.meetingInvite.state;
            overlay.querySelector('[data-field="state"]').textContent = labels[state] || '已失效';
            accept.textContent = state === 'accepted' ? '进入线下见面' : state === 'rejected' ? '本次邀约已拒绝' : '接受邀约';
            accept.disabled = state === 'rejected';
            reject.hidden = state !== 'pending';
            later.textContent = state === 'pending' ? '先收好，稍后再说' : '返回聊天';
        };
        const settle = async decision => {
            if (busy) return;
            busy = true;
            overlay.querySelectorAll('button').forEach(button => { button.disabled = true; });
            try {
                if (!ownedMessage(contactId, messageId, owner)) throw new Error('邀约已失效或面具账号已切换');
                if (message.meetingInvite.state === 'pending') {
                    if (decision === 'accept' && typeof root.openMeetingApp !== 'function') throw new Error('见面 App 尚未加载，请稍后重试');
                    const saved = await root.wcCommitMeetingInvitation?.(contactId, messageId, decision, owner);
                    if (saved !== true) throw new Error('保存未完成，请重试');
                    if (!ownedMessage(contactId, messageId, owner)) return;
                    refresh(contactId);
                }
                update();
                if (decision === 'reject') { close(true); root.showToast?.('已拒绝见面，邀约记录已保留'); return; }
                if (message.meetingInvite.state !== 'accepted') return;
                status.textContent = '正在打开见面…';
                const opened = await root.openMeetingApp({ contactId, returnToWechat: true, expectedAccountId: owner });
                if (opened !== true) throw new Error('未能打开见面页面，邀约已接受，可再次点击进入');
                close(true);
            } catch (error) {
                if (overlay.isConnected) status.textContent = error.message || '操作未完成，请重试';
            } finally {
                busy = false;
                overlay.querySelectorAll('button').forEach(button => { button.disabled = false; });
                update();
            }
        };
        accept.addEventListener('click', () => settle('accept'));
        reject.addEventListener('click', () => settle('reject'));
        overlay.querySelector('[data-action="back"]').addEventListener('click', () => close());
        later.addEventListener('click', () => close());
        overlay.addEventListener('keydown', event => {
            if (event.key === 'Escape') close();
            if (event.key !== 'Tab') return;
            const buttons = [...overlay.querySelectorAll('button')].filter(button => !button.hidden && !button.disabled);
            if (!buttons.length) { event.preventDefault(); return; }
            const current = buttons.indexOf(document.activeElement);
            event.preventDefault();
            buttons[event.shiftKey ? (current <= 0 ? buttons.length - 1 : current - 1) : (current + 1) % buttons.length].focus();
        });
        update();
        (document.getElementById('wechatAppUI') || document.body).appendChild(overlay);
        overlay.querySelector('[data-action="back"]').focus({ preventScroll: true });
    }
    root.MeetingInvitations = Object.freeze({ isMarker, decode, encode, canOffer, create, summary, intentPrompt, renderCard, open });
})(window);
