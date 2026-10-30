    // 微信 APP 逻辑 (已进行命名空间隔离)
    // ==========================================

    let wcDefaultAvatarSequence = 0;
    let wcMomentsSavePending = false;

    function getWcDefaultAvatarSvg() {
        const uid = `default_${++wcDefaultAvatarSequence}`;
        return `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" style="width: 100%; height: 100%; border-radius: 50%; display: block;">
            <defs>
                <clipPath id="wcClip_${uid}"><circle cx="50" cy="50" r="44"/></clipPath>
                <linearGradient id="wcBg_${uid}" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stop-color="#A3A8B0" />
                    <stop offset="100%" stop-color="#7A7F88" />
                </linearGradient>
                <linearGradient id="wcFig_${uid}" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stop-color="#FFFFFF" />
                    <stop offset="100%" stop-color="#E5E5EA" />
                </linearGradient>
            </defs>
            <circle cx="50" cy="50" r="50" fill="url(#wcBg_${uid})"/>
            <circle cx="50" cy="36" r="16" fill="url(#wcFig_${uid})"/>
            <path d="M 50 59 C 20 59 10 82 8 106 L 92 106 C 90 82 80 59 50 59 Z" fill="url(#wcFig_${uid})" clip-path="url(#wcClip_${uid})"/>
        </svg>`;
    }

    // 数据库操作：获取微信账号认证数据
    async function wcGetAuthData() {
        const data = await wcReadLayoutRecord('wechatAuthData');
        return data || { id: 'wechatAuthData', accounts: [], currentLoginWxid: null };
    }

    // 数据库操作：保存微信账号认证数据
    function wcSaveAuthData(data) {
        if (!db || typeof storeName === 'undefined') return Promise.reject(new Error('数据库尚未准备好'));
        return new Promise((resolve, reject) => {
            const transaction = db.transaction([storeName], 'readwrite');
            // 必须将 id 包含在对象内部，不能作为 put 的第二个参数
            data.id = 'wechatAuthData';
            (window.CharacterRecordCleanup?.wrap(transaction.objectStore(storeName)) || transaction.objectStore(storeName)).put(data);
            transaction.oncomplete = () => resolve(true);
            transaction.onerror = () => reject(transaction.error);
        });
    }

    // 获取当前登录账号的不可变面具ID (用于数据隔离，防止修改微信号导致数据丢失)
    function wcGetCurrentAccountId() {
        return (typeof appSettings !== 'undefined' && appSettings.wc_current_user_id) ? appSettings.wc_current_user_id : 'default';
    }

    function wcNotifyAccountChanged() {
        if (window.WcGroupChat) window.WcGroupChat.stopAll();
        const accountId = (typeof appSettings !== 'undefined' && appSettings.wc_current_user_id)
            ? String(appSettings.wc_current_user_id)
            : '';
        window.dispatchEvent(new CustomEvent('wechat:account-changed', { detail: { accountId } }));
    }

    // Chat persistence keeps the legacy account snapshot for compatibility while
    // high-frequency updates can write only the changed contact.
    let wcAccountChatSaveQueue = Promise.resolve();
    let wcFullChatSaveRequested = false;
    let wcFullChatSaveScheduled = false;

    function wcCloneChatValue(value) {
        if (typeof structuredClone === 'function') return structuredClone(value);
        return JSON.parse(JSON.stringify(value));
    }

    function wcWriteChatRecord(record) {
        return new Promise((resolve) => {
            if (window.__tonghuajiBackupRestoreInProgress) {
                resolve(false);
                return;
            }
            const transaction = db.transaction([storeName], 'readwrite');
            (window.CharacterRecordCleanup?.wrap(transaction.objectStore(storeName)) || transaction.objectStore(storeName)).put(record);
            transaction.oncomplete = () => resolve(true);
            transaction.onerror = () => resolve(false);
        });
    }

    window.wcSaveChatData = function() {
        if (window.__tonghuajiBackupRestoreInProgress
            || typeof db === 'undefined' || !db || typeof storeName === 'undefined') return Promise.resolve(false);
        wcChatDataDirty = true;
        wcChatDataHydrated = true;

        // Capture the account and snapshot together so an account switch cannot route
        // the previous account's messages into the next account's storage key.
        const accountId = wcGetCurrentAccountId();
        const snapshot = wcCloneChatValue(wcChatMessagesByContact || {});
        wcAccountChatSaveQueue = wcAccountChatSaveQueue
            .catch(() => false)
            .then(() => wcWriteChatRecord({ id: `wechatChatData_${accountId}`, messages: snapshot }));
        return wcAccountChatSaveQueue;
    };

    window.wcSaveChatContactData = function(contactId) {
        if (!contactId || window.__tonghuajiBackupRestoreInProgress
            || typeof db === 'undefined' || !db || typeof storeName === 'undefined') return Promise.resolve(false);
        wcChatDataDirty = true;
        wcChatDataHydrated = true;
        const accountId = wcGetCurrentAccountId();
        const snapshot = wcCloneChatValue(Array.isArray(wcChatMessagesByContact?.[contactId])
            ? wcChatMessagesByContact[contactId]
            : []);
        const contactIds = Object.keys(wcChatMessagesByContact || {});

        wcAccountChatSaveQueue = wcAccountChatSaveQueue
            .catch(() => false)
            .then(() => new Promise((resolve) => {
                if (window.__tonghuajiBackupRestoreInProgress) {
                    resolve(false);
                    return;
                }
                const transaction = db.transaction([storeName], 'readwrite');
                const store = (window.CharacterRecordCleanup?.wrap(transaction.objectStore(storeName)) || transaction.objectStore(storeName));
                store.put({ id: `wechatChatContactData_${accountId}_${contactId}`, messages: snapshot });
                store.put({ id: `wechatChatContactIndex_${accountId}`, contactIds });
                transaction.oncomplete = () => resolve(true);
                transaction.onerror = () => resolve(false);
            }));
        return wcAccountChatSaveQueue;
    };

    // Persist settlement and chat state together, ordered after pending chat writes.
    window.wcCommitChatContactWallet = function(contactId, walletRecord) {
        if (!contactId || !db || typeof storeName === 'undefined' || window.__tonghuajiBackupRestoreInProgress) {
            return Promise.resolve(false);
        }
        const accountId = wcGetCurrentAccountId();
        if (!walletRecord || walletRecord.id !== `wechatWalletData_${accountId}`) return Promise.resolve(false);
        const messages = wcCloneChatValue(Array.isArray(wcChatMessagesByContact?.[contactId])
            ? wcChatMessagesByContact[contactId]
            : []);
        const contactIds = Object.keys(wcChatMessagesByContact || {});
        const walletSnapshot = wcCloneChatValue(walletRecord);
        wcChatDataDirty = true;
        wcChatDataHydrated = true;
        wcAccountChatSaveQueue = wcAccountChatSaveQueue
            .catch(() => false)
            .then(() => new Promise(resolve => {
                if (window.__tonghuajiBackupRestoreInProgress) {
                    resolve(false);
                    return;
                }
                try {
                    const transaction = db.transaction([storeName], 'readwrite');
                    const store = (window.CharacterRecordCleanup?.wrap(transaction.objectStore(storeName)) || transaction.objectStore(storeName));
                    store.put({ id: `wechatChatContactData_${accountId}_${contactId}`, messages });
                    store.put({ id: `wechatChatContactIndex_${accountId}`, contactIds });
                    store.put(walletSnapshot);
                    transaction.oncomplete = () => resolve(true);
                    transaction.onabort = () => resolve(false);
                    transaction.onerror = () => resolve(false);
                } catch (error) {
                    console.error('Unable to save transfer settlement:', error);
                    resolve(false);
                }
            }));
        return wcAccountChatSaveQueue;
    };

    // Commit the response before mutating the live card or navigating to another app.
    window.wcCommitMeetingInvitation = function(contactId, messageId, decision, expectedAccountId) {
        const accountId = String(wcGetCurrentAccountId());
        if (accountId !== expectedAccountId || !['accept', 'reject'].includes(decision)) return Promise.resolve(false);
        wcAccountChatSaveQueue = wcAccountChatSaveQueue.catch(() => false).then(() => {
            if (accountId !== String(wcGetCurrentAccountId()) || !db || window.__tonghuajiBackupRestoreInProgress) return false;
            const list = wcChatMessagesByContact[contactId];
            const message = Array.isArray(list) ? list.find(item => String(item.id) === String(messageId)) : null;
            const invite = message?.meetingInvite;
            if (message?.type !== 'received' || message.isRecalled || !invite || invite.state !== 'pending'
                || invite.accountId !== accountId || invite.contactId !== String(contactId)
                || !wcContactsList.some(item => String(item.id) === String(contactId))) return false;
            const nextInvite = { ...invite, state: decision === 'accept' ? 'accepted' : 'rejected', resolvedAt: Date.now() };
            const nextText = window.MeetingInvitations.summary(nextInvite);
            const snapshot = wcCloneChatValue(list);
            const savedMessage = snapshot.find(item => String(item.id) === String(messageId));
            savedMessage.meetingInvite = nextInvite;
            savedMessage.text = nextText;
            return new Promise(resolve => {
                let transaction;
                const abortOnSwitch = () => { try { transaction.abort(); } catch (_) {} };
                const finish = value => { window.removeEventListener('wechat:account-changed', abortOnSwitch); resolve(value); };
                try {
                    transaction = db.transaction([storeName], 'readwrite');
                    window.addEventListener('wechat:account-changed', abortOnSwitch);
                    const store = (window.CharacterRecordCleanup?.wrap(transaction.objectStore(storeName)) || transaction.objectStore(storeName));
                    store.put({ id: `wechatChatContactData_${accountId}_${contactId}`, messages: snapshot });
                    store.put({ id: `wechatChatContactIndex_${accountId}`, contactIds: Object.keys(wcChatMessagesByContact) });
                    transaction.oncomplete = () => {
                        if (accountId === String(wcGetCurrentAccountId())) {
                            message.meetingInvite = nextInvite;
                            message.text = nextText;
                            wcChatDataDirty = true;
                            wcChatDataHydrated = true;
                            if (typeof triggerAutoLocalBackup === 'function') triggerAutoLocalBackup();
                        }
                        finish(true);
                    };
                    transaction.onabort = () => finish(false);
                    transaction.onerror = () => finish(false);
                } catch (error) {
                    try { transaction?.abort(); } catch (_) {}
                    console.warn('Unable to save meeting invitation decision:', error);
                    finish(false);
                }
            });
        });
        return wcAccountChatSaveQueue;
    };

    // Serialize invitation settlement with chat writes and commit both avatars atomically.
    window.wcCommitCoupleAvatarInvitation = function(contactId, messageId, decision, userSlot, expectedAccountId) {
        const accountId = String(wcGetCurrentAccountId());
        if (accountId !== expectedAccountId || !['accept', 'reject'].includes(decision)
            || ![0, 1].includes(userSlot) || !db || window.__tonghuajiBackupRestoreInProgress) return Promise.resolve(false);
        wcAccountChatSaveQueue = wcAccountChatSaveQueue.catch(() => false).then(async () => {
            const cachedUsers = decision === 'accept' && window.ContactsApp?.getUsers
                ? await window.ContactsApp.getUsers() : [];
            if (accountId !== String(wcGetCurrentAccountId()) || window.__tonghuajiBackupRestoreInProgress) return false;
            const message = (wcChatMessagesByContact[contactId] || []).find(item => String(item.id) === String(messageId));
            const invite = message?.coupleAvatarInvite;
            const contact = wcContactsList.find(item => String(item.id) === String(contactId));
            if (!contact || !invite || invite.state !== 'pending' || invite.accountId !== accountId
                || String(invite.contactId) !== String(contactId)) return false;
            if (decision === 'accept' && !window.PhotosCoupleAvatars?.isAvailable(invite)) return false;
            const nextInvite = { ...invite, state: decision === 'accept' ? 'accepted' : 'rejected', userSlot, resolvedAt: Date.now() };
            const nextText = '[情头邀请] ' + invite.reason + (decision === 'accept' ? '（已一起使用）' : '（暂时不用）');
            const snapshot = wcCloneChatValue(wcChatMessagesByContact);
            const savedMessage = snapshot[contactId].find(item => String(item.id) === String(messageId));
            savedMessage.coupleAvatarInvite = nextInvite;
            savedMessage.text = nextText;
            const userAvatar = invite.photos[userSlot].src;
            const charAvatar = invite.photos[1 - userSlot].src;
            const nextProfile = typeof wcMomentsProfile !== 'undefined' ? { ...wcMomentsProfile, avatar: userAvatar } : { avatar: userAvatar };
            const nextSettings = decision === 'accept' ? { ...appSettings, wc_current_user_avatar: userAvatar,
                [`wc_moments_profile_${accountId}`]: nextProfile } : null;
            const nextContacts = wcCloneChatValue(wcContactsList);
            const nextContact = nextContacts.find(item => String(item.id) === String(contactId));
            nextContact.avatar = charAvatar;
            nextContact.avatarOverride = true;
            return new Promise(resolve => {
                let transaction;
                const abortOnSwitch = () => { try { transaction.abort(); } catch (_) {} };
                const finish = value => { window.removeEventListener('wechat:account-changed', abortOnSwitch); resolve(value); };
                try {
                    transaction = db.transaction([storeName], 'readwrite');
                    window.addEventListener('wechat:account-changed', abortOnSwitch);
                    const store = (window.CharacterRecordCleanup?.wrap(transaction.objectStore(storeName)) || transaction.objectStore(storeName));
                    const writeChat = () => {
                        store.put({ id: `wechatChatContactData_${accountId}_${contactId}`, messages: snapshot[contactId] });
                        store.put({ id: `wechatChatContactIndex_${accountId}`, contactIds: Object.keys(snapshot) });
                        store.put({ id: `wechatChatData_${accountId}`, messages: snapshot });
                    };
                    if (decision === 'accept') {
                        const authRequest = store.get('wechatAuthData');
                        authRequest.onsuccess = () => {
                            const auth = authRequest.result;
                            const account = auth?.accounts?.find(item => String(item.maskId) === accountId && item.wxid === auth.currentLoginWxid);
                            if (!account || accountId !== String(wcGetCurrentAccountId())) { transaction.abort(); return; }
                            account.avatar = userAvatar;
                            store.put(auth);
                            store.put({ id: 'appSettings', data: nextSettings });
                            store.put({ id: `wechatContactsData_${accountId}`, groups: wcContactGroups, contacts: nextContacts });
                            store.put({ id: 'wechatMomentsProfileData', profile: nextProfile });
                            writeChat();
                        };
                        const sourceRequest = store.get('contactsAppData');
                        sourceRequest.onsuccess = () => {
                            const record = sourceRequest.result;
                            const user = record?.data?.users?.find(item => String(item.id) === accountId);
                            if (user) { user.avatar = userAvatar; store.put(record); }
                        };
                    } else writeChat();
                    transaction.oncomplete = () => {
                        if (accountId === String(wcGetCurrentAccountId())) {
                            message.coupleAvatarInvite = nextInvite;
                            message.text = nextText;
                            if (decision === 'accept') {
                                contact.avatar = charAvatar;
                                contact.avatarOverride = true;
                                appSettings.wc_current_user_avatar = userAvatar;
                                appSettings[`wc_moments_profile_${accountId}`] = nextProfile;
                                if (typeof wcMomentsProfile !== 'undefined') wcMomentsProfile = nextProfile;
                                const cachedUser = cachedUsers.find(item => String(item.id) === accountId);
                                if (cachedUser) cachedUser.avatar = userAvatar;
                            }
                            wcChatDataDirty = true;
                            wcChatDataHydrated = true;
                            if (typeof triggerAutoLocalBackup === 'function') triggerAutoLocalBackup();
                        }
                        finish(true);
                    };
                    transaction.onabort = () => finish(false);
                    transaction.onerror = () => finish(false);
                } catch (error) {
                    try { transaction?.abort(); } catch (_) {}
                    console.error('Unable to settle couple avatar invitation:', error);
                    finish(false);
                }
            });
        });
        return wcAccountChatSaveQueue;
    };

    function wcLoadIncrementalChatRecords(accountId) {
        return new Promise((resolve) => {
            const transaction = db.transaction([storeName], 'readonly');
            const store = (window.CharacterRecordCleanup?.wrap(transaction.objectStore(storeName)) || transaction.objectStore(storeName));
            const indexRequest = store.get(`wechatChatContactIndex_${accountId}`);
            indexRequest.onsuccess = () => {
                const contactIds = Array.isArray(indexRequest.result?.contactIds)
                    ? indexRequest.result.contactIds.filter(Boolean)
                    : [];
                if (!contactIds.length) {
                    resolve(true);
                    return;
                }
                let pending = contactIds.length;
                const finish = () => {
                    pending -= 1;
                    if (pending <= 0) resolve(true);
                };
                contactIds.forEach(contactId => {
                    const request = store.get(`wechatChatContactData_${accountId}_${contactId}`);
                    request.onsuccess = () => {
                        if (Array.isArray(request.result?.messages)) {
                            wcChatMessagesByContact[contactId] = request.result.messages;
                        }
                        finish();
                    };
                    request.onerror = finish;
                });
            };
            indexRequest.onerror = () => resolve(false);
        });
    }

    // Reload the legacy account snapshot first, then overlay incremental contact records.
    window.wcReloadChatDataFromStorage = function() {
        if (typeof db === 'undefined' || !db || typeof storeName === 'undefined') return Promise.resolve(false);
        return new Promise((resolve) => {
            const accountId = wcGetCurrentAccountId();
            const transaction = db.transaction([storeName], 'readonly');
            const store = (window.CharacterRecordCleanup?.wrap(transaction.objectStore(storeName)) || transaction.objectStore(storeName));
            const request = store.get(`wechatChatData_${accountId}`);
            const finishWithIncremental = (baseResult = true) => {
                wcLoadIncrementalChatRecords(accountId)
                    .then(() => resolve(baseResult))
                    .catch(() => resolve(baseResult));
            };
            request.onsuccess = () => {
                const applyMessages = (record) => {
                    const messages = record?.messages || record?.conversations;
                    wcChatMessagesByContact = messages && typeof messages === 'object' && !Array.isArray(messages)
                        ? messages
                        : {};
                    wcChatDataHydrated = true;
                    return messages && typeof messages === 'object' && !Array.isArray(messages);
                };
                if (applyMessages(request.result)) {
                    finishWithIncremental(true);
                    return;
                }

                const legacyRequest = store.get('wechatChatData');
                legacyRequest.onsuccess = () => {
                    if (!applyMessages(legacyRequest.result)) {
                        finishWithIncremental(true);
                        return;
                    }
                    const migrated = wcCloneChatValue(wcChatMessagesByContact);
                    const writeTransaction = db.transaction([storeName], 'readwrite');
                    (window.CharacterRecordCleanup?.wrap(writeTransaction.objectStore(storeName)) || writeTransaction.objectStore(storeName)).put({
                        id: `wechatChatData_${accountId}`,
                        messages: migrated
                    });
                    writeTransaction.oncomplete = () => finishWithIncremental(true);
                    writeTransaction.onerror = () => finishWithIncremental(true);
                };
                legacyRequest.onerror = () => {
                    wcChatMessagesByContact = {};
                    wcChatDataHydrated = true;
                    finishWithIncremental(false);
                };
            };
            request.onerror = () => {
                wcChatMessagesByContact = {};
                wcChatDataHydrated = true;
                finishWithIncremental(false);
            };
        });
    };

    // 兼容同步保存调用
    window.wcSaveContactsData = function() {
        if (typeof wcSaveContactsDataAsync === 'function') wcSaveContactsDataAsync();
    };

    let wcHydratedChatAccountId = null;

    async function openWechatApp() {
        const wechatUI = document.getElementById('wechatAppUI');
        if (wechatUI) {
            // 无论是否登录，首先立即应用全局自定义 CSS 与背景，防止页面刷新后样式失效或闪烁
            if (typeof wcApplyGlobalBackgroundAndCss === 'function') {
                wcApplyGlobalBackgroundAndCss();
            }

            // 若本地已存在登录态标识，提前切换到聊天主界面并显示底栏
            const hasLoginSession = typeof appSettings !== 'undefined' && Boolean(appSettings.wc_current_user_id);
            if (hasLoginSession) {
                document.querySelectorAll('#wechatAppUI .page').forEach(el => el.classList.remove('active'));
                const chatPage = document.getElementById('page-chat-list');
                if (chatPage) chatPage.classList.add('active');
                const bottomNav = document.querySelector('#wechatAppUI .bottom-nav-wrapper');
                if (bottomNav) bottomNav.style.display = 'block';
                const chatTab = document.getElementById('wc-nav-chat');
                if (chatTab) {
                    document.querySelectorAll('#wechatAppUI .bottom-nav .nav-item').forEach(el => el.classList.remove('active'));
                    chatTab.classList.add('active');
                }
            }

            if (window.__wechatAppVisibilityTimer) {
                clearTimeout(window.__wechatAppVisibilityTimer);
                window.__wechatAppVisibilityTimer = 0;
            }
            if (window.__wechatAppShowTimer) {
                clearTimeout(window.__wechatAppShowTimer);
                window.__wechatAppShowTimer = 0;
            }

            wechatUI.style.display = 'flex';
            window.__wechatAppShowTimer = window.setTimeout(() => {
                window.__wechatAppShowTimer = 0;
                if (wechatUI.style.display !== 'none') {
                    wechatUI.classList.add('show');
                }
            }, 10);

            // 检查登录状态
            try {
                const authData = await wcGetAuthData();
                if (authData.currentLoginWxid) {
                    const currentUser = authData.accounts.find(a => a.wxid === authData.currentLoginWxid);
                    if (currentUser) {
                        // 恢复全局变量
                        if (typeof appSettings !== 'undefined') {
                            appSettings.wc_current_user_id = currentUser.maskId;
                            appSettings.wc_current_user_name = currentUser.name;
                            appSettings.wc_current_user_avatar = currentUser.avatar;
                            appSettings.wc_current_user_phone = currentUser.wxid; // 用 wxid 替代 phone 展示
                            wcNotifyAccountChanged();
                        }

                        // 确保该账号独立的个性化配置生效
                        if (typeof wcApplyGlobalBackgroundAndCss === 'function') {
                            wcApplyGlobalBackgroundAndCss();
                        }

                        wcSwitchTab('chat');
                        const bottomNav = document.querySelector('#wechatAppUI .bottom-nav-wrapper');
                        if (bottomNav) bottomNav.style.display = 'block';

                        // 同步角色库头像和名称
                        try {
                            await wcReloadContactsFromStorage();
                            const contactRecord = await wcReadLayoutRecord('contactsAppData');
                            const contacts = Array.isArray(contactRecord?.data?.contacts) ? contactRecord.data.contacts : [];
                            let updated = false;
                            wcContactsList.forEach(wcContact => {
                                if (wcContact.linkedContactId) {
                                    const sourceContact = contacts.find(c => c.id === wcContact.linkedContactId);
                                    if (sourceContact) {
                                        const sourceName = sourceContact.name || '未命名角色';
                                        const sourceAvatar = sourceContact.avatar || '';
                                        if (wcContact.name !== sourceName) {
                                            wcContact.name = sourceName;
                                            updated = true;
                                        }
                                        if (wcContact.avatarOverride !== true && wcContact.avatar !== sourceAvatar) {
                                            wcContact.avatar = sourceAvatar;
                                            updated = true;
                                        }
                                    }
                                }
                            });
                            if (updated) {
                                await wcSaveContactsDataAsync();
                            }
                        } catch (syncErr) {
                            console.error('同步角色库头像失败', syncErr);
                        }

                        if (wcHydratedChatAccountId !== currentUser.maskId) {
                            if (typeof wcReloadChatDataFromStorage === 'function') {
                                await wcReloadChatDataFromStorage();
                            }
                            if (typeof wcLoadFavoritesData === 'function') {
                                await wcLoadFavoritesData();
                            }
                            wcHydratedChatAccountId = currentUser.maskId;
                        }
                        if (typeof wcRenderChatList === 'function') {
                            wcRenderChatList();
                        }
                        return;
                    }
                }
            } catch (e) {
                console.error('读取微信登录状态失败', e);
            }

            // 未登录，保持已应用的美化样式，展示登录页
            wcSwitchAuthPage('page-wc-login');
            const bottomNav = document.querySelector('#wechatAppUI .bottom-nav-wrapper');
            if (bottomNav) bottomNav.style.display = 'none';
        }
    }

    function wcSwitchAuthPage(pageId) {
        document.querySelectorAll('#wechatAppUI .page').forEach(el => el.classList.remove('active'));
        document.getElementById(pageId).classList.add('active');
    }

    function wcTogglePasswordVisibility(iconContainer) {
        const input = iconContainer.previousElementSibling;
        const svg = iconContainer.querySelector('svg');
        if (input.type === 'password') {
            input.type = 'text';
            // 闭眼图标 (隐藏密码)
            svg.innerHTML = '<path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path><line x1="1" y1="1" x2="23" y2="23"></line>';
        } else {
            input.type = 'password';
            // 睁眼图标 (显示密码)
            svg.innerHTML = '<path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle>';
        }
    }

    let wcSelectedUserMaskId = null;
    let wcSelectedUserMaskAvatar = '';
    let wcSelectedUserMaskName = '';

    async function wcOpenUserMaskSelect() {
        try {
            const contactRecord = await wcReadLayoutRecord('contactsAppData');
            const users = Array.isArray(contactRecord?.data?.users) ? contactRecord.data.users : [];

            if (users.length === 0) {
                showToast('联系人库中暂无 User 面具，请先在 Contacts 中添加');
                return;
            }

            const listContainer = document.getElementById('wcUserMaskDrawerList');
            if (!listContainer) return;

            listContainer.replaceChildren();
            users.forEach(u => {
                const name = String(u.name || '未命名 User');
                const phone = String(u.phone || '');
                const item = document.createElement('div');
                item.className = 'wc-user-drawer-item';
                item.addEventListener('click', () => wcSelectUserMask(u.id, name, u.avatar || '', phone));

                const avatar = document.createElement('div');
                avatar.className = 'wc-user-drawer-avatar';
                if (!wcApplyAvatarBackground(avatar, u.avatar)) {
                    avatar.textContent = name.substring(0, 1) || 'U';
                }

                const label = document.createElement('div');
                label.className = 'wc-user-drawer-name';
                label.textContent = name;
                item.append(avatar, label);
                listContainer.appendChild(item);
            });
            document.getElementById('wcUserMaskDrawerOverlay').classList.add('show');

        } catch (error) {
            console.error('读取 User 面具失败:', error);
            showToast('读取 User 面具失败');
        }
    }

    function wcCloseUserMaskDrawer() {
        const overlay = document.getElementById('wcUserMaskDrawerOverlay');
        if (overlay) overlay.classList.remove('show');
    }

    function wcSelectUserMask(id, name, avatar, phone) {
        wcSelectedUserMaskId = id;
        wcSelectedUserMaskName = name;
        wcSelectedUserMaskAvatar = avatar;

        const phoneInput = document.getElementById('wc-reg-phone');
        if (phoneInput) {
            phoneInput.value = phone || '';
        }

        const previewEl = document.getElementById('wc-register-avatar-preview');
        if (previewEl) {
            if (wcApplyAvatarBackground(previewEl, wcSelectedUserMaskAvatar)) {
                previewEl.style.backgroundSize = 'cover';
                previewEl.style.backgroundPosition = 'center';
                previewEl.innerHTML = ''; // 清除里面的相机图标
            } else {
                previewEl.replaceChildren();
                const fallback = document.createElement('span');
                fallback.style.fontSize = '24px';
                fallback.style.fontWeight = 'bold';
                fallback.style.color = '#8E8E93';
                fallback.textContent = wcSelectedUserMaskName.substring(0, 1);
                previewEl.appendChild(fallback);
            }
        }
        showToast(`已绑定面具：${wcSelectedUserMaskName}`);
        wcCloseUserMaskDrawer();
        
        setTimeout(() => {
            wcRegisterAccount();
        }, 300);
    }

    async function wcRegisterAccount() {
        const phone = document.getElementById('wc-reg-phone').value.trim();
        const pwd = document.getElementById('wc-reg-pwd').value;
        const pwdConfirm = document.getElementById('wc-reg-pwd-confirm').value;

        if (!phone) {
            showToast('请输入手机号');
            return;
        }
        if (!pwd) {
            showToast('请输入密码');
            return;
        }
        if (pwd !== pwdConfirm) {
            showToast('两次输入的密码不一致');
            return;
        }

        try {
            // 1. 校验手机号是否存在于 User 库中
            const contactRecord = await wcReadLayoutRecord('contactsAppData');
            const users = Array.isArray(contactRecord?.data?.users) ? contactRecord.data.users : [];
            const matchedUser = users.find(u => u.phone === phone);

            if (!matchedUser) {
                showToast('没有当前手机号！');
                return;
            }

            // 2. 校验手机号是否已经被注册过
            const authData = await wcGetAuthData();
            if (authData.accounts.some(a => a.phone === phone)) {
                showToast('该手机号已注册');
                return;
            }

            // 生成随机微信号
            const randomStr = Math.random().toString(36).substring(2, 10);
            const wxid = 'wxid_' + randomStr;

            // 3. 使用匹配到的 User 数据创建账号
            const newAccount = {
                wxid: wxid,
                phone: phone,
                password: pwd,
                maskId: matchedUser.id,
                name: matchedUser.name || '未命名 User',
                avatar: matchedUser.avatar || ''
            };

            authData.accounts.push(newAccount);
            authData.currentLoginWxid = wxid;
            await wcSaveAuthData(authData);

            // 更新全局设置
            if (typeof appSettings !== 'undefined') {
                appSettings.wc_current_user_id = newAccount.maskId;
                appSettings.wc_current_user_name = newAccount.name;
                appSettings.wc_current_user_avatar = newAccount.avatar;
                appSettings.wc_current_user_phone = newAccount.wxid; // 展示微信号
                if (typeof saveAppSettings === 'function') saveAppSettings();
                wcNotifyAccountChanged();
            }

            // 初始化朋友圈资料
            if (typeof wcMomentsProfile !== 'undefined') {
                wcMomentsProfile.name = newAccount.name;
                wcMomentsProfile.avatar = newAccount.avatar;
                wcMomentsProfile.id = newAccount.wxid;
                if (typeof wcSaveMomentsProfileData === 'function') wcSaveMomentsProfileData();
            }

            showToast('注册成功！微信号：' + wxid);
            wcLoginSuccess();
        } catch (e) {
            console.error('注册失败', e);
            showToast('注册失败，请重试');
        }
    }

    async function wcPerformLogin() {
        // 兼容获取输入框的值
        const accountEl = document.querySelector('#page-wc-login input[placeholder="微信号 / 手机号"]') || document.querySelector('#page-wc-login input[placeholder="账号 / 手机号"]');
        const accountInput = accountEl ? accountEl.value.trim() : '';
        const pwdInput = document.querySelector('#page-wc-login input[placeholder="密码"]').value;

        if (!accountInput || !pwdInput) {
            showToast('请输入账号和密码');
            return;
        }

        try {
            const authData = await wcGetAuthData();
            // 核心逻辑：同时匹配 phone (手机号) 或 wxid (微信号)
            const user = authData.accounts.find(a => (a.phone === accountInput || a.wxid === accountInput) && a.password === pwdInput);

            if (user) {
                authData.currentLoginWxid = user.wxid;
                await wcSaveAuthData(authData);

                if (typeof appSettings !== 'undefined') {
                    appSettings.wc_current_user_id = user.maskId;
                    appSettings.wc_current_user_name = user.name;
                    appSettings.wc_current_user_avatar = user.avatar;
                    appSettings.wc_current_user_phone = user.wxid;
                    if (typeof saveAppSettings === 'function') saveAppSettings();
                    wcNotifyAccountChanged();
                }

                if (typeof wcMomentsProfile !== 'undefined') {
                    wcMomentsProfile.name = user.name;
                    wcMomentsProfile.avatar = user.avatar;
                    wcMomentsProfile.id = user.wxid;
                    if (typeof wcSaveMomentsProfileData === 'function') wcSaveMomentsProfileData();
                }

                showToast('登录成功');
                wcLoginSuccess();
            } else {
                showToast('账号或密码错误');
            }
        } catch (e) {
            console.error('登录失败', e);
            showToast('登录失败，请重试');
        }
    }

    async function wcLogout() {
        try {
            if (typeof window.wcSaveChatData === 'function') {
                const saved = await window.wcSaveChatData();
                if (!saved) throw new Error('当前账号聊天记录保存失败');
            }
            const authData = await wcGetAuthData();
            authData.currentLoginWxid = null;
            await wcSaveAuthData(authData);

            // 清除当前内存中的用户信息
            if (typeof appSettings !== 'undefined') {
                appSettings.wc_current_user_id = null;
                appSettings.wc_current_user_name = '';
                appSettings.wc_current_user_avatar = '';
                appSettings.wc_current_user_phone = '';
                if (typeof saveAppSettings === 'function') saveAppSettings();
                wcNotifyAccountChanged();
            }

            // 清除内存中的隔离数据，防止串号
            wcContactsList = [];
            wcContactGroups = [];
            if (typeof wcChatMessagesByContact !== 'undefined') wcChatMessagesByContact = {};
            wcHydratedChatAccountId = null;
            wcWalletData = { balance: 0.00, transactions: [], familyCards: [], isNoPwd: false };
            if (typeof wcMomentsList !== 'undefined') wcMomentsList = [];
            if (typeof wcFavoritesList !== 'undefined') wcFavoritesList = [];

            wcSwitchAuthPage('page-wc-login');
            const bottomNav = document.querySelector('#wechatAppUI .bottom-nav-wrapper');
            if (bottomNav) bottomNav.style.display = 'none';
            showToast('已退出登录');
        } catch (e) {
            console.error('退出登录失败', e);
        }
    }

    // Share the existing WeChat account session with other apps.
    window.wcListAvailableAccounts = async function wcListAvailableAccounts() {
        const data = await wcGetAuthData();
        const current = String(data.currentLoginWxid || '');
        return (Array.isArray(data.accounts) ? data.accounts : [])
            .filter(account => account && account.wxid && account.maskId)
            .map(account => ({
                wxid: String(account.wxid),
                maskId: String(account.maskId),
                name: String(account.name || '未命名 User'),
                avatar: String(account.avatar || ''),
                isCurrent: current === String(account.wxid)
            }));
    };

    let wcAccountSwitchInProgress = false;
    window.wcSwitchToAccount = async function wcSwitchToAccount(accountId) {
        if (wcAccountSwitchInProgress) throw new Error('账号正在切换，请勿重复操作');
        if (window.__tonghuajiBackupRestoreInProgress) throw new Error('备份恢复期间不能切换账号');
        wcAccountSwitchInProgress = true;
        try {
            const authData = await wcGetAuthData();
            const target = (Array.isArray(authData.accounts) ? authData.accounts : []).find(
                account => account && account.maskId &&
                    (String(account.wxid) === String(accountId) || String(account.maskId) === String(accountId))
            );
            if (!target || !target.wxid) throw new Error('找不到该已注册的微信用户面具');
            if (String(authData.currentLoginWxid || '') === String(target.wxid) &&
                String(appSettings?.wc_current_user_id || '') === String(target.maskId)) return true;

            // Persist the old account before changing the account namespace.
            if (authData.currentLoginWxid && typeof window.wcSaveChatData === 'function') {
                if (await window.wcSaveChatData() !== true) {
                    throw new Error('当前账号聊天记录未能保存，切换已取消');
                }
            }
            authData.currentLoginWxid = target.wxid;
            await wcSaveAuthData(authData);
            if (typeof appSettings !== 'undefined' && appSettings) {
                appSettings.wc_current_user_id = target.maskId;
                appSettings.wc_current_user_name = target.name || '';
                appSettings.wc_current_user_avatar = target.avatar || '';
                appSettings.wc_current_user_phone = target.wxid;
                if (typeof saveAppSettings === 'function') saveAppSettings();
            }
            wcNotifyAccountChanged();
            await wcLoginSuccess();
            return true;
        } finally {
            wcAccountSwitchInProgress = false;
        }
    };

    async function wcLoginSuccess() {
        // 切换账号后重新加载该账号的隔离数据
        await wcReloadContactsFromStorage();
        if (typeof wcReloadChatDataFromStorage === 'function') {
            await wcReloadChatDataFromStorage();
        }
        wcHydratedChatAccountId = typeof appSettings !== 'undefined' ? appSettings.wc_current_user_id : null;
        await wcLoadWalletData();
        await wcLoadFavoritesData();
        if (typeof window.MemoryApp?.refresh === 'function') {
            await window.MemoryApp.refresh();
        }
        if (typeof wcApplyGlobalBackgroundAndCss === 'function') {
            wcApplyGlobalBackgroundAndCss();
        }

        // 登录/注册成功后，跳转到聊天列表页，并显示底部导航栏
        document.querySelectorAll('#wechatAppUI .page').forEach(el => el.classList.remove('active'));
        document.getElementById('page-chat-list').classList.add('active');

        const bottomNav = document.querySelector('#wechatAppUI .bottom-nav-wrapper');
        if (bottomNav) bottomNav.style.display = 'block';

        // 激活底部的聊天 Tab 状态
        document.querySelectorAll('#wechatAppUI .bottom-nav .nav-item').forEach(el => el.classList.remove('active'));
        document.getElementById('wc-nav-chat').classList.add('active');
        
        wcRenderChatList();
    }




