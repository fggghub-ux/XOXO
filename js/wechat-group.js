// Group conversations have their own account-scoped records and generation lifecycle.
(function () {
    'use strict';

    const USER_ID = 'user';
    const GROUP_PREFIX = 'wechatGroupData_';
    const MESSAGE_PREFIX = 'wechatGroupMessages_';
    let account = '';
    let groups = [];
    let conversations = {};
    let ready = null;
    let epoch = 0;
    let activeId = '';
    let returnPageId = 'page-chat-list';
    let replyId = '';
    let groupMediaSession = null;
    let mentions = [];
    let mentionTokens = [];
    let mentionInputValue = '';
    let renderLimit = 80;
    let creating = false;
    let avatarChoiceApply = null;
    let avatarChoiceExisting = '';
    let avatarChoiceVersion = 0;
    let avatarChoiceTitle = '修改群头像';
    let memberReturnToSettings = false;
    let emojiGroupId = 'all';
    let emojiSearching = false;
    let bubbleMenuMessageId = '';
    let groupSelectionMode = false;
    const selectedGroupMessages = new Set();
    let editMessageId = '';
    let editGroupId = '';
    let editMessageRole = 'char';
    let editMessageFormat = 'text';
    let groupEditSaving = false;
    let bubblePressTimer = null;
    let autoSession = null;
    let packetExpiryTimer = null;
    let walletRefundTimer = null;
    let gameBotTimer = null;
    let gameBotBusy = false;
    let pausedGameId = '';
    let gameCommentBusy = false;
    let cardTableOrientation = 'landscape';
    let mahjongTableOrientation = 'portrait';
    let gameCommentMemberId = '';
    let gameCommentMessageId = '';
    let gameThinking = null;
    let gameSpeechPresentation = null;
    const gameCommentSends = new Set();
    const requests = new Map();
    const summaryJobs = new Set();
    const writes = new Map();
    const pendingWrites = new Map();

    const el = id => document.getElementById(id);
    const currentAccount = () => String(wcGetCurrentAccountId());
    const clone = value => JSON.parse(JSON.stringify(value));
    const uid = () => crypto.randomUUID();
    const escape = value => String(value ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
    const groupById = id => groups.find(group => group.id === id);
    const active = () => groupById(activeId);
    const rows = group => conversations[group.id] || (conversations[group.id] = []);
    const memberName = member => member?.nickname || member?.name || '成员';
    const canManage = group => group.mode === 'observe' || group.members.some(member => member.id === USER_ID && ['owner', 'admin'].includes(member.role));
    const canSpeak = (group, member) => Boolean(member && !group.archived && Number(member.mutedUntil || 0) <= Date.now() && (!group.muteAll || ['owner', 'admin'].includes(member.role)));
    const messageKey = (owner, id) => `${MESSAGE_PREFIX}${owner}::${id}`;
    const toast = text => showToast(text);

    function transactionDone(transaction, commit) {
        return new Promise((resolve, reject) => {
            transaction.oncomplete = () => { if (commit) commit(); resolve(true); };
            transaction.onerror = () => reject(transaction.error || new Error('群聊数据保存失败'));
            transaction.onabort = () => reject(transaction.error || new Error('群聊数据保存被中止'));
        });
    }

    function normalizeGroup(value) {
        if (!value || typeof value !== 'object' || !String(value.id || '').startsWith('group_')) return null;
        const ids = new Set();
        const members = (Array.isArray(value.members) ? value.members : []).filter(member => member && member.id && !ids.has(String(member.id)) && ids.add(String(member.id))).map(member => ({
            ...member, id: String(member.id), name: String(member.name || '成员'), nickname: String(member.nickname || ''),
            role: ['owner', 'admin'].includes(member.role) ? member.role : 'member',
            historyFromSequence: Math.max(0, Number(member.historyFromSequence) || 0)
        }));
        const mode = value.mode === 'observe' ? 'observe' : 'participate';
        return {
            ...value, id: String(value.id), name: String(value.name || '群聊'), mode,
            members: mode === 'observe' ? members.filter(member => member.id !== USER_ID) : members,
            autoRounds: Math.max(1, Math.min(20, Number(value.autoRounds) || 5)),
            speakerMode: value.speakerMode === 'all' ? 'all' : 'natural',
            worldbookGroupIds: [...new Set((Array.isArray(value.worldbookGroupIds) ? value.worldbookGroupIds : [])
                .map(id => String(id ?? '').trim()).filter(Boolean))],
            inheritMemberWorldbooks: value.inheritMemberWorldbooks !== false,
            summaryInterval: Math.max(1, Math.min(500, Math.floor(Number(value.summaryInterval) || 50))),
            summaryCursor: Math.max(0, Number(value.summaryCursor) || 0),
            summaryChunks: Array.isArray(value.summaryChunks) ? value.summaryChunks.slice(-12) : [],
            allowPrivateHistoryInGroup: value.allowPrivateHistoryInGroup === true,
            groupPrivateTriggerEnabled: value.groupPrivateTriggerEnabled === true,
            sequence: Math.max(0, Number(value.sequence) || 0), unreadCount: Math.max(0, Number(value.unreadCount) || 0)
        };
    }

    async function load() {
        const owner = currentAccount();
        if (ready && account === owner) return ready;
        stopAll();
        account = owner;
        groups = [];
        conversations = {};
        const token = ++epoch;
        ready = (async () => {
            const record = await wcReadLayoutRecord(`${GROUP_PREFIX}${owner}`);
            const nextGroups = (Array.isArray(record?.groups) ? record.groups : []).map(normalizeGroup).filter(Boolean);
            const records = await Promise.all(nextGroups.map(group => wcReadLayoutRecord(messageKey(owner, group.id))));
            if (token !== epoch || owner !== currentAccount()) return false;
            groups = nextGroups;
            conversations = Object.fromEntries(groups.map((group, index) => [group.id, (Array.isArray(records[index]?.messages) ? records[index].messages : []).filter(message => message && message.id).map(message => ({ ...message }))]));
            groups.forEach(group => { group.sequence = rows(group).reduce((maximum, message) => Math.max(maximum, Number(message.sequence) || 0), group.sequence); });
            try {
                const changed = await wcSyncGroupMessageFavorites(groups, conversations);
                if (token !== epoch || owner !== currentAccount()) return false;
                for (const group of changed) await save(group, { skipAutoBackup: true });
            } catch (error) { console.warn('Group favorites sync failed:', error); }
            if (token !== epoch || owner !== currentAccount()) return false;
            await settleExpiredGroupPackets();
            if (token !== epoch || owner !== currentAccount()) return false;
            scheduleWalletRefunds();
            wcRenderChatList();
            if (el('page-contacts')?.classList.contains('active') && typeof wcRenderContactList === 'function') wcRenderContactList();
            return true;
        })().catch(error => {
            if (token === epoch) ready = null;
            console.error('Group data load failed:', error);
            toast('群聊数据读取失败，请重新打开微信');
            throw error;
        });
        return ready;
    }

    async function reload() {
        window.wcCloseGroupImageViewer?.();
        closeGroupMedia();
        ++epoch;
        ready = null;
        stopAll();
        closePanel();
        if (el('page-group-chat')?.classList.contains('active')) close();
        activeId = '';
        return load();
    }

    function save(group, options = {}) {
        if (!db || window.__tonghuajiBackupRestoreInProgress || account !== currentAccount() || (!options.allowRemoved && groupById(group.id) !== group)) return Promise.reject(new Error('群聊数据尚未准备好'));
        const owner = account;
        // A live edit cancels a staged replacement before it can overwrite that edit.
        if (!options.replacement) requests.forEach(job => { if (job.regenerating) job.controller.abort(); });
        const task = {
            groupId: group.id,
            metadata: clone(groups.map(item => item === group && options.replacement ? options.replacement.group : item)),
            messages: clone(options.replacement ? options.replacement.messages : rows(group)),
            options
        };
        const pending = pendingWrites.get(owner) || [];
        pending.push(task);
        pendingWrites.set(owner, pending);
        const promise = queueWrite(owner);
        if (!options.replacement) return promise;
        return promise.catch(error => {
            // An uncommitted replacement is tentative; accepted live edits remain retryable.
            const index = pending.indexOf(task);
            if (index >= 0) pending.splice(index, 1);
            if (!pending.length && pendingWrites.get(owner) === pending) pendingWrites.delete(owner);
            throw error;
        });
    }


    // The wallet and group message must commit in one IndexedDB transaction.
    function writeGroupWalletOperation(store, owner, operation, writeGroup, fail, succeed) {
        const request = store.get('wechatWalletData_' + owner);
        request.onsuccess = () => {
            try {
                const wallet = request.result ? clone(request.result) : {
                    id: 'wechatWalletData_' + owner, balance: 0, transactions: [], groupRedPacketSettlements: {}
                };
                const delta = Number(operation.deltaCents);
                if (!operation.id || !Number.isSafeInteger(delta) || delta === 0) throw new Error('红包结算参数无效');
                const settled = wallet.groupRedPacketSettlements || {};
                if (settled[operation.id]) throw new Error('该红包账目已经结算');
                const balance = Math.round(Number(wallet.balance) * 100);
                if (!Number.isSafeInteger(balance) || balance < 0) throw new Error('钱包余额异常');
                if (balance + delta < 0) throw new Error('微信零钱余额不足');
                const at = Date.now();
                wallet.balance = (balance + delta) / 100;
                wallet.groupRedPacketSettlements = { ...settled, [operation.id]: at };
                wallet.transactions = [{
                    id: 'group_packet_' + operation.id,
                    type: delta < 0 ? 'expense' : 'income',
                    title: operation.title,
                    amount: Math.abs(delta) / 100, createdAt: at, icon: 'money',
                    groupRedPacketId: operation.packetId, groupRedPacketGroupId: operation.groupId,
                    groupRedPacketOperation: operation.kind
                }, ...(Array.isArray(wallet.transactions) ? wallet.transactions : [])];
                store.put(wallet);
                writeGroup();
                succeed(wallet);
            } catch (error) { fail(error); }
        };
        request.onerror = () => fail(request.error || new Error('读取钱包失败'));
    }

    function queueWrite(owner) {
        const prior = writes.get(owner) || Promise.resolve();
        const promise = prior.catch(() => {}).then(async () => {
            const pending = pendingWrites.get(owner);
            while (pending?.length) {
                const task = pending[0];
                const { options } = task;
                let tx;
                const abort = () => { try { tx?.abort(); } catch (_) { /* The transaction may already be complete. */ } };
                try {
                    if (options.signal?.aborted) throw new DOMException('生成已取消', 'AbortError');
                    if (window.__tonghuajiBackupRestoreInProgress) throw new Error('正在恢复备份，请稍后再试');
                    tx = db.transaction([storeName], 'readwrite');
                    let committedWallet = null;
                    let walletError = null;
                    const done = transactionDone(tx, () => {
                        if (options.commit) options.commit();
                        if (committedWallet && owner === account && owner === currentAccount() && typeof wcWalletData !== 'undefined') {
                            wcWalletData.balance = committedWallet.balance;
                            wcWalletData.transactions = committedWallet.transactions;
                            wcWalletData.groupRedPacketSettlements = committedWallet.groupRedPacketSettlements;
                            try { if (typeof wcRenderWallet === 'function') wcRenderWallet(); }
                            catch (error) { console.warn('钱包界面刷新失败', error); }
                        }
                    });
                    options.signal?.addEventListener('abort', abort, { once: true });
                    try {
                        const store = (window.CharacterRecordCleanup?.wrap(tx.objectStore(storeName)) || tx.objectStore(storeName));
                        const writeGroup = () => {
                            store.put({ id: `${GROUP_PREFIX}${owner}`, schemaVersion: 1, groups: task.metadata });
                            store.put({ id: messageKey(owner, task.groupId), groupId: task.groupId, messages: task.messages });
                        };
                        if (options.walletOperation) {
                            writeGroupWalletOperation(store, owner, options.walletOperation, writeGroup,
                                error => { walletError = error; abort(); },
                                value => { committedWallet = value; });
                        } else writeGroup();
                    } catch (error) {
                        abort();
                        await done.catch(() => {});
                        throw error;
                    }
                    try { await done; } catch (error) { throw walletError || error; }
                    pending.shift();
                    if (!options.skipAutoBackup && typeof triggerAutoLocalBackup === 'function') triggerAutoLocalBackup();
                } catch (error) {
                    if (options.replacement && pending[0] === task) pending.shift();
                    if (!pending.length) pendingWrites.delete(owner);
                    throw error;
                } finally {
                    options.signal?.removeEventListener('abort', abort);
                }
            }
            if (pendingWrites.get(owner) === pending) pendingWrites.delete(owner);
            return true;
        });
        writes.set(owner, promise);
        const settled = () => { if (writes.get(owner) === promise) writes.delete(owner); };
        promise.then(settled, settled);
        return promise;
    }

    async function flush() {
        while (writes.size || pendingWrites.size) {
            const owners = new Set([...writes.keys(), ...pendingWrites.keys()]);
            await Promise.all([...owners].map(async owner => {
                // Retry retained data rather than replaying a rejected promise forever.
                await writes.get(owner)?.catch(() => {});
                if (pendingWrites.has(owner)) await queueWrite(owner);
            }));
        }
    }

    function publicMessage(group, senderId, text, extra = {}, messages = rows(group)) {
        refreshMemberAvatars(group);
        const member = group.members.find(item => item.id === senderId);
        const message = {
            ...extra, id: uid(), sequence: ++group.sequence, senderId,
            senderName: memberName(member), senderAvatar: member?.avatar || '',
            text: String(text), createdAt: Date.now(), type: senderId === 'system' ? 'system_event' : 'text'
        };
        messages.push(message);
        group.updatedAt = message.createdAt;
        if (senderId !== USER_ID && senderId !== 'system' && !(activeId === group.id && el('page-group-chat')?.classList.contains('active'))) group.unreadCount = (group.unreadCount || 0) + 1;
        return message;
    }

    function operationNotice(group, text, includeInContext = true) {
        return publicMessage(group, 'system', text, { includeInContext });
    }

    const operatorName = group => group.mode === 'observe' ? '旁观者' : memberName(group.members.find(member => member.id === USER_ID));

    function settingNotices(group, previous, fields, includeInContext = true) {
        fields.forEach(([key, enabled, disabled]) => {
            if (Boolean(previous[key]) !== Boolean(group[key])) operationNotice(group, group[key] ? enabled : disabled, includeInContext);
        });
    }

    // Group membership keeps a snapshot; linked character avatars remain authoritative.
    function refreshMemberAvatars(group) {
        if (!group || !Array.isArray(group.members)) return;
        const contacts = new Map((typeof wcContactsList === 'undefined' ? [] : wcContactsList)
            .filter(contact => contact?.id != null).map(contact => [String(contact.id), contact]));
        group.members.forEach(member => {
            if (member.id === USER_ID) {
                if (typeof appSettings !== 'undefined' && Object.prototype.hasOwnProperty.call(appSettings, 'wc_current_user_avatar')) {
                    member.avatar = appSettings.wc_current_user_avatar || '';
                }
            } else if (member.kind !== 'npc' && contacts.has(String(member.id))) {
                member.avatar = contacts.get(String(member.id)).avatar || '';
            }
        });
    }

    function avatarNode(url, name, className = 'msg-avatar') {
        const node = document.createElement('div');
        node.className = className;
        if (!wcApplyAvatarBackground(node, url)) node.innerHTML = getWcDefaultAvatarSvg();
        node.setAttribute('aria-label', name);
        return node;
    }

    function groupAvatar(group) {
        refreshMemberAvatars(group);
        if (group.avatar) return avatarNode(group.avatar, group.name, 'avatar wc-group-avatar');
        const node = document.createElement('div');
        node.className = 'avatar wc-group-avatar';
        const preview = document.createElement('div');
        preview.className = 'wc-group-avatar-grid';
        const members = group.members.filter(member => member.id !== USER_ID).slice(0, 4);
        preview.dataset.count = String(members.length);
        members.forEach(member => preview.append(avatarNode(member.avatar, memberName(member), 'wc-group-avatar-cell')));
        node.append(preview);
        return node;
    }

    const GROUP_CONTACT_TAB = 'wc_group_chats';

    // Use the exact list wrapper/content/action classes of a private WeChat chat.
    // wcInitChatSwipe binds automatically after wcRenderChatList has finished.
    function renderList(container) {
        if (!container) return;
        const timestamps = new Map();
        wcContactsList.forEach(contact => {
            const messages = wcChatMessagesByContact[contact.id] || [];
            timestamps.set(String(contact.id), [Boolean(contact.isPinned), Number(messages.at(-1)?.createdAt) || 0]);
        });
        groups.filter(group => !group.archived).forEach(group => {
            const wrapper = document.createElement('div');
            wrapper.className = 'wc-swipe-wrapper wc-group-list-wrapper';
            wrapper.dataset.groupId = group.id;
            const actions = document.createElement('div');
            actions.className = 'wc-swipe-actions';
            const pin = document.createElement('button');
            pin.type = 'button'; pin.className = 'wc-swipe-btn';
            pin.style.cssText = 'background-color:#ff9500;width:80px;border:0;color:#fff;';
            pin.textContent = group.isPinned ? '取消置顶' : '置顶';
            pin.onclick = event => { event.stopPropagation(); togglePinned(group.id).catch(report); };
            const move = document.createElement('button');
            move.type = 'button'; move.className = 'wc-swipe-btn';
            move.style.cssText = 'background-color:#3390ec;width:80px;border:0;color:#fff;';
            move.textContent = '分组';
            move.onclick = event => { event.stopPropagation(); moveToGroup(group.id); };
            actions.append(pin, move);
            const item = document.createElement('div');
            item.className = 'chat-item wc-swipe-content wc-group-list-item';
            item.dataset.sessionId = group.id;
            item.dataset.groupId = group.id;
            item.tabIndex = 0;
            item.setAttribute('role', 'button');
            item.style.cssText = 'display:flex;padding:12px 16px;align-items:center;position:relative;z-index:2;transition:transform .3s cubic-bezier(.25,.8,.25,1);background:transparent;';
            if (group.isPinned) {
                const pinned = document.createElement('span');
                pinned.className = 'wc-group-chat-pin-mark';
                pinned.innerHTML = GROUP_ICON_MARKUP.pin;
                pinned.setAttribute('aria-label', '已置顶');
                item.append(pinned);
            }
            const photo = groupAvatar(group);
            if (group.unreadCount) {
                const badge = document.createElement('div');
                badge.className = 'wc-chat-unread-badge';
                badge.textContent = group.unreadCount > 99 ? '99+' : group.unreadCount;
                photo.append(badge);
            }
            const last = rows(group).at(-1);
            const info = document.createElement('div');
            info.className = 'chat-info';
            const nameRow = document.createElement('div');
            nameRow.className = 'chat-name-row';
            const name = document.createElement('div');
            name.className = 'name'; name.textContent = group.name;
            const time = document.createElement('div');
            time.className = 'time'; time.textContent = wcFormatChatTime(group.updatedAt);
            nameRow.append(name, time);
            const msgRow = document.createElement('div');
            msgRow.className = 'chat-msg-row';
            const preview = document.createElement('div');
            preview.className = 'msg';
            const prefix = (group.muted ? '免打扰 · ' : '') + (group.mode === 'observe' ? '旁观 · ' : '');
            preview.textContent = prefix + (last ? (last.type === 'system_event' ? '' : last.senderName + '：')
                + (last.recalled ? '[消息已撤回]' : last.text) : '群聊已创建');
            msgRow.append(preview);
            info.append(nameRow, msgRow);
            item.append(photo, info);
            item.onclick = () => open(group.id).catch(report);
            item.onkeydown = event => { if (event.key === 'Enter') item.click(); };
            wrapper.append(actions, item);
            container.append(wrapper);
            timestamps.set(group.id, [Boolean(group.isPinned), Number(group.updatedAt) || 0]);
        });
        [...container.children].sort((a, b) => {
            const key = node => node.dataset.groupId || node.querySelector('[data-session-id]')?.dataset.sessionId;
            const left = timestamps.get(key(a)) || [false, 0];
            const right = timestamps.get(key(b)) || [false, 0];
            return Number(right[0]) - Number(left[0]) || right[1] - left[1];
        }).forEach(node => container.append(node));
    }

    async function togglePinned(id) {
        const group = groupById(id);
        if (!group || group.archived) return;
        group.isPinned = !group.isPinned;
        operationNotice(group, group.isPinned ? '你置顶了此群聊' : '你取消了群聊置顶', false);
        await save(group);
        wcRenderChatList();
    }

    function moveToGroup(id) {
        const group = groupById(id);
        if (!group || group.archived) return;
        const categories = Array.isArray(wcContactGroups) ? wcContactGroups : [];
        if (!categories.length) { toast('请先在通讯录创建分组'); return; }
        openUniversalSelect({
            title: '移动群聊至',
            items: categories.map(category => ({ label: category.name, value: category.id })),
            currentValue: group.groupId || categories[0].id,
            searchable: false,
            onSelect: async groupId => {
                if (!categories.some(category => category.id === groupId) || groupById(id) !== group) return;
                if (group.groupId === groupId) return;
                group.groupId = groupId;
                operationNotice(group, `你将此群聊移至“${categories.find(category => category.id === groupId).name}”分组`, false);
                try {
                    await save(group);
                    wcRenderChatList();
                    if (typeof wcRenderContactList === 'function') wcRenderContactList();
                    toast('移动成功');
                } catch (error) { report(error); }
            }
        });
    }

    // A virtual "群聊" address-book tab shows every room; normal contact tabs
    // also contain rooms explicitly assigned to that contact grouping.
    function renderContacts(container, tabId) {
        if (!container) return;
        const categories = Array.isArray(wcContactGroups) ? wcContactGroups : [];
        const defaultId = categories[0]?.id || 'g_member';
        const validIds = new Set(categories.map(category => category.id));
        const matches = groups.filter(group => !group.archived &&
            (tabId === GROUP_CONTACT_TAB
                || (validIds.has(group.groupId) ? group.groupId : defaultId) === tabId));
        if (!matches.length) return;
        const section = document.createElement('div');
        section.className = 'wc-list-group wc-group-contact-section';
        matches.forEach(group => {
            const card = document.createElement('div');
            card.className = 'wc-character-card wc-group-contact-card';
            card.tabIndex = 0;
            card.setAttribute('role', 'button');
            card.dataset.groupId = group.id;
            const picture = groupAvatar(group);
            picture.classList.add('wc-group-contact-avatar');
            const info = document.createElement('div');
            info.className = 'info-wrapper';
            const name = document.createElement('div');
            name.className = 'name'; name.textContent = group.name;
            const detail = document.createElement('div');
            detail.className = 'desc';
            detail.textContent = (group.mode === 'observe' ? '旁观群聊' : '群聊') + ' · ' + group.members.length + ' 位成员';
            info.append(name, detail);
            card.append(picture, info);
            card.onclick = () => open(group.id).catch(report);
            card.onkeydown = event => { if (event.key === 'Enter') card.click(); };
            section.append(card);
        });
        container.append(section);
        container.querySelector('.wc-contacts-empty-placeholder')?.remove();
    }

    function report(error) {
        console.error('Group action failed:', error);
        toast(error?.message || '群聊操作失败，请重试');
    }

    function panel(title, html, view = 'detail') {
        closeSpeakerPanel();
        closeMorePanel();
        closeEmojiPanel();
        closeBubbleMenu();
        closeGroupMessageEditor();
        closeDropdown();
        closeAvatarSourceMenu();
        const container = el('wcGroupPanel');
        // Remove the Gomoku composer and detail sheet before switching panels.
        container.querySelector?.('.wcg-gomoku-chat-dock')?.remove();
        container.querySelector?.('.wcg-gomoku-detail-overlay')?.remove();
        container.querySelectorAll?.('.wcg-gomoku-nav-button')?.forEach(button => button.remove());
        container.querySelector?.('.wcg-gomoku-topbar')?.remove();
        container.querySelector?.('.wc-group-panel-sheet')?.setAttribute('aria-labelledby', 'wcGroupPanelTitle');
        delete container.dataset.gameMessageId;
        delete container.dataset.gameType;
        delete container.dataset.landscapeGame;
        delete container.dataset.gameRotated;
        delete container.dataset.returnToGroupSettings;
        el('wcGroupPanelTitle').textContent = title;
        el('wcGroupPanelBody').innerHTML = html;
        container.dataset.view = view;
        const closeButton = el('wcGroupPanelClose');
        if (closeButton) closeButton.textContent = view === 'create' ? '取消' : '完成';
        const saveButton = el('wcGroupPanelSave');
        if (saveButton) {
            const submitForms = { settings: 'wcGroupSettingsForm', appearance: 'wcGroupAppearanceForm', 'add-members': 'wcGroupAddForm', 'remove-members': 'wcGroupRemoveForm', member: 'wcGroupMemberForm', 'create-poll': 'wcGroupCreatePoll', 'create-relay': 'wcGroupCreateRelay', 'create-redpacket': 'wcGroupCreateRedPacket' };
            saveButton.hidden = !submitForms[view] || view === 'appearance';
            if (submitForms[view]) {
                saveButton.setAttribute('form', submitForms[view]);
                saveButton.textContent = view === 'add-members' ? '添加' : view === 'remove-members' ? '移出' :
                    (view === 'create-poll' || view === 'create-relay') ? '发起' : '保存';
                saveButton.disabled = false;
            }
        }
        container.hidden = false;
        container.setAttribute('aria-hidden', 'false');
    }

    function backFromPanel() {
        const view = el('wcGroupPanel')?.dataset.view;
        if (view === 'worldbook-binding') {
            showGroupWorldbookBinding(false);
            return;
        }
        if (el('wcGroupPanel')?.dataset.returnToGroupSettings === '1') { settings(); return; }
        if (view === 'settings' && el('wcGroupPanel').dataset.settingsSection && el('wcGroupPanel').dataset.settingsSection !== 'overview') {
            showGroupSettingsSection('overview');
            return;
        }
        if (['group-media', 'remove-members'].includes(view)) { settings(); return; }
        if (view === 'add-members' || (view === 'member' && memberReturnToSettings)) {
            settings();
            return;
        }
        closePanel();
    }

    function closePanel() {
        const container = el('wcGroupPanel');
        if (!container) return;
        container.hidden = true;
        container.setAttribute('aria-hidden', 'true');
        el('wcGroupEssenceOverlay')?.remove();
        el('wcGroupPanelEssenceFilter')?.setAttribute('aria-expanded', 'false');
        closeAvatarSourceMenu();
        avatarChoiceApply = null;
        ++avatarChoiceVersion;
        delete container.dataset.view;
        delete container.dataset.gameMessageId;
        scheduleGroupGameBot();
    }

    function closeDropdown() {
        const menu = el('wcGroupDropdownMenu');
        if (menu) menu.classList.remove('show');
        el('wcGroupTopMenuToggle')?.setAttribute('aria-expanded', 'false');
    }

    function toggleDropdown(event) {
        event?.stopPropagation();
        closeMorePanel();
        const menu = el('wcGroupDropdownMenu');
        if (!active() || !menu) return;
        const open = !menu.classList.contains('show');
        menu.classList.toggle('show', open);
        el('wcGroupTopMenuToggle')?.setAttribute('aria-expanded', String(open));
    }

    function handleDropdownAction(action) {
        closeDropdown();
        if (!active()) return;
        if (action === '聊天设置') settings();
        else if (action === '聊天美化') beautify();
        else if (action === '搜索聊天记录') searchPanel();
        else if (action === '清空聊天记录') destructive('clear').catch(report);
    }

    // Group stickers share the single chat emoji groups and recent list, but never
    // call wcSendEmoji, which would write into a private conversation.
    function safeStickerUrl(value) {
        const source = String(value || '').trim();
        if (/^data:image\/(?:png|jpe?g|gif|webp|avif);base64,[a-z0-9+/=]+$/i.test(source)) return source;
        return safeImage(source);
    }

    function availableGroupStickers() {
        return typeof wcGetAllEmojis === 'function' ? wcGetAllEmojis() : [];
    }


    // Character stickers use the existing per-contact bindings; NPCs have no implicit inheritance.
    function characterStickers(member) {
        if (!member || member.kind === 'npc' || typeof wcGetRepairEmojiPool !== 'function') return [];
        const contact = wcContactsList.find(item => item.id === member.id);
        const seen = new Set();
        return (contact ? wcGetRepairEmojiPool(contact) : []).filter(item => {
            const id = String(item?.id || '');
            if (!id || seen.has(id) || !safeStickerUrl(item.url)) return false;
            seen.add(id);
            return true;
        });
    }

    function characterActionAllowed(group, action) {
        return group.characterActions?.[action] !== false;
    }

    function recallGroupMessage(message) {
        if (!message || message.recalled) return false;
        // Preserve the message content for the recall detail view and editor.
        message.recalledOriginalText = String(message.text || '');
        message.recalledType = message.isVoice ? 'voice' : (message.imageUrl ? 'image' : 'text');
        message.recalledAt = Date.now();
        message.recalled = true;
        message.essential = false;
        delete message.essentialAt;
        delete message.essentialBy;
        delete message.essentialByName;
        message.reactions = [];
        return true;
    }

    function viewGroupRecalledMessage(message) {
        const title = message.senderId === USER_ID ? '你撤回的消息' : `${message.senderName || '对方'}撤回的消息`;
        const content = String(message.recalledOriginalText ?? message.text ?? '') || '(空内容)';
        const prefix = message.recalledType === 'voice' ? '[语音内容]\n'
            : message.recalledType === 'image' ? '[图片描述]\n' : '';
        if (typeof showCustomAlert === 'function') showCustomAlert(title, prefix + content);
        else alert(title + '：\n\n' + prefix + content);
    }

    function applyReaction(message, senderId, emoji) {
        if (!message || message.recalled || message.type === 'system_event') return false;
        const reactions = (Array.isArray(message.reactions) ? message.reactions : [])
            .filter(item => item && item.emoji && (item.userId || item.memberId));
        const index = reactions.findIndex(item => (item.userId || item.memberId) === senderId);
        if (index < 0) reactions.push({ userId: senderId, emoji });
        else if (reactions[index].emoji === emoji) reactions.splice(index, 1);
        else reactions[index] = { userId: senderId, emoji };
        message.reactions = reactions;
        return true;
    }

    function nudgeText(group, senderId, targetId) {
        const sender = group.members.find(item => item.id === senderId);
        const target = group.members.find(item => item.id === targetId);
        if (!sender || !target) return '';
        const contact = target.kind !== 'npc' ? wcContactsList.find(item => item.id === target.id) : null;
        const actorContact = sender.kind !== 'npc' ? wcContactsList.find(item => item.id === sender.id) : null;
        const suffix = String(target.nudgeSuffix ||
            (targetId === USER_ID ? (actorContact?.userNudgeSuffix || '') : (contact?.charNudgeSuffix || target.charNudgeSuffix || ''))).trim().slice(0, 80);
        return (senderId === USER_ID ? '你' : memberName(sender)) + '拍了拍' +
            (targetId === USER_ID ? '你' : memberName(target)) + (suffix ? ' ' + suffix : '');
    }

    // Keep a bounded undo record for actions that change previously saved messages.
    function rememberTurnEffect(group, turnId, message) {
        if (!message) return;
        group.turnEffects ||= {};
        const turn = group.turnEffects[turnId] ||= { at: Date.now(), changes: [], memories: clone(group.memberMemories || {}) };
        if (!turn.changes.some(item => item.id === message.id)) {
            turn.changes.push({ id: message.id, reactions: clone(message.reactions || []),
                recalled: Boolean(message.recalled), recalledOriginalText: message.recalledOriginalText,
                recalledType: message.recalledType, recalledAt: message.recalledAt,
                essential: Boolean(message.essential), essentialAt: message.essentialAt,
                essentialBy: message.essentialBy, essentialByName: message.essentialByName,
                activity: clone(message.activity || null),
                ...(message.activity?.kind === 'game' ? { gameText: message.text } : {}) });
        }
        const expired = Object.keys(group.turnEffects).sort((a, b) =>
            Number(group.turnEffects[a]?.at || 0) - Number(group.turnEffects[b]?.at || 0));
        while (expired.length > 50) delete group.turnEffects[expired.shift()];
    }

    function undoTurnEffects(group, messages, turnId) {
        const turn = group.turnEffects?.[turnId];
        if (!turn) return;
        for (const change of turn.changes) {
            const target = messages.find(item => item.id === change.id);
            if (!target) continue;
            target.reactions = change.reactions;
            target.recalled = change.recalled;
            for (const field of ['recalledOriginalText', 'recalledType', 'recalledAt']) {
                if (change[field] === undefined) delete target[field];
                else target[field] = change[field];
            }
            target.essential = change.essential;
            for (const field of ['essentialAt', 'essentialBy', 'essentialByName']) {
                if (change[field] === undefined) delete target[field];
                else target[field] = change[field];
            }
            if (change.activity) target.activity = change.activity;
            if (typeof change.gameText === 'string') target.text = change.gameText;
        }
        group.memberMemories = turn.memories;
        delete group.turnEffects[turnId];
    }


    // Activity cards live in account-scoped group messages and share the existing save queue.

    function scheduleWalletRefunds() {
        if (walletRefundTimer !== null) clearTimeout(walletRefundTimer);
        walletRefundTimer = null;
        if (account !== currentAccount()) return;
        const now = Date.now();
        const soonest = groups.flatMap(group => rows(group))
            .filter(message => message.senderId === USER_ID && message.activity?.kind === 'redpacket' &&
                message.activity.funding === 'wallet' && !message.activity.refundSettled &&
                redPacketState(message.activity, now).status === 'open')
            .map(message => Number(message.activity.expiresAt))
            .filter(time => time > now).sort((a, b) => a - b)[0];
        if (!soonest) return;
        const owner = account, token = epoch;
        walletRefundTimer = setTimeout(() => {
            walletRefundTimer = null;
            if (token !== epoch || owner !== account || owner !== currentAccount()) return;
            settleExpiredGroupPackets().finally(scheduleWalletRefunds);
        }, Math.max(1, soonest - now + 20));
    }

    async function settleExpiredGroupPackets(onlyGroup = null) {
        const owner = account;
        for (const group of (onlyGroup ? [onlyGroup] : [...groups])) {
            if (owner !== account || owner !== currentAccount()) return;
            const expired = rows(group).filter(message => message.activity?.kind === 'redpacket' &&
                message.activity.funding === 'wallet' && message.senderId === USER_ID &&
                !message.activity.refundSettled && redPacketState(message.activity).status === 'expired');
            for (const packet of expired) {
                if (owner !== account || owner !== currentAccount()) return;
                try {
                    await transactActivity(
                        (draft, messages) => refundExpiredPacket(draft, messages, packet.id),
                        (draft, messages) => {
                            const current = messages.find(message => message.id === packet.id);
                            return current?.activity?.refundCents
                                ? packetWalletOperation('refund', draft, current, current.activity.refundCents)
                                : null;
                        }, group);
                } catch (error) { console.warn('群红包过期退款暂未完成，将在下次打开时重试', error); }
            }
        }
    }

    function activityEligible(group, message, memberId) {
        const member = group.members.find(item => item.id === memberId);
        return Boolean(message?.activity && member && !message.recalled &&
            message.activity.audience?.includes(memberId) &&
            (group.historyVisible || (Number(member.historyFromSequence) || 0) <= Number(message.sequence)));
    }

    function createActivity(group, messages, senderId, kind, detail, turnId = '') {
        if (!group.members.some(item => item.id === senderId) || group.archived) return null;
        const title = String(detail?.title || '').trim().slice(0, 90);
        if (!title) return null;
        const expires = Number(detail?.closesAt) || 0;
        if (expires && (expires <= Date.now() || expires > Date.now() + 30 * 86400000)) return null;
        const audience = group.members.map(item => item.id);
        let activity;
        if (kind === 'poll') {
            const names = (Array.isArray(detail.options) ? detail.options : [])
                .map(item => String(item || '').trim().slice(0, 80)).filter(Boolean).slice(0, 8);
            if (names.length < 2 || (Array.isArray(detail.options) && detail.options.length > 8) || new Set(names).size !== names.length) return null;
            const multiple = detail.multiple === true;
            activity = {
                kind, title, audience, closesAt: expires, multiple,
                anonymous: detail.anonymous === true,
                maxChoices: multiple ? Math.max(1, Math.min(names.length, Number(detail.maxChoices) || names.length)) : 1,
                allowChange: detail.allowChange !== false, votes: {},
                options: names.map((text, index) => ({ id: 'o' + (index + 1), text }))
            };
        } else if (kind === 'relay') {
            const initialEntry = senderId === USER_ID ? String(detail.initialEntry || '').trim().slice(0, 180) : '';
            activity = {
                kind, title, audience, closesAt: expires,
                description: String(detail.description || '').trim().slice(0, 240),
                sample: String(detail.sample || '').trim().slice(0, 120),
                entries: initialEntry ? [{ memberId: senderId, text: initialEntry, updatedAt: Date.now() }] : []
            };
        } else return null;
        const message = publicMessage(group, senderId, kind === 'poll' ? '[群投票] ' + title : '[群接龙] ' + title,
            { activity, turnId: turnId || undefined, actionId: uid() }, messages);
        return message;
    }


    // Purely fictional group red packets. Amounts are INTEGER CENTS and are never
    // connected to wcWalletData, payment, transfer or transaction records.
    const REDPACKET_LIFETIME = 24 * 60 * 60 * 1000;
    const REDPACKET_MAX_CENTS = 2000000;
    function splitRedPacket(cents, count, mode) {
        const amounts = [];
        let remaining = cents;
        for (let index = 0; index < count; index++) {
            const left = count - index;
            let share;
            if (left === 1) share = remaining;
            else if (mode === 'equal') share = Math.floor(cents / count) + (index < cents % count ? 1 : 0);
            else {
                const cap = Math.max(1, Math.min(remaining - left + 1, Math.floor(remaining * 2 / left)));
                share = 1 + Math.floor(Math.random() * cap);
            }
            amounts.push(share);
            remaining -= share;
        }
        if (remaining !== 0 || amounts.some(amount => !Number.isInteger(amount) || amount < 1)) return null;
        return amounts;
    }

    function redPacketState(activity, now = Date.now()) {
        const claims = Array.isArray(activity?.claims) ? activity.claims : [];
        const used = claims.reduce((sum, claim) => sum + (Number(claim.cents) || 0), 0);
        const remainingCents = Math.max(0, (Number(activity?.totalCents) || 0) - used);
        const full = claims.length >= (Number(activity?.count) || 0);
        const expired = !full && now >= (Number(activity?.expiresAt) || 0);
        return {
            claims, remainingCents, remainingCount: Math.max(0, (Number(activity?.count) || 0) - claims.length),
            status: full ? 'finished' : expired ? 'expired' : 'open'
        };
    }

    function createRedPacket(group, messages, senderId, detail, turnId = '') {
        if (!group.members.some(item => item.id === senderId) || group.archived) return null;
        // A character may send no more than one group packet per ten minutes.
        if (turnId && messages.some(item => item.activity?.kind === 'redpacket' && item.senderId !== USER_ID &&
            Date.now() - Number(item.createdAt) < 10 * 60 * 1000)) return null;
        const cents = Number(detail?.totalCents), count = Number(detail?.count);
        const audience = group.members.map(item => item.id);
        const mode = detail?.mode === 'lucky' ? 'lucky' : detail?.mode === 'equal' ? 'equal' : null;
        if (!mode || !Number.isSafeInteger(cents) || cents < 1 || cents > REDPACKET_MAX_CENTS ||
            !Number.isSafeInteger(count) || count < 1 || count > 100 || count > cents) return null;
        const allocations = splitRedPacket(cents, count, mode);
        if (!allocations) return null;
        const greeting = String(detail?.greeting || '').trim().slice(0, 80) || '恭喜发财，大吉大利';
        const activity = {
            kind: 'redpacket', greeting, mode, totalCents: cents, count,
            audience, allocations, claims: [], createdAt: Date.now(),
            expiresAt: Date.now() + REDPACKET_LIFETIME,
            funding: senderId === USER_ID ? 'wallet' : 'character',
            virtualOnly: true, // No real payment provider; user packets do affect the in-app wallet.
            refundSettled: false
        };
        return publicMessage(group, senderId, '[群红包] ' + greeting,
            { activity, turnId: turnId || undefined, actionId: uid() }, messages);
    }

    function packetWalletOperation(kind, group, message, cents, memberId = '') {
        if (!Number.isSafeInteger(cents) || cents <= 0) return null;
        const id = kind === 'send' ? 'send:' + message.id
            : kind === 'refund' ? 'refund:' + message.id : 'claim:' + message.id + ':' + memberId;
        return {
            id, packetId: message.id, groupId: group.id, kind,
            deltaCents: kind === 'send' ? -cents : cents,
            title: kind === 'send' ? '发出群红包' : kind === 'refund' ? '群红包过期退款' : '收到群红包'
        };
    }

    function refundExpiredPacket(group, messages, messageId) {
        const message = messages.find(item => item.id === messageId);
        if (!message || message.senderId !== USER_ID ||
            message.activity?.kind !== 'redpacket' || message.activity.funding !== 'wallet' ||
            message.activity.refundSettled || redPacketState(message.activity).status !== 'expired') return false;
        const remainder = redPacketState(message.activity).remainingCents;
        message.activity.refundSettled = true;
        message.activity.refundCents = remainder;
        message.activity.refundAt = Date.now();
        group.updatedAt = message.activity.refundAt;
        return true;
    }

    function claimRedPacket(group, messages, messageId, memberId, turnId = '') {
        const message = messages.find(item => item.id === messageId);
        if (!activityEligible(group, message, memberId) || message.activity.kind !== 'redpacket') return false;
        const activity = message.activity;
        const state = redPacketState(activity);
        if (state.status !== 'open' || state.claims.some(item => item.memberId === memberId)) return false;
        const cents = activity.allocations[state.claims.length];
        if (!Number.isSafeInteger(cents) || cents < 1 || cents > state.remainingCents) return false;
        state.claims.push({ id: uid(), memberId, cents, claimedAt: Date.now() });
        activity.updatedAt = Date.now();
        activity.lastActor = memberId;
        activity.lastTurnId = turnId || '';
        group.updatedAt = activity.updatedAt;
        return true;
    }

    function updateActivity(group, messages, messageId, memberId, action, data, turnId = '') {
        const message = messages.find(item => item.id === messageId);
        if (!activityEligible(group, message, memberId)) return false;
        const activity = message.activity;
        if (activity.closesAt && Date.now() >= activity.closesAt) return false;
        if (activity.kind === 'poll' && action === 'vote') {
            if (!Array.isArray(data)) return false;
            const selected = [...new Set(data.map(String))];
            if (!selected.length || selected.length > activity.maxChoices ||
                selected.some(id => !activity.options.some(option => option.id === id))) return false;
            if (activity.votes[memberId] && !activity.allowChange) return false;
            if (JSON.stringify(activity.votes[memberId]) === JSON.stringify(selected)) return false;
            activity.votes[memberId] = selected;
        } else if (activity.kind === 'relay' && action === 'join') {
            const text = String(data || '').trim().slice(0, 180);
            if (!text) return false;
            const index = activity.entries.findIndex(item => item.memberId === memberId);
            if (index >= 0 && activity.entries[index].text === text) return false;
            const entry = { memberId, text, updatedAt: Date.now() };
            if (index < 0) activity.entries.push(entry);
            else activity.entries[index] = entry;
        } else if (activity.kind === 'relay' && action === 'leave') {
            const index = activity.entries.findIndex(item => item.memberId === memberId);
            if (index < 0) return false;
            activity.entries.splice(index, 1);
        } else return false;
        activity.lastActor = memberId;
        activity.lastTurnId = turnId || '';
        activity.updatedAt = Date.now();
        group.updatedAt = activity.updatedAt;
        return true;
    }

    function activityHasWalletSettlement(message) {
        return message?.activity?.kind === 'redpacket' && message.activity.funding === 'wallet';
    }

    function activityMustStay(message) {
        return activityHasWalletSettlement(message) || activityHasParticipants(message);
    }

    function activityHasParticipants(message) {
        const a = message?.activity;
        return Boolean(a && (a.kind === 'game'
            ? (a.moves || []).length
            : a.kind === 'poll' ? Object.keys(a.votes || {}).length
            : a.kind === 'redpacket' ? (a.claims || []).length
            : (a.entries || []).length));
    }

    function canReplaceActivityTurn(group, turnId, messages = rows(group)) {
        if (!turnId) return true;
        if (messages.some(item => item.turnId === turnId && activityHasParticipants(item))) return false;
        const effects = group.turnEffects?.[turnId]?.changes || [];
        return effects.every(change => {
            if (!change.activity) return true;
            const current = messages.find(item => item.id === change.id);
            return !current?.activity || (!current.activity.refundSettled && current.activity.lastTurnId === turnId);
        });
    }

    // Serialize manual activity writes and publish only the transaction-committed snapshot.
    const activityWrites = new Map();
    function transactActivity(change, walletChange = null, group = active()) {
        if (!group || account !== currentAccount() || (group.archived && !walletChange)) return Promise.resolve(false);
        const owner = account, token = epoch;
        if (requests.has(group.id)) pause();
        const prior = activityWrites.get(group.id) || Promise.resolve();
        const task = prior.catch(() => {}).then(async () => {
            if (token !== epoch || owner !== account || groupById(group.id) !== group || owner !== currentAccount()) return false;
            const stagedGroup = clone(group);
            const stagedMessages = clone(rows(group));
            if (!change(stagedGroup, stagedMessages)) return false;
            const operation = walletChange ? walletChange(stagedGroup, stagedMessages) : null;
            await commitStagedReplies(group, stagedGroup, stagedMessages, undefined, operation);
            if (operation && token === epoch && owner === account && typeof wcLoadWalletData === 'function') {
                try {
                    await wcLoadWalletData();
                    if (typeof wcRenderWallet === 'function') wcRenderWallet();
                } catch (error) { console.warn('Wallet balance refresh failed after group packet:', error); }
            }
            if (token === epoch && owner === account) {
                scheduleWalletRefunds();
                if (active() === group) render(false);
                wcRenderChatList();
                const shownGame = el('wcGroupPanel')?.dataset.gameMessageId;
                if (shownGame && active() === group && groupById(group.id)) openGroupGame(shownGame);
                scheduleGroupGameBot();
            }
            return true;
        });
        activityWrites.set(group.id, task);
        task.finally(() => { if (activityWrites.get(group.id) === task) activityWrites.delete(group.id); }).catch(() => {});
        return task;
    }

    function applyCharacterReply(group, messages, member, action, visible, durable, turnId) {
        const type = String(action?.type || 'text');
        if (['text', 'voice', 'image'].includes(type)) {
            if (type !== 'text' && (typeof action.content !== 'string' || !characterActionAllowed(group, type) || !canSpeak(group, member))) return false;
            const content = String(action.content || '').trim();
            if (!content) return false;
            const reference = visible.find(item => item.id === action.replyTo && !item.recalled && item.includeInContext !== false);
            const mentions = [...new Set((Array.isArray(action.mentions) ? action.mentions : []).map(String))]
                .filter(id => id !== member.id && (id === 'all' ? ['owner', 'admin'].includes(member.role) : group.members.some(target => target.id === id)))
                .slice(0, 6);
            const media = type === 'voice' ? { isVoice: true } : type === 'image' ? {
                imageUrl: typeof window.wcGetPlaceholderImageUrl === 'function' ? window.wcGetPlaceholderImageUrl()
                    : 'https://nos.netease.com/ysf/f8351d4c8de1d1407e5044b639f6bddf.png',
                isSimulatedImage: true, imagePrompt: content
            } : {};
            publicMessage(group, member.id, content, { turnId, replyTo: reference?.id || null, mentions, ...media }, messages);
            return true;
        }
        if (type === 'sticker' && characterActionAllowed(group, 'sticker')) {
            const sticker = characterStickers(member).find(item => String(item.id) === String(action.stickerId || ''));
            if (!sticker) return false;
            publicMessage(group, member.id, '[表情] ' + String(sticker.desc || '表情包').slice(0, 120), {
                turnId, isSticker: true, stickerId: String(sticker.id), imageUrl: safeStickerUrl(sticker.url),
                mentions: [], replyTo: null
            }, messages);
            return true;
        }
        if (type === 'nudge' && characterActionAllowed(group, 'nudge')) {
            const targetId = String(action.targetMemberId || '');
            const notice = nudgeText(group, member.id, targetId);
            if (!notice || messages.some(item => item.kind === 'nudge' && item.actorMemberId === member.id && Date.now() - Number(item.createdAt) < 60000)) return false;
            publicMessage(group, 'system', notice, { kind: 'nudge', actorMemberId: member.id, targetMemberId: targetId, turnId }, messages);
            return true;
        }
        if (type === 'create_game' && characterActionAllowed(group, 'createGame')) {
            const current = groupById(group.id);
            if (!Array.isArray(action.playerIds) || !action.playerIds.includes(member.id) ||
                !current || !characterActionAllowed(current, 'createGame') ||
                action.playerIds.some(id => !canSpeak(current, current.members.find(player => player.id === id))) ||
                messages.some(item => !item.recalled && item.activity?.kind === 'game' && item.activity.status === 'playing') ||
                messages.some(item => item.turnId === turnId && item.activity)) return false;
            return Boolean(createGroupGame(group, messages, member.id, action.gameType, action.playerIds, turnId));
        }
        if (type === 'create_redpacket' && group.characterActions?.createRedPacket === true) {
            // Limit this turn to one initiated activity across all speakers.
            if (messages.some(item => item.turnId === turnId && item.activity)) return false;
            return Boolean(createRedPacket(group, messages, member.id, action, turnId));
        }
        if (type === 'claim_redpacket' && group.characterActions?.claimRedPacket !== false) {
            const source = visible.find(item => item.id === action.messageId && !item.recalled && durable.has(item.id));
            const target = source && messages.find(item => item.id === source.id);
            if (!target?.activity || target.activity.kind !== 'redpacket') return false;
            if (!activityEligible(group, target, member.id) || redPacketState(target.activity).status !== 'open' ||
                target.activity.claims.some(claim => claim.memberId === member.id)) return false;
            rememberTurnEffect(group, turnId, target);
            return claimRedPacket(group, messages, target.id, member.id, turnId);
        }
        if (type === 'create_poll' && group.characterActions?.createPoll === true) {
            if (messages.filter(item => item.turnId === turnId && item.activity).length) return false;
            return Boolean(createActivity(group, messages, member.id, 'poll', action, turnId));
        }
        if (type === 'create_relay' && group.characterActions?.createRelay === true) {
            if (messages.filter(item => item.turnId === turnId && item.activity).length) return false;
            return Boolean(createActivity(group, messages, member.id, 'relay', action, turnId));
        }
        if ((type === 'vote_poll' || type === 'join_relay') &&
            characterActionAllowed(group, type === 'vote_poll' ? 'votePoll' : 'joinRelay')) {
            const source = visible.find(item => item.id === action.messageId && !item.recalled && durable.has(item.id));
            const target = source && messages.find(item => item.id === source.id);
            if (!target?.activity || !activityEligible(group, target, member.id)) return false;
            rememberTurnEffect(group, turnId, target);
            return updateActivity(group, messages, target.id, member.id,
                type === 'vote_poll' ? 'vote' : 'join', type === 'vote_poll' ? action.optionIds : action.text, turnId);
        }
        if (type === 'reaction' && characterActionAllowed(group, 'reaction')) {
            const target = visible.find(item => item.id === action.messageId && durable.has(item.id) && !item.recalled && item.type !== 'system_event');
            const emoji = String(action.emoji || '').trim();
            if (!target || !emoji || emoji.length > 16) return false;
            const message = messages.find(item => item.id === target.id);
            if (!message || message.recalled) return false;
            rememberTurnEffect(group, turnId, message);
            return applyReaction(message, member.id, emoji);
        }
        if (type === 'recall' && characterActionAllowed(group, 'recall')) {
            const target = visible.find(item => item.id === action.messageId && durable.has(item.id) && item.senderId === member.id && !item.recalled && item.type !== 'system_event');
            const message = target && messages.find(item => item.id === target.id);
            if (!message || message.recalled) return false;
            rememberTurnEffect(group, turnId, message);
            recallGroupMessage(message);
            pruneMemories(group, messages);
            return true;
        }
        return false;
    }

    async function commitStagedReplies(group, stagedGroup, stagedMessages, signal, walletOperation = null) {
        const owner = account;
        const token = epoch;
        // A committed side-effect from a preceding speaker must survive later staged saves.
        stagedGroup.lastPrivateTriggerByContact = {
            ...(stagedGroup.lastPrivateTriggerByContact || {}),
            ...(group.lastPrivateTriggerByContact || {})
        };
        // Later speakers keep editing their draft, never the already committed live objects.
        const committedGroup = clone(stagedGroup);
        const committedMessages = clone(stagedMessages);
        await save(group, {
            replacement: { group: committedGroup, messages: committedMessages }, signal, walletOperation,
            commit: () => {
                if (token !== epoch || owner !== account || owner !== currentAccount()) return;
                conversations[group.id] = committedMessages;
                group.memberMemories = committedGroup.memberMemories;
                group.turnEffects = committedGroup.turnEffects;
                group.lastGeneratedTurnId = committedGroup.lastGeneratedTurnId;
                group.sequence = committedGroup.sequence;
                group.updatedAt = committedGroup.updatedAt;
                group.unreadCount = committedGroup.unreadCount;
            }
        });
    }

    async function sendGroupNudge(targetId) {
        const group = active();
        const sender = group?.members.find(item => item.id === USER_ID);
        if (!group || group.mode !== 'participate' || !canSpeak(group, sender)) return false;
        const notice = nudgeText(group, USER_ID, targetId);
        if (!notice) return false;
        if (requests.has(group.id)) pause();
        const token = epoch;
        const controller = new AbortController();
        const job = { controller, speaker: '', regenerating: true };
        requests.set(group.id, job);
        try {
            const stagedGroup = clone(group);
            const stagedMessages = clone(rows(group));
            publicMessage(stagedGroup, 'system', notice, { kind: 'nudge', actorMemberId: USER_ID, targetMemberId: targetId }, stagedMessages);
            await commitStagedReplies(group, stagedGroup, stagedMessages, controller.signal);
            if (token === epoch && active() === group) {
                closePanel(); render(false); wcRenderChatList();
            }
            return !controller.signal.aborted;
        } finally {
            if (requests.get(group.id) === job) requests.delete(group.id);
        }
    }

    function displayedMessageText(group, message) {
        const names = (Array.isArray(message.mentions) ? message.mentions : [])
            .map(id => id === 'all' ? '@全体成员' : group.members.find(item => item.id === id))
            .filter(Boolean).map(value => typeof value === 'string' ? value : '@' + memberName(value));
        if (message.senderId === USER_ID) return message.text;
        return names.length ? names.join(' ') + ' ' + message.text : message.text;
    }

    function closeEmojiPanel() {
        el('wcGroupEmojiPanel')?.classList.remove('show');
        el('wcGroupEmojiPanel')?.setAttribute('aria-hidden', 'true');
        el('wcGroupEmojiToggle')?.setAttribute('aria-expanded', 'false');
        el('page-group-chat')?.classList.remove('wc-group-emoji-open');
    }

    function toggleEmojiPanel() {
        const panel = el('wcGroupEmojiPanel');
        const button = el('wcGroupEmojiToggle');
        if (!active() || !panel || !button) return;
        if (panel.classList.contains('show')) { closeEmojiPanel(); return; }
        closeMorePanel();
        closeBubbleMenu();
        closeDropdown();
        el('wcGroupInput')?.blur();
        emojiSearching = false;
        emojiGroupId = 'all';
        renderGroupEmojiPanel();
        panel.classList.add('show');
        panel.setAttribute('aria-hidden', 'false');
        button.setAttribute('aria-expanded', 'true');
        el('page-group-chat')?.classList.add('wc-group-emoji-open');
        const area = el('wcGroupMessages');
        if (area) area.scrollTop = area.scrollHeight;
    }

    function renderGroupEmojiPanel() {
        const groupContainer = el('wcGroupEmojiCapsuleGroup');
        if (!groupContainer) return;
        groupContainer.replaceChildren();
        const tab = (label, value, search = false) => {
            const button = document.createElement('button');
            button.type = 'button';
            button.className = 'wc-capsule-item' + (search ? ' wc-search-trigger' : '');
            button.textContent = label;
            button.classList.toggle('active', !search && emojiGroupId === value);
            button.onclick = () => {
                if (search) {
                    emojiSearching = true;
                    el('wcGroupEmojiSearchView').classList.add('show');
                    groupContainer.style.display = 'none';
                    el('wcGroupEmojiSearchInput').value = '';
                    renderGroupEmojiContent();
                    el('wcGroupEmojiSearchInput').focus();
                } else {
                    emojiSearching = false;
                    emojiGroupId = value;
                    renderGroupEmojiPanel();
                    button.scrollIntoView?.({ block: 'nearest', inline: 'center' });
                }
            };
            groupContainer.append(button);
        };
        tab('搜索', '', true);
        tab('全部', 'all');
        tab('最近', 'recent');
        if (typeof wcEmojiGroups !== 'undefined' && Array.isArray(wcEmojiGroups)) {
            wcEmojiGroups.forEach(group => tab(String(group.name || '表情分组'), String(group.id)));
        }
        el('wcGroupEmojiSearchView').classList.toggle('show', emojiSearching);
        groupContainer.style.display = emojiSearching ? 'none' : '';
        renderGroupEmojiContent();
    }

    function renderGroupEmojiContent() {
        const content = el('wcGroupEmojiPanelContent');
        if (!content) return;
        const all = availableGroupStickers();
        const groups = typeof wcEmojiGroups !== 'undefined' && Array.isArray(wcEmojiGroups) ? wcEmojiGroups : [];
        const recent = Array.isArray(appSettings?.wc_recent_emojis) ? appSettings.wc_recent_emojis : [];
        const query = emojiSearching ? el('wcGroupEmojiSearchInput').value.trim().toLocaleLowerCase() : '';
        let selected = emojiSearching
            ? all.filter(emoji => String(emoji.desc || '').toLocaleLowerCase().includes(query))
            : emojiGroupId === 'all' ? all
                : emojiGroupId === 'recent' ? recent
                    : (groups.find(group => String(group.id) === emojiGroupId)?.emojis || []);
        selected = selected.filter(emoji => emoji && safeStickerUrl(emoji.url));
        content.replaceChildren();
        content.classList.toggle('wc-group-emoji-grid', selected.length > 0);
        if (!selected.length) {
            content.textContent = emojiSearching ? '没有找到相关表情包' : '当前暂无表情包';
            return;
        }
        selected.forEach(emoji => {
            const button = document.createElement('button');
            button.type = 'button';
            button.className = 'wc-chat-emoji-item';
            const wrap = document.createElement('div');
            wrap.className = 'wc-chat-emoji-img-wrap';
            const image = document.createElement('img');
            image.src = safeStickerUrl(emoji.url);
            image.alt = String(emoji.desc || '表情包');
            image.loading = 'lazy';
            wrap.append(image);
            const caption = document.createElement('div');
            caption.className = 'wc-chat-emoji-desc';
            caption.textContent = String(emoji.desc || '表情包');
            button.append(wrap, caption);
            button.onclick = () => sendGroupSticker(emoji).catch(report);
            content.append(button);
        });
    }

    async function sendGroupSticker(emoji) {
        const group = active();
        if (!group || group.mode !== 'participate' || !canSpeak(group, group.members.find(member => member.id === USER_ID))) {
            toast('当前不能发送群消息');
            return;
        }
        // Resolve the URL against the current library, rather than trusting HTML parameters.
        const registered = availableGroupStickers().find(item => String(item.id) === String(emoji.id) && String(item.url) === String(emoji.url));
        const url = registered ? safeStickerUrl(registered.url) : '';
        if (!url) { toast('这个表情包已失效，请重新选择'); renderGroupEmojiContent(); return; }
        if (requests.has(group.id)) pause();
        const token = epoch;
        const description = String(registered.desc || '表情包').slice(0, 120);
        publicMessage(group, USER_ID, `[表情] ${description}`, {
            isSticker: true, stickerId: String(registered.id), imageUrl: url,
            replyTo: replyId || null, mentions: []
        });
        replyId = '';
        closeEmojiPanel();
        render();
        await save(group);
        if (token === epoch) wcRenderChatList();
        const recent = Array.isArray(appSettings.wc_recent_emojis) ? appSettings.wc_recent_emojis : [];
        appSettings.wc_recent_emojis = [registered, ...recent.filter(item => String(item.id) !== String(registered.id))].slice(0, 20);
        if (typeof saveAppSettings === 'function') saveAppSettings();
    }

    function closeMorePanel() {
        const more = el('wcGroupMorePanel');
        const trigger = el('wcGroupMoreToggle');
        more?.classList.remove('show');
        more?.setAttribute('aria-hidden', 'true');
        el('page-group-chat')?.classList.remove('wc-group-tools-open');
        trigger?.setAttribute('aria-expanded', 'false');
    }

    function toggleMorePanel() {
        const more = el('wcGroupMorePanel');
        const trigger = el('wcGroupMoreToggle');
        if (!active() || !more || !trigger) return;
        const opening = !more.classList.contains('show');
        if (!opening) { closeMorePanel(); return; }
        closeDropdown();
        closeEmojiPanel();
        el('wcGroupInput')?.blur();
        more.classList.add('show');
        more.setAttribute('aria-hidden', 'false');
        el('page-group-chat')?.classList.add('wc-group-tools-open');
        trigger.setAttribute('aria-expanded', 'true');
        const area = el('wcGroupMessages');
        if (area) area.scrollTop = area.scrollHeight;
    }


    // The original Contacts source menu is private to its editor. Reuse its two menu
    // buttons without altering Contacts data or single-chat presentation.
    function prepareAvatarSourceMenu() {
        const container = el('wcGroupAvatarSourceItems');
        if (!container || container.dataset.ready) return;
        const reference = document.getElementById('ctContactAvatarMenu');
        const buttons = reference ? [...reference.querySelectorAll('.ct-avatar-menu-item')].slice(0, 2) : [];
        if (buttons.length === 2) {
            container.replaceChildren(...buttons.map((item, index) => {
                const clone = item.cloneNode(true);
                clone.removeAttribute('data-action');
                clone.dataset.groupAvatarSource = index === 0 ? 'file' : 'url';
                return clone;
            }));
        } else {
            container.innerHTML = `<button class="ct-avatar-menu-item" type="button" data-group-avatar-source="file">${GROUP_ICON_MARKUP.photo}<span>照片图库</span></button><button class="ct-avatar-menu-item" type="button" data-group-avatar-source="url">${GROUP_ICON_MARKUP.link}<span>使用 URL</span></button>`;
        }
        container.dataset.ready = '1';
    }

    function closeAvatarSourceMenu() {
        const overlay = el('wcGroupAvatarMenuOverlay');
        if (overlay) overlay.hidden = true;
    }

    function openAvatarSourceMenu(trigger, apply, existing = '', title = '修改群头像') {
        const overlay = el('wcGroupAvatarMenuOverlay');
        const menu = el('wcGroupAvatarSourceItems');
        const root = el('wcGroupPanel');
        if (!trigger || !overlay || !menu || !root) return;
        prepareAvatarSourceMenu();
        const box = root.getBoundingClientRect();
        const rect = trigger.getBoundingClientRect();
        const width = 240;
        const height = 116;
        const left = Math.max(12, Math.min(rect.left - box.left + (rect.width - width) / 2, box.width - width - 12));
        const top = rect.bottom - box.top + height + 12 > box.height - 12
            ? rect.top - box.top - height - 9 : rect.bottom - box.top + 9;
        menu.style.left = Math.max(12, left) + 'px';
        menu.style.top = Math.max(12, top) + 'px';
        avatarChoiceApply = apply;
        avatarChoiceExisting = existing;
        avatarChoiceTitle = title;
        ++avatarChoiceVersion;
        overlay.hidden = false;
    }

    async function pickAvatarSource(action) {
        const apply = avatarChoiceApply;
        const previous = avatarChoiceExisting;
        const version = avatarChoiceVersion;
        closeAvatarSourceMenu();
        if (!apply) return;
        if (action === 'file') {
            const input = el('wcGroupAvatarFilePicker');
            if (!input) return;
            input.value = '';
            input.click();
        } else if (action === 'url') {
            const text = await showCustomPrompt(avatarChoiceTitle, {
                type: 'url', placeholder: '输入图片 URL',
                value: previous.startsWith('https://') || previous.startsWith('http://') ? previous : ''
            }, '确定');
            if (text === null || version !== avatarChoiceVersion || el('wcGroupPanel')?.hidden) return;
            const value = safeImage(text);
            if (!value) return toast('请输入有效的图片 URL');
            apply(value);
        }
    }

    function bindAvatarSourceMenu() {
        const overlay = el('wcGroupAvatarMenuOverlay');
        if (!overlay) return;
        overlay.addEventListener('click', event => {
            const item = event.target.closest('[data-group-avatar-source]');
            if (item) { pickAvatarSource(item.dataset.groupAvatarSource).catch(report); return; }
            if (event.target === overlay) closeAvatarSourceMenu();
        });
        el('wcGroupAvatarFilePicker').addEventListener('change', async event => {
            const input = event.currentTarget;
            const file = input.files?.[0];
            if (!file) return;
            const apply = avatarChoiceApply;
            const version = avatarChoiceVersion;
            if (!file.type.startsWith('image/')) return toast('请选择图片');
            try {
                const encoded = await new Promise((resolve, reject) => {
                    const reader = new FileReader();
                    reader.onload = () => resolve(reader.result);
                    reader.onerror = () => reject(new Error('图片读取失败'));
                    reader.readAsDataURL(file);
                });
                if (version !== avatarChoiceVersion || el('wcGroupPanel')?.hidden) return;
                if (apply) apply(encoded);
            } catch (error) { report(error); }
            finally { input.value = ''; }
        });
        document.addEventListener('keydown', event => {
            if (event.key === 'Escape') closeAvatarSourceMenu();
        });
    }

    function field(label, name, value = '', textarea = false) {
        return `<label class="wc-group-field"><span>${escape(label)}</span>${textarea ? `<textarea name="${name}" rows="3">${escape(value)}</textarea>` : `<input name="${name}" value="${escape(value)}" maxlength="${name === 'avatar' || name === 'background' ? '3000' : '100'}">`}</label>`;
    }

    function memberChoices(candidates) {
        const choice = member => `<label class="wc-group-check wc-group-member-choice">
            <input type="checkbox" name="member" value="${escape(member.id)}">
            <span class="wc-group-choice-avatar" data-choice-avatar-id="${escape(member.id)}"></span>
            <span class="wc-group-choice-copy"><strong>${escape(member.displayName || member.name)}</strong><small>${member.kind === 'npc' ? 'NPC · ' + escape(member.sourceContactName || '角色联系人') : '微信角色'}</small></span>
            <span class="wc-group-choice-tick" aria-hidden="true"></span>
        </label>`;
        const characters = candidates.filter(member => member.kind !== 'npc');
        const sections = characters.length ? `<div class="wc-group-section-title">微信角色</div>${characters.map(choice).join('')}` : '';
        const npcParents = new Map();
        candidates.filter(member => member.kind === 'npc').forEach(member => {
            if (!npcParents.has(member.sourceContactId)) npcParents.set(member.sourceContactId, []);
            npcParents.get(member.sourceContactId).push(member);
        });
        return sections + [...npcParents.values()].map(members => `<div class="wc-group-section-title">${escape(members[0].sourceContactName)}的 NPC</div>${members.map(choice).join('')}`).join('');
    }

    function renderChoiceAvatars(candidates) {
        const candidatesById = new Map(candidates.map(member => [String(member.id), member]));
        el('wcGroupPanelBody').querySelectorAll('[data-choice-avatar-id]').forEach(slot => {
            const member = candidatesById.get(slot.dataset.choiceAvatarId);
            if (member) slot.replaceChildren(avatarNode(member.avatar, member.displayName || member.name, 'wc-group-choice-photo'));
        });
    }

    async function create() {
        await load();
        const token = epoch;
        const candidates = wcGetGroupMemberCandidates(await wcReadLayoutRecord('contactsAppData'));
        if (token !== epoch) return;
        if (typeof wcCloseAddFriendPanel === 'function') wcCloseAddFriendPanel();
        let selectedAvatar = '';
        panel('创建群聊', `<form id="wcGroupCreateForm" class="wc-group-create-form">
            <div class="wc-group-create-intro"><button type="button" class="wc-group-create-avatar" id="wcGroupCreatePreview" aria-label="设置群头像">群</button><strong>新的群聊</strong><span>选择聊天方式，邀请角色加入</span></div>
            <div class="wc-group-section-title">聊天方式</div>
            <div class="wc-group-mode-options" role="radiogroup" aria-label="聊天方式">
                <label class="wc-group-mode-option"><input type="radio" name="mode" value="participate" checked><span class="wc-group-mode-copy"><strong>一起聊天</strong><small>我也参与群聊</small></span><span class="wc-group-mode-dot" aria-hidden="true"></span></label>
                <label class="wc-group-mode-option"><input type="radio" name="mode" value="observe"><span class="wc-group-mode-copy"><strong>旁观模式</strong><small>只有角色在群里聊天</small></span><span class="wc-group-mode-dot" aria-hidden="true"></span></label>
            </div>
            <div class="wc-group-section-title">群资料</div>
            <div class="wc-group-create-card">
                ${field('群名称', 'name')}
                ${field('群简介（选填）', 'description', '', true)}${field('群背景与成员关系（选填）', 'background', '', true)}
            </div>
            <div class="wc-group-section-title">邀请成员</div>
            <p class="wc-group-hint wc-group-create-hint">至少选择 2 位角色或 NPC，NPC 可以单独入群。</p>
            <div class="wc-group-members">${memberChoices(candidates) || '<p class="wc-group-hint">请先添加微信好友，或在角色联系人里创建 NPC。</p>'}</div>
            <div class="wc-group-create-submit"><span id="wcGroupSelectedCount" aria-live="polite">至少选择 2 位成员</span><button class="wc-group-primary" type="submit">创建群聊</button></div>
        </form>`, 'create');
        renderChoiceAvatars(candidates);
        const form = el('wcGroupCreateForm');
        const count = el('wcGroupSelectedCount');
        const createButton = form.querySelector('button[type="submit"]');
        const preview = el('wcGroupCreatePreview');
        preview.onclick = () => openAvatarSourceMenu(preview, value => { selectedAvatar = value; updateCount(); }, selectedAvatar);
        const candidatesById = new Map(candidates.map(member => [String(member.id), member]));
        const updateCount = () => {
            const selected = form.querySelectorAll('input[name="member"]:checked').length;
            count.textContent = selected >= 2 ? `已选择 ${selected} 位成员` : `已选择 ${selected} 位 · 至少选择 2 位`;
            createButton.disabled = selected < 2;
            const chosen = [...form.querySelectorAll('input[name="member"]:checked')].map(input => candidatesById.get(input.value)).filter(Boolean);
            if (chosen.length || selectedAvatar) preview.replaceChildren(groupAvatar({ name: '新群聊', members: chosen, avatar: selectedAvatar }));
            else preview.textContent = '群';
        };
        form.addEventListener('change', updateCount);
        updateCount();
        form.onsubmit = event => { event.preventDefault(); submitCreate(event.currentTarget, selectedAvatar).catch(report); };
    }

    async function submitCreate(form, selectedAvatar = '') {
        if (creating) return;
        creating = true;
        try {
            const token = epoch;
            const data = new FormData(form);
            const ids = [...new Set(data.getAll('member'))];
            const candidates = wcGetGroupMemberCandidates(await wcReadLayoutRecord('contactsAppData'));
            if (token !== epoch) return;
            const contacts = ids.map(id => candidates.find(contact => contact.id === id)).filter(Boolean);
            if (contacts.length !== ids.length) throw new Error('所选成员资料已变更，请重新选择');
            if (contacts.length < 2) throw new Error('请选择至少两位角色或 NPC');
            const name = String(data.get('name') || '').trim();
            if (!name) throw new Error('请填写群名称');
            const mode = data.get('mode');
            const now = Date.now();
            const group = normalizeGroup({
                id: `group_${uid()}`, name, avatar: selectedAvatar, description: String(data.get('description') || '').trim(),
                background: String(data.get('background') || '').trim(), mode, createdAt: now, updatedAt: now,
                autoRounds: 5, historyVisible: false, showTitles: true, members: contacts.map((contact, index) => ({
                    id: contact.id, kind: contact.kind, sourceContactId: contact.sourceContactId, sourceNpcId: contact.sourceNpcId, parentWechatId: contact.parentWechatId,
                    sourceContactName: contact.sourceContactName, name: contact.name, avatar: contact.avatar || '', nickname: '', title: '',
                    role: mode === 'observe' && index === 0 ? 'owner' : 'member', joinedAt: now, historyFromSequence: 0
                }))
            });
            if (mode === 'participate') group.members.unshift({ id: USER_ID, name: appSettings.wc_current_user_name || '我', avatar: appSettings.wc_current_user_avatar || '', role: 'owner', joinedAt: now, historyFromSequence: 0 });
            if (token !== epoch) return;
            groups.push(group);
            conversations[group.id] = [];
            operationNotice(group, `${operatorName(group)}创建了群聊“${group.name}”，${contacts.map(memberName).join('、')}加入了群聊`);
            try { await save(group); } catch (error) { groups = groups.filter(item => item !== group); delete conversations[group.id]; throw error; }
            if (token !== epoch) return;
            closePanel();
            await open(group.id);
            wcRenderChatList();
        } finally { creating = false; }
    }

    function safeImage(value) {
        const source = String(value || '').trim();
        if (!source) return '';
        try { const url = new URL(source); return ['https:', 'http:', 'blob:'].includes(url.protocol) ? source : ''; } catch { return ''; }
    }

    async function open(id) {
        window.wcCloseGroupImageViewer?.();
        closeGroupMedia();
        await load();
        const group = groupById(id);
        if (!group || group.archived) return;
        returnPageId = el('page-contacts')?.classList.contains('active') ? 'page-contacts' : 'page-chat-list';
        pause();
        closePanel();
        closeSpeakerPanel();
        closeMorePanel();
        closeEmojiPanel();
        closeBubbleMenu();
        closeGroupMessageEditor();
        closeDropdown();
        // Close the single chat through its own cleanup path before showing a group.
        if (el('page-chat-room')?.classList.contains('active')) wcCloseChat();
        wcCurrentChatContactId = null;
        activeId = id;
        groupSelectionMode = false;
        selectedGroupMessages.clear();
        el('page-group-chat')?.classList.remove('group-selecting');
        if (el('wcGroupBatchBar')) el('wcGroupBatchBar').hidden = true;
        if (el('wcGroupBatchHeader')) el('wcGroupBatchHeader').hidden = true;
        replyId = '';
        renderLimit = 80;
        el('wcGroupInput').value = '';
        resetMentions();
        document.querySelectorAll('#wechatAppUI .page').forEach(page => page.classList.remove('active'));
        el('page-group-chat').classList.add('active');
        document.querySelector('#wechatAppUI .bottom-nav-wrapper').style.display = 'none';
        group.unreadCount = 0;
        await save(group, { skipAutoBackup: true });
        if (activeId !== id || account !== currentAccount()) return;
        await settleExpiredGroupPackets(group);
        if (activeId !== id || account !== currentAccount()) return;
        render();
        wcScheduleChatViewportSync();
        wcRenderChatList();
        scheduleGroupGameBot();
    }

    function close() {
        window.wcCloseGroupImageViewer?.();
        closeGroupMedia();
        pause();
        closeSpeakerPanel();
        if (gameBotTimer !== null) clearTimeout(gameBotTimer);
        gameBotTimer = null;
        closePanel();
        closeMorePanel();
        closeEmojiPanel();
        closeBubbleMenu();
        closeGroupMessageEditor();
        closeGroupReplyPreview();
        closeDropdown();
        el('page-wc-group-search')?.classList.remove('active');
        el('page-group-chat')?.classList.remove('active');
        el(returnPageId)?.classList.add('active');
        const nav = document.querySelector('#wechatAppUI .bottom-nav-wrapper');
        if (nav) nav.style.display = 'block';
        activeId = '';
        applyGroupQqTheme(null);
        wcgActiveThemeScript = '';
        el('wc-group-theme-script')?.remove();
        if (el('wc-group-dynamic-theme-style')) el('wc-group-dynamic-theme-style').textContent = '';
        groupSelectionMode = false;
        selectedGroupMessages.clear();
        el('page-group-chat')?.classList.remove('group-selecting');
        if (el('wcGroupBatchBar')) el('wcGroupBatchBar').hidden = true;
        if (el('wcGroupBatchHeader')) el('wcGroupBatchHeader').hidden = true;
        replyId = '';
        resetMentions();
        if (returnPageId === 'page-contacts' && typeof wcRenderContactList === 'function') wcRenderContactList();
        else wcRenderChatList();
    }

    function closeGroupReplyPreview() {
        el('wcGroupReplyOverlay')?.classList.remove('show');
        const floatBox = el('wcGroupReplyFloatBubbleBox');
        if (floatBox) {
            floatBox.classList.remove('show');
            floatBox.replaceChildren();
            floatBox.style.top = '';
        }
        const input = el('wcGroupInput');
        if (input) input.placeholder = '发送群消息';
    }

    function showGroupReplyPreview(group, message, focusInput = true) {
        const room = el('page-group-chat');
        const overlay = el('wcGroupReplyOverlay');
        const floatBox = el('wcGroupReplyFloatBubbleBox');
        const area = el('wcGroupMessages');
        if (!room || !overlay || !floatBox || !area) return;
        const original = [...area.children].find(node => node.dataset.messageId === message.id);
        // Clone the existing group bubble so the highlighted message matches its appearance.
        const preview = (original || messageNode(group, message)).cloneNode(true);
        // A standalone preview has no neighboring messages in its original group.
        setGroupMessageIdentity(preview, message);
        preview.querySelectorAll('.message-bubble').forEach(node => setGroupMessageIdentity(node, message));
        // The snapshot is visual only; do not duplicate control IDs or focusable actions.
        preview.querySelectorAll('[id]').forEach(node => node.removeAttribute('id'));
        preview.querySelectorAll('button, input, select, textarea, a').forEach(node => {
            node.tabIndex = -1;
            if ('disabled' in node) node.disabled = true;
        });
        floatBox.replaceChildren(preview);
        floatBox.classList.add('show');
        const roomRect = room.getBoundingClientRect();
        const sourceRect = original?.getBoundingClientRect();
        const floatHeight = floatBox.getBoundingClientRect().height;
        const targetTop = sourceRect ? sourceRect.top - roomRect.top : roomRect.height * .35;
        const maxTop = Math.max(12, roomRect.height - floatHeight - 94);
        floatBox.style.top = Math.max(12, Math.min(targetTop, maxTop)) + 'px';
        overlay.classList.add('show');
        const input = el('wcGroupInput');
        if (input) {
            input.placeholder = '回复：' + (message.senderId === USER_ID ? '自己' : message.senderName);
            if (focusInput) input.focus();
        }
    }

    function renderHeader(group) {
        refreshMemberAvatars(group);
        applyAppearance(group);
        el('wcGroupRoomName').textContent = `${group.name}（${group.members.length}）`;
        const pending = requests.get(group.id);
        el('wcGroupRoomStatus').textContent = pending?.speaker ? `${pending.speaker}正在输入…` : group.mode === 'observe' ? '旁观模式' : '群聊';
        el('wcGroupRoomAvatar').replaceChildren(groupAvatar(group));
        el('wcGroupCompose').hidden = group.mode === 'observe';
        el('wcGroupMentionButton').hidden = group.mode === 'observe';
        for (const id of ['wcGroupVoiceButton', 'wcGroupImageButton', 'wcGroupPhotoButton']) {
            const button = el(id);
            if (button) {
                button.hidden = group.mode === 'observe';
                button.disabled = !canSpeak(group, group.members.find(member => member.id === USER_ID));
            }
        }
        const continueButton = el('wcGroupContinue');
        const generated = rows(group).some(message => message.type !== 'system_event');
        const actionLabel = pending ? '停止生成' : generated ? '继续生成' : '开始生成';
        continueButton.title = actionLabel;
        continueButton.setAttribute('aria-label', actionLabel);
        continueButton.classList.toggle('is-generating', Boolean(pending));
        el('wcGroupContinueText').textContent = actionLabel;
        el('wcGroupAuto').querySelector('.wc-function-text').textContent = autoSession?.id === group.id ? '暂停自动聊' : '自动聊';
        el('wcGroupGuide').hidden = !canManage(group);
        if (!replyId) closeGroupReplyPreview();
        const announcement = String(group.announcement || '');
        el('wcGroupAnnouncement').textContent = announcement;
        el('wcGroupAnnouncement').hidden = !announcement || group.announcementPinned === false;
        el('wcGroupAnnouncement').title = '群公告';
    }

    function titleTag(text, kind) {
        const badge = document.createElement('span');
        badge.className = 'wc-group-title-tag';
        badge.dataset.kind = kind;
        badge.textContent = text;
        badge.title = text;
        return badge;
    }

    function appendTitleTags(container, member, overrideTitle) {
        if (member.role === 'owner') container.append(titleTag('群主', 'owner'));
        else if (member.role === 'admin') container.append(titleTag('管理员', 'admin'));
        const special = String(overrideTitle ?? member.title ?? '').trim();
        if (special) container.append(titleTag(special, 'special'));
    }

    function clearBubblePress() {
        if (bubblePressTimer !== null) clearTimeout(bubblePressTimer);
        bubblePressTimer = null;
    }

    // Touch/pen hold opens the original single-chat-style action sheet.
    // Scrolling cancels the timer, and a normal tap no longer opens a modal.
    function bindBubbleLongPress(bubble, id) {
        let start = null;
        let suppressNextClick = false;
        bubble.addEventListener('click', event => {
            if (!suppressNextClick) return;
            suppressNextClick = false;
            event.preventDefault();
            event.stopImmediatePropagation();
        }, true);
        bubble.addEventListener('pointerdown', event => {
            if (event.pointerType === 'mouse' || event.button !== 0) return;
            clearBubblePress();
            suppressNextClick = false;
            start = { x: event.clientX, y: event.clientY };
            bubblePressTimer = setTimeout(() => {
                bubblePressTimer = null;
                if (start && active()?.id === activeId && !groupSelectionMode) {
                    suppressNextClick = true;
                    openBubbleMenu(id, bubble);
                }
                start = null;
            }, 480);
        }, { passive: true });
        bubble.addEventListener('pointermove', event => {
            if (start && (Math.abs(event.clientX - start.x) > 9 || Math.abs(event.clientY - start.y) > 9)) {
                start = null;
                clearBubblePress();
            }
        }, { passive: true });
        ['pointerup', 'pointercancel', 'pointerleave'].forEach(type => bubble.addEventListener(type, () => {
            start = null; clearBubblePress();
        }, { passive: true }));
        bubble.addEventListener('contextmenu', event => {
            event.preventDefault();
            start = null;
            clearBubblePress();
            suppressNextClick = true;
            if (!groupSelectionMode) openBubbleMenu(id, bubble);
        });
    }

    function preserveDeletedGroupRecord(message) {
        return activityMustStay(message) || message.activity?.kind === 'game';
    }

    function groupSelectableMessages(group) {
        // Any visible message may be selected, like in private chat.
        return rows(group).filter(message => !message.hiddenForUser &&
            (message.type !== 'system_event' || message.recalled));
    }

    function updateGroupSelectionBar() {
        const bar = el('wcGroupBatchBar');
        if (!bar) return;
        bar.hidden = !groupSelectionMode;
        el('wcGroupBatchCount').textContent = selectedGroupMessages.size;
        if (el('wcGroupBatchHeader')) el('wcGroupBatchHeader').hidden = !groupSelectionMode;
        const selected = selectedGroupMessages.size;
        el('wcGroupBatchDelete').disabled = selected === 0;
        el('wcGroupBatchForward').disabled = selected === 0;
        const group = active();
        const current = selected === 1 && group
            ? rows(group).find(message => selectedGroupMessages.has(message.id)) : null;
        el('wcGroupBatchDebug').disabled = !current ||
            !(current.senderId === USER_ID || canManage(group));
    }

    function exitGroupSelection() {
        groupSelectionMode = false;
        selectedGroupMessages.clear();
        el('page-group-chat')?.classList.remove('group-selecting');
        updateGroupSelectionBar();
        if (active()) render(false);
    }

    function enterGroupSelection(id) {
        const group = active();
        if (!group || !groupSelectableMessages(group).some(message => message.id === id)) return;
        closeBubbleMenu();
        closeGroupMessageEditor();
        groupSelectionMode = true;
        selectedGroupMessages.clear();
        selectedGroupMessages.add(id);
        el('page-group-chat')?.classList.add('group-selecting');
        updateGroupSelectionBar();
        render(false);
    }

    function toggleGroupSelection(id) {
        const group = active();
        if (!groupSelectionMode || !group || !groupSelectableMessages(group).some(message => message.id === id)) return;
        if (selectedGroupMessages.has(id)) selectedGroupMessages.delete(id);
        else selectedGroupMessages.add(id);
        updateGroupSelectionBar();
        render(false);
    }

    function debugSelectedGroupMessage() {
        const group = active();
        if (!group || selectedGroupMessages.size !== 1) {
            toast(selectedGroupMessages.size ? '调试编辑一次只能选择一条消息' : '请先选择一条消息');
            return;
        }
        const id = [...selectedGroupMessages][0];
        const message = rows(group).find(item => item.id === id);
        if (!message || !(message.senderId === USER_ID || canManage(group)))
            return toast('这条消息没有调试编辑权限');
        exitGroupSelection();
        openGroupMessageEditor(id);
    }

    function forwardSelectedGroupMessages() {
        const group = active();
        if (!group || !selectedGroupMessages.size) return toast('请先选择消息');
        const selected = rows(group).filter(message => selectedGroupMessages.has(message.id));
        if (!selected.length) return;
        if (typeof window.wcForwardPreparedChatRecord !== 'function')
            return toast('转发功能尚未就绪，请稍后重试');
        const records = selected.map(message => {
            const date = new Date(Number(message.createdAt) || Date.now());
            const stamp = date.toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' });
            const author = String(message.senderName || (
                message.senderId === USER_ID ? '我' : '群成员')).replace(/[|:\n\r]/g, ' ');
            const activity = message.activity;
            let content = activity?.kind === 'redpacket'
                ? '[红包] ' + (activity.greeting || '恭喜发财，大吉大利')
                : activity?.kind === 'game' ? '[群游戏] ' + (activity.customTitle || message.text || '')
                : activity?.kind === 'poll' ? '[群投票] ' + (activity.title || message.text || '')
                : activity?.kind === 'relay' ? '[群接龙] ' + (activity.title || message.text || '')
                : message.isVoice ? '[语音] ' + (message.text || '')
                : message.isSticker ? '[表情包] ' + (message.text || '')
                : String(message.text || (message.imageUrl ? '[图片]' : '[消息]'));
            content = String(content).replace(/[\r\n]+/g, ' ').trim();
            return author + '|' + stamp + ': ' + content;
        });
        // Forward a chat record preview, never duplicate a wallet or game activity.
        const payload = '[聊天记录] ' + String(group.name || '群聊') +
            '的聊天记录\n' + records.join('\n');
        window.wcForwardPreparedChatRecord(payload, () => {
            if (active() === group) exitGroupSelection();
        });
    }

    // Financially settled packets and participated activities retain their durable
    // ledger/game records. Deleting them hides the message and removes it from AI context.
    async function deleteGroupMessages(ids) {
        const group = active();
        if (!group || !Array.isArray(ids)) return false;
        const selected = [...new Set(ids)].filter(id => groupSelectableMessages(group).some(message => message.id === id));
        if (!selected.length) return false;
        const protectedCount = selected.filter(id => preserveDeletedGroupRecord(rows(group).find(message => message.id === id))).length;
        const explanation = '确定删除选中的 ' + selected.length + ' 条消息吗？' +
            (protectedCount ? '\n其中 ' + protectedCount + ' 条涉及红包账目或已参与活动，将从聊天中隐藏并排除 AI 上下文，保留结算记录。' : '');
        if (!await showCustomConfirm('删除消息', explanation, '删除', true)) return false;
        if (active() !== group) return false;
        const toRemove = new Set(selected);
        const done = await transactActivity((draft, messages) => {
            let changed = false;
            for (let index = messages.length - 1; index >= 0; index--) {
                const message = messages[index];
                if (!toRemove.has(message.id)) continue;
                if (preserveDeletedGroupRecord(message)) {
                    message.hiddenForUser = true;
                    message.includeInContext = false;
                } else messages.splice(index, 1);
                invalidateEditedGroupMemories(draft, message.id);
                changed = true;
            }
            if (!changed) return false;
            pruneMemories(draft, messages);
            draft.summaryChunks = (draft.summaryChunks || []).filter(chunk =>
                !(chunk.sourceIds || []).some(id => toRemove.has(id)));
            return true;
        }, null, group);
        if (!done || active() !== group) return false;
        invalidateGroupSummarySources(group, selected);
        if (selected.includes(replyId)) { replyId = ''; closeGroupReplyPreview(); }
        exitGroupSelection();
        wcRenderChatList();
        toast(selected.length + ' 条消息已删除');
        return true;
    }

    function closeBubbleMenu() {
        clearBubblePress();
        const overlay = el('wcGroupBubbleMenuOverlay');
        overlay?.classList.remove('show');
        overlay?.setAttribute('aria-hidden', 'true');
        bubbleMenuMessageId = '';
        el('wcGroupBubbleEmojiCapsule')?.classList.remove('expanded');
        el('wcGroupBubbleMenuContainer')?.classList.remove('emoji-expanded');
        el('wcGroupMessages')?.querySelectorAll('.highlighted-bubble').forEach(row => row.classList.remove('highlighted-bubble'));
    }

    function openBubbleMenu(id, target) {
        const group = active();
        const message = group && rows(group).find(item => item.id === id);
        if (!message || groupSelectionMode || message.hiddenForUser || (message.type === 'system_event' && !message.recalled)) return;
        if (bubbleMenuMessageId === id && el('wcGroupBubbleMenuOverlay')?.classList.contains('show')) return;
        closeMorePanel();
        closeEmojiPanel();
        closeDropdown();
        closeBubbleMenu();
        bubbleMenuMessageId = id;
        const overlay = el('wcGroupBubbleMenuOverlay');
        const menu = el('wcGroupBubbleMenuContainer');
        const capsule = el('wcGroupBubbleEmojiCapsule');
        capsule.classList.remove('expanded');
        menu.classList.remove('emoji-expanded');
        capsule.style.display = message.recalled ? 'none' : '';
        const manageable = canManage(group);
        const owned = message.senderId === USER_ID;
        menu.querySelectorAll('[data-group-menu-action]').forEach(button => {
            const action = button.dataset.groupMenuAction;
            const allowed = ({
                reply: !message.recalled && group.mode === 'participate',
                favorite: !message.recalled,
                essential: !message.recalled && manageable,
                rewind: !message.recalled && manageable,
                edit: (owned || manageable),
                recall: !message.recalled && (owned || manageable) && !activityMustStay(message),
                select: true,
                delete: (owned || manageable)
            })[action];
            button.hidden = !allowed;
            if (action === 'essential') button.lastElementChild.textContent = message.essential ? '取消精华' : '设为精华';
            if (action === 'favorite') button.lastElementChild.textContent = (wcIsGroupMessageFavorite(group.id, message.id) ?? message.favorite) ? '取消收藏' : '收藏';
        });
        const row = target.closest('.message-row');
        if (row) row.classList.add('highlighted-bubble');
        overlay.classList.add('show');
        overlay.setAttribute('aria-hidden', 'false');
        const rect = row?.getBoundingClientRect() || target.getBoundingClientRect();
        const surface = overlay.getBoundingClientRect();
        const menuWidth = menu.offsetWidth || 260;
        const menuHeight = menu.offsetHeight || 300;
        const padding = 12;
        const gap = 10;
        const above = rect.top - surface.top - padding;
        const below = surface.bottom - rect.bottom - padding;
        const placeBelow = above < menuHeight + gap && below > above;
        menu.style.flexDirection = placeBelow ? 'column-reverse' : 'column';
        const first = menu.querySelector('.wc-bubble-emojis-tail-1');
        const second = menu.querySelector('.wc-bubble-emojis-tail-2');
        for (const [tail, offset] of [[first, 6], [second, 14]]) {
            if (!tail) continue;
            tail.style.top = placeBelow ? `-${offset}px` : 'auto';
            tail.style.bottom = placeBelow ? 'auto' : `-${offset}px`;
        }
        const targetY = placeBelow
            ? rect.bottom - surface.top + gap
            : rect.top - surface.top - menuHeight - gap;
        const targetX = rect.right - surface.left - menuWidth;
        const maxY = Math.max(padding, surface.height - menuHeight - padding);
        const maxX = Math.max(padding, surface.width - menuWidth - padding);
        menu.style.top = Math.max(padding, Math.min(targetY, maxY)) + 'px';
        menu.style.left = Math.max(padding, Math.min(targetX, maxX)) + 'px';
    }

    function toggleBubbleReactions(expanded) {
        el('wcGroupBubbleEmojiCapsule')?.classList.toggle('expanded', expanded);
        el('wcGroupBubbleMenuContainer')?.classList.toggle('emoji-expanded', expanded);
    }

    function renderReactionChips(body, message) {
        const reactions = Array.isArray(message.reactions)
            ? message.reactions.filter(item => item && typeof item === 'object' && item.emoji)
            : [];
        if (!reactions.length) return;
        const holder = document.createElement('div');
        holder.className = 'wc-group-reaction-badges';
        reactions.slice(0, 8).forEach(reaction => {
            const button = document.createElement('button');
            button.type = 'button';
            button.textContent = reaction.emoji;
            button.title = '点击回应 · ' + memberName(groupById(activeId)?.members.find(member => member.id === (reaction.userId || reaction.memberId)));
            button.onclick = event => { event.stopPropagation(); reactToMessage(message.id, reaction.emoji).catch(report); };
            holder.append(button);
        });
        body.append(holder);
    }

    async function reactToMessage(id, emoji) {
        const group = active();
        const message = group && rows(group).find(item => item.id === id);
        if (!message || group.mode !== 'participate' || !canSpeak(group, group.members.find(item => item.id === USER_ID))) return;
        const previous = clone(message.reactions || []);
        if (!applyReaction(message, USER_ID, emoji)) return;
        closeBubbleMenu();
        const token = epoch;
        try { await save(group); }
        catch (error) { message.reactions = previous; throw error; }
        if (token === epoch && active() === group) render(false);
    }

    // Adapt the private chat's message editor rather than putting one more generic
    // prompt on top of group chat. Sender IDs must stay member IDs for AI context.
    const GROUP_EDIT_FORMATS = new Set(['text', 'translation', 'voice', 'emoji', 'redpacket', 'image', 'action', 'other']);
    const GROUP_EDIT_LABELS = {
        text: '消息文本', translation: '原语言', voice: '语音内容',
        emoji: '表情包描述', redpacket: '红包祝福语', image: '图片描述',
        action: '动描内容', other: '特殊消息内容'
    };

    function inferGroupMessageFormat(message) {
        if (message?.activity?.kind === 'redpacket') return 'redpacket';
        if (message?.activity) return 'text';
        if (message?.isSticker) return 'emoji';
        if (GROUP_EDIT_FORMATS.has(message?.groupFormat)) return message.groupFormat;
        if (message?.translation) return 'translation';
        if (message?.isVoice) return 'voice';
        if (message?.isAction) return 'action';
        if (message?.imageUrl) return 'image';
        if (/^\s*(?:\[红包\]|【红包】|红包\s*[:：])/.test(message?.text || '')) return 'redpacket';
        if (message?.fileAttachment) return 'other';
        return 'text';
    }

    function groupEditableDate(timestamp) {
        const date = new Date(Number(timestamp) || Date.now());
        const pad = num => String(num).padStart(2, '0');
        return date.getFullYear() + '-' + pad(date.getMonth() + 1) + '-' + pad(date.getDate())
            + 'T' + pad(date.getHours()) + ':' + pad(date.getMinutes());
    }

    function closeGroupMessageEditor() {
        const overlay = el('wcGroupEditMsgOverlay');
        if (!overlay) return;
        overlay.classList.remove('show');
        overlay.style.display = 'none';
        overlay.setAttribute('aria-hidden', 'true');
        editMessageId = '';
        editGroupId = '';
    }

    function setGroupEditRole(role) {
        const group = active();
        if (!group || editGroupId !== group.id) return;
        const manageable = canManage(group);
        const userExists = group.members.some(member => member.id === USER_ID);
        if (role === 'user' && !userExists) return;
        if (role !== 'user' && !manageable) return;
        if (!['system', 'user', 'char'].includes(role)) return;
        editMessageRole = role;
        const roles = el('wcGroupEditMsgRoles');
        roles.querySelectorAll('[data-role]').forEach(button => {
            button.classList.toggle('is-active', button.dataset.role === role);
            button.disabled = (!manageable && button.dataset.role !== 'user')
                || (button.dataset.role === 'user' && !userExists);
        });
        el('wcGroupEditMsgSpeakerSection').hidden = role !== 'char';
        el('wcGroupEditMsgFormats').querySelectorAll('[data-format]').forEach(button => {
            button.disabled = role === 'system' && button.dataset.format !== 'text';
        });
        if (role === 'system') setGroupEditFormat('text');
    }

    function setGroupEditFormat(format) {
        const current = active() && rows(active()).find(item => item.id === editMessageId);
        const activity = current?.activity;
        const name = GROUP_EDIT_FORMATS.has(format) ? format : 'text';
        editMessageFormat = activity ? (activity.kind === 'redpacket' ? 'redpacket' : 'text')
            : editMessageRole === 'system' ? 'text' : name;
        el('wcGroupEditMsgFormats').querySelectorAll('[data-format]').forEach(button => {
            button.classList.toggle('is-active', button.dataset.format === editMessageFormat);
            button.disabled = Boolean(activity && button.dataset.format !== editMessageFormat) ||
                (editMessageRole === 'system' && button.dataset.format !== 'text');
        });
        const label = activity
            ? ({ redpacket: '红包祝福语', poll: '群投票标题', relay: '群接龙标题', game: '游戏邀请标题' }[activity.kind] || '活动内容')
            : GROUP_EDIT_LABELS[editMessageFormat];
        el('wcGroupEditMsgPrimaryLabel').textContent = label;
        el('wcGroupEditMsgTranslationField').hidden = editMessageFormat !== 'translation';
        el('wcGroupEditMsgImageField').hidden = editMessageFormat !== 'image';
        // Redpacket greeting uses the same primary textarea as every format.
    }

    function openGroupMessageEditor(id) {
        const group = active();
        const message = group && rows(group).find(item => item.id === id);
        if (!message || (!canManage(group) && message.senderId !== USER_ID)) return;
        closeBubbleMenu();
        closeMorePanel();
        closeEmojiPanel();
        closeGroupMessageEditor();
        editMessageId = id;
        editGroupId = group.id;
        const charSelect = el('wcGroupEditMsgSpeaker');
        charSelect.replaceChildren();
        const characters = group.members.filter(member => member.id !== USER_ID);
        const originalChar = characters.find(member => member.id === message.senderId);
        if (message.senderId !== USER_ID && message.senderId !== 'system' && !originalChar) {
            // Keep the original historical author when that member has left the group.
            charSelect.add(new Option(message.senderName + '（已退出）', message.senderId));
        }
        characters.forEach(member => charSelect.add(new Option(memberName(member), member.id)));
        const role = message.senderId === 'system' || message.type === 'system_event'
            ? 'system' : message.senderId === USER_ID ? 'user' : 'char';
        if (role === 'char' && [...charSelect.options].some(option => option.value === message.senderId)) {
            charSelect.value = message.senderId;
        }
        const rawFormat = inferGroupMessageFormat(message);
        let primaryText = message.activity
            ? String(message.activity.kind === 'redpacket' ? message.activity.greeting || ''
                : message.activity.kind === 'game' ? message.activity.customTitle || (window.WcGroupGames?.TYPES?.[message.activity.gameType]?.name || '群游戏') + '，一起玩吗？'
                    : message.activity.title || message.text || '')
            : String(message.recalled
            ? (message.recalledOriginalText ?? message.text ?? '') : (message.text || ''));
        if (rawFormat === 'emoji') primaryText = primaryText.replace(/^\s*\[(?:表情包?|emoji|sticker)\]\s*/i, '');
        if (rawFormat === 'voice') primaryText = primaryText.replace(/^\s*\[语音\]\s*/i, '');
        if (rawFormat === 'image') primaryText = primaryText.replace(/^\s*\[图片\]\s*/i, '');
        if (rawFormat === 'redpacket') primaryText = primaryText.replace(/^\s*\[红包\]\s*/i, '');
        if (rawFormat === 'action') primaryText = primaryText.replace(/^\s*\[动描\]\s*/i, '');

        el('wcGroupEditMsgTextarea').value = primaryText;
        el('wcGroupEditMsgTranslationTextarea').value = String(message.translation || '');
        el('wcGroupEditMsgImageUrl').value = rawFormat === 'image' ? String(message.imageUrl || '') : '';
        el('wcGroupEditMsgTimeInput').value = groupEditableDate(message.createdAt);
        el('wcGroupEditMsgTimeInput').disabled = Boolean(message.activity);
        el('wcGroupEditMsgRepair').disabled = Boolean(message.activity);
        el('wcGroupEditMsgRepairHint').textContent = '';
        el('wcGroupEditMsgSpeakerHint').textContent = characters.length
            ? '选择群聊中的角色或 NPC，保存后同步更新消息头像与发言人。'
            : '群聊没有可选的角色。';
        setGroupEditRole(role);
        setGroupEditFormat(rawFormat);
        if (message.activity) {
            el('wcGroupEditMsgRoles').querySelectorAll('[data-role]').forEach(button => { button.disabled = true; });
            el('wcGroupEditMsgSpeaker').disabled = true;
        } else el('wcGroupEditMsgSpeaker').disabled = false;

        const overlay = el('wcGroupEditMsgOverlay');
        overlay.style.display = 'flex';
        overlay.setAttribute('aria-hidden', 'false');
        // Keep the same entrance animation as the original single-chat editor.
        void overlay.offsetHeight;
        overlay.classList.add('show');
    }

    function repairGroupEditFormat() {
        const raw = el('wcGroupEditMsgTextarea').value.trim();
        const current = active() && rows(active()).find(item => item.id === editMessageId);
        if (!current) return;
        const probes = [
            ['emoji', /^\s*\[(?:表情包?|emoji|sticker)\]\s*/i],
            ['voice', /^\s*\[语音\]\s*/i],
            ['image', /^\s*\[图片\]\s*/i],
            ['redpacket', /^\s*\[红包\]\s*/i],
            ['action', /^\s*(?:\[动描\]|\*[^*\n]+\*)\s*/i]
        ];
        const matched = probes.find(([, pattern]) => pattern.test(raw));
        const next = matched?.[0] || (raw === current.text ? inferGroupMessageFormat(current) : 'text');
        setGroupEditFormat(next);
        if (matched && matched[0] !== 'action') el('wcGroupEditMsgTextarea').value = raw.replace(matched[1], '').trim();
        el('wcGroupEditMsgRepairHint').textContent = '已识别为：' + ({
            text: '文本', emoji: '表情包', voice: '语音', image: '图片',
            redpacket: '红包', action: '动描', translation: '翻译'
        }[next] || '文本');
    }

    function invalidateEditedGroupMemories(group, messageId) {
        if (!group.memberMemories) return;
        // Unlike pruneMemories, an edit preserves the message ID but invalidates
        // any summaries derived from the previous text or previous speaker.
        Object.keys(group.memberMemories).forEach(id => {
            group.memberMemories[id] = (group.memberMemories[id] || [])
                .filter(item => !Array.isArray(item.sourceIds) || !item.sourceIds.includes(messageId));
        });
    }

    // Card editor changes presentation only. Wallet, claims and game state remain intact.
    async function saveGroupCardEditor(group, message, chosenMemberId, format, primary) {
        if (groupEditSaving) return;
        if (!message.activity) {
            // Editing text cannot synthesize a payable packet without explicit amount
            // and wallet authorization. The chat's send-redpacket page owns that flow.
            return toast('创建真实红包请使用群聊「发红包」；这里可编辑已发红包的祝福语');
        }
        if (!primary) return toast('请填写消息内容');
        if (chosenMemberId !== message.senderId ||
            format !== (message.activity.kind === 'redpacket' ? 'redpacket' : 'text'))
            return toast('活动消息只能编辑卡片内容，不能修改发言人或格式');
        const saveButton = el('wcGroupEditMsgSave');
        groupEditSaving = true;
        saveButton.disabled = true;
        try {
            const kind = message.activity.kind;
            const updatedText = primary.slice(0, kind === 'redpacket' ? 80 : 90);
            const ok = await transactActivity((draft, messages) => {
                const target = messages.find(item => item.id === message.id);
                if (!target?.activity || target.activity.kind !== kind) return false;
                if (kind === 'redpacket') {
                    target.activity.greeting = updatedText;
                    target.text = '[群红包] ' + updatedText;
                } else if (kind === 'game') {
                    target.activity.customTitle = updatedText;
                    target.text = '[群游戏] ' + updatedText;
                } else if (kind === 'poll' || kind === 'relay') {
                    target.activity.title = updatedText;
                    target.text = (kind === 'poll' ? '[群投票] ' : '[群接龙] ') + updatedText;
                } else return false;
                target.activity.updatedAt = Date.now();
                draft.updatedAt = Date.now();
                invalidateEditedGroupMemories(draft, target.id);
                return true;
            }, null, group);
            if (!ok) return toast('卡片修改失败，请重试');
            invalidateGroupSummarySources(group, [message.id]);
            if (active() === group && editMessageId === message.id) {
                closeGroupMessageEditor();
                wcRenderChatList();
                toast('修改成功');
            }
        } catch (error) { report(error); }
        finally { groupEditSaving = false; saveButton.disabled = false; }
    }

    async function saveGroupMessageEditor() {
        const group = active();
        const id = editMessageId;
        const message = group && rows(group).find(item => item.id === id);
        if (!message || group.id !== editGroupId) return;
        const manageable = canManage(group);
        if (!manageable && message.senderId !== USER_ID) return toast('没有编辑这条消息的权限');

        const role = editMessageRole;
        const format = role === 'system' ? 'text' : editMessageFormat;
        const chosenMemberId = role === 'system' ? 'system' : role === 'user' ? USER_ID : el('wcGroupEditMsgSpeaker').value;
        const member = group.members.find(item => item.id === chosenMemberId);
        const originalHistoricalMember = chosenMemberId === message.senderId && chosenMemberId !== USER_ID
            && chosenMemberId !== 'system' && !member;
        if (!manageable && chosenMemberId !== USER_ID) return toast('只有群管理员可以更改消息发言人');
        if (role === 'user' && (group.mode !== 'participate' || !member)) return toast('当前群聊没有用户成员');
        if (role === 'char' && !member && !originalHistoricalMember) return toast('请选择一位群聊角色或 NPC');
        if (role === 'system' && !manageable) return toast('没有调整系统消息的权限');

        const primary = el('wcGroupEditMsgTextarea').value.trim();
        if (message.activity || format === 'redpacket')
            return saveGroupCardEditor(group, message, chosenMemberId, format, primary);
        const translation = el('wcGroupEditMsgTranslationTextarea').value.trim();
        const imageInput = el('wcGroupEditMsgImageUrl').value.trim();
        if (!primary && format !== 'image') return toast('消息内容不能为空');
        if (format === 'translation' && !translation) return toast('请填写译文');

        let emoji = null;
        let imageUrl = '';
        if (format === 'emoji') {
            const title = primary.replace(/^\[(?:表情包?|emoji|sticker)\]\s*/i, '');
            const existingTitle = String(message.text || '').replace(/^\s*\[(?:表情包?|emoji|sticker)\]\s*/i, '').trim();
            emoji = availableGroupStickers().find(item => String(item.desc || '').trim() === title && safeStickerUrl(item.url))
                || (message.isSticker && title === existingTitle && safeStickerUrl(message.imageUrl)
                    ? { id: message.stickerId || '', desc: title, url: message.imageUrl } : null);
            if (!emoji) return toast('没有在微信表情包中找到这个描述，请先添加表情包');
        }
        if (format === 'image') {
            imageUrl = safeStickerUrl(imageInput);
            if (!imageUrl) return toast('图片格式需要有效的图片地址');
        }
        const timeRaw = el('wcGroupEditMsgTimeInput').value;
        const parsedTime = timeRaw ? new Date(timeRaw).getTime() : Number(message.createdAt);
        if (!Number.isFinite(parsedTime)) return toast('消息时间不正确');

        const token = epoch;
        pause();
        // Store exactly one role and sender identity; AI generation uses senderId.
        message.senderId = chosenMemberId;
        message.senderName = member ? memberName(member)
            : originalHistoricalMember ? message.senderName
                : role === 'user' ? '我' : '系统';
        message.senderAvatar = member?.avatar || (originalHistoricalMember ? message.senderAvatar : '');
        message.type = role === 'system' ? 'system_event' : 'text';
        message.createdAt = parsedTime;
        message.groupFormat = format;
        message.translation = format === 'translation' ? translation : '';
        message.isSticker = format === 'emoji';
        message.isVoice = format === 'voice';
        message.isAction = format === 'action';
        message.imageUrl = format === 'emoji' ? emoji.url : format === 'image' ? imageUrl : '';
        if (format === 'emoji') message.stickerId = String(emoji.id || '');
        else delete message.stickerId;
        if (format === 'emoji') message.text = '[表情] ' + String(emoji.desc || primary);
        else if (format === 'image') message.text = primary || '[图片]';
        else if (format === 'voice') message.text = '[语音] ' + primary;
        else if (format === 'action') message.text = primary;
        else message.text = primary;
        if (message.recalled) {
            message.recalledOriginalText = message.text;
            message.recalledType = format === 'voice' ? 'voice' : format === 'image' ? 'image' : 'text';
        }

        // Avoid leaving an old file preview attached after conversion.
        if (format !== 'other') delete message.fileAttachment;
        invalidateEditedGroupMemories(group, id);
        invalidateGroupSummarySources(group, [id]);
        group.updatedAt = rows(group).reduce((latest, row) =>
            Math.max(latest, Number(row.createdAt) || 0), Number(group.createdAt) || 0);
        await save(group);
        if (token !== epoch || active() !== group) return;
        closeGroupMessageEditor();
        render(false);
        wcRenderChatList();
        toast('修改成功');
    }

    function replyToMessage(id) {
        const group = active();
        const message = group && rows(group).find(item => item.id === id);
        if (!message || message.recalled || message.type === 'system_event' || group.mode !== 'participate') return false;
        replyId = id;
        renderHeader(group);
        showGroupReplyPreview(group, message);
        return true;
    }

    async function messageAction(action) {
        const group = active();
        const id = bubbleMenuMessageId;
        const message = group && rows(group).find(item => item.id === id);
        if (!message || (message.recalled && !['edit', 'delete', 'select'].includes(action))) { closeBubbleMenu(); return; }
        const token = epoch;
        const authorized = message.senderId === USER_ID || canManage(group);
        closeBubbleMenu();
        if (action === 'reply') {
            replyToMessage(id);
            return;
        }
        if (action === 'edit') {
            if (authorized) openGroupMessageEditor(id);
            return;
        } else if (action === 'select') {
            enterGroupSelection(id);
            return;
        } else if (action === 'rewind') {
            if (!canManage(group)) return;
            if (!await showCustomConfirm('回溯消息', '这条消息之后的所有群聊记录都将删除，确定继续吗？', '回溯', true)) return;
            if (token !== epoch || active() !== group) return;
            pause();
            const list = rows(group);
            const index = list.findIndex(item => item.id === id);
            if (index < 0) return;
            if (list.slice(index + 1).some(activityMustStay)) return toast('后续包含已结算的红包或参与活动，不能回溯');
            const removedIds = list.slice(index + 1).map(item => item.id);
            list.splice(index + 1);
            pruneMemories(group);
            invalidateGroupSummarySources(group, removedIds);
        } else if (action === 'delete') {
            if (authorized) await deleteGroupMessages([id]);
            return;
        } else if (action === 'recall') {
            if (!authorized) return;
            if (activityMustStay(message)) return toast('红包已关联钱包或活动已有成员参与，不能撤回');
            pause();
            recallGroupMessage(message);
            pruneMemories(group);
            invalidateGroupSummarySources(group, [id]);
        } else if (action === 'favorite') {
            if (requests.get(group.id)?.regenerating) pause();
            await wcToggleGroupMessageFavorite(group, message);
            if (token !== epoch || account !== currentAccount()) return;
        }
        else if (action === 'essential' && canManage(group)) {
            message.essential = !message.essential;
            if (message.essential) {
                const manager = group.members.find(member => member.id === USER_ID);
                message.essentialAt = Date.now();
                message.essentialBy = USER_ID;
                message.essentialByName = manager ? memberName(manager) : '我';
            } else {
                delete message.essentialAt;
                delete message.essentialBy;
                delete message.essentialByName;
            }
        }
        else return;
        if (replyId === id && (action === 'delete' || action === 'recall')) replyId = '';
        await save(group);
        if (token !== epoch || active() !== group) return;
        render(false);
        wcRenderChatList();
    }



    function redPacketContext(groupId, messageId) {
        const group = groupById(groupId);
        const message = group && rows(group).find(item => item.id === messageId && item.activity?.kind === 'redpacket');
        return message ? { group, message } : null;
    }

    function redPacketCanClaim(group, message) {
        const activity = message.activity;
        const state = redPacketState(activity);
        return group.mode === 'participate' && activityEligible(group, message, USER_ID) &&
            canSpeak(group, group.members.find(member => member.id === USER_ID)) &&
            state.status === 'open' && !state.claims.some(claim => claim.memberId === USER_ID);
    }

    function renderRedPacketCard(group, message) {
        const activity = message.activity;
        const state = redPacketState(activity);
        const claimed = state.claims.some(claim => claim.memberId === USER_ID);
        const card = document.createElement('button');
        card.type = 'button';
        card.className = 'wc-group-redpacket-card' + (claimed || state.status !== 'open' ? ' is-used' : '');
        card.setAttribute('aria-label', '查看' + (claimed ? '已领取' : '') + '群红包：' + activity.greeting);
        const header = document.createElement('span');
        header.className = 'wc-group-redpacket-header';
        const emblem = document.createElement('span');
        emblem.className = 'wc-group-redpacket-emblem';
        emblem.innerHTML = '<svg viewBox="0 0 42 48" fill="none" aria-hidden="true">' +
            '<rect x="4" y="2" width="34" height="44" rx="3" fill="#f34848"/>' +
            '<path d="M4 26c9 5 25 5 34 0v17a3 3 0 0 1-3 3H7a3 3 0 0 1-3-3Z" fill="#e84645"/>' +
            '<circle cx="21" cy="24" r="7" fill="#f6c64c"/>' +
            '<path d="M18 21.5 21 26l3-4.5M21 26v3" stroke="#b47a26" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>';
        const greeting = document.createElement('strong');
        greeting.textContent = activity.greeting || '恭喜发财，大吉大利';
        header.append(emblem, greeting);
        const footer = document.createElement('span');
        footer.className = 'wc-group-redpacket-footer';
        footer.textContent = '微信红包' + (claimed ? ' · 已领取' :
            state.status === 'expired' ? ' · 已过期' : state.status === 'finished' ? ' · 已领完' : '');
        card.append(header, footer);
        card.onclick = event => {
            event.stopPropagation();
            openRedPacketPanel(group.id, message.id);
        };
        return card;
    }

    function openRedPacketPanel(groupId, messageId) {
        const current = redPacketContext(groupId, messageId);
        if (!current || active() !== current.group) return;
        const { group, message } = current;
        if (!redPacketCanClaim(group, message)) {
            showRedPacketDetails(groupId, messageId);
            return;
        }
        const member = group.members.find(item => item.id === message.senderId);
        const senderName = member ? memberName(member) : String(message.senderName || '群成员');
        const avatarUrl = message.senderId === USER_ID
            ? (appSettings?.wc_current_user_avatar || member?.avatar || message.senderAvatar)
            : (member?.avatar || message.senderAvatar);
        panel('拆红包',
            '<div class="wcg-redpacket-open-stage"><div class="wcg-redpacket-envelope">' +
            '<div class="wcg-redpacket-flap"></div>' +
            '<div class="wcg-redpacket-sender"><div id="wcgRedpacketSenderAvatar"></div><span>' + escape(senderName) + '的红包</span></div>' +
            '<div class="wcg-redpacket-greeting">' + escape(message.activity.greeting || '恭喜发财，大吉大利') + '</div>' +
            '<button id="wcgRedpacketOpenCoin" class="wcg-redpacket-coin" type="button" aria-label="拆开红包">開</button>' +
            '</div><button id="wcgRedpacketOpenClose" class="wcg-redpacket-outside-close" type="button" aria-label="关闭红包">' +
            '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.3" stroke-linecap="round" aria-hidden="true"><path d="M18 6 6 18M6 6l12 12"/></svg>' +
            '</button></div>', 'redpacket-open');
        const avatarHost = el('wcgRedpacketSenderAvatar');
        avatarHost?.append(avatarNode(avatarUrl, senderName, 'wcg-redpacket-sender-photo'));
        el('wcgRedpacketOpenClose').onclick = closePanel;
        const coin = el('wcgRedpacketOpenCoin');
        coin.onclick = async () => {
            if (coin.disabled) return;
            const packet = redPacketContext(groupId, messageId);
            if (!packet || active() !== packet.group) { closePanel(); return; }
            if (!redPacketCanClaim(packet.group, packet.message)) {
                showRedPacketDetails(groupId, messageId);
                return;
            }
            coin.disabled = true;
            try {
                const ok = await transactActivity(
                    (draft, messages) => claimRedPacket(draft, messages, messageId, USER_ID),
                    (draft, messages) => {
                        const entry = messages.find(item => item.id === messageId);
                        const claim = entry?.activity?.claims?.find(item => item.memberId === USER_ID);
                        return claim && (entry.activity.funding === 'wallet' || entry.senderId !== USER_ID)
                            ? packetWalletOperation('claim', draft, entry, claim.cents, USER_ID) : null;
                    }, packet.group);
                if (!ok) toast('红包未领取，可能已领完或过期');
                if (active()?.id === groupId) showRedPacketDetails(groupId, messageId);
            } catch (error) {
                report(error);
                coin.disabled = false;
            }
        };
    }

    function showRedPacketDetails(groupId, messageId) {
        const current = redPacketContext(groupId, messageId);
        if (!current || active() !== current.group) return;
        const { group, message } = current;
        const activity = message.activity;
        const state = redPacketState(activity);
        const member = group.members.find(item => item.id === message.senderId);
        const senderName = member ? memberName(member) : String(message.senderName || '群成员');
        const self = state.claims.find(claim => claim.memberId === USER_ID);
        const best = activity.mode === 'lucky' && state.status !== 'open' && state.claims.length
            ? Math.max(...state.claims.map(claim => claim.cents)) : null;
        const claimRows = state.claims.map((claim, index) => {
            const recipient = group.members.find(item => item.id === claim.memberId);
            const name = recipient ? memberName(recipient) : '原群成员';
            const time = Number(claim.claimedAt) > 0
                ? new Date(claim.claimedAt).toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' }) : '领取记录';
            return '<div class="wcg-redpacket-claim-row"><div class="wcg-redpacket-claim-avatar" data-claim-index="' + index + '"></div>' +
                '<span class="wcg-redpacket-claim-info"><strong>' + escape(name) + '</strong><small>' + escape(time) + '</small></span>' +
                '<span class="wcg-redpacket-claim-money">' + (claim.cents / 100).toFixed(2) + ' 元' +
                (best !== null && claim.cents === best ? '<small>手气最佳</small>' : '') + '</span></div>';
        }).join('');
        const receipt = self
            ? '<strong>' + (self.cents / 100).toFixed(2) + '<span>元</span></strong><small>已存入微信零钱</small>'
            : '<strong class="wcg-redpacket-not-received">未领取</strong><small>' +
                (state.status === 'expired' ? '红包已过期' : state.status === 'finished' ? '红包已领完' : '可以返回拆红包') + '</small>';
        const receivedCents = activity.totalCents - state.remainingCents;
        panel('红包详情',
            '<div class="wcg-redpacket-detail-card"><div class="wcg-redpacket-detail-hero">' +
            '<div class="wcg-redpacket-detail-kicker">红包详情</div><div class="wcg-redpacket-detail-sender">' + escape(senderName) + '的红包</div>' +
            '<div class="wcg-redpacket-detail-greeting">' + escape(activity.greeting || '恭喜发财，大吉大利') + '</div></div>' +
            '<div class="wcg-redpacket-detail-scroll"><div class="wcg-redpacket-receipt">' + receipt + '</div>' +
            '<div class="wcg-redpacket-claim-head">已领取 ' + state.claims.length + '/' + activity.count +
            ' 个 · 共 ' + (receivedCents / 100).toFixed(2) + '/' + (activity.totalCents / 100).toFixed(2) + ' 元</div>' +
            (claimRows || '<div class="wcg-redpacket-claim-empty">还没有人领取红包</div>') +
            '<div class="wcg-redpacket-detail-note">24 小时内未领取的红包按现有钱包规则结算。</div></div>' +
            '<div class="wcg-redpacket-detail-footer"><button id="wcgRedpacketDetailClose" type="button">关闭</button></div></div>',
            'redpacket-detail');
        el('wcgRedpacketDetailClose').onclick = closePanel;
        const avatars = el('wcGroupPanelBody').querySelectorAll('.wcg-redpacket-claim-avatar');
        avatars.forEach((host, index) => {
            const claim = state.claims[index];
            const recipient = group.members.find(item => item.id === claim.memberId);
            const name = recipient ? memberName(recipient) : '原群成员';
            const avatarUrl = claim.memberId === USER_ID
                ? (appSettings?.wc_current_user_avatar || recipient?.avatar)
                : recipient?.avatar;
            host.append(avatarNode(avatarUrl, name, 'wcg-redpacket-claim-photo'));
        });
    }


    function gameMessages(group = active()) {
        return group ? rows(group).filter(item => item.activity?.kind === 'game' && !item.recalled) : [];
    }

    function finishGroupGameMessage(group, messages, message) {
        const game = message?.activity;
        if (game?.status !== 'finished' || game.resultAnnounced) return;
        game.resultAnnounced = true;
        message.text = '[群游戏] ' + (window.WcGroupGames?.TYPES?.[game.gameType]?.name || '游戏') +
            ' · ' + String(game.result || '已结束');
        publicMessage(group, 'system', message.text + '（' + game.players.map(p=>p.name).join('、') + '）',
            { includeInContext: true, gameMessageId: message.id }, messages);
    }

    function gameIsAvailable(group, message) {
        return Boolean(group && message?.activity?.kind === 'game' &&
            message.activity.status === 'playing' && !group.archived);
    }

    function gameSpectators(group, gameMessage) {
        const players = new Set((gameMessage.activity.players || []).map(player => player.id));
        return group.members.filter(member => !players.has(member.id));
    }

    function gameSpeechBubble(group, gameMessage, memberId) {
        const pending = (gameCommentBusy && gameCommentMessageId === gameMessage.id && gameCommentMemberId === memberId) ||
            (gameThinking?.groupId === group.id && gameThinking.messageId === gameMessage.id &&
                gameThinking.memberId === memberId && gameThinking.steps === gameMessage.activity.moves.length);
        const isGomoku = gameMessage.activity.gameType === 'gomoku';
        const ownTurn = memberId === USER_ID && gameMessage.activity.status === 'playing' &&
            gameMessage.activity.players[gameMessage.activity.turn]?.id === USER_ID;
        const showTurnNotice = ownTurn && !isGomoku;
        const latest = rows(group).findLast(item => item.gameMessageId === gameMessage.id &&
            item.senderId === memberId && !item.recalled && item.type !== 'system_event' && !item.activity && !item.isSticker);
        const speechPresentation = latest && gameSpeechPresentation?.groupId === group.id &&
            gameSpeechPresentation.messageId === gameMessage.id && gameSpeechPresentation.turnId === latest.turnId;
        const appearsAt = latest ? Math.max(Number(latest.createdAt) || 0,
            speechPresentation ? Number(gameSpeechPresentation.readyAt) || 0 : 0) : 0;
        const now = Date.now();
        const fresh = latest && appearsAt > 0 && appearsAt < now + 30000 && now < appearsAt + 3000;
        if (!pending && !showTurnNotice && (!latest || (isGomoku && !fresh))) return null;
        const bubble = document.createElement('div');
        bubble.className = 'wcg-speech-bubble' + (pending ? ' pending' : '');
        bubble.setAttribute('role', 'status');
        if (pending) {
            bubble.setAttribute('aria-label', memberName(group.members.find(item => item.id === memberId)) + '正在输入');
            const dots = document.createElement('span');
            dots.className = 'wcg-typing-dots'; dots.setAttribute('aria-hidden', 'true');
            for (let i = 0; i < 3; i++) dots.append(document.createElement('i'));
            bubble.append(dots);
            if (isGomoku) window.setTimeout?.(() => bubble.remove(), 3000);
            return bubble;
        }
        if (!showTurnNotice && latest.gameBehavior) {
            const behavior = document.createElement('small');
            behavior.className = 'wcg-speech-behavior'; behavior.textContent = latest.gameBehavior;
            bubble.append(behavior);
        }
        const text = document.createElement('span');
        text.textContent = showTurnNotice ? '轮到你了' : latest.text;
        bubble.append(text);
        bubble.dataset.messageId = latest?.id || '';
        // Let the committed move appear first; this delay is presentation-only.
        if (!showTurnNotice && speechPresentation && bubble.style) {
            bubble.style.animationDelay = Math.max(0, gameSpeechPresentation.readyAt - Date.now()) + 'ms';
        }
        if (isGomoku) window.setTimeout?.(() => bubble.remove(),
            Math.max(0, appearsAt + 3000 - Date.now()));
        return bubble;
    }

    function gamePlayerNode(group, player, seat, playing, gameMessage = null) {
        const member = group.members.find(item => item.id === player.id) || player;
        const node = document.createElement('div');
        node.className = 'wcg-player' + (playing ? ' active' : '');
        node.dataset.memberId = player.id;
        node.dataset.seat = String(seat);
        const name = document.createElement('span');
        name.className = 'wcg-player-name'; name.textContent = memberName(member);
        const side = document.createElement('small');
        side.className = 'wcg-player-side';
        const gameType = gameMessage?.activity?.gameType;
        const gameRole = gameType === 'cards' ? (seat === gameMessage.activity.landlord ? '地主' : '农民') :
            gameType === 'mahjong' ? (seat === 0 ? '庄家' : '玩家') : (seat === 0 ? '黑棋' : '白棋');
        side.textContent = gameType === 'gomoku' ? gameRole :
            gameRole + (playing ? (gameBotBusy ? ' · 思考中' : ' · 当前行动') : '');
        if (playing) node.setAttribute('aria-current', 'true');
        const bubble = gameMessage && gameSpeechBubble(group, gameMessage, player.id);
        if (bubble) node.append(bubble);
        node.append(avatarNode(member.avatar, memberName(member), 'wcg-player-photo'), name, side);
        return node;
    }

    async function requestGameComment(messageId, memberId) {
        const group = active();
        const gameMessage = group && gameMessages(group).find(item => item.id === messageId);
        const member = gameMessage && gameSpectators(group, gameMessage).find(item => item.id === memberId);
        if (!member || !canSpeak(group, member)) return false;
        if (member.id === USER_ID) {
            if (group.mode !== 'participate') return false;
            const form = el('wcGroupGameCommentForm');
            if (form) form.hidden = false;
            el('wcGroupGameComment')?.focus();
            return true;
        }
        if (gameCommentBusy) return false;
        const pending = requests.get(group.id);
        if (pending && !pending.done) { toast('请等当前操作完成'); return false; }
        const token = epoch, owner = account;
        gameCommentBusy = true;
        gameCommentMemberId = memberId;
        gameCommentMessageId = messageId;
        if (gameBotTimer !== null) clearTimeout(gameBotTimer);
        gameBotTimer = null;
        refreshGameDiscussion(group);
        try {
            await pending?.done;
            if (token !== epoch || owner !== currentAccount() || active() !== group ||
                !gameMessages(group).some(item => item.id === messageId) ||
                !canSpeak(group, group.members.find(item => item.id === memberId))) return false;
            const replied = await generate(memberId, '', '', messageId);
            if (replied) pausedGameId = '';
            return replied;
        } finally {
            gameCommentBusy = false;
            gameCommentMemberId = '';
            gameCommentMessageId = '';
            if (token === epoch && active() === group) {
                refreshGameDiscussion(group);
                scheduleGroupGameBot();
            }
        }
    }


    // Only messages associated with this match belong in the compact chat window.
    // Mahjong and Dou Dizhu share one spectator message renderer.
    function gameCompactChatFeed(group, gameMessage) {
        const feed = document.createElement('div');
        feed.className = 'wcg-card-chat-feed';
        feed.setAttribute('role', 'log');
        feed.setAttribute('aria-label', '本局围观消息');
        const messages = gameChatItems(group, gameMessage);
        messages.forEach(item => {
            const member = group.members.find(person => person.id === item.senderId) ||
                { id: item.senderId, name: item.senderName || '成员', avatar: item.senderAvatar || '' };
            const row = document.createElement('div');
            row.className = 'wcg-card-chat-item' + (item.senderId === USER_ID ? ' mine' : '');
            const copy = document.createElement('div');
            copy.className = 'wcg-card-chat-copy';
            const author = document.createElement('strong');
            author.textContent = item.senderId === USER_ID ? '我' : memberName(member);
            const content = document.createElement('span');
            content.textContent = gameChatText(item);
            copy.append(author, content);
            row.append(avatarNode(member.avatar, memberName(member), 'wcg-card-chat-photo'), copy);
            feed.append(row);
        });
        if (!messages.length) {
            const empty = document.createElement('p');
            empty.className = 'wcg-card-chat-empty';
            empty.textContent = '这一局还没有聊天消息';
            feed.append(empty);
        }
        return feed;
    }

    function gameChatItems(group, gameMessage) {
        return rows(group).filter(item => item.gameMessageId === gameMessage.id &&
            !item.recalled && item.type !== 'system_event' && !item.activity &&
            (String(item.text || '').trim() || item.gameBehavior || item.isSticker ||
                ['image', 'voice', 'audio', 'video', 'file'].includes(item.type)));
    }

    function gameChatText(item) {
        if (String(item.text || '').trim()) return String(item.text);
        if (item.isSticker) return '[表情包]';
        const labels = { image: '[图片]', voice: '[语音]', audio: '[语音]', video: '[视频]', file: '[文件]' };
        return labels[item.type] || '';
    }

    const gameBarrageSeen = new Map();
    const gomokuBarrageHidden = new Set();
    const gomokuMenuPaths = {
        record: '<path d="M5.625 3.75a2.625 2.625 0 1 0 0 5.25h12.75a2.625 2.625 0 0 0 0-5.25H5.625ZM3.75 11.25a.75.75 0 0 0 0 1.5h16.5a.75.75 0 0 0 0-1.5H3.75ZM3 15.75a.75.75 0 0 1 .75-.75h16.5a.75.75 0 0 1 0 1.5H3.75a.75.75 0 0 1-.75-.75ZM3.75 18.75a.75.75 0 0 0 0 1.5h16.5a.75.75 0 0 0 0-1.5H3.75Z"/>',
        undo: '<path fill-rule="evenodd" d="M9.53 2.47a.75.75 0 0 1 0 1.06L4.81 8.25H15a6.75 6.75 0 0 1 0 13.5h-3a.75.75 0 0 1 0-1.5h3a5.25 5.25 0 1 0 0-10.5H4.81l4.72 4.72a.75.75 0 1 1-1.06 1.06l-6-6a.75.75 0 0 1 0-1.06l6-6a.75.75 0 0 1 1.06 0Z" clip-rule="evenodd"/>',
        eye: '<path d="M12 4c4.29 0 7.863 2.429 10.665 7.154l.22.379l.045.1l.03.083l.014.055l.014.082l.011.1v.11l-.014.111a.992.992 0 0 1-.026.11l-.039.108l-.036.075l-.016.03c-2.764 4.836-6.3 7.38-10.555 7.499l-.313.004c-4.396 0-8.037 -2.549 -10.868 -7.504a1 1 0 0 1 0 -.992c2.831 -4.955 6.472 -7.504 10.868 -7.504zm0 5a3 3 0 1 0 0 6a3 3 0 0 0 0 -6"/>',
        hide: '<path d="M3.53 2.47a.75.75 0 0 0-1.06 1.06l18 18a.75.75 0 1 0 1.06-1.06l-18-18ZM22.676 12.553a11.249 11.249 0 0 1 -2.631 4.31l-3.099-3.099a5.25 5.25 0 0 0-6.71-6.71L7.759 4.577a11.217 11.217 0 0 1 4.242 -.827c4.97 0 9.185 3.223 10.675 7.69.12 .362.12 .752 0 1.113Z"/><path d="M15.75 12c0 .18-.013.357-.037.53l-4.244-4.243A3.75 3.75 0 0 1 15.75 12ZM12.53 15.713l-4.243-4.244a3.75 3.75 0 0 0 4.244 4.243Z"/><path d="M6.75 12c0-.619.107-1.213.304-1.764l-3.1-3.1a11.25 11.25 0 0 0-2.63 4.31c-.12.362-.12.752 0 1.114 1.489 4.467 5.704 7.69 10.675 7.69 1.5 0 2.933-.294 4.242-.827l-2.477-2.477A5.25 5.25 0 0 1 6.75 12Z"/>',
        rules: '<path d="M11.25 4.533A9.707 9.707 0 0 0 6 3a9.735 9.735 0 0 0-3.25.555.75.75 0 0 0-.5.707v14.25a.75.75 0 0 0 1 .707A8.237 8.237 0 0 1 6 18.75c1.995 0 3.823.707 5.25 1.886V4.533ZM12.75 20.636A8.214 8.214 0 0 1 18 18.75c.966 0 1.89.166 2.75.47a.75.75 0 0 0 1-.708V4.262a.75.75 0 0 0-.5-.707A9.735 9.735 0 0 0 18 3a9.707 9.707 0 0 0-5.25 1.533v16.103Z"/>',
        restart: '<path fill-rule="evenodd" d="M4.755 10.059a7.5 7.5 0 0 1 12.548-3.364l1.903 1.903h-3.183a.75.75 0 1 0 0 1.5h4.992a.75.75 0 0 0 .75-.75V4.356a.75.75 0 0 0-1.5 0v3.18l-1.9-1.9A9 9 0 0 0 3.306 9.67a.75.75 0 1 0 1.45.388Zm15.408 3.352a.75.75 0 0 0-.919.53 7.5 7.5 0 0 1 -12.548 3.364l-1.902-1.903h3.183a.75.75 0 0 0 0-1.5H2.984a.75.75 0 0 0 -.75.75v4.992a.75.75 0 0 0 1.5 0v-3.18l1.9 1.9a9 9 0 0 0 15.059-4.035a.75.75 0 0 0 -.53-.918Z" clip-rule="evenodd"/>',
        close: '<path fill-rule="evenodd" d="M5.47 5.47a.75.75 0 0 1 1.06 0L12 10.94l5.47-5.47a.75.75 0 0 1 1.06 1.06L13.06 12l5.47 5.47a.75.75 0 1 1-1.06 1.06L12 13.06l-5.47 5.47a.75.75 0 0 1-1.06-1.06L10.94 12 5.47 6.53a.75.75 0 0 1 0-1.06Z" clip-rule="evenodd"/>'
    };
    // Heroicons Solid icons (MIT); keep the selected preview's filled menu glyphs.
    const gomokuMenuIcon = type => '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">' + gomokuMenuPaths[type] + '</svg>';

    function showGomokuBarrage(group, gameMessage) {
        if (gameMessage.activity.gameType !== 'gomoku') return;
        const overlay = el('wcGroupPanelBody')?.querySelector?.('.wcg-gomoku-barrage');
        if (!overlay) return;
        const items = gameChatItems(group, gameMessage);
        let seen = gameBarrageSeen.get(gameMessage.id);
        if (!seen) {
            // Opening an existing match should not replay its entire chat history.
            seen = new Set(items.map(item => item.id));
            gameBarrageSeen.set(gameMessage.id, seen);
            if (gameBarrageSeen.size > 36) gameBarrageSeen.delete(gameBarrageSeen.keys().next().value);
            return;
        }
        const incoming = items.filter(item => !seen.has(item.id));
        incoming.forEach(item => seen.add(item.id));
        incoming.slice(-5).forEach((item, index) => {
            const member = group.members.find(person => person.id === item.senderId);
            const name = member ? memberName(member) : (item.senderName || '成员');
            const bullet = document.createElement('span');
            bullet.className = 'wcg-gomoku-barrage-item';
            if (gomokuBarrageHidden.has(gameMessage.id)) return;
            bullet.style.top = (8 + (index * 19) % 77) + '%';
            bullet.style.animationDelay = (index * 0.08) + 's';
            const nameLabel = document.createElement('strong');
            nameLabel.textContent = name;
            const messageText = document.createElement('span');
            messageText.textContent = gameChatText(item).slice(0, 64);
            bullet.append(avatarNode(member?.avatar || item.senderAvatar || '', name, 'wcg-gomoku-barrage-photo'), nameLabel, messageText);
            bullet.addEventListener('animationend', () => bullet.remove(), { once: true });
            window.setTimeout?.(() => bullet.remove(), 3300);
            overlay.append(bullet);
        });
    }

    function gameDiscussionNode(group, gameMessage) {
        const isGomoku = gameMessage.activity.gameType === 'gomoku';
        const discussion = document.createElement('div');
        discussion.className = 'wcg-discussion' + (isGomoku ? ' wcg-gomoku-chat' : '');
        const members = gameSpectators(group, gameMessage);
        const heading = document.createElement('strong');
        heading.className = 'wcg-discussion-head';
        heading.textContent = '围观 · ' + members.length + ' 人';
        const avatars = document.createElement('div');
        avatars.className = 'wcg-spectators';
        if (isGomoku) {
            avatars.setAttribute('role', 'group');
            avatars.setAttribute('aria-label', '围观成员头像，左右滑动查看全部');
            avatars.title = '左右滑动查看全部围观成员';
        }
        members.forEach(member => {
            const slot = document.createElement('div');
            slot.className = 'wcg-spectator'; slot.dataset.memberId = member.id;
            const bubble = gameSpeechBubble(group, gameMessage, member.id);
            if (bubble && !isGomoku && !['cards', 'mahjong'].includes(gameMessage.activity.gameType)) slot.append(bubble);
            const button = document.createElement('button');
            button.type = 'button'; button.className = 'wcg-spectator-trigger';
            button.dataset.memberId = member.id;
            button.disabled = !canSpeak(group, member) || (member.id === USER_ID ? group.mode !== 'participate' : gameCommentBusy);
            button.setAttribute('aria-label', memberName(member) + (member.id === USER_ID ? '，点击发言' : '，点击让他发言'));
            const name = document.createElement('span');
            name.className = 'wcg-spectator-name'; name.textContent = member.id === USER_ID ? '我' : memberName(member);
            button.append(avatarNode(member.avatar, memberName(member), 'wcg-spectator-photo'), name);
            button.onclick = () => requestGameComment(gameMessage.id, member.id).catch(report);
            slot.append(button); avatars.append(slot);
        });
        if (!avatars.children.length && !isGomoku) {
            const empty = document.createElement('small');
            empty.className = 'wcg-recent'; empty.textContent = '本群暂无其他围观成员'; avatars.append(empty);
        }
        if (!isGomoku) {
            discussion.append(heading, avatars);
            return discussion;
        }
        const items = gameChatItems(group, gameMessage);
        const header = document.createElement('div');
        header.className = 'wcg-gomoku-chat-head';
        const intro = document.createElement('div');
        intro.className = 'wcg-gomoku-chat-title';
        const title = document.createElement('strong');
        title.textContent = '围观聊天';
        const count = document.createElement('small');
        count.textContent = members.length + ' 人围观 · ' + items.length + ' 条消息';
        intro.append(title, count);
        header.append(intro, avatars);
        discussion.append(header);
        const feed = document.createElement('div');
        feed.className = 'wcg-gomoku-chat-feed';
        feed.setAttribute('role', 'log');
        feed.setAttribute('aria-label', '本局全部聊天消息');
        items.forEach(item => {
            const member = group.members.find(person => person.id === item.senderId) ||
                { id: item.senderId, name: item.senderName || '成员', avatar: item.senderAvatar || '' };
            const line = document.createElement('div');
            line.className = 'wcg-gomoku-chat-item' + (item.senderId === USER_ID ? ' mine' : '');
            line.dataset.messageId = item.id;
            const body = document.createElement('div');
            body.className = 'wcg-gomoku-chat-line';
            const name = document.createElement('strong');
            name.textContent = item.senderId === USER_ID ? '我' : memberName(member);
            body.append(name);
            if (item.gameBehavior) {
                const behavior = document.createElement('small');
                behavior.textContent = item.gameBehavior;
                body.append(behavior);
            }
            const content = document.createElement('span');
            content.textContent = gameChatText(item);
            body.append(content);
            line.append(avatarNode(member.avatar, memberName(member), 'wcg-gomoku-chat-photo'), body);
            feed.append(line);
        });
        const typingMember = members.find(member =>
            (gameCommentBusy && gameCommentMessageId === gameMessage.id && gameCommentMemberId === member.id) ||
            (gameThinking?.groupId === group.id && gameThinking.messageId === gameMessage.id &&
                gameThinking.memberId === member.id && gameThinking.steps === gameMessage.activity.moves.length));
        if (typingMember) {
            const typing = document.createElement('div');
            typing.className = 'wcg-gomoku-chat-item pending';
            const body = document.createElement('div');
            body.className = 'wcg-gomoku-chat-line';
            body.textContent = memberName(typingMember) + ' 正在输入…';
            typing.append(avatarNode(typingMember.avatar, memberName(typingMember), 'wcg-gomoku-chat-photo'), body);
            feed.append(typing);
        }
        if (!feed.children.length) {
            const empty = document.createElement('p');
            empty.className = 'wcg-gomoku-chat-empty';
            empty.textContent = '本局还没有聊天消息，点头像邀请围观者发言';
            feed.append(empty);
        }
        discussion.append(feed);
        return discussion;
    }

    function refreshGameDiscussion(group) {
        const container = el('wcGroupPanel');
        if (active() !== group || !container || container.hidden) return;
        const message = gameMessages(group).find(item => item.id === container.dataset.gameMessageId);
        const prior = message?.activity.gameType === 'gomoku'
            ? container.querySelector?.('.wcg-discussion')
            : el('wcGroupPanelBody')?.querySelector?.('.wcg-discussion');
        if (!message || !prior) return;
        const oldFeed = prior.querySelector?.('.wcg-gomoku-chat-feed');
        const oldTop = oldFeed?.scrollTop || 0;
        const wasAtBottom = !oldFeed || oldFeed.scrollHeight - oldFeed.clientHeight - oldTop < 38;
        const oldForm = message.activity.gameType === 'gomoku'
            ? container.querySelector?.('#wcGroupGameCommentForm') : null;
        const hadInputFocus = oldForm && document.activeElement === oldForm.querySelector?.('input');
        const discussion = gameDiscussionNode(group, message);
        if (prior.classList.contains('wcg-table-discussion')) discussion.classList.add('wcg-table-discussion');
        if (prior.classList.contains('wcg-card-chat-spectators')) discussion.classList.add('wcg-card-chat-spectators');
        if (oldForm && message.activity.gameType !== 'gomoku') discussion.append(oldForm);
        discussion.hidden = prior.hidden;
        prior.replaceWith(discussion);
        if (['cards', 'mahjong'].includes(message.activity.gameType)) {
            const popup = container.querySelector?.('#wcGroupGameChatPopup');
            const previous = popup?.querySelector?.('.wcg-card-chat-feed');
            if (previous) {
                const atBottom = previous.scrollHeight - previous.clientHeight - previous.scrollTop < 38;
                const previousTop = previous.scrollTop;
                const feed = gameCompactChatFeed(group, message);
                previous.replaceWith(feed);
                feed.scrollTop = atBottom ? feed.scrollHeight : previousTop;
                const count = popup.querySelector?.('.wcg-card-chat-title small');
                if (count) count.textContent = gameSpectators(group, message).length + ' 人围观 · ' +
                    gameChatItems(group, message).length + ' 条消息';
            }
        }
        const newFeed = discussion.querySelector?.('.wcg-gomoku-chat-feed');
        if (newFeed) newFeed.scrollTop = wasAtBottom ? newFeed.scrollHeight : oldTop;
        if (hadInputFocus) oldForm.querySelector?.('input')?.focus({ preventScroll: true });
        showGomokuBarrage(group, message);
        el('wcGroupPanelBody')?.querySelectorAll?.('.wcg-player').forEach(node => {
            const seat = message.activity.players.findIndex(player => player.id === node.dataset.memberId);
            if (seat >= 0) node.replaceWith(gamePlayerNode(group, message.activity.players[seat], seat,
                message.activity.status === 'playing' && message.activity.turn === seat, message));
        });
        const turn = el('wcGroupPanelBody')?.querySelector?.('.wcg-table-turn');
        if (turn && message.activity.status === 'playing') {
            const player = message.activity.players[message.activity.turn];
            turn.textContent = '轮到 ' + player.name + (player.id === USER_ID ? ' 出牌'
                : gameBotBusy ? ' · 思考中…' : ' · 行动中');
        }
        refreshGroupGameStatus(group, message);
    }

    function refreshGroupGameStatus(group, message) {
        const game = message.activity, player = game.players[game.turn];
        const ownTurn = player?.id === USER_ID;
        const waiting = gameCommentSends.has(group.id);
        const busy = gameBotBusy || gameCommentBusy || requests.has(group.id) || waiting;
        const text = game.status !== 'playing' ? (game.result || '本局已结束')
            : waiting ? '消息将在当前回合结束后发送；下一回合由你点击开始'
            : gameCommentBusy ? '围观成员正在发言，不会自动推进对局'
            : gameBotBusy ? player.name + '正在思考，请稍候…'
            : requests.has(group.id) ? '正在完成群聊回复，完成后可点击快进'
            : pausedGameId === message.id ? '本回合未完成，点快进按钮重试；进度已保留'
            : ownTurn ? (game.gameType === 'gomoku' ? '轮到你：点击棋盘空位落子' : game.gameType === 'mahjong' && game.pending ? '轮到你：可以吃、碰、杠、胡，或选择过' : '轮到你：选择手牌，再点出牌')
            : '轮到' + player.name + '；点快进按钮生成本轮，完成后停止';
        for (const id of ['wcGroupGameStatus', 'wcGroupGameHint']) {
            const status = el(id);
            if (status) {
                status.textContent = text;
                if (id === 'wcGroupGameStatus') status.hidden = game.status === 'playing' &&
                    !waiting && pausedGameId !== message.id && !requests.has(group.id);
                if (id === 'wcGroupGameStatus' && (gameBotBusy || gameCommentBusy)) status.hidden = true;
                if (id === 'wcGroupGameHint' && game.gameType === 'gomoku')
                    status.hidden = game.status === 'playing' && !busy && pausedGameId !== message.id;
            }
        }
        const next = el('wcGroupGameNext');
        if (next) {
            next.disabled = busy || game.status !== 'playing' || ownTurn;
            next.title = gameBotBusy ? '正在生成本回合…' : pausedGameId === message.id ? '重试这一回合' : '继续下一回合';
            next.setAttribute('aria-label', next.title);
            next.setAttribute('aria-busy', String(gameBotBusy));
        }
        const input = el('wcGroupGameComment');
        if (input) input.disabled = waiting;
        const sendButton = el('wcGroupGameCommentForm')?.querySelector?.('button[type="submit"]');
        if (sendButton) sendButton.disabled = waiting;
    }

    // Rotate only the two table games. Gomoku and all other group panels stay portrait.
    function syncGroupGameLandscape() {
        const gamePanel = el('wcGroupPanel');
        if (!gamePanel || gamePanel.dataset.landscapeGame !== '1') return;
        const host = el('wechatAppUI') || gamePanel.parentElement;
        const bounds = host?.getBoundingClientRect?.();
        const shortSide = Number(host?.clientWidth) || Number(bounds?.width) || Number(window.innerWidth) || 390;
        const longSide = Number(host?.clientHeight) || Number(bounds?.height) || Number(window.innerHeight) || 780;
        const orientation = gamePanel.dataset.gameType === 'mahjong' ? mahjongTableOrientation : cardTableOrientation;
        const desiredLandscape = orientation === 'landscape';
        gamePanel.dataset.gameOrientation = orientation;
        const physicalLandscape = shortSide > longSide;
        gamePanel.dataset.gameRotated = desiredLandscape === physicalLandscape ? '0' : desiredLandscape ? '1' : '-1';
        gamePanel.style?.setProperty?.('--wcg-landscape-width',
            (desiredLandscape ? Math.max(shortSide, longSide) : Math.min(shortSide, longSide)) + 'px');
        gamePanel.style?.setProperty?.('--wcg-landscape-height',
            (desiredLandscape ? Math.min(shortSide, longSide) : Math.max(shortSide, longSide)) + 'px');
    }
    window.addEventListener?.('resize', syncGroupGameLandscape);
    window.addEventListener?.('orientationchange', syncGroupGameLandscape);

    // Use local SVG assets, including the custom fast-forward control.
    function gameToolbarIcon(button, type) {
        const icons = {
            back: 'arrow-left-circle-fill',
            chat: 'chat-3-fill',
            turn: 'fast-forward-fill',
            end: 'close-circle-fill'
        };
        const icon = icons[type];
        if (!icon) return;
        button.setAttribute('aria-label', button.textContent);
        button.title = button.textContent;
        const image = document.createElement('img');
        image.className = 'wcg-game-top-icon';
        image.alt = '';
        image.draggable = false;
        image.src = 'images/group-game-ui/' + icon + '.svg';
        button.append(image);
    }


    // Exact game-preview filled icons; the back chevron is reused from the
    // shared chat-settings navbar (wechat-settings.js / wc-settings-nav-btn-left).
    // Phosphor Icons: MIT License, attribution retained in the preview source.
    function cardTableIcon(button, type) {
        const icons = {
            back: '<svg viewBox="0 0 24 24" aria-hidden="true"><polyline points="14 18 8 12 14 6"></polyline></svg>',
            chat: '<svg viewBox="0 0 256 256" fill="currentColor" aria-hidden="true"><path d="M128,24A104,104,0,0,0,36.18,176.88L24.83,210.93a16,16,0,0,0,20.24,20.24l34.05-11.35A104,104,0,1,0,128,24ZM84,140a12,12,0,1,1,12-12A12,12,0,0,1,84,140Zm44,0a12,12,0,1,1,12-12A12,12,0,0,1,128,140Zm44,0a12,12,0,1,1,12-12A12,12,0,0,1,172,140Z"/></svg>',
            turn: '<svg viewBox="0 0 256 256" fill="currentColor" aria-hidden="true"><path d="M256,128a15.76,15.76,0,0,1-7.33,13.34L160.48,197.5A15.91,15.91,0,0,1,136,184.16v-37.3L56.48,197.5A15.91,15.91,0,0,1,32,184.16V71.84A15.91,15.91,0,0,1,56.48,58.5L136,109.14V71.84A15.91,15.91,0,0,1,160.48,58.5l88.19,56.16A15.76,15.76,0,0,1,256,128Z"/></svg>',
            end: '<svg viewBox="0 0 256 256" fill="currentColor" aria-hidden="true"><path d="M232,56V176a8,8,0,0,1-2.76,6c-15.28,13.23-29.89,18-43.82,18-18.91,0-36.57-8.74-53-16.85C105.87,170,82.79,158.61,56,179.77V224a8,8,0,0,1-16,0V56a8,8,0,0,1,2.77-6h0c36-31.18,68.31-15.21,96.79-1.12C167,62.46,190.79,74.2,218.76,50A8,8,0,0,1,232,56Z"/></svg>'
        };
        if (!icons[type]) return;
        const label = button.getAttribute?.('aria-label') || button.textContent;
        if (label) { button.setAttribute('aria-label', label); button.title = label; }
        // Text creates an anonymous grid row even at zero font size.
        // Icon-only toolbar actions keep their accessible name without that row.
        if (type === 'chat' || type === 'end') button.textContent = '';
        button.insertAdjacentHTML('afterbegin', icons[type]);
    }

    /*
     * Lucide Icons — CircleX, SkipForward, ArrowLeft and Ellipsis (ISC License)
     * Copyright (c) 2026 Lucide Icons and Contributors.
     * Permission to use, copy, modify, and/or distribute this software for any
     * purpose with or without fee is hereby granted, provided that the above
     * copyright notice and this permission notice appear in all copies.
     * THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHORS DISCLAIM ALL WARRANTIES
     * WITH REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF
     * MERCHANTABILITY AND FITNESS. IN NO EVENT SHALL THE AUTHORS BE LIABLE
     * FOR ANY SPECIAL, DIRECT, INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY
     * DAMAGES WHATSOEVER RESULTING FROM LOSS OF USE, DATA OR PROFITS.
     * https://lucide.dev/license
     */

    function openGroupGame(messageId) {
        const group = active();
        const gameMessage = group && gameMessages(group).find(item => item.id === messageId);
        if (!gameMessage || !window.WcGroupGames) return toast('这局游戏已经不存在');
        const commentDraft = el('wcGroupPanel')?.dataset.gameMessageId === messageId ? el('wcGroupGameComment')?.value || '' : '';
        const commentFocused = document.activeElement === el('wcGroupGameComment');
        const chatOpen = el('wcGroupPanel')?.dataset.gameMessageId === messageId &&
            (gameMessage.activity.gameType === 'gomoku'
                ? el('wcGroupPanel')?.querySelector('.wcg-gomoku-chat-dock')?.classList.contains('open')
                : !el('wcGroupGameChatPopup')?.hidden);
        const sameGame = el('wcGroupPanel')?.dataset.gameMessageId === messageId;
        const previousFeed = sameGame ? el('wcGroupPanel')?.querySelector?.('.wcg-gomoku-chat-feed, .wcg-card-chat-feed') : null;
        const feedScrollTop = previousFeed?.scrollTop || 0;
        const feedAtBottom = !previousFeed || previousFeed.scrollHeight - previousFeed.clientHeight - feedScrollTop < 38;
        const scrollTop = sameGame ? el('wcGroupPanelBody')?.scrollTop || 0 : 0;
        panel(gameMessage.activity.gameType === 'gomoku' ? '五子棋' :
            '群游戏 · ' + window.WcGroupGames.TYPES[gameMessage.activity.gameType]?.name, '', 'game');
        const container = el('wcGroupPanel');
        container.dataset.gameMessageId = messageId;
        container.dataset.gameType = gameMessage.activity.gameType;
        if (gameMessage.activity.gameType === 'gomoku') {
            // A standalone game header, not the shared group-panel header.
            // Match the chat-settings header's top safe-area inset and 44px toolbar height.
            const sheet = container.querySelector('.wc-group-panel-sheet');
            if (sheet) {
                const header = document.createElement('header');
                header.className = 'wcg-gomoku-topbar';
                const back = document.createElement('button');
                back.type = 'button';
                back.className = 'wcg-gomoku-back';
                back.setAttribute('aria-label', '返回群聊');
                // Use the selected preview's strong chevron back icon.
                back.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><polyline points="14 18 8 12 14 6"/></svg>';
                back.onclick = () => {
                    if (!detailOverlay.hidden) closeDetail();
                    else if (!menu.hidden) toggleMenu(false);
                    else closePanel();
                };
                const title = document.createElement('strong');
                title.id = 'wcGomokuTopbarTitle';
                title.className = 'wcg-gomoku-title';
                title.textContent = '五子棋';
                const more = document.createElement('button');
                more.type = 'button';
                more.className = 'wcg-gomoku-more';
                more.setAttribute('aria-label', '更多');
                more.setAttribute('aria-haspopup', 'menu');
                more.setAttribute('aria-controls', 'wcGomokuMoreMenu');
                more.setAttribute('aria-expanded', 'false');
                // Tabler Icons Filled (MIT), embedded ellipsis icon.
                more.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="21" height="21" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><circle cx="5" cy="12" r="2"/><circle cx="12" cy="12" r="2"/><circle cx="19" cy="12" r="2"/></svg>';

                const menu = document.createElement('div');
                menu.id = 'wcGomokuMoreMenu';
                menu.className = 'wcg-gomoku-more-menu';
                menu.setAttribute('role', 'menu');
                menu.hidden = true;
                const toggleMenu = open => {
                    menu.hidden = !open;
                    more.setAttribute('aria-expanded', String(open));
                };
                more.onclick = () => toggleMenu(menu.hidden);
                const detailOverlay = document.createElement('div');
                detailOverlay.className = 'wcg-gomoku-detail-overlay';
                detailOverlay.hidden = true;
                const detailSheet = document.createElement('section');
                detailSheet.className = 'wcg-gomoku-detail-sheet';
                detailSheet.setAttribute('role', 'dialog');
                detailSheet.setAttribute('aria-modal', 'true');
                const detailHead = document.createElement('div');
                detailHead.className = 'wcg-gomoku-detail-head';
                const detailTitle = document.createElement('strong');
                const detailBody = document.createElement('div');
                detailBody.className = 'wcg-gomoku-detail-content';
                const detailFooter = document.createElement('div');
                detailFooter.className = 'wcg-gomoku-detail-footer';
                const detailDismiss = document.createElement('button');
                detailDismiss.type = 'button';
                detailDismiss.className = 'wcg-gomoku-detail-dismiss';
                detailDismiss.textContent = '关闭';
                detailFooter.append(detailDismiss);
                const closeDetail = () => { detailOverlay.hidden = true; };
                detailDismiss.onclick = closeDetail;
                detailOverlay.onclick = event => {
                    if (event.target === detailOverlay) closeDetail();
                };
                detailHead.append(detailTitle);
                detailSheet.append(detailHead, detailBody, detailFooter);
                detailOverlay.append(detailSheet);
                const addDetailParagraph = (heading, body) => {
                    const h = document.createElement('h4');
                    h.textContent = heading;
                    const p = document.createElement('p');
                    p.textContent = body;
                    detailBody.append(h, p);
                };
                const openDetail = type => {
                    toggleMenu(false);
                    const showingRules = type === 'rules';
                    detailOverlay.className = 'wcg-gomoku-detail-overlay ' +
                        (showingRules ? 'is-rules' : 'is-record');
                    detailBody.replaceChildren();
                    detailBody.scrollTop = 0;
                    if (showingRules) {
                        detailTitle.textContent = '五子棋规则';
                        addDetailParagraph('基本玩法', '15 × 15 棋盘，黑棋先行。双方交替在空交叉点落子。');
                        addDetailParagraph('胜负判断', '横向、纵向或斜向率先连成连续五子的一方获胜。当前采用自由五子棋规则，不设禁手。');
                        addDetailParagraph('本局操作', '轮到你时直接点棋盘空位落子；轮到角色时点击“生成下一回合”，一次只生成一轮。结束本局会保留已有棋谱。');
                    } else {
                        const moves = gameMessage.activity.moves;
                        detailTitle.textContent = '本局棋谱';
                        const summary = document.createElement('p');
                        summary.textContent = '共 ' + moves.length + ' 手 · 黑先白后 · 第 ' +
                            (Math.floor(moves.length / 2) + 1) + ' 回合';
                        detailBody.append(summary);
                        if (!moves.length) {
                            addDetailParagraph('尚未落子', '第一手将由黑棋开始。');
                        } else {
                            const list = document.createElement('div');
                            list.className = 'wcg-gomoku-record';
                            moves.forEach((move, index) => {
                                const item = document.createElement('div');
                                item.className = 'wcg-gomoku-record-item' + (move.seat === 0 ? ' black' : '');
                                const stone = document.createElement('i');
                                stone.setAttribute('aria-hidden', 'true');
                                const number = document.createElement('strong');
                                number.textContent = String(index + 1).padStart(2, '0');
                                const position = document.createElement('span');
                                position.textContent = String.fromCharCode(65 + move.at % 15) +
                                    (15 - Math.floor(move.at / 15));
                                item.append(stone, number, position);
                                list.append(item);
                            });
                            detailBody.append(list);
                        }
                    }
                    detailOverlay.hidden = false;
                    detailDismiss.focus({ preventScroll: true });
                };
                const canControlGame = group.mode === 'participate' && !group.archived &&
                    canSpeak(group, group.members.find(member => member.id === USER_ID)) &&
                    (canManage(group) || gameMessage.activity.players.some(player => player.id === USER_ID));
                const busy = gameBotBusy || gameCommentBusy || gameCommentSends.has(group.id) || requests.has(group.id);
                const menuAction = (icon, title, action) => {
                    const button = document.createElement('button');
                    button.type = 'button';
                    button.setAttribute('role', 'menuitem');
                    button.innerHTML = gomokuMenuIcon(icon) + '<span>' + title + '</span>';
                    button.onclick = action;
                    return button;
                };
                const record = menuAction('record', '查看棋谱', () => openDetail('record'));
                const undo = menuAction('undo', '悔棋一步', () => {
                    toggleMenu(false);
                    return undoGroupGomoku(messageId).catch(report);
                });
                undo.disabled = !canControlGame || busy || gameMessage.activity.status !== 'playing' ||
                    !gameMessage.activity.moves.length;
                const barrageToggle = menuAction('hide', '', () => {
                    if (gomokuBarrageHidden.has(messageId)) gomokuBarrageHidden.delete(messageId);
                    else gomokuBarrageHidden.add(messageId);
                    el('wcGroupPanelBody')?.querySelector('.wcg-theme-gomoku')?.classList.toggle('wcg-hide-barrage', gomokuBarrageHidden.has(messageId));
                    syncBarrageLabel();
                    toggleMenu(false);
                });
                const syncBarrageLabel = () => {
                    const hidden = gomokuBarrageHidden.has(messageId);
                    barrageToggle.innerHTML = gomokuMenuIcon(hidden ? 'eye' : 'hide') +
                        '<span>' + (hidden ? '显示弹幕' : '隐藏弹幕') + '</span>';
                };
                syncBarrageLabel();
                const separator = document.createElement('div');
                separator.className = 'wcg-gomoku-menu-sep';
                separator.setAttribute('aria-hidden', 'true');
                const rules = menuAction('rules', '对局规则', () => openDetail('rules'));
                const restart = menuAction('restart', '重新开始本局', () => {
                    toggleMenu(false);
                    return restartGroupGomoku(messageId).catch(report);
                });
                restart.className += ' wcg-gomoku-menu-danger';
                restart.disabled = !canControlGame || busy;
                menu.append(record, undo, barrageToggle, separator, rules, restart);
                header.append(back, title, more, menu);
                container.addEventListener('pointerdown', event => {
                    if (!header.contains(event.target) && !menu.hidden) toggleMenu(false);
                });
                container.addEventListener('keydown', event => {
                    if (event.key === 'Escape') {
                        if (!detailOverlay.hidden) closeDetail();
                        else toggleMenu(false);
                    }
                });
                sheet.insertBefore(header, sheet.firstChild);
                sheet.append(detailOverlay);
                sheet.setAttribute('aria-labelledby', title.id);
            }
        }
        const landscape = ['cards', 'mahjong'].includes(gameMessage.activity.gameType);
        container.dataset.landscapeGame = landscape ? '1' : '0';
        if (landscape) syncGroupGameLandscape();
        const allowed = group.mode === 'participate' && gameMessage.activity.players.some(p => p.id === USER_ID) &&
            canSpeak(group, group.members.find(p => p.id === USER_ID));
        const gameBoard = window.WcGroupGames.render(gameMessage.activity, {
            canPlay: allowed,
            onMove: move => playGroupGame(messageId, move).catch(report),
            renderPlayer: (player, seat, playing) => gamePlayerNode(group, player, seat, playing, gameMessage)
        });
        el('wcGroupPanelBody').replaceChildren(gameBoard);
        if (gameMessage.activity.gameType === 'gomoku') {
            gameBoard.classList.toggle('wcg-hide-barrage', gomokuBarrageHidden.has(messageId));
            const count = gameBoard.querySelector?.('.wcg-gomoku-spectator-count');
            if (count) count.textContent = gameSpectators(group, gameMessage).length + ' 位围观';
        }
        const status = document.createElement('p');
        status.id = 'wcGroupGameStatus'; status.className = 'wcg-game-status';
        status.setAttribute('role', 'status'); status.setAttribute('aria-live', 'polite');
        gameBoard.append(status);
        const discussion = gameDiscussionNode(group, gameMessage);
        if (landscape) discussion.className += ' wcg-table-discussion';
        const chatPopup = landscape ? document.createElement('aside') : null;
        if (chatPopup) {
            chatPopup.id = 'wcGroupGameChatPopup';
            chatPopup.className = 'wcg-game-chat-popup';
            chatPopup.hidden = !chatOpen;
            chatPopup.setAttribute('aria-label', '群游戏聊天');
            chatPopup.append(gameCompactChatFeed(group, gameMessage));
        }
        const chatTarget = chatPopup || gameBoard;
        if (chatPopup) {
            // Spectator avatars are interactive inside the chat panel, never a table barrage.
            discussion.classList.remove('wcg-table-discussion');
            discussion.classList.add('wcg-card-chat-spectators');
            chatPopup.prepend(discussion);
        } else if (gameMessage.activity.gameType !== 'gomoku') gameBoard.append(discussion);
        const hint = document.createElement('p');
        hint.className = 'wc-group-hint';
        hint.id = 'wcGroupGameHint';
        hint.textContent = gameBotBusy ? '正在一次生成对战与围观成员的对话、行动…'
            : pausedGameId === messageId ? '本回合未完成，点击重试。棋局进度已保留。'
            : '点围观头像让他发言；每回合一次生成多人对话和当前玩家的一步行动。';
        if (gameMessage.activity.gameType !== 'gomoku') chatTarget.append(hint);
        let commentForm = null;
        if (group.mode === 'participate' && canSpeak(group, group.members.find(p => p.id === USER_ID))) {
            const form = document.createElement('form');
            form.id = 'wcGroupGameCommentForm';
            form.className = 'wcg-comment-form'; form.hidden = false;
            const input = document.createElement('input');
            input.id = 'wcGroupGameComment';
            input.placeholder = gameMessage.activity.gameType === 'gomoku' ? '说点什么…' : '发送围观消息…';
            input.setAttribute('aria-label', '游戏群聊发言');
            input.value = commentDraft;
            const button = document.createElement('button');
            button.type = 'submit'; button.className = 'wcg-primary';
            if (gameMessage.activity.gameType === 'gomoku') {
                button.setAttribute('aria-label', '发送围观消息');
                // Heroicons Solid (MIT), embedded send icon.
                button.innerHTML = '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M3.478 2.404a.75.75 0 0 0-.926.941l2.432 7.905H13.5a.75.75 0 0 1 0 1.5H4.984l-2.432 7.905a.75.75 0 0 0 .926.94 60.519 60.519 0 0 0 18.445-8.986.75.75 0 0 0 0-1.218A60.517 60.517 0 0 0 3.478 2.404Z"/></svg>';
            } else if (['cards', 'mahjong'].includes(gameMessage.activity.gameType)) {
                button.className += ' wcg-card-chat-send';
                button.setAttribute('aria-label', '发送围观消息');
                // Use the same Phosphor filled send icon as the Emerald preview.
                button.insertAdjacentHTML('afterbegin', '<svg viewBox="0 0 256 256" fill="currentColor" aria-hidden="true"><path d="M231.4,44.34s0,.1,0,.15l-58.2,191.94a15.88,15.88,0,0,1-14,11.51q-.69.06-1.38.06a15.86,15.86,0,0,1-14.42-9.15L107,164.15a4,4,0,0,1,.77-4.58l57.92-57.92a8,8,0,0,0-11.31-11.31L96.43,148.26a4,4,0,0,1-4.58.77L17.08,112.64a16,16,0,0,1,2.49-29.8l191.94-58.2.15,0A16,16,0,0,1,231.4,44.34Z"/></svg>');
            } else button.textContent = '发送';
            form.append(input, button);
            form.onsubmit = async event => {
                event.preventDefault();
                if (!input.value.trim() || button.disabled || active() !== group) return;
                button.disabled = true;
                input.disabled = true;
                const text = input.value;
                try {
                    if (!await send({ text, gameMessageId: messageId })) return;
                    input.value = ''; pausedGameId = '';
                    if (el('wcGroupPanel')?.dataset.gameMessageId === messageId && el('wcGroupGameComment')?.value === text) {
                        el('wcGroupGameComment').value = '';
                    }
                    if (active() === group && el('wcGroupPanel')?.dataset.gameMessageId === messageId) openGroupGame(messageId);
                } catch (error) { report(error); }
                finally { button.disabled = false; input.disabled = false; }
            };
            commentForm = form;
        }
        const gomokuActions = gameMessage.activity.gameType === 'gomoku' ? document.createElement('div') : null;
        if (gomokuActions) gomokuActions.className = 'wcg-gomoku-actions';
        const toolbar = landscape ? document.createElement('div') : (gomokuActions || gameBoard);
        let cardMoreMenu = null;
        let cardDetailOverlay = null;
        let closeCardMoreMenu = () => {};
        if (landscape) {
            toolbar.className = 'wcg-landscape-toolbar';
            const back = document.createElement('button');
            back.type = 'button'; back.className = 'wcg-game-top-button'; back.textContent = ['cards', 'mahjong'].includes(gameMessage.activity.gameType) ? '' : '返回';
            back.onclick = () => closePanel();
            if (['cards', 'mahjong'].includes(gameMessage.activity.gameType)) {
                back.className += ' wcg-card-back-action';
                back.setAttribute('aria-label', '返回群聊');
                back.title = '返回群聊';
                cardTableIcon(back, 'back');
            } else gameToolbarIcon(back, 'back');
            const chatToggle = document.createElement('button');
            chatToggle.type = 'button'; chatToggle.className = 'wcg-game-top-button wcg-game-chat-toggle';
            chatToggle.textContent = '聊天'; chatToggle.setAttribute('aria-controls', 'wcGroupGameChatPopup');
            chatToggle.setAttribute('aria-expanded', String(chatOpen));
            if (['cards', 'mahjong'].includes(gameMessage.activity.gameType)) cardTableIcon(chatToggle, 'chat');
            else gameToolbarIcon(chatToggle, 'chat');
            chatToggle.onclick = () => {
                closeCardMoreMenu();
                chatPopup.hidden = !chatPopup.hidden;
                chatToggle.setAttribute('aria-expanded', String(!chatPopup.hidden));
            };
            if (['cards', 'mahjong'].includes(gameMessage.activity.gameType)) {
                const isMahjongTable = gameMessage.activity.gameType === 'mahjong';
                const heading = document.createElement('div');
                heading.className = 'wcg-card-game-identity';
                const name = document.createElement('strong');
                name.textContent = isMahjongTable ? '麻将' : '斗地主';
                const tagline = document.createElement('small');
                tagline.textContent = isMahjongTable ? '群聊 · 四人对局' : '群聊 · 三人对局';
                heading.append(name, tagline);

                const more = document.createElement('button');
                more.type = 'button';
                more.className = 'wcg-game-top-button wcg-card-more-toggle';
                more.setAttribute('aria-label', '更多');
                more.setAttribute('title', '更多');
                more.setAttribute('aria-haspopup', 'menu');
                more.setAttribute('aria-controls', 'wcGroupCardMoreMenu');
                more.setAttribute('aria-expanded', 'false');
                // Tabler Icons Filled (MIT), shared with the Gomoku more control.
                more.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="21" height="21" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><circle cx="5" cy="12" r="2"/><circle cx="12" cy="12" r="2"/><circle cx="19" cy="12" r="2"/></svg>';

                cardMoreMenu = document.createElement('div');
                cardMoreMenu.id = 'wcGroupCardMoreMenu';
                cardMoreMenu.className = 'wcg-card-more-menu';
                cardMoreMenu.setAttribute('role', 'menu');
                cardMoreMenu.hidden = true;
                const toggleCardMenu = open => {
                    cardMoreMenu.hidden = !open;
                    more.setAttribute('aria-expanded', String(open));
                };
                closeCardMoreMenu = () => toggleCardMenu(false);
                more.onclick = () => toggleCardMenu(cardMoreMenu.hidden);

                const orientationItem = document.createElement('button');
                orientationItem.type = 'button';
                orientationItem.setAttribute('role', 'menuitem');
                // Heroicons Solid (MIT), shared with the Gomoku menu.
                const orientationIcon = gomokuMenuIcon('restart');
                const orientationLabel = document.createElement('span');
                const refreshOrientationLabel = () => {
                    const orientation = isMahjongTable ? mahjongTableOrientation : cardTableOrientation;
                    orientationLabel.textContent = orientation === 'landscape' ? '切换为竖屏' : '切换为横屏';
                };
                refreshOrientationLabel();
                orientationItem.innerHTML = orientationIcon;
                orientationItem.append(orientationLabel);
                orientationItem.onclick = () => {
                    if (isMahjongTable) mahjongTableOrientation = mahjongTableOrientation === 'landscape' ? 'portrait' : 'landscape';
                    else cardTableOrientation = cardTableOrientation === 'landscape' ? 'portrait' : 'landscape';
                    refreshOrientationLabel();
                    closeCardMoreMenu();
                    syncGroupGameLandscape();
                };

                // Reuse the Gomoku menu's read-only record and rules actions.
                cardDetailOverlay = document.createElement('div');
                cardDetailOverlay.id = 'wcGroupCardDetailOverlay';
                cardDetailOverlay.className = 'wcg-card-detail-overlay';
                cardDetailOverlay.hidden = true;
                const detailDialog = document.createElement('section');
                detailDialog.className = 'wcg-card-detail-sheet';
                detailDialog.setAttribute('role', 'dialog');
                detailDialog.setAttribute('aria-modal', 'true');
                detailDialog.setAttribute('aria-labelledby', 'wcGroupCardDetailTitle');
                const detailHead = document.createElement('div');
                detailHead.className = 'wcg-card-detail-head';
                const detailTitle = document.createElement('strong');
                detailTitle.id = 'wcGroupCardDetailTitle';
                const detailBody = document.createElement('div');
                detailBody.className = 'wcg-card-detail-content';
                const detailFooter = document.createElement('div');
                detailFooter.className = 'wcg-card-detail-footer';
                const detailClose = document.createElement('button');
                detailClose.type = 'button';
                detailClose.className = 'wcg-card-detail-dismiss';
                detailClose.textContent = '关闭';
                const closeCardDetail = () => { cardDetailOverlay.hidden = true; };
                detailClose.onclick = closeCardDetail;
                cardDetailOverlay.onclick = event => {
                    if (event.target === cardDetailOverlay) closeCardDetail();
                };
                detailHead.append(detailTitle);
                detailFooter.append(detailClose);
                detailDialog.append(detailHead, detailBody, detailFooter);
                cardDetailOverlay.append(detailDialog);
                const addCardRule = (heading, body) => {
                    const title = document.createElement('h4');
                    title.textContent = heading;
                    const paragraph = document.createElement('p');
                    paragraph.textContent = body;
                    detailBody.append(title, paragraph);
                };
                const openCardDetail = type => {
                    closeCardMoreMenu();
                    const showingRules = type === 'rules';
                    cardDetailOverlay.className = 'wcg-card-detail-overlay ' + (showingRules ? 'is-rules' : 'is-record');
                    detailBody.replaceChildren();
                    detailBody.scrollTop = 0;
                    if (showingRules) {
                        detailTitle.textContent = isMahjongTable ? '麻将 · 对局规则' : '斗地主 · 对局规则';
                        (isMahjongTable ? [
                            ['本局玩法', '四人好友麻将，不计番数或积分。支持吃碰杠、摸打、自摸、点炮胡、七对、抢补杠和流局。'],
                            ['吃牌与优先级', '只有下家可以吃顺子；其他玩家可以碰、明杠或胡。胡牌优先，其次碰或杠，最后吃；同优先级按出牌者下家起顺序响应。'],
                            ['明杠·暗杠·补杠', '可用三张同牌杠他人的弃牌，或用四张自摸暗杠，已有碰牌可加杠。杠后摸一张补牌；补杠可被抢杠胡。'],
                            ['响应与流局', '看到吃碰杠胡提示时可选择操作或过。对方行动需要点击继续一轮；牌墙耗尽且无人接牌时流局。']
                        ] : [
                            ['三人快速局', '随机确定地主。地主拥有20张牌，另外两位玩家各17张；本玩法没有叫地主、积分或押注。'],
                            ['出牌与大小', '支持单张、对子、三张、顺子、连对、三连张、三带一、三带二、四带二、炸弹与王炸等牌型。同牌型且张数相同时比较大小；炸弹与王炸有额外优先级。'],
                            ['不要与重新领出', '别人出牌后可以选择“不要”。连续两人不要，就由上次出牌者重新领出。'],
                            ['胜负条件', '任一玩家出完手牌，游戏立即结束；地主出完则地主获胜，农民任一方出完则农民获胜。']
                        ]).forEach(([heading, body]) => addCardRule(heading, body));
                    } else {
                        detailTitle.textContent = '本局出牌记录';
                        const summary = document.createElement('p');
                        summary.textContent = '已进行 ' + gameMessage.activity.moves.length + ' 手 · 按最新在前排列';
                        detailBody.append(summary);
                        if (!gameMessage.activity.moves.length) {
                            const empty = document.createElement('p');
                            empty.className = 'wcg-card-detail-empty';
                            empty.textContent = '本局尚未有人出牌';
                            detailBody.append(empty);
                        } else {
                            const list = document.createElement('div');
                            list.className = 'wcg-card-record';
                            gameMessage.activity.moves.forEach((move, index) => {
                                const row = document.createElement('div');
                                row.className = 'wcg-card-record-item';
                                const heading = document.createElement('strong');
                                heading.textContent = String(index + 1).padStart(2, '0') + ' · ' + (gameMessage.activity.players[move.seat]?.name || '玩家');
                                const action = document.createElement('span');
                                action.textContent = window.WcGroupGames.describeMove(gameMessage.activity, move);
                                row.append(heading, action);
                                list.prepend(row);
                            });
                            detailBody.append(list);
                        }
                    }
                    cardDetailOverlay.hidden = false;
                    detailClose.focus({ preventScroll: true });
                };
                const cardMenuAction = (icon, label, action) => {
                    const button = document.createElement('button');
                    button.type = 'button';
                    button.setAttribute('role', 'menuitem');
                    button.innerHTML = gomokuMenuIcon(icon);
                    const caption = document.createElement('span');
                    caption.textContent = label;
                    button.append(caption);
                    button.onclick = action;
                    return button;
                };
                const recordItem = cardMenuAction('record', '查看出牌记录', () => openCardDetail('record'));
                const rulesItem = cardMenuAction('rules', '对局规则', () => openCardDetail('rules'));

                const separator = document.createElement('div');
                separator.className = 'wcg-card-menu-sep';
                separator.setAttribute('role', 'separator');
                const endItem = document.createElement('button');
                endItem.type = 'button';
                endItem.className = 'wcg-card-menu-danger';
                endItem.setAttribute('role', 'menuitem');
                endItem.setAttribute('aria-label', '结束本局');
                cardTableIcon(endItem, 'end');
                const endLabel = document.createElement('span');
                endLabel.textContent = '结束本局';
                endItem.append(endLabel);
                const canEndCard = canManage(group) || gameMessage.activity.players.some(p => p.id === USER_ID);
                endItem.disabled = !canEndCard || gameMessage.activity.status !== 'playing';
                endItem.onclick = () => {
                    closeCardMoreMenu();
                    return endGroupGame(messageId).catch(report);
                };
                cardMoreMenu.append(recordItem, orientationItem, separator, rulesItem, endItem);
                gameBoard.addEventListener('pointerdown', event => {
                    if (!cardMoreMenu.hidden && !cardMoreMenu.contains(event.target) && !more.contains(event.target)) {
                        closeCardMoreMenu();
                    }
                });
                gameBoard.addEventListener('keydown', event => {
                    if (event.key === 'Escape') {
                        if (!cardDetailOverlay.hidden) closeCardDetail();
                        else closeCardMoreMenu();
                    }
                });
                toolbar.append(back, heading, chatToggle, more);
                if (chatPopup) {
                    const chatHead = document.createElement('div');
                    chatHead.className = 'wcg-card-chat-heading';
                    const titleGroup = document.createElement('div');
                    titleGroup.className = 'wcg-card-chat-title';
                    const chatTitle = document.createElement('strong');
                    chatTitle.textContent = '围观聊天';
                    const chatMeta = document.createElement('small');
                    chatMeta.textContent = gameSpectators(group, gameMessage).length + ' 人围观 · ' +
                        gameChatItems(group, gameMessage).length + ' 条消息';
                    titleGroup.append(chatTitle, chatMeta);
                    // Match the Gomoku drawer: heading on the left, compact spectator
                    // avatars on the right, and the full message feed below.
                    const audience = chatPopup.querySelector('.wcg-card-chat-spectators');
                    chatHead.append(titleGroup);
                    if (audience) chatHead.append(audience);
                    chatPopup.replaceChildren(chatHead, ...Array.from(chatPopup.children));
                }
            } else toolbar.append(back, chatToggle);
        }
        if (gameMessage.activity.status === 'playing' && gameMessage.activity.players[gameMessage.activity.turn]?.id !== USER_ID) {
            const next = document.createElement('button');
            next.id = 'wcGroupGameNext';
            next.type = 'button'; next.className = 'wcg-secondary wcg-game-continue';
            next.textContent = gameBotBusy ? '正在生成本回合…' : pausedGameId === messageId ? '重试这一回合' :
                ['cards', 'mahjong'].includes(gameMessage.activity.gameType) ? '继续一轮' : '生成下一回合';
            next.disabled = requests.has(group.id) || gameBotBusy || gameCommentBusy;
            next.onclick = () => { pausedGameId = ''; return runGroupGameTurn(group, messageId).catch(report); };
            if (landscape) {
                next.className += ' wcg-game-top-button';
                if (['cards', 'mahjong'].includes(gameMessage.activity.gameType)) cardTableIcon(next, 'turn');
                else gameToolbarIcon(next, 'turn');
            } else if (gomokuActions) {
                next.className += ' wcg-gomoku-next';
                // Heroicons Solid (MIT), filled play icon from the selected layout.
                next.insertAdjacentHTML('afterbegin', '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path fill-rule="evenodd" d="M4.5 5.653c0-1.427 1.529-2.33 2.779-1.643l11.54 6.347c1.295.712 1.295 2.573 0 3.286L7.28 19.99c-1.25.687-2.779-.217-2.779-1.643V5.653Z" clip-rule="evenodd"/></svg>');
            } else gameToolbarIcon(next, 'turn');
            if (['cards', 'mahjong'].includes(gameMessage.activity.gameType)) {
                gameBoard.classList.add('wcg-waiting-bot');
                gameBoard.append(next);
            } else toolbar.append(next);
        }
        const canEnd = canManage(group) ||
            gameMessage.activity.players.some(p => p.id === USER_ID);
        if (gameMessage.activity.gameType === 'gomoku' && canEnd && gameMessage.activity.status === 'playing') {
            const cancel = document.createElement('button');
            cancel.type = 'button';
            cancel.className = 'wc-group-activity-submit';
            cancel.style.marginTop = '12px';
            cancel.style.background = 'rgba(128,128,128,.10)';
            cancel.style.color = '#8e8e93';
            cancel.textContent = gomokuActions ? '结束' : '结束本局';
            if (landscape) {
                cancel.className = 'wcg-game-top-button wcg-game-end-button';
                cancel.style.marginTop = '';
                cancel.style.background = '';
                cancel.style.color = '';
                gameToolbarIcon(cancel, 'end');
            } else if (gomokuActions) {
                cancel.className = 'wcg-gomoku-end';
                cancel.style.marginTop = '';
                cancel.style.background = '';
                cancel.style.color = '';
                cancel.title = '结束本局';
                cancel.setAttribute('aria-label', '结束本局');
                // Heroicons Solid (MIT), filled finish-flag icon.
                cancel.insertAdjacentHTML('afterbegin', '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path fill-rule="evenodd" d="M3 2.25a.75.75 0 0 1 .75.75v.54l1.838-.46a9.75 9.75 0 0 1 6.725.738l.108.054A8.25 8.25 0 0 0 18 4.524l3.11-.732a.75.75 0 0 1 .917.81 47.784 47.784 0 0 0 .005 10.337.75.75 0 0 1-.574.812l-3.114.733a9.75 9.75 0 0 1-6.594-.77l-.108-.054a8.25 8.25 0 0 0-5.69-.625l-2.202.55V21a.75.75 0 0 1-1.5 0V3A.75.75 0 0 1 3 2.25Z" clip-rule="evenodd"/></svg>');
            }
            cancel.onclick = () => endGroupGame(messageId).catch(report);
            if (gomokuActions) toolbar.insertBefore(cancel, toolbar.firstChild);
            else toolbar.append(cancel);
        }
        if (gomokuActions) {
            if (gomokuActions.children.length) {
                const frame = gameBoard.querySelector?.('.wcg-gomoku-board-frame');
                if (frame) frame.insertAdjacentElement('afterend', gomokuActions);
                else gameBoard.append(gomokuActions);
            }
            gameBoard.append(hint);
            const dock = document.createElement('footer');
            dock.className = 'wcg-gomoku-chat-dock' + (chatOpen ? ' open' : '');
            const chatToggle = document.createElement('button');
            chatToggle.type = 'button';
            chatToggle.className = 'wcg-gomoku-chat-toggle';
            chatToggle.setAttribute('aria-label', chatOpen ? '收起围观聊天' : '展开围观聊天');
            chatToggle.setAttribute('aria-controls', 'wcGroupGameChatDrawer');
            chatToggle.setAttribute('aria-expanded', String(chatOpen));
            // Tabler Icons Filled (MIT), embedded chat toggle.
            chatToggle.innerHTML = '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M20.901 14.995l-.044 -.006a.4 .4 0 0 1 -.102 -.02l-.045 -.012l-.048 -.017l-.045 -.016l-.043 -.02l-.045 -.022l-.04 -.024l-.044 -.026l-.043 -.032l-.036 -.027a1 1 0 0 1 -.073 -.066l-2.707 -2.707h-6.586a2 2 0 0 1 -2 -2v-6a2 2 0 0 1 2 -2h9a2 2 0 0 1 2 2v10a1 1 0 0 1 -.076 .383l-.02 .043l-.022 .045l-.024 .04l-.026 .044l-.032 .043l-.027 .036a1 1 0 0 1 -.578 .347l-.052 .008l-.044 .006a1 1 0 0 1 -.198 0"/><path d="M7 8.999v1.001a4 4 0 0 0 4 4h4v3a2 2 0 0 1 -2 2h-6.586l-2.707 2.707c-.63 .63 -1.707 .184 -1.707 -.707v-10a2 2 0 0 1 2 -2z"/></svg>';
            chatToggle.onclick = () => {
                const open = !dock.classList.contains('open');
                dock.classList.toggle('open', open);
                discussion.hidden = !open;
                chatToggle.setAttribute('aria-expanded', String(open));
                chatToggle.setAttribute('aria-label', open ? '收起围观聊天' : '展开围观聊天');
                if (open) {
                    const feed = discussion.querySelector('.wcg-gomoku-chat-feed');
                    if (feed) feed.scrollTop = feed.scrollHeight;
                }
            };
            discussion.id = 'wcGroupGameChatDrawer';
            discussion.hidden = !chatOpen;
            dock.append(discussion);
            if (commentForm) {
                commentForm.insertBefore(chatToggle, commentForm.firstChild);
                dock.append(commentForm);
            } else {
                const readonly = document.createElement('div');
                readonly.className = 'wcg-gomoku-readonly';
                readonly.append(chatToggle, document.createTextNode('围观聊天 · 仅参与群成员可发送'));
                dock.append(readonly);
            }
            const sheet = container.querySelector('.wc-group-panel-sheet');
            if (sheet) sheet.append(dock);
        } else if (commentForm) chatTarget.append(commentForm);
        if (landscape) {
            gameBoard.append(toolbar, chatPopup);
            if (cardMoreMenu) gameBoard.append(cardMoreMenu);
            if (cardDetailOverlay) gameBoard.append(cardDetailOverlay);
        }
        const currentFeed = landscape ? chatPopup?.querySelector?.('.wcg-card-chat-feed') : discussion.querySelector?.('.wcg-gomoku-chat-feed');
        if (currentFeed) currentFeed.scrollTop = feedAtBottom ? currentFeed.scrollHeight : feedScrollTop;
        if (commentFocused) el('wcGroupGameComment')?.focus({ preventScroll: true });
        el('wcGroupPanelBody').scrollTop = scrollTop;
        showGomokuBarrage(group, gameMessage);
        refreshGroupGameStatus(group, gameMessage);
        scheduleGroupGameBot();
    }

    function gomokuControlAllowed(group, game) {
        return group && game?.gameType === 'gomoku' && group.mode === 'participate' && !group.archived &&
            canSpeak(group, group.members.find(member => member.id === USER_ID)) &&
            (canManage(group) || game.players.some(player => player.id === USER_ID));
    }

    function gomokuControlBusy(group) {
        return gameBotBusy || gameCommentBusy || gameCommentSends.has(group.id) ||
            requests.has(group.id) || activityWrites.has(group.id);
    }

    async function undoGroupGomoku(messageId) {
        const group = active();
        const current = group && gameMessages(group).find(item => item.id === messageId)?.activity;
        if (!gomokuControlAllowed(group, current)) return toast('只有对局成员或群管理员可以悔棋');
        if (gomokuControlBusy(group)) return toast('本回合尚未完成，请稍后再试');
        if (typeof window.WcGroupGames?.undoGomoku !== 'function') return toast('游戏资源需要更新，请刷新后重试');
        if (current.status !== 'playing' || !current.moves.length) return toast('本局当前无法悔棋');
        let reverted;
        const saved = await transactActivity((draft, messages) => {
            const target = messages.find(item => item.id === messageId && item.activity?.kind === 'game' && !item.recalled);
            if (!target || !gomokuControlAllowed(draft, target.activity)) return false;
            reverted = window.WcGroupGames.undoGomoku(target.activity);
            if (!reverted) return false;
            const position = String.fromCharCode(65 + reverted.at % 15) +
                (15 - Math.floor(reverted.at / 15));
            publicMessage(draft, 'system', '五子棋 · ' + operatorName(draft) + '悔棋：撤销第 ' +
                reverted.number + ' 手（' + position + '）。棋局以更新后的棋盘为准。',
                { includeInContext: true, gameMessageId: messageId }, messages);
            draft.updatedAt = Date.now();
            return true;
        }, null, group);
        if (!saved) return toast('悔棋失败，请重试');
        pausedGameId = '';
        gameBarrageSeen.delete(messageId);
        toast('已撤销最近一手');
    }

    async function restartGroupGomoku(messageId) {
        const group = active();
        const current = group && gameMessages(group).find(item => item.id === messageId)?.activity;
        if (!gomokuControlAllowed(group, current)) return toast('只有对局成员或群管理员可以重新开局');
        if (gomokuControlBusy(group)) return toast('本回合尚未完成，请稍后再试');
        const approved = await showCustomConfirm('重新开始本局？',
            '将由原来的两位棋手开启一局新棋。旧棋谱和群聊消息会保留。', '重新开始', true);
        if (!approved || active() !== group || gomokuControlBusy(group)) return;
        let newMessageId = '';
        const saved = await transactActivity((draft, messages) => {
            const old = messages.find(item => item.id === messageId && item.activity?.kind === 'game' && !item.recalled);
            if (!old || !gomokuControlAllowed(draft, old.activity)) return false;
            const participantIds = old.activity.players.map(player => player.id);
            if (old.activity.status === 'playing') {
                old.activity.status = 'finished';
                old.activity.result = '已重新开局';
                old.activity.lastTurnId = '';
                old.activity.updatedAt = Date.now();
                finishGroupGameMessage(draft, messages, old);
            }
            const fresh = createGroupGame(draft, messages, USER_ID, 'gomoku', participantIds);
            if (!fresh) return false;
            newMessageId = fresh.id;
            draft.updatedAt = Date.now();
            return true;
        }, null, group);
        if (!saved || !newMessageId) return toast('重新开局失败，请检查棋手是否仍在群内');
        pausedGameId = '';
        if (active() === group && el('wcGroupPanel')?.dataset.gameMessageId === messageId) {
            openGroupGame(newMessageId);
        }
        toast('新的一局已开始');
    }

    async function endGroupGame(messageId) {
        const group = active();
        if (!group) return;
        const permitted = canManage(group) ||
            gameMessages(group).find(item => item.id === messageId)?.activity?.players?.some(p => p.id === USER_ID);
        if (!permitted) return;
        const accepted = await showCustomConfirm('结束游戏', '确定要结束当前对局吗？进度会保留在群聊卡片里。', '结束', true);
        if (!accepted || active() !== group) return;
        const saved = await transactActivity((draft, messages) => {
            const message = messages.find(item => item.id === messageId && item.activity?.kind === 'game');
            if (!message || message.activity.status !== 'playing') return false;
            message.activity.status = 'finished';
            message.activity.result = '对局已手动结束';
            message.activity.updatedAt = Date.now();
            message.activity.lastTurnId = '';
            finishGroupGameMessage(draft, messages, message);
            draft.updatedAt = Date.now();
            return true;
        }, null, group);
        if (!saved) toast('未能结束游戏，请重试');
    }

    async function playGroupGame(messageId, move) {
        const group = active();
        if (!group || !window.WcGroupGames || group.archived ||
            group.mode !== 'participate' || !canSpeak(group, group.members.find(p => p.id === USER_ID))) return;
        const worked = await transactActivity((draft, messages) => {
            const target = messages.find(item => item.id === messageId && item.activity?.kind === 'game' && !item.recalled);
            if (!target || !target.activity.players.some(p => p.id === USER_ID)) return false;
            if (!window.WcGroupGames.play(target.activity, USER_ID, move)) return false;
            target.activity.lastTurnId = '';
            target.activity.lastActor = USER_ID;
            publicMessage(draft, 'system', memberName(draft.members.find(p => p.id === USER_ID)) + ' · ' +
                window.WcGroupGames.describeMove(target.activity), { gameMessageId: messageId }, messages);
            finishGroupGameMessage(draft, messages, target);
            draft.updatedAt = Date.now();
            return true;
        }, null, group);
        if (!worked) toast('当前不能这样操作，请检查是否轮到你或牌型是否有效');
    }

    function scheduleGroupGameBot() {
        // Games advance only through the explicit next-round control.
        if (gameBotTimer !== null) clearTimeout(gameBotTimer);
        gameBotTimer = null;
        const group = active();
        const shownId = !el('wcGroupPanel')?.hidden && el('wcGroupPanel')?.dataset.gameMessageId;
        const message = group && gameMessages(group).find(item => item.id === shownId);
        if (message) refreshGroupGameStatus(group, message);
    }

    async function runGroupGameTurn(group, messageId) {
        if (gameBotBusy || gameCommentBusy || gameCommentSends.has(group.id) || requests.has(group.id) || active() !== group || account !== currentAccount() ||
            document.visibilityState === 'hidden' || !el('page-group-chat')?.classList.contains('active')) return false;
        const target = gameMessages(group).find(item => item.id === messageId);
        if (!gameIsAvailable(group, target) || target.activity.players[target.activity.turn]?.id === USER_ID) return false;
        if (gameBotTimer !== null) clearTimeout(gameBotTimer);
        gameBotTimer = null;
        const latestUserId = rows(group).filter(item => item.senderId === USER_ID).at(-1)?.id;
        const priorMoves = target.activity.moves.length, priorStatus = target.activity.status;
        gameBotBusy = true;
        gameThinking = { groupId: group.id, messageId, memberId: target.activity.players[target.activity.turn].id, steps: priorMoves };
        refreshGameDiscussion(group);
        try {
            const moved = await generate('', '', messageId);
            // Failures require a deliberate retry, rather than repeatedly consuming API calls.
            if (!moved && latestUserId === rows(group).filter(item => item.senderId === USER_ID).at(-1)?.id) pausedGameId = messageId;
            return moved;
        } finally {
            gameBotBusy = false;
            gameThinking = null;
            if (active() === group && el('wcGroupPanel')?.dataset.gameMessageId === messageId) {
                const current = gameMessages(group).find(item => item.id === messageId)?.activity;
                if (current && (current.moves.length !== priorMoves || current.status !== priorStatus)) openGroupGame(messageId);
                else refreshGameDiscussion(group);
            }
            scheduleGroupGameBot();
        }
    }

    function chooseGameSpeakers(group, messages, messageId) {
        const target = messages.find(item => item.id === messageId && !item.recalled);
        if (!gameIsAvailable(group, target)) return [];
        const actorId = target.activity.players[target.activity.turn]?.id;
        const candidates = group.members.filter(member => member.id !== USER_ID && canSpeak(group, member) &&
            (member.kind === 'npc' || wcContactsList.some(contact => contact.id === member.id)) &&
            visibleMessages(group, member, messages).some(item => item.id === messageId));
        const actor = candidates.find(member => member.id === actorId);
        if (!actor || !target.activity.players.every(player => group.members.some(member => member.id === player.id))) return [];
        const recent = messages.filter(message => message && !message.recalled && message.includeInContext !== false &&
            message.senderId !== 'system' && message.type !== 'system_event' &&
            (!message.gameMessageId || message.gameMessageId === messageId) &&
            (!message.activity || message.activity.kind !== 'game' || message.id === messageId)).slice(-8);
        const addressed = new Set(groupReplyTargets(group, messages, recent));
        const players = new Set(target.activity.players.map(player => player.id));
        const step = target.activity.moves.length;
        const others = candidates.filter(member => member.id !== actorId);
        const ranked = others.map((member, index) => {
            const spoken = recent.findLastIndex(message => message.senderId === member.id);
            return { member, score: (addressed.has(member.id) ? 100 : 0) +
                (spoken >= 0 ? 30 + spoken : 0) + (players.has(member.id) ? 10 : 0),
                rotation: (index - step % Math.max(1, others.length) + others.length) % Math.max(1, others.length) };
        }).sort((a, b) => b.score - a.score || a.rotation - b.rotation);
        // Only a small, relevant cast gets a chance to speak; every supplied member may stay silent.
        return [actor, ...ranked.slice(0, 2).map(item => item.member)];
    }

    function createGroupGame(group, messages, senderId, type, ids, turnId = '') {
        if (!group || group.archived || !Array.isArray(ids) || !window.WcGroupGames) return null;
        const spec = window.WcGroupGames.TYPES[type];
        if (!spec || ids.length !== spec.count || new Set(ids).size !== ids.length ||
            (ids.includes(USER_ID) && group.mode !== 'participate')) return null;
        const players = ids.map(id => group.members.find(member => member.id === id));
        if (players.some(member => !member || !canSpeak(group, member))) return null;
        if (senderId !== 'system' && !canSpeak(group, group.members.find(member => member.id === senderId))) return null;
        const game = window.WcGroupGames.make(type, players.map(member => ({ id: member.id, name: memberName(member) })));
        if (!game) return null;
        return publicMessage(group, senderId, '[群游戏] ' + spec.name + ' · ' + players.map(memberName).join('、'),
            { activity: game, actionId: uid(), includeInContext: true, ...(turnId ? { turnId } : {}) }, messages);
    }

    function createGamePanel() {
        const group = active();
        if (!group || !window.WcGroupGames ||
            (group.mode === 'participate' && !canSpeak(group, group.members.find(p => p.id === USER_ID)))) {
            toast('当前无法发起群游戏'); return;
        }
        const games = window.WcGroupGames.TYPES;
        const icons = {
            close: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M18 6l-12 12"/><path d="M6 6l12 12"/></svg>',
            check: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 12l5 5l10 -10"/></svg>',
            next: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 12h14"/><path d="M13 6l6 6l-6 6"/></svg>'
        };
        // The close, check and arrow paths are from Tabler Icons (MIT license).
        const gameArt = {
            gomoku: '<svg viewBox="0 0 112 87" aria-hidden="true"><rect x="18" y="6" width="78" height="75" rx="9" fill="#cea56e"/><rect x="24" y="12" width="66" height="63" rx="3" fill="#e5c38d"/><path d="M34 16V71M45 16V71M56 16V71M67 16V71M78 16V71M28 23H86M28 34H86M28 45H86M28 56H86M28 67H86" stroke="#a27b49" stroke-width="1.2"/><circle cx="45" cy="34" r="9" fill="#262626"/><circle cx="67" cy="45" r="9" fill="#fffef9" stroke="#b5a990" stroke-width="1.3"/><circle cx="56" cy="56" r="9" fill="#262626"/><circle cx="78" cy="34" r="7.5" fill="#fffef9" stroke="#b5a990" stroke-width="1.3"/></svg>',
            cards: '<svg viewBox="0 0 112 87" aria-hidden="true"><g transform="rotate(-19 37 48)"><rect x="12" y="15" width="42" height="61" rx="5" fill="#fff" stroke="#c3c3c9" stroke-width="1.8"/><text x="19" y="28" font-size="15" font-family="Georgia,serif" font-weight="bold" fill="#b9262b">A</text><text x="34" y="59" text-anchor="middle" font-size="33" font-family="Georgia,serif" fill="#b9262b">♥</text></g><g transform="rotate(0 57 44)"><rect x="36" y="8" width="43" height="65" rx="5" fill="#fff" stroke="#bfc0c7" stroke-width="1.8"/><text x="43" y="23" font-size="15" font-family="Georgia,serif" font-weight="bold" fill="#222">2</text><text x="58" y="56" text-anchor="middle" font-size="35" font-family="Georgia,serif" fill="#222">♠</text></g><g transform="rotate(16 78 47)"><rect x="57" y="15" width="42" height="61" rx="5" fill="#fff" stroke="#c3c3c9" stroke-width="1.8"/><text x="63" y="28" font-size="14" font-family="Georgia,serif" font-weight="bold" fill="#b9262b">J</text><text x="79" y="60" text-anchor="middle" font-size="31" font-family="Georgia,serif" fill="#b9262b">♦</text></g></svg>',
            mahjong: '<svg viewBox="0 0 112 87" aria-hidden="true"><g transform="rotate(-10 29 43)"><rect x="6" y="21" width="38" height="55" rx="6" fill="#408978"/><rect x="6" y="15" width="38" height="55" rx="6" fill="#fffdf6" stroke="#ccd1cc" stroke-width="1.8"/><text x="25" y="52" text-anchor="middle" font-size="29" font-weight="850" fill="#277c51">發</text></g><g transform="rotate(2 58 41)"><rect x="38" y="13" width="39" height="58" rx="6" fill="#388271"/><rect x="38" y="7" width="39" height="58" rx="6" fill="#fffdf6" stroke="#ccd1cc" stroke-width="1.8"/><text x="57.5" y="48" text-anchor="middle" font-size="32" font-weight="850" fill="#b9262b">中</text></g><g transform="rotate(11 87 45)"><rect x="71" y="19" width="36" height="54" rx="6" fill="#388271"/><rect x="71" y="13" width="36" height="54" rx="6" fill="#fffdf6" stroke="#ccd1cc" stroke-width="1.8"/><text x="89" y="51" text-anchor="middle" font-size="28" font-weight="850" fill="#2c3030">東</text></g></svg>'
        };
        const styles = `<style>
            #wechatAppUI #wcGroupPanel[data-view="game-create"] { background:rgba(0,0,0,.42); }
            #wechatAppUI #wcGroupPanel[data-view="game-create"] .wc-group-panel-sheet { height:min(560px,78%); max-height:calc(100% - 50px); min-height:0; border-radius:28px 28px 0 0; background:#fff; }
            #wechatAppUI #wcGroupPanel[data-view="game-create"] .wc-group-panel-header { display:none; }
            #wechatAppUI #wcGroupPanel[data-view="game-create"] #wcGroupPanelBody { display:flex; flex-direction:column; min-height:0; overflow:hidden; padding:0; background:#fff; }
            #wechatAppUI #wcGroupPanel[data-view="game-create"] .wcg-stage { display:flex; flex-direction:column; flex:1; min-height:0; width:100%; font-family:-apple-system,BlinkMacSystemFont,"SF Pro Display","PingFang SC",sans-serif; color:#171717; }
            .wcg-stage * { box-sizing:border-box; }
            .wcg-stage .wcg-stage-head { display:flex; justify-content:space-between; align-items:flex-start; gap:10px; flex:none; padding:20px 19px 0; }
            .wcg-stage .wcg-stage-eyebrow { color:#888888; font-size:10px; font-weight:800; letter-spacing:.12em; }
            .wcg-stage .wcg-stage-title { margin:4px 0 0; font-size:22px; line-height:1.25; font-weight:780; letter-spacing:-.6px; color:#111111; }
            .wcg-stage .wcg-stage-close { display:grid; place-items:center; flex:none; width:31px; height:31px; padding:8px; border:0; border-radius:50%; background:#f3f3f3; color:#696969; cursor:pointer; }
            .wcg-stage .wcg-stage-close svg { width:15px; height:15px; display:block; }
            .wcg-stage .wcg-stage-content { flex:1; min-height:0; overflow-y:auto; overscroll-behavior:contain; -webkit-overflow-scrolling:touch; scrollbar-width:none; padding:0 19px 10px; }
            .wcg-stage .wcg-stage-content::-webkit-scrollbar { display:none; }
            .wcg-stage .wcg-stage-theater { height:183px; position:relative; margin:13px 0 14px; flex:none; overflow:hidden; border:1px solid #e6e6e6; border-radius:23px; background:#ffffff; }
            .wcg-stage .wcg-stage-theater:before, .wcg-stage .wcg-stage-theater:after { content:""; position:absolute; top:50%; left:50%; transform:translate(-50%,-50%); border-radius:50%; pointer-events:none; }
            .wcg-stage .wcg-stage-theater:before { width:174px; height:136px; border:1px solid #dedede; }
            .wcg-stage .wcg-stage-theater:after { width:135px; height:105px; border:1px dashed #dedede; }
            .wcg-stage .wcg-stage-art { position:absolute; top:43%; left:50%; transform:translate(-50%,-50%); width:132px; height:104px; z-index:1; filter:drop-shadow(0 8px 6px rgba(0,0,0,.09)); }
            .wcg-stage .wcg-stage-art svg { width:100%; height:100%; display:block; }
            .wcg-stage .wcg-stage-theater-name { position:absolute; bottom:11px; left:0; right:0; z-index:2; text-align:center; font-size:13px; font-weight:780; color:#242424; }
            .wcg-stage .wcg-stage-seats { position:absolute; inset:0; z-index:3; pointer-events:none; }
            .wcg-stage .wcg-stage-seat { position:absolute; display:flex; align-items:center; gap:4px; width:auto; min-width:57px; max-width:103px; height:32px; padding:3px 6px 3px 3px; border:1px dashed #d6d6d6; border-radius:999px; background:#fff; box-shadow:0 3px 8px rgba(0,0,0,.035); color:#a1a1a1; }
            .wcg-stage .wcg-stage-seat.filled { background:#f6f6f6; border:1px solid #c2c2c2; color:#262626; }
            .wcg-stage .wcg-stage-seat:nth-child(1) { left:11px; top:10px; }
            .wcg-stage .wcg-stage-seat:nth-child(2) { right:11px; top:10px; }
            .wcg-stage .wcg-stage-seat:nth-child(3) { left:11px; bottom:10px; }
            .wcg-stage .wcg-stage-seat:nth-child(4) { right:11px; bottom:10px; }
            .wcg-stage .wcg-stage-seat-avatar { width:24px; height:24px; flex:none; display:grid; place-items:center; border-radius:50%; background:#eeeeee; color:#858585; font-size:12px; font-weight:700; overflow:hidden; }
            .wcg-stage .wcg-stage-seat-avatar .wcg-stage-seat-photo { width:100%; height:100%; border-radius:50%; overflow:hidden; }
            .wcg-stage .wcg-stage-seat small { display:block; min-width:0; max-width:68px; overflow:hidden; white-space:nowrap; text-overflow:ellipsis; font-size:10px; font-weight:680; }
            .wcg-stage .wcg-stage-row-heading { display:flex; justify-content:space-between; align-items:center; gap:8px; margin:0 0 8px; }
            .wcg-stage .wcg-stage-row-heading strong { font-size:12px; font-weight:760; color:#4b4b4b; }
            .wcg-stage .wcg-stage-hint { font-size:10px; color:#969696; }
            .wcg-stage .wcg-stage-games { display:grid; grid-template-columns:repeat(3,minmax(0,1fr)); gap:7px; margin-bottom:15px; }
            .wcg-stage .wcg-stage-game { position:relative; display:flex; align-items:center; justify-content:center; gap:2px; height:48px; min-width:0; padding:2px 3px; border:1px solid #e4e4e4; border-radius:13px; background:#ffffff; color:#707070; cursor:pointer; transition:background .16s ease,border-color .16s ease,color .16s ease; }
            .wcg-stage .wcg-stage-game.is-selected { border-color:#333333; background:#f4f4f4; color:#202020; }
            .wcg-stage .wcg-stage-game:focus-within, .wcg-stage .wcg-stage-person:focus-within { outline:none; border-color:#333333; }
            .wcg-stage .wcg-stage-game input, .wcg-stage .wcg-stage-person input { position:absolute; width:1px; height:1px; opacity:0; pointer-events:none; }
            .wcg-stage .wcg-stage-game-art { width:34px; height:34px; flex:none; }
            .wcg-stage .wcg-stage-game-art svg { width:100%; height:100%; display:block; }
            .wcg-stage .wcg-stage-game-name { min-width:0; font-size:11px; font-weight:770; white-space:nowrap; }
            .wcg-stage .wcg-stage-count { font-size:11px; font-weight:700; color:#777777; }
            .wcg-stage .wcg-stage-count.warn { color:#595959; }
            .wcg-stage .wcg-stage-people { display:grid; grid-template-columns:repeat(5,minmax(0,1fr)); gap:6px; margin:0; }
            .wcg-stage .wcg-stage-person { display:flex; flex-direction:column; justify-content:center; align-items:center; position:relative; gap:4px; min-width:0; height:61px; padding:4px 2px; border:1px solid #e4e4e4; border-radius:13px; background:#fff; color:#818181; cursor:pointer; transition:background .16s ease,border-color .16s ease,color .16s ease; }
            .wcg-stage .wcg-stage-person.is-selected { background:#f5f5f5; border-color:#555555; color:#1b1b1b; }
            .wcg-stage .wcg-stage-avatar { display:block; flex:none; width:28px; height:28px; overflow:hidden; border-radius:50%; background:#ffffff; }
            .wcg-stage .wcg-stage-avatar .wc-group-choice-photo { width:100%; height:100%; border-radius:50%; overflow:hidden; }
            /* Overrides the shared 42px avatar rule so every stage avatar fits its own frame. */
            #wechatAppUI #wcGroupPanel[data-view="game-create"] .wcg-stage-avatar .wc-group-choice-photo,
            #wechatAppUI #wcGroupPanel[data-view="game-create"] .wcg-stage-seat-avatar .wcg-stage-seat-photo {
                display:block; box-sizing:border-box; width:100% !important; height:100% !important;
                min-width:0; min-height:0; flex:0 0 100% !important; border-radius:50%; overflow:hidden;
                background-color:#ffffff; background-size:contain !important; background-position:center center !important; background-repeat:no-repeat !important;
            }
            #wechatAppUI #wcGroupPanel[data-view="game-create"] .wcg-stage-avatar svg,
            #wechatAppUI #wcGroupPanel[data-view="game-create"] .wcg-stage-seat-avatar svg { display:block; width:100%; height:100%; object-fit:contain; }
            .wcg-stage .wcg-stage-person.is-selected:after { content:""; position:absolute; right:6px; top:6px; width:6px; height:6px; border-radius:50%; background:#222222; }
            .wcg-stage .wcg-stage-person-name { width:100%; text-align:center; font-size:10px; font-weight:750; overflow:hidden; text-overflow:ellipsis; white-space:nowrap; }
            .wcg-stage .wcg-stage-spectator { margin:9px 0 0; color:#888888; font-size:10px; text-align:center; }
            .wcg-stage .wcg-stage-footer { flex:none; padding:8px 19px calc(11px + env(safe-area-inset-bottom,0px)); background:#fff; border-top:1px solid #eeeeee; }
            .wcg-stage .wcg-stage-submit { display:flex; align-items:center; justify-content:center; gap:7px; width:100%; height:46px; min-height:0; border:0; margin:0; padding:0 12px; border-radius:14px; background:#1b1b1b; color:#ffffff; font-size:13px; font-weight:780; cursor:pointer; }
            .wcg-stage .wcg-stage-submit svg { width:16px; height:16px; }
            .wcg-stage .wcg-stage-submit:disabled { background:#d1d1d1; color:#fff; cursor:not-allowed; }
            .wcg-stage .wcg-stage-footer-caption { margin:7px 0 0; text-align:center; font-size:10px; color:#999999; }
            @media (max-height:650px) {
                .wcg-stage .wcg-stage-head { padding-top:14px; }
                .wcg-stage .wcg-stage-theater { height:153px; margin:9px 0 11px; }
                .wcg-stage .wcg-stage-art { width:116px; height:91px; }
                .wcg-stage .wcg-stage-games { margin-bottom:11px; }
                .wcg-stage .wcg-stage-game { height:43px; }
                .wcg-stage .wcg-stage-person { height:57px; }
            }
        </style>`;
        const options = Object.entries(games).map(([key, spec]) =>
            `<label class="wcg-stage-game">
                <input type="radio" name="gameType" value="${escape(key)}"${key === 'gomoku' ? ' checked' : ''}>
                <span class="wcg-stage-game-art" aria-hidden="true">${gameArt[key] || '🎮'}</span>
                <span class="wcg-stage-game-name">${escape(spec.name)}</span>
            </label>`).join('');
        const people = group.members.map(member =>
            `<label class="wcg-stage-person">
                <input type="checkbox" name="gamePlayer" value="${escape(member.id)}"${member.id === USER_ID ? ' checked' : ''}>
                <span class="wcg-stage-avatar" data-choice-avatar-id="${escape(member.id)}"></span>
                <span class="wcg-stage-person-name">${escape(member.id === USER_ID ? '我' : memberName(member))}</span>
            </label>`).join('');
        panel('一起玩游戏', styles + `
            <form id="wcGroupGameCreate" class="wcg-stage">
                <header class="wcg-stage-head">
                    <div><div class="wcg-stage-eyebrow">YOUR GAME ROOM</div><h2 class="wcg-stage-title">一起开一局</h2></div>
                    <button type="button" class="wcg-stage-close" id="wcgStageClose" aria-label="关闭创建游戏弹窗">${icons.close}</button>
                </header>
                <div class="wcg-stage-content">
                    <div class="wcg-stage-theater" aria-label="本局围桌席位示意">
                        <div class="wcg-stage-art" id="wcgStageArt" aria-hidden="true"></div>
                        <div class="wcg-stage-seats" id="wcgStageSeats"></div>
                        <div class="wcg-stage-theater-name" id="wcgStageGameName"></div>
                    </div>
                    <div class="wcg-stage-row-heading"><strong>01 · 游戏类型</strong><span class="wcg-stage-hint" id="wcgStageRule"></span></div>
                    <div class="wcg-stage-games">${options}</div>
                    <div class="wcg-stage-row-heading"><strong>02 · 邀请谁上场</strong><span id="wcGroupGameCount" class="wcg-stage-count" aria-live="polite"></span></div>
                    <div class="wcg-stage-people">${people || '<p class="wcg-stage-hint">群里还没有可邀请的成员</p>'}</div>
                    <p class="wcg-stage-spectator" id="wcgStageSpectator"></p>
                </div>
                <footer class="wcg-stage-footer">
                    <button type="submit" class="wcg-stage-submit" id="wcGroupGameStart">开始这场游戏 ${icons.next}</button>
                    <p class="wcg-stage-footer-caption">人数齐了，就可以开局</p>
                </footer>
            </form>`, 'game-create');
        renderChoiceAvatars(group.members);
        const form = el('wcGroupGameCreate');
        let sending = false;
        const refresh = () => {
            const type = form.querySelector('input[name="gameType"]:checked')?.value || 'gomoku';
            const spec = games[type];
            if (!spec) return;
            const ids = [...form.querySelectorAll('input[name="gamePlayer"]:checked')].map(input => input.value);
            const selectedMembers = ids.map(id => group.members.find(member => member.id === id)).filter(Boolean);
            const need = spec.count, got = ids.length;
            form.querySelectorAll('.wcg-stage-game').forEach(label => label.classList.toggle('is-selected', label.querySelector('input').checked));
            form.querySelectorAll('.wcg-stage-person').forEach(label => label.classList.toggle('is-selected', label.querySelector('input').checked));
            el('wcgStageArt').innerHTML = gameArt[type] || '';
            el('wcgStageGameName').textContent = spec.name;
            el('wcgStageRule').textContent = `${need} 人成局`;
            const seats = el('wcgStageSeats');
            seats.replaceChildren();
            for (let index = 0; index < need; index++) {
                const member = selectedMembers[index];
                const seat = document.createElement('span');
                seat.className = 'wcg-stage-seat' + (member ? ' filled' : '');
                const photo = document.createElement('span');
                photo.className = 'wcg-stage-seat-avatar';
                if (member) photo.append(avatarNode(member.avatar, memberName(member), 'wcg-stage-seat-photo'));
                else photo.textContent = '+';
                const name = document.createElement('small');
                name.textContent = member ? (member.id === USER_ID ? '我' : memberName(member)) : '空位';
                seat.append(photo, name);
                seats.append(seat);
            }
            const count = el('wcGroupGameCount');
            count.textContent = got === need ? `已选 ${got}/${need} · 可开始` : `已选 ${got}/${need} 人`;
            count.classList.toggle('warn', got > need);
            el('wcgStageSpectator').textContent = ids.includes(USER_ID) ? '你会参与本局游戏' : '你将以旁观者身份进入房间';
            el('wcGroupGameStart').disabled = sending || got !== need;
        };
        form.addEventListener('change', refresh);
        el('wcgStageClose').onclick = closePanel;
        refresh();
        form.onsubmit = event => {
            event.preventDefault();
            if (sending) return;
            const type = form.querySelector('input[name="gameType"]:checked')?.value;
            const ids = [...form.querySelectorAll('input[name="gamePlayer"]:checked')].map(input => input.value);
            const spec = games[type];
            if (!spec || ids.length !== spec.count || new Set(ids).size !== ids.length) return toast('请选择正确的参赛人数');
            const players = ids.map(id => group.members.find(member => member.id === id));
            if (players.some(member => !member)) return toast('有成员已退出群聊');
            if (players.some(member => !canSpeak(group, member))) return toast('禁言成员暂时无法参赛');
            sending = true;
            refresh();
            let createdId = '';
            transactActivity((draft, messages) => {
                const message = createGroupGame(draft, messages,
                    draft.mode === 'participate' ? USER_ID : 'system', type, ids);
                if (!message) return false;
                createdId = message.id;
                return true;
            }, null, group).then(ok => {
                if (!ok) return toast('游戏创建失败');
                if (active() === group) openGroupGame(createdId);
            }).catch(report).finally(() => {
                sending = false;
                if (el('wcGroupGameCreate') === form) refresh();
            });
        };
    }

    function renderGroupGameCard(group, message) {
        const activity = message.activity;
        const spec = window.WcGroupGames?.TYPES?.[activity.gameType];
        const gameType = ['gomoku', 'cards', 'mahjong'].includes(activity.gameType) ? activity.gameType : 'other';
        const players = Array.isArray(activity.players) ? activity.players : [];
        const finished = activity.status === 'finished';
        const name = spec?.name || '群游戏';
        const turnName = players[activity.turn]?.name || '玩家';

        const outer = document.createElement('div');
        outer.className = 'wcg-inline-card';
        outer.dataset.messageId = message.id;

        const card = document.createElement('section');
        card.className = 'wcg-invite-card';
        card.dataset.gameType = gameType;

        const main = document.createElement('div');
        main.className = 'wcg-invite-main';
        const brand = document.createElement('div');
        brand.className = 'wcg-invite-brand';
        const mark = document.createElement('span');
        mark.className = 'wcg-invite-mark';
        mark.setAttribute('aria-hidden', 'true');
        mark.innerHTML = GROUP_ICON_MARKUP['game-invite'];
        const brandText = document.createElement('span');
        brandText.textContent = '童话机 · 群游戏';
        brand.append(mark, brandText);

        const title = document.createElement('strong');
        title.className = 'wcg-invite-title';
        title.textContent = String(activity.customTitle || name + '，一起玩吗？');

        const state = document.createElement('p');
        state.className = 'wcg-invite-state';
        state.textContent = finished
            ? '对局已结束 · ' + players.length + ' 人参与'
            : '进行中 · 轮到' + turnName;
        state.title = state.textContent;

        const art = document.createElement('div');
        art.className = 'wcg-invite-art wcg-invite-art-' + gameType;
        art.setAttribute('aria-hidden', 'true');
        if (gameType === 'gomoku') {
            const board = document.createElement('div');
            board.className = 'wcg-invite-board';
            ['black', 'white', 'black', 'white', 'black'].forEach(color => {
                const stone = document.createElement('span');
                stone.className = 'wcg-invite-stone ' + color;
                board.append(stone);
            });
            art.append(board);
        } else if (gameType === 'cards') {
            [['A', '♠'], ['K', '♥'], ['Q', '♣']].forEach(([rank, suit]) => {
                const face = document.createElement('span');
                face.className = 'wcg-invite-playing-card' + (suit === '♥' ? ' red' : '');
                const corner = document.createElement('span');
                corner.className = 'wcg-invite-card-corner';
                corner.textContent = rank + suit;
                const center = document.createElement('span');
                center.className = 'wcg-invite-card-suit';
                center.textContent = suit;
                face.append(corner, center);
                art.append(face);
            });
        } else if (gameType === 'mahjong') {
            ['發', '中', '東'].forEach((label, index) => {
                const tile = document.createElement('span');
                tile.className = 'wcg-invite-mahjong-tile' + (index === 1 ? ' red' : '');
                tile.textContent = label;
                art.append(tile);
            });
        } else {
            const glyph = document.createElement('span');
            glyph.className = 'wcg-invite-other-glyph';
            glyph.textContent = '✦';
            art.append(glyph);
        }

        const members = document.createElement('p');
        members.className = 'wcg-invite-members';
        members.textContent = players.map(player => player.name || '成员').join(' · ');
        members.title = members.textContent;
        main.append(brand, title, state, art, members);

        const footer = document.createElement('div');
        footer.className = 'wcg-invite-footer';
        const source = document.createElement('span');
        source.textContent = finished ? (activity.result || '对局已结束') : players.length + ' 人正在对局';
        source.title = source.textContent;
        const entry = document.createElement('button');
        entry.type = 'button';
        entry.className = 'wcg-invite-enter';
        entry.textContent = finished ? '查看对局' : '进入游戏';
        entry.setAttribute('aria-label', entry.textContent + '：' + name);
        entry.onclick = () => openGroupGame(message.id);
        footer.append(source, entry);
        card.append(main, footer);
        outer.append(card);
        bindBubbleLongPress(outer, message.id);
        return outer;
    }

    function renderActivityCard(group, message) {
        const activity = message.activity;
        if (activity.kind === 'redpacket') return renderRedPacketCard(group, message);
        const isPoll = activity.kind === 'poll';
        const card = document.createElement('section');
        card.className = 'wc-group-activity-card ' + (isPoll ? 'wcg-poll-card' : 'wcg-relay-card');
        const expired = Boolean(activity.closesAt && Date.now() >= activity.closesAt);
        const heading = document.createElement('div');
        heading.className = 'wcg-activity-heading';
        const kind = document.createElement('span');
        kind.className = 'wcg-activity-kind';
        kind.textContent = isPoll ? '群投票' : '群接龙';
        const status = document.createElement('span');
        status.className = 'wcg-activity-status';
        status.textContent = expired ? '已截止' : '进行中';
        heading.append(kind, status);
        const title = document.createElement('strong');
        title.className = 'wcg-activity-title';
        title.textContent = activity.title;
        const meta = document.createElement('small');
        meta.className = 'wcg-activity-meta';
        meta.textContent = activity.closesAt ? '截止 ' + new Date(activity.closesAt).toLocaleString() : '无截止时间';
        card.append(heading, title, meta);
        const canAct = group.mode === 'participate' && !expired &&
            activityEligible(group, message, USER_ID) &&
            canSpeak(group, group.members.find(item => item.id === USER_ID));
        if (isPoll) {
            const votes = activity.votes || {};
            const previous = votes[USER_ID] || [];
            const voters = Object.keys(votes).length;
            const summary = document.createElement('div');
            summary.className = 'wcg-poll-summary';
            summary.textContent = (activity.multiple ? '多选 · 最多 ' + activity.maxChoices + ' 项' : '单选') +
                (activity.anonymous ? ' · 匿名' : '') + ' · ' + voters + ' 人参与';
            card.append(summary);
            const form = document.createElement('form');
            form.className = 'wc-group-activity-form wcg-poll-choices';
            for (const option of activity.options) {
                const count = Object.values(votes).filter(ids => Array.isArray(ids) && ids.includes(option.id)).length;
                const label = document.createElement('label');
                label.className = 'wc-group-activity-option wcg-poll-choice';
                if (previous.includes(option.id)) label.classList.add('is-chosen');
                if (canAct && (activity.allowChange || !previous.length)) {
                    const input = document.createElement('input');
                    input.type = activity.multiple ? 'checkbox' : 'radio';
                    input.name = 'choice';
                    input.value = option.id;
                    input.checked = previous.includes(option.id);
                    label.append(input);
                }
                const caption = document.createElement('span');
                caption.textContent = option.text;
                const total = document.createElement('em');
                total.textContent = count + ' 票';
                label.append(caption, total);
                const track = document.createElement('div');
                track.className = 'wcg-poll-progress';
                const fill = document.createElement('span');
                fill.style.width = (voters ? Math.min(100, Math.round(count / voters * 100)) : 0) + '%';
                track.append(fill);
                label.append(track);
                form.append(label);
            }
            if (canAct && (activity.allowChange || !previous.length)) {
                const button = document.createElement('button');
                button.type = 'submit';
                button.className = 'wc-group-activity-submit wcg-activity-primary';
                button.textContent = previous.length ? '修改投票' : '提交投票';
                form.append(button);
                form.onsubmit = event => {
                    event.preventDefault();
                    const ids = [...form.querySelectorAll('input[name="choice"]:checked')].map(input => input.value);
                    if (ids.length > activity.maxChoices) return toast('最多选择 ' + activity.maxChoices + ' 项');
                    button.disabled = true;
                    transactActivity((draft, messages) => updateActivity(draft, messages, message.id, USER_ID, 'vote', ids))
                        .then(ok => { if (!ok) toast('投票未提交，请检查选择或截止状态'); })
                        .catch(report).finally(() => { button.disabled = false; });
                };
            } else if (previous.length) {
                const done = document.createElement('small');
                done.className = 'wcg-activity-done';
                done.textContent = '你已投票';
                form.append(done);
            }
            card.append(form);
        } else if (activity.kind === 'relay') {
            const count = document.createElement('div');
            count.className = 'wcg-relay-summary';
            count.textContent = (activity.entries || []).length + ' 人已接龙';
            card.append(count);
            if (activity.description) {
                const intro = document.createElement('p');
                intro.className = 'wcg-relay-description';
                intro.textContent = activity.description;
                card.append(intro);
            }
            if (activity.sample) {
                const sample = document.createElement('div');
                sample.className = 'wcg-relay-entry wcg-relay-sample';
                const index = document.createElement('span');
                index.className = 'wcg-relay-index';
                index.textContent = '例';
                const text = document.createElement('span');
                text.className = 'wcg-relay-entry-text';
                text.textContent = activity.sample;
                sample.append(index, text);
                card.append(sample);
            }
            for (const [index, entry] of (activity.entries || []).entries()) {
                const line = document.createElement('div');
                line.className = 'wc-group-activity-entry wcg-relay-entry';
                const sender = group.members.find(item => item.id === entry.memberId);
                const isOwn = entry.memberId === USER_ID;
                const number = document.createElement(canAct && isOwn ? 'button' : 'span');
                number.className = 'wcg-relay-index' + (canAct && isOwn ? ' is-removable' : '');
                number.textContent = String(index + 1);
                if (canAct && isOwn) {
                    number.type = 'button';
                    number.setAttribute('aria-label', '删除我的第 ' + (index + 1) + ' 条接龙');
                    number.onclick = async () => {
                        const confirmed = await showCustomConfirm('删除我的接龙', '确定删除这条接龙记录吗？', '删除', true);
                        if (!confirmed || active() !== group) return;
                        try {
                            const ok = await transactActivity((draft, messages) =>
                                updateActivity(draft, messages, message.id, USER_ID, 'leave'));
                            if (!ok) toast('接龙未删除，请检查截止状态');
                        } catch (error) { report(error); }
                    };
                }
                const body = document.createElement('div');
                body.className = 'wcg-relay-entry-body';
                const name = document.createElement('strong');
                name.textContent = sender ? memberName(sender) : '原群成员';
                const content = document.createElement('span');
                content.className = 'wcg-relay-entry-text';
                content.textContent = entry.text;
                body.append(name, content);
                line.append(number, body);
                card.append(line);
            }
            if (canAct) {
                const form = document.createElement('form');
                form.className = 'wc-group-activity-form wcg-relay-join';
                const input = document.createElement('textarea');
                input.rows = 2;
                input.required = true;
                input.maxLength = 180;
                input.placeholder = '填写你的接龙内容';
                input.value = activity.entries.find(entry => entry.memberId === USER_ID)?.text || '';
                const button = document.createElement('button');
                button.type = 'submit';
                button.className = 'wc-group-activity-submit wcg-activity-primary';
                button.textContent = input.value ? '修改我的接龙' : '加入接龙';
                form.append(input, button);
                form.onsubmit = event => {
                    event.preventDefault();
                    button.disabled = true;
                    transactActivity((draft, messages) => updateActivity(draft, messages, message.id, USER_ID, 'join', input.value))
                        .then(ok => { if (!ok) toast('接龙未更新，请检查截止状态'); })
                        .catch(report).finally(() => { button.disabled = false; });
                };
                card.append(form);
            }
        }
        return card;
    }



    function createRedPacketPanel() {
        const group = active();
        if (!group || group.mode !== 'participate' ||
            !canSpeak(group, group.members.find(item => item.id === USER_ID))) return toast('当前不能发送群红包');
        const defaultCount = Math.max(1, Math.min(100, group.members.length));
        panel('发群红包',
            '<form id="wcGroupCreateRedPacket" class="wcg-redpacket-compose">' +
            '<div class="wcg-redpacket-fields">' +
            '<div class="wcg-redpacket-segment" role="group" aria-label="红包类型">' +
            '<button type="button" data-mode="lucky" class="is-active" aria-pressed="true">拼手气红包</button>' +
            '<button type="button" data-mode="equal" aria-pressed="false">普通红包</button></div>' +
            '<input type="hidden" name="mode" value="lucky">' +
            '<label class="wcg-redpacket-field"><span class="wcg-redpacket-field-label"><strong id="wcgRedpacketAmountLabel">红包总金额</strong>' +
            '<small id="wcgRedpacketAmountHint">总金额随机分配给群成员</small></span>' +
            '<span class="wcg-redpacket-entry"><input name="amount" type="number" inputmode="decimal" step="0.01" min="0.01" max="20000" required value="10.00" aria-label="红包金额"><span>元</span></span></label>' +
            '<label class="wcg-redpacket-field"><span class="wcg-redpacket-field-label"><strong>红包个数</strong><small>每人最多领取一次</small></span>' +
            '<span class="wcg-redpacket-entry"><input name="count" type="number" inputmode="numeric" min="1" max="100" step="1" required value="' + defaultCount + '" aria-label="红包个数"><span>个</span></span></label>' +
            '<label class="wcg-redpacket-field wcg-redpacket-wish"><span class="wcg-redpacket-field-label"><strong>祝福语</strong></span>' +
            '<input name="greeting" maxlength="80" value="恭喜发财，大吉大利" aria-label="红包祝福语"></label>' +
            '<p class="wcg-redpacket-note">24 小时内有效，未领取的金额到期后退还至微信零钱。角色发出的红包不会扣你的钱。</p>' +
            '<div class="wcg-redpacket-total"><span>红包总金额</span><strong><small>¥</small> <span id="wcgRedpacketTotal">10.00</span></strong></div>' +
            '</div><div class="wcg-redpacket-actions"><button id="wcgRedpacketSend" type="submit">塞钱进红包</button>' +
            '<small>从微信零钱扣除 · 发送前需确认</small></div></form>',
            'create-redpacket');
        const form = el('wcGroupCreateRedPacket');
        const saveButton = el('wcGroupPanelSave');
        if (saveButton) saveButton.hidden = true;
        const modeInput = form.elements.namedItem('mode');
        const amountInput = form.elements.namedItem('amount');
        const countInput = form.elements.namedItem('count');
        const sendButton = el('wcgRedpacketSend');
        const amounts = { lucky: '10.00', equal: '2.00' };
        let busy = false;
        const centsFromInput = () => {
            const match = /^(\d{1,5})(?:\.(\d{1,2}))?$/.exec(String(amountInput.value || '').trim());
            return match ? Number(match[1]) * 100 + Number((match[2] || '').padEnd(2, '0')) : NaN;
        };
        const refreshTotal = () => {
            const count = Number(countInput.value);
            const unit = centsFromInput();
            const total = modeInput.value === 'equal' ? unit * count : unit;
            el('wcgRedpacketTotal').textContent = Number.isSafeInteger(total) && total >= 0
                ? (total / 100).toFixed(2) : '0.00';
        };
        form.querySelectorAll('.wcg-redpacket-segment button').forEach(button => {
            button.onclick = () => {
                amounts[modeInput.value] = amountInput.value;
                modeInput.value = button.dataset.mode;
                amountInput.value = amounts[modeInput.value];
                form.querySelectorAll('.wcg-redpacket-segment button').forEach(item => {
                    const selected = item.dataset.mode === modeInput.value;
                    item.classList.toggle('is-active', selected);
                    item.setAttribute('aria-pressed', String(selected));
                });
                const equal = modeInput.value === 'equal';
                el('wcgRedpacketAmountLabel').textContent = equal ? '单个红包金额' : '红包总金额';
                el('wcgRedpacketAmountHint').textContent = equal ? '每人领取相同金额' : '总金额随机分配给群成员';
                amountInput.setAttribute('aria-label', equal ? '单个红包金额' : '红包总金额');
                refreshTotal();
            };
        });
        amountInput.addEventListener('input', refreshTotal);
        countInput.addEventListener('input', refreshTotal);
        form.onsubmit = async event => {
            event.preventDefault();
            if (busy) return;
            const data = new FormData(form);
            const amountCents = centsFromInput();
            const count = Number(data.get('count'));
            const mode = data.get('mode');
            const totalCents = mode === 'equal' ? amountCents * count : amountCents;
            if (!['lucky', 'equal'].includes(mode) ||
                !Number.isSafeInteger(amountCents) || amountCents < 1 ||
                !Number.isSafeInteger(count) || count < 1 || count > 100 ||
                !Number.isSafeInteger(totalCents) || totalCents > REDPACKET_MAX_CENTS || count > totalCents) {
                toast('请填写正确的红包金额和个数');
                return;
            }
            busy = true;
            sendButton.disabled = true;
            let paymentPending = false;
            try {
                if (typeof wcOpenApplePay !== 'function') return toast('钱包支付界面尚未就绪');
                await wcOpenApplePay({
                    amount: totalCents / 100, payee: '群红包',
                    title: '发出群红包', cashOnly: true, externalTransaction: true,
                    onSuccess: async () => {
                        try {
                            if (active() !== group) throw new Error('群聊已切换，红包未发送');
                            const ok = await transactActivity(
                                (draft, messages) => Boolean(createRedPacket(draft, messages, USER_ID, {
                                    mode, greeting: data.get('greeting'), totalCents, count
                                })),
                                (draft, messages) => {
                                    const packet = messages.at(-1);
                                    return packetWalletOperation('send', draft, packet, packet.activity.totalCents);
                                }, group);
                            if (!ok) throw new Error('红包未发送，请检查金额、个数或钱包余额');
                            if (active() === group && el('wcGroupPanel')?.dataset.view === 'create-redpacket') {
                                try { closePanel(); } catch (error) { console.warn('Packet panel refresh failed:', error); }
                            }
                        } finally {
                            busy = false;
                            sendButton.disabled = false;
                        }
                    },
                    onCancel: () => { busy = false; sendButton.disabled = false; }
                });
                paymentPending = true;
            } catch (error) {
                report(error);
            } finally {
                if (!paymentPending) { busy = false; sendButton.disabled = false; }
            }
        };
    }

    function createActivityPanel(kind) {
        const group = active();
        if (!group || group.mode !== 'participate' ||
            !canSpeak(group, group.members.find(item => item.id === USER_ID))) {
            toast('当前不能发起群活动');
            return;
        }
        const isPoll = kind === 'poll';
        const formId = isPoll ? 'wcGroupCreatePoll' : 'wcGroupCreateRelay';
        // Lucide Icons (ISC): Copyright (c) 2026 Lucide Icons and Contributors.
        // Permission to use, copy, modify, and/or distribute for any purpose, with or
        // without fee, is granted if this copyright and permission notice are retained.
        // https://lucide.dev/license — inline SVGs, no external asset request.
        const plusSvg = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 5v14M5 12h14"/></svg>';
        const relayPlusSvg = '<svg viewBox="0 0 1024 1024" xmlns="http://www.w3.org/2000/svg" aria-hidden="true"><path d="M511.829333 975.725714C242.517333 975.725714 24.210286 757.369905 24.210286 488.106667 24.210286 218.794667 242.517333 0.487619 511.829333 0.487619 781.141333 0.487619 999.448381 218.794667 999.448381 488.106667 999.448381 757.369905 781.141333 975.725714 511.829333 975.725714ZM509.098667 91.428571C290.304 91.428571 120.56381 268.824381 120.56381 487.619048 120.56381 706.413714 290.304 877.714286 509.098667 877.714286 727.942095 877.714286 905.337905 706.413714 905.337905 487.619048 905.337905 268.824381 727.942095 91.428571 509.098667 91.428571ZM707.267048 536.380952C707.267048 536.380952 560.932571 536.380952 560.932571 536.380952 560.932571 536.380952 560.932571 682.715429 560.932571 682.715429 560.932571 709.632 539.136 731.428571 512.219429 731.428571 512.219429 731.428571 512.121905 731.428571 512.121905 731.428571 485.205333 731.428571 463.408762 709.632 463.408762 682.715429 463.408762 682.715429 463.408762 536.380952 463.408762 536.380952 463.408762 536.380952 317.074286 536.380952 317.074286 536.380952 290.157714 536.380952 268.361143 514.584381 268.361143 487.66781 268.361143 487.66781 268.361143 487.570286 268.361143 487.570286 268.361143 460.653714 290.157714 438.857143 317.074286 438.857143 317.074286 438.857143 463.408762 438.857143 463.408762 438.857143 463.408762 438.857143 463.408762 292.522667 463.408762 292.522667 463.408762 265.606095 485.205333 243.809524 512.121905 243.809524 512.121905 243.809524 512.219429 243.809524 512.219429 243.809524 539.136 243.809524 560.932571 265.606095 560.932571 292.522667 560.932571 292.522667 560.932571 438.857143 560.932571 438.857143 560.932571 438.857143 707.267048 438.857143 707.267048 438.857143 734.183619 438.857143 755.98019 460.653714 755.98019 487.570286 755.98019 487.570286 755.98019 487.66781 755.98019 487.66781 755.98019 514.584381 734.183619 536.380952 707.267048 536.380952Z" fill="currentColor"/></svg>';
        const closeSvg = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M18 6 6 18M6 6l12 12"/></svg>';
        const clockSvg = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></svg>';
        const pollOption = number =>
            '<div class="wcg-poll-option-editor"><span class="wcg-poll-circle" aria-hidden="true"></span>' +
            '<input name="option" maxlength="80" required placeholder="选项 ' + number + '" aria-label="投票选项 ' + number + '">' +
            '<button class="wcg-poll-option-remove" type="button" aria-label="移除该选项">' + closeSvg + '</button></div>';
        const pollHtml =
            '<div class="wcg-compact-create wcg-poll-create">' +
            '<header class="wcg-create-intro"><small>GROUP POLL</small><h2>发起一个群投票</h2></header>' +
            '<section class="wcg-activity-block"><div class="wcg-block-heading"><strong>投票问题</strong><small>必填</small></div>' +
            '<textarea name="title" maxlength="90" rows="2" required placeholder="想问问群里的大家……" aria-label="投票问题"></textarea>' +
            '<p class="wcg-field-help">用一个简单的问题，让大家更容易选择。</p></section>' +
            '<section class="wcg-activity-block"><div class="wcg-block-heading"><strong>投票选项</strong><small id="wcgPollOptionCount">2 项 · 最多 8 项</small></div>' +
            '<div id="wcgPollOptionList">' + pollOption(1) + pollOption(2) + '</div>' +
            '<button id="wcgPollAddOption" class="wcg-poll-option-add" type="button">' + plusSvg + ' 添加选项</button></section>' +
            '<section class="wcg-activity-block wcg-poll-rules"><div class="wcg-block-heading"><strong>投票规则</strong><small>参与方式</small></div>' +
            '<div class="wcg-poll-modes"><label><input type="radio" name="multiple" value="no" checked><span>单选</span></label>' +
            '<label><input type="radio" name="multiple" value="yes"><span>多选</span></label></div>' +
            '<label id="wcgPollMaxRow" class="wcg-compact-setting" hidden><span>多选上限</span><input name="maxChoices" type="number" min="1" max="2" value="2" disabled></label>' +
            '<label class="wcg-compact-setting"><span>匿名投票<small>仅公开统计票数</small></span><input name="anonymous" type="checkbox" role="switch"></label>' +
            '<label class="wcg-compact-setting"><span>允许改票<small>截止前可以重新选择</small></span><input name="allowChange" type="checkbox" role="switch" checked></label>' +
            '<label class="wcg-compact-setting wcg-deadline-setting"><span>' + clockSvg + ' 截止时间</span><input type="datetime-local" name="closesAt" aria-label="投票截止时间"></label>' +
            '</section></div>';
        const relayHtml =
            '<div class="wcg-compact-create wcg-relay-create">' +
            '<section class="wcg-activity-block wcg-relay-compose"><span class="wcg-relay-hash">#接龙</span>' +
            '<textarea name="title" rows="3" maxlength="90" required placeholder="填写接龙主题" aria-label="接龙主题"></textarea>' +
            '<div class="wcg-relay-counter"><span id="wcgRelayTitleCount">0</span>/90</div>' +
            '<label class="wcg-compact-setting wcg-deadline-setting"><span>' + clockSvg + ' 截止时间</span>' +
            '<input type="datetime-local" name="closesAt" aria-label="接龙截止时间"></label></section>' +
            '<section class="wcg-activity-block wcg-relay-rows"><div class="wcg-block-heading"><strong>接龙内容</strong><small>按序填写</small></div>' +
            '<div class="wcg-relay-editor-row"><span class="wcg-relay-editor-number">例</span>' +
            '<input name="sample" maxlength="120" placeholder="可填写接龙格式，如：昵称 · 人数" aria-label="接龙示例"></div>' +
            '<div id="wcgRelayDraftRows"></div>' +
            '<button id="wcgRelayAddLine" type="button" class="wcg-relay-round-add" aria-label="添加一行接龙">' + relayPlusSvg + '</button>' +
            '<p class="wcg-field-help">点击左侧序号可删除对应行。你填写的多行内容归为你的一条接龙记录。</p></section>' +
            '<section class="wcg-activity-block wcg-relay-extras"><div class="wcg-block-heading"><strong>补充说明</strong><small>可选</small></div>' +
            '<textarea name="description" maxlength="240" rows="2" placeholder="补充地点、时间或其他要求"></textarea></section></div>';
        panel(isPoll ? '群投票' : '群接龙',
            '<form id="' + formId + '" class="wc-group-settings-form wcg-compact-form">' +
            (isPoll ? pollHtml : relayHtml) + '</form>',
            isPoll ? 'create-poll' : 'create-relay');
        const form = el(formId);
        if (isPoll) {
            const list = el('wcgPollOptionList');
            const add = el('wcgPollAddOption');
            const count = el('wcgPollOptionCount');
            const maxRow = el('wcgPollMaxRow');
            const maxInput = maxRow.querySelector('input');
            const syncPoll = () => {
                const inputs = [...list.querySelectorAll('input[name="option"]')];
                inputs.forEach((input, index) => {
                    input.placeholder = '选项 ' + (index + 1);
                    input.setAttribute('aria-label', '投票选项 ' + (index + 1));
                });
                count.textContent = inputs.length + ' 项 · 最多 8 项';
                add.disabled = inputs.length >= 8;
                const multiple = form.querySelector('input[name="multiple"]:checked')?.value === 'yes';
                maxRow.hidden = !multiple;
                maxInput.disabled = !multiple;
                maxInput.max = String(inputs.length);
                if (Number(maxInput.value) > inputs.length) maxInput.value = String(inputs.length);
            };
            add.onclick = () => {
                if (list.children.length >= 8) return;
                list.insertAdjacentHTML('beforeend', pollOption(list.children.length + 1));
                syncPoll();
                list.lastElementChild?.querySelector('input')?.focus();
            };
            list.onclick = event => {
                const remove = event.target.closest('.wcg-poll-option-remove');
                if (!remove) return;
                if (list.children.length <= 2) return toast('至少保留两个投票选项');
                remove.closest('.wcg-poll-option-editor').remove();
                syncPoll();
            };
            form.querySelectorAll('input[name="multiple"]').forEach(input => {
                input.onchange = syncPoll;
            });
            syncPoll();
        } else {
            const title = form.querySelector('textarea[name="title"]');
            const count = el('wcgRelayTitleCount');
            title.oninput = () => { count.textContent = String(title.value.length); };
            const rows = el('wcgRelayDraftRows');
            const add = el('wcgRelayAddLine');
            const syncRelay = () => {
                [...rows.querySelectorAll('.wcg-relay-editor-row')].forEach((row, index) => {
                    const number = row.querySelector('.wcg-relay-editor-number');
                    number.textContent = String(index + 1);
                    number.setAttribute('aria-label', '删除第 ' + (index + 1) + ' 行接龙');
                });
                add.disabled = rows.children.length >= 4;
            };
            const addRow = () => {
                if (rows.children.length >= 4) return;
                const row = document.createElement('div');
                row.className = 'wcg-relay-editor-row';
                const number = document.createElement('button');
                number.type = 'button';
                number.className = 'wcg-relay-editor-number wcg-relay-remove';
                number.onclick = () => { row.remove(); syncRelay(); };
                const input = document.createElement('input');
                input.name = 'initialLine';
                input.maxLength = 180;
                input.placeholder = '填写我的接龙内容（可选）';
                input.setAttribute('aria-label', '我的接龙内容');
                row.append(number, input);
                rows.append(row);
                syncRelay();
                return input;
            };
            add.onclick = () => addRow()?.focus();
            addRow();
        }
        let submitting = false;
        form.onsubmit = event => {
            event.preventDefault();
            if (submitting) return;
            const data = new FormData(form);
            const rawDeadline = String(data.get('closesAt') || '');
            const closesAt = rawDeadline ? new Date(rawDeadline).getTime() : 0;
            if (rawDeadline && !Number.isFinite(closesAt)) return toast('截止时间不正确');
            const initialLines = data.getAll('initialLine').map(item => String(item).trim()).filter(Boolean);
            const initialEntry = initialLines.join('\n');
            if (!isPoll && initialEntry.length > 180) return toast('你的接龙内容合计不能超过 180 字');
            const detail = {
                title: String(data.get('title') || ''),
                options: data.getAll('option').map(x => String(x).trim()).filter(Boolean),
                description: String(data.get('description') || ''),
                sample: String(data.get('sample') || ''),
                initialEntry,
                multiple: data.get('multiple') === 'yes',
                anonymous: data.has('anonymous'),
                maxChoices: Number(data.get('maxChoices')) || 1,
                allowChange: data.has('allowChange'),
                closesAt
            };
            submitting = true;
            const saveButton = el('wcGroupPanelSave');
            if (saveButton) saveButton.disabled = true;
            transactActivity((draft, messages) => Boolean(createActivity(draft, messages, USER_ID, kind, detail)))
                .then(ok => {
                    if (!ok) return toast('活动未创建，请检查标题、选项或截止时间');
                    if (active() === group) closePanel();
                }).catch(report).finally(() => {
                    submitting = false;
                    if (saveButton) saveButton.disabled = false;
                });
        };
    }

    // One tap opens member details, two taps nudge, and avatar hold inserts an @mention.
    // Delaying only the avatar's single-tap action avoids opening the profile mid-double-tap.
    function bindGroupAvatarGestures(node, member) {
        if (!member) return;
        node.style.touchAction = 'manipulation';
        node.tabIndex = 0;
        node.setAttribute('role', 'button');
        node.setAttribute('aria-label', memberName(member) + '，单击查看资料，双击拍一拍');
        let clickTimer = null, holdTimer = null, lastTap = 0, longPressed = false, down = null;
        const cancelHold = () => { if (holdTimer !== null) clearTimeout(holdTimer); holdTimer = null; down = null; };
        const mention = () => {
            if (active()?.mode !== 'participate') return;
            if (member.id !== USER_ID) insertMention(member.id);
        };
        const nudge = () => {
            if (active()?.mode !== 'participate') return;
            sendGroupNudge(member.id).catch(report);
        };
        node.addEventListener('pointerdown', event => {
            if (event.button !== 0 || event.pointerType === 'mouse') return;
            cancelHold();
            longPressed = false;
            down = { x: event.clientX, y: event.clientY };
            holdTimer = setTimeout(() => {
                holdTimer = null;
                if (!down) return;
                longPressed = true;
                if (clickTimer !== null) clearTimeout(clickTimer);
                clickTimer = null;
                lastTap = 0;
                mention();
            }, 550);
        });
        node.addEventListener('pointermove', event => {
            if (down && (Math.abs(event.clientX - down.x) > 10 || Math.abs(event.clientY - down.y) > 10)) cancelHold();
        });
        ['pointerup', 'pointercancel', 'pointerleave'].forEach(type =>
            node.addEventListener(type, cancelHold));
        node.addEventListener('contextmenu', event => {
            event.preventDefault();
            event.stopPropagation();
            if (clickTimer !== null) clearTimeout(clickTimer);
            clickTimer = null;
            lastTap = 0;
            if (!longPressed) mention();
            longPressed = true;
        });
        node.addEventListener('click', event => {
            event.stopPropagation();
            if (longPressed) { longPressed = false; return; }
            const now = Date.now();
            if (event.detail >= 2 || now - lastTap < 340) {
                if (clickTimer !== null) clearTimeout(clickTimer);
                clickTimer = null;
                lastTap = 0;
                nudge();
                return;
            }
            lastTap = now;
            clickTimer = setTimeout(() => {
                clickTimer = null;
                lastTap = 0;
                if (active()) memberPanel(member.id);
            }, 340);
        });
        node.addEventListener('keydown', event => {
            if (event.key === 'Enter' || event.key === ' ') {
                event.preventDefault();
                memberPanel(member.id);
            }
        });
    }

    // Use durable sender IDs, never nicknames or message text, to identify a speaker.
    function setGroupMessageIdentity(node, message, position = 'single') {
        const senderId = String(message.senderId ?? '');
        node.dataset.senderId = senderId;
        node.dataset.charId = senderId;
        node.dataset.messageGroup = position;
        // Native merge identity metadata: theme CSS reads this without a custom observer.
        node.dataset.wcgMergeText = isGroupTextMessage(message) ? '1' : '0';
    }

    function isGroupTextMessage(message) {
        return Boolean(message && !message.hiddenForUser && !message.recalled &&
            (!message.type || message.type === 'text') &&
            (!message.groupFormat || ['text', 'translation'].includes(message.groupFormat)) &&
            !message.activity && !message.isSticker && !message.isVoice && !message.isAction &&
            !message.isHtml && !message.imageUrl && !message.fileAttachment &&
            !message.replyTo && !message.translation && message.groupFormat !== 'translation');
    }

    function consecutiveGroupMessages(previous, current) {
        if (!isGroupTextMessage(previous) || !isGroupTextMessage(current)) return false;
        const senderId = String(previous.senderId ?? '');
        return Boolean(senderId && senderId !== 'system' && senderId === String(current.senderId ?? ''));
    }

    function groupMessagePosition(messages, index) {
        const previous = consecutiveGroupMessages(messages[index - 1], messages[index]);
        const next = consecutiveGroupMessages(messages[index], messages[index + 1]);
        return previous ? (next ? 'middle' : 'last') : (next ? 'first' : 'single');
    }

    function messageNode(group, message, position = 'single') {
        if (message.recalled) {
            const row = document.createElement('div');
            row.dataset.messageId = message.id;
            setGroupMessageIdentity(row, message, position);
            row.className = 'message-row recalled-message-row wc-group-recalled-row';
            const pill = document.createElement('div');
            pill.className = 'wc-recalled-bubble';
            pill.textContent = message.senderId === USER_ID
                ? '你撤回了一条消息' : `${message.senderName || '对方'}撤回了一条消息`;
            pill.onclick = () => {
                if (!el('wcGroupBubbleMenuOverlay')?.classList.contains('show')) viewGroupRecalledMessage(message);
            };
            bindBubbleLongPress(pill, message.id);
            row.append(pill);
            return row;
        }
        if (message.activity?.kind === 'game' && window.WcGroupGames) {
            const card = renderGroupGameCard(group, message);
            setGroupMessageIdentity(card, message, position);
            return card;
        }
        const row = document.createElement('div');
        row.dataset.messageId = message.id;
        setGroupMessageIdentity(row, message, position);
        if (message.type === 'system_event') {
            row.className = 'wc-center-timestamp';
            if (message.kind === 'nudge') row.dataset.kind = 'nudge';
            row.textContent = message.text;
            return row;
        }
        row.className = `message-row ${message.senderId === USER_ID ? 'sent' : 'received'}`;
        const member = group.members.find(item => item.id === message.senderId);
        const avatarUrl = message.senderId === USER_ID
            ? (appSettings?.wc_current_user_avatar || member?.avatar || message.senderAvatar)
            : (member?.avatar || message.senderAvatar);
        const avatar = avatarNode(avatarUrl, message.senderName);
        bindGroupAvatarGestures(avatar, member);
        const body = document.createElement('div');
        body.className = 'wc-msg-body';
        const label = document.createElement('div');
        label.className = 'wc-group-speaker';
        const displayName = document.createElement('span');
        displayName.className = 'wc-group-speaker-name';
        displayName.textContent = member ? memberName(member) : message.senderName;
        if (group.showTitles && member) appendTitleTags(label, member);
        label.append(displayName);
        if (message.essential) label.append(titleTag('精华', 'essential'));
        const bubble = document.createElement('div');
        bubble.className = `message-bubble ${message.senderId === USER_ID ? 'sent' : 'received'}`;
        setGroupMessageIdentity(bubble, message, position);
        if (message.replyTo) {
            const original = rows(group).find(item => item.id === message.replyTo);
            // Older game comments stored their table association as an automatic quote.
            const automaticGameQuote = message.senderId === USER_ID && message.gameMessageId === message.replyTo &&
                original?.activity?.kind === 'game';
            if (original && !automaticGameQuote) {
                const quote = document.createElement('div');
                quote.className = 'wc-bubble-reply';
                quote.textContent = `${original.senderName}：${original.recalled ? '[消息已撤回]' : original.text}`;
                quote.onclick = event => { event.stopPropagation(); jump(original.id); };
                bubble.append(quote);
            }
        }
        const stickerImage = message.isSticker ? safeStickerUrl(message.imageUrl) : '';
        if (stickerImage) bubble.classList.add('wc-group-sticker-bubble');
        const text = document.createElement('div');
        text.className = 'msg-text';
        text.textContent = displayedMessageText(group, message);
        if (message.isVoice && typeof window.wcCreateVoiceMessageContent === 'function') {
            bubble.classList.add('wc-voice-message-bubble');
            const transcript = String(message.text || '').replace(/^\s*\[语音\]\s*/i, '');
            const owner = account, token = epoch, sourceText = message.text;
            const currentVoice = () => owner === currentAccount() && token === epoch && active() === group &&
                rows(group).some(item => item.id === message.id && !item.recalled && item.isVoice && item.text === sourceText);
            const loadAudio = message.senderId !== USER_ID && member?.kind !== 'npc' &&
                typeof window.synthesizeConnectedVoice === 'function'
                ? () => window.synthesizeConnectedVoice(transcript, message.senderId) : null;
            bubble.append(window.wcCreateVoiceMessageContent(message, avatarUrl || '', transcript, {
                isCurrent: currentVoice, loadAudio
            }));
        } else bubble.append(text);
        if (message.activity) {
            text.hidden = true;
            bubble.classList.add('wc-group-activity-bubble');
            bubble.append(renderActivityCard(group, message));
        }
        if (message.translation && !message.isSticker) {
            const translation = document.createElement('div');
            translation.className = 'wc-group-translation-card';
            translation.textContent = String(message.translation);
            bubble.append(translation);
        }
        if (message.imageUrl && (message.isSticker ? stickerImage : safeStickerUrl(message.imageUrl))) {
            const image = !message.isSticker && typeof window.wcCreateChatImageContent === 'function'
                ? window.wcCreateChatImageContent(message) : document.createElement('img');
            image.src = message.isSticker ? stickerImage : message.imageUrl;
            image.className = 'wc-group-message-image';
            image.alt = message.text || '图片';
            image.loading = 'lazy';
            if (!message.isSticker) {
                text.hidden = true;
                bubble.classList.add('wc-image-message-bubble');
                image.onclick = event => {
                    event.stopPropagation();
                    openGroupImageViewer(group, message);
                };
            }
            bubble.append(image);
        }
        if (message.fileAttachment) bubble.append(wcCreateChatFileCard(message.fileAttachment));
        bindBubbleLongPress(bubble, message.id);
        const time = document.createElement('div');
        time.className = 'msg-meta wc-group-message-time';
        time.textContent = wcFormatChatTime(message.createdAt);
        bubble.append(time);
        body.append(label, bubble);
        renderReactionChips(body, message);
        row.append(avatar, body);
        return row;
    }

    function render(scroll = true) {
        const group = active();
        if (!group) return;
        renderHeader(group);
        const area = el('wcGroupMessages');
        const oldTop = area.scrollTop;
        area.replaceChildren();
        const messages = rows(group);
        const visibleRows = messages.filter(message => !message.hiddenForUser);
        if (visibleRows.length > renderLimit) {
            const button = document.createElement('button');
            button.className = 'wc-load-earlier-messages';
            button.textContent = `加载更早消息（还剩 ${visibleRows.length - renderLimit} 条）`;
            button.onclick = () => { const height = area.scrollHeight; const top = area.scrollTop; renderLimit += 80; render(false); area.scrollTop = area.scrollHeight - height + top; };
            area.append(button);
        }
        // The visible slice starts a fresh group even when older messages share its sender.
        const renderedRows = visibleRows.slice(-renderLimit);
        renderedRows.forEach((message, index) => {
            const node = messageNode(group, message, groupMessagePosition(renderedRows, index));
            if (groupSelectionMode && message.type !== 'system_event' && (message.senderId === USER_ID || canManage(group))) {
                const wrapper = document.createElement('div');
                wrapper.className = 'wcg-selectable-message' + (selectedGroupMessages.has(message.id) ? ' is-selected' : '');
                const selector = document.createElement('button');
                selector.type = 'button';
                selector.className = 'wcg-select-message-check';
                selector.setAttribute('aria-label', '选择消息');
                selector.setAttribute('aria-pressed', String(selectedGroupMessages.has(message.id)));
                selector.innerHTML = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m5 12 4 4L19 6"/></svg>';
                wrapper.addEventListener('click', event => {
                    event.preventDefault();
                    event.stopImmediatePropagation();
                    toggleGroupSelection(message.id);
                }, true);
                wrapper.append(selector, node);
                area.append(wrapper);
            } else area.append(node);
        });
        if (packetExpiryTimer !== null) clearTimeout(packetExpiryTimer);
        packetExpiryTimer = null;
        const now = Date.now();
        const nextExpiry = messages.filter(message => message.activity?.kind === 'redpacket' &&
            redPacketState(message.activity, now).status === 'open')
            .map(message => Number(message.activity.expiresAt)).filter(time => time > now).sort((a, b) => a - b)[0];
        if (nextExpiry) {
            const token = epoch;
            packetExpiryTimer = setTimeout(() => {
                packetExpiryTimer = null;
                if (token !== epoch || active() !== group) return;
                settleExpiredGroupPackets(group).finally(() => {
                    if (token === epoch && active() === group && el('page-group-chat')?.classList.contains('active')) render(false);
                });
            }, Math.max(1, nextExpiry - now + 20));
        }
        wcgObserveMergedBubbleGroups(area, wcgUsesSenderGroups(group.appearance?.bubbleTheme));
        if (scroll) area.scrollTop = area.scrollHeight;
        else area.scrollTop = oldTop;
        if (replyId) {
            const quoted = messages.find(message => message.id === replyId && !message.recalled);
            if (quoted) showGroupReplyPreview(group, quoted, false);
            else cancelReply();
        }
    }

    function jump(id) {
        const group = active();
        const index = rows(group).findIndex(message => message.id === id);
        if (index < 0) return;
        renderLimit = Math.max(renderLimit, rows(group).length - index);
        closePanel();
        render(false);
        const row = [...el('wcGroupMessages').children].find(node => node.dataset.messageId === id);
        if (row) {
            const area = el('wcGroupMessages');
            area.scrollTop += row.getBoundingClientRect().top - area.getBoundingClientRect().top - (area.clientHeight - row.offsetHeight) / 2;
        }
        row?.animate([{ opacity: 0.3 }, { opacity: 1 }], { duration: 600 });
    }

    function submitComposer() {
        const group = active();
        if (!group || group.mode !== 'participate') return Promise.resolve(false);
        const input = el('wcGroupInput');
        if (input?.value.trim()) return send();
        return requests.has(group.id) ? (pause(), Promise.resolve(false)) : generate();
    }

    async function send(comment = null) {
        const group = active();
        const fromGame = comment && typeof comment.text === 'string';
        const text = (fromGame ? comment.text : el('wcGroupInput').value).trim();
        if (!group || !text) return false;
        if (group.mode !== 'participate' || !canSpeak(group, group.members.find(member => member.id === USER_ID))) throw new Error('当前不能发送群消息');
        const token = epoch, owner = account;
        if (fromGame) {
            if (gameCommentSends.has(group.id)) return false;
            gameCommentSends.add(group.id);
            if (gameBotTimer !== null) clearTimeout(gameBotTimer);
            gameBotTimer = null;
            refreshGameDiscussion(group);
        }
        try {
            // Queue advice after the atomic game draft, so neither the move nor the message is lost.
            if (fromGame) {
                while (requests.get(group.id)?.done) await requests.get(group.id).done;
                if (token !== epoch || owner !== currentAccount() || active() !== group) return false;
                if (group.archived || group.mode !== 'participate' ||
                    !canSpeak(group, group.members.find(member => member.id === USER_ID))) throw new Error('当前不能发送群消息');
                if (!rows(group).some(message => message.id === comment.gameMessageId &&
                    !message.recalled && !message.hiddenForUser && message.includeInContext !== false &&
                    message.activity?.kind === 'game')) throw new Error('这局游戏已不存在或已撤回，请返回群聊后重试');
            } else if (requests.has(group.id)) pause();
            if (!fromGame) syncMentions();
            const sentMessage = publicMessage(group, USER_ID, text, fromGame
                ? { replyTo: null, gameMessageId: comment.gameMessageId || '', mentions: [] }
                : { replyTo: replyId || null, mentions: mentions.slice() });
            if (!fromGame) {
                el('wcGroupInput').value = '';
                replyId = '';
                resetMentions();
            }
            render();
            await save(group);
            if (token === epoch) {
                wcRenderChatList();
                void maybeSummarizeGroup(group);
                void maybeTriggerGroupPrivateMessage(group, sentMessage);
                refreshGameDiscussion(group);
                pausedGameId = '';
                scheduleGroupGameBot();
            }
            return true;
        } finally {
            if (fromGame) {
                gameCommentSends.delete(group.id);
                if (token === epoch && active() === group) {
                    refreshGameDiscussion(group);
                    scheduleGroupGameBot();
                }
            }
        }
    }

    // Resolve public reply targets against membership and each recipient's history boundary.
    function groupReplyTargets(group, messages, sources) {
        const targets = new Set();
        for (const message of sources) {
            if (!message || message.recalled || message.includeInContext === false || message.type === 'system_event') continue;
            const ids = new Set(Array.isArray(message.mentions) ? message.mentions : []);
            const sender = group.members.find(member => member.id === message.senderId);
            if (ids.delete('all') && ['owner', 'admin'].includes(sender?.role)) group.members.forEach(member => ids.add(member.id));
            const reference = messages.find(item => item.id === message.replyTo && !item.recalled && item.includeInContext !== false);
            if (reference) ids.add(reference.senderId);
            for (const id of ids) {
                const target = group.members.find(member => member.id === id);
                if (target && target.id !== message.senderId &&
                    (group.historyVisible || Number(message.sequence) >= Number(target.historyFromSequence || 0))) targets.add(id);
            }
        }
        return targets;
    }

    // Invite direct recipients first; otherwise leave room for a small spontaneous exchange.
    function chooseSpeakers(group, messages, forcedId = '') {
        const candidates = group.members.filter(member => member.id !== USER_ID &&
            canSpeak(group, member) && (member.kind === 'npc' || wcContactsList.some(contact => contact.id === member.id)));
        if (forcedId) return candidates.filter(member => member.id === forcedId);
        const recentMessages = messages.filter(message => message.type !== 'system_event' && !message.recalled && message.includeInContext !== false);
        const last = recentMessages.at(-1);
        const batch = [];
        for (let index = recentMessages.length - 1; index >= 0 && recentMessages[index].senderId === last?.senderId; index--) batch.unshift(recentMessages[index]);
        const targeted = groupReplyTargets(group, messages, batch);
        const topic = batch.map(message => String(message.text || '')).join('\n').toLocaleLowerCase();
        const ranked = candidates.map(member => {
            const recent = recentMessages.slice(-20).filter(message => message.senderId === member.id).length;
            const memories = (group.memberMemories?.[member.id] || []).filter(item =>
                Array.isArray(item.sourceIds) && item.sourceIds.length);
            const relationship = last?.senderId && memories.some(item =>
                item.kind === 'relationship' && Array.isArray(item.aboutMemberIds) &&
                item.aboutMemberIds.includes(last.senderId)) ? 2 : 0;
            const interest = topic && memories.some(item =>
                item.kind === 'interest' && typeof item.topic === 'string' &&
                item.topic.length >= 2 && topic.includes(item.topic.toLocaleLowerCase())) ? 3 : 0;
            const weight = (targeted.has(member.id) ? 12 : 0) + relationship + interest -
                recent * 2 + Math.random() * 5;
            return { member, weight };
        }).sort((a, b) => b.weight - a.weight);
        if (group.speakerMode !== 'all') {
            // A natural round invites only a few relevant members. Each invitee may still stay silent.
            const direct = ranked.filter(item => targeted.has(item.member.id));
            if (direct.length) return direct.map(item => item.member);
            const spontaneous = candidates.length > 2 && Math.random() > .65 ? 2 : 1;
            const available = ranked.filter(item => item.member.id !== last?.senderId);
            return (available.length ? available : ranked).slice(0, spontaneous).map(item => item.member);
        }
        const order = ranked.map(item => item.member);
        const extras = ranked.filter(item => Math.random() > .75)
            .slice(0, Math.ceil(candidates.length / 2));
        for (const extra of extras) {
            // Preserve the previous all-speakers mode for users who explicitly choose it.
            const slots = Array.from({ length: order.length + 1 }, (_, i) => i).filter(index =>
                order[index - 1]?.id !== extra.member.id && order[index]?.id !== extra.member.id);
            const index = slots.length ? slots[Math.floor(Math.random() * slots.length)] : order.length;
            order.splice(index, 0, extra.member);
        }
        return order;
    }

    const GROUP_PRIVATE_COOLDOWN_MS = 60 * 60 * 1000;
    const runningGroupPrivateTriggers = new Set();

    async function maybeTriggerGroupPrivateMessage(group, source) {
        if (!group || group.archived || group.mode !== 'participate' ||
            group.groupPrivateTriggerEnabled !== true || !source?.id ||
            !String(source.text || '').trim() || account !== currentAccount() ||
            !groupById(group.id) || typeof window.wcRequestApiReply !== 'function') return;
        const userMember = group.members.some(member => member.id === USER_ID);
        if (!userMember) return;
        const targets = source.senderId === USER_ID
            ? (Array.isArray(source.mentions) ? source.mentions : [])
            : (Array.isArray(source.mentions) && source.mentions.includes(USER_ID) ? [source.senderId] : []);
        const now = Date.now();
        if (now - Number(source.createdAt || 0) > 5 * 60 * 1000) return;
        for (const targetId of [...new Set(targets)]) {
            const member = group.members.find(item => item.id === targetId && item.kind !== 'npc');
            const contact = member && wcContactsList.find(item => item.id === member.id);
            if (!contact?.proactiveMessageEnabled) continue;
            const last = group.lastPrivateTriggerByContact?.[member.id] || {};
            if (last.sourceId === source.id || now - Number(last.at || 0) < GROUP_PRIVATE_COOLDOWN_MS ||
                now - Number(contact.proactiveMessageLastSentAt || 0) < GROUP_PRIVATE_COOLDOWN_MS ||
                runningGroupPrivateTriggers.has(member.id)) continue;
            const token = epoch, owner = account;
            const previous = { ...(group.lastPrivateTriggerByContact || {}) };
            const current = { sourceId: source.id, at: now };
            group.lastPrivateTriggerByContact = { ...previous, [member.id]: current };
            runningGroupPrivateTriggers.add(member.id);
            try {
                await save(group);
                if (token !== epoch || owner !== currentAccount() || groupById(group.id) !== group ||
                    !group.groupPrivateTriggerEnabled || !contact.proactiveMessageEnabled ||
                    !rows(group).some(item => item.id === source.id && !item.recalled)) continue;
                const reason = '群聊「' + String(group.name).slice(0, 40) + '」中，' +
                    String(source.senderName || '群成员').slice(0, 30) + '说了「' +
                    String(source.text).slice(0, 150) +
                    '」。你有权知道这条公开消息；如符合你的人设，可以私下联系用户，但不要假装这是私聊里刚收到的消息';
                void window.wcRequestApiReply({ contactId: member.id, proactive: true,
                    proactiveMeta: { reason } }).catch(error =>
                    console.warn('Group-triggered private message failed:', error));
                break;
            } catch (error) {
                group.lastPrivateTriggerByContact = previous;
                console.warn('Group-triggered private message deferred:', error);
            } finally {
                runningGroupPrivateTriggers.delete(member.id);
            }
        }
    }

    function groupSummarySources(group, messages = rows(group)) {
        return messages.filter(message => message && message.senderId !== 'system' &&
            !message.recalled && message.includeInContext !== false &&
            Number(message.sequence) > Number(group.summaryCursor || 0) &&
            String(message.text || '').trim());
    }

    function groupSummaryBinding(group) {
        return 'wechat_group_memory_' + group.id;
    }

    function validGroupSummaryChunks(group, member, messages = rows(group)) {
        const minimum = group.historyVisible ? 0 : Number(member.historyFromSequence) || 0;
        const allowed = new Set(messages.filter(message => !message.recalled &&
            message.includeInContext !== false).map(message => String(message.id)));
        return (Array.isArray(group.summaryChunks) ? group.summaryChunks : [])
            .filter(chunk => Number(chunk.fromSequence) >= minimum &&
                Array.isArray(chunk.sourceIds) && chunk.sourceIds.length &&
                chunk.sourceIds.every(id => allowed.has(String(id))));
    }

    async function maybeSummarizeGroup(group) {
        if (!group || group.archived || summaryJobs.has(group.id) ||
            typeof wcSummarizeGroupMemory !== 'function' || !window.MemoryApp?.completeSummary ||
            !groupById(group.id) || account !== currentAccount()) return;
        const interval = Math.max(1, Math.min(500, Number(group.summaryInterval) || 50));
        const pending = groupSummarySources(group);
        if (pending.length < interval) return;
        const selected = clone(pending.slice(0, interval));
        const sourceIds = selected.map(message => String(message.id));
        const owner = account, token = epoch;
        const valid = () => token === epoch && owner === currentAccount() &&
            groupById(group.id) === group && !group.archived &&
            sourceIds.every(id => rows(group).some(message =>
                String(message.id) === id && !message.recalled && message.includeInContext !== false));
        summaryJobs.add(group.id);
        try {
            const snapshot = clone(group);
            const result = await wcSummarizeGroupMemory({
                group: snapshot, messages: selected, bindingId: groupSummaryBinding(group), validate: valid
            });
            if (!result || !valid()) return;
            const fromSequence = Number(selected[0].sequence);
            const toSequence = Number(selected[selected.length - 1].sequence);
            group.summaryChunks = [...(group.summaryChunks || []), {
                fromSequence, toSequence, sourceIds,
                text: String(result.text || '').slice(0, 3000), createdAt: Date.now()
            }].slice(-12);
            group.summaryCursor = toSequence;
            await save(group);
        } catch (error) {
            console.warn('Group memory summary deferred:', error);
        } finally {
            summaryJobs.delete(group.id);
        }
    }

    function invalidateGroupSummarySources(group, ids) {
        const removed = new Set((Array.isArray(ids) ? ids : []).map(String));
        if (!removed.size) return;
        group.summaryChunks = (group.summaryChunks || []).filter(chunk =>
            !(chunk.sourceIds || []).some(id => removed.has(String(id))));
        if (typeof window.MemoryApp?.invalidateSources === 'function') {
            void window.MemoryApp.invalidateSources(groupSummaryBinding(group), [...removed])
                .catch(error => console.warn('Group memory invalidation failed:', error));
        }
    }

    function visibleMessages(group, member, messages = rows(group)) {
        const minimum = group.historyVisible ? 0 : Number(member.historyFromSequence) || 0;
        return messages.filter(message => Number(message.sequence) >= minimum && message.includeInContext !== false);
    }

    function pruneMemories(group, messages = rows(group)) {
        if (!group.memberMemories) return;
        const valid = new Set(messages.filter(message => !message.recalled).map(message => message.id));
        Object.keys(group.memberMemories).forEach(id => {
            group.memberMemories[id] = (group.memberMemories[id] || []).filter(item => Array.isArray(item.sourceIds) && item.sourceIds.length && item.sourceIds.every(sourceId => valid.has(sourceId)));
        });
    }

    async function generate(forcedId = '', replacementTurnId = '', gameMessageId = '', gameCommentId = '') {
        const group = active();
        if (!group || group.archived || requests.has(group.id)) return false;
        // A manual claim must finish before snapshotting the turn; never overwrite it with a stale AI draft.
        if (activityWrites.has(group.id)) await activityWrites.get(group.id).catch(() => {});
        // Refresh account-scoped contact identities once for this entire round,
        // not once per character/NPC API call.
        if (typeof wcReloadContactsFromStorage === 'function') {
            try { await wcReloadContactsFromStorage(); } catch (error) {
                report(new Error('读取角色联系人资料失败，请重试'));
                return false;
            }
        }
        if (active() !== group || account !== currentAccount() || requests.has(group.id)) return false;
        if (replacementTurnId && !canReplaceActivityTurn(group, replacementTurnId)) { toast('已有成员参与本轮活动，不能重生成覆盖结果'); return false; }
        const replacedSourceIds = replacementTurnId
            ? rows(group).filter(message => message.turnId === replacementTurnId).map(message => String(message.id))
            : [];
        const draftGroup = clone(group);
        const draftMessages = clone(replacementTurnId ? rows(group).filter(message => message.turnId !== replacementTurnId) : rows(group));
        if (replacedSourceIds.length) {
            const removed = new Set(replacedSourceIds);
            draftGroup.summaryChunks = (draftGroup.summaryChunks || []).filter(chunk =>
                !(chunk.sourceIds || []).some(id => removed.has(String(id))));
        }
        if (replacementTurnId) {
            undoTurnEffects(draftGroup, draftMessages, replacementTurnId);
            const retained = new Set(draftMessages.map(message => message.id));
            draftMessages.forEach(message => { if (message.replyTo && !retained.has(message.replyTo)) message.replyTo = null; });
            pruneMemories(draftGroup, draftMessages);
        }
        const speakers = gameMessageId ? chooseGameSpeakers(draftGroup, draftMessages, gameMessageId)
            : chooseSpeakers(draftGroup, draftMessages, forcedId);
        if (!speakers.length) { toast('没有可以发言的角色，请检查成员与禁言设置'); return false; }
        const controller = new AbortController();
        const token = epoch;
        const owner = account;
        const job = { controller, speaker: '', regenerating: Boolean(replacementTurnId) };
        let finishJob;
        job.done = new Promise(resolve => { finishJob = resolve; });
        requests.set(group.id, job);
        const turnId = uid();
        let added = false;
        try {
            if (gameMessageId) {
                const actor = speakers[0];
                const gameMessage = draftMessages.find(item => item.id === gameMessageId && !item.recalled);
                if (!gameIsAvailable(draftGroup, gameMessage) || gameMessage.activity.players[gameMessage.activity.turn]?.id !== actor.id) return false;
                job.speaker = memberName(actor) + ' · 游戏回合';
                if (activeId === group.id) renderHeader(group);
                const result = await wcRequestGroupReply({ group: clone(draftGroup), member: clone(actor), messages: clone(draftMessages),
                    signal: controller.signal, contactsLoaded: true,
                    gameTurn: { messageId: gameMessageId, steps: gameMessage.activity.moves.length },
                    gameFocusId: gameMessageId, gameRoundMembers: speakers.map(clone) });
                if (controller.signal.aborted || token !== epoch || owner !== currentAccount() ||
                    speakers.some(member => !canSpeak(group, group.members.find(item => item.id === member.id)))) return false;
                if (result.gameMove?.messageId !== gameMessageId) {
                    throw new Error('角色未返回游戏行动，请重试这一回合');
                }
                let afterMove = false;
                const beforeReplies = [], afterReplies = [];
                for (const item of result.slice(0, 3)) {
                    const stage = item.stage || 'before';
                    if (!['before', 'after'].includes(stage) || (afterMove && stage === 'before')) {
                        throw new Error('游戏对话的行动顺序不一致，请重试这一回合');
                    }
                    if (stage === 'after') afterMove = true;
                    (afterMove ? afterReplies : beforeReplies).push(item);
                }
                // Keep every reply and the move in one draft until the whole round is validated and saved.
                rememberTurnEffect(draftGroup, turnId, gameMessage);
                const durable = new Set(rows(group).map(item => item.id));
                const appendReply = item => {
                    const speaker = speakers.find(member => member.id === (item.memberId || actor.id));
                    if (!speaker || (item.type || 'text') !== 'text') throw new Error('游戏发言成员或消息类型无效，请重试');
                    const allowed = visibleMessages(draftGroup, speaker, draftMessages);
                    const priorLength = draftMessages.length;
                    if (!applyCharacterReply(draftGroup, draftMessages, speaker, item, allowed, durable, turnId)) {
                        throw new Error('游戏对话未能保存，请重试');
                    }
                    draftMessages.slice(priorLength).forEach(message => {
                        message.gameMessageId = gameMessageId;
                        message.gameStep = gameMessage.activity.moves.length;
                        if (item.behavior) message.gameBehavior = String(item.behavior).slice(0, 120);
                    });
                };
                beforeReplies.forEach(appendReply);
                if (!window.WcGroupGames.play(gameMessage.activity, actor.id, result.gameMove.move)) {
                    throw new Error('角色选择的游戏行动不符合规则，请重试这一回合');
                }
                gameMessage.activity.lastTurnId = turnId;
                gameMessage.activity.lastActor = actor.id;
                publicMessage(draftGroup, 'system', memberName(actor) + ' · ' + window.WcGroupGames.describeMove(gameMessage.activity),
                    { turnId, gameMessageId, gameStep: gameMessage.activity.moves.length }, draftMessages);
                finishGroupGameMessage(draftGroup, draftMessages, gameMessage);
                afterReplies.forEach(appendReply);
                draftGroup.lastGeneratedTurnId = turnId;
                await commitStagedReplies(group, draftGroup, draftMessages, controller.signal);
                gameSpeechPresentation = { groupId: group.id, messageId: gameMessageId, turnId, readyAt: Date.now() + 320 };
                added = true;
                if (token === epoch && activeId === group.id && el('page-group-chat')?.classList.contains('active')) render();
                refreshGameDiscussion(group);
                wcRenderChatList();
                return true;
            }
            const dynamicConversation = !forcedId && !gameCommentId && draftGroup.speakerMode !== 'all';
            const visits = new Map();
            for (let speakerIndex = 0; speakerIndex < speakers.length; speakerIndex++) {
                const member = speakers[speakerIndex];
                if (controller.signal.aborted || token !== epoch || owner !== currentAccount() || !canSpeak(group, group.members.find(item => item.id === member.id))) { if (replacementTurnId) return false; break; }
                visits.set(member.id, (visits.get(member.id) || 0) + 1);
                job.speaker = memberName(member);
                if (activeId === group.id) renderHeader(group);
                const messages = visibleMessages(draftGroup, member, draftMessages);
                const snapshot = clone(messages);
                const result = await wcRequestGroupReply({ group: clone(draftGroup), member: clone(member), messages: snapshot,
                    signal: controller.signal, contactsLoaded: true,
                    gameTurn: null, gameFocusId: gameCommentId, gameComment: Boolean(gameCommentId) });
                if (controller.signal.aborted || token !== epoch || owner !== currentAccount() || !canSpeak(group, group.members.find(item => item.id === member.id))) { if (replacementTurnId) return false; break; }
                if (result.memoryItems?.length) {
                    draftGroup.memberMemories = draftGroup.memberMemories || {};
                    const prior = draftGroup.memberMemories[member.id] || [];
                    draftGroup.memberMemories[member.id] = [...prior, ...result.memoryItems]
                        .filter((item, index, items) => items.findIndex(other =>
                            other.text === item.text && (other.kind || 'fact') === (item.kind || 'fact')) === index)
                        .slice(-12);
                }
                const durable = new Set(rows(group).map(item => item.id));
                const allowed = messages.filter(item => !item.recalled && item.includeInContext !== false);
                let memberAdded = false;
                const firstNewMessage = draftMessages.length;
                for (const item of result.slice(0, 3)) {
                    const applied = applyCharacterReply(draftGroup, draftMessages, member, item, allowed, durable, turnId);
                    if (!applied && item.type === 'create_game') throw new Error('游戏未能发起，本条回复未保存；请检查成员与游戏权限后重试');
                    if (applied) {
                        added = true;
                        memberAdded = true;
                    }
                }
                if (gameCommentId) draftMessages.slice(firstNewMessage).forEach(item => {
                    item.gameMessageId = gameCommentId;
                    item.gameStep = draftMessages.find(message => message.id === gameCommentId)?.activity?.moves?.length || 0;
                });
                if (memberAdded) draftGroup.lastGeneratedTurnId = turnId;
                const newMessages = draftMessages.slice(firstNewMessage);
                const waitingForUser = dynamicConversation && result.awaitUser === true &&
                    draftGroup.mode === 'participate' && draftGroup.members.some(item => item.id === USER_ID) &&
                    newMessages.some(item => item.type === 'text' && !item.recalled);
                if (dynamicConversation && memberAdded && !waitingForUser) {
                    const pending = speakers.slice(speakerIndex + 1);
                    const responders = [];
                    for (const id of groupReplyTargets(draftGroup, draftMessages, newMessages)) {
                        if (id === USER_ID || id === member.id || (visits.get(id) || 0) >= 2) continue;
                        const target = group.members.find(item => item.id === id);
                        if (!canSpeak(group, target) || (target.kind !== 'npc' && !wcContactsList.some(contact => contact.id === id))) continue;
                        const queued = pending.findIndex(item => item.id === id);
                        if (queued >= 0) pending.splice(queued, 1);
                        responders.push(clone(target));
                    }
                    // Each member gets at most two requests per round, including direct callbacks.
                    speakers.splice(speakerIndex + 1, speakers.length, ...responders, ...pending);
                }
                if (replacementTurnId) {
                    if (waitingForUser) break;
                    continue;
                }
                if (memberAdded) {
                    const newlyRecalled = draftMessages.filter(item => item.recalled &&
                        rows(group).some(old => old.id === item.id && !old.recalled)).map(item => item.id);
                    await commitStagedReplies(group, draftGroup, draftMessages, controller.signal);
                    if (newlyRecalled.length && token === epoch) {
                        invalidateGroupSummarySources(group, newlyRecalled);
                        await save(group);
                    }
                    if (token !== epoch) break;
                    if (activeId === group.id && el('page-group-chat')?.classList.contains('active')) render();
                    refreshGameDiscussion(group);
                    wcRenderChatList();
                    const characterMessages = draftMessages.filter(item => item.turnId === turnId &&
                        item.senderId === member.id && !item.recalled);
                    const privateSource = characterMessages.find(item =>
                        Array.isArray(item.mentions) && item.mentions.includes(USER_ID));
                    const userRecentlySpoke = draftMessages.slice(-12).some(item =>
                        item.senderId === USER_ID && !item.recalled);
                    const followup = !privateSource && result.privateFollowup === true && userRecentlySpoke
                        ? characterMessages.at(-1) : null;
                    if (privateSource || followup) {
                        const event = privateSource || { ...followup, mentions: [USER_ID] };
                        void maybeTriggerGroupPrivateMessage(group, event);
                    }
                }
                if (waitingForUser) {
                    if (autoSession?.id === group.id) autoSession.stopped = true;
                    break;
                }
            }
            if (replacementTurnId && added) {
                draftGroup.lastGeneratedTurnId = turnId;
                await commitStagedReplies(group, draftGroup, draftMessages, controller.signal);
                if (token === epoch && replacedSourceIds.length && typeof window.MemoryApp?.invalidateSources === 'function') {
                    void window.MemoryApp.invalidateSources(groupSummaryBinding(group), replacedSourceIds)
                        .catch(error => console.warn('Regenerated group summary invalidation failed:', error));
                }
                if (token === epoch && activeId === group.id && el('page-group-chat')?.classList.contains('active')) render();
                if (token === epoch) wcRenderChatList();
            }
            return added;
        } catch (error) {
            if (error.name !== 'AbortError' && token === epoch) report(error);
            return false;
        } finally {
            if (requests.get(group.id) === job) requests.delete(group.id);
            finishJob();
            if (added && token === epoch && owner === currentAccount()) void maybeSummarizeGroup(group);
            if (token === epoch && activeId === group.id) renderHeader(group);
            if (token === epoch && activeId === group.id) scheduleGroupGameBot();
        }
    }

    function pause() {
        if (gameBotTimer !== null) clearTimeout(gameBotTimer);
        gameBotTimer = null;
        if (autoSession) autoSession.stopped = true;
        autoSession = null;
        if (activeId) requests.get(activeId)?.controller.abort();
        if (active()) renderHeader(active());
    }

    function stopAll() {
        if (gameBotTimer !== null) clearTimeout(gameBotTimer);
        gameBotTimer = null;
        if (packetExpiryTimer !== null) clearTimeout(packetExpiryTimer);
        packetExpiryTimer = null;
        if (walletRefundTimer !== null) clearTimeout(walletRefundTimer);
        walletRefundTimer = null;
        pause();
        requests.forEach(job => job.controller.abort());
        requests.clear();
    }

    async function auto() {
        const group = active();
        if (!group) return;
        if (autoSession || requests.has(group.id)) { pause(); return; }
        const session = { id: group.id, epoch, stopped: false };
        autoSession = session;
        renderHeader(group);
        try {
            for (let index = 0; index < group.autoRounds; index++) {
                if (session.stopped || epoch !== session.epoch || activeId !== session.id || document.hidden || !el('page-group-chat').classList.contains('active') || !el('wechatAppUI').classList.contains('show')) break;
                if (!await generate()) break;
            }
        } finally {
            if (autoSession === session) autoSession = null;
            if (active()) renderHeader(active());
        }
    }

    function cancelReply() {
        replyId = '';
        closeGroupReplyPreview();
        if (active()) renderHeader(active());
    }

    function resetMentions() {
        mentions = [];
        mentionTokens = [];
        mentionInputValue = el('wcGroupInput')?.value || '';
    }

    function syncMentions() {
        const value = el('wcGroupInput')?.value || '';
        let start = 0;
        while (start < mentionInputValue.length && start < value.length && mentionInputValue[start] === value[start]) start++;
        let oldEnd = mentionInputValue.length;
        let newEnd = value.length;
        while (oldEnd > start && newEnd > start && mentionInputValue[oldEnd - 1] === value[newEnd - 1]) { oldEnd--; newEnd--; }
        const delta = newEnd - oldEnd;
        mentionTokens = mentionTokens.filter(token => {
            const changed = start < oldEnd && start < token.end && oldEnd > token.start;
            const insertedInside = start === oldEnd && newEnd > start && start > token.start && start < token.end;
            if (changed || insertedInside) {
                // Shared '@' prefixes can make a deletion appear to overlap the next token.
                const shiftedStart = token.start + delta;
                if (!changed || token.end < oldEnd || shiftedStart < 0 || value.slice(shiftedStart, token.end + delta) !== token.text) return false;
                token.start = shiftedStart;
                token.end += delta;
            } else if (oldEnd <= token.start) { token.start += delta; token.end += delta; }
            return value.slice(token.start, token.end) === token.text && (!value[token.end] || /\s/.test(value[token.end]));
        });
        mentionInputValue = value;
        const group = active();
        mentions = [...new Set(mentionTokens.flatMap(token => token.id === 'all'
            ? (group && canManage(group) ? group.members.filter(member => member.id !== USER_ID).map(member => member.id) : [])
            : (group?.members.some(member => member.id === token.id) ? [token.id] : [])))];
    }

    function insertMention(id) {
        const group = active();
        if (!group || group.mode !== 'participate') return;
        if (id === 'all' && !canManage(group)) return toast('只有群主或管理员可以 @全体');
        const member = group.members.find(item => item.id === id);
        if (!member && id !== 'all') return;
        syncMentions();
        const text = `@${id === 'all' ? '全体成员' : memberName(member)}`;
        const start = el('wcGroupInput').value.length;
        el('wcGroupInput').value += `${text} `;
        mentionTokens.push({ id, text, start, end: start + text.length });
        mentionInputValue = el('wcGroupInput').value;
        syncMentions();
        closePanel();
        el('wcGroupInput').focus();
    }

    /*
     * Bootstrap Icons "people-fill" and "search"
     * The MIT License (MIT), Copyright (c) 2019-2024 The Bootstrap Authors
     * Source: https://github.com/twbs/icons
     * Permission is hereby granted, free of charge, to any person obtaining a copy
     * of this software and associated documentation files (the "Software"), to deal
     * in the Software without restriction, including without limitation the rights
     * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
     * copies of the Software, and to permit persons to whom the Software is
     * furnished to do so, subject to the following conditions:
     * The above copyright notice and this permission notice shall be included in
     * all copies or substantial portions of the Software.
     * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
     * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
     * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
     * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
     * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
     * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
     * THE SOFTWARE.
     */
    function mentionPanel() {
        const group = active();
        if (!group || group.mode !== 'participate') return;
        const members = group.members.filter(member => member.id !== USER_ID);
        const byId = new Map(members.map(member => [member.id, member]));
        const recentIds = [];
        for (const message of rows(group).slice(-250).reverse()) {
            if (byId.has(message.senderId) && !recentIds.includes(message.senderId)) {
                recentIds.push(message.senderId);
                if (recentIds.length === 4) break;
            }
        }
        for (const member of members) {
            if (recentIds.length === 4) break;
            if (!recentIds.includes(member.id)) recentIds.push(member.id);
        }
        const recent = recentIds.map(id => byId.get(id));
        const memberButton = member => `<button type="button" class="wc-group-mention-member" data-mention="${escape(member.id)}">
            <span class="wc-group-mention-photo" data-mention-avatar="${escape(member.id)}"></span>
            <span class="wc-group-mention-name">${escape(memberName(member))}</span>
            ${member.role === 'owner' || member.role === 'admin' ? `<span class="wc-group-mention-role">${member.role === 'owner' ? '群主' : '管理员'}</span>` : ''}
            <span class="wc-group-mention-chevron" aria-hidden="true">›</span>
        </button>`;
        const memberList = list => list.length
            ? `<div class="wc-group-mention-list">${list.map(memberButton).join('')}</div>`
            : '<div class="wc-group-mention-empty">没有找到相关成员</div>';
        const tiles = recent.map(member => `<button type="button" class="wc-group-mention-tile" data-mention="${escape(member.id)}">
            <span class="wc-group-mention-photo" data-mention-avatar="${escape(member.id)}"></span>
            <span class="wc-group-mention-tile-name">${escape(memberName(member))}</span>
        </button>`).join('');
        const allRow = canManage(group) ? `<div class="wc-group-mention-quick">
            <button type="button" class="wc-group-mention-all" data-mention="all">
                <span class="wc-group-mention-all-icon" aria-hidden="true">
                    <svg viewBox="0 0 16 16" width="20" height="20" fill="currentColor"><path d="M7 14s-1 0-1-1 1-4 5-4 5 3 5 4-1 1-1 1zm4-6a3 3 0 1 0 0-6 3 3 0 0 0 0 6m-5.784 6A2.24 2.24 0 0 1 5 13c0-1.355.68-2.75 1.936-3.72A6.3 6.3 0 0 0 5 9c-4 0-5 3-5 4s1 1 1 1zM4.5 8a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5"/></svg>
                </span>
                <span class="wc-group-mention-all-copy"><strong>@全体成员</strong><small>通知群内所有成员</small></span>
                <span class="wc-group-mention-chevron" aria-hidden="true">›</span>
            </button>
        </div>` : '';
        panel('@ 群成员', `<div class="wc-group-mention-root">
        <div class="wc-group-mention-handle" aria-hidden="true"></div>
        <div class="wc-group-mention-top">
            <div class="wc-group-mention-intro"><strong>@ 群成员</strong><span>选择想提醒的人</span></div>
            <button type="button" class="wc-group-mention-cancel" data-mention-cancel>取消</button>
        </div>
        <div class="wc-group-mention-search-wrap"><label class="wc-group-mention-search">
            <svg viewBox="0 0 16 16" width="16" height="16" fill="currentColor" aria-hidden="true"><path d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001q.044.06.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1 1 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0"/></svg>
            <input type="search" autocomplete="off" aria-label="搜索群成员" placeholder="搜索群成员" data-mention-search>
        </label></div>
        <div class="wc-group-mention-normal">
            ${allRow}
            ${recent.length ? `<div class="wc-group-mention-heading">最近联系</div><div class="wc-group-mention-recents">${tiles}</div>` : ''}
            <div class="wc-group-mention-heading">群成员 <span>${members.length} 人</span></div>
            ${memberList(members)}
        </div>
        <div class="wc-group-mention-results" hidden></div>
        <div class="wc-group-mention-foot">点选后自动返回聊天</div></div>`, 'mention');

        const body = el('wcGroupPanelBody');
        const closeButton = el('wcGroupPanelClose');
        if (closeButton) closeButton.textContent = '取消';
        const mountAvatars = root => root.querySelectorAll('[data-mention-avatar]').forEach(slot => {
            const member = byId.get(slot.dataset.mentionAvatar);
            if (member) slot.replaceChildren(avatarNode(member.avatar, memberName(member), 'wc-group-mention-avatar-image'));
        });
        mountAvatars(body);
        body.querySelector('.wc-group-mention-root').addEventListener('click', event => {
            if (event.target.closest('[data-mention-cancel]')) {
                closePanel();
                return;
            }
            const button = event.target.closest('[data-mention]');
            if (button) insertMention(button.dataset.mention);
        });
        const search = body.querySelector('[data-mention-search]');
        const normal = body.querySelector('.wc-group-mention-normal');
        const results = body.querySelector('.wc-group-mention-results');
        search.oninput = () => {
            const keyword = search.value.trim().toLocaleLowerCase();
            normal.hidden = Boolean(keyword);
            results.hidden = !keyword;
            if (!keyword) return;
            const matched = members.filter(member => [memberName(member), member.name, member.nickname]
                .some(value => String(value || '').toLocaleLowerCase().includes(keyword)));
            results.innerHTML = `<div class="wc-group-mention-heading">搜索结果 <span>${matched.length} 人</span></div>${memberList(matched)}`;
            mountAvatars(results);
        };
    }

    let speakerPanelFocus = null;

    function closeSpeakerPanel() {
        const sheet = el('wcGroupSpeakerSheet');
        if (!sheet || sheet.hidden) return;
        sheet.hidden = true;
        sheet.setAttribute('aria-hidden', 'true');
        el('wcGroupSpeakerSearch').value = '';
        if (speakerPanelFocus?.isConnected && typeof speakerPanelFocus.focus === 'function') {
            speakerPanelFocus.focus({ preventScroll: true });
        }
        speakerPanelFocus = null;
    }

    function filterSpeakerPanel() {
        const group = active();
        const list = el('wcGroupSpeakerList');
        if (!group || !list) return;
        const keyword = el('wcGroupSpeakerSearch').value.trim().toLocaleLowerCase();
        const members = new Map(group.members.map(member => [String(member.id), member]));
        let shown = 0;
        list.querySelectorAll('[data-speaker]').forEach(button => {
            const member = members.get(button.dataset.speaker);
            const searchable = [memberName(member), member?.name, member?.nickname, member?.sourceContactName]
                .join(' ').toLocaleLowerCase();
            button.hidden = !member || !searchable.includes(keyword);
            if (!button.hidden) shown++;
        });
        el('wcGroupSpeakerCount').textContent = `群成员 · ${shown} 位`;
        const empty = el('wcGroupSpeakerEmpty');
        empty.hidden = shown > 0;
        empty.textContent = keyword ? '没有找到相关成员' : '群内暂无可以指定的角色';
    }

    function speakerPanel() {
        const group = active();
        if (!group) return;
        closeMorePanel();
        closeEmojiPanel();
        closeBubbleMenu();
        closeDropdown();
        if (!el('wcGroupPanel')?.hidden) closePanel();
        refreshMemberAvatars(group);
        const members = group.members.filter(member => member.id !== USER_ID);
        const list = el('wcGroupSpeakerList');
        list.innerHTML = members.map(member => `<button type="button" class="wcg-pick-speaker-row" data-speaker="${escape(member.id)}" aria-label="指定${escape(memberName(member))}发言" ${canSpeak(group, member) ? '' : 'disabled'}>
            <span class="wcg-pick-speaker-photo" data-speaker-avatar="${escape(member.id)}"></span>
            <span class="wcg-pick-speaker-copy"><strong>${escape(memberName(member))}</strong>${member.kind === 'npc' ? `<small>${escape(member.sourceContactName ? 'NPC · ' + member.sourceContactName : 'NPC')}</small>` : ''}</span>
            ${canSpeak(group, member) ? '<span class="wcg-pick-speaker-action" aria-hidden="true">发言</span>' : '<span class="wcg-pick-speaker-muted">已禁言</span>'}
        </button>`).join('');
        const searchField = el('wcGroupSpeakerSearch').closest('.wcg-pick-speaker-search');
        searchField.hidden = members.length <= 5;
        const memberMap = new Map(members.map(member => [String(member.id), member]));
        list.querySelectorAll('[data-speaker-avatar]').forEach(slot => {
            const member = memberMap.get(slot.dataset.speakerAvatar);
            if (member) slot.replaceChildren(avatarNode(member.avatar, memberName(member), 'wcg-pick-speaker-avatar'));
        });
        el('wcGroupSpeakerSearch').value = '';
        filterSpeakerPanel();
        speakerPanelFocus = document.activeElement;
        const sheet = el('wcGroupSpeakerSheet');
        sheet.dataset.groupId = group.id;
        sheet.hidden = false;
        sheet.setAttribute('aria-hidden', 'false');
        sheet.querySelector('[role="dialog"]').focus({ preventScroll: true });
    }

    // Mirror the private-chat full-screen search layout and reuse its styles.
    function closeGroupSearch() {
        const view = el('page-wc-group-search');
        if (!view?.classList.contains('active')) return;
        view.classList.remove('active');
        el('page-group-chat')?.classList.add('active');
    }

    function groupSearchPage() {
        let view = el('page-wc-group-search');
        if (view) return view;
        const original = el('page-wc-chat-search');
        if (!original) return null;
        view = original.cloneNode(true);
        view.id = 'page-wc-group-search';
        const input = view.querySelector('#wcChatSearchInput');
        const results = view.querySelector('#wcChatSearchResults');
        const cancel = view.querySelector('.wc-search-cancel-btn');
        if (!input || !results || !cancel) return null;
        input.id = 'wcGroupSearchInput';
        input.placeholder = '搜索聊天记录';
        input.removeAttribute('oninput');
        input.removeAttribute('onkeydown');
        input.onkeydown = event => {
            if (event.key === 'Enter') { event.preventDefault(); event.stopPropagation(); }
        };
        results.id = 'wcGroupSearchResults';
        cancel.removeAttribute('onclick');
        cancel.onclick = closeGroupSearch;
        original.insertAdjacentElement('afterend', view);
        return view;
    }

    function groupSearchHighlight(target, content, keyword) {
        const text = String(content || '');
        const normalized = text.toLowerCase();
        let from = 0;
        let found;
        while ((found = normalized.indexOf(keyword, from)) >= 0) {
            target.append(document.createTextNode(text.slice(from, found)));
            const match = document.createElement('span');
            match.className = 'wc-chat-search-highlight';
            match.textContent = text.slice(found, found + keyword.length);
            target.append(match);
            from = found + keyword.length;
        }
        target.append(document.createTextNode(text.slice(from)));
    }

    function searchPanel(essentialOnly = false) {
        const group = active();
        if (!group) return;
        if (!essentialOnly) {
            const view = groupSearchPage();
            if (!view) { toast('搜索页面暂时无法打开'); return; }
            const input = view.querySelector('#wcGroupSearchInput');
            const results = view.querySelector('#wcGroupSearchResults');
            const updateSearch = () => {
                if (active() !== group || !view.classList.contains('active')) return;
                const query = input.value.trim().toLowerCase();
                results.replaceChildren();
                const empty = message => {
                    const hint = document.createElement('div');
                    hint.style.cssText = 'text-align:center;color:#8e8e93;margin-top:40px;font-size:14px;';
                    hint.textContent = message;
                    results.append(hint);
                };
                if (!query) { empty('请输入搜索内容'); return; }
                refreshMemberAvatars(group);
                const matches = rows(group).filter(message => !message.recalled &&
                    [message.text, message.senderName].some(value =>
                        String(value || '').toLowerCase().includes(query))).reverse();
                if (!matches.length) { empty('无搜索结果'); return; }
                for (const message of matches) {
                    const member = group.members.find(item => item.id === message.senderId);
                    const name = message.senderName || (member ? memberName(member) : '群成员');
                    const item = document.createElement('div');
                    item.className = 'wc-chat-search-result-item';
                    item.tabIndex = 0;
                    item.setAttribute('role', 'button');
                    const navigate = () => { closeGroupSearch(); jump(message.id); };
                    item.onclick = navigate;
                    item.onkeydown = event => {
                        if (event.key === 'Enter' || event.key === ' ') {
                            event.preventDefault(); navigate();
                        }
                    };
                    const avatar = avatarNode(member?.avatar, name, 'wc-chat-search-avatar');
                    const info = document.createElement('div');
                    info.className = 'wc-chat-search-info';
                    const head = document.createElement('div');
                    head.className = 'wc-chat-search-name-time';
                    const sender = document.createElement('div');
                    sender.className = 'wc-chat-search-name';
                    sender.textContent = name;
                    const time = document.createElement('div');
                    time.className = 'wc-chat-search-time';
                    const date = new Date(Number(message.createdAt));
                    if (!Number.isNaN(date.getTime())) {
                        const pad = value => String(value).padStart(2, '0');
                        time.textContent = pad(date.getMonth() + 1) + '-' + pad(date.getDate()) +
                            ' ' + pad(date.getHours()) + ':' + pad(date.getMinutes());
                    }
                    head.append(sender, time);
                    const snippet = document.createElement('div');
                    snippet.className = 'wc-chat-search-text';
                    groupSearchHighlight(snippet, message.text || message.senderName || '', query);
                    info.append(head, snippet);
                    item.append(avatar, info);
                    results.append(item);
                }
            };
            input.oninput = updateSearch;
            closePanel();
            document.querySelectorAll('#wechatAppUI .page').forEach(page => page.classList.remove('active'));
            view.classList.add('active');
            input.value = '';
            updateSearch();
            setTimeout(() => {
                if (view.classList.contains('active') && active() === group) input.focus();
            }, 300);
            return;
        }

        const dateLabel = timestamp => {
            const value = Number(timestamp);
            if (!Number.isFinite(value) || value <= 0) return '';
            const date = new Date(value);
            if (Number.isNaN(date.getTime())) return '';
            return String(date.getMonth() + 1).padStart(2, '0') + '-' + String(date.getDate()).padStart(2, '0');
        };
        const activityLabel = message => {
            const activity = message.activity;
            if (!activity) return '';
            if (activity.kind === 'redpacket') return '[红包] ' + String(activity.greeting || '恭喜发财，大吉大利');
            if (activity.kind === 'poll') return '[群投票] ' + String(activity.title || '');
            if (activity.kind === 'relay') return '[群接龙] ' + String(activity.title || '');
            if (activity.kind === 'game') return '[群游戏] ' + String(activity.customTitle || '');
            return '';
        };
        panel('精华消息', '<div id="wcGroupSearchResults" class="wc-group-essence-list"></div>', 'essence');
        const results = el('wcGroupSearchResults');
        const filterButton = el('wcGroupPanelEssenceFilter');
        const panelRoot = el('wcGroupPanel');
        const filterState = { query: '', type: 'all', order: 'new' };
        let busy = false;
        const update = () => {
            if (active() !== group || el('wcGroupPanel')?.dataset.view !== 'essence') return;
            const query = filterState.query.trim().toLowerCase();
            const { type, order } = filterState;
            const matches = rows(group).filter(message => {
                if (message.recalled || !message.essential) return false;
                const format = message.fileAttachment ? 'file'
                    : message.imageUrl ? 'image' : 'text';
                if (type !== 'all' && type !== format) return false;
                return !query || [message.senderName, message.text, message.activity?.title]
                    .some(value => String(value || '').toLowerCase().includes(query));
            }).sort((a, b) => order === 'new'
                ? Number(b.createdAt || 0) - Number(a.createdAt || 0)
                : Number(a.createdAt || 0) - Number(b.createdAt || 0));
            results.innerHTML = matches.map(message => {
                const sentAt = dateLabel(message.createdAt);
                const stamp = dateLabel(message.essentialAt);
                const manager = String(message.essentialByName || '').trim();
                const setting = stamp && manager ? `${stamp} 由 ${manager} 设置` : '已设置为精华';
                const display = String(displayedMessageText(group, message) || '').trim();
                const activity = activityLabel(message);
                const content = activity && !display.includes(activity) ? [activity, display].filter(Boolean).join('\n') : display;
                const media = message.imageUrl ? `<div data-essence-image="${escape(message.id)}"></div>` : '';
                const file = message.fileAttachment ? `<div class="wc-group-essence-file-slot" data-essence-file="${escape(message.id)}"></div>` : '';
                return `<article class="wc-group-essence-card" data-essence-id="${escape(message.id)}" role="button" tabindex="0">
                    <div class="wc-group-essence-head">
                        <span data-essence-avatar="${escape(message.id)}"></span>
                        <div class="wc-group-essence-author"><strong>${escape(message.senderName || '群成员')}</strong><small>${escape(sentAt)} 发送</small></div>
                        <button type="button" class="wc-group-essence-more" data-essence-menu="${escape(message.id)}" aria-label="精华操作"><svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="5" cy="12" r="1.4"/><circle cx="12" cy="12" r="1.4"/><circle cx="19" cy="12" r="1.4"/></svg></button>
                    </div>
                    <div class="wc-group-essence-content">${media}${file}${content ? `<p class="wc-group-essence-text">${escape(content)}</p>` : ''}</div>
                    <div class="wc-group-essence-meta">${escape(setting)}</div>
                </article>`;
            }).join('') || '<p class="wc-group-essence-empty">暂无符合条件的精华消息</p>';

            const byMessageId = new Map(matches.map(message => [String(message.id), message]));
            results.querySelectorAll('[data-essence-avatar]').forEach(slot => {
                const message = byMessageId.get(slot.dataset.essenceAvatar);
                if (!message) return;
                const member = group.members.find(item => item.id === message.senderId);
                const avatar = message.senderId === USER_ID
                    ? (appSettings?.wc_current_user_avatar || member?.avatar || message.senderAvatar)
                    : (member?.avatar || message.senderAvatar);
                slot.replaceWith(avatarNode(avatar, message.senderName || '群成员', 'wc-group-essence-avatar'));
            });
            results.querySelectorAll('[data-essence-image]').forEach(slot => {
                const message = byMessageId.get(slot.dataset.essenceImage);
                const url = message?.isSticker ? safeStickerUrl(message.imageUrl)
                    : safeStickerUrl(message?.imageUrl || '');
                if (!url) return;
                const image = document.createElement('img');
                image.src = url;
                image.alt = message.text || '群图片';
                image.loading = 'lazy';
                image.className = 'wc-group-essence-image';
                slot.replaceWith(image);
            });
            results.querySelectorAll('[data-essence-file]').forEach(slot => {
                const message = byMessageId.get(slot.dataset.essenceFile);
                if (message?.fileAttachment && typeof wcCreateChatFileCard === 'function')
                    slot.replaceChildren(wcCreateChatFileCard(message.fileAttachment));
            });
        };
        // Essence filters and message actions use the same bottom-sheet pattern as the approved preview.
        const closeSheet = () => {
            el('wcGroupEssenceOverlay')?.remove();
            filterButton?.setAttribute('aria-expanded', 'false');
        };
        const openSheet = (kind, id = '') => {
            closeSheet();
            const message = kind === 'detail'
                ? rows(group).find(item => String(item.id) === String(id) && item.essential && !item.recalled)
                : null;
            if (kind === 'detail' && !message) return;
            const overlay = document.createElement('div');
            overlay.id = 'wcGroupEssenceOverlay';
            overlay.className = 'wc-group-essence-overlay';
            overlay.dataset.kind = kind;
            overlay.setAttribute('role', 'dialog');
            overlay.setAttribute('aria-modal', 'true');
            overlay.setAttribute('aria-label', kind === 'filter' ? '筛选精华消息' : '精华消息详情');
            const closeIcon = '<svg viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round"><path d="M6 6 18 18M18 6 6 18"/></svg>';
            const header = title => `<div class="wc-group-essence-sheet-head"><strong>${title}</strong><button type="button" class="wc-group-essence-sheet-close" data-essence-close aria-label="关闭">${closeIcon}</button></div>`;
            const grabber = '<div class="wc-group-essence-grabber" aria-hidden="true"></div>';
            if (kind === 'filter') {
                const types = [['all', '全部'], ['text', '文字'], ['image', '图片'], ['file', '文件']];
                const choices = types.map(([value, label]) => `<button type="button" data-essence-type="${value}" class="${filterState.type === value ? 'active' : ''}" aria-pressed="${filterState.type === value}">${label}</button>`).join('');
                const orders = [['new', '最新在前'], ['old', '最早在前']]
                    .map(([value, label]) => `<button type="button" data-essence-order="${value}" class="${filterState.order === value ? 'active' : ''}" aria-pressed="${filterState.order === value}">${label}</button>`).join('');
                overlay.innerHTML = `<div class="wc-group-essence-sheet">${grabber}${header('筛选精华消息')}
                    <label class="wc-group-essence-sheet-search">
                        <svg viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round"><circle cx="11" cy="11" r="7"/><path d="m16 16 5 5"/></svg>
                        <input id="wcGroupEssenceQuery" type="search" aria-label="搜索精华消息" placeholder="搜索发送人或消息内容">
                    </label>
                    <div class="wc-group-essence-sheet-caption">消息类型</div>
                    <div class="wc-group-essence-sheet-types">${choices}</div>
                    <div class="wc-group-essence-sheet-caption">排列顺序</div>
                    <div class="wc-group-essence-sheet-orders">${orders}</div>
                </div>`;
                overlay.querySelector('#wcGroupEssenceQuery').value = filterState.query;
            } else {
                const sentAt = dateLabel(message.createdAt);
                const setAt = dateLabel(message.essentialAt);
                const setter = String(message.essentialByName || '').trim();
                const status = setAt && setter ? `${setAt} 由 ${setter} 设置为精华` : '已设置为精华';
                const label = message.fileAttachment ? '文件' : message.imageUrl ? '图片' : '文字';
                overlay.innerHTML = `<div class="wc-group-essence-sheet wc-group-essence-action-sheet">
                    <div class="wc-group-essence-preview-scroll">
                        ${grabber}
                        <div class="wc-group-essence-action-title">${escape(message.senderName || '群成员')}的消息</div>
                        <div class="wc-group-essence-action-preview">
                            <div class="wc-group-essence-detail-author">
                                <span data-essence-detail-avatar></span>
                                <div><strong>${escape(message.senderName || '群成员')}</strong><p>${escape(sentAt)} 发送 · ${label}消息</p></div>
                            </div>
                            <div data-essence-detail-content></div>
                            <div class="wc-group-essence-detail-meta">${escape(status)}</div>
                        </div>
                    </div>
                    <div class="wc-group-essence-qq-actions">
                        ${canManage(group) ? '<button type="button" data-essence-action="remove">移出精华</button>' : ''}
                        <button type="button" data-essence-action="forward">转发</button>
                        <button type="button" data-essence-action="jump">定位原消息</button>
                        <button type="button" data-essence-action="copy">复制内容</button>
                    </div>
                    <div class="wc-group-essence-cancel-wrap">
                        <button type="button" class="wc-group-essence-cancel" data-essence-close>取消</button>
                    </div>
                </div>`;
                const card = Array.from(results.querySelectorAll('[data-essence-id]'))
                    .find(node => node.dataset.essenceId === String(message.id));
                const avatar = card?.querySelector('.wc-group-essence-avatar')?.cloneNode(true);
                if (avatar) overlay.querySelector('[data-essence-detail-avatar]').replaceWith(avatar);
                const content = card?.querySelector('.wc-group-essence-content')?.cloneNode(true);
                if (content) {
                    content.classList.add('wc-group-essence-detail-content');
                    const file = content.querySelector('[data-essence-file]');
                    if (file && message.fileAttachment && typeof wcCreateChatFileCard === 'function')
                        file.replaceChildren(wcCreateChatFileCard(message.fileAttachment));
                    overlay.querySelector('[data-essence-detail-content]').replaceChildren(content);
                }
            }
            panelRoot.append(overlay);
            filterButton?.setAttribute('aria-expanded', String(kind === 'filter'));
            overlay.onclick = event => {
                if (event.target === overlay || event.target.closest('[data-essence-close]')) {
                    closeSheet();
                    return;
                }
                const typeChoice = event.target.closest('[data-essence-type]');
                if (typeChoice) {
                    filterState.type = typeChoice.dataset.essenceType;
                    overlay.querySelectorAll('[data-essence-type]').forEach(button => {
                        const selected = button.dataset.essenceType === filterState.type;
                        button.classList.toggle('active', selected);
                        button.setAttribute('aria-pressed', String(selected));
                    });
                    update();
                    return;
                }
                const orderChoice = event.target.closest('[data-essence-order]');
                if (orderChoice) {
                    filterState.order = orderChoice.dataset.essenceOrder;
                    overlay.querySelectorAll('[data-essence-order]').forEach(button => {
                        const selected = button.dataset.essenceOrder === filterState.order;
                        button.classList.toggle('active', selected);
                        button.setAttribute('aria-pressed', String(selected));
                    });
                    update();
                    return;
                }
                const action = event.target.closest('[data-essence-action]')?.dataset.essenceAction;
                if (!action || !message) return;
                if (action === 'forward') {
                    closeSheet();
                    if (typeof window.wcForwardPreparedChatRecord !== 'function')
                        return toast('转发功能尚未就绪，请稍后重试');
                    const time = new Date(Number(message.createdAt) || Date.now())
                        .toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' });
                    const author = String(message.senderName || (message.senderId === USER_ID ? '我' : '群成员'))
                        .replace(/[|:\n\r]/g, ' ');
                    const content = String(activityLabel(message) ||
                        (message.isVoice ? '[语音] ' + (message.text || '') :
                        message.isSticker ? '[表情包] ' + (message.text || '') :
                        message.text || (message.imageUrl ? '[图片]' : '[消息]')))
                        .replace(/[\r\n]+/g, ' ').trim();
                    const payload = '[聊天记录] ' + String(group.name || '群聊') +
                        '的聊天记录\n' + author + '|' + time + ': ' + content;
                    window.wcForwardPreparedChatRecord(payload, () => {});
                } else if (action === 'jump') {
                    closeSheet();
                    jump(String(message.id));
                } else if (action === 'copy') {
                    const copy = String(displayedMessageText(group, message) || activityLabel(message) ||
                        message.fileAttachment?.name || '').trim();
                    if (!copy) return toast('这条消息没有可复制的文字');
                    const done = () => toast('消息内容已复制');
                    const fallback = () => {
                        const input = document.createElement('textarea');
                        input.value = copy;
                        input.style.position = 'fixed';
                        input.style.opacity = '0';
                        document.body.append(input);
                        input.select();
                        const success = document.execCommand?.('copy');
                        input.remove();
                        if (success) done(); else toast('复制失败');
                    };
                    if (navigator.clipboard?.writeText)
                        navigator.clipboard.writeText(copy).then(done).catch(fallback);
                    else fallback();
                } else if (action === 'remove' && canManage(group) && !busy) {
                    busy = true;
                    closeSheet();
                    bubbleMenuMessageId = message.id;
                    messageAction('essential').then(update).catch(report).finally(() => { busy = false; });
                }
            };
            overlay.oninput = event => {
                if (event.target.id !== 'wcGroupEssenceQuery') return;
                filterState.query = event.target.value;
                update();
            };
            overlay.onkeydown = event => {
                if (event.key === 'Escape') closeSheet();
            };
        };
        if (filterButton) {
            filterButton.setAttribute('aria-expanded', 'false');
            filterButton.onclick = () => openSheet('filter');
        }
        results.onclick = event => {
            if (event.target.closest('.wc-group-essence-file-slot')) return;
            const target = event.target.closest('[data-essence-menu], [data-essence-id]');
            if (!target) return;
            if (target.hasAttribute('data-essence-menu')) return openSheet('detail', target.dataset.essenceMenu);
            if (target.hasAttribute('data-essence-id')) openSheet('detail', target.dataset.essenceId);
        };
        results.onkeydown = event => {
            if ((event.key !== 'Enter' && event.key !== ' ') || event.target.closest('button')) return;
            const card = event.target.closest('[data-essence-id]');
            if (!card) return;
            event.preventDefault();
            openSheet('detail', card.dataset.essenceId);
        };
        update();
    }

    async function regenerate() {
        const group = active();
        if (!group || requests.has(group.id)) return toast('请先停止生成');
        const token = epoch;
        const last = rows(group).filter(message => message.turnId).at(-1);
        const turnToReplace = group.lastGeneratedTurnId || last?.turnId;
        if (!turnToReplace) return toast('还没有可以重生成的回复');
        if (!canReplaceActivityTurn(group, turnToReplace)) return toast('活动已有人参与，不能重生成覆盖结果');
        if (!await showCustomConfirm('重生成本轮', '本轮所有角色回复将被替换；后续消息会失去这些回复的上下文。继续吗？', '重生成')) return;
        if (token !== epoch || active() !== group) return;
        pause();
        const replaced = await generate('', turnToReplace);
        if (!replaced && token === epoch && active() === group) toast('重生成未完成，已保留原回复');
    }

    function memberPanel(id, returnToSettings = false) {
        const group = active();
        refreshMemberAvatars(group);
        const member = group?.members.find(item => item.id === id);
        if (!member) return;
        memberReturnToSettings = returnToSettings;
        const manageable = canManage(group);
        const editable = manageable || id === USER_ID;
        const roleText = member.role === 'owner' ? '群主' : member.role === 'admin' ? '管理员' : '成员';
        const memberAction = (id, title, iconName, dangerous = false) => `<button type="button" class="wc-group-member-action${dangerous ? ' wc-group-danger' : ''}" id="${id}">${groupSettingsIcon(iconName)}<span>${title}</span>${dangerous ? '' : groupSettingsChevron()}</button>`;
        panel('群成员', `<div class="wc-group-member-detail-hero">
            <span class="wc-group-member-detail-photo" id="wcGroupMemberDetailAvatar"></span>
            <strong>${escape(memberName(member))}</strong>
            <div class="wc-group-title-preview" id="wcGroupTitlePreview" aria-label="头衔样式预览"></div>
            <span>${escape(roleText)}${member.kind === 'npc' ? ' · NPC' : ''}</span>
        </div>
        <form id="wcGroupMemberForm" class="wc-group-member-detail-form">
            ${editable ? `<div class="wc-group-section-title">成员资料</div><div class="wc-group-setting-card wc-group-member-fields">
                ${field('群昵称', 'nickname', member.nickname)}
                ${field('拍一拍后缀（可留空）', 'nudgeSuffix', member.nudgeSuffix || '')}
                ${manageable ? field('专属头衔', 'title', member.title) : ''}
                ${manageable && member.role !== 'owner' ? `<label class="wc-group-field"><span>成员身份</span><select name="role"><option value="member" ${member.role === 'member' ? 'selected' : ''}>成员</option><option value="admin" ${member.role === 'admin' ? 'selected' : ''}>管理员</option></select></label><label class="wc-group-field"><span>禁言</span><select name="mute"><option value="keep">保持当前状态</option><option value="0">解除禁言</option><option value="600000">10 分钟</option><option value="3600000">1 小时</option><option value="86400000">1 天</option></select></label>` : ''}
            </div>` : ''}
        </form>
        ${group.mode === 'participate' || manageable && member.role !== 'owner' && id !== USER_ID ? `<div class="wc-group-section-title">成员操作</div><div class="wc-group-member-actions">
            ${group.mode === 'participate' ? memberAction('wcGroupMemberNudge', '拍一拍', 'users') + (id !== USER_ID ? memberAction('wcGroupMemberMention', '@这位成员', 'at') + (member.kind === 'npc' ? '' : memberAction('wcGroupMemberPrivate', '打开私聊', 'message-circle')) : '') : ''}
            ${manageable && member.role !== 'owner' && id !== USER_ID ? memberAction('wcGroupRemoveMember', '移出群聊', 'user-x', true) : ''}
        </div>` : ''}`, 'member');
        el('wcGroupMemberDetailAvatar').replaceChildren(avatarNode(member.avatar, memberName(member), 'wc-group-member-detail-image'));
        const titlePreview = el('wcGroupTitlePreview');
        const customTitleInput = el('wcGroupMemberForm').querySelector('input[name="title"]');
        const updateTitlePreview = () => {
            titlePreview.replaceChildren();
            appendTitleTags(titlePreview, member, customTitleInput?.value);
        };
        if (customTitleInput) {
            customTitleInput.maxLength = 12;
            customTitleInput.placeholder = '例如：今日话唠';
            customTitleInput.addEventListener('input', updateTitlePreview);
        }
        updateTitlePreview();
        el('wcGroupPanelSave').hidden = !editable;
        el('wcGroupMemberForm').onsubmit = async event => {
            event.preventDefault();
            try {
                if (!canManage(group) && id !== USER_ID) throw new Error('没有管理权限');
                const data = new FormData(event.currentTarget);
                const previous = { ...member };
                const nameBefore = memberName(member);
                const actor = operatorName(group);
                const managesGroup = canManage(group);
                pause();
                member.nickname = String(data.get('nickname') || '').trim();
                member.nudgeSuffix = String(data.get('nudgeSuffix') || '').trim().slice(0, 80);
                if (canManage(group)) {
                    member.title = String(data.get('title') || '').trim();
                    if (member.role !== 'owner') member.role = data.get('role') === 'admin' ? 'admin' : 'member';
                    if (data.get('mute') && data.get('mute') !== 'keep') member.mutedUntil = Number(data.get('mute')) ? Date.now() + Number(data.get('mute')) : 0;
                }
                if (member.nickname !== previous.nickname) operationNotice(group, `${actor}将${nameBefore}的群昵称${member.nickname ? `改为“${member.nickname}”` : '恢复为默认名称'}`);
                if (String(member.title || '') !== String(previous.title || '')) operationNotice(group, `${actor}${member.title ? `将${memberName(member)}的专属头衔设为“${member.title}”` : `移除了${memberName(member)}的专属头衔`}`);
                if (member.role !== previous.role) operationNotice(group, member.role === 'admin' ? `${actor}将${memberName(member)}设为管理员` : `${actor}取消了${memberName(member)}的管理员身份`);
                const duration = Number(data.get('mute'));
                if (managesGroup && member.role !== 'owner' && duration > 0) {
                    const label = duration >= 86400000 ? `${duration / 86400000} 天` : duration >= 3600000 ? `${duration / 3600000} 小时` : `${duration / 60000} 分钟`;
                    operationNotice(group, `${actor}将${memberName(member)}禁言 ${label}`);
                } else if (Number(previous.mutedUntil || 0) > Date.now() && !member.mutedUntil) operationNotice(group, `${actor}解除了${memberName(member)}的禁言`);
                await save(group);
                if (memberReturnToSettings) settings(); else closePanel();
                render(false);
                wcRenderChatList();
            } catch (error) { report(error); }
        };
        if (el('wcGroupMemberNudge')) el('wcGroupMemberNudge').onclick = () => sendGroupNudge(id).catch(report);
        if (el('wcGroupMemberMention')) el('wcGroupMemberMention').onclick = () => insertMention(id);
        if (el('wcGroupMemberPrivate')) el('wcGroupMemberPrivate').onclick = () => { close(); wcOpenChatRoom(id); };
        if (el('wcGroupRemoveMember')) el('wcGroupRemoveMember').onclick =
            () => removeGroupMembers(group, [id]).catch(report);
    }

    async function addMembers() {
        const group = active();
        if (!group || !canManage(group)) return;
        const token = epoch;
        const contacts = wcGetGroupMemberCandidates(await wcReadLayoutRecord('contactsAppData')).filter(contact => !group.members.some(member => member.id === contact.id));
        if (token !== epoch || active() !== group) return;
        panel('添加群成员', `<form id="wcGroupAddForm" class="wc-group-select-form">
            <div class="wc-group-select-intro"><strong>邀请成员</strong><span>选择想要加入群聊的角色或 NPC</span></div>
            <p class="wc-group-select-count" id="wcGroupAddCount" aria-live="polite">未选择成员</p>
            <div class="wc-group-select-list">${memberChoices(contacts) || '<p class="wc-group-hint">所有可选角色和 NPC 都已在群中</p>'}</div>
        </form>`, 'add-members');
        renderChoiceAvatars(contacts);
        const addForm = el('wcGroupAddForm');
        const addButton = el('wcGroupPanelSave');
        const updateSelection = () => {
            const count = addForm.querySelectorAll('input[name="member"]:checked').length;
            el('wcGroupAddCount').textContent = count ? `已选择 ${count} 位成员` : '未选择成员';
            addButton.disabled = count === 0;
        };
        addForm.addEventListener('change', updateSelection);
        updateSelection();
        addForm.onsubmit = async event => {
            event.preventDefault();
            try {
                if (!canManage(group)) return;
                const ids = [...new Set(new FormData(event.currentTarget).getAll('member'))];
                if (!ids.length) return toast('请先选择要添加的成员');
                const candidates = wcGetGroupMemberCandidates(await wcReadLayoutRecord('contactsAppData'));
                if (token !== epoch || active() !== group) return;
                if (ids.some(id => !candidates.some(candidate => candidate.id === id))) throw new Error('所选成员资料已变更，请重新选择');
                pause();
                for (const id of ids) {
                    const contact = candidates.find(item => item.id === id);
                    if (!contact || group.members.some(member => member.id === id)) continue;
                    const member = { id, kind: contact.kind, sourceContactId: contact.sourceContactId, sourceNpcId: contact.sourceNpcId, parentWechatId: contact.parentWechatId, sourceContactName: contact.sourceContactName, name: contact.name, avatar: contact.avatar || '', nickname: '', title: '', role: 'member', joinedAt: Date.now(), historyFromSequence: group.sequence + 1 };
                    group.members.push(member);
                    operationNotice(group, `${operatorName(group)}邀请${memberName(member)}加入了群聊`);
                }
                await save(group); settings(); render(); wcRenderChatList();
            } catch (error) { report(error); }
        };
    }

    /*
     * MIT License
     * 
     * Copyright (c) 2020-2026 Paweł Kuna
     * 
     * Permission is hereby granted, free of charge, to any person obtaining a copy
     * of this software and associated documentation files (the "Software"), to deal
     * in the Software without restriction, including without limitation the rights
     * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
     * copies of the Software, and to permit persons to whom the Software is
     * furnished to do so, subject to the following conditions:
     * 
     * The above copyright notice and this permission notice shall be included in all
     * copies or substantial portions of the Software.
     * 
     * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
     * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
     * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
     * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
     * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
     * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
     * SOFTWARE.
     * Source: https://github.com/tabler/tabler-icons/tree/main/icons/outline
     */
    // Official Tabler Icons SVG markup. Each settings control has a distinct icon.
    // UI symbols: Remix Icon License v1.0 (commercial use permitted).
    // https://github.com/Remix-Design/RemixIcon/blob/master/License

    /*
     * Phosphor Icons (hand-tap-fill), MIT License.
     * Copyright (c) 2023 Phosphor Icons
     *
     * Permission is hereby granted, free of charge, to any person obtaining a copy
     * of this software and associated documentation files (the "Software"), to deal
     * in the Software without restriction, including without limitation the rights
     * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
     * copies of the Software, and to permit persons to whom the Software is
     * furnished to do so, subject to the following conditions:
     *
     * The above copyright notice and this permission notice shall be included in all
     * copies or substantial portions of the Software.
     *
     * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
     * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
     * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
     * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
     * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
     * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
     * SOFTWARE.
     * Source: https://github.com/phosphor-icons/core/blob/main/LICENSE
     */
    // Group icons use commercially licensed filled Remix icons and the Phosphor nudge gesture.
    const GROUP_ICON_MARKUP = Object.freeze({
        "book": "<svg t=\"1791374505842\" class=\"icon fill-icon\" viewBox=\"0 0 1024 1024\" version=\"1.1\" xmlns=\"http://www.w3.org/2000/svg\" p-id=\"13699\" width=\"200\" height=\"200\"><path d=\"M878.1 186.6c-45.2-14.2-94.8-20.3-142.4-20.3-79.3 0-164.8 16.3-223.7 61-59-44.7-144.4-61-223.7-61s-164.8 16.3-223.7 61v596c0 10.2 10.2 20.3 20.3 20.3 4.1 0 6.1-2 10.2-2 54.9-26.4 134.2-44.7 193.2-44.7 79.3 0 164.8 16.3 223.7 61 54.9-34.6 154.6-61 223.7-61 67.1 0 136.3 12.2 193.2 42.7 4.1 2 6.1 2 10.2 2 10.2 0 20.3-10.2 20.3-20.3V227.2c-24.3-18.3-50.8-30.5-81.3-40.6m0 549.1c-44.7-14.2-93.6-20.3-142.4-20.3-69.2 0-168.8 26.4-223.7 61V308.6c54.9-34.6 154.6-61 223.7-61 48.8 0 97.6 6.1 142.4 20.3v467.8z\" p-id=\"13700\"></path></svg>",
        "plug": '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M7 2h2v5h6V2h2v5h3v4a8 8 0 0 1-7 7.94V22h-2v-3.06A8 8 0 0 1 4 11V7h3V2Z"/></svg>',
        "token": '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M21.21 15.89A10 10 0 1 1 8 2.83"/><path d="M22 12A10 10 0 0 0 12 2v10z"/></svg>',
        "speakerphone": "<svg viewBox=\"0 0 24 24\" fill=\"currentColor\" xmlns=\"http://www.w3.org/2000/svg\"><path d=\"M21 10.063V4C21 3.44772 20.5523 3 20 3H19C17.0214 4.97864 13.3027 6.08728 11 6.61281V17.3872C13.3027 17.9127 17.0214 19.0214 19 21H20C20.5523 21 21 20.5523 21 20V13.937C21.8626 13.715 22.5 12.9319 22.5 12 22.5 11.0681 21.8626 10.285 21 10.063ZM5 7C3.89543 7 3 7.89543 3 9V15C3 16.1046 3.89543 17 5 17H6L7 22H9V7H5Z\"/></svg>",
        "pin": "<svg viewBox=\"0 0 24 24\" fill=\"currentColor\" xmlns=\"http://www.w3.org/2000/svg\"><path d=\"M22.3126 10.1753L20.8984 11.5895L20.1913 10.8824L15.9486 15.125L15.2415 18.6606L13.8273 20.0748L9.58466 15.8321L4.63492 20.7819L3.2207 19.3677L8.17045 14.4179L3.92781 10.1753L5.34202 8.76107L8.87756 8.05396L13.1202 3.81132L12.4131 3.10422L13.8273 1.69L22.3126 10.1753Z\"/></svg>",
        "bell-off": "<svg viewBox=\"0 0 24 24\" fill=\"currentColor\" xmlns=\"http://www.w3.org/2000/svg\"><path d=\"M18.5859 20H4.00016C3.72401 20 3.50016 19.7762 3.50016 19.5C3.50016 19.3918 3.53525 19.2866 3.60016 19.2L4.00016 18.6667V10C4.00016 8.67022 4.32462 7.41619 4.8987 6.31279L1.39355 2.80765L2.80777 1.39343L22.6068 21.1924L21.1925 22.6066L18.5859 20ZM20.0002 15.7858L7.55919 3.34486C8.8297 2.49537 10.3571 2.00003 12.0002 2.00003C16.4184 2.00003 20.0002 5.58176 20.0002 10V15.7858ZM9.50016 21H14.5002C14.5002 22.3807 13.3809 23.5 12.0002 23.5C10.6194 23.5 9.50016 22.3807 9.50016 21Z\"/></svg>",
        "award": "<svg viewBox=\"0 0 24 24\" fill=\"currentColor\" xmlns=\"http://www.w3.org/2000/svg\"><path d=\"M17 15.2454V22.1169C17 22.393 16.7761 22.617 16.5 22.617C16.4094 22.617 16.3205 22.5923 16.2428 22.5457L12 20L7.75725 22.5457C7.52046 22.6877 7.21333 22.6109 7.07125 22.3742C7.02463 22.2964 7 22.2075 7 22.1169V15.2454C5.17107 13.7793 4 11.5264 4 9C4 4.58172 7.58172 1 12 1C16.4183 1 20 4.58172 20 9C20 11.5264 18.8289 13.7793 17 15.2454ZM12 15C15.3137 15 18 12.3137 18 9C18 5.68629 15.3137 3 12 3C8.68629 3 6 5.68629 6 9C6 12.3137 8.68629 15 12 15ZM12 13C9.79086 13 8 11.2091 8 9C8 6.79086 9.79086 5 12 5C14.2091 5 16 6.79086 16 9C16 11.2091 14.2091 13 12 13Z\"/></svg>",
        "history": "<svg viewBox=\"0 0 24 24\" fill=\"currentColor\" xmlns=\"http://www.w3.org/2000/svg\"><path d=\"M12 22C6.47715 22 2 17.5228 2 12C2 6.47715 6.47715 2 12 2C17.5228 2 22 6.47715 22 12C22 17.5228 17.5228 22 12 22ZM13 12V7H11V14H17V12H13Z\"/></svg>",
        "volume-off": "<svg viewBox=\"0 0 24 24\" fill=\"currentColor\" xmlns=\"http://www.w3.org/2000/svg\"><path d=\"M5.88889 16.0001H2C1.44772 16.0001 1 15.5524 1 15.0001V9.00007C1 8.44778 1.44772 8.00007 2 8.00007H5.88889L11.1834 3.66821C11.3971 3.49335 11.7121 3.52485 11.887 3.73857C11.9601 3.8279 12 3.93977 12 4.05519V19.9449C12 20.2211 11.7761 20.4449 11.5 20.4449C11.3846 20.4449 11.2727 20.405 11.1834 20.3319L5.88889 16.0001ZM20.4142 12.0001L23.9497 15.5356L22.5355 16.9498L19 13.4143L15.4645 16.9498L14.0503 15.5356L17.5858 12.0001L14.0503 8.46454L15.4645 7.05032L19 10.5859L22.5355 7.05032L23.9497 8.46454L20.4142 12.0001Z\"/></svg>",
        "search": "<svg viewBox=\"0 0 24 24\" fill=\"currentColor\" xmlns=\"http://www.w3.org/2000/svg\"><path d=\"M18.031 16.6168L22.3137 20.8995L20.8995 22.3137L16.6168 18.031C15.0769 19.263 13.124 20 11 20C6.032 20 2 15.968 2 11C2 6.032 6.032 2 11 2C15.968 2 20 6.032 20 11C20 13.124 19.263 15.0769 18.031 16.6168Z\"/></svg>",
        "star": "<svg viewBox=\"0 0 24 24\" fill=\"currentColor\" xmlns=\"http://www.w3.org/2000/svg\"><path d=\"M12.0006 18.26L4.94715 22.2082L6.52248 14.2799L0.587891 8.7918L8.61493 7.84006L12.0006 0.5L15.3862 7.84006L23.4132 8.7918L17.4787 14.2799L19.054 22.2082L12.0006 18.26Z\"/></svg>",
        "refresh": "<svg viewBox=\"0 0 24 24\" fill=\"currentColor\" xmlns=\"http://www.w3.org/2000/svg\"><path d=\"M12 22C6.47715 22 2 17.5228 2 12C2 6.47715 6.47715 2 12 2C17.5228 2 22 6.47715 22 12C22 17.5228 17.5228 22 12 22ZM16.8201 17.0761C18.1628 15.8007 19 13.9981 19 12C19 8.13401 15.866 5 12 5C10.9391 5 9.9334 5.23599 9.03241 5.65834L10.0072 7.41292C10.6177 7.14729 11.2917 7 12 7C14.7614 7 17 9.23858 17 12H14L16.8201 17.0761ZM14.9676 18.3417L13.9928 16.5871C13.3823 16.8527 12.7083 17 12 17C9.23858 17 7 14.7614 7 12H10L7.17993 6.92387C5.83719 8.19929 5 10.0019 5 12C5 15.866 8.13401 19 12 19C13.0609 19 14.0666 18.764 14.9676 18.3417Z\"/></svg>",
        "trash": "<svg viewBox=\"0 0 24 24\" fill=\"currentColor\" xmlns=\"http://www.w3.org/2000/svg\"><path d=\"M17 6H22V8H20V21C20 21.5523 19.5523 22 19 22H5C4.44772 22 4 21.5523 4 21V8H2V6H7V3C7 2.44772 7.44772 2 8 2H16C16.5523 2 17 2.44772 17 3V6ZM9 11V17H11V11H9ZM13 11V17H15V11H13ZM9 4V6H15V4H9Z\"/></svg>",
        "users": "<svg viewBox=\"0 0 24 24\" fill=\"currentColor\" xmlns=\"http://www.w3.org/2000/svg\"><path d=\"M2 22C2 17.5817 5.58172 14 10 14C14.4183 14 18 17.5817 18 22H2ZM10 13C6.685 13 4 10.315 4 7C4 3.685 6.685 1 10 1C13.315 1 16 3.685 16 7C16 10.315 13.315 13 10 13ZM17.3628 15.2332C20.4482 16.0217 22.7679 18.7235 22.9836 22H20C20 19.3902 19.0002 17.0139 17.3628 15.2332ZM15.3401 12.9569C16.9728 11.4922 18 9.36607 18 7C18 5.58266 17.6314 4.25141 16.9849 3.09687C19.2753 3.55397 21 5.57465 21 8C21 10.7625 18.7625 13 16 13C15.7763 13 15.556 12.9853 15.3401 12.9569Z\"/></svg>",
        "plus": "<svg viewBox=\"0 0 24 24\" fill=\"currentColor\" xmlns=\"http://www.w3.org/2000/svg\"><path d=\"M11 11V5H13V11H19V13H13V19H11V13H5V11H11Z\"/></svg>",
        "at": "<svg viewBox=\"0 0 24 24\" fill=\"currentColor\" xmlns=\"http://www.w3.org/2000/svg\"><path d=\"M12 22C6.47715 22 2 17.5228 2 12C2 6.47715 6.47715 2 12 2C17.5228 2 22 6.47715 22 12C22 17.5228 17.5228 22 12 22ZM20 12C20 7.58172 16.4183 4 12 4C7.58172 4 4 7.58172 4 12C4 16.4183 7.58172 20 12 20C13.4702 20 14.8478 19.6034 16.0316 18.9114L15.0237 17.1835C14.1359 17.7026 13.1027 18 12 18C8.68629 18 6 15.3137 6 12C6 8.68629 8.68629 6 12 6C15.3137 6 18 8.68629 18 12V13C18 13.5523 17.5523 14 17 14C16.4477 14 16 13.5523 16 13V9H14.6458C13.9407 8.37764 13.0144 8 12 8C9.79086 8 8 9.79086 8 12C8 14.2091 9.79086 16 12 16C13.0465 16 13.9991 15.5982 14.7119 14.9404C15.2622 15.5886 16.0831 16 17 16C18.6569 16 20 14.6569 20 13V12ZM12 10C13.1046 10 14 10.8954 14 12C14 13.1046 13.1046 14 12 14C10.8954 14 10 13.1046 10 12C10 10.8954 10.8954 10 12 10Z\"/></svg>",
        "message-circle": "<svg viewBox=\"0 0 24 24\" fill=\"currentColor\" xmlns=\"http://www.w3.org/2000/svg\"><path d=\"M7.29117 20.8242L2 22L3.17581 16.7088C2.42544 15.3056 2 13.7025 2 12C2 6.47715 6.47715 2 12 2C17.5228 2 22 6.47715 22 12C22 17.5228 17.5228 22 12 22C10.2975 22 8.6944 21.5746 7.29117 20.8242Z\"/></svg>",
        "user-x": "<svg viewBox=\"0 0 24 24\" fill=\"currentColor\" xmlns=\"http://www.w3.org/2000/svg\"><path d=\"M14 14.252V22H4C4 17.5817 7.58172 14 12 14C12.6906 14 13.3608 14.0875 14 14.252ZM12 13C8.685 13 6 10.315 6 7C6 3.685 8.685 1 12 1C15.315 1 18 3.685 18 7C18 10.315 15.315 13 12 13ZM19 16.5858L21.1213 14.4645L22.5355 15.8787L20.4142 18L22.5355 20.1213L21.1213 21.5355L19 19.4142L16.8787 21.5355L15.4645 20.1213L17.5858 18L15.4645 15.8787L16.8787 14.4645L19 16.5858Z\"/></svg>",
        "photo": "<svg viewBox=\"0 0 24 24\" fill=\"currentColor\" xmlns=\"http://www.w3.org/2000/svg\"><path d=\"M20 5H4V19L13.2923 9.70649C13.6828 9.31595 14.3159 9.31591 14.7065 9.70641L20 15.0104V5ZM2 3.9934C2 3.44476 2.45531 3 2.9918 3H21.0082C21.556 3 22 3.44495 22 3.9934V20.0066C22 20.5552 21.5447 21 21.0082 21H2.9918C2.44405 21 2 20.5551 2 20.0066V3.9934ZM8 11C6.89543 11 6 10.1046 6 9C6 7.89543 6.89543 7 8 7C9.10457 7 10 7.89543 10 9C10 10.1046 9.10457 11 8 11Z\"/></svg>",
        "sticker": "<svg viewBox=\"0 0 24 24\" fill=\"currentColor\" xmlns=\"http://www.w3.org/2000/svg\"><path d=\"M21.9024 10.5976C21.4442 10.5333 20.976 10.5 20.5 10.5C17.2404 10.5 14.3455 12.0604 12.5212 14.471C12.3501 14.4887 12.1763 14.4978 12 14.4978C10.7188 14.4978 9.55217 14.0172 8.66691 13.2248L7.33309 14.7151C8.41871 15.6868 9.81141 16.3253 11.3466 16.4676C10.8023 17.7016 10.5 19.0662 10.5 20.5C10.5 20.976 10.5333 21.4442 10.5976 21.9024C5.7387 21.2205 2 17.0469 2 12C2 6.47715 6.47715 2 12 2C17.0469 2 21.2205 5.7387 21.9024 10.5976ZM21.8707 12.617C21.4254 12.5401 20.9674 12.5 20.5 12.5C17.7656 12.5 15.3512 13.8709 13.9068 15.9675C13.0194 17.2556 12.5 18.8156 12.5 20.5C12.5 20.9674 12.5401 21.4254 12.617 21.8707L21.8707 12.617ZM8.5 11.5C9.32843 11.5 10 10.8284 10 10C10 9.17157 9.32843 8.5 8.5 8.5C7.67157 8.5 7 9.17157 7 10C7 10.8284 7.67157 11.5 8.5 11.5ZM15.5 11.5C16.3284 11.5 17 10.8284 17 10C17 9.17157 16.3284 8.5 15.5 8.5C14.6716 8.5 14 9.17157 14 10C14 10.8284 14.6716 11.5 15.5 11.5Z\"/></svg>",
        "nudge": "<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 256 256\" fill=\"currentColor\"><path d=\"M64,64a48,48,0,0,1,96,0,8,8,0,0,1-16,0,32,32,0,0,0-64,0,8,8,0,0,1-16,0Zm143.23,56c-8.61.4-15.23,7.82-15.23,16.43v7.28a8.17,8.17,0,0,1-7.47,8.25,8,8,0,0,1-8.53-8V120.45c0-8.61-6.62-16-15.23-16.43A16,16,0,0,0,144,120v15.73a8.17,8.17,0,0,1-7.47,8.25,8,8,0,0,1-8.53-8V64.45c0-8.61-6.62-16-15.23-16.43A16,16,0,0,0,96,64V183.74a8.19,8.19,0,0,1-6.72,8.16l-.12,0a6.09,6.09,0,0,1-6-3.09l-21-36.44c-4.3-7.46-13.74-10.57-21.4-6.62A16,16,0,0,0,34.15,168L65.1,228.05A8,8,0,0,0,72,232H208a8,8,0,0,0,7.16-4.42c.36-.72,8.84-15.06,8.84-40.65V136A16,16,0,0,0,207.23,120Z\"/></svg>",
        "game-invite": "<svg viewBox=\"-56 -56 1136 1136\" fill=\"currentColor\" xmlns=\"http://www.w3.org/2000/svg\" aria-hidden=\"true\"><path d=\"M341.333333 648.533333c0-157.013333 157.013333-286.72 351.573334-290.133333 6.826667 0 10.24-3.413333 13.653333-6.826667 3.413333-3.413333 3.413333-10.24 3.413333-13.653333-37.546667-150.186667-180.906667-252.586667-348.16-252.586667C160.426667 85.333333 0 232.106667 0 409.6v6.826667c0 71.68 27.306667 139.946667 81.92 194.56l10.24 10.24c10.24 17.066667 23.893333 27.306667 40.96 40.96l-61.44 116.053333c-3.413333 6.826667-3.413333 13.653333 3.413333 20.48 3.413333 3.413333 6.826667 3.413333 10.24 3.413333 3.413333 0 6.826667 0 10.24-3.413333l129.706667-88.746667c34.133333 13.653333 71.68 20.48 109.226667 23.893334 6.826667 0 10.24-3.413333 13.653333-6.826667 3.413333-3.413333 3.413333-10.24 3.413333-13.653333-6.826667-23.893333-10.24-44.373333-10.24-64.853334z m-245.76-40.96z\"/><path d=\"M1024 648.533333c0-139.946667-146.773333-256-324.266667-256S375.466667 508.586667 375.466667 648.533333s146.773333 256 324.266666 256c17.066667 0 34.133333 0 54.613334-3.413333 17.066667-3.413333 30.72-3.413333 44.373333-10.24l98.986667 44.373333h6.826666c3.413333 0 6.826667 0 10.24-3.413333 6.826667-3.413333 6.826667-10.24 6.826667-17.066667l-20.48-64.853333c75.093333-47.786667 122.88-122.88 122.88-201.386667z\"/></svg>",
        "reaction": "<svg class=\"wc-group-reaction-svg\" viewBox=\"-28 -28 1080 1080\" fill=\"currentColor\" xmlns=\"http://www.w3.org/2000/svg\"><path d=\"M790.376296 70.542222H233.623704c-97.46963 0-176.734815 79.265185-176.734815 176.734815v381.155556c0 97.46963 79.265185 176.734815 176.734815 176.734814h10.998518v80.782223c0 26.927407 15.17037 50.820741 40.201482 61.819259 23.134815 10.05037 51.617185 7.205926 72.438518-11.757037l145.256297-130.844445h287.857777c97.46963 0 176.734815-79.265185 176.734815-176.734814V247.277037c0-97.46963-79.265185-176.734815-176.734815-176.734815z m-87.608889 402.394074c-34.967704 59.922963-97.621333 112.905481-150.565926 151.703704-11.757037 7.964444-25.031111 12.136296-38.684444 12.136296-13.274074 0-26.548148-3.792593-37.925926-11.757037-59.58163-41.566815-118.480593-94.170074-156.254815-155.496296-20.48-34.512593-30.72-68.266667-30.72-100.882963 0-71.68 57.647407-129.706667 128.948148-129.706667 36.02963 0 70.162963 15.17037 94.435556 40.96 29.202963-31.478519 72.817778-46.26963 117.191111-38.684444 58.785185 10.24 104.296296 63.336296 106.192593 123.259259 0 39.708444-12.250074 74.334815-32.616297 108.468148z\"/></svg>",
        "recall": "<svg viewBox=\"0 0 24 24\" fill=\"currentColor\" xmlns=\"http://www.w3.org/2000/svg\"><path d=\"M8 7V11L2 6L8 1V5H13C17.4183 5 21 8.58172 21 13C21 17.4183 17.4183 21 13 21H4V19H13C16.3137 19 19 16.3137 19 13C19 9.68629 16.3137 7 13 7H8Z\"/></svg>",
        "link": "<svg viewBox=\"0 0 24 24\" fill=\"currentColor\" xmlns=\"http://www.w3.org/2000/svg\"><path d=\"M18.3638 15.5355L16.9496 14.1213L18.3638 12.7071C20.3164 10.7545 20.3164 7.58866 18.3638 5.63604C16.4112 3.68341 13.2453 3.68341 11.2927 5.63604L9.87849 7.05025L8.46428 5.63604L9.87849 4.22182C12.6122 1.48815 17.0443 1.48815 19.778 4.22182C22.5117 6.95549 22.5117 11.3876 19.778 14.1213L18.3638 15.5355ZM15.5353 18.364L14.1211 19.7782C11.3875 22.5118 6.95531 22.5118 4.22164 19.7782C1.48797 17.0445 1.48797 12.6123 4.22164 9.87868L5.63585 8.46446L7.05007 9.87868L5.63585 11.2929C3.68323 13.2455 3.68323 16.4113 5.63585 18.364C7.58847 20.3166 10.7543 20.3166 12.7069 18.364L14.1211 16.9497L15.5353 18.364ZM14.8282 7.75736L16.2425 9.17157L9.17139 16.2426L7.75717 14.8284L14.8282 7.75736Z\"/></svg>",
        "red-packet": "<svg aria-hidden=\"true\" viewBox=\"0 0 24 24\" fill=\"currentColor\" xmlns=\"http://www.w3.org/2000/svg\"><path d=\"M21.0049 5.94028C19.2657 7.91075 16.8895 9.30566 14.1986 9.80276C13.7739 9.02805 12.9507 8.50281 12.0049 8.50281C11.0591 8.50281 10.2359 9.02805 9.8112 9.80276C7.12025 9.30566 4.74405 7.91075 3.00488 5.94028V3.00281C3.00488 2.45052 3.4526 2.00281 4.00488 2.00281H20.0049C20.5572 2.00281 21.0049 2.45052 21.0049 3.00281V5.94028ZM21.0049 8.72704V21.0028C21.0049 21.5551 20.5572 22.0028 20.0049 22.0028H4.00488C3.4526 22.0028 3.00488 21.5551 3.00488 21.0028V8.72704C4.86501 10.2897 7.13757 11.3774 9.63575 11.8032C9.96947 12.7914 10.9041 13.5028 12.0049 13.5028C13.1057 13.5028 14.0403 12.7914 14.374 11.8032C16.8722 11.3774 19.1448 10.2897 21.0049 8.72704Z\"/></svg>",
        "poll": "<svg aria-hidden=\"true\" viewBox=\"0 0 1024 1024\" fill=\"currentColor\" xmlns=\"http://www.w3.org/2000/svg\"><path d=\"M845.8752 496.64V158.72a40.96 40.96 0 0 0-40.96-40.96h-112.64a40.96 40.96 0 0 0-40.96 40.96v354.304a240.64 240.64 0 0 1 194.56-16.384zM586.7008 564.8896v-253.44a40.96 40.96 0 0 0-40.96-40.96h-112.64a40.96 40.96 0 0 0-40.96 40.96v552.1408a40.96 40.96 0 0 0 40.96 40.96h112.64a40.96 40.96 0 0 0 37.7344-25.0368 240.64 240.64 0 0 1 3.2256-314.624z\"/><path d=\"M133.12 413.952m40.96 0l112.4864 0q40.96 0 40.96 40.96l0 408.6784q0 40.96-40.96 40.96l-112.4864 0q-40.96 0-40.96-40.96l0-408.6784q0-40.96 40.96-40.96Z\"/><path d=\"M767.1808 538.9312A185.1392 185.1392 0 1 0 952.32 724.0704a185.1392 185.1392 0 0 0-185.1392-185.1392zM868.7616 696.32l-104.1408 104.1408a32.3584 32.3584 0 0 1-45.7728 0l-48.5888-48.5888a32.4096 32.4096 0 0 1 22.9376-55.296 32.2048 32.2048 0 0 1 22.8864 9.472l25.6 25.6 81.2544-81.408a32.4096 32.4096 0 1 1 45.7728 45.824z\"/></svg>",
        "relay": "<svg aria-hidden=\"true\" viewBox=\"-56 -56 1136 1136\" fill=\"currentColor\" xmlns=\"http://www.w3.org/2000/svg\"><path d=\"M1023.648914 755.419429c0-4.213029 0-8.309029-0.936228-12.522058s-0.8192-8.309029-1.404343-12.405028-1.404343-8.309029-2.223543-12.405029-1.755429-8.192-2.808686-11.702857-2.106514-8.074971-3.2768-11.702857-2.574629-7.957943-3.978971-11.702857-2.925714-7.840914-4.447086-11.702857-3.393829-7.723886-5.149257-11.702857-3.627886-7.489829-5.617371-11.702858-4.096-7.3728-6.202515-11.000685-4.447086-7.138743-6.787657-10.6496-4.681143-6.904686-7.138743-10.298515-5.149257-6.670629-7.840914-9.8304-5.383314-6.436571-8.192-9.479314-5.617371-6.202514-8.660114-9.128228-5.968457-5.851429-9.0112-8.660115-6.319543-5.617371-9.596343-8.309028-6.5536-5.149257-9.947429-7.606857-6.670629-4.9152-10.181485-7.255772l-10.6496-6.787657-10.883658-6.202514-11.702857-5.617372c-3.744914-1.755429-7.606857-3.510857-11.702857-5.032228s-7.723886-3.159771-11.702857-4.564115-7.840914-2.808686-11.702857-3.978971-7.957943-2.340571-11.702857-3.2768l-11.702857-2.808686c-4.096-0.8192-8.192-1.521371-12.405029-2.106514s-8.309029-1.170286-12.405029-1.521371-8.309029-0.8192-12.522057-1.053258h-12.522057v-12.522057c0-4.096 0-8.426057-0.936228-12.639085s-0.936229-8.309029-1.521372-12.405029-1.404343-8.309029-2.223543-12.405029-1.6384-8.192-2.691657-11.702857-2.106514-8.074971-3.393828-11.702857-2.4576-7.957943-3.861943-11.702857-2.925714-7.840914-4.564115-11.702857-3.2768-7.723886-5.149257-11.702857-3.627886-7.606857-5.617371-11.702857-3.978971-7.3728-6.202514-11.000686-4.330057-7.138743-6.670629-10.532572-4.798171-6.904686-7.255771-10.298514-5.032229-6.670629-7.723886-9.947428-5.383314-6.436571-8.192-9.479315l-8.660114-9.128228c-3.042743-2.925714-5.968457-5.851429-9.128229-8.660115s-6.202514-5.500343-9.479314-8.192-6.5536-5.266286-9.947429-7.723885-6.787657-4.9152-10.298514-7.255772-7.021714-4.564114-10.532572-6.670628-7.255771-4.213029-11.000685-6.202515-7.3728-3.861943-11.702857-5.617371-7.606857-3.510857-11.702858-5.149257-7.723886-3.159771-11.702857-4.564114l-11.702857-3.861943c-3.978971-1.287314-8.074971-2.340571-11.702857-3.393829s-8.192-1.872457-11.702857-2.691657-8.309029-1.6384-12.405029-2.223543L537.044114 257.462857l-12.522057-0.936228h-12.522057v-12.522058c0-4.213029 0-8.309029-0.936229-12.522057s-0.936229-8.309029-1.521371-12.405028-1.287314-8.309029-2.106514-12.405029-1.755429-8.192-2.808686-12.288-2.106514-8.074971-3.2768-11.702857-2.574629-7.957943-3.978971-11.702857-2.925714-7.840914-4.447086-11.702857-3.393829-7.723886-5.149257-11.702857-3.627886-7.489829-5.617372-11.117715-4.096-7.3728-6.202514-11.000685-4.447086-7.138743-6.787657-10.6496-4.681143-6.904686-7.138743-10.298515-5.617371-7.723886-8.192-10.883657-5.383314-6.436571-8.192-9.479314-5.617371-6.202514-8.660114-9.128229-5.968457-5.851429-9.0112-8.660114-6.670629-5.617371-9.596343-7.840914-6.5536-5.149257-9.947429-7.606857-6.670629-4.9152-10.181485-7.255772l-10.6496-6.787657-10.883658-6.202514-11.702857-5.617372c-3.744914-1.755429-7.606857-3.510857-11.702857-5.032228s-7.723886-3.159771-11.702857-4.564115-7.840914-2.808686-11.702857-3.978971-7.957943-2.340571-11.702857-3.2768L305.912686 4.9152c-4.096-0.8192-8.192-1.521371-12.405029-2.106514s-8.192-1.170286-12.639086-1.521372S272.7936 0 269.165714 0h-25.746285c-4.213029 0-8.309029 0-12.522058 0.936229s-8.543086 1.170286-12.405028 1.755428l-12.405029 2.223543-12.288 2.808686c-4.096 0.936229-8.074971 2.106514-11.702857 3.2768s-7.957943 2.574629-11.702857 3.978971l-11.702857 4.447086-11.702857 5.149257c-3.744914 1.755429-7.489829 3.627886-11.117715 5.617371s-7.3728 4.096-11.000685 6.202515l-10.6496 6.787657c-3.510857 2.340571-6.904686 4.681143-10.298515 7.255771S96.782629 55.471543 93.622857 58.514286s-6.436571 5.383314-9.479314 8.192-6.202514 5.617371-9.128229 8.660114-5.851429 5.968457-8.660114 9.0112-5.617371 5.968457-7.840914 9.245257-5.149257 6.5536-7.606857 9.947429-4.9152 6.670629-7.255772 10.181485-4.564114 7.021714-6.787657 10.6496-4.213029 7.255771-6.202514 10.883658l-5.617372 11.702857c-1.755429 3.744914-3.510857 7.606857-5.032228 11.702857s-3.159771 7.723886-4.564115 11.702857-2.808686 7.840914-3.978971 11.702857-2.340571 7.957943-3.2768 11.702857-1.989486 8.192-2.808686 12.288-1.521371 8.192-2.106514 12.405029-1.170286 8.192-1.521371 12.405028S0 239.2064 0 243.419429V269.165714c0 4.798171 0 8.309029 0.936229 12.522057s0.8192 8.309029 1.404342 12.405029 1.404343 8.309029 2.223543 12.405029 1.755429 8.192 2.808686 12.288 2.106514 8.074971 3.2768 11.702857 2.574629 7.957943 3.978971 11.702857 2.925714 7.840914 4.447086 11.702857 3.393829 7.723886 5.149257 11.702857 3.627886 7.489829 5.617372 11.117714 4.096 7.3728 6.202514 11.000686 4.447086 7.138743 6.787657 10.6496 4.681143 6.904686 7.255772 10.298514 5.032229 6.5536 7.723885 9.8304 5.383314 6.436571 8.192 9.479315 5.617371 6.202514 8.660115 9.128228 5.968457 5.851429 9.0112 8.660115 6.319543 5.617371 9.596342 8.192 6.5536 5.266286 9.947429 7.840914 6.670629 4.798171 10.181486 7.138743l10.6496 6.787657 10.883657 6.202514 11.702857 5.617372c3.744914 1.755429 7.606857 3.510857 11.702857 5.032228s7.723886 3.159771 11.702857 4.564114 7.840914 2.808686 11.702857 3.978972 7.957943 2.340571 11.702858 3.2768l12.288 2.808686c4.096 0.8192 8.192 1.521371 12.405028 2.106514s8.192 1.170286 12.405029 1.521371 8.309029 0.8192 12.522057 1.053257h12.522057v12.522058c0 4.096 0.585143 8.426057 0.936229 12.639085s0.936229 8.309029 1.521371 12.405029 1.404343 8.309029 2.223543 12.405028 1.6384 8.192 2.691657 11.702858 2.106514 8.074971 3.393829 11.702857 2.4576 7.957943 3.861942 11.702857 2.925714 7.840914 4.564115 11.702857 3.2768 7.723886 5.032228 11.702857 3.744914 7.606857 5.7344 11.702857 3.978971 7.3728 6.202515 11.000686 4.330057 7.138743 6.670628 10.532571 4.798171 6.904686 7.255772 10.298515 5.032229 6.670629 7.723885 9.947428 5.383314 6.436571 8.192 9.479315l8.660115 9.128228c3.042743 2.925714 5.968457 5.851429 9.128228 8.660114s6.202514 5.500343 9.479314 8.192 6.5536 5.266286 9.947429 7.723886 6.787657 4.9152 10.298514 7.255772 7.021714 4.564114 10.532572 6.670628 7.255771 4.213029 11.000685 6.202514 7.3728 3.861943 11.702858 5.617372 7.606857 3.510857 11.702857 5.149257 7.723886 3.159771 11.702857 4.564114 7.957943 2.691657 11.702857 3.861943 8.074971 2.340571 11.702857 3.393829 8.192 1.872457 11.702857 2.691657 8.309029 1.6384 12.405029 2.223543l12.522057 1.521371 12.522057 0.936229h12.522057v12.522057c0 4.213029 0 8.309029 0.936229 12.522057s0.8192 8.309029 1.404343 12.405029 1.404343 8.309029 2.223543 12.405028 1.755429 8.192 2.808685 11.702857 2.106514 8.074971 3.2768 11.702857 2.574629 7.957943 3.978972 11.702858 2.925714 7.840914 4.447085 11.702857 3.393829 7.723886 5.149258 11.702857 3.627886 7.489829 5.617371 11.702857 4.096 7.3728 6.202514 11.000686 4.447086 7.138743 6.787657 10.6496 4.681143 6.904686 7.255772 10.298514 5.032229 6.670629 7.723886 9.8304 5.383314 6.436571 8.192 9.479314 5.617371 6.202514 8.660114 9.128229 5.968457 5.851429 9.0112 8.660114 6.319543 5.617371 9.596343 8.192 6.5536 5.266286 9.947428 7.840914 6.670629 4.798171 10.181486 7.138743l10.6496 6.787657 10.883657 6.202515q5.617371 3.042743 11.702857 5.617371c3.744914 1.755429 7.606857 3.510857 11.702857 5.032229s7.723886 3.159771 11.702858 4.564114 7.840914 2.808686 11.702857 3.978971 7.957943 2.340571 11.702857 3.2768 8.192 1.989486 11.702857 2.808686 8.192 1.521371 12.405029 2.106514 8.309029 1.170286 12.405028 1.521372 8.309029 0.8192 12.522057 1.053257H778.474057c4.213029 0 8.309029 0 12.522057-0.936229s8.309029-0.8192 12.405029-1.404342l12.405028-2.223543q6.085486-1.170286 11.702858-2.808686c4.096-0.936229 8.074971-2.106514 11.702857-3.2768s7.957943-2.574629 11.702857-3.978971l11.702857-4.447086 11.702857-5.149257c3.744914-1.755429 7.489829-3.627886 11.702857-5.617372s7.3728-4.096 11.000686-6.202514l10.6496-6.787657 10.298514-7.138743c3.2768-2.574629 6.670629-5.149257 9.8304-7.840914s6.436571-5.383314 9.479315-8.192 6.202514-5.617371 9.128228-8.660115 5.851429-5.968457 8.660114-9.0112 5.617371-6.319543 8.192-9.596342 5.266286-6.5536 7.840915-9.947429 4.798171-6.670629 7.138743-10.181486 4.564114-7.021714 6.787657-10.6496 4.213029-7.255771 6.202514-10.883657 3.861943-7.489829 5.617371-11.702857 3.510857-7.606857 5.032229-11.702857 3.159771-7.723886 4.564114-11.702857 2.808686-7.840914 3.978972-11.702857 2.340571-7.957943 3.2768-11.702858 1.989486-8.192 2.808685-11.702857 1.521371-8.192 2.106515-12.405028 1.170286-8.309029 1.521371-12.405029 0.8192-8.309029 1.053257-12.522057 0-8.426057 0-12.522057c2.808686-3.510857 2.691657-7.723886 2.4576-11.936914zM242.015086 402.2272V171.797943a161.3824 161.3824 0 0 1-65.536 35.108571v-46.811428a170.3936 170.3936 0 0 0 41.077028-16.852115 173.904457 173.904457 0 0 0 36.161829-28.203885h35.108571V386.194286c-1.053257 1.755429-1.989486 3.627886-3.042743 5.500343s-3.744914 7.138743-5.383314 10.883657z m168.872228 256.058514a110.826057 110.826057 0 0 1 28.554972-76.302628 395.322514 395.322514 0 0 1 66.004114-52.779886 270.804114 270.804114 0 0 0 39.438629-32.065829 68.8128 68.8128 0 0 0 18.958628-45.641142 46.811429 46.811429 0 0 0-12.522057-35.108572 54.184229 54.184229 0 0 0-37.332114-11.702857 45.8752 45.8752 0 0 0-39.789715 18.139429 87.303314 87.303314 0 0 0-14.628571 51.024457h-46.811429a132.944457 132.944457 0 0 1 1.287315-16.969143 103.102171 103.102171 0 0 1 26.916571-60.503772 89.877943 89.877943 0 0 1 44.821943-27.735771 117.028571 117.028571 0 0 1 29.959314-3.744914 99.591314 99.591314 0 0 1 68.695772 24.107885 79.579429 79.579429 0 0 1 26.682514 62.376229 99.825371 99.825371 0 0 1-28.203886 68.110629 372.150857 372.150857 0 0 1-59.567543 46.811428c-29.374171 19.192686-46.811429 36.161829-53.365028 50.673372H561.737143c-2.223543 2.808686-4.213029 5.7344-6.202514 8.777142s-4.564114 7.021714-6.787658 10.6496-4.213029 7.255771-6.202514 10.883658-3.627886 7.3728-5.500343 11.000685z m433.005715 235.578515a109.7728 109.7728 0 0 1-76.068572 26.2144 108.485486 108.485486 0 0 1-72.0896-23.405715 102.517029 102.517029 0 0 1-33.704228-74.079085h48.3328A58.514286 58.514286 0 0 0 728.034743 866.011429a57.226971 57.226971 0 0 0 39.906743 14.043428 60.386743 60.386743 0 0 0 43.066514-15.213714 46.811429 46.811429 0 0 0 14.043429-33.938286 42.949486 42.949486 0 0 0-14.862629-36.0448 64.482743 64.482743 0 0 0-42.247314-11.702857H747.812571v-35.108571h20.128915a59.567543 59.567543 0 0 0 38.619428-10.883658 47.864686 47.864686 0 0 0 1.170286-64.014628 55.939657 55.939657 0 0 0-37.332114-10.883657 50.322286 50.322286 0 0 0-55.939657 51.024457h-46.811429a93.622857 93.622857 0 0 1 32.182857-67.525486 89.526857 89.526857 0 0 1 41.545143-20.714057 126.858971 126.858971 0 0 1 28.086857-2.925714 109.421714 109.421714 0 0 1 70.217143 20.948114 70.217143 70.217143 0 0 1 26.2144 58.514286c0 31.480686-16.149943 52.4288-47.981714 62.844343a79.696457 79.696457 0 0 1 39.087543 23.405714 60.386743 60.386743 0 0 1 14.511542 41.7792 84.260571 84.260571 0 0 1-27.150628 64.248686z\"/></svg>",
        "gamepad": "<svg aria-hidden=\"true\" viewBox=\"0 0 1024 1024\" fill=\"currentColor\" xmlns=\"http://www.w3.org/2000/svg\"><path fill=\"currentColor\" d=\"M951.4 501.4C926.4 275.5 823.1 195 734.8 195c-31.8 0-53.6 13.1-76.8 27-31.9 19.1-67.9 40.8-146.1 40.8s-114.1-21.7-146-40.8c-23.1-13.9-44.9-27-76.8-27-88.3 0-191.6 80.5-216.6 306.4-18.1 164-8.9 260.1 29.2 302.6 14.9 16.6 34 25 56.9 25 58.7 0 92.2-35.1 131-75.8 13.7-14.4 27.9-29.3 44.5-44.1C377.6 670.3 421.3 665 462 665c7.3 0 14.4 0.2 21.2 0.3 6.5 0.2 12.9 0.3 18.9 0.3h19.6c6 0 12.4-0.2 18.9-0.3 6.8-0.2 13.9-0.3 21.2-0.3 40.8 0 84.5 5.3 127.9 44.1 16.6 14.8 30.8 29.7 44.5 44.1 38.8 40.7 72.3 75.8 131 75.8 22.9 0 42-8.4 56.9-25 38.2-42.5 47.4-138.7 29.3-302.6z m-539.9-10.6h-75.6v73.5c0 11-9 20-20 20s-20-9-20-20v-73.5h-71.3c-11 0-20-9-20-20 0-11.1 9-20 20-20h71.3v-73.5c0-11 9-20 20-20s20 9 20 20v73.5h75.6c11 0 20 8.9 20 20s-8.9 20-20 20zM629.1 513c-20.9 0-37.8-16.9-37.8-37.9 0-20.9 16.9-37.8 37.8-37.8s37.8 16.9 37.8 37.8c0.1 21-16.9 37.9-37.8 37.9z m76.2 76.2c-20.9 0-37.9-16.9-37.9-37.9 0-20.9 16.9-37.8 37.9-37.8 20.9 0 37.8 16.9 37.8 37.8 0.1 21-16.9 37.9-37.8 37.9z m0-152.4c-20.9 0-37.9-16.9-37.9-37.8s16.9-37.9 37.9-37.9c20.9 0 37.8 17 37.8 37.9 0.1 20.9-16.9 37.8-37.8 37.8z m76.2 76.2c-20.9 0-37.9-16.9-37.9-37.9 0-20.9 17-37.8 37.9-37.8s37.8 16.9 37.8 37.8c0.1 21-16.9 37.9-37.8 37.9z\"/></svg>",
        "red-packet-claim": "<svg viewBox=\"0 0 24 24\" fill=\"currentColor\" xmlns=\"http://www.w3.org/2000/svg\"><path d=\"M9.3349 11.5023L11.5049 11.5028C13.9902 11.5028 16.0049 13.5175 16.0049 16.0028H9.00388L9.00488 17.0028L17.0049 17.002V16.0028C17.0049 14.9204 16.6867 13.8997 16.1188 13.002L19.0049 13.0028C20.9972 13.0028 22.7173 14.1681 23.521 15.8542C21.1562 18.9748 17.3268 21.0028 13.0049 21.0028C10.2436 21.0028 7.90445 20.4122 6.00456 19.378L6.00592 10.0738C7.25147 10.2522 8.39122 10.7585 9.3349 11.5023ZM5.00488 19.0028C5.00488 19.5551 4.55717 20.0028 4.00488 20.0028H2.00488C1.4526 20.0028 1.00488 19.5551 1.00488 19.0028V10.0028C1.00488 9.45052 1.4526 9.00281 2.00488 9.00281H4.00488C4.55717 9.00281 5.00488 9.45052 5.00488 10.0028V19.0028ZM18.0049 5.00281C19.6617 5.00281 21.0049 6.34595 21.0049 8.00281C21.0049 9.65966 19.6617 11.0028 18.0049 11.0028C16.348 11.0028 15.0049 9.65966 15.0049 8.00281C15.0049 6.34595 16.348 5.00281 18.0049 5.00281ZM11.0049 2.00281C12.6617 2.00281 14.0049 3.34595 14.0049 5.00281C14.0049 6.65966 12.6617 8.00281 11.0049 8.00281C9.34803 8.00281 8.00488 6.65966 8.00488 5.00281C8.00488 3.34595 9.34803 2.00281 11.0049 2.00281Z\"/></svg>",
        "poll-vote": "<svg viewBox=\"0 0 24 24\" fill=\"currentColor\" xmlns=\"http://www.w3.org/2000/svg\"><path d=\"M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22ZM17.4571 9.45711L11 15.9142L6.79289 11.7071L8.20711 10.2929L11 13.0858L16.0429 8.04289L17.4571 9.45711Z\"/></svg>",
        "relay-join": "<svg viewBox=\"0 0 24 24\" fill=\"currentColor\" xmlns=\"http://www.w3.org/2000/svg\"><path d=\"M8.00008 6V9H5.00008V6H8.00008ZM3.00008 4V11H10.0001V4H3.00008ZM13.0001 4H21.0001V6H13.0001V4ZM13.0001 11H21.0001V13H13.0001V11ZM13.0001 18H21.0001V20H13.0001V18ZM10.7072 16.2071L9.29297 14.7929L6.00008 18.0858L4.20718 16.2929L2.79297 17.7071L6.00008 20.9142L10.7072 16.2071Z\"/></svg>",
        "chat-private": "<svg viewBox=\"0 0 24 24\" fill=\"currentColor\" xmlns=\"http://www.w3.org/2000/svg\"><path d=\"M12 2C17.5228 2 22 6.47715 22 12C22 17.5228 17.5228 22 12 22C10.298 22 8.69525 21.5748 7.29229 20.8248L2 22L3.17629 16.7097C2.42562 15.3063 2 13.7028 2 12C2 6.47715 6.47715 2 12 2ZM12 7C10.4023 7 9 8.34 9 10V11H8V16H16V11H15V10C15 8.34315 13.6569 7 12 7ZM14 13V14H10V13H14ZM12 9C12.4762 9 13 9.49 13 10V11H11V10C11 9.49 11.4872 9 12 9Z\"/></svg>"
    });

    function groupSettingsChevron() {
        // Exact private-chat settings chevron SVG, shared by group settings rows.
        return '<span class="wc-group-row-chevron" aria-hidden="true"><svg class="wc-settings-chevron" viewBox="0 0 8 13"><path d="M1.5 1.5L6.5 6.5L1.5 11.5"/></svg></span>';
    }

    function groupSettingsIcon(kind) {
        const voice = kind === 'voice' ? el('wcGroupVoiceButton')?.querySelector('.wc-function-icon')?.innerHTML : '';
        return `<span class="wc-group-setting-icon" aria-hidden="true">${voice || GROUP_ICON_MARKUP[kind] || GROUP_ICON_MARKUP.users}</span>`;
    }

    function appearanceColor(value, fallback) {
        return /^#[0-9a-f]{6}$/i.test(String(value || '')) ? String(value) : fallback;
    }

    function appearanceTextColor(hex) {
        const color = appearanceColor(hex, '#000000').slice(1);
        const channels = [0, 2, 4].map(offset => parseInt(color.slice(offset, offset + 2), 16) / 255)
            .map(channel => channel <= .04045 ? channel / 12.92 : Math.pow((channel + .055) / 1.055, 2.4));
        return .2126 * channels[0] + .7152 * channels[1] + .0722 * channels[2] > .35 ? '#000000' : '#ffffff';
    }


    function openGroupImageViewer(group, message) {
        if (groupSelectionMode) { toggleGroupSelection(message.id); return; }
        if (typeof window.wcOpenImageBottomSheet !== 'function') return;
        const owner = account, token = epoch, originalText = message.text;
        const current = () => rows(group).find(item => item.id === message.id);
        const isCurrent = () => owner === currentAccount() && token === epoch && active() === group &&
            Boolean(current() && !current().recalled && !current().hiddenForUser && current().text === originalText);
        if (!isCurrent()) return;
        const member = group.members.find(item => item.id === message.senderId);
        const context = {
            key: owner + ':' + group.id + ':' + message.id,
            message, senderName: member ? memberName(member) : message.senderName,
            senderAvatar: member?.avatar || message.senderAvatar || '', isCurrent,
            isFavorite: () => wcIsGroupMessageFavorite(group.id, message.id),
            toggleFavorite: async () => {
                if (!isCurrent()) return;
                await wcToggleGroupMessageFavorite(group, current());
                if (!isCurrent()) return;
                await save(group);
                render(false);
            },
            generate: async () => {
                if (!isCurrent()) return null;
                const before = current(), expectedUrl = before.imageUrl;
                const prompt = before.imagePrompt || before.text;
                const contactId = member?.kind === 'npc' || message.senderId === USER_ID ? null : message.senderId;
                const url = await window.generateChatImage(prompt, contactId);
                if (!isCurrent()) return null;
                if (!safeStickerUrl(url)) throw new Error('生图接口没有返回有效图片');
                const saved = await transactActivity((_draft, messages) => {
                    const target = messages.find(item => item.id === message.id);
                    if (!isCurrent() || !target || target.recalled || target.text !== originalText ||
                        target.imageUrl !== expectedUrl || (target.imagePrompt || target.text) !== prompt) return false;
                    target.imageUrl = url;
                    target.isSimulatedImage = false;
                    return true;
                }, null, group);
                return saved ? current() : null;
            }
        };
        const simulated = message.isSimulatedImage === true ||
            (typeof wcIsPlaceholderImageSrc === 'function' && wcIsPlaceholderImageSrc(message.imageUrl));
        window.wcOpenImageBottomSheet(simulated ? 'placeholder' : 'real', message.imageUrl,
            message.imagePrompt || message.text, message.id, context);
    }

    // Reuse the private-chat media composers and image compression for every group theme.
    function canSendGroupMedia(group) {
        if (group?.mode === 'participate' && canSpeak(group, group.members.find(member => member.id === USER_ID))) return true;
        toast('当前不能发送群消息');
        return false;
    }

    function closeGroupMedia() {
        if (!groupMediaSession) return;
        groupMediaSession = null;
        window.wcCloseVoiceMsgModal?.();
        window.wcCloseSimImage?.();
        const input = el('wcGroupImageInput');
        if (input) input.value = '';
    }

    function beginGroupMedia() {
        const group = active();
        if (account !== currentAccount() || !canSendGroupMedia(group)) return null;
        closeGroupMedia();
        closeMorePanel();
        closeEmojiPanel();
        return groupMediaSession = { group, token: epoch, owner: account, replyTo: replyId || null };
    }

    function isCurrentGroupMedia(session) {
        return Boolean(session && groupMediaSession === session && session.token === epoch &&
            session.owner === account && session.owner === currentAccount() && active() === session.group);
    }

    async function sendGroupMedia(session, items) {
        if (!items.length || !isCurrentGroupMedia(session) || !canSendGroupMedia(session.group)) return;
        const { group, token } = session;
        if (requests.has(group.id)) pause();
        const sent = items.map((item, index) => publicMessage(group, USER_ID, item.text, {
            ...item, mentions: [], replyTo: index === 0 ? session.replyTo : null
        }));
        groupMediaSession = null;
        if ((replyId || null) === session.replyTo) replyId = '';
        render();
        await save(group);
        if (token === epoch && session.owner === currentAccount() && active() === group) {
            wcRenderChatList();
            void maybeSummarizeGroup(group);
            void maybeTriggerGroupPrivateMessage(group, sent[sent.length - 1]);
            scheduleGroupGameBot();
        }
    }

    function openGroupVoiceComposer() {
        const session = beginGroupMedia();
        if (!session) return;
        if (typeof window.wcOpenVoiceMessageForGroup !== 'function') return toast('语音编辑器暂不可用');
        window.wcOpenVoiceMessageForGroup(text => sendGroupMedia(session, [{ text, isVoice: true }]));
    }

    function openGroupImageComposer() {
        const session = beginGroupMedia();
        if (!session) return;
        if (typeof window.wcOpenSimImageForGroup !== 'function') return toast('图片编辑器暂不可用');
        window.wcOpenSimImageForGroup(async ({ description, file }) => {
            if (!isCurrentGroupMedia(session) || !canSendGroupMedia(session.group)) return;
            const url = file ? await window.wcReadChatImage(file)
                : typeof window.wcGetPlaceholderImageUrl === 'function' ? window.wcGetPlaceholderImageUrl()
                : 'https://nos.netease.com/ysf/f8351d4c8de1d1407e5044b639f6bddf.png';
            if (!isCurrentGroupMedia(session)) return;
            if (!safeStickerUrl(url)) return toast('图片资源暂不可用');
            await sendGroupMedia(session, [{ text: description || '[图片]', imageUrl: url, isSimulatedImage: !file }]);
        });
    }

    function pickGroupImages() {
        if (beginGroupMedia()) el('wcGroupImageInput')?.click();
    }

    async function uploadGroupImages(event) {
        const session = groupMediaSession;
        const input = event.currentTarget || event.target;
        const files = Array.from(input.files || []);
        input.value = '';
        if (!files.length || !isCurrentGroupMedia(session) || !canSendGroupMedia(session.group)) return;
        const results = await Promise.allSettled(files.map(file => window.wcReadChatImage(file)));
        if (!isCurrentGroupMedia(session)) return;
        const valid = results.filter(item => item.status === 'fulfilled' && safeStickerUrl(item.value))
            .map(item => ({ text: '[图片]', imageUrl: item.value, isSimulatedImage: false }));
        if (valid.length) await sendGroupMedia(session, valid);
        if (valid.length !== files.length) toast(valid.length ? '部分图片读取失败' : '图片读取失败');
    }

    function applyGroupQqTheme(group) {
        const page = el('page-group-chat');
        if (!page) return;
        const enabled = group?.appearance?.qqEnabled === true && Boolean(window.WcQqChatTheme);
        page.classList.toggle('wc-group-qq', enabled);
        let style = el('wc-group-qq-style');
        const footer = page.querySelector('.wc-group-footer');
        let toolbar = footer?.querySelector('.wc-qq-toolbar');
        if (!enabled) {
            if (style) style.textContent = '';
            toolbar?.remove();
            return;
        }
        if (!style) {
            style = document.createElement('style');
            style.id = 'wc-group-qq-style';
            document.head.append(style);
        }
        if (!style.textContent) {
            const scope = '#wechatAppUI #page-group-chat.wc-group-qq';
            style.textContent = window.WcQqChatTheme.styles(true) + `
                /* Preserve group identity, wallpaper, safe areas and keyboard behavior. */
                /* Match the private QQ footer's fixed height and safe-area padding. */
                ${scope} {
                    --wcg-qq-footer-height: 104px;
                }
                /* Spectator rooms have no composer, so keep their compact footer. */
                ${scope}:has(#wcGroupCompose[hidden]) {
                    --wcg-qq-footer-height: calc(64px + env(safe-area-inset-bottom, 0px));
                }
                ${scope} .chat-header-container {
                    height: calc(var(--wechat-top-inset, 45px) + 48px) !important;
                    min-height: 0 !important; padding-top: var(--wechat-top-inset, 45px) !important;
                }
                ${scope} #wcGroupRoomAvatar { display: none !important; }
                ${scope} .room-info-capsule, ${scope} .room-info-text { min-width: 0; overflow: hidden; }
                ${scope} .room-info-text { flex: 1 1 auto; max-width: 100%; min-width: 0; }
                ${scope} #wcGroupRoomName {
                    display: block !important; max-width: 100%; min-width: 0;
                    overflow: hidden; text-overflow: ellipsis; white-space: nowrap;
                }
                ${scope} #wcGroupRoomName::after, ${scope} #wcGroupRoomStatus::before,
                ${scope} #wcGroupRoomStatus::after { content: none !important; }
                ${scope} #wcGroupAnnouncement { top: calc(var(--wechat-top-inset, 45px) + 52px); }
                ${scope} .wc-group-footer {
                    position: absolute !important;
                    left: 0 !important; right: 0 !important; width: 100% !important;
                    bottom: max(0px, calc(var(--keyboard-inset-bottom, 0px) + var(--wechat-keyboard-user-offset, 0px))) !important;
                    height: var(--wcg-qq-footer-height) !important;
                    min-height: var(--wcg-qq-footer-height) !important;
                    max-height: var(--wcg-qq-footer-height) !important;
                    padding: 8px 14px calc(8px + env(safe-area-inset-bottom, 10px)) 14px !important;
                    background: #ffffff !important; border: none !important;
                    border-radius: 0 !important; box-shadow: none !important;
                    backdrop-filter: none !important; -webkit-backdrop-filter: none !important;
                    flex-direction: column !important;
                    align-items: stretch !important;
                    justify-content: flex-start !important;
                    gap: 0 !important;
                }
                /* The group composer uses display:contents; reset its old capsule input rules. */
                ${scope} #wcGroupCompose:not([hidden]) { display: contents !important; }
                ${scope} #wcGroupCompose #wcGroupInput {
                    display: block !important; order: 0 !important;
                    flex: none !important;
                    box-sizing: border-box !important;
                    width: 100% !important; min-width: 0 !important;
                    height: 38px !important; min-height: 38px !important; max-height: 38px !important;
                    margin: 0 !important; padding: 0 14px !important;
                    border: 0 !important; border-radius: 14px !important;
                    background: #f0f0f2 !important; color: #1a1a1a !important;
                    font: inherit !important; font-size: 15px !important;
                    font-weight: 400 !important; line-height: normal !important;
                    text-align: left !important; box-shadow: none !important;
                    outline: none !important;
                }
                /* Private QQ keeps its empty-input placeholder hidden. */
                ${scope} #wcGroupCompose #wcGroupInput::placeholder { color: transparent !important; }
                ${scope} #wcGroupEmojiToggle, ${scope} #wcGroupMoreToggle { display: none !important; }
                ${scope} .wc-qq-toolbar {
                    order: 1 !important; flex: 0 0 52px !important;
                    box-sizing: border-box !important; width: 100% !important;
                    height: 52px !important;
                    margin-top: -6px !important; transform: translateY(-1px) !important;
                    padding: 0 !important;
                }
                ${scope}:has(#wcGroupCompose[hidden]) .wc-qq-toolbar {
                    flex: 1 1 auto; height: 48px !important;
                    margin-top: 0 !important; transform: none !important;
                }
                /* Same six SVG sources as private QQ, fitted to phone widths. */
                ${scope} .wc-qq-toolbar .wc-qq-tool-btn {
                    flex: 1 1 0 !important; min-width: 0 !important;
                    display: flex !important; justify-content: center !important; align-items: center !important;
                }
                ${scope} .wc-qq-toolbar .wc-qq-tool-btn svg {
                    display: block !important; width: 100% !important;
                    height: 52px !important;
                }
                ${scope} .wc-qq-toolbar .wc-qq-tool-btn[hidden],
                ${scope} #wcGroupQqImageInput[hidden] { display: none !important; }
                ${scope} .wc-qq-tool-btn:focus-visible {
                    outline: 2px solid #8c8c94; outline-offset: -5px; border-radius: 12px;
                }
                ${scope} #wcGroupCompose[hidden] { display: none !important; }
                ${scope} #wcGroupMessages {
                    background-color: transparent !important;
                    padding-top: calc(var(--wechat-top-inset, 45px) + 54px) !important;
                    padding-bottom: calc(var(--wcg-qq-footer-height) + 22px + max(0px, var(--keyboard-inset-bottom, 0px)) + var(--wechat-keyboard-content-extra-offset, 0px)) !important;
                }
                /* A pinned announcement occupies the space below the header. */
                ${scope}:has(#wcGroupAnnouncement:not([hidden])) #wcGroupMessages {
                    padding-top: calc(var(--wechat-top-inset, 45px) + 96px) !important;
                }
                ${scope}.wc-group-tools-open #wcGroupMessages,
                ${scope}.wc-group-emoji-open #wcGroupMessages {
                    padding-bottom: calc(var(--wcg-qq-footer-height) + 312px + max(0px, var(--keyboard-inset-bottom, 0px))) !important;
                }
                ${scope}.group-selecting .wc-group-footer { display: none !important; }
                ${scope}.group-selecting #wcGroupMessages { padding-bottom: calc(105px + env(safe-area-inset-bottom, 0px)) !important; }
            `;
        }
        if (footer && !toolbar) {
            toolbar = document.createElement('div');
            toolbar.className = 'wc-qq-toolbar';
            toolbar.setAttribute('role', 'toolbar');
            toolbar.setAttribute('aria-label', '群聊工具栏');
            toolbar.innerHTML = window.WcQqChatTheme.toolbarMarkup();
            // Reuse the original SVGs, but route every action through the group lifecycle.
            const actions = {
                '语音': { label: '语音', run: openGroupVoiceComposer, participateOnly: true },
                '文本描述图片': { label: '描述图片', run: openGroupImageComposer, participateOnly: true },
                '真实图片': { label: '真实图片', run: pickGroupImages, participateOnly: true },
                '发送 / 调取API生成回复': { label: '发送 / 生成群回复', run: () => {
                    if (active()?.mode === 'observe') return requests.has(activeId) ? pause() : generate();
                    return submitComposer();
                } },
                '表情包': { label: '表情包', run: toggleEmojiPanel, participateOnly: true },
                '更多功能': { label: '更多功能', run: toggleMorePanel }
            };
            toolbar.querySelectorAll('.wc-qq-tool-btn').forEach(button => {
                const privateLabel = button.title;
                button.removeAttribute('onclick');
                button.setAttribute('role', 'button');
                const action = actions[privateLabel];
                if (!action) { button.remove(); return; }
                button.title = action.label;
                button.setAttribute('aria-label', action.label);
                button.setAttribute('aria-disabled', 'false');
                button.tabIndex = 0;
                button.dataset.participateOnly = action.participateOnly ? '1' : '';
                button.onclick = event => {
                    event.stopPropagation();
                    if (button.getAttribute('aria-disabled') === 'true') return;
                    // Image selection must run synchronously from a real tap.
                    try {
                        const result = action.run();
                        if (result && typeof result.catch === 'function') result.catch(report);
                    } catch (error) { report(error); }
                };
                button.onkeydown = event => {
                    if (event.key === 'Enter' || event.key === ' ') { event.preventDefault(); button.click(); }
                };
            });
            footer.append(toolbar);
        }
        toolbar?.querySelectorAll('[data-participate-only="1"]').forEach(button => {
            const disabled = group.mode === 'observe';
            button.setAttribute('aria-disabled', String(disabled));
            button.tabIndex = disabled ? -1 : 0;
        });
    }

    function wcgReadableActivityText(color, surface) {
        const rgb = hex => [1, 3, 5].map(offset => parseInt(hex.slice(offset, offset + 2), 16));
        const luminance = hex => {
            const channels = rgb(hex).map(value => {
                const channel = value / 255;
                return channel <= .04045 ? channel / 12.92 : Math.pow((channel + .055) / 1.055, 2.4);
            });
            return .2126 * channels[0] + .7152 * channels[1] + .0722 * channels[2];
        };
        const contrast = (left, right) => {
            const a = luminance(left), b = luminance(right);
            return (Math.max(a, b) + .05) / (Math.min(a, b) + .05);
        };
        const preferred = appearanceColor(color, '#292b2e');
        if (contrast(preferred, surface) >= 4.5) return preferred;
        const target = appearanceTextColor(surface);
        const originalChannels = rgb(preferred), targetChannels = rgb(target);
        for (let strength = 1; strength <= 10; strength++) {
            const adjusted = '#' + originalChannels.map((value, index) =>
                Math.round(value + (targetChannels[index] - value) * strength / 10)
                    .toString(16).padStart(2, '0')).join('');
            if (contrast(adjusted, surface) >= 4.5) return adjusted;
        }
        return target;
    }


    // Port of the working V8 custom JS: examine rendered bubbles and actual sender IDs.
    // Do not depend on the separate message metadata grouping rules.
    function wcgUsesSenderGroups(theme) {
        return theme === 'merged' || theme === 'imessage';
    }

    function wcgMergedBubbleSenderId(row) {
        if (!row?.classList?.contains('message-row') ||
            !(row.classList.contains('sent') || row.classList.contains('received'))) return '';
        const bubble = row.querySelector(':scope > .wc-msg-body > .message-bubble');
        const senderId = String(row.dataset.senderId || row.dataset.charId ||
            bubble?.dataset.senderId || '').trim();
        if (!senderId || senderId === 'system') return '';
        if (!bubble || bubble.matches('.wc-group-activity-bubble, .wc-group-sticker-bubble')) return '';
        if (bubble.querySelector('img, video, audio, .wc-group-message-image, .wc-bubble-reply, .wc-group-translation-card, .wc-chat-file-card')) return '';
        if (!bubble.querySelector('.msg-text:not([hidden])')) return '';
        return senderId;
    }

    function wcgSyncMergedBubbleGroups(area, enabled) {
        if (!area) return;
        const nodes = Array.from(area.children);
        const senders = enabled ? nodes.map(wcgMergedBubbleSenderId) : [];
        nodes.forEach((row, index) => {
            if (!row.classList?.contains('message-row')) return;
            const senderId = senders[index] || '';
            const previous = Boolean(senderId && senderId === senders[index - 1]);
            const next = Boolean(senderId && senderId === senders[index + 1]);
            const group = !senderId ? '' : previous ? (next ? 'middle' : 'last') : (next ? 'first' : 'single');
            if (group) {
                if (row.dataset.wcgMergedGroup !== group) row.dataset.wcgMergedGroup = group;
            } else if (row.hasAttribute('data-wcg-merged-group')) {
                row.removeAttribute('data-wcg-merged-group');
            }
        });
    }

    // Keep the same child-list observer the working custom JS used. It catches
    // message replacements made outside the normal render path, without mutating chat data.
    let wcgMergedBubbleObserver = null;
    let wcgMergedBubbleArea = null;
    function wcgObserveMergedBubbleGroups(area, enabled) {
        if (wcgMergedBubbleObserver && (!enabled || wcgMergedBubbleArea !== area)) {
            wcgMergedBubbleObserver.disconnect();
            wcgMergedBubbleObserver = null;
            wcgMergedBubbleArea = null;
        }
        if (!area) return;
        if (enabled && !wcgMergedBubbleObserver && typeof MutationObserver === 'function') {
            wcgMergedBubbleArea = area;
            wcgMergedBubbleObserver = new MutationObserver(() => {
                wcgSyncMergedBubbleGroups(area, wcgUsesSenderGroups(active()?.appearance?.bubbleTheme));
            });
            wcgMergedBubbleObserver.observe(area, { childList: true });
        }
        wcgSyncMergedBubbleGroups(area, enabled);
    }

    // Built-in merged CSS reads the native sender-ID grouping from actual DOM rows.
    function wcgMergedBubbleThemeCss(scope, includeMergedAppearance = true) {
        const base = scope + ' #wcGroupMessages#wcGroupMessages#wcGroupMessages';
        const row = base + ' > .message-row[data-wcg-merged-group]';
        const bubble = ' > .wc-msg-body > .message-bubble:not(.wc-group-activity-bubble):not(.wc-group-sticker-bubble)';
        return `
            ${base} { justify-content: flex-start !important; gap: 0 !important; }
            ${base} > * { flex-shrink: 0 !important; }
            ${row} {
                flex: 0 0 auto !important; height: auto !important; min-height: 0 !important;
                max-height: none !important; margin: 0 0 18px !important;
                padding-top: 0 !important; padding-bottom: 0 !important;
                align-items: flex-start !important; overflow: visible !important;
            }
            ${row}[data-wcg-merged-group="first"],
            ${row}[data-wcg-merged-group="middle"] { margin-bottom: 4px !important; }
            ${row} > .wc-msg-body {
                display: flex !important; flex-direction: column !important;
                height: auto !important; min-height: 0 !important; max-height: none !important;
                gap: 0 !important; max-width: calc(100% - 56px) !important;
                align-items: flex-start !important;
            }
            ${row}.sent > .wc-msg-body { align-items: flex-end !important; }
            ${row}${bubble} {
                box-sizing: border-box !important; position: relative !important;
                display: flex !important; flex-direction: column !important;
                height: auto !important; min-height: 0 !important; max-height: none !important;
                flex-shrink: 0 !important; margin: 0 !important; padding: 6px 13px !important;
                border-radius: 16px !important; box-shadow: none !important;
            }
            ${row} > .msg-avatar {
                display: block !important; visibility: visible !important; opacity: 1 !important;
                width: 40px !important; min-width: 40px !important;
                height: 40px !important; min-height: 40px !important;
                flex: 0 0 40px !important; margin: 11px 8px 0 !important;
            }
            ${includeMergedAppearance ? `
            ${row}:is([data-wcg-merged-group="middle"], [data-wcg-merged-group="last"]) > .msg-avatar {
                display: block !important; visibility: hidden !important; opacity: 0 !important;
                width: 40px !important; min-width: 40px !important;
                height: 0 !important; min-height: 0 !important; max-height: 0 !important;
                flex: 0 0 40px !important; margin: 0 8px !important;
                padding: 0 !important; pointer-events: none !important;
            }
            ${row}:is([data-wcg-merged-group="middle"], [data-wcg-merged-group="last"]) > .msg-avatar::after { display: none !important; }
            ${row}:is([data-wcg-merged-group="middle"], [data-wcg-merged-group="last"]) .wc-group-speaker {
                display: none !important; min-height: 0 !important; margin: 0 !important;
            }
            ${row} .wc-group-message-time { display: none !important; }
            ${row}.sent[data-wcg-merged-group="first"]${bubble} { border-radius: 16px 16px 4px 16px !important; }
            ${row}.sent[data-wcg-merged-group="middle"]${bubble} { border-radius: 16px 4px 4px 16px !important; }
            ${row}.sent[data-wcg-merged-group="last"]${bubble} { border-radius: 16px 4px 16px 16px !important; }
            ${row}.received[data-wcg-merged-group="first"]${bubble} { border-radius: 16px 16px 16px 4px !important; }
            ${row}.received[data-wcg-merged-group="middle"]${bubble} { border-radius: 4px 16px 16px 4px !important; }
            ${row}.received[data-wcg-merged-group="last"]${bubble} { border-radius: 4px 16px 16px 16px !important; }
            ` : ''}
        `;
    }

    // Reuse native merged geometry and sender IDs, changing only the iMessage visuals.
    function wcgImessageBubbleThemeCss(scope, showTimestamps) {
        const area = scope + ' #wcGroupMessages#wcGroupMessages#wcGroupMessages';
        const row = area + ' > .message-row[data-wcg-merged-group]';
        const bubble = ' > .wc-msg-body > .message-bubble:not(.wc-group-activity-bubble):not(.wc-group-sticker-bubble)';
        return `
            ${row} { align-items: flex-end !important; margin-bottom: 24px !important; }
            ${row}:is([data-wcg-merged-group="first"], [data-wcg-merged-group="middle"]) { margin-bottom: 4px !important; }
            ${row} > .wc-msg-body { flex-shrink: 0 !important; }
            ${row}:is([data-wcg-merged-group="middle"], [data-wcg-merged-group="last"]) .wc-group-speaker {
                display: none !important; height: 0 !important; min-height: 0 !important; margin: 0 !important;
            }
            ${row}:is([data-wcg-merged-group="first"], [data-wcg-merged-group="middle"]) .wc-group-message-time {
                display: none !important;
            }
            ${row}${bubble} {
                flex: 0 0 auto !important; width: fit-content !important;
                padding: 6px 16px !important; border-radius: 22px !important;
                min-height: 32px !important; max-width: 100% !important;
                overflow: visible !important; z-index: 1 !important;
            }
            ${row} > .msg-avatar { align-self: flex-end !important; margin: 0 8px !important; }
            ${row}:is([data-wcg-merged-group="first"], [data-wcg-merged-group="middle"]) > .msg-avatar {
                visibility: hidden !important; opacity: 0 !important;
                height: 0 !important; min-height: 0 !important; max-height: 0 !important;
                flex: 0 0 40px !important; margin: 0 8px !important; pointer-events: none !important;
            }
            ${row}:is([data-wcg-merged-group="last"], [data-wcg-merged-group="single"]) > .msg-avatar {
                display: block !important; visibility: visible !important; opacity: 1 !important;
                width: 40px !important; min-width: 40px !important;
                height: 40px !important; min-height: 40px !important; max-height: none !important;
                flex: 0 0 40px !important; margin: 0 8px !important; pointer-events: auto !important;
            }
            ${row}${bubble}::before { display: none !important; content: none !important; }
            ${row}:is([data-wcg-merged-group="last"], [data-wcg-merged-group="single"])${bubble}::before {
                content: '' !important; display: block !important; position: absolute !important;
                bottom: -5px !important; width: 18px !important; height: 16px !important;
                background-color: inherit !important; background-image: none !important;
                z-index: -1 !important; border: none !important; box-shadow: none !important;
                transform: none !important; clip-path: none !important; pointer-events: none !important;
                -webkit-mask-size: contain !important; -webkit-mask-repeat: no-repeat !important;
                mask-size: contain !important; mask-repeat: no-repeat !important;
            }
            ${row}.received:is([data-wcg-merged-group="last"], [data-wcg-merged-group="single"])${bubble}::before {
                left: 1px !important; right: auto !important;
                -webkit-mask-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 18 16' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M 18 0 Q 18 12 2.4 15.2 A 0.8 0.8 0 0 1 1.12 14.24 Q 7 10 4 0 Z'/%3E%3C/svg%3E") !important; mask-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 18 16' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M 18 0 Q 18 12 2.4 15.2 A 0.8 0.8 0 0 1 1.12 14.24 Q 7 10 4 0 Z'/%3E%3C/svg%3E") !important;
            }
            ${row}.sent:is([data-wcg-merged-group="last"], [data-wcg-merged-group="single"])${bubble}::before {
                right: 1px !important; left: auto !important;
                -webkit-mask-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 18 16' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M 0 0 Q 0 12 15.6 15.2 A 0.8 0.8 0 0 0 16.88 14.24 Q 11 10 14 0 Z'/%3E%3C/svg%3E") !important; mask-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 18 16' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M 0 0 Q 0 12 15.6 15.2 A 0.8 0.8 0 0 0 16.88 14.24 Q 11 10 14 0 Z'/%3E%3C/svg%3E") !important;
            }
            ${showTimestamps ? `${row}:is([data-wcg-merged-group="last"], [data-wcg-merged-group="single"]) .wc-group-message-time { display: flex !important; }` : ''}
        `;
    }

    let wcgActiveThemeScript = '';

    function wcgApplyThemeStyles(group) {
    const appearance = group?.appearance || {};
    const page = el('page-group-chat');
    if (!page) return;
    const defaultScheme = wcgChatThemeSchemes[0];
    const legacyColors = appearance.colorScheme === 'legacy' ||
        (!appearance.colorScheme && (appearance.sentColor || appearance.receivedColor));
    const scheme = legacyColors
        ? {
            ...defaultScheme,
            leftBg: appearanceColor(appearance.receivedColor, defaultScheme.leftBg),
            rightBg: appearanceColor(appearance.sentColor, defaultScheme.rightBg),
            leftText: appearanceTextColor(appearanceColor(appearance.receivedColor, defaultScheme.leftBg)),
            rightText: appearanceTextColor(appearanceColor(appearance.sentColor, defaultScheme.rightBg))
        } : (wcgChatThemeSchemes.find(item => item.id === appearance.colorScheme) || defaultScheme);
    const scope = '#wechatAppUI #page-group-chat';
    const fonts = appearance.fontSettings || {};
    const fontSize = Math.max(12, Math.min(24, Number(fonts.size) || 16));
    const sentText = appearanceColor(fonts.colorSent, scheme.rightText);
    const receivedText = appearanceColor(fonts.colorReceived, scheme.leftText);
    const fontFamily = typeof fonts.family === 'string' && fonts.family !== 'default'
        && /^[a-zA-Z0-9_-]{1,70}$/.test(fonts.family) ? JSON.stringify(fonts.family) + ', sans-serif' : 'inherit';
    const bubbleCorners = ['18px', '18px'];
    let style = el('wc-group-dynamic-theme-style');
    if (!style) {
        style = document.createElement('style');
        style.id = 'wc-group-dynamic-theme-style';
        document.head.append(style);
    }
    // Keep group customizations isolated from the private chat and other apps.
    const officialMerged = appearance.bubbleTheme === 'merged';
    const officialImessage = appearance.bubbleTheme === 'imessage';
    const officialGrouped = officialMerged || officialImessage;
    let css = `
        ${scope} .message-row.received {
            --wcg-activity-ink-light: ${wcgReadableActivityText(receivedText, '#f8f8f9')};
            --wcg-activity-ink-dark: ${wcgReadableActivityText(receivedText, '#24262b')};
            --wcg-activity-accent: ${scheme.rightBg};
            --wcg-activity-font: ${fontFamily};
        }
        ${scope} .message-row.sent {
            --wcg-activity-ink-light: ${wcgReadableActivityText(sentText, '#f8f8f9')};
            --wcg-activity-ink-dark: ${wcgReadableActivityText(sentText, '#24262b')};
            --wcg-activity-accent: ${scheme.rightBg};
            --wcg-activity-font: ${fontFamily};
        }
        ${scope} .message-row.received .message-bubble:not(.wc-group-activity-bubble):not(.wc-group-sticker-bubble) {
            background-color: ${scheme.leftBg} !important; color: ${receivedText} !important;
            border-radius: ${bubbleCorners[0]} !important;
        }
        ${scope} .message-row.sent .message-bubble:not(.wc-group-activity-bubble):not(.wc-group-sticker-bubble) {
            background-color: ${scheme.rightBg} !important; color: ${sentText} !important;
            border-radius: ${bubbleCorners[1]} !important;
        }
        ${scope} #wcGroupMessages .message-row .msg-avatar {
            display: block !important; visibility: visible !important; width: 40px !important;
            min-width: 40px !important; height: 40px !important;
            flex: 0 0 40px !important; border-radius: 50% !important;
        }
        ${scope} .message-bubble .msg-text { font-size: ${fontSize}px !important; font-family: ${fontFamily} !important; }
        ${scope} .message-row.received .message-bubble .msg-text { color: ${receivedText} !important; }
        ${scope} .message-row.sent .message-bubble .msg-text { color: ${sentText} !important; }
    `;
    if (appearance.timestampEnabled === false) css += `${scope} .wc-group-message-time { display:none !important; }`;
    if (officialGrouped) {
        css += wcgMergedBubbleThemeCss(scope, !officialImessage);
        if (officialImessage) css += wcgImessageBubbleThemeCss(scope, appearance.timestampEnabled !== false);
        // An older V8 custom script can have left behind an independent style/observer.
        if (typeof window.__wcV8IdentityMerge?.disconnect === 'function') window.__wcV8IdentityMerge.disconnect();
        document.getElementById('wc-v8-sender-merged-style')?.remove();
    }
    // Preserve user code in settings, but prevent legacy V8 CSS/JS from conflicting with the official theme.
    const userCss = String(appearance.customCss || '').replace(/#page-chat-room\b/g, '#page-group-chat').trim();
    if (userCss) css += `\n@scope (${scope}) {\n${userCss}\n}\n`;
    style.textContent = css;
    if (fonts.fontUrl && fonts.family && fonts.family !== 'default' && !document.fonts.check('12px ' + fonts.family)) {
        const validFont = safeImage(fonts.fontUrl);
        if (validFont) new FontFace(fonts.family, `url(${JSON.stringify(validFont)})`).load()
            .then(face => document.fonts.add(face)).catch(error => console.warn('Group font load failed:', error));
    }
    const savedJs = String(appearance.customJs || '');
    // Only quarantine the obsolete V8 merger when an official grouping theme is active.
    // Ordinary appearance scripts, including per-character markers, must still run.
    const legacyMerger = officialGrouped && /__wcV8IdentityMerge|wc-v8-sender-merged-style/.test(savedJs);
    const js = legacyMerger ? '' : savedJs;
    const signature = String(group?.id || '') + '|' + appearance.bubbleTheme + '|' + js;
    if (signature !== wcgActiveThemeScript) {
        wcgActiveThemeScript = signature;
        // Dispose the optional role-marker tutorial observer before replacing user JS.
        window.__wcgRoleMarker?.disconnect?.();
        delete window.__wcgRoleMarker;
        el('wc-group-theme-script')?.remove();
        if (js.trim()) {
            const script = document.createElement('script');
            script.id = 'wc-group-theme-script';
            script.textContent = '(function(){ try {\n' + js + '\n} catch(error) { console.error("Group custom JS failed:", error); } })();';
            document.body.append(script);
        }
    }
}

    function applyAppearance(group) {
    const page = el('page-group-chat');
    if (!page) return;
    const appearance = group?.appearance || {};
    applyGroupQqTheme(group);
    const sent = appearanceColor(appearance.sentColor, '#000000');
    const received = appearanceColor(appearance.receivedColor, '#f2f2f7');
    page.style.setProperty('--wcg-sent-bg', sent);
    page.style.setProperty('--wcg-recv-bg', received);
    page.style.setProperty('--wcg-sent-fg', appearanceTextColor(sent));
    page.style.setProperty('--wcg-recv-fg', appearanceTextColor(received));
    const wallpaper = String(appearance.wallpaper || '');
    const trustedWallpaper = wallpaper.startsWith('data:image/') || Boolean(safeImage(wallpaper));
    page.style.backgroundImage = trustedWallpaper ? `url(${JSON.stringify(wallpaper)})` : '';
    page.style.backgroundSize = 'cover';
    page.style.backgroundPosition = 'center';
    wcgApplyThemeStyles(group);
    wcgObserveMergedBubbleGroups(el('wcGroupMessages'), wcgUsesSenderGroups(appearance.bubbleTheme));
}

    const wcgChatThemeSchemes = [{"id":"default","name":"默认 (黑白)","leftBg":"#F2F2F7","leftText":"#000000","rightBg":"#000000","rightText":"#ffffff"},{"id":"wechat-green","name":"深灰微信绿","leftBg":"#333333","leftText":"#ffffff","rightBg":"#95ec69","rightText":"#000000"},{"id":"imessage-blue","name":"iMessage蓝","leftBg":"#E5E5EA","leftText":"#000000","rightBg":"#007AFF","rightText":"#ffffff"},{"id":"gray-black","name":"灰黑","leftBg":"#E5E5EA","leftText":"#000000","rightBg":"#333333","rightText":"#ffffff"},{"id":"white-pink","name":"白粉","leftBg":"#FFFFFF","leftText":"#000000","rightBg":"#F8E8EE","rightText":"#000000"},{"id":"white-blue","name":"低饱白蓝","leftBg":"#FFFFFF","leftText":"#000000","rightBg":"#E6F0FA","rightText":"#000000"},{"id":"white-green","name":"白绿","leftBg":"#FFFFFF","leftText":"#000000","rightBg":"#E9F7E6","rightText":"#000000"},{"id":"blue-pink","name":"蓝粉","leftBg":"#E6F0FA","leftText":"#000000","rightBg":"#F8E8EE","rightText":"#000000"},{"id":"lightgray-green","name":"浅灰微信绿","leftBg":"#F2F2F7","leftText":"#000000","rightBg":"#95ec69","rightText":"#000000"},{"id":"gray-pink","name":"灰粉","leftBg":"#F2F2F7","leftText":"#000000","rightBg":"#F8E8EE","rightText":"#000000"},{"id":"gray-blue","name":"灰蓝","leftBg":"#F2F2F7","leftText":"#000000","rightBg":"#E6F0FA","rightText":"#000000"},{"id":"mint-choco","name":"薄巧","leftBg":"#D5F5E3","leftText":"#000000","rightBg":"#4E342E","rightText":"#ffffff"}];

    // Build copyable character selectors from this group's actual IDs, not display names.
    function wcgGroupMemberBubbleCss(group) {
        const scope = '#wechatAppUI #page-group-chat #wcGroupMessages#wcGroupMessages#wcGroupMessages > .message-row';
        const bubble = ' > .wc-msg-body > .message-bubble:not(.wc-group-activity-bubble):not(.wc-group-sticker-bubble)';
        const colors = ['#e5e5ea', '#d1d1d6', '#f2f2f7', '#d8d8de', '#c7c7cc'];
        const members = (group?.members || []).filter(member => member.id && member.id !== USER_ID && member.id !== 'system');
        const cssRule = (id, color, direction) => {
            const selector = scope + '.' + direction + '[data-sender-id=' + JSON.stringify(String(id)) + ']';
            return selector + bubble + ' {\n  background-color: ' + color + ' !important;\n  color: #1c1c1e !important;\n}\n' +
                selector + ' .msg-text { color: #1c1c1e !important; }';
        };
        const userSelector = scope + '.sent[data-sender-id="user"]';
        const userCss = userSelector + bubble + ' {\n  background-color: #1c1c1e !important;\n  color: #fff !important;\n}\n' +
            userSelector + ' .msg-text { color: #fff !important; }';
        const characterCss = members.map((member, index) => {
            const label = memberName(member).replace(/[\r\n]/g, ' ').replace(/\*\//g, '* /');
            return '/* ' + label + ' | ID: ' + String(member.id).replace(/[\r\n]/g, ' ') + ' */\n' +
                cssRule(member.id, colors[index % colors.length], 'received');
        });
        return '/* Current group only. Every selector uses the stable member ID.\n' +
            '   Compatible with default / merged / iMessage ordinary text bubbles. */\n\n' +
            '/* User */\n' + userCss + '\n\n' +
            (characterCss.join('\n\n') || '/* No character members in this group yet. */');
    }

    // Source excerpts from the native group chat template, not private-chat styles.
    const wcgGroupNativeCssPages = [
    {
        "title": "群聊基础原生 CSS",
        "kind": "source",
        "blocks": [
            {
                "label": "群聊基础样式",
                "text": "/* 群聊主容器 */\n#wechatAppUI #page-group-chat { background: var(--bg-color, #fff); animation: none; }\n            #wechatAppUI #page-group-chat [hidden], #wechatAppUI #wcGroupPanel[hidden] { display: none !important; }\n\n/* 群头像与成员头像 */\n#wechatAppUI .wc-group-avatar { position: relative; display: block; width: 48px; height: 48px; min-width: 48px; flex: 0 0 48px; box-sizing: border-box; border-radius: 15px; background-size: cover; background-position: center; overflow: visible; }\n            #wechatAppUI .wc-group-avatar-grid { display: grid; width: 100%; height: 100%; box-sizing: border-box; padding: 3px; gap: 2px; grid-template-columns: repeat(2, minmax(0, 1fr)); grid-template-rows: repeat(2, minmax(0, 1fr)); background: #f2f2f7; border-radius: inherit; overflow: hidden; }\n            #wechatAppUI .wc-group-avatar-grid[data-count=\"1\"] { grid-template-columns: minmax(0, 1fr); grid-template-rows: minmax(0, 1fr); }\n            #wechatAppUI .wc-group-avatar-grid[data-count=\"2\"] { grid-template-rows: minmax(0, 1fr); }\n            #wechatAppUI .wc-group-avatar-grid[data-count=\"3\"] > .wc-group-avatar-cell:first-child { grid-row: span 2; }\n            #wechatAppUI .wc-group-avatar-cell { display: block; box-sizing: border-box; width: 100%; height: 100%; min-width: 0; min-height: 0; border-radius: 4px; background-color: #e5e5ea; background-position: center; background-size: cover; background-repeat: no-repeat; overflow: hidden; }\n            #wechatAppUI .wc-group-avatar-cell svg { display: block; width: 100%; height: 100%; max-width: 100%; max-height: 100%; }\n            #wechatAppUI #wcGroupRoomAvatar { width: 34px; height: 34px; margin-right: 8px; flex-shrink: 0; }\n            #wechatAppUI #wcGroupRoomAvatar > .avatar { width: 34px; height: 34px; min-width: 34px; flex: 0 0 34px; border-radius: 12px; margin: 0; }\n            #wechatAppUI #wcGroupRoomName { overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }\n\n/* 消息行、气泡与时间 */\n#wechatAppUI #wcGroupMessages { padding-top: calc(var(--wechat-top-inset, 45px) + 96px); padding-bottom: calc(155px + max(0px, var(--keyboard-inset-bottom, 0px)) + var(--wechat-keyboard-content-extra-offset, 0px)); }\n            /* Keep the original private-chat avatar/bubble rhythm. The group-only name\n               and QQ title labels occupy a small line above the same 18px bubble. */\n            #wechatAppUI #wcGroupMessages .message-row { margin-bottom: 14px; align-items: flex-start; }\n            #wechatAppUI #wcGroupMessages .message-row .msg-avatar {\n                display: block; width: 40px; height: 40px; min-width: 40px; flex: 0 0 40px;\n                border-radius: 50%; margin: 18px 8px 0; background-size: cover;\n                background-position: center; overflow: visible;\n            }\n            #wechatAppUI #wcGroupMessages .wc-msg-body {\n                position: relative; gap: 0; min-width: 0; max-width: calc(100% - 56px);\n                align-items: flex-start;\n            }\n            #wechatAppUI #wcGroupMessages .message-row.sent .wc-msg-body { align-items: flex-end; }\n            #wechatAppUI #wcGroupMessages .message-bubble {\n                display: flex; position: relative; box-sizing: border-box; min-height: 36px;\n                max-width: 100%; padding: 8px 14px; border-radius: 18px;\n                margin-bottom: 18px; cursor: pointer; align-items: flex-start;\n                box-shadow: none;\n            }\n            #wechatAppUI #wcGroupMessages .msg-text {\n                font-size: 16px; line-height: 1.4; font-weight: 700;\n                white-space: pre-wrap; overflow-wrap: anywhere;\n            }\n            #wechatAppUI .wc-group-speaker, #wechatAppUI .wc-group-message-time { font-size: 11px; color: #8e8e93; }\n            #wechatAppUI #wcGroupMessages .wc-group-message-time {\n                position: absolute; bottom: -18px; margin: 0; width: auto;\n                color: #8e8e93; font-size: 11px; line-height: 14px;\n                white-space: nowrap; pointer-events: none;\n            }\n            #wechatAppUI #wcGroupMessages .message-bubble.sent .wc-group-message-time { right: 4px; }\n            #wechatAppUI #wcGroupMessages .message-bubble.received .wc-group-message-time { left: 4px; }\n\n/* 图片与群公告 */\n#wechatAppUI .wc-group-message-image { max-width: 220px; max-height: 260px; border-radius: 12px; object-fit: contain; }\n            #wechatAppUI #wcGroupAnnouncement { position: absolute; z-index: 10; top: calc(var(--wechat-top-inset, 45px) + 56px); left: 16px; right: 16px; border: 0; border-radius: 12px; padding: 8px 12px; text-align: left; overflow: hidden; white-space: nowrap; text-overflow: ellipsis; color: var(--text-sub, #666); font: inherit; font-size: 12px; }\n            /* Group composer shares the original single-chat footer capsule dimensions. */\n\n/* user / char 的实际消息行：user 固定为发送方，其他 senderId 是具体角色或 NPC 的稳定 ID。\n   两者在 DOM 中使用 .sent / .received，而不是 .user / .char 类名。 */\n#wechatAppUI #page-group-chat #wcGroupMessages .message-row.sent[data-sender-id=\"user\"] > .wc-msg-body > .message-bubble:not(.wc-group-activity-bubble):not(.wc-group-sticker-bubble) {\n    background-color: var(--wcg-sent-bg, #000) !important;\n    color: var(--wcg-sent-fg, #fff) !important;\n    border-radius: 18px;\n}\n#wechatAppUI #page-group-chat #wcGroupMessages .message-row.received[data-sender-id] > .wc-msg-body > .message-bubble:not(.wc-group-activity-bubble):not(.wc-group-sticker-bubble) {\n    background-color: var(--wcg-recv-bg, #f2f2f7) !important;\n    color: var(--wcg-recv-fg, #000) !important;\n    border-radius: 18px;\n}\n#wechatAppUI #page-group-chat #wcGroupMessages .message-row.sent[data-sender-id=\"user\"] .msg-text { color: var(--wcg-sent-fg, #fff) !important; }\n#wechatAppUI #page-group-chat #wcGroupMessages .message-row.received[data-sender-id] .msg-text { color: var(--wcg-recv-fg, #000) !important; }\n\n/* 角色逐人美化使用 .message-row.received[data-sender-id=\"真实角色ID\"]。\n   合并气泡／仿 iMessage 还会附上 data-wcg-merged-group=\"first|middle|last|single\"。\n   特殊活动、表情包和系统通知应排除在普通气泡规则之外。 */\n\n/* 发送与接收气泡颜色 */\n#wechatAppUI #page-group-chat .message-bubble.sent { background-color: var(--wcg-sent-bg, #000); color: var(--wcg-sent-fg, #fff); }\n#wechatAppUI #page-group-chat .message-bubble.sent .msg-text { color: var(--wcg-sent-fg, #fff); }\n#wechatAppUI #page-group-chat .message-bubble.received { background-color: var(--wcg-recv-bg, #f2f2f7); color: var(--wcg-recv-fg, #000); }\n#wechatAppUI #page-group-chat .message-bubble.received .msg-text { color: var(--wcg-recv-fg, #000); }\n\n/* 群聊输入区与发送框 */\n#wechatAppUI #page-group-chat .wc-group-footer {\n                position: absolute; z-index: 100; left: 16px; right: 16px; width: auto;\n                bottom: calc(26px + env(safe-area-inset-bottom, 0px) + max(0px, var(--keyboard-inset-bottom, 0px) + var(--wechat-keyboard-user-offset, 0px)));\n                height: 52px; min-height: 52px; box-sizing: border-box;\n                display: flex; align-items: center; gap: 12px;\n                padding: 0 6px 0 16px; border-radius: 26px;\n            }\n            #wechatAppUI #page-group-chat .wc-group-compose { display: contents; }\n            #wechatAppUI #page-group-chat #wcGroupInput {\n                order: 2; flex: 1 1 0; min-width: 0; width: 100%; height: 100%;\n                border: 0; border-radius: 0; outline: none; box-shadow: none;\n                background: transparent; color: var(--text-main, #000);\n                padding: 0; font: inherit; font-size: 16px; font-weight: 600;\n            }\n            #wechatAppUI #page-group-chat #wcGroupInput::placeholder { color: var(--text-sub, #8e8e93); }"
            }
        ]
    },
    {
        "title": "群聊各板块专属 CSS",
        "kind": "cards",
        "blocks": [
{
    "title": "user 与 char 普通气泡",
    "tag": "气泡",
    "note": "群聊实际上使用 sent/received 区分我方与角色，动态配色带 !important；以下代码可直接覆盖普通气泡，排除了红包、投票和表情包。",
    "text": "/* User: 只改我的普通文字气泡 */\n#wechatAppUI #page-group-chat #wcGroupMessages#wcGroupMessages#wcGroupMessages > .message-row.sent[data-sender-id=\"user\"] > .wc-msg-body > .message-bubble:not(.wc-group-activity-bubble):not(.wc-group-sticker-bubble) {\n  background-color: #1c1c1e !important;\n  color: #ffffff !important;\n  border-radius: 18px !important;\n}\n#wechatAppUI #page-group-chat #wcGroupMessages#wcGroupMessages#wcGroupMessages > .message-row.sent[data-sender-id=\"user\"] .msg-text { color: #ffffff !important; }\n\n/* Char: 只改角色的普通文字气泡 */\n#wechatAppUI #page-group-chat #wcGroupMessages#wcGroupMessages#wcGroupMessages > .message-row.received[data-sender-id] > .wc-msg-body > .message-bubble:not(.wc-group-activity-bubble):not(.wc-group-sticker-bubble) {\n  background-color: #e5e5ea !important;\n  color: #1c1c1e !important;\n  border-radius: 18px !important;\n}\n#wechatAppUI #page-group-chat #wcGroupMessages#wcGroupMessages#wcGroupMessages > .message-row.received[data-sender-id] .msg-text { color: #1c1c1e !important; }"
},
{
    "title": "通用角色独立气泡 CSS（换角色自动生效）",
    "tag": "通用角色",
    "note": "配合教程中的『通用角色标识 JS』使用。任何群成员会自动获得独立的角色标识和稳定的灰阶色值，新角色入群、同名角色、切换聊天都无需重新填写 ID；只作用于普通文字气泡。",
    "tips": [
        "先将第三页『通用角色标识 JS』粘贴到当前群自定义 JS。",
        "再复制此段 CSS 到当前群自定义 CSS，角色无须逐个设置。",
        "角色身份按 senderId 区分，颜色只是示例；即使颜色接近也不会把消息合并成同一角色。"
    ],
    "text": "/* Universal: no character IDs. Paste the role marker JS once in this group. */\n#wechatAppUI #page-group-chat #wcGroupMessages#wcGroupMessages#wcGroupMessages > .message-row.received[data-wcg-role=\"char\"] > .wc-msg-body > .message-bubble:not(.wc-group-activity-bubble):not(.wc-group-sticker-bubble) {\n  background-color: var(--wcg-role-surface, #e5e5ea) !important;\n  color: #1c1c1e !important;\n}\n#wechatAppUI #page-group-chat #wcGroupMessages#wcGroupMessages#wcGroupMessages > .message-row.received[data-wcg-role=\"char\"] .message-bubble .msg-text {\n  color: #1c1c1e !important;\n}\n\n/* My bubble remains independent from all characters. */\n#wechatAppUI #page-group-chat #wcGroupMessages#wcGroupMessages#wcGroupMessages > .message-row.sent[data-wcg-role=\"user\"] > .wc-msg-body > .message-bubble:not(.wc-group-activity-bubble):not(.wc-group-sticker-bubble) {\n  background-color: #1c1c1e !important;\n  color: #ffffff !important;\n}\n#wechatAppUI #page-group-chat #wcGroupMessages#wcGroupMessages#wcGroupMessages > .message-row.sent[data-wcg-role=\"user\"] .message-bubble .msg-text {\n  color: #ffffff !important;\n}\n\n/* Each character also has its own stable data-wcg-role-key attribute. */",
    "language": "css"
},
{
    "title": "指定角色精准修改 CSS（进阶，可选）",
    "tag": "角色识别",
    "autoFillGroupRoles": true,
    "note": "只有想单独指定某个人的颜色时才需要这份当前群的 ID 清单。普通用户应优先使用上一张通用角色 CSS；换群或添加角色无需重新制作通用版。",
    "text": "/* 打开当前群即可生成真实角色 ID 对应的 CSS */"
},
{
    "title": "消息引用与发送时间",
    "tag": "消息细节",
    "note": "回复引用来自普通气泡内部的 .wc-bubble-reply；时间标记用 .wc-group-message-time，隐藏全局时间可能影响合并气泡节奏。",
    "text": "#wechatAppUI #page-group-chat #wcGroupMessages .wc-bubble-reply {\n  border-left: 2px solid #8e8e93;\n  padding: 5px 8px;\n  margin-bottom: 7px;\n  border-radius: 4px;\n  background: rgba(142,142,147,.12);\n}\n#wechatAppUI #page-group-chat #wcGroupMessages .wc-group-message-time {\n  font-size: 10px;\n  opacity: .8;\n}"
},
{
    "title": "语音、文件与系统通知",
    "tag": "其他消息",
    "note": "语音、图片、文件并不全是普通文字气泡，按类名单独修饰；居中系统通知不属于任何角色气泡。",
    "text": "#wechatAppUI #page-group-chat #wcGroupMessages .wc-voice-message-bubble {\n  min-width: 128px;\n}\n#wechatAppUI #page-group-chat #wcGroupMessages .wc-chat-file-card {\n  border-radius: 12px;\n}\n#wechatAppUI #page-group-chat #wcGroupMessages .wc-center-timestamp {\n  font-size: 12px;\n  color: #8e8e93;\n}"
},
{
    "title": "群名、群公告与输入框",
    "tag": "页面区域",
    "note": "只改文字与外观，不重新定位输入区或安全区；这样不会影响软键盘和刘海屏适配。",
    "text": "#wechatAppUI #page-group-chat #wcGroupRoomName {\n  font-weight: 700;\n  letter-spacing: .2px;\n}\n#wechatAppUI #page-group-chat #wcGroupAnnouncement {\n  border-radius: 12px;\n  font-size: 12px;\n}\n#wechatAppUI #page-group-chat #wcGroupInput {\n  font-size: 16px;\n  font-weight: 600;\n}"
},

            {
                "title": "群成员昵称与头衔",
                "tag": "群成员",
                "note": "群聊的发送者名称、群主/管理员头衔使用专用选择器，不能拿私聊昵称样式直接替换。",
                "text": "#wechatAppUI #page-group-chat .wc-group-speaker {\n                display: flex; align-items: center; flex-wrap: wrap;\n                gap: 4px 6px; max-width: 100%; min-width: 0;\n                margin: 0 0 5px; min-height: 13px; line-height: 1.3;\n            }\n\n#wechatAppUI #page-group-chat .wc-group-speaker-name {\n                min-width: 0; max-width: 100%; color: #8e8e93; font-size: 11px;\n                font-weight: 500; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;\n            }\n\n#wechatAppUI .wc-group-title-tag {\n                display: inline-flex; align-items: center; justify-content: center;\n                max-width: 115px; padding: 2px 5px; flex: 0 1 auto;\n                box-sizing: border-box; border-radius: 4px;\n                font-size: 10px; line-height: 1.25; font-weight: 600;\n                letter-spacing: 0; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;\n                background: #f0edff; color: #8755c7;\n            }\n\n#wechatAppUI .wc-group-title-tag[data-kind=\"owner\"] { background: #fff0db; color: #ce7a22; }\n\n#wechatAppUI .wc-group-title-tag[data-kind=\"admin\"] { background: #e8f1ff; color: #4285d4; }"
            },
            {
                "title": "群聊引用回复小窗",
                "tag": "引用",
                "note": "对应群聊的浮动引用预览，保留成员头像、消息正文和时间的独立排版。",
                "text": "#wechatAppUI #wcGroupReplyFloatBubbleBox .message-row.sent { justify-content: flex-end; }\n\n#wechatAppUI #wcGroupReplyFloatBubbleBox .message-bubble {\n                display: flex; position: relative; box-sizing: border-box; min-height: 36px;\n                max-width: 100%; padding: 8px 14px; border-radius: 18px;\n                margin-bottom: 18px; align-items: flex-start; box-shadow: none;\n            }\n\n#wechatAppUI #wcGroupReplyFloatBubbleBox .msg-text {\n                font-size: 16px; line-height: 1.4; font-weight: 700;\n                white-space: pre-wrap; overflow-wrap: anywhere;\n            }\n\n#wechatAppUI #wcGroupReplyFloatBubbleBox .wc-group-message-time {\n                font-size: 11px; color: #8e8e93;\n            }"
            },
            {
                "title": "群活动卡片（投票、接龙等）",
                "tag": "群活动",
                "note": "红包、群投票、接龙等可能使用独立消息卡片；只改普通气泡通常不会改到它们。",
                "text": "#wechatAppUI #page-group-chat .wc-group-activity-bubble {\n                min-width: min(260px, 72vw); max-width: min(320px, 82vw);\n                padding: 12px 14px; border-radius: 16px;\n            }\n\n#wechatAppUI #page-group-chat .wc-group-activity-bubble .msg-text[hidden] { display: none; }\n\n#wechatAppUI #page-group-chat .wc-group-activity-card {\n                display: flex; flex-direction: column; gap: 10px; color: inherit; min-width: 0;\n            }\n\n#wechatAppUI #page-group-chat .wc-group-activity-card > strong {\n                font-size: 15px; font-weight: 650; overflow-wrap: anywhere;\n            }"
            },
            {
                "title": "群聊图片与表情包",
                "tag": "媒体",
                "note": "图片和表情包使用单独的类名与尺寸约束，别用全局 img 选择器。",
                "text": "#wechatAppUI #page-group-chat .message-bubble.wc-group-sticker-bubble {\n                background: transparent !important; border: 0; box-shadow: none;\n                padding: 2px; max-width: 192px;\n            }\n\n#wechatAppUI #page-group-chat .wc-group-sticker-bubble .msg-text { display: none; }\n\n#wechatAppUI #page-group-chat .wc-group-sticker-bubble .wc-group-message-image {\n                display: block; max-width: 180px; max-height: 180px;\n                width: auto; height: auto; object-fit: contain; border-radius: 5px;\n            }\n\n#wechatAppUI .wc-group-message-image { max-width: 220px; max-height: 260px; border-radius: 12px; object-fit: contain; }"
            },
            {
                "title": "群聊消息翻译卡片",
                "tag": "消息组件",
                "note": "翻译卡片与普通消息文字独立，修改背景时可只对翻译内容生效。",
                "text": "#wechatAppUI #page-group-chat .wc-group-translation-card {\n                margin-top: 6px; padding: 8px 10px; width: 100%; box-sizing: border-box;\n                border-radius: 10px; background: rgba(142, 142, 147, .12);\n                color: inherit; font-size: 13px; font-weight: 500; line-height: 1.5;\n                white-space: pre-wrap; overflow-wrap: anywhere;\n            }"
            }
        ]
    },
    {
        "title": "自定义 CSS & JS 新手教程",
        "kind": "tutorial",
        "blocks": [
{
    "title": "角色身份是怎样区分的？",
    "tag": "核心原理",
    "note": "和官方合并气泡、仿 iMessage 一样，直接从 DOM 的 data-sender-id / data-char-id 读取发言人的稳定 ID。JS 会自动区分 user、每一个 char 和 NPC，不用指定角色 A/B；相同昵称不会共用身份。",
    "tips": [
        "我的消息：.message-row.sent[data-wcg-role=\"user\"]",
        "任意角色消息：.message-row.received[data-wcg-role=\"char\"]",
        "每个角色独立标识：data-wcg-role-key（自动由真实 ID 计算）",
        "连续气泡段：data-wcg-role-group=\"first|middle|last|single\"。",
        "想要自动换角色生效，复制第二页『通用角色独立气泡 CSS』与本页 JS。"
    ],
    "text": "// See every sender ID currently rendered (read-only).\n[...document.querySelectorAll('#wcGroupMessages > .message-row[data-sender-id]')]\n  .map(row => ({ name: row.querySelector('.wc-group-speaker-name')?.textContent?.trim(), id: row.dataset.senderId }))\n  .filter((item, index, all) => all.findIndex(other => other.id === item.id) === index)\n  .forEach(item => console.log(item.name, item.id));",
    "language": "js"
},
{
    "title": "通用角色标识 JS（自动适配所有角色）",
    "tag": "JavaScript",
    "note": "直接参考官方合并气泡／仿 iMessage 使用的 senderId 读取、连续消息判断方式，不依赖当前角色名单。通过稳定 ID 自动产生身份标记、唯一角色 key、灰阶气泡变量和首／中／尾分组标记，新角色或同名角色自动生效。仅作展示标识，不修改原生合并和消息记录。",
    "tips": [
        "复制到当前群『自定义美化 → JS』，不要填写任何角色名或 ID。",
        "再复制第二页『通用角色独立气泡 CSS』，即可让所有角色自动使用各自的气泡变量。",
        "自动监听新增消息；重复应用时清理旧观察器。官方 data-wcg-merged-group 和头像排版不受影响。",
        "设置按群独立保存。换到其他群时，使用同一份代码即可，无须按新成员修改。"
    ],
    "text": "// Universal group role markers based on the same sender-ID rule as merged/iMessage.\n(() => {\n  const area = document.getElementById('wcGroupMessages');\n  if (!area) return;\n  window.__wcgRoleMarker?.disconnect?.();\n\n  const shades = ['#f2f2f7', '#e5e5ea', '#dedee3', '#d8d8de', '#d1d1d6', '#c9c9cf', '#e9e9ee'];\n  // A stable key never relies on nicknames, position, or a fixed list of characters.\n  const keyFor = id => 'id-' + Array.from(id, c => c.codePointAt(0).toString(16)).join('-');\n  const shadeFor = id => {\n    let hash = 2166136261;\n    for (const ch of id) {\n      hash = Math.imul(hash ^ ch.codePointAt(0), 16777619) >>> 0;\n    }\n    return shades[hash % shades.length];\n  };\n  const resolve = row => {\n    if (!row?.classList?.contains('message-row')) return { id: '', text: false };\n    const bubble = row.querySelector(':scope > .wc-msg-body > .message-bubble');\n    const id = String(row.dataset.senderId || row.dataset.charId || bubble?.dataset.senderId || '').trim();\n    if (!id || id === 'system') return { id: '', text: false };\n    // Match the built-in merged-theme eligibility rules; media and quoted bubbles are separate.\n    const text = Boolean(bubble &&\n      !bubble.matches('.wc-group-activity-bubble, .wc-group-sticker-bubble') &&\n      !bubble.querySelector('img, video, audio, .wc-group-message-image, .wc-bubble-reply, .wc-group-translation-card, .wc-chat-file-card') &&\n      bubble.querySelector('.msg-text:not([hidden])'));\n    return { id, text };\n  };\n  const sync = () => {\n    const rows = Array.from(area.children);\n    const speakers = rows.map(resolve);\n    rows.forEach((row, i) => {\n      const { id, text } = speakers[i];\n      if (!id) return;\n      row.dataset.wcgRole = id === 'user' ? 'user' : 'char';\n      row.dataset.wcgRoleId = id;\n      row.dataset.wcgRoleKey = keyFor(id);\n      if (id !== 'user') row.style.setProperty('--wcg-role-surface', shadeFor(id));\n      // Only adjacent eligible messages from the exact same ID belong together.\n      const previous = text && speakers[i - 1]?.text && speakers[i - 1].id === id;\n      const next = text && speakers[i + 1]?.text && speakers[i + 1].id === id;\n      if (text) row.dataset.wcgRoleGroup = previous ? (next ? 'middle' : 'last') : (next ? 'first' : 'single');\n      else delete row.dataset.wcgRoleGroup;\n    });\n  };\n  const observer = new MutationObserver(sync);\n  observer.observe(area, { childList: true });\n  sync();\n  window.__wcgRoleMarker = {\n    disconnect() {\n      observer.disconnect();\n      Array.from(area.children).forEach(row => {\n        if (!row.dataset?.wcgRole) return;\n        delete row.dataset.wcgRole;\n        delete row.dataset.wcgRoleId;\n        delete row.dataset.wcgRoleKey;\n        delete row.dataset.wcgRoleGroup;\n        row.style.removeProperty('--wcg-role-surface');\n      });\n    }\n  };\n})();\n// CSS: [data-wcg-role=\"char\"] uses --wcg-role-surface automatically.\n// data-wcg-role-key stays unique for every ID in any group; no manual ID list.",
    "language": "js"
},
{
    "title": "通用 CSS 怎样为所有角色独立生效？",
    "tag": "CSS 示例",
    "note": "不必写角色 A/B 的 ID。脚本自动给每个角色设置 --wcg-role-surface，CSS 只写一个通用选择器，未来添加角色也自动匹配。若想特例修改单个角色，可额外使用 data-wcg-role-key 或第二页的精准选择器。",
    "tips": [
        "JS 读取真实 senderId 并自动建立唯一 data-wcg-role-key。",
        "同一角色即使换昵称，在任何群里都会得到同一个标识和示例灰阶值。",
        "数据来源只限当前已渲染的 DOM，不会访问任何其他聊天记录或数据库。",
        "普通气泡规则不覆盖媒体、红包和投票。"
    ],
    "text": "/* Universal: no character IDs. Paste the role marker JS once in this group. */\n#wechatAppUI #page-group-chat #wcGroupMessages#wcGroupMessages#wcGroupMessages > .message-row.received[data-wcg-role=\"char\"] > .wc-msg-body > .message-bubble:not(.wc-group-activity-bubble):not(.wc-group-sticker-bubble) {\n  background-color: var(--wcg-role-surface, #e5e5ea) !important;\n  color: #1c1c1e !important;\n}\n#wechatAppUI #page-group-chat #wcGroupMessages#wcGroupMessages#wcGroupMessages > .message-row.received[data-wcg-role=\"char\"] .message-bubble .msg-text {\n  color: #1c1c1e !important;\n}\n\n/* My bubble remains independent from all characters. */\n#wechatAppUI #page-group-chat #wcGroupMessages#wcGroupMessages#wcGroupMessages > .message-row.sent[data-wcg-role=\"user\"] > .wc-msg-body > .message-bubble:not(.wc-group-activity-bubble):not(.wc-group-sticker-bubble) {\n  background-color: #1c1c1e !important;\n  color: #ffffff !important;\n}\n#wechatAppUI #page-group-chat #wcGroupMessages#wcGroupMessages#wcGroupMessages > .message-row.sent[data-wcg-role=\"user\"] .message-bubble .msg-text {\n  color: #ffffff !important;\n}\n\n/* Each character also has its own stable data-wcg-role-key attribute. */",
    "language": "css"
},
{
    "title": "官方合并／iMessage 怎样与自定义代码共存？",
    "tag": "兼容说明",
    "note": "通用角色标识读取的正是合并气泡／仿 iMessage 依赖的 senderId，按相邻文本消息是否属于同一 ID 来计算首、中、尾状态。它只新增 data-wcg-role-group，不去修改官方 data-wcg-merged-group 或原生头像布局，因而任何角色都能通用。",
    "tips": [
        "官方分组：data-wcg-merged-group；自定义教程分组：data-wcg-role-group。",
        "不同 senderId 永远不会因为昵称相同或发言间隔很短而视为同组。",
        "若希望保留 iMessage 或合并主题的圆角，只覆盖通用气泡背景色，不重写头像或间距。",
        "当角色换群，脚本自动读取当前群 DOM，不要求手动改角色名单。"
    ],
    "text": "/* Current theme grouping, for any character; no ID needed. */\n#wechatAppUI #page-group-chat #wcGroupMessages#wcGroupMessages#wcGroupMessages > .message-row.received[data-wcg-role=\"char\"][data-wcg-merged-group=\"last\"] > .wc-msg-body > .message-bubble:not(.wc-group-activity-bubble):not(.wc-group-sticker-bubble) {\n  border-bottom-left-radius: 15px !important;\n}\n/* Universal marker's own grouping (also works with default theme): */\n#wechatAppUI #page-group-chat #wcGroupMessages#wcGroupMessages#wcGroupMessages > .message-row.received[data-wcg-role=\"char\"][data-wcg-role-group=\"first\"] > .wc-msg-body > .message-bubble:not(.wc-group-activity-bubble):not(.wc-group-sticker-bubble) {\n  border-top-left-radius: 16px !important;\n}",
    "language": "css"
},

            {
                "title": "群聊 CSS 怎样写才会生效？",
                "tag": "入门",
                "note": "先确认选择器指向群聊。仅用 .message-bubble 可能影响私聊；在最前面指定 #wechatAppUI #page-group-chat，必要时再加 !important。",
                "tips": [
                    "群聊根容器：#wechatAppUI #page-group-chat",
                    "消息区域：#wcGroupMessages，输入区：.wc-group-footer",
                    "复制前先备份自己的自定义代码；尽量不要改全局 body、.modal-item。"
                ],
                "text": "/* 只改变群聊对方的普通气泡颜色 */\n#wechatAppUI #page-group-chat #wcGroupMessages .message-row.received .message-bubble {\n  background: #e5e5ea !important;\n  color: #000 !important;\n}\n\n/* 只改变群聊自己发送的气泡圆角 */\n#wechatAppUI #page-group-chat #wcGroupMessages .message-row.sent .message-bubble {\n  border-radius: 20px !important;\n}"
            },
            {
                "title": "群聊常用选择器速查",
                "tag": "选择器",
                "note": "这些元素来自群聊当前实现，和单聊的 #page-chat-room 不是同一个页面。",
                "tips": [
                    "#wcGroupMessages .msg-text：消息文字",
                    "#page-group-chat .wc-group-speaker-name：群成员昵称",
                    "#page-group-chat .wc-group-translation-card：翻译内容",
                    "#page-group-chat .wc-group-activity-bubble：群投票、接龙等活动卡片"
                ],
                "text": "/* 示例：只改变群成员昵称样式 */\n#wechatAppUI #page-group-chat .wc-group-speaker-name {\n  font-weight: 600 !important;\n  color: #8e8e93 !important;\n}\n\n/* 示例：只调整群聊翻译卡片 */\n#wechatAppUI #page-group-chat .wc-group-translation-card {\n  border-radius: 12px !important;\n  padding: 10px 12px !important;\n}"
            },
            {
                "title": "修改字体与群聊输入区",
                "tag": "排版",
                "note": "输入框、气泡字体是两个独立区域；尽量不要修改输入框高度、定位和安全区，避免与软键盘冲突。",
                "tips": [
                    "普通气泡字体：#wcGroupMessages .msg-text",
                    "输入文字：#page-group-chat #wcGroupInput",
                    "建议只修改字号、字重、颜色，不改变底部 fixed/absolute 定位。"
                ],
                "text": "/* 群聊气泡文字 */\n#wechatAppUI #page-group-chat #wcGroupMessages .msg-text {\n  font-size: 16px !important;\n  line-height: 1.5 !important;\n}\n\n/* 群聊输入框文字 */\n#wechatAppUI #page-group-chat #wcGroupInput {\n  font-size: 16px !important;\n}"
            },
            {
                "title": "群聊 JS 可以读哪些信息？",
                "tag": "JavaScript",
                "note": "群聊角色和消息由 WcGroupChat 内部按账号管理，不能照搬私聊的 wcCurrentChatContactId 或 wcChatMessagesByContact。自定义脚本请优先只读取 DOM，别操作内部数据库。",
                "tips": [
                    "#wcGroupRoomName：当前群聊标题",
                    "#wcGroupMessages：当前界面渲染出的群消息",
                    "#page-group-chat：群聊页面根元素",
                    "WcGroupChat 是页面已公开的群聊入口，但不等于可随意读取内部数据。"
                ],
                "text": "// 示例：只读取当前群聊标题和已显示的消息数量\nconst room = document.getElementById('page-group-chat');\nif (room && room.classList.contains('active')) {\n  const title = document.getElementById('wcGroupRoomName')?.textContent?.trim();\n  const shown = document.querySelectorAll('#wcGroupMessages > .message-row').length;\n  console.log('当前群聊:', title || '未命名群聊', '已显示消息:', shown);\n}"
            },
            {
                "title": "自定义代码的应用与排错",
                "tag": "排错",
                "note": "群聊 CSS、JS 在当前群聊的美化入口保存，和单聊联系人设置独立。更换群聊后会读取对应群的设置；不要把私聊教程中的 API 调用直接粘进群聊。",
                "tips": [
                    "CSS 放在自定义美化的 CSS 页，JS 放在 JS 页。",
                    "遇到覆盖失效，先检查选择器是否含 #page-group-chat。",
                    "自定义脚本可能影响整个网页，请只粘贴信任的代码；出现异常先清空自定义 JS。"
                ],
                "text": "/* 群聊自定义 CSS 的最小测试 */\n#wechatAppUI #page-group-chat #wcGroupMessages .wc-group-speaker-name {\n  letter-spacing: .3px !important;\n}\n\n/* 确认生效后可删除测试样式 */"
            },
            {
                "title": "表情包、图片和普通气泡有什么区别？",
                "tag": "媒体组件",
                "note": "图片与绑定表情包使用独立的媒体样式。不要给群聊所有图片统一加背景，否则角色头像与游戏图片也会受影响。",
                "tips": [
                    "普通消息：#wcGroupMessages .message-bubble",
                    "绑定表情包：.wc-group-sticker-bubble",
                    "群聊图片：.wc-group-message-image",
                    "需要只改贴图时，同时限定 #page-group-chat 和表情包类名。"
                ],
                "text": "/* 仅修改群聊表情包的图片圆角 */\n#wechatAppUI #page-group-chat .wc-group-sticker-bubble .wc-group-message-image {\n    border-radius: 10px !important;\n    object-fit: contain !important;\n}\n\n/* 仅修改群聊消息图片的最大宽度 */\n#wechatAppUI #page-group-chat .wc-group-message-image {\n    max-width: 220px !important;\n}"
            },
            {
                "title": "群主、管理员和专属头衔如何美化？",
                "tag": "成员头衔",
                "note": "群成员昵称、群主、管理员标记都有自己的类名和 data-kind 属性。修改头衔外观时，请保留文字可读性和单行显示。",
                "tips": [
                    "昵称：.wc-group-speaker-name",
                    "头衔：.wc-group-title-tag",
                    "群主：.wc-group-title-tag[data-kind=\"owner\"]",
                    "管理员：.wc-group-title-tag[data-kind=\"admin\"]"
                ],
                "text": "/* 只调整群主头衔 */\n#wechatAppUI #page-group-chat .wc-group-title-tag[data-kind=\"owner\"] {\n    border-radius: 5px !important;\n    font-weight: 700 !important;\n}\n\n/* 昵称保持单行，避免聊天气泡被挤压 */\n#wechatAppUI #page-group-chat .wc-group-speaker-name {\n    white-space: nowrap !important;\n    text-overflow: ellipsis !important;\n}"
            },
            {
                "title": "自定义 CSS 怎样与聊天壁纸共存？",
                "tag": "壁纸适配",
                "note": "群聊壁纸已经由图库设置到群聊页面上。自定义 CSS 尽量只调整背景尺寸、位置或内容透明度，不要重写壁纸地址，避免覆盖用户选择。",
                "tips": [
                    "壁纸容器：#page-group-chat",
                    "背景图片由群聊外观设置注入，请优先在壁纸库选择图片。",
                    "群聊美化和私聊的当前壁纸分别保存，图片图库本身共享。"
                ],
                "text": "/* 保留壁纸图片，仅调整铺放方式 */\n#wechatAppUI #page-group-chat {\n    background-size: cover !important;\n    background-position: center !important;\n}\n\n/* 消息区域保持透明以露出壁纸 */\n#wechatAppUI #page-group-chat #wcGroupMessages {\n    background: transparent !important;\n}"
            },
            {
                "title": "JS 只读取可见群聊信息的安全写法",
                "tag": "DOM速查",
                "note": "群聊消息保存在账号独立数据里。不要使用私聊 wcCurrentChatContactId 来获取群聊，也不要让美化脚本主动创建或删除消息。",
                "tips": [
                    "页面根节点：#page-group-chat",
                    "群名显示节点：#wcGroupRoomName",
                    "消息容器：#wcGroupMessages",
                    "页面未处于 active 时不要读取过期的页面内容。"
                ],
                "text": "// 只读取当前显示的群聊界面，不修改数据库\nconst page = document.getElementById('page-group-chat');\nif (page?.classList.contains('active')) {\n    const groupName = document.getElementById('wcGroupRoomName')?.textContent || '';\n    const visible = document.querySelectorAll('#wcGroupMessages .message-row');\n    console.log('当前群聊：', groupName.trim(), '可见消息：', visible.length);\n}"
            },
            {
                "title": "手机上的适配与常见失败原因",
                "tag": "排错提醒",
                "note": "不建议自定义 CSS 修改群聊输入区的 fixed/absolute 定位，可能导致刘海屏安全区、输入法弹起时的按钮重叠。改样式前建议先保存原预设。",
                "tips": [
                    "只修改需要的组件，不要选择整个 body 或全局 .modal-item。",
                    "选择器不生效：检查是否在群聊页面，并加上 #wechatAppUI #page-group-chat。",
                    "CSS 失效时先暂时移除刚粘贴的规则；JS 错误时在自定义美化里清空 JS。",
                    "群聊与私聊的代码可以导入，但变量和页面选择器必须分别适配。"
                ],
                "text": "/* 小屏手机：只缩小昵称文字，不动输入区定位 */\n@media (max-width: 390px) {\n    #wechatAppUI #page-group-chat .wc-group-speaker-name {\n        font-size: 10px !important;\n    }\n}"
            }
        ]
    }
];

    function beautify() {
    const group = active();
    const original = el('wc-theme-modal');
    if (!group || !original) return;
    panel('聊天美化', '', 'appearance');
    const root = original.cloneNode(true);
    root.id = 'wcGroupWeTheme';
    root.classList.add('show');
    root.removeAttribute('onclick');
    const nodes = new Map();
    root.querySelectorAll('[id]').forEach(node => {
        const id = node.id;
        nodes.set(id, node);
        node.id = 'wcg-' + id;
    });
    root.querySelectorAll('[onclick], [oninput], [onchange]').forEach(node => {
        for (const attribute of ['onclick', 'oninput', 'onchange']) {
            const call = node.getAttribute(attribute);
            if (call) { node.dataset['wcg' + attribute] = call; node.removeAttribute(attribute); }
        }
    });
    const get = id => nodes.get(id);
    // Use native group members instead of private-chat demo avatars or call icons.
    const groupPreview = get('wc-custom-preview-box');
    groupPreview.replaceChildren();
    // Group preview shows only bubbles. Real group message avatars remain unchanged.
    for (const [index, label] of ['这是接收的消息预览', '这是发送的消息预览'].entries()) {
        const row = document.createElement('div');
        row.className = 'wcg-preview-row ' + (index ? 'sent' : 'received');
        const bubble = document.createElement('div');
        bubble.className = 'wcg-preview-bubble ' + (index ? 'sent' : 'received');
        bubble.textContent = label;
        row.append(bubble);
        groupPreview.append(row);
    }
    el('wcGroupPanelBody').replaceChildren(root);
    const stored = group.appearance || {};
    const draft = {
        ...stored,
        bubbleTheme: wcgUsesSenderGroups(stored.bubbleTheme) ? stored.bubbleTheme : 'image',
        colorScheme: stored.colorScheme || ((stored.sentColor && stored.sentColor.toLowerCase() !== '#000000') ||
            (stored.receivedColor && stored.receivedColor.toLowerCase() !== '#f2f2f7') ? 'legacy' : 'default'),
        timestampEnabled: stored.timestampEnabled !== false,
        fontSettings: { size: 16, family: 'default', ...(stored.fontSettings || {}) },
        presets: Array.isArray(stored.presets) ? stored.presets.slice() : [],
        wallpapers: Array.isArray(stored.wallpapers) ? stored.wallpapers.slice() : [],
        customCss: String(stored.customCss || ''),
        customJs: String(stored.customJs || '')
    };
    let section = 'menu', customPage = 0, copyPage = 1, currentEdit = null;
    const sections = {
        menu: 'wc-theme-menu-view', bubble: 'wc-theme-bubble-view',
        font: 'wc-theme-font-view',
        wallpaper: 'wc-theme-chat-bg-view', custom: 'wc-theme-custom-view',
        preset: 'wc-theme-preset-view', edit: 'wc-theme-edit-preset-view',
        copy: 'wc-theme-copy-css-view'
    };
    const iconSvg = get('wc-capsule-icon-svg')?.innerHTML || '';
    const safe = value => escape(String(value ?? ''));
    const icon = content => `<svg viewBox="0 0 24 24" fill="currentColor">${content || iconSvg}</svg>`;
    const same = () => active() === group && !el('wcGroupPanel')?.hidden;
    const persist = async (showMessage = false) => {
        if (active() !== group) return;
        group.appearance = { ...group.appearance, ...draft };
        applyAppearance(group);
        try {
            await save(group);
            if (showMessage && same()) toast('群聊美化已保存');
        } catch (error) { report(error); }
    };
    const refreshPreview = () => {
        const defaultScheme = wcgChatThemeSchemes[0];
        const scheme = draft.colorScheme === 'legacy'
            ? {
                ...defaultScheme,
                leftBg: appearanceColor(draft.receivedColor, defaultScheme.leftBg),
                rightBg: appearanceColor(draft.sentColor, defaultScheme.rightBg),
                leftText: appearanceTextColor(draft.receivedColor),
                rightText: appearanceTextColor(draft.sentColor)
            } : (wcgChatThemeSchemes.find(item => item.id === draft.colorScheme) || defaultScheme);

        // Keep a simple received/sent preview, like private official themes.
        const received = root.querySelector('.wcg-preview-bubble.received');
        const sent = root.querySelector('.wcg-preview-bubble.sent');
        const isMerged = draft.bubbleTheme === 'merged';
        const isImessage = draft.bubbleTheme === 'imessage';
        if (received) {
            received.style.setProperty('background-color', scheme.leftBg, 'important');
            received.style.setProperty('color', draft.fontSettings.colorReceived || scheme.leftText, 'important');
            received.style.fontSize = Math.max(12, Math.min(24, Number(draft.fontSettings.size) || 16)) + 'px';
            received.style.borderRadius = isMerged ? '16px 16px 16px 4px' : (isImessage ? '22px' : '18px');
        }
        if (sent) {
            sent.style.setProperty('background-color', scheme.rightBg, 'important');
            sent.style.setProperty('color', draft.fontSettings.colorSent || scheme.rightText, 'important');
            sent.style.fontSize = Math.max(12, Math.min(24, Number(draft.fontSettings.size) || 16)) + 'px';
            sent.style.borderRadius = isMerged ? '16px 16px 4px 16px' : (isImessage ? '22px' : '18px');
        }
        const preview = get('wc-custom-preview-box');
        if (preview) {
            const url = safeImage(draft.wallpaper) || (String(draft.wallpaper).startsWith('data:image/') ? draft.wallpaper : '');
            preview.style.backgroundImage = url ? `url(${JSON.stringify(url)})` : '';
        }
    };
    const title = get('wc-theme-modal-title');
    const capsule = root.querySelector('.theme-capsule');
    const capsuleLabel = get('wc-capsule-title');
    const preview = get('wc-custom-preview-box');
    const show = (name, heading, withPreview = false, withCapsule = false) => {
        section = name;
        Object.entries(sections).forEach(([key, id]) => {
            const view = get(id);
            if (view) view.style.display = key === name ? 'flex' : 'none';
        });
        title.textContent = heading;
        capsule.style.display = withCapsule ? 'flex' : 'none';
        capsuleLabel.textContent = heading === 'WeTheme' ? '聊天美化' : heading;
        preview.style.display = withPreview ? 'flex' : 'none';
        refreshPreview();
    };
    const back = () => {
        if (section === 'edit') { renderPresets(); show('preset', '美化预设库', false, true); }
        else if (section !== 'menu') show('menu', 'WeTheme', false, true);
        else closePanel();
    };
    root.querySelector('.theme-back')?.addEventListener('click', back);
    root.querySelector('.modal-overlay')?.addEventListener('click', closePanel);
    const menu = [...get('wc-theme-menu-view').querySelectorAll(':scope > .modal-item')];
    menu[0].onclick = () => {
        draft.timestampEnabled = !draft.timestampEnabled;
        syncToggles();
        persist();
    };
    menu[1].onclick = () => { renderBubbleThemes(); syncQqTheme(); show('bubble', '官方主题库', true); };
    menu[3].onclick = () => {
        const f = draft.fontSettings;
        get('wc-font-size-slider').value = f.size;
        const scheme = draft.colorScheme === 'legacy'
            ? { leftText: appearanceTextColor(draft.receivedColor), rightText: appearanceTextColor(draft.sentColor) }
            : (wcgChatThemeSchemes.find(item => item.id === draft.colorScheme) || wcgChatThemeSchemes[0]);
        get('wc-font-color-received').value = f.colorReceived || scheme.leftText;
        get('wc-font-color-sent').value = f.colorSent || scheme.rightText;
        renderFonts();
        show('font', '字体美化', true);
    };
    menu[4].onclick = async () => {
        show('wallpaper', '聊天壁纸', false, true);
        if (typeof window.wcLoadChatBgDataFromDB === 'function') {
            try { await window.wcLoadChatBgDataFromDB(); }
            catch (error) { console.warn('Shared wallpaper library load failed:', error); }
        }
        if (same() && root.isConnected) renderWallpapers();
    };
    menu[5].onclick = () => {
        get('wc-custom-css-input').value = draft.customCss;
        get('wc-custom-js-input').value = draft.customJs;
        customPage = 0;
        updateCustomPage();
        show('custom', '自定义美化', true);
    };
    menu[6].onclick = () => { renderPresets(); show('preset', '美化预设库', false, true); };
    menu[7].onclick = () => { copyPage = 1; renderCopyPage(); show('copy', '原CSS模板', false, true); };
    // Reuse only group-supported theme options; default group avatars stay visible.
    menu[2].remove();
    get('wc-theme-avatar-view')?.remove();
    // Keep the private QQ row; the section below removes unsupported theme rows.
    const syncToggles = () => {
        get('wc-timestamp-toggle')?.classList.toggle('active', draft.timestampEnabled);
    };
    // Follow the private WeTheme hierarchy: bubble options first, then theme switches.
    const bubbleView = get('wc-theme-bubble-view');
    const bubbleColors = get('wc-bubble-color-circles');
    const bubbleList = get('wc-bubble-list-container');
    const qqToggle = get('wc-qq-bar-toggle');
    const qqRow = qqToggle?.closest('.modal-item');
    if (!qqRow) throw new Error('Private WeTheme QQ switch is unavailable');
    bubbleView.querySelectorAll(':scope > .modal-item').forEach(row => { if (row !== qqRow) row.remove(); });
    const bubbleHeading = document.createElement('div');
    bubbleHeading.className = 'wcg-theme-section-caption';
    bubbleHeading.textContent = '气泡美化';
    bubbleView.insertBefore(bubbleHeading, bubbleColors);
    const themeHeading = document.createElement('div');
    themeHeading.className = 'wcg-theme-section-caption wcg-theme-section-divider';
    themeHeading.textContent = '聊天主题';
    bubbleView.insertBefore(themeHeading, qqRow);
    const syncQqTheme = () => {
        qqToggle.classList.toggle('active', draft.qqEnabled === true);
        qqRow.setAttribute('aria-checked', String(draft.qqEnabled === true));
    };
    qqRow.setAttribute('role', 'switch');
    qqRow.setAttribute('tabindex', '0');
    const changeQq = () => {
        draft.qqEnabled = draft.qqEnabled !== true;
        syncQqTheme();
        persist();
    };
    qqRow.onclick = changeQq;
    qqRow.onkeydown = event => {
        if (event.key === 'Enter' || event.key === ' ') {
            event.preventDefault();
            changeQq();
        }
    };
    const renderBubbleThemes = () => {
        bubbleColors.replaceChildren();
        wcgChatThemeSchemes.forEach(item => {
            const dot = document.createElement('button');
            dot.type = 'button';
            dot.className = 'wcg-theme-color-dot';
            dot.title = item.name;
            dot.setAttribute('aria-label', item.name);
            dot.setAttribute('aria-pressed', String(item.id === draft.colorScheme));
            dot.style.background = 'linear-gradient(90deg, ' + item.leftBg + ' 50%, ' + item.rightBg + ' 50%)';
            dot.classList.toggle('is-selected', item.id === draft.colorScheme);
            dot.onclick = () => {
                draft.colorScheme = item.id;
                renderBubbleThemes();
                refreshPreview();
                persist();
            };
            bubbleColors.append(dot);
        });
        bubbleList.replaceChildren();
        const scheme = wcgChatThemeSchemes.find(item => item.id === draft.colorScheme) || wcgChatThemeSchemes[0];
        const presets = [['image', '默认气泡'], ['merged', '合并气泡'], ['imessage', '仿iMessage气泡']];
        presets.forEach(([id, label]) => {
            const selected = draft.bubbleTheme === id;
            const card = document.createElement('div');
            card.className = 'preset-item-wrapper';
            card.style.cssText = 'position:relative;transition:all .2s;border:2px solid ' +
                (selected ? 'var(--tg-blue)' : 'transparent') + ';';
            if (selected) {
                const badge = document.createElement('div');
                badge.className = 'wcg-theme-used';
                badge.textContent = '使用中';
                card.append(badge);
            }
            const face = document.createElement('div');
            face.className = 'preset-item-content';
            face.style.cssText = 'padding:14px;cursor:pointer;';
            face.setAttribute('role', 'button');
            face.setAttribute('aria-pressed', String(selected));
            face.tabIndex = 0;
            const iconBox = document.createElement('div');
            iconBox.className = 'preset-icon';
            iconBox.style.cssText = 'width:44px;height:44px;';
            // The same preset icon used by private chat's official bubble library.
            const svgSlot = document.createElement('div');
            svgSlot.style.cssText = 'width:24px;height:24px;color:#8e8e93;';
            svgSlot.innerHTML = wcgPresetSvg;
            iconBox.append(svgSlot);
            const info = document.createElement('div');
            info.className = 'preset-info';
            const title = document.createElement('div');
            title.className = 'preset-title';
            title.style.fontSize = '16px';
            title.textContent = label;
            info.append(title);
            const palette = document.createElement('div');
            palette.className = 'wcg-theme-palette-dot';
            palette.style.background = 'linear-gradient(90deg, ' + scheme.leftBg + ' 50%, ' + scheme.rightBg + ' 50%)';
            const select = () => {
                draft.bubbleTheme = id;
                renderBubbleThemes();
                refreshPreview();
                persist();
            };
            face.onclick = select;
            face.onkeydown = event => {
                if (event.key === 'Enter' || event.key === ' ') { event.preventDefault(); select(); }
            };
            face.append(iconBox, info, palette);
            card.append(face);
            bubbleList.append(card);
        });
    };
    const fontList = () => (typeof customFonts !== 'undefined' && Array.isArray(customFonts)) ? customFonts : [];
    const wcgFontIconSvg = "<svg viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"#8E8E93\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><polyline points=\"4 7 4 4 20 4 20 7\"></polyline><line x1=\"9\" y1=\"20\" x2=\"15\" y2=\"20\"></line><line x1=\"12\" y1=\"4\" x2=\"12\" y2=\"20\"></line></svg>";
    const renderFonts = () => {
        const list = get('wc-font-list-container');
        list.replaceChildren();
        const fonts = [{id:'default',name:'系统默认 (Geomini)'},...fontList()];
        fonts.forEach(item => {
            const card = document.createElement('div');
            card.className = 'modal-item wc-font-item' + (draft.fontSettings.family === item.id ? ' active-font' : '');
            card.setAttribute('role', 'button');
            card.setAttribute('tabindex', '0');
            card.innerHTML = `<span class="modal-item-icon wcg-font-symbol">${wcgFontIconSvg}</span><span class="modal-item-text">${safe(item.name)}</span>`;
            if (item.id !== 'default') card.querySelector('.modal-item-text').style.fontFamily = JSON.stringify(item.id);
            const chooseFont = () => { draft.fontSettings.family = item.id; renderFonts(); persist(); };
            card.onclick = chooseFont;
            card.onkeydown = event => {
                if (event.key === 'Enter' || event.key === ' ') {
                    event.preventDefault();
                    chooseFont();
                }
            };
            list.append(card);
        });
    };
    get('wc-font-size-slider').oninput = event => { draft.fontSettings.size = Number(event.target.value); refreshPreview(); };
    get('wc-font-size-slider').onchange = event => { draft.fontSettings.size = Number(event.target.value); persist(); };
    get('wc-font-color-received').oninput = event => { draft.fontSettings.colorReceived = event.target.value; refreshPreview(); };
    get('wc-font-color-received').onchange = event => { draft.fontSettings.colorReceived = event.target.value; persist(); };
    get('wc-font-color-sent').oninput = event => { draft.fontSettings.colorSent = event.target.value; refreshPreview(); };
    get('wc-font-color-sent').onchange = event => { draft.fontSettings.colorSent = event.target.value; persist(); };
    root.querySelectorAll('[data-wcgonclick]').forEach(node => {
        const call = node.dataset.wcgonclick || '';
        if (call.includes("wcResetFontColor('received')")) node.onclick = () => {
            draft.fontSettings.colorReceived = '#000000'; get('wc-font-color-received').value = '#000000'; persist();
        };
        if (call.includes("wcResetFontColor('sent')")) node.onclick = () => {
            draft.fontSettings.colorSent = '#ffffff'; get('wc-font-color-sent').value = '#ffffff'; persist();
        };
        if (call.includes("wcLoadUrlFont()")) node.onclick = async () => {
            const answer = await showCustomPrompt('导入字体',[{placeholder:'输入字体名称 (选填)'},{placeholder:'https://...'}],'安装');
            if (!answer) return;
            const url = safeImage(answer[1]);
            if (!url) return toast('请输入有效的字体 URL');
            const id = 'WcgFont_' + Date.now();
            try {
                const face = new FontFace(id, `url(${JSON.stringify(url)})`);
                await face.load();
                document.fonts.add(face);
                draft.fontSettings.family = id;
                draft.fontSettings.fontUrl = url;
                draft.fontSettings.fontName = String(answer[0] || '网络字体').trim();
                renderFonts(); persist(); toast('字体导入成功');
            } catch(error) { report(error); }
        };
        if (call.includes("wc-font-file-input")) node.onclick = () => get('wc-font-file-input')?.click();
    });
    get('wc-font-file-input').onchange = async event => {
        const file = event.target.files?.[0];
        event.target.value = '';
        if (!file) return;
        try {
            const buffer = await file.arrayBuffer();
            const family = 'WcgLocal_' + Date.now();
            const face = new FontFace(family, buffer);
            await face.load();
            document.fonts.add(face);
            draft.fontSettings.family = family;
            // Store the installed font through the existing font library when available.
            if (typeof customFonts !== 'undefined' && Array.isArray(customFonts) && typeof saveFontData === 'function') {
                customFonts.push({id:family,name:file.name,type:'local',data:buffer});
                saveFontData();
            }
            renderFonts(); persist(); toast('字体导入成功');
        } catch (error) { report(error); }
    };
    // Reuse the private-chat wallpaper icon assets and the existing shared IndexedDB list.
    // Only the current group's selected wallpaper is stored in its appearance record.
    const wcgWallpaperIcons = {"add":"<svg viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><line x1=\"12\" y1=\"5\" x2=\"12\" y2=\"19\"></line><line x1=\"5\" y1=\"12\" x2=\"19\" y2=\"12\"></line></svg>","del":"<svg viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><polyline points=\"3 6 5 6 21 6\"></polyline><path d=\"M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2\"></path></svg>","file":"<svg width=\"18\" height=\"18\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><path d=\"M4 16V6a2 2 0 0 1 2-2h10\"></path><rect x=\"8\" y=\"8\" width=\"14\" height=\"14\" rx=\"2\" ry=\"2\"></rect><circle cx=\"13.5\" cy=\"13.5\" r=\"1.5\"></circle><path d=\"M8 18l4-4 2 2 3-3 5 5\"></path></svg>","url":"<svg width=\"18\" height=\"18\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><path d=\"M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71\"></path><path d=\"M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71\"></path></svg>"};
    const wallpaperInput = get('wc-chat-bg-file-input');
    const sourceOverlay = document.createElement('div');
    sourceOverlay.className = 'wcg-wallpaper-source-overlay';
    sourceOverlay.hidden = true;
    const sourceMenu = document.createElement('div');
    sourceMenu.className = 'wcg-wallpaper-source-menu';
    for (const [kind, label] of [['file','照片图库'],['url','使用 URL']]) {
        const option = document.createElement('button');
        option.type = 'button';
        option.className = 'icon-menu-item';
        option.innerHTML = wcgWallpaperIcons[kind];
        const text = document.createElement('span');
        text.textContent = label;
        option.append(text);
        option.onclick = async event => {
            event.stopPropagation();
            sourceOverlay.hidden = true;
            if (kind === 'file') {
                wallpaperInput.value = '';
                wallpaperInput.click();
            } else {
                const result = await showCustomPrompt('添加聊天壁纸', {placeholder:'输入图片 URL'}, '确定');
                if (result === null || !same() || !root.isConnected) return;
                const url = safeImage(result);
                if (!url) { toast('请输入有效的图片 URL'); return; }
                addWallpaper(url);
            }
        };
        sourceMenu.append(option);
    }
    sourceOverlay.append(sourceMenu);
    sourceOverlay.onclick = event => { if (event.target === sourceOverlay) sourceOverlay.hidden = true; };
    root.append(sourceOverlay);
    const addWallpaper = value => {
        if (!same() || !root.isConnected || !value) return;
        if (!Array.isArray(window.wcChatBgList)) window.wcChatBgList = [];
        if (!window.wcChatBgList.includes(value)) {
            window.wcChatBgList.unshift(value);
            if (typeof window.wcSaveChatBgDataToDB === 'function') window.wcSaveChatBgDataToDB();
        }
        draft.wallpaper = value;
        renderWallpapers();
        refreshPreview();
        persist();
    };
    wallpaperInput.onchange = async event => {
        const file = event.target.files?.[0];
        event.target.value = '';
        if (!file) return;
        if (!file.type.startsWith('image/')) { toast('请选择图片文件'); return; }
        try {
            // Match the private-chat upload dimensions and JPEG compression.
            const imageUrl = await new Promise((resolve, reject) => {
                const reader = new FileReader();
                reader.onerror = () => reject(reader.error || new Error('图片读取失败'));
                reader.onload = () => {
                    const image = new Image();
                    image.onerror = () => reject(new Error('无法打开图片'));
                    image.onload = () => {
                        try {
                            const ratio = Math.min(1, 1080 / image.width, 2400 / image.height);
                            const canvas = document.createElement('canvas');
                            canvas.width = Math.max(1, Math.round(image.width * ratio));
                            canvas.height = Math.max(1, Math.round(image.height * ratio));
                            canvas.getContext('2d').drawImage(image, 0, 0, canvas.width, canvas.height);
                            resolve(canvas.toDataURL('image/jpeg', .85));
                        } catch (error) { reject(error); }
                    };
                    image.src = reader.result;
                };
                reader.readAsDataURL(file);
            });
            if (same() && root.isConnected) { addWallpaper(imageUrl); toast('壁纸添加成功'); }
        } catch (error) { report(error); }
    };
    const renderWallpapers = () => {
        const carousel = get('wc-chat-bg-carousel');
        carousel.replaceChildren();
        const add = document.createElement('button');
        add.type = 'button';
        add.className = 'wc-bg-add-box';
        add.innerHTML = wcgWallpaperIcons.add;
        const text = document.createElement('span');
        text.textContent = '添加壁纸';
        add.append(text);
        add.onclick = event => {
            const rect = event.currentTarget.getBoundingClientRect();
            const box = root.getBoundingClientRect();
            const width = 188, height = 104;
            const top = rect.bottom - box.top + height + 12 > box.height
                ? rect.top - box.top - height - 8 : rect.bottom - box.top + 8;
            sourceMenu.style.top = Math.max(12, top) + 'px';
            sourceMenu.style.left = Math.max(12, Math.min(rect.left - box.left, box.width - width - 12)) + 'px';
            sourceOverlay.hidden = false;
        };
        carousel.append(add);
        const shared = Array.isArray(window.wcChatBgList) ? window.wcChatBgList : [];
        const legacy = Array.isArray(draft.wallpapers) ? draft.wallpapers : [];
        const urls = ['', ...new Set([...shared, ...legacy, draft.wallpaper || ''].filter(Boolean))];
        urls.forEach(value => {
            const card = document.createElement('button');
            card.type = 'button';
            card.className = 'wc-bg-card' + (value === (draft.wallpaper || '') ? ' selected' : '');
            const img = document.createElement('div');
            img.className = 'wc-bg-img';
            if (value) {
                const url = safeImage(value) || (value.startsWith('data:image/') ? value : '');
                if (url) img.style.backgroundImage = `url(${JSON.stringify(url)})`;
            } else {
                img.textContent = '无壁纸';
                img.classList.add('wcg-theme-no-wallpaper');
            }
            card.append(img);
            const border = document.createElement('div');
            border.className = 'wc-bg-selected-border';
            card.append(border);
            card.onclick = () => {
                draft.wallpaper = value;
                renderWallpapers();
                refreshPreview();
                persist();
            };
            if (value) {
                const remove = document.createElement('span');
                remove.className = 'wc-bg-delete-btn';
                remove.innerHTML = wcgWallpaperIcons.del;
                remove.setAttribute('role', 'button');
                remove.setAttribute('aria-label', '删除壁纸');
                remove.setAttribute('tabindex', '0');
                const onDelete = async event => {
                    event.stopPropagation();
                    if (!await showCustomConfirm('删除壁纸', '确定从聊天壁纸库中删除这张图片吗？', '删除', true)) return;
                    if (!same()) return;
                    if (Array.isArray(window.wcChatBgList)) {
                        window.wcChatBgList = window.wcChatBgList.filter(item => item !== value);
                        if (typeof window.wcSaveChatBgDataToDB === 'function') window.wcSaveChatBgDataToDB();
                    }
                    draft.wallpapers = (draft.wallpapers || []).filter(item => item !== value);
                    if (draft.wallpaper === value) draft.wallpaper = '';
                    renderWallpapers();
                    refreshPreview();
                    persist();
                };
                remove.onclick = onDelete;
                remove.onkeydown = event => {
                    if (event.key === 'Enter' || event.key === ' ') {
                        event.preventDefault();
                        onDelete(event);
                    }
                };
                card.append(remove);
            }
            carousel.append(card);
        });
    };
    const updateCustomPage = () => {
        get('wc-chat-theme-css-page').style.display = customPage === 0 ? 'flex' : 'none';
        get('wc-chat-theme-js-page').style.display = customPage === 1 ? 'flex' : 'none';
        get('wcChatThemePageLabel').textContent = customPage === 0 ? 'CSS (1/2)' : 'JS (2/2)';
        get('wcChatThemePrevBtn').style.opacity = customPage === 0 ? '.35' : '1';
        get('wcChatThemeNextBtn').style.opacity = customPage === 1 ? '.35' : '1';
    };
    get('wcChatThemePrevBtn').onclick = () => { customPage = 0;updateCustomPage(); };
    get('wcChatThemeNextBtn').onclick = () => { customPage = 1;updateCustomPage(); };
    get('wc-custom-css-input').addEventListener('input',event => {draft.customCss=event.target.value;});
    get('wc-custom-js-input').addEventListener('input',event => {draft.customJs=event.target.value;});
    const applyCustom = () => {
        draft.customCss = get('wc-custom-css-input').value;
        draft.customJs = get('wc-custom-js-input').value;
        draft.currentPresetId = null;
        persist(true);
    };
    const parseThemeFile = text => {
        const raw = String(text || '');
        try {
            const value = JSON.parse(raw);
            if(value && typeof value === 'object')return {css:String(value.css||''),js:String(value.js||'')};
        } catch (_) {}
        const parts = raw.split(/\/\*\s*===\s*(?:WECHAT_THEME_)?(CSS|JS)\s*===\s*\*\//i);
        if(parts.length>1) {
            let css='',js='';
            for(let i=1;i<parts.length;i+=2) { if(parts[i].toUpperCase()==='CSS') css=parts[i+1].trim();else js=parts[i+1].trim(); }
            return {css,js};
        }
        const style=raw.match(/<style[^>]*>([\s\S]*?)<\/style>/i);
        const script=raw.match(/<script[^>]*>([\s\S]*?)<\/script>/i);
        if(style||script)return {css:style?.[1]||'',js:script?.[1]||''};
        return /^\s*(?:\(function|window\.|document\.|function\s*\(|const\s+|let\s+|var\s+)/.test(raw)
            ? {css:'',js:raw}:{css:raw,js:''};
    };
    const exportText = () => {
        const css = get('wc-custom-css-input').value;
        const js = get('wc-custom-js-input').value;
        return typeof window.wcFormatThemeOutputForGroup === 'function'
            ? window.wcFormatThemeOutputForGroup(css, js)
            : `/* === WECHAT_THEME_CSS === */\n${css}\n\n/* === WECHAT_THEME_JS === */\n${js}\n`;
    };
    const sharePresets = () => {
        if (Array.isArray(window.wcChatPresets)) return window.wcChatPresets;
        if (!Array.isArray(appSettings.wc_chat_presets))appSettings.wc_chat_presets = [];
        window.wcChatPresets = appSettings.wc_chat_presets;
        return window.wcChatPresets;
    };
    const savePresetLibrary = () => {
        appSettings.wc_chat_presets = sharePresets();
        saveAppSettings();
    };
    const wcgPresetSvg = "<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 24 24\" fill=\"currentColor\"><path d=\"M4 2.9967H20C20.5523 2.9967 21 3.44442 21 3.9967V8.9967C21 9.54899 20.5523 9.9967 20 9.9967H4C3.44772 9.9967 3 9.54899 3 8.9967V3.9967C3 3.44442 3.44772 2.9967 4 2.9967ZM6 11.9967H12C12.5523 11.9967 13 12.4444 13 12.9967V15.9967H14V21.9967H10V15.9967H11V13.9967H5C4.44772 13.9967 4 13.549 4 12.9967V10.9967H6V11.9967ZM17.7322 13.7289L19.5 11.9612L21.2678 13.7289C22.2441 14.7052 22.2441 16.2882 21.2678 17.2645C20.2915 18.2408 18.7085 18.2408 17.7322 17.2645C16.7559 16.2882 16.7559 14.7052 17.7322 13.7289Z\"></path></svg>";
    // Match private preset editing; allow editing both parts of a saved group theme.
    const presetEditView = get('wc-theme-edit-preset-view');
    const jsEditorContainer = document.createElement('div');
    jsEditorContainer.className = 'custom-textarea-wrapper wcg-preset-js-editor';
    const jsEditor = document.createElement('textarea');
    jsEditor.placeholder = '在此输入自定义 JS 代码...';
    jsEditor.setAttribute('aria-label', '预设 JavaScript');
    jsEditorContainer.append(jsEditor);
    presetEditView.insertBefore(jsEditorContainer, presetEditView.querySelector('.custom-actions'));
    const renderPresets = () => {
        const container = get('wc-theme-preset-view');container.replaceChildren();
        const presets = sharePresets();
        if (!presets.length) {
            container.innerHTML = '<div style="text-align:center;color:#8e8e93;margin-top:40px;font-size:14px">暂无预设主题</div>';
            return;
        }
        presets.forEach(preset => {
            const row = document.createElement('div');row.className='preset-item-wrapper';
            row.innerHTML = `<div class="preset-item-content"><span class="preset-icon">${wcgPresetSvg}</span><span class="preset-info"><span class="preset-title">${safe(preset.name)}</span></span></div><div class="preset-item-actions"><button class="action-capsule edit" type="button">编辑</button><button class="action-capsule delete" type="button">删除</button></div>`;
            if (draft.currentPresetId === preset.id) {
                const mark = document.createElement('span'); mark.className = 'wcg-theme-used';mark.textContent = '使用中';row.append(mark);
            }
            const face = row.querySelector('.preset-item-content');
            // Match private preset cards: swipe left to expose Edit and Delete.
            let startX = 0, startY = 0, currentX = 0, swiping = false;
            face.addEventListener('touchstart', event => {
                if (!event.touches.length) return;
                startX = currentX = event.touches[0].clientX;
                startY = event.touches[0].clientY;
                swiping = false;
                face.style.transition = 'none';
            }, { passive: true });
            face.addEventListener('touchmove', event => {
                if (!event.touches.length) return;
                currentX = event.touches[0].clientX;
                const dx = currentX - startX;
                const dy = event.touches[0].clientY - startY;
                if (Math.abs(dy) > Math.abs(dx) || dx >= 0) return;
                swiping = Math.abs(dx) > 10;
                if (swiping && event.cancelable) event.preventDefault();
                const actions = row.querySelector('.preset-item-actions');
                const distance = Math.min(0, Math.max(-(actions?.offsetWidth || 140), dx));
                face.style.transform = `translateX(${distance}px)`;
            }, { passive: false });
            face.addEventListener('touchend', () => {
                face.style.transition = 'transform .3s cubic-bezier(.1,.8,.2,1)';
                const width = row.querySelector('.preset-item-actions')?.offsetWidth || 140;
                face.style.transform = swiping && currentX - startX < -40
                    ? `translateX(-${width}px)` : 'translateX(0px)';
            });
            face.onclick = event => {
                if (swiping) { event.preventDefault(); swiping = false; return; }
                draft.customCss=preset.css||'';draft.customJs=preset.js||'';draft.currentPresetId=preset.id;
                persist(true);renderPresets();
            };
            row.querySelector('.action-capsule.edit').onclick=()=>{
                currentEdit=preset;
                get('wc-edit-preset-name').value=preset.name;
                get('wc-edit-preset-css').value=preset.css||'';
                jsEditor.value = preset.js || '';
                show('edit','编辑预设');
            };
            row.querySelector('.action-capsule.delete').onclick=async()=>{
                if (!await showCustomConfirm('删除预设','确定要删除这个美化预设吗？','删除',true))return;
                const list = sharePresets();
                const index = list.findIndex(item => item.id === preset.id);
                if (index !== -1) list.splice(index, 1);
                savePresetLibrary();renderPresets();
            };
            container.append(row);
        });
    };
    // Same three-page structure as private chat, with group-native code and safe group tutorials.
    const renderCopyPage = () => {
        const page = wcgGroupNativeCssPages[copyPage - 1];
        const cards = get('wcCopyCssCardsWrap');
        cards.replaceChildren();
        cards.dataset.kind = page.kind;
        cards.scrollTop = 0;
        const copyMarkup = "<svg viewBox=\"0 0 24 24\" width=\"15\" height=\"15\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\" style=\"display:block;\"><rect x=\"9\" y=\"9\" width=\"13\" height=\"13\" rx=\"2\"></rect><path d=\"M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1\"></path></svg>";
        for (const [index, block] of page.blocks.entries()) {
            const code = block.autoFillGroupRoles ? wcgGroupMemberBubbleCss(group) : block.text;
            const item = document.createElement('section');
            item.className = 'wcg-group-css-entry' + (page.kind === 'tutorial' ? ' is-tutorial' : '');
            if (page.kind !== 'source') {
                const heading = document.createElement('div');
                heading.className = 'wcg-group-css-heading';
                const title = document.createElement('strong');
                title.textContent = block.title;
                const tag = document.createElement('span');
                tag.className = 'wcg-group-css-badge';
                tag.textContent = block.tag;
                // Match private chat's strong iOS category accents, not muted group colors.
                const tones = page.kind === 'tutorial'
                    ? ['#FF3B30', '#007AFF', '#AF52DE', '#34C759']
                    : ['#007AFF', '#34C759', '#FF9500', '#AF52DE', '#FF3B30'];
                const tone = tones[index % tones.length];
                tag.style.color = tone;
                tag.style.backgroundColor = tone + '18';
                heading.append(title, tag);
                item.append(heading);
                const description = document.createElement('p');
                description.className = 'wcg-group-css-description';
                const callout = document.createElement('span');
                callout.className = 'wcg-group-css-callout';
                callout.textContent = page.kind === 'tutorial' ? '[核心提示] ' : '★ 批注：';
                description.append(callout, document.createTextNode(block.note));
                item.append(description);
                if (Array.isArray(block.tips)) {
                    const tips = document.createElement('div');
                    tips.className = 'wcg-group-css-tips';
                    block.tips.forEach(line => {
                        const tip = document.createElement('p');
                        tip.append(document.createTextNode('• '));
                        // Highlight group selectors and CSS priority markers without HTML injection.
                        String(line).split(/(#[a-zA-Z][\w-]*|\.[a-zA-Z][\w-]*|!important)/g).forEach(part => {
                            if (/^(#|\.|!important)/.test(part)) {
                                const code = document.createElement('code');
                                code.textContent = part;
                                tip.append(code);
                            } else if (part) tip.append(document.createTextNode(part));
                        });
                        tips.append(tip);
                    });
                    item.append(tips);
                }
            }
            const frame = document.createElement('div');
            frame.className = 'wcg-group-css-frame';
            const copy = document.createElement('button');
            copy.type = 'button';
            copy.className = 'wcg-group-css-copy';
            copy.setAttribute('aria-label', '复制' + (block.label || block.title));
            copy.innerHTML = copyMarkup;
            copy.onclick = () => {
                // Reuse the private CSS panel's clipboard helper and permission fallback.
                if (typeof window.wcCopyCodeBlockText === 'function') {
                    window.wcCopyCodeBlockText(code, block.label || block.title || '群聊代码');
                } else {
                    navigator.clipboard?.writeText(code)
                        .then(() => toast('已复制群聊代码'))
                        .catch(() => toast('复制失败，请检查剪贴板权限'));
                }
            };
            const pre = document.createElement('pre');
            pre.textContent = code;
            if (page.kind === 'source') pre.classList.add('wcg-group-css-source');
            if (page.kind !== 'source') {
                const codeLabel = document.createElement('div');
                codeLabel.className = 'wcg-group-css-code-label';
                codeLabel.textContent = block.language === 'js' ? 'JAVASCRIPT · 粘贴到 JS 页' : 'CSS · 粘贴到 CSS 页';
                frame.append(codeLabel);
            }
            frame.append(copy, pre);
            item.append(frame);
            cards.append(item);
        }
        get('wcCopyCssPageIndicator').textContent = `${copyPage} / ${wcgGroupNativeCssPages.length}`;
        get('wcCopyCssHeaderTitle').textContent = `第 ${copyPage} 页 · ${page.title}`;
        get('wcCopyCssPrevBtn').style.opacity = copyPage === 1 ? '.35' : '1';
        get('wcCopyCssNextBtn').style.opacity = copyPage === wcgGroupNativeCssPages.length ? '.35' : '1';
        get('wcCopyCssPrevBtn').style.pointerEvents = copyPage === 1 ? 'none' : 'auto';
        get('wcCopyCssNextBtn').style.pointerEvents = copyPage === wcgGroupNativeCssPages.length ? 'none' : 'auto';
        get('wcCopyCssPrevBtn').setAttribute('aria-disabled', String(copyPage === 1));
        get('wcCopyCssNextBtn').setAttribute('aria-disabled', String(copyPage === wcgGroupNativeCssPages.length));
    };
    get('wcCopyCssPrevBtn').onclick=()=>{if(copyPage>1){copyPage--;renderCopyPage();}};
    get('wcCopyCssNextBtn').onclick=()=>{if(copyPage<3){copyPage++;renderCopyPage();}};
    root.querySelectorAll('[data-wcgonclick]').forEach(node => {
        const call=node.dataset.wcgonclick||'';
        if (call.includes('wcSaveCustomTheme()')) node.onclick=applyCustom;
        if (call.includes('wcClearCustomCss()')) node.onclick=async()=>{
            if(!await showCustomConfirm('清空代码','确定清空当前群聊的 CSS 和 JS 吗？','清空',true))return;
            draft.customCss='';draft.customJs='';get('wc-custom-css-input').value='';get('wc-custom-js-input').value='';
            persist(true);
        };
        if (call.includes('wcOpenSavePresetDialog()')) node.onclick=async()=>{
            const name=await showCustomPrompt('保存为预设',{placeholder:'请输入预设名称'},'确定');
            if(!name?.trim())return;
            sharePresets().push({id:'wc_chat_preset_'+Date.now(),name:name.trim(),author:'我',css:get('wc-custom-css-input').value,js:get('wc-custom-js-input').value});
            savePresetLibrary();toast('预设已保存');
        };
        if (call.includes('wcTriggerImportChatTheme()'))node.onclick=()=>get('wc-chat-theme-file-input').click();
        if (call.includes('wcExportChatTheme()'))node.onclick=async()=>{
            const defaultName=`${group.name}_Theme`;
            const name=await showCustomPrompt('导出聊天美化 (TXT)',{placeholder:'请输入文件名',value:defaultName},'导出');
            if(name===null)return;
            const url=URL.createObjectURL(new Blob([exportText()],{type:'text/plain;charset=utf-8'}));
            const a=document.createElement('a');a.href=url;a.download=(name?.trim()||defaultName)+'.txt';document.body.append(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(url),1000);
        };
        if (call.includes('wcShowThemePreset()'))node.onclick=()=>{renderPresets();show('preset','美化预设库',false,true);};
        if (call.includes('wcSaveEditedPreset()'))node.onclick=()=>{
            if(!currentEdit)return;
            currentEdit.name=get('wc-edit-preset-name').value.trim()||'未命名';
            currentEdit.css=get('wc-edit-preset-css').value;
            currentEdit.js=jsEditor.value;
            if (draft.currentPresetId === currentEdit.id) {
                draft.customCss = currentEdit.css;
                draft.customJs = currentEdit.js;
                persist();
            }
            savePresetLibrary();renderPresets();show('preset','美化预设库',false,true);
        };
    });
    get('wc-chat-theme-file-input').onchange=async event=>{
        const file=event.target.files?.[0];event.target.value='';
        if(!file)return;
        try {
            let raw='';
            const buffer = await file.arrayBuffer();
            if (file.name.toLowerCase().endsWith('.docx')) {
                if (typeof window.wcReadThemeDocxForGroup !== 'function') throw new Error('DOCX 导入组件未加载');
                raw = await window.wcReadThemeDocxForGroup(buffer);
            } else {
                raw = typeof window.wcDecodeThemeTextForGroup === 'function'
                    ? window.wcDecodeThemeTextForGroup(buffer) : new TextDecoder().decode(buffer);
            }
            const result = typeof window.wcParseThemeContentForGroup === 'function'
                ? window.wcParseThemeContentForGroup(raw) : parseThemeFile(raw);
            draft.customCss=result.css;draft.customJs=result.js;
            get('wc-custom-css-input').value=draft.customCss;
            get('wc-custom-js-input').value=draft.customJs;
            applyCustom();
        } catch(error){report(error);}
    };
    syncToggles();
    show('menu','WeTheme',false,true);
}
    function showGroupSettingsSection(section) {
        const sections = { overview: '聊天信息', profile: '群资料', announcement: '群公告', management: '管理群' };
        if (!sections[section]) return;
        const form = el('wcGroupSettingsForm'), body = el('wcGroupPanelBody');
        if (!form || !body) return;
        const previous = el('wcGroupPanel').dataset.settingsSection || 'overview';
        form.dataset['scroll_' + previous] = String(body.scrollTop || 0);
        Object.keys(sections).forEach(key => {
            const view = el('wcGroupSettings_' + key);
            if (view) view.hidden = key !== section;
        });
        el('wcGroupPanel').dataset.settingsSection = section;
        el('wcGroupPanelTitle').textContent = sections[section];
        if (section === 'overview' && form.elements) {
            [['wcGroupEditProfile', 'name'], ['wcGroupEditDescription', 'description'], ['wcGroupEditAnnouncement', 'announcement']].forEach(([id, name]) => {
                const value = el(id)?.querySelector('.wc-group-info-value');
                if (value && form.elements[name]) value.textContent = form.elements[name].value || '未设置';
            });
        }
        body.scrollTop = Number(form.dataset['scroll_' + section]) || 0;
    }

    function groupMediaPanel(kind) {
        const group = active();
        if (!group) return;
        const photos = kind === 'photos';
        const messages = rows(group).filter(message => !message.hiddenForUser && !message.recalled &&
            (photos ? !message.isSticker && safeStickerUrl(message.imageUrl) : Boolean(message.fileAttachment))).reverse();
        panel(photos ? '群相册' : '群文件', '<div id="wcGroupMediaItems" class="wc-group-media-items"></div>', 'group-media');
        const container = el('wcGroupMediaItems');
        container.classList.toggle('wc-group-photo-grid', photos);
        if (!messages.length) { container.innerHTML = '<p class="wc-group-hint">' + (photos ? '群聊中还没有图片' : '群聊中还没有文件') + '</p>'; return; }
        messages.forEach(message => {
            const item = document.createElement(photos ? 'button' : 'div');
            item.className = 'wc-group-media-item';
            if (photos) {
                item.type = 'button';
                const image = document.createElement('img');
                image.src = message.imageUrl; image.alt = message.text || '群聊图片'; image.loading = 'lazy';
                item.append(image); item.onclick = () => jump(message.id);
                item.setAttribute('aria-label', '查看' + message.senderName + '发送的图片');
            } else {
                item.append(wcCreateChatFileCard(message.fileAttachment));
                const locate = document.createElement('button');
                locate.type = 'button'; locate.className = 'wc-group-media-locate';
                locate.textContent = message.senderName + ' · 查看原消息'; locate.onclick = () => jump(message.id);
                item.append(locate);
            }
            container.append(item);
        });
    }

    async function removeGroupMembers(group, memberIds) {
        const token = epoch;
        const owner = account;
        if (!group || active() !== group || !canManage(group)) throw new Error('当前没有移出群成员的权限');
        const ids = [...new Set(memberIds.map(String))];
        const members = ids.map(id => group.members.find(member => member.id === id));
        if (!ids.length || members.some(member => !member || member.id === USER_ID || member.role === 'owner')) {
            throw new Error('所选成员已变更，请重新选择');
        }
        const names = members.map(memberName);
        const description = names.length === 1 ? `将${names[0]}移出群聊？` :
            `确定移出${names.length}位成员（${names.slice(0, 3).join('、')}${names.length > 3 ? '等' : ''}）？`;
        if (!await showCustomConfirm('移出群成员', description, '移出', true)) return false;
        if (token !== epoch || owner !== account || owner !== currentAccount() || active() !== group) return false;
        if (!canManage(group) || members.some(member => !group.members.includes(member) || member.role === 'owner')) {
            throw new Error('成员或权限已变更，请重新选择');
        }
        pause();
        const removedIds = new Set(ids);
        group.members = group.members.filter(member => !removedIds.has(member.id));
        for (const member of members) {
            if (group.memberMemories) delete group.memberMemories[member.id];
            operationNotice(group, `${operatorName(group)}将${memberName(member)}移出了群聊`);
        }
        await save(group);
        settings();
        render();
        wcRenderChatList();
        return true;
    }

    function removeMembersPanel() {
        const group = active();
        if (!group || !canManage(group)) return;
        refreshMemberAvatars(group);
        const removable = group.members.filter(member => member.id !== USER_ID && member.role !== 'owner')
            .map(member => ({ ...member, displayName: memberName(member) }));
        panel('移出群成员', `<form id="wcGroupRemoveForm" class="wc-group-select-form">
            <div class="wc-group-select-intro"><strong>选择要移出的成员</strong><span>可多选，移出后不影响其他成员的聊天记录</span></div>
            <p class="wc-group-select-count" id="wcGroupRemoveCount" aria-live="polite">未选择成员</p>
            <div class="wc-group-select-list">${memberChoices(removable) || '<p class="wc-group-hint">暂无可移出的成员</p>'}</div>
        </form>`, 'remove-members');
        renderChoiceAvatars(removable);
        const form = el('wcGroupRemoveForm');
        const saveButton = el('wcGroupPanelSave');
        const updateSelection = () => {
            const count = form.querySelectorAll('input[name="member"]:checked').length;
            el('wcGroupRemoveCount').textContent = count ? `已选择 ${count} 位成员` : '未选择成员';
            saveButton.disabled = count === 0;
        };
        form.addEventListener('change', updateSelection);
        updateSelection();
        let submitting = false;
        form.onsubmit = async event => {
            event.preventDefault();
            if (submitting) return;
            const ids = new FormData(form).getAll('member').map(String);
            if (!ids.length) return toast('请先选择要移出的成员');
            submitting = true;
            saveButton.disabled = true;
            try {
                await removeGroupMembers(group, ids);
            } catch (error) {
                report(error);
            } finally {
                submitting = false;
                if (form.isConnected) updateSelection();
            }
        };
    }

    function showGroupWorldbookBinding(show) {
        const main = el('wcGroupSettingsMainView'), binding = el('wcGroupWorldbookView');
        if (!main || !binding) return;
        const body = el('wcGroupPanelBody'), form = el('wcGroupSettingsForm');
        if (show) form.dataset.settingsScrollTop = String(body.scrollTop || 0);
        main.hidden = show;
        binding.hidden = !show;
        el('wcGroupPanel').dataset.view = show ? 'worldbook-binding' : 'settings';
        el('wcGroupPanelTitle').textContent = show ? '世界书绑定' :
            (el('wcGroupPanel').dataset.settingsSection === 'management' ? '管理群' : '聊天信息');
        body.scrollTop = show ? 0 : Number(form.dataset.settingsScrollTop) || 0;
    }

    function settings() {
        const group = active();
        if (!group) return;
        refreshMemberAvatars(group);
        const manageable = canManage(group);
        let selectedAvatar = group.avatar || '';
        const toggle = (label, name, checked, detail = '', icon = name) => `<label class="wc-group-check wc-group-setting-toggle">
            ${groupSettingsIcon(icon)}
            <span class="wc-group-toggle-copy"><strong>${label}</strong>${detail ? `<small>${detail}</small>` : ''}</span>
            <input type="checkbox" name="${name}" ${checked ? 'checked' : ''}>
            <span class="wc-group-switch-track" aria-hidden="true"></span>
        </label>`;
        const leaveIconMarkup = "<svg t=\"1791515104113\" class=\"icon\" viewBox=\"0 0 1024 1024\" version=\"1.1\" xmlns=\"http://www.w3.org/2000/svg\" p-id=\"5699\" width=\"200\" height=\"200\"><path d=\"M768 819.2h-256V204.8L256 102.4h512v102.4h102.4V0H0v819.2l512 204.8v-102.4h358.4v-204.8h-102.4v102.4z\" fill=\"currentColor\" p-id=\"5700\"></path><path d=\"M1024 460.8l-256-153.6v102.4h-204.8v102.4h204.8v102.4l256-153.6z\" fill=\"currentColor\" p-id=\"5701\"></path></svg>";
        const action = (id, label, icon, dangerous = false) => `<button type="button" class="wc-group-row${dangerous ? ' wc-group-danger' : ''}${id === 'wcGroupLeave' ? ' wc-group-warning' : ''}" id="${id}">
            ${id === 'wcGroupLeave' ? `<span class="wc-group-setting-icon">${leaveIconMarkup}</span>` : groupSettingsIcon(icon)}
            <span class="wc-group-action-label">${label}</span>${dangerous ? '' : groupSettingsChevron()}
        </button>`;

        const summaryRow = (id, label, value = '', multiline = false) => `<button type="button" class="wc-group-info-row${multiline ? ' wc-group-info-row-multiline' : ''}" id="${id}"><span>${label}</span><span class="wc-group-info-value">${escape(value || '未设置')}</span>${groupSettingsChevron()}</button>`;
        const me = group.members.find(member => member.id === USER_ID);
        panel('聊天信息', `<form id="wcGroupSettingsForm" class="wc-group-settings-form">
            <div id="wcGroupSettingsMainView">
            <div id="wcGroupSettings_overview">
            <div class="wc-group-settings-hero">
                <button type="button" class="wc-group-settings-avatar-picker" id="wcGroupSettingsAvatarButton" aria-label="更换群头像" ${manageable ? '' : 'disabled'}><span id="wcGroupSettingsAvatar" class="wc-group-settings-avatar-circle"></span></button>
                <strong>${escape(group.name)}</strong><span>${group.mode === 'observe' ? '旁观群聊' : '参与群聊'} · ${group.members.length} 位成员</span>
            </div>
            <div class="wc-group-info-card wc-group-members-card">
                <div class="wc-group-info-card-heading"><strong>群成员</strong><span>${group.members.length} 人</span></div>
                <div class="wc-group-member-grid">
                ${group.members.map(member => `<button type="button" class="wc-group-member-tile" data-member="${escape(member.id)}"><span class="wc-group-member-photo-slot" data-group-member-avatar="${escape(member.id)}"></span><span class="wc-group-member-tile-name">${escape(memberName(member))}</span></button>`).join('')}
                ${manageable ? `<button type="button" class="wc-group-member-tile wc-group-member-add" id="wcGroupAddMembers"><span class="wc-group-add-mark" aria-hidden="true">${GROUP_ICON_MARKUP.plus}</span><span class="wc-group-member-tile-name">邀请</span></button><button type="button" class="wc-group-member-tile wc-group-member-add" id="wcGroupRemoveMembers"><span class="wc-group-add-mark wc-group-remove-mark" aria-hidden="true">−</span><span class="wc-group-member-tile-name">移除</span></button>` : ''}
                </div>
            </div>
            <div class="wc-group-info-card">
                ${summaryRow('wcGroupEditProfile', '群名称', group.name)}
                ${summaryRow('wcGroupEditDescription', '群简介', group.description)}
                ${summaryRow('wcGroupEditAnnouncement', '群公告', group.announcement, true)}
                ${summaryRow('wcGroupManage', '管理群', '对话、成员与更多设置')}
            </div>
            <div class="wc-group-info-card wc-group-apps-card">
                <div class="wc-group-info-card-heading"><strong>群应用</strong></div>
                <div class="wc-group-app-grid">
                    <button type="button" id="wcGroupFiles"><span class="wc-group-setting-icon" aria-hidden="true"><svg viewBox="0 0 24 24" fill="currentColor"><path d="M20 18H4V8h16v10zm0-12H11L9 4H4C2.9 4 2 4.9 2 6v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V8c0-1.1-.9-2-2-2z"/></svg></span><span>文件</span></button>
                    <button type="button" id="wcGroupPhotos">${groupSettingsIcon('photo')}<span>相册</span></button>
                    <button type="button" id="wcGroupEssence">${groupSettingsIcon('star')}<span>精华消息</span></button>
                </div>
            </div>
            <div class="wc-group-info-card">${summaryRow('wcGroupSearchHistory', '查找聊天记录', '消息、图片、文件等')}</div>
            <div class="wc-group-info-card">
                ${toggle('设为置顶', 'isPinned', group.isPinned, '', 'pin')}
                ${toggle('消息免打扰', 'muted', group.muted, '', 'bell-off')}
            </div>
            <div class="wc-group-info-card">
                ${me ? summaryRow('wcGroupMyNickname', '我在本群的昵称', me.nickname || me.name) : ''}
                ${summaryRow('wcGroupPersonalize', '个性设置', '主题、气泡与聊天背景')}
            </div>
            <div class="wc-group-info-card wc-group-overview-actions">${action('wcGroupClearHistory', '删除聊天记录', 'trash')}</div>
            ${group.mode === 'participate' ? `<div class="wc-group-info-card wc-group-overview-actions">${action('wcGroupLeave', '退出群聊', 'leave', true)}</div>` : ''}
            </div>
            <div id="wcGroupSettings_profile" hidden>
                <div class="wc-group-section-title">群资料</div><div class="wc-group-setting-card wc-group-setting-fields">
                    ${field('群名称', 'name', group.name)}${field('群简介', 'description', group.description, true)}
                </div>
            </div>
            <div id="wcGroupSettings_announcement" hidden>
                <div class="wc-group-section-title">群公告</div><div class="wc-group-setting-card wc-group-setting-fields">
                    ${field('群公告', 'announcement', group.announcement, true)}
                    ${toggle('置顶群公告', 'announcementPinned', group.announcementPinned !== false, '', 'speakerphone')}
                </div>
            </div>
            <div id="wcGroupSettings_management" hidden>
            <div class="wc-group-section-title">连接与用量</div>
            <div class="wc-group-setting-card">
                ${action('wcGroupApiSettings', '本群 API · ' + escape(wcChatApiLabel(group.apiConfig)), 'plug')}
                ${action('wcGroupTokenQuery', 'Token 占用查询', 'token')}
            </div>
            <div class="wc-group-setting-card">
                <button type="button" class="wc-group-row" id="wcGroupWorldbookBinding">
                    ${groupSettingsIcon('book')}
                    <span class="wc-group-action-label wc-group-toggle-copy"><strong>世界书绑定</strong><small id="wcGroupWorldbookSubtitle">正在读取世界书…</small></span>
                    ${groupSettingsChevron()}
                </button>
            </div>
            <div class="wc-group-section-title">成员与显示</div><div class="wc-group-setting-card">
                ${toggle('显示成员头衔', 'showTitles', group.showTitles !== false, '', 'award')}
                ${toggle('允许新成员查看历史', 'historyVisible', group.historyVisible, '入群前的聊天记录', 'history')}
            </div>
            <div class="wc-group-section-title">对话规则</div>
            <div class="wc-group-setting-card wc-group-setting-fields">
                ${field('群背景与成员关系', 'background', group.background, true)}
                <label class="wc-group-field"><span>发言模式</span><select name="speakerMode"><option value="natural" ${group.speakerMode !== 'all' ? 'selected' : ''}>自然群聊 · 角色可不接话</option><option value="all" ${group.speakerMode === 'all' ? 'selected' : ''}>全员轮流 · 每人至少发言</option></select></label>
                <p class="wc-group-hint">自然群聊会根据提及、公开关系与话题选择发言人，角色也可以保持沉默。指定发言不受影响。</p>
                <label class="wc-group-field"><span>自动聊轮数（1～20）</span><input name="autoRounds" type="number" min="1" max="20" value="${group.autoRounds}"></label>
                ${toggle('全员禁言', 'muteAll', group.muteAll, '群主与管理员不受影响', 'volume-off')}
            </div>
            <div class="wc-group-section-title">记忆与联动</div>
            <p class="wc-group-settings-section-note">群聊总结、私聊记忆引用与跨应用主动消息</p>
            <div class="wc-group-setting-card wc-group-setting-fields">
                <label class="wc-group-field"><span>群聊总结触发条数（1～500）</span><input name="summaryInterval" type="number" inputmode="numeric" min="1" max="500" value="${group.summaryInterval || 50}"></label>
                <p class="wc-group-hint">默认每 50 条有效群消息整理一次，归入本群独立系统记忆；额外消耗一次摘要 API。已完成总结 ${(group.summaryChunks || []).length} 段。</p>
                ${toggle('私聊共同经历可供群成员本人参考', 'allowPrivateHistoryInGroup', group.allowPrivateHistoryInGroup === true, '默认关闭；仅向对应角色提供其与用户的近期私聊，不直接公开给其他成员', 'chat-private')}
                ${toggle('允许群聊事件触发角色主动私聊', 'groupPrivateTriggerEnabled', group.groupPrivateTriggerEnabled === true, '默认关闭；需角色已开启主动消息，避免频繁额外调用', 'message-circle')}
            </div>
            <div class="wc-group-section-title">日常互动</div>
            <div class="wc-group-setting-card">
                ${toggle('角色发语音', 'characterVoice', characterActionAllowed(group, 'voice'), '', 'voice')}
                ${toggle('角色发图片', 'characterImage', characterActionAllowed(group, 'image'), '默认文字模拟，可查看画面描述', 'photo')}
                ${toggle('角色发表情包', 'characterSticker', characterActionAllowed(group, 'sticker'), '', 'sticker')}
                ${toggle('角色拍一拍', 'characterNudge', characterActionAllowed(group, 'nudge'), '', 'nudge')}
                ${toggle('角色贴表情回应', 'characterReaction', characterActionAllowed(group, 'reaction'), '', 'reaction')}
                ${toggle('角色主动撤回', 'characterRecall', characterActionAllowed(group, 'recall'), '', 'recall')}
            </div>
            <div class="wc-group-section-title">活动发起</div>
            <p class="wc-group-settings-section-note">控制角色是否主动创建群内活动</p>
            <div class="wc-group-setting-card">
                ${toggle('角色自主发红包', 'characterCreateRedPacket', group.characterActions?.createRedPacket === true, '纯娱乐，默认关闭', 'red-packet')}
                ${toggle('角色自主发起投票', 'characterCreatePoll', group.characterActions?.createPoll === true, '默认关闭', 'poll')}
                ${toggle('角色自主发起接龙', 'characterCreateRelay', group.characterActions?.createRelay === true, '默认关闭', 'relay')}
                ${toggle('角色自主发起游戏', 'characterCreateGame', characterActionAllowed(group, 'createGame'), '默认开启；只发起对局卡片，点击快进才推进游戏', 'gamepad')}
            </div>
            <div class="wc-group-section-title">活动参与</div>
            <p class="wc-group-settings-section-note">控制角色是否参与群内其他成员发起的活动</p>
            <div class="wc-group-setting-card">
                ${toggle('角色领取红包', 'characterClaimRedPacket', group.characterActions?.claimRedPacket !== false, '不产生实际交易', 'red-packet-claim')}
                ${toggle('角色参与投票', 'characterVotePoll', characterActionAllowed(group, 'votePoll'), '', 'poll-vote')}
                ${toggle('角色参与接龙', 'characterJoinRelay', characterActionAllowed(group, 'joinRelay'), '', 'relay-join')}
            </div>

            ${manageable ? `<div class="wc-group-section-title">管理操作</div><div class="wc-group-setting-card wc-group-setting-actions">${action('wcGroupDissolve', '解散群聊', 'trash', true)}</div>` : ''}
            </div>
            </div>
            <div class="wc-wb-binding-view" id="wcGroupWorldbookView" hidden>
                <div class="wc-wb-binding-scroll">
                    <div class="wc-wb-page-note">只影响当前群聊，不修改角色在其他聊天中的世界书绑定。</div>
                    <div class="wc-wb-master-card">
                        <div class="wc-wb-master-copy">
                            <div class="wc-wb-master-title">继承角色世界书</div>
                            <div class="wc-wb-master-desc" id="wcGroupWorldbookModeHint"></div>
                        </div>
                        <input type="checkbox" id="wcGroupInheritWorldbooks" name="inheritMemberWorldbooks" hidden ${group.inheritMemberWorldbooks !== false ? 'checked' : ''}>
                        <button type="button" class="wc-ios-switch" id="wcGroupWorldbookInheritToggle" role="switch" ${manageable ? '' : 'disabled'} aria-label="继承角色世界书"></button>
                    </div>
                    <div class="wc-wb-store-card">
                        <div class="wc-wb-store-card-head">
                            <div>
                                <div class="wc-wb-store-card-kicker">WORLD BOOK</div>
                                <div class="wc-wb-store-card-title">绑定世界书</div>
                                <div class="wc-wb-store-card-desc">展开查看词条，勾选本群需要读取的整本世界书</div>
                            </div>
                            <div class="wc-wb-store-stat" id="wcGroupWorldbookSummary"></div>
                        </div>
                        <div class="wc-wb-store-tree" id="wcGroupWorldbookOptions"><div class="wc-wb-store-empty">正在读取世界书…</div></div>
                        <div class="wc-wb-store-tip">本群绑定供成员共同参考，关键词与插入规则照常生效。选择后点击右上角保存。</div>
                    </div>
                    <div id="wcGroupWorldbookValues"></div>
                </div>
            </div>
        </form>`, 'settings');
        el('wcGroupSettingsAvatar').replaceChildren(groupAvatar(group));
        el('wcGroupPanelBody').querySelectorAll('[data-group-member-avatar]').forEach(slot => {
            const member = group.members.find(item => item.id === slot.dataset.groupMemberAvatar);
            if (member) slot.replaceChildren(avatarNode(member.avatar, memberName(member), 'wc-group-member-grid-photo'));
        });
        el('wcGroupSettingsAvatarButton').onclick = () => {
            if (!manageable) return;
            openAvatarSourceMenu(el('wcGroupSettingsAvatarButton'), value => {
                selectedAvatar = value;
                el('wcGroupSettingsAvatar').replaceChildren(groupAvatar({ ...group, avatar: value }));
            }, selectedAvatar);
        };
        const form = el('wcGroupSettingsForm');
        el('wcGroupPanel').dataset.settingsSection = 'overview';
        const openSection = (id, section) => { if (el(id)) el(id).onclick = () => showGroupSettingsSection(section); };
        openSection('wcGroupEditProfile', 'profile'); openSection('wcGroupEditDescription', 'profile');
        openSection('wcGroupEditAnnouncement', 'announcement'); openSection('wcGroupManage', 'management');
        const openInfoPanel = callback => { callback(); el('wcGroupPanel').dataset.returnToGroupSettings = '1'; };
        el('wcGroupFiles').onclick = () => openInfoPanel(() => groupMediaPanel('files'));
        el('wcGroupPhotos').onclick = () => openInfoPanel(() => groupMediaPanel('photos'));
        el('wcGroupEssence').onclick = () => openInfoPanel(() => searchPanel(true));
        el('wcGroupSearchHistory').onclick = () => openInfoPanel(() => searchPanel());
        el('wcGroupPersonalize').onclick = () => openInfoPanel(beautify);
        if (el('wcGroupMyNickname')) el('wcGroupMyNickname').onclick = () => memberPanel(USER_ID, true);
        if (el('wcGroupRemoveMembers')) el('wcGroupRemoveMembers').onclick = removeMembersPanel;
        el('wcGroupClearHistory').onclick = () => destructive('clear').catch(report);
        const settingsEpoch = epoch;
        const selectedBooks = new Set((group.worldbookGroupIds || []).map(String));
        const inheritInput = el('wcGroupInheritWorldbooks');
        inheritInput.checked = group.inheritMemberWorldbooks !== false;
        const refreshWorldbookMode = () => {
            const enabled = inheritInput.checked;
            const control = el('wcGroupWorldbookInheritToggle');
            control.classList.toggle('active', enabled);
            control.setAttribute('aria-checked', String(enabled));
            control.style.backgroundColor = enabled ? '#333333' : '#A1A1AA';
            el('wcGroupWorldbookModeHint').textContent = enabled
                ? '读取角色原绑定，并叠加本群选择' : '只读取本群选择和全局世界书';
            el('wcGroupWorldbookSubtitle').textContent = (enabled ? '继承角色绑定' : '本群专属') +
                (selectedBooks.size ? ` · 已绑定 ${selectedBooks.size} 本` : ' · 未额外绑定');
        };
        refreshWorldbookMode();
        el('wcGroupWorldbookBinding').onclick = () => showGroupWorldbookBinding(true);
        el('wcGroupWorldbookInheritToggle').onclick = () => {
            if (!manageable) return;
            inheritInput.checked = !inheritInput.checked;
            refreshWorldbookMode();
        };
        void Promise.resolve(window.worldbookDataReady).then(() => {
            if (settingsEpoch !== epoch || account !== currentAccount() || active() !== group || el('wcGroupSettingsForm') !== form) return;
            const container = el('wcGroupWorldbookOptions');
            if (!container) return;
            const data = typeof wcGetWorldbookRuntimeData === 'function' ? wcGetWorldbookRuntimeData() : null;
            if (!data) throw new Error('世界书数据尚未准备好');
            const books = new Map(data.groups.map(book => [String(book.id), book]));
            selectedBooks.forEach(id => { if (!books.has(id)) books.set(id, { id, name: '已失效的世界书' }); });
            const expanded = new Set(books.keys());
            const renderBooks = () => {
                el('wcGroupWorldbookValues').innerHTML = '<input type="hidden" name="worldbookBindingsReady" value="1">' +
                    [...selectedBooks].map(id => `<input type="hidden" name="worldbookGroupIds" value="${escape(id)}">`).join('');
                const entryCount = data.entries.filter(entry => selectedBooks.has(String(entry.groupId || ''))).length;
                el('wcGroupWorldbookSummary').textContent = `已选择 ${selectedBooks.size} 本 · ${entryCount} 条`;
                refreshWorldbookMode();
                container.innerHTML = [...books].map(([id, book]) => {
                    const entries = data.entries.filter(entry => String(entry.groupId || '') === id);
                    return `<div class="store-wb-tree-group${expanded.has(id) ? ' expanded' : ''}">
                        <div class="store-wb-tree-head" data-worldbook-expand="${escape(id)}" role="button" tabindex="0" aria-expanded="${expanded.has(id)}">
                            <div class="store-wb-head-left">
                                <div class="store-wb-play-arrow"><svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M7.5 4.8C6.5 4.2 5.2 4.9 5.2 6.1v11.8c0 1.2 1.3 1.9 2.3 1.3l9.8-5.9c1-.6 1-2 0-2.6L7.5 4.8z"/></svg></div>
                                <svg class="store-wb-folder-icon" viewBox="0 0 24 24" aria-hidden="true"><path d="M20 18H4V8h16v10zm0-12H11L9 4H4C2.9 4 2 4.9 2 6v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V8c0-1.1-.9-2-2-2z"/></svg>
                                <span class="store-wb-group-title">${escape(book.name || '未命名世界书')} (${entries.length})</span>
                            </div>
                            <button type="button" class="store-wb-sq-checkbox${selectedBooks.has(id) ? ' checked' : ''}" data-worldbook-select="${escape(id)}" role="checkbox" aria-checked="${selectedBooks.has(id)}" aria-label="绑定${escape(book.name || '世界书')}" ${manageable ? '' : 'disabled'}><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 13l4 4L19 7" stroke="#fff" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" fill="none"/></svg></button>
                        </div>
                        <div class="store-wb-tree-body"><div class="store-wb-tree-line"></div><div class="store-wb-branch-list">
                            ${entries.map(entry => `<div class="store-wb-tree-item wc-group-worldbook-preview"><div class="store-wb-item-meta"><div class="store-wb-item-name">${escape(entry.title || '未命名条目')}</div><div class="store-wb-item-keys">${escape(entry.isGlobal ? '全局 · ' : '')}${escape(entry.key ? '触发词: ' + entry.key : '无触发词')}</div></div></div>`).join('') || '<div class="store-wb-item-keys">暂无可用词条</div>'}
                        </div></div>
                    </div>`;
                }).join('') || '<div class="wc-wb-store-empty">世界书暂无可用条目，请先在世界书 App 中创建。</div>';
                container.querySelectorAll('[data-worldbook-expand]').forEach(header => {
                    const expand = () => {
                        const id = header.dataset.worldbookExpand;
                        if (expanded.has(id)) expanded.delete(id); else expanded.add(id);
                        renderBooks();
                    };
                    header.onclick = expand;
                    header.onkeydown = event => {
                        if (event.target !== header) return;
                        if (event.key === 'Enter' || event.key === ' ') { event.preventDefault(); expand(); }
                    };
                });
                container.querySelectorAll('[data-worldbook-select]').forEach(button => button.onclick = event => {
                    event.stopPropagation();
                    if (!manageable) return;
                    const id = button.dataset.worldbookSelect;
                    if (selectedBooks.has(id)) selectedBooks.delete(id); else selectedBooks.add(id);
                    renderBooks();
                });
            };
            renderBooks();
        }).catch(error => {
            if (settingsEpoch !== epoch || account !== currentAccount() || el('wcGroupSettingsForm') !== form) return;
            const container = el('wcGroupWorldbookOptions');
            if (container) container.textContent = '世界书读取失败，请重新打开群设置。';
            console.warn('Group worldbook settings load failed:', error);
        });
        el('wcGroupApiSettings').onclick = () => {
            const token = epoch;
            wcOpenChatApiEditor('群聊 API', group.apiConfig, async config => {
                if (token !== epoch || groupById(group.id) !== group || active() !== group) throw new Error('群聊已切换，请重新打开设置');
                const previous = group.apiConfig;
                group.apiConfig = config;
                try { await save(group); }
                catch (error) { group.apiConfig = previous; throw error; }
                el('wcGroupApiSettings')?.querySelector('.wc-group-action-label')?.replaceChildren('本群 API · ' + wcChatApiLabel(config));
            });
        };
        el('wcGroupTokenQuery').onclick = () => {
            if (typeof wcOpenGroupTokenModal !== 'function') { toast('Token 查询暂不可用'); return; }
            void wcOpenGroupTokenModal(clone(group), clone(rows(group))).catch(report);
        };
        if (!manageable) form.querySelectorAll('input,textarea,select').forEach(input => { if (!['isPinned', 'muted', 'showTitles'].includes(input.name)) input.disabled = true; });
        form.onsubmit = event => { event.preventDefault(); saveSettings(event.currentTarget, group, selectedAvatar).catch(report); };
        el('wcGroupPanelBody').querySelectorAll('[data-member]').forEach(button => button.onclick = () => memberPanel(button.dataset.member, true));
        if (el('wcGroupAddMembers')) el('wcGroupAddMembers').onclick = () => addMembers().catch(report);
        if (el('wcGroupDissolve')) el('wcGroupDissolve').onclick = () => destructive('dissolve').catch(report);
        if (el('wcGroupLeave')) el('wcGroupLeave').onclick = () => destructive('leave').catch(report);
    }

    async function saveSettings(form, group, selectedAvatar = group.avatar) {
        const token = epoch;
        const data = new FormData(form);
        const avatar = selectedAvatar;
        const previous = { ...group, announcementPinned: group.announcementPinned !== false };
        const actor = operatorName(group);
        if (canManage(group)) {
            if (token !== epoch || !groupById(group.id)) return;
            const name = String(data.get('name') || '').trim();
            if (!name) throw new Error('群名称不能为空');
            pause();
            const oldAnnouncement = String(group.announcement || '');
            group.inheritMemberWorldbooks = data.has('inheritMemberWorldbooks');
            // A pending or failed book load must not clear an existing binding.
            if (data.has('worldbookBindingsReady')) group.worldbookGroupIds = [...new Set(data.getAll('worldbookGroupIds')
                .map(id => String(id ?? '').trim()).filter(Boolean))];
            Object.assign(group, { summaryInterval: Math.max(1, Math.min(500, Math.floor(Number(data.get('summaryInterval')) || 50))), allowPrivateHistoryInGroup: data.has('allowPrivateHistoryInGroup'), groupPrivateTriggerEnabled: data.has('groupPrivateTriggerEnabled'), name, avatar, description: String(data.get('description') || '').trim(), background: String(data.get('background') || '').trim(), announcement: String(data.get('announcement') || '').trim(), announcementPinned: data.has('announcementPinned'), historyVisible: data.has('historyVisible'), muteAll: data.has('muteAll'), autoRounds: Math.max(1, Math.min(20, Number(data.get('autoRounds')) || 5)), speakerMode: data.get('speakerMode') === 'all' ? 'all' : 'natural', characterActions: { ...(group.characterActions || {}), voice: data.has('characterVoice'), image: data.has('characterImage'), sticker: data.has('characterSticker'), nudge: data.has('characterNudge'), reaction: data.has('characterReaction'), recall: data.has('characterRecall'), createRedPacket: data.has('characterCreateRedPacket'), claimRedPacket: data.has('characterClaimRedPacket'), createPoll: data.has('characterCreatePoll'), createRelay: data.has('characterCreateRelay'), createGame: data.has('characterCreateGame'), votePoll: data.has('characterVotePoll'), joinRelay: data.has('characterJoinRelay') } });
            if (group.announcement !== oldAnnouncement) publicMessage(group, 'system', group.announcement ? `群公告更新：${group.announcement}` : '群公告已清空');
            if (group.name !== previous.name) operationNotice(group, `${actor}将群名称改为“${group.name}”`);
            if (group.avatar !== previous.avatar) operationNotice(group, `${actor}更换了群头像`);
            if (group.description !== String(previous.description || '')) operationNotice(group, `${actor}${group.description ? '更新' : '清空'}了群简介`);
            if (group.background !== String(previous.background || '')) operationNotice(group, '你更新了群聊背景设定', false);
            settingNotices(group, previous, [
                ['muteAll', `${actor}开启了全员禁言`, `${actor}关闭了全员禁言`],
                ['historyVisible', `${actor}允许新成员查看入群前的记录`, `${actor}设置新成员仅能查看入群后的记录`],
                ['announcementPinned', `${actor}置顶了群公告`, `${actor}取消了群公告置顶`]
            ]);
            if (group.autoRounds !== previous.autoRounds) operationNotice(group, `你将自动群聊轮数设为 ${group.autoRounds} 轮`, false);
            if (group.speakerMode !== previous.speakerMode) operationNotice(group, `你将发言模式设为${group.speakerMode === 'all' ? '全员轮流' : '自然群聊'}`, false);
        }
        group.showTitles = data.has('showTitles');
        group.isPinned = data.has('isPinned');
        group.muted = data.has('muted');
        settingNotices(group, previous, [
            ['showTitles', '你开启了成员头衔显示', '你关闭了成员头衔显示'],
            ['isPinned', '你置顶了此群聊', '你取消了群聊置顶'],
            ['muted', '你开启了消息免打扰', '你关闭了消息免打扰']
        ], false);
        await save(group);
        if (token !== epoch) return;
        closePanel(); render(false); wcRenderChatList(); toast('群设置已保存');
        void maybeSummarizeGroup(group);
    }

    async function destructive(action) {
        const group = active();
        if (!group) return;
        const token = epoch;
        if (action === 'dissolve' && !canManage(group)) return;
        if (action === 'dissolve' && rows(group).some(message => message.activity?.funding === 'wallet' &&
            redPacketState(message.activity).remainingCents > 0 && !message.activity.refundSettled)) {
            return toast('群里还有未领完的零钱红包，请等待到期退款后再解散');
        }
        const labels = { clear: '清空聊天记录', dissolve: '解散群聊', leave: '退出群聊' };
        if (!await showCustomConfirm(labels[action], action === 'leave' ? '退出后不再显示此群。你是群主时，群主会转交给一位角色。' : `${labels[action]}后无法撤销，确定继续？`, '确认', true)) return;
        if (token !== epoch) return;
        pause();
        if (action === 'clear') {
            if (rows(group).some(activityMustStay)) return toast('包含已结算红包或已参与活动，无法直接清空聊天记录');
            invalidateGroupSummarySources(group, rows(group).map(item => item.id));
            conversations[group.id] = []; group.memberMemories = {}; group.summaryChunks = []; group.summaryCursor = group.sequence; replyId = ''; publicMessage(group, 'system', '聊天记录已清空');
        }
        if (action === 'leave') {
            const user = group.members.find(member => member.id === USER_ID);
            group.members = group.members.filter(member => member.id !== USER_ID);
            if (user?.role === 'owner' && group.members.length) {
                group.members[0].role = 'owner';
                operationNotice(group, `${memberName(user)}将群主转交给了${memberName(group.members[0])}`);
            }
            publicMessage(group, 'system', `${memberName(user)}退出了群聊`);
            group.archived = true;
        }
        if (action === 'dissolve') {
            groups = groups.filter(item => item !== group);
            conversations[group.id] = [];
        }
        await save(group, { allowRemoved: action === 'dissolve' });
        if (token !== epoch) return;
        if (action === 'dissolve') {
            const tx = db.transaction([storeName], 'readwrite');
            const done = transactionDone(tx);
            (window.CharacterRecordCleanup?.wrap(tx.objectStore(storeName)) || tx.objectStore(storeName)).delete(messageKey(account, group.id));
            await done;
        }
        closePanel();
        if (action === 'clear') render(); else close();
        wcRenderChatList();
    }

    function backupSnapshot() { return { schemaVersion: 1, groups: clone(groups), conversations: clone(conversations) }; }

    function writeBackup(store, snapshot, owner) {
        if (!snapshot || !Array.isArray(snapshot.groups)) throw new Error('群聊备份格式错误');
        const imported = snapshot.groups.map(normalizeGroup).filter(Boolean);
        const keep = new Set(imported.map(group => messageKey(owner, group.id)));
        const cursorRequest = store.openCursor();
        cursorRequest.onsuccess = () => {
            const cursor = cursorRequest.result;
            if (!cursor) return;
            if (String(cursor.key).startsWith(`${MESSAGE_PREFIX}${owner}::`) && !keep.has(String(cursor.key))) cursor.delete();
            cursor.continue();
        };
        store.put({ id: `${GROUP_PREFIX}${owner}`, schemaVersion: 1, groups: imported });
        imported.forEach(group => store.put({ id: messageKey(owner, group.id), groupId: group.id, messages: Array.isArray(snapshot.conversations?.[group.id]) ? snapshot.conversations[group.id] : [] }));
    }

    function deleteAccountRecords(store, owner) {
        stopAll();
        store.delete(`${GROUP_PREFIX}${owner}`);
        const request = store.openCursor();
        request.onsuccess = () => { const cursor = request.result; if (!cursor) return; if (String(cursor.key).startsWith(`${MESSAGE_PREFIX}${owner}::`)) cursor.delete(); cursor.continue(); };
    }

    async function accountBytes(owner) {
        const record = await wcReadLayoutRecord(`${GROUP_PREFIX}${owner}`);
        if (!record) return 0;
        const encoder = new TextEncoder();
        const size = value => encoder.encode(JSON.stringify(value || {})).byteLength;
        const records = await Promise.all((record.groups || []).map(group => wcReadLayoutRecord(messageKey(owner, group.id))));
        return records.reduce((total, value) => total + size(value), size(record));
    }

    function bindGroupInputMentionHold(input) {
        let timer = null, down = null, triggered = false;
        const cancel = () => { if (timer !== null) clearTimeout(timer); timer = null; down = null; };
        input.addEventListener('pointerdown', event => {
            if (event.button !== 0 || event.pointerType === 'mouse') return;
            cancel();
            triggered = false;
            down = { x: event.clientX, y: event.clientY };
            timer = setTimeout(() => {
                timer = null;
                if (!down) return;
                triggered = true;
                mentionPanel();
            }, 560);
        });
        input.addEventListener('pointermove', event => {
            if (down && (Math.abs(event.clientX - down.x) > 10 || Math.abs(event.clientY - down.y) > 10)) cancel();
        });
        ['pointerup', 'pointercancel', 'pointerleave'].forEach(type => input.addEventListener(type, cancel));
        input.addEventListener('contextmenu', event => {
            if (active()?.mode !== 'participate') return;
            event.preventDefault();
            cancel();
            if (!triggered) mentionPanel();
            triggered = true;
        });
    }

    function init() {
        const speakerSheet = el('wcGroupSpeakerSheet');
        speakerSheet.addEventListener('click', event => {
            if (event.target === speakerSheet) closeSpeakerPanel();
        });
        el('wcGroupSpeakerCancel').onclick = closeSpeakerPanel;
        el('wcGroupSpeakerSearch').addEventListener('input', filterSpeakerPanel);
        el('wcGroupSpeakerSearch').addEventListener('keydown', event => {
            if (event.key === 'Enter') event.preventDefault();
        });
        el('wcGroupSpeakerList').addEventListener('click', event => {
            const button = event.target.closest('[data-speaker]');
            const group = active();
            if (!button || button.disabled || speakerSheet.hidden || !group ||
                speakerSheet.dataset.groupId !== group.id || requests.has(group.id)) return;
            const member = group.members.find(item => String(item.id) === button.dataset.speaker && item.id !== USER_ID);
            if (!member || !canSpeak(group, member)) {
                toast('该成员当前无法发言');
                return;
            }
            const id = member.id;
            closeSpeakerPanel();
            generate(id).catch(report);
        });
        el('wcGroupReplyOverlay').onclick = cancelReply;
        bindGroupInputMentionHold(el('wcGroupInput'));
        el('wcGroupInput').addEventListener('input', () => { syncMentions(); scheduleGroupGameBot(); });
        el('wcGroupInput').onkeydown = event => {
            if (event.key === 'Enter' && !event.shiftKey && !event.isComposing) { event.preventDefault(); submitComposer().catch(report); }
        };
        el('wcGroupSend').onclick = () => submitComposer().catch(report);
        el('wcGroupEmojiToggle').onclick = toggleEmojiPanel;
        // The group message editor deliberately uses its own state and message store,
        // while sharing the single-chat editor's visual components.
        const editOverlay = el('wcGroupEditMsgOverlay');
        editOverlay.addEventListener('click', event => {
            if (event.target === editOverlay) closeGroupMessageEditor();
        });
        el('wcGroupEditMsgRoles').addEventListener('click', event => {
            const button = event.target.closest('[data-role]');
            if (button && !button.disabled) setGroupEditRole(button.dataset.role);
        });
        el('wcGroupEditMsgFormats').addEventListener('click', event => {
            const button = event.target.closest('[data-format]');
            if (button && !button.disabled) setGroupEditFormat(button.dataset.format);
        });
        el('wcGroupEditMsgRepair').onclick = repairGroupEditFormat;
        el('wcGroupEditMsgCancel').onclick = closeGroupMessageEditor;
        el('wcGroupEditMsgSave').onclick = () => saveGroupMessageEditor().catch(report);
        el('wcGroupEmojiCancel').onclick = () => {
            emojiSearching = false;
            el('wcGroupEmojiSearchInput').value = '';
            renderGroupEmojiPanel();
        };
        el('wcGroupEmojiSearchInput').addEventListener('input', renderGroupEmojiContent);
        el('wcGroupEmojiSearchInput').addEventListener('keydown', event => {
            if (event.key === 'Enter') { event.preventDefault(); event.stopPropagation(); }
        });
        el('wcGroupBubbleMenuOverlay').addEventListener('click', event => {
            const reaction = event.target.closest('[data-group-reaction]');
            const action = event.target.closest('[data-group-menu-action]');
            if (reaction) {
                event.stopPropagation();
                reactToMessage(bubbleMenuMessageId, reaction.dataset.groupReaction).catch(report);
            } else if (action) {
                event.stopPropagation();
                messageAction(action.dataset.groupMenuAction).catch(report);
            } else if (event.target.closest('#wcGroupBubbleExpand')) {
                event.stopPropagation();
                toggleBubbleReactions(true);
            } else if (event.target.closest('#wcGroupBubbleCollapse')) {
                event.stopPropagation();
                toggleBubbleReactions(false);
            } else if (event.target === el('wcGroupBubbleMenuOverlay')) {
                closeBubbleMenu();
            }
        });
        bindAvatarSourceMenu();
        el('wcGroupContinue').onclick = () => requests.has(activeId) ? pause() : generate().catch(report);
        el('wcGroupAuto').onclick = () => auto().catch(report);
        el('wcGroupMoreToggle').onclick = toggleMorePanel;
        el('wcGroupVoiceButton').onclick = openGroupVoiceComposer;
        el('wcGroupImageButton').onclick = openGroupImageComposer;
        el('wcGroupPhotoButton').onclick = pickGroupImages;
        el('wcGroupImageInput').addEventListener('change', event => uploadGroupImages(event).catch(report));
        el('wcGroupMorePanel').addEventListener('click', event => {
            if (event.target.closest('button')) closeMorePanel();
        });
        el('wcGroupMessages').addEventListener('click', () => { closeMorePanel(); closeEmojiPanel(); });
        el('wcGroupBatchCancel').onclick = exitGroupSelection;
        el('wcGroupBatchDebug').onclick = debugSelectedGroupMessage;
        el('wcGroupBatchForward').onclick = forwardSelectedGroupMessages;
        el('wcGroupBatchDelete').onclick = () => deleteGroupMessages([...selectedGroupMessages]).catch(report);
        document.addEventListener('pointerdown', event => {
            const more = el('wcGroupMorePanel');
            const trigger = el('wcGroupMoreToggle');
            if (!more?.classList.contains('show') || more.contains(event.target) || trigger?.contains(event.target)) return;
            closeMorePanel();
        });
        document.addEventListener('keydown', event => {
            if (event.key === 'Escape') {
                if (!el('wcGroupSpeakerSheet')?.hidden) { event.preventDefault(); closeSpeakerPanel(); return; }
                if (el('wcGroupMorePanel')?.classList.contains('show')) closeMorePanel();
                closeEmojiPanel();
                closeBubbleMenu();
                closeGroupMessageEditor();
                if (groupSelectionMode) exitGroupSelection();
            }
        });
        const activityGrid = el('wcGroupMorePanel')?.querySelector('.wc-function-grid');
        // Activity buttons sit between the speaker button and the guide button (see wechat-template.js).
        const activityAnchor = el('wcGroupGuide')?.parentNode === activityGrid ? el('wcGroupGuide') : null;
        if (activityGrid && !el('wcGroupCreatePollButton')) {
            for (const spec of [
                { id: 'wcGroupCreateRedPacketButton', title: '群红包', icon: 'red-packet', kind: 'redpacket' },
                { id: 'wcGroupCreatePollButton', title: '群投票', icon: 'poll', kind: 'poll' },
                { id: 'wcGroupCreateRelayButton', title: '群接龙', icon: 'relay', kind: 'relay' }
            ]) {
                const button = document.createElement('button');
                button.type = 'button';
                button.id = spec.id;
                button.className = 'wc-function-item wc-group-more-item';
                button.innerHTML = '<span class="wc-function-icon">' + GROUP_ICON_MARKUP[spec.icon] +
                    '</span><span class="wc-function-text">' + spec.title + '</span>';
                button.onclick = () => spec.kind === 'redpacket' ? createRedPacketPanel() : createActivityPanel(spec.kind);
                activityGrid.insertBefore(button, activityAnchor);
            }
        }
        if (activityGrid && !el('wcGroupGamesButton') && window.WcGroupGames) {
            const button = document.createElement('button');
            button.type = 'button';button.id='wcGroupGamesButton';
            button.className='wc-function-item wc-group-more-item';
            button.innerHTML='<span class="wc-function-icon">' + GROUP_ICON_MARKUP.gamepad +
                '</span><span class="wc-function-text">玩游戏</span>';
            button.onclick=createGamePanel;
            activityGrid.insertBefore(button, activityAnchor);
        }
        // Keep generation, media, activities and conversation tools in a predictable grid order.
        if (activityGrid) {
            const orderedToolSelectors = [
                '#wcGroupContinue', 'button[onclick="WcGroupChat.regenerate()"]',
                '#wcGroupVoiceButton', '#wcGroupImageButton', '#wcGroupPhotoButton',
                '#wcGroupCreateRedPacketButton', '#wcGroupCreatePollButton', '#wcGroupCreateRelayButton',
                '#wcGroupAuto', 'button[onclick="WcGroupChat.speakerPanel()"]',
                '#wcGroupGuide', '#wcGroupMentionButton', '#wcGroupGamesButton',
                'button[onclick="WcGroupChat.searchPanel(true)"]'
            ];
            const orderedButtons = orderedToolSelectors.map(selector => activityGrid.querySelector(selector)).filter(Boolean);
            const remainingButtons = Array.from(activityGrid.children).filter(button => !orderedButtons.includes(button));
            for (const button of [...orderedButtons, ...remainingButtons]) activityGrid.appendChild(button);
        }

        el('wcGroupGuide').onclick = async () => {
            const group = active();
            if (!group || !canManage(group)) return;
            const token = epoch;
            const value = await showCustomPrompt('话题引导', { placeholder: '填写开场话题或群内情境', value: group.guide || '' }, '保存');
            if (value === null || token !== epoch) return;
            if (String(group.guide || '') === value.trim()) return;
            pause();
            group.guide = value.trim();
            operationNotice(group, group.guide ? '你更新了话题引导' : '你清空了话题引导', false);
            try {
                await save(group);
                if (token !== epoch || active() !== group) return;
                render(false); wcRenderChatList(); toast('话题引导已保存');
            } catch (error) { report(error); }
        };
        const groupPage = el('page-group-chat');
        el('wcGroupInput').addEventListener('focus', () => { closeEmojiPanel(); closeMorePanel(); });
        groupPage.addEventListener('click', event => {
            if (!event.target.closest('#wcGroupDropdownMenu, #wcGroupTopMenuToggle')) closeDropdown();
        });
        document.addEventListener('pointerdown', event => {
            const menu = el('wcGroupDropdownMenu');
            if (menu?.classList.contains('show') && !menu.contains(event.target) && !el('wcGroupTopMenuToggle')?.contains(event.target)) closeDropdown();
        });
        document.addEventListener('keydown', event => { if (event.key === 'Escape') closeDropdown(); });
        const app = el('wechatAppUI');
        new MutationObserver(() => { if (!app.classList.contains('show') || !el('page-group-chat').classList.contains('active')) pause(); }).observe(app, { attributes: true, attributeFilter: ['class'] });
        new MutationObserver(() => { if (!el('page-group-chat').classList.contains('active')) pause(); }).observe(el('page-group-chat'), { attributes: true, attributeFilter: ['class'] });
        document.addEventListener('visibilitychange', () => {
            if (document.hidden) pause();
            else {
                settleExpiredGroupPackets().finally(scheduleWalletRefunds);
                scheduleGroupGameBot();
            }
        });
        window.addEventListener('pagehide', stopAll);
        window.addEventListener('wechat:account-changed', () => reload().catch(report));
        window.addEventListener('contacts:characters-deleted', event => {
            if (event.detail?.recordsPurged) void reload().catch(report);
        });
        load().catch(() => {});
    }

    window.WcGroupChat = { create, open, close, settings, createGamePanel, openGroupGame, renderList, renderContacts, togglePinned, moveToGroup, load, reload, flush, backupSnapshot, writeBackup, deleteAccountRecords, accountBytes, closePanel, mentionPanel, speakerPanel, cancelReply, replyToMessage, searchPanel, regenerate, stopAll, backFromPanel, toggleDropdown, handleDropdownAction };
    if (el('page-group-chat')) init();
})();







