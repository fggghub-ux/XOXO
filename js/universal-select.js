    // --- 通用弹窗静态置顶逻辑 (无运行时重绘，彻底解决闪烁与层级错乱) ---
    function syncOverlayToActiveView(overlay) {
        if (!overlay) return;
        const iphone = document.querySelector('.iphone') || document.body;
        if (overlay.parentElement !== iphone || overlay !== iphone.lastElementChild) {
            iphone.appendChild(overlay);
        }
    }
    window.syncOverlayToActiveView = syncOverlayToActiveView;

    // 页面初始化时单次静默归拢容器，运行期间绝不触碰正在运行的 App
    function initGlobalAppContainers() {
        const iphone = document.querySelector('.iphone');
        if (!iphone) return;
        document.querySelectorAll('body > [class*="-container"], body > [id$="AppUI"], body > [id$="UI"]').forEach(app => {
            if (app !== iphone && app.parentElement === document.body) {
                iphone.appendChild(app);
            }
        });
        ['#customDialogOverlay', '#customPromptOverlay', '#univSelOverlay', '#apiErrorModalOverlay', '#iosToast'].forEach(id => {
            const el = document.querySelector(id);
            if (el && el.parentElement !== iphone) {
                iphone.appendChild(el);
            }
        });
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initGlobalAppContainers);
    } else {
        initGlobalAppContainers();
    }
    setTimeout(initGlobalAppContainers, 100);

    // --- 通用选择弹窗逻辑 ---
    let univSelCallback = null;

    function openUniversalSelect(options) {
        const overlay = document.getElementById('univSelOverlay');
        if (overlay) {
            overlay.dataset.univSelHost = options.hostSelector || '';
            syncOverlayToActiveView(overlay);
        }


        if (overlay) syncOverlayToActiveView(overlay);

        // options: { title, items: [{label, value}], currentValue, searchable, onSelect }
        const titleEl = document.getElementById('univSelTitle');
        if (titleEl) titleEl.innerText = options.title;
        
        const searchWrap = document.getElementById('univSelSearchWrap');
        const searchInput = document.getElementById('univSelSearchInput');
        
        if (options.searchable) {
            searchWrap.style.display = 'block';
            searchInput.value = '';
        } else {
            searchWrap.style.display = 'none';
        }

        window.univSelCurrentItems = options.items;
        window.univSelCurrentValue = options.currentValue;
        univSelCallback = options.onSelect;

        renderUniversalSelectList('');
        if (overlay) overlay.classList.add('show');
    }

    function closeUniversalSelect() {
        const overlay = document.getElementById('univSelOverlay');
        if (overlay) {
            overlay.classList.remove('show');
            delete overlay.dataset.univSelHost;
        }
    }

    function renderUniversalSelectList(query) {
        const container = document.getElementById('univSelListContainer');
        container.innerHTML = '';
        
        const filtered = window.univSelCurrentItems.filter(item => 
            item.label.toLowerCase().includes(query.toLowerCase()) || 
            item.value.toLowerCase().includes(query.toLowerCase())
        );
        
        if (filtered.length === 0) {
            container.innerHTML = '<div style="text-align:center; color:#8e8e93; padding: 40px 0; font-size: 14px;">无匹配项</div>';
            document.getElementById('univSelSaveBtn').classList.add('disabled');
            return;
        }

        container.replaceChildren();
        filtered.forEach(item => {
            const isSelected = window.univSelCurrentValue === item.value ? 'selected' : '';
            const card = document.createElement('div');
            card.className = `univ-sel-card ${isSelected}`;
            card.addEventListener('click', () => selectUniversalItem(card, item.value));

            const radio = document.createElement('div');
            radio.className = 'univ-sel-radio';
            radio.innerHTML = '<svg viewBox="0 0 24 24"><polyline points="20 6 9 17 4 12"></polyline></svg>';
            const info = document.createElement('div');
            info.className = 'univ-sel-info';
            const name = document.createElement('div');
            name.className = 'univ-sel-name';
            name.textContent = item.label;
            info.appendChild(name);
            card.append(radio, info);
            container.appendChild(card);
        });
        
        if (window.univSelCurrentValue !== null && window.univSelCurrentValue !== undefined && window.univSelCurrentValue !== '') {
            document.getElementById('univSelSaveBtn').classList.remove('disabled');
        } else {
            document.getElementById('univSelSaveBtn').classList.add('disabled');
        }
    }

    function handleUniversalSearch() {
        const query = document.getElementById('univSelSearchInput').value.trim();
        renderUniversalSelectList(query);
    }

    function selectUniversalItem(element, value) {
        const cards = document.querySelectorAll('.univ-sel-card');
        cards.forEach(card => card.classList.remove('selected'));
        element.classList.add('selected');
        window.univSelCurrentValue = value;
        document.getElementById('univSelSaveBtn').classList.remove('disabled');
    }

    function saveUniversalSelection() {
        if (window.univSelCurrentValue !== null && window.univSelCurrentValue !== undefined && window.univSelCurrentValue !== '') {
            if (univSelCallback) univSelCallback(window.univSelCurrentValue);
            closeUniversalSelect();
        }
    }

    // --- 各个模块的触发函数 ---
    function openApiModelSelect(mode) {
        if (typeof fetchedModelsCache === 'undefined' || fetchedModelsCache.length === 0) {
            showToast('请先点击“拉取模型”获取列表');
            return;
        }
        const inputEl = document.getElementById(mode === 'add' ? 'api-add-model' : 'api-edit-model');
        const items = fetchedModelsCache.map(m => ({ label: m, value: m }));
        openUniversalSelect({
            title: '选择模型',
            items: items,
            currentValue: inputEl.value,
            searchable: true,
            onSelect: (val) => {
                inputEl.value = val;
            }
        });
    }

    function openAutoBackupModeSelect() {
        const textEl = document.getElementById('autoBackupModeText');
        const items = [
            { label: '每次修改时', value: 'action' },
            { label: '间隔时间备份', value: 'interval' },
            { label: '定时备份', value: 'scheduled' }
        ];
        openUniversalSelect({
            title: '备份模式',
            items: items,
            currentValue: textEl.getAttribute('data-value') || 'action',
            searchable: false,
            // The local-drive page scrolls and animates independently. Host the
            // sheet in the stable settings container so it always covers the phone.
            hostSelector: '#settingsAppUI',
            onSelect: (val) => {
                textEl.setAttribute('data-value', val);
                textEl.innerText = items.find(i => i.value === val).label;
                changeBackupMode();
            }
        });
    }

    function openBackupIntervalUnitSelect() {
        const textEl = document.getElementById('backupIntervalUnitText');
        const items = [
            { label: '分钟', value: '60000' },
            { label: '小时', value: '3600000' }
        ];
        openUniversalSelect({
            title: '间隔单位',
            items: items,
            currentValue: textEl.getAttribute('data-value') || '60000',
            searchable: false,
            hostSelector: '#settingsAppUI',
            onSelect: (val) => {
                textEl.setAttribute('data-value', val);
                textEl.innerText = items.find(i => i.value === val).label;
                updateBackupSettings();
            }
        });
    }

    function openWbPositionSelect() {
        const textEl = document.getElementById('wbPositionText');
        const items = [
            { label: '前置 (Before)', value: '前置 (Before)' },
            { label: '后置 (After)', value: '后置 (After)' },
            { label: '作者注释 (Author\'s Note)', value: '作者注释 (Author\'s Note)' }
        ];
        openUniversalSelect({
            title: '注入位置',
            items: items,
            currentValue: textEl.getAttribute('data-value') || '后置 (After)',
            searchable: false,
            onSelect: (val) => {
                textEl.setAttribute('data-value', val);
                textEl.innerText = val;
            }
        });
    }

    function openWcAvatarModeSelect() {
        const textEl = document.getElementById('wcAvatarDisplayModeText');
        const items = [
            { label: '全程显示', value: 'all' },
            { label: '首个显示', value: 'first' },
            { label: '末尾显示', value: 'last' }
        ];
        openUniversalSelect({
            title: '显示模式',
            items: items,
            currentValue: textEl.getAttribute('data-value') || 'all',
            searchable: false,
            onSelect: (val) => {
                textEl.setAttribute('data-value', val);
                textEl.innerText = items.find(i => i.value === val).label;
                wcApplyAvatarSettings();
            }
        });
    }

    function openWcBatchGroupSelect() {
        const textEl = document.getElementById('wcBatchGroupSelectText');
        let items = [];
        if (wcEmojiGroups.length === 0) {
            items.push({ label: '默认分组', value: 'new_default' });
        } else {
            items = wcEmojiGroups.map(g => ({ label: g.name, value: g.id }));
        }
        openUniversalSelect({
            title: '选择分组',
            items: items,
            currentValue: textEl.getAttribute('data-value'),
            searchable: true,
            onSelect: (val) => {
                textEl.setAttribute('data-value', val);
                textEl.innerText = items.find(i => i.value === val).label;
            }
        });
    }

