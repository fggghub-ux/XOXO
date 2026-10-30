/**
 * 角色主动消息设置页面
 * 管理哪些角色可以在后台主动发消息
 */

(function() {
    // 创建角色主动消息设置页面
    function openProactiveMessageSettings() {
        if (!window.ProactivePush || !window.ProactivePush.isSupported()) {
            if (typeof showCustomAlert === 'function') {
                showCustomAlert('提示', '您的浏览器不支持推送通知功能，请使用 Chrome、Edge 或 Firefox 浏览器。');
            } else if (typeof showToast === 'function') {
                showToast('浏览器不支持推送通知');
            }
            return;
        }

        // 创建设置页面HTML
        const html = `
            <div class="proactive-settings-container" id="proactiveSettingsUI" style="position: absolute; top: 0; left: 0; width: 100%; height: 100%; z-index: 8000; background: #f2f2f7; overflow: hidden;">
                <div class="proactive-settings-header" style="position: absolute; top: 0; left: 0; right: 0; height: 44px; background: rgba(255,255,255,0.8); backdrop-filter: blur(20px); -webkit-backdrop-filter: blur(20px); display: flex; align-items: center; justify-content: space-between; padding: 0 16px; border-bottom: 0.5px solid rgba(0,0,0,0.1); z-index: 100;">
                    <button onclick="closeProactiveMessageSettings()" style="background: none; border: none; color: #007aff; font-size: 17px; cursor: pointer; padding: 8px;">
                        ← 返回
                    </button>
                    <span style="font-size: 17px; font-weight: 600;">角色主动消息</span>
                    <div style="width: 60px;"></div>
                </div>

                <div class="proactive-settings-scroll" style="position: absolute; top: 44px; left: 0; right: 0; bottom: 0; overflow-y: auto; -webkit-overflow-scrolling: touch; padding: 20px 0;">

                    <!-- 说明卡片 -->
                    <div style="background: white; margin: 0 16px 20px; border-radius: 10px; padding: 16px; box-shadow: 0 1px 3px rgba(0,0,0,0.1);">
                        <div style="display: flex; align-items: center; margin-bottom: 12px;">
                            <svg viewBox="0 0 24 24" style="width: 24px; height: 24px; fill: #007aff; margin-right: 8px;">
                                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"/>
                            </svg>
                            <span style="font-size: 16px; font-weight: 600; color: #000;">关于主动消息</span>
                        </div>
                        <p style="font-size: 14px; color: #666; line-height: 1.5; margin: 0;">
                            开启后，即使关闭网页，角色也能根据人设和聊天状态主动给你发消息。需要授权浏览器通知权限。
                        </p>
                    </div>

                    <!-- 角色列表标题 -->
                    <div style="padding: 0 16px 8px; font-size: 13px; color: #666; text-transform: uppercase; letter-spacing: 0.5px;">
                        选择角色
                    </div>

                    <!-- 角色列表 -->
                    <div id="proactiveCharacterList" style="background: white; margin: 0 16px; border-radius: 10px; overflow: hidden; box-shadow: 0 1px 3px rgba(0,0,0,0.1);">
                        <!-- 动态生成 -->
                    </div>

                </div>
            </div>
        `;

        // 插入页面
        const existingUI = document.getElementById('proactiveSettingsUI');
        if (existingUI) {
            existingUI.remove();
        }

        const container = document.createElement('div');
        container.innerHTML = html;
        document.body.appendChild(container.firstElementChild);

        // 渲染角色列表
        renderProactiveCharacterList();
    }

    // 渲染角色列表
    function renderProactiveCharacterList() {
        const listContainer = document.getElementById('proactiveCharacterList');
        if (!listContainer) return;

        // 获取所有联系人
        const contacts = typeof wcContactsList !== 'undefined' ? wcContactsList : [];

        if (contacts.length === 0) {
            listContainer.innerHTML = `
                <div style="padding: 40px 20px; text-align: center; color: #999;">
                    <svg viewBox="0 0 24 24" style="width: 48px; height: 48px; fill: #ccc; margin-bottom: 12px;">
                        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"/>
                    </svg>
                    <p style="font-size: 14px;">还没有角色<br/>去微信添加一些联系人吧</p>
                </div>
            `;
            return;
        }

        let html = '';
        contacts.forEach((contact, index) => {
            const enabled = contact.proactiveMessageEnabled === true;
            const intervalMinutes = contact.proactiveMessageIntervalMinutes || null;
            const borderBottom = index < contacts.length - 1 ? 'border-bottom: 0.5px solid rgba(0,0,0,0.1);' : '';

            html += `
                <div class="proactive-character-item" style="padding: 12px 16px; display: flex; align-items: center; ${borderBottom}">
                    <div class="proactive-character-avatar" style="width: 44px; height: 44px; border-radius: 50%; background: #e5e5ea; background-size: cover; background-position: center; margin-right: 12px; flex-shrink: 0; ${contact.avatar ? `background-image: url(${contact.avatar})` : ''};">
                        ${!contact.avatar ? `<div style="width: 100%; height: 100%; display: flex; align-items: center; justify-content: center; font-size: 18px; color: #999;">${(contact.remark || contact.name || '?').charAt(0)}</div>` : ''}
                    </div>
                    <div style="flex: 1; min-width: 0;">
                        <div style="font-size: 16px; font-weight: 500; color: #000; margin-bottom: 2px;">${contact.remark || contact.name || '未命名'}</div>
                        <div style="font-size: 13px; color: ${enabled ? '#34c759' : '#999'};">
                            ${enabled ? (intervalMinutes ? `每 ${intervalMinutes} 分钟` : '自动判断') : '未开启'}
                        </div>
                    </div>
                    <div class="set-toggle ${enabled ? 'on' : ''}" role="switch" aria-checked="${enabled}" onclick="toggleProactiveForContact('${contact.id}')" style="flex-shrink: 0;"></div>
                </div>
            `;
        });

        listContainer.innerHTML = html;
    }

    // 切换角色的主动消息开关
    async function toggleProactiveForContact(contactId) {
        const contact = typeof wcContactsList !== 'undefined'
            ? wcContactsList.find(c => String(c.id) === String(contactId))
            : null;
        if (!contact) return;

        const enabled = contact.proactiveMessageEnabled !== true;
        const backendEnabled = localStorage.getItem(`proactive_enabled_${contact.id}`) === 'true';
        if (!enabled && backendEnabled) {
            const message = '该角色已开启“设置 → 后端消息”。请先在那里关闭后端消息，再关闭微信主动消息。';
            if (typeof showCustomAlert === 'function') showCustomAlert('请先关闭后端消息', message);
            else if (typeof showToast === 'function') showToast(message);
            return;
        }

        contact.proactiveMessageEnabled = enabled;
        if (enabled) delete contact.proactiveMessageAutoNextAt;
        if (typeof wcSaveContactsDataAsync === 'function') await wcSaveContactsDataAsync();
        if (typeof showToast === 'function') showToast(`已为 ${contact.remark || contact.name} ${enabled ? '开启' : '关闭'}微信主动消息`);

        // 刷新列表
        renderProactiveCharacterList();
    }

    // 关闭设置页面
    function closeProactiveMessageSettings() {
        const ui = document.getElementById('proactiveSettingsUI');
        if (ui) {
            ui.remove();
        }
    }

    // 导出到全局
    window.openProactiveMessageSettings = openProactiveMessageSettings;
    window.closeProactiveMessageSettings = closeProactiveMessageSettings;
    window.toggleProactiveForContact = toggleProactiveForContact;

    console.log('角色主动消息设置模块已加载');
})();
