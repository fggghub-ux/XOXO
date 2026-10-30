let appSettings = {
        simulatedStatusBarVisible: true,
        background_keep_alive_enabled: false,
        message_notifications_enabled: false,
        ios_theme_mode: 'light',
        ios_brightness: 100,
        access_page_scale: 100,
        access_desktop_rows: null,
        access_top_bar_height: 0,
        access_bottom_bar_height: 0,
        access_app_top_target: 'wechat',
        access_app_top_offsets: {},
        assistive_touch_enabled: false,
        assistive_ball_size: 58,
        assistive_ball_opacity: 100,
        wc_presets: [],
        wc_current_preset_id: null,
        wc_custom_css: '',
        wc_time_awareness_enabled: true,
        wc_timestamp_enabled: true,
        wc_moments_post_probability: 0,
        wc_bubble_theme: 'image',
        wc_bubble_color: 'default',
        wc_avatar_settings: { enabled: false, displayMode: 'all', size: 40, radius: 50, frameUrlChat: '', frameUrlUser: '', savedFrames: [] },
    wc_font_settings: null,
    desktop_icon_appearance: { radius: 16, labelColor: null, style: 'light' },
    desktop_widget_label_enabled: false,
    desktop_widget_label_text: 'Fairy Widgets',
    desktop_custom_css: '',
    desktop_custom_js: ''
};
let appSettingsLoaded = false;
let appSettingsSavePending = false;
let layoutStoreLoaded = false;
let readenAppDataLoaded = false;
let readenAppDataSavePending = false;
let resolveReadenAppDataReady = null;
const readenAppDataReady = new Promise(resolve => {
    resolveReadenAppDataReady = resolve;
});
window.readenAppDataReady = readenAppDataReady;

let worldbookDataLoaded = false;
let resolveWorldbookDataReady = null;
const worldbookDataReady = new Promise(resolve => {
    resolveWorldbookDataReady = resolve;
});
window.worldbookDataReady = worldbookDataReady;
window.worldbookDataLoaded = false;

function markWorldbookDataLoaded() {
    if (worldbookDataLoaded) return;
    worldbookDataLoaded = true;
    window.worldbookDataLoaded = true;
    if (typeof resolveWorldbookDataReady === 'function') {
        resolveWorldbookDataReady(true);
        resolveWorldbookDataReady = null;
    }
    window.dispatchEvent(new Event('worldbookdataready'));
}

function markReadenAppDataLoaded() {
    if (readenAppDataLoaded) return;
    readenAppDataLoaded = true;
    if (typeof resolveReadenAppDataReady === 'function') {
        resolveReadenAppDataReady(true);
        resolveReadenAppDataReady = null;
    }
    window.dispatchEvent(new Event('readenappdataready'));
}
    let currentActiveTab = 'theme';
    let wallpapers = [
        { id: 'add', isAdd: true }
    ];
    let presets = [];
    let customFontCount = 0;
    let customFonts = [];
    let currentSelectedFont = 'default';
    let wcMomentsList = [];
    let wcMomentsProfile = {
        bg: '',
        avatar: '',
        name: '',
        id: '',
        bio: ''
    };
    let wcContactGroups = [];
    let wcContactsList = [];
    let wcPresets = [];
    let wcCurrentPresetId = null;
    let wcTimestampEnabled = true;
    let wcCurrentBubbleTheme = 'image';
    let wcCurrentColorScheme = 'default';
    let wcAvatarSettings = { enabled: false, displayMode: 'all', size: 40, radius: 50, frameUrlChat: '', frameUrlUser: '', savedFrames: [] };
    let wcCurrentFontFamily = 'default';
    let wcChatBgList = [];
    let wcCurrentChatBg = '';
    let wcChatMessagesByContact = {};
    let wcChatDataHydrated = false;
    let wcChatDataDirty = false;
    let wcChatSaveQueue = Promise.resolve();
    let wcEmojiGroups = [];
    let wcEmojiBackupScheduled = false;
    let wbGroups = [];
    let wbEntries = [];
    let musicAppData = {
        searchHistory: [],
        recentPlays: [],
        favoriteSongs: [],
        customPlaylists: [],
        favoriteArtists: []
    };
    window.getWorldbookGroups = function () {
        return Array.isArray(wbGroups)
            ? wbGroups.filter(group => group && group.id).map(group => ({ id: group.id, name: group.name }))
            : [];
    };
   let apiDataList = [];
   let apiConnectedId = null;
    let voiceDataList = [];
    let voiceConnectedId = null;
    let imageGenDataList = [];
    let imageGenConnectedId = null;
    let imagePromptPresets = [];
    let imageGenSettings = {
        positivePrompt: '',
        negativePrompt: '',
        size: '1024x1024',
        quality: 'medium',
        n: 1,
        style: 'vivid',
        steps: 28,
        scale: 5,
        sampler: 'k_euler',
        seed: '',
        aspectRatio: '1:1',
        outputFormat: 'png',
        background: 'auto'
    };
    let photoAlbumItems = [];
    let photoAlbumDataLoaded = false;
    const photoAlbumDataId = 'photoAlbumData';
    window.photoAlbumItems = photoAlbumItems;
    // --- 新增：阅读APP全局变量 ---
    let readenBooksData = [];
    let readenGroups = ['全部'];
    let readenCoverThemes = [];
    let readenGlobalThemeIndex = 0;
    let readenSettings = { font: 'inherit', bg: null, profileName: '', profileAvatar: '', profileSign: '' };
    
// --- 新增：短信APP全局变量 ---
let messageAppData = {
    conversations: []
};

// --- 新增：电话APP全局变量 ---
let callingHistoryData = [];

