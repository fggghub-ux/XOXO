/* Dynamic Island for Fairy Phone. Icons: Bootstrap Icons (MIT). */
(() => {
    'use strict';
    if (window.tongtongDynamicIsland) return;

    const defaults = Object.freeze({ enabled: false, x: 0, y: 0, width: 146, height: 36, autoHide: false, reduceMotion: false });
    const iconPaths = {
        truck: '<path d="M0 3.5A1.5 1.5 0 0 1 1.5 2h9A1.5 1.5 0 0 1 12 3.5V5h1.02a1.5 1.5 0 0 1 1.17.563l1.481 1.85a1.5 1.5 0 0 1 .329.938V10.5a1.5 1.5 0 0 1-1.5 1.5H14a2 2 0 1 1-4 0H5a2 2 0 1 1-3.998-.085A1.5 1.5 0 0 1 0 10.5zm1.294 7.456A2 2 0 0 1 4.732 11h5.536a2 2 0 0 1 .732-.732V3.5a.5.5 0 0 0-.5-.5h-9a.5.5 0 0 0-.5.5v7a.5.5 0 0 0 .294.456M12 10a2 2 0 0 1 1.732 1h.768a.5.5 0 0 0 .5-.5V8.35a.5.5 0 0 0-.11-.312l-1.48-1.85A.5.5 0 0 0 13.02 6H12zm-9 1a1 1 0 1 0 0 2 1 1 0 0 0 0-2m9 0a1 1 0 1 0 0 2 1 1 0 0 0 0-2"/>',
        play: '<path d="m11.596 8.697-6.363 3.692c-.54.313-1.233-.066-1.233-.697V4.308c0-.63.692-1.01 1.233-.696l6.363 3.692a.802.802 0 0 1 0 1.393"/>',
        pause: '<path d="M5.5 3.5A1.5 1.5 0 0 1 7 5v6a1.5 1.5 0 0 1-3 0V5a1.5 1.5 0 0 1 1.5-1.5m5 0A1.5 1.5 0 0 1 12 5v6a1.5 1.5 0 0 1-3 0V5a1.5 1.5 0 0 1 1.5-1.5"/>',
        previous: '<path d="M4 4a.5.5 0 0 1 1 0v3.248l6.267-3.636c.54-.313 1.232.066 1.232.696v7.384c0 .63-.692 1.01-1.232.697L5 8.753V12a.5.5 0 0 1-1 0z"/>',
        next: '<path d="M12.5 4a.5.5 0 0 0-1 0v3.248L5.233 3.612C4.693 3.3 4 3.678 4 4.308v7.384c0 .63.692 1.01 1.233.697L11.5 8.753V12a.5.5 0 0 0 1 0z"/>'
    };
    // AirPlay symbol provided by the user, kept inline without new assets.
    const AIRPLAY_ICON = '<svg class="tdi-icon-svg tdi-airplay-svg" viewBox="0 0 1039 1024" fill="currentColor" aria-hidden="true"><path d="M515.967258 0.025844A520.421161 520.421161 0 0 0 167.402155 137.441841c-211.501478 193.855453-223.812163 523.408708-29.956709 734.910186 8.806257 10.561009 19.366251 19.366251 29.956709 29.95671a13.622687 13.622687 0 0 0 17.67649-1.689761l22.940747-26.482747a13.78821 13.78821 0 0 0 0-19.366251C22.968165 683.823791 10.588428 393.005069 183.324908 207.952827s461.767955-197.333478 646.819182-24.629493c185.051227 172.733434 197.334493 461.670468 24.630508 646.754191-8.806257 8.806257-15.824251 17.643994-24.630508 24.695499a13.78821 13.78821 0 0 0 0 19.366251l22.940747 26.482747c5.296752 5.296752 14.101994 5.231762 19.366251 1.689762 211.501478-195.644732 223.812163-523.408708 29.956709-734.910187A519.099004 519.099004 0 0 0 515.967258 0.025844z m16.734123 152.395367a372.951896 372.951896 0 0 0-266.545663 99.593366c-149.833307 139.23574-158.607069 373.64547-19.371329 523.441204 5.296752 5.296752 10.561009 12.314746 17.611499 17.611499a13.78821 13.78821 0 0 0 19.366251 0l22.940747-26.413694a13.78821 13.78821 0 0 0 0-19.366252c-61.673249-58.163744-98.650999-141.022988-98.650999-227.358225 0-170.949233 139.170749-310.217468 310.119982-310.217468S828.389337 350.665576 828.389337 521.617856c0 84.5815-35.287988 167.504719-96.961237 225.668463a13.78821 13.78821 0 0 0 0 19.366251l22.940747 26.417756c5.296752 5.296752 14.101994 7.051505 19.366251 1.787248 149.828229-140.993539 156.91223-375.435764 17.676489-525.231498-69.63361-74.897867-163.507783-114.117801-258.682788-117.204865z m-11.502361 143.690658a225.233837 225.233837 0 0 0-159.938365 63.395506c-89.877237 86.368748-91.596448 227.358225-5.231762 317.236478l5.231762 5.329248a13.827814 13.827814 0 0 0 19.3957 0l22.940747-26.482747a13.78821 13.78821 0 0 0 0-19.366251c-29.95671-29.95671-47.571255-72.200748-47.571255-116.262498v-0.454936a161.696164 161.696164 0 0 1 161.691086-161.692102h0.877377a161.696164 161.696164 0 0 1 161.689055 161.68804v0.422441c0 44.06175-17.611499 84.549005-49.324992 116.262497a13.78821 13.78821 0 0 0 0 19.366252l22.940747 26.482746a13.78821 13.78821 0 0 0 19.366251 0c88.122485-86.367733 91.697996-227.358225 5.329248-317.236477a222.322451 222.322451 0 0 0-157.399661-68.723739z m0.259963 335.497885a26.016641 26.016641 0 0 0-17.449021 6.336606l-1.689762 1.787247-310.222546 348.978405c-7.051505 8.806257-7.051505 21.153499 1.787248 29.956709a18.887959 18.887959 0 0 0 12.287329 5.329248h622.185627c10.561009 0 21.153499-8.806257 21.153498-21.153499 0-5.296752-1.726319-10.592489-5.231761-14.134489l-306.741475-348.980436a21.710998 21.710998 0 0 0-16.084214-8.123853z"></path></svg>';
    const svg = (name, size = 18) => '<svg width="' + size + '" height="' + size + '" viewBox="0 0 16 16" fill="currentColor" aria-hidden="true">' + iconPaths[name] + '</svg>';
    const clamp = (value, min, max, fallback) => {
        const n = Number(value);
        return Number.isFinite(n) ? Math.max(min, Math.min(max, n)) : fallback;
    };
    const config = () => {
        const saved = typeof appSettings !== 'undefined' && appSettings.dynamic_island;
        return {
            enabled: saved?.enabled === true,
            x: clamp(saved?.x, -90, 90, 0),
            y: clamp(saved?.y, -8, 90, 0),
            width: clamp(saved?.width, 108, 196, 146),
            height: clamp(saved?.height, 30, 52, 36),
            autoHide: saved?.autoHide === true,
            reduceMotion: saved?.reduceMotion === true
        };
    };
    let root;
    let expanded = false;
    let chosen = 'music';
    let deliveryNoticeUntil = 0;
    let previousOrders = new Map();
    let latestOrder = null;
    let latestMusic = null;
    let uiMode = 'idle';
    let pressTimer = null;
    let pointerStartX = 0;
    let pointerStartY = 0;
    let pointerActive = false;
    let suppressClickUntil = 0;
    let displayedCover = '';
    let compactCoverKey = '';
    let secondaryKey = '';
    let statusKey = '';
    let marqueeMetricsKey = '';
    let saveTimer = null;
    let storeRefreshAt = 0;
    let observedAudio = null;
    let animationFrameId = 0;
    let morphAnimation = null;
    let waveAnimations = [];
    let waveBars = [];
    let waveActive = false;
    let favoriteTrackId = null;

    function renderMarkup() {
        if (root) return;
        root = document.createElement('div');
        root.id = 'tongtong-dynamic-island';
        root.hidden = true;
        root.innerHTML = `
            <div class="tdi-compact-wrap">
                <button type="button" class="tdi-compact" aria-label="打开当前实时活动">
                    <span class="tdi-compact-cover" aria-hidden="true"></span>
                    <span class="tdi-compact-label-wrap"><span class="tdi-compact-label"></span></span>
                    <span class="tdi-compact-end" aria-hidden="true"><i></i><i></i><i></i><i></i><i></i></span>
                </button>
                <button type="button" class="tdi-secondary" hidden aria-label="切换实时活动"></button>
            </div>
            <section class="tdi-expanded" aria-label="实时活动控制" aria-hidden="true">
                <div class="tdi-info">
                    <span class="tdi-art"></span>
                    <div class="tdi-copy">
                        <div class="tdi-title"></div>
                        <div class="tdi-subtitle"></div>
                    </div>
                    <span class="tdi-status"></span>
                </div>
                <div class="tdi-progress-row">
                    <span class="tdi-time-current" hidden>0:00</span>
                    <div class="tdi-progress" role="progressbar" aria-label="播放进度"><div class="tdi-progress-fill"></div></div>
                    <span class="tdi-time-remaining" hidden>-0:00</span>
                </div>
                <div class="tdi-controls" hidden>
                    <button type="button" class="tdi-star applemusic-star-btn" data-tdi-action="favorite" aria-label="收藏当前歌曲"></button>
                    <button type="button" data-tdi-action="previous" aria-label="上一首">${svg('previous', 23)}</button>
                    <button type="button" class="applemusic-ctrl-playpause tdi-play-button" data-tdi-action="play" aria-label="播放或暂停">${svg('pause', 28)}</button>
                    <button type="button" data-tdi-action="next" aria-label="下一首">${svg('next', 23)}</button>
                    <button type="button" data-tdi-action="airplay" aria-label="一起听歌"></button>
                </div>
                <button type="button" class="tdi-detail" data-tdi-action="open">查看外卖订单</button>
            </section>`;
        document.body.appendChild(root);
        installMusicControlIcons();
        root.querySelector('.tdi-art').addEventListener('click', () => {
            if (expanded && uiMode === 'music') openActivity();
        });
        const compact = root.querySelector('.tdi-compact');
        const activateCompact = () => {
            if (root.hidden || expanded || Date.now() < suppressClickUntil) return;
            suppressClickUntil = Date.now() + 420;
            showExpanded();
        };
        const cancelPress = () => {
            clearTimeout(pressTimer);
            pressTimer = null;
            pointerActive = false;
        };
        compact.addEventListener('pointerdown', e => {
            if (e.button != null && e.button !== 0) return;
            pointerStartX = e.clientX;
            pointerStartY = e.clientY;
            pointerActive = true;
            clearTimeout(pressTimer);
            pressTimer = setTimeout(() => {
                if (!pointerActive) return;
                pointerActive = false;
                activateCompact();
            }, 380);
        });
        compact.addEventListener('pointermove', e => {
            if (Math.hypot(e.clientX - pointerStartX, e.clientY - pointerStartY) > 10) cancelPress();
        });
        compact.addEventListener('pointerup', e => {
            if (!pointerActive) return;
            cancelPress();
            activateCompact();
            if (e.cancelable) e.preventDefault();
        });
        compact.addEventListener('pointercancel', cancelPress);
        let touchStartX = 0;
        let touchStartY = 0;
        compact.addEventListener('touchstart', e => {
            if (!e.touches.length) return;
            touchStartX = e.touches[0].clientX;
            touchStartY = e.touches[0].clientY;
        }, { passive: true });
        compact.addEventListener('touchend', e => {
            const point = e.changedTouches[0];
            if (!point || Math.hypot(point.clientX - touchStartX, point.clientY - touchStartY) > 10) return;
            activateCompact();
            cancelPress();
            if (e.cancelable) e.preventDefault();
        }, { passive: false });
        compact.addEventListener('click', e => {
            e.stopPropagation();
            activateCompact();
        });
        root.querySelector('.tdi-secondary').addEventListener('click', e => {
            e.stopPropagation();
            chosen = chosen === 'music' ? 'food' : 'music';
            refresh(true);
        });
        root.querySelector('.tdi-progress').addEventListener('click', e => {
            if (uiMode !== 'music') return;
            const audio = document.getElementById('applemusic-audio-player');
            const duration = audio?.duration;
            const rect = e.currentTarget.getBoundingClientRect();
            if (!audio || !Number.isFinite(duration) || duration <= 0 || rect.width <= 0) return;
            audio.currentTime = Math.max(0, Math.min(duration, duration * (e.clientX - rect.left) / rect.width));
            refresh();
        });
        let touchStart = 0;
        root.querySelector('.tdi-expanded').addEventListener('pointerdown', e => { touchStart = e.clientY; });
        root.querySelector('.tdi-expanded').addEventListener('pointerup', e => {
            if (touchStart - e.clientY > 35) hideExpanded();
        });
        root.querySelectorAll('[data-tdi-action]').forEach(button => button.addEventListener('click', e => {
            e.stopPropagation();
            const action = button.dataset.tdiAction;
            if (action === 'open') return openActivity();
            if (action === 'favorite' && typeof applemusicToggleStar === 'function') {
                applemusicToggleStar(button);
                return;
            }
            if (action === 'airplay') {
                hideExpanded();
                if (typeof window.openMusicApp === 'function') window.openMusicApp();
                if (typeof applemusicHandleListenTogetherClick === 'function') applemusicHandleListenTogetherClick();
                return;
            }
            if (action === 'play' && typeof applemusicTogglePlayPause === 'function') applemusicTogglePlayPause(button);
            if (action === 'previous' && typeof applemusicPlayPrevSong === 'function') applemusicPlayPrevSong();
            if (action === 'next' && typeof applemusicPlayNextSong === 'function') applemusicPlayNextSong();
            refresh(true);
        }));
        document.addEventListener('pointerdown', e => {
            if (expanded && !root.contains(e.target)) hideExpanded();
        }, true);
    }

    // Animate the actual capsule between measured compact and expanded geometry.
    // This avoids a sudden layout swap when CSS transitions are unavailable.
    function morphIsland(nextExpanded) {
        if (!root || root.hidden || expanded === nextExpanded) return;
        cancelAnimationFrame(animationFrameId);
        const before = root.getBoundingClientRect();
        if (morphAnimation) {
            const previous = morphAnimation;
            morphAnimation = null;
            previous.cancel();
        }

        const reduceMotion = config().reduceMotion;
        const canAnimate = !reduceMotion && typeof root.animate === 'function';
        if (canAnimate) root.style.transition = 'none';
        expanded = nextExpanded;
        refresh();
        if (!canAnimate) return;

        const after = root.getBoundingClientRect();
        if (!before.width || !before.height || !after.width || !after.height) {
            root.style.transition = '';
            return;
        }

        root.style.transformOrigin = 'top left';
        const offsetX = before.left - after.left;
        const offsetY = before.top - after.top;
        const fromScaleX = before.width / after.width;
        const fromScaleY = before.height / after.height;
        const animation = root.animate([
            { transform: 'translate(' + offsetX + 'px,' + offsetY + 'px) scale(' + fromScaleX + ',' + fromScaleY + ')' },
            { transform: 'translate(0px,0px) scale(1,1)' }
        ], {
            duration: nextExpanded ? 470 : 420,
            easing: nextExpanded ? 'cubic-bezier(.2,.82,.24,1)' : 'cubic-bezier(.3,.04,.3,1)',
            fill: 'both'
        });
        morphAnimation = animation;
        const finish = () => {
            if (morphAnimation !== animation) return;
            morphAnimation = null;
            animation.cancel();
            root.style.transition = '';
            root.style.transformOrigin = '';
        };
        animation.addEventListener('finish', finish, { once: true });
        animation.addEventListener('cancel', finish, { once: true });
    }

    function showExpanded() {
        morphIsland(true);
    }
    function hideExpanded() {
        morphIsland(false);
    }

    // Run playback bars through Web Animations, falling back to existing CSS.
    function syncMusicWaveform(playing, reducedMotion) {
        if (!root) return;
        const bars = Array.from(root.querySelectorAll('.tdi-compact-end i, .tdi-player-wave i'));
        const active = !!playing && !reducedMotion && !document.hidden;
        if (waveActive === active && waveBars.length === bars.length
            && bars.every((bar, index) => bar === waveBars[index])) return;

        waveAnimations.forEach(animation => animation.cancel());
        waveAnimations = [];
        waveBars = bars;
        waveActive = active;

        if (!active) {
            bars.forEach(bar => { bar.style.transform = 'scaleY(.35)'; });
            return;
        }

        bars.forEach((bar, index) => {
            if (typeof bar.animate !== 'function') return;
            const timing = [720, 560, 870, 630, 940, 590][index % 6];
            const animation = bar.animate([
                { transform: 'scaleY(.26)' },
                { transform: 'scaleY(.91)' },
                { transform: 'scaleY(.39)' },
                { transform: 'scaleY(1)' },
                { transform: 'scaleY(.31)' }
            ], {
                duration: timing,
                delay: -((index * 137) % timing),
                iterations: Infinity,
                easing: 'ease-in-out'
            });
            waveAnimations.push(animation);
        });
    }

    // Reuse SVG elements from the existing music floating player.
    function installMusicControlIcons() {
        const fromMusic = (action, selector, preserveClasses = []) => {
            const button = root.querySelector('[data-tdi-action="' + action + '"]');
            const source = document.querySelector(selector);
            if (!button || !source) return false;
            const icon = source.cloneNode(true);
            icon.removeAttribute('onclick');
            icon.removeAttribute('style');
            icon.removeAttribute('width');
            icon.removeAttribute('height');
            icon.classList.remove('applemusic-popup-ctrl-star', 'applemusic-popup-ctrl-play', 'applemusic-popup-ctrl-icon');
            icon.classList.add('tdi-icon-svg');
            for (const className of preserveClasses) icon.classList.add(className);
            button.appendChild(icon);
            return true;
        };
        const back = root.querySelector('[data-tdi-action="previous"]');
        const forward = root.querySelector('[data-tdi-action="next"]');
        if (document.querySelector('#applemusic-popup-main-view .applemusic-popup-ctrl-center > svg:first-child')
            && document.querySelector('#applemusic-popup-main-view .applemusic-popup-ctrl-center > svg:last-child')) {
            back.replaceChildren();
            forward.replaceChildren();
            fromMusic('previous', '#applemusic-popup-main-view .applemusic-popup-ctrl-center > svg:first-child');
            fromMusic('next', '#applemusic-popup-main-view .applemusic-popup-ctrl-center > svg:last-child');
        }
        const play = root.querySelector('[data-tdi-action="play"]');
        if (document.querySelector('#applemusic-popup-main-view .applemusic-icon-pause')) {
            play.replaceChildren();
            fromMusic('play', '#applemusic-popup-main-view .applemusic-icon-pause', ['applemusic-icon-pause']);
            fromMusic('play', '#applemusic-popup-main-view .applemusic-icon-play', ['applemusic-icon-play']);
        }
        // Prefer the original filled star, with the MIT-licensed Bootstrap star as fallback.
        if (!fromMusic('favorite', '#applemusic-popup-main-view .applemusic-star-filled', ['applemusic-star-filled'])) {
            root.querySelector('[data-tdi-action="favorite"]').innerHTML = '<svg class="tdi-icon-svg applemusic-star-filled" viewBox="0 0 16 16" fill="currentColor" aria-hidden="true"><path d="M3.612 15.443c-.386.198-.824-.149-.746-.592l.83-4.73-3.523-3.356c-.329-.314-.158-.862.283-.925l4.898-.696L7.538.792c.197-.403.727-.403.924 0l2.184 4.352 4.898.696c.441.063.612.611.283.925l-3.523 3.356.83 4.73c.078.443-.36.79-.746.592L8 13.187l-4.388 2.256z"/></svg>';
        }
        root.querySelector('[data-tdi-action="airplay"]').innerHTML = AIRPLAY_ICON;
    }

    function syncFavoriteAndPlayButtons() {
        const play = root.querySelector('[data-tdi-action="play"]');
        const pauseIcon = play.querySelector('.applemusic-icon-pause');
        const playIcon = play.querySelector('.applemusic-icon-play');
        if (pauseIcon && playIcon) {
            pauseIcon.style.display = latestMusic?.playing ? '' : 'none';
            playIcon.style.display = latestMusic?.playing ? 'none' : '';
        } else if (latestMusic) {
            const state = latestMusic.playing ? 'pause' : 'play';
            if (play.dataset.tdiIcon !== state) {
                play.dataset.tdiIcon = state;
                play.innerHTML = svg(state, 28);
            }
        }
        const favorite = root.querySelector('[data-tdi-action="favorite"]');
        const songId = window.applemusicCurrentPlayingSong?.id;
        if (songId == null) return;
        favoriteTrackId = songId;
        if (typeof musicAppData === 'undefined' || !Array.isArray(musicAppData.favoriteSongs)) return;
        const active = musicAppData.favoriteSongs.some(song => String(song.id) === String(songId));
        favorite.classList.toggle('applemusic-active', active);
        const filled = favorite.querySelector('.applemusic-star-filled');
        if (filled) filled.style.display = '';
    }
    // Follow the real audio element even when it mounts after the island.
    // CSS drives the waveform, while player events control animation state.
    function observeMusicAudio() {
        const audio = document.getElementById('applemusic-audio-player');
        if (!audio || audio === observedAudio) return;
        observedAudio = audio;
        ['play', 'playing', 'pause', 'ended', 'emptied', 'loadedmetadata', 'timeupdate']
            .forEach(name => audio.addEventListener(name, () => refresh()));
    }

    // Keep the actual album artwork stable between progress updates.
    function setArtwork(element, url) {
        const key = url || ':empty';
        if (element.dataset.tdiArtwork === key) return;
        element.dataset.tdiArtwork = key;
        element.classList.toggle('tdi-art-empty', !url);
        element.replaceChildren();
        if (!url) return;
        const image = document.createElement('img');
        image.alt = '';
        image.referrerPolicy = 'no-referrer';
        image.src = url;
        image.addEventListener('error', () => {
            if (element.dataset.tdiArtwork !== key) return;
            element.dataset.tdiArtwork = ':empty';
            element.classList.add('tdi-art-empty');
            image.remove();
        }, { once: true });
        element.appendChild(image);
    }

    function formatTime(seconds) {
        const total = Math.max(0, Math.floor(Number(seconds) || 0));
        return Math.floor(total / 60) + ':' + String(total % 60).padStart(2, '0');
    }

    function readMusic() {
        const audio = document.getElementById('applemusic-audio-player');
        const song = window.applemusicCurrentPlayingSong;
        if (!audio || !song || !audio.currentSrc && !audio.src) return null;
        return {
            title: String(song.name || '正在播放'),
            artist: String(song.artist || '音乐'),
            cover: typeof song.cover === 'string' && /^(https?:|blob:|\/)/.test(song.cover) ? song.cover : '',
            playing: !audio.paused && !audio.ended,
            currentTime: Number.isFinite(audio.currentTime) ? audio.currentTime : 0,
            duration: Number.isFinite(audio.duration) && audio.duration > 0 ? audio.duration : 0,
            progress: Number.isFinite(audio.duration) && audio.duration > 0 ? Math.min(1, audio.currentTime / audio.duration) : 0
        };
    }
    function readTakeout() {
        if (typeof window.storeGetDynamicIslandTakeoutOrders !== 'function') return null;
        const orders = window.storeGetDynamicIslandTakeoutOrders();
        if (!Array.isArray(orders)) return null;
        const now = Date.now();
        const current = new Map();
        let active = null;
        for (const order of orders) {
            current.set(order.id, order.status);
            if (previousOrders.has(order.id) && previousOrders.get(order.id) !== 'unreviewed' && order.status === 'unreviewed') {
                deliveryNoticeUntil = now + 10000;
                active = order;
            }
            if (['undelivered', 'unreceived'].includes(order.status) && (!active || (order.paidAt || 0) > (active.paidAt || 0))) active = order;
        }
        if (!active && deliveryNoticeUntil > now) active = orders.find(item => item.id === latestOrder?.id && item.status === 'unreviewed') || null;
        previousOrders = current;
        return active;
    }
    function position() {
        if (!root) return;
        const c = config();
        const frame = document.querySelector('.iphone');
        const rect = frame ? frame.getBoundingClientRect() : { left: 0, top: 0, width: innerWidth };
        const width = expanded ? Math.min(310, Math.max(250, rect.width - 32)) : c.width + (root.classList.contains('tdi-dual') ? 36 : 0);
        const center = rect.left + rect.width / 2 + c.x;
        const left = clamp(center - width / 2, Math.max(6, rect.left + 6), Math.min(innerWidth - width - 6, rect.left + rect.width - width - 6), 6);
        root.style.left = Math.max(6, left) + 'px';
        root.style.top = Math.max(6, rect.top + 10 + c.y) + 'px';
        root.style.setProperty('--tdi-width', c.width + 'px');
        root.style.setProperty('--tdi-height', c.height + 'px');
        root.style.setProperty('--tdi-open-width', Math.min(322, Math.max(240, rect.width - 24)) + 'px');
        root.style.setProperty('--tdi-open-height', (uiMode === 'music' ? 172 : 146) + 'px');
        root.classList.toggle('tdi-reduced-motion', c.reduceMotion);
    }
    function updateSettingsUI() {
        const c = config();
        const toggle = document.getElementById('tdiEnableToggle');
        const summary = document.getElementById('tdiStatusSummary');
        if (toggle) { toggle.classList.toggle('on', c.enabled); toggle.setAttribute('aria-checked', String(c.enabled)); }
        if (summary) summary.textContent = c.enabled ? '开启' : '关闭';
        for (const [name, value] of Object.entries({ x:c.x, y:c.y, width:c.width, height:c.height })) {
            const input = document.getElementById('tdi-' + name);
            const label = document.getElementById('tdi-' + name + '-value');
            if (input && document.activeElement !== input) input.value = value;
            if (label) label.textContent = value + 'px';
        }
        for (const [name, value] of Object.entries({ autoHide:c.autoHide, reduceMotion:c.reduceMotion })) {
            const input = document.getElementById('tdi-' + name);
            if (input) { input.classList.toggle('on', value); input.setAttribute('aria-checked', String(value)); }
        }
        const preview = document.getElementById('tdiSettingsPreview');
        if (preview) {
            const pill = preview.querySelector('.tdi-preview-pill');
            if (pill) {
                pill.style.width = Math.min(180, c.width) + 'px';
                pill.style.height = c.height + 'px';
                pill.style.transform = 'translateX(calc(-50% + ' + c.x * .55 + 'px)) translateY(' + (c.y * .5) + 'px)';
                pill.style.opacity = c.enabled ? '1' : '.36';
                if (!pill.querySelector('.tdi-preview-title')) {
                    pill.innerHTML = '<span class="tdi-preview-vinyl" aria-hidden="true"></span><span class="tdi-preview-bars" aria-hidden="true"><i></i><i></i><i></i><i></i><i></i></span>';
                }
                pill.classList.toggle('tdi-preview-playing', !!latestMusic?.playing && !c.reduceMotion);
            }
        }
    }
    function syncLegacyMusicBar(enabled) {
        const oldBar = document.getElementById('applemusic-dynamic-island');
        if (oldBar) oldBar.style.visibility = enabled ? 'hidden' : '';
        if (enabled) {
            document.getElementById('applemusic-island-popup-overlay')?.classList.remove('active');
        }
    }
    function refresh(force = false) {
        if (!root) return;
        // Other app startup work may rebuild the body after the island was mounted.
        if (root.isConnected === false && document.body) document.body.appendChild(root);
        if (typeof appSettingsLoaded === 'undefined' || !appSettingsLoaded) return;
        const c = config();
        syncLegacyMusicBar(c.enabled);
        if (!c.enabled) {
            syncMusicWaveform(false, c.reduceMotion);
            updateSettingsUI();
            root.hidden = true;
            expanded = false;
            return;
        }
        observeMusicAudio();
        latestMusic = readMusic();
        if (Date.now() - storeRefreshAt > 3000 || force) {
            storeRefreshAt = Date.now();
            latestOrder = readTakeout();
        }
        updateSettingsUI();
        const hasMusic = !!latestMusic;
        const hasFood = !!latestOrder;
        const activity = chosen === 'food' && hasFood ? 'food' : hasMusic ? 'music' : hasFood ? 'food' : 'idle';
        uiMode = activity;
        root.classList.toggle('tdi-dual', hasMusic && hasFood && !expanded);
        if (c.autoHide && activity === 'idle') {
            syncMusicWaveform(false, c.reduceMotion);
            root.hidden = true;
            expanded = false;
            return;
        }
        root.hidden = false;
        root.classList.toggle('tdi-open', expanded);
        const compact = root.querySelector('.tdi-compact');
        const second = root.querySelector('.tdi-secondary');
        const panel = root.querySelector('.tdi-expanded');
        compact.setAttribute('aria-hidden', String(expanded));
        panel.setAttribute('aria-hidden', String(!expanded));
        second.hidden = !(hasMusic && hasFood && !expanded);
        const label = activity === 'music' ? latestMusic.title
            : activity === 'food' ? (latestOrder.status === 'unreviewed' ? '已送达' : latestOrder.status === 'undelivered' ? '正在取餐' : '配送中')
            : '';
        compact.setAttribute('aria-label', activity === 'music' ? '展开音乐播放器：' + latestMusic.title : activity === 'food' ? '展开外卖配送详情' : '展开实时活动');
        compact.setAttribute('aria-expanded', String(expanded));
        const labelElement = root.querySelector('.tdi-compact-label');
        if (labelElement.textContent !== label) labelElement.textContent = label;
        const cover = root.querySelector('.tdi-compact-cover');
        cover.hidden = activity !== 'music';
        const compactKey = activity === 'music' ? latestMusic.cover || ':empty' : ':none';
        if (compactCoverKey !== compactKey) {
            compactCoverKey = compactKey;
            if (activity === 'music') setArtwork(cover, latestMusic.cover);
        }
        const wave = root.querySelector('.tdi-compact-end');
        wave.hidden = activity !== 'music';
        const playing = activity === 'music' && latestMusic.playing;
        root.classList.toggle('tdi-playing', playing);
        const nextSecondaryKey = hasMusic && hasFood ? (activity === 'music' ? ':food' : latestMusic.cover || ':music') : ':none';
        if (secondaryKey !== nextSecondaryKey) {
            secondaryKey = nextSecondaryKey;
            if (activity === 'music') {
                second.innerHTML = svg('truck', 15);
            } else if (activity === 'food') {
                second.replaceChildren();
                const thumb = document.createElement('span');
                thumb.className = 'tdi-secondary-art';
                second.appendChild(thumb);
                setArtwork(thumb, latestMusic.cover);
            }
        }
        second.setAttribute('aria-label', activity === 'music' ? '查看外卖配送' : '查看当前歌曲');
        const art = root.querySelector('.tdi-art');
        const coverKey = activity === 'music' ? latestMusic.cover || ':empty' : ':food';
        if (displayedCover !== coverKey) {
            displayedCover = coverKey;
            if (activity === 'music') setArtwork(art, latestMusic.cover);
            else {
                art.classList.remove('tdi-art-empty');
                delete art.dataset.tdiArtwork;
                art.replaceChildren();
                if (activity === 'food') art.innerHTML = svg('truck', 22);
            }
        }
        const title = activity === 'music' ? latestMusic.title : activity === 'food' ? latestOrder.store || '外卖订单' : '暂无实时活动';
        const remaining = activity === 'food' && latestOrder.timeConfig?.totalMinutes && latestOrder.paidAt
            ? Math.max(0, Math.ceil(latestOrder.timeConfig.totalMinutes - (Date.now() - latestOrder.paidAt) / 60000))
            : null;
        const subtitle = activity === 'music' ? latestMusic.artist
            : activity === 'food' ? label + (latestOrder.status !== 'unreviewed' && remaining !== null ? ' · 预计' + remaining + '分钟' : '')
            : '播放音乐或点外卖后显示';
        root.querySelector('.tdi-title').textContent = title;
        root.querySelector('.tdi-subtitle').textContent = subtitle;
        if (statusKey !== activity) {
            statusKey = activity;
            root.querySelector('.tdi-status').innerHTML = activity === 'music'
                ? '<span class="tdi-player-wave" aria-hidden="true"><i></i><i></i><i></i><i></i><i></i><i></i></span>'
                : activity === 'food' ? svg('truck', 18) : '';
        }
        const musicProgress = activity === 'music';
        root.querySelector('.tdi-progress-row').classList.toggle('tdi-music-progress', musicProgress);
        root.querySelector('.tdi-time-current').hidden = !musicProgress;
        root.querySelector('.tdi-time-remaining').hidden = !musicProgress;
        if (activity === 'music') {
            root.querySelector('.tdi-time-current').textContent = formatTime(latestMusic.currentTime);
            root.querySelector('.tdi-time-remaining').textContent = '-' + formatTime(Math.max(0, latestMusic.duration - latestMusic.currentTime));
        }
        const progressTrack = root.querySelector('.tdi-progress');
        progressTrack.classList.toggle('tdi-seekable', activity === 'music' && latestMusic.duration > 0);
        const controls = root.querySelector('.tdi-controls');
        controls.hidden = activity !== 'music';
        if (activity === 'music') syncFavoriteAndPlayButtons();
        const detail = root.querySelector('.tdi-detail');
        detail.hidden = activity !== 'food';
        if (activity === 'food') detail.textContent = '查看外卖订单';
        const progress = activity === 'music' ? latestMusic.progress : activity === 'food' ? latestOrder.status === 'unreviewed' ? 1 : latestOrder.status === 'unreceived' ? .7 : .3 : 0;
        root.querySelector('.tdi-progress-fill').style.width = Math.round(progress * 100) + '%';
        position();
        // The compact music island intentionally displays album art and waveform only.
        const labelWrap = root.querySelector('.tdi-compact-label-wrap');
        labelWrap.hidden = activity === 'music' || activity === 'idle';
        syncMusicWaveform(playing, c.reduceMotion);
    }
    async function openActivity() {
        hideExpanded();
        if (uiMode === 'food' && latestOrder && typeof window.openStoreApp === 'function') {
            await window.openStoreApp();
            if (typeof window.storeOpenOrderSubpage === 'function') window.storeOpenOrderSubpage('all');
            if (typeof window.storeOpenOrderDetailSubpage === 'function') window.storeOpenOrderDetailSubpage(latestOrder.id);
        } else if (uiMode === 'music' && typeof window.openMusicApp === 'function') {
            window.openMusicApp();
        }
    }
    function change(key, value) {
        if (typeof appSettings === 'undefined' || !appSettingsLoaded) return;
        const c = config();
        if (!(key in defaults)) return;
        if (typeof defaults[key] === 'boolean') c[key] = value === true;
        else c[key] = clamp(value, key === 'x' ? -90 : key === 'y' ? -8 : key === 'width' ? 108 : 30, key === 'x' || key === 'y' ? 90 : key === 'width' ? 196 : 52, defaults[key]);
        appSettings.dynamic_island = c;
        clearTimeout(saveTimer);
        if (['x', 'y', 'width', 'height'].includes(key)) {
            saveTimer = setTimeout(() => { if (typeof saveAppSettings === 'function') saveAppSettings(); }, 240);
        } else if (typeof saveAppSettings === 'function') saveAppSettings();
        refresh(true);
    }
    function reset() {
        if (typeof appSettings === 'undefined' || !appSettingsLoaded) return;
        const current = config();
        clearTimeout(saveTimer);
        appSettings.dynamic_island = { ...current, x:0, y:0, width:defaults.width, height:defaults.height };
        if (typeof saveAppSettings === 'function') saveAppSettings();
        refresh(true);
    }
    window.tongtongDynamicIsland = { refresh, change, reset, open: showExpanded, close: hideExpanded };
    window.tdiChange = change;
    window.tdiToggle = () => change('enabled', !config().enabled);
    window.tdiReset = reset;

    function start() {
        renderMarkup();
        // The database hydrates settings asynchronously; restore the island immediately
        // instead of waiting for a visit to Accessibility settings.
        window.addEventListener('tonghuaji:app-settings-ready', () => refresh(true));
        refresh(true);
        const wait = setInterval(() => {
            if (typeof appSettingsLoaded !== 'undefined' && appSettingsLoaded) { clearInterval(wait); refresh(true); }
        }, 250);
        setTimeout(() => clearInterval(wait), 16000);
        observeMusicAudio();
        window.addEventListener('tonghuaji:store-orders-changed', () => refresh(true));
        window.addEventListener('resize', () => position());
        window.addEventListener('pageshow', () => refresh(true));
        document.addEventListener('visibilitychange', () => refresh(true));
        setInterval(() => { if (!document.hidden) refresh(); }, 3500);
    }
    if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', start, { once: true });
    else start();
})();
