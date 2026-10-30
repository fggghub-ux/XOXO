{
    const widgetPickerHTML = `    <div class="widget-picker-overlay" id="widgetPickerOverlay" onclick="closeWidgetPicker()">
        <div class="widget-picker-sheet" onclick="event.stopPropagation()">
            <div class="widget-picker-handle"></div>
            <div class="widget-picker-header">
                <div class="widget-picker-cancel" onclick="closeWidgetPicker()">取消</div>
                <h2>添加小组件</h2>
                <div style="width: 40px;"></div> <!-- 占位，保持标题居中 -->
            </div>
            <div class="widget-picker-tabs-container">
                <div class="widget-picker-tabs">
                    <div class="widget-picker-tab active" onclick="switchWidgetPickerTab('all', this)">全部</div>
                    <div class="widget-picker-tab" onclick="switchWidgetPickerTab('large', this)">大尺寸</div>
                    <div class="widget-picker-tab" onclick="switchWidgetPickerTab('medium', this)">中尺寸</div>
                    <div class="widget-picker-tab" onclick="switchWidgetPickerTab('small', this)">小尺寸</div>
                    <div class="widget-picker-tab" onclick="switchWidgetPickerTab('custom', this)">自定义</div>
                </div>
            </div>
            <div class="widget-picker-list" id="widgetPickerList">
                <!-- 动态渲染卡片 -->
            </div>
        </div>
    </div>`;
    document.body.insertAdjacentHTML('beforeend', widgetPickerHTML);
        function formatWidgetSizeLabel(widget) {
            if (widget.width && widget.height) {
                return widget.width + '×' + widget.height;
            }
            if (widget.presetSize) {
                return widget.presetSize;
            }
            return '1×1';
        }
        window.formatWidgetSizeLabel = formatWidgetSizeLabel;

        function handleWidgetPresetChange(radio) {
            if (radio.checked) {
                document.getElementById('widgetCustomSizeLabel').innerText = '自定义大小';
                document.getElementById('widgetCustomSizeLabel').style.color = '#8e8e93';
                updateWidgetCodePreview();
            }
        }
        window.handleWidgetPresetChange = handleWidgetPresetChange;

        function openCustomSizePicker() {
            document.getElementById('customSizePicker').classList.add('show');
            const overlay = document.getElementById('widgetOverlay');
            overlay.style.display = 'block';
            overlay.style.zIndex = '350';
            const radios = document.querySelectorAll('input[name="widgetPresetSize"]');
            radios.forEach(r => { r.checked = false; });
        }
        window.openCustomSizePicker = openCustomSizePicker;

        function closeCustomSizePicker() {
            document.getElementById('customSizePicker').classList.remove('show');
            const editor = document.getElementById('widgetEditorModal');
            if (editor && editor.classList.contains('show')) {
                document.getElementById('widgetOverlay').style.zIndex = '250';
            } else {
                document.getElementById('widgetOverlay').style.display = 'none';
            }
        }
        window.closeCustomSizePicker = closeCustomSizePicker;

        function stepCustomSize(type, delta) {
            const el = document.getElementById(type === 'w' ? 'customW' : 'customH');
            let val = parseInt(el.innerText, 10) + delta;
            
            // ??????????????????????
            let maxCols = 4;
            let maxRows = 7;
            const grid = document.getElementById('desktopGrid');
            if (grid) {
                // ?? desktopGrid ????????? (????80+15px = 95px)
                const gridH = grid.clientHeight;
                if (gridH > 100) {
                    maxRows = Math.floor(gridH / 95) || 7;
                }
            }
            if (type === 'w' && val > maxCols) val = maxCols;
            if (type === 'w' && val < 1) val = 1;
            if (type === 'h' && val > maxRows) val = maxRows;
            if (type === 'h' && val < 1) val = 1;
            el.innerText = val;
        }
        window.stepCustomSize = stepCustomSize;

        function confirmCustomSize() {
            const w = document.getElementById('customW').innerText;
            const h = document.getElementById('customH').innerText;
            const label = document.getElementById('widgetCustomSizeLabel');
            label.innerText = w + ' × ' + h;
            label.style.color = '#000';
            updateWidgetCodePreview();
            closeCustomSizePicker();
        }
        window.confirmCustomSize = confirmCustomSize;

        function handleWidgetCustomSizeChange() {
            const radios = document.querySelectorAll('input[name="widgetPresetSize"]');
            radios.forEach(r => { r.checked = false; });
        }
        window.handleWidgetCustomSizeChange = handleWidgetCustomSizeChange;

            // show three-dots button; click to expand vertical capsule menu
    (function () {
        const widgetTrack = document.getElementById('widgetTrack');
        const widgetPagination = document.getElementById('widgetPagination');
        const widgetListContainer = document.getElementById('widgetList');
        const widgetEmptyState = document.getElementById('widgetEmptyState');
        const widgetContentArea = document.getElementById('widgetContentArea');
        const widgetSegmentBtns = document.querySelectorAll('#widgetAppGrid .widget-segment-btn');
        const widgetIndicator = document.getElementById('widgetSegmentIndicator');
        const widgetAppGrid = document.getElementById('widgetAppGrid');
        const themeAppUI = document.getElementById('themeAppUI');

        const officialWidgets = window.officialWidgets || [
            {
                name: '个人收藏集',
                presetSize: '4x2',
                preview: '#e5e5e5',
                content: `<style>
    .widget-doris-container { width: 100%; height: 100%; background-color: #ffffff; border-radius: 24px; box-sizing: border-box; display: flex; flex-direction: column; overflow: hidden; font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif; padding: 2px 4px; }
    .widget-doris-container .top-section { display: flex; align-items: center; padding: 16px 20px 12px 20px; }
    .widget-doris-container .avatar-wrapper { position: relative; width: 60px; height: 60px; margin-right: 14px; }
    .widget-doris-container .uploadable-item { cursor: pointer; background-size: cover; background-position: center; background-repeat: no-repeat; transition: opacity 0.2s; }
    .widget-doris-container .uploadable-item:hover { opacity: 0.8; }
    .widget-doris-container .main-avatar { width: 100%; height: 100%; border-radius: 16px; background-color: #dbe4f0; }
    .widget-doris-container .camera-badge { position: absolute; bottom: -4px; right: -4px; width: 22px; height: 22px; background-color: #000000; border-radius: 50%; display: flex; justify-content: center; align-items: center; border: 2px solid #ffffff; pointer-events: none; }
    .widget-doris-container .camera-badge svg { width: 13px; height: 13px; }
    .widget-doris-container .info-section { flex-grow: 1; display: flex; flex-direction: column; justify-content: center; }
    .widget-doris-container .editable-text { outline: none; cursor: text; border-radius: 4px; transition: background-color 0.2s; }
    .widget-doris-container .editable-text:hover, .widget-doris-container .editable-text:focus { background-color: #f5f5f5; }
    .widget-doris-container .info-name { font-size: 22px; font-weight: 800; color: #222222; margin: 0 0 2px 0; letter-spacing: 0.5px; display: inline-block; align-self: flex-start; }
    .widget-doris-container .info-subtitle { font-size: 14px; color: #8e8e93; margin: 0; font-weight: 500; display: inline-block; align-self: flex-start; }
    .widget-doris-container .follow-btn { background-color: #d1d1d6; color: #ffffff; border: none; border-radius: 20px; padding: 8px 16px; font-size: 14px; font-weight: 700; cursor: pointer; letter-spacing: 0.5px; }
    .widget-doris-container .bottom-section { display: flex; justify-content: space-between; align-items: center; padding: 4px 20px 16px 20px; flex-grow: 1; }
    .widget-doris-container .circle-item { width: 52px; height: 52px; border-radius: 50%; box-sizing: border-box; }
    .widget-doris-container .circle-avatar-1 { background-color: #e8f0fe; }
    .widget-doris-container .circle-avatar-2 { background-color: #fef0e8; }
    .widget-doris-container .pattern-dots { background-image: radial-gradient(#b0b0b0 1.5px, transparent 1.5px); background-size: 10px 10px; background-position: 0 0; background-color: #ffffff; border: 1px solid #e5e5e5; }
    .widget-doris-container .add-btn { border: 1px solid #e5e5e5; background-color: #fafafa; display: flex; justify-content: center; align-items: center; cursor: default; }
    .widget-doris-container .add-btn svg { width: 24px; height: 24px; stroke: #c7c7cc; stroke-width: 1.5; }
</style>
<div class="widget-doris-container">
    <div class="top-section">
        <div class="avatar-wrapper">
            <!-- 加上了 uploadable-img，你的系统会自动接管点击上传 -->
            <div class="uploadable-item main-avatar uploadable-img"></div>
            <div class="camera-badge">
                <svg viewBox="0 0 24 24">
                    <defs>
                        <linearGradient id="metal-shine" x1="0%" y1="0%" x2="100%" y2="100%">
                            <stop offset="0%" stop-color="#ffffff" />
                            <stop offset="30%" stop-color="#f0f0f0" />
                            <stop offset="50%" stop-color="#b0b0b0" />
                            <stop offset="70%" stop-color="#f0f0f0" />
                            <stop offset="100%" stop-color="#ffffff" />
                        </linearGradient>
                    </defs>
                    <path fill="url(#metal-shine)" d="M4,4H7L9,2H15L17,4H20A2,2 0 0,1 22,6V18A2,2 0 0,1 20,20H4A2,2 0 0,1 2,18V6A2,2 0 0,1 4,4M12,7A5,5 0 0,0 7,12A5,5 0 0,0 12,17A5,5 0 0,0 17,12A5,5 0 0,0 12,7M12,9A3,3 0 0,1 15,12A3,3 0 0,1 12,15A3,3 0 0,1 9,12A3,3 0 0,1 12,9Z"></path>
                </svg>
            </div>
        </div>
        <div class="info-section">
            <h1 class="info-name editable-text" contenteditable="true" spellcheck="false">Doris</h1>
            <p class="info-subtitle editable-text" contenteditable="true" spellcheck="false">#收藏集</p>
        </div>
        <button class="follow-btn">Follow</button>
    </div>
    <div class="bottom-section">
        <!-- 加上了 uploadable-img，你的系统会自动接管点击上传 -->
        <div class="circle-item uploadable-item circle-avatar-1 uploadable-img"></div>
        <div class="circle-item uploadable-item pattern-dots uploadable-img"></div>
        <div class="circle-item uploadable-item circle-avatar-2 uploadable-img"></div>
        <div class="circle-item uploadable-item pattern-dots uploadable-img"></div>
        
        <!-- 加号按钮没有 uploadable-img，因此不可上传 -->
        <div class="circle-item add-btn">
            <svg viewBox="0 0 24 24" fill="none" stroke-linecap="round" stroke-linejoin="round">
                <line x1="12" y1="5" x2="12" y2="19"></line>
                <line x1="5" y1="12" x2="19" y2="12"></line>
            </svg>
        </div>
    </div>
</div>`
            },
            {
                name: '时间胶囊',
                presetSize: '4x2',
                preview: 'linear-gradient(135deg, #dbeafe 0%, #eff6ff 100%)',
                content: `<style>
    .widget-4x2 { width: 100%; height: 100%; background-color: transparent; display: flex; flex-direction: column; align-items: center; justify-content: center; position: relative; color: #8b929a; overflow: hidden; }
    .widget-date { font-size: 15px; font-weight: 600; letter-spacing: 1.5px; margin-bottom: 2px; display: flex; align-items: center; justify-content: center; gap: 3px; }
    .star-icon { width: 13px; height: 13px; fill: #8b929a; }
    .widget-time { font-size: 64px; font-weight: 700; line-height: 1; letter-spacing: 2px; margin-bottom: 8px; }
    .chat-bubble { background-color: rgba(255, 255, 255, 0.95); width: 90%; border-radius: 50px; padding: 10px 15px; display: flex; align-items: center; box-sizing: border-box; box-shadow: 0 4px 15px rgba(0, 0, 0, 0.03); }
    /* 注意这里：去除了 cursor: pointer，因为你的 bridge 会自动接管 */
    .avatar { width: 48px; height: 48px; border-radius: 50%; background-image: url("data:image/svg+xml;charset=utf-8,%3Csvg viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cdefs%3E%3CclipPath id='finalClip'%3E%3Ccircle cx='50' cy='50' r='44'/%3E%3C/clipPath%3E%3ClinearGradient id='avatarBgGrad' x1='0%25' y1='0%25' x2='100%25' y2='100%25'%3E%3Cstop offset='0%25' stop-color='%23A3A8B0' /%3E%3Cstop offset='100%25' stop-color='%237A7F88' /%3E%3C/linearGradient%3E%3ClinearGradient id='avatarFigureGrad' x1='0%25' y1='0%25' x2='100%25' y2='100%25'%3E%3Cstop offset='0%25' stop-color='%23FFFFFF' /%3E%3Cstop offset='100%25' stop-color='%23E5E5EA' /%3E%3C/linearGradient%3E%3C/defs%3E%3Ccircle cx='50' cy='50' r='50' fill='url(%23avatarBgGrad)'/%3E%3Ccircle cx='50' cy='36' r='16' fill='url(%23avatarFigureGrad)'/%3E%3Cpath d='M 50 59 C 20 59 10 82 8 106 L 92 106 C 90 82 80 59 50 59 Z' fill='url(%23avatarFigureGrad)' clip-path='url(%23finalClip)'/%3E%3C/svg%3E"); background-size: cover; background-position: center; margin-right: 12px; flex-shrink: 0; border: 1px solid #f3f4f6; }
    .chat-content { flex-grow: 1; display: flex; flex-direction: column; gap: 6px; overflow: hidden; }
    .input-box { border: 1px solid #e5e7eb; border-radius: 20px; padding: 4px 12px; display: flex; justify-content: space-between; align-items: center; background-color: #fafafa; white-space: nowrap; overflow: hidden; }
    /* 注意这里：去除了 pointer-events: none，允许文字被选中和编辑 */
    .input-text { font-size: 12px; color: #8b929a; overflow: hidden; text-overflow: ellipsis; outline: none; }
    .hearts { font-size: 12px; letter-spacing: 2px; flex-shrink: 0; margin-left: 8px; }
    .action-bar { display: flex; justify-content: space-between; align-items: center; padding: 0 4px; }
    .icons { display: flex; gap: 8px; align-items: center; }
    .icons svg { width: 18px; height: 18px; fill: #8b929a; }
    .buttons { display: flex; gap: 8px; }
    .btn { font-size: 12px; padding: 4px 14px; border-radius: 15px; border: none; font-family: inherit; }
    .btn-send { background-color: #8b929a; color: white; }
    .btn-cancel { background-color: transparent; color: #8b929a; border: 1px solid #d1d5db; padding: 3px 13px; }
</style>
<div class="widget-4x2">
    <div class="widget-date" id="date-display"></div>
    <div class="widget-time" id="time-display">14:44</div>
    <div class="chat-bubble">
        <!-- 核心修改 1：加上 uploadable-img 类名，你的系统会自动让它支持点击上传图片 -->
        <div class="avatar uploadable-img"></div>
        <div class="chat-content">
            <div class="input-box">
                <!-- 核心修改 2：加上 contenteditable="true"，你的系统会自动让它支持直接打字修改 -->
                <span class="input-text" contenteditable="true">🤍ineedu…^</span>
            </div>
            <div class="action-bar">
                <div class="icons">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M20 12C20 7.58172 16.4183 4 12 4C7.58172 4 4 7.58172 4 12C4 16.4183 7.58172 20 12 20C13.6418 20 15.1681 19.5054 16.4381 18.6571L17.5476 20.3214C15.9602 21.3818 14.0523 22 12 22C6.47715 22 2 17.5228 2 12C2 6.47715 6.47715 2 12 2C17.5228 2 22 6.47715 22 12V13.5C22 15.433 20.433 17 18.5 17C17.2958 17 16.2336 16.3918 15.6038 15.4659C14.6942 16.4115 13.4158 17 12 17C9.23858 17 7 14.7614 7 12C7 9.23858 9.23858 7 12 7C13.1258 7 14.1647 7.37209 15.0005 8H17V13.5C17 14.3284 17.6716 15 18.5 15C19.3284 15 20 14.3284 20 13.5V12ZM12 9C10.3431 9 9 10.3431 9 12C9 13.6569 10.3431 15 12 15C13.6569 15 15 13.6569 15 12C15 10.3431 13.6569 9 12 9Z"></path></svg>
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M12 22C6.47715 22 2 17.5228 2 12C2 6.47715 6.47715 2 12 2C17.5228 2 22 6.47715 22 12C22 17.5228 17.5228 22 12 22ZM12 20C16.4183 20 20 16.4183 20 12C20 7.58172 16.4183 4 12 4C7.58172 4 4 7.58172 4 12C4 16.4183 7.58172 20 12 20ZM7 13H9C9 14.6569 10.3431 16 12 16C13.6569 16 15 14.6569 15 13H17C17 15.7614 14.7614 18 12 18C9.23858 18 7 15.7614 7 13ZM8 11C7.17157 11 6.5 10.3284 6.5 9.5C6.5 8.67157 7.17157 8 8 8C8.82843 8 9.5 8.67157 9.5 9.5C9.5 10.3284 8.82843 11 8 11ZM16 11C15.1716 11 14.5 10.3284 14.5 9.5C14.5 8.67157 15.1716 8 16 8C16.8284 8 17.5 8.67157 17.5 9.5C17.5 10.3284 16.8284 11 16 11Z"></path></svg>
                </div>
                <div class="buttons">
                    <button class="btn btn-send">发送</button>
                    <button class="btn btn-cancel">取消</button>
                </div>
            </div>
        </div>
    </div>
</div>
<script>
    const roundedStarSvg = \`<svg class="star-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" /></svg>\`;
    function updateTime() {
        const now = new Date();
        const hours = String(now.getHours()).padStart(2, '0');
        const minutes = String(now.getMinutes()).padStart(2, '0');
        const timeEl = document.getElementById('time-display');
        if(timeEl) timeEl.textContent = \`\${hours}:\${minutes}\`;
        const year = now.getFullYear();
        const month = String(now.getMonth() + 1).padStart(2, '0');
        const day = String(now.getDate()).padStart(2, '0');
        const dateEl = document.getElementById('date-display');
        if(dateEl) dateEl.innerHTML = \`<span>\${year}</span>\${roundedStarSvg}<span>\${month}</span>\${roundedStarSvg}<span>\${day}</span>\`;
    }
    updateTime();
    setInterval(updateTime, 1000);
</script>`
            },
            {
                name: '透明极简文字',
                presetSize: '4x2',
                preview: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
                content: `<style>
    .widget-container { width: 100%; height: 100%; background-color: transparent; position: relative; display: flex; flex-direction: column; justify-content: space-between; padding: 18px 20px; box-sizing: border-box; overflow: hidden; }
    .top-section { display: flex; justify-content: space-between; align-items: flex-start; }
    .profile-area { display: flex; align-items: center; gap: 12px; }
    .avatar { width: 56px; height: 56px; border-radius: 16px; object-fit: cover; background-color: #ccc; }
    .text-info { display: flex; flex-direction: column; gap: 4px; }
    .title { font-size: 18px; font-weight: 800; color: #111; display: flex; align-items: center; gap: 4px; outline: none; }
    .subtitle { font-size: 12px; color: #888; font-weight: 500; outline: none; }
    .bell-btn { width: 40px; height: 40px; border: 1.5px solid #dcdcdc; border-radius: 14px; display: flex; justify-content: center; align-items: center; background: transparent; }
    .middle-quote { font-size: 16px; font-weight: 800; color: #111; margin-top: 4px; outline: none; }
    .bottom-section { display: flex; align-items: center; gap: 12px; }
    .search-bar { flex-grow: 1; height: 36px; background-color: rgba(255, 255, 255, 0.5); border-radius: 10px; display: flex; align-items: center; padding: 0 12px; gap: 8px; }
    .datetime { font-size: 13px; color: #999; font-weight: 500; letter-spacing: 0.5px; }
    .settings-btn { width: 36px; height: 36px; background-color: rgba(255, 255, 255, 0.5); border-radius: 10px; display: flex; justify-content: center; align-items: center; }
    svg { fill: none; stroke: currentColor; stroke-width: 2; stroke-linecap: round; stroke-linejoin: round; }
</style>
<div class="widget-container">
    <div class="top-section">
        <div class="profile-area">
            <img class="avatar uploadable-img" src="data:image/svg+xml;charset=utf-8,%3Csvg viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cdefs%3E%3CclipPath id='finalClip'%3E%3Ccircle cx='50' cy='50' r='44'/%3E%3C/clipPath%3E%3ClinearGradient id='avatarBgGrad' x1='0%25' y1='0%25' x2='100%25' y2='100%25'%3E%3Cstop offset='0%25' stop-color='%23A3A8B0' /%3E%3Cstop offset='100%25' stop-color='%237A7F88' /%3E%3C/linearGradient%3E%3ClinearGradient id='avatarFigureGrad' x1='0%25' y1='0%25' x2='100%25' y2='100%25'%3E%3Cstop offset='0%25' stop-color='%23FFFFFF' /%3E%3Cstop offset='100%25' stop-color='%23E5E5EA' /%3E%3C/linearGradient%3E%3C/defs%3E%3Ccircle cx='50' cy='50' r='50' fill='url(%23avatarBgGrad)'/%3E%3Ccircle cx='50' cy='36' r='16' fill='url(%23avatarFigureGrad)'/%3E%3Cpath d='M 50 59 C 20 59 10 82 8 106 L 92 106 C 90 82 80 59 50 59 Z' fill='url(%23avatarFigureGrad)' clip-path='url(%23finalClip)'/%3E%3C/svg%3E" alt="avatar">
            <div class="text-info">
                <div class="title" contenteditable="true">水色贝</div>
                <div class="subtitle" contenteditable="true">&gt;ㅎㅇ…iam&gt;iwas🖤🤍</div>
            </div>
        </div>
        <div class="bell-btn">
            <svg width="20" height="20" viewBox="0 0 24 24" style="color: #aaa;"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path><path d="M13.73 21a2 2 0 0 1-3.46 0"></path></svg>
        </div>
    </div>
    <div class="middle-quote" contenteditable="true">怎么我一颗心被你俘虏</div>
    <div class="bottom-section">
        <div class="search-bar">
            <svg width="16" height="16" viewBox="0 0 24 24" style="color: #aaa;"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
            <span class="datetime" id="widget-datetime-display">2026/06/08 14:43</span>
        </div>
        <div class="settings-btn">
            <svg width="18" height="18" viewBox="0 0 24 24" style="color: #aaa;"><line x1="4" y1="21" x2="4" y2="14"></line><line x1="4" y1="10" x2="4" y2="3"></line><line x1="12" y1="21" x2="12" y2="12"></line><line x1="12" y1="8" x2="12" y2="3"></line><line x1="20" y1="21" x2="20" y2="16"></line><line x1="20" y1="12" x2="20" y2="3"></line><line x1="1" y1="14" x2="7" y2="14"></line><line x1="9" y1="8" x2="15" y2="8"></line><line x1="17" y1="16" x2="23" y2="16"></line></svg>
        </div>
    </div>
</div>
<script>
    function updateWidgetDateTime() {
        const now = new Date();
        const year = now.getFullYear();
        const month = String(now.getMonth() + 1).padStart(2, '0');
        const day = String(now.getDate()).padStart(2, '0');
        const hours = String(now.getHours()).padStart(2, '0');
        const minutes = String(now.getMinutes()).padStart(2, '0');
        const dtEl = document.getElementById('widget-datetime-display');
        if(dtEl) dtEl.textContent = \`\${year}/\${month}/\${day} \${hours}:\${minutes}\`;
    }
    updateWidgetDateTime();
    setInterval(updateWidgetDateTime, 1000);
</script>`
            },
            {
                name: '自定义菜单卡片',
                presetSize: '4x4',
                preview: '#ffd1dc',
                content: `<style>
    /* 基础重置 */
    * { box-sizing: border-box; margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; }
    
    /* 主容器：恢复 100% 占满网格 */
    .widget-4x4-menu { width: 100%; height: 100%; background-color: #fff; border-radius: 24px; box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08); position: relative; overflow: hidden; border: 1px solid #f5f5f5; display: flex; flex-direction: column; }
    
    /* 上半部分：背景区域 (加上 uploadable-img 支持点击上传) */
    .top-half { width: 100%; height: 50%; background-color: #ffd1dc; background-size: cover; background-position: center; position: relative; }
    
    /* 头像分割线 */
    .avatar-container { position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); z-index: 10; background-color: #fff; padding: 3px; border-radius: 50%; box-shadow: 0 2px 8px rgba(0,0,0,0.08); display: flex; justify-content: center; align-items: center; }
    .avatar { width: 52px; height: 52px; border-radius: 50%; object-fit: cover; display: block; }
    
    /* 下半部分：内容区域 (使用 flex 布局防止溢出) */
    .bottom-half { width: 100%; height: 50%; background-color: #ffffff; display: flex; flex-direction: column; align-items: center; padding: 30px 12px 12px 12px; position: relative; }
    
    /* 菜单标题 */
    .menu-title { font-size: 14px; font-weight: 800; color: #a9a9a9; letter-spacing: 2px; margin-bottom: 8px; outline: none; flex-shrink: 0; line-height: 1; }
    
    /* 菜单项目容器：占据剩余所有空间 */
    .menu-items { display: flex; width: 100%; flex-grow: 1; justify-content: space-between; gap: 8px; min-height: 0; }
    
    /* 单个项目 */
    .item { display: flex; flex-direction: column; width: 32%; height: 100%; }
    
    /* 项目文字头部 */
    .item-header { display: flex; align-items: baseline; margin-bottom: 2px; width: 100%; flex-shrink: 0; }
    .item-num { font-size: 13px; font-weight: bold; color: #ffe4e1; margin-right: 2px; }
    .item-name { font-size: 10px; color: #a9a9a9; font-weight: bold; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; outline: none; flex-grow: 1; }
    
    /* 推荐小字 */
    .item-sub { font-size: 8px; color: #333; font-weight: bold; width: 100%; text-align: right; margin-bottom: 4px; outline: none; flex-shrink: 0; line-height: 1; }
    
    /* 食物图片：自动拉伸填满剩余高度，绝对不会溢出 */
    .item-img { width: 100%; flex-grow: 1; border-radius: 10px; object-fit: cover; min-height: 0; }
</style>

<div class="widget-4x4-menu">
    <!-- 上半部分：点击上传背景 -->
    <div class="top-half uploadable-img"></div>
    
    <!-- 中间头像：点击上传头像，默认使用系统内置SVG -->
    <div class="avatar-container">
        <img class="avatar uploadable-img" src="data:image/svg+xml;charset=utf-8,%3Csvg viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cdefs%3E%3CclipPath id='finalClip'%3E%3Ccircle cx='50' cy='50' r='44'/%3E%3C/clipPath%3E%3ClinearGradient id='avatarBgGrad' x1='0%25' y1='0%25' x2='100%25' y2='100%25'%3E%3Cstop offset='0%25' stop-color='%23A3A8B0' /%3E%3Cstop offset='100%25' stop-color='%237A7F88' /%3E%3C/linearGradient%3E%3ClinearGradient id='avatarFigureGrad' x1='0%25' y1='0%25' x2='100%25' y2='100%25'%3E%3Cstop offset='0%25' stop-color='%23FFFFFF' /%3E%3Cstop offset='100%25' stop-color='%23E5E5EA' /%3E%3C/linearGradient%3E%3C/defs%3E%3Ccircle cx='50' cy='50' r='50' fill='url(%23avatarBgGrad)'/%3E%3Ccircle cx='50' cy='36' r='16' fill='url(%23avatarFigureGrad)'/%3E%3Cpath d='M 50 59 C 20 59 10 82 8 106 L 92 106 C 90 82 80 59 50 59 Z' fill='url(%23avatarFigureGrad)' clip-path='url(%23finalClip)'/%3E%3C/svg%3E" alt="Avatar">
    </div>
    
    <!-- 下半部分：菜单内容 -->
    <div class="bottom-half">
        <div class="menu-title" contenteditable="true">ㅎㅅㅎ</div>
        <div class="menu-items">
            <!-- 卡片 1 -->
            <div class="item">
                <div class="item-header"><span class="item-num">01</span><span class="item-name" contenteditable="true">BerryCake#</span></div>
                <div class="item-sub" contenteditable="true">@Recommend</div>
                <img class="item-img uploadable-img" src="data:image/svg+xml;charset=utf-8,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100' height='100'%3E%3Crect width='100' height='100' fill='%23fce4ec'/%3E%3C/svg%3E" alt="img1">
            </div>
            <!-- 卡片 2 -->
            <div class="item">
                <div class="item-header"><span class="item-num">02</span><span class="item-name" contenteditable="true">SpecialDrink#</span></div>
                <div class="item-sub" contenteditable="true">@Original</div>
                <img class="item-img uploadable-img" src="data:image/svg+xml;charset=utf-8,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100' height='100'%3E%3Crect width='100' height='100' fill='%23e3f2fd'/%3E%3C/svg%3E" alt="img2">
            </div>
            <!-- 卡片 3 -->
            <div class="item">
                <div class="item-header"><span class="item-num">03</span><span class="item-name" contenteditable="true">Icecream#</span></div>
                <div class="item-sub" contenteditable="true">@Recommend</div>
                <img class="item-img uploadable-img" src="data:image/svg+xml;charset=utf-8,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100' height='100'%3E%3Crect width='100' height='100' fill='%23f3e5f5'/%3E%3C/svg%3E" alt="img3">
            </div>
        </div>
    </div>
</div>`
            },
            {
                name: '小猫日记',
                presetSize: '4x4',
                preview: '#f0f2f5',
                content: `<style>
    .widget-cat-space { width: 100%; height: 100%; background-color: #ffffff; border-radius: 28px; overflow: hidden; display: flex; flex-direction: column; font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif; }
    .widget-cat-space .banner { height: 135px; width: 100%; background-color: #dcedfa; background-image: radial-gradient(circle at 20% 30%, #ffffff 2px, transparent 3px), radial-gradient(circle at 80% 20%, #ffffff 2px, transparent 3px), radial-gradient(circle at 50% 60%, #ffffff 2px, transparent 3px), radial-gradient(circle at 10% 80%, #ffffff 2px, transparent 3px), radial-gradient(circle at 90% 70%, #ffffff 2px, transparent 3px); background-size: cover; background-position: center; background-repeat: no-repeat; }
    .widget-cat-space .profile-section { display: flex; align-items: flex-start; padding: 0 20px; margin-top: -45px; position: relative; z-index: 2; }
    .widget-cat-space .avatar-outer { width: 90px; height: 90px; border-radius: 50%; position: relative; }
    .widget-cat-space .avatar-inner { width: 100%; height: 100%; background-color: #ffffff; border-radius: 50%; background-size: cover; background-position: center; border: 3px solid #ffffff; box-sizing: border-box; background-image: url("data:image/svg+xml;charset=utf-8,%3Csvg viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cdefs%3E%3CclipPath id='finalClip'%3E%3Ccircle cx='50' cy='50' r='44'/%3E%3C/clipPath%3E%3ClinearGradient id='avatarBgGrad' x1='0%25' y1='0%25' x2='100%25' y2='100%25'%3E%3Cstop offset='0%25' stop-color='%23A3A8B0' /%3E%3Cstop offset='100%25' stop-color='%237A7F88' /%3E%3C/linearGradient%3E%3ClinearGradient id='avatarFigureGrad' x1='0%25' y1='0%25' x2='100%25' y2='100%25'%3E%3Cstop offset='0%25' stop-color='%23FFFFFF' /%3E%3Cstop offset='100%25' stop-color='%23E5E5EA' /%3E%3C/linearGradient%3E%3C/defs%3E%3Ccircle cx='50' cy='50' r='50' fill='url(%23avatarBgGrad)'/%3E%3Ccircle cx='50' cy='36' r='16' fill='url(%23avatarFigureGrad)'/%3E%3Cpath d='M 50 59 C 20 59 10 82 8 106 L 92 106 C 90 82 80 59 50 59 Z' fill='url(%23avatarFigureGrad)' clip-path='url(%23finalClip)'/%3E%3C/svg%3E"); }
    .widget-cat-space .status-dot { position: absolute; bottom: 4px; right: 4px; width: 12px; height: 12px; background-color: #9cd0f0; border-radius: 50%; border: 2px solid #ffffff; }
    .widget-cat-space .user-info { margin-left: 12px; margin-top: 55px; }
    .widget-cat-space .username { font-size: 16px; font-weight: 600; color: #1a1a1a; margin-bottom: 6px; outline: none; }
    .widget-cat-space .bio-1 { font-size: 13px; color: #666666; font-weight: 500; outline: none; }
    .widget-cat-space .bio-2 { padding: 0 20px; margin-top: 14px; font-size: 13px; font-weight: 600; color: #1a1a1a; outline: none; }
    .widget-cat-space .datetime-section { display: flex; align-items: center; padding: 0 20px; margin-top: 14px; font-size: 11px; color: #888888; }
    .widget-cat-space .divider-line { flex-grow: 1; height: 1px; border-bottom: 1px dashed #d0d0d0; margin: 0 12px; }
    .widget-cat-space .date, .widget-cat-space .time { outline: none; }
    .widget-cat-space .media-grid { display: flex; gap: 12px; padding: 12px 20px 20px 20px; flex-grow: 1; align-items: center; }
    .widget-cat-space .media-item { flex: 1; aspect-ratio: 1 / 1; border-radius: 14px; background-size: cover; background-position: center; }
    .widget-cat-space .color-1 { background-color: #e6f0fa; }
    .widget-cat-space .color-2 { background-color: #f0f4f8; }
    .widget-cat-space .color-3 { background-color: #eef2f6; }
</style>
<div class="widget-cat-space">
    <div class="banner uploadable-img"></div>
    <div class="profile-section">
        <div class="avatar-outer">
            <div class="avatar-inner uploadable-img"></div>
            <div class="status-dot"></div>
        </div>
        <div class="user-info">
            <div class="username" contenteditable="true">小猫用户</div>
            <div class="bio-1" contenteditable="true">⁃ ⩊ ⁃ haengbok …</div>
        </div>
    </div>
    <div class="bio-2" contenteditable="true">☆*:.你的出現讓我開始相信天使的存在*:.★^</div>
    <div class="datetime-section">
        <span class="date" contenteditable="true">07-13-2026</span>
        <div class="divider-line"></div>
        <span class="time" contenteditable="true">11:12:41</span>
    </div>
    <div class="media-grid">
        <div class="media-item color-1 uploadable-img"></div>
        <div class="media-item color-2 uploadable-img"></div>
        <div class="media-item color-3 uploadable-img"></div>
    </div>
</div>`
            },
            {
                name: '层叠信息卡片',
                presetSize: '4x2',
                preview: '#e5e5e5',
                content: `<style>
    .widget-1-container { position: relative; width: 100%; height: 100%; background-color: transparent; font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif; }
    .w1-layer { position: absolute; background: #ffffff; border-radius: 16px; box-shadow: 0 4px 15px rgba(0, 0, 0, 0.03); display: flex; align-items: center; color: #a0a0a0; letter-spacing: 0.5px; }
    .w1-layer-1 { top: 0; left: 8%; width: 84%; height: 22%; padding: 0 20px; box-sizing: border-box; gap: 10px; z-index: 1; font-size: 10px; }
    .w1-layer-1 > * { transform: translateY(-4px); }
    .w1-layer-2 { top: 14%; left: 4%; width: 92%; height: 25%; padding: 0 20px; box-sizing: border-box; gap: 10px; z-index: 2; box-shadow: 0 -2px 10px rgba(0,0,0,0.02), 0 4px 15px rgba(0, 0, 0, 0.04); font-size: 10px; }
    .w1-layer-2 > * { transform: translateY(-3px); }
    .w1-layer-3 { top: 30%; left: 0; width: 100%; height: 70%; z-index: 3; border-radius: 20px; flex-direction: column; align-items: flex-start; padding: 15px 20px; box-sizing: border-box; box-shadow: 0 -4px 15px rgba(0,0,0,0.03), 0 8px 20px rgba(0, 0, 0, 0.05); font-size: 12px; }
    .w1-header { display: flex; align-items: center; gap: 8px; margin-bottom: 10px; font-size: 11px; width: 100%; flex-shrink: 0; line-height: 1.2; }
    .w1-body { display: flex; width: 100%; gap: 15px; align-items: center; flex-shrink: 0; }
    .w1-avatar { width: 50px; height: 50px; border-radius: 10px; background-color: #dcdcdc; background-size: cover; background-position: center; flex-shrink: 0; }
    .w1-pills { display: flex; gap: 10px; flex: 1; overflow: hidden; }
    .w1-pill { background: #f8f8f8; border-radius: 20px; padding: 6px 12px; font-size: 10px; display: flex; align-items: center; justify-content: center; gap: 4px; color: #b0b0b0; }
    .w1-footer { margin-top: 10px; font-size: 10px; color: #b0b0b0; text-align: center; width: 100%; display: flex; align-items: center; justify-content: center; gap: 6px; flex-shrink: 0; }
    svg { display: inline-block; vertical-align: middle; flex-shrink: 0; }
    [contenteditable="true"] { outline: none; border-bottom: 1px solid transparent; transition: border-color 0.2s; white-space: nowrap; }
</style>
<div class="widget-1-container">
    <div class="w1-layer w1-layer-1">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="14" height="14"><path fill-rule="evenodd" d="M3.75 6.75a3 3 0 0 0-3 3v6a3 3 0 0 0 3 3h15a3 3 0 0 0 3-3v-.037c.856-.174 1.5-.93 1.5-1.838v-2.25c0-.907-.644-1.664-1.5-1.837V9.75a3 3 0 0 0-3-3h-15Zm15 1.5a1.5 1.5 0 0 1 1.5 1.5v6a1.5 1.5 0 0 1-1.5 1.5h-15a1.5 1.5 0 0 1-1.5-1.5v-6a1.5 1.5 0 0 1 1.5-1.5h15ZM4.5 9.75a.75.75 0 0 0-.75.75V15c0 .414.336.75.75.75H18a.75.75 0 0 0 .75-.75v-4.5a.75.75 0 0 0-.75-.75H4.5Z" clip-rule="evenodd" /></svg>
        <span id="battery-status">获取中...</span>
        <span id="battery-level">--%</span>
    </div>
    <div class="w1-layer w1-layer-2">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 48 48" width="13" height="13"><path fill="currentColor" d="m40.7174 1.9205 -0.3699 -0.0113h-0.0588c-1.6661 0 -3.2294 0.6685 -4.5833 1.6967 -1.3539 1.0282 -1.751 1.9218 -1.751 1.9218l9.9539 9.7277s1.2726 -0.6459 1.9919 -1.5666c0.7195 -0.9207 1.6153 -2.0451 1.6198 -4.1977 0.0079 -4.0143 -2.9782 -7.3398 -6.8026 -7.5706Z" stroke-width="1"></path><path fill="currentColor" d="m7.2826 1.9205 0.3698 -0.0113h0.0589c1.6661 0 3.2293 0.6685 4.5833 1.6967 1.354 1.0282 1.751 1.9218 1.751 1.9218l-9.9539 9.7277s-1.2725 -0.6459 -1.9919 -1.5666S0.4845 11.6437 0.48 9.4867C0.4721 5.4768 3.4583 2.1513 7.2826 1.9205Z" stroke-width="1"></path><path fill="currentColor" d="M39.3041 38.1723c-0.0013 -0.0012 -0.0019 -0.0028 -0.0019 -0.0045 0 -0.0017 0.0006 -0.0034 0.0019 -0.0046 3.8119 -4.5833 5.6217 -10.8904 4.0381 -17.5652 -1.5429 -6.5063 -8.22 -13.0862 -14.7432 -14.5532 -12.9695 -2.9161 -24.4992 6.9157 -24.4992 19.391 -0.0045 4.6524 1.6285 9.1581 4.6128 12.7274 0.001 0.0012 0.0017 0.0029 0.0017 0.0046 0 0.0017 -0.0007 0.0033 -0.0017 0.0045l-5.4125 5.3616c-0.0011 0.0012 -0.0017 0.0028 -0.0017 0.0044 0 0.0017 0.0006 0.0033 0.0017 0.0046l2.6016 2.5462c0.0013 0.0011 0.0029 0.0017 0.0045 0.0017 0.0017 0 0.0033 -0.0006 0.0046 -0.0017l5.365 -5.3583c0.0012 -0.0011 0.0028 -0.0017 0.0044 -0.0017 0.0016 0 0.0033 0.0006 0.0046 0.0017 3.5717 2.9803 8.0761 4.6128 12.728 4.6128 4.6519 0 9.1562 -1.6325 12.7281 -4.6128h0.0079l5.3491 5.3583c0.0012 0.0011 0.0029 0.0017 0.0046 0.0017 0.0015 0 0.0032 -0.0006 0.0044 -0.0017l2.7057 -2.5552 -5.5086 -5.3617ZM25.8176 27.2456H13.141v-3.6084l0.0057 -0.0055h9.049V10.9573h3.6196l0.0023 16.2883Z" stroke-width="1"></path></svg>
        <span id="time-display">--:--:--</span>
        <span id="date-display" style="margin-left: 10px;">----年--月--日 周-</span>
    </div>
    <div class="w1-layer w1-layer-3">
        <div class="w1-header">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M21.9975 11.9078V18.5078C22.0225 18.9691 21.9533 19.4308 21.794 19.8644C21.6347 20.2981 21.3887 20.6948 21.071 21.0302C20.7533 21.3657 20.3705 21.6328 19.9461 21.8154C19.5217 21.998 19.0645 22.0922 18.6025 22.0922C18.1405 22.0922 17.6833 21.998 17.2589 21.8154C16.8345 21.6328 16.4517 21.3657 16.134 21.0302C15.8163 20.6948 15.5703 20.2981 15.411 19.8644C15.2517 19.4308 15.1825 18.9691 15.2075 18.5078V15.8678C15.2071 15.252 15.3743 14.6477 15.6914 14.1198C16.0085 13.5919 16.4634 13.1604 17.0072 12.8715C17.551 12.5826 18.1633 12.4473 18.7782 12.4802C19.3932 12.513 19.9875 12.7127 20.4975 13.0578V11.9078C20.4975 9.6535 19.602 7.49149 18.0079 5.89743C16.4138 4.30337 14.2518 3.40784 11.9975 3.40784C9.74316 3.40784 7.58115 4.30337 5.98709 5.89743C4.39303 7.49149 3.4975 9.6535 3.4975 11.9078V13.0578C4.05426 12.6776 4.71332 12.4754 5.38751 12.4778C6.2866 12.4778 7.14886 12.835 7.78461 13.4707C8.42036 14.1065 8.7775 14.9687 8.7775 15.8678V18.5078C8.7775 18.953 8.68983 19.3938 8.51947 19.8051C8.34911 20.2164 8.0994 20.5901 7.78461 20.9049C7.46982 21.2197 7.09611 21.4694 6.68481 21.6398C6.27352 21.8101 5.83269 21.8978 5.38751 21.8978C4.94233 21.8978 4.5015 21.8101 4.09021 21.6398C3.67892 21.4694 3.30521 21.2197 2.99042 20.9049C2.67563 20.5901 2.42592 20.2164 2.25555 19.8051C2.08519 19.3938 1.9975 18.953 1.9975 18.5078V11.9078C1.9975 9.25567 3.05109 6.71213 4.92645 4.83676C6.80182 2.9614 9.34533 1.90784 11.9975 1.90784C14.6497 1.90784 17.1932 2.9614 19.0686 4.83676C20.9439 6.71213 21.9975 9.25567 21.9975 11.9078Z" fill="currentColor"/></svg>
            <span contenteditable="true">° ‧┈┈ 9 人形電腦天使心 9 ┈┈‧ °</span>
        </div>
        <div class="w1-body">
            <div class="w1-avatar uploadable-img"></div>
            <div class="w1-pills">
                <div class="w1-pill"><span contenteditable="true">♡ ♡ ≧◡≦ ♡ ♡</span></div>
                <div class="w1-pill" style="background: #ffffff; border: 1px solid #f0f0f0;">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" stroke-width="1"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon></svg>
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" stroke-width="1"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon></svg>
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" stroke-width="1"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon></svg>
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon></svg>
                </div>
            </div>
        </div>
        <div class="w1-footer">
            <span contenteditable="true">• [she//her] • [white something here &lt;3]</span>
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="6"></circle><ellipse cx="12" cy="12" rx="10" ry="3" transform="rotate(-45 12 12)"></ellipse></svg>
        </div>
    </div>
</div>
<script>
    function updateDateTime() {
        const now = new Date();
        const hours = String(now.getHours()).padStart(2, '0');
        const minutes = String(now.getMinutes()).padStart(2, '0');
        const seconds = String(now.getSeconds()).padStart(2, '0');
        const timeEl = document.getElementById('time-display');
        if(timeEl) timeEl.textContent = \`\${hours}:\${minutes}:\${seconds}\`;
        const year = now.getFullYear();
        const month = now.getMonth() + 1;
        const date = now.getDate();
        const days = ['周日', '周一', '周二', '周三', '周四', '周五', '周六'];
        const day = days[now.getDay()];
        const dateEl = document.getElementById('date-display');
        if(dateEl) dateEl.textContent = \`\${year}年\${month}月\${date}日 \${day}\`;
    }
    setInterval(updateDateTime, 1000);
    updateDateTime();
    function updateBatteryUI(battery) {
        const level = Math.round(battery.level * 100) + '%';
        const status = battery.charging ? '充电中' : '未充电';
        const statusEl = document.getElementById('battery-status');
        const levelEl = document.getElementById('battery-level');
        if(statusEl) statusEl.textContent = status;
        if(levelEl) levelEl.textContent = level;
    }
    if ('getBattery' in navigator) {
        navigator.getBattery().then(function(battery) {
            updateBatteryUI(battery);
            battery.addEventListener('levelchange', () => updateBatteryUI(battery));
            battery.addEventListener('chargingchange', () => updateBatteryUI(battery));
        });
    } else {
        const statusEl = document.getElementById('battery-status');
        const levelEl = document.getElementById('battery-level');
        if(statusEl) statusEl.textContent = '未充电';
        if(levelEl) levelEl.textContent = '100%';
    }
</script>`
            },
            {
                name: 'Oㅈo：뭐?',
                presetSize: '4x2',
                preview: 'linear-gradient(135deg, #a8b0b8, #6a7076)',
                content: `<style>
    .widget-container-ozo { width: 100%; height: 100%; background-color: #ffffff; border-radius: 28px; padding: 20px 24px; box-sizing: border-box; display: flex; flex-direction: column; font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif; }
    .widget-header-ozo { display: flex; align-items: center; margin-bottom: 16px; }
    .widget-title-ozo { font-size: 18px; font-weight: 700; color: #333333; letter-spacing: 0.5px; outline: none; }
    .widget-content-ozo { display: flex; gap: 14px; align-items: center; flex: 1; }
    .color-box-ozo { flex: 1; height: 100%; border-radius: 16px; background-size: cover; background-position: center; }
    .box-1-ozo { background-color: #9fb4c7; }
    .box-2-ozo { background-color: #e4e9ed; }
    .box-3-ozo { background-color: #c5d3e0; }
</style>
<div class="widget-container-ozo">
    <div class="widget-header-ozo">
        <div class="widget-title-ozo" contenteditable="true">Oㅈo：뭐?</div>
    </div>
    <div class="widget-content-ozo">
        <div class="color-box-ozo box-1-ozo uploadable-img"></div>
        <div class="color-box-ozo box-2-ozo uploadable-img"></div>
        <div class="color-box-ozo box-3-ozo uploadable-img"></div>
    </div>
</div>`
            },
            {
                name: '纯净拍立得',
                presetSize: '4x2',
                preview: '#e0e0e0',
                content: `<style>
    .widget-polaroid-container { width: 100%; height: 100%; background-color: transparent; position: relative; display: flex; justify-content: space-evenly; align-items: center; overflow: hidden; }
    .polaroid { background-color: #ffffff; padding: 4px 4px 18px 4px; box-shadow: 1px 2px 6px rgba(0, 0, 0, 0.1); position: relative; width: 80px; height: 96px; display: flex; flex-direction: column; border-radius: 2px; }
    .photo { width: 100%; height: 100%; background-color: #e0e0e0; background-size: cover; background-position: center; border-radius: 1px; }
    .polaroid.left { transform: rotate(-3deg) translateY(4px); }
    .polaroid.middle { transform: rotate(4deg) translateY(-6px); z-index: 2; }
    .polaroid.right { transform: rotate(-2deg) translateY(6px); }
</style>
<div class="widget-polaroid-container">
    <div class="polaroid left">
        <div class="photo uploadable-img" style="background-color: #dcdcdc;"></div>
    </div>
    <div class="polaroid middle">
        <div class="photo uploadable-img" style="background-color: #eeeeee;"></div>
    </div>
    <div class="polaroid right">
        <div class="photo uploadable-img" style="background-color: #e8e8e8;"></div>
    </div>
</div>`
            },
            {
                name: '小猫饼图文',
                presetSize: '4x3',
                preview: '#e8eaed',
                content: `<style>
    .widget-4x3-cat { width: 100%; height: 100%; display: flex; flex-direction: column; gap: 8px; box-sizing: border-box; background: transparent; font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif; overflow: hidden; }
    .widget-4x3-cat .card { background-color: #f4f5f7; border-radius: 24px; box-sizing: border-box; }
    .widget-4x3-cat .top-card { display: flex; align-items: center; padding: 16px 24px; }
    .widget-4x3-cat .top-icon-frame { width: 52px; height: 52px; background-color: #b8b8b8; border-radius: 14px; padding: 4px; box-sizing: border-box; flex-shrink: 0; }
    .widget-4x3-cat .top-icon-inner { width: 100%; height: 100%; background-color: #fff; border-radius: 10px; overflow: hidden; display: flex; justify-content: center; align-items: center; background-size: cover; background-position: center; }
    .widget-4x3-cat .top-text-group { margin-left: 16px; flex-grow: 1; display: flex; flex-direction: column; justify-content: center; gap: 4px; }
    .widget-4x3-cat .top-title { font-size: 17px; font-weight: 600; color: #333; outline: none; }
    .widget-4x3-cat .top-subtitle { font-size: 13px; color: #666; outline: none; }
    .widget-4x3-cat .music-icon { width: 24px; height: 24px; color: #555; }
    .widget-4x3-cat .bottom-card { flex-grow: 1; display: flex; flex-direction: column; justify-content: space-between; padding: 16px 24px; }
    .widget-4x3-cat .image-row { display: flex; justify-content: space-between; align-items: center; gap: 16px; flex-grow: 1; }
    .widget-4x3-cat .image-frame { flex: 1; aspect-ratio: 1 / 1; background-color: #b8b8b8; border-radius: 20px; padding: 6px; box-sizing: border-box; }
    .widget-4x3-cat .image-inner { width: 100%; height: 100%; background-color: #ffffff; border-radius: 14px; overflow: hidden; display: flex; justify-content: center; align-items: center; background-size: cover; background-position: center; }
    .widget-4x3-cat .bottom-text-row { display: flex; justify-content: space-between; align-items: flex-end; padding-top: 16px; padding-left: 4px; padding-right: 4px; }
    .widget-4x3-cat .bottom-text { font-size: 11px; color: #555; letter-spacing: 0.5px; font-weight: 600; outline: none; }
</style>
<div class="widget-4x3-cat">
    <div class="card top-card">
        <div class="top-icon-frame">
            <div class="top-icon-inner uploadable-img"></div>
        </div>
        <div class="top-text-group">
            <div class="top-title" contenteditable="true">小猫饼</div>
            <div class="top-subtitle" contenteditable="true">Trou、verJasm1ne</div>
        </div>
        <svg class="music-icon" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 14"><path fill="#555555" fill-rule="evenodd" d="M7.75 0.851a0.75 0.75 0 0 0 -1.5 0V13.15a0.75 0.75 0 0 0 1.5 0V0.851ZM4 2.466a0.75 0.75 0 0 1 0.75 0.75v7.568a0.75 0.75 0 1 1 -1.5 0V3.216a0.75 0.75 0 0 1 0.75 -0.75ZM1 4.831a0.75 0.75 0 0 1 0.75 0.75V8.42a0.75 0.75 0 0 1 -1.5 0V5.581a0.75 0.75 0 0 1 0.75 -0.75Zm9 -2.365a0.75 0.75 0 0 1 0.75 0.75v7.568a0.75 0.75 0 1 1 -1.5 0V3.216a0.75 0.75 0 0 1 0.75 -0.75Zm3.75 3.115a0.75 0.75 0 0 0 -1.5 0V8.42a0.75 0.75 0 0 0 1.5 0V5.581Z" clip-rule="evenodd"></path></svg>
    </div>
    <div class="card bottom-card">
        <div class="image-row">
            <div class="image-frame"><div class="image-inner uploadable-img"></div></div>
            <div class="image-frame"><div class="image-inner uploadable-img"></div></div>
            <div class="image-frame"><div class="image-inner uploadable-img"></div></div>
        </div>
        <div class="bottom-text-row">
            <div class="bottom-text" contenteditable="true">@ We don't talk anymore.</div>
            <div class="bottom-text" contenteditable="true">✩₊행복…은 손에 닿을 듯 가깝다.*✩</div>
        </div>
    </div>
</div>`
            },
            {
                name: '小猫饼对话',
                presetSize: '4x3',
                preview: '#e8eaed',
                content: `<style>
    .widget-4x3-msg { width: 100%; height: 100%; display: flex; flex-direction: column; gap: 8px; box-sizing: border-box; background: transparent; font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif; overflow: hidden; }
    .widget-4x3-msg .top-card { background-color: #f4f5f7; border-radius: 24px; box-shadow: 0 6px 16px rgba(0, 0, 0, 0.06); border: 1px solid #ebebeb; box-sizing: border-box; display: flex; align-items: center; padding: 12px 20px; }
    .widget-4x3-msg .top-icon-frame { width: 52px; height: 52px; background-color: #b8b8b8; border-radius: 14px; padding: 4px; box-sizing: border-box; flex-shrink: 0; }
    .widget-4x3-msg .top-icon-inner { width: 100%; height: 100%; background-color: #fff; border-radius: 10px; overflow: hidden; display: flex; justify-content: center; align-items: center; background-size: cover; background-position: center; }
    .widget-4x3-msg .top-text-group { margin-left: 16px; flex-grow: 1; display: flex; flex-direction: column; justify-content: center; gap: 4px; }
    .widget-4x3-msg .top-title { font-size: 17px; font-weight: 600; color: #333; outline: none; }
    .widget-4x3-msg .top-subtitle { font-size: 13px; color: #666; outline: none; }
    .widget-4x3-msg .music-icon { width: 24px; height: 24px; color: #555; }
    .widget-4x3-msg .bottom-chat-section { flex-grow: 1; display: flex; flex-direction: column; justify-content: flex-end; gap: 8px; padding: 0 8px 4px 8px; }
    .widget-4x3-msg .chat-timestamp { text-align: center; font-size: 11px; color: #999; line-height: 1.4; outline: none; width: 100%; margin-bottom: 2px; }
    .widget-4x3-msg .chat-group { display: flex; flex-direction: column; width: 100%; gap: 4px; }
    .widget-4x3-msg .chat-group.left { align-items: flex-start; }
    .widget-4x3-msg .chat-group.right { align-items: flex-end; }
    .widget-4x3-msg .chat-row { display: flex; align-items: flex-end; gap: 8px; max-width: 100%; }
    .widget-4x3-msg .chat-group.right .chat-row { flex-direction: row-reverse; }
    .widget-4x3-msg .chat-avatar { width: 36px; height: 36px; border-radius: 50%; background-color: #d1d1d6; flex-shrink: 0; overflow: hidden; display: flex; justify-content: center; align-items: center; box-shadow: 0 2px 4px rgba(0,0,0,0.05); background-size: cover; background-position: center; }
    .widget-4x3-msg .chat-bubble { padding: 8px 14px; font-size: 14px; line-height: 1.4; max-width: 65%; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; box-shadow: 0 2px 6px rgba(0,0,0,0.08); border-radius: 20px; outline: none; }
    .widget-4x3-msg .chat-group.left .chat-bubble { background-color: #ffffff; color: #000; }
    .widget-4x3-msg .chat-group.right .chat-bubble { background-color: #007aff; color: #fff; }
    .widget-4x3-msg .chat-delivered { font-size: 10px; color: #999; padding-right: 44px; outline: none; line-height: 1; }
    .widget-4x3-msg .imessage-bar { display: flex; align-items: center; border: 1px solid #c8c8cc; border-radius: 20px; padding: 6px 12px; background-color: rgba(255, 255, 255, 0.6); backdrop-filter: blur(10px); gap: 10px; margin-top: 2px; }
    .widget-4x3-msg .imessage-icon { color: #8e8e93; width: 20px; height: 20px; flex-shrink: 0; }
    .widget-4x3-msg .imessage-input { flex-grow: 1; font-size: 14px; color: #3c3c43; outline: none; }
</style>
<div class="widget-4x3-msg">
    <div class="top-card">
        <div class="top-icon-frame">
            <div class="top-icon-inner uploadable-img"></div>
        </div>
        <div class="top-text-group">
            <div class="top-title" contenteditable="true">小猫饼</div>
            <div class="top-subtitle" contenteditable="true">Trou、verJasm1ne</div>
        </div>
        <svg class="music-icon" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 14"><path fill="#555555" fill-rule="evenodd" d="M7.75 0.851a0.75 0.75 0 0 0 -1.5 0V13.15a0.75 0.75 0 0 0 1.5 0V0.851ZM4 2.466a0.75 0.75 0 0 1 0.75 0.75v7.568a0.75 0.75 0 1 1 -1.5 0V3.216a0.75 0.75 0 0 1 0.75 -0.75ZM1 4.831a0.75 0.75 0 0 1 0.75 0.75V8.42a0.75 0.75 0 0 1 -1.5 0V5.581a0.75 0.75 0 0 1 0.75 -0.75Zm9 -2.365a0.75 0.75 0 0 1 0.75 0.75v7.568a0.75 0.75 0 1 1 -1.5 0V3.216a0.75 0.75 0 0 1 0.75 -0.75Zm3.75 3.115a0.75 0.75 0 0 0 -1.5 0V8.42a0.75 0.75 0 0 0 1.5 0V5.581Z" clip-rule="evenodd"></path></svg>
    </div>
    <div class="bottom-chat-section">
        <div class="chat-timestamp" contenteditable="true">iMessage메시지 오늘 16:47</div>
        
        <div class="chat-group left">
            <div class="chat-row">
                <div class="chat-avatar uploadable-img"></div>
                <div class="chat-bubble" contenteditable="true">今天天气真不错呀！☀️</div>
            </div>
        </div>
        
        <div class="chat-group right">
            <div class="chat-row">
                <div class="chat-avatar uploadable-img"></div>
                <div class="chat-bubble" contenteditable="true">是啊，刚好适合做小组件~</div>
            </div>
            <div class="chat-delivered" contenteditable="true">已送达</div>
        </div>
        
        <div class="imessage-bar">
            <svg class="imessage-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
            <div class="imessage-input" contenteditable="true">iMessage</div>
            <svg class="imessage-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M8.25 4.5a3.75 3.75 0 1 1 7.5 0v8.25a3.75 3.75 0 1 1-7.5 0V4.5Z" /><path d="M6 10.5a.75.75 0 0 1 .75.75v1.5a5.25 5.25 0 1 0 10.5 0v-1.5a.75.75 0 0 1 1.5 0v1.5a6.751 6.751 0 0 1-6 6.709v2.291h3a.75.75 0 0 1 0 1.5h-7.5a.75.75 0 0 1 0-1.5h3v-2.291a6.751 6.751 0 0 1-6-6.709v-1.5A.75.75 0 0 1 6 10.5Z" /></svg>
        </div>
    </div>
</div>`
            },
            {
                name: '甜品店挂牌',
                presetSize: '4x2',
                preview: '#f5f5f5',
                content: `<style>
    .widget-container-dessert { width: 100%; height: 100%; background: transparent; position: relative; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; }
    .widget-container-dessert .pole-system { position: absolute; width: 100%; height: 100%; top: 0; left: 0; z-index: 1; pointer-events: none; }
    .widget-container-dessert .pole-vertical { position: absolute; left: 6%; top: 10%; width: 8px; height: calc(38% - 2px); background-color: #d1d1d5; }
    .widget-container-dessert .pole-vertical::before { content: ''; position: absolute; top: -5px; left: -3px; width: 14px; height: 6px; background-color: #d1d1d5; border-radius: 3px; }
    .widget-container-dessert .pole-horizontal { position: absolute; left: 6%; top: 43%; width: 86%; height: 6px; background-color: #d1d1d5; transform: translateY(-50%); }
    .widget-container-dessert .pole-horizontal::after { content: ''; position: absolute; right: -4px; top: 50%; width: 12px; height: 12px; background-color: #d1d1d5; border-radius: 50%; transform: translateY(-50%); }
    .widget-container-dessert .pole-joint { position: absolute; left: calc(6% + 4px); top: 43%; width: 18px; height: 18px; background-color: #d1d1d5; border-radius: 50%; transform: translate(-50%, -50%); z-index: 2; }
    .widget-container-dessert .main-sign { position: absolute; left: calc(6% + 7px); top: 18%; width: 83%; height: 17%; background-color: #ffffff; border: 1.5px solid #d1d1d5; display: flex; align-items: center; justify-content: space-between; box-sizing: border-box; z-index: 0; }
    .widget-container-dessert .editable-text { outline: none; cursor: text; transition: background-color 0.2s; }
    .widget-container-dessert .editable-text:hover { background-color: rgba(0,0,0,0.03); border-radius: 4px; }
    .widget-container-dessert .sign-text { font-weight: 900; font-size: clamp(12px, 3vw, 18px); letter-spacing: 1px; padding-left: 4%; color: #000000; white-space: nowrap; }
    .widget-container-dessert .sign-pattern { width: 6%; height: 100%; border-left: 1.5px solid #d1d1d5; background-image: radial-gradient(#f4cdd8 30%, transparent 30%); background-size: 6px 6px; background-position: 0 0; }
    .widget-container-dessert .tags-container { position: absolute; top: 43%; left: 12%; width: 76%; height: 52%; display: flex; justify-content: space-between; z-index: 0; }
    .widget-container-dessert .tag-wrapper { display: flex; flex-direction: column; align-items: center; width: 22%; height: 100%; }
    .widget-container-dessert .connector { width: 6px; height: 12%; background-color: #d1d1d5; position: relative; }
    .widget-container-dessert .connector::before { content: ''; position: absolute; top: -2px; left: -3px; width: 12px; height: 4px; background-color: #d1d1d5; border-radius: 2px; }
    .widget-container-dessert .tag { width: 100%; height: 88%; border-radius: 0 0 20px 20px; display: flex; flex-direction: column; align-items: center; padding-top: 10%; box-sizing: border-box; }
    .widget-container-dessert .tag.pink { background-color: #fdf0f4; }
    .widget-container-dessert .tag.blue { background-color: #f0f5fd; }
    .widget-container-dessert .icon-box { width: 70%; aspect-ratio: 1 / 1; background-color: #ffffff; border-radius: 4px; background-size: cover; background-position: center; background-repeat: no-repeat; overflow: hidden; position: relative; }
    .widget-container-dessert .icon-box.gray-bg { background-color: #d0d0d4; }
    .widget-container-dessert .tag-text { font-size: clamp(10px, 1.5vw, 13px); font-weight: 900; margin-top: 6%; color: #444444; width: 70%; text-align: left; }
</style>
<div class="widget-container-dessert">
    <div class="pole-system">
        <div class="pole-vertical"></div>
        <div class="pole-horizontal"></div>
        <div class="pole-joint"></div>
    </div>
    <div class="main-sign">
        <div class="sign-text editable-text" contenteditable="true" spellcheck="false">[ㅇㅅㅇ] ୨ · DESSERT SHOP · ୧</div>
        <div class="sign-pattern"></div>
    </div>
    <div class="tags-container">
        <div class="tag-wrapper">
            <div class="connector"></div>
            <div class="tag pink">
                <div class="icon-box uploadable-img" style="background-image: url('data:image/svg+xml;charset=utf-8,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%22-12 -12 124 124%22%3E%3Cpolygon points=%2220,50 30,15 50,35%22 fill=%22%23c8c8c8%22 stroke=%22%23c8c8c8%22 stroke-width=%224%22 stroke-linejoin=%22round%22/%3E%3Cpolygon points=%2280,50 70,15 50,35%22 fill=%22%23c8c8c8%22 stroke=%22%23c8c8c8%22 stroke-width=%224%22 stroke-linejoin=%22round%22/%3E%3Ccircle cx=%2250%22 cy=%2250%22 r=%2232%22 fill=%22%23c8c8c8%22/%3E%3Cpath d=%22M 20 110 Q 50 70 80 110%22 fill=%22%23c8c8c8%22/%3E%3C/svg%3E');"></div>
                <div class="tag-text editable-text" contenteditable="true" spellcheck="false">No.1</div>
            </div>
        </div>
        <div class="tag-wrapper">
            <div class="connector"></div>
            <div class="tag blue">
                <div class="icon-box gray-bg uploadable-img" style="background-image: url('data:image/svg+xml;charset=utf-8,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%22-12 -12 124 124%22%3E%3Ccircle cx=%2230%22 cy=%2230%22 r=%2212%22 fill=%22%23ffffff%22/%3E%3Ccircle cx=%2270%22 cy=%2230%22 r=%2212%22 fill=%22%23ffffff%22/%3E%3Ccircle cx=%2250%22 cy=%2250%22 r=%2230%22 fill=%22%23ffffff%22/%3E%3Cpath d=%22M 20 110 Q 50 75 80 110%22 fill=%22%23ffffff%22/%3E%3C/svg%3E');"></div>
                <div class="tag-text editable-text" contenteditable="true" spellcheck="false">No.2</div>
            </div>
        </div>
        <div class="tag-wrapper">
            <div class="connector"></div>
            <div class="tag pink">
                <div class="icon-box uploadable-img" style="background-image: url('data:image/svg+xml;charset=utf-8,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%22-12 -12 124 124%22%3E%3Cpath d=%22M 50 85 C 50 85 15 55 15 35 C 15 20 30 10 45 20 C 50 24 50 24 50 24 C 50 24 50 24 55 20 C 70 10 85 20 85 35 C 85 55 50 85 50 85 Z%22 fill=%22%23f4b3c2%22/%3E%3C/svg%3E');"></div>
            </div>
        </div>
        <div class="tag-wrapper">
            <div class="connector"></div>
            <div class="tag blue">
                <div class="icon-box uploadable-img" style="background-image: url('data:image/svg+xml;charset=utf-8,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%22-12 -12 124 124%22%3E%3Ccircle cx=%2220%22 cy=%2220%22 r=%223%22 fill=%22%23f4e1e6%22/%3E%3Ccircle cx=%2280%22 cy=%2220%22 r=%223%22 fill=%22%23f4e1e6%22/%3E%3Ccircle cx=%2220%22 cy=%2280%22 r=%223%22 fill=%22%23f4e1e6%22/%3E%3Ccircle cx=%2280%22 cy=%2280%22 r=%223%22 fill=%22%23f4e1e6%22/%3E%3Cline x1=%2265%22 y1=%2215%22 x2=%2255%22 y2=%2240%22 stroke=%22%23d1d1d5%22 stroke-width=%224%22 stroke-linecap=%22round%22/%3E%3Cpath d=%22M 35 35 L 65 35 L 60 80 C 60 85 40 85 40 80 Z%22 fill=%22%23fbe4eb%22/%3E%3Cpath d=%22M 38 50 Q 50 60 62 50%22 fill=%22none%22 stroke=%22%23f4cdd8%22 stroke-width=%223%22 stroke-linecap=%22round%22/%3E%3Cpath d=%22M 39 65 Q 50 75 61 65%22 fill=%22none%22 stroke=%22%23f4cdd8%22 stroke-width=%223%22 stroke-linecap=%22round%22/%3E%3C/svg%3E');"></div>
            </div>
        </div>
    </div>
</div>`
            },
            {
                name: '人机验证',
                presetSize: '4x4',
                preview: '#f4f6fc',
                content: `<style>
    /* 新增外层 wrapper，利用 padding: 5% 让内部卡片缩小一圈 */
    .widget-captcha-wrapper { width: 100%; height: 100%; padding: 5%; box-sizing: border-box; display: flex; justify-content: center; align-items: center; background: transparent; }
    .widget-captcha-container { width: 100%; height: 100%; background-color: #ffffff; border: 1px solid #e0e0e0; box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05); padding: 8px; display: flex; flex-direction: column; box-sizing: border-box; font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif; }
    .widget-captcha-header { background-color: #7a92d5; color: #ffffff; padding: 12px 16px; display: flex; flex-direction: column; gap: 4px; }
    .widget-captcha-header [contenteditable="true"] { outline: none; border-radius: 2px; transition: background-color 0.2s; }
    .widget-captcha-header [contenteditable="true"]:hover { background-color: rgba(255, 255, 255, 0.2); cursor: text; }
    .captcha-text-small { font-size: 12px; opacity: 0.9; }
    .captcha-text-large { font-size: 22px; font-weight: bold; margin: 2px 0; }
    .widget-captcha-image-area { flex-grow: 1; position: relative; margin-top: 8px; overflow: hidden; }
    .captcha-placeholder-box { width: 100%; height: 100%; background-color: #d9e2ec; background-size: cover; background-position: center; background-repeat: no-repeat; }
    .captcha-grid-overlay { position: absolute; top: 0; left: 0; width: 100%; height: 100%; display: grid; grid-template-columns: repeat(3, 1fr); grid-template-rows: repeat(3, 1fr); pointer-events: none; }
    .captcha-grid-overlay div { border: 1px solid #ffffff; }
    .captcha-grid-overlay div:nth-child(-n+3) { border-top: none; }
    .captcha-grid-overlay div:nth-child(3n+1) { border-left: none; }
    .captcha-grid-overlay div:nth-child(3n) { border-right: none; }
    .captcha-grid-overlay div:nth-child(n+7) { border-bottom: none; }
    .widget-captcha-footer { display: flex; justify-content: space-between; align-items: center; padding-top: 8px; margin-top: 8px; border-top: 1px solid #f0f0f0; }
    .captcha-footer-icons { display: flex; gap: 12px; padding-left: 8px; align-items: center; }
    .captcha-footer-icons svg { width: 26px; height: 26px; color: #999999; }
    .captcha-skip-btn { background-color: #7a92d5; color: #ffffff; border: none; padding: 8px 24px; font-size: 14px; font-weight: 500; text-transform: uppercase; text-align: center; }
</style>
<!-- 在最外层套上 wrapper -->
<div class="widget-captcha-wrapper">
    <div class="widget-captcha-container">
        <div class="widget-captcha-header">
            <span class="captcha-text-small" contenteditable="true" spellcheck="false">Select all squares that show</span>
            <span class="captcha-text-large" contenteditable="true" spellcheck="false">You</span>
            <span class="captcha-text-small" contenteditable="true" spellcheck="false">If there are none,click skip</span>
        </div>
        <div class="widget-captcha-image-area">
            <!-- 注意这里加上了 uploadable-img 类名，你的系统会自动接管点击上传 -->
            <div class="captcha-placeholder-box uploadable-img"></div>
            <div class="captcha-grid-overlay">
                <div></div><div></div><div></div>
                <div></div><div></div><div></div>
                <div></div><div></div><div></div>
            </div>
        </div>
        <div class="widget-captcha-footer">
            <div class="captcha-footer-icons">
                <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M18.2577 3.50828c0.2803 0.11609 0.463 0.38957 0.463 0.69291v4.24264c0 0.41422 -0.3358 0.75 -0.75 0.75H13.728c-0.3033 0 -0.5768 -0.18273 -0.6929 -0.46298 -0.116 -0.28026 -0.0519 -0.60285 0.1626 -0.81735l1.603 -1.603c-2.6333 -1.10138 -5.78464 -0.5796 -7.92722 1.56298 -2.83131 2.83132 -2.83131 7.42172 0 10.25302 2.8313 2.8313 7.42172 2.8313 10.25302 0 1.6462 -1.6462 2.3357 -3.8864 2.067 -6.0328 -0.0515 -0.411 0.24 -0.7859 0.651 -0.8374 0.411 -0.0514 0.7859 0.24 0.8374 0.651 0.3238 2.5861 -0.5073 5.2924 -2.4947 7.2799 -3.4171 3.4171 -8.9573 3.4171 -12.37438 0 -3.41709 -3.4171 -3.41709 -8.9573 0 -12.37438C8.55119 4.07444 12.6515 3.5312 15.9309 5.18028l1.5095 -1.50942c0.2145 -0.21449 0.537 -0.27866 0.8173 -0.16258Z" fill="currentColor" stroke="currentColor" stroke-width="0.8"></path></svg>
                <svg viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg"><path d="M12 3c-4.97 0-9 4.03-9 9v7c0 1.1.9 2 2 2h4v-8H5v-1c0-3.87 3.13-7 7-7s7 3.13 7 7v1h-4v8h4c1.1 0 2-.9 2-2v-7c0-4.97-4.03-9-9-9z"/></svg>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" xmlns="http://www.w3.org/2000/svg"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>
            </div>
            <button class="captcha-skip-btn">SKIP</button>
        </div>
    </div>
</div>`
            },
            {
                name: '双层拍立得',
                presetSize: '2x2',
                preview: '#f8f8f8',
                content: `<style>
    .widget-2x2 { width: 100%; height: 100%; background-color: transparent; position: relative; display: flex; justify-content: center; align-items: center; font-family: "Times New Roman", Times, serif; transform: scale(0.88); transform-origin: center center; }
    .polaroid { position: absolute; background: #ffffff; padding: 5px 5px 8px 5px; box-shadow: 0 3px 12px rgba(0,0,0,0.08); width: 108px; height: 142px; box-sizing: border-box; border: 1px solid #f4f4f4; }
    .card-back { transform: rotate(5deg) translate(6px, 2px); z-index: 1; background: #fdfdfd; }
    .card-front { z-index: 2; display: flex; flex-direction: column; }
    .image-placeholder { width: 100%; flex-grow: 1; background-color: #3a3a3a; border-radius: 1px; background-size: cover; background-position: center top; background-repeat: no-repeat; }
    .caption { text-align: center; margin-top: 4px; font-size: 10px; color: #444; letter-spacing: 0.5px; line-height: 1.2; min-height: 12px; outline: none; }
    .cross { position: absolute; top: 10px; left: 35px; z-index: 4; filter: drop-shadow(2px 2px 3px rgba(0,0,0,0.15)); pointer-events: none; }
    .cross-vertical { width: 7px; height: 30px; background: linear-gradient(135deg, #ffffff 0%, #ececec 100%); border-radius: 1px; }
    .cross-horizontal { width: 22px; height: 7px; background: linear-gradient(135deg, #ffffff 0%, #ececec 100%); position: absolute; top: 8px; left: -7.5px; border-radius: 1px; }
    .speech-bubble { position: absolute; top: 25px; right: 5px; background: #fffafb; padding: 6px 10px; border-radius: 16px; font-size: 11px; color: #333; z-index: 4; box-shadow: 0 2px 8px rgba(0,0,0,0.06); border: 1px solid #f0f0f0; min-width: 24px; outline: none; }
    .speech-bubble::after { content: ''; position: absolute; bottom: -7px; left: 14px; border-top: 10px solid #fffafb; border-left: 3px solid transparent; border-right: 10px solid transparent; transform: rotate(10deg); z-index: -1; }
</style>
<div class="widget-2x2">
    <div class="polaroid card-back"></div>
    <div class="polaroid card-front">
        <div class="image-placeholder uploadable-img"></div>
        <div class="caption" contenteditable="true" spellcheck="false">[Eio00s]</div>
    </div>
    <div class="cross">
        <div class="cross-vertical"></div>
        <div class="cross-horizontal"></div>
    </div>
    <div class="speech-bubble" contenteditable="true" spellcheck="false">I'm sorry...</div>
</div>`
            },
            {
                name: '甜美头像圈',
                presetSize: '2x2',
                preview: '#f2dce2',
                content: `<style>
    .widget-2x2-cute { width: 100%; height: 100%; background-color: transparent; display: flex; flex-direction: column; align-items: center; justify-content: center; font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif; position: relative; box-sizing: border-box; }
    .avatar-section { position: relative; margin-bottom: 8px; margin-top: 4px; }
    .avatar-ring { width: 80px; height: 80px; border-radius: 50%; border: 2.5px solid #f2dce2; padding: 2.5px; background-color: #ffffff; box-sizing: border-box; }
    .main-avatar { width: 100%; height: 100%; border-radius: 50%; background-color: #dcdcdc; background-size: cover; background-position: center; }
    .speech-bubble-wrapper { position: absolute; top: -10px; right: -14px; filter: drop-shadow(0 2px 6px rgba(0,0,0,0.08)); z-index: 3; }
    .speech-bubble { background: #ffffff; border-radius: 12px; padding: 4px 8px; position: relative; display: flex; justify-content: center; align-items: center; }
    .speech-bubble::after { content: ''; position: absolute; bottom: -3px; left: 50%; transform: translateX(-50%) rotate(45deg); width: 8px; height: 8px; background: #ffffff; border-radius: 2px; }
    .bubble-emoji { font-size: 16px; line-height: 1; outline: none; text-align: center; min-width: 20px; }
    .plus-badge { position: absolute; bottom: -2px; right: -2px; width: 22px; height: 22px; background-color: #f4b3c2; border-radius: 50%; border: 2.5px solid #ffffff; display: flex; justify-content: center; align-items: center; z-index: 3; }
    .plus-badge::before, .plus-badge::after { content: ''; position: absolute; background-color: #ffffff; border-radius: 1px; }
    .plus-badge::before { width: 10px; height: 2px; }
    .plus-badge::after { width: 2px; height: 10px; }
            .text-line-1 { font-size: 11px; color: #444444; font-weight: 600; margin-bottom: 6px; outline: none; text-align: center; letter-spacing: 0.5px; }
    .text-line-1 i { font-family: "Times New Roman", Times, serif; font-style: italic; font-weight: 700; font-size: 13px; }
    .text-line-2 { font-size: 9px; color: #666666; background-color: #e8e8e8; padding: 4px 12px; border-radius: 20px; outline: none; text-align: center; letter-spacing: 0.5px; }
</style>
<div class="widget-2x2-cute">
    <div class="avatar-section">
        <div class="avatar-ring">
            <div class="main-avatar uploadable-img"></div>
        </div>
        <div class="speech-bubble-wrapper">
            <div class="speech-bubble">
                <div class="bubble-emoji" contenteditable="true" spellcheck="false">🎧</div>
            </div>
        </div>
        <div class="plus-badge"></div>
    </div>
    <div class="text-line-1" contenteditable="true" spellcheck="false">* ₊ ˚ ⋆ ♡ <i>weekend</i> 🥛 :)</div>
    <div class="text-line-2" contenteditable="true" spellcheck="false"> ੈ♡ 消えない記憶 ⊹ ｡ ﾟ</div>
</div>`
            },
            {
                name: '微信气泡',
                presetSize: '2x2',
                preview: '#e9ecef',
                content: `<style>
    .widget-wechat-bubble { width: 100%; height: 100%; background: transparent; display: flex; align-items: center; justify-content: center; position: relative; }
    .widget-graphic { position: relative; width: 145px; height: 145px; filter: drop-shadow(0 6px 12px rgba(0,0,0,0.08)); }
    .wechat-svg { width: 100%; height: 100%; display: block; }
</style>
<div class="widget-wechat-bubble">
    <div class="widget-graphic">
        <svg class="wechat-svg" viewBox="-1 -1 18 18" xmlns="http://www.w3.org/2000/svg">
            <defs>
                <clipPath id="clip-large">
                    <path d="M3.638513333333333 12.123133333333332C2.239333333333333 11.117999999999999 1.3339866666666667 9.600066666666667 1.3339866666666667 7.938533333333333c0 -3.0564199999999997 2.983533333333333 -5.538466666666666 6.6666799999999995 -5.538466666666666 3.683133333333333 0 6.666666666666666 2.4820466666666663 6.666666666666666 5.538466666666666 0 3.0564 -2.983533333333333 5.538466666666666 -6.666666666666666 5.538466666666666 -0.7613333333333332 0 -1.5020733333333331 -0.1026 -2.1810866666666664 -0.3077333333333333 -0.061726666666666666 -0.020466666666666668 -0.14403333333333332 -0.020466666666666668 -0.20576 -0.020466666666666668 -0.12345999999999999 0 -0.24691333333333332 0.040999999999999995 -0.3497933333333333 0.10253333333333332l-1.4609066666666666 0.8410666666666666c-0.04115333333333333 0.020466666666666668 -0.08230666666666667 0.040999999999999995 -0.12345333333333333 0.040999999999999995 -0.12345999999999999 0 -0.22633999999999999 -0.10253333333333332 -0.22633999999999999 -0.22566666666666668 0 -0.06153333333333333 0.020573333333333332 -0.10253333333333332 0.04115333333333333 -0.16406666666666667 0.020573333333333332 -0.020533333333333334 0.20576 -0.6974666666666667 0.30863999999999997 -1.1077333333333332 0 -0.040999999999999995 0.020573333333333332 -0.10253333333333332 0.020573333333333332 -0.14353333333333332 0 -0.16413333333333333 -0.061726666666666666 -0.2872 -0.18518 -0.36926666666666663Z" />
                </clipPath>
                <!-- 核心修改：将小气泡的原始路径作为裁剪遮罩，不在这里做缩放 -->
                <clipPath id="clip-small-raw">
                    <path d="M11.176 14.429c-2.665 0 -4.826 -1.8 -4.826 -4.018 0 -2.22 2.159 -4.02 4.824 -4.02S16 8.191 16 10.411c0 1.21 -0.65 2.301 -1.666 3.036a0.32 0.32 0 0 0 -0.12 0.366l0.218 0.81a0.6 0.6 0 0 1 0.029 0.117 0.166 0.166 0 0 1 -0.162 0.162 0.2 0.2 0 0 1 -0.092 -0.03l-1.057 -0.61a0.5 0.5 0 0 0 -0.256 -0.074 0.5 0.5 0 0 0 -0.142 0.021 5.7 5.7 0 0 1 -1.576 0.22Z" />
                </clipPath>
            </defs>
            <g>
                <path d="M3.638513333333333 12.123133333333332C2.239333333333333 11.117999999999999 1.3339866666666667 9.600066666666667 1.3339866666666667 7.938533333333333c0 -3.0564199999999997 2.983533333333333 -5.538466666666666 6.6666799999999995 -5.538466666666666 3.683133333333333 0 6.666666666666666 2.4820466666666663 6.666666666666666 5.538466666666666 0 3.0564 -2.983533333333333 5.538466666666666 -6.666666666666666 5.538466666666666 -0.7613333333333332 0 -1.5020733333333331 -0.1026 -2.1810866666666664 -0.3077333333333333 -0.061726666666666666 -0.020466666666666668 -0.14403333333333332 -0.020466666666666668 -0.20576 -0.020466666666666668 -0.12345999999999999 0 -0.24691333333333332 0.040999999999999995 -0.3497933333333333 0.10253333333333332l-1.4609066666666666 0.8410666666666666c-0.04115333333333333 0.020466666666666668 -0.08230666666666667 0.040999999999999995 -0.12345333333333333 0.040999999999999995 -0.12345999999999999 0 -0.22633999999999999 -0.10253333333333332 -0.22633999999999999 -0.22566666666666668 0 -0.06153333333333333 0.020573333333333332 -0.10253333333333332 0.04115333333333333 -0.16406666666666667 0.020573333333333332 -0.020533333333333334 0.20576 -0.6974666666666667 0.30863999999999997 -1.1077333333333332 0 -0.040999999999999995 0.020573333333333332 -0.10253333333333332 0.020573333333333332 -0.14353333333333332 0 -0.16413333333333333 -0.061726666666666666 -0.2872 -0.18518 -0.36926666666666663Z" fill="#fff" stroke="#f3d8e3" stroke-width="1.2" stroke-linejoin="round" />
                <image href="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg'%3E%3Crect width='100%25' height='100%25' fill='%23ffe6f0'/%3E%3C/svg%3E" x="1" y="2" width="14" height="14" preserveAspectRatio="xMidYMid slice" clip-path="url(#clip-large)" />
            </g>
            <!-- 核心修改：将缩放和位移应用在整个组 <g> 上，内部的图片和裁剪遮罩坐标保持原始比例，彻底解决错位问题 -->
            <g transform="translate(3.5, 3.5) scale(0.7)">
                <path d="M11.176 14.429c-2.665 0 -4.826 -1.8 -4.826 -4.018 0 -2.22 2.159 -4.02 4.824 -4.02S16 8.191 16 10.411c0 1.21 -0.65 2.301 -1.666 3.036a0.32 0.32 0 0 0 -0.12 0.366l0.218 0.81a0.6 0.6 0 0 1 0.029 0.117 0.166 0.166 0 0 1 -0.162 0.162 0.2 0.2 0 0 1 -0.092 -0.03l-1.057 -0.61a0.5 0.5 0 0 0 -0.256 -0.074 0.5 0.5 0 0 0 -0.142 0.021 5.7 5.7 0 0 1 -1.576 0.22Z" fill="#fff" stroke="#f3d8e3" stroke-width="1.7" stroke-linejoin="round" />
                <image href="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg'%3E%3Crect width='100%25' height='100%25' fill='%23e6f0ff'/%3E%3C/svg%3E" x="5" y="5" width="12" height="12" preserveAspectRatio="xMidYMid slice" clip-path="url(#clip-small-raw)" />
            </g>
        </svg>
    </div>
</div>`
            },
            {
                name: '小猫边框',
                presetSize: '2x2',
                preview: '#e9ecef',
                content: `<style>
    .widget-cat-container { width: 100%; height: 100%; display: flex; justify-content: center; align-items: center; background: transparent; }
    /* 核心修改：将小猫边框进一步放大到 175px */
    .widget-cat-graphic { width: 175px; height: 175px; filter: drop-shadow(0 6px 12px rgba(0,0,0,0.08)); }
    .cat-svg { width: 100%; height: 100%; display: block; }
</style>
<div class="widget-cat-container">
    <div class="widget-cat-graphic">
        <svg class="cat-svg" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <defs>
                <clipPath id="cat-shape-clip">
                    <path d="M9.60601 5.5625c0.76609 0 0.91369 -0.15614 2.39399 -0.15614 1.4804 0 1.6279 0.15614 2.394 0.15614 0.6384 0 2.5537 -1.56239 3.5113 -1.56239 0.9576 0 2.0748 0.5625 2.0748 2.1875V8.0625c-0.002 0.49219 -0.1808 2.0009 -0.8808 1.59772 1.112 1.31418 0.8807 2.92128 0.8808 4.33978 0 3.9062 -5.2669 5 -7.9801 5 -2.71323 0 -7.98006 -1.0938 -7.98006 -5 0.00001 -1.4185 -0.23119 -3.0256 0.88072 -4.33978 -0.69994 0.40318 -0.87878 -1.10553 -0.88071 -1.59772v-1.875C4.01995 4.5625 5.13715 4 6.09476 4c0.9576 0 2.87284 1.5625 3.51125 1.5625Z" />
                </clipPath>
            </defs>
            <image href="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg'%3E%3Crect width='100%25' height='100%25' fill='%23ffe4e1'/%3E%3C/svg%3E" x="0" y="0" width="24" height="24" preserveAspectRatio="xMidYMid slice" clip-path="url(#cat-shape-clip)" />
            <path d="M9.60601 5.5625c0.76609 0 0.91369 -0.15614 2.39399 -0.15614 1.4804 0 1.6279 0.15614 2.394 0.15614 0.6384 0 2.5537 -1.56239 3.5113 -1.56239 0.9576 0 2.0748 0.5625 2.0748 2.1875V8.0625c-0.002 0.49219 -0.1808 2.0009 -0.8808 1.59772 1.112 1.31418 0.8807 2.92128 0.8808 4.33978 0 3.9062 -5.2669 5 -7.9801 5 -2.71323 0 -7.98006 -1.0938 -7.98006 -5 0.00001 -1.4185 -0.23119 -3.0256 0.88072 -4.33978 -0.69994 0.40318 -0.87878 -1.10553 -0.88071 -1.59772v-1.875C4.01995 4.5625 5.13715 4 6.09476 4c0.9576 0 2.87284 1.5625 3.51125 1.5625Z" fill="none" stroke="#555555" stroke-width="0.4" stroke-linejoin="round" />
            <g fill="#333333">
                <path d="M17.8633 13.375c0 -0.4142 0.3358 -0.75 0.75 -0.75 0.2957 0 0.6502 0.0674 0.9806 0.1487 0.3447 0.0848 0.7194 0.1992 1.0765 0.3213 0.6839 0.2339 1.4092 0.5321 1.7369 0.7437 0.3479 0.2247 0.4478 0.689 0.2231 1.0369 -0.2247 0.348 -0.689 0.4479 -1.0369 0.2232 -0.1562 -0.1009 -0.7213 -0.3495 -1.4084 -0.5844 -0.3283 -0.1123 -0.6592 -0.2127 -0.9496 -0.2842 -0.3047 -0.0749 -0.5148 -0.1052 -0.6222 -0.1052 -0.4142 0 -0.75 -0.3358 -0.75 -0.75Z" />
                <path d="M17.968 15.125c-0.4143 0 -0.75 0.3358 -0.75 0.75s0.3357 0.75 0.75 0.75c0.2062 0 0.5496 0.1152 0.9802 0.3428 0.342 0.1807 0.6557 0.3855 0.901 0.5456 0.0461 0.0301 0.0902 0.0589 0.1312 0.0854 0.348 0.2247 0.8122 0.1248 1.037 -0.2232 0.2247 -0.3479 0.1248 -0.8122 -0.2232 -1.0369 -0.0331 -0.0214 -0.0709 -0.0461 -0.1129 -0.0735 -0.2424 -0.1585 -0.6226 -0.4071 -1.0323 -0.6236 -0.4564 -0.2412 -1.0808 -0.5166 -1.681 -0.5166Z" />
                <path d="M3.81532 14.5144c-0.68709 0.2349 -1.25212 0.4835 -1.40834 0.5844 -0.34795 0.2247 -0.8122 0.1248 -1.03692 -0.2232 -0.22472 -0.3479 -0.12482 -0.8122 0.22314 -1.0369 0.32765 -0.2116 1.05294 -0.5098 1.73683 -0.7437 0.35715 -0.1221 0.73187 -0.2365 1.07657 -0.3213 0.33036 -0.0813 0.68484 -0.1487 0.98059 -0.1487 0.41422 0 0.75 0.3358 0.75 0.75s-0.33578 0.75 -0.75 0.75c-0.10746 0 -0.31751 0.0303 -0.62223 0.1052 -0.29038 0.0715 -0.62131 0.1719 -0.94964 0.2842Z" />
                <path d="M4.02026 17.5988c0.04113 -0.0266 0.08496 -0.0552 0.13121 -0.0854 0.24533 -0.1601 0.55901 -0.3649 0.90101 -0.5456 0.43065 -0.2276 0.77406 -0.3428 0.98025 -0.3428 0.41422 0 0.75 -0.3358 0.75 -0.75s-0.33578 -0.75 -0.75 -0.75c-0.60026 0 -1.2246 0.2754 -1.68104 0.5166 -0.40972 0.2165 -0.78991 0.4651 -1.03231 0.6236 -0.04187 0.0273 -0.07982 0.0522 -0.1129 0.0735 -0.34796 0.2247 -0.44786 0.689 -0.22314 1.0369 0.22472 0.348 0.68897 0.4479 1.03692 0.2232Z" />
            </g>
        </svg>
    </div>
</div>`
            },
            {
                name: '双人音乐卡片',
                presetSize: '2x2',
                preview: '#eef0f5',
                content: `<style>
    .widget-music-duo { width: 100%; height: 100%; padding: 12px; box-sizing: border-box; display: flex; flex-direction: column; justify-content: space-between; background-color: transparent; font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif; }
    .widget-music-duo .avatars-section { display: flex; justify-content: center; gap: 4px; margin-top: 4px; }
    .widget-music-duo .avatar-group { display: flex; flex-direction: column; align-items: center; }
    .widget-music-duo .tooltip { background-color: #ffffff; padding: 6px 10px; border-radius: 12px; font-size: 11px; font-weight: 600; color: #111; box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06); margin-bottom: -10px; position: relative; z-index: 2; }
    .widget-music-duo .tooltip::after { content: ''; position: absolute; bottom: -4px; left: 50%; transform: translateX(-50%); border-width: 5px 5px 0; border-style: solid; border-color: #ffffff transparent transparent transparent; filter: drop-shadow(0 1px 1px rgba(0,0,0,0.03)); }
    .widget-music-duo .avatar-wrapper { position: relative; width: 56px; height: 56px; border-radius: 50%; border: 2px solid #dcdcdc; padding: 2px; box-sizing: border-box; z-index: 1; }
    .widget-music-duo .avatar-placeholder { width: 100%; height: 100%; border-radius: 50%; background-color: #d8d8d8; background-size: cover; background-position: center; }
    .widget-music-duo .badge { position: absolute; bottom: 0; right: 0; width: 16px; height: 16px; background-color: #52c41a; border-radius: 50%; border: 1.5px solid #ffffff; display: flex; justify-content: center; align-items: center; }
    .widget-music-duo .music-card { background-color: #f5f6fa; border-radius: 10px; padding: 8px 12px; display: flex; align-items: center; gap: 8px; box-shadow: 0 2px 6px rgba(0,0,0,0.03); }
    .widget-music-duo .music-cover { width: 32px; height: 32px; background-color: #345bb5; border-radius: 6px; display: flex; justify-content: center; align-items: center; background-size: cover; background-position: center; flex-shrink: 0; }
    .widget-music-duo .play-icon-svg { width: 10px; height: 10px; margin-left: 2px; fill: #ffffff; stroke: #ffffff; stroke-width: 2px; stroke-linejoin: round; stroke-linecap: round; }
    .widget-music-duo .music-info { display: flex; flex-direction: column; gap: 2px; overflow: hidden; }
    .widget-music-duo .music-title { font-size: 12px; color: #333; font-weight: 500; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
    .widget-music-duo .music-artist { font-size: 9px; color: #999; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
    .widget-music-duo .action-bar { display: flex; justify-content: space-between; align-items: center; padding: 0 2px; margin-bottom: 2px; }
    .widget-music-duo .action-left { display: flex; gap: 6px; }
    .widget-music-duo .action-btn { display: flex; align-items: center; gap: 3px; color: #888; font-size: 10px; }
    .widget-music-duo .action-btn svg { width: 11px; height: 11px; }
    .widget-music-duo .more-btn { color: #888; font-size: 12px; letter-spacing: 1px; margin-bottom: 4px; }
    .widget-music-duo [contenteditable="true"] { outline: none; transition: background-color 0.2s; }
</style>
<div class="widget-music-duo">
    <div class="avatars-section">
        <div class="avatar-group">
            <div class="tooltip" contenteditable="true" spellcheck="false">@itoshirin</div>
            <div class="avatar-wrapper">
                <div class="avatar-placeholder uploadable-img" style="background-color: #e0e0e0;"></div>
                <div class="badge">
                    <svg viewBox="0 0 24 24" width="10" height="10" stroke="#ffffff" stroke-width="4" stroke-linecap="round">
                        <line x1="12" y1="5" x2="12" y2="19"></line>
                        <line x1="5" y1="12" x2="19" y2="12"></line>
                    </svg>
                </div>
            </div>
        </div>
        <div class="avatar-group">
            <div class="tooltip" contenteditable="true" spellcheck="false">@itoshisae</div>
            <div class="avatar-wrapper">
                <div class="avatar-placeholder uploadable-img" style="background-color: #d0d0d0;"></div>
                <div class="badge" style="background-color: #52c41a;"></div>
            </div>
        </div>
    </div>
    <div class="music-card">
        <div class="music-cover uploadable-img">
            <svg class="play-icon-svg" viewBox="0 0 24 24">
                <path d="M6 4.5L19 12 6 19.5z"></path>
            </svg>
        </div>
        <div class="music-info">
            <div class="music-title" contenteditable="true" spellcheck="false">水星</div>
            <div class="music-artist" contenteditable="true" spellcheck="false">ラブリーサマーちゃん</div>
        </div>
    </div>
    <div class="action-bar">
        <div class="action-left">
            <div class="action-btn">
                <svg viewBox="0 0 16 16" fill="currentColor" stroke="currentColor" stroke-width="0.5" xmlns="http://www.w3.org/2000/svg">
                  <path d="M7.333333333333333 1.3662533333333333v1.341673333333333C4.702459999999999 3.035993333333333 2.6666666666666665 5.280253333333333 2.6666666666666665 8c0 2.9455333333333336 2.387813333333333 5.333333333333333 5.333333333333333 5.333333333333333 2.719733333333333 0 4.9639999999999995 -2.0358 5.292066666666667 -4.666666666666666h1.3416666666666668c-0.3344666666666667 3.3688666666666665 -3.1768666666666663 6 -6.633733333333333 6 -3.6818999999999997 0 -6.666666666666666 -2.9848 -6.666666666666666 -6.666666666666666 0 -3.4568999999999996 2.63112 -6.299266666666666 6 -6.633746666666667Zm6 2.24322 -5.333333333333333 5.333326666666666L7.0572 8l5.333333333333333 -5.333333333333333H9.333333333333332V1.3333333333333333h5.333333333333333v5.333333333333333h-1.3333333333333333V3.609473333333333Z"></path>
                </svg>
                分享
            </div>
            <div class="action-btn">
                <svg viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M11.925533333333334 5.651H4.096533333333333c-0.2076 0 -0.4067333333333333 0.08246666666666666 -0.5536 0.22926666666666665 -0.14679999999999999 0.14679999999999999 -0.22926666666666665 0.3459333333333333 -0.22926666666666665 0.5536 0 0.2076 0.08246666666666666 0.40679999999999994 0.22926666666666665 0.5536 0.14686666666666665 0.14679999999999999 0.346 0.22926666666666665 0.5536 0.22926666666666665h7.828999999999999c0.2076 0 0.40679999999999994 -0.08246666666666666 0.5536 -0.22926666666666665s0.22926666666666665 -0.346 0.22926666666666665 -0.5536c0 -0.20766666666666667 -0.08253333333333332 -0.40679999999999994 -0.22926666666666665 -0.5536 -0.14679999999999999 -0.14679999999999999 -0.346 -0.22926666666666665 -0.5536 -0.22926666666666665Zm-3.1315999999999997 3.1315333333333335H4.096533333333333c-0.2076 0 -0.4067333333333333 0.08253333333333332 -0.5536 0.2293333333333333 -0.14679999999999999 0.14679999999999999 -0.22926666666666665 0.3459333333333333 -0.22926666666666665 0.5536 0 0.2076 0.08246666666666666 0.40679999999999994 0.22926666666666665 0.5536 0.14686666666666665 0.14679999999999999 0.346 0.22926666666666665 0.5536 0.22926666666666665h4.6974c0.2076 0 0.40679999999999994 -0.08246666666666666 0.5536 -0.22926666666666665s0.22926666666666665 -0.346 0.22926666666666665 -0.5536c0 -0.20766666666666667 -0.08246666666666666 -0.40679999999999994 -0.22926666666666665 -0.5536s-0.346 -0.2293333333333333 -0.5536 -0.2293333333333333ZM8.011066666666666 0.17066666666666666c-1.0281333333333333 0 -2.0462 0.20253333333333334 -2.9960666666666667 0.596 -0.9498666666666666 0.39339999999999997 -1.8128666666666666 0.9700666666666666 -2.5398666666666667 1.6970666666666665C1.0069333333333332 3.9319333333333333 0.18206666666666665 5.923266666666667 0.18206666666666665 7.999666666666666c-0.006866666666666667 1.8077999999999999 0.6191333333333333 3.561 1.7693333333333332 4.955733333333333L0.3856 14.5212c-0.10859999999999999 0.11006666666666666 -0.18219999999999997 0.24986666666666668 -0.21146666666666664 0.40173333333333333 -0.029266666666666667 0.1519333333333333 -0.012866666666666667 0.30906666666666666 0.04706666666666666 0.4516 0.06506666666666666 0.14086666666666664 0.17046666666666666 0.2592 0.3028666666666666 0.34006666666666663 0.1324 0.08093333333333333 0.28586666666666666 0.12053333333333333 0.44086666666666663 0.114h7.046133333333334c2.0763999999999996 0 4.067666666666666 -0.8248666666666666 5.535933333333333 -2.2929999999999997 1.4681333333333333 -1.4682666666666666 2.2929999999999997 -3.4595333333333333 2.2929999999999997 -5.535933333333333 0 -2.0763999999999996 -0.8248666666666666 -4.067733333333333 -2.2929999999999997 -5.535933333333333C12.078733333333332 0.9955333333333334 10.087466666666666 0.17066666666666666 8.011066666666666 0.17066666666666666Zm0 14.092133333333333h-5.159333333333333l0.7281333333333333 -0.7280666666666666c0.14579999999999999 -0.14673333333333333 0.22759999999999997 -0.34506666666666663 0.22759999999999997 -0.5519333333333333s-0.0818 -0.4052 -0.22759999999999997 -0.5519333333333333c-1.0252 -1.0240666666666667 -1.663533333333333 -2.3718 -1.8064 -3.8136666666666668 -0.14286666666666664 -1.4419333333333333 0.21860000000000002 -2.888733333333333 1.0228666666666666 -4.093999999999999C3.6006 3.318 4.797866666666666 2.4288666666666665 6.184133333333333 2.0073333333333334c1.3862666666666668 -0.42146666666666666 2.8758 -0.34926666666666667 4.2148666666666665 0.2043333333333333 1.3390666666666666 0.5535333333333333 2.444733333333333 1.5543333333333333 3.1286666666666663 2.831666666666666 0.6839333333333333 1.2773999999999999 0.9037999999999999 2.7523999999999997 0.6221333333333333 4.173733333333333 -0.28159999999999996 1.4213333333333333 -1.0473333333333332 2.7009999999999996 -2.166733333333333 3.6210666666666667 -1.1193333333333333 0.9200666666666667 -2.523066666666667 1.4235333333333333 -3.972 1.4246666666666665Z" fill="currentColor" stroke-width="0.6667"></path>
                </svg>
                评论
            </div>
            <div class="action-btn">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 2-1.7l1.38-9a2 2 0 0 0-2-2.3zM7 22H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h3"></path>
                </svg>
                赞
            </div>
        </div>
        <div class="more-btn">⋮</div>
    </div>
</div>`
            },
            {
                name: '可爱气泡对话',
                presetSize: '2x2',
                preview: '#e9ecef',
                content: `<style>
    .widget-cute-bubble { width: 100%; height: 100%; display: flex; flex-direction: column; justify-content: center; gap: 12px; box-sizing: border-box; font-family: 'Nunito', 'PingFang SC', 'Microsoft YaHei', sans-serif; background: transparent; }
    .widget-cute-bubble .bubble { display: flex; align-items: center; background-color: #f4f5f7; border-radius: 50px; padding: 6px; width: 100%; box-sizing: border-box; box-shadow: 0 2px 8px rgba(0,0,0,0.05); }
    .widget-cute-bubble .bubble-top { padding-right: 12px; }
    .widget-cute-bubble .bubble-bottom { padding-left: 12px; justify-content: flex-end; }
    .widget-cute-bubble .avatar-container { width: 36px; height: 36px; border-radius: 50%; flex-shrink: 0; overflow: hidden; }
    .widget-cute-bubble .avatar-grey { background-color: #b3b3b3; margin-right: 8px; background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24'%3E%3Cpath fill='%23ffffff' opacity='0.8' d='M12 .587l3.668 7.568 8.332 1.151-6.064 5.828 1.48 8.279-7.416-3.967-7.417 3.967 1.481-8.279-6.064-5.828 8.332-1.151z' transform='scale(0.3) translate(20, 20)'/%3E%3C/svg%3E"); background-size: 12px 12px; }
    .widget-cute-bubble .avatar-blue { background-color: #eef4fa; margin-left: 8px; background-image: radial-gradient(#c5d6e8 15%, transparent 16%); background-size: 8px 8px; background-position: 0 0, 4px 4px; }
    .widget-cute-bubble .avatar-inner { width: 100%; height: 100%; background-size: cover; background-position: center; background-repeat: no-repeat; }
    .widget-cute-bubble .content { display: flex; flex-direction: column; gap: 2px; overflow: hidden; }
    .widget-cute-bubble .content-center { align-items: center; text-align: center; }
    .widget-cute-bubble [contenteditable="true"] { outline: none; border-bottom: 1px dashed transparent; white-space: nowrap; }
    .widget-cute-bubble .time { font-size: 9px; color: #666666; }
    .widget-cute-bubble .text { font-size: 11px; color: #4a4a4a; font-weight: 600; }
    .widget-cute-bubble .text-kaomoji { font-size: 10px; color: #555555; font-weight: 500; }
</style>
<div class="widget-cute-bubble">
    <div class="bubble bubble-top">
        <div class="avatar-container avatar-grey">
            <div class="avatar-inner uploadable-img"></div>
        </div>
        <div class="content">
            <div class="time" contenteditable="true" spellcheck="false">2026-07-13 11:12</div>
            <div class="text" contenteditable="true" spellcheck="false">i luv u &lt;3... ☓ ₊* ♡</div>
        </div>
    </div>
    <div class="bubble bubble-bottom">
        <div class="content content-center">
            <div class="text-kaomoji" contenteditable="true" spellcheck="false">- ѡ - ₊⁺ 딩동 ⁺ ₊</div>
            <div class="text-kaomoji" contenteditable="true" spellcheck="false">✞ ₊ ˚ ʚ행복 확산ɞ ✩ ‧ ₊ ⊖</div>
        </div>
        <div class="avatar-container avatar-blue">
            <div class="avatar-inner uploadable-img"></div>
        </div>
    </div>
</div>`
            },
            {
                name: '双图选择卡片',
                presetSize: '2x2',
                preview: 'linear-gradient(135deg, #e0c3fc 0%, #8ec5fc 100%)',
                content: `<style>
    .widget-custom-2x2 { width: 100%; height: 100%; background-color: transparent; border-radius: 18px; padding: 12px; box-sizing: border-box; display: flex; flex-direction: column; justify-content: space-between; font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif; }
    .widget-custom-2x2 .widget-title { text-align: center; font-size: 11px; color: #333333; font-weight: 600; margin-top: 4px; letter-spacing: 0.5px; outline: none; white-space: nowrap; overflow: hidden; text-shadow: 0 1px 2px rgba(255,255,255,0.5); }
    .widget-custom-2x2 .widget-images { display: flex; justify-content: space-between; gap: 8px; flex-grow: 1; margin: 8px 0; }
    .widget-custom-2x2 .image-item { flex: 1; border-radius: 10px; background-size: cover; background-position: center; background-repeat: no-repeat; box-shadow: 0 2px 6px rgba(0,0,0,0.1); }
    .widget-custom-2x2 .img-left { background-color: #c2d6c6; }
    .widget-custom-2x2 .img-right { background-color: #dcdcdc; }
    .widget-custom-2x2 .widget-footer { display: flex; justify-content: center; margin-bottom: 2px; }
    .widget-custom-2x2 .action-btn { width: 85%; padding: 6px 0; border-radius: 20px; border: 1.5px solid rgba(255, 255, 255, 0.6); background-color: rgba(255, 255, 255, 0.3); color: #333333; font-size: 11px; font-weight: 600; text-align: center; outline: none; backdrop-filter: blur(4px); -webkit-backdrop-filter: blur(4px); }
</style>
<div class="widget-custom-2x2">
    <div class="widget-title" contenteditable="true" spellcheck="false">선택해 주십시오.</div>
    <div class="widget-images">
        <!-- 加上了 uploadable-img，您的系统会自动接管点击上传 -->
        <div class="image-item img-left uploadable-img"></div>
        <div class="image-item img-right uploadable-img"></div>
    </div>
    <div class="widget-footer">
        <div class="action-btn" contenteditable="true" spellcheck="false">사용</div>
    </div>
</div>`
            },
            {
                name: '验证码输入卡片',
                presetSize: '2x2',
                preview: '#ffffff',
                content: `<style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    .widget-verify-wrapper { width: 100%; height: 100%; padding: 10px; box-sizing: border-box; display: flex; justify-content: center; align-items: center; background-color: transparent; }
    .widget-verify-container { width: 100%; height: 100%; background-color: #ffffff; border-radius: 4px; padding: 6px 7px 7px 7px; display: flex; flex-direction: column; border: 1px solid #d4d4d8; box-shadow: 0 2px 8px rgba(0,0,0,0.06); font-family: -apple-system, BlinkMacSystemFont, "SF Pro Text", "Segoe UI", Roboto, Helvetica, Arial, sans-serif; box-sizing: border-box; user-select: none; }
    .widget-verify-container .header-text { font-size: 8px; font-weight: 500; color: #27272a; margin-bottom: 3px; padding-left: 1px; outline: none; white-space: nowrap; overflow: hidden; }
    .widget-verify-container .image-placeholder { flex: 1; width: 100%; background-color: #a1a1aa; border-radius: 1.5px; background-size: cover; background-position: center; background-repeat: no-repeat; }
    .widget-verify-container .info-row { display: flex; justify-content: space-between; align-items: center; margin-top: 4px; margin-bottom: 3px; padding: 0 1px; }
    .widget-verify-container .info-left { font-size: 7px; font-weight: 500; color: #3f3f46; outline: none; white-space: nowrap; overflow: hidden; }
    .widget-verify-container .info-right { font-size: 6.5px; font-weight: 600; color: #3f3f46; letter-spacing: 0.2px; outline: none; white-space: nowrap; }
    .widget-verify-container .input-row { display: flex; gap: 4px; height: 14px; }
    .widget-verify-container .input-box { flex: 1; border: 1px solid #c4c4c8; border-radius: 1.5px; background-color: #ffffff; padding: 0 4px; display: flex; align-items: center; font-size: 7.5px; font-weight: 600; color: #09090b; letter-spacing: -0.2px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; outline: none; line-height: 1; }
    .widget-verify-container .enter-btn { width: 44px; height: 100%; border: 1px solid #c4c4c8; border-radius: 1.5px; background-color: #ffffff; display: flex; justify-content: center; align-items: center; flex-shrink: 0; }
    .widget-verify-container .enter-btn svg { width: 9px; height: 9px; display: block; }
</style>
<div class="widget-verify-wrapper">
    <div class="widget-verify-container">
        <div class="header-text" contenteditable="true" spellcheck="false">Enter the following.</div>
        <div class="image-placeholder uploadable-img"></div>
        <div class="info-row">
            <span class="info-left" contenteditable="true" spellcheck="false">Your Answer</span>
            <span class="info-right" contenteditable="true" spellcheck="false">TRY AGAIN</span>
        </div>
        <div class="input-row">
            <div class="input-box" contenteditable="true" spellcheck="false">BitterSweetie</div>
            <div class="enter-btn">
                <svg viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" id="Enter--Streamline-Unicons">
                    <desc>Enter Streamline Icon: https://streamlinehq.com</desc>
                    <path d="M14.859666666666666 2.6054666666666666c-0.25993333333333335 0 -0.5093333333333333 0.10326666666666667 -0.6931333333333334 0.28713333333333335 -0.1839333333333333 0.18386666666666665 -0.28713333333333335 0.43320000000000003 -0.28713333333333335 0.6932v3.9212c0 0.26 -0.10333333333333333 0.5094 -0.28713333333333335 0.6932s-0.43320000000000003 0.28713333333333335 -0.6932 0.28713333333333335H3.497933333333333l1.2744 -1.2646c0.1846 -0.1846 0.28833333333333333 -0.43499999999999994 0.28833333333333333 -0.696s-0.10373333333333332 -0.5114666666666666 -0.28833333333333333 -0.6960666666666666c-0.1846 -0.1846 -0.4349333333333333 -0.28826666666666667 -0.696 -0.28826666666666667s-0.5114 0.10366666666666666 -0.696 0.28826666666666667L0.4394 8.7716c-0.08926666666666666 0.0932 -0.1592 0.20313333333333333 -0.20586666666666667 0.32353333333333334 -0.09806666666666666 0.23866666666666664 -0.09806666666666666 0.5062666666666666 0 0.7449999999999999 0.046666666666666667 0.12040000000000001 0.1166 0.23026666666666665 0.20586666666666667 0.32353333333333334l2.9409333333333336 2.9408666666666665c0.09113333333333332 0.09186666666666667 0.19953333333333334 0.1648 0.31899999999999995 0.2146 0.11946666666666667 0.0498 0.2476 0.0754 0.377 0.0754s0.2575333333333333 -0.025599999999999998 0.377 -0.0754c0.11946666666666667 -0.0498 0.22786666666666666 -0.12273333333333333 0.31899999999999995 -0.2146 0.09193333333333333 -0.09113333333333332 0.1648 -0.1996 0.2146 -0.31899999999999995 0.0498 -0.11946666666666667 0.0754 -0.2476 0.0754 -0.377s-0.025666666666666664 -0.2575333333333333 -0.0754 -0.377c-0.0498 -0.1194 -0.12266666666666666 -0.22786666666666666 -0.2146 -0.31899999999999995l-1.2744 -1.2646h9.401133333333332c0.7799333333333333 0 1.5279999999999998 -0.3098666666666666 2.079533333333333 -0.8613999999999999 0.5515333333333333 -0.5515333333333333 0.8613999999999999 -1.2995999999999999 0.8613999999999999 -2.079533333333333V3.5858c0 -0.26 -0.10333333333333333 -0.5093333333333333 -0.28713333333333335 -0.6932 -0.1838 -0.18386666666666665 -0.43320000000000003 -0.28713333333333335 -0.6932 -0.28713333333333335Z" fill="#000000" stroke-width="0.6667"></path>
                </svg>
            </div>
        </div>
    </div>
</div>`
            },
            {
                name: '评价卡片',
                presetSize: '4x4',
                preview: '#ffffff',
                content: `<style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    .widget-review-container { width: 100%; height: 100%; background-color: transparent; padding: 10px; display: flex; flex-direction: column; user-select: none; box-sizing: border-box; position: relative; font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif; }
    .widget-review-container .review-top-bar { display: flex; align-items: center; justify-content: space-between; margin-bottom: 12px; padding: 0 4px; }
    .widget-review-container .user-left { display: flex; align-items: center; gap: 10px; }
    .widget-review-container .user-avatar { width: 44px; height: 44px; border-radius: 50%; background-color: #e4e4e7; border: 1px solid #d4d4d8; background-size: cover; background-position: center; flex-shrink: 0; cursor: pointer; }
    .widget-review-container .user-info { display: flex; flex-direction: column; gap: 3px; }
    .widget-review-container .user-handle { font-size: 13px; font-weight: 800; color: #000000; outline: none; line-height: 1.1; }
    .widget-review-container .user-verified { display: flex; align-items: center; gap: 4px; font-size: 11px; font-weight: 700; color: #18181b; outline: none; }
    .widget-review-container .badge-icon { width: 12px; height: 12px; fill: #000000; flex-shrink: 0; }
    .widget-review-container .reviews-count-badge { display: flex; align-items: center; gap: 4px; font-size: 11px; font-weight: 800; color: #000000; outline: none; }
    .widget-review-container .star-icon-box { width: 11px; height: 11px; background-color: #000000; border-radius: 1.5px; display: flex; justify-content: center; align-items: center; }
    .widget-review-container .star-icon-box svg { width: 7px; height: 7px; fill: #ffffff; }
    .widget-review-container .review-card { flex: 1; background-color: #ffffff; border: 1px solid #d4d4d8; border-radius: 4px; padding: 10px; display: flex; flex-direction: column; position: relative; }
    .widget-review-container .review-card::before { content: ''; position: absolute; top: -6px; left: 18px; width: 10px; height: 10px; background-color: #ffffff; border-top: 1px solid #d4d4d8; border-left: 1px solid #d4d4d8; transform: rotate(45deg); }
    .widget-review-container .rating-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 6px; }
    .widget-review-container .stars-date-group { display: flex; align-items: center; gap: 6px; }
    .widget-review-container .stars-list { display: flex; gap: 2px; }
    .widget-review-container .star-block { width: 13px; height: 13px; background-color: #8e8e93; border-radius: 1px; display: flex; justify-content: center; align-items: center; }
    .widget-review-container .star-block svg { width: 9px; height: 9px; fill: #ffffff; }
    .widget-review-container .rating-meta { font-size: 9.5px; color: #71717a; font-weight: 500; outline: none; }
    .widget-review-container .report-badge { display: flex; align-items: center; gap: 2px; font-size: 8.5px; color: #a1a1aa; outline: none; cursor: pointer; }
    .widget-review-container .report-badge svg { width: 9px; height: 9px; fill: #a1a1aa; }
    .widget-review-container .review-title { font-size: 12px; font-weight: 800; color: #09090b; margin-bottom: 8px; outline: none; line-height: 1.2; }
    .widget-review-container .review-image-frame { flex: 1; width: 100%; border: 1px solid #e4e4e7; background-color: #d4d4d8; background-size: cover; background-position: center; background-repeat: no-repeat; border-radius: 2px; cursor: pointer; }
</style>
<div class="widget-review-container">
    <div class="review-top-bar">
        <div class="user-left">
            <div class="user-avatar uploadable-img"></div>
            <div class="user-info">
                <div class="user-handle" contenteditable="true" spellcheck="false">@DorisWorld</div>
                <div class="user-verified">
                    <svg class="badge-icon" viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 15-4-4 1.41-1.41L11 14.17l6.59-6.59L19 9l-8 8z"/></svg>
                    <span contenteditable="true" spellcheck="false">Verified</span>
                </div>
            </div>
        </div>
        <div class="reviews-count-badge">
            <div class="star-icon-box">
                <svg viewBox="0 0 24 24"><path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/></svg>
            </div>
            <span contenteditable="true" spellcheck="false">9.9k Reviews</span>
        </div>
    </div>
    <div class="review-card">
        <div class="rating-header">
            <div class="stars-date-group">
                <div class="stars-list">
                    <div class="star-block"><svg viewBox="0 0 24 24"><path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/></svg></div>
                    <div class="star-block"><svg viewBox="0 0 24 24"><path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/></svg></div>
                    <div class="star-block"><svg viewBox="0 0 24 24"><path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/></svg></div>
                    <div class="star-block"><svg viewBox="0 0 24 24"><path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/></svg></div>
                    <div class="star-block"><svg viewBox="0 0 24 24"><path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/></svg></div>
                </div>
                <span class="rating-meta" contenteditable="true" spellcheck="false">5.0 Reviewed Aug. 14, 2026</span>
            </div>
            <div class="report-badge">
                <svg viewBox="0 0 24 24"><path d="M14.4 6L14 4H5v17h2v-7h5.6l.4 2h7V6z"/></svg>
                <span contenteditable="true" spellcheck="false">Report</span>
            </div>
        </div>
        <div class="review-title" contenteditable="true" spellcheck="false">WhyDorisㅇ∀ㅇ"♡♡!!</div>
        <div class="review-image-frame uploadable-img"></div>
    </div>
</div>`
            },
            {
                name: '紧凑评价卡片',
                presetSize: '4x2',
                preview: '#ffffff',
                content: `<style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    .widget-review-4x2 { width: 100%; height: 100%; background-color: transparent; padding: 8px 12px; display: flex; flex-direction: column; justify-content: center; user-select: none; box-sizing: border-box; position: relative; font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif; }
    .widget-review-4x2 .review-top-bar { display: flex; align-items: center; justify-content: space-between; margin-bottom: 8px; padding: 0 4px; }
    .widget-review-4x2 .user-left { display: flex; align-items: center; gap: 10px; }
    .widget-review-4x2 .user-avatar { width: 40px; height: 40px; border-radius: 50%; background-color: #e4e4e7; border: 1px solid #d4d4d8; background-size: cover; background-position: center; flex-shrink: 0; cursor: pointer; }
    .widget-review-4x2 .user-info { display: flex; flex-direction: column; gap: 2px; }
    .widget-review-4x2 .user-handle { font-size: 13px; font-weight: 800; color: #000000; outline: none; line-height: 1.1; }
    .widget-review-4x2 .user-verified { display: flex; align-items: center; gap: 4px; font-size: 11px; font-weight: 700; color: #18181b; outline: none; }
    .widget-review-4x2 .badge-icon { width: 12px; height: 12px; fill: #000000; flex-shrink: 0; }
    .widget-review-4x2 .reviews-count-badge { display: flex; align-items: center; gap: 4px; font-size: 11px; font-weight: 800; color: #000000; outline: none; }
    .widget-review-4x2 .star-icon-box { width: 11px; height: 11px; background-color: #000000; border-radius: 1.5px; display: flex; justify-content: center; align-items: center; }
    .widget-review-4x2 .star-icon-box svg { width: 7px; height: 7px; fill: #ffffff; }
    .widget-review-4x2 .review-card { height: 72px; background-color: #ffffff; border: 1px solid #d4d4d8; border-radius: 3px; padding: 6px 10px; display: flex; flex-direction: column; justify-content: space-between; position: relative; box-sizing: border-box; }
    .widget-review-4x2 .review-card::before { content: ''; position: absolute; top: -5px; left: 17px; width: 8px; height: 8px; background-color: #ffffff; border-top: 1px solid #d4d4d8; border-left: 1px solid #d4d4d8; transform: rotate(45deg); }
    .widget-review-4x2 .rating-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 2px; }
    .widget-review-4x2 .stars-date-group { display: flex; align-items: center; gap: 6px; }
    .widget-review-4x2 .stars-list { display: flex; gap: 2px; }
    .widget-review-4x2 .star-block { width: 12px; height: 12px; background-color: #8e8e93; border-radius: 1px; display: flex; justify-content: center; align-items: center; }
    .widget-review-4x2 .star-block svg { width: 8px; height: 8px; fill: #ffffff; }
    .widget-review-4x2 .rating-meta { font-size: 9px; color: #71717a; font-weight: 500; outline: none; }
    .widget-review-4x2 .report-badge { display: flex; align-items: center; gap: 2px; font-size: 8px; color: #a1a1aa; outline: none; cursor: pointer; }
    .widget-review-4x2 .report-badge svg { width: 8px; height: 8px; fill: #a1a1aa; }
    .widget-review-4x2 .review-title { font-size: 11px; font-weight: 800; color: #09090b; line-height: 1.25; outline: none; word-break: break-word; }
</style>
<div class="widget-review-4x2">
    <div class="review-top-bar">
        <div class="user-left">
            <div class="user-avatar uploadable-img"></div>
            <div class="user-info">
                <div class="user-handle" contenteditable="true" spellcheck="false">@人类</div>
                <div class="user-verified">
                    <svg class="badge-icon" viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 15-4-4 1.41-1.41L11 14.17l6.59-6.59L19 9l-8 8z"/></svg>
                    <span contenteditable="true" spellcheck="false">Verified</span>
                </div>
            </div>
        </div>
        <div class="reviews-count-badge">
            <div class="star-icon-box">
                <svg viewBox="0 0 24 24"><path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/></svg>
            </div>
            <span contenteditable="true" spellcheck="false">9.9k Reviews</span>
        </div>
    </div>
    <div class="review-card">
        <div class="rating-header">
            <div class="stars-date-group">
                <div class="stars-list">
                    <div class="star-block"><svg viewBox="0 0 24 24"><path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/></svg></div>
                    <div class="star-block"><svg viewBox="0 0 24 24"><path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/></svg></div>
                    <div class="star-block"><svg viewBox="0 0 24 24"><path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/></svg></div>
                    <div class="star-block"><svg viewBox="0 0 24 24"><path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/></svg></div>
                    <div class="star-block"><svg viewBox="0 0 24 24"><path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/></svg></div>
                </div>
                <span class="rating-meta" contenteditable="true" spellcheck="false">5.0 Reviewed Aug. 14, 2026</span>
            </div>
            <div class="report-badge">
                <svg viewBox="0 0 24 24"><path d="M14.4 6L14 4H5v17h2v-7h5.6l.4 2h7V6z"/></svg>
                <span contenteditable="true" spellcheck="false">Report</span>
            </div>
        </div>
        <div class="review-title" contenteditable="true" spellcheck="false">WhyDoris?<br>ㅇ∀ㅇ"♡♡!!</div>
    </div>
</div>`
            },
            {
                name: '复古窗口相框',
                presetSize: '2x2',
                preview: '#ffffff',
                content: `<style>
    .widget-retro-wrapper { width: 100%; height: 100%; padding: 8px; box-sizing: border-box; display: flex; justify-content: center; align-items: center; background: transparent; }
    .widget-retro-window { width: 100%; height: 100%; background: #ffffff; border-radius: 4px; border: 1px solid #eaeaea; box-shadow: 0 3px 10px rgba(0, 0, 0, 0.05); box-sizing: border-box; padding: 7px 8px 8px 8px; display: flex; flex-direction: column; user-select: none; font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Hiragino Sans", "PingFang SC", sans-serif; }
    .widget-retro-window .window-header { display: flex; justify-content: space-between; align-items: center; height: 14px; margin-bottom: 6px; }
    .widget-retro-window .window-title { font-size: 9.5px; font-weight: 500; color: #1a1a1a; letter-spacing: -0.2px; display: flex; align-items: center; outline: none; }
    .widget-retro-window .window-controls { display: flex; align-items: center; gap: 5px; }
    .widget-retro-window .win-btn { display: flex; align-items: center; justify-content: center; }
    .widget-retro-window .btn-minimize { width: 8px; height: 1.2px; background-color: #000000; }
    .widget-retro-window .btn-window { width: 8px; height: 8px; border: 1px solid #000000; border-top: 2px solid #000000; box-sizing: border-box; }
    .widget-retro-window .btn-close { position: relative; width: 8px; height: 8px; }
    .widget-retro-window .btn-close::before, .widget-retro-window .btn-close::after { content: ''; position: absolute; top: 50%; left: 0; width: 8px; height: 1.2px; background-color: #000000; }
    .widget-retro-window .btn-close::before { transform: translateY(-50%) rotate(45deg); }
    .widget-retro-window .btn-close::after { transform: translateY(-50%) rotate(-45deg); }
    .widget-retro-window .window-placeholder { flex: 1; width: 100%; background-color: #e4e4e7; border-radius: 2px; background-size: cover; background-position: center; background-repeat: no-repeat; }
</style>
<div class="widget-retro-wrapper">
    <div class="widget-retro-window">
        <div class="window-header">
            <span class="window-title" contenteditable="true" spellcheck="false">i 🖤uuu so..さん...🤍</span>
            <div class="window-controls">
                <div class="win-btn"><div class="btn-minimize"></div></div>
                <div class="win-btn"><div class="btn-window"></div></div>
                <div class="win-btn"><div class="btn-close"></div></div>
            </div>
        </div>
        <div class="window-placeholder uploadable-img"></div>
    </div>
</div>`
            },
            {
                name: 'Message消息',
                presetSize: '4x2',
                preview: '#ffffff',
                content: `<style>
    * { box-sizing: border-box; margin: 0; padding: 0; }
    .widget-msg-wrapper { width: 100%; height: 100%; padding: 8px 10px; box-sizing: border-box; display: flex; align-items: center; justify-content: center; background-color: transparent; font-family: -apple-system, BlinkMacSystemFont, "PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", "Segoe UI", Roboto, sans-serif; }
    .widget-msg-card { width: 100%; height: 100%; background-color: #ffffff; border-radius: 14px; padding: 12px 16px; box-sizing: border-box; box-shadow: 0 4px 16px rgba(0, 0, 0, 0.04); display: flex; flex-direction: column; justify-content: space-between; user-select: none; }
    .widget-msg-header { font-size: 15px; font-weight: 700; color: #333333; letter-spacing: -0.2px; padding-bottom: 6px; border-bottom: 1px solid #f2f2f2; outline: none; }
    .widget-msg-list { display: flex; flex-direction: column; height: 100%; justify-content: space-around; margin-top: 4px; }
    .widget-msg-item { display: flex; align-items: center; gap: 10px; }
    .widget-msg-avatar { width: 38px; height: 38px; border-radius: 50%; flex-shrink: 0; background-size: cover; background-position: center; background-repeat: no-repeat; cursor: pointer; }
    .avatar-pink { background-color: #ffdce5; }
    .avatar-yellow { background-color: #f7f9d8; }
    .widget-msg-info { flex: 1; min-width: 0; display: flex; flex-direction: column; gap: 2px; }
    .widget-msg-name { font-size: 13px; font-weight: 700; color: #333333; outline: none; }
    .widget-msg-text { font-size: 11.5px; color: #8e8e8e; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; outline: none; }
    .widget-msg-time { font-size: 11px; color: #9e9e9e; flex-shrink: 0; align-self: flex-end; margin-bottom: 2px; outline: none; }
    .widget-msg-divider { height: 1px; background-color: #f5f5f5; width: 100%; }
    [contenteditable="true"] { outline: none; }
</style>
<div class="widget-msg-wrapper">
    <div class="widget-msg-card">
        <div class="widget-msg-header" contenteditable="true" spellcheck="false">Message</div>
        <div class="widget-msg-list">
            <div class="widget-msg-item">
                <div class="widget-msg-avatar avatar-pink uploadable-img"></div>
                <div class="widget-msg-info">
                    <div class="widget-msg-name" contenteditable="true" spellcheck="false">imissu</div>
                    <div class="widget-msg-text" contenteditable="true" spellcheck="false">幸福轮盘请指向我☆&gt;&gt;ω&lt;&lt;★.!!</div>
                </div>
                <div class="widget-msg-time" contenteditable="true" spellcheck="false">05:21</div>
            </div>
            <div class="widget-msg-divider"></div>
            <div class="widget-msg-item">
                <div class="widget-msg-avatar avatar-yellow uploadable-img"></div>
                <div class="widget-msg-info">
                    <div class="widget-msg-name" contenteditable="true" spellcheck="false">小岛梨花</div>
                    <div class="widget-msg-text" contenteditable="true" spellcheck="false">妳是冷調初雪，封存於我的記憶</div>
                </div>
                <div class="widget-msg-time" contenteditable="true" spellcheck="false">05:20</div>
            </div>
        </div>
    </div>
</div>`
            },
            {
                name: '微信消息集',
                presetSize: '4x4',
                preview: '#f2f3f7',
                content: `<style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    .widget-wechat-4x4 { width: 100%; height: 100%; background-color: transparent; padding: 12px 10px; display: flex; flex-direction: column; justify-content: space-between; user-select: none; font-family: -apple-system, BlinkMacSystemFont, "PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", sans-serif; }
    .widget-wechat-4x4 .wx-header { display: flex; flex-direction: column; align-items: center; gap: 5px; width: 100%; }
    .widget-wechat-4x4 .wx-app-name { font-size: 11.5px; color: #555555; letter-spacing: 0.5px; font-weight: 600; outline: none; }
    .widget-wechat-4x4 .wx-search-box { width: 100%; height: 26px; background: #ffffff; border-radius: 20px; display: flex; align-items: center; justify-content: center; gap: 5px; padding: 0 12px; box-shadow: 0 1px 4px rgba(0, 0, 0, 0.03); }
    .widget-wechat-4x4 .wx-search-icon { width: 10.5px; height: 10.5px; stroke: #888888; stroke-width: 2.2; fill: none; stroke-linecap: round; stroke-linejoin: round; flex-shrink: 0; }
    .widget-wechat-4x4 .wx-search-text { font-size: 10px; color: #666666; letter-spacing: 0.3px; outline: none; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
    .widget-wechat-4x4 .wx-card { background-color: #ffffff; border-radius: 16px; box-shadow: 0 2px 6px rgba(0, 0, 0, 0.03); }
    .widget-wechat-4x4 .wx-msg-card { padding: 9px 12px; display: flex; flex-direction: column; gap: 9px; }
    .widget-wechat-4x4 .wx-msg-item { display: flex; align-items: center; justify-content: space-between; gap: 8px; }
    .widget-wechat-4x4 .wx-msg-left { display: flex; align-items: center; gap: 8px; flex: 1; min-width: 0; }
    .widget-wechat-4x4 .wx-avatar { width: 31px; height: 31px; border-radius: 10px; background-color: #ffd6df; background-size: cover; background-position: center; background-repeat: no-repeat; flex-shrink: 0; cursor: pointer; }
    .widget-wechat-4x4 .wx-msg-info { display: flex; flex-direction: column; gap: 2px; flex: 1; min-width: 0; }
    .widget-wechat-4x4 .wx-title { font-size: 10.5px; font-weight: 600; color: #222222; letter-spacing: 0.2px; outline: none; }
    .widget-wechat-4x4 .wx-subtitle { font-size: 9.5px; color: #888888; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; outline: none; }
    .widget-wechat-4x4 .wx-time { font-size: 9.5px; color: #aaaaaa; align-self: flex-start; margin-top: 1px; flex-shrink: 0; outline: none; }
    .widget-wechat-4x4 .wx-photo-card { padding: 8px; display: flex; justify-content: space-between; align-items: center; gap: 8px; }
    .widget-wechat-4x4 .wx-photo { flex: 1; aspect-ratio: 1 / 1; border-radius: 14px; background-color: #ffd6df; background-size: cover; background-position: center; background-repeat: no-repeat; cursor: pointer; }
    .widget-wechat-4x4 [contenteditable="true"] { outline: none; }
</style>
<div class="widget-wechat-4x4">
    <div class="wx-header">
        <div class="wx-app-name" contenteditable="true" spellcheck="false">WeChat</div>
        <div class="wx-search-box">
            <svg class="wx-search-icon" viewBox="0 0 24 24">
                <circle cx="11" cy="11" r="7"></circle>
                <line x1="16.5" y1="16.5" x2="21" y2="21"></line>
            </svg>
            <span class="wx-search-text" contenteditable="true" spellcheck="false">一頁又一頁 幸福在哪一頁</span>
        </div>
    </div>
    <div class="wx-card wx-msg-card">
        <div class="wx-msg-item">
            <div class="wx-msg-left">
                <div class="wx-avatar uploadable-img"></div>
                <div class="wx-msg-info">
                    <div class="wx-title" contenteditable="true" spellcheck="false">青苹果</div>
                    <div class="wx-subtitle" contenteditable="true" spellcheck="false">幸福的秘诀是拥有苹果时只在意苹果</div>
                </div>
            </div>
            <div class="wx-time" contenteditable="true" spellcheck="false">5:20</div>
        </div>
        <div class="wx-msg-item">
            <div class="wx-msg-left">
                <div class="wx-avatar uploadable-img"></div>
                <div class="wx-msg-info">
                    <div class="wx-title" contenteditable="true" spellcheck="false">小岛梨花</div>
                    <div class="wx-subtitle" contenteditable="true" spellcheck="false">（ ⁃̀  ϖ  ⁃́ ）（ ⁃̀  v  ⁃́ ）（ ⁃̀  ᗨ  ⁃́ ）</div>
                </div>
            </div>
            <div class="wx-time" contenteditable="true" spellcheck="false">13:14</div>
        </div>
    </div>
    <div class="wx-card wx-photo-card">
        <div class="wx-photo uploadable-img"></div>
        <div class="wx-photo uploadable-img"></div>
    </div>
</div>`
            },
            {
                name: '音乐播放器',
                presetSize: '4x2',
                preview: '#ffffff',
                content: `<style>
    * { box-sizing: border-box; margin: 0; padding: 0; }
    html, body { width: 100%; height: 100%; background: transparent; overflow: hidden; }
    .widget-music-4x2 { width: 100%; height: 100%; background: #ffffff; border-radius: 28px; padding: 15px 20px 16px 20px; box-sizing: border-box; display: flex; flex-direction: column; justify-content: space-between; box-shadow: none; user-select: none; font-family: -apple-system, BlinkMacSystemFont, "SF Pro Display", "SF Pro Text", "Segoe UI", Roboto, Helvetica, Arial, sans-serif; }
    .widget-music-4x2 .widget-top { display: flex; align-items: center; justify-content: space-between; }
    .widget-music-4x2 .track-info-group { display: flex; align-items: center; gap: 12px; min-width: 0; }
    .widget-music-4x2 .album-cover-placeholder { width: 48px; height: 48px; border-radius: 10px; background-color: #d1d5db; flex-shrink: 0; box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1); overflow: hidden; background-size: cover; background-position: center; }
    .widget-music-4x2 .track-meta { display: flex; flex-direction: column; gap: 3px; min-width: 0; }
    .widget-music-4x2 .track-title { font-size: 15px; font-weight: 700; color: #000000; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; max-width: 210px; letter-spacing: -0.2px; line-height: 1.2; outline: none; }
    .widget-music-4x2 .track-artist-row { display: flex; align-items: center; gap: 5px; font-size: 13px; color: #8e8e93; font-weight: 400; }
    .widget-music-4x2 .track-artist { white-space: nowrap; overflow: hidden; text-overflow: ellipsis; max-width: 180px; outline: none; }
    .widget-music-4x2 .explicit-tag { display: inline-flex; align-items: center; justify-content: center; width: 13px; height: 13px; background-color: #8e8e93; color: #ffffff; font-size: 8.5px; font-weight: 700; border-radius: 2.5px; line-height: 1; transform: translateY(0.5px); }
    .widget-music-4x2 .icon-waveform { color: #b0b0b6; flex-shrink: 0; }
    .widget-music-4x2 .progress-section { display: flex; align-items: center; gap: 8px; width: 100%; margin: 1px 0; }
    .widget-music-4x2 .time-label { font-size: 11px; font-weight: 600; color: #8e8e93; font-variant-numeric: tabular-nums; width: 32px; outline: none; }
    .widget-music-4x2 .time-left { text-align: left; }
    .widget-music-4x2 .time-right { text-align: right; }
    .widget-music-4x2 .progress-track { flex: 1; height: 5px; background-color: #e5e5ea; border-radius: 999px; position: relative; overflow: hidden; }
    .widget-music-4x2 .progress-fill { position: absolute; left: 0; top: 0; height: 100%; width: 52%; background-color: #636366; border-radius: 999px; }
    .widget-music-4x2 .widget-bottom { display: flex; align-items: center; justify-content: space-between; padding: 0 2px; }
    .widget-music-4x2 .playback-controls { display: flex; align-items: center; gap: 36px; }
    .widget-music-4x2 .btn-icon { background: none; border: none; padding: 0; cursor: pointer; display: flex; align-items: center; justify-content: center; transition: transform 0.1s ease, opacity 0.1s ease; outline: none; }
    .widget-music-4x2 .btn-icon:active { transform: scale(0.9); opacity: 0.7; }
</style>
<div class="widget-music-4x2">
    <div class="widget-top">
        <div class="track-info-group">
            <div class="album-cover-placeholder uploadable-img"></div>
            <div class="track-meta">
                <div class="track-title" contenteditable="true" spellcheck="false">缘分竟然默许你离去</div>
                <div class="track-artist-row">
                    <span class="track-artist" contenteditable="true" spellcheck="false">茉莉雨/林俊杰</span>
                    <span class="explicit-tag">E</span>
                </div>
            </div>
        </div>
        <svg class="icon-waveform" width="18" height="18" viewBox="0 0 18 18" fill="currentColor">
            <rect x="1" y="6" width="2" height="6" rx="1"/>
            <rect x="4.8" y="2.5" width="2" height="13" rx="1"/>
            <rect x="8.5" y="0.5" width="2" height="17" rx="1"/>
            <rect x="12.2" y="3.5" width="2" height="11" rx="1"/>
            <rect x="16" y="7" width="2" height="4" rx="1"/>
        </svg>
    </div>
    <div class="progress-section">
        <span class="time-label time-left" contenteditable="true" spellcheck="false">1:03</span>
        <div class="progress-track">
            <div class="progress-fill"></div>
        </div>
        <span class="time-label time-right" contenteditable="true" spellcheck="false">-0:57</span>
    </div>
    <div class="widget-bottom">
        <button class="btn-icon" title="Favorite">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 48 48" id="Star--Streamline-Ionic-Filled" height="28" width="28">
                <desc>Star Streamline Icon: https://streamlinehq.com</desc>
                <path fill="#8E8E93" d="M36.937 44.9994c-0.3157 0.0013 -0.6238 -0.0972 -0.8803 -0.2812l-12.057 -8.7411 -12.0571 8.7411c-0.2576 0.1868 -0.5679 0.2869 -0.8861 0.2857 -0.3182 -0.0012 -0.6278 -0.1035 -0.884 -0.2922 -0.25623 -0.1887 -0.44579 -0.454 -0.54132 -0.7575 -0.09553 -0.3035 -0.09206 -0.6296 0.00994 -0.931L14.3436 29.095 2.1562 20.7373c-0.26398 -0.1809 -0.46322 -0.4414 -0.56861 -0.7436 -0.10538 -0.3021 -0.11139 -0.63 -0.01714 -0.9358 0.09425 -0.3058 0.28382 -0.5734 0.541 -0.7637 0.25719 -0.1904 0.56852 -0.2936 0.88849 -0.2944H18.0354l4.5374 -13.96392c0.0978 -0.30146 0.2885 -0.56423 0.5448 -0.7506 0.2564 -0.18637 0.5651 -0.28674 0.8821 -0.28674 0.3169 0 0.6257 0.10037 0.8821 0.28674 0.2563 0.18637 0.4469 0.44914 0.5447 0.7506L29.964 18.0045h15.0354c0.3203 -0.0002 0.6324 0.1023 0.8903 0.2922 0.258 0.19 0.4483 0.4577 0.5432 0.7637 0.0948 0.306 0.0892 0.6344 -0.0161 0.9369 -0.1053 0.3026 -0.3047 0.5635 -0.569 0.7446l-12.192 8.3531 4.6996 13.9245c0.0761 0.2253 0.0976 0.4657 0.0625 0.701 -0.0351 0.2354 -0.1257 0.459 -0.2642 0.6525 -0.1386 0.1934 -0.3212 0.3511 -0.5328 0.46 -0.2115 0.109 -0.446 0.166 -0.6839 0.1664Z" stroke-width="1"></path>
            </svg>
        </button>
        <div class="playback-controls">
            <button class="btn-icon" title="Rewind">
                <svg xmlns="http://www.w3.org/2000/svg" fill="#000000" class="bi bi-rewind-fill" viewBox="0 0 16 16" id="Rewind-Fill--Streamline-Bootstrap" height="36" width="36">
                    <desc>Rewind Fill Streamline Icon: https://streamlinehq.com</desc>
                    <path d="M8.404 7.304a0.802 0.802 0 0 0 0 1.392l6.363 3.692c0.52 0.302 1.233 -0.043 1.233 -0.696V4.308c0 -0.653 -0.713 -0.998 -1.233 -0.696z" stroke-width="1"></path>
                    <path d="M0.404 7.304a0.802 0.802 0 0 0 0 1.392l6.363 3.692c0.52 0.302 1.233 -0.043 1.233 -0.696V4.308c0 -0.653 -0.713 -0.998 -1.233 -0.696z" stroke-width="1"></path>
                </svg>
            </button>
            <button class="btn-icon" title="Pause">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 28" id="Controls-Pause--Streamline-Ultimate" height="39" width="26">
                    <desc>Controls Pause Streamline Icon: https://streamlinehq.com</desc>
                    <g id="Controls-Pause--Streamline-Ultimate.svg">
                        <path d="M4.3 0.2h4.4S10.2 0.2 10.2 2.2v23.6S10.2 27.8 8.7 27.8h-4.4S2.8 27.8 2.8 25.8v-23.6S2.8 0.2 4.3 0.2" fill="#000000" stroke-width="1"></path>
                        <path d="M15.3 0.2h4.4S21.2 0.2 21.2 2.2v23.6s0 2.0 -1.5 2.0h-4.4S13.8 27.8 13.8 25.8v-23.6S13.8 0.2 15.3 0.2" fill="#000000" stroke-width="1"></path>
                    </g>
                </svg>
            </button>
            <button class="btn-icon" title="Fast Forward">
                <svg xmlns="http://www.w3.org/2000/svg" fill="#000000" class="bi bi-fast-forward-fill" viewBox="0 0 16 16" id="Fast-Forward-Fill--Streamline-Bootstrap" height="36" width="36">
                    <desc>Fast Forward Fill Streamline Icon: https://streamlinehq.com</desc>
                    <path d="M7.596 7.304a0.802 0.802 0 0 1 0 1.392l-6.363 3.692C0.713 12.69 0 12.345 0 11.692V4.308c0 -0.653 0.713 -0.998 1.233 -0.696z" stroke-width="1"></path>
                    <path d="M15.596 7.304a0.802 0.802 0 0 1 0 1.392l-6.363 3.692C8.713 12.69 8 12.345 8 11.692V4.308c0 -0.653 0.713 -0.998 1.233 -0.696z" stroke-width="1"></path>
                </svg>
            </button>
        </div>
        <button class="btn-icon" title="AirPlay">
            <svg role="img" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" id="Airplayaudio--Streamline-Simple-Icons" height="26" width="26">
                <desc>Airplayaudio Streamline Icon: https://streamlinehq.com</desc>
                <title>AirPlay Audio</title>
                <path d="M11.908 0.183a12.012 12.012 0 0 0 -8.044 3.172c-4.882 4.475 -5.166 12.08 -0.692 16.962 0.204 0.244 0.448 0.447 0.692 0.692a0.315 0.315 0 0 0 0.408 -0.04l0.53 -0.61a0.32 0.32 0 0 0 0 -0.448C0.53 15.965 0.243 9.253 4.23 4.982 8.217 0.711 14.889 0.427 19.16 4.414c4.271 3.986 4.555 10.655 0.568 14.927 -0.203 0.203 -0.365 0.407 -0.568 0.57a0.32 0.32 0 0 0 0 0.447l0.53 0.611a0.37 0.37 0 0 0 0.446 0.04c4.882 -4.516 5.166 -12.081 0.692 -16.962a11.98 11.98 0 0 0 -8.92 -3.864zm0.387 3.518A8.607 8.607 0 0 0 6.143 6c-3.458 3.213 -3.66 8.623 -0.447 12.08 0.122 0.123 0.243 0.285 0.406 0.407a0.319 0.319 0 0 0 0.447 0l0.53 -0.61a0.32 0.32 0 0 0 0 -0.446A7.263 7.263 0 0 1 4.8 12.183c0 -3.946 3.212 -7.16 7.158 -7.16s7.16 3.253 7.16 7.199a7.207 7.207 0 0 1 -2.238 5.209 0.319 0.319 0 0 0 0 0.447l0.529 0.61c0.122 0.121 0.325 0.162 0.447 0.04a8.599 8.599 0 0 0 0.408 -12.122 8.494 8.494 0 0 0 -5.97 -2.705zm-0.266 3.316A5.198 5.198 0 0 0 8.34 8.48c-2.075 1.993 -2.115 5.247 -0.122 7.322l0.121 0.123a0.319 0.319 0 0 0 0.447 0l0.53 -0.611a0.32 0.32 0 0 0 0 -0.448 3.814 3.814 0 0 1 -1.098 -2.683 3.732 3.732 0 0 1 3.742 -3.742 3.732 3.732 0 0 1 3.742 3.742c0 1.017 -0.406 1.951 -1.139 2.683a0.32 0.32 0 0 0 0 0.448l0.53 0.61a0.32 0.32 0 0 0 0.447 0c2.034 -1.992 2.116 -5.246 0.123 -7.321a5.128 5.128 0 0 0 -3.633 -1.586zm0.006 7.744a0.599 0.599 0 0 0 -0.402 0.146l-0.04 0.041 -7.159 8.055a0.506 0.506 0 0 0 0.041 0.69 0.437 0.437 0 0 0 0.283 0.124h14.36a0.495 0.495 0 0 0 0.489 -0.488 0.463 0.463 0 0 0 -0.121 -0.326l-7.08 -8.055a0.5 0.5 0 0 0 -0.37 -0.187z" fill="#8E8E93" stroke-width="1"></path>
            </svg>
        </button>
    </div>
</div>`
            },
            {
                name: 'ins头像对话',
                presetSize: '2x2',
                preview: '#f5d6d6',
                content: `<style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    .widget-duo-dialog { width: 100%; height: 100%; background: transparent; display: flex; justify-content: center; align-items: center; gap: 10px; padding: 8px; font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; user-select: none; }
    .widget-duo-dialog .character-col { display: flex; flex-direction: column; align-items: center; justify-content: center; }
    .widget-duo-dialog .bubble-box { position: relative; background: #ffffff; color: #2b2b2b; font-size: 8.5px; font-weight: 700; padding: 2.5px 7px; border-radius: 8px; margin-bottom: 6px; white-space: nowrap; box-shadow: 0 2px 5px rgba(0, 0, 0, 0.08); z-index: 2; outline: none; }
    .widget-duo-dialog .bubble-box::after { content: ''; position: absolute; bottom: -3px; left: 50%; transform: translateX(-50%); width: 0; height: 0; border-left: 3.5px solid transparent; border-right: 3.5px solid transparent; border-top: 3.5px solid #ffffff; }
    .widget-duo-dialog .avatar-circle { width: 62px; height: 62px; border-radius: 50%; box-shadow: 0 3px 6px rgba(0, 0, 0, 0.05); background-size: cover; background-position: center; background-repeat: no-repeat; cursor: pointer; }
    .widget-duo-dialog .avatar-pink { background-color: #F5D6D6; }
    .widget-duo-dialog .avatar-blue { background-color: #D3E0EA; }
    .widget-duo-dialog [contenteditable="true"] { outline: none; }
</style>
<div class="widget-duo-dialog">
    <div class="character-col">
        <div class="bubble-box" contenteditable="true" spellcheck="false">。ì _ í。</div>
        <div class="avatar-circle avatar-pink uploadable-img"></div>
    </div>
    <div class="character-col">
        <div class="bubble-box" contenteditable="true" spellcheck="false">” . ∞ . “</div>
        <div class="avatar-circle avatar-blue uploadable-img"></div>
    </div>
</div>`
            },
            {
                name: '透明日系画框',
                presetSize: '2x2',
                preview: '#eaeff2',
                content: `<style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    .widget-rabbit-frame { width: 100%; height: 100%; background: transparent; padding: 6px 4px; display: flex; flex-direction: column; justify-content: space-between; overflow: hidden; user-select: none; font-family: -apple-system, BlinkMacSystemFont, "PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", sans-serif; }
    .widget-rabbit-frame .header-bar { display: flex; align-items: center; justify-content: space-between; height: 22px; width: 100%; }
    .widget-rabbit-frame .user-info { display: flex; align-items: center; gap: 5px; }
    .widget-rabbit-frame .icon-back { width: 13px; height: 13px; stroke: #333333; stroke-width: 2.2; fill: none; stroke-linecap: round; stroke-linejoin: round; display: flex; align-items: center; flex-shrink: 0; }
    .widget-rabbit-frame .avatar-placeholder { width: 22px; height: 22px; border-radius: 50%; background-color: #E2E6EA; background-size: cover; background-position: center; background-repeat: no-repeat; flex-shrink: 0; cursor: pointer; }
    .widget-rabbit-frame .nickname { font-size: 11px; font-weight: 600; color: #2c2c2c; letter-spacing: -0.2px; outline: none; }
    .widget-rabbit-frame .follow-btn { font-size: 8.5px; color: #555555; border: 0.8px solid rgba(0, 0, 0, 0.15); border-radius: 10px; padding: 1.5px 6px; background-color: rgba(255, 255, 255, 0.5); white-space: nowrap; outline: none; }
    .widget-rabbit-frame .main-image-placeholder { width: 100%; flex: 1; margin: 6px 0 5px 0; background-color: #EAEFF2; border-radius: 16px; background-size: cover; background-position: center; background-repeat: no-repeat; cursor: pointer; }
    .widget-rabbit-frame .footer-text { font-size: 7.5px; color: #7A828B; text-align: center; letter-spacing: 0.3px; white-space: nowrap; outline: none; }
    .widget-rabbit-frame [contenteditable="true"] { outline: none; }
</style>
<div class="widget-rabbit-frame">
    <div class="header-bar">
        <div class="user-info">
            <svg class="icon-back" viewBox="0 0 24 24">
                <polyline points="15 18 9 12 15 6"></polyline>
            </svg>
            <div class="avatar-placeholder uploadable-img"></div>
            <span class="nickname" contenteditable="true" spellcheck="false">小岛梨花</span>
        </div>
        <span class="follow-btn" contenteditable="true" spellcheck="false">已关注</span>
    </div>
    <div class="main-image-placeholder uploadable-img"></div>
    <div class="footer-text" contenteditable="true" spellcheck="false">°[ ·✦Kitten貓の幸福記錄冊·]</div>
</div>`
            },
            {
                name: '极简通讯卡片',
                presetSize: '4x4',
                preview: '#f1f5f9',
                content: `<style>
    * { box-sizing: border-box; margin: 0; padding: 0; }
    .widget-4x4-profile { width: 100%; height: 100%; padding: 8px 14px 10px; background: transparent; display: flex; flex-direction: column; justify-content: space-between; align-items: center; user-select: none; font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; }
    .widget-4x4-profile .profile-section { display: flex; flex-direction: column; align-items: center; text-align: center; }
    .widget-4x4-profile .avatar-wrapper { width: 120px; height: 120px; border-radius: 50%; padding: 4.5px; background: rgba(255, 255, 255, 0.95); margin-bottom: 3px; box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05); }
    .widget-4x4-profile .avatar-placeholder { width: 100%; height: 100%; border-radius: 50%; background-color: #cbd5e1; background-size: cover; background-position: center; background-repeat: no-repeat; cursor: pointer; }
    .widget-4x4-profile .profile-title { font-family: Georgia, serif; font-size: 24px; font-weight: 700; color: #1e293b; letter-spacing: 0.4px; line-height: 1.1; margin-bottom: 2px; outline: none; }
    .widget-4x4-profile .profile-subtitle { font-size: 13px; color: #64748b; font-weight: 500; letter-spacing: 0.1px; outline: none; }
    .widget-4x4-profile .action-grid { width: 100%; display: grid; grid-template-columns: repeat(4, 1fr); gap: 7px; margin-top: 4px; margin-bottom: 6px; }
    .widget-4x4-profile .action-btn { height: 38px; background: rgba(255, 255, 255, 0.7); backdrop-filter: blur(10px); -webkit-backdrop-filter: blur(10px); border-radius: 10px; display: flex; align-items: center; justify-content: center; border: 1px solid rgba(255, 255, 255, 0.5); box-shadow: 0 1px 3px rgba(0, 0, 0, 0.02); }
    .widget-4x4-profile .action-btn svg { width: 25px; height: 25px; }
    .widget-4x4-profile .action-btn svg path { fill: #1e293b; }
    .widget-4x4-profile .cards-grid { width: 100%; display: grid; grid-template-columns: repeat(3, 1fr); gap: 8px; }
    .widget-4x4-profile .placeholder-card { width: 100%; aspect-ratio: 1 / 1; border-radius: 13px; background-size: cover; background-position: center; background-repeat: no-repeat; cursor: pointer; }
    .widget-4x4-profile .card-1 { background-color: #475569; }
    .widget-4x4-profile .card-2 { background-color: #94a3b8; }
    .widget-4x4-profile .card-3 { background-color: #334155; }
    .widget-4x4-profile [contenteditable="true"] { outline: none; }
</style>
<div class="widget-4x4-profile">
    <div class="profile-section">
        <div class="avatar-wrapper">
            <div class="avatar-placeholder uploadable-img"></div>
        </div>
        <h2 class="profile-title" contenteditable="true" spellcheck="false">小岛梨花</h2>
        <p class="profile-subtitle" contenteditable="true" spellcheck="false">於你而言我是一顆星嗎</p>
    </div>
    <div class="action-grid">
        <div class="action-btn">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" id="Imessage-Logo--Streamline-Logos">
                <path fill="#000000" d="m4.16 21.633 -0.002 0.002 -0.79 0.741 1.076 0.12a7.785 7.785 0 0 0 2.691 -0.199c0.891 -0.234 1.828 -0.688 2.422 -1.532 0.786 0.154 1.604 0.235 2.443 0.235 6 0 11 -4.184 11 -9.5S18 2 12 2 1 6.184 1 11.5c0 3.236 1.866 6.065 4.668 7.77 -0.086 0.471 -0.377 0.994 -0.723 1.462a7.726 7.726 0 0 1 -0.773 0.89l-0.012 0.011Z" stroke-width="1"></path>
            </svg>
        </div>
        <div class="action-btn">
            <svg xmlns="http://www.w3.org/2000/svg" fill="#000000" class="bi bi-telephone-fill" viewBox="0 0 16 16" id="Telephone-Fill--Streamline-Bootstrap">
                <path fill-rule="evenodd" d="M1.885 0.511a1.745 1.745 0 0 1 2.61 0.163L6.29 2.98c0.329 0.423 0.445 0.974 0.315 1.494l-0.547 2.19a0.68 0.68 0 0 0 0.178 0.643l2.457 2.457a0.68 0.68 0 0 0 0.644 0.178l2.189 -0.547a1.75 1.75 0 0 1 1.494 0.315l2.306 1.794c0.829 0.645 0.905 1.87 0.163 2.611l-1.034 1.034c-0.74 0.74 -1.846 1.065 -2.877 0.702a18.6 18.6 0 0 1 -7.01 -4.42 18.6 18.6 0 0 1 -4.42 -7.009c-0.362 -1.03 -0.037 -2.137 0.703 -2.877z" stroke-width="1"></path>
            </svg>
        </div>
        <div class="action-btn">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" id="Video--Streamline-Font-Awesome">
                <path d="M0.15999999999999998 4.515555555555555c0 -0.9609444444444444 0.7812777777777777 -1.7422222222222221 1.7422222222222221 -1.7422222222222221h6.9688888888888885c0.9609444444444444 0 1.7422222222222221 0.7812777777777777 1.7422222222222221 1.7422222222222221v6.9688888888888885c0 0.9609444444444444 -0.7812777777777777 1.7422222222222221 -1.7422222222222221 1.7422222222222221H1.9022222222222223c-0.9609444444444444 0 -1.7422222222222221 -0.7812777777777777 -1.7422222222222221 -1.7422222222222221V4.515555555555555Zm15.219944444444444 -0.7676666666666666c0.2831111111111111 0.15244444444444444 0.46005555555555555 0.4464444444444444 0.46005555555555555 0.7676666666666666v6.9688888888888885c0 0.3212222222222222 -0.17694444444444443 0.6152222222222222 -0.46005555555555555 0.7676666666666666s-0.6261111111111111 0.13611111111111113 -0.895611111111111 -0.043555555555555556l-2.6133333333333333 -1.7422222222222221 -0.38655555555555554 -0.2586111111111111V5.792277777777778l0.38655555555555554 -0.2586111111111111 2.6133333333333333 -1.7422222222222221c0.2667777777777777 -0.17694444444444443 0.6097777777777778 -0.19599999999999998 0.895611111111111 -0.043555555555555556Z" fill="#000000" stroke-width="0.0278"></path>
            </svg>
        </div>
        <div class="action-btn">
            <svg xmlns="http://www.w3.org/2000/svg" fill="#000000" class="bi bi-envelope-fill" viewBox="0 0 16 16" id="Envelope-Fill--Streamline-Bootstrap">
                <path d="M0.05 3.555A2 2 0 0 1 2 2h12a2 2 0 0 1 1.95 1.555L8 8.414zM0 4.697v7.104l5.803 -3.558zM6.761 8.83l-6.57 4.027A2 2 0 0 0 2 14h12a2 2 0 0 0 1.808 -1.144l-6.57 -4.027L8 9.586zm3.436 -0.586L16 11.801V4.697z" stroke-width="1"></path>
            </svg>
        </div>
    </div>
    <div class="cards-grid">
        <div class="placeholder-card card-1 uploadable-img"></div>
        <div class="placeholder-card card-2 uploadable-img"></div>
        <div class="placeholder-card card-3 uploadable-img"></div>
    </div>
</div>`
            },
            {
                name: '个人主页空间',
                presetSize: '4x4',
                preview: '#f4eaef',
                content: `<style>
    * { box-sizing: border-box; margin: 0; padding: 0; user-select: none; }
    .widget-space-profile-4x4 { width: 100%; height: 100%; background: #ffffff; border-radius: 28px; overflow: hidden; display: flex; flex-direction: column; position: relative; font-family: -apple-system, BlinkMacSystemFont, "PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", sans-serif; }
    .widget-space-profile-4x4 .banner { height: 43%; background: linear-gradient(180deg, #d8ccd4 0%, #f7eff3 35%, #f4eaef 75%, #dccfd7 100%); background-size: cover; background-position: center; position: relative; padding: 12px 14px; flex-shrink: 0; }
    .widget-space-profile-4x4 .banner-footer { display: flex; justify-content: flex-end; align-items: flex-end; gap: 8px; position: absolute; right: 14px; bottom: -10px; z-index: 2; }
    .widget-space-profile-4x4 .username { color: #ffffff; font-size: 14px; font-weight: 700; margin-bottom: 16px; text-shadow: 0 1px 3px rgba(0, 0, 0, 0.2); letter-spacing: 0.5px; outline: none; }
    .widget-space-profile-4x4 .avatar-placeholder { width: 48px; height: 48px; border-radius: 12px; background-color: #e5d8dc; background-size: cover; background-position: center; border: 2px solid #ffffff; box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08); flex-shrink: 0; }
    .widget-space-profile-4x4 .content-body { flex: 1; padding: 12px 12px 10px 12px; display: flex; flex-direction: column; justify-content: space-between; background-color: #ffffff; min-height: 0; }
    .widget-space-profile-4x4 .bio-text { text-align: right; font-size: 11px; color: #7b7479; padding-right: 4px; outline: none; font-family: monospace, sans-serif; }
    .widget-space-profile-4x4 .pinned-section { display: flex; align-items: center; gap: 8px; }
    .widget-space-profile-4x4 .pinned-title { font-size: 13px; font-weight: 800; color: #1a1a1a; white-space: nowrap; flex-shrink: 0; outline: none; }
    .widget-space-profile-4x4 .cards-row { display: flex; flex: 1; gap: 6px; align-items: center; justify-content: space-between; min-width: 0; }
    .widget-space-profile-4x4 .card-placeholder { flex: 1; aspect-ratio: 1 / 1; border-radius: 6px; background-size: cover; background-position: center; }
    .widget-space-profile-4x4 .color-block-1 { background-color: #f7e6eb; }
    .widget-space-profile-4x4 .color-block-2 { background-color: #faf9f9; }
    .widget-space-profile-4x4 .color-block-3 { background-color: #eee9ec; }
    .widget-space-profile-4x4 .arrow-icon { width: 14px; height: 14px; flex-shrink: 0; display: flex; align-items: center; justify-content: center; }
    .widget-space-profile-4x4 .arrow-icon svg { width: 100%; height: 100%; fill: #b0b0b8; }
    .widget-space-profile-4x4 .daily-section { display: flex; align-items: center; gap: 8px; margin-top: 2px; }
    .widget-space-profile-4x4 .daily-title { font-size: 13px; font-weight: 800; color: #1a1a1a; white-space: nowrap; flex-shrink: 0; outline: none; }
    .widget-space-profile-4x4 .daily-text-box { flex: 1; min-width: 0; background-color: #faf9f9; padding: 5px 8px; border-radius: 4px; display: flex; align-items: center; }
    .widget-space-profile-4x4 .daily-text { font-size: 11.5px; color: #222222; font-weight: 500; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; outline: none; }
    .widget-space-profile-4x4 [contenteditable="true"] { outline: none; }
</style>
<div class="widget-space-profile-4x4">
    <div class="banner uploadable-img">
        <div class="banner-footer">
            <span class="username" contenteditable="true" spellcheck="false">小岛梨花</span>
            <div class="avatar-placeholder uploadable-img"></div>
        </div>
    </div>
    <div class="content-body">
        <div class="bio-text" contenteditable="true" spellcheck="false">於你而言我是一顆星嗎</div>
        <div class="pinned-section">
            <span class="pinned-title" contenteditable="true" spellcheck="false">置顶</span>
            <div class="cards-row">
                <div class="card-placeholder color-block-1 uploadable-img"></div>
                <div class="card-placeholder color-block-2 uploadable-img"></div>
                <div class="card-placeholder color-block-3 uploadable-img"></div>
            </div>
            <div class="arrow-icon">
                <svg viewBox="0 0 24 24">
                    <path d="M8.59 16.59L13.17 12 8.59 7.41 10 6l6 6-6 6-1.41-1.41z"/>
                </svg>
            </div>
        </div>
        <div class="daily-section">
            <span class="daily-title" contenteditable="true" spellcheck="false">今天</span>
            <div class="daily-text-box">
                <span class="daily-text" contenteditable="true" spellcheck="false">u and me、-(ω)-</span>
            </div>
        </div>
    </div>
</div>`
            },
            {
                name: '极简照片卡片',
                presetSize: '2x2',
                preview: '#ffffff',
                content: `<style>
    * { box-sizing: border-box; margin: 0; padding: 0; }
    .widget-ins-2x2-wrapper { width: 100%; height: 100%; padding: 8px 10px; box-sizing: border-box; display: flex; justify-content: center; align-items: center; background: transparent; font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; user-select: none; }
    .widget-ins-card { width: 100%; height: 100%; background: #ffffff; border-radius: 5px; padding: 8px; display: flex; flex-direction: column; justify-content: space-between; box-shadow: 0 3px 10px rgba(0, 0, 0, 0.06); }
    .widget-ins-img { flex: 1; width: 100%; background-color: #ededf0; border-radius: 5px; background-size: cover; background-position: center; background-repeat: no-repeat; cursor: pointer; }
    .widget-ins-footer { display: flex; justify-content: space-between; align-items: center; padding: 7px 3px 2px 3px; }
    .ins-footer-left { display: flex; align-items: center; gap: 8px; }
    .ins-icon { fill: #8e8e93; display: block; }
    .ins-icon-like { width: 15px; height: 15px; stroke: #8e8e93; stroke-width: 18px; stroke-linejoin: round; }
    .ins-icon-comment { width: 14px; height: 14px; }
    .ins-icon-share { width: 12px; height: 12px; }
    .ins-icon-bookmark { width: 12.5px; height: 12.5px; }
</style>
<div class="widget-ins-2x2-wrapper">
    <div class="widget-ins-card">
        <div class="widget-ins-img uploadable-img"></div>
        <div class="widget-ins-footer">
            <div class="ins-footer-left">
                <svg class="ins-icon ins-icon-like" viewBox="0 0 1024 1024"><path d="M667.786667 117.333333C832.864 117.333333 938.666667 249.706667 938.666667 427.861333c0 138.250667-125.098667 290.506667-371.573334 461.589334a96.768 96.768 0 0 1-110.186666 0C210.432 718.368 85.333333 566.112 85.333333 427.861333 85.333333 249.706667 191.136 117.333333 356.213333 117.333333c59.616 0 100.053333 20.832 155.786667 68.096C567.744 138.176 608.170667 117.333333 667.786667 117.333333z m0 63.146667c-41.44 0-70.261333 15.189333-116.96 55.04-2.165333 1.845333-14.4 12.373333-17.941334 15.381333a32.32 32.32 0 0 1-41.770666 0c-3.541333-3.018667-15.776-13.536-17.941334-15.381333-46.698667-39.850667-75.52-55.04-116.96-55.04C230.186667 180.48 149.333333 281.258667 149.333333 426.698667 149.333333 537.6 262.858667 675.242667 493.632 834.826667a32.352 32.352 0 0 0 36.736 0C761.141333 675.253333 874.666667 537.6 874.666667 426.698667c0-145.44-80.853333-246.218667-206.88-246.218667z"></path></svg>
                <svg class="ins-icon ins-icon-comment" viewBox="0 0 1026 1024"><path d="M323.2 423.2c20.8 0 39.2 8.8 52.8 21.6 13.6 13.6 22.4 32.8 22.4 52.8 0 20.8-8 39.2-22.4 52.8-13.6 13.6-32 22.4-52.8 22.4-20.8 0-39.2-8.8-52.8-22.4-13.6-13.6-21.6-32-21.6-52.8 0-20.8 8-39.2 21.6-52.8C283.2 432 302.4 423.2 323.2 423.2L323.2 423.2zM512.8 52 512.8 52c140 0 267.2 49.6 360 128.8 94.4 80.8 152.8 192.8 152.8 317.6 0 124-58.4 236.8-152.8 317.6-92 80-220 128.8-360 128.8-42.4 0-84-4.8-123.2-12.8-33.6-7.2-66.4-16.8-97.6-30.4L168.8 968c-12 6.4-24.8 9.6-37.6 8l0 0c-12.8-0.8-24.8-5.6-36-13.6-10.4-8.8-18.4-19.2-23.2-32l0 0c-4.8-12-5.6-24.8-2.4-38.4l29.6-130.4C69.6 727.2 45.6 688 29.6 647.2c-19.2-46.4-29.6-96.8-29.6-148.8 0-124.8 58.4-236.8 152.8-317.6C244.8 100.8 372 52 512.8 52L512.8 52zM821.6 240 821.6 240c-79.2-67.2-188-109.6-308.8-109.6-121.6 0-230.4 42.4-309.6 109.6C126.4 306.4 78.4 398.4 78.4 498.4c0 41.6 8 81.6 23.2 119.2 16 38.4 38.4 74.4 67.2 104.8 9.6 9.6 15.2 23.2 11.2 37.6l-28.8 128 120.8-65.6c10.4-5.6 23.2-6.4 34.4-0.8 30.4 14.4 64 25.6 99.2 32.8 33.6 7.2 69.6 11.2 106.4 11.2 120.8 0 229.6-41.6 308.8-109.6 77.6-66.4 124.8-157.6 124.8-257.6C945.6 398.4 898.4 306.4 821.6 240L821.6 240zM512.8 423.2 512.8 423.2c20.8 0 39.2 8.8 52.8 21.6 13.6 13.6 21.6 32.8 21.6 52.8 0 20.8-8 39.2-21.6 52.8-13.6 13.6-32 22.4-52.8 22.4-20.8 0-40-8.8-52.8-22.4-13.6-13.6-22.4-32-22.4-52.8 0-20.8 8.8-39.2 22.4-52.8C472.8 432 492 423.2 512.8 423.2L512.8 423.2zM701.6 423.2 701.6 423.2c20.8 0 39.2 8.8 52.8 21.6 13.6 13.6 21.6 32.8 21.6 52.8 0 20.8-8 39.2-21.6 52.8-13.6 13.6-32.8 22.4-52.8 22.4-20.8 0-39.2-8.8-52.8-22.4-13.6-13.6-21.6-32-21.6-52.8 0-20.8 8-39.2 21.6-52.8C662.4 432 680.8 423.2 701.6 423.2L701.6 423.2z"></path></svg>
                <svg class="ins-icon ins-icon-share" viewBox="0 0 1024 1024"><path d="M901.266 582c0-26.989 21.878-48.867 48.867-48.867C977.122 533.133 999 555.01 999 582v319.266C999 955.243 955.243 999 901.266 999H123.734C69.757 999 26 955.243 26 901.266V123.734C26 69.757 69.757 26 123.734 26H443c26.989 0 48.867 21.878 48.867 48.867 0 26.989-21.878 48.867-48.867 48.867H123.734v777.532h777.532V582z m3.372-390.778l-333.11 332.394c-19.361 19.319-50.751 19.319-70.113 0-19.36-19.32-19.36-50.643 0-69.963L835.626 120.16H669.78c-26.057 0-47.18-21.077-47.18-47.08 0-26.001 21.123-47.079 47.18-47.079h239.593C958.872 26 999 66.042 999 115.436v239.078c0 26.002-21.123 47.08-47.181 47.08-26.058 0-47.181-21.078-47.181-47.08V191.222z"></path></svg>
            </div>
            <svg class="ins-icon ins-icon-bookmark" viewBox="0 0 1024 1024"><path d="M199.128615 859.372308l234.916103-146.79959c46.368821-28.987077 109.541744-28.987077 155.910564 0L827.076923 861.026462V105.025641c0 0.105026-630.048821 0-630.04882 0-0.131282 0 2.100513 754.346667 2.100512 754.346667zM91.897436 105.025641a105.025641 105.025641 0 0 1 105.130667-105.025641h629.943794A105.183179 105.183179 0 0 1 932.102564 105.025641v840.205128c0 58.026667-39.909744 80.082051-89.088 49.362052l-308.722872-192.984616c-12.314256-7.666872-32.269128-7.693128-44.583384 0L180.985436 994.592821C131.807179 1025.312821 91.897436 1003.073641 91.897436 945.230769V105.025641z"></path></svg>
        </div>
    </div>
</div>`
            },
            {
                name: '动态说说卡片',
                presetSize: '4x2',
                preview: '#ffffff',
                content: `<style>
    * { box-sizing: border-box; margin: 0; padding: 0; }
    .widget-post-4x2 { width: 100%; height: 100%; background: #ffffff; border-radius: 5px; padding: 12px 16px 10px 16px; box-sizing: border-box; display: flex; flex-direction: column; justify-content: space-between; user-select: none; font-family: -apple-system, BlinkMacSystemFont, "PingFang SC", "Segoe UI", Roboto, sans-serif; }
    .widget-post-4x2 .user-header { display: flex; align-items: center; gap: 10px; }
    .widget-post-4x2 .avatar-wrapper { width: 36px; height: 36px; border-radius: 50%; background-color: #d1d1d6; background-size: cover; background-position: center; background-repeat: no-repeat; flex-shrink: 0; cursor: pointer; }
    .widget-post-4x2 .user-meta { display: flex; flex-direction: column; justify-content: center; line-height: 1.35; }
    .widget-post-4x2 .username { font-size: 13.5px; font-weight: 600; color: #1a1a1a; letter-spacing: -0.2px; outline: none; }
    .widget-post-4x2 .timestamp { font-size: 11px; color: #8e8e93; outline: none; }
    .widget-post-4x2 .post-body { margin-top: 4px; display: flex; flex-direction: column; gap: 4px; }
    .widget-post-4x2 .post-text { font-size: 14px; font-weight: 700; color: #2c2c2e; letter-spacing: 0.2px; line-height: 1.35; outline: none; }
    .widget-post-4x2 .translate-text { font-size: 11.5px; color: #636366; font-weight: 500; outline: none; cursor: pointer; }
    .widget-post-4x2 .widget-footer { display: flex; justify-content: space-between; align-items: center; padding-top: 8px; border-top: 0.5px solid #eaeaea; }
    .widget-post-4x2 .action-btn { display: flex; align-items: center; justify-content: center; gap: 5px; flex: 1; color: #545458; }
    .widget-post-4x2 .action-btn span { font-size: 11.5px; font-weight: 500; letter-spacing: -0.1px; }
    .widget-post-4x2 .footer-icon { fill: #545458; display: block; }
    .widget-post-4x2 .icon-repost { width: 13px; height: 13px; }
    .widget-post-4x2 .icon-comment { width: 13.5px; height: 13.5px; }
    .widget-post-4x2 .icon-like { width: 13px; height: 13px; }
</style>
<div class="widget-post-4x2">
    <div class="user-header">
        <div class="avatar-wrapper uploadable-img"></div>
        <div class="user-meta">
            <span class="username" contenteditable="true" spellcheck="false">@missu</span>
            <span class="timestamp" contenteditable="true" spellcheck="false">Just now&nbsp; from iPhone</span>
        </div>
    </div>
    <div class="post-body">
        <div class="post-text" contenteditable="true" spellcheck="false">风吹过林梢，那是我们未完的故事。</div>
        <div class="translate-text" contenteditable="true" spellcheck="false">Translate content</div>
    </div>
    <div class="widget-footer">
        <div class="action-btn">
            <svg class="footer-icon icon-repost" viewBox="0 0 1024 1024">
                <path d="M853.3 597.3v170.7H170.7V256h170.6V170.7H128c-23.6 0-42.7 19.1-42.7 42.6v597.4c0 23.5 19.1 42.6 42.7 42.6h768c23.6 0 42.7-19.1 42.7-42.6V597.3h-85.4zM554.7 170.7l133.5 133.5-313 313 60.3 60.3 313-313 133.5 133.5V170.7H554.7z"/>
            </svg>
            <span>Repost</span>
        </div>
        <div class="action-btn">
            <svg class="footer-icon icon-comment" viewBox="0 0 1024 1024">
                <path d="M853.3 170.7H170.7c-47.2 0-85.3 38.2-85.3 85.3v426.7c0 47.2 38.2 85.3 85.3 85.3h128v170.7l213.3-170.7h341.3c47.2 0 85.3-38.2 85.3-85.3V256c0-47.1-38.1-85.3-85.3-85.3z m0 512H490.7L384 768v-85.3H170.7V256h682.7v426.7z M298.7 426.7h426.6v85.3H298.7z"/>
            </svg>
            <span>Comments</span>
        </div>
        <div class="action-btn">
            <svg class="footer-icon icon-like" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg">
                <path d="M857.28 344.992h-264.832c12.576-44.256 18.944-83.584 18.944-118.208 0-78.56-71.808-153.792-140.544-143.808-60.608 8.8-89.536 59.904-89.536 125.536v59.296c0 76.064-58.208 140.928-132.224 148.064l-117.728-0.192A67.36 67.36 0 0 0 64 483.04V872c0 37.216 30.144 67.36 67.36 67.36h652.192a102.72 102.72 0 0 0 100.928-83.584l73.728-388.96a102.72 102.72 0 0 0-100.928-121.824zM128 872V483.04c0-1.856 1.504-3.36 3.36-3.36H208v395.68H131.36A3.36 3.36 0 0 1 128 872z m767.328-417.088l-73.728 388.96a38.72 38.72 0 0 1-38.048 31.488H272V476.864a213.312 213.312 0 0 0 173.312-209.088V208.512c0-37.568 12.064-58.912 34.72-62.176 27.04-3.936 67.36 38.336 67.36 80.48 0 37.312-9.504 84-28.864 139.712a32 32 0 0 0 30.24 42.496h308.512a38.72 38.72 0 0 1 38.048 45.888z"></path>
            </svg>
            <span>Likes</span>
        </div>
    </div>
</div>`
            },
            {
                name: '相框画报卡片',
                presetSize: '4x3',
                preview: '#ffffff',
                content: `<style>
    * { box-sizing: border-box; margin: 0; padding: 0; }
    .widget-cover-4x3 { width: 100%; height: 100%; background: #ffffff; border-radius: 12px; padding: 10px; display: flex; flex-direction: column; justify-content: space-between; box-sizing: border-box; user-select: none; font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "PingFang SC", sans-serif; }
    .widget-cover-4x3 .cover-img-area { width: 100%; flex: 1; background-color: #ededf0; border-radius: 8px; background-size: cover; background-position: center; background-repeat: no-repeat; cursor: pointer; }
    .widget-cover-4x3 .title-area { padding: 8px 4px 2px 4px; display: flex; align-items: center; gap: 6px; }
    .widget-cover-4x3 .title-colon { font-size: 15px; font-weight: 800; color: #000000; line-height: 1; }
    .widget-cover-4x3 .title-text { font-size: 15px; font-weight: 800; color: #000000; letter-spacing: -0.2px; line-height: 1.2; outline: none; }
    .widget-cover-4x3 .widget-footer { display: flex; justify-content: space-between; align-items: center; padding: 8px 4px 2px 4px; border-top: 0.5px solid #f0f0f2; }
    .widget-cover-4x3 .date-text { font-size: 12.5px; font-weight: 700; color: #8e8e93; letter-spacing: -0.1px; outline: none; }
    .widget-cover-4x3 .icon-dots { width: 18px; height: 18px; fill: #8e8e93; display: block; }
</style>
<div class="widget-cover-4x3">
    <div class="cover-img-area uploadable-img"></div>
    <div class="title-area">
        <span class="title-colon">:</span>
        <span class="title-text" contenteditable="true" spellcheck="false">Eternal Summer</span>
    </div>
    <div class="widget-footer">
        <span class="date-text" contenteditable="true" spellcheck="false">Saturday, Sep 24</span>
        <svg class="icon-dots" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg">
            <circle cx="213.3" cy="512" r="74.6" />
            <circle cx="512" cy="512" r="74.6" />
            <circle cx="810.7" cy="512" r="74.6" />
        </svg>
    </div>
</div>`
            },
            {
                name: '近期作品卡片',
                presetSize: '4x2',
                preview: '#ffffff',
                content: `<style>
    * { box-sizing: border-box; margin: 0; padding: 0; }
    .widget-recent-work { width: 100%; height: 100%; background: #ffffff; border-radius: 16px; padding: 14px 18px 16px 18px; display: flex; flex-direction: column; justify-content: space-between; box-sizing: border-box; user-select: none; font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "PingFang SC", "Helvetica Neue", Arial, sans-serif; }
    .widget-recent-work .widget-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px; }
    .widget-recent-work .widget-title { font-size: 14.5px; font-weight: 700; color: #2b2b2b; letter-spacing: -0.2px; outline: none; }
    .widget-recent-work .view-all-link { display: inline-flex; align-items: center; gap: 5px; font-size: 11px; font-weight: 500; color: #9cb1d4; text-decoration: none; outline: none; }
    .widget-recent-work .view-all-link svg { width: 13px; height: 13px; stroke: currentColor; stroke-width: 2.2; stroke-linecap: round; stroke-linejoin: round; fill: none; }
    .widget-recent-work .items-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 12px; flex: 1; align-items: start; }
    .widget-recent-work .item-card { display: flex; flex-direction: column; cursor: pointer; }
    .widget-recent-work .item-thumb { width: 100%; aspect-ratio: 1 / 0.95; background-color: #444444; border-radius: 8px; overflow: hidden; margin-bottom: 6px; background-size: cover; background-position: center; background-repeat: no-repeat; }
    .widget-recent-work .item-title { font-size: 11px; font-weight: 600; color: #2c2c2c; line-height: 1.25; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; outline: none; }
    .widget-recent-work .item-subtitle { font-size: 9.5px; font-weight: 400; color: #88888a; margin-top: 2px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; outline: none; }
    .widget-recent-work [contenteditable="true"] { outline: none; }
</style>
<div class="widget-recent-work">
    <div class="widget-header">
        <span class="widget-title" contenteditable="true" spellcheck="false">Recent Work</span>
        <div class="view-all-link">
            <span contenteditable="true" spellcheck="false">View All</span>
            <svg viewBox="0 0 24 24"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg>
        </div>
    </div>
    <div class="items-grid">
        <div class="item-card">
            <div class="item-thumb uploadable-img"></div>
            <div class="item-title" contenteditable="true" spellcheck="false">Minimal Dashboard</div>
            <div class="item-subtitle" contenteditable="true" spellcheck="false">UI/UX Design</div>
        </div>
        <div class="item-card">
            <div class="item-thumb uploadable-img"></div>
            <div class="item-title" contenteditable="true" spellcheck="false">Architecture App</div>
            <div class="item-subtitle" contenteditable="true" spellcheck="false">Mobile Design</div>
        </div>
        <div class="item-card">
            <div class="item-thumb uploadable-img"></div>
            <div class="item-title" contenteditable="true" spellcheck="false">Brand Identity</div>
            <div class="item-subtitle" contenteditable="true" spellcheck="false">Branding</div>
        </div>
    </div>
</div>`
            },
            {
                name: 'ins主页',
                presetSize: '4x3',
                preview: '#ffffff',
                content: `<style>
    * { box-sizing: border-box; margin: 0; padding: 0; }
    .widget-profile-compact { width: 100%; height: 100%; background: #ffffff; border-radius: 16px; padding: 14px 16px; box-sizing: border-box; display: flex; flex-direction: column; justify-content: space-between; user-select: none; color: #000000; font-family: -apple-system, BlinkMacSystemFont, "SF Pro Text", "Segoe UI", Roboto, "PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", sans-serif; -webkit-font-smoothing: antialiased; }
    .widget-profile-compact .widget-header { display: flex; align-items: center; justify-content: space-between; height: 22px; }
    .widget-profile-compact .header-icon-btn { display: flex; align-items: center; justify-content: center; cursor: pointer; }
    .widget-profile-compact .account-title { display: flex; align-items: center; gap: 3px; font-size: 15px; font-weight: 700; cursor: pointer; }
    .widget-profile-compact .account-title svg { width: 12px; height: 12px; stroke-width: 2.8; stroke: currentColor; fill: none; }
    .widget-profile-compact .header-actions { display: flex; align-items: center; gap: 12px; }
    .widget-profile-compact .threads-icon { width: 19px; height: 19px; fill: #000000; display: block; }
    .widget-profile-compact .profile-stats-row { display: flex; align-items: center; margin-top: 4px; }
    .widget-profile-compact .avatar-wrapper { position: relative; margin-right: 20px; flex-shrink: 0; }
    .widget-profile-compact .avatar-ring { width: 62px; height: 62px; border-radius: 50%; border: 1.5px solid #ebebeb; padding: 2px; display: flex; align-items: center; justify-content: center; }
    .widget-profile-compact .avatar-placeholder { width: 100%; height: 100%; border-radius: 50%; background-color: #d1d5db; overflow: hidden; background-size: cover; background-position: center; background-repeat: no-repeat; }
    .widget-profile-compact .avatar-badge { position: absolute; top: -6px; left: 6px; background: #ffffff; border: 1px solid #e5e7eb; border-radius: 10px; padding: 0 5px; font-size: 8px; font-weight: 500; color: #374151; line-height: 14px; box-shadow: 0 1px 2px rgba(0,0,0,0.05); }
    .widget-profile-compact .profile-stats { flex: 1; display: flex; flex-direction: column; }
    .widget-profile-compact .nickname { font-size: 13.5px; font-weight: 700; line-height: 1.2; margin-bottom: 4px; outline: none; }
    .widget-profile-compact .stats-columns { display: flex; justify-content: space-between; padding-right: 12px; }
    .widget-profile-compact .stat-item { display: flex; flex-direction: column; align-items: flex-start; }
    .widget-profile-compact .stat-num { font-size: 13.5px; font-weight: 700; line-height: 1.1; outline: none; }
    .widget-profile-compact .stat-label { font-size: 10px; color: #222; margin-top: 1px; outline: none; }
    .widget-profile-compact .profile-bio { margin-top: 2px; line-height: 1.35; }
    .widget-profile-compact .bio-line-1 { font-size: 11.5px; font-weight: 600; color: #000; outline: none; }
    .widget-profile-compact .bio-line-2 { font-size: 10.5px; font-weight: 500; color: #333; margin-top: 2px; outline: none; }
    .widget-profile-compact .action-buttons { display: flex; align-items: center; gap: 6px; margin-top: 2px; }
    .widget-profile-compact .btn { height: 27px; background-color: #efefef; border: none; border-radius: 6px; font-size: 11px; font-weight: 600; color: #000; display: flex; align-items: center; justify-content: center; cursor: pointer; }
    .widget-profile-compact .btn-following { flex: 1.2; gap: 3px; outline: none; }
    .widget-profile-compact .btn-following svg { width: 10px; height: 10px; stroke-width: 2.5; stroke: currentColor; fill: none; }
    .widget-profile-compact .btn-message { flex: 1.3; outline: none; }
    .widget-profile-compact .btn-icon { width: 28px; flex-shrink: 0; padding: 0; }
    .widget-profile-compact .add-user-icon { width: 14px; height: 14px; display: block; }
    .widget-profile-compact .highlights-row { display: flex; justify-content: flex-start; gap: 14px; padding: 2px 2px 0 2px; }
    .widget-profile-compact .highlight-item { display: flex; flex-direction: column; align-items: center; cursor: pointer; }
    .widget-profile-compact .highlight-ring { width: 44px; height: 44px; border-radius: 50%; border: 1.5px solid #dedede; padding: 2px; display: flex; align-items: center; justify-content: center; }
    .widget-profile-compact .highlight-add-circle { width: 100%; height: 100%; border-radius: 50%; display: flex; align-items: center; justify-content: center; background-color: #fafafa; color: #333333; }
    .widget-profile-compact .highlight-add-circle svg { width: 16px; height: 16px; stroke-width: 2; stroke: currentColor; }
    .widget-profile-compact .highlight-placeholder { width: 100%; height: 100%; border-radius: 50%; background-color: #d1d5db; overflow: hidden; background-size: cover; background-position: center; background-repeat: no-repeat; }
    .widget-profile-compact .highlight-label { font-size: 10px; font-weight: 500; color: #666666; margin-top: 4px; outline: none; }
    .widget-profile-compact [contenteditable="true"] { outline: none; }
</style>
<div class="widget-profile-compact">
    <div class="widget-header">
        <div class="header-icon-btn">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
        </div>
        <div class="account-title">
            <span contenteditable="true" spellcheck="false">@missu012</span>
            <svg viewBox="0 0 24 24"><polyline points="6 9 12 15 18 9"></polyline></svg>
        </div>
        <div class="header-actions">
            <svg class="threads-icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg">
                <path d="M712.746667 473.941333c-6.912-127.445333-76.544-200.405333-193.450667-201.130666-70.485333-0.426667-129.408 29.44-165.504 84.181333L418.133333 401.066667c27.050667-41.002667 69.76-49.493333 100.693334-49.194667 38.528 0.256 67.541333 11.434667 86.357333 33.28 13.653333 15.872 22.826667 37.845333 27.392 65.536-34.133333-5.802667-71.082667-7.594667-110.506667-5.333333-111.189333 6.4-182.613333 71.253333-177.834666 161.322666 2.432 45.696 25.173333 85.034667 64.085333 110.72 32.853333 21.717333 75.264 32.298667 119.253333 29.909334 58.154667-3.2 103.765333-25.386667 135.594667-65.92 24.149333-30.805333 39.424-70.741333 46.165333-121.002667 27.733333 16.725333 48.213333 38.698667 59.605334 65.152 19.285333 44.970667 20.394667 118.869333-39.893334 179.114667-52.821333 52.736-116.309333 75.605333-212.266666 76.288-106.453333-0.768-186.965333-34.944-239.274667-101.461334-49.066667-62.293333-74.368-152.32-75.306667-267.477333 0.938667-115.2 26.282667-205.184 75.306667-267.52 52.309333-66.517333 132.821333-100.650667 239.274667-101.418667 107.221333 0.810667 189.098667 35.072 243.456 101.973334 26.666667 32.768 46.72 73.984 59.989333 122.026666l75.349333-20.053333c-16.085333-59.178667-41.344-110.165333-75.690666-152.448-69.674667-85.76-172.074667-129.664-303.36-130.56-131.029333 0.896-231.808 45.013333-299.477334 131.029333-60.202667 76.586667-91.306667 183.722667-92.330666 317.269334 1.024 133.546667 32.128 240.085333 92.330666 316.672 67.712 86.016 168.96 130.133333 299.946667 131.029333 116.522667-0.810667 198.613333-31.317333 266.24-98.858667 88.533333-88.448 85.845333-199.253333 56.704-267.264-22.4-52.266667-66.986667-94.122667-127.146667-119.893333z m-189.354667 194.432c-48.725333 2.730667-99.328-19.114667-101.845333-65.962666-1.834667-34.730667 24.746667-73.472 104.832-78.08a400.597333 400.597333 0 0 1 108.074666 7.424c-9.216 115.285333-63.36 133.973333-111.061333 136.618666z"></path>
            </svg>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><line x1="4" y1="6" x2="20" y2="6"></line><line x1="4" y1="12" x2="20" y2="12"></line><line x1="4" y1="18" x2="20" y2="18"></line></svg>
        </div>
    </div>
    <div class="profile-stats-row">
        <div class="avatar-wrapper">
            <span class="avatar-badge" contenteditable="true" spellcheck="false">ㅠㅅㅠ</span>
            <div class="avatar-ring">
                <div class="avatar-placeholder uploadable-img"></div>
            </div>
        </div>
        <div class="profile-stats">
            <div class="nickname" contenteditable="true" spellcheck="false">小岛梨花</div>
            <div class="stats-columns">
                <div class="stat-item">
                    <span class="stat-num" contenteditable="true" spellcheck="false">13</span>
                    <span class="stat-label" contenteditable="true" spellcheck="false">post</span>
                </div>
                <div class="stat-item">
                    <span class="stat-num" contenteditable="true" spellcheck="false">14k</span>
                    <span class="stat-label" contenteditable="true" spellcheck="false">followers</span>
                </div>
                <div class="stat-item">
                    <span class="stat-num" contenteditable="true" spellcheck="false">520</span>
                    <span class="stat-label" contenteditable="true" spellcheck="false">following</span>
                </div>
            </div>
        </div>
    </div>
    <div class="profile-bio">
        <div class="bio-line-1" contenteditable="true" spellcheck="false">i need you T^T</div>
        <div class="bio-line-2" contenteditable="true" spellcheck="false">★☆ Noanswer [ 眼淚會替你回答 ]</div>
    </div>
    <div class="action-buttons">
        <button class="btn btn-following">
            <span contenteditable="true" spellcheck="false">Following</span>
            <svg viewBox="0 0 24 24"><polyline points="6 9 12 15 18 9"></polyline></svg>
        </button>
        <button class="btn btn-message" contenteditable="true" spellcheck="false">Message</button>
        <button class="btn btn-icon">
            <svg class="add-user-icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg">
                <path d="M256 384a170.667 170.667 0 1 0 341.333 0A170.667 170.667 0 1 0 256 384zM640 499.2h256v68.267H640z" fill="#000000"></path>
                <path d="M802.133 405.333v256h-68.266v-256zM384 597.333h85.333a256 256 0 0 1 256 256H128a256 256 0 0 1 256-256z" fill="#000000"></path>
            </svg>
        </button>
    </div>
    <div class="highlights-row">
        <div class="highlight-item">
            <div class="highlight-ring">
                <div class="highlight-add-circle">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-linecap="round"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
                </div>
            </div>
            <span class="highlight-label" contenteditable="true" spellcheck="false">New</span>
        </div>
        <div class="highlight-item">
            <div class="highlight-ring">
                <div class="highlight-placeholder uploadable-img"></div>
            </div>
            <span class="highlight-label" contenteditable="true" spellcheck="false">Me</span>
        </div>
        <div class="highlight-item">
            <div class="highlight-ring">
                <div class="highlight-placeholder uploadable-img"></div>
            </div>
            <span class="highlight-label" contenteditable="true" spellcheck="false">Spring</span>
        </div>
        <div class="highlight-item">
            <div class="highlight-ring">
                <div class="highlight-placeholder uploadable-img"></div>
            </div>
            <span class="highlight-label" contenteditable="true" spellcheck="false">Winter</span>
        </div>
    </div>
</div>`
            },
            {
                name: '推特关注卡片',
                presetSize: '3x2',
                preview: '#ffffff',
                content: `<style>
    * { box-sizing: border-box; margin: 0; padding: 0; }
    .widget-follow-wrap { width: 100%; height: 100%; padding: 8px 10px; display: flex; align-items: center; justify-content: center; background: transparent; }
    .widget-follow-3x2 { width: 100%; height: 100%; border-radius: 4px; background-color: #ffffff; overflow: hidden; display: flex; flex-direction: column; font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif; user-select: none; box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06); }
    .widget-follow-3x2 .widget-banner { width: 100%; height: 38%; background-color: #e2e8f0; flex-shrink: 0; background-size: cover; background-position: center; background-repeat: no-repeat; cursor: pointer; }
    .widget-follow-3x2 .widget-body { padding: 0 10px 8px 10px; display: flex; flex-direction: column; flex-grow: 1; }
    .widget-follow-3x2 .profile-action-row { display: flex; justify-content: space-between; align-items: flex-start; position: relative; }
    .widget-follow-3x2 .avatar-placeholder { width: 42px; height: 42px; border-radius: 50%; background-color: #94a3b8; border: 2.5px solid #ffffff; margin-top: -21px; box-sizing: border-box; flex-shrink: 0; background-size: cover; background-position: center; background-repeat: no-repeat; cursor: pointer; }
    .widget-follow-3x2 .btn-follow { margin-top: 5px; background-color: #0f1419; color: #ffffff; border: none; border-radius: 9999px; padding: 3px 11px; font-size: 11px; font-weight: 700; cursor: pointer; line-height: 1.2; outline: none; }
    .widget-follow-3x2 .profile-info { margin-top: 2px; }
    .widget-follow-3x2 .profile-name { font-size: 13px; font-weight: 800; color: #0f1419; line-height: 1.2; outline: none; }
    .widget-follow-3x2 .profile-username { font-size: 10.5px; color: #536471; margin-top: 1px; line-height: 1.1; outline: none; }
    .widget-follow-3x2 .profile-bio { font-size: 11px; color: #0f1419; margin-top: 3px; line-height: 1.25; outline: none; }
    .widget-follow-3x2 [contenteditable="true"] { outline: none; }
</style>
<div class="widget-follow-wrap">
    <div class="widget-follow-3x2">
        <div class="widget-banner uploadable-img"></div>
        <div class="widget-body">
            <div class="profile-action-row">
                <div class="avatar-placeholder uploadable-img"></div>
                <button class="btn-follow">关注</button>
            </div>
            <div class="profile-info">
                <div class="profile-name" contenteditable="true" spellcheck="false">Alex Morgan</div>
                <div class="profile-username" contenteditable="true" spellcheck="false">@alex_notes</div>
                <div class="profile-bio" contenteditable="true" spellcheck="false">Capturing thoughts &amp; quiet moments.</div>
            </div>
        </div>
    </div>
</div>`
            },
            {
                name: '网易云主页',
                presetSize: '4x4',
                preview: '#4c4e53',
                content: `<style>
    * { box-sizing: border-box; margin: 0; padding: 0; user-select: none; }
    .widget-cloudmusic-4x4 { width: 100%; height: 100%; border-radius: 6px; background-color: #4c4e53; background-image: linear-gradient(180deg, #6b6f74 0%, #4c4e53 45%, #35373a 100%); background-size: cover; background-position: center; background-repeat: no-repeat; position: relative; overflow: hidden; display: flex; flex-direction: column; justify-content: space-between; padding: 10px 10px 9px 10px; color: #ffffff; font-family: -apple-system, BlinkMacSystemFont, "PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", sans-serif; -webkit-font-smoothing: antialiased; }
    .widget-cloudmusic-4x4 .widget-header { position: relative; display: flex; align-items: center; justify-content: space-between; height: 20px; width: 100%; }
    .widget-cloudmusic-4x4 .header-icons { display: flex; align-items: center; gap: 12px; z-index: 2; }
    .widget-cloudmusic-4x4 .nav-svg { width: 16px; height: 16px; stroke: #ffffff; stroke-width: 2.2; stroke-linecap: round; stroke-linejoin: round; fill: none; opacity: 0.95; }
    .widget-cloudmusic-4x4 .header-status-center { position: absolute; left: 50%; top: 50%; transform: translate(-50%, -50%); font-size: 11px; font-weight: 500; color: rgba(255, 255, 255, 0.85); letter-spacing: 0.4px; display: flex; align-items: center; gap: 3px; white-space: nowrap; z-index: 1; }
    .widget-cloudmusic-4x4 .status-text-editable { outline: none; }
    .widget-cloudmusic-4x4 .profile-section { display: flex; flex-direction: column; align-items: center; margin-top: -3px; }
    .widget-cloudmusic-4x4 .avatar-circle { width: 58px; height: 58px; border-radius: 50%; background-color: #8f9399; margin-bottom: 5px; background-size: cover; background-position: center; background-repeat: no-repeat; cursor: pointer; }
    .widget-cloudmusic-4x4 .username { font-size: 16px; font-weight: 700; color: #ffffff; letter-spacing: 0.3px; line-height: 1.2; outline: none; }
    .widget-cloudmusic-4x4 .signature-text { font-size: 11px; color: rgba(255, 255, 255, 0.72); margin-top: 3px; outline: none; }
    .widget-cloudmusic-4x4 .meta-tags-row { display: flex; align-items: center; gap: 4px; font-size: 10px; color: rgba(255, 255, 255, 0.55); margin-top: 2px; }
    .widget-cloudmusic-4x4 .meta-tags-row svg { width: 10px; height: 10px; stroke: currentColor; stroke-width: 2; fill: none; }
    .widget-cloudmusic-4x4 .count-stats-row { display: flex; align-items: center; gap: 12px; margin-top: 4px; font-size: 11px; color: rgba(255, 255, 255, 0.6); }
    .widget-cloudmusic-4x4 .count-stats-row strong { color: #ffffff; font-weight: 600; margin-right: 2px; }
    .widget-cloudmusic-4x4 .action-squares-bar { display: grid; grid-template-columns: repeat(5, 1fr); gap: 5px; width: 92%; margin: 0 auto; }
    .widget-cloudmusic-4x4 .action-square-item { height: 23px; border-radius: 4px; background: rgba(255, 255, 255, 0.12); display: flex; align-items: center; justify-content: center; gap: 2.5px; color: rgba(255, 255, 255, 0.9); font-size: 9.5px; padding: 0 1px; }
    .widget-cloudmusic-4x4 .custom-svg-icon { width: 11px; height: 11px; fill: currentColor; flex-shrink: 0; }
    .widget-cloudmusic-4x4 .bottom-cards-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 6px; height: 110px; }
    .widget-cloudmusic-4x4 .bottom-card { border-radius: 5px; background: rgba(255, 255, 255, 0.16); overflow: hidden; display: flex; flex-direction: column; }
    .widget-cloudmusic-4x4 .card-cover-placeholder { width: 100%; flex: 1; background-color: #e5e5e7; background-size: cover; background-position: center; background-repeat: no-repeat; cursor: pointer; }
    .widget-cloudmusic-4x4 .bottom-card:nth-child(1) .card-cover-placeholder { background-color: #cfd2d6; }
    .widget-cloudmusic-4x4 .bottom-card:nth-child(2) .card-cover-placeholder { background-color: #9ba1a8; }
    .widget-cloudmusic-4x4 .bottom-card:nth-child(3) .card-cover-placeholder { background-color: #ebeef1; }
    .widget-cloudmusic-4x4 .bottom-card:nth-child(4) .card-cover-placeholder { background-color: #696e75; }
    .widget-cloudmusic-4x4 .card-title-bar { height: 28px; display: flex; align-items: center; justify-content: center; padding: 0 4px; }
    .widget-cloudmusic-4x4 .card-title-text { font-size: 10px; font-weight: 500; color: #ffffff; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; text-align: center; letter-spacing: 0.2px; outline: none; }
    .widget-cloudmusic-4x4 [contenteditable="true"] { outline: none; }
</style>
<div class="widget-cloudmusic-4x4 uploadable-img">
    <div class="widget-header">
        <div class="header-icons">
            <svg class="nav-svg" viewBox="0 0 24 24"><line x1="3" y1="6" x2="21" y2="6"></line><line x1="3" y1="12" x2="21" y2="12"></line><line x1="3" y1="18" x2="21" y2="18"></line></svg>
        </div>
        <div class="header-status-center">
            <svg style="width: 10px; height: 10px; stroke: currentColor; stroke-width: 2.4; fill: none;" viewBox="0 0 24 24"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
            <span class="status-text-editable" contenteditable="true" spellcheck="false">添加状态</span>
        </div>
        <div class="header-icons">
            <svg class="nav-svg" viewBox="0 0 24 24"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
            <svg class="nav-svg" viewBox="0 0 24 24"><circle cx="11" cy="11" r="7"></circle><line x1="16.5" y1="16.5" x2="21" y2="21"></line></svg>
            <svg class="nav-svg" viewBox="0 0 24 24" style="fill: #ffffff; stroke: none;"><circle cx="12" cy="5" r="1.6"></circle><circle cx="12" cy="12" r="1.6"></circle><circle cx="12" cy="19" r="1.6"></circle></svg>
        </div>
    </div>
    <div class="profile-section">
        <div class="avatar-circle uploadable-img"></div>
        <div class="username" contenteditable="true" spellcheck="false">云边漫步者</div>
        <div class="signature-text" contenteditable="true" spellcheck="false">把生活的琐碎熬成清澈的歌</div>
        <div class="meta-tags-row">
            <svg viewBox="0 0 24 24"><path d="M12 2L4 5V11C4 16.5 7.5 21 12 22C16.5 21 20 16.5 20 11V5L12 2Z"></path></svg>
            <span contenteditable="true" spellcheck="false">16枚徽章</span>
            <span>·</span>
            <span contenteditable="true" spellcheck="false">正在收听 晚风</span>
        </div>
        <div class="count-stats-row">
            <div><strong contenteditable="true" spellcheck="false">12</strong>关注</div>
            <div><strong contenteditable="true" spellcheck="false">28</strong>粉丝</div>
            <div><strong>Lv.8</strong></div>
            <div><strong contenteditable="true" spellcheck="false">960</strong>小时</div>
        </div>
    </div>
    <div class="action-squares-bar">
        <div class="action-square-item">
            <svg class="custom-svg-icon" viewBox="0 0 1024 1024"><path d="M512 102.4c226.304 0 409.6 183.296 409.6 409.6s-183.296 409.6-409.6 409.6-409.6-183.296-409.6-409.6 183.296-409.6 409.6-409.6z m0 410.112V288.768c0-20.48-16.896-37.376-37.376-37.376s-37.376 16.896-37.376 37.376v261.12c0 20.48 16.896 37.376 37.376 37.376h223.744c20.48 0 37.376-16.896 37.376-37.376s-16.896-37.376-37.376-37.376H512z m0 0"></path></svg>
            <span>最近</span>
        </div>
        <div class="action-square-item">
            <svg class="custom-svg-icon" viewBox="0 0 1024 1024"><path d="M800.890269 12.624239c16.047761 0 32.095522 7.122149 42.79403 19.608836l121.244656 156.916537c4.462806 5.945313 6.449672 13.143881 6.984597 22.619701 6.892896 10.851343 10.851343 23.842388 10.851344 37.994986V941.621493c0 37.444776-30.307343 69.540299-69.540299 69.540298h-791.689552c-37.444776 0-69.540299-30.307343-69.540299-69.540298V249.764299c0-14.244299 4.386388-27.709134 11.982329-38.942568 0.045851-7.458388 2.445373-15.023761 7.641791-21.672119l121.244656-156.916537c8.910328-12.486687 24.95809-19.608836 41.005851-19.608836z m-283.510448 347.701492a35.763582 35.763582 0 0 0-35.656597 35.656597v313.817791l-139.080597-139.080597c-14.274866-14.259582-35.671881-14.259582-49.931463 0-14.259582 14.274866-14.259582 35.671881 0 49.931463l197.922388 197.922388c5.349254 5.349254 12.486687 8.910328 19.608836 10.698508h7.137433c8.910328 0 17.83594-3.561075 24.958089-10.698508l199.710568-197.922388a37.964418 37.964418 0 0 0 0-49.931463c-14.259582-14.259582-35.656597-14.259582-49.931463 0l-139.080597 139.080597V395.997612a35.763582 35.763582 0 0 0-35.656597-35.656597zM793.752836 83.937433h-550.973135l-74.507462 96.286567h699.98806l-74.507463-96.286567z"></path></svg>
            <span>本地</span>
        </div>
        <div class="action-square-item">
            <svg class="custom-svg-icon" viewBox="0 0 1024 1024"><path d="M511.5 69C733.795 69 914 249.205 914 471.5c0 92.166-30.978 177.098-83.09 244.95l-0.01 172.42a75.9 75.9 0 0 1-2.969 21.02c-11.493 39.876-52.834 63.053-92.742 52.249l-1.209-0.338-175.893-50.695a161 161 0 0 0-88.192-0.28l-0.982 0.28-175.893 50.695A75.9 75.9 0 0 1 272 964.77c-41.5 0-75.22-33.306-75.89-74.645l-0.01-1.255-0.008-167.297C141.568 652.897 109 566.002 109 471.5 109 249.205 289.205 69 511.5 69z m94.79 793.774l144.251 41.566c8.544 2.463 17.467-2.468 19.93-11.012a16.1 16.1 0 0 0 0.621-3.956l0.008-0.502 0.008-109.771c-46.953 39.668-103.113 68.78-164.817 83.675z m-350.396-80.338l0.006 106.434c0 8.892 7.208 16.1 16.1 16.1a16.1 16.1 0 0 0 3.974-0.498l0.485-0.132 142.44-41.043c-60.819-14.32-116.315-42.435-163.005-80.861z m229.031-485.59l-45.059 91.295-100.748 14.64a32.2 32.2 0 0 0-18.428 9.39l-0.564 0.593c-11.838 12.767-11.392 32.719 1.146 44.94l72.903 71.061-17.21 100.346a32.2 32.2 0 0 0 3.236 20.428l0.361 0.668c8.47 15.242 27.608 21.006 43.124 12.849L513.8 615.68l90.114 47.376a32.2 32.2 0 0 0 20.427 3.235l0.717-0.13c17.13-3.332 28.541-19.762 25.576-37.05l-17.211-100.346 72.905-71.06a32.2 32.2 0 0 0 9.39-18.428l0.095-0.713c2.13-17.325-9.97-33.26-27.33-35.783l-100.752-14.64-45.056-91.295a32.2 32.2 0 0 0-14.624-14.624c-15.948-7.87-35.256-1.323-43.126 14.624z"></path></svg>
            <span>勋章</span>
        </div>
        <div class="action-square-item">
            <svg class="custom-svg-icon" viewBox="0 0 1024 1024"><path d="M936.672 193.216l-226.88-64c-8.704-2.528-18.112-1.12-25.824 3.776-7.68 4.864-12.896 12.736-14.432 21.728C655.712 236.928 595.328 288 512 288c-71.424 0-142.464-103.296-163.776-143.104-7.136-13.28-22.528-19.84-37.024-15.68l-224 64C73.472 197.152 64 209.728 64 224v256a31.93 31.93 0 0 0 11.712 24.736c7.392 6.08 17.152 8.512 26.56 6.624L224 487.04V832c0 52.928 43.072 96 96 96h384c52.928 0 96-43.072 96-96V519.04l121.728 24.352c9.44 1.92 19.2-0.544 26.56-6.624C955.68 530.656 960 521.6 960 512V224c0-14.336-9.536-26.912-23.328-30.784zM672 800H352c-17.664 0-32-14.304-32-32s14.336-32 32-32h320c17.696 0 32 14.304 32 32s-14.304 32-32 32z"></path></svg>
            <span>装扮</span>
        </div>
        <div class="action-square-item">
            <svg class="custom-svg-icon" viewBox="0 0 1024 1024"><path d="M409.113 95.852h-299.65c-24.82 0-44.947 20.137-44.947 44.956v299.62c0 24.82 20.127 44.957 44.947 44.957h299.65c24.79 0 44.945-20.137 44.945-44.956V140.808c0-24.82-20.156-44.956-44.945-44.956zM869.771 556.522h-299.66c-24.82 0-44.936 20.116-44.936 44.935v299.64c0 24.821 20.116 44.937 44.937 44.937h299.66c24.8 0 44.936-20.116 44.936-44.936v-299.64c0-24.82-20.137-44.936-44.937-44.936zM937.536 210.565L695.37 82.722c-20.035-10.588-44.876-2.902-55.483 17.114L512.025 342.049c-10.568 20.077-2.892 44.877 17.174 55.505l242.174 127.823c20.056 10.588 44.936 2.902 55.524-17.135L954.72 266.07c10.599-20.076 2.922-44.916-17.184-55.504zM409.113 556.522h-299.65c-24.82 0-44.947 20.116-44.947 44.935v299.64c0 24.821 20.127 44.937 44.947 44.937h299.65c24.79 0 44.945-20.116 44.945-44.936v-299.64c0-24.82-20.156-44.936-44.945-44.936z"></path></svg>
        </div>
    </div>
    <div class="bottom-cards-grid">
        <div class="bottom-card">
            <div class="card-cover-placeholder uploadable-img"></div>
            <div class="card-title-bar"><span class="card-title-text" contenteditable="true" spellcheck="false">About You</span></div>
        </div>
        <div class="bottom-card">
            <div class="card-cover-placeholder uploadable-img"></div>
            <div class="card-title-bar"><span class="card-title-text" contenteditable="true" spellcheck="false">Pale Blue</span></div>
        </div>
        <div class="bottom-card">
            <div class="card-cover-placeholder uploadable-img"></div>
            <div class="card-title-bar"><span class="card-title-text" contenteditable="true" spellcheck="false">Slow Dive</span></div>
        </div>
        <div class="bottom-card">
            <div class="card-cover-placeholder uploadable-img"></div>
            <div class="card-title-bar"><span class="card-title-text" contenteditable="true" spellcheck="false">Deep End</span></div>
        </div>
    </div>
</div>`
            }

        ];

        const customWidgets = window.customWidgets || [];

        window.officialWidgets = officialWidgets;
        window.customWidgets = customWidgets;
        let currentWidgets = officialWidgets;

        let widgetViewMode = localStorage.getItem('themeWidgetViewMode') || 'carousel';
        let isWidgetEditing = false;
        let currentProgress = 0, targetProgress = 0;
        let isDragging = false, startX = 0, startProgress = 0;
        let activeWidgetIndex = -1;
        let widgetPreviewTimer = 0;
        const widgetPreviewDebounceMs = 180;

        function findWidgetTagEnd(source, startIndex) {
            let quote = '';
            for (let i = startIndex; i < source.length; i++) {
                const char = source[i];
                if (quote) {
                    if (char === quote) quote = '';
                } else if (char === '"' || char === "'") {
                    quote = char;
                } else if (char === '>') {
                    return i;
                }
            }
            return -1;
        }

        function getWidgetTagAttribute(tagText, attributeName) {
            const escapedName = attributeName.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
            const pattern = new RegExp('\\s' + escapedName + '\\s*=\\s*(?:"([^"]*)"|\'([^\']*)\'|([^\\s>]+))', 'i');
            const match = pattern.exec(tagText);
            return match ? (match[1] || match[2] || match[3] || '') : '';
        }

        function scanWidgetImageTags(content) {
            const source = String(content == null ? '' : content);
            const lowerSource = source.toLowerCase();
            const counters = { img: 0, image: 0, uploadable: 0, contenteditable: 0 };
            const tags = [];
            let cursor = 0;

            while (cursor < source.length) {
                const tagStart = source.indexOf('<', cursor);
                if (tagStart === -1) break;

                if (lowerSource.slice(tagStart, tagStart + 4) === '<!--') {
                    const commentEnd = lowerSource.indexOf('-->', tagStart + 4);
                    cursor = commentEnd === -1 ? source.length : commentEnd + 3;
                    continue;
                }

                let nameStart = tagStart + 1;
                while (/\s/.test(source[nameStart] || '')) nameStart++;
                if (/[/!?]/.test(source[nameStart] || '')) {
                    const skippedTagEnd = findWidgetTagEnd(source, nameStart + 1);
                    cursor = skippedTagEnd === -1 ? source.length : skippedTagEnd + 1;
                    continue;
                }

                let nameEnd = nameStart;
                while (/[A-Za-z0-9:-]/.test(source[nameEnd] || '')) nameEnd++;
                if (nameEnd === nameStart) {
                    cursor = tagStart + 1;
                    continue;
                }

                const tagName = lowerSource.slice(nameStart, nameEnd);
                const tagEnd = findWidgetTagEnd(source, nameEnd);
                if (tagEnd === -1) break;

                const tagText = source.slice(tagStart, tagEnd + 1);
                if (tagName === 'img' || tagName === 'image') {
                    tags.push({
                        name: tagName,
                        tagName: tagName,
                        kind: tagName,
                        index: counters[tagName]++,
                        start: tagStart,
                        end: tagEnd
                    });
                }

                const classNames = getWidgetTagAttribute(tagText, 'class').split(/\s+/).filter(Boolean);
                if (tagName !== 'img' && tagName !== 'image' && classNames.indexOf('uploadable-img') !== -1) {
                    tags.push({
                        name: 'uploadable',
                        tagName: tagName,
                        kind: 'uploadable',
                        index: counters.uploadable++,
                        start: tagStart,
                        end: tagEnd
                    });
                }

                if (getWidgetTagAttribute(tagText, 'contenteditable').toLowerCase() === 'true') {
                    tags.push({
                        name: 'contenteditable',
                        tagName: tagName,
                        kind: 'contenteditable',
                        index: counters.contenteditable++,
                        start: tagStart,
                        end: tagEnd
                    });
                }

                if (tagName === 'script' || tagName === 'style') {
                    const closeStart = lowerSource.indexOf('</' + tagName, tagEnd + 1);
                    if (closeStart === -1) break;
                    const closeEnd = findWidgetTagEnd(source, closeStart + tagName.length + 2);
                    cursor = closeEnd === -1 ? source.length : closeEnd + 1;
                } else {
                    cursor = tagEnd + 1;
                }
            }

            return tags;
        }

        function widgetImageEditBridge(mode) {
            const isDesktopWidget = mode === 'desktop';
            let desktopEditMode = false;
            let pointerStart = null;
            let desktopTouchStart = null;
            let suppressImageClickUntil = 0;

            function applyImageUpdate(target, imageUrl) {
                if (!target || typeof imageUrl !== 'string') return false;
                let element = null;
                if (target.kind === 'uploadable') {
                    element = document.querySelector('[data-widget-editor-uploadable-index="' + target.index + '"]');
                    if (element) element.style.backgroundImage = 'url("' + imageUrl.replace(/"/g, '\\"') + '")';
                } else if (target.kind === 'img' || target.kind === 'image') {
                    if (!target.dynamic) {
                        element = document.querySelector('[data-widget-editor-image-index="' + target.index + '"]');
                    } else {
                        element = document.querySelectorAll(target.kind)[target.index] || null;
                    }
                    if (element) {
                        const attribute = target.attribute || (target.kind === 'image' ? 'href' : 'src');
                        element.setAttribute(attribute, imageUrl);
                        if (target.kind === 'image' && attribute === 'xlink:href') element.setAttributeNS('http://www.w3.org/1999/xlink', 'xlink:href', imageUrl);
                        if (target.kind === 'img' && element.hasAttribute('srcset')) element.setAttribute('srcset', imageUrl);
                    }
                } else if (target.kind === 'background') {
                    const candidates = document.querySelectorAll('*');
                    for (let i = 0; i < candidates.length; i++) {
                        if (getBackgroundSource(candidates[i]) === target.source) {
                            element = candidates[i];
                            element.style.backgroundImage = 'url("' + imageUrl.replace(/"/g, '\\"') + '")';
                            break;
                        }
                    }
                }
                return !!element;
            }

            function findContentEditableTarget(startElement) {
                const editable = startElement && startElement.closest
                    ? startElement.closest('[data-widget-editor-content-index]')
                    : null;
                if (!editable) return null;

                const markedIndex = editable.getAttribute('data-widget-editor-content-index');
                const index = parseInt(markedIndex, 10);
                if (!Number.isFinite(index)) return null;

                return {
                    kind: 'contenteditable',
                    index: index,
                    html: editable.innerHTML
                };
            }

            function postContentEdit(element, phase) {
                const target = findContentEditableTarget(element);
                if (!target) return;

                parent.postMessage({
                    type: isDesktopWidget ? 'widget-desktop-content' : 'widget-image-editor-content',
                    phase: phase,
                    target: { kind: target.kind, index: target.index },
                    html: target.html
                }, '*');
            }

            function postDesktopPointer(phase, event) {
                parent.postMessage({
                    type: 'widget-desktop-pointer',
                    phase: phase,
                    pointerId: event.pointerId,
                    clientX: event.clientX,
                    clientY: event.clientY,
                    // Keep movement stable while the containing iframe moves.
                    screenX: event.screenX,
                    screenY: event.screenY
                }, '*');
            }

            function postDesktopSwipe(startTouch, endTouch) {
                parent.postMessage({
                    type: 'widget-desktop-swipe',
                    deltaX: endTouch.clientX - startTouch.clientX,
                    deltaY: endTouch.clientY - startTouch.clientY
                }, '*');
            }

            if (isDesktopWidget && !window.PointerEvent) {
                document.addEventListener('touchstart', function (event) {
                    if (event.touches.length !== 1) {
                        desktopTouchStart = null;
                        return;
                    }
                    const touch = event.touches[0];
                    desktopTouchStart = {
                        identifier: touch.identifier,
                        clientX: touch.clientX,
                        clientY: touch.clientY
                    };
                }, { capture: true, passive: true });

                document.addEventListener('touchend', function (event) {
                    if (!desktopTouchStart) return;
                    let endTouch = null;
                    for (let index = 0; index < event.changedTouches.length; index++) {
                        if (event.changedTouches[index].identifier === desktopTouchStart.identifier) {
                            endTouch = event.changedTouches[index];
                            break;
                        }
                    }
                    if (endTouch) postDesktopSwipe(desktopTouchStart, endTouch);
                    desktopTouchStart = null;
                }, { capture: true, passive: true });

                document.addEventListener('touchcancel', function () {
                    desktopTouchStart = null;
                }, { capture: true, passive: true });
            }

            document.addEventListener('pointerdown', function (event) {
                if (event.isPrimary === false) return;
                pointerStart = {
                    pointerId: event.pointerId,
                    clientX: event.clientX,
                    clientY: event.clientY,
                    startedAt: Date.now(),
                    moved: false
                };
                if (isDesktopWidget) {
                    try {
                        if (event.target && event.target.setPointerCapture) {
                            event.target.setPointerCapture(event.pointerId);
                        }
                    } catch (error) {
                        // Pointer capture is optional; the parent still receives normal events.
                    }
                    postDesktopPointer('down', event);
                }
            }, true);

            document.addEventListener('pointermove', function (event) {
                if (!pointerStart || pointerStart.pointerId !== event.pointerId) return;
                if (Math.abs(event.clientX - pointerStart.clientX) > 10 || Math.abs(event.clientY - pointerStart.clientY) > 10) {
                    pointerStart.moved = true;
                }
                if (isDesktopWidget) {
                    postDesktopPointer('move', event);
                }
            }, true);

            document.addEventListener('pointerup', function (event) {
                if (!pointerStart || pointerStart.pointerId !== event.pointerId) return;
                const pressDuration = Date.now() - pointerStart.startedAt;
                const shouldOpenTouchPicker = isDesktopWidget && desktopEditMode && event.pointerType === 'touch' && !pointerStart.moved && pressDuration < 550;
                if (pointerStart.moved || pressDuration >= 550 || shouldOpenTouchPicker) {
                    suppressImageClickUntil = Date.now() + 500;
                }
                if (isDesktopWidget) {
                    postDesktopPointer('up', event);
                }
                pointerStart = null;

                if (shouldOpenTouchPicker) {
                    const element = event.target && event.target.nodeType === 1 ? event.target : null;
                    const target = element && (findImageTarget(element) || findBackgroundTarget(element));
                    if (target) {
                        event.preventDefault();
                        event.stopImmediatePropagation();
                        openWidgetImagePicker(target, event);
                    }
                }
            }, true);

            document.addEventListener('pointercancel', function (event) {
                if (!pointerStart || pointerStart.pointerId !== event.pointerId) return;
                suppressImageClickUntil = Date.now() + 500;
                if (isDesktopWidget) {
                    postDesktopPointer('cancel', event);
                }
                pointerStart = null;
            }, true);

            function extractBackgroundUrl(value) {
                const match = String(value || '').match(/url\(\s*(?:"([^"]*)"|'([^']*)'|([^)]*))\s*\)/i);
                return match ? (match[1] || match[2] || (match[3] || '').trim()) : '';
            }

            function findRuleBackground(element, rules) {
                let source = '';
                Array.prototype.forEach.call(rules || [], function (rule) {
                    try {
                        if (rule.cssRules) {
                            const nestedSource = findRuleBackground(element, rule.cssRules);
                            if (nestedSource) source = nestedSource;
                        } else if (rule.selectorText && element.matches(rule.selectorText)) {
                            const ruleSource = extractBackgroundUrl(rule.style && rule.style.backgroundImage);
                            if (ruleSource) source = ruleSource;
                        }
                    } catch (error) {
                        // Ignore inaccessible or unsupported CSS rules in the preview.
                    }
                });
                return source;
            }

            function getBackgroundSource(element) {
                const inlineSource = extractBackgroundUrl(element.style && element.style.backgroundImage);
                if (inlineSource) return inlineSource;

                let ruleSource = '';
                Array.prototype.forEach.call(document.styleSheets || [], function (styleSheet) {
                    try {
                        const matchedSource = findRuleBackground(element, styleSheet.cssRules);
                        if (matchedSource) ruleSource = matchedSource;
                    } catch (error) {
                        // Ignore inaccessible stylesheets in the preview.
                    }
                });
                if (ruleSource) return ruleSource;

                return extractBackgroundUrl(getComputedStyle(element).backgroundImage);
            }

            function findBackgroundTarget(startElement) {
                let element = startElement;
                while (element && element.nodeType === 1) {
                    const source = getBackgroundSource(element);
                    if (source) return { kind: 'background', source: source };
                    if (element === document.body || element === document.documentElement) break;
                    element = element.parentElement;
                }
                return null;
            }

            function findImageTarget(startElement) {
                const uploadable = startElement && startElement.closest
                    ? startElement.closest('[data-widget-editor-uploadable-index]')
                    : null;
                if (uploadable) {
                    const markedIndex = uploadable.getAttribute('data-widget-editor-uploadable-index');
                    const index = parseInt(markedIndex, 10);
                    if (Number.isFinite(index)) {
                        return {
                            kind: 'uploadable',
                            index: index,
                            source: getBackgroundSource(uploadable)
                        };
                    }
                }

                const image = startElement && startElement.closest
                    ? startElement.closest('img, image')
                    : null;
                if (!image) return null;

                const tagName = image.tagName.toLowerCase();
                const markedIndex = image.getAttribute('data-widget-editor-image-index');
                const isStaticImage = markedIndex !== null;
                let attribute = tagName === 'image' ? 'href' : 'src';
                let source = image.getAttribute(attribute) || '';

                if (tagName === 'image' && !source) {
                    attribute = 'xlink:href';
                    source = image.getAttribute('xlink:href') || '';
                }

                return {
                    kind: tagName,
                    index: isStaticImage
                        ? parseInt(markedIndex, 10)
                        : Array.prototype.indexOf.call(document.querySelectorAll(tagName), image),
                    attribute: attribute,
                    source: source,
                    dynamic: !isStaticImage
                };
            }

            function openWidgetImagePicker(target, triggerEvent) {
                if (isDesktopWidget) {
                    parent.postMessage({
                        type: 'widget-desktop-image-pick',
                        target: target,
                        clientX: triggerEvent ? triggerEvent.clientX : null,
                        clientY: triggerEvent ? triggerEvent.clientY : null
                    }, '*');
                    return;
                }
                const input = document.createElement('input');
                input.type = 'file';
                input.accept = 'image/*';
                input.style.display = 'none';
                document.body.appendChild(input);
                input.addEventListener('change', function () {
                    const file = input.files && input.files[0];
                    if (file) {
                        parent.postMessage({
                            type: isDesktopWidget ? 'widget-desktop-image-file' : 'widget-image-editor-file',
                            target: target,
                            file: file
                        }, '*');
                    }
                    input.remove();
                }, { once: true });
                input.addEventListener('cancel', function () { input.remove(); }, { once: true });
                input.click();
            }

            document.addEventListener('pointerover', function (event) {
                const element = event.target && event.target.nodeType === 1 ? event.target : null;
                if (!element) return;
                const uploadable = element.closest && element.closest('[data-widget-editor-uploadable-index]');
                if (uploadable) {
                    uploadable.setAttribute('data-widget-editor-uploadable-hover', '');
                    return;
                }
                if (element.closest && element.closest('img, image, [contenteditable="true"]')) return;
                let current = element;
                while (current && current.nodeType === 1) {
                    if (getBackgroundSource(current)) {
                        current.setAttribute('data-widget-editor-background', '');
                        break;
                    }
                    if (current === document.body || current === document.documentElement) break;
                    current = current.parentElement;
                }
            }, true);

            window.addEventListener('message', function (event) {
                if (event.source !== parent || !event.data) return;
                if (event.data.type === 'widget-desktop-edit-state') {
                    desktopEditMode = event.data.editing === true;
                    return;
                }
                if (event.data.type !== 'widget-image-update') return;
                applyImageUpdate(event.data.target, event.data.imageUrl);
            });

            if (isDesktopWidget) {
                parent.postMessage({ type: 'widget-desktop-edit-state-request' }, '*');
            }

            document.addEventListener('click', function (event) {
                const element = event.target && event.target.nodeType === 1 ? event.target : null;
                if (!element || (element.matches && element.matches('input[type="file"]'))) return;
                if (element.closest && element.closest('[contenteditable="true"]')) return;

                const target = findImageTarget(element) || findBackgroundTarget(element);
                if (!target) return;

                // Image replacement is available directly from the desktop widget.

                if (isDesktopWidget && Date.now() < suppressImageClickUntil) {
                    event.preventDefault();
                    event.stopImmediatePropagation();
                    return;
                }

                event.preventDefault();
                event.stopImmediatePropagation();
                openWidgetImagePicker(target, event);
            }, true);

            document.addEventListener('focus', function (event) {
                if (!isDesktopWidget) return;
                const element = event.target && event.target.nodeType === 1 ? event.target : null;
                if (element) postContentEdit(element, 'focus');
            }, true);

            document.addEventListener('input', function (event) {
                const element = event.target && event.target.nodeType === 1 ? event.target : null;
                if (element) postContentEdit(element, 'input');
            }, true);

            document.addEventListener('blur', function (event) {
                const element = event.target && event.target.nodeType === 1 ? event.target : null;
                if (element) postContentEdit(element, 'blur');
            }, true);
        }

        function buildWidgetImageEditableContent(content, mode) {
            let previewContent = String(content == null ? '' : content);
            const tags = scanWidgetImageTags(previewContent);

            for (let i = tags.length - 1; i >= 0; i--) {
                const tag = tags[i];
                let insertAt = tag.end;
                let beforeEnd = tag.end - 1;
                while (beforeEnd > tag.start && /\s/.test(previewContent[beforeEnd])) beforeEnd--;
                if (previewContent[beforeEnd] === '/') insertAt = beforeEnd;
                const markerName = tag.name === 'uploadable'
                    ? 'data-widget-editor-uploadable-index'
                    : tag.name === 'contenteditable'
                        ? 'data-widget-editor-content-index'
                        : 'data-widget-editor-image-index';
                const marker = ' ' + markerName + '="' + tag.index + '"';
                previewContent = previewContent.slice(0, insertAt) + marker + previewContent.slice(insertAt);
            }

            const desktopGestureStyle = mode === 'desktop'
                ? '<style>html,body{touch-action:pan-y!important;overscroll-behavior:none!important;}</style>'
                : '';
            const editStyle = '<style>img[data-widget-editor-image-index],image[data-widget-editor-image-index],[data-widget-editor-uploadable-index],[data-widget-editor-background]{cursor:pointer!important}[data-widget-editor-content-index]{cursor:text!important}[data-widget-editor-uploadable-index]:hover,img[data-widget-editor-image-index]:hover,image[data-widget-editor-image-index]:hover,[data-widget-editor-background]:hover{outline:2px solid #007aff!important;outline-offset:-2px}[data-widget-editor-content-index]:focus{outline:2px solid rgba(0,122,255,.55)!important;outline-offset:2px}</style>';
            const editScript = '<script>(' + widgetImageEditBridge.toString() + ')(' + JSON.stringify(mode || 'editor') + ');<' + '/script>';
            const editTools = desktopGestureStyle + editStyle + editScript;
            const headMatch = /<head\b[^>]*>/i.exec(previewContent);

            if (headMatch) {
                const insertAt = headMatch.index + headMatch[0].length;
                return previewContent.slice(0, insertAt) + editTools + previewContent.slice(insertAt);
            }
            return editTools + previewContent;
        }

        function buildWidgetEditablePreview(content) {
            return buildWidgetImageEditableContent(content, 'editor');
        }

        function buildWidgetDesktopContent(content) {
            return buildWidgetImageEditableContent(content, 'desktop');
        }

        function replaceWidgetTagImage(tagText, target, imageUrl) {
            const attribute = target.attribute || (target.kind === 'image' ? 'href' : 'src');
            const escapedAttribute = attribute.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
            const attributePattern = new RegExp('(\\s' + escapedAttribute + '\\s*=\\s*)(?:"[^"]*"|\'[^\']*\'|[^\\s>]+)', 'i');
            let updatedTag = tagText;

            if (attributePattern.test(tagText)) {
                updatedTag = tagText.replace(attributePattern, function (match, prefix) {
                    return prefix + '"' + imageUrl + '"';
                });
            } else {
                let insertAt = tagText.lastIndexOf('>');
                let beforeEnd = insertAt - 1;
                while (beforeEnd > 0 && /\s/.test(tagText[beforeEnd])) beforeEnd--;
                if (tagText[beforeEnd] === '/') insertAt = beforeEnd;
                updatedTag = tagText.slice(0, insertAt) + ' ' + attribute + '="' + imageUrl + '"' + tagText.slice(insertAt);
            }

            if (target.kind === 'img' && attribute === 'src') {
                const srcsetPattern = /(\ssrcset\s*=\s*)(?:"[^"]*"|'[^']*'|[^\s>]+)/i;
                updatedTag = updatedTag.replace(srcsetPattern, function (match, prefix) {
                    return prefix + '"' + imageUrl + '"';
                });
            }
            return updatedTag;
        }

        function replaceWidgetImageContent(content, target, imageUrl) {
            const source = String(content == null ? '' : content);
            if (target && target.kind === 'uploadable') {
                const matchingTags = scanWidgetImageTags(source).filter(function (tag) {
                    return tag.name === 'uploadable';
                });
                const tag = matchingTags[target.index];
                if (tag) {
                    const tagText = source.slice(tag.start, tag.end + 1);
                    const replacement = replaceWidgetUploadableTag(tagText, imageUrl);
                    return source.slice(0, tag.start) + replacement + source.slice(tag.end + 1);
                }
            }

            if (target && (target.kind === 'img' || target.kind === 'image') && !target.dynamic) {
                const matchingTags = scanWidgetImageTags(source).filter(function (tag) {
                    return tag.name === target.kind;
                });
                const tag = matchingTags[target.index];
                if (tag) {
                    const tagText = source.slice(tag.start, tag.end + 1);
                    const replacement = replaceWidgetTagImage(tagText, target, imageUrl);
                    return source.slice(0, tag.start) + replacement + source.slice(tag.end + 1);
                }
            }

            if (target && target.source && source.indexOf(target.source) !== -1) {
                return source.replace(target.source, imageUrl);
            }
            return null;
        }

        function replaceWidgetUploadableTag(tagText, imageUrl) {
            const safeUrl = String(imageUrl == null ? '' : imageUrl)
                .replace(/&/g, '&amp;')
                .replace(/"/g, '&quot;')
                .replace(/</g, '&lt;')
                .replace(/>/g, '&gt;');
            const backgroundDeclaration = 'background-image: url(' + safeUrl + ')';
            const stylePattern = /(\sstyle\s*=\s*)(?:"([^"]*)"|'([^']*)'|([^\s>]+))/i;
            const styleMatch = stylePattern.exec(tagText);

            if (styleMatch) {
                const quote = styleMatch[2] !== undefined ? '"' : styleMatch[3] !== undefined ? "'" : '';
                const currentStyle = styleMatch[2] !== undefined
                    ? styleMatch[2]
                    : styleMatch[3] !== undefined
                        ? styleMatch[3]
                        : styleMatch[4];
                const nextStyle = /background-image\s*:/i.test(currentStyle)
                    ? currentStyle.replace(/background-image\s*:\s*[^;]*(;?)/i, backgroundDeclaration + '$1')
                    : currentStyle.replace(/\s*$/, '') + (currentStyle.trim() ? '; ' : '') + backgroundDeclaration;
                const encodedStyle = quote === '"'
                    ? nextStyle.replace(/"/g, '&quot;')
                    : quote === "'"
                        ? nextStyle.replace(/'/g, '&#39;')
                        : nextStyle;
                return tagText.replace(stylePattern, function (match, prefix) {
                    return prefix + (quote ? quote + encodedStyle + quote : encodedStyle);
                });
            }

            let insertAt = tagText.lastIndexOf('>');
            let beforeEnd = insertAt - 1;
            while (beforeEnd > 0 && /\s/.test(tagText[beforeEnd])) beforeEnd--;
            if (tagText[beforeEnd] === '/') insertAt = beforeEnd;
            return tagText.slice(0, insertAt) + ' style="' + backgroundDeclaration + '"' + tagText.slice(insertAt);
        }

        function findWidgetElementContentRange(source, tag) {
            const tagName = tag && tag.tagName;
            if (!tagName) return null;

            const openingTag = source.slice(tag.start, tag.end + 1);
            if (/\/\s*>$/.test(openingTag)) return null;

            let depth = 1;
            let cursor = tag.end + 1;
            const lowerSource = source.toLowerCase();
            while (cursor < source.length) {
                const nextTagStart = source.indexOf('<', cursor);
                if (nextTagStart === -1) return null;

                if (lowerSource.slice(nextTagStart, nextTagStart + 4) === '<!--') {
                    const commentEnd = lowerSource.indexOf('-->', nextTagStart + 4);
                    cursor = commentEnd === -1 ? source.length : commentEnd + 3;
                    continue;
                }

                const nextTagEnd = findWidgetTagEnd(source, nextTagStart + 1);
                if (nextTagEnd === -1) return null;
                const nextTagText = source.slice(nextTagStart, nextTagEnd + 1);
                const nameMatch = /^<\s*(\/?)\s*([A-Za-z0-9:-]+)/.exec(nextTagText);
                if (nameMatch && nameMatch[2].toLowerCase() === tagName.toLowerCase()) {
                    if (nameMatch[1]) {
                        depth--;
                        if (depth === 0) {
                            return { start: tag.end + 1, end: nextTagStart };
                        }
                    } else if (!/\/\s*>$/.test(nextTagText)) {
                        depth++;
                    }
                }

                cursor = nextTagEnd + 1;
            }
            return null;
        }

        function replaceWidgetEditableContent(content, target, html) {
            const source = String(content == null ? '' : content);
            if (!target || target.kind !== 'contenteditable' || !Number.isInteger(target.index) || target.index < 0) return null;

            const editableTags = scanWidgetImageTags(source).filter(function (tag) {
                return tag.name === 'contenteditable';
            });
            const tag = editableTags[target.index];
            const range = tag && findWidgetElementContentRange(source, tag);
            if (!range) return null;

            return source.slice(0, range.start) + String(html == null ? '' : html) + source.slice(range.end);
        }

        function readWidgetImageFile(file) {
            return new Promise(function (resolve, reject) {
                const reader = new FileReader();
                reader.onload = function () { resolve(reader.result); };
                reader.onerror = function () { reject(reader.error || new Error('Image read failed')); };
                reader.readAsDataURL(file);
            });
        }

        function isWidgetImageFilePayload(value) {
            if (!value || (typeof value !== 'object' && typeof value !== 'function')) return false;
            if (typeof Blob !== 'undefined' && value instanceof Blob) return true;
            const tag = Object.prototype.toString.call(value);
            return tag === '[object Blob]' || tag === '[object File]';
        }

        async function prepareWidgetImageData(file) {
            const originalData = await readWidgetImageFile(file);
            if (file.type === 'image/gif' || file.type === 'image/svg+xml') return originalData;
            if (typeof window.compressImageBase64 !== 'function') return originalData;

            return new Promise(function (resolve) {
                window.compressImageBase64(originalData, 1600, 0.88, function (compressedData) {
                    resolve(compressedData && compressedData.length < originalData.length ? compressedData : originalData);
                });
            });
        }

        window.addEventListener('message', async function (event) {
            const frame = document.getElementById('widgetCodePreviewFrame');
            const editorModal = document.getElementById('widgetEditorModal');
            const message = event.data;
            if (!frame || event.source !== frame.contentWindow || !editorModal || !editorModal.classList.contains('show')) return;
            if (!message) return;

            if (message.type === 'widget-image-editor-content') {
                if (typeof message.html !== 'string' || !message.target || typeof window.replaceWidgetEditableContent !== 'function') return;
                const editor = document.getElementById('widgetEditContent');
                const updatedContent = window.replaceWidgetEditableContent(editor.value, message.target, message.html);
                if (updatedContent != null) editor.value = updatedContent;
                return;
            }

            if (message.type !== 'widget-image-editor-file' || !isWidgetImageFilePayload(message.file)) return;

            try {
                const imageData = await prepareWidgetImageData(message.file);
                const editor = document.getElementById('widgetEditContent');
                const updatedContent = replaceWidgetImageContent(editor.value, message.target, imageData);
                if (updatedContent == null) {
                    if (typeof window.showToast === 'function') window.showToast('\u672a\u80fd\u5b9a\u4f4d\u8fd9\u5f20\u56fe\u7247');
                    return;
                }
                editor.value = updatedContent;
                frame.contentWindow?.postMessage({ type: 'widget-image-update', target: message.target, imageUrl: imageData }, '*');
                if (typeof window.showToast === 'function') window.showToast('\u56fe\u7247\u5df2\u66ff\u6362');
            } catch (error) {
                if (typeof window.showToast === 'function') window.showToast('\u56fe\u7247\u8bfb\u53d6\u5931\u8d25');
            }
        });

            // show three-dots button; click to expand vertical capsule menu
        window.renderWidgetViews = renderWidgetViews;

        function hideWidgetChrome() {
            const wg = document.getElementById('widgetAppGrid'); if (wg) wg.style.display = 'none';
            const vb = document.getElementById('widgetViewBtn'); if (vb) vb.style.display = 'none';
            const wgc = document.getElementById('widgetToolbarMenu'); if (wgc) wgc.style.display = 'none';
            const dots = document.getElementById('menuIconDots'); if (dots) dots.style.display = 'none';
            const list = document.getElementById('menuIconList'); if (list) list.style.display = 'block';
            exitWidgetEditMode(true);
        }
        window.hideWidgetChrome = hideWidgetChrome;

        function closeWidgetMenus() {
            const dd = document.getElementById('themeDropdownMenu'); if (dd) dd.classList.remove('show');
            const tbm = document.getElementById('widgetToolbarMenu'); if (tbm) tbm.classList.remove('show');
            const cm = document.getElementById('widgetContextMenu'); if (cm) cm.classList.remove('show');
            const dots = document.getElementById('menuIconDots'); if (dots) dots.style.display = 'block';
            const chev = document.getElementById('menuIconChevron'); if (chev) chev.style.display = 'none';
            const overlay = document.getElementById('widgetOverlay');
            const editor = document.getElementById('widgetEditorModal');
            if (editor && editor.classList.contains('show')) {
                if (overlay) overlay.style.zIndex = '250';
            } else if (overlay) {
                overlay.style.display = 'none';
                overlay.style.zIndex = '105';
            }
        }
        window.closeWidgetMenus = closeWidgetMenus;

            // show three-dots button; click to expand vertical capsule menu
        const originalToggleThemeMenu = window.toggleThemeMenu;
        window.toggleThemeMenu = function () {
            if (currentActiveTab === "widget") {
                const m = document.getElementById("widgetToolbarMenu");
                const ov = document.getElementById("widgetOverlay");
                if (!m.classList.contains("show")) {
                    m.classList.add("show");
                    if (ov) { ov.style.display = "block"; ov.style.zIndex = "240"; }
                    const d = document.getElementById("menuIconDots"); if (d) d.style.display = "none";
                    const c = document.getElementById("menuIconChevron"); if (c) c.style.display = "block";
                } else {
                    closeWidgetMenus();
                }
                return;
            } else if (typeof originalToggleThemeMenu === "function") { originalToggleThemeMenu(); }
        };

        function openWidgetContextMenu(index, event) {
            event.stopPropagation(); activeWidgetIndex = index;
            const menu = document.getElementById('widgetContextMenu');
            const overlay = document.getElementById('widgetOverlay');
            const rect = event.currentTarget.getBoundingClientRect();
            const hostRect = (themeAppUI || document.body).getBoundingClientRect();
            let top = rect.bottom - hostRect.top + 10;
            let left = rect.right - hostRect.left - 140;
            if (top + 200 > hostRect.height) top = rect.top - hostRect.top - 190;
            if (left < 16) left = 16;
            menu.style.top = top + 'px'; menu.style.left = left + 'px';
            menu.classList.add('show');
            overlay.style.display = 'block'; overlay.style.zIndex = '350';
        }
        window.openWidgetContextMenu = openWidgetContextMenu;

        function widgetCtxAction(action) {
            closeWidgetMenus();
            if (activeWidgetIndex === -1) return;

            if (action === 'edit') { openWidgetEditor(activeWidgetIndex); }
            else if (action === 'addToDesktop') {
                const widget = currentWidgets[activeWidgetIndex];
                const added = addDesktopWidget(widget);
                if (added && typeof window.showToast === 'function') window.showToast('已添加到桌面');
            }
            else if (action === 'export') {
                const widget = currentWidgets[activeWidgetIndex];
                const fileName = (widget.name || 'widget') + '.json';
                const dataStr = JSON.stringify(widget, null, 2);
                const blob = new Blob([dataStr], { type: 'application/json' });
                const url = URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = fileName;
                document.body.appendChild(a);
                a.click();
                document.body.removeChild(a);
                URL.revokeObjectURL(url);
                if (typeof showToast === 'function') showToast("导出成功");
            }
            else if (action === 'delete') {
                // 复用已有的删除逻辑，传入一个空的 event 对象防止报错
                deleteWidget(activeWidgetIndex, { stopPropagation: () => {} });
            }
        }
        window.widgetCtxAction = widgetCtxAction;

        function toggleWidgetViewMode(forceMode) {
            widgetViewMode = forceMode ? forceMode : (widgetViewMode === 'carousel' ? 'list' : 'carousel');
            localStorage.setItem('themeWidgetViewMode', widgetViewMode); // 保存用户的选择
            const iL = document.getElementById('widgetIconList');
            const iC = document.getElementById('widgetIconCard');
            if (iL) iL.style.display = widgetViewMode === 'carousel' ? 'block' : 'none';
            if (iC) iC.style.display = widgetViewMode === 'list' ? 'block' : 'none';
            if (widgetViewMode === 'list') widgetContentArea.classList.add('show-list');
            else { widgetContentArea.classList.remove('show-list'); updateWidgetCardsContinuous(); }
        }
        window.toggleWidgetViewMode = toggleWidgetViewMode;
        
        // 初始化时自动应用保存的视图模式
        toggleWidgetViewMode(widgetViewMode);

        function enterWidgetEditMode() {
            closeWidgetMenus(); isWidgetEditing = true;
            if (themeAppUI) themeAppUI.classList.add('is-widget-editing');
            toggleWidgetViewMode('list');
            document.getElementById('topBarTitle').innerText = '管理组件';
            const wgc1 = document.getElementById('widgetToolbarMenu'); if (wgc1) { wgc1.style.display = 'none'; wgc1.classList.remove('show'); }
            const doneBtn = document.getElementById('widgetDoneBtn'); if (doneBtn) doneBtn.style.display = 'block';
            const viewBtn = document.getElementById('widgetViewBtn'); if (viewBtn) viewBtn.style.display = 'none';
            const menuBtn = document.getElementById('themeMenuBtn'); if (menuBtn) menuBtn.style.display = 'none';
        }
        window.enterWidgetEditMode = enterWidgetEditMode;

        function exitWidgetEditMode(silent) {
            isWidgetEditing = false;
            if (themeAppUI) themeAppUI.classList.remove('is-widget-editing');
            if (!silent && currentActiveTab === 'widget') {
                document.getElementById('topBarTitle').innerText = 'Widgets';
                const wgc2 = document.getElementById('widgetToolbarMenu'); if (wgc2) { wgc2.style.display = 'flex'; wgc2.classList.remove('show'); }
                const doneBtn = document.getElementById('widgetDoneBtn'); if (doneBtn) doneBtn.style.display = 'none';
                const viewBtn = document.getElementById('widgetViewBtn'); if (viewBtn) viewBtn.style.display = 'flex';
                const menuBtn = document.getElementById('themeMenuBtn'); if (menuBtn) menuBtn.style.display = 'flex';
            }
        }
        window.exitWidgetEditMode = exitWidgetEditMode;

        function deleteWidget(index, event) {
            event.stopPropagation();
            if (confirm('确定要删除 "' + currentWidgets[index].name + '" 吗？')) {
                currentWidgets.splice(index, 1);
                if (activeWidgetIndex >= currentWidgets.length) activeWidgetIndex = currentWidgets.length - 1;
                renderWidgetViews();
                if (typeof window.saveCustomWidgetsData === 'function') window.saveCustomWidgetsData();
            }
        }
        window.deleteWidget = deleteWidget;


        // import widgets from a .json file (single object or array). Fields: name, preview, content.
        function handleWidgetJsonImport(event) {
            closeWidgetMenus();
            const file = event.target.files && event.target.files[0];
            if (!file) return;
            const reader = new FileReader();
            reader.onload = function (ev) {
                try {
                    let parsed = JSON.parse(ev.target.result);
                    if (!Array.isArray(parsed)) parsed = [parsed];
                    let added = 0;
                    parsed.forEach(function (w) {
                        if (!w || typeof w !== 'object') return;
                        customWidgets.push({
                            name: w.name || ('widget ' + (customWidgets.length + 1)),
                            preview: w.preview || 'linear-gradient(135deg,#a1c4fd 0%,#c2e9fb 100%)',
                            content: w.content || w.html || '',
                            width: w.width || '',
                            height: w.height || '',
                            presetSize: w.presetSize || ''
                        });
                        added++;
                    });
                    // switch to custom tab so the user sees imports immediately
                    if (typeof switchWidgetTab === 'function') switchWidgetTab(1);
                    else { currentWidgets = customWidgets; renderWidgetViews(); }
                    if (typeof window.saveCustomWidgetsData === 'function') window.saveCustomWidgetsData();
                    alert('imported ' + added + ' widget(s)');
                } catch (err) { alert('JSON parse failed: ' + err.message); }
            };
            reader.readAsText(file);
            event.target.value = '';
        }
        window.handleWidgetJsonImport = handleWidgetJsonImport;

        // export all widgets (official + custom) as a .json download
        function exportWidgetJson() {
            closeWidgetMenus();
            const all = officialWidgets.concat(customWidgets).map(function (w) {
                return { name: w.name || '', preview: w.preview || '', content: w.content || '', width: w.width || '', height: w.height || '', presetSize: w.presetSize || '' };
            });
            const blob = new Blob([JSON.stringify(all, null, 2)], { type: 'application/json' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url; a.download = 'widgets.json';
            document.body.appendChild(a); a.click(); document.body.removeChild(a);
            URL.revokeObjectURL(url);
        }
        window.exportWidgetJson = exportWidgetJson;

        function cancelWidgetCodePreview() {
            window.clearTimeout(widgetPreviewTimer);
            widgetPreviewTimer = 0;
        }

        function scheduleWidgetCodePreview() {
            cancelWidgetCodePreview();
            widgetPreviewTimer = window.setTimeout(() => {
                widgetPreviewTimer = 0;
                updateWidgetCodePreview();
            }, widgetPreviewDebounceMs);
        }
        window.scheduleWidgetCodePreview = scheduleWidgetCodePreview;

        function updateWidgetCodePreview() {
            const preview = document.getElementById('widgetCodePreview');
            const stage = document.getElementById('widgetCodePreviewStage');
            const frame = document.getElementById('widgetCodePreviewFrame');
            const sizeLabel = document.getElementById('widgetCodePreviewSize');
            const editor = document.getElementById('widgetEditContent');
            if (!preview || !stage || !frame || !sizeLabel || !editor) return;

            const checkedPreset = document.querySelector('input[name="widgetPresetSize"]:checked');
            let cols = 1;
            let rows = 1;
            if (checkedPreset) {
                const parts = checkedPreset.value.split('x').map(Number);
                cols = parts[0] || 1;
                rows = parts[1] || 1;
            } else if (document.getElementById('widgetCustomSizeLabel').innerText !== '自定义大小') {
                cols = parseInt(document.getElementById('customW').innerText, 10) || 1;
                rows = parseInt(document.getElementById('customH').innerText, 10) || 1;
            }

            const width = cols * 140;
            const height = rows * 140;
            preview.style.display = 'block';
            const availableWidth = stage.clientWidth || 280;
            const scale = Math.min(1, availableWidth / width);
            stage.style.height = Math.round(height * scale) + 'px';
            frame.style.width = width + 'px';
            frame.style.height = height + 'px';
            frame.style.transform = 'scale(' + scale + ')';
            frame.onload = function () {
                if (typeof window.syncGlobalFontToWidgetFrame === 'function') {
                    window.syncGlobalFontToWidgetFrame(frame);
                }
            };
            frame.srcdoc = window.buildWidgetFrameSrcdoc
                ? window.buildWidgetFrameSrcdoc(buildWidgetEditablePreview(editor.value))
                : buildWidgetEditablePreview(editor.value);
            sizeLabel.innerText = cols + ' × ' + rows;
        }
        window.updateWidgetCodePreview = updateWidgetCodePreview;

        function openWidgetEditor(index) {
            cancelWidgetCodePreview();
            activeWidgetIndex = index; const widget = currentWidgets[index];
            document.getElementById('widgetEditName').value = widget.name;
            document.getElementById('widgetEditContent').value = widget.content || '';
            if (widget.width && widget.height) {
                const cw = Math.round(widget.width / 140) || 1;
                const ch = Math.round(widget.height / 140) || 1;
                document.getElementById('customW').innerText = cw;
                document.getElementById('customH').innerText = ch;
                document.getElementById('widgetCustomSizeLabel').innerText = cw + ' × ' + ch;
                document.getElementById('widgetCustomSizeLabel').style.color = '#000';
            } else {
                document.getElementById('customW').innerText = '1';
                document.getElementById('customH').innerText = '1';
                document.getElementById('widgetCustomSizeLabel').innerText = '自定义大小';
                document.getElementById('widgetCustomSizeLabel').style.color = '#8e8e93';
            }
            const radios = document.querySelectorAll('input[name="widgetPresetSize"]');
            radios.forEach(r => { r.checked = (widget.presetSize && r.value === widget.presetSize); });
            document.getElementById('widgetEditorModal').classList.add('show');
            const overlay = document.getElementById('widgetOverlay');
            overlay.style.display = 'block'; overlay.style.zIndex = '250';
            requestAnimationFrame(updateWidgetCodePreview);
        }
        window.openWidgetEditor = openWidgetEditor;

        function closeWidgetEditor() {
            cancelWidgetCodePreview();
            const modal = document.getElementById('widgetEditorModal');
            const focusedElement = document.activeElement;
            if (focusedElement && modal.contains(focusedElement) && typeof focusedElement.blur === 'function') {
                focusedElement.blur();
            }
            modal.classList.remove('show');
            const overlay = document.getElementById('widgetOverlay');
            overlay.style.display = 'none'; overlay.style.zIndex = '105';
            const preview = document.getElementById('widgetCodePreview');
            const frame = document.getElementById('widgetCodePreviewFrame');
            if (preview) preview.style.display = 'none';
            if (frame) frame.srcdoc = '';
            activeWidgetIndex = -1;
            requestAnimationFrame(function () {
                if (typeof window.refreshAppViewport === 'function') {
                    window.refreshAppViewport();
                } else {
                    window.scrollTo(0, 0);
                    document.documentElement.scrollTop = 0;
                    document.body.scrollTop = 0;
                }
            });
        }

        window.buildWidgetDesktopContent = buildWidgetDesktopContent;
        window.replaceWidgetImageContent = replaceWidgetImageContent;
        window.replaceWidgetEditableContent = replaceWidgetEditableContent;
        window.prepareWidgetImageData = prepareWidgetImageData;
        window.isWidgetImageFilePayload = isWidgetImageFilePayload;
        if (typeof window.refreshDesktopWidgetFrames === 'function') {
            window.refreshDesktopWidgetFrames();
        }
        window.closeWidgetEditor = closeWidgetEditor;

        (function() {
            const topBar = document.querySelector('#widgetEditorModal .ios-top-bar');
            const modal = document.getElementById('widgetEditorModal');
            let startY = 0;
            let currentY = 0;
            if (topBar && modal) {
                topBar.addEventListener('touchstart', (e) => {
                    if (e.target.closest('.widget-editor-action')) {
                        startY = 0;
                        currentY = 0;
                        return;
                    }
                    startY = e.touches[0].clientY;
                    currentY = startY;
                    modal.style.transition = 'none';
                }, { passive: true });
                topBar.addEventListener('touchmove', (e) => {
                    if (!startY) return;
                    currentY = e.touches[0].clientY;
                    const delta = currentY - startY;
                    if (delta > 0) {
                        modal.style.transform = `translateY(${delta}px)`;
                    }
                }, { passive: true });
                topBar.addEventListener('touchend', () => {
                    if (!startY) return;
                    const delta = currentY - startY;
                    startY = 0;
                    currentY = 0;
                    modal.style.transition = '';
                    modal.style.transform = '';
                    if (delta > 80) {
                        closeWidgetEditor();
                    }
                });
            }
        })();

        function saveWidgetEditor() {
            if (activeWidgetIndex > -1) {
                const widget = currentWidgets[activeWidgetIndex];
                widget.name = document.getElementById('widgetEditName').value.trim() || '未命名组件';
                widget.content = document.getElementById('widgetEditContent').value;
                const lbl = document.getElementById('widgetCustomSizeLabel').innerText;
                const widthVal = lbl !== '自定义大小' ? parseInt(document.getElementById('customW').innerText, 10) * 140 : null;
                const heightVal = lbl !== '自定义大小' ? parseInt(document.getElementById('customH').innerText, 10) * 140 : null;
                const checkedPreset = document.querySelector('input[name="widgetPresetSize"]:checked');
                if (widthVal && heightVal) {
                    widget.width = widthVal;
                    widget.height = heightVal;
                    widget.presetSize = '';
                } else if (checkedPreset) {
                    widget.width = '';
                    widget.height = '';
                    widget.presetSize = checkedPreset.value;
                } else {
                    widget.width = '';
                    widget.height = '';
                    widget.presetSize = '';
                }
                renderWidgetViews();
                if (typeof window.saveCustomWidgetsData === 'function') window.saveCustomWidgetsData();
            }
            closeWidgetEditor();
        }
        window.saveWidgetEditor = saveWidgetEditor;

        function switchWidgetTab(index, progressIndex) {
            if (isWidgetEditing) return;
            widgetSegmentBtns.forEach((btn, i) => btn.classList.toggle('active', i === index));
            if (widgetIndicator) widgetIndicator.style.transform = 'translateX(' + (index * 100) + '%)';
            currentWidgets = index === 0 ? officialWidgets : customWidgets;
            const nextProgress = Number.isInteger(progressIndex) ? progressIndex : 0;
            currentProgress = nextProgress; targetProgress = nextProgress;
            renderWidgetViews();
        }
        window.switchWidgetTab = switchWidgetTab;

        function handleAddWidget() {
            closeWidgetMenus();
            customWidgets.push({
                name: '自定义组件 ' + (customWidgets.length + 1),
                content: '',
                width: '',
                height: '',
                presetSize: ''
            });
            const newWidgetIndex = customWidgets.length - 1;
            switchWidgetTab(1, newWidgetIndex);
            if (typeof window.saveCustomWidgetsData === 'function') window.saveCustomWidgetsData();
            openWidgetEditor(newWidgetIndex);
        }
        window.handleAddWidget = handleAddWidget;

        function bindWidgetTouchAction(selector, action) {
            const element = document.querySelector(selector);
            if (!element) return;

            let trackingTouch = false;
            let touchMoved = false;
            let startX = 0;
            let startY = 0;
            let lastTouchActivation = 0;

            element.addEventListener('touchstart', function (event) {
                if (event.touches.length !== 1) {
                    trackingTouch = false;
                    return;
                }
                const touch = event.touches[0];
                trackingTouch = true;
                touchMoved = false;
                startX = touch.clientX;
                startY = touch.clientY;
            }, { passive: true });

            element.addEventListener('touchmove', function (event) {
                if (!trackingTouch || event.touches.length !== 1) return;
                const touch = event.touches[0];
                if (Math.abs(touch.clientX - startX) > 12 || Math.abs(touch.clientY - startY) > 12) {
                    touchMoved = true;
                }
            }, { passive: true });

            element.addEventListener('touchcancel', function () {
                trackingTouch = false;
                touchMoved = false;
            }, { passive: true });

            element.addEventListener('touchend', function (event) {
                const shouldActivate = trackingTouch && !touchMoved;
                trackingTouch = false;
                touchMoved = false;
                if (!shouldActivate) return;

                if (event.cancelable) event.preventDefault();
                event.stopPropagation();
                lastTouchActivation = Date.now();
                action();
            }, { passive: false });

            element.addEventListener('click', function (event) {
                if (Date.now() - lastTouchActivation < 700) {
                    event.preventDefault();
                    event.stopImmediatePropagation();
                }
            }, true);
        }

        bindWidgetTouchAction('.widget-add-action', handleAddWidget);
        bindWidgetTouchAction('.widget-editor-action:not(.widget-editor-save)', closeWidgetEditor);
        bindWidgetTouchAction('.widget-editor-save', saveWidgetEditor);
        
        let lastRenderedWidgetsType = null;
        let lastRenderedWidgetsLength = -1;
        let renderQueue = [];
        let isRenderingQueue = false;

        function renderWidgetViews(force = true) {
            const currentType = currentWidgets === officialWidgets ? 'official' : 'custom';
            
            // 如果非强制刷新，且数据没变，直接复用 DOM，避免卡顿
            if (!force && lastRenderedWidgetsType === currentType && lastRenderedWidgetsLength === currentWidgets.length) {
                updateWidgetCardsContinuous();
                return;
            }
            
            lastRenderedWidgetsType = currentType;
            lastRenderedWidgetsLength = currentWidgets.length;
            renderQueue = []; // 清空之前的渲染队列
            
            widgetTrack.innerHTML = ''; widgetPagination.innerHTML = ''; widgetListContainer.innerHTML = '';
            if (currentWidgets.length === 0) {
                widgetEmptyState.style.display = 'block';
                widgetContentArea.style.display = 'none';
                return;
            }
            widgetEmptyState.style.display = 'none';
            widgetContentArea.style.display = 'flex';

            // 将所有组件推入渲染队列
            currentWidgets.forEach((widget, i) => {
                renderQueue.push({ widget, i });
            });

            // 启动分帧渲染
            if (!isRenderingQueue) {
                isRenderingQueue = true;
                processRenderQueue();
            }
        }

        function processRenderQueue() {
            if (renderQueue.length === 0) {
                isRenderingQueue = false;
                updateWidgetCardsContinuous();
                return;
            }

            // 每一帧只渲染 1 个组件，避免阻塞主线程
            const { widget, i } = renderQueue.shift();

            const widgetContent = typeof window.normalizeStoredWidgetContent === 'function'
                ? window.normalizeStoredWidgetContent(widget.content)
                : (widget.content || '');
                
            const card = document.createElement('div'); card.className = 'widget-card';
            card.innerHTML = '<div class="widget-card-more-btn" onclick="openWidgetContextMenu(' + i + ', event)"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#000" stroke-width="2.5" stroke-linecap="round"><circle cx="12" cy="12" r="1"></circle><circle cx="19" cy="12" r="1"></circle><circle cx="5" cy="12" r="1"></circle></svg></div><div class="widget-card-preview">' + makeWidgetFrameHTML(widgetContent) + '</div><div class="widget-card-name">' + widget.name + '</div><div class="widget-card-size">' + formatWidgetSizeLabel(widget) + '</div>';
            widgetTrack.appendChild(card);

            const dot = document.createElement('div'); dot.className = 'widget-dot'; widgetPagination.appendChild(dot);

            const listItem = document.createElement('div'); listItem.className = 'widget-list-item';
            listItem.onclick = function () {
                if (isWidgetEditing) openWidgetEditor(i);
                else { targetProgress = i; currentProgress = i; toggleWidgetViewMode('carousel'); }
            };
            listItem.innerHTML = '<div class="widget-delete-btn-left" onclick="deleteWidget(' + i + ', event)"><svg viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm5 11H7v-2h10v2z"/></svg></div><div class="widget-list-item-icon"></div><div class="widget-list-item-info"><div class="widget-title-wrapper"><div class="widget-list-item-title">' + widget.name + '</div><svg class="widget-edit-pencil" viewBox="0 0 24 24" fill="none" stroke-width="2" stroke-linecap="round"><path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z"></path></svg></div><div class="widget-list-item-sub">Widget</div></div><div class="widget-list-action-trigger" onclick="openWidgetContextMenu(' + i + ', event)"><svg width="20" height="20" viewBox="0 0 24 24" fill="#c7c7cc" stroke="none"><circle cx="12" cy="5" r="2"></circle><circle cx="12" cy="12" r="2"></circle><circle cx="12" cy="19" r="2"></circle></svg></div>';
            const listPreviewHost = listItem.querySelector('.widget-list-item-icon');
            const listPreviewFrame = document.createElement('iframe');
            const listPreviewDims = getWidgetDimensions(widget);
            const listPreviewScale = Math.min(48 / listPreviewDims.width, 48 / listPreviewDims.height);
            listPreviewFrame.className = 'widget-list-preview-frame';
            listPreviewFrame.setAttribute('sandbox', 'allow-scripts');
            listPreviewFrame.setAttribute('title', (widget.name || '组件') + '预览');
            listPreviewFrame.setAttribute('loading', 'lazy'); // 增加懒加载
            listPreviewFrame.style.width = listPreviewDims.width + 'px';
            listPreviewFrame.style.height = listPreviewDims.height + 'px';
            listPreviewFrame.style.left = (48 - listPreviewDims.width * listPreviewScale) / 2 + 'px';
            listPreviewFrame.style.top = (48 - listPreviewDims.height * listPreviewScale) / 2 + 'px';
            listPreviewFrame.style.transform = 'scale(' + listPreviewScale + ')';
            listPreviewFrame.addEventListener('load', function () {
                if (typeof window.syncGlobalFontToWidgetFrame === 'function') {
                    window.syncGlobalFontToWidgetFrame(listPreviewFrame);
                }
            });
            listPreviewFrame.srcdoc = window.buildWidgetFrameSrcdoc
                ? window.buildWidgetFrameSrcdoc(widgetContent)
                : widgetContent;
            listPreviewHost.appendChild(listPreviewFrame);
            widgetListContainer.appendChild(listItem);

            updateWidgetCardsContinuous();
            
            // 安排下一帧渲染下一个组件
            requestAnimationFrame(processRenderQueue);
        }


        function updateWidgetCardsContinuous() {
            if (currentWidgets.length === 0 || widgetViewMode === 'list') return;
            const cards = document.querySelectorAll('#widgetAppGrid .widget-card');
            const dots = document.querySelectorAll('#widgetPagination .widget-dot');
            cards.forEach((card, i) => {
                const rel = i - currentProgress; const absRel = Math.abs(rel);
                const translateX = rel * 110; const rotateY = -rel * 45; const translateZ = -absRel * 100;
                const scale = Math.max(0.8, 1 - absRel * 0.1); const opacity = Math.max(0, 1 - absRel * 0.6);
                card.style.transform = 'translateX(' + translateX + '%) translateZ(' + translateZ + 'px) rotateY(' + rotateY + 'deg) scale(' + scale + ')';
                card.style.opacity = opacity; card.style.zIndex = 100 - Math.round(absRel * 100);
            });
            dots.forEach((dot, i) => {
                dot.style.opacity = Math.max(0.3, 1 - Math.abs(i - currentProgress));
                dot.classList.toggle('active', Math.round(currentProgress) === i);
            });
        }

            // show three-dots button; click to expand vertical capsule menu
        const wCarouselArea = document.getElementById('widgetCarousel');
        if (wCarouselArea) {
            wCarouselArea.addEventListener('touchstart', function (e) {
                if (currentWidgets.length <= 1 || widgetViewMode === 'list') return;
                isDragging = true; startX = e.touches[0].clientX; startProgress = currentProgress;
            }, { passive: true });
            wCarouselArea.addEventListener('touchmove', function (e) {
                if (!isDragging || widgetViewMode === 'list') return;
                e.preventDefault();
                let newProgress = startProgress - ((e.touches[0].clientX - startX) / window.innerWidth) * 1.8;
                if (newProgress < 0) newProgress *= 0.3;
                else if (newProgress > currentWidgets.length - 1) newProgress = (currentWidgets.length - 1) + (newProgress - (currentWidgets.length - 1)) * 0.3;
                currentProgress = newProgress; updateWidgetCardsContinuous();
            }, { passive: false });
            wCarouselArea.addEventListener('touchend', function () {
                if (!isDragging || widgetViewMode === 'list') return;
                isDragging = false; targetProgress = Math.round(currentProgress);
                if (targetProgress < 0) targetProgress = 0;
                if (targetProgress > currentWidgets.length - 1) targetProgress = currentWidgets.length - 1;
                scheduleWidgetAnimation();
            });
        }

            // show three-dots button; click to expand vertical capsule menu
        let widgetAnimationFrame = 0;

        function scheduleWidgetAnimation() {
            if (widgetAnimationFrame || isDragging || widgetViewMode !== 'carousel' || currentWidgets.length === 0) return;
            if (Math.abs(targetProgress - currentProgress) < 0.001) return;
            widgetAnimationFrame = requestAnimationFrame(animateWidget);
        }

        function animateWidget() {
            widgetAnimationFrame = 0;
            if (isDragging || widgetViewMode !== 'carousel' || currentWidgets.length === 0) return;

            currentProgress += (targetProgress - currentProgress) * 0.15;
            if (Math.abs(targetProgress - currentProgress) < 0.001) currentProgress = targetProgress;
            updateWidgetCardsContinuous();
            scheduleWidgetAnimation();
        }
    })();
}
            // show three-dots button; click to expand vertical capsule menu
