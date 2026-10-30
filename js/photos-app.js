(function () {
    const PHOTOS_APP_ID = 'photosAppUI';
    const ALBUMS_STORAGE_KEY = 'ios_photos_custom_albums_v2';
    const FAVORITES_STORAGE_KEY = 'ios_photos_favorites_v2';
    const TRASH_STORAGE_KEY = 'ios_photos_trash_v2';
    const PINNED_STORAGE_KEY = 'ios_photos_pinned_config_v1';
    const ALBUM_LAYOUT_STORAGE_KEY = 'ios_photos_album_layout_v1';
    const CURATED_SECTIONS_STORAGE_KEY = 'ios_photos_curated_sections_v1';

    // Inline description-edit icon supplied by the user.
    const PHOTO_DESCRIPTION_ICON = `<svg t="1792722976094" class="icon" viewBox="0 0 1025 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="5584" width="200" height="200" fill="currentColor" aria-hidden="true"><path d="M127.110228 701.648461q0 26.438928 18.812314 45.251241t46.268123 18.812314l253.203575 0 0 128.12711-318.284012 0q-26.438928 0-49.82721-9.660377t-40.675273-26.947368-26.947368-40.675273-9.660377-50.844091l0-637.584906q0-26.438928 9.660377-49.82721t26.947368-40.675273 40.675273-27.455809 49.82721-10.168818l766.728898 0q26.438928 0 49.82721 10.168818t40.675273 27.455809 27.455809 40.675273 10.168818 49.82721l0 187.106256-128.12711 1.016882q-2.033764-25.422046-19.829196-43.217478t-44.234359-17.795432l-637.584906 0q-27.455809 0-46.268123 18.812314t-18.812314 45.251241l0 382.347567zM1016.881827 501.322741q6.101291 9.151936 7.626614 23.388282t-10.677259 28.472691q-11.1857 14.236346-18.303873 21.354518l-8.135055 8.135055-105.75571-95.586892q5.084409-6.101291 14.236346-14.744786t14.236346-13.727905q14.236346-14.236346 30.506455-12.711023t27.455809 6.609732q12.202582 5.084409 26.438928 18.812314t22.3714 29.998014zM613.179742 789.100298q3.050645-3.050645 14.236346-16.270109t27.96425-32.540218 37.116187-42.200596 40.675273-46.268123q48.810328-54.911619 108.806356-122.025819l107.789474 95.586892q-59.996028 68.131082-108.806356 123.042701-20.337637 23.388282-40.675273 46.268123t-37.116187 41.183714-27.455809 29.998014-12.711023 13.727905q-9.151936 12.202582-25.422046 20.337637-7.118173 5.084409-21.354518 11.1857t-29.998014 12.202582-29.489573 10.677259-20.846077 5.59285q-26.438928 5.084409-23.388282-22.3714 1.016882-7.118173 4.067527-21.862959t6.609732-30.506455 7.118173-28.981132 5.59285-18.303873q5.084409-13.219464 17.286991-28.472691z" p-id="5585"></path></svg>`;

    const ALBUM_EMPTY_SVG = `<svg viewBox="0 0 1228 1024" version="1.1" xmlns="http://www.w3.org/2000/svg"><path d="M953.6 176H118.4c-48 0-86.4 28.8-86.4 67.2V896c0 38.4 38.4 67.2 86.4 67.2h844.8c48 0 76.8-28.8 76.8-67.2V243.2c9.6-38.4-38.4-67.2-86.4-67.2zM368 320c48 0 86.4 38.4 86.4 86.4 0 19.2-9.6 48-28.8 57.6-19.2 19.2-38.4 28.8-57.6 28.8-48 0-86.4-38.4-86.4-86.4S320 320 368 320z m518.4 556.8H195.2c-28.8 0-28.8-19.2-9.6-38.4l144-153.6c19.2-19.2 48-19.2 67.2-9.6l115.2 76.8c19.2 19.2 48 9.6 67.2-9.6l249.6-307.2c19.2-19.2 38.4-9.6 38.4 19.2l57.6 374.4c0 28.8-19.2 48-38.4 48z" fill="#999999"></path><path d="M1097.6 60.8H252.8c-48 0-86.4 28.8-86.4 67.2v19.2H992c48 0 86.4 28.8 86.4 67.2v643.2h19.2c48 0 76.8-28.8 76.8-67.2v-672c9.6-28.8-28.8-57.6-76.8-57.6z" fill="#999999"></path></svg>`;

    // 公共复用 SVG 图标字典（大幅精简上百行冗长硬编码代码）
    const PHOTO_ICONS = {
        album: `<svg viewBox="0 0 1024 1024" fill="currentColor"><path d="M256 64h512a192 192 0 0 1 192 192v512a192 192 0 0 1-192 192H256a192 192 0 0 1-192-192V256a192 192 0 0 1 192-192z m206.208 398.208h-199.04a49.792 49.792 0 0 0 0 99.584h199.04v199.04a49.792 49.792 0 1 0 99.584 0v-199.04h199.04a49.792 49.792 0 1 0 0-99.584h-199.04v-199.04a49.792 49.792 0 0 0-99.584 0v199.04z"></path></svg>`,
        edit: `<svg viewBox="0 0 1024 1024" fill="currentColor"><path d="M943.104 216.064q-8.192 9.216-15.36 16.384l-12.288 12.288q-6.144 6.144-11.264 10.24l-138.24-139.264q8.192-8.192 20.48-19.456t20.48-17.408q20.48-16.384 44.032-14.336t37.888 9.216q15.36 8.192 34.304 28.672t29.184 43.008q5.12 14.336 6.656 33.792t-15.872 36.864zM551.936 329.728l158.72-158.72 138.24 138.24q-87.04 87.04-158.72 157.696-30.72 29.696-59.904 58.88t-53.248 52.224-39.424 38.4l-18.432 18.432q-7.168 7.168-16.384 14.336t-20.48 12.288-31.232 12.288-41.472 13.824-40.96 12.288-29.696 6.656q-19.456 2.048-20.992-3.584t1.536-25.088q1.024-10.24 5.12-30.208t8.192-40.448 8.704-38.4 7.68-25.088q5.12-11.264 10.752-19.456t15.872-18.432zM899.072 478.208q21.504 0 40.96 10.24t19.456 41.984l0 232.448q0 28.672-10.752 52.736t-29.184 41.984-41.984 27.648-48.128 9.728l-571.392 0q-24.576 0-48.128-10.752t-41.472-29.184-29.184-43.52-11.264-53.76l0-570.368q0-20.48 11.264-42.496t29.184-39.936 40.448-29.696 45.056-11.776l238.592 0q28.672 0 40.448 20.992t11.776 42.496-11.776 41.472-40.448 19.968l-187.392 0q-21.504 0-34.816 14.848t-13.312 36.352l0 481.28q0 20.48 13.312 34.304t34.816 13.824l474.112 0q21.504 0 36.864-13.824t15.36-34.304l0-190.464q0-14.336 6.656-24.576t16.384-16.384 21.504-8.704 23.04-2.56z"></path></svg>`,
        localImport: `<svg viewBox="0 0 1228 1024" fill="currentColor"><path d="M953.6 176H118.4c-48 0-86.4 28.8-86.4 67.2V896c0 38.4 38.4 67.2 86.4 67.2h844.8c48 0 76.8-28.8 76.8-67.2V243.2c9.6-38.4-38.4-67.2-86.4-67.2zM368 320c48 0 86.4 38.4 86.4 86.4 0 19.2-9.6 48-28.8 57.6-19.2 19.2-38.4 28.8-57.6 28.8-48 0-86.4-38.4-86.4-86.4S320 320 368 320z m518.4 556.8H195.2c-28.8 0-28.8-19.2-9.6-38.4l144-153.6c19.2-19.2 48-19.2 67.2-9.6l115.2 76.8c19.2 19.2 48 9.6 67.2-9.6l249.6-307.2c19.2-19.2 38.4-9.6 38.4 19.2l57.6 374.4c0 28.8-19.2 48-38.4 48z"></path><path d="M1097.6 60.8H252.8c-48 0-86.4 28.8-86.4 67.2v19.2H992c48 0 86.4 28.8 86.4 67.2v643.2h19.2c48 0 76.8-28.8 76.8-67.2v-672c9.6-28.8-28.8-57.6-76.8-57.6z"></path></svg>`,
        urlUpload: `<svg viewBox="0 0 1024 1024" fill="currentColor"><path d="M410.848 461.408L284.352 587.84a71.552 71.552 0 0 0 0 101.184l50.624 50.592a71.52 71.52 0 0 0 101.152 0l126.464-126.464a143.04 143.04 0 0 1 0.064 202.272l-0.064 0.064-177.056 177.088a107.36 107.36 0 0 1-151.712 0L31.456 790.208a107.296 107.296 0 0 1-0.032-151.744l0.032-0.032 177.056-177.056a143.104 143.104 0 0 1 202.368 0v0.032z m202.304 101.184l126.56-126.464a71.552 71.552 0 0 0 0-101.184l-50.624-50.56a71.552 71.552 0 0 0-101.184 0L461.44 410.88a143.104 143.104 0 0 1 0-202.368L638.496 31.456a107.296 107.296 0 0 1 151.712 0l202.4 202.4a107.36 107.36 0 0 1 0 151.712l-177.056 177.088a143.104 143.104 0 0 1-202.368 0l-0.032-0.064z m-252.896 50.56l252.896-252.928a35.776 35.776 0 1 1 50.624 50.624l-252.896 252.928a35.776 35.776 0 1 1-50.624-50.624z"></path></svg>`,
        chevronCheck: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>`
    };

    const FAV_EMPTY_HEART_SVG = `<svg viewBox="0 0 1024 1024" width="20" height="20"><path d="M171.712 571.648l0.352 0.32 287.904 252.8a64 64 0 0 0 82.912 1.344l296.832-244.544a215.584 215.584 0 1 0-301.824-300.576L512 316.672l-25.888-35.616a215.584 215.584 0 1 0-314.4 290.624zM32 407.584a279.584 279.584 0 0 1 480-194.944 279.584 279.584 0 0 1 480 194.944 278.144 278.144 0 0 1-113.024 224.512l-295.36 243.392a128 128 0 0 1-165.888-2.592L129.984 620.16A278.976 278.976 0 0 1 32 407.584z" fill="#000000" stroke="#000000" stroke-width="28" stroke-linejoin="round"></path></svg>`;
    const FAV_FILLED_HEART_SVG = `<svg viewBox="0 0 1024 1024" width="20" height="20"><path d="M32 407.584a279.584 279.584 0 0 1 480-194.944 279.584 279.584 0 0 1 480 194.944 278.144 278.144 0 0 1-113.024 224.512L562.592 892.8a96 96 0 0 1-124.416-1.952l-308.16-270.688A278.976 278.976 0 0 1 32 407.584z" fill="#000000"></path></svg>`;
    const PINNED_THUMBTACK_SVG = `<svg viewBox="0 0 1024 1024" width="14" height="14" fill="#292c31"><path d="M899.424896 377.815745l-195.50912 195.304398c5.220401 8.905389 9.212472 18.424943 11.976213 27.944497l-28.661023 226.31972c8.905389 30.91296-8.188864 58.755097-37.975855 62.030642a65.101466 65.101466 0 0 1-52.101645-19.857994L154.238302 426.641844c-23.850065-23.850065-27.125611-59.369262-7.165255-79.329617a49.440264 49.440264 0 0 1 49.337903-10.850244l226.217359-28.661023c9.724276 2.763741 19.141469 6.858173 28.046858 11.976213L645.979566 124.370414 606.468298 84.756786C584.563088 62.953937 581.696986 30.403204 599.917207 12.080621c18.322582-18.220222 50.873316-15.354119 72.676166 6.551091l332.672586 332.467865c21.80285 21.90521 24.668952 54.455943 6.44873 72.676165-18.322582 18.322582-50.873316 15.354119-72.676165-6.44873l-39.613628-39.613628zM280.858607 685.512297l57.322046 57.322045a46.778884 46.778884 0 0 1-4.299154 70.014785L75.625211 1013.88573a46.778884 46.778884 0 0 1-65.715631-65.715631L210.946183 690.016172a46.778884 46.778884 0 0 1 70.014785-4.299154z"></path></svg>`;

    let activePhotosTab = 'library';
    let photosVisibilityTimer = 0;
    let isSelectMode = false;
    let albumLayout = 'list'; // 'list' | 'grid'
    let albumSortType = 'date'; // 'date' | 'name'
    let albumScopeType = 'all'; // 'all' | 'personal' | 'shared'
    let selectedAlbumIds = new Set();
    let isAlbumsCollapsed = false;
    let isPinnedCollapsed = false;
    let isSharedAlbumsCollapsed = false;
    let selectedIndices = new Set();
    let currentPreviewIndex = -1;
    let currentFilteredItems = [];
    let photosSearchFilter = '';
    let photosSearchMatches = [];
    let photosSearchShown = 0;
    const PHOTOS_SEARCH_PAGE_CHUNK = 36;
    let currentFilterContext = { type: 'all' }; // { type: 'all' | 'album' | 'favorites' | 'media_prompt' | 'media_plain' | 'source' | 'trash', id?, name? }
    let isSortAscending = false;
    let previousJournalFabDisplay = null;
    let targetAlbumForImport = null;
    let collectionsRenderedOnce = false;
    let isCollectionsDirty = true;
    let libraryRenderedOnce = false;
    let isLibraryDirty = true;
    let currentRenderCount = 0;
    const LIBRARY_PAGE_CHUNK = 36;

    const DEFAULT_CURATED_ORDER = ['pinned', 'albums', 'sharedAlbums', 'moreSections'];
    const DEFAULT_CURATED_SECTIONS = {
        pinned: true,
        albums: true,
        sharedAlbums: true,
        moreSections: true,
        order: [...DEFAULT_CURATED_ORDER]
    };

    // --- 内存缓存层：彻底杜绝频繁磁盘 I/O 带来的卡顿 ---
    let inMemoryPhotosState = {
        albums: [],
        favorites: [],
        trash: [],
        pinnedConfig: { favorites: true, trash: true },
        curatedSections: { ...DEFAULT_CURATED_SECTIONS, order: [...DEFAULT_CURATED_ORDER] },
        albumLayout: 'list',
        initialized: false
    };

    // --- 平滑无感迁移函数：从 localStorage 自动迁移至童话集 IndexedDB ---
    function initAndMigratePhotosState() {
        if (inMemoryPhotosState.initialized) return;

        // 1. 先尝试从 IndexedDB 水合的数据中读取
        const dbData = window.photosAppData;
        if (dbData && (Array.isArray(dbData.albums) || Array.isArray(dbData.favorites) || Array.isArray(dbData.trash))) {
            inMemoryPhotosState.albums = Array.isArray(dbData.albums) ? dbData.albums : [];
            inMemoryPhotosState.favorites = Array.isArray(dbData.favorites) ? dbData.favorites : [];
            inMemoryPhotosState.trash = Array.isArray(dbData.trash) ? dbData.trash : [];
            inMemoryPhotosState.pinnedConfig = dbData.pinnedConfig || { favorites: true, trash: true };
            inMemoryPhotosState.curatedSections = dbData.curatedSections || { ...DEFAULT_CURATED_SECTIONS, order: [...DEFAULT_CURATED_ORDER] };
            inMemoryPhotosState.albumLayout = dbData.albumLayout || 'list';
            albumLayout = inMemoryPhotosState.albumLayout;
            inMemoryPhotosState.initialized = true;
            return;
        }

        // 2. 如果 IndexedDB 中尚无数据，安全地从原有的 localStorage 迁移（保证老数据绝不丢失！）
        try {
            const rawAlbums = localStorage.getItem(ALBUMS_STORAGE_KEY);
            inMemoryPhotosState.albums = rawAlbums ? JSON.parse(rawAlbums) : [];
        } catch (e) { inMemoryPhotosState.albums = []; }

        try {
            const rawFavs = localStorage.getItem(FAVORITES_STORAGE_KEY);
            inMemoryPhotosState.favorites = rawFavs ? JSON.parse(rawFavs) : [];
        } catch (e) { inMemoryPhotosState.favorites = []; }

        try {
            const rawTrash = localStorage.getItem(TRASH_STORAGE_KEY);
            inMemoryPhotosState.trash = rawTrash ? JSON.parse(rawTrash) : [];
        } catch (e) { inMemoryPhotosState.trash = []; }

        try {
            const rawPinned = localStorage.getItem(PINNED_STORAGE_KEY);
            inMemoryPhotosState.pinnedConfig = rawPinned ? JSON.parse(rawPinned) : { favorites: true, trash: true };
        } catch (e) { inMemoryPhotosState.pinnedConfig = { favorites: true, trash: true }; }

        try {
            const rawSections = localStorage.getItem(CURATED_SECTIONS_STORAGE_KEY);
            inMemoryPhotosState.curatedSections = rawSections ? JSON.parse(rawSections) : { ...DEFAULT_CURATED_SECTIONS, order: [...DEFAULT_CURATED_ORDER] };
        } catch (e) { inMemoryPhotosState.curatedSections = { ...DEFAULT_CURATED_SECTIONS, order: [...DEFAULT_CURATED_ORDER] }; }

        try {
            const rawLayout = localStorage.getItem(ALBUM_LAYOUT_STORAGE_KEY);
            inMemoryPhotosState.albumLayout = rawLayout || 'list';
            albumLayout = inMemoryPhotosState.albumLayout;
        } catch (e) { inMemoryPhotosState.albumLayout = 'list'; }

        inMemoryPhotosState.initialized = true;

        // 立即向童话集 IndexedDB 注入一份完整备份
        syncStateToDatabase();
    }

    // 将状态同步写入童话集 IndexedDB (并写入 localStorage 做本地保底备份)
    function syncStateToDatabase() {
        const payload = {
            albums: inMemoryPhotosState.albums,
            favorites: inMemoryPhotosState.favorites,
            trash: inMemoryPhotosState.trash,
            pinnedConfig: inMemoryPhotosState.pinnedConfig,
            curatedSections: inMemoryPhotosState.curatedSections,
            albumLayout: inMemoryPhotosState.albumLayout
        };

        if (typeof window.savePhotosAppData === 'function') {
            window.savePhotosAppData(payload);
        } else {
            window.photosAppData = payload;
        }

        // 双保险保底写入 localStorage，确保在无数据库环境下数据也绝对安全
        try {
            localStorage.setItem(ALBUMS_STORAGE_KEY, JSON.stringify(payload.albums));
            localStorage.setItem(FAVORITES_STORAGE_KEY, JSON.stringify(payload.favorites));
            localStorage.setItem(TRASH_STORAGE_KEY, JSON.stringify(payload.trash));
            localStorage.setItem(PINNED_STORAGE_KEY, JSON.stringify(payload.pinnedConfig));
            localStorage.setItem(CURATED_SECTIONS_STORAGE_KEY, JSON.stringify(payload.curatedSections));
            localStorage.setItem(ALBUM_LAYOUT_STORAGE_KEY, payload.albumLayout);
        } catch (e) {}
    }

    // 监听来自 db.js 的异步水合通知
    window.onPhotosAppDataLoaded = function (loadedData) {
        if (!loadedData) return;
        inMemoryPhotosState.albums = Array.isArray(loadedData.albums) ? loadedData.albums : inMemoryPhotosState.albums;
        inMemoryPhotosState.favorites = Array.isArray(loadedData.favorites) ? loadedData.favorites : inMemoryPhotosState.favorites;
        inMemoryPhotosState.trash = Array.isArray(loadedData.trash) ? loadedData.trash : inMemoryPhotosState.trash;
        if (loadedData.pinnedConfig) inMemoryPhotosState.pinnedConfig = loadedData.pinnedConfig;
        if (loadedData.curatedSections) inMemoryPhotosState.curatedSections = loadedData.curatedSections;
        if (loadedData.albumLayout) {
            inMemoryPhotosState.albumLayout = loadedData.albumLayout;
            albumLayout = loadedData.albumLayout;
        }
        inMemoryPhotosState.initialized = true;
        renderPhotosApp();
    };

    // 数据同步核心：清理已被移至废纸篓或永久删除的照片在相簿、封面及收藏夹中的引用
    function cleanupPhotoReferences(removedSrcs) {
        if (!removedSrcs || !removedSrcs.length) return;
        const srcSet = new Set(removedSrcs);

        // 1. 同步清理收藏夹
        let favs = getStoredFavorites();
        const nextFavs = favs.filter(src => !srcSet.has(src));
        if (nextFavs.length !== favs.length) {
            saveStoredFavorites(nextFavs);
        }

        // 2. 同步清理所有相簿中的包含项与自定义封面
        let albums = getStoredAlbums();
        let changed = false;
        albums.forEach(alb => {
            if (Array.isArray(alb.photoSrcs)) {
                const prevCount = alb.photoSrcs.length;
                alb.photoSrcs = alb.photoSrcs.filter(s => !srcSet.has(s));
                if (alb.photoSrcs.length !== prevCount) changed = true;
            }
            if (alb.customCover && srcSet.has(alb.customCover)) {
                alb.customCover = '';
                changed = true;
            }
        });
        if (changed) {
            saveStoredAlbums(albums);
        }
    }

    function getStoredPinnedConfig() {
        initAndMigratePhotosState();
        return inMemoryPhotosState.pinnedConfig || { favorites: true, trash: true };
    }

    function saveStoredPinnedConfig(config) {
        initAndMigratePhotosState();
        inMemoryPhotosState.pinnedConfig = config;
        syncStateToDatabase();
    }

    function getStoredCuratedSectionsConfig() {
        initAndMigratePhotosState();
        const parsed = inMemoryPhotosState.curatedSections;
        const merged = { ...DEFAULT_CURATED_SECTIONS, ...(parsed || {}) };
        if (!Array.isArray(merged.order) || !merged.order.length) {
            merged.order = [...DEFAULT_CURATED_ORDER];
        } else {
            const cleanOrder = [];
            merged.order.forEach(k => {
                if (DEFAULT_CURATED_ORDER.includes(k) && !cleanOrder.includes(k)) {
                    cleanOrder.push(k);
                }
            });
            DEFAULT_CURATED_ORDER.forEach(k => {
                if (!cleanOrder.includes(k)) cleanOrder.push(k);
            });
            merged.order = cleanOrder;
        }
        return merged;
    }

    function saveStoredCuratedSectionsConfig(config) {
        initAndMigratePhotosState();
        inMemoryPhotosState.curatedSections = config;
        syncStateToDatabase();
    }

    function resetStoredCuratedSectionsConfig() {
        saveStoredCuratedSectionsConfig(DEFAULT_CURATED_SECTIONS);
        return { ...DEFAULT_CURATED_SECTIONS, order: [...DEFAULT_CURATED_ORDER] };
    }

    // 存储管理：纯内存秒级读取 + 后台静默入库，消灭卡顿！
    function getStoredAlbums() {
        initAndMigratePhotosState();
        return Array.isArray(inMemoryPhotosState.albums) ? inMemoryPhotosState.albums : [];
    }

    // 核心统一排序函数：确保精选集与全屏相簿视图的置顶/排序规则全局高度一致
    function getSortedAlbumsList() {
        const albums = getStoredAlbums().slice();
        albums.sort((a, b) => {
            if (Boolean(b.pinned) !== Boolean(a.pinned)) {
                return (b.pinned ? 1 : 0) - (a.pinned ? 1 : 0);
            }
            if (albumSortType === 'name') {
                return String(a.name || '').localeCompare(String(b.name || ''), 'zh-CN');
            }
            return new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime();
        });
        return albums;
    }

    function markCollectionsDirty() {
        isCollectionsDirty = true;
        isLibraryDirty = true;
    }

    function saveStoredAlbums(albums) {
        initAndMigratePhotosState();
        albums.forEach(album => {
            if (album.coupleAvatarEnabled) syncCoupleAvatarPairs(album);
        });
        inMemoryPhotosState.albums = albums;
        markCollectionsDirty();
        syncStateToDatabase();
        scheduleCoupleAvatarSync();
    }

    function getStoredFavorites() {
        initAndMigratePhotosState();
        return inMemoryPhotosState.favorites || [];
    }

    function saveStoredFavorites(favs) {
        initAndMigratePhotosState();
        inMemoryPhotosState.favorites = favs;
        cachedFavsSet = new Set(favs);
        markCollectionsDirty();
        syncStateToDatabase();
    }

    let cachedFavsSet = null;

    function getFavoritesSet() {
        if (!cachedFavsSet) {
            cachedFavsSet = new Set(getStoredFavorites());
        }
        return cachedFavsSet;
    }

    function isItemFavorite(item) {
        if (!item || !item.src) return false;
        return getFavoritesSet().has(item.src);
    }

    function toggleFavorite(item) {
        if (!item || !item.src) return false;
        let favs = getStoredFavorites();
        const idx = favs.indexOf(item.src);
        let res = false;
        if (idx >= 0) {
            favs.splice(idx, 1);
            res = false;
        } else {
            favs.push(item.src);
            res = true;
        }
        saveStoredFavorites(favs);
        return res;
    }

    function getStoredTrash() {
        initAndMigratePhotosState();
        return inMemoryPhotosState.trash || [];
    }

    function saveStoredTrash(items) {
        initAndMigratePhotosState();
        inMemoryPhotosState.trash = items;
        markCollectionsDirty();
        syncStateToDatabase();
    }

    function getPhotoAlbumItems() {
        return Array.isArray(window.photoAlbumItems) ? window.photoAlbumItems : [];
    }

    function formatAlbumTime(value) {
        const date = value ? new Date(value) : null;
        if (!date || Number.isNaN(date.getTime())) return '';
        const pad = num => String(num).padStart(2, '0');
        return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())} ${pad(date.getHours())}:${pad(date.getMinutes())}`;
    }

    function getSortedPhotoItems() {
        const raw = getPhotoAlbumItems();
        if (!raw.length) return [];
        // 时间戳数值化快速排序，消灭高频 Date 字符串重复解析 CPU 消耗
        const list = raw.map(it => {
            if (typeof it._ts !== 'number') {
                it._ts = it.createdAt ? new Date(it.createdAt).getTime() || 0 : 0;
            }
            return it;
        });
        return list.slice().sort((left, right) => {
            return isSortAscending ? (left._ts - right._ts) : (right._ts - left._ts);
        });
    }

    function getDisplayPhotoItems() {
        let items = [];

        if (currentFilterContext.type === 'trash') {
            items = getStoredTrash();
        } else {
            items = getSortedPhotoItems();

            if (currentFilterContext.type === 'album') {
                const albums = getStoredAlbums();
                const targetAlbum = albums.find(a => a.id === currentFilterContext.id);
                if (targetAlbum && Array.isArray(targetAlbum.photoSrcs)) {
                    const srcSet = new Set(targetAlbum.photoSrcs);
                    items = items.filter(item => srcSet.has(item.src));
                }
            } else if (currentFilterContext.type === 'favorites') {
                const favSet = getFavoritesSet();
                items = items.filter(item => favSet.has(item.src));
            } else if (currentFilterContext.type === 'media_prompt') {
                items = items.filter(item => Boolean(item.prompt && item.prompt.trim()));
            } else if (currentFilterContext.type === 'media_plain') {
                items = items.filter(item => !item.prompt || !item.prompt.trim());
            } else if (currentFilterContext.type === 'source') {
                const sName = currentFilterContext.name;
                items = items.filter(item => (item.sourceName || '生图') === sName);
            }
        }

        return items;
    }

    // 动态挂载相册 HTML 结构（保持 index.html 清洁）
    function ensurePhotosAppDom() {
        const container = document.getElementById(PHOTOS_APP_ID);
        if (!container) return;
        if (container.querySelector('#photos-page-main')) return;

        container.innerHTML = `
            <div id="photos-page-main" class="photos-shell">
                <div class="photos-topbar" id="photosMainTopbar">
                    <div class="photos-top-title-wrap" id="photosTopTitleWrap" role="button" tabindex="0" aria-label="返回/退出">
                        <div class="photos-back-nav" id="photosNavBackGroup" style="display: none;">
                            <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="#000" stroke-width="2.5" stroke-linecap="round"><polyline points="15 18 9 12 15 6"></polyline></svg>
                            <span id="photosNavBackText">精选集</span>
                        </div>
                        <h1 class="photos-large-title" id="photosHeaderTitle">图库</h1>
                        <div class="photos-countline" id="photosAlbumCount">0个项目</div>
                    </div>
                    <div class="photos-top-actions" id="photosTopActionsLibrary">
                        <button type="button" class="photos-glass-btn" id="photosRefreshBtn" aria-label="筛选与导入">
                            <svg viewBox="0 0 24 24" fill="none" stroke="#000000" stroke-width="2.6" stroke-linecap="round">
                                <line x1="3.5" y1="6.5" x2="20.5" y2="6.5"></line>
                                <line x1="5.5" y1="12" x2="18.5" y2="12"></line>
                                <line x1="7.5" y1="17.5" x2="16.5" y2="17.5"></line>
                            </svg>
                        </button>
                        <button type="button" class="photos-glass-btn photos-text-btn" id="photosSelectBtn">选择</button>
                    </div>
                    <div class="photos-top-actions photos-collections-actions" id="photosTopActionsCollections" style="display: none;">
                        <button type="button" class="photos-glass-circle-btn" id="photosCollectionsMoreBtn" aria-label="更多操作">
                            <svg viewBox="0 0 24 24" fill="currentColor"><circle cx="4.5" cy="12" r="2.2"/><circle cx="12" cy="12" r="2.2"/><circle cx="19.5" cy="12" r="2.2"/></svg>
                        </button>
                    </div>
                </div>

                <!-- 独立相簿列表全新全屏页面顶栏 (对标截图) -->
                <div class="photos-subpage-topbar" id="photosAlbumsSubpageTopbar" style="display: none;">
                    <button type="button" class="photos-round-icon-btn" id="photosAlbumsSubpageBackBtn" aria-label="返回">
                        <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"><polyline points="15 18 9 12 15 6"></polyline></svg>
                    </button>
                    <div class="photos-subpage-title">相簿</div>
                    <div class="photos-subpage-actions">
                        <button type="button" class="photos-round-icon-btn" id="photosAlbumsSubpageAddBtn" aria-label="新建相簿">
                            <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
                        </button>
                        <button type="button" class="photos-round-icon-btn" id="photosAlbumsSubpageMoreBtn" aria-label="更多">
                            <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor"><circle cx="4.5" cy="12" r="2.2"/><circle cx="12" cy="12" r="2.2"/><circle cx="19.5" cy="12" r="2.2"/></svg>
                        </button>
                    </div>
                </div>

                <!-- 顶部悬浮胶囊交互栏（个人和共享），带平移滑块动画 -->
                <div class="photos-top-floating-capsule-wrap" id="photosTopFloatingCapsuleWrap" style="display: none;">
                    <div class="photos-scope-capsule" id="photosScopeCapsule" data-scope="personal">
                        <div class="photos-scope-slider" id="photosScopeSlider"></div>
                        <button type="button" class="photos-scope-pill-btn active" id="photosScopePersonalBtn">个人</button>
                        <button type="button" class="photos-scope-pill-btn" id="photosScopeSharedBtn">共享</button>
                    </div>
                </div>

                <!-- 精选集右上角三个点展开的白色磨砂菜单 -->
                <div class="photos-filter-menu-overlay" id="photosCollectionsMenuOverlay">
                    <div class="photos-filter-dropdown photos-collections-dropdown" id="photosCollectionsDropdown">
                        <div class="photos-menu-list">
                            <div class="photos-dropdown-item" id="photosMenuCreateAlbumBtn">
                                <div class="photos-item-icon">${PHOTO_ICONS.album}</div>
                                <span class="photos-item-label">新建相簿</span>
                            </div>
                            <div class="photos-dropdown-item" id="photosColMenuLocalImportBtn">
                                <div class="photos-item-icon">${PHOTO_ICONS.localImport}</div>
                                <span class="photos-item-label">本地导入</span>
                            </div>
                            <div class="photos-dropdown-item" id="photosColMenuUrlUploadBtn">
                                <div class="photos-item-icon">${PHOTO_ICONS.urlUpload}</div>
                                <span class="photos-item-label">URL上传</span>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- 相簿全屏管理页右上角三个点展开的菜单 -->
                <div class="photos-filter-menu-overlay" id="photosAlbumsPageMenuOverlay">
                    <div class="photos-filter-dropdown photos-albums-page-dropdown" id="photosAlbumsPageDropdown">
                        <div class="photos-menu-list">
                            <div class="photos-dropdown-item" id="photosAlbumPageCreateBtn">
                                <div class="photos-item-icon">${PHOTO_ICONS.album}</div>
                                <span class="photos-item-label">新建相簿</span>
                            </div>
                            <div class="photos-dropdown-item" id="photosAlbumPageEditBtn">
                                <div class="photos-item-icon">${PHOTO_ICONS.edit}</div>
                                <span class="photos-item-label">编辑相簿</span>
                            </div>
                        </div>
                        <div class="photos-dropdown-divider"></div>
                        <div class="photos-menu-list">
                            <div class="photos-dropdown-item" id="photosAlbumToggleLayoutBtn">
                                <div class="photos-item-icon">
                                    <svg viewBox="0 0 1515 1024" fill="currentColor"><path d="M355.19474 402.291726c-30.481534 0-56.383123 10.660822-77.718795 31.996493C256.147288 455.616877 245.479452 481.518466 245.479452 512c0 30.474521 10.667836 56.383123 32.003507 77.711781s47.244274 31.996493 77.718795 31.996493c30.474521 0 56.37611-10.667836 77.711781-31.996493 21.328658-21.328658 31.996493-47.23726 31.996493-77.711781 0-30.481534-10.667836-56.383123-32.003507-77.711781C411.577863 412.959562 385.676274 402.291726 355.19474 402.291726z"></path><path d="M355.201753 109.715288c-30.481534 0-56.383123 10.667836-77.718795 31.996493-21.328658 21.335671-31.996493 47.23726-31.996493 77.711781 0 30.481534 10.660822 56.383123 31.996493 77.718795 21.335671 21.328658 47.244274 31.996493 77.718795 31.996493 30.474521 0 56.37611-10.667836 77.711781-31.996493 21.328658-21.335671 31.996493-47.23726 31.996493-77.718795 0-30.474521-10.667836-56.37611-31.996493-77.711781C411.584877 120.383123 385.683288 109.715288 355.201753 109.715288z"></path><path d="M355.201753 694.861151c-30.481534 0-56.390137 10.660822-77.718795 31.996493s-31.996493 47.23726-31.996493 77.711781c0 30.488548 10.660822 56.383123 31.996493 77.718795 21.335671 21.328658 47.244274 31.996493 77.718795 31.996493 30.474521 0 56.37611-10.667836 77.711781-31.996493 21.328658-21.335671 31.996493-47.230247 31.996493-77.718795 0-30.474521-10.667836-56.383123-31.996493-77.711781S385.683288 694.861151 355.201753 694.861151z"></path><path d="M1264.057863 151.713315c-3.633096-3.612055-7.904438-5.421589-12.863123-5.421589L556.333589 146.291726c-4.951671 0-9.237041 1.802521-12.85611 5.421589-3.619068 3.626082-5.428603 7.904438-5.428603 12.85611l0 109.722301c0 4.951671 1.809534 9.230027 5.428603 12.85611 3.619068 3.612055 7.904438 5.421589 12.85611 5.421589l694.861151 0c4.958685 0 9.237041-1.802521 12.863123-5.421589 3.619068-3.626082 5.421589-7.904438 5.421589-12.85611L1269.479452 164.569425C1269.479452 159.617753 1267.669918 155.332384 1264.057863 151.713315z"></path><path d="M1251.19474 438.861151 556.333589 438.861151c-4.951671 0-9.237041 1.802521-12.85611 5.428603-3.619068 3.619068-5.428603 7.904438-5.428603 12.85611l0 109.722301c0 4.944658 1.809534 9.230027 5.428603 12.849096 3.619068 3.626082 7.904438 5.428603 12.85611 5.428603l694.861151 0c4.958685 0 9.237041-1.802521 12.863123-5.428603 3.619068-3.619068 5.421589-7.904438 5.421589-12.849096L1269.479452 457.145863c0-4.951671-1.809534-9.244055-5.421589-12.85611C1260.424767 440.670685 1256.153425 438.861151 1251.19474 438.861151z"></path><path d="M1251.19474 731.430575 556.333589 731.430575c-4.951671 0-9.237041 1.809534-12.85611 5.428603-3.619068 3.619068-5.428603 7.904438-5.428603 12.849096l0 109.722301c0 4.958685 1.809534 9.237041 5.428603 12.863123 3.619068 3.612055 7.904438 5.414575 12.85611 5.414575l694.861151 0c4.958685 0 9.237041-1.802521 12.863123-5.414575 3.619068-3.626082 5.421589-7.904438 5.421589-12.863123l0-109.722301c0-4.944658-1.809534-9.237041-5.421589-12.849096C1260.424767 733.247123 1256.153425 731.430575 1251.19474 731.430575z"></path></svg>
                                </div>
                                <span class="photos-item-label" id="photosAlbumLayoutLabel">网格排版</span>
                            </div>
                            <div class="photos-dropdown-item" id="photosAlbumSortDateBtn">
                                <div class="photos-item-check-slot">
                                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
                                </div>
                                <div class="photos-item-icon">
                                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>
                                </div>
                                <span class="photos-item-label">按日期排序</span>
                            </div>
                            <div class="photos-dropdown-item" id="photosAlbumSortNameBtn">
                                <div class="photos-item-check-slot">
                                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
                                </div>
                                <div class="photos-item-icon">
                                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><line x1="4" y1="6" x2="20" y2="6"></line><line x1="4" y1="12" x2="14" y2="12"></line><line x1="4" y1="18" x2="8" y2="18"></line></svg>
                                </div>
                                <span class="photos-item-label">按名称排序</span>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- 已经创建好的相簿详情页面内部专属菜单 -->
                <div class="photos-filter-menu-overlay" id="photosAlbumDetailMenuOverlay">
                    <div class="photos-filter-dropdown photos-album-detail-dropdown" id="photosAlbumDetailDropdown">
                        <div class="photos-menu-list">
                            <div class="photos-dropdown-item" id="photosDetailLocalImportBtn">
                                <div class="photos-item-icon">${PHOTO_ICONS.localImport}</div>
                                <span class="photos-item-label">本地导入</span>
                            </div>
                            <div class="photos-dropdown-item" id="photosDetailUrlImportBtn">
                                <div class="photos-item-icon">${PHOTO_ICONS.urlUpload}</div>
                                <span class="photos-item-label">URL上传</span>
                            </div>
                            <div class="photos-dropdown-divider"></div>
                            <div class="photos-dropdown-item" id="photosDetailShareInviteBtn">
                                <div class="photos-item-icon">
                                    <svg viewBox="0 0 1024 1024" fill="currentColor"><path d="M590.4 603.2s-30.4-8-40-12.8c-16-11.2-25.6-30.4-25.6-51.2 0-22.4 17.6-41.6 30.4-54.4 30.4-36.8 48-86.4 48-140.8 0-115.2-81.6-208-182.4-208-100.8 0-182.4 92.8-182.4 208 0 54.4 19.2 104 48 140.8 17.6 11.2 30.4 32 30.4 54.4 0 20.8-9.6 40-25.6 51.2v1.6c-1.6 0-3.2 1.6-4.8 1.6-9.6 6.4-20.8 9.6-33.6 9.6-78.4 25.6-144 67.2-182.4 120H72c-9.6 14.4-14.4 30.4-14.4 48 0 49.6 41.6 89.6 92.8 91.2h542.4c52.8 0 94.4-40 94.4-91.2 0-20.8-8-40-19.2-54.4-40-49.6-100.8-89.6-177.6-113.6z" fill="currentColor"></path><path d="M958.4 692.8c-35.2-43.2-88-80-155.2-100.8 0 0-25.6-6.4-35.2-11.2-14.4-11.2-22.4-27.2-22.4-44.8 0-20.8 16-36.8 27.2-48C800 456 816 411.2 816 363.2c0-100.8-72-184-161.6-184-14.4 0-28.8 1.6-41.6 6.4 30.4 44.8 48 99.2 48 158.4 0 64-22.4 126.4-60.8 176l-1.6 1.6-1.6 1.6-3.2 3.2c-3.2 4.8-11.2 11.2-12.8 16 0 1.6 0 1.6 1.6 1.6 4.8 1.6 11.2 3.2 16 4.8h1.6l8 3.2c84.8 27.2 155.2 73.6 203.2 132.8 20.8 25.6 32 57.6 32 89.6 0 17.6-3.2 33.6-9.6 49.6h59.2c46.4 0 83.2-35.2 83.2-80 0-20.8-6.4-36.8-17.6-51.2z" fill="currentColor"></path></svg>
                                </div>
                                <span class="photos-item-label">好友共享</span>
                            </div>
                            <div class="photos-dropdown-item" id="photosDetailEditTitleBtn">
                                <div class="photos-item-icon">${PHOTO_ICONS.edit}</div>
                                <span class="photos-item-label">编辑标题</span>
                            </div>
                            <div class="photos-dropdown-item" id="photosDetailEditCoverBtn">
                                <div class="photos-item-icon">
                                    <svg viewBox="0 0 1024 1024" fill="currentColor"><path d="M941.474 57.03H82.537C36.897 57.03 2 91.916 2 137.558v748.88c0 42.958 34.897 80.532 80.537 80.532h858.937c42.947 0 80.526-37.574 80.526-80.532v-748.88c0-42.948-34.903-80.528-80.526-80.528zM265.059 193.906c45.624 0 85.896 37.58 85.896 85.896 0 48.31-37.579 85.889-85.896 85.889-45.634 0-85.895-37.563-85.895-85.889 0.001-48.316 40.261-85.896 85.895-85.896z m-61.74 652.259c-8.049 0-16.105-2.687-24.154-8.055-16.117-13.419-16.117-32.211-2.688-48.316l166.418-233.52c13.429-13.424 32.209-16.116 48.314-5.368l144.949 102.001 260.367-279.156c13.418-13.429 77.851-83.212 115.424-5.367v475.094c0 2.687-708.63 2.687-708.63 2.687z m0 0"></path></svg>
                                </div>
                                <span class="photos-item-label">修改封面</span>
                            </div>
                            <div class="photos-dropdown-item" id="photosDetailPinBtn">
                                <div class="photos-item-icon">
                                    <svg viewBox="0 0 1024 1024" fill="currentColor"><path d="M899.424896 377.815745l-195.50912 195.304398c5.220401 8.905389 9.212472 18.424943 11.976213 27.944497l-28.661023 226.31972c8.905389 30.91296-8.188864 58.755097-37.975855 62.030642a65.101466 65.101466 0 0 1-52.101645-19.857994L154.238302 426.641844c-23.850065-23.850065-27.125611-59.369262-7.165255-79.329617a49.440264 49.440264 0 0 1 49.337903-10.850244l226.217359-28.661023c9.724276 2.763741 19.141469 6.858173 28.046858 11.976213L645.979566 124.370414 606.468298 84.756786C584.563088 62.953937 581.696986 30.403204 599.917207 12.080621c18.322582-18.220222 50.873316-15.354119 72.676166 6.551091l332.672586 332.467865c21.80285 21.90521 24.668952 54.455943 6.44873 72.676165-18.322582 18.322582-50.873316 15.354119-72.676165-6.44873l-39.613628-39.613628zM280.858607 685.512297l57.322046 57.322045a46.778884 46.778884 0 0 1-4.299154 70.014785L75.625211 1013.88573a46.778884 46.778884 0 0 1-65.715631-65.715631L210.946183 690.016172a46.778884 46.778884 0 0 1 70.014785-4.299154z"></path></svg>
                                </div>
                                <span class="photos-item-label" id="photosDetailPinLabel">置顶相簿</span>
                            </div>
                            <div class="photos-dropdown-item" id="photosDetailDeleteBtn">
                                <div class="photos-item-icon">
                                    <svg viewBox="0 0 1024 1024" fill="#474a50"><path d="M880 224H144a48 48 0 0 1 0-96H384a64 64 0 0 1 64-64h128a64 64 0 0 1 64 64h240a48 48 0 0 1 0 96zM832 832a128 128 0 0 1-128 128H320a128 128 0 0 1-128-128V288h640V832zM448 464a48 48 0 0 0-96 0v288a48 48 0 0 0 96 0v-288z m224 0a48 48 0 0 0-96 0v288a48 48 0 0 0 96 0v-288z"></path></svg>
                                </div>
                                <span class="photos-item-label" style="color: #474a50;">删除相簿</span>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="photos-scroll">
                    <section class="photos-view active" id="photosLibraryView">
                        <div class="photos-library-month-heading" id="photosLibraryMonthHeading"></div>
                        <div class="photos-empty" id="photosAlbumEmpty" aria-hidden="true">暂无照片</div>
                        <div class="photos-grid" id="photosAlbumGrid"></div>
                    </section>
                    <section class="photos-view" id="photosCollectionsView">
                        <div class="photos-collection-view-wrap" id="photosCollectionsContainer"></div>
                    </section>
                    <!-- 全屏相簿视图主体 (对标截图排版) -->
                    <section class="photos-view" id="photosAlbumsListView">
                        <div class="photos-albums-full-list" id="photosAlbumsFullList"></div>
                    </section>
                    <section class="photos-view" id="photosSearchView" aria-label="搜索照片">
                        <div class="photos-search-page">
                            <label class="photos-search-input-box" for="photosSearchInput">
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><circle cx="11" cy="11" r="7"></circle><line x1="16" y1="16" x2="21" y2="21"></line></svg>
                                <input type="search" class="photos-search-input" id="photosSearchInput" placeholder="照片、标题、提示词或来源…" autocomplete="off">
                            </label>
                            <div class="photos-search-suggestions" aria-label="快速筛选">
                                <button type="button" data-photos-search-filter="today">今天</button>
                                <button type="button" data-photos-search-filter="favorites">个人收藏</button>
                                <button type="button" data-photos-search-filter="media_prompt">AI 创意图</button>
                                <button type="button" data-photos-search-filter="local">本地导入</button>
                            </div>
                            <div class="photos-search-results-caption" id="photosSearchResultsCaption" aria-live="polite"></div>
                            <div class="photos-grid photos-search-results-grid" id="photosSearchResultsGrid" style="display: none;"></div>
                            <div class="photos-search-empty" id="photosSearchEmpty" style="display: none;">没有找到相关照片</div>
                            <button class="photos-search-more" id="photosSearchMoreBtn" type="button" style="display: none;">加载更多</button>
                        </div>
                    </section>
                </div>
                <div class="photos-bottom-nav" aria-label="相册导航">
                    <div class="photos-tabs-capsule" id="photosTabsCapsule" data-active="library">
                        <div class="photos-tabs-slider" id="photosTabsSlider"></div>
                        <button type="button" class="photos-capsule-btn active" data-photos-tab="library" aria-label="图库">
                            <svg viewBox="0 0 48 48" fill="currentColor">
                                <path d="M42.2113 10.5H13.3095c-3.1875 0-5.81243 2.579-5.81243 5.7496v23.0003c0 3.1706 2.62493 5.7496 5.81243 5.7496h28.8746c3.1875 0 5.8124-2.4543 5.8124-5.6249v-23.125c0-3.1706-2.5949-5.7496-5.7852-5.7496Zm-7.2327 5.7505c.8518.0052 1.683.2625 2.3886.7395.7057.477 1.2545 1.1524 1.5768 1.9408.3224.7885.404 1.6547.2347 2.4895-.1694.8348-.5822 1.6007-1.1863 2.2012-.6041.6005-1.3726 1.0086-2.2083 1.1729-.8359.1643-1.7016.0774-2.488-.2498-.7866-.3272-1.4585-.8799-1.9313-1.5885-.4726-.7086-.7249-1.5413-.7249-2.3931.0045-1.147.4638-2.2454 1.2772-3.0541.8135-.8086 1.9145-1.2615 3.0615-1.2593v.0009ZM13.2711 42.1252c-1.5938 0-2.7994-1.289-2.7994-2.8743v-6.0778l8.4805-7.5739c.829-.7293 1.9038-1.1171 3.0075-1.0853 1.1037.0319 2.1543.481 2.94 1.2568l5.8724 5.8228-10.5936 10.5308-6.9074.0009Zm31.7255-2.8753c-.0001.3778-.0747.752-.2195 1.1009-.1448.349-.357.666-.6244.933-.2673.2669-.5847.4786-.9339.6228-.3492.1442-.7234.2181-1.1013.2177H24.2781l10.9761-10.9058c.779-.6571 1.7644-1.0188 2.7835-1.0215 1.019-.0027 2.0065.3536 2.7889 1.0065l4.17 3.539v4.5074Z"></path>
                                <path d="M35.9966 3H5.99699c-1.59128 0-3.11738.63213-4.24258 1.75734C.629203 5.88254-.00292969 7.40864-.00292969 8.99992V32.9996C-.00183234 34.3298.440538 35.6221 1.25487 36.674c.81433 1.0518 1.95459 1.8037 3.24214 2.138V14.2498c0-1.7902.71115-3.507 1.977-4.77289 1.26585-1.26582 2.98268-1.97697 4.77289-1.97697H41.809c-.3343-1.28755-1.0863-2.42781-2.138-3.24214C38.6191 3.44347 37.3268 3.0011 35.9966 3Z"></path>
                            </svg>
                            <span>图库</span>
                        </button>
                        <button type="button" class="photos-capsule-btn" data-photos-tab="collections" aria-label="精选集">
                            <svg viewBox="0 0 16 16" fill="currentColor">
                                <path d="M0 13a1.5 1.5 0 0 0 1.5 1.5h13A1.5 1.5 0 0 0 16 13V6a1.5 1.5 0 0 0 -1.5 -1.5h-13A1.5 1.5 0 0 0 0 6zM2 3a0.5 0.5 0 0 0 0.5 0.5h11a0.5 0.5 0 0 0 0 -1h-11A0.5 0.5 0 0 0 2 3m2 -2a0.5 0.5 0 0 0 0.5 0.5h7a0.5 0.5 0 0 0 0 -1h-7A0.5 0.5 0 0 0 4 1"></path>
                            </svg>
                            <span>精选集</span>
                        </button>
                    </div>
                    <button type="button" class="photos-search-circle" id="photosSearchBtn" aria-label="搜索">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="7"></circle><line x1="16.2" y1="16.2" x2="21" y2="21"></line></svg>
                    <span>搜索</span></button>
                </div>
                <!-- 图库右上角三横展开成的高级白色磨砂菜单 -->
                <div class="photos-filter-menu-overlay" id="photosFilterMenuOverlay">
                    <div class="photos-filter-dropdown" id="photosFilterDropdown">
                        <!-- 顶部双排序胶囊分段 -->
                        <div class="photos-menu-sort-pills">
                            <button type="button" class="photos-sort-pill active" id="photosSortAddDateBtn">
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>
                                <span>添加日期</span>
                            </button>
                            <button type="button" class="photos-sort-pill" id="photosSortShootDateBtn">
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"></path><circle cx="12" cy="13" r="4"></circle></svg>
                                <span>拍摄日期</span>
                            </button>
                        </div>

                        <div class="photos-menu-section-caption">筛选:</div>

                        <!-- 筛选列表 -->
                        <div class="photos-menu-list">
                            <div class="photos-dropdown-item active" data-filter="all">
                                <div class="photos-item-check-slot">
                                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
                                </div>
                                <div class="photos-item-icon">
                                    <svg viewBox="0 0 1024 1024" fill="currentColor"><path d="M469.333333 138.666667v277.333333a53.393333 53.393333 0 0 1-53.333333 53.333333H138.666667a53.393333 53.393333 0 0 1-53.333334-53.333333V138.666667a53.393333 53.393333 0 0 1 53.333334-53.333334h277.333333a53.393333 53.393333 0 0 1 53.333333 53.333334z m-53.333333 416H138.666667a53.393333 53.393333 0 0 0-53.333334 53.333333v277.333333a53.393333 53.393333 0 0 0 53.333334 53.333334h277.333333a53.393333 53.393333 0 0 0 53.333333-53.333334V608a53.393333 53.393333 0 0 0-53.333333-53.333333z m469.333333 0H608a53.393333 53.393333 0 0 0-53.333333 53.333333v277.333333a53.393333 53.393333 0 0 0 53.333333 53.333334h277.333333a53.393333 53.393333 0 0 0 53.333334-53.333334V608a53.393333 53.393333 0 0 0-53.333334-53.333333z m-176.38-92.873334a53.4 53.4 0 0 0 75.426667 0l146.746667-146.746666a53.4 53.4 0 0 0 0-75.426667l-146.746667-146.746667a53.4 53.4 0 0 0-75.426667 0L562.206667 239.62a53.4 53.4 0 0 0 0 75.426667z"></path></svg>
                                </div>
                                <span class="photos-item-label">所有项目</span>
                            </div>
                            <div class="photos-dropdown-item" data-filter="favorites">
                                <div class="photos-item-check-slot">
                                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
                                </div>
                                <div class="photos-item-icon">
                                    <svg viewBox="0 0 1024 1024" fill="currentColor"><path d="M32 407.584a279.584 279.584 0 0 1 480-194.944 279.584 279.584 0 0 1 480 194.944 278.144 278.144 0 0 1-113.024 224.512L562.592 892.8a96 96 0 0 1-124.416-1.952l-308.16-270.688A278.976 278.976 0 0 1 32 407.584z"></path></svg>
                                </div>
                                <span class="photos-item-label">个人收藏</span>
                            </div>
                        </div>

                        <div class="photos-dropdown-divider"></div>

                        <!-- 导入与上传操作 -->
                        <div class="photos-menu-list">
                            <div class="photos-dropdown-item" id="photosMenuLocalImportBtn">
                                <div class="photos-item-check-slot"></div>
                                <div class="photos-item-icon">${PHOTO_ICONS.localImport}</div>
                                <span class="photos-item-label">本地导入</span>
                            </div>
                            <div class="photos-dropdown-item" id="photosMenuUrlUploadBtn">
                                <div class="photos-item-check-slot"></div>
                                <div class="photos-item-icon">${PHOTO_ICONS.urlUpload}</div>
                                <span class="photos-item-label">URL上传</span>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- 多选模式底部操作栏 (包含收藏、添加到相簿与删除) -->
                <div class="photos-selection-toolbar" id="photosSelectionToolbar">
                    <button type="button" class="photos-toolbar-action" id="photosSelectAllBtn">全选</button>
                    <button type="button" class="photos-toolbar-action" id="photosBatchFavBtn" disabled>收藏</button>
                    <button type="button" class="photos-toolbar-action" id="photosAddToAlbumBtn" disabled>添加到相簿</button>
                    <button type="button" class="photos-toolbar-action danger" id="photosBatchDeleteBtn" disabled>删除</button>
                </div>

                <!-- 新建共享相簿对标截图高级抽屉弹窗 -->
                <div class="photos-create-album-drawer-overlay" id="photosCreateAlbumDrawerOverlay">
                    <div class="photos-create-album-drawer-sheet">
                        <div class="photos-create-album-nav">
                            <button type="button" class="photos-frosted-circle-btn" id="photosCreateAlbumCancelBtn" aria-label="关闭">
                                <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="#000000" stroke-width="2.8" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                            </button>
                            <span class="photos-create-album-title" id="photosCreateDrawerTitle">创建相簿</span>
                            <button type="button" class="photos-frosted-circle-btn" id="photosCreateAlbumSaveBtn" aria-label="保存">
                                <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="#000000" stroke-width="2.8" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
                            </button>
                        </div>
                        <div class="photos-create-album-body">
                            <!-- 默认无封面占位封面卡片 -->
                            <div class="photos-create-cover-card-box">
                                <div class="photos-create-placeholder-card" id="photosCreateCoverPreview">
                                    ${ALBUM_EMPTY_SVG}
                                </div>
                                <button type="button" class="photos-create-add-photo-capsule" id="photosCreateAddPhotoBtn">添加照片</button>
                            </div>
                            <!-- 相簿名称输入卡片 -->
                            <div class="photos-create-field-card">
                                <input type="text" class="photos-create-field-input" id="photosCreateAlbumNameInput" placeholder="共享相簿名称" maxlength="30">
                            </div>
                            <!-- 微信好友角色选择列表 -->
                            <div class="photos-create-section-caption">邀请好友共享</div>
                            <div class="photos-create-contacts-list" id="photosCreateContactsList"></div>
                            <label class="photos-couple-setting">
                                <span>情头模式<small>仅共享好友可挑选成对图片，邀请一起换头像</small></span>
                                <input type="checkbox" role="switch" aria-label="情头模式" id="photosCreateCoupleToggle">
                            </label>
                        </div>
                    </div>
                </div>

                <!-- 自定义与重新排序抽屉弹窗 (完全对标截图框架排版，纯白浅色模式) -->
                <div class="photos-reorder-drawer-overlay" id="photosReorderDrawerOverlay">
                    <div class="photos-reorder-drawer-sheet">
                        <div class="photos-reorder-topbar">
                            <button type="button" class="photos-reorder-text-btn" id="photosReorderResetBtn">还原</button>
                            <button type="button" class="photos-reorder-circle-close" id="photosReorderCloseBtn" aria-label="关闭">
                                <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="#000000" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                            </button>
                        </div>
                        <div class="photos-reorder-header">
                            <h2 class="photos-reorder-title">自定义与<br>重新排序</h2>
                            <p class="photos-reorder-desc">重新排序或隐藏精选集以个性化视图。</p>
                        </div>
                        <div class="photos-reorder-list" id="photosReorderList">
                            <!-- 动态填充各精选集模块开启/关闭选项与排序把手 -->
                        </div>
                    </div>
                </div>

                <!-- 编辑相簿层叠卡片抽屉 (模仿截图) -->
                <div class="photos-album-sheet-overlay" id="photosAlbumSheetOverlay">
                    <div class="photos-album-sheet-modal">
                        <div class="photos-album-sheet-topbar">
                            <button type="button" class="photos-album-sheet-text-btn" id="photosAlbumSheetCancelBtn">取消</button>
                            <span class="photos-album-sheet-title">相簿</span>
                            <button type="button" class="photos-album-sheet-text-btn" id="photosAlbumSheetDoneBtn">完成</button>
                        </div>
                        <div class="photos-album-sheet-body">
                            <div class="photos-album-sheet-grid" id="photosAlbumSheetGrid"></div>
                        </div>
                        <div class="photos-album-sheet-footer">
                            <span class="photos-album-sheet-count-label" id="photosAlbumSheetCountLabel">已选择 0 个相簿</span>
                            <div class="photos-album-sheet-actions">
                                <button type="button" class="photos-album-sheet-action-btn" id="photosAlbumSheetPinBtn" disabled>置顶</button>
                                <button type="button" class="photos-album-sheet-action-btn danger" id="photosAlbumSheetDeleteBtn" disabled>删除</button>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- iOS 风格底部抽屉选择封面 (一行 4 张) -->
                <div class="photos-drawer-overlay" id="photosCoverPickerOverlay">
                    <div class="photos-drawer-sheet">
                        <div class="photos-drawer-handle"></div>
                        <div class="photos-drawer-header">
                            <span class="photos-drawer-title">选择相簿封面</span>
                            <button type="button" class="photos-drawer-close-btn" id="photosCoverPickerCloseBtn">取消</button>
                        </div>
                        <div class="photos-cover-grid" id="photosCoverGrid"></div>
                    </div>
                </div>

                <!-- iOS 原生纯白分享与隔空投送抽屉 (对标用户截图) -->
                <div class="photos-share-sheet-overlay" id="photosShareSheetOverlay">
                    <div class="photos-share-sheet" id="photosShareSheetModal">
                        <div class="photos-share-sheet-handle"></div>
                        <div class="photos-share-sheet-header">
                            <div class="photos-share-header-left">
                                <div class="photos-share-airdrop-icon-box" id="photosShareThumbBox">
                                    <svg viewBox="0 0 1080 1024" width="28" height="28" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M541.505506 538.55512m-71.837602 0a71.837602 71.837602 0 1 0 143.675204 0 71.837602 71.837602 0 1 0-143.675204 0Z" fill="#409eff"></path>
                                        <path d="M613.378014 741.414315a38.624056 38.624056 0 0 1-15.70793-73.897086 140.865229 140.865229 0 1 0-117.565133-1.308994 38.624056 38.624056 0 1 1-33.07392 69.813024 218.1657 218.1657 0 1 1 182.124727 2.059484 38.397163 38.397163 0 0 1-15.777744 3.333572z" fill="#409eff"></path>
                                        <path d="M396.992546 887.358441a38.397163 38.397163 0 0 1-16.179168-3.490651 381.807428 381.807428 0 0 1-220.958221-345.487202c0-209.753231 170.657937-380.480981 380.480981-380.480981s380.480981 170.657937 380.48098 380.480981a378.840375 378.840375 0 0 1-208.845661 339.483282 38.624056 38.624056 0 1 1-34.906512-68.905455 301.941329 301.941329 0 0 0 166.399343-270.64764c0-167.167286-135.995771-303.18051-303.18051-303.18051s-303.197963 136.013224-303.197963 303.18051a304.332425 304.332425 0 0 0 176.120806 275.394926 38.624056 38.624056 0 0 1-16.214075 73.687647z" fill="#409eff"></path>
                                        <path d="M308.574351 1023.999983a38.571696 38.571696 0 0 1-17.819774-4.345861A539.043811 539.043811 0 0 1 0.000785 540.282993C0.000785 242.373366 242.374151 0 540.266325 0s540.282993 242.373366 540.282992 540.282993a540.265539 540.265539 0 0 1-282.742747 475.042721 38.624056 38.624056 0 0 1-36.861276-67.875712 463.069788 463.069788 0 0 0 242.373366-407.167009c0-255.323682-207.693746-463.034882-463.052335-463.034882S77.26635 284.959311 77.26635 540.282993a462.022593 462.022593 0 0 0 249.249949 410.849646 38.624056 38.624056 0 0 1-17.907041 72.867344z" fill="#409eff"></path>
                                    </svg>
                                </div>
                                <div class="photos-share-title-col">
                                    <span class="photos-share-title-text" id="photosShareCountText">隔空投送</span>
                                    <span class="photos-share-options-pill" id="photosShareOptionsBtn">
                                        选项
                                        <svg viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="9 18 15 12 9 6"></polyline></svg>
                                    </span>
                                </div>
                            </div>
                            <button type="button" class="photos-share-close-glass-capsule" id="photosShareCloseBtn" aria-label="关闭">
                                <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                            </button>
                        </div>
                        <div class="photos-share-sheet-body">
                            <!-- 中间大照片卡片预览 -->
                            <div class="photos-share-preview-center">
                                <div class="photos-share-large-card">
                                    <img id="photosShareCenterImg" alt="照片预览">
                                    <div class="photos-share-checked-badge">
                                        <svg viewBox="0 0 24 24" fill="none"><polyline points="20 6 9 17 4 12"></polyline></svg>
                                    </div>
                                </div>
                            </div>

                            <!-- 仅展示当前登录的微信列表好友 -->
                            <div class="photos-share-section">
                                <div class="photos-share-section-title">隔空投送至好友</div>
                                <div class="photos-airdrop-contacts-row" id="photosAirdropContactsRow">
                                    <!-- 动态填充微信联系人 -->
                                </div>
                            </div>
                        </div>

                        <!-- 底部右下角小飞机 Send 按钮 -->
                        <div class="photos-share-sheet-footer">
                            <button type="button" class="photos-share-send-btn" id="photosShareSendBtn" disabled>
                                <span>Send</span>
                                <svg viewBox="0 0 1024 1024" width="18" height="18" fill="currentColor">
                                    <path d="M971.340829 41.145783c-17.49973-9.000156-34.999461-9.000156-43.999617 0L50.852947 476.641875c-17.49973 0-26.499887 17.49973-26.499887 34.999461s8.499574 34.999461 17.499731 34.99946l210.497346 130.497105c17.49973 8.499574 34.999461 8.499574 52.499191-9.000156l464.994311-417.996362 17.49973 8.499575-420.994693 443.995665c-8.499574 8.499574-8.499574 17.49973-8.499574 25.999305v191.49587c0 17.49973 9.000156 34.999461 26.499886 43.499035 17.49973 9.000156 34.999461 0 43.999617-8.499574l104.998383-104.497801 210.497346 139.497261c9.000156 8.499574 17.49973 8.499574 26.499887 8.499575h17.49973c17.49973-8.499574 26.499887-17.49973 26.499887-34.999461l175.497886-870.987023c-1.001164-25.498722-1.001164-42.998453-18.500895-51.498027z"></path>
                                </svg>
                            </button>
                        </div>
                    </div>
                </div>

                <!-- 通用输入弹窗 (对标系统通用输入弹窗样式规范) -->
                <div class="photos-modal-overlay" id="photosAlertModalOverlay">
                    <div class="photos-modal-dialog">
                        <div class="photos-modal-header">
                            <h3 class="photos-modal-title" id="photosModalTitle">标题</h3>
                            <p class="photos-modal-desc" id="photosModalDesc" style="display: none;"></p>
                        </div>
                        <div class="photos-modal-body">
                            <div id="photosModalInputSlot"></div>
                        </div>
                        <div class="photos-modal-footer">
                            <button type="button" class="photos-modal-btn cancel" id="photosModalCancelBtn">取消</button>
                            <button type="button" class="photos-modal-btn confirm" id="photosModalConfirmBtn">确认</button>
                        </div>
                    </div>
                </div>
                <input type="file" id="photosHiddenFileInput" accept="image/*" multiple style="display: none;">
                <!-- iOS 全屏沉浸式照片预览（对标截图） -->
                <div class="photos-preview-overlay" id="photosPreviewOverlay">
                    <div class="photos-viewer-topbar">
                        <button type="button" class="photos-viewer-circle-btn" id="photosViewerBackBtn" aria-label="返回">
                            <svg viewBox="0 0 24 24" fill="none" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"><polyline points="15 18 9 12 15 6"></polyline></svg>
                        </button>
                        <div class="photos-viewer-date-capsule" id="photosViewerDateCapsule">
                            <span class="photos-capsule-main-date" id="photosCapsuleMainDate">今天</span>
                            <span class="photos-capsule-sub-time" id="photosCapsuleSubTime">11:22</span>
                        </div>
                        <button type="button" class="photos-viewer-circle-btn" id="photosViewerMoreBtn" aria-label="更多操作">
                            <svg viewBox="0 0 24 24" fill="currentColor"><circle cx="5" cy="12" r="2.2"/><circle cx="12" cy="12" r="2.2"/><circle cx="19" cy="12" r="2.2"/></svg>
                        </button>
                    </div>

                    <!-- 图片详情页右上角三个点展开的白色磨砂菜单 -->
                    <div class="photos-filter-menu-overlay" id="photosViewerMenuOverlay">
                        <div class="photos-filter-dropdown photos-viewer-dropdown" id="photosViewerDropdown">
                            <div class="photos-menu-list">
                                <div class="photos-dropdown-item" id="photosViewerDownloadBtn">
                                    <div class="photos-item-icon">
                                        <svg viewBox="0 0 1024 1024" fill="currentColor"><path d="M502 662.3c3.1 3 7.1 4.4 11.1 4.4s8-1.5 11.1-4.4l211.2-201.6c2.6-2.5 4.1-5.5 4.7-8.6 1.8-9.2-5-19.2-15.8-19.2H595.5V165.8c0-8.8-7.1-16-16-16H446.6c-8.8 0-16 7.1-16 16V433H301.8c-10.9 0-17.6 10-15.8 19.2 0.6 3.1 2.1 6 4.7 8.6L502 662.3z"></path><path d="M859.6 653H626.7l-58.3 55.6c-15 14.3-34.6 22.2-55.3 22.2-20.7 0-40.4-7.9-55.3-22.2L399.5 653H166.6c-8.9 0-16.1 7.2-16.1 16v190.1c0 8.9 7.2 16.1 16.1 16.1h693c8.9 0 16-7.2 16-16.1v-190c0-8.9-7.2-16.1-16-16.1zM674.8 834.6c-19.5 0-35.2-15.8-35.2-35.2 0-19.5 15.8-35.2 35.2-35.2 19.5 0 35.2 15.8 35.2 35.2 0 19.4-15.8 35.2-35.2 35.2z m122.8 0c-19.5 0-35.2-15.8-35.2-35.2 0-19.5 15.8-35.2 35.2-35.2 19.5 0 35.2 15.8 35.2 35.2 0.1 19.4-15.7 35.2-35.2 35.2z"></path></svg>
                                    </div>
                                    <span class="photos-item-label">下载图片</span>
                                </div>
                                <div class="photos-dropdown-item" id="photosViewerWallpaperBtn">
                                    <div class="photos-item-icon">
                                        <svg viewBox="0 0 1024 1024" fill="currentColor"><path d="M512 864.416l0.032-32-0.064 0.032L512 864.416zM736 64 288 64c-35.328 0-64 28.672-64 64l0 768c0 35.328 28.672 64 64 64l448 0c35.328 0 64-28.672 64-64L800 128C800 92.672 771.328 64 736 64zM512 896.416c-35.296 0-64-28.704-64-64 0-35.296 28.704-64 64-64s64 28.704 64 64C576 867.712 547.296 896.416 512 896.416zM704 704 320 704 320 160l384 0L704 704z"></path></svg>
                                    </div>
                                    <span class="photos-item-label">设为壁纸</span>
                                </div>
                                <div class="photos-dropdown-item" id="photosViewerRenameBtn">
                                    <div class="photos-item-icon">${PHOTO_ICONS.edit}</div>
                                    <span class="photos-item-label">重命名</span>
                                </div>
                                <div class="photos-dropdown-item" id="photosViewerDescriptionBtn">
                                    <div class="photos-item-icon">${PHOTO_DESCRIPTION_ICON}</div>
                                    <span class="photos-item-label">编辑图片描述</span>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="photos-viewer-main">
                        <img id="photosViewerMainImg" alt="照片">
                    </div>
                    <!-- 胶卷缩略图滑动条 -->
                    <div class="photos-viewer-filmstrip-wrap" id="photosViewerFilmstrip"></div>
                    <div class="photos-viewer-info-panel" id="photosViewerInfoPanel">
                        <div class="photos-viewer-info-header">
                            <span class="photos-viewer-info-title" id="photosViewerTitle">图片详情</span>
                            <span class="photos-viewer-info-res" id="photosViewerResolution"></span>
                        </div>
                        <div style="color: rgba(60, 60, 67, 0.7); font-size: 13px;" id="photosViewerMeta"></div>
                        <div class="photos-viewer-prompt-box" id="photosViewerPromptBox">
                            <div style="color: #1c1c1e; word-break: break-all; font-size: 14px; line-height: 1.45;" id="photosViewerPrompt"></div>
                            <button type="button" class="photos-copy-prompt-btn" id="photosCopyPromptBtn">复制提示词</button>
                        </div>
                    </div>

                    <!-- iOS 风格图片编辑/调谐抽屉 -->
                    <div class="photos-tune-drawer" id="photosTuneDrawer">
                        <div class="photos-tune-drawer-bar">
                            <button type="button" class="photos-tune-bar-btn" id="photosTuneResetBtn">复原</button>
                            <span class="photos-tune-bar-title">编辑照片</span>
                            <button type="button" class="photos-tune-bar-btn confirm" id="photosTuneSaveBtn">完成</button>
                        </div>
                        <!-- 工具栏：旋转、翻转 -->
                        <div class="photos-tune-quick-actions">
                            <button type="button" class="photos-tune-act-btn" id="photosTuneRotateBtn" aria-label="旋转90度">
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M21.5 2v6h-6M21.34 15.57a10 10 0 1 1-.57-8.38l5.67-5.67"/></svg>
                                <span>旋转90°</span>
                            </button>
                            <button type="button" class="photos-tune-act-btn" id="photosTuneFlipBtn" aria-label="水平翻转">
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2v20M4 18l4-6-4-6M20 18l-4-6 4-6"/></svg>
                                <span>水平翻转</span>
                            </button>
                        </div>
                        <!-- 滤镜滑动选择 -->
                        <div class="photos-tune-filters-track" id="photosTuneFiltersTrack">
                            <div class="photos-tune-filter-item active" data-filter="none">
                                <div class="photos-tune-filter-preview filter-none"></div>
                                <span>原图</span>
                            </div>
                            <div class="photos-tune-filter-item" data-filter="vivid">
                                <div class="photos-tune-filter-preview filter-vivid"></div>
                                <span>鲜明</span>
                            </div>
                            <div class="photos-tune-filter-item" data-filter="warm">
                                <div class="photos-tune-filter-preview filter-warm"></div>
                                <span>暖色</span>
                            </div>
                            <div class="photos-tune-filter-item" data-filter="cool">
                                <div class="photos-tune-filter-preview filter-cool"></div>
                                <span>冷色</span>
                            </div>
                            <div class="photos-tune-filter-item" data-filter="mono">
                                <div class="photos-tune-filter-preview filter-mono"></div>
                                <span>黑白</span>
                            </div>
                            <div class="photos-tune-filter-item" data-filter="vintage">
                                <div class="photos-tune-filter-preview filter-vintage"></div>
                                <span>复古</span>
                            </div>
                            <div class="photos-tune-filter-item" data-filter="dramatic">
                                <div class="photos-tune-filter-preview filter-dramatic"></div>
                                <span>戏剧</span>
                            </div>
                        </div>
                    </div>
                    <!-- 底部磨砂工具栏（对标截图） -->
                    <div class="photos-viewer-bottombar">
                        <button type="button" class="photos-viewer-circle-btn" id="photosViewerShareBtn" aria-label="分享/保存">
                            <svg viewBox="0 0 1024 1024" width="26" height="26">
                                <path d="M352.213333 341.333333a42.666667 42.666667 0 0 1 0 85.333334H256.298667c-23.125333 0-42.666667 24.746667-42.666667 54.058666l-0.341333 318.549334C213.333333 828.544 232.832 853.333333 256 853.333333h512.128c22.954667 0 42.325333-24.576 42.325333-53.717333L810.709333 469.333333a42.368 42.368 0 0 0-12.501333-30.165333 42.368 42.368 0 0 0-30.165333-12.501333h-85.290667a42.666667 42.666667 0 0 1 0-85.333334h85.290667c34.176 0 66.304 13.312 90.496 37.504 24.149333 24.192 37.461333 56.32 37.461333 90.538667l-0.298667 330.282667c0 76.629333-57.258667 139.008-127.616 139.008H256c-70.570667 0-128-62.549333-128-139.434667l0.298667-318.549333c0-76.8 57.429333-139.349333 128-139.349334z m160.853334-213.333333c1.834667 0.085333 3.712 0.256 5.546666 0.554667l1.962667 0.256a42.026667 42.026667 0 0 1 6.912 2.048l1.578667 0.725333c1.024 0.469333 2.090667 0.853333 3.072 1.365333l2.56 1.621334c0.298667 0.213333 0.64 0.341333 0.981333 0.512l128 85.333333a42.666667 42.666667 0 0 1-47.36 71.04L554.666667 250.325333V640a42.666667 42.666667 0 0 1-85.333334 0V250.325333l-61.653333 41.130667a42.666667 42.666667 0 1 1-47.36-71.04l128-85.333333 0.938667-0.512a41.941333 41.941333 0 0 1 5.589333-2.986667l2.048-0.810667c1.877333-0.682667 3.84-1.28 5.76-1.706666l1.28-0.341334A41.642667 41.642667 0 0 1 511.018667 128z" fill="#272A2B"></path>
                            </svg>
                        </button>
                        <div class="photos-viewer-mid-capsule">
                            <button type="button" class="photos-capsule-item-btn" id="photosViewerFavBtn" aria-label="收藏">
                                <svg viewBox="0 0 1024 1024" width="22" height="22"><path d="M171.712 571.648l0.352 0.32 287.904 252.8a64 64 0 0 0 82.912 1.344l296.832-244.544a215.584 215.584 0 1 0-301.824-300.576L512 316.672l-25.888-35.616a215.584 215.584 0 1 0-314.4 290.624zM32 407.584a279.584 279.584 0 0 1 480-194.944 279.584 279.584 0 0 1 480 194.944 278.144 278.144 0 0 1-113.024 224.512l-295.36 243.392a128 128 0 0 1-165.888-2.592L129.984 620.16A278.976 278.976 0 0 1 32 407.584z" fill="#000000"></path></svg>
                            </button>
                            <button type="button" class="photos-capsule-item-btn" id="photosViewerInfoToggleBtn" aria-label="详细信息">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" width="22" height="22">
                                    <g id="info">
                                        <path id="Union" fill="#000000" d="M12 2c5.5228 0 10 4.47715 10 10 0 5.5228 -4.4772 10 -10 10 -5.52285 0 -10 -4.4772 -10 -10C2 6.47715 6.47715 2 12 2m0 2c-4.41828 0 -8 3.58172 -8 8 0 4.4183 3.58172 8 8 8 4.4183 0 8 -3.5817 8 -8 0 -4.41828 -3.5817 -8 -8 -8m0 7c0.5523 0 1 0.4477 1 1v3h0.5c0.5523 0 1 0.4477 1 1s-0.4477 1 -1 1h-3c-0.55228 0 -1 -0.4477 -1 -1s0.44772 -1 1 -1h0.5v-2h-0.5c-0.55228 0 -1 -0.4477 -1 -1s0.44772 -1 1 -1zm-0.25 -4c0.6904 0 1.25 0.55964 1.25 1.25s-0.5596 1.25 -1.25 1.25 -1.25 -0.55964 -1.25 -1.25S11.0596 7 11.75 7"></path>
                                    </g>
                                </svg>
                            </button>
                            <button type="button" class="photos-capsule-item-btn" id="photosViewerTuneBtn" aria-label="调节">
                                <svg viewBox="0 0 1024 1024" width="22" height="22" fill="#000000">
                                    <path d="M715.648 822.848a36.608 36.608 0 1 0-3.072-73.088 36.608 36.608 0 0 0 3.072 73.088z m-104.96 0H165.504a36.608 36.608 0 0 1 0-73.152h445.184a109.76 109.76 0 0 1 206.912 0h42.88a36.608 36.608 0 0 1 0 73.152h-42.88a109.76 109.76 0 0 1-206.912 0z m5.76-548.544a109.76 109.76 0 0 1-206.912 0H165.504a36.608 36.608 0 0 1 0-73.152H409.6a109.696 109.696 0 0 1 206.848 0h244.096-0.064a36.608 36.608 0 0 1 0 73.152H616.448zM313.408 548.544a36.608 36.608 0 1 0-3.072-73.088 36.608 36.608 0 0 0 3.072 73.088z m102.72-73.088h444.416-0.064a36.544 36.544 0 1 1 0 73.088H415.232a109.76 109.76 0 0 1-206.912 0h-42.88a36.544 36.544 0 0 1 0-73.088h42.048a109.696 109.696 0 0 1 208.64 0z m60.352-237.76a36.544 36.544 0 1 0 73.088 0 36.544 36.544 0 0 0-73.088 0z" fill="#000000"></path>
                                </svg>
                            </button>
                        </div>
                        <button type="button" class="photos-viewer-circle-btn" id="photosViewerDeleteBtn" aria-label="删除">
                            <svg viewBox="0 0 1024 1024" width="20" height="20" fill="#000000">
                                <path d="M874.446 252.062v661.661c0 60.904-49.373 110.277-110.277 110.277H260.046c-60.904 0-110.277-49.373-110.277-110.277V252.062h-31.507C92.16 252.062 71 230.902 71 204.8s21.16-47.262 47.262-47.262h787.692c26.102 0 47.261 21.16 47.261 47.262s-21.16 47.262-47.261 47.262h-31.508z m-94.523 0h-535.63v661.661c0 8.7 7.053 15.754 15.753 15.754H764.17c8.7 0 15.754-7.053 15.754-15.754V252.062zM401.831 409.6c26.102 0 47.261 21.16 47.261 47.262v220.553c0 26.102-21.16 47.262-47.261 47.262-26.102 0-47.262-21.16-47.262-47.262V456.862c0-26.102 21.16-47.262 47.262-47.262z m220.554 0c26.101 0 47.261 21.16 47.261 47.262v220.553c0 26.102-21.16 47.262-47.261 47.262-26.102 0-47.262-21.16-47.262-47.262V456.862c0-26.102 21.16-47.262 47.262-47.262zM370.323 0h283.57c26.101 0 47.26 21.16 47.26 47.262 0 26.101-21.159 47.261-47.26 47.261h-283.57c-26.102 0-47.261-21.16-47.261-47.261C323.062 21.16 344.222 0 370.323 0z" fill="#000000"></path>
                            </svg>
                        </button>
                    </div>
                </div>
            </div>
        `;
    }

    // 图片交互状态管理：缩放、位移与临时编辑
    let viewerZoomLevel = 1;
    let viewerPanX = 0;
    let viewerPanY = 0;
    let currentEditState = { rotation: 0, flipH: false, filter: 'none' };

    function resetViewerZoomAndTransform() {
        viewerZoomLevel = 1;
        viewerPanX = 0;
        viewerPanY = 0;
        const img = document.getElementById('photosViewerMainImg');
        if (img) {
            applyImageTransforms(img);
        }
    }

    function applyImageTransforms(img) {
        if (!img) return;
        const transforms = [];
        if (viewerZoomLevel > 1) {
            transforms.push(`translate(${viewerPanX}px, ${viewerPanY}px) scale(${viewerZoomLevel})`);
        }
        if (currentEditState.rotation % 360 !== 0) {
            transforms.push(`rotate(${currentEditState.rotation}deg)`);
        }
        if (currentEditState.flipH) {
            transforms.push('scaleX(-1)');
        }
        img.style.transform = transforms.join(' ');

        // 滤镜应用
        const filterCssMap = {
            none: 'none',
            vivid: 'saturate(1.4) contrast(1.1)',
            warm: 'sepia(0.3) saturate(1.2) hue-rotate(-10deg)',
            cool: 'hue-rotate(180deg) saturate(1.1) sepia(0.1)',
            mono: 'grayscale(1) contrast(1.15)',
            vintage: 'sepia(0.55) contrast(0.95) brightness(0.95)',
            dramatic: 'contrast(1.45) saturate(1.2) brightness(0.9)'
        };
        img.style.filter = filterCssMap[currentEditState.filter] || 'none';
    }

    /* 打开全屏大图预览（极速响应：先展示大图，胶卷与元数据分帧异步挂载） */
    function openPhotosPreview(index) {
        if (index < 0 || index >= currentFilteredItems.length) return;
        currentPreviewIndex = index;
        const item = currentFilteredItems[index];
        const overlay = document.getElementById('photosPreviewOverlay');
        const img = document.getElementById('photosViewerMainImg');
        const mainDateEl = document.getElementById('photosCapsuleMainDate');
        const subTimeEl = document.getElementById('photosCapsuleSubTime');
        const title = document.getElementById('photosViewerTitle');
        const meta = document.getElementById('photosViewerMeta');
        const prompt = document.getElementById('photosViewerPrompt');
        const promptBox = document.getElementById('photosViewerPromptBox');
        const resEl = document.getElementById('photosViewerResolution');
        const infoPanel = document.getElementById('photosViewerInfoPanel');
        const favBtn = document.getElementById('photosViewerFavBtn');
        const filmstrip = document.getElementById('photosViewerFilmstrip');
        const tuneDrawer = document.getElementById('photosTuneDrawer');

        if (!overlay || !img) return;
        if (infoPanel) infoPanel.classList.remove('show');
        if (tuneDrawer) tuneDrawer.classList.remove('show');

        // 复原编辑与缩放状态
        currentEditState = { rotation: 0, flipH: false, filter: 'none' };
        resetViewerZoomAndTransform();

        // 1. 第一优先级：先立即更新大图和弹窗可见性，做到 0 毫秒秒开！
        img.decoding = 'async';
        img.src = item.src || '';
        img.alt = item.title || '照片';
        overlay.classList.add('show');

        // 动态计算顶部胶囊时间（如“今天”与“11:22”）
        const dateObj = item.createdAt ? new Date(item.createdAt) : new Date();
        const now = new Date();
        const isToday = (dateObj.toDateString() === now.toDateString());
        const pad = n => String(n).padStart(2, '0');

        if (mainDateEl) {
            mainDateEl.textContent = isToday ? '今天' : `${dateObj.getMonth() + 1}月${dateObj.getDate()}日`;
        }
        if (subTimeEl) {
            subTimeEl.textContent = `${pad(dateObj.getHours())}:${pad(dateObj.getMinutes())}`;
        }

        if (title) title.textContent = item.title || '图片';
        if (meta) meta.textContent = [item.sourceName || '图库照片', formatAlbumTime(item.createdAt)].filter(Boolean).join(' · ');
        if (prompt) prompt.textContent = item.description || item.prompt || '无附加描述文本';
        if (promptBox) {
            const copyBtn = document.getElementById('photosCopyPromptBtn');
            if (copyBtn) copyBtn.style.display = (item.description || item.prompt) ? 'inline-flex' : 'none';
        }

        if (favBtn) {
            favBtn.innerHTML = isItemFavorite(item) ? FAV_FILLED_HEART_SVG : FAV_EMPTY_HEART_SVG;
        }

        // 2. 第二优先级：延迟异步挂载胶卷缩略图条与读取分辨率，绝不阻塞全屏大图呈现
        requestAnimationFrame(() => {
            if (resEl) {
                if (img.naturalWidth && img.naturalHeight) {
                    resEl.textContent = `${img.naturalWidth} × ${img.naturalHeight}`;
                } else {
                    resEl.textContent = '';
                }
            }

            if (filmstrip) {
                filmstrip.innerHTML = '';
                const total = currentFilteredItems.length;
                const WINDOW_SIZE = 6; // 窗口缩小至前后6张，大幅削减图片解码负载
                const startIdx = Math.max(0, index - WINDOW_SIZE);
                const endIdx = Math.min(total, index + WINDOW_SIZE + 1);

                const fragment = document.createDocumentFragment();
                for (let i = startIdx; i < endIdx; i++) {
                    const it = currentFilteredItems[i];
                    const thumb = document.createElement('div');
                    thumb.className = 'photos-filmstrip-thumb' + (i === index ? ' active' : '');
                    thumb.innerHTML = `<img src="${it.src}" alt="thumb" loading="lazy" decoding="async">`;
                    const targetIdx = i;
                    thumb.addEventListener('click', (e) => {
                        e.stopPropagation();
                        openPhotosPreview(targetIdx);
                    });
                    fragment.appendChild(thumb);
                }
                filmstrip.appendChild(fragment);

                const activeThumb = filmstrip.querySelector('.photos-filmstrip-thumb.active');
                if (activeThumb) {
                    activeThumb.scrollIntoView({ behavior: 'auto', inline: 'center', block: 'nearest' });
                }
            }
        });
    }

    function closePhotosPreview() {
        const overlay = document.getElementById('photosPreviewOverlay');
        const tuneDrawer = document.getElementById('photosTuneDrawer');
        if (tuneDrawer) tuneDrawer.classList.remove('show');
        if (overlay) {
            overlay.classList.remove('show');
            overlay.style.transform = '';
            overlay.style.opacity = '';
        }
        resetViewerZoomAndTransform();
        currentPreviewIndex = -1;
    }

    function navigatePreview(step) {
        if (currentPreviewIndex < 0 || !currentFilteredItems.length) return;
        let nextIndex = currentPreviewIndex + step;
        if (nextIndex < 0) nextIndex = currentFilteredItems.length - 1;
        if (nextIndex >= currentFilteredItems.length) nextIndex = 0;
        openPhotosPreview(nextIndex);
    }

    function createPhotoTileElement(item, index) {
        const tile = document.createElement('button');
        tile.type = 'button';
        tile.className = 'photos-tile' + (selectedIndices.has(index) ? ' selected' : '');
        
        tile.addEventListener('click', (e) => {
            e.stopPropagation();
            if (isSelectMode) {
                const isSelected = selectedIndices.has(index);
                if (isSelected) {
                    selectedIndices.delete(index);
                    tile.classList.remove('selected');
                } else {
                    selectedIndices.add(index);
                    tile.classList.add('selected');
                }
                updateSelectState(false);
            } else {
                openPhotosPreview(index);
            }
        });

        const img = document.createElement('img');
        img.loading = 'lazy';
        img.decoding = 'async';
        img.alt = item.title || '图片';
        img.src = item.src || '';

        const badge = document.createElement('div');
        badge.className = 'photos-tile-select-badge';
        badge.innerHTML = `<svg viewBox="0 0 24 24" fill="none"><polyline points="20 6 9 17 4 12"></polyline></svg>`;

        tile.append(img, badge);

        if (isItemFavorite(item)) {
            const favHeart = document.createElement('div');
            favHeart.className = 'photos-tile-fav-tag';
            favHeart.innerHTML = `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/></svg>`;
            tile.appendChild(favHeart);
        }

        return tile;
    }

    function appendPhotoTiles(fromIndex, count) {
        const grid = document.getElementById('photosAlbumGrid');
        if (!grid) return;
        const toIndex = Math.min(fromIndex + count, currentFilteredItems.length);
        if (fromIndex >= toIndex) return;

        const fragment = document.createDocumentFragment();
        for (let i = fromIndex; i < toIndex; i++) {
            fragment.appendChild(createPhotoTileElement(currentFilteredItems[i], i));
        }
        grid.appendChild(fragment);
        currentRenderCount = toIndex;
    }

    /* 渲染相册主图库（首屏轻量秒开 + 触底流式递增，彻底消除图片多引起的卡顿） */
    function renderPhotosLibrary(forceRebuild = false) {
        const grid = document.getElementById('photosAlbumGrid');
        const empty = document.getElementById('photosAlbumEmpty');
        const count = document.getElementById('photosAlbumCount');
        const title = document.getElementById('photosHeaderTitle');
        const navBackGroup = document.getElementById('photosNavBackGroup');
        const navBackText = document.getElementById('photosNavBackText');
        if (!grid || !empty) return;

        currentFilteredItems = getDisplayPhotoItems();
        const monthHeading = document.getElementById('photosLibraryMonthHeading');
        if (monthHeading) {
            const firstPhoto = currentFilteredItems[0];
            const photoDate = firstPhoto && firstPhoto.createdAt ? new Date(firstPhoto.createdAt) : null;
            monthHeading.textContent = firstPhoto
                ? (photoDate && !Number.isNaN(photoDate.getTime())
                    ? `${photoDate.getMonth() + 1}月`
                    : '最近项目')
                : '';
        }

        if (title) {
            if (activePhotosTab === 'library') {
                if (currentFilterContext.type === 'album') {
                    const albums = getStoredAlbums();
                    const cur = albums.find(a => a.id === currentFilterContext.id);
                    title.textContent = cur ? cur.name : '相簿';
                } else if (currentFilterContext.type === 'favorites') {
                    title.textContent = '个人收藏';
                } else if (currentFilterContext.type === 'media_prompt') {
                    title.textContent = 'AI 创意图';
                } else if (currentFilterContext.type === 'media_plain') {
                    title.textContent = '普通照片';
                } else if (currentFilterContext.type === 'source') {
                    title.textContent = currentFilterContext.name || '分类';
                } else if (currentFilterContext.type === 'trash') {
                    title.textContent = '最近删除';
                } else {
                    title.textContent = '图库';
                }
            }
        }

        if (navBackGroup) {
            const hasSubFilter = currentFilterContext.type !== 'all';
            navBackGroup.style.display = hasSubFilter ? 'flex' : 'none';
            if (hasSubFilter && navBackText) {
                if (currentFilterContext.returnTab === 'albums_full') {
                    navBackText.textContent = '相簿';
                } else if (currentFilterContext.returnTab === 'collections') {
                    navBackText.textContent = '精选集';
                } else {
                    navBackText.textContent = '图库';
                }
            }
        }

        // 若数据未改动且已渲染过，跳过 DOM 摧毁重建
        if (!forceRebuild && !isLibraryDirty && libraryRenderedOnce) {
            return;
        }

        if (count) {
            count.textContent = `${currentFilteredItems.length.toLocaleString('zh-CN')}个项目`;
        }

        grid.innerHTML = '';
        grid.classList.remove('photos-couple-grid');
        currentRenderCount = 0;

        const coupleAlbum = currentFilterContext.type === 'album'
            ? getStoredAlbums().find(album => album.id === currentFilterContext.id && album.coupleAvatarEnabled) : null;
        if (coupleAlbum) {
            empty.style.display = 'none';
            grid.style.display = 'grid';
            renderCoupleAvatarLibrary(coupleAlbum, grid);
            currentRenderCount = currentFilteredItems.length;
            libraryRenderedOnce = true;
            isLibraryDirty = false;
            return;
        }

        if (!currentFilteredItems.length) {
            empty.style.display = 'block';
            empty.textContent = currentFilterContext.type === 'trash' ? '废纸篓为空' : '暂无照片';
            grid.style.display = 'none';
            libraryRenderedOnce = true;
            isLibraryDirty = false;
            return;
        }

        empty.style.display = 'none';
        grid.style.display = 'grid';

        // 第一批仅挂载首屏所需（36 张），耗时仅 2~3ms，极度丝滑
        appendPhotoTiles(0, LIBRARY_PAGE_CHUNK);

        // 监听滚动，当距离底部还剩 400px 时自动无感追加下一批
        const scrollContainer = document.querySelector('#photos-page-main .photos-scroll');
        if (scrollContainer && !scrollContainer.dataset.lazyScrollBound) {
            scrollContainer.dataset.lazyScrollBound = '1';
            scrollContainer.addEventListener('scroll', () => {
                if (activePhotosTab !== 'library') return;
                if (currentRenderCount >= currentFilteredItems.length) return;
                const remain = scrollContainer.scrollHeight - (scrollContainer.scrollTop + scrollContainer.clientHeight);
                if (remain < 450) {
                    appendPhotoTiles(currentRenderCount, LIBRARY_PAGE_CHUNK);
                }
            }, { passive: true });
        }

        libraryRenderedOnce = true;
        isLibraryDirty = false;
    }

    /* 通用输入弹窗控制器 (统一复用系统预设弹窗UI规范) */
    let currentModalConfirmHandler = null;

    function showPhotosDialog({ title, desc, placeholder, isTextarea, defaultValue = '', confirmText = '确定', onConfirm }) {
        const overlay = document.getElementById('photosAlertModalOverlay');
        const titleEl = document.getElementById('photosModalTitle');
        const descEl = document.getElementById('photosModalDesc');
        const inputSlot = document.getElementById('photosModalInputSlot');
        const confirmBtn = document.getElementById('photosModalConfirmBtn');
        if (!overlay || !titleEl || !inputSlot) return;

        titleEl.textContent = title || '';
        if (desc) {
            descEl.textContent = desc;
            descEl.style.display = 'block';
        } else {
            descEl.style.display = 'none';
        }

        if (confirmBtn) confirmBtn.textContent = confirmText;

        inputSlot.innerHTML = '';
        let inputEl = null;
        if (isTextarea) {
            inputEl = document.createElement('textarea');
            inputEl.className = 'photos-modal-textarea';
            inputEl.placeholder = placeholder || '';
            inputEl.value = defaultValue;
        } else {
            inputEl = document.createElement('input');
            inputEl.type = 'text';
            inputEl.className = 'photos-modal-input';
            inputEl.placeholder = placeholder || '';
            inputEl.value = defaultValue;
            inputEl.addEventListener('keydown', (e) => {
                if (e.key === 'Enter') {
                    e.preventDefault();
                    if (typeof currentModalConfirmHandler === 'function') {
                        currentModalConfirmHandler();
                    }
                }
            });
        }
        inputSlot.appendChild(inputEl);

        currentModalConfirmHandler = () => {
            const val = inputEl.value;
            if (typeof onConfirm === 'function') {
                const result = onConfirm(val);
                if (result !== false) {
                    closePhotosDialog();
                }
            } else {
                closePhotosDialog();
            }
        };

        overlay.classList.add('show');
        setTimeout(() => {
            inputEl.focus();
            if (inputEl.select) inputEl.select();
        }, 50);
    }

    function closePhotosDialog() {
        const overlay = document.getElementById('photosAlertModalOverlay');
        if (overlay) overlay.classList.remove('show');
        currentModalConfirmHandler = null;
    }

    /* 打开新建共享相簿抽屉 (对标用户截图) */
    let tempCreateAlbumCover = '';
    let tempSelectedContactIds = new Set();
    let editingShareTargetAlbum = null;

    async function handleCreateNewAlbum(targetAlbumToEdit = null) {
        editingShareTargetAlbum = targetAlbumToEdit;
        const overlay = document.getElementById('photosCreateAlbumDrawerOverlay');
        const titleEl = document.getElementById('photosCreateDrawerTitle');
        const nameInput = document.getElementById('photosCreateAlbumNameInput');
        const coverBox = document.getElementById('photosCreateCoverPreview');
        const contactsList = document.getElementById('photosCreateContactsList');
        if (!overlay) return;
        document.getElementById('photosCreateCoupleToggle').checked = targetAlbumToEdit?.coupleAvatarEnabled === true;

        tempSelectedContactIds.clear();
        tempCreateAlbumCover = '';

        if (editingShareTargetAlbum) {
            if (titleEl) titleEl.textContent = '好友共享';
            if (nameInput) {
                nameInput.value = editingShareTargetAlbum.name || '';
                nameInput.disabled = false;
            }
            tempCreateAlbumCover = editingShareTargetAlbum.customCover || (editingShareTargetAlbum.photoSrcs && editingShareTargetAlbum.photoSrcs[0]) || '';
            if (Array.isArray(editingShareTargetAlbum.sharedMemberIds)) {
                editingShareTargetAlbum.sharedMemberIds.forEach(id => tempSelectedContactIds.add(id));
            }
        } else {
            if (titleEl) titleEl.textContent = '创建相簿';
            if (nameInput) {
                nameInput.value = '';
                nameInput.disabled = false;
                nameInput.placeholder = '相簿名称';
            }
        }

        if (coverBox) {
            if (tempCreateAlbumCover) {
                coverBox.innerHTML = `<img src="${tempCreateAlbumCover}" alt="封面">`;
            } else {
                coverBox.innerHTML = ALBUM_EMPTY_SVG;
            }
        }

        if (contactsList) {
            contactsList.innerHTML = `<div style="padding:14px;color:#8e8e93;text-align:center;font-size:13px;">加载好友列表中...</div>`;
            const contacts = await getShareContactsAsync();
            if (!contacts.length) {
                contactsList.innerHTML = `<div style="padding:16px;color:#8e8e93;text-align:center;font-size:13px;">暂无可邀请的微信角色好友</div>`;
            } else {
                contactsList.innerHTML = '';
                contacts.forEach(c => {
                    const displayName = c.remark || c.name || '好友';
                    const isChecked = tempSelectedContactIds.has(c.id);
                    const row = document.createElement('div');
                    row.className = 'photos-create-contact-row' + (isChecked ? ' checked' : '');
                    row.innerHTML = `
                        <div class="photos-create-contact-left">
                            <div class="photos-create-contact-avatar">
                                ${c.avatar ? `<img src="${c.avatar}" alt="${displayName}">` : `<span>${displayName.slice(0, 1)}</span>`}
                            </div>
                            <span class="photos-create-contact-name">${displayName}</span>
                        </div>
                        <div class="photos-create-contact-check">
                            <svg viewBox="0 0 24 24" fill="none" stroke="#ffffff" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
                        </div>
                    `;
                    row.addEventListener('click', () => {
                        if (tempSelectedContactIds.has(c.id)) {
                            tempSelectedContactIds.delete(c.id);
                            row.classList.remove('checked');
                        } else {
                            tempSelectedContactIds.add(c.id);
                            row.classList.add('checked');
                        }
                    });
                    contactsList.appendChild(row);
                });
            }
        }

        overlay.classList.add('show');
    }

    function closeCreateAlbumDrawer() {
        const overlay = document.getElementById('photosCreateAlbumDrawerOverlay');
        if (overlay) overlay.classList.remove('show');
        editingShareTargetAlbum = null;
    }

    function saveCreateAlbumDrawer() {
        const nameInput = document.getElementById('photosCreateAlbumNameInput');
        const name = (nameInput ? nameInput.value : '').trim();
        if (!name) { alert('请输入共享相簿名称'); return; }
        const albums = getStoredAlbums();
        const coupleEnabled = document.getElementById('photosCreateCoupleToggle')?.checked === true;
        if (coupleEnabled && currentCoupleAccountId() === 'default') {
            alert('请先登录微信面具账号，再开启情头模式');
            return;
        }
        if (coupleEnabled && !tempSelectedContactIds.size) {
            alert('请先选择共享好友，再开启情头模式');
            return;
        }
        if (editingShareTargetAlbum?.coupleAvatarAccountId &&
            String(editingShareTargetAlbum.coupleAvatarAccountId) !== currentCoupleAccountId()) {
            alert('请切换到创建此情头相簿的面具账号后编辑');
            return;
        }

        if (editingShareTargetAlbum) {
            const target = albums.find(a => a.id === editingShareTargetAlbum.id);
            if (target) {
                target.name = name;
                if (currentFilterContext.type === 'album' && currentFilterContext.id === target.id) currentFilterContext.name = name;
                target.isShared = tempSelectedContactIds.size > 0;
                target.sharedMemberIds = Array.from(tempSelectedContactIds);
                target.coupleAvatarEnabled = coupleEnabled;
                if (coupleEnabled) target.coupleAvatarAccountId = currentCoupleAccountId();
                if (tempCreateAlbumCover) target.customCover = tempCreateAlbumCover;
                saveStoredAlbums(albums);
                if (typeof window.showToast === 'function') window.showToast('相簿信息已更新');
            }
        } else {
            const newAlbum = {
                id: 'alb_' + Date.now(),
                name: name,
                photoSrcs: tempCreateAlbumCover ? [tempCreateAlbumCover] : [],
                customCover: tempCreateAlbumCover,
                isShared: tempSelectedContactIds.size > 0,
                sharedMemberIds: Array.from(tempSelectedContactIds),
                coupleAvatarEnabled: coupleEnabled,
                coupleAvatarAccountId: coupleEnabled ? currentCoupleAccountId() : null,
                createdAt: new Date().toISOString()
            };
            albums.unshift(newAlbum);
            saveStoredAlbums(albums);
            if (typeof window.showToast === 'function') window.showToast('共享相簿已创建');
        }

        closeCreateAlbumDrawer();
        renderPhotosApp();
    }

    /* URL 批量导入逻辑（iOS 风格居中多行弹窗，支持指定导入到特定相簿） */
    function handleUrlBatchImport(targetAlbumId) {
        let mode = 'single';
        let descriptionInput;
        showPhotosDialog({
            title: 'URL 导入图片',
            desc: '单张可填写描述；批量导入时每行一个链接',
            isTextarea: true,
            placeholder: 'https://example.com/photo.jpg',
            confirmText: '导入',
            onConfirm: text => {
                const lines = text.split('\n').map(url => url.trim()).filter(Boolean);
                if (!lines.length || (mode === 'single' && lines.length !== 1) || lines.some(url => !isPhotoHttpUrl(url))) {
                    alert(mode === 'single' ? '请输入一个有效的 http 或 https 图片链接' : '请确保每行都是有效的 http 或 https 图片链接');
                    return false;
                }
                const urls = [...new Set(lines)];
                if (!Array.isArray(window.photoAlbumItems)) window.photoAlbumItems = [];
                const now = Date.now();
                urls.forEach((src, index) => {
                    const existing = window.photoAlbumItems.find(item => item.src === src);
                    const description = mode === 'single' ? descriptionInput.value.trim() : '';
                    if (existing) {
                        if (description) existing.description = description;
                    } else {
                        window.photoAlbumItems.push({ src, title: '导入图片', sourceName: 'URL导入', description,
                            createdAt: new Date(now - index * 1000).toISOString() });
                    }
                });
                if (targetAlbumId) {
                    const albums = getStoredAlbums();
                    const target = albums.find(album => album.id === targetAlbumId);
                    if (target) {
                        target.photoSrcs = [...new Set([...(target.photoSrcs || []), ...urls])];
                        saveStoredAlbums(albums);
                        currentFilterContext = { type: 'album', id: targetAlbumId, name: target.name };
                    }
                }
                markCollectionsDirty();
                if (typeof window.savePhotoAlbumData === 'function') window.savePhotoAlbumData();
                scheduleCoupleAvatarSync();
                renderPhotosApp();
            }
        });
        const slot = document.getElementById('photosModalInputSlot');
        if (!slot) return;
        const urlInput = slot.querySelector('textarea');
        const modes = document.createElement('div');
        modes.className = 'photos-url-modes';
        descriptionInput = document.createElement('textarea');
        descriptionInput.className = 'photos-modal-textarea photos-description-input';
        descriptionInput.placeholder = '图片描述（选填，例如：白色小猫，戴着粉色围巾）';
        descriptionInput.maxLength = 1000;
        descriptionInput.setAttribute('aria-label', '图片描述');
        const preview = document.createElement('img');
        preview.className = 'photos-url-preview';
        preview.alt = '待导入图片预览';
        preview.hidden = true;
        preview.addEventListener('error', () => { preview.hidden = true; });
        [['single', '单张上传'], ['batch', '批量上传']].forEach(([value, label]) => {
            const button = document.createElement('button');
            button.type = 'button';
            button.textContent = label;
            button.className = value === mode ? 'active' : '';
            button.addEventListener('click', () => {
                mode = value;
                Array.from(modes.children).forEach(child => child.classList.toggle('active', child === button));
                descriptionInput.hidden = mode === 'batch';
                preview.hidden = true;
                urlInput.placeholder = mode === 'single' ? 'https://example.com/photo.jpg' : '每行一个图片链接';
                urlInput.rows = mode === 'single' ? 2 : 5;
            });
            modes.appendChild(button);
        });
        urlInput.rows = 2;
        urlInput.setAttribute('aria-label', '图片链接');
        urlInput.addEventListener('change', () => {
            if (mode === 'single' && isPhotoHttpUrl(urlInput.value.trim())) {
                preview.hidden = false;
                preview.src = urlInput.value.trim();
            } else preview.hidden = true;
        });
        slot.prepend(modes);
        slot.append(preview, descriptionInput);
    }

    function isPhotoHttpUrl(value) {
        try { return ['http:', 'https:'].includes(new URL(value).protocol); }
        catch (_) { return false; }
    }

    /* 将选中的照片批量添加到相簿 */
    function handleAddSelectedToAlbum() {
        if (!selectedIndices.size) return;
        const albums = getStoredAlbums();
        if (!albums.length) {
            const createFirst = confirm('当前尚未创建任何相簿，是否立即新建？');
            if (createFirst) {
                handleCreateNewAlbum();
            }
            return;
        }

        const albumNames = albums.map((a, i) => `${i + 1}. ${a.name}`).join('\n');
        const choose = prompt(`请选择要加入的相簿编号 (输入数字):\n${albumNames}`, '1');
        const idx = parseInt(choose, 10) - 1;
        if (Number.isNaN(idx) || idx < 0 || idx >= albums.length) {
            return;
        }

        const targetAlbum = albums[idx];
        const selectedSrcs = Array.from(selectedIndices).map(i => currentFilteredItems[i] && currentFilteredItems[i].src).filter(Boolean);
        targetAlbum.photoSrcs = Array.from(new Set([...(targetAlbum.photoSrcs || []), ...selectedSrcs]));
        saveStoredAlbums(albums);

        alert(`已成功将 ${selectedSrcs.length} 张照片加入到「${targetAlbum.name}」！`);
        toggleSelectMode();
    }

    /* 严格按照 iOS 相册设计的「精选集」渲染（DOM 缓存 + 脏检查，非变动 0 毫秒秒开） */
    function renderCollections(forceRebuild = false) {
        const container = document.getElementById('photosCollectionsContainer');
        if (!container) return;

        if (!forceRebuild && !isCollectionsDirty && collectionsRenderedOnce) {
            return;
        }

        const albums = getStoredAlbums();
        const allItems = getPhotoAlbumItems();
        const favorites = getStoredFavorites();
        const trash = getStoredTrash();
        const pinnedConfig = getStoredPinnedConfig();
        const secConfig = getStoredCuratedSectionsConfig();

        const contacts = getShareContactsSync();
        const contactMap = new Map();
        contacts.forEach(c => {
            if (c.id) contactMap.set(String(c.id), c);
            if (c.linkedContactId) contactMap.set(String(c.linkedContactId), c);
        });

        const allCover = allItems.length ? allItems[0].src : '';
        const favItems = allItems.filter(i => favorites.includes(i.src));
        const favCover = favItems.length ? favItems[0].src : '';
        const trashCover = trash.length ? trash[0].src : '';

        // 来源统计
        const sourceMap = {};
        allItems.forEach(i => {
            const sName = i.sourceName || '生图';
            sourceMap[sName] = (sourceMap[sName] || 0) + 1;
        });
        const sourceEntries = Object.entries(sourceMap);

        const sharedAlbumsList = albums.filter(alb => alb.isShared || (Array.isArray(alb.sharedMemberIds) && alb.sharedMemberIds.length > 0));

        // 仅在好友缓存未建立时静默预加载一次，禁止在循环或主干流程中重复狂刷
        if (!cachedShareContacts) {
            ensureContactsPreloaded();
        }

        function buildSharedAvatarHtml(alb) {
            if (!alb || !Array.isArray(alb.sharedMemberIds) || !alb.sharedMemberIds.length) return '';
            const rawId = String(alb.sharedMemberIds[0]);
            const matched = contactMap.get(rawId) || contactMap.get(rawId.replace(/^char_/, '')) || matchContactFromList(contacts, rawId);
            const charAvatar = matched ? matched.avatar : '';
            const charName = matched ? (matched.remark || matched.name || '好友') : '好友';
            return `
                <div class="photos-album-shared-avatar-badge top-right" title="与 ${charName} 共享">
                    ${charAvatar ? `<img src="${charAvatar}" alt="${charName}">` : `<span>${charName.slice(0, 1)}</span>`}
                </div>
            `;
        }

        const sectionBuilders = {
            pinned: () => {
                if (!secConfig.pinned) return '';
                return `
                    <div class="photos-curated-section">
                        <div class="photos-curated-header">
                            <button type="button" class="photos-curated-title-btn" id="photosPinnedTitleNavBtn" aria-label="查看个人收藏">
                                <span>固定</span>
                                <svg class="photos-curated-title-chevron" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"><polyline points="9 18 15 12 9 6"></polyline></svg>
                            </button>
                            <div class="photos-pinned-header-right">
                                <button type="button" class="photos-curated-text-action" id="photosPinnedEditBtn">编辑</button>
                                <button type="button" class="photos-header-chevron-btn ${isPinnedCollapsed ? 'collapsed' : ''}" id="photosPinnedChevronBtn" aria-label="折叠固定">
                                    <svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="#000000" stroke-width="2.8" stroke-linecap="round" stroke-linejoin="round"><path d="m6 9 6 6 6-6"/></svg>
                                </button>
                            </div>
                        </div>
                        <div class="photos-pinned-scroll ${isPinnedCollapsed ? 'collapsed' : ''}">
                            ${pinnedConfig.favorites ? `
                                <div class="photos-pinned-card" id="photosPinnedFavCard">
                                    <div class="photos-pinned-cover ${!favCover ? 'is-empty' : ''}">
                                        ${favCover ? `<img src="${favCover}" alt="个人收藏">` : `<div class="photos-pinned-placeholder">${ALBUM_EMPTY_SVG}</div>`}
                                        <div class="photos-pinned-white-heart">
                                            <svg viewBox="0 0 24 24" fill="${favCover ? '#ffffff' : '#8e8e93'}"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/></svg>
                                        </div>
                                        <div class="photos-card-bottom-text">个人收藏</div>
                                    </div>
                                </div>
                            ` : ''}
                            ${pinnedConfig.trash ? `
                                <div class="photos-pinned-card" id="photosPinnedTrashCard">
                                    <div class="photos-pinned-cover ${!trashCover ? 'is-empty' : ''}">
                                        ${trashCover ? `<img src="${trashCover}" alt="最近删除">` : `<div class="photos-pinned-placeholder">${ALBUM_EMPTY_SVG}</div>`}
                                        <div class="photos-card-bottom-text">最近删除</div>
                                    </div>
                                </div>
                            ` : ''}
                        </div>
                    </div>
                `;
            },
            albums: () => {
                if (!secConfig.albums) return '';
                return `
                    <div class="photos-curated-section">
                        <div class="photos-curated-header">
                            <button type="button" class="photos-curated-title-btn" id="photosAlbumTitleNavBtn" aria-label="查看全部相簿">
                                <span>相簿</span>
                                <svg class="photos-curated-title-chevron" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"><polyline points="9 18 15 12 9 6"></polyline></svg>
                            </button>
                            <button type="button" class="photos-header-chevron-btn ${isAlbumsCollapsed ? 'collapsed' : ''}" id="photosAlbumChevronBtn" aria-label="折叠相簿">
                                <svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="#000000" stroke-width="2.8" stroke-linecap="round" stroke-linejoin="round"><path d="m6 9 6 6 6-6"/></svg>
                            </button>
                        </div>
                        <div class="photos-horiz-scroll ${isAlbumsCollapsed ? 'collapsed' : ''}" id="photosAlbumHorizScroll">
                            <div class="photos-curated-card" id="photosCardAllPhotos">
                                <div class="photos-curated-card-cover ${!allCover ? 'is-empty' : ''}">
                                    ${allCover ? `<img src="${allCover}" alt="全部">` : `<div class="photos-curated-empty-cover">${ALBUM_EMPTY_SVG}</div>`}
                                    <div class="photos-card-bottom-text">全部</div>
                                </div>
                            </div>
                            ${albums.map(alb => {
                                const targetSrc = alb.customCover || ((alb.photoSrcs && alb.photoSrcs.length) ? alb.photoSrcs[alb.photoSrcs.length - 1] : '');
                                return `
                                    <div class="photos-curated-card photos-album-jump-card" data-album-id="${alb.id}" data-album-name="${alb.name}">
                                        <div class="photos-curated-card-cover ${!targetSrc ? 'is-empty' : ''}">
                                            ${buildSharedAvatarHtml(alb)}
                                            ${targetSrc ? `<img src="${targetSrc}" alt="${alb.name}">` : `<div class="photos-curated-empty-cover">${ALBUM_EMPTY_SVG}</div>`}
                                            <div class="photos-card-bottom-text">${alb.name}</div>
                                        </div>
                                    </div>
                                `;
                            }).join('')}
                        </div>
                    </div>
                `;
            },
            sharedAlbums: () => {
                if (!secConfig.sharedAlbums) return '';
                return `
                    <div class="photos-curated-section">
                        <div class="photos-curated-header">
                            <button type="button" class="photos-curated-title-btn" id="photosSharedAlbumTitleNavBtn" aria-label="查看共享相簿">
                                <span>共享相簿</span>
                                <svg class="photos-curated-title-chevron" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"><polyline points="9 18 15 12 9 6"></polyline></svg>
                            </button>
                            <button type="button" class="photos-header-chevron-btn ${isSharedAlbumsCollapsed ? 'collapsed' : ''}" id="photosSharedAlbumChevronBtn" aria-label="折叠共享相簿">
                                <svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="#000000" stroke-width="2.8" stroke-linecap="round" stroke-linejoin="round"><path d="m6 9 6 6 6-6"/></svg>
                            </button>
                        </div>
                        <div class="photos-horiz-scroll ${isSharedAlbumsCollapsed ? 'collapsed' : ''}">
                            ${sharedAlbumsList.length ? sharedAlbumsList.map(alb => {
                                const targetSrc = alb.customCover || ((alb.photoSrcs && alb.photoSrcs.length) ? alb.photoSrcs[alb.photoSrcs.length - 1] : '');
                                return `
                                    <div class="photos-curated-card photos-album-jump-card" data-album-id="${alb.id}" data-album-name="${alb.name}">
                                        <div class="photos-curated-card-cover ${!targetSrc ? 'is-empty' : ''}">
                                            ${buildSharedAvatarHtml(alb)}
                                            ${targetSrc ? `<img src="${targetSrc}" alt="${alb.name}">` : `<div class="photos-curated-empty-cover">${ALBUM_EMPTY_SVG}</div>`}
                                            <div class="photos-card-bottom-text">${alb.name}</div>
                                        </div>
                                    </div>
                                `;
                            }).join('') : `
                                <div style="display:flex;align-items:center;padding:24px 10px;color:#8e8e93;font-size:13px;">暂无共享相簿</div>
                            `}
                        </div>
                    </div>
                `;
            },
            moreSections: () => {
                if (!secConfig.moreSections) return '';
                return `
                    <div class="photos-curated-section photos-menu-section">
                        <div class="photos-ios-plain-group">
                            <div class="photos-ios-plain-row" id="photosRowFavorites">
                                <span class="photos-ios-plain-title">个人收藏</span>
                                <div class="photos-ios-round-arrow">
                                    <svg viewBox="0 0 24 24" fill="none" stroke="#000000" stroke-width="2.8" stroke-linecap="round" stroke-linejoin="round"><path d="m9 18 6-6-6-6"/></svg>
                                </div>
                            </div>
                            <div class="photos-ios-plain-row" id="photosRowMediaPrompt">
                                <span class="photos-ios-plain-title">AI 创意图</span>
                                <div class="photos-ios-round-arrow">
                                    <svg viewBox="0 0 24 24" fill="none" stroke="#000000" stroke-width="2.8" stroke-linecap="round" stroke-linejoin="round"><path d="m9 18 6-6-6-6"/></svg>
                                </div>
                            </div>
                            ${sourceEntries.map(([sName]) => `
                                <div class="photos-ios-plain-row photos-source-row" data-source-name="${encodeURIComponent(sName)}">
                                    <span class="photos-ios-plain-title">${sName}</span>
                                    <div class="photos-ios-round-arrow">
                                        <svg viewBox="0 0 24 24" fill="none" stroke="#000000" stroke-width="2.8" stroke-linecap="round" stroke-linejoin="round"><path d="m9 18 6-6-6-6"/></svg>
                                    </div>
                                </div>
                            `).join('')}
                            <div class="photos-ios-plain-row" id="photosRowTrash">
                                <span class="photos-ios-plain-title">最近删除</span>
                                <div class="photos-ios-round-arrow">
                                    <svg viewBox="0 0 24 24" fill="none" stroke="#000000" stroke-width="2.8" stroke-linecap="round" stroke-linejoin="round"><path d="m9 18 6-6-6-6"/></svg>
                                </div>
                            </div>
                        </div>
                    </div>
                `;
            }
        };

        const renderOrder = Array.isArray(secConfig.order) ? secConfig.order : DEFAULT_CURATED_ORDER;
        let sectionsHtml = '';
        renderOrder.forEach(key => {
            if (typeof sectionBuilders[key] === 'function') {
                sectionsHtml += sectionBuilders[key]();
            }
        });

        container.innerHTML = sectionsHtml;

        // 绑定卡片与行点击事件
        const cardAll = container.querySelector('#photosCardAllPhotos');
        if (cardAll) cardAll.addEventListener('click', () => {
            openFilterView({ type: 'all' });
        });

        // 折叠切换逻辑：允许点击折叠小圆钮及折叠箭头
        const toggleAlbumCollapse = (e) => {
            if (e) e.stopPropagation();
            isAlbumsCollapsed = !isAlbumsCollapsed;
            renderCollections(true);
        };
        const albumChevron = container.querySelector('#photosAlbumChevronBtn');
        if (albumChevron) albumChevron.addEventListener('click', toggleAlbumCollapse);

        const togglePinnedCollapse = (e) => {
            if (e) e.stopPropagation();
            isPinnedCollapsed = !isPinnedCollapsed;
            renderCollections(true);
        };
        const pinnedChevron = container.querySelector('#photosPinnedChevronBtn');
        if (pinnedChevron) pinnedChevron.addEventListener('click', togglePinnedCollapse);

        const toggleSharedCollapse = (e) => {
            if (e) e.stopPropagation();
            isSharedAlbumsCollapsed = !isSharedAlbumsCollapsed;
            renderCollections(true);
        };
        const sharedAlbumChevron = container.querySelector('#photosSharedAlbumChevronBtn');
        if (sharedAlbumChevron) sharedAlbumChevron.addEventListener('click', toggleSharedCollapse);

        const pinnedEditBtn = container.querySelector('#photosPinnedEditBtn');
        if (pinnedEditBtn) pinnedEditBtn.addEventListener('click', () => {
            openReorderDrawer();
        });

        const pinnedFav = container.querySelector('#photosPinnedFavCard');
        if (pinnedFav) pinnedFav.addEventListener('click', () => {
            openFilterView({ type: 'favorites', name: '个人收藏' });
        });

        const pinnedTrash = container.querySelector('#photosPinnedTrashCard');
        if (pinnedTrash) pinnedTrash.addEventListener('click', () => {
            openFilterView({ type: 'trash', name: '最近删除' });
        });

        const rowFav = container.querySelector('#photosRowFavorites');
        if (rowFav) rowFav.addEventListener('click', () => {
            openFilterView({ type: 'favorites', name: '个人收藏' });
        });

        const rowPrompt = container.querySelector('#photosRowMediaPrompt');
        if (rowPrompt) rowPrompt.addEventListener('click', () => {
            openFilterView({ type: 'media_prompt' });
        });

        const rowTrash = container.querySelector('#photosRowTrash');
        if (rowTrash) rowTrash.addEventListener('click', () => {
            openFilterView({ type: 'trash', name: '最近删除' });
        });

        const albumTitleNav = container.querySelector('#photosAlbumTitleNavBtn');
        if (albumTitleNav) albumTitleNav.addEventListener('click', () => {
            albumScopeType = 'all';
            setPhotosTab('albums_full');
        });

        const sharedAlbumTitleNav = container.querySelector('#photosSharedAlbumTitleNavBtn');
        if (sharedAlbumTitleNav) sharedAlbumTitleNav.addEventListener('click', () => {
            albumScopeType = 'shared';
            setPhotosTab('albums_full');
        });

        const pinnedTitleNav = container.querySelector('#photosPinnedTitleNavBtn');
        if (pinnedTitleNav) pinnedTitleNav.addEventListener('click', () => {
            openFilterView({ type: 'favorites' });
        });

        container.querySelectorAll('.photos-album-jump-card').forEach(card => {
            card.addEventListener('click', () => {
                const albId = card.dataset.albumId;
                const albName = card.dataset.albumName;
                openFilterView({ type: 'album', id: albId, name: albName });
            });
        });

        container.querySelectorAll('.photos-source-row').forEach(row => {
            row.addEventListener('click', () => {
                const sName = decodeURIComponent(row.dataset.sourceName);
                openFilterView({ type: 'source', name: sName });
            });
        });

        collectionsRenderedOnce = true;
        isCollectionsDirty = false;
    }

    /* 全屏独立相簿列表页面（纯粹相簿浏览：单列/双列排版、按日期/名称排序，编辑统一收敛至弹窗抽屉） */
    function renderAlbumsFullList() {
        const list = document.getElementById('photosAlbumsFullList');
        const capsuleWrap = document.getElementById('photosTopFloatingCapsuleWrap');
        if (!list) return;

        if (capsuleWrap) capsuleWrap.style.display = 'flex';
        list.classList.toggle('grid-mode', albumLayout === 'grid');

        let albums = getStoredAlbums();
        const allItems = getPhotoAlbumItems();
        const contacts = getShareContactsSync();
        const contactMap = new Map();
        contacts.forEach(c => {
            if (c.id) contactMap.set(String(c.id), c);
            if (c.linkedContactId) contactMap.set(String(c.linkedContactId), c);
        });

        // 悬浮胶囊同步
        const scopePersonalBtn = document.getElementById('photosScopePersonalBtn');
        const scopeSharedBtn = document.getElementById('photosScopeSharedBtn');
        const scopeCapsule = document.getElementById('photosScopeCapsule');
        if (scopeCapsule) scopeCapsule.setAttribute('data-scope', albumScopeType === 'shared' ? 'shared' : 'personal');
        if (scopePersonalBtn && scopeSharedBtn) {
            scopePersonalBtn.classList.toggle('active', albumScopeType !== 'shared');
            scopeSharedBtn.classList.toggle('active', albumScopeType === 'shared');
        }

        // 复用顶层 getSortedAlbumsList 统一排序算法，杜绝逻辑割裂与代码重复
        albums = getSortedAlbumsList();

        // 根据“个人”或“共享”筛选
        if (albumScopeType === 'shared') {
            albums = albums.filter(a => a.isShared || (a.sharedMemberIds && a.sharedMemberIds.length));
        } else if (albumScopeType === 'personal') {
            albums = albums.filter(a => !a.isShared && (!a.sharedMemberIds || !a.sharedMemberIds.length));
        }

        const backBtn = document.getElementById('photosAlbumsSubpageBackBtn');
        if (backBtn) {
            backBtn.innerHTML = `<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"><polyline points="15 18 9 12 15 6"></polyline></svg>`;
            backBtn.style.width = '40px';
            backBtn.style.padding = '';
            backBtn.style.borderRadius = '50%';
        }

        let html = '';
        if (albumScopeType !== 'shared') {
            html += `
                <div class="photos-album-list-row" id="photosFullRowAll">
                    <div class="photos-album-list-cover">
                        ${allItems.length ? `<img src="${allItems[0].src}" alt="最近项目">` : ALBUM_EMPTY_SVG}
                    </div>
                    <div class="photos-album-list-info">
                        <div class="photos-album-list-name-row">
                            <span class="photos-album-list-name">最近项目</span>
                        </div>
                        <div class="photos-album-list-count">${allItems.length}</div>
                    </div>
                </div>
            `;
        }

        albums.forEach((alb) => {
            const count = alb.photoSrcs ? alb.photoSrcs.length : 0;
            const coverSrc = alb.customCover || (count ? alb.photoSrcs[count - 1] : '');
            const isShared = alb.isShared || (Array.isArray(alb.sharedMemberIds) && alb.sharedMemberIds.length > 0);

            ensureContactsPreloaded();

            // 共享相簿封面角色头像：单列列表模式严格在右下角 (bottom-right)，网格模式在右上角 (top-right)
            let sharedBadgeHtml = '';
            const badgePosClass = (albumLayout === 'grid') ? 'top-right' : 'bottom-right';
            if (isShared && Array.isArray(alb.sharedMemberIds) && alb.sharedMemberIds.length > 0) {
                const rawId = String(alb.sharedMemberIds[0]);
                const matchedContact = contactMap.get(rawId) || contactMap.get(rawId.replace(/^char_/, '')) || matchContactFromList(contacts, rawId);
                const charAvatar = matchedContact ? matchedContact.avatar : '';
                const charName = matchedContact ? (matchedContact.remark || matchedContact.name || '好友') : '好友';
                sharedBadgeHtml = `
                    <div class="photos-album-shared-avatar-badge ${badgePosClass}" title="与 ${charName} 共享">
                        ${charAvatar ? `<img src="${charAvatar}" alt="${charName}">` : `<span>${charName.slice(0, 1)}</span>`}
                    </div>
                `;
            } else if (isShared) {
                sharedBadgeHtml = `
                    <div class="photos-album-shared-avatar-badge default ${badgePosClass}">
                        <svg viewBox="0 0 24 24" width="12" height="12" fill="currentColor"><path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="8.5" cy="7" r="4"></circle><polyline points="17 11 19 13 23 9"></polyline></svg>
                    </div>
                `;
            }

            const pinnedSvgHtml = alb.pinned ? `<span class="photos-album-pinned-icon" title="已置顶">${PINNED_THUMBTACK_SVG}</span>` : '';

            html += `
                <div class="photos-album-list-row photos-full-album-row" data-album-id="${alb.id}" data-album-name="${alb.name}">
                    <div class="photos-album-list-cover">
                        ${coverSrc ? `<img src="${coverSrc}" alt="${alb.name}">` : ALBUM_EMPTY_SVG}
                        ${sharedBadgeHtml}
                    </div>
                    <div class="photos-album-list-info">
                        <div class="photos-album-list-name-row">
                            <span class="photos-album-list-name">${alb.name}</span>
                            ${pinnedSvgHtml}
                        </div>
                        <div class="photos-album-list-count">${count}</div>
                    </div>
                </div>
            `;
        });

        if (!albums.length && albumScopeType === 'shared') {
            html += `<div style="text-align:center;padding:60px 20px;color:#8e8e93;font-size:14px;">暂无共享相簿，点击右上角加号邀请好友创建</div>`;
        }

        list.innerHTML = html;

        // 最近项目点击
        const rowAll = list.querySelector('#photosFullRowAll');
        if (rowAll) {
            rowAll.addEventListener('click', () => {
                openFilterView({ type: 'all' });
            });
        }

        // 点击直接进入相簿
        list.querySelectorAll('.photos-full-album-row').forEach(row => {
            const albId = row.dataset.albumId;
            const albName = row.dataset.albumName;

            row.addEventListener('click', () => {
                openFilterView({ type: 'album', id: albId, name: albName });
            });
        });
    }

    // 核心统一跳转函数：记录来源视图，激活过滤视图并强制标记脏刷新
    function openFilterView(filterContext) {
        const fromTab = activePhotosTab;
        currentFilterContext = {
            ...filterContext,
            returnTab: filterContext.returnTab || fromTab
        };
        isLibraryDirty = true;
        setPhotosTab('library');
    }


    // Full-screen Photos search uses its own view and keeps library filters unchanged.
    function appendPhotosSearchTiles() {
        const grid = document.getElementById('photosSearchResultsGrid');
        const moreBtn = document.getElementById('photosSearchMoreBtn');
        if (!grid) return;
        const end = Math.min(photosSearchShown + PHOTOS_SEARCH_PAGE_CHUNK, photosSearchMatches.length);
        const fragment = document.createDocumentFragment();
        for (let index = photosSearchShown; index < end; index++) {
            fragment.appendChild(createPhotoTileElement(photosSearchMatches[index], index));
        }
        grid.appendChild(fragment);
        photosSearchShown = end;
        if (moreBtn) moreBtn.style.display = photosSearchShown < photosSearchMatches.length ? 'block' : 'none';
    }

    function renderPhotosSearchResults() {
        const input = document.getElementById('photosSearchInput');
        const grid = document.getElementById('photosSearchResultsGrid');
        const caption = document.getElementById('photosSearchResultsCaption');
        const empty = document.getElementById('photosSearchEmpty');
        const moreBtn = document.getElementById('photosSearchMoreBtn');
        if (!grid || !caption || !empty) return;

        const keyword = String(input?.value || '').trim().toLowerCase();
        const searching = Boolean(keyword || photosSearchFilter);
        document.querySelectorAll('[data-photos-search-filter]').forEach(button => {
            button.classList.toggle('active', button.dataset.photosSearchFilter === photosSearchFilter);
        });

        grid.replaceChildren();
        photosSearchShown = 0;
        photosSearchMatches = [];
        if (!searching) {
            currentFilteredItems = [];
            caption.textContent = '搜索照片、提示词或来源';
            grid.style.display = 'none';
            empty.style.display = 'none';
            if (moreBtn) moreBtn.style.display = 'none';
            return;
        }

        const today = new Date().toDateString();
        const favorites = photosSearchFilter === 'favorites' ? getFavoritesSet() : null;
        photosSearchMatches = getSortedPhotoItems().filter(item => {
            if (photosSearchFilter === 'today') {
                const timestamp = item.createdAt ? new Date(item.createdAt) : null;
                if (!timestamp || Number.isNaN(timestamp.getTime()) || timestamp.toDateString() !== today) return false;
            } else if (photosSearchFilter === 'favorites' && !favorites.has(item.src)) {
                return false;
            } else if (photosSearchFilter === 'media_prompt' && !String(item.prompt || '').trim()) {
                return false;
            } else if (photosSearchFilter === 'local' && item.sourceName !== '本地导入') {
                return false;
            }

            if (!keyword) return true;
            return [item.title, item.description, item.prompt, item.sourceName].some(value =>
                String(value || '').toLowerCase().includes(keyword)
            );
        });
        currentFilteredItems = photosSearchMatches;
        caption.textContent = `搜索结果 · ${photosSearchMatches.length} 个项目`;
        grid.style.display = photosSearchMatches.length ? 'grid' : 'none';
        empty.style.display = photosSearchMatches.length ? 'none' : 'block';
        if (photosSearchMatches.length) appendPhotosSearchTiles();
        else if (moreBtn) moreBtn.style.display = 'none';
    }

    function renderPhotosApp() {
        if (activePhotosTab === 'albums_full') {
            renderAlbumsFullList();
        } else if (activePhotosTab === 'collections') {
            renderCollections();
        } else if (activePhotosTab === 'search') {
            renderPhotosSearchResults();
        } else {
            renderPhotosLibrary(false);
        }
    }

    /* 多选模式 */
    function toggleSelectMode() {
        isSelectMode = !isSelectMode;
        const app = document.getElementById(PHOTOS_APP_ID);
        const selectBtn = document.getElementById('photosSelectBtn');
        if (app) app.classList.toggle('select-mode', isSelectMode);
        if (selectBtn) {
            selectBtn.textContent = isSelectMode ? '完成' : '选择';
            selectBtn.classList.toggle('active', isSelectMode);
        }
        if (!isSelectMode) {
            selectedIndices.clear();
        }
        updateSelectState();
    }

    function updateSelectState(syncAllTiles = true) {
        const deleteBtn = document.getElementById('photosBatchDeleteBtn');
        const addToAlbumBtn = document.getElementById('photosAddToAlbumBtn');
        const favBtn = document.getElementById('photosBatchFavBtn');
        const allBtn = document.getElementById('photosSelectAllBtn');
        const count = selectedIndices.size;

        if (deleteBtn) {
            deleteBtn.disabled = count === 0;
            deleteBtn.textContent = currentFilterContext.type === 'trash' ? '永久删除' : `删除(${count || 0})`;
        }
        if (addToAlbumBtn) {
            if (currentFilterContext.type === 'trash') {
                addToAlbumBtn.textContent = '恢复';
                addToAlbumBtn.disabled = count === 0;
            } else {
                addToAlbumBtn.textContent = '添加到相簿';
                addToAlbumBtn.disabled = count === 0;
            }
        }
        if (favBtn) {
            favBtn.disabled = count === 0;
            const selectedItems = Array.from(selectedIndices).map(idx => currentFilteredItems[idx]).filter(Boolean);
            const allAreFav = selectedItems.length > 0 && selectedItems.every(isItemFavorite);
            favBtn.textContent = allAreFav ? '取消收藏' : '收藏';
        }
        if (allBtn) {
            allBtn.textContent = (count > 0 && count === currentFilteredItems.length) ? '取消全选' : '全选';
        }

        // 仅在全选/取消全选或模式切换时才执行全量扫描，单项点击时 0 毫秒响应
        if (syncAllTiles) {
            const tiles = document.querySelectorAll('#photosAlbumGrid .photos-tile');
            tiles.forEach((tile, index) => {
                tile.classList.toggle('selected', selectedIndices.has(index));
            });
        }
    }

    /* 批量切换收藏状态 */
    function handleBatchToggleFavorite() {
        if (!selectedIndices.size) return;
        const selectedItems = Array.from(selectedIndices).map(idx => currentFilteredItems[idx]).filter(Boolean);
        const allAreFav = selectedItems.every(isItemFavorite);
        let favs = getStoredFavorites();

        selectedItems.forEach(item => {
            if (!item || !item.src) return;
            const idx = favs.indexOf(item.src);
            if (allAreFav) {
                // 全部取消收藏
                if (idx >= 0) favs.splice(idx, 1);
            } else {
                // 统一加入收藏
                if (idx < 0) favs.push(item.src);
            }
        });

        saveStoredFavorites(favs);
        toggleSelectMode();
        renderPhotosApp();
    }

    /* 打开编辑相簿层叠卡片抽屉 */
    function openAlbumEditSheet() {
        selectedAlbumIds.clear();
        renderAlbumEditSheetGrid();
        const overlay = document.getElementById('photosAlbumSheetOverlay');
        if (overlay) overlay.classList.add('show');
    }

    function closeAlbumEditSheet() {
        const overlay = document.getElementById('photosAlbumSheetOverlay');
        if (overlay) overlay.classList.remove('show');
        selectedAlbumIds.clear();
    }

    function renderAlbumEditSheetGrid() {
        const grid = document.getElementById('photosAlbumSheetGrid');
        const countLabel = document.getElementById('photosAlbumSheetCountLabel');
        const pinBtn = document.getElementById('photosAlbumSheetPinBtn');
        const delBtn = document.getElementById('photosAlbumSheetDeleteBtn');
        if (!grid) return;

        const albums = getStoredAlbums();
        const selCount = selectedAlbumIds.size;

        if (countLabel) countLabel.textContent = `已选择 ${selCount} 个相簿`;
        if (pinBtn) {
            pinBtn.disabled = selCount === 0;
            // 判断选中的相簿是否已全部置顶
            const selectedAlbums = albums.filter(a => selectedAlbumIds.has(a.id));
            const allPinned = selectedAlbums.length > 0 && selectedAlbums.every(a => a.pinned);
            pinBtn.textContent = allPinned ? '取消置顶' : '置顶';
        }
        if (delBtn) {
            delBtn.disabled = selCount === 0;
            delBtn.textContent = selCount ? `删除(${selCount})` : '删除';
        }

        grid.innerHTML = '';
        albums.forEach(alb => {
            const count = alb.photoSrcs ? alb.photoSrcs.length : 0;
            const coverSrc = alb.customCover || (count ? alb.photoSrcs[count - 1] : '');
            const isSelected = selectedAlbumIds.has(alb.id);

            const card = document.createElement('div');
            card.className = 'photos-album-sheet-card' + (isSelected ? ' selected' : '');
            card.innerHTML = `
                <div class="photos-album-sheet-cover">
                    ${coverSrc ? `<img src="${coverSrc}" alt="${alb.name}">` : ALBUM_EMPTY_SVG}
                    <div class="photos-album-sheet-check">
                        <svg viewBox="0 0 24 24" fill="none"><polyline points="20 6 9 17 4 12"></polyline></svg>
                    </div>
                </div>
                <div class="photos-album-sheet-name">${alb.name}</div>
                <div class="photos-album-sheet-count">${count}</div>
            `;

            card.addEventListener('click', () => {
                if (selectedAlbumIds.has(alb.id)) {
                    selectedAlbumIds.delete(alb.id);
                } else {
                    selectedAlbumIds.add(alb.id);
                }
                renderAlbumEditSheetGrid();
            });

            grid.appendChild(card);
        });
    }

    function handleSelectAll() {
        if (selectedIndices.size === currentFilteredItems.length) {
            selectedIndices.clear();
        } else {
            selectedIndices = new Set(currentFilteredItems.map((_, i) => i));
        }
        updateSelectState();
    }

    async function askDangerConfirm(title, message, confirmText = '删除') {
        if (typeof showCustomConfirm === 'function') {
            return await showCustomConfirm(title, message, confirmText, true);
        }
        return window.confirm(message);
    }

    async function handleBatchDelete() {
        if (!selectedIndices.size) return;
        const count = selectedIndices.size;
        
        if (currentFilterContext.type === 'trash') {
            const confirmDelete = await askDangerConfirm('永久删除', `确定要彻底永久删除这 ${count} 张照片吗？此操作无法撤销。`, '永久删除');
            if (!confirmDelete) return;
            const toDelete = Array.from(selectedIndices).map(idx => currentFilteredItems[idx]).filter(Boolean);
            const toDeleteSrcs = toDelete.map(item => item.src).filter(Boolean);
            
            let trash = getStoredTrash();
            trash = trash.filter(t => !toDeleteSrcs.includes(t.src));
            saveStoredTrash(trash);

            // 同步清理相簿与收藏夹
            cleanupPhotoReferences(toDeleteSrcs);
        } else {
            const confirmDelete = await askDangerConfirm('移至最近删除', `确定要将这 ${count} 张照片移到最近删除吗？`, '删除');
            if (!confirmDelete) return;
            const toDeleteItems = Array.from(selectedIndices).map(idx => currentFilteredItems[idx]).filter(Boolean);
            const toDeleteSrcs = toDeleteItems.map(item => item.src).filter(Boolean);
            
            // 移入最近删除废纸篓
            const trash = getStoredTrash();
            toDeleteItems.forEach(item => {
                trash.unshift({ ...item, deletedAt: new Date().toISOString() });
            });
            saveStoredTrash(trash);

            if (Array.isArray(window.photoAlbumItems)) {
                window.photoAlbumItems = window.photoAlbumItems.filter(item => !toDeleteItems.includes(item));
            }

            // 同步清理相簿内部引用与收藏夹
            cleanupPhotoReferences(toDeleteSrcs);
        }

        selectedIndices.clear();
        toggleSelectMode();
        renderPhotosApp();
    }

    async function handleDeleteCurrentPreview() {
        if (currentPreviewIndex < 0 || !currentFilteredItems[currentPreviewIndex]) return;
        const item = currentFilteredItems[currentPreviewIndex];

        if (currentFilterContext.type === 'trash') {
            const confirmDelete = await askDangerConfirm('永久删除', '确定要彻底永久删除这张照片吗？此操作无法撤销。', '永久删除');
            if (!confirmDelete) return;
            let trash = getStoredTrash();
            trash = trash.filter(t => t.src !== item.src);
            saveStoredTrash(trash);
            if (item.src) cleanupPhotoReferences([item.src]);
        } else {
            const confirmDelete = await askDangerConfirm('移至最近删除', '确定要将这张照片移到最近删除吗？', '删除');
            if (!confirmDelete) return;

            const trash = getStoredTrash();
            trash.unshift({ ...item, deletedAt: new Date().toISOString() });
            saveStoredTrash(trash);

            if (Array.isArray(window.photoAlbumItems)) {
                window.photoAlbumItems = window.photoAlbumItems.filter(i => i.src !== item.src);
            }
            if (item.src) cleanupPhotoReferences([item.src]);
        }

        closePhotosPreview();
        renderPhotosApp();
    }

    function handleSaveCurrentPreview() {
        if (currentPreviewIndex < 0 || !currentFilteredItems[currentPreviewIndex]) return;
        const item = currentFilteredItems[currentPreviewIndex];
        if (!item.src) return;
        const a = document.createElement('a');
        a.href = item.src;
        a.download = (item.title || 'photo') + '.png';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
    }

    function setPhotosTab(tabName) {
        activePhotosTab = tabName;
        const libraryView = document.getElementById('photosLibraryView');
        const collectionsView = document.getElementById('photosCollectionsView');
        const searchView = document.getElementById('photosSearchView');
        const searchTab = document.getElementById('photosSearchBtn');
        const albumsListView = document.getElementById('photosAlbumsListView');
        const mainTopbar = document.getElementById('photosMainTopbar');
        const subpageTopbar = document.getElementById('photosAlbumsSubpageTopbar');
        const tabsCapsule = document.getElementById('photosTabsCapsule');
        const tabButtons = document.querySelectorAll('[data-photos-tab]');
        const countLine = document.getElementById('photosAlbumCount');
        const title = document.getElementById('photosHeaderTitle');
        const actionsLib = document.getElementById('photosTopActionsLibrary');
        const actionsCol = document.getElementById('photosTopActionsCollections');
        const navBackGroup = document.getElementById('photosNavBackGroup');
        const capsuleWrap = document.getElementById('photosTopFloatingCapsuleWrap');

        // 第一步：零延迟同步更新 UI 状态与底栏滑块，绝不让 JS 阻塞 CSS 动画！
        if (tabsCapsule) {
            tabsCapsule.setAttribute('data-active', activePhotosTab === 'albums_full' ? 'collections' : activePhotosTab);
        }
        tabButtons.forEach(button => {
            const isMatch = (activePhotosTab === 'albums_full')
                ? button.dataset.photosTab === 'collections'
                : button.dataset.photosTab === activePhotosTab;
            button.classList.toggle('active', isMatch);
        });
        if (searchTab) searchTab.classList.toggle('active', activePhotosTab === 'search');
        if (searchView) searchView.classList.toggle('active', activePhotosTab === 'search');

        if (activePhotosTab === 'albums_full') {
            if (mainTopbar) mainTopbar.style.display = 'none';
            if (subpageTopbar) subpageTopbar.style.display = 'flex';
            if (capsuleWrap) capsuleWrap.style.display = 'flex';
            if (libraryView) libraryView.classList.remove('active');
            if (collectionsView) collectionsView.classList.remove('active');
            if (albumsListView) albumsListView.classList.add('active');
            requestAnimationFrame(() => renderAlbumsFullList());
            return;
        }

        if (capsuleWrap) capsuleWrap.style.display = 'none';
        if (mainTopbar) mainTopbar.style.display = 'flex';
        if (subpageTopbar) subpageTopbar.style.display = 'none';
        if (albumsListView) albumsListView.classList.remove('active');

        if (activePhotosTab === 'search') {
            if (title) title.textContent = '搜索';
            if (countLine) countLine.style.display = 'none';
            if (actionsLib) actionsLib.style.display = 'none';
            if (actionsCol) actionsCol.style.display = 'none';
            if (navBackGroup) navBackGroup.style.display = 'none';
            const scroll = document.querySelector('#photos-page-main .photos-scroll');
            if (scroll) scroll.scrollTop = 0;
        } else if (activePhotosTab === 'collections') {
            if (title) title.textContent = '精选集';
            if (countLine) countLine.style.display = 'none';
            if (actionsLib) actionsLib.style.display = 'none';
            if (actionsCol) actionsCol.style.display = 'flex';
            if (navBackGroup) navBackGroup.style.display = 'none';
        } else {
            if (actionsLib) actionsLib.style.display = 'flex';
            if (actionsCol) actionsCol.style.display = 'none';
            if (countLine) countLine.style.display = 'block';
            if (title) {
                if (currentFilterContext.type === 'album') {
                    const albums = getStoredAlbums();
                    const cur = albums.find(a => a.id === currentFilterContext.id);
                    title.textContent = cur ? cur.name : '相簿';
                } else if (currentFilterContext.type === 'favorites') {
                    title.textContent = '个人收藏';
                } else if (currentFilterContext.type === 'media_prompt') {
                    title.textContent = 'AI 创意图';
                } else if (currentFilterContext.type === 'media_plain') {
                    title.textContent = '普通照片';
                } else if (currentFilterContext.type === 'source') {
                    title.textContent = currentFilterContext.name || '分类';
                } else if (currentFilterContext.type === 'trash') {
                    title.textContent = '最近删除';
                } else {
                    title.textContent = '图库';
                }
            }
            if (navBackGroup) {
                navBackGroup.style.display = currentFilterContext.type !== 'all' ? 'flex' : 'none';
            }
        }

        if (libraryView) libraryView.classList.toggle('active', activePhotosTab === 'library');
        if (collectionsView) collectionsView.classList.toggle('active', activePhotosTab === 'collections');

        // 第二步：使用 requestAnimationFrame 将重绘分帧，确保底栏滑块动画优先满帧执行
        requestAnimationFrame(() => {
            renderPhotosApp();
        });
    }

    function setJournalFabHiddenForPhotos(hidden) {
        const fab = document.getElementById('journal-fab');
        if (!fab) return;
        if (hidden) {
            if (previousJournalFabDisplay === null) previousJournalFabDisplay = fab.style.display || '';
            fab.style.display = 'none';
            return;
        }
        if (previousJournalFabDisplay !== null) {
            fab.style.display = previousJournalFabDisplay;
            previousJournalFabDisplay = null;
        }
    }

    function openPhotosApp() {
        ensurePhotosAppDom();
        bindPhotosApp();
        ensureContactsPreloaded();

        const app = document.getElementById(PHOTOS_APP_ID);
        if (!app) return;

        if (photosVisibilityTimer) {
            clearTimeout(photosVisibilityTimer);
            photosVisibilityTimer = 0;
        }

        app.style.display = 'flex';
        app.classList.add('show');
        app.setAttribute('aria-hidden', 'false');
        setJournalFabHiddenForPhotos(true);
        setPhotosTab(activePhotosTab);
    }

    function closePhotosApp(options = {}) {
        const app = document.getElementById(PHOTOS_APP_ID);
        if (!app) return;

        const immediateClose = options === true || Boolean(options && typeof options === 'object' && options.immediate);

        if (photosVisibilityTimer) {
            clearTimeout(photosVisibilityTimer);
            photosVisibilityTimer = 0;
        }

        app.classList.remove('show');
        app.setAttribute('aria-hidden', 'true');
        closePhotosPreview();
        if (isSelectMode) toggleSelectMode();
        setJournalFabHiddenForPhotos(false);

        if (immediateClose) {
            app.style.display = 'none';
            return;
        }

        photosVisibilityTimer = window.setTimeout(() => {
            photosVisibilityTimer = 0;
            if (!app.classList.contains('show')) app.style.display = 'none';
        }, 300);
    }

    function bindPhotosApp() {
        ensurePhotosAppDom();

        const topTitleWrap = document.getElementById('photosTopTitleWrap');
        const refreshBtn = document.getElementById('photosRefreshBtn');
        const selectBtn = document.getElementById('photosSelectBtn');
        const tabButtons = document.querySelectorAll('[data-photos-tab]');
        const searchBtn = document.getElementById('photosSearchBtn');
        const searchInput = document.getElementById('photosSearchInput');
        const searchMoreBtn = document.getElementById('photosSearchMoreBtn');

        const selectAllBtn = document.getElementById('photosSelectAllBtn');
        const addToAlbumBtn = document.getElementById('photosAddToAlbumBtn');
        const batchDeleteBtn = document.getElementById('photosBatchDeleteBtn');

        const viewerBackBtn = document.getElementById('photosViewerBackBtn');
        const viewerFavBtn = document.getElementById('photosViewerFavBtn');
        const viewerShareBtn = document.getElementById('photosViewerShareBtn');
        const viewerDeleteBtn = document.getElementById('photosViewerDeleteBtn');
        const viewerInfoToggleBtn = document.getElementById('photosViewerInfoToggleBtn');
        const viewerInfoPanel = document.getElementById('photosViewerInfoPanel');
        const viewerMainArea = document.querySelector('.photos-viewer-main');

        // iOS 标志性交互合集：双击放大、放大平移、下拉渐隐退出大图、左右轻扫切图
        if (viewerMainArea && !viewerMainArea.dataset.swipeBound) {
            viewerMainArea.dataset.swipeBound = '1';
            let touchStartX = 0;
            let touchStartY = 0;
            let touchStartTime = 0;
            let lastTapTime = 0;
            let isDraggingDismiss = false;
            let initialPanX = 0;
            let initialPanY = 0;
            const previewOverlay = document.getElementById('photosPreviewOverlay');
            const viewerImg = document.getElementById('photosViewerMainImg');

            viewerMainArea.addEventListener('touchstart', (e) => {
                if (!e.touches || e.touches.length !== 1) return;
                touchStartX = e.touches[0].clientX;
                touchStartY = e.touches[0].clientY;
                touchStartTime = Date.now();
                isDraggingDismiss = false;

                if (viewerZoomLevel > 1) {
                    initialPanX = viewerPanX;
                    initialPanY = viewerPanY;
                }
            }, { passive: false });

            viewerMainArea.addEventListener('touchmove', (e) => {
                if (!e.touches || e.touches.length !== 1) return;
                const curX = e.touches[0].clientX;
                const curY = e.touches[0].clientY;
                const deltaX = curX - touchStartX;
                const deltaY = curY - touchStartY;

                // 1. 如果处于放大状态，支持拖拽平移
                if (viewerZoomLevel > 1) {
                    e.preventDefault();
                    viewerPanX = initialPanX + deltaX;
                    viewerPanY = initialPanY + deltaY;
                    applyImageTransforms(viewerImg);
                    return;
                }

                // 2. 如果是未放大状态，且手指纯粹向下滑动 -> 触发 iOS 原生「下拉拖拽退出」手势
                if (deltaY > 10 && Math.abs(deltaY) > Math.abs(deltaX) * 1.3) {
                    e.preventDefault();
                    isDraggingDismiss = true;
                    const pullDistance = Math.max(0, deltaY);
                    const scaleRatio = Math.max(0.68, 1 - (pullDistance / 800));
                    const opacityRatio = Math.max(0.2, 1 - (pullDistance / 400));
                    if (previewOverlay) {
                        previewOverlay.style.transform = `translateY(${pullDistance}px) scale(${scaleRatio})`;
                        previewOverlay.style.opacity = `${opacityRatio}`;
                    }
                }
            }, { passive: false });

            viewerMainArea.addEventListener('touchend', (e) => {
                const now = Date.now();
                const deltaTime = now - touchStartTime;
                const touchEndX = (e.changedTouches && e.changedTouches[0]) ? e.changedTouches[0].clientX : touchStartX;
                const touchEndY = (e.changedTouches && e.changedTouches[0]) ? e.changedTouches[0].clientY : touchStartY;
                const deltaX = touchEndX - touchStartX;
                const deltaY = touchEndY - touchStartY;

                // 1. 处理下拉退出手势的松手弹性
                if (isDraggingDismiss) {
                    isDraggingDismiss = false;
                    if (deltaY > 90) {
                        // 下拉超过阈值，直接退出
                        closePhotosPreview();
                    } else {
                        // 未达到阈值，弹性复原
                        if (previewOverlay) {
                            previewOverlay.style.transition = 'transform 0.24s cubic-bezier(0.2, 0.9, 0.3, 1), opacity 0.24s ease';
                            previewOverlay.style.transform = '';
                            previewOverlay.style.opacity = '';
                            setTimeout(() => {
                                if (previewOverlay) previewOverlay.style.transition = '';
                            }, 240);
                        }
                    }
                    return;
                }

                // 2. 双击检测 (Double Tap to Zoom)
                if (Math.abs(deltaX) < 12 && Math.abs(deltaY) < 12) {
                    if (now - lastTapTime < 300) {
                        // 双击动作：放大 / 恢复
                        if (viewerZoomLevel > 1) {
                            resetViewerZoomAndTransform();
                        } else {
                            viewerZoomLevel = 2.5;
                            viewerPanX = 0;
                            viewerPanY = 0;
                            applyImageTransforms(viewerImg);
                        }
                        lastTapTime = 0;
                        return;
                    }
                    lastTapTime = now;
                }

                // 3. 水平轻扫切图（仅在未放大状态触发）
                if (viewerZoomLevel === 1 && Math.abs(deltaX) > 42 && Math.abs(deltaX) > Math.abs(deltaY) * 1.3 && deltaTime < 500) {
                    if (deltaX < 0) {
                        navigatePreview(1); // 左滑 -> 下一张
                    } else {
                        navigatePreview(-1); // 右滑 -> 上一张
                    }
                }
            }, { passive: true });
        }

        const collectionsMoreBtn = document.getElementById('photosCollectionsMoreBtn');
        const collectionsMenuOverlay = document.getElementById('photosCollectionsMenuOverlay');
        const menuCreateAlbumBtn = document.getElementById('photosMenuCreateAlbumBtn');
        const colMenuLocalImportBtn = document.getElementById('photosColMenuLocalImportBtn');
        const colMenuUrlUploadBtn = document.getElementById('photosColMenuUrlUploadBtn');
        const hiddenFileInput = document.getElementById('photosHiddenFileInput');

        if (collectionsMoreBtn && !collectionsMoreBtn.dataset.bound) {
            collectionsMoreBtn.dataset.bound = '1';
            collectionsMoreBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                if (collectionsMenuOverlay) {
                    collectionsMenuOverlay.classList.add('show');
                }
            });
        }

        if (collectionsMenuOverlay && !collectionsMenuOverlay.dataset.bound) {
            collectionsMenuOverlay.dataset.bound = '1';
            collectionsMenuOverlay.addEventListener('click', (e) => {
                if (e.target === collectionsMenuOverlay) {
                    collectionsMenuOverlay.classList.remove('show');
                }
            });

            if (menuCreateAlbumBtn) {
                menuCreateAlbumBtn.addEventListener('click', (e) => {
                    e.stopPropagation();
                    collectionsMenuOverlay.classList.remove('show');
                    handleCreateNewAlbum();
                });
            }

            if (colMenuLocalImportBtn) {
                colMenuLocalImportBtn.addEventListener('click', (e) => {
                    e.stopPropagation();
                    collectionsMenuOverlay.classList.remove('show');
                    if (hiddenFileInput) hiddenFileInput.click();
                });
            }

            if (colMenuUrlUploadBtn) {
                colMenuUrlUploadBtn.addEventListener('click', (e) => {
                    e.stopPropagation();
                    collectionsMenuOverlay.classList.remove('show');
                    handleUrlBatchImport();
                });
            }
        }

        // 相簿汇总全屏页右上角菜单（新建相簿与编辑相簿）
        const albumsPageMenuOverlay = document.getElementById('photosAlbumsPageMenuOverlay');
        const albumsSubpageMoreBtn = document.getElementById('photosAlbumsSubpageMoreBtn');
        const albumPageCreateBtn = document.getElementById('photosAlbumPageCreateBtn');
        const albumPageEditBtn = document.getElementById('photosAlbumPageEditBtn');
        const albumToggleLayoutBtn = document.getElementById('photosAlbumToggleLayoutBtn');
        const albumLayoutLabel = document.getElementById('photosAlbumLayoutLabel');
        const albumSortDateBtn = document.getElementById('photosAlbumSortDateBtn');
        const albumSortNameBtn = document.getElementById('photosAlbumSortNameBtn');

        function updateAlbumPageMenuState() {
            if (albumLayoutLabel) {
                albumLayoutLabel.textContent = albumLayout === 'grid' ? '单列列表' : '网格排版';
            }
            if (albumSortDateBtn) {
                albumSortDateBtn.classList.toggle('active', albumSortType === 'date');
            }
            if (albumSortNameBtn) {
                albumSortNameBtn.classList.toggle('active', albumSortType === 'name');
            }
        }

        if (albumsSubpageMoreBtn && !albumsSubpageMoreBtn.dataset.bound) {
            albumsSubpageMoreBtn.dataset.bound = '1';
            albumsSubpageMoreBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                if (albumsPageMenuOverlay) {
                    updateAlbumPageMenuState();
                    albumsPageMenuOverlay.classList.add('show');
                }
            });
        }

        if (albumsPageMenuOverlay && !albumsPageMenuOverlay.dataset.bound) {
            albumsPageMenuOverlay.dataset.bound = '1';
            albumsPageMenuOverlay.addEventListener('click', (e) => {
                if (e.target === albumsPageMenuOverlay) {
                    albumsPageMenuOverlay.classList.remove('show');
                }
            });

            if (albumPageCreateBtn) {
                albumPageCreateBtn.addEventListener('click', (e) => {
                    e.stopPropagation();
                    albumsPageMenuOverlay.classList.remove('show');
                    handleCreateNewAlbum();
                });
            }

            if (albumPageEditBtn) {
                albumPageEditBtn.addEventListener('click', (e) => {
                    e.stopPropagation();
                    albumsPageMenuOverlay.classList.remove('show');
                    openAlbumEditSheet();
                });
            }

            if (albumToggleLayoutBtn) {
                albumToggleLayoutBtn.addEventListener('click', (e) => {
                    e.stopPropagation();
                    albumLayout = (albumLayout === 'list') ? 'grid' : 'list';
                    localStorage.setItem(ALBUM_LAYOUT_STORAGE_KEY, albumLayout);
                    updateAlbumPageMenuState();
                    albumsPageMenuOverlay.classList.remove('show');
                    renderAlbumsFullList();
                });
            }

            if (albumSortDateBtn) {
                albumSortDateBtn.addEventListener('click', (e) => {
                    e.stopPropagation();
                    albumSortType = 'date';
                    updateAlbumPageMenuState();
                    albumsPageMenuOverlay.classList.remove('show');
                    renderAlbumsFullList();
                });
            }

            if (albumSortNameBtn) {
                albumSortNameBtn.addEventListener('click', (e) => {
                    e.stopPropagation();
                    albumSortType = 'name';
                    updateAlbumPageMenuState();
                    albumsPageMenuOverlay.classList.remove('show');
                    renderAlbumsFullList();
                });
            }
        }

        // 已创建好的相簿详情页专属菜单逻辑
        const albumDetailMenuOverlay = document.getElementById('photosAlbumDetailMenuOverlay');
        const detailLocalImportBtn = document.getElementById('photosDetailLocalImportBtn');
        const detailUrlImportBtn = document.getElementById('photosDetailUrlImportBtn');
        const detailEditTitleBtn = document.getElementById('photosDetailEditTitleBtn');
        const detailShareInviteBtn = document.getElementById('photosDetailShareInviteBtn');
        const detailEditCoverBtn = document.getElementById('photosDetailEditCoverBtn');
        const detailPinBtn = document.getElementById('photosDetailPinBtn');
        const detailDeleteBtn = document.getElementById('photosDetailDeleteBtn');

        function getCurrentDetailAlbum() {
            if (currentFilterContext.type !== 'album') return null;
            const albums = getStoredAlbums();
            return albums.find(a => a.id === currentFilterContext.id) || null;
        }

        if (albumDetailMenuOverlay && !albumDetailMenuOverlay.dataset.bound) {
            albumDetailMenuOverlay.dataset.bound = '1';
            albumDetailMenuOverlay.addEventListener('click', (e) => {
                if (e.target === albumDetailMenuOverlay) {
                    albumDetailMenuOverlay.classList.remove('show');
                }
            });

            // 相簿内本地导入（直接关联当前相簿）
            if (detailLocalImportBtn) {
                detailLocalImportBtn.addEventListener('click', (e) => {
                    e.stopPropagation();
                    albumDetailMenuOverlay.classList.remove('show');
                    const curAlb = getCurrentDetailAlbum();
                    targetAlbumForImport = curAlb ? curAlb.id : null;
                    if (hiddenFileInput) hiddenFileInput.click();
                });
            }

            // 相簿内 URL 上传（直接关联当前相簿）
            if (detailUrlImportBtn) {
                detailUrlImportBtn.addEventListener('click', (e) => {
                    e.stopPropagation();
                    albumDetailMenuOverlay.classList.remove('show');
                    const curAlb = getCurrentDetailAlbum();
                    handleUrlBatchImport(curAlb ? curAlb.id : null);
                });
            }

            // 好友共享 / 邀请好友
            if (detailShareInviteBtn) {
                detailShareInviteBtn.addEventListener('click', (e) => {
                    e.stopPropagation();
                    albumDetailMenuOverlay.classList.remove('show');
                    const alb = getCurrentDetailAlbum();
                    if (alb) handleCreateNewAlbum(alb);
                });
            }

            // 编辑标题
            if (detailEditTitleBtn) {
                detailEditTitleBtn.addEventListener('click', (e) => {
                    e.stopPropagation();
                    albumDetailMenuOverlay.classList.remove('show');
                    const alb = getCurrentDetailAlbum();
                    if (!alb) return;
                    showPhotosDialog({
                        title: '编辑相簿标题',
                        placeholder: '相簿名称',
                        defaultValue: alb.name,
                        confirmText: '保存',
                        onConfirm: (newName) => {
                            if (!newName || !newName.trim()) return;
                            const albums = getStoredAlbums();
                            const target = albums.find(a => a.id === alb.id);
                            if (target) {
                                target.name = newName.trim();
                                saveStoredAlbums(albums);
                                currentFilterContext.name = target.name;
                                renderPhotosLibrary();
                            }
                        }
                    });
                });
            }

            // 修改封面（打开抽屉）
            if (detailEditCoverBtn) {
                detailEditCoverBtn.addEventListener('click', (e) => {
                    e.stopPropagation();
                    albumDetailMenuOverlay.classList.remove('show');
                    const alb = getCurrentDetailAlbum();
                    if (alb) openCoverPicker(alb);
                });
            }

            // 置顶/取消置顶
            if (detailPinBtn) {
                detailPinBtn.addEventListener('click', (e) => {
                    e.stopPropagation();
                    albumDetailMenuOverlay.classList.remove('show');
                    const alb = getCurrentDetailAlbum();
                    if (!alb) return;
                    const albums = getStoredAlbums();
                    const target = albums.find(a => a.id === alb.id);
                    if (target) {
                        target.pinned = !target.pinned;
                        albums.sort((a, b) => (b.pinned ? 1 : 0) - (a.pinned ? 1 : 0));
                        saveStoredAlbums(albums);
                        renderPhotosLibrary();
                    }
                });
            }

            // 删除相簿
            if (detailDeleteBtn) {
                detailDeleteBtn.addEventListener('click', async (e) => {
                    e.stopPropagation();
                    albumDetailMenuOverlay.classList.remove('show');
                    const alb = getCurrentDetailAlbum();
                    if (!alb) return;
                    const confirmed = await askDangerConfirm('删除相簿', `确定要删除相簿「${alb.name}」吗？相簿内的照片仍会保留在图库。`, '删除相簿');
                    if (!confirmed) return;
                    let albums = getStoredAlbums();
                    albums = albums.filter(a => a.id !== alb.id);
                    saveStoredAlbums(albums);
                    currentFilterContext = { type: 'all' };
                    setPhotosTab('collections');
                });
            }
        }

        if (hiddenFileInput && !hiddenFileInput.dataset.bound) {
            hiddenFileInput.dataset.bound = '1';
            hiddenFileInput.addEventListener('change', (e) => {
                const files = Array.from(e.target.files || []);
                if (!files.length) return;

                if (!Array.isArray(window.photoAlbumItems)) window.photoAlbumItems = [];
                const loadedResults = new Array(files.length);
                let completedCount = 0;
                const batchBaseTime = Date.now();

                files.forEach((file, index) => {
                    const reader = new FileReader();
                    reader.onload = (loadEvt) => {
                        loadedResults[index] = {
                            src: loadEvt.target.result,
                            title: file.name.replace(/\.[^/.]+$/, ''),
                            sourceName: '本地导入',
                            createdAt: new Date(batchBaseTime - index * 50).toISOString()
                        };
                        completedCount++;
                        if (completedCount === files.length) {
                            const validItems = loadedResults.filter(Boolean);
                            window.photoAlbumItems.unshift(...validItems);

                            // 如果是从特定相簿触发的本地导入，注入当前相簿
                            if (targetAlbumForImport) {
                                const albId = targetAlbumForImport;
                                const albums = getStoredAlbums();
                                const target = albums.find(a => a.id === albId);
                                if (target) {
                                    if (!Array.isArray(target.photoSrcs)) target.photoSrcs = [];
                                    validItems.forEach(item => {
                                        if (!target.photoSrcs.includes(item.src)) {
                                            target.photoSrcs.push(item.src);
                                        }
                                    });
                                    saveStoredAlbums(albums);
                                    currentFilterContext = { type: 'album', id: albId, name: target.name };
                                }
                                targetAlbumForImport = null;
                            }

                            markCollectionsDirty();
                            if (typeof window.savePhotoAlbumData === 'function') window.savePhotoAlbumData();
                            renderPhotosApp();
                        }
                    };
                    reader.readAsDataURL(file);
                });
                hiddenFileInput.value = '';
            });
        }

        const modalCancelBtn = document.getElementById('photosModalCancelBtn');
        const descriptionBtn = document.getElementById('photosViewerDescriptionBtn');
        if (descriptionBtn && !descriptionBtn.dataset.bound) {
            descriptionBtn.dataset.bound = '1';
            descriptionBtn.addEventListener('click', () => {
                document.getElementById('photosViewerMenuOverlay')?.classList.remove('show');
                const item = currentFilteredItems[currentPreviewIndex];
                if (!item || currentFilterContext.type === 'trash') return;
                showPhotosDialog({ title: '编辑图片描述', isTextarea: true,
                    desc: '角色会参考描述挑选图片；原有生图提示词会保留',
                    placeholder: '描述图片里的内容', defaultValue: item.description || item.prompt || '', confirmText: '保存',
                    onConfirm: value => {
                        item.description = value.trim().slice(0, 1000);
                        markCollectionsDirty();
                        if (typeof window.savePhotoAlbumData === 'function') window.savePhotoAlbumData();
                        scheduleCoupleAvatarSync();
                        const prompt = document.getElementById('photosViewerPrompt');
                        if (prompt) prompt.textContent = item.description || item.prompt || '无附加描述文本';
                    }
                });
            });
        }
        const modalConfirmBtn = document.getElementById('photosModalConfirmBtn');
        const modalOverlay = document.getElementById('photosAlertModalOverlay');

        if (modalCancelBtn && !modalCancelBtn.dataset.bound) {
            modalCancelBtn.dataset.bound = '1';
            modalCancelBtn.addEventListener('click', closePhotosDialog);
        }

        if (modalConfirmBtn && !modalConfirmBtn.dataset.bound) {
            modalConfirmBtn.dataset.bound = '1';
            modalConfirmBtn.addEventListener('click', () => {
                if (typeof currentModalConfirmHandler === 'function') {
                    currentModalConfirmHandler();
                }
            });
        }

        if (modalOverlay && !modalOverlay.dataset.bound) {
            modalOverlay.dataset.bound = '1';
            modalOverlay.addEventListener('click', (e) => {
                if (e.target === modalOverlay) {
                    closePhotosDialog();
                }
            });
        }

        const albumsSubpageBackBtn = document.getElementById('photosAlbumsSubpageBackBtn');
        const albumsSubpageAddBtn = document.getElementById('photosAlbumsSubpageAddBtn');

        if (albumsSubpageBackBtn && !albumsSubpageBackBtn.dataset.bound) {
            albumsSubpageBackBtn.dataset.bound = '1';
            albumsSubpageBackBtn.addEventListener('click', () => {
                setPhotosTab('collections');
            });
        }

        if (albumsSubpageAddBtn && !albumsSubpageAddBtn.dataset.bound) {
            albumsSubpageAddBtn.dataset.bound = '1';
            albumsSubpageAddBtn.addEventListener('click', () => {
                handleCreateNewAlbum();
            });
        }

        if (topTitleWrap && !topTitleWrap.dataset.bound) {
            topTitleWrap.dataset.bound = '1';
            topTitleWrap.addEventListener('click', () => {
                if (currentFilterContext.type !== 'all') {
                    const prevTab = currentFilterContext.returnTab || 'collections';
                    currentFilterContext = { type: 'all' };
                    isLibraryDirty = true; // 强制打上脏标记，彻底杜绝返回图库时显示暂无照片
                    if (prevTab === 'albums_full') {
                        setPhotosTab('albums_full');
                    } else if (prevTab === 'collections') {
                        setPhotosTab('collections');
                    } else {
                        setPhotosTab('library');
                        renderPhotosLibrary(true);
                    }
                } else {
                    closePhotosApp();
                }
            });
        }

        if (viewerFavBtn && !viewerFavBtn.dataset.bound) {
            viewerFavBtn.dataset.bound = '1';
            viewerFavBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                if (currentPreviewIndex < 0 || !currentFilteredItems[currentPreviewIndex]) return;
                const item = currentFilteredItems[currentPreviewIndex];
                const isFav = toggleFavorite(item);
                viewerFavBtn.innerHTML = isFav ? FAV_FILLED_HEART_SVG : FAV_EMPTY_HEART_SVG;
                renderPhotosApp();
            });
        }

        const viewerMoreBtn = document.getElementById('photosViewerMoreBtn');
        const viewerMenuOverlay = document.getElementById('photosViewerMenuOverlay');
        const viewerDownloadBtn = document.getElementById('photosViewerDownloadBtn');
        const viewerWallpaperBtn = document.getElementById('photosViewerWallpaperBtn');
        const viewerRenameBtn = document.getElementById('photosViewerRenameBtn');

        if (viewerMoreBtn && !viewerMoreBtn.dataset.bound) {
            viewerMoreBtn.dataset.bound = '1';
            viewerMoreBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                if (viewerMenuOverlay) {
                    viewerMenuOverlay.classList.add('show');
                }
            });
        }

        if (viewerMenuOverlay && !viewerMenuOverlay.dataset.bound) {
            viewerMenuOverlay.dataset.bound = '1';
            viewerMenuOverlay.addEventListener('click', (e) => {
                if (e.target === viewerMenuOverlay) {
                    viewerMenuOverlay.classList.remove('show');
                }
            });

            if (viewerDownloadBtn) {
                viewerDownloadBtn.addEventListener('click', (e) => {
                    e.stopPropagation();
                    viewerMenuOverlay.classList.remove('show');
                    handleSaveCurrentPreview();
                });
            }

            if (viewerWallpaperBtn) {
                viewerWallpaperBtn.addEventListener('click', async (e) => {
                    e.stopPropagation();
                    viewerMenuOverlay.classList.remove('show');
                    if (currentPreviewIndex < 0 || !currentFilteredItems[currentPreviewIndex]) return;
                    const item = currentFilteredItems[currentPreviewIndex];
                    if (!item.src) return;
                    try {
                        const source = typeof window.normalizePhotoAlbumImageSource === 'function'
                            ? await window.normalizePhotoAlbumImageSource(item.src)
                            : item.src;
                        if (typeof window.applyWallpaperToDesktop === 'function') {
                            window.applyWallpaperToDesktop(source);
                            if (typeof window.saveWallpaperData === 'function') window.saveWallpaperData();
                        }
                        localStorage.setItem('ios_desktop_wallpaper', source);
                        localStorage.setItem('desktop_wallpaper_url', source);
                        window.dispatchEvent(new CustomEvent('wallpaper-changed', { detail: { src: source } }));
                        alert('已将当前照片设为桌面壁纸！');
                    } catch (err) {
                        alert('设为壁纸失败，请重试。');
                    }
                });
            }

            if (viewerRenameBtn) {
                viewerRenameBtn.addEventListener('click', (e) => {
                    e.stopPropagation();
                    viewerMenuOverlay.classList.remove('show');
                    if (currentPreviewIndex < 0 || !currentFilteredItems[currentPreviewIndex]) return;
                    const item = currentFilteredItems[currentPreviewIndex];
                    showPhotosDialog({
                        title: '重新命名图片',
                        placeholder: '请输入图片名称',
                        defaultValue: item.title || '',
                        confirmText: '保存',
                        onConfirm: (newName) => {
                            if (!newName || !newName.trim()) return;
                            const nextTitle = newName.trim();
                            const storedItem = Array.isArray(window.photoAlbumItems)
                                ? window.photoAlbumItems.find(entry => entry === item || (entry && item && entry.src && entry.src === item.src && entry.createdAt === item.createdAt))
                                : null;
                            (storedItem || item).title = nextTitle;
                            if (typeof window.savePhotoAlbumData === 'function') window.savePhotoAlbumData();
                            const titleEl = document.getElementById('photosViewerTitle');
                            if (titleEl) titleEl.textContent = nextTitle;
                            renderPhotosApp();
                        }
                    });
                });
            }
        }

        const filterOverlay = document.getElementById('photosFilterMenuOverlay');
        const filterDropdown = document.getElementById('photosFilterDropdown');
        const sortAddDateBtn = document.getElementById('photosSortAddDateBtn');
        const sortShootDateBtn = document.getElementById('photosSortShootDateBtn');
        const menuLocalImportBtn = document.getElementById('photosMenuLocalImportBtn');
        const menuUrlUploadBtn = document.getElementById('photosMenuUrlUploadBtn');

        function updateFilterMenuState() {
            if (!filterDropdown) return;
            filterDropdown.querySelectorAll('[data-filter]').forEach(item => {
                const f = item.dataset.filter;
                item.classList.toggle('active', currentFilterContext.type === f);
            });
            if (sortAddDateBtn && sortShootDateBtn) {
                sortAddDateBtn.classList.toggle('active', !isSortAscending);
                sortShootDateBtn.classList.toggle('active', isSortAscending);
            }
        }

        if (refreshBtn && !refreshBtn.dataset.bound) {
            refreshBtn.dataset.bound = '1';
            refreshBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                // 如果当前处于具体相簿内部，点击弹出相簿详情专属菜单
                if (currentFilterContext.type === 'album') {
                    const detailOverlay = document.getElementById('photosAlbumDetailMenuOverlay');
                    const pinLabel = document.getElementById('photosDetailPinLabel');
                    const curAlb = getCurrentDetailAlbum();
                    if (pinLabel && curAlb) {
                        pinLabel.textContent = curAlb.pinned ? '取消置顶' : '置顶相簿';
                    }
                    if (detailOverlay) detailOverlay.classList.add('show');
                    return;
                }
                // 否则弹出图库通用过滤与导入菜单
                if (filterOverlay) {
                    updateFilterMenuState();
                    filterOverlay.classList.add('show');
                }
            });
        }

        if (filterOverlay && !filterOverlay.dataset.bound) {
            filterOverlay.dataset.bound = '1';
            filterOverlay.addEventListener('click', (e) => {
                if (e.target === filterOverlay) {
                    filterOverlay.classList.remove('show');
                }
            });

            filterOverlay.querySelectorAll('[data-filter]').forEach(btn => {
                btn.addEventListener('click', (e) => {
                    e.stopPropagation();
                    const target = btn.dataset.filter;
                    currentFilterContext = { type: target };
                    updateFilterMenuState();
                    filterOverlay.classList.remove('show');
                    renderPhotosLibrary();
                });
            });

            if (sortAddDateBtn) {
                sortAddDateBtn.addEventListener('click', (e) => {
                    e.stopPropagation();
                    isSortAscending = false; // 添加日期（最新在先倒序）
                    updateFilterMenuState();
                    filterOverlay.classList.remove('show');
                    renderPhotosLibrary();
                });
            }

            if (sortShootDateBtn) {
                sortShootDateBtn.addEventListener('click', (e) => {
                    e.stopPropagation();
                    isSortAscending = true; // 拍摄/生成时间正序
                    updateFilterMenuState();
                    filterOverlay.classList.remove('show');
                    renderPhotosLibrary();
                });
            }

            if (menuLocalImportBtn) {
                menuLocalImportBtn.addEventListener('click', (e) => {
                    e.stopPropagation();
                    filterOverlay.classList.remove('show');
                    targetAlbumForImport = null;
                    if (hiddenFileInput) hiddenFileInput.click();
                });
            }

            if (menuUrlUploadBtn) {
                menuUrlUploadBtn.addEventListener('click', (e) => {
                    e.stopPropagation();
                    filterOverlay.classList.remove('show');
                    targetAlbumForImport = null;
                    handleUrlBatchImport(null);
                });
            }
        }

        if (selectBtn && !selectBtn.dataset.bound) {
            selectBtn.dataset.bound = '1';
            selectBtn.addEventListener('click', toggleSelectMode);
        }

        if (selectAllBtn && !selectAllBtn.dataset.bound) {
            selectAllBtn.dataset.bound = '1';
            selectAllBtn.addEventListener('click', handleSelectAll);
        }

        const batchFavBtn = document.getElementById('photosBatchFavBtn');
        if (batchFavBtn && !batchFavBtn.dataset.bound) {
            batchFavBtn.dataset.bound = '1';
            batchFavBtn.addEventListener('click', handleBatchToggleFavorite);
        }

        if (addToAlbumBtn && !addToAlbumBtn.dataset.bound) {
            addToAlbumBtn.dataset.bound = '1';
            addToAlbumBtn.addEventListener('click', () => {
                if (currentFilterContext.type === 'trash') {
                    // 恢复选中项目：从废纸篓移回主图库，并按创建时间重新校准排序
                    const toRestore = Array.from(selectedIndices).map(idx => currentFilteredItems[idx]).filter(Boolean);
                    const restoreSrcs = new Set(toRestore.map(r => r.src));
                    let trash = getStoredTrash();
                    trash = trash.filter(t => !restoreSrcs.has(t.src));
                    saveStoredTrash(trash);

                    if (!Array.isArray(window.photoAlbumItems)) window.photoAlbumItems = [];
                    toRestore.forEach(item => {
                        const copy = { ...item };
                        delete copy.deletedAt;
                        window.photoAlbumItems.push(copy);
                    });

                    // 重新按时间倒序排列主图库
                    window.photoAlbumItems.sort((a, b) => new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime());

                    selectedIndices.clear();
                    toggleSelectMode();
                    renderPhotosApp();
                } else {
                    handleAddSelectedToAlbum();
                }
            });
        }

        if (batchDeleteBtn && !batchDeleteBtn.dataset.bound) {
            batchDeleteBtn.dataset.bound = '1';
            batchDeleteBtn.addEventListener('click', handleBatchDelete);
        }

        if (searchBtn && !searchBtn.dataset.bound) {
            searchBtn.dataset.bound = '1';
            searchBtn.addEventListener('click', () => setPhotosTab('search'));
        }

        if (searchInput && !searchInput.dataset.bound) {
            searchInput.dataset.bound = '1';
            searchInput.addEventListener('input', () => renderPhotosSearchResults());
        }

        document.querySelectorAll('[data-photos-search-filter]').forEach(button => {
            if (button.dataset.bound) return;
            button.dataset.bound = '1';
            button.addEventListener('click', () => {
                const value = button.dataset.photosSearchFilter;
                photosSearchFilter = photosSearchFilter === value ? '' : value;
                renderPhotosSearchResults();
            });
        });

        if (searchMoreBtn && !searchMoreBtn.dataset.bound) {
            searchMoreBtn.dataset.bound = '1';
            searchMoreBtn.addEventListener('click', appendPhotosSearchTiles);
        }

        if (viewerBackBtn && !viewerBackBtn.dataset.bound) {
            viewerBackBtn.dataset.bound = '1';
            viewerBackBtn.addEventListener('click', closePhotosPreview);
        }

        // 调节（Tune）与轻量编辑逻辑实装
        const viewerTuneBtn = document.getElementById('photosViewerTuneBtn');
        const tuneDrawer = document.getElementById('photosTuneDrawer');
        const tuneResetBtn = document.getElementById('photosTuneResetBtn');
        const tuneSaveBtn = document.getElementById('photosTuneSaveBtn');
        const tuneRotateBtn = document.getElementById('photosTuneRotateBtn');
        const tuneFlipBtn = document.getElementById('photosTuneFlipBtn');
        const tuneFiltersTrack = document.getElementById('photosTuneFiltersTrack');
        const copyPromptBtn = document.getElementById('photosCopyPromptBtn');

        if (viewerTuneBtn && !viewerTuneBtn.dataset.bound) {
            viewerTuneBtn.dataset.bound = '1';
            viewerTuneBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                if (tuneDrawer) {
                    tuneDrawer.classList.toggle('show');
                }
            });
        }

        if (tuneRotateBtn && !tuneRotateBtn.dataset.bound) {
            tuneRotateBtn.dataset.bound = '1';
            tuneRotateBtn.addEventListener('click', () => {
                currentEditState.rotation = (currentEditState.rotation + 90) % 360;
                const img = document.getElementById('photosViewerMainImg');
                applyImageTransforms(img);
            });
        }

        if (tuneFlipBtn && !tuneFlipBtn.dataset.bound) {
            tuneFlipBtn.dataset.bound = '1';
            tuneFlipBtn.addEventListener('click', () => {
                currentEditState.flipH = !currentEditState.flipH;
                const img = document.getElementById('photosViewerMainImg');
                applyImageTransforms(img);
            });
        }

        if (tuneFiltersTrack && !tuneFiltersTrack.dataset.bound) {
            tuneFiltersTrack.dataset.bound = '1';
            tuneFiltersTrack.querySelectorAll('.photos-tune-filter-item').forEach(item => {
                item.addEventListener('click', () => {
                    tuneFiltersTrack.querySelectorAll('.photos-tune-filter-item').forEach(i => i.classList.remove('active'));
                    item.classList.add('active');
                    currentEditState.filter = item.dataset.filter || 'none';
                    const img = document.getElementById('photosViewerMainImg');
                    applyImageTransforms(img);
                });
            });
        }

        if (tuneResetBtn && !tuneResetBtn.dataset.bound) {
            tuneResetBtn.dataset.bound = '1';
            tuneResetBtn.addEventListener('click', () => {
                currentEditState = { rotation: 0, flipH: false, filter: 'none' };
                if (tuneFiltersTrack) {
                    tuneFiltersTrack.querySelectorAll('.photos-tune-filter-item').forEach(i => {
                        i.classList.toggle('active', i.dataset.filter === 'none');
                    });
                }
                const img = document.getElementById('photosViewerMainImg');
                applyImageTransforms(img);
            });
        }

        if (tuneSaveBtn && !tuneSaveBtn.dataset.bound) {
            tuneSaveBtn.dataset.bound = '1';
            tuneSaveBtn.addEventListener('click', () => {
                // 使用 Canvas 将当前旋转、镜像和滤镜效果固化为新数据
                if (currentPreviewIndex >= 0 && currentFilteredItems[currentPreviewIndex]) {
                    const item = currentFilteredItems[currentPreviewIndex];
                    const img = document.getElementById('photosViewerMainImg');
                    if (img && img.naturalWidth) {
                        try {
                            const canvas = document.createElement('canvas');
                            const isRotated90 = (currentEditState.rotation % 180 !== 0);
                            canvas.width = isRotated90 ? img.naturalHeight : img.naturalWidth;
                            canvas.height = isRotated90 ? img.naturalWidth : img.naturalHeight;
                            const ctx = canvas.getContext('2d');
                            
                            // 滤镜处理
                            const filterMap = {
                                vivid: 'saturate(1.4) contrast(1.1)',
                                warm: 'sepia(0.3) saturate(1.2)',
                                cool: 'hue-rotate(180deg) saturate(1.1)',
                                mono: 'grayscale(1) contrast(1.15)',
                                vintage: 'sepia(0.55) contrast(0.95)',
                                dramatic: 'contrast(1.45) saturate(1.2)'
                            };
                            if (currentEditState.filter !== 'none' && filterMap[currentEditState.filter]) {
                                ctx.filter = filterMap[currentEditState.filter];
                            }

                            ctx.translate(canvas.width / 2, canvas.height / 2);
                            if (currentEditState.rotation) {
                                ctx.rotate((currentEditState.rotation * Math.PI) / 180);
                            }
                            if (currentEditState.flipH) {
                                ctx.scale(-1, 1);
                            }
                            ctx.drawImage(img, -img.naturalWidth / 2, -img.naturalHeight / 2);

                            const newSrc = canvas.toDataURL('image/png');
                            item.src = newSrc;
                            img.src = newSrc;
                            currentEditState = { rotation: 0, flipH: false, filter: 'none' };
                            applyImageTransforms(img);
                            renderPhotosApp();
                        } catch (e) {}
                    }
                }
                if (tuneDrawer) tuneDrawer.classList.remove('show');
            });
        }

        // 复制提示词快捷按钮
        if (copyPromptBtn && !copyPromptBtn.dataset.bound) {
            copyPromptBtn.dataset.bound = '1';
            copyPromptBtn.addEventListener('click', async () => {
                if (currentPreviewIndex < 0 || !currentFilteredItems[currentPreviewIndex]) return;
                const item = currentFilteredItems[currentPreviewIndex];
                if (!item.description && !item.prompt) return;
                try {
                    await navigator.clipboard.writeText(item.description || item.prompt);
                    copyPromptBtn.textContent = '已复制 ✓';
                    setTimeout(() => {
                        copyPromptBtn.textContent = '复制提示词';
                    }, 1800);
                } catch (e) {
                    alert('复制失败，请手动长按复制');
                }
            });
        }

        // 全屏大图左下角【分享】按键实装：呼出 iOS 隔空投送纯白抽屉
        if (viewerShareBtn && !viewerShareBtn.dataset.bound) {
            viewerShareBtn.dataset.bound = '1';
            viewerShareBtn.addEventListener('click', () => {
                openShareSheet();
            });
        }

        const shareSheetOverlay = document.getElementById('photosShareSheetOverlay');
        const shareCloseBtn = document.getElementById('photosShareCloseBtn');
        const shareSendBtn = document.getElementById('photosShareSendBtn');

        if (shareCloseBtn && !shareCloseBtn.dataset.bound) {
            shareCloseBtn.dataset.bound = '1';
            shareCloseBtn.addEventListener('click', closeShareSheet);
        }

        if (shareSheetOverlay && !shareSheetOverlay.dataset.bound) {
            shareSheetOverlay.dataset.bound = '1';
            shareSheetOverlay.addEventListener('click', (e) => {
                if (e.target === shareSheetOverlay) closeShareSheet();
            });
        }

        if (shareSendBtn && !shareSendBtn.dataset.bound) {
            shareSendBtn.dataset.bound = '1';
            shareSendBtn.addEventListener('click', () => {
                if (selectedAirdropContact) {
                    airdropToContact(selectedAirdropContact);
                }
            });
        }

        if (viewerDeleteBtn && !viewerDeleteBtn.dataset.bound) {
            viewerDeleteBtn.dataset.bound = '1';
            viewerDeleteBtn.addEventListener('click', handleDeleteCurrentPreview);
        }

        if (viewerInfoToggleBtn && !viewerInfoToggleBtn.dataset.bound) {
            viewerInfoToggleBtn.dataset.bound = '1';
            viewerInfoToggleBtn.addEventListener('click', () => {
                if (viewerInfoPanel) viewerInfoPanel.classList.toggle('show');
            });
        }

        tabButtons.forEach(button => {
            if (button.dataset.bound) return;
            button.dataset.bound = '1';
            button.addEventListener('click', () => {
                if (button.dataset.photosTab === 'library') {
                    currentFilterContext = { type: 'all' };
                    isLibraryDirty = true;
                }
                setPhotosTab(button.dataset.photosTab);
            });
        });

        // 编辑相簿抽屉操作绑定（由右上角菜单“编辑相簿”呼出）
        const albumSheetCancelBtn = document.getElementById('photosAlbumSheetCancelBtn');
        const albumSheetDoneBtn = document.getElementById('photosAlbumSheetDoneBtn');
        const albumSheetOverlay = document.getElementById('photosAlbumSheetOverlay');
        const albumSheetPinBtn = document.getElementById('photosAlbumSheetPinBtn');
        const albumSheetDeleteBtn = document.getElementById('photosAlbumSheetDeleteBtn');

        if (albumSheetCancelBtn && !albumSheetCancelBtn.dataset.bound) {
            albumSheetCancelBtn.dataset.bound = '1';
            albumSheetCancelBtn.addEventListener('click', closeAlbumEditSheet);
        }

        if (albumSheetDoneBtn && !albumSheetDoneBtn.dataset.bound) {
            albumSheetDoneBtn.dataset.bound = '1';
            albumSheetDoneBtn.addEventListener('click', () => {
                closeAlbumEditSheet();
                renderPhotosApp();
            });
        }

        if (albumSheetOverlay && !albumSheetOverlay.dataset.bound) {
            albumSheetOverlay.dataset.bound = '1';
            albumSheetOverlay.addEventListener('click', (e) => {
                if (e.target === albumSheetOverlay) closeAlbumEditSheet();
            });
        }

        if (albumSheetPinBtn && !albumSheetPinBtn.dataset.bound) {
            albumSheetPinBtn.dataset.bound = '1';
            albumSheetPinBtn.addEventListener('click', () => {
                if (!selectedAlbumIds.size) return;
                let albums = getStoredAlbums();
                const selectedAlbums = albums.filter(a => selectedAlbumIds.has(a.id));
                const allPinned = selectedAlbums.every(a => a.pinned);

                albums.forEach(a => {
                    if (selectedAlbumIds.has(a.id)) {
                        a.pinned = !allPinned;
                    }
                });

                saveStoredAlbums(albums);
                renderAlbumEditSheetGrid();
                renderPhotosApp();
            });
        }

        if (albumSheetDeleteBtn && !albumSheetDeleteBtn.dataset.bound) {
            albumSheetDeleteBtn.dataset.bound = '1';
            albumSheetDeleteBtn.addEventListener('click', async () => {
                const count = selectedAlbumIds.size;
                if (!count) return;
                const confirmDel = await askDangerConfirm('删除相簿', `确定要删除选中的 ${count} 个相簿吗？相簿内的照片仍会保留在图库。`, '删除');
                if (!confirmDel) return;

                let albums = getStoredAlbums();
                albums = albums.filter(a => !selectedAlbumIds.has(a.id));
                saveStoredAlbums(albums);

                selectedAlbumIds.clear();
                renderAlbumEditSheetGrid();
                renderPhotosApp();
            });
        }

        // 顶部悬浮胶囊交互：个人与共享切换（带滑块平移动画）
        const scopePersonalBtn = document.getElementById('photosScopePersonalBtn');
        const scopeSharedBtn = document.getElementById('photosScopeSharedBtn');
        const scopeCapsule = document.getElementById('photosScopeCapsule');

        if (scopePersonalBtn && !scopePersonalBtn.dataset.bound) {
            scopePersonalBtn.dataset.bound = '1';
            scopePersonalBtn.addEventListener('click', () => {
                albumScopeType = 'personal';
                scopePersonalBtn.classList.add('active');
                if (scopeSharedBtn) scopeSharedBtn.classList.remove('active');
                if (scopeCapsule) scopeCapsule.setAttribute('data-scope', 'personal');
                renderAlbumsFullList();
            });
        }

        if (scopeSharedBtn && !scopeSharedBtn.dataset.bound) {
            scopeSharedBtn.dataset.bound = '1';
            scopeSharedBtn.addEventListener('click', () => {
                albumScopeType = 'shared';
                scopeSharedBtn.classList.add('active');
                if (scopePersonalBtn) scopePersonalBtn.classList.remove('active');
                if (scopeCapsule) scopeCapsule.setAttribute('data-scope', 'shared');
                renderAlbumsFullList();
            });
        }

        // 新建共享相簿抽屉操作绑定
        // 自定义与重新排序抽屉绑定
        const reorderCloseBtn = document.getElementById('photosReorderCloseBtn');
        const reorderResetBtn = document.getElementById('photosReorderResetBtn');
        const reorderOverlay = document.getElementById('photosReorderDrawerOverlay');

        if (reorderCloseBtn && !reorderCloseBtn.dataset.bound) {
            reorderCloseBtn.dataset.bound = '1';
            reorderCloseBtn.addEventListener('click', closeReorderDrawer);
        }

        if (reorderResetBtn && !reorderResetBtn.dataset.bound) {
            reorderResetBtn.dataset.bound = '1';
            reorderResetBtn.addEventListener('click', () => {
                resetStoredCuratedSectionsConfig();
                renderReorderList();
                renderCollections();
                if (typeof window.showToast === 'function') window.showToast('已还原默认显示');
            });
        }

        if (reorderOverlay && !reorderOverlay.dataset.bound) {
            reorderOverlay.dataset.bound = '1';
            reorderOverlay.addEventListener('click', (e) => {
                if (e.target === reorderOverlay) closeReorderDrawer();
            });
        }

        const createAlbumCancelBtn = document.getElementById('photosCreateAlbumCancelBtn');
        const createAlbumSaveBtn = document.getElementById('photosCreateAlbumSaveBtn');
        const createAddPhotoBtn = document.getElementById('photosCreateAddPhotoBtn');

        if (createAlbumCancelBtn && !createAlbumCancelBtn.dataset.bound) {
            createAlbumCancelBtn.dataset.bound = '1';
            createAlbumCancelBtn.addEventListener('click', closeCreateAlbumDrawer);
        }

        if (createAlbumSaveBtn && !createAlbumSaveBtn.dataset.bound) {
            createAlbumSaveBtn.dataset.bound = '1';
            createAlbumSaveBtn.addEventListener('click', saveCreateAlbumDrawer);
        }

        if (createAddPhotoBtn && !createAddPhotoBtn.dataset.bound) {
            createAddPhotoBtn.dataset.bound = '1';
            createAddPhotoBtn.addEventListener('click', () => {
                const allPhotos = getPhotoAlbumItems();
                if (!allPhotos.length) {
                    alert('当前图库暂无照片，请先导入照片');
                    return;
                }
                openCoverPicker({
                    photoSrcs: allPhotos.map(p => p.src),
                    customCover: tempCreateAlbumCover,
                    id: 'temp_create'
                });
            });
        }

        // 封面选择抽屉关闭按钮
        const coverPickerCloseBtn = document.getElementById('photosCoverPickerCloseBtn');
        const coverPickerOverlay = document.getElementById('photosCoverPickerOverlay');
        if (coverPickerCloseBtn && !coverPickerCloseBtn.dataset.bound) {
            coverPickerCloseBtn.dataset.bound = '1';
            coverPickerCloseBtn.addEventListener('click', closeCoverPicker);
        }
        if (coverPickerOverlay && !coverPickerOverlay.dataset.bound) {
            coverPickerOverlay.dataset.bound = '1';
            coverPickerOverlay.addEventListener('click', (e) => {
                if (e.target === coverPickerOverlay) closeCoverPicker();
            });
        }
    }

    /* 自定义与重新排序抽屉控制器 (对标用户截图框架与排版，纯白浅色模式) */
    function openReorderDrawer() {
        renderReorderList();
        const overlay = document.getElementById('photosReorderDrawerOverlay');
        if (overlay) overlay.classList.add('show');
    }

    function closeReorderDrawer() {
        const overlay = document.getElementById('photosReorderDrawerOverlay');
        if (overlay) overlay.classList.remove('show');
    }

    function renderReorderList() {
        const list = document.getElementById('photosReorderList');
        if (!list) return;

        const config = getStoredCuratedSectionsConfig();

        const sectionMeta = {
            pinned: { title: '固定精选集' },
            albums: { title: '相簿' },
            sharedAlbums: { title: '共享相簿' },
            moreSections: { title: '更多项目' }
        };

        const currentOrder = Array.isArray(config.order) ? config.order : DEFAULT_CURATED_ORDER;

        list.innerHTML = '';
        currentOrder.forEach(key => {
            const meta = sectionMeta[key];
            if (!meta) return;

            const isChecked = config[key] !== false;
            const row = document.createElement('div');
            row.className = 'photos-reorder-item-row' + (isChecked ? ' checked' : '');
            row.dataset.sectionKey = key;

            row.innerHTML = `
                <div class="photos-reorder-check-slot">
                    <div class="photos-reorder-checkbox">
                        <svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="#ffffff" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
                    </div>
                </div>
                <div class="photos-reorder-item-title">${meta.title}</div>
                <div class="photos-reorder-handle" title="按住拖动排序">
                    <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="#8e8e93" stroke-width="2.4" stroke-linecap="round"><line x1="3" y1="7" x2="21" y2="7"></line><line x1="3" y1="12" x2="21" y2="12"></line><line x1="3" y1="17" x2="21" y2="17"></line></svg>
                </div>
            `;

            const checkSlot = row.querySelector('.photos-reorder-check-slot');
            const titleEl = row.querySelector('.photos-reorder-item-title');
            const toggleHandler = (e) => {
                e.stopPropagation();
                config[key] = !isChecked;
                saveStoredCuratedSectionsConfig(config);
                renderReorderList();
                renderCollections();
            };
            if (checkSlot) checkSlot.addEventListener('click', toggleHandler);
            if (titleEl) titleEl.addEventListener('click', toggleHandler);

            // 注入右侧三横把手防重复拖拽重排逻辑
            const handle = row.querySelector('.photos-reorder-handle');
            if (handle) {
                let isDragging = false;
                let startY = 0;

                const getClientY = (e) => {
                    if (e.touches && e.touches[0]) return e.touches[0].clientY;
                    return e.clientY || 0;
                };

                const onMove = (moveEvt) => {
                    if (!isDragging) return;
                    if (moveEvt.cancelable) moveEvt.preventDefault();
                    const clientY = getClientY(moveEvt);

                    // 获取当前列表所有真实行（不含幽灵）
                    const rows = Array.from(list.querySelectorAll('.photos-reorder-item-row'));
                    for (const target of rows) {
                        if (target === row) continue;
                        const rect = target.getBoundingClientRect();
                        const midY = rect.top + rect.height / 2;
                        if (clientY >= rect.top && clientY <= rect.bottom) {
                            if (clientY < midY) {
                                list.insertBefore(row, target);
                            } else {
                                list.insertBefore(row, target.nextSibling);
                            }
                            if (navigator.vibrate) navigator.vibrate(10);
                            break;
                        }
                    }
                };

                const onEnd = () => {
                    if (!isDragging) return;
                    isDragging = false;
                    row.classList.remove('is-dragging');
                    row.style.opacity = '1';

                    window.removeEventListener('touchmove', onMove);
                    window.removeEventListener('touchend', onEnd);
                    window.removeEventListener('touchcancel', onEnd);
                    window.removeEventListener('mousemove', onMove);
                    window.removeEventListener('mouseup', onEnd);

                    // 严谨去重提取最新顺序
                    const newOrder = [];
                    list.querySelectorAll('.photos-reorder-item-row').forEach(r => {
                        const key = r.dataset.sectionKey;
                        if (key && DEFAULT_CURATED_ORDER.includes(key) && !newOrder.includes(key)) {
                            newOrder.push(key);
                        }
                    });
                    DEFAULT_CURATED_ORDER.forEach(k => {
                        if (!newOrder.includes(k)) newOrder.push(k);
                    });

                    config.order = newOrder;
                    saveStoredCuratedSectionsConfig(config);
                    renderCollections();
                };

                const onStart = (downEvt) => {
                    if (isDragging) return;
                    isDragging = true;
                    startY = getClientY(downEvt);

                    row.classList.add('is-dragging');
                    row.style.opacity = '0.5';
                    if (navigator.vibrate) navigator.vibrate(20);

                    window.addEventListener('touchmove', onMove, { passive: false });
                    window.addEventListener('touchend', onEnd);
                    window.addEventListener('touchcancel', onEnd);
                    window.addEventListener('mousemove', onMove);
                    window.addEventListener('mouseup', onEnd);
                };

                // 优先只绑定 touchstart（触摸屏），非触摸则降级支持 mousedown，绝不混用导致重复初始化
                if ('ontouchstart' in window) {
                    handle.addEventListener('touchstart', onStart, { passive: false });
                } else {
                    handle.addEventListener('mousedown', onStart);
                }
            }

            list.appendChild(row);
        });
    }

    /* 打开选择封面底部抽屉 (一行 4 张) */
    function openCoverPicker(album) {
        const overlay = document.getElementById('photosCoverPickerOverlay');
        const grid = document.getElementById('photosCoverGrid');
        if (!overlay || !grid) return;

        const photoSrcs = Array.isArray(album.photoSrcs) ? album.photoSrcs : [];
        grid.innerHTML = '';

        if (!photoSrcs.length) {
            grid.innerHTML = `<div class="photos-drawer-empty">相簿中暂无照片，请先添加照片后再选择封面</div>`;
        } else {
            photoSrcs.forEach(src => {
                const cell = document.createElement('div');
                cell.className = 'photos-cover-cell' + (album.customCover === src ? ' active' : '');
                cell.innerHTML = `<img src="${src}" alt="封面选项">`;
                cell.addEventListener('click', () => {
                    if (album.id === 'temp_create') {
                        tempCreateAlbumCover = src;
                        const coverBox = document.getElementById('photosCreateCoverPreview');
                        if (coverBox) {
                            coverBox.innerHTML = `<img src="${src}" alt="封面">`;
                        }
                    } else {
                        const albums = getStoredAlbums();
                        const target = albums.find(a => a.id === album.id);
                        if (target) {
                            target.customCover = src;
                            saveStoredAlbums(albums);
                            renderAlbumsFullList();
                            renderCollections();
                        }
                    }
                    closeCoverPicker();
                });
                grid.appendChild(cell);
            });
        }

        overlay.classList.add('show');
    }

    function closeCoverPicker() {
        const overlay = document.getElementById('photosCoverPickerOverlay');
        if (overlay) overlay.classList.remove('show');
    }

    let selectedAirdropContact = null;
    let cachedShareContacts = null;
    let cachedShareContactsAccountId = '';

    /* 辅助方法：多维度查找微信联系人，兼容带 char_ 与不带前缀的 ID */
    function matchContactFromList(contacts, rawTargetId) {
        if (!contacts || !contacts.length || !rawTargetId) return null;
        const strId = String(rawTargetId);
        const cleanId = strId.replace(/^char_/, '');
        for (let i = 0; i < contacts.length; i++) {
            const c = contacts[i];
            if (!c) continue;
            const cid = String(c.id || '');
            const clink = String(c.linkedContactId || '');
            if (cid === strId || cid === cleanId || cid === ('char_' + cleanId)) return c;
            if (clink && (clink === strId || clink === cleanId)) return c;
        }
        return null;
    }

    /* 毫秒级同步快速获取联系人（供相簿与精选集瞬间渲染，杜绝任何页面卡死或白屏） */
    function getShareContactsSync() {
        const accountId = currentCoupleAccountId();
        if (cachedShareContactsAccountId !== accountId) {
            cachedShareContacts = null;
            cachedShareContactsAccountId = accountId;
        }
        if (cachedShareContacts && cachedShareContacts.length) {
            return cachedShareContacts;
        }

        const pool = [];
        if (typeof wcContactsList !== 'undefined' && Array.isArray(wcContactsList) && wcContactsList.length > 0) {
            wcContactsList.forEach(c => {
                if (c && c.id) pool.push(c);
            });
        }

        try {
            const rawStored = localStorage.getItem('chatContactsList') || localStorage.getItem('wechat_contacts_v1');
            if (rawStored) {
                const parsed = JSON.parse(rawStored);
                if (Array.isArray(parsed)) {
                    parsed.forEach(c => {
                        if (c && c.id && !pool.some(p => p.id === c.id)) pool.push(c);
                    });
                }
            }
        } catch (e) {}

        if (pool.length > 0) {
            cachedShareContacts = pool;
        }
        return pool;
    }

    /* 异步补全联系人（优先直读童话集 IndexedDB 中的 wechatContactsData） */
    async function getShareContactsAsync(forceRefresh = false) {
        getShareContactsSync();
        if (!forceRefresh && cachedShareContacts && cachedShareContacts.length) {
            return cachedShareContacts;
        }

        const pool = getShareContactsSync().slice();

        // 1. 优先直接从童话集 IndexedDB 读取最新微信好友与头像
        if (window.db) {
            try {
                await new Promise((resolve) => {
                    const tx = window.db.transaction(["layoutStore"], "readonly");
                    const store = tx.objectStore("layoutStore");
                    const req = store.get(`wechatContactsData_${currentCoupleAccountId()}`);
                    req.onsuccess = (e) => {
                        const rec = e.target.result;
                        const contacts = (rec && Array.isArray(rec.contacts)) ? rec.contacts : [];
                        contacts.forEach(c => {
                            if (c && c.id && !pool.some(p => p.id === c.id || p.id === ('char_' + c.id))) {
                                pool.push({
                                    id: c.id,
                                    linkedContactId: c.id,
                                    name: c.name || '好友',
                                    remark: c.remark || c.name || '',
                                    avatar: c.avatar || ''
                                });
                            }
                        });
                        resolve();
                    };
                    req.onerror = () => resolve();
                });
            } catch (e) {}
        }

        // 2. 尝试从通讯录应用数据表补全
        if (!pool.length && typeof window.wcReadLayoutRecord === 'function') {
            try {
                const rec = await window.wcReadLayoutRecord('contactsAppData');
                const contacts = Array.isArray(rec?.data?.contacts) ? rec.data.contacts : [];
                contacts.forEach(c => {
                    if (c && c.id) {
                        const formatted = {
                            id: 'char_' + c.id,
                            linkedContactId: c.id,
                            name: c.name || '好友',
                            remark: c.name || '',
                            avatar: c.avatar || ''
                        };
                        if (!pool.some(p => p.id === formatted.id || p.id === c.id)) {
                            pool.push(formatted);
                        }
                    }
                });
            } catch (e) {}
        }

        // 3. 兜底兼容微信全局刷新方法
        if (!pool.length && typeof window.wcReloadContactsFromStorage === 'function') {
            try {
                await window.wcReloadContactsFromStorage();
                if (Array.isArray(window.wcContactsList)) {
                    window.wcContactsList.forEach(c => {
                        if (c && c.id && !pool.some(p => p.id === c.id)) pool.push(c);
                    });
                }
            } catch (e) {}
        }

        cachedShareContacts = pool;
        return pool;
    }

    /* 静默预热微信好友列表，拿回数据后自动更新相簿上的头像微标 */
    function ensureContactsPreloaded() {
        if (cachedShareContacts && cachedShareContacts.length) return;
        getShareContactsAsync().then((contacts) => {
            if (contacts && contacts.length) {
                markCollectionsDirty();
                if (activePhotosTab === 'albums_full') {
                    renderAlbumsFullList();
                } else if (activePhotosTab === 'collections') {
                    renderCollections(true);
                }
            }
        }).catch(() => {});
    }

    /* 打开纯白 iOS 分享抽屉 */
    async function openShareSheet() {
        if (currentPreviewIndex < 0 || !currentFilteredItems[currentPreviewIndex]) return;
        const item = currentFilteredItems[currentPreviewIndex];

        const overlay = document.getElementById('photosShareSheetOverlay');
        const centerImg = document.getElementById('photosShareCenterImg');
        const countText = document.getElementById('photosShareCountText');
        const contactsRow = document.getElementById('photosAirdropContactsRow');
        const sendBtn = document.getElementById('photosShareSendBtn');
        if (!overlay || !centerImg) return;

        if (countText) countText.textContent = '隔空投送';
        centerImg.src = item.src || '';
        selectedAirdropContact = null;
        if (sendBtn) {
            sendBtn.disabled = true;
            sendBtn.innerHTML = `<span>Send</span><svg viewBox="0 0 1024 1024" width="18" height="18" fill="currentColor"><path d="M971.340829 41.145783c-17.49973-9.000156-34.999461-9.000156-43.999617 0L50.852947 476.641875c-17.49973 0-26.499887 17.49973-26.499887 34.999461s8.499574 34.999461 17.499731 34.99946l210.497346 130.497105c17.49973 8.499574 34.999461 8.499574 52.499191-9.000156l464.994311-417.996362 17.49973 8.499575-420.994693 443.995665c-8.499574 8.499574-8.499574 17.49973-8.499574 25.999305v191.49587c0 17.49973 9.000156 34.999461 26.499886 43.499035 17.49973 9.000156 34.999461 0 43.999617-8.499574l104.998383-104.497801 210.497346 139.497261c9.000156 8.499574 17.49973 8.499574 26.499887 8.499575h17.49973c17.49973-8.499574 26.499887-17.49973 26.499887-34.999461l175.497886-870.987023c-1.001164-25.498722-1.001164-42.998453-18.500895-51.498027z"></path></svg>`;
        }

        // 渲染微信好友隔空投送头像列表
        if (contactsRow) {
            contactsRow.innerHTML = `<div style="padding: 14px 10px; font-size: 13px; color: #8e8e93;">正在获取好友...</div>`;
            const contacts = await getShareContactsAsync();

            if (!contacts.length) {
                contactsRow.innerHTML = `<div style="padding: 12px 10px; font-size: 13px; color: #8e8e93;">当前登录微信账号暂无联系人</div>`;
            } else {
                contactsRow.innerHTML = '';
                contacts.forEach((c) => {
                    const displayName = c.remark || c.name || '好友';
                    const col = document.createElement('div');
                    col.className = 'photos-airdrop-contact-item';
                    
                    const avatarWrap = document.createElement('div');
                    avatarWrap.className = 'photos-airdrop-avatar-wrap';

                    if (c.avatar) {
                        avatarWrap.innerHTML = `<img src="${c.avatar}" alt="${displayName}">`;
                    } else {
                        avatarWrap.innerHTML = `<div style="width:100%;height:100%;border-radius:50%;background:#e5e5ea;display:flex;align-items:center;justify-content:center;font-size:20px;color:#8e8e93;font-weight:700;">${displayName.slice(0, 1)}</div>`;
                    }

                    const nameEl = document.createElement('span');
                    nameEl.className = 'photos-airdrop-contact-name';
                    nameEl.textContent = displayName;

                    col.append(avatarWrap, nameEl);

                    // 单选好友交互
                    col.addEventListener('click', (e) => {
                        e.stopPropagation();
                        contactsRow.querySelectorAll('.photos-airdrop-contact-item').forEach(it => it.classList.remove('selected'));
                        col.classList.add('selected');
                        selectedAirdropContact = c;
                        if (sendBtn) sendBtn.disabled = false;
                    });

                    contactsRow.appendChild(col);
                });
            }
        }

        overlay.classList.add('show');
    }

    function closeShareSheet() {
        const overlay = document.getElementById('photosShareSheetOverlay');
        if (overlay) overlay.classList.remove('show');
        selectedAirdropContact = null;
    }

    /* 隔空投送至选中的特定好友（彻底修复聊天记录空白问题与反馈提示） */
    async function airdropToContact(contact) {
        if (!contact || currentPreviewIndex < 0 || !currentFilteredItems[currentPreviewIndex]) return;
        const sendBtn = document.getElementById('photosShareSendBtn');
        if (sendBtn) {
            sendBtn.disabled = true;
            sendBtn.innerHTML = `<span>发送中...</span>`;
        }

        const item = currentFilteredItems[currentPreviewIndex];
        const contactName = contact.remark || contact.name || '对方';
        
        // 震动反馈
        if (navigator.vibrate) navigator.vibrate([40, 60, 40]);

        // 立即关闭分享抽屉，防止用户因界面未动而重复点击
        closeShareSheet();

        try {
            // 格式化隔空投送消息文本：[隔空投送] 图片地址|图片标题|创建时间
            const airdropPayload = `[隔空投送] ${item.src}|${item.title || '照片'}|${item.createdAt || new Date().toISOString()}`;

            // 关键核心：绝对不能直接覆盖或清空已有的聊天数据，安全加载全量历史记录
            const currentAccountId = (typeof window.wcGetCurrentAccountId === 'function') 
                ? window.wcGetCurrentAccountId() 
                : (typeof appSettings !== 'undefined' ? (appSettings.wc_current_user_id || appSettings.wc_current_user_phone || '') : '');

            // 1. 如果内存结构未初始化，或者当前会话无记录，先尝试从 IndexedDB 安全还原全量聊天历史
            if (typeof window.wcChatMessagesByContact === 'undefined' || Object.keys(window.wcChatMessagesByContact).length === 0) {
                window.wcChatMessagesByContact = window.wcChatMessagesByContact || {};
                if (typeof window.wcReadLayoutRecord === 'function') {
                    try {
                        const recordKey = currentAccountId ? `wechatChatData_${currentAccountId}` : 'wechatChatData';
                        const stored = await window.wcReadLayoutRecord(recordKey);
                        if (stored) {
                            const rawData = stored.data || stored.messages || stored;
                            if (rawData && typeof rawData === 'object' && !Array.isArray(rawData)) {
                                Object.keys(rawData).forEach(k => {
                                    if (Array.isArray(rawData[k])) {
                                        window.wcChatMessagesByContact[k] = rawData[k];
                                    }
                                });
                            }
                        }
                    } catch (e) {
                        console.warn('[隔空投送] 读取微信历史记录失败:', e);
                    }
                }
            }

            // 2. 确保目标联系人的消息列表存在，如果原本就有记录则直接追加，严禁清空！
            if (!Array.isArray(window.wcChatMessagesByContact[contact.id])) {
                window.wcChatMessagesByContact[contact.id] = [];
            }

            // 3. 安全追加消息，优先使用微信官方方法
            if (typeof window.wcAppendChatMessage === 'function') {
                window.wcAppendChatMessage(airdropPayload, 'sent', contact.id, null, null, false);
            } else {
                window.wcChatMessagesByContact[contact.id].push({
                    id: 'msg_airdrop_' + Date.now(),
                    type: 'sent',
                    text: airdropPayload,
                    createdAt: Date.now()
                });
                if (typeof window.wcSaveChatData === 'function') {
                    window.wcSaveChatData();
                }
            }

            // 4. 明确的发送成功提示（留在相册界面，绝不提前跳出）
            if (typeof window.showToast === 'function') {
                window.showToast(`已成功隔空投送至「${contactName}」`);
            }

            // 严格等待用户点击弹窗按钮
            let shouldOpenChat = false;
            if (typeof showCustomConfirm === 'function') {
                shouldOpenChat = await showCustomConfirm('隔空投送成功', `已成功隔空投送至「${contactName}」！\n是否立即前往微信查看？`, '前往查看', false);
            } else {
                shouldOpenChat = window.confirm(`已成功隔空投送至「${contactName}」！\n\n是否立即前往微信查看？`);
            }

            // 只有当用户确实点击了“前往查看”或“确定”时，才关闭相册并进入微信
            if (shouldOpenChat === true) {
                closePhotosApp();
                if (typeof window.openWechatApp === 'function') {
                    window.openWechatApp();
                    setTimeout(() => {
                        if (typeof window.wcOpenChatRoom === 'function') {
                            window.wcOpenChatRoom(contact.id);
                        }
                    }, 300);
                }
            }
        } catch (err) {
            console.error('[隔空投送] 发送发生异常:', err);
            if (typeof window.showToast === 'function') {
                window.showToast('隔空投送处理异常，请重试');
            }
        }
    }

    function currentCoupleAccountId() {
        return String(typeof wcGetCurrentAccountId === 'function' ? wcGetCurrentAccountId() : 'default');
    }

    function newCoupleAvatarPairId() {
        return 'pair_' + (typeof crypto.randomUUID === 'function'
            ? crypto.randomUUID() : Date.now() + '_' + Math.random().toString(36).slice(2));
    }

    // Keep pair identities and empty slots stable when photos are removed or reordered.
    function syncCoupleAvatarPairs(album) {
        const sources = new Set(album.photoSrcs || []);
        const used = new Set();
        const pairs = (album.coupleAvatarPairs || []).map(pair => {
            const photos = [0, 1].map(index => {
                const src = pair.photos?.[index];
                if (!src || !sources.has(src) || used.has(src)) return null;
                used.add(src);
                return src;
            });
            return { id: photos.some((src, index) => src !== pair.photos?.[index]) ? newCoupleAvatarPairId() : pair.id, photos };
        }).filter(pair => pair.photos.some(Boolean));
        for (const src of sources) {
            if (used.has(src)) continue;
            let pair = pairs.find(entry => entry.photos.includes(null));
            if (!pair) {
                pair = { id: newCoupleAvatarPairId(), photos: [null, null] };
                pairs.push(pair);
            }
            pair.id = newCoupleAvatarPairId();
            pair.photos[pair.photos.indexOf(null)] = src;
            used.add(src);
        }
        album.coupleAvatarPairs = pairs;
        return pairs;
    }

    function coupleAlbumSharedWith(album, contactId) {
        if (!album.coupleAvatarEnabled || String(album.coupleAvatarAccountId) !== currentCoupleAccountId()) return false;
        const contacts = typeof wcContactsList !== 'undefined' ? wcContactsList : [];
        const contact = contacts.find(entry => String(entry.id) === String(contactId));
        if (!contact) return false;
        const clean = value => String(value || '').replace(/^char_/, '');
        const ids = new Set([clean(contact.id), clean(contact.linkedContactId)].filter(Boolean));
        return (album.sharedMemberIds || []).some(id => ids.has(clean(id)));
    }

    function scheduleCoupleAvatarSync() {
        const contacts = typeof wcContactsList !== 'undefined' ? wcContactsList : [];
        contacts.forEach(contact => {
            if (contact.proactiveMessageEnabled) window.ProactivePush?.scheduleSync?.(contact.id);
        });
    }

    function getCoupleAvatarCandidates(contactId) {
        const history = typeof wcChatMessagesByContact !== 'undefined' ? wcChatMessagesByContact[contactId] || [] : [];
        const previous = history.filter(message => message.coupleAvatarInvite);
        if (previous.some(message => message.coupleAvatarInvite.state === 'pending')) return [];
        const last = previous[previous.length - 1];
        if (last && Date.now() - Number(last.createdAt || 0) < 6 * 60 * 60 * 1000) return [];
        const items = new Map(getPhotoAlbumItems().map(item => [item.src, item]));
        const result = [];
        getStoredAlbums().forEach(album => {
            if (!coupleAlbumSharedWith(album, contactId)) return;
            (album.coupleAvatarPairs || []).forEach(pair => {
                if (last?.coupleAvatarInvite.state === 'accepted' && last.coupleAvatarInvite.pairId === pair.id) return;
                if (pair.photos?.length !== 2 || !pair.photos.every(src => src && items.has(src) && album.photoSrcs.includes(src))) return;
                result.push({ pairId: pair.id, albumId: album.id, albumName: album.name,
                    photos: pair.photos.map(src => ({ src, description: String(items.get(src).description || items.get(src).prompt || '').slice(0, 500) })) });
            });
        });
        return result;
    }

    function createCoupleAvatarInvitation(contactId, pairId, userSlot = 0, reason = '') {
        const pair = getCoupleAvatarCandidates(contactId).find(entry => entry.pairId === pairId);
        if (!pair || ![0, 1].includes(Number(userSlot))) return null;
        return { version: 1, accountId: currentCoupleAccountId(), contactId: String(contactId),
            pairId, albumId: pair.albumId, albumName: pair.albumName,
            photos: pair.photos.map(photo => ({ ...photo })), userSlot: Number(userSlot),
            reason: String(reason || '要不要一起换这对头像？').slice(0, 300), state: 'pending' };
    }

    function isCoupleAvatarInvitationAvailable(invite) {
        if (!invite || invite.accountId !== currentCoupleAccountId()) return false;
        const album = getStoredAlbums().find(entry => entry.id === invite.albumId);
        const sources = new Set(getPhotoAlbumItems().map(item => item.src));
        return Boolean(album && coupleAlbumSharedWith(album, invite.contactId)
            && invite.photos?.length === 2 && invite.photos.every(photo => photo.src && sources.has(photo.src) && album.photoSrcs.includes(photo.src)));
    }

    function renderCoupleAvatarLibrary(album, grid, limit = 24) {
        grid.classList.add('photos-couple-grid');
        grid.replaceChildren();
        const bar = document.createElement('div');
        bar.className = 'photos-couple-library-bar';
        const label = document.createElement('span');
        label.textContent = '情头模式 · 两张为一对';
        const edit = document.createElement('button');
        edit.type = 'button';
        edit.textContent = '编辑配对';
        edit.addEventListener('click', () => openCoupleAvatarEditor(album));
        bar.append(label, edit);
        grid.append(bar);
        const pairs = album.coupleAvatarPairs || [];
        pairs.slice(0, limit).forEach((pair, pairIndex) => {
            const row = document.createElement('div');
            row.className = 'photos-couple-pair-row';
            const caption = document.createElement('span');
            caption.className = 'photos-couple-pair-caption';
            caption.textContent = `第 ${pairIndex + 1} 对${pair.photos.every(Boolean) ? '' : ' · 待配对'}`;
            row.append(caption);
            pair.photos.forEach(src => {
                const index = currentFilteredItems.findIndex(item => item.src === src);
                if (index >= 0) row.append(createPhotoTileElement(currentFilteredItems[index], index));
                else {
                    const empty = document.createElement('div');
                    empty.className = 'photos-couple-empty';
                    empty.textContent = '待配对';
                    row.append(empty);
                }
            });
            grid.append(row);
        });
        if (pairs.length > limit) {
            const more = document.createElement('button');
            more.type = 'button';
            more.textContent = '显示更多情头';
            more.addEventListener('click', () => renderCoupleAvatarLibrary(album, grid, limit + 24));
            grid.append(more);
        }
    }

    function openCoupleAvatarEditor(album) {
        if (String(album.coupleAvatarAccountId) !== currentCoupleAccountId()) {
            alert('请切换到创建此情头相簿的面具账号后编辑');
            return;
        }
        let draft = (album.coupleAvatarPairs || []).map(pair => ({ id: pair.id, photos: [...pair.photos] }));
        let selected = null;
        const overlay = document.createElement('div');
        overlay.className = 'photos-couple-overlay';
        overlay.innerHTML = `<section class="photos-couple-sheet" role="dialog" aria-modal="true" aria-label="编辑情头配对">
            <div class="photos-couple-handle"></div><h3>编辑情头配对</h3>
            <p>拖动右下角手柄交换图片，也可依次点选两张图片交换</p>
            <div class="photos-couple-editor-list"></div>
            <footer><button type="button" data-action="save">完成</button><button type="button" data-action="cancel">取消</button></footer>
            </section>`;
        const list = overlay.querySelector('.photos-couple-editor-list');
        const location = key => key.split(':').map(Number);
        const swap = (from, to) => {
            if (!to || from === to) return;
            const [a, x] = location(from), [b, y] = location(to);
            [draft[a].photos[x], draft[b].photos[y]] = [draft[b].photos[y], draft[a].photos[x]];
            draft[a].id = newCoupleAvatarPairId();
            draft[b].id = newCoupleAvatarPairId();
            selected = null;
            render();
        };
        const render = () => {
            list.replaceChildren();
            draft.forEach((pair, pairIndex) => {
                const row = document.createElement('div');
                row.className = 'photos-couple-pair-row';
                const caption = document.createElement('span');
                caption.className = 'photos-couple-pair-caption';
                caption.textContent = `第 ${pairIndex + 1} 对`;
                row.append(caption);
                pair.photos.forEach((src, index) => {
                    const key = `${pairIndex}:${index}`;
                    const cell = document.createElement('div');
                    cell.className = 'photos-couple-editor-cell' + (selected === key ? ' selected' : '');
                    cell.dataset.pairSlot = key;
                    const button = document.createElement('button');
                    button.type = 'button';
                    button.setAttribute('aria-label', `第 ${pairIndex + 1} 对，第 ${index + 1} 张`);
                    if (src) {
                        const image = document.createElement('img');
                        image.src = src;
                        image.alt = '情头';
                        image.loading = 'lazy';
                        image.draggable = false;
                        button.append(image);
                    } else button.textContent = '待配对';
                    button.addEventListener('click', () => {
                        if (selected && selected !== key) swap(selected, key);
                        else { selected = selected === key ? null : key; render(); }
                    });
                    const handle = document.createElement('button');
                    handle.type = 'button';
                    handle.className = 'photos-pair-drag';
                    handle.setAttribute('aria-label', '拖动交换图片');
                    handle.innerHTML = '<svg viewBox="0 0 24 24" fill="currentColor"><circle cx="8" cy="6" r="2"/><circle cx="16" cy="6" r="2"/><circle cx="8" cy="12" r="2"/><circle cx="16" cy="12" r="2"/><circle cx="8" cy="18" r="2"/><circle cx="16" cy="18" r="2"/></svg>';
                    handle.addEventListener('pointerdown', event => {
                        event.preventDefault();
                        handle.setPointerCapture(event.pointerId);
                        cell.classList.add('dragging');
                        handle.onpointermove = move => {
                            const bounds = list.getBoundingClientRect();
                            if (move.clientY < bounds.top + 45) list.scrollTop -= 20;
                            else if (move.clientY > bounds.bottom - 45) list.scrollTop += 20;
                        };
                        handle.onpointerup = end => {
                            const target = document.elementFromPoint(end.clientX, end.clientY)?.closest('[data-pair-slot]');
                            cell.classList.remove('dragging');
                            handle.onpointermove = null;
                            if (target && list.contains(target)) swap(key, target.dataset.pairSlot);
                        };
                        handle.onpointercancel = () => { cell.classList.remove('dragging'); handle.onpointermove = null; };
                    });
                    cell.append(button, handle);
                    row.append(cell);
                });
                list.append(row);
            });
        };
        const close = () => { overlay.remove(); document.querySelector('.photos-couple-library-bar button')?.focus(); };
        overlay.querySelector('[data-action="cancel"]').addEventListener('click', close);
        overlay.querySelector('[data-action="save"]').addEventListener('click', () => {
            if (String(album.coupleAvatarAccountId) !== currentCoupleAccountId() || !getStoredAlbums().includes(album)) { close(); return; }
            album.coupleAvatarPairs = draft;
            saveStoredAlbums(getStoredAlbums());
            renderPhotosApp();
            close();
        });
        overlay.addEventListener('click', event => { if (event.target === overlay) close(); });
        overlay.addEventListener('keydown', event => { if (event.key === 'Escape') close(); });
        document.getElementById(PHOTOS_APP_ID).append(overlay);
        render();
        overlay.classList.add('show');
        overlay.querySelector('[data-action="save"]').focus();
    }

    window.PhotosCoupleAvatars = { getCandidates: getCoupleAvatarCandidates,
        createInvitation: createCoupleAvatarInvitation, isAvailable: isCoupleAvatarInvitationAvailable };

    window.renderPhotosApp = renderPhotosApp;
    window.openPhotosApp = openPhotosApp;
    window.closePhotosApp = closePhotosApp;
    window.closePhotosPreview = closePhotosPreview;

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => {
            ensurePhotosAppDom();
            bindPhotosApp();
        }, { once: true });
    } else {
        ensurePhotosAppDom();
        bindPhotosApp();
    }
})();

