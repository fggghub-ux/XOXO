(function () {
    'use strict';

    const DB_NAME = 'iOSDesktopDB';
    const STORE_NAME = 'layoutStore';
    const PREFERENCES_KEY = 'memoryAppPreferencesV1';
    const MEMORY_ITEMS_KEY = 'memoryItemsV1';
    const MEMORY_OUTBOX_KEY = 'memoryOutboxV1';
    const MEMORY_SUMMARIES_KEY = 'memorySummariesV1';
    const CONTACTS_KEY = 'wechatContactsData';
    const CHATS_KEY = 'wechatChatData';
    const API_DATA_KEY = 'apiData';
    const DEFAULT_SUMMARY_INTERVAL = 200;
    const MIN_SUMMARY_INTERVAL = 1;
    const MAX_SUMMARY_INTERVAL = 500;
    const SUMMARY_PREFERENCES_VERSION = 4;
    const SUMMARY_PROMPT_MODE_BUILTIN = 'builtin';
    const SUMMARY_PROMPT_MODE_CUSTOM = 'custom';
    const MAX_SUMMARY_LENGTH = 12000;
    const MAX_SUMMARY_PROMPT_LENGTH = 12000;
    const MAX_SUMMARY_PROMPT_INJECTION_LENGTH = 6000;
    const MAX_SUMMARY_SOURCE_MESSAGES = 1000;
    const MEMORY_SCHEMA_VERSION = 3;
    const OUTBOX_MAX_ATTEMPTS = 8;
    const OUTBOX_MAX_RETRY_DELAY_MS = 60 * 60 * 1000;
    const RETRIEVAL_COOLDOWN_MS = 8 * 60 * 1000;
    const RETRIEVAL_PRIORITY = Object.freeze({ low: -3, normal: 0, pinned: 6 });
    const VECTOR_INDEX_VERSION = 'local-ngram-v1';
    const VECTOR_DIMENSIONS = 256;
    const VECTOR_MIN_SIMILARITY = 0.12;
    const SEMANTIC_RETRIEVAL_TIMEOUT_MS = 180;
    const SEMANTIC_MIN_SIMILARITY = 0.28;
    const SUMMARY_DISCLOSURE_CSS = `
        .memory-summary-fold > summary { display:flex; align-items:center; gap:8px; cursor:pointer; list-style:none; }
        .memory-summary-fold > summary::-webkit-details-marker { display:none; }
        .memory-summary-fold:not([open]) > summary { margin-bottom:0; }
        .memory-summary-fold-chevron { display:flex; flex:0 0 auto; margin-left:auto; color:#8e8e93; }
        .memory-summary-fold[open] > summary .memory-summary-fold-chevron { transform:rotate(90deg); }
    `;
    const MEMORY_BASE_STABILITY_DAYS = 14;
    const MEMORY_RETENTION_SCORE_MAX = 3;
    const REFERENCE_DOCUMENT_SOURCE = String.raw`<!DOCTYPE html>
<html lang="zh-CN">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no, viewport-fit=cover">
    <title>记忆库 UI - 漫画气泡版</title>
    <style>
        :root {
            --bg-gradient-top: #e8e8e8;
            --bg-gradient-mid: #f5f5f5;
            --bg-gradient-bottom: #ffffff;
            --text-main: #1a1a1a;
            --text-sub: #888888;
            --card-bg: #f2f2f2;
            --highlight-color: rgba(0, 0, 0, 0.08);
        }
        body {
            margin: 0; padding: 0;
            background: linear-gradient(180deg, var(--bg-gradient-top) 0%, var(--bg-gradient-mid) 35%, var(--bg-gradient-bottom) 100%);
            background-attachment: fixed;
            font-family: -apple-system, BlinkMacSystemFont, "SF Pro Text", "Helvetica Neue", sans-serif;
            color: var(--text-main);
            -webkit-font-smoothing: antialiased;
            min-height: 100vh;
            overflow-x: hidden;
        }
        .container {
            width: 100%; max-width: 414px; margin: 0 auto; min-height: 100vh;
            position: relative; padding-bottom: 100px; box-sizing: border-box; overflow-x: hidden;
        }
        .top-nav {
            position: absolute; top: 44px; left: 0; width: 100%;
            padding: 0 20px; box-sizing: border-box;
            display: flex; justify-content: space-between; align-items: center; z-index: 10;
        }
        .nav-title {
            position: absolute; left: 50%; transform: translateX(-50%);
            font-size: 16px; font-weight: 700; letter-spacing: 0.5px; color: var(--text-main);
        }
        .icon-btn {
            background: none; border: none; padding: 8px; margin: -8px;
            cursor: pointer; color: var(--text-main);
            display: flex; align-items: center; justify-content: center;
            transition: opacity 0.2s; z-index: 2;
        }
        .icon-btn:active { opacity: 0.6; }
        .chat-header {
            padding: 114px 20px 20px; display: flex; flex-direction: column; align-items: center;
        }
        .avatars-wrapper { display: flex; justify-content: center; gap: 40px; }
        .avatar-group { display: flex; flex-direction: column; align-items: center; position: relative; cursor: pointer; }
        .bubble {
            background: #ffffff; color: #000000; padding: 10px 16px;
            border-radius: 14px; font-size: 15px; font-weight: 700;
            box-shadow: 0 4px 16px rgba(0,0,0,0.06); margin-bottom: 12px;
            position: relative; white-space: nowrap; outline: none;
        }
        .bubble::after {
            content: ''; position: absolute; bottom: -5px; left: 50%; transform: translateX(-50%);
            border-width: 6px 6px 0; border-style: solid; border-color: #ffffff transparent transparent transparent;
        }
        .avatar {
            width: 84px; height: 84px; border-radius: 50%; border: 3px solid #d4d4d4;
            background-color: #ffffff; box-shadow: inset 0 0 0 2px #ffffff;
            z-index: 1; display: flex; justify-content: center; align-items: center; overflow: hidden;
            background-size: cover; background-position: center;
        }
        .avatar-char-inner { width: 100%; height: 100%; background-color: #4a4a4a; }
        .avatar-user-inner { width: 100%; height: 100%; background-color: #f0f0f0; }
        .avatar-name { margin-top: 12px; font-size: 15px; font-weight: 700; color: var(--text-main); letter-spacing: 1px; }
        .companion-text { margin-top: 24px; font-size: 13px; color: var(--text-sub); text-align: center; font-weight: 600; }
        .highlight-number { position: relative; color: var(--text-main); font-weight: 700; display: inline-block; padding: 0 2px; z-index: 1; }
        .highlight-number::after {
            content: ''; position: absolute; bottom: 2px; left: -2px; right: -2px;
            height: 10px; background-color: var(--highlight-color); border-radius: 2px; z-index: -1;
        }
        .profile-info { padding: 10px 24px 16px; text-align: left; }
        .name-row { display: flex; align-items: center; justify-content: flex-start; margin-bottom: 8px; }
        .name { font-size: 20px; font-weight: 800; letter-spacing: 1px; color: #000; }
        .divider { width: 2px; height: 14px; background-color: #d0d0d0; margin: 0 10px; }
        .tag { font-size: 13px; color: var(--text-sub); font-weight: 600; }
        .desc { font-size: 13px; color: var(--text-sub); line-height: 1.6; font-weight: 600; }
        .tabs { display: flex; justify-content: flex-start; gap: 32px; padding: 10px 24px 16px; }
        .tab-item { font-size: 15px; color: var(--text-sub); font-weight: 600; cursor: pointer; position: relative; transition: color 0.2s; z-index: 1; }
        .tab-item.active { color: #000; }
        .tab-item.active::after {
            content: ''; position: absolute; bottom: 2px; left: -4px; right: -4px;
            height: 10px; background-color: var(--highlight-color); border-radius: 2px; z-index: -1;
        }
        .search-container { padding: 0 24px 16px; }
        .search-bar { display: flex; align-items: center; background-color: rgba(0, 0, 0, 0.04); border-radius: 8px; padding: 8px 12px; }
        .search-bar svg { width: 16px; height: 16px; stroke: var(--text-sub); fill: none; margin-right: 8px; flex-shrink: 0; }
        .search-bar input { flex: 1; border: none; background: transparent; outline: none; font-size: 14px; color: var(--text-main); font-family: inherit; }
        .search-bar input::placeholder { color: #a0a0a0; }
        .memory-list { min-width: 0; padding: 0 24px; display: flex; flex-direction: column; gap: 8px; overflow-x: hidden; }
        .memory-card {
            min-width: 0; max-width: 100%; box-sizing: border-box;
            background-color: var(--card-bg); border-radius: 4px; padding: 16px 20px;
            display: flex; flex-direction: column; gap: 8px; border: 1px solid rgba(0,0,0,0.03); transition: transform 0.2s;
        }
        .memory-card:active { transform: scale(0.98); }
        .card-header { display: flex; min-width: 0; justify-content: space-between; align-items: center; gap: 8px; }
        .card-badge { min-width: 0; font-size: 11px; color: var(--text-sub); font-weight: 600; letter-spacing: 0.5px; overflow-wrap: anywhere; word-break: break-word; }
        .card-actions { display: flex; flex: 0 0 auto; gap: 12px; color: #b0b0b0; align-items: center; }
        .card-content { min-width: 0; max-width: 100%; font-size: 15px; color: var(--text-main); line-height: 1.6; font-weight: 600; white-space: pre-wrap; overflow-wrap: anywhere; word-break: break-word; }
        .fab-container { position: fixed; bottom: 40px; right: 20px; display: flex; flex-direction: column; gap: 16px; z-index: 90; }
        .fab {
            width: 48px; height: 48px; border-radius: 50%; display: flex; justify-content: center; align-items: center;
            box-shadow: 0 4px 14px rgba(0,0,0,0.15); cursor: pointer; transition: transform 0.2s; border: none;
        }
        .fab:active { transform: scale(0.92); }
        .fab-summary { background-color: #ffffff; color: #333333; }
        .fab-summary svg { width: 22px; height: 22px; fill: none; stroke: currentColor; stroke-width: 2; stroke-linecap: round; stroke-linejoin: round; }
        .fab-add { background-color: #333333; color: #ffffff; }
        .fab-add svg { width: 24px; height: 24px; fill: none; stroke: currentColor; stroke-width: 2; stroke-linecap: round; stroke-linejoin: round; }
        
        /* 弹窗样式 */
        .switcher-overlay {
            position: absolute; inset: 0; z-index: 200;
            background: rgba(0,0,0,0.3); backdrop-filter: blur(10px); -webkit-backdrop-filter: blur(10px);
            display: flex; flex-direction: column; justify-content: center; align-items: center;
            opacity: 0; pointer-events: none; transition: opacity 0.3s ease;
        }
        .switcher-overlay.is-visible { opacity: 1; pointer-events: auto; }
        .modal-list-container { width: 310px; display: flex; flex-direction: column; gap: 12px; margin-bottom: 24px; }
        .modal-card {
            height: 84px; background: #FFFFFF; border-radius: 20px; box-shadow: 0 8px 24px rgba(0,0,0,0.12);
            display: flex; align-items: center; padding: 0 16px; cursor: pointer; transition: transform 0.2s ease;
            border: none; /* 确保无描边 */
        }
        .modal-card:active { transform: scale(0.98); }
        .modal-card-avatar { width: 52px; height: 52px; border-radius: 14px; background: #D1D1D6; flex-shrink: 0; }
        .modal-card-info { flex: 1; margin-left: 14px; display: flex; flex-direction: column; justify-content: center; gap: 4px; }
        .modal-card-title { font-size: 17px; font-weight: 600; color: #000; margin: 0; }
        .modal-card-subtitle { font-size: 14px; color: #888; margin: 0; }
        .modal-cancel-btn {
            display: inline-flex; align-items: center; justify-content: center; padding: 10px 32px;
            background: #FFFFFF; border: none; border-radius: 20px; box-shadow: 0 4px 12px rgba(0,0,0,0.1);
            font-size: 15px; font-weight: 600; color: #000; cursor: pointer; transition: all 0.2s ease;
        }
        .modal-cancel-btn:active { transform: scale(0.95); }

        .memory-trace-overlay {
            padding: 18px;
            background: rgba(28, 28, 30, 0.2);
            -webkit-tap-highlight-color: transparent;
        }
        .memory-trace-sheet {
            width: min(344px, calc(100% - 20px)) !important;
            height: auto !important;
            max-height: 68vh !important;
            max-height: 68dvh !important;
            padding: 0 !important;
            display: flex !important;
            flex-direction: column;
            overflow: hidden !important;
            border: 1px solid rgba(60, 60, 67, 0.08) !important;
            border-radius: 12px !important;
            background: rgba(250, 250, 250, 0.98) !important;
            box-shadow: 0 18px 48px rgba(0, 0, 0, 0.16) !important;
            cursor: default !important;
            transform: none !important;
            transition: none !important;
            -webkit-tap-highlight-color: transparent;
            touch-action: manipulation;
        }
        .memory-trace-sheet:active { transform: none !important; }
        .memory-trace-sheet button,
        .memory-trace-sheet select {
            -webkit-tap-highlight-color: transparent;
        }
        .memory-trace-header {
            position: relative !important;
            flex: 0 0 auto;
            display: flex !important;
            align-items: center !important;
            justify-content: center !important;
            min-height: 48px !important;
            padding: 12px 40px !important;
            box-sizing: border-box !important;
            border-bottom: 1px solid rgba(60, 60, 67, 0.08);
            background: rgba(250, 250, 250, 0.94);
            -webkit-backdrop-filter: blur(18px) saturate(120%);
            backdrop-filter: blur(18px) saturate(120%);
        }
        .memory-trace-back {
            position: absolute !important;
            top: 50% !important;
            left: 14px !important;
            transform: translateY(-50%) !important;
            display: flex !important;
            align-items: center !important;
            justify-content: center !important;
            width: 28px !important;
            height: 28px !important;
            color: #1c1c1e !important;
            cursor: pointer !important;
            outline: none !important;
            border: none !important;
            background: transparent !important;
            padding: 0 !important;
            z-index: 10 !important;
            -webkit-tap-highlight-color: transparent !important;
        }
        .memory-trace-title {
            margin: 0 !important;
            color: #1c1c1e !important;
            font-size: 16px !important;
            font-weight: 650 !important;
            letter-spacing: -0.2px !important;
            text-align: center !important;
        }
        .memory-trace-scroll {
            min-height: 0;
            overflow-y: auto;
            overflow-x: hidden;
            padding: 0 16px 18px;
            box-sizing: border-box;
            overscroll-behavior: contain;
            -webkit-overflow-scrolling: touch;
            touch-action: pan-y;
            scrollbar-width: none;
        }
        .memory-trace-scroll::-webkit-scrollbar { display: none; }
    </style>
</head>
<body>
    <div class="container">
        <div class="top-nav">
            <button class="icon-btn btn-circle" title="返回">
                <svg width="24" height="24" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" fill="none">
                    <line x1="19" y1="12" x2="5" y2="12"></line>
                    <polyline points="12 19 5 12 12 5"></polyline>
                </svg>
            </button>
            <div class="nav-title">Memory Archive</div>
            <button class="icon-btn btn-capsule" title="记忆设置">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M21.5092 14.5901L20.2592 13.2701C20.4192 12.3081 20.3989 11.3247 20.1992 10.3701L21.4191 9.05011C21.5138 8.9446 21.5771 8.81468 21.6019 8.67508C21.6266 8.53547 21.6118 8.39173 21.5591 8.2601C21.0532 7.00967 20.3056 5.87128 19.3591 4.9101C19.2666 4.81762 19.1513 4.75133 19.0248 4.71796C18.8983 4.68458 18.7652 4.6853 18.6391 4.72009L16.7991 5.19009C16.2326 4.78274 15.6179 4.44687 14.9691 4.19009L14.5191 2.47009C14.4857 2.33059 14.4119 2.20405 14.307 2.10623C14.2021 2.00842 14.0706 1.94367 13.9291 1.92011C13.306 1.80317 12.6731 1.74623 12.0391 1.75009C11.2458 1.75342 10.4562 1.85759 9.68915 2.06009C9.56114 2.09227 9.44422 2.15856 9.35089 2.25189C9.25756 2.34522 9.19129 2.46212 9.15912 2.59012L8.67914 4.36011C8.14253 4.59838 7.63294 4.8934 7.15912 5.24011L5.33911 4.7901C5.21132 4.7567 5.07686 4.75858 4.95007 4.79556C4.82328 4.83255 4.70893 4.90323 4.61914 5.00009C3.62491 6.03296 2.86435 7.26755 2.3891 8.62012C2.34301 8.75085 2.33361 8.89168 2.36181 9.02741C2.39002 9.16313 2.45477 9.28856 2.54913 9.39011L3.80914 10.7001C3.74605 11.1206 3.7126 11.5449 3.7091 11.9701C3.7091 12.2701 3.70915 12.5701 3.75915 12.8701L2.44915 14.3301C2.361 14.4272 2.2998 14.5457 2.27173 14.6738C2.24365 14.8019 2.24965 14.935 2.28912 15.0601C2.70006 16.3823 3.38111 17.6048 4.28912 18.6501C4.38044 18.7575 4.50016 18.8369 4.63458 18.8794C4.769 18.9218 4.9127 18.9256 5.04913 18.8901L6.7691 18.4501C7.37095 18.9572 8.04503 19.3718 8.7691 19.6801L9.2691 21.4701C9.30762 21.5999 9.37971 21.7172 9.47802 21.8102C9.57634 21.9033 9.69741 21.9688 9.8291 22.0001C10.5511 22.1632 11.2889 22.2471 12.0291 22.2501C12.6195 22.2435 13.2084 22.1867 13.7891 22.0801C13.9272 22.0557 14.0556 21.9932 14.1599 21.8995C14.2642 21.8058 14.3402 21.6848 14.3791 21.5501L14.8491 19.8601C15.7125 19.5512 16.5173 19.0981 17.2291 18.5201L18.9891 18.9201C19.1211 18.9508 19.259 18.9446 19.3877 18.9023C19.5164 18.86 19.6311 18.7831 19.7191 18.6801C20.5957 17.7067 21.2749 16.5724 21.7191 15.3401C21.755 15.2078 21.7545 15.0682 21.7175 14.9362C21.6806 14.8041 21.6086 14.6846 21.5092 14.5901ZM12.1191 15.8601C11.3647 15.8621 10.6267 15.6401 9.99865 15.2222C9.37057 14.8043 8.88067 14.2094 8.59106 13.5128C8.30145 12.8162 8.22519 12.0493 8.37188 11.3093C8.51858 10.5693 8.8816 9.88949 9.41504 9.35605C9.94848 8.82261 10.6283 8.45953 11.3683 8.31284C12.1083 8.16615 12.8752 8.24244 13.5718 8.53204C14.2684 8.82165 14.8633 9.31156 15.2812 9.93964C15.6991 10.5677 15.9211 11.3057 15.9191 12.0601C15.9165 13.0671 15.5153 14.0321 14.8032 14.7442C14.0912 15.4563 13.1261 15.8575 12.1191 15.8601Z" fill="currentColor"/>
                </svg>
            </button>
        </div>
        <div class="chat-header">
            <div class="avatars-wrapper">
                <div class="avatar-group avatar-switch-badge" title="切换角色">
                    <div class="bubble" id="charBubble" contenteditable="true" spellcheck="false">ㅎωㅎ</div>
                    <div class="avatar" id="charAvatar"><div class="avatar-char-inner"></div></div>
                    <div class="avatar-name" id="charAvatarName">Tsuki</div>
                </div>
                <div class="avatar-group user-switch-badge" title="切换用户">
                    <div class="bubble" id="userBubble" contenteditable="true" spellcheck="false">★(>ω<)!!♪</div>
                    <div class="avatar"><div class="avatar-user-inner"></div></div>
                    <div class="avatar-name">我</div>
                </div>
            </div>
            <div class="companion-text">
                Ta就在你身边，一起陪伴了 <span class="highlight-number" id="companionDays">0</span> 天
            </div>
        </div>
        <div class="profile-info">
            <div class="name-row">
                <div class="name"><span id="mainProfileName">Tsuki</span> ⋆</div>
                <div class="divider"></div>
                <div class="tag">共同记忆档案、</div>
            </div>
            <div class="desc" id="memoryStatsDesc">记忆总数：0 条，共同对话：0 层。</div>
        </div>
        <div class="tabs">
            <div class="tab-item segment-btn active">记忆</div>
            <div class="tab-item segment-btn">经历</div>
                <div class="tab-item segment-btn">档案</div>
        </div>
        <div class="search-container">
            <div class="search-bar search-box">
                <svg viewBox="0 0 24 24" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <circle cx="11" cy="11" r="8"></circle>
                    <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                </svg>
                <input type="search" placeholder="搜索记忆...">
            </div>
        </div>
        <div class="memory-list"></div>
        <div class="fab-container">
            <button class="fab fab-summary icon-action-btn" title="生成摘要">
                <svg viewBox="0 0 24 24">
                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                    <polyline points="14 2 14 8 20 8"></polyline>
                    <line x1="16" y1="13" x2="8" y2="13"></line>
                    <line x1="16" y1="17" x2="8" y2="17"></line>
                    <polyline points="10 9 9 9 8 9"></polyline>
                </svg>
            </button>
            <button class="fab fab-add icon-action-btn" title="新增记忆">
                <svg viewBox="0 0 24 24">
                    <line x1="12" y1="5" x2="12" y2="19"></line>
                    <line x1="5" y1="12" x2="19" y2="12"></line>
                </svg>
            </button>
        </div>
    </div>

    <!-- 角色切换弹窗 -->
    <div class="switcher-overlay" id="switcherOverlay" onclick="this.classList.remove('is-visible')">
        <div class="modal-list-container" onclick="event.stopPropagation()"></div>
        <button class="modal-cancel-btn" onclick="document.getElementById('switcherOverlay').classList.remove('is-visible')">取消</button>
    </div>

    <!-- 用户切换弹窗 -->
    <div class="switcher-overlay" id="userSwitcherOverlay" onclick="this.classList.remove('is-visible')">
        <div class="modal-list-container" onclick="event.stopPropagation()">
            <div class="modal-card">
                <div class="modal-card-avatar" style="background-color:#f0f0f0"></div>
                <div class="modal-card-info">
                    <h3 class="modal-card-title">我</h3>
                    <p class="modal-card-subtitle">当前用户</p>
                </div>
            </div>
        </div>
        <button class="modal-cancel-btn" onclick="document.getElementById('userSwitcherOverlay').classList.remove('is-visible')">取消</button>
    </div>
</body>
</html>
`;

    let root = null;
    let selectedContactId = '';
    const pendingSummaryUpdates = new Set();
    let activeTab = 'memory';
    let editingMemoryId = '';
    let cachedContacts = [];
    let cachedConversations = {};
    let cachedMemoryItems = [];
    let cachedOutbox = [];
    let cachedSummaries = [];
    let memoryStateLoaded = false;
    let memoryPublicationEpoch = 0;
    const memoryArrayVersions = new WeakMap();
    const legacyMemoryStorageReady = new Set();
    const protectedMemoryKeys = new Set([MEMORY_ITEMS_KEY, MEMORY_SUMMARIES_KEY, MEMORY_OUTBOX_KEY, 'memoryEventNodesV1']);

    function memoryRecordVersion(record) {
        return JSON.stringify([record?.storageVersion || '', record?.items || []]);
    }

    function trackMemoryArray(items, record) {
        memoryArrayVersions.set(items, memoryRecordVersion(record));
        return items;
    }

    function memoryArrayVersion(items) {
        return memoryArrayVersions.get(items) || memoryRecordVersion({ items });
    }

    function summaryBindingVersion(items, bindingId) {
        return JSON.stringify((items || []).filter(item => item?.bindingId === bindingId).map(item => [
            item.id, Number(item.revision) || 1, item.status || 'active', item.slot === 'chapter' ? 'chapter' : 'working',
            item.archiveReason || '', item.sections, item.archiveAnalysis || null, item.sourceMessageIds || []
        ]));
    }

    // The read, comparison and write share one IndexedDB transaction. A page-local
    // lock cannot protect against another tab, a backup or the V2 engine.
    function writeProtectedMemoryRecords(records, options = {}) {
        const accountId = options.accountId || getDynamicUserId();
        const expected = options.expected || new Map();
        const signal = options.signal;
        return new Promise(resolve => {
            if (signal?.aborted || accountId !== getDynamicUserId() || window.__tonghuajiBackupRestoreInProgress) { resolve(false); return; }
            let database, transaction, settled = false;
            const finish = saved => {
                if (settled) return;
                settled = true;
                signal?.removeEventListener('abort', cancel);
                database?.close();
                resolve(saved);
            };
            const cancel = () => { try { transaction?.abort(); } catch (_) {} finish(false); };
            signal?.addEventListener('abort', cancel, { once: true });
            const request = indexedDB.open(DB_NAME);
            request.onerror = () => finish(false);
            request.onblocked = () => finish(false);
            request.onsuccess = () => {
                database = request.result;
                if (settled || signal?.aborted || accountId !== getDynamicUserId() || window.__tonghuajiBackupRestoreInProgress || !database.objectStoreNames.contains(STORE_NAME)) { database.close(); finish(false); return; }
                transaction = database.transaction(STORE_NAME, 'readwrite');
                const store = window.CharacterRecordCleanup?.wrap(transaction.objectStore(STORE_NAME)) || transaction.objectStore(STORE_NAME);
                const committed = [];
                let remaining = expected.size;
                const currentRecords = new Map();
                const put = () => {
                    if (signal?.aborted || accountId !== getDynamicUserId() || window.__tonghuajiBackupRestoreInProgress) { cancel(); return; }
                    if (options.summaryGuard) {
                        const guard = options.summaryGuard;
                        if (summaryBindingVersion(currentRecords.get(MEMORY_SUMMARIES_KEY + '_' + accountId)?.items, guard.bindingId) !== guard.version) { cancel(); return; }
                    }
                    try { for (const record of records) {
                        const current = currentRecords.get(record.id);
                        const next = expected.has(record.id) ? {
                            ...record,
                            schemaVersion: Math.max(Number(current?.schemaVersion) || 0, Number(record.schemaVersion) || 0),
                            storageVersion: 'memory_' + Date.now().toString(36) + '_' + Math.random().toString(36).slice(2)
                        } : record;
                        store.put(next);
                        if (Array.isArray(record.items)) committed.push([record.items, next]);
                    } } catch (_) { cancel(); }
                };
                for (const [key, version] of expected) {
                    const read = store.get(key);
                    read.onerror = cancel;
                    read.onsuccess = () => {
                        if (settled) return;
                        if (memoryRecordVersion(read.result) !== version) {
                            // Never retry a stale mutation against a newly loaded baseline.
                            if (typeof showToast === 'function') showToast('记忆已更新，旧内容未覆盖。请重新打开后重试。');
                            cancel(); return;
                        }
                        currentRecords.set(key, read.result);
                        if (--remaining === 0) put();
                    };
                }
                if (!remaining) put();
                transaction.oncomplete = () => {
                    if (settled) return;
                    if (accountId === getDynamicUserId() && committed.some(([, record]) => protectedMemoryKeys.has(record.id.slice(0, -String(accountId).length - 1)))) memoryPublicationEpoch += 1;
                    if (accountId === getDynamicUserId()) committed.forEach(([items, record]) => {
                        trackMemoryArray(items, record);
                        if (record.id === MEMORY_ITEMS_KEY + '_' + accountId) cachedMemoryItems = trackMemoryArray(items.map(hydrateMemoryItem).filter(Boolean), record);
                        if (record.id === MEMORY_SUMMARIES_KEY + '_' + accountId) cachedSummaries = trackMemoryArray(items.map(hydrateSummary).filter(Boolean), record);
                        if (record.id === MEMORY_OUTBOX_KEY + '_' + accountId) cachedOutbox = trackMemoryArray(items.map(hydrateOutboxItem).filter(Boolean), record);
                    });
                    finish(accountId === getDynamicUserId());
                };
                transaction.onerror = () => finish(false);
                transaction.onabort = () => finish(false);
            };
        });
    }

    function cachedMemoryVersion(key) {
        return memoryArrayVersion(key === MEMORY_ITEMS_KEY ? cachedMemoryItems : key === MEMORY_SUMMARIES_KEY ? cachedSummaries : cachedOutbox);
    }

    function writeCachedMemoryRecords(records, options = {}) {
        const accountId = getDynamicUserId();
        const expected = new Map(records.filter(record => protectedMemoryKeys.has(record.id))
            .map(record => [record.id + '_' + accountId, cachedMemoryVersion(record.id)]));
        return writeProtectedMemoryRecords(records.map(record => ({ ...record, id: record.id + '_' + accountId })), { ...options, accountId, expected });
    }
    let summaryIntervalMessages = DEFAULT_SUMMARY_INTERVAL;
    let summaryIntervalUserConfigured = false;
    let summaryPromptMode = SUMMARY_PROMPT_MODE_BUILTIN;
    let customSummaryPrompt = '';
    let summaryApiPresetId = '';
    let cachedSummaryApiPresets = [];
    let memorySummaryCapsuleTimer = 0;
    // Identifies the page that owns an automatic summary request. A request left
    // pending by a backgrounded or reloaded page can then be retried safely.
    const summaryRequestSessionId = 'page_' + Date.now().toString(36) + '_' + Math.random().toString(36).slice(2, 8);
    let semanticIndexScheduled = false;
    let memorySearchQuery = '';
    let memoryHomeExpandedView = false;
    const invalidatedSourceIds = new Set();
    const scopedSourceKey = (bindingId, messageId) => getDynamicUserId() + ':' + String(bindingId) + ':' + String(messageId);

    function getDynamicUserId() {
        if (typeof appSettings !== 'undefined' && appSettings.wc_current_user_id) return appSettings.wc_current_user_id;
        if (typeof window.appSettings !== 'undefined' && window.appSettings.wc_current_user_id) return window.appSettings.wc_current_user_id;
        return 'default';
    }

    function getIsolatedKey(key) {
        // 偏好设置和全局联系人(面具)数据不隔离，保持全局共享
        if (key === PREFERENCES_KEY || key === 'contactsAppData') return key; 
        return key + '_' + getDynamicUserId();
    }

    function ensureLegacyMemoryStorage() {
        const accountId = getDynamicUserId();
        if (legacyMemoryStorageReady.has(accountId)) return Promise.resolve(true);
        const keys = [...protectedMemoryKeys];
        const markerKey = 'memoryLegacyImportState_' + accountId;
        return new Promise(resolve => {
            const request = indexedDB.open(DB_NAME);
            request.onerror = () => resolve(false);
            request.onsuccess = () => {
                const database = request.result;
                if (accountId !== getDynamicUserId() || window.__tonghuajiBackupRestoreInProgress || !database.objectStoreNames.contains(STORE_NAME)) { database.close(); resolve(false); return; }
                const tx = database.transaction(STORE_NAME, 'readwrite');
                const store = window.CharacterRecordCleanup?.wrap(tx.objectStore(STORE_NAME)) || tx.objectStore(STORE_NAME);
                const values = new Map();
                const requested = [markerKey, 'memoryEngineV2Migration_' + accountId, ...keys.flatMap(key => [key, key + '_' + accountId])];
                let remaining = requested.length;
                requested.forEach(key => {
                    const read = store.get(key);
                    read.onsuccess = () => {
                        values.set(key, read.result);
                        if (--remaining || values.get(markerKey)) return;
                        if (accountId !== getDynamicUserId() || window.__tonghuajiBackupRestoreInProgress) { tx.abort(); return; }
                        const hasScopedData = values.get('memoryEngineV2Migration_' + accountId) || keys.some(key => values.get(key + '_' + accountId));
                        const legacy = keys.map(key => values.get(key)).filter(Boolean);
                        // Unowned historical data belongs only to the original default
                        // namespace. Never guess which named account should receive it.
                        const owned = accountId === 'default' || (legacy.length && legacy.every(record => String(record.accountId || record.userId || '') === accountId));
                        if (!hasScopedData && owned) keys.forEach(key => {
                            const record = values.get(key);
                            if (record) store.put({ ...record, id: key + '_' + accountId, storageVersion: 'legacy_' + Date.now().toString(36) + '_' + Math.random().toString(36).slice(2) });
                        });
                        store.put({ id: markerKey, checked: true, imported: Boolean(!hasScopedData && owned && legacy.length) });
                    };
                });
                tx.oncomplete = () => {
                    database.close();
                    if (accountId === getDynamicUserId()) legacyMemoryStorageReady.add(accountId);
                    resolve(accountId === getDynamicUserId());
                };
                tx.onerror = tx.onabort = () => { database.close(); resolve(false); };
            };
        });
    }

    function readRecords(keys, options = {}) {
        const actualKeys = new Map(keys.map(key => [key, options.exact ? key : getIsolatedKey(key)]));
        return new Promise((resolve, reject) => {
            const request = indexedDB.open(DB_NAME);
            request.onerror = () => reject(new Error('MEMORY_STORAGE_READ_FAILED'));
            request.onsuccess = () => {
                const database = request.result;
                if (!database.objectStoreNames.contains(STORE_NAME)) {
                    database.close();
                    resolve({});
                    return;
                }

                const result = {};
                const transaction = database.transaction(STORE_NAME, 'readonly');
                const store = (window.CharacterRecordCleanup?.wrap(transaction.objectStore(STORE_NAME)) || transaction.objectStore(STORE_NAME));
                keys.forEach((originalKey) => {
                    const actualKey = actualKeys.get(originalKey);
                    const getRequest = store.get(actualKey);
                    getRequest.onsuccess = () => {
                        if (getRequest.result || actualKey === originalKey) {
                            result[originalKey] = getRequest.result || null;
                            return;
                        }
                        if (protectedMemoryKeys.has(originalKey) || originalKey.startsWith('memoryEngineV2') || originalKey.startsWith('memoryV2') || originalKey.startsWith('memoryLegacy')) { result[originalKey] = null; return; }
                        const legacyRequest = store.get(originalKey);
                        legacyRequest.onsuccess = () => { result[originalKey] = legacyRequest.result || null; };
                        legacyRequest.onerror = () => { result[originalKey] = null; };
                    };
                });
                transaction.oncomplete = () => {
                    database.close();
                    resolve(result);
                };
                transaction.onabort = transaction.onerror = () => {
                    database.close();
                    reject(new Error('MEMORY_STORAGE_READ_FAILED'));
                };
            };
        });
    }

    function writeRecord(record) {
        if (protectedMemoryKeys.has(record.id)) return writeCachedMemoryRecords([record]);
        const accountId = getDynamicUserId();
        const storageKey = getIsolatedKey(record.id);
        return new Promise((resolve) => {
            const request = indexedDB.open(DB_NAME);
            request.onerror = () => resolve(false);
            request.onsuccess = () => {
                const database = request.result;
                if (accountId !== getDynamicUserId()) { database.close(); resolve(false); return; }
                if (!database.objectStoreNames.contains(STORE_NAME)) {
                    database.close();
                    resolve(false);
                    return;
                }
                const transaction = database.transaction(STORE_NAME, 'readwrite');
                const actualRecord = { ...record, id: storageKey };
                (window.CharacterRecordCleanup?.wrap(transaction.objectStore(STORE_NAME)) || transaction.objectStore(STORE_NAME)).put(actualRecord);
                transaction.oncomplete = () => {
                    database.close();
                    resolve(accountId === getDynamicUserId());
                };
                transaction.onerror = () => {
                    database.close();
                    resolve(false);
                };
            };
        });
    }

    function writeMemoryState(items, outbox, summaries = null, options = {}) {
        const records = [
            { id: MEMORY_ITEMS_KEY, schemaVersion: MEMORY_SCHEMA_VERSION, items },
            { id: MEMORY_OUTBOX_KEY, schemaVersion: MEMORY_SCHEMA_VERSION, items: outbox }
        ];
        if (Array.isArray(summaries)) records.push({ id: MEMORY_SUMMARIES_KEY, schemaVersion: MEMORY_SCHEMA_VERSION, items: summaries });
        return writeCachedMemoryRecords(records, options);
    }

    function savePreferences() {
        return writeRecord({
            id: PREFERENCES_KEY,
            selectedContactId,
            summaryIntervalMessages,
            summaryIntervalUserConfigured,
            summaryPromptMode,
            customSummaryPrompt,
            summaryApiPresetId,
            summaryPreferencesVersion: SUMMARY_PREFERENCES_VERSION
        });
    }

    function normalizeSummaryInterval(value) {
        const numericValue = Number.parseInt(value, 10);
        if (!Number.isFinite(numericValue)) return DEFAULT_SUMMARY_INTERVAL;
        return Math.max(MIN_SUMMARY_INTERVAL, Math.min(MAX_SUMMARY_INTERVAL, numericValue));
    }

    function readSummaryInterval(preferences) {
        if (!preferences) {
            return DEFAULT_SUMMARY_INTERVAL;
        }
        return normalizeSummaryInterval(preferences.summaryIntervalMessages);
    }

    function readSummaryPromptPreferences(preferences) {
        return {
            mode: preferences && preferences.summaryPromptMode === SUMMARY_PROMPT_MODE_CUSTOM
                ? SUMMARY_PROMPT_MODE_CUSTOM
                : SUMMARY_PROMPT_MODE_BUILTIN,
            customPrompt: String(preferences && preferences.customSummaryPrompt || '').trim().slice(0, MAX_SUMMARY_PROMPT_LENGTH)
        };
    }

    function readSummaryApiPreference(preferences) {
        return String(preferences && preferences.summaryApiPresetId || '').trim();
    }

    function getSummaryApiPresetId() {
        return summaryApiPresetId;
    }

    function normalizeConversationMessage(message, index, contactId) {
        if (!message || typeof message !== 'object') return null;
        const rawType = String(message.type || '').toLowerCase();
        const rawRole = String(message.role || message.senderRole || message.authorRole || '').toLowerCase();
        const sentFlag = message.isUser === true || message.fromMe === true || message.sentByUser === true;
        const receivedFlag = message.isUser === false || message.fromMe === false || message.sentByUser === false;
        const type = rawType === 'sent' || rawRole === 'user' || rawRole === 'sender' || sentFlag
            ? 'sent'
            : rawType === 'received' || rawRole === 'assistant' || rawRole === 'character' || rawRole === 'receiver' || receivedFlag
                ? 'received'
                : '';
        const text = message.text ?? message.content ?? message.message ?? message.body;
        if (!type || !normalizeMemoryText(text)) return null;
        return {
            ...message,
            id: String(message.id || message.msgId || message.localId || ('legacy_' + (contactId || 'chat') + '_' + index)),
            type,
            text: String(text)
        };
    }

    function countConversationTurns(messages) {
        return (Array.isArray(messages) ? messages : []).reduce(
            (count, message) => count + (message && message.type === 'sent' ? 1 : 0),
            0
        );
    }

    function countConversationFloors(messages) {
        return (Array.isArray(messages) ? messages : []).reduce(
            (count, message) => count + (
                message
                && (message.type === 'sent' || message.type === 'received')
                && normalizeMemoryText(message.text)
                    ? 1
                    : 0
            ),
            0
        );
    }

    function takeRecentConversationTurns(messages, turnLimit) {
        const list = Array.isArray(messages) ? messages : [];
        if (!list.length) return [];
        const targetTurns = Math.max(1, Number(turnLimit) || DEFAULT_SUMMARY_INTERVAL);
        let turns = 0;
        let startIndex = list.length - 1;
        for (let index = list.length - 1; index >= 0; index -= 1) {
            startIndex = index;
            if (list[index] && list[index].type === 'sent') turns += 1;
            if (turns >= targetTurns) break;
        }
        return list.slice(startIndex).slice(-MAX_SUMMARY_SOURCE_MESSAGES);
    }

    function getContactMessages(contactId) {
        const messages = cachedConversations && cachedConversations[contactId];
        return Array.isArray(messages)
            ? messages.map((message, index) => normalizeConversationMessage(message, index, contactId)).filter(Boolean)
            : [];
    }

    function resolveSummaryMessageTime(message, index, list) {
        const parsed = parseMessageTime(message);
        if (parsed) return parsed;
        const items = Array.isArray(list) ? list : [];
        for (let previous = index - 1; previous >= 0; previous -= 1) {
            const timestamp = parseMessageTime(items[previous]);
            if (timestamp) return timestamp + (index - previous) * 60000;
        }
        for (let next = index + 1; next < items.length; next += 1) {
            const timestamp = parseMessageTime(items[next]);
            if (timestamp) return Math.max(0, timestamp - (next - index) * 60000);
        }
        return Date.now() - Math.max(0, items.length - index) * 60000;
    }

    function mapSummarizableMessage(message, index, list, contactId) {
        return {
            ...message,
            id: String(message && (message.id || message.msgId || message.localId) || ('legacy_' + (contactId || 'chat') + '_' + index)),
            type: message && message.type === 'sent' ? 'sent' : 'received',
            text: message && message.text,
            time: resolveSummaryMessageTime(message, index, list)
        };
    }

    function listSummarizableMessages(contactId) {
        return getContactMessages(contactId)
            .filter((item) => item && (item.type === 'sent' || item.type === 'received') && normalizeMemoryText(item.text))
            .map((item, index, list) => mapSummarizableMessage(item, index, list, contactId));
    }

    function getSummarySourceMessages(summary, messages = []) {
        const citedIds = new Set((summary && Array.isArray(summary.sourceMessageIds) ? summary.sourceMessageIds : []).map(String));
        const live = (Array.isArray(messages) ? messages : [])
            .filter((message) => message && message.id && (message.type === 'sent' || message.type === 'received') && normalizeMemoryText(message.text))
            .map((message) => ({
                id: String(message.id),
                type: message.type,
                text: normalizeMemoryText(message.text),
                timestamp: parseMessageTime(message)
            }))
            .filter((message) => citedIds.has(message.id));
        if (live.length) return live;
        return (Array.isArray(summary && summary.sourceSnapshots) ? summary.sourceSnapshots : [])
            .map((snapshot, index) => ({
                id: String(snapshot && snapshot.id || ('snapshot_' + index)),
                type: snapshot && snapshot.type === 'sent' ? 'sent' : 'received',
                text: normalizeMemoryText(snapshot && snapshot.text),
                timestamp: parseMessageTime(snapshot)
            }))
            .filter((item) => item.text);
    }

    function parseMessageTime(message) {
        for (const key of ['timestamp', 'time', 'createdAt', 'date']) {
            const value = message && message[key];
            if (typeof value === 'number' && Number.isFinite(value)) return value < 100000000000 ? value * 1000 : value;
            if (typeof value === 'string') {
                const numericValue = Number(value);
                if (Number.isFinite(numericValue) && numericValue > 0) return numericValue < 100000000000 ? numericValue * 1000 : numericValue;
                const timestamp = Date.parse(value);
                if (Number.isFinite(timestamp)) return timestamp;
            }
        }
        return 0;
    }

    function getKnownDays(messages) {
        const firstTimestamp = messages.reduce((earliest, message) => {
            const timestamp = parseMessageTime(message);
            return timestamp && (!earliest || timestamp < earliest) ? timestamp : earliest;
        }, 0);
        if (!firstTimestamp) return 0;
        return Math.max(1, Math.floor((Date.now() - firstTimestamp) / 86400000) + 1);
    }

    function setAvatar(contact) {
        const avatar = root.querySelector('[data-memory-avatar]');
        const monogram = root.querySelector('[data-memory-monogram]');
        const image = root.querySelector('[data-memory-avatar-image]');
        const name = contact && contact.name ? contact.name.trim() : '';
        monogram.textContent = name ? name.slice(0, 1) : '记';
        image.removeAttribute('src');
        avatar.classList.remove('has-image');
        if (contact && contact.avatar) {
            image.src = contact.avatar;
            image.onload = () => avatar.classList.add('has-image');
            image.onerror = () => avatar.classList.remove('has-image');
        }
    }

    function getEmptyCopy() {
        const copy = {
            memory: ['暂无记忆', '这里会收纳你们确认过的共同记忆。'],
            relationship: ['暂无近期经历', '累计足够的新对话后，会在后台生成可核对的经历摘要。'],
            archive: ['档案尚未建立', '下一次 AI 记忆分析后，这里会生成角色眼中的你。']
        };
        return copy[activeTab] || copy.memory;
    }

    function getTabLabel(tab = activeTab) {
        return ({ memory: '记忆', relationship: '经历', archive: '档案' })[tab] || '记忆';
    }

    function getActiveItems(contactId, kind) {
        return cachedMemoryItems
            .filter((item) => item && item.bindingId === contactId && item.status === 'active')
            .filter((item) => !kind || item.kind === kind)
            .sort((left, right) => parseMemoryHomeTime(right.createdAt || right.updatedAt) - parseMemoryHomeTime(left.createdAt || left.updatedAt));
    }

    function normalizeMemoryText(value) {
        return String(value || '').replace(/\s+/g, ' ').trim();
    }

    function getMemoryLifecycle(value) {
        const text = normalizeMemoryText(value);
        if (/(结束|过了|好了|完成|取消|不再|停止|离开|搬到|换成|改成|解决|恢复|过去|走了|回来了)/i.test(text)) {
            return { kind: 'event', state: 'closed' };
        }
        if (/(喜欢|不喜欢|爱吃|习惯|擅长|来自|住在|工作|职业|生日|名字|叫我|通常|一直|总是|偏好|兴趣|长期|计划|打算)/i.test(text)) {
            return { kind: 'stable', state: 'open' };
        }
        return { kind: 'event', state: 'open' };
    }

    function getMemoryRelevanceScore(item, query) {
        const queryTerms = new Set(createTextTerms(query));
        if (!queryTerms.size) return 0;
        const itemTerms = new Set(Array.isArray(item && item.keywords) && item.keywords.length
            ? item.keywords
            : createTextTerms(item && item.content));
        let matched = 0;
        queryTerms.forEach((term) => { if (itemTerms.has(term)) matched += 1; });
        const vectorScore = cosineSimilarity(createLocalMemoryVector(query), ensureLocalVector(item));
        return matched * 6 + (vectorScore >= VECTOR_MIN_SIMILARITY ? Math.round(vectorScore * 8) : 0);
    }

    function shouldSupersedeMemory(previous, nextContent) {
        if (!previous || previous.status !== 'active' || previous.tier !== 'L1') return false;
        const lifecycle = previous.lifecycle || getMemoryLifecycle(previous.content);
        if (lifecycle.kind !== 'event' || !/(结束|过了|好了|完成|取消|不再|停止|离开|搬到|换成|改成|解决|恢复|过去|走了|回来了)/i.test(nextContent)) return false;
        const previousTerms = new Set(Array.isArray(previous.keywords) && previous.keywords.length
            ? previous.keywords
            : createTextTerms(previous.content));
        const nextTerms = new Set(createTextTerms(nextContent));
        let overlap = 0;
        nextTerms.forEach((term) => { if (previousTerms.has(term)) overlap += 1; });
        return overlap >= 2;
    }

    function supersedeConflictingEvents(items, bindingId, nextContent, supersedingId, now) {
        return (Array.isArray(items) ? items : []).map((item) => shouldSupersedeMemory(item, nextContent) && item.bindingId === bindingId
            ? {
                ...item,
                status: 'superseded',
                archiveReason: 'superseded',
                supersededBy: supersedingId,
                updatedAt: now,
                revision: Math.max(1, Number(item.revision) || 1) + 1
            }
            : item);
    }

    function isSensitiveAutomaticMemory(value) {
        return /(过敏|疾病|病史|诊断|药物|医院|怀孕|流产|住址|地址|身份证|银行卡|工资|收入|债务|欠债|性经历|创伤|自杀)/i.test(value);
    }

    function getSourceIds(item) {
        return Array.isArray(item && item.sourceRefs)
            ? item.sourceRefs.map((source) => String(source && source.messageId || '')).filter(Boolean)
            : [];
    }

    function getArchiveReason(item) {
        const reason = String(item && item.archiveReason || '').trim();
        return ({ user_deleted: '用户归档', source_removed: '来源已删除', superseded: '已被新记忆替代' })[reason] || reason;
    }

    function getSourceLabel(item) {
        const source = Array.isArray(item && item.sourceRefs) ? item.sourceRefs[0] : null;
        if (!source) return '来源：未标注';
        if (source.type === 'manual') return '来源：手动添加';
        if (source.type === 'manual_edit') return '来源：手动修订';
        if (source.messageId) return '来源：聊天记录';
        return '来源：已记录';
    }

    function getRetrievalCount(item) {
        return Math.max(0, Number(item && item.retrievalStats && item.retrievalStats.injectedCount) || 0);
    }

    function getRetrievalPriority(item) {
        const priority = Number(item && item.retrievalPriority);
        if (priority === RETRIEVAL_PRIORITY.pinned || priority === RETRIEVAL_PRIORITY.low) return priority;
        return item && item.pinned ? RETRIEVAL_PRIORITY.pinned : RETRIEVAL_PRIORITY.normal;
    }

    function getRetrievalPriorityLabel(item) {
        const priority = getRetrievalPriority(item);
        if (priority === RETRIEVAL_PRIORITY.pinned) return '置顶';
        if (priority === RETRIEVAL_PRIORITY.low) return '降低优先级';
        return '普通';
    }

    function getMemoryRetention(item, now = Date.now()) {
        if (!item) return 0;
        const referenceTimestamp = Date.parse(
            item.reinforcedAt
            || (item.authority === 'user_confirmed' ? item.updatedAt : '')
            || item.createdAt
            || item.updatedAt
            || ''
        );
        if (!Number.isFinite(referenceTimestamp)) return 1;
        const elapsedDays = Math.max(0, (now - referenceTimestamp) / 86400000);
        let stabilityDays = MEMORY_BASE_STABILITY_DAYS;
        if (item.lifecycle?.kind === 'stable') stabilityDays *= 2.5;
        if (item.authority === 'user_confirmed') stabilityDays *= 2;
        if (getRetrievalPriority(item) === RETRIEVAL_PRIORITY.pinned) stabilityDays *= 1.75;
        if (getRetrievalPriority(item) === RETRIEVAL_PRIORITY.low) stabilityDays *= 0.5;
        return Math.max(0, Math.min(1, Math.exp(-elapsedDays / stabilityDays)));
    }

    function getMemoryRetentionScore(item, now = Date.now()) {
        return Math.round(getMemoryRetention(item, now) * MEMORY_RETENTION_SCORE_MAX * 100) / 100;
    }

    function getMemoryRetentionReason(item, now = Date.now()) {
        const retention = getMemoryRetention(item, now);
        return retention >= 0.65
            ? '保持率 ' + Math.round(retention * 100) + '%'
            : '已衰减至 ' + Math.round(retention * 100) + '%';
    }

    function hydrateMemoryItem(item) {
        if (!item || !item.id || !item.bindingId || (!item.content && !item.deletedAt && !(item.status === 'archived' && ['user_deleted', 'remote_deleted', 'source_removed'].includes(item.archiveReason)))) return null;
        const lifecycle = item.lifecycle && typeof item.lifecycle === 'object'
            ? item.lifecycle
            : getMemoryLifecycle(item.content);
        return {
            ...item,
            schemaVersion: Math.max(Number(item.schemaVersion) || 1, MEMORY_SCHEMA_VERSION),
            revision: Math.max(1, Number(item.revision) || 1),
            lifecycle: { kind: lifecycle.kind === 'stable' ? 'stable' : 'event', state: lifecycle.state === 'closed' ? 'closed' : 'open' },
            retrievalPriority: getRetrievalPriority(item),
            sourceRefs: Array.isArray(item.sourceRefs) ? item.sourceRefs : [],
            retrievalStats: item.retrievalStats && typeof item.retrievalStats === 'object'
                ? item.retrievalStats
                : { injectedCount: 0, lastInjectedAt: '', lastInjectedTurn: '', lastScore: 0, lastReasons: [] }
        };
    }

    function hydrateOutboxItem(item) {
        if (!item || !item.id || !item.bindingId || !Array.isArray(item.sourceMessages)) return null;
        return {
            ...item,
            schemaVersion: Math.max(Number(item.schemaVersion) || 1, MEMORY_SCHEMA_VERSION),
            status: item.status === 'failed' ? 'failed' : 'pending',
            attempts: Math.max(0, Number(item.attempts) || 0),
            nextAttemptAt: item.nextAttemptAt || '',
            lastError: item.lastError || '',
            updatedAt: item.updatedAt || item.createdAt || new Date().toISOString()
        };
    }

    function createTextTerms(value) {
        const text = normalizeMemoryText(value).toLowerCase();
        const terms = new Set();
        const stopTerms = new Set(['我们', '你们', '他们', '这个', '那个', '就是', '因为', '所以', '还是', '已经', '可以', '不是', '没有', '一个', '什么', '怎么', '现在', '今天', '真的', '感觉', '知道', '觉得', '然后']);
        (text.match(/[a-z0-9]{2,}/g) || []).forEach((term) => terms.add(term));
        (text.match(/[\u4e00-\u9fff]+/g) || []).forEach((block) => {
            for (let index = 0; index < block.length - 1; index += 1) {
                const term = block.slice(index, index + 2);
                if (!stopTerms.has(term)) terms.add(term);
            }
        });
        return Array.from(terms).slice(0, 40);
    }

    function hashVectorToken(value) {
        let hash = 2166136261;
        for (let index = 0; index < value.length; index += 1) {
            hash ^= value.charCodeAt(index);
            hash = Math.imul(hash, 16777619);
        }
        return hash >>> 0;
    }

    function createLocalMemoryVector(value) {
        const text = normalizeMemoryText(value).toLowerCase().replace(/\s+/g, '');
        const values = new Float32Array(VECTOR_DIMENSIONS);
        if (!text) return { version: VECTOR_INDEX_VERSION, dimensions: VECTOR_DIMENSIONS, values };

        const addToken = (token, weight) => {
            const hash = hashVectorToken(token);
            const slot = hash % VECTOR_DIMENSIONS;
            values[slot] += (hash & 1) === 0 ? weight : -weight;
        };
        for (let index = 0; index < text.length; index += 1) addToken(text[index], 0.5);
        for (let size = 2; size <= 3; size += 1) {
            for (let index = 0; index <= text.length - size; index += 1) addToken(text.slice(index, index + size), 1);
        }
        let norm = 0;
        values.forEach((entry) => { norm += entry * entry; });
        if (norm > 0) {
            const scale = 1 / Math.sqrt(norm);
            for (let index = 0; index < values.length; index += 1) values[index] *= scale;
        }
        return { version: VECTOR_INDEX_VERSION, dimensions: VECTOR_DIMENSIONS, values };
    }

    function getVectorValues(vector) {
        const values = vector && vector.values;
        if (!values || Number(vector.dimensions) !== VECTOR_DIMENSIONS || vector.version !== VECTOR_INDEX_VERSION) return null;
        if (!Array.isArray(values) && !(values instanceof Float32Array)) return null;
        return values.length === VECTOR_DIMENSIONS ? values : null;
    }

    function getSemanticVectorValues(vector) {
        const values = vector && vector.values;
        const expectedVersion = typeof window.SemanticMemory?.getVectorVersion === 'function'
            ? window.SemanticMemory.getVectorVersion()
            : '';
        if (!expectedVersion || !vector || vector.version !== expectedVersion || !Number.isFinite(Number(vector.dimensions))) return null;
        if (!Array.isArray(values) && !(values instanceof Float32Array)) return null;
        return values.length === Number(vector.dimensions) && values.length > 0 ? values : null;
    }

    function cosineSimilarity(leftVector, rightVector) {
        const left = getVectorValues(leftVector);
        const right = getVectorValues(rightVector);
        if (!left || !right) return 0;
        let score = 0;
        for (let index = 0; index < VECTOR_DIMENSIONS; index += 1) score += left[index] * right[index];
        return Math.max(0, Math.min(1, score));
    }

    function semanticCosineSimilarity(left, right) {
        if (!left || !right || left.length !== right.length) return 0;
        let score = 0;
        for (let index = 0; index < left.length; index += 1) score += left[index] * right[index];
        return Math.max(0, Math.min(1, score));
    }

    function ensureLocalVector(item) {
        const existing = getVectorValues(item && item.vectorIndex);
        if (existing) return item.vectorIndex;
        const vectorIndex = createLocalMemoryVector(item && item.content);
        if (item) item.vectorIndex = vectorIndex;
        return vectorIndex;
    }

    function scheduleSemanticIndex() {
        if (semanticIndexScheduled || typeof window.SemanticMemory?.embed !== 'function') return;
        if (window.SemanticMemory.isReady && !window.SemanticMemory.isReady()) return;
        if (!window.SemanticMemory.isReady && window.SemanticMemory.getState?.().status !== 'ready') return;
        semanticIndexScheduled = true;
        const schedule = typeof window.requestIdleCallback === 'function'
            ? (callback) => window.requestIdleCallback(callback, { timeout: 3000 })
            : (callback) => setTimeout(callback, 250);
        schedule(() => void populateSemanticVectors());
    }

    async function populateSemanticVectors() {
        semanticIndexScheduled = false;
        if (typeof window.SemanticMemory?.embed !== 'function') return;
        try {
            if (!await window.SemanticMemory.warmup?.()) return;
            const missing = cachedMemoryItems
                .filter((item) => item && item.tier === 'L3' && item.kind === 'fragment' && item.status === 'active' && !getSemanticVectorValues(item.semanticVector))
                .slice(0, 8);
            if (!missing.length) return;
            const nextById = new Map();
            for (const item of missing) {
                const semanticVector = await window.SemanticMemory.embed(item.content);
                if (semanticVector) nextById.set(item.id, semanticVector);
            }
            if (!nextById.size) return;
            const now = new Date().toISOString();
            const nextItems = cachedMemoryItems.map((item) => {
                const semanticVector = nextById.get(item && item.id);
                return semanticVector ? { ...item, semanticVector } : item;
            });
            const saved = await writeRecord({ id: MEMORY_ITEMS_KEY, schemaVersion: MEMORY_SCHEMA_VERSION, items: nextItems });
            if (saved) cachedMemoryItems = nextItems;
            if (missing.length === 8) scheduleSemanticIndex();
        } catch (error) {
            console.debug('语义记忆索引暂不可用，已保留本地 n-gram 检索：', error);
        }
    }

    function hydrateSummary(summary) {
        if (!summary || !summary.id || !summary.bindingId || !Array.isArray(summary.sections)) return null;
        return {
            ...summary,
            slot: summary.slot === 'chapter' ? 'chapter' : 'working',
            status: summary.status || 'active',
            sourceSnapshots: Array.isArray(summary.sourceSnapshots) ? summary.sourceSnapshots : []
        };
    }

    function isWorkingSummary(summary) {
        return Boolean(summary && summary.slot !== 'chapter');
    }

    function getActiveSummary(bindingId) {
        return cachedSummaries.find((summary) => summary && summary.bindingId === bindingId && isWorkingSummary(summary) && summary.status === 'active') || null;
    }

    function getManageableSummary(bindingId) {
        return cachedSummaries.find((summary) => summary && summary.bindingId === bindingId && isWorkingSummary(summary) && (summary.status === 'active' || summary.status === 'dirty')) || null;
    }

    function getChapterSummaries(bindingId) {
        return cachedSummaries
            .filter((summary) => summary && summary.bindingId === bindingId && summary.slot === 'chapter' && summary.status === 'active')
            .sort((left, right) => {
                const leftStart = left.sections && left.sections[0] && left.sections[0].timeRange && left.sections[0].timeRange.start || left.createdAt || '';
                const rightStart = right.sections && right.sections[0] && right.sections[0].timeRange && right.sections[0].timeRange.start || right.createdAt || '';
                return String(leftStart).localeCompare(String(rightStart));
            });
    }

    function getCoveredChapterMessageIds(bindingId) {
        const ids = new Set();
        cachedSummaries.filter(summary => summary?.bindingId === bindingId && ((summary.slot === 'chapter' && summary.status === 'active') || (summary.status === 'archived' && summary.archiveReason === 'user_deleted'))).forEach((summary) => {
            (Array.isArray(summary.sourceMessageIds) ? summary.sourceMessageIds : []).forEach((id) => ids.add(String(id)));
        });
        return ids;
    }

    function getSummaryTurnRange(summary, bindingId) {
        if (!summary || !bindingId) return null;
        const sourceRecords = Array.isArray(summary.sourceSnapshots) && summary.sourceSnapshots.length
            ? summary.sourceSnapshots
            : (Array.isArray(summary.sourceMessageIds) ? summary.sourceMessageIds.map((id) => ({ id })) : []);
        const sourceIds = new Set(sourceRecords.map((item) => String(item && item.id || '')).filter(Boolean));
        if (!sourceIds.size) return null;

        const floorMessages = listSummarizableMessages(bindingId);
        const ordinals = floorMessages
            .map((message, index) => sourceIds.has(String(message.id)) ? index + 1 : 0)
            .filter((value) => value > 0);
        if (!ordinals.length) return null;
        return {
            start: Math.min(...ordinals),
            end: Math.max(...ordinals)
        };
    }

    function getSummaryRangeLabel(summary, bindingId) {
        const range = getSummaryTurnRange(summary, bindingId);
        return range ? ('输入第' + range.start + '条–第' + range.end + '条') : '';
    }

    function normalizeSummaryContent(value) {
        return String(value || '')
            .replace(/\r\n/g, '\n')
            .replace(/[ \t]+\n/g, '\n')
            .replace(/\n{3,}/g, '\n\n')
            .trim();
    }

    function formatSummaryBody(value) {
        const text = normalizeSummaryContent(value);
        if (!text) return '';
        if (/\n/.test(text)) return text;
        return text
            .replace(/\s*(【\d{4}年\d{1,2}月\d{1,2}日(?:\s+\d{1,2}:\d{2})?】)/g, '\n$1')
            .replace(/^\n/, '')
            .trim();
    }

    function getSummaryTimeLabel(summary, section) {
        const timeRange = section && section.timeRange
            || summary && summary.sections && summary.sections[0] && summary.sections[0].timeRange;
        if (timeRange && (timeRange.start || timeRange.end)) {
            if (timeRange.start && timeRange.end) {
                return formatSummaryTimestamp(timeRange.start) + ' 至 ' + formatSummaryTimestamp(timeRange.end);
            }
            return formatSummaryTimestamp(timeRange.start || timeRange.end);
        }
        return formatSummaryTimestamp(summary && (summary.updatedAt || summary.createdAt));
    }

    function getSummarySortTime(summary, section = summary?.sections?.[0]) {
        const range = section?.timeRange || {};
        // Display history by conversation time, not by a later edit or confirmation.
        return parseMemoryHomeTime(range.start) || parseMemoryHomeTime(range.end)
            || (summary?.sourceSnapshots || []).map(parseMessageTime).find((time) => time > 0)
            || parseMemoryHomeTime(summary?.createdAt) || parseMemoryHomeTime(summary?.updatedAt);
    }

    function formatSummarySection(section) {
        const content = formatSummaryBody(section && section.content);
        const details = section && section.details && typeof section.details === 'object' ? section.details : {};
        const parts = content ? [content] : [];
        [
            ['事件记录', details.events],
            ['角色感受', details.characterEmotion],
            ['用户状态', details.userState],
            ['关系变化', details.relationshipChange],
            ['计划与未解决事项', details.openLoops]
        ].forEach(([label, value]) => {
            const text = formatSummaryBody(value);
            // Do not repeat details already present verbatim in the narrative or another detail.
            if (text && !parts.some(part => part.includes(text))) parts.push(label + '：' + text);
        });
        return parts.join('\n\n');
    }

    function formatSummaryRecord(summary) {
        if (!summary || !Array.isArray(summary.sections)) return '';
        return summary.sections
            .map(section => [getSummaryTimeLabel(summary, section), formatSummarySection(section)].filter(Boolean).join('\n\n'))
            .filter(Boolean)
            .join('\n\n');
    }

    function decorateSummaryDisclosure(card, header) {
        card.classList.add('memory-summary-fold');
        const chevron = header.ownerDocument.createElement('span');
        chevron.className = 'memory-summary-fold-chevron';
        chevron.setAttribute('aria-hidden', 'true');
        chevron.innerHTML = getMemoryHomeSvg('chevron', 16);
        header.appendChild(chevron);
    }

    function renderSummaryArticle(target, summary, section, emptyText) {
        if (!target) return;
        target.replaceChildren();
        const currentSection = section || summary && summary.sections && summary.sections[0];
        const body = formatSummarySection(currentSection);
        target.classList.toggle('is-empty', !body);
        if (!body) {
            target.textContent = emptyText || '';
            return;
        }
        const time = document.createElement('div');
        time.className = 'memory-summary-time';
        time.textContent = getSummaryTimeLabel(summary, currentSection);
        const copy = document.createElement('div');
        copy.className = 'memory-summary-body';
        copy.textContent = body;
        target.append(time, copy);
    }

    function getPromptSummary(bindingId) {
        return [getChapterSummaries(bindingId).map(formatSummaryRecord).filter(Boolean).join('\n\n'), formatSummaryRecord(getActiveSummary(bindingId))]
            .filter(Boolean)
            .join('\n\n')
            .slice(0, MAX_SUMMARY_PROMPT_INJECTION_LENGTH);
    }

    function getCurrentPromptSummary(bindingId) {
        const activeSummary = getActiveSummary(bindingId);
        const chapters = activeSummary ? [] : getChapterSummaries(bindingId);
        const currentSummary = activeSummary || chapters[chapters.length - 1] || null;
        // Automatic summaries are finalized into chapters immediately, so the latest
        // confirmed chapter remains available as the current recap until a new draft exists.
        return formatSummaryRecord(currentSummary).slice(0, MAX_SUMMARY_PROMPT_INJECTION_LENGTH);
    }

    function getSummaryPromptConfig() {
        return {
            mode: summaryPromptMode,
            customPrompt: summaryPromptMode === SUMMARY_PROMPT_MODE_CUSTOM ? customSummaryPrompt : ''
        };
    }

    function writeSyncedMemoryState(items, summaries, conversations) {
        const records = [
            { id: MEMORY_ITEMS_KEY, schemaVersion: MEMORY_SCHEMA_VERSION, items },
            { id: MEMORY_SUMMARIES_KEY, schemaVersion: MEMORY_SCHEMA_VERSION, items: summaries }
        ];
        if (conversations) records.push({ id: CHATS_KEY, messages: conversations });
        return writeCachedMemoryRecords(records);
    }

    function getSummaryOverview(bindingId, messages = []) {
        const coveredIds = getCoveredChapterMessageIds(bindingId);
        const sourceMessages = (Array.isArray(messages) ? messages : [])
            .filter((message) => message && message.id && (message.type === 'sent' || message.type === 'received') && normalizeMemoryText(message.text))
            .map((message) => ({
                id: String(message.id),
                type: message.type,
                text: normalizeMemoryText(message.text),
                timestamp: parseMessageTime(message)
            }));
        const uncoveredMessages = sourceMessages.filter((message) => !coveredIds.has(message.id));
        const summary = getManageableSummary(bindingId);
        let unprocessedMessages = uncoveredMessages;
        if (summary) {
            const lastProcessedIndex = uncoveredMessages.findIndex((message) => message.id === String(summary.lastProcessedMessageId || ''));
            if (lastProcessedIndex >= 0) {
                unprocessedMessages = uncoveredMessages.slice(lastProcessedIndex + 1);
            } else {
                const priorSourceIds = new Set((summary.sourceMessageIds || []).map(String));
                unprocessedMessages = uncoveredMessages.filter((message) => !priorSourceIds.has(message.id));
            }
        }
        const totalTurnCount = countConversationTurns(uncoveredMessages);
        const newTurnCount = countConversationTurns(unprocessedMessages);
        return {
            hasSummary: Boolean(summary),
            summary,
            text: formatSummaryRecord(summary).slice(0, MAX_SUMMARY_PROMPT_INJECTION_LENGTH),
            updatedAt: summary && summary.updatedAt || '',
            revision: summary && Number(summary.revision) || 0,
            totalMessageCount: uncoveredMessages.length,
            totalTurnCount,
            newMessageCount: newTurnCount,
            newTurnCount,
            interval: summaryIntervalMessages,
            remainingMessageCount: Math.max(0, summaryIntervalMessages - newTurnCount),
            remainingTurnCount: Math.max(0, summaryIntervalMessages - newTurnCount),
            progress: Math.min(1, newTurnCount / summaryIntervalMessages),
            sourceMessages: getSummarySourceMessages(summary, messages)
        };
    }

        async function saveSummaryOverride(bindingId, value) {
        const summary = getManageableSummary(bindingId);
        const content = formatSummaryBody(value);
        if (!summary || !content) return false;
        const now = new Date().toISOString();
        const priorHistory = [{
            revision: summary.revision,
            sections: summary.sections,
            sourceMessageIds: summary.sourceMessageIds,
            updatedAt: summary.updatedAt
        }, ...(Array.isArray(summary.history) ? summary.history : [])].slice(0, 20);
        const nextSummary = {
            ...summary,
            authority: 'user_confirmed',
            revision: Math.max(1, Number(summary.revision) || 1) + 1,
            sections: [{
                ...(summary.sections[0] || {}),
                title: normalizeMemoryText(summary.sections[0] && summary.sections[0].title).slice(0, 20) || '近况',
                content,
                // The editor contains the full displayed text, including all former details.
                details: null,
                sourceMessageIds: Array.isArray(summary.sourceMessageIds) ? summary.sourceMessageIds.slice() : []
            }],
            history: priorHistory,
            updatedAt: now
        };
        const nextSummaries = cachedSummaries.map((item) => item && item.id === summary.id ? nextSummary : item);
        const saved = await writeRecord({ id: MEMORY_SUMMARIES_KEY, schemaVersion: MEMORY_SCHEMA_VERSION, items: nextSummaries });
        if (saved) { cachedSummaries = nextSummaries; await refreshDerivedMemory(); }
        if (saved) window.MemorySync?.schedule(bindingId);
        return saved;
    }

    async function deleteSummary(bindingId, summaryId = '') {
        const summary = summaryId
            ? cachedSummaries.find(item => item?.id === summaryId && item.bindingId === bindingId && ['active', 'dirty'].includes(item.status))
            : getManageableSummary(bindingId);
        if (!summary) return false;
        const now = new Date().toISOString();
        const nextSummary = {
            ...summary,
            status: 'archived',
            archiveReason: 'user_deleted',
            updatedAt: now,
            revision: Math.max(1, Number(summary.revision) || 1) + 1
        };
        const nextSummaries = cachedSummaries.map((item) => item && item.id === summary.id ? nextSummary : item);
        const saved = await writeRecord({ id: MEMORY_SUMMARIES_KEY, schemaVersion: MEMORY_SCHEMA_VERSION, items: nextSummaries });
        if (saved) {
            cachedSummaries = nextSummaries;
            await refreshDerivedMemory();
            window.MemorySync?.schedule(bindingId);
        }
        return saved;
    }

    function suggestPreviousSummaryRange(bindingId) {
        const messages = listSummarizableMessages(bindingId);
        const coveredIds = getCoveredChapterMessageIds(bindingId);
        if (!messages.length) return null;
        let endIndex = -1;
        for (let index = messages.length - 1; index >= 0; index -= 1) {
            if (!coveredIds.has(String(messages[index].id))) {
                endIndex = index;
                break;
            }
        }
        if (endIndex < 0) return null;
        // Manual selection spans every pending message in one range; the automatic
        // trigger interval must never truncate it or turn history gaps into batches.
        const startIndex = messages.findIndex(message => !coveredIds.has(String(message.id)));
        return { start: startIndex + 1, end: endIndex + 1 };
    }

    function applySuggestedSummaryRange(bindingId) {
        const range = suggestPreviousSummaryRange(bindingId);
        const start = root && root.querySelector('[data-memory-summary-range-start]');
        const end = root && root.querySelector('[data-memory-summary-range-end]');
        if (!range || !start || !end) return false;
        start.value = String(range.start);
        end.value = String(range.end);
        return true;
    }

    function createSummaryChapter(summary, authority = 'user_confirmed', now = new Date().toISOString()) {
        if (!summary || !summary.bindingId) return null;
        return {
            ...summary,
            id: 'summary_' + summary.bindingId + '_chapter_' + Date.now() + '_' + Math.random().toString(36).slice(2, 8),
            slot: 'chapter',
            status: 'active',
            authority,
            confirmedAt: now,
            updatedAt: now,
            revision: Math.max(1, Number(summary.revision) || 1)
        };
    }

    async function confirmWorkingSummary(bindingId) {
        const working = getManageableSummary(bindingId);
        if (!working) return false;
        const now = new Date().toISOString();
        const chapter = createSummaryChapter(working, 'user_confirmed', now);
        const nextSummaries = cachedSummaries
            .map((summary) => summary && summary.id === working.id
                ? {
                    ...working,
                    status: 'archived',
                    archiveReason: 'confirmed_as_chapter',
                    supersededBy: chapter.id,
                    updatedAt: now
                }
                : summary)
            .concat(chapter);
        const saved = await writeRecord({ id: MEMORY_SUMMARIES_KEY, schemaVersion: MEMORY_SCHEMA_VERSION, items: nextSummaries });
        if (saved) {
            cachedSummaries = nextSummaries;
            window.MemorySync?.schedule(bindingId);
        }
        return saved;
    }

    function getRelevantFragmentMatches(bindingId, query, limit = 3, turnId = '') {
        const queryTerms = new Set(createTextTerms(query));
        const queryVector = createLocalMemoryVector(query);
        if (queryTerms.size === 0 && !getVectorValues(queryVector)) return [];
        const maxItems = Math.max(1, Math.min(Number(limit) || 3, 4));
        const now = Date.now();
        let upgradedVectorIndex = false;
        const matches = cachedMemoryItems
            .filter((item) => item && item.bindingId === bindingId && item.tier === 'L3' && item.kind === 'fragment' && item.status === 'active')
            .map((item) => {
                const terms = Array.isArray(item.keywords) ? item.keywords : createTextTerms(item.content);
                const matchedTerms = terms.filter((term) => queryTerms.has(term));
                const hadVector = Boolean(getVectorValues(item.vectorIndex));
                const vectorSimilarity = cosineSimilarity(queryVector, ensureLocalVector(item));
                if (!hadVector) upgradedVectorIndex = true;
                const stats = item.retrievalStats || {};
                const lastInjectedAt = Date.parse(stats.lastInjectedAt || '');
                const retentionScore = getMemoryRetentionScore(item, now);
                const authorityScore = item.authority === 'user_confirmed' ? 4 : 1;
                const priorityScore = getRetrievalPriority(item);
                const repeatPenalty = Math.min(4, Math.floor(getRetrievalCount(item) / 3));
                const inCooldown = Number.isFinite(lastInjectedAt) && now - lastInjectedAt < RETRIEVAL_COOLDOWN_MS;
                const vectorScore = vectorSimilarity >= VECTOR_MIN_SIMILARITY ? Math.round(vectorSimilarity * 12) : 0;
                const score = matchedTerms.length * 8 + vectorScore + retentionScore + authorityScore + priorityScore - repeatPenalty;
                const reasons = [
                    matchedTerms.length ? '命中 ' + matchedTerms.slice(0, 3).join('、') : '',
                    vectorScore ? '向量相似 ' + Math.round(vectorSimilarity * 100) + '%' : '',
                    getMemoryRetentionReason(item, now),
                    priorityScore === RETRIEVAL_PRIORITY.pinned ? '已置顶' : '',
                    priorityScore === RETRIEVAL_PRIORITY.low ? '降低优先级' : '',
                    inCooldown ? '冷却中' : ''
                ].filter(Boolean);
                return { item, score, reasons, inCooldown, vectorSimilarity, hasSignal: matchedTerms.length > 0 || vectorScore > 0 };
            })
            .filter(({ score, inCooldown, hasSignal }) => score > 0 && hasSignal && !inCooldown)
            .sort((left, right) => right.score - left.score || String(right.item.createdAt || '').localeCompare(String(left.item.createdAt || '')))
            .slice(0, maxItems)
            .filter(({ item }) => normalizeMemoryText(item.content).length <= 220)
            .map(({ item, score, reasons, vectorSimilarity }) => ({ id: item.id, content: normalizeMemoryText(item.content), score, reasons, vectorSimilarity }));
        if (upgradedVectorIndex && matches.length === 0) {
            void writeRecord({ id: MEMORY_ITEMS_KEY, schemaVersion: MEMORY_SCHEMA_VERSION, items: cachedMemoryItems });
        }
        return matches;
    }

    function recordFragmentInjection(matches, turnId = '') {
        const matchById = new Map((Array.isArray(matches) ? matches : []).map((match) => [match && match.id, match]).filter(([id]) => Boolean(id)));
        if (matchById.size === 0) return;
        const now = new Date().toISOString();
        const nextItems = cachedMemoryItems.map((item) => {
            const match = matchById.get(item && item.id);
            if (!match) return item;
            const previousStats = item.retrievalStats || {};
            return {
                ...item,
                retrievalStats: {
                    ...previousStats,
                    injectedCount: getRetrievalCount(item) + 1,
                    lastInjectedAt: now,
                    lastRetrievedAt: now,
                    lastInjectedTurn: String(turnId || ''),
                    lastScore: match.score,
                    lastVectorSimilarity: Number(match.vectorSimilarity) || 0,
                    lastReasons: Array.isArray(match.reasons) ? match.reasons.slice(0, 4) : []
                }
            };
        });
        cachedMemoryItems = nextItems;
        // The prompt is already assembled. Persist observability without delaying the chat request.
        void writeRecord({ id: MEMORY_ITEMS_KEY, schemaVersion: MEMORY_SCHEMA_VERSION, items: nextItems });
    }

    function getRelevantFragments() {
        return [];
    }

        function getRetrievalStatus(bindingId = selectedContactId) {
        return {
            bindingId,
            mode: 'curated-memory',
            chatEnabled: false,
            localVectorEnabled: false,
            localVectorCount: 0,
            semanticReady: false,
            semanticStatus: 'disabled',
            semanticRuntimeStatus: 'disabled',
            semanticRuntimeMode: 'disabled',
            embeddingBackend: 'disabled',
            embeddingModel: '',
            semanticVectorCount: 0,
            fragmentCount: 0
        };
    }

        async function getSemanticFragmentMatches(bindingId, query, limit = 3) {
        const queryVector = getSemanticVectorValues(await window.SemanticMemory.embed(query));
        if (!queryVector) return [];
        const queryTerms = new Set(createTextTerms(query));
        const maxItems = Math.max(1, Math.min(Number(limit) || 3, 4));
        const now = Date.now();
        return cachedMemoryItems
            .filter((item) => item && item.bindingId === bindingId && item.tier === 'L3' && item.kind === 'fragment' && item.status === 'active')
            .map((item) => {
                const semanticSimilarity = semanticCosineSimilarity(queryVector, getSemanticVectorValues(item.semanticVector));
                const terms = Array.isArray(item.keywords) ? item.keywords : createTextTerms(item.content);
                const matchedTerms = terms.filter((term) => queryTerms.has(term));
                const localSimilarity = cosineSimilarity(createLocalMemoryVector(query), ensureLocalVector(item));
                const stats = item.retrievalStats || {};
                const lastInjectedAt = Date.parse(stats.lastInjectedAt || '');
                const retentionScore = getMemoryRetentionScore(item, now);
                const authorityScore = item.authority === 'user_confirmed' ? 4 : 1;
                const priorityScore = getRetrievalPriority(item);
                const repeatPenalty = Math.min(4, Math.floor(getRetrievalCount(item) / 3));
                const inCooldown = Number.isFinite(lastInjectedAt) && now - lastInjectedAt < RETRIEVAL_COOLDOWN_MS;
                const semanticScore = semanticSimilarity >= SEMANTIC_MIN_SIMILARITY ? Math.round(semanticSimilarity * 22) : 0;
                const localScore = localSimilarity >= VECTOR_MIN_SIMILARITY ? Math.round(localSimilarity * 6) : 0;
                const score = semanticScore + localScore + matchedTerms.length * 8 + retentionScore + authorityScore + priorityScore - repeatPenalty;
                const reasons = [
                    semanticScore ? '语义相似 ' + Math.round(semanticSimilarity * 100) + '%' : '',
                    matchedTerms.length ? '命中 ' + matchedTerms.slice(0, 3).join('、') : '',
                    getMemoryRetentionReason(item, now),
                    priorityScore === RETRIEVAL_PRIORITY.pinned ? '已置顶' : '',
                    inCooldown ? '冷却中' : ''
                ].filter(Boolean);
                return { item, score, reasons, inCooldown, semanticSimilarity, vectorSimilarity: localSimilarity, hasSignal: semanticScore > 0 || matchedTerms.length > 0 };
            })
            .filter(({ score, inCooldown, hasSignal, item }) => score > 0 && hasSignal && !inCooldown && normalizeMemoryText(item.content).length <= 220)
            .sort((left, right) => right.score - left.score || String(right.item.createdAt || '').localeCompare(String(left.item.createdAt || '')))
            .slice(0, maxItems)
            .map(({ item, score, reasons, semanticSimilarity, vectorSimilarity }) => ({ id: item.id, content: normalizeMemoryText(item.content), score, reasons, semanticSimilarity, vectorSimilarity }));
    }

    async function getRelevantFragmentsAsync() {
        return [];
    }

        async function setMemoryRetrievalPriority(itemId, priority) {
        const item = cachedMemoryItems.find((memory) => memory && memory.id === itemId && memory.bindingId === selectedContactId && memory.status === 'active' && memory.tier === 'L3');
        if (!item || !Object.values(RETRIEVAL_PRIORITY).includes(priority)) return false;
        const now = new Date().toISOString();
        const nextItems = cachedMemoryItems.map((memory) => memory.id === itemId ? {
            ...memory,
            retrievalPriority: priority,
            pinned: priority === RETRIEVAL_PRIORITY.pinned,
            revision: Math.max(1, Number(memory.revision) || 1) + 1,
            updatedAt: now
        } : memory);
        const saved = await writeRecord({ id: MEMORY_ITEMS_KEY, schemaVersion: MEMORY_SCHEMA_VERSION, items: nextItems });
        if (saved) {
            cachedMemoryItems = nextItems;
            render();
            window.MemorySync?.schedule(selectedContactId);
        }
        return saved;
    }

    function runRetrievalEvaluation() {
        const originalItems = cachedMemoryItems;
        const now = new Date().toISOString();
        const oldDate = new Date(Date.now() - 60 * 86400000).toISOString();
        const fixture = (id, bindingId, content, extras = {}) => hydrateMemoryItem({
            id, bindingId, content, kind: 'fragment', tier: 'L3', status: 'active', authority: 'user_quote',
            keywords: ['coffee'], createdAt: now, updatedAt: now, sourceRefs: [], ...extras
        });
        cachedMemoryItems = [
            fixture('plain', 'role-a', 'coffee at the corner shop'),
            fixture('vector-only', 'role-a', 'coffee with no lexical index', { keywords: [] }),
            fixture('pinned', 'role-a', 'coffee from the usual cafe', { retrievalPriority: RETRIEVAL_PRIORITY.pinned }),
            fixture('other-role', 'role-b', 'coffee for another role', { retrievalPriority: RETRIEVAL_PRIORITY.pinned }),
            fixture('archived', 'role-a', 'archived coffee', { status: 'archived', retrievalPriority: RETRIEVAL_PRIORITY.pinned }),
            fixture('cooling', 'role-a', 'coffee just used', { retrievalStats: { injectedCount: 1, lastInjectedAt: now } }),
            fixture('old', 'role-a', 'an unrelated memory from a long time ago', { keywords: [], createdAt: oldDate, updatedAt: oldDate }),
            fixture('old-stable', 'role-a', 'an unrelated stable preference', { keywords: [], createdAt: oldDate, updatedAt: oldDate, lifecycle: { kind: 'stable', state: 'open' } }),
            fixture('old-confirmed', 'role-a', 'an unrelated explicitly confirmed memory', { keywords: [], createdAt: oldDate, updatedAt: oldDate, authority: 'user_confirmed' })
        ];
        try {
            const matches = getRelevantFragmentMatches('role-a', 'coffee', 8);
            const ids = matches.map((match) => match.id);
            const retentionFixtures = cachedMemoryItems.filter((item) => item.id.startsWith('old'));
            const oldRetention = getMemoryRetention(retentionFixtures.find((item) => item.id === 'old'), Date.now());
            const stableRetention = getMemoryRetention(retentionFixtures.find((item) => item.id === 'old-stable'), Date.now());
            const confirmedRetention = getMemoryRetention(retentionFixtures.find((item) => item.id === 'old-confirmed'), Date.now());
            const cases = [
                { name: '角色隔离', pass: !ids.includes('other-role') },
                { name: '归档不召回', pass: !ids.includes('archived') },
                { name: '冷却不重复', pass: !ids.includes('cooling') },
                { name: '置顶优先', pass: ids[0] === 'pinned' },
                { name: '向量召回', pass: ids.includes('vector-only') },
                { name: '艾宾浩斯曲线连续衰减', pass: oldRetention < 0.02 },
                { name: '稳定事实衰减更慢', pass: stableRetention > oldRetention },
                { name: '用户确认衰减更慢', pass: confirmedRetention > oldRetention }
            ];
            return { passed: cases.every((entry) => entry.pass), cases };
        } finally {
            cachedMemoryItems = originalItems;
        }
    }

    function runMemoryLifecycleEvaluation() {
        const originalItems = cachedMemoryItems;
        const now = new Date().toISOString();
        cachedMemoryItems = [
            hydrateMemoryItem({ id: 'old-cycle', bindingId: 'role-a', content: '我现在正处于生理期', kind: 'memory', tier: 'L1', status: 'superseded', authority: 'user_quote', keywords: createTextTerms('我现在正处于生理期'), createdAt: now, updatedAt: now }),
            hydrateMemoryItem({ id: 'closed-cycle', bindingId: 'role-a', content: '生理期已经过了', kind: 'memory', tier: 'L1', status: 'active', authority: 'user_quote', lifecycle: { kind: 'event', state: 'closed' }, keywords: createTextTerms('生理期已经过了'), createdAt: now, updatedAt: now }),
            hydrateMemoryItem({ id: 'stable-preference', bindingId: 'role-a', content: '我一直喜欢喝热可可', kind: 'memory', tier: 'L1', status: 'active', authority: 'user_quote', lifecycle: { kind: 'stable', state: 'open' }, keywords: createTextTerms('我一直喜欢喝热可可'), createdAt: now, updatedAt: now })
        ];
        try {
            const unrelated = getPromptMemories('role-a', 6, '今天看了一部电影');
            const related = getPromptMemories('role-a', 6, '生理期还难受吗');
            const cases = [
                { name: '相关话题注入状态更正', pass: related.includes('状态已更新：生理期已经过了') },
                { name: '无关话题不召回旧事件', pass: !unrelated.includes('我现在正处于生理期') },
                { name: '稳定事实保留', pass: unrelated.includes('我一直喜欢喝热可可') }
            ];
            return { passed: cases.every((entry) => entry.pass), cases };
        } finally {
            cachedMemoryItems = originalItems;
        }
    }

    function runMemorySupersessionEvaluation() {
        const now = new Date().toISOString();
        const previous = hydrateMemoryItem({ id: 'old-cycle', bindingId: 'role-a', content: '我正在生理期', kind: 'memory', tier: 'L1', status: 'active', authority: 'user_quote', keywords: createTextTerms('我正在生理期'), createdAt: now, updatedAt: now });
        const result = supersedeConflictingEvents([previous], 'role-a', '生理期已经过了', 'new-cycle', now);
        return {
            passed: result[0]?.status === 'superseded' && result[0]?.supersededBy === 'new-cycle' && previous.status === 'active',
            cases: [
                { name: '结束状态替代旧事件', pass: result[0]?.status === 'superseded' },
                { name: '替代操作不改写原缓存', pass: previous.status === 'active' }
            ]
        };
    }

    function isDeletedMemoryCandidate(bindingId, content, sourceIds) {
        const normalized = normalizeMemoryText(content).toLocaleLowerCase();
        return cachedMemoryItems.some(item => item?.bindingId === bindingId && item.status === 'archived'
            && item.archiveReason === 'user_deleted'
            && (!item.content && item.deletionFingerprint !== undefined ? item.deletionFingerprint === hashVectorToken(normalized) : normalizeMemoryText(item.content).toLocaleLowerCase() === normalized)
            && (item.sourceRefs || []).some(ref => (sourceIds || []).map(String).includes(String(ref.messageId))));
    }

    function getEffectiveAnalysisSummary(bindingId) {
        return [getActiveSummary(bindingId), ...getChapterSummaries(bindingId)]
            .filter(summary => summary?.archiveAnalysis && summary.status === 'active')
            .sort((left, right) => getSummarySortTime(right) - getSummarySortTime(left))
            .map(summary => ({ ...summary, archiveAnalysis: { ...summary.archiveAnalysis,
                importantMemories: (summary.archiveAnalysis.importantMemories || []).filter(entry => !isDeletedMemoryCandidate(bindingId, entry.content, entry.sourceMessageIds)),
                experiences: (summary.archiveAnalysis.experiences || []).filter(entry => !isDeletedMemoryCandidate(bindingId, entry.content, entry.sourceMessageIds)),
                openLoops: (summary.archiveAnalysis.openLoops || []).filter(entry => !isDeletedMemoryCandidate(bindingId, entry.content, entry.sourceMessageIds))
            } }))[0] || null;
    }

    function getSummaryJob(bindingId, messages, options = {}) {
        const force = options && options.force === true;
        const selectedMessageIds = new Set(Array.isArray(options && options.sourceMessageIds) ? options.sourceMessageIds.map(String) : []);
        const providedMessages = Array.isArray(options && options.sourceMessages) ? options.sourceMessages : [];
        const isManualSelection = providedMessages.length > 0 || selectedMessageIds.size > 0;
        const pool = providedMessages.length ? providedMessages
            : (Array.isArray(messages) && messages.length ? messages : getContactMessages(bindingId));
        const allSourceMessages = pool
            .map((message, index) => normalizeConversationMessage(message, index, bindingId))
            .filter(Boolean)
            .map((message, index, list) => ({
                id: String(message.id),
                type: message.type,
                text: normalizeMemoryText(message.text),
                time: resolveSummaryMessageTime(message, index, list)
            }));

        if (providedMessages.length) {
            if (!allSourceMessages.length) return null;
        } else if (selectedMessageIds.size) {
            const selectedMessages = allSourceMessages.filter((message) => selectedMessageIds.has(message.id));
            if (!selectedMessages.length) return null;
            allSourceMessages.splice(0, allSourceMessages.length, ...selectedMessages);
        } else {
            const coveredIds = getCoveredChapterMessageIds(bindingId);
            const uncoveredMessages = allSourceMessages.filter((message) => !coveredIds.has(message.id));
            if (uncoveredMessages.length) allSourceMessages.splice(0, allSourceMessages.length, ...uncoveredMessages);
            else if (coveredIds.size) return null;
        }
        if (!allSourceMessages.length) return null;

        const previous = getActiveSummary(bindingId);
        let unprocessedMessages = allSourceMessages;
        if (previous && !isManualSelection) {
            const lastProcessedIndex = allSourceMessages.findIndex((message) => message.id === String(previous.lastProcessedMessageId || ''));
            if (lastProcessedIndex >= 0) {
                unprocessedMessages = allSourceMessages.slice(lastProcessedIndex + 1);
            } else {
                const previousSourceIds = new Set(Array.isArray(previous.sourceMessageIds) ? previous.sourceMessageIds.map(String) : []);
                unprocessedMessages = allSourceMessages.filter((message) => !previousSourceIds.has(message.id));
            }
            // A manual refresh may rebuild the working summary even without new chat turns.
            if (force && !unprocessedMessages.length) {
                const previousSourceIds = new Set((previous.sourceMessageIds || []).map(String));
                unprocessedMessages = allSourceMessages.filter(message => previousSourceIds.has(message.id));
            }
        }

        const newTurnCount = countConversationTurns(unprocessedMessages);
        const contextMessageLimit = Math.max(0, Number(options?.contextMessageLimit) || 0);
        const boundaryPressure = !force && !isManualSelection && !summaryIntervalUserConfigured
            && contextMessageLimit > 0
            && unprocessedMessages.length >= Math.max(6, Math.floor(contextMessageLimit * 0.8));
        if (!force && !isManualSelection && newTurnCount < summaryIntervalMessages && !boundaryPressure) return null;

        // One trigger covers the entire pending or explicitly selected range in one request.
        const sourceMessages = isManualSelection ? allSourceMessages : unprocessedMessages;
        if (!sourceMessages.length) return null;

        const chapters = getChapterSummaries(bindingId);

        return {
            id: 'summary_job_' + bindingId + '_' + sourceMessages[sourceMessages.length - 1].id + (force ? '_manual_' + Date.now() : ''),
            bindingId,
            accountId: getDynamicUserId(),
            summaryStateVersion: summaryBindingVersion(cachedSummaries, bindingId),
            sourceMessages,
            analyzedTurnCount: countConversationTurns(sourceMessages),
            manualRange: isManualSelection,
            autoConfirm: !force && !isManualSelection,
            lastProcessedMessageId: sourceMessages[sourceMessages.length - 1].id,
            previousSummary: (previous || chapters.length) ? {
                id: previous && previous.id || chapters[chapters.length - 1].id,
                text: getCurrentPromptSummary(bindingId)
            } : null,
            previousArchiveAnalysis: getEffectiveAnalysisSummary(bindingId)?.archiveAnalysis || null,
            minimumLength: 1
        };
    }

    function updateSummaryRequest(job, completed = false, options = {}) {
        if (job.signal?.aborted && !completed && !options.failed) return Promise.reject(job.signal.reason);
        const accountId = job.accountId || getDynamicUserId();
        const key = 'memorySummaryRequestV1_' + job.bindingId + '_' + accountId;
        // Persist before sending so reloads and new chat turns cannot silently retry a paid request.
        return new Promise((resolve, reject) => {
            const request = indexedDB.open(DB_NAME);
            request.onerror = () => reject(new Error('SUMMARY_REQUEST_GUARD_FAILED'));
            request.onsuccess = () => {
                const database = request.result;
                if (!database.objectStoreNames.contains(STORE_NAME)) {
                    database.close();
                    reject(new Error('SUMMARY_REQUEST_GUARD_FAILED'));
                    return;
                }
                let allowed = false;
                const transaction = database.transaction(STORE_NAME, 'readwrite');
                const store = (window.CharacterRecordCleanup?.wrap(transaction.objectStore(STORE_NAME)) || transaction.objectStore(STORE_NAME));
                const read = store.get(key);
                read.onsuccess = () => {
                    if (job.signal?.aborted && !completed && !options.failed) { transaction.abort(); return; }
                    const previous = read.result;
                    const heartbeat = options && options.heartbeat === true;
                    if (!heartbeat && !completed && !options.failed && job.autoConfirm && previous?.status === 'complete' && previous.requestId === job.id) return;
                    if (heartbeat) {
                        // Only refresh the guard this page still owns; never resurrect a
                        // completed or taken-over request.
                        if (previous?.status !== 'pending' || previous.requestId !== job.id) return;
                    } else if (completed && previous?.requestId !== job.id) return;
                    const sameOwner = previous?.requestId === job.id && previous?.sessionId === summaryRequestSessionId;
                    if ((heartbeat || completed || options.failed) && !sameOwner) return;
                    if (options.failed && previous?.status !== 'pending') return;
                    if (!heartbeat && !completed && !options.failed && (previous?.status === 'pending' || previous?.status === 'uncertain')) {
                        const heartbeatAt = Date.parse(previous.heartbeatAt || previous.updatedAt || '');
                        const stillRunning = previous.status === 'pending' && (!Number.isFinite(heartbeatAt) || Date.now() - heartbeatAt < 60000);
                        // Only an explicit manual retry may replace an unresolved paid request.
                        if (job.autoConfirm || stillRunning) return;
                    }
                    const now = new Date().toISOString();
                    store.put({ id: key, requestId: job.id, status: completed ? 'complete' : options.failed ? 'uncertain' : 'pending', sessionId: summaryRequestSessionId, sourceMessageIds: (job.sourceMessages || []).map(message => String(message.id)), heartbeatAt: now, updatedAt: now });
                    allowed = true;
                };
                transaction.oncomplete = () => { database.close(); if (allowed && !completed && !options.heartbeat && !options.failed) job.requestStarted = true; resolve(allowed); };
                transaction.onerror = transaction.onabort = () => {
                    database.close();
                    reject(job.signal?.reason || new Error('SUMMARY_REQUEST_GUARD_FAILED'));
                };
            };
        });
    }

    function getSummaryRequestState(bindingId, accountId) {
        if (!bindingId) return Promise.resolve(null);
        const ownerId = accountId || getDynamicUserId();
        const key = 'memorySummaryRequestV1_' + bindingId + '_' + ownerId;
        return new Promise((resolve) => {
            const request = indexedDB.open(DB_NAME);
            request.onerror = () => resolve(null);
            request.onsuccess = () => {
                const database = request.result;
                if (!database.objectStoreNames.contains(STORE_NAME)) { database.close(); resolve(null); return; }
                const transaction = database.transaction(STORE_NAME, 'readonly');
                const store = (window.CharacterRecordCleanup?.wrap(transaction.objectStore(STORE_NAME)) || transaction.objectStore(STORE_NAME));
                const read = store.get(key);
                read.onsuccess = () => resolve(read.result || null);
                read.onerror = () => resolve(null);
                transaction.oncomplete = transaction.onerror = transaction.onabort = () => database.close();
            };
        });
    }

        function hasVerifiedMilestone(bindingId, value) {
        const milestones = ['恋人', '分手', '复合', '同居', '订婚', '结婚', '怀孕', '患病', '创伤'];
        const matched = milestones.filter((milestone) => value.includes(milestone));
        if (matched.length === 0) return true;
        const messages = cachedConversations && cachedConversations[bindingId];
        const contact = cachedContacts.find((item) => item && item.id === bindingId);
        const numericMessageIds = Array.isArray(messages)
            ? messages.filter((message) => /^\d+$/.test(String(message && (message.id || message.msgId || message.localId) || ''))).length
            : 0;
        const isConvertedHistory = Array.isArray(messages)
            && messages.length > 0
            && numericMessageIds / messages.length >= 0.9
            && String(contact?.id || '').startsWith('char_contact_')
            && String(contact?.linkedContactId || '').startsWith('contact_');
        if (isConvertedHistory) return true;
        const facts = cachedMemoryItems.filter((item) => item && item.bindingId === bindingId && item.tier === 'L1' && item.status === 'active')
            .filter((item) => item.authority === 'user_confirmed' || item.authority === 'user_quote');
        return matched.every((milestone) => facts.some((item) => String(item.content || '').includes(milestone)));
    }

    function normalizeArchiveAnalysis(value, validSourceIds = null) {
        const source = value && typeof value === 'object' ? value : {};
        const validSet = validSourceIds instanceof Set ? validSourceIds : null;
        const normalizeIds = (ids) => Array.from(new Set((Array.isArray(ids) ? ids : [])
            .map(String)
            .filter((id) => !validSet || validSet.has(id))));
        const normalizeEntry = (entry, maxLength = 420) => {
            if (typeof entry === 'string') {
                const content = normalizeMemoryText(entry).slice(0, maxLength);
                return content ? { content, sourceMessageIds: [] } : null;
            }
            if (!entry || typeof entry !== 'object') return null;
            const content = normalizeMemoryText(entry.content || entry.text).slice(0, maxLength);
            if (!content) return null;
            return { ...entry, content, sourceMessageIds: normalizeIds(entry.sourceMessageIds) };
        };
        const importantMemories = (Array.isArray(source.importantMemories) ? source.importantMemories : [])
            .slice(0, 10)
            .map((entry) => normalizeEntry(entry, 300))
            .filter(Boolean)
            .map((entry) => ({
                ...entry,
                type: ['fact', 'preference', 'habit', 'relationship', 'promise', 'plan'].includes(String(entry.type || ''))
                    ? String(entry.type)
                    : 'fact',
                subject: ['user', 'character', 'shared'].includes(String(entry.subject || ''))
                    ? String(entry.subject)
                    : 'user'
            }));
        const cognitionSource = source.cognition && typeof source.cognition === 'object' ? source.cognition : {};
        const cognition = {
            identity: normalizeMemoryText(cognitionSource.identity).slice(0, 320),
            preference: normalizeMemoryText(
                Array.isArray(cognitionSource.preferences)
                    ? cognitionSource.preferences.join('；')
                    : (cognitionSource.preference || cognitionSource.preferences)
            ).slice(0, 420),
            relationship: normalizeMemoryText(cognitionSource.relationship).slice(0, 420)
        };
        const experiences = (Array.isArray(source.experiences) ? source.experiences : [])
            .slice(0, 8)
            .map((entry) => normalizeEntry(entry, 520))
            .filter(Boolean)
            .map((entry) => ({ ...entry, time: String(entry.time || '').slice(0, 80) }));
        const openLoops = (Array.isArray(source.openLoops) ? source.openLoops : [])
            .slice(0, 6)
            .map((entry) => normalizeEntry(entry, 360))
            .filter(Boolean)
            .map((entry) => ({
                ...entry,
                actor: ['user', 'character', 'shared'].includes(String(entry.actor || '')) ? String(entry.actor) : 'shared',
                dueAt: String(entry.dueAt || '').slice(0, 80)
            }));
        const characterViewSource = source.characterView && typeof source.characterView === 'object'
            ? source.characterView
            : {};
        const characterView = {
            overall: normalizeMemoryText(characterViewSource.overall).slice(0, 700),
            personality: normalizeMemoryText(characterViewSource.personality).slice(0, 700),
            interaction: normalizeMemoryText(characterViewSource.interaction).slice(0, 700),
            emotion: normalizeMemoryText(characterViewSource.emotion).slice(0, 700),
            stillLearning: normalizeMemoryText(characterViewSource.stillLearning).slice(0, 700)
        };
        const hasContent = importantMemories.length
            || cognition.identity
            || cognition.preference
            || cognition.relationship
            || experiences.length
            || openLoops.length
            || characterView.overall
            || characterView.personality
            || characterView.interaction
            || characterView.emotion
            || characterView.stillLearning;
        return hasContent ? { version: 2, importantMemories, cognition, experiences, openLoops, characterView } : null;
    }

    async function completeSummary(job, candidate) {
        if (!job || !job.bindingId) throw new Error('SUMMARY_JOB_INVALID');
        if (job.signal?.aborted) throw job.signal.reason;
        if (!candidate || !Array.isArray(candidate.sections)) throw new Error('SUMMARY_CANDIDATE_INVALID');
        if (job.accountId && job.accountId !== getDynamicUserId()) throw new Error('SUMMARY_ACCOUNT_CHANGED');
        if (job.sourceMessages.some((message) => invalidatedSourceIds.has(scopedSourceKey(job.bindingId, message.id)))) throw new Error('SUMMARY_SOURCE_INVALIDATED');
        const previous = getActiveSummary(job.bindingId);
        if (job.autoConfirm || job.signal) {
            let liveGroupMessages = null;
            if (job.sourceType === 'group') {
                const key = 'wechatGroupMessages_' + job.accountId + '::' + job.groupId;
                const records = await readRecords([key], { exact: true });
                liveGroupMessages = Array.isArray(records[key]?.messages) ? records[key].messages
                    .filter(message => !message.recalled && message.includeInContext !== false && message.senderId !== 'system')
                    .map(message => ({ ...message, type: message.senderId === 'user' ? 'sent' : 'received',
                        text: '[' + String(message.senderName || '成员') + '] ' + String(message.text || '').slice(0, 1200) })) : null;
            } else {
                await refreshConversationCache();
            }
            if (job.signal?.aborted) throw job.signal.reason;
            if (job.accountId && job.accountId !== getDynamicUserId()) throw new Error('SUMMARY_ACCOUNT_CHANGED');
            const liveMessages = job.sourceType === 'group' ? liveGroupMessages : cachedConversations?.[job.bindingId];
            if (!Array.isArray(liveMessages)) throw new Error('SUMMARY_SOURCE_INVALIDATED');
            const byId = new Map(liveMessages
                .map((message, index) => normalizeConversationMessage(message, index, job.bindingId))
                .filter(Boolean)
                .map((message) => [String(message.id), message]));
            if (job.sourceMessages.some((message) => {
                const live = byId.get(String(message.id));
                return !live || live.type !== message.type || normalizeMemoryText(live.text ?? live.content ?? live.message ?? live.body) !== normalizeMemoryText(message.text);
            })) throw new Error('SUMMARY_SOURCE_INVALIDATED');
        }
        // A section may only cite messages present in this generation input.
        // Previous summaries provide context, but are never evidence for a new revision.
        const validSourceIds = new Set(job.sourceMessages.map((message) => String(message.id)));
        const archiveAnalysisCandidate = normalizeArchiveAnalysis(candidate.archiveAnalysis, validSourceIds);
        let sectionInputs = candidate.sections;
        if (sectionInputs.length > 1) {
            // Preserve every returned period in the existing single-section record/UI.
            // Multiple sections in one response are never separate API requests.
            const content = sectionInputs.map(section => {
                const body = formatSummaryBody(section?.content);
                if (!body) throw new Error('SUMMARY_CONTENT_EMPTY');
                const title = normalizeMemoryText(section?.title);
                return [title, body].filter(Boolean).join('\n');
            }).join('\n\n');
            sectionInputs = [{
                ...sectionInputs[0],
                content,
                sourceMessageIds: sectionInputs.flatMap(section => Array.isArray(section?.sourceMessageIds) ? section.sourceMessageIds : []),
                details: Object.fromEntries(['events', 'characterEmotion', 'userState', 'relationshipChange', 'openLoops'].map(key => [
                    key, sectionInputs.map(section => formatSummaryBody(section?.details?.[key])).filter(Boolean).join('\n')
                ]))
            }];
        }
        const sections = sectionInputs.map((section) => {
            const content = formatSummaryBody(section && section.content);
            const rawDetails = section && section.details && typeof section.details === 'object' ? section.details : {};
            const details = {
                events: formatSummaryBody(rawDetails.events),
                characterEmotion: formatSummaryBody(rawDetails.characterEmotion),
                userState: formatSummaryBody(rawDetails.userState),
                relationshipChange: formatSummaryBody(rawDetails.relationshipChange),
                openLoops: formatSummaryBody(rawDetails.openLoops)
            };
            const reportedSourceIds = (Array.isArray(section && section.sourceMessageIds) ? section.sourceMessageIds : []).map(String);
            const validReportedIds = reportedSourceIds.filter((id) => validSourceIds.has(id));
            const sourceMessageIds = validReportedIds.length
                ? Array.from(new Set(validReportedIds))
                : Array.from(validSourceIds);
            if (!content) throw new Error('SUMMARY_CONTENT_EMPTY');
            if (content.length < (Number(job.minimumLength) || 1)) throw new Error('SUMMARY_CONTENT_TOO_SHORT');
            if (content.length > MAX_SUMMARY_LENGTH) throw new Error('SUMMARY_CONTENT_TOO_LONG');
            if (sourceMessageIds.length === 0) throw new Error('SUMMARY_SOURCE_MISSING');
            // Narrative summaries include denials and hypotheticals; keyword checks are not a reason to discard them.
            return {
                title: normalizeMemoryText(section && section.title).slice(0, 20) || '近况',
                content,
                details,
                timeRange: {
                    start: job.sourceMessages[0] && job.sourceMessages[0].time || '',
                    end: job.sourceMessages[job.sourceMessages.length - 1] && job.sourceMessages[job.sourceMessages.length - 1].time || ''
                },
                sourceMessageIds
            };
        }).filter(Boolean);
        if (sections.length === 0) throw new Error('SUMMARY_SECTION_INVALID');

        const now = new Date().toISOString();
        // This is input provenance for scheduling, not proof of semantic coverage in the narrative.
        // Keep section citations specific and do not auto-repeat a paid request to fill possible omissions.
        const sourceMessageIds = Array.from(new Set(job.sourceMessages.map((message) => String(message.id))));
        const priorHistory = previous ? [{
            revision: previous.revision,
            sections: previous.sections,
            sourceMessageIds: previous.sourceMessageIds,
            updatedAt: previous.updatedAt
        }, ...(Array.isArray(previous.history) ? previous.history : [])] : [];
        const nextSummary = {
            id: previous ? previous.id : 'summary_' + job.bindingId + '_' + Date.now() + '_' + Math.random().toString(36).slice(2, 8),
            schemaVersion: MEMORY_SCHEMA_VERSION,
            bindingId: job.bindingId,
            slot: 'working',
            tier: 'L2',
            status: 'active',
            revision: (previous && Number(previous.revision) || 0) + 1,
            sourceMessageIds,
            sourceSnapshots: job.sourceMessages.map((message) => ({
                id: String(message.id),
                type: message.type === 'sent' ? 'sent' : 'received',
                text: normalizeMemoryText(message.text),
                time: message.time || '',
                createdAt: message.time || ''
            })),
            lastProcessedMessageId: job.lastProcessedMessageId,
            inputHash: sourceMessageIds.join('|'),
            sections,
            archiveAnalysis: archiveAnalysisCandidate
                ? { ...archiveAnalysisCandidate, updatedAt: now }
                : (previous?.archiveAnalysis || null),
            history: priorHistory.slice(0, 20),
            createdAt: previous ? previous.createdAt : now,
            updatedAt: now
        };
        const existingContents = new Set(cachedMemoryItems
            .filter((item) => item && item.bindingId === job.bindingId && item.status === 'active')
            .map((item) => normalizeMemoryText(item.content).toLocaleLowerCase()));
        const analyzedImportantMemories = nextSummary.archiveAnalysis?.importantMemories?.length
            ? nextSummary.archiveAnalysis.importantMemories
            : (Array.isArray(candidate.memories) ? candidate.memories : []);
        const summaryMemories = analyzedImportantMemories
            .slice(0, 10)
            .map((memory) => {
                const content = normalizeMemoryText(memory && memory.content).slice(0, 300);
                const memorySourceIds = Array.from(new Set((Array.isArray(memory && memory.sourceMessageIds) ? memory.sourceMessageIds : [])
                    .map(String)
                    .filter((id) => validSourceIds.has(id))));
                if (!content || !memorySourceIds.length || isSensitiveAutomaticMemory(content)) return null;
                // Keep the existing confirmation requirement for derived hard facts only.
                if (!hasVerifiedMilestone(job.bindingId, content)) return null;
                const normalizedContent = content.toLocaleLowerCase();
                if (existingContents.has(normalizedContent)) return null;
                if (isDeletedMemoryCandidate(job.bindingId, content, memorySourceIds)) return null;
                existingContents.add(normalizedContent);
                return {
                    id: 'memory_summary_' + Date.now() + '_' + Math.random().toString(36).slice(2, 8),
                    schemaVersion: MEMORY_SCHEMA_VERSION,
                    bindingId: job.bindingId,
                    kind: 'memory',
                    tier: 'L1',
                    status: 'active',
                    authority: 'summary_verified',
                    visibility: 'current_binding',
                    content,
                    memoryType: ['fact', 'preference', 'habit', 'relationship', 'promise', 'plan'].includes(String(memory?.type || ''))
                        ? String(memory.type)
                        : 'fact',
                    subjectType: String(memory?.subject || '') === 'character'
                        ? 'character'
                        : (String(memory?.subject || '') === 'shared' ? 'shared' : 'user_persona'),
                    sourceRefs: memorySourceIds.map((messageId) => ({ type: 'summary_source', messageId, summaryId: nextSummary.id, createdAt: now })),
                    revision: 1,
                    retrievalStats: { injectedCount: 0, lastInjectedAt: '', lastInjectedTurn: '', lastScore: 0, lastReasons: [] },
                    createdAt: now,
                    updatedAt: now
                };
            })
            .filter(Boolean);
        const autoConfirm = job.autoConfirm === true;
        const previousSourceKey = previous && Array.isArray(previous.sourceMessageIds)
            ? previous.sourceMessageIds.map(String).join('|')
            : '';
        const nextSourceKey = sourceMessageIds.map(String).join('|');
        const previousChapter = autoConfirm && previous && previousSourceKey && previousSourceKey !== nextSourceKey
            ? createSummaryChapter(previous, previous.authority || 'summary_verified', now)
            : null;
        const currentChapter = autoConfirm
            ? createSummaryChapter(nextSummary, 'summary_verified', now)
            : null;
        const nextSummaries = [
            ...cachedSummaries.filter((summary) => summary && !(summary.bindingId === job.bindingId && isWorkingSummary(summary) && ['active', 'dirty'].includes(summary.status))),
            ...(previousChapter ? [previousChapter] : []),
            ...(currentChapter ? [currentChapter] : [nextSummary])
        ];
        const nextItems = summaryMemories.length ? [...cachedMemoryItems, ...summaryMemories] : cachedMemoryItems;
        if (job.accountId && job.accountId !== getDynamicUserId()) throw new Error('SUMMARY_ACCOUNT_CHANGED');
        if (job.sourceMessages.some((message) => invalidatedSourceIds.has(scopedSourceKey(job.bindingId, message.id)))) throw new Error('SUMMARY_SOURCE_INVALIDATED');
        if (job.signal?.aborted) throw job.signal.reason;
        const saved = await writeMemoryState(nextItems, cachedOutbox, nextSummaries, {
            signal: job.signal,
            summaryGuard: job.summaryStateVersion === undefined ? null : { bindingId: job.bindingId, version: job.summaryStateVersion }
        });
        job.summarySaved = saved;
        if (saved) {
            cachedMemoryItems = nextItems;
            cachedSummaries = nextSummaries;
        }
        if (saved) window.MemorySync?.schedule(job.bindingId);
        return saved;
    }

    async function invalidateSources(bindingId, messageIds) {
        const invalidIds = new Set((Array.isArray(messageIds) ? messageIds : []).map(String).filter(Boolean));
        if (!bindingId || invalidIds.size === 0) return false;
        invalidIds.forEach((id) => invalidatedSourceIds.add(scopedSourceKey(bindingId, id)));
        let changed = false;
        const now = new Date().toISOString();
        const nextItems = cachedMemoryItems.map((item) => {
            if (!item || item.bindingId !== bindingId || item.status !== 'active') return item;
            if (!getSourceIds(item).some((id) => invalidIds.has(id))) return item;
            changed = true;
            return { ...item, status: 'archived', archiveReason: 'source_removed', updatedAt: now, revision: Math.max(1, Number(item.revision) || 1) + 1 };
        });
        const nextSummaries = cachedSummaries.map((summary) => {
            if (!summary || summary.bindingId !== bindingId || summary.status !== 'active') return summary;
            if (!Array.isArray(summary.sourceMessageIds) || !summary.sourceMessageIds.some((id) => invalidIds.has(String(id)))) return summary;
            changed = true;
            return { ...summary, status: 'dirty', updatedAt: now };
        });
        const nextOutbox = cachedOutbox
            .map((turn) => {
                if (!turn || turn.bindingId !== bindingId) return turn;
                const sourceMessages = turn.sourceMessages.filter((message) => !invalidIds.has(String(message && message.id || '')));
                if (sourceMessages.length !== turn.sourceMessages.length) changed = true;
                return sourceMessages.length ? { ...turn, sourceMessages } : null;
            })
            .filter(Boolean);
        if (!changed) return false;
        const saved = await writeMemoryState(nextItems, nextOutbox, nextSummaries);
        if (saved) {
            cachedMemoryItems = nextItems;
            cachedSummaries = nextSummaries;
            cachedOutbox = nextOutbox;
            window.MemorySync?.schedule(bindingId);
        }
        return saved;
    }

    function getPromptMemories(contactId, limit = 6, query = '') {
        const maxItems = Math.max(1, Math.min(Number(limit) || 6, 8));
        const hasQuery = Boolean(String(query || '').trim());
        return cachedMemoryItems
            .filter((item) => item && item.bindingId === contactId && item.tier === 'L1' && item.status === 'active')
            .filter((item) => item.authority === 'user_confirmed' || item.authority === 'user_quote' || item.authority === 'summary_verified')
            .map((item) => {
                const lifecycle = item.lifecycle || getMemoryLifecycle(item.content);
                const relevance = hasQuery ? getMemoryRelevanceScore(item, query) : 0;
                const explicit = item.authority === 'user_confirmed';
                const include = lifecycle.state === 'closed'
                    ? hasQuery && relevance >= 6
                    : explicit || lifecycle.kind === 'stable' || (hasQuery && lifecycle.kind === 'event' && relevance >= 6);
                return { item, lifecycle, relevance, include };
            })
            .filter(({ include }) => include)
            .sort((left, right) => (right.item.authority === 'user_confirmed') - (left.item.authority === 'user_confirmed') || right.relevance - left.relevance || String(right.item.createdAt || '').localeCompare(String(left.item.createdAt || '')))
            .map(({ item, lifecycle }) => lifecycle.state === 'closed'
                ? '状态已更新：' + normalizeMemoryText(item.content)
                : normalizeMemoryText(item.content))
            .filter((content) => content && content.length <= 180)
            .slice(0, maxItems);
    }

    function getSyncSnapshot(bindingId, scope = {}) {
        const tiers = Array.isArray(scope.tiers) && scope.tiers.length ? new Set(scope.tiers) : new Set(['L1']);
        const includeArchived = scope.includeArchived === true;
        const records = cachedMemoryItems
            .filter((item) => item && (!bindingId || item.bindingId === bindingId))
            .filter((item) => includeArchived || item.status === 'active' || ['user_deleted', 'source_removed', 'remote_deleted'].includes(item.archiveReason))
            .filter((item) => tiers.has(item.tier))
            .map((item) => ({ ...item, ...(item.status === 'archived' && item.content ? { deletionFingerprint: hashVectorToken(normalizeMemoryText(item.content).toLocaleLowerCase()) } : {}), recordType: 'memory' }));
        cachedSummaries.filter((summary) => summary && (!bindingId || summary.bindingId === bindingId) && (includeArchived || summary.status === 'active' || ['confirmed_as_chapter', 'user_deleted', 'source_removed', 'remote_deleted'].includes(summary.archiveReason)) && tiers.has('L2')).forEach((summary) => {
            records.push({ ...summary, id: summary.id, kind: 'summary', tier: 'L2', content: (summary.sections || []).map(formatSummarySection).join('\n'), recordType: 'summary' });
        });
        if (scope.includeChat === true) Object.entries(cachedConversations || {}).forEach(([contactId, messages]) => {
            if (bindingId && contactId !== bindingId) return;
            (Array.isArray(messages) ? messages : []).slice(-200).forEach((message) => records.push({ ...message, id: 'chat_' + contactId + '_' + String(message.id), localMessageId: String(message.id), bindingId: contactId, kind: 'chat', tier: 'L3', status: 'active', content: String(message.text || ''), sourceMessageId: message.id, updatedAt: message.updatedAt || message.createdAt || message.timestamp || new Date().toISOString(), recordType: 'chat' }));
        });
        return records.filter((record) => record.content || record.deletedAt || (record.status === 'archived' && record.archiveReason));
    }

    function normalizeSyncTimestamp(value) {
        if (typeof value === 'number' && Number.isFinite(value)) {
            const timestamp = value < 100000000000 ? value * 1000 : value;
            const date = new Date(timestamp);
            return Number.isFinite(date.getTime()) ? date.toISOString() : new Date().toISOString();
        }
        if (typeof value === 'string') {
            const trimmed = value.trim();
            if (/^\d+$/.test(trimmed)) return normalizeSyncTimestamp(Number(trimmed));
            const timestamp = Date.parse(trimmed);
            if (Number.isFinite(timestamp)) return new Date(timestamp).toISOString();
        }
        return new Date().toISOString();
    }
    function getSyncRecordTimestamp(record) {
        const values = [record && record.updatedAt, record && record.updated_at, record && record.createdAt, record && record.created_at, record && record.timestamp, record && record.time];
        for (const value of values) {
            const timestamp = parseMessageTime({ timestamp: value });
            if (timestamp > 0) return timestamp;
        }
        return 0;
    }

    function isSyncRecordNewer(incoming, local) {
        const incomingRevision = Number(incoming && incoming.revision) || 0;
        const localRevision = Number(local && local.revision) || 0;
        if (incomingRevision !== localRevision) return incomingRevision > localRevision;
        const incomingTime = getSyncRecordTimestamp(incoming);
        const localTime = getSyncRecordTimestamp(local);
        if (incomingTime !== localTime) return incomingTime > localTime;
        return incoming?.status === 'archived' && local?.status !== 'archived';
    }

    function isSyncRecordInScope(record, scope = {}) {
        const isChat = record && (record.recordType === 'chat' || record.kind === 'chat');
        if (isChat && scope.includeChat !== true) return false;
        if (!isChat && Array.isArray(scope.tiers) && scope.tiers.length && !scope.tiers.includes(record.tier)) return false;
        if (scope.includeArchived !== true && record && record.status && record.status !== 'active' && !['user_deleted', 'source_removed', 'remote_deleted'].includes(record.archiveReason)) return false;
        return true;
    }

    async function mergeSyncRecords(records, options = {}) {
        const incoming = Array.isArray(records) ? records : [];
        if (!incoming.length) return 0;
        const scope = options && options.scope || {};
        const preferIncoming = options && options.preferIncoming === true;
        const nextItems = [...cachedMemoryItems];
        const nextSummaries = [...cachedSummaries];
        const nextConversations = Object.fromEntries(Object.entries(cachedConversations || {}).map(([key, value]) => [key, Array.isArray(value) ? [...value] : []]));
        const scopedIncoming = incoming
            .filter((record) => isSyncRecordInScope(record, scope))
            .filter((record) => record?.kind !== 'fragment' && !(record?.tier === 'L3' && record?.recordType !== 'chat' && record?.kind !== 'chat'));
        scopedIncoming.filter((record) => record.recordType !== 'summary' && record.kind !== 'summary' && record.recordType !== 'chat' && record.kind !== 'chat').forEach((record) => {
            const index = nextItems.findIndex((item) => item.id === record.id || item.externalId === record.id);
            const normalized = { ...record, id: index >= 0 ? nextItems[index].id : String(record.id), externalId: String(record.id), authority: record.authority || 'user_quote', visibility: record.visibility || 'current_binding', schemaVersion: MEMORY_SCHEMA_VERSION, revision: Math.max(1, Number(record.revision) || 1), updatedAt: normalizeSyncTimestamp(record.updatedAt || record.updated_at || record.createdAt || record.created_at || record.timestamp || new Date().toISOString()) };
            if (index < 0) nextItems.push(normalized);
            else if ((!['user_deleted', 'remote_deleted'].includes(nextItems[index].archiveReason) || normalized.status === 'archived' || (normalized.restoredAt && Date.parse(normalized.restoredAt) >= getSyncRecordTimestamp(nextItems[index]) && isSyncRecordNewer(normalized, nextItems[index]))) && (preferIncoming || isSyncRecordNewer(normalized, nextItems[index]))) nextItems[index] = { ...nextItems[index], ...normalized };
        });
        scopedIncoming.filter((record) => record.recordType === 'summary' || record.kind === 'summary').forEach((record) => {
            const index = nextSummaries.findIndex((summary) => summary.id === record.id);
            const sections = Array.isArray(record.sections) && record.sections.length ? record.sections : [{ title: '近况', content: record.content, sourceMessageIds: [] }];
            const normalized = { ...record, sections, tier: 'L2', slot: record.slot === 'chapter' ? 'chapter' : 'working', status: record.status || 'active', revision: Math.max(1, Number(record.revision) || 1), updatedAt: normalizeSyncTimestamp(record.updatedAt || record.updated_at || record.createdAt || record.created_at || new Date().toISOString()) };
            if (index < 0) nextSummaries.push(normalized);
            else if ((!['user_deleted', 'remote_deleted'].includes(nextSummaries[index].archiveReason) || normalized.status === 'archived') && (preferIncoming || isSyncRecordNewer(normalized, nextSummaries[index]))) nextSummaries[index] = { ...nextSummaries[index], ...normalized };
        });
        scopedIncoming.filter((record) => record.recordType === 'chat' || record.kind === 'chat').forEach((record) => {
            if (!record.bindingId) return;
            const messages = nextConversations[record.bindingId] || (nextConversations[record.bindingId] = []);
            const rawMessageId = String(record.localMessageId || record.sourceMessageId || record.id);
            const chatPrefix = 'chat_' + record.bindingId + '_';
            const messageId = rawMessageId.startsWith(chatPrefix) ? rawMessageId.slice(chatPrefix.length) : rawMessageId;
            const index = messages.findIndex((message) => String(message.id) === messageId);
            if (record.status === 'archived') {
                if (index >= 0 && (preferIncoming || isSyncRecordNewer(record, messages[index]))) nextConversations[record.bindingId] = messages.filter((message) => String(message.id) !== messageId);
                return;
            }
            const normalized = { ...record, id: messageId, text: record.text || record.content, type: record.type === 'sent' ? 'sent' : 'received', updatedAt: normalizeSyncTimestamp(record.updatedAt || record.updated_at || record.createdAt || record.created_at || record.timestamp || new Date().toISOString()) };
            delete normalized.kind; delete normalized.tier; delete normalized.status; delete normalized.recordType; delete normalized.bindingId; delete normalized.content;
            if (index >= 0) {
                if (preferIncoming || isSyncRecordNewer(normalized, messages[index])) messages[index] = { ...messages[index], ...normalized };
            }
            else messages.push(normalized);
        });
        const hasChatRecords = scopedIncoming.some((record) => record.recordType === 'chat' || record.kind === 'chat');
        const saved = await writeSyncedMemoryState(nextItems, nextSummaries, hasChatRecords ? nextConversations : null);
        if (saved) { cachedMemoryItems = nextItems; cachedSummaries = nextSummaries; cachedConversations = nextConversations; render(); }
        if (!saved) throw new Error('MEMORY_SYNC_SAVE_FAILED');
        return scopedIncoming.length;
    }

    async function preload() {
        const accountId = getDynamicUserId();
        const publicationEpoch = memoryPublicationEpoch;
        if (!await ensureLegacyMemoryStorage()) throw new Error(accountId !== getDynamicUserId() ? 'SUMMARY_ACCOUNT_CHANGED' : 'MEMORY_STORAGE_UNAVAILABLE');
        const records = await readRecords([PREFERENCES_KEY, MEMORY_ITEMS_KEY, MEMORY_OUTBOX_KEY, MEMORY_SUMMARIES_KEY]);
        if (accountId !== getDynamicUserId()) throw new Error('SUMMARY_ACCOUNT_CHANGED');
        if (publicationEpoch !== memoryPublicationEpoch) return cachedMemoryItems;
        const loadedItems = Array.isArray(records[MEMORY_ITEMS_KEY] && records[MEMORY_ITEMS_KEY].items)
            ? records[MEMORY_ITEMS_KEY].items.map(hydrateMemoryItem).filter(Boolean)
            : [];
        const loadedOutbox = Array.isArray(records[MEMORY_OUTBOX_KEY] && records[MEMORY_OUTBOX_KEY].items)
            ? records[MEMORY_OUTBOX_KEY].items.map(hydrateOutboxItem).filter(Boolean)
            : [];
        cachedMemoryItems = loadedItems.filter((item) => item.tier !== 'L3' && item.kind !== 'fragment');
        cachedOutbox = [];
        cachedSummaries = Array.isArray(records[MEMORY_SUMMARIES_KEY] && records[MEMORY_SUMMARIES_KEY].items)
            ? records[MEMORY_SUMMARIES_KEY].items.map(hydrateSummary).filter(Boolean)
            : [];
        summaryIntervalMessages = readSummaryInterval(records[PREFERENCES_KEY]);
        summaryIntervalUserConfigured = records[PREFERENCES_KEY]?.summaryIntervalUserConfigured === true
            || (records[PREFERENCES_KEY]?.summaryIntervalUserConfigured !== false && summaryIntervalMessages !== DEFAULT_SUMMARY_INTERVAL);
        ({ mode: summaryPromptMode, customPrompt: customSummaryPrompt } = readSummaryPromptPreferences(records[PREFERENCES_KEY]));
        summaryApiPresetId = readSummaryApiPreference(records[PREFERENCES_KEY]);
        trackMemoryArray(cachedMemoryItems, records[MEMORY_ITEMS_KEY]);
        trackMemoryArray(cachedOutbox, records[MEMORY_OUTBOX_KEY]);
        trackMemoryArray(cachedSummaries, records[MEMORY_SUMMARIES_KEY]);
        memoryStateLoaded = true;
        memoryPublicationEpoch += 1;
        if (cachedMemoryItems.length !== loadedItems.length || loadedOutbox.length) {
            await writeMemoryState(cachedMemoryItems, cachedOutbox, cachedSummaries);
        }
        return cachedMemoryItems;
    }

    async function flush() {
        // All memory mutations already await their own commit. Backup must read the
        // database, not persist an idle page's potentially obsolete cache.
        await preload();
        return true;
    }

    async function refreshConversationCache(initialRecords = null) {
        const accountId = getDynamicUserId();
        const indexKey = 'wechatChatContactIndex';
        const records = initialRecords || await readRecords([CHATS_KEY, indexKey]);
        const chatData = records[CHATS_KEY] || {};
        const conversations = (chatData.conversations || chatData.messages) && typeof (chatData.conversations || chatData.messages) === 'object'
            ? (chatData.conversations || chatData.messages)
            : {};
        const nextConversations = { ...conversations };
        const contactIds = Array.isArray(records[indexKey]?.contactIds) ? records[indexKey].contactIds.filter(Boolean) : [];
        const keys = contactIds.map(contactId => 'wechatChatContactData_' + accountId + '_' + contactId);
        const incremental = keys.length ? await readRecords(keys, { exact: true }) : {};
        contactIds.forEach((contactId, index) => {
            if (Array.isArray(incremental[keys[index]]?.messages)) nextConversations[contactId] = incremental[keys[index]].messages;
        });
        if (accountId !== getDynamicUserId()) throw new Error('SUMMARY_ACCOUNT_CHANGED');
        cachedConversations = nextConversations;
        return cachedConversations;
    }

    async function enqueueChatTurn({ bindingId, turnId, sourceMessages }) {
        if (!bindingId || !turnId || !Array.isArray(sourceMessages)) return false;
        if (cachedOutbox.some((item) => item.id === turnId)) return true;

        const item = {
            id: turnId,
            schemaVersion: MEMORY_SCHEMA_VERSION,
            bindingId,
            status: 'pending',
            attempts: 0,
            nextAttemptAt: '',
            lastError: '',
            sourceMessages: sourceMessages
                .filter((message) => message && message.id && (message.type === 'sent' || message.type === 'received') && normalizeMemoryText(message.text))
                .map((message) => ({ id: String(message.id), type: message.type, text: String(message.text) }))
                .slice(-12),
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        };
        if (item.sourceMessages.length === 0) return false;

        const nextOutbox = [...cachedOutbox, item].slice(-60);
        const saved = await writeRecord({ id: MEMORY_OUTBOX_KEY, schemaVersion: MEMORY_SCHEMA_VERSION, items: nextOutbox });
        if (saved) cachedOutbox = nextOutbox;
        return saved;
    }

    function getPendingChatTurns(bindingId, limit = 1) {
        const now = Date.now();
        return cachedOutbox
            .filter((item) => item && item.status === 'pending' && Number(item.attempts || 0) < OUTBOX_MAX_ATTEMPTS)
            .filter((item) => !bindingId || item.bindingId === bindingId)
            .filter((item) => !item.nextAttemptAt || Date.parse(item.nextAttemptAt) <= now)
            .sort((left, right) => String(left.createdAt || '').localeCompare(String(right.createdAt || '')))
            .slice(0, Math.max(1, Number(limit) || 1))
            .map((item) => ({ ...item, sourceMessages: item.sourceMessages.map((message) => ({ ...message })) }));
    }

    async function markChatTurnFailed(turnId, error) {
        const queuedTurn = cachedOutbox.find((item) => item && item.id === turnId);
        if (!queuedTurn) return false;
        const attempts = Math.max(0, Number(queuedTurn.attempts) || 0) + 1;
        const delayMs = Math.min(OUTBOX_MAX_RETRY_DELAY_MS, Math.pow(2, Math.min(attempts, 7)) * 15000);
        const now = new Date().toISOString();
        const nextStatus = attempts >= OUTBOX_MAX_ATTEMPTS ? 'failed' : 'pending';
        const nextOutbox = cachedOutbox.map((item) => item.id === turnId ? {
            ...item,
            status: nextStatus,
            attempts,
            lastError: String(error && error.message || error || 'unknown error').slice(0, 240),
            nextAttemptAt: nextStatus === 'pending' ? new Date(Date.now() + delayMs).toISOString() : '',
            updatedAt: now
        } : item);
        const saved = await writeRecord({ id: MEMORY_OUTBOX_KEY, schemaVersion: MEMORY_SCHEMA_VERSION, items: nextOutbox });
        if (saved) cachedOutbox = nextOutbox;
        return saved;
    }

    async function completeChatTurn(turnId, candidates) {
        const queuedTurn = cachedOutbox.find((item) => item.id === turnId);
        if (!queuedTurn) return false;

        const sourceById = new Map(queuedTurn.sourceMessages.map((message) => [String(message.id), message]));
        const existingContents = new Set(
            cachedMemoryItems
                .filter((item) => item.bindingId === queuedTurn.bindingId)
                .map((item) => normalizeMemoryText(item.content).toLowerCase())
        );
        const now = new Date().toISOString();
        const newItems = [];

        (Array.isArray(candidates) ? candidates : []).slice(0, 2).forEach((candidate) => {
            const message = sourceById.get(String(candidate && candidate.messageId || ''));
            const quote = normalizeMemoryText(candidate && candidate.quote);
            if (!message || message.type !== 'sent' || !quote || quote.length < 4 || quote.length > 180) return;
            if (!String(message.text).includes(quote) || isSensitiveAutomaticMemory(quote)) return;
            const normalizedQuote = quote.toLowerCase();
            if (existingContents.has(normalizedQuote)) return;

            existingContents.add(normalizedQuote);
            const memoryId = 'memory_' + Date.now() + '_' + Math.random().toString(36).slice(2, 8);
            const lifecycle = getMemoryLifecycle(quote);
            newItems.push({
                id: memoryId,
                schemaVersion: MEMORY_SCHEMA_VERSION,
                bindingId: queuedTurn.bindingId,
                kind: 'memory',
                tier: 'L1',
                status: 'active',
                authority: 'user_quote',
                subjectType: 'user_persona',
                visibility: 'current_binding',
                content: quote,
                lifecycle,
                keywords: createTextTerms(quote),
                sourceRefs: [{ type: 'chat_quote', messageId: message.id, quote, createdAt: now }],
                revision: 1,
                retrievalStats: { injectedCount: 0, lastInjectedAt: '', lastInjectedTurn: '', lastScore: 0, lastReasons: [] },
                createdAt: now,
                updatedAt: now
            });
        });

        // Raw chat messages remain in the chat store. They are no longer duplicated as L3 memory fragments.

        const nextItems = newItems.reduce(
            (items, item) => item.tier === 'L1' && item.lifecycle?.state === 'closed'
                ? supersedeConflictingEvents(items, queuedTurn.bindingId, item.content, item.id, now)
                : items,
            cachedMemoryItems
        ).concat(newItems);
        const nextOutbox = cachedOutbox.filter((item) => item.id !== turnId);
        const saved = await writeMemoryState(nextItems, nextOutbox);
        if (!saved) return false;
        cachedMemoryItems = nextItems;
        cachedOutbox = nextOutbox;
        window.MemorySync?.schedule(queuedTurn.bindingId);
        return true;
    }

    function formatMemoryDate(value) {
        const timestamp = Date.parse(value || '');
        if (!Number.isFinite(timestamp)) return '';
        return new Intl.DateTimeFormat('zh-CN', { month: 'numeric', day: 'numeric' }).format(timestamp);
    }

    function appendMemoryEntry(list, item) {
        const entry = document.createElement('article');
        entry.className = 'memory-entry memory-card';
        const entryHeader = document.createElement('div');
        entryHeader.className = 'memory-entry-header memory-card-header';
        const meta = document.createElement('span');
        meta.className = 'memory-entry-meta badge ' + (item.tier === 'L2' ? 'summary' : 'manual');
        meta.textContent = item.tier === 'L3'
            ? 'L3 片段 · ' + (formatMemoryDate(item.createdAt) || '聊天记录')
            : (formatMemoryDate(item.createdAt) || '手动记录');
        const actions = document.createElement('div');
        actions.className = 'memory-entry-actions';
        if (item.status === 'archived' && item.archiveReason !== 'source_removed') {
            const restoreButton = document.createElement('button');
            restoreButton.type = 'button';
            restoreButton.className = 'memory-icon-action';
            restoreButton.title = '恢复';
            restoreButton.setAttribute('aria-label', '恢复');
            restoreButton.innerHTML = '<svg style="width:16px;height:16px" data-mdi-icon="restore" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M13,3A9,9 0 0,0 4,12H1L4.89,15.89L4.96,16.03L9,12H6A7,7 0 0,1 13,5A7,7 0 0,1 20,12A7,7 0 0,1 13,19C11.07,19 9.32,18.21 8.06,16.94L6.64,18.36C8.27,20 10.5,21 13,21A9,9 0 0,0 22,12A9,9 0 0,0 13,3Z"></path></svg>';
            restoreButton.addEventListener('click', () => void restoreMemory(item.id));
            const deleteButton = document.createElement('button');
            deleteButton.type = 'button';
            deleteButton.className = 'memory-icon-action memory-delete-action';
            deleteButton.title = '删除';
            deleteButton.setAttribute('aria-label', '删除');
            deleteButton.innerHTML = getMemoryHomeSvg('trash', 16);
            deleteButton.addEventListener('click', () => requestDeleteArchivedMemory(item.id));
            actions.append(restoreButton, deleteButton);
        } else {
            if (item.tier === 'L3') {
                const prioritySelect = document.createElement('select');
                prioritySelect.className = 'memory-priority-action';
                prioritySelect.setAttribute('aria-label', '片段召回优先级');
                [
                    [RETRIEVAL_PRIORITY.pinned, '置顶'],
                    [RETRIEVAL_PRIORITY.normal, '普通'],
                    [RETRIEVAL_PRIORITY.low, '降低']
                ].forEach(([value, label]) => {
                    const option = document.createElement('option');
                    option.value = String(value);
                    option.textContent = label;
                    option.selected = value === getRetrievalPriority(item);
                    prioritySelect.appendChild(option);
                });
                prioritySelect.addEventListener('change', () => void setMemoryRetrievalPriority(item.id, Number(prioritySelect.value)));
                actions.append(prioritySelect);
            }
            const editButton = document.createElement('button');
            editButton.type = 'button';
            editButton.textContent = '编辑';
            editButton.addEventListener('click', () => openComposer(item));
            const deleteButton = document.createElement('button');
            deleteButton.type = 'button';
            deleteButton.className = 'memory-delete-action';
            deleteButton.textContent = '删除';
            deleteButton.addEventListener('click', () => requestArchiveMemory(item.id));
            actions.append(editButton, deleteButton);
        }
        entryHeader.append(meta, actions);
        const text = document.createElement('p');
        text.textContent = item.content || '';
        const provenance = document.createElement('p');
        provenance.className = 'memory-entry-provenance';
        const recallReasons = Array.isArray(item.retrievalStats && item.retrievalStats.lastReasons) ? item.retrievalStats.lastReasons : [];
        const priorityCopy = item.tier === 'L3' ? '优先级：' + getRetrievalPriorityLabel(item) : '';
        const vectorCopy = item.tier === 'L3'
            ? (getVectorValues(item.vectorIndex) ? '本地向量已建立' : '本地向量待建立')
            : '';
        const recallCopy = getRetrievalCount(item) > 0
            ? ' · 召回 ' + getRetrievalCount(item) + ' 次' + (recallReasons.length ? '（' + recallReasons.join('、') + '）' : '')
            : '';
        provenance.textContent = (item.status === 'archived' || item.status === 'superseded')
            ? ('状态：' + (getArchiveReason(item) || '已归档'))
            : [getSourceLabel(item), priorityCopy, vectorCopy].filter(Boolean).join(' · ') + recallCopy;
        entry.append(entryHeader, text, provenance);
        list.appendChild(entry);
    }

    function renderMemoryContent(contact) {
        const content = root.querySelector('[data-memory-content]');
        const title = root.querySelector('[data-memory-card-title]');
        const allItems = contact && activeTab !== 'archive'
            ? getActiveItems(contact.id, activeTab)
            : [];
        const searchQuery = memorySearchQuery.trim().toLocaleLowerCase();
        const items = searchQuery
            ? allItems.filter((item) => String(item.content || '').toLocaleLowerCase().includes(searchQuery))
            : allItems;
        const chapters = contact && activeTab === 'relationship' ? getChapterSummaries(contact.id) : [];
        const summary = contact && activeTab === 'relationship' ? getActiveSummary(contact.id) : null;
        const [emptyTitle, emptyText] = getEmptyCopy();
        title.textContent = activeTab === 'memory' ? '\u8fd1\u671f\u8bb0\u5fc6' : getTabLabel();
        content.replaceChildren();

        if (contact && activeTab === 'archive') {
            renderCharacterArchive(document, content, contact, searchQuery);
            return;
        }

        if (summary || chapters.length || items.length > 0) {
            const list = document.createElement('div');
            list.className = 'memory-entry-list memory-list';

            [...chapters, ...(summary ? [summary] : [])]
                .sort((left, right) => getSummarySortTime(right) - getSummarySortTime(left))
                .forEach((chapter) => {
                (chapter.sections || []).forEach((section) => {
                    const confirmed = chapter.slot === 'chapter';
                    const entry = document.createElement(confirmed ? 'details' : 'article');
                    entry.className = 'memory-entry memory-card';
                    const meta = document.createElement(confirmed ? 'summary' : 'span');
                    meta.className = 'memory-entry-meta badge summary';
                    const rangeLabel = getSummaryRangeLabel(chapter, contact.id);
                    meta.textContent = [chapter.slot === 'chapter' ? '已确认摘要' : 'L2 摘要', section.title || '近况', rangeLabel].filter(Boolean).join(' · ');
                    const text = document.createElement('div');
                    text.className = 'memory-summary-article';
                    renderSummaryArticle(text, chapter, section, '');
                    if (confirmed) decorateSummaryDisclosure(entry, meta);
                    entry.append(meta, text);
                    list.appendChild(entry);
                });
            });

            items.forEach((item) => appendMemoryEntry(list, item));
            content.appendChild(list);
            return;
        }

        {
            const empty = document.createElement('div');
            empty.className = 'memory-empty-state';
            empty.innerHTML = '<span class="memory-empty-mark">✦</span><h2></h2><p></p>';
            empty.querySelector('h2').textContent = emptyTitle;
            empty.querySelector('p').textContent = emptyText;
            content.appendChild(empty);
        }
    }

    function renderRolePicker() {
        const list = root.querySelector('[data-memory-role-list]');
        const empty = root.querySelector('[data-memory-role-empty]');
        list.replaceChildren();
        const hasContacts = cachedContacts.length > 0;
        empty.hidden = hasContacts;
        list.hidden = !hasContacts;
        if (!hasContacts) return;

        cachedContacts.forEach((contact) => {
            const button = document.createElement('button');
            button.type = 'button';
            button.className = 'memory-role-option' + (contact.id === selectedContactId ? ' is-selected' : '');
            const avatar = document.createElement('span');
            avatar.className = 'memory-role-avatar';
            const monogram = document.createElement('span');
            monogram.textContent = (contact.name || '记').trim().slice(0, 1);
            avatar.appendChild(monogram);
            if (contact.avatar) {
                const image = document.createElement('img');
                image.alt = '';
                image.src = contact.avatar;
                image.onload = () => avatar.classList.add('has-image');
                image.onerror = () => avatar.classList.remove('has-image');
                avatar.appendChild(image);
            }
            const label = document.createElement('span');
            label.className = 'memory-role-name';
            label.textContent = contact.name || '未命名角色';
            const hint = document.createElement('span');
            hint.className = 'memory-role-hint';
            hint.textContent = '进入记忆';
            button.append(avatar, label, hint);
            button.addEventListener('click', () => void selectRole(contact.id));
            list.appendChild(button);
        });
    }

    function showRolePicker() {
        if (!root) return;
        renderRolePicker();
        root.classList.add('is-picking-role');
        root.querySelector('[data-memory-role-picker]').setAttribute('aria-hidden', 'false');
    }

    function hideRolePicker() {
        root.classList.remove('is-picking-role');
        root.querySelector('[data-memory-role-picker]').setAttribute('aria-hidden', 'true');
    }

    async function selectRole(contactId) {
        selectedContactId = contactId;
        activeTab = 'memory';
        memoryHomeExpandedView = false;
        savePreferences();
        if (getReferenceFrame()) {
            getReferenceFrame().contentDocument?.getElementById('switcherOverlay')?.classList.remove('is-visible');
            renderReferenceDocument();
            return;
        }
        hideRolePicker();
        await refreshConversationCache();
        render();
    }

    function openComposer(item = null) {
        const contact = cachedContacts.find((item) => item.id === selectedContactId);
        if (!contact) {
            const referenceFrame = getReferenceFrame();
            if (referenceFrame?.contentDocument) {
                showReferenceRolePicker(referenceFrame.contentDocument);
                return;
            }
            showRolePicker();
            return;
        }
        editingMemoryId = item && item.id ? item.id : '';
        root.classList.add('is-composing');
        root.querySelector('[data-memory-composer]').setAttribute('aria-hidden', 'false');
        root.querySelector('[data-memory-composer-title]').textContent = editingMemoryId ? '修改记忆' : '新增' + getTabLabel();
        root.querySelector('[data-memory-composer-role]').textContent = contact.name || '未命名角色';
        const input = root.querySelector('[data-memory-composer-input]');
        const error = root.querySelector('[data-memory-composer-error]');
        input.value = item && item.content ? item.content : '';
        error.textContent = '';
        requestAnimationFrame(() => input.focus());
    }

    function closeComposer() {
        if (!root) return;
        root.classList.remove('is-composing');
        const composer = root.querySelector('[data-memory-composer]');
        if (composer) composer.setAttribute('aria-hidden', 'true');
        editingMemoryId = '';
    }

    function formatSummaryTimestamp(value) {
        const timestamp = parseMemoryHomeTime(value);
        if (!timestamp) return '尚未更新';
        return new Intl.DateTimeFormat('zh-CN', {
            year: 'numeric',
            month: 'numeric',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            hour12: false
        }).format(new Date(timestamp));
    }

    function getSummaryUpdateKey(bindingId = selectedContactId) {
        return getDynamicUserId() + ':' + String(bindingId || '');
    }

    function updateSummaryActionButtons() {
        if (!root) return;
        const busy = pendingSummaryUpdates.has(getSummaryUpdateKey());
        ['summarize-selected-range', 'refresh-summary'].forEach(action => {
            const button = root.querySelector('[data-memory-action="' + action + '"]');
            if (!button) return;
            // Keep taps available so an in-flight request can explain its state.
            button.disabled = false;
            button.textContent = busy ? '总结中…' : (action === 'refresh-summary' ? '立即更新' : '按范围总结');
            if (busy) button.setAttribute('aria-busy', 'true');
            else button.removeAttribute('aria-busy');
        });
    }

    function showSummaryFeedback(message, notify = false) {
        const status = root && root.querySelector('[data-memory-summary-status]');
        if (status) status.textContent = message;
        if (notify && typeof showToast === 'function') showToast(message);
    }

    function renderSummaryPanel(message = '') {
        if (!root) return;
        const contact = cachedContacts.find((item) => item.id === selectedContactId) || null;
        const overview = getSummaryOverview(selectedContactId, contact ? getContactMessages(contact.id) : []);
        const role = root.querySelector('[data-memory-summary-role]');
        const text = root.querySelector('[data-memory-summary-text]');
        const input = root.querySelector('[data-memory-summary-input]');
        const meta = root.querySelector('[data-memory-summary-meta]');
        const progress = root.querySelector('[data-memory-summary-progress]');
        const progressCopy = root.querySelector('[data-memory-summary-progress-copy]');
        const sourceCount = root.querySelector('[data-memory-summary-source-count]');
        const rangeStart = root.querySelector('[data-memory-summary-range-start]');
        const rangeEnd = root.querySelector('[data-memory-summary-range-end]');
        const rangeCount = root.querySelector('[data-memory-summary-range-count]');
        const sourceList = root.querySelector('[data-memory-summary-sources]');
        const editButton = root.querySelector('[data-memory-action="edit-summary"]');
        const deleteButton = root.querySelector('[data-memory-action="delete-summary"]');
        const confirmButton = root.querySelector('[data-memory-action="confirm-summary"]');
        const status = root.querySelector('[data-memory-summary-status]');

        role.textContent = contact ? contact.name || '未命名角色' : '尚未选择角色';
        const rangeMessages = contact ? listSummarizableMessages(contact.id) : [];
        if (rangeStart && rangeEnd) {
            const scope = getSummaryUpdateKey();
            const changedRole = rangeStart.dataset.scope !== scope;
            if (rangeCount) rangeCount.textContent = String(rangeMessages.length);
            rangeStart.max = String(rangeMessages.length);
            rangeEnd.max = String(rangeMessages.length);
            if (changedRole || !Number.isInteger(Number(rangeStart.value)) || Number(rangeStart.value) < 1 || Number(rangeStart.value) > rangeMessages.length) rangeStart.value = rangeMessages.length ? '1' : '';
            if (changedRole || !Number.isInteger(Number(rangeEnd.value)) || Number(rangeEnd.value) < Number(rangeStart.value) || Number(rangeEnd.value) > rangeMessages.length) rangeEnd.value = rangeMessages.length ? String(rangeMessages.length) : '';
            rangeStart.dataset.scope = scope;
        }
        renderSummaryArticle(text, overview.summary, overview.summary && overview.summary.sections && overview.summary.sections[0], '还没有近期摘要');
        input.value = overview.summary ? formatSummarySection(overview.summary.sections && overview.summary.sections[0]) : '';
        const summaryTimeRange = overview.summary && overview.summary.sections && overview.summary.sections[0] && overview.summary.sections[0].timeRange;
        const summaryTimeText = summaryTimeRange && (summaryTimeRange.start || summaryTimeRange.end)
            ? ' · 对话时间 ' + formatSummaryTimestamp(summaryTimeRange.start) + ' 至 ' + formatSummaryTimestamp(summaryTimeRange.end)
            : '';
        const summaryRangeLabel = overview.summary ? getSummaryRangeLabel(overview.summary, selectedContactId) : '';
        meta.textContent = overview.hasSummary
            ? '更新于 ' + formatSummaryTimestamp(overview.updatedAt) + (summaryRangeLabel ? ' · ' + summaryRangeLabel : '') + summaryTimeText + ' · 第 ' + overview.revision + ' 版'
            : '累计足够的对话后会自动生成';
        progress.max = overview.interval;
        const progressTurns = Number(overview.newTurnCount ?? overview.newMessageCount) || 0;
        progress.value = Math.min(progressTurns, overview.interval);
        progressCopy.textContent = overview.totalTurnCount === 0
            ? '还没有可用于分析的对话'
            : overview.hasSummary
                ? '新增 ' + progressTurns + ' / ' + overview.interval + ' 轮'
                : '已积累 ' + Math.min(progressTurns, overview.interval) + ' / ' + overview.interval + ' 轮';
        sourceCount.textContent = '输入 ' + overview.sourceMessages.length + ' 条';
        sourceList.replaceChildren();
        overview.sourceMessages.forEach((source) => {
            const item = document.createElement('div');
            item.className = 'memory-summary-source';
            const label = document.createElement('span');
            label.textContent = source.type === 'sent' ? '我' : (contact && contact.name || '角色');
            const copy = document.createElement('p');
            copy.textContent = source.text;
            item.append(label, copy);
            sourceList.appendChild(item);
        });
        if (!overview.sourceMessages.length) {
            const empty = document.createElement('p');
            empty.className = 'memory-summary-source-empty';
            empty.textContent = overview.hasSummary ? '这版摘要没有可显示的来源消息' : '生成摘要后可在这里核对来源';
            sourceList.appendChild(empty);
        }
        editButton.disabled = !overview.hasSummary;
        deleteButton.disabled = !overview.hasSummary;
        if (confirmButton) confirmButton.disabled = !overview.hasSummary;
        updateSummaryActionButtons();
        status.textContent = message || (pendingSummaryUpdates.has(getSummaryUpdateKey()) ? '正在总结，请稍候；重复点击不会重复调用 API。' : '');
    }

    async function openSummaryPanel() {
        if (!root) return;
        closeSummarySettings();
        closeComposer();
        await refresh();
        root.classList.add('is-viewing-summary');
        root.querySelector('[data-memory-summary-panel]').setAttribute('aria-hidden', 'false');
        renderSummaryPanel();
    }

    function closeSummaryPanel() {
        if (!root) return;
        root.classList.remove('is-viewing-summary', 'is-editing-summary');
        const panel = root.querySelector('[data-memory-summary-panel]');
        if (panel) panel.setAttribute('aria-hidden', 'true');
        const sources = root.querySelector('[data-memory-summary-sources]');
        if (sources) sources.hidden = true;
        const sourceToggle = root.querySelector('[data-memory-action="toggle-summary-sources"]');
        if (sourceToggle) sourceToggle.textContent = '查看依据';
    }

    function toggleSummarySources() {
        const sources = root && root.querySelector('[data-memory-summary-sources]');
        const button = root && root.querySelector('[data-memory-action="toggle-summary-sources"]');
        if (!sources || !button) return;
        sources.hidden = !sources.hidden;
        button.textContent = sources.hidden ? '查看依据' : '收起依据';
    }

    function startSummaryEdit() {
        const summary = getManageableSummary(selectedContactId);
        if (!root || !summary) {
            renderSummaryPanel('当前没有可编辑的摘要。');
            return;
        }
        root.classList.add('is-editing-summary');
        const input = root.querySelector('[data-memory-summary-input]');
        input.value = formatSummarySection(summary.sections && summary.sections[0]);
        root.querySelector('[data-memory-summary-status]').textContent = '';
        requestAnimationFrame(() => input.focus());
    }

    function cancelSummaryEdit() {
        if (!root) return;
        root.classList.remove('is-editing-summary');
        renderSummaryPanel();
    }

    async function confirmCurrentSummary() {
        const status = root && root.querySelector('[data-memory-summary-status]');
        const confirmButton = root && root.querySelector('[data-memory-action="confirm-summary"]');
        if (!root) return;
        if (!getManageableSummary(selectedContactId)) {
            renderSummaryPanel('当前没有可确认的摘要。先生成一版当前摘要。');
            return;
        }
        if (status) status.textContent = '正在确认并空出…';
        if (confirmButton) confirmButton.disabled = true;
        try {
            const saved = await confirmWorkingSummary(selectedContactId);
            if (!saved) {
                renderSummaryPanel('摘要确认失败，请稍后重试。');
                return;
            }
            renderSummaryPanel('已确认并空出当前摘要，可继续生成更早的对话。');
            applySuggestedSummaryRange(selectedContactId);
            renderReferenceDocument();
            await refresh();
            renderSummaryPanel('已确认并空出当前摘要，可继续生成更早的对话。');
            applySuggestedSummaryRange(selectedContactId);
            renderReferenceDocument();
        } catch (error) {
            renderSummaryPanel(error && error.message ? error.message : '摘要确认失败，请稍后重试。');
        }
    }

    async function removeCurrentSummary() {
        if (!root || !getManageableSummary(selectedContactId)) return;
        const confirmed = typeof showCustomConfirm === 'function'
            ? await showCustomConfirm('删除摘要', '删除后将不再引用这版 L2 摘要，聊天记录不会被删除。', '删除', true)
            : window.confirm('删除后将不再引用这版 L2 摘要，聊天记录不会被删除。确定删除吗？');
        if (!confirmed) return;
        const saved = await deleteSummary(selectedContactId);
        if (!saved) {
            renderSummaryPanel('摘要删除失败，请稍后重试。');
            return;
        }
        await refresh();
        renderSummaryPanel('摘要已删除。');
        renderReferenceDocument();
    }

    async function summarizeSelectedRange() {
        const start = root && root.querySelector('[data-memory-summary-range-start]');
        const end = root && root.querySelector('[data-memory-summary-range-end]');
        const status = root && root.querySelector('[data-memory-summary-status]');
        if (!start || !end || !status) return;
        if (typeof window.wcRegenerateMemorySummary !== 'function') {
            showSummaryFeedback('聊天模块尚未就绪，请稍后重试。', true);
            return;
        }
        const bindingId = selectedContactId;
        const requestKey = getSummaryUpdateKey(bindingId);
        if (pendingSummaryUpdates.has(requestKey)) {
            showSummaryFeedback('这个角色正在总结，请稍候；不会重复调用 API。', true);
            return;
        }
        const messages = listSummarizableMessages(bindingId);
        if (!messages.length) {
            showSummaryFeedback('当前角色还没有可总结的聊天记录。', true);
            return;
        }
        const startNumber = Number(start.value);
        const endNumber = Number(end.value);
        const startIndex = startNumber - 1;
        const endIndex = endNumber - 1;
        if (!Number.isInteger(startNumber) || !Number.isInteger(endNumber) || startIndex < 0 || endIndex >= messages.length || startIndex > endIndex) {
            showSummaryFeedback('请输入 1～' + messages.length + ' 之间的整数，起始消息不能晚于末尾消息。', true);
            return;
        }
        const selectedMessages = messages.slice(startIndex, endIndex + 1);
        if (!selectedMessages.length) {
            status.textContent = '选定范围内没有可用的聊天依据。';
            return;
        }
        pendingSummaryUpdates.add(requestKey);
        updateSummaryActionButtons();
        showSummaryFeedback('正在总结第 ' + startNumber + '～' + endNumber + ' 条聊天记录…');
        try {
            await window.wcRegenerateMemorySummary(bindingId, {
                force: true,
                sourceMessageIds: selectedMessages.map((item) => String(item.id)),
                sourceMessages: selectedMessages
            });
            if (requestKey !== getSummaryUpdateKey()) return;
            await refresh();
            if (requestKey !== getSummaryUpdateKey()) return;
            renderSummaryPanel('已按选定聊天记录范围更新摘要。');
            renderReferenceDocument();
        } catch (error) {
            if (requestKey === getSummaryUpdateKey()) showSummaryFeedback(error && error.message ? error.message : '范围摘要更新失败，请稍后重试。', true);
        } finally {
            pendingSummaryUpdates.delete(requestKey);
            updateSummaryActionButtons();
        }
    }

    async function saveEditedSummary() {
        const input = root && root.querySelector('[data-memory-summary-input]');
        const status = root && root.querySelector('[data-memory-summary-status]');
        const value = formatSummaryBody(input && input.value);
        if (!value) {
            if (status) status.textContent = '摘要不能为空。';
            return;
        }
        const saved = await saveSummaryOverride(selectedContactId, value);
        if (!saved) {
            if (status) status.textContent = '摘要保存失败，请稍后重试。';
            return;
        }
        root.classList.remove('is-editing-summary');
        renderSummaryPanel('已保存人工修正。');
        renderReferenceDocument();
    }

    async function refreshSummaryNow() {
        const button = root && root.querySelector('[data-memory-action="refresh-summary"]');
        const status = root && root.querySelector('[data-memory-summary-status]');
        if (!button || !status || typeof window.wcRegenerateMemorySummary !== 'function') {
            showSummaryFeedback('当前聊天模块暂不支持立即更新。', true);
            return;
        }
        const bindingId = selectedContactId;
        const requestKey = getSummaryUpdateKey(bindingId);
        if (pendingSummaryUpdates.has(requestKey)) {
            showSummaryFeedback('这个角色正在总结，请稍候；不会重复调用 API。', true);
            return;
        }
        pendingSummaryUpdates.add(requestKey);
        updateSummaryActionButtons();
        showSummaryFeedback('正在更新摘要…');
        try {
            await window.wcRegenerateMemorySummary(bindingId);
            if (requestKey !== getSummaryUpdateKey()) return;
            await refresh();
            if (requestKey !== getSummaryUpdateKey()) return;
            renderSummaryPanel('摘要已更新。');
            renderReferenceDocument();
        } catch (error) {
            if (requestKey === getSummaryUpdateKey()) showSummaryFeedback(error && error.message ? error.message : '摘要更新失败，请稍后重试。', true);
        } finally {
            pendingSummaryUpdates.delete(requestKey);
            updateSummaryActionButtons();
        }
    }

    function updateSummaryApiPresetHint() {
        if (!root) return;
        const select = root.querySelector('[data-memory-summary-api-preset]');
        const hint = root.querySelector('[data-memory-summary-api-hint]');
        if (!select || !hint) return;
        const preset = cachedSummaryApiPresets.find((item) => String(item && item.id || '') === String(select.value || ''));
        if (!select.value) {
            hint.textContent = cachedSummaryApiPresets.length
                ? '跟随设置 App 当前已连接的聊天 API'
                : '设置 App 中暂无其他 API 预设，将跟随当前聊天 API';
            return;
        }
        const name = String(preset && (preset.name || preset.label) || 'API 预设').trim() || 'API 预设';
        const model = String(preset && preset.model || '').trim();
        hint.textContent = model ? (name + ' · ' + model) : (name + ' · 未设置模型');
    }

    async function renderSummaryApiPresetOptions() {
        if (!root) return;
        const select = root.querySelector('[data-memory-summary-api-preset]');
        if (!select) return;
        select.disabled = true;
        try {
            const records = await readRecords([API_DATA_KEY]);
            const apiData = records[API_DATA_KEY];
            cachedSummaryApiPresets = Array.isArray(apiData && apiData.list)
                ? apiData.list.filter((item) => item && item.id)
                : [];
            select.replaceChildren();
            const currentOption = document.createElement('option');
            currentOption.value = '';
            currentOption.textContent = '跟随当前聊天 API';
            select.appendChild(currentOption);
            cachedSummaryApiPresets.forEach((preset) => {
                const option = document.createElement('option');
                option.value = String(preset.id);
                const name = String(preset.name || preset.label || 'API 预设').trim() || 'API 预设';
                const model = String(preset.model || '').trim();
                option.textContent = model ? (name + ' · ' + model) : name;
                select.appendChild(option);
            });
            select.value = cachedSummaryApiPresets.some((item) => String(item.id) === summaryApiPresetId)
                ? summaryApiPresetId
                : '';
            updateSummaryApiPresetHint();
        } finally {
            select.disabled = false;
        }
    }

    async function renderVectorRebuildStatus() {
        const button = root?.querySelector('[data-memory-action="rebuild-vector-memory"]');
        const status = root?.querySelector('[data-memory-vector-rebuild-status]');
        const header = root?.querySelector('.memory-vector-rebuild-section [data-memory-section-status]');
        if (!status || !button || button.getAttribute('aria-busy') === 'true') return;
        if (!selectedContactId) {
            status.textContent = '请先选择需要重建向量的角色。';
            button.disabled = true;
            return;
        }
        if (!window.MemoryV2?.getSemanticRebuildStatus) {
            status.textContent = '向量记忆引擎尚未加载。';
            button.disabled = true;
            return;
        }
        const bindingId = selectedContactId;
        try {
            const scan = await window.MemoryV2.getSemanticRebuildStatus(bindingId);
            if (!status.isConnected || selectedContactId !== bindingId || button.getAttribute('aria-busy') === 'true') return;
            button.disabled = !scan.ready || !scan.total || scan.running;
            button.textContent = scan.resumable ? '继续重建向量记忆' : '重新生成向量索引';
            if (header) header.textContent = scan.ready ? (scan.resumable ? '可续跑' : '已就绪') : '未就绪';
            status.textContent = !scan.ready
                ? '请先配置远程向量 API 或启用本地向量模型。不会使用聊天摘要 API。'
                : !scan.total
                    ? '这个角色还没有可索引的记忆。'
                    : '当前模型：' + (scan.model || scan.mode) + '。现有有效向量 ' + scan.indexed + ' / '
                        + scan.total + ' 个片段。'
                        + (scan.resumable ? ' 上次重建已完成 ' + scan.rebuilt + ' 个，可继续未完成部分。' : ' 可手动重新计算全部向量。');
        } catch (error) {
            if (status.isConnected && selectedContactId === bindingId) status.textContent = '检查失败：' + String(error?.message || error);
            button.disabled = true;
        }
    }

    async function rebuildVectorMemoryNow() {
        const button = root?.querySelector('[data-memory-action="rebuild-vector-memory"]');
        const status = root?.querySelector('[data-memory-vector-rebuild-status]');
        if (!button || !status || button.getAttribute('aria-busy') === 'true') return;
        if (!window.MemoryV2?.rebuildSemanticIndex || !selectedContactId) return;
        const bindingId = selectedContactId;
        let scan;
        try {
            scan = await window.MemoryV2.getSemanticRebuildStatus(bindingId);
        } catch (error) {
            status.textContent = '无法检查向量状态：' + String(error?.message || error);
            return;
        }
        if (!scan.ready || !scan.total || scan.running) {
            await renderVectorRebuildStatus();
            return;
        }
        const message = '将使用已保存的' + (scan.mode === 'remote' ? '远程向量 API' : '本地向量模型')
            + '为当前角色已有的记忆、摘要索引及事件重新生成向量。'
            + '每次最多处理 24 个文本片段，远程 API 可能产生费用。'
            + '不重新生成聊天摘要，也不修改原始记忆或聊天记录；失败可以继续上次进度。';
        const confirmed = typeof window.showCustomConfirm === 'function'
            ? await window.showCustomConfirm('重建向量记忆', message, '开始重建', false)
            : window.confirm(message + '\n\n开始重建？');
        if (!confirmed || bindingId !== selectedContactId) return;
        button.disabled = true;
        button.setAttribute('aria-busy', 'true');
        status.textContent = '正在重新计算向量索引…';
        try {
            const result = await window.MemoryV2.rebuildSemanticIndex(bindingId, {
                maxEntries: 24,
                onProgress(progress) {
                    if (bindingId !== selectedContactId || !status.isConnected) return;
                    status.textContent = '已完成本次 ' + progress.processed + '/24 个片段，仍有 '
                        + progress.remaining + ' 个等待重建。';
                }
            });
            status.textContent = result.completed
                ? '向量索引重建完成，共 ' + result.total + ' 个片段。聊天摘要与原始记忆没有改动。'
                : '本次重建 ' + result.processed + ' 个片段，尚余 ' + result.remaining
                    + ' 个。再次点击可接着重建。';
        } catch (error) {
            status.textContent = '重建中断：' + String(error?.message || error)
                + '。原有向量仍保留，已保存的部分可以继续。';
        } finally {
            button.removeAttribute('aria-busy');
            button.disabled = false;
            const header = root?.querySelector('.memory-vector-rebuild-section [data-memory-section-status]');
            if (header) header.textContent = '查看状态';
            button.textContent = '继续 / 重新生成向量';
        }
    }

    function openSummarySettings() {
        if (!root) return;
        const sheet = root.querySelector('[data-memory-summary-settings]');
        const input = root.querySelector('[data-memory-summary-interval]');
        const error = root.querySelector('[data-memory-summary-error]');
        input.value = String(summaryIntervalMessages);
        renderSummaryPromptSettings();
        void renderSummaryApiPresetOptions();
        error.textContent = '';
        const semanticState = getSemanticModelState();
        const modelUrl = root.querySelector('[data-semantic-model-url]');
        if (modelUrl) modelUrl.value = semanticState.manifestUrl || '';
        renderSemanticModelState(semanticState);
        void renderVectorRebuildStatus();
        root.classList.add('is-configuring-summary');
        sheet.setAttribute('aria-hidden', 'false');
        requestAnimationFrame(() => input.focus());
    }

    function closeSummarySettings() {
        if (!root) return;
        closeMemorySyncProviderDialog();
        closeMemoryCloudflareDeployDialog();
        closeMemorySupabaseSetupDialog();
        root.classList.remove('is-configuring-summary');
        const sheet = root.querySelector('[data-memory-summary-settings]');
        if (sheet) sheet.setAttribute('aria-hidden', 'true');
        requestAnimationFrame(() => getReferenceFrame()?.contentDocument?.querySelector('.btn-capsule')?.focus());
    }

    function openMemorySyncProviderDialog() {
        const dialog = root && root.querySelector('[data-memory-sync-provider-dialog]');
        if (!dialog) return;
        dialog.setAttribute('aria-hidden', 'false');
        dialog.classList.add('is-visible');
    }

    function closeMemorySyncProviderDialog() {
        const dialog = root && root.querySelector('[data-memory-sync-provider-dialog]');
        if (!dialog) return;
        dialog.setAttribute('aria-hidden', 'true');
        dialog.classList.remove('is-visible');
    }

    function selectMemorySyncProvider(provider) {
        const section = root && root.querySelector('.memory-external-section');
        if (!section) return;
        const input = section.querySelector('[data-memory-sync-provider]');
        const label = section.querySelector('[data-memory-sync-provider-label]');
        const option = root.querySelector('[data-memory-sync-provider-option="' + provider + '"]');
        if (!input || !label || !option) return;
        input.value = provider;
        label.textContent = option.dataset.label;
        root.querySelectorAll('[data-memory-sync-provider-option]').forEach((item) => {
            const selected = item === option;
            item.classList.toggle('is-selected', selected);
            item.setAttribute('aria-checked', String(selected));
        });
        closeMemorySyncProviderDialog();
    }

    function makeMemorySettingsCollapsible(section, title, description, icon, status = '未配置') {
        if (!section || section.classList.contains('memory-settings-collapsible')) return;
        const heading = section.querySelector(':scope > h3');
        if (!heading) return;
        const body = document.createElement('div');
        body.className = 'memory-settings-collapsible-body';
        while (heading.nextSibling) body.appendChild(heading.nextSibling);
        const toggle = document.createElement('button');
        toggle.type = 'button';
        toggle.className = 'memory-settings-collapsible-header';
        toggle.setAttribute('aria-expanded', 'false');
        toggle.innerHTML = '<span class="memory-source-icon" aria-hidden="true">' + icon + '</span><span class="memory-source-copy"><strong>' + title + '</strong><small>' + description + '</small></span><span class="memory-source-status" data-memory-section-status>' + status + '</span><svg class="memory-settings-chevron" viewBox="0 0 24 24" aria-hidden="true"><polyline points="6 9 12 15 18 9"></polyline></svg>';
        toggle.addEventListener('click', () => {
            const expanded = section.classList.toggle('is-expanded');
            toggle.setAttribute('aria-expanded', String(expanded));
        });
        section.classList.add('memory-settings-collapsible');
        section.replaceChildren(toggle, body);
    }

    function buildRemoteVectorSection(settings) {
        const section = document.createElement('section');
        section.className = 'memory-settings-section memory-remote-vector-section';
        section.innerHTML = '<h3>其他向量模型</h3><div class="memory-settings-collapsible-body"><p class="memory-semantic-settings-copy">连接第三方向量服务，模型列表和密钥只保存在本机。</p><label class="memory-semantic-settings-input"><span>服务地址</span><input type="url" data-memory-remote-url placeholder="https://api.example.com/v1"></label><label class="memory-semantic-settings-input"><span>API Key</span><input type="password" data-memory-remote-key autocomplete="off" placeholder="用户自己的密钥"></label><label class="memory-semantic-settings-input"><span>模型</span><button type="button" class="memory-remote-model-button" data-memory-action="choose-memory-remote-model" aria-haspopup="dialog"><span data-memory-remote-model-label>未配置</span><svg viewBox="0 0 24 24" aria-hidden="true"><polyline points="9 18 15 12 9 6"></polyline></svg></button><input type="hidden" data-memory-remote-model value="BAAI/bge-m3"></label><div class="memory-sync-actions"><button type="button" data-memory-action="pull-memory-remote-model">拉取模型</button><button type="button" data-memory-action="save-memory-remote-model">保存配置</button></div><p class="memory-composer-error" data-memory-remote-status aria-live="polite"></p></div>';
        return section;
    }

    function remoteVectorConfigFromUi() {
        const section = root.querySelector('.memory-remote-vector-section');
        return {
            provider: 'siliconflow',
            baseUrl: section.querySelector('[data-memory-remote-url]').value.trim(),
            ...(section.querySelector('[data-memory-remote-key]').value.trim() ? { apiKey: section.querySelector('[data-memory-remote-key]').value.trim() } : {}),
            model: section.querySelector('[data-memory-remote-model]').value.trim()
        };
    }

    function renderRemoteVectorConfig(config) {
        const section = root.querySelector('.memory-remote-vector-section');
        if (!section || !config) return;
        section.querySelector('[data-memory-remote-url]').value = config.baseUrl || '';
        if (config.apiKey !== 'configured') section.querySelector('[data-memory-remote-key]').value = config.apiKey || '';
        const models = Array.from(new Set([...(Array.isArray(config.models) ? config.models : []), config.model || 'BAAI/bge-m3'])).filter(Boolean);
        const input = section.querySelector('[data-memory-remote-model]');
        input.value = config.model || models[0] || 'BAAI/bge-m3';
        section.dataset.models = JSON.stringify(models);
        section.querySelector('[data-memory-remote-model-label]').textContent = input.value || '未配置';
        const sourceStatus = section.querySelector('[data-memory-section-status]');
        if (sourceStatus) sourceStatus.textContent = config.apiKey === 'configured' ? '已配置' : '未配置';
        section.querySelector('[data-memory-remote-status]').textContent = config.status === 'error' ? (config.error || '模型拉取失败') : config.models?.length ? ('已保存 ' + config.models.length + ' 个模型') : '';
    }

    async function loadRemoteVectorSettings() {
        const config = await window.SemanticMemory?.initRemote?.().catch(() => null);
        if (config) renderRemoteVectorConfig(config);
    }

    async function pullRemoteVectorModels() {
        const section = root.querySelector('.memory-remote-vector-section');
        const status = section.querySelector('[data-memory-remote-status]');
        status.textContent = '正在拉取模型列表…';
        try {
            const config = await window.SemanticMemory.pullRemoteModels(remoteVectorConfigFromUi());
            renderRemoteVectorConfig(config);
            status.textContent = '模型列表已更新，共 ' + (config.models?.length || 0) + ' 个。';
        } catch (error) { status.textContent = '拉取失败：' + String(error.message || error); }
    }

    async function saveRemoteVectorSettings() {
        const section = root.querySelector('.memory-remote-vector-section');
        const status = section.querySelector('[data-memory-remote-status]');
        try {
            const config = await window.SemanticMemory.saveRemoteConfig(remoteVectorConfigFromUi());
            renderRemoteVectorConfig(config);
            status.textContent = '远程向量模型设置已保存。';
            void renderVectorRebuildStatus();
        } catch (error) { status.textContent = '保存失败：' + String(error.message || error); }
    }

    function openRemoteVectorModelDialog() {
        const section = root.querySelector('.memory-remote-vector-section');
        const dialog = root.querySelector('[data-memory-remote-model-dialog]');
        if (!section || !dialog) return;
        let models = [];
        try { models = JSON.parse(section.dataset.models || '[]'); } catch (_) {}
        const current = section.querySelector('[data-memory-remote-model]').value;
        const list = dialog.querySelector('.memory-choice-list');
        list.replaceChildren(...models.map((model) => {
            const button = document.createElement('button');
            button.type = 'button';
            button.className = 'memory-choice-option' + (model === current ? ' is-selected' : '');
            button.innerHTML = '<span></span><span class="memory-choice-check" aria-hidden="true">✓</span>';
            button.querySelector('span').textContent = model;
            button.addEventListener('click', () => {
                section.querySelector('[data-memory-remote-model]').value = model;
                section.querySelector('[data-memory-remote-model-label]').textContent = model;
                dialog.classList.remove('is-visible');
                dialog.setAttribute('aria-hidden', 'true');
            });
            return button;
        }));
        dialog.classList.add('is-visible');
        dialog.setAttribute('aria-hidden', 'false');
    }

    function adjustSummaryInterval(delta) {
        const input = root && root.querySelector('[data-memory-summary-interval]');
        if (!input) return;
        const current = Number.parseInt(input.value, 10) || summaryIntervalMessages;
        input.value = String(Math.max(MIN_SUMMARY_INTERVAL, Math.min(MAX_SUMMARY_INTERVAL, current + delta)));
    }

    function renderSummaryPromptSettings() {
        if (!root) return;
        const toggle = root.querySelector('[data-memory-summary-prompt-custom]');
        const input = root.querySelector('[data-memory-summary-custom-prompt]');
        const customSection = root.querySelector('[data-memory-summary-custom-prompt-section]');
        if (!toggle || !input || !customSection) return;
        const usesCustomPrompt = summaryPromptMode === SUMMARY_PROMPT_MODE_CUSTOM;
        toggle.checked = usesCustomPrompt;
        toggle.closest('.memory-sync-toggle-row')?.classList.toggle('is-on', usesCustomPrompt);
        input.value = customSummaryPrompt;
        customSection.hidden = !usesCustomPrompt;
        const sectionStatus = root.querySelector('.memory-summary-prompt-section [data-memory-section-status]');
        if (sectionStatus) sectionStatus.textContent = usesCustomPrompt ? '自定义' : '内置';
    }

    function getSemanticModelState() {
        return typeof window.SemanticMemory?.getState === 'function'
            ? window.SemanticMemory.getState()
            : { status: 'unavailable', manifestUrl: '', downloadedBytes: 0, totalBytes: 0, error: '' };
    }

    function renderSemanticModelState(state = getSemanticModelState()) {
        if (!root) return;
        const status = root.querySelector('[data-semantic-model-status]');
        const progress = root.querySelector('[data-semantic-model-progress]');
        const removeButton = root.querySelector('[data-memory-action="remove-semantic-model"]');
        if (!status || !progress || !removeButton) return;
        const labels = {
            'not-configured': '本地语义模型未下载；当前检索使用本地 n-gram',
            downloading: '正在下载',
            ready: state.runtimeStatus === 'ready' ? '语义模型已启用，聊天检索优先使用语义相似度' : (state.runtimeStatus === 'error' ? '语义模型初始化失败；当前检索使用本地 n-gram' : '模型已下载，正在后台初始化语义检索'),
            error: '下载失败',
            unavailable: '当前浏览器不支持'
        };
        const downloaded = Math.max(0, Number(state.downloadedBytes) || 0);
        const total = Math.max(0, Number(state.totalBytes) || 0);
        status.textContent = state.error ? (labels[state.status] || '下载失败') + '：' + state.error : (state.runtimeError ? (labels[state.status] || '语义模型初始化失败') + '：' + state.runtimeError : (labels[state.status] || '未配置模型'));
        if (state.status === 'ready' && state.runtimeStatus === 'ready' && state.runtimeMode === 'single-thread') {
            status.textContent = '语义模型已启用（单线程兼容模式）';
        }
        progress.max = total || 1;
        progress.value = Math.min(downloaded, progress.max);
        progress.hidden = state.status !== 'downloading' && state.status !== 'ready';
        removeButton.hidden = state.status !== 'ready';
        const sourceStatus = root.querySelector('.memory-settings-collapsible .memory-semantic-model-status')?.closest('.memory-settings-collapsible')?.querySelector('[data-memory-section-status]');
        if (sourceStatus) sourceStatus.textContent = state.status === 'ready'
            ? (state.runtimeStatus === 'ready' ? '语义检索已启用' : (state.runtimeStatus === 'error' ? '已回退 n-gram' : '正在初始化'))
            : 'n-gram 检索中';
    }

    function openSemanticSettings() {
        if (!root) return;
        const state = getSemanticModelState();
        const input = root.querySelector('[data-semantic-model-url]');
        input.value = state.manifestUrl || '';
        renderSemanticModelState(state);
        root.classList.add('is-configuring-semantic');
        root.querySelector('[data-memory-semantic-settings]').setAttribute('aria-hidden', 'false');
        requestAnimationFrame(() => input.focus());
    }

    function closeSemanticSettings() {
        if (!root) return;
        root.classList.remove('is-configuring-semantic');
        const semanticSettings = root.querySelector('[data-memory-semantic-settings]');
        if (semanticSettings) semanticSettings.setAttribute('aria-hidden', 'true');
    }

    async function downloadSemanticModel() {
        const input = root.querySelector('[data-semantic-model-url]');
        if (!window.SemanticMemory?.download) {
            renderSemanticModelState({ status: 'unavailable', error: '' });
            return;
        }
        try {
            await window.SemanticMemory.download(input.value.trim(), (downloaded, total) => {
                renderSemanticModelState({ ...window.SemanticMemory.getState(), downloadedBytes: downloaded, totalBytes: total, status: 'downloading' });
            });
            renderSemanticModelState(window.SemanticMemory.getState());
        } catch (error) {
            renderSemanticModelState();
        }
    }

    async function removeSemanticModel() {
        if (!window.SemanticMemory?.remove) return;
        await window.SemanticMemory.remove();
        renderSemanticModelState();
    }

    async function saveSummarySettings() {
        const input = root.querySelector('[data-memory-summary-interval]');
        const error = root.querySelector('[data-memory-summary-error]');
        const rawValue = Number.parseInt(input.value, 10);
        if (!Number.isFinite(rawValue) || rawValue < MIN_SUMMARY_INTERVAL || rawValue > MAX_SUMMARY_INTERVAL) {
            error.textContent = '请输入 ' + MIN_SUMMARY_INTERVAL + ' 到 ' + MAX_SUMMARY_INTERVAL + ' 之间的整数。';
            input.focus();
            return;
        }
        const customToggle = root.querySelector('[data-memory-summary-prompt-custom]');
        const customPromptInput = root.querySelector('[data-memory-summary-custom-prompt]');
        const nextPromptMode = customToggle && customToggle.checked ? SUMMARY_PROMPT_MODE_CUSTOM : SUMMARY_PROMPT_MODE_BUILTIN;
        const nextCustomPrompt = String(customPromptInput && customPromptInput.value || '').trim();
        if (nextPromptMode === SUMMARY_PROMPT_MODE_CUSTOM && !nextCustomPrompt) {
            error.textContent = '启用自定义提示词前，请先填写提示词。';
            customPromptInput.focus();
            return;
        }
        if (nextCustomPrompt.length > MAX_SUMMARY_PROMPT_LENGTH) {
            error.textContent = '自定义提示词不能超过 ' + MAX_SUMMARY_PROMPT_LENGTH + ' 个字符。';
            customPromptInput.focus();
            return;
        }
        const apiSelect = root.querySelector('[data-memory-summary-api-preset]');
        const nextSummaryApiPresetId = String(apiSelect && apiSelect.value || '').trim();
        if (nextSummaryApiPresetId && !cachedSummaryApiPresets.some((item) => String(item.id) === nextSummaryApiPresetId)) {
            error.textContent = '选择的 API 预设已不存在，请重新选择。';
            void renderSummaryApiPresetOptions();
            return;
        }
        summaryIntervalMessages = normalizeSummaryInterval(rawValue);
        summaryIntervalUserConfigured = true;
        summaryPromptMode = nextPromptMode;
        customSummaryPrompt = nextCustomPrompt;
        summaryApiPresetId = nextSummaryApiPresetId;
        const saved = await savePreferences();
        if (!saved) {
            error.textContent = '暂时无法保存，请稍后重试。';
            return;
        }
        closeSummarySettings();
    }

    async function saveManualMemory() {
        const input = root.querySelector('[data-memory-composer-input]');
        const error = root.querySelector('[data-memory-composer-error]');
        const content = input.value.trim();
        if (!content) {
            error.textContent = '先写下一条记忆。';
            input.focus();
            return;
        }
        if (content.length > 30000) {
            error.textContent = '单条记忆不能超过 30000 字。';
            input.focus();
            return;
        }
        const now = new Date().toISOString();
        const existingItem = editingMemoryId && cachedMemoryItems.find((item) => item.id === editingMemoryId && item.bindingId === selectedContactId);
        const item = {
            id: 'memory_' + Date.now() + '_' + Math.random().toString(36).slice(2, 8),
            schemaVersion: MEMORY_SCHEMA_VERSION,
            bindingId: selectedContactId,
            kind: existingItem ? existingItem.kind : (activeTab === 'archive' ? 'memory' : activeTab),
            tier: 'L1',
            status: 'active',
            authority: 'user_confirmed',
            visibility: 'current_binding',
            content,
            lifecycle: getMemoryLifecycle(content),
            keywords: createTextTerms(content),
            sourceRefs: [{ type: existingItem ? 'manual_edit' : 'manual', createdAt: now }],
            supersedes: existingItem ? existingItem.id : '',
            revision: 1,
            retrievalStats: { injectedCount: 0, lastInjectedAt: '', lastInjectedTurn: '', lastScore: 0, lastReasons: [] },
            createdAt: now,
            updatedAt: now
        };
        const baseItems = existingItem
            ? [...cachedMemoryItems.map((memory) => memory.id === existingItem.id ? {
                ...memory,
                status: 'superseded',
                archiveReason: 'superseded',
                supersededBy: item.id,
                updatedAt: now,
                revision: Math.max(1, Number(memory.revision) || 1) + 1
            } : memory), item]
            : [...cachedMemoryItems, item];
        const nextItems = supersedeConflictingEvents(baseItems, selectedContactId, content, item.id, now);
        const nextSummaries = existingItem
            ? cachedSummaries.map((summary) => summary.bindingId === selectedContactId && isWorkingSummary(summary) && summary.status === 'active'
                ? { ...summary, status: 'dirty', updatedAt: now }
                : summary)
            : null;
        const saved = existingItem
            ? await writeMemoryState(nextItems, cachedOutbox, nextSummaries)
            : await writeRecord({ id: MEMORY_ITEMS_KEY, schemaVersion: MEMORY_SCHEMA_VERSION, items: nextItems });
        if (!saved) {
            error.textContent = '暂时无法保存，请稍后重试。';
            return;
        }
        cachedMemoryItems = nextItems;
        if (nextSummaries) cachedSummaries = nextSummaries;
        if (typeof window.MemoryV2?.migrate === 'function') {
            await window.MemoryV2.migrate().catch(error => console.warn('Memory V2 refresh skipped:', error));
        }
        closeComposer();
        render();
        window.MemorySync?.schedule(selectedContactId);
    }

    async function refreshDerivedMemory() {
        if (typeof window.MemoryV2?.migrate === 'function') await window.MemoryV2.migrate();
    }

    function requestDeleteSummary(bindingId, summaryId) {
        const remove = async () => {
            const saved = await deleteSummary(bindingId, summaryId);
            if (saved) render();
            else if (typeof showToast === 'function') showToast('暂时无法删除，请稍后重试。');
        };
        if (typeof showCustomConfirm === 'function') {
            showCustomConfirm('删除总结', '删除后不再引用这条总结，原始聊天会保留。', '删除', true).then(confirmed => { if (confirmed) void remove(); });
        } else if (window.confirm('确定删除这条总结？原始聊天会保留。')) void remove();
    }

    async function archiveMemory(itemId) {
        const item = cachedMemoryItems.find((memory) => memory.id === itemId && memory.bindingId === selectedContactId && memory.status === 'active');
        if (!item) return false;
        const now = new Date().toISOString();
        const nextItems = cachedMemoryItems.map((memory) => memory.id === itemId ? {
            ...memory,
            status: 'archived',
            archiveReason: 'user_deleted',
            updatedAt: now,
            revision: Math.max(1, Number(memory.revision) || 1) + 1
        } : memory);
        const nextSummaries = cachedSummaries.map((summary) => summary.bindingId === selectedContactId && isWorkingSummary(summary) && summary.status === 'active'
            ? { ...summary, status: 'dirty', updatedAt: now }
            : summary);
        const saved = await writeMemoryState(nextItems, cachedOutbox, nextSummaries);
        if (!saved) return false;
        cachedMemoryItems = nextItems;
        cachedSummaries = nextSummaries;
        if (typeof window.MemoryV2?.migrate === 'function') {
            await window.MemoryV2.migrate().catch(error => console.warn('Memory V2 refresh skipped:', error));
        }
        render();
        window.MemorySync?.schedule(selectedContactId);
        return true;
    }

    async function restoreMemory(itemId) {
        const item = cachedMemoryItems.find((memory) => memory && memory.id === itemId && memory.bindingId === selectedContactId && memory.status === 'archived' && memory.content && !memory.deletedAt && memory.archiveReason !== 'source_removed');
        if (!item) return false;
        const now = new Date().toISOString();
        const nextItems = cachedMemoryItems.map((memory) => memory.id === itemId ? {
            ...memory,
            status: 'active',
            restoredAt: now,
            archiveReason: '',
            updatedAt: now,
            revision: Math.max(1, Number(memory.revision) || 1) + 1
        } : memory);
        const saved = await writeRecord({ id: MEMORY_ITEMS_KEY, schemaVersion: MEMORY_SCHEMA_VERSION, items: nextItems });
        if (saved) {
            cachedMemoryItems = nextItems;
            if (typeof window.MemoryV2?.migrate === 'function') {
                await window.MemoryV2.migrate().catch(error => console.warn('Memory V2 refresh skipped:', error));
            }
            render();
            window.MemorySync?.schedule(selectedContactId);
        }
        return saved;
    }

    function requestArchiveMemory(itemId) {
        const archive = async () => {
            const saved = await archiveMemory(itemId);
            if (!saved && typeof showToast === 'function') showToast('暂时无法删除，请稍后重试。');
        };
        if (typeof showCustomConfirm === 'function') {
            showCustomConfirm('删除记忆', '删除后不会再被角色引用。', '删除', true).then((confirmed) => {
                if (confirmed) void archive();
            });
        } else if (window.confirm('删除后不会再被角色引用，确定删除吗？')) {
            void archive();
        }
    }

    async function deleteArchivedMemory(itemId) {
        const item = cachedMemoryItems.find((memory) => memory && memory.id === itemId && memory.bindingId === selectedContactId && memory.status === 'archived');
        if (!item) return false;
        const now = new Date().toISOString();
        // Retain identity, source evidence and a non-reversible fingerprint, never the deleted body.
        const nextItems = cachedMemoryItems.map(memory => memory.id === itemId ? {
            id: memory.id, bindingId: memory.bindingId, tier: memory.tier, kind: memory.kind,
            schemaVersion: MEMORY_SCHEMA_VERSION, status: 'archived', archiveReason: 'user_deleted',
            deletedAt: now, updatedAt: now, revision: (Number(memory.revision) || 1) + 1,
            deletionFingerprint: hashVectorToken(normalizeMemoryText(memory.content).toLocaleLowerCase()),
            sourceRefs: (memory.sourceRefs || []).map(ref => ({ messageId: ref.messageId, type: ref.type })), content: ''
        } : memory);
        const saved = await writeMemoryState(nextItems, cachedOutbox, cachedSummaries);
        if (!saved) return false;
        cachedMemoryItems = nextItems;
        await refreshDerivedMemory();
        window.MemorySync?.schedule(item.bindingId);
        render();
        return true;
    }

    function requestDeleteArchivedMemory(itemId) {
        const remove = async () => {
            const saved = await deleteArchivedMemory(itemId);
            if (!saved && typeof showToast === 'function') showToast('暂时无法删除，请稍后重试。');
        };
        if (typeof showCustomConfirm === 'function') {
            showCustomConfirm('彻底删除记忆', '这条已归档记忆会从本机永久删除，无法恢复。', '删除', true).then((confirmed) => {
                if (confirmed) void remove();
            });
        } else if (window.confirm('这条已归档记忆会从本机永久删除，无法恢复。确定删除吗？')) {
            void remove();
        }
    }

    function requestDeleteArchivedEventNode(nodeId) {
        const remove = async () => {
            if (typeof window.MemoryV2?.deleteEventNode !== 'function') return;
            const saved = await window.MemoryV2.deleteEventNode(nodeId);
            if (!saved) {
                if (typeof showToast === 'function') showToast('暂时无法删除，请稍后重试。');
                return;
            }
            renderReferenceDocument();
        };
        if (typeof showCustomConfirm === 'function') {
            showCustomConfirm('彻底删除事件', '这条已归档事件会从档案中永久删除，无法恢复。', '删除', true).then((confirmed) => {
                if (confirmed) void remove();
            });
        } else if (window.confirm('这条已归档事件会从档案中永久删除，无法恢复。确定删除吗？')) {
            void remove();
        }
    }

    function render() {
        if (!root) return;
        if (getReferenceFrame()) {
            renderReferenceDocument();
            return;
        }
        const contact = cachedContacts.find((item) => item.id === selectedContactId) || null;
        const messages = contact ? getContactMessages(contact.id) : [];
        const name = contact && contact.name ? contact.name.trim() : '尚未选择角色';
        const memoryItems = contact ? getActiveItems(contact.id) : [];

        root.querySelector('[data-memory-name]').textContent = name;
        root.querySelector('[data-memory-status]').textContent = contact ? (memoryItems.length ? '共同记忆档案' : '等待第一条记忆') : '等待选择角色';
        root.querySelector('[data-memory-subtitle]').textContent = contact
            ? '记忆总数：' + memoryItems.length + ' 条'
            : '记忆总数：0 条';
        const memoryCount = root.querySelector('[data-memory-count]');
        if (memoryCount) memoryCount.textContent = String(memoryItems.length);
        root.querySelector('[data-memory-chat-count]').textContent = String(countConversationFloors(messages));
        root.querySelector('[data-memory-days]').textContent = String(getKnownDays(messages));
        root.querySelector('[data-memory-action="add"]').hidden = activeTab === 'archive';
        root.querySelectorAll('[data-memory-tab]').forEach((button) => {
            button.classList.toggle('is-active', button.dataset.memoryTab === activeTab);
            button.classList.toggle('active', button.dataset.memoryTab === activeTab);
            button.setAttribute('aria-selected', String(button.dataset.memoryTab === activeTab));
        });
        setAvatar(contact);
        renderMemoryContent(contact);
        renderRolePicker();
    }

    async function refresh() {
        const accountId = getDynamicUserId();
        const publicationEpoch = memoryPublicationEpoch;
        if (!await ensureLegacyMemoryStorage()) throw new Error(accountId !== getDynamicUserId() ? 'SUMMARY_ACCOUNT_CHANGED' : 'MEMORY_STORAGE_UNAVAILABLE');
        const records = await readRecords([PREFERENCES_KEY, MEMORY_ITEMS_KEY, MEMORY_OUTBOX_KEY, MEMORY_SUMMARIES_KEY, CONTACTS_KEY, CHATS_KEY, 'wechatChatContactIndex']);
        if (accountId !== getDynamicUserId()) throw new Error('SUMMARY_ACCOUNT_CHANGED');
        const contactsData = records[CONTACTS_KEY];
        cachedContacts = Array.isArray(contactsData && contactsData.contacts)
            ? contactsData.contacts.filter((contact) => contact && contact.id)
            : [];
        await refreshConversationCache(records);
        if (accountId !== getDynamicUserId()) throw new Error('SUMMARY_ACCOUNT_CHANGED');
        if (publicationEpoch !== memoryPublicationEpoch) { render(); return; }
        cachedMemoryItems = Array.isArray(records[MEMORY_ITEMS_KEY] && records[MEMORY_ITEMS_KEY].items)
            ? records[MEMORY_ITEMS_KEY].items.map(hydrateMemoryItem).filter((item) => item && item.tier !== 'L3' && item.kind !== 'fragment')
            : [];
        cachedOutbox = [];
        cachedSummaries = Array.isArray(records[MEMORY_SUMMARIES_KEY] && records[MEMORY_SUMMARIES_KEY].items)
            ? records[MEMORY_SUMMARIES_KEY].items.map(hydrateSummary).filter(Boolean)
            : [];

        summaryIntervalMessages = readSummaryInterval(records[PREFERENCES_KEY]);
        summaryIntervalUserConfigured = records[PREFERENCES_KEY]?.summaryIntervalUserConfigured === true
            || (records[PREFERENCES_KEY]?.summaryIntervalUserConfigured !== false && summaryIntervalMessages !== DEFAULT_SUMMARY_INTERVAL);
        ({ mode: summaryPromptMode, customPrompt: customSummaryPrompt } = readSummaryPromptPreferences(records[PREFERENCES_KEY]));
        summaryApiPresetId = readSummaryApiPreference(records[PREFERENCES_KEY]);

        trackMemoryArray(cachedMemoryItems, records[MEMORY_ITEMS_KEY]);
        trackMemoryArray(cachedOutbox, records[MEMORY_OUTBOX_KEY]);
        trackMemoryArray(cachedSummaries, records[MEMORY_SUMMARIES_KEY]);
        memoryStateLoaded = true;
        memoryPublicationEpoch += 1;

        const preferredId = records[PREFERENCES_KEY] && records[PREFERENCES_KEY].selectedContactId;
        if (cachedContacts.some((contact) => contact.id === selectedContactId)) {
            // Keep the current in-app selection while refreshing.
        } else if (cachedContacts.some((contact) => contact.id === preferredId)) {
            selectedContactId = preferredId;
        } else {
            selectedContactId = cachedContacts[0] ? cachedContacts[0].id : '';
        }
        render();
    }

    async function decodeReferenceDocument() {
        return REFERENCE_DOCUMENT_SOURCE;
    }

    function getReferenceFrame() {
        return root && root.querySelector('[data-memory-reference-frame]');
    }

    function openMemoryPriorityDialog(item) {
        const overlay = document.getElementById('customDialogOverlay');
        const dialog = document.getElementById('customDialog');
        if (!overlay || !dialog) return;
        dialog.replaceChildren();
        const text = document.createElement('div');
        text.className = 'custom-dialog-text';
        const title = document.createElement('div');
        title.className = 'custom-dialog-title';
        title.textContent = '片段权重';
        const message = document.createElement('div');
        message.className = 'custom-dialog-message';
        message.textContent = '选择这条片段在对话中的召回优先级';
        text.append(title, message);
        const buttons = document.createElement('div');
        buttons.className = 'custom-dialog-btns';
        [[RETRIEVAL_PRIORITY.pinned, '置顶'], [RETRIEVAL_PRIORITY.normal, '普通'], [RETRIEVAL_PRIORITY.low, '降低']].forEach(([value, label]) => {
            const button = document.createElement('button');
            button.className = 'custom-dialog-btn' + (value === getRetrievalPriority(item) ? ' bold' : '');
            button.textContent = label;
            button.addEventListener('click', () => {
                overlay.classList.remove('show');
                void setMemoryRetrievalPriority(item.id, value);
            });
            buttons.appendChild(button);
        });
        dialog.append(text, buttons);
        overlay.classList.add('show');
    }

    function getReferenceEventStateLabel(state) {
        return ({ open: '待续', occurred: '已发生', completed: '已完成', cancelled: '已取消' })[String(state || '')] || '已记录';
    }

    function getReferenceRelationshipLabel(stage) {
        return ({
            married: '已婚/伴侣',
            engaged: '已订婚',
            cohabiting: '同居伴侣',
            reconciled: '已复合',
            separated: '已分开',
            partners: '恋爱关系',
            friends: '朋友关系',
            family: '家人关系'
        })[String(stage || '')] || '未设置';
    }

    function getReferenceEventSourceLabel(sources) {
        const labels = { wechat: '微信', sms: '短信', meeting: '见面', diary: '日记', icity: 'iCity', manual: '手动' };
        return (Array.isArray(sources) ? sources : []).map(source => labels[source] || source).join(' / ');
    }

    function referenceIconButton(documentRef, title, svgMarkup) {
        const button = documentRef.createElement('button');
        button.type = 'button';
        button.title = title;
        button.setAttribute('aria-label', title);
        button.innerHTML = svgMarkup;
        button.style.cssText = 'border:0;background:transparent;color:#9b9ba0;cursor:pointer;display:flex;align-items:center;justify-content:center;padding:2px;width:24px;height:24px';
        return button;
    }

    // Lucide icons, MIT licensed: https://github.com/lucide-icons/lucide
    function getReferenceLucideSvg(name, size = 18) {
        const icons = {
            info: '<circle cx="12" cy="12" r="10"/><path d="M12 16v-4"/><path d="M12 8h.01"/>',
            x: '<path d="M18 6 6 18"/><path d="m6 6 12 12"/>',
            check: '<path d="M20 6 9 17l-5-5"/>',
            rotateCcw: '<path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/><path d="M3 3v5h5"/>',
            unlink: '<path d="m18.84 12.25 1.72-1.71h-.02a5.004 5.004 0 0 0-.12-7.07 5.006 5.006 0 0 0-6.95 0l-1.72 1.71"/><path d="m5.17 11.75-1.71 1.71a5.004 5.004 0 0 0 .12 7.07 5.006 5.006 0 0 0 6.95 0l1.71-1.71"/><line x1="8" x2="8" y1="2" y2="5"/><line x1="2" x2="5" y1="8" y2="8"/><line x1="16" x2="16" y1="19" y2="22"/><line x1="19" x2="22" y1="16" y2="16"/>'
        };
        const markup = icons[name] || icons.info;
        return '<svg xmlns="http://www.w3.org/2000/svg" width="' + size + '" height="' + size + '" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' + markup + '</svg>';
    }

    function referenceTraceIconButton(documentRef, title, iconName, size = 16) {
        const button = referenceIconButton(documentRef, title, getReferenceLucideSvg(iconName, size));
        button.style.cssText += ';width:28px;height:28px;padding:0;border-radius:50%;background:#f0f0f2;color:#6e6e73;flex:0 0 auto;-webkit-tap-highlight-color:transparent';
        return button;
    }

    function createReferenceTraceBackSvg(documentRef) {
        const svg = documentRef.createElementNS('http://www.w3.org/2000/svg', 'svg');
        svg.setAttribute('xmlns', 'http://www.w3.org/2000/svg');
        svg.setAttribute('width', '24');
        svg.setAttribute('height', '24');
        svg.setAttribute('viewBox', '0 0 24 24');
        svg.setAttribute('fill', 'none');
        svg.setAttribute('stroke', 'currentColor');
        svg.setAttribute('stroke-width', '2');
        svg.setAttribute('stroke-linecap', 'round');
        svg.setAttribute('stroke-linejoin', 'round');
        svg.setAttribute('role', 'button');
        svg.setAttribute('tabindex', '0');
        svg.setAttribute('aria-label', '返回');
        svg.classList.add('memory-trace-back');
        svg.innerHTML = '<path d="m12 19-7-7 7-7"></path><path d="M19 12H5"></path>';
        return svg;
    }

    function toReferenceDateTimeLocal(value) {
        const timestamp = Number(value);
        if (!Number.isFinite(timestamp) || timestamp <= 0) return '';
        const date = new Date(timestamp);
        const local = new Date(date.getTime() - date.getTimezoneOffset() * 60000);
        return local.toISOString().slice(0, 16);
    }

    function createReferenceEditorField(documentRef, labelText, control) {
        const label = documentRef.createElement('label');
        label.style.cssText = 'display:grid;gap:6px;margin-top:12px;color:#6e6e73;font:12px/1.35 -apple-system,BlinkMacSystemFont,"SF Pro Text",sans-serif';
        const span = documentRef.createElement('span');
        span.textContent = labelText;
        control.style.cssText += ';width:100%;box-sizing:border-box;border:0;border-radius:10px;background:#f2f2f7;color:#1c1c1e;padding:10px 11px;font:14px/1.45 -apple-system,BlinkMacSystemFont,"SF Pro Text",sans-serif;outline:0';
        label.append(span, control);
        return label;
    }

    function openReferenceRelationshipEditor(documentRef, contact) {
        if (!contact || typeof window.MemoryV2?.setRelationshipOverride !== 'function') return;
        const current = typeof window.MemoryV2?.getCurrentState === 'function'
            ? window.MemoryV2.getCurrentState(contact.id)?.relationship
            : null;
        const overlay = documentRef.createElement('div');
        overlay.className = 'switcher-overlay is-visible';
        const sheet = documentRef.createElement('div');
        sheet.className = 'modal-card';
        sheet.style.cssText = 'height:auto;min-height:280px;width:320px;display:block;padding:18px 16px;box-sizing:border-box';
        const title = documentRef.createElement('h3');
        title.className = 'modal-card-title';
        title.textContent = '调整当前关系';

        const stage = documentRef.createElement('select');
        [
            ['', '选择关系阶段'],
            ['friends', '朋友'],
            ['partners', '恋爱关系'],
            ['separated', '已分开'],
            ['reconciled', '已复合'],
            ['cohabiting', '同居伴侣'],
            ['engaged', '已订婚'],
            ['married', '已婚/伴侣'],
            ['family', '家人关系']
        ].forEach(([value, label]) => {
            const option = documentRef.createElement('option');
            option.value = value;
            option.textContent = label;
            stage.appendChild(option);
        });
        stage.value = current?.stage && current.stage !== 'unknown' ? current.stage : '';

        const note = documentRef.createElement('textarea');
        note.rows = 3;
        note.maxLength = 600;
        note.placeholder = '可补一句说明，例如“我们今天正式复合了”';
        note.value = current?.content || '';

        const helper = documentRef.createElement('p');
        helper.style.cssText = 'margin:10px 0 0;color:#8e8e93;font:12px/1.5 -apple-system,BlinkMacSystemFont,"SF Pro Text",sans-serif';
        helper.textContent = current?.source === 'manual_override'
            ? '当前关系是手动确认状态。'
            : '保存后会以“用户确认”覆盖自动推断；可以随时恢复自动判断。';

        const actions = documentRef.createElement('div');
        actions.style.cssText = 'display:flex;align-items:center;justify-content:flex-end;gap:16px;margin-top:16px';
        const reset = documentRef.createElement('button');
        reset.type = 'button';
        reset.textContent = '恢复自动';
        reset.style.cssText = 'margin-right:auto;border:0;background:transparent;color:#8e8e93;font:600 14px -apple-system,BlinkMacSystemFont,"SF Pro Text",sans-serif';
        const cancel = documentRef.createElement('button');
        cancel.type = 'button';
        cancel.textContent = '取消';
        const save = documentRef.createElement('button');
        save.type = 'button';
        save.textContent = '保存';
        [cancel, save].forEach(button => { button.style.cssText = 'border:0;background:transparent;color:#007AFF;font:600 15px -apple-system,BlinkMacSystemFont,"SF Pro Text",sans-serif'; });

        cancel.addEventListener('click', () => overlay.remove());
        reset.addEventListener('click', async () => {
            if (typeof window.MemoryV2?.clearRelationshipOverride === 'function') {
                await window.MemoryV2.clearRelationshipOverride(contact.id);
            }
            overlay.remove();
            renderReferenceDocument();
        });
        save.addEventListener('click', async () => {
            if (!stage.value) {
                stage.setCustomValidity('请选择关系阶段');
                stage.reportValidity();
                stage.setCustomValidity('');
                return;
            }
            await window.MemoryV2.setRelationshipOverride(contact.id, stage.value, note.value.trim());
            overlay.remove();
            renderReferenceDocument();
        });

        actions.append(reset, cancel, save);
        sheet.append(title, createReferenceEditorField(documentRef, '关系阶段', stage), createReferenceEditorField(documentRef, '说明', note), helper, actions);
        overlay.appendChild(sheet);
        overlay.addEventListener('click', event => { if (event.target === overlay) overlay.remove(); });
        documentRef.body.appendChild(overlay);
    }

    function openReferenceEventEditor(documentRef, eventNode = null) {
        const contact = cachedContacts.find(item => item.id === selectedContactId);
        if (!contact || typeof window.MemoryV2?.createManualEvent !== 'function') return;

        const overlay = documentRef.createElement('div');
        overlay.className = 'switcher-overlay is-visible';
        const sheet = documentRef.createElement('div');
        sheet.className = 'modal-card';
        sheet.style.cssText = 'height:auto;max-height:84vh;overflow:auto;width:326px;display:block;padding:18px 16px;box-sizing:border-box';
        const title = documentRef.createElement('h3');
        title.className = 'modal-card-title';
        title.textContent = eventNode ? '编辑相关事件' : '新增相关事件';

        const text = documentRef.createElement('textarea');
        text.rows = 4;
        text.maxLength = 2200;
        text.placeholder = '写下事件，例如“周六一起去看电影”';
        text.value = eventNode?.canonicalText || '';

        const stateSelect = documentRef.createElement('select');
        [
            ['auto', eventNode ? '自动判断（当前：' + getReferenceEventStateLabel(eventNode.state) + '）' : '自动判断'],
            ['open', '待续'],
            ['occurred', '已发生'],
            ['completed', '已完成'],
            ['cancelled', '已取消']
        ].forEach(([value, label]) => {
            const option = documentRef.createElement('option');
            option.value = value;
            option.textContent = label;
            stateSelect.appendChild(option);
        });
        stateSelect.value = eventNode?.manualState || 'auto';

        const due = documentRef.createElement('input');
        due.type = 'datetime-local';
        const initialDue = toReferenceDateTimeLocal(eventNode?.dueAt || 0);
        due.value = initialDue;

        const relationship = documentRef.createElement('select');
        [
            ['auto', '关系：自动判断'],
            ['none', '关系：这条事件不改变关系'],
            ['friends', '关系：朋友'],
            ['partners', '关系：恋爱'],
            ['separated', '关系：已分开'],
            ['reconciled', '关系：已复合'],
            ['cohabiting', '关系：同居'],
            ['engaged', '关系：订婚'],
            ['married', '关系：已婚/伴侣'],
            ['family', '关系：家人']
        ].forEach(([value, label]) => {
            const option = documentRef.createElement('option');
            option.value = value;
            option.textContent = label;
            relationship.appendChild(option);
        });
        relationship.value = eventNode?.manualRelationshipStage === null || eventNode?.manualRelationshipStage === undefined
            ? 'auto'
            : (eventNode.manualRelationshipStage || 'none');

        const actor = documentRef.createElement('select');
        [['user', '用户事项'], ['character', '角色事项'], ['shared', '共同事项']].forEach(([value, label]) => {
            const option = documentRef.createElement('option');
            option.value = value;
            option.textContent = label;
            actor.appendChild(option);
        });
        actor.value = 'shared';

        const source = documentRef.createElement('p');
        source.style.cssText = 'margin:10px 0 0;color:#8e8e93;font:12px/1.5 -apple-system,BlinkMacSystemFont,"SF Pro Text",sans-serif';
        if (eventNode) {
            const sourceLabel = getReferenceEventSourceLabel(eventNode.sourceApps);
            source.textContent = (sourceLabel ? '来源：' + sourceLabel + ' · ' : '') + (eventNode.manualEdited ? '已有手动修订' : '自动整理');
        } else {
            source.textContent = '手动新增的事件会标记为用户确认，可随时再编辑或隐藏。';
        }

        const linkedSources = documentRef.createElement('div');
        linkedSources.style.cssText = 'display:grid;gap:7px;margin-top:12px';
        const visibleObservations = Array.isArray(eventNode?.observations) ? eventNode.observations : [];
        if (visibleObservations.length > 1 && typeof window.MemoryV2?.detachEventObservation === 'function') {
            const linkedTitle = documentRef.createElement('div');
            linkedTitle.textContent = '关联来源';
            linkedTitle.style.cssText = 'color:#6e6e73;font:12px/1.35 -apple-system,BlinkMacSystemFont,"SF Pro Text",sans-serif';
            linkedSources.appendChild(linkedTitle);
            visibleObservations.forEach(observation => {
                const row = documentRef.createElement('div');
                row.style.cssText = 'display:grid;grid-template-columns:minmax(0,1fr) 28px;gap:8px;align-items:center;padding:9px 10px;border-radius:10px;background:#f2f2f7';
                const copy = documentRef.createElement('div');
                copy.style.cssText = 'min-width:0;color:#3a3a3c;font:12px/1.4 -apple-system,BlinkMacSystemFont,"SF Pro Text",sans-serif';
                const sourceName = getReferenceEventSourceLabel([observation.sourceApp]) || observation.sourceApp || '来源';
                copy.textContent = sourceName + ' · ' + String(observation.text || '').replace(/\s+/g, ' ').slice(0, 72);
                const detach = referenceIconButton(documentRef, '拆分错误关联', '<svg viewBox="0 0 24 24" style="width:16px;height:16px;stroke:currentColor;fill:none;stroke-width:2;stroke-linecap:round;stroke-linejoin:round"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"></path><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"></path><path d="M8 8l8 8"></path></svg>');
                detach.addEventListener('click', async () => {
                    const confirmed = typeof window.showCustomConfirm === 'function'
                        ? await window.showCustomConfirm('拆分关联来源', '这条来源会从当前事件中拆出去，成为独立事件；原始短信、日记或聊天记录不会删除。', '拆分', false)
                        : window.confirm('把这条来源从当前事件中拆分出去？');
                    if (!confirmed) return;
                    await window.MemoryV2.detachEventObservation(eventNode.id, observation.sourceApp, observation.sourceId);
                    overlay.remove();
                    renderReferenceDocument();
                });
                row.append(copy, detach);
                linkedSources.appendChild(row);
            });
        }

        const linkedMemories = documentRef.createElement('div');
        linkedMemories.style.cssText = 'display:grid;gap:7px;margin-top:12px';
        if (eventNode && typeof window.MemoryV2?.getEventNodeTrace === 'function') {
            const eventTrace = window.MemoryV2.getEventNodeTrace(eventNode.id, contact.id);
            const memories = Array.isArray(eventTrace?.linkedMemories) ? eventTrace.linkedMemories : [];
            if (memories.length) {
                const linkedTitle = documentRef.createElement('div');
                linkedTitle.textContent = '关联记忆';
                linkedTitle.style.cssText = 'color:#6e6e73;font:12px/1.35 -apple-system,BlinkMacSystemFont,"SF Pro Text",sans-serif';
                linkedMemories.appendChild(linkedTitle);
                memories.slice(0, 8).forEach(memory => {
                    const row = documentRef.createElement('div');
                    row.style.cssText = 'display:grid;grid-template-columns:minmax(0,1fr) 28px;gap:8px;align-items:center;padding:9px 10px;border-radius:10px;background:#f2f2f7';
                    const copy = documentRef.createElement('div');
                    copy.style.cssText = 'min-width:0;display:grid;gap:3px';
                    const meta = documentRef.createElement('div');
                    meta.textContent = memory.memoryTypeLabel + ' · 证据' + memory.evidence.label + ' ' + memory.evidence.score + '%';
                    meta.style.cssText = 'color:#8e8e93;font:11px/1.35 -apple-system,BlinkMacSystemFont,"SF Pro Text",sans-serif';
                    const body = documentRef.createElement('div');
                    body.textContent = memory.content;
                    body.style.cssText = 'overflow:hidden;text-overflow:ellipsis;white-space:nowrap;color:#3a3a3c;font:12px/1.4 -apple-system,BlinkMacSystemFont,"SF Pro Text",sans-serif';
                    copy.append(meta, body);
                    const memoryItem = cachedMemoryItems.find(item => item.id === memory.id);
                    const inspect = referenceIconButton(documentRef, '查看这条记忆依据', '<svg viewBox="0 0 24 24" style="width:16px;height:16px;stroke:currentColor;fill:none;stroke-width:2;stroke-linecap:round;stroke-linejoin:round"><circle cx="12" cy="12" r="9"></circle><path d="M12 11v6"></path><path d="M12 7h.01"></path></svg>');
                    inspect.disabled = !memoryItem;
                    inspect.style.opacity = memoryItem ? '1' : '.35';
                    inspect.addEventListener('click', () => {
                        if (memoryItem) void openReferenceMemoryTrace(documentRef, memoryItem);
                    });
                    row.append(copy, inspect);
                    linkedMemories.appendChild(row);
                });
            }
        }

        const actions = documentRef.createElement('div');
        actions.style.cssText = 'display:flex;align-items:center;justify-content:flex-end;gap:14px;margin-top:16px';
        const cancel = documentRef.createElement('button');
        cancel.type = 'button';
        cancel.textContent = '取消';
        const save = documentRef.createElement('button');
        save.type = 'button';
        save.textContent = '保存';
        [cancel, save].forEach(button => { button.style.cssText = 'border:0;background:transparent;color:#007AFF;font:600 15px -apple-system,BlinkMacSystemFont,"SF Pro Text",sans-serif'; });
        cancel.addEventListener('click', () => overlay.remove());

        if (eventNode?.manualEdited && typeof window.MemoryV2?.resetEventNodeOverride === 'function') {
            const reset = documentRef.createElement('button');
            reset.type = 'button';
            reset.textContent = '恢复自动';
            reset.style.cssText = 'margin-right:auto;border:0;background:transparent;color:#8e8e93;font:600 14px -apple-system,BlinkMacSystemFont,"SF Pro Text",sans-serif';
            reset.addEventListener('click', async () => {
                await window.MemoryV2.resetEventNodeOverride(eventNode.id);
                overlay.remove();
                renderReferenceDocument();
            });
            actions.appendChild(reset);
        }

        save.addEventListener('click', async () => {
            const content = text.value.trim();
            if (!content) {
                text.setCustomValidity('请输入事件内容');
                text.reportValidity();
                text.setCustomValidity('');
                return;
            }
            const relationshipStage = relationship.value === 'none' ? '' : relationship.value;
            const dueChanged = due.value !== initialDue;
            const dueAt = !eventNode
                ? (due.value ? new Date(due.value).getTime() : 'auto')
                : (!dueChanged && eventNode.manualDueAt === null
                    ? 'auto'
                    : (due.value ? new Date(due.value).getTime() : 0));
            if (eventNode) {
                await window.MemoryV2.updateEventNode(eventNode.id, {
                    text: content,
                    state: stateSelect.value,
                    dueAt,
                    relationshipStage,
                    relationshipText: content
                });
            } else {
                await window.MemoryV2.createManualEvent({
                    bindingId: contact.id,
                    actor: actor.value,
                    text: content,
                    state: stateSelect.value,
                    dueAt,
                    relationshipStage,
                    relationshipText: content
                });
            }
            overlay.remove();
            renderReferenceDocument();
        });

        actions.append(cancel, save);
        sheet.append(
            title,
            createReferenceEditorField(documentRef, '事件内容', text),
            ...(eventNode ? [] : [createReferenceEditorField(documentRef, '归属', actor)]),
            createReferenceEditorField(documentRef, '状态', stateSelect),
            createReferenceEditorField(documentRef, '时间（可留空）', due),
            createReferenceEditorField(documentRef, '关系影响', relationship),
            source,
            linkedSources,
            linkedMemories,
            actions
        );
        overlay.appendChild(sheet);
        overlay.addEventListener('click', event => { if (event.target === overlay) overlay.remove(); });
        documentRef.body.appendChild(overlay);
        requestAnimationFrame(() => text.focus());
    }


    // Memory home dashboard icons use MingCute Icons SVGs (Apache-2.0).
    // Source: https://github.com/mingcute-design/mingcute-icons/tree/main/assets/svg/core
    // The already-approved star stays on Material Symbols Rounded; other dashboard icons use MingCute.
    function getMemoryHomeSvg(name, size = 20) {
        const icons = {
            clock: {
                viewBox: '0 0 24 24',
                markup: '<path d="M12 2C17.5228 2 22 6.47715 22 12C22 17.5228 17.5228 22 12 22C6.47715 22 2 17.5228 2 12C2 6.47715 6.47715 2 12 2ZM12 6C11.4477 6 11 6.44772 11 7V12C11 12.2652 11.1054 12.5195 11.293 12.707L14.293 15.707C14.6835 16.0976 15.3165 16.0976 15.707 15.707C16.0976 15.3165 16.0976 14.6835 15.707 14.293L13 11.5859V7C13 6.44772 12.5523 6 12 6Z" fill="currentColor"/>'
            },
            star: {
                viewBox: '0 -960 960 960',
                markup: '<path d="M480-269 294-157q-8 5-17 4.5t-16-5.5q-7-5-10.5-13t-1.5-18l49-212-164-143q-8-7-9.5-15.5t.5-16.5q2-8 9-13.5t17-6.5l217-19 84-200q4-9 12-13.5t16-4.5q8 0 16 4.5t12 13.5l84 200 217 19q10 1 17 6.5t9 13.5q2 8 .5 16.5T826-544L662-401l49 212q2 10-1.5 18T699-158q-7 5-16 5.5t-17-4.5L480-269Z" fill="currentColor"/>'
            },
            file: {
                viewBox: '0 0 24 24',
                markup: '<path d="M12 8.5C12 9.32843 12.6716 10 13.5 10H20V20C20 21.1046 19.1046 22 18 22H6C4.89543 22 4 21.1046 4 20V4C4 2.89543 4.89543 2 6 2H12V8.5ZM9 16C8.44772 16 8 16.4477 8 17C8 17.5523 8.44772 18 9 18H15C15.5523 18 16 17.5523 16 17C16 16.4477 15.5523 16 15 16H9ZM9 12C8.44772 12 8 12.4477 8 13C8 13.5523 8.44772 14 9 14H10C10.5523 14 11 13.5523 11 13C11 12.4477 10.5523 12 10 12H9ZM14 2.04395C14.3759 2.12355 14.7241 2.31009 15 2.58594L19.4141 7C19.6899 7.2758 19.8754 7.62418 19.9551 8H14V2.04395Z" fill="currentColor"/>'
            },
            history: {
                viewBox: '0 0 24 24',
                markup: '<path d="M2.90674 6.75016C5.80623 1.72809 12.2284 0.00691557 17.2505 2.90641C21.0202 5.08289 22.9265 9.24225 22.4214 13.3009C22.3656 13.7489 22.2807 14.1959 22.1655 14.6388C21.8348 15.9104 20.2382 16.2337 19.4126 15.2853L17.1616 12.6974C16.1287 11.5104 17.2495 9.70174 18.772 10.0988L19.2895 10.2345C18.8228 8.30948 17.5993 6.57254 15.7505 5.50504C12.1633 3.43398 7.57644 4.66297 5.50537 8.25016C3.43433 11.8374 4.6633 16.4242 8.25049 18.4953C10.7984 19.9662 13.853 19.7738 16.1538 18.2472L16.4849 18.0148C17.1574 17.543 18.0843 17.7004 18.564 18.3673C19.0435 19.0342 18.8979 19.9628 18.2368 20.4504C18.1041 20.5482 17.9692 20.6424 17.8325 20.7336C14.6172 22.8775 10.3295 23.1593 6.75049 21.0929C1.7285 18.1935 0.00746071 11.7722 2.90674 6.75016ZM12.0005 5.50016C12.8287 5.50042 13.5005 6.1719 13.5005 7.00016V11.3791L15.561 13.4396C16.1465 14.0253 16.1465 14.975 15.561 15.5607C14.9752 16.1465 14.0247 16.1465 13.439 15.5607L10.939 13.0607C10.6578 12.7794 10.5005 12.3979 10.5005 12.0002V7.00016C10.5005 6.17173 11.1721 5.50016 12.0005 5.50016Z" fill="currentColor"/>'
            },
            message: {
                viewBox: '0 0 24 24',
                markup: '<path d="M2 11.5C2 6.64261 6.65561 3 12 3C17.3444 3 22 6.64261 22 11.5C22 16.3574 17.3444 20 12 20C11.3472 20 10.708 19.9469 10.0886 19.8452C9.99597 19.918 9.83571 20.0501 9.63851 20.1891C9.0713 20.5887 8.24917 21 7 21C6.44772 21 6 20.5523 6 20C6 19.4499 6.14332 18.7663 5.90624 18.2438C3.57701 16.7225 2 14.2978 2 11.5Z" fill="currentColor"/>'
            },
            users: {
                viewBox: '0 0 24 24',
                markup: '<path d="M12 12C13.8729 12 15.5706 12.6199 16.8145 13.4873C17.9979 14.3126 19 15.5383 19 16.8574C18.9999 17.5817 18.6909 18.1813 18.2041 18.6279C17.7461 19.0481 17.1481 19.3204 16.5322 19.5068C15.3009 19.8795 13.6803 20 12 20C10.3197 20 8.69911 19.8795 7.46777 19.5068C6.8519 19.3204 6.25395 19.0481 5.7959 18.6279C5.30911 18.1813 5.00008 17.5817 5 16.8574C5 15.5383 6.0021 14.3126 7.18555 13.4873C8.42945 12.6199 10.1271 12 12 12ZM5 13C5.13184 13 5.26217 13.005 5.39062 13.0156C4.4215 13.9246 3.57145 15.1747 3.50391 16.666L3.5 16.8574L3.50586 17.0781C3.52234 17.3779 3.57298 17.6637 3.65137 17.9346C3.27123 17.8931 2.91009 17.8296 2.58887 17.7324C2.24434 17.6281 1.86583 17.4636 1.55957 17.1826C1.22456 16.8753 1.00004 16.4459 1 15.9287C1 15.0238 1.66609 14.2797 2.30664 13.833C3.00763 13.3442 3.95559 13 5 13ZM19 13C20.0444 13 20.9924 13.3442 21.6934 13.833C22.3339 14.2797 23 15.0238 23 15.9287C23 16.4459 22.7754 16.8753 22.4404 17.1826C22.1342 17.4636 21.7557 17.6281 21.4111 17.7324C21.0899 17.8296 20.7287 17.8921 20.3486 17.9336C20.4458 17.5973 20.5 17.2378 20.5 16.8574C20.5 15.2815 19.6187 13.9633 18.6084 13.0156C18.7372 13.005 18.8678 13 19 13ZM5.5 7C6.88071 7 8 8.11929 8 9.5C8 10.8807 6.88071 12 5.5 12C4.11929 12 3 10.8807 3 9.5C3 8.11929 4.11929 7 5.5 7ZM18.5 7C19.8807 7 21 8.11929 21 9.5C21 10.8807 19.8807 12 18.5 12C17.1193 12 16 10.8807 16 9.5C16 8.11929 17.1193 7 18.5 7ZM12 3C14.2091 3 16 4.79086 16 7C16 9.20914 14.2091 11 12 11C9.79086 11 8 9.20914 8 7C8 4.79086 9.79086 3 12 3Z" fill="currentColor"/>'
            },
            brain: {
                viewBox: '0 0 24 24',
                markup: '<path d="M15 3C17.2091 3 19 4.79086 19 7V8.12598C20.7252 8.57002 22 10.1362 22 12C22 13.8638 20.7252 15.43 19 15.874V17C19 19.2091 17.2091 21 15 21C13.8053 21 12.7329 20.4759 12 19.6455C11.2671 20.4759 10.1947 21 9 21C6.79086 21 5 19.2091 5 17V15.874C3.27477 15.43 2 13.8638 2 12C2 10.1362 3.27477 8.57002 5 8.12598V7C5 4.79086 6.79086 3 9 3C10.1947 3 11.2671 3.52407 12 4.35449C12.7329 3.52407 13.8053 3 15 3ZM12 6C11.4478 6.00014 11 6.4478 11 7V11.5361C10.4117 11.1957 9.72858 11 9 11C8.44783 11.0001 8 11.4478 8 12C8 12.5522 8.44783 12.9999 9 13C10.1045 13.0001 11 13.8955 11 15V17C11 17.5522 11.4478 17.9999 12 18C12.5522 17.9999 13 17.5522 13 17V15C13 13.8955 13.8955 13.0001 15 13C15.5522 12.9999 16 12.5522 16 12C16 11.4478 15.5522 11.0001 15 11C14.2713 11 13.5884 11.1957 13 11.5361V7C13 6.4478 12.5522 6.00014 12 6Z" fill="currentColor"/>'
            },
            user: {
                viewBox: '0 0 24 24',
                markup: '<path d="M12 13C14.3955 13 16.5753 13.6941 18.1777 14.6719C18.9785 15.1605 19.6624 15.7361 20.1562 16.3613C20.6422 16.9765 21 17.713 21 18.5C21 19.3449 20.5886 20.0115 19.9971 20.4863C19.4366 20.9361 18.6982 21.2335 17.9131 21.4414C16.3356 21.8592 14.229 22 12 22C9.77101 22 7.66442 21.8592 6.08691 21.4414C5.30185 21.2335 4.5634 20.9361 4.00293 20.4863C3.41141 20.0115 3 19.3449 3 18.5C3 17.713 3.35783 16.9765 3.84375 16.3613C4.33762 15.7361 5.02151 15.1605 5.82227 14.6719C7.42466 13.6941 9.60453 13 12 13ZM12 2C14.7614 2 17 4.23858 17 7C17 9.76142 14.7614 12 12 12C9.23858 12 7 9.76142 7 7C7 4.23858 9.23858 2 12 2Z" fill="currentColor"/>'
            },
            heart: {
                viewBox: '0 0 24 24',
                markup: '<path d="M18.4938 3.801C20.5893 5.0219 22.0628 7.50064 21.9979 10.3928C21.861 16.4997 13.5 20.9997 12 20.9997C10.5 20.9997 2.13902 16.4997 2.00206 10.3928C1.9372 7.50064 3.41065 5.0219 5.50615 3.801C7.46612 2.65907 9.92814 2.65295 12 4.33823C14.0719 2.65295 16.5339 2.65907 18.4938 3.801Z" fill="currentColor"/>'
            },
            lightbulb: {
                viewBox: '0 0 24 24',
                markup: '<path fill-rule="evenodd" clip-rule="evenodd" d="M12 2C7.30558 2 3.5 5.80558 3.5 10.5C3.5 13.3732 4.92556 15.9134 7.10795 17.452L8.55279 20.3416C9.06096 21.358 10.0998 22 11.2361 22H12.7639C13.9002 22 14.939 21.358 15.4472 20.3416L16.892 17.452C19.0744 15.9134 20.5 13.3732 20.5 10.5C20.5 5.80558 16.6944 2 12 2ZM14.0003 18.7633C13.3588 18.918 12.689 19 12 19C11.311 19 10.6412 18.918 9.99968 18.7633L10.3416 19.4472C10.511 19.786 10.8573 20 11.2361 20H12.7639C13.1427 20 13.489 19.786 13.6584 19.4472L14.0003 18.7633Z" fill="currentColor"/>'
            },
            chevron: {
                viewBox: '0 0 24 24',
                markup: '<path d="M10.9999 9.17157L13.8284 12L10.9999 14.8284" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>'
            },
            edit: {
                viewBox: '0 0 24 24',
                markup: '<path d="M17.8274 13.241L10.6536 20.4148C10.2785 20.7899 9.76896 21.0008 9.23853 21.0008H4.0061C3.44844 21.0006 2.99634 20.5478 2.99634 19.99V14.7576C2.9964 14.2273 3.20726 13.7186 3.58228 13.3435L10.7561 6.16971L17.8274 13.241ZM13.8958 3.03006C14.6768 2.24905 15.9428 2.24913 16.7239 3.03006L20.967 7.27225C21.7481 8.0533 21.7481 9.32031 20.967 10.1014L19.2415 11.8269L12.1702 4.75565L13.8958 3.03006Z" fill="currentColor"/>'
            },
            trash: {
                viewBox: '0 0 24 24',
                markup: '<path fill-rule="evenodd" clip-rule="evenodd" d="M7.82339 3.36754C8.09562 2.55086 8.8599 2 9.72076 2H14.2792C15.1401 2 15.9044 2.55086 16.1766 3.36754L16.7208 5H18.9903C18.9961 4.99995 19.0019 4.99995 19.0078 5H20C20.5523 5 21 5.44772 21 6C21 6.55228 20.5523 7 20 7H19.9356L19.1222 19.1996C19.0172 20.7754 17.7083 22 16.1289 22H7.87111C6.29171 22 4.98281 20.7754 4.87775 19.1996L4.06445 7H4C3.44772 7 3 6.55228 3 6C3 5.44772 3.44772 5 4 5H4.99225C4.99809 4.99995 5.00392 4.99995 5.00974 5H7.27924L7.82339 3.36754ZM14.6126 5H9.38743L9.72076 4H14.2792L14.6126 5ZM9 10C9.55228 10 10 10.4477 10 11V17C10 17.5523 9.55228 18 9 18C8.44772 18 8 17.5523 8 17V11C8 10.4477 8.44772 10 9 10ZM15 10C15.5523 10 16 10.4477 16 11V17C16 17.5523 15.5523 18 15 18C14.4477 18 14 17.5523 14 17V11C14 10.4477 14.4477 10 15 10Z" fill="currentColor"/>'
            },
            circle: {
                viewBox: '0 -960 960 960',
                markup: '<path d="M480-80q-82 0-155-31.5t-127.5-86Q143-252 111.5-325T80-480q0-83 31.5-156t86-127Q252-817 325-848.5T480-880q83 0 156 31.5T763-763q54 54 85.5 127T880-480q0 82-31.5 155T763-197.5q-54 54.5-127 86T480-80Z" fill="currentColor"/>'
            }
        };
        const icon = icons[name] || icons.circle;
        return '<svg class="memory-home-svg" width="' + size + '" height="' + size + '" viewBox="' + icon.viewBox + '" aria-hidden="true">' + icon.markup + '</svg>';
    }

    function parseMemoryHomeTime(value) {
        if (value instanceof Date) return Number.isFinite(value.getTime()) ? value.getTime() : 0;
        const numeric = Number(value);
        if (Number.isFinite(numeric) && numeric > 0) return numeric < 1e12 ? numeric * 1000 : numeric;
        const text = String(value || '').trim().replace(/^【|】$/g, '')
            .replace(/^(\d{4})年(\d{1,2})月(\d{1,2})日/, '$1/$2/$3');
        const parsed = Date.parse(text);
        return Number.isFinite(parsed) ? parsed : 0;
    }

    function formatMemoryHomeTime(value) {
        const timestamp = parseMemoryHomeTime(value);
        if (!timestamp) return '';
        const date = new Date(timestamp);
        const now = new Date();
        const sameDay = date.getFullYear() === now.getFullYear() && date.getMonth() === now.getMonth() && date.getDate() === now.getDate();
        const yesterday = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 1);
        const isYesterday = date.getFullYear() === yesterday.getFullYear() && date.getMonth() === yesterday.getMonth() && date.getDate() === yesterday.getDate();
        const hhmm = String(date.getHours()).padStart(2, '0') + ':' + String(date.getMinutes()).padStart(2, '0');
        if (sameDay) return '今天 ' + hhmm;
        if (isYesterday) return '昨天 ' + hhmm;
        return (date.getMonth() + 1) + '/' + date.getDate() + ' ' + hhmm;
    }

    function getMemoryHomeType(item) {
        return String(item?.v2?.memoryType || item?.memoryType || '').trim();
    }

    function getMemoryHomeSubjectKind(item) {
        return String(item?.v2?.subjectKind || item?.subjectKind || item?.subjectType || '').trim();
    }

    function getMemoryHomeLatestEventTime(node) {
        let latest = 0;
        (Array.isArray(node?.observations) ? node.observations : []).forEach((observation) => {
            latest = Math.max(latest, parseMemoryHomeTime(observation?.occurredAt));
        });
        return latest || parseMemoryHomeTime(node?.updatedAt || node?.createdAt);
    }

    function getMemoryHomeViewModel(contact) {
        if (!contact) {
            return {
                pendingItems: [],
                importantItems: [],
                recentEvents: [],
                cognition: { identity: '', preference: '', relationship: '' },
                recallReason: null,
                analyzed: false
            };
        }

        const bindingId = contact.id;
        const summary = getEffectiveAnalysisSummary(bindingId);
        const analysis = summary?.archiveAnalysis && typeof summary.archiveAnalysis === 'object'
            ? summary.archiveAnalysis
            : null;
        const activeItems = cachedMemoryItems
            .filter((item) => item && item.bindingId === bindingId && item.status === 'active' && item.tier === 'L1');
        const byContent = new Map(activeItems.map((item) => [normalizeMemoryText(item.content).toLocaleLowerCase(), item]));
        const messages = Array.isArray(cachedConversations?.[bindingId]) ? cachedConversations[bindingId] : [];
        const messageById = new Map(messages.map((message) => [String(message?.id || message?.msgId || message?.localId || ''), message]));

        const sourceTimestamp = (ids) => {
            let latest = 0;
            (Array.isArray(ids) ? ids : []).forEach((id) => {
                const message = messageById.get(String(id));
                latest = Math.max(latest, parseMemoryHomeTime(message?.createdAt || message?.timestamp || message?.time || message?.date));
            });
            return latest;
        };

        const importantItems = analysis?.importantMemories?.length
            ? analysis.importantMemories.slice(0, 10).map((entry) => {
                const content = normalizeMemoryText(entry?.content);
                const stored = byContent.get(content.toLocaleLowerCase());
                return stored || {
                    id: '',
                    bindingId,
                    tier: 'L1',
                    kind: 'memory',
                    status: 'active',
                    authority: 'ai_archive_analysis',
                    memoryType: entry?.type || 'fact',
                    content,
                    sourceRefs: (entry?.sourceMessageIds || []).map((messageId) => ({ type: 'summary_source', messageId })),
                    retrievalStats: { injectedCount: 0 }
                };
            }).filter((item) => item.content)
            : activeItems
                .filter((item) => !['plan', 'promise', 'event', 'emotion', 'fragment'].includes(getMemoryHomeType(item)))
                .slice()
                .sort((left, right) => parseMemoryHomeTime(right.createdAt || right.updatedAt) - parseMemoryHomeTime(left.createdAt || left.updatedAt))
                .slice(0, 10);
        importantItems.sort((left, right) =>
            (sourceTimestamp(right.sourceRefs?.map((ref) => ref.messageId)) || parseMemoryHomeTime(right.createdAt || right.updatedAt))
            - (sourceTimestamp(left.sourceRefs?.map((ref) => ref.messageId)) || parseMemoryHomeTime(left.createdAt || left.updatedAt)));

        const legacyCurrentState = !analysis && typeof window.MemoryV2?.getCurrentState === 'function'
            ? window.MemoryV2.getCurrentState(bindingId)
            : null;
        const legacyOpenLoops = legacyCurrentState
            ? [
                ...(legacyCurrentState.userOpenItems || []),
                ...(legacyCurrentState.characterOpenItems || []),
                ...(legacyCurrentState.sharedOpenItems || [])
            ].map((entry) => ({
                content: entry?.text || '',
                actor: entry?.actor || 'shared',
                dueAt: entry?.dueAt || ''
            }))
            : [];
        const pendingSource = analysis ? (analysis.openLoops || []) : legacyOpenLoops;
        const pendingItems = pendingSource.slice(0, 6).map((entry, index) => ({
            id: 'ai_open_' + index,
            text: normalizeMemoryText(entry?.content),
            dueAt: parseMemoryHomeTime(entry?.dueAt),
            type: entry?.dueAt ? 'reminder' : entry?.actor === 'shared' ? 'promise' : 'pending',
            actor: entry?.actor || 'shared'
        })).filter((entry) => entry.text);

        const recentEvents = (analysis?.experiences || []).slice(0, 8).map((entry) => ({
            id: '',
            text: normalizeMemoryText(entry?.content),
            source: 'wechat',
            timestamp: parseMemoryHomeTime(entry?.time)
                || sourceTimestamp(entry?.sourceMessageIds)
                || parseMemoryHomeTime(analysis?.updatedAt || summary?.updatedAt)
        })).filter((entry) => entry.text && entry.timestamp)
            .sort((left, right) => right.timestamp - left.timestamp);

        const cognition = analysis?.cognition || {};
        const manualRelationship = typeof window.MemoryV2?.getRelationshipState === 'function'
            ? window.MemoryV2.getRelationshipState(bindingId)
            : null;
        const manualRelationshipText = manualRelationship?.source === 'manual_override'
            ? normalizeMemoryText(manualRelationship.content || manualRelationship.label)
            : '';

        return {
            pendingItems,
            importantItems,
            recentEvents,
            cognition: {
                identity: normalizeMemoryText(cognition.identity),
                preference: normalizeMemoryText(cognition.preference || cognition.preferences),
                relationship: normalizeMemoryText(cognition.relationship) || manualRelationshipText
            },
            recallReason: null,
            analyzed: Boolean(analysis)
        };
    }

        function getCharacterViewProfile(bindingId) {
        const summary = getEffectiveAnalysisSummary(bindingId);
        const analysis = summary?.archiveAnalysis && typeof summary.archiveAnalysis === 'object'
            ? summary.archiveAnalysis
            : null;
        const view = analysis?.characterView && typeof analysis.characterView === 'object'
            ? analysis.characterView
            : null;
        return {
            view,
            updatedAt: analysis?.updatedAt || summary?.updatedAt || ''
        };
    }

    function renderCharacterArchive(documentRef, target, contact, query = '') {
        if (!documentRef || !target || !contact) return;
        target.replaceChildren();
        const profile = getCharacterViewProfile(contact.id);
        const view = profile.view;
        const roleName = contact.name || '角色';
        const normalizedQuery = String(query || '').trim().toLocaleLowerCase();

        const heading = documentRef.createElement('section');
        heading.className = 'memory-card memory-character-view-heading';
        const title = documentRef.createElement('div');
        title.className = 'card-header';
        const badge = documentRef.createElement('span');
        badge.className = 'card-badge';
        badge.textContent = '在 ' + roleName + ' 眼里的你';
        title.appendChild(badge);
        const copy = documentRef.createElement('div');
        copy.className = 'card-content';
        copy.textContent = '这里记录的是角色在长期相处中形成的主观印象，不等同于客观事实，也不会自动写入重要记忆。';
        heading.append(title, copy);
        target.appendChild(heading);

        const fields = view ? [
            ['整体印象', view.overall],
            ['性格与习惯', view.personality],
            ['相处方式', view.interaction],
            ['情绪习惯', view.emotion],
            ['还在了解', view.stillLearning]
        ].filter(([, value]) => normalizeMemoryText(value)) : [];

        const visibleFields = normalizedQuery
            ? fields.filter(([label, value]) => (label + ' ' + value).toLocaleLowerCase().includes(normalizedQuery))
            : fields;

        if (!view || !fields.length) {
            const empty = documentRef.createElement('div');
            empty.className = 'memory-card';
            empty.textContent = '还没有形成足够稳定的印象。下一次 AI 记忆分析完成后，这里会从角色视角生成档案。';
            target.appendChild(empty);
            return;
        }

        visibleFields.forEach(([label, value]) => {
            const card = documentRef.createElement('section');
            card.className = 'memory-card memory-character-view-card';
            const header = documentRef.createElement('div');
            header.className = 'card-header';
            const sectionBadge = documentRef.createElement('span');
            sectionBadge.className = 'card-badge';
            sectionBadge.textContent = label;
            header.appendChild(sectionBadge);
            const text = documentRef.createElement('div');
            text.className = 'card-content';
            text.textContent = value;
            card.append(header, text);
            target.appendChild(card);
        });

        if (normalizedQuery && !visibleFields.length) {
            const empty = documentRef.createElement('div');
            empty.className = 'memory-card';
            empty.textContent = '没有匹配的档案内容';
            target.appendChild(empty);
        }

        if (profile.updatedAt) {
            const footer = documentRef.createElement('p');
            footer.className = 'memory-summary-meta';
            footer.textContent = '最近更新：' + formatSummaryTimestamp(profile.updatedAt);
            target.appendChild(footer);
        }
    }

    function getMemoryHomeSourceMeta(source) {
        const sourceMap = {
            wechat: ['微信', 'message'],
            sms: ['短信', 'message'],
            meeting: ['见面', 'users'],
            diary: ['日记', 'file'],
            icity: ['iCity', 'star'],
            manual: ['手动', 'file']
        };
        return sourceMap[source] || [source || '记录', 'file'];
    }

    function createMemoryHomeHeader(documentRef, icon, titleText, badgeText, actionText, onAction) {
        const header = documentRef.createElement('div');
        header.className = 'memory-home-card-header';

        const leading = documentRef.createElement('div');
        leading.className = 'memory-home-card-leading';
        const iconWrap = documentRef.createElement('span');
        iconWrap.className = 'memory-home-card-icon';
        iconWrap.innerHTML = getMemoryHomeSvg(icon, 20);
        const title = documentRef.createElement('strong');
        title.className = 'memory-home-card-title';
        title.textContent = titleText;
        leading.append(iconWrap, title);

        if (badgeText) {
            const badge = documentRef.createElement('span');
            badge.className = 'memory-home-count';
            badge.textContent = badgeText;
            leading.appendChild(badge);
        }

        header.appendChild(leading);

        if (actionText) {
            const action = documentRef.createElement('button');
            action.type = 'button';
            action.className = 'memory-home-card-action';
            action.append(documentRef.createTextNode(actionText));
            const chevron = documentRef.createElement('span');
            chevron.innerHTML = getMemoryHomeSvg('chevron', 16);
            action.appendChild(chevron);
            if (typeof onAction === 'function') action.addEventListener('click', onAction);
            header.appendChild(action);
        }
        return header;
    }

    function renderReferenceMemoryHome(documentRef, list, contact, viewModel) {
        const dashboard = documentRef.createElement('div');
        dashboard.className = 'memory-home-dashboard';

        {
            const card = documentRef.createElement('section');
            card.className = 'memory-home-card';
            card.appendChild(createMemoryHomeHeader(documentRef, 'clock', '待续事项', String(viewModel.pendingItems.length), '查看全部', () => {
                activeTab = 'relationship';
                memoryHomeExpandedView = false;
                renderReferenceDocument();
            }));

            const body = documentRef.createElement('div');
            body.className = 'memory-home-pending-list';
            viewModel.pendingItems.forEach((entry) => {
                const row = documentRef.createElement('div');
                row.className = 'memory-home-pending-row';
                const dot = documentRef.createElement('span');
                dot.className = 'memory-home-pending-dot';
                const text = documentRef.createElement('span');
                text.className = 'memory-home-pending-text';
                text.textContent = entry.text;

                const tag = documentRef.createElement('span');
                const tone = entry.type === 'reminder' ? 'reminder' : entry.type === 'promise' ? 'promise' : 'pending';
                tag.className = 'memory-home-tag is-' + tone;
                tag.textContent = tone === 'reminder' ? '提醒' : tone === 'promise' ? '约定' : '待续';

                const meta = documentRef.createElement('span');
                meta.className = 'memory-home-pending-meta';
                meta.textContent = entry.dueAt ? formatMemoryHomeTime(entry.dueAt).replace(/^今天\s*/, '今天 ') : '待续';

                row.append(dot, text, tag, meta);
                body.appendChild(row);
            });
            if (!viewModel.pendingItems.length) {
                const empty = documentRef.createElement('p');
                empty.className = 'memory-home-empty-copy';
                empty.textContent = '暂时没有待续事项；下一次 AI 记忆分析会继续更新。';
                body.appendChild(empty);
            }
            card.appendChild(body);
            dashboard.appendChild(card);
        }

        {
            const card = documentRef.createElement('section');
            card.className = 'memory-home-card memory-home-important-card';
            card.appendChild(createMemoryHomeHeader(documentRef, 'star', '重要记忆', String(viewModel.importantItems.length), '查看全部', () => {
                memoryHomeExpandedView = true;
                renderReferenceDocument();
            }));

            const chips = documentRef.createElement('div');
            chips.className = 'memory-home-memory-chips';
            viewModel.importantItems.slice(0, 4).forEach((item) => {
                const chip = documentRef.createElement('button');
                chip.type = 'button';
                chip.className = 'memory-home-memory-chip';
                const icon = documentRef.createElement('span');
                icon.innerHTML = getMemoryHomeSvg('file', 15);
                const text = documentRef.createElement('span');
                text.textContent = String(item.content || '').replace(/\s+/g, ' ').trim();
                chip.append(icon, text);
                if (item.id && typeof window.MemoryV2?.getMemoryTrace === 'function') {
                    chip.addEventListener('click', () => void openReferenceMemoryTrace(documentRef, item));
                }
                chips.appendChild(chip);
            });

            if (!viewModel.importantItems.length) {
                const empty = documentRef.createElement('p');
                empty.className = 'memory-home-empty-copy';
                empty.textContent = '还没有形成稳定的重要记忆。';
                chips.appendChild(empty);
            }

            card.appendChild(chips);

            const lastInjected = viewModel.importantItems
                .filter((item) => parseMemoryHomeTime(item?.retrievalStats?.lastInjectedAt))
                .sort((left, right) => parseMemoryHomeTime(right.retrievalStats.lastInjectedAt) - parseMemoryHomeTime(left.retrievalStats.lastInjectedAt))[0];
            if (lastInjected) {
                const foot = documentRef.createElement('div');
                foot.className = 'memory-home-card-footnote';
                foot.innerHTML = getMemoryHomeSvg('clock', 15);
                const copy = documentRef.createElement('span');
                copy.textContent = '最近被引用：' + formatMemoryHomeTime(lastInjected.retrievalStats.lastInjectedAt);
                foot.appendChild(copy);
                card.appendChild(foot);
            }
            dashboard.appendChild(card);
        }

        if (viewModel.recentEvents.length) {
            const card = documentRef.createElement('section');
            card.className = 'memory-home-card';
            card.appendChild(createMemoryHomeHeader(documentRef, 'history', '最近发生', '', '查看全部', () => {
                activeTab = 'relationship';
                memoryHomeExpandedView = false;
                renderReferenceDocument();
            }));

            const timeline = documentRef.createElement('div');
            timeline.className = 'memory-home-timeline';
            viewModel.recentEvents.forEach((entry) => {
                const row = documentRef.createElement('div');
                row.className = 'memory-home-timeline-row';
                const dot = documentRef.createElement('span');
                dot.className = 'memory-home-timeline-dot';
                const time = documentRef.createElement('span');
                time.className = 'memory-home-timeline-time';
                time.textContent = formatMemoryHomeTime(entry.timestamp);
                const [sourceLabel, sourceIcon] = getMemoryHomeSourceMeta(entry.source);
                const source = documentRef.createElement('span');
                source.className = 'memory-home-timeline-source';
                source.innerHTML = getMemoryHomeSvg(sourceIcon, 17);
                const sourceText = documentRef.createElement('span');
                sourceText.textContent = '[' + sourceLabel + ']';
                source.appendChild(sourceText);
                const copy = documentRef.createElement('span');
                copy.className = 'memory-home-timeline-copy';
                copy.textContent = entry.text;
                row.append(dot, time, source, copy);
                timeline.appendChild(row);
            });
            card.appendChild(timeline);
            dashboard.appendChild(card);
        }

        {
            const card = documentRef.createElement('section');
            card.className = 'memory-home-card memory-home-cognition-card';
            card.appendChild(createMemoryHomeHeader(documentRef, 'brain', 'AI当前认知', '', '可纠正', () => {
                void refresh().then(() => openReferenceComposer(documentRef));
            }));

            const panel = documentRef.createElement('div');
            panel.className = 'memory-home-cognition-panel';
            const cognitionRows = [
                ['user', '身份', viewModel.cognition.identity || '尚未形成稳定判断'],
                ['heart', '偏好', viewModel.cognition.preference || '尚未形成稳定判断'],
                ['users', '关系状态', viewModel.cognition.relationship || '尚未形成稳定判断']
            ];
            cognitionRows.forEach(([iconName, label, value]) => {
                const row = documentRef.createElement('div');
                row.className = 'memory-home-cognition-row';
                const icon = documentRef.createElement('span');
                icon.className = 'memory-home-cognition-icon';
                icon.innerHTML = getMemoryHomeSvg(iconName, 17);
                const text = documentRef.createElement('span');
                text.className = 'memory-home-cognition-copy';
                const labelEl = documentRef.createElement('b');
                labelEl.textContent = label + '：';
                text.append(labelEl, documentRef.createTextNode(value));
                row.append(icon, text);
                panel.appendChild(row);
            });
            card.appendChild(panel);
            dashboard.appendChild(card);
        }

        if (viewModel.recallReason) {
            const card = documentRef.createElement('button');
            card.type = 'button';
            card.className = 'memory-home-card memory-home-recall-card';
            const top = documentRef.createElement('div');
            top.className = 'memory-home-recall-title';
            const icon = documentRef.createElement('span');
            icon.innerHTML = getMemoryHomeSvg('lightbulb', 19);
            const title = documentRef.createElement('strong');
            title.textContent = '最近为什么提起';
            top.append(icon, title);

            const copy = documentRef.createElement('span');
            copy.className = 'memory-home-recall-copy';
            copy.textContent = viewModel.recallReason.text;
            const tail = documentRef.createElement('span');
            tail.className = 'memory-home-recall-chevron';
            tail.innerHTML = getMemoryHomeSvg('chevron', 16);
            card.append(top, copy, tail);
            if (viewModel.recallReason.item?.id && typeof window.MemoryV2?.getMemoryTrace === 'function') {
                card.addEventListener('click', () => void openReferenceMemoryTrace(documentRef, viewModel.recallReason.item));
            }
            dashboard.appendChild(card);
        }

        list.appendChild(dashboard);
    }

    function renderReferenceDocument() {
        const frame = getReferenceFrame();
        const documentRef = frame && frame.contentDocument;
        if (!documentRef || !documentRef.body) return;
        const contact = cachedContacts.find((item) => item.id === selectedContactId) || null;
        const messages = contact ? getContactMessages(contact.id) : [];
        const items = contact ? getActiveItems(contact.id, activeTab) : [];
        const relatedEvents = contact && activeTab === 'relationship' && typeof window.MemoryV2?.getEventNodes === 'function'
            ? window.MemoryV2.getEventNodes(contact.id).slice().sort((left, right) => String(right.updatedAt || '').localeCompare(String(left.updatedAt || '')))
            : [];
        const currentState = contact && activeTab === 'relationship' && typeof window.MemoryV2?.getCurrentState === 'function'
            ? window.MemoryV2.getCurrentState(contact.id)
            : null;
        const summaryItems = contact && activeTab === 'relationship'
            ? [
                ...getChapterSummaries(contact.id).flatMap((chapter) => (chapter.sections || []).map((section) => ({
                    id: chapter.id, bindingId: chapter.bindingId, status: chapter.status, recordType: 'summary',
                    tier: 'L2',
                    slot: 'chapter',
                    rangeLabel: getSummaryRangeLabel(chapter, contact.id),
                    timeLabel: getSummaryTimeLabel(chapter, section),
                    content: formatSummarySection(section),
                    createdAt: chapter.createdAt || '',
                    timestamp: getSummarySortTime(chapter, section)
                }))),
                ...(getActiveSummary(contact.id)?.sections || []).map((section) => ({
                    id: getActiveSummary(contact.id).id, bindingId: contact.id, status: 'active', recordType: 'summary',
                    tier: 'L2',
                    rangeLabel: getSummaryRangeLabel(getActiveSummary(contact.id), contact.id),
                    timeLabel: getSummaryTimeLabel(getActiveSummary(contact.id), section),
                    content: formatSummarySection(section),
                    createdAt: getActiveSummary(contact.id)?.createdAt || '',
                    timestamp: getSummarySortTime(getActiveSummary(contact.id), section)
                }))
            ].sort((left, right) => right.timestamp - left.timestamp)
            : [];
        const query = memorySearchQuery.trim().toLocaleLowerCase();
        const displayItems = (summaryItems.length ? summaryItems : items).filter(item => !item.deletedAt && item.content);
        const filteredItems = query ? displayItems.filter((item) => String(item.content || '').toLocaleLowerCase().includes(query)) : displayItems;
        
        const nameStr = contact?.name || '尚未选择角色';
        const mainProfileName = documentRef.getElementById('mainProfileName');
        if (mainProfileName) mainProfileName.textContent = nameStr;
        
        const charAvatarName = documentRef.getElementById('charAvatarName');
        if (charAvatarName) charAvatarName.textContent = nameStr;

        const memoryStatsDesc = documentRef.getElementById('memoryStatsDesc');
        if (memoryStatsDesc) {
            memoryStatsDesc.textContent = '记忆总数：' + (contact ? getActiveItems(contact.id).length : 0) + ' 条，共同对话：' + countConversationFloors(messages) + ' 层。';
        }
        
        const companionDays = documentRef.getElementById('companionDays');
        if (companionDays) {
            companionDays.textContent = getKnownDays(messages);
        }

        const charAvatar = documentRef.getElementById('charAvatar');
        if (charAvatar) {
            charAvatar.style.backgroundImage = contact?.avatar ? 'url(' + JSON.stringify(contact.avatar) + ')' : '';
            const inner = charAvatar.querySelector('.avatar-char-inner');
            if (inner) inner.style.display = contact?.avatar ? 'none' : 'block';
        }

        let userName = '我';
        let userAvatar = '';
        if (typeof appSettings !== 'undefined') {
            userName = appSettings.wc_current_user_name || '我';
            userAvatar = appSettings.wc_current_user_avatar || '';
        } else if (typeof window.appSettings !== 'undefined') {
            userName = window.appSettings.wc_current_user_name || '我';
            userAvatar = window.appSettings.wc_current_user_avatar || '';
        }

        const userAvatarGroup = documentRef.querySelector('.user-switch-badge');
        if (userAvatarGroup) {
            const nameEl = userAvatarGroup.querySelector('.avatar-name');
            if (nameEl) nameEl.textContent = userName;
            const avatarEl = userAvatarGroup.querySelector('.avatar');
            if (avatarEl) {
                avatarEl.style.backgroundImage = userAvatar ? 'url(' + JSON.stringify(userAvatar) + ')' : '';
                const inner = avatarEl.querySelector('.avatar-user-inner');
                if (inner) inner.style.display = userAvatar ? 'none' : 'block';
            }
        }

        // 读取气泡本地存储
        const charBubble = documentRef.getElementById('charBubble');
        if (charBubble) {
            charBubble.textContent = localStorage.getItem('memoryApp_charBubble') || 'ㅎωㅎ';
        }
        const userBubble = documentRef.getElementById('userBubble');
        if (userBubble) {
            userBubble.textContent = localStorage.getItem('memoryApp_userBubble') || '★(>ω<)!!♪';
        }

        const tabs = ['memory', 'relationship', 'archive'];
        documentRef.querySelectorAll('.segment-btn').forEach((button, index) => button.classList.toggle('active', tabs[index] === activeTab));
        const list = documentRef.querySelector('.memory-list');
        list.replaceChildren();
        let renderedRelatedCount = 0;

        if (contact && activeTab === 'archive') {
            renderCharacterArchive(documentRef, list, contact, query);
            return;
        }

        if (contact && activeTab === 'memory' && !query && !memoryHomeExpandedView) {
            renderReferenceMemoryHome(documentRef, list, contact, getMemoryHomeViewModel(contact));
            return;
        }

        if (contact && activeTab === 'memory' && !query && memoryHomeExpandedView) {
            const overviewBack = documentRef.createElement('button');
            overviewBack.type = 'button';
            overviewBack.className = 'memory-home-overview-back';
            overviewBack.innerHTML = '<span>' + getMemoryHomeSvg('chevron', 17) + '</span><b>返回记忆概览</b>';
            overviewBack.querySelector('svg').style.transform = 'rotate(180deg)';
            overviewBack.addEventListener('click', () => {
                memoryHomeExpandedView = false;
                renderReferenceDocument();
            });
            list.appendChild(overviewBack);
        }

        if (contact && activeTab === 'relationship') {
            const relationship = currentState?.relationship || { stage: 'unknown', label: '', content: '' };
            const relationSearchText = [relationship.label, relationship.content, getReferenceRelationshipLabel(relationship.stage)].join(' ').toLocaleLowerCase();
            if (!query || relationSearchText.includes(query)) {
                const relationCard = documentRef.createElement('div');
                relationCard.className = 'memory-card';
                const relationHeader = documentRef.createElement('div');
                relationHeader.className = 'card-header';
                const relationBadge = documentRef.createElement('span');
                relationBadge.className = 'card-badge';
                relationBadge.textContent = '当前关系' + (relationship.source === 'manual_override' ? ' · 手动确认' : '');
                const relationActions = documentRef.createElement('div');
                relationActions.className = 'card-actions';
                const relationEdit = referenceIconButton(documentRef, '调整关系', getMemoryHomeSvg('edit', 16));
                relationEdit.addEventListener('click', event => {
                    event.stopPropagation();
                    openReferenceRelationshipEditor(documentRef, contact);
                });
                relationActions.appendChild(relationEdit);
                relationHeader.append(relationBadge, relationActions);
                const relationText = documentRef.createElement('div');
                relationText.className = 'card-content';
                relationText.textContent = relationship.stage && relationship.stage !== 'unknown'
                    ? getReferenceRelationshipLabel(relationship.stage) + (relationship.content ? ' · ' + relationship.content : '')
                    : '还没有明确关系状态，可手动设置。';
                relationCard.append(relationHeader, relationText);
                list.appendChild(relationCard);
                renderedRelatedCount += 1;
            }

            relatedEvents.slice(0, 18).forEach((eventNode) => {
                const searchable = [eventNode.canonicalText, eventNode.relationshipLabel, getReferenceEventSourceLabel(eventNode.sourceApps), getReferenceEventStateLabel(eventNode.state)].join(' ').toLocaleLowerCase();
                if (query && !searchable.includes(query)) return;
                const card = documentRef.createElement('div');
                card.className = 'memory-card';
                const header = documentRef.createElement('div');
                header.className = 'card-header';
                const badge = documentRef.createElement('span');
                badge.className = 'card-badge';
                const sourceLabel = getReferenceEventSourceLabel(eventNode.sourceApps);
                badge.textContent = '相关事件 · ' + getReferenceEventStateLabel(eventNode.state) + (eventNode.manualEdited ? ' · 手动修订' : '') + (sourceLabel ? ' · ' + sourceLabel : '');
                const actions = documentRef.createElement('div');
                actions.className = 'card-actions';
                const edit = referenceIconButton(documentRef, '编辑事件', getMemoryHomeSvg('edit', 16));
                edit.addEventListener('click', event => {
                    event.stopPropagation();
                    openReferenceEventEditor(documentRef, eventNode);
                });
                const hide = referenceIconButton(documentRef, '隐藏事件', getMemoryHomeSvg('trash', 16));
                hide.addEventListener('click', async event => {
                    event.stopPropagation();
                    const confirmed = typeof window.showCustomConfirm === 'function'
                        ? await window.showCustomConfirm('隐藏相关事件', '隐藏后它不会再参与当前关系、状态或聊天召回。原始来源不会被删除。', '隐藏', true)
                        : window.confirm('隐藏这条相关事件？');
                    if (!confirmed) return;
                    await window.MemoryV2.archiveEventNode(eventNode.id);
                    renderReferenceDocument();
                });
                actions.append(edit, hide);
                header.append(badge, actions);
                const text = documentRef.createElement('div');
                text.className = 'card-content';
                text.textContent = eventNode.canonicalText || '未命名事件';
                card.append(header, text);
                if (eventNode.dueAt || eventNode.relationshipStage) {
                    const meta = documentRef.createElement('div');
                    meta.style.cssText = 'margin-top:8px;color:#8e8e93;font:12px/1.45 -apple-system,BlinkMacSystemFont,"SF Pro Text",sans-serif';
                    const values = [];
                    if (eventNode.dueAt) values.push('时间：' + new Date(eventNode.dueAt).toLocaleString('zh-CN', { hour12: false }));
                    if (eventNode.relationshipStage) values.push('关系：' + getReferenceRelationshipLabel(eventNode.relationshipStage));
                    meta.textContent = values.join(' · ');
                    card.appendChild(meta);
                }
                list.appendChild(card);
                renderedRelatedCount += 1;
            });
        }



        filteredItems.forEach((item) => {
            const confirmed = item.tier === 'L2' && item.slot === 'chapter';
            const card = documentRef.createElement(confirmed ? 'details' : 'div');
            card.className = 'memory-card';
            const header = documentRef.createElement(confirmed ? 'summary' : 'div');
            header.className = 'card-header';
            const badge = documentRef.createElement('span');
            badge.className = 'card-badge';
            const badgeParts = [
                item.tier === 'L2' ? 'L2 摘要' : (item.tier === 'L3' ? 'L3 片段' : '手动记录'),
                item.tier === 'L2' ? item.rangeLabel : '',
                formatMemoryDate(item.createdAt) || '刚刚'
            ].filter(Boolean);
            badge.textContent = badgeParts.join(' · ');
            
            const actions = documentRef.createElement('div');
            actions.className = 'card-actions';

            if (item.id && item.tier !== 'L2' && typeof window.MemoryV2?.getMemoryTrace === 'function') {
                const trace = referenceIconButton(documentRef, '查看记忆依据', '<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" height="16" width="16" aria-hidden="true"><g id="info"><path id="Union" fill="currentColor" d="M12 2c5.5228 0 10 4.47715 10 10 0 5.5228 -4.4772 10 -10 10 -5.52285 0 -10 -4.4772 -10 -10C2 6.47715 6.47715 2 12 2m0 2c-4.41828 0 -8 3.58172 -8 8 0 4.4183 3.58172 8 8 8 4.4183 0 8 -3.5817 8 -8 0 -4.41828 -3.5817 -8 -8 -8m0 7c0.5523 0 1 0.4477 1 1v3h0.5c0.5523 0 1 0.4477 1 1s-0.4477 1 -1 1h-3c-0.55228 0 -1 -0.4477 -1 -1s0.44772 -1 1 -1h0.5v-2h-0.5c-0.55228 0 -1 -0.4477 -1 -1s0.44772 -1 1 -1zm-0.25 -4c0.6904 0 1.25 0.55964 1.25 1.25s-0.5596 1.25 -1.25 1.25 -1.25 -0.55964 -1.25 -1.25S11.0596 7 11.75 7" stroke-width="1"></path></g></svg>');
                trace.style.color = '#8e8e93';
                trace.addEventListener('click', event => {
                    event.stopPropagation();
                    void openReferenceMemoryTrace(documentRef, item);
                });
                actions.appendChild(trace);
            }

            if (item.tier === 'L3') {
                const priority = documentRef.createElement('button');
                priority.type = 'button';
                priority.innerHTML = getRetrievalPriorityLabel(item) + '<svg style="width: 12px; height: 12px; margin-left: 2px;" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="6 9 12 15 18 9"></polyline></svg>';
                priority.style.cssText = 'margin-left:auto;border:0;background:transparent;color:#007AFF;font:600 14px -apple-system,BlinkMacSystemFont,"SF Pro Text",sans-serif; display: flex; align-items: center; cursor: pointer; padding: 0;';
                priority.addEventListener('click', (event) => {
                    event.stopPropagation();
                    openMemoryPriorityDialog(item);
                });
                actions.appendChild(priority);
            }
            if (item.id && item.authority === 'user_confirmed') {
                const edit = documentRef.createElement('button');
                edit.type = 'button';
                edit.innerHTML = getMemoryHomeSvg('edit', 16);
                edit.style.cssText = 'border:0;background:transparent;color:#b0b0b0;cursor:pointer;display:flex;align-items:center;padding:0;';
                edit.title = '编辑';
                edit.addEventListener('click', (event) => {
                    event.stopPropagation();
                    openReferenceComposer(documentRef, item);
                });
                actions.appendChild(edit);
            }
            if (item.status === 'archived' && item.archiveReason !== 'source_removed') {
                const restore = referenceIconButton(documentRef, '恢复', '<svg style="width:16px;height:16px" data-mdi-icon="restore" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M13,3A9,9 0 0,0 4,12H1L4.89,15.89L4.96,16.03L9,12H6A7,7 0 0,1 13,5A7,7 0 0,1 20,12A7,7 0 0,1 13,19C11.07,19 9.32,18.21 8.06,16.94L6.64,18.36C8.27,20 10.5,21 13,21A9,9 0 0,0 22,12A9,9 0 0,0 13,3Z"></path></svg>');
                restore.addEventListener('click', (event) => {
                    event.stopPropagation();
                    void restoreMemory(item.id);
                });
                const del = documentRef.createElement('button');
                del.type = 'button';
                del.innerHTML = getMemoryHomeSvg('trash', 16);
                del.style.cssText = 'border:0;background:transparent;color:#b0b0b0;cursor:pointer;display:flex;align-items:center;padding:0;';
                del.title = '删除';
                del.setAttribute('aria-label', '删除');
                del.addEventListener('click', (event) => {
                    event.stopPropagation();
                    requestDeleteArchivedMemory(item.id);
                });
                actions.append(restore, del);
            } else if (item.status !== 'archived') {
                const del = documentRef.createElement('button');
                del.type = 'button';
                del.innerHTML = getMemoryHomeSvg('trash', 16);
                del.style.cssText = 'border:0;background:transparent;color:#b0b0b0;cursor:pointer;display:flex;align-items:center;padding:0;';
                del.title = '删除';
                del.addEventListener('click', (event) => {
                    event.stopPropagation();
                    if (item.recordType === 'summary') requestDeleteSummary(item.bindingId, item.id);
                    else requestArchiveMemory(item.id);
                });
                actions.appendChild(del);
            }
            
            header.append(badge, actions);
            if (confirmed) {
                decorateSummaryDisclosure(card, header);
                card.appendChild(header);
            }
            if (item.tier === 'L2' && item.timeLabel) {
                const time = documentRef.createElement('div');
                time.className = 'memory-summary-time';
                time.textContent = item.timeLabel;
                card.appendChild(time);
            }
            const text = documentRef.createElement('div');
            text.className = 'card-content';
            text.textContent = item.content || '';
            if (!confirmed) card.appendChild(header);
            card.appendChild(text);
            list.appendChild(card);
        });
        if (!filteredItems.length && !renderedRelatedCount) {
            const card = documentRef.createElement('div');
            card.className = 'memory-card';
            card.textContent = query ? '没有匹配的记忆' : getEmptyCopy()[0];
            list.appendChild(card);
        }
    }

    function formatReferenceTraceTime(value) {
        const numeric = Number(value);
        const timestamp = Number.isFinite(numeric) && numeric > 0 ? numeric : Date.parse(String(value || ''));
        if (!Number.isFinite(timestamp)) return '';
        return new Intl.DateTimeFormat('zh-CN', {
            year: 'numeric',
            month: 'numeric',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            hour12: false
        }).format(new Date(timestamp));
    }

    function createReferenceTraceSection(documentRef, titleText) {
        const section = documentRef.createElement('section');
        section.style.cssText = 'display:grid;gap:7px;margin-top:14px';
        const title = documentRef.createElement('div');
        title.textContent = titleText;
        title.style.cssText = 'padding:0 2px;color:#6e6e73;font:600 12px/1.35 -apple-system,BlinkMacSystemFont,"SF Pro Text",sans-serif;letter-spacing:.1px';
        section.appendChild(title);
        return section;
    }

    function createReferenceTraceRow(documentRef, labelText, valueText) {
        const row = documentRef.createElement('div');
        row.style.cssText = 'display:grid;grid-template-columns:74px minmax(0,1fr);gap:10px;align-items:start;padding:10px 11px;border:1px solid rgba(60,60,67,.055);border-radius:12px;background:#f5f5f7';
        const label = documentRef.createElement('span');
        label.textContent = labelText;
        label.style.cssText = 'color:#8e8e93;font:12px/1.45 -apple-system,BlinkMacSystemFont,"SF Pro Text",sans-serif';
        const value = documentRef.createElement('span');
        value.textContent = valueText || '—';
        value.style.cssText = 'min-width:0;color:#2c2c2e;font:13px/1.5 -apple-system,BlinkMacSystemFont,"SF Pro Text",sans-serif;white-space:pre-wrap;word-break:break-word';
        row.append(label, value);
        return row;
    }

    function lockReferenceDocumentScroll(documentRef) {
        const view = documentRef?.defaultView;
        const html = documentRef?.documentElement;
        const body = documentRef?.body;
        if (!view || !html || !body) return () => {};

        const scrollX = view.scrollX || 0;
        const scrollY = view.scrollY || 0;
        const previous = {
            htmlOverflow: html.style.overflow,
            htmlOverscroll: html.style.overscrollBehavior,
            bodyOverflow: body.style.overflow,
            bodyPosition: body.style.position,
            bodyTop: body.style.top,
            bodyLeft: body.style.left,
            bodyRight: body.style.right,
            bodyWidth: body.style.width,
            bodyOverscroll: body.style.overscrollBehavior
        };

        html.style.overflow = 'hidden';
        html.style.overscrollBehavior = 'none';
        body.style.overflow = 'hidden';
        body.style.position = 'fixed';
        body.style.top = '-' + scrollY + 'px';
        body.style.left = '-' + scrollX + 'px';
        body.style.right = '0';
        body.style.width = '100%';
        body.style.overscrollBehavior = 'none';

        let restored = false;
        return () => {
            if (restored) return;
            restored = true;
            html.style.overflow = previous.htmlOverflow;
            html.style.overscrollBehavior = previous.htmlOverscroll;
            body.style.overflow = previous.bodyOverflow;
            body.style.position = previous.bodyPosition;
            body.style.top = previous.bodyTop;
            body.style.left = previous.bodyLeft;
            body.style.right = previous.bodyRight;
            body.style.width = previous.bodyWidth;
            body.style.overscrollBehavior = previous.bodyOverscroll;
            view.scrollTo(scrollX, scrollY);
        };
    }

    async function openReferenceMemoryTrace(documentRef, item) {
        if (!item?.id || typeof window.MemoryV2?.getMemoryTrace !== 'function') return;
        let trace = window.MemoryV2.getMemoryTrace(item.id);
        if (!trace && typeof window.MemoryV2?.migrate === 'function') {
            await window.MemoryV2.migrate().catch(() => null);
            trace = window.MemoryV2.getMemoryTrace(item.id);
        }
        if (!trace) {
            if (typeof window.showToast === 'function') window.showToast('暂时找不到这条记忆的依据');
            return;
        }

        const unlockDocumentScroll = lockReferenceDocumentScroll(documentRef);
        const overlay = documentRef.createElement('div');
        overlay.className = 'switcher-overlay is-visible memory-trace-overlay';
        overlay.style.cssText = 'position:fixed;inset:0;z-index:9999;display:flex;align-items:center;justify-content:center;box-sizing:border-box;backdrop-filter:blur(10px);-webkit-backdrop-filter:blur(10px);overflow:hidden;overscroll-behavior:none';
        const sheet = documentRef.createElement('div');
        sheet.className = 'modal-card memory-trace-sheet';
        sheet.style.borderRadius = '12px';
        const closeTrace = () => {
            unlockDocumentScroll();
            overlay.remove();
        };

        const header = documentRef.createElement('div');
        header.className = 'memory-trace-header';
        header.style.cssText = 'position:relative;flex:0 0 auto;display:flex;align-items:center;justify-content:center;min-height:48px;padding:12px 40px;box-sizing:border-box;border-bottom:1px solid rgba(60,60,67,.08);background:rgba(250,250,250,.94);';
        const back = createReferenceTraceBackSvg(documentRef);
        back.style.cssText = 'position:absolute;top:50%;left:14px;transform:translateY(-50%);display:flex;align-items:center;justify-content:center;width:28px;height:28px;color:#1c1c1e;cursor:pointer;outline:none;border:none;background:transparent;padding:0;z-index:10;-webkit-tap-highlight-color:transparent;';
        const activateBack = () => closeTrace();
        back.addEventListener('click', activateBack);
        back.addEventListener('keydown', event => {
            if (event.key !== 'Enter' && event.key !== ' ') return;
            event.preventDefault();
            activateBack();
        });
        const title = documentRef.createElement('h3');
        title.className = 'modal-card-title memory-trace-title';
        title.textContent = '记忆依据';
        title.style.cssText = 'margin:0;color:#1c1c1e;font-size:16px;font-weight:650;letter-spacing:-0.2px;text-align:center;';
        header.append(back, title);

        const scrollArea = documentRef.createElement('div');
        scrollArea.className = 'memory-trace-scroll';

        const content = documentRef.createElement('div');
        content.textContent = trace.content || '';
        content.style.cssText = 'margin-top:14px;padding:12px 13px;border:1px solid rgba(60,60,67,.055);border-radius:14px;background:#f5f5f7;color:#1c1c1e;font:14px/1.58 -apple-system,BlinkMacSystemFont,"SF Pro Text",sans-serif;white-space:pre-wrap;word-break:break-word';

        const evidence = documentRef.createElement('div');
        evidence.style.cssText = 'display:grid;grid-template-columns:auto minmax(0,1fr);gap:10px;align-items:center;margin-top:10px;padding:10px 11px;border:1px solid rgba(60,60,67,.055);border-radius:14px;background:#f5f5f7';
        const evidenceBadge = documentRef.createElement('div');
        evidenceBadge.textContent = '证据 ' + trace.evidence.label + ' · ' + trace.evidence.score + '%';
        evidenceBadge.style.cssText = 'padding:5px 8px;border:1px solid rgba(60,60,67,.06);border-radius:999px;background:#fff;color:#3a3a3c;font:600 12px/1 -apple-system,BlinkMacSystemFont,"SF Pro Text",sans-serif;white-space:nowrap';
        const evidenceNote = documentRef.createElement('div');
        evidenceNote.textContent = trace.evidence.note;
        evidenceNote.style.cssText = 'color:#8e8e93;font:11px/1.45 -apple-system,BlinkMacSystemFont,"SF Pro Text",sans-serif';
        evidence.append(evidenceBadge, evidenceNote);

        const infoSection = createReferenceTraceSection(documentRef, '判断');
        infoSection.append(
            createReferenceTraceRow(documentRef, '主体', trace.subjectLabel + ' · ' + trace.identitySourceLabel),
            createReferenceTraceRow(documentRef, '类型', trace.memoryTypeLabel),
            createReferenceTraceRow(documentRef, '状态', trace.memoryStateLabel),
            createReferenceTraceRow(documentRef, '来源级别', trace.authorityLabel)
        );
        scrollArea.append(content, evidence, infoSection);
        sheet.append(header, scrollArea);

        const correctionSection = createReferenceTraceSection(documentRef, '人工纠错');

        if (typeof window.MemoryV2?.updateMemoryIdentity === 'function') {
            const subjectRow = documentRef.createElement('div');
            subjectRow.style.cssText = 'display:grid;grid-template-columns:minmax(0,1fr) 28px 28px;gap:8px;align-items:center;padding:9px 10px;border:1px solid rgba(60,60,67,.055);border-radius:12px;background:#f5f5f7';

            const subjectSelect = documentRef.createElement('select');
            [
                ['user', '用户'],
                ['character', '角色'],
                ['shared', '共同经历'],
                ['unknown', '主体未确认']
            ].forEach(([value, label]) => {
                const option = documentRef.createElement('option');
                option.value = value;
                option.textContent = label;
                subjectSelect.appendChild(option);
            });
            subjectSelect.value = ['user', 'character', 'shared', 'unknown'].includes(trace.subjectKind) ? trace.subjectKind : 'unknown';
            subjectSelect.setAttribute('aria-label', '记忆主体');
            subjectSelect.style.cssText = 'min-width:0;width:100%;box-sizing:border-box;border:0;background:transparent;color:#1c1c1e;font:13px/1.45 -apple-system,BlinkMacSystemFont,"SF Pro Text",sans-serif;outline:0';

            const applySubject = referenceTraceIconButton(documentRef, '保存主体纠正', 'check');
            applySubject.addEventListener('click', async () => {
                const result = await window.MemoryV2.updateMemoryIdentity(item.id, subjectSelect.value);
                if (!result) return;
                closeTrace();
                await refresh();
            });

            const resetSubject = referenceTraceIconButton(documentRef, '恢复自动判断主体', 'rotateCcw');
            resetSubject.disabled = !trace.identityLocked;
            resetSubject.style.opacity = trace.identityLocked ? '1' : '.3';
            resetSubject.addEventListener('click', async () => {
                if (!trace.identityLocked || typeof window.MemoryV2?.resetMemoryIdentity !== 'function') return;
                const result = await window.MemoryV2.resetMemoryIdentity(item.id);
                if (!result) return;
                closeTrace();
                await refresh();
            });

            subjectRow.append(subjectSelect, applySubject, resetSubject);
            correctionSection.appendChild(subjectRow);

            const subjectHint = documentRef.createElement('div');
            subjectHint.textContent = trace.identityLocked
                ? '当前主体已由用户锁定；自动迁移和来源判断不会覆盖。'
                : '保存后会锁定主体；右侧恢复按钮可重新交给系统判断。';
            subjectHint.style.cssText = 'color:#8e8e93;font:11px/1.45 -apple-system,BlinkMacSystemFont,"SF Pro Text",sans-serif;padding:0 2px';
            correctionSection.appendChild(subjectHint);
        }

        if (typeof window.MemoryV2?.blockMemoryEventLink === 'function' && typeof window.MemoryV2?.resetMemoryEventLink === 'function') {
            const eventRow = documentRef.createElement('div');
            eventRow.style.cssText = 'display:grid;grid-template-columns:minmax(0,1fr) 28px;gap:8px;align-items:center;padding:9px 10px;border:1px solid rgba(60,60,67,.055);border-radius:12px;background:#f5f5f7';

            const eventCopy = documentRef.createElement('div');
            eventCopy.style.cssText = 'min-width:0;color:#3a3a3c;font:12px/1.45 -apple-system,BlinkMacSystemFont,"SF Pro Text",sans-serif;white-space:nowrap;overflow:hidden;text-overflow:ellipsis';
            if (trace.eventNode) {
                eventCopy.textContent = 'Event：' + (trace.eventNode.text || '已关联事件');
                const unlink = referenceTraceIconButton(documentRef, '解除事件关联并阻止自动重挂', 'unlink');
                unlink.addEventListener('click', async () => {
                    const confirmed = typeof window.showCustomConfirm === 'function'
                        ? await window.showCustomConfirm('解除事件关联', '解除后这条记忆不会再被系统自动挂回其他 Event Node，除非你恢复自动关联。', '解除', false)
                        : window.confirm('解除这条记忆的事件关联并阻止自动重挂？');
                    if (!confirmed) return;
                    const result = await window.MemoryV2.blockMemoryEventLink(item.id);
                    if (!result) return;
                    closeTrace();
                    await refresh();
                });
                eventRow.append(eventCopy, unlink);
            } else {
                eventCopy.textContent = trace.eventLinkBlocked ? 'Event：已解除并锁定' : 'Event：当前未关联';
                const relink = referenceTraceIconButton(documentRef, trace.eventLinkBlocked ? '恢复自动事件关联' : '重新扫描事件关联', 'rotateCcw');
                relink.addEventListener('click', async () => {
                    const result = await window.MemoryV2.resetMemoryEventLink(item.id);
                    if (!result) return;
                    closeTrace();
                    await refresh();
                });
                eventRow.append(eventCopy, relink);
            }
            correctionSection.appendChild(eventRow);

            const eventHint = documentRef.createElement('div');
            eventHint.textContent = trace.eventLinkBlocked
                ? '已阻止自动事件关联；恢复自动后会按当前记忆内容重新寻找最匹配事件。'
                : '事件关联只影响跨 App 事件召回，不会删除这条记忆或原始来源。';
            eventHint.style.cssText = 'color:#8e8e93;font:11px/1.45 -apple-system,BlinkMacSystemFont,"SF Pro Text",sans-serif;padding:0 2px';
            correctionSection.appendChild(eventHint);
        }

        if (correctionSection.childNodes.length > 1) scrollArea.appendChild(correctionSection);

        if (Array.isArray(trace.evidence.reasons) && trace.evidence.reasons.length) {
            const reasonSection = createReferenceTraceSection(documentRef, '为什么会记住');
            trace.evidence.reasons.forEach(reason => {
                const row = documentRef.createElement('div');
                row.textContent = reason;
                row.style.cssText = 'padding:9px 10px;border:1px solid rgba(60,60,67,.055);border-radius:12px;background:#f5f5f7;color:#3a3a3c;font:12px/1.5 -apple-system,BlinkMacSystemFont,"SF Pro Text",sans-serif';
                reasonSection.appendChild(row);
            });
            scrollArea.appendChild(reasonSection);
        }

        if (Array.isArray(trace.sources) && trace.sources.length) {
            const sourceSection = createReferenceTraceSection(documentRef, '来源');
            trace.sources.forEach(sourceItem => {
                const sourceCard = documentRef.createElement('div');
                sourceCard.style.cssText = 'display:grid;gap:5px;padding:10px 11px;border:1px solid rgba(60,60,67,.055);border-radius:12px;background:#f5f5f7';
                const meta = documentRef.createElement('div');
                const time = formatReferenceTraceTime(sourceItem.timestamp);
                meta.textContent = sourceItem.actorLabel + (time ? ' · ' + time : '') + (sourceItem.kind === 'message' && !sourceItem.live ? ' · 原消息已不在本地' : '');
                meta.style.cssText = 'color:#8e8e93;font:11px/1.4 -apple-system,BlinkMacSystemFont,"SF Pro Text",sans-serif';
                const text = documentRef.createElement('div');
                text.textContent = sourceItem.text || (sourceItem.messageId ? '保留来源引用：' + sourceItem.messageId : '手动记录');
                text.style.cssText = 'color:#1c1c1e;font:13px/1.5 -apple-system,BlinkMacSystemFont,"SF Pro Text",sans-serif;white-space:pre-wrap;word-break:break-word';
                sourceCard.append(meta, text);
                sourceSection.appendChild(sourceCard);
            });
            scrollArea.appendChild(sourceSection);
        }

        if (Array.isArray(trace.entities) && trace.entities.length) {
            const entitySection = createReferenceTraceSection(documentRef, '关联人物 / 实体');
            const chips = documentRef.createElement('div');
            chips.style.cssText = 'display:flex;flex-wrap:wrap;gap:7px';
            trace.entities.forEach(entity => {
                const chip = documentRef.createElement('span');
                chip.textContent = entity;
                chip.style.cssText = 'padding:6px 9px;border-radius:999px;background:#f2f2f7;color:#3a3a3c;font:12px/1 -apple-system,BlinkMacSystemFont,"SF Pro Text",sans-serif';
                chips.appendChild(chip);
            });
            entitySection.appendChild(chips);
            scrollArea.appendChild(entitySection);
        }

        if (trace.eventNode) {
            const eventSection = createReferenceTraceSection(documentRef, '关联事件');
            const eventCard = documentRef.createElement('div');
            eventCard.style.cssText = 'display:grid;gap:6px;padding:10px 11px;border-radius:10px;background:#f2f2f7';
            const eventMeta = documentRef.createElement('div');
            eventMeta.textContent = getReferenceEventStateLabel(trace.eventNode.state)
                + (trace.eventNode.sourceApps?.length ? ' · ' + getReferenceEventSourceLabel(trace.eventNode.sourceApps) : '');
            eventMeta.style.cssText = 'color:#8e8e93;font:11px/1.4 -apple-system,BlinkMacSystemFont,"SF Pro Text",sans-serif';
            const eventText = documentRef.createElement('div');
            eventText.textContent = trace.eventNode.text || '';
            eventText.style.cssText = 'color:#1c1c1e;font:13px/1.5 -apple-system,BlinkMacSystemFont,"SF Pro Text",sans-serif';
            eventCard.append(eventMeta, eventText);
            eventSection.appendChild(eventCard);
            scrollArea.appendChild(eventSection);
        }

        overlay.appendChild(sheet);
        overlay.addEventListener('click', event => { if (event.target === overlay) closeTrace(); });
        overlay.addEventListener('touchmove', event => {
            if (!sheet.contains(event.target)) event.preventDefault();
        }, { passive: false });
        documentRef.body.appendChild(overlay);
    }

    function openReferenceComposer(documentRef, item = null) {
        const contact = cachedContacts.find((item) => item.id === selectedContactId);
        if (!contact) {
            showReferenceRolePicker(documentRef);
            return;
        }
        const overlay = documentRef.createElement('div');
        overlay.className = 'switcher-overlay is-visible';
        const sheet = documentRef.createElement('div');
        sheet.className = 'modal-card';
        sheet.style.cssText = 'height:auto;min-height:220px;width:310px;display:block;padding:18px 16px;box-sizing:border-box';
        const title = documentRef.createElement('h3');
        title.className = 'modal-card-title';
        editingMemoryId = item && item.id ? item.id : '';
        title.textContent = editingMemoryId ? '编辑记忆' : '新增记忆';
        const input = documentRef.createElement('textarea');
        input.placeholder = '写下想让角色记住的事...';
        input.maxLength = 30000;
        input.value = item && item.content ? item.content : '';
        input.style.cssText = 'width:100%;height:110px;margin-top:14px;padding:10px;box-sizing:border-box;border:0;border-radius:10px;background:#f2f2f7;resize:none;font:15px/1.5 -apple-system,BlinkMacSystemFont,"SF Pro Text",sans-serif;outline:0';
        const actions = documentRef.createElement('div');
        actions.style.cssText = 'display:flex;justify-content:flex-end;gap:18px;margin-top:14px';
        const cancel = documentRef.createElement('button');
        cancel.type = 'button';
        cancel.textContent = '取消';
        const save = documentRef.createElement('button');
        save.type = 'button';
        save.textContent = '保存';
        [cancel, save].forEach((button) => { button.style.cssText = 'border:0;background:transparent;color:#007AFF;font:600 15px -apple-system,BlinkMacSystemFont,"SF Pro Text",sans-serif'; });
        cancel.addEventListener('click', () => overlay.remove());
        save.addEventListener('click', async () => {
            const hostInput = root.querySelector('[data-memory-composer-input]');
            const hostError = root.querySelector('[data-memory-composer-error]');
            hostInput.value = input.value;
            hostError.textContent = '';
            await saveManualMemory();
            if (!hostError.textContent) {
                overlay.remove();
            } else {
                input.setCustomValidity(hostError.textContent);
                input.reportValidity();
                input.setCustomValidity('');
            }
        });
        actions.append(cancel, save);
        sheet.append(title, input, actions);
        overlay.appendChild(sheet);
        overlay.addEventListener('click', (event) => { if (event.target === overlay) overlay.remove(); });
        documentRef.body.appendChild(overlay);
        requestAnimationFrame(() => input.focus());
    }

    function attachReferenceDocument(frame) {
        const documentRef = frame.contentDocument;
        const chromeOverride = documentRef.createElement('style');
        chromeOverride.textContent = `${SUMMARY_DISCLOSURE_CSS}
            body{display:block}.iphone-mockup{width:100%;height:100%;border-radius:0;box-shadow:none}.notch{display:none}.modal-card-avatar{background-size:cover;background-position:center;background-repeat:no-repeat}

            .memory-home-dashboard { display:grid; gap:14px; width:100%; min-width:0; max-width:100%; padding:0 0 104px; box-sizing:border-box; }
            .memory-home-card { position:relative; display:block; width:100%; min-width:0; max-width:100%; box-sizing:border-box; padding:18px; border:1px solid rgba(0,0,0,.035); border-radius:9px; background:rgba(255,255,255,.84); box-shadow:0 8px 28px rgba(0,0,0,.035); color:#1c1c1e; text-align:left; -webkit-backdrop-filter:blur(18px); backdrop-filter:blur(18px); }
            .memory-home-card-header { display:flex; align-items:center; justify-content:space-between; gap:12px; min-height:28px; margin-bottom:15px; }
            .memory-home-card-leading { min-width:0; display:flex; align-items:center; gap:10px; }
            .memory-home-card-icon { display:flex; align-items:center; justify-content:center; color:#4b4b4f; flex:0 0 auto; }
            .memory-home-card-icon .memory-home-svg { display:block; }
            .memory-home-card-title { color:#171719; font-size:17px; line-height:1.25; font-weight:800; letter-spacing:.01em; white-space:nowrap; }
            .memory-home-count { min-width:22px; height:22px; padding:0 7px; box-sizing:border-box; border-radius:999px; display:inline-flex; align-items:center; justify-content:center; background:#f0f0f2; color:#69696e; font-size:12px; font-weight:700; }
            .memory-home-card-action { flex:0 0 auto; display:inline-flex; align-items:center; gap:2px; border:0; padding:4px 0 4px 8px; background:transparent; color:#8e8e93; font:500 13px/1.2 -apple-system,BlinkMacSystemFont,"SF Pro Text","Helvetica Neue",sans-serif; cursor:pointer; }
            .memory-home-card-action span { display:flex; align-items:center; }
            .memory-home-pending-list { display:grid; min-width:0; gap:2px; }
            .memory-home-pending-row { min-height:42px; min-width:0; display:grid; grid-template-columns:24px minmax(0,1fr) auto auto; gap:9px; align-items:start; padding:5px 0; }
            .memory-home-pending-dot { width:18px; height:18px; margin-top:2px; border:1.6px solid #c9c9ce; border-radius:50%; box-sizing:border-box; }
            .memory-home-pending-text { min-width:0; max-width:100%; overflow:visible; text-overflow:clip; white-space:normal; overflow-wrap:anywhere; word-break:break-word; color:#1c1c1e; font-size:15px; line-height:1.45; font-weight:560; }
            .memory-home-tag { display:inline-flex; align-items:center; height:23px; padding:0 9px; border-radius:999px; font-size:12px; font-weight:650; white-space:nowrap; }
            .memory-home-tag.is-promise { background:#fbf1e6; color:#b77430; }
            .memory-home-tag.is-reminder { background:#eaf2fb; color:#4e78a7; }
            .memory-home-tag.is-pending { background:#f0ebfb; color:#7864a7; }
            .memory-home-pending-meta { color:#9a9aa0; font-size:12px; white-space:nowrap; }
            .memory-home-memory-chips { display:flex; min-width:0; flex-wrap:wrap; gap:9px; }
            .memory-home-memory-chip { width:100%; max-width:100%; min-width:0; min-height:34px; display:flex; align-items:flex-start; gap:7px; border:0; border-radius:18px; padding:8px 12px; box-sizing:border-box; background:#f3f3f4; color:#242426; font:600 13px/1.45 -apple-system,BlinkMacSystemFont,"SF Pro Text","Helvetica Neue",sans-serif; text-align:left; cursor:pointer; }
            .memory-home-memory-chip > span:last-child { flex:1 1 auto; min-width:0; max-width:100%; overflow:visible; text-overflow:clip; white-space:normal; overflow-wrap:anywhere; word-break:break-word; }
            .memory-home-memory-chip > span:first-child { display:flex; align-items:center; margin-top:1px; color:#5b5b60; flex:0 0 auto; }
            .memory-home-memory-chip .memory-home-svg { display:block; }
            .memory-home-card-footnote { margin-top:14px; display:flex; align-items:center; gap:7px; color:#98989d; font-size:12px; }
            .memory-home-empty-copy { margin:0; color:#9a9aa0; font-size:13px; }
            .memory-home-timeline { position:relative; display:grid; min-width:0; gap:12px; }
            .memory-home-timeline::before { content:""; position:absolute; left:7px; top:9px; bottom:9px; width:1px; background:#dedee2; }
            .memory-home-timeline-row { position:relative; display:grid; min-width:0; grid-template-columns:16px 78px auto minmax(0,1fr); gap:8px; align-items:start; min-height:24px; }
            .memory-home-timeline-dot { z-index:1; width:10px; height:10px; margin:4px 0 0 2px; border-radius:50%; background:#bdbdc2; box-shadow:0 0 0 4px rgba(255,255,255,.9); }
            .memory-home-timeline-time { padding-top:1px; color:#9a9aa0; font-size:12px; white-space:nowrap; }
            .memory-home-timeline-source { display:inline-flex; align-items:center; gap:5px; padding-top:1px; color:#55555a; font-size:12px; white-space:nowrap; }
            .memory-home-timeline-copy { min-width:0; max-width:100%; overflow:visible; text-overflow:clip; white-space:normal; overflow-wrap:anywhere; word-break:break-word; color:#303034; font-size:13px; line-height:1.45; font-weight:550; }
            .memory-home-cognition-panel { display:grid; min-width:0; max-width:100%; gap:10px; padding:13px 14px; box-sizing:border-box; border-radius:14px; background:rgba(244,244,246,.9); }
            .memory-home-cognition-row { display:grid; min-width:0; grid-template-columns:22px minmax(0,1fr); gap:9px; align-items:start; }
            .memory-home-cognition-icon { display:flex; align-items:center; justify-content:center; color:#5a5a60; padding-top:1px; }
            .memory-home-cognition-icon .memory-home-svg { display:block; }
            .memory-home-cognition-copy { min-width:0; max-width:100%; white-space:normal; color:#3a3a3f; font-size:13px; line-height:1.45; overflow-wrap:anywhere; word-break:break-word; }
            .memory-home-cognition-copy b { color:#5d5d62; font-weight:650; }
            .memory-home-recall-card { border:0; cursor:pointer; padding-right:42px; font-family:inherit; }
            .memory-home-recall-title { display:flex; align-items:center; gap:9px; color:#222225; font-size:16px; }
            .memory-home-recall-copy { display:block; margin-top:9px; color:#88888e; font-size:12px; line-height:1.55; }
            .memory-home-recall-chevron { position:absolute; right:17px; top:50%; transform:translateY(-50%); display:flex; color:#a5a5aa; }
            .memory-home-overview-back { width:100%; min-height:42px; margin:0 0 4px; display:flex; align-items:center; gap:5px; border:0; background:transparent; color:#68686e; font:600 13px/1 -apple-system,BlinkMacSystemFont,"SF Pro Text",sans-serif; cursor:pointer; }
            .memory-home-overview-back span { display:flex; }
            @media (max-width: 390px) {
                .memory-home-card { padding:16px; border-radius:9px; }
                .memory-home-pending-row { grid-template-columns:22px minmax(0,1fr) auto; }
                .memory-home-pending-meta { display:none; }
                .memory-home-timeline-row { grid-template-columns:16px 68px minmax(0,1fr); gap:7px; }
                .memory-home-timeline-source { display:none; }
            }
`;
        documentRef.head.appendChild(chromeOverride);
        const tabs = ['memory', 'relationship', 'archive'];
        const exitButton = documentRef.querySelector('.btn-circle');
        if (exitButton) {
            exitButton.addEventListener('click', (event) => {
                event.preventDefault();
                event.stopImmediatePropagation();
                close();
            }, true);
        }
        documentRef.querySelector('.btn-capsule')?.addEventListener('click', openSummarySettings);
        
        // 绑定 Char 头像切换
        documentRef.querySelector('.avatar-switch-badge')?.addEventListener('click', (e) => {
            // 防止点击气泡时触发头像切换
            if (e.target.closest('.bubble')) return;
            void showReferenceRolePicker(documentRef);
        }, true);
        
        // 绑定 User 头像切换
        documentRef.querySelector('.user-switch-badge')?.addEventListener('click', (e) => {
            // 防止点击气泡时触发头像切换
            if (e.target.closest('.bubble')) return;
            void showReferenceUserPicker(documentRef);
        }, true);

        // 绑定气泡编辑保存事件
        const charBubble = documentRef.getElementById('charBubble');
        const userBubble = documentRef.getElementById('userBubble');
        const saveBubble = (e, key) => {
            const text = e.target.textContent.trim();
            if (text) {
                localStorage.setItem(key, text);
            } else {
                const defaultText = key === 'memoryApp_charBubble' ? 'ㅎωㅎ' : '★(>ω<)!!♪';
                e.target.textContent = defaultText;
                localStorage.setItem(key, defaultText);
            }
        };
        if (charBubble) {
            charBubble.addEventListener('blur', (e) => saveBubble(e, 'memoryApp_charBubble'));
            charBubble.addEventListener('keydown', (e) => { if (e.key === 'Enter') { e.preventDefault(); charBubble.blur(); } });
        }
        if (userBubble) {
            userBubble.addEventListener('blur', (e) => saveBubble(e, 'memoryApp_userBubble'));
            userBubble.addEventListener('keydown', (e) => { if (e.key === 'Enter') { e.preventDefault(); userBubble.blur(); } });
        }

        documentRef.querySelectorAll('.segment-btn').forEach((button, index) => button.addEventListener('click', () => {
            activeTab = tabs[index] || 'memory';
            if (activeTab === 'memory') memoryHomeExpandedView = false;
            renderReferenceDocument();
        }, true));
        documentRef.querySelector('.search-box input')?.addEventListener('input', (event) => {
            memorySearchQuery = event.target.value || '';
            if (memorySearchQuery.trim()) memoryHomeExpandedView = false;
            renderReferenceDocument();
        });
        const actions = documentRef.querySelectorAll('.icon-action-btn');
        actions[0]?.addEventListener('click', openSummaryPanel, true);
        if (actions[1]) {
            actions[1].onclick = (event) => {
                event.preventDefault();
                event.stopPropagation();
                if (activeTab === 'relationship') {
                    openReferenceEventEditor(documentRef);
                    return;
                }
                void refresh().then(() => openReferenceComposer(documentRef));
            };
        }
        renderReferenceDocument();
    }

    async function showReferenceRolePicker(documentRef) {
        await refresh();
        const overlay = documentRef.getElementById('switcherOverlay');
        const list = overlay.querySelector('.modal-list-container');
        list.replaceChildren();
        if (!cachedContacts.length) {
            const emptyCard = documentRef.createElement('div');
            emptyCard.className = 'modal-card';
            emptyCard.style.cssText = 'height:auto;min-height:110px;display:block;padding:16px';
            const title = documentRef.createElement('h3');
            title.className = 'modal-card-title';
            title.textContent = '暂无可选角色';
            const copy = documentRef.createElement('p');
            copy.className = 'modal-card-subtitle';
            copy.textContent = '先在联系人中创建角色，再为其新增记忆。';
            const button = documentRef.createElement('button');
            button.type = 'button';
            button.textContent = '前往联系人';
            button.style.cssText = 'margin-top:12px;border:0;background:transparent;color:#007AFF;font:600 15px -apple-system,BlinkMacSystemFont,"SF Pro Text",sans-serif;padding:0';
            button.addEventListener('click', () => {
                overlay.classList.remove('is-visible');
                close();
                if (typeof window.openContactsApp === 'function') window.openContactsApp();
            });
            emptyCard.append(title, copy, button);
            list.appendChild(emptyCard);
            overlay.classList.add('is-visible');
            return;
        }
        cachedContacts.forEach((contact) => {
            const card = documentRef.createElement('button');
            card.type = 'button';
            card.className = 'modal-card';
            const avatar = documentRef.createElement('div');
            avatar.className = 'modal-card-avatar';
            if (contact.avatar) {
                avatar.style.backgroundImage = 'url(' + JSON.stringify(contact.avatar) + ')';
                avatar.style.backgroundSize = 'cover';
                avatar.style.backgroundPosition = 'center';
            }
            const info = documentRef.createElement('div');
            info.className = 'modal-card-info';
            const title = documentRef.createElement('h3');
            title.className = 'modal-card-title';
            title.textContent = contact.name || '未命名角色';
            const subtitle = documentRef.createElement('p');
            subtitle.className = 'modal-card-subtitle';
            subtitle.textContent = '共同记忆档案';
            info.append(title, subtitle);
            card.append(avatar, info);
            card.addEventListener('click', () => void selectRole(contact.id));
            list.appendChild(card);
        });
        overlay.classList.add('is-visible');
    }

    async function showReferenceUserPicker(documentRef) {
        const records = await readRecords(['contactsAppData']);
        const appData = records['contactsAppData'];
        const users = Array.isArray(appData && appData.data && appData.data.users) ? appData.data.users : [];
        
        const overlay = documentRef.getElementById('userSwitcherOverlay');
        const list = overlay.querySelector('.modal-list-container');
        list.replaceChildren();
        
        if (!users.length) {
            const emptyCard = documentRef.createElement('div');
            emptyCard.className = 'modal-card';
            emptyCard.style.cssText = 'height:auto;min-height:110px;display:block;padding:16px';
            const title = documentRef.createElement('h3');
            title.className = 'modal-card-title';
            title.textContent = '暂无可选用户';
            const copy = documentRef.createElement('p');
            copy.className = 'modal-card-subtitle';
            copy.textContent = '先在联系人中创建用户面具。';
            emptyCard.append(title, copy);
            list.appendChild(emptyCard);
            overlay.classList.add('is-visible');
            return;
        }
        
        users.forEach((user) => {
            const card = documentRef.createElement('button');
            card.type = 'button';
            card.className = 'modal-card';
            const avatar = documentRef.createElement('div');
            avatar.className = 'modal-card-avatar';
            if (user.avatar) {
                avatar.style.backgroundImage = 'url(' + JSON.stringify(user.avatar) + ')';
                avatar.style.backgroundSize = 'cover';
                avatar.style.backgroundPosition = 'center';
            }
            const info = documentRef.createElement('div');
            info.className = 'modal-card-info';
            const title = documentRef.createElement('h3');
            title.className = 'modal-card-title';
            title.textContent = user.name || '未命名用户';
            const subtitle = documentRef.createElement('p');
            subtitle.className = 'modal-card-subtitle';
            subtitle.textContent = user.phone || '用户面具';
            info.append(title, subtitle);
            card.append(avatar, info);
            card.addEventListener('click', () => {
                if (typeof appSettings !== 'undefined') {
                    appSettings.wc_current_user_id = user.id;
                    appSettings.wc_current_user_name = user.name;
                    appSettings.wc_current_user_avatar = user.avatar;
                    appSettings.wc_current_user_phone = user.phone;
                } else if (typeof window.appSettings !== 'undefined') {
                    window.appSettings.wc_current_user_id = user.id;
                    window.appSettings.wc_current_user_name = user.name;
                    window.appSettings.wc_current_user_avatar = user.avatar;
                    window.appSettings.wc_current_user_phone = user.phone;
                }
                
                if (typeof saveAppSettings === 'function') {
                    saveAppSettings();
                } else if (typeof window.saveAppSettings === 'function') {
                    window.saveAppSettings();
                }
                
                overlay.classList.remove('is-visible');
                renderReferenceDocument();
            });
            list.appendChild(card);
        });
        overlay.classList.add('is-visible');
    }

    function buildReferenceSummaryPanel() {
        const panel = document.createElement('section');
        panel.className = 'memory-summary-panel';
        panel.setAttribute('data-memory-summary-panel', '');
        panel.setAttribute('aria-hidden', 'true');
        panel.innerHTML = '<div class="memory-summary-panel-sheet" role="dialog" aria-modal="true" aria-labelledby="memorySummaryPanelTitle">'
            + '<div class="memory-composer-header"><button type="button" data-memory-action="close-summary-panel">完成</button><h2 id="memorySummaryPanelTitle">近期摘要</h2><button type="button" data-memory-action="refresh-summary">立即更新</button></div>'
            + '<div class="memory-summary-panel-scroll">'
            + '<p class="memory-summary-role" data-memory-summary-role></p>'
            + '<section class="memory-summary-range"><div class="memory-summary-section-header"><h3>选择摘要范围</h3><button type="button" data-memory-action="summarize-selected-range">按范围总结</button></div><p class="memory-summary-range-note">当前聊天记录共 <span data-memory-summary-range-count>0</span> 条</p><div class="memory-summary-range-fields"><label>起始消息<input type="number" inputmode="numeric" min="1" step="1" data-memory-summary-range-start></label><label>末尾消息<input type="number" inputmode="numeric" min="1" step="1" data-memory-summary-range-end></label></div><p class="memory-summary-status" data-memory-summary-status aria-live="polite"></p></section>'
            + '<section class="memory-summary-current"><div class="memory-summary-section-header"><h3>当前摘要</h3><div><button type="button" data-memory-action="confirm-summary">确认并空出</button><button type="button" data-memory-action="edit-summary">编辑</button><button type="button" data-memory-action="delete-summary">删除</button></div></div><div class="memory-summary-text" data-memory-summary-text></div><textarea data-memory-summary-input aria-label="修改当前摘要"></textarea><div class="memory-summary-edit-actions"><button type="button" data-memory-action="cancel-summary-edit">取消</button><button type="button" data-memory-action="save-summary-edit">保存修正</button></div><p class="memory-summary-meta" data-memory-summary-meta></p></section>'
            + '<section class="memory-summary-progress-section"><div class="memory-summary-section-header"><h3>自动更新进度</h3><span data-memory-summary-progress-copy></span></div><progress data-memory-summary-progress max="200" value="0"></progress></section>'
            + '<section class="memory-summary-source-section"><div class="memory-summary-section-header"><h3>摘要依据</h3><div><span data-memory-summary-source-count>0 条</span><button type="button" data-memory-action="toggle-summary-sources">查看依据</button></div></div><div class="memory-summary-sources" data-memory-summary-sources hidden></div></section>'
            + '</div></div>';
        root.appendChild(panel);
        panel.querySelector('[data-memory-action="close-summary-panel"]').addEventListener('click', closeSummaryPanel);
        panel.querySelector('[data-memory-action="refresh-summary"]').addEventListener('click', refreshSummaryNow);
        panel.querySelector('[data-memory-action="confirm-summary"]').addEventListener('click', () => void confirmCurrentSummary());
        panel.querySelector('[data-memory-action="edit-summary"]').addEventListener('click', startSummaryEdit);
        panel.querySelector('[data-memory-action="delete-summary"]').addEventListener('click', () => void removeCurrentSummary());
        panel.querySelector('[data-memory-action="summarize-selected-range"]').addEventListener('click', () => void summarizeSelectedRange());
        panel.querySelector('[data-memory-action="cancel-summary-edit"]').addEventListener('click', cancelSummaryEdit);
        panel.querySelector('[data-memory-action="save-summary-edit"]').addEventListener('click', saveEditedSummary);
        panel.querySelector('[data-memory-action="toggle-summary-sources"]').addEventListener('click', toggleSummarySources);
        panel.addEventListener('click', (event) => { if (event.target === panel) closeSummaryPanel(); });
        panel.addEventListener('keydown', (event) => { if (event.key === 'Escape') closeSummaryPanel(); });
    }

    function buildReferenceSettings() {
        const settings = document.createElement('section');
        settings.className = 'memory-summary-settings';
        settings.setAttribute('data-memory-summary-settings', '');
        settings.setAttribute('aria-hidden', 'true');
        settings.innerHTML = '<div class="memory-summary-settings-sheet" role="dialog" aria-modal="true">'
            + '<div class="memory-sheet-handle" aria-hidden="true"></div>'
            + '<div class="memory-composer-header"><button type="button" data-memory-action="close-summary-settings">取消</button><h2>记忆设置</h2><button type="button" data-memory-action="save-summary-settings">保存</button></div>'
            + '<p class="memory-settings-intro">让故事，不会忘记来时的路。</p>'
            + '<section class="memory-summary-control-card"><span class="memory-summary-card-icon" aria-hidden="true"><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" height="24" width="24"><g id="folder-history-fill"><path id="Union" fill="currentColor" d="M18 13c1.3833 0 2.5621 0.4879 3.5371 1.4629S23 16.6167 23 18s-0.4879 2.5621 -1.4629 3.5371S19.3833 23 18 23s-2.5621 -0.4879 -3.5371 -1.4629S13 19.3833 13 18s0.4879 -2.5621 1.4629 -3.5371S16.6167 13 18 13m0 2.25c-0.4142 0 -0.75 0.3358 -0.75 0.75v2c0 0.1989 0.0791 0.3896 0.2197 0.5303l1.25 1.25c0.2929 0.2929 0.7677 0.2929 1.0606 0s0.2929 -0.7677 0 -1.0606L18.75 17.6895V16c0 -0.4142 -0.3358 -0.75 -0.75 -0.75M8.09863 2.00488c0.229 0.02269 0.44426 0.12395 0.6084 0.28809L10.4141 4H17c1.1046 0 2 0.89543 2 2v5.0723c-0.3267 -0.0468 -0.6604 -0.0723 -1 -0.0723 -3.1709 0 -5.8483 2.1087 -6.709 5H4c-1.10457 0 -2 -0.8954 -2 -2V4c0 -1.10457 0.89543 -2 2 -2h4z" stroke-width="1"></path></g></svg></span><span class="memory-summary-card-copy"><strong>AI记忆分析</strong><small>每累计多少轮对话，用一次 API 更新待续事项、重要记忆、当前认知、近期经历与档案</small></span><span class="memory-summary-stepper"><button type="button" data-memory-action="decrease-summary-interval" aria-label="减少轮数">−</button><label><input type="number" inputmode="numeric" min="1" max="500" step="1" data-memory-summary-interval><small>轮对话</small></label><button type="button" data-memory-action="increase-summary-interval" aria-label="增加轮数">＋</button></span></section><h3 class="memory-source-group-title">记忆来源</h3>'
            + '<section class="memory-settings-section"><h3>向量模型</h3><p class="memory-semantic-settings-copy">下载到本机后，聊天内容不会上传。</p><label class="memory-semantic-settings-input"><span>自定义清单</span><input type="url" data-semantic-model-url placeholder="可选：manifest 地址"></label><button class="memory-model-download" type="button" data-memory-action="download-semantic-model">下载向量模型</button><progress class="memory-semantic-model-progress" data-semantic-model-progress max="1" value="0" hidden></progress><p class="memory-semantic-model-status" data-semantic-model-status>模型未下载</p><button class="memory-semantic-remove" type="button" data-memory-action="remove-semantic-model" hidden>删除本地模型</button></section>'
            + '<section class="memory-settings-section memory-external-section"><h3>外接记忆库</h3><p class="memory-semantic-settings-copy">本地 IndexedDB 是主数据源；数据只会以明文上传到你配置的用户云端，凭据仅保存在本机。</p><div class="memory-external-fields"><label class="memory-semantic-settings-input memory-sync-provider-field"><span>服务</span><button type="button" class="memory-sync-provider-button" data-memory-action="choose-memory-sync-provider" aria-haspopup="dialog"><span data-memory-sync-provider-label>通用 HTTP / Cloudflare Worker</span><span class="memory-sync-chevron" aria-hidden="true">›</span></button><input type="hidden" data-memory-sync-provider value="http"></label><label class="memory-semantic-settings-input"><span>地址</span><input type="url" data-memory-sync-url placeholder="用户自己的服务地址；Mem0/Zep 可留空"></label><label class="memory-semantic-settings-input"><span>API Key</span><input type="password" data-memory-sync-key autocomplete="off"></label><label class="memory-semantic-settings-input"><span>访问令牌</span><input type="password" data-memory-sync-token autocomplete="off" placeholder="Supabase/HTTP 可选"></label><label class="memory-semantic-settings-input"><span>Supabase 表</span><input type="text" data-memory-sync-table placeholder="tonghuaji_memories"></label><label class="memory-semantic-settings-input"><span>命名空间</span><input type="text" data-memory-sync-namespace placeholder="用于隔离角色数据"></label></div><label class="memory-sync-toggle-row is-on"><span><strong>自动同步</strong><small>后台静默执行</small></span><input type="checkbox" data-memory-sync-auto checked><span class="memory-sync-switch" aria-hidden="true"></span></label><fieldset class="memory-sync-scope"><legend>上传范围</legend><label><input type="checkbox" data-memory-sync-tier="L1"> L1 确认记忆</label><label><input type="checkbox" data-memory-sync-tier="L2"> L2 摘要</label><label><input type="checkbox" data-memory-sync-chat> 聊天记录</label><label><input type="checkbox" data-memory-sync-archived> 包含归档</label><label><input type="radio" name="memory-sync-roles" value="current" checked> 当前角色</label><label><input type="radio" name="memory-sync-roles" value="all"> 全部角色</label></fieldset><div class="memory-sync-actions"><button type="button" data-memory-action="test-memory-sync">测试连接</button><button type="button" data-memory-action="save-memory-sync">保存同步设置</button><button type="button" data-memory-action="sync-memory-now">立即同步</button><button type="button" data-memory-action="restore-memory-sync">下载恢复</button><button type="button" data-memory-action="setup-memory-supabase">初始化 Supabase</button><a href="cloud-memory/README.md" target="_blank" rel="noopener">部署说明</a></div><p class="memory-composer-error" data-memory-sync-status aria-live="polite"></p></section><div class="memory-settings-privacy"><svg viewBox="0 0 24 24" aria-hidden="true"><rect x="5" y="10" width="14" height="10" rx="2"></rect><path d="M8 10V7a4 4 0 0 1 8 0v3"></path></svg>你的记忆数据仅存储在你自己的设备或服务中</div><p class="memory-composer-error" data-memory-summary-error aria-live="polite"></p></div>';
        const localSection = settings.querySelector('.memory-settings-section:not(.memory-external-section)');
        const externalSection = settings.querySelector('.memory-external-section');
        const summaryApiCard = document.createElement('label');
        summaryApiCard.className = 'memory-summary-api-card';
        summaryApiCard.innerHTML = '<span class="memory-summary-card-icon" aria-hidden="true"><svg data-mdi-icon="message-processing" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M17,11H15V9H17M13,11H11V9H13M9,11H7V9H9M20,2H4A2,2 0 0,0 2,4V22L6,18H20A2,2 0 0,0 22,16V4C22,2.89 21.1,2 20,2Z"></path></svg></span><span class="memory-summary-card-copy"><strong>分析模型</strong><small data-memory-summary-api-hint>跟随当前聊天 API</small></span><select data-memory-summary-api-preset aria-label="记忆总结 API 预设"><option value="">跟随当前聊天 API</option></select>';
        settings.querySelector('.memory-summary-control-card')?.insertAdjacentElement('afterend', summaryApiCard);
        const summaryPromptSection = document.createElement('section');
        summaryPromptSection.className = 'memory-settings-section memory-summary-prompt-section';
        summaryPromptSection.innerHTML = '<h3>摘要提示词</h3><p class="memory-semantic-settings-copy">内置提示词默认启用且不会显示。开启后使用你填写的自定义提示词。</p><label class="memory-sync-toggle-row"><span><strong>使用自定义提示词</strong><small>关闭时使用内置日记提示词</small></span><input type="checkbox" data-memory-summary-prompt-custom><span class="memory-sync-switch" aria-hidden="true"></span></label><label class="memory-summary-custom-prompt" data-memory-summary-custom-prompt-section hidden><span>自定义提示词</span><textarea data-memory-summary-custom-prompt maxlength="12000" placeholder="输入用于生成摘要的自定义提示词"></textarea></label>';
        localSection.parentNode.insertBefore(summaryPromptSection, localSection);
        makeMemorySettingsCollapsible(summaryPromptSection, '摘要提示词', '选择内置提示词或填写自定义内容', '<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" height="24" width="24"><g id="Quick-Reference-All-Fill"><path id="Union" fill="currentColor" d="M16.5 12c2.4853 0 4.5 2.0147 4.5 4.5 0 0.8804 -0.2544 1.7009 -0.6914 2.3945l2.6484 2.6485 -1.414 1.414 -2.6485 -2.6484c-0.6936 0.437 -1.5141 0.6914 -2.3945 0.6914 -2.4853 0 -4.5 -2.0147 -4.5 -4.5s2.0147 -4.5 4.5 -4.5m0.5 -4.41406v2.43456c-0.1651 -0.0126 -0.3317 -0.0205 -0.5 -0.0205 -3.5899 0 -6.5 2.9101 -6.5 6.5 0 0.886 0.178 1.7303 0.499 2.5H4c-0.55228 0 -1 -0.4477 -1 -1V3l0.00488 -0.10254C3.05621 2.39333 3.48232 2 4 2h7.4141zM16.5 14c-1.3807 0 -2.5 1.1193 -2.5 2.5s1.1193 2.5 2.5 2.5 2.5 -1.1193 2.5 -2.5 -1.1193 -2.5 -2.5 -2.5m-5.75 -5.75h4.0859L10.75 4.16406z" stroke-width="1"></path></g></svg>', '内置');
        makeMemorySettingsCollapsible(localSection, '本地向量模型', '用于快速检索本地记忆', '<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" id="Global-Learning--Streamline-Sharp" height="24" width="24"><g id="global-learning--global-learning-education"><path id="Union" fill="currentColor" fill-rule="evenodd" d="m23.09 13.924 -6.82 -2.956 -6.822 2.956v5.486h1.433v-3.503l5.389 2.335 6.82 -2.956v-1.362Zm-11.136 3.983 0.006 2.49 4.309 2.02 4.316 -2.02 0 -2.49 -4.039 1.69 -0.276 0.116 -0.277 -0.115 -4.04 -1.69Z" clip-rule="evenodd" stroke-width="1"></path><path id="Subtract" fill="currentColor" fill-rule="evenodd" d="M6.765 10.561h6.239l-0.092 0.3 -4.897 2.122v1.67l-1.25 -4.092Zm4.116 6.948 -0.368 1.205a9.016 9.016 0 0 1 -1.065 0.012v-4.802l2.914 -1.262 -1.049 3.433 -0.432 -0.187v1.601Zm1.9 0.745a8.895 8.895 0 0 1 -0.693 0.207l0.135 -0.44 0.558 0.233Zm1.69 -0.79 -1.835 -0.796 1.453 -4.755 2.18 -0.944 2.257 0.977a8.906 8.906 0 0 1 -4.054 5.517ZM12.088 1.227a8.898 8.898 0 0 1 6.66 7.9h-4.246l-2.414 -7.9Zm0.916 7.9L10.513 0.975a9.02 9.02 0 0 0 -1.257 0L6.765 9.128h6.239Zm-11.983 0a8.898 8.898 0 0 1 6.66 -7.9l-2.414 7.9H1.02Zm6.66 9.333a8.898 8.898 0 0 1 -6.66 -7.9h4.246l2.414 7.9Z" clip-rule="evenodd" stroke-width="1"></path></g></svg>');
        const remoteSection = buildRemoteVectorSection(settings);
        externalSection.parentNode.insertBefore(remoteSection, externalSection);
        const vectorSection = document.createElement('section');
        vectorSection.className = 'memory-settings-section memory-vector-rebuild-section';
        vectorSection.innerHTML = '<h3>重建向量记忆</h3><p class="memory-semantic-settings-copy">重新使用向量模型处理已有记忆、历史摘要索引及事件。不重做聊天摘要，不改变原始记忆。</p><button type="button" class="memory-model-download" data-memory-action="rebuild-vector-memory">重新生成向量索引</button><p class="memory-semantic-model-status" data-memory-vector-rebuild-status aria-live="polite">正在检查向量索引…</p><p class="memory-summary-settings-note">每次最多处理 24 个文本片段，远程向量 API 可能收费。失败后可继续。</p>';
        externalSection.parentNode.insertBefore(vectorSection, externalSection);
        makeMemorySettingsCollapsible(vectorSection, '重建向量记忆', '手动调用向量模型修复旧索引',
            '<svg data-mdi-icon="database-import" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M12,3C8.59,3 5.69,4.07 4.54,5.57L9.79,10.82C10.5,10.93 11.22,11 12,11C16.42,11 20,9.21 20,7C20,4.79 16.42,3 12,3M3.92,7.08L2.5,8.5L5,11H0V13H5L2.5,15.5L3.92,16.92L8.84,12M20,9C20,11.21 16.42,13 12,13C11.34,13 10.7,12.95 10.09,12.87L7.62,15.34C8.88,15.75 10.38,16 12,16C16.42,16 20,14.21 20,12M20,14C20,16.21 16.42,18 12,18C9.72,18 7.67,17.5 6.21,16.75L4.53,18.43C5.68,19.93 8.59,21 12,21C16.42,21 20,19.21 20,17"></path></svg>', '未检查');
        makeMemorySettingsCollapsible(remoteSection, '其他向量模型', '连接第三方向量服务', '<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 14" id="Industry-Innovation-And-Infrastructure--Streamline-Core-Remix" height="14" width="14"><g id="Free Remix/Nature Ecology/industry-innovation-and-infrastructure"><path id="Union" fill="currentColor" fill-rule="evenodd" d="M6.72063 0.940983c0.17595 -0.087977 0.38306 -0.087977 0.55902 0L10.274 2.43816c0.1165 0.0567 0.2164 0.14992 0.2806 0.27332 0.0045 0.00872 0.0088 0.01755 0.013 0.02648 0.041 0.08877 0.0595 0.18253 0.0575 0.2746v3.10117l2.6489 1.32445c0.1165 0.05669 0.2164 0.14991 0.2806 0.2733 0.0046 0.00883 0.0089 0.01778 0.0131 0.02683 0.041 0.08866 0.0594 0.1823 0.0574 0.27425V11.5c0 0.2367 -0.1337 0.4531 -0.3455 0.559l-3 1.5c-0.1759 0.088 -0.38302 0.088 -0.55897 0l-2.72049 -1.3602 -2.72049 1.3602c-0.17596 0.088 -0.38307 0.088 -0.55902 0l-3.000002 -1.5c-0.21174 -0.1059 -0.345491 -0.3223 -0.345491 -0.559V8.01257c-0.001913 -0.09123 0.016186 -0.18412 0.056462 -0.27218 0.004459 -0.00976 0.009167 -0.0194 0.014116 -0.02891 0.064166 -0.1234 0.164023 -0.21662 0.280541 -0.27331L3.37514 6.11373V3.01257c-0.00192 -0.09123 0.01618 -0.18412 0.05646 -0.27218 0.00446 -0.00976 0.00917 -0.0194 0.01411 -0.02891 0.06417 -0.1234 0.16404 -0.21663 0.28056 -0.27332L6.72063 0.940983ZM1.62514 9.01127 3.72063 10.059c0.17595 0.088 0.38306 0.088 0.55902 0l2.09549 -1.04773v2.10243l-2.375 1.1875 -2.375 -1.1875V9.01127Zm6 2.10243V9.01127L9.72063 10.059c0.17595 0.088 0.38307 0.088 0.55897 0l2.0955 -1.04773v2.10243l-2.375 1.1875 -2.37496 -1.1875Zm-3 -7.10243v2.10246l2.375 1.1875 2.375 -1.1875V4.01127L7.27965 5.05902c-0.17596 0.08797 -0.38307 0.08797 -0.55902 0L4.62514 4.01127Z" clip-rule="evenodd" stroke-width="1"></path></g></svg>');
        makeMemorySettingsCollapsible(externalSection, '外接记忆库', '连接自己的记忆服务器', '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" id="Hard-Drive-1--Streamline-Ultimate" height="24" width="24"><g id="Hard-Drive-1--Streamline-Ultimate.svg"><path d="M23 11.75H1a1 1 0 0 0 -1 1v3a2.5 2.5 0 0 0 1.59 2.32 0.24 0.24 0 0 1 0.16 0.23v1.2a0.75 0.75 0 0 0 1.5 0v-1a0.25 0.25 0 0 1 0.25 -0.25h17a0.25 0.25 0 0 1 0.25 0.25v1a0.75 0.75 0 0 0 1.5 0v-1.2a0.24 0.24 0 0 1 0.16 -0.23A2.5 2.5 0 0 0 24 15.75v-3a1 1 0 0 0 -1 -1Zm-3 4a1 1 0 1 1 1 -1 1 1 0 0 1 -1 1Zm-2 -1a1 1 0 1 1 -1 -1 1 1 0 0 1 1 1Zm-3 0a1 1 0 1 1 -1 -1 1 1 0 0 1 1 1Z" fill="currentColor" stroke-width="1"></path><path d="M1.08 10.75h21.84a1 1 0 0 0 0.92 -0.63 1 1 0 0 0 -0.21 -1.07l-4.57 -4.86A1.5 1.5 0 0 0 18 3.75H6a1.51 1.51 0 0 0 -1.07 0.45L0.39 9a1 1 0 0 0 -0.23 1.09 1 1 0 0 0 0.92 0.66Z" fill="currentColor" stroke-width="1"></path></g></svg>', '未连接');
        root.appendChild(settings);
        settings.querySelector('[data-memory-action="close-summary-settings"]').addEventListener('click', (event) => {
            event.preventDefault();
            event.stopPropagation();
            closeSummarySettings();
        });
        settings.addEventListener('click', (event) => { if (event.target === settings) closeSummarySettings(); });
        settings.addEventListener('keydown', (event) => { if (event.key === 'Escape') closeSummarySettings(); });
        settings.querySelector('[data-memory-action="save-summary-settings"]').addEventListener('click', saveSummarySettings);
        settings.querySelector('[data-memory-action="rebuild-vector-memory"]').addEventListener('click', () => void rebuildVectorMemoryNow());
        settings.querySelector('[data-memory-action="decrease-summary-interval"]').addEventListener('click', () => adjustSummaryInterval(-1));
        settings.querySelector('[data-memory-action="increase-summary-interval"]').addEventListener('click', () => adjustSummaryInterval(1));
        settings.querySelector('[data-memory-summary-api-preset]')?.addEventListener('change', updateSummaryApiPresetHint);
        settings.querySelector('[data-memory-summary-prompt-custom]').addEventListener('change', (event) => {
            const enabled = event.currentTarget.checked;
            event.currentTarget.closest('.memory-sync-toggle-row')?.classList.toggle('is-on', enabled);
            settings.querySelector('[data-memory-summary-custom-prompt-section]').hidden = !enabled;
        });
        settings.querySelector('[data-memory-action="download-semantic-model"]').addEventListener('click', downloadSemanticModel);
        settings.querySelector('[data-memory-action="remove-semantic-model"]').addEventListener('click', removeSemanticModel);
        settings.querySelector('[data-memory-action="test-memory-sync"]').addEventListener('click', testMemorySync);
        settings.querySelector('[data-memory-action="save-memory-sync"]').addEventListener('click', saveMemorySyncSettings);
        settings.querySelector('[data-memory-action="sync-memory-now"]').addEventListener('click', syncMemoryNow);
        settings.querySelector('[data-memory-action="restore-memory-sync"]').addEventListener('click', restoreMemorySync);
        settings.querySelector('[data-memory-action="setup-memory-supabase"]').addEventListener('click', openMemorySupabaseSetupDialog);
        settings.querySelector('[data-memory-action="pull-memory-remote-model"]').addEventListener('click', pullRemoteVectorModels);
        settings.querySelector('[data-memory-action="save-memory-remote-model"]').addEventListener('click', saveRemoteVectorSettings);
        settings.querySelector('[data-memory-action="choose-memory-remote-model"]').addEventListener('click', openRemoteVectorModelDialog);
        settings.querySelector('[data-memory-action="choose-memory-sync-provider"]').addEventListener('click', openMemorySyncProviderDialog);
        settings.querySelector('[data-memory-sync-auto]').addEventListener('change', (event) => event.currentTarget.closest('.memory-sync-toggle-row').classList.toggle('is-on', event.currentTarget.checked));
        const providerDialog = document.createElement('section');
        providerDialog.className = 'memory-choice-dialog';
        providerDialog.setAttribute('data-memory-sync-provider-dialog', '');
        providerDialog.setAttribute('aria-hidden', 'true');
        providerDialog.innerHTML = '<div class="memory-choice-backdrop" data-memory-action="close-memory-sync-provider"></div><div class="memory-choice-sheet" role="dialog" aria-modal="true" aria-labelledby="memorySyncProviderTitle"><div class="memory-composer-header"><button type="button" data-memory-action="close-memory-sync-provider">取消</button><h2 id="memorySyncProviderTitle">选择服务</h2><span></span></div><div class="memory-choice-list">' + [['http', '通用 HTTP / Cloudflare Worker'], ['mem0', 'Mem0 Platform'], ['zep', 'Zep'], ['supabase', 'Supabase']].map(([value, label]) => '<button type="button" class="memory-choice-option" data-memory-sync-provider-option="' + value + '" data-label="' + label + '" aria-checked="false"><span>' + label + '</span><span class="memory-choice-check" aria-hidden="true">✓</span></button>').join('') + '</div></div>';
        settings.appendChild(providerDialog);
        providerDialog.querySelectorAll('[data-memory-action="close-memory-sync-provider"]').forEach((button) => button.addEventListener('click', closeMemorySyncProviderDialog));
        providerDialog.querySelectorAll('[data-memory-sync-provider-option]').forEach((button) => button.addEventListener('click', () => selectMemorySyncProvider(button.dataset.memorySyncProviderOption)));
        const deployDialog = document.createElement('section');
        deployDialog.className = 'memory-choice-dialog memory-cloudflare-deploy-dialog';
        deployDialog.setAttribute('data-memory-cloudflare-deploy-dialog', '');
        deployDialog.setAttribute('aria-hidden', 'true');
        deployDialog.innerHTML = '<div class="memory-choice-backdrop" data-memory-action="close-memory-cloudflare-deploy"></div><div class="memory-choice-sheet" role="dialog" aria-modal="true" aria-labelledby="memoryCloudflareDeployTitle"><div class="memory-composer-header"><button type="button" data-memory-action="close-memory-cloudflare-deploy">取消</button><h2 id="memoryCloudflareDeployTitle">一键部署记忆库</h2><span></span></div><div class="memory-cloudflare-deploy-body"><p class="memory-semantic-settings-copy">部署到你自己的 Cloudflare 账户。Cloudflare API Token 只在本次操作中使用，不会保存到本机。</p><label class="memory-semantic-settings-input"><span>Account ID</span><input type="text" data-memory-cloudflare-account autocomplete="off" spellcheck="false" placeholder="Cloudflare 账户 ID"></label><label class="memory-semantic-settings-input"><span>API Token</span><input type="password" data-memory-cloudflare-token autocomplete="off" placeholder="需要 D1 编辑和 Workers Scripts 编辑权限"></label><label class="memory-semantic-settings-input"><span>服务名称</span><input type="text" data-memory-cloudflare-name autocomplete="off" spellcheck="false" value="tonghuaji-memory"></label><p class="memory-cloudflare-deploy-status" data-memory-cloudflare-deploy-status aria-live="polite"></p><button type="button" class="memory-model-download" data-memory-action="run-memory-cloudflare-deploy">开始部署</button></div></div>';
        settings.appendChild(deployDialog);
        deployDialog.querySelectorAll('[data-memory-action="close-memory-cloudflare-deploy"]').forEach((button) => button.addEventListener('click', closeMemoryCloudflareDeployDialog));
        deployDialog.querySelector('[data-memory-action="run-memory-cloudflare-deploy"]').addEventListener('click', deployMemoryCloudflare);
        const supabaseDialog = document.createElement('section');
        supabaseDialog.className = 'memory-choice-dialog memory-supabase-setup-dialog';
        supabaseDialog.setAttribute('data-memory-supabase-setup-dialog', '');
        supabaseDialog.setAttribute('aria-hidden', 'true');
        supabaseDialog.innerHTML = '<div class="memory-choice-backdrop" data-memory-action="close-memory-supabase-setup"></div><div class="memory-choice-sheet" role="dialog" aria-modal="true" aria-labelledby="memorySupabaseSetupTitle"><div class="memory-composer-header"><button type="button" data-memory-action="close-memory-supabase-setup">取消</button><h2 id="memorySupabaseSetupTitle">初始化 Supabase 记忆库</h2><span></span></div><div class="memory-supabase-setup-body"><p class="memory-semantic-settings-copy">数据只保存到你自己的 Supabase。先复制 SQL 到 SQL Editor 执行，再注册或登录记忆库账号。</p><label class="memory-semantic-settings-input"><span>项目 URL</span><input type="url" data-memory-supabase-url autocomplete="url" placeholder="https://你的项目.supabase.co"></label><label class="memory-semantic-settings-input"><span>Publishable / Anon Key</span><input type="password" data-memory-supabase-key autocomplete="off" placeholder="不要填写 service_role key"></label><label class="memory-semantic-settings-input"><span>邮箱</span><input type="email" data-memory-supabase-email autocomplete="email" placeholder="你在这个 Supabase 项目中的账号"></label><label class="memory-semantic-settings-input"><span>密码</span><input type="password" data-memory-supabase-password autocomplete="current-password" placeholder="不会保存密码"></label><label class="memory-semantic-settings-input"><span>表名</span><input type="text" data-memory-supabase-table value="tonghuaji_memories" autocomplete="off"></label><div class="memory-sync-actions"><button type="button" data-memory-action="copy-supabase-sql">复制初始化 SQL</button><button type="button" data-memory-action="open-supabase-sql">打开 SQL Editor</button><button type="button" data-memory-action="signup-memory-supabase">注册账号</button><button type="button" data-memory-action="login-memory-supabase">登录并连接</button></div><p class="memory-supabase-setup-status" data-memory-supabase-setup-status aria-live="polite"></p></div></div>';
        settings.appendChild(supabaseDialog);
        supabaseDialog.querySelectorAll('[data-memory-action="close-memory-supabase-setup"]').forEach((button) => button.addEventListener('click', closeMemorySupabaseSetupDialog));
        supabaseDialog.querySelector('[data-memory-action="copy-supabase-sql"]').addEventListener('click', copySupabaseMemorySql);
        supabaseDialog.querySelector('[data-memory-action="open-supabase-sql"]').addEventListener('click', openSupabaseSqlEditor);
        supabaseDialog.querySelector('[data-memory-action="signup-memory-supabase"]').addEventListener('click', signupMemorySupabase);
        supabaseDialog.querySelector('[data-memory-action="login-memory-supabase"]').addEventListener('click', loginMemorySupabase);
        const remoteModelDialog = document.createElement('section');
        remoteModelDialog.className = 'memory-choice-dialog';
        remoteModelDialog.setAttribute('data-memory-remote-model-dialog', '');
        remoteModelDialog.setAttribute('aria-hidden', 'true');
        remoteModelDialog.innerHTML = '<div class="memory-choice-backdrop" data-memory-action="close-memory-remote-model"></div><div class="memory-choice-sheet" role="dialog" aria-modal="true" aria-labelledby="memoryRemoteModelTitle"><div class="memory-composer-header"><button type="button" data-memory-action="close-memory-remote-model">取消</button><h2 id="memoryRemoteModelTitle">选择模型</h2><span></span></div><div class="memory-choice-list"></div></div>';
        settings.appendChild(remoteModelDialog);
        remoteModelDialog.querySelectorAll('[data-memory-action="close-memory-remote-model"]').forEach((button) => button.addEventListener('click', () => { remoteModelDialog.classList.remove('is-visible'); remoteModelDialog.setAttribute('aria-hidden', 'true'); }));
        void loadMemorySyncSettings();
        void loadRemoteVectorSettings();
    }

    async function loadMemorySyncSettings() {
        const config = await window.MemorySync?.init?.().then(() => window.MemorySync.getSettings()).catch(() => null);
        if (!config || !root) return;
        const section = root.querySelector('.memory-external-section'); if (!section) return;
        const provider = config.provider || 'http';
        section.querySelector('[data-memory-sync-provider]').value = provider;
        const providerOption = root.querySelector('[data-memory-sync-provider-option="' + provider + '"]');
        if (providerOption) selectMemorySyncProvider(provider);
        section.querySelector('[data-memory-sync-url]').value = config.baseUrl || '';
        section.querySelector('[data-memory-sync-namespace]').value = config.namespace || '';
        const keyInput = section.querySelector('[data-memory-sync-key]');
        const tokenInput = section.querySelector('[data-memory-sync-token]');
        const tableInput = section.querySelector('[data-memory-sync-table]');
        if (keyInput) keyInput.placeholder = config.hasApiKey ? '已配置，留空则继续使用' : '';
        if (tokenInput) tokenInput.placeholder = config.hasToken ? '已配置，留空则继续使用' : 'Supabase/HTTP 可选';
        if (tableInput) tableInput.value = config.table || '';
        section.querySelectorAll('[data-memory-sync-tier]').forEach((input) => { input.checked = false; });
        (config.scope?.tiers || ['L1']).forEach((tier) => { const input = section.querySelector('[data-memory-sync-tier="' + tier + '"]'); if (input) input.checked = true; });
        section.querySelector('[data-memory-sync-chat]').checked = config.scope?.includeChat === true;
        section.querySelector('[data-memory-sync-archived]').checked = config.scope?.includeArchived === true;
        section.querySelector('[data-memory-sync-auto]').checked = config.autoSync !== false;
        section.querySelector('.memory-sync-toggle-row').classList.toggle('is-on', config.autoSync !== false);
        const role = section.querySelector('[name="memory-sync-roles"][value="' + (config.scope?.roles || 'current') + '"]'); if (role) role.checked = true;
        const syncState = window.MemorySync.getStatus();
        section.querySelector('[data-memory-sync-status]').textContent = syncState.error ? ('上次同步失败：' + syncState.error) : syncState.lastSyncAt ? ('上次同步：' + new Date(syncState.lastSyncAt).toLocaleString() + (syncState.conflicts ? '，本地优先合并 ' + syncState.conflicts + ' 个冲突' : '')) : '';
        const sourceStatus = section.querySelector('[data-memory-section-status]');
        if (sourceStatus) sourceStatus.textContent = config.enabled ? '已连接' : '未连接';
    }
    function memorySyncConfigFromUi() { const section = root.querySelector('.memory-external-section'); const provider = section.querySelector('[data-memory-sync-provider]').value; const enteredUrl = section.querySelector('[data-memory-sync-url]').value.trim(); const baseUrl = enteredUrl || (provider === 'mem0' ? 'https://api.mem0.ai' : provider === 'zep' ? 'https://api.getzep.com/api/v2' : ''); return { enabled: Boolean(baseUrl), autoSync: section.querySelector('[data-memory-sync-auto]').checked, provider, baseUrl, namespace: section.querySelector('[data-memory-sync-namespace]').value.trim(), scope: { roles: section.querySelector('[name="memory-sync-roles"]:checked')?.value || 'current', tiers: Array.from(section.querySelectorAll('[data-memory-sync-tier]:checked')).map((input) => input.getAttribute('data-memory-sync-tier')), includeChat: section.querySelector('[data-memory-sync-chat]').checked, includeArchived: section.querySelector('[data-memory-sync-archived]').checked } }; }
    async function saveMemorySyncSettings() { const section = root.querySelector('.memory-external-section'); const status = section.querySelector('[data-memory-sync-status]'); const apiKey = section.querySelector('[data-memory-sync-key]').value.trim(); const token = section.querySelector('[data-memory-sync-token]').value.trim(); const table = section.querySelector('[data-memory-sync-table]').value.trim(); await window.MemorySync.saveConfig(memorySyncConfigFromUi(), { ...(apiKey ? { apiKey } : {}), ...(token ? { token } : {}), ...(table ? { table } : {}) }); status.textContent = '同步设置已保存。'; }
    async function testMemorySync() { const section = root.querySelector('.memory-external-section'); const status = section.querySelector('[data-memory-sync-status]'); try { await saveMemorySyncSettings(); await window.MemorySync.testConnection(); status.textContent = '连接成功。'; } catch (error) { status.textContent = '连接失败：' + String(error.message || error); } }
    async function syncMemoryNow() { const status = root.querySelector('[data-memory-sync-status]'); try { const result = await window.MemorySync.syncNow(selectedContactId); status.textContent = '同步完成：上传 ' + (result.uploaded || 0) + ' 条，恢复 ' + (result.restored || 0) + ' 条' + (result.conflicts ? '，本地优先合并 ' + result.conflicts + ' 个冲突' : '') + '。'; await preload(); render(); } catch (error) { status.textContent = '同步失败：' + String(error.message || error); } }
    async function restoreMemorySync() { const status = root.querySelector('[data-memory-sync-status]'); try { const result = await window.MemorySync.restoreNow(selectedContactId); status.textContent = '下载恢复完成：恢复 ' + (result.restored || 0) + ' 条。'; await preload(); render(); } catch (error) { status.textContent = '恢复失败：' + String(error.message || error); } }

    function openMemorySupabaseSetupDialog() {
        const dialog = root?.querySelector('[data-memory-supabase-setup-dialog]');
        if (!dialog) return;
        const section = root.querySelector('.memory-external-section');
        const config = window.MemorySync?.getSettings?.() || {};
        dialog.querySelector('[data-memory-supabase-url]').value = config.provider === 'supabase' ? (config.baseUrl || '') : '';
        dialog.querySelector('[data-memory-supabase-key]').value = '';
        dialog.querySelector('[data-memory-supabase-email]').value = '';
        dialog.querySelector('[data-memory-supabase-password]').value = '';
        dialog.querySelector('[data-memory-supabase-table]').value = config.provider === 'supabase' ? (config.table || 'tonghuaji_memories') : 'tonghuaji_memories';
        dialog.querySelector('[data-memory-supabase-setup-status]').textContent = '';
        dialog.setAttribute('aria-hidden', 'false');
        dialog.classList.add('is-visible');
        requestAnimationFrame(() => dialog.querySelector('[data-memory-supabase-url]').focus());
    }

    function closeMemorySupabaseSetupDialog() {
        const dialog = root?.querySelector('[data-memory-supabase-setup-dialog]');
        if (!dialog) return;
        dialog.setAttribute('aria-hidden', 'true');
        dialog.classList.remove('is-visible');
        dialog.querySelector('[data-memory-supabase-key]').value = '';
        dialog.querySelector('[data-memory-supabase-password]').value = '';
    }

    async function getSupabaseMemorySql() {
        const response = await fetch(new URL('cloud-memory/supabase.sql', document.baseURI), { cache: 'no-store' });
        if (!response.ok) throw new Error('无法读取初始化 SQL，请确认应用资源完整。');
        return response.text();
    }

    async function copySupabaseMemorySql() {
        const dialog = root?.querySelector('[data-memory-supabase-setup-dialog]');
        if (!dialog) return;
        const status = dialog.querySelector('[data-memory-supabase-setup-status]');
        try {
            const sql = await getSupabaseMemorySql();
            if (navigator.clipboard?.writeText) {
                await navigator.clipboard.writeText(sql);
            } else {
                const textarea = document.createElement('textarea');
                textarea.value = sql;
                textarea.setAttribute('readonly', '');
                textarea.style.position = 'fixed';
                textarea.style.opacity = '0';
                document.body.appendChild(textarea);
                textarea.select();
                document.execCommand('copy');
                textarea.remove();
            }
            status.textContent = '初始化 SQL 已复制。请在自己的 Supabase SQL Editor 中执行。';
        } catch (error) {
            status.textContent = '复制失败：' + String(error.message || error);
        }
    }

    function openSupabaseSqlEditor() {
        const dialog = root?.querySelector('[data-memory-supabase-setup-dialog]');
        if (!dialog) return;
        const status = dialog.querySelector('[data-memory-supabase-setup-status]');
        const value = dialog.querySelector('[data-memory-supabase-url]').value.trim();
        try {
            const url = new URL(value);
            const host = url.hostname;
            const match = host.match(/^([a-z0-9-]+)\.supabase\.co$/i);
            if (!match) throw new Error('无法从项目 URL 识别项目 ID。');
            window.open('https://supabase.com/dashboard/project/' + encodeURIComponent(match[1]) + '/sql/new', '_blank', 'noopener');
            status.textContent = '已打开 SQL Editor。执行复制的初始化 SQL 后返回这里。';
        } catch (error) {
            status.textContent = String(error.message || error);
        }
    }

    async function supabaseMemoryAuthRequest(baseUrl, apiKey, path, body) {
        const response = await fetch(baseUrl.replace(/\/+$/, '') + path, {
            method: 'POST',
            headers: { apikey: apiKey, 'Content-Type': 'application/json' },
            body: JSON.stringify(body)
        });
        const text = await response.text();
        let data = null;
        try { data = text ? JSON.parse(text) : null; } catch (_) { data = { message: text }; }
        if (!response.ok) {
            const errorCode = String(data?.error_code || data?.code || '').toLowerCase();
            const errorMessage = String(data?.msg || data?.message || data?.error_description || data?.error || '').trim();
            if (errorCode.includes('email_send_rate_limit') || /email rate limit|too many emails|rate limit exceeded/i.test(errorMessage)) {
                throw new Error('Supabase 邮箱发送频率已达到上限。请稍后再注册；如果这个邮箱已经注册，请直接点击“登录并连接”。');
            }
            throw new Error(errorMessage || ('Supabase Auth HTTP ' + response.status));
        }
        return data || {};
    }

    async function saveAndTestSupabaseConnection(dialog, baseUrl, apiKey, table, session) {
        const section = root.querySelector('.memory-external-section');
        await window.MemorySync.saveConfig({
            enabled: true,
            provider: 'supabase',
            baseUrl,
            namespace: section.querySelector('[data-memory-sync-namespace]').value.trim() || 'tonghuaji-user',
            autoSync: section.querySelector('[data-memory-sync-auto]').checked,
            scope: {
                roles: section.querySelector('[name="memory-sync-roles"]:checked')?.value || 'current',
                tiers: Array.from(section.querySelectorAll('[data-memory-sync-tier]:checked')).map((input) => input.getAttribute('data-memory-sync-tier')),
                includeChat: section.querySelector('[data-memory-sync-chat]').checked,
                includeArchived: section.querySelector('[data-memory-sync-archived]').checked
            }
        }, { apiKey, token: session.access_token, refreshToken: session.refresh_token || '', table });
        await window.MemorySync.testConnection();
        await loadMemorySyncSettings();
        dialog.querySelector('[data-memory-supabase-key]').value = '';
        dialog.querySelector('[data-memory-supabase-password]').value = '';
    }

    async function authenticateMemorySupabase(mode) {
        const dialog = root?.querySelector('[data-memory-supabase-setup-dialog]');
        if (!dialog) return;
        const status = dialog.querySelector('[data-memory-supabase-setup-status]');
        const baseUrl = dialog.querySelector('[data-memory-supabase-url]').value.trim().replace(/\/+$/, '');
        const apiKey = dialog.querySelector('[data-memory-supabase-key]').value.trim();
        const email = dialog.querySelector('[data-memory-supabase-email]').value.trim();
        const password = dialog.querySelector('[data-memory-supabase-password]').value;
        const table = dialog.querySelector('[data-memory-supabase-table]').value.trim() || 'tonghuaji_memories';
        if (!baseUrl || !apiKey || !email || !password) { status.textContent = '请填写项目 URL、Publishable/Anon Key、邮箱和密码。'; return; }
        if (apiKey.toLowerCase().includes('service_role')) { status.textContent = '不要填写 service_role key，请使用 Publishable/Anon Key。'; return; }
        try { new URL(baseUrl); } catch (_) { status.textContent = '项目 URL 格式不正确。'; return; }
        const button = dialog.querySelector('[data-memory-action="' + (mode === 'signup' ? 'signup-memory-supabase' : 'login-memory-supabase') + '"]');
        button.disabled = true;
        status.textContent = mode === 'signup' ? '正在注册记忆库账号…' : '正在登录记忆库账号…';
        try {
            const session = await supabaseMemoryAuthRequest(baseUrl, apiKey, mode === 'signup' ? '/auth/v1/signup' : '/auth/v1/token?grant_type=password', { email, password });
            if (!session.access_token) {
                status.textContent = mode === 'signup' ? '注册成功。请先查收确认邮件，再点击登录并连接。' : '登录没有返回会话，请检查 Supabase Auth 设置。';
                return;
            }
            await saveAndTestSupabaseConnection(dialog, baseUrl, apiKey, table, session);
            status.textContent = '登录并连接成功。记忆将保存到你的 Supabase 项目。';
        } catch (error) {
            const message = String(error.message || error);
            status.textContent = message.includes('Supabase 邮箱发送频率') ? message : ('连接失败：' + message + '。如果表还不存在，请先执行初始化 SQL。');
        } finally {
            button.disabled = false;
        }
    }

    function signupMemorySupabase() { return authenticateMemorySupabase('signup'); }
    function loginMemorySupabase() { return authenticateMemorySupabase('login'); }

    function openMemoryCloudflareDeployDialog() {
        const dialog = root?.querySelector('[data-memory-cloudflare-deploy-dialog]');
        if (!dialog) return;
        dialog.setAttribute('aria-hidden', 'false');
        dialog.classList.add('is-visible');
        const account = dialog.querySelector('[data-memory-cloudflare-account]');
        const token = dialog.querySelector('[data-memory-cloudflare-token]');
        const status = dialog.querySelector('[data-memory-cloudflare-deploy-status]');
        if (status) status.textContent = '';
        requestAnimationFrame(() => (account.value ? token : account).focus());
    }

    function closeMemoryCloudflareDeployDialog() {
        const dialog = root?.querySelector('[data-memory-cloudflare-deploy-dialog]');
        if (!dialog) return;
        dialog.setAttribute('aria-hidden', 'true');
        dialog.classList.remove('is-visible');
        const token = dialog.querySelector('[data-memory-cloudflare-token]');
        if (token) token.value = '';
    }

    function createMemorySyncToken() {
        if (window.crypto?.randomUUID) return 'th_' + window.crypto.randomUUID().replace(/-/g, '');
        const bytes = new Uint8Array(24);
        window.crypto?.getRandomValues?.(bytes);
        return 'th_' + Array.from(bytes, (value) => value.toString(16).padStart(2, '0')).join('');
    }

    function normalizeCloudflareWorkerName(value) {
        const name = String(value || 'tonghuaji-memory').trim().toLowerCase().replace(/[^a-z0-9-]/g, '-').replace(/^-+|-+$/g, '').replace(/-{2,}/g, '-');
        return (name || 'tonghuaji-memory').slice(0, 63);
    }

    async function cloudflareDeployRequest(accountId, apiToken, path, options = {}) {
        const endpoint = 'https://api.cloudflare.com/client/v4/accounts/' + encodeURIComponent(accountId) + path;
        let response;
        try {
            response = await fetch(endpoint, {
                ...options,
                headers: { Authorization: 'Bearer ' + apiToken, Accept: 'application/json', ...(options.body && !(options.body instanceof FormData) ? { 'Content-Type': 'application/json' } : {}), ...(options.headers || {}) }
            });
        } catch (error) {
            const networkError = new Error('无法访问 Cloudflare API：' + path + '。浏览器没有收到响应，可能是网络代理、跨域拦截或 Cloudflare API 连接被阻断。原始错误：' + String(error.message || error));
            networkError.code = 'CLOUDFLARE_NETWORK_ERROR';
            networkError.endpoint = endpoint;
            throw networkError;
        }
        const text = await response.text();
        let data = null;
        try { data = text ? JSON.parse(text) : null; } catch (_) { data = { result: text }; }
        if (!response.ok || data?.success === false) {
            const detail = Array.isArray(data?.errors) ? data.errors.map((item) => item.message).filter(Boolean).join('；') : '';
            const apiError = new Error(detail || data?.message || ('Cloudflare API HTTP ' + response.status));
            apiError.code = Array.isArray(data?.errors) ? data.errors.map((item) => item.code).filter(Boolean).join(',') : '';
            apiError.status = response.status;
            apiError.endpoint = endpoint;
            throw apiError;
        }
        return data?.result ?? data;
    }

    async function findOrCreateCloudflareD1(accountId, apiToken, databaseName) {
        try {
            const created = await cloudflareDeployRequest(accountId, apiToken, '/d1/database', { method: 'POST', body: JSON.stringify({ name: databaseName }) });
            return { id: created.uuid, created: true };
        } catch (error) {
            const databases = await cloudflareDeployRequest(accountId, apiToken, '/d1/database?per_page=100', { method: 'GET' });
            const existing = Array.isArray(databases) ? databases.find((item) => item.name === databaseName) : null;
            if (!existing) throw error;
            return { id: existing.uuid, created: false };
        }
    }

    async function getCloudflareWorkerSubdomain(accountId, apiToken) {
        const result = await cloudflareDeployRequest(accountId, apiToken, '/workers/subdomain', { method: 'GET' });
        return String(result?.subdomain || '').trim();
    }

    async function deployMemoryCloudflare() {
        const dialog = root?.querySelector('[data-memory-cloudflare-deploy-dialog]');
        if (!dialog) return;
        const accountId = dialog.querySelector('[data-memory-cloudflare-account]').value.trim();
        const apiToken = dialog.querySelector('[data-memory-cloudflare-token]').value.trim();
        const workerName = normalizeCloudflareWorkerName(dialog.querySelector('[data-memory-cloudflare-name]').value);
        const status = dialog.querySelector('[data-memory-cloudflare-deploy-status]');
        const button = dialog.querySelector('[data-memory-action="run-memory-cloudflare-deploy"]');
        let deployStep = '准备部署';
        if (!accountId || !apiToken) { status.textContent = '请填写 Account ID 和 API Token。'; return; }
        if (!/^[a-f0-9]{32}$/i.test(accountId)) { status.textContent = 'Account ID 应为 32 位十六进制字符串。'; return; }
        button.disabled = true;
        const syncToken = createMemorySyncToken();
        try {
            deployStep = '读取部署文件';
            status.textContent = '正在读取部署文件…';
            const [workerResponse, schemaResponse] = await Promise.all([
                fetch(new URL('cloud-memory/cloudflare-worker.js', document.baseURI), { cache: 'no-store' }),
                fetch(new URL('cloud-memory/cloudflare-schema.sql', document.baseURI), { cache: 'no-store' })
            ]);
            if (!workerResponse.ok || !schemaResponse.ok) throw new Error('无法读取内置部署文件，请确认应用资源完整。');
            const workerSource = await workerResponse.text();
            const schemaSource = await schemaResponse.text();
            deployStep = '创建或查找 D1 数据库';
            status.textContent = '正在创建 D1 数据库…';
            const database = await findOrCreateCloudflareD1(accountId, apiToken, workerName);
            deployStep = '初始化 D1 数据库表';
            status.textContent = database.created ? '正在初始化数据库表…' : '正在检查数据库表…';
            await cloudflareDeployRequest(accountId, apiToken, '/d1/database/' + encodeURIComponent(database.id) + '/query', { method: 'POST', body: JSON.stringify({ sql: schemaSource }) });
            deployStep = '发布 Worker';
            status.textContent = '正在发布 Worker…';
            const metadata = {
                main_module: 'cloudflare-worker.js',
                compatibility_date: '2026-08-08',
                bindings: [
                    { name: 'MEMORY_DB', type: 'd1', id: database.id },
                    { name: 'SYNC_TOKEN', type: 'secret_text', text: syncToken }
                ]
            };
            const form = new FormData();
            form.append('metadata', new Blob([JSON.stringify(metadata)], { type: 'application/json' }));
            form.append('cloudflare-worker.js', new Blob([workerSource], { type: 'text/javascript' }), 'cloudflare-worker.js');
            await cloudflareDeployRequest(accountId, apiToken, '/workers/scripts/' + encodeURIComponent(workerName), { method: 'PUT', body: form, headers: {} });
            deployStep = '获取 Worker 地址';
            status.textContent = '正在获取 Worker 地址…';
            const subdomain = await getCloudflareWorkerSubdomain(accountId, apiToken);
            if (!subdomain) throw new Error('Worker 已发布，但账户尚未启用 workers.dev 子域名。请先在 Cloudflare Workers 设置中启用后重新部署。');
            const baseUrl = 'https://' + workerName + '.' + subdomain + '.workers.dev';
            deployStep = '保存本地连接配置';
            await window.MemorySync.saveConfig({
                enabled: true,
                provider: 'http',
                baseUrl,
                namespace: 'tonghuaji-user',
                autoSync: true,
                scope: { roles: 'current', tiers: ['L1'], includeChat: false, includeArchived: false }
            }, { token: syncToken });
            await loadMemorySyncSettings();
            status.textContent = '部署完成，已自动连接：' + baseUrl;
            dialog.querySelector('[data-memory-cloudflare-token]').value = '';
        } catch (error) {
            const code = error.code ? '（错误码：' + error.code + '）' : '';
            const httpStatus = error.status ? ' HTTP ' + error.status : '';
            status.textContent = '部署失败：' + deployStep + httpStatus + code + '：' + String(error.message || error);
        } finally {
            button.disabled = false;
        }
    }

    function buildReferenceComposer() {
        const composer = document.createElement('section');
        composer.className = 'memory-composer';
        composer.style.zIndex = '7202';
        composer.setAttribute('data-memory-composer', '');
        composer.setAttribute('aria-hidden', 'true');
        composer.innerHTML = '<div class="memory-composer-sheet" role="dialog" aria-modal="true">'
            + '<div class="memory-composer-header"><button type="button" data-memory-action="close-composer">取消</button><h2 data-memory-composer-title>新增记忆</h2><button type="button" data-memory-action="save-memory">保存</button></div>'
            + '<p class="memory-composer-role">写入 <span data-memory-composer-role></span> 的独立档案</p>'
            + '<textarea data-memory-composer-input maxlength="30000" placeholder="写下想让角色记住的事..."></textarea><p class="memory-composer-error" data-memory-composer-error aria-live="polite"></p></div>';
        root.appendChild(composer);
        composer.querySelector('[data-memory-action="close-composer"]').addEventListener('click', closeComposer);
        composer.querySelector('[data-memory-action="save-memory"]').addEventListener('click', saveManualMemory);
    }

    function hideMemorySummaryCapsule() {
        if (memorySummaryCapsuleTimer) {
            window.clearTimeout(memorySummaryCapsuleTimer);
            memorySummaryCapsuleTimer = 0;
        }
        const capsule = root && root.querySelector('[data-memory-summary-capsule]');
        if (!capsule) return;
        capsule.classList.remove('is-visible');
        capsule.setAttribute('aria-hidden', 'true');
    }

    function updateMemorySummaryCapsule(detail = {}) {
        if (detail.accountId && detail.accountId !== getDynamicUserId()) return;
        if (detail.bindingId && selectedContactId && detail.bindingId !== selectedContactId) return;
        if (detail.status === 'failed' && detail.message) showSummaryFeedback(detail.message);
        if (!root || !root.classList.contains('is-open')) return;
        const capsule = root.querySelector('[data-memory-summary-capsule]');
        const textNode = root.querySelector('[data-memory-summary-capsule-text]');
        if (!capsule || !textNode) return;
        if (memorySummaryCapsuleTimer) {
            window.clearTimeout(memorySummaryCapsuleTimer);
            memorySummaryCapsuleTimer = 0;
        }
        const status = String(detail.status || '');
        if (status === 'working') textNode.textContent = '正在总结记忆';
        else if (status === 'success') textNode.textContent = '记忆总结成功';
        else if (status === 'failed') textNode.textContent = detail.message || '记忆总结失败，请重试';
        else {
            hideMemorySummaryCapsule();
            return;
        }
        capsule.dataset.state = status;
        capsule.classList.add('is-visible');
        capsule.setAttribute('aria-hidden', 'false');
        if (status !== 'working') {
            memorySummaryCapsuleTimer = window.setTimeout(() => {
                hideMemorySummaryCapsule();
            }, status === 'failed' ? 8000 : 2400);
        }
    }

    function buildRoot() {
        root = document.createElement('section');
        root.id = 'memoryAppUI';
        root.className = 'memory-app-container';
        root.setAttribute('aria-hidden', 'true');
        root.innerHTML = '<iframe data-memory-reference-frame title="记忆库" style="width:100%;height:100%;border:0;display:block"></iframe>';
        const summaryCapsule = document.createElement('div');
        summaryCapsule.className = 'memory-summary-capsule';
        summaryCapsule.setAttribute('data-memory-summary-capsule', '');
        summaryCapsule.setAttribute('aria-live', 'polite');
        summaryCapsule.setAttribute('aria-hidden', 'true');
        summaryCapsule.innerHTML = '<span class="memory-summary-capsule-spinner" aria-hidden="true"></span><span data-memory-summary-capsule-text>正在总结记忆</span>';
        root.appendChild(summaryCapsule);
        window.addEventListener('memory:summary-status', (event) => updateMemorySummaryCapsule(event.detail));
        const referenceFrame = getReferenceFrame();
        const referenceHost = document.querySelector('.iphone') || document.body;
        referenceHost.appendChild(root);
        buildReferenceSummaryPanel();
        buildReferenceSettings();
        buildReferenceComposer();
        window.addEventListener('semanticmemory:status', (event) => renderSemanticModelState(event.detail));
        decodeReferenceDocument().then((documentText) => {
            referenceFrame.addEventListener('load', () => attachReferenceDocument(referenceFrame), { once: true });
            referenceFrame.srcdoc = documentText;
        }).catch(() => { referenceFrame.srcdoc = '<!doctype html><p>记忆库界面加载失败</p>'; });
        return;
        root.innerHTML = `
            <div class="memory-app-scroll">
                <header class="memory-profile-header">
                    <button class="memory-back" type="button" data-memory-action="close" aria-label="返回桌面">‹</button>
                    <div class="memory-header-actions">
                        <button class="memory-switch-role" type="button" data-memory-action="switch-role">切换</button>
                        <button class="memory-summary-settings-button" type="button" data-memory-action="summary-settings" aria-label="摘要更新频率" title="摘要更新频率">•••</button>
                        <button class="memory-summary-settings-button" type="button" data-memory-action="semantic-settings" aria-label="语义模型" title="语义模型">◇</button>
                        <button class="memory-add" type="button" data-memory-action="add" aria-label="新增记忆" title="新增记忆">+</button>
                    </div>
                </header>
                <main class="memory-profile-main">
                    <div class="memory-avatar-shell">
                        <div class="memory-avatar" data-memory-avatar><img data-memory-avatar-image alt=""><span data-memory-monogram>记</span></div>
                    </div>
                    <div class="memory-heading">
                        <div class="memory-name-line"><h1 data-memory-name>记忆</h1><span data-memory-status>读取中</span></div>
                        <p data-memory-subtitle>正在读取本地档案。</p>
                    </div>
                    <section class="memory-stats" aria-label="记忆统计">
                        <article><b data-memory-count>0</b><span>记忆总条数</span></article>
                        <article><b data-memory-chat-count>0</b><span>共同对话</span></article>
                        <article><b data-memory-days>0</b><span>认识天数</span></article>
                    </section>
                    <section class="memory-content-card">
                        <div class="memory-card-kicker" data-memory-card-title>@ 记忆</div>
                        <div data-memory-content></div>
                    </section>
                </main>
                <nav class="memory-tabs" role="tablist" aria-label="记忆视图">
                    <button type="button" data-memory-tab="memory" class="is-active" role="tab" aria-selected="true">记忆</button>
                    <button type="button" data-memory-tab="relationship" role="tab" aria-selected="false">经历</button>
                    <button type="button" data-memory-tab="archive" role="tab" aria-selected="false">档案</button>
                </nav>
            </div>`;

        // Reference layout replaces the legacy centered profile before overlays are attached.
        root.innerHTML = `
            <div class="memory-app-scroll scroll-content">
                <header class="memory-profile-header top-actions">
                    <button class="memory-back btn-circle" type="button" data-memory-action="close" aria-label="\u8fd4\u56de\u684c\u9762">\u2039</button>
                    <button class="memory-settings-button btn-capsule" type="button" data-memory-action="summary-settings">\u8bbe\u7f6e</button>
                </header>
                <main class="memory-profile-main">
                    <section class="memory-profile-section profile-section">
                        <div class="memory-avatar-shell profile-avatar-wrapper">
                            <div class="memory-avatar profile-avatar" data-memory-avatar><img data-memory-avatar-image alt=""><span data-memory-monogram>\u8bb0</span></div>
                            <button class="memory-avatar-switch" type="button" data-memory-action="switch-role" aria-label="\u5207\u6362\u89d2\u8272">\u21c4</button>
                        </div>
                        <div class="memory-heading profile-info">
                            <div class="memory-name-line"><h1 class="profile-name" data-memory-name>\u8bb0\u5fc6</h1></div>
                            <p class="profile-stat-line1" data-memory-subtitle>\u8bb0\u5fc6\u603b\u6570\uff1a0 \u6761</p>
                            <p class="memory-profile-stat profile-stat-line2"><span>\u5171\u540c\u5bf9\u8bdd\uff1a<b data-memory-chat-count>0</b> \u5c42</span><i></i><span>\u8ba4\u8bc6\u5929\u6570\uff1a<b data-memory-days>0</b> \u5929</span></p>
                            <span class="memory-profile-status" data-memory-status>\u8bfb\u53d6\u4e2d</span>
                        </div>
                    </section>
                    <nav class="memory-tabs segmented-control" role="tablist" aria-label="\u8bb0\u5fc6\u89c6\u56fe">
                        <button type="button" data-memory-tab="memory" class="is-active active segment-btn" role="tab" aria-selected="true">\u8bb0\u5fc6</button>
                        <button type="button" data-memory-tab="relationship" class="segment-btn" role="tab" aria-selected="false">\u7ecf\u5386</button>
                        <button type="button" data-memory-tab="archive" class="segment-btn" role="tab" aria-selected="false">\u6863\u6848</button>
                    </nav>
                    <div class="ios-search-bar"><label class="memory-search search-box"><span aria-hidden="true">\u2315</span><input type="search" data-memory-search placeholder="\u641c\u7d22\u8bb0\u5fc6..."></label></div>
                    <div class="memory-list-header ios-list-header"><h2 class="ios-list-title" data-memory-card-title>\u8fd1\u671f\u8bb0\u5fc6</h2><div class="ios-list-actions"><button class="icon-action-btn" type="button" data-memory-action="summary-settings">\u6458\u8981</button><button class="icon-action-btn" type="button" data-memory-action="add">\uff0b \u65b0\u589e</button></div></div>
                    <section class="memory-content-card"><div data-memory-content></div></section>
                </main>
            </div>`;

        const rolePicker = document.createElement('section');
        rolePicker.className = 'memory-role-picker';
        rolePicker.setAttribute('data-memory-role-picker', '');
        rolePicker.setAttribute('aria-hidden', 'true');
        rolePicker.innerHTML = `
            <header class="memory-picker-header">
                <button class="memory-back" type="button" data-memory-action="close" aria-label="返回桌面">‹</button>
                <span>选择角色</span>
            </header>
            <div class="memory-picker-intro"><h1>进入谁的记忆</h1><p>每位角色拥有独立的记忆档案。</p></div>
            <div class="memory-role-list" data-memory-role-list></div>
            <div class="memory-role-empty" data-memory-role-empty hidden><h2>还没有可选角色</h2><p>先在联系人中创建角色，再回来建立记忆。</p><button type="button" data-memory-action="open-contacts">前往联系人</button></div>`;
        root.appendChild(rolePicker);

        const composer = document.createElement('section');
        composer.className = 'memory-composer';
        composer.setAttribute('data-memory-composer', '');
        composer.setAttribute('aria-hidden', 'true');
        composer.innerHTML = `
            <div class="memory-composer-sheet" role="dialog" aria-modal="true" aria-labelledby="memoryComposerTitle">
                <div class="memory-composer-header"><button type="button" data-memory-action="close-composer">取消</button><h2 id="memoryComposerTitle" data-memory-composer-title>新增记忆</h2><button type="button" data-memory-action="save-memory">保存</button></div>
                <p class="memory-composer-role">写入 <span data-memory-composer-role></span> 的独立档案</p>
                <textarea data-memory-composer-input maxlength="30000" placeholder="写下想让角色记住的事…"></textarea>
                <p class="memory-composer-error" data-memory-composer-error aria-live="polite"></p>
            </div>`;
        root.appendChild(composer);

        const summarySettings = document.createElement('section');
        summarySettings.className = 'memory-summary-settings';
        summarySettings.setAttribute('data-memory-summary-settings', '');
        summarySettings.setAttribute('aria-hidden', 'true');
        summarySettings.innerHTML = `
            <div class="memory-summary-settings-sheet" role="dialog" aria-modal="true" aria-labelledby="memorySummarySettingsTitle">
                <div class="memory-composer-header"><button type="button" data-memory-action="close-summary-settings">取消</button><h2 id="memorySummarySettingsTitle">摘要更新</h2><button type="button" data-memory-action="save-summary-settings">保存</button></div>
                <p class="memory-summary-settings-copy">每累计多少轮对话，调用一次 AI 记忆分析</p>
                <label class="memory-summary-settings-input"><input type="number" inputmode="numeric" min="1" max="500" step="1" data-memory-summary-interval><span>轮对话</span></label>
                <p class="memory-summary-settings-note">可设置 1–500 轮。默认频率可能在旧消息被裁剪前提前整理；手动保存的频率按设定执行。记忆分析在后台更新。</p>
                <p class="memory-composer-error" data-memory-summary-error aria-live="polite"></p>
            </div>`;
        root.appendChild(summarySettings);
        summarySettings.querySelector('.memory-summary-settings-sheet').insertAdjacentHTML('beforeend', `
            <section class="memory-settings-section">
                <h3>\u5411\u91cf\u6a21\u578b</h3>
                <p class="memory-semantic-settings-copy">\u4e0b\u8f7d\u5230\u672c\u673a\u540e\uff0c\u804a\u5929\u5185\u5bb9\u4e0d\u4f1a\u4e0a\u4f20\u3002</p>
                <label class="memory-semantic-settings-input"><span>\u81ea\u5b9a\u4e49\u6e05\u5355</span><input type="url" data-semantic-model-url placeholder="\u53ef\u9009\uff1amanifest \u5730\u5740"></label>
                <button class="memory-model-download" type="button" data-memory-action="download-semantic-model">\u4e0b\u8f7d\u5411\u91cf\u6a21\u578b</button>
                <progress class="memory-semantic-model-progress" data-semantic-model-progress max="1" value="0" hidden></progress>
                <p class="memory-semantic-model-status" data-semantic-model-status>\u6a21\u578b\u672a\u4e0b\u8f7d</p>
                <button class="memory-semantic-remove" type="button" data-memory-action="remove-semantic-model" hidden>\u5220\u9664\u672c\u5730\u6a21\u578b</button>
            </section>`);

        const semanticSettings = document.createElement('section');
        semanticSettings.className = 'memory-semantic-settings';
        semanticSettings.setAttribute('data-memory-semantic-settings', '');
        semanticSettings.setAttribute('aria-hidden', 'true');
        semanticSettings.innerHTML = '<div class="memory-semantic-settings-sheet" role="dialog" aria-modal="true" aria-labelledby="memorySemanticSettingsTitle">'
            + '<div class="memory-composer-header"><button type="button" data-memory-action="close-semantic-settings">取消</button><h2 id="memorySemanticSettingsTitle">语义模型</h2><button type="button" data-memory-action="download-semantic-model">下载</button></div>'
            + '<p class="memory-semantic-settings-copy">默认从 Hugging Face 直连下载中文模型到本机；聊天内容不会上传。</p>'
            + '<label class="memory-semantic-settings-input"><span>自定义清单</span><input type="url" data-semantic-model-url placeholder="可选：粘贴自定义 manifest 地址"></label>'
            + '<progress class="memory-semantic-model-progress" data-semantic-model-progress max="1" value="0" hidden></progress>'
            + '<p class="memory-semantic-model-status" data-semantic-model-status>未配置模型</p>'
            + '<button class="memory-semantic-remove" type="button" data-memory-action="remove-semantic-model" hidden>删除本地模型</button>'
            + '<p class="memory-summary-settings-note">直接点下载即可获取 BGE Small 中文模型。填写自定义清单时才使用其他模型来源；未下载时继续使用当前轻量本地向量。</p>'
            + '</div>';
        root.appendChild(semanticSettings);

        root.querySelectorAll('[data-memory-action="close"]').forEach((button) => button.addEventListener('click', close));
        root.querySelector('[data-memory-action="switch-role"]').addEventListener('click', showRolePicker);
        root.querySelectorAll('[data-memory-action="summary-settings"]').forEach((button) => button.addEventListener('click', openSummarySettings));
        root.querySelector('[data-memory-action="add"]').addEventListener('click', openComposer);
        root.querySelector('[data-memory-action="close-composer"]').addEventListener('click', closeComposer);
        root.querySelector('[data-memory-action="save-memory"]').addEventListener('click', saveManualMemory);
        root.querySelector('[data-memory-action="close-summary-settings"]').addEventListener('click', closeSummarySettings);
        root.querySelector('[data-memory-action="save-summary-settings"]').addEventListener('click', saveSummarySettings);
        root.querySelector('[data-memory-action="close-semantic-settings"]').addEventListener('click', closeSemanticSettings);
        root.querySelector('[data-memory-action="download-semantic-model"]').addEventListener('click', downloadSemanticModel);
        root.querySelector('[data-memory-action="remove-semantic-model"]').addEventListener('click', removeSemanticModel);
        root.querySelector('[data-memory-search]').addEventListener('input', (event) => {
            memorySearchQuery = event.target.value || '';
            renderMemoryContent(cachedContacts.find((item) => item.id === selectedContactId) || null);
        });
        root.querySelector('[data-memory-action="open-contacts"]').addEventListener('click', () => {
            close();
            if (typeof window.openContactsApp === 'function') window.openContactsApp();
        });
        root.querySelectorAll('[data-memory-tab]').forEach((button) => {
            button.addEventListener('click', () => {
                activeTab = button.dataset.memoryTab || 'memory';
                render();
            });
        });
        root.addEventListener('keydown', (event) => {
            if (event.key !== 'Escape') return;
            if (root.classList.contains('is-composing')) closeComposer();
            else if (root.classList.contains('is-configuring-summary')) closeSummarySettings();
            else if (root.classList.contains('is-configuring-semantic')) closeSemanticSettings();
            else close();
        });
        window.addEventListener('semanticmemory:status', (event) => renderSemanticModelState(event.detail));
        const host = document.querySelector('.iphone') || document.body;
        host.appendChild(root);
    }

    function ensureStyles() {
        if (document.getElementById('memoryAppStyles')) return;
        const style = document.createElement('style');
        style.id = 'memoryAppStyles';
        style.textContent = `${SUMMARY_DISCLOSURE_CSS}
            .memory-app-container { --memory-blue: #1c1c1e; --memory-background: #f2f2f7; --memory-card: #ffffff; --memory-label: #3c3c43; --memory-secondary: #8e8e93; --memory-separator: #c6c6c8; position: absolute; inset: 0; z-index: 7200; display: none; overflow: hidden; background: var(--memory-background); color: #000; font-family: "Noto Serif SC", "STSong", "SimSun", serif; }
            .memory-app-container.is-open { display: block; }
            .memory-summary-capsule { position: absolute; top: max(82px, calc(env(safe-area-inset-top) + 34px)); left: 50%; z-index: 7210; display: flex; align-items: center; gap: 8px; max-width: calc(100% - 40px); min-height: 34px; padding: 0 14px; border: 1px solid rgba(255,255,255,.58); border-radius: 999px; box-sizing: border-box; background: rgba(28,28,30,.78); box-shadow: 0 8px 24px rgba(0,0,0,.16); color: #fff; opacity: 0; pointer-events: none; transform: translate(-50%, -8px) scale(.97); backdrop-filter: blur(18px) saturate(140%); -webkit-backdrop-filter: blur(18px) saturate(140%); transition: opacity .22s ease, transform .22s ease; font: 600 13px/1 -apple-system, BlinkMacSystemFont, "SF Pro Text", sans-serif; white-space: nowrap; }
            .memory-summary-capsule.is-visible { opacity: 1; transform: translate(-50%, 0) scale(1); }
            .memory-summary-capsule[data-state="failed"] { padding-top: 8px; padding-bottom: 8px; border-radius: 18px; line-height: 1.5; white-space: normal; overflow-wrap: anywhere; }
            .memory-summary-capsule-spinner { width: 12px; height: 12px; flex: 0 0 auto; border: 1.6px solid rgba(255,255,255,.36); border-top-color: #fff; border-radius: 50%; animation: memorySummaryCapsuleSpin .72s linear infinite; }
            .memory-summary-capsule[data-state="success"] .memory-summary-capsule-spinner, .memory-summary-capsule[data-state="failed"] .memory-summary-capsule-spinner { display: none; }
            @keyframes memorySummaryCapsuleSpin { to { transform: rotate(360deg); } }
            .memory-app-scroll { box-sizing: border-box; display: flex; flex-direction: column; height: 100%; min-height: 100%; overflow-y: auto; overflow-x: hidden; overscroll-behavior: contain; padding: max(46px, calc(env(safe-area-inset-top) + 13px)) 20px calc(18px + env(safe-area-inset-bottom)); background: var(--memory-background); }
            .memory-profile-header, .memory-picker-header { display: flex; align-items: center; justify-content: space-between; min-height: 46px; }
            .memory-back { width: 42px; height: 42px; border: 0; padding: 0 0 5px; border-radius: 50%; background: rgba(255,255,255,.72); color: var(--memory-blue); box-shadow: 0 2px 8px rgba(60,60,67,.08); font: 37px/37px Georgia, serif; cursor: pointer; }
            .memory-header-actions { display: flex; align-items: center; gap: 9px; }
            .memory-switch-role { min-width: 46px; height: 34px; border: 0; border-radius: 17px; padding: 0 11px; background: rgba(255,255,255,.72); color: var(--memory-blue); font: 13px/1 "Noto Serif SC", "STSong", "SimSun", serif; cursor: pointer; }
            .memory-summary-settings-button { width: 34px; height: 34px; border: 0; border-radius: 50%; padding: 0 0 6px; background: rgba(255,255,255,.72); color: var(--memory-blue); box-shadow: 0 2px 8px rgba(60,60,67,.08); font: 16px/1 Arial, sans-serif; letter-spacing: 2px; cursor: pointer; }
            .memory-add { width: 34px; height: 34px; border: 0; border-radius: 50%; padding: 0 0 2px; background: var(--memory-blue); color: #fff; box-shadow: 0 4px 10px rgba(28,28,30,.22); font: 25px/30px Arial, sans-serif; cursor: pointer; }
            .memory-profile-main { flex: 1 0 auto; display: flex; flex-direction: column; align-items: center; padding: 24px 0 16px; }
            .memory-avatar-shell { display: grid; width: 150px; height: 150px; padding: 7px; border: 5px solid #d1d1d6; border-radius: 50%; box-sizing: border-box; background: var(--memory-background); box-shadow: 0 3px 10px rgba(60,60,67,.08); }
            .memory-avatar { width: 100%; height: 100%; border: 3px solid #fff; border-radius: 50%; overflow: hidden; box-sizing: border-box; background: #e5e5ea; display: grid; place-items: center; color: var(--memory-blue); font-size: 43px; font-weight: 700; }
            .memory-avatar img { display: none; width: 100%; height: 100%; object-fit: cover; }
            .memory-avatar.has-image img { display: block; }
            .memory-avatar.has-image span { display: none; }
            .memory-heading { width: 100%; margin-top: 23px; text-align: center; }
            .memory-name-line { display: flex; align-items: center; justify-content: center; gap: 10px; min-width: 0; }
            .memory-name-line h1 { margin: 0; max-width: 68%; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; font-size: 32px; line-height: 1.25; font-weight: 700; letter-spacing: 0; }
            .memory-name-line span { padding: 5px 9px; border-radius: 999px; background: #e5e5ea; color: var(--memory-blue); font-family: "Noto Serif SC", "STSong", "SimSun", serif; font-size: 12px; line-height: 1; white-space: nowrap; }
            .memory-heading p { margin: 8px 0 0; color: var(--memory-secondary); font-size: 14px; line-height: 1.55; }
            .memory-stats { display: grid; grid-template-columns: repeat(3, 1fr); width: 100%; gap: 12px; margin-top: 28px; }
            .memory-stats article { display: grid; min-width: 0; min-height: 92px; place-content: center; padding: 10px 6px; border-radius: 20px; background: var(--memory-card); box-shadow: 0 6px 18px rgba(60,60,67,.06); text-align: center; }
            .memory-stats b { display: block; color: var(--memory-blue); font-size: 25px; line-height: 1.05; font-variant-numeric: tabular-nums; }
            .memory-stats span { display: block; margin-top: 9px; color: var(--memory-secondary); font-size: 11px; white-space: nowrap; }
            .memory-content-card { display: flex; flex: 1 0 300px; flex-direction: column; width: 100%; min-height: 300px; margin-top: 23px; padding: 25px 25px 30px; border-radius: 24px; box-sizing: border-box; background: var(--memory-card); box-shadow: 0 10px 24px rgba(60,60,67,.055); }
            .memory-content-card [data-memory-content] { display: flex; flex: 1; min-width: 0; min-height: 0; overflow-x: hidden; }
            .memory-card-kicker { color: var(--memory-secondary); font-family: "Noto Sans SC", "Microsoft YaHei", sans-serif; font-size: 15px; font-weight: 600; letter-spacing: 0; }
            .memory-empty-state { display: grid; flex: 1; width: 100%; align-content: center; justify-items: center; padding: 36px 12px; box-sizing: border-box; text-align: center; }
            .memory-empty-mark { color: var(--memory-blue); font-size: 22px; line-height: 1; }
            .memory-empty-state h2 { margin: 20px 0 0; font-size: 25px; line-height: 1.45; font-weight: 700; letter-spacing: 0; }
            .memory-empty-state p { max-width: 240px; margin: 9px 0 0; color: var(--memory-secondary); font-size: 14px; line-height: 1.75; }
            .memory-entry-list { display: grid; width: 100%; min-width: 0; align-content: start; gap: 10px; padding: 20px 0 0; overflow-y: auto; overflow-x: hidden; }
            .memory-entry { min-width: 0; max-width: 100%; box-sizing: border-box; padding: 14px 15px; border-radius: 14px; background: #f2f2f7; }
            .memory-entry-header { display: flex; min-width: 0; align-items: center; justify-content: space-between; gap: 10px; }
            .memory-entry-meta { display: block; min-width: 0; color: var(--memory-blue); font-size: 11px; overflow-wrap: anywhere; word-break: break-word; }
            .memory-entry-actions { display: flex; flex: 0 0 auto; gap: 6px; }
            .memory-entry-actions button { border: 0; padding: 3px 0; background: transparent; color: var(--memory-secondary); font: 12px/1 "Noto Serif SC", "STSong", "SimSun", serif; cursor: pointer; }
            .memory-entry-actions .memory-icon-action { display: flex; align-items: center; justify-content: center; width: 24px; height: 24px; padding: 2px; }
            .memory-entry-actions .memory-icon-action svg { width: 16px; height: 16px; }
            .memory-entry-actions .memory-delete-action { color: #ff3b30; }
            .memory-entry-actions .memory-priority-action { max-width: 58px; border: 0; padding: 2px 0; background: transparent; color: var(--memory-blue); font: 12px/1 "Noto Serif SC", "STSong", "SimSun", serif; cursor: pointer; }
            .memory-entry p { min-width: 0; max-width: 100%; margin: 7px 0 0; color: #1c1c1e; font-size: 15px; line-height: 1.62; white-space: pre-wrap; overflow-wrap: anywhere; word-break: break-word; }
            .memory-entry .memory-entry-provenance { margin-top: 9px; color: var(--memory-secondary); font-size: 11px; line-height: 1.45; }
            .memory-tabs { position: sticky; bottom: 0; display: grid; grid-template-columns: repeat(3, 1fr); width: 100%; margin: 8px 0 0; padding: 5px; border-radius: 24px; box-sizing: border-box; background: rgba(255,255,255,.94); box-shadow: 0 7px 20px rgba(60,60,67,.08); backdrop-filter: blur(16px); -webkit-backdrop-filter: blur(16px); }
            .memory-tabs button { height: 44px; border: 0; border-radius: 19px; padding: 0; background: transparent; color: var(--memory-secondary); font: 14px/1 "Noto Serif SC", "STSong", "SimSun", serif; cursor: pointer; }
            .memory-tabs button.is-active { background: var(--memory-blue); color: #fff; font-weight: 700; }
            .memory-role-picker { position: absolute; inset: 0; z-index: 3; display: none; flex-direction: column; overflow-y: auto; padding: max(46px, calc(env(safe-area-inset-top) + 13px)) 20px calc(22px + env(safe-area-inset-bottom)); box-sizing: border-box; background: var(--memory-background); }
            .memory-app-container.is-picking-role .memory-role-picker { display: flex; }
            .memory-picker-header span { color: var(--memory-secondary); font-size: 14px; }
            .memory-picker-intro { margin-top: 35px; }
            .memory-picker-intro h1 { margin: 0; font-size: 30px; line-height: 1.3; }
            .memory-picker-intro p { margin: 9px 0 0; color: var(--memory-secondary); font-size: 14px; line-height: 1.65; }
            .memory-role-list { display: grid; gap: 11px; margin-top: 30px; }
            .memory-role-option { display: grid; grid-template-columns: 52px minmax(0, 1fr) auto; align-items: center; gap: 13px; width: 100%; min-height: 78px; border: 0; border-radius: 18px; padding: 12px 15px; box-sizing: border-box; background: var(--memory-card); box-shadow: 0 5px 16px rgba(60,60,67,.05); color: #000; text-align: left; cursor: pointer; }
            .memory-role-option.is-selected { outline: 2px solid var(--memory-blue); outline-offset: -2px; }
            .memory-role-avatar { position: relative; display: grid; width: 52px; height: 52px; overflow: hidden; border-radius: 50%; background: #e5e5ea; place-items: center; color: var(--memory-blue); font-size: 19px; font-weight: 700; }
            .memory-role-avatar img { display: none; width: 100%; height: 100%; object-fit: cover; }
            .memory-role-avatar.has-image img { display: block; }
            .memory-role-avatar.has-image span { display: none; }
            .memory-role-name { overflow: hidden; text-overflow: ellipsis; white-space: nowrap; font-size: 18px; font-weight: 700; }
            .memory-role-hint { color: var(--memory-blue); font-size: 13px; white-space: nowrap; }
            .memory-role-empty { display: grid; flex: 1; align-content: center; justify-items: center; padding: 40px 20px; text-align: center; }
            .memory-role-empty h2 { margin: 0; font-size: 22px; }
            .memory-role-empty p { margin: 10px 0 22px; color: var(--memory-secondary); font-size: 14px; line-height: 1.65; }
            .memory-role-empty button { border: 0; border-radius: 18px; padding: 11px 15px; background: var(--memory-blue); color: #fff; font: 14px/1 "Noto Serif SC", "STSong", "SimSun", serif; cursor: pointer; }
            .memory-composer { position: absolute; inset: 0; z-index: 4; display: none; align-items: flex-end; background: rgba(0,0,0,.28); }
            .memory-app-container.is-composing .memory-composer { display: flex; }
            .memory-composer-sheet { width: 100%; padding: 14px 20px calc(25px + env(safe-area-inset-bottom)); border-radius: 22px 22px 0 0; box-sizing: border-box; background: var(--memory-card); box-shadow: 0 -12px 28px rgba(0,0,0,.12); }
            .memory-composer-header { display: grid; grid-template-columns: 60px 1fr 60px; align-items: center; }
            .memory-composer-header h2 { margin: 0; text-align: center; font-size: 17px; }
            .memory-composer-header button { border: 0; padding: 9px 0; background: transparent; color: var(--memory-blue); font: 15px/1 "Noto Serif SC", "STSong", "SimSun", serif; cursor: pointer; }
            .memory-composer-header button:last-child { font-weight: 700; text-align: right; }
            .memory-composer-role { margin: 18px 0 10px; color: var(--memory-secondary); font-size: 13px; }
            .memory-composer-role span { color: #1c1c1e; }
            .memory-composer textarea { display: block; width: 100%; min-height: 142px; resize: none; border: 0; border-radius: 14px; padding: 14px; box-sizing: border-box; outline: 0; background: #f2f2f7; color: #1c1c1e; font: 16px/1.6 "Noto Serif SC", "STSong", "SimSun", serif; }
            .memory-composer textarea::placeholder { color: #8e8e93; }
            .memory-composer-error { min-height: 18px; margin: 7px 0 0; color: #ff3b30; font-size: 12px; }
            .memory-summary-panel { position: absolute; inset: 0; z-index: 7203; display: none; align-items: flex-end; background: rgba(0,0,0,.28); }
            .memory-app-container.is-viewing-summary .memory-summary-panel { display: flex; }
            .memory-summary-panel-sheet { display: flex; width: 100%; max-height: min(82vh, 720px); flex-direction: column; overflow: hidden; border-radius: 18px 18px 0 0; padding: 14px 20px calc(22px + env(safe-area-inset-bottom)); box-sizing: border-box; background: #fff; box-shadow: 0 -12px 28px rgba(0,0,0,.14); }
            .memory-summary-panel-sheet .memory-composer-header { grid-template-columns: 52px minmax(0, 1fr) max-content; column-gap: 8px; }
            .memory-summary-panel-sheet .memory-composer-header button { white-space: nowrap; }
            .memory-summary-panel-scroll { min-height: 0; overflow-y: auto; overscroll-behavior: contain; }
            .memory-summary-role { margin: 18px 0 4px; color: #8e8e93; font-size: 13px; font-weight: 600; }
            .memory-summary-range { padding: 14px 0 18px; border-bottom: 1px solid #e5e5ea; }
            .memory-summary-range-note { margin: 9px 0 10px; color: #8e8e93; font-size: 12px; }
            .memory-summary-range-fields { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 12px; }
            .memory-summary-range-fields label { display: grid; gap: 6px; color: #8e8e93; font-size: 12px; }
            .memory-summary-range-fields input { width: 100%; min-height: 38px; box-sizing: border-box; border: 1px solid #d1d1d6; border-radius: 9px; padding: 7px 9px; background: #f2f2f7; color: #000; font: 16px/1.3 -apple-system, BlinkMacSystemFont, "SF Pro Text", sans-serif; }
            .memory-summary-current, .memory-summary-chapters-section, .memory-summary-progress-section, .memory-summary-source-section { padding: 18px 0; border-bottom: 1px solid #e5e5ea; }
            .memory-summary-chapters { display: grid; gap: 12px; margin-top: 14px; }
            .memory-summary-chapter { display: grid; gap: 6px; }
            .memory-summary-chapter span { color: #8e8e93; font-size: 12px; line-height: 1.4; }
            .memory-summary-chapter p { margin: 0; color: #3c3c43; font-size: 14px; line-height: 1.55; overflow-wrap: anywhere; }
            .memory-summary-section-header { display: flex; min-width: 0; align-items: center; justify-content: space-between; gap: 12px; }
            .memory-summary-section-header h3 { margin: 0; color: #000; font-size: 17px; font-weight: 600; letter-spacing: 0; }
            .memory-summary-section-header > span, .memory-summary-section-header > div { color: #8e8e93; font-size: 12px; }
            .memory-summary-section-header > div { display: flex; flex-wrap: wrap; align-items: center; justify-content: flex-end; gap: 12px; }
            .memory-summary-section-header button, .memory-summary-edit-actions button { flex: 0 0 auto; border: 0; padding: 4px 0; background: transparent; color: #007aff; font: 600 14px/20px -apple-system, BlinkMacSystemFont, "SF Pro Text", sans-serif; cursor: pointer; }
            .memory-summary-section-header button:disabled { color: #c7c7cc; cursor: default; }
            .memory-summary-text { margin: 13px 0 0; color: #000; font-size: 17px; line-height: 1.6; overflow-wrap: anywhere; }
            .memory-summary-time { margin: 0 0 8px; color: #8e8e93; font-size: 13px; line-height: 1.4; }
            .memory-summary-body, .memory-summary-article .memory-summary-body, .card-content { white-space: pre-wrap; overflow-wrap: anywhere; }
            .memory-summary-chapter { padding: 12px 0; border-bottom: 1px solid #f0f0f4; }
            .memory-summary-chapter:last-child { border-bottom: 0; padding-bottom: 0; }
            .memory-summary-text.is-empty { color: #8e8e93; }
            .memory-summary-panel textarea { display: none; width: 100%; min-height: 92px; margin-top: 12px; resize: vertical; border: 0; border-radius: 10px; padding: 12px; box-sizing: border-box; outline: 0; background: #f2f2f7; color: #000; font: 16px/1.55 -apple-system, BlinkMacSystemFont, "SF Pro Text", sans-serif; }
            .memory-summary-edit-actions { display: none; justify-content: flex-end; gap: 20px; margin-top: 10px; }
            .memory-app-container.is-editing-summary .memory-summary-text { display: none; }
            .memory-app-container.is-editing-summary .memory-summary-panel textarea { display: block; }
            .memory-app-container.is-editing-summary .memory-summary-edit-actions { display: flex; }
            .memory-summary-meta { margin: 9px 0 0; color: #8e8e93; font-size: 12px; line-height: 1.4; }
            .memory-summary-progress-section progress { display: block; width: 100%; height: 6px; margin-top: 14px; border: 0; border-radius: 3px; overflow: hidden; accent-color: #007aff; }
            .memory-summary-sources { display: grid; gap: 10px; margin-top: 14px; }
            .memory-summary-source { display: grid; grid-template-columns: 44px minmax(0, 1fr); gap: 9px; align-items: start; }
            .memory-summary-source span { color: #8e8e93; font-size: 12px; line-height: 1.5; }
            .memory-summary-source p, .memory-summary-source-empty { margin: 0; color: #3c3c43; font-size: 13px; line-height: 1.5; overflow-wrap: anywhere; }
            .memory-summary-status { min-height: 18px; margin: 12px 0 0; color: #8e8e93; font-size: 12px; line-height: 1.5; }
            .memory-summary-panel-sheet, .memory-summary-panel-sheet * { font-family: inherit !important; }
            .memory-summary-panel-sheet button, .memory-summary-panel-sheet input, .memory-summary-panel-sheet textarea, .memory-summary-panel-sheet label, .memory-summary-panel-sheet p, .memory-summary-panel-sheet span { font-weight: 600; }
            .memory-summary-panel-sheet .memory-composer-header h2, .memory-summary-panel-sheet .memory-summary-section-header h3 { font-weight: 700; }
            .memory-summary-settings { position: absolute; inset: 0; z-index: 5; display: none; align-items: flex-end; background: rgba(0,0,0,.28); }
            .memory-app-container.is-configuring-summary .memory-summary-settings { display: flex; }
            .memory-summary-settings-sheet { width: 100%; max-height: 92%; overflow-y: auto; padding: 14px 20px calc(25px + env(safe-area-inset-bottom)); border-radius: 22px 22px 0 0; box-sizing: border-box; background: var(--memory-card); box-shadow: 0 -12px 28px rgba(0,0,0,.12); }
            .memory-summary-settings-copy { margin: 24px 0 12px; color: #1c1c1e; font-size: 16px; line-height: 1.6; }
            .memory-summary-settings-input { display: flex; align-items: center; gap: 10px; width: 100%; padding: 13px 14px; border-radius: 14px; box-sizing: border-box; background: #f2f2f7; color: var(--memory-secondary); font-size: 15px; }
            .memory-summary-settings-input input { width: 78px; border: 0; padding: 0; outline: 0; background: transparent; color: #1c1c1e; font: 24px/1.2 Georgia, "Noto Serif SC", "STSong", "SimSun", serif; }
            .memory-summary-settings-note { margin: 11px 0 0; color: var(--memory-secondary); font-size: 13px; line-height: 1.6; }
            .memory-semantic-settings { position: absolute; inset: 0; z-index: 6; display: none; align-items: flex-end; background: rgba(0,0,0,.28); }
            .memory-app-container.is-configuring-semantic .memory-semantic-settings { display: flex; }
            .memory-semantic-settings-sheet { width: 100%; padding: 14px 20px calc(25px + env(safe-area-inset-bottom)); border-radius: 22px 22px 0 0; box-sizing: border-box; background: var(--memory-card); box-shadow: 0 -12px 28px rgba(0,0,0,.12); }
            .memory-semantic-settings-copy { margin: 24px 0 12px; color: #1c1c1e; font-size: 16px; line-height: 1.6; }
            .memory-semantic-settings-input { display: flex; align-items: center; gap: 10px; width: 100%; padding: 13px 14px; border-radius: 14px; box-sizing: border-box; background: #f2f2f7; color: var(--memory-secondary); font-size: 13px; }
            .memory-semantic-settings-input { min-width: 0; box-sizing: border-box; }
            .memory-semantic-settings-input span { min-width: 0; flex: 0 0 auto; }
            .memory-semantic-settings-input input { width: 0; min-width: 0; max-width: 100%; flex: 1 1 auto; box-sizing: border-box; border: 0; outline: 0; background: transparent; color: #1c1c1e; font: 14px/1.4 Arial, sans-serif; overflow: hidden; text-overflow: ellipsis; }
            .memory-semantic-model-progress { display: block; width: 100%; height: 6px; margin: 16px 0 0; accent-color: #1c1c1e; }
            .memory-semantic-model-status { min-height: 20px; margin: 12px 0 0; color: var(--memory-secondary); font-size: 13px; line-height: 1.5; }
            .memory-semantic-remove { border: 0; padding: 0; background: transparent; color: #ff3b30; font: 13px/1.5 "Noto Serif SC", "STSong", "SimSun", serif; cursor: pointer; }
            /* Reference memory-library layout. */
            .memory-app-container { --memory-blue: #007aff; --memory-background: #fff; --memory-card: #f6f6f6; --memory-secondary: #8e8e93; background: #fff; font-family: -apple-system, BlinkMacSystemFont, "SF Pro Text", "Helvetica Neue", Arial, sans-serif; }
            .memory-app-scroll { display: block; height: 100%; padding: max(54px, calc(env(safe-area-inset-top) + 20px)) 20px calc(28px + env(safe-area-inset-bottom)); background: #fff; }
            .memory-profile-header { min-height: 34px; }
            .memory-back { width: 34px; height: 34px; padding: 0 2px 4px 0; border-radius: 50%; background: rgba(142,142,147,.12); box-shadow: none; color: #000; font: 31px/31px Arial, sans-serif; }
            .memory-settings-button { height: 34px; border: 0; border-radius: 17px; padding: 0 16px; background: rgba(142,142,147,.12); color: #000; font: 600 15px/34px -apple-system, BlinkMacSystemFont, "SF Pro Text", sans-serif; cursor: pointer; }
            .memory-profile-main { display: block; padding: 0; }
            .memory-profile-section { display: flex; align-items: center; min-width: 0; padding: 22px 0 24px; }
            .memory-avatar-shell { position: relative; display: block; width: 88px; height: 88px; padding: 0; border: 0; border-radius: 20px; background: #d1d1d6; box-shadow: none; flex: 0 0 auto; }
            .memory-avatar { border: 0; border-radius: 20px; background: #d1d1d6; color: #fff; font-size: 32px; }
            .memory-avatar-switch { position: absolute; right: -6px; bottom: -6px; display: grid; width: 30px; height: 30px; border: 1px solid rgba(0,0,0,.05); border-radius: 50%; padding: 0; place-items: center; background: #fff; color: #000; box-shadow: 0 2px 10px rgba(0,0,0,.15); font: 17px/1 Arial, sans-serif; cursor: pointer; }
            .memory-heading { width: auto; min-width: 0; margin: 0 0 0 18px; text-align: left; }
            .memory-name-line { display: block; }
            .memory-name-line h1 { max-width: 100%; font-size: 24px; line-height: 1.2; font-weight: 600; letter-spacing: 0; }
            .memory-heading p { margin: 7px 0 0; color: #c7c7cc; font-size: 13px; line-height: 1.35; }
            .memory-profile-stat { display: flex; align-items: center; gap: 7px; color: #8e8e93 !important; font-size: 12px !important; white-space: nowrap; }
            .memory-profile-stat b { color: inherit; font-weight: 500; }
            .memory-profile-stat i { width: 1px; height: 11px; background: #c7c7cc; }
            .memory-profile-status { display: none; }
            .memory-tabs { position: static; display: grid; grid-template-columns: repeat(3, 1fr); width: 100%; margin: 0 0 16px; padding: 4px; border-radius: 10px; background: #f2f2f7; box-shadow: none; backdrop-filter: none; }
            .memory-tabs button { height: 28px; border-radius: 7px; color: #8e8e93; font: 600 13px/28px -apple-system, BlinkMacSystemFont, "SF Pro Text", sans-serif; }
            .memory-tabs button.is-active { background: #fff; color: #000; box-shadow: 0 3px 8px rgba(0,0,0,.04), 0 1px 1px rgba(0,0,0,.04); font-weight: 600; }
            .memory-search { display: flex; align-items: center; height: 36px; margin-bottom: 20px; border-radius: 10px; padding: 0 8px; background: rgba(142,142,147,.12); color: #8e8e93; }
            .memory-search span { margin-right: 6px; font: 21px/1 Arial, sans-serif; transform: rotate(-20deg); }
            .memory-search input { min-width: 0; flex: 1; border: 0; outline: 0; background: transparent; color: #000; font: 17px/1 -apple-system, BlinkMacSystemFont, "SF Pro Text", sans-serif; }
            .memory-search input::placeholder { color: #8e8e93; }
            .memory-list-header { display: flex; align-items: center; justify-content: space-between; min-height: 25px; margin-bottom: 12px; }
            .memory-list-header h2 { margin: 0; color: #000; font-size: 18px; font-weight: 600; }
            .memory-list-header > div { display: flex; align-items: center; gap: 16px; }
            .memory-list-header button { border: 0; padding: 0; background: transparent; color: #007aff; font: 600 14px/20px -apple-system, BlinkMacSystemFont, "SF Pro Text", sans-serif; cursor: pointer; }
            .memory-content-card { display: block; width: 100%; min-height: 0; margin: 0; padding: 0; border-radius: 0; background: transparent; box-shadow: none; }
            .memory-content-card [data-memory-content] { display: block; min-height: 0; }
            .memory-entry-list { display: grid; gap: 16px; padding: 0; overflow: visible; }
            .memory-entry { padding: 16px; border-radius: 16px; background: #f6f6f6; }
            .memory-entry-meta { display: inline-flex; align-items: center; border-radius: 6px; padding: 4px 8px; background: rgba(0,122,255,.12); color: #007aff; font-size: 12px; font-weight: 600; }
            .memory-entry p { margin-top: 8px; color: #000; font-size: 15px; line-height: 1.5; }
            .memory-entry .memory-entry-provenance { color: #8e8e93; font-size: 11px; }
            .memory-empty-state { min-height: 180px; padding: 25px 12px; }
            .memory-empty-state h2 { font-size: 21px; }
            .memory-composer, .memory-summary-panel, .memory-summary-settings, .memory-semantic-settings { background: rgba(0,0,0,.3); backdrop-filter: blur(10px); -webkit-backdrop-filter: blur(10px); }
            .memory-summary-settings-sheet { border-radius: 18px 18px 0 0; background: #fff; }
            .memory-settings-section { margin-top: 26px; padding-top: 20px; border-top: 1px solid #e5e5ea; }
            .memory-settings-section h3 { margin: 0; color: #000; font-size: 17px; font-weight: 600; }
            .memory-summary-settings-sheet { max-height: 88vh; padding: 8px 16px calc(24px + env(safe-area-inset-bottom)); background: #f2f2f7; box-shadow: 0 -12px 36px rgba(0,0,0,0.18); }
            .memory-sheet-handle { width: 36px; height: 5px; border-radius: 3px; background: rgba(60,60,67,0.3); margin: 6px auto 10px; }
            .memory-summary-settings-sheet > .memory-composer-header { display: flex; align-items: center; justify-content: space-between; min-height: 44px; padding: 0 4px 6px; }
            .memory-summary-settings-sheet > .memory-composer-header h2 { font: 600 17px/1.2 -apple-system, BlinkMacSystemFont, "SF Pro Text", sans-serif; color: #000; letter-spacing: -0.2px; margin: 0; flex: 1; text-align: center; }
            .memory-summary-settings-sheet > .memory-composer-header button { border: 0; background: transparent; color: #007aff; font: 500 17px/1 -apple-system, BlinkMacSystemFont, "SF Pro Text", sans-serif; cursor: pointer; padding: 6px 2px; transition: opacity 0.15s; }
            .memory-summary-settings-sheet > .memory-composer-header button:active { opacity: 0.4; }
            .memory-summary-settings-sheet > .memory-composer-header button:last-child { font-weight: 600; }
            .memory-settings-intro { margin: 2px 0 16px; color: #8e8e93; font: 500 13px/1.4 -apple-system, BlinkMacSystemFont, "SF Pro Text", sans-serif; text-align: center; }
            .memory-summary-control-card { display: grid; grid-template-columns: 32px minmax(0, 1fr) auto; align-items: center; gap: 12px; padding: 12px 16px; border-radius: 14px; background: #ffffff; box-shadow: 0 1px 3px rgba(0,0,0,0.02); }
            .memory-summary-card-icon { display: grid; width: 30px; height: 30px; border-radius: 7px; place-items: center; background: #8e8e93; color: #ffffff; }
            .memory-summary-card-icon svg { width: 18px; height: 18px; fill: currentColor; }
            .memory-summary-card-copy { display: grid; min-width: 0; gap: 2px; }
            .memory-summary-card-copy strong { color: #000000; font: 600 15px/1.25 -apple-system, BlinkMacSystemFont, "SF Pro Text", sans-serif; }
            .memory-summary-card-copy small { color: #8e8e93; font: 500 12px/1.3 -apple-system, BlinkMacSystemFont, "SF Pro Text", sans-serif; }
            .memory-summary-stepper { display: flex; align-items: center; background: #e5e5ea; border-radius: 8px; height: 32px; padding: 0 2px; }
            .memory-summary-stepper button { display: grid; width: 28px; height: 28px; border: 0; border-radius: 6px; place-items: center; background: transparent; color: #007aff; font: 600 18px/1 -apple-system, BlinkMacSystemFont, sans-serif; cursor: pointer; transition: background-color 0.15s, transform 0.1s; }
            .memory-summary-stepper button:active { background: rgba(0,0,0,0.06); transform: scale(0.92); }
            .memory-summary-stepper label { display: grid; justify-items: center; min-width: 40px; padding: 0 2px; }
            .memory-summary-stepper input { width: 36px; border: 0; padding: 0; background: transparent; color: #000000; font: 600 15px/1 -apple-system, BlinkMacSystemFont, sans-serif; text-align: center; outline: 0; }
            .memory-summary-stepper small { color: #8e8e93; font: 600 9px/1 -apple-system, BlinkMacSystemFont, sans-serif; white-space: nowrap; margin-top: 1px; }
            .memory-summary-api-card { display: grid; grid-template-columns: 32px minmax(0, 1fr) minmax(118px, 42%); align-items: center; gap: 12px; margin-top: 10px; padding: 12px 16px; border-radius: 14px; background: #fff; box-shadow: 0 1px 3px rgba(0,0,0,.02); }
            .memory-summary-api-card .memory-summary-card-icon svg { width: 18px; height: 18px; fill: none; stroke: currentColor; stroke-width: 1.8; stroke-linecap: round; stroke-linejoin: round; }
            .memory-summary-api-card select { width: 100%; min-width: 0; border: 0; outline: 0; background: transparent; color: #007aff; font: 600 13px/1.35 -apple-system, BlinkMacSystemFont, "SF Pro Text", sans-serif; text-align: right; text-overflow: ellipsis; }
            .memory-summary-api-card select:disabled { color: #8e8e93; opacity: .7; }
            .memory-source-group-title { margin: 24px 16px 8px; color: #6c6c70; font: 500 13px/1.2 -apple-system, BlinkMacSystemFont, "SF Pro Text", sans-serif; letter-spacing: -0.08px; text-transform: uppercase; }
            .memory-settings-collapsible { margin: 0; padding: 0; overflow: hidden; border: 0; background: #ffffff; }
            .memory-settings-collapsible-header { display: grid; grid-template-columns: 32px minmax(0, 1fr) auto 16px; align-items: center; gap: 12px; width: 100%; min-height: 52px; border: 0; border-bottom: 0.5px solid rgba(60,60,67,0.18); padding: 10px 16px; background: #ffffff; color: #000; text-align: left; cursor: pointer; transition: background-color 0.15s; }
            .memory-settings-collapsible-header:active { background-color: #f2f2f7; }
            .memory-source-icon { display: grid; width: 30px; height: 30px; border-radius: 7px; place-items: center; background: #8e8e93; color: #ffffff; }
            .memory-summary-prompt-section .memory-source-icon { background: #8e8e93; color: #ffffff; }
            .memory-settings-collapsible:not(.memory-summary-prompt-section):not(.memory-remote-vector-section):not(.memory-external-section) .memory-source-icon { background: #8e8e93; color: #ffffff; }
            .memory-remote-vector-section .memory-source-icon { background: #8e8e93; color: #ffffff; }
            .memory-external-section .memory-source-icon { background: #8e8e93; color: #ffffff; }
            .memory-source-icon svg { width: 18px; height: 18px; fill: currentColor; }
            .memory-source-copy { display: grid; min-width: 0; gap: 2px; }
            .memory-source-copy strong { color: #000000; font: 600 15px/1.25 -apple-system, BlinkMacSystemFont, "SF Pro Text", sans-serif; }
            .memory-source-copy small { overflow: hidden; color: #8e8e93; font: 500 12px/1.3 -apple-system, BlinkMacSystemFont, "SF Pro Text", sans-serif; text-overflow: ellipsis; white-space: nowrap; }
            .memory-source-status { color: #8e8e93; font: 500 14px/1 -apple-system, BlinkMacSystemFont, "SF Pro Text", sans-serif; background: transparent; padding: 0 4px; white-space: nowrap; }
            .memory-settings-chevron { width: 13px; height: 13px; fill: none; stroke: #c7c7cc; stroke-width: 2.2; stroke-linecap: round; stroke-linejoin: round; transition: transform 0.24s cubic-bezier(0.32, 0.72, 0, 1); }
            .memory-settings-collapsible.is-expanded .memory-settings-chevron { transform: rotate(180deg); }
            .memory-settings-collapsible-body { display: grid; min-width: 0; gap: 12px; padding: 8px 16px 16px; background: #ffffff; border-bottom: 0.5px solid rgba(60,60,67,0.18); }
            .memory-settings-collapsible:not(.is-expanded) .memory-settings-collapsible-body { display: none; }
            .memory-settings-collapsible:last-of-type { border-radius: 0 0 14px 14px; overflow: hidden; }
            .memory-settings-collapsible:last-of-type .memory-settings-collapsible-header { border-bottom: 0; }
            .memory-settings-collapsible:last-of-type.is-expanded .memory-settings-collapsible-header { border-bottom: 0.5px solid rgba(60,60,67,0.18); }
            .memory-remote-vector-section strong { color: #000000; font-size: 14px; font-weight: 600; }
            .memory-remote-vector-section .memory-sync-actions { margin-top: 4px; }
            .memory-remote-model-button { display: flex; min-width: 0; flex: 1; align-items: center; justify-content: flex-end; gap: 5px; border: 0; padding: 0; background: transparent; color: #000000; font: 500 14px/1.3 -apple-system, BlinkMacSystemFont, "SF Pro Text", sans-serif; cursor: pointer; }
            .memory-remote-model-button span { overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
            .memory-remote-model-button svg { width: 14px; height: 14px; flex: 0 0 auto; fill: none; stroke: #c7c7cc; stroke-width: 2.2; stroke-linecap: round; stroke-linejoin: round; }
            .memory-settings-privacy { display: flex; align-items: center; justify-content: center; gap: 6px; margin: 22px 0 8px; color: #8e8e93; font: 500 12px/1.4 -apple-system, BlinkMacSystemFont, "SF Pro Text", sans-serif; }
            .memory-settings-privacy svg { width: 14px; height: 14px; flex: 0 0 auto; fill: none; stroke: currentColor; stroke-width: 1.8; stroke-linecap: round; stroke-linejoin: round; }
            @media (prefers-reduced-motion: reduce) { .memory-settings-chevron, .memory-sync-switch, .memory-sync-switch::after { transition: none; } }
            .memory-external-fields { display: grid; min-width: 0; gap: 10px; }
            .memory-external-section .memory-semantic-settings-input { min-width: 0; overflow: hidden; }
            .memory-external-section input[type="text"], .memory-external-section input[type="password"], .memory-external-section input[type="url"] { width: 100%; min-width: 0; border: 0; padding: 0; box-sizing: border-box; background: transparent; color: #111; text-align: right; font: 500 14px -apple-system, BlinkMacSystemFont, "SF Pro Text", sans-serif; }
            .memory-external-section input::placeholder { overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
            .memory-sync-provider-button { display: flex; min-width: 0; flex: 1; align-items: center; justify-content: flex-end; gap: 8px; border: 0; padding: 0; background: transparent; color: #111; font: 600 14px -apple-system, BlinkMacSystemFont, "SF Pro Text", sans-serif; cursor: pointer; }
            .memory-sync-provider-button span:first-child { overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
            .memory-sync-chevron { color: #8e8e93; font-size: 22px; line-height: 1; }
            .memory-sync-toggle-row { display: flex; align-items: center; justify-content: space-between; gap: 16px; margin-top: 10px; padding: 13px 14px; border-radius: 14px; background: #f2f2f7; cursor: pointer; }
            .memory-sync-toggle-row > span:first-child { display: grid; gap: 2px; color: #1c1c1e; font-size: 15px; }
            .memory-sync-toggle-row small { color: #8e8e93; font-size: 12px; }
            .memory-sync-toggle-row input { position: absolute; width: 1px; height: 1px; opacity: 0; pointer-events: none; }
            .memory-sync-switch { position: relative; width: 51px; height: 31px; flex: 0 0 auto; border-radius: 16px; background: #d1d1d6; transition: background-color 180ms ease; }
            .memory-sync-switch::after { position: absolute; top: 2px; left: 2px; width: 27px; height: 27px; border-radius: 50%; background: #fff; box-shadow: 0 2px 5px rgba(0,0,0,.18); content: ""; transition: transform 180ms ease; }
            .memory-sync-toggle-row.is-on .memory-sync-switch { background: #34c759; }
            .memory-sync-toggle-row.is-on .memory-sync-switch::after { transform: translateX(20px); }
            .memory-summary-custom-prompt { display: grid; gap: 8px; margin-top: 12px; color: #1c1c1e; font-size: 14px; }
            .memory-summary-prompt-section .memory-sync-toggle-row { margin-top: 0; }
            .memory-summary-custom-prompt > span { color: #6e6e73; font-size: 13px; }
            .memory-summary-custom-prompt textarea { width: 100%; min-height: 150px; box-sizing: border-box; resize: vertical; border: 0; border-radius: 12px; padding: 12px; background: #f2f2f7; color: #1c1c1e; font: 14px/1.55 -apple-system, BlinkMacSystemFont, "SF Pro Text", sans-serif; outline: 0; }
            .memory-choice-dialog { position: absolute; inset: 0; z-index: 2; display: none; align-items: flex-end; background: rgba(0,0,0,.28); backdrop-filter: blur(10px); -webkit-backdrop-filter: blur(10px); }
            .memory-choice-dialog.is-visible { display: flex; }
            .memory-choice-backdrop { position: absolute; inset: 0; }
            .memory-choice-sheet { position: relative; width: 100%; padding: 14px 20px calc(25px + env(safe-area-inset-bottom)); border-radius: 22px 22px 0 0; background: rgba(255,255,255,.94); box-shadow: 0 -12px 28px rgba(0,0,0,.14); }
            .memory-choice-list { display: grid; gap: 8px; margin-top: 14px; }
            .memory-cloudflare-deploy-body { display: grid; gap: 10px; padding-top: 4px; }
            .memory-cloudflare-deploy-body .memory-semantic-settings-copy { margin: 8px 0 6px; font-size: 14px; }
            .memory-cloudflare-deploy-status { min-height: 38px; margin: 4px 0 0; color: var(--memory-secondary); font-size: 13px; line-height: 1.5; overflow-wrap: anywhere; }
            .memory-cloudflare-deploy-body button:disabled { opacity: .55; cursor: wait; }
            .memory-supabase-setup-body { display: grid; gap: 10px; padding-top: 4px; }
            .memory-supabase-setup-body .memory-semantic-settings-copy { margin: 8px 0 6px; font-size: 14px; }
            .memory-supabase-setup-status { min-height: 38px; margin: 4px 0 0; color: var(--memory-secondary); font-size: 13px; line-height: 1.5; overflow-wrap: anywhere; }
            .memory-supabase-setup-body button:disabled { opacity: .55; cursor: wait; }
            .memory-choice-option { display: flex; align-items: center; justify-content: space-between; min-height: 48px; border: 0; border-radius: 13px; padding: 0 14px; background: #f2f2f7; color: #1c1c1e; font: 600 15px -apple-system, BlinkMacSystemFont, "SF Pro Text", sans-serif; text-align: left; cursor: pointer; }
            .memory-choice-option:active { transform: scale(.985); }
            .memory-choice-check { color: #007aff; opacity: 0; }
            .memory-choice-option.is-selected .memory-choice-check { opacity: 1; }
            .memory-sync-scope { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 10px; margin: 14px 0 0; padding: 12px; border: 1px solid #e5e5ea; border-radius: 10px; }
            .memory-sync-scope legend { padding: 0 5px; color: #6e6e73; font-size: 12px; }
            .memory-sync-scope label { color: #1c1c1e; font-size: 13px; line-height: 20px; }
            .memory-sync-actions { display: grid; min-width: 0; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 8px; margin-top: 12px; }
            .memory-sync-actions button, .memory-sync-actions a { display: flex; min-width: 0; align-items: center; justify-content: center; min-height: 40px; border: 0; border-radius: 10px; padding: 6px 8px; background: #e9f2ff; color: #007aff; text-decoration: none; font: 600 13px/1.25 -apple-system, BlinkMacSystemFont, "SF Pro Text", sans-serif; text-align: center; overflow-wrap: anywhere; cursor: pointer; }
            .memory-model-download { width: 100%; height: 42px; margin-top: 14px; border: 0; border-radius: 10px; background: #007aff; color: #fff; font: 600 15px/42px -apple-system, BlinkMacSystemFont, "SF Pro Text", sans-serif; cursor: pointer; }
            .memory-semantic-model-progress { width: 100%; margin-top: 12px; }
            @media (prefers-reduced-transparency: reduce) { .memory-composer, .memory-summary-panel, .memory-summary-settings, .memory-semantic-settings { background: rgba(0,0,0,.52); backdrop-filter: none; -webkit-backdrop-filter: none; } }
            @media (max-width: 360px) { .memory-app-scroll, .memory-role-picker { padding-right: 15px; padding-left: 15px; } .memory-profile-section { padding-top: 18px; } .memory-avatar-shell { width: 78px; height: 78px; } .memory-heading { margin-left: 14px; } .memory-profile-stat { gap: 5px; font-size: 11px !important; } .memory-semantic-settings-input { flex-wrap: wrap; align-items: flex-start; } .memory-semantic-settings-input span { flex: 1 0 100%; } .memory-semantic-settings-input input { width: 100%; flex-basis: 100%; text-align: left; } .memory-sync-actions { grid-template-columns: 1fr; } }
        `;
        document.head.appendChild(style);
    }

    async function installReferenceStyles() {
        if (document.getElementById('memoryReferenceStyles')) return;
        const documentText = await decodeReferenceDocument();
        const styleMatch = documentText.match(/<style>([\s\S]*?)<\/style>/i);
        if (!styleMatch) return;
        const style = document.createElement('style');
        style.id = 'memoryReferenceStyles';
        style.textContent = styleMatch[1].replace(/body, html\s*\{[\s\S]*?\}/, '')
            + '#memoryAppUI .memory-app-scroll{width:100%;height:100%;overflow-y:auto;background:transparent}'
            + '#memoryAppUI .profile-avatar{overflow:hidden;position:relative}'
            + '#memoryAppUI .profile-avatar img{display:none;width:100%;height:100%;object-fit:cover}'
            + '#memoryAppUI .profile-avatar.has-image img{display:block}'
            + '#memoryAppUI .profile-avatar.has-image [data-memory-monogram]{display:none}'
            + '#memoryAppUI .memory-entry-actions{display:flex;gap:8px;align-items:center}'
            + '#memoryAppUI .memory-entry-actions button,#memoryAppUI .memory-entry-actions select{border:0;background:transparent;color:#007AFF;font:600 12px -apple-system,BlinkMacSystemFont,"SF Pro Text",sans-serif}'
            + '#memoryAppUI .memory-entry-actions .memory-delete-action{color:#ff3b30}';
        document.head.appendChild(style);
    }

    function init() {
        ensureStyles();
        if (!root) buildRoot();
        if (!getReferenceFrame()) void installReferenceStyles();
        return Promise.resolve();
    }

    function open() {
        if (!root) init();
        root.setAttribute('aria-hidden', 'false');
        root.classList.add('is-open');
        void refresh().then(() => window.MemorySync?.schedule(selectedContactId));
    }

    function close() {
        if (!root) return;
        closeSummaryPanel();
        closeComposer();
        closeSummarySettings();
        closeSemanticSettings();
        hideMemorySummaryCapsule();
        if (getReferenceFrame()) {
            root.classList.remove('is-open');
            root.setAttribute('aria-hidden', 'true');
            return;
        }
        root.classList.remove('is-picking-role');
        root.querySelector('[data-memory-role-picker]').setAttribute('aria-hidden', 'true');
        root.classList.remove('is-open');
        root.setAttribute('aria-hidden', 'true');
    }

    window.MemoryApp = {
        storage: Object.freeze({ version: memoryRecordVersion, arrayVersion: memoryArrayVersion, track: trackMemoryArray, ensure: ensureLegacyMemoryStorage, write: writeProtectedMemoryRecords }),
        init,
        open,
        close,
        refresh,
        preload,
        flush,
        getPromptMemories,
        enqueueChatTurn,
        getPendingChatTurns,
        completeChatTurn,
        markChatTurnFailed,
        getPromptSummary,
        getCurrentPromptSummary,
        getSummaryPromptConfig,
        getSummaryApiPresetId,
        getSummaryOverview,
        saveSummaryOverride,
        getRetrievalStatus,
        getRelevantFragments,
        getRelevantFragmentsAsync,
        runRetrievalEvaluation,
        runMemoryLifecycleEvaluation,
        runMemorySupersessionEvaluation,
        getSummaryJob,
        beginSummaryRequest: (job, options) => updateSummaryRequest(job, false, options),
        completeSummaryRequest: (job) => updateSummaryRequest(job, true),
        failSummaryRequest: (job) => updateSummaryRequest(job, false, { failed: true }),
        getSummaryRequestState,
        completeSummary,
        invalidateSources,
        getSyncSnapshot,
        mergeSyncRecords,
        isSyncRecordNewer,
        normalizeSyncTimestamp
    };

    window.addEventListener('contacts:characters-deleted', event => {
        if (!event.detail?.recordsPurged || !window.CharacterRecordCleanup) return;
        const cleanItems = (id, items) => window.CharacterRecordCleanup.clean({ id, items }).items;
        cachedMemoryItems = cleanItems('memoryItemsV1', cachedMemoryItems);
        cachedSummaries = cleanItems('memorySummariesV1', cachedSummaries);
        cachedOutbox = cleanItems('memoryOutboxV1', cachedOutbox);
        void refresh().catch(error => console.warn('Deleted character memory refresh failed:', error));
    });

    // The chat path reads this in-memory cache only. IndexedDB is warmed in the background.
    void preload().then(() => scheduleSemanticIndex());
    const scheduleMemoryReferencePreload = () => {
        const schedule = typeof window.requestIdleCallback === 'function'
            ? (callback) => window.requestIdleCallback(callback, { timeout: 3000 })
            : (callback) => setTimeout(callback, 900);
        schedule(() => void init());
    };
    if (document.readyState === 'complete') scheduleMemoryReferencePreload();
    else window.addEventListener('load', scheduleMemoryReferencePreload, { once: true });
    window.addEventListener('semanticmemory:status', (event) => {
        if (event.detail && (event.detail.status === 'ready' || window.SemanticMemory?.isReady?.())) scheduleSemanticIndex();
    });
    window.addEventListener('memorysync:ready', () => {
        if (root) void loadMemorySyncSettings();
    });
    document.addEventListener('visibilitychange', () => {
        if (document.visibilityState === 'visible' && memoryStateLoaded && !window.__tonghuajiBackupRestoreInProgress) {
            void window.MemoryApp.refresh().catch(error => console.warn('Memory resume refresh failed:', error));
        }
    });
    void window.MemorySync?.init?.();
})();

(function () {
    'use strict';

    const DB_NAME = 'iOSDesktopDB';
    const STORE_NAME = 'layoutStore';
    const SETTINGS_KEY = 'memoryExternalSettingsV1';
    const CREDENTIALS_KEY = 'memoryExternalCredentialsV1';
    const STATE_KEY = 'memoryExternalSyncStateV1';
    let settings = { enabled: false, provider: 'http', baseUrl: '', namespace: '', scope: { roles: 'current', tiers: ['L1'], includeChat: false, includeArchived: false }, autoSync: true };
    let credentials = {};
    let state = { records: {}, conflicts: [], bindingIds: [], lastSyncAt: '', pending: false, error: '' };
    let timer = 0;
    let initialized = false;
    let initPromise = null;
    let syncPromise = null;

    function read(key) {
        return new Promise((resolve) => {
            const request = indexedDB.open(DB_NAME);
            request.onerror = () => resolve(null);
            request.onsuccess = () => {
                const db = request.result;
                if (!db.objectStoreNames.contains(STORE_NAME)) { db.close(); resolve(null); return; }
                const tx = db.transaction(STORE_NAME, 'readonly');
                const get = (window.CharacterRecordCleanup?.wrap(tx.objectStore(STORE_NAME)) || tx.objectStore(STORE_NAME)).get(key);
                get.onsuccess = () => resolve(get.result || null);
                tx.oncomplete = () => db.close();
                tx.onerror = () => { db.close(); resolve(null); };
            };
        });
    }
    function write(record) {
        return new Promise((resolve) => {
            const request = indexedDB.open(DB_NAME);
            request.onerror = () => resolve(false);
            request.onsuccess = () => {
                const db = request.result;
                if (!db.objectStoreNames.contains(STORE_NAME)) { db.close(); resolve(false); return; }
                const tx = db.transaction(STORE_NAME, 'readwrite');
                (window.CharacterRecordCleanup?.wrap(tx.objectStore(STORE_NAME)) || tx.objectStore(STORE_NAME)).put(record);
                tx.oncomplete = () => { db.close(); resolve(true); };
                tx.onerror = () => { db.close(); resolve(false); };
            };
        });
    }
    const json = (value) => JSON.stringify(value || {});
    function normalizeSyncTimestamp(value) { return window.MemoryApp.normalizeSyncTimestamp(value); }
    const fingerprint = (record) => json({ id: record.id, status: record.status || 'active', content: String(record.content || ''), sections: record.sections || null });
    const safeUrl = (base, path) => String(base || '').replace(/\/$/, '') + '/' + String(path || '').replace(/^\//, '');
    function currentSyncAccountId() { return String((typeof appSettings !== 'undefined' && appSettings.wc_current_user_id) || window.appSettings?.wc_current_user_id || 'default'); }
    function scopeFor(bindingId) { const root = settings.namespace || 'tonghuaji-user'; return { ...settings.scope, bindingId, namespace: root + ':' + bindingId }; }
    function authHeaders() {
        const token = credentials.token || credentials.apiKey || '';
        return token ? { Authorization: 'Bearer ' + token } : {};
    }
    function zepHeaders() { const token = credentials.apiKey || credentials.token || ''; return token ? { Authorization: 'Api-Key ' + token } : {}; }
    async function refreshSupabaseSession() {
        if (settings.provider !== 'supabase' || !settings.baseUrl || !credentials.apiKey || !credentials.refreshToken) return false;
        try {
            const response = await fetch(safeUrl(settings.baseUrl, '/auth/v1/token?grant_type=refresh_token'), {
                method: 'POST',
                headers: { apikey: credentials.apiKey, 'Content-Type': 'application/json' },
                body: json({ refresh_token: credentials.refreshToken })
            });
            const data = await response.json().catch(() => null);
            if (!response.ok || !data?.access_token) return false;
            credentials.token = data.access_token;
            credentials.refreshToken = data.refresh_token || credentials.refreshToken;
            await write({ id: CREDENTIALS_KEY, value: credentials });
            return true;
        } catch (_) {
            return false;
        }
    }
    async function request(url, options = {}) {
        const controller = new AbortController();
        const timeout = setTimeout(() => controller.abort(), Number(options.timeout || 9000));
        try {
            const headers = { Accept: 'application/json', ...(options.body ? { 'Content-Type': 'application/json' } : {}), ...(options.headers || {}) };
            const response = await fetch(url, { ...options, headers, signal: controller.signal });
            if (response.status === 401 && !options._supabaseRetried && await refreshSupabaseSession()) {
                return request(url, { ...options, _supabaseRetried: true });
            }
            const text = await response.text();
            let data = null; try { data = text ? JSON.parse(text) : null; } catch (_) { data = text; }
            if (!response.ok) throw new Error((data && (data.message || data.error)) || ('HTTP ' + response.status));
            return data;
        } finally { clearTimeout(timeout); }
    }
    function canonicalRemote(item) {
        if (!item) return null;
        let dataPayload = {};
        if (typeof item.data === 'string' && item.data.trim().startsWith('{')) { try { dataPayload = JSON.parse(item.data); } catch (_) {} }
        const payload = item.payload && typeof item.payload === 'object' ? item.payload : (item.metadata?.tonghuaji_payload || dataPayload || {});
        const metadata = item.metadata || {};
        const id = payload.id || item.clientId || item.client_id || metadata.tonghuaji_id || item.id || item.uuid;
        if (!id) return null;
        return { ...item, ...metadata, ...payload, id: String(id), remoteId: String(item.id || item.uuid || id), bindingId: payload.bindingId || item.bindingId || item.binding_id || metadata.bindingId, content: String(payload.content || item.content || item.text || item.data || ''), status: payload.status || metadata.status || item.status || 'active', updatedAt: normalizeSyncTimestamp(payload.updatedAt || metadata.updatedAt || item.updatedAt || item.updated_at || item.createdAt), metadata };
    }
    function provider() {
        const type = settings.provider;
        if (type === 'mem0') return {
            async test() { return request(safeUrl(settings.baseUrl || 'https://api.mem0.ai', '/v3/memories/search/'), { method: 'POST', headers: { Authorization: 'Token ' + (credentials.apiKey || credentials.token) }, body: json({ query: 'healthcheck', filters: { user_id: scopeFor('health').namespace }, top_k: 1 }) }); },
            async list(scope) { const r = await request(safeUrl(settings.baseUrl || 'https://api.mem0.ai', '/v3/memories/?page=1&page_size=100'), { method: 'POST', headers: { Authorization: 'Token ' + (credentials.apiKey || credentials.token) }, body: json({ filters: { user_id: scope.namespace } }) }); return (Array.isArray(r) ? r : (r.results || r.memories || [])).map(canonicalRemote).filter(Boolean); },
            async search(query, scope) { const r = await request(safeUrl(settings.baseUrl || 'https://api.mem0.ai', '/v3/memories/search/'), { method: 'POST', headers: { Authorization: 'Token ' + (credentials.apiKey || credentials.token) }, body: json({ query, filters: { user_id: scope.namespace }, top_k: 6 }) }); return (Array.isArray(r) ? r : (r.results || r.memories || [])).map(canonicalRemote).filter(Boolean); },
            async upsert(record, scope, remote) { const metadata = { tonghuaji_id: record.id, tonghuaji_payload: record, bindingId: record.bindingId, kind: record.kind, tier: record.tier, status: record.status, updatedAt: record.updatedAt }; if (remote && remote.remoteId) return request(safeUrl(settings.baseUrl || 'https://api.mem0.ai', '/v1/memories/' + encodeURIComponent(remote.remoteId) + '/'), { method: 'PUT', headers: { Authorization: 'Token ' + (credentials.apiKey || credentials.token) }, body: json({ text: record.content, metadata, user_id: scope.namespace }) }); return request(safeUrl(settings.baseUrl || 'https://api.mem0.ai', '/v3/memories/add/'), { method: 'POST', headers: { Authorization: 'Token ' + (credentials.apiKey || credentials.token) }, body: json({ messages: [{ role: 'user', content: record.content }], user_id: scope.namespace, infer: false, metadata }) }); },
            async remove(remote) { if (!remote?.remoteId) return true; await request(safeUrl(settings.baseUrl || 'https://api.mem0.ai', '/v1/memories/' + encodeURIComponent(remote.remoteId) + '/'), { method: 'DELETE', headers: { Authorization: 'Token ' + (credentials.apiKey || credentials.token) } }); return true; }
        };
        if (type === 'zep') return {
            async test() { const scope = scopeFor('health'); return request(safeUrl(settings.baseUrl || 'https://api.getzep.com/api/v2', '/users/' + encodeURIComponent(scope.namespace)), { headers: zepHeaders() }).catch(() => request(safeUrl(settings.baseUrl || 'https://api.getzep.com/api/v2', '/users'), { method: 'POST', headers: zepHeaders(), body: json({ user_id: scope.namespace, email: scope.namespace + '@local.invalid' }) })); },
            async list(scope) { const r = await request(safeUrl(settings.baseUrl || 'https://api.getzep.com/api/v2', '/graph/episodes/user/' + encodeURIComponent(scope.namespace) + '?lastn=1000'), { headers: zepHeaders() }); return (Array.isArray(r) ? r : (r.episodes || r.data || [])).map(canonicalRemote).filter(Boolean); },
            async search(query, scope) { const r = await request(safeUrl(settings.baseUrl || 'https://api.getzep.com/api/v2', '/graph/search'), { method: 'POST', headers: zepHeaders(), body: json({ user_id: scope.namespace, query, limit: 6 }) }); return (Array.isArray(r) ? r : (r.results || r.data || [])).map(canonicalRemote).filter(Boolean); },
            async upsert(record, scope, remote) { await request(safeUrl(settings.baseUrl || 'https://api.getzep.com/api/v2', '/users'), { method: 'POST', headers: zepHeaders(), body: json({ user_id: scope.namespace, email: scope.namespace + '@local.invalid' }) }).catch(() => null); if (remote?.remoteId) await this.remove(remote); return request(safeUrl(settings.baseUrl || 'https://api.getzep.com/api/v2', '/graph'), { method: 'POST', headers: zepHeaders(), body: json({ data: JSON.stringify(record), type: 'text', user_id: scope.namespace, metadata: { tonghuaji_id: record.id, bindingId: record.bindingId, kind: record.kind, tier: record.tier, status: record.status, updatedAt: record.updatedAt } }) }); },
            async remove(remote) { if (!remote?.remoteId) return true; await request(safeUrl(settings.baseUrl || 'https://api.getzep.com/api/v2', '/graph/episodes/' + encodeURIComponent(remote.remoteId)), { method: 'DELETE', headers: zepHeaders() }); return true; }
        };
        if (type === 'supabase') return {
            headers() { return { apikey: credentials.apiKey || '', ...(credentials.token ? { Authorization: 'Bearer ' + credentials.token } : {}) }; },
            async test() { return request(safeUrl(settings.baseUrl, '/rest/v1/' + (credentials.table || 'tonghuaji_memories') + '?select=id&limit=1'), { headers: this.headers() }); },
            async list(scope) { const r = await request(safeUrl(settings.baseUrl, '/rest/v1/' + (credentials.table || 'tonghuaji_memories') + '?user_id=eq.' + encodeURIComponent(scope.namespace) + '&select=*'), { headers: this.headers() }); return (r || []).map(canonicalRemote).filter(Boolean); },
            async search(query, scope) { const all = await this.list(scope); return all.filter((item) => item.content.toLowerCase().includes(String(query || '').toLowerCase())).slice(0, 6); },
            async upsert(record, scope) { const table = credentials.table || 'tonghuaji_memories'; const updatedAt = normalizeSyncTimestamp(record.updatedAt || record.createdAt); const body = { id: record.id, client_id: record.id, user_id: scope.namespace, binding_id: record.bindingId, kind: record.kind, tier: record.tier, status: record.status, content: record.content, payload: { ...record, updatedAt }, updated_at: updatedAt }; return request(safeUrl(settings.baseUrl, '/rest/v1/' + table + '?on_conflict=owner_id%2Cid'), { method: 'POST', headers: { ...this.headers(), Prefer: 'resolution=merge-duplicates,return=representation' }, body: json(body) }); },
            async remove(remote) { if (!remote?.remoteId) return true; await request(safeUrl(settings.baseUrl, '/rest/v1/' + (credentials.table || 'tonghuaji_memories') + '?id=eq.' + encodeURIComponent(remote.remoteId)), { method: 'DELETE', headers: this.headers() }); return true; }
        };
        return {
            async test() { return request(safeUrl(settings.baseUrl, '/health'), { headers: authHeaders() }); },
            async list(scope) { const r = await request(safeUrl(settings.baseUrl, '/list?scope=' + encodeURIComponent(scope.namespace)), { headers: authHeaders() }); return (Array.isArray(r) ? r : (r.records || r.data || [])).map(canonicalRemote).filter(Boolean); },
            async search(query, scope) { const r = await request(safeUrl(settings.baseUrl, '/search'), { method: 'POST', headers: authHeaders(), body: json({ query, scope, limit: 6 }) }); return (Array.isArray(r) ? r : (r.records || r.results || r.data || [])).map(canonicalRemote).filter(Boolean); },
            async upsert(record, scope) { return request(safeUrl(settings.baseUrl, '/records/' + encodeURIComponent(record.id)), { method: 'PUT', headers: authHeaders(), body: json({ ...record, scope: scope.namespace }) }); },
            async remove(record) { const scope = record.scope?.namespace || record.scope || ''; await request(safeUrl(settings.baseUrl, '/records/' + encodeURIComponent(record.id) + '?scope=' + encodeURIComponent(scope)), { method: 'DELETE', headers: authHeaders() }); return true; }
        };
    }
    function notifyReady() { window.dispatchEvent(new CustomEvent('memorysync:ready')); }
    async function init() {
        if (initialized) return;
        if (initPromise) return initPromise;
        initPromise = Promise.all([read(SETTINGS_KEY), read(CREDENTIALS_KEY), read(STATE_KEY)]).then(([s, c, st]) => {
            settings = { ...settings, ...(s || {}), scope: { ...settings.scope, ...(s?.scope || {}) } };
            credentials = c?.value || {};
            state = { ...state, ...(st || {}), records: st?.records || {}, conflicts: Array.isArray(st?.conflicts) ? st.conflicts : [], bindingIds: Array.isArray(st?.bindingIds) ? st.bindingIds : [] };
            initialized = true;
            notifyReady();
        }).finally(() => {
            initPromise = null;
        });
        return initPromise;
    }
    async function saveConfig(next, secret) { await init(); settings = { ...settings, ...next, scope: { ...settings.scope, ...(next?.scope || {}) } }; credentials = { ...credentials, ...(secret || {}) }; await Promise.all([write({ id: SETTINGS_KEY, ...settings }), write({ id: CREDENTIALS_KEY, value: credentials }), write({ id: STATE_KEY, ...state })]); notifyReady(); return settings; }
    function selectedRecords(bindingId) { const selectedBinding = settings.scope?.roles === 'all' ? '' : bindingId; const snapshot = window.MemoryApp?.getSyncSnapshot ? window.MemoryApp.getSyncSnapshot(selectedBinding, settings.scope) : []; return Array.isArray(snapshot) ? snapshot : []; }
    function syncNow(bindingId) {
        if (syncPromise) return syncPromise;
        syncPromise = performSyncNow(bindingId).finally(() => { syncPromise = null; });
        return syncPromise;
    }
    async function performSyncNow(bindingId) {
        const accountId = currentSyncAccountId();
        const assertAccount = () => { const current = currentSyncAccountId(); if (current !== accountId) throw new Error('MEMORY_SYNC_ACCOUNT_CHANGED'); };
        await init(); assertAccount(); if (!settings.enabled || !settings.baseUrl) return { skipped: true };
        await window.MemoryApp?.preload?.(); assertAccount();
        state.pending = true; state.error = ''; await write({ id: STATE_KEY, ...state });
        const adapter = provider();
        try {
            const local = selectedRecords(bindingId);
            const bindingIds = Array.from(new Set(local.map((record) => record.bindingId).filter(Boolean)));
            if (!bindingIds.length && bindingId) bindingIds.push(bindingId);
            state.bindingIds = Array.from(new Set([...(state.bindingIds || []), ...bindingIds]));
            let restored = 0;
            for (const currentBindingId of bindingIds) {
                const scope = scopeFor(currentBindingId);
                const localGroup = local.filter((record) => record.bindingId === currentBindingId);
                const remote = await adapter.list(scope);
                assertAccount();
                const remoteById = new Map(remote.map((item) => [String(item.id), item]));
                for (const record of localGroup) {
                    const previous = state.records[record.id];
                    const remoteItem = remoteById.get(record.id);
                    if (remoteItem && ['user_deleted', 'remote_deleted', 'source_removed'].includes(remoteItem.archiveReason)
                        && window.MemoryApp.isSyncRecordNewer(remoteItem, record)) {
                        await window.MemoryApp.mergeSyncRecords([remoteItem], { scope });
                        delete state.records[record.id];
                        continue;
                    }
                    if (record.status === 'archived' || record.status === 'superseded') {
                        if (remoteItem?.status === 'active' && remoteItem.restoredAt && Date.parse(remoteItem.restoredAt) >= Date.parse(record.updatedAt || '') && window.MemoryApp.isSyncRecordNewer(remoteItem, record)) {
                            await window.MemoryApp.mergeSyncRecords([remoteItem], { scope });
                            continue;
                        }
                        if (settings.provider === 'http' || settings.provider === 'supabase') {
                            const tombstone = { ...record, content: '', sections: [], sourceSnapshots: [], history: [], archiveAnalysis: null, semanticVector: null, v2: null };
                            await adapter.upsert(tombstone, scope, remoteItem || previous);
                        } else if (remoteItem || previous) await adapter.remove({ remoteId: remoteItem?.remoteId || previous?.remoteId || record.id, id: record.id, scope });
                        delete state.records[record.id]; continue;
                    }
                    const localFingerprint = fingerprint(record);
                    const remoteFingerprint = remoteItem ? fingerprint(remoteItem) : '';
                    const localChanged = Boolean(previous && previous.fingerprint !== localFingerprint);
                    const remoteChanged = Boolean(previous && remoteItem && previous.remoteFingerprint !== remoteFingerprint);
                    if (previous?.remoteConfirmed && !remoteItem && !localChanged) {
                        await window.MemoryApp?.mergeSyncRecords?.([{ ...record, status: 'archived', archiveReason: 'remote_deleted', updatedAt: new Date().toISOString() }], { scope, preferIncoming: true });
                        delete state.records[record.id];
                        continue;
                    }
                    if (previous && remoteItem && !localChanged && remoteChanged) {
                        const remoteIsNewer = window.MemoryApp.isSyncRecordNewer(remoteItem, record);
                        if (remoteIsNewer) {
                            await window.MemoryApp?.mergeSyncRecords?.([remoteItem], { scope, preferIncoming: true });
                            state.records[record.id] = { fingerprint: remoteFingerprint, remoteFingerprint, remoteId: remoteItem.remoteId || remoteItem.id, remoteConfirmed: true, lastSyncedAt: new Date().toISOString() };
                        } else {
                            const result = await adapter.upsert(record, scope, previous);
                            const responseRecord = canonicalRemote(Array.isArray(result) ? result[0] : result);
                            const stableId = responseRecord?.remoteId || remoteItem?.remoteId || previous?.remoteId || record.id;
                            state.records[record.id] = { fingerprint: localFingerprint, remoteFingerprint: localFingerprint, remoteId: stableId, remoteConfirmed: Boolean(responseRecord || remoteItem || settings.provider === 'http' || settings.provider === 'supabase'), pendingUntil: (!responseRecord && !remoteItem && (settings.provider === 'mem0' || settings.provider === 'zep')) ? new Date(Date.now() + 60000).toISOString() : '', lastSyncedAt: new Date().toISOString() };
                        }
                        continue;
                    }
                    if (previous && remoteItem && localChanged && remoteChanged) {
                        state.conflicts = [{ id: record.id, bindingId: record.bindingId, local: record, remote: remoteItem, resolved: 'local', createdAt: new Date().toISOString() }, ...state.conflicts.filter((item) => item.id !== record.id)].slice(0, 50);
                    }
                    if (remoteItem && !localChanged && !remoteChanged) {
                        state.records[record.id] = { ...previous, remoteId: remoteItem.remoteId || remoteItem.id, remoteConfirmed: true, lastSyncedAt: new Date().toISOString() };
                        continue;
                    }
                    // Mem0 and Zep can acknowledge a write before it appears in list results.
                    // Keep the accepted local version pending instead of creating duplicates.
                    if (!remoteItem && previous && !localChanged && !previous.remoteConfirmed) continue;
                    const result = await adapter.upsert(record, scope, remoteItem ? { remoteId: remoteItem.remoteId || remoteItem.id } : previous);
                    const responseRecord = canonicalRemote(Array.isArray(result) ? result[0] : result);
                    const stableId = responseRecord?.remoteId || remoteItem?.remoteId || previous?.remoteId || record.id;
                    state.records[record.id] = { fingerprint: localFingerprint, remoteFingerprint: localFingerprint, remoteId: stableId, remoteConfirmed: Boolean(responseRecord || remoteItem || settings.provider === 'http' || settings.provider === 'supabase'), pendingUntil: (!responseRecord && !remoteItem && (settings.provider === 'mem0' || settings.provider === 'zep')) ? new Date(Date.now() + 60000).toISOString() : '', lastSyncedAt: new Date().toISOString() };
                }
                const remoteOnly = remote.filter((item) => !localGroup.some((record) => record.id === item.id));
                assertAccount();
                if (remoteOnly.length && window.MemoryApp?.mergeSyncRecords) restored += await window.MemoryApp.mergeSyncRecords(remoteOnly, { scope });
            }
            state.lastSyncAt = new Date().toISOString(); state.pending = false; await write({ id: STATE_KEY, ...state });
            return { uploaded: local.filter((record) => record.status === 'active').length, restored, conflicts: state.conflicts.length };
        } catch (error) { state.pending = false; state.error = String(error.message || error); await write({ id: STATE_KEY, ...state }); throw error; }
    }
    async function restoreNow(bindingId) {
        await init();
        if (!settings.enabled || !settings.baseUrl) return { skipped: true };
        const accountId = currentSyncAccountId();
        const adapter = provider();
        const local = selectedRecords(bindingId);
        const bindingIds = settings.scope?.roles === 'all' ? Array.from(new Set([...(state.bindingIds || []), ...local.map(record => record.bindingId).filter(Boolean)])) : [bindingId];
        let restored = 0;
        for (const currentBindingId of bindingIds.filter(Boolean)) {
            const scope = scopeFor(currentBindingId);
            const remote = await adapter.list(scope);
            const current = currentSyncAccountId();
            if (accountId !== current) throw new Error('MEMORY_SYNC_ACCOUNT_CHANGED');
            if (remote.length && window.MemoryApp?.mergeSyncRecords) restored += await window.MemoryApp.mergeSyncRecords(remote, { scope });
        }
        state.lastSyncAt = new Date().toISOString(); state.error = ''; await write({ id: STATE_KEY, ...state });
        return { restored };
    }
    function schedule(bindingId) { if (settings.autoSync === false) return; const owner = currentSyncAccountId(); clearTimeout(timer); timer = setTimeout(() => { const current = currentSyncAccountId(); if (current === owner) void syncNow(bindingId).catch(() => null); }, 2200); }
    async function search(bindingId, query) { await init(); if (!settings.enabled || !settings.baseUrl || !query) return []; try { const results = await provider().search(query, scopeFor(bindingId)); return results.filter(record => !record.status || record.status === 'active'); } catch (_) { return []; } }
    window.MemorySync = { init, getSettings: () => ({ ...settings, table: credentials.table || '', hasApiKey: Boolean(credentials.apiKey), hasToken: Boolean(credentials.token), hasRefreshToken: Boolean(credentials.refreshToken), scope: { ...settings.scope, tiers: [...(settings.scope?.tiers || ['L1'])] } }), saveConfig, testConnection: async () => { await init(); return provider().test(); }, syncNow, restoreNow, schedule, search, getStatus: () => ({ ...state, conflicts: state.conflicts.length }) };
    void init();
})();



