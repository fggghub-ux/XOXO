(function () {
    'use strict';

    const DB_NAME = 'iOSDesktopDB';
    const STORE_NAME = 'layoutStore';
    const GAME_STORE_ID = 'gameCenterData';
    const NUMEN_MCP_CONFIG_ID = 'minecraft-numen';
    const GAME_CATALOG = [
        {
            id: 'minecraft',
            name: '我的世界',
            subtitle: 'Numen AI 同伴',
            description: '让角色进入世界，像真实玩家一样探索、采集、建造和战斗。',
            icon: 'blocks',
            available: true
        },
        {
            id: 'stardew', name: '星露谷物语', subtitle: '单窗口 AI 同伴',
            description: '与角色在同一个游戏窗口里同行、照顾作物。', icon: 'controller', available: true
        },
        {
            id: 'coming-soon',
            name: '更多游戏',
            subtitle: '持续接入中',
            description: '后续游戏会沿用同一套角色、记忆和连接管理。',
            icon: 'plus',
            available: false
        }
    ];

    let root = null;
    let state = null;
    let initialized = false;
    let initPromise = null;
    let activePage = 'library';
    let noticeTimer = null;
    let minecraftPollTimer = null;
    let minecraftPollBusy = false;
    let minecraftPollFailures = 0;
    let minecraftNextPollAt = 0;
    let minecraftConnectionEpoch = 0;
    let minecraftPollController = null;
    let stardewTimer = null;
    let stardewEpoch = 0;
    let stardewController = null;
    let stardewBusy = false;
    let stardewChatController = null;
    let stardewChatRequestId = '';
    let stardewAccount = '';
    let stardewWatchController = null;
    const stardewSkins = [['default', '默认同伴'], ['Abigail', '阿比盖尔'], ['Alex', '亚历克斯'], ['Elliott', '艾利欧特'], ['Emily', '艾米丽'], ['Haley', '海莉'], ['Harvey', '哈维'], ['Leah', '莉亚'], ['Maru', '玛鲁'], ['Penny', '潘妮'], ['Sam', '山姆'], ['Sebastian', '塞巴斯蒂安'], ['Shane', '谢恩']];

    function escapeHtml(value) {
        return String(value == null ? '' : value).replace(/[&<>"']/g, char => ({
            '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
        })[char]);
    }

    // Bootstrap Icons (MIT), embedded for offline use.
    function svgIcon(name, className = '') {
        const paths = {
            back: "<path fill-rule=\"evenodd\" d=\"M11.354 1.646a.5.5 0 0 1 0 .708L5.707 8l5.647 5.646a.5.5 0 0 1-.708.708l-6-6a.5.5 0 0 1 0-.708l6-6a.5.5 0 0 1 .708 0\"/>",
            chevron: "<path fill-rule=\"evenodd\" d=\"M4.646 1.646a.5.5 0 0 1 .708 0l6 6a.5.5 0 0 1 0 .708l-6 6a.5.5 0 0 1-.708-.708L10.293 8 4.646 2.354a.5.5 0 0 1 0-.708\"/>",
            blocks: "<path d=\"M1 2.5A1.5 1.5 0 0 1 2.5 1h3A1.5 1.5 0 0 1 7 2.5v3A1.5 1.5 0 0 1 5.5 7h-3A1.5 1.5 0 0 1 1 5.5zm8 0A1.5 1.5 0 0 1 10.5 1h3A1.5 1.5 0 0 1 15 2.5v3A1.5 1.5 0 0 1 13.5 7h-3A1.5 1.5 0 0 1 9 5.5zm-8 8A1.5 1.5 0 0 1 2.5 9h3A1.5 1.5 0 0 1 7 10.5v3A1.5 1.5 0 0 1 5.5 15h-3A1.5 1.5 0 0 1 1 13.5zm8 0A1.5 1.5 0 0 1 10.5 9h3a1.5 1.5 0 0 1 1.5 1.5v3a1.5 1.5 0 0 1-1.5 1.5h-3A1.5 1.5 0 0 1 9 13.5z\"/>",
            plus: "<path fill-rule=\"evenodd\" d=\"M8 2a.5.5 0 0 1 .5.5v5h5a.5.5 0 0 1 0 1h-5v5a.5.5 0 0 1-1 0v-5h-5a.5.5 0 0 1 0-1h5v-5A.5.5 0 0 1 8 2\"/>",
            external: "<path fill-rule=\"evenodd\" d=\"M8.636 3.5a.5.5 0 0 0-.5-.5H1.5A1.5 1.5 0 0 0 0 4.5v10A1.5 1.5 0 0 0 1.5 16h10a1.5 1.5 0 0 0 1.5-1.5V7.864a.5.5 0 0 0-1 0V14.5a.5.5 0 0 1-.5.5h-10a.5.5 0 0 1-.5-.5v-10a.5.5 0 0 1 .5-.5h6.636a.5.5 0 0 0 .5-.5\"/><path fill-rule=\"evenodd\" d=\"M16 .5a.5.5 0 0 0-.5-.5h-5a.5.5 0 0 0 0 1h3.793L6.146 9.146a.5.5 0 1 0 .708.708L15 1.707V5.5a.5.5 0 0 0 1 0z\"/>",
            server: "<path d=\"M2 9a2 2 0 0 0-2 2v1a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-1a2 2 0 0 0-2-2zm.5 3a.5.5 0 1 1 0-1 .5.5 0 0 1 0 1m2 0a.5.5 0 1 1 0-1 .5.5 0 0 1 0 1M2 2a2 2 0 0 0-2 2v1a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V4a2 2 0 0 0-2-2zm.5 3a.5.5 0 1 1 0-1 .5.5 0 0 1 0 1m2 0a.5.5 0 1 1 0-1 .5.5 0 0 1 0 1\"/>",
            key: "<path d=\"M3.5 11.5a3.5 3.5 0 1 1 3.163-5H14L15.5 8 14 9.5l-1-1-1 1-1-1-1 1-1-1-1 1H6.663a3.5 3.5 0 0 1-3.163 2M2.5 9a1 1 0 1 0 0-2 1 1 0 0 0 0 2\"/>",
            user: "<path d=\"M3 14s-1 0-1-1 1-4 6-4 6 3 6 4-1 1-1 1zm5-6a3 3 0 1 0 0-6 3 3 0 0 0 0 6\"/>",
            cube: "<path fill-rule=\"evenodd\" d=\"M15.528 2.973a.75.75 0 0 1 .472.696v8.662a.75.75 0 0 1-.472.696l-7.25 2.9a.75.75 0 0 1-.557 0l-7.25-2.9A.75.75 0 0 1 0 12.331V3.669a.75.75 0 0 1 .471-.696L7.443.184l.004-.001.274-.11a.75.75 0 0 1 .558 0l.274.11.004.001zm-1.374.527L8 5.962 1.846 3.5 1 3.839v.4l6.5 2.6v7.922l.5.2.5-.2V6.84l6.5-2.6v-.4l-.846-.339Z\"/>",
            message: "<path d=\"M0 2a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H4.414a1 1 0 0 0-.707.293L.854 15.146A.5.5 0 0 1 0 14.793zm3.5 1a.5.5 0 0 0 0 1h9a.5.5 0 0 0 0-1zm0 2.5a.5.5 0 0 0 0 1h9a.5.5 0 0 0 0-1zm0 2.5a.5.5 0 0 0 0 1h5a.5.5 0 0 0 0-1z\"/>",
            link: "<path d=\"M4.715 6.542 3.343 7.914a3 3 0 1 0 4.243 4.243l1.828-1.829A3 3 0 0 0 8.586 5.5L8 6.086a1 1 0 0 0-.154.199 2 2 0 0 1 .861 3.337L6.88 11.45a2 2 0 1 1-2.83-2.83l.793-.792a4 4 0 0 1-.128-1.287z\"/><path d=\"M6.586 4.672A3 3 0 0 0 7.414 9.5l.775-.776a2 2 0 0 1-.896-3.346L9.12 3.55a2 2 0 1 1 2.83 2.83l-.793.792c.112.42.155.855.128 1.287l1.372-1.372a3 3 0 1 0-4.243-4.243z\"/>",
            controller: "<path d=\"M11.5 6.027a.5.5 0 1 1-1 0 .5.5 0 0 1 1 0m-1.5 1.5a.5.5 0 1 0 0-1 .5.5 0 0 0 0 1m2.5-.5a.5.5 0 1 1-1 0 .5.5 0 0 1 1 0m-1.5 1.5a.5.5 0 1 0 0-1 .5.5 0 0 0 0 1m-6.5-3h1v1h1v1h-1v1h-1v-1h-1v-1h1z\"/><path d=\"M3.051 3.26a.5.5 0 0 1 .354-.613l1.932-.518a.5.5 0 0 1 .62.39c.655-.079 1.35-.117 2.043-.117.72 0 1.443.041 2.12.126a.5.5 0 0 1 .622-.399l1.932.518a.5.5 0 0 1 .306.729q.211.136.373.297c.408.408.78 1.05 1.095 1.772.32.733.599 1.591.805 2.466s.34 1.78.364 2.606c.024.816-.059 1.602-.328 2.21a1.42 1.42 0 0 1-1.445.83c-.636-.067-1.115-.394-1.513-.773-.245-.232-.496-.526-.739-.808-.126-.148-.25-.292-.368-.423-.728-.804-1.597-1.527-3.224-1.527s-2.496.723-3.224 1.527c-.119.131-.242.275-.368.423-.243.282-.494.575-.739.808-.398.38-.877.706-1.513.773a1.42 1.42 0 0 1-1.445-.83c-.27-.608-.352-1.395-.329-2.21.024-.826.16-1.73.365-2.606.206-.875.486-1.733.805-2.466.315-.722.687-1.364 1.094-1.772a2.3 2.3 0 0 1 .433-.335l-.028-.079zm2.036.412c-.877.185-1.469.443-1.733.708-.276.276-.587.783-.885 1.465a14 14 0 0 0-.748 2.295 12.4 12.4 0 0 0-.339 2.406c-.022.755.062 1.368.243 1.776a.42.42 0 0 0 .426.24c.327-.034.61-.199.929-.502.212-.202.4-.423.615-.674.133-.156.276-.323.44-.504C4.861 9.969 5.978 9.027 8 9.027s3.139.942 3.965 1.855c.164.181.307.348.44.504.214.251.403.472.615.674.318.303.601.468.929.503a.42.42 0 0 0 .426-.241c.18-.408.265-1.02.243-1.776a12.4 12.4 0 0 0-.339-2.406 14 14 0 0 0-.748-2.295c-.298-.682-.61-1.19-.885-1.465-.264-.265-.856-.523-1.733-.708-.85-.179-1.877-.27-2.913-.27s-2.063.091-2.913.27\"/>",
            signal: "<path d=\"M15.384 6.115a.485.485 0 0 0-.047-.736A12.44 12.44 0 0 0 8 3C5.259 3 2.723 3.882.663 5.379a.485.485 0 0 0-.048.736.52.52 0 0 0 .668.05A11.45 11.45 0 0 1 8 4c2.507 0 4.827.802 6.716 2.164.205.148.49.13.668-.049\"/><path d=\"M13.229 8.271a.482.482 0 0 0-.063-.745A9.46 9.46 0 0 0 8 6c-1.905 0-3.68.56-5.166 1.526a.48.48 0 0 0-.063.745.525.525 0 0 0 .652.065A8.46 8.46 0 0 1 8 7a8.46 8.46 0 0 1 4.576 1.336c.206.132.48.108.653-.065m-2.183 2.183c.226-.226.185-.605-.1-.75A6.5 6.5 0 0 0 8 9c-1.06 0-2.062.254-2.946.704-.285.145-.326.524-.1.75l.015.015c.16.16.407.19.611.09A5.5 5.5 0 0 1 8 10c.868 0 1.69.201 2.42.56.203.1.45.07.61-.091zM9.06 12.44c.196-.196.198-.52-.04-.66A2 2 0 0 0 8 11.5a2 2 0 0 0-1.02.28c-.238.14-.236.464-.04.66l.706.706a.5.5 0 0 0 .707 0l.707-.707z\"/>",
            terminal: "<path d=\"M0 3a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2zm9.5 5.5h-3a.5.5 0 0 0 0 1h3a.5.5 0 0 0 0-1m-6.354-.354a.5.5 0 1 0 .708.708l2-2a.5.5 0 0 0 0-.708l-2-2a.5.5 0 1 0-.708.708L4.793 6.5z\"/>",
            library: "<path d=\"M0 13a1.5 1.5 0 0 0 1.5 1.5h13A1.5 1.5 0 0 0 16 13V6a1.5 1.5 0 0 0-1.5-1.5h-13A1.5 1.5 0 0 0 0 6zM2 3a.5.5 0 0 0 .5.5h11a.5.5 0 0 0 0-1h-11A.5.5 0 0 0 2 3m2-2a.5.5 0 0 0 .5.5h7a.5.5 0 0 0 0-1h-7A.5.5 0 0 0 4 1\"/>",
            activity: "<path fill-rule=\"evenodd\" d=\"M6 2a.5.5 0 0 1 .47.33L10 12.036l1.53-4.208A.5.5 0 0 1 12 7.5h3.5a.5.5 0 0 1 0 1h-3.15l-1.88 5.17a.5.5 0 0 1-.94 0L6 3.964 4.47 8.171A.5.5 0 0 1 4 8.5H.5a.5.5 0 0 1 0-1h3.15l1.88-5.17A.5.5 0 0 1 6 2\"/>"
        };
        const body = paths[name] || paths.blocks;
        return '<svg class="game-svg ' + escapeHtml(className) + '" viewBox="0 0 16 16" fill="currentColor" aria-hidden="true" focusable="false">' + body + '</svg>';
    }

    function getAccountId() {
        if (typeof window.wcGetCurrentAccountId === 'function') {
            return String(window.wcGetCurrentAccountId() || 'default');
        }
        if (typeof appSettings !== 'undefined') {
            return String(appSettings.wc_current_user_id || appSettings.wc_current_user_phone || 'default');
        }
        return 'default';
    }

    function openDatabase(mode) {
        return new Promise((resolve, reject) => {
            const request = indexedDB.open(DB_NAME);
            request.onerror = () => reject(request.error || new Error('无法打开本地数据'));
            request.onsuccess = () => {
                const database = request.result;
                if (!database.objectStoreNames.contains(STORE_NAME)) {
                    database.close();
                    reject(new Error('本地数据结构尚未准备好'));
                    return;
                }
                resolve({ database, store: database.transaction(STORE_NAME, mode).objectStore(STORE_NAME) });
            };
        });
    }

    async function readRecord(id) {
        const { database, store } = await openDatabase('readonly');
        return new Promise((resolve, reject) => {
            const request = store.get(id);
            request.onsuccess = () => {
                database.close();
                resolve(request.result || null);
            };
            request.onerror = () => {
                database.close();
                reject(request.error || new Error('读取本地数据失败'));
            };
        });
    }

    async function writeRecord(value) {
        const { database, store } = await openDatabase('readwrite');
        return new Promise((resolve, reject) => {
            store.put(value);
            store.transaction.oncomplete = () => {
                database.close();
                if (typeof window.triggerAutoLocalBackup === 'function') window.triggerAutoLocalBackup();
                resolve();
            };
            store.transaction.onerror = () => {
                database.close();
                reject(store.transaction.error || new Error('保存本地数据失败'));
            };
        });
    }

    function normalizeState(value) {
        const accounts = value && typeof value.accounts === 'object' ? value.accounts : {};
        return { version: 1, accounts };
    }

    async function loadState() {
        const record = await readRecord(GAME_STORE_ID).catch(() => null);
        const normalized = normalizeState(record?.data || record);
        const accountId = getAccountId();
        if (!normalized.accounts[accountId] || typeof normalized.accounts[accountId] !== 'object') {
            normalized.accounts[accountId] = { minecraft: {} };
        }
        if (!normalized.accounts[accountId].minecraft) normalized.accounts[accountId].minecraft = {};
        return normalized;
    }

    async function saveState() {
        await writeRecord({ id: GAME_STORE_ID, data: state });
    }

    function currentMinecraft() {
        const accountId = getAccountId();
        if (!state.accounts[accountId]) state.accounts[accountId] = { minecraft: {} };
        if (!state.accounts[accountId].minecraft) state.accounts[accountId].minecraft = {};
        return state.accounts[accountId].minecraft;
    }

    function ensureStyles() {
        if (document.querySelector('[data-game-center-styles]')) return;
        const style = document.createElement('style');
        style.dataset.gameCenterStyles = 'true';
        style.textContent = `
            #gameCenterAppUI {
                --game-bg: #F3F3F3;
                --game-card: rgba(255,255,255,.6);
                --game-text: #242424;
                --game-secondary: #747474;
                --game-tertiary: #969696;
                --game-line: rgba(45,45,45,.085);
                --game-light-line: rgba(255,255,255,.76);
                --game-top-safe: max(env(safe-area-inset-top,0px),24px);
                background: var(--game-bg);
                color: var(--game-text);
                font-family: -apple-system, BlinkMacSystemFont, "SF Pro Display", "SF Pro Text", "PingFang SC", "Helvetica Neue", Arial, sans-serif;
                -webkit-font-smoothing: antialiased;
            }
            #gameCenterAppUI *,
            #gameCenterAppUI *::before,
            #gameCenterAppUI *::after { box-sizing: border-box; }
            #gameCenterAppUI button,
            #gameCenterAppUI a,
            #gameCenterAppUI input,
            #gameCenterAppUI select { -webkit-tap-highlight-color: transparent; }
            #gameCenterAppUI button { font-family: inherit; }
            #gameCenterAppUI button:focus-visible,
            #gameCenterAppUI a:focus-visible,
            #gameCenterAppUI input:focus-visible,
            #gameCenterAppUI select:focus-visible { outline: 2px solid #555; outline-offset: 3px; }
            .game-center-shell { position:relative; isolation:isolate; display:flex; flex-direction:column; height:100%; min-height:0; overflow:hidden; background:linear-gradient(180deg,#F6F6F6 0%,#F0F0F0 100%); }
            .game-center-scroll {
                flex: 1 1 auto;
                min-height: 0;
                overflow-x: hidden;
                overflow-y: auto;
                overscroll-behavior: contain;
                -webkit-overflow-scrolling: touch;
                padding: calc(var(--game-top-safe) + 27px) 19px calc(env(safe-area-inset-bottom,0px) + 43px);
                scroll-padding-bottom: 80px;
            }
            .game-center-hero { padding: 0 2px 27px; }
            .game-center-hero h1 {
                margin: 0;
                font-size: clamp(35px,10vw,43px);
                line-height: 1.16;
                font-weight: 760;
                letter-spacing: -.055em;
            }
            .game-center-exit {
                display: inline-block;
                max-width: 100%;
                margin: 0;
                padding: 0;
                border: 0;
                border-radius: 7px;
                color: #202020;
                background: transparent;
                font: inherit;
                font-weight: inherit;
                letter-spacing: inherit;
                line-height: inherit;
                text-align: left;
                cursor: pointer;
                touch-action: manipulation;
            }
            .game-center-exit:active { opacity: .55; }
            .game-center-eyebrow {
                display: flex;
                align-items: center;
                gap: 7px;
                margin-top: 13px;
                color: #7b7b7b;
                font-size: 10px;
                font-weight: 680;
                line-height: 1.4;
                letter-spacing: .13em;
            }
            .game-center-eyebrow .game-svg { width: 14px; height: 14px; }
            .game-center-hero p {
                margin: 7px 0 0;
                max-width: 31em;
                color: #747474;
                font-size: 13px;
                line-height: 1.55;
            }
            .game-feature-card { position:relative; display:flex; flex-direction:column; justify-content:space-between; width:100%; min-height:233px; overflow:hidden; padding:21px; border:1px solid #FFFFFF; border-radius:24px; background:#FFFFFF; color:#202020; text-align:left; box-shadow:0 7px 24px rgba(0,0,0,.045); cursor:pointer; touch-action:manipulation; }
            
            .game-feature-card:active { transform:scale(.992); background:#FAFAFA; }
            .game-feature-top,
            .game-feature-footer { position:relative; display:flex; align-items:center; justify-content:space-between; gap:12px; padding-top:14px; border-top:1px solid #EEEEEE; color:#363636; font-size:12px; font-weight:675; }
            .game-feature-kicker { color:#858585; font-size:10px; font-weight:730; letter-spacing:.12em; }
            .game-status-pill { display:inline-flex; align-items:center; gap:7px; min-height:27px; padding:0 11px; border:1px solid #E6E6E6; border-radius:999px; background:#F7F7F7; color:#727272; font-size:11px; font-weight:650; white-space:nowrap; }
            .game-status-pill::before,
            .game-library-state::before,
            .game-detail-status::before {
                content: "";
                width: 7px;
                height: 7px;
                flex: 0 0 auto;
                border-radius: 50%;
                background: #999;
            }
            .game-status-pill.is-online,
            .game-library-state.is-online,
            .game-detail-status.is-online { color: #333; }
            .game-status-pill.is-online::before,
            .game-library-state.is-online::before,
            .game-detail-status.is-online::before { background: #383838; }
            .game-status-pill.is-error,
            .game-library-state.is-error,
            .game-detail-status.is-error { color: #565656; font-weight: 730; }
            .game-status-pill.is-error::before,
            .game-library-state.is-error::before,
            .game-detail-status.is-error::before { background: #fff; border: 1.5px solid #555; }
            .game-status-pill.is-connecting,
            .game-library-state.is-connecting,
            .game-detail-status.is-connecting { color: #5c5c5c; }
            .game-status-pill.is-connecting::before,
            .game-library-state.is-connecting::before,
            .game-detail-status.is-connecting::before { background: #666; }
            .game-feature-main { display: block; position: relative; padding: 20px 0 16px; }
            .game-feature-icon,
            .game-library-icon,
            .game-detail-icon { display:grid; place-items:center; flex:0 0 auto; border:1px solid #333333; background:#272727; color:#FFFFFF; box-shadow:0 4px 11px rgba(0,0,0,.12); }
            .game-feature-icon { width:59px; height:59px; border-radius:17px; }
            .game-feature-icon .game-svg { width: 30px; height: 30px; }
            .game-feature-title { display:block; margin-top:15px; color:#202020; font-size:27px; font-weight:750; line-height:1.13; letter-spacing:-.04em; }
            .game-feature-subtitle { display:block; margin-top:6px; max-width:30em; color:#737373; font-size:12px; line-height:1.55; }
            .game-feature-footer {
                position: relative;
                padding-top: 14px;
                border-top: 1px solid rgba(65,65,65,.1);
                color: #393939;
                font-size: 12px;
                font-weight: 680;
            }
            .game-feature-footer .game-svg { width: 15px; height: 15px; }
            .game-section { margin-top: 29px; }
            .game-section + .game-section { margin-top: 29px; }
            .game-section-heading { display: flex; align-items: baseline; justify-content: space-between; gap: 12px; margin: 0 2px 12px; }
            .game-section-label { margin: 0; color: #2b2b2b; font-size: 18px; font-weight: 720; line-height: 1.2; letter-spacing: -.025em; }
            .game-section-meta { color: #858585; font-size: 11px; line-height: 1.35; white-space: nowrap; }
            .game-library-list,
            .game-panel { overflow:hidden; border:1px solid #FFFFFF; border-radius:21px; background:rgba(255,255,255,.87); box-shadow:0 5px 19px rgba(0,0,0,.035),inset 0 1px 0 #FFFFFF; -webkit-backdrop-filter:blur(18px) saturate(100%); backdrop-filter:blur(18px) saturate(100%); }
            .game-library-card {
                display: grid;
                grid-template-columns: 54px minmax(0,1fr) auto 15px;
                align-items: center;
                gap: 13px;
                width: 100%;
                min-height: 86px;
                padding: 14px;
                border: 0;
                background: transparent;
                color: #292929;
                text-align: left;
                cursor: pointer;
                touch-action: manipulation;
            }
            .game-library-card + .game-library-card { border-top:1px solid #EEEEEE; }
            .game-library-card:active { background:#F7F7F7; }
            .game-library-card.is-disabled { grid-template-columns: 54px minmax(0,1fr) auto; cursor: default; }
            .game-library-card.is-disabled:active { background: transparent; }
            .game-library-icon { width: 54px; height: 54px; border-radius: 16px; }
            .game-library-icon.is-muted { background:#E7E7E7; color:#979797; border:1px solid #E0E0E0; box-shadow:none; }
            .game-library-icon .game-svg { width: 24px; height: 24px; }
            .game-library-copy { min-width: 0; }
            .game-library-name { display: block; color: #303030; font-size: 15px; line-height: 1.25; font-weight: 675; }
            .game-library-description { display: block; margin-top: 5px; color: #858585; font-size: 11px; line-height: 1.4; }
            .game-library-state { display: inline-flex; align-items: center; gap: 6px; color: #7c7c7c; font-size: 10px; font-weight: 650; white-space: nowrap; }
            .game-library-chevron { display: grid; place-items: center; color: #a5a5a5; }
            .game-library-chevron .game-svg { width: 15px; height: 15px; }
            .game-library-footnote { margin: 11px 3px 0; color: #838383; font-size: 11px; line-height: 1.5; }
            .game-detail-scroll { padding-top: calc(var(--game-top-safe) + 16px); }
            .game-detail-back {
                display: inline-flex;
                align-items: center;
                gap: 5px;
                min-height: 36px;
                padding: 2px 10px 2px 0;
                border: 0;
                border-radius: 9px;
                background: transparent;
                color: #555;
                font-size: 14px;
                font-weight: 600;
                cursor: pointer;
                touch-action: manipulation;
            }
            .game-detail-back:active { opacity: .55; }
            .game-detail-back .game-svg { width: 15px; height: 15px; }
            .game-detail-intro { padding: 14px 2px 20px; }
            .game-detail-intro h1 { margin: 0; color: #242424; font-size: 34px; font-weight: 755; line-height: 1.12; letter-spacing: -.05em; }
            .game-detail-intro p { margin: 7px 0 0; color: #7c7c7c; font-size: 12px; line-height: 1.5; }
            .game-detail-stage { position:relative; min-height:162px; overflow:hidden; padding:19px; border:1px solid #FFFFFF; border-radius:24px; background:#FFFFFF; box-shadow:0 7px 24px rgba(0,0,0,.045); color:#232323; }
            
            .game-detail-stage-top { position: relative; z-index: 1; display: flex; align-items: center; justify-content: space-between; gap: 12px; }
            .game-detail-game-mark { display: inline-flex; align-items: center; gap: 8px; color: #828282; font-size: 10px; font-weight: 720; letter-spacing: .1em; }
            .game-detail-game-mark .game-svg { width: 15px; height: 15px; }
            .game-detail-stage-main { position: relative; z-index: 1; display: flex; align-items: flex-end; gap: 13px; margin-top: 35px; }
            .game-detail-icon { width: 62px; height: 62px; border-radius: 18px; }
            .game-detail-icon .game-svg { width: 28px; height: 28px; }
            .game-detail-copy { min-width: 0; flex: 1; }
            .game-detail-title { color: #333; font-size: 21px; font-weight: 720; line-height: 1.16; letter-spacing: -.035em; }
            .game-detail-subtitle { margin-top: 6px; color: #777; font-size: 12px; line-height: 1.4; }
            .game-detail-status { display: inline-flex; align-items: center; gap: 7px; margin-top: 10px; color: #747474; font-size: 11px; font-weight: 650; }
            .game-detail-meta-row { display:grid; grid-template-columns:repeat(2,minmax(0,1fr)); gap:11px; margin-top:13px; }
            .game-detail-meta-card { min-height:65px; min-width:0; padding:13px 14px; border:1px solid #FFFFFF; border-radius:17px; background:rgba(255,255,255,.88); box-shadow:0 3px 10px rgba(0,0,0,.025); -webkit-backdrop-filter:blur(12px) saturate(100%); backdrop-filter:blur(12px) saturate(100%); }
            .game-detail-meta-label { color: #909090; font-size: 10px; line-height: 1.2; font-weight: 645; }
            .game-detail-meta-value { margin-top: 6px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; color: #333; font-size: 13px; line-height: 1.3; font-weight: 660; }
            .game-panel { margin-top: 17px; }
            .game-panel-heading { padding: 18px 17px 15px; }
            .game-panel-title { margin: 0; color: #2e2e2e; font-size: 17px; line-height: 1.3; font-weight: 715; letter-spacing: -.025em; }
            .game-panel-description { margin: 5px 0 0; color: #838383; font-size: 12px; line-height: 1.55; }
            .game-center-form,
            .game-steps,
            .game-resource-list { border-top:1px solid #EEEEEE; }
            .game-center-field { min-height:62px; display:grid; grid-template-columns:29px minmax(95px,.8fr) minmax(0,1.2fr); align-items:center; gap:9px; margin-left:17px; padding:8px 17px 8px 0; border-bottom:1px solid #EEEEEE; }
            .game-center-field-icon { display:grid; place-items:center; width:29px; height:29px; border:1px solid #E7E7E7; border-radius:9px; background:#EEEEEE; color:#626262; }
            .game-center-field-icon .game-svg { width: 16px; height: 16px; }
            .game-center-field-label { color: #424242; font-size: 13px; line-height: 1.35; font-weight: 610; }
            .game-center-input,
            .game-center-select {
                width: 100%; min-width: 0; border: 0; outline: 0; padding: 9px 0;
                background: transparent; color: #303030; font: inherit; font-size: 13px;
                text-align: right; -webkit-appearance: none; appearance: none;
            }
            .game-center-input::placeholder { color: #aaa; }
            .game-center-select { color: #696969; }
            .game-center-field:focus-within .game-center-field-icon,
            .game-center-field:focus-within .game-center-field-label { color: #333; }
            .game-center-help { margin: 0; padding: 13px 17px 0; color: #818181; font-size: 11px; line-height: 1.6; }
            .stardew-status-copy { margin:0; padding:0 17px 10px; font-size:13px; line-height:1.6; color:var(--game-secondary); }
            .game-center-actions { display: flex; flex-wrap: wrap; gap: 10px; padding: 15px 17px 18px; }
            .game-center-actions > .game-center-button { flex: 1 1 105px; }
            .game-center-button { min-height:46px; padding:10px 12px; border:1px solid #222222; border-radius:14px; background:#242424; color:#FFFFFF; font:inherit; font-size:13px; font-weight:670; cursor:pointer; touch-action:manipulation; box-shadow:0 3px 8px rgba(0,0,0,.085); }
            .game-center-button.secondary { border:1px solid #E4E4E4; background:#F2F2F2; color:#2C2C2C; box-shadow:none; }
            .game-center-button:active { transform: scale(.99); opacity: .82; }
            .game-center-button:disabled { cursor: default; opacity: .46; }
            .game-step { display: grid; grid-template-columns: 35px minmax(0,1fr); gap: 11px; padding: 14px 17px; }
            .game-step + .game-step { border-top:1px solid #EEEEEE; }
            .game-step-index { display:grid; place-items:center; width:32px; height:32px; border:1px solid #E7E7E7; border-radius:10px; background:#EEEEEE; color:#565656; font-size:11px; line-height:1; font-weight:750; }
            .game-step-title { color: #393939; font-size: 13px; line-height: 1.35; font-weight: 660; }
            .game-step-copy { margin-top: 4px; color: #7a7a7a; font-size: 12px; line-height: 1.55; }
            .game-resource-link,
            .game-resource-button {
                display: grid; grid-template-columns: minmax(0,1fr) 21px;
                align-items: center; gap: 10px; width: calc(100% - 17px); min-height: 53px;
                margin-left: 17px; padding: 10px 17px 10px 0; border: 0;
                border-bottom: 1px solid var(--game-line); background: transparent;
                color: #393939; font: inherit; font-size: 13px; line-height: 1.4;
                text-align: left; text-decoration: none; cursor: pointer;
            }
            .game-resource-link:active,
            .game-resource-button:active { opacity: .56; }
            .game-resource-list > :last-child { border-bottom: 0; }
            .game-resource-link .game-svg,
            .game-resource-button .game-svg { width: 16px; height: 16px; color: #888; }
            .game-resource-meta { display: block; margin-top: 3px; color: #989898; font-size: 11px; }
            .game-center-note { margin: 12px 3px 0; color: #808080; font-size: 11px; line-height: 1.6; }
            .game-center-note a { color:#404040; text-decoration:underline; text-underline-offset:2px; }
            .game-center-notice {
                position: absolute; left: 50%; bottom: calc(env(safe-area-inset-bottom,0px) + 21px);
                z-index: 8; max-width: calc(100% - 40px);
                transform: translateX(-50%) translateY(10px); padding: 10px 15px;
                border: 1px solid rgba(255,255,255,.29); border-radius: 16px;
                background: rgba(42,42,42,.87); color: #fff;
                box-shadow: 0 9px 28px rgba(20,20,20,.15);
                font-size: 12px; line-height: 1.4; text-align: center;
                opacity: 0; pointer-events: none;
                transition: opacity .18s ease,transform .18s ease;
                -webkit-backdrop-filter: blur(16px);
                backdrop-filter: blur(16px);
            }
            .game-center-notice.is-visible { opacity: 1; transform: translateX(-50%) translateY(0); }
            .game-svg { display: block; flex-shrink: 0; }
            @media (max-width: 360px) {
                .game-center-scroll { padding-left: 13px; padding-right: 13px; }
                .game-feature-card { min-height: 220px; padding: 17px; border-radius: 22px; }
                .game-library-card { grid-template-columns: 48px minmax(0,1fr) 16px; gap: 9px; padding: 12px; }
                .game-library-card.is-disabled { grid-template-columns: 48px minmax(0,1fr) auto; }
                .game-library-icon { width: 48px; height: 48px; border-radius: 14px; }
                .game-library-state { display: none; }
                .game-center-field { grid-template-columns: 26px minmax(76px,.75fr) minmax(0,1.25fr); gap: 6px; }
                .game-center-field-label, .game-center-input, .game-center-select { font-size: 12px; }
                .game-center-actions { grid-template-columns: 1fr; }
            }
            @media (prefers-reduced-motion: reduce) {
                .game-feature-card, .game-center-exit, .game-center-button, .game-center-notice { transition: none; }
            }
        `;
        document.head.appendChild(style);
    }

    function getContacts() {
        const globalContacts = typeof wcContactsList !== 'undefined' && Array.isArray(wcContactsList)
            ? wcContactsList
            : [];
        const windowContacts = Array.isArray(window.wcContactsList) ? window.wcContactsList : [];
        const contacts = [...globalContacts, ...windowContacts];
        const seen = new Set();
        return contacts.filter(contact => {
            if (!contact || !contact.id || seen.has(String(contact.id))) return false;
            seen.add(String(contact.id));
            return true;
        }).map(contact => ({
            id: String(contact.id),
            name: String(contact.remark || contact.name || '未命名角色'),
            avatar: String(contact.avatar || '')
        }));
    }

    function showNotice(message, isError = false) {
        const notice = root?.querySelector('[data-game-center-notice]');
        if (!notice) return;
        notice.textContent = message;
        notice.style.background = isError ? 'rgba(35,35,35,.95)' : 'rgba(50,50,50,.88)';
        notice.classList.add('is-visible');
        clearTimeout(noticeTimer);
        noticeTimer = setTimeout(() => notice.classList.remove('is-visible'), 2600);
    }

    function connectionMeta(minecraft) {
        if (minecraft.status === 'online') return { label: '已连接', className: 'is-online' };
        if (minecraft.status === 'connecting') return { label: '正在连接', className: 'is-connecting' };
        if (minecraft.status === 'reconnecting') return { label: '正在恢复', className: 'is-connecting' };
        if (minecraft.status === 'error') return { label: '连接失败', className: 'is-error' };
        return { label: '未连接', className: '' };
    }

    function renderLibraryPage(minecraft) {
        const connection = connectionMeta(minecraft);
        const availableGames = GAME_CATALOG.filter(game => game.available);
        const upcomingGames = GAME_CATALOG.filter(game => !game.available);
        const primaryGame = availableGames[0];
        return `
            <div class="game-center-shell">
                <main class="game-center-scroll">
                    <section class="game-center-hero">
                        <h1><button class="game-center-exit" type="button" data-game-action="close" aria-label="退出游戏中心">游戏中心</button></h1>
                        <div class="game-center-eyebrow">${svgIcon('controller')} GAME CENTER</div>
                        <p>与角色一起探索游戏世界</p>
                    </section>

                    ${primaryGame ? `
                        <button class="game-feature-card" type="button" data-game-action="open-game" data-game-id="${escapeHtml(primaryGame.id)}">
                            <span class="game-feature-top">
                                <span class="game-feature-kicker">精选游戏</span>
                                <span class="game-status-pill ${connection.className}">${connection.label}</span>
                            </span>
                            <span class="game-feature-main">
                                <span class="game-feature-icon">${svgIcon(primaryGame.icon)}</span>
                                <span class="game-feature-title">${escapeHtml(primaryGame.name)}</span>
                                <span class="game-feature-subtitle">${escapeHtml(primaryGame.description)}</span>
                            </span>
                            <span class="game-feature-footer">
                                <span>进入游戏</span>
                                ${svgIcon('chevron')}
                            </span>
                        </button>
                    ` : ''}

                    <section class="game-section" aria-labelledby="game-center-library-title">
                        <div class="game-section-heading">
                            <div class="game-section-label" id="game-center-library-title">游戏库</div>
                            <div class="game-section-meta">${availableGames.length} 个可用游戏</div>
                        </div>
                        <div class="game-library-list">
                            ${availableGames.map(game => `
                                <button class="game-library-card" type="button" data-game-action="open-game" data-game-id="${escapeHtml(game.id)}">
                                    <span class="game-library-icon">${svgIcon(game.icon)}</span>
                                    <span class="game-library-copy">
                                        <span class="game-library-name">${escapeHtml(game.name)}</span>
                                        <span class="game-library-description">${escapeHtml(game.subtitle)}</span>
                                    </span>
                                    <span class="game-library-state ${game.id === 'stardew' ? connectionMeta(currentStardew()).className : connection.className}">${game.id === 'stardew' ? connectionMeta(currentStardew()).label : connection.label}</span>
                                    <span class="game-library-chevron">${svgIcon('chevron')}</span>
                                </button>
                            `).join('')}
                        </div>
                    </section>

                    <section class="game-section" aria-labelledby="game-center-upcoming-title">
                        <div class="game-section-heading">
                            <div class="game-section-label" id="game-center-upcoming-title">即将加入</div>
                            <div class="game-section-meta">持续扩展</div>
                        </div>
                        <div class="game-library-list">
                            ${upcomingGames.map(game => `
                                <div class="game-library-card is-disabled">
                                    <span class="game-library-icon is-muted">${svgIcon(game.icon)}</span>
                                    <span class="game-library-copy">
                                        <span class="game-library-name">${escapeHtml(game.name)}</span>
                                        <span class="game-library-description">${escapeHtml(game.description)}</span>
                                    </span>
                                    <span class="game-library-state">${escapeHtml(game.subtitle)}</span>
                                </div>
                            `).join('')}
                        </div>
                        <p class="game-library-footnote">更多游戏正在准备中，敬请期待。</p>
                    </section>
                </main>
                <div class="game-center-notice" data-game-center-notice role="status"></div>
            </div>
        `;
    }

    function renderMinecraftPage(minecraft, contacts) {
        const selectedContact = String(minecraft.contactId || '');
        const connection = connectionMeta(minecraft);
        const selectedContactData = contacts.find(contact => contact.id === selectedContact) || null;
        const contactOptions = contacts.length
            ? contacts.map(contact => `<option value="${escapeHtml(contact.id)}" ${contact.id === selectedContact ? 'selected' : ''}>${escapeHtml(contact.name)}</option>`).join('')
            : '<option value="">请先在联系人中创建角色</option>';
        const isConnecting = minecraft.status === 'connecting';
        const roleLabel = selectedContactData?.name || '尚未选择';
        const companionLabel = String(minecraft.companion || '').trim() || '尚未设置';

        return `
            <div class="game-center-shell">
                <main class="game-center-scroll game-detail-scroll">
                    <button class="game-detail-back" type="button" data-game-action="back-library" aria-label="返回游戏库">
                        ${svgIcon('back')}<span>返回游戏库</span>
                    </button>
                    <section class="game-detail-intro">
                        <h1>我的世界</h1>
                        <p>连接角色与游戏世界</p>
                    </section>
                    <section class="game-detail-stage">
                        <div class="game-detail-stage-top">
                            <span class="game-detail-game-mark">${svgIcon('controller')} 游戏资料</span>
                            <span class="game-status-pill ${connection.className}">${connection.label}</span>
                        </div>
                        <div class="game-detail-stage-main">
                            <div class="game-detail-icon">${svgIcon('blocks')}</div>
                            <div class="game-detail-copy">
                                <div class="game-detail-title">我的世界</div>
                                <div class="game-detail-subtitle">Numen AI 同伴</div>
                            </div>
                        </div>
                    </section>

                    <div class="game-detail-meta-row">
                        <div class="game-detail-meta-card">
                            <div class="game-detail-meta-label">当前角色</div>
                            <div class="game-detail-meta-value">${escapeHtml(roleLabel)}</div>
                        </div>
                        <div class="game-detail-meta-card">
                            <div class="game-detail-meta-label">游戏同伴</div>
                            <div class="game-detail-meta-value">${escapeHtml(companionLabel)}</div>
                        </div>
                    </div>

                    <section class="game-panel" aria-labelledby="minecraft-connection-title">
                        <div class="game-panel-heading">
                            <h2 class="game-panel-title" id="minecraft-connection-title">连接设置</h2>
                            <p class="game-panel-description">连接电脑上的 Bridge，并指定进入世界的角色与 Numen 同伴。</p>
                        </div>
                        <form class="game-center-form" data-game-form>
                            <label class="game-center-field">
                                <span class="game-center-field-icon">${svgIcon('server')}</span>
                                <span class="game-center-field-label">电脑地址</span>
                                <input class="game-center-input" name="endpoint" type="url" inputmode="url" placeholder="http://127.0.0.1:8787/mcp" value="${escapeHtml(minecraft.endpoint || '')}" required>
                            </label>
                            <label class="game-center-field">
                                <span class="game-center-field-icon">${svgIcon('key')}</span>
                                <span class="game-center-field-label">连接密码</span>
                                <input class="game-center-input" name="token" type="password" autocomplete="off" placeholder="粘贴 Bridge 访问令牌" value="${escapeHtml(minecraft.token || '')}" required>
                            </label>
                            <label class="game-center-field">
                                <span class="game-center-field-icon">${svgIcon('user')}</span>
                                <span class="game-center-field-label">一起玩的角色</span>
                                <select class="game-center-select" name="contactId">${contactOptions}</select>
                            </label>
                            <label class="game-center-field">
                                <span class="game-center-field-icon">${svgIcon('cube')}</span>
                                <span class="game-center-field-label">同伴名字</span>
                                <input class="game-center-input" name="companion" type="text" autocomplete="off" placeholder="例如：小鹿" value="${escapeHtml(minecraft.companion || '')}" required>
                            </label>
                            <p class="game-center-help">同一台电脑玩：填写 http://127.0.0.1:8787/mcp；手机连接电脑：填电脑的局域网 IP，双方需处于同一网络。密码填写启动 Bridge 时自行设置的访问令牌，不是 Numen 令牌，也不是模型 API Key。</p>
                            <div class="game-center-actions">
                                <button class="game-center-button" type="submit" data-game-action="save-test" ${isConnecting ? 'disabled' : ''}>${isConnecting ? '正在连接' : '保存并测试'}</button>
                                <button class="game-center-button secondary" type="button" data-game-action="open-chat">打开聊天</button>
                                ${['online', 'reconnecting'].includes(minecraft.status) ? '<button class="game-center-button secondary" type="button" data-game-action="disconnect">断开连接</button>' : ''}
                            </div>
                        </form>
                    </section>

                    <section class="game-panel" aria-labelledby="minecraft-setup-title">
                        <div class="game-panel-heading">
                            <h2 class="game-panel-title" id="minecraft-setup-title">首次连接</h2>
                            <p class="game-panel-description">第一次使用时完成一次环境准备，后续直接连接即可。</p>
                        </div>
                        <div class="game-steps">
                            <div class="game-step"><div class="game-step-index">01</div><div><div class="game-step-title">准备电脑端环境</div><div class="game-step-copy">安装 Minecraft Java、Fabric、Fabric API 和 Numen。手机端不需要安装 Minecraft。</div></div></div>
                            <div class="game-step"><div class="game-step-index">02</div><div><div class="game-step-title">打开 Numen 外接大脑</div><div class="game-step-copy">进入一个世界后按 G，在设置中打开外接大脑 MCP。</div></div></div>
                            <div class="game-step"><div class="game-step-index">03</div><div><div class="game-step-title">运行童话集连接程序</div><div class="game-step-copy">启动 Bridge，自己设置 Bridge 访问令牌。启动窗口会显示连接地址；Numen 令牌仅留在电脑端。</div></div></div>
                            <div class="game-step"><div class="game-step-index">04</div><div><div class="game-step-title">保存并测试</div><div class="game-step-copy">填写连接信息并测试。成功后回到所选角色聊天，即可让角色陪你进入 Minecraft。</div></div></div>
                        </div>
                    </section>

                    <section class="game-panel" aria-labelledby="minecraft-resources-title">
                        <div class="game-panel-heading">
                            <h2 class="game-panel-title" id="minecraft-resources-title">下载与说明</h2>
                            <p class="game-panel-description">电脑端所需组件与项目说明集中放在这里。</p>
                        </div>
                        <div class="game-resource-list">
                            <a class="game-resource-link" href="https://www.minecraft.net/download" target="_blank" rel="noopener noreferrer"><span>Minecraft Java 启动器<span class="game-resource-meta">Minecraft 官方下载</span></span>${svgIcon('external')}</a>
                            <a class="game-resource-link" href="https://fabricmc.net/use/installer/" target="_blank" rel="noopener noreferrer"><span>Fabric 安装器<span class="game-resource-meta">安装模组加载器</span></span>${svgIcon('external')}</a>
                            <a class="game-resource-link" href="https://modrinth.com/mod/fabric-api" target="_blank" rel="noopener noreferrer"><span>Fabric API<span class="game-resource-meta">选择 Minecraft 1.21.1</span></span>${svgIcon('external')}</a>
                            <a class="game-resource-link" href="https://github.com/Dwinovo/minecraft-numen/releases" target="_blank" rel="noopener noreferrer"><span>Numen<span class="game-resource-meta">选择 Minecraft 1.21.1</span></span>${svgIcon('external')}</a>
                            <button class="game-resource-button" type="button" data-game-action="open-bridge-guide"><span>童话集 Bridge 连接说明<span class="game-resource-meta">查看电脑端连接教程</span></span>${svgIcon('external')}</button>
                            <button class="game-resource-button" type="button" data-game-action="open-numen-docs"><span>Numen 项目说明<span class="game-resource-meta">查看快速开始文档</span></span>${svgIcon('external')}</button>
                        </div>
                    </section>
                    <p class="game-center-note">如果 Java 或 Fabric 安装器无法运行，可以安装 <a href="https://adoptium.net/temurin/releases/?version=21" target="_blank" rel="noopener noreferrer">Java 21</a>。Fabric API 和 Numen 的 jar 文件需要放入 Minecraft 的 mods 文件夹。</p>
                </main>
                <div class="game-center-notice" data-game-center-notice role="status"></div>
            </div>
        `;
    }

    function currentStardew() {
        const account = getAccountId();
        if (!state.accounts[account]) state.accounts[account] = { minecraft: {} };
        if (!state.accounts[account].stardew) state.accounts[account].stardew = {};
        return state.accounts[account].stardew;
    }

    function stardewBinding(s) {
        return { bindingId: s.bindingId, sessionId: s.sessionId, saveId: s.saveId, companionId: s.companionId };
    }

    function stardewTaskText(task) {
        if (!task) return '暂无任务';
        const statuses = { accepted: '已接收', running: '进行中', succeeded: '已完成', failed: '未完成', cancelled: '已停止' };
        const reasons = { following: '正在跟随', watering: '正在浇水', watering_can_empty: '水壶没水了', stamina_empty: '体力不足',
            moving_to_work: '正在走门口前往工作地点', moving_to_exit: '正在走向门口', moving_to_crop: '正在走近作物',
            moving_to_resource: '正在走近目标', chopping: '正在砍树和树桩', mining: '正在挖石头和矿石', waiting_for_tree_fall: '正在等待树木倒下',
            waiting_for_path: '道路受阻，正在重试', no_map_route: '暂时找不到地图出口路线，正在重试',
            exit_path_blocked: '门口道路受阻，正在重试', work_map_unreachable: '无法到达工作地图', some_targets_unreachable: '部分目标无法到达',
            game_paused_waiting: '等待关闭菜单或恢复游戏', game_saving: '游戏正在保存，请稍后再试', appearance_updated: '外观已更新',
            no_path: '找不到可走的路', path_blocked: '道路被挡住了', no_follow_path: '无法走到你附近', follow_path_blocked: '跟随路线被挡住',
            map_entry_blocked: '新地图入口被挡住', location_changed: '地图改变，任务已停止', target_unavailable: '目标已不在原处',
            user_stopped: '你要求停止了', connection_lost: '连接中断', saving: '保存游戏时停止', day_ended: '当天结束', new_day: '新的一天',
            world_exited: '已退出存档', replaced_by_new_task: '已切换任务', all_selected_targets_resolved: '范围内目标已处理',
            no_unwatered_crops_in_range: '范围内没有需要浇水的作物', watering_not_confirmed: '游戏尚未确认浇水生效',
            no_resource_targets_in_range: '范围内没有可处理的目标', axe_missing: '同伴没有斧头', pickaxe_missing: '同伴没有镐子',
            resource_tool_failed: '工具调用失败', resource_not_confirmed: '工具未生效，目标可能受保护或需要升级工具',
            resource_hit_limit: '目标连续受击未完成，已停止', tree_fall_timeout: '树木倒下过程异常',
            different_location_follow_first: '请先让同伴跟到当前地图', task_time_limit: '任务耗时过长', executor_error: '执行出现错误' };
        const progress = task.action === 'water' ? ` · 已浇 ${task.completed}/${task.total} 格${task.skipped ? `，跳过 ${task.skipped} 格已浇目标` : ''}${task.blocked ? `，${task.blocked} 格无法到达` : ''}` : '';
        const resources = ['chop', 'mine'].includes(task.action) ? ` · 已处理 ${task.completed}/${task.total} 个${task.skipped ? `，跳过 ${task.skipped} 个目标` : ''}${task.blocked ? `，${task.blocked} 个无法到达` : ''}` : '';
        const reason = reasons[String(task.reason || '').split(':')[0]];
        return (statuses[task.status] || '状态待确认') + progress + resources + (reason ? ' · ' + reason : '');
    }

    function renderStardewPage(s, contacts) {
        const meta = connectionMeta(s);
        const options = '<option value="">选择一起玩的角色</option>' + contacts.map(c => `<option value="${escapeHtml(c.id)}" ${c.id === s.contactId ? 'selected' : ''}>${escapeHtml(c.name)}</option>`).join('');
        const task = s.world?.companion?.task;
        const taskLabel = stardewTaskText(task);
        const skinOptions = stardewSkins.map(([id, name]) => `<option value="${id}" ${id === (s.skinByContact?.[s.contactId] || 'default') ? 'selected' : ''}>${name}</option>`).join('');
        return `<div class="game-center-shell"><main class="game-center-scroll game-detail-scroll">
            <button class="game-detail-back" type="button" data-game-action="back-library">${svgIcon('back')}<span>返回游戏库</span></button>
            <section class="game-detail-intro"><h1>星露谷物语</h1><p>单窗口 AI 同伴</p></section>
            <section class="game-detail-stage"><div class="game-detail-stage-top"><span class="game-detail-game-mark">${svgIcon('controller')} 一起生活</span><span class="game-status-pill ${meta.className}">${meta.label}</span></div>
            <div class="game-detail-stage-main"><div class="game-detail-icon">${svgIcon('controller')}</div><div class="game-detail-copy"><div class="game-detail-title">星露谷物语</div><div class="game-detail-subtitle">游戏内聊天、跟随、浇水、换外观、停止</div></div></div></section>
            <section class="game-panel"><div class="game-panel-heading"><h2 class="game-panel-title">连接设置</h2><p class="game-panel-description">在这台电脑启动游戏和连接程序，然后选择角色。</p></div>
            <form class="game-center-form" data-stardew-form>
            <label class="game-center-field"><span class="game-center-field-icon">${svgIcon('server')}</span><span class="game-center-field-label">连接地址</span><input class="game-center-input" name="endpoint" type="url" value="${escapeHtml(s.endpoint || 'http://127.0.0.1:17832/mcp')}"></label>
            <label class="game-center-field"><span class="game-center-field-icon">${svgIcon('key')}</span><span class="game-center-field-label">连接密码</span><input class="game-center-input" name="token" type="password" autocomplete="off" value="${escapeHtml(s.token || '')}"></label>
            <label class="game-center-field"><span class="game-center-field-icon">${svgIcon('user')}</span><span class="game-center-field-label">一起玩的角色</span><select class="game-center-select" name="contactId">${options}</select></label>
            <label class="game-center-field"><span class="game-center-field-icon">${svgIcon('user')}</span><span class="game-center-field-label">游戏外观</span><select class="game-center-select" name="skin">${skinOptions}</select></label>
            <div class="game-center-actions"><button class="game-center-button" type="button" data-game-action="stardew-test" ${s.status === 'connecting' ? 'disabled' : ''}>${s.status === 'connecting' ? '连接中' : '保存并测试'}</button><button class="game-center-button secondary" type="button" data-game-action="stardew-disconnect">断开</button></div>
            <div class="game-center-actions"><button class="game-center-button secondary" type="button" data-game-action="stardew-skin" ${s.status !== 'online' ? 'disabled' : ''}>应用外观</button></div>
            </form></section>
            <section class="game-panel"><div class="game-panel-heading"><h2 class="game-panel-title">游戏状态</h2><p class="game-panel-description" data-stardew-status>${escapeHtml(s.error || taskLabel)}</p></div>
            <p class="stardew-status-copy" data-stardew-position>${escapeHtml(s.world?.companion ? `${s.world.companion.name} · ${s.world.companion.location} (${s.world.companion.x}, ${s.world.companion.y}) · 水量 ${s.world.companion.waterLeft} · 体力 ${Math.round(s.world.companion.stamina)} · 持续跟随${s.world.companion.followEnabled ? "开" : "关"}` : '请先进入存档并关闭游戏菜单。')}</p>
            <p class="stardew-status-copy" data-stardew-timing>${escapeHtml(stardewTimingText(s.lastChatTiming))}</p>
            <div class="game-center-actions"><button class="game-center-button secondary" type="button" data-game-action="stardew-stop">停止游戏任务</button><button class="game-center-button secondary" type="button" data-game-action="open-chat">打开聊天</button></div></section>
            <section class="game-panel"><div class="game-panel-heading"><h2 class="game-panel-title">使用说明</h2><p class="game-panel-description">连接成功后，在游戏里点击同伴或按 F6，用原生输入框聊天，角色回复会显示在游戏原生对话框。网页与连接程序需要保持后台开启，网页会持续接收游戏消息，无需每句重新连接。游戏内头像来自所选外观的立绘；和童话集联系人头像分开。选择游戏外观后点“应用外观”，也可在连接时一起应用。暂停时工作会等待游戏恢复。游戏聊天读取角色人设与相关记忆，不读取世界书。也可以回所选角色的微信聊天，说“跟我来”“帮我浇水”“帮我砍树”“帮我挖矿”“停一下”。游戏左上角可以开关持续跟随，快捷指挥按钮或 F7 可以直接下达浇水、砍树、挖石头/矿石与停止指令，不等模型回复。工作默认处理你附近 20 格内的目标；同伴会沿真实门口和地图出口逐段过来。受阻会重试，无法到达的格数会报告。已开启的跟随在干完活后继续。砍树跳过果树、幼树和挂采集器的树；挖矿处理当前地图的普通石头与矿石。掉落物留在地上，可由你拾取；不会自主下矿层、打怪或升级工具。缺水、体力不足或工具未生效会停止工作并报告。</p></div><p class="game-library-footnote">0.6.0 已完成真实引用编译；用户已确认上一版浇水成功，本版跨地图赶路、砍树与挖石头仍需实机验收。连接程序仅供同电脑使用；浏览器询问本地网络访问时，需允许当前童话机网站。</p></section>
            </main><div class="game-center-notice" data-game-center-notice role="status"></div></div>`;
    }

    async function stardewHttp(s, route, body, signal) {
        const url = new URL(s.endpoint);
        const controller = new AbortController();
        const abort = () => controller.abort();
        signal?.addEventListener('abort', abort, { once: true });
        if (signal?.aborted) controller.abort();
        const timer = setTimeout(abort, 10000);
        try {
            const response = await fetch(url.origin + route, { method: 'POST', headers: { 'Content-Type': 'application/json', Authorization: 'Bearer ' + s.token }, body: JSON.stringify(body), signal: controller.signal });
            const data = await response.json();
            if (!response.ok) throw new Error(typeof data.error === 'string' ? data.error : '本地连接程序请求失败');
            return data;
        } catch (error) {
            if (controller.signal.aborted && !signal?.aborted) throw new Error('本地连接超时，游戏执行状态未确认');
            throw error;
        } finally { clearTimeout(timer); signal?.removeEventListener('abort', abort); }
    }

    async function saveStardewMcp(s) {
        const record = await readRecord('mcpAppData').catch(() => null);
        const data = record?.data || { version: 1, configurations: [], presets: [] };
        const configs = Array.isArray(data.configurations) ? data.configurations : [];
        const item = { id: 'stardew-companion', name: 'Stardew Companion', url: s.endpoint, transport: 'streamable-http', enabled: true,
            headers: [{ key: 'Authorization', value: 'Bearer ' + s.token }], updatedAt: Date.now() };
        const index = configs.findIndex(c => c?.id === item.id);
        if (index >= 0) configs[index] = item; else configs.push(item);
        await writeRecord({ id: 'mcpAppData', data: { ...data, configurations: configs } });
    }

    async function connectStardew() {
        const form = root.querySelector('[data-stardew-form]');
        const endpoint = String(form?.elements.endpoint?.value || '').trim();
        const token = String(form?.elements.token?.value || '').trim();
        const contactId = String(form?.elements.contactId?.value || '');
        const skin = String(form?.elements.skin?.value || 'default');
        const contact = getContacts().find(c => c.id === contactId);
        const url = new URL(endpoint);
        if (!['127.0.0.1', 'localhost'].includes(url.hostname) || url.pathname !== '/mcp' || url.protocol !== 'http:' || url.username || url.password || url.search || url.hash)
            throw new Error('请使用连接程序显示的同电脑地址，例如 http://127.0.0.1:17832/mcp');
        if (!token || !contact) throw new Error('请填写连接密码并选择角色');
        const previous = { ...currentStardew() };
        if (previous.bindingId && previous.status === 'online' && (previous.contactId !== contactId || previous.endpoint !== endpoint || previous.token !== token)) await disconnectStardew();
        stopStardewPolling();
        const epoch = stardewEpoch;
        const accountId = getAccountId();
        const s = currentStardew();
        Object.assign(s, { endpoint, token, contactId, clientId: s.clientId || crypto.randomUUID(), status: 'connecting', error: '' });
        await saveState(); render();
        const controller = new AbortController(); stardewController = controller;
        let bound;
        try {
            bound = await stardewHttp(s, '/bind', { accountId, contactId, clientId: s.clientId, displayName: contact.name.slice(0, 40), skin }, controller.signal);
            if (controller.signal.aborted || epoch !== stardewEpoch || accountId !== getAccountId()) {
                await stardewHttp(s, '/disconnect', stardewBinding(bound)).catch(() => {}); return;
            }
            if (!bound.bindingId || !bound.sessionId || !bound.saveId || bound.companionId !== 'tonghuaji-companion' || !bound.state?.companion)
                throw new Error('同伴生成或绑定未确认');
            Object.assign(s, stardewBinding(bound), { world: bound.state, status: 'online', updatedAt: Date.now(), error: '' });
            s.skinByContact = { ...s.skinByContact, [contactId]: skin };
            await saveState(); await saveStardewMcp(s);
            startStardewPolling(); render(); showNotice('已绑定角色和当前存档');
        } catch (error) {
            if (epoch !== stardewEpoch || accountId !== getAccountId()) return;
            if (bound?.bindingId) await stardewHttp(s, '/disconnect', stardewBinding(bound)).catch(() => {});
            s.status = 'error'; s.error = error.message; s.bindingId = ''; await saveState(); render(); throw error;
        } finally { if (stardewController === controller) stardewController = null; }
    }

    function stopStardewPolling() {
        if (stardewTimer) clearInterval(stardewTimer);
        stardewTimer = null; stardewEpoch++;
        stardewController?.abort(); stardewController = null;
        stardewChatController?.abort();
        stardewWatchController?.abort(); stardewWatchController = null;
    }

    function startStardewPolling() {
        if (stardewTimer) return;
        stardewAccount = getAccountId();
        void watchStardew();
        stardewTimer = setInterval(() => { if (!stardewWatchController) void watchStardew(); }, 3000);
    }

    async function pollStardew() {
        if (stardewBusy || !state) return;
        const s = currentStardew();
        if (s.status !== 'online' || !s.bindingId) return;
        const account = getAccountId(), epoch = stardewEpoch, snapshot = { ...s };
        const controller = new AbortController(); stardewController = controller; stardewBusy = true;
        try {
            const world = await stardewHttp(snapshot, '/heartbeat', stardewBinding(snapshot), controller.signal);
            if (controller.signal.aborted || epoch !== stardewEpoch || account !== getAccountId()) return;
            await applyStardewWorld(world, s, snapshot, account, epoch);
        } catch (error) {
            if (controller.signal.aborted || epoch !== stardewEpoch || account !== getAccountId()) return;
            await stardewConnectionError(error, s);
        } finally { stardewBusy = false; if (stardewController === controller) stardewController = null; }
    }

    function stardewTimingText(timing) {
        if (!timing) return '回复耗时将在下一次游戏聊天后显示。';
        const seconds = ms => (Math.max(0, Number(ms) || 0) / 1000).toFixed(1);
        return `上次回复 ${seconds(timing.totalMs)} 秒 · 准备 ${seconds(timing.prepareMs)} 秒 · 模型 ${seconds(timing.modelMs)} 秒 · 工具 ${seconds(timing.toolMs)} 秒`;
    }

    async function applyStardewSkin() {
        const s = currentStardew(), form = root.querySelector('[data-stardew-form]');
        if (s.status !== 'online' || form?.elements.contactId?.value !== s.contactId) throw new Error('请先连接要设置外观的角色');
        const skin = String(form.elements.skin.value);
        const account = getAccountId(), epoch = stardewEpoch, snapshot = { ...s };
        const result = await stardewHttp(snapshot, '/appearance', { ...stardewBinding(snapshot), skin });
        if (epoch !== stardewEpoch || account !== getAccountId() || s.bindingId !== snapshot.bindingId) return;
        if (result.receipt?.status !== 'succeeded' || result.state?.companion?.skin !== skin) throw new Error('游戏尚未确认外观更新');
        s.skinByContact = { ...s.skinByContact, [s.contactId]: skin }; s.world = result.state;
        await saveState(); showNotice('外观和对话头像已更新');
    }

    async function stardewConnectionError(error, s) {
        if (/binding_mismatch|world_session_changed|world_not_ready|mod_version_mismatch|unauthorized|origin_not_allowed/.test(error.message)) {
            stopStardewPolling(); s.status = 'error'; s.error = error.message;
            await saveState().catch(() => {});
            if (root?.style.display !== 'none') render();
        } else {
            s.error = '连接暂时中断，正在恢复：' + error.message;
            const label = root?.querySelector('[data-stardew-status]');
            if (label) label.textContent = s.error;
        }
    }

    async function watchStardew() {
        if (stardewWatchController || !state) return;
        const s = currentStardew();
        if (s.status !== 'online' || !s.bindingId) return;
        const snapshot = { ...s }, account = getAccountId(), epoch = stardewEpoch;
        const controller = new AbortController(); stardewWatchController = controller;
        const handshakeTimer = setTimeout(() => controller.abort(), 10000);
        const current = () => !controller.signal.aborted && epoch === stardewEpoch && account === getAccountId();
        try {
            const response = await fetch(new URL(snapshot.endpoint).origin + '/watch', { method: 'POST',
                headers: { 'Content-Type': 'application/json', Authorization: 'Bearer ' + snapshot.token },
                body: JSON.stringify(stardewBinding(snapshot)), signal: controller.signal });
            clearTimeout(handshakeTimer);
            if (!response.ok) { const data = await response.json(); throw new Error(data.error || '本地连接失败'); }
            const reader = response.body.getReader(), decoder = new TextDecoder();
            let pending = '';
            while (current()) {
                const part = await reader.read();
                if (part.done) throw new Error('状态连接已关闭');
                pending += decoder.decode(part.value, { stream: true });
                if (pending.length > 2 * 1024 * 1024) throw new Error('状态消息过大');
                let newline;
                while ((newline = pending.indexOf('\n')) >= 0 && current()) {
                    const line = pending.slice(0, newline); pending = pending.slice(newline + 1);
                    if (!line.trim()) continue;
                    const item = JSON.parse(line);
                    if (item.error) {
                        if (/state_stale|mod_not_loaded/.test(item.error)) {
                            const label = root?.querySelector('[data-stardew-status]');
                            if (label) label.textContent = '等待游戏恢复，聊天连接保持中';
                            continue;
                        }
                        throw new Error(item.error);
                    }
                    if (item.world) await applyStardewWorld(item.world, s, snapshot, account, epoch);
                }
            }
        } catch (error) { if (current()) await stardewConnectionError(error, s); }
        finally { clearTimeout(handshakeTimer); controller.abort(); if (stardewWatchController === controller) stardewWatchController = null; }
    }

    async function applyStardewWorld(world, s, snapshot, account, epoch) {
        if (epoch !== stardewEpoch || account !== getAccountId() || s.bindingId !== snapshot.bindingId) return;
        s.error = '';
        if (world.sessionId !== s.sessionId || world.saveId !== s.saveId || world.companion?.id !== s.companionId) throw new Error('world_session_changed: 游戏存档或同伴改变，请重新保存并测试');
        s.world = world;
        if (stardewChatRequestId && world.chatRequest?.id !== stardewChatRequestId) stardewChatController?.abort();
        if (world.chatRequest && !stardewChatController) void receiveStardewChat(snapshot, account, epoch);
        const task = world.companion?.task;
        const eventId = task && s.sessionId + ':' + task.id + ':' + task.status;
        const seen = Array.isArray(s.seenEvents) ? s.seenEvents : [];
        if (task && ['succeeded', 'failed', 'cancelled'].includes(task.status) && !seen.includes(eventId)) {
            const event = { eventId, saveId: s.saveId, gameDate: world.gameDate, gameTime: world.gameTime,
                occurredAt: world.syncedAt, task: { ...task } };
            s.seenEvents = [...seen, eventId].slice(-100); s.lastEvent = event;
            await saveState();
            // The next game turn receives this receipt as current state.
        }
        if (activePage === 'stardew' && root?.style.display !== 'none') {
            const label = root.querySelector('[data-stardew-status]');
            if (label) label.textContent = stardewTaskText(task);
            const position = root.querySelector('[data-stardew-position]');
            const c = world.companion;
            if (position && c) position.textContent = `${c.name} · ${c.location} (${c.x}, ${c.y}) · 水量 ${c.waterLeft} · 体力 ${Math.round(c.stamina)} · 持续跟随${c.followEnabled ? "开" : "关"}`;
        }
        const timing = root?.querySelector('[data-stardew-timing]');
        if (timing) timing.textContent = stardewTimingText(s.lastChatTiming);
    }


    async function receiveStardewChat(snapshot, account, epoch) {
        if (stardewChatController) return;
        const controller = new AbortController(); stardewChatController = controller;
        const stillCurrent = () => !controller.signal.aborted && epoch === stardewEpoch && account === getAccountId()
            && currentStardew().status === 'online' && currentStardew().bindingId === snapshot.bindingId;
        let claim = null, timer = null;
        try {
            claim = await stardewHttp(snapshot, '/chat/claim', stardewBinding(snapshot), controller.signal);
            if (!claim.request || !stillCurrent()) return;
            stardewChatRequestId = claim.request.id;
            timer = setTimeout(() => controller.abort(), Math.max(1, Date.parse(claim.request.expiresAt) - Date.now() - 1000));
            if (typeof window.wcReceiveStardewChat !== 'function') throw new Error('童话集尚未更新游戏内聊天，请强制刷新网站后重新连接。');
            const text = await window.wcReceiveStardewChat({ contactId: snapshot.contactId, accountId: account,
                ...stardewBinding(snapshot), request: claim.request, signal: controller.signal, stillCurrent,
                onTiming: timing => { if (stillCurrent()) currentStardew().lastChatTiming = timing; } });
            if (!stillCurrent()) return;
            await stardewHttp(snapshot, '/chat/reply', { ...stardewBinding(snapshot), requestId: claim.request.id,
                claimId: claim.claimId, text: text.slice(0, 8000), failed: false }, controller.signal);
            if (stillCurrent()) await saveState().catch(() => {});
        } catch (error) {
            if (claim?.request && stillCurrent()) {
                await stardewHttp(snapshot, '/chat/reply', { ...stardewBinding(snapshot), requestId: claim.request.id,
                    claimId: claim.claimId, text: String(error.message || '角色回复失败，请检查模型接口。').slice(0, 2000), failed: true }, controller.signal)
                    .catch(() => {});
            }
        } finally {
            clearTimeout(timer);
            if (stardewChatController === controller) { stardewChatController = null; stardewChatRequestId = ''; }
        }
    }

    async function cancelStardewContact(contactId) {
        if (!state) return;
        const s = currentStardew();
        if (s.status !== 'online' || s.contactId !== String(contactId) || !s.bindingId) throw new Error('该角色当前没有星露谷连接');
        const text = await callNumenTool(s, 'stardew_stop', stardewBinding(s));
        const result = JSON.parse(text);
        if (result.receipt?.status !== 'succeeded') throw new Error('游戏尚未确认停止');
        return result;
    }

    async function disconnectStardew() {
        const snapshot = { ...currentStardew() };
        stopStardewPolling();
        const s = currentStardew(); s.status = 'disconnected'; s.bindingId = '';
        await saveState(); render();
        if (snapshot.bindingId) await stardewHttp(snapshot, '/disconnect', stardewBinding(snapshot));
        showNotice('已断开星露谷连接');
    }

    function render() {
        if (!root || !state) return;
        const minecraft = currentMinecraft();
        const contacts = getContacts();
        root.innerHTML = activePage === 'minecraft'
            ? renderMinecraftPage(minecraft, contacts)
            : activePage === 'stardew' ? renderStardewPage(currentStardew(), contacts) : renderLibraryPage(minecraft);
        bindEvents();
    }

    async function mcpFetch(endpoint, token, body, sessionId = '', signal) {
        const headers = {
            Authorization: 'Bearer ' + token,
            Accept: 'application/json, text/event-stream',
            'Content-Type': 'application/json'
        };
        if (sessionId) headers['Mcp-Session-Id'] = sessionId;
        const controller = new AbortController();
        const onAbort = () => controller.abort();
        signal?.addEventListener('abort', onAbort, { once: true });
        if (signal?.aborted) controller.abort();
        const timer = setTimeout(() => controller.abort(), body?.method === 'tools/call' ? 25000 : 12000);
        try {
            const response = await fetch(endpoint, {
                method: 'POST', headers, body: JSON.stringify(body), signal: controller.signal
            });
            if (!response.ok) {
                let errorCode = '';
                try { errorCode = JSON.parse(await response.text())?.error || ''; } catch (_) {}
                if (response.status === 401) throw new Error('Bridge 访问令牌错误（HTTP 401）');
                if (errorCode === 'numen_token_rejected') throw new Error('Bridge 已连接，但 Numen 令牌被游戏拒绝，请重新复制 Numen 外接大脑令牌');
                if (errorCode === 'numen_endpoint_not_found') throw new Error('Bridge 已连接，但 Numen MCP 地址不存在，请检查 8765 端口和 /mcp 路径');
                throw new Error(`Bridge 或 Numen 上游请求失败（HTTP ${response.status}）`);
            }
            const contentType = String(response.headers.get('content-type') || '').toLowerCase();
            let data = null;
            if (body.id == null && (response.status === 202 || response.status === 204)) {
                return { data: null, sessionId: response.headers.get('mcp-session-id') || sessionId };
            }
            if (contentType.includes('text/event-stream')) {
                if (!response.body) throw new Error('MCP 返回空事件流');
                const reader = response.body.getReader();
                const decoder = new TextDecoder();
                let pending = '';
                try {
                    while (true) {
                        const { value, done } = await reader.read();
                        if (done) break;
                        pending += decoder.decode(value, { stream: true });
                        let boundary;
                        while ((boundary = pending.search(/\r?\n\r?\n/)) >= 0) {
                            const event = pending.slice(0, boundary);
                            pending = pending.slice(boundary).replace(/^\r?\n\r?\n/, '');
                            const eventData = event.split(/\r?\n/).filter(line => line.startsWith('data:'))
                                .map(line => line.slice(5).trimStart()).join('\n');
                            if (!eventData || eventData === '[DONE]') continue;
                            let parsed;
                            try { parsed = JSON.parse(eventData); } catch (_) { continue; }
                            if (parsed?.id === body.id) { data = parsed; break; }
                        }
                        if (data) break;
                    }
                } finally {
                    await reader.cancel().catch(() => {});
                }
            } else {
                const text = await response.text();
                if (!text) throw new Error('MCP 返回空响应');
                try { data = JSON.parse(text); } catch (_) { throw new Error('MCP 响应不是有效 JSON'); }
            }
            if (!data || data.id !== body.id) throw new Error('MCP 响应缺失或请求 ID 不匹配');
            if (data.error) throw new Error(data.error.message || 'MCP JSON-RPC 调用失败');
            return { data, sessionId: response.headers.get('mcp-session-id') || sessionId };
        } catch (error) {
            if (controller.signal.aborted && !signal?.aborted) throw new Error('MCP 请求超时，请检查 Bridge 和游戏是否仍在运行');
            throw error;
        } finally {
            clearTimeout(timer);
            signal?.removeEventListener('abort', onAbort);
        }
    }

    async function mcpRequest(endpoint, token, body, sessionId = '', signal) {
        return (await mcpFetch(endpoint, token, body, sessionId, signal)).data;
    }

    async function callNumenTool(minecraft, name, args, signal) {
        const initialized = await mcpFetch(minecraft.endpoint, minecraft.token, {
            jsonrpc: '2.0', id: 'game_init_' + Date.now(), method: 'initialize',
            params: {
                protocolVersion: '2025-06-18',
                capabilities: {},
                clientInfo: { name: 'TonghuajiGameCenter', version: '1.0.0' }
            }
        }, '', signal);
        const sessionId = initialized.sessionId || '';
        try {
            await mcpRequest(minecraft.endpoint, minecraft.token, { jsonrpc: '2.0', method: 'notifications/initialized' }, sessionId, signal);
        } catch (error) {
            if (signal?.aborted) throw error;
        }
        const response = await mcpRequest(minecraft.endpoint, minecraft.token, {
            jsonrpc: '2.0', id: 'game_' + name + '_' + Date.now(),
            method: 'tools/call', params: { name, arguments: args || {} }
        }, sessionId, signal);
        if (response?.result?.isError) throw new Error(resultText(response) || '游戏工具返回失败');
        return resultText(response);
    }

    function resultText(result) {
        const content = result?.result?.content;
        if (!Array.isArray(content)) return '';
        return content.map(item => item?.type === 'text' ? item.text || '' : '').filter(Boolean).join('\n');
    }

    function parseCompanions(result) {
        const candidates = [result?.result?.structuredContent, result?.result, resultText(result)];
        for (const candidate of candidates) {
            let value = candidate;
            if (typeof value === 'string') {
                try { value = JSON.parse(value); } catch (_) { continue; }
            }
            const list = Array.isArray(value) ? value : value?.companions;
            if (!Array.isArray(list)) continue;
            return list.filter(item => item && typeof item === 'object').map(item => ({
                id: String(item.id || item.uuid || '').trim(),
                name: String(item.name || '').trim()
            })).filter(item => item.id || item.name);
        }
        const rosterText = resultText(result).trim();
        if (/^No companions are live in the world right now\./i.test(rosterText)) return [];
        if (rosterText.startsWith('Live companions:\n')) {
            const lines = rosterText.split(/\r?\n/).slice(1).filter(Boolean);
            const parsed = lines.map(line => /^-\s+(.+?)\s+\(id:\s*([^\s)]+)\)$/.exec(line.trim()));
            if (parsed.length && parsed.every(Boolean)) {
                return parsed.map(match => ({ name: match[1].trim(), id: match[2].trim() }));
            }
        }
        throw new Error('Numen 同伴列表格式无法识别，请核对实际模组版本');
    }

    async function testConnection(endpoint, token, contactId, companion, signal) {
        if (!getContacts().some(item => item.id === String(contactId || ''))) throw new Error('请先选择有效的童话集联系人');
        const initialized = await mcpFetch(endpoint, token, {
            jsonrpc: '2.0', id: 'game_init_' + Date.now(), method: 'initialize',
            params: {
                protocolVersion: '2025-06-18', capabilities: {},
                clientInfo: { name: 'TonghuajiGameCenter', version: '1.0.0' }
            }
        }, '', signal);
        if (!initialized.data?.result || !initialized.data.result.protocolVersion) throw new Error('Numen 握手成功，但初始化响应无效');
        const sessionId = initialized.sessionId || '';
        try {
            await mcpRequest(endpoint, token, { jsonrpc: '2.0', method: 'notifications/initialized' }, sessionId, signal);
        } catch (error) {
            if (signal?.aborted) throw error;
        }
        const tools = await mcpRequest(endpoint, token, {
            jsonrpc: '2.0', id: 'game_tools_' + Date.now(), method: 'tools/list', params: {}
        }, sessionId, signal);
        const toolList = tools?.result?.tools;
        if (!Array.isArray(toolList) || !toolList.length) throw new Error('Numen 没有返回可用的 MCP 工具');
        const toolNames = new Set(toolList.map(tool => String(tool?.name || '')));
        if (!toolNames.has('list_companions')) throw new Error('Numen 缺少必要工具：list_companions');
        const managementTools = new Set(['list_companions', 'create_companion', 'delete_companion',
            'acquire_companion', 'release_companion', 'get_events', 'say']);
        const actionTools = toolList.filter(tool => !managementTools.has(String(tool?.name || ''))
            && tool?.inputSchema?.properties?.companion);
        if (!actionTools.length) throw new Error('Numen 没有暴露可驱动同伴的动作工具，请检查模组版本和隐藏工具设置');
        const list = await mcpRequest(endpoint, token, {
            jsonrpc: '2.0', id: 'game_companions_' + Date.now(), method: 'tools/call',
            params: { name: 'list_companions', arguments: {} }
        }, sessionId, signal);
        if (list?.result?.isError) throw new Error(resultText(list) || 'Numen 同伴列表读取失败');
        const companions = parseCompanions(list);
        const matches = companions.filter(item => item.id === companion || item.name === companion);
        if (!matches.length) throw new Error('Numen 里找不到同伴：' + companion);
        if (matches.length > 1) throw new Error('同伴名称重复，请填写唯一 ID');
        if (!matches[0].id) throw new Error('同伴缺少唯一 ID，无法安全绑定');
        return {
            toolsCount: toolList.length, companions: companions.map(item => item.name || item.id).join('、'),
            companionId: matches[0].id, hasEventTool: toolNames.has('get_events')
        };
    }

    async function saveMcpConfiguration(endpoint, token) {
        const record = await readRecord('mcpAppData').catch(() => null);
        const data = record?.data && typeof record.data === 'object'
            ? record.data
            : { version: 1, configurations: [], presets: [] };
        const configurations = Array.isArray(data.configurations) ? data.configurations : [];
        const item = {
            id: NUMEN_MCP_CONFIG_ID,
            name: 'Minecraft Numen',
            url: endpoint,
            tokenUrl: '',
            transport: 'streamable-http',
            headers: [{ key: 'Authorization', value: 'Bearer ' + token }],
            enabled: true,
            updatedAt: Date.now()
        };
        const index = configurations.findIndex(config => config?.id === NUMEN_MCP_CONFIG_ID);
        if (index >= 0) configurations[index] = item;
        else configurations.push(item);
        await writeRecord({ id: 'mcpAppData', data: { ...data, version: 1, configurations } });
    }

    async function saveAndTest() {
        const form = root.querySelector('[data-game-form]');
        const endpoint = String(form?.elements.endpoint?.value || '').trim().replace(/\/+$/, '');
        const token = String(form?.elements.token?.value || '').trim();
        const contactId = String(form?.elements.contactId?.value || '').trim();
        const companion = String(form?.elements.companion?.value || '').trim();
        if (!endpoint || !/^https?:\/\//i.test(endpoint)) throw new Error('请输入有效的 Bridge HTTP/HTTPS 地址');
        if (!token) throw new Error('请输入 Bridge 访问令牌');
        if (!companion) throw new Error('请输入 Numen 同伴名称或 ID');
        if (!getContacts().some(item => item.id === contactId)) throw new Error('请选择有效的童话集角色');

        const button = root.querySelector('[data-game-action="save-test"]');
        if (button) { button.disabled = true; button.textContent = '连接中'; }
        stopMinecraftEventPolling();
        const epoch = ++minecraftConnectionEpoch;
        const accountId = getAccountId();
        const minecraft = currentMinecraft();
        Object.assign(minecraft, { endpoint, token, contactId, companion, companionId: '', status: 'connecting', updatedAt: Date.now() });
        await saveState();
        render();

        try {
            const result = await testConnection(endpoint, token, contactId, companion);
            if (epoch !== minecraftConnectionEpoch || accountId !== getAccountId()) return;
            Object.assign(minecraft, { status: 'online', companionId: result.companionId,
                hasEventTool: result.hasEventTool, toolsCount: result.toolsCount,
                companions: result.companions, updatedAt: Date.now() });
            await saveState();
            await saveMcpConfiguration(endpoint, token);
            render();
            if (result.hasEventTool) startMinecraftEventPolling();
            showNotice(result.hasEventTool
                ? `已连接 Numen，发现 ${result.toolsCount} 个工具`
                : '游戏操作工具已连接；此版本未提供 get_events，无法自动同步游戏事件');
        } catch (error) {
            if (epoch !== minecraftConnectionEpoch || accountId !== getAccountId()) return;
            Object.assign(minecraft, { status: 'error', companionId: '', error: error.message || '连接失败', updatedAt: Date.now() });
            await saveState();
            render();
            showNotice(error.message || '连接失败，请检查 Bridge 和令牌', true);
        }
    }

    async function pollMinecraftEvents() {
        if (minecraftPollBusy || !state || document.hidden || Date.now() < minecraftNextPollAt) return;
        const accountId = getAccountId();
        const minecraft = currentMinecraft();
        if (!['online', 'reconnecting'].includes(minecraft.status) || !minecraft.hasEventTool
            || !minecraft.endpoint || !minecraft.token || !minecraft.companionId || !minecraft.contactId) return;
        const epoch = minecraftConnectionEpoch;
        const snapshot = { ...minecraft };
        const controller = new AbortController();
        minecraftPollController = controller;
        minecraftPollBusy = true;
        try {
            const text = await callNumenTool(snapshot, 'get_events', { companion: snapshot.companionId, wait_seconds: 1 }, controller.signal);
            if (controller.signal.aborted || epoch !== minecraftConnectionEpoch || accountId !== getAccountId()) return;
            minecraftPollFailures = 0;
            minecraftNextPollAt = 0;
            if (minecraft.status === 'reconnecting') {
                minecraft.status = 'online';
                await saveState().catch(() => {});
                if (root?.style.display !== 'none') render();
            }
            if (!text || /^\(no new events\b/i.test(text.trim())) return;
            const eventText = 'Minecraft：' + text.trim();
            if (typeof window.wcAppendChatMessage === 'function') {
                window.wcAppendChatMessage(eventText, 'system_event', snapshot.contactId,
                    null, null, false, null, null, { isSystemHidden: true });
                if (typeof window.wcRequestApiReply === 'function') {
                    await window.wcRequestApiReply({ contactId: snapshot.contactId, minecraftEvent: text.trim() });
                }
            }
        } catch (error) {
            if (controller.signal.aborted || epoch !== minecraftConnectionEpoch || accountId !== getAccountId()) return;
            minecraft.lastPollError = error?.message || '事件轮询失败';
            const authError = /401|403|unauthorized|令牌/.test(String(error?.message || ''));
            minecraftPollFailures += 1;
            minecraft.status = authError || minecraftPollFailures >= 6 ? 'error' : 'reconnecting';
            minecraftNextPollAt = Date.now() + Math.min(30000, 2000 * (2 ** minecraftPollFailures));
            if (minecraft.status === 'error') stopMinecraftEventPolling();
            await saveState().catch(() => {});
            if (root?.style.display !== 'none') render();
        } finally {
            if (minecraftPollController === controller) minecraftPollController = null;
            minecraftPollBusy = false;
        }
    }

    function startMinecraftEventPolling() {
        if (minecraftPollTimer || !currentMinecraft().hasEventTool) return;
        minecraftPollFailures = 0;
        minecraftNextPollAt = 0;
        void pollMinecraftEvents();
        minecraftPollTimer = setInterval(() => { void pollMinecraftEvents(); }, 3000);
    }

    function stopMinecraftEventPolling() {
        if (minecraftPollTimer) clearInterval(minecraftPollTimer);
        minecraftPollTimer = null;
        minecraftPollController?.abort();
        minecraftPollController = null;
    }

    async function revalidateMinecraftConnection() {
        if (!state) return;
        const accountId = getAccountId();
        const minecraft = currentMinecraft();
        if (!minecraft.endpoint || !minecraft.token || !minecraft.contactId || !minecraft.companion) return;
        stopMinecraftEventPolling();
        const epoch = ++minecraftConnectionEpoch;
        minecraft.status = 'connecting';
        if (root?.style.display !== 'none') render();
        try {
            const result = await testConnection(minecraft.endpoint, minecraft.token, minecraft.contactId, minecraft.companion);
            if (epoch !== minecraftConnectionEpoch || accountId !== getAccountId()) return;
            Object.assign(minecraft, { status: 'online', companionId: result.companionId,
                hasEventTool: result.hasEventTool, toolsCount: result.toolsCount,
                companions: result.companions, updatedAt: Date.now() });
            await saveState();
            if (result.hasEventTool) startMinecraftEventPolling();
        } catch (error) {
            if (epoch !== minecraftConnectionEpoch || accountId !== getAccountId()) return;
            minecraft.status = 'error';
            minecraft.error = error?.message || '重新连接失败';
            await saveState().catch(() => {});
        }
        if (root?.style.display !== 'none') render();
    }

    function bindEvents() {
        root.querySelectorAll('[data-game-action]').forEach(control => control.addEventListener('click', async event => {
            const action = control.dataset.gameAction;
            if (action === 'close') {
                close();
                return;
            }
            if (action === 'back-library') {
                activePage = 'library';
                render();
                return;
            }
            if (action === 'open-game') {
                const gameId = String(control.dataset.gameId || '');
                if (gameId === 'minecraft' || gameId === 'stardew') {
                    activePage = gameId;
                    render();
                }
                return;
            }
            if (action === 'disconnect') {
                stopMinecraftEventPolling();
                minecraftConnectionEpoch++;
                const minecraft = currentMinecraft();
                minecraft.status = 'disconnected';
                minecraft.companionId = '';
                await saveState();
                render();
                showNotice('已断开 Minecraft 游戏连接');
                return;
            }
            if (action === 'open-chat') {
                close();
                if (typeof window.openWechatApp === 'function') window.openWechatApp();
                return;
            }
            if (action === 'open-numen-docs') {
                window.open('https://github.com/Dwinovo/minecraft-numen#快速开始', '_blank', 'noopener,noreferrer');
                return;
            }
            if (action === 'open-bridge-guide') {
                window.open('https://github.com/Four-leaf-luckystar/tongtong/blob/main/tools/minecraft-numen-bridge/README.md', '_blank', 'noopener,noreferrer');
                return;
            }
            if (action === 'save-test') {
                event.preventDefault();
                try { await saveAndTest(); } catch (error) { showNotice(error.message || '保存失败', true); }
            }
            if (action === 'stardew-test') {
                event.preventDefault();
                try { await connectStardew(); } catch (error) { showNotice(error.message || '连接失败', true); }
            }
            if (action === 'stardew-skin') {
                event.preventDefault();
                try { await applyStardewSkin(); } catch (error) { showNotice(error.message || '外观更新失败', true); }
            }
            if (action === 'stardew-stop') {
                try { await cancelStardewContact(currentStardew().contactId); showNotice('游戏已确认停止'); }
                catch (error) { showNotice('停止未确认：' + error.message, true); }
            }
            if (action === 'stardew-disconnect') {
                try { await disconnectStardew(); } catch (error) { showNotice('连接已断开，游戏停止回执未确认：' + error.message, true); }
            }
        }));
        const stardewForm = root.querySelector('[data-stardew-form]');
        stardewForm?.addEventListener('submit', event => event.preventDefault());
        stardewForm?.elements.contactId?.addEventListener('change', () => {
            stardewForm.elements.skin.value = currentStardew().skinByContact?.[stardewForm.elements.contactId.value] || 'default';
        });
        const form = root.querySelector('[data-game-form]');
        if (form) form.addEventListener('submit', event => event.preventDefault());
    }

    async function init() {
        if (initialized) return window.GameCenterApp;
        if (initPromise) return initPromise;

        initPromise = (async () => {
            if (!root) root = document.getElementById('gameCenterAppUI');
            if (!root) {
                root = document.createElement('div');
                root.id = 'gameCenterAppUI';
                root.style.cssText = 'display:none;position:absolute;inset:0;z-index:7000;overflow:hidden;';
                (document.querySelector('.iphone') || document.body).appendChild(root);
            }
            ensureStyles();
            if (typeof window.wcReloadContactsFromStorage === 'function') {
                await window.wcReloadContactsFromStorage().catch(() => {});
            }
            state = await loadState();
            const savedStardew = currentStardew();
            if (savedStardew.status === 'online') startStardewPolling();
            const savedMinecraft = currentMinecraft();
            if (savedMinecraft.status === 'online' || savedMinecraft.status === 'reconnecting') {
                savedMinecraft.status = 'disconnected';
                void revalidateMinecraftConnection();
            }
            document.addEventListener('visibilitychange', () => {
                if (!document.hidden && state && currentStardew().status === 'online' && !stardewWatchController) void watchStardew();
                if (!document.hidden && state && ['online', 'reconnecting'].includes(currentMinecraft().status)) {
                    void revalidateMinecraftConnection();
                }
            });
            window.addEventListener('wechat:account-changed', () => {
                const oldStardew = state?.accounts?.[stardewAccount]?.stardew;
                stopStardewPolling();
                if (oldStardew?.bindingId) {
                    oldStardew.status = 'disconnected';
                    void stardewHttp(oldStardew, '/disconnect', stardewBinding(oldStardew)).catch(() => {}).finally(() => saveState().catch(() => {}));
                }
                if (state && currentStardew().status === 'online') {
                    currentStardew().status = 'disconnected';
                    void saveState().catch(() => {});
                }
                stopMinecraftEventPolling();
                minecraftConnectionEpoch++;
                if (!state) return;
                const minecraft = currentMinecraft();
                if (['online', 'reconnecting'].includes(minecraft.status)) {
                    minecraft.status = 'disconnected';
                    void revalidateMinecraftConnection();
                }
                if (root?.style.display !== 'none') render();
            });
            activePage = 'library';
            render();
            initialized = true;
            return window.GameCenterApp;
        })().finally(() => {
            initPromise = null;
        });

        return initPromise;
    }

    async function open() {
        const wasInitialized = initialized;
        await init();
        activePage = 'library';
        root.style.display = 'block';
        root.setAttribute('aria-hidden', 'false');
        if (wasInitialized) render();
        if (currentMinecraft().status === 'online') startMinecraftEventPolling();
    }

    function close() {
        if (!root) return;
        root.style.display = 'none';
        root.setAttribute('aria-hidden', 'true');
    }

    window.GameCenterApp = { init, open, close, cancelStardewContact };
    window.openGameCenterApp = open;
})();


