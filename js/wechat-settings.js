// WeChat settings, prompts, dossier, and chat appearance. Extracted without behavior changes.

    // A conversation stores either a live preset reference or its own credentials.
    // Return a snapshot so editing settings cannot change an in-flight request.
    function wcResolveChatApi(config) {
        const list = typeof apiDataList !== 'undefined' && Array.isArray(apiDataList) ? apiDataList : [];
        const selected = config?.mode === 'custom' ? config.custom
            : config?.mode === 'preset' ? list.find(item => String(item.id) === String(config.presetId))
            : list.find(item => item.id === apiConnectedId);
        return selected ? { ...selected } : null;
    }

    function wcChatApiLabel(config) {
        if (config?.mode === 'custom') return `独立填写 · ${config.custom?.model || '未填写模型'}`;
        if (config?.mode === 'preset') return wcResolveChatApi(config)?.name || '原预设已删除，请重新选择';
        return '跟随全局 API';
    }

    function wcOpenPrivateApiSettings() {
        const contactId = wcCurrentChatContactId;
        const contact = wcContactsList.find(item => item.id === contactId);
        if (!contact) return;
        wcOpenChatApiEditor('私聊 API', contact.apiConfig, async config => {
            const current = wcContactsList.find(item => item.id === contactId);
            if (!current || wcCurrentChatContactId !== contactId) throw new Error('聊天已切换，请重新打开设置');
            const previous = current.apiConfig;
            current.apiConfig = config;
            try { await wcSaveContactsDataAsync(); }
            catch (error) { current.apiConfig = previous; throw error; }
            window.ProactivePush?.scheduleSync(contactId);
        });
    }

    function wcCloseChatApiEditor() {
        const editor = document.getElementById('wc-chat-api-editor');
        if (!editor || editor.dataset.saving === 'true') return;
        editor.hidden = true;
        editor.remove();
    }

    function wcOpenChatApiEditor(title, config, persist) {
        if (document.getElementById('wc-chat-api-editor')?.dataset.saving === 'true') return;
        wcCloseChatApiEditor();
        const owner = wcGetCurrentAccountId();
        const editor = document.createElement('section');
        editor.id = 'wc-chat-api-editor';
        editor.hidden = true;
        editor.setAttribute('role', 'dialog');
        editor.setAttribute('aria-modal', 'true');
        editor.setAttribute('aria-labelledby', 'wc-chat-api-title');
        editor.innerHTML = `<form class="wc-chat-api-form">
            <nav class="wc-settings-navbar">
                <button type="button" class="wc-settings-nav-btn-left" data-close aria-label="返回聊天设置"><svg viewBox="0 0 24 24" aria-hidden="true"><polyline points="14 18 8 12 14 6"></polyline></svg></button>
                <strong class="wc-settings-nav-title" id="wc-chat-api-title"></strong>
                <div class="wc-settings-nav-save"><button type="submit" class="wc-settings-save-btn">保存</button></div>
            </nav>
            <div class="wc-chat-api-content">
                <p class="wc-chat-api-intro">为当前对话选择连接方式</p>
                <div class="wc-chat-api-mode" role="radiogroup" aria-label="连接方式">
                    <label><input type="radio" name="mode" value="global"><span>跟随全局</span></label>
                    <label><input type="radio" name="mode" value="preset"><span>选择预设</span></label>
                    <label><input type="radio" name="mode" value="custom"><span>单独填写</span></label>
                </div>
                <fieldset data-preset hidden>
                    <legend>API 预设</legend>
                    <div class="wc-chat-api-fields"><label class="wc-chat-api-field wc-chat-api-preset"><span>选择预设</span><select name="presetId" aria-label="全局 API 预设"></select><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m9 5 7 7-7 7"/></svg></label></div>
                    <p class="wc-chat-api-note">使用此预设，不随全局连接切换。</p>
                </fieldset>
                <fieldset data-custom hidden>
                    <legend>连接信息</legend>
                    <div class="wc-chat-api-fields">
                        <label class="wc-chat-api-field"><span>接口地址</span><input name="url" type="url" placeholder="https://api.example.com/v1" autocomplete="off" autocapitalize="none" spellcheck="false"></label>
                        <label class="wc-chat-api-field"><span>API Key</span><input name="key" type="password" placeholder="填写密钥" autocomplete="new-password" autocapitalize="none" spellcheck="false"></label>
                        <label class="wc-chat-api-field"><span>模型名称</span><input name="model" placeholder="填写模型 ID" autocomplete="off" autocapitalize="none" spellcheck="false"></label>
                        <label class="wc-chat-api-field wc-chat-api-temperature"><span>温度<small>数值越高，回复越多样</small></span><input name="temperature" type="number" min="0" max="2" step="0.05" inputmode="decimal"></label>
                    </div>
                </fieldset>
                <p data-status role="status"></p>
                <p data-error role="alert" hidden></p>
            </div>
        </form>`;
        const form = editor.querySelector('form');
        const controls = form.elements;
        const field = name => controls.namedItem(name);
        const preset = field('presetId');
        const apis = typeof apiDataList !== 'undefined' && Array.isArray(apiDataList) ? apiDataList : [];
        apis.forEach(api => preset.add(new Option(api.name || api.model || '未命名预设', String(api.id))));
        if (config?.mode === 'preset' && !apis.some(api => String(api.id) === String(config.presetId))) {
            preset.add(new Option('原预设已删除，请重新选择', String(config.presetId)));
        }
        if (!preset.options.length) preset.add(new Option('暂无预设，请先在 API 连接中添加', ''));
        field('mode').value = ['custom', 'preset'].includes(config?.mode) ? config.mode : 'global';
        preset.value = String(config?.presetId ?? apis[0]?.id ?? '');
        const custom = config?.custom || {};
        ['url', 'key', 'model'].forEach(name => { field(name).value = String(custom[name] || ''); });
        field('temperature').value = custom.temperature ?? 0.8;
        editor.querySelector('#wc-chat-api-title').textContent = title;
        const update = () => {
            const mode = field('mode').value;
            editor.querySelector('[data-preset]').hidden = mode !== 'preset';
            editor.querySelector('[data-preset]').disabled = mode !== 'preset';
            editor.querySelector('[data-custom]').hidden = mode !== 'custom';
            editor.querySelector('[data-custom]').disabled = mode !== 'custom';
            ['url', 'key', 'model'].forEach(name => { field(name).required = mode === 'custom'; });
            const api = wcResolveChatApi(mode === 'preset' ? { mode, presetId: preset.value } : { mode });
            editor.querySelector('[data-status]').textContent = mode === 'global'
                ? `当前全局连接：${api?.name || api?.model || '尚未连接'}`
                : mode === 'preset' ? `模型：${api?.model || '尚未配置'}` : '保存后仅当前对话使用此连接。';
        };
        form.onchange = update;
        editor.querySelector('[data-close]').onclick = wcCloseChatApiEditor;
        form.onsubmit = async event => {
            event.preventDefault();
            if (editor.dataset.saving === 'true') return;
            const error = editor.querySelector('[data-error]');
            error.hidden = true;
            const next = { mode: field('mode').value, presetId: preset.value,
                custom: { url: field('url').value.trim(), key: field('key').value.trim(),
                    model: field('model').value.trim(), temperature: Number(field('temperature').value) } };
            try {
                if (owner !== wcGetCurrentAccountId()) throw new Error('微信账号已切换，请重新打开设置');
                if (next.mode !== 'global') {
                    const api = wcResolveChatApi(next);
                    if (!api?.url?.trim() || !api?.key?.trim() || !api?.model?.trim()) throw new Error('请填写完整的接口地址、密钥与模型，或选择有效预设');
                    if (!/^https?:\/\//i.test(api.url)) throw new Error('接口地址须以 http:// 或 https:// 开头');
                    if (next.mode === 'custom' && (!Number.isFinite(next.custom.temperature) || next.custom.temperature < 0 || next.custom.temperature > 2)) throw new Error('温度须在 0～2 之间');
                }
                editor.dataset.saving = 'true';
                editor.querySelectorAll('button').forEach(button => { button.disabled = true; });
                await persist(next);
                editor.dataset.saving = 'false';
                if (editor.isConnected && owner === wcGetCurrentAccountId()) {
                    wcCloseChatApiEditor();
                    showToast('当前对话的 API 已保存');
                }
            } catch (failure) {
                editor.dataset.saving = 'false';
                editor.querySelectorAll('button').forEach(button => { button.disabled = false; });
                error.textContent = failure?.message || '保存失败，请重试';
                error.hidden = false;
            }
        };
        document.getElementById('wechatAppUI').appendChild(editor);
        update();
        editor.hidden = false;
    }

    window.addEventListener('wechat:account-changed', () => document.getElementById('wc-chat-api-editor')?.remove());

    async function wcOpenWechatSettings() {
        const settingsPage = document.getElementById('page-wechat-settings');
        if (!settingsPage) return;

        document.querySelectorAll('#wechatAppUI .page').forEach(p => p.classList.remove('active'));
        settingsPage.classList.add('active');

        const bottomNav = document.querySelector('#wechatAppUI .bottom-nav-wrapper');
        if (bottomNav) bottomNav.style.display = 'none';

        await wcRenderWechatSettings();
    }
    window.wcOpenWechatSettings = wcOpenWechatSettings;

    function wcCloseWechatSettings() {
        document.querySelectorAll('#wechatAppUI .page').forEach(p => p.classList.remove('active'));
        document.getElementById('page-profile').classList.add('active');

        const bottomNav = document.querySelector('#wechatAppUI .bottom-nav-wrapper');
        if (bottomNav) bottomNav.style.display = 'block';
    }
    window.wcCloseWechatSettings = wcCloseWechatSettings;

    async function wcRenderWechatSettings() {
        try {
            const authData = await wcGetAuthData();
            const currentUser = authData.accounts.find(a => a.wxid === authData.currentLoginWxid);

            const nameEl = document.getElementById('wcSetTopUserName');
            const avatarEl = document.getElementById('wcSetTopUserAvatar');
            const phoneEl = document.getElementById('wcSetInfoPhone');
            const wxidEl = document.getElementById('wcSetInfoWxid');
            const pwdEl = document.getElementById('wcSetInfoPwd');
            const storageHintEl = document.getElementById('wcSetStorageHint');

            if (currentUser) {
                if (nameEl) nameEl.innerText = currentUser.name || '未命名';
                if (avatarEl) {
                    if (wcApplyAvatarBackground(avatarEl, currentUser.avatar)) {
                        avatarEl.textContent = '';
                        avatarEl.innerHTML = '';
                        avatarEl.style.backgroundSize = 'cover';
                        avatarEl.style.backgroundPosition = 'center';
                    } else {
                        avatarEl.style.backgroundImage = 'none';
                        avatarEl.style.backgroundColor = '#E5E5EA';
                        avatarEl.textContent = (currentUser.name || 'U').substring(0, 1);
                    }
                }
                if (phoneEl) phoneEl.innerText = currentUser.phone || '--';
                if (wxidEl) wxidEl.innerText = currentUser.wxid || '--';
                if (pwdEl) pwdEl.innerText = currentUser.password ? currentUser.password : '••••••';
            }

            // 真实读取存储大小
            if (storageHintEl) {
                const accountId = wcGetCurrentAccountId();
                const chatRecord = await wcReadLayoutRecord(`wechatChatData_${accountId}`);
                const momentsRecord = await wcReadLayoutRecord(`wechatMomentsData_${accountId}`);
                const contactsRecord = await wcReadLayoutRecord(`wechatContactsData_${accountId}`);

                const groupBytes = window.WcGroupChat ? await window.WcGroupChat.accountBytes(accountId) : 0;
                const bytes = JSON.stringify(chatRecord || {}).length + JSON.stringify(momentsRecord || {}).length + JSON.stringify(contactsRecord || {}).length + groupBytes;
                const sizeMb = (bytes / (1024 * 1024)).toFixed(1);
                storageHintEl.innerText = `${sizeMb} MB`;
            }
        } catch (error) {
            console.error('渲染微信设置信息失败:', error);
        }
    }

    function wcOpenProfileDetailModal() {
        const overlay = document.getElementById('wcProfileDetailOverlay');
        if (!overlay) return;

        const avatarPreview = document.getElementById('wcPdAvatarPreview');
        const nameEl = document.getElementById('wcPdUserName');
        const avatarUrl = typeof appSettings !== 'undefined' && appSettings.wc_current_user_avatar ? appSettings.wc_current_user_avatar : '';
        const name = typeof appSettings !== 'undefined' && appSettings.wc_current_user_name ? appSettings.wc_current_user_name : '未命名';

        if (nameEl) nameEl.innerText = name;
        if (avatarPreview) {
            if (wcApplyAvatarBackground(avatarPreview, avatarUrl)) {
                avatarPreview.textContent = '';
                avatarPreview.innerHTML = '';
                avatarPreview.style.backgroundSize = 'cover';
                avatarPreview.style.backgroundPosition = 'center';
            } else {
                avatarPreview.style.backgroundImage = 'none';
                avatarPreview.style.backgroundColor = '#E5E5EA';
                avatarPreview.textContent = name.substring(0, 1) || 'U';
            }
        }

        overlay.classList.add('show');
    }
    window.wcOpenProfileDetailModal = wcOpenProfileDetailModal;

    function wcCloseProfileDetailModal() {
        const overlay = document.getElementById('wcProfileDetailOverlay');
        if (overlay) overlay.classList.remove('show');
    }
    window.wcCloseProfileDetailModal = wcCloseProfileDetailModal;

    // --- 微信真实存储空间计算与渲染 ---
    async function wcOpenWechatStorage() {
        const page = document.getElementById('page-wechat-storage');
        if (!page) return;

        document.querySelectorAll('#wechatAppUI .page').forEach(p => p.classList.remove('active'));
        page.classList.add('active');

        await wcRenderWechatStorage();
    }
    window.wcOpenWechatStorage = wcOpenWechatStorage;

    function wcCloseWechatStorage() {
        document.querySelectorAll('#wechatAppUI .page').forEach(p => p.classList.remove('active'));
        document.getElementById('page-wechat-settings').classList.add('active');
    }
    window.wcCloseWechatStorage = wcCloseWechatStorage;

    function wcFormatStorageSize(bytes) {
        if (bytes === 0 || !bytes) return '0 KB';
        if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
        if (bytes < 1024 * 1024 * 1024) return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
        return (bytes / (1024 * 1024 * 1024)).toFixed(2) + ' GB';
    }

    async function wcRenderWechatStorage() {
        try {
            const currentAccountId = wcGetCurrentAccountId();
            const authData = await wcGetAuthData();
            const accounts = Array.isArray(authData?.accounts) ? authData.accounts : [];

            // 1. 真实统计当前账号的各项数据字节数
            const chatRecord = await wcReadLayoutRecord(`wechatChatData_${currentAccountId}`);
            const momentsRecord = await wcReadLayoutRecord(`wechatMomentsData_${currentAccountId}`);
            const contactsRecord = await wcReadLayoutRecord(`wechatContactsData_${currentAccountId}`);
            const favoritesRecord = await wcReadLayoutRecord(`wechatFavoritesData_${currentAccountId}`);
            const walletRecord = await wcReadLayoutRecord(`wechatWalletData_${currentAccountId}`);

            const groupBytes = window.WcGroupChat ? await window.WcGroupChat.accountBytes(currentAccountId) : 0;
            const chatBytes = JSON.stringify(chatRecord || {}).length + groupBytes;
            const momentsBytes = JSON.stringify(momentsRecord || {}).length;
            const contactsBytes = JSON.stringify(contactsRecord || {}).length;
            const favoritesBytes = JSON.stringify(favoritesRecord || {}).length;
            const walletBytes = JSON.stringify(walletRecord || {}).length;

            // 2. 统计其他账号数据字节数
            let otherAccountsBytes = 0;
            for (const acc of accounts) {
                if (acc.maskId && acc.maskId !== currentAccountId) {
                    const otherChat = await wcReadLayoutRecord(`wechatChatData_${acc.maskId}`);
                    const otherMoments = await wcReadLayoutRecord(`wechatMomentsData_${acc.maskId}`);
                    const otherContacts = await wcReadLayoutRecord(`wechatContactsData_${acc.maskId}`);
                    otherAccountsBytes += JSON.stringify(otherChat || {}).length + JSON.stringify(otherMoments || {}).length + JSON.stringify(otherContacts || {}).length;
                    if (window.WcGroupChat) otherAccountsBytes += await window.WcGroupChat.accountBytes(acc.maskId);
                }
            }

            // 3. 统计全局资源文件大小 (表情包库、壁纸库、预设库等)
            const emojiRecord = await wcReadLayoutRecord('wechatEmojiData');
            const bgRecord = await wcReadLayoutRecord('wechatBgData');
            const presetRecord = await wcReadLayoutRecord('wechatPresetData');
            const resourceBytes = JSON.stringify(emojiRecord || {}).length + JSON.stringify(bgRecord || {}).length + JSON.stringify(presetRecord || {}).length;

            // 4. 必要系统文件 (账户基底、联系人基底)
            const authBytes = JSON.stringify(authData || {}).length;
            const necessaryBytes = authBytes + contactsBytes + (1024 * 1024 * 1.7); // 加上微信运行底座 1.7MB

            // 5. 缓存 (朋友圈、收藏、钱包、聊天数据片段)
            const cacheBytes = momentsBytes + favoritesBytes + walletBytes + (chatBytes * 0.35);

            // 6. 总共微信已用大小
            const totalWechatBytes = chatBytes + cacheBytes + resourceBytes + necessaryBytes;

            // 7. 更新各 DOM 节点真实数据
            const totalUsageEl = document.getElementById('wcStTotalUsage');
            if (totalUsageEl) totalUsageEl.innerText = wcFormatStorageSize(totalWechatBytes);

            const cacheSizeEl = document.getElementById('wcStCacheSize');
            if (cacheSizeEl) cacheSizeEl.innerText = wcFormatStorageSize(cacheBytes);

            const chatSizeEl = document.getElementById('wcStChatSize');
            if (chatSizeEl) chatSizeEl.innerText = wcFormatStorageSize(chatBytes);

            const resSizeEl = document.getElementById('wcStResourceSize');
            if (resSizeEl) resSizeEl.innerText = wcFormatStorageSize(resourceBytes);

            const necSizeEl = document.getElementById('wcStNecessarySize');
            if (necSizeEl) necSizeEl.innerText = wcFormatStorageSize(necessaryBytes);

            const otherSizeEl = document.getElementById('wcStOtherAccountSize');
            if (otherSizeEl) otherSizeEl.innerText = wcFormatStorageSize(otherAccountsBytes);

            const cacheDetailEl = document.getElementById('wcStCacheDetail');
            if (cacheDetailEl) cacheDetailEl.innerText = `包括朋友圈及数据临时缓存 ${wcFormatStorageSize(cacheBytes)}`;

            // 8. 计算各板块在微信数据内部的真实占比并更新四色进度条
            const realImgBgBytes = momentsBytes + (typeof wcChatBgList !== 'undefined' ? JSON.stringify(wcChatBgList).length : 0) + (chatBytes * 0.4);
            const realEmojiBytes = emojiRecord ? JSON.stringify(emojiRecord).length : 0;
            const realOtherBytes = necessaryBytes + (presetRecord ? JSON.stringify(presetRecord).length : 0) + walletBytes + favoritesBytes;

            const sumWechatActiveBytes = Math.max(1, chatBytes + realEmojiBytes + realImgBgBytes + realOtherBytes);

            let pctChat = Math.max(5, (chatBytes / sumWechatActiveBytes) * 100);
            let pctEmoji = Math.max(5, (realEmojiBytes / sumWechatActiveBytes) * 100);
            let pctImgBg = Math.max(5, (realImgBgBytes / sumWechatActiveBytes) * 100);
            let pctOther = Math.max(5, 100 - pctChat - pctEmoji - pctImgBg);

            const segChat = document.getElementById('wcStSegChat');
            const segEmoji = document.getElementById('wcStSegEmoji');
            const segImgBg = document.getElementById('wcStSegImgBg');
            const segOther = document.getElementById('wcStSegOther');

            if (segChat && segEmoji && segImgBg && segOther) {
                segChat.style.width = `${pctChat.toFixed(1)}%`;
                segEmoji.style.width = `${pctEmoji.toFixed(1)}%`;
                segImgBg.style.width = `${pctImgBg.toFixed(1)}%`;
                segOther.style.width = `${pctOther.toFixed(1)}%`;
            }

            const usagePercentEl = document.getElementById('wcStUsagePercent');
            if (usagePercentEl) {
                usagePercentEl.innerText = `聊天记录占比 ${(pctChat).toFixed(1)}%`;
            }

        } catch (e) {
            console.error('真实存储空间计算失败:', e);
        }
    }

    // --- 微信专属数据备份与恢复 (Data Manager) ---
    function wcOpenChatManagePage() {
        const page = document.getElementById('page-wechat-chat-manage');
        if (!page) return;

        document.querySelectorAll('#wechatAppUI .page').forEach(p => p.classList.remove('active'));
        page.classList.add('active');
    }
    window.wcOpenChatManagePage = wcOpenChatManagePage;

    function wcCloseChatManagePage() {
        document.querySelectorAll('#wechatAppUI .page').forEach(p => p.classList.remove('active'));
        document.getElementById('page-wechat-settings').classList.add('active');
    }
    window.wcCloseChatManagePage = wcCloseChatManagePage;

    async function wcExportWechatBackup() {
        try {
            if (window.WcGroupChat) {
                await window.WcGroupChat.load();
                await window.WcGroupChat.flush();
            }
            const now = new Date();
            const dateStr = `${now.getFullYear()}${String(now.getMonth() + 1).padStart(2, '0')}${String(now.getDate()).padStart(2, '0')}`;
            const defaultName = `WeChat_Backup_${dateStr}`;

            const customName = await showCustomPrompt('导出备份', { placeholder: '请输入备份名称', value: defaultName }, '导出');
            if (customName === null) return;

            const fileName = (customName && customName.trim()) ? customName.trim() : defaultName;

            showToast('正在导出微信数据...');
            const accountId = wcGetCurrentAccountId();

            // 收集所有微信相关存储
            const currentChat = await wcReadLayoutRecord(`wechatChatData_${accountId}`);
            const currentMoments = await wcReadLayoutRecord(`wechatMomentsData_${accountId}`);
            const currentContacts = await wcReadLayoutRecord(`wechatContactsData_${accountId}`);
            const currentFavorites = await wcReadLayoutRecord(`wechatFavoritesData_${accountId}`);
            const currentWallet = await wcReadLayoutRecord(`wechatWalletData_${accountId}`);
            const currentAuth = await wcReadLayoutRecord('wechatAuthData');
            const currentEmoji = await wcReadLayoutRecord('wechatEmojiData');
            const currentBg = await wcReadLayoutRecord('wechatBgData');
            const currentAppSettings = await wcReadLayoutRecord('appSettings');
            const settings = currentAppSettings && currentAppSettings.data ? currentAppSettings.data : {};

            const backupPayload = {
                type: 'tonghuaji_wechat_backup',
                version: '1.1',
                exportTime: Date.now(),
                accountId: accountId,
                data: {
                    chat: currentChat,
                    groups: window.WcGroupChat ? window.WcGroupChat.backupSnapshot() : null,
                    moments: currentMoments,
                    contacts: currentContacts,
                    favorites: currentFavorites,
                    wallet: currentWallet,
                    auth: currentAuth,
                    emoji: currentEmoji,
                    bg: currentBg,
                    presets: typeof wcPresets !== 'undefined' ? wcPresets : [],
                    chatPromptSettings: {
                        activePromptId: settings.wc_active_prompt_id,
                        builtinPromptPosition: settings.wc_builtin_prompt_position,
                        customPrompts: Array.isArray(settings.wc_custom_prompts_list) ? settings.wc_custom_prompts_list : [],
                        activeCotId: settings.wc_active_cot_id,
                        customCots: Array.isArray(settings.wc_custom_cots_list) ? settings.wc_custom_cots_list : [],
                        activeCustomPresetId: settings.wc_active_custom_preset_id,
                        customPresets: Array.isArray(settings.wc_custom_presets_list) ? settings.wc_custom_presets_list : []
                    }
                }
            };

            const jsonStr = JSON.stringify(backupPayload, null, 2);
            const blob = new Blob([jsonStr], { type: 'application/json;charset=utf-8' });
            const url = URL.createObjectURL(blob);

            const a = document.createElement('a');
            a.href = url;
            a.download = fileName.endsWith('.json') ? fileName : `${fileName}.json`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);

            showToast('微信数据导出成功');
        } catch (error) {
            console.error('导出微信备份失败:', error);
            showToast('导出备份失败');
        }
    }
    window.wcExportWechatBackup = wcExportWechatBackup;

    function wcTriggerWechatImport() {
        const input = document.getElementById('wcBackupFileInput');
        if (input) input.click();
    }
    window.wcTriggerWechatImport = wcTriggerWechatImport;

    function wcHandleWechatImportFile(event) {
        const file = event.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = async function(e) {
            try {
                const text = e.target.result;
                const backup = JSON.parse(text);

                if (!backup || backup.type !== 'tonghuaji_wechat_backup' || !backup.data) {
                    showCustomAlert('导入失败', '这不是有效的微信专属备份文件。');
                    return;
                }

                const confirmed = await showCustomConfirm('恢复微信数据', '导入将覆盖当前的聊天记录、好友列表及微信设置，确定继续吗？', '确认恢复', true);
                if (!confirmed) return;

                showToast('正在恢复数据...');
                const accountId = wcGetCurrentAccountId();
                const d = backup.data;
                if (window.WcGroupChat) {
                    window.WcGroupChat.stopAll();
                    await window.WcGroupChat.flush();
                }

                if (db && typeof storeName !== 'undefined') {
                    const tx = db.transaction([storeName], 'readwrite');
                    const store = tx.objectStore(storeName);

                    if (d.chat) store.put({ id: `wechatChatData_${accountId}`, ...d.chat });
                    if (d.groups && window.WcGroupChat) window.WcGroupChat.writeBackup(store, d.groups, accountId);
                    if (d.moments) store.put({ id: `wechatMomentsData_${accountId}`, ...d.moments });
                    if (d.contacts) store.put({ id: `wechatContactsData_${accountId}`, ...d.contacts });
                    if (d.favorites) store.put({ id: `wechatFavoritesData_${accountId}`, ...d.favorites });
                    if (d.wallet) store.put({ id: `wechatWalletData_${accountId}`, ...d.wallet });
                    if (d.auth) store.put({ id: 'wechatAuthData', ...d.auth });
                    if (d.emoji) store.put({ id: 'wechatEmojiData', ...d.emoji });
                    if (d.bg) store.put({ id: 'wechatBgData', ...d.bg });

                    await new Promise(resolve => {
                        tx.oncomplete = resolve;
                        tx.onerror = resolve;
                    });
                }

                if (Array.isArray(d.presets)) {
                    window.wcPresets = d.presets;
                    if (typeof wcSavePresetsToStorage === 'function') wcSavePresetsToStorage();
                }

                if (d.chatPromptSettings && typeof d.chatPromptSettings === 'object' && typeof appSettings !== 'undefined') {
                    const promptSettings = d.chatPromptSettings;
                    if (Object.prototype.hasOwnProperty.call(promptSettings, 'activePromptId')) appSettings.wc_active_prompt_id = promptSettings.activePromptId;
                    if (Object.prototype.hasOwnProperty.call(promptSettings, 'builtinPromptPosition')) appSettings.wc_builtin_prompt_position = promptSettings.builtinPromptPosition;
                    if (Array.isArray(promptSettings.customPrompts)) appSettings.wc_custom_prompts_list = promptSettings.customPrompts;
                    if (Object.prototype.hasOwnProperty.call(promptSettings, 'activeCotId')) appSettings.wc_active_cot_id = promptSettings.activeCotId;
                    if (Array.isArray(promptSettings.customCots)) appSettings.wc_custom_cots_list = promptSettings.customCots;
                    if (Object.prototype.hasOwnProperty.call(promptSettings, 'activeCustomPresetId')) appSettings.wc_active_custom_preset_id = promptSettings.activeCustomPresetId;
                    if (Array.isArray(promptSettings.customPresets)) appSettings.wc_custom_presets_list = promptSettings.customPresets;
                    if (typeof saveAppSettings === 'function') saveAppSettings();
                }

                // 重新加载数据
                await wcReloadContactsFromStorage();
                if (typeof wcReloadChatDataFromStorage === 'function') await wcReloadChatDataFromStorage();
                if (window.WcGroupChat) await window.WcGroupChat.reload();
                if (typeof wcLoadWalletData === 'function') await wcLoadWalletData();
                if (typeof wcLoadFavoritesData === 'function') await wcLoadFavoritesData();

                showToast('微信数据恢复成功');
                wcCloseChatManagePage();
                wcRenderChatList();
            } catch (err) {
                console.error('恢复微信数据失败:', err);
                showCustomAlert('错误', '解析文件失败，请检查备份文件是否损坏。');
            }
        };
        reader.readAsText(file);
        event.target.value = '';
    }
    window.wcHandleWechatImportFile = wcHandleWechatImportFile;

    async function wcCleanStorageCache() {
        const confirmed = await showCustomConfirm('清理微信缓存', '清理缓存不会影响微信聊天记录与正常使用，确定清理吗？', '清理', false);
        if (confirmed) {
            try {
                const currentAccountId = wcGetCurrentAccountId();
                if (typeof appSettings !== 'undefined') {
                    appSettings[`wc_moments_list_${currentAccountId}`] = [];
                    if (typeof saveAppSettings === 'function') saveAppSettings();
                }
                showToast('已清理临时缓存数据');
                await wcRenderWechatStorage();
            } catch (err) {
                showToast('缓存已清理');
            }
        }
    }
    window.wcCleanStorageCache = wcCleanStorageCache;

    async function wcCleanStorageResource() {
        const confirmed = await showCustomConfirm('清理资源文件', '确定要清理冗余的表情包与自定义壁纸资源吗？', '清理', false);
        if (confirmed) {
            try {
                if (db && typeof storeName !== 'undefined') {
                    const tx = db.transaction([storeName], 'readwrite');
                    tx.objectStore(storeName).delete('wechatBgData');
                }
                wcChatBgList = [];
                showToast('资源文件已清理');
                await wcRenderWechatStorage();
            } catch (err) {
                showToast('资源已清理');
            }
        }
    }
    window.wcCleanStorageResource = wcCleanStorageResource;

    async function wcCleanOtherAccountsStorage() {
        const confirmed = await showCustomConfirm('清理其他账号记录', '确定清理此设备上其他账号的临时历史记录吗？', '清理', true);
        if (confirmed) {
            try {
                const currentAccountId = wcGetCurrentAccountId();
                const authData = await wcGetAuthData();
                const accounts = Array.isArray(authData?.accounts) ? authData.accounts : [];

                for (const acc of accounts) {
                    if (acc.maskId && acc.maskId !== currentAccountId && db && typeof storeName !== 'undefined') {
                        const tx = db.transaction([storeName], 'readwrite');
                        tx.objectStore(storeName).delete(`wechatChatData_${acc.maskId}`);
                        tx.objectStore(storeName).delete(`wechatMomentsData_${acc.maskId}`);
                    }
                }
                showToast('其他账号占用记录已清理');
                await wcRenderWechatStorage();
            } catch (err) {
                console.error('清理其他账号失败:', err);
                showToast('清理完成');
            }
        }
    }
    window.wcCleanOtherAccountsStorage = wcCleanOtherAccountsStorage;

    async function wcChangeWechatPassword() {
        try {
            const authData = await wcGetAuthData();
            const currentUserIndex = authData.accounts.findIndex(a => a.wxid === authData.currentLoginWxid);
            if (currentUserIndex === -1) return;

            const currentAccount = authData.accounts[currentUserIndex];

            const oldPwd = await showCustomPrompt('修改密码', { placeholder: '请输入原密码' }, '下一步');
            if (oldPwd === null) return;
            if (oldPwd !== currentAccount.password) {
                showCustomAlert('提示', '原密码输入不正确');
                return;
            }

            const newPwd = await showCustomPrompt('设置新密码', { placeholder: '请输入新密码' }, '确定');
            if (newPwd === null) return;
            if (!newPwd.trim()) {
                showCustomAlert('提示', '新密码不能为空');
                return;
            }

            authData.accounts[currentUserIndex].password = newPwd.trim();
            await wcSaveAuthData(authData);
            await wcRenderWechatSettings();
            showToast('密码已成功修改');
        } catch (error) {
            console.error('修改密码失败:', error);
            showToast('修改密码失败');
        }
    }
    window.wcChangeWechatPassword = wcChangeWechatPassword;

    async function wcManageChatHistory() {
        const confirmed = await showCustomConfirm('聊天记录管理', '是否要清空当前账号的所有聊天记录？此操作不可逆。', '清空记录', true);
        if (confirmed) {
            wcChatMessagesByContact = {};
            if (typeof wcSaveChatData === 'function') wcSaveChatData();
            showToast('已清空当前账号聊天记录');
            await wcRenderWechatStorage();
            await wcRenderWechatSettings();
        }
    }
    window.wcManageChatHistory = wcManageChatHistory;

    // --- 微信修改密码页面逻辑 (图片样式) ---
    function wcOpenWechatChangePwdPage() {
        const page = document.getElementById('page-wechat-change-pwd');
        if (!page) return;

        document.getElementById('wcChangePwdOldInput').value = '';
        document.getElementById('wcChangePwdNewInput').value = '';
        document.getElementById('wcChangePwdConfirmInput').value = '';
        wcCheckChangePwdValidation();

        document.querySelectorAll('#wechatAppUI .page').forEach(p => p.classList.remove('active'));
        page.classList.add('active');
    }
    window.wcOpenWechatChangePwdPage = wcOpenWechatChangePwdPage;

    function wcCloseWechatChangePwdPage() {
        document.querySelectorAll('#wechatAppUI .page').forEach(p => p.classList.remove('active'));
        document.getElementById('page-wechat-settings').classList.add('active');
    }
    window.wcCloseWechatChangePwdPage = wcCloseWechatChangePwdPage;

    function wcCheckChangePwdValidation() {
        const oldPwd = document.getElementById('wcChangePwdOldInput')?.value || '';
        const newPwd = document.getElementById('wcChangePwdNewInput')?.value || '';
        const confirmPwd = document.getElementById('wcChangePwdConfirmInput')?.value || '';
        const submitBtn = document.getElementById('wcChangePwdSubmitBtn');

        // 规则1：8-16位
        const isLengthValid = newPwd.length >= 8 && newPwd.length <= 16;
        const ruleLenEl = document.getElementById('wcPwdRuleLen');
        if (ruleLenEl) ruleLenEl.classList.toggle('passed', isLengthValid);

        // 规则2：至少包含2种字符 (数字、字母、符号)
        let typeCount = 0;
        if (/[0-9]/.test(newPwd)) typeCount++;
        if (/[a-zA-Z]/.test(newPwd)) typeCount++;
        if (/[^0-9a-zA-Z]/.test(newPwd)) typeCount++;
        const isTypesValid = typeCount >= 2;
        const ruleTypesEl = document.getElementById('wcPwdRuleTypes');
        if (ruleTypesEl) ruleTypesEl.classList.toggle('passed', isTypesValid);

        // 按钮可用状态
        const canSubmit = oldPwd.length > 0 && isLengthValid && isTypesValid && confirmPwd.length > 0;
        if (submitBtn) {
            submitBtn.disabled = !canSubmit;
            submitBtn.classList.toggle('active', canSubmit);
        }
    }
    window.wcCheckChangePwdValidation = wcCheckChangePwdValidation;

    async function wcSubmitChangePassword() {
        const oldPwd = document.getElementById('wcChangePwdOldInput').value;
        const newPwd = document.getElementById('wcChangePwdNewInput').value;
        const confirmPwd = document.getElementById('wcChangePwdConfirmInput').value;

        if (newPwd !== confirmPwd) {
            showCustomAlert('提示', '两次输入的新密码不一致');
            return;
        }

        try {
            const authData = await wcGetAuthData();
            const currentUserIndex = authData.accounts.findIndex(a => a.wxid === authData.currentLoginWxid);
            if (currentUserIndex === -1) return;

            const currentAccount = authData.accounts[currentUserIndex];
            if (currentAccount.password !== oldPwd) {
                showCustomAlert('提示', '原密码不正确');
                return;
            }

            authData.accounts[currentUserIndex].password = newPwd.trim();
            await wcSaveAuthData(authData);
            showToast('密码设置成功');
            wcCloseWechatChangePwdPage();
            await wcRenderWechatSettings();
        } catch (e) {
            console.error('修改密码失败', e);
            showToast('修改失败，请重试');
        }
    }
    window.wcSubmitChangePassword = wcSubmitChangePassword;

    // --- 微信全局个性化设置 (背景与全局 CSS) ---
    function wcOpenWechatPersonalize() {
        const page = document.getElementById('page-wechat-personalize');
        if (!page) return;

        document.querySelectorAll('#wechatAppUI .page').forEach(p => p.classList.remove('active'));
        page.classList.add('active');

        wcRenderPersonalizePage();
    }
    window.wcOpenWechatPersonalize = wcOpenWechatPersonalize;

    function wcCloseWechatPersonalize() {
        document.querySelectorAll('#wechatAppUI .page').forEach(p => p.classList.remove('active'));
        document.getElementById('page-wechat-settings').classList.add('active');
    }
    window.wcCloseWechatPersonalize = wcCloseWechatPersonalize;

    function wcRenderPersonalizePage() {
        const accountId = wcGetCurrentAccountId();
        const globalBg = (typeof appSettings !== 'undefined' && appSettings[`wc_global_bg_${accountId}`]) ? appSettings[`wc_global_bg_${accountId}`] : '';
        const globalCss = (typeof appSettings !== 'undefined' && appSettings[`wc_global_css_${accountId}`]) ? appSettings[`wc_global_css_${accountId}`] : '';
        const globalJs = (typeof appSettings !== 'undefined' && appSettings[`wc_global_js_${accountId}`]) ? appSettings[`wc_global_js_${accountId}`] : '';

        const mockupEl = document.getElementById('wcGlobalBgMockup');
        if (mockupEl) {
            if (globalBg) {
                mockupEl.style.backgroundImage = `url('${globalBg}')`;
                mockupEl.style.backgroundColor = 'transparent';
            } else {
                mockupEl.style.backgroundImage = 'none';
                mockupEl.style.backgroundColor = '#D4D4D8';
            }
        }

        const cssInput = document.getElementById('wcGlobalCustomCssInput');
        if (cssInput) cssInput.value = globalCss;

        const jsInput = document.getElementById('wcGlobalCustomJsInput');
        if (jsInput) jsInput.value = globalJs;

        // 渲染四个内嵌手机壳纯预览页面
        wcUpdateAllPersonalizePreviews();
    }

    function wcProcessPreviewCustomCss(customCss) {
        let processedCss = (customCss || '').replace(/\/\*[\s\S]*?\*\//g, '');
        return processedCss.replace(/(^|\})\s*([^{]+)/g, function(m, p1, p2) {
            if (p2.trim().startsWith('@')) return m;
            const prefixed = p2.split(',').map(selector => {
                const s = selector.trim();
                if (!s) return '';
                if (s.includes('#page-chat-room')) return '';
                if (s.startsWith('#page-chat-list') || s.startsWith('#page-contacts') || s.startsWith('#page-moments') || s.startsWith('#page-profile') || s.startsWith('#page-wc-login') || s.startsWith('#page-wc-register')) {
                    return '#wechatAppUI ' + s;
                }
                if (s.startsWith('#wechatAppUI')) {
                    return s;
                }
                return '#wechatAppUI :is(#page-chat-list, #page-contacts, #page-moments, #page-profile, #page-wc-login, #page-wc-register) ' + s;
            }).filter(Boolean).join(', ');
            return p1 + (prefixed ? ' ' + prefixed + ' ' : ' ');
        });
    }

    let wcPreviewCssDebounceTimer = null;
    function wcHandleGlobalCssInput(val) {
        if (val.length > WC_GLOBAL_CUSTOM_CSS_MAX_LENGTH) {
            if (typeof showToast === 'function') showToast(`代码过大，请控制在 ${WC_GLOBAL_CUSTOM_CSS_MAX_LENGTH / 1000} KB 以内`);
            return;
        }
        if (wcPreviewCssDebounceTimer) clearTimeout(wcPreviewCssDebounceTimer);
        wcPreviewCssDebounceTimer = setTimeout(() => {
            const processedCss = wcProcessPreviewCustomCss(val);
            const iframeIds = ['wcPreviewIframeChat', 'wcPreviewIframeContacts', 'wcPreviewIframeMoments', 'wcPreviewIframeProfile'];
            iframeIds.forEach(id => {
                const iframe = document.getElementById(id);
                if (!iframe) return;
                const doc = iframe.contentDocument || iframe.contentWindow?.document;
                if (!doc) return;
                let styleTag = doc.getElementById('wc-preview-custom-css');
                if (styleTag) styleTag.textContent = processedCss;
            });
        }, 180);
    }
    window.wcHandleGlobalCssInput = wcHandleGlobalCssInput;

    function wcHandleGlobalJsInput(val) {
        if (val.length > WC_GLOBAL_CUSTOM_JS_MAX_LENGTH) {
            if (typeof showToast === 'function') showToast(`脚本过大，请控制在 ${WC_GLOBAL_CUSTOM_JS_MAX_LENGTH / 1000} KB 以内`);
            return;
        }

        // Scripts are executed only after the user explicitly taps Apply.
    }
    window.wcHandleGlobalJsInput = wcHandleGlobalJsInput;

    function wcUpdateAllPersonalizePreviews(forceFullRebuild = false) {
        const accountId = typeof wcGetCurrentAccountId === 'function' ? wcGetCurrentAccountId() : 'default';
        const globalBg = (typeof appSettings !== 'undefined' && appSettings[`wc_global_bg_${accountId}`]) ? appSettings[`wc_global_bg_${accountId}`] : '';
        const cssInput = document.getElementById('wcGlobalCustomCssInput');
        const customCss = cssInput ? cssInput.value : '';
        const processedCss = wcProcessPreviewCustomCss(customCss);

        const jsInput = document.getElementById('wcGlobalCustomJsInput');
        const customJs = jsInput ? jsInput.value : '';

        const pages = [
            { id: 'wcPreviewIframeChat', elId: 'page-chat-list', tab: 'wc-nav-chat' },
            { id: 'wcPreviewIframeContacts', elId: 'page-contacts', tab: 'wc-nav-contacts' },
            { id: 'wcPreviewIframeMoments', elId: 'page-moments', tab: 'wc-nav-moments' },
            { id: 'wcPreviewIframeProfile', elId: 'page-profile', tab: 'wc-nav-profile' }
        ];

        // 仅在已有结构且不需要重构时增量刷新，0延迟响应
        if (!forceFullRebuild) {
            let allReady = true;
            pages.forEach(p => {
                const iframe = document.getElementById(p.id);
                const doc = iframe?.contentDocument || iframe?.contentWindow?.document;
                if (!doc || !doc.getElementById('wc-preview-custom-css')) {
                    allReady = false;
                }
            });
            if (allReady) {
                pages.forEach(p => {
                    const iframe = document.getElementById(p.id);
                    const doc = iframe.contentDocument || iframe.contentWindow?.document;
                    const styleTag = doc.getElementById('wc-preview-custom-css');
                    if (styleTag) styleTag.textContent = processedCss;
                    const appContainer = doc.getElementById('wechatAppUI');
                    if (appContainer) {
                        if (globalBg) {
                            appContainer.style.backgroundImage = `url('${globalBg}')`;
                            appContainer.style.backgroundSize = 'cover';
                            appContainer.style.backgroundPosition = 'center';
                        } else {
                            appContainer.style.backgroundImage = 'none';
                        }
                    }
                    iframe.classList.add('ready');
                });
                return;
            }
        }

        // 收集所有样式，直接提取文本内联，避免网络二次发起请求造成的 SVG 裸奔闪烁
        let collectedStyles = '';
        for (const sheet of Array.from(document.styleSheets)) {
            try {
                if (sheet.ownerNode?.id === 'wc-dynamic-global-custom-style') continue;
                for (const rule of Array.from(sheet.cssRules || [])) {
                    collectedStyles += rule.cssText + '\n';
                }
            } catch (e) {
                // 针对跨域 link 补充回退
                if (sheet.href) {
                    collectedStyles += `@import url("${sheet.href}");\n`;
                }
            }
        }

        // 强力消除底部白边，强制 805px 视口高度贴底，并保护全局背景
        const basePreviewStyle = `
            html, body {
                margin: 0 !important;
                padding: 0 !important;
                width: 375px !important;
                height: 805px !important;
                min-height: 805px !important;
                max-height: 805px !important;
                overflow: hidden !important;
                background-color: #ededed !important;
                -webkit-user-select: none !important;
                user-select: none !important;
                pointer-events: none !important;
                box-sizing: border-box !important;
            }
            #wechatAppUI {
                position: absolute !important;
                top: 0 !important;
                left: 0 !important;
                right: 0 !important;
                bottom: 0 !important;
                width: 375px !important;
                height: 805px !important;
                min-height: 805px !important;
                overflow: hidden !important;
                transform: none !important;
                display: block !important;
                ${globalBg ? `background-image: url('${globalBg}') !important; background-size: cover !important; background-position: center !important;` : ''}
            }
            #wechatAppUI .page {
                display: flex !important;
                flex-direction: column !important;
                position: absolute !important;
                top: 0 !important;
                left: 0 !important;
                right: 0 !important;
                bottom: 0 !important;
                width: 100% !important;
                height: 100% !important;
                min-height: 100% !important;
                opacity: 1 !important;
                visibility: visible !important;
                overflow-y: auto !important;
                pointer-events: none !important;
                padding-bottom: 70px !important;
            }
            #wechatAppUI .bottom-nav-wrapper {
                display: block !important;
                visibility: visible !important;
                opacity: 1 !important;
                position: absolute !important;
                bottom: 12px !important;
                left: 50% !important;
                transform: translateX(-50%) !important;
                pointer-events: none !important;
                z-index: 9999 !important;
            }
            * {
                pointer-events: none !important;
                user-select: none !important;
                -webkit-user-select: none !important;
            }
        `;

        const bottomNavEl = document.querySelector('#wechatAppUI .bottom-nav-wrapper');

        pages.forEach(p => {
            const iframe = document.getElementById(p.id);
            if (!iframe) return;
            const targetEl = document.getElementById(p.elId);
            if (!targetEl) return;

            iframe.classList.remove('ready');

            const pageClone = targetEl.cloneNode(true);
            pageClone.classList.add('active');

            let navHtml = '';
            if (bottomNavEl) {
                const navClone = bottomNavEl.cloneNode(true);
                navClone.querySelectorAll('.nav-item').forEach(item => {
                    if (item.id === p.tab) {
                        item.classList.add('active');
                    } else {
                        item.classList.remove('active');
                    }
                });
                navHtml = navClone.outerHTML;
            }

            // 同步执行自定义 JS 脚本在 iframe 沙箱环境中的运行
            const jsExecutionScript = customJs ? `
                <script>
                window.addEventListener('DOMContentLoaded', function() {
                    try {
                        (function(){
                            ${customJs}
                        })();
                    } catch(err) {
                        console.debug('Preview JS Error:', err);
                    }
                });
                <\/script>
            ` : '';

            const docContent = `<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=375, height=805, initial-scale=1, maximum-scale=1, user-scalable=no">
    <style>${collectedStyles}</style>
    <style id="wc-preview-custom-css">${processedCss}</style>
    <style>${basePreviewStyle}</style>
    ${jsExecutionScript}
</head>
<body>
    <div class="wechat-app-container show" id="wechatAppUI">
        ${pageClone.outerHTML}
        ${navHtml}
    </div>
</body>
</html>`;

            try {
                const doc = iframe.contentDocument || iframe.contentWindow?.document;
                if (doc) {
                    doc.open();
                    doc.write(docContent);
                    doc.close();
                    setTimeout(() => { iframe.classList.add('ready'); }, 50);
                } else {
                    iframe.srcdoc = docContent;
                    iframe.onload = () => { iframe.classList.add('ready'); };
                }
            } catch (err) {
                iframe.srcdoc = docContent;
                iframe.onload = () => { iframe.classList.add('ready'); };
            }
        });
    }
    window.wcUpdateAllPersonalizePreviews = wcUpdateAllPersonalizePreviews;

    function wcOpenGlobalBgMenu(event) {
        event.stopPropagation();
        const menuOverlay = document.getElementById('wcChatBgMenuOverlay');
        const menu = document.getElementById('wcChatBgMenu');
        if (!menuOverlay || !menu) return;

        menu.innerHTML = `
            <div class="icon-menu-item" onclick="document.getElementById('wcGlobalBgFileInput').click(); wcCloseChatBgMenu();">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 16V6a2 2 0 0 1 2-2h10"></path><rect x="8" y="8" width="14" height="14" rx="2" ry="2"></rect><circle cx="13.5" cy="13.5" r="1.5"></circle><path d="M8 18l4-4 2 2 3-3 5 5"></path></svg>
                <span>照片图库</span>
            </div>
            <div class="icon-menu-item" onclick="wcHandleGlobalBgUrlPrompt();">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"></path><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"></path></svg>
                <span>使用 URL</span>
            </div>
        `;

        menuOverlay.style.display = 'block';
        const rect = event.currentTarget.getBoundingClientRect();
        let top = event.clientY ? event.clientY + 10 : rect.top + 20;
        let left = event.clientX ? Math.max(16, event.clientX - 70) : rect.left + 20;
        if (top + 130 > window.innerHeight) top = (event.clientY || rect.bottom) - 120;
        if (left + 160 > window.innerWidth) left = window.innerWidth - 170;
        menu.style.top = top + 'px';
        menu.style.left = left + 'px';
    }
    window.wcOpenGlobalBgMenu = wcOpenGlobalBgMenu;

    function wcHandleGlobalBgUpload(event) {
        const file = event.target.files[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onload = function(e) {
            wcSetGlobalBg(e.target.result);
            showToast('微信壁纸已更新');
        };
        reader.readAsDataURL(file);
        event.target.value = '';
    }
    window.wcHandleGlobalBgUpload = wcHandleGlobalBgUpload;

    async function wcHandleGlobalBgUrlPrompt() {
        wcCloseChatBgMenu();
        let url = null;
        if (typeof showCustomPrompt === 'function') {
            url = await showCustomPrompt('设置微信壁纸', { placeholder: '输入图片 URL' }, '确定');
        } else {
            url = window.prompt('请输入图片 URL:');
        }
        if (url && url.trim()) {
            wcSetGlobalBg(url.trim());
            showToast('微信壁纸已更新');
        }
    }
    window.wcHandleGlobalBgUrlPrompt = wcHandleGlobalBgUrlPrompt;

    function wcSetGlobalBg(url) {
        const accountId = wcGetCurrentAccountId();
        if (typeof appSettings !== 'undefined') {
            appSettings[`wc_global_bg_${accountId}`] = url;
            if (typeof saveAppSettings === 'function') saveAppSettings();
        }
        wcApplyGlobalBackgroundAndCss();
        wcRenderPersonalizePage();
        wcUpdateAllPersonalizePreviews(false);
        if (!url) showToast('已恢复默认壁纸');
    }
    window.wcSetGlobalBg = wcSetGlobalBg;

    // --- 内置“仿微信”主题预设静态资源 ---
    const WC_BUILTIN_PRESET_WECHAT_CSS = `/* =========================================================
   微信 (WeChat)
   ========================================================= */

/* ---------------- 0. 全局变量与底色隔离 ---------------- */
#wechatAppUI {
    --wc-green: #07c160;
    --wc-bg: #ededed;
    --wc-card: #ffffff;
    --wc-text-main: #191919;
    --wc-text-sub: #7f7f7f;
    --wc-text-tip: #b2b2b2;
    --wc-text-blue: #576b95;
    --wc-border: rgba(0, 0, 0, 0.08);
    --wc-header-dark: #2e3132;
    background-color: var(--wc-bg) !important;
    font-family: -apple-system, BlinkMacSystemFont, "PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", sans-serif !important;
}

/* 仅作用于主页面底色隔离（朋友圈保持纯白背景） */
#wechatAppUI :is(#page-chat-list, #page-contacts, #page-profile) {
    background-color: var(--wc-bg) !important;
}

#wechatAppUI #page-moments {
    background-color: #ffffff !important;
}

/* 保护钱包、表情包、系统设置等所有子页面，保持独立纯白无干扰 */
#wechatAppUI :is(#page-wallet, #wc-page-emoji-groups, #wc-page-emoji-detail, #page-wallet-settings, #page-family-cards, #page-favorites, #page-wechat-settings, #page-wechat-storage, #page-wechat-personalize, #page-wechat-change-pwd, #page-wechat-chat-manage) {
    background-color: #ffffff !important;
}

/* ---------------- 1. 微信原生贴底导航栏 (未激活空心 / 激活实心绿色) ---------------- */
#wechatAppUI .bottom-nav-wrapper {
    position: absolute !important;
    bottom: 0 !important;
    left: 0 !important;
    right: 0 !important;
    width: 100% !important;
    max-width: 100% !important;
    transform: none !important;
    z-index: 900 !important;
}

#wechatAppUI .bottom-nav {
    background: #f7f7f7 !important;
    backdrop-filter: blur(20px) !important;
    -webkit-backdrop-filter: blur(20px) !important;
    border-radius: 0 !important;
    border: none !important;
    border-top: 0.5px solid rgba(0, 0, 0, 0.14) !important;
    box-shadow: none !important;
    padding: 6px 0 calc(6px + env(safe-area-inset-bottom, 12px)) 0 !important;
    height: auto !important;
}

#wechatAppUI .bottom-nav .nav-item {
    color: #2c2c2c !important;
    font-size: 10.5px !important;
    font-weight: 500 !important;
    background: transparent !important;
    border-radius: 0 !important;
    padding: 2px 0 !important;
    gap: 2px !important;
}

#wechatAppUI .bottom-nav .nav-item svg path {
    display: none !important;
}

/* 1. 微信 (聊天) Tab (放大至 28px 保持微信原生质感) */
#wechatAppUI #wc-nav-chat .nav-icon-wrapper svg {
    width: 28px !important;
    height: 28px !important;
    background-color: #2c2c2c !important;
    -webkit-mask: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 1024 1024'%3E%3Cpath d='M175.616 833.024l18.944-48.64c13.824-35.328 25.088-74.24 26.112-89.088-71.68-58.88-110.592-135.68-110.592-217.6 0-173.568 178.688-314.368 398.848-314.368s398.848 141.312 398.848 314.368-178.688 314.368-398.848 314.368c-50.688 0-99.84-7.168-145.92-21.504-16.384 2.048-82.944 24.064-137.728 44.544l-49.664 17.92zM508.416 209.92c-194.048 0-351.744 119.808-351.744 267.776 0 69.632 34.816 135.168 98.816 185.344 8.192 6.656 22.528 17.92-0.512 90.624 99.84-34.816 111.616-31.232 118.272-29.184 43.008 13.824 88.064 20.48 135.168 20.48 194.048 0 351.744-119.808 351.744-267.776S702.464 209.92 508.416 209.92z'/%3E%3C/svg%3E") center/contain no-repeat !important;
}
#wechatAppUI #wc-nav-chat.active { color: var(--wc-green) !important; }
#wechatAppUI #wc-nav-chat.active .nav-icon-wrapper svg {
    width: 28px !important;
    height: 28px !important;
    background-color: var(--wc-green) !important;
    -webkit-mask: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 1024 1024'%3E%3Cpath d='M175.616 833.024l18.944-48.64c13.824-35.328 25.088-74.24 26.112-89.088-71.68-58.88-110.592-135.68-110.592-217.6 0-173.568 178.688-314.368 398.848-314.368s398.848 141.312 398.848 314.368-178.688 314.368-398.848 314.368c-50.688 0-99.84-7.168-145.92-21.504-16.384 2.048-82.944 24.064-137.728 44.544l-49.664 17.92z'/%3E%3C/svg%3E") center/contain no-repeat !important;
}

/* 2. 通讯录 Tab */
#wechatAppUI #wc-nav-contacts .nav-icon-wrapper svg {
    width: 24px !important;
    height: 24px !important;
    background-color: #2c2c2c !important;
    -webkit-mask: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 1070 1024'%3E%3Cpath d='M898.420364 806.167273a30.254545 30.254545 0 0 1 11.264 13.312c5.771636 13.265455 11.031273 32.814545 11.031272 55.854545 0 14.289455-2.048 23.831273-6.516363 35.467637l-0.884364 2.373818a21.504 21.504 0 0 0-1.396364 4.747636 30.254545 30.254545 0 0 1-29.975272 25.879273H109.847273a30.254545 30.254545 0 0 1-26.484364-15.592727 122.181818 122.181818 0 0 1-7.214545-16.151273 105.658182 105.658182 0 0 1-7.261091-36.770909v-0.186182c0-13.125818 2.606545-26.298182 6.842182-39.237818 2.466909-7.633455 5.026909-13.684364 6.935272-17.594182a30.254545 30.254545 0 0 1 10.705455-12.101818l141.730909-91.927273a96523.636364 96523.636364 0 0 1 140.101818-90.810182c-0.139636 0.046545 0.837818-0.930909 2.094546-2.978909 9.541818-14.848 7.912727-38.539636-19.456-77.172364-33.093818-42.449455-64.372364-151.272727-62.324364-238.498909 2.978909-124.322909 66.746182-207.127273 199.028364-212.712727l4.747636 0.139636c130.234182 5.585455 193.536 88.436364 195.630545 212.805819 1.442909 87.04-30.487273 195.816727-63.394909 237.986909-26.949818 35.374545-28.253091 58.786909-17.547636 76.241454 1.396364 2.234182 2.56 3.816727 3.258182 4.654546l281.134545 182.272zm-316.416-133.073455l-2.978909-2.187636a82.711273 82.711273 0 0 1-16.616728-20.061091c-23.738182-38.865455-20.945455-89.367273 21.224728-144.802909 24.110545-30.859636 52.084364-126.138182 50.827636-200.005818-1.582545-95.092364-43.054545-149.317818-137.541818-153.367273l-3.072-0.093091c-93.882182 4.468364-135.540364 58.88-137.774546 153.6-1.768727 74.007273 25.6 169.192727 50.362182 200.983273 41.797818 59.019636 45.381818 109.381818 21.829818 146.013091a71.773091 71.773091 0 0 1-18.478545 19.921454l-275.549091 178.734546a70.190545 70.190545 0 0 0-4.794182 23.412363c0 2.513455 0.418909 5.306182 1.070546 8.052364h729.041454a36.864 36.864 0 0 0 0.651636-8.005818c0-8.983273-1.489455-17.454545-3.304727-23.924364l-274.897454-178.269091zM772.933818 373.434182h248.971637v60.509091h-248.971637v-60.509091zm49.524364 131.956363h197.957818v60.509091H822.458182v-60.509091zm49.524363 132.235637h149.504V698.181818h-149.504v-60.509091z'/%3E%3C/svg%3E") center/contain no-repeat !important;
}
#wechatAppUI #wc-nav-contacts.active { color: var(--wc-green) !important; }
#wechatAppUI #wc-nav-contacts.active .nav-icon-wrapper svg {
    background-color: var(--wc-green) !important;
    -webkit-mask: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 1070 1024'%3E%3Cpath d='M898.420364 806.167273a30.254545 30.254545 0 0 1 11.264 13.312c5.771636 13.265455 11.031273 32.814545 11.031272 55.854545 0 14.289455-2.048 23.831273-6.516363 35.467637l-0.884364 2.373818a21.504 21.504 0 0 0-1.396364 4.747636 30.254545 30.254545 0 0 1-29.975272 25.879273H109.847273a30.254545 30.254545 0 0 1-26.484364-15.592727 122.181818 122.181818 0 0 1-7.214545-16.151273 105.658182 105.658182 0 0 1-7.261091-36.770909v-0.186182c0-13.125818 2.606545-26.298182 6.842182-39.237818 2.466909-7.633455 5.026909-13.684364 6.935272-17.594182a30.254545 30.254545 0 0 1 10.705455-12.101818l141.730909-91.927273a96523.636364 96523.636364 0 0 1 140.101818-90.810182c-0.139636 0.046545 0.837818-0.930909 2.094546-2.978909 9.541818-14.848 7.912727-38.539636-19.456-77.172364-33.093818-42.449455-64.372364-151.272727-62.324364-238.498909 2.978909-124.322909 66.746182-207.127273 199.028364-212.712727l4.747636 0.139636c130.234182 5.585455 193.536 88.436364 195.630545 212.805819 1.442909 87.04-30.487273 195.816727-63.394909 237.986909-26.949818 35.374545-28.253091 58.786909-17.547636 76.241454 1.396364 2.234182 2.56 3.816727 3.258182 4.654546l281.134545 182.272zM772.933818 373.434182h248.971637v60.509091h-248.971637v-60.509091zm49.524364 131.956363h197.957818v60.509091H822.458182v-60.509091zm49.524363 132.235637h149.504V698.181818h-149.504v-60.509091z'/%3E%3C/svg%3E") center/contain no-repeat !important;
}

/* 3. 发现 (朋友圈) Tab */
#wechatAppUI #wc-nav-moments .nav-icon-wrapper svg {
    width: 24px !important;
    height: 24px !important;
    background-color: #2c2c2c !important;
    -webkit-mask: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 1024 1024'%3E%3Cpath d='M541.184 97.450667c-244.736 0-443.733333 198.997333-443.733333 443.733333s198.997333 443.733333 443.733333 443.733333 443.733333-198.997333 443.733333-443.733333-198.997333-443.733333-443.733333-443.733333z m0 819.2c-207.018667 0-375.466667-168.448-375.466667-375.466667s168.448-375.466667 375.466667-375.466667 375.466667 168.448 375.466667 375.466667-168.448 375.466667-375.466667 375.466667z'/%3E%3Cpath d='M689.834667 365.397333c-3.584 0-7.338667 0.682667-11.093334 2.389334l-186.88 82.944a81.8688 81.8688 0 0 0-41.130666 41.130666l-82.944 186.88c-8.362667 18.773333 6.314667 38.058667 24.576 38.058667 3.584 0 7.338667-0.682667 11.093333-2.389333L590.336 631.466667A81.8688 81.8688 0 0 0 631.466667 590.336l82.944-186.88c8.362667-18.773333-6.314667-38.058667-24.576-38.058667z m-120.661334 197.290667a13.312 13.312 0 0 1-6.485333 6.485333l-88.917333 39.424 39.424-88.917333c1.365333-2.901333 3.584-5.12 6.485333-6.485333l88.917333-39.424-39.424 88.917333z'/%3E%3C/svg%3E") center/contain no-repeat !important;
}
#wechatAppUI #wc-nav-moments.active { color: var(--wc-green) !important; }
#wechatAppUI #wc-nav-moments.active .nav-icon-wrapper svg {
    background-color: var(--wc-green) !important;
    -webkit-mask: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 1024 1024'%3E%3Cpath d='M512 64C264.6 64 64 264.6 64 512s200.6 448 448 448 448-200.6 448-448S759.4 64 512 64zm177.8 301.4l-82.9 186.9a81.9 81.9 0 0 1-41.1 41.1l-186.9 82.9c-18.3 8.1-32.9-19.3-24.6-38.1l82.9-186.9a81.9 81.9 0 0 1 41.1-41.1l186.9-82.9c18.3-8.1 32.9 19.3 24.6 38.1z'/%3E%3C/svg%3E") center/contain no-repeat !important;
}

/* 4. 我 Tab */
#wechatAppUI #wc-nav-profile .nav-icon-wrapper svg {
    width: 24px !important;
    height: 24px !important;
    background-color: #2c2c2c !important;
    -webkit-mask: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 1025 1024'%3E%3Cpath d='M513.053033 128.134315c92.101976 0 167.011583 97.911564 167.011583 218.211071 0 53.270759-18.323176 115.419126-77.034093 184.449557-43.083258 50.145432-58.713986 99.103773-46.333434 145.374782 21.634754 80.841998 104.861169 114.232034 196.524126 146.555734 47.148025 16.63157 126.058951 44.452507 136.874793 67.087079 0.499397 1.190162 1.311941 3.379119 2.125509 6.629296l-757.712721 0c1.563687-4.626589 3.501922-9.499807 5.937507-14.626817 10.821982-23.071545 79.85139-52.084691 125.621978-71.282836 83.535469-35.137927 158.446099-71.530488 181.266922-148.182869 12.192255-40.893277 3.313624-83.782097-26.137517-127.302328-1.063266-1.499215-75.282108-126.671941-75.282108-188.700575C345.915577 228.047562 422.448226 128.134315 513.053033 128.134315M513.053033 64.108092c-127.308468 0-231.166749 126.551185-231.166749 282.237295 0 86.158328 21.071909 143.933898 86.289318 224.590668 107.5485 158.81246-232.541115 170.445963-285.689072 283.613707-15.755578 33.641782-18.509427 59.776229-18.261775 89.789193 0 3.872376-0.370455 7.880859 1.566757 11.128989 1.937212 3.122257 4.938713 5.003184 8.192982 5.003184l876.887561 0c3.127374 0 6.190276-1.880927 8.065063-5.003184 1.937212-3.24813 1.563687-7.128693 1.563687-11.128989 0.62834-33.642805-3.87647-63.775501-12.693699-82.160079-56.460558-118.419604-450.887269-109.54302-296.190744-289.743606 50.64483-59.522437 92.476524-139.931555 92.476524-226.089883C744.092885 190.659277 640.48328 64.108092 513.053033 64.108092L513.053033 64.108092z'/%3E%3C/svg%3E") center/contain no-repeat !important;
}
#wechatAppUI #wc-nav-profile.active { color: var(--wc-green) !important; }
#wechatAppUI #wc-nav-profile.active .nav-icon-wrapper svg {
    background-color: var(--wc-green) !important;
    -webkit-mask: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 1025 1024'%3E%3Cpath d='M513.053033 64.108092c-127.308468 0-231.166749 126.551185-231.166749 282.237295 0 86.158328 21.071909 143.933898 86.289318 224.590668 107.5485 158.81246-232.541115 170.445963-285.689072 283.613707-15.755578 33.641782-18.509427 59.776229-18.261775 89.789193 0 3.872376-0.370455 7.880859 1.566757 11.128989 1.937212 3.122257 4.938713 5.003184 8.192982 5.003184l876.887561 0c3.127374 0 6.190276-1.880927 8.065063-5.003184 1.937212-3.24813 1.563687-7.128693 1.563687-11.128989 0.62834-33.642805-3.87647-63.775501-12.693699-82.160079-56.460558-118.419604-450.887269-109.54302-296.190744-289.743606 50.64483-59.522437 92.476524-139.931555 92.476524-226.089883C744.092885 190.659277 640.48328 64.108092 513.053033 64.108092L513.053033 64.108092z'/%3E%3C/svg%3E") center/contain no-repeat !important;
}

/* 底栏文本：微信 / 通讯录 / 发现 / 我 */
#wechatAppUI .bottom-nav .nav-item span { font-size: 0 !important; }
#wechatAppUI #wc-nav-chat span::after { content: '微信' !important; font-size: 10.5px !important; }
#wechatAppUI #wc-nav-contacts span::after { content: '通讯录' !important; font-size: 10.5px !important; }
#wechatAppUI #wc-nav-moments span::after { content: '发现' !important; font-size: 10.5px !important; }
#wechatAppUI #wc-nav-profile span::after { content: '我' !important; font-size: 10.5px !important; }

/* ---------------- 2. 微信聊天列表页 (Chat List) ---------------- */
#wechatAppUI #page-chat-list {
    background-color: var(--wc-bg) !important;
    padding-bottom: 70px !important;
    position: relative !important;
}

#wechatAppUI #page-chat-list .list-header {
    background-color: var(--wc-header-dark) !important;
    padding: 45px 16px 12px 16px !important;
    display: flex !important;
    align-items: center !important;
    justify-content: space-between !important;
    position: relative !important;
    height: 44px !important;
    box-sizing: content-box !important;
}

/* 左上角纯空心五角星 SVG */
#wechatAppUI #page-chat-list .list-header .title {
    width: 24px !important;
    height: 24px !important;
    font-size: 0 !important;
    color: transparent !important;
    cursor: pointer !important;
    background: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 48 48'%3E%3Cpath stroke='%23ffffff' stroke-linejoin='round' stroke-width='3.5' d='M44.9994 19.4993H28.8747l-4.875 -14.99979 -4.8749 14.99979H3l13.1248 8.9999 -5.0624 14.9998 12.9373 -9.3749L36.937 43.499l-5.0624 -14.9998 13.1248 -8.9999Z'/%3E%3C/svg%3E") center/contain no-repeat !important;
    z-index: 10 !important;
}

#wechatAppUI #page-chat-list .list-header::after {
    content: 'WeChat' !important;
    position: absolute !important;
    left: 50% !important;
    top: 50px !important;
    transform: translateX(-50%) !important;
    font-size: 17px !important;
    font-weight: 600 !important;
    color: #ffffff !important;
    pointer-events: none !important;
}

#wechatAppUI #page-chat-list .list-header .more-btn { display: none !important; }

/* 右上角加号添加好友按钮 */
#wechatAppUI #page-chat-list .fab-container {
    position: absolute !important;
    top: 50px !important;
    right: 16px !important;
    bottom: auto !important;
    z-index: 100 !important;
    gap: 0 !important;
}
#wechatAppUI #page-chat-list .fab-small { display: none !important; }
#wechatAppUI #page-chat-list .fab-large.wc-add-friend-fab {
    width: 28px !important;
    height: 28px !important;
    background: transparent !important;
    box-shadow: none !important;
    border-radius: 0 !important;
    padding: 0 !important;
    display: flex !important;
    align-items: center !important;
    justify-content: center !important;
    cursor: pointer !important;
}
#wechatAppUI #page-chat-list .fab-large.wc-add-friend-fab svg { display: none !important; }
#wechatAppUI #page-chat-list .fab-large.wc-add-friend-fab::after {
    content: '' !important;
    display: block !important;
    width: 22px !important;
    height: 22px !important;
    background: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%23ffffff' stroke-width='2.4' stroke-linecap='round' stroke-linejoin='round'%3E%3Cline x1='12' y1='5' x2='12' y2='19'/%3E%3Cline x1='5' y1='12' x2='19' y2='12'/%3E%3C/svg%3E") center/contain no-repeat !important;
}

#wechatAppUI #page-chat-list .search-container {
    padding: 8px 12px !important;
    background-color: var(--wc-bg) !important;
}
#wechatAppUI .search-bar {
    background-color: #ffffff !important;
    border-radius: 6px !important;
    height: 36px !important;
    display: flex !important;
    justify-content: center !important;
    align-items: center !important;
    border: none !important;
    box-shadow: none !important;
    color: var(--wc-text-tip) !important;
    font-size: 15px !important;
}
#wechatAppUI .search-bar svg {
    width: 16px !important;
    height: 16px !important;
    stroke: var(--wc-text-tip) !important;
    margin-right: 6px !important;
}

#wechatAppUI .chat-list {
    background-color: transparent !important;
    padding-bottom: 30px !important;
}
#wechatAppUI .chat-list .wc-swipe-wrapper {
    background-color: #ffffff !important;
}
#wechatAppUI .chat-list .chat-item {
    padding: 12px 16px !important;
    background-color: #ffffff !important;
    border-bottom: 0.5px solid rgba(0, 0, 0, 0.06) !important;
}
#wechatAppUI .chat-list .chat-item:active {
    background-color: #ededed !important;
}
#wechatAppUI .chat-list .chat-item .avatar {
    width: 48px !important;
    height: 48px !important;
    border-radius: 6px !important;
    margin-right: 12px !important;
    background-color: #dfdfdf !important;
}
#wechatAppUI .chat-name-row .name { font-size: 16px !important; font-weight: 500 !important; color: var(--wc-text-main) !important; }
#wechatAppUI .chat-name-row .time { font-size: 12px !important; color: var(--wc-text-tip) !important; }
#wechatAppUI .chat-msg-row .msg { font-size: 13.5px !important; color: var(--wc-text-sub) !important; }

/* ---------------- 3. 通讯录页面 (Contacts / 46px 紧凑级排版与消除偏移) ---------------- */
#wechatAppUI #page-contacts {
    background-color: var(--wc-bg) !important;
    padding-bottom: 70px !important;
    position: relative !important;
}

#wechatAppUI #page-contacts .list-header {
    background-color: var(--wc-header-dark) !important;
    padding: 45px 16px 12px 16px !important;
    position: relative !important;
    height: 44px !important;
    box-sizing: content-box !important;
    display: flex !important;
    align-items: center !important;
    justify-content: space-between !important;
}

/* 左上角五角星 */
#wechatAppUI #page-contacts .list-header .title {
    width: 24px !important;
    height: 24px !important;
    font-size: 0 !important;
    color: transparent !important;
    cursor: pointer !important;
    background: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 48 48'%3E%3Cpath stroke='%23ffffff' stroke-linejoin='round' stroke-width='3.5' d='M44.9994 19.4993H28.8747l-4.875 -14.99979 -4.8749 14.99979H3l13.1248 8.9999 -5.0624 14.9998 12.9373 -9.3749L36.937 43.499l-5.0624 -14.9998 13.1248 -8.9999Z'/%3E%3C/svg%3E") center/contain no-repeat !important;
    z-index: 10 !important;
}

#wechatAppUI #page-contacts .list-header::after {
    content: '通讯录' !important;
    position: absolute !important;
    left: 50% !important;
    top: 50px !important;
    transform: translateX(-50%) !important;
    font-size: 17px !important;
    font-weight: 600 !important;
    color: #ffffff !important;
    pointer-events: none !important;
}

/* 隐藏冗余状态栏与输入框 */
#wechatAppUI #page-contacts .search-container,
#wechatAppUI #page-contacts .wc-status-hint {
    display: none !important;
}

/* 通讯录右上角专属加号按键 */
#wechatAppUI #page-contacts .wc-top-tabs {
    position: absolute !important;
    top: 50px !important;
    right: 16px !important;
    padding: 0 !important;
    margin: 0 !important;
    border: none !important;
    background: transparent !important;
    z-index: 150 !important;
    display: block !important;
    width: 26px !important;
    height: 26px !important;
}
#wechatAppUI .wc-add-group-nav-btn {
    width: 26px !important;
    height: 26px !important;
    cursor: pointer !important;
}
#wechatAppUI .wc-add-group-nav-btn svg {
    width: 100% !important;
    height: 100% !important;
}

/* 通讯录顶部 4 个快捷入口 (高度压缩至 48px) */
#wechatAppUI .wc-contact-shortcuts {
    background-color: #ffffff !important;
    border-bottom: 0.5px solid rgba(0, 0, 0, 0.08) !important;
    margin-bottom: 0 !important;
}
#wechatAppUI .wc-shortcut-item {
    display: flex !important;
    align-items: center !important;
    height: 48px !important;
    padding: 0 16px !important;
    border-bottom: 0.5px solid rgba(0, 0, 0, 0.05) !important;
    box-sizing: border-box !important;
    cursor: pointer !important;
}
#wechatAppUI .wc-shortcut-item:last-child {
    border-bottom: none !important;
}
#wechatAppUI .wc-shortcut-icon {
    width: 34px !important;
    height: 34px !important;
    border-radius: 4px !important;
    margin-right: 12px !important;
    display: flex !important;
    align-items: center !important;
    justify-content: center !important;
    flex-shrink: 0 !important;
}
#wechatAppUI .wc-shortcut-icon.orange { background-color: #fa9d3b !important; }
#wechatAppUI .wc-shortcut-icon.green { background-color: #07c160 !important; }
#wechatAppUI .wc-shortcut-icon.blue { background-color: #2782d7 !important; }
#wechatAppUI .wc-shortcut-icon.lightblue { background-color: #10aeff !important; }
#wechatAppUI .wc-shortcut-icon svg { width: 22px !important; height: 22px !important; }

/* 服务号 SVG 图标 */
#wechatAppUI .wc-shortcut-icon.lightblue svg {
    width: 28px !important;
    height: 28px !important;
}
#wechatAppUI .wc-shortcut-name {
    font-size: 15.5px !important;
    font-weight: 500 !important;
    color: var(--wc-text-main) !important;
    line-height: 1 !important;
}

/* 原生微信通讯录分段标题栏 (如 ☆星标, B, F, G...) */
#wechatAppUI .wc-contact-group-header {
    background-color: var(--wc-bg) !important;
    color: var(--wc-text-sub) !important;
    font-size: 11.5px !important;
    font-weight: 700 !important;
    height: 22px !important;
    line-height: 22px !important;
    padding: 0 16px !important;
    box-sizing: border-box !important;
    text-transform: uppercase !important;
    border-top: 0.5px solid rgba(0, 0, 0, 0.04) !important;
    border-bottom: 0.5px solid rgba(0, 0, 0, 0.04) !important;
}

/* 将 Member 分组名转化为 ☆星标 */
#wechatAppUI .wc-contact-group-header[data-group-name="Member"],
#wechatAppUI .wc-contact-group-header[data-group-name="g_member"] {
    font-size: 0 !important;
}
#wechatAppUI .wc-contact-group-header[data-group-name="Member"]::after,
#wechatAppUI .wc-contact-group-header[data-group-name="g_member"]::after {
    content: '☆星标' !important;
    font-size: 11.5px !important;
    font-weight: 700 !important;
    color: var(--wc-text-sub) !important;
    line-height: 22px !important;
}

#wechatAppUI .wc-contact-group-list {
    background-color: #ffffff !important;
}

/* 仅对通讯录生效 46px 紧凑行高，杜绝影响微信聊天列表 */
#wechatAppUI #page-contacts .wc-swipe-wrapper {
    background-color: #ffffff !important;
    height: 46px !important;
    min-height: 46px !important;
    max-height: 46px !important;
    box-sizing: border-box !important;
}

/* 微信主页聊天列表容器自适应高度，彻底解决好友重叠 */
#wechatAppUI #page-chat-list .wc-swipe-wrapper {
    background-color: #ffffff !important;
    height: auto !important;
    min-height: 72px !important;
    max-height: none !important;
    box-sizing: border-box !important;
}

#wechatAppUI .wc-character-card {
    background-color: #ffffff !important;
    height: 46px !important;
    min-height: 46px !important;
    max-height: 46px !important;
    padding: 0 0 0 16px !important;
    margin: 0 !important;
    display: flex !important;
    flex-direction: row !important;
    align-items: center !important;
    border: none !important;
    box-sizing: border-box !important;
}

#wechatAppUI .wc-character-card:active {
    background-color: #ededed !important;
}

#wechatAppUI .wc-character-card .avatar {
    width: 34px !important;
    height: 34px !important;
    min-width: 34px !important;
    min-height: 34px !important;
    border-radius: 4px !important;
    margin: 0 12px 0 0 !important;
    padding: 0 !important;
    flex-shrink: 0 !important;
    display: flex !important;
    align-items: center !important;
    justify-content: center !important;
}

#wechatAppUI .wc-character-card .info-wrapper {
    display: flex !important;
    flex-direction: row !important;
    align-items: center !important;
    justify-content: flex-start !important;
    flex: 1 !important;
    height: 100% !important;
    min-width: 0 !important;
    margin: 0 !important;
    padding: 0 16px 0 0 !important;
    border-bottom: 0.5px solid rgba(0, 0, 0, 0.06) !important;
    box-sizing: border-box !important;
}

#wechatAppUI .wc-contact-group-list .wc-swipe-wrapper:last-child .info-wrapper {
    border-bottom: none !important;
}

#wechatAppUI .wc-character-card .name {
    display: flex !important;
    align-items: center !important;
    height: 100% !important;
    font-size: 15.5px !important;
    font-weight: 500 !important;
    line-height: normal !important;
    margin: 0 !important;
    padding: 0 !important;
    color: var(--wc-text-main) !important;
    text-align: left !important;
    white-space: nowrap !important;
    overflow: hidden !important;
    text-overflow: ellipsis !important;
}
#wechatAppUI .wc-character-card .desc {
    display: none !important;
}

/* 右侧悬浮 ABCD 索引条 */
#wechatAppUI #page-contacts::after {
    content: "↑\\a ☆\\a A\\a B\\a C\\a D\\a E\\a F\\a G\\a H\\a I\\a J\\a K\\a L\\a M\\a N\\a O\\a P\\a Q\\a R\\a S\\a T\\a U\\a V\\a W\\a X\\a Y\\a Z\\a #" !important;
    position: absolute !important;
    right: 2px !important;
    top: 130px !important;
    bottom: 80px !important;
    width: 16px !important;
    font-size: 9px !important;
    color: #555555 !important;
    font-family: -apple-system, BlinkMacSystemFont, sans-serif !important;
    font-weight: 600 !important;
    line-height: 1.25 !important;
    white-space: pre-line !important;
    text-align: center !important;
    pointer-events: none !important;
    z-index: 100 !important;
}

/* ---------------- 4. 朋友圈页面 (Moments / 纯净 SVG) ---------------- */
#wechatAppUI #page-moments {
    background-color: #ffffff !important;
    padding-bottom: 70px !important;
    position: relative !important;
}

#wechatAppUI #page-moments::before {
    content: '朋友圈' !important;
    position: absolute !important;
    top: 52px !important;
    left: 50% !important;
    transform: translateX(-50%) !important;
    font-size: 17px !important;
    font-weight: 600 !important;
    color: #ffffff !important;
    z-index: 120 !important;
    pointer-events: none !important;
}

#wechatAppUI #page-moments .profile-section {
    background-color: transparent !important;
    padding-bottom: 30px !important;
    margin-bottom: 0 !important;
    position: relative !important;
}

#wechatAppUI #page-moments .cover-photo {
    height: 280px !important;
    background-color: #2c2c2e !important;
    position: relative !important;
}

#wechatAppUI #page-moments .profile-top-row {
    position: relative !important;
    height: 0 !important;
    padding: 0 !important;
}

#wechatAppUI #page-moments .profile-actions {
    position: absolute !important;
    top: -235px !important;
    left: 16px !important;
    right: 16px !important;
    width: calc(100% - 32px) !important;
    display: flex !important;
    justify-content: space-between !important;
    z-index: 150 !important;
}

/* 左上角返回 < */
#wechatAppUI #page-moments .btn.btn-edit {
    width: 24px !important;
    height: 24px !important;
    border-radius: 0 !important;
    background: transparent url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%23ffffff' stroke-width='2.6' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='15 18 9 12 15 6'%3E%3C/polyline%3E%3C/svg%3E") center/contain no-repeat !important;
    border: none !important;
    font-size: 0 !important;
    color: transparent !important;
    padding: 0 !important;
    cursor: pointer !important;
    backdrop-filter: none !important;
    -webkit-backdrop-filter: none !important;
    filter: drop-shadow(0 1px 3px rgba(0, 0, 0, 0.7)) !important;
}

/* 右上角相机 */
#wechatAppUI #page-moments .btn.btn-follow {
    width: 26px !important;
    height: 26px !important;
    border-radius: 0 !important;
    background: transparent url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%23ffffff' stroke-width='2.2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z'/%3E%3Ccircle cx='12' cy='13' r='4'/%3E%3C/svg%3E") center/contain no-repeat !important;
    border: none !important;
    font-size: 0 !important;
    color: transparent !important;
    padding: 0 !important;
    cursor: pointer !important;
    backdrop-filter: none !important;
    -webkit-backdrop-filter: none !important;
    filter: drop-shadow(0 1px 3px rgba(0, 0, 0, 0.7)) !important;
}

#wechatAppUI #page-moments .profile-avatar-wrapper {
    position: absolute !important;
    right: 16px !important;
    bottom: -32px !important;
    top: auto !important;
    left: auto !important;
    width: 72px !important;
    height: 72px !important;
    border-radius: 8px !important;
    background: #ffffff !important;
    padding: 2px !important;
    box-shadow: 0 1px 4px rgba(0,0,0,0.1) !important;
    z-index: 20 !important;
}
#wechatAppUI #page-moments .profile-avatar-inner { border-radius: 6px !important; border: none !important; }
#wechatAppUI #page-moments .profile-avatar-badge { display: none !important; }

#wechatAppUI #page-moments .profile-info {
    position: absolute !important;
    right: 98px !important;
    top: 240px !important;
    padding: 0 !important;
    text-align: right !important;
    z-index: 10 !important;
}
#wechatAppUI #page-moments .profile-name {
    font-size: 18px !important;
    font-weight: 700 !important;
    color: #ffffff !important;
    text-shadow: 0 1px 4px rgba(0, 0, 0, 0.8) !important;
}
#wechatAppUI #page-moments .profile-handle,
#wechatAppUI #page-moments .profile-bio { display: none !important; }

#wechatAppUI #page-moments .feed-list { background-color: #ffffff !important; }
#wechatAppUI #page-moments .post { padding: 16px !important; border-bottom: 0.5px solid rgba(0, 0, 0, 0.06) !important; }
#wechatAppUI #page-moments .post-avatar { width: 42px !important; height: 42px !important; border-radius: 4px !important; margin-right: 10px !important; }
#wechatAppUI #page-moments .post-name { color: var(--wc-text-blue) !important; font-size: 15px !important; font-weight: 600 !important; }
#wechatAppUI #page-moments .post-text { font-size: 15px !important; color: var(--wc-text-main) !important; line-height: 1.5 !important; }
#wechatAppUI #page-moments .interaction-area { background-color: #f7f7f7 !important; border-radius: 4px !important; padding: 6px 10px !important; margin-top: 8px !important; }
#wechatAppUI #page-moments .interaction-area::before { border-bottom-color: #f7f7f7 !important; }
#wechatAppUI #page-moments .likes,
#wechatAppUI #page-moments .comment-name { color: var(--wc-text-blue) !important; font-size: 13px !important; font-weight: 600 !important; }

/* ---------------- 5. 我的页面 (Profile) ---------------- */
#wechatAppUI #page-profile {
    background-color: var(--wc-bg) !important;
    padding-bottom: 80px !important;
    position: relative !important;
}

#wechatAppUI #page-profile .wc-profile-header {
    background-color: var(--wc-header-dark) !important;
    padding: 45px 16px 12px 16px !important;
    display: flex !important;
    align-items: center !important;
    justify-content: center !important;
    position: relative !important;
}
#wechatAppUI #page-profile .wc-profile-title {
    font-size: 0 !important;
    color: transparent !important;
    display: flex !important;
    align-items: center !important;
    justify-content: center !important;
}
#wechatAppUI #page-profile .wc-profile-title::after {
    content: '我' !important;
    font-size: 18px !important;
    font-weight: 600 !important;
    color: #ffffff !important;
    letter-spacing: 0.5px !important;
}
#wechatAppUI #page-profile .wc-profile-title svg { display: none !important; }

/* 个人信息卡片 */
#wechatAppUI #page-profile .wc-profile-section {
    background-color: var(--wc-card) !important;
    padding: 16px 16px 18px 16px !important;
    margin-top: 10px !important;
    margin-bottom: 10px !important;
    border-top: 0.5px solid rgba(0,0,0,0.06) !important;
    border-bottom: 0.5px solid rgba(0,0,0,0.06) !important;
    position: relative !important;
}
#wechatAppUI #page-profile .wc-profile-main { display: flex !important; align-items: center !important; }
#wechatAppUI #page-profile .wc-avatar-wrapper {
    width: 64px !important;
    height: 64px !important;
    border-radius: 6px !important;
    border: none !important;
    padding: 0 !important;
    margin-right: 14px !important;
    background-color: #dfdfdf !important;
    overflow: hidden !important;
}
#wechatAppUI #page-profile .wc-avatar-inner { border-radius: 6px !important; }
#wechatAppUI #page-profile .wc-profile-info-wrap { flex: 1 !important; display: flex !important; flex-direction: column !important; gap: 4px !important; }
#wechatAppUI #page-profile .wc-profile-name { font-size: 18px !important; font-weight: 600 !important; color: var(--wc-text-main) !important; }
#wechatAppUI #page-profile .wc-profile-id { font-size: 13.5px !important; color: var(--wc-text-sub) !important; }
#wechatAppUI #page-profile .wc-profile-qr { display: flex !important; align-items: center !important; gap: 8px !important; color: var(--wc-text-tip) !important; cursor: pointer !important; }
#wechatAppUI #page-profile .wc-profile-qr svg.qr-icon { width: 18px !important; height: 18px !important; fill: #7f7f7f !important; }
#wechatAppUI #page-profile .wc-profile-bio { display: none !important; }

/* 选项列表 */
#wechatAppUI #page-profile .wc-list-group { background-color: transparent !important; padding: 0 !important; margin: 0 !important; }
#wechatAppUI #page-profile .wc-list-item {
    background-color: var(--wc-card) !important;
    padding: 14px 16px !important;
    display: flex !important;
    align-items: center !important;
    cursor: pointer !important;
    border-bottom: 0.5px solid rgba(0, 0, 0, 0.08) !important;
}
#wechatAppUI #page-profile .wc-list-item:active { background-color: #f5f5f5 !important; }
#wechatAppUI #page-profile .wc-item-icon { width: 24px !important; height: 24px !important; margin-right: 14px !important; display: flex !important; align-items: center !important; justify-content: center !important; }
#wechatAppUI #page-profile .wc-item-icon svg { display: none !important; }

/* 1. 钱包 */
#wechatAppUI #page-profile .wc-list-item:nth-child(1) {
    margin-bottom: 10px !important;
    border-top: 0.5px solid rgba(0,0,0,0.06) !important;
    border-bottom: 0.5px solid rgba(0,0,0,0.06) !important;
}
#wechatAppUI #page-profile .wc-list-item:nth-child(1) .wc-item-icon {
    width: 28px !important;
    height: 28px !important;
    background: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 1024 1024'%3E%3Cpath d='M924.810419 346.719676l0-125.891222c0-19.968797-16.104793-35.96819-35.985586-35.96819L97.545128 184.860265c-19.880793 0-35.985586 16.104793-35.985586 35.96819l0 575.501266c0 19.96982 16.104793 35.96819 35.985586 35.96819l791.279704 0c19.880793 0 35.985586-16.104793 35.985586-35.96819L924.810419 634.471332 583.19397 634.471332c-19.916609 0-36.055171-16.08842-36.055171-35.863812l0-216.024032c0-19.810185 16.138562-35.862789 36.055171-35.862789L924.810419 346.720699zM601.091596 436.642708c0-19.863397 16.156982-35.969213 35.809577-35.969213l288.066835 0c19.776416 0 35.811624 15.9646 35.811624 35.969213L960.779631 544.549324c0 19.862373-16.159028 35.967166-35.811624 35.967166L636.901173 580.51649c-19.776416 0-35.809577-15.9646-35.809577-35.967166L601.091596 436.642708zM691.012581 526.564717c19.86442 0 35.969213-16.104793 35.969213-35.969213 0-19.863397-16.104793-35.96819-35.969213-35.96819s-35.969213 16.104793-35.969213 35.96819C655.043369 510.458901 671.148162 526.564717 691.012581 526.564717z' fill='%23199be8'/%3E%3C/svg%3E") center/contain no-repeat !important;
}
#wechatAppUI #page-profile .wc-list-item:nth-child(1) .wc-item-text { font-size: 0 !important; }
#wechatAppUI #page-profile .wc-list-item:nth-child(1) .wc-item-text::after { content: '钱包' !important; font-size: 16px !important; color: var(--wc-text-main) !important; }

/* 2. 收藏 */
#wechatAppUI #page-profile .wc-list-item:nth-child(2) { border-top: 0.5px solid rgba(0,0,0,0.06) !important; }
#wechatAppUI #page-profile .wc-list-item:nth-child(2) .wc-item-icon {
    background: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 1024 1024'%3E%3Cpath d='M57.6 307.2v469.213l409.6 234.15v-463.65L57.6 307.2z' fill='%23ff9800'/%3E%3Cpath d='M531.2 550.138v463.793L953.842 780.8V293.81L531.2 550.139z' fill='%23f44336'/%3E%3Cpath d='M57.6 243.2l448 268.8 448.553-269.34L505.6 5.302 57.6 243.2z' fill='%232196f3'/%3E%3C/svg%3E") center/contain no-repeat !important;
}

/* 3. 表情 */
#wechatAppUI #page-profile .wc-list-item:nth-child(3) {
    margin-bottom: 10px !important;
    border-bottom: 0.5px solid rgba(0,0,0,0.06) !important;
}
#wechatAppUI #page-profile .wc-list-item:nth-child(3) .wc-item-icon {
    background: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 1024 1024'%3E%3Ccircle cx='512' cy='512' r='480' fill='%23ffc300'/%3E%3Ccircle cx='350.2' cy='370.7' r='75' fill='%23ffffff'/%3E%3Ccircle cx='696.3' cy='370.7' r='75' fill='%23ffffff'/%3E%3Cpath d='M522.24 864.256c-178.176 0-323.584-139.264-323.584-311.296v-30.72h645.12V552.96c2.048 172.032-143.36 311.296-321.536 311.296z' fill='%23ffffff'/%3E%3Cpath d='M262.144 585.728c16.384 122.88 126.976 219.136 260.096 219.136s243.712-96.256 260.096-219.136H262.144z' fill='%23ffffff'/%3E%3C/svg%3E") center/contain no-repeat !important;
}

/* 4. 设置 */
#wechatAppUI #page-profile .wc-list-item:nth-child(4) {
    border-top: 0.5px solid rgba(0,0,0,0.06) !important;
    border-bottom: 0.5px solid rgba(0,0,0,0.06) !important;
}
#wechatAppUI #page-profile .wc-list-item:nth-child(4) .wc-item-icon {
    background: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 1024 1024'%3E%3Cpath d='M1014.601956 658.682311c1.683911 8.419556 0 20.252444-1.683912 32.039822-1.661156 11.810133-6.712889 25.281422-11.764622 36.522667-5.006222 13.494044-11.741867 23.620267-18.477511 33.723733a62.805333 62.805333 0 0 1-25.1904 21.9136 45.806933 45.806933 0 0 1-23.506489 6.7584c-6.735644 0-13.425778-1.683911-21.845333-5.074489-6.712889-1.683911-16.7936-5.051733-26.874311-6.735644-11.764622-1.683911-21.845333-1.683911-33.609956-1.683911-11.741867 1.683911-23.506489 3.367822-33.5872 6.7584-11.764622 3.367822-21.845333 10.103467-30.242133 18.523022-18.477511 18.545778-28.558222 38.229333-31.903289 61.826845-3.367822 23.620267 0 44.964978 8.3968 66.901333 6.712889 15.1552 5.028978 28.649244-3.367822 43.258311a136.533333 136.533333 0 0 1-21.845334 18.545778 190.919111 190.919111 0 0 1-31.903288 16.839111c-11.764622 5.074489-23.529244 8.442311-35.271112 11.832889C660.138667 1024 648.3968 1024 638.293333 1024c-6.712889 0-13.425778-3.367822-18.477511-8.419556-5.028978-5.074489-10.080711-10.126222-11.764622-16.884622h1.683911c-8.3968-23.597511-21.845333-41.5744-39.753955-58.436266-18.477511-16.861867-41.415111-25.304178-66.628267-25.304178-25.1904 0-46.466844 6.7584-66.628267 23.620266-20.161422 16.839111-35.271111 35.407644-43.121778 56.752356-3.367822 8.419556-10.080711 15.177956-16.7936 18.545778a53.475556 53.475556 0 0 1-23.529244 5.074489 99.214222 99.214222 0 0 1-35.271111-6.7584c-13.425778-3.367822-25.1904-8.419556-38.070045-15.177956-13.425778-5.051733-23.529244-11.787378-33.609955-20.229689a100.397511 100.397511 0 0 1-23.506489-21.9136 34.087822 34.087822 0 0 1-5.051733-18.545778c0-6.7584 3.367822-16.861867 8.419555-28.672 8.374044-16.839111 11.741867-35.407644 10.057956-56.752355-1.661156-21.9136-10.080711-41.597156-26.851556-60.142933a64.944356 64.944356 0 0 0-36.408889-21.9136 189.144178 189.144178 0 0 0-41.437866-5.051734c-15.132444 0-31.926044 3.367822-46.4896 8.419556-10.057956 3.367822-20.138667 1.683911-30.219378-3.367822-8.419556-3.367822-15.132444-10.103467-21.845333-20.252445a174.421333 174.421333 0 0 1-18.477512-35.384889c-5.051733-13.494044-8.419556-26.988089-11.764622-39.913244-3.345067-13.471289-3.345067-25.281422-1.661155-33.723734 1.661156-16.839111 10.057956-26.965333 21.845333-30.333155 21.822578-8.419556 41.415111-21.936356 59.892622-41.597156 18.477511-20.252444 26.874311-41.597156 26.874311-66.901333 0-25.258667-8.3968-48.310044-25.1904-66.855822s-36.408889-33.723733-58.254222-41.597156c-6.690133-1.683911-11.741867-6.735644-16.7936-16.839111a47.763911 47.763911 0 0 1-6.712889-25.304178c0-10.126222 1.683911-20.252444 5.051734-32.039822 3.345067-11.810133 6.712889-23.597511 11.764622-33.723733 5.028978-10.103467 10.057956-20.229689 16.7936-30.333156 6.712889-8.419556 13.425778-15.177956 20.161422-20.252444 6.712889-3.367822 11.741867-5.051733 16.7936-3.367822 5.028978 0 11.741867 1.683911 18.477511 5.051733a157.013333 157.013333 0 0 0 68.312178 10.126222c23.506489-3.367822 44.782933-13.494044 63.260444-30.355911 8.419556-8.419556 15.132444-20.229689 20.161423-32.017067 5.051733-13.494044 6.735644-25.304178 8.419555-38.229333a113.618489 113.618489 0 0 0 0-33.723733c-1.706667-10.103467-1.706667-18.545778-1.706667-21.9136-1.661156-5.051733-3.345067-10.126222-3.345066-15.177956a21.208178 21.208178 0 0 1 1.683911-15.177955c5.028978-10.103467 11.764622-18.545778 23.506489-26.965334 11.764622-6.7584 23.529244-13.494044 36.408889-18.545778A192.7168 192.7168 0 0 1 346.567111 3.367822C358.354489 1.683911 368.4352 0 376.832 0c10.080711 0 16.7936 3.367822 21.845333 10.103467 5.006222 6.7584 8.3968 13.494044 11.741867 20.252444 8.419556 20.229689 20.161422 36.522667 38.070044 53.384533 18.477511 15.177956 39.776711 23.597511 63.2832 23.597512 25.1904 0 48.150756-6.735644 68.312178-20.229689 20.161422-13.494044 33.5872-32.039822 41.437867-53.384534 3.367822-5.051733 8.419556-11.810133 13.425778-18.545777 10.103467-10.126222 15.132444-13.494044 21.845333-13.494045 10.080711 0 21.845333 1.683911 33.609956 5.051733 11.741867 3.367822 23.506489 6.7584 35.271111 13.494045 11.764622 5.051733 21.845333 11.810133 31.903289 20.252444 10.103467 8.419556 16.816356 16.839111 23.529244 26.965334 3.367822 6.735644 5.028978 11.787378 3.367822 18.545777a78.506667 78.506667 0 0 1-5.051733 15.177956c-10.080711 21.9136-13.425778 43.258311-10.080711 66.878578 3.367822 23.597511 13.425778 43.258311 30.264889 61.804089 16.770844 18.545778 38.047289 28.672 63.260444 30.355911 25.1904 1.683911 49.834667-1.683911 71.68-11.810134 5.006222-3.367822 13.425778-5.051733 21.822578-3.367822 8.419556 1.683911 15.109689 5.074489 21.845333 10.126222 10.080711 10.126222 20.161422 26.988089 28.558222 46.648889 8.3968 21.9136 13.425778 41.597156 16.7936 63.488 1.683911 11.832889-1.683911 21.936356-6.735644 28.672-5.006222 6.7584-11.741867 11.810133-16.7936 13.494045-23.506489 8.419556-41.415111 21.9136-58.231467 41.597155-16.7936 20.229689-25.1904 41.5744-25.1904 68.562489 0 25.281422 6.712889 46.648889 18.477511 65.194667 13.425778 18.545778 30.242133 32.039822 51.518578 39.890489 5.028978 3.390578 10.080711 6.7584 13.425778 8.419555 6.144 9.0112 11.195733 17.453511 14.563556 27.556978z m-509.474134 89.929956c33.655467 0 63.374222-5.051733 93.661867-16.884623 30.264889-11.810133 54.954667-28.672 76.822755-50.062222 21.868089-21.936356 39.822222-46.671644 51.586845-75.3664a216.951467 216.951467 0 0 0 20.184178-92.251022c0-33.769244-5.051733-63.579022-16.839111-92.273778a242.938311 242.938311 0 0 0-49.880178-77.050311c-21.868089-21.936356-46.557867-39.936-75.1616-51.768889a215.108267 215.108267 0 0 0-91.9552-20.252444c-33.655467 0-63.374222 5.074489-93.661867 16.884622a242.005333 242.005333 0 0 0-76.822755 50.062222c-21.845333 21.936356-39.822222 46.6944-51.586845 75.389156-11.764622 26.988089-18.500267 56.797867-20.184178 90.567111 0 33.746489 5.051733 63.556267 16.839111 92.251022a242.983822 242.983822 0 0 0 49.902934 77.073067c21.845333 21.936356 46.535111 39.936 75.138844 53.430044a211.512889 211.512889 0 0 0 91.9552 20.252445z' fill='%2330A1DC'/%3E%3C/svg%3E") center/contain no-repeat !important;
}

/* 5. 切换账号：隐形绑定至右上角二维码 */
#wechatAppUI #page-profile .wc-list-item:nth-child(5) {
    position: absolute !important;
    top: 75px !important;
    right: 16px !important;
    width: 60px !important;
    height: 50px !important;
    background: transparent !important;
    border: none !important;
    margin: 0 !important;
    padding: 0 !important;
    opacity: 0 !important;
    z-index: 50 !important;
    cursor: pointer !important;
}

#wechatAppUI #page-profile .wc-item-text {
    font-size: 16px !important;
    color: var(--wc-text-main) !important;
    font-weight: 400 !important;
}

#wechatAppUI #page-profile .wc-chevron-right {
    width: 8px !important;
    height: 13px !important;
    stroke: var(--wc-text-tip) !important;
    stroke-width: 2.2 !important;
    stroke-linecap: round !important;
    stroke-linejoin: round !important;
    fill: none !important;
}

/* ---------------- 6. 微信登录与注册页面美化 (方案4: 经典灰底白卡片) ---------------- */
#wechatAppUI :is(#page-wc-login, #page-wc-register) {
    background-color: var(--wc-bg) !important;
    color: var(--wc-text-main) !important;
}

#wechatAppUI :is(#page-wc-login, #page-wc-register) .wc-auth-nav-bar {
    background-color: transparent !important;
    border: none !important;
    height: 44px !important;
    margin-top: max(35px, env(safe-area-inset-top)) !important;
    padding: 0 16px !important;
    display: flex !important;
    align-items: center !important;
}

#wechatAppUI :is(#page-wc-login, #page-wc-register) .wc-auth-nav-back {
    display: flex !important;
    align-items: center !important;
    font-size: 0 !important;
    color: transparent !important;
    cursor: pointer !important;
    width: 32px !important;
    height: 32px !important;
}

#wechatAppUI :is(#page-wc-login, #page-wc-register) .wc-auth-nav-back svg {
    display: none !important;
}

#wechatAppUI :is(#page-wc-login, #page-wc-register) .wc-auth-nav-back::after {
    content: '' !important;
    display: block !important;
    width: 22px !important;
    height: 22px !important;
    background: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%23191919' stroke-width='2.4' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='15 18 9 12 15 6'%3E%3C/polyline%3E%3C/svg%3E") center/contain no-repeat !important;
}

#wechatAppUI :is(#page-wc-login, #page-wc-register) .wc-auth-content {
    padding: 10px 24px 30px !important;
    display: flex !important;
    flex-direction: column !important;
    align-items: center !important;
}

/* 微信 Logo：模仿微信桌面图标样式 (绿色背景 + 白色气泡 + 微边框) */
#wechatAppUI #page-wc-login .wc-auth-logo-container {
    margin: 10px auto 16px auto !important;
}

#wechatAppUI #page-wc-login .wc-auth-logo-icon {
    width: 76px !important;
    height: 76px !important;
    background-color: var(--wc-green) !important;
    border: 1px solid rgba(0, 0, 0, 0.08) !important;
    border-radius: 18px !important;
    box-shadow: 0 4px 16px rgba(7, 193, 96, 0.25) !important;
    display: flex !important;
    align-items: center !important;
    justify-content: center !important;
    position: relative !important;
}

#wechatAppUI #page-wc-login .wc-auth-logo-icon svg {
    display: none !important;
}

#wechatAppUI #page-wc-login .wc-auth-logo-icon::after {
    content: '' !important;
    display: block !important;
    width: 52px !important;
    height: 52px !important;
    background-color: #ffffff !important;
    -webkit-mask: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 1024 1024'%3E%3Cpath d='M664.250054 368.541681c10.015098 0 19.892049 0.732687 29.67281 1.795902-26.647917-122.810047-159.358451-214.077703-310.826188-214.077703-169.353083 0-308.085774 114.232694-308.085774 259.274068 0 83.708494 46.165436 152.460344 123.281791 205.78483l-30.80868 91.730191 107.688651-53.455469c38.558178 7.53665 69.459978 15.308661 107.924012 15.308661 9.66308 0 19.230993-0.470721 28.752858-1.225921-6.025227-20.36584-9.521864-41.723264-9.521864-63.862493C402.328693 476.632491 517.908058 368.541681 664.250054 368.541681zM498.62897 285.87389c23.200398 0 38.557154 15.120372 38.557154 38.061874 0 22.846334-15.356756 38.156018-38.557154 38.156018-23.107277 0-46.260603-15.309684-46.260603-38.156018C452.368366 300.994262 475.522716 285.87389 498.62897 285.87389zM283.016307 362.090758c-23.107277 0-46.402843-15.309684-46.402843-38.156018 0-22.941502 23.295566-38.061874 46.402843-38.061874 23.081695 0 38.46301 15.120372 38.46301 38.061874C321.479317 346.782098 306.098002 362.090758 283.016307 362.090758zM945.448458 606.151333c0-121.888048-123.258255-221.236753-261.683954-221.236753-146.57838 0-262.015505 99.348706-262.015505 221.236753 0 122.06508 115.437126 221.200938 262.015505 221.200938 30.66644 0 61.617359-7.609305 92.423993-15.262612l84.513836 45.786813-23.178909-76.17082C899.379213 735.776599 945.448458 674.90216 945.448458 606.151333zM598.803483 567.994292c-15.332197 0-30.807656-15.096836-30.807656-30.501688 0-15.190981 15.47546-30.477129 30.807656-30.477129 23.295566 0 38.558178 15.286148 38.558178 30.477129C637.361661 552.897456 622.099049 567.994292 598.803483 567.994292zM768.25071 567.994292c-15.213493 0-30.594809-15.096836-30.594809-30.501688 0-15.190981 15.381315-30.477129 30.594809-30.477129 23.107277 0 38.558178 15.286148 38.558178 30.477129C806.808888 552.897456 791.357987 567.994292 768.25071 567.994292z'/%3E%3C/svg%3E") center/contain no-repeat !important;
}

/* 注册头像选择：还原图1浅色调与圆角细框 */
#wechatAppUI #page-wc-register .wc-auth-avatar-upload-container {
    margin: 10px auto 20px auto !important;
}

#wechatAppUI #page-wc-register .wc-auth-avatar-upload {
    width: 80px !important;
    height: 80px !important;
    border-radius: 18px !important;
    background-color: #f7f7f7 !important;
    border: 1px solid rgba(0, 0, 0, 0.05) !important;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.02) !important;
    display: flex !important;
    align-items: center !important;
    justify-content: center !important;
    position: relative !important;
}

#wechatAppUI #page-wc-register .wc-auth-avatar-upload .wc-auth-cam-icon {
    display: none !important;
}

#wechatAppUI #page-wc-register .wc-auth-avatar-upload::after {
    content: '' !important;
    display: block !important;
    width: 48px !important;
    height: 48px !important;
    background-color: #c4c4c6 !important;
    -webkit-mask: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 1025 1024'%3E%3Cpath d='M657.6 580.8c57.6-67.2 118.4-160 118.4-257.6C776 144 657.6 0 512 0c-144 0-264 144-264 323.2 0 99.2 36.8 164.8 112 256C483.2 760 81.6 774.4 20.8 902.4 3.2 940.8 0 971.2 0 1004.8c0 4.8 0 9.6 1.6 12.8 1.6 4.8 6.4 6.4 9.6 6.4h1001.6c3.2 0 6.4-1.6 9.6-6.4 1.6-3.2 1.6-8 1.6-12.8 0-38.4-4.8-73.6-14.4-94.4-64-134.4-528-123.2-352-329.6z'/%3E%3C/svg%3E") center/contain no-repeat !important;
}

#wechatAppUI #page-wc-register .wc-auth-avatar-badge {
    display: none !important;
}

/* 标题与副标题 */
#wechatAppUI :is(#page-wc-login, #page-wc-register) .wc-auth-header-title {
    font-size: 20px !important;
    font-weight: 600 !important;
    color: var(--wc-text-main) !important;
    text-align: center !important;
    margin-bottom: 6px !important;
}

#wechatAppUI :is(#page-wc-login, #page-wc-register) .wc-auth-header-subtitle {
    font-size: 13.5px !important;
    color: var(--wc-text-sub) !important;
    text-align: center !important;
    margin-bottom: 26px !important;
}

/* 输入表单连体白卡片 */
#wechatAppUI :is(#page-wc-login, #page-wc-register) .wc-auth-form-group {
    width: 100% !important;
    margin-bottom: 0 !important;
}

#wechatAppUI :is(#page-wc-login, #page-wc-register) .wc-auth-form-input-wrapper {
    background-color: #ffffff !important;
    border: none !important;
    border-left: 1px solid rgba(0, 0, 0, 0.1) !important;
    border-right: 1px solid rgba(0, 0, 0, 0.1) !important;
    border-radius: 0 !important;
    height: 56px !important;
    padding: 0 18px !important;
    display: flex !important;
    align-items: center !important;
    position: relative !important;
    border-bottom: 0.5px solid rgba(0, 0, 0, 0.08) !important;
}

/* 第一个输入框：左上角、右上角大圆角，增加顶部外边框 */
#wechatAppUI :is(#page-wc-login, #page-wc-register) .wc-auth-form-group:not(.wc-auth-form-group + .wc-auth-form-group) .wc-auth-form-input-wrapper {
    border-top-left-radius: 16px !important;
    border-top-right-radius: 16px !important;
    border-top: 1px solid rgba(0, 0, 0, 0.1) !important;
}

/* 最后一个输入框：左下角、右下角大圆角，封闭底部外边框 */
#wechatAppUI #page-wc-login .wc-auth-form-group + .wc-auth-form-group .wc-auth-form-input-wrapper,
#wechatAppUI #page-wc-register .wc-auth-form-group + .wc-auth-form-group + .wc-auth-form-group .wc-auth-form-input-wrapper,
#wechatAppUI :is(#page-wc-login, #page-wc-register) .wc-auth-form-group:not(:has(+ .wc-auth-form-group)) .wc-auth-form-input-wrapper {
    border-bottom-left-radius: 16px !important;
    border-bottom-right-radius: 16px !important;
    border-bottom: 1px solid rgba(0, 0, 0, 0.1) !important;
    margin-bottom: 28px !important;
}

#wechatAppUI :is(#page-wc-login, #page-wc-register) .wc-auth-form-input-wrapper > svg:first-child {
    display: none !important;
}

#wechatAppUI :is(#page-wc-login, #page-wc-register) .wc-auth-form-input {
    flex: 1 !important;
    border: none !important;
    outline: none !important;
    background: transparent !important;
    font-size: 16px !important;
    color: var(--wc-text-main) !important;
    padding: 0 !important;
}

#wechatAppUI :is(#page-wc-login, #page-wc-register) .wc-auth-form-input::placeholder {
    color: transparent !important;
}

/* --- 图3：登录输入框文本排版 (左侧: 账号/密码) --- */
#wechatAppUI #page-wc-login .wc-auth-form-group:not(.wc-auth-form-group + .wc-auth-form-group) .wc-auth-form-input-wrapper::before {
    content: '账号' !important;
    width: 78px !important;
    font-size: 16px !important;
    color: #191919 !important;
    font-weight: 400 !important;
    flex-shrink: 0 !important;
}

#wechatAppUI #page-wc-login .wc-auth-form-group + .wc-auth-form-group .wc-auth-form-input-wrapper::before {
    content: '密码' !important;
    width: 78px !important;
    font-size: 16px !important;
    color: #191919 !important;
    font-weight: 400 !important;
    flex-shrink: 0 !important;
}

/* 登录提示文本 */
#wechatAppUI #page-wc-login .wc-auth-form-group:not(.wc-auth-form-group + .wc-auth-form-group) .wc-auth-form-input-wrapper:has(input:placeholder-shown)::after {
    content: '请填写微信号/手机号' !important;
    position: absolute !important;
    left: 96px !important;
    color: #b2b2b2 !important;
    font-size: 16px !important;
    pointer-events: none !important;
}

#wechatAppUI #page-wc-login .wc-auth-form-group + .wc-auth-form-group .wc-auth-form-input-wrapper:has(input:placeholder-shown)::after {
    content: '请填写密码' !important;
    position: absolute !important;
    left: 96px !important;
    color: #b2b2b2 !important;
    font-size: 16px !important;
    pointer-events: none !important;
}

/* --- 图2：注册输入框文本排版 (左侧: 手机号/密码/确认密码) --- */
#wechatAppUI #page-wc-register .wc-auth-form-group:has(#wc-reg-phone) .wc-auth-form-input-wrapper::before {
    content: '手机号' !important;
    width: 88px !important;
    font-size: 16px !important;
    color: #191919 !important;
    font-weight: 400 !important;
    flex-shrink: 0 !important;
}

#wechatAppUI #page-wc-register .wc-auth-form-group:has(#wc-reg-pwd) .wc-auth-form-input-wrapper::before {
    content: '密码' !important;
    width: 88px !important;
    font-size: 16px !important;
    color: #191919 !important;
    font-weight: 400 !important;
    flex-shrink: 0 !important;
}

#wechatAppUI #page-wc-register .wc-auth-form-group:has(#wc-reg-pwd-confirm) .wc-auth-form-input-wrapper::before {
    content: '确认密码' !important;
    width: 88px !important;
    font-size: 16px !important;
    color: #191919 !important;
    font-weight: 400 !important;
    flex-shrink: 0 !important;
}

/* 图2 对应右侧提示文字：请填写手机号 / 请设置密码 / 请再次输入密码 */
#wechatAppUI #page-wc-register .wc-auth-form-group:has(#wc-reg-phone) .wc-auth-form-input-wrapper:has(input:placeholder-shown)::after {
    content: '请填写手机号' !important;
    position: absolute !important;
    left: 106px !important;
    color: #b2b2b2 !important;
    font-size: 16px !important;
    pointer-events: none !important;
}

#wechatAppUI #page-wc-register .wc-auth-form-group:has(#wc-reg-pwd) .wc-auth-form-input-wrapper:has(input:placeholder-shown)::after {
    content: '请设置密码' !important;
    position: absolute !important;
    left: 106px !important;
    color: #b2b2b2 !important;
    font-size: 16px !important;
    pointer-events: none !important;
}

#wechatAppUI #page-wc-register .wc-auth-form-group:has(#wc-reg-pwd-confirm) .wc-auth-form-input-wrapper:has(input:placeholder-shown)::after {
    content: '请再次输入密码' !important;
    position: absolute !important;
    left: 106px !important;
    color: #b2b2b2 !important;
    font-size: 16px !important;
    pointer-events: none !important;
}

#wechatAppUI :is(#page-wc-login, #page-wc-register) .wc-auth-pwd-toggle {
    cursor: pointer !important;
    padding: 4px !important;
    display: flex !important;
    align-items: center !important;
    justify-content: center !important;
}

#wechatAppUI :is(#page-wc-login, #page-wc-register) .wc-auth-pwd-toggle svg {
    stroke: var(--wc-text-tip) !important;
    width: 20px !important;
    height: 20px !important;
}

/* 微信绿主操作按钮 */
#wechatAppUI :is(#page-wc-login, #page-wc-register) .wc-auth-btn-primary {
    width: 100% !important;
    height: 48px !important;
    background-color: var(--wc-green) !important;
    color: #ffffff !important;
    font-size: 16.5px !important;
    font-weight: 600 !important;
    border: none !important;
    border-radius: 8px !important;
    cursor: pointer !important;
    box-shadow: none !important;
}

#wechatAppUI :is(#page-wc-login, #page-wc-register) .wc-auth-btn-primary:active {
    opacity: 0.8 !important;
}

/* 底部切换链接 */
#wechatAppUI :is(#page-wc-login, #page-wc-register) .wc-auth-switch-link {
    margin-top: 20px !important;
    text-align: center !important;
    font-size: 14px !important;
    color: var(--wc-text-sub) !important;
}

#wechatAppUI :is(#page-wc-login, #page-wc-register) .wc-auth-switch-link span {
    color: var(--wc-green) !important;
    font-weight: 600 !important;
    cursor: pointer !important;
}
`;

    const WC_BUILTIN_PRESET_WECHAT_JS = `/* =========================================================
   微信通讯录全部分组单列平铺 & 极简紧凑排版脚本
   ========================================================= */
(function() {
    // 标签抽屉弹窗：打开抽屉
    window.wcOpenContactTagManageDrawer = function() {
        let overlay = document.getElementById('wcContactTagManageDrawerOverlay');
        if (!overlay) {
            overlay = document.createElement('div');
            overlay.id = 'wcContactTagManageDrawerOverlay';
            overlay.style.cssText = 'position: fixed; inset: 0; background: rgba(0,0,0,0.4); backdrop-filter: blur(4px); -webkit-backdrop-filter: blur(4px); z-index: 1200; display: none; align-items: flex-end; justify-content: center; opacity: 0; transition: opacity 0.25s cubic-bezier(0.25, 0.8, 0.25, 1);';
            overlay.onclick = (e) => { if (e.target === overlay) wcCloseContactTagManageDrawer(); };

            overlay.innerHTML = \`
                <div class="wc-tag-manage-drawer" style="width: 100%; max-width: 500px; background: #ffffff; border-radius: 20px 20px 0 0; box-shadow: 0 -4px 24px rgba(0,0,0,0.12); display: flex; flex-direction: column; max-height: 80vh; transform: translateY(100%); transition: transform 0.28s cubic-bezier(0.25, 0.8, 0.25, 1); overflow: hidden;" onclick="event.stopPropagation()">
                    <div style="display: flex; align-items: center; justify-content: space-between; padding: 16px 20px; border-bottom: 0.5px solid rgba(0,0,0,0.08); flex-shrink: 0;">
                        <span style="font-size: 17px; font-weight: 700; color: #191919;">所有标签分组</span>
                        <div style="display: flex; align-items: center; gap: 12px;">
                            <button type="button" onclick="wcOpenCreateContactGroupDialog(); setTimeout(wcRenderContactTagManageDrawer, 500);" style="border: none; background: rgba(7, 193, 96, 0.12); color: #07c160; font-size: 13px; font-weight: 600; padding: 6px 12px; border-radius: 14px; cursor: pointer;">+ 新建标签</button>
                            <button type="button" onclick="wcCloseContactTagManageDrawer()" style="border: none; background: transparent; font-size: 15px; color: #8e8e93; font-weight: 500; cursor: pointer; padding: 4px;">完成</button>
                        </div>
                    </div>
                    <div id="wcContactTagManageDrawerList" style="padding: 12px 16px calc(16px + env(safe-area-inset-bottom, 12px)) 16px; overflow-y: auto; flex: 1; display: flex; flex-direction: column; gap: 8px;"></div>
                </div>
            \`;
            const appUI = document.getElementById('wechatAppUI') || document.body;
            appUI.appendChild(overlay);
        }

        wcRenderContactTagManageDrawer();
        overlay.style.display = 'flex';
        overlay.offsetHeight;
        overlay.style.opacity = '1';
        const drawer = overlay.querySelector('.wc-tag-manage-drawer');
        if (drawer) drawer.style.transform = 'translateY(0)';
    };

    // 标签抽屉弹窗：关闭抽屉
    window.wcCloseContactTagManageDrawer = function() {
        const overlay = document.getElementById('wcContactTagManageDrawerOverlay');
        if (!overlay) return;
        overlay.style.opacity = '0';
        const drawer = overlay.querySelector('.wc-tag-manage-drawer');
        if (drawer) drawer.style.transform = 'translateY(100%)';
        setTimeout(() => { overlay.style.display = 'none'; }, 280);
    };

    // 标签抽屉弹窗：渲染所有分组列表
    window.wcRenderContactTagManageDrawer = function() {
        const container = document.getElementById('wcContactTagManageDrawerList');
        if (!container) return;

        const groups = (Array.isArray(wcContactGroups) && wcContactGroups.length > 0)
            ? wcContactGroups
            : [{ id: 'g_member', name: '☆星标' }];

        if (groups.length === 0) {
            container.innerHTML = '<div style="text-align: center; color: #8e8e93; padding: 40px 0; font-size: 14px;">暂无标签分组</div>';
            return;
        }

        let html = '';
        groups.forEach(group => {
            const count = (Array.isArray(wcContactsList) ? wcContactsList : []).filter(c => c.groupId === group.id).length;
            let displayName = group.name;
            if (group.id === 'g_member' || group.name.toLowerCase() === 'member' || group.name === 'Member') {
                displayName = '☆星标';
            }

            html += \`
                <div style="display: flex; align-items: center; justify-content: space-between; padding: 12px 14px; background: #f7f7f7; border-radius: 12px;">
                    <div style="display: flex; flex-direction: column; gap: 2px; min-width: 0; flex: 1; margin-right: 12px;">
                        <div style="font-size: 15.5px; font-weight: 600; color: #191919; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">\${displayName}</div>
                        <div style="font-size: 12px; color: #8e8e93;">\${count} 位联系人</div>
                    </div>
                    <div style="display: flex; align-items: center; gap: 8px; flex-shrink: 0;">
                        <button type="button" onclick="wcEditContactGroupName('\${group.id}').then(() => { wcRenderContactTagManageDrawer(); if(typeof wcRenderContactList==='function') wcRenderContactList(); });" style="border: none; background: #ffffff; color: #007aff; font-size: 13px; font-weight: 500; padding: 6px 12px; border-radius: 8px; cursor: pointer; box-shadow: 0 1px 3px rgba(0,0,0,0.06);">编辑</button>
                        <button type="button" onclick="wcDeleteContactGroup('\${group.id}').then(() => { wcRenderContactTagManageDrawer(); if(typeof wcRenderContactList==='function') wcRenderContactList(); });" style="border: none; background: #ffffff; color: #ff3b30; font-size: 13px; font-weight: 500; padding: 6px 12px; border-radius: 8px; cursor: pointer; box-shadow: 0 1px 3px rgba(0,0,0,0.06);">删除</button>
                    </div>
                </div>
            \`;
        });

        container.innerHTML = html;
    };

    // 重写通讯录列表渲染函数
    window.wcRenderContactList = function() {
        const container = document.getElementById('wcDynamicContent');
        if (!container) return;

        let html = '';

        // 顶部四个微信原生功能入口 (服务号采用聚焦放大双菱形)
        html += \`
            <div class="wc-contact-shortcuts">
                <div class="wc-shortcut-item" onclick="if(typeof wcOpenAddFriendPanel==='function') wcOpenAddFriendPanel()">
                    <div class="wc-shortcut-icon orange">
                        <svg viewBox="0 0 1024 1024"><path d="M795.4432 491.52a208.0768 208.0768 0 1 0 208.0768 208.0768A208.0768 208.0768 0 0 0 795.4432 491.52z m113.4592 228.5568h-92.9792v92.5696h-40.96v-90.9312h-92.9792v-40.96h92.9792v-92.9792h40.96v92.9792h92.9792z" fill="#ffffff"></path><path d="M544.768 617.2672a72.9088 72.9088 0 0 1-37.6832-62.6688v-6.144a56.1152 56.1152 0 0 1 18.432-40.96 268.288 268.288 0 0 0 67.1744-113.8688 94.208 94.208 0 0 0 4.5056-31.9488v-69.632a174.8992 174.8992 0 0 0-159.744-176.5376 171.2128 171.2128 0 0 0-182.272 159.3344v87.2448a103.6288 103.6288 0 0 0 4.9152 31.5392A266.24 266.24 0 0 0 327.68 508.3136a56.5248 56.5248 0 0 1 18.0224 40.96v6.144a72.9088 72.9088 0 0 1-43.4176 66.3552l-230.6048 99.5328a74.9568 74.9568 0 0 0-26.624 20.0704 81.92 81.92 0 0 0 0 115.9168 18.8416 18.8416 0 0 0 2.8672 2.8672 35.6352 35.6352 0 0 0 26.2144 11.0592h518.9632A261.3248 261.3248 0 0 1 532.48 701.2352a254.3616 254.3616 0 0 1 12.288-83.968z" fill="#ffffff"></path></svg>
                    </div>
                    <div class="wc-shortcut-name">新的朋友</div>
                </div>
                <div class="wc-shortcut-item" onclick="if(typeof wcOpenCreateGroupChat==='function') wcOpenCreateGroupChat()">
                    <div class="wc-shortcut-icon green">
                        <svg viewBox="0 0 1024 1024"><path d="M523.776 590.848c-4.096-6.656-1.024-28.672 0-31.232 2.048-5.12 12.8-28.16 29.696-46.08 3.072-3.072 6.144-6.144 9.728-9.216 1.024-1.024 2.048-1.536 3.072-2.56 39.424-41.984 64.512-101.888 64.512-167.936 0-128-92.16-231.424-205.824-231.424S218.624 205.312 218.624 333.312c0 66.048 25.088 125.952 64.512 167.936 1.024 1.024 2.048 2.048 3.072 2.56 3.072 3.072 6.144 6.656 9.728 9.216 16.896 17.92 27.648 40.96 29.696 46.08 1.024 2.56 4.096 24.576 0 31.232C259.584 701.952 38.912 742.4 22.016 823.296c-2.048 27.648-5.632 94.72 18.944 94.72s384.512 3.584 384.512 3.584 359.424-3.584 384.512-3.584 21.504-67.584 18.944-94.72c-18.432-80.384-238.592-120.832-305.152-232.448z" fill="#ffffff"></path><path d="M1003.008 748.544c-12.8-60.416-178.176-91.136-227.84-174.592-3.072-5.12-1.024-21.504 0-23.552 1.536-3.584 9.728-20.992 22.528-34.816 2.56-2.048 4.608-4.608 7.168-7.168l2.048-2.048c29.696-31.744 48.128-76.288 48.128-125.952 0-95.744-69.12-173.568-154.624-173.568-3.584 0-7.68 0.512-11.264 0.512 20.992 36.352 33.28 79.36 33.28 125.952 0 66.048-25.088 125.952-64.512 167.936-1.024 1.024-2.048 1.536-3.072 2.56-3.072 3.072-6.144 6.656-9.728 9.216-9.728 10.24-20.48 23.552-25.6 32.768v43.52c97.792 75.264 275.968 152.064 298.496 230.4 36.352-0.512 64.512-0.512 70.144-0.512 19.456 0.512 16.896-50.176 14.848-70.656z" fill="#ffffff"></path></svg>
                    </div>
                    <div class="wc-shortcut-name">群聊</div>
                </div>
                <div class="wc-shortcut-item" onclick="if(typeof wcOpenContactTagManageDrawer==='function') wcOpenContactTagManageDrawer()">
                    <div class="wc-shortcut-icon blue">
                        <svg viewBox="0 0 1024 1024"><path d="M903.7 67.4L562.9 88.1c-7.3 0.4-14.2 3.6-19.4 8.7l-456 456.1c-19.5 19.5-19.5 51.2 0 70.7l312.8 312.8c19.5 19.5 51.2 19.5 70.7 0l456-456.1c5.2-5.2 8.3-12.1 8.7-19.4l20.8-340.6c1.9-29.9-22.9-54.7-52.8-52.9zM768.1 319.6c-35.3 0-63.9-28.6-63.9-63.9s28.6-63.9 63.9-63.9 63.9 28.6 63.9 63.9-28.6 63.9-63.9 63.9z" fill="#ffffff"></path></svg>
                    </div>
                    <div class="wc-shortcut-name">标签</div>
                </div>
                <div class="wc-shortcut-item">
                    <div class="wc-shortcut-icon lightblue">
                        <svg viewBox="140 240 740 540"><path d="M637.44 279.722667a16.298667 16.298667 0 0 1 28.216889 0l128.597333 223.402666a16.355556 16.355556 0 0 1 0 16.298667l-129.905778 224.824889a16.298667 16.298667 0 0 1-28.245333 0l-120.32-209.066667a4.892444 4.892444 0 0 0-8.448-0.028444l-120.746667 209.095111a16.355556 16.355556 0 0 1-28.302222 0l-128.568889-223.459556a16.327111 16.327111 0 0 1 0-16.298666l129.905778-224.768a16.327111 16.327111 0 0 1 28.273778 0l120.234667 208.981333a4.892444 4.892444 0 0 0 8.476444 0l120.803556-208.981333z" fill="#ffffff"></path></svg>
                    </div>
                    <div class="wc-shortcut-name">服务号</div>
                </div>
            </div>
        \`;

        // 读取所有分组
        const groups = (Array.isArray(wcContactGroups) && wcContactGroups.length > 0)
            ? wcContactGroups
            : [{ id: 'g_member', name: '☆星标' }];

        groups.forEach(group => {
            const groupContacts = wcContactsList.filter(c => c.groupId === group.id);

            let displayName = group.name;
            if (group.id === 'g_member' || group.name.toLowerCase() === 'member' || group.name === 'Member') {
                displayName = '☆星标';
            }

            html += \`<div class="wc-contact-group-header" data-group-name="\${displayName}">\${displayName}</div>\`;

            if (groupContacts.length > 0) {
                html += \`<div class="wc-contact-group-list">\`;
                groupContacts.forEach(contact => {
                    const avatarStyle = contact.avatar ? \`background-image: url('\${contact.avatar}'); border: none;\` : '';
                    const avatarContent = contact.avatar ? '' : getWcDefaultAvatarSvg();
                    html += \`
                        <div class="wc-swipe-wrapper">
                            <div class="wc-swipe-actions">
                                <div class="wc-swipe-btn" style="background-color: #3390EC; width: 80px;" onclick="wcOpenMoveSheet('\${contact.id}')">分组</div>
                            </div>
                            <div class="wc-character-card wc-swipe-content" data-id="\${contact.id}" onclick="wcOpenContactProfile('\${contact.id}')">
                                <div class="avatar" style="\${avatarStyle}; background-color: transparent;">\${avatarContent}</div>
                                <div class="info-wrapper">
                                    <div class="name">\${contact.remark || contact.name}</div>
                                </div>
                            </div>
                        </div>
                    \`;
                });
                html += \`</div>\`;
            }
        });

        // 兜底未分组角色
        const validGroupIds = new Set(groups.map(g => g.id));
        const ungrouped = wcContactsList.filter(c => !validGroupIds.has(c.groupId));
        if (ungrouped.length > 0) {
            html += \`<div class="wc-contact-group-header" data-group-name="#">#</div><div class="wc-contact-group-list">\`;
            ungrouped.forEach(contact => {
                const avatarStyle = contact.avatar ? \`background-image: url('\${contact.avatar}'); border: none;\` : '';
                const avatarContent = contact.avatar ? '' : getWcDefaultAvatarSvg();
                html += \`
                    <div class="wc-swipe-wrapper">
                        <div class="wc-swipe-actions">
                            <div class="wc-swipe-btn" style="background-color: #3390EC; width: 80px;" onclick="wcOpenMoveSheet('\${contact.id}')">分组</div>
                        </div>
                        <div class="wc-character-card wc-swipe-content" data-id="\${contact.id}" onclick="wcOpenContactProfile('\${contact.id}')">
                            <div class="avatar" style="\${avatarStyle}; background-color: transparent;">\${avatarContent}</div>
                            <div class="info-wrapper">
                                <div class="name">\${contact.remark || contact.name}</div>
                            </div>
                        </div>
                    </div>
                \`;
            });
            html += \`</div>\`;
        }

        container.innerHTML = html;
        if (typeof wcInitContactSwipe === 'function') wcInitContactSwipe();
        if (typeof wcRenderChatList === 'function') wcRenderChatList();
    };

    // 通讯录右上角加号人物图标
    window.wcRenderContactTabs = function() {
        const container = document.getElementById('wcTopTabsContainer');
        if (!container) return;
        container.innerHTML = \`
            <div class="wc-add-group-nav-btn" onclick="wcOpenCreateContactGroupDialog()" title="新建分组">
                <svg viewBox="0 0 1024 1024"><path d="M327.80288 524.20608c-30.14656-35.67616-54.55872-102.4-54.55872-149.0944v-70.0416c0-90.5216 73.5232-163.84 163.84-163.84 90.48064 0 163.84 73.44128 163.84 163.84v70.0416c0 46.6944-24.576 113.58208-54.55872 149.17632l-14.82752 17.53088c-24.1664 28.672-16.5888 65.08544 17.2032 81.5104l231.8336 113.13152c25.1904 12.288 45.62944 44.76928 45.62944 73.07264v28.09856c0 22.56896-18.47296 40.87808-41.04192 40.87808H88.96512a40.87808 40.87808 0 0 1-41.00096-40.87808v-28.09856c0-28.0576 20.39808-60.78464 45.62944-73.07264l231.8336-113.17248c33.62816-16.384 41.45152-52.71552 17.2032-81.5104l-14.82752-17.57184z m508.64128-65.536h112.64v61.44h-112.64v112.64h-61.44v-112.64h-112.64v-61.44h112.64v-112.64h61.44v112.64z" fill="#ffffff"></path></svg>
            </div>
        \`;
    };

    if (document.getElementById('page-contacts')?.classList.contains('active')) {
        wcRenderContactTabs();
        wcRenderContactList();
    }
})();
`;

    function wcEnsureGlobalPresets() {
        if (typeof window.wcPresets === 'undefined' || !Array.isArray(window.wcPresets)) {
            if (typeof appSettings !== 'undefined' && Array.isArray(appSettings.wc_presets)) {
                window.wcPresets = appSettings.wc_presets;
            } else {
                window.wcPresets = [];
            }
        }
        const builtinIndex = window.wcPresets.findIndex(p => p && (p.id === 'wc_preset_builtin_wechat' || p.name === '仿微信'));
        if (builtinIndex > -1) {
            window.wcPresets[builtinIndex].id = 'wc_preset_builtin_wechat';
            window.wcPresets[builtinIndex].name = '仿微信';
            window.wcPresets[builtinIndex].author = '官方内置';
            window.wcPresets[builtinIndex].css = WC_BUILTIN_PRESET_WECHAT_CSS;
            window.wcPresets[builtinIndex].js = WC_BUILTIN_PRESET_WECHAT_JS;
        } else {
            window.wcPresets.unshift({
                id: 'wc_preset_builtin_wechat',
                name: '仿微信',
                author: '官方内置',
                css: WC_BUILTIN_PRESET_WECHAT_CSS,
                js: WC_BUILTIN_PRESET_WECHAT_JS
            });
        }
    }
    window.wcEnsureGlobalPresets = wcEnsureGlobalPresets;

    // --- WeChat 预设库半抽屉弹窗逻辑 ---
    function wcOpenGlobalPresetDrawer() {
        const overlay = document.getElementById('wcGlobalPresetDrawerOverlay');
        if (!overlay) return;
        wcEnsureGlobalPresets();
        wcRenderGlobalPresetDrawer();
        overlay.classList.add('show');
    }
    window.wcOpenGlobalPresetDrawer = wcOpenGlobalPresetDrawer;

    function wcCloseGlobalPresetDrawer() {
        const overlay = document.getElementById('wcGlobalPresetDrawerOverlay');
        if (overlay) overlay.classList.remove('show');
    }
    window.wcCloseGlobalPresetDrawer = wcCloseGlobalPresetDrawer;

    function wcRenderGlobalPresetDrawer() {
        const container = document.getElementById('wcGlobalPresetDrawerList');
        if (!container) return;

        wcEnsureGlobalPresets();

        if (typeof wcPresets === 'undefined' || wcPresets.length === 0) {
            container.innerHTML = '<div class="wc-empty-preset-hint">当前暂无主题</div>';
            return;
        }

        container.innerHTML = wcPresets.map(preset => {
            const isBuiltin = preset.id === 'wc_preset_builtin_wechat' || preset.author === '官方内置';
            const deleteBtnHtml = isBuiltin ? '' : `
                <div class="wc-wp-btn" onclick="wcDeleteGlobalPreset('${preset.id}')" title="删除预设" style="width: 28px; height: 28px; display: flex; align-items: center; justify-content: center; cursor: pointer;">
                    <svg t="1788319835220" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="39440" width="25" height="25"><path d="M208 294.4V208h131.2V163.2h348.8v44.8h131.2v86.4H208z m566.4 131.2c-25.6 0-44.8 19.2-44.8 44.8v182.4c-12.8-6.4-28.8-9.6-44.8-9.6-73.6 0-131.2 57.6-131.2 131.2 0 16 3.2 28.8 9.6 44.8h-182.4c-48 0-86.4-38.4-86.4-86.4v-262.4c0-25.6-19.2-44.8-44.8-44.8v-86.4h524.8v86.4z m-86.4 262.4c48 0 86.4 38.4 86.4 86.4 0 48-38.4 86.4-86.4 86.4-48 0-86.4-38.4-86.4-86.4-3.2-48 35.2-86.4 86.4-86.4z" fill="#FF3B30" p-id="39441"></path></svg>
                </div>
            `;
            return `
                <div class="wc-preset-drawer-item">
                    <div class="wc-preset-drawer-info" onclick="wcApplyGlobalPreset('${preset.id}'); wcCloseGlobalPresetDrawer();">
                        <div class="wc-preset-drawer-name">${preset.name}</div>
                        <div class="wc-preset-drawer-author">${preset.author || '预设'}</div>
                    </div>
                    <div class="wc-preset-drawer-actions" style="display: flex; align-items: center; gap: 8px;">
                        <div class="wc-wp-btn" onclick="wcExportSinglePreset('${preset.id}')" title="导出预设" style="width: 28px; height: 28px; display: flex; align-items: center; justify-content: center; cursor: pointer;">
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M20.65 7.04769C20.25 6.0499 17.53 3.91463 16.76 3.11639C16.0997 2.51248 15.2613 2.13797 14.37 2.04878C14.48 1.93902 8.36996 2.04878 8.20996 2.04878C7.54752 2.02075 6.88617 2.12444 6.26428 2.35386C5.64239 2.58328 5.07236 2.93385 4.58752 3.38512C4.10268 3.83638 3.71274 4.37935 3.44019 4.98244C3.16763 5.58553 3.01797 6.2367 3 6.89803V17.1753C3.0218 17.8358 3.17491 18.4854 3.45044 19.0864C3.72597 19.6874 4.11839 20.2278 4.60498 20.6761C5.09157 21.1245 5.66262 21.472 6.28491 21.6983C6.9072 21.9246 7.56835 22.0254 8.22998 21.9946H15.79C16.4525 22.0226 17.1138 21.9189 17.7357 21.6895C18.3576 21.4601 18.9276 21.1095 19.4125 20.6583C19.8973 20.207 20.2873 19.664 20.5598 19.0609C20.8324 18.4578 20.982 17.8066 21 17.1453V8.59428C20.9939 8.05991 20.8746 7.53284 20.65 7.04769ZM15.8101 14.0322C14.8101 15.0899 13.66 13.1542 13 12.6353V17.2451C13 17.5097 12.8947 17.7635 12.7072 17.9507C12.5196 18.1378 12.2652 18.2429 12 18.2429C11.7348 18.2429 11.4804 18.1378 11.2928 17.9507C11.1053 17.7635 11 17.5097 11 17.2451V12.6353L9.59998 14.0322C8.69998 14.9602 7.25994 13.5233 8.18994 12.6253L10.85 9.97124C11.1567 9.67021 11.5698 9.50148 12 9.50148C12.4302 9.50148 12.8433 9.67021 13.15 9.97124L15.8101 12.6253C15.9038 12.7181 15.9782 12.8285 16.0289 12.9501C16.0797 13.0716 16.1058 13.2021 16.1058 13.3338C16.1058 13.4655 16.0797 13.5959 16.0289 13.7175C15.9782 13.8391 15.9038 13.9494 15.8101 14.0422V14.0322ZM16.03 7.42685C14.36 7.42685 15.0899 4.68294 14.9399 3.72506C16.4848 4.78888 17.898 6.03146 19.15 7.42685H16.03Z" fill="currentColor"/>
                            </svg>
                        </div>
                        ${deleteBtnHtml}
                    </div>
                </div>
            `;
        }).join('');
    }

    function wcApplyGlobalBackgroundAndCss() {
        const accountId = wcGetCurrentAccountId();
        const globalBg = (typeof appSettings !== 'undefined') ? (appSettings[`wc_global_bg_${accountId}`] || appSettings.wc_global_bg || '') : '';
        const globalCss = (typeof appSettings !== 'undefined') ? (appSettings[`wc_global_css_${accountId}`] || appSettings.wc_global_css || '') : '';
        const globalJs = (typeof appSettings !== 'undefined') ? (appSettings[`wc_global_js_${accountId}`] || appSettings.wc_global_js || '') : '';

        // 1. 应用全局背景
        const wechatUI = document.getElementById('wechatAppUI');
        if (wechatUI) {
            if (globalBg) {
                wechatUI.style.backgroundImage = `url('${globalBg}')`;
                wechatUI.style.backgroundSize = 'cover';
                wechatUI.style.backgroundPosition = 'center';
            } else {
                wechatUI.style.backgroundImage = 'none';
                wechatUI.style.backgroundColor = '';
            }
        }

        // 2. 应用全局 CSS
        wcApplyGlobalCustomCss(globalCss);

        // 3. 应用全局自定义脚本
        wcApplyGlobalCustomJs(globalJs);
    }
    window.wcApplyGlobalBackgroundAndCss = wcApplyGlobalBackgroundAndCss;

    const WC_GLOBAL_CUSTOM_CSS_MAX_LENGTH = 120000;
    const WC_GLOBAL_CUSTOM_JS_MAX_LENGTH = 50000;

    function wcGuardGlobalCssPaste(event) {
        const text = event.clipboardData ? event.clipboardData.getData('text') : '';
        if (text.length <= WC_GLOBAL_CUSTOM_CSS_MAX_LENGTH) return;
        event.preventDefault();
        if (typeof showToast === 'function') showToast(`粘贴内容过大，请控制在 ${WC_GLOBAL_CUSTOM_CSS_MAX_LENGTH / 1000} KB 以内`);
    }
    window.wcGuardGlobalCssPaste = wcGuardGlobalCssPaste;

    function wcGuardGlobalJsPaste(event) {
        const text = event.clipboardData ? event.clipboardData.getData('text') : '';
        if (text.length <= WC_GLOBAL_CUSTOM_JS_MAX_LENGTH) return;
        event.preventDefault();
        if (typeof showToast === 'function') showToast(`粘贴内容过大，请控制在 ${WC_GLOBAL_CUSTOM_JS_MAX_LENGTH / 1000} KB 以内`);
    }
    window.wcGuardGlobalJsPaste = wcGuardGlobalJsPaste;

    function wcApplyGlobalCustomCss(cssText) {
        let styleTag = document.getElementById('wc-dynamic-global-custom-style');
        if (!styleTag) {
            styleTag = document.createElement('style');
            styleTag.id = 'wc-dynamic-global-custom-style';
            document.head.appendChild(styleTag);
        }

        if (!cssText || !cssText.trim()) {
            styleTag.textContent = '';
            return true;
        }
        if (cssText.length > WC_GLOBAL_CUSTOM_CSS_MAX_LENGTH) {
            styleTag.textContent = '';
            if (typeof showToast === 'function') showToast(`全局 CSS 过大，请控制在 ${WC_GLOBAL_CUSTOM_CSS_MAX_LENGTH / 1000} KB 以内`);
            return false;
        }

        let processedCss = cssText.replace(/\/\*[\s\S]*?\*\//g, '');
        processedCss = processedCss.replace(/(^|\})\s*([^{]+)/g, function(m, p1, p2) {
            if (p2.trim().startsWith('@')) return m;
            const prefixed = p2.split(',').map(selector => {
                const s = selector.trim();
                if (!s) return '';
                if (s.includes('#page-chat-room')) return ''; // 绝不污染独立聊天室
                if (s.startsWith('#page-chat-list') || s.startsWith('#page-contacts') || s.startsWith('#page-moments') || s.startsWith('#page-profile') || s.startsWith('#page-wc-login') || s.startsWith('#page-wc-register')) {
                    return '#wechatAppUI ' + s;
                }
                if (s.startsWith('#wechatAppUI')) {
                    return s;
                }
                return '#wechatAppUI :is(#page-chat-list, #page-contacts, #page-moments, #page-profile, #page-wc-login, #page-wc-register) ' + s;
            }).filter(Boolean).join(', ');
            return p1 + (prefixed ? ' ' + prefixed + ' ' : ' ');
        });

        styleTag.textContent = processedCss + `
            /* Keep user CSS from moving the phone shell outside the viewport. */
            #wechatAppUI {
                top: 0 !important;
                transform: none !important;
                margin-top: 0 !important;
                height: 100% !important;
                min-height: 0 !important;
                max-height: 100% !important;
            }
        `;
        return true;
    }

    function wcApplyGlobalCustomJs(jsText) {
        const oldScript = document.getElementById('wc-dynamic-global-custom-script');
        if (oldScript) oldScript.remove();

        if (!jsText || !jsText.trim()) return true;
        if (jsText.length > WC_GLOBAL_CUSTOM_JS_MAX_LENGTH) {
            if (typeof showToast === 'function') showToast(`全局脚本过大，请控制在 ${WC_GLOBAL_CUSTOM_JS_MAX_LENGTH / 1000} KB 以内`);
            return false;
        }

        try {
            const scriptTag = document.createElement('script');
            scriptTag.id = 'wc-dynamic-global-custom-script';
            scriptTag.textContent = `(function(){\ntry {\n${jsText}\n} catch(err) { console.error('自定义脚本执行错误:', err); }\n})();`;
            document.body.appendChild(scriptTag);
            return true;
        } catch (err) {
            console.error('注入自定义脚本失败:', err);
            return false;
        }
    }
    window.wcApplyGlobalCustomJs = wcApplyGlobalCustomJs;

    function wcClearGlobalCustomCssAndJs(skipReload = false) {
        const cssInput = document.getElementById('wcGlobalCustomCssInput');
        const jsInput = document.getElementById('wcGlobalCustomJsInput');
        if (cssInput) cssInput.value = '';
        if (jsInput) jsInput.value = '';
        const accountId = wcGetCurrentAccountId();

        if (typeof appSettings !== 'undefined') {
            appSettings[`wc_global_css_${accountId}`] = '';
            appSettings[`wc_global_js_${accountId}`] = '';
            // Clear legacy unscoped keys too; startup still supports them for old data.
            appSettings.wc_global_css = '';
            appSettings.wc_global_js = '';
            // Clear the older chat-level keys restored by the database bootstrap.
            appSettings.wc_custom_css = '';
            appSettings.wc_custom_js = '';
            if (typeof saveAppSettings === 'function') saveAppSettings();
        }
        wcApplyGlobalCustomCss('');
        wcApplyGlobalCustomJs('');
        if (typeof wcRefreshChatAfterCustomCodeClear === 'function') wcRefreshChatAfterCustomCodeClear();
        // 传入 true 彻底清空并重新构建预览
        wcUpdateAllPersonalizePreviews(true);
        
        if (typeof showToast === 'function') showToast('自定义 CSS 与脚本已清空');
    }
    window.wcClearGlobalCustomCssAndJs = wcClearGlobalCustomCssAndJs;

    function wcClearGlobalCustomCss() {
        wcClearGlobalCustomCssAndJs();
    }
    window.wcClearGlobalCustomCss = wcClearGlobalCustomCss;

    function wcSaveGlobalCustomCssAndJs() {
        const cssInput = document.getElementById('wcGlobalCustomCssInput');
        const jsInput = document.getElementById('wcGlobalCustomJsInput');
        const cssText = cssInput ? cssInput.value : '';
        const jsText = jsInput ? jsInput.value : '';
        const accountId = wcGetCurrentAccountId();

        if (cssText.length > WC_GLOBAL_CUSTOM_CSS_MAX_LENGTH || jsText.length > WC_GLOBAL_CUSTOM_JS_MAX_LENGTH) {
            showToast(`代码过大，CSS 不超过 ${WC_GLOBAL_CUSTOM_CSS_MAX_LENGTH / 1000} KB，脚本不超过 ${WC_GLOBAL_CUSTOM_JS_MAX_LENGTH / 1000} KB`);
            return;
        }

        if (typeof appSettings !== 'undefined') {
            appSettings[`wc_global_css_${accountId}`] = cssText;
            appSettings[`wc_global_js_${accountId}`] = jsText;
            appSettings.wc_global_css = cssText;
            appSettings.wc_global_js = jsText;
            if (typeof saveAppSettings === 'function') saveAppSettings();
        }
        wcApplyGlobalCustomCss(cssText);
        wcApplyGlobalCustomJs(jsText);
        // 立即触发全量重构预览，执行新脚本与应用新样式
        wcUpdateAllPersonalizePreviews(true);
        showToast('自定义 CSS 与脚本已应用');
    }
    window.wcSaveGlobalCustomCssAndJs = wcSaveGlobalCustomCssAndJs;

    function wcSaveGlobalCustomCss() {
        wcSaveGlobalCustomCssAndJs();
    }
    window.wcSaveGlobalCustomCss = wcSaveGlobalCustomCss;

    async function wcSaveGlobalPreset() {
        const cssInput = document.getElementById('wcGlobalCustomCssInput');
        const jsInput = document.getElementById('wcGlobalCustomJsInput');
        const css = cssInput ? cssInput.value : '';
        const js = jsInput ? jsInput.value : '';

        if (!css.trim() && !js.trim()) {
            showToast('当前没有可保存的 CSS 或脚本代码');
            return;
        }

        const name = await showCustomPrompt('保存至预设库', { placeholder: '请输入预设名称' }, '保存');
        if (!name || !name.trim()) return;

        if (typeof wcPresets === 'undefined') window.wcPresets = [];
        const newPreset = {
            id: 'wc_preset_' + Date.now(),
            name: name.trim(),
            author: '我',
            css: css,
            js: js
        };
        wcPresets.unshift(newPreset);
        if (typeof wcSavePresetsToStorage === 'function') wcSavePresetsToStorage();
        wcRenderGlobalPresets();
        showToast(`已保存预设：${name.trim()}`);
    }
    window.wcSaveGlobalPreset = wcSaveGlobalPreset;

    function wcRenderGlobalPresets() {
        const container = document.getElementById('wcGlobalPresetList');
        if (!container) return;

        if (typeof wcPresets === 'undefined' || wcPresets.length === 0) {
            container.innerHTML = '<div style="text-align: center; color: #8E8E93; font-size: 13px; padding: 20px 0;">暂无预设主题</div>';
            return;
        }

        container.innerHTML = wcPresets.map(preset => {
            const isBuiltin = preset.id === 'wc_preset_builtin_wechat' || preset.author === '官方内置';
            const deleteBtnHtml = isBuiltin ? '' : `<button class="wc-ps-preset-btn delete" onclick="wcDeleteGlobalPreset('${preset.id}')">删除</button>`;
            return `
                <div class="wc-ps-preset-item">
                    <div class="wc-ps-preset-info" onclick="wcApplyGlobalPreset('${preset.id}')">
                        <div class="wc-ps-preset-name">${preset.name}</div>
                        <div class="wc-ps-preset-author">${preset.author || '预设'}</div>
                    </div>
                    <div class="wc-ps-preset-actions">
                        <button class="wc-ps-preset-btn apply" onclick="wcApplyGlobalPreset('${preset.id}')">应用</button>
                        ${deleteBtnHtml}
                    </div>
                </div>
            `;
        }).join('');
    }

    function wcApplyGlobalPreset(presetId) {
        if (typeof wcPresets === 'undefined') return;
        const preset = wcPresets.find(p => p.id === presetId);
        if (preset) {
            const cssInput = document.getElementById('wcGlobalCustomCssInput');
            const jsInput = document.getElementById('wcGlobalCustomJsInput');
            if (cssInput) cssInput.value = preset.css || '';
            if (jsInput) jsInput.value = preset.js || '';
            wcSaveGlobalCustomCssAndJs();
            // 立即触发 4 个手机壳全量重构预览
            wcUpdateAllPersonalizePreviews(true);
            showToast(`已应用预设：${preset.name}`);
        }
    }
    window.wcApplyGlobalPreset = wcApplyGlobalPreset;

    function wcFormatThemeOutputTxt(css, js) {
        const trimmedCss = String(css || '').trim();
        const trimmedJs = String(js || '').trim();
        if (trimmedCss && trimmedJs) {
            return `/* === WECHAT_THEME_CSS === */\n${trimmedCss}\n\n/* === WECHAT_THEME_JS === */\n${trimmedJs}\n`;
        }
        if (trimmedJs && !trimmedCss) {
            return `/* === WECHAT_THEME_JS === */\n${trimmedJs}\n`;
        }
        return trimmedCss;
    }

    function wcParseThemeContent(rawText) {
        const text = String(rawText || '').trim();
        let css = '';
        let js = '';

        if (!text) return { css: '', js: '' };

        // 1. 如果是 JSON
        if (text.startsWith('{') && text.endsWith('}')) {
            try {
                const parsed = JSON.parse(text);
                if (parsed && typeof parsed === 'object') {
                    return {
                        css: String(parsed.css || '').trim(),
                        js: String(parsed.js || '').trim(),
                        name: parsed.name || ''
                    };
                }
            } catch (e) {}
        }

        // 2. 检查结构化注释标签
        const hasCssTag = text.includes('/* === WECHAT_THEME_CSS === */') || text.includes('/* === CSS === */');
        const hasJsTag = text.includes('/* === WECHAT_THEME_JS === */') || text.includes('/* === JS === */');

        if (hasCssTag || hasJsTag) {
            const parts = text.split(/\/\*\s*===\s*(?:WECHAT_THEME_)?(CSS|JS)\s*===\s*\*\//i);
            for (let i = 1; i < parts.length; i += 2) {
                const type = (parts[i] || '').toUpperCase();
                const code = (parts[i + 1] || '').trim();
                if (type === 'CSS') css = code;
                else if (type === 'JS') js = code;
            }
            return { css, js };
        }

        // 3. 检查 HTML 标签
        if (text.includes('<style') || text.includes('<script')) {
            const styleMatch = text.match(/<style[^>]*>([\s\S]*?)<\/style>/i);
            const scriptMatch = text.match(/<script[^>]*>([\s\S]*?)<\/script>/i);
            if (styleMatch || scriptMatch) {
                css = styleMatch ? styleMatch[1].trim() : '';
                js = scriptMatch ? scriptMatch[1].trim() : '';
                return { css, js };
            }
        }

        // 4. 智能特征识别纯 JS 或纯 CSS
        const isPureJs = /^\s*(?:\(function|window\.|document\.|function\s*\(|const\s+|let\s+|var\s+)/.test(text)
            && !/\{[^{}]*:[^{}]*;\s*\}/.test(text);

        if (isPureJs) {
            js = text;
        } else {
            css = text;
        }

        return { css, js };
    }

    // Expose existing private-chat theme codecs for the group appearance editor.
    window.wcParseThemeContentForGroup = wcParseThemeContent;
    window.wcFormatThemeOutputForGroup = wcFormatThemeOutputTxt;
    window.wcReadThemeDocxForGroup = async buffer => wcDocxXmlToChatText(await wcReadChatDocxXml(buffer));
    window.wcDecodeThemeTextForGroup = buffer => wcDecodeChatText(buffer);

    async function wcExportCurrentThemePreset() {
        const cssInput = document.getElementById('wcGlobalCustomCssInput');
        const jsInput = document.getElementById('wcGlobalCustomJsInput');
        const css = cssInput ? cssInput.value : '';
        const js = jsInput ? jsInput.value : '';

        if (!css.trim() && !js.trim()) {
            showToast('当前没有可导出的 CSS 或脚本内容');
            return;
        }

        const now = new Date();
        const dateStr = `${now.getFullYear()}${String(now.getMonth() + 1).padStart(2, '0')}${String(now.getDate()).padStart(2, '0')}`;
        const defaultName = `WeChat_Theme_${dateStr}`;

        const customName = typeof showCustomPrompt === 'function'
            ? await showCustomPrompt('导出美化预设 (TXT)', { placeholder: '请输入美化名称', value: defaultName }, '导出')
            : window.prompt('请输入美化名称:', defaultName);

        if (customName === null) return;
        const themeName = (customName && customName.trim()) ? customName.trim() : defaultName;

        const outText = wcFormatThemeOutputTxt(css, js);
        const blob = new Blob([outText], { type: 'text/plain;charset=utf-8' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${themeName}.txt`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        showToast('美化已导出为 TXT');
    }
    window.wcExportCurrentThemePreset = wcExportCurrentThemePreset;

    function wcExportSinglePreset(presetId) {
        if (typeof wcPresets === 'undefined') return;
        const preset = wcPresets.find(p => p.id === presetId);
        if (!preset) return;

        const fileName = `${preset.name || 'WeChat_Theme'}.txt`;
        const outText = wcFormatThemeOutputTxt(preset.css || '', preset.js || '');
        const blob = new Blob([outText], { type: 'text/plain;charset=utf-8' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = fileName;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        showToast(`已导出预设：${preset.name}`);
    }
    window.wcExportSinglePreset = wcExportSinglePreset;

    function wcTriggerImportThemePreset() {
        const fileInput = document.getElementById('wcThemePresetFileInput');
        if (fileInput) fileInput.click();
    }
    window.wcTriggerImportThemePreset = wcTriggerImportThemePreset;

    async function wcHandleThemePresetImportFile(event) {
        const file = event.target.files?.[0];
        if (!file) return;

        const extension = file.name.split('.').pop()?.toLowerCase();
        try {
            let rawText = '';
            const buffer = await file.arrayBuffer();
            if (extension === 'docx') {
                rawText = wcDocxXmlToChatText(await wcReadChatDocxXml(buffer));
            } else {
                rawText = wcDecodeChatText(buffer);
            }

            const parsed = wcParseThemeContent(rawText);
            const importedCss = parsed.css || '';
            const importedJs = parsed.js || '';
            const importedName = parsed.name || file.name.replace(/\.[^/.]+$/, '');

            const cssInput = document.getElementById('wcGlobalCustomCssInput');
            const jsInput = document.getElementById('wcGlobalCustomJsInput');
            if (cssInput) cssInput.value = importedCss;
            if (jsInput) jsInput.value = importedJs;

            wcSaveGlobalCustomCssAndJs();
            // 导入新主题后立即触发 4 个手机壳全量重构预览
            wcUpdateAllPersonalizePreviews(true);

            // 同时提示是否保存到预设库
            const saveToLib = typeof showCustomConfirm === 'function'
                ? await showCustomConfirm('导入成功', `已应用“${importedName}”！是否同时保存到本地预设库？`, '保存到预设库', false)
                : window.confirm(`已应用“${importedName}”！是否同时保存到本地预设库？`);

            if (saveToLib) {
                if (typeof wcPresets === 'undefined') window.wcPresets = [];
                wcPresets.unshift({
                    id: 'wc_preset_' + Date.now(),
                    name: importedName,
                    author: '导入',
                    css: importedCss,
                    js: importedJs
                });
                if (typeof wcSavePresetsToStorage === 'function') wcSavePresetsToStorage();
                wcRenderGlobalPresets();
                if (typeof wcRenderGlobalPresetDrawer === 'function') wcRenderGlobalPresetDrawer();
            }

            showToast('主题美化导入成功');
        } catch (error) {
            console.error('导入美化预设失败:', error);
            if (typeof showCustomAlert === 'function') {
                showCustomAlert('导入失败', '解析文件失败，请检查文件格式是否正确。');
            } else {
                showToast('导入文件解析失败');
            }
        } finally {
            event.target.value = '';
        }
    }
    window.wcHandleThemePresetImportFile = wcHandleThemePresetImportFile;

    async function wcDeleteGlobalPreset(presetId) {
        if (presetId === 'wc_preset_builtin_wechat') {
            if (typeof showToast === 'function') showToast('官方内置预设无法删除');
            return;
        }
        const confirmed = await showCustomConfirm('删除预设', '确定要删除这个预设吗？', '删除', true);
        if (confirmed && typeof wcPresets !== 'undefined') {
            wcPresets = wcPresets.filter(p => p.id !== presetId);
            if (typeof wcSavePresetsToStorage === 'function') wcSavePresetsToStorage();
            wcRenderGlobalPresets();
            if (typeof wcRenderGlobalPresetDrawer === 'function') wcRenderGlobalPresetDrawer();
            showToast('已删除预设');
        }
    }
    window.wcDeleteGlobalPreset = wcDeleteGlobalPreset;

    // --- 微信个人信息编辑逻辑 ---
    let wcTempProfileAvatar = '';

    async function wcOpenProfileEditModal() {
        const authData = await wcGetAuthData();
        const currentUser = authData.accounts.find(a => a.wxid === authData.currentLoginWxid);
        if (!currentUser) return;

        document.getElementById('wcProfileEditName').value = currentUser.name || '';
        document.getElementById('wcProfileEditWxid').value = currentUser.wxid || '';
        // 如果没有自定义签名，输入框留空，让 placeholder 显示默认文案
        document.getElementById('wcProfileEditBio').value = currentUser.bio || '';

        wcTempProfileAvatar = currentUser.avatar || '';
        const avatarPreview = document.getElementById('wcProfileEditAvatarPreview');
        if (wcTempProfileAvatar) {
            avatarPreview.style.backgroundImage = `url('${wcTempProfileAvatar}')`;
            avatarPreview.style.backgroundColor = 'transparent';
            avatarPreview.innerHTML = '';
        } else {
            avatarPreview.style.backgroundImage = 'none';
            avatarPreview.style.backgroundColor = 'transparent';
            avatarPreview.innerHTML = getWcDefaultAvatarSvg();
        }

        document.getElementById('wcProfileEditOverlay').classList.add('show');
    }

    function wcCloseProfileEditModal() {
        document.getElementById('wcProfileEditOverlay').classList.remove('show');
    }

    function wcHandleProfileAvatarUpload(event) {
        const file = event.target.files[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onload = function(e) {
            wcTempProfileAvatar = e.target.result;
            document.getElementById('wcProfileEditAvatarPreview').style.backgroundImage = `url('${wcTempProfileAvatar}')`;
        };
        reader.readAsDataURL(file);
        event.target.value = '';
    }

    function wcOpenProfileAvatarMenu(event) {
        const overlay = document.getElementById('wcProfileAvatarMenuOverlay');
        const menu = document.getElementById('wcProfileAvatarMenu');
        overlay.style.display = 'block';
        const rect = event.currentTarget.getBoundingClientRect();
        let top = rect.bottom + 10;
        let left = rect.left + (rect.width / 2) - 75; // 居中对齐菜单
        if (top + 130 > window.innerHeight) top = rect.top - 120;
        menu.style.top = top + 'px';
        menu.style.left = left + 'px';
    }

    function wcCloseProfileAvatarMenu() {
        document.getElementById('wcProfileAvatarMenuOverlay').style.display = 'none';
    }

    function wcHandleProfileAvatarUrl() {
        wcCloseProfileAvatarMenu();
        showCustomPrompt('修改头像', { placeholder: '输入图片 URL' }, '确定').then(url => {
            if (url && url.trim()) {
                wcTempProfileAvatar = url.trim();
                document.getElementById('wcProfileEditAvatarPreview').style.backgroundImage = `url('${wcTempProfileAvatar}')`;
                showToast('头像已更新，请点击保存');
            }
        });
    }

    async function wcSaveProfileEdit() {
        const newName = document.getElementById('wcProfileEditName').value.trim();
        const newWxid = document.getElementById('wcProfileEditWxid').value.trim();
        const newBio = document.getElementById('wcProfileEditBio').value.trim();

        if (!newName || !newWxid) {
            showToast('名称和微信号不能为空');
            return;
        }

        try {
            const authData = await wcGetAuthData();
            const currentUserIndex = authData.accounts.findIndex(a => a.wxid === authData.currentLoginWxid);

            if (currentUserIndex === -1) return;

            // 检查微信号是否冲突 (如果修改了微信号)
            if (newWxid !== authData.currentLoginWxid) {
                const isConflict = authData.accounts.some((a, idx) => a.wxid === newWxid && idx !== currentUserIndex);
                if (isConflict) {
                    showToast('该微信号已存在');
                    return;
                }
            }

            // 更新数据
            authData.accounts[currentUserIndex].name = newName;
            authData.accounts[currentUserIndex].wxid = newWxid;
            authData.accounts[currentUserIndex].bio = newBio;
            authData.accounts[currentUserIndex].avatar = wcTempProfileAvatar;

            authData.currentLoginWxid = newWxid; // 更新当前登录的 wxid

            await wcSaveAuthData(authData);

            // 更新全局变量
            if (typeof appSettings !== 'undefined') {
                appSettings.wc_current_user_name = newName;
                appSettings.wc_current_user_phone = newWxid;
                appSettings.wc_current_user_avatar = wcTempProfileAvatar;
                appSettings.wc_current_user_bio = newBio;
                if (typeof saveAppSettings === 'function') saveAppSettings();
            }

            // 同步更新朋友圈资料
            if (typeof wcMomentsProfile !== 'undefined') {
                wcMomentsProfile.name = newName;
                wcMomentsProfile.avatar = wcTempProfileAvatar;
                wcMomentsProfile.id = newWxid;
                if (typeof wcSaveMomentsProfileData === 'function') wcSaveMomentsProfileData();
            }

            showToast('个人信息已更新');
            wcCloseProfileEditModal();
            wcRenderProfilePage();

        } catch (e) {
            console.error('保存个人信息失败', e);
            showToast('保存失败');
        }
    }

    // --- 微信朋友圈逻辑 ---

    function wcShowMainSettings() {
        const mainView = document.getElementById('wc-main-settings-view');
        const worldbookBindingView = document.getElementById('wc-worldbook-binding-view');
        if (worldbookBindingView) worldbookBindingView.style.display = 'none';
        if (mainView) mainView.style.display = 'block';

        const title = document.getElementById('wc-settings-modal-title');
        if (title) title.innerText = 'WeSettings';
    }

    function wcHandleSettingsBack() {
        const promptListView = document.getElementById('wc-prompt-list-view');
        const promptEditView = document.getElementById('wc-prompt-edit-view');
        const cotListView = document.getElementById('wc-cot-list-view');
        const cotEditView = document.getElementById('wc-cot-edit-view');
        const dossierListView = document.getElementById('wc-dossier-list-view');
        const dossierEditView = document.getElementById('wc-dossier-edit-view');
        const nudgeDrawerView = document.getElementById('wc-nudge-drawer-view');
        const customPresetListView = document.getElementById('wc-custom-preset-list-view');
        const worldbookBindingView = document.getElementById('wc-worldbook-binding-view');
        const customPresetModal = document.getElementById('wcCustomPresetModalOverlay');

        if (customPresetModal && customPresetModal.classList.contains('show')) {
            wcCloseEditCustomPresetModal();
        } else if (worldbookBindingView && worldbookBindingView.style.display === 'flex') {
            worldbookBindingView.style.display = 'none';
            wcShowMainSettings();
        } else if (nudgeDrawerView && nudgeDrawerView.classList.contains('show')) {
            wcCloseNudgeDrawer();
        } else if (promptEditView && promptEditView.classList.contains('show')) {
            wcCloseEditPrompt();
        } else if (cotEditView && cotEditView.classList.contains('show')) {
            wcCloseEditCot();
        } else if (dossierEditView && dossierEditView.classList.contains('show')) {
            wcCloseEditDossier();
        } else if (promptListView && promptListView.style.display === 'flex') {
            promptListView.style.display = 'none';
            wcShowMainSettings();
        } else if (cotListView && cotListView.style.display === 'flex') {
            cotListView.style.display = 'none';
            wcShowMainSettings();
        } else if (dossierListView && dossierListView.style.display === 'flex') {
            dossierListView.style.display = 'none';
            wcShowMainSettings();
        } else if (customPresetListView && customPresetListView.style.display === 'flex') {
            customPresetListView.style.display = 'none';
            wcShowMainSettings();
        } else {
            void wcPersistChatLimits()
                .catch(error => console.error('保存聊天限制设置失败', error))
                .finally(() => wcCloseSettingsModal());
        }
    }

    // ==========================================
    // 心声系统 (状态栏) 设置逻辑
    // ==========================================
    let wcActiveDossierId = 'default'; // 'default' (内置默认心声), 自定义 ID, 或 'none' (关闭)
    let wcCustomDossiersList = [];
    let wcCurrentEditDossierId = null;

    const WC_DOSSIER_FITNESS_SVG = `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 48 48" id="Fitness--Streamline-Ionic-Filled" height="48" width="48"><desc>Fitness Streamline Icon: https://streamlinehq.com</desc><path fill="currentColor" d="M17.4592 13.1659c0.1505 -0.3012 0.388 -0.5502 0.6818 -0.7148 0.2937 -0.1646 0.6302 -0.237 0.9656 -0.208 0.3355 0.0289 0.6544 0.158 0.9157 0.3705 0.2612 0.2126 0.4525 0.4985 0.5492 0.8211l3.822 12.7429 3.15 -6.2917c0.1396 -0.2789 0.3539 -0.5136 0.6194 -0.6776 0.2653 -0.164 0.5712 -0.2509 0.8831 -0.2509 0.312 0 0.6177 0.0869 0.8832 0.2509 0.2653 0.164 0.4799 0.3987 0.6194 0.6776l2.8917 5.7919h10.1598c1.5127 -3.1186 2.2802 -6.546 2.2419 -10.0118 -0.0662 -6.5217 -5.2984 -11.8283 -11.6635 -11.8283 -5.0495 0 -8.4 3.1017 -10.1767 5.355 -1.7724 -2.2565 -5.1271 -5.355 -10.1766 -5.355 -6.3652 0 -11.5974 5.3066 -11.6635 11.8283 -0.0272 2.252 0.289 4.4951 0.9376 6.6518h9.784l4.5759 -9.1519Z" stroke-width="1"></path><path fill="currentColor" d="m30.8992 28.1092 -1.8574 -3.7149 -3.5375 7.075c-0.1397 0.2789 -0.3542 0.5135 -0.6195 0.6774 -0.2653 0.164 -0.5712 0.2507 -0.883 0.2507 -0.0469 0 -0.0952 -0.0021 -0.1449 -0.0062 -0.3364 -0.0279 -0.6564 -0.1564 -0.9186 -0.3689 -0.2622 -0.2123 -0.4543 -0.4987 -0.5515 -0.8218l-3.8219 -12.743 -3.1501 6.2916c-0.1389 0.2776 -0.3519 0.5112 -0.6154 0.6751 -0.2636 0.1638 -0.5674 0.2515 -0.8777 0.2532H4.4034c0.98 2.0503 2.2844 4.0685 3.9134 6.0543 1.9709 2.4024 5.544 6.2433 13.7961 11.8451 0.5564 0.3815 1.2152 0.5856 1.8899 0.5856s1.3335 -0.2041 1.89 -0.5856c8.252 -5.6018 11.8252 -9.4427 13.796 -11.8451 0.7099 -0.8639 1.3757 -1.7633 1.9951 -2.6943h-9.2821c-0.3119 0 -0.6177 -0.0867 -0.8831 -0.2507 -0.2653 -0.164 -0.4799 -0.3985 -0.6195 -0.6775Z" stroke-width="1"></path><path fill="currentColor" d="M45.8401 25.6775h-2.2416c-0.5585 1.1638 -1.1988 2.2865 -1.9162 3.3598h4.1578c0.4457 0 0.8729 -0.177 1.1879 -0.492 0.3151 -0.315 0.492 -0.7424 0.492 -1.1879s-0.1769 -0.8728 -0.492 -1.1879c-0.315 -0.315 -0.7422 -0.492 -1.1879 -0.492Z" stroke-width="1"></path><path fill="currentColor" d="M2.1596 22.318c-0.4454 0 -0.8726 0.177 -1.1876 0.4919 -0.315 0.3151 -0.492 0.7424 -0.492 1.1877 0 0.4454 0.177 0.8727 0.492 1.1878 0.315 0.3149 0.7422 0.4919 1.1876 0.4919h2.2413c-0.5194 -1.085 -0.9553 -2.208 -1.3038 -3.3593h-0.9375Z" stroke-width="1"></path></svg>`;

    function wcGetDossierSettingsForContact(contactId = null) {
        const resolvedContactId = contactId !== null && contactId !== undefined
            ? contactId
            : (typeof wcCurrentChatContactId !== 'undefined' ? wcCurrentChatContactId : null);
        const customDossiers = typeof appSettings !== 'undefined' && Array.isArray(appSettings.wc_custom_dossiers_list)
            ? appSettings.wc_custom_dossiers_list
            : [];
        const contact = (typeof wcContactsList !== 'undefined' && Array.isArray(wcContactsList) && resolvedContactId !== null)
            ? wcContactsList.find(c => String(c.id) === String(resolvedContactId))
            : null;
        const activeId = contact && contact.activeDossierId !== undefined
            ? contact.activeDossierId
            : (typeof appSettings !== 'undefined' && appSettings.wc_active_dossier_id !== undefined
                ? appSettings.wc_active_dossier_id
                : 'default');
        return { activeId, customDossiers, contact };
    }
    window.wcGetDossierSettingsForContact = wcGetDossierSettingsForContact;

    function wcLoadDossierSettings(contactId = null) {
        const state = wcGetDossierSettingsForContact(contactId);
        wcCustomDossiersList = state.customDossiers;
        wcActiveDossierId = state.activeId;
        return state;
    }

    function wcSaveDossierSettings() {
        const contact = (typeof wcContactsList !== 'undefined' && typeof wcCurrentChatContactId !== 'undefined')
            ? wcContactsList.find(c => String(c.id) === String(wcCurrentChatContactId))
            : null;
        if (contact) {
            // Active dossier is contact-owned. Do not mirror it back to the legacy global value,
            // otherwise a setting change for one character leaks into contacts that have not
            // established their own dossier state yet.
            contact.activeDossierId = wcActiveDossierId;
            if (typeof wcSaveContactsDataAsync === 'function') void wcSaveContactsDataAsync();
        }
        if (typeof appSettings !== 'undefined') {
            // Custom dossier definitions are shared resources; only the active selection is per contact.
            appSettings.wc_custom_dossiers_list = wcCustomDossiersList;
            if (!contact) {
                appSettings.wc_active_dossier_id = wcActiveDossierId;
            }
            if (typeof saveAppSettings === 'function') saveAppSettings();
        }
    }

    function wcShowDossierSettings() {
        wcLoadDossierSettings();
        document.getElementById('wc-main-settings-view').style.display = 'none';
        document.getElementById('wc-dossier-list-view').style.display = 'flex';
        document.getElementById('wc-settings-modal-title').innerText = '心声系统设置';
        wcRenderDossierList();
    }
    window.wcShowDossierSettings = wcShowDossierSettings;

    function wcRenderDossierList() {
        const container = document.getElementById('wc-dossier-list-container');
        if (!container) return;

        let html = '';

        // 渲染内置默认心声 (图标统一设置为灰色 #8E8E93)
        const isBuiltinActive = wcActiveDossierId === 'default' ? 'active' : '';
        html += `
            <div class="preset-item-wrapper">
                <div class="preset-item-content" onclick="wcToggleDossierActive('default', event)">
                    <div class="preset-icon" style="color: #8E8E93 !important;">
                        ${WC_DOSSIER_FITNESS_SVG}
                    </div>
                    <div class="preset-info" style="flex: 1;">
                        <div class="preset-title">默认内置心声档案</div>
                        <div class="preset-author">包含草稿/生理状态/搜索留痕/平行时空</div>
                    </div>
                    <div class="custom-toggle ${isBuiltinActive}"><div class="thumb"><svg viewBox="0 0 24 24"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/></svg></div></div>
                </div>
            </div>
        `;

        // 渲染自定义心声模板列表 (图标同样统一设置为灰色 #8E8E93)
        wcCustomDossiersList.forEach(dossier => {
            const isActive = wcActiveDossierId === dossier.id ? 'active' : '';
            html += `
                <div class="preset-item-wrapper">
                    <div class="preset-item-content" ontouchstart="wcHandleTouchStart(event)" ontouchmove="wcHandleTouchMove(event)" ontouchend="wcHandleTouchEnd(event)">
                        <div class="preset-icon" style="color: #8E8E93 !important;">
                            ${WC_DOSSIER_FITNESS_SVG}
                        </div>
                        <div class="preset-info" style="flex: 1;" onclick="wcOpenEditDossier('${dossier.id}')">
                            <div class="preset-title">${dossier.name}</div>
                            <div class="preset-author">自定义正则状态栏模板</div>
                        </div>
                        <div class="custom-toggle ${isActive}" onclick="wcToggleDossierActive('${dossier.id}', event)" ontouchstart="event.stopPropagation()"><div class="thumb"><svg viewBox="0 0 24 24"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/></svg></div></div>
                    </div>
                    <div class="preset-item-actions" style="display: flex; align-items: center; gap: 8px; padding-right: 8px;">
                        <div class="action-capsule" onclick="wcExportSingleDossier('${dossier.id}')" title="导出心声" style="width: 44px; height: 44px; padding: 0 !important; border-radius: 14px; background: rgba(0, 122, 255, 0.12); color: #007aff; display: flex; align-items: center; justify-content: center; cursor: pointer;">
                            <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style="width: 23px !important; height: 23px !important; min-width: 23px !important; min-height: 23px !important; display: block;"><path d="M20.65 7.04769C20.25 6.0499 17.53 3.91463 16.76 3.11639C16.0997 2.51248 15.2613 2.13797 14.37 2.04878C14.48 1.93902 8.36996 2.04878 8.20996 2.04878C7.54752 2.02075 6.88617 2.12444 6.26428 2.35386C5.64239 2.58328 5.07236 2.93385 4.58752 3.38512C4.10268 3.83638 3.71274 4.37935 3.44019 4.98244C3.16763 5.58553 3.01797 6.2367 3 6.89803V17.1753C3.0218 17.8358 3.17491 18.4854 3.45044 19.0864C3.72597 19.6874 4.11839 20.2278 4.60498 20.6761C5.09157 21.1245 5.66262 21.472 6.28491 21.6983C6.9072 21.9246 7.56835 22.0254 8.22998 21.9946H15.79C16.4525 22.0226 17.1138 21.9189 17.7357 21.6895C18.3576 21.4601 18.9276 21.1095 19.4125 20.6583C19.8973 20.207 20.2873 19.664 20.5598 19.0609C20.8324 18.4578 20.982 17.8066 21 17.1453V8.59428C20.9939 8.05991 20.8746 7.53284 20.65 7.04769ZM15.8101 14.0322C14.8101 15.0899 13.66 13.1542 13 12.6353V17.2451C13 17.5097 12.8947 17.7635 12.7072 17.9507C12.5196 18.1378 12.2652 18.2429 12 18.2429C11.7348 18.2429 11.4804 18.1378 11.2928 17.9507C11.1053 17.7635 11 17.5097 11 17.2451V12.6353L9.59998 14.0322C8.69998 14.9602 7.25994 13.5233 8.18994 12.6253L10.85 9.97124C11.1567 9.67021 11.5698 9.50148 12 9.50148C12.4302 9.50148 12.8433 9.67021 13.15 9.97124L15.8101 12.6253C15.9038 12.7181 15.9782 12.8285 16.0289 12.9501C16.0797 13.0716 16.1058 13.2021 16.1058 13.3338C16.1058 13.4655 16.0797 13.5959 16.0289 13.7175C15.9782 13.8391 15.9038 13.9494 15.8101 14.0422V14.0322ZM16.03 7.42685C14.36 7.42685 15.0899 4.68294 14.9399 3.72506C16.4848 4.78888 17.898 6.03146 19.15 7.42685H16.03Z" fill="currentColor"/></svg>
                        </div>
                        <div class="action-capsule" onclick="wcOpenEditDossier('${dossier.id}')" title="编辑心声" style="width: 44px; height: 44px; padding: 0 !important; border-radius: 14px; background: rgba(0, 122, 255, 0.12); color: #007aff; display: flex; align-items: center; justify-content: center; cursor: pointer;">
                            <svg t="1789622386706" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="4734" style="width: 23px !important; height: 23px !important; min-width: 23px !important; min-height: 23px !important; display: block;"><path d="M943.104 216.064q-8.192 9.216-15.36 16.384l-12.288 12.288q-6.144 6.144-11.264 10.24l-138.24-139.264q8.192-8.192 20.48-19.456t20.48-17.408q20.48-16.384 44.032-14.336t37.888 9.216q15.36 8.192 34.304 28.672t29.184 43.008q5.12 14.336 6.656 33.792t-15.872 36.864zM551.936 329.728l158.72-158.72 138.24 138.24q-87.04 87.04-158.72 157.696-30.72 29.696-59.904 58.88t-53.248 52.224-39.424 38.4l-18.432 18.432q-7.168 7.168-16.384 14.336t-20.48 12.288-31.232 12.288-41.472 13.824-40.96 12.288-29.696 6.656q-19.456 2.048-20.992-3.584t1.536-25.088q1.024-10.24 5.12-30.208t8.192-40.448 8.704-38.4 7.68-25.088q5.12-11.264 10.752-19.456t15.872-18.432zM899.072 478.208q21.504 0 40.96 10.24t19.456 41.984l0 232.448q0 28.672-10.752 52.736t-29.184 41.984-41.984 27.648-48.128 9.728l-571.392 0q-24.576 0-48.128-10.752t-41.472-29.184-29.184-43.52-11.264-53.76l0-570.368q0-20.48 11.264-42.496t29.184-39.936 40.448-29.696 45.056-11.776l238.592 0q28.672 0 40.448 20.992t11.776 42.496-11.776 41.472-40.448 19.968l-187.392 0q-21.504 0-34.816 14.848t-13.312 36.352l0 481.28q0 20.48 13.312 34.304t34.816 13.824l474.112 0q21.504 0 36.864-13.824t15.36-34.304l0-190.464q0-14.336 6.656-24.576t16.384-16.384 21.504-8.704 23.04-2.56z" fill="currentColor" p-id="4735"></path></svg>
                        </div>
                        <div class="action-capsule delete" onclick="wcDeleteDossier('${dossier.id}')" title="删除心声" style="width: 44px; height: 44px; padding: 0 !important; border-radius: 14px; background: rgba(255, 59, 48, 0.12); color: #ff3b30; display: flex; align-items: center; justify-content: center; cursor: pointer;">
                            <svg t="1789622526077" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="20528" style="width: 23px !important; height: 23px !important; min-width: 23px !important; min-height: 23px !important; display: block;"><path d="M880 224H144a48 48 0 0 1 0-96H384a64 64 0 0 1 64-64h128a64 64 0 0 1 64 64h240a48 48 0 0 1 0 96zM832 832a128 128 0 0 1-128 128H320a128 128 0 0 1-128-128V288h640V832zM448 464a48 48 0 0 0-96 0v288a48 48 0 0 0 96 0v-288z m224 0a48 48 0 0 0-96 0v288a48 48 0 0 0 96 0v-288z" fill="currentColor" p-id="20529"></path></svg>
                        </div>
                    </div>
                </div>
            `;
        });

        container.innerHTML = html;

    }

    function wcToggleDossierActive(id, event) {
        if (event) event.stopPropagation();
        if (wcActiveDossierId === id) {
            wcActiveDossierId = 'none'; // 再次点击关闭心声
        } else {
            wcActiveDossierId = id; // 切换激活
        }
        wcSaveDossierSettings();
        wcRenderDossierList();
    }
    window.wcToggleDossierActive = wcToggleDossierActive;

    function wcOpenEditDossier(id = null) {
        wcResetAllSwipes();
        wcCurrentEditDossierId = id;

        const overlay = document.getElementById('wc-dossier-edit-view');
        const nameInput = document.getElementById('wc-edit-dossier-name');
        const promptInput = document.getElementById('wc-edit-dossier-prompt');
        const regexInput = document.getElementById('wc-edit-dossier-regex');
        const htmlInput = document.getElementById('wc-edit-dossier-html');
        const titleEl = document.getElementById('wcDossierDrawerTitle');
        const saveBtnEl = document.getElementById('wcDossierSaveBtn');

        if (id) {
            if (titleEl) titleEl.innerText = '编辑心声模板';
            if (saveBtnEl) saveBtnEl.innerText = '保存';
            const item = wcCustomDossiersList.find(d => d.id === id);
            if (item) {
                if (nameInput) nameInput.value = item.name || '';
                if (promptInput) promptInput.value = item.prompt || '';
                if (regexInput) regexInput.value = item.regexPattern || '';
                if (htmlInput) htmlInput.value = item.htmlTemplate || '';
            }
        } else {
            if (titleEl) titleEl.innerText = 'New Dossier';
            if (saveBtnEl) saveBtnEl.innerText = '创建';
            if (nameInput) nameInput.value = '';
            if (promptInput) promptInput.value = '';
            if (regexInput) regexInput.value = '';
            if (htmlInput) htmlInput.value = '';
        }

        // 打开时清理旧的检测卡片（如果之前存在）
        const oldCheckCard = document.getElementById('wcDossierCheckCard');
        if (oldCheckCard) oldCheckCard.remove();

        if (overlay) {
            overlay.style.display = 'flex';
            requestAnimationFrame(() => {
                overlay.classList.add('show');
            });
        }

        // 高度自由度沙盒模式：不再强加任何输入拦截与语法约束
        [nameInput, promptInput, regexInput, htmlInput].forEach(el => {
            if (!el) return;
            el.oninput = null;
        });
    }
    window.wcOpenEditDossier = wcOpenEditDossier;

    function wcCloseEditDossier(event) {
        if (event && event.target !== document.getElementById('wc-dossier-edit-view')) return;
        const overlay = document.getElementById('wc-dossier-edit-view');
        if (!overlay) return;
        overlay.classList.remove('show');
        setTimeout(() => overlay.style.display = 'none', 300);
        wcCurrentEditDossierId = null;
    }
    window.wcCloseEditDossier = wcCloseEditDossier;

    function wcOpenDossierTutorial() {
        const overlay = document.getElementById('wcDossierTutorialOverlay');
        if (overlay) {
            overlay.style.display = 'flex';
            setTimeout(() => overlay.classList.add('show'), 10);
        }
    }
    window.wcOpenDossierTutorial = wcOpenDossierTutorial;

    function wcCloseDossierTutorial(event) {
        const overlay = document.getElementById('wcDossierTutorialOverlay');
        if (!overlay) return;
        if (event && event.target !== overlay) return;
        overlay.classList.remove('show');
        setTimeout(() => overlay.style.display = 'none', 300);
    }
    window.wcCloseDossierTutorial = wcCloseDossierTutorial;

    function wcApplyDossierPresetTemplate(type) {
        const promptInput = document.getElementById('wc-edit-dossier-prompt');
        const regexInput = document.getElementById('wc-edit-dossier-regex');
        const htmlInput = document.getElementById('wc-edit-dossier-html');

        if (type === 'classic') {
            if (promptInput) promptInput.value = '在消息末尾使用 <status>心理状态|心率|当前环境|平行时空推演</status> 标签简要输出此刻内心状态，字数尽量简短。';
            if (regexInput) regexInput.value = '<status>(.*?)\\|(.*?)\\|(.*?)\\|(.*?)</status>';
            if (htmlInput) htmlInput.value = '<div class="wc-vd-telemetry-grid"><div class="wc-vd-telemetry-card"><span class="wc-vd-telemetry-name">心理状态</span><span class="wc-vd-telemetry-val">{{1}}</span></div><div class="wc-vd-telemetry-card"><span class="wc-vd-telemetry-name">心率</span><span class="wc-vd-telemetry-val">{{2}}</span></div><div class="wc-vd-telemetry-card"><span class="wc-vd-telemetry-name">环境</span><span class="wc-vd-telemetry-val">{{3}}</span></div></div><div class="wc-vd-theater-container" style="margin-top:12px;"><div class="wc-vd-theater-header-row"><span class="wc-vd-theater-badge">Parallel Universe</span></div><p class="wc-vd-theater-script-body">{{4}}</p></div>';
        } else if (type === 'diary') {
            if (promptInput) promptInput.value = '在消息末尾使用 <mind>未发草稿|真实心声</mind> 标签简要输出此刻内心犹豫的内容。';
            if (regexInput) regexInput.value = '<mind>(.*?)\\|(.*?)</mind>';
            if (htmlInput) htmlInput.value = '<div class="wc-vd-voice-section"><div class="wc-vd-section-header"><span class="wc-vd-section-title">01 // Inner Monologue</span><span class="wc-vd-section-subtitle">{{time}}</span></div><div class="wc-vd-draft-box"><span class="wc-vd-draft-label">Unsent Draft</span><p class="wc-vd-draft-text">“{{1}}”</p></div><p class="wc-vd-monologue-core">{{2}}</p></div>';
        }

        wcCloseDossierTutorial();
        if (typeof showToast === 'function') showToast('已填入预设模板');
    }
    window.wcApplyDossierPresetTemplate = wcApplyDossierPresetTemplate;

    // 高自由度沙盒模式：彻底移除悬浮检测卡片与校验拦截
    function wcRenderDossierValidationUI() {
        const card = document.getElementById('wcDossierCheckCard');
        if (card) card.remove();
    }

    function wcRunDossierValidation() {
        wcRenderDossierValidationUI();
        return { valid: true, fatalErrorCount: 0, results: [] };
    }
    window.wcRunDossierValidation = wcRunDossierValidation;

    function wcSaveDossier() {
        const nameInput = document.getElementById('wc-edit-dossier-name');
        const promptInput = document.getElementById('wc-edit-dossier-prompt');
        const regexInput = document.getElementById('wc-edit-dossier-regex');
        const htmlInput = document.getElementById('wc-edit-dossier-html');

        const name = nameInput ? nameInput.value.trim() : '';
        const prompt = promptInput ? promptInput.value.trim() : '';
        let regexPattern = regexInput ? regexInput.value.trim() : '';
        const htmlTemplate = htmlInput ? htmlInput.value : '';

        if (!name) {
            if (typeof showToast === 'function') showToast('请输入心声模板名称');
            return;
        }

        // 自动清洗正则：去除首尾斜杠并修正转义星号（仅做温和格式化，绝不限制与阻拦保存）
        if (regexPattern.startsWith('/') && regexPattern.lastIndexOf('/') > 0) {
            regexPattern = regexPattern.slice(1, regexPattern.lastIndexOf('/'));
        }
        regexPattern = regexPattern.replace(/\\\*/g, '*');

        if (wcCurrentEditDossierId) {
            const item = wcCustomDossiersList.find(d => d.id === wcCurrentEditDossierId);
            if (item) {
                item.name = name;
                item.prompt = prompt;
                item.regexPattern = regexPattern;
                item.htmlTemplate = htmlTemplate;
            }
        } else {
            const newItem = {
                id: 'dossier_' + Date.now(),
                name: name,
                prompt: prompt,
                regexPattern: regexPattern,
                htmlTemplate: htmlTemplate
            };
            wcCustomDossiersList.push(newItem);
        }

        wcSaveDossierSettings();
        wcCloseEditDossier();
        wcRenderDossierList();
        showToast('自定义沙盒心声模板已保存');
    }
    window.wcSaveDossier = wcSaveDossier;

    async function wcExportSingleDossier(id) {
        wcResetAllSwipes();
        const item = wcCustomDossiersList.find(d => d.id === id);
        if (!item) return;

        let exportName = item.name || '心声状态栏';
        if (typeof showCustomPrompt === 'function') {
            const customName = await showCustomPrompt('导出心声状态栏', { placeholder: '请输入状态栏名称', value: exportName }, '导出');
            if (customName === null) return;
            if (customName.trim()) exportName = customName.trim();
        }

        const payload = {
            type: 'tonghuaji_dossier_template',
            version: '1.0',
            exportTime: Date.now(),
            data: {
                name: exportName,
                prompt: item.prompt || '',
                regexPattern: item.regexPattern || '',
                htmlTemplate: item.htmlTemplate || ''
            }
        };

        const jsonStr = JSON.stringify(payload, null, 2);
        const blob = new Blob([jsonStr], { type: 'application/json;charset=utf-8' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${exportName}.json`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        if (typeof showToast === 'function') showToast(`已导出：${exportName}`);
    }
    window.wcExportSingleDossier = wcExportSingleDossier;

    function wcTriggerImportDossierFile() {
        let input = document.getElementById('wcDossierFileInput');
        if (!input) {
            input = document.createElement('input');
            input.type = 'file';
            input.id = 'wcDossierFileInput';
            input.accept = '.json,.txt,.docx';
            input.style.display = 'none';
            input.onchange = wcHandleDossierImportFile;
            document.body.appendChild(input);
        }
        input.click();
    }
    window.wcTriggerImportDossierFile = wcTriggerImportDossierFile;

    async function wcHandleDossierImportFile(event) {
        const file = event.target.files?.[0];
        if (!file) return;
        const extension = file.name.split('.').pop()?.toLowerCase();
        try {
            let rawText = '';
            const buffer = await file.arrayBuffer();
            if (extension === 'docx') {
                rawText = wcDocxXmlToChatText(await wcReadChatDocxXml(buffer));
            } else {
                rawText = wcDecodeChatText(buffer);
            }

            let dossierName = file.name.replace(/\.[^/.]+$/, '');
            let promptText = '';
            let regexText = '';
            let htmlText = '';

            const trimmedText = rawText.trim();
            if (trimmedText.startsWith('{') && trimmedText.endsWith('}')) {
                try {
                    const parsed = JSON.parse(trimmedText);
                    const d = parsed.data || parsed;
                    dossierName = d.name || dossierName;
                    promptText = d.prompt || '';
                    regexText = d.regexPattern || d.regex || '';
                    htmlText = d.htmlTemplate || d.html || '';
                } catch(e) {}
            }

            if (!promptText && !regexText && !htmlText) {
                const promptMatch = rawText.match(/【?提示词】?\s*[:：]?\s*([^\n]+)/i);
                const regexMatch = rawText.match(/【?正则(?:表达式)?】?\s*[:：]?\s*([^\n]+)/i);
                const htmlMatch = rawText.match(/<div[\s\S]*<\/div>/i) || rawText.match(/【?HTML(?:模板)?】?\s*[:：]?\s*([\s\S]+)/i);

                if (promptMatch) promptText = promptMatch[1].trim();
                if (regexMatch) regexText = regexMatch[1].trim();
                if (htmlMatch) htmlText = htmlMatch[0] ? htmlMatch[0].trim() : (htmlMatch[1] ? htmlMatch[1].trim() : '');
                if (!htmlText) htmlText = rawText;
            }

            const newDossier = {
                id: 'dossier_' + Date.now(),
                name: dossierName,
                prompt: promptText,
                regexPattern: regexText,
                htmlTemplate: htmlText
            };

            wcCustomDossiersList.push(newDossier);
            wcActiveDossierId = newDossier.id;
            wcSaveDossierSettings();
            wcRenderDossierList();
            if (typeof showToast === 'function') showToast(`已导入并应用：${dossierName}`);
        } catch (error) {
            console.error('导入心声状态栏失败:', error);
            if (typeof showToast === 'function') showToast('导入失败，请检查文件格式');
        } finally {
            event.target.value = '';
        }
    }
    window.wcHandleDossierImportFile = wcHandleDossierImportFile;

    function wcDeleteDossier(id) {
        wcResetAllSwipes();
        showCustomConfirm('删除心声模板', '确定要删除这个自定义心声模板吗？', '删除', true).then(confirmed => {
            if (confirmed) {
                wcCustomDossiersList = wcCustomDossiersList.filter(d => d.id !== id);
                if (wcActiveDossierId === id) {
                    wcActiveDossierId = 'none';
                }
                wcSaveDossierSettings();
                wcRenderDossierList();
                showToast('已删除');
            }
        });
    }
    window.wcDeleteDossier = wcDeleteDossier;

    // ==========================================
    // 童话机提示词布局：语义槽、运行时功能与兼容迁移
    // ==========================================
    let wcActiveCustomPresetId = 'default_preset';
    let wcCustomPresetsList = [];
    let wcEditingPresetDraft = null;

    const WC_PROMPT_PRESET_SCHEMA_VERSION = 19;
    const WC_PROMPT_SLOT_REGISTRY = Object.freeze([
        // Identity and source-of-truth context.
        { id: 'wb_top', slotKey: 'lore_priority', name: '世界书 · 核心补充', enabled: true, type: 'worldbook', role: 'system', injection: { position: 'relative', depth: 0 } },
        { id: 'wb_before_persona', slotKey: 'lore_identity_lead', name: '世界书 · 身份前置', enabled: true, type: 'worldbook', role: 'system', injection: { position: 'relative', depth: 0 } },
        { id: 'char_identity', slotKey: 'character_profile', name: '角色档案', enabled: true, type: 'fixed', role: 'system', injection: { position: 'relative', depth: 0 } },
        { id: 'wb_after_persona', slotKey: 'lore_identity_tail', name: '世界书 · 身份补充', enabled: true, type: 'worldbook', role: 'system', injection: { position: 'relative', depth: 0 } },
        { id: 'user_profile', slotKey: 'user_profile', name: '用户档案', enabled: true, type: 'fixed', role: 'system', injection: { position: 'relative', depth: 0 } },
        { id: 'relationship', slotKey: 'relationship_fact', name: '关系事实', enabled: true, type: 'dynamic', role: 'system', injection: { position: 'relative', depth: 0 } },

        // Live state and memory.
        { id: 'social_context', slotKey: 'scene_context', name: '当前场景 · 动态环境', enabled: true, type: 'dynamic', role: 'system', injection: { position: 'relative', depth: 0 } },
        { id: 'current_state', slotKey: 'event_state', name: '当前场景 · 待续与变化', enabled: true, type: 'dynamic', role: 'system', injection: { position: 'relative', depth: 0 } },
        { id: 'time_awareness', slotKey: 'clock_context', name: '时间感知 · 当前时刻', enabled: true, customPrompt: '', type: 'prompt', role: 'system', injection: { position: 'relative', depth: 0 } },
        { id: 'memory_long', slotKey: 'memory_confirmed', name: '记忆 · 长期确认', enabled: true, type: 'dynamic', role: 'system', injection: { position: 'relative', depth: 0 } },
        { id: 'memory_recap', slotKey: 'memory_recent', name: '记忆 · 近期摘要', enabled: true, type: 'dynamic', role: 'system', injection: { position: 'relative', depth: 0 } },
        { id: 'memory_retrieval', slotKey: 'memory_relevant', name: '记忆 · 本轮相关', enabled: true, type: 'dynamic', role: 'system', injection: { position: 'relative', depth: 0 } },
        { id: 'wb_dynamic', slotKey: 'lore_dynamic', name: '世界书 · 本轮触发', enabled: true, type: 'worldbook', role: 'system', injection: { position: 'relative', depth: 0 } },

        // Creative layer. The selected chat prompt and thinking preset are resolved from the current contact.
        { id: 'core_prompt', slotKey: 'selected_chat_prompt', name: '创作层 · 当前聊天提示词', enabled: true, type: 'external', role: 'system', injection: { position: 'relative', depth: 0 } },
        { id: 'custom_prompt', slotKey: 'preset_instruction', name: '创作层 · 预设补充规则', enabled: true, customPrompt: '', type: 'prompt', role: 'system', injection: { position: 'relative', depth: 0 } },
        { id: 'runtime_mode', slotKey: 'turn_features', name: '创作层 · 本轮功能', enabled: true, type: 'dynamic', role: 'system', injection: { position: 'relative', depth: 0 } },
        { id: 'message_rhythm', slotKey: 'message_rhythm', name: '童话集 · 回复守则', enabled: true, type: 'fixed', role: 'system', injection: { position: 'relative', depth: 0 } },

        // Planning and client contract.
        { id: 'cot', slotKey: 'selected_thinking_prompt', name: '回复规划 · 当前思维链', enabled: true, type: 'external', role: 'system', injection: { position: 'relative', depth: 0 } },
        { id: 'dossier', slotKey: 'inner_dossier', name: '协议层 · 心声档案', enabled: true, type: 'external', role: 'system', injection: { position: 'relative', depth: 0 } },
        { id: 'reply_format', slotKey: 'client_contract', name: '协议层 · 客户端输出', enabled: true, type: 'fixed', role: 'system', injection: { position: 'relative', depth: 0 } },

        // Conversation boundary and deep lore.
        { id: 'chat_history', slotKey: 'conversation_boundary', name: '聊天历史', enabled: true, type: 'context', role: 'system', injection: { position: 'relative', depth: 0 } },
        { id: 'proactive_prompt', slotKey: 'temporal_turn', name: '本轮联系 · 时间与回归', enabled: true, customPrompt: '', type: 'prompt', role: 'system', injection: { position: 'relative', depth: 0 } },
        { id: 'wb_depth', slotKey: 'lore_depth', name: '世界书 · 历史深度', enabled: true, type: 'worldbook', role: 'system', injection: { position: 'relative', depth: 0 } },
        { id: 'wb_bottom', slotKey: 'lore_post_history', name: '世界书 · 历史后', enabled: true, type: 'worldbook', role: 'system', injection: { position: 'relative', depth: 0 } }
    ]);

    const WC_PROMPT_RUNTIME_BLOCKS = Object.freeze([
        { id: 'online_narration', name: '本轮功能 · 线上旁白', enabled: true, customPrompt: '', type: 'prompt', role: 'system', runtimeOptional: true },
        { id: 'long_distance', name: '本轮功能 · 异地关系', enabled: true, customPrompt: '', type: 'prompt', role: 'system', runtimeOptional: true },
        { id: 'time_gap', name: '本轮功能 · 时间跨度', enabled: true, customPrompt: '', type: 'prompt', role: 'system', runtimeOptional: true },
    ]);

    function wcClonePromptSlot(block) {
        return {
            ...block,
            ...(block?.injection ? { injection: { ...block.injection } } : {})
        };
    }

    function wcGetPromptSlotBlock(slotId) {
        const slot = WC_PROMPT_SLOT_REGISTRY.find(item => item.id === slotId);
        return slot ? wcClonePromptSlot(slot) : null;
    }

    function wcGetPromptSlotIds() {
        return WC_PROMPT_SLOT_REGISTRY.map(item => item.id);
    }
    window.wcGetPromptSlotIds = wcGetPromptSlotIds;
    // Compatibility aliases for presets/settings saved by earlier Tonghuaji builds.
    window.wcGetRequiredPresetMarkerIds = wcGetPromptSlotIds;

    function wcNormalizePresetRole(role, fallback = 'system') {
        return ['system', 'user', 'assistant'].includes(role) ? role : fallback;
    }

    function wcNormalizePresetInjection(injection, fallback = { position: 'relative', depth: 0 }) {
        const source = injection && typeof injection === 'object' ? injection : {};
        const position = source.position === 'depth' ? 'depth' : 'relative';
        const rawDepth = Number(source.depth);
        return {
            position,
            depth: Math.min(99, Math.max(0, Math.floor(Number.isFinite(rawDepth) ? rawDepth : Number(fallback?.depth) || 0)))
        };
    }

    function wcNormalizeUserCustomPresetBlock(rawBlock) {
        if (!rawBlock || typeof rawBlock !== 'object' || !rawBlock.id) return null;
        return {
            id: String(rawBlock.id),
            name: String(rawBlock.name || '自定义块').slice(0, 100),
            enabled: rawBlock.enabled !== false,
            type: 'custom',
            content: String(rawBlock.content ?? rawBlock.customPrompt ?? ''),
            role: wcNormalizePresetRole(rawBlock.role, 'system'),
            injection: wcNormalizePresetInjection(rawBlock.injection)
        };
    }

    function wcGetPortablePresetBlocks() {
        // Compatibility alias: v12 presets are full prompt layouts again.
        return wcGetDefaultPresetBlocks();
    }

    function wcNormalizePromptLayout(preset) {
        if (!preset || typeof preset !== 'object') return wcGetDefaultPresetObject();
        if (preset.id === 'default_preset' || preset.isBuiltin === true) {
            return {
                ...preset,
                id: 'default_preset',
                name: preset.name || '童话机标准预设',
                isBuiltin: true,
                schemaVersion: WC_PROMPT_PRESET_SCHEMA_VERSION,
                inheritCorePrompt: true,
                inheritCot: true,
                blocks: wcGetDefaultPresetBlocks()
            };
        }

        const incomingSchemaVersion = Number(preset.schemaVersion);
        // Core prompt and CoT slots bind directly to the current contact selection.
        // Normalize legacy flags so old presets cannot silently hide an active selection.
        const inheritCorePrompt = true;
        const inheritCot = true;
        const incomingBlocks = Array.isArray(preset.blocks) ? preset.blocks : [];
        const runtimeById = new Map(WC_PROMPT_RUNTIME_BLOCKS.map(block => [block.id, block]));

        const normalizeSlotBlock = (rawBlock, slotDefinition) => {
            const normalized = {
                ...wcClonePromptSlot(slotDefinition),
                ...rawBlock,
                id: slotDefinition.id,
                slotKey: slotDefinition.slotKey,
                name: String(rawBlock?.name || slotDefinition.name || slotDefinition.id).slice(0, 100),
                // Only externally selected prompt/thinking sources are selection-bound.
                // Time awareness, dossier and runtime feature slots preserve the user's preset switch.
                enabled: ['core_prompt', 'cot'].includes(slotDefinition.id)
                    ? true
                    : rawBlock?.enabled !== false,
                type: slotDefinition.type,
                // Standard semantic slots always keep their transport-safe system/context role.
                // Presets remain free to reorder and toggle them without silently changing API topology.
                role: slotDefinition.role,
                injection: wcNormalizePresetInjection(slotDefinition.injection, slotDefinition.injection)
            };
            if (slotDefinition.type === 'prompt') {
                normalized.customPrompt = typeof rawBlock?.customPrompt === 'string'
                    ? rawBlock.customPrompt
                    : String(slotDefinition.customPrompt || '');
            } else {
                delete normalized.customPrompt;
            }
            delete normalized.markerKey;
            delete normalized.runtimeOptional;
            return normalized;
        };

        const normalizeRuntimeBlock = (rawBlock, definition) => ({
            ...wcClonePromptSlot(definition),
            ...rawBlock,
            id: definition.id,
            name: String(rawBlock?.name || definition.name || definition.id).slice(0, 100),
            enabled: rawBlock?.enabled !== false,
            type: definition.type,
            role: definition.role,
            injection: wcNormalizePresetInjection(definition.injection, definition.injection),
            customPrompt: typeof rawBlock?.customPrompt === 'string'
                ? rawBlock.customPrompt
                : String(definition.customPrompt || ''),
            runtimeOptional: true
        });

        // v11 intentionally stored only portable prompt fields. Rehydrate it into a full
        // layout without losing the user's custom behavior blocks.
        if (incomingSchemaVersion === 11) {
            const blocks = wcGetDefaultPresetBlocks();
            const customBlocks = [];
            const explicitRuntimeBlocks = [];

            incomingBlocks.forEach(rawBlock => {
                if (!rawBlock || typeof rawBlock !== 'object' || !rawBlock.id) return;
                const slotDefinition = wcGetPromptSlotBlock(rawBlock.id);
                if (slotDefinition) {
                    const targetIndex = blocks.findIndex(item => item.id === rawBlock.id);
                    if (targetIndex >= 0) blocks[targetIndex] = normalizeSlotBlock(rawBlock, slotDefinition);
                    return;
                }
                const runtimeDefinition = runtimeById.get(rawBlock.id);
                if (runtimeDefinition) {
                    explicitRuntimeBlocks.push(normalizeRuntimeBlock(rawBlock, runtimeDefinition));
                    return;
                }
                if (rawBlock.type === 'custom') {
                    const customBlock = wcNormalizeUserCustomPresetBlock(rawBlock);
                    if (customBlock) customBlocks.push(customBlock);
                }
            });

            const behaviorAnchorIndex = blocks.findIndex(block => block.id === 'runtime_mode');
            blocks.splice(
                behaviorAnchorIndex >= 0 ? behaviorAnchorIndex : blocks.length,
                0,
                ...customBlocks,
                ...explicitRuntimeBlocks
            );

            return {
                ...preset,
                isBuiltin: false,
                schemaVersion: WC_PROMPT_PRESET_SCHEMA_VERSION,
                inheritCorePrompt,
                inheritCot,
                blocks
            };
        }

        const blocks = [];
        const seenIds = new Set();
        const appendSlotById = (slotId, rawBlock = {}) => {
            if (seenIds.has(slotId)) return;
            const slotDefinition = wcGetPromptSlotBlock(slotId);
            if (!slotDefinition) return;
            seenIds.add(slotId);
            blocks.push(normalizeSlotBlock(rawBlock, slotDefinition));
        };

        incomingBlocks.forEach(rawBlock => {
            if (!rawBlock || typeof rawBlock !== 'object' || !rawBlock.id) return;
            const block = wcClonePromptSlot(rawBlock);
            if (!block.slotKey && block.markerKey) block.slotKey = String(block.markerKey);
            delete block.markerKey;

            // Migrate older coarse blocks while preserving their place in the layout.
            if (block.id === 'persona') {
                ['char_identity', 'relationship', 'user_profile'].forEach(id => appendSlotById(id, block));
                return;
            }
            if (block.id === 'memory_summary') {
                ['memory_long', 'memory_recap', 'memory_retrieval'].forEach(id => appendSlotById(id, block));
                return;
            }

            const slotDefinition = wcGetPromptSlotBlock(block.id);
            if (slotDefinition) {
                if (seenIds.has(block.id)) return;
                seenIds.add(block.id);
                blocks.push(normalizeSlotBlock(block, slotDefinition));
                return;
            }

            const runtimeDefinition = runtimeById.get(block.id);
            if (runtimeDefinition) {
                if (seenIds.has(block.id)) return;
                seenIds.add(block.id);
                blocks.push(normalizeRuntimeBlock(block, runtimeDefinition));
                return;
            }

            if (block.type !== 'custom' || seenIds.has(block.id)) return;
            const customBlock = wcNormalizeUserCustomPresetBlock(block);
            if (!customBlock) return;
            seenIds.add(customBlock.id);
            blocks.push(customBlock);
        });

        if (blocks.length === 0) {
            blocks.push(...wcGetDefaultPresetBlocks());
            wcGetPromptSlotIds().forEach(id => seenIds.add(id));
        }

        // Missing versioned semantic slots are restored beside their standard neighbours,
        // while every existing user-controlled block keeps its relative position.
        WC_PROMPT_SLOT_REGISTRY.forEach((slot, slotIndex) => {
            if (seenIds.has(slot.id)) return;

            let insertIndex = blocks.length;
            for (let nextIndex = slotIndex + 1; nextIndex < WC_PROMPT_SLOT_REGISTRY.length; nextIndex += 1) {
                const nextId = WC_PROMPT_SLOT_REGISTRY[nextIndex].id;
                const existingNextIndex = blocks.findIndex(block => block.id === nextId);
                if (existingNextIndex >= 0) {
                    insertIndex = existingNextIndex;
                    break;
                }
            }
            if (insertIndex === blocks.length) {
                for (let prevIndex = slotIndex - 1; prevIndex >= 0; prevIndex -= 1) {
                    const prevId = WC_PROMPT_SLOT_REGISTRY[prevIndex].id;
                    const existingPrevIndex = blocks.findIndex(block => block.id === prevId);
                    if (existingPrevIndex >= 0) {
                        insertIndex = existingPrevIndex + 1;
                        break;
                    }
                }
            }

            blocks.splice(insertIndex, 0, wcClonePromptSlot(slot));
            seenIds.add(slot.id);
        });

        // Migrate the old proactive runtime block to the user-return boundary once.
        if (!Number.isFinite(incomingSchemaVersion) || incomingSchemaVersion < 19) {
            const temporalIndex = blocks.findIndex(block => block.id === 'proactive_prompt');
            const historyIndex = blocks.findIndex(block => block.id === 'chat_history');
            if (temporalIndex >= 0 && historyIndex >= 0 && temporalIndex < historyIndex) {
                const [temporalBlock] = blocks.splice(temporalIndex, 1);
                blocks.splice(blocks.findIndex(block => block.id === 'chat_history') + 1, 0, temporalBlock);
            }
        }

        // Standard semantic slots keep the user's saved enabled state and relative order.
        // Transport safety is handled by a tiny runtime FrameBus guard instead of pinning reply_format.

        return {
            ...preset,
            isBuiltin: false,
            schemaVersion: WC_PROMPT_PRESET_SCHEMA_VERSION,
            inheritCorePrompt,
            inheritCot,
            blocks
        };
    }
    window.wcNormalizePromptLayout = wcNormalizePromptLayout;
    window.wcNormalizePromptPreset = wcNormalizePromptLayout;

    function wcBuildPromptLayout(preset) {
        // The preset itself is the layout. Runtime code only resolves each slot's live content;
        // it must not rebuild the user's order back into the default order.
        return wcNormalizePromptLayout(preset);
    }
    window.wcBuildPromptLayout = wcBuildPromptLayout;

    function wcGetDefaultPresetBlocks() {
        // The built-in layout exposes only stable Tonghuaji semantic slots.
        // Per-turn features are folded into turn_features while the request is assembled.
        return WC_PROMPT_SLOT_REGISTRY.map(wcClonePromptSlot);
    }

    function wcGetDefaultPresetObject() {
        return {
            id: "default_preset",
            name: "童话机标准预设",
            isBuiltin: true,
            schemaVersion: WC_PROMPT_PRESET_SCHEMA_VERSION,
            inheritCorePrompt: true,
            inheritCot: true,
            blocks: wcGetDefaultPresetBlocks()
        };
    }

    function wcIsRemovedLegacyTestPreset2(preset) {
        if (!preset) return false;
        const normalizedName = String(preset.name || '')
            .normalize('NFKC')
            .replace(/[\s·•・.。:：_—–-]+/g, '')
            .toLowerCase();
        return normalizedName.startsWith('童话集测试方案2直连聊天框')
            || normalizedName.startsWith('童话集测试方案2直连');
    }

    function wcRemoveLegacyTestPreset2() {
        const removedIds = new Set();
        if (typeof appSettings === 'undefined' || !Array.isArray(appSettings.wc_custom_presets_list)) {
            return removedIds;
        }

        const originalList = appSettings.wc_custom_presets_list;
        const cleanedList = originalList.filter(preset => {
            const shouldRemove = wcIsRemovedLegacyTestPreset2(preset);
            if (shouldRemove && preset.id && preset.id !== 'default_preset') {
                removedIds.add(String(preset.id));
            }
            return !shouldRemove;
        });

        if (cleanedList.length === originalList.length) return removedIds;

        // Migrate every active reference to the built-in default before persisting the deletion.
        appSettings.wc_custom_presets_list = cleanedList;
        if (removedIds.has(String(appSettings.wc_active_custom_preset_id || ''))) {
            appSettings.wc_active_custom_preset_id = 'default_preset';
        }

        let contactsChanged = false;
        if (typeof wcContactsList !== 'undefined' && Array.isArray(wcContactsList)) {
            wcContactsList.forEach(contact => {
                if (removedIds.has(String(contact?.activeCustomPresetId || ''))) {
                    contact.activeCustomPresetId = 'default_preset';
                    contactsChanged = true;
                }
            });
        }

        if (contactsChanged && typeof wcSaveContactsDataAsync === 'function') {
            void wcSaveContactsDataAsync().catch(error => console.warn('Unable to persist preset migration for contacts:', error));
        }
        if (typeof saveAppSettings === 'function') {
            saveAppSettings();
        }
        return removedIds;
    }

    function wcLoadCustomPresetSettings() {
        const removedLegacyPresetIds = wcRemoveLegacyTestPreset2();
        if (typeof appSettings !== 'undefined') {
            wcCustomPresetsList = Array.isArray(appSettings.wc_custom_presets_list) ? appSettings.wc_custom_presets_list : [];
        }
        const contact = (typeof wcContactsList !== 'undefined' && typeof wcCurrentChatContactId !== 'undefined')
            ? wcContactsList.find(c => c.id === wcCurrentChatContactId)
            : null;
        if (contact && contact.activeCustomPresetId) {
            wcActiveCustomPresetId = contact.activeCustomPresetId;
        } else if (typeof appSettings !== 'undefined') {
            wcActiveCustomPresetId = appSettings.wc_active_custom_preset_id || 'default_preset';
        }

        const activePresetWasRemoved = removedLegacyPresetIds.has(String(wcActiveCustomPresetId || ''));
        const activePresetStillExists = wcCustomPresetsList.some(preset => String(preset?.id || '') === String(wcActiveCustomPresetId || ''));
        if (activePresetWasRemoved || (wcActiveCustomPresetId !== 'default_preset' && !activePresetStillExists)) {
            wcActiveCustomPresetId = 'default_preset';
            if (contact) {
                contact.activeCustomPresetId = 'default_preset';
                if (typeof wcSaveContactsDataAsync === 'function') {
                    void wcSaveContactsDataAsync().catch(error => console.warn('Unable to persist active preset migration:', error));
                }
            } else if (typeof appSettings !== 'undefined') {
                appSettings.wc_active_custom_preset_id = 'default_preset';
                if (typeof saveAppSettings === 'function') saveAppSettings();
            }
        }

        if (!wcCustomPresetsList.some(p => p.id === 'default_preset')) {
            wcCustomPresetsList.unshift(wcGetDefaultPresetObject());
        }

        wcCustomPresetsList = wcCustomPresetsList.map(preset => wcNormalizePromptLayout(preset));

        // 默认预设不可编辑，每次加载都恢复为当前标准锚点顺序，避免旧版本把 chat_history 留在最末尾。
        const builtinDefaultPreset = wcCustomPresetsList.find(p => p.id === 'default_preset');
        if (builtinDefaultPreset) {
            builtinDefaultPreset.name = builtinDefaultPreset.name || '童话机标准预设';
            builtinDefaultPreset.isBuiltin = true;
            builtinDefaultPreset.blocks = wcGetDefaultPresetBlocks();
        }

        // 童话机语义槽会按版本自动迁移；本轮功能块始终由用户配置控制。

    }
    window.wcLoadCustomPresetSettings = wcLoadCustomPresetSettings;

    function wcSaveCustomPresetSettings() {
        const contact = (typeof wcContactsList !== 'undefined' && typeof wcCurrentChatContactId !== 'undefined')
            ? wcContactsList.find(c => c.id === wcCurrentChatContactId)
            : null;
        if (contact) {
            contact.activeCustomPresetId = wcActiveCustomPresetId;
            if (typeof wcSaveContactsDataAsync === 'function') wcSaveContactsDataAsync();
        }
        if (typeof appSettings !== 'undefined') {
            if (!contact) appSettings.wc_active_custom_preset_id = wcActiveCustomPresetId;
            appSettings.wc_custom_presets_list = wcCustomPresetsList;
            if (typeof saveAppSettings === 'function') saveAppSettings();
        }
    }
    window.wcSaveCustomPresetSettings = wcSaveCustomPresetSettings;

    function wcTriggerCustomPresetImport() {
        const input = document.getElementById('wcCustomPresetImportInput');
        if (input) input.click();
    }
    window.wcTriggerCustomPresetImport = wcTriggerCustomPresetImport;

    function wcValidateTonghuajiPresetImport(rawPreset) {
        const fail = (message) => ({ valid: false, message });
        if (!rawPreset || typeof rawPreset !== 'object' || Array.isArray(rawPreset)) {
            return fail('文件内容不是童话机预设对象');
        }

        const allowedTopKeys = new Set([
            'id',
            'name',
            'isBuiltin',
            'schemaVersion',
            'inheritCorePrompt',
            'inheritCot',
            'blocks'
        ]);
        if (Object.keys(rawPreset).some(key => !allowedTopKeys.has(key))) {
            return fail('文件包含非童话机预设字段');
        }

        const schemaVersion = Number(rawPreset.schemaVersion);
        if (!Number.isInteger(schemaVersion) || schemaVersion < 10 || schemaVersion > WC_PROMPT_PRESET_SCHEMA_VERSION) {
            return fail(`仅支持童话机预设格式 v10–v${WC_PROMPT_PRESET_SCHEMA_VERSION}`);
        }
        if (rawPreset.isBuiltin !== false || rawPreset.id === 'default_preset') {
            return fail('不允许导入或覆盖童话机内置预设');
        }
        if (typeof rawPreset.id !== 'string' || !/^preset_[a-zA-Z0-9_-]+$/.test(rawPreset.id)) {
            return fail('预设 ID 不符合童话机格式');
        }
        if (typeof rawPreset.name !== 'string' || !rawPreset.name.trim() || rawPreset.name.trim().length > 80) {
            return fail('预设名称不符合童话机格式');
        }
        if (Object.prototype.hasOwnProperty.call(rawPreset, 'inheritCorePrompt') && typeof rawPreset.inheritCorePrompt !== 'boolean') {
            return fail('核心提示词继承配置无效');
        }
        if (Object.prototype.hasOwnProperty.call(rawPreset, 'inheritCot') && typeof rawPreset.inheritCot !== 'boolean') {
            return fail('思维链继承配置无效');
        }
        if (!Array.isArray(rawPreset.blocks) || rawPreset.blocks.length > 120) {
            return fail('预设模块列表不符合童话机格式');
        }

        const slotById = new Map(WC_PROMPT_SLOT_REGISTRY.map(slot => [slot.id, slot]));
        const runtimeById = new Map(WC_PROMPT_RUNTIME_BLOCKS.map(block => [block.id, block]));
        const seenIds = new Set();

        for (const block of rawPreset.blocks) {
            if (!block || typeof block !== 'object' || Array.isArray(block)) {
                return fail('预设中存在无效模块');
            }

            const allowedBlockKeys = new Set([
                'id',
                'slotKey',
                'markerKey',
                'name',
                'enabled',
                'customPrompt',
                'content',
                'type',
                'role',
                'injection',
                'runtimeOptional'
            ]);
            if (Object.keys(block).some(key => !allowedBlockKeys.has(key))) {
                return fail('预设中存在非童话机模块字段');
            }
            if (typeof block.id !== 'string' || !/^[a-zA-Z0-9_-]+$/.test(block.id) || seenIds.has(block.id)) {
                return fail('预设模块 ID 缺失、重复或格式无效');
            }
            seenIds.add(block.id);

            if (typeof block.name !== 'string' || !block.name.trim() || block.name.length > 100) {
                return fail(`模块 ${block.id} 的名称无效`);
            }
            if (typeof block.enabled !== 'boolean') {
                return fail(`模块 ${block.id} 的启用状态无效`);
            }
            if (!['system', 'user', 'assistant'].includes(block.role)) {
                return fail(`模块 ${block.id} 的角色类型无效`);
            }
            if (!block.injection || typeof block.injection !== 'object' || Array.isArray(block.injection)) {
                return fail(`模块 ${block.id} 的注入配置无效`);
            }
            if (Object.keys(block.injection).some(key => !['position', 'depth'].includes(key))) {
                return fail(`模块 ${block.id} 的注入配置包含未知字段`);
            }
            if (!['relative', 'depth'].includes(block.injection.position)) {
                return fail(`模块 ${block.id} 的注入位置无效`);
            }
            const depth = Number(block.injection.depth);
            if (!Number.isInteger(depth) || depth < 0 || depth > 99) {
                return fail(`模块 ${block.id} 的注入深度无效`);
            }

            const slot = slotById.get(block.id);
            if (slot) {
                const incomingSlotKey = block.slotKey || block.markerKey || '';
                if (incomingSlotKey && incomingSlotKey !== slot.slotKey) {
                    return fail(`系统槽位 ${block.id} 与童话机当前结构不匹配`);
                }
                if (block.type !== slot.type) {
                    return fail(`系统槽位 ${block.id} 的类型无效`);
                }
                if (schemaVersion >= 13 && block.role !== slot.role) {
                    return fail(`系统槽位 ${block.id} 必须保持稳定 Role`);
                }
                if (schemaVersion >= 13 && block.injection.position !== 'relative') {
                    return fail(`系统槽位 ${block.id} 不支持直接 Depth 注入`);
                }
                if (slot.type === 'prompt' && Object.prototype.hasOwnProperty.call(block, 'customPrompt')) {
                    if (typeof block.customPrompt !== 'string' || block.customPrompt.length > 120000) {
                        return fail(`提示词槽 ${block.id} 的内容无效`);
                    }
                }
                continue;
            }

            const runtimeBlock = runtimeById.get(block.id);
            if (runtimeBlock) {
                if (block.type !== runtimeBlock.type) {
                    return fail(`运行时模块 ${block.id} 的类型无效`);
                }
                if (schemaVersion >= 13 && block.role !== runtimeBlock.role) {
                    return fail(`运行时模块 ${block.id} 必须保持稳定 Role`);
                }
                if (schemaVersion >= 13 && block.injection.position !== 'relative') {
                    return fail(`运行时模块 ${block.id} 不支持直接 Depth 注入`);
                }
                if (Object.prototype.hasOwnProperty.call(block, 'customPrompt')
                    && (typeof block.customPrompt !== 'string' || block.customPrompt.length > 120000)) {
                    return fail(`运行时模块 ${block.id} 的提示词无效`);
                }
                continue;
            }

            if (block.type !== 'custom') {
                return fail(`发现未知的非童话机模块：${block.id}`);
            }
            if (Object.prototype.hasOwnProperty.call(block, 'slotKey') || Object.prototype.hasOwnProperty.call(block, 'markerKey')) {
                return fail(`自定义模块 ${block.id} 不应声明系统槽位`);
            }
            const customContent = Object.prototype.hasOwnProperty.call(block, 'content') ? block.content : block.customPrompt;
            if (typeof customContent !== 'string' || customContent.length > 120000) {
                return fail(`自定义模块 ${block.id} 的内容无效`);
            }
        }

        return { valid: true, message: '' };
    }
    window.wcValidateTonghuajiPresetImport = wcValidateTonghuajiPresetImport;

    async function wcHandleCustomPresetImportFile(event) {
        const input = event?.target;
        const file = input?.files?.[0];
        if (!file) return;

        try {
            if (file.size > 2 * 1024 * 1024) {
                throw new Error('预设文件过大，无法导入');
            }

            const rawText = await file.text();
            let rawPreset = null;
            try {
                rawPreset = JSON.parse(rawText);
            } catch (error) {
                throw new Error('文件不是有效的 JSON');
            }

            const validation = wcValidateTonghuajiPresetImport(rawPreset);
            if (!validation.valid) {
                throw new Error(validation.message || '不是有效的童话机预设');
            }

            wcLoadCustomPresetSettings();

            const importedPreset = wcNormalizePromptLayout({
                ...rawPreset,
                id: 'preset_import_' + Date.now().toString(36),
                name: rawPreset.name.trim(),
                isBuiltin: false,
                blocks: rawPreset.blocks.map(block => ({
                    ...block,
                    ...(block.injection ? { injection: { ...block.injection } } : {})
                }))
            });

            importedPreset.blocks.forEach(block => {
                delete block._expanded;
            });

            wcCustomPresetsList.push(importedPreset);
            wcActiveCustomPresetId = importedPreset.id;
            wcSaveCustomPresetSettings();
            wcRenderCustomPresetList();

            if (typeof showToast === 'function') {
                showToast(`已导入并应用：${importedPreset.name}`);
            }
        } catch (error) {
            console.error('Import Tonghuaji prompt preset failed:', error);
            const message = error?.message || '仅支持童话机格式的预设 JSON';
            if (typeof showCustomAlert === 'function') {
                showCustomAlert('导入失败', message);
            } else if (typeof showToast === 'function') {
                showToast(message);
            }
        } finally {
            if (input) input.value = '';
        }
    }
    window.wcHandleCustomPresetImportFile = wcHandleCustomPresetImportFile;

    function wcShowCustomPresetSettings() {
        wcLoadCustomPresetSettings();
        const mainView = document.getElementById('wc-main-settings-view');
        const presetListView = document.getElementById('wc-custom-preset-list-view');
        const title = document.getElementById('wc-settings-modal-title');
        if (mainView) mainView.style.display = 'none';
        if (presetListView) presetListView.style.display = 'flex';
        if (title) title.innerText = '自定义预设';
        wcRenderCustomPresetList();
    }
    window.wcShowCustomPresetSettings = wcShowCustomPresetSettings;

    function wcRenderCustomPresetList() {
        const container = document.getElementById('wc-custom-preset-list-container');
        if (!container) return;
        wcLoadCustomPresetSettings();

        // 用户指定的专属预设书籍矢量图标
        const presetIconSvg = `
            <svg viewBox="0 0 1139 1024" width="28" height="28" fill="currentColor">
                <path d="M1137.881907 893.575965a94.34336 94.34336 0 0 1-14.151504 67.92722 79.248422 79.248422 0 0 1-54.719149 36.79391l-137.741306 24.529274a73.587821 73.587821 0 0 1-60.37975-16.038372 94.34336 94.34336 0 0 1-33.96361-63.210051L719.940822 134.111917a113.212032 113.212032 0 0 1 0-35.850477A104.72113 104.72113 0 0 1 735.035759 66.184697 70.75752 70.75752 0 0 1 754.847865 42.598857a76.418122 76.418122 0 0 1 34.907043-13.20807L925.609347 5.804947a70.75752 70.75752 0 0 1 62.266617 16.038371 94.34336 94.34336 0 0 1 33.020176 60.379751zM566.161145 0.144345a73.587821 73.587821 0 0 1 57.549449 26.416141 94.34336 94.34336 0 0 1 20.75554 67.927219v836.825604a87.739325 87.739325 0 0 1-24.529274 64.153485 74.531254 74.531254 0 0 1-57.54945 27.359575H443.514777a73.587821 73.587821 0 0 1-58.492884-27.359575 94.34336 94.34336 0 0 1-24.529273-64.153485V94.487705A104.72113 104.72113 0 0 1 377.474425 26.560486 61.323184 61.323184 0 0 1 432.193573 0.144345z m0 634.930814a23.58584 23.58584 0 0 0 18.868672-12.264637 51.888848 51.888848 0 0 0 8.490902-28.303008 52.832282 52.832282 0 0 0-12.264637-28.303008 22.642406 22.642406 0 0 0-15.094937-12.264637H443.514777a22.642406 22.642406 0 0 0-19.812106 12.264637 52.832282 52.832282 0 0 0-8.490902 29.246441 51.888848 51.888848 0 0 0 8.490902 28.303008 23.58584 23.58584 0 0 0 19.812106 12.264637zM566.161145 471.861146a21.698973 21.698973 0 0 0 18.868672-12.264637 52.832282 52.832282 0 0 0 8.490902-29.246442 55.662582 55.662582 0 0 0-8.490902-29.246441 25.472707 25.472707 0 0 0-18.868672-8.490903H443.514777a25.472707 25.472707 0 0 0-19.812106 11.321203 55.662582 55.662582 0 0 0-8.490902 29.246442 52.832282 52.832282 0 0 0 8.490902 29.246442 21.698973 21.698973 0 0 0 19.812106 9.434336zM202.939209 0.144345a75.474688 75.474688 0 0 1 58.492883 26.416141A87.739325 87.739325 0 0 1 283.131065 94.487705v836.825604a84.909024 84.909024 0 0 1-24.529274 64.153485 76.418122 76.418122 0 0 1-58.492883 27.359575H84.066575a80.191856 80.191856 0 0 1-59.436317-27.359575A94.34336 94.34336 0 0 1 0.100984 931.313309V94.487705A94.34336 94.34336 0 0 1 24.630258 26.560486 79.248422 79.248422 0 0 1 84.066575 0.144345zM87.840309 315.251168a22.642406 22.642406 0 0 0-19.812105 11.321203 56.606016 56.606016 0 0 0 0 57.54945 22.642406 22.642406 0 0 0 19.812105 11.321203H198.22204a22.642406 22.642406 0 0 0 19.812106-11.321203 62.266618 62.266618 0 0 0 0-57.54945 20.755539 20.755539 0 0 0-19.812106-11.321203z m115.0989 395.298679a24.529274 24.529274 0 0 0 19.812105-11.321203 57.54945 57.54945 0 0 0 7.547469-28.303008 50.945414 50.945414 0 0 0-7.547469-28.303009 22.642406 22.642406 0 0 0-19.812105-10.377769H87.840309a24.529274 24.529274 0 0 0-19.812105 10.377769 53.775715 53.775715 0 0 0 0 55.662583 22.642406 22.642406 0 0 0 19.812105 12.264637z m0-154.723111a22.642406 22.642406 0 0 0 19.812105-12.264637 62.266618 62.266618 0 0 0 0-57.549449 24.529274 24.529274 0 0 0-19.812105-14.151504H87.840309a24.529274 24.529274 0 0 0-19.812105 11.321203 56.606016 56.606016 0 0 0 0 57.54945 22.642406 22.642406 0 0 0 19.812105 12.264636z"></path>
            </svg>
        `;

        let html = '';
        wcCustomPresetsList.forEach(preset => {
            const isActive = wcActiveCustomPresetId === preset.id ? 'active' : '';
            const isBuiltin = preset.id === 'default_preset' || preset.isBuiltin;
            const layoutCount = Array.isArray(preset.blocks) ? preset.blocks.length : 0;
            const subtitle = isBuiltin ? '默认预设' : `包含 ${layoutCount} 个模块排版`;

            // 默认预设不可编辑：点击直接激活或提示
            const onInfoClick = isBuiltin
                ? `wcToggleCustomPresetActive('${preset.id}', event)`
                : `wcOpenEditCustomPresetModal('${preset.id}')`;

            html += `
                <div class="preset-item-wrapper">
                    <div class="preset-item-content" ${isBuiltin ? '' : 'ontouchstart="wcHandleTouchStart(event)" ontouchmove="wcHandleTouchMove(event)" ontouchend="wcHandleTouchEnd(event)"'}>
                        <div class="preset-icon" style="color: #8E8E93 !important;">
                            ${presetIconSvg}
                        </div>
                        <div class="preset-info" style="flex: 1;" onclick="${onInfoClick}">
                            <div class="preset-title">${preset.name}</div>
                            <div class="preset-author">${subtitle}</div>
                        </div>
                        <div class="custom-toggle ${isActive}" onclick="wcToggleCustomPresetActive('${preset.id}', event)" ontouchstart="event.stopPropagation()">
                            <div class="thumb">
                                <svg viewBox="0 0 24 24"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/></svg>
                            </div>
                        </div>
                    </div>
                    ${isBuiltin ? '' : `
                    <div class="preset-item-actions" style="display: flex; align-items: center; gap: 8px; padding-right: 8px;">
                        <div class="action-capsule" onclick="wcOpenEditCustomPresetModal('${preset.id}')" title="编辑预设" style="width: 44px; height: 44px; padding: 0 !important; border-radius: 14px; background: rgba(0, 122, 255, 0.12); color: #007aff; display: flex; align-items: center; justify-content: center; cursor: pointer;">
                            <svg t="1789622386706" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="4734" style="width: 23px !important; height: 23px !important; min-width: 23px !important; min-height: 23px !important; display: block;"><path d="M943.104 216.064q-8.192 9.216-15.36 16.384l-12.288 12.288q-6.144 6.144-11.264 10.24l-138.24-139.264q8.192-8.192 20.48-19.456t20.48-17.408q20.48-16.384 44.032-14.336t37.888 9.216q15.36 8.192 34.304 28.672t29.184 43.008q5.12 14.336 6.656 33.792t-15.872 36.864zM551.936 329.728l158.72-158.72 138.24 138.24q-87.04 87.04-158.72 157.696-30.72 29.696-59.904 58.88t-53.248 52.224-39.424 38.4l-18.432 18.432q-7.168 7.168-16.384 14.336t-20.48 12.288-31.232 12.288-41.472 13.824-40.96 12.288-29.696 6.656q-19.456 2.048-20.992-3.584t1.536-25.088q1.024-10.24 5.12-30.208t8.192-40.448 8.704-38.4 7.68-25.088q5.12-11.264 10.752-19.456t15.872-18.432zM899.072 478.208q21.504 0 40.96 10.24t19.456 41.984l0 232.448q0 28.672-10.752 52.736t-29.184 41.984-41.984 27.648-48.128 9.728l-571.392 0q-24.576 0-48.128-10.752t-41.472-29.184-29.184-43.52-11.264-53.76l0-570.368q0-20.48 11.264-42.496t29.184-39.936 40.448-29.696 45.056-11.776l238.592 0q28.672 0 40.448 20.992t11.776 42.496-11.776 41.472-40.448 19.968l-187.392 0q-21.504 0-34.816 14.848t-13.312 36.352l0 481.28q0 20.48 13.312 34.304t34.816 13.824l474.112 0q21.504 0 36.864-13.824t15.36-34.304l0-190.464q0-14.336 6.656-24.576t16.384-16.384 21.504-8.704 23.04-2.56z" fill="currentColor" p-id="4735"></path></svg>
                        </div>
                        <div class="action-capsule delete" onclick="wcDeleteCustomPreset('${preset.id}')" title="删除预设" style="width: 44px; height: 44px; padding: 0 !important; border-radius: 14px; background: rgba(255, 59, 48, 0.12); color: #ff3b30; display: flex; align-items: center; justify-content: center; cursor: pointer;">
                            <svg t="1789622526077" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="20528" style="width: 23px !important; height: 23px !important; min-width: 23px !important; min-height: 23px !important; display: block;"><path d="M880 224H144a48 48 0 0 1 0-96H384a64 64 0 0 1 64-64h128a64 64 0 0 1 64 64h240a48 48 0 0 1 0 96zM832 832a128 128 0 0 1-128 128H320a128 128 0 0 1-128-128V288h640V832zM448 464a48 48 0 0 0-96 0v288a48 48 0 0 0 96 0v-288z m224 0a48 48 0 0 0-96 0v288a48 48 0 0 0 96 0v-288z" fill="currentColor" p-id="20529"></path></svg>
                        </div>
                    </div>`}
                </div>
            `;
        });

        container.innerHTML = html;
    }
    window.wcRenderCustomPresetList = wcRenderCustomPresetList;

    function wcToggleCustomPresetActive(id, event) {
        if (event) event.stopPropagation();
        wcActiveCustomPresetId = id;
        wcSaveCustomPresetSettings();
        wcRenderCustomPresetList();
        if (typeof showToast === 'function') {
            const item = wcCustomPresetsList.find(p => p.id === id);
            showToast(`已应用预设：${item ? item.name : '默认'}`);
        }
    }
    window.wcToggleCustomPresetActive = wcToggleCustomPresetActive;

    function wcOpenEditCustomPresetModal(presetId = null) {
        wcResetAllSwipes();
        wcLoadCustomPresetSettings();

        if (presetId === 'default_preset') {
            if (typeof showToast === 'function') showToast('官方默认预设不可编辑');
            return;
        }

        if (presetId) {
            const target = wcCustomPresetsList.find(p => p.id === presetId);
            if (target) {
                if (target.isBuiltin) {
                    if (typeof showToast === 'function') showToast('官方默认预设不可编辑');
                    return;
                }
                wcEditingPresetDraft = JSON.parse(JSON.stringify(target));
            } else {
                wcEditingPresetDraft = wcGetDefaultPresetObject();
            }
        } else {
            // 新建预设
            const newId = 'preset_' + Date.now();
            wcEditingPresetDraft = {
                id: newId,
                name: '新建自定义预设',
                isBuiltin: false,
                schemaVersion: WC_PROMPT_PRESET_SCHEMA_VERSION,
                inheritCorePrompt: true,
                inheritCot: true,
                blocks: wcGetPortablePresetBlocks()
            };
        }

        const overlay = document.getElementById('wcCustomPresetModalOverlay');
        const titleEl = document.getElementById('wcPresetModalTitle');
        const nameInput = document.getElementById('wcPresetModalNameInput');

        if (titleEl) titleEl.innerText = wcEditingPresetDraft.isBuiltin ? '查看/调整预设' : '编辑自定义预设';
        if (nameInput) {
            nameInput.value = wcEditingPresetDraft.name || '';
            nameInput.disabled = wcEditingPresetDraft.isBuiltin === true;
        }

        wcRenderPresetBlocksList();
        if (overlay) {
            overlay.classList.add('show');
        }
    }
    window.wcOpenEditCustomPresetModal = wcOpenEditCustomPresetModal;

    function wcCloseEditCustomPresetModal(event) {
        if (event && event.target !== document.getElementById('wcCustomPresetModalOverlay')) return;
        const overlay = document.getElementById('wcCustomPresetModalOverlay');
        if (overlay) {
            overlay.classList.remove('show');
        }
        wcEditingPresetDraft = null;
    }
    window.wcCloseEditCustomPresetModal = wcCloseEditCustomPresetModal;

    function wcRenderPresetBlocksList() {
        const container = document.getElementById('wcPresetBlocksListContainer');
        if (!container || !wcEditingPresetDraft || !Array.isArray(wcEditingPresetDraft.blocks)) return;

        // 1. 强制实时重载底层配置，直接读取 appSettings 确保持久化数据与主设置100%同步
        if (typeof wcLoadPromptSettings === 'function') wcLoadPromptSettings();
        if (typeof wcLoadCotSettings === 'function') wcLoadCotSettings();
        if (typeof wcLoadDossierSettings === 'function') wcLoadDossierSettings();

        const isTimeAwarenessMasterOn = typeof wcIsTimeAwarenessEnabled === 'function' ? wcIsTimeAwarenessEnabled() : true;
        const currentActivePromptId = wcActivePromptId;
        const isCorePromptMasterOn = Boolean(currentActivePromptId);

        const currentActiveCotId = wcActiveCotId;
        const isCotMasterOn = Boolean(currentActiveCotId && currentActiveCotId !== 'none');

        const currentActiveDossierId = typeof appSettings !== 'undefined' ? (appSettings.wc_active_dossier_id !== undefined ? appSettings.wc_active_dossier_id : 'default') : wcActiveDossierId;
        const isDossierMasterOn = Boolean(currentActiveDossierId && currentActiveDossierId !== 'none');

        const currentChatContact = (typeof wcContactsList !== 'undefined' && typeof wcCurrentChatContactId !== 'undefined')
            ? wcContactsList.find(c => c.id === wcCurrentChatContactId)
            : null;
        const isOnlineNarrationMasterOn = currentChatContact ? (currentChatContact.onlineNarrationEnabled === true) : true;
        const isLongDistanceMasterOn = currentChatContact ? (currentChatContact.longDistanceModeEnabled === true) : false;

        const promptBindingName = currentActivePromptId === 'builtin'
            ? 'v2'
            : (currentActivePromptId === 'year_above'
                ? 'v1'
                : (wcCustomPromptsList.find(item => item.id === currentActivePromptId)?.name || '已关闭'));
        const cotBindingName = currentActiveCotId === 'none'
            ? '已关闭'
            : (currentActiveCotId === 'builtin'
                ? 'v2 思维链'
                : (currentActiveCotId === WC_YEAR_ABOVE_COT_ID
                    ? 'v1 思维链'
                    : (wcCustomCotsList.find(item => item.id === currentActiveCotId)?.name || '未找到所选思维链')));

        const historyBoundaryIndex = wcEditingPresetDraft.blocks.findIndex(item => item.id === 'chat_history' || item.type === 'context');

        let html = '';
        wcEditingPresetDraft.blocks.forEach((block, index) => {
            const isFirst = index === 0;
            const isLast = index === wcEditingPresetDraft.blocks.length - 1;
            const isUserCustomBlock = block.type === 'custom';
            const isContextBoundary = block.id === 'chat_history' || block.type === 'context';
            const blockRole = wcNormalizePresetRole(block.role, 'system');
            const hasCustomPrompt = block.type === 'prompt' || isUserCustomBlock;
            const isExpanded = block._expanded === true;
            const isDepthInjectedCustomBlock = isUserCustomBlock && block?.injection?.position === 'depth';
            const relativePositionLabel = isContextBoundary
                ? '历史边界'
                : (isDepthInjectedCustomBlock
                    ? `历史深度 · ${Math.max(0, Math.floor(Number(block?.injection?.depth) || 0))}`
                    : (historyBoundaryIndex >= 0 && index > historyBoundaryIndex ? '历史后' : '历史前'));
            const sourceHint = block.id === 'core_prompt'
                ? `当前来源：${promptBindingName}`
                : (block.id === 'cot' ? `当前来源：${cotBindingName}` : '');

            // 检查对应的主开关是否关闭
            let masterSwitchDisabledReason = '';
            if (block.id === 'time_awareness' && !isTimeAwarenessMasterOn) {
                masterSwitchDisabledReason = '主设置未开启感知';
            } else if (block.id === 'core_prompt' && !isCorePromptMasterOn) {
                masterSwitchDisabledReason = '主设置未选择提示词';
            } else if (block.id === 'dossier' && !isDossierMasterOn) {
                masterSwitchDisabledReason = '主设置已关闭心声';
            } else if (block.id === 'cot' && !isCotMasterOn) {
                masterSwitchDisabledReason = '主设置已关闭思维链';
            } else if (block.id === 'online_narration' && !isOnlineNarrationMasterOn) {
                masterSwitchDisabledReason = '主设置未开启旁白';
            } else if (block.id === 'long_distance' && !isLongDistanceMasterOn) {
                masterSwitchDisabledReason = '聊天设置未开启异地';
            }

            const isSelectionBoundBlock = block.id === 'core_prompt' || block.id === 'cot';
            const isSystemLockedBlock = false;
            const isLockedByMaster = Boolean(masterSwitchDisabledReason) || isSelectionBoundBlock || isSystemLockedBlock;
            const isBlockActive = isSystemLockedBlock
                ? true
                : (isSelectionBoundBlock
                    ? (block.id === 'core_prompt' ? isCorePromptMasterOn : isCotMasterOn)
                    : block.enabled && !masterSwitchDisabledReason);

            let badgeHtml = '';
            if (block.runtimeOptional) {
                badgeHtml = '<span class="wc-cp-badge prompt">本轮功能</span>';
            } else if (block.type === 'worldbook') {
                badgeHtml = '<span class="wc-cp-badge worldbook">世界书</span>';
            } else if (block.type === 'prompt') {
                badgeHtml = '<span class="wc-cp-badge prompt">预设规则</span>';
            } else if (block.type === 'external') {
                badgeHtml = '<span class="wc-cp-badge external">外部设置</span>';
            } else if (block.type === 'context') {
                badgeHtml = '<span class="wc-cp-badge context">聊天历史</span>';
            } else if (block.type === 'custom') {
                badgeHtml = '<span class="wc-cp-badge prompt">' + blockRole + '</span>';
            } else {
                badgeHtml = '<span class="wc-cp-badge fixed">系统模块</span>';
            }
            badgeHtml += `<span class="wc-cp-badge context">${relativePositionLabel}</span>`;
            if (sourceHint) {
                badgeHtml += `<span class="wc-cp-badge source">${sourceHint.replace('当前来源：', '')}</span>`;
            }
            if (isSystemLockedBlock) {
                badgeHtml += '<span class="wc-cp-badge fixed">系统固定</span>';
            }

            let promptEditorHtml = '';
            if (hasCustomPrompt && isExpanded) {
                let placeholderText = '在此输入自定义提示词模板...';
                let tipsHtml = '';
                let customMetaHtml = '';
                if (isUserCustomBlock) {
                    placeholderText = '在这里写这一块独立提示词，可用 {{char}} / {{user}} / {{time}}。';
                    tipsHtml = '<div class="wc-cp-prompt-tips">自定义块不会覆盖标准 Marker，可独立选择 role 与历史深度。</div>';
                    const customRole = ['system', 'user', 'assistant'].includes(block.role) ? block.role : 'system';
                    const injectionPosition = block?.injection?.position === 'depth' ? 'depth' : 'relative';
                    const injectionDepth = Math.max(0, Math.floor(Number(block?.injection?.depth) || 0));
                    customMetaHtml = `
                        <div style="display:flex; gap:8px; flex-wrap:wrap; margin:8px 0 10px;">
                            <label style="display:flex; align-items:center; gap:6px; font-size:12px; color:#6e6e73;">
                                Role
                                <select onchange="wcUpdateCustomPresetBlockRole(${index}, this.value)" style="border:1px solid rgba(60,60,67,.18);border-radius:8px;padding:5px 8px;background:rgba(118,118,128,.08);">
                                    <option value="system" ${customRole === 'system' ? 'selected' : ''}>system</option>
                                    <option value="user" ${customRole === 'user' ? 'selected' : ''}>user</option>
                                    <option value="assistant" ${customRole === 'assistant' ? 'selected' : ''}>assistant</option>
                                </select>
                            </label>
                            <label style="display:flex; align-items:center; gap:6px; font-size:12px; color:#6e6e73;">
                                位置
                                <select onchange="wcUpdateCustomPresetBlockInjection(${index}, this.value)" style="border:1px solid rgba(60,60,67,.18);border-radius:8px;padding:5px 8px;background:rgba(118,118,128,.08);">
                                    <option value="relative" ${injectionPosition === 'relative' ? 'selected' : ''}>按顺序</option>
                                    <option value="depth" ${injectionPosition === 'depth' ? 'selected' : ''}>历史深度</option>
                                </select>
                            </label>
                            ${injectionPosition === 'depth' ? `
                                <label style="display:flex; align-items:center; gap:6px; font-size:12px; color:#6e6e73;">
                                    Depth
                                    <input type="number" min="0" max="99" value="${injectionDepth}" onchange="wcUpdateCustomPresetBlockDepth(${index}, this.value)" style="width:58px;border:1px solid rgba(60,60,67,.18);border-radius:8px;padding:5px 6px;background:rgba(118,118,128,.08);text-align:center;">
                                </label>
                            ` : ''}
                        </div>`;
                }
                if (block.id === 'time_awareness') {
                    placeholderText = '例如：User（{{userLocation}}）现在是 {{time}}；Char（{{charLocation}}）当地是 {{charTime}}。时间只作为现实背景，不要机械报时或强行推断作息。';
                    tipsHtml = '<div class="wc-cp-prompt-tips">可用变量：<code>{{time}}</code>、<code>{{timePhase}}</code>、<code>{{charTime}}</code>、<code>{{charTimePhase}}</code>、<code>{{charLocation}}</code>、<code>{{userLocation}}</code>、<code>{{char}}</code>、<code>{{user}}</code></div>';
                } else if (block.id === 'online_narration') {
                    placeholderText = '例如：<online_narration>\n线上聊天允许使用独立旁白气泡。用户的动作会以“[用户线上旁白动作：...]”标记，请直接理解并自然回应。\n如果需要描写你的动作或神态，请单独输出一条旁白消息，使用 *动作描写*；普通对白只输出对白。\n</online_narration>';
                    tipsHtml = '<div class="wc-cp-prompt-tips">自定义旁白行为约束规则。可用变量：<code>{{char}}</code>、<code>{{user}}</code></div>';
                } else if (block.id === 'long_distance') {
                    placeholderText = '例如：<long_distance_relationship>\n这是你和 {{user}} 当前关系中的现实前提：你们身处不同地点（{{char}}在{{charLocation}}，{{user}}在{{userLocation}}），现实中暂时不能见面。不能写成已经面对面或有物理接触...\n</long_distance_relationship>';
                    tipsHtml = '<div class="wc-cp-prompt-tips">异地恋约束规则。可用变量：<code>{{char}}</code>、<code>{{user}}</code>、<code>{{charLocation}}</code>、<code>{{userLocation}}</code></div>';
                } else if (block.id === 'time_gap') {
                    placeholderText = '例如：距离上一段有效互动已过去 {{gapText}}。{{continuity}} 最近互动节奏：{{recentTimeline}}';
                    tipsHtml = '<div class="wc-cp-prompt-tips">日常聊天时间跨度。可用变量：<code>{{gapText}}</code>、<code>{{recentTimeline}}</code>、<code>{{continuity}}</code>、<code>{{crossDay}}</code>、<code>{{timePhase}}</code>、<code>{{char}}</code>、<code>{{user}}</code></div>';
                } else if (block.id === 'proactive_prompt') {
                    placeholderText = '例如：[系统通知：距离上次聊天互动已经过去了 {{gapText}}。{{proactiveReason}}\n请以 {{char}} 的身份主动给 {{user}} 发消息。\n考量完毕后，直接按本轮 FrameBus 协议输出 JSONL 独立帧！]';
                    tipsHtml = '<div class="wc-cp-prompt-tips">角色后台主动联系提示词。可用变量：<code>{{gapText}}</code>、<code>{{proactiveReason}}</code>、<code>{{time}}</code>、<code>{{char}}</code>、<code>{{user}}</code></div>';
                } else if (block.id === 'custom_prompt') {
                    placeholderText = '在此输入任意你想要注入的自拟补充规则或世界观指导...';
                    tipsHtml = '<div class="wc-cp-prompt-tips">可用变量：<code>{{char}}</code>、<code>{{user}}</code></div>';
                }

                promptEditorHtml = `
                    <div class="wc-cp-block-editor">
                        ${tipsHtml}
                        ${customMetaHtml}
                        ${isUserCustomBlock ? `
                            <input type="text" value="${block.name || '自定义块'}" oninput="wcUpdateCustomPresetBlockName(${index}, this.value)" placeholder="自定义块名称" style="width:100%;box-sizing:border-box;margin-bottom:8px;border:1px solid rgba(60,60,67,.18);border-radius:9px;padding:8px 10px;background:rgba(118,118,128,.06);font-size:13px;">
                        ` : ''}
                        <textarea class="wc-cp-prompt-textarea" style="min-height: 150px; line-height: 1.5; font-size: 13.5px;" oninput="wcUpdateBlockCustomPrompt(${index}, this.value)" placeholder="${placeholderText}">${isUserCustomBlock ? (block.content || '') : (block.customPrompt || '')}</textarea>
                        <div class="wc-cp-prompt-editor-footer">
                            ${isUserCustomBlock ? `
                                <span class="wc-cp-reset-btn" onclick="wcDeleteCustomPresetBlock(${index})" style="display:inline-flex;align-items:center;gap:4px;color:#ff3b30;">
                                    <span>删除此块</span>
                                </span>
                            ` : `
                            <span class="wc-cp-reset-btn" onclick="wcResetPresetBlockPrompt(${index}, '${block.id}')" style="display: inline-flex; align-items: center; gap: 4px;">
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" width="13" height="13" style="display: block;">
                                  <path d="M15.84 8.00151875c0.00035625 3.97149375 -3.19084375 7.2060375 -7.1619875 7.25925625h-0.097275c-1.8532375 0.00390625 -3.63691875 -0.70545625 -4.9813 -1.98105 -0.48756875 -0.46046875 -0.29383125 -1.27606875 0.34873125 -1.46808125 0.2982125 -0.0891125 0.6213125 -0.0123625 0.84759375 0.2013375 3.08818125 2.915525 8.17444375 1.39466875 9.15526875 -2.7375375C14.93185625 5.1432375 11.071625 1.49883125 7.00261875 2.71551875c-0.8764625 0.26206875 -1.674 0.737975 -2.320825 1.384875 -0.0094375 0.00943125 -0.01815 0.01814375 -0.0283125 0.02685625L3.27349375 5.38818125h1.2420625c0.67058125 0.00056875 1.08908125 0.72685 0.75329375 1.30730625 -0.15556875 0.2689375 -0.44260625 0.43465625 -0.75329375 0.43491875H1.0311125c-0.48110625 0 -0.8711125 -0.3900125 -0.8711125 -0.8711125V2.77485c0.00056875 -0.67058125 0.72685 -1.08908125 1.30730625 -0.75329375 0.26893125 0.15556875 0.43465 0.44260625 0.4349125 0.75329375v1.50411875l1.55929375 -1.42716875c3.9620625 -3.9407875 10.70438125 -2.11471875 12.13616875 3.286925 0.1611125 0.6078125 0.2425625 1.2339875 0.24231875 1.86279375Z" stroke-width="0.0625"></path>
                                </svg>
                                <span>恢复系统默认</span>
                            </span>
                            `}
                        </div>
                    </div>
                `;
            }

            // 开关点击处理：如果主设置关闭，点击提示用户
            const switchClickHandler = isSelectionBoundBlock
                ? `onclick="if(typeof showToast==='function') showToast('${block.id === 'core_prompt' ? '聊天提示词' : '思维链'}跟随当前角色设置，请在对应设置中切换或关闭');"`
                : (masterSwitchDisabledReason
                    ? `onclick="if(typeof showToast==='function') showToast('${masterSwitchDisabledReason}，请先去主设置开启');"`
                    : `onclick="wcToggleCustomPresetBlockEnabled(${index}, event);"`);

            html += `
                <div class="wc-cp-block-card ${isBlockActive ? '' : 'disabled'}">
                    <div class="wc-cp-block-header">
                        <div class="wc-cp-block-left">
                            <span class="wc-cp-order-num">${index + 1}</span>
                            <div class="wc-cp-block-meta">
                                <div class="wc-cp-block-name-row">
                                    <span class="wc-cp-block-name">${block.name}</span>
                                    ${masterSwitchDisabledReason ? `<span class="wc-cp-master-hint">(${masterSwitchDisabledReason})</span>` : ''}
                                </div>
                                <div class="wc-cp-block-tags">${badgeHtml}</div>
                            </div>
                        </div>
                        <div class="wc-cp-block-right">
                            ${hasCustomPrompt ? `
                                <div class="wc-cp-tool-btn edit ${isExpanded ? 'active' : ''}" onclick="wcToggleBlockPromptEdit(${index})" title="${isExpanded ? '收起提示词' : '编辑提示词'}">
                                    <svg viewBox="0 0 1024 1024" fill="currentColor">
                                        <path d="M943.104 216.064q-8.192 9.216-15.36 16.384l-12.288 12.288q-6.144 6.144-11.264 10.24l-138.24-139.264q8.192-8.192 20.48-19.456t20.48-17.408q20.48-16.384 44.032-14.336t37.888 9.216q15.36 8.192 34.304 28.672t29.184 43.008q5.12 14.336 6.656 33.792t-15.872 36.864zM551.936 329.728l158.72-158.72 138.24 138.24q-87.04 87.04-158.72 157.696-30.72 29.696-59.904 58.88t-53.248 52.224-39.424 38.4l-18.432 18.432q-7.168 7.168-16.384 14.336t-20.48 12.288-31.232 12.288-41.472 13.824-40.96 12.288-29.696 6.656q-19.456 2.048-20.992-3.584t1.536-25.088q1.024-10.24 5.12-30.208t8.192-40.448 8.704-38.4 7.68-25.088q5.12-11.264 10.752-19.456t15.872-18.432zM899.072 478.208q21.504 0 40.96 10.24t19.456 41.984l0 232.448q0 28.672-10.752 52.736t-29.184 41.984-41.984 27.648-48.128 9.728l-571.392 0q-24.576 0-48.128-10.752t-41.472-29.184-29.184-43.52-11.264-53.76l0-570.368q0-20.48 11.264-42.496t29.184-39.936 40.448-29.696 45.056-11.776l238.592 0q28.672 0 40.448 20.992t11.776 42.496-11.776 41.472-40.448 19.968l-187.392 0q-21.504 0-34.816 14.848t-13.312 36.352l0 481.28q0 20.48 13.312 34.304t34.816 13.824l474.112 0q21.504 0 36.864-13.824t15.36-34.304l0-190.464q0-14.336 6.656-24.576t16.384-16.384 21.504-8.704 23.04-2.56z"></path>
                                    </svg>
                                </div>
                            ` : ''}
                            ${isSystemLockedBlock ? '' : `
                            <div class="wc-cp-move-group">
                                <!-- 实心圆润向上三角形 (播放三角) -->
                                <button type="button" class="wc-cp-move-btn" ${isFirst ? 'disabled' : ''} onclick="wcMoveCustomPresetBlock(${index}, -1)" title="上移">
                                    <svg viewBox="0 0 24 24">
                                        <path d="M12.87 5.13a1 1 0 0 0-1.74 0l-6.5 11.26A1 1 0 0 0 5.5 18h13a1 1 0 0 0 .87-1.5l-6.5-11.26z" fill="currentColor"></path>
                                    </svg>
                                </button>
                                <!-- 实心圆润向下三角形 (播放三角) -->
                                <button type="button" class="wc-cp-move-btn" ${isLast ? 'disabled' : ''} onclick="wcMoveCustomPresetBlock(${index}, 1)" title="下移">
                                    <svg viewBox="0 0 24 24">
                                        <path d="M12.87 18.87a1 1 0 0 1-1.74 0l-6.5-11.26A1 1 0 0 1 5.5 6h13a1 1 0 0 1 .87 1.5l-6.5 11.26z" fill="currentColor"></path>
                                    </svg>
                                </button>
                            </div>
                            `}
                            ${isSelectionBoundBlock || isSystemLockedBlock ? '' : `
                                <div class="wc-cp-switch ${isBlockActive ? 'active' : ''} ${masterSwitchDisabledReason ? 'locked' : ''}" ${switchClickHandler}>
                                    <span class="wc-cp-switch-text on">ON</span>
                                    <span class="wc-cp-switch-text off">OFF</span>
                                    <div class="wc-cp-switch-thumb"></div>
                                </div>
                            `}
                        </div>
                    </div>
                    ${promptEditorHtml}
                </div>
            `;
        });

        container.innerHTML = html;
    }

    function wcToggleCustomPresetInheritance(kind, event) {
        if (event) event.stopPropagation();
        if (typeof showToast === 'function') {
            showToast('当前角色选择已直接绑定到预设，不需要额外继承开关');
        }
    }
    window.wcToggleCustomPresetInheritance = wcToggleCustomPresetInheritance;

    function wcMoveCustomPresetBlock(index, direction) {
        if (!wcEditingPresetDraft || !Array.isArray(wcEditingPresetDraft.blocks)) return;
        const targetIndex = index + direction;
        if (targetIndex < 0 || targetIndex >= wcEditingPresetDraft.blocks.length) return;
        const item = wcEditingPresetDraft.blocks.splice(index, 1)[0];
        wcEditingPresetDraft.blocks.splice(targetIndex, 0, item);
        wcRenderPresetBlocksList();
    }
    window.wcMoveCustomPresetBlock = wcMoveCustomPresetBlock;


    function wcToggleCustomPresetBlockEnabled(index, event) {
        if (event) event.stopPropagation();
        if (!wcEditingPresetDraft || !Array.isArray(wcEditingPresetDraft.blocks)) return;
        wcEditingPresetDraft.blocks[index].enabled = !wcEditingPresetDraft.blocks[index].enabled;
        wcRenderPresetBlocksList();
    }
    window.wcToggleCustomPresetBlockEnabled = wcToggleCustomPresetBlockEnabled;

    function wcToggleBlockPromptEdit(index) {
        if (!wcEditingPresetDraft || !Array.isArray(wcEditingPresetDraft.blocks)) return;
        wcEditingPresetDraft.blocks[index]._expanded = !wcEditingPresetDraft.blocks[index]._expanded;
        wcRenderPresetBlocksList();
    }
    window.wcToggleBlockPromptEdit = wcToggleBlockPromptEdit;

    function wcUpdateBlockCustomPrompt(index, value) {
        if (!wcEditingPresetDraft || !Array.isArray(wcEditingPresetDraft.blocks)) return;
        const block = wcEditingPresetDraft.blocks[index];
        if (!block) return;
        if (block.type === 'custom') block.content = value;
        else block.customPrompt = value;
    }
    window.wcUpdateBlockCustomPrompt = wcUpdateBlockCustomPrompt;

    function wcAddCustomPresetBlock() {
        if (!wcEditingPresetDraft || !Array.isArray(wcEditingPresetDraft.blocks)) return;
        const id = 'custom_block_' + Date.now().toString(36);
        const block = {
            id,
            name: '自定义块',
            type: 'custom',
            enabled: true,
            content: '',
            role: 'system',
            injection: { position: 'relative', depth: 0 },
            _expanded: true
        };
        const contextIndex = wcEditingPresetDraft.blocks.findIndex(item => item.id === 'chat_history' || item.markerKey === 'context');
        wcEditingPresetDraft.blocks.splice(contextIndex >= 0 ? contextIndex : wcEditingPresetDraft.blocks.length, 0, block);
        wcRenderPresetBlocksList();
    }
    window.wcAddCustomPresetBlock = wcAddCustomPresetBlock;

    function wcDeleteCustomPresetBlock(index) {
        if (!wcEditingPresetDraft || !Array.isArray(wcEditingPresetDraft.blocks)) return;
        const block = wcEditingPresetDraft.blocks[index];
        if (!block || block.type !== 'custom') return;
        wcEditingPresetDraft.blocks.splice(index, 1);
        wcRenderPresetBlocksList();
    }
    window.wcDeleteCustomPresetBlock = wcDeleteCustomPresetBlock;

    function wcUpdateCustomPresetBlockName(index, value) {
        const block = wcEditingPresetDraft?.blocks?.[index];
        if (!block || block.type !== 'custom') return;
        block.name = String(value || '').slice(0, 60);
    }
    window.wcUpdateCustomPresetBlockName = wcUpdateCustomPresetBlockName;

    function wcUpdateCustomPresetBlockRole(index, role) {
        const block = wcEditingPresetDraft?.blocks?.[index];
        if (!block || block.type !== 'custom') return;
        block.role = wcNormalizePresetRole(role, 'system');
    }
    window.wcUpdateCustomPresetBlockRole = wcUpdateCustomPresetBlockRole;

    function wcUpdateCustomPresetBlockInjection(index, position) {
        const block = wcEditingPresetDraft?.blocks?.[index];
        if (!block || block.type !== 'custom') return;
        block.injection = {
            ...(block.injection || {}),
            position: position === 'depth' ? 'depth' : 'relative',
            depth: Math.max(0, Math.floor(Number(block?.injection?.depth) || 0))
        };
        wcRenderPresetBlocksList();
    }
    window.wcUpdateCustomPresetBlockInjection = wcUpdateCustomPresetBlockInjection;

    function wcUpdateCustomPresetBlockDepth(index, value) {
        const block = wcEditingPresetDraft?.blocks?.[index];
        if (!block || block.type !== 'custom') return;
        block.injection = {
            ...(block.injection || {}),
            position: 'depth',
            depth: Math.min(99, Math.max(0, Math.floor(Number(value) || 0)))
        };
    }
    window.wcUpdateCustomPresetBlockDepth = wcUpdateCustomPresetBlockDepth;

    function wcResetPresetBlockPrompt(index, blockId) {
        if (!wcEditingPresetDraft || !Array.isArray(wcEditingPresetDraft.blocks)) return;
        wcEditingPresetDraft.blocks[index].customPrompt = '';
        wcRenderPresetBlocksList();
        if (typeof showToast === 'function') showToast('已恢复系统默认文案');
    }
    window.wcResetPresetBlockPrompt = wcResetPresetBlockPrompt;

    function wcSaveCustomPresetModal() {
        if (!wcEditingPresetDraft) return;
        const nameInput = document.getElementById('wcPresetModalNameInput');
        const name = nameInput ? nameInput.value.trim() : '';

        if (!name) {
            if (typeof showToast === 'function') showToast('请输入预设名称');
            return;
        }

        wcEditingPresetDraft.name = name;
        wcEditingPresetDraft = wcNormalizePromptLayout(wcEditingPresetDraft);

        // 清除临时展开标记
        if (Array.isArray(wcEditingPresetDraft.blocks)) {
            wcEditingPresetDraft.blocks.forEach(b => delete b._expanded);
        }

        const existingIndex = wcCustomPresetsList.findIndex(p => p.id === wcEditingPresetDraft.id);
        if (existingIndex > -1) {
            wcCustomPresetsList[existingIndex] = wcEditingPresetDraft;
        } else {
            wcCustomPresetsList.push(wcEditingPresetDraft);
        }

        // 默认激活当前编辑保存的预设
        wcActiveCustomPresetId = wcEditingPresetDraft.id;

        wcSaveCustomPresetSettings();
        wcCloseEditCustomPresetModal();
        wcRenderCustomPresetList();
        if (typeof showToast === 'function') showToast('预设已保存并应用');
    }
    window.wcSaveCustomPresetModal = wcSaveCustomPresetModal;

    function wcDeleteCustomPreset(id) {
        wcResetAllSwipes();
        if (id === 'default_preset') {
            if (typeof showToast === 'function') showToast('默认预设无法删除');
            return;
        }
        showCustomConfirm('删除预设', '确定要删除这个自定义预设吗？', '删除', true).then(confirmed => {
            if (confirmed) {
                wcCustomPresetsList = wcCustomPresetsList.filter(p => p.id !== id);
                if (wcActiveCustomPresetId === id) {
                    wcActiveCustomPresetId = 'default_preset';
                }
                wcSaveCustomPresetSettings();
                wcRenderCustomPresetList();
                if (typeof showToast === 'function') showToast('预设已删除');
            }
        });
    }
    window.wcDeleteCustomPreset = wcDeleteCustomPreset;

    let wcActivePromptId = 'year_above'; // v1 is the default; retain stored IDs for compatibility.
    let wcBuiltinPromptPosition = 'after_persona';
    let wcCustomPromptsList = [];
    let wcCurrentEditPromptId = null;

    function wcLoadPromptSettings() {
        if (typeof appSettings !== 'undefined') {
            wcBuiltinPromptPosition = appSettings.wc_builtin_prompt_position || 'after_persona';
            wcCustomPromptsList = appSettings.wc_custom_prompts_list || [];
        }
        const contact = (typeof wcContactsList !== 'undefined' && typeof wcCurrentChatContactId !== 'undefined')
            ? wcContactsList.find(c => c.id === wcCurrentChatContactId)
            : null;
        if (contact && contact.activePromptId !== undefined) {
            wcActivePromptId = contact.activePromptId;
        } else if (typeof appSettings !== 'undefined') {
            wcActivePromptId = appSettings.wc_active_prompt_id !== undefined ? appSettings.wc_active_prompt_id : 'year_above';
        } else {
            wcActivePromptId = 'year_above';
        }

        // Preserve an explicit disabled state, but repair stale IDs left behind after
        // a custom prompt was deleted or removed from imported settings.
        if (wcActivePromptId) {
            const isKnownPrompt = wcActivePromptId === 'builtin'
                || wcActivePromptId === 'year_above'
                || wcCustomPromptsList.some(prompt => prompt?.id === wcActivePromptId);
            if (!isKnownPrompt) {
                wcActivePromptId = 'year_above';
                if (contact) {
                    contact.activePromptId = 'year_above';
                    if (typeof wcSaveContactsDataAsync === 'function') wcSaveContactsDataAsync();
                } else if (typeof appSettings !== 'undefined') {
                    appSettings.wc_active_prompt_id = 'year_above';
                    if (typeof saveAppSettings === 'function') saveAppSettings();
                }
            }
        }
    }

    function wcSavePromptSettings() {
        const contact = (typeof wcContactsList !== 'undefined' && typeof wcCurrentChatContactId !== 'undefined')
            ? wcContactsList.find(c => c.id === wcCurrentChatContactId)
            : null;
        if (contact) {
            contact.activePromptId = wcActivePromptId;
            if (typeof wcSaveContactsDataAsync === 'function') wcSaveContactsDataAsync();
        }
        if (typeof appSettings !== 'undefined') {
            if (!contact) appSettings.wc_active_prompt_id = wcActivePromptId;
            appSettings.wc_builtin_prompt_position = wcBuiltinPromptPosition;
            appSettings.wc_custom_prompts_list = wcCustomPromptsList;
            if (typeof saveAppSettings === 'function') saveAppSettings();
        }
    }

    function wcShowPromptSettings() {
        wcLoadPromptSettings();
        document.getElementById('wc-main-settings-view').style.display = 'none';
        document.getElementById('wc-prompt-list-view').style.display = 'flex';
        document.getElementById('wc-settings-modal-title').innerText = '聊天提示词';

        wcRenderPromptList();
    }

    function wcRenderPromptList() {
        const container = document.getElementById('wc-prompt-list-container');
        if (!container) return;

        let html = '';

        // 这里只选择核心提示词内容；实际注入位置由当前预设中的 core_prompt 模块顺序决定。
        const isBuiltinActive = wcActivePromptId === 'builtin' ? 'active' : '';
        const isYearAboveActive = wcActivePromptId === 'year_above' ? 'active' : '';

        html += `
            <div class="preset-item-wrapper">
                <div class="preset-item-content" onclick="wcTogglePromptActive('year_above', event)">
                    <div class="preset-icon">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="#8E8E93" stroke-linecap="round" stroke-linejoin="round" style="fill: none !important;">
                          <path d="M8 21H6a3 3 0 0 1 -3 -3v-1h5.5" stroke-width="2"></path>
                          <path d="M17 8.5V5a2 2 0 1 1 2 2h-2" stroke-width="2"></path>
                          <path d="M19 3H8a3 3 0 0 0 -3 3v11" stroke-width="2"></path>
                          <path d="M9 7h4" stroke-width="2"></path>
                          <path d="M9 11h4" stroke-width="2"></path>
                          <path d="M18.42 12.61a2.1 2.1 0 0 1 2.97 2.97L15 22h-3v-3z" stroke-width="2"></path>
                        </svg>
                    </div>
                    <div class="preset-info" style="flex: 1;">
                        <div class="preset-title">v1</div>
                        <div class="preset-author">默认 · 人设深度与自然互动</div>
                    </div>
                    <div class="custom-toggle ${isYearAboveActive}"><div class="thumb"><svg viewBox="0 0 24 24"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/></svg></div></div>
                </div>
            </div>
        `;

        html += `
            <div class="preset-item-wrapper">
                <div class="preset-item-content" onclick="wcTogglePromptActive('builtin', event)">
                    <div class="preset-icon">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="#8E8E93" stroke-linecap="round" stroke-linejoin="round" style="fill: none !important;">
                          <path d="M8 21H6a3 3 0 0 1 -3 -3v-1h5.5" stroke-width="2"></path>
                          <path d="M17 8.5V5a2 2 0 1 1 2 2h-2" stroke-width="2"></path>
                          <path d="M19 3H8a3 3 0 0 0 -3 3v11" stroke-width="2"></path>
                          <path d="M9 7h4" stroke-width="2"></path>
                          <path d="M9 11h4" stroke-width="2"></path>
                          <path d="M18.42 12.61a2.1 2.1 0 0 1 2.97 2.97L15 22h-3v-3z" stroke-width="2"></path>
                        </svg>
                    </div>
                    <div class="preset-info" style="flex: 1;">
                        <div class="preset-title">v2</div>
                        <div class="preset-author">轻量日常聊天与自然表达</div>
                    </div>
                    <div class="custom-toggle ${isBuiltinActive}"><div class="thumb"><svg viewBox="0 0 24 24"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/></svg></div></div>
                </div>
            </div>
        `;

        // 渲染自定义提示词 (图标与默认内置提示词完全一致)
        wcCustomPromptsList.forEach(prompt => {
            const isActive = wcActivePromptId === prompt.id ? 'active' : '';
            html += `
                <div class="preset-item-wrapper">
                    <div class="preset-item-content" ontouchstart="wcHandleTouchStart(event)" ontouchmove="wcHandleTouchMove(event)" ontouchend="wcHandleTouchEnd(event)">
                        <div class="preset-icon">
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="#8E8E93" stroke-linecap="round" stroke-linejoin="round" style="fill: none !important;">
                              <path d="M8 21H6a3 3 0 0 1 -3 -3v-1h5.5" stroke-width="2"></path>
                              <path d="M17 8.5V5a2 2 0 1 1 2 2h-2" stroke-width="2"></path>
                              <path d="M19 3H8a3 3 0 0 0 -3 3v11" stroke-width="2"></path>
                              <path d="M9 7h4" stroke-width="2"></path>
                              <path d="M9 11h4" stroke-width="2"></path>
                              <path d="M18.42 12.61a2.1 2.1 0 0 1 2.97 2.97L15 22h-3v-3z" stroke-width="2"></path>
                            </svg>
                        </div>
                        <div class="preset-info" style="flex: 1;" onclick="wcOpenEditPrompt('${prompt.id}')">
                            <div class="preset-title">${prompt.name}</div>
                            <div class="preset-author">自定义提示词</div>
                        </div>
                        <div class="custom-toggle ${isActive}" onclick="wcTogglePromptActive('${prompt.id}', event)" ontouchstart="event.stopPropagation()"><div class="thumb"><svg viewBox="0 0 24 24"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/></svg></div></div>
                    </div>
                    <div class="preset-item-actions" style="display: flex; align-items: center; gap: 8px; padding-right: 8px;">
                        <div class="action-capsule" onclick="wcOpenEditPrompt('${prompt.id}')" title="编辑提示词" style="width: 44px; height: 44px; padding: 0 !important; border-radius: 14px; background: rgba(0, 122, 255, 0.12); color: #007aff; display: flex; align-items: center; justify-content: center; cursor: pointer;">
                            <svg t="1789622386706" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="4734" style="width: 23px !important; height: 23px !important; min-width: 23px !important; min-height: 23px !important; display: block;"><path d="M943.104 216.064q-8.192 9.216-15.36 16.384l-12.288 12.288q-6.144 6.144-11.264 10.24l-138.24-139.264q8.192-8.192 20.48-19.456t20.48-17.408q20.48-16.384 44.032-14.336t37.888 9.216q15.36 8.192 34.304 28.672t29.184 43.008q5.12 14.336 6.656 33.792t-15.872 36.864zM551.936 329.728l158.72-158.72 138.24 138.24q-87.04 87.04-158.72 157.696-30.72 29.696-59.904 58.88t-53.248 52.224-39.424 38.4l-18.432 18.432q-7.168 7.168-16.384 14.336t-20.48 12.288-31.232 12.288-41.472 13.824-40.96 12.288-29.696 6.656q-19.456 2.048-20.992-3.584t1.536-25.088q1.024-10.24 5.12-30.208t8.192-40.448 8.704-38.4 7.68-25.088q5.12-11.264 10.752-19.456t15.872-18.432zM899.072 478.208q21.504 0 40.96 10.24t19.456 41.984l0 232.448q0 28.672-10.752 52.736t-29.184 41.984-41.984 27.648-48.128 9.728l-571.392 0q-24.576 0-48.128-10.752t-41.472-29.184-29.184-43.52-11.264-53.76l0-570.368q0-20.48 11.264-42.496t29.184-39.936 40.448-29.696 45.056-11.776l238.592 0q28.672 0 40.448 20.992t11.776 42.496-11.776 41.472-40.448 19.968l-187.392 0q-21.504 0-34.816 14.848t-13.312 36.352l0 481.28q0 20.48 13.312 34.304t34.816 13.824l474.112 0q21.504 0 36.864-13.824t15.36-34.304l0-190.464q0-14.336 6.656-24.576t16.384-16.384 21.504-8.704 23.04-2.56z" fill="currentColor" p-id="4735"></path></svg>
                        </div>
                        <div class="action-capsule delete" onclick="wcDeletePrompt('${prompt.id}')" title="删除提示词" style="width: 44px; height: 44px; padding: 0 !important; border-radius: 14px; background: rgba(255, 59, 48, 0.12); color: #ff3b30; display: flex; align-items: center; justify-content: center; cursor: pointer;">
                            <svg t="1789622526077" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="20528" style="width: 23px !important; height: 23px !important; min-width: 23px !important; min-height: 23px !important; display: block;"><path d="M880 224H144a48 48 0 0 1 0-96H384a64 64 0 0 1 64-64h128a64 64 0 0 1 64 64h240a48 48 0 0 1 0 96zM832 832a128 128 0 0 1-128 128H320a128 128 0 0 1-128-128V288h640V832zM448 464a48 48 0 0 0-96 0v288a48 48 0 0 0 96 0v-288z m224 0a48 48 0 0 0-96 0v288a48 48 0 0 0 96 0v-288z" fill="currentColor" p-id="20529"></path></svg>
                        </div>
                    </div>
                </div>
            `;
        });

        container.innerHTML = html;
    }

    function wcTogglePromptActive(id, event) {
        if (event) event.stopPropagation(); // 阻止事件冒泡，防止触发左滑
        if (wcActivePromptId === id) {
            wcActivePromptId = null; // 再次点击关闭
        } else {
            wcActivePromptId = id; // 开启并互斥其他
            // Sync to the year-above CoT only on the first explicit activation.
            // Later prompt changes never overwrite the user's independent CoT choice.
            if (id === 'year_above' && typeof appSettings !== 'undefined' && !appSettings.wc_year_above_cot_synced) {
                wcActiveCotId = WC_YEAR_ABOVE_COT_ID;
                appSettings.wc_year_above_cot_synced = true;
                wcSaveCotSettings();
            }
        }
        wcSavePromptSettings();
        wcRenderPromptList();
    }

    function wcChangeBuiltinPosition() {
        wcResetAllSwipes();
        const items = [
            { label: '顶部/最前面', value: 'top' },
            { label: '人设前', value: 'before_persona' },
            { label: '人设后', value: 'after_persona' },
            { label: '底部/最后面', value: 'bottom' }
        ];

        openUniversalSelect({
            title: '选择注入位置',
            items: items,
            currentValue: wcBuiltinPromptPosition,
            searchable: false,
            onSelect: (val) => {
                wcBuiltinPromptPosition = val;
                wcSavePromptSettings();
                wcRenderPromptList();
            }
        });
    }

    function wcOpenEditPrompt(id = null) {
        wcResetAllSwipes();
        wcCurrentEditPromptId = id;

        const overlay = document.getElementById('wc-prompt-edit-view');
        if (overlay) {
            overlay.style.display = 'flex';
            requestAnimationFrame(() => {
                overlay.classList.add('show');
            });
        }

        const nameInput = document.getElementById('wc-edit-prompt-name');
        const contentInput = document.getElementById('wc-edit-prompt-content');
        [nameInput, contentInput].forEach(input => input && input.removeAttribute('maxlength'));
        const titleEl = document.getElementById('wcPromptDrawerTitle');
        const saveBtnEl = document.getElementById('wcPromptSaveBtn');

        if (id) {
            if (titleEl) titleEl.innerText = '编辑提示词';
            if (saveBtnEl) saveBtnEl.innerText = '保存';
            const prompt = wcCustomPromptsList.find(p => p.id === id);
            if (prompt) {
                nameInput.value = prompt.name;
                contentInput.value = prompt.content;
            }
        } else {
            if (titleEl) titleEl.innerText = 'New Prompt';
            if (saveBtnEl) saveBtnEl.innerText = '创建';
            nameInput.value = '';
            contentInput.value = '';
        }
    }

    function wcCloseEditPrompt(event) {
        if (event && event.target !== document.getElementById('wc-prompt-edit-view')) return;
        const overlay = document.getElementById('wc-prompt-edit-view');
        if (!overlay) return;
        overlay.classList.remove('show');
        setTimeout(() => overlay.style.display = 'none', 300);
        wcCurrentEditPromptId = null;
    }

    function wcInsertPromptVariable(variableText) {
        const textarea = document.getElementById('wc-edit-prompt-content');
        if (!textarea) return;
        const startPos = textarea.selectionStart;
        const endPos = textarea.selectionEnd;
        const text = textarea.value;

        textarea.value = text.substring(0, startPos) + variableText + text.substring(endPos);

        const newPos = startPos + variableText.length;
        textarea.selectionStart = newPos;
        textarea.selectionEnd = newPos;
        textarea.focus();
    }

    function wcOpenPromptTutorial() {
        const overlay = document.getElementById('wcPromptTutorialOverlay');
        if (overlay) {
            overlay.style.display = 'flex';
            setTimeout(() => overlay.classList.add('show'), 10);
        }
    }

    function wcClosePromptTutorial(event) {
        const overlay = document.getElementById('wcPromptTutorialOverlay');
        if (!overlay) return;
        if (event && event.target !== overlay) return;
        overlay.classList.remove('show');
        setTimeout(() => overlay.style.display = 'none', 300);
    }

    function wcSavePrompt() {
        const name = document.getElementById('wc-edit-prompt-name').value.trim();
        const content = document.getElementById('wc-edit-prompt-content').value.trim();

        if (!name) {
            showToast('请输入提示词名称');
            return;
        }

        if (wcCurrentEditPromptId) {
            const prompt = wcCustomPromptsList.find(p => p.id === wcCurrentEditPromptId);
            if (prompt) {
                prompt.name = name;
                prompt.content = content;
            }
        } else {
            const newPrompt = {
                id: 'prompt_' + Date.now(),
                name: name,
                content: content
            };
            wcCustomPromptsList.push(newPrompt);
        }

        wcSavePromptSettings();
        wcCloseEditPrompt();
        wcRenderPromptList();
        showToast('保存成功');
    }

    function wcDeletePrompt(id) {
        wcResetAllSwipes();
        showCustomConfirm('删除提示词', '确定要删除这个自定义提示词吗？', '删除', true).then(confirmed => {
            if (confirmed) {
                wcCustomPromptsList = wcCustomPromptsList.filter(p => p.id !== id);
                if (wcActivePromptId === id) {
                    wcActivePromptId = null;
                }
                wcSavePromptSettings();
                wcRenderPromptList();
                showToast('已删除');
            }
        });
    }

    // --- 思维链 (CoT) 设置逻辑 ---
    const WC_YEAR_ABOVE_COT_ID = 'year_above_builtin';
    let wcActiveCotId = 'none'; // CoT is opt-in; 'none' means disabled until the user explicitly selects one.
    let wcShowCotReasoning = false; // Display is independent from whether CoT itself is enabled.
    let wcCustomCotsList = [];
    let wcCurrentEditCotId = null;

    function wcLoadCotSettings() {
        if (typeof appSettings !== 'undefined') {
            wcCustomCotsList = appSettings.wc_custom_cots_list || [];
        }
        const contact = (typeof wcContactsList !== 'undefined' && typeof wcCurrentChatContactId !== 'undefined')
            ? wcContactsList.find(c => c.id === wcCurrentChatContactId)
            : null;
        if (contact && contact.activeCotId !== undefined) {
            wcActiveCotId = contact.activeCotId;
        } else if (typeof appSettings !== 'undefined') {
            wcActiveCotId = appSettings.wc_active_cot_id !== undefined ? appSettings.wc_active_cot_id : 'none';
        }

        if (contact && typeof contact.showCotReasoning === 'boolean') {
            wcShowCotReasoning = contact.showCotReasoning;
        } else if (typeof appSettings !== 'undefined') {
            wcShowCotReasoning = appSettings.wc_show_cot_reasoning === true;
        } else {
            wcShowCotReasoning = false;
        }
    }

    function wcSaveCotSettings() {
        const contact = (typeof wcContactsList !== 'undefined' && typeof wcCurrentChatContactId !== 'undefined')
            ? wcContactsList.find(c => c.id === wcCurrentChatContactId)
            : null;
        if (contact) {
            contact.activeCotId = wcActiveCotId;
            contact.showCotReasoning = wcShowCotReasoning;
            if (typeof wcSaveContactsDataAsync === 'function') wcSaveContactsDataAsync();
        }
        if (typeof appSettings !== 'undefined') {
            if (!contact) appSettings.wc_active_cot_id = wcActiveCotId;
            appSettings.wc_custom_cots_list = wcCustomCotsList;
            if (!contact) appSettings.wc_show_cot_reasoning = wcShowCotReasoning;
            if (typeof saveAppSettings === 'function') saveAppSettings();
        }
    }

    function wcShowCotSettings() {
        wcLoadCotSettings();
        document.getElementById('wc-main-settings-view').style.display = 'none';
        document.getElementById('wc-cot-list-view').style.display = 'flex';
        document.getElementById('wc-settings-modal-title').innerText = '思维链设置';
        wcRenderCotList();
    }

    function wcRenderCotList() {
        const container = document.getElementById('wc-cot-list-container');
        if (!container) return;

        let html = '';

        // “是否显示”与“是否启用思维链”完全独立。
        // 这一项使用无底色的连接状态图标 + 纯色圆点开关；其他思维链开关保持原样。
        const reasoningDisplayIcon = wcShowCotReasoning
            ? `<svg t="1791378046230" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="49074" width="200" height="200" aria-hidden="true" style="width: 30px !important; height: 30px !important; display: block; fill: currentColor;"><path d="M455.808 644.864l224.512-224.576c22.912-22.912 23.424-59.84 1.088-82.112C659.136 315.84 622.208 316.352 599.296 339.2L374.784 563.776c-22.912 22.912-23.36 59.84-1.088 82.176l0 0C395.84 668.224 432.96 667.712 455.808 644.864L455.808 644.864 455.808 644.864zM469.248 703.552c8 11.264 9.216 23.232 9.152 29.952-0.128 8-2.24 23.552-15.488 36.736l-70.976 70.976c-13.248 13.248-28.608 15.36-36.736 15.488-8 0.128-23.488-1.6-36.352-14.464l-137.024-137.024c-12.864-12.864-14.592-28.224-14.464-36.352 0.128-8.128 2.24-23.552 15.488-36.736l70.976-70.976c13.248-13.248 28.608-15.36 36.736-15.488 5.696-0.064 14.976 0.832 24.32 5.76l75.136-75.136c-60.032-49.28-150.72-44.736-208.32 12.736L110.72 560c-61.12 61.12-62.4 159.68-2.88 219.2l137.024 137.024c59.52 59.52 158.08 58.24 219.136-2.88l70.976-70.976C593.92 783.296 597.12 689.088 543.552 629.12L469.248 703.552 469.248 703.552 469.248 703.552zM916.16 244.8l-137.024-137.024c-59.52-59.52-158.08-58.24-219.136 2.88L489.088 181.696C431.616 239.168 427.072 329.856 476.352 390.016l75.136-75.136c-4.928-9.472-5.824-18.752-5.76-24.32 0.128-8 2.24-23.552 15.488-36.736l70.976-70.976c13.248-13.248 28.608-15.36 36.736-15.488 8-0.128 23.488 1.6 36.352 14.528l137.024 137.024c12.864 12.864 14.592 28.224 14.464 36.352-0.128 8-2.24 23.552-15.488 36.736l-70.976 70.976c-13.184 13.184-28.608 15.36-36.736 15.488-6.72 0.064-18.688-1.152-29.952-9.152L629.248 543.616c59.968 53.568 154.048 50.496 213.184-8.64l70.976-70.976C974.4 402.88 975.68 304.192 916.16 244.8L916.16 244.8 916.16 244.8z" p-id="49075"></path></svg>`
            : `<svg t="1791377931161" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="38506" width="200" height="200" aria-hidden="true" style="width: 30px !important; height: 30px !important; display: block; fill: currentColor;"><path d="M421.546667 542.293333l-90.453334 90.453334a42.666667 42.666667 0 0 0 60.16 60.16l90.453334-90.453334 30.293333 30.293334a85.333333 85.333333 0 0 1 0 120.746666l-120.746667 120.746667a85.333333 85.333333 0 0 1-120.746666 0l-120.746667-120.746667a85.333333 85.333333 0 0 1 0-120.746666L270.506667 512a85.333333 85.333333 0 0 1 120.746666 0zM602.453333 481.706667l90.453334-90.453334a42.666667 42.666667 0 1 0-60.16-60.16l-90.453334 90.453334-30.293333-30.293334a85.333333 85.333333 0 0 1 0-120.746666l120.746667-120.746667a85.333333 85.333333 0 0 1 120.746666 0l120.746667 120.746667a85.333333 85.333333 0 0 1 0 120.746666L753.493333 512a85.333333 85.333333 0 0 1-120.746666 0z" p-id="38507"></path><path d="M180.053333 180.053333a42.666667 42.666667 0 0 1 60.16 0l60.586667 60.586667a42.666667 42.666667 0 0 1-60.16 60.16L180.053333 240.64a42.666667 42.666667 0 0 1 0-60.586667z m218.453334-115.626666a42.666667 42.666667 0 0 1 42.666666 42.666666v85.333334a42.666667 42.666667 0 0 1-85.333333 0v-85.333334a42.666667 42.666667 0 0 1 42.666667-42.666666zM72.106667 391.253333a42.666667 42.666667 0 0 1 42.666666-42.666666h85.333334a42.666667 42.666667 0 1 1 0 85.333333h-85.333334a42.666667 42.666667 0 0 1-42.666666-42.666667z" p-id="38508"></path><path d="M838.826667 838.826667a42.666667 42.666667 0 0 0 0-60.16l-60.16-60.16a42.666667 42.666667 0 0 0-60.16 60.16l60.16 60.16a42.666667 42.666667 0 0 0 60.16 0z m115.626666-218.453334a42.666667 42.666667 0 0 0-42.666666-42.666666h-85.333334a42.666667 42.666667 0 1 0 0 85.333333h85.333334a42.666667 42.666667 0 0 0 42.24-42.666667z m-326.826666 326.826667a42.666667 42.666667 0 0 0 42.666666-42.666667v-85.333333a42.666667 42.666667 0 0 0-85.333333 0v85.333333a42.666667 42.666667 0 0 0 42.666667 42.24z" p-id="38509"></path></svg>`;
        const reasoningDisplayIconColor = wcShowCotReasoning ? '#8FAFD0' : '#8E8E93';
        const reasoningDisplayDotColor = wcShowCotReasoning ? '#8FAFD0' : '#B8BAC0';

        html += `
            <div class="preset-item-wrapper">
                <div class="preset-item-content" onclick="wcToggleCotReasoningDisplay(event)">
                    <div class="preset-icon" style="background: transparent !important; border: 0 !important; box-shadow: none !important; border-radius: 0 !important; color: ${reasoningDisplayIconColor};">
                        ${reasoningDisplayIcon}
                    </div>
                    <div class="preset-info" style="flex: 1;">
                        <div class="preset-title">显示思维链</div>
                        <div class="preset-author" style="white-space: nowrap; overflow: visible;">仅控制显示，不影响思维链运行</div>
                    </div>
                    <button
                        type="button"
                        aria-label="${wcShowCotReasoning ? '关闭显示思维链' : '打开显示思维链'}"
                        aria-pressed="${wcShowCotReasoning ? 'true' : 'false'}"
                        onclick="wcToggleCotReasoningDisplay(event)"
                        style="width: 7px; height: 7px; min-width: 7px; padding: 0; border: 0; border-radius: 50%; background: ${reasoningDisplayDotColor}; display: block; flex-shrink: 0; cursor: pointer; -webkit-tap-highlight-color: transparent; transition: background-color 0.18s ease, transform 0.18s ease;"
                    ></button>
                </div>
            </div>
        `;

        // 渲染内置思维链
        const isBuiltinActive = wcActiveCotId === 'builtin' ? 'active' : '';
        const isYearAboveBuiltinActive = wcActiveCotId === WC_YEAR_ABOVE_COT_ID ? 'active' : '';
        html += `
            <div class="preset-item-wrapper">
                <div class="preset-item-content" onclick="wcToggleCotActive('${WC_YEAR_ABOVE_COT_ID}', event)">
                    <div class="preset-icon">
                        <svg viewBox="0 0 24 24" fill="none" stroke="#8E8E93" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="fill: none !important;"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"></path><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"></path></svg>
                    </div>
                    <div class="preset-info" style="flex: 1;">
                        <div class="preset-title">v1 思维链</div>
                        <div class="preset-author">v1 对应的推理逻辑</div>
                    </div>
                    <div class="custom-toggle ${isYearAboveBuiltinActive}"><div class="thumb"><svg viewBox="0 0 24 24"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/></svg></div></div>
                </div>
            </div>
        `;

        html += `
            <div class="preset-item-wrapper">
                <div class="preset-item-content" onclick="wcToggleCotActive('builtin', event)">
                    <div class="preset-icon">
                        <svg viewBox="0 0 24 24" fill="none" stroke="#8E8E93" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="fill: none !important;"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"></path><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"></path></svg>
                    </div>
                    <div class="preset-info" style="flex: 1;">
                        <div class="preset-title">v2 思维链</div>
                        <div class="preset-author">v2 对应的推理逻辑</div>
                    </div>
                    <div class="custom-toggle ${isBuiltinActive}"><div class="thumb"><svg viewBox="0 0 24 24"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/></svg></div></div>
                </div>
            </div>
        `;

        // 渲染自定义思维链 (图标与内置思维链完全一致)
        wcCustomCotsList.forEach(cot => {
            const isActive = wcActiveCotId === cot.id ? 'active' : '';
            html += `
                <div class="preset-item-wrapper">
                    <div class="preset-item-content" ontouchstart="wcHandleTouchStart(event)" ontouchmove="wcHandleTouchMove(event)" ontouchend="wcHandleTouchEnd(event)">
                        <div class="preset-icon">
                            <svg viewBox="0 0 24 24" fill="none" stroke="#8E8E93" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="fill: none !important;"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"></path><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"></path></svg>
                        </div>
                        <div class="preset-info" style="flex: 1;" onclick="wcOpenEditCot('${cot.id}')">
                            <div class="preset-title">${cot.name}</div>
                            <div class="preset-author">自定义思维链</div>
                        </div>
                        <div class="custom-toggle ${isActive}" onclick="wcToggleCotActive('${cot.id}', event)" ontouchstart="event.stopPropagation()"><div class="thumb"><svg viewBox="0 0 24 24"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/></svg></div></div>
                    </div>
                    <div class="preset-item-actions" style="display: flex; align-items: center; gap: 8px; padding-right: 8px;">
                        <div class="action-capsule" onclick="wcOpenEditCot('${cot.id}')" title="编辑思维链" style="width: 44px; height: 44px; padding: 0 !important; border-radius: 14px; background: rgba(0, 122, 255, 0.12); color: #007aff; display: flex; align-items: center; justify-content: center; cursor: pointer;">
                            <svg t="1789622386706" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="4734" style="width: 23px !important; height: 23px !important; min-width: 23px !important; min-height: 23px !important; display: block;"><path d="M943.104 216.064q-8.192 9.216-15.36 16.384l-12.288 12.288q-6.144 6.144-11.264 10.24l-138.24-139.264q8.192-8.192 20.48-19.456t20.48-17.408q20.48-16.384 44.032-14.336t37.888 9.216q15.36 8.192 34.304 28.672t29.184 43.008q5.12 14.336 6.656 33.792t-15.872 36.864zM551.936 329.728l158.72-158.72 138.24 138.24q-87.04 87.04-158.72 157.696-30.72 29.696-59.904 58.88t-53.248 52.224-39.424 38.4l-18.432 18.432q-7.168 7.168-16.384 14.336t-20.48 12.288-31.232 12.288-41.472 13.824-40.96 12.288-29.696 6.656q-19.456 2.048-20.992-3.584t1.536-25.088q1.024-10.24 5.12-30.208t8.192-40.448 8.704-38.4 7.68-25.088q5.12-11.264 10.752-19.456t15.872-18.432zM899.072 478.208q21.504 0 40.96 10.24t19.456 41.984l0 232.448q0 28.672-10.752 52.736t-29.184 41.984-41.984 27.648-48.128 9.728l-571.392 0q-24.576 0-48.128-10.752t-41.472-29.184-29.184-43.52-11.264-53.76l0-570.368q0-20.48 11.264-42.496t29.184-39.936 40.448-29.696 45.056-11.776l238.592 0q28.672 0 40.448 20.992t11.776 42.496-11.776 41.472-40.448 19.968l-187.392 0q-21.504 0-34.816 14.848t-13.312 36.352l0 481.28q0 20.48 13.312 34.304t34.816 13.824l474.112 0q21.504 0 36.864-13.824t15.36-34.304l0-190.464q0-14.336 6.656-24.576t16.384-16.384 21.504-8.704 23.04-2.56z" fill="currentColor" p-id="4735"></path></svg>
                        </div>
                        <div class="action-capsule delete" onclick="wcDeleteCot('${cot.id}')" title="删除思维链" style="width: 44px; height: 44px; padding: 0 !important; border-radius: 14px; background: rgba(255, 59, 48, 0.12); color: #ff3b30; display: flex; align-items: center; justify-content: center; cursor: pointer;">
                            <svg t="1789622526077" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="20528" style="width: 23px !important; height: 23px !important; min-width: 23px !important; min-height: 23px !important; display: block;"><path d="M880 224H144a48 48 0 0 1 0-96H384a64 64 0 0 1 64-64h128a64 64 0 0 1 64 64h240a48 48 0 0 1 0 96zM832 832a128 128 0 0 1-128 128H320a128 128 0 0 1-128-128V288h640V832zM448 464a48 48 0 0 0-96 0v288a48 48 0 0 0 96 0v-288z m224 0a48 48 0 0 0-96 0v288a48 48 0 0 0 96 0v-288z" fill="currentColor" p-id="20529"></path></svg>
                        </div>
                    </div>
                </div>
            `;
        });

        container.innerHTML = html;
    }

    function wcToggleCotReasoningDisplay(event) {
        if (event) {
            event.preventDefault();
            event.stopPropagation();
        }
        wcShowCotReasoning = !wcShowCotReasoning;
        wcSaveCotSettings();
        wcRenderCotList();
        if (typeof wcRenderChatMessages === 'function' && typeof wcCurrentChatContactId !== 'undefined' && wcCurrentChatContactId) {
            wcRenderChatMessages(wcCurrentChatContactId);
        }
    }
    window.wcToggleCotReasoningDisplay = wcToggleCotReasoningDisplay;

    function wcToggleCotActive(id, event) {
        if (event) event.stopPropagation();
        // 如果点击的是当前已经激活的，则关闭（设为 'none'）
        if (wcActiveCotId === id) {
            wcActiveCotId = 'none';
        } else {
            wcActiveCotId = id; // 否则切换到新点击的
        }
        wcSaveCotSettings();
        wcRenderCotList();
    }

    function wcOpenEditCot(id = null) {
        wcResetAllSwipes();
        wcCurrentEditCotId = id;

        const overlay = document.getElementById('wc-cot-edit-view');
        if (overlay) {
            overlay.style.display = 'flex';
            requestAnimationFrame(() => {
                overlay.classList.add('show');
            });
        }

        const nameInput = document.getElementById('wc-edit-cot-name');
        const contentInput = document.getElementById('wc-edit-cot-content');
        [nameInput, contentInput].forEach(input => input && input.removeAttribute('maxlength'));
        const titleEl = document.getElementById('wcCotDrawerTitle');
        const saveBtnEl = document.getElementById('wcCotSaveBtn');

        if (id) {
            if (titleEl) titleEl.innerText = '编辑思维链';
            if (saveBtnEl) saveBtnEl.innerText = '保存';
            const cot = wcCustomCotsList.find(p => p.id === id);
            if (cot) {
                nameInput.value = cot.name;
                contentInput.value = cot.content;
            }
        } else {
            if (titleEl) titleEl.innerText = 'New CoT';
            if (saveBtnEl) saveBtnEl.innerText = '创建';
            nameInput.value = '';
            contentInput.value = '';
        }
    }

    function wcCloseEditCot(event) {
        if (event && event.target !== document.getElementById('wc-cot-edit-view')) return;
        const overlay = document.getElementById('wc-cot-edit-view');
        if (!overlay) return;
        overlay.classList.remove('show');
        setTimeout(() => overlay.style.display = 'none', 300);
        wcCurrentEditCotId = null;
    }

    function wcOpenCotTutorial() {
        const overlay = document.getElementById('wcCotTutorialOverlay');
        if (overlay) {
            overlay.style.display = 'flex';
            setTimeout(() => overlay.classList.add('show'), 10);
        }
    }
    window.wcOpenCotTutorial = wcOpenCotTutorial;

    function wcCloseCotTutorial(event) {
        const overlay = document.getElementById('wcCotTutorialOverlay');
        if (!overlay) return;
        if (event && event.target !== overlay) return;
        overlay.classList.remove('show');
        setTimeout(() => overlay.style.display = 'none', 300);
    }
    window.wcCloseCotTutorial = wcCloseCotTutorial;

    function wcSaveCot() {
        const name = document.getElementById('wc-edit-cot-name').value.trim();
        const content = document.getElementById('wc-edit-cot-content').value.trim();

        if (!name) {
            showToast('请输入思维链名称');
            return;
        }

        if (wcCurrentEditCotId) {
            const cot = wcCustomCotsList.find(p => p.id === wcCurrentEditCotId);
            if (cot) {
                cot.name = name;
                cot.content = content;
            }
        } else {
            const newCot = {
                id: 'cot_' + Date.now(),
                name: name,
                content: content
            };
            wcCustomCotsList.push(newCot);
        }

        wcSaveCotSettings();
        wcCloseEditCot();
        wcRenderCotList();
        showToast('保存成功');
    }

    function wcDeleteCot(id) {
        wcResetAllSwipes();
        showCustomConfirm('删除思维链', '确定要删除这个自定义思维链吗？', '删除', true).then(confirmed => {
            if (confirmed) {
                wcCustomCotsList = wcCustomCotsList.filter(p => p.id !== id);
                if (wcActiveCotId === id) {
                    wcActiveCotId = 'none'; // 删除了当前激活的，直接关闭思维链
                }
                wcSaveCotSettings();
                wcRenderCotList();
                showToast('已删除');
            }
        });
    }

    async function wcJumpToContactsChar() {
        wcCloseSettingsModal();
        const contact = wcContactsList.find(c => c.id === wcCurrentChatContactId);
        if (contact && contact.linkedContactId) {
            try {
                const contactsApp = typeof window.loadContactsApp === 'function'
                    ? await window.loadContactsApp()
                    : window.ContactsApp;
                if (!contactsApp || typeof contactsApp.openContactExternal !== 'function') {
                    throw new Error('角色库模块未正确初始化');
                }
                await contactsApp.open();
                contactsApp.openContactExternal(contact.linkedContactId, async () => {
                    // 当从角色库返回时，重新同步数据并刷新聊天室
                    await new Promise(resolve => setTimeout(resolve, 300)); // 增加延迟等待数据库写入完成
                    await wcReloadContactsFromStorage();
                    const contactRecord = await wcReadLayoutRecord('contactsAppData');
                    const contacts = Array.isArray(contactRecord?.data?.contacts) ? contactRecord.data.contacts : [];
                    const sourceContact = contacts.find(c => c.id === contact.linkedContactId);
                    const activeContact = wcContactsList.find(c => c.id === wcCurrentChatContactId);
                    if (sourceContact && activeContact) {
                        activeContact.avatar = sourceContact.avatar || '';
                        activeContact.name = sourceContact.name || '未命名角色';
                        await wcSaveContactsDataAsync();
                        wcRenderContactList();
                        wcRenderChatList();
                        wcOpenChatRoom(wcCurrentChatContactId);
                        wcOpenSettingsModal(); // 无条件重新打开并刷新设置面板
                    }
                });
            } catch (error) {
                console.error('Contacts character editor could not be opened:', error);
                if (typeof showToast === 'function') showToast('角色库加载失败，请稍后重试');
            }
        } else {
            if (typeof showToast === 'function') showToast('未找到关联的角色数据');
        }
    }

    async function wcJumpToContactsUser() {
        wcCloseSettingsModal();
        const userId = typeof appSettings !== 'undefined' ? appSettings.wc_current_user_id : null;
        if (userId) {
            try {
                const contactsApp = typeof window.loadContactsApp === 'function'
                    ? await window.loadContactsApp()
                    : window.ContactsApp;
                if (!contactsApp || typeof contactsApp.openUserExternal !== 'function') {
                    throw new Error('角色库模块未正确初始化');
                }
                await contactsApp.open();
                contactsApp.openUserExternal(userId, async () => {
                    // 当从角色库返回时，重新同步 User 数据
                    await new Promise(resolve => setTimeout(resolve, 300)); // 增加延迟等待数据库写入完成
                    const contactRecord = await wcReadLayoutRecord('contactsAppData');
                    const users = Array.isArray(contactRecord?.data?.users) ? contactRecord.data.users : [];
                    const sourceUser = users.find(u => u.id === userId);
                    if (sourceUser) {
                        appSettings.wc_current_user_name = sourceUser.name || '未命名 User';
                        appSettings.wc_current_user_avatar = sourceUser.avatar || '';
                        if (typeof saveAppSettings === 'function') saveAppSettings();

                        // 同步到 authData
                        const authData = await wcGetAuthData();
                        const currentUserIndex = authData.accounts.findIndex(a => a.wxid === authData.currentLoginWxid);
                        if (currentUserIndex !== -1) {
                            authData.accounts[currentUserIndex].name = sourceUser.name;
                            authData.accounts[currentUserIndex].avatar = sourceUser.avatar;
                            await wcSaveAuthData(authData);
                        }
                        // 刷新聊天室（因为自己发的消息头像可能变了）
                        wcRenderChatMessages(wcCurrentChatContactId);
                        wcOpenSettingsModal(); // 无条件重新打开并刷新设置面板
                    }
                });
            } catch (error) {
                console.error('Contacts user editor could not be opened:', error);
                if (typeof showToast === 'function') showToast('角色库加载失败，请稍后重试');
            }
        } else {
            if (typeof showToast === 'function') showToast('未找到关联的 User 数据');
        }
    }

    function wcTriggerQuickAvatarPicker(type) {
        const isChar = type === 'char';
        if (isChar) {
            const contact = wcGetCurrentSettingsContact();
            const linkedSourceId = String(contact?.linkedContactId || '').trim()
                || (String(contact?.id || '').startsWith('char_') ? String(contact.id).slice(5) : '');
            if (!contact || !linkedSourceId) {
                if (typeof showToast === 'function') showToast('当前聊天未关联角色资料');
                return;
            }
        } else {
            const userId = typeof appSettings !== 'undefined' ? String(appSettings.wc_current_user_id || '') : '';
            if (!userId) {
                if (typeof showToast === 'function') showToast('当前微信未绑定 User 面具');
                return;
            }
        }

        const input = document.getElementById(isChar ? 'wc-quick-char-avatar-input' : 'wc-quick-user-avatar-input');
        if (!input) return;
        input.value = '';
        input.click();
    }
    window.wcTriggerQuickAvatarPicker = wcTriggerQuickAvatarPicker;

    function wcApplyQuickAvatarPreview(element, avatarUrl) {
        if (!element) return;
        if (avatarUrl) {
            element.style.backgroundImage = `url('${avatarUrl}')`;
            element.style.backgroundColor = 'transparent';
            element.style.border = 'none';
            element.innerHTML = '';
            return;
        }
        element.style.backgroundImage = 'none';
        element.style.backgroundColor = 'transparent';
        element.style.border = 'none';
        if (typeof getWcDefaultAvatarSvg === 'function') element.innerHTML = getWcDefaultAvatarSvg();
    }

    async function wcHandleQuickAvatarFile(type, input) {
        const file = input?.files?.[0];
        if (input) input.value = '';
        if (!file) return;

        try {
            const contactsApp = typeof window.loadContactsApp === 'function'
                ? await window.loadContactsApp()
                : window.ContactsApp;
            if (!contactsApp) throw new Error('角色库模块未正确初始化');

            if (type === 'char') {
                const contact = wcGetCurrentSettingsContact();
                const linkedSourceId = String(contact?.linkedContactId || '').trim()
                    || (String(contact?.id || '').startsWith('char_') ? String(contact.id).slice(5) : '');
                if (!contact || !linkedSourceId) throw new Error('当前聊天未关联角色资料');
                if (typeof contactsApp.updateContactAvatarFromFile !== 'function') {
                    throw new Error('角色头像快捷保存能力不可用');
                }

                const updated = await contactsApp.updateContactAvatarFromFile(linkedSourceId, file);
                contact.avatar = updated?.avatar || '';
                contact.avatarOverride = false;
                if (typeof wcSaveContactsDataAsync === 'function') await wcSaveContactsDataAsync();

                wcApplyQuickAvatarPreview(document.getElementById('wc-settings-char-circle'), contact.avatar);
                if (typeof wcRenderContactList === 'function') wcRenderContactList();
                if (typeof wcRenderChatList === 'function') wcRenderChatList();
                if (typeof wcRenderChatMessages === 'function' && typeof wcCurrentChatContactId !== 'undefined') {
                    wcRenderChatMessages(wcCurrentChatContactId);
                }
                if (typeof showToast === 'function') showToast('角色头像已更换');
                return;
            }

            const userId = typeof appSettings !== 'undefined' ? String(appSettings.wc_current_user_id || '') : '';
            if (!userId) throw new Error('当前微信未绑定 User 面具');
            if (typeof contactsApp.updateUserAvatarFromFile !== 'function') {
                throw new Error('User 头像快捷保存能力不可用');
            }

            const updated = await contactsApp.updateUserAvatarFromFile(userId, file);
            const avatar = updated?.avatar || '';
            if (typeof appSettings !== 'undefined') {
                appSettings.wc_current_user_avatar = avatar;
                if (typeof saveAppSettings === 'function') saveAppSettings();
            }

            if (typeof wcGetAuthData === 'function' && typeof wcSaveAuthData === 'function') {
                const authData = await wcGetAuthData();
                const currentUser = Array.isArray(authData?.accounts)
                    ? authData.accounts.find(account => account.wxid === authData.currentLoginWxid)
                    : null;
                if (currentUser) {
                    currentUser.avatar = avatar;
                    await wcSaveAuthData(authData);
                }
            }

            if (typeof wcMomentsProfile !== 'undefined') {
                wcMomentsProfile.avatar = avatar;
                if (typeof wcSaveMomentsProfileData === 'function') wcSaveMomentsProfileData();
            }

            wcApplyQuickAvatarPreview(document.getElementById('wc-settings-user-circle'), avatar);
            if (typeof wcRenderChatMessages === 'function' && typeof wcCurrentChatContactId !== 'undefined') {
                wcRenderChatMessages(wcCurrentChatContactId);
            }
            if (typeof showToast === 'function') showToast('用户头像已更换');
        } catch (error) {
            console.error('Quick avatar update failed:', error);
            if (typeof showToast === 'function') showToast(error?.message || '头像更换失败');
        }
    }
    window.wcHandleQuickAvatarFile = wcHandleQuickAvatarFile;

    function wcChangeSettingsAvatar() {
        // 模拟切换头像
        const colors = ['#ff9500', '#34c759', '#007aff', '#ff3b30', '#af52de'];
        const randomColor = colors[Math.floor(Math.random() * colors.length)];

        document.getElementById('wc-floating-avatar-preview').style.backgroundColor = randomColor;

        if (wcCurrentSettingsAvatarType === 'char') {
            showToast('模拟：已选择新的 Char 头像');
        } else {
            showToast('模拟：已选择新的 User 头像');
        }
    }

    function wcPersistChatLimits() {
        const contact = wcGetCurrentSettingsContact();
        if (!contact) return Promise.resolve(false);

        const minLimitEl = document.getElementById('wc-min-bubble-limit');
        const maxLimitEl = document.getElementById('wc-max-bubble-limit');
        const contextLimitEl = document.getElementById('wc-context-memory-limit');

        const minCandidate = Math.floor(Number(minLimitEl?.value));
        const maxCandidate = Math.floor(Number(maxLimitEl?.value));
        const contextCandidate = Math.floor(Number(contextLimitEl?.value));

        const minLimit = Number.isFinite(minCandidate) && minCandidate > 0 ? minCandidate : 1;
        const maxLimit = Number.isFinite(maxCandidate) && maxCandidate >= minLimit
            ? maxCandidate
            : Math.max(minLimit, 8);
        const contextLimit = Number.isFinite(contextCandidate) && contextCandidate >= 0
            ? contextCandidate
            : 100;

        contact.minBubbleLimit = minLimit;
        contact.maxBubbleLimit = maxLimit;
        contact.contextMemoryLimit = contextLimit;

        if (minLimitEl) minLimitEl.value = String(minLimit);
        if (maxLimitEl) maxLimitEl.value = String(maxLimit);
        if (contextLimitEl) contextLimitEl.value = String(contextLimit);

        return typeof wcSaveContactsDataAsync === 'function'
            ? wcSaveContactsDataAsync()
            : Promise.resolve(false);
    }

    function wcSaveBubbleLimits() {
        void wcPersistChatLimits().catch(error => console.error('保存气泡限制失败', error));
    }
    window.wcSaveBubbleLimits = wcSaveBubbleLimits;

    function wcSaveContextMemoryLimit() {
        void wcPersistChatLimits().catch(error => console.error('保存记忆条数失败', error));
    }
    window.wcSaveContextMemoryLimit = wcSaveContextMemoryLimit;

    function wcSaveReplySpeed() {
        const contact = wcGetCurrentSettingsContact();
        const slider = document.getElementById('wc-reply-speed-slider');
        if (!contact || !slider) return;
        const value = Math.min(300, Math.max(25, Number(slider.value) || 100));
        contact.replySpeed = value;
        const label = document.getElementById('wc-reply-speed-value');
        if (label) label.textContent = `${(value / 100).toFixed(2).replace(/\.00$/, '')}x`;
        if (typeof wcSaveContactsDataAsync === 'function') void wcSaveContactsDataAsync();
    }
    window.wcSaveReplySpeed = wcSaveReplySpeed;

    function wcSaveMomentsPostProbability() {
        if (typeof appSettings === 'undefined') return;
        const input = document.getElementById('wc-moments-post-probability');
        const value = Math.max(0, Math.min(100, Math.round(Number(input?.value) || 0)));
        appSettings.wc_moments_post_probability = value;
        if (input) input.value = String(value);
        if (typeof saveAppSettings === 'function') saveAppSettings();
    }
    window.wcSaveMomentsPostProbability = wcSaveMomentsPostProbability;

    function wcOpenBindEmojiGroups() {
        const contact = wcContactsList.find(c => c.id === wcCurrentChatContactId);
        if (!contact) return;

        // 动态创建 overlay，确保点击一定有反应
        let overlay = document.getElementById('wcBindEmojiOverlay');
        if (!overlay) {
            const overlayHtml = `<div class="wc-bind-emoji-overlay" id="wcBindEmojiOverlay" onclick="if(event.target === this) this.classList.remove('show')"></div>`;
            document.body.insertAdjacentHTML('beforeend', overlayHtml);
            overlay = document.getElementById('wcBindEmojiOverlay');
        }

        const boundGroups = contact.boundEmojiGroups || [];

        let html = `
            <div class="wc-bind-emoji-window" onclick="event.stopPropagation()">
                <!-- 顶部标题栏 -->
                <div class="wc-bind-emoji-header">
                    <div class="wc-bind-emoji-controls">
                        <svg viewBox="0 0 24 24"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                        <svg viewBox="0 0 24 24"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect></svg>
                        <svg viewBox="0 0 24 24"><line x1="5" y1="12" x2="19" y2="12"></line></svg>
                    </div>
                    <div class="wc-bind-emoji-address-bar">
                        <svg viewBox="0 0 24 24"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
                        <span>关联表情包</span>
                    </div>
                </div>

                <!-- 中间网格内容区 -->
                <div class="wc-bind-emoji-content">
                    <div class="wc-bind-emoji-grid">
        `;

        if (wcEmojiGroups.length === 0) {
            html += `<div style="grid-column: 1 / -1; color: #8e8e93; text-align: center; padding: 40px 0; font-size: 14px;">暂无表情包分组</div>`;
        } else {
            // 提取所有表情包用于“全部”卡片的预览
            let allEmojis = [];
            wcEmojiGroups.forEach(g => {
                if (g.emojis) allEmojis = allEmojis.concat(g.emojis);
            });

            // 渲染“全部”卡片
            const isAllChecked = boundGroups.includes('all') ? 'selected' : '';
            let allPreviewHtml = '';
            if (allEmojis.length > 0) {
                const previewCount = Math.min(allEmojis.length, 4);
                for (let i = 0; i < previewCount; i++) {
                    allPreviewHtml += `<div class="wc-bind-emoji-preview-cell" style="background-image: url('${allEmojis[i].url}')"></div>`;
                }
                for (let i = previewCount; i < 4; i++) {
                    allPreviewHtml += `<div class="wc-bind-emoji-preview-cell empty"></div>`;
                }
            } else {
                allPreviewHtml = `<div style="grid-column: 1/-1; display:flex; justify-content:center; align-items:center; font-size: 24px;">📁</div>`;
            }

            html += `
                <div class="wc-bind-emoji-item-wrapper" data-id="all" onclick="this.querySelector('.wc-bind-emoji-card').classList.toggle('selected')">
                    <div class="wc-bind-emoji-card ${isAllChecked}">
                        <div class="wc-bind-emoji-indicator">
                            <svg viewBox="0 0 24 24"><polyline points="20 6 9 17 4 12"></polyline></svg>
                        </div>
                        <div class="wc-bind-emoji-preview ${allEmojis.length > 0 ? 'grid-4' : ''}">
                            ${allPreviewHtml}
                        </div>
                    </div>
                    <div class="wc-bind-emoji-name">全部表情</div>
                </div>
            `;

            // 渲染其他普通分组
            wcEmojiGroups.forEach(g => {
                const isChecked = boundGroups.includes(g.id) ? 'selected' : '';

                // 构建 4 宫格预览
                let previewHtml = '';
                if (g.emojis && g.emojis.length > 0) {
                    const previewCount = Math.min(g.emojis.length, 4);
                    for (let i = 0; i < previewCount; i++) {
                        previewHtml += `<div class="wc-bind-emoji-preview-cell" style="background-image: url('${g.emojis[i].url}')"></div>`;
                    }
                    // 如果不足4个，用空div占位保持网格
                    for (let i = previewCount; i < 4; i++) {
                        previewHtml += `<div class="wc-bind-emoji-preview-cell empty"></div>`;
                    }
                } else {
                    previewHtml = `<div style="grid-column: 1/-1; display:flex; justify-content:center; align-items:center; font-size: 24px;">📁</div>`;
                }

                html += `
                    <div class="wc-bind-emoji-item-wrapper" data-id="${g.id}" onclick="this.querySelector('.wc-bind-emoji-card').classList.toggle('selected')">
                        <div class="wc-bind-emoji-card ${isChecked}">
                            <div class="wc-bind-emoji-indicator">
                                <svg viewBox="0 0 24 24"><polyline points="20 6 9 17 4 12"></polyline></svg>
                            </div>
                            <div class="wc-bind-emoji-preview ${g.emojis && g.emojis.length > 0 ? 'grid-4' : ''}">
                                ${previewHtml}
                            </div>
                        </div>
                        <div class="wc-bind-emoji-name">${g.name}</div>
                    </div>
                `;
            });
        }

        html += `
                    </div>
                </div>

                <!-- 底部状态栏 -->
                <div class="wc-bind-emoji-footer">
                    <div class="wc-bind-emoji-actions">
                        <button class="wc-bind-emoji-btn cancel" onclick="document.getElementById('wcBindEmojiOverlay').classList.remove('show')">取消</button>
                        <button class="wc-bind-emoji-btn save" onclick="wcSaveBindEmojiGroups()">保存绑定</button>
                    </div>
                </div>
            </div>
        `;

        overlay.innerHTML = html;
        overlay.classList.add('show');
    }
    window.wcOpenBindEmojiGroups = wcOpenBindEmojiGroups;

    function wcSaveBindEmojiGroups() {
        const contact = wcContactsList.find(c => c.id === wcCurrentChatContactId);
        if (!contact) return;

        const selectedCards = document.querySelectorAll('.wc-bind-emoji-card.selected');
        const selectedIds = Array.from(selectedCards).map(card => card.closest('.wc-bind-emoji-item-wrapper').getAttribute('data-id'));

        contact.boundEmojiGroups = selectedIds;
        wcSaveContactsDataAsync();

        document.getElementById('wcBindEmojiOverlay').classList.remove('show');
        if (typeof showToast === 'function') showToast('关联表情包已保存');
    }
    window.wcSaveBindEmojiGroups = wcSaveBindEmojiGroups;

    function wcHandleThemeBack() {
        const presetView = document.getElementById('wc-theme-preset-view');
        const customView = document.getElementById('wc-theme-custom-view');
        const editView = document.getElementById('wc-theme-edit-preset-view');
        const fontView = document.getElementById('wc-theme-font-view');
        const avatarView = document.getElementById('wc-theme-avatar-view');
        const bubbleView = document.getElementById('wc-theme-bubble-view');
        const chatBgView = document.getElementById('wc-theme-chat-bg-view');
        const copyCssView = document.getElementById('wc-theme-copy-css-view');

        if (customView.style.display === 'flex') {
            wcShowThemeMenu(); wcResetAllSwipes();
        } else if (editView.style.display === 'flex') {
            wcShowThemePreset(); wcResetAllSwipes();
        } else if (presetView.style.display === 'flex') {
            wcShowThemeMenu(); wcResetAllSwipes();
        } else if (fontView && fontView.style.display === 'flex') {
            wcShowThemeMenu(); wcResetAllSwipes();
        } else if (avatarView && avatarView.style.display === 'flex') {
            wcShowThemeMenu(); wcResetAllSwipes();
        } else if (bubbleView && bubbleView.style.display === 'flex') {
            wcShowThemeMenu(); wcResetAllSwipes();
        } else if (chatBgView && chatBgView.style.display === 'flex') {
            wcShowThemeMenu(); wcResetAllSwipes();
        } else if (copyCssView && copyCssView.style.display === 'flex') {
            wcShowThemeMenu(); wcResetAllSwipes();
        } else {
            wcCloseThemeModal();
        }
    }

    // ==========================================
    // 微信聊天室局部美化预设库逻辑 (与全局个性化主题预设独立隔离)
    // ==========================================

    let wcChatPresets = [];
    let wcCurrentEditId = null;

    function wcEnsureChatPresets() {
        if (typeof window.wcChatPresets === 'undefined' || !Array.isArray(window.wcChatPresets)) {
            if (typeof appSettings !== 'undefined' && Array.isArray(appSettings.wc_chat_presets)) {
                window.wcChatPresets = appSettings.wc_chat_presets;
            } else {
                window.wcChatPresets = [];
            }
        }
        wcChatPresets = window.wcChatPresets;
    }

    function wcSaveChatPresetsToStorage() {
        if (typeof appSettings !== 'undefined') {
            appSettings.wc_chat_presets = wcChatPresets;
            if (typeof saveAppSettings === 'function') saveAppSettings();
        }
    }

    function wcSavePresetsToStorage() {
        if (typeof appSettings !== 'undefined') {
            appSettings.wc_presets = typeof wcPresets !== 'undefined' ? wcPresets : [];
            if (typeof saveAppSettings === 'function') saveAppSettings();
        }
    }

    function wcRenderPresets() {
        wcEnsureChatPresets();
        const container = document.getElementById('wc-theme-preset-view');
        if (!container) return;
        if (wcChatPresets.length === 0) {
            container.innerHTML = '<div style="text-align: center; color: #8e8e93; margin-top: 40px; font-size: 14px; font-weight: 500;">暂无预设主题</div>';
            return;
        }
        const contact = wcContactsList.find(c => c.id === wcCurrentChatContactId);
        const currentPresetId = contact ? contact.currentPresetId : null;
        let html = '';
        wcChatPresets.forEach(preset => {
            const inUseHtml = (preset.id === currentPresetId) ? `<div style="position: absolute; top: 0; right: 0; background: var(--tg-blue); color: #fff; font-size: 10px; padding: 2px 8px; border-radius: 0 20px 0 10px; z-index: 10;">使用中</div>` : '';
            html += `
                <div class="preset-item-wrapper">
                    ${inUseHtml}
                    <div class="preset-item-content" onclick="wcApplyPreset('${preset.id}')" ontouchstart="wcHandleTouchStart(event)" ontouchmove="wcHandleTouchMove(event)" ontouchend="wcHandleTouchEnd(event)">
                        <div class="preset-icon">
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M4 2.9967H20C20.5523 2.9967 21 3.44442 21 3.9967V8.9967C21 9.54899 20.5523 9.9967 20 9.9967H4C3.44772 9.9967 3 9.54899 3 8.9967V3.9967C3 3.44442 3.44772 2.9967 4 2.9967ZM6 11.9967H12C12.5523 11.9967 13 12.4444 13 12.9967V15.9967H14V21.9967H10V15.9967H11V13.9967H5C4.44772 13.9967 4 13.549 4 12.9967V10.9967H6V11.9967ZM17.7322 13.7289L19.5 11.9612L21.2678 13.7289C22.2441 14.7052 22.2441 16.2882 21.2678 17.2645C20.2915 18.2408 18.7085 18.2408 17.7322 17.2645C16.7559 16.2882 16.7559 14.7052 17.7322 13.7289Z"></path></svg>
                        </div>
                        <div class="preset-info"><div class="preset-title">${preset.name}</div></div>
                    </div>
                    <div class="preset-item-actions">
                        <div class="action-capsule edit" onclick="wcOpenEditPreset('${preset.id}')">编辑</div>
                        <div class="action-capsule delete" onclick="wcDeletePreset('${preset.id}')">删除</div>
                    </div>
                </div>
            `;
        });
        container.innerHTML = html;
    }

    function wcShowThemeMenu() {
        document.getElementById('wc-theme-menu-view').style.display = 'flex';
        document.getElementById('wc-theme-preset-view').style.display = 'none';
        document.getElementById('wc-theme-custom-view').style.display = 'none';
        document.getElementById('wc-theme-edit-preset-view').style.display = 'none';
        document.getElementById('wc-theme-font-view').style.display = 'none';
        document.getElementById('wc-theme-avatar-view').style.display = 'none';
        if(document.getElementById('wc-theme-bubble-view')) document.getElementById('wc-theme-bubble-view').style.display = 'none';
        if(document.getElementById('wc-theme-chat-bg-view')) document.getElementById('wc-theme-chat-bg-view').style.display = 'none';
        if(document.getElementById('wc-theme-copy-css-view')) document.getElementById('wc-theme-copy-css-view').style.display = 'none';
        document.querySelector('#wechatAppUI .theme-capsule').style.display = 'flex';
        document.getElementById('wc-custom-preview-box').style.display = 'none';
        document.getElementById('wc-theme-modal-title').innerText = 'WeTheme';
        document.getElementById('wc-capsule-title').innerText = '聊天美化';
        document.getElementById('wc-capsule-icon-svg').innerHTML = '<path d="M4 2.9967H20C20.5523 2.9967 21 3.44442 21 3.9967V8.9967C21 9.54899 20.5523 9.9967 20 9.9967H4C3.44772 9.9967 3 9.54899 3 8.9967V3.9967C3 3.44442 3.44772 2.9967 4 2.9967ZM6 11.9967H12C12.5523 11.9967 13 12.4444 13 12.9967V15.9967H14V21.9967H10V15.9967H11V13.9967H5C4.44772 13.9967 4 13.549 4 12.9967V10.9967H6V11.9967ZM17.7322 13.7289L19.5 11.9612L21.2678 13.7289C22.2441 14.7052 22.2441 16.2882 21.2678 17.2645C20.2915 18.2408 18.7085 18.2408 17.7322 17.2645C16.7559 16.2882 16.7559 14.7052 17.7322 13.7289Z"></path>';
    }

    function wcShowThemePreset() {
        wcRenderPresets(); // 每次进入预设库时重新渲染
        document.getElementById('wc-theme-menu-view').style.display = 'none';
        document.getElementById('wc-theme-preset-view').style.display = 'flex';
        document.getElementById('wc-theme-custom-view').style.display = 'none';
        document.getElementById('wc-theme-edit-preset-view').style.display = 'none';
        document.getElementById('wc-theme-font-view').style.display = 'none';
        document.getElementById('wc-theme-avatar-view').style.display = 'none';
        if(document.getElementById('wc-theme-bubble-view')) document.getElementById('wc-theme-bubble-view').style.display = 'none';
        if(document.getElementById('wc-theme-chat-bg-view')) document.getElementById('wc-theme-chat-bg-view').style.display = 'none';
        document.querySelector('#wechatAppUI .theme-capsule').style.display = 'flex';
        document.getElementById('wc-custom-preview-box').style.display = 'none';
        document.getElementById('wc-theme-modal-title').innerText = '美化预设库';
        document.getElementById('wc-capsule-title').innerText = '美化预设库';
        document.getElementById('wc-capsule-icon-svg').innerHTML = '<path d="M19 6h-2c0-2.76-2.24-5-5-5S7 3.24 7 6H5c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V8c0-1.1-.9-2-2-2zm-7-3c1.66 0 3 1.34 3 3H9c0-1.66 1.34-3 3-3zm0 10c-2.76 0-5-2.24-5-5h2c0 1.66 1.34 3 3 3s3-1.34 3-3h2c0 2.76-2.24 5-5 5z"/>';
    }

    let wcCurrentChatThemePage = 1;

    function wcSwitchChatThemePage(action) {
        if (action === 'prev') {
            wcCurrentChatThemePage = 1;
        } else if (action === 'next') {
            wcCurrentChatThemePage = 2;
        } else {
            wcCurrentChatThemePage = wcCurrentChatThemePage === 1 ? 2 : 1;
        }
        wcUpdateChatThemePageUI();
    }
    window.wcSwitchChatThemePage = wcSwitchChatThemePage;

    function wcUpdateChatThemePageUI() {
        const cssWrap = document.getElementById('wc-chat-theme-css-page');
        const jsWrap = document.getElementById('wc-chat-theme-js-page');
        const label = document.getElementById('wcChatThemePageLabel');
        const prevBtn = document.getElementById('wcChatThemePrevBtn');
        const nextBtn = document.getElementById('wcChatThemeNextBtn');

        if (wcCurrentChatThemePage === 1) {
            if (cssWrap) cssWrap.style.display = 'flex';
            if (jsWrap) jsWrap.style.display = 'none';
            if (label) label.innerText = 'CSS (1/2)';
            if (prevBtn) {
                prevBtn.style.opacity = '0.35';
                prevBtn.style.pointerEvents = 'none';
            }
            if (nextBtn) {
                nextBtn.style.opacity = '1';
                nextBtn.style.pointerEvents = 'auto';
            }
        } else {
            if (cssWrap) cssWrap.style.display = 'none';
            if (jsWrap) jsWrap.style.display = 'flex';
            if (label) label.innerText = 'JS (2/2)';
            if (prevBtn) {
                prevBtn.style.opacity = '1';
                prevBtn.style.pointerEvents = 'auto';
            }
            if (nextBtn) {
                nextBtn.style.opacity = '0.35';
                nextBtn.style.pointerEvents = 'none';
            }
        }
    }
    window.wcUpdateChatThemePageUI = wcUpdateChatThemePageUI;

    function wcShowThemeCustom() {
        document.getElementById('wc-theme-menu-view').style.display = 'none';
        document.getElementById('wc-theme-preset-view').style.display = 'none';
        document.getElementById('wc-theme-custom-view').style.display = 'flex';
        document.getElementById('wc-theme-edit-preset-view').style.display = 'none';
        document.getElementById('wc-theme-font-view').style.display = 'none';
        document.getElementById('wc-theme-avatar-view').style.display = 'none';
        if(document.getElementById('wc-theme-bubble-view')) document.getElementById('wc-theme-bubble-view').style.display = 'none';
        if(document.getElementById('wc-theme-chat-bg-view')) document.getElementById('wc-theme-chat-bg-view').style.display = 'none';
        document.querySelector('#wechatAppUI .theme-capsule').style.display = 'none';
        document.getElementById('wc-custom-preview-box').style.display = 'flex';
        document.getElementById('wc-theme-modal-title').innerText = '自定义美化';

        wcCurrentChatThemePage = 1;
        wcUpdateChatThemePageUI();

        const contact = wcContactsList.find(c => c.id === wcCurrentChatContactId);
        if (contact) {
            const cssInput = document.getElementById('wc-custom-css-input');
            const jsInput = document.getElementById('wc-custom-js-input');
            if (cssInput) cssInput.value = contact.customCss || '';
            if (jsInput) jsInput.value = contact.customJs || '';
        }
    }

    function wcShowThemeFont() {
        const contact = wcContactsList.find(c => c.id === wcCurrentChatContactId);
        if (contact && contact.fontSettings) {
            document.getElementById('wc-font-size-slider').value = contact.fontSettings.size || 16;
            document.getElementById('wc-font-color-received').value = contact.fontSettings.colorReceived || '#000000';
            document.getElementById('wc-font-color-sent').value = contact.fontSettings.colorSent || '#ffffff';
            wcCurrentFontFamily = contact.fontSettings.family || 'default';
        } else {
            document.getElementById('wc-font-size-slider').value = 16;
            document.getElementById('wc-font-color-received').value = '#000000';
            document.getElementById('wc-font-color-sent').value = '#ffffff';
            wcCurrentFontFamily = 'default';
        }

        wcRenderFontList(); // 渲染字体列表
        document.getElementById('wc-theme-menu-view').style.display = 'none';
        document.getElementById('wc-theme-preset-view').style.display = 'none';
        document.getElementById('wc-theme-custom-view').style.display = 'none';
        document.getElementById('wc-theme-edit-preset-view').style.display = 'none';
        document.getElementById('wc-theme-font-view').style.display = 'flex';
        document.getElementById('wc-theme-avatar-view').style.display = 'none';
        if(document.getElementById('wc-theme-bubble-view')) document.getElementById('wc-theme-bubble-view').style.display = 'none';
        if(document.getElementById('wc-theme-chat-bg-view')) document.getElementById('wc-theme-chat-bg-view').style.display = 'none';
        document.querySelector('#wechatAppUI .theme-capsule').style.display = 'none';
        document.getElementById('wc-custom-preview-box').style.display = 'flex';
        document.getElementById('wc-theme-modal-title').innerText = '字体美化';
    }

    function wcShowThemeAvatar() {
        const contact = wcContactsList.find(c => c.id === wcCurrentChatContactId);
        const settings = contact?.avatarSettings || { enabled: true, displayMode: 'all', size: 40, radius: 50, frameUrlChat: '', frameUrlUser: '' };

        const toggleEl = document.getElementById('wc-avatar-toggle');
        if (toggleEl) {
            if (settings.enabled) toggleEl.classList.add('active');
            else toggleEl.classList.remove('active');
        }
        const modeSelect = document.getElementById('wcAvatarDisplayModeText');
        if (modeSelect) {
            const val = settings.displayMode || 'all';
            const map = { 'all': '全程显示', 'first': '首个显示', 'last': '末尾显示' };
            modeSelect.setAttribute('data-value', val);
            modeSelect.innerText = map[val];
        }
        const sizeSlider = document.getElementById('wc-avatar-size-slider');
        if (sizeSlider) sizeSlider.value = settings.size || 40;
        const radiusSlider = document.getElementById('wc-avatar-radius-slider');
        if (radiusSlider) radiusSlider.value = settings.radius || 50;

        wcRenderAvatarFrames(); // 渲染头像框库
        document.getElementById('wc-theme-menu-view').style.display = 'none';
        document.getElementById('wc-theme-preset-view').style.display = 'none';
        document.getElementById('wc-theme-custom-view').style.display = 'none';
        document.getElementById('wc-theme-edit-preset-view').style.display = 'none';
        document.getElementById('wc-theme-font-view').style.display = 'none';
        document.getElementById('wc-theme-avatar-view').style.display = 'flex';
        if(document.getElementById('wc-theme-bubble-view')) document.getElementById('wc-theme-bubble-view').style.display = 'none';
        if(document.getElementById('wc-theme-chat-bg-view')) document.getElementById('wc-theme-chat-bg-view').style.display = 'none';
        document.querySelector('#wechatAppUI .theme-capsule').style.display = 'none';
        document.getElementById('wc-custom-preview-box').style.display = 'flex';
        document.getElementById('wc-theme-modal-title').innerText = '头像显示';
    }

    function wcOpenEditPreset(id) {
        wcEnsureChatPresets();
        const preset = wcChatPresets.find(p => p.id === id);
        if (!preset) return;
        wcCurrentEditId = id;

        document.getElementById('wc-theme-menu-view').style.display = 'none';
        document.getElementById('wc-theme-preset-view').style.display = 'none';
        document.getElementById('wc-theme-custom-view').style.display = 'none';
        document.getElementById('wc-theme-edit-preset-view').style.display = 'flex';
        document.getElementById('wc-theme-font-view').style.display = 'none';
        document.getElementById('wc-theme-avatar-view').style.display = 'none';
        if(document.getElementById('wc-theme-bubble-view')) document.getElementById('wc-theme-bubble-view').style.display = 'none';
        if(document.getElementById('wc-theme-chat-bg-view')) document.getElementById('wc-theme-chat-bg-view').style.display = 'none';
        document.querySelector('#wechatAppUI .theme-capsule').style.display = 'none';
        document.getElementById('wc-custom-preview-box').style.display = 'none';
        document.getElementById('wc-theme-modal-title').innerText = '编辑预设';

        document.getElementById('wc-edit-preset-name').value = preset.name;
        document.getElementById('wc-edit-preset-css').value = preset.css;
    }

    function wcShowThemeChatBg() {
        document.getElementById('wc-theme-menu-view').style.display = 'none';
        document.getElementById('wc-theme-preset-view').style.display = 'none';
        document.getElementById('wc-theme-custom-view').style.display = 'none';
        document.getElementById('wc-theme-edit-preset-view').style.display = 'none';
        document.getElementById('wc-theme-font-view').style.display = 'none';
        document.getElementById('wc-theme-avatar-view').style.display = 'none';
        if(document.getElementById('wc-theme-bubble-view')) document.getElementById('wc-theme-bubble-view').style.display = 'none';
        
        const bgView = document.getElementById('wc-theme-chat-bg-view');
        if (bgView) {
            bgView.style.display = 'flex';
            bgView.style.flexDirection = 'column';
            bgView.style.flex = '1';
            bgView.style.minHeight = '240px';
        }

        const capsule = document.querySelector('#wechatAppUI .theme-capsule');
        if (capsule) capsule.style.display = 'flex';
        const capsuleTitle = document.getElementById('wc-capsule-title');
        if (capsuleTitle) capsuleTitle.innerText = '聊天壁纸';
        const capsuleSvg = document.getElementById('wc-capsule-icon-svg');
        if (capsuleSvg) {
            capsuleSvg.innerHTML = '<path d="M21 19V5c0-1.1-.9-2-2-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2zM8.5 13.5l2.5 3.01L14.5 12l4.5 6H5l3.5-4.5z"/>';
        }

        document.getElementById('wc-custom-preview-box').style.display = 'none';
        document.getElementById('wc-theme-modal-title').innerText = '聊天壁纸';

        if (typeof wcLoadChatBgDataFromDB === 'function') {
            wcLoadChatBgDataFromDB().then(() => {
                if (typeof wcRenderChatBgLibrary === 'function') wcRenderChatBgLibrary();
            });
        } else if (typeof wcRenderChatBgLibrary === 'function') {
            wcRenderChatBgLibrary();
        }
    }

    function wcSaveEditedPreset() {
        if (!wcCurrentEditId) return;
        wcEnsureChatPresets();
        const preset = wcChatPresets.find(p => p.id === wcCurrentEditId);
        if (preset) {
            preset.name = document.getElementById('wc-edit-preset-name').value.trim() || '未命名';
            preset.css = document.getElementById('wc-edit-preset-css').value;
            wcSaveChatPresetsToStorage();
            showCustomAlert("提示", "预设已保存！");
            wcShowThemePreset();
        }
    }

    function wcDeletePreset(id) {
        wcEnsureChatPresets();
        showCustomConfirm('删除预设', '确定要删除这个美化预设吗？', '删除', true).then(confirmed => {
            if (confirmed) {
                wcChatPresets = wcChatPresets.filter(p => p.id !== id);
                window.wcChatPresets = wcChatPresets;
                wcSaveChatPresetsToStorage();
                wcRenderPresets();
            }
        });
    }

    function wcApplyPreset(id) {
        wcEnsureChatPresets();
        const preset = wcChatPresets.find(p => p.id === id);
        if (preset) {
            const cssInput = document.getElementById('wc-custom-css-input');
            const jsInput = document.getElementById('wc-custom-js-input');
            if (cssInput) cssInput.value = preset.css || '';
            if (jsInput) jsInput.value = preset.js || '';
            const contact = wcContactsList.find(c => c.id === wcCurrentChatContactId);
            if (contact) {
                contact.customCss = preset.css || '';
                contact.customJs = preset.js || '';
                contact.currentPresetId = id;
                wcSaveContactsDataAsync();
            }
            wcApplyCustomCss(preset.css || '');
            wcApplyCustomJs(preset.js || '');
            wcRenderPresets();
            showCustomAlert("提示", `已应用主题：${preset.name}`);
        }
    }

    function wcToggleSwitch(element) { element.classList.toggle('active'); }

    function wcGetCurrentSettingsContact(contactId) {
        const resolvedContactId = contactId !== undefined && contactId !== null
            ? contactId
            : (typeof wcCurrentChatContactId !== 'undefined' ? wcCurrentChatContactId : null);
        if (typeof wcContactsList === 'undefined' || !Array.isArray(wcContactsList) || resolvedContactId === null) return null;
        return wcContactsList.find(item => String(item.id) === String(resolvedContactId)) || null;
    }

    let wcWorldbookBindingOriginalEntryIds = new Set();
    let wcWorldbookBindingExpandedGroupIds = new Set();

    function wcGetWorldbookRuntimeData() {
        const groups = typeof window.getWorldbookGroups === 'function'
            ? window.getWorldbookGroups()
            : (typeof wbGroups !== 'undefined' && Array.isArray(wbGroups)
                ? wbGroups.filter(group => group && group.id).map(group => ({ id: group.id, name: group.name }))
                : []);
        const entries = typeof wbEntries !== 'undefined' && Array.isArray(wbEntries)
            ? wbEntries.filter(entry => entry && !entry.isDeleted)
            : [];
        return { groups, entries };
    }

    function wcGetWorldbookBindingConfig(contactId) {
        const contact = wcGetCurrentSettingsContact(contactId);
        const legacyGroupId = String(contact?.worldbookOverrideGroupId || '').trim();
        const hasExplicitEnabled = typeof contact?.worldbookOverrideEnabled === 'boolean';
        const enabled = hasExplicitEnabled ? contact.worldbookOverrideEnabled : Boolean(legacyGroupId);
        const groupIds = Array.isArray(contact?.worldbookOverrideGroupIds)
            ? contact.worldbookOverrideGroupIds.map(id => String(id || '').trim()).filter(Boolean)
            : (legacyGroupId ? [legacyGroupId] : []);
        const disabledEntryIds = Array.isArray(contact?.worldbookDisabledEntryIds)
            ? contact.worldbookDisabledEntryIds.map(id => String(id || '').trim()).filter(Boolean)
            : [];
        return {
            enabled,
            groupIds: Array.from(new Set(groupIds)),
            disabledEntryIds: Array.from(new Set(disabledEntryIds)),
            isLegacyOnly: !hasExplicitEnabled && Boolean(legacyGroupId)
        };
    }
    window.wcGetWorldbookBindingConfig = wcGetWorldbookBindingConfig;

    async function wcLoadOriginalWorldbookBindingIds() {
        const contact = wcGetCurrentSettingsContact();
        if (!contact) return new Set();

        let ids = Array.isArray(contact.worldbookIds) ? contact.worldbookIds : [];
        const linkedSourceId = String(contact.linkedContactId || '').trim()
            || (String(contact.id || '').startsWith('char_') ? String(contact.id).slice(5) : '');

        if (linkedSourceId && typeof wcReadLayoutRecord === 'function') {
            try {
                const record = await wcReadLayoutRecord('contactsAppData');
                const sourceContacts = Array.isArray(record?.data?.contacts) ? record.data.contacts : [];
                const sourceContact = sourceContacts.find(item => String(item?.id || '') === linkedSourceId);
                if (Array.isArray(sourceContact?.worldbookIds)) ids = sourceContact.worldbookIds;
            } catch (error) {
                console.warn('读取联系人原世界书绑定失败:', error);
            }
        }

        return new Set(ids.map(id => String(id || '').trim()).filter(Boolean));
    }

    async function wcPersistWorldbookBindingConfig(config) {
        const contact = wcGetCurrentSettingsContact();
        if (!contact) return false;

        const normalizedGroups = Array.from(new Set(
            (Array.isArray(config?.groupIds) ? config.groupIds : [])
                .map(id => String(id || '').trim())
                .filter(Boolean)
        ));
        const normalizedDisabledEntries = Array.from(new Set(
            (Array.isArray(config?.disabledEntryIds) ? config.disabledEntryIds : [])
                .map(id => String(id || '').trim())
                .filter(Boolean)
        ));

        contact.worldbookOverrideEnabled = config?.enabled === true;
        contact.worldbookOverrideGroupIds = normalizedGroups;
        contact.worldbookDisabledEntryIds = normalizedDisabledEntries;
        contact.worldbookOverrideGroupId = contact.worldbookOverrideEnabled && normalizedGroups.length === 1
            ? normalizedGroups[0]
            : '';

        if (typeof wcSaveContactsDataAsync === 'function') {
            await wcSaveContactsDataAsync();
        }
        wcApplyWorldbookBindingSettings();
        return true;
    }

    function wcGetWorldbookEntryActiveState(entry, config, selectedGroups, disabledEntries) {
        if (!entry || config?.enabled !== true) return false;
        const entryId = String(entry.id || '');
        if (!entryId || disabledEntries.has(entryId)) return false;
        return entry.isGlobal === true || selectedGroups.has(String(entry.groupId || ''));
    }

    function wcApplyWorldbookBindingSettings() {
        const subtitle = document.getElementById('wc-worldbook-binding-subtitle');
        if (!subtitle) return;

        const config = wcGetWorldbookBindingConfig();
        if (!config.enabled) {
            subtitle.textContent = '跟随世界书 App 原绑定';
            return;
        }

        const { entries } = wcGetWorldbookRuntimeData();
        const selectedGroups = new Set(config.groupIds.map(String));
        const disabledEntries = new Set(config.disabledEntryIds.map(String));
        const activeCount = entries.filter(entry =>
            wcGetWorldbookEntryActiveState(entry, config, selectedGroups, disabledEntries)
        ).length;

        subtitle.textContent = activeCount
            ? `聊天专属 · ${activeCount} 条词条`
            : '聊天专属 · 未选择词条';
    }
    window.wcApplyWorldbookBindingSettings = wcApplyWorldbookBindingSettings;

    async function wcShowWorldbookBindingSettings() {
        const contact = wcGetCurrentSettingsContact();
        if (!contact) return;

        const mainView = document.getElementById('wc-main-settings-view');
        const bindingView = document.getElementById('wc-worldbook-binding-view');
        const title = document.getElementById('wc-settings-modal-title');
        if (!bindingView) return;

        if (mainView) mainView.style.display = 'none';
        bindingView.style.display = 'flex';
        if (title) title.innerText = '世界书绑定';

        const { groups } = wcGetWorldbookRuntimeData();
        wcWorldbookBindingExpandedGroupIds = new Set(groups.map(group => String(group.id || '')).filter(Boolean));
        wcWorldbookBindingOriginalEntryIds = new Set();
        wcRenderWorldbookBindingList();
        wcWorldbookBindingOriginalEntryIds = await wcLoadOriginalWorldbookBindingIds();
        wcRenderWorldbookBindingList();
    }
    window.wcShowWorldbookBindingSettings = wcShowWorldbookBindingSettings;

    async function wcSetWorldbookBindingMode(enabled) {
        const config = wcGetWorldbookBindingConfig();
        const nextConfig = {
            enabled: enabled === true,
            groupIds: config.groupIds.slice(),
            disabledEntryIds: config.disabledEntryIds.slice()
        };

        if (nextConfig.enabled && nextConfig.groupIds.length === 0) {
            if (!wcWorldbookBindingOriginalEntryIds.size) {
                wcWorldbookBindingOriginalEntryIds = await wcLoadOriginalWorldbookBindingIds();
            }
            const { entries } = wcGetWorldbookRuntimeData();
            nextConfig.groupIds = Array.from(new Set(
                entries
                    .filter(entry => wcWorldbookBindingOriginalEntryIds.has(String(entry.id)))
                    .map(entry => String(entry.groupId || '').trim())
                    .filter(Boolean)
            ));
        }

        await wcPersistWorldbookBindingConfig(nextConfig);
        wcRenderWorldbookBindingList();
    }
    window.wcSetWorldbookBindingMode = wcSetWorldbookBindingMode;

    async function wcToggleWorldbookOverride() {
        const config = wcGetWorldbookBindingConfig();
        await wcSetWorldbookBindingMode(!config.enabled);
    }
    window.wcToggleWorldbookOverride = wcToggleWorldbookOverride;

    async function wcToggleWorldbookGroup(groupId, event) {
        if (event && typeof event.stopPropagation === 'function') event.stopPropagation();
        const config = wcGetWorldbookBindingConfig();
        if (!config.enabled) return;

        const normalizedId = String(groupId || '').trim();
        if (!normalizedId) return;

        const { entries } = wcGetWorldbookRuntimeData();
        const groupEntries = entries.filter(entry => String(entry.groupId || '') === normalizedId);
        if (!groupEntries.length) return;

        const selectedGroups = new Set(config.groupIds.map(String));
        const disabledEntries = new Set(config.disabledEntryIds.map(String));
        const allActive = groupEntries.every(entry =>
            wcGetWorldbookEntryActiveState(entry, config, selectedGroups, disabledEntries)
        );

        if (allActive) {
            selectedGroups.delete(normalizedId);
            groupEntries.forEach(entry => disabledEntries.add(String(entry.id || '')));
        } else {
            selectedGroups.add(normalizedId);
            groupEntries.forEach(entry => disabledEntries.delete(String(entry.id || '')));
        }

        await wcPersistWorldbookBindingConfig({
            enabled: true,
            groupIds: Array.from(selectedGroups),
            disabledEntryIds: Array.from(disabledEntries)
        });
        wcRenderWorldbookBindingList();
    }
    window.wcToggleWorldbookGroup = wcToggleWorldbookGroup;

    async function wcToggleWorldbookEntry(entryId, groupId, event) {
        if (event && typeof event.stopPropagation === 'function') event.stopPropagation();
        const config = wcGetWorldbookBindingConfig();
        if (!config.enabled) return;

        const normalizedEntryId = String(entryId || '').trim();
        const normalizedGroupId = String(groupId || '').trim();
        if (!normalizedEntryId) return;

        const { entries } = wcGetWorldbookRuntimeData();
        const entry = entries.find(item => String(item.id || '') === normalizedEntryId);
        if (!entry) return;

        const selectedGroups = new Set(config.groupIds.map(String));
        const disabledEntries = new Set(config.disabledEntryIds.map(String));
        const isActive = wcGetWorldbookEntryActiveState(entry, config, selectedGroups, disabledEntries);

        if (isActive) {
            disabledEntries.add(normalizedEntryId);
        } else {
            const groupWasSelected = selectedGroups.has(normalizedGroupId);
            if (!entry.isGlobal && normalizedGroupId && !groupWasSelected) {
                const siblings = entries.filter(item => String(item.groupId || '') === normalizedGroupId);
                siblings.forEach(sibling => {
                    const siblingId = String(sibling.id || '');
                    const siblingWasActive = sibling.isGlobal === true && !disabledEntries.has(siblingId);
                    if (siblingId && siblingId !== normalizedEntryId && !siblingWasActive) {
                        disabledEntries.add(siblingId);
                    }
                });
                selectedGroups.add(normalizedGroupId);
            }
            disabledEntries.delete(normalizedEntryId);
        }

        await wcPersistWorldbookBindingConfig({
            enabled: true,
            groupIds: Array.from(selectedGroups),
            disabledEntryIds: Array.from(disabledEntries)
        });
        wcRenderWorldbookBindingList();
    }
    window.wcToggleWorldbookEntry = wcToggleWorldbookEntry;

    function wcToggleWorldbookGroupExpanded(groupId) {
        const normalizedId = String(groupId || '').trim();
        if (!normalizedId) return;

        if (wcWorldbookBindingExpandedGroupIds.has(normalizedId)) {
            wcWorldbookBindingExpandedGroupIds.delete(normalizedId);
        } else {
            wcWorldbookBindingExpandedGroupIds.add(normalizedId);
        }
        wcRenderWorldbookBindingList();
    }
    window.wcToggleWorldbookGroupExpanded = wcToggleWorldbookGroupExpanded;

    function wcCreateStoreStyleCheckbox(checked, onClick) {
        const checkbox = document.createElement('div');
        checkbox.className = 'store-wb-sq-checkbox' + (checked ? ' checked' : '');
        checkbox.innerHTML = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 13l4 4L19 7" stroke="#ffffff" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" fill="none"></path></svg>';
        checkbox.addEventListener('click', onClick);
        return checkbox;
    }

    function wcRenderWorldbookBindingList() {
        const list = document.getElementById('wc-worldbook-binding-list');
        if (!list) return;

        const config = wcGetWorldbookBindingConfig();
        const { groups, entries } = wcGetWorldbookRuntimeData();
        const selectedGroups = new Set(config.groupIds.map(String));
        const disabledEntries = new Set(config.disabledEntryIds.map(String));

        const customToggle = document.getElementById('wc-worldbook-custom-toggle');
        if (customToggle) {
            customToggle.classList.toggle('active', config.enabled);
            customToggle.setAttribute('aria-checked', String(config.enabled));
            customToggle.style.backgroundColor = config.enabled ? '#333333' : '#A1A1AA';
        }

        const modeHint = document.getElementById('wc-worldbook-custom-mode-hint');
        if (modeHint) {
            modeHint.textContent = config.enabled
                ? '已开启，这里的选择会覆盖当前角色原绑定'
                : `已关闭，当前跟随原绑定（${wcWorldbookBindingOriginalEntryIds.size} 条）`;
        }

        const activeEntries = entries.filter(entry =>
            wcGetWorldbookEntryActiveState(entry, config, selectedGroups, disabledEntries)
        );

        const summary = document.getElementById('wc-worldbook-binding-summary');
        if (summary) {
            summary.textContent = config.enabled
                ? `已选择 ${activeEntries.length} 个词条`
                : `原绑定 ${wcWorldbookBindingOriginalEntryIds.size} 条`;
        }

        list.classList.toggle('wc-wb-store-tree-disabled', !config.enabled);
        list.replaceChildren();

        const renderGroup = (group, groupEntries) => {
            if (!groupEntries.length) return;

            const groupId = String(group.id || '');
            const expanded = wcWorldbookBindingExpandedGroupIds.has(groupId);
            const activeInGroup = groupEntries.filter(entry =>
                wcGetWorldbookEntryActiveState(entry, config, selectedGroups, disabledEntries)
            );
            const allChecked = config.enabled && activeInGroup.length === groupEntries.length;

            const groupNode = document.createElement('div');
            groupNode.className = 'store-wb-tree-group' + (expanded ? ' expanded' : '');

            const header = document.createElement('div');
            header.className = 'store-wb-tree-head';
            header.addEventListener('click', () => wcToggleWorldbookGroupExpanded(groupId));

            const left = document.createElement('div');
            left.className = 'store-wb-head-left';

            const arrow = document.createElement('div');
            arrow.className = 'store-wb-play-arrow';
            arrow.innerHTML = '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M7.5 4.8C6.5 4.2 5.2 4.9 5.2 6.1v11.8c0 1.2 1.3 1.9 2.3 1.3l9.8-5.9c1-.6 1-2 0-2.6L7.5 4.8z"></path></svg>';

            const folder = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
            folder.setAttribute('class', 'store-wb-folder-icon');
            folder.setAttribute('viewBox', '0 0 24 24');
            folder.setAttribute('aria-hidden', 'true');
            const folderPath = document.createElementNS('http://www.w3.org/2000/svg', 'path');
            folderPath.setAttribute('d', 'M20 18H4V8h16v10zm0-12H11L9 4H4C2.9 4 2 4.9 2 6v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V8c0-1.1-.9-2-2-2z');
            folder.appendChild(folderPath);

            const title = document.createElement('span');
            title.className = 'store-wb-group-title';
            title.textContent = `${group.name || '未命名世界书'} (${groupEntries.length})`;

            left.append(arrow, folder, title);

            const groupCheckbox = wcCreateStoreStyleCheckbox(allChecked, event => {
                event.stopPropagation();
                if (!config.enabled) return;
                void wcToggleWorldbookGroup(groupId, event);
            });

            header.append(left, groupCheckbox);
            groupNode.appendChild(header);

            const body = document.createElement('div');
            body.className = 'store-wb-tree-body';

            const guide = document.createElement('div');
            guide.className = 'store-wb-tree-line';

            const branchList = document.createElement('div');
            branchList.className = 'store-wb-branch-list';

            groupEntries.forEach(entry => {
                const entryId = String(entry.id || '');
                const entryActive = wcGetWorldbookEntryActiveState(entry, config, selectedGroups, disabledEntries);

                const row = document.createElement('div');
                row.className = 'store-wb-tree-item';
                row.addEventListener('click', () => {
                    if (!config.enabled) return;
                    void wcToggleWorldbookEntry(entryId, groupId);
                });

                const entryCheckbox = wcCreateStoreStyleCheckbox(config.enabled && entryActive, event => {
                    event.stopPropagation();
                    if (!config.enabled) return;
                    void wcToggleWorldbookEntry(entryId, groupId, event);
                });

                const meta = document.createElement('div');
                meta.className = 'store-wb-item-meta';

                const name = document.createElement('div');
                name.className = 'store-wb-item-name';
                name.textContent = entry.title || '未命名条目';

                const keys = document.createElement('div');
                keys.className = 'store-wb-item-keys';
                const details = [];
                if (entry.isGlobal === true) details.push('全局');
                if (wcWorldbookBindingOriginalEntryIds.has(entryId)) details.push('原绑定');
                const keyText = String(entry.key || '').trim();
                details.push(keyText ? `触发词: ${keyText}` : '无触发词');
                keys.textContent = details.join(' · ');

                meta.append(name, keys);
                row.append(entryCheckbox, meta);
                branchList.appendChild(row);
            });

            body.append(guide, branchList);
            groupNode.appendChild(body);
            list.appendChild(groupNode);
        };

        groups.forEach(group => {
            const groupEntries = entries.filter(entry => String(entry.groupId || '') === String(group.id || ''));
            renderGroup(group, groupEntries);
        });

        if (!list.children.length) {
            const empty = document.createElement('div');
            empty.className = 'wc-wb-store-empty';
            empty.textContent = '世界书暂无可用条目，请先在世界书 App 中创建';
            list.appendChild(empty);
        }
    }
    window.wcRenderWorldbookBindingList = wcRenderWorldbookBindingList;

    const WC_MEMORY_DIAGNOSTIC_MODES = new Set(['A', 'B', 'C']);
    const WC_MEMORY_DIAGNOSTIC_LABELS = Object.freeze({
        A: 'A：完整记忆',
        B: 'B：关闭所有记忆注入',
        C: 'C：仅长期记忆'
    });

    function wcGetMemoryDiagnosticMode(contactId) {
        const contact = wcGetCurrentSettingsContact(contactId);
        const mode = String(contact?.memoryDiagnosticMode || 'A').toUpperCase();
        return WC_MEMORY_DIAGNOSTIC_MODES.has(mode) ? mode : 'A';
    }
    window.wcGetMemoryDiagnosticMode = wcGetMemoryDiagnosticMode;

    function wcApplyMemoryDiagnosticSettings() {
        const mode = wcGetMemoryDiagnosticMode();
        document.querySelectorAll('#wechatAppUI .wc-memory-diagnostic-option').forEach((button) => {
            const active = button.dataset.mode === mode;
            button.classList.toggle('is-active', active);
            button.setAttribute('aria-pressed', String(active));
        });
        const subtitle = document.getElementById('wc-memory-diagnostic-subtitle');
        if (subtitle) subtitle.textContent = WC_MEMORY_DIAGNOSTIC_LABELS[mode] || WC_MEMORY_DIAGNOSTIC_LABELS.A;
    }
    window.wcApplyMemoryDiagnosticSettings = wcApplyMemoryDiagnosticSettings;

    function wcSetMemoryDiagnosticMode(mode, event) {
        if (event && typeof event.stopPropagation === 'function') event.stopPropagation();
        const normalizedMode = String(mode || '').toUpperCase();
        if (!WC_MEMORY_DIAGNOSTIC_MODES.has(normalizedMode)) return;
        const contact = wcGetCurrentSettingsContact();
        if (!contact) return;
        contact.memoryDiagnosticMode = normalizedMode;
        if (typeof wcSaveContactsDataAsync === 'function') void wcSaveContactsDataAsync();
        wcApplyMemoryDiagnosticSettings();
        if (typeof showToast === 'function') showToast(WC_MEMORY_DIAGNOSTIC_LABELS[normalizedMode]);
    }
    window.wcSetMemoryDiagnosticMode = wcSetMemoryDiagnosticMode;

    function wcIsTimeAwarenessEnabled(contactId) {
        const contact = wcGetCurrentSettingsContact(contactId);
        if (contact && typeof contact.timeAwarenessEnabled === 'boolean') {
            return contact.timeAwarenessEnabled;
        }
        // Legacy fallback: older versions stored this setting globally.
        return typeof appSettings === 'undefined' || appSettings?.wc_time_awareness_enabled !== false;
    }
    window.wcIsTimeAwarenessEnabled = wcIsTimeAwarenessEnabled;

    function wcApplyTimeAwarenessSettings() {
        wcApplyMemoryDiagnosticSettings();
        wcApplyWorldbookBindingSettings();
        const toggle = document.getElementById('wc-time-awareness-toggle');
        const enabled = wcIsTimeAwarenessEnabled();
        if (!toggle) return;
        toggle.classList.toggle('active', enabled);
        toggle.setAttribute('aria-checked', String(enabled));
    }

    function wcToggleTimeAwareness() {
        const contact = wcGetCurrentSettingsContact();
        if (!contact) return;
        contact.timeAwarenessEnabled = !wcIsTimeAwarenessEnabled();
        if (typeof wcSaveContactsDataAsync === 'function') void wcSaveContactsDataAsync();
        wcApplyTimeAwarenessSettings();
        window.ProactivePush?.scheduleSync(contact.id);
    }

    function wcApplyLongDistanceModeSettings() {
        const toggle = document.getElementById('wc-long-distance-mode-toggle');
        const contact = wcContactsList.find(item => item.id === wcCurrentChatContactId);
        const enabled = contact?.longDistanceModeEnabled === true;
        if (!toggle) return;
        toggle.classList.toggle('active', enabled);
        toggle.setAttribute('aria-checked', String(enabled));
    }

    function wcToggleLongDistanceMode() {
        const contact = wcContactsList.find(item => item.id === wcCurrentChatContactId);
        if (!contact) return;
        contact.longDistanceModeEnabled = contact.longDistanceModeEnabled !== true;
        void wcSaveContactsDataAsync();
        wcApplyLongDistanceModeSettings();
    }
    window.wcToggleLongDistanceMode = wcToggleLongDistanceMode;

    function wcApplyOnlineNarrationSettings() {
        const toggle = document.getElementById('wc-online-narration-toggle');
        const subtitle = document.getElementById('wc-online-narration-status-subtitle');
        const contact = wcContactsList.find(item => item.id === wcCurrentChatContactId);
        const enabled = contact?.onlineNarrationEnabled === true;
        if (toggle) {
            toggle.classList.toggle('active', enabled);
            toggle.setAttribute('aria-checked', String(enabled));
        }
        if (subtitle) subtitle.textContent = enabled
            ? '已开启，可从功能面板发送动作描写'
            : '允许发送动作描写，并让 TA 生成独立旁白气泡';
    }

    function wcToggleOnlineNarration() {
        const contact = wcContactsList.find(item => item.id === wcCurrentChatContactId);
        if (!contact) return;
        contact.onlineNarrationEnabled = contact.onlineNarrationEnabled !== true;
        void wcSaveContactsDataAsync();
        if (typeof wcResetOnlineNarrationInputMode === 'function') wcResetOnlineNarrationInputMode();
        if (contact.onlineNarrationEnabled !== true) document.getElementById('wc-func-btn-online-narration')?.remove();
        wcApplyOnlineNarrationSettings();
    }
    window.wcApplyOnlineNarrationSettings = wcApplyOnlineNarrationSettings;
    window.wcToggleOnlineNarration = wcToggleOnlineNarration;

    function wcApplyBlacklistSettings() {
        const titleEl = document.getElementById('wc-blacklist-btn-title');
        const contact = wcContactsList.find(item => item.id === wcCurrentChatContactId);
        const isBlocked = contact?.isBlacklisted === true;
        if (titleEl) {
            titleEl.textContent = isBlocked ? '该好友已被拉黑' : '拉黑好友';
        }
    }
    window.wcApplyBlacklistSettings = wcApplyBlacklistSettings;

    async function wcToggleBlacklist() {
        const contact = wcContactsList.find(item => item.id === wcCurrentChatContactId);
        if (!contact) return;
        const wasBlacklisted = (contact.isBlacklisted === true);
        const contactName = contact.remark || contact.name || '该好友';
        const actionTitle = wasBlacklisted ? '解除拉黑' : '拉黑好友';
        const actionMessage = wasBlacklisted
            ? `确定要将“${contactName}”移出黑名单吗？`
            : `加入黑名单后，你将不再收到“${contactName}”发来的微信消息。确定要拉黑吗？`;

        let confirmed = false;
        if (typeof showCustomConfirm === 'function') {
            confirmed = await showCustomConfirm(actionTitle, actionMessage, actionTitle, true);
        } else {
            confirmed = window.confirm(actionMessage);
        }
        if (!confirmed) return;

        contact.isBlacklisted = !wasBlacklisted;

        // 以隐藏上下文消息的形式存入聊天记录（不以系统提示词常驻，聊过即自然翻篇）
        if (contact.isBlacklisted) {
            wcAppendChatMessage('[系统通知：你已被对方加入微信黑名单，在微信发出的消息将被对方拒收（显示红色感叹号❗）。如有紧急事宜，可通过手机短信联系对方]', 'system_event', wcCurrentChatContactId);
        } else {
            wcAppendChatMessage('[系统通知：对方已将你移出黑名单（解除了微信拉黑），微信通信已恢复正常]', 'system_event', wcCurrentChatContactId);
        }
        delete contact.justUnblocked;
        delete contact.unblockedAt;

        await wcSaveContactsDataAsync();
        wcApplyBlacklistSettings();
        if (typeof showToast === 'function') {
            showToast(contact.isBlacklisted ? '已拉黑该联系人' : '已解除拉黑');
        }
    }
    window.wcToggleBlacklist = wcToggleBlacklist;

    const WC_PROACTIVE_IDLE_MS = 30 * 60 * 1000;
    const WC_PROACTIVE_MIN_INTERVAL_MINUTES = 1;
    const WC_PROACTIVE_MAX_INTERVAL_MINUTES = 24 * 60;
    let wcProactiveMessageTimer = null;
    let wcProactiveMessageRunning = false;
    let wcProactiveMessageLifecycleBound = false;

    function wcApplyProactiveMessageSettings() {
        const toggle = document.getElementById('wc-proactive-message-toggle');
        const contact = wcContactsList.find(item => String(item.id) === String(wcCurrentChatContactId));
        const enabled = contact?.proactiveMessageEnabled === true;
        if (toggle) {
            toggle.classList.toggle('active', enabled);
            toggle.setAttribute('aria-checked', String(enabled));
        }
        const intervalInput = document.getElementById('wc-proactive-message-interval');
        const intervalDescription = document.getElementById('wc-proactive-message-interval-description');
        const intervalMinutes = wcGetProactiveMessageIntervalMinutes(contact);
        if (intervalInput) intervalInput.value = intervalMinutes ? String(intervalMinutes) : '';
        if (intervalDescription) intervalDescription.textContent = intervalMinutes ? `每 ${intervalMinutes} 分钟主动发消息一次` : '由 TA 的人设和聊天状态决定何时主动找你';

        const frequencyRow = document.getElementById('wc-proactive-frequency-row');
        if (frequencyRow) {
            frequencyRow.style.display = enabled ? 'flex' : 'none';
        }
    }

    function wcGetProactiveMessageIntervalMinutes(contact) {
        const value = Math.round(Number(contact?.proactiveMessageIntervalMinutes));
        return Number.isFinite(value) && value >= WC_PROACTIVE_MIN_INTERVAL_MINUTES && value <= WC_PROACTIVE_MAX_INTERVAL_MINUTES
            ? value
            : null;
    }

    async function wcToggleProactiveMessages() {
        const contact = wcContactsList.find(item => String(item.id) === String(wcCurrentChatContactId));
        if (!contact) return;
        const enabled = contact.proactiveMessageEnabled !== true;
        contact.proactiveMessageEnabled = enabled;
        if (enabled) {
            delete contact.proactiveMessageAutoNextAt;
        }
        await wcSaveContactsDataAsync();
        wcApplyProactiveMessageSettings();
        wcStartProactiveMessageScheduler();
        wcScheduleProactiveMessage();
        if (typeof showToast === 'function') showToast(enabled ? '已开启角色主动消息' : '已关闭角色主动消息');
    }
    window.wcToggleProactiveMessages = wcToggleProactiveMessages;

    async function wcSaveProactiveMessageInterval(value) {
        const contact = wcContactsList.find(item => String(item.id) === String(wcCurrentChatContactId));
        if (!contact) return;
        const text = String(value || '').trim();
        let minutes = Math.round(Number(text));

        if (!text || !Number.isFinite(minutes) || minutes < WC_PROACTIVE_MIN_INTERVAL_MINUTES || minutes > WC_PROACTIVE_MAX_INTERVAL_MINUTES) {
            delete contact.proactiveMessageIntervalMinutes;
            delete contact.proactiveMessageAutoNextAt;
            await wcSaveContactsDataAsync();
            wcApplyProactiveMessageSettings();
            wcScheduleProactiveMessage();
            window.ProactivePush?.scheduleSync(contact.id);
            if (typeof showToast === 'function') showToast('已恢复自动判断');
            return;
        }

        contact.proactiveMessageIntervalMinutes = minutes;
        delete contact.proactiveMessageAutoNextAt;
        await wcSaveContactsDataAsync();
        wcApplyProactiveMessageSettings();
        wcScheduleProactiveMessage();
        window.ProactivePush?.scheduleSync(contact.id);
        if (typeof showToast === 'function') showToast(`已设为每 ${minutes} 分钟主动发消息`);
    }
    window.wcSaveProactiveMessageInterval = wcSaveProactiveMessageInterval;

    function wcGetProactiveMessageNextAt(contact, messages) {
        const latestAt = Number(messages[messages.length - 1]?.createdAt || 0);
        const lastSentAt = Number(contact?.proactiveMessageLastSentAt || 0);
        const latestActivityAt = Math.max(latestAt, lastSentAt);
        const lastMeetingAt = window.getMeetingProactiveActivityAt?.(contact.id) || 0;
        const intervalMinutes = wcGetProactiveMessageIntervalMinutes(contact);
        const aiNextAt = Number(contact?.proactiveMessageAutoNextAt || 0);
        const nextAt = intervalMinutes ? latestActivityAt + intervalMinutes * 60000
            : (aiNextAt > latestActivityAt ? aiNextAt : latestActivityAt + WC_PROACTIVE_IDLE_MS);
        return Math.max(nextAt, Number(contact?.proactiveMessageRetryAt || 0),
            lastMeetingAt ? lastMeetingAt + (intervalMinutes || 15) * 60000 : 0);
    }

    function wcGetProactiveMessageScheduleState() {
        const now = Date.now();
        const scheduled = wcContactsList.filter(contact => contact?.proactiveMessageEnabled === true && contact?.proactivePushRegistered !== true)
            .map(contact => {
                const messages = wcChatMessagesByContact[contact.id] || [];
                return messages.length ? { contact, nextAt: wcGetProactiveMessageNextAt(contact, messages) } : null;
            })
            .filter(Boolean)
            .sort((left, right) => left.nextAt - right.nextAt);
        const next = scheduled[0] || null;
        return { contact: next && next.nextAt <= now ? next.contact : null, nextAt: next?.nextAt || 0 };
    }

    function wcGetProactiveMessageCandidate() {
        return wcGetProactiveMessageScheduleState().contact;
    }

    function wcScheduleProactiveMessage() {
        if (wcProactiveMessageTimer) clearTimeout(wcProactiveMessageTimer);
        wcProactiveMessageTimer = null;
        if (window.isMeetingSceneActive?.()) return;
        if (document.visibilityState !== 'hidden') return;
        // Only contacts with a confirmed remote subscription are handled by the Worker.
        // All other enabled contacts remain available through the local fallback.
        const schedule = wcGetProactiveMessageScheduleState();
        if (!schedule.nextAt) { wcProactiveMessageTimer = setTimeout(wcScheduleProactiveMessage, 5 * 60 * 1000); return; }
        if (schedule.contact) { void wcRunProactiveMessage(); return; }
        wcProactiveMessageTimer = setTimeout(() => { void wcRunProactiveMessage(); }, Math.max(1000, schedule.nextAt - Date.now()));
    }

    async function wcRunProactiveMessage() {
        if (wcProactiveMessageRunning || document.visibilityState !== 'hidden' || window.isMeetingSceneActive?.()) return;
        const contact = wcGetProactiveMessageCandidate();
        if (!contact) return wcScheduleProactiveMessage();
        wcProactiveMessageRunning = true;
        try {
            const messages = wcChatMessagesByContact[contact.id] || [];
            const intervalMinutes = wcGetProactiveMessageIntervalMinutes(contact);
            const replies = await wcRequestApiReply({ contactId: contact.id, proactive: true,
                autoDecision: !intervalMinutes });
            if (!replies?.length && !(contact.proactiveMessageAutoNextAt > Date.now())) {
                contact.proactiveMessageRetryAt = Date.now() + 5 * 60000;
                await wcSaveContactsDataAsync();
            }
        } catch (error) {
            contact.proactiveMessageRetryAt = Date.now() + 5 * 60000;
            await wcSaveContactsDataAsync();
            console.debug('Local proactive check deferred:', error);
        }
        finally { wcProactiveMessageRunning = false; wcScheduleProactiveMessage(); }
    }

    function wcStartProactiveMessageScheduler() {
        if (wcProactiveMessageLifecycleBound) return;
        wcProactiveMessageLifecycleBound = true;
        document.addEventListener('visibilitychange', wcScheduleProactiveMessage);
        window.addEventListener('pageshow', wcScheduleProactiveMessage);
        window.addEventListener('meeting:scene-change', wcScheduleProactiveMessage);
    }

    async function wcShowProactiveMessageNotification(contact, message) {
        if (document.visibilityState !== 'hidden' || appSettings?.message_notifications_enabled !== true || !('Notification' in window) || Notification.permission !== 'granted') return;
        const messageId = String(message?.id || crypto.randomUUID());
        const options = { body: String(message?.text || '你有一条新消息').slice(0, 120), icon: contact.avatar || 'https://nos.netease.com/ysf/39cad7c5aef80d006becb9c7b22b43cf.png', tag: `wc-proactive-${contact.id}-${messageId}`, renotify: false, data: { contactId: contact.id } };
        try { const registration = await navigator.serviceWorker?.ready; if (registration?.showNotification) await registration.showNotification(`${contact.remark || contact.name || '角色'} 发来一条消息`, options); else new Notification(`${contact.remark || contact.name || '角色'} 发来一条消息`, options); } catch (error) { console.debug('Web message notification unavailable:', error); }
    }

    function wcReceiveBackendMessage(contactId, payload) {
        if (payload?.sourceChannel !== 'qq' && window.isMeetingSceneActive?.()) return null;
        const text = String(payload?.replyContent || payload?.messageText || payload?.text || '').trim();
        if (!contactId || typeof wcAppendChatMessage !== 'function') return null;
        const id = String(payload?.messageId || payload?.id || '').trim();
        // Notifications carry only a preview; retrieve the full formatted reply through sync.
        if (!text && id) {
            void window.ProactivePush?.sync(contactId)?.catch(error => console.debug('Proactive reply sync deferred:', error));
            return null;
        }
        if (!text) return null;
        const createdAt = window.WcChatTemporal.readTimestamp(payload?.timestamp || payload?.createdAt);
        // Stable ids protect both notification clicks and sync replay from duplicate insertion.
        const messageId = id || 'proactive_legacy_' + String(createdAt || '') + '_' + text;
        const replies = typeof window.wcPrepareProactiveReply === 'function'
            ? window.wcPrepareProactiveReply(text, contactId, payload?.dossierTemplateId || '')
            : (!/^\s*[\[{]/.test(text) ? [{ text }] : []);
        let result = null;
        replies.forEach((reply, index) => {
            result = wcAppendChatMessage(reply.text, 'received', contactId, null, reply.replyTo || null,
                reply.isVoice === true, null, null, { remoteMessageId: index ? messageId + ':' + index : messageId,
                    sourceChannel: payload?.sourceChannel === 'qq' ? 'qq' : 'proactive',
                    createdAt, isAction: reply.isAction === true, translation: reply.translation || '',
                    mindDossier: reply.mindDossier || null, reasoning: reply.reasoning || '',
                    coupleAvatarInvite: reply.coupleAvatarInvite || null });
        });
        return result;
    }
    window.wcReceiveBackendMessage = wcReceiveBackendMessage;
    if ('serviceWorker' in navigator) navigator.serviceWorker.addEventListener('message', event => {
        if (event.data?.type !== 'wc-proactive-message' || !event.data.contactId) return;
        wcReceiveBackendMessage(event.data.contactId, event.data);
        wcOpenChatRoom(event.data.contactId);
    });
    function wcConsumeProactiveNotificationQuery() {
        const query = new URLSearchParams(window.location.search);
        const contactId = query.get('proactiveContact');
        if (!contactId) return;
        wcReceiveBackendMessage(contactId, { messageText: query.get('proactiveMessage'),
            messageId: query.get('proactiveMessageId'), timestamp: query.get('proactiveTimestamp') });
        wcOpenChatRoom(contactId);
        ['proactiveContact', 'proactiveMessage', 'proactiveMessageId', 'proactiveTimestamp'].forEach(key => query.delete(key));
        const nextQuery = query.toString();
        window.history.replaceState({}, '', window.location.pathname + (nextQuery ? '?' + nextQuery : '') + window.location.hash);
    }
    window.addEventListener('load', () => { wcStartProactiveMessageScheduler(); wcScheduleProactiveMessage(); wcConsumeProactiveNotificationQuery(); }, { once: true });

    function wcIsWeatherAwarenessEnabled(contactId) {
        const contact = wcGetCurrentSettingsContact(contactId);
        if (contact && typeof contact.weatherAwarenessEnabled === 'boolean') {
            return contact.weatherAwarenessEnabled;
        }
        // Legacy fallback: older versions stored this setting globally.
        return typeof appSettings === 'undefined' || appSettings?.wc_weather_awareness_enabled !== false;
    }
    window.wcIsWeatherAwarenessEnabled = wcIsWeatherAwarenessEnabled;

    function wcApplyWeatherAwarenessSettings() {
        const toggle = document.getElementById('wc-weather-awareness-toggle');
        const enabled = wcIsWeatherAwarenessEnabled();
        if (!toggle) return;
        toggle.classList.toggle('active', enabled);
        toggle.setAttribute('aria-checked', String(enabled));
    }

    function wcToggleWeatherAwareness() {
        const contact = wcGetCurrentSettingsContact();
        if (!contact) return;
        contact.weatherAwarenessEnabled = !wcIsWeatherAwarenessEnabled();
        if (typeof wcSaveContactsDataAsync === 'function') void wcSaveContactsDataAsync();
        wcApplyWeatherAwarenessSettings();
    }

    const wcWeatherCache = new Map();
    const wcLocationResolveCache = new Map();
    const wcChinaProvinceNames = new Set([
        '北京', '天津', '河北', '山西', '内蒙古', '辽宁', '吉林', '黑龙江',
        '上海', '江苏', '浙江', '安徽', '福建', '江西', '山东', '河南',
        '湖北', '湖南', '广东', '广西', '海南', '重庆', '四川', '贵州',
        '云南', '西藏', '陕西', '甘肃', '青海', '宁夏', '新疆', '香港',
        '澳门', '台湾'
    ]);
    const wcChinaProvinceFallbackCoordinates = {
        '北京': { name: '北京', latitude: 39.9042, longitude: 116.4074 },
        '天津': { name: '天津', latitude: 39.3434, longitude: 117.3616 },
        '河北': { name: '石家庄', latitude: 38.0428, longitude: 114.5149 },
        '山西': { name: '太原', latitude: 37.8706, longitude: 112.5489 },
        '内蒙古': { name: '呼和浩特', latitude: 40.8426, longitude: 111.7492 },
        '辽宁': { name: '沈阳', latitude: 41.8057, longitude: 123.4315 },
        '吉林': { name: '长春', latitude: 43.8171, longitude: 125.3235 },
        '黑龙江': { name: '哈尔滨', latitude: 45.8038, longitude: 126.5349 },
        '上海': { name: '上海', latitude: 31.2304, longitude: 121.4737 },
        '江苏': { name: '南京', latitude: 32.0603, longitude: 118.7969 },
        '浙江': { name: '杭州', latitude: 30.2741, longitude: 120.1551 },
        '安徽': { name: '合肥', latitude: 31.8206, longitude: 117.2272 },
        '福建': { name: '福州', latitude: 26.0745, longitude: 119.2965 },
        '江西': { name: '南昌', latitude: 28.6820, longitude: 115.8579 },
        '山东': { name: '济南', latitude: 36.6512, longitude: 117.1201 },
        '河南': { name: '郑州', latitude: 34.7466, longitude: 113.6254 },
        '湖北': { name: '武汉', latitude: 30.5928, longitude: 114.3055 },
        '湖南': { name: '长沙', latitude: 28.2282, longitude: 112.9388 },
        '广东': { name: '广州', latitude: 23.1291, longitude: 113.2644 },
        '广西': { name: '南宁', latitude: 22.8170, longitude: 108.3669 },
        '海南': { name: '海口', latitude: 20.0440, longitude: 110.1999 },
        '重庆': { name: '重庆', latitude: 29.5630, longitude: 106.5516 },
        '四川': { name: '成都', latitude: 30.5728, longitude: 104.0668 },
        '贵州': { name: '贵阳', latitude: 26.6470, longitude: 106.6302 },
        '云南': { name: '昆明', latitude: 25.0389, longitude: 102.7183 },
        '西藏': { name: '拉萨', latitude: 29.6500, longitude: 91.1000 },
        '陕西': { name: '西安', latitude: 34.3416, longitude: 108.9398 },
        '甘肃': { name: '兰州', latitude: 36.0611, longitude: 103.8343 },
        '青海': { name: '西宁', latitude: 36.6171, longitude: 101.7782 },
        '宁夏': { name: '银川', latitude: 38.4872, longitude: 106.2309 },
        '新疆': { name: '乌鲁木齐', latitude: 43.8256, longitude: 87.6168 },
        '香港': { name: '香港', latitude: 22.3193, longitude: 114.1694 },
        '澳门': { name: '澳门', latitude: 22.1987, longitude: 113.5439 },
        '台湾': { name: '台北', latitude: 25.0330, longitude: 121.5654 }
    };

    function wcNormalizeWeatherLocationName(value) {
        return String(value || '')
            .normalize('NFKC')
            .replace(/\s+/gu, '')
            .replace(/(?:壮族自治区|维吾尔自治区|回族自治区|特别行政区|自治区|自治州|地区|盟|省|市)$/u, '')
            .trim()
            .toLowerCase();
    }

    function wcTokenizeWeatherLocationQuery(value) {
        return String(value || '')
            .normalize('NFKC')
            .split(/[，,、/|\s]+/u)
            .map(wcNormalizeWeatherLocationName)
            .filter(Boolean);
    }

    function wcGetLocationFeatureScore(featureCode) {
        const code = String(featureCode || '').toUpperCase();
        const weights = {
            PPLC: 220,
            PPLA: 195,
            PPLA2: 180,
            PPLA3: 145,
            PPLA4: 115,
            PPL: 80,
            ADM1: 70,
            ADM2: 35
        };
        return weights[code] || 0;
    }

    function wcScoreWeatherLocationCandidate(item, normalizedPlace, queryTokens, isProvinceQuery) {
        const normalizedName = wcNormalizeWeatherLocationName(item?.name);
        const normalizedAdmins = [item?.admin1, item?.admin2, item?.admin3, item?.admin4]
            .filter(Boolean)
            .map(wcNormalizeWeatherLocationName);
        const featureCode = String(item?.feature_code || '').toUpperCase();
        let score = 0;
    
        if (normalizedName === normalizedPlace) score += 1200;
        else if ([normalizedName, ...normalizedAdmins].includes(normalizedPlace)) score += 450;
    
        queryTokens.forEach((token, index) => {
            if (!token) return;
            if (normalizedName === token) score += index === 0 ? 500 : 220;
            if (normalizedAdmins.includes(token)) score += index === 0 ? 180 : 420;
        });
    
        score += wcGetLocationFeatureScore(featureCode);
    
        const population = Number(item?.population);
        if (Number.isFinite(population) && population > 0) {
            score += Math.min(320, Math.log10(population + 1) * 48);
        }
    
        if (isProvinceQuery) {
            if (featureCode === 'ADM1' && (normalizedName === normalizedPlace || normalizedAdmins.includes(normalizedPlace))) {
                score += 2000;
            } else {
                score -= 900;
            }
        } else if (featureCode === 'ADM1') {
            score -= 120;
        }
    
        return score;
    }

    function wcGetChinaFallbackTimeZone(normalizedPlace) {
        if (normalizedPlace === '香港') return 'Asia/Hong_Kong';
        if (normalizedPlace === '澳门') return 'Asia/Macau';
        if (normalizedPlace === '台湾') return 'Asia/Taipei';
        return 'Asia/Shanghai';
    }

    async function wcResolveRealLocation(location = '') {
        const place = String(location || '').trim();
        if (!place) return null;
    
        const cacheKey = `v1:${place.toLowerCase()}`;
        const cached = wcLocationResolveCache.get(cacheKey);
        if (cached && Date.now() - cached.updatedAt < 86400000) return cached.value;
    
        try {
            const geocodeResponse = await fetch(`https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(place)}&count=20&language=zh&format=json`);
            if (!geocodeResponse.ok) return null;
            const geocodeData = await geocodeResponse.json();
            const candidates = Array.isArray(geocodeData?.results) ? geocodeData.results : [];
            const normalizedPlace = wcNormalizeWeatherLocationName(place);
            const queryTokens = wcTokenizeWeatherLocationQuery(place);
            const isProvinceQuery = wcChinaProvinceNames.has(normalizedPlace);
    
            let result = candidates
                .map(item => ({
                    item,
                    score: wcScoreWeatherLocationCandidate(item, normalizedPlace, queryTokens, isProvinceQuery)
                }))
                .sort((a, b) => b.score - a.score)[0]?.item || null;
    
            if (!result && isProvinceQuery && wcChinaProvinceFallbackCoordinates[normalizedPlace]) {
                const fallback = wcChinaProvinceFallbackCoordinates[normalizedPlace];
                result = {
                    ...fallback,
                    admin1: place,
                    feature_code: 'ADM1',
                    country_code: 'CN',
                    country: '中国',
                    timezone: wcGetChinaFallbackTimeZone(normalizedPlace)
                };
            }
    
            if (!result || !Number.isFinite(Number(result.latitude)) || !Number.isFinite(Number(result.longitude))) {
                return null;
            }
    
            const resolvedName = String(result.name || place).trim();
            const admin1 = String(result.admin1 || '').trim();
            const country = String(result.country || '').trim();
            const normalizedResolvedName = wcNormalizeWeatherLocationName(resolvedName);
            const normalizedAdmin1 = wcNormalizeWeatherLocationName(admin1);
            const region = admin1 && normalizedAdmin1 !== normalizedResolvedName ? admin1 : '';
            const displayName = [resolvedName, region, country && String(result.country_code || '').toUpperCase() !== 'CN' ? country : '']
                .filter(Boolean)
                .join('，');
    
            const value = {
                query: place,
                name: resolvedName,
                admin1,
                country,
                countryCode: String(result.country_code || '').toUpperCase(),
                latitude: Number(result.latitude),
                longitude: Number(result.longitude),
                timezone: String(result.timezone || (isProvinceQuery ? wcGetChinaFallbackTimeZone(normalizedPlace) : '')).trim(),
                featureCode: String(result.feature_code || ''),
                population: Number(result.population) || 0,
                displayName: displayName || resolvedName || place
            };
            wcLocationResolveCache.set(cacheKey, { value, updatedAt: Date.now() });
            return value;
        } catch (error) {
            return null;
        }
    }

    window.wcResolveRealLocation = wcResolveRealLocation;



    function wcDescribeWeather(currentWeather) {
        const weatherCode = currentWeather.weathercode;
        const temp = currentWeather.temperature;
        let weatherDesc = '晴';
        if (weatherCode === 1 || weatherCode === 2 || weatherCode === 3) weatherDesc = '多云';
        else if (weatherCode >= 45 && weatherCode <= 55) weatherDesc = '雾';
        else if (weatherCode >= 61 && weatherCode <= 67) weatherDesc = '雨';
        else if (weatherCode >= 71 && weatherCode <= 77) weatherDesc = '雪';
        else if (weatherCode >= 80 && weatherCode <= 82) weatherDesc = '阵雨';
        else if (weatherCode >= 95 && weatherCode <= 99) weatherDesc = '雷雨';
        return `${weatherDesc}，${temp}°C`;
    }



    async function wcGetRealWeather(location = '') {
        const place = String(location || '').trim();
        const cacheKey = `v4:${place.toLowerCase() || '__device_location__'}`;
        const cached = wcWeatherCache.get(cacheKey);
        if (cached && Date.now() - cached.updatedAt < 3600000) return cached.value;
    
        if (place) {
            try {
                const resolved = await wcResolveRealLocation(place);
                if (!resolved) return null;
                const weatherResponse = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${resolved.latitude}&longitude=${resolved.longitude}&current_weather=true&timezone=auto`);
                if (!weatherResponse.ok) return null;
                const weatherData = await weatherResponse.json();
                if (!weatherData?.current_weather) return null;
                const value = `${place}（${resolved.displayName}）：${wcDescribeWeather(weatherData.current_weather)}`;
                wcWeatherCache.set(cacheKey, { value, updatedAt: Date.now() });
                return value;
            } catch (error) {
                return null;
            }
        }
    
        return new Promise((resolve) => {
            if (!navigator.geolocation) {
                resolve(null);
                return;
            }
            navigator.geolocation.getCurrentPosition(async (position) => {
                try {
                    const lat = position.coords.latitude;
                    const lon = position.coords.longitude;
                    const res = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current_weather=true&timezone=auto`);
                    const data = await res.json();
                    if (data && data.current_weather) {
                        const value = wcDescribeWeather(data.current_weather);
                        wcWeatherCache.set(cacheKey, { value, updatedAt: Date.now() });
                        resolve(value);
                    } else {
                        resolve(null);
                    }
                } catch (e) {
                    resolve(null);
                }
            }, () => {
                resolve(null);
            }, { timeout: 3000 });
        });
    }

    window.wcGetRealWeather = wcGetRealWeather;

    function wcApplyTimestampSettings() {
        let styleTag = document.getElementById('wc-dynamic-timestamp-style');
        if (!styleTag) {
            styleTag = document.createElement('style');
            styleTag.id = 'wc-dynamic-timestamp-style';
            document.head.appendChild(styleTag);
        }
        const contact = wcContactsList.find(c => c.id === wcCurrentChatContactId);
        const enabled = contact ? (contact.timestampEnabled !== false) : true; // 默认开启

        if (enabled) {
            styleTag.innerHTML = `#wechatAppUI .msg-meta { display: flex !important; } #wechatAppUI #wc-chat-area .message-bubble:has(> .msg-text):not(.transfer-bubble) > .msg-meta { display: inline-flex !important; }`;
        } else {
            styleTag.innerHTML = `#wechatAppUI .msg-meta, #wechatAppUI #wc-chat-area .message-bubble:has(> .msg-text):not(.transfer-bubble) > .msg-meta { display: none !important; }`;
        }

        const toggleEl = document.getElementById('wc-timestamp-toggle');
        if (toggleEl) {
            if (enabled) toggleEl.classList.add('active');
            else toggleEl.classList.remove('active');
        }
    }

    function wcToggleTimestamp(element) {
        element.classList.toggle('active');
        const enabled = element.classList.contains('active');
        const contact = wcContactsList.find(c => c.id === wcCurrentChatContactId);
        if (contact) {
            contact.timestampEnabled = enabled;
            wcSaveContactsDataAsync();
        }
        wcApplyTimestampSettings();
    }

    function wcToggleIMessageBar(element) {
        element.classList.toggle('active');
        const isEnabled = element.classList.contains('active');
        const contact = wcContactsList.find(c => c.id === wcCurrentChatContactId);
        if (contact) {
            contact.imessage_bar_enabled = isEnabled;
            if (isEnabled) {
                contact.retro_bar_enabled = false;
                const retroToggle = document.getElementById('wc-retro-bar-toggle');
                if (retroToggle) retroToggle.classList.remove('active');
                if (typeof wcApplyRetroBarSettings === 'function') wcApplyRetroBarSettings();

                contact.iss_star_bar_enabled = false;
                const issStarToggle = document.getElementById('wc-iss-star-bar-toggle');
                if (issStarToggle) issStarToggle.classList.remove('active');
                if (typeof wcApplyIssStarBarSettings === 'function') wcApplyIssStarBarSettings();

                contact.pink_layer_card_bar_enabled = false;
                const pinkLayerToggle = document.getElementById('wc-pink-layer-card-bar-toggle');
                if (pinkLayerToggle) pinkLayerToggle.classList.remove('active');
                if (typeof wcApplyPinkLayerCardBarSettings === 'function') wcApplyPinkLayerCardBarSettings();

                contact.qq_bar_enabled = false;
                const qqToggle = document.getElementById('wc-qq-bar-toggle');
                if (qqToggle) qqToggle.classList.remove('active');
                if (typeof wcApplyQqBarSettings === 'function') wcApplyQqBarSettings();
            }
            wcSaveContactsDataAsync();
        }
        wcApplyIMessageBarSettings();
    }

    function wcToggleRetroBar(element) {
        element.classList.toggle('active');
        const isEnabled = element.classList.contains('active');
        const contact = wcContactsList.find(c => c.id === wcCurrentChatContactId);
        if (contact) {
            contact.retro_bar_enabled = isEnabled;
            if (isEnabled) {
                contact.imessage_bar_enabled = false;
                const imessageToggle = document.getElementById('wc-imessage-bar-toggle');
                if (imessageToggle) imessageToggle.classList.remove('active');
                if (typeof wcApplyIMessageBarSettings === 'function') wcApplyIMessageBarSettings();

                contact.iss_star_bar_enabled = false;
                const issStarToggle = document.getElementById('wc-iss-star-bar-toggle');
                if (issStarToggle) issStarToggle.classList.remove('active');
                if (typeof wcApplyIssStarBarSettings === 'function') wcApplyIssStarBarSettings();

                contact.pink_layer_card_bar_enabled = false;
                const pinkLayerToggle = document.getElementById('wc-pink-layer-card-bar-toggle');
                if (pinkLayerToggle) pinkLayerToggle.classList.remove('active');
                if (typeof wcApplyPinkLayerCardBarSettings === 'function') wcApplyPinkLayerCardBarSettings();

                contact.qq_bar_enabled = false;
                const qqToggle = document.getElementById('wc-qq-bar-toggle');
                if (qqToggle) qqToggle.classList.remove('active');
                if (typeof wcApplyQqBarSettings === 'function') wcApplyQqBarSettings();
            }
            wcSaveContactsDataAsync();
        }
        wcApplyRetroBarSettings();
    }


    function wcApplyIMessageBarSettings() {
        let styleTag = document.getElementById('wc-dynamic-imessage-bar-style');
        if (!styleTag) {
            styleTag = document.createElement('style');
            styleTag.id = 'wc-dynamic-imessage-bar-style';
            document.head.appendChild(styleTag);
        }

        const contact = wcContactsList.find(c => c.id === wcCurrentChatContactId);
        const isEnabled = contact && contact.imessage_bar_enabled === true;

        if (isEnabled) {
            styleTag.textContent = `
                #wechatAppUI #page-chat-room { background-color: #ffffff !important; }
                #wechatAppUI .chat-header-container { background: transparent !important; border: none !important; box-shadow: none !important; backdrop-filter: none !important; -webkit-backdrop-filter: none !important; padding: 0 16px !important; align-items: flex-start !important; height: auto !important; margin-top: 5px !important; }

                /* 顶部左右按钮：增加 margin-top: 10px 往下移 */
                #wechatAppUI .chat-header-container .room-icon-btn { width: 48px !important; height: 48px !important; background-color: rgba(255, 255, 255, 0.75) !important; backdrop-filter: blur(25px) saturate(180%) !important; -webkit-backdrop-filter: blur(25px) saturate(180%) !important; border: 1px solid rgba(0, 0, 0, 0.06) !important; box-shadow: 0 8px 24px rgba(0, 0, 0, 0.05) !important; border-radius: 50% !important; margin-top: 10px !important; }

                /* 彻底隐藏原版 SVG */
                #wechatAppUI .chat-header-container .room-icon-btn svg { display: none !important; }

                /* 左上角返回图标 (安全 URL 编码) */
                #wechatAppUI .chat-header-container .room-icon-btn:first-child { background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 24 24' fill='none' stroke='black' stroke-width='1.5' stroke-linecap='round' stroke-linejoin='round' xmlns='http://www.w3.org/2000/svg'%3E%3Cpolyline points='15 18 9 12 15 6'%3E%3C/polyline%3E%3C/svg%3E") !important; background-size: 32px 32px !important; background-position: center !important; background-repeat: no-repeat !important; }

                /* 右上角视频图标 (安全 URL 编码) */
                #wechatAppUI .chat-header-container .room-icon-btn:last-child { background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke-width='1.5' stroke='black'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' d='m15.75 10.5 4.72-4.72a.75.75 0 0 1 1.28.53v11.38a.75.75 0 0 1-1.28.53l-4.72-4.72M4.5 18.75h9a2.25 2.25 0 0 0 2.25-2.25v-9a2.25 2.25 0 0 0-2.25-2.25h-9A2.25 2.25 0 0 0 2.25 7.5v9a2.25 2.25 0 0 0 2.25 2.25Z' /%3E%3C/svg%3E") !important; background-size: 28px 28px !important; background-position: center !important; background-repeat: no-repeat !important; }

                /* 顶部中间头像与名字胶囊 */
                #wechatAppUI .chat-header-container .room-info-capsule { background: transparent !important; border: none !important; box-shadow: none !important; backdrop-filter: none !important; -webkit-backdrop-filter: none !important; flex-direction: column !important; align-items: center !important; margin-top: -5px !important; padding: 0 !important; overflow: visible !important; }
                #wechatAppUI .chat-header-container .room-info-capsule .avatar { width: 64px !important; height: 64px !important; margin: 0 !important; z-index: 2 !important; box-shadow: 0 4px 12px rgba(0,0,0,0.08) !important; }
                #wechatAppUI .chat-header-container .room-info-text { background: rgba(255, 255, 255, 0.75) !important; backdrop-filter: blur(25px) saturate(180%) !important; -webkit-backdrop-filter: blur(25px) saturate(180%) !important; border: 1px solid rgba(0, 0, 0, 0.06) !important; box-shadow: 0 8px 24px rgba(0, 0, 0, 0.05) !important; border-radius: 24px !important; padding: 8px 16px 8px 20px !important; margin-top: -8px !important; z-index: 1 !important; flex-direction: row !important; align-items: center !important; gap: 4px !important; }
                #wechatAppUI .chat-header-container .room-info-text .name { font-size: 17px !important; font-weight: 800 !important; color: #000 !important; }
                #wechatAppUI .chat-header-container .room-info-text .sub { display: none !important; }
                #wechatAppUI .chat-header-container .room-info-text::after { content: ''; display: block !important; width: 16px !important; height: 16px !important; background-color: #c7c7cc !important; -webkit-mask: url("data:image/svg+xml,%3Csvg viewBox='0 0 24 24' fill='none' stroke='black' stroke-width='3' stroke-linecap='round' stroke-linejoin='round' xmlns='http://www.w3.org/2000/svg'%3E%3Cpolyline points='9 18 15 12 9 6'%3E%3C/polyline%3E%3C/svg%3E") center/contain no-repeat !important; }

                /* 底栏重构 */
                #wechatAppUI .footer-capsule { background: transparent !important; border: none !important; box-shadow: none !important; backdrop-filter: none !important; -webkit-backdrop-filter: none !important; padding: 0 !important; border-radius: 0 !important; position: absolute !important; bottom: calc(16px + env(safe-area-inset-bottom)) !important; left: 16px !important; right: 16px !important; display: flex !important; align-items: center !important; gap: 12px !important; height: 44px !important; }

                /* 隐藏底栏原版 SVG 内部的所有路径 */
                #wechatAppUI .footer-capsule > svg path, #wechatAppUI .footer-capsule > svg circle, #wechatAppUI .footer-capsule > svg line, #wechatAppUI .footer-capsule > svg polyline, #wechatAppUI .footer-capsule > svg rect, #wechatAppUI .footer-capsule .room-send-btn svg path, #wechatAppUI .footer-capsule .room-send-btn svg line, #wechatAppUI .footer-capsule .room-send-btn svg polyline { display: none !important; }

                /* 1. 左侧加号按钮 (安全 URL 编码) */
                #wechatAppUI .footer-capsule svg[onclick*="wcToggleFunctionPanel"] { order: 1 !important; width: 40px !important; height: 40px !important; border-radius: 50% !important; background: rgba(255, 255, 255, 0.75) url("data:image/svg+xml,%3Csvg viewBox='0 0 24 24' fill='none' stroke='black' stroke-width='2.2' stroke-linecap='round' stroke-linejoin='round' xmlns='http://www.w3.org/2000/svg'%3E%3Cline x1='12' y1='5' x2='12' y2='19'%3E%3C/line%3E%3Cline x1='5' y1='12' x2='19' y2='12'%3E%3C/line%3E%3C/svg%3E") center/24px no-repeat !important; backdrop-filter: blur(25px) saturate(180%) !important; -webkit-backdrop-filter: blur(25px) saturate(180%) !important; border: 1px solid rgba(0, 0, 0, 0.06) !important; box-shadow: 0 8px 24px rgba(0, 0, 0, 0.05) !important; margin: 0 !important; padding: 0 !important; flex-shrink: 0 !important; display: block !important; }

                /* 2. 输入框 */
                #wechatAppUI .footer-capsule input { order: 2 !important; flex: 1 !important; height: 44px !important; background-color: rgba(255, 255, 255, 0.75) !important; backdrop-filter: blur(25px) saturate(180%) !important; -webkit-backdrop-filter: blur(25px) saturate(180%) !important; border: 1px solid rgba(0, 0, 0, 0.06) !important; box-shadow: 0 8px 24px rgba(0, 0, 0, 0.05) !important; border-radius: 22px !important; padding: 0 40px 0 18px !important; font-size: 16px !important; color: #000 !important; margin: 0 !important; }
                #wechatAppUI .footer-capsule input::placeholder { color: transparent !important; }
                #wechatAppUI .footer-capsule input:placeholder-shown { background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='150' height='44'%3E%3Ctext x='0' y='27' fill='%23c7c7cc' font-family='-apple-system, BlinkMacSystemFont, sans-serif' font-size='16' font-weight='500'%3EiMessage 信息%3C/text%3E%3C/svg%3E") !important; background-repeat: no-repeat !important; background-position: 18px center !important; }

                /* 3. 语音图标 (安全 URL 编码，绝不糊) */
                #wechatAppUI .footer-capsule svg[onclick*="wcToggleEmojiPanel"] { order: 3 !important; position: absolute !important; right: 60px !important; top: 50% !important; transform: translateY(-50%) !important; width: 18px !important; height: 18px !important; margin: 0 !important; padding: 0 !important; z-index: 2 !important; display: block !important; background: transparent url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='%238e8e93' viewBox='0 0 16 16'%3E%3Cpath d='M3.5 6.5A0.5 0.5 0 0 1 4 7v1a4 4 0 0 0 8 0V7a0.5 0.5 0 0 1 1 0v1a5 5 0 0 1 -4.5 4.975V15h3a0.5 0.5 0 0 1 0 1h-7a0.5 0.5 0 0 1 0 -1h3v-2.025A5 5 0 0 1 3 8V7a0.5 0.5 0 0 1 0.5 -0.5' stroke-width='1'/%3E%3Cpath d='M10 8a2 2 0 1 1 -4 0V3a2 2 0 1 1 4 0zM8 0a3 3 0 0 0 -3 3v5a3 3 0 0 0 6 0V3a3 3 0 0 0 -3 -3' stroke-width='1'/%3E%3C/svg%3E") center/18px no-repeat !important; }

                /* 4. 右侧发送按钮 (安全 URL 编码) */
                #wechatAppUI .footer-capsule .room-send-btn { order: 4 !important; width: 36px !important; height: 36px !important; border-radius: 50% !important; background-color: #007aff !important; box-shadow: 0 2px 8px rgba(0, 122, 255, 0.3) !important; margin: 0 !important; display: flex !important; justify-content: center !important; align-items: center !important; flex-shrink: 0 !important; position: relative !important; }
                #wechatAppUI .footer-capsule .room-send-btn svg { display: block !important; width: 22px !important; height: 22px !important; background: transparent url("data:image/svg+xml,%3Csvg viewBox='0 0 24 24' fill='none' stroke='white' stroke-width='3' stroke-linecap='round' stroke-linejoin='round' xmlns='http://www.w3.org/2000/svg'%3E%3Cline x1='12' y1='20' x2='12' y2='4'%3E%3C/line%3E%3Cpolyline points='6 10 12 4 18 10'%3E%3C/polyline%3E%3C/svg%3E") center/contain no-repeat !important; margin-top: 1px !important; }
            `;
        } else {
            styleTag.textContent = '';
        }
    }

    function wcApplyRetroBarSettings() {
        let styleTag = document.getElementById('wc-dynamic-retro-bar-style');
        if (!styleTag) {
            styleTag = document.createElement('style');
            styleTag.id = 'wc-dynamic-retro-bar-style';
            document.head.appendChild(styleTag);
        }

        const contact = wcContactsList.find(c => c.id === wcCurrentChatContactId);
        const isEnabled = contact && contact.retro_bar_enabled === true;

        if (isEnabled) {
            styleTag.textContent = `
                /* ---------------- 1. 顶栏 (Top Bar) ---------------- */
                #wechatAppUI .chat-header-container {
                    background-color: #393a3f !important;
                    border: none !important;
                    box-shadow: none !important;
                    backdrop-filter: none !important;
                    -webkit-backdrop-filter: none !important;
                    border-radius: 0 !important;
                    left: 0 !important;
                    right: 0 !important;
                    width: 100% !important;
                    padding: 0 16px 0 8px !important;
                    height: auto !important;
                    min-height: 30px !important;
                    margin-top: 0 !important;
                    top: 0 !important;
                    padding-top: max(45px, env(safe-area-inset-top)) !important;
                    padding-bottom: 4px !important;
                    align-items: center !important;
                    position: relative !important;
                    z-index: 100 !important;
                    flex-shrink: 0 !important;
                }

                #wechatAppUI .chat-area {
                    padding-top: 16px !important;
                }

                #wechatAppUI .dropdown-menu {
                    top: 60px !important;
                }

                #wechatAppUI .chat-header-container .frosted-glass {
                    background: transparent !important;
                    border: none !important;
                    box-shadow: none !important;
                    backdrop-filter: none !important;
                    -webkit-backdrop-filter: none !important;
                }

                /* 左侧返回按钮 */
                #wechatAppUI .chat-header-container .room-icon-btn:first-child {
                    width: auto !important;
                    height: 100% !important;
                    border-radius: 0 !important;
                    justify-content: flex-start !important;
                    gap: 0 !important;
                    padding-left: 0 !important;
                    white-space: nowrap !important;
                    overflow: visible !important;
                    display: flex !important;
                    align-items: center !important;
                    z-index: 2 !important;
                    flex-shrink: 0 !important;
                }
                #wechatAppUI .chat-header-container .room-icon-btn:first-child svg {
                    display: none !important;
                }
                #wechatAppUI .chat-header-container .room-icon-btn:first-child::before {
                    content: '';
                    display: block;
                    width: 34px !important;
                    height: 54px !important;
                    background: url("data:image/svg+xml,%3Csvg viewBox='0 0 24 24' fill='none' stroke='white' stroke-width='1.5' stroke-linecap='round' stroke-linejoin='round' xmlns='http://www.w3.org/2000/svg'%3E%3Cpolyline points='15 18 9 12 15 6'%3E%3C/polyline%3E%3C/svg%3E") left center/contain no-repeat;
                    margin-right: -8px !important;
                }
                #wechatAppUI .chat-header-container .room-icon-btn:first-child::after {
                    content: 'WeChat';
                    color: #ffffff !important;
                    font-size: 17px !important;
                    font-weight: 500 !important;
                    letter-spacing: 0.5px !important;
                }

                /* 中间名字 */
                #wechatAppUI .chat-header-container .room-info-capsule {
                    position: absolute !important;
                    left: 50% !important;
                    transform: translateX(-50%) !important;
                    flex-direction: row !important;
                    justify-content: center !important;
                    margin: 0 !important;
                    z-index: 1 !important;
                    width: auto !important;
                    max-width: 45% !important;
                }
                #wechatAppUI .chat-header-container .room-info-capsule .avatar {
                    display: none !important;
                }
                #wechatAppUI .chat-header-container .room-info-text {
                    background: transparent !important;
                    border: none !important;
                    box-shadow: none !important;
                    padding: 0 !important;
                    margin: 0 !important;
                    text-align: center !important;
                }
                #wechatAppUI .chat-header-container .room-info-text .name {
                    color: #ffffff !important;
                    font-size: 18px !important;
                    font-weight: 600 !important;
                    white-space: nowrap !important;
                    overflow: hidden !important;
                    text-overflow: ellipsis !important;
                }
                #wechatAppUI .chat-header-container .room-info-text::after {
                    display: none !important;
                }

                /* 右侧菜单按钮 */
                #wechatAppUI .chat-header-container .room-icon-btn:last-child {
                    width: auto !important;
                    height: 100% !important;
                    justify-content: flex-end !important;
                    z-index: 2 !important;
                }
                #wechatAppUI .chat-header-container .room-icon-btn:last-child svg {
                    display: none !important;
                }
                #wechatAppUI .chat-header-container .room-icon-btn:last-child::after {
                    content: '';
                    display: block;
                    width: 24px;
                    height: 24px;
                    background: url("data:image/svg+xml,%3Csvg viewBox='0 0 24 24' fill='white' xmlns='http://www.w3.org/2000/svg'%3E%3Ccircle cx='5' cy='12' r='2'/%3E%3Ccircle cx='12' cy='12' r='2'/%3E%3Ccircle cx='19' cy='12' r='2'/%3E%3C/svg%3E") center/contain no-repeat;
                }

                /* ---------------- 2. 底栏 (Bottom Bar) ---------------- */
                #wechatAppUI .footer-capsule {
                    background-color: #f5f5f5 !important;
                    border: none !important;
                    border-top: 1px solid #e5e5e5 !important;
                    box-shadow: none !important;
                    backdrop-filter: none !important;
                    -webkit-backdrop-filter: none !important;
                    border-radius: 0 !important;
                    padding-left: 12px !important;
                    padding-right: 12px !important;
                    padding-top: 8px !important;
                    padding-bottom: calc(18px + env(safe-area-inset-bottom)) !important;
                    height: auto !important;
                    min-height: 62px !important;
                    bottom: 0 !important;
                    left: 0 !important;
                    right: 0 !important;
                    gap: 10px !important;
                    align-items: center !important;
                }

                /* 彻底隐藏底栏内原有的所有 SVG 路径 */
                #wechatAppUI .footer-capsule > svg path,
                #wechatAppUI .footer-capsule > svg circle,
                #wechatAppUI .footer-capsule > svg line,
                #wechatAppUI .footer-capsule > svg polyline,
                #wechatAppUI .footer-capsule > svg rect,
                #wechatAppUI .footer-capsule .room-send-btn svg {
                    display: none !important;
                }

                /* 左下角：语音按钮 */
                #wechatAppUI .footer-capsule .room-send-btn {
                    order: 1 !important;
                    width: 32px !important;
                    height: 32px !important;
                    background: url("data:image/svg+xml,%3Csvg viewBox='0 0 24 24' xmlns='http://www.w3.org/2000/svg'%3E%3Ccircle cx='12' cy='12' r='11' fill='none' stroke='%23888888' stroke-width='1.2'/%3E%3Cg transform='rotate(90 12 12) translate(12 12) scale(0.65) translate(-12 -12)'%3E%3Cpath fill='%23888888' d='M5.8 15.075 4.225 13.5c1.05 -1.05 2.2375 -1.89585 3.5625 -2.5375C9.1125 10.32085 10.51665 10 12 10c1.48335 0 2.8875 0.32085 4.2125 0.9625C17.5375 11.60415 18.725 12.45 19.775 13.5l-1.575 1.575c-0.85 -0.85 -1.8 -1.53335 -2.85 -2.05 -1.05 -0.51665 -2.16665 -0.775 -3.35 -0.775s-2.3 0.25835 -3.35 0.775c-1.05 0.51665 -2 1.2 -2.85 2.05ZM1.575 10.85 0 9.275c1.6 -1.63335 3.429165 -2.92085 5.4875 -3.8625C7.54585 4.470835 9.71665 4 12 4c2.28335 0 4.45415 0.470835 6.5125 1.4125C20.57085 6.35415 22.4 7.64165 24 9.275l-1.575 1.575c-1.43335 -1.36665 -3.0375 -2.475 -4.8125 -3.325 -1.775 -0.85 -3.64585 -1.275 -5.6125 -1.275s-3.8375 0.425 -5.6125 1.275c-1.775 0.85 -3.379165 1.95835 -4.8125 3.325ZM12 21.275l-3.7 -3.725c0.48335 -0.48335 1.04585 -0.8625 1.6875 -1.1375C10.62915 16.1375 11.3 16 12 16c0.7 0 1.37085 0.1375 2.0125 0.4125 0.64165 0.275 1.20415 0.65415 1.6875 1.1375L12 21.275Z'/%3E%3C/g%3E%3C/svg%3E") center/contain no-repeat !important;
                    border-radius: 0 !important;
                    box-shadow: none !important;
                    flex-shrink: 0 !important;
                }

                /* 中间：输入框 */
                #wechatAppUI .footer-capsule input {
                    order: 2 !important;
                    background-color: #ffffff !important;
                    border-radius: 4px !important;
                    height: 36px !important;
                    padding: 0 10px !important;
                    font-size: 16px !important;
                    color: #000 !important;
                    border: 1px solid #e0e0e0 !important;
                    box-shadow: none !important;
                    margin: 0 !important;
                }
                #wechatAppUI .footer-capsule input::placeholder { color: transparent !important; }
                #wechatAppUI .footer-capsule input:placeholder-shown { background-image: none !important; }

                /* 右侧 1：表情按钮 */
                #wechatAppUI .footer-capsule > svg[onclick*="wcToggleEmojiPanel"] {
                    order: 3 !important;
                    width: 32px !important;
                    height: 32px !important;
                    position: static !important;
                    transform: none !important;
                    background: url("data:image/svg+xml,%3Csvg viewBox='0 0 24 24' xmlns='http://www.w3.org/2000/svg'%3E%3Ccircle cx='12' cy='12' r='11' fill='none' stroke='%23888888' stroke-width='1.2'/%3E%3Ccircle cx='8' cy='9' r='1.5' fill='%23888888'/%3E%3Ccircle cx='16' cy='9' r='1.5' fill='%23888888'/%3E%3Cpath d='M 7 14 A 5 5 0 0 0 17 14 Z' fill='%23888888'/%3E%3C/svg%3E") center/contain no-repeat !important;
                    border: none !important;
                    flex-shrink: 0 !important;
                }

                /* 右侧 2：更多功能按钮 */
                #wechatAppUI .footer-capsule > svg[onclick*="wcToggleFunctionPanel"] {
                    order: 4 !important;
                    width: 32px !important;
                    height: 32px !important;
                    background: url("data:image/svg+xml,%3Csvg viewBox='0 0 24 24' xmlns='http://www.w3.org/2000/svg'%3E%3Ccircle cx='12' cy='12' r='11' fill='none' stroke='%23888888' stroke-width='1.2'/%3E%3Cline x1='12' y1='7' x2='12' y2='17' stroke='%23888888' stroke-width='1.5' stroke-linecap='round'/%3E%3Cline x1='7' y1='12' x2='17' y2='12' stroke='%23888888' stroke-width='1.5' stroke-linecap='round'/%3E%3C/svg%3E") center/contain no-repeat !important;
                    border: none !important;
                    position: static !important;
                    transform: none !important;
                    flex-shrink: 0 !important;
                }

                /* ---------------- 3. 更多功能面板 (Function Panel - 方案一 1:1 复刻) ---------------- */
                #wechatAppUI .wc-function-panel {
                    background-color: #f5f5f5 !important;
                    backdrop-filter: none !important;
                    -webkit-backdrop-filter: none !important;
                    border-top: 1px solid #e0e0e0 !important;
                    border-radius: 0 !important;
                    box-shadow: none !important;
                }

                /* 白底 60x60 圆角矩形，实体浅灰细描边 */
                #wechatAppUI .wc-function-icon {
                    width: 60px !important;
                    height: 60px !important;
                    background-color: #ffffff !important;
                    border-radius: 16px !important;
                    border: 1px solid #dfdfdf !important;
                    box-shadow: none !important;
                    display: flex !important;
                    align-items: center !important;
                    justify-content: center !important;
                    overflow: hidden !important;
                }

                /* 通用深灰剪影图标底色 */
                #wechatAppUI .wc-function-icon svg {
                    background-color: #555555 !important;
                    display: block !important;
                    width: 31px !important;
                    height: 31px !important;
                }
                #wechatAppUI .wc-function-icon svg * {
                    display: none !important;
                }

                /* 1. 重Roll (微调减小至 25px) */
                #wechatAppUI .wc-function-item:has(span:is(:contains('重'), :contains('Roll'), :contains('生成'))) .wc-function-icon svg,
                #wechatAppUI .wc-function-item[onclick*="reroll" i] .wc-function-icon svg,
                #wechatAppUI .wc-function-item[onclick*="regenerate" i] .wc-function-icon svg {
                    width: 25px !important;
                    height: 25px !important;
                    -webkit-mask: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 1024 1024'%3E%3Cpath d='M70.272 263.488l87.488 59.264c55.232-88.32 121.792-147.2 199.552-176.448 99.456-37.696 194.304-33.088 284.48 13.696a387.84 387.84 0 0 1 144.192 112.384l10.624 13.376-114.752 65.536-0.896 0.384-2.24 0.96c2.048 1.216 4.48 2.432 7.424 3.776l0.64 0.256 0.64 0.32 3.84 2.176c195.008 110.912 299.136 169.472 312.384 175.744 1.408 0.64 2.56 1.152 3.456 1.408a54.208 54.208 0 0 0 0.512-9.152v-367.36-0.96l-114.048 65.088-7.488-11.84c-25.6-40.32-77.184-84.736-154.88-133.504-60.352-37.952-129.28-59.52-206.592-64.64-82.88-5.568-158.592 9.6-227.2 45.44a617.28 617.28 0 0 0-227.2 204.096z m879.872 493.312L862.72 697.6c-55.168 88.32-121.728 147.136-199.552 176.448-99.584 37.632-194.368 33.088-284.416-13.76a388.224 388.224 0 0 1-144.256-112.256l-10.688-13.312 114.816-65.6 0.832-0.384 2.368-1.024a83.904 83.904 0 0 0-7.424-3.648l-0.64-0.32-0.64-0.32C137.856 552 32.384 492.608 16.896 485.312a24.576 24.576 0 0 0-3.52-1.408 52.16 52.16 0 0 0-0.512 9.216v367.488L12.8 861.44l114.048-65.024 7.488 11.84c25.536 40.32 77.184 84.864 154.88 133.568 60.416 37.952 129.28 59.52 206.656 64.64 82.88 5.568 158.528-9.6 227.008-45.44a616.768 616.768 0 0 0 227.264-204.16z'/%3E%3C/svg%3E") center/contain no-repeat !important;
                }

                /* 2. 照片 (文字描述图片) */
                #wechatAppUI .wc-function-item:has(.wc-function-text:is(:contains('照片'), :contains('相册'), :contains('图片'))) .wc-function-icon svg,
                #wechatAppUI .wc-function-item[onclick*="Simulate" i] .wc-function-icon svg,
                #wechatAppUI .wc-function-item[onclick*="photo" i] .wc-function-icon svg {
                    width: 28px !important;
                    height: 28px !important;
                    -webkit-mask: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 1063 1024'%3E%3Cpath d='M70.813538 157.538462h882.372924c17.329231 0 31.428923 14.060308 31.428923 31.428923v646.06523c0 17.329231-14.060308 31.428923-31.428923 31.428923H70.813538A31.428923 31.428923 0 0 1 39.384615 835.032615V188.967385c0-17.329231 14.060308-31.428923 31.428923-31.428923z m63.015385 64.43323a31.428923 31.428923 0 0 0-31.428923 31.428923v517.19877c0 17.329231 14.060308 31.428923 31.428923 31.428923h756.342154c17.329231 0 31.428923-14.099692 31.428923-31.428923V253.400615a31.428923 31.428923 0 0 0-31.428923-31.428923z'/%3E%3Cpath d='M104.211692 615.581538l217.67877-264.664615 293.218461 378.604308-41.275077-113.939693 168.763077-166.990769 180.775385 243.081846v142.572308H70.892308z'/%3E%3C/svg%3E") center/contain no-repeat !important;
                }

                /* 3. 拍摄 / 拍照 (真实相册图片) */
                #wechatAppUI .wc-function-item:has(.wc-function-text:is(:contains('拍摄'), :contains('拍照'), :contains('相机'))) .wc-function-icon svg,
                #wechatAppUI .wc-function-item[onclick*="chat-image" i] .wc-function-icon svg,
                #wechatAppUI .wc-function-item[onclick*="camera" i] .wc-function-icon svg {
                    width: 30px !important;
                    height: 22px !important;
                    -webkit-mask: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 1398 1024'%3E%3Cpath d='M1321.784195 1024H76.849951C34.391415 1024 0 989.283902 0 946.425756V294.787122c0-42.833171 34.41639-77.574244 76.849951-77.574244h260.670439C395.638634 217.212878 460.200585 0 527.684683 0h378.630244c63.338146 0 123.129756 217.212878 176.277853 217.212878h239.191415c42.458537 0 76.849951 34.716098 76.849951 77.574244v651.613658C1398.634146 989.283902 1364.217756 1024 1321.784195 1024zM699.317073 263.742439c-174.005073 0-315.067317 142.410927-315.067317 318.06439 0 175.678439 141.062244 318.06439 315.067317 318.064391 174.005073 0 315.067317-142.385951 315.067317-318.064391 0-175.653463-141.062244-318.039415-315.067317-318.039414zm0 550.812098c-127.325659 0-230.524878-104.198244-230.524878-232.747708 0-128.524488 103.19922-232.722732 230.524878-232.722731 127.325659 0 230.524878 104.198244 230.524878 232.722731 0 128.549463-103.19922 232.747707-230.524878 232.747708zM107.594927 93.084098h184.419902v77.574243H107.594927V93.084098z'/%3E%3C/svg%3E") center/contain no-repeat !important;
                }

                /* 4. 语音输入 */
                #wechatAppUI .wc-function-item:has(span:is(:contains('语音'), :contains('麦克风'))) .wc-function-icon svg,
                #wechatAppUI .wc-function-item[onclick*="voice" i] .wc-function-icon svg {
                    -webkit-mask: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 1024 1024'%3E%3Cpath d='M406.826667 673.066667a192 192 0 0 0 262.4-70.186667l149.333333-258.773333a192 192 0 0 0-332.586667-192l-149.333333 258.773333a192 192 0 0 0 70.186667 262.186667z'/%3E%3Cpath d='M789.333333 523.946667l-64 110.933333a256 256 0 1 1-443.306666-256l64-110.933333-74.026667-42.666667-64 110.933333a341.333333 341.333333 0 0 0 88.32 441.173334L251.093333 853.333333l74.026667 42.666667 43.946667-76.16a341.333333 341.333333 0 0 0 429.44-143.146667l64-110.933333zM234.666667 967.893333l69.12-34.133333-74.026667-42.666667 4.906667 76.8z'/%3E%3C/svg%3E") center/contain no-repeat !important;
                }

                /* 5. 位置 (微胖饱满实心地图图钉) */
                #wechatAppUI .wc-function-item:has(span:is(:contains('位置'), :contains('地图'))) .wc-function-icon svg,
                #wechatAppUI .wc-function-item[onclick*="location" i] .wc-function-icon svg {
                    -webkit-mask: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 1024 1024'%3E%3Cpath d='M512 64c-187.8 0-340 152.2-340 340 0 249.2 340 556 340 556s340-306.8 340-556c0-187.8-152.2-340-340-340z m0 476c-75.1 0-136-60.9-136-136s60.9-136 136-136 136 60.9 136 136-60.9 136-136 136z'/%3E%3C/svg%3E") center/contain no-repeat !important;
                }

                /* 6. 转账 (双向箭头) */
                #wechatAppUI .wc-function-item:has(span:is(:contains('转账'), :contains('转帳'))) .wc-function-icon svg,
                #wechatAppUI .wc-function-item[onclick*="transfer" i] .wc-function-icon svg {
                    -webkit-mask: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 1024 1024'%3E%3Cpath d='M942.9 548.1H77.6c-7.5 0-13.6 6.1-13.6 13.6v102.1c0 7.5 6.1 13.6 13.6 13.6h469c7.5 0 13.6 6.1 13.6 13.6v160.3c0 11.3 12.9 17.7 21.9 10.8l371-283.4c13.1-9.8 6.1-30.6-10.2-30.6zM946.4 346.6h-469c-7.5 0-13.6-6.1-13.6-13.6V172.6c0-11.3-12.9-17.7-21.9-10.8l-371 283.4c-13 9.9-6 30.7 10.4 30.7h865.2c7.5 0 13.6-6.1 13.6-13.6V360.2c-0.1-7.5-6.2-13.6-13.7-13.6z'/%3E%3C/svg%3E") center/contain no-repeat !important;
                }

                /* 7. 亲属卡 */
                #wechatAppUI .wc-function-item:has(span:is(:contains('亲属卡'), :contains('亲属'))) .wc-function-icon svg,
                #wechatAppUI .wc-function-item[onclick*="family" i] .wc-function-icon svg {
                    -webkit-mask: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 1036 1024'%3E%3Cpath d='M174.595683 174.595683L0 349.191367l2.578417 13.997122c2.578417 12.892086 26.889209 38.676259 239.056115 250.843166 155.073381 155.073381 234.267626 237.214388 230.952518 238.319424-14.733813 5.156835-52.673381 13.260432-78.457554 16.57554-114.18705 15.470504-183.067626-18.417266-209.588489-103.505036-6.998561-22.83741-6.998561-23.205755 1.105036-90.981295l7.735252-68.143885-9.576978-8.471943c-22.83741-19.522302-49.726619-4.051799-56.72518 32.414389-8.840288 45.306475-12.892086 115.660432-8.103597 142.917986 10.313669 62.618705 49.726619 112.345324 112.713669 143.654676 64.828777 32.046043 121.185612 31.309353 243.844604-3.683453l53.410072-15.102159 61.145324 61.145324c40.886331 40.886331 63.723741 61.145324 69.24892 61.145324 18.785612 0 76.247482-53.778417 258.578418-242.371223l107.92518-111.240288-12.155396-20.627338c-6.998561-11.418705-27.625899-36.834532-46.043166-55.988489l-33.151079-35.361151 20.995684-40.517986c26.889209-52.305036 51.936691-116.028777 64.092086-162.071943 40.517986-156.915108 0-260.788489-118.975539-302.779856-58.566906-20.627338-194.117986-4.788489-289.15108 33.519425-55.251799 22.100719-69.617266 50.463309-35.729496 68.880575 17.31223 9.208633 25.784173 7.366906 79.194245-19.153956 55.988489-27.625899 82.877698-34.256115 139.971223-34.624461 38.676259 0 47.884892 1.473381 74.7741 10.313669 55.988489 18.785612 90.61295 49.358273 102.768346 90.244604 7.735252 26.889209 4.788489 96.87482-6.261871 140.339569-6.998561 28.730935-44.938129 113.45036-68.880575 154.33669l-9.208633 16.207195-254.894964-254.894964C381.23741 2.578417 378.658993 0 363.92518 0s-17.31223 2.578417-189.329497 174.595683z m749.95108 404.443166c-31.309353 70.353957-130.76259 173.122302-232.794245 240.529496-44.569784 29.467626-96.506475 55.251799-133.709353 67.038849l-30.572661 9.576979-16.943885-16.207195c-27.625899-26.889209-26.889209-29.099281 7.735252-40.14964 52.305036-17.31223 104.241727-47.516547 167.965467-98.348201 65.565468-52.673381 145.496403-139.971223 173.490648-189.697842 6.998561-11.78705 15.838849-25.784173 19.522302-30.941007l6.998561-9.576979 23.574101 23.574101 23.5741 23.574101-8.840287 20.627338z'/%3E%3C/svg%3E") center/contain no-repeat !important;
                }

                /* 8. 一起听 (放大至 52px，使用 Base64 编码彻底防糊) */
                #wechatAppUI .wc-function-item:has(span:is(:contains('一起听'), :contains('音乐'), :contains('听歌'))) .wc-function-icon svg,
                #wechatAppUI .wc-function-item[onclick*="music" i] .wc-function-icon svg {
                    width: 52px !important;
                    height: 52px !important;
                    -webkit-mask: url("data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCA4MDAgODAwIj48ZyB0cmFuc2Zvcm09InRyYW5zbGF0ZSg3NC41NDA2MTgsNzQxLjk3MTMyMikgc2NhbGUoMC4wODQyNzAsLTAuMDg0MjcwKSI+PHBhdGggZD0iTTIxODMgNjUwMSBjLTM1MyAtNTEgLTM2MSAtNTMgLTM5NyAtMTI1IC0yMCAtNDIgLTI1IC0zIDgwIC02NzkgMzYgLTIzMyAzNCAtMjYzIC0xMCAtMjcxIC0xNjIgLTMxIC0yNDEgLTY4IC0zMjkgLTE1NCAtMTA2IC0xMDQgLTE1NyAtMjI1IC0xNTcgLTM3MSAwIC0xNTUgNDYgLTI2NiAxNTUgLTM3NyAxMDIgLTEwNCAyNDMgLTE2NCAzODUgLTE2NCAxOTAgMCAzODkgMTE3IDQ3MyAyNzcgNzUgMTQ1IDgyIDIyNCA0MiA1MDMgLTI4IDE5OSAtODggNTk4IC0xMTEgNzQyIC0yNCAxNDcgLTIwIDE1MCAxOTMgMTc4IDE1NiAyMCAxODkgMzMgMjA3IDgzIDEyIDMzIC0yMCAzMjAgLTQwIDM1OSAtMzEgNjEgLTYzIDYxIC00OTEgLTF6Ii8+PHBhdGggZD0iTTYxOTUgNjA0NCBjLTUgLTIgLTY1OSAtMTM0IC0xNDUzIC0yOTMgLTExMTYgLTIyMyAtMTQ0NyAtMjkzIC0xNDYzIC0zMDcgLTQ2IC00MSAtNDkgLTYyIC05OSAtNjIyIC0yNyAtMzAxIC01NiAtNjE3IC02NCAtNzAyIC04IC04NSAtMzEgLTMzMyAtNTIgLTU1MCAtMjAgLTIxNyAtNDIgLTQwOSAtNDkgLTQyNyAtMjQgLTU3IC01MyAtNjcgLTIxNSAtNzQgLTEyNiAtNSAtMTU3IC0xMCAtMjM1IC0zNyAtMTMxIC00NCAtMjA3IC05MiAtMzEwIC0xOTYgLTk2IC05NyAtMTM3IC0xNjIgLTE4MiAtMjg5IC0zMSAtODggLTQzIC0yNzEgLTIzIC0zNzAgNDggLTI0OCAyMjcgLTQ2MiA0NjUgLTU1NyAxMDEgLTQxIDE2MSAtNTIgMjkwIC01MiAxODcgMSAzNjAgNjMgNDk0IDE3NyAxNjUgMTQwIDI1MCAzMDYgMjcxIDUzMCA1IDU1IDIzIDI0MiA0MCA0MTUgNTcgNjA0IDEwMCAxMDY4IDE0NSAxNTY0IDI1IDI3NSA0OCA1MTAgNTEgNTIyIDMgMTMgMTIgMjggMTkgMzQgNiA1IDc5IDI0IDE2MSA0MCAyNDcgNTEgMTQ3MiAyOTkgMTU3OCAzMjEgNTQgMTAgMTAwIDE4IDEwMSAxNyAyIC0yIC0xOSAtMjM5IC00NSAtNTI4IC0yNyAtMjg5IC02MCAtNjU0IC03NCAtODEyIC0xNyAtMTk4IC0zMCAtMjk3IC00MSAtMzE4IC0yNSAtNDkgLTU2IC01OCAtMTkwIC01OCAtODggMCAtMTQwIC01IC0xOTYgLTIwIC0zMjYgLTg3IC01NTAgLTMzOCAtNTkxIC02NjUgLTMwIC0yNDMgODIgLTUwNCAyODkgLTY2OCA4NiAtNjggMTY3IC0xMDkgMjc4IC0xNDAgMTEwIC0zMCAyODYgLTMxIDM5OCAtMSAyMTAgNTcgMzk0IDIxMCA0ODggNDA3IDU1IDExNCA2NyAxNzMgODkgNDE1IDExIDExOCAzNSAzODYgNTUgNTk1IDE5IDIwOSA0NCA0NzkgNTUgNjAwIDExIDEyMSAzOCA0MDcgNjAgNjM1IDg5IDk0NyAxMTMgMTIwOSAxMTQgMTI4MyAxIDc3IDAgNzkgLTMyIDEwOCAtMjUgMjMgLTQxIDI5IC03NSAyOCAtMjMgMCAtNDYgLTIgLTUyIC01eiIvPjwvZz48L3N2Zz4=") center/contain no-repeat !important;
                }

                /* 9. 文件 */
                #wechatAppUI .wc-function-item:has(span:is(:contains('文件'), :contains('文档'))) .wc-function-icon svg,
                #wechatAppUI .wc-function-item[onclick*="file" i] .wc-function-icon svg {
                    -webkit-mask: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 1024 1024'%3E%3Cpath d='M905.86 225.91a36.132 36.132 0 0 0-25.56-10.58H462.4l-11.65-38.71c-4.48-15.35-18.51-25.93-34.5-26.02H137.48c-9.58 0-18.78 3.81-25.56 10.58a36.132 36.132 0 0 0-10.58 25.56v650.51a36.13 36.13 0 0 0 10.58 25.57 36.16 36.16 0 0 0 25.56 10.59H880.3c9.59 0 18.78-3.81 25.56-10.59a36.155 36.155 0 0 0 10.58-25.57V251.47a36.09 36.09 0 0 0-10.58-25.56z m-45.74 111.4H157.84V306.1a36.142 36.142 0 0 1 36.14-36.14h629.99a36.142 36.142 0 0 1 36.14 36.14v31.21z'/%3E%3C/svg%3E") center/contain no-repeat !important;
                }

                /* 10. 礼物 (图标放大至 36px + 减小圆角至 8px) */
                #wechatAppUI .wc-function-grid > .wc-function-item:nth-child(8) .wc-function-icon,
                #wechatAppUI .wc-function-item[onclick*="gift" i] .wc-function-icon {
                    border-radius: 8px !important;
                }
                #wechatAppUI .wc-function-grid > .wc-function-item:nth-child(8) .wc-function-icon svg,
                #wechatAppUI .wc-function-item[onclick*="gift" i] .wc-function-icon svg,
                #wechatAppUI .wc-function-item[onclick*="present" i] .wc-function-icon svg {
                    width: 36px !important;
                    height: 36px !important;
                    -webkit-mask: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 1024 1024'%3E%3Cpath d='M288 417.7C235 446.4 129.3 492 129.3 492l-1.1-74.4H64V676c0 114.7 91 207.7 203.2 207.7h28.9v-466H288zM194.2 695l-23.5-61.2-70.6 2.3 176.4-188.2L194.2 695z m338.3-438.5l-1.9 114H960v-22.6c0-114.7-91-207.7-203.2-207.7H343.3v220.1c37.4-33 112.2-91 189.2-103.8z m-4.1 243S398.5 449 343.3 420.8v463h413.4c112.2 0 203.2-93 203.2-207.7V417.7H529.8l-1.4 81.8z m-8.6 247.8l-37.4 97.3-131-393L632.1 751l-112.3-3.7zM125.7 249c69.4 12.9 137 71.3 170.5 104.2v-213h-28.9C155 140.2 64 233.2 64 347.9v22.6h63.5L125.7 249z'/%3E%3C/svg%3E") center/contain no-repeat !important;
                }

                /* 11. 线下见面 */
                #wechatAppUI #wc-func-btn-offline-meeting .wc-function-icon svg,
                #wechatAppUI .wc-function-item:has(.wc-function-text:is(:contains('线下'), :contains('见面'))) .wc-function-icon svg,
                #wechatAppUI .wc-function-item[onclick*="Meeting" i] .wc-function-icon svg {
                    -webkit-mask: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 1024 1024'%3E%3Cpath d='M587.3 373.7h209c39 0 60.3 18.1 71.6 33.6 4.4 5.7 7.9 12.9 10.4 18.1h24.2v-153c0-71.3-52.4-131.2-120.5-131.2H190.6c-68.7 0-127.5 60.5-127.5 131.8v361.2c0 70.8 58.8 127.1 126.5 127.1H239c8.9 0 16.8 5.7 21.2 13.9L317 877.5c4 6.7 12.8 7.2 16.8 0.5l60.3-103.3c4.4-7.8 12.4-13.4 21.2-13.4h17.3l86.5-336.4c7.9-30.5 35.1-51.2 68.2-51.2zM365.5 487.4H227.1c-16.3 0-29.6-14-29.6-31s13.3-31 29.6-31h138.3c16.3 0 29.6 14 29.6 31 0.1 17-13.2 31-29.5 31zM227.1 337.5c-16.3 0-29.6-13.9-29.6-31 0-17 13.3-31 29.6-31h410c16.3 0 29.6 13.9 29.6 31s-13.3 31-29.6 31h-410z m729.7 148.3c-3.9-5.2-9.9-9.3-15.8-9.3H836.7c-0.9 0-1.4 0.4-1.8 0.1-0.1 0.3-0.1 0.6-0.2 0.9v-1c0.1 0.1 0.1 0.1 0.2 0.1 2.7-12.6 0.6-25.1-6.1-34.7-7.4-9.8-18.8-16.5-32.6-16.5h-209c-8.9 0-16.8 7.2-19.3 16l-61.3 238.7c-0.6 2.5-0.8 5-0.5 7.5l-43.4 169.2c-3 10.8 3.5 22.2 13.8 25.3 1.5 0.5 3.5 0.5 4.9 0.5 8.9 0 16.8-6.2 19.3-15l41.9-163.3H735c-3 15.5-1 25.3 6.4 35.1 7.9 10.3 20.3 16.5 34.6 16.5h103.7c8.9 0 16.8-5.2 19.3-15l61.3-236.7c1.4-6 0.4-13.2-3.5-18.4z m-91.9 228.9H776c-1 0-2 1-2.5 1 3-13.4 1-26.9-6.4-36.7-7.4-9.8-18.8-16-32.1-16H553.3l50.4-196.4h192.5c-0.5 5.2-1 4.1-1 6.2-1 11.9 3.5 24.3 11.4 33.1s19.3 12.4 30.6 12.4h78.5l-50.8 196.4z'/%3E%3C/svg%3E") center/contain no-repeat !important;
                }

                /* 文字样式 */
                #wechatAppUI .wc-function-text {
                    color: #737373 !important;
                    font-size: 12px !important;
                    margin-top: 6px !important;
                    font-weight: 400 !important;
                }

                /* ---------------- 4. 表情面板 (Emoji Panel) ---------------- */
                #wechatAppUI .wc-emoji-panel {
                    background-color: #f5f5f5 !important;
                    backdrop-filter: none !important;
                    -webkit-backdrop-filter: none !important;
                    border-top: 1px solid #e5e5e5 !important;
                    border-radius: 0 !important;
                    box-shadow: none !important;
                }

                #wechatAppUI .wc-emoji-panel-header {
                    background-color: #f5f5f5 !important;
                }

                /* ---------------- 5. 聊天背景颜色 ---------------- */
                #wechatAppUI #page-chat-room {
                    background-color: #ebebeb !important;
                }

                /* ---------------- 6. 古早微信转账卡片 ---------------- */
                #wechatAppUI .message-bubble.transfer-bubble {
                    background-color: transparent !important;
                    border: none !important;
                    padding: 0 !important;
                    box-shadow: none !important;
                }
                #wechatAppUI .message-bubble.transfer-bubble::before,
                #wechatAppUI .message-bubble.transfer-bubble::after {
                    display: none !important;
                    content: none !important;
                }

                #wechatAppUI .wc-transfer-card {
                    width: 236px !important;
                    border-radius: 5px !important;
                    border: 1px solid #d4d4d4 !important;
                    background-color: #ffffff !important;
                    overflow: hidden !important;
                    box-shadow: 0 1px 2px rgba(0, 0, 0, 0.04) !important;
                }

                #wechatAppUI .wc-transfer-top {
                    background-color: #fa9d3b !important;
                    padding: 12px 14px !important;
                    display: flex !important;
                    align-items: center !important;
                    gap: 12px !important;
                }

                #wechatAppUI .wc-transfer-icon-box {
                    width: 42px !important;
                    height: 42px !important;
                    border-radius: 50% !important;
                    border: 2.4px solid #ffffff !important;
                    background-color: transparent !important;
                    display: flex !important;
                    align-items: center !important;
                    justify-content: center !important;
                    padding: 4px !important;
                    flex-shrink: 0 !important;
                }
                /* 仅在待收款状态下，使用复古双向箭头遮罩 */
                #wechatAppUI .wc-transfer-card.pending .wc-transfer-icon-box svg {
                    width: 100% !important;
                    height: 100% !important;
                    background-color: #ffffff !important;
                    -webkit-mask: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 1024 1024'%3E%3Cpath d='M942.9 548.1H77.6c-7.5 0-13.6 6.1-13.6 13.6v102.1c0 7.5 6.1 13.6 13.6 13.6h469c7.5 0 13.6 6.1 13.6 13.6v160.3c0 11.3 12.9 17.7 21.9 10.8l371-283.4c13.1-9.8 6.1-30.6-10.2-30.6zM946.4 346.6h-469c-7.5 0-13.6-6.1-13.6-13.6V172.6c0-11.3-12.9-17.7-21.9-10.8l-371 283.4c-13 9.9-6 30.7 10.4 30.7h865.2c7.5 0 13.6-6.1 13.6-13.6V360.2c-0.1-7.5-6.2-13.6-13.7-13.6z'/%3E%3C/svg%3E") center/contain no-repeat !important;
                }
                #wechatAppUI .wc-transfer-card.pending .wc-transfer-icon-box svg path {
                    display: none !important;
                }
                /* 在已收款 (received) 和已退还 (rejected/expired) 状态下，正常显示对应的对勾或箭头 */
                #wechatAppUI .wc-transfer-card:not(.pending) .wc-transfer-icon-box svg {
                    width: 24px !important;
                    height: 24px !important;
                    stroke: #ffffff !important;
                    fill: none !important;
                    stroke-width: 2.5 !important;
                    stroke-linecap: round !important;
                    stroke-linejoin: round !important;
                    background-color: transparent !important;
                    -webkit-mask: none !important;
                }
                #wechatAppUI .wc-transfer-card:not(.pending) .wc-transfer-icon-box svg * {
                    display: block !important;
                }

                #wechatAppUI .wc-transfer-amount {
                    font-size: 20px !important;
                    font-weight: 500 !important;
                    color: #ffffff !important;
                    line-height: 1.15 !important;
                    letter-spacing: 0.2px !important;
                }
                #wechatAppUI .wc-transfer-desc {
                    font-size: 13px !important;
                    font-weight: 400 !important;
                    color: rgba(255, 255, 255, 0.96) !important;
                    line-height: 1.2 !important;
                }

                #wechatAppUI .wc-transfer-bottom {
                    background-color: #ffffff !important;
                    padding: 6px 14px 7px 14px !important;
                    font-size: 0 !important;
                    color: #7f7f7f !important;
                    line-height: 1 !important;
                    border-top: 1px solid #ededed !important;
                    display: flex !important;
                    align-items: center !important;
                    justify-content: flex-start !important;
                }
                #wechatAppUI .wc-transfer-bottom::after {
                    content: '微信转账' !important;
                    font-size: 11.5px !important;
                    color: #7f7f7f !important;
                    line-height: 1 !important;
                }
                #wechatAppUI .wc-transfer-bottom * {
                    display: none !important;
                }

                #wechatAppUI .wc-transfer-card.pending {
                    background-color: #ffffff !important;
                }
                #wechatAppUI .wc-transfer-card.pending .wc-transfer-bottom {
                    background-color: #ffffff !important;
                    color: #7f7f7f !important;
                }

                /* ---------------- 7. 古早微信亲属卡卡片 (方案一 6px 小圆角 + B 版星球) ---------------- */
                #wechatAppUI .message-bubble:has(.wc-family-card-bubble) {
                    background-color: transparent !important;
                    border: none !important;
                    padding: 0 !important;
                    box-shadow: none !important;
                }
                #wechatAppUI .message-bubble:has(.wc-family-card-bubble)::before,
                #wechatAppUI .message-bubble:has(.wc-family-card-bubble)::after {
                    display: none !important;
                    content: none !important;
                }

                #wechatAppUI .wc-family-card-bubble {
                    width: 246px !important;
                    border-radius: 6px !important;
                    border: 1px solid #d4d4d4 !important;
                    background-color: #ffffff !important;
                    box-shadow: 0 1px 2px rgba(0, 0, 0, 0.04) !important;
                    padding: 14px 14px 12px 14px !important;
                    gap: 0 !important;
                    overflow: hidden !important;
                    position: relative !important;
                    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 170 150' fill='none'%3E%3Cdefs%3E%3ClinearGradient id='planetGrad' x1='80' y1='20' x2='160' y2='100' gradientUnits='userSpaceOnUse'%3E%3Cstop stop-color='%23FFFDF5' stop-opacity='0.8'/%3E%3Cstop stop-color='%23FEEDCB' stop-opacity='0.95'/%3E%3C/linearGradient%3E%3C/defs%3E%3Cpath d='M10 115 C55 142 120 138 165 90' stroke='%23FCE4A6' stroke-width='3.5' stroke-linecap='round'/%3E%3Ccircle cx='38' cy='120' r='5' fill='%23FCE4A6'/%3E%3Ccircle cx='130' cy='80' r='56' fill='url(%23planetGrad)'/%3E%3Cpath d='M2 110 C26 134 94 140 162 86' stroke='%23FFFBF0' stroke-width='2' stroke-linecap='round'/%3E%3Ccircle cx='20' cy='35' r='2' fill='%23FEE3A2'/%3E%3Ccircle cx='56' cy='65' r='1.5' fill='%23FEE3A2'/%3E%3Ccircle cx='36' cy='90' r='1.8' fill='%23FEE3A2'/%3E%3C/svg%3E") !important;
                    background-repeat: no-repeat !important;
                    background-position: right -25px top -15px !important;
                    background-size: 165px 145px !important;
                }

                #wechatAppUI .wc-family-card-bubble .pay-top {
                    display: flex !important;
                    align-items: center !important;
                    gap: 12px !important;
                    margin-bottom: 8px !important;
                    position: relative !important;
                    z-index: 2 !important;
                }

                #wechatAppUI .wc-family-card-bubble .pay-icon {
                    width: 48px !important;
                    height: 48px !important;
                    flex-shrink: 0 !important;
                    background: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 1024 1024'%3E%3Cpath d='M511.8 511.8m-448.5 0a448.5 448.5 0 1 0 897 0 448.5 448.5 0 1 0-897 0Z' fill='%23F2B000'/%3E%3Cpath d='M556.2 322.4c5.4-2.7 10.9-5.3 16.4-7.8 1.2-0.5 2.3-1.1 3.5-1.5 0.8-0.3 1.5-0.7 2.3-1-0.1 0.1-2.6 1.1-0.9 0.4 2.9-1.2 5.8-2.3 8.7-3.4 10.2-3.9 20.6-7.3 31.2-10.1 5.1-1.3 10.2-2.5 15.4-3.6 2.3-0.5 4.6-0.9 7-1.3 1.3-0.2 2.5-0.4 3.7-0.6 0.5-0.1 1.1-0.1 1.6-0.2-1.5 0.3-3 0.4-0.5 0.1 9.2-1.1 18.5-1.7 27.8-1.4 4.4 0.1 8.9 0.5 13.3 1 2.9 0.3-3.4-0.5-0.5-0.1 1.1 0.1 2.1 0.3 3.2 0.5 2.3 0.4 4.4 0.8 6.6 1.3 3.8 0.9 7.7 2 11.5 3.2 1.9 0.7 3.8 1.4 5.6 2.1 1.6 0.6-2-0.9-1.9-0.8 0.3 0.2 0.8 0.3 1.2 0.5 1 0.5 2.1 0.9 3 1.5 3.5 1.7 6.9 3.7 10.1 5.8 1.5 1 2.9 2.2 4.4 3.1-0.1-0.1-3.2-2.6-1.3-0.9 0.3 0.3 0.7 0.5 1 0.8 0.7 0.6 1.5 1.3 2.2 1.9 2.6 2.3 5.1 4.8 7.4 7.4 1 1.1 1.9 2.3 2.9 3.4 1.5 1.9-2.4-3.2-0.9-1.3 0.5 0.7 1 1.3 1.5 2.1 3.4 4.8 6.2 9.9 8.7 15.3 1.1 2.4-0.1-0.6-0.6-1.5 0.4 0.6 0.6 1.4 0.9 2.1 0.5 1.4 1.1 2.8 1.5 4.2 1 2.9 1.8 5.8 2.5 8.8 0.7 3 1.4 6.1 1.9 9.2 0.1 0.7 0.2 1.3 0.3 2 0.1 1-0.5-4.4-0.1-1.2 0.2 1.6 0.3 3.2 0.5 4.8 0.6 6.7 0.7 13.5 0.3 20.2-0.2 3.5-0.5 7-0.8 10.5-0.1 0.8-0.2 1.5-0.3 2.3-0.1 0.7-0.5 4.1-0.1 1 0.4-3-0.1 0.2-0.1 1-0.1 1.1-0.3 2.1-0.5 3.1-1.3 7.4-2.9 14.8-4.8 22-2.1 7.7-4.5 15.2-7.2 22.7-1.5 4-3 7.9-4.6 11.8-0.3 0.6-0.5 1.1-0.7 1.7-0.1 0.1 1.4-3.2 0.7-1.7-0.4 1-0.9 2-1.3 3l-2.7 6c-7.6 16.6-16.5 32.6-26.4 48-5.2 8.1-10.7 16-16.3 23.8-1.5 2.1-3 4-4.5 6-0.7 0.9-1.3 1.7-2 2.6 2.5-3.5-0.2 0.3-0.9 1.1-3.2 4-6.4 8-9.7 11.9-13.5 16.2-28.1 31.6-43.5 46-7.7 7.2-15.6 14.3-23.7 21-4 3.4-8.2 6.7-12.3 9.9-0.6 0.5-1.2 0.9-1.8 1.4 0 0 2.5-1.9 1-0.8-1.1 0.8-2.1 1.6-3.1 2.4-2.1 1.5-4.1 3.1-6.2 4.6-15.8 11.6-32.4 22.2-49.6 31.7-8 4.4-16.2 8.6-24.5 12.4-2.1 0.9-4.1 1.9-6.2 2.8-0.9 0.4-1.8 0.8-2.7 1.1-0.6 0.3-1.2 0.5-1.8 0.7 0.6-0.3 3.1-1.3 1.2-0.5-4 1.7-8.1 3.3-12.2 4.8-15.2 5.6-30.8 10.2-46.8 13.2-1.7 0.3-3.5 0.6-5.2 0.9-0.9 0.1-1.9 0.3-2.8 0.4-0.4 0.1-0.8 0.1-1.2 0.2-2.7 0.4 3.4-0.4 1.5-0.2-3.5 0.4-7 0.8-10.6 1.1-7 0.5-14.1 0.7-21 0.3-3.3-0.1-6.7-0.5-10-0.9-0.3-0.1-0.7-0.1-1.1-0.1-1.5-0.1 2.7 0.5 2.5 0.3-0.5-0.3-1.8-0.3-2.4-0.3-1.6-0.3-3.2-0.5-4.8-0.9-6.1-1.2-12.1-2.9-18-5-0.7-0.3-1.4-0.5-2.1-0.8-2.4-0.9 0.4 0.3 1.4 0.6-1.4-0.4-2.8-1.3-4.1-1.9-2.7-1.3-5.3-2.7-7.8-4.3-2.5-1.5-5.2-3-7.3-5-0.3-0.3 3.2 2.6 2 1.5-0.3-0.3-0.7-0.5-1-0.8l-1.5-1.2c-1.2-1-2.4-2.1-3.5-3.2-2.7-2.5-5.1-5.2-7.4-8-1.8-2.1 1.9 2.7 0.3 0.4-0.6-0.9-1.2-1.7-1.8-2.5-1.2-1.7-2.3-3.4-3.4-5.2-1.1-1.8-2.1-3.6-3-5.5-0.4-0.8-0.8-1.6-1.2-2.5-0.3-0.5-1.9-4.4-0.9-1.8 1.1 2.6-0.3-0.9-0.5-1.5-0.3-0.9-0.7-1.7-0.9-2.6-0.7-2.2-1.5-4.4-2.1-6.6-1.1-4.1-2-8.3-2.7-12.5-0.1-0.6-0.1-1.3-0.3-1.9-0.1-0.1 0.5 3.6 0.3 1.8-0.1-1.1-0.3-2.3-0.4-3.4-0.2-2.3-0.4-4.6-0.5-7-0.2-4.8-0.2-9.6 0-14.5 0.1-2.3 0.3-4.6 0.5-6.9 0.2-2.5 0.1-5.8 0.9-8.2 0 0-0.5 3.3-0.2 1.5 0.1-0.5 0.1-1.1 0.3-1.7 0.2-1.3 0.4-2.6 0.7-3.9 0.4-2.5 0.9-4.9 1.4-7.3 1.1-5.4 2.5-10.7 3.9-16 2.2-8-2.7-17.6-11.1-19.6-8.4-1.9-17.2 2.5-19.6 11.1-11.1 40.1-14.1 86.3 7.3 123.7 15.2 26.5 41.9 44.3 71.5 50.7 31.4 6.8 64.4 3.2 95.1-5.1 36.8-10 71.9-27 104-47.5 37.2-23.7 71.5-52.4 101.6-84.6 28.6-30.4 54.1-64.3 73.9-101 16.5-30.6 30-64 35-98.6 4.4-30.3 3.2-61.2-10.2-89.2-14.3-29.8-43.2-50.1-75-57-42.1-9-86.7 0.1-126.1 15.6-12 4.7-23.8 9.9-35.3 15.7-7.4 3.7-10.1 14.9-5.7 21.7 4.7 8.6 13.6 10.7 21.6 6.7z' fill='%23FFFFFF'/%3E%3Cpath d='M756.2 587.4l-17.9 17.9-43 43-51.8 51.8-45 45c-7.3 7.3-14.9 14.3-21.9 21.9l-0.3 0.3h22.5l-9.2-9.2-25-25-37.2-37.2-45.1-45.1-49.5-49.5-49.9-49.9-46.5-46.5-39.3-39.3-28.3-28.3c-4.4-4.4-8.9-9.1-13.5-13.5l-0.6-0.6v22.5l17.9-17.9 43-43 51.8-51.8 45-45c7.3-7.3 14.9-14.3 21.9-21.9l0.3-0.3h-22.5l9.2 9.2 25 25 37.2 37.2 45.1 45.1 49.5 49.5 49.9 49.9 46.5 46.5 39.3 39.3 28.3 28.3c4.5 4.5 8.9 9 13.5 13.5l0.6 0.6c5.9 5.9 16.7 6.4 22.5 0 5.8-6.4 6.3-16.2 0-22.5l-9.2-9.2-25-25-37.2-37.2-45.1-45.1-49.5-49.5-49.9-49.9-46.5-46.5-39.3-39.3-28.3-28.3c-4.5-4.5-8.9-9-13.5-13.5l-0.6-0.6c-6.1-6.1-16.4-6.1-22.5 0l-17.9 17.9-43 43-51.8 51.8-45 45c-7.3 7.3-14.8 14.5-21.9 21.9l-0.3 0.3c-6.1 6.1-6.1 16.4 0 22.5l9.2 9.2 25 25 37.2 37.2 45.1 45.1 49.5 49.5 49.9 49.9 46.5 46.5 39.3 39.3 28.3 28.3c4.5 4.5 8.9 9 13.5 13.5l0.6 0.6c6.1 6.1 16.4 6.1 22.5 0l17.9-17.9 43-43 51.8-51.8 45-45c7.3-7.3 14.8-14.5 21.9-21.9l0.3-0.3c5.9-5.9 6.4-16.7 0-22.5-6.4-5.9-16.2-6.3-22.5 0z' fill='%23FFFFFF'/%3E%3C/svg%3E") center/contain no-repeat !important;
                }
                #wechatAppUI .wc-family-card-bubble .pay-icon svg {
                    display: none !important;
                }

                #wechatAppUI .wc-family-card-bubble .pay-info {
                    display: flex !important;
                    flex-direction: column !important;
                    gap: 3px !important;
                    min-width: 0 !important;
                }

                #wechatAppUI .wc-family-card-bubble .pay-amount {
                    font-size: 16px !important;
                    font-weight: 700 !important;
                    color: #A86D36 !important;
                    line-height: 1.25 !important;
                    letter-spacing: 0.2px !important;
                }

                #wechatAppUI .wc-family-card-bubble .pay-status {
                    font-size: 14px !important;
                    font-weight: 600 !important;
                    color: #B87F47 !important;
                    line-height: 1.25 !important;
                }

                #wechatAppUI .wc-family-card-bubble .pay-bottom {
                    display: flex !important;
                    justify-content: flex-start !important;
                    font-size: 11px !important;
                    font-weight: 600 !important;
                    color: #D0B897 !important;
                    letter-spacing: 0.5px !important;
                    position: relative !important;
                    z-index: 2 !important;
                }

                #wechatAppUI .wc-family-card-bubble .pay-brand {
                    display: none !important;
                }
            `;
        } else {
            styleTag.textContent = '';
        }
    }

    function wcToggleIssStarBar(element) {
        element.classList.toggle('active');
        const isEnabled = element.classList.contains('active');
        const contact = wcContactsList.find(c => c.id === wcCurrentChatContactId);
        if (contact) {
            contact.iss_star_bar_enabled = isEnabled;
            if (isEnabled) {
                contact.imessage_bar_enabled = false;
                const imessageToggle = document.getElementById('wc-imessage-bar-toggle');
                if (imessageToggle) imessageToggle.classList.remove('active');
                if (typeof wcApplyIMessageBarSettings === 'function') wcApplyIMessageBarSettings();

                contact.retro_bar_enabled = false;
                const retroToggle = document.getElementById('wc-retro-bar-toggle');
                if (retroToggle) retroToggle.classList.remove('active');
                if (typeof wcApplyRetroBarSettings === 'function') wcApplyRetroBarSettings();

                contact.pink_layer_card_bar_enabled = false;
                const pinkLayerToggle = document.getElementById('wc-pink-layer-card-bar-toggle');
                if (pinkLayerToggle) pinkLayerToggle.classList.remove('active');
                if (typeof wcApplyPinkLayerCardBarSettings === 'function') wcApplyPinkLayerCardBarSettings();

                contact.qq_bar_enabled = false;
                const qqToggle = document.getElementById('wc-qq-bar-toggle');
                if (qqToggle) qqToggle.classList.remove('active');
                if (typeof wcApplyQqBarSettings === 'function') wcApplyQqBarSettings();
            }
            wcSaveContactsDataAsync();
        }
        wcApplyIssStarBarSettings();
    }
    window.wcToggleIssStarBar = wcToggleIssStarBar;

    function wcApplyIssStarBarSettings() {
        let styleTag = document.getElementById('wc-dynamic-iss-star-bar-style');
        if (!styleTag) {
            styleTag = document.createElement('style');
            styleTag.id = 'wc-dynamic-iss-star-bar-style';
            document.head.appendChild(styleTag);
        }

        const contact = wcContactsList.find(c => c.id === wcCurrentChatContactId);
        const isEnabled = contact && contact.iss_star_bar_enabled === true;

        if (isEnabled) {
            styleTag.textContent = `
                /* 1. 全局背景 */
                #wechatAppUI #page-chat-room { background-color: #ffffff !important; }

                /* 2. 顶栏重构 */
                #wechatAppUI .chat-header-container {
                    background: #ffffff !important;
                    border: none !important;
                    border-bottom: none !important;
                    box-shadow: none !important;
                    backdrop-filter: none !important;
                    -webkit-backdrop-filter: none !important;
                    padding: 10px 20px 16px 20px !important;
                    padding-top: max(45px, env(safe-area-inset-top)) !important;
                    display: flex !important;
                    flex-wrap: wrap !important;
                    justify-content: space-between !important;
                    align-items: center !important;
                    height: auto !important;
                    border-radius: 0 !important;
                    width: 100% !important;
                    left: 0 !important;
                    right: 0 !important;
                    top: 0 !important;
                    box-sizing: border-box !important;
                    position: absolute !important;
                    z-index: 100 !important;
                }
                #wechatAppUI .chat-header-container .room-icon-btn:first-child {
                    order: 1 !important; background: transparent !important; box-shadow: none !important; border: none !important; width: auto !important; height: 32px !important; display: flex !important; align-items: center !important; justify-content: flex-start !important; gap: 12px !important; border-radius: 0 !important; padding: 0 !important;
                }
                #wechatAppUI .chat-header-container .room-icon-btn:first-child svg { display: none !important; }
                #wechatAppUI .chat-header-container .room-icon-btn:first-child::before {
                    content: ''; display: block !important; width: 22px !important; height: 22px !important; flex-shrink: 0 !important;
                    background: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%23333' stroke-width='2.5' stroke-linecap='round' stroke-linejoin='round'><circle cx='11' cy='11' r='8'></circle><line x1='21' y1='21' x2='16.65' y2='16.65'></line></svg>") center/contain no-repeat !important;
                }
                #wechatAppUI .chat-header-container .room-icon-btn:first-child::after {
                    content: 'i missssu…//'; font-size: 18px !important; font-weight: 800 !important; color: #000 !important; white-space: nowrap !important; letter-spacing: 0.5px !important;
                }
                #wechatAppUI .chat-header-container .room-icon-btn:last-child {
                    order: 2 !important; background: transparent !important; box-shadow: none !important; border: none !important; width: 32px !important; height: 32px !important; border-radius: 0 !important; display: flex !important; justify-content: flex-end !important; align-items: center !important; padding: 0 !important;
                }
                #wechatAppUI .chat-header-container .room-icon-btn:last-child svg { display: none !important; }
                #wechatAppUI .chat-header-container .room-icon-btn:last-child::after { display: none !important; }
                #wechatAppUI .chat-header-container .room-icon-btn:last-child::before {
                    content: ''; display: block !important; width: 24px !important; height: 24px !important;
                    background: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%23333' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'><line x1='3' y1='12' x2='21' y2='12'></line><line x1='3' y1='6' x2='21' y2='6'></line><line x1='3' y1='18' x2='21' y2='18'></line></svg>") center/contain no-repeat !important;
                }
                #wechatAppUI .chat-header-container .room-info-capsule {
                    order: 3 !important; flex-basis: 100% !important; background: #f7f7f9 !important; border: none !important; box-shadow: none !important; display: flex !important; align-items: center !important; justify-content: flex-start !important; margin: 16px 0 0 0 !important; padding: 12px 16px !important; position: static !important; transform: none !important; max-width: 100% !important; border-radius: 16px !important; height: auto !important; box-sizing: border-box !important;
                }
                #wechatAppUI .chat-header-container .room-info-capsule .avatar {
                    display: block !important; width: 44px !important; height: 44px !important; border-radius: 12px !important; margin: 0 16px 0 0 !important; box-shadow: none !important; flex-shrink: 0 !important;
                }
                #wechatAppUI .chat-header-container .room-info-text {
                    display: flex !important; flex-direction: column !important; align-items: flex-start !important; padding: 0 !important; background: transparent !important; border: none !important; box-shadow: none !important; min-width: 0 !important; width: 100% !important;
                }
                #wechatAppUI .chat-header-container .room-info-text .name {
                    display: block !important; font-size: 16px !important; font-weight: 700 !important; color: #333 !important; letter-spacing: 0.5px !important; line-height: 1.2 !important; white-space: nowrap !important; overflow: hidden !important; text-overflow: ellipsis !important; max-width: 100% !important;
                }
                #wechatAppUI .chat-header-container .room-info-text .sub {
                    display: block !important; font-size: 0 !important; margin-top: 4px !important; line-height: 1 !important;
                }
                #wechatAppUI .chat-header-container .room-info-text .sub::after {
                    content: '@kisssssmee'; font-size: 12px !important; color: #8e8e93 !important; font-weight: 500 !important;
                }
                #wechatAppUI .chat-header-container .room-info-text::after { display: none !important; }

                /* 3. 聊天区域 */
                #wechatAppUI .chat-area { padding: 160px 20px 140px 20px !important; }

                /* 4. 悬浮分层底栏重构 */
                #wechatAppUI .footer-capsule {
                    position: absolute !important; bottom: calc(6px + env(safe-area-inset-bottom)) !important; left: 6px !important; right: 6px !important; background-color: #ffffff !important; border-radius: 20px !important; padding: 16px !important; box-sizing: border-box !important; box-shadow: 0 4px 20px rgba(0,0,0,0.08) !important; border: 1px solid #f0f0f0 !important; height: auto !important; display: flex !important; flex-wrap: wrap !important; align-items: center !important; justify-content: space-between !important;
                }
                #wechatAppUI .footer-capsule > svg path, #wechatAppUI .footer-capsule > svg circle, #wechatAppUI .footer-capsule > svg line, #wechatAppUI .footer-capsule > svg polyline, #wechatAppUI .footer-capsule > svg rect, #wechatAppUI .footer-capsule .room-send-btn svg { display: none !important; }
                #wechatAppUI .footer-capsule input {
                    order: 1 !important; width: calc(100% - 40px) !important; flex: none !important; border: none !important; background: transparent !important; font-size: 16px !important; color: #000 !important; font-weight: 600 !important; letter-spacing: 1px !important; padding: 0 0 12px 0 !important; margin: 0 !important; border-bottom: 1px solid #f5f5f5 !important; border-radius: 0 !important; box-shadow: none !important; height: auto !important;
                }
                #wechatAppUI .footer-capsule input::placeholder { color: transparent !important; }
                #wechatAppUI .footer-capsule input:placeholder-shown {
                    background-image: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='300' height='20'><text x='0' y='15' fill='%23c7c7cc' font-family='-apple-system, sans-serif' font-size='16' font-weight='600' letter-spacing='1'>—於你而言我是一顆星嗎—</text></svg>") !important; background-repeat: no-repeat !important; background-position: left top !important;
                }
                #wechatAppUI .footer-capsule .room-send-btn {
                    order: 2 !important; width: 26px !important; height: 26px !important;
                    background: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16'><path d='M1.336 2.904c-0.64925 0 -1.176 0.52675 -1.176 1.176 0 0.36995 0.17395 0.71785 0.4704 0.9408l5.3312 3.9984c0.2793 0.20825 0.6615 0.20825 0.9408 0l1.4063 -1.0535c0.58555 -1.4651 1.95265 -2.53085 3.58435 -2.6901l0.34055 -0.2548c0.29645 -0.22295 0.4704 -0.57085 0.4704 -0.9408 0 -0.64925 -0.52675 -1.176 -1.176 -1.176H1.336Zm6.0368 6.7424c-0.5586 0.41895 -1.323 0.41895 -1.8816 0L0.16 5.648v5.096c0 0.86485 0.70315 1.568 1.568 1.568h7.2569C8.36995 11.5672 8 10.60925 8 9.568c0 -0.1372 0.00735 -0.27195 0.0196 -0.4067l-0.6468 0.4851ZM15.84 9.568c0 -2.715855 -2.94 -4.413265 -5.292 -3.0553375 -1.0915675 0.6302175 -1.764 1.794905 -1.764 3.0553375 0 2.715855 2.94 4.413265 5.292 3.0553375 1.0915675 -0.6302175 1.764 -1.794905 1.764 -3.0553375Zm-1.87915 -1.06085c0.1519 0.1519 0.1519 0.4018 0 0.5537l-1.764 1.764c-0.1519 0.1519 -0.4018 0.1519 -0.5537 0l-0.98 -0.98c-0.1519 -0.1519 -0.1519 -0.4018 0 -0.5537s0.4018 -0.1519 0.5537 0l0.70315 0.70315 1.48715 -1.48715c0.1519 -0.1519 0.4018 -0.1519 0.5537 0Z' fill='%23555555'/></svg>") center/contain no-repeat !important;
                    border-radius: 0 !important; box-shadow: none !important; margin: 0 0 12px 0 !important; position: absolute !important; right: 16px !important; top: 16px !important;
                }
                #wechatAppUI .footer-capsule > svg[onclick*="wcToggleFunctionPanel"] {
                    order: 3 !important; width: 26px !important; height: 26px !important;
                    background: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%23555555'><path d='M12 22C6.47715 22 2 17.5228 2 12C2 6.47715 6.47715 2 12 2C17.5228 2 22 6.47715 22 12C22 17.5228 17.5228 22 12 22ZM9.71002 19.6674C8.74743 17.6259 8.15732 15.3742 8.02731 13H4.06189C4.458 16.1765 6.71639 18.7747 9.71002 19.6674ZM10.0307 13C10.1811 15.4388 10.8778 17.7297 12 19.752C13.1222 17.7297 13.8189 15.4388 13.9693 13H10.0307ZM19.9381 13H15.9727C15.8427 15.3742 15.2526 17.6259 14.29 19.6674C17.2836 18.7747 19.542 16.1765 19.9381 13ZM4.06189 11H8.02731C8.15732 8.62577 8.74743 6.37407 9.71002 4.33256C6.71639 5.22533 4.458 7.8235 4.06189 11ZM10.0307 11H13.9693C13.8189 8.56122 13.1222 6.27025 12 4.24799C10.8778 6.27025 10.1811 8.56122 10.0307 11ZM14.29 4.33256C15.2526 6.37407 15.8427 8.62577 15.9727 11H19.9381C19.542 7.8235 17.2836 5.22533 14.29 4.33256Z'/></svg>") center/contain no-repeat !important;
                    margin: 12px 16px 0 0 !important; position: static !important; transform: none !important; display: block !important;
                }
                #wechatAppUI .footer-capsule > svg[onclick*="wcToggleEmojiPanel"] {
                    order: 4 !important; width: 20px !important; height: 20px !important;
                    background: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16'><path d='M12.3904875 0.16H3.6095125c-0.6928 0 -1.254425 0.561625 -1.254425 1.254425v13.798675c0.00024375 0.482825 0.52306875 0.7843375 0.9410875 0.5427125 0.00625 -0.0036125 0.01243125 -0.007325 0.01855 -0.01115L8 12.8163625l4.6860625 2.9283c0.4098125 0.25529375 0.9423125 -0.02878125 0.9585 -0.5113375 0.000225 -0.0067375 0.00034375 -0.01348125 0.00035 -0.020225V1.414425c0 -0.6928 -0.561625 -1.254425 -1.254425 -1.254425Zm-4.05885 11.385475c-0.2033875 -0.12711875 -0.46145625 -0.12711875 -0.66484375 0l-4.05728125 2.5362875v-2.28461875L8 9.0530875l4.3904875 2.74405625v2.28461875Z' fill='%23555555'/></svg>") center/contain no-repeat !important;
                    margin: 12px 0 0 0 !important; position: static !important; transform: none !important; display: block !important;
                }
                #wechatAppUI .footer-capsule::after {
                    content: 'Wednesday, Apr 15\\A @：우우우…ㅜωㅜ'; white-space: pre-wrap !important; order: 5 !important; margin-left: auto !important; margin-top: 12px !important; text-align: right !important; font-size: 13px !important; color: #c7c7cc !important; font-weight: 500 !important; line-height: 1.4 !important;
                }
            `;
        } else {
            styleTag.textContent = '';
        }
    }
    window.wcApplyIssStarBarSettings = wcApplyIssStarBarSettings;

    function wcTogglePinkLayerCardBar(element) {
        element.classList.toggle('active');
        const isEnabled = element.classList.contains('active');
        const contact = wcContactsList.find(c => c.id === wcCurrentChatContactId);
        if (contact) {
            contact.pink_layer_card_bar_enabled = isEnabled;
            // 互斥逻辑：如果开启了 粉˙层叠卡片，则强制关闭其他
            if (isEnabled) {
                contact.imessage_bar_enabled = false;
                const imessageToggle = document.getElementById('wc-imessage-bar-toggle');
                if (imessageToggle) imessageToggle.classList.remove('active');
                if (typeof wcApplyIMessageBarSettings === 'function') wcApplyIMessageBarSettings();

                contact.retro_bar_enabled = false;
                const retroToggle = document.getElementById('wc-retro-bar-toggle');
                if (retroToggle) retroToggle.classList.remove('active');
                if (typeof wcApplyRetroBarSettings === 'function') wcApplyRetroBarSettings();

                contact.iss_star_bar_enabled = false;
                const issStarToggle = document.getElementById('wc-iss-star-bar-toggle');
                if (issStarToggle) issStarToggle.classList.remove('active');
                if (typeof wcApplyIssStarBarSettings === 'function') wcApplyIssStarBarSettings();

                contact.qq_bar_enabled = false;
                const qqToggle = document.getElementById('wc-qq-bar-toggle');
                if (qqToggle) qqToggle.classList.remove('active');
                if (typeof wcApplyQqBarSettings === 'function') wcApplyQqBarSettings();
            }
            wcSaveContactsDataAsync();
        }
        wcApplyPinkLayerCardBarSettings();
    }
    window.wcTogglePinkLayerCardBar = wcTogglePinkLayerCardBar;

    function wcToggleQqBar(element) {
        element.classList.toggle('active');
        const isEnabled = element.classList.contains('active');
        const contact = wcContactsList.find(c => c.id === wcCurrentChatContactId);
        if (contact) {
            contact.qq_bar_enabled = isEnabled;
            if (isEnabled) {
                contact.imessage_bar_enabled = false;
                const imessageToggle = document.getElementById('wc-imessage-bar-toggle');
                if (imessageToggle) imessageToggle.classList.remove('active');
                if (typeof wcApplyIMessageBarSettings === 'function') wcApplyIMessageBarSettings();

                contact.retro_bar_enabled = false;
                const retroToggle = document.getElementById('wc-retro-bar-toggle');
                if (retroToggle) retroToggle.classList.remove('active');
                if (typeof wcApplyRetroBarSettings === 'function') wcApplyRetroBarSettings();

                contact.iss_star_bar_enabled = false;
                const issStarToggle = document.getElementById('wc-iss-star-bar-toggle');
                if (issStarToggle) issStarToggle.classList.remove('active');
                if (typeof wcApplyIssStarBarSettings === 'function') wcApplyIssStarBarSettings();

                contact.pink_layer_card_bar_enabled = false;
                const pinkLayerToggle = document.getElementById('wc-pink-layer-card-bar-toggle');
                if (pinkLayerToggle) pinkLayerToggle.classList.remove('active');
                if (typeof wcApplyPinkLayerCardBarSettings === 'function') wcApplyPinkLayerCardBarSettings();
            }
            wcSaveContactsDataAsync();
        }
        wcApplyQqBarSettings();
    }
    window.wcToggleQqBar = wcToggleQqBar;

    // Keep the private and group QQ presentation on the same source templates.
    function wcGetQqBarCss(group = false) {
        const css = `
                /* 1. 仿 QQ 顶栏深度美化 (Top Bar - 纯白通栏无分割线) */
                #wechatAppUI #page-chat-room .chat-header-container,
                #wechatAppUI .chat-header-container.frosted-glass {
                    position: absolute !important;
                    top: 0 !important;
                    left: 0 !important;
                    right: 0 !important;
                    width: 100% !important;
                    height: 88px !important;
                    min-height: 88px !important;
                    padding: 38px 16px 8px 16px !important;
                    background: #ffffff !important;
                    border: none !important;
                    border-bottom: none !important;
                    border-radius: 0 !important;
                    box-shadow: none !important;
                    backdrop-filter: none !important;
                    -webkit-backdrop-filter: none !important;
                    display: flex !important;
                    align-items: center !important;
                    justify-content: space-between !important;
                    box-sizing: border-box !important;
                    z-index: 100 !important;
                    pointer-events: auto !important;
                }

                #wechatAppUI #page-chat-room .room-info-capsule {
                    background: transparent !important;
                    border: none !important;
                    box-shadow: none !important;
                    border-radius: 0 !important;
                    backdrop-filter: none !important;
                    -webkit-backdrop-filter: none !important;
                    padding: 0 !important;
                    margin: 0 !important;
                    height: auto !important;
                    flex: 1 !important;
                    display: flex !important;
                    align-items: center !important;
                }

                #wechatAppUI #page-chat-room .room-info-capsule .avatar {
                    display: none !important;
                }

                #wechatAppUI #page-chat-room .chat-header-container > .room-icon-btn:first-child,
                #wechatAppUI #page-chat-room .chat-header-container > .room-icon-btn:first-of-type {
                    width: 28px !important;
                    height: 28px !important;
                    min-width: 28px !important;
                    background: transparent !important;
                    border: none !important;
                    box-shadow: none !important;
                    border-radius: 0 !important;
                    padding: 0 !important;
                    margin: 0 8px 0 0 !important;
                    display: flex !important;
                    align-items: center !important;
                    justify-content: center !important;
                    position: relative !important;
                }
                #wechatAppUI #page-chat-room .chat-header-container > .room-icon-btn:first-child svg,
                #wechatAppUI #page-chat-room .chat-header-container > .room-icon-btn:first-of-type svg {
                    display: none !important;
                }
                #wechatAppUI #page-chat-room .chat-header-container > .room-icon-btn:first-child::before,
                #wechatAppUI #page-chat-room .chat-header-container > .room-icon-btn:first-of-type::before {
                    content: '' !important;
                    display: block !important;
                    width: 22px !important;
                    height: 22px !important;
                    background-image: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%238c8c94' stroke-width='2.2' stroke-linecap='round' stroke-linejoin='round'><polyline points='15 18 9 12 15 6'/></svg>") !important;
                    background-size: contain !important;
                    background-repeat: no-repeat !important;
                    background-position: center !important;
                }

                #wechatAppUI #page-chat-room .room-info-text {
                    display: flex !important;
                    flex-direction: column !important;
                    justify-content: center !important;
                    align-items: flex-start !important;
                    padding: 0 !important;
                    margin: 0 !important;
                }
                #wechatAppUI #page-chat-room .room-info-text .name {
                    font-size: 17px !important;
                    font-weight: 700 !important;
                    color: #8c8c94 !important;
                    line-height: 1.2 !important;
                    display: flex !important;
                    align-items: center !important;
                    gap: 4px !important;
                    margin: 0 !important;
                    white-space: nowrap !important;
                }
                #wechatAppUI #page-chat-room .room-info-text .name::after {
                    content: '' !important;
                    display: inline-block !important;
                    width: 44px !important;
                    height: 17.5px !important;
                    background-image: url('https://i.postimg.cc/hP00gS1L/retouch-2026090500311449.png') !important;
                    background-size: contain !important;
                    background-repeat: no-repeat !important;
                    background-position: center left !important;
                    margin-left: 5px !important;
                    vertical-align: middle !important;
                    flex-shrink: 0 !important;
                }

                #wechatAppUI #page-chat-room .room-info-text .sub {
                    font-size: 11.5px !important;
                    color: #8c8c94 !important;
                    font-weight: 500 !important;
                    display: flex !important;
                    align-items: center !important;
                    gap: 4px !important;
                    margin-top: 2px !important;
                    line-height: 1 !important;
                }
                #wechatAppUI #page-chat-room .room-info-text .sub::before {
                    content: '' !important;
                    display: inline-block !important;
                    width: 6.5px !important;
                    height: 6.5px !important;
                    border-radius: 50% !important;
                    background-color: #2bd464 !important;
                    flex-shrink: 0 !important;
                }
                #wechatAppUI #page-chat-room .room-info-text .sub:empty::after {
                    content: 'iPhone 17 在线 ›' !important;
                    font-size: 11.5px !important;
                    color: #8c8c94 !important;
                    font-weight: 500 !important;
                }
                #wechatAppUI #page-chat-room .room-info-text .sub:not(:empty):not(.wc-api-typing)::after {
                    content: ' ›' !important;
                    font-size: 12px !important;
                    color: #8c8c94 !important;
                    font-weight: 700 !important;
                }

                #wechatAppUI #page-chat-room .chat-header-container > .room-icon-btn:last-child,
                #wechatAppUI #page-chat-room .chat-header-container > .room-icon-btn:last-of-type {
                    width: 28px !important;
                    height: 28px !important;
                    min-width: 28px !important;
                    background: transparent !important;
                    border: none !important;
                    box-shadow: none !important;
                    border-radius: 0 !important;
                    padding: 0 !important;
                    margin: 0 !important;
                    display: flex !important;
                    align-items: center !important;
                    justify-content: center !important;
                    position: relative !important;
                }
                #wechatAppUI #page-chat-room .chat-header-container > .room-icon-btn:last-child svg,
                #wechatAppUI #page-chat-room .chat-header-container > .room-icon-btn:last-of-type svg {
                    display: none !important;
                }
                #wechatAppUI #page-chat-room .chat-header-container > .room-icon-btn:last-child::before,
                #wechatAppUI #page-chat-room .chat-header-container > .room-icon-btn:last-of-type::before {
                    content: '' !important;
                    width: 20px !important;
                    height: 2px !important;
                    background-color: #8c8c94 !important;
                    border-radius: 2px !important;
                    box-shadow: 0 -6px 0 #8c8c94, 0 6px 0 #8c8c94 !important;
                }

                /* 2. 仿 QQ 底栏深度美化 */
                #wechatAppUI #page-chat-room .footer-capsule,
                #wechatAppUI .footer-capsule.frosted-glass {
                    position: absolute !important;
                    bottom: 0 !important;
                    left: 0 !important;
                    right: 0 !important;
                    width: 100% !important;
                    height: 104px !important;
                    min-height: 104px !important;
                    max-height: 104px !important;
                    background: #ffffff !important;
                    border: none !important;
                    border-top: none !important;
                    border-radius: 0 !important;
                    box-shadow: none !important;
                    backdrop-filter: none !important;
                    -webkit-backdrop-filter: none !important;
                    box-sizing: border-box !important;
                    padding: 8px 14px calc(8px + env(safe-area-inset-bottom, 10px)) 14px !important;
                    display: flex !important;
                    flex-direction: column !important;
                    justify-content: flex-start !important;
                    z-index: 100 !important;
                }

                #wechatAppUI #page-chat-room .footer-capsule .tool-icon,
                #wechatAppUI #page-chat-room .footer-capsule .room-send-btn {
                    display: none !important;
                }

                #wechatAppUI #page-chat-room .footer-capsule input {
                    display: block !important;
                    width: 100% !important;
                    height: 38px !important;
                    background-color: #f0f0f2 !important;
                    border-radius: 14px !important;
                    border: none !important;
                    outline: none !important;
                    padding: 0 14px !important;
                    font-size: 15px !important;
                    color: #1a1a1a !important;
                    margin: 0 !important;
                    box-sizing: border-box !important;
                    flex: none !important;
                }
                #wechatAppUI #page-chat-room .footer-capsule input::placeholder {
                    color: transparent !important;
                }
                #wechatAppUI #page-chat-room .footer-capsule input:placeholder-shown {
                    background-image: none !important;
                }

                #wechatAppUI #page-chat-room .wc-qq-toolbar {
                    display: flex !important;
                    align-items: center !important;
                    justify-content: space-between !important;
                    width: 100% !important;
                    height: 52px !important;
                    margin-top: -6px !important;
                    transform: translateY(-4px) !important;
                    box-sizing: border-box !important;
                    padding: 0 !important;
                }

                #wechatAppUI #page-chat-room .wc-qq-tool-btn {
                    flex: 1 !important;
                    height: 100% !important;
                    display: flex !important;
                    align-items: center !important;
                    justify-content: center !important;
                    cursor: pointer !important;
                    background: transparent !important;
                    border: none !important;
                    padding: 0 !important;
                    margin: 0 !important;
                    -webkit-tap-highlight-color: transparent !important;
                }
                #wechatAppUI #page-chat-room .wc-qq-tool-btn:active {
                    opacity: 0.6 !important;
                }
                #wechatAppUI #page-chat-room .wc-qq-tool-btn svg {
                    width: 100% !important;
                    height: 52px !important;
                    display: block !important;
                }

                /* 3. 聊天内容流滚动区域适配 */
                #wechatAppUI #page-chat-room .chat-area {
                    background-color: #ffffff !important;
                    padding-top: 92px !important;
                    padding-bottom: 114px !important;
                }

                /* 4. 仿 QQ 更多功能面板与表情包面板适配 (去除边框、无阴影、色调统一) */
                #wechatAppUI .wc-function-panel,
                #wechatAppUI #page-chat-room .wc-function-panel {
                    background-color: #ffffff !important;
                    backdrop-filter: none !important;
                    -webkit-backdrop-filter: none !important;
                    border: none !important;
                    border-top: none !important;
                    border-radius: 0 !important;
                    box-shadow: none !important;
                }
                #wechatAppUI .wc-function-panel .wc-function-icon {
                    color: #8c8c94 !important;
                    background-color: transparent !important;
                }
                #wechatAppUI .wc-function-panel .wc-function-icon svg {
                    fill: currentColor !important;
                    color: #8c8c94 !important;
                }
                #wechatAppUI .wc-function-panel .wc-function-text {
                    color: #8c8c94 !important;
                    font-size: 12px !important;
                    font-weight: 500 !important;
                }
                #wechatAppUI .wc-function-panel .wc-function-item:active {
                    opacity: 0.6 !important;
                    transform: scale(0.92) !important;
                }

                #wechatAppUI .wc-emoji-panel,
                #wechatAppUI #page-chat-room .wc-emoji-panel {
                    background-color: #ffffff !important;
                    backdrop-filter: none !important;
                    -webkit-backdrop-filter: none !important;
                    border: none !important;
                    border-top: none !important;
                    border-radius: 0 !important;
                    box-shadow: none !important;
                }
                #wechatAppUI .wc-emoji-panel .wc-emoji-panel-header {
                    background-color: #ffffff !important;
                    border: none !important;
                }
                #wechatAppUI .wc-emoji-panel .wc-capsule-group {
                    background: #f0f0f2 !important;
                    border: none !important;
                }
                #wechatAppUI .wc-emoji-panel .wc-capsule-item {
                    color: #8c8c94 !important;
                }
                #wechatAppUI .wc-emoji-panel .wc-capsule-item.active {
                    background: #ffffff !important;
                    color: #1a1a1a !important;
                    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.08) !important;
                }
                #wechatAppUI .wc-emoji-panel .wc-search-box {
                    background: #f0f0f2 !important;
                    border: none !important;
                }
                #wechatAppUI .wc-emoji-panel .wc-search-box input {
                    color: #1a1a1a !important;
                }
                #wechatAppUI .wc-emoji-panel .wc-search-box input::placeholder {
                    color: #8c8c94 !important;
                }
                #wechatAppUI .wc-emoji-panel .wc-search-trigger svg {
                    stroke: #8c8c94 !important;
                }
                #wechatAppUI .wc-emoji-panel .wc-cancel-btn {
                    color: #8c8c94 !important;
                }
                #wechatAppUI .wc-emoji-panel .wc-panel-content {
                    color: #8c8c94 !important;
                    background-color: #ffffff !important;
                    border: none !important;
                }
            `;
        return group ? css.replace(/#wechatAppUI(?: #page-chat-room)?/g, '#wechatAppUI #page-group-chat.wc-group-qq') : css;
    }

    function wcGetQqToolbarMarkup() {
        return `
                    <div class="wc-qq-tool-btn" title="语音" onclick="if(typeof wcSendVoiceMessage==='function') wcSendVoiceMessage()">
                        <svg viewBox="0 0 100 52">
                            <g transform="translate(50, 25)">
                                <rect x="-6.5" y="-18" width="13" height="24" rx="6.5" fill="none" stroke="#929298" stroke-width="2.6" stroke-linecap="round"/>
                                <path d="M-13 -2 c0 8 5.8 14 13 14 s13 -6 13 -14" fill="none" stroke="#929298" stroke-width="2.6" stroke-linecap="round"/>
                                <line x1="0" y1="12" x2="0" y2="17" stroke="#929298" stroke-width="2.6" stroke-linecap="round"/>
                            </g>
                        </svg>
                    </div>
                    <div class="wc-qq-tool-btn" title="文本描述图片" onclick="if(typeof wcSimulateSendImage==='function') wcSimulateSendImage()">
                        <svg viewBox="0 0 100 52">
                            <g transform="translate(50, 24.5) scale(-0.045, 0.044) translate(-512, -512)" fill="#929298">
                                <path d="M253.61408 922.624h516.7104a204.61568 204.61568 0 0 0 112.41472-33.80224 202.5984 202.5984 0 0 0 44.01152-39.44448 200.99072 200.99072 0 0 0 30.55616-50.37056A199.10656 199.10656 0 0 0 972.8 722.432V302.71488a198.12352 198.12352 0 0 0-15.4624-76.61568 199.61856 199.61856 0 0 0-30.54592-50.40128 201.08288 201.08288 0 0 0-44.01152-39.46496 203.02848 203.02848 0 0 0-53.68832-25.15968A204.30848 204.30848 0 0 0 770.33472 102.4H253.61408a204.56448 204.56448 0 0 0-50.19648 6.30784 204.9024 204.9024 0 0 0-37.86752 13.7216 204.77952 204.77952 0 0 0-17.63328 9.53344 202.46528 202.46528 0 0 0-16.5376 11.17184 203.25376 203.25376 0 0 0-15.2576 12.67712 200.82688 200.82688 0 0 0-26.27584 29.2864 201.4208 201.4208 0 0 0-14.67392 23.17312 199.29088 199.29088 0 0 0-22.97856 74.71104A198.15424 198.15424 0 0 0 51.2 302.592v419.71712a198.144 198.144 0 0 0 15.43168 76.61568A199.43424 199.43424 0 0 0 97.1776 849.3056a201.1136 201.1136 0 0 0 44.00128 39.4752 203.1616 203.1616 0 0 0 53.67808 25.14944 204.5952 204.5952 0 0 0 58.75712 8.68352z m0-756.98176h516.7104a139.83744 139.83744 0 0 1 76.92288 23.11168 137.984 137.984 0 0 1 38.20544 37.7856 136.27392 136.27392 0 0 1 22.75328 62.93504c0.43008 4.352 0.64512 8.72448 0.65536 13.12768v357.61152L805.20192 525.33248a109.62944 109.62944 0 0 0-34.4064-29.3888 110.21312 110.21312 0 0 0-43.48928-13.1072 110.77632 110.77632 0 0 0-84.1728 28.4672L469.0944 670.5152a46.1824 46.1824 0 0 1-14.4384 8.73472 46.56128 46.56128 0 0 1-16.62976 3.04128c-5.7344 0-11.27424-1.024-16.62976-3.04128a46.1824 46.1824 0 0 1-14.4384-8.73472l-58.65472-52.9408a109.38368 109.38368 0 0 0-33.8944-20.97152 110.30528 110.30528 0 0 0-39.24992-7.54688 110.53056 110.53056 0 0 0-73.6256 27.2384l-86.39488 75.32544V302.592a135.70048 135.70048 0 0 1 15.8208-63.42656 136.97024 136.97024 0 0 1 14.73536-22.26176 137.41056 137.41056 0 0 1 31.0272-28.12928 139.39712 139.39712 0 0 1 63.01696-22.4256c4.608-0.4608 9.216-0.69632 13.8752-0.70656zM356.89472 272.4864a108.29824 108.29824 0 0 0-17.89952-5.91872 109.35296 109.35296 0 0 0-25.1392-2.87744 108.25728 108.25728 0 0 0-43.02848 8.78592 111.69792 111.69792 0 0 0-35.18464 23.56224 111.26784 111.26784 0 0 0-23.57248 35.20512 108.48256 108.48256 0 0 0-8.8064 43.008 108.26752 108.26752 0 0 0 8.8064 43.04896 111.22688 111.22688 0 0 0 23.552 35.19488c1.08544 1.09568 2.21184 2.18112 3.35872 3.2256 9.14432 8.3968 19.77344 15.19616 31.87712 20.3776 6.99392 2.9696 14.1312 5.19168 21.43232 6.656 7.05536 1.41312 14.2336 2.11968 21.56544 2.11968a109.4144 109.4144 0 0 0 43.03872-8.78592 111.6672 111.6672 0 0 0 35.1744-23.57248c1.09568-1.08544 2.17088-2.2016 3.21536-3.33824 8.3968-9.13408 15.18592-19.7632 20.35712-31.85664 2.73408-6.37952 4.83328-12.9024 6.2976-19.5584a108.8512 108.8512 0 0 0 2.5088-23.5008 108.31872 108.31872 0 0 0-8.8064-42.99776 111.18592 111.18592 0 0 0-23.552-35.19488 111.90272 111.90272 0 0 0-35.19488-23.58272z m-85.37088 57.21088a62.58688 62.58688 0 0 1 18.5344-12.01152c2.92864-1.25952 5.90848-2.26304 8.94976-3.03104a60.64128 60.64128 0 0 1 14.848-1.81248 59.72992 59.72992 0 0 1 23.78752 4.83328 62.42304 62.42304 0 0 1 18.86208 12.31872c0.3072 0.3072 1.42336 1.40288 1.71008 1.72032 5.07904 5.30432 9.15456 11.5712 12.2368 18.78016a59.98592 59.98592 0 0 1 4.864 23.808 59.6992 59.6992 0 0 1-4.864 23.79776 62.1568 62.1568 0 0 1-12.3904 18.944 67.9424 67.9424 0 0 1-20.3776 13.85472 60.88704 60.88704 0 0 1-23.8592 4.85376 60.18048 60.18048 0 0 1-23.72608-4.8128 62.8224 62.8224 0 0 1-19.712-13.13792 68.37248 68.37248 0 0 1-13.13792-19.73248 59.8016 59.8016 0 0 1-3.25632-9.87136 60.3648 60.3648 0 0 1-1.5872-13.89568 60.30336 60.30336 0 0 1 4.85376-23.808 62.35136 62.35136 0 0 1 14.26432-20.7872z m498.74944 529.69472H253.61408a139.96032 139.96032 0 0 1-79.60576-24.96512 138.19904 138.19904 0 0 1-37.29408-38.67648 136.74496 136.74496 0 0 1-9.85088-18.25792l-0.01024-0.02048a136.47872 136.47872 0 0 1-3.51232-8.704l120.44288-105.03168a45.4656 45.4656 0 0 1 14.37696-8.54016 45.84448 45.84448 0 0 1 16.52736-2.83648c5.6832 0.07168 11.1616 1.14688 16.4352 3.23584 5.28384 2.08896 10.00448 5.05856 14.16192 8.88832l58.71616 53.06368a110.26432 110.26432 0 0 0 34.54976 21.00224 111.02208 111.02208 0 0 0 39.87456 7.26016 111.4112 111.4112 0 0 0 58.05056-16.4864 110.19264 110.19264 0 0 0 16.22016-12.1856l174.03904-159.19104a45.63968 45.63968 0 0 1 16.30208-9.66656 46.21312 46.21312 0 0 1 28.23168-0.52224 45.9776 45.9776 0 0 1 20.43904 12.68736c0.9728 1.03424 1.88416 2.11968 2.75456 3.24608l149.56544 194.73408a136.02816 136.02816 0 0 1-18.74944 40.448 137.24672 137.24672 0 0 1-30.86336 32.38912 138.63936 138.63936 0 0 1-39.70048 20.91008 139.55072 139.55072 0 0 1-44.4416 7.2192z"/>
                            </g>
                        </svg>
                    </div>
                    <div class="wc-qq-tool-btn" title="真实图片" onclick="document.getElementById('wc-chat-image-input')?.click()">
                        <svg viewBox="0 0 100 52">
                            <g transform="translate(50, 25) scale(0.048, 0.048) translate(-512, -533)" fill="#929298">
                                <path d="M811.4 871H211.7c-81.6 0-148-66.4-148-148V424.8c0-81.6 66.4-148 148-148h28.8c7.9 0 15.3-4.3 19.2-11.2l41.1-73.2c13.8-24.5 39.8-39.8 68-39.8h285.4c28.2 0 54.2 15.2 68 39.8l41.1 73.2c3.9 6.9 11.2 11.2 19.2 11.2h28.8c81.6 0 148 66.4 148 148V723c0.1 81.6-66.3 148-147.9 148zM211.7 332.8c-24.4 0-47.5 9.6-65 27-17.4 17.4-27 40.5-27 65V723c0 24.4 9.6 47.5 27 65 17.4 17.4 40.5 27 65 27h599.7c24.4 0 47.5-9.6 65-27 17.4-17.4 27-40.5 27-65V424.8c0-24.4-9.6-47.5-27-65-17.4-17.4-40.5-27-65-27h-28.8c-28.2 0-54.2-15.2-68-39.8l-41.1-73.2c-3.9-6.9-11.2-11.2-19.2-11.2H368.8c-7.9 0-15.3 4.3-19.2 11.2L308.5 293c-13.8 24.5-39.8 39.8-68 39.8h-28.8z"/>
                                <path d="M511.5 756.5C399.8 756.5 309 665.7 309 554s90.9-202.6 202.6-202.6S714.1 442.3 714.1 554s-90.9 202.5-202.6 202.5z m0-349.1C430.7 407.4 365 473.2 365 554s65.7 146.6 146.6 146.6S658.1 634.8 658.1 554s-65.8-146.6-146.6-146.6z"/>
                            </g>
                        </svg>
                    </div>
                    <div class="wc-qq-tool-btn" title="发送 / 调取API生成回复" onclick="if(typeof wcHandleSendOrApiReply==='function') wcHandleSendOrApiReply()">
                        <svg viewBox="0 0 100 52">
                            <g transform="translate(50, 25.5) scale(0.092) translate(-390, -425)">
                                <g transform="translate(111.124163,748.517951) scale(0.080370,-0.080370)" fill="#929298">
                                    <path d="M5370 6519 c-82 -166 -118 -227 -138 -240 -15 -9 -111 -60 -214 -115 -104 -54 -188 -101 -188 -104 0 -3 96 -57 213 -120 l212 -114 110 -220 c61 -121 115 -221 120 -223 6 -1 60 99 120 223 l110 226 95 48 c52 27 148 78 214 113 l118 65 -28 18 c-15 11 -113 64 -217 119 l-189 100 -100 210 c-55 116 -106 216 -114 224 -11 12 -30 -20 -124 -210z"/>
                                    <path d="M3748 6650 c-148 -11 -230 -25 -398 -66 -704 -173 -1289 -637 -1610 -1279 l-62 -124 -157 5 c-168 7 -264 -2 -394 -37 -43 -12 -92 -31 -110 -43 -41 -28 -44 -60 -23 -239 26 -221 81 -405 181 -613 83 -171 167 -295 281 -413 84 -88 94 -102 109 -160 9 -35 33 -111 54 -170 204 -567 624 -1034 1179 -1311 223 -111 466 -187 746 -233 126 -20 171 -21 1144 -24 726 -3 1029 -1 1068 7 74 16 142 63 180 127 37 62 46 115 33 192 -13 80 -55 140 -217 310 l-143 150 66 78 c242 288 422 682 495 1088 19 101 45 430 35 445 -2 3 -5 46 -6 96 -5 218 -61 503 -126 641 -14 29 -27 53 -29 53 -7 0 -121 -48 -196 -82 -45 -20 -68 -37 -68 -48 0 -9 11 -49 24 -88 86 -252 107 -658 50 -982 -66 -375 -231 -702 -522 -1030 -61 -69 -117 -135 -123 -147 -24 -45 -15 -57 275 -351 l141 -143 -960 4 c-528 2 -978 7 -1000 11 -22 4 -90 16 -152 27 -642 113 -1160 482 -1480 1055 -50 89 -98 192 -113 246 -8 26 -7 27 23 20 66 -14 269 -5 352 17 286 74 521 290 646 591 l33 81 64 -3 64 -3 47 -105 c119 -267 294 -438 541 -529 137 -50 331 -71 465 -50 375 59 622 296 816 781 73 183 135 490 127 628 l-3 55 -52 28 c-103 55 -187 70 -403 71 -219 1 -320 -14 -545 -81 -264 -78 -471 -176 -799 -376 -246 -150 -234 -146 -310 -108 -33 17 -133 73 -221 126 -262 157 -511 277 -702 339 -29 10 -53 22 -53 28 0 20 83 173 142 262 174 262 408 489 668 649 92 56 299 155 399 191 197 70 451 117 661 121 162 4 282 -7 453 -41 71 -14 130 -24 132 -22 6 6 47 165 60 231 15 81 24 74 -135 106 -209 41 -445 56 -642 41z m-2043 -1804 c285 -57 534 -160 865 -356 58 -34 107 -63 108 -65 10 -10 -103 -218 -147 -272 -128 -156 -301 -231 -505 -220 -200 11 -318 79 -453 261 -117 158 -222 420 -256 638 -2 15 1 30 7 33 22 10 303 -4 381 -19z m3055 -5 c0 -16 -13 -82 -30 -146 -79 -306 -240 -574 -412 -686 -116 -75 -297 -99 -450 -60 -144 37 -259 111 -343 222 -44 60 -125 210 -125 233 0 6 12 18 28 27 15 9 80 49 146 88 241 146 465 242 698 300 139 35 225 46 381 50 l107 2 0 -30z"/>
                                </g>
                            </g>
                        </svg>
                    </div>
                    <div class="wc-qq-tool-btn" title="表情包" onclick="event.stopPropagation(); if(typeof wcToggleEmojiPanel==='function') wcToggleEmojiPanel(event)">
                        <svg viewBox="0 0 100 52">
                            <g transform="translate(50, 22) scale(0.038, 0.038) translate(-512, -512)" fill="#929298">
                                <path d="M512 1024C228.693333 1024 0 795.306667 0 512S228.693333 0 512 0s512 228.693333 512 512-228.693333 512-512 512m0-952.32C269.653333 71.68 71.68 269.653333 71.68 512c0 242.346667 197.973333 440.32 440.32 440.32 242.346667 0 440.32-197.973333 440.32-440.32 0-242.346667-197.973333-440.32-440.32-440.32m0 740.693333c-102.4 0-197.973333-47.786667-259.413333-126.293333-13.653333-17.066667-10.24-37.546667 6.826666-51.2 17.066667-13.653333 37.546667-10.24 51.2 6.826667 47.786667 61.44 122.88 98.986667 201.386667 98.986666 78.506667 0 153.6-37.546667 201.386667-98.986666 13.653333-17.066667 34.133333-20.48 51.2-6.826667 17.066667 13.653333 20.48 34.133333 6.826666 51.2-61.44 78.506667-153.6 126.293333-259.413333 126.293333m-163.84-296.96c-30.72 0-54.613333-23.893333-54.613333-54.613333v-71.68c0-30.72 23.893333-54.613333 54.613333-54.613333 30.72 0 54.613333 23.893333 54.613333 54.613333v71.68c0 30.72-23.893333 54.613333-54.613333 54.613333m331.093333 0c-30.72 0-54.613333-23.893333-54.613333-54.613333v-71.68c0-30.72 23.893333-54.613333 54.613333-54.613333s54.613333 23.893333 54.613334 54.613333v71.68c0 30.72-27.306667 54.613333-54.613334 54.613333z"/>
                            </g>
                        </svg>
                    </div>
                    <div class="wc-qq-tool-btn" title="更多功能" onclick="event.stopPropagation(); if(typeof wcToggleFunctionPanel==='function') wcToggleFunctionPanel(event)">
                        <svg viewBox="0 0 100 52">
                            <g transform="translate(50, 22)">
                                <circle cx="0" cy="0" r="18" fill="none" stroke="#929298" stroke-width="2.7"/>
                                <line x1="0" y1="-9" x2="0" y2="9" stroke="#929298" stroke-width="2.7" stroke-linecap="round"/>
                                <line x1="-9" y1="0" x2="9" y2="0" stroke="#929298" stroke-width="2.7" stroke-linecap="round"/>
                            </g>
                        </svg>
                    </div>
                `;
    }

    window.WcQqChatTheme = Object.freeze({ styles: wcGetQqBarCss, toolbarMarkup: wcGetQqToolbarMarkup });

    function wcApplyQqBarSettings() {
        let styleTag = document.getElementById('wc-dynamic-qq-bar-style');
        if (!styleTag) {
            styleTag = document.createElement('style');
            styleTag.id = 'wc-dynamic-qq-bar-style';
            document.head.appendChild(styleTag);
        }

        const contact = wcContactsList.find(c => c.id === wcCurrentChatContactId);
        const isEnabled = contact && contact.qq_bar_enabled === true;

        const footer = document.querySelector('#page-chat-room .footer-capsule');
        let toolbar = footer ? footer.querySelector('.wc-qq-toolbar') : null;

        if (isEnabled) {
            styleTag.textContent = wcGetQqBarCss();

            if (footer && !toolbar) {
                toolbar = document.createElement('div');
                toolbar.className = 'wc-qq-toolbar';
                toolbar.innerHTML = wcGetQqToolbarMarkup();
                footer.appendChild(toolbar);
            }
        } else {
            styleTag.textContent = '';
            if (toolbar) toolbar.remove();
        }
    }
    window.wcApplyQqBarSettings = wcApplyQqBarSettings;

    function wcApplyPinkLayerCardBarSettings() {
        let styleTag = document.getElementById('wc-dynamic-pink-layer-card-bar-style');
        if (!styleTag) {
            styleTag = document.createElement('style');
            styleTag.id = 'wc-dynamic-pink-layer-card-bar-style';
            document.head.appendChild(styleTag);
        }

        const contact = wcContactsList.find(c => c.id === wcCurrentChatContactId);
        const isEnabled = contact && contact.pink_layer_card_bar_enabled === true;

        if (isEnabled) {
            styleTag.textContent = `
/* ==========================================
   半屏层叠卡片 - 灰粉色系 (终极物理防穿透版)
   ========================================== */

/* 1. 整体背景 */
#wechatAppUI #page-chat-room {
    background-color: #F4EAEF !important; /* 低饱和灰粉色背景 */
}

/* 2. 背后的半透明层叠卡片 */
#wechatAppUI #page-chat-room::before {
    content: '';
    position: absolute !important;
    top: 55px !important; /* 位于状态栏下方 */
    left: 6% !important;
    right: 6% !important;
    height: 40px !important;
    background-color: rgba(255, 255, 255, 0.5) !important;
    border-radius: 24px 24px 0 0 !important;
    z-index: 1 !important;
    pointer-events: none !important;
}

/* 3. 前方的主聊天卡片 (纯白背景) */
#wechatAppUI #page-chat-room::after {
    content: '';
    position: absolute !important;
    top: 70px !important; /* 露出背后的卡片 */
    left: 0 !important;
    right: 0 !important;
    bottom: 0 !important;
    background-color: #FFFFFF !important;
    border-radius: 32px 32px 0 0 !important;
    box-shadow: 0 -4px 24px rgba(0,0,0,0.06) !important;
    z-index: 2 !important;
    pointer-events: none !important;
}

/* 4. 顶栏区域 (精准定位，恢复点击) */
#wechatAppUI .chat-header-container {
    position: absolute !important;
    top: 70px !important; /* 与白色主卡片顶部对齐 */
    left: 0 !important;
    right: 0 !important;
    height: 52px !important;
    padding: 10px 16px !important;
    background: transparent !important;
    border: none !important;
    box-shadow: none !important;
    backdrop-filter: none !important;
    -webkit-backdrop-filter: none !important;
    margin: 0 !important;
    z-index: 20 !important;
    pointer-events: none !important; /* 容器穿透，防止阻挡下方点击 */
}

/* 左侧返回按钮 (恢复点击，替换为纯SVG) */
#wechatAppUI .chat-header-container .room-icon-btn:first-child {
    pointer-events: auto !important; /* 强制恢复点击事件 */
    background: transparent !important;
    border: none !important;
    box-shadow: none !important;
    width: 32px !important;
    height: 32px !important;
    padding: 0 !important;
    display: flex !important;
    justify-content: flex-start !important;
    align-items: center !important;
    cursor: pointer !important;
}
#wechatAppUI .chat-header-container .room-icon-btn:first-child svg {
    display: none !important; /* 隐藏原有SVG */
}
#wechatAppUI .chat-header-container .room-icon-btn:first-child::after {
    content: '';
    display: block !important;
    width: 24px !important;
    height: 24px !important;
    background: url("data:image/svg+xml,%3Csvg viewBox='0 0 24 24' fill='none' stroke='%23000' stroke-width='2.5' stroke-linecap='round' stroke-linejoin='round' xmlns='http://www.w3.org/2000/svg'%3E%3Cpolyline points='15 18 9 12 15 6'%3E%3C/polyline%3E%3C/svg%3E") center/contain no-repeat !important;
}

/* 右侧菜单按钮 (恢复点击，替换为列表SVG) */
#wechatAppUI .chat-header-container .room-icon-btn:last-child {
    pointer-events: auto !important; /* 强制恢复点击事件 */
    background: transparent !important;
    border: none !important;
    box-shadow: none !important;
    width: 32px !important;
    height: 32px !important;
    padding: 0 !important;
    display: flex !important;
    justify-content: flex-end !important;
    align-items: center !important;
    cursor: pointer !important;
}
#wechatAppUI .chat-header-container .room-icon-btn:last-child svg {
    display: none !important; /* 隐藏原有SVG */
}
#wechatAppUI .chat-header-container .room-icon-btn:last-child::after {
    content: '';
    display: block !important;
    width: 24px !important;
    height: 24px !important;
    background: url("data:image/svg+xml,%3Csvg viewBox='0 0 24 24' fill='none' stroke='%23000' stroke-width='2.5' stroke-linecap='round' stroke-linejoin='round' xmlns='http://www.w3.org/2000/svg'%3E%3Cline x1='3' y1='12' x2='21' y2='12'%3E%3C/line%3E%3Cline x1='3' y1='6' x2='21' y2='6'%3E%3C/line%3E%3Cline x1='3' y1='18' x2='21' y2='18'%3E%3C/line%3E%3C/svg%3E") center/contain no-repeat !important;
}

/* 中间名字区域去背景 */
#wechatAppUI .chat-header-container .room-info-capsule {
    pointer-events: auto !important; /* 强制恢复点击事件 */
    background: transparent !important;
    border: none !important;
    box-shadow: none !important;
}
#wechatAppUI .chat-header-container .room-info-text .name {
    color: #000 !important;
    font-size: 18px !important;
}
#wechatAppUI .chat-header-container .room-info-text .sub {
    color: #8E8E93 !important;
}

/* 5. 聊天区域 (物理隔离，彻底防穿透！) */
#wechatAppUI .chat-area {
    position: absolute !important;
    top: 122px !important; /* 关键：严格限制顶部边界，消息滚到这里就会被裁剪，绝不穿透 */
    bottom: 0 !important;
    left: 0 !important;
    right: 0 !important;
    padding-top: 10px !important;
    padding-bottom: 100px !important; /* 避开悬浮底栏 */
    background: transparent !important;
    z-index: 10 !important;
    flex: none !important; /* 覆盖原版 flex，防止被拉伸 */
    height: auto !important;
}

/* 6. 悬浮底栏与内嵌按钮 (强绝对定位防错乱) */
#wechatAppUI .footer-capsule {
    position: absolute !important;
    bottom: 24px !important;
    left: 16px !important;
    right: 16px !important;
    height: 56px !important;
    background-color: #FFFFFF !important;
    border-radius: 28px !important;
    padding: 0 8px 0 16px !important;
    box-shadow: 0 8px 24px rgba(0,0,0,0.08) !important;
    border: 1px solid rgba(0,0,0,0.03) !important;
    backdrop-filter: none !important;
    -webkit-backdrop-filter: none !important;
    box-sizing: border-box !important;
    display: flex !important;
    align-items: center !important;
    z-index: 100 !important;
    pointer-events: auto !important;
}

/* 隐藏底栏所有原有的 SVG 路径，防止干扰 */
#wechatAppUI .footer-capsule > svg path,
#wechatAppUI .footer-capsule > svg circle,
#wechatAppUI .footer-capsule > svg line,
#wechatAppUI .footer-capsule > svg rect,
#wechatAppUI .footer-capsule > svg polyline {
    display: none !important;
}

/* 左侧：语音波纹 (强制在最左侧) */
#wechatAppUI .footer-capsule > svg:first-of-type {
    pointer-events: auto !important;
    cursor: pointer !important;
    position: relative !important;
    transform: none !important;
    width: 28px !important;
    height: 28px !important;
    margin: 0 12px 0 0 !important;
    padding: 0 !important;
    flex-shrink: 0 !important;
    background: url("data:image/svg+xml,%3Csvg viewBox='0 0 24 24' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M12 2v20M17 7v10M7 9v6M22 10v4M2 11v2' stroke='%238E8E93' stroke-width='2' fill='none' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E") center/24px no-repeat !important;
}

/* 中间：输入框变身灰色胶囊，包裹右侧按钮 */
#wechatAppUI .footer-capsule input {
    pointer-events: auto !important;
    position: relative !important;
    flex: 1 !important;
    min-width: 0 !important;
    height: 42px !important;
    background-color: #F2F2F7 !important;
    border-radius: 21px !important;
    padding: 0 80px 0 16px !important; /* 右侧留出80px空间给表情和发送按钮 */
    margin: 0 !important;
    font-size: 15px !important;
    color: #000 !important;
    border: none !important;
    box-sizing: border-box !important;
}

/* 替换输入框提示词为 ★☆ Send */
#wechatAppUI .footer-capsule input::placeholder {
    color: transparent !important;
}
#wechatAppUI .footer-capsule input:placeholder-shown {
    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100' height='42'%3E%3Ctext x='16' y='26' fill='%23C7C7CC' font-family='sans-serif' font-size='15' font-weight='500'%3E★☆ Send%3C/text%3E%3C/svg%3E") !important;
    background-repeat: no-repeat !important;
    background-position: left center !important;
}

/* 右侧1：表情按钮移入输入框 (强制绝对定位) */
#wechatAppUI .footer-capsule > svg:nth-of-type(2) {
    pointer-events: auto !important;
    cursor: pointer !important;
    position: absolute !important;
    right: 56px !important; /* 定位在发送按钮左侧 */
    top: 50% !important;
    margin: -12px 0 0 0 !important;
    padding: 0 !important;
    transform: none !important;
    width: 24px !important;
    height: 24px !important;
    z-index: 10 !important;
    background: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='24' height='24' fill='%238E8E93' viewBox='0 0 24 24'%3E%3Cpath d='M18 3a3 3 0 1 0 0 6 3 3 0 1 0 0-6'/%3E%3Cpath d='M19.97 10.59c.01.14.03.27.03.41 0 3.31-3.59 6-8 6-.22 0-.43.07-.6.2L9 19v-1.73c0-.41-.25-.78-.64-.93C5.67 15.3 4 13.26 4 11c0-3.31 3.59-6 8-6 .37 0 .74.03 1.09.06.13-.7.41-1.35.81-1.91-.62-.1-1.25-.15-1.9-.15C6.49 3 2 6.59 2 11c0 2.91 1.9 5.51 5 6.93V21c0 .38.21.72.55.89.14.07.29.11.45.11.21 0 .42-.07.6-.2l3.74-2.8c5.36-.14 9.66-3.67 9.66-8 0-.6-.09-1.18-.24-1.74a5.1 5.1 0 0 1-1.78 1.33Z'/%3E%3C/svg%3E") center/22px no-repeat !important;
    border: none !important;
}

/* 右侧2：发送按钮 (强绝对定位在输入框最右侧，彻底去除发光阴影) */
#wechatAppUI .footer-capsule .room-send-btn {
    pointer-events: auto !important;
    cursor: pointer !important;
    position: absolute !important;
    right: 14px !important; /* 钉在最右侧 */
    top: 50% !important;
    margin: -16px 0 0 0 !important;
    padding: 0 !important;
    width: 32px !important;
    height: 32px !important;
    background-color: #D6A8B8 !important; /* 灰粉色按钮 */
    border-radius: 50% !important;
    display: flex !important;
    justify-content: center !important;
    align-items: center !important;
    z-index: 10 !important;
    box-shadow: none !important; /* 彻底去除蓝色发光阴影 */
    transform: none !important;
}
#wechatAppUI .footer-capsule .room-send-btn svg {
    display: none !important; /* 隐藏原有 SVG */
}
#wechatAppUI .footer-capsule .room-send-btn::after {
    content: '';
    display: block !important;
    width: 16px !important;
    height: 16px !important;
    background: url("data:image/svg+xml,%3Csvg viewBox='0 0 24 24' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M12 20V4' stroke='%23FFF' stroke-width='3.5' fill='none' stroke-linecap='round' stroke-linejoin='round'/%3E%3Cpath d='M5 11l7-7 7 7' stroke='%23FFF' stroke-width='3.5' fill='none' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E") center/contain no-repeat !important;
}
            `;
        } else {
            styleTag.textContent = '';
        }
    }
    window.wcApplyPinkLayerCardBarSettings = wcApplyPinkLayerCardBarSettings;

    function wcApplyCustomJs(jsText) {
        if (jsText === undefined) {
            const jsInput = document.getElementById('wc-custom-js-input');
            jsText = jsInput ? jsInput.value : '';
        }
        const oldScript = document.getElementById('wc-dynamic-chat-custom-script');
        if (oldScript) oldScript.remove();

        if (!jsText || !jsText.trim()) return;

        try {
            const scriptTag = document.createElement('script');
            scriptTag.id = 'wc-dynamic-chat-custom-script';
            scriptTag.textContent = `(function(){\ntry {\n${jsText}\n} catch(err) { console.error('聊天室自定义脚本执行错误:', err); }\n})();`;
            document.body.appendChild(scriptTag);
        } catch (err) {
            console.error('注入聊天室自定义脚本失败:', err);
        }
    }
    window.wcApplyCustomJs = wcApplyCustomJs;

    function wcSaveCustomTheme() {
        const cssInput = document.getElementById('wc-custom-css-input');
        const jsInput = document.getElementById('wc-custom-js-input');
        const cssText = cssInput ? cssInput.value : '';
        const jsText = jsInput ? jsInput.value : '';

        const contact = wcContactsList.find(c => c.id === wcCurrentChatContactId);
        if (contact) {
            contact.customCss = cssText;
            contact.customJs = jsText;
            contact.currentPresetId = null;
            wcSaveContactsDataAsync();
        }
        wcApplyCustomCss(cssText);
        wcApplyCustomJs(jsText);
        showCustomAlert("提示", "自定义美化与脚本已应用！");
    }

    function wcOpenSavePresetDialog() {
        showCustomPrompt('保存为预设', { placeholder: '请输入预设名称' }, '确定').then(name => {
            if (name === null) return;
            if (!name.trim()) {
                showCustomAlert("提示", "请输入预设名称");
                return;
            }
            wcEnsureChatPresets();
            const css = document.getElementById('wc-custom-css-input')?.value || '';
            const js = document.getElementById('wc-custom-js-input')?.value || '';
            const newPreset = {
                id: 'wc_chat_preset_' + Date.now(),
                name: name.trim(),
                author: '我',
                css: css,
                js: js
            };
            wcChatPresets.push(newPreset);
            window.wcChatPresets = wcChatPresets;
            wcSaveChatPresetsToStorage();
            showCustomAlert("成功", `已保存至美化预设库：${name.trim()}`);
        });
    }

    async function wcClearCustomCss() {
        const cssInput = document.getElementById('wc-custom-css-input');
        const jsInput = document.getElementById('wc-custom-js-input');
        if (cssInput) cssInput.value = '';
        if (jsInput) jsInput.value = '';

        const contact = wcContactsList.find(c => c.id === wcCurrentChatContactId);
        if (contact) {
            contact.customCss = '';
            contact.customJs = '';
            contact.currentPresetId = null;
            await wcSaveContactsDataAsync(); // 强制等待保存完成
        }
        if (typeof appSettings !== 'undefined') {
            // Remove legacy chat-level values so startup cannot restore old styling.
            appSettings.wc_custom_css = '';
            appSettings.wc_custom_js = '';
            if (typeof saveAppSettings === 'function') saveAppSettings();
        }
        wcApplyCustomCss('');
        wcApplyCustomJs('');
        if (typeof wcRefreshChatAfterCustomCodeClear === 'function') wcRefreshChatAfterCustomCodeClear();
        
        if (typeof showToast === 'function') showToast('自定义美化与脚本已清空');
    }
    window.wcClearCustomCss = wcClearCustomCss;

    function wcTriggerImportChatTheme() {
        const fileInput = document.getElementById('wc-chat-theme-file-input');
        if (fileInput) fileInput.click();
    }
    window.wcTriggerImportChatTheme = wcTriggerImportChatTheme;

    async function wcHandleChatThemeImportFile(event) {
        const file = event.target.files?.[0];
        if (!file) return;

        const extension = file.name.split('.').pop()?.toLowerCase();
        try {
            let rawText = '';
            const buffer = await file.arrayBuffer();
            if (extension === 'docx') {
                rawText = wcDocxXmlToChatText(await wcReadChatDocxXml(buffer));
            } else {
                rawText = wcDecodeChatText(buffer);
            }

            const parsed = wcParseThemeContent(rawText);
            const importedCss = parsed.css || '';
            const importedJs = parsed.js || '';

            const cssInput = document.getElementById('wc-custom-css-input');
            const jsInput = document.getElementById('wc-custom-js-input');
            if (cssInput) cssInput.value = importedCss;
            if (jsInput) jsInput.value = importedJs;

            wcApplyCustomCss(importedCss);
            wcApplyCustomJs(importedJs);

            const contact = wcContactsList.find(c => c.id === wcCurrentChatContactId);
            if (contact) {
                contact.customCss = importedCss;
                contact.customJs = importedJs;
                contact.currentPresetId = null;
                wcSaveContactsDataAsync();
            }

            showToast('聊天美化与脚本导入成功');
        } catch (error) {
            console.error('导入聊天美化失败:', error);
            showToast('导入失败，请检查文件格式');
        } finally {
            event.target.value = '';
        }
    }
    window.wcHandleChatThemeImportFile = wcHandleChatThemeImportFile;

    async function wcExportChatTheme() {
        const cssInput = document.getElementById('wc-custom-css-input');
        const jsInput = document.getElementById('wc-custom-js-input');
        const css = cssInput ? cssInput.value : '';
        const js = jsInput ? jsInput.value : '';

        if (!css.trim() && !js.trim()) {
            showToast('当前没有可导出的 CSS 或脚本内容');
            return;
        }

        const contact = wcContactsList.find(c => c.id === wcCurrentChatContactId);
        const contactName = contact ? (contact.remark || contact.name) : 'Chat';
        const now = new Date();
        const dateStr = `${now.getFullYear()}${String(now.getMonth() + 1).padStart(2, '0')}${String(now.getDate()).padStart(2, '0')}`;
        const defaultName = `${contactName}_Theme_${dateStr}`;

        const customName = typeof showCustomPrompt === 'function'
            ? await showCustomPrompt('导出聊天美化 (TXT)', { placeholder: '请输入文件名', value: defaultName }, '导出')
            : window.prompt('请输入文件名:', defaultName);

        if (customName === null) return;
        const fileName = (customName && customName.trim()) ? customName.trim() : defaultName;

        const outText = wcFormatThemeOutputTxt(css, js);
        const blob = new Blob([outText], { type: 'text/plain;charset=utf-8' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = fileName.endsWith('.txt') ? fileName : `${fileName}.txt`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        showToast('美化已导出为 TXT');
    }
    window.wcExportChatTheme = wcExportChatTheme;

    function wcApplyCustomCss(cssText) {
        if (cssText === undefined) {
            cssText = document.getElementById('wc-custom-css-input').value;
        }
        let styleTag = document.getElementById('wc-dynamic-style');
        if (!styleTag) {
            styleTag = document.createElement('style');
            styleTag.id = 'wc-dynamic-style';
            document.head.appendChild(styleTag);
        }

        // 注入隐藏系统消息的基础样式（平时隐藏，多选模式显示）
        let baseStyleTag = document.getElementById('wc-base-system-event-style');
        if (!baseStyleTag) {
            baseStyleTag = document.createElement('style');
            baseStyleTag.id = 'wc-base-system-event-style';
            baseStyleTag.textContent = `
                #wechatAppUI .message-row.system-event-row {
                    display: none !important;
                }
                #wechatAppUI .chat-area.multi-select-mode .message-row.system-event-row {
                    display: flex !important;
                    justify-content: center !important;
                    align-items: center !important;
                    margin: 10px 0 !important;
                    padding: 0 12px !important;
                }
                #wechatAppUI .wc-system-event-bubble {
                    background: rgba(0, 0, 0, 0.06);
                    color: #8e8e93;
                    font-size: 12px;
                    line-height: 1.4;
                    padding: 6px 14px;
                    border-radius: 12px;
                    max-width: 80%;
                    text-align: center;
                    word-break: break-word;
                    user-select: none;
                }
            `;
            document.head.appendChild(baseStyleTag);
        }

        if (!cssText.trim()) {
            styleTag.textContent = '';
            return;
        }

        let processedCss = cssText.replace(/\/\*[\s\S]*?\*\//g, '');
        processedCss = processedCss.replace(/(^|\})\s*([^{]+)/g, function(m, p1, p2) {
            if (p2.trim().startsWith('@')) return m;
            const prefixed = p2.split(',').map(selector => {
                const s = selector.trim();
                if (!s) return '';
                if (s.startsWith('#wechatAppUI')) return s;
                return '#wechatAppUI ' + s;
            }).filter(Boolean).join(', ');
            return p1 + ' ' + prefixed + ' ';
        });

        styleTag.textContent = processedCss;
    }

    let wcCopyCssCurrentPage = 1;

    // 复制内部统一 SVG 图标字符串
    const WC_COPY_INLINE_SVG = `<svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="display:block;"><rect x="9" y="9" width="13" height="13" rx="2"></rect><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path></svg>`;

    // 第 1 页：原生聊天室全量基础 CSS (无批注，纯原生 CSS)
    const WC_COPY_PAGE1_BASE_CSS = `/* 1. 聊天室主容器与聊天背景 */
#wechatAppUI #page-chat-room {
    background-color: #ffffff;
}
#wechatAppUI .chat-area {
    background-color: transparent;
    padding-top: 100px;
    padding-bottom: 100px;
}

/* 2. 顶栏容器及所有按键 */
#wechatAppUI .chat-header-container {
    height: 44px;
    top: 45px;
    left: 16px;
    right: 16px;
}
/* 左侧返回按键 */
#wechatAppUI .chat-header-container .room-icon-btn:first-child {
    width: 44px;
    height: 44px;
    border-radius: 50%;
    background-color: rgba(255, 255, 255, 0.75);
    border: 1px solid rgba(230, 230, 230, 0.6);
}
#wechatAppUI .chat-header-container .room-icon-btn:first-child svg {
    width: 22px;
    height: 22px;
    stroke: #000000;
}
/* 中间角色名字胶囊与头像 */
#wechatAppUI .chat-header-container .room-info-capsule {
    height: 44px;
    border-radius: 22px;
    background-color: rgba(255, 255, 255, 0.75);
    border: 1px solid rgba(230, 230, 230, 0.6);
}
#wechatAppUI .chat-header-container .room-info-capsule .avatar {
    width: 34px;
    height: 34px;
    border-radius: 50%;
}
#wechatAppUI .room-info-text .name {
    font-size: 15px;
    font-weight: 800;
    color: #000000;
}
#wechatAppUI .room-info-text .sub {
    font-size: 11px;
    color: #8E8E93;
}
/* 右侧更多功能按键 (三点按键) */
#wechatAppUI .chat-header-container .room-icon-btn:last-child {
    width: 44px;
    height: 44px;
    border-radius: 50%;
    background-color: rgba(255, 255, 255, 0.75);
    border: 1px solid rgba(230, 230, 230, 0.6);
}
#wechatAppUI .chat-header-container .room-icon-btn:last-child svg {
    width: 22px;
    height: 22px;
    fill: #000000;
}

/* 3. 底栏输入胶囊及所有交互按键 */
#wechatAppUI .footer-capsule {
    height: 52px;
    border-radius: 26px;
    background-color: rgba(255, 255, 255, 0.75);
    border: 1px solid rgba(230, 230, 230, 0.6);
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.06);
}
/* 表情包弹出按键 */
#wechatAppUI .footer-capsule .tool-icon[onclick*="wcToggleEmojiPanel"] {
    width: 26px;
    height: 26px;
    color: #8E8E93;
}
/* 文字输入框 */
#wechatAppUI .footer-capsule input {
    font-size: 16px;
    font-weight: 600;
    color: #000000;
}
/* 更多扩展功能按键 (加号按键) */
#wechatAppUI .footer-capsule .tool-icon[onclick*="wcToggleFunctionPanel"] {
    width: 26px;
    height: 26px;
    color: #8E8E93;
}
/* 发送 / API回复触发按键 */
#wechatAppUI .room-send-btn {
    width: 40px;
    height: 40px;
    border-radius: 50%;
    background-color: #3390EC;
    color: #ffffff;
}

/* 4. 引用回复全套样式 (输入预览条 / 气泡内嵌引用条 / 浮动引用卡片) */
/* 4.1 底部输入框上方的引用预览条 */
#wechatAppUI .wc-reply-preview {
    background: rgba(0, 0, 0, 0.05);
    border-radius: 12px;
    padding: 6px 10px;
}
#wechatAppUI .wc-reply-preview-name {
    font-size: 12px;
    font-weight: 600;
    color: #007AFF;
}
#wechatAppUI .wc-reply-preview-text {
    font-size: 13px;
    color: #3C3C43;
}
#wechatAppUI .wc-reply-preview-close {
    width: 20px;
    height: 20px;
}

/* 4.2 聊天气泡内嵌的引用小卡片条 (Bubble Quote) */
#wechatAppUI .wc-bubble-reply {
    background: rgba(128, 128, 128, 0.15);
    border-radius: 6px;
    padding: 6px 10px;
    font-size: 13px;
    display: flex;
    flex-direction: column;
    width: 100%;
    box-sizing: border-box;
}
#wechatAppUI .wc-bubble-reply-name {
    font-weight: 600;
    opacity: 0.75;
    margin-bottom: 2px;
    font-size: 12px;
    color: inherit;
}
#wechatAppUI .wc-bubble-reply-text {
    opacity: 0.85;
    color: inherit;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
}

/* 4.3 引用激活时背景全屏毛玻璃遮罩 & 悬浮被引用气泡卡片 */
#wechatAppUI .wc-reply-active-overlay {
    position: absolute;
    inset: 0;
    background: rgba(255, 255, 255, 0.4);
    backdrop-filter: blur(18px) saturate(140%);
    -webkit-backdrop-filter: blur(18px) saturate(140%);
}
#wechatAppUI .wc-reply-float-bubble-box {
    position: absolute;
    bottom: calc(90px + env(safe-area-inset-bottom));
    left: 16px;
    right: 16px;
}

/* 5. 消息行与头像 */
#wechatAppUI .message-row {
    margin-bottom: 14px;
}
#wechatAppUI .msg-avatar {
    width: 40px;
    height: 40px;
    border-radius: 50%;
    background-color: #E5E5EA;
}

/* 6. 聊天气泡基础与文本 */
#wechatAppUI .message-bubble {
    padding: 8px 14px;
    border-radius: 18px;
    min-height: 36px;
}
#wechatAppUI .message-bubble.received {
    background-color: #F2F2F7;
}
#wechatAppUI .message-bubble.received .msg-text {
    color: #000000;
    font-size: 16px;
}
#wechatAppUI .message-bubble.sent {
    background-color: #000000;
}
#wechatAppUI .message-bubble.sent .msg-text {
    color: #ffffff;
    font-size: 16px;
}

/* 7. 时间戳 */
#wechatAppUI .msg-meta {
    font-size: 11px;
    font-weight: 700;
    bottom: -18px;
}
#wechatAppUI .message-bubble.received .msg-meta {
    color: #8E8E93;
}
#wechatAppUI .message-bubble.sent .msg-meta {
    color: rgba(0, 0, 0, 0.4);
}

/* 8. 系统通知居中条 */
#wechatAppUI .sys-badge {
    background-color: rgba(0, 0, 0, 0.15);
    color: #ffffff;
    font-size: 13px;
    border-radius: 14px;
    padding: 4px 12px;
}
#wechatAppUI .wc-center-timestamp {
    font-size: 12px;
    color: #8E8E93;
    margin: 16px 0;
}

/* 9. 语音气泡 */
#wechatAppUI .wc-voice-container {
    min-width: 140px;
}
#wechatAppUI .wc-voice-play {
    width: 14px;
    height: 14px;
}
#wechatAppUI .wc-voice-wave {
    width: 2px;
    border-radius: 1px;
}
#wechatAppUI .wc-voice-duration {
    font-size: 13px;
    color: #8E8E93;
}
#wechatAppUI .wc-voice-text {
    font-size: 15px;
    color: #000000;
}

/* 10. 表情包与图片气泡 */
#wechatAppUI .message-bubble.wc-image-message-bubble {
    background: transparent !important;
    padding: 0 !important;
}
#wechatAppUI .message-bubble.wc-image-message-bubble img {
    border-radius: 12px;
    max-width: 200px;
}`;

    // 第 2 页：各板块专门卡片专属 CSS (边框外中文与批注，边框内代码及复制SVG)
    const WC_COPY_PAGE2_CARDS = [
        {
            title: "引用回复条与浮动气泡样式 (Quote & Reply)",
            badge: "引用板块",
            badgeColor: "#007AFF",
            note: "包含气泡内部被引用的灰色小卡片条（.wc-bubble-reply）、被引用人名称（.wc-bubble-reply-name）、被引用的截断文本（.wc-bubble-reply-text），以及点击引用时在输入框上方浮起的卡片盒（.wc-reply-float-bubble-box）。",
            code: `/* 1. 聊天气泡内部内嵌的引用条卡片 */
#wechatAppUI .wc-bubble-reply {
    background: rgba(128, 128, 128, 0.15) !important;
    border-radius: 6px !important;
    padding: 6px 10px !important;
    font-size: 13px !important;
    display: flex !important;
    flex-direction: column !important;
    width: 100% !important;
    box-sizing: border-box !important;
    max-width: 100% !important;
    overflow: hidden !important;
}
/* 被引用人的名字 (如: Alice) */
#wechatAppUI .wc-bubble-reply-name {
    font-weight: 600 !important;
    opacity: 0.75 !important;
    margin-bottom: 2px !important;
    font-size: 12px !important;
}
/* 被引用的内容摘要文本 */
#wechatAppUI .wc-bubble-reply-text {
    white-space: nowrap !important;
    overflow: hidden !important;
    text-overflow: ellipsis !important;
    opacity: 0.85 !important;
}

/* 2. 点击引用时，悬浮在输入栏正上方的卡片容器 */
#wechatAppUI .wc-reply-float-bubble-box {
    position: absolute !important;
    bottom: calc(90px + env(safe-area-inset-bottom)) !important;
    left: 16px !important;
    right: 16px !important;
    z-index: 105 !important;
}
/* 引用时全屏高斯模糊背景遮罩 */
#wechatAppUI .wc-reply-active-overlay {
    position: absolute !important;
    inset: 0 !important;
    background: rgba(255, 255, 255, 0.4) !important;
    backdrop-filter: blur(18px) saturate(140%) !important;
    -webkit-backdrop-filter: blur(18px) saturate(140%) !important;
}`
        },
        {
            title: "顶栏右上角下拉菜单 (Dropdown Menu)",
            badge: "菜单面板",
            badgeColor: "#5856D6",
            note: "点击顶栏三点按钮弹出的下拉菜单容器、菜单条目及内部矢量图标样式。",
            code: `/* 顶栏右上角下拉功能菜单 */
#wechatAppUI .dropdown-menu {
    width: 220px !important;
    background-color: #ffffff !important;
    border-radius: 16px !important;
    box-shadow: 0 8px 24px rgba(0,0,0,0.12) !important;
    padding: 8px 0 !important;
}
#wechatAppUI .dropdown-menu .menu-item {
    padding: 12px 16px !important;
    gap: 14px !important;
}
#wechatAppUI .dropdown-menu .menu-item:active {
    background-color: #F1F1F4 !important;
}
#wechatAppUI .dropdown-menu .menu-item svg {
    width: 22px !important;
    height: 22px !important;
    stroke: #000000 !important;
}
#wechatAppUI .dropdown-menu .menu-item span {
    font-size: 16px !important;
    font-weight: 600 !important;
    color: #000000 !important;
}`
        },
        {
            title: "气泡长按菜单与 Emoji 悬浮胶囊",
            badge: "长按菜单",
            badgeColor: "#FF2D55",
            note: "长按任意气泡触发的半透明背景、Emoji 反应悬浮条以及下方动作操作项（引用、撤回、收藏、删除等）。",
            code: `/* 气泡长按菜单与 Emoji 悬浮条 */
#wechatAppUI .wc-bubble-emojis-capsule {
    background: #ffffff !important;
    border-radius: 30px !important;
    padding: 6px 10px 6px 14px !important;
}
#wechatAppUI .wc-bubble-menu-emoji {
    font-size: 20px !important;
}
#wechatAppUI .wc-bubble-action-menu {
    background: #ffffff !important;
    border-radius: 16px !important;
    width: 150px !important;
}
#wechatAppUI .wc-bubble-menu-item {
    padding: 10px 16px !important;
    font-size: 14px !important;
    color: #000000 !important;
}
#wechatAppUI .wc-bubble-menu-item svg {
    width: 18px !important;
    height: 18px !important;
}`
        },
        {
            title: "微信转账卡片 (Transfer Card)",
            badge: "转账板块",
            badgeColor: "#FA9D3B",
            note: "微信转账气泡必须去除默认背景，包含待收款与已收款状态颜色适配。",
            code: `/* 微信转账卡片 */
#wechatAppUI .message-bubble.transfer-bubble {
    background-color: transparent !important;
    padding: 0 !important;
    box-shadow: none !important;
}
#wechatAppUI .wc-transfer-card {
    width: 230px !important;
    border-radius: 6px !important;
    overflow: hidden !important;
}
#wechatAppUI .wc-transfer-top {
    padding: 12px 14px !important;
}
#wechatAppUI .wc-transfer-amount {
    font-size: 17px !important;
    font-weight: 500 !important;
    color: #FFFFFF !important;
}
#wechatAppUI .wc-transfer-card.pending {
    background-color: #3A3A3C !important;
}
#wechatAppUI .wc-transfer-card.received {
    background-color: #8E8E93 !important;
}`
        },
        {
            title: "亲属卡专属卡片 (Family Card)",
            badge: "亲属卡板块",
            badgeColor: "#FF3B30",
            note: "亲属卡片额度显示、品牌标识和内部消费状态的专属样式。",
            code: `/* 亲属卡卡片 */
#wechatAppUI .message-bubble:has(.wc-family-card-bubble) {
    background-color: transparent !important;
    padding: 0 !important;
}
#wechatAppUI .wc-family-card-bubble {
    width: 240px !important;
    border-radius: 12px !important;
    padding: 14px 16px !important;
    background-color: #1C1C1E !important;
    color: #ffffff !important;
}
#wechatAppUI .wc-family-card-bubble .pay-amount {
    font-size: 24px !important;
    font-weight: 600 !important;
    color: #ffffff !important;
}`
        },
        {
            title: "一起听歌 Live Activity 实时活动卡片",
            badge: "一起听歌",
            badgeColor: "#FA243C",
            note: "一起听歌的动态红点、封面排版、标题与音乐波形柱。",
            code: `/* 一起听歌实时卡片 */
#wechatAppUI .wc-music-invite-card-live {
    width: 260px !important;
    background: #1C1C1E !important;
    border-radius: 24px !important;
    padding: 16px !important;
}
#wechatAppUI .wc-music-invite-card-live .live-title {
    font-size: 16px !important;
    font-weight: 700 !important;
    color: #ffffff !important;
}
#wechatAppUI .wc-music-invite-card-live .live-waveform span {
    background: #FA243C !important;
    border-radius: 2px !important;
}`
        },
        {
            title: "音乐分享卡片 (Music Share Card)",
            badge: "音乐分享",
            badgeColor: "#007AFF",
            note: "歌曲分享链接、标题、副标题与正方形专辑封面缩略图。",
            code: `/* 音乐分享卡片 */
#wechatAppUI .bubble-share {
    width: 250px !important;
    background-color: #ffffff !important;
    border-radius: 8px !important;
}
#wechatAppUI .share-title {
    font-size: 15px !important;
    color: #111111 !important;
}
#wechatAppUI .share-thumb {
    width: 50px !important;
    height: 50px !important;
    border-radius: 4px !important;
}`
        },
        {
            title: "位置与地图卡片 (Location Card)",
            badge: "位置板块",
            badgeColor: "#34C759",
            note: "地图卡片预览高度、地点名称与地址文本排版。",
            code: `/* 位置与地图卡片 */
#wechatAppUI .wc-location-card-bubble {
    width: 240px !important;
    border-radius: 12px !important;
    background: #ffffff !important;
}
#wechatAppUI .wc-loc-card-title {
    font-size: 15px !important;
    font-weight: 700 !important;
    color: #000000 !important;
}
#wechatAppUI .wc-loc-card-map-wrap {
    height: 110px !important;
}`
        },
        {
            title: "推特 (X) 推文分享卡片",
            badge: "推特卡片",
            badgeColor: "#000000",
            note: "仿推特排版的推文分享卡片、头像、作者信息与正文显示。",
            code: `/* 推特推文卡片 */
#wechatAppUI .wc-twitter-card-bubble {
    width: 246px !important;
    background: #ffffff !important;
    border-radius: 14px !important;
    padding: 12px 14px !important;
}
#wechatAppUI .wc-twitter-card-name {
    font-size: 14px !important;
    font-weight: 800 !important;
    color: #0f1419 !important;
}
#wechatAppUI .wc-twitter-card-text {
    font-size: 14px !important;
    line-height: 19px !important;
}`
        },
        {
            title: "文件附件卡片 (File Card)",
            badge: "文件板块",
            badgeColor: "#64748B",
            note: "收发文档、文本及 docx 附件卡片的排版。",
            code: `/* 文件附件卡片 */
#wechatAppUI .wc-chat-file-card {
    min-height: 98px !important;
    background: #ffffff !important;
    border-radius: 14px !important;
}
#wechatAppUI .wc-chat-file-name {
    font-size: 15px !important;
    font-weight: 700 !important;
    color: #202124 !important;
}`
        },
        {
            title: "消息多选模式与操作条",
            badge: "多选模式",
            badgeColor: "#007AFF",
            note: "多选模式下气泡的平移量、勾选框和底部多选胶囊操作栏。",
            code: `/* 消息多选模式 */
#wechatAppUI .chat-area.multi-select-mode .message-row.received {
    transform: translateX(36px) !important;
}
#wechatAppUI .chat-area.multi-select-mode .message-row.sent {
    transform: translateX(-36px) !important;
}
#wechatAppUI .wc-msg-checkbox {
    width: 22px !important;
    height: 22px !important;
    border-radius: 50% !important;
}`
        }
    ];

    // 第 3 页：新手小白保姆级教程与丰富实战 JS 功能字典
    const WC_COPY_PAGE3_TUTORIAL = [
        {
            title: "1. 新手 CSS 怎么写才生效？",
            tag: "CSS基础",
            tagColor: "#34C759",
            note: "【小白必看要点】如果自定义样式没有生效，通常是因为权重不够。请在属性末尾加上 !important，并在选择器最前面加上 #wechatAppUI 进行前缀锁定！",
            tips: [
                "<b style='color:#FF3B30;'>优先级法则</b>：样式加上 <code style='color:#FF3B30;'>!important</code> 能强制覆盖系统默认样式。",
                "<b style='color:#007AFF;'>作用域法则</b>：选择器前加上 <code style='color:#007AFF;'>#wechatAppUI</code>，保证只在微信内生效，绝不污染聊天器外部。"
            ],
            code: `/* 示例：把对方的气泡背景换成草莓浅粉色 */
#wechatAppUI .message-bubble.received {
    background-color: #ffe6eb !important;
    border-radius: 20px !important;
}

/* 示例：把输入框胶囊做成纯黑高级质感 */
#wechatAppUI .footer-capsule {
    background-color: #1a1a1a !important;
    border: 1px solid rgba(255, 255, 255, 0.15) !important;
}`
        },
        {
            title: "2. 核心可用 JavaScript 变量速查",
            tag: "变量字典",
            tagColor: "#007AFF",
            note: "【无需声明，直接读取】系统运行时已经在 window 环境中准备好的全局对象与数据：",
            tips: [
                "<code style='color:#007AFF;font-weight:700;'>wcCurrentChatContactId</code>：当前正在聊天的对象 ID（字符串，如 'contact_1'）。",
                "<code style='color:#007AFF;font-weight:700;'>wcContactsList</code>：当前通讯录所有角色的数组，包含 name(名称), remark(备注), avatar(头像), bio 等。",
                "<code style='color:#007AFF;font-weight:700;'>wcChatMessagesByContact</code>：所有会话历史数据主对象，键为角色 ID，值为消息对象数组。",
                "<code style='color:#007AFF;font-weight:700;'>appSettings</code>：微信核心配置对象，包含头像、主题、快捷设定等。"
            ],
            code: `// 实战例子：读取当前聊天对象的资料与最新一条消息
const curId = wcCurrentChatContactId;
const contact = wcContactsList.find(c => c.id === curId);
const msgs = wcChatMessagesByContact[curId] || [];
const lastMessage = msgs[msgs.length - 1];

console.log("角色名称:", contact?.remark || contact?.name);
console.log("最新消息内容:", lastMessage?.text);`
        },
        {
            title: "3. 系统常用原生交互方法",
            tag: "函数速查",
            tagColor: "#AF52DE",
            note: "【直接调用】小白无需重写底层，可以直接触发的交互函数：",
            tips: [
                "<code style='color:#AF52DE;font-weight:700;'>showToast('提示文字')</code>：在屏幕中间弹出一个黑底轻提示。",
                "<code style='color:#AF52DE;font-weight:700;'>showCustomAlert('标题', '内容')</code>：弹出一个 iOS 原生风格确认弹窗。",
                "<code style='color:#AF52DE;font-weight:700;'>wcAppendChatMessage(text, type, contactId)</code>：向聊天室插入一条消息（type: 'sent'我发, 'received'对方发, 'system_event'居中通知）。",
                "<code style='color:#AF52DE;font-weight:700;'>wcRequestApiReply()</code>：立即触发大模型为当前聊天生成回复。"
            ],
            code: `// 示例 1：弹出欢迎提示
showToast("微信美化脚本已生效！");

// 示例 2：向当前聊天室追加一条居中系统通知
wcAppendChatMessage("[系统：已开启专属私密守护模式]", "system_event", wcCurrentChatContactId);`
        },
        {
            title: "4. 实战进阶：快捷口令与聊天小尾巴",
            tag: "功能扩展",
            tagColor: "#FF9500",
            note: "【实用脚本示例】在自定义 JS 中加入以下功能，可以实现诸如自定义口令、输入拦截或专属打卡小尾巴：",
            tips: [
                "<b style='color:#FF9500;'>小尾巴功能</b>：自动在自己发出的消息后面附带发送时间或小状态。",
                "<b style='color:#FF9500;'>快捷口令</b>：输入 /clear 可清空当前聊天，输入 /dice 可投掷骰子。"
            ],
            code: `// 功能 1：监听键盘回车，支持快捷口令
const chatInput = document.getElementById('wc-chat-input');
if (chatInput && !chatInput._customBound) {
    chatInput._customBound = true;
    chatInput.addEventListener('keydown', function(e) {
        if (e.key === 'Enter') {
            const val = this.value.trim();
            if (val === '/dice') {
                e.preventDefault();
                e.stopPropagation();
                this.value = '';
                const point = Math.floor(Math.random() * 6) + 1;
                wcAppendChatMessage("🎲 我掷出了 " + point + " 点！", "sent", wcCurrentChatContactId);
            }
        }
    });
}`
        },
        {
            title: "5. 实战进阶：自动根据时段发送问候语",
            tag: "情境脚本",
            tagColor: "#34C759",
            note: "【时间感知联动】进入聊天室时，根据现实时间自动弹出对应的问候气泡：",
            tips: [
                "利用 <code style='color:#34C759;'>new Date().getHours()</code> 获取当下时刻，自动识别早安/午安/晚安。"
            ],
            code: `// 根据时间段判断并显示问候
const hour = new Date().getHours();
let greeting = "你好！";
if (hour >= 5 && hour < 11) greeting = "早安，新的一天开始啦 ☀️";
else if (hour >= 11 && hour < 14) greeting = "午安，记得吃午饭 🍱";
else if (hour >= 18 && hour < 23) greeting = "晚上好，今天过得怎么样 🌙";
else if (hour >= 23 || hour < 5) greeting = "夜深了，注意休息哦 💤";

// 显示温馨提示
showToast(greeting);`
        }
    ];

    // 复制单段代码块的方法
    window.wcCopyCodeBlockText = function(text, label) {
        if (!text) return;
        if (navigator.clipboard && window.isSecureContext) {
            navigator.clipboard.writeText(text).then(() => {
                showToast(`已复制【${label || '代码块'}】`);
            }).catch(() => {
                showToast(`已复制【${label || '代码块'}】`);
            });
        } else {
            const temp = document.createElement('textarea');
            temp.value = text;
            document.body.appendChild(temp);
            temp.select();
            try {
                document.execCommand('copy');
                showToast(`已复制【${label || '代码块'}】`);
            } catch (err) {}
            document.body.removeChild(temp);
        }
    };

    // 复制第 1 页全量原生 CSS
    window.wcCopyPage1BaseCss = function() {
        wcCopyCodeBlockText(WC_COPY_PAGE1_BASE_CSS, '聊天室基础原生 CSS');
    };

    // 渲染“复制原CSS”各页面
    function wcRenderCopyCssPage() {
        const titleEl = document.getElementById('wcCopyCssHeaderTitle');
        const indicatorEl = document.getElementById('wcCopyCssPageIndicator');
        const cardsWrap = document.getElementById('wcCopyCssCardsWrap');
        const prevBtn = document.getElementById('wcCopyCssPrevBtn');
        const nextBtn = document.getElementById('wcCopyCssNextBtn');

        if (indicatorEl) indicatorEl.innerText = `${wcCopyCssCurrentPage} / 3`;

        if (prevBtn) {
            prevBtn.style.opacity = wcCopyCssCurrentPage === 1 ? '0.35' : '1';
            prevBtn.style.pointerEvents = wcCopyCssCurrentPage === 1 ? 'none' : 'auto';
        }
        if (nextBtn) {
            nextBtn.style.opacity = wcCopyCssCurrentPage === 3 ? '0.35' : '1';
            nextBtn.style.pointerEvents = wcCopyCssCurrentPage === 3 ? 'none' : 'auto';
        }

        if (!cardsWrap) return;
        cardsWrap.scrollTop = 0;

        // ================= 第 1 页：原生聊天室全量基础 CSS =================
        if (wcCopyCssCurrentPage === 1) {
            if (titleEl) titleEl.innerText = '第 1 页 · 聊天室基础原生 CSS';
            cardsWrap.innerHTML = `
                <div style="display: flex; flex-direction: column; height: 100%;">
                    <!-- 模仿第2页的灰色圆角边框卡片，边框内部右上角放置复制 SVG -->
                    <div style="position: relative; background: #F9F9FB; border: 1px solid #E5E5EA; border-radius: 14px; padding: 12px 14px 14px 14px; box-shadow: 0 1px 3px rgba(0,0,0,0.02); display: flex; flex-direction: column; height: 100%; box-sizing: border-box;">
                        <!-- 边框内部右上角复制 SVG -->
                        <div onclick="wcCopyPage1BaseCss()" title="复制基础原生 CSS" style="position: absolute; top: 10px; right: 10px; width: 28px; height: 28px; border-radius: 7px; background: rgba(0, 0, 0, 0.05); display: flex; align-items: center; justify-content: center; cursor: pointer; color: #1c1c1e; z-index: 5;">
                            ${WC_COPY_INLINE_SVG}
                        </div>
                        <pre id="wcPage1CodeBlock" style="margin: 0; font-family: monospace; font-size: 12.5px; line-height: 1.5; color: #2c2c2e; white-space: pre; overflow: auto; flex: 1; padding-top: 2px;">${WC_COPY_PAGE1_BASE_CSS}</pre>
                    </div>
                </div>
            `;
            return;
        }

        // ================= 第 2 页：各板块专门卡片专属 CSS =================
        if (wcCopyCssCurrentPage === 2) {
            if (titleEl) titleEl.innerText = '第 2 页 · 各板块专门卡片专属 CSS';
            let html = '';
            WC_COPY_PAGE2_CARDS.forEach((item, index) => {
                html += `
                    <div style="display: flex; flex-direction: column; gap: 6px;">
                        <!-- 边框外部：标题与板块徽章 (无边框包裹) -->
                        <div style="display: flex; align-items: center; gap: 8px; padding: 0 4px;">
                            <span style="font-size: 14.5px; font-weight: 800; color: #1c1c1e;">${item.title}</span>
                            <span style="font-size: 10px; font-weight: 700; color: ${item.badgeColor}; background: ${item.badgeColor}18; padding: 2px 6px; border-radius: 4px;">${item.badge}</span>
                        </div>
                        <!-- 边框外部：醒目批注 -->
                        <div style="font-size: 12px; color: #8E8E93; line-height: 1.4; padding: 0 4px;">
                            <span style="color: #FF9500; font-weight: 700;">★ 批注：</span>${item.note}
                        </div>

                        <!-- 灰色圆角边框卡片，内部右上角带复制 SVG -->
                        <div style="position: relative; background: #F9F9FB; border: 1px solid #E5E5EA; border-radius: 12px; padding: 12px 14px; box-shadow: 0 1px 3px rgba(0,0,0,0.02); overflow: hidden;">
                            <div onclick="wcCopyCodeBlockText(WC_COPY_PAGE2_CARDS[${index}].code, '${item.title}')" title="复制此卡片代码" style="position: absolute; top: 8px; right: 8px; width: 26px; height: 26px; border-radius: 6px; background: rgba(0, 0, 0, 0.05); display: flex; align-items: center; justify-content: center; cursor: pointer; color: #1c1c1e; z-index: 5;">
                                ${WC_COPY_INLINE_SVG}
                            </div>
                            <pre style="margin: 0; font-family: monospace; font-size: 12px; line-height: 1.45; color: #2c2c2e; white-space: pre-wrap; word-break: break-all; max-height: 160px; overflow-y: auto; padding-right: 28px;">${item.code}</pre>
                        </div>
                    </div>
                `;
            });
            cardsWrap.innerHTML = html;
            return;
        }

        // ================= 第 3 页：新手小白保姆级教程与丰富 JS 字典 =================
        if (wcCopyCssCurrentPage === 3) {
            if (titleEl) titleEl.innerText = '第 3 页 · 自定义 JS & CSS 新手小白保姆级教程';
            let html = '';
            WC_COPY_PAGE3_TUTORIAL.forEach((item, index) => {
                const tipsHtml = item.tips ? item.tips.map(t => `<div style="font-size: 12px; color: #3c3c43; line-height: 1.5; margin-bottom: 4px;">• ${t}</div>`).join('') : '';

                html += `
                    <div style="display: flex; flex-direction: column; gap: 6px;">
                        <!-- 边框外部：醒目标题与分类标签 -->
                        <div style="display: flex; align-items: center; gap: 8px; padding: 0 4px;">
                            <span style="font-size: 14.5px; font-weight: 800; color: #1c1c1e;">${item.title}</span>
                            <span style="font-size: 10px; font-weight: 700; color: ${item.tagColor}; background: ${item.tagColor}18; padding: 2px 6px; border-radius: 4px;">${item.tag}</span>
                        </div>

                        <!-- 边框外部：重点解析说明 -->
                        <div style="font-size: 12px; color: #636366; line-height: 1.45; padding: 0 4px;">
                            <span style="color: #FF3B30; font-weight: 700;">[核心提示] </span>${item.note}
                        </div>
                        ${tipsHtml ? `<div style="background: rgba(0,0,0,0.03); border-radius: 8px; padding: 8px 10px; margin: 2px 0;">${tipsHtml}</div>` : ''}

                        <!-- 灰色圆角边框卡片，内部右上角带复制 SVG -->
                        <div style="position: relative; background: #F9F9FB; border: 1px solid #E5E5EA; border-radius: 12px; padding: 12px 14px; box-shadow: 0 1px 3px rgba(0,0,0,0.02); overflow: hidden;">
                            <div onclick="wcCopyCodeBlockText(WC_COPY_PAGE3_TUTORIAL[${index}].code, '${item.title}')" title="复制此示例代码" style="position: absolute; top: 8px; right: 8px; width: 26px; height: 26px; border-radius: 6px; background: rgba(0, 0, 0, 0.05); display: flex; align-items: center; justify-content: center; cursor: pointer; color: #1c1c1e; z-index: 5;">
                                ${WC_COPY_INLINE_SVG}
                            </div>
                            <div style="font-size: 10px; font-weight: 700; color: #8E8E93; margin-bottom: 6px; text-transform: uppercase;">CODE BLOCK</div>
                            <pre style="margin: 0; font-family: monospace; font-size: 12px; line-height: 1.45; color: #2c2c2e; white-space: pre-wrap; word-break: break-all; max-height: 160px; overflow-y: auto; padding-right: 28px;">${item.code}</pre>
                        </div>
                    </div>
                `;
            });
            cardsWrap.innerHTML = html;
        }
    }
    window.wcRenderCopyCssPage = wcRenderCopyCssPage;

    function wcSwitchCopyCssPage(delta) {
        const targetPage = wcCopyCssCurrentPage + delta;
        if (targetPage < 1 || targetPage > 3) return;
        wcCopyCssCurrentPage = targetPage;
        wcRenderCopyCssPage();
    }
    window.wcSwitchCopyCssPage = wcSwitchCopyCssPage;

    // 入口函数，打开“复制原CSS”面板
    function wcCopyOriginalCSS() {
        document.getElementById('wc-theme-menu-view').style.display = 'none';
        document.getElementById('wc-theme-preset-view').style.display = 'none';
        document.getElementById('wc-theme-custom-view').style.display = 'none';
        document.getElementById('wc-theme-edit-preset-view').style.display = 'none';
        document.getElementById('wc-theme-font-view').style.display = 'none';
        document.getElementById('wc-theme-avatar-view').style.display = 'none';
        if (document.getElementById('wc-theme-bubble-view')) document.getElementById('wc-theme-bubble-view').style.display = 'none';
        if (document.getElementById('wc-theme-chat-bg-view')) document.getElementById('wc-theme-chat-bg-view').style.display = 'none';

        const copyView = document.getElementById('wc-theme-copy-css-view');
        if (copyView) copyView.style.display = 'flex';

        document.querySelector('#wechatAppUI .theme-capsule').style.display = 'flex';
        document.getElementById('wc-capsule-title').innerText = '原CSS';
        document.getElementById('wc-capsule-icon-svg').innerHTML = '<path d="M16 1H4c-1.1 0-2 .9-2 2v14h2V3h12V1zm3 4H8c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h11c1.1 0 2-.9 2-2V7c0-1.1-.9-2-2-2zm0 16H8V7h11v14z"/>';
        document.getElementById('wc-custom-preview-box').style.display = 'none';
        document.getElementById('wc-theme-modal-title').innerText = '原CSS模板';

        wcCopyCssCurrentPage = 1;
        wcRenderCopyCssPage();
    }
    window.wcCopyOriginalCSS = wcCopyOriginalCSS;

    // --- 微信官方主题库逻辑 ---
 // 默认使用图片气泡


    const wcColorSchemes = [
        { id: 'default', name: '默认 (黑白)', leftBg: '#F2F2F7', leftText: '#000000', rightBg: '#000000', rightText: '#ffffff' },
        { id: 'wechat-green', name: '深灰微信绿', leftBg: '#333333', leftText: '#ffffff', rightBg: '#95ec69', rightText: '#000000' },
        { id: 'imessage-blue', name: 'iMessage蓝', leftBg: '#E5E5EA', leftText: '#000000', rightBg: '#007AFF', rightText: '#ffffff' },
        { id: 'gray-black', name: '灰黑', leftBg: '#E5E5EA', leftText: '#000000', rightBg: '#333333', rightText: '#ffffff' },
        { id: 'white-pink', name: '白粉', leftBg: '#FFFFFF', leftText: '#000000', rightBg: '#F8E8EE', rightText: '#000000' },
        { id: 'white-blue', name: '低饱白蓝', leftBg: '#FFFFFF', leftText: '#000000', rightBg: '#E6F0FA', rightText: '#000000' },
        { id: 'white-green', name: '白绿', leftBg: '#FFFFFF', leftText: '#000000', rightBg: '#E9F7E6', rightText: '#000000' },
        { id: 'blue-pink', name: '蓝粉', leftBg: '#E6F0FA', leftText: '#000000', rightBg: '#F8E8EE', rightText: '#000000' },
        { id: 'lightgray-green', name: '浅灰微信绿', leftBg: '#F2F2F7', leftText: '#000000', rightBg: '#95ec69', rightText: '#000000' },
        { id: 'gray-pink', name: '灰粉', leftBg: '#F2F2F7', leftText: '#000000', rightBg: '#F8E8EE', rightText: '#000000' },
        { id: 'gray-blue', name: '灰蓝', leftBg: '#F2F2F7', leftText: '#000000', rightBg: '#E6F0FA', rightText: '#000000' },
        { id: 'mint-choco', name: '薄巧', leftBg: '#D5F5E3', leftText: '#000000', rightBg: '#4E342E', rightText: '#ffffff' }
    ];

    function wcShowThemeBubble() {
        document.getElementById('wc-theme-menu-view').style.display = 'none';
        document.getElementById('wc-theme-preset-view').style.display = 'none';
        document.getElementById('wc-theme-custom-view').style.display = 'none';
        document.getElementById('wc-theme-edit-preset-view').style.display = 'none';
        document.getElementById('wc-theme-font-view').style.display = 'none';
        document.getElementById('wc-theme-avatar-view').style.display = 'none';
        document.getElementById('wc-theme-bubble-view').style.display = 'flex';
        document.querySelector('#wechatAppUI .theme-capsule').style.display = 'none';
        document.getElementById('wc-custom-preview-box').style.display = 'flex';
        document.getElementById('wc-theme-modal-title').innerText = '官方主题库';

        const contact = wcContactsList.find(c => c.id === wcCurrentChatContactId);
        if (contact) {
            wcCurrentBubbleTheme = contact.bubbleTheme || 'image';
            wcCurrentColorScheme = contact.colorScheme || 'default';
        }

        // 同步 iMessage 顶底栏开关状态
        const imessageToggle = document.getElementById('wc-imessage-bar-toggle');
        if (imessageToggle) {
            if (contact && contact.imessage_bar_enabled) {
                imessageToggle.classList.add('active');
            } else {
                imessageToggle.classList.remove('active');
            }
        }

        // 同步 古早微信 顶底栏开关状态
        const retroToggle = document.getElementById('wc-retro-bar-toggle');
        if (retroToggle) {
            if (contact && contact.retro_bar_enabled) {
                retroToggle.classList.add('active');
            } else {
                retroToggle.classList.remove('active');
            }
        }

        // 同步 iss一颗星 顶底栏开关状态
        const issStarToggle = document.getElementById('wc-iss-star-bar-toggle');
        if (issStarToggle) {
            if (contact && contact.iss_star_bar_enabled) {
                issStarToggle.classList.add('active');
            } else {
                issStarToggle.classList.remove('active');
            }
        }

        // 同步 粉˙层叠卡片 顶底栏开关状态
        const pinkLayerToggle = document.getElementById('wc-pink-layer-card-bar-toggle');
        if (pinkLayerToggle) {
            if (contact && contact.pink_layer_card_bar_enabled) {
                pinkLayerToggle.classList.add('active');
            } else {
                pinkLayerToggle.classList.remove('active');
            }
        }

        // 同步 仿QQ 顶底栏开关状态
        const qqToggle = document.getElementById('wc-qq-bar-toggle');
        if (qqToggle) {
            if (contact && contact.qq_bar_enabled) {
                qqToggle.classList.add('active');
            } else {
                qqToggle.classList.remove('active');
            }
        }

        // 修复色系球被压缩显示不全的问题
        const colorCirclesContainer = document.getElementById('wc-bubble-color-circles');
        if (colorCirclesContainer) {
            colorCirclesContainer.style.padding = '16px 16px 20px 16px';
            colorCirclesContainer.style.alignItems = 'center';
            colorCirclesContainer.style.minHeight = '80px'; // 强制最小高度，防止上下被切割
        }

        wcRenderBubbleList();
    }

    function wcRenderBubbleList() {
        const container = document.getElementById('wc-bubble-list-container');
        const currentScheme = wcColorSchemes.find(s => s.id === wcCurrentColorScheme) || wcColorSchemes[0];

        // 使用主题预设的 SVG 图标
        const presetSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M4 2.9967H20C20.5523 2.9967 21 3.44442 21 3.9967V8.9967C21 9.54899 20.5523 9.9967 20 9.9967H4C3.44772 9.9967 3 9.54899 3 8.9967V3.9967C3 3.44442 3.44772 2.9967 4 2.9967ZM6 11.9967H12C12.5523 11.9967 13 12.4444 13 12.9967V15.9967H14V21.9967H10V15.9967H11V13.9967H5C4.44772 13.9967 4 13.549 4 12.9967V10.9967H6V11.9967ZM17.7322 13.7289L19.5 11.9612L21.2678 13.7289C22.2441 14.7052 22.2441 16.2882 21.2678 17.2645C20.2915 18.2408 18.7085 18.2408 17.7322 17.2645C16.7559 16.2882 16.7559 14.7052 17.7322 13.7289Z"></path></svg>`;

        // 动态生成双色圆形指示器 (使用 inset box-shadow 替代 border 解决漏色，强制宽高解决挤压)
        const dualColorCircle = `<div style="display: block !important; box-sizing: border-box !important; width: 24px !important; height: 24px !important; min-width: 24px !important; min-height: 24px !important; border-radius: 50% !important; background: linear-gradient(90deg, ${currentScheme.leftBg} 50%, ${currentScheme.rightBg} 0) !important; box-shadow: inset 0 0 0 1px rgba(0,0,0,0.1), 0 2px 4px rgba(0,0,0,0.05) !important; flex-shrink: 0 !important; flex-grow: 0 !important; margin: 0 !important;"></div>`;

        const styles = [
            { id: 'image', name: '默认气泡' },
            { id: 'telegram', name: '仿Telegram 气泡' },
            { id: 'capsule', name: '仿line气泡' },
            { id: 'imessage', name: '仿iMessage气泡' },
            { id: 'retro', name: '古早微信气泡' }
        ];

        if (container) {
            let html = '';
            styles.forEach(style => {
                const isSelected = wcCurrentBubbleTheme === style.id;
                const inUseHtml = isSelected ? `<div style="position: absolute; top: 0; right: 0; background: var(--tg-blue); color: #fff; font-size: 10px; padding: 2px 8px; border-radius: 0 20px 0 10px; z-index: 10;">使用中</div>` : '';
                const activeBorder = isSelected ? 'border: 2px solid var(--tg-blue);' : 'border: 2px solid transparent;';

                html += `
                    <div class="preset-item-wrapper" style="${activeBorder} transition: all 0.2s;">
                        ${inUseHtml}
                        <div class="preset-item-content" style="padding: 14px; cursor: pointer;" onclick="wcSelectBubbleTheme('${style.id}')">
                            <div class="preset-icon" style="width: 44px; height: 44px;">
                                <div style="width: 24px; height: 24px; color: #8E8E93;">${presetSvg}</div>
                            </div>
                            <div class="preset-info">
                                <div class="preset-title" style="font-size: 16px;">${style.name}</div>
                            </div>
                            ${dualColorCircle}
                        </div>
                    </div>
                `;
            });
            container.innerHTML = html;
        }

        const colorContainer = document.getElementById('wc-bubble-color-circles');
        if (colorContainer) {
            let html = '';
            wcColorSchemes.forEach(scheme => {
                const isActive = wcCurrentColorScheme === scheme.id
                    ? 'box-shadow: inset 0 0 0 1px rgba(0,0,0,0.1), 0 0 0 2px var(--tg-blue), 0 2px 6px rgba(0,0,0,0.2) !important; transform: scale(1.1) !important;'
                    : 'box-shadow: inset 0 0 0 1px rgba(0,0,0,0.1), 0 2px 6px rgba(0,0,0,0.1) !important; transform: scale(1) !important;';
                html += `
                    <div style="display: block !important; box-sizing: border-box !important; width: 36px !important; height: 36px !important; min-width: 36px !important; min-height: 36px !important; margin: 4px 2px !important; border-radius: 50% !important; background: linear-gradient(90deg, ${scheme.leftBg} 50%, ${scheme.rightBg} 0) !important; cursor: pointer !important; flex-shrink: 0 !important; flex-grow: 0 !important; ${isActive} transition: all 0.2s !important;" onclick="wcSelectColorScheme('${scheme.id}')"></div>
                `;
            });
            colorContainer.innerHTML = html;
        }
    }

    function wcSelectBubbleTheme(themeId) {
        wcCurrentBubbleTheme = themeId;
        wcApplyBubbleTheme();
        wcRenderBubbleList();
    }

    function wcSelectColorScheme(schemeId) {
        wcCurrentColorScheme = schemeId;
        wcApplyBubbleTheme();
        wcRenderBubbleList();
    }

    function wcApplyBubbleTheme() {
        let styleTag = document.getElementById('wc-dynamic-bubble-style');
        if (!styleTag) {
            styleTag = document.createElement('style');
            styleTag.id = 'wc-dynamic-bubble-style';
            document.head.appendChild(styleTag);
        }

        const scheme = wcColorSchemes.find(s => s.id === wcCurrentColorScheme) || wcColorSchemes[0];

        let css = `
            #wechatAppUI .message-bubble.received { background-color: ${scheme.leftBg} !important; color: ${scheme.leftText} !important; }
            #wechatAppUI .message-bubble.sent { background-color: ${scheme.rightBg} !important; color: ${scheme.rightText} !important; }
            #wechatAppUI .message-bubble.received .msg-text { color: ${scheme.leftText} !important; }
            #wechatAppUI .message-bubble.sent .msg-text { color: ${scheme.rightText} !important; }
            #wechatAppUI .message-bubble.received .wc-link-message-caption { background-color: ${scheme.leftBg} !important; }
            #wechatAppUI .message-bubble.sent .wc-link-message-caption { background-color: ${scheme.rightBg} !important; }
        `;

        if (wcCurrentBubbleTheme === 'telegram') {
            const leftSvgColor = encodeURIComponent(scheme.leftBg);
            const rightSvgColor = encodeURIComponent(scheme.rightBg);

            css += `
                /* Keep text message gaps proportional to the adjusted bubble height. */
                #wechatAppUI #wc-chat-area .message-row:has(> .message-bubble > .msg-text) { margin-bottom: 5px !important; }
                #wechatAppUI #wc-chat-area .message-row.group-top:has(> .message-bubble > .msg-text),
                #wechatAppUI #wc-chat-area .message-row.group-mid:has(> .message-bubble > .msg-text) { margin-bottom: 0px !important; }
                #wechatAppUI .message-bubble { margin-bottom: 0 !important; filter: drop-shadow(0 1px 1px rgba(0,0,0,0.08)) !important; padding: 8px 12px 8px 14px !important; }
                #wechatAppUI .msg-meta { position: static !important; margin-bottom: -2px !important; }
                #wechatAppUI .message-bubble.received { border-radius: 18px 18px 18px 0 !important; }
                #wechatAppUI .message-bubble.sent { border-radius: 18px 18px 0 18px !important; }
                #wechatAppUI .message-bubble.received.group-top { border-radius: 18px 18px 18px 6px !important; }
                #wechatAppUI .message-bubble.received.group-mid { border-radius: 6px 18px 18px 6px !important; }
                #wechatAppUI .message-bubble.received.group-bottom { border-radius: 6px 18px 18px 0 !important; }
                #wechatAppUI .message-bubble.sent.group-top { border-radius: 18px 18px 6px 18px !important; }
                #wechatAppUI .message-bubble.sent.group-mid { border-radius: 18px 6px 6px 18px !important; }
                #wechatAppUI .message-bubble.sent.group-bottom { border-radius: 18px 6px 0 18px !important; }
                #wechatAppUI .message-bubble.received .msg-text { padding-bottom: 2px !important; }
                #wechatAppUI .message-bubble.sent .msg-text { padding-bottom: 2px !important; }
                #wechatAppUI .message-bubble.received.tail::before { display: block !important; content: '' !important; position: absolute !important; bottom: 0 !important; left: -8px !important; width: 8px !important; height: 16px !important; background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 8 16'%3E%3Cpath d='M8 0C8 10 4 16 0 16L8 16Z' fill='${leftSvgColor}'/%3E%3C/svg%3E") !important; background-size: contain !important; background-repeat: no-repeat !important; }
                #wechatAppUI .message-bubble.sent.tail::before { display: block !important; content: '' !important; position: absolute !important; bottom: 0 !important; right: -8px !important; width: 8px !important; height: 16px !important; background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 8 16'%3E%3Cpath d='M0 0C0 10 4 16 8 16L0 16Z' fill='${rightSvgColor}'/%3E%3C/svg%3E") !important; background-size: contain !important; background-repeat: no-repeat !important; }
                #wechatAppUI .msg-meta.sent { color: #8E8E93 !important; }
                #wechatAppUI .msg-meta.received { color: #8E8E93 !important; }

                /* Compact text bubbles while keeping existing text sizes. */
                #wechatAppUI #wc-chat-area .message-bubble:has(> .msg-text):not(.transfer-bubble) {
                    min-height: 0 !important;
                    padding: 6px 12px 5px 13px !important;
                    gap: 0 !important;
                    display: block !important;
                    max-width: min(100%, 85%) !important;
                }
                #wechatAppUI #wc-chat-area .message-bubble:has(> .msg-text):not(.transfer-bubble) > .msg-text {
                    padding-bottom: 0 !important;
                    display: inline !important;
                }
                #wechatAppUI #wc-chat-area .message-bubble:has(> .msg-text):not(.transfer-bubble) > .msg-meta {
                    position: static !important;
                    display: inline-flex;
                    vertical-align: baseline !important;
                    margin: 0 0 0 6px !important;
                    line-height: 1.15 !important;
                }
            `;
        } else if (wcCurrentBubbleTheme === 'capsule') {
            const leftSvgColor = encodeURIComponent(scheme.leftBg);
            const rightSvgColor = encodeURIComponent(scheme.rightBg);

            css += `
                #wechatAppUI .message-row.group-top, #wechatAppUI .message-row.group-mid { margin-bottom: 3px !important; }
                #wechatAppUI .message-bubble { padding: 7px 14px !important; border-radius: 20px !important; min-height: 17px !important; margin-bottom: 14px !important; overflow: visible !important; }
                #wechatAppUI .msg-meta { position: absolute !important; bottom: 0 !important; margin-bottom: 0 !important; align-items: flex-end !important; }

                /* 修复溢出：时间戳放在靠近屏幕中心的一侧 */
                #wechatAppUI .message-bubble.received .msg-meta { left: calc(100% + 6px) !important; right: auto !important; }
                #wechatAppUI .message-bubble.sent .msg-meta { right: calc(100% + 6px) !important; left: auto !important; }

                #wechatAppUI .message-bubble.received .msg-meta svg { display: none !important; }
                #wechatAppUI .message-bubble.sent .msg-meta svg { display: inline-block !important; }

                /* 尾巴逻辑：利用你代码中已有的 tail 类名来控制只在第一条显示尾巴 */
                #wechatAppUI .message-bubble.received.tail::before {
                    display: block !important; content: '' !important; position: absolute !important;
                    top: 2px !important; left: -4px !important; width: 14px !important; height: 16px !important;
                    background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 10 12' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M 10,2 C 6,3 3,2 0,0.5 C 4,6 7,9 10,11 Z' fill='${leftSvgColor}' stroke='${leftSvgColor}' stroke-width='1.5' stroke-linejoin='round' stroke-linecap='round'/%3E%3C/svg%3E") !important;
                    background-size: contain !important; background-repeat: no-repeat !important; z-index: 1 !important;
                }
                #wechatAppUI .message-bubble.sent.tail::before {
                    display: block !important; content: '' !important; position: absolute !important;
                    top: 2px !important; right: -4px !important; width: 14px !important; height: 16px !important;
                    background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 10 12' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M 0,2 C 4,3 7,2 10,0.5 C 6,6 3,9 0,11 Z' fill='${rightSvgColor}' stroke='${rightSvgColor}' stroke-width='1.5' stroke-linejoin='round' stroke-linecap='round'/%3E%3C/svg%3E") !important;
                    background-size: contain !important; background-repeat: no-repeat !important; z-index: 1 !important;
                }

                #wechatAppUI .msg-meta.sent { color: #8E8E93 !important; }
                #wechatAppUI .msg-meta.received { color: #8E8E93 !important; }
            `;
        } else if (wcCurrentBubbleTheme === 'imessage') {
            css += `
                /* 必须给 row 加层级，防止尾巴的 z-index: -1 被聊天背景吞噬 */
                #wechatAppUI .message-row { z-index: 1 !important; }
                /* Keep the long-pressed message above the context-menu dimming layer. */
                #wechatAppUI .message-row.highlighted-bubble { z-index: 1001 !important; }
                #wechatAppUI .message-row.group-top, #wechatAppUI .message-row.group-mid { margin-bottom: 3px !important; }

                /* 强制悬浮胶囊形状，去除阴影，四个角全是 22px 大圆角 */
                #wechatAppUI .message-bubble { padding: 10px 16px !important; border-radius: 22px !important; min-height: 36px !important; margin-bottom: 16px !important; overflow: visible !important; box-shadow: none !important; }
                #wechatAppUI .msg-meta { position: absolute !important; bottom: -18px !important; margin-bottom: 0 !important; }

                /* 隐藏连续消息的时间戳，只保留最后一个 */
                #wechatAppUI .message-bubble.group-top .msg-meta,
                #wechatAppUI .message-bubble.group-mid .msg-meta { display: none !important; }

                /* 隐藏发送方时间戳旁边的打勾图标 */
                #wechatAppUI .msg-meta.sent svg { display: none !important; }

                /* 接收方 (左侧) - 【关键修复】加入 display: block !important 覆盖原有的 display: none */
                #wechatAppUI .message-bubble.received.tail::before {
                    display: block !important; content: '' !important; position: absolute !important; z-index: -1 !important;
                    bottom: -5px !important; left: 1px !important; width: 18px !important; height: 16px !important;
                    background-color: ${scheme.leftBg} !important;
                    -webkit-mask-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 18 16' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M 18 0 Q 18 12 2.4 15.2 A 0.8 0.8 0 0 1 1.12 14.24 Q 7 10 4 0 Z'/%3E%3C/svg%3E") !important;
                    -webkit-mask-size: contain !important; -webkit-mask-repeat: no-repeat !important;
                }

                /* 发送方 (右侧) - 【关键修复】加入 display: block !important 覆盖原有的 display: none */
                #wechatAppUI .message-bubble.sent.tail::before {
                    display: block !important; content: '' !important; position: absolute !important; z-index: -1 !important;
                    bottom: -5px !important; right: 1px !important; width: 18px !important; height: 16px !important;
                    background-color: ${scheme.rightBg} !important;
                    -webkit-mask-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 18 16' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M 0 0 Q 0 12 15.6 15.2 A 0.8 0.8 0 0 0 16.88 14.24 Q 11 10 14 0 Z'/%3E%3C/svg%3E") !important;
                    -webkit-mask-size: contain !important; -webkit-mask-repeat: no-repeat !important;
                }

                #wechatAppUI .msg-meta.sent { color: #8E8E93 !important; }
                #wechatAppUI .msg-meta.received { color: #8E8E93 !important; }

                /* ==========================================
                   iMessage 引用回复美化 (视觉分离双气泡 + 粗大C型线)
                   ========================================== */
                /* 隐藏引用名称 */
                #wechatAppUI .wc-bubble-reply-name { display: none !important; }

                /* 1. 抽空包含引用的主气泡背景，使其变成透明容器 */
                #wechatAppUI .message-bubble:has(.wc-bubble-reply) {
                    background-color: transparent !important;
                    padding: 0 !important;
                    box-shadow: none !important;
                    gap: 4px !important;
                    overflow: visible !important;
                }
                /* 隐藏带有引用的主气泡的尾巴 */
                #wechatAppUI .message-bubble:has(.wc-bubble-reply)::before,
                #wechatAppUI .message-bubble:has(.wc-bubble-reply)::after {
                    display: none !important;
                }

                /* 2. 重塑被引用的气泡 (.wc-bubble-reply) 为独立胶囊 */
                #wechatAppUI .wc-bubble-reply {
                    border-radius: 16px !important;
                    padding: 8px 14px !important;
                    width: fit-content !important;
                    max-width: 90% !important;
                    position: relative !important;
                    overflow: visible !important;
                    border: none !important;
                }

                /* 3. 重塑新回复的文本区域 (.msg-text) 为独立气泡 */
                #wechatAppUI .message-bubble:has(.wc-bubble-reply) .msg-text {
                    padding: 10px 16px !important;
                    border-radius: 22px !important;
                    width: fit-content !important;
                    position: relative !important;
                }

                /* --- 我引用对方 (Sent) --- */
                #wechatAppUI .message-bubble.sent:has(.wc-bubble-reply) {
                    align-items: flex-end !important;
                }
                /* 引用气泡：变成对方的颜色，向左错开 */
                #wechatAppUI .message-bubble.sent .wc-bubble-reply {
                    background-color: ${scheme.leftBg} !important;
                    margin-right: 28px !important;
                }
                #wechatAppUI .message-bubble.sent .wc-bubble-reply .wc-bubble-reply-text {
                    color: ${scheme.leftText} !important;
                    opacity: 0.85 !important;
                }
                /* 新回复气泡：恢复我的颜色 */
                #wechatAppUI .message-bubble.sent:has(.wc-bubble-reply) .msg-text {
                    background-color: ${scheme.rightBg} !important;
                    color: ${scheme.rightText} !important;
                }
                /* 画正大 C 型线 */
                #wechatAppUI .message-bubble.sent .wc-bubble-reply::before {
                    content: '' !important;
                    position: absolute !important;
                    left: -12px !important;
                    top: 50% !important;
                    bottom: -20px !important;
                    width: 26px !important;
                    border: 3.5px solid #D1D1D6 !important;
                    border-right: none !important;
                    border-radius: 16px 0 0 16px !important;
                    z-index: -1 !important;
                    box-sizing: border-box !important;
                }

                /* --- 对方引用我 (Received) --- */
                #wechatAppUI .message-bubble.received:has(.wc-bubble-reply) {
                    align-items: flex-start !important;
                }
                /* 引用气泡：变成我的颜色，向右错开 */
                #wechatAppUI .message-bubble.received .wc-bubble-reply {
                    background-color: ${scheme.rightBg} !important;
                    margin-left: 28px !important;
                }
                #wechatAppUI .message-bubble.received .wc-bubble-reply .wc-bubble-reply-text {
                    color: ${scheme.rightText} !important;
                    opacity: 0.85 !important;
                }
                /* 新回复气泡：恢复对方的颜色 */
                #wechatAppUI .message-bubble.received:has(.wc-bubble-reply) .msg-text {
                    background-color: ${scheme.leftBg} !important;
                    color: ${scheme.leftText} !important;
                }
                /* 画反大 C 型线 */
                #wechatAppUI .message-bubble.received .wc-bubble-reply::before {
                    content: '' !important;
                    position: absolute !important;
                    right: -12px !important;
                    top: 50% !important;
                    bottom: -20px !important;
                    width: 26px !important;
                    border: 3.5px solid #D1D1D6 !important;
                    border-left: none !important;
                    border-radius: 0 16px 16px 0 !important;
                    z-index: -1 !important;
                    box-sizing: border-box !important;
                }

                /* 修复分离后时间戳的位置 */
                #wechatAppUI .message-bubble:has(.wc-bubble-reply) .msg-meta {
                    bottom: -18px !important;
                }

                /* ==========================================
                   iMessage 语音气泡美化
                   ========================================== */
                #wechatAppUI .wc-voice-avatar-wrap,
                #wechatAppUI .wc-voice-dot {
                    display: none !important;
                }
                #wechatAppUI .wc-voice-content {
                    gap: 10px !important;
                    padding: 4px 0 !important;
                }
                #wechatAppUI .wc-voice-play {
                    width: 28px !important;
                    height: 28px !important;
                    border-radius: 50% !important;
                    padding: 7px !important;
                    box-sizing: border-box !important;
                    opacity: 1 !important;
                }
                #wechatAppUI .message-bubble.sent .wc-voice-play {
                    background-color: ${scheme.rightText} !important;
                    color: ${scheme.rightBg} !important;
                }
                #wechatAppUI .message-bubble.received .wc-voice-play {
                    background-color: ${scheme.leftText} !important;
                    color: ${scheme.leftBg} !important;
                }
                #wechatAppUI .wc-voice-waves {
                    gap: 2px !important;
                    height: 20px !important;
                }
                #wechatAppUI .wc-voice-wave {
                    width: 3px !important;
                    border-radius: 1.5px !important;
                    opacity: 0.6 !important;
                }
                #wechatAppUI .message-bubble.sent .wc-voice-wave {
                    background-color: ${scheme.rightText} !important;
                }
                #wechatAppUI .message-bubble.received .wc-voice-wave {
                    background-color: ${scheme.leftText} !important;
                }
                #wechatAppUI .wc-voice-duration {
                    font-size: 14px !important;
                    font-weight: 500 !important;
                    opacity: 0.8 !important;
                }
                #wechatAppUI .message-bubble.sent .wc-voice-duration {
                    color: ${scheme.rightText} !important;
                }
                #wechatAppUI .message-bubble.received .wc-voice-duration {
                    color: ${scheme.leftText} !important;
                }
            `;
        } else if (wcCurrentBubbleTheme === 'retro') {
            css += `
                /* 减小连续消息的间距 */
                #wechatAppUI .message-row.group-top, #wechatAppUI .message-row.group-mid { margin-bottom: 4px !important; }
                /* 减小独立气泡的基础间距，并保持原有样式 */
                #wechatAppUI .message-bubble { margin-bottom: 12px !important; padding: 7px 12px !important; line-height: 1.4 !important; border-radius: 4px !important; border: 1px solid rgba(0,0,0,0.15) !important; min-height: 36px !important; overflow: visible !important; box-shadow: none !important; }

                /* 隐藏古早微信气泡内的时间戳 */
                #wechatAppUI .msg-meta { display: none !important; }

                #wechatAppUI .message-bubble.received { border-color: #D5D5D5 !important; }
                #wechatAppUI .message-bubble.sent { border-color: rgba(0,0,0,0.15) !important; }

                #wechatAppUI .message-bubble.received::before { display: block !important; content: '' !important; position: absolute !important; top: 12px !important; left: -6px !important; width: 0 !important; height: 0 !important; border-style: solid !important; border-width: 5px 6px 5px 0 !important; border-color: transparent #D5D5D5 transparent transparent !important; background: transparent !important; z-index: 1 !important; }
                #wechatAppUI .message-bubble.received::after { display: block !important; content: '' !important; position: absolute !important; top: 12px !important; left: -5px !important; width: 0 !important; height: 0 !important; border-style: solid !important; border-width: 5px 6px 5px 0 !important; border-color: transparent ${scheme.leftBg} transparent transparent !important; background: transparent !important; z-index: 2 !important; }

                #wechatAppUI .message-bubble.sent::before { display: block !important; content: '' !important; position: absolute !important; top: 12px !important; right: -6px !important; width: 0 !important; height: 0 !important; border-style: solid !important; border-width: 5px 0 5px 6px !important; border-color: transparent transparent transparent rgba(0,0,0,0.15) !important; background: transparent !important; z-index: 1 !important; }
                #wechatAppUI .message-bubble.sent::after { display: block !important; content: '' !important; position: absolute !important; top: 12px !important; right: -5px !important; width: 0 !important; height: 0 !important; border-style: solid !important; border-width: 5px 0 5px 6px !important; border-color: transparent transparent transparent ${scheme.rightBg} !important; background: transparent !important; z-index: 2 !important; }

                /* ==========================================
                   古早微信 语音气泡美化 (高仿版)
                   ========================================== */
                /* 隐藏不需要的元素：头像包裹、波形条 */
                #wechatAppUI .message-bubble .wc-voice-avatar-wrap,
                #wechatAppUI .message-bubble .wc-voice-waves {
                    display: none !important;
                }

                /* 调整语音容器布局，解除全局宽度限制 */
                #wechatAppUI .message-bubble .wc-voice-container {
                    min-width: 70px !important; /* 覆盖全局的 140px 限制，减小气泡宽度 */
                }
                #wechatAppUI .wc-voice-content {
                    display: flex !important;
                    align-items: center !important;
                    gap: 8px !important;
                    padding: 2px 0 !important;
                    min-width: auto !important;
                }

                /* 接收方 (左侧) */
                #wechatAppUI .message-bubble.received .wc-voice-content {
                    flex-direction: row !important;
                }
                #wechatAppUI .message-bubble.received .wc-voice-play {
                    order: 1 !important;
                }
                #wechatAppUI .message-bubble.received .wc-voice-duration {
                    order: 2 !important;
                    margin-left: auto !important; /* 把时长推到最右边 */
                }

                /* 发送方 (右侧) */
                #wechatAppUI .message-bubble.sent .wc-voice-content {
                    flex-direction: row !important;
                }
                #wechatAppUI .message-bubble.sent .wc-voice-duration {
                    order: 1 !important;
                    margin-right: auto !important; /* 把时长推到最左边 */
                }
                #wechatAppUI .message-bubble.sent .wc-voice-play {
                    order: 2 !important;
                    transform: scaleX(-1) !important; /* 水平翻转声波 */
                }

                /* 替换播放按钮为左下角同款声波图标 (无圆圈)，颜色跟随字体 */
                #wechatAppUI .message-bubble.received .wc-voice-play {
                    background-color: var(--wc-custom-color-received, currentColor) !important;
                }
                #wechatAppUI .message-bubble.sent .wc-voice-play {
                    background-color: var(--wc-custom-color-sent, currentColor) !important;
                }
                #wechatAppUI .wc-voice-play {
                    width: 20px !important;
                    height: 20px !important;
                    -webkit-mask-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 24 24' xmlns='http://www.w3.org/2000/svg'%3E%3Cg transform='rotate(90 12 12)'%3E%3Cpath fill='black' d='M5.8 15.075 4.225 13.5c1.05 -1.05 2.2375 -1.89585 3.5625 -2.5375C9.1125 10.32085 10.51665 10 12 10c1.48335 0 2.8875 0.32085 4.2125 0.9625C17.5375 11.60415 18.725 12.45 19.775 13.5l-1.575 1.575c-0.85 -0.85 -1.8 -1.53335 -2.85 -2.05 -1.05 -0.51665 -2.16665 -0.775 -3.35 -0.775s-2.3 0.25835 -3.35 0.775c-1.05 0.51665 -2 1.2 -2.85 2.05ZM1.575 10.85 0 9.275c1.6 -1.63335 3.429165 -2.92085 5.4875 -3.8625C7.54585 4.470835 9.71665 4 12 4c2.28335 0 4.45415 0.470835 6.5125 1.4125C20.57085 6.35415 22.4 7.64165 24 9.275l-1.575 1.575c-1.43335 -1.36665 -3.0375 -2.475 -4.8125 -3.325 -1.775 -0.85 -3.64585 -1.275 -5.6125 -1.275s-3.8375 0.425 -5.6125 1.275c-1.775 0.85 -3.379165 1.95835 -4.8125 3.325ZM12 21.275l-3.7 -3.725c0.48335 -0.48335 1.04585 -0.8625 1.6875 -1.1375C10.62915 16.1375 11.3 16 12 16c0.7 0 1.37085 0.1375 2.0125 0.4125 0.64165 0.275 1.20415 0.65415 1.6875 1.1375L12 21.275Z'/%3E%3C/g%3E%3C/svg%3E") !important;
                    -webkit-mask-size: contain !important;
                    -webkit-mask-repeat: no-repeat !important;
                    -webkit-mask-position: center !important;
                    opacity: 0.8 !important;
                }
                /* 隐藏原有的 SVG 路径 */
                #wechatAppUI .wc-voice-play path { display: none !important; }

                /* 调整时长文字样式，颜色跟随字体 */
                #wechatAppUI .wc-voice-duration {
                    font-size: 15px !important;
                    color: currentColor !important; /* 颜色跟随字体颜色 */
                    font-weight: 400 !important;
                    opacity: 0.9 !important;
                }

                /* 展开的语音文本颜色跟随字体颜色 */
                #wechatAppUI .message-bubble .wc-voice-text {
                    color: currentColor !important;
                }
                /* 统一分隔线颜色，使其在不同背景下都比较和谐 */
                #wechatAppUI .message-bubble.received .wc-voice-text {
                    border-top: 1px solid rgba(0, 0, 0, 0.1) !important;
                }
                #wechatAppUI .message-bubble.sent .wc-voice-text {
                    border-top: 1px solid rgba(0, 0, 0, 0.15) !important;
                }

                /* 彻底隐藏未读红点 */
                #wechatAppUI .wc-voice-dot {
                    display: none !important;
                }
            `;
        }
 else {
            // Default bubble dark mode removed
        }

        // 强制覆盖动态主题样式，彻底去除图片气泡与所有卡片气泡的背景、内边距、阴影和所有尾巴伪元素
        css += `
            #wechatAppUI .message-bubble:is(.transfer-bubble, .wc-image-message-bubble, .wc-link-message-bubble, :has(.wc-transfer-card, .wc-family-card-bubble, .wc-music-share-bubble, .wc-music-invite-card-live, .wc-location-card-bubble, .wc-forward-card-bubble, .wc-twitter-card-bubble)) {
                background-color: transparent !important;
                background-image: none !important;
                padding: 0 !important;
                box-shadow: none !important;
                border: none !important;
            }
            #wechatAppUI .message-bubble:is(.transfer-bubble, .wc-image-message-bubble, .wc-link-message-bubble, :has(.wc-transfer-card, .wc-family-card-bubble, .wc-music-share-bubble, .wc-music-invite-card-live, .wc-location-card-bubble, .wc-forward-card-bubble, .wc-twitter-card-bubble))::before,
            #wechatAppUI .message-bubble:is(.transfer-bubble, .wc-image-message-bubble, .wc-link-message-bubble, :has(.wc-transfer-card, .wc-family-card-bubble, .wc-music-share-bubble, .wc-music-invite-card-live, .wc-location-card-bubble, .wc-forward-card-bubble, .wc-twitter-card-bubble))::after {
                display: none !important;
                content: none !important;
                background: none !important;
                border: none !important;
                width: 0 !important;
                height: 0 !important;
            }
        `;

        styleTag.textContent = css;

        const contact = wcContactsList.find(c => c.id === wcCurrentChatContactId);
        if (contact) {
            contact.bubbleTheme = wcCurrentBubbleTheme;
            contact.colorScheme = wcCurrentColorScheme;
            wcSaveContactsDataAsync();
        }
    }

    // --- 微信头像美化逻辑 ---


    function wcApplyAvatarSettingsFromContact() {
        const contact = wcContactsList.find(c => c.id === wcCurrentChatContactId);
        const settings = contact?.avatarSettings || { enabled: true, displayMode: 'all', size: 40, radius: 50, frameUrlChat: '', frameUrlUser: '' };

        let styleTag = document.getElementById('wc-dynamic-avatar-style');
        if (!styleTag) {
            styleTag = document.createElement('style');
            styleTag.id = 'wc-dynamic-avatar-style';
            document.head.appendChild(styleTag);
        }

        let css = '';
        if (settings.enabled) {
            css += `
                #wechatAppUI .msg-avatar { display: block !important; width: ${settings.size}px !important; height: ${settings.size}px !important; border-radius: ${settings.radius}% !important; }
            `;

            if (settings.displayMode === 'first') {
                css += `
                    #wechatAppUI .message-row.group-mid .msg-avatar,
                    #wechatAppUI .message-row.group-bottom .msg-avatar { visibility: hidden !important; }
                `;
            } else if (settings.displayMode === 'last') {
                css += `
                    #wechatAppUI .message-row.group-top .msg-avatar,
                    #wechatAppUI .message-row.group-mid .msg-avatar { visibility: hidden !important; }
                `;
            } else {
                css += `
                    #wechatAppUI .msg-avatar { visibility: visible !important; }
                `;
            }

            const chatFrameUrl = wcGetSafeImageUrl(settings.frameUrlChat);
            const userFrameUrl = wcGetSafeImageUrl(settings.frameUrlUser);
            if (chatFrameUrl) {
                css += `#wechatAppUI .message-row.received .msg-avatar::after { background-image: url(${JSON.stringify(chatFrameUrl)}) !important; }`;
            } else {
                css += `#wechatAppUI .message-row.received .msg-avatar::after { background-image: none !important; }`;
            }
            if (userFrameUrl) {
                css += `#wechatAppUI .message-row.sent .msg-avatar::after { background-image: url(${JSON.stringify(userFrameUrl)}) !important; }`;
            } else {
                css += `#wechatAppUI .message-row.sent .msg-avatar::after { background-image: none !important; }`;
            }
        } else {
            css += `#wechatAppUI .msg-avatar { display: none !important; }`;
        }
        styleTag.textContent = css;
    }

    function wcApplyAvatarSettings() {
        const toggleEl = document.getElementById('wc-avatar-toggle');
        const enabled = toggleEl ? toggleEl.classList.contains('active') : true;
        const modeSelect = document.getElementById('wcAvatarDisplayModeText');
        const displayMode = modeSelect ? modeSelect.getAttribute('data-value') : 'all';
        const size = document.getElementById('wc-avatar-size-slider') ? document.getElementById('wc-avatar-size-slider').value : 40;
        const radius = document.getElementById('wc-avatar-radius-slider') ? document.getElementById('wc-avatar-radius-slider').value : 50;

        const contact = wcContactsList.find(c => c.id === wcCurrentChatContactId);
        if (contact) {
            if (!contact.avatarSettings) contact.avatarSettings = {};
            contact.avatarSettings.enabled = enabled;
            contact.avatarSettings.displayMode = displayMode;
            contact.avatarSettings.size = size;
            contact.avatarSettings.radius = radius;
            wcSaveContactsDataAsync();
        }

        // 更新预览图
        const chatPreview = document.getElementById('wc-chat-frame-preview');
        const userPreview = document.getElementById('wc-user-frame-preview');
        const frameUrlChat = contact?.avatarSettings?.frameUrlChat || '';
        const frameUrlUser = contact?.avatarSettings?.frameUrlUser || '';
        if (chatPreview) chatPreview.style.backgroundImage = frameUrlChat ? `url('${frameUrlChat}')` : 'none';
        if (userPreview) userPreview.style.backgroundImage = frameUrlUser ? `url('${frameUrlUser}')` : 'none';

        if (typeof wcApplyAvatarSettingsFromContact === 'function') {
            wcApplyAvatarSettingsFromContact();
        }
    }

    function wcToggleAvatarEnable(el) {
        el.classList.toggle('active');
        wcApplyAvatarSettings();
    }

    function wcAddAvatarFrame() {
        showCustomPrompt('添加头像框', { placeholder: '输入头像框图片 URL' }, '添加').then(url => {
            if (url && url.trim()) {
                if (!wcAvatarSettings.savedFrames) wcAvatarSettings.savedFrames = [];
                wcAvatarSettings.savedFrames.push(url.trim());
                wcApplyAvatarSettings();
                wcRenderAvatarFrames();
                showToast('头像框已添加');
            }
        });
    }

    function wcRenderAvatarFrames() {
        const container = document.getElementById('wc-avatar-frame-list');
        if (!container) return;
        if (!wcAvatarSettings.savedFrames || wcAvatarSettings.savedFrames.length === 0) {
            container.innerHTML = '<div style="grid-column: span 3; text-align: center; color: #8e8e93; font-size: 12px; padding: 20px 0;">暂无保存的头像框</div>';
            return;
        }
        let html = '';
        wcAvatarSettings.savedFrames.forEach((url, index) => {
            html += `
                <div class="wc-frame-grid-item" onclick="wcSelectAvatarFrame(${index})">
                    <div class="wc-frame-grid-img" style="background-image: url('${url}')"></div>
                </div>
            `;
        });
        container.innerHTML = html;
    }

    function wcSelectAvatarFrame(index) {
        const url = wcAvatarSettings.savedFrames[index];
        const overlay = document.getElementById('customDialogOverlay');
        const dialog = document.getElementById('customDialog');
        dialog.innerHTML = `
            <div class="custom-dialog-text">
                <div class="custom-dialog-title">头像框操作</div>
                <div class="custom-dialog-message">请选择要将此头像框应用到哪里</div>
            </div>
            <div class="custom-dialog-btns" style="flex-direction: column; padding: 10px 16px; gap: 8px;">
                <button class="custom-dialog-btn bold" onclick="wcSetFrameTarget('${url}', 'chat')">设为对方 (Chat)</button>
                <button class="custom-dialog-btn bold" onclick="wcSetFrameTarget('${url}', 'user')">设为自己 (User)</button>
                <button class="custom-dialog-btn danger" onclick="wcDeleteSavedFrame(${index})">删除此头像框</button>
                <button class="custom-dialog-btn" onclick="document.getElementById('customDialogOverlay').classList.remove('show')">取消</button>
            </div>
        `;
        overlay.classList.add('show');
    }

    function wcSetFrameTarget(url, type) {
        const contact = wcContactsList.find(c => c.id === wcCurrentChatContactId);
        if (contact) {
            if (!contact.avatarSettings) contact.avatarSettings = {};
            if (type === 'chat') contact.avatarSettings.frameUrlChat = url;
            if (type === 'user') contact.avatarSettings.frameUrlUser = url;
            wcSaveContactsDataAsync();
        }
        wcApplyAvatarSettings();
        document.getElementById('customDialogOverlay').classList.remove('show');
        showToast(type === 'chat' ? '已设为对方头像框' : '已设为自己头像框');
    }

    function wcClearAvatarFrame(type) {
        const contact = wcContactsList.find(c => c.id === wcCurrentChatContactId);
        if (contact && contact.avatarSettings) {
            if (type === 'chat') contact.avatarSettings.frameUrlChat = '';
            if (type === 'user') contact.avatarSettings.frameUrlUser = '';
            wcSaveContactsDataAsync();
        }
        wcApplyAvatarSettings();
        showToast(type === 'chat' ? '对方头像框已清除' : '自己头像框已清除');
    }

    function wcDeleteSavedFrame(index) {
        wcAvatarSettings.savedFrames.splice(index, 1);
        wcApplyAvatarSettings();
        wcRenderAvatarFrames();
        document.getElementById('customDialogOverlay').classList.remove('show');
        showToast('头像框已删除');
    }

    function initWcAvatarSettings() {
        // 移除全局初始化，改为在进入聊天室时独立应用
    }

    // --- 微信字体美化逻辑 ---


    function wcApplyFontSettingsFromContact() {
        const contact = wcContactsList.find(c => c.id === wcCurrentChatContactId);
        let size = 16, colorReceived = '#000000', colorSent = '#ffffff', family = 'default';
        if (contact && contact.fontSettings) {
            size = contact.fontSettings.size || 16;
            colorReceived = contact.fontSettings.colorReceived || '#000000';
            colorSent = contact.fontSettings.colorSent || '#ffffff';
            family = contact.fontSettings.family || 'default';
        }

        let styleTag = document.getElementById('wc-dynamic-font-style');
        if (!styleTag) {
            styleTag = document.createElement('style');
            styleTag.id = 'wc-dynamic-font-style';
            document.head.appendChild(styleTag);
        }

        let fontFamilyStr = '"Geomini", -apple-system, BlinkMacSystemFont, "PingFang SC", "Microsoft YaHei", sans-serif';
        if (family !== 'default') {
            fontFamilyStr = `"${family}", ` + fontFamilyStr;
        }

        styleTag.textContent = `
            #wechatAppUI {
                --wc-custom-color-received: ${colorReceived};
                --wc-custom-color-sent: ${colorSent};
            }
            #wechatAppUI * { font-family: ${fontFamilyStr} !important; }
            #wechatAppUI .msg-text, #wechatAppUI .wc-voice-text { font-size: ${size}px !important; }

            /* 将颜色应用到整个气泡，让 currentColor 能够继承 */
            #wechatAppUI .message-bubble.received,
            #wechatAppUI .message-bubble.received .msg-text,
            #wechatAppUI .message-bubble.received .wc-voice-text { color: ${colorReceived} !important; }

            #wechatAppUI .message-bubble.sent,
            #wechatAppUI .message-bubble.sent .msg-text,
            #wechatAppUI .message-bubble.sent .wc-voice-text { color: ${colorSent} !important; }
        `;
    }

    function wcApplyFontSettings() {
        const size = document.getElementById('wc-font-size-slider').value;
        const colorReceived = document.getElementById('wc-font-color-received').value;
        const colorSent = document.getElementById('wc-font-color-sent').value;

        const contact = wcContactsList.find(c => c.id === wcCurrentChatContactId);
        if (contact) {
            contact.fontSettings = { size: size, colorReceived: colorReceived, colorSent: colorSent, family: wcCurrentFontFamily };
            wcSaveContactsDataAsync();
        }

        if (typeof wcApplyFontSettingsFromContact === 'function') {
            wcApplyFontSettingsFromContact();
        }
    }

    function wcResetFontColor(type) {
        // 获取当前气泡主题的默认颜色
        const scheme = wcColorSchemes.find(s => s.id === wcCurrentColorScheme) || wcColorSchemes[0];
        if (type === 'received') {
            document.getElementById('wc-font-color-received').value = scheme.leftText;
        } else if (type === 'sent') {
            document.getElementById('wc-font-color-sent').value = scheme.rightText;
        }
        wcApplyFontSettings();
        if (typeof showToast === 'function') showToast('已恢复默认颜色');
    }
    window.wcResetFontColor = wcResetFontColor;

    function wcRenderFontList() {
        const container = document.getElementById('wc-font-list-container');
        if (!container) return;

        let html = '';
        const isDefaultActive = wcCurrentFontFamily === 'default' ? 'active-font' : '';
        html += `
            <div class="modal-item wc-font-item ${isDefaultActive}" onclick="wcSelectFont('default')">
                <div class="modal-item-icon" style="background: transparent;"><svg viewBox="0 0 24 24" fill="none" stroke="#8E8E93" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="4 7 4 4 20 4 20 7"></polyline><line x1="9" y1="20" x2="15" y2="20"></line><line x1="12" y1="4" x2="12" y2="20"></line></svg></div>
                <div class="modal-item-text">系统默认 (Geomini)</div>
            </div>
        `;

        customFonts.forEach(font => {
            const isActive = wcCurrentFontFamily === font.id ? 'active-font' : '';
            html += `
                <div class="modal-item wc-font-item ${isActive}" onclick="wcSelectFont('${font.id}')">
                    <div class="modal-item-icon" style="background: transparent;"><svg viewBox="0 0 24 24" fill="none" stroke="#8E8E93" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="4 7 4 4 20 4 20 7"></polyline><line x1="9" y1="20" x2="15" y2="20"></line><line x1="12" y1="4" x2="12" y2="20"></line></svg></div>
                    <div class="modal-item-text" style="font-family: '${font.id}', sans-serif;">${font.name}</div>
                </div>
            `;
        });
        container.innerHTML = html;
    }

    function wcSelectFont(fontId) {
        wcCurrentFontFamily = fontId;
        wcApplyFontSettings();
        wcRenderFontList();
    }

    function wcLoadLocalFont(event) {
        const file = event.target.files[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onload = function(e) {
            const fontData = e.target.result;
            customFontCount++;
            const fontFamily = `CustomFont_${customFontCount}`;
            const fontName = file.name.split('.')[0];
            const newFont = new FontFace(fontFamily, fontData);
            newFont.load().then(function(loadedFont) {
                document.fonts.add(loadedFont);
                customFonts.push({ id: fontFamily, name: fontName, type: 'local', data: fontData });
                saveFontData();
                addFontToList(fontName, fontFamily);
                wcRenderFontList();
                wcSelectFont(fontFamily);
                showToast('字体导入成功');
            }).catch(function(error) {
                showCustomAlert('错误', '字体加载失败，请检查文件格式！');
            });
        };
        reader.readAsArrayBuffer(file);
        event.target.value = '';
    }

    function wcLoadUrlFont() {
        showCustomPrompt('导入字体', [{ placeholder: '输入字体名称 (选填)' }, { placeholder: 'https://...' }], '安装').then(res => {
            if (res === null) return;
            let fontName = res[0].trim();
            const url = res[1].trim();
            if (!url) { showCustomAlert('提示', '请输入字体 URL！'); return; }
            customFontCount++;
            const fontFamily = `UrlFont_${customFontCount}`;
            if (!fontName) fontName = `网络字体 ${customFontCount}`;
            const newFont = new FontFace(fontFamily, `url(${url})`);
            newFont.load().then(function(loadedFont) {
                document.fonts.add(loadedFont);
                customFonts.push({ id: fontFamily, name: fontName, type: 'url', url: url });
                saveFontData();
                addFontToList(fontName, fontFamily);
                wcRenderFontList();
                wcSelectFont(fontFamily);
                showToast('字体导入成功');
            }).catch(function(error) {
                showCustomAlert('错误', '字体加载失败，请确保 URL 直接指向字体文件且允许跨域访问！');
            });
        });
    }

    function initWcFontSettings() {
        // 移除全局初始化，改为在进入聊天室时独立应用
    }

    let wcStartX = 0, wcStartY = 0, wcCurrentX = 0, wcCurrentY = 0, wcActiveSwipeItem = null, wcIsScrolling = false, wcHasTouchMoved = false;
    function wcHandleTouchStart(e) {
        if (wcActiveSwipeItem && wcActiveSwipeItem !== e.currentTarget) wcActiveSwipeItem.style.transform = 'translateX(0px)';
        wcStartX = e.touches[0].clientX; wcStartY = e.touches[0].clientY;
        wcCurrentX = wcStartX; wcCurrentY = wcStartY;
        wcHasTouchMoved = false;
        wcActiveSwipeItem = e.currentTarget; wcActiveSwipeItem.style.transition = 'none'; wcIsScrolling = false;
    }
    function wcHandleTouchMove(e) {
        if (!wcActiveSwipeItem) return;
        wcCurrentX = e.touches[0].clientX; wcCurrentY = e.touches[0].clientY;
        let diffX = wcCurrentX - wcStartX, diffY = wcCurrentY - wcStartY;
        if (Math.abs(diffX) > 8 || Math.abs(diffY) > 8) wcHasTouchMoved = true;
        if (Math.abs(diffY) > Math.abs(diffX) && !wcActiveSwipeItem.dataset.swiping) { wcIsScrolling = true; return; }
        if (!wcIsScrolling && diffX < -10) {
            wcActiveSwipeItem.dataset.swiping = "true";
            if (e.cancelable) e.preventDefault();
            const actionsEl = wcActiveSwipeItem.nextElementSibling;
            const maxDistance = actionsEl ? -(actionsEl.offsetWidth || 140) : -140;
            let move = Math.max(diffX, maxDistance); if (move > 0) move = 0;
            wcActiveSwipeItem.style.transform = `translateX(${move}px)`;
        }
    }
    function wcHandleTouchEnd(e) {
        if (!wcActiveSwipeItem) return;
        wcActiveSwipeItem.style.transition = 'transform 0.3s cubic-bezier(0.1, 0.8, 0.2, 1)';
        delete wcActiveSwipeItem.dataset.swiping;
        if (wcIsScrolling || !wcHasTouchMoved) { wcActiveSwipeItem.style.transform = `translateX(0px)`; wcActiveSwipeItem = null; return; }
        let diffX = wcCurrentX - wcStartX;
        const actionsEl = wcActiveSwipeItem.nextElementSibling;
        const maxDistance = actionsEl ? -(actionsEl.offsetWidth || 140) : -140;
        if (diffX < -40) wcActiveSwipeItem.style.transform = `translateX(${maxDistance}px)`;
        else { wcActiveSwipeItem.style.transform = `translateX(0px)`; wcActiveSwipeItem = null; }
    }
    function wcResetAllSwipes() {
        if (wcActiveSwipeItem) {
            wcActiveSwipeItem.style.transition = 'transform 0.3s cubic-bezier(0.1, 0.8, 0.2, 1)';
            wcActiveSwipeItem.style.transform = 'translateX(0px)';
            wcActiveSwipeItem = null;
        }
    }

    let wcApiReplyPending = false;
    const wcApiPendingContacts = new Set();
    const wcApiTypingContactIds = new Set();
    let wcApiTypingElement = null;
    let wcApiTypingOriginalText = '';
    const WC_LINK_PATTERN = /(?:https?:\/\/|www\.)[^\s<>"'`]+|\b(?:xhslink\.com|xiaohongshu\.com|douyin\.com|iesdouyin\.com|v\.douyin\.com|bilibili\.com|b23\.tv|kuaishou\.com|v\.kuaishou\.com)(?:\/[^\s<>"'`]*)?/gi;
    const WC_LINK_PARSER_BASE_URL = 'https://r.jina.ai/';
    const WC_LINK_PARSER_TIMEOUT_MS = 20000;
    const WC_LINK_PARSER_MAX_LINKS = 3;
    const WC_LINK_PARSER_MAX_CHARS_PER_LINK = 6000;
    const wcPendingLinkResolves = new Map();
    let wcIsRenderingChatMessages = false;

    // ==========================================
    // 意识档案 (Mind Dossier) 逻辑
    // ==========================================
    let wcCurrentDossierIndex = -1;
    let wcDossierMessages = [];

    function wcInitVoiceDossierDOM() {
        if (document.getElementById('wcVoiceDossierOverlay')) return;
        const html = `
        <div class="wc-voice-dossier-overlay" id="wcVoiceDossierOverlay" onclick="wcCloseVoiceDossier(event)">
            <div class="wc-vd-top-action-bar" onclick="event.stopPropagation()" style="margin-top: calc(20px + env(safe-area-inset-top, 0px)); margin-bottom: 14px; position: relative; z-index: 10;">
                <div class="wc-vd-circle-btn" onclick="wcNavigateVoiceDossier(-1)" title="上一个">
                    <svg t="1789622884659" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="29981" width="14" height="14"><path d="M729.791045 894.089552c-22.925373 0-38.208955-7.641791-53.492538-22.925373l-305.671641-305.671642c-30.567164-30.567164-30.567164-76.41791 0-106.985074l305.671641-305.671642c30.567164-30.567164 76.41791-30.567164 106.985075 0s30.567164 76.41791 0 106.985075L531.104478 512 783.283582 764.179104c30.567164 30.567164 30.567164 76.41791 0 106.985075-15.283582 15.283582-30.567164 22.925373-53.492537 22.925373z" fill="currentColor" p-id="29982"></path></svg>
                </div>
                <div class="wc-vd-circle-btn" onclick="wcNavigateVoiceDossier(1)" title="下一个">
                    <svg t="1789623011111" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="6303" width="14" height="14"><path d="M370.215385 905.846154c-23.630769 0-39.384615-7.876923-55.138462-23.630769-31.507692-31.507692-31.507692-78.769231 0-110.276923l259.938462-259.938462-259.938462-259.938462c-31.507692-31.507692-31.507692-78.769231 0-110.276923s78.769231-31.507692 110.276923 0l315.076923 315.076923c31.507692 31.507692 31.507692 78.769231 0 110.276924l-315.076923 315.076923c-15.753846 15.753846-39.384615 23.630769-55.138461 23.630769z" fill="currentColor" p-id="6304"></path></svg>
                </div>

                <div class="wc-vd-circle-btn" onclick="wcEditCurrentDossier()" title="编辑">
                    <svg t="1789622386706" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="4734" width="19" height="19"><path d="M943.104 216.064q-8.192 9.216-15.36 16.384l-12.288 12.288q-6.144 6.144-11.264 10.24l-138.24-139.264q8.192-8.192 20.48-19.456t20.48-17.408q20.48-16.384 44.032-14.336t37.888 9.216q15.36 8.192 34.304 28.672t29.184 43.008q5.12 14.336 6.656 33.792t-15.872 36.864zM551.936 329.728l158.72-158.72 138.24 138.24q-87.04 87.04-158.72 157.696-30.72 29.696-59.904 58.88t-53.248 52.224-39.424 38.4l-18.432 18.432q-7.168 7.168-16.384 14.336t-20.48 12.288-31.232 12.288-41.472 13.824-40.96 12.288-29.696 6.656q-19.456 2.048-20.992-3.584t1.536-25.088q1.024-10.24 5.12-30.208t8.192-40.448 8.704-38.4 7.68-25.088q5.12-11.264 10.752-19.456t15.872-18.432zM899.072 478.208q21.504 0 40.96 10.24t19.456 41.984l0 232.448q0 28.672-10.752 52.736t-29.184 41.984-41.984 27.648-48.128 9.728l-571.392 0q-24.576 0-48.128-10.752t-41.472-29.184-29.184-43.52-11.264-53.76l0-570.368q0-20.48 11.264-42.496t29.184-39.936 40.448-29.696 45.056-11.776l238.592 0q28.672 0 40.448 20.992t11.776 42.496-11.776 41.472-40.448 19.968l-187.392 0q-21.504 0-34.816 14.848t-13.312 36.352l0 481.28q0 20.48 13.312 34.304t34.816 13.824l474.112 0q21.504 0 36.864-13.824t15.36-34.304l0-190.464q0-14.336 6.656-24.576t16.384-16.384 21.504-8.704 23.04-2.56z" fill="currentColor" p-id="4735"></path></svg>
                </div>
                <div class="wc-vd-circle-btn" id="wcVdFavBtn" onclick="wcToggleFavoriteCurrentDossier()" title="收藏">
                    <svg id="wcVdFavIcon" t="1789622503177" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="18605" width="19" height="19"><path d="M215.466667 42.666667H810.666667c32 0 59.733333 25.6 59.733333 59.733333v819.2c0 23.466667-12.8 44.8-34.133333 53.333333-21.333333 10.666667-44.8 6.4-64-8.533333L512 746.666667 253.866667 966.4c-17.066667 14.933333-42.666667 19.2-64 8.533333s-34.133333-29.866667-34.133334-53.333333V102.4C155.733333 68.266667 181.333333 42.666667 215.466667 42.666667z m29.866666 89.6v725.333333L512 629.333333l266.666667 228.266667v-725.333333h-533.333334z" fill="currentColor" p-id="18606"></path></svg>
                </div>
                <div class="wc-vd-circle-btn" onclick="wcDeleteCurrentDossier()" title="删除">
                    <svg t="1789622526077" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="20528" width="19" height="19"><path d="M880 224H144a48 48 0 0 1 0-96H384a64 64 0 0 1 64-64h128a64 64 0 0 1 64 64h240a48 48 0 0 1 0 96zM832 832a128 128 0 0 1-128 128H320a128 128 0 0 1-128-128V288h640V832zM448 464a48 48 0 0 0-96 0v288a48 48 0 0 0 96 0v-288z m224 0a48 48 0 0 0-96 0v288a48 48 0 0 0 96 0v-288z" fill="currentColor" p-id="20529"></path></svg>
                </div>
            </div>
            <div class="wc-vd-container" id="wcVdContainer" onclick="event.stopPropagation()" style="width: 100%; display: flex; justify-content: center; align-items: center; box-sizing: border-box;">
                <!-- 动态注入心声内容 -->
            </div>
            <div class="wc-vd-bottom-action-bar" onclick="event.stopPropagation()" style="margin-top: 14px; margin-bottom: calc(16px + env(safe-area-inset-bottom, 0px));">
                <div class="wc-vd-close-circle-btn" onclick="wcCloseVoiceDossier()">
                    <svg viewBox="0 0 24 24"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                </div>
            </div>
        </div>
        `;
        document.getElementById('wechatAppUI').insertAdjacentHTML('beforeend', html);
    }
    window.wcInitVoiceDossierDOM = wcInitVoiceDossierDOM;

    function wcCopyDossierAiPrompt() {
        const textEl = document.getElementById('wcDossierAiPromptBox');
        const text = textEl ? textEl.innerText.trim() : '';
        if (!text) return;
        if (navigator.clipboard && window.isSecureContext) {
            navigator.clipboard.writeText(text).then(() => {
                if (typeof showToast === 'function') showToast('提示词已复制到剪贴板');
            });
        } else {
            const textArea = document.createElement("textarea");
            textArea.value = text;
            document.body.appendChild(textArea);
            textArea.select();
            try {
                document.execCommand('copy');
                if (typeof showToast === 'function') showToast('提示词已复制到剪贴板');
            } catch (err) {}
            document.body.removeChild(textArea);
        }
    }
    window.wcCopyDossierAiPrompt = wcCopyDossierAiPrompt;

    function wcOpenVoiceDossier() {
        if (!wcCurrentChatContactId) return;
        wcInitVoiceDossierDOM();

        // 加载当前角色绑定的心声设置
        if (typeof wcLoadDossierSettings === 'function') wcLoadDossierSettings();

        const messages = wcChatMessagesByContact[wcCurrentChatContactId] || [];
        // 筛选出包含 mindDossier 的消息
        wcDossierMessages = messages.filter(m => m.mindDossier);

        // 如果历史消息中还没有生成过心声档案，自动检查最新消息或就地初始化一份当前模板的心声，杜绝“暂无记录”拦截
        if (wcDossierMessages.length === 0) {
            const activeTemplate = (typeof wcCustomDossiersList !== 'undefined')
                ? (wcCustomDossiersList.find(d => d.id === wcActiveDossierId) || (wcCustomDossiersList.length > 0 ? wcCustomDossiersList[0] : null))
                : null;

            // 1. 优先尝试从聊天最后几条消息的文本中重新执行正则捕获
            let recoveredMsg = null;
            if (activeTemplate && activeTemplate.regexPattern) {
                let cleanRegStr = activeTemplate.regexPattern.trim();
                if (cleanRegStr.startsWith('/') && cleanRegStr.lastIndexOf('/') > 0) {
                    cleanRegStr = cleanRegStr.slice(1, cleanRegStr.lastIndexOf('/'));
                }
                cleanRegStr = cleanRegStr.replace(/\\\*/g, '*');

                try {
                    const regex = new RegExp(cleanRegStr, 's');
                    for (let i = messages.length - 1; i >= 0; i--) {
                        const m = messages[i];
                        if (m && m.text) {
                            const match = m.text.match(regex);
                            if (match) {
                                m.mindDossier = {
                                    _regexMatches: Array.from(match),
                                    _customTemplateId: activeTemplate.id,
                                    _htmlTemplate: activeTemplate.htmlTemplate
                                };
                                recoveredMsg = m;
                                break;
                            }
                        }
                    }
                } catch (e) {
                    console.debug('心声后验捕获解析错误:', e);
                }
            }

            // 2. 如果仍无匹配（比如之前还没聊过带标签的新消息），则基于最后一条消息就地自动创建一个初始心声档案
            if (!recoveredMsg) {
                const targetMsg = messages.length > 0 ? messages[messages.length - 1] : { id: 'init_msg_' + Date.now(), createdAt: Date.now() };
                if (activeTemplate) {
                    // 自定义心声：构建匹配捕获组数量的默认字段值
                    let dummyMatches = ['<status>'];
                    const placeholderMatches = (activeTemplate.htmlTemplate || '').match(/\{\{(\d+)\}\}/g) || [];
                    const maxGroup = placeholderMatches.reduce((max, cur) => Math.max(max, parseInt(cur.replace(/[{}]/g, ''), 10) || 0), 0);
                    const totalGroups = Math.max(maxGroup, 4);
                    for (let g = 1; g <= totalGroups; g++) {
                        dummyMatches.push(`记录项 ${g}`);
                    }
                    targetMsg.mindDossier = {
                        _regexMatches: dummyMatches,
                        _customTemplateId: activeTemplate.id,
                        _htmlTemplate: activeTemplate.htmlTemplate
                    };
                } else {
                    // 内置心声默认值
                    targetMsg.mindDossier = {
                        draft: '……',
                        monologue: '正在与你交谈，内心有所波动。',
                        telemetry: { load: '平缓', focus: '当前对话', env: '室内', heart_rate: '76 bpm' },
                        parallel_branch: '若能坦诚以待，或许会有不同的展开。'
                    };
                }
                recoveredMsg = targetMsg;
                if (!messages.includes(targetMsg) && messages.length > 0) {
                    messages[messages.length - 1] = targetMsg;
                }
                if (typeof wcSaveChatData === 'function') wcSaveChatData();
            }

            wcDossierMessages = [recoveredMsg];
        }

        wcCurrentDossierIndex = wcDossierMessages.length - 1; // 默认显示最新一条
        wcRenderVoiceDossier();

        const overlay = document.getElementById('wcVoiceDossierOverlay');
        overlay.style.display = 'flex';
        overlay.offsetHeight; // 强制重绘
        overlay.classList.add('show');
    }
    window.wcOpenVoiceDossier = wcOpenVoiceDossier;

    function wcCloseVoiceDossier(event) {
        if (event && event.target !== document.getElementById('wcVoiceDossierOverlay')) return;
        const overlay = document.getElementById('wcVoiceDossierOverlay');
        if (overlay) {
            overlay.classList.remove('show');
            setTimeout(() => {
                overlay.style.display = 'none';
            }, 350);
        }
    }
    window.wcCloseVoiceDossier = wcCloseVoiceDossier;

    function wcNavigateVoiceDossier(direction) {
        if (wcDossierMessages.length === 0) return;
        let newIndex = wcCurrentDossierIndex + direction;
        if (newIndex < 0) {
            if (typeof showToast === 'function') showToast('已经是第一条了');
            return;
        }
        if (newIndex >= wcDossierMessages.length) {
            if (typeof showToast === 'function') showToast('已经是最新一条了');
            return;
        }
        wcCurrentDossierIndex = newIndex;
        wcRenderVoiceDossier();
    }
    window.wcNavigateVoiceDossier = wcNavigateVoiceDossier;

    function wcDeleteCurrentDossier() {
        if (wcCurrentDossierIndex < 0 || wcCurrentDossierIndex >= wcDossierMessages.length) return;
        if (typeof showCustomConfirm === 'function') {
            showCustomConfirm('删除心声', '确定要删除这条心声档案吗？', '删除', true).then(confirmed => {
                if (confirmed) {
                    const msg = wcDossierMessages[wcCurrentDossierIndex];
                    delete msg.mindDossier; // 移除该消息的心声数据
                    if (typeof wcSaveChatData === 'function') wcSaveChatData();

                    wcDossierMessages.splice(wcCurrentDossierIndex, 1);
                    if (wcDossierMessages.length === 0) {
                        wcCloseVoiceDossier();
                        if (typeof showToast === 'function') showToast('心声记录已清空');
                    } else {
                        if (wcCurrentDossierIndex >= wcDossierMessages.length) {
                            wcCurrentDossierIndex = wcDossierMessages.length - 1;
                        }
                        wcRenderVoiceDossier();
                        if (typeof showToast === 'function') showToast('已删除');
                    }
                }
            });
        }
    }
    window.wcDeleteCurrentDossier = wcDeleteCurrentDossier;

    function wcGetDossierFieldLabels(customTemplate, count) {
        const labels = [];
        if (customTemplate) {
            // 尝试从 prompt 中的格式示例提取字段名称，如 <status>心理状态|心率|环境|平行时空</status>
            const promptText = customTemplate.prompt || '';
            const tagMatch = promptText.match(/<([a-zA-Z0-9_-]+)>([^<]+)<\/\1>/);
            if (tagMatch && tagMatch[2]) {
                const names = tagMatch[2].split('|').map(s => s.trim()).filter(Boolean);
                if (names.length > 0) {
                    for (let i = 0; i < count; i++) {
                        labels.push(names[i] || `字段 {{${i + 1}}}`);
                    }
                    return labels;
                }
            }

            // 尝试从 HTML 模板中提取字段附近的中文或标题说明
            const htmlText = customTemplate.htmlTemplate || '';
            for (let i = 1; i <= count; i++) {
                const regex = new RegExp(`>([^<]{1,20})<[^>]*>\\{\\{${i}\\}\\}`, 'i');
                const prevLabelMatch = htmlText.match(regex);
                if (prevLabelMatch && prevLabelMatch[1] && prevLabelMatch[1].trim()) {
                    labels.push(prevLabelMatch[1].trim());
                } else {
                    labels.push(`字段 {{${i}}}`);
                }
            }
            return labels;
        }

        for (let i = 1; i <= count; i++) {
            labels.push(`字段 {{${i}}}`);
        }
        return labels;
    }

    function wcEditCurrentDossier() {
        if (wcCurrentDossierIndex < 0 || wcCurrentDossierIndex >= wcDossierMessages.length) return;
        const msg = wcDossierMessages[wcCurrentDossierIndex];
        const dossier = msg.mindDossier;
        if (!dossier) return;

        let overlay = document.getElementById('wcEditDossierModalOverlay');
        if (!overlay) {
            overlay = document.createElement('div');
            overlay.id = 'wcEditDossierModalOverlay';
            overlay.style.cssText = 'position: fixed; inset: 0; background: rgba(0,0,0,0.5); backdrop-filter: blur(25px); -webkit-backdrop-filter: blur(25px); z-index: 99999 !important; display: none; align-items: center; justify-content: center; opacity: 0; transition: opacity 0.25s cubic-bezier(0.25, 0.8, 0.25, 1); box-sizing: border-box; padding: 20px;';
            overlay.onclick = (e) => { if (e.target === overlay) wcCloseEditDossierModal(); };
            document.body.appendChild(overlay);
        }

        let bodyHtml = '<div style="display: flex; flex-direction: column; gap: 14px;">';

        // 1. 自定义正则捕获心声：动态提取字段名称并渲染
        if (dossier._regexMatches && Array.isArray(dossier._regexMatches) && dossier._regexMatches.length > 1) {
            const customTemplate = (typeof wcCustomDossiersList !== 'undefined')
                ? (wcCustomDossiersList.find(d => d.id === dossier._customTemplateId) || wcCustomDossiersList.find(d => d.id === wcActiveDossierId))
                : null;
            const fieldCount = dossier._regexMatches.length - 1;
            const labels = wcGetDossierFieldLabels(customTemplate, fieldCount);

            for (let idx = 1; idx <= fieldCount; idx++) {
                const val = dossier._regexMatches[idx] || '';
                const labelName = labels[idx - 1] || `字段 {{${idx}}}`;
                const isLongText = val.length > 25 || val.includes('\n');

                bodyHtml += `
                    <div style="display: flex; flex-direction: column; gap: 6px;">
                        <label style="font-size: 13px; font-weight: 600; color: #8e8e93;">${labelName}</label>
                        ${isLongText
                            ? `<textarea class="wc-edit-dossier-regex-field" data-index="${idx}" rows="3" style="width: 100%; border: none; background: #f2f2f7; border-radius: 12px; padding: 12px 14px; font-size: 15px; color: #000; outline: none; box-sizing: border-box; resize: none; line-height: 1.4;">${val}</textarea>`
                            : `<input type="text" class="wc-edit-dossier-regex-field" data-index="${idx}" value="${String(val).replace(/"/g, '&quot;')}" style="width: 100%; border: none; background: #f2f2f7; border-radius: 12px; padding: 12px 14px; font-size: 15px; color: #000; outline: none; box-sizing: border-box;">`
                        }
                    </div>
                `;
            }
        } else {
            // 2. 内置及未来扩展的任意 JSON 心声：动态自适应所有属性
            const fieldLabelMap = {
                'monologue': '真实心声 (Inner Monologue)',
                'draft': '未发草稿 (Unsent Draft)',
                'parallel_branch': '平行时空推演 (Parallel Simulation)',
                'load': '心理负荷 (Cognitive Load)',
                'focus': '注意力锚点 (Focus Point)',
                'env': '感知环境 (Environment)',
                'heart_rate': '即时心率 (Heart Rate)'
            };

            const renderedKeys = new Set();

            // 优先按常规体验顺序渲染核心字段
            const coreFields = ['monologue', 'draft', 'parallel_branch'];
            coreFields.forEach(k => {
                if (dossier[k] !== undefined) {
                    const label = fieldLabelMap[k] || k;
                    const val = dossier[k] || '';
                    bodyHtml += `
                        <div style="display: flex; flex-direction: column; gap: 6px;">
                            <label style="font-size: 13px; font-weight: 600; color: #8e8e93;">${label}</label>
                            <textarea class="wc-edit-dossier-obj-field" data-key="${k}" rows="3" style="width: 100%; border: none; background: #f2f2f7; border-radius: 12px; padding: 12px 14px; font-size: 15px; color: #000; outline: none; box-sizing: border-box; resize: none; line-height: 1.4;">${val}</textarea>
                        </div>
                    `;
                    renderedKeys.add(k);
                }
            });

            // 渲染 telemetry 指标字段
            if (dossier.telemetry && typeof dossier.telemetry === 'object') {
                Object.keys(dossier.telemetry).forEach(subK => {
                    const label = fieldLabelMap[subK] || `遥测: ${subK}`;
                    const val = dossier.telemetry[subK] || '';
                    bodyHtml += `
                        <div style="display: flex; flex-direction: column; gap: 6px;">
                            <label style="font-size: 13px; font-weight: 600; color: #8e8e93;">${label}</label>
                            <input type="text" class="wc-edit-dossier-telemetry-field" data-key="${subK}" value="${String(val).replace(/"/g, '&quot;')}" style="width: 100%; border: none; background: #f2f2f7; border-radius: 12px; padding: 12px 14px; font-size: 15px; color: #000; outline: none; box-sizing: border-box;">
                        </div>
                    `;
                });
                renderedKeys.add('telemetry');
            }

            // 动态遍历未来任意自定义的新增字段（完全自适应任何自定义心声）
            Object.keys(dossier).forEach(k => {
                if (k.startsWith('_') || renderedKeys.has(k) || k === 'search_traces') return;
                const val = dossier[k];
                if (typeof val === 'string' || typeof val === 'number') {
                    const isLongText = String(val).length > 30 || String(val).includes('\n');
                    const label = fieldLabelMap[k] || `自定义字段: ${k}`;
                    bodyHtml += `
                        <div style="display: flex; flex-direction: column; gap: 6px;">
                            <label style="font-size: 13px; font-weight: 600; color: #8e8e93;">${label}</label>
                            ${isLongText
                                ? `<textarea class="wc-edit-dossier-obj-field" data-key="${k}" rows="2" style="width: 100%; border: none; background: #f2f2f7; border-radius: 12px; padding: 12px 14px; font-size: 15px; color: #000; outline: none; box-sizing: border-box; resize: none; line-height: 1.4;">${val}</textarea>`
                                : `<input type="text" class="wc-edit-dossier-obj-field" data-key="${k}" value="${String(val).replace(/"/g, '&quot;')}" style="width: 100%; border: none; background: #f2f2f7; border-radius: 12px; padding: 12px 14px; font-size: 15px; color: #000; outline: none; box-sizing: border-box;">`
                            }
                        </div>
                    `;
                }
            });
        }

        bodyHtml += '</div>';

        overlay.innerHTML = `
            <div style="width: 100%; max-width: 360px; background: #ffffff; border-radius: 22px; box-shadow: 0 20px 60px rgba(0,0,0,0.3); overflow: hidden; display: flex; flex-direction: column; max-height: 82vh; transform: scale(0.95); transition: transform 0.25s cubic-bezier(0.25, 0.8, 0.25, 1);" onclick="event.stopPropagation()">
                <div style="display: flex; align-items: center; justify-content: space-between; padding: 16px 18px; border-bottom: 0.5px solid rgba(0,0,0,0.08); background: #ffffff;">
                    <button type="button" onclick="wcCloseEditDossierModal()" style="border: none; background: transparent; font-size: 16px; color: #8e8e93; font-weight: 500; cursor: pointer; padding: 0;">取消</button>
                    <span style="font-size: 17px; font-weight: 700; color: #000;">编辑心声</span>
                    <button type="button" onclick="wcSaveEditDossierModal()" style="border: none; background: transparent; font-size: 16px; color: var(--tg-blue, #007aff); font-weight: 700; cursor: pointer; padding: 0;">完成</button>
                </div>
                <div style="padding: 18px; overflow-y: auto; flex: 1;">
                    ${bodyHtml}
                </div>
            </div>
        `;

        overlay.style.display = 'flex';
        overlay.offsetHeight;
        overlay.style.opacity = '1';
        const card = overlay.firstElementChild;
        if (card) card.style.transform = 'scale(1)';
    }
    window.wcEditCurrentDossier = wcEditCurrentDossier;

    function wcCloseEditDossierModal() {
        const overlay = document.getElementById('wcEditDossierModalOverlay');
        if (overlay) {
            overlay.style.opacity = '0';
            const card = overlay.firstElementChild;
            if (card) card.style.transform = 'scale(0.95)';
            setTimeout(() => { overlay.style.display = 'none'; }, 250);
        }
    }
    window.wcCloseEditDossierModal = wcCloseEditDossierModal;

    function wcSaveEditDossierModal() {
        if (wcCurrentDossierIndex < 0 || wcCurrentDossierIndex >= wcDossierMessages.length) return;
        const msg = wcDossierMessages[wcCurrentDossierIndex];
        const dossier = msg.mindDossier;
        if (!dossier) return;

        // 1. 保存正则捕获型字段
        const regexFields = document.querySelectorAll('.wc-edit-dossier-regex-field');
        if (regexFields.length > 0 && dossier._regexMatches) {
            regexFields.forEach(field => {
                const idx = parseInt(field.getAttribute('data-index'), 10);
                if (idx > 0) {
                    dossier._regexMatches[idx] = field.value.trim();
                }
            });
        }

        // 2. 保存通用与自定义对象字段
        const objFields = document.querySelectorAll('.wc-edit-dossier-obj-field');
        objFields.forEach(field => {
            const key = field.getAttribute('data-key');
            if (key) {
                dossier[key] = field.value.trim();
            }
        });

        // 3. 保存 telemetry 字段
        const teleFields = document.querySelectorAll('.wc-edit-dossier-telemetry-field');
        if (teleFields.length > 0) {
            if (!dossier.telemetry) dossier.telemetry = {};
            teleFields.forEach(field => {
                const key = field.getAttribute('data-key');
                if (key) {
                    dossier.telemetry[key] = field.value.trim();
                }
            });
        }

        if (typeof wcSaveChatData === 'function') wcSaveChatData();
        wcRenderVoiceDossier();
        wcCloseEditDossierModal();
        if (typeof showToast === 'function') showToast('心声内容已更新');
    }
    window.wcSaveEditDossierModal = wcSaveEditDossierModal;

    function wcToggleFavoriteCurrentDossier() {
        if (wcCurrentDossierIndex < 0 || wcCurrentDossierIndex >= wcDossierMessages.length) return;
        const msg = wcDossierMessages[wcCurrentDossierIndex];
        const dossier = msg.mindDossier;
        if (!dossier) return;

        if (typeof wcFavoritesList === 'undefined') window.wcFavoritesList = [];
        const existingIndex = wcFavoritesList.findIndex(f => f.msgId === msg.id && f.type === 'dossier');

        if (existingIndex > -1) {
            wcFavoritesList.splice(existingIndex, 1);
            if (typeof wcSaveFavoritesData === 'function') wcSaveFavoritesData();
            wcUpdateDossierFavIcon(false);
            if (typeof showToast === 'function') showToast('已取消收藏');
        } else {
            const contact = wcContactsList.find(c => c.id === wcCurrentChatContactId);
            const sourceName = contact?.remark || contact?.name || '心声';

            const storedDossier = wcResolveDossierForPreview(dossier, wcCurrentChatContactId) || dossier;
            let favContent = '';
            if (storedDossier._regexMatches && Array.isArray(storedDossier._regexMatches) && storedDossier._regexMatches.length > 1) {
                favContent = storedDossier._regexMatches.slice(1).join(' | ');
            } else {
                const parts = [];
                if (dossier.draft) parts.push(`【未发草稿】${dossier.draft}`);
                if (dossier.monologue) parts.push(`【真实心声】${dossier.monologue}`);
                if (dossier.telemetry?.focus) parts.push(`【关注】${dossier.telemetry.focus}`);
                if (dossier.parallel_branch) parts.push(`【平行时空】${dossier.parallel_branch}`);
                favContent = parts.join('\n') || '心声档案';
            }

            const favItem = {
                id: 'fav_' + Date.now(),
                msgId: msg.id,
                contactId: wcCurrentChatContactId,
                contactName: sourceName,
                messageAt: msg.createdAt || Date.now(),
                type: 'dossier',
                text: `[心声档案]\n${favContent}`,
                imageUrl: null,
                // 心声独立保存结构化快照，旧聊天清理后收藏仍能呈现卡片。
                messageSnapshot: { mindDossier: JSON.parse(JSON.stringify(storedDossier)) },
                sourceName: sourceName,
                createdAt: Date.now()
            };

            wcFavoritesList.unshift(favItem);
            if (typeof wcSaveFavoritesData === 'function') wcSaveFavoritesData();
            wcUpdateDossierFavIcon(true);
            if (typeof showToast === 'function') showToast('已加入我的收藏');
        }
    }
    window.wcToggleFavoriteCurrentDossier = wcToggleFavoriteCurrentDossier;

    function wcUpdateDossierFavIcon(isFav, buttonId = 'wcVdFavBtn', iconId = 'wcVdFavIcon') {
        const btn = document.getElementById(buttonId);
        const icon = document.getElementById(iconId);
        if (!btn || !icon) return;
        if (isFav) {
            btn.classList.add('is-fav');
            icon.innerHTML = '<path d="M215.466667 42.666667H810.666667c32 0 59.733333 25.6 59.733333 59.733333v819.2c0 23.466667-12.8 44.8-34.133333 53.333333-21.333333 10.666667-44.8 6.4-64-8.533333L512 746.666667 253.866667 966.4c-17.066667 14.933333-42.666667 19.2-64 8.533333s-34.133333-29.866667-34.133334-53.333333V102.4C155.733333 68.266667 181.333333 42.666667 215.466667 42.666667z" fill="#FF9500"></path>';
        } else {
            btn.classList.remove('is-fav');
            icon.innerHTML = '<path d="M215.466667 42.666667H810.666667c32 0 59.733333 25.6 59.733333 59.733333v819.2c0 23.466667-12.8 44.8-34.133333 53.333333-21.333333 10.666667-44.8 6.4-64-8.533333L512 746.666667 253.866667 966.4c-17.066667 14.933333-42.666667 19.2-64 8.533333s-34.133333-29.866667-34.133334-53.333333V102.4C155.733333 68.266667 181.333333 42.666667 215.466667 42.666667z m29.866666 89.6v725.333333L512 629.333333l266.666667 228.266667v-725.333333h-533.333334z" fill="currentColor"></path>';
        }
    }

    window.wcUpdateDossierFavIcon = wcUpdateDossierFavIcon;

    function wcToggleDossierDraftTranslation(event, trigger) {
        event?.stopPropagation();
        const selection = typeof window.getSelection === 'function' ? String(window.getSelection() || '').trim() : '';
        if (selection) return;

        const draftBox = trigger?.closest?.('.wc-vd-draft-box');
        const translationEl = draftBox?.querySelector?.('.wc-vd-draft-translation');
        if (!translationEl) return;

        translationEl.hidden = !translationEl.hidden;
        trigger.setAttribute('aria-expanded', translationEl.hidden ? 'false' : 'true');
    }
    window.wcToggleDossierDraftTranslation = wcToggleDossierDraftTranslation;

    // 将历史自定义心声恢复成原模板所需的捕获组；只使用真实保存的字段/原文。
    // 旧收藏通常只有“字段1 | 字段2”，新格式的 mind frame 也可能是命名字段对象。
    function wcResolveDossierForPreview(input, contactId = null, favoriteText = '') {
        const dossier = input && typeof input === 'object' ? input : {};
        const state = wcGetDossierSettingsForContact(contactId ?? '');
        const list = state.customDossiers || [];
        // 已有模板 ID 的历史记录，只能匹配该模板或其保存的 HTML 快照；
        // 不能因角色后来切换模板而偷偷套用新模板。
        const template = dossier._customTemplateId
            ? (list.find(item => item.id === dossier._customTemplateId) || null)
            : (list.find(item => item.id === state.activeId) || null);
        const htmlTemplate = dossier._htmlTemplate || template?.htmlTemplate || '';
        const hasSavedMatches = Array.isArray(dossier._regexMatches)
            && dossier._regexMatches.slice(1).some(value => String(value ?? '').trim());
        if (hasSavedMatches) {
            // 收藏当下固化真实 HTML 与模板 ID，后续切换/修改/删除当前模板均不影响此收藏。
            return htmlTemplate
                ? { ...dossier, _htmlTemplate: htmlTemplate,
                    _customTemplateId: dossier._customTemplateId || template?.id }
                : dossier;
        }
        if (!htmlTemplate) return input || null;

        const placeholders = [...htmlTemplate.matchAll(/\{\{(\d+)\}\}/g)].map(match => Number(match[1]));
        const fieldCount = Math.max(0, ...placeholders);
        const meaningful = value => value !== null && value !== undefined
            && (typeof value !== 'string' || (value.trim() && !/^(?:心声档案|undefined|null)$/i.test(value.trim())));
        const asText = value => typeof value === 'string' ? value.trim() : '';
        const fromText = value => {
            const raw = asText(value).replace(/^\s*\[心声档案\]\s*/, '').trim();
            if (!meaningful(raw)) return null;
            let pattern = String(template?.regexPattern || '').trim();
            if (pattern.startsWith('/') && pattern.lastIndexOf('/') > 0) pattern = pattern.slice(1, pattern.lastIndexOf('/'));
            pattern = pattern.replace(/\\\*/g, '*');
            if (pattern) {
                try {
                    const matched = raw.match(new RegExp(pattern, 'is'));
                    if (matched && matched.length > 1) return [matched[0], ...matched.slice(1)];
                } catch (_) {}
            }
            const tagged = raw.match(/<([a-zA-Z][\w-]*)>([\s\S]*?)<\/\1>/i);
            const content = tagged ? tagged[2].trim() : raw;
            const parts = content.split(/\s*\|\s*/).map(item => item.trim());
            if ((parts.length > 1 || fieldCount === 1) && parts.some(meaningful)) {
                return [tagged?.[0] || raw, ...parts];
            }
            return null;
        };

        const sources = [
            dossier._regexMatches?.[0], dossier._raw, dossier.raw, dossier.rawText,
            dossier.mindRaw, dossier.content, dossier.text, dossier.status,
            dossier.state, favoriteText
        ];
        let matches = sources.map(fromText).find(Boolean);

        if (!matches) {
            const promptTag = String(template?.prompt || '').match(/<([a-zA-Z][\w-]*)>([^<]+)<\/\1>/);
            const labels = promptTag ? promptTag[2].split('|').map(item => item.trim()) : [];
            const containers = [dossier.fields, dossier.values, dossier.captures, dossier.groups, dossier.data, dossier];
            for (const fields of containers) {
                if (!fields || typeof fields !== 'object') continue;
                let values = [];
                if (Array.isArray(fields)) {
                    values = fields.filter(value => ['string', 'number'].includes(typeof value)).map(String);
                } else {
                    const entries = Object.entries(fields).filter(([key, value]) =>
                        !['draft', 'monologue', 'telemetry', 'parallel_branch', 'search_traces',
                            '_regexMatches', '_customTemplateId', '_htmlTemplate', '_raw', 'raw',
                            'rawText', 'mindRaw', 'content', 'text', 'status', 'state',
                            'channel', 'kind', 'type', 'id', 'timestamp'].includes(key)
                        && ['string', 'number'].includes(typeof value) && meaningful(value));
                    const matchingLabels = labels.map(label => meaningful(fields[label]) ? String(fields[label]) : '');
                    values = matchingLabels.some(meaningful) ? matchingLabels : entries.map(([, value]) => String(value));
                }
                if (values.some(meaningful)) {
                    matches = ['', ...values];
                    break;
                }
            }
        }
        if (!matches || !matches.slice(1).some(meaningful)) return input || null;
        return {
            ...dossier,
            _regexMatches: matches,
            _customTemplateId: dossier._customTemplateId || template?.id,
            _htmlTemplate: htmlTemplate
        };
    }
    window.wcResolveDossierForPreview = wcResolveDossierForPreview;

    function wcRenderVoiceDossier(options = {}) {
        // 收藏传入自己的容器、消息与角色 ID；共享原心声系统的全部卡片模板和渲染逻辑。
        const preview = options.preview === true && !!options.container;
        if (!preview && (wcCurrentDossierIndex < 0 || wcCurrentDossierIndex >= wcDossierMessages.length)) return;
        const msg = preview ? options.message : wcDossierMessages[wcCurrentDossierIndex];
        const dossier = preview
            ? wcResolveDossierForPreview(msg?.mindDossier, options.contactId, options.favoriteText)
            : msg?.mindDossier;
        if (!dossier) return;

        if (!preview && typeof wcFavoritesList !== 'undefined') {
            const isFav = wcFavoritesList.some(f => f.msgId === msg.id && f.type === 'dossier');
            wcUpdateDossierFavIcon(isFav);
        }

        const dateObj = new Date(msg.createdAt || Date.now());
        const timeStr = `${String(dateObj.getHours()).padStart(2, '0')}:${String(dateObj.getMinutes()).padStart(2, '0')}:${String(dateObj.getSeconds()).padStart(2, '0')}`;
        const container = preview ? options.container : document.getElementById('wcVdContainer');
        if (!container) return;

        const settings = preview ? wcGetDossierSettingsForContact(options.contactId ?? '') : null;
        const customDossiers = settings?.customDossiers || wcCustomDossiersList;
        const activeId = settings?.activeId || wcActiveDossierId;
        const customTemplate = dossier._customTemplateId
            ? (customDossiers.find(d => d.id === dossier._customTemplateId) || null)
            : (customDossiers.find(d => d.id === activeId)
                || (!preview && customDossiers.length > 0 ? customDossiers[0] : null));
        const templateHtml = dossier._htmlTemplate || (customTemplate && customTemplate.htmlTemplate);
        if (preview && Array.isArray(dossier._regexMatches) && dossier._regexMatches.length > 1 && !templateHtml) {
            container.innerHTML = '<div class="wc-fav-legacy-dossier">这条历史心声的自定义 HTML 模板未被保存，且原模板已不可用，无法原样还原。已保留的心声字段：' +
                dossier._regexMatches.slice(1).map(value => String(value ?? '')).join(' · ')
                    .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;') + '</div>';
            return;
        }

        if (dossier._regexMatches && templateHtml) {
            let renderedHtml = templateHtml;

            // 针对 HTML 属性与普通文本占位符进行严密转义，彻底消灭未转义换行与双引号导致的语法错误
            const escapeAttrValue = (str) => {
                return String(str || '')
                    .replace(/&/g, '&amp;')
                    .replace(/"/g, '&quot;')
                    .replace(/'/g, '&#39;')
                    .replace(/\r?\n/g, '\\n');
            };
            const escapeHtmlContent = (str) => {
                return String(str || '')
                    .replace(/&/g, '&amp;')
                    .replace(/</g, '&lt;')
                    .replace(/>/g, '&gt;');
            };

            dossier._regexMatches.forEach((val, idx) => {
                if (idx > 0) {
                    const cleanVal = String(val == null ? '--' : val).trim();
                    // 1. 优先替换出现在 HTML 标签属性内部（如 data-*="..." 或 ="..."）中的占位符
                    renderedHtml = renderedHtml.replace(new RegExp(`=(["'])(.*?)\\{\\{${idx}\\}\\}(.*?)\\1`, 'gs'), (m, quote, p1, p2) => `=${quote}${p1}${escapeAttrValue(cleanVal)}${p2}${quote}`);
                    // 2. 替换普通节点文本中的占位符
                    renderedHtml = renderedHtml.replace(new RegExp(`\\{\\{${idx}\\}\\}`, 'g'), () => escapeHtmlContent(cleanVal));
                }
            });
            renderedHtml = renderedHtml.replace(/\{\{time\}\}/g, () => timeStr);

            const contact = preview ? settings?.contact : wcContactsList.find(c => c.id === wcCurrentChatContactId);
            const charName = contact?.remark || contact?.name || '角色';
            const userName = (typeof appSettings !== 'undefined' && appSettings.wc_current_user_name) ? appSettings.wc_current_user_name : '用户';
            renderedHtml = renderedHtml.replace(/\{\{char\}\}/gi, () => charName).replace(/\{\{user\}\}/gi, () => userName);

            // 沙盒模式下 <script> 标签天然会自动执行，清除旧模板里用来强行 eval 的 hack 图片标签，彻底清除 eval 抛出的语法异常
            renderedHtml = renderedHtml.replace(/<img[^>]*onload=["'][^"']*eval\([^>]*>/gi, '');

            // 构造独立沙盒的上下文数据，严格转义尖括号，彻底杜绝 </script> 截断导致的 SyntaxError 与爆代码
            const sandboxDataJson = JSON.stringify({
                matches: dossier._regexMatches,
                time: timeStr,
                char: charName,
                user: userName,
                raw: dossier
            }).replace(/</g, '\\u003c').replace(/>/g, '\\u003e');


            // 构筑自包含 HTML 文档，使用安全的 script 包装机制防断裂
            const sandboxDocumentHtml = '<!DOCTYPE html>' +
                '<html>' +
                '<head>' +
                '<meta charset="utf-8">' +
                '<meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">' +
                '<style>' +
                '* { box-sizing: border-box; -webkit-tap-highlight-color: transparent; }' +
                'html, body {' +
                '    margin: 0;' +
                '    padding: 0;' +
                '    width: 100%;' +
                '    min-height: 100%;' +
                '    background: transparent;' +
                '    font-family: -apple-system, BlinkMacSystemFont, "PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", sans-serif;' +
                '    overflow-x: hidden;' +
                '    display: flex;' +
                '    flex-direction: column;' +
                '    align-items: center;' +
                '    justify-content: center;' +
                '}' +
                'body::-webkit-scrollbar { display: none; }' +
                '</style>' +
                '<script>' +
                'window.__DOSSIER__ = ' + sandboxDataJson + ';' +
                '<' + '/script>' +
                '</head>' +
                '<body>' +
                renderedHtml +
                '</body>' +
                '</html>';

            if (preview) {
                // 与原心声窗口使用同一种 Blob HTML 页面，保证自定义 CSS/JS 卡片原样运行。
                // 收藏弹窗卸载/重绘时由 wcReleaseFavoriteDossierFrames 释放 URL。
                if (container._sandboxBlobUrl) URL.revokeObjectURL(container._sandboxBlobUrl);
                const blobUrl = URL.createObjectURL(new Blob([sandboxDocumentHtml], { type: 'text/html;charset=utf-8' }));
                container._sandboxBlobUrl = blobUrl;
                const nativeSize = options.nativeOverlay === true
                    ? ' style="width:100%;max-width:420px;height:calc(85vh - 120px);display:flex;justify-content:center;align-items:center;overflow:hidden;box-sizing:border-box;"'
                    : '';
                container.innerHTML = '<div class="wc-custom-dossier-sandbox-wrapper wc-fav-native-dossier-frame"' + nativeSize + '>' +
                    '<iframe class="wc-fav-dossier-iframe" title="收藏的自定义心声卡片"></iframe></div>';
                container.querySelector('iframe').src = blobUrl;
                return;
            }

            // 释放旧的沙盒 URL，杜绝内存泄漏
            if (container._sandboxBlobUrl) {
                URL.revokeObjectURL(container._sandboxBlobUrl);
                container._sandboxBlobUrl = null;
            }

            // 使用原生 Blob 对象生成独立网页 URL，彻底解决 document.write 语法解析错误与 sandbox 属性警告
            const blob = new Blob([sandboxDocumentHtml], { type: 'text/html;charset=utf-8' });
            const blobUrl = URL.createObjectURL(blob);
            container._sandboxBlobUrl = blobUrl;

            container.innerHTML = `
                <div class="wc-custom-dossier-sandbox-wrapper" style="width: 100%; max-width: 420px; height: calc(85vh - 120px); display: flex; justify-content: center; align-items: center; box-sizing: border-box; overflow: hidden;">
                    <iframe id="wcDossierSandboxIframe" src="${blobUrl}" style="width: 100%; height: 100%; border: none; background: transparent; display: block;"></iframe>
                </div>
            `;
            return;
        }

        // 历史自定义心声没有可恢复的字段时，明确提示，避免渲染全是“--”的默认假卡片。
        if (preview) {
            const hasDefaultContent = Boolean(
                dossier.draft || dossier.monologue || dossier.parallel_branch ||
                (Array.isArray(dossier.search_traces) && dossier.search_traces.length) ||
                (dossier.telemetry && Object.values(dossier.telemetry).some(value => value != null && String(value).trim()))
            );
            if (!hasDefaultContent) {
                container.innerHTML = '<div class="wc-fav-legacy-dossier">这条历史心声没有保存可供预览的内容。请在原聊天室打开该条心声，确认内容后重新收藏。</div>';
                return;
            }
        }

        // 默认心声：外层卡片边框与默认心声状态栏属于默认心声的完整固有 HTML，合为一个整体渲染
        let searchHtml = '';
        if (dossier.search_traces && Array.isArray(dossier.search_traces) && dossier.search_traces.length > 0) {
            searchHtml = `
                <div class="wc-vd-hairline-divider"></div>
                <div class="wc-vd-search-section">
                    <div class="wc-vd-section-header">
                        <span class="wc-vd-section-title">03 // Sub-surface Queries</span>
                        <span class="wc-vd-section-subtitle">${dossier.search_traces.length} Traces</span>
                    </div>
                    <div class="wc-vd-search-trace-list">
                        ${dossier.search_traces.map(t => {
                            let queryText = '';
                            let timeVal = '';
                            if (typeof t === 'string') {
                                queryText = t;
                            } else if (t && typeof t === 'object') {
                                queryText = t.query || t.text || t.keyword || t.content || t.title || Object.values(t).find(v => typeof v === 'string') || '';
                                timeVal = t.time || t.timestamp || '';
                            }
                            return `
                                <div class="wc-vd-search-trace-item">
                                    <div class="wc-vd-search-left">
                                        <svg viewBox="0 0 24 24"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
                                        <span>${queryText}</span>
                                    </div>
                                    ${timeVal ? `<span class="wc-vd-search-time">${timeVal}</span>` : ''}
                                </div>
                            `;
                        }).join('')}
                    </div>
                </div>
            `;
        }

        let draftHtml = '';
        const draftText = typeof dossier.draft === 'object' && dossier.draft !== null ? (dossier.draft.text || dossier.draft.content || JSON.stringify(dossier.draft)) : dossier.draft;
        const rawDraftTranslation = typeof dossier.draft_translation === 'object' && dossier.draft_translation !== null
            ? (dossier.draft_translation.text || dossier.draft_translation.content || '')
            : dossier.draft_translation;
        const draftTranslation = String(rawDraftTranslation || '').trim();
        const escapeDossierText = (value) => String(value == null ? '' : value)
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;');
        const hasDraftTranslation = !!draftTranslation && draftTranslation !== String(draftText || '').trim();
        if (draftText) {
            const draftDisplayText = escapeDossierText(draftText);
            const translationDisplayText = escapeDossierText(draftTranslation);
            draftHtml = `
                <div class="wc-vd-draft-box">
                    <span class="wc-vd-draft-label">Unsent Draft${hasDraftTranslation ? ' · 点击查看中文' : ''}</span>
                    <p class="wc-vd-draft-text${hasDraftTranslation ? ' wc-bilingual-translation-trigger' : ''}"
                       ${hasDraftTranslation ? 'role="button" tabindex="0" aria-expanded="false" title="点击显示或收起中文" onclick="wcToggleDossierDraftTranslation(event, this)" onkeydown="if(event.key===\'Enter\'||event.key===\' \'){event.preventDefault();wcToggleDossierDraftTranslation(event,this)}"' : ''}>“${draftDisplayText}”</p>
                    ${hasDraftTranslation ? `<div class="wc-bilingual-translation wc-vd-draft-translation" hidden><div class="wc-bilingual-translation-text">${translationDisplayText}</div></div>` : ''}
                </div>
            `;
        }

        const monologueText = typeof dossier.monologue === 'object' && dossier.monologue !== null ? (dossier.monologue.text || dossier.monologue.content || JSON.stringify(dossier.monologue)) : (dossier.monologue || '...');

        // 智能解析平行时空推演文本，彻底防止 [object Object]
        let parallelBranchText = '...';
        let branchConfidence = Math.floor(Math.random() * 20 + 80);
        let nodeTag = `Node: #B-${String(Math.floor(Math.random() * 99)).padStart(2, '0')}`;

        if (typeof dossier.parallel_branch === 'string') {
            parallelBranchText = dossier.parallel_branch;
        } else if (dossier.parallel_branch && typeof dossier.parallel_branch === 'object') {
            const pb = dossier.parallel_branch;
            if (pb.node) nodeTag = `Node: ${pb.node}`;
            if (pb.confidence) branchConfidence = pb.confidence;
            parallelBranchText = pb.script || pb.text || pb.content || pb.scenario || pb.desc || pb.description || pb.branch || pb.summary || Object.values(pb).filter(v => typeof v === 'string').join('\n') || JSON.stringify(pb, null, 2);
        }

        const getTelemetryVal = (v) => (v != null ? (typeof v === 'object' ? (Object.values(v).find(x => typeof x === 'string' || typeof x === 'number') || JSON.stringify(v)) : v) : '--');

        const metaArchiveText = preview ? 'ARCHIVE / 收藏预览' : `ARCHIVE #${String(wcCurrentDossierIndex + 1).padStart(2, '0')} / ${String(wcDossierMessages.length).padStart(2, '0')}`;

        container.innerHTML = `
            <div class="wc-vd-voice-card" style="margin: 0 auto;">
                <div class="wc-vd-card-header-bar">
                    <div class="wc-vd-header-tag">Mind Dossier</div>
                    <div class="wc-vd-header-meta" id="wcVdHeaderMeta">${metaArchiveText}</div>
                </div>
                <div class="wc-vd-card-scroll-viewport" id="wcVdScrollViewport">
                    <div class="wc-vd-voice-section">
                        <div class="wc-vd-section-header">
                            <span class="wc-vd-section-title">01 // Inner Monologue</span>
                            <span class="wc-vd-section-subtitle">${timeStr}</span>
                        </div>
                        ${draftHtml}
                        <p class="wc-vd-monologue-core">${monologueText}</p>
                    </div>

                    <div class="wc-vd-hairline-divider"></div>

                    <div class="wc-vd-telemetry-section">
                        <div class="wc-vd-section-header">
                            <span class="wc-vd-section-title">02 // Cognitive Telemetry</span>
                            <span class="wc-vd-section-subtitle">Realtime</span>
                        </div>
                        <div class="wc-vd-telemetry-grid">
                            <div class="wc-vd-telemetry-card">
                                <div class="wc-vd-telemetry-card-top">
                                    <span class="wc-vd-telemetry-name">心理负荷</span>
                                    <span class="wc-vd-telemetry-dot"></span>
                                </div>
                                <span class="wc-vd-telemetry-val">${getTelemetryVal(dossier.telemetry?.load)}</span>
                            </div>
                            <div class="wc-vd-telemetry-card">
                                <div class="wc-vd-telemetry-card-top">
                                    <span class="wc-vd-telemetry-name">注意力锚点</span>
                                    <span class="wc-vd-telemetry-dot"></span>
                                </div>
                                <span class="wc-vd-telemetry-val">${getTelemetryVal(dossier.telemetry?.focus)}</span>
                            </div>
                            <div class="wc-vd-telemetry-card">
                                <div class="wc-vd-telemetry-card-top">
                                    <span class="wc-vd-telemetry-name">感知环境</span>
                                    <span class="wc-vd-telemetry-dot"></span>
                                </div>
                                <span class="wc-vd-telemetry-val">${getTelemetryVal(dossier.telemetry?.env)}</span>
                            </div>
                            <div class="wc-vd-telemetry-card">
                                <div class="wc-vd-telemetry-card-top">
                                    <span class="wc-vd-telemetry-name">即时心率</span>
                                    <span class="wc-vd-telemetry-dot"></span>
                                </div>
                                <span class="wc-vd-telemetry-val">${getTelemetryVal(dossier.telemetry?.heart_rate)}</span>
                            </div>
                        </div>
                    </div>

                    ${searchHtml}

                    <div class="wc-vd-hairline-divider"></div>

                    <div class="wc-vd-theater-section">
                        <div class="wc-vd-section-header">
                            <span class="wc-vd-section-title">04 // Parallel Branch</span>
                            <span class="wc-vd-section-subtitle">${nodeTag}</span>
                        </div>
                        <div class="wc-vd-theater-container">
                            <div class="wc-vd-theater-header-row">
                                <span class="wc-vd-theater-badge">Simulation: Parallel Universe</span>
                                <span class="wc-vd-theater-node">Branch Confidence: ${branchConfidence}%</span>
                            </div>
                            <p class="wc-vd-theater-script-body">${parallelBranchText}</p>
                        </div>
                    </div>
                </div>
            </div>
        `;
        if (preview) {
            container.querySelectorAll('.wc-vd-draft-translation').forEach(el => { el.hidden = false; });
            container.querySelectorAll('.wc-vd-draft-text[role="button"]').forEach(el => {
                el.removeAttribute('role');
                el.removeAttribute('tabindex');
                el.removeAttribute('onclick');
                el.removeAttribute('onkeydown');
            });
        }
    }
    window.wcRenderVoiceDossier = wcRenderVoiceDossier;




