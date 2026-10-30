// ================= 全局变量 =================
window.wcMusicActionLogs = window.wcMusicActionLogs || [];
let applemusicDb;
let applemusicParsedLyrics = [];
let applemusicCurrentLyricIndex = -1;
let applemusicNewPlaylistCoverBase64 = "";
let applemusicCurrentSearchType = '1';
let applemusicBadgeTimer = null;
let applemusicAllSongsCache = [];
let applemusicFavArtistsCache = [];

let applemusicDynamicIslandConfig = {
    enabled: false,
    x: 0,
    y: 0,
    scale: 1,
    color: '#ffffff'
};

let applemusicFloatingLyricsConfig = {
    enabled: false,
    style: 1, // 1: 错落几何风, 2: 网易云双行悬浮歌词, 3: 宋韵流光定制风
    fontSize: 18,
    color: '#ffffff',
    customCss: '',
    x: 0,
    y: 0
};
let applemusicLastRenderedFloatingCurrentLyric = '';
let applemusicLastRenderedFloatingNextLyric = '';

// Viewport sync for keyboard handling in import modal
let applemusicImportModalViewportTimer = null;

function applemusicSyncImportModalViewport() {
    const modal = document.getElementById('applemusic-modal-import-playlist');
    const modalContent = modal?.querySelector('.applemusic-modal-content');
    if (!modal || !modalContent) return;

    const vvHeight = Math.round(window.visualViewport?.height || window.innerHeight || 0);
    const windowHeight = window.innerHeight;

    if (vvHeight > 0 && vvHeight < windowHeight) {
        // Keyboard is open - adjust bottom position
        const keyboardHeight = windowHeight - vvHeight;
        modalContent.style.paddingBottom = keyboardHeight + 'px';
    } else {
        // Keyboard is closed - reset
        modalContent.style.paddingBottom = '';
    }
}

function applemusicScheduleImportModalViewportSync() {
    clearTimeout(applemusicImportModalViewportTimer);
    applemusicSyncImportModalViewport();
    applemusicImportModalViewportTimer = setTimeout(() => {
        applemusicSyncImportModalViewport();
    }, 180);
}
let applemusicPlaybackPersistTimer = null;
let applemusicPlaybackRequestId = 0;
let applemusicLastSeekRequest = null;

// 音乐源配置与网易云用户信息
let applemusicApiConfig = {
    type: 'builtin', // 'builtin' 或 'custom'
    builtinIndex: 0,
    customUrl: ''
};
let applemusicNeteaseUser = null;
const applemusicBuiltinApis = [
    { name: '主接口', url: 'https://musicapi.kkkiyomi.qzz.io' },
    { name: '在线接口', url: 'https://music.ovonline.qzz.io' },
    { name: '备用接口 1', url: 'https://zm.wwoyun.cn' },
    { name: '备用接口 2', url: 'https://api.mc666.org.cn' }
];

window.applemusicCurrentArtist = null;
window.applemusicCurrentQueue = [];
window.applemusicCurrentQueueSource = '';
window.applemusicPlaybackMode = 'repeat';
window.applemusicCurrentPlayingSong = null;
window.applemusicFavoriteSongsCount = 0;
window.applemusicFavoriteArtistsCount = 0;

function applemusicPersistPlaybackState() {
    const audio = document.getElementById('applemusic-audio-player');
    const song = window.applemusicCurrentPlayingSong;
    if (!audio || !song) return;

    try {
        localStorage.setItem('applemusicCurrentPlayingSong', JSON.stringify({
            ...song,
            currentTime: Number.isFinite(audio.currentTime) ? audio.currentTime : 0,
            isPlaying: !audio.paused
        }));
        localStorage.setItem('applemusicCurrentQueue', JSON.stringify(window.applemusicCurrentQueue || []));
        localStorage.setItem('applemusicCurrentQueueSource', window.applemusicCurrentQueueSource || '');
    } catch (e) {}
}

function applemusicSchedulePlaybackPersist() {
    if (applemusicPlaybackPersistTimer) return;
    applemusicPlaybackPersistTimer = setTimeout(() => {
        applemusicPlaybackPersistTimer = null;
        applemusicPersistPlaybackState();
    }, 500);
}

// Track explicit position changes so a seek cannot be mistaken for a finished song.
function applemusicSeekToPosition(time) {
    const audio = document.getElementById('applemusic-audio-player');
    if (!audio || !Number.isFinite(audio.duration) || audio.duration <= 0) return false;
    const requestedTime = Number(time);
    if (!Number.isFinite(requestedTime)) return false;
    const targetTime = Math.max(0, Math.min(requestedTime, Math.max(0, audio.duration - 0.25)));
    const previousRequest = applemusicLastSeekRequest;
    applemusicLastSeekRequest = {
        at: Date.now(),
        time: targetTime,
        source: audio.currentSrc || audio.src,
        requestId: applemusicPlaybackRequestId
    };
    try {
        audio.currentTime = targetTime;
        applemusicSchedulePlaybackPersist();
        return true;
    } catch (error) {
        applemusicLastSeekRequest = previousRequest;
        console.warn('Music seek was rejected:', error);
        return false;
    }
}

function applemusicRestoreSavedPlayback(song) {
    const audio = document.getElementById('applemusic-audio-player');
    if (!audio || !song || song.id == null) return;
    const requestId = applemusicPlaybackRequestId;

    const queueSong = (window.applemusicCurrentQueue || []).find(item => item.id == song.id);
    const isLocal = Boolean(queueSong && queueSong.isLocal && queueSong.url);
    const restoreTime = Number.isFinite(Number(song.currentTime)) ? Number(song.currentTime) : 0;
    const shouldPlay = song.isPlaying === true;

    const applySource = (source) => {
        if (!source || requestId !== applemusicPlaybackRequestId) return;
        audio.src = source;
        const restorePosition = () => {
            if (restoreTime > 0 && Number.isFinite(audio.duration)) {
                audio.currentTime = Math.min(restoreTime, Math.max(0, audio.duration - 0.25));
            }
        };
        audio.addEventListener('loadedmetadata', restorePosition, { once: true });
        if (audio.readyState >= 1) restorePosition();
        if (shouldPlay) {
            audio.play().catch(() => {
                applemusicUpdatePlayPauseUI(true);
            });
        } else {
            applemusicUpdatePlayPauseUI(true);
        }
    };

    if (isLocal) {
        applySource(queueSong.url);
        return;
    }

    const baseUrl = applemusicGetApiBaseUrl();
    let userCookie = '';
    if (applemusicNeteaseUser && applemusicNeteaseUser.cookie) {
        userCookie = applemusicNeteaseUser.cookie;
    } else {
        try {
            const savedUser = localStorage.getItem('applemusicNeteaseUser');
            if (savedUser) userCookie = JSON.parse(savedUser).cookie || '';
        } catch (e) {}
    }
    const cookieParam = userCookie ? `&cookie=${encodeURIComponent(userCookie)}` : '';

    if (applemusicApiConfig.type === 'builtin' && applemusicApiConfig.builtinIndex === 0) {
        // 主接口恢复播放
        fetch(`${baseUrl}/url?id=${song.id}&level=lossless${cookieParam}`)
            .then(res => res.json())
            .then(data => {
                if (data.url) applySource(data.url);
                else applySource(`https://music.163.com/song/media/outer/url?id=${song.id}.mp3`);
            })
            .catch(() => applySource(`https://music.163.com/song/media/outer/url?id=${song.id}.mp3`));
    } else if (applemusicApiConfig.type === 'builtin' && applemusicApiConfig.builtinIndex === 1) {
        // 在线接口恢复播放：使用播放源 API
        applySource(`https://api.qijieya.cn/meting?server=netease&type=url&id=${song.id}`);
    }
 else if (applemusicApiConfig.type === 'builtin' && (applemusicApiConfig.builtinIndex === 2 || applemusicApiConfig.builtinIndex === 3)) {
        // 备用接口 1 / 备用接口 2 恢复播放
        fetch(`${baseUrl}/song/url?id=${song.id}&br=320000${cookieParam}`)
            .then(res => res.json())
            .then(data => {
                const u = data.data?.[0]?.url || data.url;
                if (u) applySource(u.startsWith('http:') ? u.replace('http:', 'https:') : u);
                else applySource(`https://music.163.com/song/media/outer/url?id=${song.id}.mp3`);
            })
            .catch(() => applySource(`https://music.163.com/song/media/outer/url?id=${song.id}.mp3`));
    } else if (applemusicApiConfig.type === 'custom') {
        // 自定义源恢复播放
        fetch(`${baseUrl}/song/url?id=${song.id}${cookieParam}`)
            .then(res => res.json())
            .then(data => {
                const u = data.data?.[0]?.url || data.url;
                if (u) applySource(u.startsWith('http:') ? u.replace('http:', 'https:') : u);
                else applySource(`https://music.163.com/song/media/outer/url?id=${song.id}.mp3`);
            })
            .catch(() => applySource(`https://music.163.com/song/media/outer/url?id=${song.id}.mp3`));
    } else {
        applySource(`https://music.163.com/song/media/outer/url?id=${song.id}.mp3`);
    }
}

// ================= 视图切换 =================
function applemusicSwitchView(viewId, element) {
    document.querySelectorAll('.applemusic-view-container').forEach(el => {
        el.classList.remove('applemusic-active');
    });
    const targetView = document.getElementById('applemusic-view-' + viewId);
    if (targetView) {
        targetView.classList.add('applemusic-active');
    }

                if (element) {
                    document.querySelectorAll('.applemusic-nav-item').forEach(el => {
                        el.classList.remove('applemusic-nav-active');
                    });
                    element.classList.add('applemusic-nav-active');
                } else {
                    // 如果没有传入 element，自动根据 viewId 匹配底栏高亮状态
                    const navItems = document.querySelectorAll('.applemusic-nav-item');
                    if (navItems.length > 0) {
                        navItems.forEach(el => el.classList.remove('applemusic-nav-active'));
                        if (viewId === 'home' && navItems[0]) {
                            navItems[0].classList.add('applemusic-nav-active');
                        } else if (viewId === 'library' && navItems[1]) {
                            navItems[1].classList.add('applemusic-nav-active');
                        } else if (viewId === 'search' && navItems[2]) {
                            navItems[2].classList.add('applemusic-nav-active');
                        }
                    }
                }


    // 控制全局底部悬浮栏的显示与隐藏
    const floatingUI = document.querySelector('.applemusic-floating-ui');
    if (floatingUI) {
        if (viewId === 'artist' || viewId === 'playlist-detail' || viewId === 'settings' || viewId === 'floating-lyrics-settings' || viewId === 'dress-up-settings') {
            floatingUI.style.display = 'none';
        } else {
            floatingUI.style.display = 'flex';
        }
    }

    if (viewId === 'dress-up-settings' && typeof applemusicInitDressUpView === 'function') {
        applemusicInitDressUpView();
    }

    // 滚动到顶部 (只滚动当前视图容器)
    if (targetView) {
        targetView.scrollTo(0, 0);
    }
}

// 打开 App
window.openMusicApp = function() {
    const appUI = document.getElementById('musicAppUI');
    if (appUI) {
        appUI.style.display = 'block';
        // Paint the shell first; IndexedDB and playlist hydration can be expensive.
        window.requestAnimationFrame(() => {
            if (typeof applemusicLoadAllData === 'function') applemusicLoadAllData();
            applemusicSwitchView('home');
        });
    }
};


// 关闭 App 的统一函数 (兼容 HTML 中可能存在的两种写法)
function closeAppleMusicApp() {
    const appUI = document.getElementById('musicAppUI');
    if (appUI) appUI.style.display = 'none';
}
function closeMusicApp() {
    closeAppleMusicApp();
}

// ================= 提取图片主色调 =================
function applemusicSetDominantBackground(imageUrl, elementId) {
    const img = new Image();
    img.crossOrigin = "Anonymous";
    img.onload = function() {
        try {
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');
            canvas.width = 1;
            canvas.height = 1;
            ctx.drawImage(img, 0, 0, 1, 1);
            const [r, g, b] = ctx.getImageData(0, 0, 1, 1).data;
            const finalR = Math.floor(r * 0.5);
            const finalG = Math.floor(g * 0.5);
            const finalB = Math.floor(b * 0.5);
            const el = document.getElementById(elementId);
            if (el) el.style.backgroundColor = `rgb(${finalR}, ${finalG}, ${finalB})`;
        } catch (e) {
            const el = document.getElementById(elementId);
            if (el) el.style.backgroundColor = '#1a1a1a';
        }
    };
    img.onerror = function() {
        const el = document.getElementById(elementId);
        if (el) el.style.backgroundColor = '#1a1a1a';
    };
    img.src = imageUrl;
}

// ================= 歌手主页 =================
function applemusicOpenArtistProfile(artistId, artistName, artistPic) {
    applemusicSwitchView('artist');

    let finalName = artistName;
    let finalPic = artistPic;

    // 优先读取本地编辑过的艺人数据
    if (typeof musicAppData !== 'undefined' && musicAppData.artistCustomData && musicAppData.artistCustomData[artistId]) {
        const custom = musicAppData.artistCustomData[artistId];
        if (custom.name) finalName = custom.name;
        if (custom.pic) finalPic = custom.pic;
    }

    window.applemusicCurrentArtist = { id: artistId, name: finalName, pic: finalPic, timestamp: Date.now() };
    applemusicCheckIsFavoriteArtist(artistId);

    document.getElementById('applemusic-artist-page-name').innerText = finalName;

    const highResPic = finalPic ? (finalPic.includes('param=') ? finalPic.replace('100y100', '800y800') : finalPic) : 'https://images.unsplash.com/photo-1506157786151-b8491531f063?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80';
    document.getElementById('applemusic-artist-header-bg').style.backgroundImage = `url('${highResPic}')`;
    document.getElementById('applemusic-artist-page-cover').src = finalPic || highResPic;

    applemusicSetDominantBackground(highResPic, 'applemusic-view-artist');

    const topSongsList = document.getElementById('applemusic-artist-top-songs-list');
    topSongsList.innerHTML = '<div style="padding: 20px; color: rgba(255,255,255,0.6);">加载中...</div>';

    // 辅助渲染歌手歌曲列表
    const renderArtistSongs = (songs) => {
        topSongsList.innerHTML = '';
        if (songs.length > 0) {
            document.getElementById('applemusic-artist-page-hot').innerText = songs[0].name;
        } else {
            document.getElementById('applemusic-artist-page-hot').innerText = '暂无单曲';
        }

        const artistQueue = songs.map(song => ({
            id: song.id,
            name: song.name,
            artist: song.artist || finalName,
            cover: song.cover || (song.al?.picUrl ? song.al.picUrl + '?param=500y500' : '')
        }));
        window.applemusicArtistBrowseQueue = artistQueue;

        songs.forEach(song => {
            const div = document.createElement('div');
            div.className = 'applemusic-song-item';
            const cover = song.cover || (song.al?.picUrl ? song.al.picUrl + '?param=100y100' : '');
            const highResCover = song.cover || (song.al?.picUrl ? song.al.picUrl + '?param=500y500' : '');
            const albumName = song.album || song.al?.name || finalName;

            div.innerHTML = `
                <img src="${cover}" class="applemusic-song-cover">
                <div class="applemusic-song-details">
                    <div class="applemusic-song-name">${song.name}</div>
                    <div class="applemusic-song-album">${albumName}</div>
                </div>
                <div class="applemusic-btn-more" onclick="event.stopPropagation(); applemusicOpenSongMoreMenu(event, '${song.id}')"><svg viewBox="0 0 24 24"><path d="M6 10c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm12 0c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm-6 0c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z"/></svg></div>
            `;
            div.onclick = () => {
                window.applemusicCurrentQueue = artistQueue.slice();
                window.applemusicCurrentQueueSource = finalName;
                applemusicPlaySong(song.id, song.name, song.artist || finalName, highResCover);
            };
            topSongsList.appendChild(div);
        });
    };

    // 如果用户自定义过该歌手的歌曲列表，直接使用本地歌曲
    if (typeof musicAppData !== 'undefined' && musicAppData.artistCustomData && musicAppData.artistCustomData[artistId] && Array.isArray(musicAppData.artistCustomData[artistId].songs)) {
        renderArtistSongs(musicAppData.artistCustomData[artistId].songs);
        return;
    }

    const baseUrl = applemusicGetApiBaseUrl();
    const userCookie = applemusicNeteaseUser?.cookie || '';
    const cookieParam = userCookie ? `&cookie=${encodeURIComponent(userCookie)}` : '';

    if (applemusicApiConfig.type === 'builtin' && applemusicApiConfig.builtinIndex === 0) {
        // 主接口获取歌手歌曲
        fetch(`${baseUrl}/search?keywords=${encodeURIComponent(finalName)}&limit=10${cookieParam}`)
            .then(res => res.json())
            .then(data => {
                const list = data.data || [];
                if (list.length > 0) {
                    const songs = list.slice(0, 10).map(s => ({
                        id: s.id,
                        name: s.name,
                        artist: s.artist || finalName,
                        album: s.album || finalName,
                        cover: s.cover || ''
                    }));
                    renderArtistSongs(songs);
                } else {
                    throw new Error('No songs found');
                }
            })
            .catch(err => {
                console.error("Fetch artist songs error:", err);
                topSongsList.innerHTML = '<div style="padding: 20px; color: rgba(255,255,255,0.6);">加载失败，请尝试在右上角导入音乐</div>';
            });
    } else {
        // 在线接口 / 备用接口 1 / 自定义源获取歌手歌曲
        fetch(`${baseUrl}/artist/songs?id=${artistId}&limit=10${cookieParam}`)
            .then(res => {
                if (!res.ok) throw new Error('Network response was not ok');
                return res.json();
            })
            .then(data => {
                if (data.code === 200 && data.songs) {
                    const songs = data.songs.slice(0, 10).map(s => ({
                        id: s.id,
                        name: s.name,
                        artist: finalName,
                        album: s.al?.name || finalName,
                        cover: s.al?.picUrl ? s.al.picUrl + '?param=500y500' : ''
                    }));
                    renderArtistSongs(songs);
                } else {
                    throw new Error('API returned error or no hotSongs');
                }
            })
            .catch(err => {
                console.error("Fetch artist songs error:", err);
                topSongsList.innerHTML = '<div style="padding: 20px; color: rgba(255,255,255,0.6);">加载失败，请尝试在右上角导入音乐</div>';
            });
    }
}

// ================= 播放器控制 =================
function applemusicOpenPlayer() {
    document.getElementById('applemusic-full-player').classList.add('applemusic-active');
    document.body.classList.add('applemusic-no-scroll');

    // 每次打开播放器时，显示角标并重置 10 秒定时器
    applemusicShowPlaymodeBadge();

    if (typeof applemusicUpdateListenTogetherUI === 'function') {
        applemusicUpdateListenTogetherUI();
    }
}

// 独立封装的显示角标函数
function applemusicShowPlaymodeBadge() {
    const badge = document.getElementById('applemusic-playmode-badge');
    if (!badge) return;

    // 显示角标
    badge.classList.remove('hidden');

    // 清除旧的定时器
    if (applemusicBadgeTimer) {
        clearTimeout(applemusicBadgeTimer);
    }

    // 设置新的 10 秒定时器
    applemusicBadgeTimer = setTimeout(() => {
        badge.classList.add('hidden');
    }, 10000);
}

function applemusicClosePlayer() {
    document.getElementById('applemusic-full-player').classList.remove('applemusic-active');
    document.body.classList.remove('applemusic-no-scroll');
}

function applemusicUpdateListenTogetherUI() {
    const btn = document.getElementById('applemusic-listen-together-btn');
    const menuText = document.getElementById('applemusic-song-menu-invite-text');
    const airplayIconWrap = document.getElementById('applemusic-popup-airplay-icon-wrap');
    const islandCoverWrap = document.getElementById('applemusic-island-cover-wrapper');

    if (!btn) return;

    // 恢复持久化状态
    if (!window.applemusicListenTogetherContactId || window.applemusicListenTogetherContactId === 'null') {
        try {
            const savedContactId = localStorage.getItem('applemusicListenTogetherContactId');
            if (savedContactId && savedContactId !== 'null') {
                window.applemusicListenTogetherContactId = savedContactId;
                window.applemusicCurrentQueueSource = '一起听歌';
            } else if (typeof appSettings !== 'undefined' && appSettings.wc_listen_together_contact_id) {
                window.applemusicListenTogetherContactId = appSettings.wc_listen_together_contact_id;
                window.applemusicCurrentQueueSource = '一起听歌';
            }
        } catch(e) {}
    }

    if (window.applemusicListenTogetherContactId && window.applemusicListenTogetherContactId !== 'null') {
        let userAvatar = '';
        if (typeof appSettings !== 'undefined' && appSettings.wc_current_user_avatar) {
            userAvatar = appSettings.wc_current_user_avatar;
            try { localStorage.setItem('applemusicListenTogetherUserAvatar', userAvatar); } catch(e) {}
        } else {
            try { userAvatar = localStorage.getItem('applemusicListenTogetherUserAvatar') || ''; } catch(e) {}
        }

        let charAvatar = '';
        if (typeof wcContactsList !== 'undefined' && wcContactsList.length > 0) {
            const contact = wcContactsList.find(c => c.id === window.applemusicListenTogetherContactId);
            if (contact) {
                charAvatar = contact.avatar;
                try { localStorage.setItem('applemusicListenTogetherCharAvatar', charAvatar); } catch(e) {}
            } else {
                try { charAvatar = localStorage.getItem('applemusicListenTogetherCharAvatar') || ''; } catch(e) {}
            }
        } else {
            try { charAvatar = localStorage.getItem('applemusicListenTogetherCharAvatar') || ''; } catch(e) {}
        }

        // 提取纯净的 img 标签，去除内置的 absolute 定位，由外层容器控制
        const userImg = userAvatar ? `<img src="${userAvatar}" style="width: 100%; height: 100%; border-radius: 50%; object-fit: cover; border: 1.5px solid rgba(255,255,255,0.5);">` : `<div style="width: 100%; height: 100%; border-radius: 50%; background: #ccc; border: 1.5px solid rgba(255,255,255,0.5);"></div>`;
        const charImg = charAvatar ? `<img src="${charAvatar}" style="width: 100%; height: 100%; border-radius: 50%; object-fit: cover;">` : `<div style="width: 100%; height: 100%; border-radius: 50%; background: #ccc;"></div>`;

        const dualAvatarHtml30 = `
            <div style="position: relative; width: 48px; height: 30px; display: flex; align-items: center;">
                <div style="width: 30px; height: 30px; position: absolute; left: 0; top: 0; z-index: 1;">${charImg}</div>
                <div style="width: 30px; height: 30px; position: absolute; right: 0; top: 0; z-index: 2;">${userImg}</div>
            </div>
        `;

        const dualAvatarHtml16 = `
            <div style="position: relative; width: 26px; height: 16px; display: flex; align-items: center;">
                <div style="width: 16px; height: 16px; position: absolute; left: 0; top: 0; z-index: 1;">${charImg}</div>
                <div style="width: 16px; height: 16px; position: absolute; right: 0; top: 0; z-index: 2;">${userImg}</div>
            </div>
        `;

        // 悬浮音乐条双人头像：加宽容器到 36px，双人交叠并添加微光
        const dualAvatarHtml32 = `
            <div id="applemusic-island-cover" style="position: relative; width: 36px !important; height: 22px !important; display: flex; align-items: center; background: transparent; box-shadow: none; border-radius: 0; animation: none !important;">
                <div style="width: 22px; height: 22px; position: absolute; left: 0; top: 0; z-index: 1; box-shadow: 0 2px 6px rgba(0,0,0,0.4); border-radius: 50%;">${charImg}</div>
                <div style="width: 22px; height: 22px; position: absolute; right: 0; top: 0; z-index: 2; box-shadow: 0 2px 8px rgba(0,0,0,0.5); border-radius: 50%;">${userImg}</div>
            </div>
        `;

        btn.innerHTML = dualAvatarHtml30;
        if (airplayIconWrap) airplayIconWrap.innerHTML = dualAvatarHtml16;
        if (islandCoverWrap) {
            islandCoverWrap.innerHTML = dualAvatarHtml32;
        }

        const islandEl = document.getElementById('applemusic-dynamic-island');
        if (islandEl) islandEl.classList.add('together-mode');

        if (menuText) menuText.innerText = '结束一起听歌';
    } else {
        btn.innerHTML = `
            <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" class="bi bi-headphones" viewBox="0 0 16 16" id="Headphones--Streamline-Bootstrap" style="width: 24px; height: 24px;">
                <path d="M8 3a5 5 0 0 0 -5 5v1h1a1 1 0 0 1 1 1v3a1 1 0 0 1 -1 1H3a1 1 0 0 1 -1 -1V8a6 6 0 1 1 12 0v5a1 1 0 0 1 -1 1h-1a1 1 0 0 1 -1 -1v-3a1 1 0 0 1 1 -1h1V8a5 5 0 0 0 -5 -5" stroke-width="1"></path>
            </svg>
        `;
        if (airplayIconWrap) airplayIconWrap.innerHTML = `<svg viewBox="0 0 24 24" style="width: 16px; height: 16px; fill: #000;"><path d="M12 15l-4 5h8l-4-5zm9-11H3c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h4v-2H3V6h18v10h-4v2h4c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2z"/></svg>`;

        if (islandCoverWrap) {
            const coverSrc = window.applemusicCurrentPlayingSong ? window.applemusicCurrentPlayingSong.cover : 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7';
            islandCoverWrap.innerHTML = `<img src="${coverSrc}" class="applemusic-island-cover" id="applemusic-island-cover" alt="">`;
            const audio = document.getElementById('applemusic-audio-player');
            if (audio && audio.paused) {
                const newCover = document.getElementById('applemusic-island-cover');
                if (newCover) newCover.classList.add('paused');
            }
        }

        const islandEl = document.getElementById('applemusic-dynamic-island');
        if (islandEl) islandEl.classList.remove('together-mode');

        if (menuText) menuText.innerText = '邀请一起听歌';
    }
}

function applemusicHandleListenTogetherClick() {
    if (window.applemusicListenTogetherContactId) {
        const contactId = window.applemusicListenTogetherContactId;
        const endListenTogether = () => {
            window.applemusicCurrentQueueSource = '';
            window.applemusicListenTogetherContactId = null;
            try { localStorage.removeItem('applemusicListenTogetherContactId'); } catch(e) {}
            if (typeof appSettings !== 'undefined') {
                appSettings.wc_listen_together_contact_id = null;
                if (typeof saveAppSettings === 'function') saveAppSettings();
            }
            applemusicUpdateListenTogetherUI();

            if (window.wcMusicActionLogs) window.wcMusicActionLogs.push(`User 主动结束了一起听歌`);
            if (typeof wcCloseMusicLiveDetailModal === 'function') wcCloseMusicLiveDetailModal();

            // 修改微信聊天记录状态为已结束，并追加统计数据
            if (typeof wcChatMessagesByContact !== 'undefined' && wcChatMessagesByContact[contactId]) {
                const messages = wcChatMessagesByContact[contactId];
                const targetMsg = messages.slice().reverse().find(m => m.text && m.text.startsWith('[已接受听歌]'));
                if (targetMsg) {
                    let count = 1;
                    let duration = 0;
                    if (typeof appSettings !== 'undefined') {
                        count = appSettings.wc_listen_together_song_count || 1;
                        const startTime = appSettings.wc_listen_together_start_time || Date.now();
                        duration = Date.now() - startTime;
                    }
                    // 格式: [已结束听歌] 歌名 - 歌手 | 封面 | ID | 数量 | 时长
                    targetMsg.text = targetMsg.text.replace('[已接受听歌]', '[已结束听歌]') + ` | ${count} | ${duration}`;
                    if (typeof wcSaveChatData === 'function') wcSaveChatData();
                    if (typeof wcCurrentChatContactId !== 'undefined' && wcCurrentChatContactId === contactId) {
                        if (typeof wcRenderChatMessages === 'function') wcRenderChatMessages(contactId);
                    }
                }
            }
            if (typeof showToast === 'function') showToast('已结束一起听歌');
        };

        if (typeof showCustomConfirm === 'function') {
            showCustomConfirm('结束一起听歌', '确定要结束一起听歌吗？', '结束', true).then(confirmed => {
                if (confirmed) endListenTogether();
            });
        } else {
            if (confirm('确定要结束一起听歌吗？')) endListenTogether();
        }
    } else {
        applemusicOpenInviteModal();
    }
}

function applemusicSongMenuInviteClick() {
    applemusicCloseSongMoreMenu();
    if (window.applemusicListenTogetherContactId) {
        const contactId = window.applemusicListenTogetherContactId;
        const endListenTogether = () => {
            window.applemusicCurrentQueueSource = '';
            window.applemusicListenTogetherContactId = null;
            try { localStorage.removeItem('applemusicListenTogetherContactId'); } catch(e) {}
            if (typeof appSettings !== 'undefined') {
                appSettings.wc_listen_together_contact_id = null;
                if (typeof saveAppSettings === 'function') saveAppSettings();
            }
            applemusicUpdateListenTogetherUI();

            if (window.wcMusicActionLogs) window.wcMusicActionLogs.push(`User 主动结束了一起听歌`);
            if (typeof wcCloseMusicLiveDetailModal === 'function') wcCloseMusicLiveDetailModal();

            // 修改微信聊天记录状态为已结束，并追加统计数据
            if (typeof wcChatMessagesByContact !== 'undefined' && wcChatMessagesByContact[contactId]) {
                const messages = wcChatMessagesByContact[contactId];
                const targetMsg = messages.slice().reverse().find(m => m.text && m.text.startsWith('[已接受听歌]'));
                if (targetMsg) {
                    let count = 1;
                    let duration = 0;
                    if (typeof appSettings !== 'undefined') {
                        count = appSettings.wc_listen_together_song_count || 1;
                        const startTime = appSettings.wc_listen_together_start_time || Date.now();
                        duration = Date.now() - startTime;
                    }
                    // 格式: [已结束听歌] 歌名 - 歌手 | 封面 | ID | 数量 | 时长
                    targetMsg.text = targetMsg.text.replace('[已接受听歌]', '[已结束听歌]') + ` | ${count} | ${duration}`;
                    if (typeof wcSaveChatData === 'function') wcSaveChatData();
                    if (typeof wcCurrentChatContactId !== 'undefined' && wcCurrentChatContactId === contactId) {
                        if (typeof wcRenderChatMessages === 'function') wcRenderChatMessages(contactId);
                    }
                }
            }
            if (typeof showToast === 'function') showToast('已结束一起听歌');
        };

        if (typeof showCustomConfirm === 'function') {
            showCustomConfirm('结束一起听歌', '确定要结束一起听歌吗？', '结束', true).then(confirmed => {
                if (confirmed) endListenTogether();
            });
        } else {
            if (confirm('确定要结束一起听歌吗？')) endListenTogether();
        }
    } else {
        applemusicOpenInviteModal();
    }
}

function applemusicTogglePlayPause(el) {
    const audio = document.getElementById('applemusic-audio-player');
    if (!audio || !audio.src) return;

    const isPaused = audio.paused;
    if (isPaused) {
        const attempt = audio.play();
        if (attempt && typeof attempt.catch === 'function') {
            attempt.catch(error => {
                console.warn('Music playback was rejected:', error);
                applemusicUpdatePlayPauseUI(true);
            });
        }
        if (window.wcMusicActionLogs) window.wcMusicActionLogs.push(`User 继续播放了歌曲`);
    } else {
        audio.pause();
        if (window.wcMusicActionLogs) window.wcMusicActionLogs.push(`User 暂停了歌曲`);
    }
    applemusicUpdatePlayPauseUI(!isPaused);
}

function applemusicUpdatePlayPauseUI(isPaused) {
    document.querySelectorAll('.applemusic-ctrl-playpause').forEach(btn => {
        const pauseIcon = btn.querySelector('.applemusic-icon-pause');
        const playIcon = btn.querySelector('.applemusic-icon-play');
        if (pauseIcon && playIcon) {
            if (isPaused) {
                pauseIcon.style.display = 'none';
                playIcon.style.display = 'block';
            } else {
                pauseIcon.style.display = 'block';
                playIcon.style.display = 'none';
            }
        }
    });

    // 同步更新歌手主页大播放键状态
    const artistPlayLarge = document.querySelector('.applemusic-btn-play-large');
    if (artistPlayLarge) {
        const artistPlayIcon = artistPlayLarge.querySelector('.applemusic-artist-play-icon');
        const artistPauseIcon = artistPlayLarge.querySelector('.applemusic-artist-pause-icon');
        const isCurrentArtistQueue = window.applemusicCurrentArtist && window.applemusicCurrentQueueSource === window.applemusicCurrentArtist.name;
        if (artistPlayIcon && artistPauseIcon) {
            if (!isPaused && isCurrentArtistQueue) {
                artistPlayIcon.style.display = 'none';
                artistPauseIcon.style.display = 'block';
            } else {
                artistPlayIcon.style.display = 'block';
                artistPauseIcon.style.display = 'none';
            }
        }
    }

    // 同步更新悬浮条播放状态 (已移除播放键，仅控制动画)
    const islandCover = document.getElementById('applemusic-island-cover');
    const islandLyric = document.getElementById('applemusic-island-lyric');
    if (isPaused) {
        if (islandCover) islandCover.classList.add('paused');
        if (islandLyric) islandLyric.classList.add('paused');
    } else {
        if (islandCover) islandCover.classList.remove('paused');
        if (islandLyric) islandLyric.classList.remove('paused');
    }
}

// ================= 进度条与歌词 =================
function initAppleMusicApp() {
    // Load the selected source before restoring the saved audio URL.
    applemusicInitApiSettings();

    try {
        // 提前恢复一起听歌状态，确保刷新页面后灵动岛能正确显示双人头像
        if (!window.applemusicListenTogetherContactId || window.applemusicListenTogetherContactId === 'null') {
            const savedContactId = localStorage.getItem('applemusicListenTogetherContactId');
            if (savedContactId && savedContactId !== 'null') {
                window.applemusicListenTogetherContactId = savedContactId;
                window.applemusicCurrentQueueSource = '一起听歌';
            }
        }

        const savedSong = localStorage.getItem('applemusicCurrentPlayingSong');
        const savedQueue = localStorage.getItem('applemusicCurrentQueue');
        const savedSource = localStorage.getItem('applemusicCurrentQueueSource');
        if (savedQueue) window.applemusicCurrentQueue = JSON.parse(savedQueue);
        if (savedSource) window.applemusicCurrentQueueSource = savedSource;

        if (savedSong) {
            window.applemusicCurrentPlayingSong = JSON.parse(savedSong);
            applemusicRestoreSavedPlayback(window.applemusicCurrentPlayingSong);
            setTimeout(() => {
                const miniTitle = document.getElementById('applemusic-mini-title');
                const miniCover = document.getElementById('applemusic-mini-cover');
                if(miniTitle) miniTitle.innerText = window.applemusicCurrentPlayingSong.name;
                if(miniCover) miniCover.innerHTML = `<img src="${window.applemusicCurrentPlayingSong.cover}" style="width:100%; height:100%; border-radius:10px; object-fit:cover;">`;

                const artistBottomTitle = document.getElementById('applemusic-artist-bottom-title');
                const artistBottomArtist = document.getElementById('applemusic-artist-bottom-artist');
                const artistBottomCover = document.getElementById('applemusic-artist-bottom-cover');
                if(artistBottomTitle) artistBottomTitle.innerText = window.applemusicCurrentPlayingSong.name;
                if(artistBottomArtist) artistBottomArtist.innerText = window.applemusicCurrentPlayingSong.artist;
                if(artistBottomCover) artistBottomCover.innerHTML = `<img src="${window.applemusicCurrentPlayingSong.cover}" style="width:100%; height:100%; border-radius:50%; object-fit:cover;">`;

                const playlistBottomTitle = document.getElementById('applemusic-playlist-bottom-title');
                const playlistBottomArtist = document.getElementById('applemusic-playlist-bottom-artist');
                const playlistBottomCover = document.getElementById('applemusic-playlist-bottom-cover');
                if(playlistBottomTitle) playlistBottomTitle.innerText = window.applemusicCurrentPlayingSong.name;
                if(playlistBottomArtist) playlistBottomArtist.innerText = window.applemusicCurrentPlayingSong.artist;
                if(playlistBottomCover) playlistBottomCover.innerHTML = `<img src="${window.applemusicCurrentPlayingSong.cover}" style="width:100%; height:100%; border-radius:50%; object-fit:cover;">`;

                const largeTitle = document.getElementById('applemusic-large-title');
                const largeArtist = document.getElementById('applemusic-large-artist');
                const largeCoverImg = document.getElementById('applemusic-large-cover-img');
                const playerBg = document.querySelector('.applemusic-player-bg');
                if(largeTitle) largeTitle.innerText = window.applemusicCurrentPlayingSong.name;
                if(largeArtist) largeArtist.innerText = window.applemusicCurrentPlayingSong.artist;
                if(largeCoverImg) largeCoverImg.src = window.applemusicCurrentPlayingSong.cover;
                if(playerBg) playerBg.style.backgroundImage = `url('${window.applemusicCurrentPlayingSong.cover}')`;

                const listCurrentTitle = document.getElementById('applemusic-list-current-title');
                const listCurrentArtist = document.getElementById('applemusic-list-current-artist');
                const listCurrentCover = document.getElementById('applemusic-list-current-cover');
                if(listCurrentTitle) listCurrentTitle.innerText = window.applemusicCurrentPlayingSong.name;
                if(listCurrentArtist) listCurrentArtist.innerText = window.applemusicCurrentPlayingSong.artist;
                if(listCurrentCover) listCurrentCover.src = window.applemusicCurrentPlayingSong.cover;

                const islandCover = document.getElementById('applemusic-island-cover');
                const popupCover = document.getElementById('applemusic-popup-cover');
                const popupTitle = document.getElementById('applemusic-popup-title');
                const popupArtist = document.getElementById('applemusic-popup-artist');
                if (islandCover) islandCover.src = window.applemusicCurrentPlayingSong.cover || 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7';
                if (popupCover) popupCover.src = window.applemusicCurrentPlayingSong.cover;
                if (popupTitle) popupTitle.innerText = window.applemusicCurrentPlayingSong.name;
                if (popupArtist) popupArtist.innerText = window.applemusicCurrentPlayingSong.artist;

                // 确保在单人封面恢复后，再次调用一起听歌 UI 更新，覆盖掉单人封面
                if (typeof applemusicUpdateListenTogetherUI === 'function') {
                    applemusicUpdateListenTogetherUI();
                }
            }, 100);
        } else {
            // 如果没有 savedSong，也要恢复一起听歌 UI
            setTimeout(() => {
                if (typeof applemusicUpdateListenTogetherUI === 'function') {
                    applemusicUpdateListenTogetherUI();
                }
            }, 100);
        }
    } catch(e) {}

    const audioPlayer = document.getElementById('applemusic-audio-player');
    const progressFill = document.getElementById('applemusic-progress-fill');
    const timeCurrent = document.getElementById('applemusic-time-current');
    const timeDuration = document.getElementById('applemusic-time-duration');
    const progressBar = document.getElementById('applemusic-progress-bar');

    if (audioPlayer) {
        audioPlayer.addEventListener('timeupdate', () => {
            if (window.__applemusicIsProgressDragging || window.__applemusicIsSeeking) return;
            const current = audioPlayer.currentTime;
            const duration = audioPlayer.duration;

            if (Number.isFinite(duration) && duration > 0) {
                const percent = Math.max(0, Math.min(100, (current / duration) * 100));
                if (progressFill) progressFill.style.width = `${percent}%`;
                if (timeCurrent) timeCurrent.innerText = applemusicFormatTime(current);
                if (timeDuration) timeDuration.innerText = "-" + applemusicFormatTime(Math.max(0, duration - current));

                // 同步更新弹窗进度条
                const popupProgressFill = document.getElementById('applemusic-popup-progress-fill');
                const popupTimeCurrent = document.getElementById('applemusic-popup-time-current');
                const popupTimeDuration = document.getElementById('applemusic-popup-time-duration');
                if (popupProgressFill) popupProgressFill.style.width = `${percent}%`;
                if (popupTimeCurrent) popupTimeCurrent.innerText = applemusicFormatTime(current);
                if (popupTimeDuration) popupTimeDuration.innerText = "-" + applemusicFormatTime(Math.max(0, duration - current));
            }

            if (applemusicParsedLyrics.length > 0) {
                const newIndex = applemusicLyricIndexAt(current);

                if (newIndex !== applemusicCurrentLyricIndex) {
                    applemusicCurrentLyricIndex = newIndex;
                    applemusicUpdateLyricsHighlight();
                }

                // 悬浮歌词实时逐字高亮进度计算
                if (typeof applemusicUpdateFloatingLyricProgress === 'function') {
                    applemusicUpdateFloatingLyricProgress(current);
                }
            }
            applemusicSchedulePlaybackPersist();
        });

        audioPlayer.addEventListener('play', () => {
            applemusicSchedulePlaybackPersist();
            applemusicUpdatePlayPauseUI(false);
        });
        audioPlayer.addEventListener('pause', () => {
            applemusicPersistPlaybackState();
            applemusicUpdatePlayPauseUI(audioPlayer.paused);
        });
        audioPlayer.addEventListener('error', () => {
            if (!window.applemusicCurrentPlayingSong) return;
            applemusicUpdatePlayPauseUI(true);
            if (typeof showToast === 'function') showToast('歌曲加载失败，请尝试更换音乐源');
        });
        audioPlayer.addEventListener('ended', () => {
            // A seek can transiently emit "ended" on mobile media players.
            // Restarting the current item here would discard the requested position.
            const recentSeek = applemusicLastSeekRequest;
            const endedDuringSeek = recentSeek &&
                recentSeek.requestId === applemusicPlaybackRequestId &&
                recentSeek.source === (audioPlayer.currentSrc || audioPlayer.src) &&
                Date.now() - recentSeek.at < 1800 &&
                Number.isFinite(audioPlayer.duration) &&
                recentSeek.time < audioPlayer.duration - 2;
            if (audioPlayer.seeking || window.__applemusicIsSeeking || endedDuringSeek) {
                console.warn('Ignored media ended event while seeking.');
                return;
            }
            if (window.applemusicPlaybackMode === 'repeat-one') {
                // 单曲循环
                audioPlayer.currentTime = 0;
                audioPlayer.play();
            } else {
                // 播放下一首
                applemusicPlayNextSong(true);
            }
        });
    }

    // 全屏播放器进度条由 music-app-shell.js 的 PointerEvents 统一接管（兼顾点击跳转与丝滑拖拽），避免双重绑定导致进度归零
    const popupProgressBar = document.getElementById('applemusic-popup-progress-bar');
    if (popupProgressBar) {
        popupProgressBar.addEventListener('click', (e) => {
            if (!audioPlayer || !audioPlayer.duration) return;
            const rect = popupProgressBar.getBoundingClientRect();
            const percent = (e.clientX - rect.left) / rect.width;
            applemusicSeekToPosition(percent * audioPlayer.duration);
        });
    }

    // 绑定搜索框事件
    const searchInput = document.getElementById('applemusic-search-input');
    if (searchInput) {
        searchInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                const keyword = this.value.trim();
                if (keyword) {
                    applemusicSaveSearchHistory(keyword);
                    applemusicPerformSearch(keyword);
                }
            }
        });
    }

    // 绑定搜索类型切换
    document.querySelectorAll('.applemusic-search-tab').forEach(tab => {
        tab.addEventListener('click', function() {
            document.querySelectorAll('.applemusic-search-tab').forEach(t => {
                t.style.background = 'transparent';
                t.style.boxShadow = 'none';
                t.style.color = 'var(--text-secondary)';
                t.classList.remove('applemusic-active');
            });
            this.style.background = '#fff';
            this.style.boxShadow = '0 1px 3px rgba(0,0,0,0.1)';
            this.style.color = 'var(--text-main)';
            this.classList.add('applemusic-active');
            applemusicCurrentSearchType = this.getAttribute('data-type');

            const keyword = document.getElementById('applemusic-search-input').value.trim();
            if (keyword) {
                applemusicPerformSearch(keyword);
            }
        });
    });

    // 绑定设置页头像点击事件
    const settingsAvatar = document.querySelector('.applemusic-settings-avatar');
    if (settingsAvatar) {
        settingsAvatar.style.cursor = 'pointer';
        settingsAvatar.addEventListener('click', applemusicTriggerProfileAvatarUpload);
    }

    // 初始化数据库
    applemusicInitDB();

    // 初始化灵动岛
    applemusicInitDynamicIsland();

    // 初始化悬浮歌词
    applemusicInitFloatingLyrics();
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initAppleMusicApp);
} else {
    initAppleMusicApp();
}

function applemusicFormatTime(seconds) {
    if (isNaN(seconds)) return "0:00";
    const m = Math.floor(seconds / 60);
    const s = Math.floor(seconds % 60);
    return `${m}:${s < 10 ? '0' + s : s}`;
}

function applemusicParseLyrics(lrcText) {
    applemusicParsedLyrics = [];
    const lines = lrcText.split('\n');
    const regex = /\[(\d{2}):(\d{2}\.\d{2,3})\](.*)/;

    lines.forEach(line => {
        const match = regex.exec(line);
        if (match) {
            const minutes = parseInt(match[1]);
            const seconds = parseFloat(match[2]);
            const text = match[3].trim();
            if (text) {
                applemusicParsedLyrics.push({ time: minutes * 60 + seconds, text });
            }
        }
    });
    applemusicRenderLyrics();
    window.dispatchEvent(new CustomEvent('applemusic-phone-lyrics'));
}

// Both players use the main music App's lyric timeline.
function applemusicLyricIndexAt(time) {
    if (!applemusicParsedLyrics.length) return -1;
    let index = applemusicParsedLyrics.findIndex(row => row.time > time) - 1;
    if (index === -2) index = applemusicParsedLyrics.length - 1;
    return Math.max(0,index);
}

function applemusicRenderLyrics() {
    const container = document.getElementById('applemusic-lyrics-container');
    if (!container) return;
    container.innerHTML = '';
    if (applemusicParsedLyrics.length === 0) {
        container.innerHTML = '<div class="applemusic-lyric-line applemusic-active" style="text-align:center; margin-top:50px;">纯音乐，请欣赏</div>';
        return;
    }
    applemusicParsedLyrics.forEach((lyric, index) => {
        const div = document.createElement('div');
        div.className = 'applemusic-lyric-line';
        div.id = `applemusic-lyric-${index}`;
        div.innerText = lyric.text;
        container.appendChild(div);
    });
    applemusicCurrentLyricIndex = -1;
}

function applemusicUpdateLyricsHighlight() {
    if (applemusicCurrentLyricIndex < 0 || applemusicParsedLyrics.length === 0) return;
    const lyricLines = document.querySelectorAll('.applemusic-lyric-line');
    const container = document.getElementById('applemusic-lyrics-container');

    lyricLines.forEach(l => l.classList.remove('applemusic-active'));
    const activeLine = document.getElementById(`applemusic-lyric-${applemusicCurrentLyricIndex}`);
    if (activeLine && container) {
        activeLine.classList.add('applemusic-active');
        const containerHeight = container.offsetHeight;
        const lineOffset = activeLine.offsetTop;
        const lineHeight = activeLine.offsetHeight;
        // 将 -40 改为 -15，让歌词往上移一点点，达到完美的居中效果
        container.scrollTo({
            top: lineOffset - containerHeight / 2 + lineHeight / 2 - 15,
            behavior: 'smooth'
        });

        // 同步更新悬浮歌词条 (首字放大 + 平滑渐显 + 超长自适应滚动)
        const islandLyric = document.getElementById('applemusic-island-lyric');
        if (islandLyric) {
            const fullText = (applemusicParsedLyrics[applemusicCurrentLyricIndex]?.text || '').trim();
            if (fullText) {
                const firstChar = fullText.charAt(0);
                const restText = fullText.slice(1);
                islandLyric.innerHTML = `
                    <span class="am-lyric-first lyric-text-fade">${firstChar}</span>
                    <span class="am-lyric-rest lyric-text-fade">${restText}</span>
                `;
            } else {
                islandLyric.innerHTML = `<span class="am-lyric-rest">纯音乐，请欣赏</span>`;
            }

            // 动态判断文字是否超长：不长则保持静止，超长则按溢出像素量自适应往返滚动
            requestAnimationFrame(() => {
                const container = islandLyric.parentElement;
                if (!container) return;

                islandLyric.classList.remove('is-scrolling');
                islandLyric.style.removeProperty('--overflow-dist');
                islandLyric.style.removeProperty('--marquee-duration');

                const overflow = islandLyric.scrollWidth - container.clientWidth;
                if (overflow > 4) {
                    const dist = -overflow - 8;
                    const duration = Math.max(3.8, Math.abs(dist) / 16);
                    islandLyric.style.setProperty('--overflow-dist', `${dist}px`);
                    islandLyric.style.setProperty('--marquee-duration', `${duration}s`);
                    islandLyric.classList.add('is-scrolling');
                }
            });
        }
        if (typeof applemusicUpdateFloatingLyricText === 'function') {
            const curText = applemusicParsedLyrics[applemusicCurrentLyricIndex]?.text || '';
            const nextText = applemusicParsedLyrics[applemusicCurrentLyricIndex + 1]?.text || '';
            applemusicUpdateFloatingLyricText(curText, nextText);
        }
    }
}

function applemusicToggleLyricsView() {
    const mainView = document.getElementById('applemusic-player-main-view');
    const listView = document.getElementById('applemusic-player-list-view');
    const lyricsView = document.getElementById('applemusic-player-lyrics-view');
    const toggleListBtn = document.getElementById('applemusic-toggle-list-btn');
    const toggleLyricsBtn = document.getElementById('applemusic-toggle-lyrics-btn');

    if (lyricsView.style.display === 'none' || lyricsView.style.display === '') {
        mainView.style.display = 'none';
        listView.style.display = 'none';
        lyricsView.style.display = 'flex';
        if (toggleListBtn) toggleListBtn.classList.remove('applemusic-active-icon');
        if (toggleLyricsBtn) toggleLyricsBtn.classList.add('applemusic-active-icon');
        setTimeout(applemusicUpdateLyricsHighlight, 100);
    } else {
        mainView.style.display = 'flex';
        lyricsView.style.display = 'none';
        if (toggleLyricsBtn) toggleLyricsBtn.classList.remove('applemusic-active-icon');
    }
}

function applemusicTogglePlayerListView() {
    const mainView = document.getElementById('applemusic-player-main-view');
    const listView = document.getElementById('applemusic-player-list-view');
    const lyricsView = document.getElementById('applemusic-player-lyrics-view');
    const toggleListBtn = document.getElementById('applemusic-toggle-list-btn');
    const toggleLyricsBtn = document.getElementById('applemusic-toggle-lyrics-btn');

    if (listView.style.display === 'none' || listView.style.display === '') {
        mainView.style.display = 'none';
        lyricsView.style.display = 'none';
        listView.style.display = 'flex';
        if (toggleListBtn) toggleListBtn.classList.add('applemusic-active-icon');
        if (toggleLyricsBtn) toggleLyricsBtn.classList.remove('applemusic-active-icon');
    } else {
        mainView.style.display = 'flex';
        listView.style.display = 'none';
        if (toggleListBtn) toggleListBtn.classList.remove('applemusic-active-icon');
    }
}

function applemusicToggleUpNextMode(mode, persist = true) {
    if (!['repeat', 'repeat-one', 'shuffle'].includes(mode)) return;
    const previousMode = window.applemusicPlaybackMode;
    window.applemusicPlaybackMode = mode;

    // Shuffle the whole next cycle when the user enables shuffle.
    // Keep the current song and every queued song; never consume the queue.
    if (persist && mode === 'shuffle' && previousMode !== 'shuffle' &&
        Array.isArray(window.applemusicCurrentQueue) && window.applemusicCurrentQueue.length > 1) {
        const queue = window.applemusicCurrentQueue;
        const currentIndex = queue.findIndex(song => String(song.id) === String(window.applemusicCurrentPlayingSong?.id));
        const upcoming = currentIndex < 0 ? queue.slice() :
            [...queue.slice(currentIndex + 1), ...queue.slice(0, currentIndex)];
        for (let i = upcoming.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [upcoming[i], upcoming[j]] = [upcoming[j], upcoming[i]];
        }
        window.applemusicCurrentQueue = currentIndex < 0 ? upcoming : [queue[currentIndex], ...upcoming];
        applemusicRenderUpNextList();
        const popup = document.getElementById('applemusic-popup-list-view');
        if (popup?.style.display === 'flex') applemusicRenderPopupList();
        applemusicSchedulePlaybackPersist();
    }

    if (persist && typeof musicAppData !== 'undefined') {
        musicAppData.playbackMode = mode;
        if (typeof saveMusicAppData === 'function') saveMusicAppData();
    }

    const btnShuffle = document.getElementById('applemusic-btn-shuffle');
    const btnRepeat = document.getElementById('applemusic-btn-repeat');
    const btnRepeatOne = document.getElementById('applemusic-btn-repeat-one');
    const badge = document.getElementById('applemusic-playmode-badge');

    if(btnShuffle) btnShuffle.classList.remove('applemusic-active');
    if(btnRepeat) btnRepeat.classList.remove('applemusic-active');
    if(btnRepeatOne) btnRepeatOne.classList.remove('applemusic-active');

    // 定义三种模式的 SVG 字符串
    const svgShuffle = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" height="12" width="12"><g fill="none" fill-rule="nonzero"><path d="M0 0v16h16V0H0Zm7.604666666666667 15.505333333333333 0.007333333333333332 0.0013333333333333333 0.047333333333333324 0.023333333333333334 0.013333333333333332 0.0026666666666666666 0.009333333333333332 -0.0026666666666666666 0.047333333333333324 -0.023999999999999997c0.006666666666666666 -0.002 0.012666666666666666 0 0.016 0.004l0.0026666666666666666 0.006666666666666666 0.011333333333333334 0.2853333333333333 -0.003333333333333333 0.013333333333333332 -0.006666666666666666 0.008666666666666666 -0.06933333333333333 0.049333333333333326 -0.009999999999999998 0.0026666666666666666 -0.008 -0.0026666666666666666 -0.06933333333333333 -0.049333333333333326 -0.008 -0.010666666666666666 -0.0026666666666666666 -0.011333333333333334 0.011333333333333334 -0.2846666666666666c0.0013333333333333333 -0.006666666666666666 0.005999999999999999 -0.011333333333333334 0.010666666666666666 -0.011999999999999999Zm-0.17666666666666667 -0.07533333333333334 0.009333333333333332 0.0013333333333333333 0.12266666666666666 0.062 0.006666666666666666 0.006666666666666666 0.002 0.007333333333333332 -0.011999999999999999 0.2866666666666666 -0.003333333333333333 0.008 -0.005333333333333333 0.005333333333333333 -0.134 0.06133333333333333c-0.008 0.0026666666666666666 -0.015333333333333332 0 -0.019333333333333334 -0.005333333333333333l-0.0026666666666666666 -0.009333333333333332 0.02266666666666667 -0.4093333333333333c0.002 -0.008 0.006666666666666666 -0.013333333333333332 0.013333333333333332 -0.014666666666666665Zm0.4766666666666666 0.0013333333333333333a0.015333333333333332 0.015333333333333332 0 0 1 0.018 0.004l0.004 0.009333333333333332 0.02266666666666667 0.4093333333333333c0 0.008 -0.004666666666666666 0.013333333333333332 -0.011333333333333334 0.016l-0.009999999999999998 -0.0013333333333333333 -0.134 -0.062 -0.006666666666666666 -0.005333333333333333 -0.002 -0.007333333333333332 -0.011999999999999999 -0.2866666666666666 0.002 -0.008 0.006666666666666666 -0.006666666666666666 0.12266666666666666 -0.06133333333333333Z" stroke-width="0.6667"></path><path fill="currentColor" d="M11.867999999999999 2.122c-0.38799999999999996 -0.2033333333333333 -0.8493333333333333 0.09733333333333333 -0.8866666666666667 0.5766666666666667 -0.007333333333333332 0.08933333333333333 -0.014666666666666665 0.18999999999999997 -0.021333333333333333 0.30133333333333334a3.6666666666666665 3.6666666666666665 0 0 0 -3.2579999999999996 2.0266666666666664L7.333333333333333 5.764l-0.3686666666666667 -0.7373333333333334a3.6666666666666665 3.6666666666666665 0 0 0 -3.28 -2.0266666666666664H2.6666666666666665a1 1 0 1 0 0 2h1.0186666666666666a1.6666666666666665 1.6666666666666665 0 0 1 1.4906666666666668 0.9213333333333332L6.215333333333334 8l-1.04 2.0786666666666664A1.6666666666666665 1.6666666666666665 0 0 1 3.686 11H2.6666666666666665a1 1 0 1 0 0 2h1.0186666666666666a3.6666666666666665 3.6666666666666665 0 0 0 3.28 -2.0266666666666664L7.333333333333333 10.235999999999999l0.3686666666666667 0.7373333333333334a3.6666666666666665 3.6666666666666665 0 0 0 3.2566666666666664 2.0266666666666664c0.008 0.14266666666666666 0.016666666666666666 0.26866666666666666 0.026 0.3766666666666666 0.036 0.44733333333333336 0.456 0.704 0.84 0.5033333333333333 0.2533333333333333 -0.132 0.622 -0.3373333333333333 1.0606666666666666 -0.6226666666666667 0.44 -0.2853333333333333 0.782 -0.5406666666666666 1.0099999999999998 -0.722 0.3466666666666667 -0.27399999999999997 0.35933333333333334 -0.8106666666666666 0.03333333333333333 -1.0706666666666667a13.174 13.174 0 0 0 -1.0219999999999998 -0.7333333333333334 12.894 12.894 0 0 0 -1.0386666666666666 -0.6093333333333333c-0.38799999999999996 -0.2033333333333333 -0.8493333333333333 0.09733333333333333 -0.8866666666666667 0.5766666666666667 -0.007333333333333332 0.08933333333333333 -0.014666666666666665 0.18999999999999997 -0.021333333333333333 0.30133333333333334a1.6666666666666665 1.6666666666666665 0 0 1 -1.4693333333333334 -0.9213333333333332L8.451333333333332 8l1.04 -2.0786666666666664a1.6666666666666665 1.6666666666666665 0 0 1 1.4666666666666668 -0.9213333333333332c0.008666666666666666 0.14266666666666666 0.017333333333333333 0.26866666666666666 0.026666666666666665 0.3766666666666666 0.036 0.44733333333333336 0.456 0.704 0.84 0.5033333333333333a13 13 0 0 0 1.0606666666666666 -0.6226666666666667c0.44 -0.2853333333333333 0.782 -0.5413333333333333 1.0099999999999998 -0.722 0.3466666666666667 -0.27399999999999997 0.35933333333333334 -0.8106666666666666 0.03333333333333333 -1.0706666666666667a13.189333333333332 13.189333333333332 0 0 0 -1.0219999999999998 -0.7333333333333334 12.893333333333333 12.893333333333333 0 0 0 -1.0386666666666666 -0.6093333333333333Z" stroke-width="0.6667"></path></g></svg>`;
    const svgRepeat = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" height="12" width="12"><path d="M0.1606875 8.000725c0.0032 -3.04538125 2.471175 -5.51335 5.51655 -5.51655625h7.1860375l-0.2555 -0.254775c-0.47495625 -0.47495625 -0.25765 -1.28595 0.39115 -1.4598 0.30110625 -0.08068125 0.6223875 0.00540625 0.8428125 0.22583125L15.58380625 2.7375c0.3415875 0.3404 0.3415875 0.8935625 0 1.2339625l-1.74206875 1.74206875c-0.47495 0.47495625 -1.28595 0.25765 -1.45979375 -0.39115 -0.08068125 -0.30110625 0.0054 -0.6223875 0.22583125 -0.8428125l0.2555 -0.253325H5.6772375c-2.08359375 0.0024 -3.77208125 1.6908875 -3.77448125 3.77448125 -0.00056875 0.670525 -0.7267875 1.0889875 -1.30719375 0.75323125 -0.26890625 -0.15555625 -0.4346125 -0.44256875 -0.434875 -0.75323125Zm14.8075875 -0.8710375c-0.48106875 -0.00001875 -0.87103125 0.3899625 -0.87103125 0.8710375 -0.0024 2.08359375 -1.69089375 3.77208125 -3.7744875 3.7744875H3.136725l0.2555 -0.25478125c0.47495625 -0.47495 0.25765 -1.28595 -0.39115 -1.45979375 -0.30110625 -0.0806875 -0.6223875 0.0054 -0.8428125 0.22583125L0.4161875 12.0285375c-0.3415875 0.3404 -0.3415875 0.8935625 0 1.2339625l1.742075 1.74206875c0.47495 0.47495625 1.28595 0.25765 1.45979375 -0.39115 0.08068125 -0.30110625 -0.00540625 -0.6223875 -0.22583125 -0.8428125l-0.2555 -0.253325h7.18603125c3.04538125 -0.00320625 5.51335625 -2.471175 5.51655625 -5.51655625 0 -0.48104375 -0.3899875 -0.8710125 -0.8710375 -0.8710375Z" stroke-width="0.0625"></path></svg>`;
    const svgRepeatOne = `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 14" height="12" width="12"><g><path fill="currentColor" fill-rule="evenodd" d="M11.1089 3.15527c0 -0.30334 -0.1828 -0.57682 -0.463 -0.69291 -0.2803 -0.11608 -0.6029 -0.05192 -0.81735 0.16258L7.91542 4.53807c-0.13026 0.12728 -0.21435 0.3016 -0.22479 0.4955 -0.00211 0.03829 -0.00129 0.07684 0.00253 0.1153 0.01209 0.12286 0.05381 0.23701 0.11794 0.33521 0.11285 0.17283 0.29509 0.29625 0.50717 0.33072 0.03966 0.00649 0.08018 0.00984 0.12124 0.00984h1.91609l0.0177 0.00042c0.0189 0.0005 0.0473 0.00136 0.0828 0.00279 0.0714 0.00287 0.1697 0.00794 0.2773 0.01662 0.243 0.01962 0.4375 0.05103 0.5162 0.07927 0.2621 0.09417 0.5001 0.24513 0.6971 0.44207 0.1969 0.19695 0.3479 0.435 0.4421 0.69712 0.0941 0.26212 0.1292 0.54182 0.1026 0.81907 -0.0046 0.04763 -0.0046 0.09559 0 0.14321 0.0266 0.27725 -0.0085 0.55695 -0.1026 0.81907 -0.0942 0.26212 -0.2452 0.50018 -0.4421 0.69712 -0.197 0.19694 -0.435 0.3479 -0.6971 0.44207 -0.2622 0.09413 -0.5419 0.12923 -0.8191 0.10263 -0.0238 -0.0023 -0.0477 -0.0034 -0.0716 -0.0034 -0.36949 0 -0.77391 -0.1991 -1.26526 -0.68372 -0.49086 -0.48414 -0.9614 -1.14446 -1.48162 -1.87889l-0.0225 -0.03176 0 -0.00001c-0.49343 -0.69665 -1.03512 -1.46146 -1.62984 -2.04804 -0.59551 -0.58734 -1.34877 -1.10227 -2.28188 -1.11546 -0.48594 -0.04155 -0.97526 0.02227 -1.4345 0.18725 -0.47025 0.16894 -0.89733 0.43976 -1.250646 0.79308 -0.353321 0.35332 -0.624145 0.7804 -0.793079 1.25065 -0.1608306 0.44768 -0.2255234 0.92396 -0.19019454 1.39781 -0.03532886 0.47385 0.02936394 0.95012 0.19019454 1.39781 0.168934 0.47025 0.439758 0.89728 0.793079 1.25068 0.353316 0.3533 0.780396 0.6241 1.250646 0.793 0.46116 0.1657 0.95266 0.2294 1.4406 0.1868 0.69267 -0.0191 1.35814 -0.2755 1.88476 -0.7268 0.31452 -0.2695 0.351 -0.743 0.08147 -1.05749 -0.26952 -0.31452 -0.74299 -0.351 -1.05752 -0.08147 -0.2692 0.23068 -0.61038 0.36036 -0.96484 0.36666 -0.01946 0.0003 -0.0389 0.0014 -0.05827 0.0033 -0.27725 0.0266 -0.55695 -0.0085 -0.81907 -0.10263 -0.26212 -0.09417 -0.50017 -0.24513 -0.69712 -0.44207 -0.19694 -0.19694 -0.3479 -0.435 -0.44207 -0.69712 -0.09416 -0.26212 -0.1292 -0.54182 -0.10261 -0.81907 0.00457 -0.04762 0.00457 -0.09558 0 -0.14321 -0.02659 -0.27725 0.00845 -0.55695 0.10261 -0.81907 0.09417 -0.26212 0.24513 -0.50017 0.44207 -0.69712 0.19695 -0.19694 0.435 -0.3479 0.69712 -0.44207 0.26212 -0.09416 0.54182 -0.1292 0.81907 -0.10261 0.0238 0.00228 0.0477 0.00343 0.07161 0.00343 0.36948 0 0.7739 0.19905 1.26525 0.68367 0.49086 0.48414 0.9614 1.14446 1.48162 1.87889l0.0225 0.03177c0.49343 0.69665 1.03512 1.46146 1.62984 2.04801 0.59551 0.5874 1.34877 1.1023 2.28188 1.1155 0.4859 0.0415 0.9753 -0.0223 1.4345 -0.1873 0.4703 -0.1689 0.8973 -0.4397 1.2506 -0.793 0.3534 -0.3534 0.6242 -0.78043 0.7931 -1.25068 0.1609 -0.44769 0.2255 -0.92396 0.1902 -1.39781 0.0353 -0.47385 -0.0293 -0.95013 -0.1902 -1.39781 -0.1689 -0.47025 -0.4397 -0.89733 -0.7931 -1.25065 -0.3533 -0.35332 -0.7803 -0.62414 -1.2506 -0.79308 -0.1983 -0.07123 -0.4394 -0.11249 -0.6478 -0.13753V3.15527Z" clip-rule="evenodd" stroke-width="1"></path></g></svg>`;

    if (mode === 'shuffle' && btnShuffle) {
        btnShuffle.classList.add('applemusic-active');
        if (badge) badge.innerHTML = svgShuffle;
    } else if (mode === 'repeat' && btnRepeat) {
        btnRepeat.classList.add('applemusic-active');
        if (badge) badge.innerHTML = svgRepeat;
    } else if (mode === 'repeat-one' && btnRepeatOne) {
        btnRepeatOne.classList.add('applemusic-active');
        if (badge) badge.innerHTML = svgRepeatOne;
    }

    if (typeof window.wcSyncLivePlayMode === 'function') window.wcSyncLivePlayMode();

    // Only show a temporary mode badge for user-triggered changes.
    if (persist) applemusicShowPlaymodeBadge();
}

// ================= 播放逻辑 =================
function applemusicPlaySong(id, name, artist, cover) {
    const requestId = ++applemusicPlaybackRequestId;
    applemusicLastSeekRequest = null;
    applemusicParsedLyrics = [];
    applemusicCurrentLyricIndex = -1;
    window.applemusicCurrentPlayingSong = { id, name, artist, cover, timestamp: Date.now() };
    window.dispatchEvent(new CustomEvent('applemusic-phone-song'));
    try {
        localStorage.setItem('applemusicCurrentPlayingSong', JSON.stringify(window.applemusicCurrentPlayingSong));
        localStorage.setItem('applemusicCurrentQueue', JSON.stringify(window.applemusicCurrentQueue));
        localStorage.setItem('applemusicCurrentQueueSource', window.applemusicCurrentQueueSource);
    } catch(e) {}

    // 如果正在一起听歌，增加听歌计数
    if (window.applemusicListenTogetherContactId && typeof appSettings !== 'undefined') {
        appSettings.wc_listen_together_song_count = (appSettings.wc_listen_together_song_count || 0) + 1;
        if (typeof saveAppSettings === 'function') saveAppSettings();
    }

    applemusicCheckIsFavorite(id);
    applemusicSaveRecentPlay(window.applemusicCurrentPlayingSong);

    const miniTitle = document.getElementById('applemusic-mini-title');
    const miniCover = document.getElementById('applemusic-mini-cover');
    if(miniTitle) miniTitle.innerText = name;
    if(miniCover) miniCover.innerHTML = `<img src="${cover}" style="width:100%; height:100%; border-radius:10px; object-fit:cover;">`;

    const artistBottomTitle = document.getElementById('applemusic-artist-bottom-title');
    const artistBottomArtist = document.getElementById('applemusic-artist-bottom-artist');
    const artistBottomCover = document.getElementById('applemusic-artist-bottom-cover');
    if(artistBottomTitle) artistBottomTitle.innerText = name;
    if(artistBottomArtist) artistBottomArtist.innerText = artist;
    if(artistBottomCover) artistBottomCover.innerHTML = `<img src="${cover}" style="width:100%; height:100%; border-radius:50%; object-fit:cover;">`;

    const playlistBottomTitle = document.getElementById('applemusic-playlist-bottom-title');
    const playlistBottomArtist = document.getElementById('applemusic-playlist-bottom-artist');
    const playlistBottomCover = document.getElementById('applemusic-playlist-bottom-cover');
    if(playlistBottomTitle) playlistBottomTitle.innerText = name;
    if(playlistBottomArtist) playlistBottomArtist.innerText = artist;
    if(playlistBottomCover) playlistBottomCover.innerHTML = `<img src="${cover}" style="width:100%; height:100%; border-radius:50%; object-fit:cover;">`;

    const largeTitle = document.getElementById('applemusic-large-title');
    const largeArtist = document.getElementById('applemusic-large-artist');
    const largeCoverImg = document.getElementById('applemusic-large-cover-img');
    const playerBg = document.querySelector('.applemusic-player-bg');
    if(largeTitle) largeTitle.innerText = name;
    if(largeArtist) largeArtist.innerText = artist;
    if(largeCoverImg) largeCoverImg.src = cover;
    if(playerBg) playerBg.style.backgroundImage = `url('${cover}')`;

    const listCurrentTitle = document.getElementById('applemusic-list-current-title');
    const listCurrentArtist = document.getElementById('applemusic-list-current-artist');
    const listCurrentCover = document.getElementById('applemusic-list-current-cover');
    if(listCurrentTitle) listCurrentTitle.innerText = name;
    if(listCurrentArtist) listCurrentArtist.innerText = artist;
    if(listCurrentCover) listCurrentCover.src = cover;

    // 同步更新悬浮条和弹窗信息
    const islandCover = document.getElementById('applemusic-island-cover');
    const popupCover = document.getElementById('applemusic-popup-cover');
    const popupTitle = document.getElementById('applemusic-popup-title');
    const popupArtist = document.getElementById('applemusic-popup-artist');
    if (islandCover) islandCover.src = cover;
    if (popupCover) popupCover.src = cover;
    if (popupTitle) popupTitle.innerText = name;
    if (popupArtist) popupArtist.innerText = artist;

    const audio = document.getElementById('applemusic-audio-player');
    const baseUrl = applemusicGetApiBaseUrl();

    let isLocal = false;
    let localUrl = '';
    let localLyric = '';

    if (window.applemusicCurrentQueue) {
        const queueSong = window.applemusicCurrentQueue.find(s => String(s.id) === String(id));
        if (queueSong && queueSong.isLocal) {
            isLocal = true;
            localUrl = queueSong.url;
            localLyric = queueSong.lyric;
            window.applemusicCurrentPlayingSong = { ...queueSong, timestamp: Date.now() };
        }
    }

    if(audio) {
        // Stop the previous source before resolving the next remote URL.
        audio.pause();
        try { audio.currentTime = 0; } catch (e) {}
        if (audio.srcObject) audio.srcObject = null;
        audio.removeAttribute('src');
        audio.load();
        const playIfCurrent = (source, label) => {
            if (requestId !== applemusicPlaybackRequestId) return;
            audio.src = source;
            audio.play().catch(err => {
                if (requestId !== applemusicPlaybackRequestId) return;
                console.error(label, err);
                applemusicUpdatePlayPauseUI(true);
            });
        };
        if (isLocal) {
            playIfCurrent(localUrl, "播放失败:");
        } else if (applemusicApiConfig.type === 'builtin' && applemusicApiConfig.builtinIndex === 0) {
            // 1. 主接口播放逻辑：使用主接口并透传 Cookie，VIP 用户可畅听完整高音质歌曲
            let userCookie = '';
            if (applemusicNeteaseUser && applemusicNeteaseUser.cookie) {
                userCookie = applemusicNeteaseUser.cookie;
            } else {
                try {
                    const savedUser = localStorage.getItem('applemusicNeteaseUser');
                    if (savedUser) userCookie = JSON.parse(savedUser).cookie || '';
                } catch (e) {}
            }
            const cookieParam = userCookie ? `&cookie=${encodeURIComponent(userCookie)}` : '';

            fetch(`${baseUrl}/url?id=${id}&level=lossless${cookieParam}`)
                .then(res => res.json())
                .then(data => {
                    let playUrl = data.url;
                    if (playUrl) {
                        if (playUrl.startsWith('http:')) playUrl = playUrl.replace('http:', 'https:');
                        playIfCurrent(playUrl, "主接口播放失败:");
                    } else {
                        playIfCurrent(`https://music.163.com/song/media/outer/url?id=${id}.mp3`, "主接口兜底播放失败:");
                    }
                })
                .catch(err => {
                    if (requestId !== applemusicPlaybackRequestId) return;
                    console.error("主接口获取音源失败:", err);
                    playIfCurrent(`https://music.163.com/song/media/outer/url?id=${id}.mp3`, "兜底播放失败:");
                });
        } else if (applemusicApiConfig.type === 'builtin' && applemusicApiConfig.builtinIndex === 1) {
            // 2. 在线接口播放逻辑：使用播放源 API 畅听完整音乐
            playIfCurrent(`https://api.qijieya.cn/meting?server=netease&type=url&id=${id}`, "在线接口播放源失败:");
        }
 else if (applemusicApiConfig.type === 'builtin' && (applemusicApiConfig.builtinIndex === 2 || applemusicApiConfig.builtinIndex === 3)) {
            // 3. 备用接口 1 / 备用接口 2 播放逻辑：统一直接请求标准播放源
            fetch(`${baseUrl}/song/url?id=${id}&br=320000`)
                .then(res => res.json())
                .then(data => {
                    const u = data.data?.[0]?.url || data.url;
                    if (u) {
                        playIfCurrent(u.startsWith('http:') ? u.replace('http:', 'https:') : u, "备用接口播放失败:");
                    } else {
                        playIfCurrent(`https://music.163.com/song/media/outer/url?id=${id}.mp3`, "备用接口兜底播放失败:");
                    }
                })
                .catch(() => {
                    playIfCurrent(`https://music.163.com/song/media/outer/url?id=${id}.mp3`, "备用接口兜底播放失败:");
                });
        } else if (applemusicApiConfig.type === 'custom') {
            // 4. 自定义源播放逻辑
            let userCookie = '';
            if (applemusicNeteaseUser && applemusicNeteaseUser.cookie) {
                userCookie = applemusicNeteaseUser.cookie;
            } else {
                try {
                    const savedUser = localStorage.getItem('applemusicNeteaseUser');
                    if (savedUser) userCookie = JSON.parse(savedUser).cookie || '';
                } catch (e) {}
            }
            const cookieParam = userCookie ? `&cookie=${encodeURIComponent(userCookie)}` : '';

            fetch(`${baseUrl}/song/url?id=${id}&br=320000${cookieParam}`)
                .then(res => res.json())
                .then(data => {
                    const u = data.data?.[0]?.url || data.url;
                    if (u) {
                        playIfCurrent(u.startsWith('http:') ? u.replace('http:', 'https:') : u, "自定义源播放失败:");
                    } else {
                        playIfCurrent(`https://music.163.com/song/media/outer/url?id=${id}.mp3`, "自定义源兜底播放失败:");
                    }
                })
                .catch(err => {
                    if (requestId !== applemusicPlaybackRequestId) return;
                    console.error("自定义源请求失败:", err);
                    playIfCurrent(`https://music.163.com/song/media/outer/url?id=${id}.mp3`, "兜底播放失败:");
                });
        } else {
            playIfCurrent(`https://music.163.com/song/media/outer/url?id=${id}.mp3`, "播放失败:");
        }
    }

    applemusicUpdatePlayPauseUI(true);
    applemusicRenderUpNextList();
    const popupListView = document.getElementById('applemusic-popup-list-view');
    if (popupListView && popupListView.style.display === 'flex') {
        applemusicRenderPopupList();
    }

    // 歌词
    const lyricsTitle = document.getElementById('applemusic-lyrics-title');
    const lyricsArtist = document.getElementById('applemusic-lyrics-artist');
    const lyricsCoverImg = document.getElementById('applemusic-lyrics-cover-img');
    const lyricsContainer = document.getElementById('applemusic-lyrics-container');

    if(lyricsTitle) lyricsTitle.innerText = name;
    if(lyricsArtist) lyricsArtist.innerText = artist;
    if(lyricsCoverImg) lyricsCoverImg.src = cover;

    if(lyricsContainer) {
        lyricsContainer.innerHTML = '<div class="applemusic-lyric-line applemusic-active" style="text-align:center; margin-top:50px;">加载歌词中...</div>';
        window.dispatchEvent(new CustomEvent('applemusic-phone-lyrics'));

        if (isLocal) {
            if (localLyric && localLyric.trim() !== "") {
                applemusicParseLyrics(localLyric);
            } else {
                lyricsContainer.innerHTML = '<div class="applemusic-lyric-line applemusic-active" style="text-align:center; margin-top:50px;">纯音乐，请欣赏</div>';
                window.dispatchEvent(new CustomEvent('applemusic-phone-lyrics'));
            }
        } else if (applemusicApiConfig.type === 'builtin' && applemusicApiConfig.builtinIndex === 0) {
            // 主接口获取歌词
            fetch(`${baseUrl}/lyric?id=${id}`)
                .then(res => res.json())
                .then(data => {
                    if (requestId !== applemusicPlaybackRequestId) return;
                    const rawLrc = data.lyric || data.lrc?.lyric || "";
                    if (rawLrc && rawLrc.trim() !== "") {
                        applemusicParseLyrics(rawLrc);
                    } else {
                        lyricsContainer.innerHTML = '<div class="applemusic-lyric-line applemusic-active" style="text-align:center; margin-top:50px;">纯音乐，请欣赏</div>';
                        window.dispatchEvent(new CustomEvent('applemusic-phone-lyrics'));
                    }
                })
                .catch(err => {
                    if (requestId !== applemusicPlaybackRequestId) return;
                    console.error("主接口获取歌词失败:", err);
                    lyricsContainer.innerHTML = '<div class="applemusic-lyric-line applemusic-active" style="text-align:center; margin-top:50px;">暂无歌词</div>';
                    window.dispatchEvent(new CustomEvent('applemusic-phone-lyrics'));
                });
        } else if (applemusicApiConfig.type === 'builtin' && applemusicApiConfig.builtinIndex === 1) {
            // 在线接口获取歌词：使用播放源 API 获取
            fetch(`https://api.qijieya.cn/meting/?server=netease&type=lrc&id=${id}`)
                .then(res => res.text())
                .then(textData => {
                    if (requestId !== applemusicPlaybackRequestId) return;
                    let rawLrc = "";
                    try {
                        const jsonData = JSON.parse(textData);
                        rawLrc = jsonData.lrc?.lyric || jsonData.lyric || "";
                    } catch (e) {
                        rawLrc = textData;
                    }

                    if (rawLrc && rawLrc.trim() !== "") {
                        applemusicParseLyrics(rawLrc);
                    } else {
                        lyricsContainer.innerHTML = '<div class="applemusic-lyric-line applemusic-active" style="text-align:center; margin-top:50px;">纯音乐，请欣赏</div>';
                        window.dispatchEvent(new CustomEvent('applemusic-phone-lyrics'));
                    }
                })
                .catch(() => {
                    if (requestId !== applemusicPlaybackRequestId) return;
                    lyricsContainer.innerHTML = '<div class="applemusic-lyric-line applemusic-active" style="text-align:center; margin-top:50px;">暂无歌词</div>';
                    window.dispatchEvent(new CustomEvent('applemusic-phone-lyrics'));
                });
        }
 else {
            // 备用接口 1 / 备用接口 2 / 自定义源获取歌词
            fetch(`${baseUrl}/lyric?id=${id}`)
                .then(res => res.json())
                .then(jsonData => {
                    if (requestId !== applemusicPlaybackRequestId) return;
                    const rawLrc = jsonData.lrc?.lyric || jsonData.lyric || "";
                    if (rawLrc && rawLrc.trim() !== "") {
                        applemusicParseLyrics(rawLrc);
                    } else {
                        lyricsContainer.innerHTML = '<div class="applemusic-lyric-line applemusic-active" style="text-align:center; margin-top:50px;">纯音乐，请欣赏</div>';
                        window.dispatchEvent(new CustomEvent('applemusic-phone-lyrics'));
                    }
                })
                .catch(err => {
                    if (requestId !== applemusicPlaybackRequestId) return;
                    console.error("获取歌词失败:", err);
                    lyricsContainer.innerHTML = '<div class="applemusic-lyric-line applemusic-active" style="text-align:center; margin-top:50px;">暂无歌词</div>';
                    window.dispatchEvent(new CustomEvent('applemusic-phone-lyrics'));
                });
        }
    }

    if (typeof applemusicUpdateListenTogetherUI === 'function') {
        applemusicUpdateListenTogetherUI();
    }
}

document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'hidden') {
        applemusicPersistPlaybackState();
        const liveOverlay = document.getElementById('wcMusicLiveDetailOverlay');
        if (liveOverlay && typeof window.wcCloseMusicLiveDetailModal === 'function') {
            // Stop the detail view's background refresh while leaving audio playback alive.
            window.wcCloseMusicLiveDetailModal();
        }
    }
});
window.addEventListener('pagehide', applemusicPersistPlaybackState);

function applemusicRenderUpNextList() {
    const container = document.getElementById('applemusic-up-next-container');
    if (!container) return;

    const subtitle = document.getElementById('applemusic-up-next-subtitle');
    if (subtitle) {
        subtitle.innerText = '来自' + (window.applemusicCurrentQueueSource || '未知');
    }

    container.innerHTML = '';

    if (!window.applemusicCurrentQueue || window.applemusicCurrentQueue.length === 0) {
        container.innerHTML = '<div style="padding: 20px; text-align: center; color: rgba(255,255,255,0.5);">暂无待播歌曲</div>';
        return;
    }

    const queue = window.applemusicCurrentQueue;
    const currentIndex = queue.findIndex(song => song.id == window.applemusicCurrentPlayingSong?.id);

    // Render the full cycle without removing completed songs from the queue.
    const nextSongs = currentIndex === -1
        ? [...queue]
        : [...queue.slice(currentIndex + 1), ...queue.slice(0, currentIndex)];

    if (nextSongs.length === 0) {
        container.innerHTML = '<div style="padding: 20px; text-align: center; color: rgba(255,255,255,0.5);">当前列表只有一首歌曲</div>';
        return;
    }

    nextSongs.forEach(song => {
        const div = document.createElement('div');
        div.className = 'applemusic-list-item';
        div.onclick = () => applemusicPlaySong(song.id, song.name, song.artist, song.cover);

        div.innerHTML = `
            <img src="${song.cover}" class="applemusic-list-cover">
            <div class="applemusic-list-info">
                <div class="applemusic-list-title">${song.name}</div>
                <div class="applemusic-list-artist">${song.artist}</div>
            </div>
            <div class="applemusic-action-btn applemusic-list-star-btn" style="background: transparent;" onclick="event.stopPropagation(); applemusicToggleSpecificStar(this, '${song.id}', '${song.name.replace(/'/g, "\\'")}', '${song.artist.replace(/'/g, "\\'")}', '${song.cover}')">
                <svg class="applemusic-star-outline" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-linejoin="round" stroke-linecap="round" style="width: 20px; height: 20px;">
                    <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/>
                </svg>
                <svg class="applemusic-star-filled" style="display:none; width: 20px; height: 20px;" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M11.1 2.41c.31-.8 1.49-.8 1.8 0l2.2 5.67a1 1 0 00.83.6l6.05.46c.85.06 1.2 1.12.55 1.68l-4.64 3.97a1 1 0 00-.32 1l1.38 5.9c.2.85-.68 1.49-1.4 1.05l-5.18-3.15a1 1 0 00-1.04 0l-5.18 3.15c-.72.44-1.6-.2-1.4-1.05l1.38-5.9a1 1 0 00-.32-1L1.17 10.82c-.65-.56-.3-1.62.55-1.68l6.05-.46a1 1 0 00.83-.6l2.2-5.67z"/>
                </svg>
            </div>
        `;
        container.appendChild(div);
        applemusicCheckSpecificIsFavorite(song.id, div.querySelector('.applemusic-list-star-btn'));
    });
}


/* Character-phone playback uses this music app's selected source and audio engine. */
// Role song matching reuses the host music catalog and the exact cover/singer helpers.
async function applemusicFindCharacterPhoneSong(title, artist = '', signal) {
    // The host music App supplies searching, song metadata, cover art and playback.
    // Character-phone matching prefers the requested title; artist is a ranking hint,
    // not an exact-match requirement (aliases, collaborations and punctuation vary).
    const normalize = value => String(value || '').normalize('NFKC').toLocaleLowerCase()
        .replace(/[\s\u200b-\u200d\ufeff·•.,，。!！?？()（）[\]【】《》"'‘’“”:：/／&＆+\-–—_|]/g, '');
    const stripVersion = value => String(value || '').normalize('NFKC')
        .replace(/\s*[\(\[【]\s*(?:live|remix|remaster(?:ed)?|edit|version|cover|feat\.?|ft\.?|instrumental|acoustic|demo|single|radio|dj|原唱|现场|录音室|纯享|伴奏|翻唱|混音|重制|特别版|纯音乐)[^)\]】]*[)\]】]\s*$/ig, '')
        .replace(/\s*[-–—|]\s*(?:live|remix|remaster(?:ed)?|edit|version|cover|feat\.?|ft\.?|instrumental|acoustic|demo|dj|原唱|现场|伴奏|翻唱|混音|重制)[\s\S]*$/ig, '');
    const target = normalize(title), targetCore = normalize(stripVersion(title));
    if (!target) throw new Error('歌曲名称为空');
    const titlePoints = name => {
        const exact = normalize(name), core = normalize(stripVersion(name));
        if (exact === target) return 400;
        if (core && core === targetCore) return 360;
        if (core && targetCore && targetCore.length >= 2) {
            const shorter = Math.min(core.length, targetCore.length);
            const longer = Math.max(core.length, targetCore.length);
            if (shorter / longer >= 0.6 && (core.startsWith(targetCore) || targetCore.startsWith(core))) return 260;
            if (shorter >= 3 && shorter / longer >= 0.65 &&
                (core.includes(targetCore) || targetCore.includes(core))) return 190;
        }
        return 0;
    };
    const artistParts = name => {
        const values = [normalize(name), ...String(name || '').split(/[,，、/／&＆|;；+]|(?:\bfeat\.?\b|\bft\.?\b)/i).map(normalize)];
        return [...new Set(values.filter(Boolean))];
    };
    const desiredArtists = artistParts(artist);
    const artistPoints = name => {
        if (!desiredArtists.length) return 0;
        const actualArtists = artistParts(name);
        if (desiredArtists[0] === actualArtists[0]) return 64;
        if (desiredArtists.some(wanted => actualArtists.includes(wanted))) return 56;
        if (desiredArtists.some(wanted => wanted.length >= 2 &&
            actualArtists.some(actual => actual.length >= 2 &&
                (actual.includes(wanted) || wanted.includes(actual))))) return 30;
        return 0;
    };
    const candidates = new Map();
    const addResults = items => {
        for (const item of items) {
            const id = item.id ?? item.songid ?? item.mid;
            if (id == null) continue;
            const name = String(item.name || item.title || '').trim();
            const titleScore = titlePoints(name);
            if (!titleScore) continue; // Never play an unrelated title just to match a singer.
            const matchedArtist = applemusicGetSongArtist(item);
            const singerScore = artistPoints(matchedArtist);
            const song = {id, name, artist:matchedArtist, cover:applemusicGetSongCover(item,true)};
            const ranked = {song, titleScore, singerScore, score:titleScore+singerScore};
            const key = String(id);
            if (!candidates.has(key) || candidates.get(key).score < ranked.score) candidates.set(key,ranked);
        }
    };
    const best = () => [...candidates.values()].sort((a,b) =>
        b.score-a.score || b.titleScore-a.titleScore)[0];
    const search = async keywords => {
        const result = await applemusicSearchCatalog(keywords,'1',{signal});
        addResults(result);
    };
    const combinedQuery = [String(title || '').trim(),String(artist || '').trim()]
        .filter(Boolean).join(' ');
    let initialError = null;
    try {
        await search(combinedQuery);
    } catch (error) {
        if (signal?.aborted) throw error;
        initialError = error;
    }
    // Search by title alone if the joint search failed or artist variants did not
    // match. Prefer the better singer in ambiguous results, but accept title-only.
    const first = best();
    if ((!first || (desiredArtists.length && first.singerScore < 56)) && !signal?.aborted) {
        const titleQuery = String(stripVersion(title) || title).trim();
        if (titleQuery && titleQuery !== combinedQuery) {
            try {
                await search(titleQuery);
            } catch (error) {
                if (signal?.aborted) throw error;
                if (!first && !initialError) initialError = error;
            }
        }
    }
    if (signal?.aborted) throw new DOMException('已取消', 'AbortError');
    const matched = best();
    if (!matched) throw new Error('当前音乐源没有找到歌名相近的歌曲，请检查歌名或切换音乐源');
    return matched.song;
}
window.applemusicCharacterPhone = {
    sourceKey() {
        return JSON.stringify([applemusicApiConfig.type,applemusicApiConfig.builtinIndex,applemusicApiConfig.customUrl]);
    },
    findSong: applemusicFindCharacterPhoneSong,
    getAudio() { return document.getElementById('applemusic-audio-player'); },
    getQueue() { return window.applemusicCurrentQueue || []; },
    getLargeCover(song) {
        // Use the original music App's cover URL, requesting a sharper NetEase thumbnail.
        const source = String(song?.cover || '').trim();
        if (!source) return '';
        try {
            const url = new URL(source, window.location.href);
            if ((url.protocol === 'https:' || url.protocol === 'http:') &&
                (url.searchParams.has('param') || /(^|\.)music\.126\.net$/i.test(url.hostname))) {
                url.searchParams.set('param', '1200y1200');
            }
            return url.href;
        } catch (_) { return source; }
    },
    getState() {
        const audio = this.getAudio();
        return {song:window.applemusicCurrentPlayingSong,queueSource:window.applemusicCurrentQueueSource,
            paused:audio?.paused ?? true,currentTime:audio?.currentTime || 0,
            duration:Number.isFinite(audio?.duration) ? audio.duration : 0,
            mode:window.applemusicPlaybackMode,lyrics:applemusicParsedLyrics.slice(),
            lyricIndex:applemusicLyricIndexAt(audio?.currentTime || 0),
            lyricMessage:applemusicParsedLyrics.length ? '' : (document.getElementById('applemusic-lyrics-container')?.textContent || '')};
    },
    play(song, queue, sourceName) {
        window.applemusicCurrentQueue = queue && queue.length ? queue.slice() : [song];
        window.applemusicCurrentQueueSource = sourceName;
        applemusicPlaySong(song.id,song.name,song.artist,song.cover);
    },
    updateQueue(queue, sourceName) {
        if (window.applemusicCurrentQueueSource !== sourceName) return;
        const current = window.applemusicCurrentPlayingSong;
        if (current && queue.some(song => String(song.id) === String(current.id))) {
            window.applemusicCurrentQueue = queue.slice();
            applemusicPersistPlaybackState();
        }
    },
    toggle() { applemusicTogglePlayPause(); },
    next() { applemusicPlayNextSong(); },
    previous() { applemusicPlayPrevSong(); },
    seek(time) {
        return applemusicSeekToPosition(time);
    }
};

// ================= 搜索逻辑 =================
// One catalog search path for the host music App and character phone.
async function applemusicSearchCatalog(keyword, type = '1', options = {}) {
    const apiUrl = applemusicGetApiBaseUrl();
    const encoded = encodeURIComponent(keyword);
    const cookie = applemusicNeteaseUser?.cookie || '';
    const cookieParam = cookie ? '&cookie=' + encodeURIComponent(cookie) : '';
    const selected = applemusicApiConfig;
    const endpoints = selected.type === 'builtin' && selected.builtinIndex === 0
        ? [apiUrl + '/search?keywords=' + encoded + '&limit=30' + cookieParam]
        : selected.type === 'builtin' && selected.builtinIndex === 1
        ? ['https://api.qijieya.cn/meting?server=netease&type=search&id=' + encoded,
           'https://163api.qijieya.cn/cloudsearch?keywords=' + encoded + '&type=' + type,
           'https://zm.wwoyun.cn/cloudsearch?keywords=' + encoded + '&type=' + type]
        : [apiUrl + '/cloudsearch?keywords=' + encoded + '&type=' + type + cookieParam];
    const parse = async endpoint => {
        const response = await fetch(endpoint, {signal:options.signal});
        if (!response.ok) throw new Error('Music search HTTP ' + response.status);
        const data = await response.json();
        const rows = type === '100'
            ? (data.result?.artists || data.data?.artists || data.artists || [])
            : (data.result?.songs || data.data?.songs || data.data?.list
                || (Array.isArray(data.data) ? data.data : null)
                || (Array.isArray(data) ? data : data.songs) || []);
        if (!Array.isArray(rows) || !rows.length) throw new Error('No music search results');
        return rows;
    };
    // Preserve the online source's parallel fallback.
    return Promise.any(endpoints.map(parse));
}

let applemusicSearchViewRequest = 0;
function applemusicPerformSearch(keyword) {
    const recentSearchSection = document.getElementById('applemusic-recent-search-section');
    const searchResultsSection = document.getElementById('applemusic-search-results-section');
    const searchResultsList = document.getElementById('applemusic-search-results-list');
    if (recentSearchSection) recentSearchSection.style.display = 'none';
    if (searchResultsSection) searchResultsSection.style.display = 'block';
    if (searchResultsList) searchResultsList.innerHTML =
        '<div style="padding:20px;color:#8e8e93;">★(>ω<)!!♪正在努力搜索中...</div>';
    const requestedType = applemusicCurrentSearchType;
    // The original primary source always returned songs, even in the artist tab.
    const resultType = applemusicApiConfig.type === 'builtin' && applemusicApiConfig.builtinIndex === 0
        ? '1' : requestedType;
    const request = ++applemusicSearchViewRequest;
    applemusicSearchCatalog(keyword, resultType).then(items => {
        if (request !== applemusicSearchViewRequest) return;
        applemusicRenderSearchResults(items, resultType === '100' ? 'artist' : 'song');
    }).catch(error => {
        if (request !== applemusicSearchViewRequest) return;
        console.error('Music search failed:', error);
        if (searchResultsList) searchResultsList.innerHTML =
            '<div style="padding:20px;color:#8e8e93;text-align:center;line-height:1.6;">搜索歌曲失败，请尝试更换音乐源</div>';
    });
}

const applemusicGetSongArtist = (item) => {
        if (Array.isArray(item.ar)) return item.ar.map(a => a.name).filter(Boolean).join(', ') || '未知歌手';
        if (Array.isArray(item.artists)) return item.artists.map(a => a.name).filter(Boolean).join(', ') || '未知歌手';
        if (typeof item.artist === 'string' && item.artist) return item.artist;
        if (typeof item.author === 'string' && item.author) return item.author;
        return '未知歌手';
    };

    const applemusicGetSongCover = (item, isHigh = false) => {
        let pic = '';
        if (item.al && item.al.picUrl) pic = item.al.picUrl;
        else if (item.album && item.album.picUrl) pic = item.album.picUrl;
        else if (item.album && item.album.coverUrl) pic = item.album.coverUrl;
        else if (item.album && item.album.pic) pic = item.album.pic;
        else if (item.pic) pic = item.pic;
        else if (item.cover) pic = item.cover;
        else if (item.coverUrl) pic = item.coverUrl;
        else if (item.picUrl) pic = item.picUrl;
        else if (item.img) pic = item.img;
        else if (item.picture) pic = item.picture;

        // 若接口返回的封面为空，自动使用官方高解析图片服务兜底
        const songId = item.id || item.songid || item.mid;
        if (!pic && songId) {
            pic = `https://api.qijieya.cn/meting/?server=netease&type=pic&id=${songId}`;
        }

        if (!pic) return 'https://images.unsplash.com/photo-1614680376593-902f74cf0d41?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80';
        if (pic.startsWith('http:')) pic = pic.replace('http:', 'https:');
        if (pic.includes('param=') || pic.includes('meting')) return pic;
        return pic + (isHigh ? '?param=500y500' : '?param=100y100');
    };


function applemusicRenderSearchResults(items, type) {
    const searchResultsList = document.getElementById('applemusic-search-results-list');
    if(!searchResultsList) return;
    searchResultsList.innerHTML = '';

    // Browsing search results must not replace the active playback queue.
    const searchQueue = type === 'song' ? items.map(item => ({
        id: item.id || item.songid || item.mid,
        name: item.name || item.title || '未知歌名',
        artist: applemusicGetSongArtist(item),
        cover: applemusicGetSongCover(item, true)
    })) : [];
    window.applemusicSearchResultsQueue = searchQueue;

    items.forEach((item) => {
        const div = document.createElement('div');
        div.className = 'applemusic-chart-item';
        div.style.cursor = 'pointer';
        div.style.padding = '10px 0';

        if (type === 'song') {
            const songId = item.id || item.songid || item.mid;
            const songName = item.name || item.title || '未知歌名';
            const artistName = applemusicGetSongArtist(item);
            const thumbCover = applemusicGetSongCover(item, false);
            const highResCover = applemusicGetSongCover(item, true);

            div.innerHTML = `
                <img src="${thumbCover}" style="width: 46px; height: 46px; border-radius: 6px; margin-right: 14px; object-fit: cover; background: rgba(0,0,0,0.05); flex-shrink: 0;">
                <div class="applemusic-chart-name" style="flex: 1; overflow: hidden;">
                    <div style="font-size: 16px; font-weight: 600; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">${songName}</div>
                    <div style="font-size: 13px; color: #8e8e93; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; margin-top: 2px;">${artistName}</div>
                </div>
                <div class="applemusic-btn-more" style="padding: 0 0 0 12px; color: #8e8e93; display: flex; align-items: center;" onclick="event.stopPropagation(); applemusicOpenSongMoreMenu(event, '${songId}', 'search')">
                    <svg viewBox="0 0 24 24" style="width: 20px; height: 20px; fill: currentColor;"><path d="M6 10c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm12 0c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm-6 0c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z"/></svg>
                </div>
            `;
            div.onclick = () => {
                window.applemusicCurrentQueue = searchQueue.slice();
                window.applemusicCurrentQueueSource = '搜索';
                applemusicPlaySong(songId, songName, artistName, highResCover);
            };
        } else if (type === 'artist') {
            let rawPic = item.picUrl || item.img1v1Url || item.pic || item.avatar || '';
            if (rawPic && rawPic.startsWith('http:')) rawPic = rawPic.replace('http:', 'https:');
            const artistPic = rawPic ? (rawPic.includes('param=') ? rawPic : rawPic + '?param=100y100') : '';

            div.innerHTML = `
                <img src="${artistPic}" style="width: 50px; height: 50px; border-radius: 50%; margin-right: 14px; object-fit: cover; background: rgba(0,0,0,0.05); flex-shrink: 0;">
                <div class="applemusic-chart-name" style="flex: 1; overflow: hidden;">
                    <div style="font-size: 16px; font-weight: 600; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">${item.name}</div>
                    <div style="font-size: 13px; color: #8e8e93; margin-top: 2px;">歌手</div>
                </div>
            `;
            div.onclick = () => {
                window.applemusicArtistBackView = 'search';
                applemusicOpenArtistProfile(item.id, item.name, artistPic);
            };
        }

        searchResultsList.appendChild(div);
    });
}

// ================= IndexedDB 数据库操作 =================
function applemusicInitDB() {
    if (typeof applemusicLoadAllData === 'function') {
        applemusicLoadAllData();
    }
}

function applemusicLoadAllData() {
    if (typeof musicAppData === 'undefined') return;
    if (!musicAppData.pinnedItems) musicAppData.pinnedItems = []; // 确保字段存在
    applemusicToggleUpNextMode(musicAppData.playbackMode || 'repeat', false);
    try {
        const savedUser = localStorage.getItem('applemusicNeteaseUser');
        if (savedUser) applemusicNeteaseUser = JSON.parse(savedUser);
    } catch(e) {}
    applemusicLoadSearchHistory();
    applemusicLoadRecentPlays();
    applemusicLoadFavoriteCount();
    applemusicLoadCustomPlaylists();
    applemusicLoadFavoriteArtistCount();
    applemusicRenderPinnedItems(); // 渲染置顶
    applemusicRenderProfileAvatar(); // 新增：渲染自定义头像
    applemusicRenderAccountCards(); // 渲染装扮卡片
    applemusicRenderFeaturedCards(); // 渲染首页专属精选卡片
    applemusicUpdateNeteaseUserUI(); // 刷新网易云登录与VIP状态
}

function applemusicSaveSearchHistory(keyword) {
    if (typeof musicAppData === 'undefined') return;
    const index = musicAppData.searchHistory.findIndex(item => item.keyword === keyword);
    if (index !== -1) {
        musicAppData.searchHistory.splice(index, 1);
    }
    musicAppData.searchHistory.push({ keyword: keyword, timestamp: Date.now() });
    if (typeof saveMusicAppData === 'function') saveMusicAppData();
    applemusicLoadSearchHistory();
}

function applemusicLoadSearchHistory() {
    if (typeof musicAppData === 'undefined') return;
    const history = [...musicAppData.searchHistory].sort((a, b) => b.timestamp - a.timestamp);
    const recentSearchList = document.getElementById('applemusic-recent-search-list');
    if(!recentSearchList) return;
    recentSearchList.innerHTML = '';
    history.forEach(item => {
        const div = document.createElement('div');
        div.className = 'applemusic-recent-search-item';
        div.innerHTML = `
            <svg class="applemusic-recent-search-icon" viewBox="0 0 24 24"><path d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"/></svg>
            <div class="applemusic-recent-search-text">${item.keyword}</div>
            <div class="applemusic-recent-search-delete" onclick="applemusicDeleteSearchHistory('${item.keyword}', this)">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M12 22C6.47715 22 2 17.5228 2 12C2 6.47715 6.47715 2 12 2C17.5228 2 22 6.47715 22 12C22 17.5228 17.5228 22 12 22ZM12 10.5858L9.17157 7.75736L7.75736 9.17157L10.5858 12L7.75736 14.8284L9.17157 16.2426L12 13.4142L14.8284 16.2426L16.2426 14.8284L13.4142 12L16.2426 9.17157L14.8284 7.75736L12 10.5858Z"></path></svg>
            </div>
        `;
        div.onclick = (e) => {
            if(!e.target.closest('.applemusic-recent-search-delete')) {
                const searchInput = document.getElementById('applemusic-search-input');
                if(searchInput) searchInput.value = item.keyword;
                applemusicPerformSearch(item.keyword);
            }
        };
        recentSearchList.appendChild(div);
    });
    applemusicBindLongPressEvent();
}

function applemusicDeleteSearchHistory(keyword, element) {
    if (typeof musicAppData === 'undefined') return;
    musicAppData.searchHistory = musicAppData.searchHistory.filter(item => item.keyword !== keyword);
    if (typeof saveMusicAppData === 'function') saveMusicAppData();
    element.parentElement.remove();
}

function applemusicSaveRecentPlay(song) {
    if (typeof musicAppData === 'undefined') return;
    const index = musicAppData.recentPlays.findIndex(item => item.id === song.id);
    if (index !== -1) {
        musicAppData.recentPlays.splice(index, 1);
    }
    song.timestamp = Date.now();
    musicAppData.recentPlays.push(song);
    if (typeof saveMusicAppData === 'function') saveMusicAppData();
    applemusicLoadRecentPlays();
}

function applemusicLoadRecentPlays() {
    if (typeof musicAppData === 'undefined') return;
    const plays = [...musicAppData.recentPlays].sort((a, b) => b.timestamp - a.timestamp);
    const recentPlayList = document.getElementById('applemusic-recent-play-list');
    if(!recentPlayList) return;
    recentPlayList.innerHTML = '';
    plays.forEach(song => {
        const div = document.createElement('div');
        div.className = 'applemusic-song-item';
        div.onclick = () => {
            window.applemusicCurrentQueue = plays;
            window.applemusicCurrentQueueSource = '最近听歌';
            applemusicPlaySong(song.id, song.name, song.artist, song.cover);
        };
        div.innerHTML = `
            <div class="applemusic-song-cover" style="background-image: url('${song.cover}');"></div>
            <div class="applemusic-song-info">
                <div class="applemusic-song-name">${song.name}</div>
                <div class="applemusic-song-artist">${song.artist}</div>
            </div>
        `;
        recentPlayList.appendChild(div);
    });
}

function applemusicBindLongPressEvent() {
    const recentItems = document.querySelectorAll('.applemusic-recent-search-item');
    let pressTimer;

    recentItems.forEach(item => {
        const startPress = () => {
            pressTimer = setTimeout(() => {
                document.querySelectorAll('.applemusic-recent-search-item').forEach(el => {
                    el.classList.add('applemusic-edit-mode');
                });
            }, 500);
        };

        const cancelPress = () => {
            clearTimeout(pressTimer);
        };

        item.addEventListener('touchstart', startPress);
        item.addEventListener('touchend', cancelPress);
        item.addEventListener('touchmove', cancelPress);

        item.addEventListener('mousedown', startPress);
        item.addEventListener('mouseup', cancelPress);
        item.addEventListener('mouseleave', cancelPress);
    });

    document.addEventListener('click', (e) => {
        if (!e.target.closest('.applemusic-recent-search-item')) {
            document.querySelectorAll('.applemusic-recent-search-item').forEach(el => {
                el.classList.remove('applemusic-edit-mode');
            });
        }
    });
}

// ================= 收藏逻辑 =================
function applemusicToggleStar(el) {
    if (!window.applemusicCurrentPlayingSong) {
        alert("请先播放一首歌曲");
        return;
    }

    el.classList.toggle('applemusic-active');
    const outline = el.querySelector('.applemusic-star-outline');
    const filled = el.querySelector('.applemusic-star-filled');
    const isActive = el.classList.contains('applemusic-active');

    if (isActive) {
        if(outline) outline.style.display = 'none';
        if(filled) filled.style.display = 'block';
        applemusicSaveFavoriteSong(window.applemusicCurrentPlayingSong);
    } else {
        if(outline) outline.style.display = 'block';
        if(filled) filled.style.display = 'none';
        applemusicRemoveFavoriteSong(window.applemusicCurrentPlayingSong.id);
    }

    document.querySelectorAll('.applemusic-star-btn').forEach(btn => {
        if (btn !== el) {
            if (isActive) {
                btn.classList.add('applemusic-active');
                const o = btn.querySelector('.applemusic-star-outline');
                const f = btn.querySelector('.applemusic-star-filled');
                if(o) o.style.display = 'none';
                if(f) f.style.display = 'block';
            } else {
                btn.classList.remove('applemusic-active');
                const o = btn.querySelector('.applemusic-star-outline');
                const f = btn.querySelector('.applemusic-star-filled');
                if(o) o.style.display = 'block';
                if(f) f.style.display = 'none';
            }
        }
    });
}

function applemusicSaveFavoriteSong(song) {
    if (typeof musicAppData === 'undefined') return;
    const index = musicAppData.favoriteSongs.findIndex(item => item.id === song.id);
    if (index === -1) {
        musicAppData.favoriteSongs.push(song);
        if (typeof saveMusicAppData === 'function') saveMusicAppData();
        applemusicLoadFavoriteCount();
    }
}

function applemusicRemoveFavoriteSong(id) {
    if (typeof musicAppData === 'undefined') return;
    musicAppData.favoriteSongs = musicAppData.favoriteSongs.filter(item => item.id !== id);
    if (typeof saveMusicAppData === 'function') saveMusicAppData();
    applemusicLoadFavoriteCount();
}

function applemusicLoadFavoriteCount() {
    if (typeof musicAppData === 'undefined') return;
    window.applemusicFavoriteSongsCount = musicAppData.favoriteSongs.length;
}

function applemusicCheckIsFavorite(id) {
    if (typeof musicAppData === 'undefined') return;
    const isFav = musicAppData.favoriteSongs.some(item => item.id === id);
    document.querySelectorAll('.applemusic-star-btn:not(#applemusic-view-artist .applemusic-star-btn)').forEach(btn => {
        if (isFav) {
            btn.classList.add('applemusic-active');
            const o = btn.querySelector('.applemusic-star-outline');
            const f = btn.querySelector('.applemusic-star-filled');
            if(o) o.style.display = 'none';
            if(f) f.style.display = 'block';
        } else {
            btn.classList.remove('applemusic-active');
            const o = btn.querySelector('.applemusic-star-outline');
            const f = btn.querySelector('.applemusic-star-filled');
            if(o) o.style.display = 'block';
            if(f) f.style.display = 'none';
        }
    });
}

function applemusicToggleSpecificStar(el, id, name, artist, cover) {
    const isActive = el.classList.contains('applemusic-active');
    const outline = el.querySelector('.applemusic-star-outline');
    const filled = el.querySelector('.applemusic-star-filled');

    if (!isActive) {
        el.classList.add('applemusic-active');
        if(outline) outline.style.display = 'none';
        if(filled) filled.style.display = 'block';
        applemusicSaveFavoriteSong({id, name, artist, cover, timestamp: Date.now()});
    } else {
        el.classList.remove('applemusic-active');
        if(outline) outline.style.display = 'block';
        if(filled) filled.style.display = 'none';
        applemusicRemoveFavoriteSong(id);
    }

    if (window.applemusicCurrentPlayingSong && window.applemusicCurrentPlayingSong.id == id) {
        applemusicCheckIsFavorite(id);
    }
}

function applemusicCheckSpecificIsFavorite(id, el) {
    if (typeof musicAppData === 'undefined' || !el) return;
    const isFav = musicAppData.favoriteSongs.some(item => item.id === id);
    if (isFav) {
        el.classList.add('applemusic-active');
        const o = el.querySelector('.applemusic-star-outline');
        const f = el.querySelector('.applemusic-star-filled');
        if(o) o.style.display = 'none';
        if(f) f.style.display = 'block';
    }
}

function applemusicToggleArtistStar(el) {
    if (!window.applemusicCurrentArtist) return;

    el.classList.toggle('applemusic-active');
    const outline = el.querySelector('.applemusic-star-outline');
    const filled = el.querySelector('.applemusic-star-filled');
    const isActive = el.classList.contains('applemusic-active');

    if (isActive) {
        if(outline) outline.style.display = 'none';
        if(filled) filled.style.display = 'block';
        applemusicSaveFavoriteArtist(window.applemusicCurrentArtist);
    } else {
        if(outline) outline.style.display = 'block';
        if(filled) filled.style.display = 'none';
        applemusicRemoveFavoriteArtist(window.applemusicCurrentArtist.id);
    }
}

function applemusicSaveFavoriteArtist(artist) {
    if (typeof musicAppData === 'undefined') return;
    const index = musicAppData.favoriteArtists.findIndex(item => item.id === artist.id);
    if (index === -1) {
        musicAppData.favoriteArtists.push(artist);
        if (typeof saveMusicAppData === 'function') saveMusicAppData();
        applemusicLoadFavoriteArtistCount();
    }
}

function applemusicRemoveFavoriteArtist(id) {
    if (typeof musicAppData === 'undefined') return;
    musicAppData.favoriteArtists = musicAppData.favoriteArtists.filter(item => item.id !== id);
    if (typeof saveMusicAppData === 'function') saveMusicAppData();
    applemusicLoadFavoriteArtistCount();
}

function applemusicLoadFavoriteArtistCount() {
    if (typeof musicAppData === 'undefined') return;
    window.applemusicFavoriteArtistsCount = musicAppData.favoriteArtists.length;
}

function applemusicCheckIsFavoriteArtist(id) {
    if (typeof musicAppData === 'undefined') return;
    const isFav = musicAppData.favoriteArtists.some(item => item.id === id);
    const btn = document.querySelector('#applemusic-view-artist .applemusic-star-btn');
    if(btn) {
        if (isFav) {
            btn.classList.add('applemusic-active');
            const o = btn.querySelector('.applemusic-star-outline');
            const f = btn.querySelector('.applemusic-star-filled');
            if(o) o.style.display = 'none';
            if(f) f.style.display = 'block';
        } else {
            btn.classList.remove('applemusic-active');
            const o = btn.querySelector('.applemusic-star-outline');
            const f = btn.querySelector('.applemusic-star-filled');
            if(o) o.style.display = 'block';
            if(f) f.style.display = 'none';
        }
    }
}

// ================= 歌手专属业务逻辑 =================
function applemusicToggleArtistPlay() {
    if (!window.applemusicArtistBrowseQueue || window.applemusicArtistBrowseQueue.length === 0) {
        if (typeof showToast === 'function') showToast('暂无歌手歌曲可播放');
        return;
    }

    const audio = document.getElementById('applemusic-audio-player');
    const isCurrentArtistQueue = window.applemusicCurrentArtist && window.applemusicCurrentQueueSource === window.applemusicCurrentArtist.name;

    if (audio && isCurrentArtistQueue && window.applemusicCurrentPlayingSong) {
        if (audio.paused) {
            audio.play();
            applemusicUpdatePlayPauseUI(false);
        } else {
            audio.pause();
            applemusicUpdatePlayPauseUI(true);
        }
    } else {
        window.applemusicCurrentQueue = window.applemusicArtistBrowseQueue.slice();
        window.applemusicCurrentQueueSource = window.applemusicCurrentArtist.name;
        const firstSong = window.applemusicCurrentQueue[0];
        applemusicPlaySong(firstSong.id, firstSong.name, firstSong.artist, firstSong.cover);
        applemusicOpenPlayer();
    }
}

function applemusicPlayArtistAllSongs() {
    applemusicToggleArtistPlay();
}

function applemusicPlayArtistHotSong() {
    if (!window.applemusicArtistBrowseQueue || window.applemusicArtistBrowseQueue.length === 0) {
        if (typeof showToast === 'function') showToast('暂无热门单曲');
        return;
    }
    window.applemusicCurrentQueue = window.applemusicArtistBrowseQueue.slice();
    window.applemusicCurrentQueueSource = window.applemusicCurrentArtist.name;
    const hotSong = window.applemusicCurrentQueue[0];
    applemusicPlaySong(hotSong.id, hotSong.name, hotSong.artist, hotSong.cover);
    applemusicOpenPlayer();
}

function applemusicOpenArtistBio() {
    if (!window.applemusicCurrentArtist) return;
    const artistId = window.applemusicCurrentArtist.id;
    const artistName = window.applemusicCurrentArtist.name;
    const artistPic = window.applemusicCurrentArtist.pic;

    const modal = document.getElementById('applemusic-artist-bio-modal');
    const nameEl = document.getElementById('applemusic-artist-bio-name');
    const avatarEl = document.getElementById('applemusic-artist-bio-avatar');
    const descEl = document.getElementById('applemusic-artist-bio-desc');

    if (nameEl) nameEl.innerText = artistName;
    if (avatarEl) avatarEl.src = artistPic || '';
    if (descEl) descEl.innerText = '正在加载歌手简介...';

    if (modal) {
        modal.style.display = 'flex';
        requestAnimationFrame(() => modal.classList.add('applemusic-active'));
    }

    const baseUrl = applemusicGetApiBaseUrl();
    fetch(`${baseUrl}/artist/desc?id=${artistId}`)
        .then(res => res.json())
        .then(data => {
            let desc = (data && data.briefDesc) ? data.briefDesc : '';
            if (!desc && data && data.introduction && data.introduction.length > 0) {
                desc = data.introduction.map(item => (item.ti ? item.ti + '\n' : '') + item.txt).join('\n\n');
            }
            if (!desc) {
                return fetch(`${baseUrl}/artist/detail?id=${artistId}`)
                    .then(r => r.json())
                    .then(d2 => {
                        const detailDesc = d2?.data?.artist?.briefDesc || '暂无歌手详细简介';
                        if (descEl) descEl.innerText = detailDesc;
                    });
            } else {
                if (descEl) descEl.innerText = desc;
            }
        })
        .catch(() => {
            if (descEl) descEl.innerText = '暂无歌手详细简介';
        });
}

function applemusicCloseArtistBioModal() {
    const modal = document.getElementById('applemusic-artist-bio-modal');
    if (modal) {
        modal.classList.remove('applemusic-active');
        setTimeout(() => { modal.style.display = 'none'; }, 300);
    }
}

async function applemusicShareArtist() {
    if (!window.applemusicCurrentArtist) {
        if (typeof showToast === 'function') showToast('请先选择歌手');
        return;
    }
    const artist = window.applemusicCurrentArtist;
    const artistObj = {
        id: artist.id,
        name: artist.name,
        artist: '艺人',
        cover: artist.pic
    };
    applemusicShareSong(artistObj);
}

function applemusicOpenArtistMoreMenu(event) {
    const overlay = document.getElementById('applemusicArtistMoreMenuOverlay');
    const menu = document.getElementById('applemusicArtistMoreMenu');
    if (!overlay || !menu || !window.applemusicCurrentArtist) return;

    overlay.style.display = 'block';

    const favText = document.getElementById('applemusic-artist-menu-fav-text');
    const isFav = typeof musicAppData !== 'undefined' && musicAppData.favoriteArtists && musicAppData.favoriteArtists.some(item => item.id == window.applemusicCurrentArtist.id);
    if (favText) favText.innerText = isFav ? '取消收藏艺人' : '收藏艺人';

    const rect = event.currentTarget.getBoundingClientRect();
    let top = rect.bottom + 10;
    let left = rect.right - 220;
    if (left < 10) left = 10;
    if (top + 200 > window.innerHeight) {
        top = rect.top - 210;
        menu.style.transformOrigin = 'bottom right';
    } else {
        menu.style.transformOrigin = 'top right';
    }
    menu.style.top = top + 'px';
    menu.style.left = left + 'px';
}

function applemusicCloseArtistMoreMenu() {
    const overlay = document.getElementById('applemusicArtistMoreMenuOverlay');
    if (overlay) overlay.style.display = 'none';
}

function applemusicArtistMenuToggleStar() {
    applemusicCloseArtistMoreMenu();
    const btn = document.querySelector('#applemusic-view-artist .applemusic-star-btn');
    if (btn) {
        applemusicToggleArtistStar(btn);
    }
}

// ================= 艺人编辑与导入音乐逻辑 =================
let applemusicEditingArtistData = null;
let applemusicSelectedArtistSongsForDelete = new Set();
let applemusicArtistImportSelectedSongIds = new Set();

function applemusicOpenEditArtistModal() {
    if (!window.applemusicCurrentArtist) return;
    const artist = window.applemusicCurrentArtist;

    applemusicEditingArtistData = {
        id: artist.id,
        name: artist.name,
        pic: artist.pic,
        songs: JSON.parse(JSON.stringify(window.applemusicCurrentQueue || []))
    };
    applemusicSelectedArtistSongsForDelete.clear();

    const modal = document.getElementById('applemusic-modal-edit-artist');
    const nameInput = document.getElementById('applemusic-edit-artist-name');
    const coverImg = document.getElementById('applemusic-edit-artist-cover');

    if (nameInput) nameInput.value = artist.name;
    if (coverImg) {
        coverImg.src = artist.pic || '';
        coverImg.style.display = 'block';
    }

    applemusicRenderEditArtistSongList();
    if (modal) modal.classList.add('applemusic-active');
}

function applemusicCloseEditArtistModal() {
    const modal = document.getElementById('applemusic-modal-edit-artist');
    if (modal) modal.classList.remove('applemusic-active');
    applemusicEditingArtistData = null;
}

function applemusicTriggerEditArtistCoverUpload(event) {
    applemusicTriggerCoverUpload(event);
    window.applemusicCustomCoverCallback = function(src) {
        if (applemusicEditingArtistData) {
            applemusicEditingArtistData.pic = src;
            const img = document.getElementById('applemusic-edit-artist-cover');
            if (img) {
                img.src = src;
                img.style.display = 'block';
            }
        }
    };
}

function applemusicRenderEditArtistSongList() {
    const container = document.getElementById('applemusic-edit-artist-song-list');
    const deleteBtn = document.getElementById('applemusic-edit-artist-delete-btn');
    if (!container || !applemusicEditingArtistData) return;

    container.innerHTML = '';

    if (!applemusicEditingArtistData.songs || applemusicEditingArtistData.songs.length === 0) {
        container.innerHTML = '<div style="padding: 20px; text-align: center; color: #8e8e93;">暂无歌曲</div>';
        if (deleteBtn) {
            deleteBtn.style.opacity = '0.5';
            deleteBtn.style.pointerEvents = 'none';
        }
        return;
    }

    applemusicEditingArtistData.songs.forEach((song) => {
        const isSelected = applemusicSelectedArtistSongsForDelete.has(song.id);
        const div = document.createElement('div');
        div.className = 'applemusic-edit-song-item';
        div.dataset.id = song.id;

        div.innerHTML = `
            <div class="applemusic-edit-checkbox ${isSelected ? 'selected' : ''}" onclick="applemusicToggleEditArtistSongSelect('${song.id}', this)">
                <svg viewBox="0 0 24 24" fill="none" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
            </div>
            <img src="${song.cover}" class="applemusic-edit-song-cover">
            <div class="applemusic-edit-song-info">
                <div class="applemusic-edit-song-name">${song.name}</div>
                <div class="applemusic-edit-song-artist">${song.artist}</div>
            </div>
            <div class="applemusic-edit-drag-handle">
                <svg viewBox="0 0 24 24" width="20" height="20" stroke="#c7c7cc" stroke-width="2" fill="none" stroke-linecap="round"><line x1="4" y1="8" x2="20" y2="8"></line><line x1="4" y1="16" x2="20" y2="16"></line><line x1="4" y1="12" x2="20" y2="12"></line></svg>
            </div>
        `;

        const handle = div.querySelector('.applemusic-edit-drag-handle');
        handle.addEventListener('touchstart', applemusicHandleTouchStart, { passive: false });

        container.appendChild(div);
    });

    if (deleteBtn) {
        if (applemusicSelectedArtistSongsForDelete.size > 0) {
            deleteBtn.style.opacity = '1';
            deleteBtn.style.pointerEvents = 'auto';
        } else {
            deleteBtn.style.opacity = '0.5';
            deleteBtn.style.pointerEvents = 'none';
        }
    }
}

function applemusicToggleEditArtistSongSelect(songId, element) {
    if (applemusicSelectedArtistSongsForDelete.has(songId)) {
        applemusicSelectedArtistSongsForDelete.delete(songId);
        element.classList.remove('selected');
    } else {
        applemusicSelectedArtistSongsForDelete.add(songId);
        element.classList.add('selected');
    }

    const deleteBtn = document.getElementById('applemusic-edit-artist-delete-btn');
    if (deleteBtn) {
        if (applemusicSelectedArtistSongsForDelete.size > 0) {
            deleteBtn.style.opacity = '1';
            deleteBtn.style.pointerEvents = 'auto';
        } else {
            deleteBtn.style.opacity = '0.5';
            deleteBtn.style.pointerEvents = 'none';
        }
    }
}

function applemusicDeleteSelectedArtistSongs() {
    if (!applemusicEditingArtistData || applemusicSelectedArtistSongsForDelete.size === 0) return;

    applemusicEditingArtistData.songs = applemusicEditingArtistData.songs.filter(
        song => !applemusicSelectedArtistSongsForDelete.has(song.id)
    );
    applemusicSelectedArtistSongsForDelete.clear();
    applemusicRenderEditArtistSongList();
}

function applemusicSaveEditedArtist() {
    if (!applemusicEditingArtistData || typeof musicAppData === 'undefined') return;

    const nameInput = document.getElementById('applemusic-edit-artist-name');
    const newName = (nameInput && nameInput.value.trim()) ? nameInput.value.trim() : applemusicEditingArtistData.name;

    const artistId = applemusicEditingArtistData.id;
    const finalPic = applemusicEditingArtistData.pic;
    if (!musicAppData.artistCustomData) musicAppData.artistCustomData = {};

    musicAppData.artistCustomData[artistId] = {
        name: newName,
        pic: finalPic,
        songs: applemusicEditingArtistData.songs
    };

    // 同步更新收藏艺人列表中的名字与封面
    if (musicAppData.favoriteArtists) {
        const favIndex = musicAppData.favoriteArtists.findIndex(a => a.id == artistId);
        if (favIndex !== -1) {
            musicAppData.favoriteArtists[favIndex].name = newName;
            musicAppData.favoriteArtists[favIndex].pic = finalPic;
        }
    }

    if (typeof saveMusicAppData === 'function') saveMusicAppData();

    applemusicCloseEditArtistModal();
    applemusicOpenArtistProfile(artistId, newName, finalPic);
    if (typeof showToast === 'function') showToast('艺人信息已保存');
}
    
function applemusicOpenArtistImportSongModal() {
    if (!window.applemusicCurrentArtist) return;

    applemusicArtistImportSelectedSongIds.clear();
    const modal = document.getElementById('applemusic-modal-artist-import-songs');
    const container = document.getElementById('applemusic-artist-import-song-list');
    if (!modal || !container) return;

    container.innerHTML = '';
    const allSongs = applemusicGetAllSongs();

    if (allSongs.length === 0) {
        container.innerHTML = '<div style="padding: 30px 0; text-align: center; color: #8e8e93;">曲库中暂无歌曲可供导入</div>';
    } else {
        const currentQueueIds = new Set((window.applemusicArtistBrowseQueue || []).map(s => String(s.id)));

        allSongs.forEach(song => {
            const isAlreadyAdded = currentQueueIds.has(String(song.id));
            const div = document.createElement('div');
            div.className = 'applemusic-playlist-detail-song-item';
            div.style.padding = '10px 0';

            div.innerHTML = `
                <div class="applemusic-edit-checkbox ${isAlreadyAdded ? 'selected' : ''}" style="margin-right: 12px; opacity: ${isAlreadyAdded ? '0.4' : '1'};">
                    <svg viewBox="0 0 24 24" fill="none" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
                </div>
                <img src="${song.cover}" class="applemusic-playlist-detail-song-cover" style="width: 44px; height: 44px; border-radius: 6px; margin-right: 12px; object-fit: cover;">
                <div class="applemusic-playlist-detail-song-info">
                    <div class="applemusic-playlist-detail-song-name">${song.name}</div>
                    <div class="applemusic-playlist-detail-song-artist">${song.artist}</div>
                </div>
                ${isAlreadyAdded ? '<span style="font-size: 12px; color: #8e8e93;">已存在</span>' : ''}
            `;

            if (!isAlreadyAdded) {
                div.onclick = () => {
                    const chk = div.querySelector('.applemusic-edit-checkbox');
                    if (applemusicArtistImportSelectedSongIds.has(song.id)) {
                        applemusicArtistImportSelectedSongIds.delete(song.id);
                        chk.classList.remove('selected');
                    } else {
                        applemusicArtistImportSelectedSongIds.add(song.id);
                        chk.classList.add('selected');
                    }
                };
            }

            container.appendChild(div);
        });
    }

    modal.classList.add('applemusic-active');
}

function applemusicCloseArtistImportSongModal() {
    const modal = document.getElementById('applemusic-modal-artist-import-songs');
    if (modal) modal.classList.remove('applemusic-active');
}

function applemusicToggleSelectAllArtistImport() {
    const container = document.getElementById('applemusic-artist-import-song-list');
    if (!container) return;

    const allSongs = applemusicGetAllSongs();
    const currentQueueIds = new Set((window.applemusicArtistBrowseQueue || []).map(s => String(s.id)));
    const importableSongs = allSongs.filter(s => !currentQueueIds.has(String(s.id)));

    if (applemusicArtistImportSelectedSongIds.size === importableSongs.length) {
        applemusicArtistImportSelectedSongIds.clear();
        container.querySelectorAll('.applemusic-playlist-detail-song-item').forEach(item => {
            if (!item.innerText.includes('已存在')) {
                item.querySelector('.applemusic-edit-checkbox')?.classList.remove('selected');
            }
        });
    } else {
        importableSongs.forEach(s => applemusicArtistImportSelectedSongIds.add(s.id));
        container.querySelectorAll('.applemusic-playlist-detail-song-item').forEach(item => {
            if (!item.innerText.includes('已存在')) {
                item.querySelector('.applemusic-edit-checkbox')?.classList.add('selected');
            }
        });
    }
}

function applemusicExecuteArtistImportSongs() {
    if (applemusicArtistImportSelectedSongIds.size === 0) {
        if (typeof showToast === 'function') showToast('请至少选择一首歌曲');
        return;
    }

    if (!window.applemusicCurrentArtist || typeof musicAppData === 'undefined') return;

    const artistId = window.applemusicCurrentArtist.id;
    const allSongs = applemusicGetAllSongs();
    const songsToImport = allSongs.filter(s => applemusicArtistImportSelectedSongIds.has(s.id));

    if (!musicAppData.artistCustomData) musicAppData.artistCustomData = {};

    let currentSongs = window.applemusicArtistBrowseQueue ? [...window.applemusicArtistBrowseQueue] : [];
    currentSongs.push(...songsToImport);

    musicAppData.artistCustomData[artistId] = {
        ...(musicAppData.artistCustomData[artistId] || {}),
        name: window.applemusicCurrentArtist.name,
        pic: window.applemusicCurrentArtist.pic,
        songs: currentSongs
    };

    if (typeof saveMusicAppData === 'function') saveMusicAppData();

    applemusicCloseArtistImportSongModal();
    applemusicOpenArtistProfile(artistId, window.applemusicCurrentArtist.name, window.applemusicCurrentArtist.pic);
    if (typeof showToast === 'function') showToast(`成功导入 ${songsToImport.length} 首歌曲至艺人主页`);
}

// ================= 歌单逻辑 =================
function applemusicOpenCreatePlaylistModal() {
    window.applemusicCustomCoverCallback = null;
    const modal = document.getElementById('applemusic-modal-create-playlist');
    if(modal) modal.classList.add('applemusic-active');

    const titleInput = document.getElementById('applemusic-new-playlist-title');
    const coverImg = document.getElementById('applemusic-new-playlist-cover');
    const cameraIcon = document.getElementById('applemusic-camera-icon-wrapper');

    if(titleInput) titleInput.value = '';
    if(coverImg) {
        coverImg.style.display = 'none';
        coverImg.src = '';
    }
    if(cameraIcon) cameraIcon.style.display = 'flex';

    applemusicNewPlaylistCoverBase64 = "";
    applemusicCheckPlaylistTitle();
}

function applemusicCloseCreatePlaylistModal() {
    const modal = document.getElementById('applemusic-modal-create-playlist');
    if(modal) modal.classList.remove('applemusic-active');
}

function applemusicCheckPlaylistTitle() {
    const titleInput = document.getElementById('applemusic-new-playlist-title');
    const btn = document.getElementById('applemusic-btn-submit-playlist');
    if(!titleInput || !btn) return;

    const title = titleInput.value.trim();
    if (title.length > 0) {
        btn.classList.add('applemusic-active');
    } else {
        btn.classList.remove('applemusic-active');
    }
}

function applemusicTriggerCoverUpload(event) {
    const overlay = document.getElementById('applemusicCoverMenuOverlay');
    const menu = document.getElementById('applemusicCoverMenu');
    if (!overlay || !menu) return;

    overlay.style.display = 'block';

    // 动态定位菜单到点击的封面下方
    const rect = event.currentTarget.getBoundingClientRect();
    let top = rect.bottom + 10;
    let left = rect.left + (rect.width / 2) - 75; // 居中对齐

    if (left + 150 > window.innerWidth) {
        left = window.innerWidth - 160;
    }
    if (top + 100 > window.innerHeight) {
        top = rect.top - 110;
    }

    menu.style.top = top + 'px';
    menu.style.left = left + 'px';
}

function applemusicCloseCoverMenu() {
    const overlay = document.getElementById('applemusicCoverMenuOverlay');
    if (overlay) overlay.style.display = 'none';
}

function applemusicOpenCoverUrlModal() {
    applemusicCloseCoverMenu();
    // 借用主题 APP 的高级弹窗，如果不存在则降级使用原生 prompt
    if (typeof showCustomPrompt === 'function') {
        showCustomPrompt('使用 URL 上传封面', 'https://...', '确定').then(url => {
            if (url && url.trim()) applemusicSetPlaylistCover(url.trim());
        });
    } else {
        const url = prompt("请输入图片URL:");
        if (url && url.trim()) {
            applemusicSetPlaylistCover(url.trim());
        }
    }
}

function applemusicHandleCoverFile(event) {
    const file = event.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function(e) {
            applemusicSetPlaylistCover(e.target.result);
        };
        reader.readAsDataURL(file);
    }
    event.target.value = '';
}

function applemusicSetPlaylistCover(src) {
    if (window.applemusicCustomCoverCallback) {
        window.applemusicCustomCoverCallback(src);
        return;
    }
    applemusicNewPlaylistCoverBase64 = src;
    const img = document.getElementById('applemusic-new-playlist-cover');
    const cameraIcon = document.getElementById('applemusic-camera-icon-wrapper');
    if(img) {
        img.src = src;
        img.style.display = 'block';
    }
    if(cameraIcon) cameraIcon.style.display = 'none';
}

function applemusicSubmitCreatePlaylist() {
    const titleInput = document.getElementById('applemusic-new-playlist-title');
    if(!titleInput) return;
    const title = titleInput.value.trim();
    if (!title) return;

    const playlist = {
        id: Date.now().toString(),
        title: title,
        cover: applemusicNewPlaylistCoverBase64 || "",
        timestamp: Date.now()
    };

    if (typeof musicAppData === 'undefined') return;
    musicAppData.customPlaylists.push(playlist);
    if (typeof saveMusicAppData === 'function') saveMusicAppData();

    applemusicCloseCreatePlaylistModal();
    applemusicLoadCustomPlaylists();
}

function applemusicLoadCustomPlaylists() {
    if (typeof musicAppData === 'undefined') return;
    const playlists = musicAppData.customPlaylists || [];
    const container = document.getElementById('applemusic-my-playlists-container');
    if(!container) return;

    // 恢复持久化保存的歌单视图模式（网格 / 列表）
    try {
        const savedLayout = localStorage.getItem('applemusicPlaylistLayout') || 'list';
        if (savedLayout === 'grid') {
            container.classList.add('applemusic-grid-view');
        } else {
            container.classList.remove('applemusic-grid-view');
        }
    } catch(e) {}

    while (container.children.length > 1) {
        container.removeChild(container.lastChild);
    }

    const heartPlaylist = container.children[0];
    if(heartPlaylist) {
        const favMeta = musicAppData.favoritePlaylistMeta || { title: '心动歌曲', cover: '' };

        const infoEl = heartPlaylist.querySelector('.applemusic-pl-info');
        if (infoEl) infoEl.innerText = favMeta.title;

        const coverEl = heartPlaylist.querySelector('.applemusic-pl-cover');
        if (coverEl) {
            if (favMeta.cover) {
                coverEl.innerHTML = `<img src="${favMeta.cover}" style="width:100%; height:100%; object-fit:cover; border-radius:6px;">`;
                coverEl.classList.add('applemusic-custom');
            } else {
                coverEl.innerHTML = `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M11.1 2.41c.31-.8 1.49-.8 1.8 0l2.2 5.67a1 1 0 00.83.6l6.05.46c.85.06 1.2 1.12.55 1.68l-4.64 3.97a1 1 0 00-.32 1l1.38 5.9c.2.85-.68 1.49-1.4 1.05l-5.18-3.15a1 1 0 00-1.04 0l-5.18 3.15c-.72.44-1.6-.2-1.4-1.05l1.38-5.9a1 1 0 00-.32-1L1.17 10.82c-.65-.56-.3-1.62.55-1.68l6.05-.46a1 1 0 00.83-.6l2.2-5.67z"/></svg>`;
                coverEl.classList.remove('applemusic-custom');
            }
        }

        heartPlaylist.onclick = () => applemusicOpenPlaylistDetail({
            id: 'favorite',
            title: favMeta.title,
            cover: favMeta.cover,
            isFavorite: true
        });
    }

    playlists.forEach(pl => {
        const div = document.createElement('div');
        div.className = 'applemusic-pl-item';

        const coverHtml = pl.cover
            ? `<img src="${pl.cover}" style="width:100%; height:100%; object-fit:cover; border-radius:6px;">`
            : `<svg viewBox="0 0 24 24" fill="#c7c7cc" style="width:32px; height:32px;"><path d="M12 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h4V3h-6z"/></svg>`;

        div.innerHTML = `
            <div class="applemusic-tiny-star-placeholder"></div>
            <div class="applemusic-pl-cover applemusic-custom" style="padding:0; overflow:hidden; border:none;">
                ${coverHtml}
            </div>
            <div class="applemusic-pl-info">${pl.title}</div>
            <svg class="applemusic-lib-list-chevron" viewBox="0 0 24 24"><path d="M8.59 16.59L13.17 12 8.59 7.41 10 6l6 6-6 6-1.41-1.41z"/></svg>
        `;
        div.onclick = () => applemusicOpenPlaylistDetail(pl);
        container.appendChild(div);
    });
}

function applemusicTogglePlaylistLayout() {
    const container = document.getElementById('applemusic-my-playlists-container');
    if(container) {
        container.classList.toggle('applemusic-grid-view');
        const isGrid = container.classList.contains('applemusic-grid-view');
        try {
            localStorage.setItem('applemusicPlaylistLayout', isGrid ? 'grid' : 'list');
        } catch(e) {}
    }
}

function applemusicOpenPlaylistDetail(playlist) {
    window.applemusicCurrentViewPlaylist = playlist; // 记录当前查看的歌单
    applemusicSwitchView('playlist-detail');

    const coverWrapper = document.getElementById('applemusic-detail-playlist-cover-wrapper');
    if(coverWrapper) {
        if (playlist.isFavorite && !playlist.cover) {
            coverWrapper.innerHTML = `<svg viewBox="0 0 24 24" fill="var(--theme-active)" style="width: 80px; height: 80px;"><path d="M11.1 2.41c.31-.8 1.49-.8 1.8 0l2.2 5.67a1 1 0 00.83.6l6.05.46c.85.06 1.2 1.12.55 1.68l-4.64 3.97a1 1 0 00-.32 1l1.38 5.9c.2.85-.68 1.49-1.4 1.05l-5.18-3.15a1 1 0 00-1.04 0l-5.18 3.15c-.72.44-1.6-.2-1.4-1.05l1.38-5.9a1 1 0 00-.32-1L1.17 10.82c-.65-.56-.3-1.62.55-1.68l6.05-.46a1 1 0 00.83-.6l2.2-5.67z"/></svg>`;
        } else if (playlist.cover) {
            coverWrapper.innerHTML = `<img src="${playlist.cover}" style="width: 100%; height: 100%; object-fit: cover;">`;
        } else {
            coverWrapper.innerHTML = `<svg viewBox="0 0 24 24" fill="#c7c7cc" style="width: 80px; height: 80px;"><path d="M12 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h4V3h-6z"/></svg>`;
        }
    }

    // 计算并更新真实时间
    const updateTimeEl = document.getElementById('applemusic-playlist-update-time');
    if (updateTimeEl) {
        if (playlist.isFavorite) {
            updateTimeEl.innerText = '实时更新';
        } else if (playlist.timestamp) {
            const diff = Date.now() - playlist.timestamp;
            const minutes = Math.floor(diff / 60000);
            const hours = Math.floor(minutes / 60);
            const days = Math.floor(hours / 24);
            if (days > 0) updateTimeEl.innerText = `${days}天前更新`;
            else if (hours > 0) updateTimeEl.innerText = `${hours}小时前更新`;
            else if (minutes > 0) updateTimeEl.innerText = `${minutes}分钟前更新`;
            else updateTimeEl.innerText = '刚刚更新';
        } else {
            updateTimeEl.innerText = '未知时间';
        }
    }

    const songsList = document.getElementById('applemusic-playlist-detail-songs-list');
    if(!songsList) return;

    songsList.innerHTML = '<div style="padding: 20px; text-align: center; color: var(--text-secondary);">加载中...</div>';

    if (playlist.isFavorite) {
        if (typeof musicAppData === 'undefined') {
            songsList.innerHTML = '<div style="padding: 20px; text-align: center; color: var(--text-secondary);">数据库未初始化</div>';
            return;
        }

        const songs = [...musicAppData.favoriteSongs].sort((a, b) => b.timestamp - a.timestamp);
        songsList.innerHTML = '';

        if (songs.length === 0) {
            songsList.innerHTML = '<div style="padding: 20px; text-align: center; color: var(--text-secondary);">暂无收藏歌曲</div>';
            return;
        }

        songs.forEach(song => {
            const div = document.createElement('div');
            div.className = 'applemusic-playlist-detail-song-item';
            div.onclick = () => {
                window.applemusicCurrentQueue = songs.slice();
                window.applemusicCurrentQueueSource = playlist.title;
                applemusicPlaySong(song.id, song.name, song.artist, song.cover);
            };

            div.innerHTML = `
                <svg class="applemusic-playlist-detail-song-star" viewBox="0 0 24 24"><path d="M11.1 2.41c.31-.8 1.49-.8 1.8 0l2.2 5.67a1 1 0 00.83.6l6.05.46c.85.06 1.2 1.12.55 1.68l-4.64 3.97a1 1 0 00-.32 1l1.38 5.9c.2.85-.68 1.49-1.4 1.05l-5.18-3.15a1 1 0 00-1.04 0l-5.18 3.15c-.72.44-1.6-.2-1.4-1.05l1.38-5.9a1 1 0 00-.32-1L1.17 10.82c-.65-.56-.3-1.62.55-1.68l6.05-.46a1 1 0 00.83-.6l2.2-5.67z"/></svg>
                <img src="${song.cover}" class="applemusic-playlist-detail-song-cover">
                <div class="applemusic-playlist-detail-song-info">
                    <div class="applemusic-playlist-detail-song-name">${song.name}</div>
                    <div class="applemusic-playlist-detail-song-artist">${song.artist}</div>
                </div>
                <svg class="applemusic-playlist-detail-song-more" viewBox="0 0 24 24" onclick="event.stopPropagation(); applemusicOpenSongMoreMenu(event, '${song.id}')"><path d="M6 10c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm12 0c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm-6 0c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z"/></svg>
            `;
            songsList.appendChild(div);
        });
    } else {
        // 渲染自定义歌单的歌曲
        const songs = playlist.songs || [];
        songsList.innerHTML = '';

        if (songs.length === 0) {
            songsList.innerHTML = '<div style="padding: 20px; text-align: center; color: var(--text-secondary);">歌单为空</div>';
            return;
        }

        songs.forEach(song => {
            const div = document.createElement('div');
            div.className = 'applemusic-playlist-detail-song-item';
            div.onclick = () => {
                window.applemusicCurrentQueue = songs.slice();
                window.applemusicCurrentQueueSource = playlist.title;
                applemusicPlaySong(song.id, song.name, song.artist, song.cover);
            };

            div.innerHTML = `
                <img src="${song.cover}" class="applemusic-playlist-detail-song-cover" style="margin-left: 10px;">
                <div class="applemusic-playlist-detail-song-info">
                    <div class="applemusic-playlist-detail-song-name">${song.name}</div>
                    <div class="applemusic-playlist-detail-song-artist">${song.artist}</div>
                </div>
                <svg class="applemusic-playlist-detail-song-more" viewBox="0 0 24 24" onclick="event.stopPropagation(); applemusicOpenSongMoreMenu(event, '${song.id}')"><path d="M6 10c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm12 0c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm-6 0c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z"/></svg>
            `;
            songsList.appendChild(div);
        });
    }
}

// ================= 播放整个歌单 =================
function applemusicPlayPlaylist(isShuffle) {
    if (!window.applemusicCurrentViewPlaylist) return;

    let songs = [];
    if (window.applemusicCurrentViewPlaylist.isFavorite) {
        if (typeof musicAppData !== 'undefined') {
            songs = [...musicAppData.favoriteSongs].sort((a, b) => b.timestamp - a.timestamp);
        }
    } else {
        songs = [...(window.applemusicCurrentViewPlaylist.songs || [])];
    }

    if (songs.length === 0) {
        if (typeof showToast === 'function') showToast('歌单为空');
        else alert('歌单为空');
        return;
    }

    if (isShuffle) {
        // Fisher-Yates 洗牌算法
        for (let i = songs.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [songs[i], songs[j]] = [songs[j], songs[i]];
        }
        applemusicToggleUpNextMode('shuffle'); // 联动 UI 状态
    } else {
        applemusicToggleUpNextMode('repeat'); // 默认列表循环
    }

    window.applemusicCurrentQueue = songs;
    window.applemusicCurrentQueueSource = window.applemusicCurrentViewPlaylist.title;

    // 播放第一首
    const firstSong = songs[0];
    applemusicPlaySong(firstSong.id, firstSong.name, firstSong.artist, firstSong.cover);
    applemusicOpenPlayer(); // 自动打开播放器
}

// ================= 歌单详情右上角更多菜单 =================
function applemusicOpenPlaylistMoreMenu(event) {
    const overlay = document.getElementById('applemusicPlaylistMoreMenuOverlay');
    const menu = document.getElementById('applemusicPlaylistMoreMenu');
    if (!overlay || !menu) return;

    overlay.style.display = 'block';

    // 动态更新置顶文字
    const pinText = document.getElementById('applemusic-playlist-pin-text');
    if (pinText && window.applemusicCurrentViewPlaylist) {
        const isPinned = typeof musicAppData !== 'undefined' && musicAppData.pinnedItems && musicAppData.pinnedItems.some(item => item.id === window.applemusicCurrentViewPlaylist.id && item.type === 'playlist');
        pinText.innerText = isPinned ? '取消置顶' : '置顶歌单';
    }

    const rect = event.currentTarget.getBoundingClientRect();
    let top = rect.bottom + 10;
    let left = rect.right - 220;

    if (left < 10) left = 10;

    if (top + 300 > window.innerHeight) {
        top = rect.top - 310;
        menu.style.transformOrigin = 'bottom right';
    } else {
        menu.style.transformOrigin = 'top right';
    }

    menu.style.top = top + 'px';
    menu.style.left = left + 'px';
}

function applemusicClosePlaylistMoreMenu() {
    const overlay = document.getElementById('applemusicPlaylistMoreMenuOverlay');
    if (overlay) overlay.style.display = 'none';
}

function applemusicToggleSortMenu() {
    const submenu = document.getElementById('applemusicSortSubmenu');
    const chevron = document.getElementById('applemusicSortChevron');
    if (!submenu) return;
    if (submenu.style.display === 'none' || submenu.style.display === '') {
        submenu.style.display = 'block';
        if (chevron) chevron.style.transform = 'rotate(180deg)';
    } else {
        submenu.style.display = 'none';
        if (chevron) chevron.style.transform = 'rotate(0deg)';
    }
}

function applemusicSortPlaylist(type) {
    applemusicClosePlaylistMoreMenu();

    if (!window.applemusicCurrentViewPlaylist) return;

    if (typeof musicAppData === 'undefined') return;

    let pl;
    if (window.applemusicCurrentViewPlaylist.isFavorite) {
        pl = window.applemusicCurrentViewPlaylist;
        pl.songs = [...musicAppData.favoriteSongs];
    } else {
        pl = musicAppData.customPlaylists.find(p => p.id === window.applemusicCurrentViewPlaylist.id);
    }

    if (!pl || !pl.songs || pl.songs.length === 0) return;

    if (type === 'name') {
        pl.songs.sort((a, b) => a.name.localeCompare(b.name, 'zh-CN'));
    } else if (type === 'artist') {
        pl.songs.sort((a, b) => a.artist.localeCompare(b.artist, 'zh-CN'));
    } else if (type === 'duration') {
        // 由于数据结构中没有时长，使用 ID 升序作为时长的模拟排序
        pl.songs.sort((a, b) => a.id - b.id);
    }

    if (window.applemusicCurrentViewPlaylist.isFavorite) {
        let now = Date.now();
        for (let i = pl.songs.length - 1; i >= 0; i--) {
            pl.songs[i].timestamp = now++;
        }
        musicAppData.favoriteSongs = pl.songs;
    }

    if (typeof saveMusicAppData === 'function') saveMusicAppData();

    if (typeof showToast === 'function') showToast('已按' + (type === 'name' ? '名称' : type === 'artist' ? '艺人' : '时长') + '排序');

    // 重新渲染详情页
    applemusicOpenPlaylistDetail(pl);
}

function applemusicDeleteCurrentPlaylist() {
    applemusicClosePlaylistMoreMenu();

    if (!window.applemusicCurrentViewPlaylist || window.applemusicCurrentViewPlaylist.isFavorite) {
        setTimeout(() => {
            if (typeof showToast === 'function') showToast('心动歌曲不支持删除');
            else alert('心动歌曲不支持删除');
        }, 100);
        return;
    }

    const doDelete = () => {
        if (typeof musicAppData !== 'undefined') {
            // 从置顶中同步移除
            if (musicAppData.pinnedItems) {
                musicAppData.pinnedItems = musicAppData.pinnedItems.filter(item => !(item.id === window.applemusicCurrentViewPlaylist.id && item.type === 'playlist'));
                applemusicRenderPinnedItems();
            }

            musicAppData.customPlaylists = musicAppData.customPlaylists.filter(p => p.id !== window.applemusicCurrentViewPlaylist.id);
            if (typeof saveMusicAppData === 'function') saveMusicAppData();
            applemusicLoadCustomPlaylists();
        }

        if (typeof showToast === 'function') showToast('已删除歌单');
        else alert('已删除歌单');
        applemusicSwitchView('playlists');
    };

    // 延迟 300ms 等待菜单收起动画完成，避免 UI 阻塞
    setTimeout(() => {
        if (typeof showCustomConfirm === 'function') {
            showCustomConfirm('提示', '确定要删除该歌单吗？', '确定', '取消').then(res => {
                if (res) doDelete();
            });
        } else {
            if (confirm('确定要删除该歌单吗？')) doDelete();
        }
    }, 300);
}

// ================= Playlists 页面右上角更多操作菜单 =================
function applemusicOpenPlaylistsViewMenu(event) {
    const overlay = document.getElementById('applemusicPlaylistsViewMenuOverlay');
    const menu = document.getElementById('applemusicPlaylistsViewMenu');
    if (!overlay || !menu) return;

    overlay.style.display = 'block';

    const rect = event.currentTarget.getBoundingClientRect();
    let top = rect.bottom + 10;
    let left = rect.right - 220;

    if (left < 10) left = 10;

    if (top + 260 > window.innerHeight) {
        top = rect.top - 270;
        menu.style.transformOrigin = 'bottom right';
    } else {
        menu.style.transformOrigin = 'top right';
    }

    menu.style.top = top + 'px';
    menu.style.left = left + 'px';
}

function applemusicClosePlaylistsViewMenu() {
    const overlay = document.getElementById('applemusicPlaylistsViewMenuOverlay');
    if (overlay) overlay.style.display = 'none';
}

function applemusicTogglePlaylistsSortMenu() {
    const submenu = document.getElementById('applemusicPlaylistsSortSubmenu');
    const chevron = document.getElementById('applemusicPlaylistsSortChevron');
    if (!submenu) return;
    if (submenu.style.display === 'none' || submenu.style.display === '') {
        submenu.style.display = 'block';
        if (chevron) chevron.style.transform = 'rotate(180deg)';
    } else {
        submenu.style.display = 'none';
        if (chevron) chevron.style.transform = 'rotate(0deg)';
    }
}

function applemusicSortCustomPlaylists(type) {
    applemusicClosePlaylistsViewMenu();
    if (typeof musicAppData === 'undefined' || !musicAppData.customPlaylists) return;

    if (type === 'title') {
        musicAppData.customPlaylists.sort((a, b) => (a.title || '').localeCompare(b.title || '', 'zh-CN'));
    } else if (type === 'recentlyAdded') {
        musicAppData.customPlaylists.sort((a, b) => (b.timestamp || 0) - (a.timestamp || 0));
    } else if (type === 'songCount') {
        musicAppData.customPlaylists.sort((a, b) => (b.songs ? b.songs.length : 0) - (a.songs ? a.songs.length : 0));
    }

    if (typeof saveMusicAppData === 'function') saveMusicAppData();
    applemusicLoadCustomPlaylists();
    if (typeof showToast === 'function') showToast('已按' + (type === 'title' ? '标题' : type === 'recentlyAdded' ? '最近添加' : '歌曲数量') + '排序');
}

// ================= Library 页面右上角菜单 =================
function applemusicOpenLibraryMenu(event) {
    const overlay = document.getElementById('applemusicLibraryMenuOverlay');
    const menu = document.getElementById('applemusicLibraryMenu');
    if (!overlay || !menu) return;

    overlay.style.display = 'block';

    const rect = event.currentTarget.getBoundingClientRect();
    let top = rect.bottom + 10;
    let left = rect.right - 220;

    if (left < 10) left = 10;

    menu.style.transformOrigin = 'top right';
    menu.style.top = top + 'px';
    menu.style.left = left + 'px';
}

function applemusicCloseLibraryMenu() {
    const overlay = document.getElementById('applemusicLibraryMenuOverlay');
    if (overlay) overlay.style.display = 'none';
}

// ================= 更多操作菜单 (三个点) =================
function applemusicOpenMoreMenu(event) {
    const overlay = document.getElementById('applemusicMoreMenuOverlay');
    const menu = document.getElementById('applemusicMoreMenu');
    if (!overlay || !menu) return;

    overlay.style.display = 'block';

    // 动态更新喜爱按钮的文字状态与图标 (实心爱心 / 心碎，灰色调)
    const favText = document.getElementById('applemusic-more-menu-fav-text');
    const favIcon = document.getElementById('applemusic-more-menu-fav-icon');
    if (favText && window.applemusicCurrentPlayingSong) {
        const isFav = typeof musicAppData !== 'undefined' && musicAppData.favoriteSongs.some(item => item.id === window.applemusicCurrentPlayingSong.id);
        favText.innerText = isFav ? '撤销喜爱' : '添加喜爱';
        if (favIcon) {
            favIcon.innerHTML = isFav
                ? `<svg viewBox="0 0 1024 1024" style="width: 20px; height: 20px;" fill="#8e8e93"><path d="M512 640l80-192-224-80 92.448-184.928c-95.2-78.336-236.384-73.12-325.472 15.68a240.96 240.96 0 0 0-2.624 338.912l345.376 344.192c18.912 18.88 49.6 18.88 68.544 0l345.344-344.192a240.928 240.928 0 0 0-2.624-338.912 243.104 243.104 0 0 0-280.32-45.024L480 336l208 80-176 224z"></path></svg>`
                : `<svg viewBox="0 0 1024 1024" style="width: 20px; height: 20px;" fill="#8e8e93"><path d="M32 407.584a279.584 279.584 0 0 1 480-194.944 279.584 279.584 0 0 1 480 194.944 278.144 278.144 0 0 1-113.024 224.512L562.592 892.8a96 96 0 0 1-124.416-1.952l-308.16-270.688A278.976 278.976 0 0 1 32 407.584z"></path></svg>`;
        }
    }

    // 获取点击按钮的位置
    const rect = event.currentTarget.getBoundingClientRect();
    let top = rect.bottom + 10;
    let left = rect.right - 220; // 靠右对齐，220是菜单宽度

    // 防止超出屏幕边界
    if (left < 10) left = 10;

    // 如果下方空间不够，就在上方弹出
    if (top + 260 > window.innerHeight) {
        top = rect.top - 270;
        menu.style.transformOrigin = 'bottom right';
    } else {
        menu.style.transformOrigin = 'top right';
    }

    menu.style.top = top + 'px';
    menu.style.left = left + 'px';
}

function applemusicCloseMoreMenu() {
    const overlay = document.getElementById('applemusicMoreMenuOverlay');
    if (overlay) overlay.style.display = 'none';
}

// ================= 更多操作菜单真实功能 =================
function applemusicMenuRemoveFromQueue(event) {
    event.stopPropagation();
    applemusicCloseMoreMenu();
    if (!window.applemusicCurrentPlayingSong) return;

    const doRemove = () => {
        const songName = window.applemusicCurrentPlayingSong.name;
        const songArtist = window.applemusicCurrentPlayingSong.artist;

        // 从当前队列中移除
        window.applemusicCurrentQueue = window.applemusicCurrentQueue.filter(s => s.id !== window.applemusicCurrentPlayingSong.id);
        applemusicRenderUpNextList();

        if (window.wcMusicActionLogs) window.wcMusicActionLogs.push(`User 从播放列表中移除了歌曲 ${songName} - ${songArtist}`);

        if (typeof showToast === 'function') {
            showToast('已从播放列表移除');
        } else {
            alert('已从播放列表移除');
        }

        // 自动播放下一首
        if (window.applemusicCurrentQueue.length > 0) {
            const nextSong = window.applemusicCurrentQueue[0];
            applemusicPlaySong(nextSong.id, nextSong.name, nextSong.artist, nextSong.cover);
        } else {
            const audio = document.getElementById('applemusic-audio-player');
            if (audio) audio.pause();
            applemusicUpdatePlayPauseUI(true);
        }
    };

    if (typeof showCustomConfirm === 'function') {
        showCustomConfirm('提示', '确定要从播放列表移除该歌曲吗？', '确定', '取消').then(res => {
            if (res) doRemove();
        });
    } else {
        if (confirm('确定要从播放列表移除该歌曲吗？')) doRemove();
    }
}

let applemusicSelectedPlaylistId = null;
let applemusicDrawerMode = 'add'; // 'add' 或 'move'

function applemusicMenuAddToPlaylist(event) {
    event.stopPropagation();
    applemusicCloseMoreMenu();
    if (!window.applemusicCurrentPlayingSong) return;

    applemusicDrawerMode = 'add';
    const titleEl = document.getElementById('applemusic-drawer-main-title');
    if (titleEl) titleEl.innerText = '添加到歌单';

    const overlay = document.getElementById('applemusicPlaylistDrawerOverlay');
    const container = document.getElementById('applemusic-drawer-playlist-container');
    const confirmBtn = document.getElementById('applemusic-drawer-confirm-btn');
    if (!overlay || !container) return;

    // 重置选中状态
    applemusicSelectedPlaylistId = null;
    if (confirmBtn) confirmBtn.classList.remove('active');
    container.innerHTML = '';

    if (typeof musicAppData === 'undefined' || !musicAppData.customPlaylists || musicAppData.customPlaylists.length === 0) {
        container.innerHTML = '<div style="padding: 30px 0; text-align: center; color: #8e8e93;">暂无自定义歌单，请先在资料库创建</div>';
    } else {
        // 渲染所有自定义歌单
        const playlists = [...musicAppData.customPlaylists].sort((a, b) => b.timestamp - a.timestamp);
        playlists.forEach(pl => {
            const div = document.createElement('div');
            div.className = 'applemusic-drawer-item';
            div.id = 'applemusic-drawer-item-' + pl.id;

            const coverHtml = pl.cover
                ? `<img src="${pl.cover}" style="width:100%; height:100%; object-fit:cover;">`
                : `<svg viewBox="0 0 24 24"><path d="M12 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h4V3h-6z"/></svg>`;

            div.innerHTML = `
                <div class="applemusic-drawer-cover">${coverHtml}</div>
                <div class="applemusic-drawer-info">${pl.title}</div>
                <svg class="applemusic-drawer-check" viewBox="0 0 24 24"><path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/></svg>
            `;
            div.onclick = () => applemusicSelectPlaylist(pl.id);
            container.appendChild(div);
        });
    }

    overlay.classList.add('applemusic-active');
}

function applemusicSelectPlaylist(playlistId) {
    applemusicSelectedPlaylistId = playlistId;

    // 更新 UI 选中状态
    document.querySelectorAll('.applemusic-drawer-item').forEach(el => {
        el.classList.remove('selected');
    });
    const selectedEl = document.getElementById('applemusic-drawer-item-' + playlistId);
    if (selectedEl) selectedEl.classList.add('selected');

    // 激活右上角确认按钮
    const confirmBtn = document.getElementById('applemusic-drawer-confirm-btn');
    if (confirmBtn) confirmBtn.classList.add('active');
}

function applemusicClosePlaylistDrawer() {
    const overlay = document.getElementById('applemusicPlaylistDrawerOverlay');
    if (overlay) overlay.classList.remove('applemusic-active');
}

function applemusicOpenLocalPlaylistDrawer() {
    applemusicDrawerMode = 'local-import';
    const titleEl = document.getElementById('applemusic-drawer-main-title');
    if (titleEl) titleEl.innerText = '选择目标歌单';

    const overlay = document.getElementById('applemusicPlaylistDrawerOverlay');
    const container = document.getElementById('applemusic-drawer-playlist-container');
    const confirmBtn = document.getElementById('applemusic-drawer-confirm-btn');
    if (!overlay || !container) return;

    applemusicSelectedPlaylistId = applemusicLocalSelectedPlaylistId || 'favorite';
    if (confirmBtn) confirmBtn.classList.add('active');
    container.innerHTML = '';

    // 渲染心动歌曲
    const favMeta = typeof musicAppData !== 'undefined' && musicAppData.favoritePlaylistMeta ? musicAppData.favoritePlaylistMeta : { title: '心动歌曲', cover: '' };
    const favDiv = document.createElement('div');
    favDiv.className = 'applemusic-drawer-item' + (applemusicSelectedPlaylistId === 'favorite' ? ' selected' : '');
    favDiv.id = 'applemusic-drawer-item-favorite';
    const favCoverHtml = favMeta.cover ? `<img src="${favMeta.cover}" style="width:100%; height:100%; object-fit:cover;">` : `<svg viewBox="0 0 24 24"><path d="M11.1 2.41c.31-.8 1.49-.8 1.8 0l2.2 5.67a1 1 0 00.83.6l6.05.46c.85.06 1.2 1.12.55 1.68l-4.64 3.97a1 1 0 00-.32 1l1.38 5.9c.2.85-.68 1.49-1.4 1.05l-5.18-3.15a1 1 0 00-1.04 0l-5.18 3.15c-.72.44-1.6-.2-1.4-1.05l1.38-5.9a1 1 0 00-.32-1L1.17 10.82c-.65-.56-.3-1.62.55-1.68l6.05-.46a1 1 0 00.83-.6l2.2-5.67z"/></svg>`;
    favDiv.innerHTML = `
        <div class="applemusic-drawer-cover">${favCoverHtml}</div>
        <div class="applemusic-drawer-info">${favMeta.title}</div>
        <svg class="applemusic-drawer-check" viewBox="0 0 24 24"><path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/></svg>
    `;
    favDiv.onclick = () => applemusicSelectPlaylist('favorite');
    container.appendChild(favDiv);

    // 渲染自定义歌单
    if (typeof musicAppData !== 'undefined' && musicAppData.customPlaylists) {
        const playlists = [...musicAppData.customPlaylists].sort((a, b) => b.timestamp - a.timestamp);
        playlists.forEach(pl => {
            const div = document.createElement('div');
            div.className = 'applemusic-drawer-item' + (applemusicSelectedPlaylistId === pl.id ? ' selected' : '');
            div.id = 'applemusic-drawer-item-' + pl.id;
            const coverHtml = pl.cover ? `<img src="${pl.cover}" style="width:100%; height:100%; object-fit:cover;">` : `<svg viewBox="0 0 24 24"><path d="M12 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h4V3h-6z"/></svg>`;
            div.innerHTML = `
                <div class="applemusic-drawer-cover">${coverHtml}</div>
                <div class="applemusic-drawer-info">${pl.title}</div>
                <svg class="applemusic-drawer-check" viewBox="0 0 24 24"><path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/></svg>
            `;
            div.onclick = () => applemusicSelectPlaylist(pl.id);
            container.appendChild(div);
        });
    }

    overlay.classList.add('applemusic-active');
}

function applemusicExecuteAddToPlaylist() {
    if (!applemusicSelectedPlaylistId || typeof musicAppData === 'undefined') return;

    if (applemusicDrawerMode === 'local-import') {
        applemusicLocalSelectedPlaylistId = applemusicSelectedPlaylistId;
        let title = '心动歌曲';
        if (applemusicSelectedPlaylistId === 'favorite') {
            const favMeta = musicAppData.favoritePlaylistMeta || { title: '心动歌曲' };
            title = favMeta.title;
        } else if (musicAppData.customPlaylists) {
            const pl = musicAppData.customPlaylists.find(p => p.id === applemusicSelectedPlaylistId);
            if (pl) title = pl.title;
        }
        const nameEl = document.getElementById('applemusic-local-playlist-name');
        if (nameEl) nameEl.innerText = title;
        applemusicClosePlaylistDrawer();
        return;
    }

    const targetPlaylist = musicAppData.customPlaylists.find(p => p.id === applemusicSelectedPlaylistId);
    if (!targetPlaylist) return;
    if (!targetPlaylist.songs) targetPlaylist.songs = [];

    if (applemusicDrawerMode === 'add') {
        const targetSong = window.applemusicTargetAddSong || window.applemusicCurrentPlayingSong;
        if (!targetSong) return;
        if (!targetPlaylist.songs.some(s => s.id === targetSong.id)) {
            targetPlaylist.songs.push(targetSong);
            if (typeof saveMusicAppData === 'function') saveMusicAppData();
            if (typeof showToast === 'function') showToast(`已添加至歌单: ${targetPlaylist.title}`);
            else alert(`已添加至歌单: ${targetPlaylist.title}`);
        } else {
            if (typeof showToast === 'function') showToast('该歌曲已在歌单中');
            else alert('该歌曲已在歌单中');
        }
        window.applemusicTargetAddSong = null;
    } else if (applemusicDrawerMode === 'move') {
        const song = applemusicGetActionSong();
        if (!song) return;

        // 1. 添加到新歌单
        if (!targetPlaylist.songs.some(s => s.id === song.id)) {
            targetPlaylist.songs.push(song);
        }

        // 2. 从旧歌单删除 (如果有当前歌单视图的话)
        let currentPl = window.applemusicCurrentViewPlaylist;
        if (currentPl) {
            if (currentPl.isFavorite) {
                applemusicRemoveFavoriteSong(song.id);
            } else {
                currentPl.songs = currentPl.songs.filter(s => s.id != song.id);
                const index = musicAppData.customPlaylists.findIndex(p => p.id === currentPl.id);
                if (index !== -1) {
                    musicAppData.customPlaylists[index] = currentPl;
                }
            }
        }

        if (typeof saveMusicAppData === 'function') saveMusicAppData();
        if (typeof showToast === 'function') showToast(`已移动至: ${targetPlaylist.title}`);
        else alert(`已移动至: ${targetPlaylist.title}`);

        // 3. 刷新当前歌单视图
        if (currentPl) {
            applemusicOpenPlaylistDetail(currentPl);
        }
    }

    applemusicClosePlaylistDrawer();
}

function applemusicMenuToggleFavorite(event) {
    event.stopPropagation();
    applemusicCloseMoreMenu();
    if (!window.applemusicCurrentPlayingSong) return;

    // 检查当前是否已收藏
    const isFav = typeof musicAppData !== 'undefined' && musicAppData.favoriteSongs.some(item => item.id === window.applemusicCurrentPlayingSong.id);

    if (isFav) {
        applemusicRemoveFavoriteSong(window.applemusicCurrentPlayingSong.id);
        if (typeof showToast === 'function') showToast('已撤销喜爱');
    } else {
        applemusicSaveFavoriteSong(window.applemusicCurrentPlayingSong);
        if (typeof showToast === 'function') showToast('已添加至喜爱');
    }

    // 同步更新主界面的星星状态
    applemusicCheckIsFavorite(window.applemusicCurrentPlayingSong.id);
}

// ================= 编辑歌单逻辑 (多选删除、拖拽排序) =================
let applemusicEditingPlaylist = null;
let applemusicSelectedSongsForDelete = new Set();
let applemusicDragStartIndex = -1;

function applemusicOpenEditPlaylistModal() {
    applemusicClosePlaylistMoreMenu();

    if (!window.applemusicCurrentViewPlaylist) return;

    // 深拷贝当前歌单数据，避免未保存就污染原数据
    applemusicEditingPlaylist = JSON.parse(JSON.stringify(window.applemusicCurrentViewPlaylist));
    if (applemusicEditingPlaylist.isFavorite) {
        applemusicEditingPlaylist.songs = [...musicAppData.favoriteSongs].sort((a, b) => b.timestamp - a.timestamp);
    }
    applemusicSelectedSongsForDelete.clear();

    const modal = document.getElementById('applemusic-modal-edit-playlist');
    if(modal) modal.classList.add('applemusic-active');

    // 初始化 UI
    const titleInput = document.getElementById('applemusic-edit-playlist-title');
    const coverImg = document.getElementById('applemusic-edit-playlist-cover');
    const cameraIcon = modal.querySelector('.applemusic-camera-icon-wrapper');

    if(titleInput) titleInput.value = applemusicEditingPlaylist.title;

    if(applemusicEditingPlaylist.cover) {
        if(coverImg) {
            coverImg.src = applemusicEditingPlaylist.cover;
            coverImg.style.display = 'block';
        }
        if(cameraIcon) cameraIcon.style.display = 'none';
    } else {
        if(coverImg) coverImg.style.display = 'none';
        if(cameraIcon) cameraIcon.style.display = 'flex';
    }

    applemusicRenderEditSongList();
}

function applemusicCloseEditPlaylistModal() {
    const modal = document.getElementById('applemusic-modal-edit-playlist');
    if(modal) modal.classList.remove('applemusic-active');
    applemusicEditingPlaylist = null;
}

function applemusicTriggerEditCoverUpload(event) {
    // 复用创建歌单时的封面上传菜单
    applemusicTriggerCoverUpload(event);
    // 覆盖上传完成后的回调，使其更新编辑弹窗的封面
    window.applemusicCustomCoverCallback = function(src) {
        if (applemusicEditingPlaylist) {
            applemusicEditingPlaylist.cover = src;
            const img = document.getElementById('applemusic-edit-playlist-cover');
            const cameraIcon = document.querySelector('#applemusic-modal-edit-playlist .applemusic-camera-icon-wrapper');
            if(img) {
                img.src = src;
                img.style.display = 'block';
            }
            if(cameraIcon) cameraIcon.style.display = 'none';
        }
    };
}

function applemusicRenderEditSongList() {
    const container = document.getElementById('applemusic-edit-song-list');
    const deleteBtn = document.getElementById('applemusic-edit-delete-btn');
    if (!container) return;

    container.innerHTML = '';

    if (!applemusicEditingPlaylist.songs || applemusicEditingPlaylist.songs.length === 0) {
        container.innerHTML = '<div style="padding: 20px; text-align: center; color: #8e8e93;">歌单为空</div>';
        if (deleteBtn) {
            deleteBtn.style.opacity = '0.5';
            deleteBtn.style.pointerEvents = 'none';
        }
        return;
    }

    applemusicEditingPlaylist.songs.forEach((song, index) => {
        const isSelected = applemusicSelectedSongsForDelete.has(song.id);
        const div = document.createElement('div');
        div.className = 'applemusic-edit-song-item';
        div.dataset.id = song.id;

        // 注意：onclick 传入了 this，以便直接操作 DOM
        div.innerHTML = `
            <div class="applemusic-edit-checkbox ${isSelected ? 'selected' : ''}" onclick="applemusicToggleEditSongSelect('${song.id}', this, false)">
                <svg viewBox="0 0 24 24" fill="none" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
            </div>
            <img src="${song.cover}" class="applemusic-edit-song-cover">
            <div class="applemusic-edit-song-info">
                <div class="applemusic-edit-song-name">${song.name}</div>
                <div class="applemusic-edit-song-artist">${song.artist}</div>
            </div>
            <div class="applemusic-edit-drag-handle">
                <svg viewBox="0 0 24 24" width="20" height="20" stroke="#c7c7cc" stroke-width="2" fill="none" stroke-linecap="round"><line x1="4" y1="8" x2="20" y2="8"></line><line x1="4" y1="16" x2="20" y2="16"></line><line x1="4" y1="12" x2="20" y2="12"></line></svg>
            </div>
        `;

        const handle = div.querySelector('.applemusic-edit-drag-handle');
        handle.addEventListener('touchstart', applemusicHandleTouchStart, { passive: false });

        container.appendChild(div);
    });

    // 更新删除按钮显示状态
    if (deleteBtn) {
        if (applemusicSelectedSongsForDelete.size > 0) {
            deleteBtn.style.opacity = '1';
            deleteBtn.style.pointerEvents = 'auto';
        } else {
            deleteBtn.style.opacity = '0.5';
            deleteBtn.style.pointerEvents = 'none';
        }
    }
}

// 优化：不再全量重绘列表，直接操作 DOM 类名，保留 CSS 动画
function applemusicToggleEditSongSelect(songId, element, isGlobal = false) {
    if (applemusicSelectedSongsForDelete.has(songId)) {
        applemusicSelectedSongsForDelete.delete(songId);
        element.classList.remove('selected');
    } else {
        applemusicSelectedSongsForDelete.add(songId);
        element.classList.add('selected');
    }

    // 仅更新删除按钮状态
    const deleteBtnId = isGlobal ? 'applemusic-global-edit-delete-btn' : 'applemusic-edit-delete-btn';
    const deleteBtn = document.getElementById(deleteBtnId);
    if (deleteBtn) {
        if (applemusicSelectedSongsForDelete.size > 0) {
            deleteBtn.style.opacity = '1';
            deleteBtn.style.pointerEvents = 'auto';
        } else {
            deleteBtn.style.opacity = '0.5';
            deleteBtn.style.pointerEvents = 'none';
        }
    }
}

function applemusicDeleteSelectedSongs() {
    if (applemusicSelectedSongsForDelete.size === 0) return;

    const doDelete = () => {
        applemusicEditingPlaylist.songs = applemusicEditingPlaylist.songs.filter(
            song => !applemusicSelectedSongsForDelete.has(song.id)
        );
        applemusicSelectedSongsForDelete.clear();
        applemusicRenderEditSongList();
    };

    if (typeof showCustomConfirm === 'function') {
        showCustomConfirm('提示', '确定要删除选中的歌曲吗？', '确定', '取消').then(res => {
            if (res) doDelete();
        });
    } else {
        if (confirm('确定要删除选中的歌曲吗？')) doDelete();
    }
}

// ================= 丝滑拖拽排序逻辑 =================
let amDragState = null;

function applemusicHandleTouchStart(e) {
    // 仅响应单指拖拽
    if (e.touches.length > 1) return;

    const handle = e.currentTarget;
    const item = handle.closest('.applemusic-edit-song-item');
    if (!item) return;

    // 阻止默认滚动
    e.preventDefault();

    const rect = item.getBoundingClientRect();
    const touch = e.touches[0];

    // 创建克隆节点作为飞行层 (悬浮在最上层)
    const ghost = item.cloneNode(true);
    ghost.classList.add('is-dragged');
    ghost.style.width = rect.width + 'px';
    ghost.style.height = rect.height + 'px';
    ghost.style.left = rect.left + 'px';
    ghost.style.top = rect.top + 'px';
    document.body.appendChild(ghost);

    // 原节点变透明，作为占位符留在文档流中
    item.classList.add('is-ghost');

    amDragState = {
        item: item,
        ghost: ghost,
        startY: touch.clientY,
        startTop: rect.top,
        container: item.parentElement // 动态获取容器
    };

    document.addEventListener('touchmove', applemusicHandleTouchMove, { passive: false });
    document.addEventListener('touchend', applemusicHandleTouchEnd);
}

function applemusicHandleTouchMove(e) {
    if (!amDragState) return;
    e.preventDefault();

    const touch = e.touches[0];
    const deltaY = touch.clientY - amDragState.startY;
    const newTop = amDragState.startTop + deltaY;

    // 移动飞行层
    amDragState.ghost.style.top = newTop + 'px';

    // 查找当前飞行层中心点覆盖的兄弟节点
    const items = Array.from(amDragState.container.querySelectorAll('.applemusic-edit-song-item:not(.is-dragged)'));
    const ghostCenterY = newTop + (amDragState.ghost.offsetHeight / 2);

    let targetItem = null;
    for (let sibling of items) {
        if (sibling === amDragState.item) continue;
        const siblingRect = sibling.getBoundingClientRect();
        if (ghostCenterY > siblingRect.top && ghostCenterY < siblingRect.bottom) {
            targetItem = sibling;
            break;
        }
    }

    // 如果覆盖了其他节点，则将透明占位符移动过去，实现其他列表项的平滑让位
    if (targetItem) {
        const targetRect = targetItem.getBoundingClientRect();
        const isAfter = ghostCenterY > targetRect.top + targetRect.height / 2;

        if (isAfter) {
            targetItem.parentNode.insertBefore(amDragState.item, targetItem.nextSibling);
        } else {
            targetItem.parentNode.insertBefore(amDragState.item, targetItem);
        }
    }
}

function applemusicHandleTouchEnd(e) {
    if (!amDragState) return;

    document.removeEventListener('touchmove', applemusicHandleTouchMove);
    document.removeEventListener('touchend', applemusicHandleTouchEnd);

    // 移除飞行层，恢复原节点透明度
    amDragState.ghost.remove();
    amDragState.item.classList.remove('is-ghost');

    // 根据新的 DOM 顺序更新数据数组
    const newOrderIds = Array.from(amDragState.container.querySelectorAll('.applemusic-edit-song-item')).map(el => el.dataset.id);
    const newSongs = [];

    let targetPlaylist = null;
    if (amDragState.container.id === 'applemusic-global-edit-song-list') {
        targetPlaylist = applemusicGlobalEditingPlaylists.find(p => p.id === applemusicGlobalCurrentPlaylistId);
    } else if (amDragState.container.id === 'applemusic-edit-artist-song-list') {
        targetPlaylist = applemusicEditingArtistData;
    } else {
        targetPlaylist = applemusicEditingPlaylist;
    }

    if (targetPlaylist) {
        newOrderIds.forEach(id => {
            const song = targetPlaylist.songs.find(s => s.id == id);
            if (song) newSongs.push(song);
        });
        targetPlaylist.songs = newSongs;
    }

    amDragState = null;
}

function applemusicSaveEditedPlaylist() {
    if (!applemusicEditingPlaylist || typeof musicAppData === 'undefined') return;

    const titleInput = document.getElementById('applemusic-edit-playlist-title');
    if (titleInput && titleInput.value.trim()) {
        applemusicEditingPlaylist.title = titleInput.value.trim();
    }

    if (applemusicEditingPlaylist.isFavorite) {
        musicAppData.favoritePlaylistMeta = {
            title: applemusicEditingPlaylist.title,
            cover: applemusicEditingPlaylist.cover
        };
        musicAppData.favoriteSongs = applemusicEditingPlaylist.songs;
        if (typeof saveMusicAppData === 'function') saveMusicAppData();

        applemusicLoadCustomPlaylists();
        applemusicOpenPlaylistDetail(applemusicEditingPlaylist);
    } else {
        // 更新数据库
        const index = musicAppData.customPlaylists.findIndex(p => p.id === applemusicEditingPlaylist.id);
        if (index !== -1) {
            musicAppData.customPlaylists[index] = applemusicEditingPlaylist;
            if (typeof saveMusicAppData === 'function') saveMusicAppData();

            // 刷新各个视图
            applemusicLoadCustomPlaylists();
            applemusicOpenPlaylistDetail(applemusicEditingPlaylist);
        }
    }

    applemusicCloseEditPlaylistModal();
}

// ================= 全局编辑歌单逻辑 =================
let applemusicGlobalEditingPlaylists = [];
let applemusicGlobalCurrentPlaylistId = null;

function applemusicOpenGlobalEditPlaylistModal() {
    applemusicCloseLibraryMenu();

    if (typeof musicAppData === 'undefined') return;

    // 1. 构建深拷贝数据
    applemusicGlobalEditingPlaylists = [];

    // 心动歌曲
    const favMeta = musicAppData.favoritePlaylistMeta || { title: '心动歌曲', cover: '' };
    applemusicGlobalEditingPlaylists.push({
        id: 'favorite',
        title: favMeta.title,
        cover: favMeta.cover,
        songs: JSON.parse(JSON.stringify(musicAppData.favoriteSongs || []))
    });

    // 自定义歌单
    if (musicAppData.customPlaylists) {
        const customPls = JSON.parse(JSON.stringify(musicAppData.customPlaylists)).sort((a, b) => b.timestamp - a.timestamp);
        applemusicGlobalEditingPlaylists.push(...customPls);
    }

    applemusicSelectedSongsForDelete.clear();
    applemusicGlobalCurrentPlaylistId = 'favorite';

    const modal = document.getElementById('applemusic-modal-global-edit-playlist');
    if(modal) modal.classList.add('applemusic-active');

    // 2. 渲染轮播图
    const carousel = document.getElementById('applemusic-global-edit-carousel');
    const dotsContainer = document.getElementById('applemusic-global-edit-carousel-dots');

    if (carousel && dotsContainer) {
        carousel.innerHTML = '';
        dotsContainer.innerHTML = '';

        applemusicGlobalEditingPlaylists.forEach((pl, index) => {
            const coverHtml = pl.cover
                ? `<img src="${pl.cover}">`
                : `<svg viewBox="0 0 24 24"><path d="M12 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h4V3h-6z"/></svg>`;

            // 心动歌曲特殊图标
            const finalCoverHtml = (pl.id === 'favorite' && !pl.cover)
                ? `<svg viewBox="0 0 24 24"><path d="M11.1 2.41c.31-.8 1.49-.8 1.8 0l2.2 5.67a1 1 0 00.83.6l6.05.46c.85.06 1.2 1.12.55 1.68l-4.64 3.97a1 1 0 00-.32 1l1.38 5.9c.2.85-.68 1.49-1.4 1.05l-5.18-3.15a1 1 0 00-1.04 0l-5.18 3.15c-.72.44-1.6-.2-1.4-1.05l1.38-5.9a1 1 0 00-.32-1L1.17 10.82c-.65-.56-.3-1.62.55-1.68l6.05-.46a1 1 0 00.83-.6l2.2-5.67z"/></svg>`
                : coverHtml;

            carousel.innerHTML += `
                <div class="applemusic-local-carousel-card ${index === 0 ? 'active' : ''}" data-id="${pl.id}" data-name="${pl.title}" data-index="${index}">
                    ${finalCoverHtml}
                </div>
            `;
            dotsContainer.innerHTML += `<div class="applemusic-carousel-dot ${index === 0 ? 'active' : ''}" data-index="${index}"></div>`;
        });

        // 绑定滑动监听事件
        carousel.onscroll = function() {
            const center = carousel.scrollLeft + carousel.clientWidth / 2;
            let minDiff = Infinity;
            let activeCard = null;

            carousel.querySelectorAll('.applemusic-local-carousel-card').forEach(card => {
                const cardCenter = card.offsetLeft + card.offsetWidth / 2;
                const diff = Math.abs(center - cardCenter);
                if (diff < minDiff) {
                    minDiff = diff;
                    activeCard = card;
                }
                card.classList.remove('active');
            });

            if (activeCard) {
                const newId = activeCard.dataset.id;
                if (newId !== applemusicGlobalCurrentPlaylistId) {
                    activeCard.classList.add('active');
                    document.getElementById('applemusic-global-edit-playlist-name').innerText = activeCard.dataset.name;
                    applemusicGlobalCurrentPlaylistId = newId;

                    // 更新指示器
                    const activeIndex = activeCard.dataset.index;
                    dotsContainer.querySelectorAll('.applemusic-carousel-dot').forEach(dot => {
                        if (dot.dataset.index === activeIndex) {
                            dot.classList.add('active');
                        } else {
                            dot.classList.remove('active');
                        }
                    });

                    // 切换歌单时清空选中状态并重新渲染列表
                    applemusicSelectedSongsForDelete.clear();
                    applemusicRenderGlobalEditSongList();
                } else {
                    activeCard.classList.add('active');
                }
            }
        };

        // 初始滚动到最左侧
        carousel.scrollLeft = 0;
        document.getElementById('applemusic-global-edit-playlist-name').innerText = applemusicGlobalEditingPlaylists[0].title;
    }

    applemusicRenderGlobalEditSongList();
}

function applemusicCloseGlobalEditPlaylistModal() {
    const modal = document.getElementById('applemusic-modal-global-edit-playlist');
    if(modal) modal.classList.remove('applemusic-active');
    applemusicGlobalEditingPlaylists = [];
}

function applemusicRenderGlobalEditSongList() {
    const container = document.getElementById('applemusic-global-edit-song-list');
    const deleteBtn = document.getElementById('applemusic-global-edit-delete-btn');
    if (!container) return;

    container.innerHTML = '';

    const currentPl = applemusicGlobalEditingPlaylists.find(p => p.id === applemusicGlobalCurrentPlaylistId);
    if (!currentPl || !currentPl.songs || currentPl.songs.length === 0) {
        container.innerHTML = '<div style="padding: 20px; text-align: center; color: #8e8e93;">歌单为空</div>';
        if (deleteBtn) {
            deleteBtn.style.opacity = '0.5';
            deleteBtn.style.pointerEvents = 'none';
        }
        return;
    }

    currentPl.songs.forEach((song, index) => {
        const isSelected = applemusicSelectedSongsForDelete.has(song.id);
        const div = document.createElement('div');
        div.className = 'applemusic-edit-song-item';
        div.dataset.id = song.id;

        div.innerHTML = `
            <div class="applemusic-edit-checkbox ${isSelected ? 'selected' : ''}" onclick="applemusicToggleEditSongSelect('${song.id}', this, true)">
                <svg viewBox="0 0 24 24" fill="none" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
            </div>
            <img src="${song.cover}" class="applemusic-edit-song-cover">
            <div class="applemusic-edit-song-info">
                <div class="applemusic-edit-song-name">${song.name}</div>
                <div class="applemusic-edit-song-artist">${song.artist}</div>
            </div>
            <div class="applemusic-edit-drag-handle">
                <svg viewBox="0 0 24 24" width="20" height="20" stroke="#c7c7cc" stroke-width="2" fill="none" stroke-linecap="round"><line x1="4" y1="8" x2="20" y2="8"></line><line x1="4" y1="16" x2="20" y2="16"></line><line x1="4" y1="12" x2="20" y2="12"></line></svg>
            </div>
        `;

        const handle = div.querySelector('.applemusic-edit-drag-handle');
        handle.addEventListener('touchstart', applemusicHandleTouchStart, { passive: false });

        container.appendChild(div);
    });

    if (deleteBtn) {
        if (applemusicSelectedSongsForDelete.size > 0) {
            deleteBtn.style.opacity = '1';
            deleteBtn.style.pointerEvents = 'auto';
        } else {
            deleteBtn.style.opacity = '0.5';
            deleteBtn.style.pointerEvents = 'none';
        }
    }
}

function applemusicGlobalDeleteSelectedSongs() {
    if (applemusicSelectedSongsForDelete.size === 0) return;

    const doDelete = () => {
        const currentPl = applemusicGlobalEditingPlaylists.find(p => p.id === applemusicGlobalCurrentPlaylistId);
        if (currentPl) {
            currentPl.songs = currentPl.songs.filter(
                song => !applemusicSelectedSongsForDelete.has(song.id)
            );
        }
        applemusicSelectedSongsForDelete.clear();
        applemusicRenderGlobalEditSongList();
    };

    if (typeof showCustomConfirm === 'function') {
        showCustomConfirm('提示', '确定要删除选中的歌曲吗？', '确定', '取消').then(res => {
            if (res) doDelete();
        });
    } else {
        if (confirm('确定要删除选中的歌曲吗？')) doDelete();
    }
}

function applemusicSaveGlobalEditedPlaylists() {
    if (typeof musicAppData === 'undefined') return;

    applemusicGlobalEditingPlaylists.forEach(pl => {
        if (pl.id === 'favorite') {
            musicAppData.favoriteSongs = pl.songs;
        } else {
            const index = musicAppData.customPlaylists.findIndex(p => p.id === pl.id);
            if (index !== -1) {
                musicAppData.customPlaylists[index].songs = pl.songs;
            }
        }
    });

    if (typeof saveMusicAppData === 'function') saveMusicAppData();

    applemusicCloseGlobalEditPlaylistModal();

    // 刷新相关视图
    applemusicLoadCustomPlaylists();
    if (window.applemusicCurrentViewPlaylist) {
        applemusicOpenPlaylistDetail(window.applemusicCurrentViewPlaylist);
    }
    if (typeof showToast === 'function') showToast('保存成功');
}

// ================= 歌单内歌曲更多操作菜单 =================
let applemusicActionSongId = null;

function applemusicSongMenuPlayDirect(event) {
    event.stopPropagation();
    const song = applemusicGetActionSong();
    if (song) {
        applemusicCloseSongMoreMenu();
        applemusicPlaySong(song.id, song.name, song.artist, song.cover);
        applemusicOpenPlayer();
    }
}

function applemusicSongMenuAddToPlaylist() {
    applemusicCloseSongMoreMenu();
    const song = applemusicGetActionSong();
    if (!song) return;

    applemusicDrawerMode = 'add';
    window.applemusicTargetAddSong = song;

    const titleEl = document.getElementById('applemusic-drawer-main-title');
    if (titleEl) titleEl.innerText = '添加到歌单';

    const overlay = document.getElementById('applemusicPlaylistDrawerOverlay');
    const container = document.getElementById('applemusic-drawer-playlist-container');
    const confirmBtn = document.getElementById('applemusic-drawer-confirm-btn');
    if (!overlay || !container) return;

    applemusicSelectedPlaylistId = null;
    if (confirmBtn) confirmBtn.classList.remove('active');
    container.innerHTML = '';

    if (typeof musicAppData === 'undefined' || !musicAppData.customPlaylists || musicAppData.customPlaylists.length === 0) {
        container.innerHTML = '<div style="padding: 30px 0; text-align: center; color: #8e8e93;">暂无自定义歌单，请先在资料库创建</div>';
    } else {
        const playlists = [...musicAppData.customPlaylists].sort((a, b) => b.timestamp - a.timestamp);
        playlists.forEach(pl => {
            const div = document.createElement('div');
            div.className = 'applemusic-drawer-item';
            div.id = 'applemusic-drawer-item-' + pl.id;

            const coverHtml = pl.cover
                ? `<img src="${pl.cover}" style="width:100%; height:100%; object-fit:cover;">`
                : `<svg viewBox="0 0 24 24"><path d="M12 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h4V3h-6z"/></svg>`;

            div.innerHTML = `
                <div class="applemusic-drawer-cover">${coverHtml}</div>
                <div class="applemusic-drawer-info">${pl.title}</div>
                <svg class="applemusic-drawer-check" viewBox="0 0 24 24"><path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/></svg>
            `;
            div.onclick = () => applemusicSelectPlaylist(pl.id);
            container.appendChild(div);
        });
    }

    overlay.classList.add('applemusic-active');
}

function applemusicOpenSongMoreMenu(event, songId, source = '') {
    applemusicActionSongId = songId;
    window.applemusicActionSongSource = source;
    const overlay = document.getElementById('applemusicSongMoreMenuOverlay');
    const menu = document.getElementById('applemusicSongMoreMenu');
    if (!overlay || !menu) return;

    // 针对搜索场景控制功能项显示：喜爱/撤销喜爱、添加至歌单、分享、邀请一起听歌（隐藏删除及其他歌单内部管理项）
    const favItem = document.getElementById('applemusic-song-menu-fav');
    const addPlaylistItem = document.getElementById('applemusic-song-menu-add-playlist');
    const shareItem = document.getElementById('applemusic-song-menu-share');
    const inviteItem = document.getElementById('applemusic-song-menu-invite');
    const editLocalItem = document.getElementById('applemusic-song-menu-edit-local');
    const pinItem = document.getElementById('applemusic-song-menu-pin');
    const moveItem = document.getElementById('applemusic-song-menu-move');
    const playLaterItem = document.getElementById('applemusic-song-menu-play-later');
    const deleteItem = document.getElementById('applemusic-song-menu-delete');

    if (source === 'search') {
        if (favItem) favItem.style.display = 'flex';
        if (addPlaylistItem) addPlaylistItem.style.display = 'flex';
        if (shareItem) shareItem.style.display = 'flex';
        if (inviteItem) inviteItem.style.display = 'flex';
        if (editLocalItem) editLocalItem.style.display = 'none';
        if (pinItem) pinItem.style.display = 'none';
        if (moveItem) moveItem.style.display = 'none';
        if (playLaterItem) playLaterItem.style.display = 'none';
        if (deleteItem) deleteItem.style.display = 'none';
    } else {
        if (favItem) favItem.style.display = 'flex';
        if (addPlaylistItem) addPlaylistItem.style.display = 'none';
        if (shareItem) shareItem.style.display = 'flex';
        if (inviteItem) inviteItem.style.display = 'none';
        if (pinItem) pinItem.style.display = 'flex';
        if (moveItem) moveItem.style.display = 'flex';
        if (playLaterItem) playLaterItem.style.display = 'flex';
        if (deleteItem) deleteItem.style.display = 'flex';
    }

    const song = applemusicGetActionSong();
    const isFav = typeof musicAppData !== 'undefined' && musicAppData.favoriteSongs.some(item => item.id == songId);

    if (song) {
        const coverEl = document.getElementById('applemusic-song-menu-cover');
        const titleEl = document.getElementById('applemusic-song-menu-title');
        const artistEl = document.getElementById('applemusic-song-menu-artist');
        const starEl = document.getElementById('applemusic-song-menu-star');

        if (coverEl) coverEl.src = song.cover || '';
        if (titleEl) titleEl.innerText = song.name || '未知歌曲';
        if (artistEl) artistEl.innerText = song.artist || '未知歌手';

        // 判断是否为收藏心动歌曲，控制五角星显示
        if (starEl) {
            starEl.style.display = isFav ? 'block' : 'none';
        }
    }

    // 判断是否为本地音乐，控制编辑按钮显示（搜索模式下始终隐藏）
    const editLocalBtn = document.getElementById('applemusic-song-menu-edit-local');
    if (editLocalBtn && source !== 'search') {
        editLocalBtn.style.display = (song && song.isLocal) ? 'flex' : 'none';
    }

    // 更新喜爱按钮状态与图标 (实心爱心 / 心碎，灰色调)
    const favText = document.getElementById('applemusic-song-menu-fav-text');
    const favIcon = document.getElementById('applemusic-song-menu-fav-icon');
    if (favText) {
        favText.innerText = isFav ? '撤销喜爱' : '喜爱';
    }
    if (favIcon) {
        favIcon.innerHTML = isFav
            ? `<svg viewBox="0 0 1024 1024" style="width: 20px; height: 20px;" fill="#8e8e93"><path d="M512 640l80-192-224-80 92.448-184.928c-95.2-78.336-236.384-73.12-325.472 15.68a240.96 240.96 0 0 0-2.624 338.912l345.376 344.192c18.912 18.88 49.6 18.88 68.544 0l345.344-344.192a240.928 240.928 0 0 0-2.624-338.912 243.104 243.104 0 0 0-280.32-45.024L480 336l208 80-176 224z"></path></svg>`
            : `<svg viewBox="0 0 1024 1024" style="width: 20px; height: 20px;" fill="#8e8e93"><path d="M32 407.584a279.584 279.584 0 0 1 480-194.944 279.584 279.584 0 0 1 480 194.944 278.144 278.144 0 0 1-113.024 224.512L562.592 892.8a96 96 0 0 1-124.416-1.952l-308.16-270.688A278.976 278.976 0 0 1 32 407.584z"></path></svg>`;
    }

    // 动态更新置顶文字
    const pinText = document.getElementById('applemusic-song-pin-text');
    if (pinText) {
        const isPinned = typeof musicAppData !== 'undefined' && musicAppData.pinnedItems && musicAppData.pinnedItems.some(item => item.id == songId && item.type === 'song');
        pinText.innerText = isPinned ? '取消置顶' : '置顶';
    }

    overlay.style.display = 'block';
    void overlay.offsetWidth; // 强制回流激活硬件加速帧
    overlay.classList.add('applemusic-active');
}

function applemusicCloseSongMoreMenu() {
    const overlay = document.getElementById('applemusicSongMoreMenuOverlay');
    if (!overlay) return;
    overlay.classList.remove('applemusic-active');
    setTimeout(() => {
        overlay.style.display = 'none';
    }, 280);
}

function applemusicGetActionSong() {
    if (!applemusicActionSongId) return null;

    if (window.applemusicActionSongSource === 'search') {
        return (window.applemusicSearchResultsQueue || []).find(song => String(song.id) === String(applemusicActionSongId)) || null;
    }

    const artistView = document.getElementById('applemusic-view-artist');
    if (artistView && artistView.classList.contains('applemusic-active')) {
        return (window.applemusicArtistBrowseQueue || []).find(song => String(song.id) === String(applemusicActionSongId)) || null;
    }

    // 如果在全部歌曲页面
    const allSongsView = document.getElementById('applemusic-view-all-songs');
    if (allSongsView && allSongsView.classList.contains('applemusic-active')) {
        return applemusicAllSongsCache.find(s => s.id == applemusicActionSongId) || null;
    }

    // 如果在已导入页面
    const localSongsView = document.getElementById('applemusic-view-local-songs');
    if (localSongsView && localSongsView.classList.contains('applemusic-active')) {
        return (window.applemusicLocalSongsQueue || []).find(s => String(s.id) === String(applemusicActionSongId)) || null;
    }

    // 支持从当前播放队列或歌手页面队列直接查找
    if (window.applemusicCurrentQueue && window.applemusicCurrentQueue.length > 0) {
        const queueSong = window.applemusicCurrentQueue.find(s => s.id == applemusicActionSongId);
        if (queueSong) return queueSong;
    }

    if (window.applemusicCurrentViewPlaylist) {
        let songs = window.applemusicCurrentViewPlaylist.isFavorite ? musicAppData.favoriteSongs : window.applemusicCurrentViewPlaylist.songs;
        let song = songs.find(s => s.id == applemusicActionSongId);
        if (song) return song;
    }

    if (typeof musicAppData !== 'undefined' && musicAppData.pinnedItems) {
        let pinned = musicAppData.pinnedItems.find(item => item.id == applemusicActionSongId && item.type === 'song');
        if (pinned) {
            return {
                id: pinned.id,
                name: pinned.title,
                artist: pinned.artist,
                cover: pinned.cover
            };
        }
    }

    return null;
}

function applemusicSongMenuToggleFavorite() {
    applemusicCloseSongMoreMenu();
    const song = applemusicGetActionSong();
    if (!song) return;

    const isFav = typeof musicAppData !== 'undefined' && musicAppData.favoriteSongs.some(item => item.id == song.id);
    if (isFav) {
        applemusicRemoveFavoriteSong(song.id);
        if (typeof showToast === 'function') showToast('已撤销喜爱');
    } else {
        applemusicSaveFavoriteSong(song);
        if (typeof showToast === 'function') showToast('已添加至喜爱');
    }
    applemusicCheckIsFavorite(song.id);

    // 如果当前在心动歌曲列表，需要重新渲染
    if (window.applemusicCurrentViewPlaylist && window.applemusicCurrentViewPlaylist.isFavorite) {
        applemusicOpenPlaylistDetail(window.applemusicCurrentViewPlaylist);
    }
}

let applemusicCurrentShareSongTarget = null;
let applemusicSelectedShareContact = null;

async function applemusicShareSong(song) {
    if (!song) song = window.applemusicCurrentPlayingSong;
    if (!song) {
        if (typeof showToast === 'function') showToast('请先选择或播放一首歌曲');
        else alert('请先选择或播放一首歌曲');
        return;
    }

    if (typeof wcReloadContactsFromStorage === 'function') {
        await wcReloadContactsFromStorage();
    }

    let contacts = [];
    if (typeof wcContactsList !== 'undefined' && wcContactsList.length > 0) {
        contacts = wcContactsList;
    } else if (typeof getCharacterList === 'function') {
        contacts = getCharacterList();
    } else if (typeof window.characterList !== 'undefined' && window.characterList.length > 0) {
        contacts = window.characterList;
    }

    if (!contacts || contacts.length === 0) {
        if (typeof showToast === 'function') showToast('暂无联系人可分享');
        else alert('暂无联系人可分享');
        return;
    }

    applemusicCurrentShareSongTarget = song;
    applemusicOpenShareCharModal(song, contacts);
}

function applemusicOpenShareCharModal(song, contacts) {
    const modal = document.getElementById('applemusic-share-char-modal');
    const list = document.getElementById('applemusic-share-char-list');
    const coverEl = document.getElementById('applemusic-share-preview-cover');
    const titleEl = document.getElementById('applemusic-share-preview-title');
    const artistEl = document.getElementById('applemusic-share-preview-artist');
    const sendBtn = document.getElementById('applemusic-share-send-btn');
    if (!modal || !list) return;

    const targetSong = song || applemusicCurrentShareSongTarget || window.applemusicCurrentPlayingSong || {};
    if (coverEl) coverEl.src = targetSong.cover || targetSong.picUrl || 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=120&auto=format&fit=crop&q=80';
    if (titleEl) titleEl.textContent = targetSong.name || targetSong.title || '未知歌曲';
    if (artistEl) artistEl.textContent = targetSong.artist || targetSong.arName || '未知歌手';

    applemusicSelectedShareContact = null;
    window.applemusicCurrentSelectedShareChar = null;
    if (sendBtn) sendBtn.classList.remove('active');

    list.innerHTML = '';
    const charList = contacts || (typeof wcContactsList !== 'undefined' && wcContactsList.length > 0 ? wcContactsList : (typeof getCharacterList === 'function' ? getCharacterList() : (window.characterList || [])));

    if (charList && charList.length > 0) {
        charList.forEach(char => {
            const charId = char.id || '';
            const charName = char.remark || char.name || '角色';
            const charAvatar = char.avatar || char.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80';

            const div = document.createElement('div');
            div.className = 'applemusic-share-char-item';
            div.onclick = function() {
                applemusicSelectShareChar(div, charId, charName);
            };

            div.innerHTML = `
                <div class="applemusic-share-avatar-wrap">
                    <img class="applemusic-share-avatar" src="${charAvatar}" alt="">
                </div>
                <span class="applemusic-share-char-name">${charName}</span>
            `;
            list.appendChild(div);
        });
    } else {
        list.innerHTML = '<div style="font-size: 13px; color: #8e8e93; padding: 12px 20px;">暂无可用联系人</div>';
    }

    modal.style.display = 'flex';
    requestAnimationFrame(() => {
        modal.classList.add('applemusic-active');
    });
}

function applemusicSelectShareChar(el, charId, charName) {
    const container = document.getElementById('applemusic-share-char-list');
    const sendBtn = document.getElementById('applemusic-share-send-btn');
    const isSelected = el.classList.contains('selected');

    if (container) {
        container.querySelectorAll('.applemusic-share-char-item').forEach(item => item.classList.remove('selected'));
    }

    if (!isSelected) {
        el.classList.add('selected');
        applemusicSelectedShareContact = { id: charId, name: charName };
        window.applemusicCurrentSelectedShareChar = charName;
        if (sendBtn) sendBtn.classList.add('active');
    } else {
        applemusicSelectedShareContact = null;
        window.applemusicCurrentSelectedShareChar = null;
        if (sendBtn) sendBtn.classList.remove('active');
    }
}

function applemusicCloseShareCharModal() {
    const modal = document.getElementById('applemusic-share-char-modal');
    if (modal) {
        modal.classList.remove('applemusic-active');
        setTimeout(() => { modal.style.display = 'none'; }, 300);
    }
}

function applemusicExecuteSendShare() {
    if (!applemusicSelectedShareContact) return;
    const targetId = applemusicSelectedShareContact.id;
    const targetName = applemusicSelectedShareContact.name;
    const song = applemusicCurrentShareSongTarget || window.applemusicCurrentPlayingSong;
    if (!song) return;

    const shareText = `[音乐分享] ${song.name} - ${song.artist} | ${song.cover || ''} | ${song.id}`;
    if (typeof wcAppendChatMessage === 'function') {
        wcAppendChatMessage(shareText, 'sent', targetId, null, null, false);
    }
    if (typeof sendMusicToCharacter === 'function') {
        sendMusicToCharacter(targetId || targetName, song);
    }

    if (typeof showToast === 'function') {
        showToast(`已将《${song.name}》分享给 ${targetName}`);
    } else {
        alert(`已将《${song.name}》分享给 ${targetName}`);
    }

    applemusicCloseShareCharModal();
}

function applemusicSongMenuShare() {
    applemusicCloseSongMoreMenu();
    const song = applemusicGetActionSong() || window.applemusicCurrentPlayingSong;
    applemusicShareSong(song);
}

function applemusicSongMenuPin() {
    applemusicCloseSongMoreMenu();
    if (!window.applemusicCurrentViewPlaylist || !applemusicActionSongId) return;

    let pl = window.applemusicCurrentViewPlaylist;
    let songs = pl.isFavorite ? musicAppData.favoriteSongs : pl.songs;

    const index = songs.findIndex(s => s.id == applemusicActionSongId);
    if (index > 0) {
        const song = songs.splice(index, 1)[0];
        songs.unshift(song);
        if (typeof saveMusicAppData === 'function') saveMusicAppData();
        applemusicOpenPlaylistDetail(pl);
        if (typeof showToast === 'function') showToast('已置顶');
    }
}

function applemusicSongMenuMove() {
    applemusicCloseSongMoreMenu();
    const song = applemusicGetActionSong();
    if (!song) return;

    applemusicDrawerMode = 'move';
    const titleEl = document.getElementById('applemusic-drawer-main-title');
    if (titleEl) titleEl.innerText = '移动到歌单';

    const overlay = document.getElementById('applemusicPlaylistDrawerOverlay');
    const container = document.getElementById('applemusic-drawer-playlist-container');
    const confirmBtn = document.getElementById('applemusic-drawer-confirm-btn');
    if (!overlay || !container) return;

    applemusicSelectedPlaylistId = null;
    if (confirmBtn) confirmBtn.classList.remove('active');
    container.innerHTML = '';

    if (typeof musicAppData === 'undefined' || !musicAppData.customPlaylists || musicAppData.customPlaylists.length === 0) {
        container.innerHTML = '<div style="padding: 30px 0; text-align: center; color: #8e8e93;">暂无自定义歌单，请先在资料库创建</div>';
    } else {
        const playlists = [...musicAppData.customPlaylists].sort((a, b) => b.timestamp - a.timestamp);
        playlists.forEach(pl => {
            // 排除当前所在的歌单
            if (window.applemusicCurrentViewPlaylist && pl.id === window.applemusicCurrentViewPlaylist.id) return;

            const div = document.createElement('div');
            div.className = 'applemusic-drawer-item';
            div.id = 'applemusic-drawer-item-' + pl.id;

            const coverHtml = pl.cover
                ? `<img src="${pl.cover}" style="width:100%; height:100%; object-fit:cover;">`
                : `<svg viewBox="0 0 24 24"><path d="M12 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h4V3h-6z"/></svg>`;

            div.innerHTML = `
                <div class="applemusic-drawer-cover">${coverHtml}</div>
                <div class="applemusic-drawer-info">${pl.title}</div>
                <svg class="applemusic-drawer-check" viewBox="0 0 24 24"><path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/></svg>
            `;
            div.onclick = () => applemusicSelectPlaylist(pl.id);
            container.appendChild(div);
        });

        if (container.innerHTML === '') {
            container.innerHTML = '<div style="padding: 30px 0; text-align: center; color: #8e8e93;">没有其他可移动的歌单</div>';
        }
    }

    overlay.classList.add('applemusic-active');
}

function applemusicSongMenuPlayLater() {
    applemusicCloseSongMoreMenu();
    const song = applemusicGetActionSong();
    if (!song) return;

    if (!window.applemusicCurrentQueue) window.applemusicCurrentQueue = [];

    // 移除队列中已有的该歌曲
    window.applemusicCurrentQueue = window.applemusicCurrentQueue.filter(s => s.id != song.id);
    window.applemusicCurrentQueue.push(song);

    if (window.wcMusicActionLogs) window.wcMusicActionLogs.push(`User 将歌曲 ${song.name} - ${song.artist} 添加到了播放列表`);

    applemusicRenderUpNextList();
    if (typeof showToast === 'function') showToast('已添加到最后播放');
}

function applemusicSongMenuDelete() {
    applemusicCloseSongMoreMenu();
    if (!applemusicActionSongId) return;

    const doDelete = () => {
        let isPinnedDeleted = false;
        if (typeof musicAppData !== 'undefined' && musicAppData.pinnedItems) {
            const initialLength = musicAppData.pinnedItems.length;
            musicAppData.pinnedItems = musicAppData.pinnedItems.filter(item => !(item.id == applemusicActionSongId && item.type === 'song'));
            if (musicAppData.pinnedItems.length < initialLength) {
                applemusicRenderPinnedItems();
                isPinnedDeleted = true;
                if (typeof saveMusicAppData === 'function') saveMusicAppData();
            }
        }

        if (!window.applemusicCurrentViewPlaylist) {
            if (isPinnedDeleted) {
                if (typeof showToast === 'function') showToast('已取消置顶');
            }

            // 如果在歌手页面，执行歌手歌曲删除逻辑
            const artistView = document.getElementById('applemusic-view-artist');
            if (artistView && artistView.classList.contains('applemusic-active') && window.applemusicCurrentArtist) {
                const artistId = window.applemusicCurrentArtist.id;
                if (typeof musicAppData !== 'undefined') {
                    if (!musicAppData.artistCustomData) musicAppData.artistCustomData = {};
                    let currentSongs = window.applemusicArtistBrowseQueue || [];
                    currentSongs = currentSongs.filter(s => s.id != applemusicActionSongId);
                    musicAppData.artistCustomData[artistId] = {
                        ...(musicAppData.artistCustomData[artistId] || {}),
                        name: window.applemusicCurrentArtist.name,
                        pic: window.applemusicCurrentArtist.pic,
                        songs: currentSongs
                    };
                    if (typeof saveMusicAppData === 'function') saveMusicAppData();
                    applemusicOpenArtistProfile(artistId, window.applemusicCurrentArtist.name, window.applemusicCurrentArtist.pic);
                    if (typeof showToast === 'function') showToast('已从艺人歌曲中移除');
                }
                return;
            }

            // 如果在已导入页面，执行彻底删除逻辑
            const localSongsView = document.getElementById('applemusic-view-local-songs');
            if (localSongsView && localSongsView.classList.contains('applemusic-active')) {
                if (typeof musicAppData !== 'undefined') {
                    musicAppData.favoriteSongs = musicAppData.favoriteSongs.filter(s => s.id != applemusicActionSongId);
                    if (musicAppData.customPlaylists) {
                        musicAppData.customPlaylists.forEach(pl => {
                            if (pl.songs) {
                                pl.songs = pl.songs.filter(s => s.id != applemusicActionSongId);
                            }
                        });
                    }
                    if (typeof saveMusicAppData === 'function') saveMusicAppData();
                    applemusicRenderLocalSongs();
                    if (typeof showToast === 'function') showToast('已彻底删除该本地歌曲');
                }
            }
            return;
        }

        let pl = window.applemusicCurrentViewPlaylist;

        if (pl.isFavorite) {
            applemusicRemoveFavoriteSong(applemusicActionSongId);
            applemusicOpenPlaylistDetail(pl);
            if (typeof showToast === 'function') showToast('已从喜爱中移除');
        } else {
            pl.songs = pl.songs.filter(s => s.id != applemusicActionSongId);

            // 更新数据库
            const index = musicAppData.customPlaylists.findIndex(p => p.id === pl.id);
            if (index !== -1) {
                musicAppData.customPlaylists[index] = pl;
                if (typeof saveMusicAppData === 'function') saveMusicAppData();
            }

            applemusicOpenPlaylistDetail(pl);
            if (typeof showToast === 'function') showToast('已删除');
        }
    };

    if (typeof showCustomConfirm === 'function') {
        showCustomConfirm('提示', '确定要删除此歌曲吗？', '确定', '取消').then(res => {
            if (res) doDelete();
        });
    } else {
        if (confirm('确定要删除此歌曲吗？')) doDelete();
    }
}

function applemusicSongMenuEditLocal() {
    applemusicCloseSongMoreMenu();
    const song = applemusicGetActionSong();
    if (!song || !song.isLocal) return;

    window.applemusicEditingLocalSongId = song.id;

    const modal = document.getElementById('applemusic-modal-local-music');
    if(modal) modal.classList.add('applemusic-active');

    // 隐藏“添加到歌单”选项（编辑时不改变所属歌单）
    const playlistGroup = document.getElementById('applemusic-local-playlist-group');
    if (playlistGroup) playlistGroup.style.display = 'none';

    // 回显数据
    document.getElementById('applemusic-local-audio-file').value = '';

    if (song.url && song.url.startsWith('data:')) {
        document.getElementById('applemusic-local-audio-url').value = '';
        document.getElementById('applemusic-local-audio-filename').innerText = '已包含本地音频数据';
        applemusicLocalAudioBase64 = song.url;
    } else {
        document.getElementById('applemusic-local-audio-url').value = song.url || '';
        document.getElementById('applemusic-local-audio-filename').innerText = '';
        applemusicLocalAudioBase64 = "";
    }

    document.getElementById('applemusic-local-song-name').value = song.name || '';
    document.getElementById('applemusic-local-song-artist').value = song.artist || '';
    document.getElementById('applemusic-local-lyric-file').value = '';
    document.getElementById('applemusic-local-lyric-filename').innerText = '';

    applemusicLocalLyricText = song.lyric || "";
    applemusicLocalSongCoverBase64 = song.cover || "";

    const coverImg = document.getElementById('applemusic-local-song-cover');
    const cameraIcon = document.getElementById('applemusic-local-camera-icon');
    if(song.cover) {
        if(coverImg) {
            coverImg.src = song.cover;
            coverImg.style.display = 'block';
        }
        if(cameraIcon) cameraIcon.style.display = 'none';
    } else {
        if(coverImg) coverImg.style.display = 'none';
        if(cameraIcon) cameraIcon.style.display = 'flex';
    }
}

// ================= 置顶核心逻辑 =================

// 渲染置顶九宫格
function applemusicRenderPinnedItems() {
    const container = document.getElementById('applemusic-pinned-container');
    if (!container) return;
    container.innerHTML = '';

    if (typeof musicAppData === 'undefined' || !musicAppData.pinnedItems || musicAppData.pinnedItems.length === 0) {
        return;
    }

    const items = musicAppData.pinnedItems;

    // 核心排版算法：从后往前每3个切分为一行，实现“底部优先排满，顶部居中”
    let rows = [];
    let tempItems = [...items];
    while (tempItems.length > 0) {
        let takeCount = Math.min(3, tempItems.length);
        let rowItems = tempItems.splice(-takeCount, takeCount);
        rows.unshift(rowItems); // 插入到头部，保证顺序
    }

    rows.forEach(row => {
        const rowDiv = document.createElement('div');
        rowDiv.className = 'applemusic-pinned-row';

        row.forEach(item => {
            const div = document.createElement('div');
            div.className = 'applemusic-pinned-item';

            let coverHtml = '';
            if (item.cover) {
                coverHtml = `<img src="${item.cover}" style="width:100%; height:100%; object-fit:cover; border-radius:12px;">`;
            } else if (item.id === 'favorite') {
                coverHtml = `<svg viewBox="0 0 24 24" fill="var(--theme-active)"><path d="M11.1 2.41c.31-.8 1.49-.8 1.8 0l2.2 5.67a1 1 0 00.83.6l6.05.46c.85.06 1.2 1.12.55 1.68l-4.64 3.97a1 1 0 00-.32 1l1.38 5.9c.2.85-.68 1.49-1.4 1.05l-5.18-3.15a1 1 0 00-1.04 0l-5.18 3.15c-.72.44-1.6-.2-1.4-1.05l1.38-5.9a1 1 0 00-.32-1L1.17 10.82c-.65-.56-.3-1.62.55-1.68l6.05-.46a1 1 0 00.83-.6l2.2-5.67z"/></svg>`;
            } else {
                coverHtml = `<svg viewBox="0 0 24 24"><path d="M12 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h4V3h-6z"/></svg>`;
            }

            div.innerHTML = `
                <div class="applemusic-pinned-cover">${coverHtml}</div>
                <div class="applemusic-pinned-title">${item.title}</div>
            `;

            // 长按事件逻辑
            let pressTimer;
            let isLongPress = false;

            const startPress = (e) => {
                isLongPress = false;
                pressTimer = setTimeout(() => {
                    isLongPress = true;
                    if (item.type === 'song') {
                        applemusicOpenSongMoreMenuFromPin(e, item.id, div);
                    } else if (item.type === 'playlist') {
                        applemusicOpenPlaylistMoreMenuFromPin(e, item, div);
                    }
                }, 500);
            };
            const cancelPress = () => {
                clearTimeout(pressTimer);
            };

            div.addEventListener('touchstart', startPress, {passive: true});
            div.addEventListener('touchend', cancelPress);
            div.addEventListener('touchmove', cancelPress);
            div.addEventListener('mousedown', startPress);
            div.addEventListener('mouseup', cancelPress);
            div.addEventListener('mouseleave', cancelPress);

            // 点击事件
            div.onclick = (e) => {
                if (isLongPress) {
                    e.preventDefault();
                    e.stopPropagation();
                    return;
                }
                if (item.type === 'playlist') {
                    if (item.id === 'favorite') {
                        const favMeta = musicAppData.favoritePlaylistMeta || { title: '心动歌曲', cover: '' };
                        applemusicOpenPlaylistDetail({ id: 'favorite', title: favMeta.title, cover: favMeta.cover, isFavorite: true });
                    } else {
                        const pl = musicAppData.customPlaylists.find(p => p.id === item.id);
                        if (pl) applemusicOpenPlaylistDetail(pl);
                    }
                } else if (item.type === 'song') {
                    applemusicPlaySong(item.id, item.title, item.artist, item.cover);
                    applemusicOpenPlayer();
                }
            };

            rowDiv.appendChild(div);
        });
        container.appendChild(rowDiv);
    });
}

// 歌单置顶/取消置顶
function applemusicTogglePlaylistPin() {
    applemusicClosePlaylistMoreMenu();
    if (!window.applemusicCurrentViewPlaylist || typeof musicAppData === 'undefined') return;

    if (!musicAppData.pinnedItems) musicAppData.pinnedItems = [];

    const pl = window.applemusicCurrentViewPlaylist;
    const plId = pl.isFavorite ? 'favorite' : pl.id;
    const index = musicAppData.pinnedItems.findIndex(item => item.id === plId && item.type === 'playlist');

    if (index !== -1) {
        musicAppData.pinnedItems.splice(index, 1);
        if (typeof showToast === 'function') showToast('已取消置顶');
    } else {
        if (musicAppData.pinnedItems.length >= 9) {
            if (typeof showToast === 'function') showToast('最多只能置顶9个项目');
            else alert('最多只能置顶9个项目');
            return;
        }
        musicAppData.pinnedItems.push({
            id: plId,
            type: 'playlist',
            title: pl.title,
            cover: pl.cover || ''
        });
        if (typeof showToast === 'function') showToast('已置顶歌单');
    }

    if (typeof saveMusicAppData === 'function') saveMusicAppData();
    applemusicRenderPinnedItems();
}

// 歌曲置顶/取消置顶
function applemusicSongMenuPin() {
    applemusicCloseSongMoreMenu();
    const song = applemusicGetActionSong();
    if (!song || typeof musicAppData === 'undefined') return;

    if (!musicAppData.pinnedItems) musicAppData.pinnedItems = [];

    const index = musicAppData.pinnedItems.findIndex(item => item.id == song.id && item.type === 'song');

    if (index !== -1) {
        musicAppData.pinnedItems.splice(index, 1);
        if (typeof showToast === 'function') showToast('已取消置顶');
    } else {
        if (musicAppData.pinnedItems.length >= 9) {
            if (typeof showToast === 'function') showToast('最多只能置顶9个项目');
            else alert('最多只能置顶9个项目');
            return;
        }
        musicAppData.pinnedItems.push({
            id: song.id,
            type: 'song',
            title: song.name,
            artist: song.artist,
            cover: song.cover || ''
        });
        if (typeof showToast === 'function') showToast('已置顶歌曲');
    }

    if (typeof saveMusicAppData === 'function') saveMusicAppData();
    applemusicRenderPinnedItems();
}

// ================= 置顶长按菜单支持 =================
function applemusicOpenSongMoreMenuFromPin(event, songId, element) {
    applemusicActionSongId = songId;
    window.applemusicCurrentViewPlaylist = null; // 明确当前不在歌单视图中

    const overlay = document.getElementById('applemusicSongMoreMenuOverlay');
    const menu = document.getElementById('applemusicSongMoreMenu');
    if (!overlay || !menu) return;

    overlay.style.display = 'block';

    // 更新喜爱按钮状态 (保持纯净五角星)
    const favText = document.getElementById('applemusic-song-menu-fav-text');
    if (favText) {
        const isFav = typeof musicAppData !== 'undefined' && musicAppData.favoriteSongs.some(item => item.id == songId);
        favText.innerText = isFav ? '撤销喜爱' : '喜爱';
    }

    // 动态更新置顶文字
    const pinText = document.getElementById('applemusic-song-pin-text');
    if (pinText) {
        pinText.innerText = '取消置顶'; // 从置顶里长按出来的，必定是已置顶
    }

    // 动态定位
    const rect = element.getBoundingClientRect();
    let top = rect.bottom + 10;
    let left = rect.left + (rect.width / 2) - 110;
    if (left < 10) left = 10;
    if (left + 220 > window.innerWidth) left = window.innerWidth - 230;

    if (top + 350 > window.innerHeight) {
        top = rect.top - 360;
        menu.style.transformOrigin = 'bottom center';
    } else {
        menu.style.transformOrigin = 'top center';
    }

    menu.style.top = top + 'px';
    menu.style.left = left + 'px';
}

function applemusicOpenPlaylistMoreMenuFromPin(event, item, element) {
    // 模拟设置当前查看的歌单，以便菜单逻辑能正常工作
    if (item.id === 'favorite') {
        const favMeta = musicAppData.favoritePlaylistMeta || { title: '心动歌曲', cover: '' };
        window.applemusicCurrentViewPlaylist = { id: 'favorite', title: favMeta.title, cover: favMeta.cover, isFavorite: true };
    } else {
        window.applemusicCurrentViewPlaylist = musicAppData.customPlaylists.find(p => p.id === item.id);
    }

    const overlay = document.getElementById('applemusicPlaylistMoreMenuOverlay');
    const menu = document.getElementById('applemusicPlaylistMoreMenu');
    if (!overlay || !menu) return;

    overlay.style.display = 'block';

    const pinText = document.getElementById('applemusic-playlist-pin-text');
    if (pinText) {
        pinText.innerText = '取消置顶';
    }

    const rect = element.getBoundingClientRect();
    let top = rect.bottom + 10;
    let left = rect.left + (rect.width / 2) - 110;
    if (left < 10) left = 10;
    if (left + 220 > window.innerWidth) left = window.innerWidth - 230;

    if (top + 300 > window.innerHeight) {
        top = rect.top - 310;
        menu.style.transformOrigin = 'bottom center';
    } else {
        menu.style.transformOrigin = 'top center';
    }

    menu.style.top = top + 'px';
    menu.style.left = left + 'px';
}

// ================= 全部歌曲逻辑 =================
function applemusicOpenAllSongs() {
    applemusicSwitchView('all-songs');
    const searchInput = document.getElementById('applemusic-all-songs-search-input');
    if (searchInput) searchInput.value = '';

    applemusicAllSongsCache = applemusicGetAllSongs();
    applemusicRenderAllSongs(applemusicAllSongsCache);
}

function applemusicGetAllSongs() {
    if (typeof musicAppData === 'undefined') return [];

    const songMap = new Map();

    // 收集心动歌曲
    if (musicAppData.favoriteSongs) {
        musicAppData.favoriteSongs.forEach(song => {
            if (!songMap.has(song.id)) songMap.set(song.id, song);
        });
    }

    // 收集自定义歌单歌曲
    if (musicAppData.customPlaylists) {
        musicAppData.customPlaylists.forEach(pl => {
            if (pl.songs) {
                pl.songs.forEach(song => {
                    if (!songMap.has(song.id)) songMap.set(song.id, song);
                });
            }
        });
    }

    return Array.from(songMap.values());
}

function applemusicRenderAllSongs(songs) {
    const container = document.getElementById('applemusic-all-songs-list');
    if (!container) return;

    container.innerHTML = '';

    if (songs.length === 0) {
        container.innerHTML = '<div style="padding: 20px; text-align: center; color: var(--text-secondary);">暂无歌曲</div>';
        return;
    }

    // Keep the current queue until the user selects a song.

    songs.forEach(song => {
        const div = document.createElement('div');
        div.className = 'applemusic-playlist-detail-song-item';
        div.onclick = () => {
            window.applemusicCurrentQueue = songs.slice();
            window.applemusicCurrentQueueSource = '全部歌曲';
            applemusicPlaySong(song.id, song.name, song.artist, song.cover);
        };

        div.innerHTML = `
            <img src="${song.cover}" class="applemusic-playlist-detail-song-cover" style="margin-left: 10px;">
            <div class="applemusic-playlist-detail-song-info">
                <div class="applemusic-playlist-detail-song-name">${song.name}</div>
                <div class="applemusic-playlist-detail-song-artist">${song.artist}</div>
            </div>
            <svg class="applemusic-playlist-detail-song-more" viewBox="0 0 24 24" onclick="event.stopPropagation(); applemusicOpenSongMoreMenu(event, '${song.id}')"><path d="M6 10c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm12 0c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm-6 0c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z"/></svg>
        `;
        container.appendChild(div);
    });
}

function applemusicFilterAllSongs() {
    const keyword = document.getElementById('applemusic-all-songs-search-input').value.trim().toLowerCase();
    if (!keyword) {
        applemusicRenderAllSongs(applemusicAllSongsCache);
        return;
    }

    const filtered = applemusicAllSongsCache.filter(song =>
        song.name.toLowerCase().includes(keyword) ||
        song.artist.toLowerCase().includes(keyword)
    );

    applemusicRenderAllSongs(filtered);
}

// ================= 已导入歌曲逻辑 =================
function applemusicOpenLocalSongsView() {
    applemusicSwitchView('local-songs');
    applemusicRenderLocalSongs();
}

function applemusicRenderLocalSongs() {
    const container = document.getElementById('applemusic-local-songs-list');
    if (!container) return;

    container.innerHTML = '';

    if (typeof musicAppData === 'undefined') {
        container.innerHTML = '<div style="padding: 20px; text-align: center; color: var(--text-secondary);">暂无数据</div>';
        return;
    }

    const localSongsMap = new Map();

    if (musicAppData.favoriteSongs) {
        musicAppData.favoriteSongs.forEach(song => {
            if (song.isLocal && !localSongsMap.has(song.id)) localSongsMap.set(song.id, song);
        });
    }

    if (musicAppData.customPlaylists) {
        musicAppData.customPlaylists.forEach(pl => {
            if (pl.songs) {
                pl.songs.forEach(song => {
                    if (song.isLocal && !localSongsMap.has(song.id)) localSongsMap.set(song.id, song);
                });
            }
        });
    }

    const localSongs = Array.from(localSongsMap.values()).sort((a, b) => b.timestamp - a.timestamp);

    if (localSongs.length === 0) {
        container.innerHTML = '<div style="padding: 20px; text-align: center; color: var(--text-secondary);">暂无已导入的本地音乐</div>';
        return;
    }

    window.applemusicLocalSongsQueue = localSongs;

    localSongs.forEach(song => {
        const div = document.createElement('div');
        div.className = 'applemusic-playlist-detail-song-item';
        div.onclick = () => {
            window.applemusicCurrentQueue = localSongs.slice();
            window.applemusicCurrentQueueSource = '已导入';
            applemusicPlaySong(song.id, song.name, song.artist, song.cover);
        };

        div.innerHTML = `
            <img src="${song.cover}" class="applemusic-playlist-detail-song-cover" style="margin-left: 10px;">
            <div class="applemusic-playlist-detail-song-info">
                <div class="applemusic-playlist-detail-song-name">${song.name}</div>
                <div class="applemusic-playlist-detail-song-artist">${song.artist}</div>
            </div>
            <svg class="applemusic-playlist-detail-song-more" viewBox="0 0 24 24" onclick="event.stopPropagation(); applemusicOpenSongMoreMenu(event, '${song.id}')"><path d="M6 10c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm12 0c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm-6 0c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z"/></svg>
        `;
        container.appendChild(div);
    });
}

// ================= 收藏艺人逻辑 =================
function applemusicOpenFavoriteArtists() {
    applemusicSwitchView('favorite-artists');
    const searchInput = document.getElementById('applemusic-fav-artists-search-input');
    if (searchInput) searchInput.value = '';

    if (typeof musicAppData !== 'undefined' && musicAppData.favoriteArtists) {
        applemusicFavArtistsCache = [...musicAppData.favoriteArtists].sort((a, b) => b.timestamp - a.timestamp);
    } else {
        applemusicFavArtistsCache = [];
    }

    applemusicRenderFavArtists(applemusicFavArtistsCache);
}

function applemusicRenderFavArtists(artists) {
    const container = document.getElementById('applemusic-fav-artists-list');
    if (!container) return;

    container.innerHTML = '';

    if (artists.length === 0) {
        container.innerHTML = '<div style="padding: 20px; text-align: center; color: var(--text-secondary);">暂无收藏的艺人</div>';
        return;
    }

    artists.forEach(artist => {
        const div = document.createElement('div');
        div.className = 'applemusic-playlist-detail-song-item';
        div.onclick = () => {
            window.applemusicArtistBackView = 'favorite-artists';
            applemusicOpenArtistProfile(artist.id, artist.name, artist.pic);
        };

        div.innerHTML = `
            <img src="${artist.pic}" class="applemusic-playlist-detail-song-cover" style="margin-left: 10px; border-radius: 50%;">
            <div class="applemusic-playlist-detail-song-info">
                <div class="applemusic-playlist-detail-song-name">${artist.name}</div>
            </div>
            <svg class="applemusic-lib-list-chevron" viewBox="0 0 24 24" style="width: 16px; height: 16px; fill: #c7c7cc; margin-right: 10px;"><path d="M8.59 16.59L13.17 12 8.59 7.41 10 6l6 6-6 6-1.41-1.41z"/></svg>
        `;
        container.appendChild(div);
    });
}

function applemusicFilterFavArtists() {
    const keyword = document.getElementById('applemusic-fav-artists-search-input').value.trim().toLowerCase();
    if (!keyword) {
        applemusicRenderFavArtists(applemusicFavArtistsCache);
        return;
    }

    const filtered = applemusicFavArtistsCache.filter(artist =>
        artist.name.toLowerCase().includes(keyword)
    );

    applemusicRenderFavArtists(filtered);
}

// ================= 设置页面逻辑 =================
function applemusicClearCache() {
    if (typeof showToast === 'function') {
        showToast('缓存已清理');
    } else {
        alert('缓存已清理');
    }
}

function applemusicLogout() {
    if (confirm('确定要退出登录吗？')) {
        closeMusicApp();
        if (typeof showToast === 'function') {
            showToast('已退出登录');
        }
    }
}

// ================= 音乐源 API 管理逻辑 =================
function applemusicGetApiBaseUrl() {
    if (applemusicApiConfig.type === 'custom' && applemusicApiConfig.customUrl.trim() !== '') {
        let url = applemusicApiConfig.customUrl.trim();
        return url.endsWith('/') ? url.slice(0, -1) : url;
    }
    return applemusicBuiltinApis[applemusicApiConfig.builtinIndex].url;
}

function applemusicInitApiSettings() {
    try {
        const saved = localStorage.getItem('applemusicApiConfig');
        if (saved) {
            applemusicApiConfig = JSON.parse(saved);
        }
    } catch(e) {}
    applemusicUpdateApiUI();
}

function applemusicUpdateApiUI() {
    // 更新设置页显示的名称
    const nameEl = document.getElementById('applemusic-current-api-name');
    if (nameEl) {
        if (applemusicApiConfig.type === 'custom' && applemusicApiConfig.customUrl && applemusicApiConfig.customUrl.trim() !== '') {
            nameEl.innerText = '自定义源';
        } else {
            const curApi = applemusicBuiltinApis[applemusicApiConfig.builtinIndex];
            nameEl.innerText = curApi ? curApi.name : '在线接口';
        }
    }

    // 更新自定义 API 输入框
    const customInput = document.getElementById('applemusic-custom-api-input');
    if (customInput) customInput.value = applemusicApiConfig.customUrl || '';

    // 更新自定义源启用开关
    const customToggle = document.getElementById('applemusic-custom-api-toggle');
    if (customToggle) {
        if (applemusicApiConfig.type === 'custom' && applemusicApiConfig.customUrl && applemusicApiConfig.customUrl.trim() !== '') {
            customToggle.classList.add('active');
        } else {
            customToggle.classList.remove('active');
        }
    }
}

let applemusicQrTimer = null;

function applemusicStartQrLogin() {
    // 备用接口 1 和备用接口 2 不支持扫码登录
    if (applemusicApiConfig.type === 'builtin' && (applemusicApiConfig.builtinIndex === 2 || applemusicApiConfig.builtinIndex === 3)) {
        if (typeof showToast === 'function') showToast('当前备用接口不支持扫码登录，请切换为主接口或在线接口');
        else alert('当前备用接口不支持扫码登录，请切换为主接口或在线接口');
        return;
    }

    let baseUrl = applemusicGetApiBaseUrl();

    const modal = document.getElementById('applemusic-qr-modal');
    const imgContainer = document.getElementById('applemusic-qr-img-container');
    const statusText = document.getElementById('applemusic-qr-status');

    if (modal) modal.style.display = 'flex';
    if (imgContainer) imgContainer.innerHTML = '<span style="color: #8e8e93; font-size: 14px;">加载中...</span>';
    if (statusText) {
        statusText.innerText = '正在获取二维码...';
        statusText.style.color = 'var(--text-main)';
    }

    if (applemusicApiConfig.type === 'builtin' && applemusicApiConfig.builtinIndex === 0) {
        // 主接口扫码
        fetch(`${baseUrl}/login/qr/key?timestamp=${Date.now()}`)
            .then(res => res.json())
            .then(data => {
                const unikey = data.unikey || data.data?.unikey;
                const qrImg = data.qrImg || data.data?.qrimg;
                if (unikey) {
                    const finalImg = qrImg || `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent('https://music.163.com/login?codekey=' + unikey)}`;
                    if (imgContainer) imgContainer.innerHTML = `<img src="${finalImg}" style="width: 100%; height: 100%; object-fit: contain;">`;
                    if (statusText) statusText.innerText = '请使用网易云音乐 APP 扫码';
                    applemusicPollQrStatus(baseUrl, unikey);
                } else {
                    throw new Error('获取 key 失败');
                }
            })
            .catch(err => {
                console.error(err);
                if (imgContainer) imgContainer.innerHTML = '<span style="color: #ff3b30; font-size: 14px;">加载失败</span>';
                if (statusText) {
                    statusText.innerText = '请检查主接口 API 连接';
                    statusText.style.color = '#ff3b30';
                }
            });
    } else {
        // 在线接口 / 自定义源扫码
        fetch(`${baseUrl}/login/qr/key?timestamp=${Date.now()}`)
            .then(res => res.json())
            .then(data => {
                const key = data.data?.unikey || data.unikey;
                if (key) {
                    // 直接生成可靠的二维码图片并启动轮询
                    const qrImg = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent('https://music.163.com/login?codekey=' + key)}`;
                    if (imgContainer) imgContainer.innerHTML = `<img src="${qrImg}" style="width: 100%; height: 100%; object-fit: contain;">`;
                    if (statusText) statusText.innerText = '请使用网易云音乐 APP 扫码';
                    applemusicPollQrStatus(baseUrl, key);
                } else {
                    throw new Error('获取 key 失败');
                }
            })
            .catch(err => {
                console.error(err);
                if (imgContainer) imgContainer.innerHTML = '<span style="color: #ff3b30; font-size: 14px;">加载失败</span>';
                if (statusText) {
                    statusText.innerText = '获取扫码二维码失败';
                    statusText.style.color = '#ff3b30';
                }
            });
    }
}

function applemusicPollQrStatus(baseUrl, key) {
    if (applemusicQrTimer) clearInterval(applemusicQrTimer);

    applemusicQrTimer = setInterval(() => {
        fetch(`${baseUrl}/login/qr/check?key=${key}&timestamp=${Date.now()}`)
            .then(res => res.json())
            .then(data => {
                const statusText = document.getElementById('applemusic-qr-status');
                if (!statusText) return;

                if (data.code === 800) {
                    statusText.innerText = '二维码已过期，请重新打开';
                    statusText.style.color = '#ff3b30';
                    clearInterval(applemusicQrTimer);
                } else if (data.code === 801) {
                    statusText.innerText = '等待扫码...';
                } else if (data.code === 802) {
                    statusText.innerText = '已扫码，等待确认...';
                    statusText.style.color = '#007aff';
                } else if (data.code === 803) {
                    statusText.innerText = '登录成功！正在同步歌单...';
                    statusText.style.color = '#34c759';
                    clearInterval(applemusicQrTimer);
                    const cookie = data.cookie || '';
                    applemusicHandleQrLoginSuccess(baseUrl, cookie);
                }
            })
            .catch(err => {
                console.error('轮询状态失败', err);
            });
    }, 3000);
}

function applemusicCloseQrModal() {
    const modal = document.getElementById('applemusic-qr-modal');
    if (modal) modal.style.display = 'none';
    if (applemusicQrTimer) {
        clearInterval(applemusicQrTimer);
        applemusicQrTimer = null;
    }
}

function applemusicHandleLoginButtonClick() {
    if (applemusicNeteaseUser && applemusicNeteaseUser.uid) {
        applemusicOpenUserProfileModal();
    } else {
        applemusicStartQrLogin();
    }
}

function applemusicOpenUserProfileModal() {
    const modal = document.getElementById('applemusic-user-profile-modal');
    if (!modal || !applemusicNeteaseUser) return;

    const avatar = document.getElementById('applemusic-user-modal-avatar');
    const name = document.getElementById('applemusic-user-modal-name');
    const uid = document.getElementById('applemusic-user-modal-uid');
    const vipBadge = document.getElementById('applemusic-user-modal-vip-badge');

    if (avatar) avatar.src = applemusicNeteaseUser.avatarUrl || '';
    if (name) name.innerText = applemusicNeteaseUser.nickname || '网易云用户';
    if (uid) uid.innerText = `UID: ${applemusicNeteaseUser.uid}`;

    if (vipBadge) {
        if (applemusicNeteaseUser.isSvip) {
            vipBadge.innerText = 'SVIP';
            vipBadge.style.display = 'block';
            vipBadge.style.background = 'linear-gradient(135deg, #d4af37 0%, #aa7c11 100%)';
        } else if (applemusicNeteaseUser.isVip) {
            vipBadge.innerText = 'VIP';
            vipBadge.style.display = 'block';
            vipBadge.style.background = '#222224';
        } else {
            vipBadge.style.display = 'none';
        }
    }

    modal.style.display = 'flex';
}

function applemusicCloseUserProfileModal() {
    const modal = document.getElementById('applemusic-user-profile-modal');
    if (modal) modal.style.display = 'none';
}

function applemusicNeteaseLogout() {
    applemusicNeteaseUser = null;
    try {
        localStorage.removeItem('applemusicNeteaseUser');
    } catch(e) {}

    applemusicCloseUserProfileModal();
    applemusicUpdateNeteaseUserUI();
    if (typeof showToast === 'function') showToast('已退出网易云账号');
}

async function applemusicHandleQrLoginSuccess(baseUrl, cookie) {
    try {
        let uid = '';
        let nickname = '网易云用户';
        let avatarUrl = '';
        let vipType = 0;
        let isVip = false;
        let isSvip = false;

        if (applemusicApiConfig.type === 'builtin' && applemusicApiConfig.builtinIndex === 0) {
            // 主接口账号信息获取（双重兼容 /user/account 与 /login/status，兼容 account.id 与 profile.userId）
            let accountData = null;
            try {
                const accountRes = await fetch(`${baseUrl}/user/account?cookie=${encodeURIComponent(cookie)}&timestamp=${Date.now()}`);
                accountData = await accountRes.json();
            } catch(e) {}

            uid = accountData?.profile?.userId || accountData?.account?.id || accountData?.data?.profile?.userId || accountData?.data?.account?.id || '';
            nickname = accountData?.profile?.nickname || accountData?.data?.profile?.nickname || accountData?.account?.userName || '';
            avatarUrl = accountData?.profile?.avatarUrl || accountData?.data?.profile?.avatarUrl || '';
            vipType = accountData?.profile?.vipType || accountData?.data?.profile?.vipType || 0;

            if (!uid) {
                try {
                    const statusRes = await fetch(`${baseUrl}/login/status?timestamp=${Date.now()}&cookie=${encodeURIComponent(cookie)}`);
                    const statusData = await statusRes.json();
                    uid = statusData?.data?.profile?.userId || statusData?.data?.account?.id || statusData?.profile?.userId || statusData?.account?.id || '';
                    if (!nickname) nickname = statusData?.data?.profile?.nickname || statusData?.profile?.nickname || '';
                    if (!avatarUrl) avatarUrl = statusData?.data?.profile?.avatarUrl || statusData?.profile?.avatarUrl || '';
                    if (!vipType) vipType = statusData?.data?.profile?.vipType || statusData?.profile?.vipType || 0;
                    if (statusData?.data?.profile?.vipRights?.redplus?.vipCode > 0) isSvip = true;
                } catch(e) {}
            }

            if (!nickname) nickname = '网易云用户';
            isVip = vipType > 0;
            if (vipType === 11) isSvip = true;
        } else {
            // 在线接口账号信息获取
            const statusRes = await fetch(`${baseUrl}/login/status?timestamp=${Date.now()}&cookie=${encodeURIComponent(cookie)}`);
            const statusData = await statusRes.json();
            uid = statusData.data?.profile?.userId || statusData.profile?.userId || '';
            nickname = statusData.data?.profile?.nickname || statusData.profile?.nickname || '网易云用户';
            avatarUrl = statusData.data?.profile?.avatarUrl || statusData.profile?.avatarUrl || '';
            vipType = statusData.data?.profile?.vipType || statusData.profile?.vipType || 0;
            isVip = vipType > 0;
            isSvip = Boolean(statusData.data?.profile?.vipRights?.redplus?.vipCode > 0);
        }

        applemusicNeteaseUser = {
            uid: uid,
            nickname: nickname,
            avatarUrl: avatarUrl,
            vipType: vipType,
            isVip: isVip,
            isSvip: isSvip,
            cookie: cookie
        };
        try {
            localStorage.setItem('applemusicNeteaseUser', JSON.stringify(applemusicNeteaseUser));
        } catch(e) {}

        applemusicUpdateNeteaseUserUI();

        // 同步歌单
        if (uid) {
            await applemusicSyncUserPlaylists(baseUrl, uid, cookie);
        }

        setTimeout(() => {
            applemusicCloseQrModal();
            if (typeof showToast === 'function') showToast(`登录成功，已启用 VIP 音乐通道`);
        }, 1000);
    } catch(err) {
        console.error('登录后拉取信息失败', err);
        setTimeout(() => {
            applemusicCloseQrModal();
            if (typeof showToast === 'function') showToast('登录成功');
        }, 1000);
    }
}

async function applemusicSyncUserPlaylists(baseUrl, uid, cookie) {
    try {
        if (applemusicApiConfig.type === 'builtin' && applemusicApiConfig.builtinIndex === 0) {
            // 1. 主接口同步歌单（增加 limit=1000 及全结构兼容解析函数）
            const plRes = await fetch(`${baseUrl}/user/playlist?uid=${uid}&limit=1000&cookie=${encodeURIComponent(cookie)}&timestamp=${Date.now()}`);
            const plData = await plRes.json();
            const playlists = plData.data || plData.playlist || [];
            if (playlists.length === 0 || typeof musicAppData === 'undefined') return;

            const fetchPlaylistSongs = async (plId) => {
                let songs = [];
                try {
                    let res = await fetch(`${baseUrl}/playlist/track/all?id=${plId}&limit=1000&cookie=${encodeURIComponent(cookie)}`);
                    let data = await res.json();
                    let rawTracks = data.songs || data.data || data.playlist?.tracks || [];
                    if (!rawTracks || rawTracks.length === 0) {
                        res = await fetch(`${baseUrl}/playlist/detail?id=${plId}&cookie=${encodeURIComponent(cookie)}`);
                        data = await res.json();
                        rawTracks = data.data || data.playlist?.tracks || data.playlistInfo?.tracks || [];
                    }
                    if (rawTracks && rawTracks.length > 0) {
                        songs = rawTracks.map(song => {
                            let artistName = '未知歌手';
                            if (Array.isArray(song.ar)) artistName = song.ar.map(a => a.name).filter(Boolean).join(', ');
                            else if (Array.isArray(song.artists)) artistName = song.artists.map(a => a.name).filter(Boolean).join(', ');
                            else if (typeof song.artist === 'string' && song.artist) artistName = song.artist;

                            let coverUrl = '';
                            if (song.al?.picUrl) coverUrl = song.al.picUrl;
                            else if (song.album?.picUrl) coverUrl = song.album.picUrl;
                            else if (song.cover) coverUrl = song.cover;
                            else if (song.picUrl) coverUrl = song.picUrl;
                            if (coverUrl && coverUrl.startsWith('http:')) coverUrl = coverUrl.replace('http:', 'https:');
                            if (coverUrl && !coverUrl.includes('param=')) coverUrl += '?param=500y500';

                            return {
                                id: song.id,
                                name: song.name || '未知歌曲',
                                artist: artistName,
                                cover: coverUrl,
                                timestamp: Date.now()
                            };
                        });
                    }
                } catch(e) {}
                return songs;
            };

            const heartPl = playlists[0];
            if (heartPl) {
                musicAppData.favoritePlaylistMeta = {
                    title: heartPl.name || '心动歌曲',
                    cover: heartPl.coverImgUrl ? (heartPl.coverImgUrl.includes('param=') ? heartPl.coverImgUrl : heartPl.coverImgUrl + '?param=500y500') : (heartPl.cover || '')
                };
                const heartSongs = await fetchPlaylistSongs(heartPl.id);
                if (heartSongs && heartSongs.length > 0) {
                    musicAppData.favoriteSongs = heartSongs;
                }
            }

            const otherPlaylists = playlists.slice(1);
            if (!musicAppData.customPlaylists) musicAppData.customPlaylists = [];

            for (let pl of otherPlaylists) {
                const existingIndex = musicAppData.customPlaylists.findIndex(p => p.id === String(pl.id) || p.title === pl.name);
                const songs = await fetchPlaylistSongs(pl.id);

                const playlistObj = {
                    id: String(pl.id),
                    title: pl.name,
                    cover: pl.coverImgUrl ? (pl.coverImgUrl.includes('param=') ? pl.coverImgUrl : pl.coverImgUrl + '?param=500y500') : (pl.cover || ''),
                    songs: songs,
                    timestamp: Date.now()
                };

                if (existingIndex !== -1) {
                    musicAppData.customPlaylists[existingIndex] = playlistObj;
                } else {
                    musicAppData.customPlaylists.push(playlistObj);
                }
            }

            if (typeof saveMusicAppData === 'function') saveMusicAppData();
            applemusicLoadCustomPlaylists();
            applemusicLoadFavoriteCount();
            applemusicRenderAccountNeteasePlaylists(playlists);
        } else {
            // 2. 在线接口 / 自定义源同步歌单
            const plRes = await fetch(`${baseUrl}/user/playlist?uid=${uid}&limit=1000&timestamp=${Date.now()}&cookie=${encodeURIComponent(cookie)}`);
            const plData = await plRes.json();
            if (plData.code !== 200 || !plData.playlist || plData.playlist.length === 0) return;

            const playlists = plData.playlist;
            if (typeof musicAppData === 'undefined') return;

            const heartPl = playlists[0];
            if (heartPl) {
                musicAppData.favoritePlaylistMeta = {
                    title: heartPl.name || '心动歌曲',
                    cover: heartPl.coverImgUrl ? heartPl.coverImgUrl + '?param=500y500' : ''
                };
                try {
                    const trackRes = await fetch(`${baseUrl}/playlist/track/all?id=${heartPl.id}&limit=1000&cookie=${encodeURIComponent(cookie)}`);
                    const trackData = await trackRes.json();
                    if (trackData.code === 200 && trackData.songs) {
                        musicAppData.favoriteSongs = trackData.songs.map(song => ({
                            id: song.id,
                            name: song.name,
                            artist: song.ar ? song.ar.map(a => a.name).join(', ') : '未知歌手',
                            cover: song.al && song.al.picUrl ? song.al.picUrl + '?param=500y500' : '',
                            timestamp: Date.now()
                        }));
                    }
                } catch(e) {}
            }

            const otherPlaylists = playlists.slice(1);
            if (!musicAppData.customPlaylists) musicAppData.customPlaylists = [];

            for (let pl of otherPlaylists) {
                const existingIndex = musicAppData.customPlaylists.findIndex(p => p.id === String(pl.id) || p.title === pl.name);
                let songs = [];
                try {
                    const tr = await fetch(`${baseUrl}/playlist/track/all?id=${pl.id}&limit=500&cookie=${encodeURIComponent(cookie)}`);
                    const td = await tr.json();
                    if (td.code === 200 && td.songs) {
                        songs = td.songs.map(song => ({
                            id: song.id,
                            name: song.name,
                            artist: song.ar ? song.ar.map(a => a.name).join(', ') : '未知歌手',
                            cover: song.al && song.al.picUrl ? song.al.picUrl + '?param=500y500' : '',
                            timestamp: Date.now()
                        }));
                    }
                } catch(e) {}

                const playlistObj = {
                    id: String(pl.id),
                    title: pl.name,
                    cover: pl.coverImgUrl ? pl.coverImgUrl + '?param=500y500' : '',
                    songs: songs,
                    timestamp: Date.now()
                };

                if (existingIndex !== -1) {
                    musicAppData.customPlaylists[existingIndex] = playlistObj;
                } else {
                    musicAppData.customPlaylists.push(playlistObj);
                }
            }

            if (typeof saveMusicAppData === 'function') saveMusicAppData();
            applemusicLoadCustomPlaylists();
            applemusicLoadFavoriteCount();
            applemusicRenderAccountNeteasePlaylists(playlists);
        }
    } catch(err) {
        console.error('同步歌单失败:', err);
    }
}

function applemusicUpdateNeteaseUserUI() {
    const vipBadge = document.getElementById('applemusic-settings-vip-badge');
    const vipText = document.getElementById('applemusic-settings-vip-text');
    const loginText = document.getElementById('applemusic-settings-login-text');
    const neteaseSection = document.getElementById('applemusic-account-netease-section');

    if (!applemusicNeteaseUser || !applemusicNeteaseUser.uid) {
        if (vipBadge) vipBadge.style.display = 'none';
        if (loginText) loginText.innerText = '登陆';
        if (neteaseSection) neteaseSection.style.display = 'none';
        return;
    }

    // 登录状态
    if (loginText) loginText.innerText = '已登录';

    // VIP / SVIP 展示控制
    if (vipBadge && vipText) {
        if (applemusicNeteaseUser.isSvip) {
            vipBadge.style.display = 'inline-flex';
            vipBadge.style.background = 'linear-gradient(135deg, #d4af37 0%, #aa7c11 100%)';
            vipText.innerText = 'SVIP';
        } else if (applemusicNeteaseUser.isVip) {
            vipBadge.style.display = 'inline-flex';
            vipBadge.style.background = '#222224';
            vipText.innerText = 'VIP';
        } else {
            vipBadge.style.display = 'none';
        }
    }

    // 渲染账户页下方歌单列表
    if (typeof musicAppData !== 'undefined' && musicAppData.customPlaylists) {
        applemusicRenderAccountNeteasePlaylists();
    }
}

function applemusicRenderAccountNeteasePlaylists(rawPlaylists = null) {
    const section = document.getElementById('applemusic-account-netease-section');
    const list = document.getElementById('applemusic-account-playlists-list');
    const countEl = document.getElementById('applemusic-account-playlist-count');
    if (!section || !list) return;

    if (!applemusicNeteaseUser || !applemusicNeteaseUser.uid) {
        section.style.display = 'none';
        return;
    }

    let items = [];
    if (rawPlaylists && rawPlaylists.length > 0) {
        items = rawPlaylists;
    } else if (typeof musicAppData !== 'undefined' && musicAppData.customPlaylists) {
        items = musicAppData.customPlaylists;
    }

    if (items.length === 0) {
        section.style.display = 'none';
        return;
    }

    if (countEl) countEl.innerText = `共 ${items.length} 个`;

    list.innerHTML = '';
    items.forEach(pl => {
        const div = document.createElement('div');
        div.style.display = 'flex';
        div.style.alignItems = 'center';
        div.style.padding = '8px 10px';
        div.style.background = 'rgba(0, 0, 0, 0.05)';
        div.style.backdropFilter = 'blur(16px)';
        div.style.webkitBackdropFilter = 'blur(16px)';
        div.style.border = '0.5px solid rgba(0, 0, 0, 0.04)';
        div.style.borderRadius = '4px';
        div.style.cursor = 'pointer';

        const coverSrc = pl.coverImgUrl || pl.cover || '';
        const coverHtml = coverSrc
            ? `<img src="${coverSrc}" style="width: 44px; height: 44px; border-radius: 4px; object-fit: cover; margin-right: 12px; background: #ddd;">`
            : `<div style="width: 44px; height: 44px; border-radius: 4px; background: #e5e5ea; display: flex; align-items: center; justify-content: center; margin-right: 12px;"><svg viewBox="0 0 24 24" width="22" height="22" fill="#8e8e93"><path d="M12 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h4V3h-6z"/></svg></div>`;

        const title = pl.name || pl.title || '歌单';
        const trackCount = pl.trackCount !== undefined ? pl.trackCount : (pl.songs ? pl.songs.length : 0);

        div.innerHTML = `
            ${coverHtml}
            <div style="flex: 1; overflow: hidden;">
                <div style="font-size: 14px; font-weight: 600; color: #1c1c1e; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; margin-bottom: 2px;">${title}</div>
                <div style="font-size: 12px; color: #8e8e93;">${trackCount} 首歌曲</div>
            </div>
            <svg viewBox="0 0 24 24" width="16" height="16" fill="#c7c7cc"><path d="M8.59 16.59L13.17 12 8.59 7.41 10 6l6 6-6 6-1.41-1.41z"/></svg>
        `;

        div.onclick = () => {
            applemusicOpenPlaylistDetail({
                id: pl.id || 'favorite',
                title: title,
                cover: coverSrc,
                songs: pl.songs || [],
                isFavorite: pl.isFavorite || false
            });
        };

        list.appendChild(div);
    });

    section.style.display = 'block';
}

function applemusicSelectApi(type, index = 0) {
    applemusicApiConfig.type = type;
    if (type === 'builtin') {
        applemusicApiConfig.builtinIndex = index;
    }
    applemusicUpdateApiUI();
}

function applemusicCustomApiInput() {
    const input = document.getElementById('applemusic-custom-api-input');
    if (input) {
        applemusicApiConfig.customUrl = input.value.trim();
    }
}

function applemusicToggleCustomApiUsage() {
    if (applemusicApiConfig.type === 'custom') {
        applemusicApiConfig.type = 'builtin';
        if (typeof showToast === 'function') showToast('已切换为内置音乐源');
    } else {
        const url = document.getElementById('applemusic-custom-api-input')?.value.trim() || applemusicApiConfig.customUrl;
        if (!url) {
            if (typeof showToast === 'function') showToast('请先输入自定义音乐源地址');
            else alert('请先输入自定义音乐源地址');
            return;
        }
        applemusicApiConfig.type = 'custom';
        if (typeof showToast === 'function') showToast('已勾选启用自定义音乐源');
    }
    applemusicSaveApiSettings(true);
    applemusicUpdateApiUI();
}

function applemusicSaveApiSettings(silent = false) {
    const input = document.getElementById('applemusic-custom-api-input');
    if (input) {
        applemusicApiConfig.customUrl = input.value.trim();
    }
    try {
        localStorage.setItem('applemusicApiConfig', JSON.stringify(applemusicApiConfig));
    } catch(e) {}
    applemusicUpdateApiUI();
    if (silent !== true) {
        if (typeof showToast === 'function') {
            const modeText = (applemusicApiConfig.type === 'custom' && applemusicApiConfig.customUrl) ? '已启用自定义音乐源' : '已应用内置音乐源';
            showToast(`音乐源设置已保存（${modeText}）`);
        } else {
            alert('音乐源设置已保存');
        }
        applemusicCloseSourceDrawer();
    }
}

function applemusicCopyRepoUrl() {
    const repoUrl = 'https://github.com/NeteaseCloudMusicApiEnhanced/api-enhanced';
    if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(repoUrl).then(() => {
            if (typeof showToast === 'function') showToast('已复制开源仓库链接');
            else alert('已复制开源仓库链接');
        }).catch(() => {
            applemusicFallbackCopy(repoUrl);
        });
    } else {
        applemusicFallbackCopy(repoUrl);
    }
}

function applemusicFallbackCopy(text) {
    const textarea = document.createElement('textarea');
    textarea.value = text;
    textarea.style.position = 'fixed';
    textarea.style.opacity = '0';
    document.body.appendChild(textarea);
    textarea.select();
    try {
        document.execCommand('copy');
        if (typeof showToast === 'function') showToast('已复制开源仓库链接');
        else alert('已复制开源仓库链接');
    } catch(e) {
        prompt('请长按复制仓库链接：', text);
    }
    document.body.removeChild(textarea);
}

function applemusicOpenSourceDrawer() {
    const modal = document.getElementById('applemusic-modal-api-source');
    if (modal) {
        modal.classList.add('applemusic-active');
        applemusicUpdateApiUI();

        // 绑定音乐源教程轮播图滑动监听
        const carousel = document.getElementById('applemusic-source-tutorial-carousel');
        const dotsContainer = document.getElementById('applemusic-source-tutorial-dots');

        if (carousel && dotsContainer) {
            carousel.scrollLeft = 0;
            carousel.onscroll = function() {
                const center = carousel.scrollLeft + carousel.clientWidth / 2;
                let minDiff = Infinity;
                let activeIndex = 0;

                const cards = carousel.querySelectorAll('.applemusic-tutorial-card');
                cards.forEach((card, index) => {
                    const cardCenter = card.offsetLeft + card.offsetWidth / 2;
                    const diff = Math.abs(center - cardCenter);
                    if (diff < minDiff) {
                        minDiff = diff;
                        activeIndex = index;
                    }
                    card.classList.remove('active');
                });

                if (cards[activeIndex]) {
                    cards[activeIndex].classList.add('active');
                }

                dotsContainer.querySelectorAll('.applemusic-carousel-dot').forEach(dot => {
                    if (parseInt(dot.dataset.index) === activeIndex) {
                        dot.classList.add('active');
                    } else {
                        dot.classList.remove('active');
                    }
                });
            };
        }
    }
}

function applemusicCloseSourceDrawer() {
    const modal = document.getElementById('applemusic-modal-api-source');
    if (modal) modal.classList.remove('applemusic-active');
}

function applemusicOpenSourceActionSheet() {
    const sourceList = applemusicBuiltinApis.map((api, index) => ({
        label: api.name,
        value: `builtin_${index}`
    }));
    if (applemusicApiConfig.customUrl && applemusicApiConfig.customUrl.trim() !== '') {
        sourceList.push({ label: '自定义源', value: 'custom' });
    }

    const currentValue = applemusicApiConfig.type === 'builtin'
        ? `builtin_${applemusicApiConfig.builtinIndex}`
        : 'custom';

    if (typeof window.openUniversalSelect === 'function') {
        window.openUniversalSelect({
            title: '选择音乐源',
            data: sourceList,
            options: sourceList,
            items: sourceList,
            list: sourceList,
            currentValue: currentValue,
            onSelect: (val) => {
                let selectedValue = val;
                if (Array.isArray(val)) {
                    selectedValue = val[0]?.value || val[0];
                } else if (typeof val === 'object' && val !== null) {
                    selectedValue = val.value || val.id;
                }

                if (!selectedValue) return;

                if (selectedValue === 'custom') {
                    applemusicQuickSelectApi('custom');
                } else if (typeof selectedValue === 'string' && selectedValue.startsWith('builtin_')) {
                    applemusicQuickSelectApi('builtin', parseInt(selectedValue.split('_')[1]));
                }
            }
        });
        return;
    }

    const overlay = document.getElementById('univSelOverlay');
    const container = document.getElementById('univSelListContainer');
    const searchWrap = document.getElementById('univSelSearchWrap');
    const saveBtn = document.getElementById('univSelSaveBtn');

    if (!overlay || !container) return;

    if (searchWrap) searchWrap.style.display = 'none';
    if (saveBtn && saveBtn.parentElement) saveBtn.parentElement.style.display = 'none';

    let html = '';
    applemusicBuiltinApis.forEach((api, index) => {
        const isSelected = applemusicApiConfig.type === 'builtin' && applemusicApiConfig.builtinIndex === index;
        html += `
            <div style="display: flex; align-items: center; justify-content: space-between; padding: 16px 20px; border-bottom: 0.5px solid rgba(0,0,0,0.05); cursor: pointer;" onclick="applemusicQuickSelectApi('builtin', ${index}); if(typeof closeUniversalSelect === 'function') closeUniversalSelect(); else document.getElementById('univSelOverlay').classList.remove('show', 'active');">
                <span style="font-size: 16px; ${isSelected ? 'color: var(--theme-active); font-weight: 600;' : 'color: #1c1c1e;'}">${api.name}</span>
                ${isSelected ? '<svg viewBox="0 0 24 24" style="width:20px;height:20px;fill:var(--theme-active);"><path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/></svg>' : ''}
            </div>
        `;
    });

    if (applemusicApiConfig.customUrl && applemusicApiConfig.customUrl.trim() !== '') {
        const isSelected = applemusicApiConfig.type === 'custom';
        html += `
            <div style="display: flex; align-items: center; justify-content: space-between; padding: 16px 20px; border-bottom: 0.5px solid rgba(0,0,0,0.05); cursor: pointer;" onclick="applemusicQuickSelectApi('custom'); if(typeof closeUniversalSelect === 'function') closeUniversalSelect(); else document.getElementById('univSelOverlay').classList.remove('show', 'active');">
                <span style="font-size: 16px; ${isSelected ? 'color: var(--theme-active); font-weight: 600;' : 'color: #1c1c1e;'}">自定义源</span>
                ${isSelected ? '<svg viewBox="0 0 24 24" style="width:20px;height:20px;fill:var(--theme-active);"><path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/></svg>' : ''}
            </div>
        `;
    }

    container.innerHTML = html;

    overlay.style.display = 'flex';
    setTimeout(() => overlay.classList.add('show', 'active'), 10);
}

function applemusicQuickSelectApi(type, index = 0) {
    applemusicSelectApi(type, index);
    applemusicSaveApiSettings(true); // 静默保存，不弹窗不跳转

    // 自动重新触发搜索
    const keyword = document.getElementById('applemusic-search-input').value.trim();
    if (keyword) {
        applemusicPerformSearch(keyword);
    }
}

// ================= 本地音乐导入逻辑 =================
let applemusicLocalAudioBase64 = "";
let applemusicLocalLyricText = "";
let applemusicLocalSelectedPlaylistId = "favorite";
let applemusicLocalSongCoverBase64 = "";

function applemusicTriggerLocalCoverUpload(event) {
    applemusicTriggerCoverUpload(event);
    window.applemusicCustomCoverCallback = function(src) {
        applemusicLocalSongCoverBase64 = src;
        const img = document.getElementById('applemusic-local-song-cover');
        const cameraIcon = document.getElementById('applemusic-local-camera-icon');
        if(img) {
            img.src = src;
            img.style.display = 'block';
        }
        if(cameraIcon) cameraIcon.style.display = 'none';
    };
}

function applemusicOpenLocalMusicModal() {
    window.applemusicEditingLocalSongId = null; // 重置为新建模式

    const modal = document.getElementById('applemusic-modal-local-music');
    if(modal) modal.classList.add('applemusic-active');

    // 恢复显示“添加到歌单”选项
    const playlistGroup = document.getElementById('applemusic-local-playlist-group');
    if (playlistGroup) playlistGroup.style.display = 'block';

    // 重置表单与文本提示
    document.getElementById('applemusic-local-audio-file').value = '';
    document.getElementById('applemusic-local-audio-url').value = '';
    document.getElementById('applemusic-local-song-name').value = '';
    document.getElementById('applemusic-local-song-artist').value = '';
    document.getElementById('applemusic-local-lyric-file').value = '';
    document.getElementById('applemusic-local-audio-filename').innerText = '';
    document.getElementById('applemusic-local-lyric-filename').innerText = '';

    const coverImg = document.getElementById('applemusic-local-song-cover');
    const cameraIcon = document.getElementById('applemusic-local-camera-icon');
    if(coverImg) {
        coverImg.style.display = 'none';
        coverImg.src = '';
    }
    if(cameraIcon) cameraIcon.style.display = 'flex';

    applemusicLocalAudioBase64 = "";
    applemusicLocalLyricText = "";
    applemusicLocalSongCoverBase64 = "";
    applemusicLocalSelectedPlaylistId = "favorite";

    const nameEl = document.getElementById('applemusic-local-playlist-name');
    if (nameEl) {
        const favMeta = typeof musicAppData !== 'undefined' && musicAppData.favoritePlaylistMeta ? musicAppData.favoritePlaylistMeta : { title: '心动歌曲' };
        nameEl.innerText = favMeta.title;
    }

    // 绑定文件读取事件
    document.getElementById('applemusic-local-audio-file').onchange = function(e) {
        const file = e.target.files[0];
        if (file) {
            document.getElementById('applemusic-local-audio-filename').innerText = "已选择: " + file.name;
            // 自动填充歌名
            const nameInput = document.getElementById('applemusic-local-song-name');
            if (!nameInput.value) {
                nameInput.value = file.name.replace(/\.[^/.]+$/, "");
            }
            const reader = new FileReader();
            reader.onload = function(evt) {
                applemusicLocalAudioBase64 = evt.target.result;
                document.getElementById('applemusic-local-audio-url').value = ''; // 清空URL框避免混淆
            };
            reader.readAsDataURL(file);
        }
    };

    document.getElementById('applemusic-local-lyric-file').onchange = function(e) {
        const file = e.target.files[0];
        if (file) {
            document.getElementById('applemusic-local-lyric-filename').innerText = "已选择: " + file.name;
            const reader = new FileReader();
            reader.onload = function(evt) {
                applemusicLocalLyricText = evt.target.result;
            };
            reader.readAsText(file);
        }
    };
}

function applemusicCloseLocalMusicModal() {
    const modal = document.getElementById('applemusic-modal-local-music');
    if(modal) modal.classList.remove('applemusic-active');
}

function applemusicSubmitLocalMusic() {
    const audioUrl = document.getElementById('applemusic-local-audio-url').value.trim();
    const finalAudioUrl = applemusicLocalAudioBase64 || audioUrl;

    if (!finalAudioUrl) {
        if (typeof showToast === 'function') showToast('请上传音频文件或输入URL');
        else alert('请上传音频文件或输入URL');
        return;
    }

    const name = document.getElementById('applemusic-local-song-name').value.trim() || '未知歌名';
    const artist = document.getElementById('applemusic-local-song-artist').value.trim() || '未知歌手';
    const cover = applemusicLocalSongCoverBase64 || 'https://images.unsplash.com/photo-1614680376593-902f74cf0d41?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80';

    if (window.applemusicEditingLocalSongId) {
        // 编辑模式
        if (typeof musicAppData !== 'undefined') {
            const updateSong = (s) => {
                if (s.id === window.applemusicEditingLocalSongId) {
                    s.name = name;
                    s.artist = artist;
                    s.url = finalAudioUrl;
                    s.cover = cover;
                    s.lyric = applemusicLocalLyricText;
                }
            };
            if (musicAppData.favoriteSongs) musicAppData.favoriteSongs.forEach(updateSong);
            if (musicAppData.customPlaylists) {
                musicAppData.customPlaylists.forEach(pl => {
                    if (pl.songs) pl.songs.forEach(updateSong);
                });
            }
            if (typeof saveMusicAppData === 'function') saveMusicAppData();
            if (typeof showToast === 'function') showToast('修改成功');
            else alert('修改成功');
        }
    } else {
        // 新建模式
        const playlistId = applemusicLocalSelectedPlaylistId;
        const newSong = {
            id: 'local_' + Date.now(),
            name: name,
            artist: artist,
            cover: cover,
            url: finalAudioUrl,
            lyric: applemusicLocalLyricText,
            isLocal: true,
            timestamp: Date.now()
        };

        if (typeof musicAppData !== 'undefined') {
            if (playlistId === 'favorite') {
                musicAppData.favoriteSongs.push(newSong);
            } else {
                const pl = musicAppData.customPlaylists.find(p => p.id === playlistId);
                if (pl) {
                    if (!pl.songs) pl.songs = [];
                    pl.songs.push(newSong);
                }
            }
            if (typeof saveMusicAppData === 'function') saveMusicAppData();
            if (typeof showToast === 'function') showToast('导入成功');
            else alert('导入成功');
        }
    }

    applemusicCloseLocalMusicModal();

    // 刷新当前视图
    if (window.applemusicCurrentViewPlaylist) {
        applemusicOpenPlaylistDetail(window.applemusicCurrentViewPlaylist);
    }
    const localSongsView = document.getElementById('applemusic-view-local-songs');
    if (localSongsView && localSongsView.classList.contains('applemusic-active')) {
        applemusicRenderLocalSongs();
    }
}

// ================= 导入歌单逻辑 =================
let applemusicImportParsedPlaylists = [];
let applemusicImportSelectedIds = new Set();
let applemusicImportState = 'input'; // 'input' 或 'preview'

function applemusicOpenImportPlaylistModal() {
    const modal = document.getElementById('applemusic-modal-import-playlist');
    if(modal) modal.classList.add('applemusic-active');

    // 启动视口监听以适应键盘
    applemusicSyncImportModalViewport();
    if (window.visualViewport) {
        window.visualViewport.addEventListener('resize', applemusicScheduleImportModalViewportSync);
    }
    window.addEventListener('resize', applemusicScheduleImportModalViewportSync);
    window.addEventListener('orientationchange', applemusicScheduleImportModalViewportSync);

    // 重置状态
    applemusicImportState = 'input';

    const input = document.getElementById('applemusic-import-playlist-input');
    if (input) input.value = '';

    const previewArea = document.getElementById('applemusic-import-preview-area');
    if (previewArea) previewArea.style.display = 'none';

    const statusText = document.getElementById('applemusic-import-status-text');
    if (statusText) {
        statusText.style.display = 'none';
        statusText.innerHTML = '';
    }

    applemusicImportParsedPlaylists = [];
    applemusicImportSelectedIds.clear();

    // 绑定教程轮播图滑动监听
    const carousel = document.getElementById('applemusic-tutorial-carousel');
    const dotsContainer = document.getElementById('applemusic-tutorial-dots');

    if (carousel && dotsContainer) {
        carousel.scrollLeft = 0;
        carousel.onscroll = function() {
            const center = carousel.scrollLeft + carousel.clientWidth / 2;
            let minDiff = Infinity;
            let activeIndex = 0;

            const cards = carousel.querySelectorAll('.applemusic-tutorial-card');
            cards.forEach((card, index) => {
                const cardCenter = card.offsetLeft + card.offsetWidth / 2;
                const diff = Math.abs(center - cardCenter);
                if (diff < minDiff) {
                    minDiff = diff;
                    activeIndex = index;
                }
                card.classList.remove('active');
            });

            if (cards[activeIndex]) {
                cards[activeIndex].classList.add('active');
            }

            dotsContainer.querySelectorAll('.applemusic-carousel-dot').forEach(dot => {
                if (parseInt(dot.dataset.index) === activeIndex) {
                    dot.classList.add('active');
                } else {
                    dot.classList.remove('active');
                }
            });
        };
    }
}

function applemusicCloseImportPlaylistModal() {
    const modal = document.getElementById('applemusic-modal-import-playlist');
    if(modal) modal.classList.remove('applemusic-active');

    // 停止视口监听
    if (window.visualViewport) {
        window.visualViewport.removeEventListener('resize', applemusicScheduleImportModalViewportSync);
    }
    window.removeEventListener('resize', applemusicScheduleImportModalViewportSync);
    window.removeEventListener('orientationchange', applemusicScheduleImportModalViewportSync);
    clearTimeout(applemusicImportModalViewportTimer);

    // 恢复弹窗原始样式
    const modalContent = modal?.querySelector('.applemusic-modal-content');
    if (modalContent) {
        modalContent.style.paddingBottom = '';
    }
}

function applemusicParseImportInput() {
    const input = document.getElementById('applemusic-import-playlist-input');
    const statusText = document.getElementById('applemusic-import-status-text');
    const previewArea = document.getElementById('applemusic-import-preview-area');

    if (!input) return;

    const val = input.value.trim();
    if (!val) {
        if (statusText) {
            statusText.style.display = 'block';
            statusText.innerHTML = '请输入歌单链接或UID';
        }
        return;
    }

    let targetId = val;
    let isPossibleUserUid = false;

    const match = val.match(/id=(\d+)/);
    if (match) {
        targetId = match[1];
    } else if (/^\d+$/.test(val)) {
        targetId = val;
        isPossibleUserUid = true;
    } else {
        if (statusText) {
            statusText.style.display = 'block';
            statusText.innerHTML = '无法识别的链接或UID格式';
        }
        return;
    }

    if (statusText) {
        statusText.style.display = 'block';
        statusText.innerHTML = 'ヾ(-`ω´-｡) 正在努力解析歌单...';
    }
    if (previewArea) previewArea.style.display = 'none';

    const baseUrl = applemusicGetApiBaseUrl();
    const userCookie = applemusicNeteaseUser?.cookie || '';
    const cookieParam = userCookie ? `&cookie=${encodeURIComponent(userCookie)}` : '';
    const failHtml = '糟糕，怎么解析失败了(｡>д<)ヾ，请尝试点击更换<span style="color: #007aff; text-decoration: underline; cursor: pointer;" onclick="applemusicOpenSourceActionSheet()">音乐源</span>';

    const fetchSinglePlaylist = (playlistId) => {
        fetch(`${baseUrl}/playlist/detail?id=${playlistId}${cookieParam}`)
            .then(res => res.json())
            .then(data => {
                const pl = data.playlistInfo || data.playlist;
                if (!pl) throw new Error('获取歌单详情失败');
                applemusicImportParsedPlaylists = [{
                    id: pl.id,
                    name: pl.name,
                    coverImgUrl: pl.cover || pl.coverImgUrl || pl.picUrl || '',
                    trackCount: pl.trackCount || (data.data ? data.data.length : (pl.tracks ? pl.tracks.length : 0)),
                    tracks: data.data || pl.tracks || []
                }];
                if (statusText) statusText.style.display = 'none';
                applemusicShowImportPreview();
            })
            .catch(err => {
                console.error(err);
                if (statusText) {
                    statusText.style.display = 'block';
                    statusText.innerHTML = failHtml;
                }
            });
    };

    if (isPossibleUserUid) {
        // 主接口 / 在线接口 / 备用接口 1 / 备用接口 2 均支持通过 UID 获取歌单
        fetch(`${baseUrl}/user/playlist?uid=${targetId}${cookieParam}`)
            .then(res => res.json())
            .then(data => {
                const list = data.data || data.playlist || [];
                if (list.length > 0) {
                    applemusicImportParsedPlaylists = list;
                    if (statusText) statusText.style.display = 'none';
                    applemusicShowImportPreview();
                } else {
                    fetchSinglePlaylist(targetId);
                }
            })
            .catch(() => {
                fetchSinglePlaylist(targetId);
            });
    } else {
        fetchSinglePlaylist(targetId);
    }
}

function applemusicShowImportPreview() {
    applemusicImportState = 'preview';

    const previewArea = document.getElementById('applemusic-import-preview-area');
    if (previewArea) previewArea.style.display = 'block';

    applemusicImportSelectedIds.clear();
    applemusicRenderImportPreview();
}

function applemusicRenderImportPreview() {
    const list = document.getElementById('applemusic-import-preview-list');
    if (!list) return;
    list.innerHTML = '';

    applemusicImportParsedPlaylists.forEach(pl => {
        const isSelected = applemusicImportSelectedIds.has(pl.id);
        const div = document.createElement('div');
        div.className = 'applemusic-import-preview-item';

        const cover = pl.coverImgUrl || pl.cover || '';
        const trackCount = pl.trackCount || 0;

        div.innerHTML = `
            <div class="applemusic-edit-checkbox ${isSelected ? 'selected' : ''}" style="margin-right: 12px;">
                <svg viewBox="0 0 24 24" fill="none" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
            </div>
            <img src="${cover}" class="applemusic-import-preview-cover">
            <div class="applemusic-import-preview-info">
                <div class="applemusic-import-preview-title">${pl.name}</div>
                <div class="applemusic-import-preview-count">共 ${trackCount} 首</div>
            </div>
        `;

        div.onclick = () => {
            if (applemusicImportSelectedIds.has(pl.id)) {
                applemusicImportSelectedIds.delete(pl.id);
            } else {
                applemusicImportSelectedIds.add(pl.id);
            }
            applemusicRenderImportPreview();
        };

        list.appendChild(div);
    });
}

function applemusicSelectAllImport() {
    if (applemusicImportSelectedIds.size === applemusicImportParsedPlaylists.length) {
        applemusicImportSelectedIds.clear();
    } else {
        applemusicImportParsedPlaylists.forEach(pl => applemusicImportSelectedIds.add(pl.id));
    }
    applemusicRenderImportPreview();
}

async function applemusicExecuteImport() {
    if (applemusicImportSelectedIds.size === 0) {
        if (typeof showToast === 'function') showToast('请至少勾选一个歌单');
        else alert('请至少勾选一个歌单');
        return;
    }

    if (typeof showToast === 'function') showToast('正在拉取歌曲数据，请耐心等待...');
    else alert('正在拉取歌曲数据，请耐心等待...');

    const baseUrl = applemusicGetApiBaseUrl();
    const userCookie = applemusicNeteaseUser?.cookie || '';
    const cookieParam = userCookie ? `&cookie=${encodeURIComponent(userCookie)}` : '';
    let successCount = 0;

    for (let id of applemusicImportSelectedIds) {
        try {
            const detailRes = await fetch(`${baseUrl}/playlist/detail?id=${id}${cookieParam}`);
            const detailData = await detailRes.json();
            if (detailData.code !== 200) continue;

            const plInfo = detailData.playlistInfo || detailData.playlist;
            const title = plInfo?.name || '导入歌单';
            const cover = plInfo?.cover || plInfo?.coverImgUrl || '';
            const songs = detailData.data || (detailData.playlist?.tracks ? detailData.playlist.tracks.map(s => ({
                id: s.id,
                name: s.name,
                artist: s.ar ? s.ar.map(a => a.name).join(', ') : '未知歌手',
                cover: s.al?.picUrl ? s.al.picUrl.replace('http:', 'https:') : '',
                timestamp: Date.now()
            })) : []);

            if (songs.length > 0) {
                if (typeof musicAppData !== 'undefined') {
                    if (!musicAppData.customPlaylists) musicAppData.customPlaylists = [];
                    musicAppData.customPlaylists.push({
                        id: 'imported_' + Date.now() + '_' + Math.floor(Math.random()*1000),
                        title: title,
                        cover: cover,
                        songs: songs,
                        timestamp: Date.now()
                    });
                }
                successCount++;
            }
        } catch(e) {
            console.error('导入单个歌单失败', e);
        }
    }

    if (successCount > 0) {
        if (typeof saveMusicAppData === 'function') saveMusicAppData();
        applemusicLoadCustomPlaylists();
        if (typeof showToast === 'function') showToast(`成功导入 ${successCount} 个歌单`);
        else alert(`成功导入 ${successCount} 个歌单`);

        applemusicCloseImportPlaylistModal();
        applemusicSwitchView('playlists');
    } else {
        if (typeof showToast === 'function') showToast('导入失败，未能获取到歌曲数据');
        else alert('导入失败，未能获取到歌曲数据');
    }
}

// ================= 账户头像与装扮逻辑 =================
function applemusicGetDefaultCards() {
    return [
        { id: 0, title: 'Spring', cover: '', defaultType: 'haruhi' },
        { id: 1, title: 'Summer', cover: '', defaultType: 'iceman' },
        { id: 2, title: 'Autumn', cover: '', defaultType: 'parables' },
        { id: 3, title: 'Winter', cover: '', defaultType: 'fight' }
    ];
}

function applemusicGetDefaultFeaturedCards() {
    return [
        { id: 0, subtitle: 'Keni Titus 参与的作品', title: 'Keni Titus 与类似艺人', cover: '', bg: 'linear-gradient(180deg, #1c1c1e 0%, #2c2c2e 100%)' },
        { id: 1, subtitle: '专属推荐', title: '探索更多音乐', cover: '', bg: 'linear-gradient(180deg, #4b3b8c 0%, #2a1b5c 100%)' }
    ];
}

function applemusicTriggerProfileAvatarUpload(event) {
    applemusicTriggerCoverUpload(event);
    window.applemusicCustomCoverCallback = function(src) {
        applemusicSetProfileAvatar(src);
    };
}

function applemusicTriggerDressUpAvatarUpload(event) {
    applemusicTriggerCoverUpload(event);
    window.applemusicCustomCoverCallback = function(src) {
        applemusicTempAvatar = src;
        const dressupPreview = document.getElementById('applemusic-dressup-avatar-preview');
        if (dressupPreview) {
            dressupPreview.innerHTML = `<img src="${src}" style="width:100%;height:100%;border-radius:50%;object-fit:cover;">`;
        }
    };
}

function applemusicSyncDressUpInputs() {
    applemusicTempDressUpCards.forEach((card, index) => {
        const input = document.getElementById(`dressup-card-title-${index}`);
        if (input) card.title = input.value;
    });
    applemusicTempFeaturedCards.forEach((item, index) => {
        const subInput = document.getElementById(`dressup-featured-sub-${index}`);
        const titleInput = document.getElementById(`dressup-featured-title-${index}`);
        if (subInput) item.subtitle = subInput.value;
        if (titleInput) item.title = titleInput.value;
    });
}

function applemusicTriggerDressUpCardUpload(event, index) {
    applemusicSyncDressUpInputs();
    applemusicTriggerCoverUpload(event);
    window.applemusicCustomCoverCallback = function(src) {
        if (applemusicTempDressUpCards[index]) {
            applemusicTempDressUpCards[index].cover = src;
            applemusicInitDressUpView(false);
        }
    };
}

function applemusicTriggerDressUpFeaturedUpload(event, index) {
    applemusicSyncDressUpInputs();
    applemusicTriggerCoverUpload(event);
    window.applemusicCustomCoverCallback = function(src) {
        if (applemusicTempFeaturedCards[index]) {
            applemusicTempFeaturedCards[index].cover = src;
            applemusicInitDressUpView(false);
        }
    };
}

function applemusicResetDressUpCards() {
    applemusicTempDressUpCards = applemusicGetDefaultCards();
    applemusicInitDressUpView(false);
    if (typeof showToast === 'function') showToast('已恢复主页卡片默认装扮');
}

function applemusicResetDressUpFeatured() {
    applemusicTempFeaturedCards = applemusicGetDefaultFeaturedCards();
    applemusicInitDressUpView(false);
    if (typeof showToast === 'function') showToast('已恢复精选推荐默认装扮');
}

function applemusicSetProfileAvatar(src) {
    if (typeof musicAppData !== 'undefined') {
        musicAppData.profileAvatar = src;
        if (typeof saveMusicAppData === 'function') saveMusicAppData();
    }
    applemusicRenderProfileAvatar();
}

function applemusicRenderProfileAvatar() {
    let src = '';
    let nickname = 'Piagnone';
    let bio = '持续失眠中 · 做自己的宇宙';
    let follows = '28';
    let fans = '16';
    let level = 'Lv.8';
    let hours = '3642';
    if (typeof musicAppData !== 'undefined') {
        if (musicAppData.profileAvatar) src = musicAppData.profileAvatar;
        if (musicAppData.profileNickname) nickname = musicAppData.profileNickname;
        if (musicAppData.profileBio) bio = musicAppData.profileBio;
        if (musicAppData.profileFollows) follows = musicAppData.profileFollows;
        if (musicAppData.profileFans) fans = musicAppData.profileFans;
        if (musicAppData.profileLevel) level = musicAppData.profileLevel;
        if (musicAppData.profileHours) hours = musicAppData.profileHours;
    }

    const defaultSvg = `<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M11.9667 1.75195C9.81618 1.76239 7.72323 2.4468 5.98323 3.70856C4.24323 4.97032 2.94402 6.74571 2.26894 8.78424C1.59387 10.8228 1.57703 13.0215 2.22077 15.0701C2.86452 17.1187 4.13635 18.9138 5.85681 20.202C5.90685 20.2507 5.96434 20.2912 6.02709 20.322C7.7668 21.5741 9.85708 22.248 12.0017 22.248C14.1464 22.248 16.2367 21.5741 17.9764 20.322C18.0421 20.2869 18.1027 20.2432 18.1567 20.192C19.877 18.8994 21.1468 17.0996 21.7865 15.0471C22.4261 12.9945 22.4032 10.7931 21.721 8.7543C21.0389 6.71546 19.7319 4.94233 17.985 3.68573C16.2382 2.42913 14.1398 1.75265 11.9867 1.75195H11.9667ZM11.9667 5.51196C12.7921 5.50205 13.6018 5.73775 14.2926 6.18903C14.9834 6.6403 15.5239 7.28669 15.8454 8.04584C16.1668 8.80498 16.2545 9.64249 16.0974 10.4516C15.9403 11.2607 15.5454 12.0048 14.963 12.589C14.3807 13.1732 13.6374 13.5711 12.8277 13.7319C12.0181 13.8927 11.1788 13.8092 10.4169 13.492C9.65495 13.1748 9.00487 12.6383 8.54951 11.9508C8.09415 11.2634 7.85414 10.4561 7.86004 9.63196C7.86783 8.54512 8.30238 7.50471 9.07028 6.73431C9.83818 5.96392 10.8781 5.52503 11.9667 5.51196ZM16.5942 19.4319C15.2071 20.2944 13.6058 20.7515 11.9717 20.7515C10.3376 20.7515 8.73627 20.2944 7.34921 19.4319C6.918 19.1703 6.51226 18.869 6.13726 18.532C6.70519 17.7242 7.43513 17.0431 8.28074 16.532C9.39741 15.869 10.6725 15.5191 11.9717 15.5191C13.2709 15.5191 14.546 15.869 15.6627 16.532C16.5083 17.0431 17.2382 17.7242 17.8061 18.532C17.4311 18.869 17.0254 19.1703 16.5942 19.4319Z" fill="currentColor"/></svg>`;
    const avatarImg = `<img src="${src}" style="width: 100%; height: 100%; border-radius: 50%; object-fit: cover;">`;

    const settingsAvatar = document.querySelector('.applemusic-settings-avatar');
    if (settingsAvatar) settingsAvatar.innerHTML = src ? avatarImg : '';

    const profilePics = document.querySelectorAll('.applemusic-profile-pic');
    profilePics.forEach(pic => {
        pic.innerHTML = src ? avatarImg : defaultSvg;
    });

    const dressupPreview = document.getElementById('applemusic-dressup-avatar-preview');
    if (dressupPreview) dressupPreview.innerHTML = src ? avatarImg : '';

    const usernameEl = document.querySelector('#applemusic-view-settings strong, #applemusic-view-settings span[style*="font-size: 20px"]');
    if (usernameEl) usernameEl.innerText = nickname;

    const bioEl = document.getElementById('applemusic-settings-bio-text');
    if (bioEl) bioEl.innerText = bio;

    const followsEl = document.getElementById('applemusic-stats-follows');
    if (followsEl) followsEl.innerText = follows;

    const fansEl = document.getElementById('applemusic-stats-fans');
    if (fansEl) fansEl.innerText = fans;

    const levelEl = document.getElementById('applemusic-stats-level');
    if (levelEl) levelEl.innerText = level;

    const hoursEl = document.getElementById('applemusic-stats-hours');
    if (hoursEl) hoursEl.innerText = hours;
}

function applemusicRenderAccountCards() {
    const container = document.getElementById('applemusic-account-cards-container');
    if (!container) return;

    let cards = applemusicGetDefaultCards();
    if (typeof musicAppData !== 'undefined' && musicAppData.accountCards && Array.isArray(musicAppData.accountCards) && musicAppData.accountCards.length === 4) {
        cards = musicAppData.accountCards;
    }

    let html = '';
    cards.forEach((card, index) => {
        let topContentHtml = '';
        if (card.cover) {
            topContentHtml = `<img src="${card.cover}" style="width: 100%; height: 100%; object-fit: cover;">`;
        } else {
            if (index === 0) {
                topContentHtml = `<div style="flex: 1; background: #3a3a3c; display: flex; align-items: center; justify-content: center; font-size: 10px; font-weight: 700; color: #ffffff; padding: 4px; text-align: center;">Haruhi Limited</div>`;
            } else if (index === 1) {
                topContentHtml = `<div style="flex: 1; background: linear-gradient(135deg, #d8d8d8 0%, #8e8e93 50%, #ffffff 100%); display: flex; align-items: center; justify-content: center; font-size: 11px; font-weight: 700; color: #222; text-shadow: 0 1px 2px rgba(255,255,255,0.8);">Ice man</div>`;
            } else if (index === 2) {
                topContentHtml = `<div style="flex: 1; background: #ffffff; border-bottom: 0.5px solid rgba(0,0,0,0.06); display: flex; align-items: center; justify-content: center; font-size: 9px; font-weight: 600; color: #666; padding: 4px; text-align: center;">PARABLES</div>`;
            } else {
                topContentHtml = `<div style="flex: 1; background: #2c2c2e; display: flex; align-items: center; justify-content: center; font-size: 9px; font-weight: 600; color: #ffffff; padding: 4px; text-align: center;">Fight</div>`;
            }
        }

        html += `
            <div style="background: rgba(0,0,0,0.04); border-radius: 12px; overflow: hidden; display: flex; flex-direction: column; justify-content: space-between; height: 116px; box-sizing: border-box;">
                <div style="flex: 1; display: flex; overflow: hidden;">${topContentHtml}</div>
                <div style="padding: 6px 2px; font-size: 11px; color: #1c1c1e; font-weight: 500; text-align: center; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; background: rgba(0,0,0,0.03);">
                    ${card.title}
                </div>
            </div>
        `;
    });

    container.innerHTML = html;
}

function applemusicRenderFeaturedCards() {
    const container = document.getElementById('applemusic-home-featured-container');
    if (!container) return;

    let featured = applemusicGetDefaultFeaturedCards();
    if (typeof musicAppData !== 'undefined' && musicAppData.featuredCards && Array.isArray(musicAppData.featuredCards) && musicAppData.featuredCards.length === 2) {
        featured = musicAppData.featuredCards;
    }

    let html = '';
    featured.forEach((item, index) => {
        const bgStyle = item.cover ? `background-image: url('${item.cover}'); background-size: cover; background-position: center;` : (item.bg || 'background: #2c2c2e;');
        html += `
            <div class="applemusic-featured-card" style="${bgStyle}">
                <div class="applemusic-card-text-bottom">
                    <div class="applemusic-card-subtitle">${item.subtitle}</div>
                    <div class="applemusic-card-title">${item.title}</div>
                </div>
            </div>
        `;
    });

    container.innerHTML = html;
}

let applemusicTempDressUpCards = [];
let applemusicTempFeaturedCards = [];
let applemusicTempAvatar = '';

function applemusicInitDressUpView(isInit = true) {
    let currentNickname = 'Piagnone';
    let currentBio = '持续失眠中 · 做自己的宇宙';
    let currentFollows = '28';
    let currentFans = '16';
    let currentLevel = 'Lv.8';
    let currentHours = '3642';

    if (isInit) {
        if (typeof musicAppData !== 'undefined') {
            applemusicTempAvatar = musicAppData.profileAvatar || '';
            if (musicAppData.profileNickname) currentNickname = musicAppData.profileNickname;
            if (musicAppData.profileBio) currentBio = musicAppData.profileBio;
            if (musicAppData.profileFollows) currentFollows = musicAppData.profileFollows;
            if (musicAppData.profileFans) currentFans = musicAppData.profileFans;
            if (musicAppData.profileLevel) currentLevel = musicAppData.profileLevel;
            if (musicAppData.profileHours) currentHours = musicAppData.profileHours;

            if (musicAppData.accountCards && Array.isArray(musicAppData.accountCards) && musicAppData.accountCards.length === 4) {
                applemusicTempDressUpCards = JSON.parse(JSON.stringify(musicAppData.accountCards));
            } else {
                applemusicTempDressUpCards = applemusicGetDefaultCards();
            }
            if (musicAppData.featuredCards && Array.isArray(musicAppData.featuredCards) && musicAppData.featuredCards.length === 2) {
                applemusicTempFeaturedCards = JSON.parse(JSON.stringify(musicAppData.featuredCards));
            } else {
                applemusicTempFeaturedCards = applemusicGetDefaultFeaturedCards();
            }
        } else {
            applemusicTempDressUpCards = applemusicGetDefaultCards();
            applemusicTempFeaturedCards = applemusicGetDefaultFeaturedCards();
        }

        const nicknameInput = document.getElementById('applemusic-dressup-nickname-input');
        if (nicknameInput) nicknameInput.value = currentNickname;

        const bioInput = document.getElementById('applemusic-dressup-bio-input');
        if (bioInput) bioInput.value = currentBio;

        const followsInput = document.getElementById('applemusic-dressup-follows-input');
        if (followsInput) followsInput.value = currentFollows;

        const fansInput = document.getElementById('applemusic-dressup-fans-input');
        if (fansInput) fansInput.value = currentFans;

        const levelInput = document.getElementById('applemusic-dressup-level-input');
        if (levelInput) levelInput.value = currentLevel;

        const hoursInput = document.getElementById('applemusic-dressup-hours-input');
        if (hoursInput) hoursInput.value = currentHours;

        const dressupPreview = document.getElementById('applemusic-dressup-avatar-preview');
        if (dressupPreview) {
            dressupPreview.innerHTML = applemusicTempAvatar
                ? `<img src="${applemusicTempAvatar}" style="width:100%;height:100%;border-radius:50%;object-fit:cover;">`
                : '';
        }
    }

    // 渲染 4 个主页卡片
    const container = document.getElementById('applemusic-dressup-cards-editor');
    if (container) {
        let html = '';
        applemusicTempDressUpCards.forEach((card, index) => {
            let topContentHtml = '';
            if (card.cover) {
                topContentHtml = `<img src="${card.cover}" style="width: 100%; height: 100%; object-fit: cover;">`;
            } else {
                if (index === 0) {
                    topContentHtml = `<div style="flex: 1; width: 100%; height: 100%; background: #3a3a3c; display: flex; align-items: center; justify-content: center; font-size: 9px; font-weight: 700; color: #ffffff; padding: 2px; text-align: center;">Haruhi Limited</div>`;
                } else if (index === 1) {
                    topContentHtml = `<div style="flex: 1; width: 100%; height: 100%; background: linear-gradient(135deg, #d8d8d8 0%, #8e8e93 50%, #ffffff 100%); display: flex; align-items: center; justify-content: center; font-size: 10px; font-weight: 700; color: #222; text-shadow: 0 1px 2px rgba(255,255,255,0.8);">Ice man</div>`;
                } else if (index === 2) {
                    topContentHtml = `<div style="flex: 1; width: 100%; height: 100%; background: #ffffff; border: 0.5px solid rgba(0,0,0,0.06); display: flex; align-items: center; justify-content: center; font-size: 8px; font-weight: 600; color: #666; padding: 2px; text-align: center;">PARABLES</div>`;
                } else {
                    topContentHtml = `<div style="flex: 1; width: 100%; height: 100%; background: #2c2c2e; display: flex; align-items: center; justify-content: center; font-size: 9px; font-weight: 600; color: #ffffff; padding: 2px; text-align: center;">Fight</div>`;
                }
            }

            html += `
                <div style="display: flex; flex-direction: column; gap: 6px; box-sizing: border-box;">
                    <div onclick="applemusicTriggerDressUpCardUpload(event, ${index})" style="width: 100%; height: 95px; border-radius: 10px; overflow: hidden; background: #f2f2f7; display: flex; align-items: center; justify-content: center; cursor: pointer; box-shadow: 0 2px 8px rgba(0,0,0,0.06); position: relative; border: 0.5px solid rgba(0,0,0,0.08);">
                        ${topContentHtml}
                        <div style="position: absolute; inset: 0; background: rgba(0,0,0,0.15); opacity: 0; hover:opacity: 1; transition: opacity 0.2s; display: flex; align-items: center; justify-content: center;">
                            <svg viewBox="0 0 24 24" width="16" height="16" fill="#ffffff"><path d="M4 4h3l2-2h6l2 2h3c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2zm8 3c-2.76 0-5 2.24-5 5s2.24 5 5 5 5-2.24 5-5-2.24-5-5-5zm0 8c-1.65 0-3-1.35-3-3s1.35-3 3-3 3 1.35 3 3-1.35 3-3 3z"/></svg>
                        </div>
                    </div>
                    <input type="text" id="dressup-card-title-${index}" value="${card.title}" placeholder="标题" style="width: 100%; border: 1px solid rgba(0,0,0,0.15); border-radius: 5px; padding: 5px 3px; font-size: 11px; font-weight: 500; color: #1c1c1e; background: #ffffff; outline: none; text-align: center; box-sizing: border-box;">
                </div>
            `;
        });
        container.innerHTML = html;
    }

    // 渲染 2 个专属精选推荐大卡片 (横向并排展示，下方对应输入框)
    const featuredContainer = document.getElementById('applemusic-dressup-featured-editor');
    if (featuredContainer) {
        let fHtml = '';
        applemusicTempFeaturedCards.forEach((item, index) => {
            const bgPreview = item.cover ? `<img src="${item.cover}" style="width:100%;height:100%;object-fit:cover;">` : `<div style="width:100%;height:100%;${item.bg || 'background:#2c2c2e;'}"></div>`;
            fHtml += `
                <div style="display: flex; flex-direction: column; gap: 6px; box-sizing: border-box;">
                    <div onclick="applemusicTriggerDressUpFeaturedUpload(event, ${index})" style="width: 100%; height: 110px; border-radius: 12px; overflow: hidden; cursor: pointer; position: relative; border: 0.5px solid rgba(0,0,0,0.08); box-shadow: 0 2px 8px rgba(0,0,0,0.06);">
                        ${bgPreview}
                        <div style="position: absolute; inset: 0; background: rgba(0,0,0,0.2); display: flex; align-items: center; justify-content: center;">
                            <svg viewBox="0 0 24 24" width="18" height="18" fill="#fff"><path d="M4 4h3l2-2h6l2 2h3c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2zm8 3c-2.76 0-5 2.24-5 5s2.24 5 5 5 5-2.24 5-5-2.24-5-5-5zm0 8c-1.65 0-3-1.35-3-3s1.35-3 3-3 3 1.35 3 3-1.35 3-3 3z"/></svg>
                        </div>
                    </div>
                    <input type="text" id="dressup-featured-sub-${index}" value="${item.subtitle}" placeholder="副标题" style="width: 100%; border: 1px solid rgba(0,0,0,0.15); border-radius: 5px; padding: 5px 6px; font-size: 11px; color: #8e8e93; background: #fff; outline: none; box-sizing: border-box;">
                    <input type="text" id="dressup-featured-title-${index}" value="${item.title}" placeholder="主标题" style="width: 100%; border: 1px solid rgba(0,0,0,0.15); border-radius: 5px; padding: 5px 6px; font-size: 12px; font-weight: 600; color: #1c1c1e; background: #fff; outline: none; box-sizing: border-box;">
                </div>
            `;
        });
        featuredContainer.innerHTML = fHtml;
    }
}

function applemusicSaveDressUpSettings() {
    const nicknameInput = document.getElementById('applemusic-dressup-nickname-input');
    const newNickname = nicknameInput ? nicknameInput.value.trim() || 'Piagnone' : 'Piagnone';

    const bioInput = document.getElementById('applemusic-dressup-bio-input');
    const newBio = bioInput ? bioInput.value.trim() || '持续失眠中 · 做自己的宇宙' : '持续失眠中 · 做自己的宇宙';

    const followsInput = document.getElementById('applemusic-dressup-follows-input');
    const newFollows = followsInput ? followsInput.value.trim() || '28' : '28';

    const fansInput = document.getElementById('applemusic-dressup-fans-input');
    const newFans = fansInput ? fansInput.value.trim() || '16' : '16';

    const levelInput = document.getElementById('applemusic-dressup-level-input');
    const newLevel = levelInput ? levelInput.value.trim() || 'Lv.8' : 'Lv.8';

    const hoursInput = document.getElementById('applemusic-dressup-hours-input');
    const newHours = hoursInput ? hoursInput.value.trim() || '3642' : '3642';

    applemusicTempDressUpCards.forEach((card, index) => {
        const input = document.getElementById(`dressup-card-title-${index}`);
        if (input && input.value.trim()) {
            card.title = input.value.trim();
        }
    });

    applemusicTempFeaturedCards.forEach((item, index) => {
        const subInput = document.getElementById(`dressup-featured-sub-${index}`);
        const titleInput = document.getElementById(`dressup-featured-title-${index}`);
        if (subInput && subInput.value.trim()) item.subtitle = subInput.value.trim();
        if (titleInput && titleInput.value.trim()) item.title = titleInput.value.trim();
    });

    if (typeof musicAppData !== 'undefined') {
        musicAppData.profileAvatar = applemusicTempAvatar;
        musicAppData.profileNickname = newNickname;
        musicAppData.profileBio = newBio;
        musicAppData.profileFollows = newFollows;
        musicAppData.profileFans = newFans;
        musicAppData.profileLevel = newLevel;
        musicAppData.profileHours = newHours;
        musicAppData.accountCards = applemusicTempDressUpCards;
        musicAppData.featuredCards = applemusicTempFeaturedCards;
        if (typeof saveMusicAppData === 'function') saveMusicAppData();
    }

    applemusicRenderProfileAvatar();
    applemusicRenderAccountCards();
    applemusicRenderFeaturedCards();

    if (typeof showToast === 'function') showToast('资料与装扮已保存');
    else alert('资料与装扮已保存');

    applemusicSwitchView('settings');
}

// ================= 邀请一起听歌逻辑 =================
// Reuse the active player when a music invitation is accepted.
function applemusicAcceptListenTogether(songId, songName, artistName, coverUrl, contactId) {
    const targetId = String(songId || '').trim();
    if (!targetId || !contactId) return false;

    const queue = Array.isArray(window.applemusicCurrentQueue) ? window.applemusicCurrentQueue : [];
    const currentSong = window.applemusicCurrentPlayingSong;
    const existingSong = queue.find(song => song && String(song.id) === targetId);
    const invitedSong = existingSong ||
        (currentSong && String(currentSong.id) === targetId ? currentSong : null) ||
        { id: songId, name: songName, artist: artistName, cover: coverUrl };

    // Keep the existing queue (including local file URLs) so skipping still works.
    window.applemusicCurrentQueue = existingSong ? queue : [invitedSong, ...queue];
    window.applemusicCurrentQueueSource = '一起听歌';
    window.applemusicListenTogetherContactId = contactId;

    try {
        localStorage.setItem('applemusicListenTogetherContactId', contactId);
        const contact = typeof wcContactsList !== 'undefined' &&
            wcContactsList.find(item => item.id === contactId);
        if (contact) localStorage.setItem('applemusicListenTogetherCharAvatar', contact.avatar || '');
    } catch (e) {}

    const sameSong = currentSong && String(currentSong.id) === targetId;
    if (typeof appSettings !== 'undefined') {
        appSettings.wc_listen_together_contact_id = contactId;
        appSettings.wc_listen_together_start_time = Date.now();
        appSettings.wc_listen_together_song_count = sameSong ? 1 : 0;
        if (typeof saveAppSettings === 'function') saveAppSettings();
    }

    if (sameSong) {
        // Never tear down an active audio source just to enter together mode.
        const audio = document.getElementById('applemusic-audio-player');
        if (audio && audio.paused && (audio.currentSrc || audio.getAttribute('src'))) {
            const resume = audio.play();
            if (resume && typeof resume.catch === 'function') {
                resume.then(() => {
                    applemusicUpdatePlayPauseUI(false);
                }).catch(error => {
                    console.warn('Unable to resume music after joining together:', error);
                    applemusicUpdatePlayPauseUI(true);
                });
            }
        }
        applemusicPersistPlaybackState();
        applemusicUpdateListenTogetherUI();
    } else {
        applemusicPlaySong(invitedSong.id, invitedSong.name, invitedSong.artist, invitedSong.cover);
    }
    return true;
}

let applemusicInviteSelectedCharId = null;
let applemusicInviteChars = [];

async function applemusicOpenInviteModal() {
    applemusicCloseMoreMenu();
    if (!window.applemusicCurrentPlayingSong) {
        if (typeof showToast === 'function') showToast('请先播放一首歌曲');
        else alert('请先播放一首歌曲');
        return;
    }

    if (typeof wcReloadContactsFromStorage === 'function') {
        await wcReloadContactsFromStorage();
    }

    if (typeof wcContactsList === 'undefined' || wcContactsList.length === 0) {
        if (typeof showToast === 'function') showToast('暂无联系人可邀请');
        else alert('暂无联系人可邀请');
        return;
    }

    applemusicInviteChars = wcContactsList;
    applemusicInviteSelectedCharId = applemusicInviteChars[0].id;

    const modal = document.getElementById('applemusic-modal-invite-listen');
    if (modal) modal.classList.add('applemusic-active');

    const carousel = document.getElementById('applemusic-invite-carousel');

    if (carousel) {
        carousel.innerHTML = '';

        applemusicInviteChars.forEach((char, index) => {
            const coverHtml = char.avatar
                ? `<img src="${char.avatar}">`
                : `<svg viewBox="0 0 24 24"><path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/></svg>`;

            carousel.innerHTML += `
                <div class="applemusic-invite-carousel-card ${index === 0 ? 'active' : ''}" data-id="${char.id}" data-name="${char.remark || char.name}" data-index="${index}">
                    ${coverHtml}
                </div>
            `;
        });

        carousel.onscroll = function() {
            const center = carousel.scrollLeft + carousel.clientWidth / 2;
            let minDiff = Infinity;
            let activeCard = null;

            carousel.querySelectorAll('.applemusic-invite-carousel-card').forEach(card => {
                const cardCenter = card.offsetLeft + card.offsetWidth / 2;
                const diff = Math.abs(center - cardCenter);
                if (diff < minDiff) {
                    minDiff = diff;
                    activeCard = card;
                }
                card.classList.remove('active');
            });

            if (activeCard) {
                const newId = activeCard.dataset.id;
                if (newId !== applemusicInviteSelectedCharId) {
                    activeCard.classList.add('active');
                    document.getElementById('applemusic-invite-char-name').innerText = activeCard.dataset.name;
                    applemusicInviteSelectedCharId = newId;
                } else {
                    activeCard.classList.add('active');
                }
            }
        };

        carousel.scrollLeft = 0;
        document.getElementById('applemusic-invite-char-name').innerText = applemusicInviteChars[0].remark || applemusicInviteChars[0].name;
    }
}

function applemusicCloseInviteModal() {
    const modal = document.getElementById('applemusic-modal-invite-listen');
    if (modal) modal.classList.remove('applemusic-active');
}

function applemusicConfirmInvite() {
    if (!applemusicInviteSelectedCharId || !window.applemusicCurrentPlayingSong) return;

    const song = window.applemusicCurrentPlayingSong;
    const inviteText = `[音乐邀请] ${song.name} - ${song.artist} | ${song.cover} | ${song.id}`;

    if (typeof wcAppendChatMessage === 'function') {
        wcAppendChatMessage(inviteText, 'sent', applemusicInviteSelectedCharId, null, null, false);
        if (typeof showToast === 'function') showToast('邀请已发送');
    }

    applemusicCloseInviteModal();
}

function applemusicPlayPrevSong(actor = 'User') {
    if (!window.applemusicCurrentQueue || window.applemusicCurrentQueue.length === 0) return;
    if (!window.applemusicCurrentPlayingSong) return;

    let currentIndex = window.applemusicCurrentQueue.findIndex(s => s.id == window.applemusicCurrentPlayingSong.id);
    if (currentIndex === -1) currentIndex = 0;

    let prevIndex = currentIndex - 1;
    if (prevIndex < 0) {
        prevIndex = window.applemusicCurrentQueue.length - 1; // 循环到最后一首
    }

    const prevSong = window.applemusicCurrentQueue[prevIndex];
    if (window.wcMusicActionLogs) window.wcMusicActionLogs.push(`${actor === 'Char' ? 'Char' : 'User'} 切换到了上一首歌曲：${prevSong.name} - ${prevSong.artist}`);
    applemusicPlaySong(prevSong.id, prevSong.name, prevSong.artist, prevSong.cover);
}

function applemusicPlayNextSong(isAuto = false, actor = 'User') {
    if (!window.applemusicCurrentQueue || window.applemusicCurrentQueue.length === 0) return;
    if (!window.applemusicCurrentPlayingSong) return;

    let currentIndex = window.applemusicCurrentQueue.findIndex(s => s.id == window.applemusicCurrentPlayingSong.id);
    // Unknown current song starts at the first track; known songs wrap at the end.
    const nextIndex = currentIndex === -1 ? 0 : (currentIndex + 1) % window.applemusicCurrentQueue.length;

    const nextSong = window.applemusicCurrentQueue[nextIndex];
    if (window.wcMusicActionLogs) {
        if (isAuto === true) {
            window.wcMusicActionLogs.push(`当前歌曲播放完毕，自动切换到了下一首：${nextSong.name} - ${nextSong.artist}`);
        } else {
            window.wcMusicActionLogs.push(`${actor === 'Char' ? 'Char' : 'User'} 切换到了下一首歌曲：${nextSong.name} - ${nextSong.artist}`);
        }
    }
    applemusicPlaySong(nextSong.id, nextSong.name, nextSong.artist, nextSong.cover);
}

// ================= 悬浮歌词条 (灵动岛) 逻辑 =================
function applemusicInitDynamicIsland() {
    try {
        const saved = localStorage.getItem('applemusicDynamicIslandConfig');
        if (saved) {
            applemusicDynamicIslandConfig = { ...applemusicDynamicIslandConfig, ...JSON.parse(saved) };
        }
    } catch(e) {}

    // 脱离局部容器束缚，确保在全局所有页面和视图中始终显示
    const island = document.getElementById('applemusic-dynamic-island');
    const popup = document.getElementById('applemusic-island-popup-overlay');
    if (island && island.parentElement !== document.body) {
        document.body.appendChild(island);
    }
    if (popup && popup.parentElement !== document.body) {
        document.body.appendChild(popup);
    }

    applemusicApplyDynamicIslandConfig();
    applemusicBindDynamicIslandDrag();
}

function applemusicApplyDynamicIslandConfig() {
    const island = document.getElementById('applemusic-dynamic-island');
    if (!island) return;

    island.style.display = applemusicDynamicIslandConfig.enabled ? 'flex' : 'none';

    const scale = applemusicDynamicIslandConfig.scale || 1;
    const color = applemusicDynamicIslandConfig.color || '#ffffff';

    island.style.setProperty('--am-island-scale', scale);
    island.style.setProperty('--am-island-color', color);

    if (applemusicDynamicIslandConfig.x !== 0 || applemusicDynamicIslandConfig.y !== 0) {
        island.style.left = applemusicDynamicIslandConfig.x + 'px';
        island.style.top = applemusicDynamicIslandConfig.y + 'px';
        island.style.transform = `scale(${scale})`;
    } else {
        island.style.left = '50%';
        island.style.top = '36px';
        island.style.transform = `translateX(-50%) scale(${scale})`;
    }

    const toggle = document.getElementById('applemusic-dynamic-island-toggle');
    if (toggle) {
        if (applemusicDynamicIslandConfig.enabled) toggle.classList.add('active');
        else toggle.classList.remove('active');
    }

    // 同步抽屉面板内部状态
    const drawerToggle = document.getElementById('applemusic-island-drawer-toggle');
    const drawerStatus = document.getElementById('applemusic-island-drawer-status');
    const statusDot = document.getElementById('applemusic-island-status-dot');
    if (drawerToggle) {
        if (applemusicDynamicIslandConfig.enabled) {
            drawerToggle.classList.add('active');
            drawerToggle.style.background = '#18181b';
        } else {
            drawerToggle.classList.remove('active');
            drawerToggle.style.background = '#e4e4e7';
        }
    }
    if (drawerStatus) {
        drawerStatus.innerText = applemusicDynamicIslandConfig.enabled ? '已开启' : '关闭';
        drawerStatus.style.color = applemusicDynamicIslandConfig.enabled ? '#18181b' : '#71717a';
    }
    if (statusDot) {
        statusDot.style.background = applemusicDynamicIslandConfig.enabled ? '#18181b' : '#a1a1aa';
    }

    const scaleSlider = document.getElementById('applemusic-island-scale-slider');
    const scaleInput = document.getElementById('applemusic-island-scale-input');
    const scalePercent = Math.round(scale * 100);
    if (scaleSlider && scaleSlider.value != scalePercent) scaleSlider.value = scalePercent;
    if (scaleInput && scaleInput.value != scalePercent) scaleInput.value = scalePercent;

    const colorInput = document.getElementById('applemusic-island-color-input');
    const colorText = document.getElementById('applemusic-island-color-text');
    if (colorInput) colorInput.value = color;
    if (colorText) colorText.value = color;

    const previewDeck = document.getElementById('applemusic-island-drawer-preview');
    if (previewDeck) {
        previewDeck.style.setProperty('--am-island-scale', scale);
        previewDeck.style.setProperty('--am-island-color', color);
    }
}

function applemusicOpenIslandDrawer() {
    const modal = document.getElementById('applemusic-modal-island-settings');
    if (modal) {
        modal.classList.add('applemusic-active');
        applemusicApplyDynamicIslandConfig();
    }
}

function applemusicCloseIslandDrawer() {
    const modal = document.getElementById('applemusic-modal-island-settings');
    if (modal) modal.classList.remove('applemusic-active');
}

function applemusicToggleIslandDrawerSwitch() {
    applemusicDynamicIslandConfig.enabled = !applemusicDynamicIslandConfig.enabled;
    applemusicSaveDynamicIslandConfig();
    applemusicApplyDynamicIslandConfig();
}

function applemusicChangeIslandScale(val) {
    const num = parseFloat(val);
    if (isNaN(num) || num <= 0) return;
    applemusicDynamicIslandConfig.scale = parseFloat((num / 100).toFixed(2));
    applemusicSaveDynamicIslandConfig();
    applemusicApplyDynamicIslandConfig();
}

function applemusicChangeIslandColor(colorVal) {
    if (!colorVal) return;
    applemusicDynamicIslandConfig.color = colorVal;
    applemusicSaveDynamicIslandConfig();
    applemusicApplyDynamicIslandConfig();
}

function applemusicResetIslandPosition() {
    applemusicDynamicIslandConfig.x = 0;
    applemusicDynamicIslandConfig.y = 0;
    applemusicSaveDynamicIslandConfig();
    applemusicApplyDynamicIslandConfig();
    if (typeof showToast === 'function') showToast('已复位悬浮音乐条位置');
}

function applemusicSaveIslandDrawerSettings() {
    applemusicSaveDynamicIslandConfig();
    applemusicCloseIslandDrawer();
    if (typeof showToast === 'function') showToast('悬浮条设置已保存');
}

function applemusicSaveDynamicIslandConfig() {
    try {
        localStorage.setItem('applemusicDynamicIslandConfig', JSON.stringify(applemusicDynamicIslandConfig));
    } catch(e) {}
}

function applemusicToggleDynamicIsland() {
    applemusicDynamicIslandConfig.enabled = !applemusicDynamicIslandConfig.enabled;
    applemusicSaveDynamicIslandConfig();
    applemusicApplyDynamicIslandConfig();
}

function applemusicBindDynamicIslandDrag() {
    const island = document.getElementById('applemusic-dynamic-island');
    const overlay = document.getElementById('applemusic-island-popup-overlay');
    if (!island || !overlay) return;

    let isDragging = false;
    let hasMoved = false;
    let startX, startY, initialLeft, initialTop;

    const startDrag = (e) => {
        isDragging = true;
        hasMoved = false;
        const clientX = e.touches ? e.touches[0].clientX : e.clientX;
        const clientY = e.touches ? e.touches[0].clientY : e.clientY;

        startX = clientX;
        startY = clientY;

        const rect = island.getBoundingClientRect();
        initialLeft = rect.left;
        initialTop = rect.top;

        island.style.transform = 'none';
        island.style.left = initialLeft + 'px';
        island.style.top = initialTop + 'px';
    };

    const doDrag = (e) => {
        if (!isDragging) return;
        const clientX = e.touches ? e.touches[0].clientX : e.clientX;
        const clientY = e.touches ? e.touches[0].clientY : e.clientY;

        const dx = clientX - startX;
        const dy = clientY - startY;

        // 提高防抖阈值，防止轻微触碰被误判为拖拽
        if (Math.abs(dx) > 5 || Math.abs(dy) > 5) {
            hasMoved = true;
        }

        if (hasMoved) {
            e.preventDefault(); // 阻止原生滚动/下拉刷新干扰
            let newLeft = initialLeft + dx;
            let newTop = initialTop + dy;

            const maxLeft = window.innerWidth - island.offsetWidth;
            const maxTop = window.innerHeight - island.offsetHeight;

            if (newLeft < 0) newLeft = 0;
            if (newLeft > maxLeft) newLeft = maxLeft;
            if (newTop < 0) newTop = 0;
            if (newTop > maxTop) newTop = maxTop;

            island.style.left = newLeft + 'px';
            island.style.top = newTop + 'px';
        }
    };

    const endDrag = (e) => {
        if (!isDragging) return;
        isDragging = false;

        if (!hasMoved) {
            // 确认为点击，展开弹窗
            overlay.classList.add('active');
            island.style.opacity = '0';
            // 阻止后续的 click 事件，防止触发 overlay 的关闭逻辑导致闪烁或无法点击
            if (e.cancelable) {
                e.preventDefault();
            }
        } else {
            // 确认为拖拽，保存位置
            const rect = island.getBoundingClientRect();
            applemusicDynamicIslandConfig.x = rect.left;
            applemusicDynamicIslandConfig.y = rect.top;
            applemusicSaveDynamicIslandConfig();
        }
    };

    island.addEventListener('mousedown', startDrag);
    document.addEventListener('mousemove', doDrag);
    document.addEventListener('mouseup', endDrag);

    island.addEventListener('touchstart', startDrag, { passive: false });
    document.addEventListener('touchmove', doDrag, { passive: false });
    document.addEventListener('touchend', endDrag);
}

function applemusicCloseIslandPopup(event) {
    const overlay = document.getElementById('applemusic-island-popup-overlay');
    const island = document.getElementById('applemusic-dynamic-island');
    // 允许通过代码直接调用（无 event 或 event.target 不限制）
    if (!event || (overlay && event.target === overlay)) {
        if (overlay) overlay.classList.remove('active');
        if (island) island.style.opacity = '1';

        // 恢复弹窗为主视图，以便下次打开时显示封面
        setTimeout(() => {
            const mainView = document.getElementById('applemusic-popup-main-view');
            const listView = document.getElementById('applemusic-popup-list-view');
            if (mainView) mainView.style.display = 'block';
            if (listView) listView.style.display = 'none';
        }, 300);
    }
}

// 切换弹窗内部的列表视图
function applemusicTogglePopupListView(event) {
    if (event) event.stopPropagation();
    const mainView = document.getElementById('applemusic-popup-main-view');
    const listView = document.getElementById('applemusic-popup-list-view');

    if (listView.style.display === 'none') {
        mainView.style.display = 'none';
        listView.style.display = 'flex';
        applemusicRenderPopupList();
    } else {
        mainView.style.display = 'block';
        listView.style.display = 'none';
    }
}

// 渲染弹窗内部的列表
function applemusicRenderPopupList() {
    const container = document.getElementById('applemusic-popup-list-container');
    if (!container) return;
    container.innerHTML = '';

    if (!window.applemusicCurrentQueue || window.applemusicCurrentQueue.length === 0) {
        container.innerHTML = '<div style="padding: 20px; text-align: center; color: rgba(0,0,0,0.5);">暂无待播歌曲</div>';
        return;
    }

    // 渲染当前播放的歌曲
    if (window.applemusicCurrentPlayingSong) {
        const current = window.applemusicCurrentPlayingSong;
        container.innerHTML += `
            <div class="applemusic-current-playing-header" style="margin-bottom: 20px; display: flex; align-items: center;">
                <img src="${current.cover}" class="applemusic-current-cover" style="width: 50px; height: 50px; border-radius: 6px; margin-right: 12px; box-shadow: 0 4px 10px rgba(0,0,0,0.1);">
                <div class="applemusic-current-info" style="flex: 1; overflow: hidden;">
                    <div class="applemusic-current-title" style="color: #000; font-size: 16px; font-weight: 600; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">${current.name}</div>
                    <div class="applemusic-current-artist" style="color: rgba(0,0,0,0.6); font-size: 13px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">${current.artist}</div>
                </div>
                <div class="applemusic-action-btn" style="background: rgba(0,0,0,0.05); width: 28px; height: 28px; display: flex; align-items: center; justify-content: center; border-radius: 50%;">
                    <svg viewBox="0 0 24 24" style="width: 16px; height: 16px; fill: #000;"><path d="M6 10c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm12 0c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm-6 0c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z"/></svg>
                </div>
            </div>
            <div style="font-size: 14px; font-weight: 700; color: #000; margin-bottom: 12px;">接下来的播放</div>
        `;
    }

    const queue = window.applemusicCurrentQueue;
    const currentIndex = queue.findIndex(song => String(song.id) === String(window.applemusicCurrentPlayingSong?.id));
    // Show the complete repeating cycle, not only the remaining tail.
    const nextSongs = currentIndex === -1
        ? [...queue]
        : [...queue.slice(currentIndex + 1), ...queue.slice(0, currentIndex)];

    if (nextSongs.length === 0) {
        container.innerHTML += '<div style="padding: 20px; text-align: center; color: rgba(0,0,0,0.5);">当前列表只有一首歌曲</div>';
        return;
    }

        // 渲染待播列表
        nextSongs.forEach(song => {
            const div = document.createElement('div');
            div.className = 'applemusic-list-item';
            div.style.marginBottom = '12px';
            div.style.cursor = 'pointer';
            div.onclick = () => {
                applemusicPlaySong(song.id, song.name, song.artist, song.cover);
                applemusicRenderPopupList(); // 重新渲染以更新当前播放
            };

            div.innerHTML = `
                <img src="${song.cover}" class="applemusic-list-cover" style="width: 44px; height: 44px; border-radius: 6px; margin-right: 12px; background: #eee;">
                <div class="applemusic-list-info" style="flex: 1; overflow: hidden;">
                    <div class="applemusic-list-title" style="color: #000; font-size: 15px; font-weight: 500; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">${song.name}</div>
                    <div class="applemusic-list-artist" style="color: rgba(0,0,0,0.6); font-size: 13px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">${song.artist}</div>
                </div>
            `;
            container.appendChild(div);
        });
    }

// ================= 悬浮歌词业务逻辑 =================
function applemusicInitFloatingLyrics() {
    try {
        const saved = localStorage.getItem('applemusicFloatingLyricsConfig');
        if (saved) {
            applemusicFloatingLyricsConfig = { ...applemusicFloatingLyricsConfig, ...JSON.parse(saved) };
        }
    } catch(e) {}

    // 脱离局部容器束缚，确保在任何页面下都不会被父级 display:none 或 transform 影响
    const win = document.getElementById('applemusic-floating-lyrics-window');
    if (win && win.parentElement !== document.body) {
        document.body.appendChild(win);
    }

    applemusicApplyFloatingLyricsConfig();
}


function applemusicApplyFloatingLyricsConfig() {
    const win = document.getElementById('applemusic-floating-lyrics-window');
    if (!win) return;

    win.style.display = applemusicFloatingLyricsConfig.enabled ? 'block' : 'none';

    // 默认居中微调定位
    const posX = applemusicFloatingLyricsConfig.x || 0;
    const posY = applemusicFloatingLyricsConfig.y || 0;
    win.style.transform = `translate(calc(-50% + ${posX}px), ${posY}px)`;

    const fontSize = applemusicFloatingLyricsConfig.fontSize || 18;
    win.style.setProperty('--fl-font-size', fontSize + 'px');
    win.style.setProperty('--fl-color', applemusicFloatingLyricsConfig.color || '#ffffff');

    // 注入自定义 CSS
    applemusicApplyFloatingLyricsCustomCss(applemusicFloatingLyricsConfig.customCss || '', false);

    // 更新设置界面的开关和状态
    const statusText = document.getElementById('applemusic-current-floating-lyrics-status');
    const statusDot = document.getElementById('applemusic-fl-status-dot');
    if (statusText) {
        statusText.innerText = applemusicFloatingLyricsConfig.enabled ? '已开启' : '关闭';
        statusText.style.color = applemusicFloatingLyricsConfig.enabled ? '#18181b' : '#71717a';
    }
    if (statusDot) {
        statusDot.style.background = applemusicFloatingLyricsConfig.enabled ? '#18181b' : '#a1a1aa';
    }

    const toggle = document.getElementById('applemusic-floating-lyrics-toggle');
    if (toggle) {
        if (applemusicFloatingLyricsConfig.enabled) {
            toggle.classList.add('active');
            toggle.style.background = '#18181b';
        } else {
            toggle.classList.remove('active');
            toggle.style.background = '#e4e4e7';
        }
    }

    // 更新 4 组视效卡片的激活状态与标签名称
    const curStyle = applemusicFloatingLyricsConfig.style || 1;
    const styleNames = { 1: '错落几何风', 2: '网易双行风', 3: '宋韵雨丝风', 4: '行书飘逸风' };
    const pillName = document.getElementById('applemusic-fl-style-pill-name');
    if (pillName) pillName.innerText = styleNames[curStyle] || '定制风格';

    for (let i = 1; i <= 4; i++) {
        const card = document.getElementById(`floating-style-card-${i}`);
        if (card) {
            if (curStyle === i) card.classList.add('active');
            else card.classList.remove('active');
        }
    }

    // 更新字体大小滑动轴与输入框
    const fontSlider = document.getElementById('applemusic-fl-fontsize-slider');
    const fontInput = document.getElementById('applemusic-fl-fontsize-input');
    if (fontSlider) fontSlider.value = fontSize;
    if (fontInput) fontInput.value = fontSize;

    // 更新位置滑动轴与输入框
    const xSlider = document.getElementById('applemusic-fl-x-slider');
    const xInput = document.getElementById('applemusic-fl-x-input');
    if (xSlider) xSlider.value = posX;
    if (xInput) xInput.value = posX;

    const ySlider = document.getElementById('applemusic-fl-y-slider');
    const yInput = document.getElementById('applemusic-fl-y-input');
    if (ySlider) ySlider.value = posY;
    if (yInput) yInput.value = posY;

    // 更新颜色输入框
    const colorInput = document.getElementById('applemusic-floating-lyrics-color-input');
    const colorText = document.getElementById('applemusic-floating-lyrics-color-text');
    if (colorInput) colorInput.value = applemusicFloatingLyricsConfig.color || '#ffffff';
    if (colorText) colorText.value = applemusicFloatingLyricsConfig.color || '#ffffff';

    const customCssTextarea = document.getElementById('applemusic-floating-lyrics-custom-css');
    if (customCssTextarea) customCssTextarea.value = applemusicFloatingLyricsConfig.customCss || '';

    // 重新渲染当前歌词内容并全真同步设置页面的动态视效预览舱
    const previewLyric = applemusicLastRenderedFloatingCurrentLyric || '让音乐在屏幕间流淌 · 随心而动';
    const previewNextLyric = applemusicLastRenderedFloatingNextLyric || 'Music for Everyone';
    applemusicRenderFloatingLyricContent(previewLyric, previewNextLyric);
}

function applemusicSaveFloatingLyricsConfig() {
    try {
        localStorage.setItem('applemusicFloatingLyricsConfig', JSON.stringify(applemusicFloatingLyricsConfig));
    } catch(e) {}
}

function applemusicToggleFloatingLyrics() {
    applemusicFloatingLyricsConfig.enabled = !applemusicFloatingLyricsConfig.enabled;
    applemusicSaveFloatingLyricsConfig();
    applemusicApplyFloatingLyricsConfig();
}

function applemusicSelectFloatingLyricsStyle(styleNum) {
    applemusicFloatingLyricsConfig.style = styleNum;
    applemusicSaveFloatingLyricsConfig();
    applemusicApplyFloatingLyricsConfig();
}

function applemusicChangeFloatingLyricsColor(colorVal) {
    if (!colorVal) return;
    applemusicFloatingLyricsConfig.color = colorVal;
    applemusicSaveFloatingLyricsConfig();
    applemusicApplyFloatingLyricsConfig();
}

function applemusicChangeFloatingLyricsSlider(val, type) {
    const numVal = parseInt(val);
    if (isNaN(numVal)) return;

    if (type === 'fontSize') {
        applemusicFloatingLyricsConfig.fontSize = numVal;
        const fontSlider = document.getElementById('applemusic-fl-fontsize-slider');
        const fontInput = document.getElementById('applemusic-fl-fontsize-input');
        if (fontSlider && fontSlider.value != numVal) fontSlider.value = numVal;
        if (fontInput && fontInput.value != numVal) fontInput.value = numVal;
    } else if (type === 'x') {
        applemusicFloatingLyricsConfig.x = numVal;
        const xSlider = document.getElementById('applemusic-fl-x-slider');
        const xInput = document.getElementById('applemusic-fl-x-input');
        if (xSlider && xSlider.value != numVal) xSlider.value = numVal;
        if (xInput && xInput.value != numVal) xInput.value = numVal;
    } else if (type === 'y') {
        applemusicFloatingLyricsConfig.y = numVal;
        const ySlider = document.getElementById('applemusic-fl-y-slider');
        const yInput = document.getElementById('applemusic-fl-y-input');
        if (ySlider && ySlider.value != numVal) ySlider.value = numVal;
        if (yInput && yInput.value != numVal) yInput.value = numVal;
    }

    applemusicSaveFloatingLyricsConfig();
    applemusicApplyFloatingLyricsConfig();
}

function applemusicResetFloatingLyricsPosition() {
    applemusicFloatingLyricsConfig.x = 0;
    applemusicFloatingLyricsConfig.y = 0;
    applemusicSaveFloatingLyricsConfig();
    applemusicApplyFloatingLyricsConfig();
    if (typeof showToast === 'function') showToast('已重置悬浮歌词位置');
}

function applemusicApplyFloatingLyricsCustomCss(cssText, shouldSave = true) {
    let styleTag = document.getElementById('applemusic-floating-lyrics-custom-style');
    if (!styleTag) {
        styleTag = document.createElement('style');
        styleTag.id = 'applemusic-floating-lyrics-custom-style';
        document.head.appendChild(styleTag);
    }
    styleTag.textContent = cssText || '';
    if (shouldSave) {
        applemusicFloatingLyricsConfig.customCss = cssText || '';
        applemusicSaveFloatingLyricsConfig();
    }
}

function applemusicUpdateFloatingLyricText(currentText, nextText) {
    if (!currentText || currentText.trim() === '') return;
    if (currentText === applemusicLastRenderedFloatingCurrentLyric && nextText === applemusicLastRenderedFloatingNextLyric) return;

    applemusicLastRenderedFloatingCurrentLyric = currentText.trim();
    applemusicLastRenderedFloatingNextLyric = (nextText || '').trim();

    applemusicRenderFloatingLyricContent(applemusicLastRenderedFloatingCurrentLyric, applemusicLastRenderedFloatingNextLyric);
}

function applemusicRenderFloatingLyricContent(currentText, nextText) {
    const container = document.getElementById('applemusic-floating-lyrics-content');
    const previewBox = document.getElementById('applemusic-fl-settings-preview-box');
    if (!container && !previewBox) return;

    const style = applemusicFloatingLyricsConfig.style || 1;
    const lyricColor = applemusicFloatingLyricsConfig.color || '#ffffff';
    const baseFontSize = applemusicFloatingLyricsConfig.fontSize || 18;
    let renderedHtml = '';

    if (style === 1) {
        // UI 样式一：错落几何风 (融入微五线谱底纹，长歌词自动折行)
        const chars = Array.from(currentText);
        const yOffsets = [-3, 3, -5, 2, -3, 4, -2, 3];
        const fontScale = [1.0, 1.15, 0.95, 1.2, 1.05, 1.25, 0.98, 1.1];

        let charsHtml = chars.map((char, index) => {
            if (char === ' ') return '<span class="am-fl-s1-space"></span>';
            const dy = yOffsets[index % yOffsets.length];
            const size = Math.round(baseFontSize * fontScale[index % fontScale.length]);
            const mod = index % 5;
            let effectClass = 'am-fl-s1-normal';
            if (mod === 1) effectClass = 'am-fl-s1-gradient';
            else if (mod === 2) effectClass = 'am-fl-s1-feather';
            else if (mod === 3) effectClass = 'am-fl-s1-stroke';
            else if (mod === 4) effectClass = 'am-fl-s1-blur';

            return `<span class="am-fl-s1-char ${effectClass}" style="--dy: ${dy}px; --fs: ${size}px; --delay: ${index * 0.03}s;">${char}</span>`;
        }).join('');

        renderedHtml = `
            <div class="am-fl-style-1" style="--fl-color: ${lyricColor}; --fl-font-size: ${baseFontSize}px;">
                <div class="am-fl-s1-staff-decor">
                    <div class="am-fl-s1-staff-line"></div>
                    <div class="am-fl-s1-staff-line"></div>
                    <div class="am-fl-s1-staff-line"></div>
                    <span class="am-fl-s1-clef">𝄞</span>
                </div>
                <div class="am-fl-s1-chars-wrap">
                    ${charsHtml}
                </div>
            </div>
        `;
    } else if (style === 2) {
        // UI 样式二：网易云双行悬浮歌词 (完全透明无底色、无发光、单色、自动折行)
        const secondLineHtml = nextText ? `<div class="am-fl-s2-line-next">${nextText}</div>` : '';

        renderedHtml = `
            <div class="am-fl-style-2" style="--fl-color: ${lyricColor}; --fl-font-size: ${baseFontSize}px;">
                <div class="am-fl-s2-line-current">${currentText}</div>
                ${secondLineHtml}
            </div>
        `;
    } else if (style === 3) {
        // UI 样式三：宋韵雨丝风 (首字实体大字羽化淡化无镂空、英文花体自适应、末尾微淡化、底部几何雨丝)
        const trimmed = currentText.trim();
        const firstChar = trimmed.charAt(0) || '';
        const restChars = Array.from(trimmed.slice(1));
        const restTotal = restChars.length;

        // 判定是否为纯英文/西文歌词
        const isEnglish = /^[A-Za-z0-9\s.,'’"!?\-—:;()…]+$/.test(trimmed);
        const englishClass = isEnglish ? 'am-fl-s3-english' : '';

        let restHtml = restChars.map((char, index) => {
            if (char === ' ') return '<span class="am-fl-s3-space">&nbsp;</span>';
            
            // 计算末尾 2~3 个字符的渐进淡化
            let tailClass = '';
            const fromEnd = restTotal - 1 - index;
            if (restTotal >= 4) {
                if (fromEnd === 0) tailClass = 'am-fl-s3-tail-fade-3';
                else if (fromEnd === 1) tailClass = 'am-fl-s3-tail-fade-2';
                else if (fromEnd === 2) tailClass = 'am-fl-s3-tail-fade-1';
            }

            return `<span class="am-fl-s3-char ${tailClass}">${char}</span>`;
        }).join('');

        // 生成雨丝动效
        const rainHtml = `
            <div class="am-fl-s3-rain-wrap">
                <span class="am-fl-s3-drop" style="--rx: 8%; --rd: 0s; --dur: 1.1s; --rh: 18px;"></span>
                <span class="am-fl-s3-drop" style="--rx: 24%; --rd: 0.35s; --dur: 1.3s; --rh: 22px;"></span>
                <span class="am-fl-s3-drop" style="--rx: 44%; --rd: 0.7s; --dur: 1.0s; --rh: 16px;"></span>
                <span class="am-fl-s3-drop" style="--rx: 64%; --rd: 0.2s; --dur: 1.25s; --rh: 20px;"></span>
                <span class="am-fl-s3-drop" style="--rx: 82%; --rd: 0.55s; --dur: 1.15s; --rh: 17px;"></span>
                <span class="am-fl-s3-drop" style="--rx: 94%; --rd: 0.85s; --dur: 1.05s; --rh: 15px;"></span>
            </div>
        `;

        renderedHtml = `
            <div class="am-fl-style-3 ${englishClass}" style="--fl-color: ${lyricColor}; --fl-font-size: ${baseFontSize}px;">
                ${rainHtml}
                <div class="am-fl-s3-chars-wrap">
                    <span class="am-fl-s3-first-char">${firstChar}</span>
                    <div class="am-fl-s3-rest-group">
                        ${restHtml}
                    </div>
                </div>
                <!-- 底部极细几何微装饰线条 -->
                <div class="am-fl-s3-geom-bottom">
                    <div class="am-fl-s3-geom-line"></div>
                    <span class="am-fl-s3-geom-point"></span>
                    <div class="am-fl-s3-geom-line"></div>
                </div>
            </div>
        `;
    } else if (style === 4) {
        // UI 样式四：行书飘逸随机风 (首字行书放大，中间随机飘逸与括号包裹，丰富独立材质)
        const trimmed = currentText.trim();
        const firstChar = trimmed.charAt(0) || '';
        const restChars = Array.from(trimmed.slice(1));

        let validIndices = [];
        restChars.forEach((c, i) => {
            if (c !== ' ') validIndices.push(i);
        });

        // 使用基于字符串内容的伪随机算法，确保同一句歌词每次渲染的随机效果固定，防止闪烁跳动
        let hash = 0;
        for (let i = 0; i < trimmed.length; i++) {
            hash = (hash << 5) - hash + trimmed.charCodeAt(i);
            hash |= 0;
        }
        const pseudoRandom = () => {
            let x = Math.sin(hash++) * 10000;
            return x - Math.floor(x);
        };

        // 打乱索引数组
        validIndices.sort(() => pseudoRandom() - 0.5);

        // 随机决定 1~2 个字使用飘逸字体
        const numCursive = Math.min(Math.floor(pseudoRandom() * 2) + 1, validIndices.length);
        const cursiveIndices = validIndices.splice(0, numCursive);

        // 随机决定 1~2 个字使用「」包裹
        const numBracket = Math.min(Math.floor(pseudoRandom() * 2) + 1, validIndices.length);
        const bracketIndices = validIndices.splice(0, numBracket);

        // 基础材质轮换列表
        const effects = [
            'am-fl-s4-effect-gradient',
            'am-fl-s4-effect-feather',
            'am-fl-s4-effect-stroke',
            'am-fl-s4-effect-blur',
            'am-fl-s4-effect-underline'
        ];

        let restHtml = restChars.map((char, index) => {
            if (char === ' ') return '<span class="am-fl-s4-space"></span>';
            
            const delay = (index + 1) * 0.04;
            let innerHtml = char;
            let extraClass = '';

            if (cursiveIndices.includes(index)) {
                extraClass = 'am-fl-s4-char-cursive';
            } else {
                extraClass = effects[index % effects.length];
            }

            if (bracketIndices.includes(index)) {
                innerHtml = `<span class="am-fl-s4-bracket">「</span>${char}<span class="am-fl-s4-bracket">」</span>`;
            }

            return `<span class="am-fl-s4-char ${extraClass}" style="--delay: ${delay}s;">${innerHtml}</span>`;
        }).join('');

        renderedHtml = `
            <div class="am-fl-style-4" style="--fl-color: ${lyricColor}; --fl-font-size: ${baseFontSize}px;">
                <div class="am-fl-s4-chars-wrap">
                    <span class="am-fl-s4-char-first">${firstChar}</span>
                    ${restHtml}
                </div>
            </div>
        `;
    }

    if (container) container.innerHTML = renderedHtml;
    if (previewBox) previewBox.innerHTML = renderedHtml;
}
