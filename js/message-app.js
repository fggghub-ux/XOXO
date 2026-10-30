window.MessageApp = (function() {
    let container = null;
    let isEditMode = false;
    let currentCategory = 'all'; // 'all', 'unknown', 'spam', 'deleted'
    let currentChatConv = null;

    // 默认的占位数据（与你提供的图片和HTML一致）
    const defaultConversations = [];

    // 获取当前登录账号的隔离 Storage Key（与微信、营业厅账号体系完全对齐）
    function getMessageStorageKey() {
        let accountId = 'default';
        if (typeof appSettings !== 'undefined' && appSettings.wc_current_user_id) {
            accountId = appSettings.wc_current_user_id;
        }
        return `messageAppData_${accountId}`;
    }

    // 从 IndexedDB 读取短信数据（按当前账号隔离）
    let smsLoadedKey = '';
    let smsSearchQuery = '';
    let smsSaveQueue = Promise.resolve();
    let smsFeeQueue = Promise.resolve();
    function loadStorageData() {
        const storageKey = getMessageStorageKey();
        if (smsLoadedKey === storageKey && Array.isArray(window.messageAppData?.conversations)) return Promise.resolve(window.messageAppData);
        return new Promise((resolve) => {
            const defaultObj = { conversations: JSON.parse(JSON.stringify(defaultConversations)), identities: [] };
            if (typeof db !== 'undefined' && db && typeof storeName !== 'undefined') {
                try {
                    const tx = db.transaction([storeName], 'readonly');
                    const req = tx.objectStore(storeName).get(storageKey);
                    req.onsuccess = () => {
                        if (storageKey !== getMessageStorageKey()) { resolve(null); return; }
                        if (req.result && Array.isArray(req.result.conversations)) {
                            window.messageAppData = {
                                conversations: req.result.conversations,
                                identities: Array.isArray(req.result.identities) ? req.result.identities : []
                            };
                        } else {
                            window.messageAppData = clone(defaultObj);
                        }
                        smsLoadedKey = storageKey;
                        resolve(window.messageAppData);
                    };
                    req.onerror = () => {
                        window.messageAppData = clone(defaultObj);
                        resolve(window.messageAppData);
                    };
                } catch (e) {
                    window.messageAppData = clone(defaultObj);
                    resolve(window.messageAppData);
                }
            } else {
                try {
                    const local = localStorage.getItem(`tonghuajiMessageData_${storageKey}`);
                    if (local) {
                        const parsed = JSON.parse(local);
                        window.messageAppData = {
                            conversations: Array.isArray(parsed.conversations) ? parsed.conversations : [],
                            identities: Array.isArray(parsed.identities) ? parsed.identities : []
                        };
                    } else {
                        window.messageAppData = clone(defaultObj);
                    }
                } catch (e) {
                    window.messageAppData = clone(defaultObj);
                }
                resolve(window.messageAppData);
            }
        });
    }

    function clone(val) {
        return JSON.parse(JSON.stringify(val));
    }

    function messageKeyMatches(value, key) {
        return String(value || '').trim().toLowerCase() === String(key || '').trim().toLowerCase();
    }

    // A character's contact ID is the stable SMS conversation key. Older records
    // used the display name, so retain that as a migration fallback.
    function findConversation(conversations, conversationId, displayName = '') {
        const list = Array.isArray(conversations) ? conversations : [];
        return list.find(conv => messageKeyMatches(conv?.id, conversationId))
            || list.find(conv => messageKeyMatches(conv?.sender, conversationId))
            || (displayName ? list.find(conv => messageKeyMatches(conv?.id, displayName) || messageKeyMatches(conv?.sender, displayName)) : null);
    }

    function getWechatMessageContacts() {
        if (typeof wcContactsList !== 'undefined' && Array.isArray(wcContactsList)) return wcContactsList;
        return Array.isArray(window.wcContactsList) ? window.wcContactsList : [];
    }

    // Keep Contacts and WeChat storage independent while exposing every role as
    // a selectable SMS recipient. Bound WeChat contacts remain the canonical row.
    async function getMessageRecipientContacts() {
        const contacts = getWechatMessageContacts().filter(Boolean).slice();
        const knownIds = new Set(contacts.map(contact => String(contact.id || '').trim()).filter(Boolean));
        const knownLinkedIds = new Set(contacts.map(contact => String(contact.linkedContactId || '').trim()).filter(Boolean));
        const contactRecord = await msgReadLayoutRecord('contactsAppData');
        const roles = Array.isArray(contactRecord?.data?.contacts)
            ? contactRecord.data.contacts
            : (Array.isArray(contactRecord?.contacts) ? contactRecord.contacts : []);

        roles.filter(Boolean).forEach(role => {
            const roleId = String(role.id || '').trim();
            if (!roleId || knownLinkedIds.has(roleId) || knownIds.has(`char_${roleId}`)) return;
            contacts.push({
                id: `char_${roleId}`,
                linkedContactId: roleId,
                name: role.name || '未命名角色',
                avatar: role.avatar || '',
                phone: role.phone || role.security?.phone || '',
                account: role.account || role.security?.account || '',
                isMessageRole: true
            });
        });
        return contacts;
    }

    // Store ordered snapshots in the existing IndexedDB store, scoped by account.
    window.saveMessageAppData = function() {
        if (!window.messageAppData) return Promise.resolve(false);
        const storageKey = getMessageStorageKey();
        const snapshot = clone(window.messageAppData);
        const task = smsSaveQueue.catch(() => {}).then(() => new Promise((resolve, reject) => {
            if (typeof db === 'undefined' || !db || typeof storeName === 'undefined') {
                reject(new Error('SMS storage not ready'));
                return;
            }
            try {
                const tx = db.transaction([storeName], 'readwrite');
                tx.objectStore(storeName).put({
                    id: storageKey,
                    conversations: snapshot.conversations || [],
                    identities: snapshot.identities || []
                });
                tx.oncomplete = () => resolve(true);
                tx.onerror = () => reject(tx.error || new Error('SMS save failed'));
                tx.onabort = () => reject(tx.error || new Error('SMS save aborted'));
            } catch (error) { reject(error); }
        }));
        smsSaveQueue = task;
        void task.catch(error => {
            console.error('SMS save failed:', error);
            if (typeof showToast === 'function') showToast('短信数据保存失败');
        });
        return task;
    };

    function smsSafeHtml(value) {
        return String(value ?? '').replace(/[&<>"']/g, c => ({
            '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
        })[c]);
    }
    function smsBubbleRow(message, sender) {
        const dir = message?.type === 'sent' ? 'sent' : 'received';
        const row = document.createElement('div');
        row.className = 'message-bubble-row ' + dir + ' tail';
        const bubble = document.createElement('div');
        bubble.className = 'message-imessage-bubble ' + dir;
        let body = String(message?.text ?? '');
        const url = 'http://10086.cn/pay';
        if (dir === 'received' && String(sender) === '10086' && body.includes(url)) {
            body = body.replace(/<[^>]*>/g, '');
            const at = body.indexOf(url);
            bubble.appendChild(document.createTextNode(body.slice(0, at)));
            const anchor = document.createElement('a');
            anchor.href = '#';
            anchor.textContent = url;
            anchor.style.cssText = 'color:#007aff;text-decoration:underline;font-weight:600';
            anchor.addEventListener('click', e => {
                e.preventDefault();
                if (typeof window.BusinessApp?.open === 'function') window.BusinessApp.open({ source: 'message' });
            });
            bubble.append(anchor, document.createTextNode(body.slice(at + url.length)));
        } else bubble.textContent = body;
        row.appendChild(bubble);
        return row;
    }

    function observeSmsMemoryEvent(conversation, message, actor = 'user') {
        const bindingId = String(conversation?.id || '').trim();
        const text = String(message?.text || '').trim();
        if (!bindingId || !text || typeof window.MemoryV2?.observeExternalEvent !== 'function') return;
        void window.MemoryV2.observeExternalEvent({
            sourceApp: 'sms',
            sourceId: String(message?.id || ('sms_' + Date.now())),
            bindingId,
            actor,
            text,
            occurredAt: message?.time || Date.now()
        }).catch(error => console.warn('SMS memory event skipped:', error));
    }

    function removeSmsConversationMemoryEvents(conversation) {
        const sourceIds = (Array.isArray(conversation?.messages) ? conversation.messages : [])
            .map(message => String(message?.id || '').trim())
            .filter(Boolean);
        if (!sourceIds.length) return;
        if (typeof window.MemoryV2?.removeExternalEventObservations === 'function') {
            void window.MemoryV2.removeExternalEventObservations({
                sourceApp: 'sms',
                sourceIds
            }).catch(error => console.warn('SMS memory cleanup skipped:', error));
            return;
        }
        if (typeof window.MemoryV2?.removeExternalEventObservation === 'function') {
            sourceIds.forEach(sourceId => {
                void window.MemoryV2.removeExternalEventObservation({
                    sourceApp: 'sms',
                    sourceId
                }).catch(error => console.warn('SMS memory cleanup skipped:', error));
            });
        }
    }

    // HTML 框架模板
    const appHTML = `
        <!-- 顶部悬浮操作区 -->
        <div class="message-top-actions">
            <button class="message-glass-effect message-capsule-btn" id="message-editBtn">编辑</button>
            <button class="message-glass-effect message-circle-btn" id="message-menuBtn">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#000" stroke-width="2" stroke-linecap="round">
                    <line x1="3" y1="6" x2="21" y2="6"></line>
                    <line x1="3" y1="12" x2="21" y2="12"></line>
                    <line x1="3" y1="18" x2="15" y2="18"></line>
                </svg>
            </button>
        </div>

        <!-- 下拉菜单 -->
        <div class="message-ios-menu" id="message-dropdownMenu">
            <div class="message-ios-menu-item" id="message-menu-all">
                <svg class="message-check-icon" viewBox="0 0 24 24"><path d="M4 12l5 5L20 7" stroke-linecap="round" stroke-linejoin="round"/></svg>
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16">
                  <path d="M5.2564400000000004 10.35208c2.8151475 0 5.096172500000001 -1.9306650000000003 5.096172500000001 -4.3121475S8.0715875 1.7277875000000003 5.2564400000000004 1.7277875000000003 0.1602675 3.6584525 0.1602675 6.0399325c0 0.9457325000000001 0.3601625 1.8204125000000002 0.9702325 2.5333875 -0.08575250000000001 0.23030750000000003 -0.21315499999999998 0.43366499999999997 -0.34791 0.6051700000000001 -0.11760500000000002 0.151905 -0.2376575 0.26951 -0.3258625 0.3503625 -0.0441 0.039200000000000006 -0.08085250000000001 0.0710525 -0.10535250000000002 0.09065250000000001 -0.01225 0.009800000000000001 -0.02205 0.017150000000000002 -0.02695 0.019600000000000003l-0.004902500000000001 0.004900000000000001c-0.13475250000000003 0.10045500000000002 -0.19355500000000003 0.27686000000000005 -0.1396525 0.43611500000000003s0.203355 0.27196 0.37241250000000004 0.27196c0.5341175 0 1.0731350000000002 -0.137205 1.5215 -0.30626000000000003 0.22540749999999998 -0.08575500000000001 0.43611500000000003 -0.1813075 0.6198725 -0.27931 0.752175 0.37241250000000004 1.6268550000000002 0.58557 2.562785 0.58557Zm5.8802 -4.3121475c0 2.7514450000000004 -2.4280325000000005 4.824215000000001 -5.30443 5.0716725 0.5953700000000001 1.8228625000000003 2.5701375 3.1606075000000002 4.9124175 3.1606075000000002 0.9359299999999999 0 1.8106100000000003 -0.21315750000000003 2.5652375000000003 -0.58557 0.183755 0.0980025 0.39201250000000004 0.19355750000000002 0.6174200000000001 0.27931 0.448365 0.169055 0.9873825 0.30626000000000003 1.5215025000000002 0.30626000000000003 0.169055 0 0.32096 -0.1102525 0.37241250000000004 -0.27196 0.051449999999999996 -0.16170500000000002 -0.004902500000000001 -0.33811 -0.142105 -0.43856500000000004l-0.004900000000000001 -0.004900000000000001c-0.004902500000000001 -0.004900000000000001 -0.0147025 -0.009800000000000001 -0.026952500000000004 -0.019600000000000003 -0.0245 -0.019600000000000003 -0.0612525 -0.049002500000000004 -0.10535250000000002 -0.09065250000000001 -0.0882025 -0.08085250000000001 -0.20825749999999998 -0.1984575 -0.3258625 -0.3503625 -0.13475250000000003 -0.17150500000000002 -0.2621575 -0.3773125 -0.34791 -0.6051700000000001 0.61007 -0.7105250000000001 0.9702325 -1.5852050000000002 0.9702325 -2.5333850000000004 0 -2.2736775000000002 -2.0801200000000004 -4.138190000000001 -4.71886 -4.2998975 0.009800000000000001 0.124955 0.0147 0.25236000000000003 0.0147 0.3797625Z" fill="#000000" stroke-width="0.025"></path>
                </svg>
                <span>信息</span>
            </div>
            <div class="message-ios-menu-item" id="message-menu-unknown">
                <div class="message-check-placeholder"></div>
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="#000000">
                  <path fill-rule="evenodd" d="M12.456666666666665 12.731333333333334A6.482 6.482 0 0 0 14.5 8c0 -3.59 -2.91 -6.5 -6.5 -6.5S1.5 4.41 1.5 8a6.482 6.482 0 0 0 2.043333333333333 4.731333333333334A6.477333333333332 6.477333333333332 0 0 0 8 14.5a6.477333333333332 6.477333333333332 0 0 0 4.456666666666666 -1.7686666666666666Zm-8.36 -0.8566666666666666A4.990666666666666 4.990666666666666 0 0 1 8 10a4.990666666666666 4.990666666666666 0 0 1 3.9033333333333333 1.8746666666666665A5.482666666666667 5.482666666666667 0 0 1 8 13.5a5.482666666666667 5.482666666666667 0 0 1 -3.9033333333333333 -1.6253333333333333ZM10.5 6a2.5 2.5 0 1 1 -5 0 2.5 2.5 0 0 1 5 0Z" clip-rule="evenodd" stroke-width="0.6667"></path>
                </svg>
                <span id="message-menu-unknown-text">未知发件人</span>
            </div>
            <div class="message-ios-menu-item" id="message-menu-spam">
                <div class="message-check-placeholder"></div>
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 48 48" style="transform: scale(0.82);">
                  <path fill="#000000" d="M44.1601 2.1602H3.84c-1.8557 0 -3.36 1.5043 -3.36 3.36v1.68c0 1.8557 1.5043 3.36 3.36 3.36h40.3201c1.8556 0 3.3599 -1.5043 3.3599 -3.36v-1.68c0 -1.8557 -1.5043 -3.36 -3.3599 -3.36Z" stroke-width="1"></path>
                  <path fill="#000000" d="M4.9372 13.9198c-0.118 -0.0006 -0.2348 0.0236 -0.3429 0.0712s-0.2048 0.1174 -0.2841 0.2049c-0.0792 0.0874 -0.1392 0.1906 -0.1759 0.3028 -0.0367 0.1123 -0.0493 0.2309 -0.0371 0.3482l2.7626 26.5189c-0.0006 0.0077 -0.0006 0.0154 0 0.023 0.1443 1.2267 0.734 2.3576 1.6571 3.178 0.9231 0.8205 2.1153 1.2735 3.3503 1.273h24.2645c1.2347 0 2.4264 -0.4533 3.349 -1.2736 0.9227 -0.8205 1.5121 -1.9512 1.6563 -3.1774v-0.022l2.7584 -26.5199c0.0123 -0.1173 -0.0003 -0.236 -0.0371 -0.3482 -0.0366 -0.1122 -0.0966 -0.2154 -0.1758 -0.3028 -0.0793 -0.0875 -0.1762 -0.1573 -0.284 -0.2049 -0.1081 -0.0476 -0.2249 -0.0718 -0.3431 -0.0712H4.9372Zm26.1303 18.9725c0.1599 0.1551 0.2871 0.3406 0.3744 0.5453 0.0875 0.2049 0.1333 0.425 0.1349 0.6478 0.0016 0.2226 -0.0411 0.4435 -0.1256 0.6495 -0.0845 0.2059 -0.2092 0.3931 -0.3666 0.5506 -0.1575 0.1573 -0.3448 0.2819 -0.5509 0.3663 -0.206 0.0845 -0.4268 0.127 -0.6496 0.1253 -0.2225 -0.0016 -0.4427 -0.0474 -0.6475 -0.135 -0.2047 -0.0875 -0.3901 -0.2148 -0.5452 -0.3747L24 30.576l-4.6925 4.6914c-0.3164 0.3076 -0.7412 0.4782 -1.1826 0.475 -0.4413 -0.003 -0.8636 -0.1797 -1.1757 -0.4917 -0.3122 -0.312 -0.4889 -0.7342 -0.4923 -1.1755 -0.0033 -0.4414 0.1671 -0.8663 0.4745 -1.1829l4.6924 -4.6924 -4.6924 -4.6925c-0.3074 -0.3167 -0.4778 -0.7415 -0.4745 -1.1829 0.0034 -0.4413 0.1801 -0.8634 0.4923 -1.1756 0.3121 -0.3119 0.7344 -0.4885 1.1757 -0.4916 0.4414 -0.0032 0.8662 0.1674 1.1826 0.475L24 25.8237l4.6914 -4.6914c0.3165 -0.3076 0.7414 -0.4782 1.1826 -0.475 0.4413 0.0031 0.8637 0.1797 1.1758 0.4916 0.3122 0.3122 0.4889 0.7343 0.4923 1.1756 0.0032 0.4414 -0.1671 0.8662 -0.4746 1.1829l-4.6924 4.6925 4.6924 4.6924Z" stroke-width="1"></path>
                </svg>
                <span>垃圾信息</span>
            </div>
            <div class="message-ios-menu-item" id="message-menu-deleted">
                <div class="message-check-placeholder"></div>
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="#000000">
                  <path fill-rule="evenodd" d="M11 2.985333333333333v0.15133333333333332a32.544 32.544 0 0 1 2.5853333333333333 0.3413333333333333 0.5 0.5 0 1 1 -0.17066666666666666 0.9853333333333333l-0.1393333333333333 -0.023333333333333334 -0.6699999999999999 8.713333333333333a2 2 0 0 1 -1.994 1.8466666666666667H5.389333333333333a2 2 0 0 1 -1.994 -1.8466666666666667L2.7246666666666663 4.4399999999999995l-0.1393333333333333 0.023333333333333334a0.5 0.5 0 0 1 -0.17066666666666666 -0.9853333333333333A32.378 32.378 0 0 1 5 3.1366666666666667v-0.15133333333333332c0 -1.0426666666666666 0.8086666666666666 -1.9333333333333331 1.877333333333333 -1.9673333333333334a35.108 35.108 0 0 1 2.246 0c1.0686666666666667 0.033999999999999996 1.8766666666666665 0.9246666666666666 1.8766666666666665 1.9673333333333334Zm-4.0906666666666665 -0.968a34.13066666666666 34.13066666666666 0 0 1 2.182 0C9.593333333333334 2.033333333333333 10 2.456 10 2.985333333333333v0.07533333333333334a32.992 32.992 0 0 0 -4 0v-0.07533333333333334c0 -0.5293333333333333 0.40599999999999997 -0.952 0.9093333333333333 -0.968Zm-0.23666666666666664 3.9633333333333334a0.5 0.5 0 1 0 -1 0.03866666666666667l0.2313333333333333 6a0.5 0.5 0 1 0 0.9993333333333334 -0.03866666666666667l-0.23066666666666663 -6Zm3.6533333333333333 0.03866666666666667a0.5 0.5 0 1 0 -0.9986666666666666 -0.03866666666666667l-0.2313333333333333 6a0.5 0.5 0 0 0 1 0.03866666666666667l0.22999999999999998 -6Z" clip-rule="evenodd" stroke-width="0.6667"></path>
                </svg>
                <span>最近删除</span>
            </div>
            <div class="message-ios-menu-divider"></div>
            <div class="message-ios-menu-header">筛选条件</div>
            <div class="message-ios-menu-item" id="message-menu-identity">
                <div class="message-check-placeholder"></div>
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <path fill="#000000" d="m4.16 21.633 -0.002 0.002 -0.79 0.741 1.076 0.12a7.785 7.785 0 0 0 2.691 -0.199c0.891 -0.234 1.828 -0.688 2.422 -1.532 0.786 0.154 1.604 0.235 2.443 0.235 6 0 11 -4.184 11 -9.5S18 2 12 2 1 6.184 1 11.5c0 3.236 1.866 6.065 4.668 7.77 -0.086 0.471 -0.377 0.994 -0.723 1.462a7.726 7.726 0 0 1 -0.773 0.89l-0.012 0.011Z" stroke-width="1"></path>
                  <circle cx="20" cy="4" r="3" fill="#007aff" />
                </svg>
                <span>身份管理</span>
            </div>
            <div class="message-ios-menu-divider"></div>
            <div class="message-ios-menu-item" id="message-menu-business">
                <div class="message-check-placeholder"></div>
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 14" id="City-Hall--Streamline-Core" height="18" width="18" style="transform: scale(0.9);">
                  <desc>
                    City Hall Streamline Icon: https://streamlinehq.com
                  </desc>
                  <g id="city-hall--city-hall-travel-places">
                    <path id="Union" fill="#000000" fill-rule="evenodd" d="M7 0.0505981c-0.19892 0 -0.38969 0.0790229 -0.53034 0.2196829C6.329 0.410941 6.24999 0.601716 6.25 0.800635l0.00011 2.304825 -3.2867 2.16444c-0.18446 0.12147 -0.26736 0.34957 -0.20396 0.56113l0.00063 0.00207h8.64402l0.0006 -0.00207c0.0634 -0.21156 -0.0195 -0.43966 -0.2039 -0.56113L7.75011 2.99749 7.75004 1.5506h0.62114c0.41421 0 0.75 -0.33579 0.75 -0.750002 0 -0.414213 -0.33579 -0.7499999 -0.75 -0.7499999H7ZM13.242 8.5592h-0.1957v3.9345h0.1957c0.4142 0 0.75 0.3358 0.75 0.75s-0.3358 0.75 -0.75 0.75H0.922119c-0.414213 0 -0.75 -0.3358 -0.75 -0.75s0.335787 -0.75 0.75 -0.75h0.195861V8.5592H0.922119c-0.414213 0 -0.75 -0.33578 -0.75 -0.75 0 -0.41421 0.335787 -0.75 0.75 -0.75H13.242c0.4142 0 0.75 0.33579 0.75 0.75 0 0.41422 -0.3358 0.75 -0.75 0.75Zm-2.1062 0h-1.25v3.9345h1.25V8.5592Zm-7.0216 0h-1.25l0 3.9345h1.25l0 -3.9345Zm3.84283 3.9345v-2.1104c0 -0.51411 -0.41674 -0.93085 -0.93082 -0.93085 -0.51407 0 -0.93081 0.41674 -0.93081 0.93085v2.1104h1.86163Z" clip-rule="evenodd" stroke-width="1"></path>
                  </g>
                </svg>
                <span>营业厅</span>
            </div>
        </div>

        <!-- 消息列表 -->
        <main class="message-list" id="message-list-container">
            <h1 class="message-title" id="message-exitBtn" style="cursor: pointer;" title="返回桌面">信息</h1>
            <div id="message-items-wrapper"></div>
        </main>

        <!-- 底部悬浮区域 (正常模式) -->
        <div class="message-bottom-bar-wrapper">
            <div class="message-glass-effect message-search-capsule">
                <div class="message-search-left">
                    <svg viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" height="18" width="18">
                      <path d="m15.6198 14.513133333333332 -2.9068666666666663 -2.8834c1.1283333333333332 -1.4068666666666667 1.6747999999999998 -3.1926666666666663 1.5269333333333333 -4.990066666666666 -0.14786666666666665 -1.7973999999999999 -0.9787333333333332 -3.4698666666666664 -2.3218666666666667 -4.673533333333333C10.575 0.7625333333333333 8.821733333333333 0.11926666666666666 7.018933333333333 0.1686 5.216066666666666 0.21793333333333334 3.5006666666666666 0.9561333333333333 2.2253999999999996 2.2314S0.212 5.222066666666667 0.16266666666666665 7.024866666666666c-0.049333333333333326 1.8028 0.5939333333333333 3.5560666666666667 1.7975333333333332 4.899133333333333 1.2035999999999998 1.3431333333333333 2.8760666666666665 2.174 4.673533333333333 2.3217999999999996 1.7973999999999999 0.14786666666666665 3.583133333333333 -0.3985333333333333 4.990066666666666 -1.5269333333333333l2.8834 2.8834c0.07286666666666666 0.07339999999999999 0.15953333333333333 0.1317333333333333 0.255 0.17153333333333332 0.09546666666666666 0.0398 0.19786666666666666 0.06026666666666666 0.30133333333333334 0.06026666666666666s0.20579999999999998 -0.020466666666666668 0.30133333333333334 -0.06026666666666666c0.09546666666666666 -0.0398 0.18206666666666665 -0.09813333333333332 0.25493333333333335 -0.17153333333333332 0.1412 -0.14613333333333334 0.22019999999999998 -0.3414 0.22019999999999998 -0.5445333333333333s-0.07899999999999999 -0.39846666666666664 -0.22019999999999998 -0.5445333333333333Zm-8.3916 -1.7942666666666665c-1.0848 0 -2.1452 -0.32166666666666666 -3.0472 -0.9243333333333333 -0.9019333333333333 -0.6026666666666667 -1.6049333333333333 -1.4592666666666665 -2.0200666666666667 -2.4614666666666665 -0.41513333333333335 -1.0022 -0.5237333333333333 -2.1050666666666666 -0.31206666666666666 -3.1689333333333334 0.2116 -1.0639333333333334 0.734 -2.0412666666666666 1.501 -2.8082666666666665 0.7670666666666667 -0.7670666666666667 1.744333333333333 -1.2894666666666665 2.8082666666666665 -1.5010666666666665 1.0639333333333334 -0.21166666666666667 2.1668 -0.103 3.1689999999999996 0.3121333333333333 1.0022 0.4150666666666667 1.8587333333333333 1.1180666666666665 2.4614666666666665 2.0200666666666667 0.6026666666666667 0.9019333333333333 0.9243333333333333 1.962333333333333 0.9243333333333333 3.0471333333333335 0 1.4546666666666666 -0.5778666666666666 2.8497333333333335 -1.6064666666666665 3.878333333333333 -1.0286 1.0285333333333333 -2.4236666666666666 1.6064 -3.8782666666666668 1.6064Z" fill="#8e8e93" stroke-width="0.6667"></path>
                    </svg>
                    <span>搜索</span>
                </div>
                <div class="message-mic-right">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 48 48" width="22" height="22">
                      <path stroke="#8e8e93" stroke-linecap="round" stroke-linejoin="round" d="M16.7629 45.7104h14.4736" stroke-width="3"></path>
                      <path stroke="#8e8e93" stroke-linecap="round" stroke-linejoin="round" d="M38.4736 18.5726v3.6183c0 7.9605 -6.5131 14.4736 -14.4735 14.4736S9.5264 30.1514 9.5264 22.1909v-3.6183" stroke-width="3"></path>
                      <path stroke="#8e8e93" stroke-linecap="round" stroke-linejoin="round" d="M23.9995 36.6639v9.0469" stroke-width="3"></path>
                      <path stroke="#8e8e93" stroke-linecap="round" stroke-linejoin="round" d="M23.9998 2.2893c-0.9517 -0.0048 -1.8949 0.1791 -2.775 0.5411 -0.8803 0.362 -1.6799 0.8948 -2.353 1.5678 -0.6729 0.673 -1.2057 1.4726 -1.5677 2.3528 -0.3619 0.8802 -0.546 1.8234 -0.5411 2.7751v12.5512c0 3.9803 3.2791 7.3499 7.2368 7.3499 3.9576 0 7.2368 -3.2792 7.2368 -7.3499V9.5261c0 -4.0707 -3.1661 -7.2368 -7.2368 -7.2368Z" stroke-width="3"></path>
                    </svg>
                </div>
            </div>
            <button class="message-glass-effect message-create-circle">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 48 48" width="24" height="24">
                  <path stroke="#000000" stroke-linecap="round" stroke-linejoin="round" d="M38.4742 20.3813v20.8064c0 0.5939 -0.1171 1.182 -0.3444 1.7308 -0.2272 0.5488 -0.5604 1.0474 -0.9805 1.4674 -0.42 0.4201 -0.9186 0.7533 -1.4674 0.9805 -0.5488 0.2272 -1.1369 0.3444 -1.7308 0.3444H6.8124c-1.1996 0 -2.35 -0.4766 -3.1983 -1.3249 -0.8482 -0.8482 -1.3248 -1.9986 -1.3248 -3.1982V14.049c0 -1.1997 0.4766 -2.3501 1.3248 -3.1983 0.8483 -0.8483 1.9987 -1.3248 3.1983 -1.3248h18.9382" stroke-width="4.5"></path>
                  <g transform="translate(-4, 4)">
                      <path fill="#000000" stroke="#000000" stroke-width="1" d="M47.0607 1.0737c-0.1652 -0.1816 -0.3656 -0.3277 -0.589 -0.4297 -0.2232 -0.1019 -0.4649 -0.1576 -0.7103 -0.1635 -0.2454 -0.0059 -0.4896 0.038 -0.7175 0.1291 -0.228 0.0911 -0.4352 0.2274 -0.609 0.4008l-1.3988 1.3921c-0.1696 0.1696 -0.2647 0.3996 -0.2647 0.6394 0 0.2399 0.0951 0.4699 0.2647 0.6395l1.2823 1.2801c0.0841 0.0845 0.184 0.1515 0.294 0.1972 0.11 0.0458 0.228 0.0693 0.3472 0.0693s0.2371 -0.0235 0.3472 -0.0693c0.11 -0.0457 0.21 -0.1127 0.294 -0.1972l1.3638 -1.357c0.6898 -0.6886 0.7543 -1.8104 0.0961 -2.5308Z"></path>
                      <path fill="#000000" stroke="#000000" stroke-width="1" d="M40.2077 5.2286 19.7949 25.6052c-0.1237 0.1232 -0.2136 0.2763 -0.2612 0.4443l-0.9441 2.8123c-0.0227 0.0764 -0.0243 0.1573 -0.0047 0.2344 0.0195 0.0773 0.0597 0.1476 0.1159 0.2039 0.0563 0.0564 0.1267 0.0963 0.2038 0.1159 0.0772 0.0196 0.1581 0.018 0.2345 -0.0047l2.81 -0.9441c0.1681 -0.0476 0.3211 -0.1374 0.4443 -0.2613l20.3767 -20.415c0.1885 -0.1905 0.2943 -0.4478 0.2943 -0.7157 0 -0.268 -0.1058 -0.5253 -0.2943 -0.7158l-1.1252 -1.1308c-0.1908 -0.1902 -0.4491 -0.297 -0.7186 -0.297 -0.2693 0 -0.5278 0.1068 -0.7186 0.297Z"></path>
                  </g>
                </svg>
            </button>
        </div>

        <!-- 底部操作栏 (编辑模式下显示) -->
        <div class="message-edit-action-bar message-glass-effect">
            <button class="message-edit-action-btn" id="message-readBtn" disabled>已读</button>
            <button class="message-edit-action-btn" id="message-deleteBtn" disabled>删除</button>
        </div>

        <!-- 新建消息抽屉 -->
        <div class="message-new-sheet" id="message-new-sheet">
            <div class="message-new-header">
                <div class="message-new-title">新 iMessage 信息</div>
                <div class="message-new-close" id="message-new-close">
                    <svg viewBox="0 0 24 24" fill="none" stroke="#000" stroke-width="2" stroke-linecap="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                </div>
            </div>
            
            <div class="message-new-fields-container">
                <div class="message-new-to-bar">
                    <span class="message-new-to-label">收件人:</span>
                    <input type="text" class="message-new-to-input" id="message-new-to-input" placeholder="">
                    <div class="message-new-add-btn" id="message-new-add-btn">
                        <svg viewBox="0 0 24 24" fill="none" stroke="#007aff" stroke-width="2" stroke-linecap="round"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
                    </div>
                    <!-- 悬浮联系人下拉列表 -->
                    <div class="message-new-contacts-dropdown" id="message-new-contacts-dropdown">
                        <!-- 动态渲染 -->
                    </div>
                </div>
                <div class="message-new-divider"></div>
                <div class="message-new-from-bar" id="message-new-from-trigger" style="cursor: pointer; position: relative;">
                    <span class="message-new-to-label">发件人:</span>
                    <input type="text" class="message-new-to-input" id="message-new-from-input" value="主号" readonly style="cursor: pointer;">
                    <svg viewBox="0 0 24 24" fill="none" stroke="#8e8e93" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="width: 14px; height: 14px; margin-left: 6px;"><polyline points="6 9 12 15 18 9"></polyline></svg>
                    <!-- 发件人切换下拉框 -->
                    <div class="message-new-contacts-dropdown" id="message-new-from-dropdown">
                        <!-- 动态渲染身份选项 -->
                    </div>
                </div>
            </div>

            <!-- 底部输入区 -->
            <div class="message-new-footer">
                <div class="message-chat-add message-glass-effect">
                    <svg viewBox="0 0 24 24" fill="none" stroke="#000" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
                </div>
                <div class="message-chat-input-wrap message-glass-effect">
                    <input type="text" placeholder="iMessage 信息" class="message-chat-input" id="message-new-msg-input">
                    <div class="message-chat-voice" id="message-new-send-btn" style="background-color: #007aff;">
                        <svg viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="20" x2="12" y2="4"></line><polyline points="6 10 12 4 18 10"></polyline></svg>
                    </div>
                </div>
            </div>
        </div>

        <!-- 身份管理抽屉 -->
        <div class="message-new-sheet" id="message-identity-sheet" style="z-index: 160; top: 30%; border-radius: 32px 32px 0 0;">
            <div class="message-new-header" style="padding: 14px 16px;">
                <div class="message-new-title">身份管理</div>
                <div class="message-new-close" id="message-identity-close">
                    <svg viewBox="0 0 24 24" fill="none" stroke="#000" stroke-width="2" stroke-linecap="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                </div>
            </div>
            
            <div style="flex: 1; overflow-y: auto; padding: 0 16px 24px;">
                <!-- 真实主号身份卡片 -->
                <div style="font-size: 13px; font-weight: 600; color: #8e8e93; margin: 4px 4px 6px;">真实主号身份</div>
                <div class="message-glass-effect" style="border-radius: 16px; padding: 12px 16px; display: flex; align-items: center; gap: 12px;">
                    <div id="message-main-identity-avatar" style="width: 44px; height: 44px; border-radius: 50%; background-color: #ffffff; display: flex; justify-content: center; align-items: center; overflow: hidden; flex-shrink: 0; box-shadow: 0 2px 8px rgba(0,0,0,0.08);">
                        <!-- 动态渲染用户头像 -->
                    </div>
                    <div style="flex: 1; min-width: 0;">
                        <div id="message-main-identity-name" style="font-size: 16px; font-weight: 600; color: #000; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">User (主号)</div>
                        <div id="message-main-identity-phone" style="font-size: 13px; color: #8e8e93; margin-top: 2px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">--</div>
                    </div>
                    <span style="font-size: 12px; color: #34c759; font-weight: 600; background: rgba(52, 199, 89, 0.12); padding: 4px 8px; border-radius: 8px; flex-shrink: 0;">默认主卡</span>
                </div>

                <!-- 伪装身份列表 -->
                <div style="display: flex; justify-content: space-between; align-items: center; margin: 16px 4px 6px;">
                    <span style="font-size: 13px; font-weight: 600; color: #8e8e93;">伪装身份列表</span>
                    <button id="message-open-create-disguise-btn" style="background: none; border: none; font-size: 14px; font-weight: 600; color: #007aff; cursor: pointer; padding: 0;">+ 创建伪装</button>
                </div>
                
                <div id="message-disguise-list-container" style="display: flex; flex-direction: column; gap: 8px;">
                    <!-- 动态渲染伪装身份卡片 -->
                </div>
            </div>
        </div>

        <!-- 创建伪装身份居中弹窗 -->
        <div id="message-create-disguise-modal" style="position: absolute; top: 0; left: 0; right: 0; bottom: 0; background: rgba(0, 0, 0, 0.4); backdrop-filter: blur(8px); -webkit-backdrop-filter: blur(8px); z-index: 200; display: none; justify-content: center; align-items: center; padding: 20px; box-sizing: border-box;">
            <div class="message-glass-effect" style="width: 100%; max-width: 320px; background: rgba(255, 255, 255, 0.92); border-radius: 24px; box-shadow: 0 16px 40px rgba(0,0,0,0.18); overflow: hidden; display: flex; flex-direction: column;">
                <div style="display: flex; justify-content: space-between; align-items: center; padding: 16px 18px 12px; border-bottom: 0.5px solid rgba(0,0,0,0.08);">
                    <div style="font-size: 17px; font-weight: 600; color: #000;">创建伪装身份</div>
                    <div id="message-create-disguise-close" style="width: 28px; height: 28px; background: rgba(0,0,0,0.05); border-radius: 50%; display: flex; justify-content: center; align-items: center; cursor: pointer;">
                        <svg viewBox="0 0 24 24" fill="none" stroke="#000" stroke-width="2" stroke-linecap="round" style="width: 15px; height: 15px;"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                    </div>
                </div>
                
                <div style="padding: 14px 18px; display: flex; flex-direction: column; gap: 12px;">
                    <div>
                        <div style="font-size: 13px; color: #8e8e93; margin-bottom: 6px; font-weight: 500;">伪装号码 / 身份名称</div>
                        <input type="text" id="message-create-disguise-number" placeholder="如 10086 或 匿名人士" style="width: 100%; height: 38px; border-radius: 10px; border: 1px solid rgba(0,0,0,0.1); background: #ffffff; padding: 0 12px; font-size: 15px; outline: none; box-sizing: border-box; text-overflow: ellipsis;">
                    </div>
                    <div>
                        <div style="font-size: 13px; color: #8e8e93; margin-bottom: 6px; font-weight: 500;">身份描述 / 备注说明</div>
                        <textarea id="message-create-disguise-desc" placeholder="输入关于此伪装身份的详细设定或骚扰说明..." style="width: 100%; height: 85px; border-radius: 10px; border: 1px solid rgba(0,0,0,0.1); background: #ffffff; padding: 10px 12px; font-size: 14px; outline: none; box-sizing: border-box; resize: none; font-family: inherit; line-height: 1.4;"></textarea>
                    </div>
                </div>

                <div style="padding: 10px 18px 16px;">
                    <button id="message-save-disguise-btn" style="width: 100%; height: 42px; background: #007aff; color: #fff; border: none; border-radius: 12px; font-size: 16px; font-weight: 600; cursor: pointer; box-shadow: 0 4px 12px rgba(0,122,255,0.25);">保存伪装身份</button>
                </div>
            </div>
        </div>

        <style>
            .message-chat-room {
                position: absolute;
                top: 0; left: 0; right: 0; bottom: 0;
                background-color: #ffffff;
                z-index: 200;
                display: flex;
                flex-direction: column;
                transform: translateX(100%);
                transition: transform 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
            }
            .message-chat-room.show {
                transform: translateX(0);
            }
            .message-chat-header {
                height: auto;
                padding-top: var(--message-top-inset, 54px);
                display: flex;
                align-items: flex-start;
                justify-content: space-between;
                padding-left: 16px;
                padding-right: 16px;
                position: absolute;
                top: 0; left: 0; right: 0;
                z-index: 10;
            }
            .message-chat-back {
                display: flex;
                align-items: center;
                justify-content: center;
                cursor: pointer;
                width: 40px;
                height: 40px;
                border-radius: 50%;
                flex-shrink: 0;
            }
            .message-chat-back svg {
                width: 24px; height: 24px;
                margin-left: -2px;
            }
            .message-chat-info {
                display: flex;
                flex-direction: column;
                align-items: center;
                flex: 1;
            }
            .message-chat-avatar {
                width: 64px; height: 64px;
                border-radius: 50%;
                background-color: #ffffff;
                overflow: hidden;
                display: flex;
                justify-content: center;
                align-items: center;
                z-index: 2;
            }
            .message-chat-avatar img {
                width: 100%; height: 100%; object-fit: cover;
            }
            .message-chat-avatar svg {
                width: 100%; height: 100%; fill: #8fa8d6; transform: scale(1.25);
            }
            .message-chat-name-capsule {
                display: flex;
                align-items: center;
                gap: 4px;
                padding: 6px 14px;
                border-radius: 20px;
                margin-top: -6px;
                z-index: 4;
            }
            .message-chat-name {
                font-size: 15px;
                font-weight: 600;
                color: #000;
            }
            .message-chat-name-capsule svg {
                width: 12px; height: 12px;
                stroke: #000;
            }
            .message-chat-video {
                width: 40px; height: 40px;
                border-radius: 50%;
                display: flex;
                justify-content: center;
                align-items: center;
                flex-shrink: 0;
            }
            .message-chat-video svg {
                width: 24px; height: 24px;
            }
            .message-chat-content {
                flex: 1;
                overflow-y: auto;
                padding: calc(var(--message-top-inset, 54px) + 86px) 16px calc(100px + var(--keyboard-inset-bottom, 0px) + var(--message-keyboard-content-extra-offset, 0px));
                display: flex;
                flex-direction: column;
            }
            .message-chat-footer {
                position: absolute;
                bottom: 20px; left: 16px; right: 16px;
                padding: 0;
                display: flex;
                align-items: center;
                gap: 12px;
                z-index: 10;
                background: transparent;
            }
            .message-chat-add {
                width: 40px; height: 40px;
                border-radius: 50%;
                display: flex;
                justify-content: center;
                align-items: center;
                flex-shrink: 0;
            }
            .message-chat-add svg {
                width: 24px; height: 24px;
            }
            .message-chat-input-wrap {
                flex: 1;
                position: relative;
                display: flex;
                align-items: center;
                height: 40px;
                border-radius: 20px;
            }
            .message-chat-input {
                width: 100%;
                height: 100%;
                border: none;
                padding: 0 40px 0 16px;
                font-size: 16px;
                outline: none;
                background: transparent;
            }
            .message-chat-voice {
                position: absolute;
                right: 6px;
                width: 28px;
                height: 28px;
                border-radius: 50%;
                background-color: #007aff;
                display: flex;
                justify-content: center;
                align-items: center;
            }
            .message-chat-voice svg {
                width: 16px; height: 16px;
                stroke: #ffffff;
                stroke-width: 2.5;
            }

            /* iMessage 气泡样式 (保留小尾巴 + 四周对称胶囊圆角) */
            .message-bubble-row {
                display: flex;
                margin-bottom: 8px;
                position: relative;
                z-index: 1;
            }
            .message-bubble-row.sent {
                justify-content: flex-end;
            }
            .message-bubble-row.received {
                justify-content: flex-start;
            }
            .message-bubble-row.tail {
                margin-bottom: 16px;
            }
            .message-imessage-bubble {
                padding: 9px 16px;
                border-radius: 18px;
                font-size: 16px;
                line-height: 1.35;
                max-width: 75%;
                position: relative;
                word-break: break-word;
                white-space: pre-wrap;
                box-sizing: border-box;
            }
            .message-imessage-bubble.received {
                background-color: #E5E5EA;
                color: #000000;
                border-radius: 18px;
            }
            .message-imessage-bubble.sent {
                background-color: #007AFF;
                color: #ffffff;
                border-radius: 18px;
            }
            
            /* 尾巴 (完整保留) */
            .message-bubble-row.received.tail .message-imessage-bubble::before {
                display: block; content: ''; position: absolute; z-index: -1;
                bottom: -5px; left: 3px; width: 18px; height: 16px;
                background-color: #E5E5EA;
                -webkit-mask-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 18 16' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M 18 0 Q 18 12 2.4 15.2 A 0.8 0.8 0 0 1 1.12 14.24 Q 7 10 4 0 Z'/%3E%3C/svg%3E");
                -webkit-mask-size: contain; -webkit-mask-repeat: no-repeat;
            }
            .message-bubble-row.sent.tail .message-imessage-bubble::before {
                display: block; content: ''; position: absolute; z-index: -1;
                bottom: -5px; right: 3px; width: 18px; height: 16px;
                background-color: #007AFF;
                -webkit-mask-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 18 16' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M 0 0 Q 0 12 15.6 15.2 A 0.8 0.8 0 0 0 16.88 14.24 Q 11 10 14 0 Z'/%3E%3C/svg%3E");
                -webkit-mask-size: contain; -webkit-mask-repeat: no-repeat;
            }
        </style>

        <!-- 聊天室页面 -->
        <div class="message-chat-room" id="message-chat-room">
            <!-- 顶部导航 -->
            <div class="message-chat-header">
                <div class="message-chat-back message-glass-effect" id="message-chat-back">
                    <svg viewBox="0 0 24 24" fill="none" stroke="#000" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="15 18 9 12 15 6"></polyline></svg>
                </div>
                <div class="message-chat-info">
                    <div class="message-chat-avatar" id="message-chat-avatar"></div>
                    <div class="message-chat-name-capsule message-glass-effect">
                        <div class="message-chat-name" id="message-chat-name"></div>
                        <svg viewBox="0 0 24 24" fill="none" stroke="#000" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="9 18 15 12 9 6"></polyline></svg>
                    </div>
                </div>
                <div class="message-chat-video message-glass-effect">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="#000"><path stroke-linecap="round" stroke-linejoin="round" d="m15.75 10.5 4.72-4.72a.75.75 0 0 1 1.28.53v11.38a.75.75 0 0 1-1.28.53l-4.72-4.72M4.5 18.75h9a2.25 2.25 0 0 0 2.25-2.25v-9a2.25 2.25 0 0 0-2.25-2.25h-9A2.25 2.25 0 0 0 2.25 7.5v9a2.25 2.25 0 0 0 2.25 2.25Z" /></svg>
                </div>
            </div>
            
            <!-- 聊天内容区 -->
            <div class="message-chat-content" id="message-chat-content">
                <!-- 消息气泡将在这里渲染 -->
            </div>

            <!-- 底部输入区 -->
            <div class="message-chat-footer">
                <div class="message-chat-add message-glass-effect" id="message-chat-magic-btn" title="调取AI回复" style="cursor: pointer; width: 40px; height: 40px; display: flex; justify-content: center; align-items: center;">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" id="Wand-Magic-Sparkles--Streamline-Font-Awesome" height="18" width="18">
                      <desc>
                        Wand Magic Sparkles Streamline Icon: https://streamlinehq.com
                      </desc>
                    <!--! Font Awesome Free 6.5.2 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free (Icons: CC BY 4.0, Fonts: SIL OFL 1.1, Code: MIT License) Copyright 2024 Fonticons, Inc.-->
                      <path d="m6.924883333333334 1.8530222222222221 -1.0866472222222223 0.4064111111111111c-0.08647222222222221 0.031705555555555556 -0.14411944444444444 0.11529444444444444 -0.14411944444444444 0.20753055555555555s0.05764722222222222 0.1758222222222222 0.14411944444444444 0.20752777777777776l1.0866472222222223 0.40641388888888885 0.4064111111111111 1.0866444444444443c0.031705555555555556 0.08647222222222221 0.11529444444444444 0.14411944444444444 0.20752777777777776 0.14411944444444444s0.17582499999999998 -0.05764722222222222 0.20753055555555555 -0.14411944444444444l0.4064111111111111 -1.0866444444444443 1.0866472222222223 -0.40641388888888885c0.08647222222222221 -0.031705555555555556 0.14411944444444444 -0.11529444444444444 0.14411944444444444 -0.20752777777777776s-0.05764722222222222 -0.17582499999999998 -0.14411944444444444 -0.20753055555555555l-1.0866472222222223 -0.4064111111111111 -0.4064111111111111 -1.0866472222222223c-0.031705555555555556 -0.08646944444444443 -0.11529444444444444 -0.14411666666666667 -0.20753055555555555 -0.14411666666666667s-0.1758222222222222 0.05764722222222222 -0.20752777777777776 0.14411666666666667l-0.4064111111111111 1.0866472222222223ZM1.4887638888888888 12.019080555555554c-0.5389999999999999 0.5389999999999999 -0.5389999999999999 1.4152361111111111 0 1.9571194444444444l0.9972944444444444 0.9972916666666667c0.5389999999999999 0.5389999999999999 1.4152361111111111 0.5389999999999999 1.9571194444444444 0l10.990411111111111 -10.993291666666666c0.5389999999999999 -0.5389999999999999 0.5389999999999999 -1.4152361111111111 0 -1.9571194444444444l-0.9972944444444444 -0.994411111111111c-0.5389999999999999 -0.5389999999999999 -1.4152361111111111 -0.5389999999999999 -1.9571194444444444 0L1.4887638888888888 12.019080555555554Zm12.639119444444445 -9.016 -3.026472222222222 3.026472222222222 -0.6715888888888888 -0.6715888888888888 3.026472222222222 -3.026472222222222 0.6715888888888888 0.6715888888888888ZM0.3761777777777778 4.000375c-0.12970833333333334 0.048999999999999995 -0.21617777777777777 0.17294166666666666 -0.21617777777777777 0.31129444444444443s0.08646944444444443 0.26229444444444444 0.21617777777777777 0.31129444444444443l1.6285277777777778 0.6110583333333334 0.6110583333333334 1.6285305555555554c0.048999999999999995 0.12970555555555557 0.17294166666666666 0.216175 0.31129444444444443 0.216175s0.26229444444444444 -0.08646944444444443 0.31129444444444443 -0.216175l0.6110583333333334 -1.6285305555555554 1.6285305555555554 -0.6110583333333334c0.12970555555555557 -0.048999999999999995 0.216175 -0.17294166666666666 0.216175 -0.31129444444444443s-0.08646944444444443 -0.26229444444444444 -0.216175 -0.31129444444444443l-1.6285305555555554 -0.6110583333333334 -0.6110583333333334 -1.6285305555555554c-0.048999999999999995 -0.12970555555555557 -0.17294166666666666 -0.216175 -0.31129444444444443 -0.216175s-0.26229444444444444 0.08646944444444443 -0.31129444444444443 0.216175l-0.6110583333333334 1.6285305555555554 -1.6285277777777778 0.6110583333333334Zm10.145880555555555 7.378824999999999c-0.12970555555555557 0.048999999999999995 -0.216175 0.17293888888888886 -0.216175 0.31129166666666663s0.08646944444444443 0.26229444444444444 0.216175 0.31129444444444443l1.6285305555555554 0.6110583333333334 0.6110583333333334 1.6285305555555554c0.048999999999999995 0.12970555555555557 0.17294166666666666 0.21617777777777777 0.31129444444444443 0.21617777777777777s0.26229444444444444 -0.08647222222222221 0.31129444444444443 -0.21617777777777777l0.6110583333333334 -1.6285305555555554 1.6285277777777778 -0.6110583333333334c0.12970833333333334 -0.048999999999999995 0.21617777777777777 -0.17294166666666666 0.21617777777777777 -0.31129444444444443s-0.08646944444444443 -0.26229444444444444 -0.21617777777777777 -0.31129444444444443l-1.6285277777777778 -0.6110583333333334 -0.6110583333333334 -1.6285277777777778c-0.048999999999999995 -0.12970555555555557 -0.17294166666666666 -0.21617777777777777 -0.31129444444444443 -0.21617777777777777s-0.26229444444444444 0.08647222222222221 -0.31129444444444443 0.21617777777777777l-0.6110583333333334 1.6285277777777778 -1.6285305555555554 0.6110583333333334Z" fill="#000000" stroke-width="0.0278"></path>
                    </svg>
                </div>
                <div class="message-chat-input-wrap message-glass-effect">
                    <input type="text" placeholder="iMessage 信息" class="message-chat-input" id="message-chat-input-el">
                    <div class="message-chat-voice" id="message-chat-send-btn">
                        <svg viewBox="0 0 24 24" fill="none" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="19" x2="12" y2="5"></line><polyline points="5 12 12 5 19 12"></polyline></svg>
                    </div>
                </div>
            </div>
        </div>
    `;

    async function init() {
        container = document.getElementById('messageAppUI');
        if (!container) return Promise.reject(new Error('未找到短信APP容器'));

        if (container.innerHTML.trim() === '') {
            container.innerHTML = appHTML;
            bindEvents();
        }

        // 异步从数据库读取短信数据
        await loadStorageData();

        renderList();
        return Promise.resolve();
    }

    function bindEvents() {
        const menuBtn = document.getElementById('message-menuBtn');
        const dropdownMenu = document.getElementById('message-dropdownMenu');
        const editBtn = document.getElementById('message-editBtn');
        const searchBar = document.querySelector('.message-search-capsule');
        if (searchBar) searchBar.addEventListener('click', () => {
            const area = searchBar.querySelector('.message-search-left');
            if (!area) return;
            let input = area.querySelector('input');
            if (!input) {
                area.textContent = '';
                input = document.createElement('input');
                input.type = 'search';
                input.className = 'message-search-input';
                input.placeholder = '搜索短信';
                input.setAttribute('aria-label', '搜索联系人与短信内容');
                input.addEventListener('input', () => {
                    smsSearchQuery = input.value.trim().toLowerCase();
                    renderList();
                });
                area.appendChild(input);
            }
            input.focus();
        });
        const readBtn = document.getElementById('message-readBtn');
        const deleteBtn = document.getElementById('message-deleteBtn');
        const exitBtn = document.getElementById('message-exitBtn');

        const chatRoom = document.getElementById('message-chat-room');
        const chatBackBtn = document.getElementById('message-chat-back');

        // 退出 APP
        if (exitBtn) {
            exitBtn.addEventListener('click', () => {
                close();
            });
        }

        // 退出聊天室
        if (chatBackBtn) {
            chatBackBtn.addEventListener('click', () => {
                chatRoom.classList.remove('show');
            });
        }

        // 菜单显示/隐藏
        menuBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            dropdownMenu.classList.toggle('show');
        });

        document.addEventListener('click', (e) => {
            if (dropdownMenu && !dropdownMenu.contains(e.target)) {
                dropdownMenu.classList.remove('show');
            }
        });

        // 编辑模式切换
        editBtn.addEventListener('click', () => {
            isEditMode = !isEditMode;
            if (isEditMode) {
                container.classList.add('edit-mode');
                editBtn.textContent = '完成';
            } else {
                container.classList.remove('edit-mode');
                editBtn.textContent = '编辑';
                // 退出编辑模式时，清空所有选中状态
                document.querySelectorAll('.message-item.selected').forEach(item => {
                    item.classList.remove('selected');
                });
                updateActionButtons();
            }
        });

        // 菜单项过滤切换
        const switchCategory = (category, title) => {
            currentCategory = category;
            const titleEl = document.getElementById('message-exitBtn');
            if (titleEl) titleEl.textContent = title;
            
            // 更新菜单中的勾选状态
            const menuItems = [
                { id: 'message-menu-all', cat: 'all' },
                { id: 'message-menu-unknown', cat: 'unknown' },
                { id: 'message-menu-spam', cat: 'spam' },
                { id: 'message-menu-deleted', cat: 'deleted' }
            ];
            menuItems.forEach(item => {
                const el = document.getElementById(item.id);
                if (!el) return;
                const existingCheck = el.querySelector('.message-check-icon');
                const existingHolder = el.querySelector('.message-check-placeholder');
                if (item.cat === category) {
                    if (!existingCheck) {
                        if (existingHolder) existingHolder.remove();
                        const checkSvg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
                        checkSvg.setAttribute('class', 'message-check-icon');
                        checkSvg.setAttribute('viewBox', '0 0 24 24');
                        checkSvg.innerHTML = '<path d="M4 12l5 5L20 7" stroke-linecap="round" stroke-linejoin="round"/>';
                        el.insertBefore(checkSvg, el.firstChild);
                    }
                } else {
                    if (existingCheck) {
                        existingCheck.remove();
                        const holder = document.createElement('div');
                        holder.className = 'message-check-placeholder';
                        el.insertBefore(holder, el.firstChild);
                    }
                }
            });

            // 切换“已读/恢复”按钮文案
            if (readBtn) {
                readBtn.textContent = (category === 'deleted') ? '恢复' : '已读';
            }

            dropdownMenu.classList.remove('show');
            renderList();
        };

        const menuAll = document.getElementById('message-menu-all');
        const menuUnknown = document.getElementById('message-menu-unknown');
        const menuSpam = document.getElementById('message-menu-spam');
        const menuDeleted = document.getElementById('message-menu-deleted');
        const menuIdentity = document.getElementById('message-menu-identity');

        if (menuAll) menuAll.addEventListener('click', () => switchCategory('all', '信息'));
        if (menuUnknown) menuUnknown.addEventListener('click', () => switchCategory('unknown', '未知发件人'));
        if (menuSpam) menuSpam.addEventListener('click', () => switchCategory('spam', '垃圾信息'));
        if (menuDeleted) menuDeleted.addEventListener('click', () => switchCategory('deleted', '最近删除'));

        const menuBusiness = document.getElementById('message-menu-business');
        if (menuBusiness) {
            menuBusiness.addEventListener('click', () => {
                dropdownMenu.classList.remove('show');
                if (window.BusinessApp && typeof window.BusinessApp.open === 'function') {
                    window.BusinessApp.open({ source: 'message' });
                } else if (typeof showToast === 'function') {
                    showToast('营业厅服务未连接');
                }
            });
        }

        // 身份管理抽屉逻辑
        const identitySheet = document.getElementById('message-identity-sheet');
        const identityCloseBtn = document.getElementById('message-identity-close');
        const openCreateDisguiseBtn = document.getElementById('message-open-create-disguise-btn');
        const createDisguiseModal = document.getElementById('message-create-disguise-modal');
        const createDisguiseClose = document.getElementById('message-create-disguise-close');
        const saveDisguiseBtn = document.getElementById('message-save-disguise-btn');

        // 读取真实 User 信息的辅助函数（严格读取手机号 phone，拒绝微信号）
        const getRealUserProfile = async () => {
            let userName = 'User';
            let userPhone = '--';
            let userAvatar = '';

            const readRecord = (key) => new Promise((resolve) => {
                try {
                    const req = indexedDB.open('iOSDesktopDB');
                    req.onerror = () => resolve(null);
                    req.onsuccess = () => {
                        const conn = req.result;
                        if (!conn.objectStoreNames.contains('layoutStore')) {
                            conn.close();
                            resolve(null);
                            return;
                        }
                        const tx = conn.transaction(['layoutStore'], 'readonly');
                        const getReq = tx.objectStore('layoutStore').get(key);
                        getReq.onsuccess = () => resolve(getReq.result ? (getReq.result.data || getReq.result) : null);
                        getReq.onerror = () => resolve(null);
                        tx.oncomplete = () => conn.close();
                    };
                } catch (e) {
                    resolve(null);
                }
            });

            // 1. 优先从角色库（contactsAppData）读取当前 User 的 phone 手机号
            try {
                const contactRecord = await readRecord('contactsAppData');
                const users = Array.isArray(contactRecord?.users) ? contactRecord.users : (Array.isArray(contactRecord?.data?.users) ? contactRecord.data.users : []);
                const currentUserId = (typeof appSettings !== 'undefined' && appSettings.wc_current_user_id) ? appSettings.wc_current_user_id : null;
                const currentUser = users.find(u => u.id === currentUserId) || users[0];
                if (currentUser) {
                    if (currentUser.name) userName = currentUser.name;
                    if (currentUser.phone) userPhone = currentUser.phone;
                    if (currentUser.avatar) userAvatar = currentUser.avatar;
                }
            } catch (e) {}

            // 2. 如果未读取到手机号，从账户数据（wechatAuthData）中读取 account.phone
            if (!userPhone || userPhone === '--') {
                try {
                    const authRecord = await readRecord('wechatAuthData');
                    const accounts = Array.isArray(authRecord?.accounts) ? authRecord.accounts : [];
                    const currentLoginWxid = authRecord?.currentLoginWxid;
                    const currentAcc = accounts.find(a => a.wxid === currentLoginWxid) || accounts[0];
                    if (currentAcc) {
                        if (currentAcc.phone) userPhone = currentAcc.phone;
                        if (!userAvatar && currentAcc.avatar) userAvatar = currentAcc.avatar;
                        if (userName === 'User' && currentAcc.name) userName = currentAcc.name;
                    }
                } catch (e) {}
            }

            // 3. 兜底获取名称与头像
            if (typeof appSettings !== 'undefined') {
                if (userName === 'User' && appSettings.wc_current_user_name) userName = appSettings.wc_current_user_name;
                if (!userAvatar && appSettings.wc_current_user_avatar) userAvatar = appSettings.wc_current_user_avatar;
            }

            return { name: userName, phone: userPhone, avatar: userAvatar };
        };

        // 获取并渲染真实主号与伪装身份列表
        const renderIdentitySheet = async () => {
            await loadStorageData();
            const profile = await getRealUserProfile();

            const mainNameEl = document.getElementById('message-main-identity-name');
            const mainPhoneEl = document.getElementById('message-main-identity-phone');
            const mainAvatarEl = document.getElementById('message-main-identity-avatar');

            if (mainNameEl) mainNameEl.textContent = `${profile.name} (主号)`;
            if (mainPhoneEl) mainPhoneEl.textContent = profile.phone;
            if (mainAvatarEl) {
                if (profile.avatar) {
                    mainAvatarEl.innerHTML = `<img src="${smsSafeHtml(profile.avatar)}" alt="User" style="width: 100%; height: 100%; object-fit: cover;">`;
                } else {
                    mainAvatarEl.innerHTML = `
                        <svg viewBox="0 0 16 16" aria-hidden="true" style="width: 100%; height: 100%; fill: #8fa8d6; transform: scale(1.25);">
                          <path fill-rule="evenodd" d="M12.456666666666665 12.731333333333334A6.482 6.482 0 0 0 14.5 8c0 -3.59 -2.91 -6.5 -6.5 -6.5S1.5 4.41 1.5 8a6.482 6.482 0 0 0 2.043333333333333 4.731333333333334A6.477333333333332 6.477333333333332 0 0 0 8 14.5a6.477333333333332 6.477333333333332 0 0 0 4.456666666666666 -1.7686666666666666Zm-8.36 -0.8566666666666666A4.990666666666666 4.990666666666666 0 0 1 8 10a4.990666666666666 4.990666666666666 0 0 1 3.9033333333333333 1.8746666666666665A5.482666666666667 5.482666666666667 0 0 1 8 13.5a5.482666666666667 5.482666666666667 0 0 1 -3.9033333333333333 -1.6253333333333333ZM10.5 6a2.5 2.5 0 1 1 -5 0 2.5 2.5 0 0 1 5 0Z" clip-rule="evenodd"></path>
                        </svg>
                    `;
                }
            }

            const listContainer = document.getElementById('message-disguise-list-container');
            if (!listContainer) return;
            listContainer.innerHTML = '';

            const identities = window.messageAppData.identities || [];
            if (identities.length === 0) {
                listContainer.innerHTML = '<div style="text-align: center; color: #8e8e93; font-size: 13px; padding: 24px 0;">暂无伪装身份，点击右上角创建</div>';
                return;
            }

            identities.forEach(ident => {
                const item = document.createElement('div');
                item.className = 'message-glass-effect';
                item.style.cssText = 'border-radius: 16px; padding: 12px 16px; display: flex; align-items: center; justify-content: space-between;';
                item.innerHTML = `
                    <div style="display: flex; align-items: center; gap: 10px; min-width: 0; flex: 1;">
                        <div style="width: 38px; height: 38px; border-radius: 50%; background: #ff9500; display: flex; justify-content: center; align-items: center; color: #fff; font-size: 16px; font-weight: bold; flex-shrink: 0;">
                            <svg viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="width: 20px; height: 20px;"><path d="M12 2a10 10 0 1 0 10 10A10 10 0 0 0 12 2zm0 18a8 8 0 1 1 8-8 8 8 0 0 1-8 8z"></path><circle cx="12" cy="17" r="1"></circle></svg>
                        </div>
                        <div style="min-width: 0; flex: 1;">
                            <div style="font-size: 15px; font-weight: 600; color: #000; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">${smsSafeHtml(ident.number)}</div>
                            <div style="font-size: 12px; color: #8e8e93; margin-top: 2px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">${smsSafeHtml(ident.desc || '未填写身份描述')}</div>
                        </div>
                    </div>
                    <button class="message-del-disguise-btn" data-id="${smsSafeHtml(ident.id)}" style="background: none; border: none; color: #ff3b30; font-size: 13px; cursor: pointer; padding: 4px 8px; flex-shrink: 0;">删除</button>
                `;

                const delBtn = item.querySelector('.message-del-disguise-btn');
                delBtn.addEventListener('click', (e) => {
                    e.stopPropagation();
                    window.messageAppData.identities = window.messageAppData.identities.filter(i => i.id !== ident.id);
                    window.saveMessageAppData();
                    renderIdentitySheet();
                });

                listContainer.appendChild(item);
            });
        };

        if (menuIdentity) {
            menuIdentity.addEventListener('click', () => {
                dropdownMenu.classList.remove('show');
                if (identitySheet) {
                    identitySheet.classList.add('show');
                    renderIdentitySheet();
                }
            });
        }

        if (identityCloseBtn) {
            identityCloseBtn.addEventListener('click', () => {
                identitySheet.classList.remove('show');
            });
        }

        if (openCreateDisguiseBtn) {
            openCreateDisguiseBtn.addEventListener('click', () => {
                if (createDisguiseModal) {
                    document.getElementById('message-create-disguise-number').value = '';
                    document.getElementById('message-create-disguise-desc').value = '';
                    createDisguiseModal.style.display = 'flex';
                }
            });
        }

        if (createDisguiseClose) {
            createDisguiseClose.addEventListener('click', () => {
                createDisguiseModal.style.display = 'none';
            });
        }

        if (saveDisguiseBtn) {
            saveDisguiseBtn.addEventListener('click', async () => {
                const numberInput = document.getElementById('message-create-disguise-number');
                const descInput = document.getElementById('message-create-disguise-desc');
                const num = numberInput.value.trim();
                const desc = descInput.value.trim();

                if (!num) {
                    numberInput.placeholder = '请输入伪装号码/名称！';
                    return;
                }

                await loadStorageData();
                if (!window.messageAppData.identities) window.messageAppData.identities = [];

                window.messageAppData.identities.unshift({
                    id: 'ident_' + Date.now(),
                    number: num,
                    desc: desc
                });

                window.saveMessageAppData();
                createDisguiseModal.style.display = 'none';
                renderIdentitySheet();
            });
        }

        // 删除选中项（非最近删除视图下移入回收站；最近删除视图下彻底删除）
        deleteBtn.addEventListener('click', () => {
            const selectedItems = document.querySelectorAll('.message-item.selected');
            const idsToDelete = Array.from(selectedItems).map(item => item.dataset.id);
            
            if (currentCategory === 'deleted') {
                window.messageAppData.conversations
                    .filter(conv => idsToDelete.includes(conv.id))
                    .forEach(removeSmsConversationMemoryEvents);
                window.messageAppData.conversations = window.messageAppData.conversations.filter(
                    conv => !idsToDelete.includes(conv.id)
                );
            } else {
                window.messageAppData.conversations.forEach(conv => {
                    if (idsToDelete.includes(conv.id)) {
                        conv.isDeleted = true;
                    }
                });
            }
            if (typeof window.saveMessageAppData === 'function') window.saveMessageAppData();

            selectedItems.forEach(item => {
                item.style.opacity = '0';
                item.style.height = '0';
                item.style.padding = '0';
                setTimeout(() => {
                    item.remove();
                }, 300);
            });
            
            setTimeout(() => {
                updateActionButtons();
                renderList();
            }, 300);
        });

        // 已读/恢复按钮
        readBtn.addEventListener('click', () => {
            const selectedItems = document.querySelectorAll('.message-item.selected');
            const ids = Array.from(selectedItems).map(item => item.dataset.id);

            if (currentCategory === 'deleted') {
                // 恢复选中的对话
                window.messageAppData.conversations.forEach(conv => {
                    if (ids.includes(conv.id)) {
                        conv.isDeleted = false;
                    }
                });
                void window.saveMessageAppData();
                renderList();
            } else {
                window.messageAppData.conversations.forEach(conv => {
                    if (ids.includes(String(conv.id))) conv.unreadCount = 0;
                });
                void window.saveMessageAppData();
                renderList();
            }

            selectedItems.forEach(item => {
                item.classList.remove('selected');
            });
            updateActionButtons();
        });

        // 新建消息抽屉与发件人切换逻辑
        const createBtn = document.querySelector('.message-create-circle');
        const newSheet = document.getElementById('message-new-sheet');
        const newCloseBtn = document.getElementById('message-new-close');
        const newAddBtn = document.getElementById('message-new-add-btn');
        const newToInput = document.getElementById('message-new-to-input');
        const contactsDropdown = document.getElementById('message-new-contacts-dropdown');
        const fromTrigger = document.getElementById('message-new-from-trigger');
        const fromInput = document.getElementById('message-new-from-input');
        const fromDropdown = document.getElementById('message-new-from-dropdown');

        let selectedSenderIdentity = { type: 'main', label: '主号' };

        const renderFromOptions = async () => {
            if (!fromDropdown) return;
            fromDropdown.innerHTML = '';
            await loadStorageData();
            const profile = await getRealUserProfile();

            let userAvatarHtml = '';
            if (profile.avatar) {
                userAvatarHtml = `<div class="message-new-contact-avatar" style="background-image: url('${smsSafeHtml(profile.avatar)}'); background-size: cover; background-position: center;"></div>`;
            } else {
                userAvatarHtml = `
                    <div class="message-new-contact-avatar">
                        <svg viewBox="0 0 16 16" aria-hidden="true">
                          <path fill-rule="evenodd" d="M12.456666666666665 12.731333333333334A6.482 6.482 0 0 0 14.5 8c0 -3.59 -2.91 -6.5 -6.5 -6.5S1.5 4.41 1.5 8a6.482 6.482 0 0 0 2.043333333333333 4.731333333333334A6.477333333333332 6.477333333333332 0 0 0 8 14.5a6.477333333333332 6.477333333333332 0 0 0 4.456666666666666 -1.7686666666666666Zm-8.36 -0.8566666666666666A4.990666666666666 4.990666666666666 0 0 1 8 10a4.990666666666666 4.990666666666666 0 0 1 3.9033333333333333 1.8746666666666665A5.482666666666667 5.482666666666667 0 0 1 8 13.5a5.482666666666667 5.482666666666667 0 0 1 -3.9033333333333333 -1.6253333333333333ZM10.5 6a2.5 2.5 0 1 1 -5 0 2.5 2.5 0 0 1 5 0Z" clip-rule="evenodd"></path>
                        </svg>
                    </div>
                `;
            }

            // 主号选项：显示 user 的头像、名称、手机号，并去除“真实手机号码：”前缀
            const mainItem = document.createElement('div');
            mainItem.className = 'message-new-contact-item';
            mainItem.innerHTML = `
                ${userAvatarHtml}
                <div class="message-new-contact-info">
                    <div class="message-new-contact-name">${smsSafeHtml(profile.name)} (主号)</div>
                    <div class="message-new-contact-sub">${smsSafeHtml(profile.phone)}</div>
                </div>
            `;
            mainItem.addEventListener('click', (e) => {
                e.stopPropagation();
                selectedSenderIdentity = { type: 'main', label: `${profile.name} (主号)`, phone: profile.phone };
                fromInput.value = `${profile.name} (主号)`;
                fromDropdown.classList.remove('show');
            });
            fromDropdown.appendChild(mainItem);

            // 伪装身份选项
            const identities = window.messageAppData.identities || [];
            identities.forEach(ident => {
                const item = document.createElement('div');
                item.className = 'message-new-contact-item';
                item.innerHTML = `
                    <div class="message-new-contact-avatar" style="background-color: #ff9500;"><svg viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" style="width: 20px; height: 20px;"><path d="M12 2a10 10 0 1 0 10 10A10 10 0 0 0 12 2zm0 18a8 8 0 1 1 8-8 8 8 0 0 1-8 8z"></path><circle cx="12" cy="17" r="1"></circle></svg></div>
                    <div class="message-new-contact-info">
                        <div class="message-new-contact-name">${smsSafeHtml(ident.number)} (伪装)</div>
                        <div class="message-new-contact-sub">${smsSafeHtml(ident.desc || '伪装身份')}</div>
                    </div>
                `;
                item.addEventListener('click', (e) => {
                    e.stopPropagation();
                    selectedSenderIdentity = { type: 'disguise', label: ident.number, desc: ident.desc };
                    fromInput.value = `${ident.number} (伪装)`;
                    fromDropdown.classList.remove('show');
                });
                fromDropdown.appendChild(item);
            });
        };

        if (fromTrigger) {
            fromTrigger.addEventListener('click', (e) => {
                e.stopPropagation();
                contactsDropdown.classList.remove('show');
                fromDropdown.classList.toggle('show');
                renderFromOptions();
            });
        }

        if (createBtn) {
            createBtn.addEventListener('click', () => {
                newSheet.classList.add('show');
                contactsDropdown.classList.remove('show');
                fromDropdown.classList.remove('show');
                newToInput.value = '';
                delete newToInput.dataset.contactId;
                selectedSenderIdentity = { type: 'main', label: '主号' };
                fromInput.value = '主号';
            });
        }

        if (newCloseBtn) {
            newCloseBtn.addEventListener('click', () => {
                newSheet.classList.remove('show');
            });
        }

        const showContacts = () => {
            if (fromDropdown) fromDropdown.classList.remove('show');
            contactsDropdown.classList.add('show');
            renderNewContacts(newToInput.value);
        };

        if (newAddBtn) newAddBtn.addEventListener('click', showContacts);
        
        if (newToInput) {
            newToInput.addEventListener('focus', showContacts);
            newToInput.addEventListener('click', showContacts);
            newToInput.addEventListener('input', (e) => {
                delete newToInput.dataset.contactId;
                contactsDropdown.classList.add('show');
                renderNewContacts(e.target.value);
            });
        }

        // 点击外部隐藏下拉框
        document.addEventListener('click', (e) => {
            if (newSheet && newSheet.classList.contains('show')) {
                if (!e.target.closest('.message-new-to-bar')) {
                    contactsDropdown.classList.remove('show');
                }
                if (!e.target.closest('#message-new-from-trigger')) {
                    fromDropdown.classList.remove('show');
                }
            }
        });

        // 新建消息发送逻辑
        const newMsgInput = document.getElementById('message-new-msg-input');
        const newSendBtn = document.getElementById('message-new-send-btn');

        const handleNewMessageSend = async () => {
            const text = newMsgInput.value.trim();
            const contactId = newToInput.dataset.contactId;
            
            if (!contactId && !newToInput.value.trim()) {
                const originalPlaceholder = newToInput.placeholder;
                newToInput.placeholder = "请先选择或输入收件人！";
                setTimeout(() => newToInput.placeholder = originalPlaceholder, 2000);
                return;
            }
            if (!text) return;

            const targetId = contactId || newToInput.value.trim();
            const requestAccount = getMessageStorageKey();
            const contacts = await getMessageRecipientContacts();
            if (requestAccount !== getMessageStorageKey()) return;
            const contact = contacts.find(c => String(c.id) === String(targetId));
            const displayName = contact ? (contact.remark || contact.name) : newToInput.value.trim();
            let conv = findConversation(window.messageAppData.conversations, targetId, displayName);
            const now = new Date();
            const timeStr = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;

            if (!conv) {
                conv = {
                    id: targetId,
                    sender: contact ? (contact.remark || contact.name) : newToInput.value.trim(),
                    date: timeStr,
                    updatedAt: Date.now(),
                    unreadCount: 0,
                    preview: text,
                    avatarType: contact && contact.avatar ? 'image' : 'default',
                    avatarUrl: contact ? contact.avatar : '',
                    category: 'all',
                    isDeleted: false,
                    messages: []
                };
                window.messageAppData.conversations.unshift(conv);
            } else {
                if (contactId && conv.id !== targetId) conv.id = targetId;
                if (displayName) conv.sender = displayName;
                conv.preview = text;
                conv.date = timeStr;
                conv.updatedAt = Date.now();
                conv.isDeleted = false;
                if (!conv.messages) conv.messages = [];
            }

            // 如果使用伪装身份，附带伪装标识
            const msgObj = {
                id: 'msg_' + Date.now(),
                text: text,
                type: 'sent',
                time: Date.now(),
                senderIdentity: { ...selectedSenderIdentity }
            };
            conv.activeSenderIdentity = { ...selectedSenderIdentity };

            // 正确存入真实 messages 数组
            conv.messages.push(msgObj);
            observeSmsMemoryEvent(conv, msgObj, 'user');

            if (typeof window.saveMessageAppData === 'function') window.saveMessageAppData();
            
            // 发送短信扣费一角钱
            deductSmsFeeAndCheckWarning();

            // 关闭抽屉并清理输入
            newSheet.classList.remove('show');
            newMsgInput.value = '';
            newToInput.value = '';
            delete newToInput.dataset.contactId;
            
            // 渲染列表并打开聊天室
            renderList();
            openChatRoom(conv);
        };

        if (newSendBtn) newSendBtn.addEventListener('click', handleNewMessageSend);

        // 聊天室内直接发送消息逻辑与魔法棒调取 API
        const chatRoomFooter = document.querySelector('.message-chat-footer');
        if (chatRoomFooter) {
            const chatVoiceBtn = document.getElementById('message-chat-send-btn') || chatRoomFooter.querySelector('.message-chat-voice');
            const chatInput = document.getElementById('message-chat-input-el') || chatRoomFooter.querySelector('.message-chat-input');
            const magicBtn = document.getElementById('message-chat-magic-btn');

            const sendInChat = () => {
                if (!currentChatConv || !chatInput) return;
                const text = chatInput.value.trim();
                if (!text) return;

                if (!currentChatConv.messages) currentChatConv.messages = [];
                const msgObj = {
                    id: 'msg_' + Date.now() + '_' + Math.random().toString(16).slice(2),
                    text: text,
                    type: 'sent',
                    time: Date.now(),
                    senderIdentity: { ...(currentChatConv.activeSenderIdentity || [...currentChatConv.messages].reverse().find(m => m.type === 'sent' && m.senderIdentity)?.senderIdentity || { type: 'main', label: '主号' }) }
                };
                currentChatConv.messages.push(msgObj);
                observeSmsMemoryEvent(currentChatConv, msgObj, 'user');

                const now = new Date();
                currentChatConv.preview = text;
                currentChatConv.date = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;
                currentChatConv.updatedAt = Date.now();
                
                if (typeof window.saveMessageAppData === 'function') window.saveMessageAppData();
                
                // 发送短信扣费一角钱
                deductSmsFeeAndCheckWarning();

                chatInput.value = '';
                
                const contentEl = document.getElementById('message-chat-content');
                if (contentEl) {
                    const row = smsBubbleRow(msgObj, currentChatConv.sender);
                    contentEl.appendChild(row);
                    setTimeout(() => {
                        contentEl.scrollTop = contentEl.scrollHeight;
                    }, 50);
                }
                renderList();
            };

            if (chatVoiceBtn) chatVoiceBtn.addEventListener('click', sendInChat);
            if (chatInput) {
                chatInput.addEventListener('keydown', (e) => {
                    if (e.key === 'Enter' && !e.shiftKey && !e.isComposing) {
                        e.preventDefault();
                        sendInChat();
                    }
                });
            }

            if (magicBtn) {
                magicBtn.addEventListener('click', () => {
                    requestSmsApiReply();
                });
            }
        }
    }

    // 发送短信扣除 0.10 元话费并检测是否触发 10086 欠费带链接提醒
    function deductSmsFeeAndCheckWarning() {
        const task = smsFeeQueue.catch(() => {}).then(async () => {
        const getAccountId = () => (typeof appSettings !== 'undefined' && appSettings.wc_current_user_id) ? appSettings.wc_current_user_id : 'default';
        const accountId = getAccountId();
        const recordKey = `wechatBusinessData_${accountId}`;
        const savedData = await msgReadLayoutRecord(recordKey) || { balance: 30.00, bills: [] };
        
        let currentBalance = typeof savedData.balance === 'number' ? savedData.balance : 30.00;
        let bills = Array.isArray(savedData.bills) ? savedData.bills : [];
        
        // 扣除 0.10 元 (1角)
        const fee = 0.10;
        currentBalance = Number((currentBalance - fee).toFixed(2));
        
        const now = Date.now();
        bills.unshift({
            id: 'bill_' + now,
            title: '短信通信费',
            type: 'cost',
            amount: fee,
            time: now
        });

        // Each debit must commit before the next send reads the balance.
        await new Promise((resolve, reject) => {
            if (typeof db === 'undefined' || !db || typeof storeName === 'undefined') {
                reject(new Error('Business store unavailable'));
                return;
            }
            try {
                const tx = db.transaction([storeName], 'readwrite');
                tx.objectStore(storeName).put({ id: recordKey, balance: currentBalance, bills });
                tx.oncomplete = () => resolve(true);
                tx.onerror = () => reject(tx.error || new Error('Business debit failed'));
                tx.onabort = () => reject(tx.error || new Error('Business debit aborted'));
            } catch (error) { reject(error); }
        });

        // 当话费不足 1.00 元或接近零/已欠费时，触发 10086 提醒短信（内含可点击直接进入营业厅的蓝色下划线网址）
        if (currentBalance <= 1.00) {
            const pad = (n) => String(n).padStart(2, '0');
            const d = new Date(now);
            const timeStr = `${pad(d.getMonth() + 1)}月${pad(d.getDate())}日 ${pad(d.getHours())}:${pad(d.getMinutes())}`;
            
            const warningText = currentBalance <= 0 
                ? `【中国移动】尊敬的客户：截至 ${timeStr}，您的手机话费已欠费（余额：${currentBalance.toFixed(2)}元），将暂停部分通信服务。为避免影响您的正常使用，请点击 <a href="javascript:void(0)" onclick="if(window.BusinessApp)window.BusinessApp.open({source:\'message\'})" style="color: #007aff; text-decoration: underline; font-weight: 600; cursor: pointer;">http://10086.cn/pay</a> 立即充值话费。`
                : `【中国移动】尊敬的客户：截至 ${timeStr}，您的话费余额已不足 ${currentBalance.toFixed(2)} 元，即将欠费停机。请点击 <a href="javascript:void(0)" onclick="if(window.BusinessApp)window.BusinessApp.open({source:\'message\'})" style="color: #007aff; text-decoration: underline; font-weight: 600; cursor: pointer;">http://10086.cn/pay</a> 及时充值。`;

            setTimeout(() => {
                if (getAccountId() === accountId) void receiveMessage('10086', warningText);
            }, 600);
        }
        });
        smsFeeQueue = task;
        void task.catch(error => {
            console.error('SMS billing failed:', error);
            if (typeof showToast === 'function') showToast('短信话费扣费保存失败');
        });
        return task;
    }

    // 辅助：从数据库异步读取指定表记录
    function msgReadLayoutRecord(id) {
        if (typeof db !== 'undefined' && db && typeof storeName !== 'undefined' && db.objectStoreNames.contains(storeName)) {
            return new Promise((resolve) => {
                const tx = db.transaction([storeName], 'readonly');
                const req = tx.objectStore(storeName).get(id);
                req.onsuccess = () => resolve(req.result || null);
                req.onerror = () => resolve(null);
            });
        }
        return new Promise((resolve) => {
            const req = indexedDB.open('iOSDesktopDB');
            req.onerror = () => resolve(null);
            req.onsuccess = () => {
                const conn = req.result;
                if (!conn.objectStoreNames.contains('layoutStore')) {
                    conn.close();
                    resolve(null);
                    return;
                }
                const tx = conn.transaction(['layoutStore'], 'readonly');
                const getReq = tx.objectStore('layoutStore').get(id);
                getReq.onsuccess = () => resolve(getReq.result || null);
                getReq.onerror = () => resolve(null);
                tx.oncomplete = () => conn.close();
            };
        });
    }

    // 短信 APP 点击魔法棒触发 API 回复逻辑（与微信 App 一致，且上下文与微信互通）
    const SMS_CROSS_APP_HISTORY_MAX_AGE_MS = 7 * 24 * 60 * 60 * 1000;
    const SMS_CROSS_APP_HISTORY_LIMIT = 8;

    function normalizeSmsContextTimestamp(value) {
        if (value instanceof Date) return value.getTime();
        const numeric = Number(value);
        if (Number.isFinite(numeric) && numeric > 0) {
            return numeric < 1e12 ? numeric * 1000 : numeric;
        }
        const parsed = Date.parse(String(value || ''));
        return Number.isFinite(parsed) ? parsed : 0;
    }

    function isRecentSmsCrossAppMessage(message, now = Date.now()) {
        const timestamp = normalizeSmsContextTimestamp(message?.createdAt ?? message?.time ?? 0);
        if (!timestamp || timestamp > now + 5 * 60 * 1000) return false;
        return now - timestamp <= SMS_CROSS_APP_HISTORY_MAX_AGE_MS;
    }

    let smsApiReplyPending = false;
    async function requestSmsApiReply() {
        if (smsApiReplyPending) return;
        if (!currentChatConv) {
            if (typeof showToast === 'function') showToast('请先打开一个短信会话');
            return;
        }

        const requestConversation = currentChatConv;
        const requestAccount = getMessageStorageKey();
        const api = (typeof apiDataList !== 'undefined' && Array.isArray(apiDataList))
            ? apiDataList.find(item => item.id === (typeof apiConnectedId !== 'undefined' ? apiConnectedId : null))
            : null;

        if (!api?.url || !api?.key || !api?.model) {
            if (typeof showToast === 'function') showToast('请先在 API 连接中配置并连接一个模型');
            return;
        }

        const magicBtn = document.getElementById('message-chat-magic-btn');
        if (magicBtn) {
            magicBtn.style.pointerEvents = 'none';
            magicBtn.style.opacity = '0.5';
        }
        smsApiReplyPending = true;

        const contentEl = document.getElementById('message-chat-content');
        const thinkingRow = document.createElement('div');
        thinkingRow.className = 'message-bubble-row received tail';
        thinkingRow.id = 'sms-thinking-indicator';
        thinkingRow.innerHTML = `<div class="message-imessage-bubble received" style="color: #8e8e93; font-style: italic;">对方正在输入...</div>`;
        if (contentEl) {
            contentEl.appendChild(thinkingRow);
            contentEl.scrollTop = contentEl.scrollHeight;
        }

        try {
            // 1. 读取上下文限制条数
            let contextLimit = 100;
            if (typeof appSettings !== 'undefined' && appSettings.wc_context_memory_limit) {
                const parsedLimit = parseInt(appSettings.wc_context_memory_limit);
                if (!isNaN(parsedLimit) && parsedLimit > 0) contextLimit = parsedLimit;
            }

            // 2. 匹配角色库与微信联系人
            const contactRecord = await msgReadLayoutRecord('contactsAppData');
            const users = Array.isArray(contactRecord?.data?.users) ? contactRecord.data.users : (Array.isArray(contactRecord?.users) ? contactRecord.users : []);
            const originalContacts = Array.isArray(contactRecord?.data?.contacts) ? contactRecord.data.contacts : (Array.isArray(contactRecord?.contacts) ? contactRecord.contacts : []);

            const currentUserId = (typeof appSettings !== 'undefined' && appSettings.wc_current_user_id) ? appSettings.wc_current_user_id : null;
            const currentUser = users.find(u => u.id === currentUserId) || users[0];
            const userPersona = currentUser?.persona || '';
            const username = (typeof appSettings !== 'undefined' && appSettings.wc_current_user_name) ? appSettings.wc_current_user_name : (currentUser?.name || 'User');

            let contactsList = getWechatMessageContacts();
            const targetContactId = requestConversation.id;
            const targetSender = (requestConversation.sender || '').toLowerCase();

            const matchedContact = contactsList.find(c => {
                if (!c) return false;
                const cId = String(c.id || '').toLowerCase();
                const cLinked = String(c.linkedContactId || '').toLowerCase();
                const cName = String(c.name || '').toLowerCase();
                const cRemark = String(c.remark || '').toLowerCase();
                const cPhone = String(c.phone || '').toLowerCase();
                const cAccount = String(c.account || '').toLowerCase();
                return cId === String(targetContactId).toLowerCase() ||
                    cLinked === String(targetContactId).toLowerCase() ||
                    cName === targetSender ||
                    cRemark === targetSender ||
                    cPhone === targetSender ||
                    cAccount === targetSender;
            });

            const originalContact = originalContacts.find(c => c && (
                c.id === matchedContact?.linkedContactId
                || c.id === targetContactId
                || `char_${c.id}` === targetContactId
                || String(c.name || '').toLowerCase() === targetSender
            ));
            const charName = matchedContact?.remark || matchedContact?.name || originalContact?.name || requestConversation.sender || '对方';
            const charPersona = originalContact?.persona || matchedContact?.persona || matchedContact?.desc || '';

            // 3. 构建合并上下文（严格区分伪装身份与 User 手机主号）
            let rawHistoryList = [];

            // A. 收集短信自身消息
            if (Array.isArray(requestConversation.messages)) {
                requestConversation.messages.forEach(m => {
                    if (!m || !m.text) return;
                    let textContent = m.text;
                    let isSent = m.type === 'sent';

                    if (isSent) {
                        // 如果是伪装身份发送，明确说明位置短信和身份描述
                        if (m.senderIdentity && m.senderIdentity.type === 'disguise') {
                            textContent = `[来自伪装号码 ${m.senderIdentity.label}（身份描述：${m.senderIdentity.desc || '未知'}）的短信]: ${textContent}`;
                        } else {
                            // 主号发送：不需要注入伪装身份
                            textContent = `[短信] ${textContent}`;
                        }
                    } else {
                        textContent = `[短信] ${textContent}`;
                    }

                    rawHistoryList.push({
                        role: isSent ? 'user' : 'assistant',
                        content: textContent,
                        timestamp: normalizeSmsContextTimestamp(m.time || m.createdAt || 0)
                    });
                });
            }

            // CrossAppBridge injects the recent WeChat context exactly once.
            const wechatContactId = matchedContact?.id || (originalContact ? `char_${originalContact.id}` : null);

            // 按时间排序并截取最近 limit 条
            rawHistoryList.sort((a, b) => a.timestamp - b.timestamp);
            const finalHistory = rawHistoryList.slice(-contextLimit).map(item => ({
                role: item.role,
                content: item.content
            }));

            // 4. 读取世界书
            let wbTop = '', wbBeforePersona = '', wbAfterPersona = '', wbBottom = '';
            const historyText = finalHistory.map(m => String(m.content || '')).join('\n').toLowerCase();

            if (typeof wbEntries !== 'undefined' && Array.isArray(wbEntries)) {
                const boundWbIds = Array.isArray(originalContact?.worldbookIds) ? originalContact.worldbookIds : [];
                const activeWbs = wbEntries.filter(e => !e.isDeleted && (e.isGlobal || boundWbIds.includes(e.id)));

                activeWbs.forEach(wb => {
                    let isTriggered = false;
                    if (!wb.key || wb.key.trim() === '') {
                        isTriggered = true;
                    } else {
                        const keys = wb.key.split(',').map(k => k.trim().toLowerCase()).filter(Boolean);
                        isTriggered = keys.some(k => historyText.includes(k));
                    }

                    if (isTriggered) {
                        const position = wb.position || 'after_persona';
                        const content = `[${wb.title}]: ${wb.content}`;
                        if (position === 'top') wbTop += content + '\n';
                        else if (position === 'before_persona' || position.includes('前置')) wbBeforePersona += content + '\n';
                        else if (position === 'bottom') wbBottom += content + '\n';
                        else wbAfterPersona += content + '\n';
                    }
                });
            }

            // 5. 读取选择的提示词
            let activePromptId = (typeof appSettings !== 'undefined' && appSettings.wc_active_prompt_id !== undefined) ? appSettings.wc_active_prompt_id : 'year_above';
            let builtinPos = (typeof appSettings !== 'undefined' && appSettings.wc_builtin_prompt_position) || 'before_persona';
            let customPromptsList = (typeof appSettings !== 'undefined' && appSettings.wc_custom_prompts_list) || [];

            let finalPromptText = '';
            let finalPromptPos = builtinPos;

            if (activePromptId === 'builtin' && typeof window.WC_BUILTIN_PROMPT_SOURCE === 'string') {
                finalPromptText = window.WC_BUILTIN_PROMPT_SOURCE.replace(/\{\{user\}\}|\$\{username\}/gi, username).replace(/\{\{char\}\}|\$\{charname\}/gi, charName).trim() + '\n\n';
            } else if (activePromptId === 'year_above' && typeof window.WC_YEAR_ABOVE_PROMPT_SOURCE === 'string') {
                finalPromptText = window.WC_YEAR_ABOVE_PROMPT_SOURCE.replace(/\{\{user\}\}|\$\{username\}/gi, username).replace(/\{\{char\}\}|\$\{charname\}/gi, charName).trim() + '\n\n';
            } else if (activePromptId && activePromptId !== 'builtin' && activePromptId !== 'year_above') {
                const cp = customPromptsList.find(p => p.id === activePromptId);
                if (cp && cp.content) {
                    const nowForVar = new Date();
                    const timeStrForVar = `${nowForVar.getFullYear()}-${String(nowForVar.getMonth() + 1).padStart(2, '0')}-${String(nowForVar.getDate()).padStart(2, '0')} ${String(nowForVar.getHours()).padStart(2, '0')}:${String(nowForVar.getMinutes()).padStart(2, '0')}`;
                    finalPromptText = cp.content.replace(/\$\{charname\}/gi, charName).replace(/\$\{username\}/gi, username).replace(/\$\{time\}/gi, timeStrForVar) + '\n\n';
                }
            }

            // 6. 组装 System Prompt
            let systemPrompt = '';
            if (wbTop) systemPrompt += `<world_settings>\n${wbTop}</world_settings>\n\n`;
            if (finalPromptText && finalPromptPos === 'top') systemPrompt += finalPromptText;

            if (wbBeforePersona) systemPrompt += `<world_settings>\n${wbBeforePersona}</world_settings>\n\n`;
            if (finalPromptText && finalPromptPos === 'before_persona') systemPrompt += finalPromptText;

            if (charPersona) {
                systemPrompt += `<char_settings>\n角色名：${charName}\n角色人设：\n${charPersona}\n</char_settings>\n\n`;
            }
            if (userPersona) {
                systemPrompt += `<user_settings>\n用户：${username}\n用户人设：\n${userPersona}\n</user_settings>\n\n`;
            }

            // 记忆与摘要
            if (wechatContactId && typeof window.MemoryApp?.getPromptMemories === 'function') {
                const memories = window.MemoryApp.getPromptMemories(wechatContactId, 6);
                if (memories && memories.length > 0) {
                    systemPrompt += `<shared_memory>\n${memories.map(m => `- ${m}`).join('\n')}\n</shared_memory>\n\n`;
                }
            }
            if (wechatContactId && typeof window.MemoryApp?.getPromptSummary === 'function') {
                const summary = window.MemoryApp.getPromptSummary(wechatContactId);
                if (summary) {
                    systemPrompt += `<recent_memory_summary>\n${summary}\n</recent_memory_summary>\n\n`;
                }
            }

            // 时间与天气感知
            if (typeof appSettings === 'undefined' || appSettings.wc_time_awareness_enabled !== false) {
                const now = new Date();
                systemPrompt += `【当前现实时间】：${now.getFullYear()}年${now.getMonth() + 1}月${now.getDate()}日 ${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}。\n\n`;
            }
            if (typeof appSettings !== 'undefined' && appSettings.wc_weather_awareness_enabled !== false && typeof wcGetRealWeather === 'function') {
                const charLoc = matchedContact?.weatherLocation || '';
                const weatherStr = await wcGetRealWeather(charLoc);
                if (weatherStr) systemPrompt += `【当前天气信息】：${weatherStr}\n\n`;
            }

            if (wbAfterPersona) systemPrompt += `<world_settings>\n${wbAfterPersona}</world_settings>\n\n`;
            if (finalPromptText && finalPromptPos === 'after_persona') systemPrompt += finalPromptText;
            if (wbBottom) systemPrompt += `<world_settings>\n${wbBottom}</world_settings>\n\n`;
            if (finalPromptText && finalPromptPos === 'bottom') systemPrompt += finalPromptText;

            // 思维链配置
            let activeCotId = (typeof appSettings !== 'undefined' && appSettings.wc_active_cot_id !== undefined) ? appSettings.wc_active_cot_id : 'none';
            const isCotEnabled = activeCotId !== 'none';

            systemPrompt += `【环境设定与回复格式】\n`;
            systemPrompt += `你现在正通过手机短信 (iMessage) 与对方交流。注意：上下文历史中可能包含标注为 [微信] 和 [短信] 的对话内容。如果消息标注为伪装号码，说明对方使用了伪装身份给你发短信；如果未标注伪装身份，说明是用户的真实手机号发来的。\n`;
            systemPrompt += `你必须严格输出合法的 JSON 格式，messages 数组中包含多条短信气泡短句：\n`;

            if (isCotEnabled) {
                systemPrompt += `{"thinking":"你的内心思考与情绪推理","messages":[{"type":"text","content":"第一句短信"},{"type":"text","content":"第二句短信"}]}\n`;
            } else {
                systemPrompt += `{"messages":[{"type":"text","content":"第一句短信"},{"type":"text","content":"第二句短信"}]}\n`;
            }
            systemPrompt += `严禁输出任何 Markdown 标记或解释性文字，只输出纯 JSON！`;

            // 7. 发起 API 请求
            const apiUrl = (api.url.endsWith('/chat/completions')) ? api.url : `${api.url.replace(/\/+$/, '')}/chat/completions`;
            const payload = {
                model: api.model,
                temperature: api.temperature !== undefined ? api.temperature : 0.8,
                messages: [{ role: 'system', content: systemPrompt }, ...finalHistory]
            };

            const resp = await fetch(apiUrl, {
                method: 'POST',
                headers: {
                    'Authorization': 'Bearer ' + api.key,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(payload)
            });

            if (!resp.ok) {
                const errText = await resp.text();
                throw new Error(`API HTTP ${resp.status}: ${errText.slice(0, 100)}`);
            }

            const result = await resp.json();
            let rawReply = result?.choices?.[0]?.message?.content ?? result?.choices?.[0]?.text ?? '';
            rawReply = String(rawReply).replace(/^```(?:json)?\s*/i, '').replace(/\s*```$/i, '').trim();

            // 8. 解析回复内容
            let replyMsgs = [];
            try {
                const parsed = JSON.parse(rawReply);
                if (Array.isArray(parsed)) replyMsgs = parsed;
                else if (Array.isArray(parsed.messages)) replyMsgs = parsed.messages;
            } catch (e) {
                const regex = /\{\s*"type"\s*:\s*"text"\s*,\s*"content"\s*:\s*"([^"\\]*(?:\\.[^"\\]*)*)"\s*\}/g;
                let match;
                while ((match = regex.exec(rawReply)) !== null) {
                    try { replyMsgs.push({ type: 'text', content: JSON.parse(`"${match[1]}"`) }); }
                    catch(err) { replyMsgs.push({ type: 'text', content: match[1] }); }
                }
                if (replyMsgs.length === 0 && !rawReply.startsWith('{') && !rawReply.startsWith('[')) {
                    rawReply.split('\n').map(l => l.trim()).filter(Boolean).forEach(line => {
                        replyMsgs.push({ type: 'text', content: line.replace(/^["',\s]+|["',\s]+$/g, '') });
                    });
                }
            }

            replyMsgs = replyMsgs.filter(message => message?.type === 'text' && String(message.content || '').trim());
            if (!replyMsgs.length) throw new Error('短信 AI 回复为空或无法解析');
            if (requestAccount !== getMessageStorageKey() || !window.messageAppData?.conversations?.includes(requestConversation) || requestConversation.isDeleted) return;

            // 移除思考指示器
            const thinkingEl = document.getElementById('sms-thinking-indicator');
            if (thinkingEl) thinkingEl.remove();

            // 9. 渲染短信并持久化
            if (!requestConversation.messages) requestConversation.messages = [];
            const now = new Date();
            const timeStr = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;

            replyMsgs.forEach(rm => {
                const text = String(rm.content || '').trim();
                if (!text) return;
                const receivedMessage = {
                    id: 'msg_' + Date.now() + '_' + Math.random().toString(16).slice(2),
                    text: text,
                    type: 'received',
                    time: Date.now()
                };
                requestConversation.messages.push(receivedMessage);
                observeSmsMemoryEvent(currentChatConv, receivedMessage, 'character');

                if (contentEl && currentChatConv === requestConversation) contentEl.appendChild(smsBubbleRow(receivedMessage, requestConversation.sender));
            });

            requestConversation.preview = replyMsgs[replyMsgs.length - 1]?.content || requestConversation.preview;
            requestConversation.date = timeStr;
            requestConversation.updatedAt = Date.now();
            if (currentChatConv !== requestConversation || !document.getElementById('message-chat-room')?.classList.contains('show')) requestConversation.unreadCount = (Number(requestConversation.unreadCount) || 0) + replyMsgs.length;
            void window.saveMessageAppData();
            renderList();

            if (contentEl && currentChatConv === requestConversation) contentEl.scrollTop = contentEl.scrollHeight;

            // 记忆队列同步
            if (wechatContactId && typeof wcQueueChatMemoryTurn === 'function') {
                wcQueueChatMemoryTurn(api, wechatContactId);
            }

        } catch (error) {
            console.error('短信 API 回复失败:', error);
            const thinkingEl = document.getElementById('sms-thinking-indicator');
            if (thinkingEl) thinkingEl.remove();
            if (typeof showToast === 'function') showToast(error?.message || '获取 API 回复失败');
        } finally {
            smsApiReplyPending = false;
            if (magicBtn) {
                magicBtn.style.pointerEvents = '';
                magicBtn.style.opacity = '';
            }
        }
    }

    function updateActionButtons() {
        const readBtn = document.getElementById('message-readBtn');
        const deleteBtn = document.getElementById('message-deleteBtn');
        const selectedCount = document.querySelectorAll('.message-item.selected').length;
        
        if (selectedCount > 0) {
            readBtn.disabled = false;
            deleteBtn.disabled = false;
        } else {
            readBtn.disabled = true;
            deleteBtn.disabled = true;
        }
    }

    function renderList() {
        const wrapper = document.getElementById('message-items-wrapper');
        if (!wrapper) return;
        wrapper.innerHTML = '';

        const allConversations = window.messageAppData.conversations || [];
        
        // 动态计算“未知发件人”数量并更新菜单显示
        const unknownCount = allConversations.filter(c => !c.isDeleted && c.category === 'unknown').length;
        const unknownMenuText = document.getElementById('message-menu-unknown-text');
        if (unknownMenuText) {
            unknownMenuText.textContent = unknownCount > 0 ? `未知发件人 (${unknownCount})` : '未知发件人';
        }

        // 根据当前分类过滤
        const conversations = allConversations.filter(conv => {
            if (currentCategory === 'deleted') {
                return conv.isDeleted === true;
            }
            if (conv.isDeleted) return false;
            if (currentCategory === 'unknown') return conv.category === 'unknown';
            if (currentCategory === 'spam') return conv.category === 'spam';
            return conv.category !== 'spam'; // 'all' 模式显示常规及未知发件人
        }).filter(conv => {
            if (!smsSearchQuery) return true;
            if ([conv.sender, conv.preview].some(value => String(value || '').toLowerCase().includes(smsSearchQuery))) return true;
            return (conv.messages || []).some(message => String(message?.text || '').toLowerCase().includes(smsSearchQuery));
        }).sort((a, b) => {
            const timestamp = conv => Number(conv.updatedAt || conv.messages?.[conv.messages.length - 1]?.time || 0);
            return timestamp(b) - timestamp(a);
        });
        
        if (conversations.length === 0) {
            let emptyTip = '点击左上角的“信息”退出页面 Ｏ(≧▽≦)Ｏ';
            if (smsSearchQuery) emptyTip = '未找到相关短信';
            else if (currentCategory === 'unknown') emptyTip = '无未知发件人信息';
            else if (currentCategory === 'spam') emptyTip = '垃圾信息箱为空';
            else if (currentCategory === 'deleted') emptyTip = '最近删除箱为空';
            wrapper.innerHTML = `<div style="text-align: center; color: #8e8e93; font-size: 14px; margin-top: 80px; line-height: 2;">${emptyTip}</div>`;
            return;
        }

        conversations.forEach(conv => {
            const item = document.createElement('div');
            item.className = 'message-item';
            item.dataset.id = conv.id;

            // 头像渲染逻辑
            let avatarHTML = '';
            if (conv.avatarType === 'image' && conv.avatarUrl) {
                avatarHTML = `<div class="message-avatar" style="background: transparent;"><img src="${smsSafeHtml(conv.avatarUrl)}" alt="${smsSafeHtml(conv.sender)}"></div>`;
            } else {
                avatarHTML = `
                    <div class="message-avatar">
                        <svg viewBox="0 0 16 16" aria-hidden="true">
                          <path fill-rule="evenodd" d="M12.456666666666665 12.731333333333334A6.482 6.482 0 0 0 14.5 8c0 -3.59 -2.91 -6.5 -6.5 -6.5S1.5 4.41 1.5 8a6.482 6.482 0 0 0 2.043333333333333 4.731333333333334A6.477333333333332 6.477333333333332 0 0 0 8 14.5a6.477333333333332 6.477333333333332 0 0 0 4.456666666666666 -1.7686666666666666Zm-8.36 -0.8566666666666666A4.990666666666666 4.990666666666666 0 0 1 8 10a4.990666666666666 4.990666666666666 0 0 1 3.9033333333333333 1.8746666666666665A5.482666666666667 5.482666666666667 0 0 1 8 13.5a5.482666666666667 5.482666666666667 0 0 1 -3.9033333333333333 -1.6253333333333333ZM10.5 6a2.5 2.5 0 1 1 -5 0 2.5 2.5 0 0 1 5 0Z" clip-rule="evenodd"></path>
                        </svg>
                    </div>
                `;
            }

            item.innerHTML = `
                <div class="message-select-wrapper">
                    <div class="message-select-circle"><svg viewBox="0 0 24 24"><path d="M4 12l5 5L20 7" stroke-linecap="round" stroke-linejoin="round"/></svg></div>
                </div>
                ${avatarHTML}
                <div class="message-content">
                    <div class="message-header">
                        <span class="message-sender">${smsSafeHtml(conv.sender)}</span>
                        <div class="message-date-wrap">
                            <span>${smsSafeHtml(conv.date)}</span>
                            <svg class="message-chevron" width="8" height="12" viewBox="0 0 8 12"><path d="M1.5 0L0 1.5L4.5 6L0 10.5L1.5 12L7.5 6L1.5 0Z"/></svg>
                        </div>
                    </div>
                    <div class="message-preview">${smsSafeHtml(conv.preview)}</div>
                    ${Number(conv.unreadCount || 0) > 0 ? `<span class="message-unread-pill">${Math.min(99, Number(conv.unreadCount))}</span>` : ''}
                </div>
            `;

            // 列表项点击逻辑
            item.addEventListener('click', (e) => {
                if (isEditMode) {
                    item.classList.toggle('selected');
                    updateActionButtons();
                } else {
                    // 正常模式下点击，打开聊天详情
                    openChatRoom(conv);
                }
            });

            wrapper.appendChild(item);
        });
    }

    async function open() {
        if (!container || container.innerHTML.trim() === '') {
            await init();
        }
        if (container) {
            container.style.display = 'flex';
            await loadStorageData();
            if (currentChatConv && !window.messageAppData.conversations.includes(currentChatConv)) {
                currentChatConv = null;
                document.getElementById('message-chat-room')?.classList.remove('show');
            }
            renderList();
        }
    }

    function close() {
        if (container) {
            container.style.display = 'none';
            if (isEditMode) {
                document.getElementById('message-editBtn').click(); // 退出编辑模式
            }
        }
    }

    function openChatRoom(conv) {
        if (!conv) return;
        currentChatConv = conv;
        if (Number(conv.unreadCount || 0) > 0) {
            conv.unreadCount = 0;
            void window.saveMessageAppData();
            renderList();
        }
        const chatRoom = document.getElementById('message-chat-room');
        const nameEl = document.getElementById('message-chat-name');
        const avatarEl = document.getElementById('message-chat-avatar');
        const contentEl = document.getElementById('message-chat-content');
        
        if (!chatRoom || !nameEl || !avatarEl || !contentEl) return;

        nameEl.textContent = conv.sender || '';

        if (conv.avatarType === 'image' && conv.avatarUrl) {
            avatarEl.innerHTML = `<img src="${smsSafeHtml(conv.avatarUrl)}" alt="${smsSafeHtml(conv.sender)}">`;
        } else {
            avatarEl.innerHTML = `<svg viewBox="0 0 16 16" aria-hidden="true"><path fill-rule="evenodd" d="M12.456666666666665 12.731333333333334A6.482 6.482 0 0 0 14.5 8c0 -3.59 -2.91 -6.5 -6.5 -6.5S1.5 4.41 1.5 8a6.482 6.482 0 0 0 2.043333333333333 4.731333333333334A6.477333333333332 6.477333333333332 0 0 0 8 14.5a6.477333333333332 6.477333333333332 0 0 0 4.456666666666666 -1.7686666666666666Zm-8.36 -0.8566666666666666A4.990666666666666 4.990666666666666 0 0 1 8 10a4.990666666666666 4.990666666666666 0 0 1 3.9033333333333333 1.8746666666666665A5.482666666666667 5.482666666666667 0 0 1 8 13.5a5.482666666666667 5.482666666666667 0 0 1 -3.9033333333333333 -1.6253333333333333ZM10.5 6a2.5 2.5 0 1 1 -5 0 2.5 2.5 0 0 1 5 0Z" clip-rule="evenodd"></path></svg>`;
        }

        // 渲染真实消息
        contentEl.innerHTML = '';
        if (Array.isArray(conv.messages)) {
            conv.messages.forEach(msg => {
                const row = smsBubbleRow(msg, conv.sender);
                contentEl.appendChild(row);
            });
        }

        chatRoom.classList.add('show');
        
        // 滚动到底部
        setTimeout(() => {
            contentEl.scrollTop = contentEl.scrollHeight;
        }, 50);
    }

    // 仿 iOS 灵动岛/顶部消息横幅弹窗
    function showIosMessageBanner(sender, text) {
        let banner = document.getElementById('ios-message-top-banner');
        if (!banner) {
            const bannerHtml = `
                <div id="ios-message-top-banner" style="position: fixed; top: max(56px, calc(var(--system-top-inset, 0px) + 8px), calc(var(--simulated-status-bar-bottom, 0px) + 2px)); left: 50%; transform: translateX(-50%) translateY(-120%); width: 92%; max-width: 360px; background: rgba(255, 255, 255, 0.85); backdrop-filter: blur(25px) saturate(180%); -webkit-backdrop-filter: blur(25px) saturate(180%); border-radius: 20px; box-shadow: 0 10px 30px rgba(0,0,0,0.15), 0 0 0 0.5px rgba(0,0,0,0.06); padding: 12px 16px; display: flex; align-items: center; gap: 12px; z-index: 10000; cursor: pointer; transition: transform 0.4s cubic-bezier(0.32, 0.72, 0, 1), opacity 0.4s; opacity: 0;">
                    <div style="width: 38px; height: 38px; border-radius: 10px; background: #34C759; display: flex; justify-content: center; align-items: center; color: #fff; flex-shrink: 0;">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" id="Imessage-Logo--Streamline-Logos" height="24" width="24">
                          <desc>
                            Imessage Logo Streamline Icon: https://streamlinehq.com
                          </desc>
                          <path fill="#ffffff" d="m4.16 21.633 -0.002 0.002 -0.79 0.741 1.076 0.12a7.785 7.785 0 0 0 2.691 -0.199c0.891 -0.234 1.828 -0.688 2.422 -1.532 0.786 0.154 1.604 0.235 2.443 0.235 6 0 11 -4.184 11 -9.5S18 2 12 2 1 6.184 1 11.5c0 3.236 1.866 6.065 4.668 7.77 -0.086 0.471 -0.377 0.994 -0.723 1.462a7.726 7.726 0 0 1 -0.773 0.89l-0.012 0.011Z" stroke-width="1"></path>
                        </svg>
                    </div>
                    <div style="flex: 1; min-width: 0; display: flex; flex-direction: column; gap: 2px;">
                        <div style="display: flex; justify-content: space-between; align-items: center;">
                            <span id="ios-banner-sender" style="font-size: 14px; font-weight: 700; color: #1C1C1E;">10086</span>
                            <span style="font-size: 11px; color: #8E8E93;">现在</span>
                        </div>
                        <div id="ios-banner-text" style="font-size: 13px; color: #3A3A3C; line-height: 1.3; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;"></div>
                    </div>
                </div>
            `;
            document.body.insertAdjacentHTML('beforeend', bannerHtml);
            banner = document.getElementById('ios-message-top-banner');
        }

        const senderEl = document.getElementById('ios-banner-sender');
        const textEl = document.getElementById('ios-banner-text');
        if (senderEl) senderEl.innerText = sender || '信息';
        if (textEl) textEl.innerText = text || '';

        banner.onclick = async () => {
            banner.style.transform = 'translateX(-50%) translateY(-120%)';
            banner.style.opacity = '0';
            if (typeof MessageApp !== 'undefined' && typeof MessageApp.open === 'function') {
                await MessageApp.open();
                const conv = (window.messageAppData?.conversations || []).find(c => c.id === sender || c.sender === sender);
                if (conv) openChatRoom(conv);
            }
        };

        // 弹出动画
        requestAnimationFrame(() => {
            banner.style.transform = 'translateX(-50%) translateY(0)';
            banner.style.opacity = '1';
        });

        // 4秒后自动收起
        clearTimeout(banner._dismissTimer);
        banner._dismissTimer = setTimeout(() => {
            banner.style.transform = 'translateX(-50%) translateY(-120%)';
            banner.style.opacity = '0';
        }, 4000);
    }

    // 接收并存储外部消息接口
    async function receiveMessage(sender, text, options = {}) {
        const targetAccount = getMessageStorageKey();
        await loadStorageData();
        if (targetAccount !== getMessageStorageKey()) return false;
        const displayName = String(options.displayName || sender || '').trim();
        const contacts = await getMessageRecipientContacts();
        if (targetAccount !== getMessageStorageKey()) return false;
        const known = String(sender) === '10086' || contacts.some(c => [c.id, c.name, c.remark, c.phone].some(k => messageKeyMatches(k, sender)));
        let conv = findConversation(window.messageAppData.conversations, sender, displayName);
        const now = new Date();
        const timeStr = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;

        if (!conv) {
            conv = {
                id: sender,
                sender: displayName,
                date: timeStr,
                preview: text,
                avatarType: 'default',
                avatarUrl: '',
                category: known ? 'all' : 'unknown',
                isDeleted: false,
                unreadCount: 0,
                updatedAt: Date.now(),
                messages: []
            };
            window.messageAppData.conversations.unshift(conv);
        } else {
            if (sender && conv.id !== sender) conv.id = sender;
            if (displayName) conv.sender = displayName;
            conv.date = timeStr;
            conv.preview = text;
            conv.updatedAt = Date.now();
            conv.isDeleted = false;
            if (!conv.messages) conv.messages = [];
        }

        const viewing = currentChatConv === conv && document.getElementById('message-chat-room')?.classList.contains('show') && container?.style.display !== 'none';
        conv.unreadCount = viewing ? 0 : (Number(conv.unreadCount) || 0) + 1;
        conv.messages.push({
            id: 'sms_' + Date.now() + '_' + Math.random().toString(16).slice(2),
            text: text,
            type: 'received',
            time: Date.now()
        });

        await window.saveMessageAppData();
        renderList();
        if (viewing) openChatRoom(conv);
        showIosMessageBanner(sender, text);
    }

    async function renderNewContacts(keyword = '') {
        const dropdown = document.getElementById('message-new-contacts-dropdown');
        if (!dropdown) return;
        dropdown.innerHTML = '';

        let contacts = await getMessageRecipientContacts();

        const lowerKeyword = keyword.toLowerCase().trim();
        if (lowerKeyword) {
            contacts = contacts.filter(c => {
                const name = (c.remark || c.name || '').toLowerCase();
                const phone = (c.phone || '').toLowerCase();
                const account = (c.account || '').toLowerCase();
                return name.includes(lowerKeyword) || phone.includes(lowerKeyword) || account.includes(lowerKeyword);
            });
        }

        if (contacts.length === 0) {
            dropdown.innerHTML = '<div style="padding: 20px; text-align: center; color: #8e8e93; font-size: 14px;">无匹配联系人</div>';
            return;
        }

        contacts.forEach(contact => {
            const item = document.createElement('div');
            item.className = 'message-new-contact-item';
            
            let avatarHtml = '';
            if (contact.avatar) {
                avatarHtml = `<div class="message-new-contact-avatar" style="background-image: url('${smsSafeHtml(contact.avatar)}')"></div>`;
            } else {
                avatarHtml = `<div class="message-new-contact-avatar"><svg viewBox="0 0 16 16"><path fill-rule="evenodd" d="M12.456666666666665 12.731333333333334A6.482 6.482 0 0 0 14.5 8c0 -3.59 -2.91 -6.5 -6.5 -6.5S1.5 4.41 1.5 8a6.482 6.482 0 0 0 2.043333333333333 4.731333333333334A6.477333333333332 6.477333333333332 0 0 0 8 14.5a6.477333333333332 6.477333333333332 0 0 0 4.456666666666666 -1.7686666666666666Zm-8.36 -0.8566666666666666A4.990666666666666 4.990666666666666 0 0 1 8 10a4.990666666666666 4.990666666666666 0 0 1 3.9033333333333333 1.8746666666666665A5.482666666666667 5.482666666666667 0 0 1 8 13.5a5.482666666666667 5.482666666666667 0 0 1 -3.9033333333333333 -1.6253333333333333ZM10.5 6a2.5 2.5 0 1 1 -5 0 2.5 2.5 0 0 1 5 0Z" clip-rule="evenodd"></path></svg></div>`;
            }

            const subText = contact.phone || contact.account || (contact.isMessageRole ? '角色联系人' : '未知号码');

            item.innerHTML = `
                ${avatarHtml}
                <div class="message-new-contact-info">
                    <div class="message-new-contact-name">${smsSafeHtml(contact.remark || contact.name)}</div>
                    <div class="message-new-contact-sub">${smsSafeHtml(subText)}</div>
                </div>
            `;

            item.addEventListener('click', (e) => {
                e.stopPropagation();
                const inputEl = document.getElementById('message-new-to-input');
                inputEl.value = contact.remark || contact.name;
                inputEl.dataset.contactId = contact.id;
                dropdown.classList.remove('show');
            });

            dropdown.appendChild(item);
        });
    }

    return {
        init,
        persist: () => window.saveMessageAppData(),
        open,
        close,
        receiveMessage,
        showIosMessageBanner
    };
})();
