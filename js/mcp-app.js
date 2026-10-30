{
    const STORE_ID = 'mcpAppData';
    const DB_NAME = 'iOSDesktopDB';
    const STORE_NAME = 'layoutStore';
    let root;
    let data = { version: 1, configurations: [], presets: [] };
    let view = 'list';
    let editingId = null;
    let currentSearchText = '';
    let activeTab = 'configs'; // 新增：'configs' 表示我的配置，'presets' 表示预设
    let isEditMode = false;
    let selectedIds = new Set();
    const BUILT_IN_PRESETS = [
        {
            id: 'official-mcdonalds-cn',
            name: '麦当劳中国 MCP',
            presetName: '麦当劳中国',
            url: 'https://mcp.mcd.cn',
            tokenUrl: 'https://open.mcd.cn/mcp',
            transport: 'streamable-http',
            headers: [{ key: 'Authorization', value: 'Bearer ' }],
            enabled: true,
            builtIn: true,
            authHint: '官方 HTTP 服务，复制 MCP_TOKEN 后点击可尝试自动填入。'
        },
        {
            id: 'official-luckin-coffee-cn',
            name: '瑞幸咖啡 MCP',
            presetName: '瑞幸咖啡',
            url: 'https://gwmcp.lkcoffee.com/order/user/mcp',
            tokenUrl: 'https://open.lkcoffee.com/mcp',
            transport: 'streamable-http',
            headers: [{ key: 'Authorization', value: 'Bearer ' }],
            enabled: true,
            builtIn: true,
            authHint: '官方 HTTP 服务，复制 Token 后点击可尝试自动填入。'
        },
        {
            id: 'official-amap-cn',
            name: '高德地图 MCP',
            presetName: '高德地图',
            url: 'https://mcp.amap.com/mcp?key=',
            tokenUrl: 'https://lbs.amap.com/api/mcp-server/create-project-and-key',
            transport: 'streamable-http',
            headers: [],
            enabled: true,
            builtIn: true,
            authHint: '补全地址末尾的 key，可用于地图、路线、天气等生活服务。'
        },
        {
            id: 'official-todoist',
            name: 'Todoist MCP',
            presetName: 'Todoist',
            url: 'https://ai.todoist.net/mcp',
            tokenUrl: 'https://todoist.com/help/articles/use-ai-tools-with-todoist-T4dtedhkH',
            transport: 'streamable-http',
            headers: [],
            enabled: true,
            builtIn: true,
            authHint: '官方远程服务，打开入口后按 Todoist 账号授权。'
        },
        {
            id: 'official-notion',
            name: 'Notion MCP',
            presetName: 'Notion',
            url: 'https://mcp.notion.com/mcp',
            tokenUrl: 'https://developers.notion.com/docs/mcp',
            transport: 'streamable-http',
            headers: [],
            enabled: true,
            builtIn: true,
            authHint: '官方远程服务，打开入口后按 Notion 账号授权。'
        },
        {
            id: 'official-google-calendar',
            name: 'Google Calendar MCP',
            presetName: 'Google Calendar',
            url: 'https://calendarmcp.googleapis.com/mcp/v1',
            tokenUrl: 'https://developers.google.com/workspace/calendar/api/guides/configure-mcp-server',
            transport: 'streamable-http',
            headers: [],
            enabled: true,
            builtIn: true,
            authHint: '官方 Workspace MCP，使用 Google 账号授权日历。'
        },
        {
            id: 'official-gmail',
            name: 'Gmail MCP',
            presetName: 'Gmail',
            url: 'https://gmailmcp.googleapis.com/mcp/v1',
            tokenUrl: 'https://developers.google.com/workspace/gmail/api/reference/mcp',
            transport: 'streamable-http',
            headers: [],
            enabled: true,
            builtIn: true,
            authHint: '官方 Workspace MCP，使用 Google 账号授权邮件。'
        },
        {
            id: 'official-feishu-cn',
            name: '飞书 MCP',
            presetName: '飞书',
            url: '',
            tokenUrl: 'https://open.feishu.cn/document/uAjLw4CM/ukTMukTMukTM/mcp_integration/mcp_introduction',
            transport: 'streamable-http',
            headers: [],
            enabled: true,
            builtIn: true,
            authHint: '需在飞书开放平台创建专属 MCP 服务链接，再粘贴到服务器地址。'
        }
    ];

    const SVGS = {
        edit: `<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>`,
        checkCircle: `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>`,
        circle: `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle></svg>`,
        minus: `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="5" y1="12" x2="19" y2="12"></line></svg>`,
        square: `<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect></svg>`,
        closeSmall: `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>`,
        searchSmall: `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>`,
        starSolid: `<svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" stroke-width="1" stroke-linejoin="round" stroke-linecap="round"><path d="M12 2l2.4 7.4h7.6l-6 4.6 2.3 7.4-6.3-4.8-6.3 4.8 2.3-7.4-6-4.6h7.6z"/></svg>`,
        file: `<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline></svg>`,
        search: `<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>`,
        terminal: `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" id="Terminal-Fill--Streamline-Rounded-Fill-Material" height="24" width="24"><path fill="currentColor" d="M3.5 20c-0.4 0 -0.75 -0.15 -1.05 -0.45 -0.3 -0.3 -0.45 -0.65 -0.45 -1.05V5.5c0 -0.4 0.15 -0.75 0.45 -1.05C2.75 4.15 3.1 4 3.5 4h17c0.4 0 0.75 0.15 1.05 0.45 0.3 0.3 0.45 0.65 0.45 1.05v13c0 0.4 -0.15 0.75 -0.45 1.05 -0.3 0.3 -0.65 0.45 -1.05 0.45H3.5Zm0 -1.5h17V7.6H3.5V18.5Zm5.525 -5.45 -2.075 -2.075c-0.15 -0.15 -0.22085 -0.325 -0.2125 -0.525 0.00835 -0.2 0.0875 -0.375 0.2375 -0.525 0.15 -0.15 0.325 -0.225 0.525 -0.225s0.375 0.075 0.525 0.225l2.6 2.6c0.15 0.15 0.225 0.325 0.225 0.525s-0.075 0.375 -0.225 0.525l-2.6 2.6c-0.15 0.15 -0.325 0.225 -0.525 0.225s-0.375 -0.075 -0.525 -0.225c-0.15 -0.15 -0.225 -0.325 -0.225 -0.525s0.075 -0.375 0.225 -0.525l2.05 -2.075ZM13 16.8c-0.21665 0 -0.39585 -0.07085 -0.5375 -0.2125s-0.2125 -0.32085 -0.2125 -0.5375c0 -0.21665 0.07085 -0.39585 0.2125 -0.5375S12.78335 15.3 13 15.3h4c0.21665 0 0.39585 0.07085 0.5375 0.2125s0.2125 0.32085 0.2125 0.5375c0 0.21665 -0.07085 0.39585 -0.2125 0.5375s-0.32085 0.2125 -0.5375 0.2125h-4Z" stroke-width="0.5"></path></svg>`
    };

    const escapeHtml = (value) => String(value == null ? '' : value).replace(/[&<>"']/g, char => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[char]);
    const newId = () => crypto.randomUUID ? crypto.randomUUID() : 'mcp-' + Date.now() + '-' + Math.random().toString(16).slice(2);
    const normalizeHeaders = (value) => Array.isArray(value) ? value.map(header => ({ key: String(header?.key || '').trim(), value: String(header?.value || '') })).filter(header => header.key) : [];
    const normalizeItem = (item = {}) => ({ id: String(item.id || newId()), name: String(item.name || '').trim(), url: String(item.url || '').trim(), tokenUrl: String(item.tokenUrl || '').trim(), transport: item.transport === 'sse' ? 'sse' : 'streamable-http', headers: normalizeHeaders(item.headers), enabled: item.enabled !== false, updatedAt: Number(item.updatedAt) || Date.now() });
    const officialTokenUrlFor = (url) => {
        const value = String(url || '').trim().replace(/\/+$/, '');
        if (value === 'https://mcp.mcd.cn') return 'https://open.mcd.cn/mcp';
        if (value === 'https://gwmcp.lkcoffee.com/order/user/mcp') return 'https://open.lkcoffee.com/mcp';
        if (value === 'https://mcp.amap.com/mcp?key=') return 'https://lbs.amap.com/api/mcp-server/create-project-and-key';
        if (value === 'https://ai.todoist.net/mcp') return 'https://todoist.com/help/articles/use-ai-tools-with-todoist-T4dtedhkH';
        if (value === 'https://mcp.notion.com/mcp') return 'https://developers.notion.com/docs/mcp';
        if (value === 'https://calendarmcp.googleapis.com/mcp/v1') return 'https://developers.google.com/workspace/calendar/api/guides/configure-mcp-server';
        if (value === 'https://gmailmcp.googleapis.com/mcp/v1') return 'https://developers.google.com/workspace/gmail/api/reference/mcp';
        return '';
    };
    const normalizePreset = (item = {}) => ({ ...normalizeItem(item), presetName: String(item.presetName || item.name || '').trim(), builtIn: item.builtIn === true, authHint: String(item.authHint || '').trim(), tokenUrl: String(item.tokenUrl || officialTokenUrlFor(item.url)).trim() });
    const mergePresets = (storedPresets) => {
        const merged = BUILT_IN_PRESETS.map(normalizePreset);
        const ids = new Set(merged.map(item => item.id));
        storedPresets.map(normalizePreset).filter(item => item.presetName && !ids.has(item.id)).forEach(item => { ids.add(item.id); merged.push(item); });
        return merged;
    };
    const normalizeData = (value) => ({ version: 1, configurations: Array.isArray(value?.configurations) ? value.configurations.map(normalizeItem) : [], presets: mergePresets(Array.isArray(value?.presets) ? value.presets : []) });
    const looksLikeToken = (value) => {
        const text = String(value || '').trim();
        return text.length >= 12 && !/\s/.test(text) && !/^Bearer\s+/i.test(text);
    };
    async function fillPresetToken(headers) {
        if (!navigator.clipboard?.readText) return headers;
        try {
            const text = (await navigator.clipboard.readText()).trim();
            if (!looksLikeToken(text)) return headers;
            return headers.map(header => header.key.toLowerCase() === 'authorization' && header.value.trim().toLowerCase() === 'bearer' ? { ...header, value: `Bearer ${text}` } : header);
        } catch (_) {
            return headers;
        }
    }
    async function confirmMcpDelete(message) {
        if (typeof showCustomConfirm === 'function') return showCustomConfirm('删除确认', message, '删除', true);
        return Promise.resolve(window.confirm(message));
    }
    function renderHeaderRow(header = {}) {
        const key = String(header.key || '').trim();
        const value = String(header.value || '');
        const isBearerAuth = key.toLowerCase() === 'authorization' && /^Bearer(?:\s|$)/i.test(value.trim());
        if (isBearerAuth) {
            const token = value.replace(/^Bearer\s*/i, '').trim();
            return `<div class="header-row auth-token-row" data-auth-row><input class="original-input auth-header-key" data-header-key value="Authorization" readonly aria-label="Authorization Header"><label class="auth-token-input"><span>Bearer</span><input data-auth-token placeholder="粘贴或输入 Token" value="${escapeHtml(token)}" autocomplete="off" autocapitalize="off" spellcheck="false"></label><button type="button" class="btn-token-paste" data-action="paste-auth-token">粘贴</button><button type="button" class="btn-remove" data-action="remove-header" aria-label="删除请求头"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><line x1="5" y1="12" x2="19" y2="12"></line></svg></button></div>`;
        }
        return `<div class="header-row"><input class="original-input" data-header-key placeholder="Header 名称" value="${escapeHtml(key)}"><input class="original-input" data-header-value placeholder="Header 值" value="${escapeHtml(value)}"><button type="button" class="btn-remove" data-action="remove-header" aria-label="删除请求头"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><line x1="5" y1="12" x2="19" y2="12"></line></svg></button></div>`;
    }

    function useRecord(mode, value) {
        return new Promise((resolve, reject) => {
            const request = indexedDB.open(DB_NAME);
            request.onerror = () => reject(request.error || new Error('无法打开本地数据'));
            request.onsuccess = () => {
                const database = request.result;
                if (!database.objectStoreNames.contains(STORE_NAME)) { database.close(); resolve(null); return; }
                const transaction = database.transaction(STORE_NAME, mode === 'read' ? 'readonly' : 'readwrite');
                const store = transaction.objectStore(STORE_NAME);
                if (mode === 'read') {
                    const getRequest = store.get(STORE_ID);
                    getRequest.onsuccess = () => { database.close(); resolve(getRequest.result?.data || null); };
                    getRequest.onerror = () => { database.close(); reject(getRequest.error || new Error('无法读取本地数据')); };
                } else {
                    store.put({ id: STORE_ID, data: value });
                    transaction.oncomplete = () => {
                        database.close();
                        if (typeof window.triggerAutoLocalBackup === 'function') window.triggerAutoLocalBackup();
                        resolve();
                    };
                    transaction.onerror = () => { database.close(); reject(transaction.error || new Error('无法保存本地数据')); };
                }
            };
        });
    }
    const readStore = () => useRecord('read');
    const writeStore = () => useRecord('write', data);
    const mark = () => '<span class="mcp-app-mark" aria-hidden="true">M</span>';

    function notice(message, error = false) {
        const target = root?.querySelector('[data-mcp-notice]');
        if (!target) return;
        target.textContent = message; target.classList.toggle('is-error', error); target.classList.add('is-visible');
        clearTimeout(notice.timer); notice.timer = setTimeout(() => target.classList.remove('is-visible'), 2400);
    }
    function renderList() {
        const filterText = currentSearchText.toLowerCase();
        const isConfigs = activeTab === 'configs';
        
        const filteredConfigs = data.configurations.filter(item => (item.name || '').toLowerCase().includes(filterText) || (item.url || '').toLowerCase().includes(filterText));
        const filteredPresets = data.presets.filter(item => (item.presetName || '').toLowerCase().includes(filterText) || (item.url || '').toLowerCase().includes(filterText));

        const configurationsHtml = filteredConfigs.map(item => `
            <div class="mcp-list-item ${isEditMode && selectedIds.has(item.id) ? 'is-selected' : ''}" data-action="${isEditMode ? 'toggle-select' : 'edit'}" data-id="${escapeHtml(item.id)}">
                ${isEditMode ? `<div class="mcp-item-checkbox">${selectedIds.has(item.id) ? SVGS.checkCircle : SVGS.circle}</div>` : ''}
                <div class="mcp-item-icon">${SVGS.terminal}</div>
                <div class="mcp-item-content">
                    <div class="mcp-item-title">${escapeHtml(item.name || '未命名 MCP')}</div>
                    <div class="mcp-item-sub">${escapeHtml(item.transport)}</div>
                </div>
                ${!isEditMode ? `<button class="mcp-view-btn" type="button" data-action="edit" data-id="${escapeHtml(item.id)}">
                    <span class="mcp-view-dot ${item.enabled ? 'active' : ''}"></span>连接
                </button>` : ''}
            </div>
        `).join('');

        const presetsHtml = filteredPresets.map(item => `
            <div class="mcp-list-item ${isEditMode && selectedIds.has(item.id) ? 'is-selected' : ''}" data-action="${isEditMode ? (item.builtIn ? 'noop' : 'toggle-select') : 'use-preset'}" data-id="${escapeHtml(item.id)}">
                ${isEditMode ? `<div class="mcp-item-checkbox">${item.builtIn ? SVGS.circle : (selectedIds.has(item.id) ? SVGS.checkCircle : SVGS.circle)}</div>` : ''}
                <div class="mcp-item-icon">${SVGS.terminal}</div>
                <div class="mcp-item-content">
                    <div class="mcp-item-title">${escapeHtml(item.presetName)}</div>
                    <div class="mcp-item-sub">${escapeHtml(item.authHint || item.url)}</div>
                </div>
                ${!isEditMode && !item.builtIn ? `<button class="mcp-view-btn" type="button" data-action="delete-preset" data-id="${escapeHtml(item.id)}" style="color:#ff3b30; background:rgba(255,59,48,.10);">
                    删除
                </button>` : ''}
            </div>
        `).join('');

        const currentListHtml = isConfigs ? configurationsHtml : presetsHtml;
        const emptyMessage = isConfigs ? '尚未添加 MCP 配置' : '将常用配置保存为预设';
        const currentCount = isConfigs ? filteredConfigs.length : filteredPresets.length;

        return `
        <div class="mcp-app-container" id="mcpAppUI" style="background: #ffffff; padding-bottom: 0;">
            <header class="merged-header">
                <div class="tab-row">
                    <div class="${isConfigs ? 'active-tab' : 'inactive-tab'}" data-action="switch-tab" data-tab="configs">
                        <span class="tab-title">我的配置</span>
                    </div>
                    <div class="${!isConfigs ? 'active-tab' : 'inactive-tab'}" data-action="switch-tab" data-tab="presets">
                        <span class="tab-title">MCP 预设</span>
                    </div>
                    <div class="tab-actions">
                        <div class="window-controls">
                            <span data-action="close">${SVGS.minus}</span>
                            <span data-action="close">${SVGS.square}</span>
                            <span data-action="close">${SVGS.closeSmall}</span>
                        </div>
                    </div>
                </div>
                <div class="search-row">
                    <div class="search-input-container">
                        ${SVGS.searchSmall}
                        <input type="text" id="mcpSearchInput" placeholder="Search MCP..." value="${escapeHtml(currentSearchText)}">
                        <div class="star-icon">${SVGS.starSolid}</div>
                    </div>
                </div>
            </header>
            <main class="mcp-main-scroll">
                <p class="mcp-notice" data-mcp-notice role="status" style="position: absolute; top: 110px; left: 50%; transform: translateX(-50%); background: rgba(0,0,0,0.75); color: #fff; padding: 10px 20px; border-radius: 20px; z-index: 999; height: auto;"></p>
                <div class="mcp-section-title" style="padding: 16px 20px 8px;">
                    <span>${isConfigs ? '我的配置' : 'MCP 预设'}</span>
                    <span>${currentCount}</span>
                </div>
                ${currentListHtml || `<div style="padding: 40px 20px; text-align: center; color: #8e8e93; font-size: 14px;">${emptyMessage}</div>`}
            </main>
            <div class="mcp-bottom-nav">
                ${isEditMode ? `
                    <button class="mcp-capsule-btn" type="button" data-action="cancel-edit" style="flex: 1; background: rgba(255,255,255,0.9);">取消</button>
                    <button class="mcp-capsule-btn" type="button" data-action="delete-selected" style="flex: 1; background: #ff3b30; color: #fff; border: none;" ${selectedIds.size === 0 ? 'disabled' : ''}>删除 (${selectedIds.size})</button>
                ` : `
                    <button class="mcp-circle-btn" type="button">${SVGS.file}</button>
                    <button class="mcp-capsule-btn" type="button" data-action="new">添加 MCP</button>
                    <button class="mcp-circle-btn" type="button" data-action="toggle-edit-mode">${SVGS.edit}</button>
                `}
            </div>
        </div>`;
    }
    function renderEditor(item) {
        const current = item || { name: '', url: '', transport: 'streamable-http', headers: [], enabled: true };
        const headers = (current.headers.length ? current.headers : [{ key: '', value: '' }]).map(renderHeaderRow).join('');
        const tokenUrl = current.tokenUrl || officialTokenUrlFor(current.url);
        return `<div class="mcp-app-container" id="mcpAppUI" style="background: #f0f0f5; display: flex; flex-direction: column; height: 100vh; padding-bottom: 0;"><header class="editor-window-header"><div class="editor-tab-row"><div class="editor-tab-left"><button class="circle-back-btn" type="button" data-action="back"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="6 9 12 15 18 9"></polyline></svg></button><div class="editor-active-tab"><div class="status-dot"></div><span>${item ? '编辑配置' : '添加配置'}</span></div></div><button class="save-btn" type="button" data-action="save"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>保存</button></div><div class="editor-toolbar"><span class="editor-toolbar-title">MCP CONFIGURATION</span></div></header><main class="editor-main"><p class="mcp-notice" data-mcp-notice role="status" style="position: absolute; top: 110px; left: 50%; transform: translateX(-50%); background: rgba(0,0,0,0.75); color: #fff; padding: 10px 20px; border-radius: 20px; z-index: 999; height: auto;"></p><form class="mcp-editor-form" data-mcp-form><div class="config-card"><div class="card-header"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="16" x2="12" y2="12"></line><line x1="12" y1="8" x2="12.01" y2="8"></line></svg>基础信息</div><label class="mcp-field"><span>配置名称</span><input class="original-input" name="name" maxlength="60" required placeholder="例如：我的记忆服务" value="${escapeHtml(current.name)}"></label><div class="mcp-field"><span class="mcp-field-title">服务器地址${tokenUrl ? `<button class="btn-token-site" type="button" data-action="open-token-site" data-url="${escapeHtml(tokenUrl)}" aria-label="打开官网获取 Token"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="M15 7h2a5 5 0 0 1 0 10h-2"></path><path d="M9 17H7A5 5 0 0 1 7 7h2"></path><line x1="8" y1="12" x2="16" y2="12"></line></svg></button><small class="mcp-title-note">获取 Token</small>` : ''}</span><input class="original-input" name="url" type="url" inputmode="url" required placeholder="https://example.com/mcp" value="${escapeHtml(current.url)}"></div></div><div class="config-card"><div class="card-header"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M18 8h1a4 4 0 0 1 0 8h-1"></path><path d="M2 8h16v9a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V8z"></path><line x1="6" y1="1" x2="6" y2="4"></line><line x1="10" y1="1" x2="10" y2="4"></line><line x1="14" y1="1" x2="14" y2="4"></line></svg>连接设置</div><div class="mcp-field"><span>传输方式</span><div class="mcp-segmented"><label><input type="radio" name="transport" value="streamable-http" ${current.transport !== 'sse' ? 'checked' : ''}><span>HTTP</span></label><label><input type="radio" name="transport" value="sse" ${current.transport === 'sse' ? 'checked' : ''}><span>SSE</span></label></div></div><div class="mcp-field" style="margin-top: 20px;"><span>请求头 (Headers)</span><div data-header-list>${headers}</div><button class="btn-add-header" type="button" data-action="add-header"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>添加请求头</button></div></div><div class="config-card"><label class="mcp-switch-row"><span><strong>启用此配置</strong><small>保存后可随时关闭</small></span><input name="enabled" type="checkbox" ${current.enabled ? 'checked' : ''}><i></i></label></div></form>${item ? `<div class="mcp-editor-actions"><button class="action-btn" type="button" data-action="save-preset"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"></path><polyline points="17 21 17 13 7 13 7 21"></polyline><polyline points="7 3 7 8 15 8"></polyline></svg>存为预设</button><button class="action-btn danger" type="button" data-action="delete"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>删除配置</button></div>` : ''}</main></div>`;
    }
    function render() { if (!root) return; root.innerHTML = view === 'editor' ? renderEditor(data.configurations.find(item => item.id === editingId)) : renderList(); bindEvents(); }
    function itemFromForm() {
        const form = root.querySelector('[data-mcp-form]'); const name = form.elements.name.value.trim(); const url = form.elements.url.value.trim();
        if (!name || !url) throw new Error('请填写名称和服务器地址');
        let parsed; try { parsed = new URL(url); } catch (_) { throw new Error('请输入有效的服务器地址'); }
        if (!/^https?:$/.test(parsed.protocol)) throw new Error('服务器地址必须使用 HTTP 或 HTTPS');
        const existing = data.configurations.find(item => item.id === editingId) || {};
        return normalizeItem({ id: editingId || newId(), name, url, tokenUrl: existing.tokenUrl || officialTokenUrlFor(url), transport: form.elements.transport.value, enabled: form.elements.enabled.checked, headers: Array.from(form.querySelectorAll('.header-row')).map(row => {
            if (row.hasAttribute('data-auth-row')) {
                const token = row.querySelector('[data-auth-token]')?.value.trim() || '';
                return { key: 'Authorization', value: token ? `Bearer ${token}` : 'Bearer ' };
            }
            return { key: row.querySelector('[data-header-key]')?.value || '', value: row.querySelector('[data-header-value]')?.value || '' };
        }), updatedAt: Date.now() });
    }
    async function saveConfiguration() { const item = itemFromForm(); const index = data.configurations.findIndex(config => config.id === item.id); index < 0 ? data.configurations.push(item) : data.configurations[index] = item; await writeStore(); view = 'list'; editingId = null; render(); notice('配置已保存到本机'); }
    async function savePreset() { const item = itemFromForm(); const presetName = prompt('预设名称', item.name); if (presetName === null) return; if (!presetName.trim()) throw new Error('请输入预设名称'); data.presets.push({ ...item, id: newId(), presetName: presetName.trim() }); await writeStore(); notice('已保存为 MCP 预设'); }
    function bindEvents() { 
        root.querySelectorAll('[data-action]').forEach(control => control.addEventListener('click', async event => { 
            const action = control.dataset.action; 
            if (action === 'delete-preset' || action === 'edit') { event.preventDefault(); event.stopPropagation(); }
            try {
                if (action === 'close') close(); 
                else if (action === 'back') { view = 'list'; editingId = null; render(); } 
                else if (action === 'new') { view = 'editor'; editingId = null; render(); } 
                else if (action === 'edit') { view = 'editor'; editingId = control.dataset.id; render(); } 
                else if (action === 'add-header') { root.querySelector('[data-header-list]').insertAdjacentHTML('beforeend', '<div class="header-row"><input class="original-input" data-header-key placeholder="Header 名称"><input class="original-input" data-header-value placeholder="Header 值"><button type="button" class="btn-remove" data-action="remove-header" aria-label="删除请求头"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><line x1="5" y1="12" x2="19" y2="12"></line></svg></button></div>'); bindEvents(); } 
                else if (action === 'remove-header') control.closest('.header-row').remove(); 
                else if (action === 'paste-auth-token') { try { const text = (await navigator.clipboard?.readText?.() || '').trim(); const input = control.closest('.header-row')?.querySelector('[data-auth-token]'); if (input && text) input.value = text.replace(/^Bearer\s+/i, ''); } catch (_) { notice('无法读取剪贴板，请手动输入 Token', true); } }
                else if (action === 'open-token-site') { window.open(control.dataset.url, '_blank', 'noopener,noreferrer'); }
                else if (action === 'save') await saveConfiguration(); 
                else if (action === 'save-preset') await savePreset(); 
                else if (action === 'delete') { if (!await confirmMcpDelete('删除这项 MCP 配置？')) return; data.configurations = data.configurations.filter(item => item.id !== editingId); await writeStore(); view = 'list'; editingId = null; render(); notice('配置已删除'); }
                else if (action === 'delete-preset') { const preset = data.presets.find(item => item.id === control.dataset.id); if (!preset || preset.builtIn) return; if (!await confirmMcpDelete('删除这项 MCP 预设？')) return; data.presets = data.presets.filter(item => item.id !== control.dataset.id); await writeStore(); render(); notice('预设已删除'); }
                else if (action === 'use-preset') { const preset = data.presets.find(item => item.id === control.dataset.id); if (!preset) return; const headers = await fillPresetToken(preset.headers); const copy = normalizeItem({ ...preset, id: newId(), name: preset.name || preset.presetName, headers, updatedAt: Date.now() }); data.configurations.push(copy); await writeStore(); view = 'editor'; editingId = copy.id; render(); notice(headers.some(header => /^Bearer\s+\S+/i.test(header.value)) ? '已新建配置并填入授权' : '已新建配置，请补充地址或授权信息'); }
                else if (action === 'switch-tab') { activeTab = control.dataset.tab; isEditMode = false; selectedIds.clear(); render(); }
                else if (action === 'toggle-edit-mode') { isEditMode = true; selectedIds.clear(); render(); }
                else if (action === 'cancel-edit') { isEditMode = false; selectedIds.clear(); render(); }
                else if (action === 'toggle-select') {
                    const id = control.dataset.id;
                    if (selectedIds.has(id)) selectedIds.delete(id);
                    else selectedIds.add(id);
                    render();
                }
                else if (action === 'delete-selected') {
                    if (selectedIds.size === 0) return;
                    if (!await confirmMcpDelete(`确定要删除选中的 ${selectedIds.size} 项吗？`)) return;
                    if (activeTab === 'configs') {
                        data.configurations = data.configurations.filter(item => !selectedIds.has(item.id));
                    } else {
                        data.presets = data.presets.filter(item => item.builtIn || !selectedIds.has(item.id));
                    }
                    await writeStore();
                    isEditMode = false;
                    selectedIds.clear();
                    render();
                    notice('已删除选中项');
                }
            } catch (error) { console.error('MCP app action failed:', error); notice(error.message || '操作未完成', true); } 
        })); 
        
        const searchInput = root.querySelector('#mcpSearchInput');
        if (searchInput) {
            searchInput.addEventListener('input', (e) => {
                currentSearchText = e.target.value;
                render();
                const newSearchInput = root.querySelector('#mcpSearchInput');
                if (newSearchInput) {
                    newSearchInput.focus();
                    newSearchInput.setSelectionRange(currentSearchText.length, currentSearchText.length);
                }
            });
        }
    }
    async function init() { if (root) return; root = document.createElement('div'); root.id = 'mcpAppHost'; (document.querySelector('.iphone') || document.body).appendChild(root); try { data = normalizeData(await readStore()); } catch (error) { console.error('MCP app load failed:', error); } render(); }
    async function open() {
        await init();
        view = 'list';
        editingId = null;
        activeTab = 'configs';
        currentSearchText = '';
        isEditMode = false;
        selectedIds.clear();
        root.style.display = 'block';
        render();
    }
    function close() { if (root) root.style.display = 'none'; }
    window.McpApp = { init, open, close };
}
