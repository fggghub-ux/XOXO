// WeChat Moments publishing, comments, and profile feed. Extracted without behavior changes.

    // ==========================================
    // 微信发布朋友圈逻辑
    // ==========================================

    let wcComposeImages = [];

    let wcComposeLocation = null;
    let wcComposeRemindContactIds = [];
    let wcComposeVisibility = { mode: 'public', contactIds: [], groupIds: [], resolvedContactIds: [] };
    let wcMomentPickerKind = '';
    let wcMomentPickerDraft = null;

    function wcMomentEscapeHtml(value) {
        return String(value ?? '').replace(/[&<>"']/g, (char) => ({
            '&': '&amp;',
            '<': '&lt;',
            '>': '&gt;',
            '"': '&quot;',
            "'": '&#39;'
        }[char]));
    }

    function wcGetMomentContactName(contact) {
        return String(contact?.remark || contact?.name || '未命名好友').trim() || '未命名好友';
    }

    function wcResolveMomentAudienceIds(visibility) {
        const directIds = new Set((Array.isArray(visibility?.contactIds) ? visibility.contactIds : []).map(id => String(id)));
        const groupIds = new Set((Array.isArray(visibility?.groupIds) ? visibility.groupIds : []).map(id => String(id)));
        if (groupIds.size > 0 && Array.isArray(wcContactsList)) {
            wcContactsList.forEach(contact => {
                if (contact?.id && groupIds.has(String(contact.groupId || ''))) {
                    directIds.add(String(contact.id));
                }
            });
        }
        return Array.from(directIds);
    }

    function wcCanContactSeeMoment(post, contactId) {
        if (!post || post.authorType !== 'user') return true;
        const visibility = post.visibility;
        if (!visibility || !visibility.mode || visibility.mode === 'public') return true;

        const targetId = String(contactId || '');
        if (!targetId) return visibility.mode === 'exclude';
        const selectedIds = Array.isArray(visibility.resolvedContactIds)
            ? visibility.resolvedContactIds.map(id => String(id))
            : wcResolveMomentAudienceIds(visibility);
        const selected = selectedIds.includes(targetId);
        return visibility.mode === 'include' ? selected : !selected;
    }
    window.wcCanContactSeeMoment = wcCanContactSeeMoment;

    function wcResetComposeMetadata() {
        wcComposeLocation = null;
        wcComposeRemindContactIds = [];
        wcComposeVisibility = { mode: 'public', contactIds: [], groupIds: [], resolvedContactIds: [] };
        wcUpdateComposeOptionValues();
    }

    function wcUpdateComposeOptionValues() {
        const locationValue = document.getElementById('wcComposeLocationValue');
        const remindValue = document.getElementById('wcComposeRemindValue');
        const visibilityValue = document.getElementById('wcComposeVisibilityValue');

        if (locationValue) {
            locationValue.textContent = wcComposeLocation?.name || '';
            locationValue.classList.toggle('has-value', Boolean(wcComposeLocation?.name));
        }

        if (remindValue) {
            const selectedContacts = wcComposeRemindContactIds
                .map(id => wcContactsList.find(contact => String(contact?.id || '') === String(id)))
                .filter(Boolean);
            remindValue.textContent = selectedContacts.length === 0
                ? ''
                : selectedContacts.length <= 2
                    ? selectedContacts.map(wcGetMomentContactName).join('、')
                    : `${selectedContacts.length}人`;
            remindValue.classList.toggle('has-value', selectedContacts.length > 0);
        }

        if (visibilityValue) {
            if (wcComposeVisibility.mode === 'public') {
                visibilityValue.textContent = '公开';
            } else {
                const count = wcResolveMomentAudienceIds(wcComposeVisibility).length;
                visibilityValue.textContent = wcComposeVisibility.mode === 'include' ? `给${count}人看` : `不给${count}人看`;
            }
        }
    }

    function wcOpenComposeLocationPicker() {
        if (typeof window.wcOpenLocationPicker !== 'function') {
            if (typeof showToast === 'function') showToast('位置选择器暂不可用');
            return;
        }
        window.wcOpenLocationPicker({
            title: '所在位置',
            confirmText: '完成',
            onSelect: (location) => {
                if (!location) return;
                wcComposeLocation = {
                    name: String(location.name || '').trim(),
                    address: String(location.address || '').trim(),
                    lat: Number(location.lat),
                    lon: Number(location.lon)
                };
                wcUpdateComposeOptionValues();
            }
        });
    }
    window.wcOpenComposeLocationPicker = wcOpenComposeLocationPicker;

    function wcEnsureMomentPickerOverlay() {
        let overlay = document.getElementById('wcMomentPickerOverlay');
        if (overlay) return overlay;
        const app = document.getElementById('wechatAppUI');
        if (!app) return null;

        app.insertAdjacentHTML('beforeend', `
            <div class="wc-moment-picker-overlay" id="wcMomentPickerOverlay" style="display:none;">
                <div class="wc-moment-picker-header">
                    <button type="button" class="wc-moment-picker-nav-btn" data-moment-picker-action="cancel">取消</button>
                    <div class="wc-moment-picker-title" id="wcMomentPickerTitle">选择</div>
                    <button type="button" class="wc-moment-picker-nav-btn primary" data-moment-picker-action="done">完成</button>
                </div>
                <div class="wc-moment-picker-body" id="wcMomentPickerBody"></div>
            </div>
        `);
        overlay = document.getElementById('wcMomentPickerOverlay');
        overlay?.addEventListener('click', wcHandleMomentPickerClick);
        return overlay;
    }

    function wcMomentPickerCheckMarkup(selected, radio = false) {
        return `
            <span class="wc-moment-picker-check ${selected ? 'selected' : ''} ${radio ? 'radio' : ''}">
                <svg viewBox="0 0 24 24"><path d="M5 12.5 9.3 17 19 7.5"></path></svg>
            </span>
        `;
    }

    function wcRenderMomentPicker() {
        const body = document.getElementById('wcMomentPickerBody');
        const title = document.getElementById('wcMomentPickerTitle');
        if (!body || !title || !wcMomentPickerDraft) return;

        if (wcMomentPickerKind === 'remind') {
            title.textContent = '提醒谁看';
            const selectedIds = new Set(wcMomentPickerDraft.contactIds.map(id => String(id)));
            const contactRows = wcContactsList.map(contact => {
                const id = String(contact?.id || '');
                const name = wcMomentEscapeHtml(wcGetMomentContactName(contact));
                const avatar = String(contact?.avatar || '').trim();
                const avatarHtml = avatar
                    ? `<img src="${wcMomentEscapeHtml(avatar)}" alt="">`
                    : '<span class="wc-moment-picker-avatar-fallback"></span>';
                return `
                    <button type="button" class="wc-moment-picker-row" data-moment-contact-id="${wcMomentEscapeHtml(id)}">
                        <span class="wc-moment-picker-avatar">${avatarHtml}</span>
                        <span class="wc-moment-picker-row-main"><span class="wc-moment-picker-row-title">${name}</span></span>
                        ${wcMomentPickerCheckMarkup(selectedIds.has(id))}
                    </button>
                `;
            }).join('');
            body.innerHTML = `
                <div class="wc-moment-picker-section-title">微信好友</div>
                <div class="wc-moment-picker-card">
                    ${contactRows || '<div class="wc-moment-picker-empty">当前还没有微信好友</div>'}
                </div>
            `;
            return;
        }

        title.textContent = '谁可以看';
        const mode = wcMomentPickerDraft.mode;
        const modeRows = [
            ['public', '公开', '所有微信好友可见'],
            ['include', '给谁看', '仅所选联系人或分组可见'],
            ['exclude', '不给谁看', '所选联系人或分组不可见']
        ].map(([value, label, detail]) => `
            <button type="button" class="wc-moment-picker-row" data-moment-privacy-mode="${value}">
                <span class="wc-moment-picker-row-main">
                    <span class="wc-moment-picker-row-title">${label}</span>
                    <span class="wc-moment-picker-row-detail">${detail}</span>
                </span>
                ${wcMomentPickerCheckMarkup(mode === value, true)}
            </button>
        `).join('');

        let audienceHtml = '';
        if (mode !== 'public') {
            const selectedGroupIds = new Set(wcMomentPickerDraft.groupIds.map(id => String(id)));
            const selectedContactIds = new Set(wcMomentPickerDraft.contactIds.map(id => String(id)));

            const groupRows = wcContactGroups.map(group => {
                const groupId = String(group?.id || '');
                const memberCount = wcContactsList.filter(contact => String(contact?.groupId || '') === groupId).length;
                return `
                    <button type="button" class="wc-moment-picker-row" data-moment-group-id="${wcMomentEscapeHtml(groupId)}">
                        <span class="wc-moment-picker-row-main">
                            <span class="wc-moment-picker-row-title">${wcMomentEscapeHtml(group?.name || '未命名分组')}</span>
                            <span class="wc-moment-picker-row-detail">${memberCount} 位联系人</span>
                        </span>
                        ${wcMomentPickerCheckMarkup(selectedGroupIds.has(groupId))}
                    </button>
                `;
            }).join('');

            const contactRows = wcContactsList.map(contact => {
                const id = String(contact?.id || '');
                const group = wcContactGroups.find(item => String(item?.id || '') === String(contact?.groupId || ''));
                const avatar = String(contact?.avatar || '').trim();
                const avatarHtml = avatar
                    ? `<img src="${wcMomentEscapeHtml(avatar)}" alt="">`
                    : '<span class="wc-moment-picker-avatar-fallback"></span>';
                return `
                    <button type="button" class="wc-moment-picker-row" data-moment-contact-id="${wcMomentEscapeHtml(id)}">
                        <span class="wc-moment-picker-avatar">${avatarHtml}</span>
                        <span class="wc-moment-picker-row-main">
                            <span class="wc-moment-picker-row-title">${wcMomentEscapeHtml(wcGetMomentContactName(contact))}</span>
                            <span class="wc-moment-picker-row-detail">${wcMomentEscapeHtml(group?.name || '未分组')}</span>
                        </span>
                        ${wcMomentPickerCheckMarkup(selectedContactIds.has(id))}
                    </button>
                `;
            }).join('');

            audienceHtml = `
                <div class="wc-moment-picker-section-title">分组</div>
                <div class="wc-moment-picker-card">${groupRows || '<div class="wc-moment-picker-empty">暂无分组</div>'}</div>
                <div class="wc-moment-picker-section-title">联系人</div>
                <div class="wc-moment-picker-card">${contactRows || '<div class="wc-moment-picker-empty">当前还没有微信好友</div>'}</div>
            `;
        }

        body.innerHTML = `
            <div class="wc-moment-picker-section-title">可见范围</div>
            <div class="wc-moment-picker-card">${modeRows}</div>
            ${audienceHtml}
        `;
    }

    function wcToggleMomentPickerId(key, id) {
        if (!wcMomentPickerDraft) return;
        const current = Array.isArray(wcMomentPickerDraft[key]) ? wcMomentPickerDraft[key] : [];
        const value = String(id || '');
        wcMomentPickerDraft[key] = current.includes(value)
            ? current.filter(item => item !== value)
            : [...current, value];
    }

    function wcHandleMomentPickerClick(event) {
        const action = event.target.closest('[data-moment-picker-action]')?.dataset.momentPickerAction;
        if (action === 'cancel') {
            wcCloseMomentPicker();
            return;
        }
        if (action === 'done') {
            wcConfirmMomentPicker();
            return;
        }

        const modeRow = event.target.closest('[data-moment-privacy-mode]');
        if (modeRow && wcMomentPickerKind === 'privacy') {
            wcMomentPickerDraft.mode = modeRow.dataset.momentPrivacyMode;
            if (wcMomentPickerDraft.mode === 'public') {
                wcMomentPickerDraft.contactIds = [];
                wcMomentPickerDraft.groupIds = [];
            }
            wcRenderMomentPicker();
            return;
        }

        const groupRow = event.target.closest('[data-moment-group-id]');
        if (groupRow && wcMomentPickerKind === 'privacy') {
            wcToggleMomentPickerId('groupIds', groupRow.dataset.momentGroupId);
            wcRenderMomentPicker();
            return;
        }

        const contactRow = event.target.closest('[data-moment-contact-id]');
        if (contactRow) {
            wcToggleMomentPickerId('contactIds', contactRow.dataset.momentContactId);
            wcRenderMomentPicker();
        }
    }

    function wcOpenMomentPicker(kind) {
        const overlay = wcEnsureMomentPickerOverlay();
        if (!overlay) return;
        wcMomentPickerKind = kind;
        wcMomentPickerDraft = kind === 'remind'
            ? { contactIds: [...wcComposeRemindContactIds] }
            : {
                mode: wcComposeVisibility.mode || 'public',
                contactIds: [...(wcComposeVisibility.contactIds || [])],
                groupIds: [...(wcComposeVisibility.groupIds || [])]
            };
        wcRenderMomentPicker();
        overlay.style.display = 'flex';
        requestAnimationFrame(() => overlay.classList.add('show'));
    }

    function wcCloseMomentPicker() {
        const overlay = document.getElementById('wcMomentPickerOverlay');
        if (overlay) {
            overlay.classList.remove('show');
            setTimeout(() => {
                if (!overlay.classList.contains('show')) overlay.style.display = 'none';
            }, 260);
        }
        wcMomentPickerKind = '';
        wcMomentPickerDraft = null;
    }
    window.wcCloseMomentPicker = wcCloseMomentPicker;

    function wcConfirmMomentPicker() {
        if (!wcMomentPickerDraft) return;

        if (wcMomentPickerKind === 'remind') {
            wcComposeRemindContactIds = [...wcMomentPickerDraft.contactIds];
        } else if (wcMomentPickerKind === 'privacy') {
            const nextVisibility = {
                mode: wcMomentPickerDraft.mode || 'public',
                contactIds: [...wcMomentPickerDraft.contactIds],
                groupIds: [...wcMomentPickerDraft.groupIds]
            };
            const resolvedContactIds = wcResolveMomentAudienceIds(nextVisibility);
            if (nextVisibility.mode !== 'public' && resolvedContactIds.length === 0) {
                if (typeof showToast === 'function') showToast('请选择至少一位联系人或分组');
                return;
            }
            wcComposeVisibility = {
                ...nextVisibility,
                resolvedContactIds: nextVisibility.mode === 'public' ? [] : resolvedContactIds
            };
            wcComposeRemindContactIds = wcComposeRemindContactIds.filter(contactId =>
                wcCanContactSeeMoment({ authorType: 'user', visibility: wcComposeVisibility }, contactId)
            );
        }

        wcUpdateComposeOptionValues();
        wcCloseMomentPicker();
    }

    function wcOpenComposeReminderPicker() {
        wcOpenMomentPicker('remind');
    }
    window.wcOpenComposeReminderPicker = wcOpenComposeReminderPicker;

    function wcOpenComposeVisibilityPicker() {
        wcOpenMomentPicker('privacy');
    }
    window.wcOpenComposeVisibilityPicker = wcOpenComposeVisibilityPicker;

    async function wcAppendRemindedMomentComments(post, contacts) {
        if (typeof wcAppendCharCommentToUserMoment !== 'function') return;
        for (const contact of contacts) {
            if (!wcCanContactSeeMoment(post, contact?.id)) continue;
            await wcAppendCharCommentToUserMoment(post, contact);
        }
    }


    function wcTriggerComposeImageUpload() {
        document.getElementById('wcComposeImageInput').click();
    }
    window.wcTriggerComposeImageUpload = wcTriggerComposeImageUpload;

    function wcHandleComposeImageUpload(event) {
        const files = event.target.files;
        if (!files || files.length === 0) return;

        const fileArray = Array.from(files);
        let processedCount = 0;

        fileArray.forEach((file) => {
            const reader = new FileReader();
            reader.onload = function(e) {
                const img = new Image();
                img.onload = function() {
                    const canvas = document.createElement('canvas');
                    const ctx = canvas.getContext('2d');
                    const MAX_WIDTH = 1280;
                    const MAX_HEIGHT = 1280;
                    let width = img.width;
                    let height = img.height;

                    if (width > MAX_WIDTH || height > MAX_HEIGHT) {
                        const ratio = Math.min(MAX_WIDTH / width, MAX_HEIGHT / height);
                        width = Math.round(width * ratio);
                        height = Math.round(height * ratio);
                    }

                    canvas.width = width;
                    canvas.height = height;
                    ctx.drawImage(img, 0, 0, width, height);

                    const base64Url = canvas.toDataURL('image/jpeg', 0.8);
                    if (wcComposeImages.length < 9) { // 限制最多9张
                        wcComposeImages.push(base64Url);
                    }

                    processedCount++;
                    if (processedCount === fileArray.length) {
                        wcRenderComposeImages();
                        wcCheckComposeInput();
                        event.target.value = ''; // 清空 input
                    }
                };
                img.src = e.target.result;
            };
            reader.readAsDataURL(file);
        });
    }
    window.wcHandleComposeImageUpload = wcHandleComposeImageUpload;

    function wcRenderComposeImages() {
        const grid = document.getElementById('wcComposeImageGrid');
        if (!grid) return;

        let html = '';
        wcComposeImages.forEach((url, index) => {
            html += `
                <div class="wc-compose-image-item">
                    <img src="${url}">
                    <div class="wc-compose-image-delete" onclick="wcDeleteComposeImage(${index})">
                        <svg viewBox="0 0 24 24"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                    </div>
                </div>
            `;
        });

        if (wcComposeImages.length < 9) {
            html += `
                <div class="wc-compose-image-add-btn" onclick="wcTriggerComposeImageUpload()">
                    <svg viewBox="0 0 24 24">
                        <line x1="12" y1="5" x2="12" y2="19"></line>
                        <line x1="5" y1="12" x2="19" y2="12"></line>
                    </svg>
                </div>
            `;
        }

        grid.innerHTML = html;
    }
    window.wcRenderComposeImages = wcRenderComposeImages;

    function wcDeleteComposeImage(index) {
        wcComposeImages.splice(index, 1);
        wcRenderComposeImages();
        wcCheckComposeInput();
    }
    window.wcDeleteComposeImage = wcDeleteComposeImage;

    function wcOpenComposeModal() {
        const modal = document.getElementById('wcComposeModal');
        const input = document.getElementById('wcComposeInput');
        wcUpdateComposeOptionValues();
        if (modal) {
            modal.classList.add('show');
            setTimeout(() => {
                if (input) input.focus();
            }, 400);
        }
    }
    window.wcOpenComposeModal = wcOpenComposeModal;

    function wcCloseComposeModal() {
        const modal = document.getElementById('wcComposeModal');
        const input = document.getElementById('wcComposeInput');
        if (input) {
            input.blur();
            input.value = ''; // 清空输入
        }
        wcComposeImages = []; // 清空图片
        wcRenderComposeImages(); // 重置网格
        wcResetComposeMetadata();
        wcCheckComposeInput(); // 重置按钮状态
        if (modal) modal.classList.remove('show');
    }
    window.wcCloseComposeModal = wcCloseComposeModal;

    function wcCheckComposeInput() {
        const input = document.getElementById('wcComposeInput');
        const postBtn = document.getElementById('wcComposePostBtn');
        if (input && postBtn) {
            if (input.value.trim().length > 0 || wcComposeImages.length > 0) {
                postBtn.classList.remove('disabled');
            } else {
                postBtn.classList.add('disabled');
            }
        }
    }
    window.wcCheckComposeInput = wcCheckComposeInput;

    function wcPostMoment() {
        const input = document.getElementById('wcComposeInput');
        if (!input) return;
        const text = input.value.trim();

        if (text.length === 0 && wcComposeImages.length === 0) return;

        const userAvatar = wcGetCurrentUserMomentAvatar();
        const userName = wcGetCurrentUserMomentName();
        const now = Date.now();

        // 构造新的朋友圈数据
        const newPost = {
            id: 'moment_' + Date.now(),
            avatar: userAvatar,
            name: userName,
            text: text,
            images: [...wcComposeImages], // 复制图片数组
            time: wcFormatMomentTime(now),
            createdAt: now,
            authorType: 'user',
            sourceContactId: wcCurrentChatContactId || '',
            sourceUserName: userName,
            location: wcComposeLocation ? { ...wcComposeLocation } : null,
            remindContactIds: [...wcComposeRemindContactIds],
            visibility: {
                mode: wcComposeVisibility.mode || 'public',
                contactIds: [...(wcComposeVisibility.contactIds || [])],
                groupIds: [...(wcComposeVisibility.groupIds || [])],
                resolvedContactIds: [...(wcComposeVisibility.resolvedContactIds || [])]
            },
            likes: [],
            comments: []
        };

        if (typeof wcMomentsList !== 'undefined') {
            wcMomentsList.unshift(newPost);
            if (typeof wcRenderMoments === 'function') wcRenderMoments();
            if (typeof wcSaveMomentsData === 'function') wcSaveMomentsData();
            const remindedContacts = newPost.remindContactIds
                .map(contactId => wcContactsList.find(contact => contact && String(contact.id) === String(contactId)))
                .filter(Boolean);
            if (remindedContacts.length > 0) {
                void wcAppendRemindedMomentComments(newPost, remindedContacts);
            } else {
                const sourceContact = wcContactsList.find(contact => contact && contact.id === newPost.sourceContactId) || null;
                if (!sourceContact || wcCanContactSeeMoment(newPost, sourceContact.id)) {
                    void wcAppendCharCommentToUserMoment(newPost, sourceContact);
                }
            }
        }

        wcCloseComposeModal();
        if (typeof showToast === 'function') showToast('发布成功');
    }
    window.wcPostMoment = wcPostMoment;

    function wcSaveMomentsData() {
        if (typeof appSettings !== 'undefined') {
            if (typeof appSettingsLoaded !== 'undefined' && !appSettingsLoaded) {
                wcMomentsSavePending = true;
                return;
            }
            const accountId = wcGetCurrentAccountId();
            appSettings[`wc_moments_list_${accountId}`] = wcMomentsList;
            if (typeof saveAppSettings === 'function') saveAppSettings();
        }
    }
    window.wcSaveMomentsData = wcSaveMomentsData;

    function wcFlushPendingMomentsData() {
        if (!wcMomentsSavePending || typeof appSettings === 'undefined') return;
        const accountId = wcGetCurrentAccountId();
        const storageKey = `wc_moments_list_${accountId}`;
        const storedList = Array.isArray(appSettings[storageKey]) ? appSettings[storageKey] : [];
        const pendingList = Array.isArray(wcMomentsList) ? wcMomentsList : [];
        const pendingIds = new Set(pendingList.map(post => post?.id).filter(Boolean));

        wcMomentsList = [
            ...pendingList,
            ...storedList.filter(post => post && !pendingIds.has(post.id))
        ];
        wcMomentsSavePending = false;
        wcSaveMomentsData();
    }
    window.wcFlushPendingMomentsData = wcFlushPendingMomentsData;

    function wcReplyComment(postId, targetName, event) {
        event.stopPropagation();
        const postIndex = wcMomentsList.findIndex(p => p.id === postId);
        if (postIndex === -1) return;
        const post = wcMomentsList[postIndex];

        let userName = '我';
        if (typeof appSettings !== 'undefined' && appSettings.wc_current_user_name) {
            userName = appSettings.wc_current_user_name;
        }

        if (typeof showCustomPrompt === 'function') {
                showCustomPrompt('回复', { placeholder: `回复 ${targetName}:` }, '发送').then(text => {
                    if (text && text.trim()) {
                        const commentText = text.trim();
                        if (!post.comments) post.comments = [];
                        post.comments.push(wcCreateMomentComment(userName, commentText, {
                            sourceType: 'user',
                            sourceUserName: userName,
                            replyToName: targetName || ''
                        }));
                        if (typeof wcSaveMomentsData === 'function') wcSaveMomentsData();
                        wcRenderMoments();
                        if (typeof showToast === 'function') showToast('回复成功');
                        void wcHandleMomentUserCommentReplies(post, commentText, targetName);
                    }
                });
            }
        }
    window.wcReplyComment = wcReplyComment;

    // ==========================================
    function wcSaveMomentsProfileData() {
        if (typeof appSettings !== 'undefined') {
            const accountId = wcGetCurrentAccountId();
            appSettings[`wc_moments_profile_${accountId}`] = wcMomentsProfile;
            if (typeof saveAppSettings === 'function') saveAppSettings();
        }
    }
    window.wcSaveMomentsProfileData = wcSaveMomentsProfileData;