if (typeof window.startTonghuajiApp === 'function') {
    window.startTonghuajiApp();
} else {
    initDB();
}
// ==========================================
// 注入全局 API 智能报错弹窗与全局通用弹窗置顶样式
// ==========================================
(() => {
    if (document.getElementById('apiErrorModalOverlay')) return;
    const html = `
    <style>
        /* 强制提升所有通用弹窗层级，防止被微信及子页面遮挡在桌面层 */
        #customDialogOverlay,
        #customAlertOverlay,
        #customPromptOverlay,
        #univSelOverlay,
        #apiErrorModalOverlay,
        .custom-dialog-overlay,
        .preset-modal-overlay,
        .univ-sel-overlay {
            position: absolute !important;
            top: 0 !important;
            left: 0 !important;
            right: 0 !important;
            bottom: 0 !important;
            width: 100% !important;
            height: 100% !important;
            z-index: 999999 !important;
        }
        .api-error-overlay {
            position: absolute; top: 0; left: 0; right: 0; bottom: 0;
            background: rgba(0, 0, 0, 0.4);
            display: flex; justify-content: center; align-items: center;
            z-index: 100000; opacity: 0; pointer-events: none;
            transition: opacity 0.25s ease;
        }
        .api-error-overlay.show { opacity: 1; pointer-events: auto; }
        .api-error-modal {
            background: rgba(255, 255, 255, 0.85); backdrop-filter: blur(30px) saturate(150%); -webkit-backdrop-filter: blur(30px) saturate(150%);
            width: 340px; border-radius: 24px; padding: 24px; border: 1px solid rgba(255,255,255,0.5);
            box-shadow: 0 20px 40px rgba(0,0,0,0.1);
            transform: scale(1.1); opacity: 0;
            transition: all 0.25s cubic-bezier(0.175, 0.885, 0.32, 1.275);
        }
        .api-error-overlay.show .api-error-modal { transform: scale(1); opacity: 1; }
        .api-error-header { text-align: center; margin-bottom: 20px; }
        .api-error-icon { font-size: 36px; margin-bottom: 8px; }
        .api-error-title { font-size: 19px; font-weight: 700; color: #000; }
        .api-error-suggestion-box { background: rgba(0,122,255,0.1); border-radius: 14px; padding: 14px; margin-bottom: 16px; text-align: left; }
        .api-error-suggestion-title { font-size: 13px; color: #007AFF; font-weight: 700; margin-bottom: 6px; display: flex; align-items: center; gap: 4px; }
        .api-error-suggestion-text { font-size: 14px; color: #000; line-height: 1.4; }
        .api-error-raw-box {
            background: rgba(255,255,255,0.6); border-radius: 8px; padding: 10px;
            font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
            font-size: 12px; color: #333; word-break: break-all;
            max-height: 120px; overflow-y: auto; text-align: left;
            border: 1px solid rgba(0,0,0,0.05); margin-bottom: 16px;
        }
        .api-error-actions { display: flex; gap: 12px; }
        .api-error-btn { flex: 1; padding: 14px; border-radius: 14px; border: none; font-size: 16px; font-weight: 600; cursor: pointer; }
        .api-error-btn.cancel { background: #E5E5EA; color: #000; }
        .api-error-btn.primary { background: #007AFF; color: #fff; box-shadow: 0 4px 12px rgba(0,122,255,0.3); }
    </style>
    <div class="api-error-overlay" id="apiErrorModalOverlay">
        <div class="api-error-modal" onclick="event.stopPropagation()">
            <div class="api-error-header">
                <div class="api-error-icon" id="apiErrorModalIcon">🔌</div>
                <div class="api-error-title" id="apiErrorModalTitle">网络连接中断</div>
            </div>
            <div class="api-error-suggestion-box">
                <div class="api-error-suggestion-title">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="16" x2="12" y2="12"></line><line x1="12" y1="8" x2="12.01" y2="8"></line></svg>
                    处理建议
                </div>
                <div class="api-error-suggestion-text" id="apiErrorModalDesc"></div>
            </div>
            <div class="api-error-raw-box" id="apiErrorModalRaw"></div>
            <div class="api-error-actions">
                <button class="api-error-btn cancel" onclick="window.closeApiErrorModal()">关闭</button>
                <button class="api-error-btn primary" onclick="window.copyApiErrorText()">复制报错</button>
            </div>
        </div>
    </div>
    `;
    (document.querySelector('.iphone') || document.body).insertAdjacentHTML('beforeend', html);

    // 智能分析报错逻辑
    function analyzeApiError(errorText) {
        const e = String(errorText).toLowerCase();
        
        if (e.includes('400') || e.includes('422')) {
            return { icon: '⚠️', title: '参数或格式错误', desc: '检查messages是否正确、最后一条是否user、模型是否支持图片/tools/预填。' };
        }
        if (e.includes('401') || e.includes('403') || e.includes('402') || e.includes('forbidden') || e.includes('insufficient_quota')) {
            return { icon: '💳', title: '额度或权限问题', desc: '检查Key、Bearer、余额额度、模型权限；403也可能是额度不足或被封禁。' };
        }
        if (e.includes('404') || e.includes('no available')) {
            return { icon: '🔍', title: '找不到模型', desc: '核对模型名；如果提示No available channel，先换模型或联系站长。' };
        }
        if (e.includes('429') || e.includes('529') || e.includes('rate limit')) {
            return { icon: '⏳', title: '请求过快/上游限流', desc: '降低并发和频率，等1-5分钟再试；批量任务建议开重试和速配。' };
        }
        if (e.includes('504') || e.includes('524') || e.includes('522') || e.includes('timeout')) {
            return { icon: '⏱️', title: '响应超时', desc: '减少上下文、图片/文件体积和max_tokens；长任务分段请求。' };
        }
        if (e.includes('500') || e.includes('502') || e.includes('503') || e.includes('internal server error')) {
            return { icon: '🌩️', title: '上游异常或服务繁忙', desc: '通常不是Key问题。稍后重试，或临时切换模型/其他线路。' };
        }
        if (e.includes('socket hung up') || e.includes('disconnected')) {
            return { icon: '🔌', title: '网络连接中断', desc: '网络问题/破限没成功(重roll，更改上下文敏感词/换预设)或换ip。' };
        }
        if (e.includes('econnreset')) {
            return { icon: '🔌', title: '连接被重置', desc: '网络问题，魔法开全局模式。' };
        }
        if (e.includes('error')) {
            return { icon: '❓', title: '请求异常', desc: '大概率是网络问题，请检查代理或稍后重试。' };
        }
        
        return { icon: '❓', title: '未知异常', desc: '发生了一些未知的问题，请查看下方详细报错信息，或检查网络连接。' };
    }

    window.showApiErrorModal = function(rawError) {
        const analysis = analyzeApiError(rawError);
        document.getElementById('apiErrorModalIcon').innerText = analysis.icon;
        document.getElementById('apiErrorModalTitle').innerText = analysis.title;
        document.getElementById('apiErrorModalDesc').innerText = analysis.desc;
        document.getElementById('apiErrorModalRaw').innerText = rawError;
        document.getElementById('apiErrorModalOverlay').classList.add('show');
    };

    window.closeApiErrorModal = function() {
        document.getElementById('apiErrorModalOverlay').classList.remove('show');
    };

    window.copyApiErrorText = function() {
        const text = document.getElementById('apiErrorModalRaw').innerText;
        if (navigator.clipboard && window.isSecureContext) {
            navigator.clipboard.writeText(text).then(() => {
                if (typeof showToast === 'function') showToast('报错信息已复制');
            });
        } else {
            const textArea = document.createElement("textarea");
            textArea.value = text;
            document.body.appendChild(textArea);
            textArea.select();
            try { document.execCommand('copy'); if (typeof showToast === 'function') showToast('报错信息已复制'); } catch (err) {}
            document.body.removeChild(textArea);
        }
    };
})();