// --- 新增：Apple Store 全局变量 ---
let storeAppData = {
    installedApps: [],
    wishlist: [],
    reviews: []
};
    
   let localDriveHandle = null;
    let localDriveMode = null;
    let localDriveFileName = '童话集备份.json';
    let autoBackupEnabled = false;
    let backupModeType = 'action';
    const dbName = "iOSDesktopDB";
    const storeName = "layoutStore";
    const DEVICE_LOCAL_SETTINGS_ID = "deviceLocalSettings";
    let db;
    let deviceLocalSettings = {
        wechatKeyboardOffsetPx: 0,
        messageKeyboardOffsetPx: 0
    };

    function normalizeDeviceKeyboardOffsetPx(value) {
        const parsed = Number(value);
        if (!Number.isFinite(parsed)) return 0;
        const clamped = Math.min(160, Math.max(-80, parsed));
        return Math.round(clamped / 2) * 2;
    }

    function applyDeviceLocalSettings() {
        const wechatOffset = normalizeDeviceKeyboardOffsetPx(deviceLocalSettings.wechatKeyboardOffsetPx);
        const messageOffset = normalizeDeviceKeyboardOffsetPx(deviceLocalSettings.messageKeyboardOffsetPx);
        deviceLocalSettings.wechatKeyboardOffsetPx = wechatOffset;
        deviceLocalSettings.messageKeyboardOffsetPx = messageOffset;
        document.documentElement.style.setProperty('--wechat-keyboard-user-offset', `${wechatOffset}px`);
        document.documentElement.style.setProperty('--message-keyboard-user-offset', `${messageOffset}px`);
        window.dispatchEvent(new CustomEvent('tonghuaji-device-local-settings-change', {
            detail: {
                wechatKeyboardOffsetPx: wechatOffset,
                messageKeyboardOffsetPx: messageOffset
            }
        }));
    }

    function getWechatKeyboardOffsetPx() {
        return normalizeDeviceKeyboardOffsetPx(deviceLocalSettings.wechatKeyboardOffsetPx);
    }

    function getMessageKeyboardOffsetPx() {
        return normalizeDeviceKeyboardOffsetPx(deviceLocalSettings.messageKeyboardOffsetPx);
    }

    function saveDeviceKeyboardOffsetPx(key, value) {
        if (!db) return Promise.resolve(false);
        const nextValue = normalizeDeviceKeyboardOffsetPx(value);
        const nextSettings = { ...deviceLocalSettings, [key]: nextValue };
        return new Promise(resolve => {
            const transaction = db.transaction([storeName], "readwrite");
            (window.CharacterRecordCleanup?.wrap(transaction.objectStore(storeName)) || transaction.objectStore(storeName)).put({
                id: DEVICE_LOCAL_SETTINGS_ID,
                data: nextSettings
            });
            transaction.oncomplete = () => {
                deviceLocalSettings = nextSettings;
                applyDeviceLocalSettings();
                resolve(true);
            };
            transaction.onerror = () => {
                console.error('Failed to save device-local settings:', transaction.error);
                resolve(false);
            };
            transaction.onabort = () => resolve(false);
        });
    }

    function saveWechatKeyboardOffsetPx(value) {
        return saveDeviceKeyboardOffsetPx('wechatKeyboardOffsetPx', value);
    }

    function saveMessageKeyboardOffsetPx(value) {
        return saveDeviceKeyboardOffsetPx('messageKeyboardOffsetPx', value);
    }

    window.getWechatKeyboardOffsetPx = getWechatKeyboardOffsetPx;
    window.saveWechatKeyboardOffsetPx = saveWechatKeyboardOffsetPx;
    window.getMessageKeyboardOffsetPx = getMessageKeyboardOffsetPx;
    window.saveMessageKeyboardOffsetPx = saveMessageKeyboardOffsetPx;

    function initializeGithubBackupSchedule() {
        if (typeof window.initializeGithubBackupSchedule === 'function') {
            window.initializeGithubBackupSchedule();
        }
    }

    function initDB() {
            // show three-dots button; click to expand vertical capsule menu
        const request = indexedDB.open(dbName); 
        
        request.onupgradeneeded = (e) => {
            db = e.target.result;
            window.db = db;
            if (!db.objectStoreNames.contains(storeName)) {
                db.createObjectStore(storeName, { keyPath: "id" });
            }
        };

        request.onsuccess = (e) => {
            db = e.target.result;
            window.db = db;
            
            // 自动申请持久化储存权限，防止浏览器随意清空数据
            if (navigator.storage && navigator.storage.persist) {
                navigator.storage.persisted().then((isPersisted) => {
                    if (!isPersisted) {
                        navigator.storage.persist().catch(() => {});
                    }
                }).catch(() => {});
            }

            // show three-dots button; click to expand vertical capsule menu
            if (!db.objectStoreNames.contains(storeName)) {
                const currentVersion = db.version;
                db.close();
                const upgradeRequest = indexedDB.open(dbName, currentVersion + 1);
                upgradeRequest.onupgradeneeded = (e2) => {
                    const db2 = e2.target.result;
                    window.db = db2;
                    if (!db2.objectStoreNames.contains(storeName)) {
                        db2.createObjectStore(storeName, { keyPath: "id" });
                    }
                };
                upgradeRequest.onsuccess = (e2) => {
                    db = e2.target.result;
                    window.db = db;
                    loadLayout();
                    initializeGithubBackupSchedule();
                };
                upgradeRequest.onerror = (e2) => {
                    console.error("IndexedDB upgrade error:", e2);
                    markReadenAppDataLoaded();
                    markWorldbookDataLoaded();
                };
                return;
            }
            loadLayout();
            initializeGithubBackupSchedule();
        };

        request.onerror = (e) => {
            console.error("IndexedDB error:", e);
            markReadenAppDataLoaded();
            markWorldbookDataLoaded();
        };
    }

    let desktopLayoutBackupIdleId = null;

    function scheduleLayoutAutoBackup() {
        if (typeof triggerAutoLocalBackup !== 'function' || desktopLayoutBackupIdleId !== null) return;
        const run = () => {
            desktopLayoutBackupIdleId = null;
            triggerAutoLocalBackup();
        };
        if (typeof window.requestIdleCallback === 'function') {
            desktopLayoutBackupIdleId = window.requestIdleCallback(run, { timeout: 2500 });
        } else {
            desktopLayoutBackupIdleId = window.setTimeout(run, 400);
        }
    }

    function saveDesktopViewState(pageIndex) {
        if (!db || window.__tonghuajiBackupRestoreInProgress) return;
        const currentPage = Number.isFinite(Number(pageIndex))
            ? Math.max(0, Math.trunc(Number(pageIndex)))
            : (typeof window.getCurrentDesktopPageIndex === 'function' ? window.getCurrentDesktopPageIndex() : 0);
        const transaction = db.transaction([storeName], "readwrite");
        (window.CharacterRecordCleanup?.wrap(transaction.objectStore(storeName)) || transaction.objectStore(storeName)).put({ id: "desktopViewState", currentPage });
    }
    window.saveDesktopViewState = saveDesktopViewState;

    function saveLayout() {
        if (!db || window.__tonghuajiBackupRestoreInProgress || !window.isDesktopLayoutReady?.()) return;
        const pages = typeof window.getDesktopPagesSnapshot === 'function'
            ? window.getDesktopPagesSnapshot()
            : [typeof window.serializeDesktopGrid === 'function' ? window.serializeDesktopGrid() : []];
        const dockApps = typeof window.serializeDockApps === 'function' ? window.serializeDockApps() : [];
        const currentPage = typeof window.getCurrentDesktopPageIndex === 'function'
            ? window.getCurrentDesktopPageIndex()
            : 0;
        const desktopRows = typeof window.getDesktopRowCount === 'function'
            ? window.getDesktopRowCount()
            : 6;

        const nextLayout = {
            id: "currentLayout",
            pages,
            desktop: pages[0] || [],
            dock: dockApps,
            currentPage,
            desktopRows,
            placeholderAppsV1: true,
            placeholderAppsV2: true,
            placeholderAppsV3: true,
            placeholderAppsV4: true,
            placeholderAppsV5: true,
            placeholderAppsV6: true,
            placeholderAppsV6Removed: true,
            placeholderAppsV7: true,
            placeholderAppIconsV1: true,
            placeholderAppsCleanRemovedV2: true,
            placeholderAppsCleanRemovedV3: true,
            placeholderAppIconsV2: true,
            placeholderAppMetadataV1: true,
            builtinSvgIconsV1: true
        };

        const transaction = db.transaction([storeName], "readwrite");
        const store = (window.CharacterRecordCleanup?.wrap(transaction.objectStore(storeName)) || transaction.objectStore(storeName));
        const previousRequest = store.get("currentLayout");
        previousRequest.onsuccess = () => {
            const previous = previousRequest.result;
            // Keep one usable preceding layout in the same atomic transaction.
            const recovery = isUsableDesktopLayout(previous) ? previous : nextLayout;
            if (isUsableDesktopLayout(recovery)) store.put({ ...recovery, id: "desktopLayoutRecovery" });
            store.put(nextLayout);
        };

        saveDesktopViewState(currentPage);
        scheduleLayoutAutoBackup();
    }

    function isUsableDesktopLayout(data) {
        return Boolean(data && (Array.isArray(data.pages) || Array.isArray(data.desktop))
            && Array.isArray(data.dock) && data.dock.some(app => app && typeof app === 'object' && app.appId));
    }

    function preserveDamagedDesktopLayout(data) {
        if (!data) return;
        const transaction = db.transaction([storeName], "readwrite");
        const store = transaction.objectStore(storeName);
        const request = store.get("desktopLayoutBeforeRepair");
        request.onsuccess = () => {
            if (!request.result) store.put({ id: "desktopLayoutBeforeRepair", layout: data });
        };
    }

    function loadLayout() {
        const transaction = db.transaction([storeName], "readonly");
        const store = (window.CharacterRecordCleanup?.wrap(transaction.objectStore(storeName)) || transaction.objectStore(storeName));
        transaction.oncomplete = () => {
            layoutStoreLoaded = true;
        };
        const recoveryRequest = store.get("desktopLayoutRecovery");
        const request = store.get("currentLayout");

        request.onsuccess = (e) => {
            const originalData = e.target.result;
            let data = originalData;
            let desktopRecovered = false;
            if (!data && isUsableDesktopLayout(recoveryRequest.result)) {
                data = recoveryRequest.result;
                desktopRecovered = true;
            }
            // show three-dots button; click to expand vertical capsule menu
            if (data && (Array.isArray(data.pages) || Array.isArray(data.desktop)) && Array.isArray(data.dock)) {
                let pages = Array.isArray(data.pages) && data.pages.length > 0 ? data.pages : [data.desktop || []];
                // Some older records still have a usable copy of the first page.
                if (Array.isArray(pages[0]) && !pages[0].length && Array.isArray(data.desktop) && data.desktop.length) {
                    pages = [data.desktop, ...pages.slice(1)];
                    desktopRecovered = true;
                }
                const recovered = window.recoverEmptyDesktopLayout(pages, data.dock, recoveryRequest.result);
                desktopRecovered = desktopRecovered || recovered.changed;
                if (desktopRecovered) preserveDamagedDesktopLayout(originalData);
                try {
                    renderLayout(recovered.pages, recovered.dock, data.currentPage || 0, recovered.desktopRows ?? data.desktopRows);
                } catch (error) {
                    console.error('Desktop layout restoration failed:', error);
                    preserveDamagedDesktopLayout(originalData);
                    if (!isUsableDesktopLayout(recoveryRequest.result) || data === recoveryRequest.result) return;
                    data = recoveryRequest.result;
                    renderLayout(data.pages || [data.desktop], data.dock, data.currentPage || 0, data.desktopRows);
                    desktopRecovered = true;
                }
                const viewStateRequest = store.get("desktopViewState");
                viewStateRequest.onsuccess = () => {
                    const savedPage = Number(viewStateRequest.result?.currentPage);
                    if (!Number.isFinite(savedPage) || typeof window.switchDesktopPage !== 'function') return;
                    window.switchDesktopPage(savedPage, { skipSave: true, skipCommit: true });
                };
                let placeholderAppsMigrated = false;
                if (data.placeholderAppsV1 !== true && typeof window.ensurePlaceholderAppsOnDesktop === 'function') {
                    window.ensurePlaceholderAppsOnDesktop('v1');
                    placeholderAppsMigrated = true;
                }
                if (data.placeholderAppsV2 !== true && typeof window.ensurePlaceholderAppsOnDesktop === 'function') {
                    window.ensurePlaceholderAppsOnDesktop('v2');
                    placeholderAppsMigrated = true;
                }
                if (data.placeholderAppsV3 !== true && typeof window.ensurePlaceholderAppsOnDesktop === 'function') {
                    window.ensurePlaceholderAppsOnDesktop('v3');
                    placeholderAppsMigrated = true;
                }
                if (data.placeholderAppsV4 !== true && typeof window.ensurePlaceholderAppsOnDesktop === 'function') {
                    window.ensurePlaceholderAppsOnDesktop('v4');
                    placeholderAppsMigrated = true;
                }
                if (data.placeholderAppsV5 !== true && typeof window.ensurePlaceholderAppsOnDesktop === 'function') {
                    window.ensurePlaceholderAppsOnDesktop('v5');
                    placeholderAppsMigrated = true;
                }
                if (data.placeholderAppsV6 !== true && typeof window.ensurePlaceholderAppsOnDesktop === 'function') {
                    window.ensurePlaceholderAppsOnDesktop('v6');
                    placeholderAppsMigrated = true;
                }
                if (data.placeholderAppsV7 !== true && typeof window.ensurePlaceholderAppsOnDesktop === 'function') {
                    window.ensurePlaceholderAppsOnDesktop('v7');
                    placeholderAppsMigrated = true;
                }
                if ((data.placeholderAppsV6Removed !== true || data.placeholderAppsCleanRemovedV2 !== true || data.placeholderAppsCleanRemovedV3 !== true) && typeof window.removeDeletedPlaceholderApps === 'function') {
                    window.removeDeletedPlaceholderApps();
                    placeholderAppsMigrated = true;
                }
                if (data.placeholderAppIconsV1 !== true && typeof window.updatePlaceholderAppIcons === 'function') {
                    window.updatePlaceholderAppIcons();
                    placeholderAppsMigrated = true;
                }
                if (data.placeholderAppIconsV2 !== true && typeof window.updatePlaceholderAppIcons === 'function') {
                    window.updatePlaceholderAppIcons();
                    placeholderAppsMigrated = true;
                }
                if (data.placeholderAppMetadataV1 !== true && typeof window.updatePlaceholderAppIcons === 'function') {
                    window.updatePlaceholderAppIcons();
                    placeholderAppsMigrated = true;
                }
                if (data.builtinSvgIconsV1 !== true && typeof window.normalizeBuiltinDesktopIcon === 'function') {
                    // Re-save the existing layout after the renderer normalizes legacy default images.
                    placeholderAppsMigrated = true;
                }
                if (placeholderAppsMigrated || desktopRecovered) {
                    saveLayout();
                }
            } else {
            // show three-dots button; click to expand vertical capsule menu
                renderDefaultLayout();
            }
        };

            // show three-dots button; click to expand vertical capsule menu
        const wpRequest = store.get("wallpaperData");
        wpRequest.onsuccess = (e) => {
            const wpData = e.target.result;
            if (wpData && wpData.wallpapers) {
                wallpapers = wpData.wallpapers;
                if (wpData.current) {
                    applyWallpaperToDesktop(wpData.current);
                }
            }
            renderWallpapers();
        };

        // 加载自定义小组件（用户创建的组件库）
        loadCustomWidgetsData();

            // show three-dots button; click to expand vertical capsule menu
        const presetRequest = store.get("presetData");
        presetRequest.onsuccess = (e) => {
            const pData = e.target.result;
            if (pData && pData.presets) {
                presets = pData.presets;
            }
            
            // show three-dots button; click to expand vertical capsule menu
            let defaultPresetIndex = presets.findIndex(p => p.id === "default_theme_001");
            const getOfficialWidgetByName = (name) => {
                const list = window.officialWidgets || [];
                const target = list.find(w => w && w.name === name);
                return target && target.content ? encodeURIComponent(target.content) : '';
            };

            const defaultPreset = {
                id: "default_theme_001",
                name: "默认主题",
                date: "系统内置",
                wallpaper: null,
                sizeMB: 0.01,
                pages: [
                    [
                        { index: 0, name: '时间胶囊', appId: 'widget-default-time', isWidget: true, presetSize: '4x2', widgetContent: getOfficialWidgetByName('时间胶囊') },
                        { index: 8, name: '今日', appId: 'placeholder-today', icon: null },
                        { index: 9, name: '相册', appId: 'placeholder-photos', icon: null },
                        { index: 10, name: '可爱气泡对话', appId: 'widget-default-cute-bubble', isWidget: true, presetSize: '2x2', widgetContent: getOfficialWidgetByName('可爱气泡对话') },
                        { index: 12, name: 'wechat', appId: 'wechat', icon: null },
                        { index: 13, name: 'Contacts', appId: 'contacts', icon: null },
                        { index: 16, name: '双层拍立得', appId: 'widget-default-polaroid', isWidget: true, presetSize: '2x2', widgetContent: getOfficialWidgetByName('双层拍立得') },
                        { index: 18, name: '世界书', appId: 'worldbook', icon: null },
                        { index: 19, name: '设置', appId: 'settings', icon: null },
                        { index: 22, name: '音乐', appId: 'placeholder-music', icon: null },
                        { index: 23, name: 'Apple store', appId: 'applestore', icon: null }
                    ],
                    [
                        { index: 0, name: '小猫日记', appId: 'widget-default-cat-space', isWidget: true, presetSize: '4x4', widgetContent: getOfficialWidgetByName('小猫日记') },
                        { index: 16, name: 'B站', appId: 'placeholder-bilibili', icon: null },
                        { index: 17, name: '游戏中心', appId: 'placeholder-game-center', icon: null },
                        { index: 18, name: 'ins头像对话', appId: 'widget-default-duo-dialog', isWidget: true, presetSize: '2x2', widgetContent: getOfficialWidgetByName('ins头像对话') },
                        { index: 20, name: '阅读', appId: 'placeholder-reading', icon: null },
                        { index: 21, name: '记忆', appId: 'memory', icon: null }
                    ],
                    [
                        { index: 1, name: '甜美头像圈', appId: 'widget-default-cute-ring', isWidget: true, presetSize: '2x2', widgetContent: getOfficialWidgetByName('甜美头像圈') },
                        { index: 8, name: '见面', appId: 'meeting', icon: null },
                        { index: 9, name: 'Diary', appId: 'placeholder-icity', icon: null },
                        { index: 10, name: '健康', appId: 'placeholder-health', icon: null },
                        { index: 11, name: 'MCP', appId: 'mcp', icon: null },
                        { index: 12, name: 'Twitter', appId: 'twitter', icon: null },
                        { index: 16, name: '音乐播放器', appId: 'widget-default-music', isWidget: true, presetSize: '4x2', widgetContent: getOfficialWidgetByName('音乐播放器') }
                    ]
                ],
                currentPage: 0,
                dock: [
                    { index: 0, name: '电话', appId: 'call', icon: null },
                    { index: 1, name: '信息', appId: 'message', icon: null },
                    { index: 2, name: '主题', appId: 'theme', icon: null }
                ]
            };
            defaultPreset.desktop = defaultPreset.pages[0];
            
            if (defaultPresetIndex === -1) {
                presets.unshift(defaultPreset); // 如果没有，插入到最前面
            } else {
                presets[defaultPresetIndex] = defaultPreset; // 如果已有，强制更新为最新的完整列表
            }
            savePresetData(); // 保存到数据库

        };

            // show three-dots button; click to expand vertical capsule menu
        const fontRequest = store.get("fontData");
        fontRequest.onsuccess = (e) => {
            const fData = e.target.result;
            if (fData && fData.fonts) {
                customFonts = fData.fonts;
                currentSelectedFont = fData.current || 'default';
                restoreFonts();
            } else {
            // show three-dots button; click to expand vertical capsule menu
                selectFont('default', document.querySelector('.font-list-item[data-font="default"]'), true);
            }
        };

            // show three-dots button; click to expand vertical capsule menu
       const apiRequest = store.get("apiData");
       apiRequest.onsuccess = (e) => {
           const aData = e.target.result;
           if (aData && aData.list) {
               apiDataList = aData.list;
               apiConnectedId = aData.connectedId;
           }
       };
        const voiceRequest = store.get("voiceData");
        voiceRequest.onsuccess = (e) => {
            const vData = e.target.result;
            if (vData && vData.list) {
                voiceDataList = vData.list;
                voiceConnectedId = vData.connectedId;
            }
        };
        const imageGenDataRequest = store.get("imageGenData");
        imageGenDataRequest.onsuccess = (e) => {
            const igData = e.target.result;
            if (igData && igData.list) {
                imageGenDataList = igData.list;
                imageGenConnectedId = igData.connectedId;
                imagePromptPresets = Array.isArray(igData.promptPresets) ? igData.promptPresets : [];
            }
        };
        const imageGenSettingsRequest = store.get("imageGenSettings");
        imageGenSettingsRequest.onsuccess = (e) => {
            const igSet = e.target.result;
            if (igSet && igSet.data) {
                imageGenSettings = Object.assign(imageGenSettings, igSet.data);
            }
        };
        const photoAlbumRequest = store.get(photoAlbumDataId);
        photoAlbumRequest.onsuccess = (e) => {
            const albumData = e.target.result;
            photoAlbumDataLoaded = true;
            const pendingItems = photoAlbumItems.slice();
            const nextItems = Array.isArray(albumData && albumData.items) ? albumData.items.slice() : [];
            photoAlbumItems.length = 0;
            nextItems.forEach(item => {
                if (!item || !item.src) return;
                photoAlbumItems.push({
                    id: item.id || ('photo-' + Date.now() + '-' + Math.random().toString(36).slice(2, 8)),
                    src: String(item.src || ''),
                    title: String(item.title || ''),
                    sourceName: String(item.sourceName || ''),
                    sourceType: String(item.sourceType || 'image'),
                    description: String(item.description || ''),
                    prompt: String(item.prompt || ''),
                    contactId: item.contactId || null,
                    createdAt: item.createdAt || new Date().toISOString()
                });
            });
            pendingItems.forEach(item => {
                if (!item || !item.src) return;
                if (photoAlbumItems.some(existing => existing.id === item.id)) return;
                photoAlbumItems.push(item);
            });
            if (typeof window.renderPhotosApp === 'function') window.renderPhotosApp();
        };

        // --- 加载相册配置、相簿、收藏夹与废纸篓数据 (童话集 IndexedDB) ---
        const photosAppReq = store.get("photosAppData");
        photosAppReq.onsuccess = (e) => {
            const pData = e.target.result;
            if (pData && pData.data) {
                window.photosAppData = pData.data;
                if (typeof window.onPhotosAppDataLoaded === 'function') {
                    window.onPhotosAppDataLoaded(pData.data);
                }
            }
        };

            // show three-dots button; click to expand vertical capsule menu
        const profileRequest = store.get("profileData");
        profileRequest.onsuccess = (e) => {
            const pData = e.target.result;
            if (pData && pData.avatar) {
                const appleIdAvatar = document.getElementById('appleIdAvatarPreview');
                const settingsAvatar = document.getElementById('settingsAvatarPreview');
                if (appleIdAvatar) {
                    appleIdAvatar.innerHTML = '';
                    appleIdAvatar.style.backgroundImage = `url('${pData.avatar}')`;
                    appleIdAvatar.style.backgroundSize = 'cover';
                    appleIdAvatar.style.backgroundPosition = 'center';
                }
                if (settingsAvatar) {
                    settingsAvatar.innerHTML = '';
                    settingsAvatar.style.backgroundImage = `url('${pData.avatar}')`;
                    settingsAvatar.style.backgroundSize = 'cover';
                    settingsAvatar.style.backgroundPosition = 'center';
                }
            }
        };

            // show three-dots button; click to expand vertical capsule menu
        const ldRequest = store.get("localDriveSettings");
        ldRequest.onsuccess = (e) => {
            const ldData = e.target.result;
            if (ldData) {
                localDriveHandle = ldData.handle;
                localDriveMode = ldData.mode;
                localDriveFileName = ldData.fileName;
                autoBackupEnabled = ldData.autoEnabled;
                backupModeType = ldData.backupMode;
                
            // show three-dots button; click to expand vertical capsule menu
                document.getElementById('ld-current-mode').innerText = ldData.mode === 'folder' ? '文件夹模式' : (ldData.mode === 'file' ? '单文件模式' : '未设置');
                document.getElementById('ld-target-name').innerText = ldData.targetName || '--';
                document.getElementById('ld-file-name').innerText = ldData.fileName || '--';
                document.getElementById('ld-last-time').innerText = ldData.lastTime || '--';
                document.getElementById('ld-last-size').innerText = ldData.lastSize || '--';
                
                const modeMap = { 'action': '每次修改时', 'interval': '间隔时间备份', 'scheduled': '定时备份' };
                const unitMap = { '60000': '分钟', '3600000': '小时' };
                const modeVal = ldData.backupMode || 'action';
                const unitVal = ldData.intervalUnit || '60000';
                
                const modeTextEl = document.getElementById('autoBackupModeText');
                if(modeTextEl) { modeTextEl.setAttribute('data-value', modeVal); modeTextEl.innerText = modeMap[modeVal]; }
                
                document.getElementById('backupIntervalValue').value = ldData.intervalValue || '30';
                
                const unitTextEl = document.getElementById('backupIntervalUnitText');
                if(unitTextEl) { unitTextEl.setAttribute('data-value', unitVal); unitTextEl.innerText = unitMap[unitVal]; }
                
                document.getElementById('backupScheduledTime').value = ldData.scheduledTime || '02:00';
                
                const toggleBtn = document.getElementById('autoBackupToggle');
                if (autoBackupEnabled) {
                    toggleBtn.classList.remove('off');
                } else {
                    toggleBtn.classList.add('off');
                }
                
            // show three-dots button; click to expand vertical capsule menu
                changeBackupMode(); 
            }
        };

        // --- 加载世界书数据；聊天请求会等待该读取完成，避免启动阶段漏注入 ---
        const wbRequest = store.get("worldbookData");
        wbRequest.onsuccess = (e) => {
            try {
                const wbData = e.target.result;
                if (wbData) {
                    wbGroups = Array.isArray(wbData.groups) ? wbData.groups : [];
                    wbEntries = Array.isArray(wbData.entries) ? wbData.entries : [];
                } else {
                    wbGroups = [{ id: 'default_unclassified', name: '未分类', isPinned: false }];
                    wbEntries = [];
                }
            } finally {
                markWorldbookDataLoaded();
            }
        };
        wbRequest.onerror = (e) => {
            console.warn('Worldbook data load failed:', e);
            if (!Array.isArray(wbGroups) || wbGroups.length === 0) {
                wbGroups = [{ id: 'default_unclassified', name: '未分类', isPinned: false }];
            }
            if (!Array.isArray(wbEntries)) wbEntries = [];
            markWorldbookDataLoaded();
        };

        // --- 新增：加载微信聊天壁纸数据 ---
        const wcBgRequest = store.get("wechatBgData");
        wcBgRequest.onsuccess = (e) => {
            const data = e.target.result;
            if (data) {
                wcChatBgList = data.list || [];
                wcCurrentChatBg = data.current || '';
                if (typeof wcApplyChatBg === 'function') wcApplyChatBg();
            }
        };

        // --- 加载微信朋友圈数据 ---
        const wcMomentsRequest = store.get("wechatMomentsData");
        wcMomentsRequest.onsuccess = (e) => {
            const data = e.target.result;
            if (data) {
                const originalList = Array.isArray(data.list) ? data.list : [];
                wcMomentsList = originalList.filter(post => {
                    const isFirstPlaceholder = post?.id === 'm1'
                        && post?.name === '早虞春'
                        && post?.text === '今天的天气很好，适合散步。';
                    const isSecondPlaceholder = post?.id === 'm2'
                        && post?.name === '早虞春'
                        && post?.text === '分享一些最近的随手拍。';
                    return !isFirstPlaceholder && !isSecondPlaceholder;
                });
                if (wcMomentsList.length !== originalList.length) wcSaveMomentsData();
            } else {
                wcMomentsList = [];
            }
            if (typeof wcRenderMoments === 'function') {
                wcRenderMoments();
            }
        };

        // --- 加载微信朋友圈个人资料数据 ---
        const wcMomentsProfileReq = store.get("wechatMomentsProfileData");
        wcMomentsProfileReq.onsuccess = (e) => {
            const data = e.target.result;
            if (data && data.profile) {
                const profile = data.profile;
                const isLegacyPlaceholder = profile.name === '早虞春'
                    && profile.id === '@zoouiy'
                    && profile.bio === 'i luv u <3…🤍';
                wcMomentsProfile = isLegacyPlaceholder
                    ? { ...profile, name: '', id: '', bio: '' }
                    : profile;
                if (isLegacyPlaceholder) wcSaveMomentsProfileData();
            } else {
                wcMomentsProfile = { bg: '', avatar: '', name: '', id: '', bio: '' };
            }
            if (typeof wcRenderMomentsProfile === 'function') wcRenderMomentsProfile();
        };

        // --- 加载微信联系人数据 ---
        const wcContactsRequest = store.get("wechatContactsData");
        wcContactsRequest.onsuccess = (e) => {
            const data = e.target.result;
            if (data) {
                const sampleIds = new Set(['c1', 'c2', 'c3', 'c4']);
                wcContactsList = (Array.isArray(data.contacts) ? data.contacts : []).filter(contact => !sampleIds.has(contact?.id));
                wcContactGroups = Array.isArray(data.groups) ? data.groups.slice() : [];
                const groupUsed = wcContactsList.some(contact => contact.groupId === 'g_group');
                if (!groupUsed) wcContactGroups = wcContactGroups.filter(group => group.id !== 'g_group');
                if (!wcContactGroups.some(group => group.id === 'g_member')) wcContactGroups.unshift({ id: 'g_member', name: 'Member' });
                const cleaned = wcContactsList.length !== (Array.isArray(data.contacts) ? data.contacts.length : 0)
                    || wcContactGroups.length !== (Array.isArray(data.groups) ? data.groups.length : 0);
                if (cleaned) wcSaveContactsData();
            } else {
                wcContactGroups = [{ id: 'g_member', name: 'Member' }];
                wcContactsList = [];
            }
            if (typeof wcRenderContactTabs === 'function') {
                wcRenderContactTabs();
                wcRenderContactList();
            }
        };

        // --- 加载微信表情包数据 ---
        const wcEmojiRequest = store.get("wechatEmojiData");
        wcEmojiRequest.onsuccess = (e) => {
            const data = e.target.result;
            if (data && data.groups) {
                wcEmojiGroups = data.groups;
            } else {
                // 默认数据 (已清空占位)
                wcEmojiGroups = [];
            }
        };

        // --- 加载音乐 App 数据 ---
        const musicRequest = store.get("musicAppData");
        musicRequest.onsuccess = (e) => {
            const mData = e.target.result;
            if (mData && mData.data) {
                musicAppData = mData.data;
            }
            if (typeof applemusicLoadAllData === 'function') {
                applemusicLoadAllData();
            }
        };

        // --- 新增：加载阅读 APP 数据 ---
        const readenRequest = store.get("readenAppData");
        readenRequest.onsuccess = (e) => {
            const rData = e.target.result;
            if (rData && rData.data) {
                readenBooksData = Array.isArray(rData.data.books) ? rData.data.books : [];
                readenGroups = Array.isArray(rData.data.groups) && rData.data.groups.length
                    ? rData.data.groups
                    : ['全部'];
                readenCoverThemes = Array.isArray(rData.data.coverThemes) ? rData.data.coverThemes : [];
                readenGlobalThemeIndex = Number.isFinite(Number(rData.data.globalThemeIndex))
                    ? Number(rData.data.globalThemeIndex)
                    : 0;
                readenSettings = rData.data.settings && typeof rData.data.settings === 'object'
                    ? rData.data.settings
                    : { font: 'inherit', bg: null, profileName: '', profileAvatar: '', profileSign: '' };
            }
            markReadenAppDataLoaded();
            if (readenAppDataSavePending) {
                readenAppDataSavePending = false;
                saveReadenAppData();
            }
        };
        readenRequest.onerror = (error) => {
            console.error('阅读 APP 数据加载失败:', error);
            markReadenAppDataLoaded();
        };

        // --- 新增：加载短信 APP 数据 ---
        const messageRequest = store.get("messageAppData");
        messageRequest.onsuccess = (e) => {
            const msgData = e.target.result;
            if (msgData && msgData.data) {
                messageAppData = msgData.data;
            }
        };

        // --- 新增：加载电话 APP 通话记录数据 ---
        const callingHistoryRequest = store.get("callingHistoryData");
        callingHistoryRequest.onsuccess = (e) => {
            const cData = e.target.result;
            if (cData && Array.isArray(cData.history)) {
                callingHistoryData = cData.history;
                if (window.CallApp) {
                    window.CallApp.callHistory = callingHistoryData;
                    if (typeof window.CallApp.renderRecentCalls === 'function') {
                        window.CallApp.renderRecentCalls();
                    }
                }
            }
        };

        // --- 新增：加载 Apple Store 数据 ---
        const storeAppRequest = store.get("storeAppData");
        storeAppRequest.onsuccess = (e) => {
            const sData = e.target.result;
            if (sData && sData.data) {
                storeAppData = sData.data;
                if (typeof window.renderStoreAppUI === 'function') {
                    window.renderStoreAppUI();
                }
            }
        };

        // Device-local UI calibration stays outside portable app settings.
        const deviceLocalSettingsRequest = store.get(DEVICE_LOCAL_SETTINGS_ID);
        deviceLocalSettingsRequest.onsuccess = (e) => {
            const storedDeviceSettings = e.target.result;
            if (storedDeviceSettings && storedDeviceSettings.data) {
                deviceLocalSettings = Object.assign(deviceLocalSettings, storedDeviceSettings.data);
            }
            applyDeviceLocalSettings();
        };
        deviceLocalSettingsRequest.onerror = () => applyDeviceLocalSettings();

        // --- 加载全局设置数据 ---
        const settingsRequest = store.get("appSettings");
        settingsRequest.onsuccess = (e) => {
            const sData = e.target.result;
            if (sData && sData.data) {
                appSettings = Object.assign(appSettings, sData.data);
            }
            appSettingsLoaded = true;
            // Notify late-mounted runtime features when persisted settings are ready.
            window.dispatchEvent(new Event('tonghuaji:app-settings-ready'));
            
            // 在数据加载完成后执行初始化
            applyStatusBarVisibility();
            initThemeAndBrightness();
            initBackgroundKeepAlive();
            applyMessageNotifications();
            if (typeof window.applyPageAdaptSettings === 'function') {
                window.applyPageAdaptSettings();
            }
            
            wcPresets = appSettings.wc_presets || [];
            wcCurrentPresetId = appSettings.wc_current_preset_id;
            
            if (appSettings.wc_custom_css) {
                const cssInput = document.getElementById('wc-custom-css-input');
                if (cssInput) cssInput.value = appSettings.wc_custom_css;
                wcApplyCustomCss(appSettings.wc_custom_css);
            }

            wcTimestampEnabled = appSettings.wc_timestamp_enabled;
            wcApplyTimestampSettings();
            wcApplyTimeAwarenessSettings();
            
            wcCurrentBubbleTheme = appSettings.wc_bubble_theme || 'image';
            wcCurrentColorScheme = appSettings.wc_bubble_color || 'default';
            wcApplyBubbleTheme();
            
            if (appSettings.wc_avatar_settings) {
                wcAvatarSettings = appSettings.wc_avatar_settings;
            }
            initWcAvatarSettings();
            initWcFontSettings();
            if (typeof window.applyDesktopIconAppearance === 'function') {
                window.applyDesktopIconAppearance();
            }
            if (typeof window.applyDesktopCustomStyles === 'function') {
                window.applyDesktopCustomStyles();
            }
            if (typeof window.applyDesktopCustomScripts === 'function' && appSettings.desktop_custom_js) {
                window.applyDesktopCustomScripts(appSettings.desktop_custom_js);
            }

            if (appSettingsSavePending) {
                appSettingsSavePending = false;
                saveAppSettings();
            }
            if (typeof wcFlushPendingMomentsData === 'function') {
                wcFlushPendingMomentsData();
            }
            if (typeof wcLoadMomentsDataForCurrentAccount === 'function') {
                wcLoadMomentsDataForCurrentAccount();
            }
            // Chat history is account-scoped. Wait until the active account settings are available
            // so an unscoped legacy record cannot overwrite the selected account's messages.
            if (typeof window.wcReloadChatDataFromStorage === 'function') {
                window.wcReloadChatDataFromStorage().catch(error => {
                    console.error('微信聊天记录加载失败:', error);
                });
            }
        };
    }

    let currentWallpaperSrc = null;

    function saveWallpaperData() {
        if (!db) return;
        const transaction = db.transaction([storeName], "readwrite");
        const store = (window.CharacterRecordCleanup?.wrap(transaction.objectStore(storeName)) || transaction.objectStore(storeName));
        store.put({ id: "wallpaperData", wallpapers: wallpapers, current: currentWallpaperSrc });
        
        if (typeof triggerAutoLocalBackup === 'function') triggerAutoLocalBackup();
    }
    window.saveWallpaperData = saveWallpaperData;

    function saveProfileData(avatarUrl) {
        if (!db) return;
        const transaction = db.transaction([storeName], "readwrite");
        const store = (window.CharacterRecordCleanup?.wrap(transaction.objectStore(storeName)) || transaction.objectStore(storeName));
        store.put({ id: "profileData", avatar: avatarUrl });
        
        if (typeof triggerAutoLocalBackup === 'function') triggerAutoLocalBackup();
    }


    function saveAppSettings() {
        if (!db || !appSettingsLoaded) {
            appSettingsSavePending = true;
            return;
        }
        const transaction = db.transaction([storeName], "readwrite");
        const store = (window.CharacterRecordCleanup?.wrap(transaction.objectStore(storeName)) || transaction.objectStore(storeName));
        store.put({ id: "appSettings", data: appSettings });
        // A backup must read the record only after this settings write is durable.
        transaction.oncomplete = () => {
            if (typeof triggerAutoLocalBackup === 'function') triggerAutoLocalBackup();
        };
    }


    function savePresetData() {
        if (!db) return;
        const transaction = db.transaction([storeName], "readwrite");
        const store = (window.CharacterRecordCleanup?.wrap(transaction.objectStore(storeName)) || transaction.objectStore(storeName));
        store.put({ id: "presetData", presets: presets });
        
        if (typeof triggerAutoLocalBackup === 'function') triggerAutoLocalBackup();
    }


    function saveFontData(options = {}) {
        if (!db) return Promise.resolve(false);

        const skipAutoBackup = options && options.skipAutoBackup === true;
        return new Promise((resolve) => {
            let transaction;
            try {
                transaction = db.transaction([storeName], "readwrite");
                const store = (window.CharacterRecordCleanup?.wrap(transaction.objectStore(storeName)) || transaction.objectStore(storeName));
                const slider = document.getElementById('fontSizeSlider');
                const currentSize = slider ? slider.value : 18;
                store.put({ id: "fontData", fonts: customFonts, current: currentSelectedFont, size: currentSize });
            } catch (error) {
                console.error('保存字体数据失败:', error);
                resolve(false);
                return;
            }

            transaction.oncomplete = () => {
                if (!skipAutoBackup && typeof triggerAutoLocalBackup === 'function') {
                    triggerAutoLocalBackup();
                }
                resolve(true);
            };
            transaction.onerror = () => {
                console.error('保存字体数据失败:', transaction.error);
                resolve(false);
            };
            transaction.onabort = () => {
                console.error('保存字体数据已中止:', transaction.error);
                resolve(false);
            };
        });
    }


    function wcSaveMomentsData() {
        if (!db) return;
        const transaction = db.transaction([storeName], "readwrite");
        const store = (window.CharacterRecordCleanup?.wrap(transaction.objectStore(storeName)) || transaction.objectStore(storeName));
        store.put({ id: "wechatMomentsData", list: wcMomentsList });
        if (typeof triggerAutoLocalBackup === 'function') triggerAutoLocalBackup();
    }


    function wcSaveMomentsProfileData() {
        if (!db) return;
        const transaction = db.transaction([storeName], "readwrite");
        const store = (window.CharacterRecordCleanup?.wrap(transaction.objectStore(storeName)) || transaction.objectStore(storeName));
        store.put({ id: "wechatMomentsProfileData", profile: wcMomentsProfile });
        if (typeof triggerAutoLocalBackup === 'function') triggerAutoLocalBackup();
    }


    function wcSaveContactsData() {
        if (!db) return;
        const transaction = db.transaction([storeName], "readwrite");
        const store = (window.CharacterRecordCleanup?.wrap(transaction.objectStore(storeName)) || transaction.objectStore(storeName));
        store.put({ id: "wechatContactsData", groups: wcContactGroups, contacts: wcContactsList });
        if (typeof triggerAutoLocalBackup === 'function') triggerAutoLocalBackup();
    }


    function wcSaveChatBgDataToDB() {
        if (!db) return;
        const transaction = db.transaction([storeName], "readwrite");
        const store = (window.CharacterRecordCleanup?.wrap(transaction.objectStore(storeName)) || transaction.objectStore(storeName));
        store.put({ id: "wechatBgData", list: wcChatBgList, current: wcCurrentChatBg });
        if (typeof triggerAutoLocalBackup === 'function') triggerAutoLocalBackup();
    }


    function wcApplyStoredChatData(conversations) {
        const nextConversations = {};
        if (conversations && typeof conversations === 'object' && !Array.isArray(conversations)) {
            Object.entries(conversations).forEach(([contactId, messages]) => {
                if (!Array.isArray(messages)) return;
                nextConversations[contactId] = messages.filter(message => (
                    message
                    && (message.type === 'sent' || message.type === 'received' || message.type === 'system_event')
                    && typeof message.text === 'string'
                ));
            });
        }
        wcChatMessagesByContact = nextConversations;
        wcChatDataHydrated = true;
        if (typeof wcRenderChatMessages === 'function' && typeof wcCurrentChatContactId !== 'undefined' && wcCurrentChatContactId) {
            wcRenderChatMessages(wcCurrentChatContactId);
        }
        if (typeof wcRenderChatList === 'function') wcRenderChatList();
    }

    function wcCloneChatData(conversations) {
        if (typeof structuredClone === 'function') return structuredClone(conversations || {});
        return JSON.parse(JSON.stringify(conversations || {}));
    }

    function wcReloadChatDataFromStorage() {
        if (!db) return Promise.resolve(false);
        return new Promise((resolve, reject) => {
            const accountId = typeof wcGetCurrentAccountId === 'function' ? wcGetCurrentAccountId() : 'default';
            const transaction = db.transaction([storeName], "readonly");
            const store = (window.CharacterRecordCleanup?.wrap(transaction.objectStore(storeName)) || transaction.objectStore(storeName));
            
            const applyStoredRecord = record => {
                if (wcChatDataDirty) return;
                wcApplyStoredChatData(record?.conversations || record?.messages || null);
            };
            const accountRequest = store.get(`wechatChatData_${accountId}`);
            accountRequest.onsuccess = () => {
                if (wcChatDataDirty) return;
                const accountConversations = accountRequest.result?.conversations || accountRequest.result?.messages;
                if (accountConversations) {
                    applyStoredRecord(accountRequest.result);
                    return;
                }

                const legacyRequest = store.get("wechatChatData");
                legacyRequest.onsuccess = () => applyStoredRecord(legacyRequest.result);
                legacyRequest.onerror = () => applyStoredRecord(null);
            };
            accountRequest.onerror = () => {
                const legacyRequest = store.get("wechatChatData");
                legacyRequest.onsuccess = () => applyStoredRecord(legacyRequest.result);
                legacyRequest.onerror = () => applyStoredRecord(null);
            };
            transaction.oncomplete = () => resolve(wcChatDataHydrated);
            transaction.onerror = () => reject(transaction.error || new Error('微信聊天记录刷新失败'));
        });
    }

    function wcSaveChatData(options = {}) {
        if (!db || window.__tonghuajiBackupRestoreInProgress) return Promise.resolve(false);
        wcChatDataDirty = true;
        const snapshot = wcCloneChatData(wcChatMessagesByContact);
        const accountId = typeof wcGetCurrentAccountId === 'function' ? wcGetCurrentAccountId() : 'default';
        wcChatSaveQueue = wcChatSaveQueue
            .catch(() => false)
            .then(() => new Promise((resolve, reject) => {
                if (window.__tonghuajiBackupRestoreInProgress) {
                    resolve(false);
                    return;
                }
                const transaction = db.transaction([storeName], "readwrite");
                const store = (window.CharacterRecordCleanup?.wrap(transaction.objectStore(storeName)) || transaction.objectStore(storeName));
                store.put({ id: "wechatChatData", conversations: snapshot });
                if (accountId && accountId !== 'default') {
                    store.put({ id: `wechatChatData_${accountId}`, conversations: snapshot });
                }
                transaction.oncomplete = () => resolve(true);
                transaction.onerror = () => reject(transaction.error || new Error('微信聊天记录保存失败'));
            }))
            .then(result => {
                if (result && options.skipAutoBackup !== true && typeof triggerAutoLocalBackup === 'function') triggerAutoLocalBackup();
                return result;
            })
            .catch(error => {
                console.error('微信聊天记录保存失败:', error);
                return false;
            });
        return wcChatSaveQueue;
    }

    function persistCurrentStateBeforeBackground() {
        // Only write snapshots after all layout-store reads completed, avoiding default-state overwrites during startup.
        if (window.__tonghuajiBackupRestoreInProgress || !db || !layoutStoreLoaded || !appSettingsLoaded) return;
        saveLayout();
        saveAppSettings();
        if (wcChatDataHydrated || wcChatDataDirty) void wcSaveChatData();
        if (typeof savePhotoAlbumData === 'function') savePhotoAlbumData();
        if (typeof saveWorldbookData === 'function') saveWorldbookData();
        if (typeof saveMusicAppData === 'function') saveMusicAppData();
        if (typeof window.flushReadenReaderProgressSave === 'function') window.flushReadenReaderProgressSave();
        if (typeof saveReadenAppData === 'function') saveReadenAppData();
        if (typeof saveMessageAppData === 'function') saveMessageAppData();
        if (typeof saveCustomWidgetsData === 'function') saveCustomWidgetsData();
        if (typeof saveTwitterAppData === 'function') saveTwitterAppData();
        if (typeof saveStoreAppData === 'function') saveStoreAppData();
    }

    document.addEventListener('visibilitychange', () => {
        if (document.visibilityState === 'hidden') persistCurrentStateBeforeBackground();
    });
    window.addEventListener('pagehide', persistCurrentStateBeforeBackground);

    function wcSaveEmojiData() {
        if (!db) return;
        const transaction = db.transaction([storeName], "readwrite");
        const store = (window.CharacterRecordCleanup?.wrap(transaction.objectStore(storeName)) || transaction.objectStore(storeName));
        store.put({ id: "wechatEmojiData", groups: wcEmojiGroups });
        if (typeof triggerAutoLocalBackup === 'function' && !wcEmojiBackupScheduled) {
            wcEmojiBackupScheduled = true;
            const runBackup = () => {
                wcEmojiBackupScheduled = false;
                triggerAutoLocalBackup();
            };
            if (typeof window.requestIdleCallback === 'function') {
                window.requestIdleCallback(runBackup, { timeout: 2000 });
            } else {
                window.setTimeout(runBackup, 0);
            }
        }
    }


    function saveWorldbookData() {
        if (!db) return;
        const transaction = db.transaction([storeName], "readwrite");
        const store = (window.CharacterRecordCleanup?.wrap(transaction.objectStore(storeName)) || transaction.objectStore(storeName));
        store.put({ id: "worldbookData", groups: wbGroups, entries: wbEntries });
        if (typeof triggerAutoLocalBackup === 'function') triggerAutoLocalBackup();
    }


   function saveApiData() {
       if (!db) return;
       const transaction = db.transaction([storeName], "readwrite");
       const store = (window.CharacterRecordCleanup?.wrap(transaction.objectStore(storeName)) || transaction.objectStore(storeName));
       store.put({ id: "apiData", list: apiDataList, connectedId: apiConnectedId });
       
       if (typeof triggerAutoLocalBackup === 'function') triggerAutoLocalBackup();
   }
    function saveVoiceData() {
        if (!db) return;
        const transaction = db.transaction([storeName], "readwrite");
        const store = (window.CharacterRecordCleanup?.wrap(transaction.objectStore(storeName)) || transaction.objectStore(storeName));
        store.put({ id: "voiceData", list: voiceDataList, connectedId: voiceConnectedId });
        if (typeof triggerAutoLocalBackup === 'function') triggerAutoLocalBackup();
    }
    function saveImageGenData() {
        if (!db) return;
        const transaction = db.transaction([storeName], "readwrite");
        const store = (window.CharacterRecordCleanup?.wrap(transaction.objectStore(storeName)) || transaction.objectStore(storeName));
        store.put({ id: "imageGenData", list: imageGenDataList, connectedId: imageGenConnectedId, promptPresets: imagePromptPresets });
        if (typeof triggerAutoLocalBackup === 'function') triggerAutoLocalBackup();
    }
    function saveImageGenSettings() {
        if (!db) return;
        const transaction = db.transaction([storeName], "readwrite");
        const store = (window.CharacterRecordCleanup?.wrap(transaction.objectStore(storeName)) || transaction.objectStore(storeName));
        store.put({ id: "imageGenSettings", data: imageGenSettings });
        if (typeof triggerAutoLocalBackup === 'function') triggerAutoLocalBackup();
    }

    // Meeting image records share the existing store and backup pipeline.
    window.meetingImageStorage = function (id, operation = 'read', value = null) {
        return new Promise((resolve, reject) => {
            if (!db || !String(id).startsWith('meetingImage:')) {
                reject(new Error('线下生图存储尚未就绪'));
                return;
            }
            const tx = db.transaction([storeName], operation === 'read' ? 'readonly' : 'readwrite');
            const store = (window.CharacterRecordCleanup?.wrap(tx.objectStore(storeName)) || tx.objectStore(storeName));
            let result = null;
            if (operation === 'delete-prefix') {
                const request = store.openCursor(IDBKeyRange.bound(id, id + '\uffff'));
                request.onsuccess = () => {
                    const cursor = request.result;
                    if (cursor) { cursor.delete(); cursor.continue(); }
                };
            } else {
                const request = operation === 'read' ? store.get(id)
                    : operation === 'delete' ? store.delete(id) : store.put({ id, value });
                request.onsuccess = () => { result = request.result?.value ?? null; };
            }
            tx.oncomplete = () => {
                if (operation !== 'read' && typeof triggerAutoLocalBackup === 'function') triggerAutoLocalBackup();
                resolve(operation === 'read' ? result : value);
            };
            tx.onerror = tx.onabort = () => reject(tx.error || new Error('线下生图保存失败'));
        });
    };

    function photoAlbumBlobToDataUrl(blob) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = () => resolve(String(reader.result || ''));
            reader.onerror = () => reject(new Error('图片读取失败'));
            reader.readAsDataURL(blob);
        });
    }

    function photoAlbumLoadImage(src) {
        return new Promise((resolve, reject) => {
            const image = new Image();
            image.crossOrigin = 'anonymous';
            image.onload = () => resolve(image);
            image.onerror = () => reject(new Error('图片加载失败'));
            image.src = src;
        });
    }

    async function normalizePhotoAlbumImageSource(src) {
        const rawSrc = String(src || '').trim();
        if (!rawSrc) return '';
        if (/^data:image\//i.test(rawSrc)) return rawSrc;
        try {
            if (/^blob:/i.test(rawSrc) || /^data:/i.test(rawSrc)) {
                const response = await fetch(rawSrc);
                if (!response.ok) throw new Error('图片读取失败');
                return await photoAlbumBlobToDataUrl(await response.blob());
            }
            if (/^https?:\/\//i.test(rawSrc)) {
                try {
                    const response = await fetch(rawSrc, { mode: 'cors' });
                    if (response.ok) return await photoAlbumBlobToDataUrl(await response.blob());
                } catch (error) {
                    console.debug('相册远程图片 fetch 归一化失败:', error);
                }
                try {
                    const image = await photoAlbumLoadImage(rawSrc);
                    const canvas = document.createElement('canvas');
                    canvas.width = image.naturalWidth || image.width;
                    canvas.height = image.naturalHeight || image.height;
                    if (!canvas.width || !canvas.height) throw new Error('图片尺寸无效');
                    const context = canvas.getContext('2d');
                    context.drawImage(image, 0, 0);
                    return canvas.toDataURL('image/png');
                } catch (error) {
                    console.debug('相册远程图片画布归一化失败:', error);
                }
            }
        } catch (error) {
            console.debug('相册图片归一化失败:', error);
        }
        return rawSrc;
    }

    function savePhotoAlbumData() {
        if (!db) return;
        const transaction = db.transaction([storeName], "readwrite");
        const store = (window.CharacterRecordCleanup?.wrap(transaction.objectStore(storeName)) || transaction.objectStore(storeName));
        store.put({ id: photoAlbumDataId, items: photoAlbumItems });
        if (typeof triggerAutoLocalBackup === 'function') triggerAutoLocalBackup();
        if (typeof window.renderPhotosApp === 'function') window.renderPhotosApp();
    }

    async function recordGeneratedImageToAlbum(src, meta = {}) {
        const normalizedSrc = await normalizePhotoAlbumImageSource(src);
        if (!normalizedSrc) return null;
        const item = {
            id: 'photo-' + Date.now() + '-' + Math.random().toString(36).slice(2, 8),
            src: normalizedSrc,
            title: String(meta.title || meta.prompt || meta.sourceName || '生成图片').trim(),
            sourceName: String(meta.sourceName || (meta.sourceType === 'chat' ? '角色发图' : '生图')).trim(),
            sourceType: String(meta.sourceType || 'image'),
            prompt: String(meta.prompt || ''),
            contactId: meta.contactId || null,
            createdAt: meta.createdAt || new Date().toISOString()
        };
        photoAlbumItems.unshift(item);
        savePhotoAlbumData();
        return item;
    }
    function savePhotosAppData(payload) {
        if (!db) return;
        window.photosAppData = payload;
        const transaction = db.transaction([storeName], "readwrite");
        const store = (window.CharacterRecordCleanup?.wrap(transaction.objectStore(storeName)) || transaction.objectStore(storeName));
        store.put({ id: "photosAppData", data: payload });
        if (typeof triggerAutoLocalBackup === 'function') triggerAutoLocalBackup();
    }
    window.savePhotosAppData = savePhotosAppData;
    window.savePhotoAlbumData = savePhotoAlbumData;
    window.normalizePhotoAlbumImageSource = normalizePhotoAlbumImageSource;
    window.recordGeneratedImageToAlbum = recordGeneratedImageToAlbum;

    function saveMusicAppData() {
        if (!db) return;
        const transaction = db.transaction([storeName], "readwrite");
        const store = (window.CharacterRecordCleanup?.wrap(transaction.objectStore(storeName)) || transaction.objectStore(storeName));
        store.put({ id: "musicAppData", data: musicAppData });
        if (typeof triggerAutoLocalBackup === 'function') triggerAutoLocalBackup();
    }

    // --- 新增：保存阅读 APP 数据 ---
    function saveReadenAppData() {
        if (!db || !readenAppDataLoaded) {
            readenAppDataSavePending = true;
            return Promise.resolve(false);
        }

        const snapshot = {
            books: readenBooksData,
            groups: readenGroups,
            coverThemes: readenCoverThemes,
            globalThemeIndex: readenGlobalThemeIndex,
            settings: readenSettings
        };

        let transaction;
        try {
            transaction = db.transaction([storeName], "readwrite");
            (window.CharacterRecordCleanup?.wrap(transaction.objectStore(storeName)) || transaction.objectStore(storeName)).put({
                id: "readenAppData",
                data: snapshot
            });
        } catch (error) {
            console.error('保存阅读 APP 数据失败:', error);
            return Promise.resolve(false);
        }

        if (typeof window.renderReadenProfilePage === 'function') window.renderReadenProfilePage();

        return new Promise(resolve => {
            let settled = false;
            const finish = value => {
                if (settled) return;
                settled = true;
                resolve(value);
            };
            transaction.oncomplete = () => {
                if (typeof triggerAutoLocalBackup === 'function') triggerAutoLocalBackup();
                finish(true);
            };
            transaction.onerror = () => {
                console.error('保存阅读 APP 数据失败:', transaction.error);
                finish(false);
            };
            transaction.onabort = () => {
                console.error('保存阅读 APP 数据已中止:', transaction.error);
                finish(false);
            };
        });
    }

    // --- 新增：保存短信 APP 数据 ---
    function saveMessageAppData() {
        if (window.MessageApp && typeof window.MessageApp.persist === 'function') return window.MessageApp.persist();
        if (!db) return;
        const transaction = db.transaction([storeName], "readwrite");
        const store = (window.CharacterRecordCleanup?.wrap(transaction.objectStore(storeName)) || transaction.objectStore(storeName));
        store.put({ id: "messageAppData", data: messageAppData });
        if (typeof triggerAutoLocalBackup === 'function') triggerAutoLocalBackup();
    }
    window.saveMessageAppData = saveMessageAppData; // 暴露给外部文件调用

    // --- 新增：保存电话 APP 通话记录数据 ---
    function saveCallingHistoryData() {
        if (!db) return;
        const transaction = db.transaction([storeName], "readwrite");
        const store = (window.CharacterRecordCleanup?.wrap(transaction.objectStore(storeName)) || transaction.objectStore(storeName));
        store.put({ id: "callingHistoryData", history: callingHistoryData });
        if (typeof triggerAutoLocalBackup === 'function') triggerAutoLocalBackup();
    }
    window.saveCallingHistoryData = saveCallingHistoryData; // 暴露给外部文件调用

    window.addEventListener('contacts:characters-deleted', event => {
        if (!event.detail?.recordsPurged || !window.CharacterRecordCleanup) return;
        const clean = (id, data) => window.CharacterRecordCleanup.clean({ id, data })?.data;
        wcChatMessagesByContact = clean('wechatChatData', wcChatMessagesByContact) || {};
        wcMomentsList = clean('wechatMomentsData', wcMomentsList) || [];
        callingHistoryData = clean('callingHistoryData', callingHistoryData) || [];
        appSettings = clean('appSettings', appSettings) || appSettings;
        if (typeof photoAlbumItems !== 'undefined') photoAlbumItems = clean('photoAlbumData', photoAlbumItems) || [];
        if (window.photosAppData) {
            window.photosAppData = clean('photosAppData', window.photosAppData);
            window.onPhotosAppDataLoaded?.(window.photosAppData);
        }
        if (typeof musicAppData !== 'undefined') musicAppData = clean('musicAppData', musicAppData) || musicAppData;
        if (typeof readenBooksData !== 'undefined') readenBooksData = clean('readenAppData', readenBooksData) || [];
    });

    // --- 新增：保存 Apple Store 数据 ---
    function saveStoreAppData() {
        if (!db) return;
        const transaction = db.transaction([storeName], "readwrite");
        const store = (window.CharacterRecordCleanup?.wrap(transaction.objectStore(storeName)) || transaction.objectStore(storeName));
        store.put({ id: "storeAppData", data: storeAppData });
        if (typeof triggerAutoLocalBackup === 'function') triggerAutoLocalBackup();
    }
    window.saveStoreAppData = saveStoreAppData;

    function getPortableLocalStorageEntries() {
        const entries = {};
        let currentStoreKey = '';
        try {
            const accountId = (typeof appSettings !== 'undefined' && appSettings?.wc_current_user_id)
                || (typeof window.appSettings !== 'undefined' && window.appSettings?.wc_current_user_id)
                || '';
            currentStoreKey = `store_user_data_${accountId ? `mask_${accountId}` : 'mask_default_guest'}`;
            for (let index = 0; index < localStorage.length; index += 1) {
                const key = localStorage.key(index);
                if (!key || (!key.startsWith('meeting_') && key !== currentStoreKey)) continue;
                const value = localStorage.getItem(key);
                if (value !== null) entries[key] = value;
            }
        } catch (error) {
            console.warn('可迁移本地数据读取失败:', error);
        }
        return entries;
    }

    async function getAllDataFromDB() {
        // Flush the fanfiction editor before every full, ZIP, local-drive or GitHub snapshot.
        if (typeof window.FanfictionApp?.flushForBackup === 'function') await window.FanfictionApp.flushForBackup();
        if (window.WcGroupChat) await window.WcGroupChat.flush();
        try {
            if (typeof wcSaveChatData === 'function'
                && typeof wcChatDataHydrated !== 'undefined'
                && (wcChatDataHydrated || wcChatDataDirty)) {
                await wcSaveChatData({ skipAutoBackup: true });
            }
        } catch (error) {
            console.warn('导出前保存微信聊天记录失败:', error);
        }
        try {
            if (typeof window.MemoryApp?.preload === 'function') await window.MemoryApp.preload();
        } catch (error) {
            console.warn('导出前读取记忆状态失败:', error);
        }

        if (typeof window.storeFlushForBackup === 'function') await window.storeFlushForBackup();

        const data = await new Promise((resolve, reject) => {
            if (!db) return reject(new Error('本地数据库尚未就绪，无法生成完整备份'));
            const transaction = db.transaction([storeName], "readonly");
            const store = (window.CharacterRecordCleanup?.wrap(transaction.objectStore(storeName)) || transaction.objectStore(storeName));
            const request = store.getAll();
            request.onsuccess = (e) => {
                const allRecords = e.target.result;
                const dataObj = {};
                allRecords.forEach(record => {
                    if (
                        record.id === 'githubBackupSettings'
                        || record.id === 'memoryExternalCredentialsV1'
                        || record.id === DEVICE_LOCAL_SETTINGS_ID
                    ) return;
                    dataObj[record.id] = record;
                });
                const localStorageEntries = getPortableLocalStorageEntries();
                if (Object.keys(localStorageEntries).length > 0) {
                    dataObj.localStorageBackupV1 = {
                        id: 'localStorageBackupV1',
                        version: 1,
                        entries: localStorageEntries
                    };
                }
                resolve(dataObj);
            };
            request.onerror = () => reject(request.error || new Error('读取备份数据失败'));
        });
        if (!window.tonghuajiBackupCodec) throw new Error('备份转换组件未加载，请刷新后重试');
        return window.tonghuajiBackupCodec.encode(data);
    }


    // ===== 自定义小组件持久化 =====
    function saveCustomWidgetsData() {
        if (!db) return;
        const list = Array.isArray(window.customWidgets) ? window.customWidgets.map(function (w) {
            return {
                name: w.name || '',
                preview: w.preview || '',
                content: w.content || '',
                width: w.width || '',
                height: w.height || '',
                presetSize: w.presetSize || ''
            };
        }) : [];
        const transaction = db.transaction([storeName], "readwrite");
        const store = (window.CharacterRecordCleanup?.wrap(transaction.objectStore(storeName)) || transaction.objectStore(storeName));
        store.put({ id: "customWidgets", items: list });
    }
    window.saveCustomWidgetsData = saveCustomWidgetsData;

    function loadCustomWidgetsData() {
        if (!db) return;
        const transaction = db.transaction([storeName], "readonly");
        const store = (window.CharacterRecordCleanup?.wrap(transaction.objectStore(storeName)) || transaction.objectStore(storeName));
        const request = store.get("customWidgets");
        request.onsuccess = (e) => {
            const rec = e.target.result;
            if (rec && Array.isArray(rec.items)) {
                const target = window.customWidgets;
                if (Array.isArray(target)) {
                    target.length = 0;
                    rec.items.forEach(function (w) { target.push(w); });
                    if (typeof window.renderWidgetViews === 'function') window.renderWidgetViews();
                }
            }
        };
    }
    window.loadCustomWidgetsData = loadCustomWidgetsData;




