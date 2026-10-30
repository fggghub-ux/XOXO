// WeChat emoji library and group management. Extracted without behavior changes.

    // ==========================================
    // 微信表情包管理逻辑
    // ==========================================

    let wcCurrentEmojiGroupId = null;
    let wcIsEmojiManageMode = false;
    let wcSelectedEmojiIds = new Set();

    function wcOpenEmojiApp() {
        document.getElementById('page-profile').classList.remove('active');
        document.getElementById('wc-page-emoji-groups').classList.add('active');
        const bottomNav = document.querySelector('#wechatAppUI .bottom-nav-wrapper');
        if (bottomNav) bottomNav.style.display = 'none';
        wcRenderEmojiGroups();
    }
    function wcCloseEmojiApp() {
        document.getElementById('wc-page-emoji-groups').classList.remove('active');
        document.getElementById('wc-page-emoji-detail').classList.remove('active');
        document.getElementById('page-profile').classList.add('active');
        const bottomNav = document.querySelector('#wechatAppUI .bottom-nav-wrapper');
        if (bottomNav) bottomNav.style.display = 'block';
    }

    function wcGetAllEmojis() {
        let all = [];
        wcEmojiGroups.forEach(g => {
            g.emojis.forEach(e => { all.push({ ...e, groupId: g.id }); });
        });
        return all;
    }

    function wcSyncEmojiRuntimeAfterLibraryChange() {
        const validGroupIds = new Set(wcEmojiGroups.map(g => g.id));
        const validEmojiIds = new Set(wcGetAllEmojis().map(e => e.id));
        let contactsChanged = false;

        wcRecentEmojis = wcRecentEmojis.filter(e => validEmojiIds.has(e.id));
        if (typeof appSettings !== 'undefined') {
            const savedRecent = Array.isArray(appSettings.wc_recent_emojis) ? appSettings.wc_recent_emojis : [];
            const nextRecent = savedRecent.filter(e => validEmojiIds.has(e.id));
            if (nextRecent.length !== savedRecent.length) {
                appSettings.wc_recent_emojis = nextRecent;
                wcRecentEmojis = nextRecent;
                if (typeof saveAppSettings === 'function') saveAppSettings();
            }
        }

        wcContactsList.forEach(contact => {
            if (!Array.isArray(contact.boundEmojiGroups)) return;
            const nextBound = contact.boundEmojiGroups.filter(id => id === 'all' || validGroupIds.has(id));
            if (nextBound.length !== contact.boundEmojiGroups.length) {
                contact.boundEmojiGroups = nextBound;
                contactsChanged = true;
            }
        });
        if (contactsChanged && typeof wcSaveContactsDataAsync === 'function') wcSaveContactsDataAsync();

        const panel = document.getElementById('wcEmojiPanel');
        if (panel && panel.classList.contains('show')) {
            wcCloseEmojiSearch();
            wcRenderChatEmojiPanel();
        }
    }

    function wcCreateEmojiGroupCardHtml(name, emojis, isCreateBtn = false) {
        if (isCreateBtn) {
            return `
                <div class="wc-window-card" style="border-style: dashed;">
                    <div class="wc-window-header">
                        <div class="wc-window-count"></div>
                        <div class="wc-window-dots"><div class="wc-window-dot"></div><div class="wc-window-dot"></div><div class="wc-window-dot"></div></div>
                    </div>
                    <div class="wc-create-group-body"><svg viewBox="0 0 24 24"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg></div>
                </div>
                <div class="wc-group-info"><div class="wc-group-name">${name}</div></div>
            `;
        }
        const urls = [];
        for(let i = 0; i < 7; i++) { urls.push(emojis[i] ? `background-image: url('${emojis[i].url}')` : ''); }
        return `
            <div class="wc-window-card">
                <div class="wc-window-header">
                    <div class="wc-window-count">${emojis.length}</div>
                    <div class="wc-window-dots"><div class="wc-window-dot"></div><div class="wc-window-dot"></div><div class="wc-window-dot"></div></div>
                </div>
                <div class="wc-window-body">
                    <div class="wc-preview-cell" style="${urls[0]}"></div>
                    <div class="wc-preview-cell" style="${urls[1]}"></div>
                    <div class="wc-preview-cell" style="${urls[2]}"></div>
                    <div class="wc-preview-mini-grid">
                        <div class="wc-preview-mini-cell" style="${urls[3]}"></div>
                        <div class="wc-preview-mini-cell" style="${urls[4]}"></div>
                        <div class="wc-preview-mini-cell" style="${urls[5]}"></div>
                        <div class="wc-preview-mini-cell" style="${urls[6]}"></div>
                    </div>
                </div>
            </div>
            <div class="wc-group-info"><div class="wc-group-name">${name}</div></div>
        `;
    }

    function wcRenderEmojiGroups() {
        const grid = document.getElementById('wc-emoji-group-grid');
        grid.innerHTML = '';

        const createCard = document.createElement('div');
        createCard.className = 'wc-emoji-group-card';
        createCard.onclick = () => wcAddNewEmojiGroup();
        createCard.innerHTML = wcCreateEmojiGroupCardHtml('创建分组', [], true);
        grid.appendChild(createCard);

        const allEmojis = wcGetAllEmojis();
        const allCard = document.createElement('div');
        allCard.className = 'wc-emoji-group-card';
        allCard.onclick = () => wcOpenEmojiGroupDetail('all');
        allCard.innerHTML = wcCreateEmojiGroupCardHtml('全部', allEmojis);
        grid.appendChild(allCard);

        wcEmojiGroups.forEach(g => {
            const card = document.createElement('div');
            card.className = 'wc-emoji-group-card';

            let pressTimer;
            let isLongPress = false;

            card.addEventListener('touchstart', (e) => {
                isLongPress = false;
                pressTimer = setTimeout(() => {
                    isLongPress = true;
                    if (navigator.vibrate) navigator.vibrate(50);
                    showCustomConfirm('删除分组', `确定要删除分组 "${g.name}" 及其包含的所有表情吗？`, '删除', true).then(confirmed => {
                        if (confirmed) {
                            wcEmojiGroups = wcEmojiGroups.filter(group => group.id !== g.id);
                            wcSaveEmojiData();
                            wcSyncEmojiRuntimeAfterLibraryChange();
                            wcRenderEmojiGroups();
                            if (typeof showToast === 'function') showToast('分组已删除');
                        }
                    });
                }, 500);
            }, {passive: true});

            card.addEventListener('touchmove', () => {
                clearTimeout(pressTimer);
            }, {passive: true});

            card.addEventListener('touchend', (e) => {
                clearTimeout(pressTimer);
                if (isLongPress) e.preventDefault();
            }, { passive: false });
            card.addEventListener('touchcancel', () => clearTimeout(pressTimer));

            // Use the same click event for touch and mouse to avoid a second tap on the new page.
            card.onclick = (e) => {
                if (isLongPress) {
                    e.preventDefault();
                    return;
                }
                wcOpenEmojiGroupDetail(g.id);
            };

            card.innerHTML = wcCreateEmojiGroupCardHtml(g.name, g.emojis);
            grid.appendChild(card);
        });
    }

    function wcOpenEmojiGroupDetail(id) {
        wcCurrentEmojiGroupId = id;
        wcIsEmojiManageMode = false;
        wcSelectedEmojiIds.clear();
        document.getElementById('wc-detail-emoji-grid').classList.remove('wc-manage-mode');
        document.getElementById('wc-emoji-bottom-action-bar').classList.remove('show');
        document.getElementById('wc-btn-manage-emoji').innerText = '管理表情';

        let groupName = '';
        let emojis = [];

        if (id === 'all') {
            groupName = '全部';
            emojis = wcGetAllEmojis();
            document.getElementById('wc-btn-edit-emoji-group').style.display = 'none';
        } else {
            const group = wcEmojiGroups.find(g => g.id === id);
            if (!group) return;
            groupName = group.name;
            emojis = group.emojis;
            document.getElementById('wc-btn-edit-emoji-group').style.display = 'block';
        }

        document.getElementById('wc-nav-emoji-detail-title').innerText = groupName;
        document.getElementById('wc-detail-emoji-title').innerText = groupName;

        const coverBox = document.getElementById('wc-detail-emoji-cover');
        let coverHtml = '';
        for(let i=0; i<4; i++) {
            const url = emojis[i] ? emojis[i].url : '';
            const bgStyle = url ? `background-image: url('${url}')` : '';
            coverHtml += `<div class="wc-detail-cover-img" style="${bgStyle}"></div>`;
        }
        coverBox.innerHTML = coverHtml;

        wcRenderDetailEmojis(emojis);
        wcUpdateEmojiActionButtons();

        document.getElementById('wc-page-emoji-groups').classList.add('slide-left');
        document.getElementById('wc-page-emoji-detail').classList.add('active');
    }

    function wcRenderDetailEmojis(emojis) {
        const grid = document.getElementById('wc-detail-emoji-grid');
        const card = grid.closest('.wc-detail-card'); // 获取外层包裹的卡片
        grid.innerHTML = '';

        if (emojis.length === 0) {
            // 如果没有表情包，隐藏外层卡片的背景和阴影，避免出现空横杠
            if (card) {
                card.style.backgroundColor = 'transparent';
                card.style.boxShadow = 'none';
            }
            grid.style.display = 'block'; // 取消 grid 布局
            grid.innerHTML = '<div style="text-align: center; color: #8e8e93; padding: 40px 0; font-size: 14px; font-weight: 500;">当前暂无表情包</div>';
            return;
        }

        // 如果有表情包，恢复外层卡片样式和 grid 布局
        if (card) {
            card.style.backgroundColor = '';
            card.style.boxShadow = '';
        }
        grid.style.display = 'grid';

        emojis.forEach(e => {
            const item = document.createElement('div');
            item.className = 'wc-detail-emoji-item';
            item.id = `wc-emoji-item-${e.id}`;
            item.dataset.emojiId = String(e.id);
            item.onclick = () => {
                if (wcIsEmojiManageMode) wcToggleEmojiSelection(e.id);
                else wcOpenEmojiEditModal(e.id);
            };
            item.innerHTML = `
                <div class="wc-emoji-img-box"><img src="${e.url}" alt="${e.desc}"></div>
                <div class="wc-emoji-desc">${e.desc}</div>
                <div class="wc-emoji-checkbox"></div>
            `;
            grid.appendChild(item);
        });
    }

    function wcBackToEmojiGroups() {
        wcCurrentEmojiGroupId = null;
        document.getElementById('wc-page-emoji-detail').classList.remove('active');
        document.getElementById('wc-page-emoji-groups').classList.remove('slide-left');
        wcRenderEmojiGroups();
    }

    function wcToggleEmojiManageMode() {
        wcIsEmojiManageMode = !wcIsEmojiManageMode;
        const grid = document.getElementById('wc-detail-emoji-grid');
        const actionBar = document.getElementById('wc-emoji-bottom-action-bar');
        const btnManage = document.getElementById('wc-btn-manage-emoji');

        if (wcIsEmojiManageMode) {
            grid.classList.add('wc-manage-mode');
            actionBar.classList.add('show');
            btnManage.innerText = '取消管理';
            wcSelectedEmojiIds.clear();
            wcUpdateEmojiActionButtons();
        } else {
            grid.classList.remove('wc-manage-mode');
            actionBar.classList.remove('show');
            btnManage.innerText = '管理表情';
            wcSelectedEmojiIds.clear();
            document.querySelectorAll('.wc-detail-emoji-item').forEach(el => el.classList.remove('selected'));
            wcUpdateEmojiActionButtons();
        }
    }

    function wcToggleSelectAllEmojis() {
        if (!wcIsEmojiManageMode) return;
        const items = Array.from(document.querySelectorAll('#wc-detail-emoji-grid .wc-detail-emoji-item'));
        if (!items.length) return;
        const allSelected = items.every(item => wcSelectedEmojiIds.has(item.dataset.emojiId));
        wcSelectedEmojiIds.clear();
        items.forEach(item => {
            item.classList.toggle('selected', !allSelected);
            if (!allSelected) wcSelectedEmojiIds.add(item.dataset.emojiId);
        });
        wcUpdateEmojiActionButtons();
    }

    function wcToggleEmojiSelection(id) {
        const item = document.getElementById(`wc-emoji-item-${id}`);
        if (wcSelectedEmojiIds.has(id)) {
            wcSelectedEmojiIds.delete(id);
            item.classList.remove('selected');
        } else {
            wcSelectedEmojiIds.add(id);
            item.classList.add('selected');
        }
        wcUpdateEmojiActionButtons();
    }

    function wcUpdateEmojiActionButtons() {
        const btnDelete = document.getElementById('wc-btn-delete-emojis');
        const btnMove = document.getElementById('wc-btn-move-emojis');
        const btnSelectAll = document.getElementById('wc-btn-select-all-emojis');
        const total = document.querySelectorAll('#wc-detail-emoji-grid .wc-detail-emoji-item').length;
        const hasSelection = wcSelectedEmojiIds.size > 0;
        const allSelected = total > 0 && wcSelectedEmojiIds.size === total;

        btnDelete.classList.toggle('disabled', !hasSelection);
        btnMove.classList.toggle('disabled', !hasSelection);
        btnDelete.disabled = !hasSelection;
        btnMove.disabled = !hasSelection;
        btnDelete.querySelector('.wc-bottom-btn-label').textContent = hasSelection
            ? `删除 (${wcSelectedEmojiIds.size})` : '删除';
        btnSelectAll.disabled = total === 0;
        btnSelectAll.classList.toggle('disabled', total === 0);
        btnSelectAll.setAttribute('aria-pressed', String(allSelected));
        btnSelectAll.querySelector('.wc-bottom-btn-label').textContent = allSelected ? '取消全选' : '全选';
    }

    function wcDeleteSelectedEmojis() {
        if (wcSelectedEmojiIds.size === 0) return;
        showCustomConfirm('删除表情', `确定要删除选中的 ${wcSelectedEmojiIds.size} 个表情吗？`, '删除', true).then(confirmed => {
            if (confirmed) {
                wcEmojiGroups.forEach(g => {
                    g.emojis = g.emojis.filter(e => !wcSelectedEmojiIds.has(e.id));
                });
                wcSaveEmojiData();
                wcSyncEmojiRuntimeAfterLibraryChange();
                wcOpenEmojiGroupDetail(wcCurrentEmojiGroupId);
            }
        });
    }

    function wcOpenMoveEmojiModal() {
        if (wcSelectedEmojiIds.size === 0) return;

        let items = [];
        wcEmojiGroups.forEach(g => {
            if (wcCurrentEmojiGroupId === 'all' || g.id !== wcCurrentEmojiGroupId) {
                items.push({ label: g.name, value: g.id });
            }
        });

        if (items.length === 0) {
            showToast('没有其他分组可选');
            return;
        }

        openUniversalSelect({
            title: '移动表情至',
            items: items,
            currentValue: '',
            searchable: true, // 表情分组可能比较多，开启搜索框
            onSelect: (targetGroupId) => {
                wcConfirmMoveEmojis(targetGroupId);
            }
        });
    }

    function wcConfirmMoveEmojis(targetGroupId) {
        const targetGroup = wcEmojiGroups.find(g => g.id === targetGroupId);
        if (!targetGroup) return;
        let emojisToMove = [];
        wcEmojiGroups.forEach(g => {
            const toMove = g.emojis.filter(e => wcSelectedEmojiIds.has(e.id));
            emojisToMove = emojisToMove.concat(toMove);
            g.emojis = g.emojis.filter(e => !wcSelectedEmojiIds.has(e.id));
        });
        targetGroup.emojis = targetGroup.emojis.concat(emojisToMove);
        wcSaveEmojiData();
        wcOpenEmojiGroupDetail(wcCurrentEmojiGroupId);
        showToast(`成功移动 ${emojisToMove.length} 个表情到 "${targetGroup.name}"`);
    }

    function wcAddNewEmojiGroup() {
        showCustomPrompt('新建表情分组', { placeholder: '请输入分组名称' }, '创建').then(name => {
            if (name === null) return;
            if (name.trim()) {
                wcEmojiGroups.push({ id: 'g_' + Date.now(), name: name.trim(), emojis: [] });
                wcSaveEmojiData();
                wcRenderEmojiGroups();
            } else {
                showCustomAlert('提示', '请输入分组名称');
            }
        });
    }

    function wcOpenEditEmojiGroupModal() {
        if (wcCurrentEmojiGroupId === 'all') return;
        const group = wcEmojiGroups.find(g => g.id === wcCurrentEmojiGroupId);
        if (group) {
            showCustomPrompt('编辑分组', { placeholder: '分组名称', value: group.name }, '保存').then(newName => {
                if (newName === null) return;
                if (newName.trim()) {
                    group.name = newName.trim();
                    document.getElementById('wc-nav-emoji-detail-title').innerText = group.name;
                    document.getElementById('wc-detail-emoji-title').innerText = group.name;
                    wcSaveEmojiData();
                } else {
                    showCustomAlert('提示', '分组名称不能为空');
                }
            });
        }
    }

    function wcDeleteCurrentEmojiGroup() {
        showCustomConfirm('删除分组', '确定要删除此分组及其包含的所有表情吗？', '删除', true).then(confirmed => {
            if (confirmed) {
                wcEmojiGroups = wcEmojiGroups.filter(g => g.id !== wcCurrentEmojiGroupId);
                wcSaveEmojiData();
                wcSyncEmojiRuntimeAfterLibraryChange();
                wcBackToEmojiGroups();
            }
        });
    }

    function wcImportEmojis() {
        const selectText = document.getElementById('wcBatchGroupSelectText');

        if (wcEmojiGroups.length === 0) {
            selectText.setAttribute('data-value', 'new_default');
            selectText.innerText = '默认分组';
        } else {
            let targetGroup = wcEmojiGroups.find(g => g.id === wcCurrentEmojiGroupId) || wcEmojiGroups[0];
            selectText.setAttribute('data-value', targetGroup.id);
            selectText.innerText = targetGroup.name;
        }

        document.getElementById('wcBatchImportTextarea').value = '';
        document.getElementById('wcBatchImportOverlay').classList.add('show');
    }

    function wcCloseBatchImportModal() {
        document.getElementById('wcBatchImportOverlay').classList.remove('show');
    }

    async function wcHandleBatchImportFile(event) {
        const input = event.target;
        const file = input?.files?.[0];
        if (input) input.value = '';
        if (!file) return;

        const extension = file.name.split('.').pop()?.toLowerCase();
        if (!['txt', 'json', 'docx'].includes(extension)) {
            showCustomAlert('导入失败', '请选择 TXT、JSON 或 DOCX 文件');
            return;
        }

        try {
            if (typeof showToast === 'function') showToast('正在读取文件...');
            const buffer = await file.arrayBuffer();
            const text = extension === 'docx'
                ? wcDocxXmlToChatText(await wcReadChatDocxXml(buffer))
                : wcDecodeChatText(buffer).trim();
            if (!text) throw new Error('文件中没有可读取的文字');

            const textarea = document.getElementById('wcBatchImportTextarea');
            textarea.value = textarea.value ? textarea.value + '\n' + text : text;
            if (typeof showToast === 'function') showToast('文件读取成功');
        } catch (error) {
            console.error('Emoji batch import failed:', error);
            showCustomAlert('导入失败', error?.message || '文件读取失败，请检查文件格式');
        }
    }

    async function wcSaveBatchImport() {
        const data = document.getElementById('wcBatchImportTextarea').value;
        if (!data.trim()) { showCustomAlert('提示', '请输入导入数据'); return; }

        const selectText = document.getElementById('wcBatchGroupSelectText');
        let targetGroupId = selectText.getAttribute('data-value');
        let targetGroup = null;

        if (targetGroupId === 'new_default') {
            targetGroup = { id: 'g_' + Date.now(), name: '默认分组', emojis: [] };
            wcEmojiGroups.push(targetGroup);
        } else {
            targetGroup = wcEmojiGroups.find(g => g.id === targetGroupId);
        }

        if (!targetGroup) return;

        const lines = data.split(/\r?\n/).map(line => line.trim()).filter(Boolean);
        const entries = [];
        for (let lineIndex = 0; lineIndex < lines.length; lineIndex += 1) {
            const line = lines[lineIndex];
            const urlStart = line.search(/\S+:\/\/\S+/);
            if (urlStart > 0) {
                const desc = line.slice(0, urlStart).replace(/[:：\s]+$/, '').trim();
                const url = line.slice(urlStart).trim();
                if (desc && url) entries.push([desc, url]);
            } else {
                line.split(/[\s,]+/).forEach(token => {
                    const parts = token.split(/[:：]/);
                    if (parts.length >= 2) entries.push([parts[0].trim(), parts.slice(1).join(':').trim()]);
                });
            }
            if (lineIndex > 0 && lineIndex % 500 === 0) await new Promise(resolve => setTimeout(resolve, 0));
        }
        let count = 0;
        for (let entryIndex = 0; entryIndex < entries.length; entryIndex += 1) {
            const [desc, url] = entries[entryIndex];
            if (desc && url) {
                targetGroup.emojis.push({ id: 'e_' + Math.random().toString(36).substr(2, 9), desc, url });
                count += 1;
            }
            if (entryIndex > 0 && entryIndex % 500 === 0) await new Promise(resolve => setTimeout(resolve, 0));
        }

        if (count > 0) {
            wcSaveEmojiData();
            wcCloseBatchImportModal();
            if (wcCurrentEmojiGroupId === 'all' || wcCurrentEmojiGroupId === targetGroup.id) {
                wcOpenEmojiGroupDetail(wcCurrentEmojiGroupId || targetGroup.id);
            } else {
                wcRenderEmojiGroups();
            }
            if (typeof showToast === 'function') showToast(`成功导入 ${count} 个表情包`);
        } else {
            showCustomAlert('提示', '未识别到有效格式的数据，请检查格式是否为：描述 URL 或 描述:URL');
        }
    }

    let wcEditingEmojiId = null;

    function wcOpenEmojiEditModal(emojiId) {
        let foundEmoji = null;
        for (const group of wcEmojiGroups) {
            const item = (group.emojis || []).find(e => e.id === emojiId);
            if (item) {
                foundEmoji = item;
                break;
            }
        }
        if (!foundEmoji) return;
        wcEditingEmojiId = emojiId;

        const overlay = document.getElementById('wcEmojiEditModalOverlay');
        const previewImg = document.getElementById('wcEmojiEditPreviewImg');
        const descInput = document.getElementById('wcEmojiEditDescInput');
        const urlInput = document.getElementById('wcEmojiEditUrlInput');

        if (previewImg) previewImg.src = foundEmoji.url || '';
        if (descInput) descInput.value = foundEmoji.desc || '';
        if (urlInput) urlInput.value = foundEmoji.url || '';

        if (overlay) overlay.classList.add('show');
    }
    window.wcOpenEmojiEditModal = wcOpenEmojiEditModal;

    function wcUpdateEmojiEditPreview(val) {
        const previewImg = document.getElementById('wcEmojiEditPreviewImg');
        if (previewImg) {
            previewImg.src = val ? val.trim() : '';
        }
    }
    window.wcUpdateEmojiEditPreview = wcUpdateEmojiEditPreview;

    function wcCloseEmojiEditModal(event) {
        if (event && event.target !== document.getElementById('wcEmojiEditModalOverlay')) return;
        const overlay = document.getElementById('wcEmojiEditModalOverlay');
        if (overlay) overlay.classList.remove('show');
        wcEditingEmojiId = null;
    }
    window.wcCloseEmojiEditModal = wcCloseEmojiEditModal;

    function wcConfirmSaveEmojiEdit() {
        if (!wcEditingEmojiId) return;

        const descInput = document.getElementById('wcEmojiEditDescInput');
        const urlInput = document.getElementById('wcEmojiEditUrlInput');
        const newDesc = descInput ? descInput.value.trim() : '';
        const newUrl = urlInput ? urlInput.value.trim() : '';

        if (!newDesc) {
            if (typeof showToast === 'function') showToast('表情描述不能为空');
            return;
        }
        if (!newUrl) {
            if (typeof showToast === 'function') showToast('表情 URL 不能为空');
            return;
        }

        let modified = false;
        for (const group of wcEmojiGroups) {
            const item = (group.emojis || []).find(e => e.id === wcEditingEmojiId);
            if (item) {
                item.desc = newDesc;
                item.url = newUrl;
                modified = true;
                break;
            }
        }

        if (modified) {
            wcSaveEmojiData();
            wcSyncEmojiRuntimeAfterLibraryChange();
            if (wcCurrentEmojiGroupId) {
                wcOpenEmojiGroupDetail(wcCurrentEmojiGroupId);
            }
            if (typeof showToast === 'function') showToast('表情包已更新');
        }

        wcCloseEmojiEditModal();
    }
    window.wcConfirmSaveEmojiEdit = wcConfirmSaveEmojiEdit;
