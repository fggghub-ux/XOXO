(() => {
    if (document.getElementById('musicAppUI')) return;
    const html = `<div class="applemusic-app-container" id="musicAppUI" aria-hidden="true" style="display: none; position: fixed; inset: 0; z-index: 1800; background-color: #ffffff; overflow-x: hidden; overflow-y: auto;">

        <!-- ================= HOME 页面 ================= -->
        <div id="applemusic-view-home" class="applemusic-view-container applemusic-active">
            <header class="applemusic-header">
                <h1 onclick="closeMusicApp()" style="cursor: pointer;">Home</h1>
                <div class="applemusic-profile-pic" onclick="applemusicSwitchView('settings')">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M11.9667 1.75195C9.81618 1.76239 7.72323 2.4468 5.98323 3.70856C4.24323 4.97032 2.94402 6.74571 2.26894 8.78424C1.59387 10.8228 1.57703 13.0215 2.22077 15.0701C2.86452 17.1187 4.13635 18.9138 5.85681 20.202C5.90685 20.2507 5.96434 20.2912 6.02709 20.322C7.7668 21.5741 9.85708 22.248 12.0017 22.248C14.1464 22.248 16.2367 21.5741 17.9764 20.322C18.0421 20.2869 18.1027 20.2432 18.1567 20.192C19.877 18.8994 21.1468 17.0996 21.7865 15.0471C22.4261 12.9945 22.4032 10.7931 21.721 8.7543C21.0389 6.71546 19.7319 4.94233 17.985 3.68573C16.2382 2.42913 14.1398 1.75265 11.9867 1.75195H11.9667ZM11.9667 5.51196C12.7921 5.50205 13.6018 5.73775 14.2926 6.18903C14.9834 6.6403 15.5239 7.28669 15.8454 8.04584C16.1668 8.80498 16.2545 9.64249 16.0974 10.4516C15.9403 11.2607 15.5454 12.0048 14.963 12.589C14.3807 13.1732 13.6374 13.5711 12.8277 13.7319C12.0181 13.8927 11.1788 13.8092 10.4169 13.492C9.65495 13.1748 9.00487 12.6383 8.54951 11.9508C8.09415 11.2634 7.85414 10.4561 7.86004 9.63196C7.86783 8.54512 8.30238 7.50471 9.07028 6.73431C9.83818 5.96392 10.8781 5.52503 11.9667 5.51196ZM16.5942 19.4319C15.2071 20.2944 13.6058 20.7515 11.9717 20.7515C10.3376 20.7515 8.73627 20.2944 7.34921 19.4319C6.918 19.1703 6.51226 18.869 6.13726 18.532C6.70519 17.7242 7.43513 17.0431 8.28074 16.532C9.39741 15.869 10.6725 15.5191 11.9717 15.5191C13.2709 15.5191 14.546 15.869 15.6627 16.532C16.5083 17.0431 17.2382 17.7242 17.8061 18.532C17.4311 18.869 17.0254 19.1703 16.5942 19.4319Z" fill="currentColor"/>
                    </svg>
                </div>
            </header>

            <section class="applemusic-section">
                <h2 class="applemusic-section-title">专属精选推荐</h2>
                <div class="applemusic-scroll-container" id="applemusic-home-featured-container">
                    <div class="applemusic-featured-card">
                        <div class="applemusic-card-text-bottom">
                            <div class="applemusic-card-subtitle">Keni Titus 参与的作品</div>
                            <div class="applemusic-card-title">Keni Titus 与类似艺人</div>
                        </div>
                    </div>
                    <div class="applemusic-featured-card" style="background: linear-gradient(180deg, #4b3b8c 0%, #2a1b5c 100%);">
                        <div class="applemusic-card-text-bottom">
                            <div class="applemusic-card-subtitle">专属推荐</div>
                            <div class="applemusic-card-title">探索更多音乐</div>
                        </div>
                    </div>
                </div>
            </section>

            <section class="applemusic-section">
                <h2 class="applemusic-section-title">
                    最近播放
                    <svg viewBox="0 0 24 24" style="width: 18px; height: 18px; fill: #8e8e93; margin-left: 4px;"><path d="M8.59 16.59L13.17 12 8.59 7.41 10 6l6 6-6 6-1.41-1.41z"/></svg>
                </h2>
                <div class="applemusic-scroll-container applemusic-song-list" id="applemusic-recent-play-list">
                    <!-- 动态渲染最近播放 -->
                </div>
            </section>
        </div>

        <!-- ================= LIBRARY 页面 ================= -->
        <div id="applemusic-view-library" class="applemusic-view-container">
            <header class="applemusic-header">
                <h1 onclick="closeMusicApp()" style="cursor: pointer;">Library</h1>
                <div class="applemusic-header-actions">
                    <div class="applemusic-glass-btn applemusic-circle" onclick="applemusicOpenLibraryMenu(event)">
                        <svg viewBox="0 0 24 24"><path d="M6 10c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm12 0c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm-6 0c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z"/></svg>
                    </div>
                    <div class="applemusic-profile-pic" onclick="applemusicSwitchView('settings')">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M11.9667 1.75195C9.81618 1.76239 7.72323 2.4468 5.98323 3.70856C4.24323 4.97032 2.94402 6.74571 2.26894 8.78424C1.59387 10.8228 1.57703 13.0215 2.22077 15.0701C2.86452 17.1187 4.13635 18.9138 5.85681 20.202C5.90685 20.2507 5.96434 20.2912 6.02709 20.322C7.7668 21.5741 9.85708 22.248 12.0017 22.248C14.1464 22.248 16.2367 21.5741 17.9764 20.322C18.0421 20.2869 18.1027 20.2432 18.1567 20.192C19.877 18.8994 21.1468 17.0996 21.7865 15.0471C22.4261 12.9945 22.4032 10.7931 21.721 8.7543C21.0389 6.71546 19.7319 4.94233 17.985 3.68573C16.2382 2.42913 14.1398 1.75265 11.9867 1.75195H11.9667ZM11.9667 5.51196C12.7921 5.50205 13.6018 5.73775 14.2926 6.18903C14.9834 6.6403 15.5239 7.28669 15.8454 8.04584C16.1668 8.80498 16.2545 9.64249 16.0974 10.4516C15.9403 11.2607 15.5454 12.0048 14.963 12.589C14.3807 13.1732 13.6374 13.5711 12.8277 13.7319C12.0181 13.8927 11.1788 13.8092 10.4169 13.492C9.65495 13.1748 9.00487 12.6383 8.54951 11.9508C8.09415 11.2634 7.85414 10.4561 7.86004 9.63196C7.86783 8.54512 8.30238 7.50471 9.07028 6.73431C9.83818 5.96392 10.8781 5.52503 11.9667 5.51196ZM16.5942 19.4319C15.2071 20.2944 13.6058 20.7515 11.9717 20.7515C10.3376 20.7515 8.73627 20.2944 7.34921 19.4319C6.918 19.1703 6.51226 18.869 6.13726 18.532C6.70519 17.7242 7.43513 17.0431 8.28074 16.532C9.39741 15.869 10.6725 15.5191 11.9717 15.5191C13.2709 15.5191 14.546 15.869 15.6627 16.532C16.5083 17.0431 17.2382 17.7242 17.8061 18.532C17.4311 18.869 17.0254 19.1703 16.5942 19.4319Z" fill="currentColor"/>
                        </svg>
                    </div>
                </div>
            </header>

            <!-- 置顶区域 -->
            <div id="applemusic-pinned-container" class="applemusic-pinned-container"></div>

            <!-- 列表分类 -->
            <div class="applemusic-lib-list">
                <div class="applemusic-lib-list-item" onclick="applemusicSwitchView('playlists')">
                    <svg class="applemusic-lib-list-icon" viewBox="0 0 16 16" fill="currentColor">
                        <path d="M12 13c0 1.105 -1.12 2 -2.5 2S7 14.105 7 13s1.12 -2 2.5 -2 2.5 0.895 2.5 2" stroke-width="1"></path>
                        <path fill-rule="evenodd" d="M12 3v10h-1V3z" stroke-width="1"></path>
                        <path d="M11 2.82a1 1 0 0 1 0.804 -0.98l3 -0.6A1 1 0 0 1 16 2.22V4l-5 1z" stroke-width="1"></path>
                        <path fill-rule="evenodd" d="M0 11.5a0.5 0.5 0 0 1 0.5 -0.5H4a0.5 0.5 0 0 1 0 1H0.5a0.5 0.5 0 0 1 -0.5 -0.5m0 -4A0.5 0.5 0 0 1 0.5 7H8a0.5 0.5 0 0 1 0 1H0.5a0.5 0.5 0 0 1 -0.5 -0.5m0 -4A0.5 0.5 0 0 1 0.5 3H8a0.5 0.5 0 0 1 0 1H0.5a0.5 0.5 0 0 1 -0.5 -0.5" stroke-width="1"></path>
                    </svg>
                    <div class="applemusic-lib-list-text">播放列表</div>
                    <svg class="applemusic-lib-list-chevron" viewBox="0 0 24 24"><path d="M8.59 16.59L13.17 12 8.59 7.41 10 6l6 6-6 6-1.41-1.41z"/></svg>
                </div>
                <div class="applemusic-lib-list-item" onclick="applemusicOpenFavoriteArtists()">
                    <svg class="applemusic-lib-list-icon" viewBox="-4 -4 32 32" fill="currentColor">
                        <rect x="-2" y="-2" width="28" height="28" rx="6" fill="none" stroke="var(--theme-active)" stroke-width="2"/>
                        <path fill-rule="evenodd" d="M7.5 6a4.5 4.5 0 1 1 9 0 4.5 4.5 0 0 1-9 0ZM3.751 20.105a8.25 8.25 0 0 1 16.498 0 .75.75 0 0 1-.437.695A18.683 18.683 0 0 1 12 22.5c-2.786 0-5.433-.608-7.812-1.7a.75.75 0 0 1-.437-.695Z" clip-rule="evenodd" />
                    </svg>
                    <div class="applemusic-lib-list-text">艺人</div>
                    <svg class="applemusic-lib-list-chevron" viewBox="0 0 24 24"><path d="M8.59 16.59L13.17 12 8.59 7.41 10 6l6 6-6 6-1.41-1.41z"/></svg>
                </div>
                <div class="applemusic-lib-list-item" onclick="applemusicOpenAllSongs()">
                    <svg class="applemusic-lib-list-icon" viewBox="0 0 16 16" fill="currentColor">
                        <path d="M9 13c0 1.105 -1.12 2 -2.5 2S4 14.105 4 13s1.12 -2 2.5 -2 2.5 0.895 2.5 2" stroke-width="1"></path>
                        <path fill-rule="evenodd" d="M9 3v10H8V3z" stroke-width="1"></path>
                        <path d="M8 2.82a1 1 0 0 1 0.804 -0.98l3 -0.6A1 1 0 0 1 13 2.22V4L8 5z" stroke-width="1"></path>
                    </svg>
                    <div class="applemusic-lib-list-text">歌曲</div>
                    <svg class="applemusic-lib-list-chevron" viewBox="0 0 24 24"><path d="M8.59 16.59L13.17 12 8.59 7.41 10 6l6 6-6 6-1.41-1.41z"/></svg>
                </div>
                <div class="applemusic-lib-list-item" onclick="applemusicOpenLocalSongsView()">
                    <svg class="applemusic-lib-list-icon" viewBox="0 0 16 16" fill="currentColor">
                        <path d="M8 0.16c-6.0352375 0 -9.80725625 6.53333125 -6.7896375 11.76 3.0176125 5.22666875 10.56165625 5.22666875 13.579275 0C15.47774375 10.72816875 15.84 9.37620625 15.84 8 15.83543125 3.67198125 12.32801875 0.164575 8 0.16Zm0 14.47384375c-5.1067375 0.00023125 -8.2984 -5.52783125 -5.745225 -9.9505125 2.55316875 -4.422675 8.9365875 -4.4229625 11.49015625 -0.0005125 0.5823375 1.00853125 0.8889125 2.1526 0.8889125 3.31718125 -0.00415 3.66205 -2.97179375 6.6296875 -6.63384375 6.63384375Zm2.83898125 -6.45744375c0.2358375 0.23556875 0.2358375 0.61778125 0 0.85335625l-2.41230625 2.41230625c-0.23556875 0.23583125 -0.61778125 0.23583125 -0.85335 0l-2.4123125 -2.41230625c-0.32845 -0.32845625 -0.178175 -0.88930625 0.27050625 -1.00953125 0.20823125 -0.05579375 0.4304125 0.0037375 0.58285 0.156175l1.38255625 1.38330625V4.9846125c0 -0.46424375 0.5025625 -0.7544 0.9046125 -0.522275 0.18659375 0.107725 0.3015375 0.30681875 0.3015375 0.522275v4.57509375l1.38255625 -1.38330625c0.23556875 -0.23583125 0.61778125 -0.23583125 0.85335 0Z" stroke-width="0.0625"></path>
                    </svg>
                    <div class="applemusic-lib-list-text">已导入</div>
                    <svg class="applemusic-lib-list-chevron" viewBox="0 0 24 24"><path d="M8.59 16.59L13.17 12 8.59 7.41 10 6l6 6-6 6-1.41-1.41z"/></svg>
                </div>
            </div>
        </div>

        <!-- ================= PLAYLISTS 播放列表页面 ================= -->
        <div id="applemusic-view-playlists" class="applemusic-view-container">
            <div class="applemusic-playlist-header-top">
                <!-- 白色半透明磨砂返回按钮 -->
                <div class="applemusic-glass-btn applemusic-circle" onclick="applemusicSwitchView('library')">
                    <svg viewBox="0 0 24 24"><path d="M15.41 16.59L10.83 12l4.58-4.59L14 6l-6 6 6 6 1.41-1.41z"/></svg>
                </div>
                <!-- 白色半透明磨砂操作胶囊 -->
                <div class="applemusic-glass-btn applemusic-pill">
                    <!-- 加号：点击打开创建歌单弹窗 -->
                    <svg viewBox="0 0 24 24" onclick="applemusicOpenCreatePlaylistModal()" style="cursor: pointer;"><path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"/></svg>
                    <!-- 列表/网格切换按钮 -->
                    <svg viewBox="0 0 24 24" onclick="applemusicTogglePlaylistLayout()" style="cursor: pointer;"><path d="M3 18h6v-2H3v2zM3 6v2h18V6H3zm0 7h12v-2H3v2z"/></svg>
                    <svg viewBox="0 0 24 24" onclick="applemusicOpenPlaylistsViewMenu(event)" style="cursor: pointer;"><path d="M6 10c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm12 0c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm-6 0c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z"/></svg>
                </div>
            </div>

            <h1 class="applemusic-playlist-title">播放列表</h1>

            <div class="applemusic-pl-list" id="applemusic-my-playlists-container">
                <!-- 心动歌曲 -->
                <div class="applemusic-pl-item" onclick="alert('心动歌曲：共 ' + (window.applemusicFavoriteSongsCount || 0) + ' 首')">
                    <!-- 带有微小圆角的五角星 SVG -->
                    <svg class="applemusic-tiny-star" viewBox="0 0 24 24" fill="currentColor"><path d="M11.1 2.41c.31-.8 1.49-.8 1.8 0l2.2 5.67a1 1 0 00.83.6l6.05.46c.85.06 1.2 1.12.55 1.68l-4.64 3.97a1 1 0 00-.32 1l1.38 5.9c.2.85-.68 1.49-1.4 1.05l-5.18-3.15a1 1 0 00-1.04 0l-5.18 3.15c-.72.44-1.6-.2-1.4-1.05l1.38-5.9a1 1 0 00-.32-1L1.17 10.82c-.65-.56-.3-1.62.55-1.68l6.05-.46a1 1 0 00.83-.6l2.2-5.67z"/></svg>
                    <div class="applemusic-pl-cover">
                        <svg viewBox="0 0 24 24" fill="currentColor"><path d="M11.1 2.41c.31-.8 1.49-.8 1.8 0l2.2 5.67a1 1 0 00.83.6l6.05.46c.85.06 1.2 1.12.55 1.68l-4.64 3.97a1 1 0 00-.32 1l1.38 5.9c.2.85-.68 1.49-1.4 1.05l-5.18-3.15a1 1 0 00-1.04 0l-5.18 3.15c-.72.44-1.6-.2-1.4-1.05l1.38-5.9a1 1 0 00-.32-1L1.17 10.82c-.65-.56-.3-1.62.55-1.68l6.05-.46a1 1 0 00.83-.6l2.2-5.67z"/></svg>
                    </div>
                    <div class="applemusic-pl-info">心动歌曲</div>
                    <svg class="applemusic-lib-list-chevron" viewBox="0 0 24 24"><path d="M8.59 16.59L13.17 12 8.59 7.41 10 6l6 6-6 6-1.41-1.41z"/></svg>
                </div>
                <!-- 动态渲染的自定义歌单将放在这里 -->
            </div>
        </div>

        <!-- ================= 全部歌曲页面 ================= -->
        <div id="applemusic-view-all-songs" class="applemusic-view-container">
            <div class="applemusic-playlist-header-top">
                <div class="applemusic-glass-btn applemusic-circle" onclick="applemusicSwitchView('library')">
                    <svg viewBox="0 0 24 24"><path d="M15.41 16.59L10.83 12l4.58-4.59L14 6l-6 6 6 6 1.41-1.41z"/></svg>
                </div>
            </div>

            <h1 class="applemusic-playlist-title">歌曲</h1>

            <div class="applemusic-search-bar-container">
                <div class="applemusic-search-bar">
                    <svg class="applemusic-search-icon" viewBox="0 0 24 24"><path d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"/></svg>
                    <input type="text" id="applemusic-all-songs-search-input" placeholder="在歌曲中搜索" oninput="applemusicFilterAllSongs()">
                </div>
            </div>

            <div class="applemusic-playlist-detail-songs" id="applemusic-all-songs-list" style="padding-bottom: 120px;">
                <!-- 动态渲染全部歌曲 -->
            </div>
        </div>

        <!-- ================= 已导入歌曲页面 ================= -->
        <div id="applemusic-view-local-songs" class="applemusic-view-container">
            <div class="applemusic-playlist-header-top">
                <div class="applemusic-glass-btn applemusic-circle" onclick="applemusicSwitchView('library')">
                    <svg viewBox="0 0 24 24"><path d="M15.41 16.59L10.83 12l4.58-4.59L14 6l-6 6 6 6 1.41-1.41z"/></svg>
                </div>
            </div>

            <h1 class="applemusic-playlist-title">已导入</h1>

            <div class="applemusic-playlist-detail-songs" id="applemusic-local-songs-list" style="padding-bottom: 120px;">
                <!-- 动态渲染已导入歌曲 -->
            </div>
        </div>

        <!-- ================= 收藏艺人页面 ================= -->
        <div id="applemusic-view-favorite-artists" class="applemusic-view-container">
            <div class="applemusic-playlist-header-top">
                <div class="applemusic-glass-btn applemusic-circle" onclick="applemusicSwitchView('library')">
                    <svg viewBox="0 0 24 24"><path d="M15.41 16.59L10.83 12l4.58-4.59L14 6l-6 6 6 6 1.41-1.41z"/></svg>
                </div>
            </div>

            <h1 class="applemusic-playlist-title">艺人</h1>

            <div class="applemusic-playlist-detail-songs" id="applemusic-fav-artists-list" style="padding-bottom: 120px;">
                <!-- 动态渲染收藏艺人 -->
            </div>
        </div>

        <!-- ================= 歌单详情页面 ================= -->
        <div id="applemusic-view-playlist-detail" class="applemusic-view-container">

            <!-- 左上角固定按钮 (复用歌手主页质感) -->
            <div class="applemusic-nav-btn-fixed applemusic-left applemusic-circle" onclick="applemusicSwitchView('playlists')">
                <svg viewBox="0 0 24 24"><path d="M15.41 16.59L10.83 12l4.58-4.59L14 6l-6 6 6 6 1.41-1.41z"/></svg>
            </div>

            <!-- 右上角固定按钮 (复用歌手主页质感) -->
            <div class="applemusic-nav-btn-fixed applemusic-right applemusic-circle" onclick="applemusicOpenPlaylistMoreMenu(event)">
                <svg viewBox="0 0 24 24"><path d="M6 10c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm12 0c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm-6 0c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z"/></svg>
            </div>

            <div class="applemusic-playlist-detail-cover-area">
                <div id="applemusic-detail-playlist-cover-wrapper" class="applemusic-playlist-detail-cover" style="display: flex; align-items: center; justify-content: center; overflow: hidden;">
                    <!-- 动态插入 img 或 svg -->
                </div>
                <div class="applemusic-playlist-detail-meta">
                    <svg viewBox="0 0 24 24"><path d="M12 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h4V3h-6z"/></svg>
                    <span id="applemusic-playlist-update-time">1分钟前更新</span>
                </div>
            </div>

            <div class="applemusic-playlist-detail-controls">
                <div class="applemusic-playlist-detail-btn" onclick="applemusicPlayPlaylist(false)">
                    <!-- 使用内部已有的实心播放 SVG -->
                    <svg viewBox="0 0 24 24" fill="currentColor"><path d="M6.51 18.87c.15.09.32.13.49.13s.36-.05.51-.14l10-6c.3-.18.49-.51.49-.86s-.18-.68-.49-.86l-10-6a.99.99 0 0 0-1.01-.01c-.31.18-.51.51-.51.87v12c0 .36.19.69.51.87Z"></path></svg>
                    播放
                </div>
                <div class="applemusic-playlist-detail-btn" onclick="applemusicPlayPlaylist(true)">
                    <!-- 使用内部已有的随机播放 SVG -->
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" height="20" width="20">
                        <g fill="none" fill-rule="nonzero">
                            <path d="M0 0v16h16V0H0Zm7.604666666666667 15.505333333333333 0.007333333333333332 0.0013333333333333333 0.047333333333333324 0.023333333333333334 0.013333333333333332 0.0026666666666666666 0.009333333333333332 -0.0026666666666666666 0.047333333333333324 -0.023999999999999997c0.006666666666666666 -0.002 0.012666666666666666 0 0.016 0.004l0.0026666666666666666 0.006666666666666666 0.011333333333333334 0.2853333333333333 -0.003333333333333333 0.013333333333333332 -0.006666666666666666 0.008666666666666666 -0.06933333333333333 0.049333333333333326 -0.009999999999999998 0.0026666666666666666 -0.008 -0.0026666666666666666 -0.06933333333333333 -0.049333333333333326 -0.008 -0.010666666666666666 -0.0026666666666666666 -0.011333333333333334 0.011333333333333334 -0.2846666666666666c0.0013333333333333333 -0.006666666666666666 0.005999999999999999 -0.011333333333333334 0.010666666666666666 -0.011999999999999999Zm-0.17666666666666667 -0.07533333333333334 0.009333333333333332 0.0013333333333333333 0.12266666666666666 0.062 0.006666666666666666 0.006666666666666666 0.002 0.007333333333333332 -0.011999999999999999 0.2866666666666666 -0.003333333333333333 0.008 -0.005333333333333333 0.005333333333333333 -0.134 0.06133333333333333c-0.008 0.0026666666666666666 -0.015333333333333332 0 -0.019333333333333334 -0.005333333333333333l-0.0026666666666666666 -0.009333333333333332 0.02266666666666667 -0.4093333333333333c0.002 -0.008 0.006666666666666666 -0.013333333333333332 0.013333333333333332 -0.014666666666666665Zm0.4766666666666666 0.0013333333333333333a0.015333333333333332 0.015333333333333332 0 0 1 0.018 0.004l0.004 0.009333333333333332 0.02266666666666667 0.4093333333333333c0 0.008 -0.004666666666666666 0.013333333333333332 -0.011333333333333334 0.016l-0.009999999999999998 -0.0013333333333333333 -0.134 -0.062 -0.006666666666666666 -0.005333333333333333 -0.002 -0.007333333333333332 -0.011999999999999999 -0.2866666666666666 0.002 -0.008 0.006666666666666666 -0.006666666666666666 0.12266666666666666 -0.06133333333333333Z" stroke-width="0.6667"></path>
                            <path fill="currentColor" d="M11.867999999999999 2.122c-0.38799999999999996 -0.2033333333333333 -0.8493333333333333 0.09733333333333333 -0.8866666666666667 0.5766666666666667 -0.007333333333333332 0.08933333333333333 -0.014666666666666665 0.18999999999999997 -0.021333333333333333 0.30133333333333334a3.6666666666666665 3.6666666666666665 0 0 0 -3.2579999999999996 2.0266666666666664L7.333333333333333 5.764l-0.3686666666666667 -0.7373333333333334a3.6666666666666665 3.6666666666666665 0 0 0 -3.28 -2.0266666666666664H2.6666666666666665a1 1 0 1 0 0 2h1.0186666666666666a1.6666666666666665 1.6666666666666665 0 0 1 1.4906666666666668 0.9213333333333332L6.215333333333334 8l-1.04 2.0786666666666664A1.6666666666666665 1.6666666666666665 0 0 1 3.686 11H2.6666666666666665a1 1 0 1 0 0 2h1.0186666666666666a3.6666666666666665 3.6666666666666665 0 0 0 3.28 -2.0266666666666664L7.333333333333333 10.235999999999999l0.3686666666666667 0.7373333333333334a3.6666666666666665 3.6666666666666665 0 0 0 3.2566666666666664 2.0266666666666664c0.008 0.14266666666666666 0.016666666666666666 0.26866666666666666 0.026 0.3766666666666666 0.036 0.44733333333333336 0.456 0.704 0.84 0.5033333333333333 0.2533333333333333 -0.132 0.622 -0.3373333333333333 1.0606666666666666 -0.6226666666666667 0.44 -0.2853333333333333 0.782 -0.5406666666666666 1.0099999999999998 -0.722 0.3466666666666667 -0.27399999999999997 0.35933333333333334 -0.8106666666666666 0.03333333333333333 -1.0706666666666667a13.174 13.174 0 0 0 -1.0219999999999998 -0.7333333333333334 12.894 12.894 0 0 0 -1.0386666666666666 -0.6093333333333333c-0.38799999999999996 -0.2033333333333333 -0.8493333333333333 0.09733333333333333 -0.8866666666666667 0.5766666666666667 -0.007333333333333332 0.08933333333333333 -0.014666666666666665 0.18999999999999997 -0.021333333333333333 0.30133333333333334a1.6666666666666665 1.6666666666666665 0 0 1 -1.4693333333333334 -0.9213333333333332L8.451333333333332 8l1.04 -2.0786666666666664a1.6666666666666665 1.6666666666666665 0 0 1 1.4666666666666668 -0.9213333333333332c0.008666666666666666 0.14266666666666666 0.017333333333333333 0.26866666666666666 0.026666666666666665 0.3766666666666666 0.036 0.44733333333333336 0.456 0.704 0.84 0.5033333333333333a13 13 0 0 0 1.0606666666666666 -0.6226666666666667c0.44 -0.2853333333333333 0.782 -0.5413333333333333 1.0099999999999998 -0.722 0.3466666666666667 -0.27399999999999997 0.35933333333333334 -0.8106666666666666 0.03333333333333333 -1.0706666666666667a13.189333333333332 13.189333333333332 0 0 0 -1.0219999999999998 -0.7333333333333334 12.893333333333333 12.893333333333333 0 0 0 -1.0386666666666666 -0.6093333333333333Z" stroke-width="0.6667"></path>
                        </g>
                    </svg>
                    随机播放
                </div>
            </div>

            <div class="applemusic-playlist-detail-songs" id="applemusic-playlist-detail-songs-list">
                <!-- 歌曲列表动态渲染 -->
            </div>

            <!-- 歌单详情页专属底部悬浮栏 -->
            <div class="applemusic-playlist-bottom-container">
                <!-- 左侧 Library -->
                <div class="applemusic-playlist-bottom-btn" onclick="applemusicSwitchView('library')">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M6 2h12v2H6zm13 4H5c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V8c0-1.1-.9-2-2-2m-2.5 11.25c0 .96-.78 1.75-1.75 1.75S13 18.21 13 17.25s.78-1.75 1.75-1.75c.27 0 .52.07.75.18v-4.75l-5-.83v6.16c0 .96-.78 1.75-1.75 1.75S7 17.22 7 16.26s.78-1.75 1.75-1.75c.27 0 .52.07.75.18V9.51c0-.15.06-.29.18-.38s.26-.13.41-.11l6 1c.24.04.42.25.42.49v6.75Z"></path></svg>
                </div>

                <!-- 中间 播放器胶囊 -->
                <div class="applemusic-playlist-bottom-player-pill" onclick="applemusicOpenPlayer()">
                    <div class="applemusic-playlist-bottom-cover" id="applemusic-playlist-bottom-cover">
                        <svg viewBox="0 0 24 24"><path d="M12 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h4V3h-6z"/></svg>
                    </div>
                    <div class="applemusic-playlist-bottom-info">
                        <div class="applemusic-playlist-bottom-title" id="applemusic-playlist-bottom-title">暂无播放</div>
                        <div class="applemusic-playlist-bottom-artist" id="applemusic-playlist-bottom-artist"></div>
                    </div>
                    <div class="applemusic-playlist-bottom-controls">
                        <div class="applemusic-ctrl-playpause" onclick="event.stopPropagation(); applemusicTogglePlayPause(this)">
                            <svg class="applemusic-icon-pause" viewBox="0 0 24 24" fill="currentColor" style="display:none;"><rect x="6.25" y="4.5" width="4.5" height="15" rx="1"/><rect x="13.25" y="4.5" width="4.5" height="15" rx="1"/></svg>
                            <svg class="applemusic-icon-play" viewBox="0 0 24 24" fill="currentColor"><path d="M6.51 18.87c.15.09.32.13.49.13s.36-.05.51-.14l10-6c.3-.18.49-.51.49-.86s-.18-.68-.49-.86l-10-6a.99.99 0 0 0-1.01-.01c-.31.18-.51.51-.51.87v12c0 .36.19.69.51.87Z"></path></svg>
                        </div>
                    </div>
                </div>

                <!-- 右侧 Search -->
                <div class="applemusic-playlist-bottom-btn" onclick="applemusicSwitchView('search')">
                    <svg viewBox="0 0 24 24"><path d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"/></svg>
                </div>
            </div>
        </div>

        <!-- ================= SEARCH 搜索页面 ================= -->
        <div id="applemusic-view-search" class="applemusic-view-container">
            <header class="applemusic-header">
                <h1 onclick="closeMusicApp()" style="cursor: pointer;">Search</h1>
                <!-- 右上角头像 -->
                <div class="applemusic-profile-pic" onclick="applemusicSwitchView('settings')">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M11.9667 1.75195C9.81618 1.76239 7.72323 2.4468 5.98323 3.70856C4.24323 4.97032 2.94402 6.74571 2.26894 8.78424C1.59387 10.8228 1.57703 13.0215 2.22077 15.0701C2.86452 17.1187 4.13635 18.9138 5.85681 20.202C5.90685 20.2507 5.96434 20.2912 6.02709 20.322C7.7668 21.5741 9.85708 22.248 12.0017 22.248C14.1464 22.248 16.2367 21.5741 17.9764 20.322C18.0421 20.2869 18.1027 20.2432 18.1567 20.192C19.877 18.8994 21.1468 17.0996 21.7865 15.0471C22.4261 12.9945 22.4032 10.7931 21.721 8.7543C21.0389 6.71546 19.7319 4.94233 17.985 3.68573C16.2382 2.42913 14.1398 1.75265 11.9867 1.75195H11.9667ZM11.9667 5.51196C12.7921 5.50205 13.6018 5.73775 14.2926 6.18903C14.9834 6.6403 15.5239 7.28669 15.8454 8.04584C16.1668 8.80498 16.2545 9.64249 16.0974 10.4516C15.9403 11.2607 15.5454 12.0048 14.963 12.589C14.3807 13.1732 13.6374 13.5711 12.8277 13.7319C12.0181 13.8927 11.1788 13.8092 10.4169 13.492C9.65495 13.1748 9.00487 12.6383 8.54951 11.9508C8.09415 11.2634 7.85414 10.4561 7.86004 9.63196C7.86783 8.54512 8.30238 7.50471 9.07028 6.73431C9.83818 5.96392 10.8781 5.52503 11.9667 5.51196ZM16.5942 19.4319C15.2071 20.2944 13.6058 20.7515 11.9717 20.7515C10.3376 20.7515 8.73627 20.2944 7.34921 19.4319C6.918 19.1703 6.51226 18.869 6.13726 18.532C6.70519 17.7242 7.43513 17.0431 8.28074 16.532C9.39741 15.869 10.6725 15.5191 11.9717 15.5191C13.2709 15.5191 14.546 15.869 15.6627 16.532C16.5083 17.0431 17.2382 17.7242 17.8061 18.532C17.4311 18.869 17.0254 19.1703 16.5942 19.4319Z" fill="currentColor"/>
                    </svg>
                </div>
            </header>

            <!-- 搜索框 -->
            <div class="applemusic-search-bar-container">
                <div class="applemusic-search-bar">
                    <!-- 放大镜图标 -->
                    <svg class="applemusic-search-icon" viewBox="0 0 24 24"><path d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"/></svg>
                    <input type="text" id="applemusic-search-input" placeholder="输入关键词搜索">
                    <!-- 语音麦克风图标 -->
                    <svg class="applemusic-mic-icon" viewBox="0 0 24 24"><path d="M12 14c1.66 0 3-1.34 3-3V5c0-1.66-1.34-3-3-3S9 3.34 9 5v6c0 1.66 1.34 3 3 3zm5-3c0 2.76-2.24 5-5 5s-5-2.24-5-5H5c0 3.53 2.61 6.43 6 6.92V21h2v-3.08c3.39-.49 6-3.39 6-6.92h-2z"/></svg>
                </div>
                <!-- 新增：搜索类型切换栏 -->
                <div class="applemusic-search-type-tabs" style="display: flex; margin-top: 15px; background: rgba(0,0,0,0.05); border-radius: 8px; padding: 2px;">
                    <div class="applemusic-search-tab applemusic-active" data-type="1" style="flex: 1; text-align: center; padding: 6px 0; font-size: 14px; font-weight: 600; border-radius: 6px; cursor: pointer; background: #fff; box-shadow: 0 1px 3px rgba(0,0,0,0.1); color: var(--text-main);">歌曲</div>
                    <div class="applemusic-search-tab" data-type="100" style="flex: 1; text-align: center; padding: 6px 0; font-size: 14px; font-weight: 600; border-radius: 6px; cursor: pointer; color: var(--text-secondary);">歌手</div>
                </div>
            </div>

            <!-- 搜索结果展示区 -->
            <section class="applemusic-section" id="applemusic-search-results-section" style="display: none;">
                <h2 class="applemusic-section-title">搜索结果</h2>
                <div class="applemusic-chart-list" id="applemusic-search-results-list">
                    <!-- 动态渲染搜索结果 -->
                </div>
            </section>

            <!-- 最近搜索 (支持长按删除) -->
            <section class="applemusic-section" id="applemusic-recent-search-section">
                <h2 class="applemusic-section-title">最近搜索</h2>
                <div class="applemusic-recent-search-list" id="applemusic-recent-search-list">
                    <!-- 动态渲染最近搜索 -->
                </div>
            </section>
        </div>


        <!-- ================= ARTIST 歌手主页 ================= -->

        <div id="applemusic-view-settings" class="applemusic-view-container" style="background-color: #ffffff; min-height: 100%; box-sizing: border-box; padding-top: max(52px, env(safe-area-inset-top)); padding-bottom: 90px;">
            <div class="applemusic-playlist-header-top" style="padding: 6px 20px 12px; margin-bottom: 0;">
                <div class="applemusic-glass-btn applemusic-circle" onclick="applemusicSwitchView('home')">
                    <svg viewBox="0 0 24 24"><path d="M15.41 16.59L10.83 12l4.58-4.59L14 6l-6 6 6 6 1.41-1.41z"/></svg>
                </div>
                <div style="font-size: 17px; font-weight: 600; color: #1c1c1e;">账户</div>
                <div style="width: 40px;"></div>
            </div>

            <!-- 顶部头像与个人信息区 -->
            <div style="display: flex; flex-direction: column; align-items: center; justify-content: center; padding: 6px 20px 20px; position: relative;">
                <!-- 完美对齐同心的圆形头像外环 -->
                <div style="position: relative; width: 98px; height: 98px; display: flex; align-items: center; justify-content: center; margin-bottom: 14px; border-radius: 50%; border: 1.5px solid rgba(0, 0, 0, 0.08); padding: 0; box-sizing: border-box; box-shadow: 0 4px 16px rgba(0, 0, 0, 0.04);">
                    <div class="applemusic-settings-avatar" style="width: 88px; height: 88px; margin: 0; border-radius: 50%; overflow: hidden; background: #e5e5ea; cursor: pointer; display: flex; align-items: center; justify-content: center; position: relative;">
                    </div>
                </div>

                <!-- 用户名与黑胶 VIP / SVIP 胶囊 (默认隐藏，根据真实 VIP 状态显示) -->
                <div style="display: flex; align-items: center; justify-content: center; gap: 8px; margin-bottom: 6px;">
                    <span style="font-size: 20px; font-weight: 700; color: #1c1c1e; letter-spacing: -0.2px;">Piagnone</span>
                    <div id="applemusic-settings-vip-badge" style="display: none; align-items: center; gap: 5px; background: #222224; color: #ffffff; padding: 3px 8px; border-radius: 12px; font-size: 11px; font-weight: 600; cursor: pointer;">
                        <svg viewBox="0 0 1024 1024" width="13" height="13" style="flex-shrink: 0;"><path d="M512 512m-512 0a512 512 0 1 0 1024 0 512 512 0 1 0-1024 0Z" fill="#37474F"></path><path d="M512 512m-485.052632 0a485.052632 485.052632 0 1 0 970.105264 0 485.052632 485.052632 0 1 0-970.105264 0Z" fill="#263238"></path><path d="M970.105263 668.564211L512 512l156.564211 458.105263A485.052632 485.052632 0 0 0 970.105263 668.564211zM53.894737 355.435789L512 512 355.435789 53.894737A485.052632 485.052632 0 0 0 53.894737 355.435789z" fill="#37474F"></path><path d="M512 323.368421a188.631579 188.631579 0 1 0 188.631579 188.631579 188.631579 188.631579 0 0 0-188.631579-188.631579z" fill="#F44336"></path><path d="M512 512m-26.947368 0a26.947368 26.947368 0 1 0 53.894736 0 26.947368 26.947368 0 1 0-53.894736 0Z"></path></svg>
                        <span id="applemusic-settings-vip-text">VIP</span>
                    </div>
                </div>

                <!-- 签名介绍 -->
                <div style="font-size: 12px; color: #8e8e93; margin-bottom: 16px;" id="applemusic-settings-bio-text">持续失眠中 · 做自己的宇宙</div>

                <!-- 关注/粉丝/Lv/听歌时长统计 (支持自定义数据) -->
                <div style="display: flex; align-items: center; justify-content: center; gap: 16px; font-size: 13px; color: #1c1c1e;">
                    <div><strong id="applemusic-stats-follows" style="font-size: 15px; font-weight: 700;">28</strong> <span style="color: #8e8e93; font-size: 12px;">关注</span></div>
                    <div><strong id="applemusic-stats-fans" style="font-size: 15px; font-weight: 700;">16</strong> <span style="color: #8e8e93; font-size: 12px;">粉丝</span></div>
                    <div><span id="applemusic-stats-level" style="font-weight: 700; font-size: 13px; background: rgba(0,0,0,0.06); padding: 1px 6px; border-radius: 6px;">Lv.8</span></div>
                    <div><strong id="applemusic-stats-hours" style="font-size: 15px; font-weight: 700;">3642</strong> <span style="color: #8e8e93; font-size: 12px;">小时</span></div>
                </div>
            </div>

            <!-- 5个功能微圆角窄款磨砂按钮：登陆、装扮、歌词、音乐源 + 悬浮音乐条小组件 (整体卡片更窄、图标放大、单行不折行) -->
            <div style="display: grid; grid-template-columns: repeat(4, 1fr) 34px; gap: 4px; padding: 0 24px 20px;">
                <!-- 1. 登陆 (智能判断：未登录扫码，已登录打开用户信息弹窗) -->
                <div onclick="applemusicHandleLoginButtonClick()" style="display: flex; flex-direction: row; align-items: center; justify-content: center; gap: 3px; padding: 8px 0; background: rgba(0, 0, 0, 0.05); backdrop-filter: blur(16px); -webkit-backdrop-filter: blur(16px); border-radius: 4px; border: 0.5px solid rgba(0,0,0,0.04); cursor: pointer; white-space: nowrap; overflow: hidden;">
                    <svg viewBox="0 0 14 14" style="width: 16px; height: 16px; fill: #48484a; color: #48484a; flex-shrink: 0;"><path fill="#48484a" fill-rule="evenodd" d="M14 7c0 1.87687 -0.7387 3.5812 -1.9411 4.8382 -1.27 1.3275 -3.0572 2.156 -5.03801 2.1618L7 14l-0.02089 0c-1.98081 -0.0058 -3.76805 -0.8343 -5.03798 -2.1618C0.738659 10.5812 0 8.87687 0 7c0 -3.86599 3.13401 -7 7 -7 3.866 0 7 3.13401 7 7Zm-2.7572 3.5C10.2341 9.27847 8.70794 8.49997 7 8.49997c-1.70794 0 -3.23406 0.7785 -4.24285 2.00003 1.00879 1.2215 2.53491 2 4.24285 2 1.70794 0 3.2341 -0.7785 4.2428 -2ZM7.00012 7.49997c1.38071 0 2.5 -1.11929 2.5 -2.5s-1.11929 -2.5 -2.5 -2.5 -2.5 1.11929 -2.5 2.5 1.11929 2.5 2.5 2.5Z" clip-rule="evenodd"></path></svg>
                    <span id="applemusic-settings-login-text" style="font-size: 11.5px; font-weight: 600; color: #48484a; white-space: nowrap;">登陆</span>
                </div>
                <!-- 2. 装扮 (点击进入装扮设置) -->
                <div onclick="applemusicSwitchView('dress-up-settings')" style="display: flex; flex-direction: row; align-items: center; justify-content: center; gap: 3px; padding: 8px 0; background: rgba(0, 0, 0, 0.05); backdrop-filter: blur(16px); -webkit-backdrop-filter: blur(16px); border-radius: 4px; border: 0.5px solid rgba(0,0,0,0.04); cursor: pointer; white-space: nowrap; overflow: hidden;">
                    <svg viewBox="0 0 1024 1024" style="width: 16px; height: 16px; fill: #48484a; flex-shrink: 0;"><path d="M936.672 193.216l-226.88-64c-8.704-2.528-18.112-1.12-25.824 3.776-7.68 4.864-12.896 12.736-14.432 21.728C655.712 236.928 595.328 288 512 288c-71.424 0-142.464-103.296-163.776-143.104-7.136-13.28-22.528-19.84-37.024-15.68l-224 64C73.472 197.152 64 209.728 64 224v256a31.93 31.93 0 0 0 11.712 24.736c7.392 6.08 17.152 8.512 26.56 6.624L224 487.04V832c0 52.928 43.072 96 96 96h384c52.928 0 96-43.072 96-96V519.04l121.728 24.352c9.44 1.92 19.2-0.544 26.56-6.624C955.68 530.656 960 521.6 960 512V224c0-14.336-9.536-26.912-23.328-30.784zM672 800H352c-17.664 0-32-14.304-32-32s14.336-32 32-32h320c17.696 0 32 14.304 32 32s-14.304 32-32 32z"></path></svg>
                    <span style="font-size: 11.5px; font-weight: 600; color: #48484a; white-space: nowrap;">装扮</span>
                </div>
                <!-- 3. 歌词 -->
                <div onclick="applemusicSwitchView('floating-lyrics-settings')" style="display: flex; flex-direction: row; align-items: center; justify-content: center; gap: 3px; padding: 8px 0; background: rgba(0, 0, 0, 0.05); backdrop-filter: blur(16px); -webkit-backdrop-filter: blur(16px); border-radius: 4px; border: 0.5px solid rgba(0,0,0,0.04); cursor: pointer; white-space: nowrap; overflow: hidden;">
                    <svg viewBox="0 0 1024 1024" style="width: 16px; height: 16px; fill: #48484a; flex-shrink: 0;"><path d="M659.424 94.976a158.304 158.304 0 0 1 158.336 158.304v514.56a158.304 158.304 0 0 1-158.336 158.272h-315.04a158.304 158.304 0 0 1-158.336-158.304V253.28a158.336 158.336 0 0 1 158.336-158.304h315.04zM323.232 678.176a45.696 45.696 0 1 0 0 91.424h365.696a45.728 45.728 0 0 0 0-91.424H323.232z m0-182.88a45.728 45.728 0 0 0 0 91.456h365.696a45.76 45.76 0 0 0 0-91.424H323.232z m12.48-243.808a58.176 58.176 0 1 0 0 116.384 58.176 58.176 0 0 0 0-116.384z"></path></svg>
                    <span style="font-size: 11.5px; font-weight: 600; color: #48484a; white-space: nowrap;">歌词</span>
                </div>
                <!-- 4. 音乐源 (点击打开自定义音乐源抽屉) -->
                <div onclick="applemusicOpenSourceDrawer()" style="display: flex; flex-direction: row; align-items: center; justify-content: center; gap: 3px; padding: 8px 0; background: rgba(0, 0, 0, 0.05); backdrop-filter: blur(16px); -webkit-backdrop-filter: blur(16px); border-radius: 4px; border: 0.5px solid rgba(0,0,0,0.04); cursor: pointer; white-space: nowrap; overflow: hidden;">
                    <svg viewBox="0 0 1024 1024" style="width: 16px; height: 16px; fill: #48484a; flex-shrink: 0;"><path d="M377.984 85.333333h268.032c8.96 0 15.786667 0 21.76 0.64a111.914667 111.914667 0 0 1 92.117333 71.338667H264.106667a111.914667 111.914667 0 0 1 92.117333-71.338667c5.973333-0.64 12.8-0.64 21.76-0.64zM293.546667 201.514667c-53.418667 0-97.194667 35.84-111.786667 83.370666a119.466667 119.466667 0 0 0-0.896 2.986667c15.274667-5.12 31.146667-8.533333 47.274667-10.794667 41.514667-5.930667 93.952-5.930667 154.837333-5.930666h264.661333c60.885333 0 113.322667 0 154.837334 5.930666 16.085333 2.304 32 5.632 47.274666 10.794667a117.76 117.76 0 0 0-0.853333-2.986667c-14.634667-47.530667-58.410667-83.370667-111.786667-83.370666H293.504zM448 693.333333a32 32 0 1 1 0 64 32 32 0 0 1 0-64z"></path><path d="M639.786667 321.792c129.578667 0 194.389333 0 230.784 42.112 36.394667 42.112 27.818667 107.136 10.666666 237.226667l-16.213333 123.392c-13.44 102.016-20.138667 153.045333-54.613333 183.594666-34.432 30.549333-85.248 30.549333-186.88 30.549334H400.469333c-101.632 0-152.448 0-186.88-30.549334-34.474667-30.549333-41.173333-81.578667-54.613333-183.594666l-16.213333-123.392c-17.152-130.090667-25.728-195.114667 10.666666-237.226667 36.394667-42.112 101.205333-42.112 230.826667-42.112h255.530667zM544 448a32 32 0 0 0-64 0v186.794667A96 96 0 1 0 544 725.333333v-157.013333c28.586667 23.168 64.512 39.68 96 39.68a32 32 0 0 0 0-64c-13.013333 0-37.802667-9.344-60.416-29.44-22.144-19.626667-35.584-43.562667-35.584-66.56z"></path></svg>
                    <span style="font-size: 11.5px; font-weight: 600; color: #48484a; white-space: nowrap;">音乐源</span>
                </div>
                <!-- 5. 悬浮音乐条小组件 (点击打开设计抽屉，保持图标大小不变) -->
                <div onclick="applemusicOpenIslandDrawer()" style="display: flex; align-items: center; justify-content: center; width: 34px; height: 34px; background: rgba(0, 0, 0, 0.05); backdrop-filter: blur(16px); -webkit-backdrop-filter: blur(16px); border-radius: 4px; border: 0.5px solid rgba(0,0,0,0.04); cursor: pointer;" title="音乐悬浮条设置">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" height="18" width="18" style="flex-shrink: 0;">
                      <g id="Widgets-Fill">
                        <path id="Union" fill="#48484a" d="M10.1025 13.0049c0.5042 0.0513 0.8975 0.4774 0.8975 0.9951v6c-0.0001 0.5522 -0.4478 1 -1 1H4c-0.55221 0 -0.99987 -0.4478 -1 -1v-6l0.00488 -0.1025C3.05621 13.3933 3.48232 13 4 13h6zm10 0c0.5042 0.0513 0.8975 0.4774 0.8975 0.9951v6c-0.0001 0.5522 -0.4478 1 -1 1h-6c-0.5522 0 -0.9999 -0.4478 -1 -1v-6l0.0049 -0.1025C13.0562 13.3933 13.4823 13 14 13h6zM16.3691 2.22462c0.3928 -0.32035 0.9718 -0.29776 1.3379 0.06836l4 4 0.0684 0.07617c0.3202 0.39277 0.2977 0.97182 -0.0684 1.33789l-4 3.99996c-0.3661 0.366 -0.9451 0.3886 -1.3379 0.0684l-0.0761 -0.0684 -4 -3.99996c-0.3905 -0.39049 -0.3904 -1.02353 0 -1.41406l4 -4zm-6.2666 0.78027c0.5042 0.05134 0.8975 0.4774 0.8975 0.99512V10c-0.0001 0.5522 -0.4478 1 -1 1H4c-0.55221 0 -0.99987 -0.4478 -1 -1V4.00001l0.00488 -0.10254c0.05133 -0.50413 0.47744 -0.89746 0.99512 -0.89746h6z" stroke-width="1"></path>
                      </g>
                    </svg>
                </div>
            </div>

            <!-- 下方4个卡片占位展示区 (支持装扮自定义) -->
            <div style="padding: 0 16px 20px;">
                <div style="display: grid; grid-template-columns: repeat(4, 1fr); gap: 10px;" id="applemusic-account-cards-container">
                    <!-- 动态渲染 4 个卡片 -->
                </div>
            </div>

            <!-- 网易云同步歌单展示区 (显示在4个占位卡片下方) -->
            <div id="applemusic-account-netease-section" style="display: none; padding: 0 20px 30px 20px;">
                <div style="font-size: 15px; font-weight: 700; color: #1c1c1e; margin-bottom: 12px; display: flex; align-items: center; justify-content: space-between;">
                    <span>网易云歌单</span>
                    <span id="applemusic-account-playlist-count" style="font-size: 12px; color: #8e8e93; font-weight: 500;"></span>
                </div>
                <div id="applemusic-account-playlists-list" style="display: flex; flex-direction: column; gap: 8px;">
                    <!-- 动态渲染网易云歌单列表 -->
                </div>
            </div>
        </div>

        <!-- ================= DRESS UP SETTINGS 我的资料/装扮页面 ================= -->
        <div id="applemusic-view-dress-up-settings" class="applemusic-view-container" style="background-color: #ffffff; min-height: 100%; box-sizing: border-box; padding-top: max(52px, env(safe-area-inset-top)); padding-bottom: 90px;">
            <div class="applemusic-playlist-header-top" style="padding: 6px 20px 12px; margin-bottom: 0; display: flex; align-items: center; justify-content: space-between;">
                <div class="applemusic-glass-btn applemusic-circle" onclick="applemusicSwitchView('settings')">
                    <svg viewBox="0 0 24 24"><path d="M15.41 16.59L10.83 12l4.58-4.59L14 6l-6 6 6 6 1.41-1.41z"/></svg>
                </div>
                <div style="font-size: 17px; font-weight: 600; color: #1c1c1e;">我的资料</div>
                <!-- 白色磨砂胶囊包裹的保存按钮 -->
                <div class="applemusic-glass-btn applemusic-pill" onclick="applemusicSaveDressUpSettings()" style="height: 36px; padding: 0 14px; cursor: pointer; font-size: 14px; font-weight: 600; color: #000000;">
                    保存
                </div>
            </div>

            <!-- 头像及居中昵称/文案/统计数据输入区域 -->
            <div style="display: flex; flex-direction: column; align-items: center; justify-content: center; padding: 14px 20px 16px;">
                <div style="position: relative; width: 90px; height: 90px; cursor: pointer; margin-bottom: 14px;" onclick="applemusicTriggerDressUpAvatarUpload(event)">
                    <div id="applemusic-dressup-avatar-preview" style="width: 90px; height: 90px; border-radius: 50%; background: #e5e5ea; overflow: hidden; display: flex; align-items: center; justify-content: center; box-shadow: 0 4px 14px rgba(0,0,0,0.08);">
                    </div>
                    <div style="position: absolute; bottom: -6px; left: 50%; transform: translateX(-50%); background: #ffffff; box-shadow: 0 2px 8px rgba(0,0,0,0.15); border-radius: 12px; padding: 3px 8px; display: flex; align-items: center; gap: 4px; font-size: 11px; font-weight: 600; color: #575B66; white-space: nowrap;">
                        <svg viewBox="0 0 1024 1024" width="13" height="13" style="flex-shrink: 0;"><path d="M860.414581 207.449017 509.333781 207.449017c0-52.808332-43.003528-95.81186-95.81186-95.81186l-63.817235 0c-52.808332 0-95.81186 43.003528-95.81186 95.81186L158.424996 207.449017c-52.808332 0-95.81186 43.003528-95.81186 95.81186l0 510.53788c0 52.808332 43.003528 95.81186 95.81186 95.81186l701.989585 0c52.808332 0 95.81186-43.003528 95.81186-95.81186L956.22644 303.260877C956.054426 250.452545 913.050899 207.449017 860.414581 207.449017zM509.333781 749.981522c-105.616664 0-191.451705-85.835041-191.451705-191.451705s85.835041-191.451705 191.451705-191.451705 191.451705 85.835041 191.451705 191.451705S614.950445 749.981522 509.333781 749.981522zM812.422644 430.895347c-26.490173 0-47.819923-21.501764-47.819923-47.819923s21.501764-47.819923 47.819923-47.819923c26.490173 0 47.819923 21.501764 47.819923 47.819923S838.912817 430.895347 812.422644 430.895347z" fill="#575B66"></path></svg>
                        <span>更换</span>
                    </div>
                </div>
                <!-- 昵称输入框 -->
                <input type="text" id="applemusic-dressup-nickname-input" placeholder="输入昵称" style="width: 250px; border: 1px solid rgba(0,0,0,0.15); border-radius: 5px; padding: 7px 12px; font-size: 15px; font-weight: 600; color: #1c1c1e; background: #ffffff; outline: none; text-align: center; margin-bottom: 8px; box-sizing: border-box;">
                <!-- 自定义文案输入框 -->
                <input type="text" id="applemusic-dressup-bio-input" placeholder="输入个性签名 / 文案" style="width: 250px; border: 1px solid rgba(0,0,0,0.15); border-radius: 5px; padding: 6px 12px; font-size: 13px; font-weight: 500; color: #8e8e93; background: #ffffff; outline: none; text-align: center; margin-bottom: 12px; box-sizing: border-box;">
                
                <!-- 自定义 关注 / 粉丝 / 等级 / 听歌时长 (4列微圆角输入框) -->
                <div style="display: grid; grid-template-columns: repeat(4, 1fr); gap: 6px; width: 100%; max-width: 320px;">
                    <div style="display: flex; flex-direction: column; align-items: center; gap: 3px;">
                        <input type="text" id="applemusic-dressup-follows-input" placeholder="28" style="width: 100%; border: 1px solid rgba(0,0,0,0.15); border-radius: 5px; padding: 5px 2px; font-size: 13px; font-weight: 600; color: #1c1c1e; background: #ffffff; outline: none; text-align: center; box-sizing: border-box;">
                        <span style="font-size: 11px; color: #8e8e93;">关注</span>
                    </div>
                    <div style="display: flex; flex-direction: column; align-items: center; gap: 3px;">
                        <input type="text" id="applemusic-dressup-fans-input" placeholder="16" style="width: 100%; border: 1px solid rgba(0,0,0,0.15); border-radius: 5px; padding: 5px 2px; font-size: 13px; font-weight: 600; color: #1c1c1e; background: #ffffff; outline: none; text-align: center; box-sizing: border-box;">
                        <span style="font-size: 11px; color: #8e8e93;">粉丝</span>
                    </div>
                    <div style="display: flex; flex-direction: column; align-items: center; gap: 3px;">
                        <input type="text" id="applemusic-dressup-level-input" placeholder="Lv.8" style="width: 100%; border: 1px solid rgba(0,0,0,0.15); border-radius: 5px; padding: 5px 2px; font-size: 13px; font-weight: 600; color: #1c1c1e; background: #ffffff; outline: none; text-align: center; box-sizing: border-box;">
                        <span style="font-size: 11px; color: #8e8e93;">等级</span>
                    </div>
                    <div style="display: flex; flex-direction: column; align-items: center; gap: 3px;">
                        <input type="text" id="applemusic-dressup-hours-input" placeholder="3642" style="width: 100%; border: 1px solid rgba(0,0,0,0.15); border-radius: 5px; padding: 5px 2px; font-size: 13px; font-weight: 600; color: #1c1c1e; background: #ffffff; outline: none; text-align: center; box-sizing: border-box;">
                        <span style="font-size: 11px; color: #8e8e93;">小时</span>
                    </div>
                </div>
            </div>

            <!-- 装扮列表区域 -->
            <div style="padding: 0 20px;">
                <!-- 四个卡片横向装扮列表 -->
                <div style="margin-top: 10px; margin-bottom: 12px; font-size: 13px; color: #8e8e93; font-weight: 500; display: flex; align-items: center; justify-content: space-between;">
                    <span>主页卡片装扮 </span>
                    <div onclick="applemusicResetDressUpCards()" title="恢复默认" style="display: flex; align-items: center; cursor: pointer; padding: 2px;">
                        <svg t="1788532096205" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="2163" style="width: 15px; height: 15px; flex-shrink: 0;"><path d="M512 112.64c-80.349867 0-160.5632 26.8288-228.5568 73.3184l-0.682667-0.682667c-4.5056 3.413333-8.874667 7.031467-13.380266 10.581334-4.437333 3.2768-8.738133 6.826667-13.038934 10.24-14.9504 12.834133-37.4784 1.6384-37.205333-18.363734l0.8192-81.1008A38.229333 38.229333 0 0 0 182.135467 68.266667a37.6832 37.6832 0 0 0-38.775467 36.932266l-2.730667 236.544a38.229333 38.229333 0 0 0 35.498667 38.229334l2.389333 0.136533 0.750934-0.068267c0.4096 0 0.750933 0.2048 1.2288 0.2048h0.341333l210.397867-0.682666a40.004267 40.004267 0 0 0 39.662933-32.836267 40.5504 40.5504 0 0 0-8.3968-31.9488 38.5024 38.5024 0 0 0-29.0816-14.062933h-0.4096l-65.3312 0.273066c-20.821333 0-30.5152-26.8288-14.813867-40.482133 58.094933-43.690667 128.6144-69.085867 199.133867-69.085867 183.637333 0 333.0048 153.8048 333.0048 342.698667 0 189.098667-149.367467 342.8352-333.0048 342.8352s-333.0048-153.736533-333.0048-342.766933c0-10.513067-4.096-20.48-11.264-27.921067a37.751467 37.751467 0 0 0-54.135467 0A40.004267 40.004267 0 0 0 102.4 534.186667C102.4 766.634667 286.1056 955.733333 512 955.733333s409.6-189.098667 409.6-421.546666-183.7056-421.614933-409.6-421.614934" fill="#999999" p-id="2164"></path></svg>
                    </div>
                </div>
                <div id="applemusic-dressup-cards-editor" style="display: grid; grid-template-columns: repeat(4, 1fr); gap: 10px;">
                    <!-- 动态横向渲染 4 个卡片编辑器 -->
                </div>

                <!-- 首页专属精选推荐横向卡片装扮 -->
                <div style="margin-top: 24px; margin-bottom: 12px; font-size: 13px; color: #8e8e93; font-weight: 500; display: flex; align-items: center; justify-content: space-between;">
                    <span>首页专属精选推荐 </span>
                    <div onclick="applemusicResetDressUpFeatured()" title="恢复默认" style="display: flex; align-items: center; cursor: pointer; padding: 2px;">
                        <svg t="1788532096205" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="2163" style="width: 15px; height: 15px; flex-shrink: 0;"><path d="M512 112.64c-80.349867 0-160.5632 26.8288-228.5568 73.3184l-0.682667-0.682667c-4.5056 3.413333-8.874667 7.031467-13.380266 10.581334-4.437333 3.2768-8.738133 6.826667-13.038934 10.24-14.9504 12.834133-37.4784 1.6384-37.205333-18.363734l0.8192-81.1008A38.229333 38.229333 0 0 0 182.135467 68.266667a37.6832 37.6832 0 0 0-38.775467 36.932266l-2.730667 236.544a38.229333 38.229333 0 0 0 35.498667 38.229334l2.389333 0.136533 0.750934-0.068267c0.4096 0 0.750933 0.2048 1.2288 0.2048h0.341333l210.397867-0.682666a40.004267 40.004267 0 0 0 39.662933-32.836267 40.5504 40.5504 0 0 0-8.3968-31.9488 38.5024 38.5024 0 0 0-29.0816-14.062933h-0.4096l-65.3312 0.273066c-20.821333 0-30.5152-26.8288-14.813867-40.482133 58.094933-43.690667 128.6144-69.085867 199.133867-69.085867 183.637333 0 333.0048 153.8048 333.0048 342.698667 0 189.098667-149.367467 342.8352-333.0048 342.8352s-333.0048-153.736533-333.0048-342.766933c0-10.513067-4.096-20.48-11.264-27.921067a37.751467 37.751467 0 0 0-54.135467 0A40.004267 40.004267 0 0 0 102.4 534.186667C102.4 766.634667 286.1056 955.733333 512 955.733333s409.6-189.098667 409.6-421.546666-183.7056-421.614933-409.6-421.614934" fill="#999999" p-id="2164"></path></svg>
                    </div>
                </div>
                <div id="applemusic-dressup-featured-editor" style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 12px;">
                    <!-- 动态横向渲染 2 个精选卡片编辑器 -->
                </div>
            </div>
        </div>


        <!-- ================= 音乐源抽屉弹窗 ================= -->
        <div id="applemusic-modal-api-source" class="applemusic-modal-overlay" onclick="applemusicCloseSourceDrawer()">
            <div class="applemusic-modal-content" style="height: 90vh; border-radius: 16px 16px 0 0;" onclick="event.stopPropagation()">
                <div class="applemusic-drawer-handle-bar"></div>
                <div class="applemusic-modal-header">
                    <div class="applemusic-modal-btn" onclick="applemusicCloseSourceDrawer()" style="width: 32px; height: 32px; border-radius: 50%; border: 1px solid rgba(0,0,0,0.1); display: flex; align-items: center; justify-content: center; color: #000; background: rgba(255, 255, 255, 0.75); backdrop-filter: blur(20px); -webkit-backdrop-filter: blur(20px);">
                        <svg viewBox="0 0 24 24" width="20" height="20" stroke="currentColor" stroke-width="2" fill="none"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                    </div>
                    <div class="applemusic-modal-title">自定义音乐源</div>
                    <div class="applemusic-modal-btn applemusic-create applemusic-active" onclick="applemusicSaveApiSettings()" style="width: 32px; height: 32px; border-radius: 50%; background: #fa243c; display: flex; align-items: center; justify-content: center; color: #fff;">
                        <svg viewBox="0 0 24 24" width="20" height="20" stroke="currentColor" stroke-width="3" fill="none" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
                    </div>
                </div>
                <div class="applemusic-modal-body" style="padding: 0; overflow-y: auto; overflow-x: hidden; display: block; text-align: center;">

                    <!-- 手机边框图文教程轮播区 (7步超详尽纯SVG保姆级教程) -->
                    <div style="padding-top: 14px; background: #ffffff;">
                        <div class="applemusic-tutorial-carousel-wrapper">
                            <div id="applemusic-source-tutorial-carousel" class="applemusic-tutorial-carousel">

                                <!-- 第 1 步：准备账号并复制仓库 -->
                                <div class="applemusic-tutorial-card active" data-index="0">
                                    <div class="applemusic-phone-mockup">
                                        <div class="applemusic-phone-notch"></div>
                                        <div class="applemusic-phone-screen" style="padding-top: 22px; background: #ffffff; display: flex; flex-direction: column; justify-content: space-between; position: relative;">
                                            <div class="applemusic-tutorial-bubble" style="top: 26px; left: 10px; z-index: 25;">
                                                1 注册账号并复制仓库
                                            </div>

                                            <div style="padding: 36px 8px 6px; text-align: left; display: flex; flex-direction: column; gap: 7px;">
                                                <div style="background: #f6f8fa; border: 1px solid #d0d7de; border-radius: 8px; padding: 7px 8px;">
                                                    <div style="font-size: 8px; font-weight: 700; color: #24292f; margin-bottom: 2px;">① GitHub 官网</div>
                                                    <div style="font-size: 7.5px; color: #57606a;">打开 github.com 注册登录</div>
                                                </div>
                                                <div style="background: #f6f8fa; border: 1px solid #d0d7de; border-radius: 8px; padding: 7px 8px;">
                                                    <div style="font-size: 8px; font-weight: 700; color: #24292f; margin-bottom: 2px;">② Vercel 官网</div>
                                                    <div style="font-size: 7.5px; color: #57606a;">打开 vercel.com 点击 Sign Up 选择 Continue with GitHub 登录</div>
                                                </div>
                                                <div style="background: #f6f8fa; border: 1px solid #d0d7de; border-radius: 8px; padding: 7px 8px;">
                                                    <div style="font-size: 8px; font-weight: 700; color: #24292f; margin-bottom: 2px;">③ 开源项目地址</div>
                                                    <div style="font-size: 7px; color: #0969da; word-break: break-all; margin-bottom: 4px;">
                                                        github.com/NeteaseCloudMusicApiEnhanced/api-enhanced
                                                    </div>
                                                    <div onclick="applemusicCopyRepoUrl()" style="background: #24292f; color: #ffffff; border-radius: 4px; padding: 4px; font-size: 7.5px; font-weight: 700; text-align: center; cursor: pointer; display: flex; align-items: center; justify-content: center; gap: 3px;">
                                                        <svg viewBox="0 0 24 24" width="8" height="8" fill="none" stroke="currentColor" stroke-width="2"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path></svg>
                                                        <span>点击复制仓库链接并在浏览器打开</span>
                                                    </div>
                                                </div>
                                            </div>

                                            <div style="background: #f6f8fa; border-top: 1px solid #d0d7de; padding: 6px 8px; font-size: 7px; color: #57606a; text-align: left; line-height: 1.2;">
                                                点击复制链接并在手机浏览器中打开，进入下一步。
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <!-- 第 2 步：GitHub 页面点击 Fork (完美复刻图1：纯文字+SVG，蓝色文件夹) -->
                                <div class="applemusic-tutorial-card" data-index="1">
                                    <div class="applemusic-phone-mockup">
                                        <div class="applemusic-phone-notch"></div>
                                        <div class="applemusic-phone-screen" style="padding-top: 22px; background: #ffffff; display: flex; flex-direction: column; justify-content: space-between; position: relative;">
                                            <!-- 提示气泡下移至文件列表下方，完全不遮挡顶部的 Fork 按钮 -->
                                            <div class="applemusic-tutorial-bubble" style="bottom: 38px; left: 10px; z-index: 25;">
                                                2 点击上方 Fork 按钮
                                            </div>

                                            <div>
                                                <!-- GitHub 顶栏 -->
                                                <div style="background: #f6f8fa; border-bottom: 1px solid #d0d7de; padding: 5px 8px; display: flex; align-items: center; justify-content: space-between;">
                                                    <div style="display: flex; align-items: center; gap: 4px;">
                                                        <svg viewBox="0 0 24 24" width="11" height="11" stroke="#24292f" stroke-width="2"><line x1="3" y1="6" x2="21" y2="6"></line><line x1="3" y1="12" x2="21" y2="12"></line><line x1="3" y1="18" x2="21" y2="18"></line></svg>
                                                        <svg viewBox="0 0 24 24" width="13" height="13" fill="#24292f"><path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"/></svg>
                                                        <span style="font-size: 7.5px; font-weight: 700; color: #0969da;">... / api-enhanced ▾</span>
                                                    </div>
                                                    <div style="width: 10px; height: 10px; border-radius: 50%; background: #d0d7de;"></div>
                                                </div>

                                                <!-- Tab 栏 -->
                                                <div style="padding: 4px 8px 0; display: flex; gap: 8px; font-size: 7px; border-bottom: 1px solid #d0d7de;">
                                                    <span style="font-weight: 700; color: #24292f; border-bottom: 2px solid #fd8c73; padding-bottom: 3px;">Code</span>
                                                    <span style="color: #57606a;">Issues 3</span>
                                                    <span style="color: #57606a;">Pull requests 5</span>
                                                </div>

                                                <!-- 纯 SVG 与文字按钮 (无数字) -->
                                                <div style="padding: 6px 8px 0; display: flex; gap: 4px; align-items: center;">
                                                    <div style="background: #f6f8fa; border: 1px solid #d0d7de; border-radius: 4px; padding: 2px 4px; font-size: 6.5px; color: #24292f; display: flex; align-items: center; gap: 2px;">
                                                        <svg viewBox="0 0 24 24" width="8" height="8" fill="none" stroke="currentColor" stroke-width="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg>
                                                        <span>Watch</span>
                                                    </div>
                                                    <div style="background: #f6f8fa; border: 1px solid #d0d7de; border-radius: 4px; padding: 2px 5px; font-size: 6.5px; font-weight: 700; color: #24292f; display: flex; align-items: center; gap: 2px;">
                                                        <svg viewBox="0 0 24 24" width="8" height="8" fill="none" stroke="currentColor" stroke-width="2.5"><line x1="6" y1="3" x2="6" y2="15"></line><circle cx="18" cy="6" r="3"></circle><circle cx="6" cy="18" r="3"></circle><path d="M18 9a9 9 0 0 1-9 9"></path></svg>
                                                        <span>Fork</span>
                                                    </div>
                                                    <div style="background: #f6f8fa; border: 1px solid #d0d7de; border-radius: 4px; padding: 2px 4px; font-size: 6.5px; color: #24292f; display: flex; align-items: center; gap: 2px;">
                                                        <svg viewBox="0 0 24 24" width="8" height="8" fill="none" stroke="currentColor" stroke-width="2"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon></svg>
                                                        <span>Star</span>
                                                    </div>
                                                </div>

                                                <!-- 蓝色文件夹列表 -->
                                                <div style="padding: 6px 8px; text-align: left;">
                                                    <div style="background: #1f883d; color: #fff; border-radius: 4px; padding: 2px 5px; font-size: 6px; font-weight: 700; width: fit-content; margin-bottom: 5px;">Use this template ▾</div>
                                                    <div style="background: #f6f8fa; border: 1px solid #d0d7de; border-radius: 4px; padding: 3px 5px; font-size: 6.5px; color: #24292f; display: flex; flex-direction: column; gap: 3px;">
                                                        <div style="display: flex; align-items: center; gap: 3px;">
                                                            <svg viewBox="0 0 24 24" width="10" height="10" fill="#54aeff"><path d="M2 4a2 2 0 0 1 2-2h5l2 2h9a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V4z"/></svg>
                                                            <span>.codegraph</span>
                                                        </div>
                                                        <div style="display: flex; align-items: center; gap: 3px;">
                                                            <svg viewBox="0 0 24 24" width="10" height="10" fill="#54aeff"><path d="M2 4a2 2 0 0 1 2-2h5l2 2h9a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V4z"/></svg>
                                                            <span>.github</span>
                                                        </div>
                                                        <div style="display: flex; align-items: center; gap: 3px;">
                                                            <svg viewBox="0 0 24 24" width="10" height="10" fill="#54aeff"><path d="M2 4a2 2 0 0 1 2-2h5l2 2h9a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V4z"/></svg>
                                                            <span>module</span>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>

                                            <div style="background: #f6f8fa; border-top: 1px solid #d0d7de; padding: 6px 8px; font-size: 7px; color: #57606a; text-align: left; line-height: 1.2;">
                                                在仓库页面中找到并点击「Fork」按钮。
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <!-- 第 3 步：Create a new fork 确认页面 (完美复刻图2) -->
                                <div class="applemusic-tutorial-card" data-index="2">
                                    <div class="applemusic-phone-mockup">
                                        <div class="applemusic-phone-notch"></div>
                                        <div class="applemusic-phone-screen" style="padding-top: 22px; background: #ffffff; display: flex; flex-direction: column; justify-content: space-between; position: relative;">
                                            <div class="applemusic-tutorial-bubble" style="bottom: 38px; right: 10px; z-index: 25;">
                                                3 点击绿色 Create fork
                                            </div>

                                            <div style="padding: 6px 8px; text-align: left;">
                                                <div style="font-size: 9px; font-weight: 800; color: #24292f; margin-bottom: 2px;">Create a new fork</div>
                                                <div style="font-size: 6px; color: #57606a; margin-bottom: 5px; line-height: 1.2;">A fork is a copy of a repository.</div>

                                                <!-- Owner * -->
                                                <div style="font-size: 6.5px; font-weight: 600; color: #24292f; margin-bottom: 1px;">Owner *</div>
                                                <div style="background: #f6f8fa; border: 1px solid #d0d7de; border-radius: 4px; padding: 2px 4px; font-size: 6.5px; color: #24292f; display: flex; align-items: center; justify-content: space-between; margin-bottom: 4px;">
                                                    <span>your-username</span>
                                                    <span style="color: #57606a;">▾</span>
                                                </div>

                                                <!-- Repository name * -->
                                                <div style="font-size: 6.5px; font-weight: 600; color: #24292f; margin-bottom: 1px;">Repository name *</div>
                                                <div style="background: #ffffff; border: 1px solid #d0d7de; border-radius: 4px; padding: 2px 4px; font-size: 6.5px; color: #24292f; margin-bottom: 2px;">
                                                    api-enhanced
                                                </div>
                                                <div style="display: flex; align-items: center; gap: 2px; font-size: 6px; color: #1a7f37; margin-bottom: 4px;">
                                                    <svg viewBox="0 0 24 24" width="7" height="7" fill="none" stroke="currentColor" stroke-width="3"><polyline points="20 6 9 17 4 12"></polyline></svg>
                                                    <span>api-enhanced is available.</span>
                                                </div>

                                                <!-- Copy the main branch only -->
                                                <div style="display: flex; align-items: center; gap: 3px; margin-bottom: 6px;">
                                                    <div style="width: 8px; height: 8px; background: #0969da; border-radius: 2px; display: flex; align-items: center; justify-content: center;">
                                                        <svg viewBox="0 0 24 24" width="6" height="6" fill="none" stroke="#ffffff" stroke-width="3"><polyline points="20 6 9 17 4 12"></polyline></svg>
                                                    </div>
                                                    <span style="font-size: 6.5px; font-weight: 600; color: #24292f;">Copy the main branch only</span>
                                                </div>

                                                <!-- 绿色 Create fork 按钮 -->
                                                <div style="display: flex; justify-content: flex-end;">
                                                    <div style="background: #1f883d; color: #ffffff; border-radius: 4px; padding: 3px 8px; font-size: 7px; font-weight: 700;">
                                                        Create fork
                                                    </div>
                                                </div>
                                            </div>

                                            <div style="background: #f6f8fa; border-top: 1px solid #d0d7de; padding: 6px 8px; font-size: 7px; color: #57606a; text-align: left; line-height: 1.2;">
                                                保持默认设置不变，点击右下角绿色「Create fork」按键。
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <!-- 第 4 步：Vercel 控制台点击 [+] (复刻 Vercel 首页与底部弹窗) -->
                                <div class="applemusic-tutorial-card" data-index="3">
                                    <div class="applemusic-phone-mockup">
                                        <div class="applemusic-phone-notch"></div>
                                        <div class="applemusic-phone-screen" style="padding-top: 22px; background: #ffffff; display: flex; flex-direction: column; justify-content: space-between; position: relative;">
                                            <div class="applemusic-tutorial-bubble" style="bottom: 58px; left: 10px; z-index: 25;">
                                                4 点击 [+] 并选 Project
                                            </div>

                                            <div style="padding: 0 8px;">
                                                <!-- Vercel 顶栏 -->
                                                <div style="padding: 4px 0; display: flex; align-items: center; justify-content: space-between; border-bottom: 1px solid #eaeaea;">
                                                    <div style="display: flex; align-items: center; gap: 4px;">
                                                        <div style="width: 10px; height: 10px; border-radius: 50%; background: #0070f3;"></div>
                                                        <span style="font-size: 7.5px; font-weight: 700; color: #000;">projects</span>
                                                    </div>
                                                    <svg width="10" height="9" viewBox="0 0 76 65" fill="#000"><polygon points="38 0 76 65 0 65"></polygon></svg>
                                                </div>

                                                <!-- 搜索栏与 [+] 按钮 -->
                                                <div style="padding: 5px 0; display: flex; gap: 4px; align-items: center;">
                                                    <div style="flex: 1; background: #fafafa; border: 1px solid #eaeaea; border-radius: 4px; padding: 3px 5px; font-size: 6.5px; color: #888;">
                                                        Search Projects
                                                    </div>
                                                    <div style="background: #000000; color: #ffffff; border-radius: 4px; width: 15px; height: 15px; display: flex; align-items: center; justify-content: center; font-size: 10px; font-weight: 700;">+</div>
                                                </div>
                                            </div>

                                            <!-- 底部滑出菜单 (复刻图4) -->
                                            <div style="background: #ffffff; border-top: 1px solid #eaeaea; box-shadow: 0 -4px 12px rgba(0,0,0,0.06); padding: 4px 10px; text-align: left;">
                                                <div style="font-size: 7.5px; font-weight: 700; color: #0070f3; padding: 4px 0; border-bottom: 1px solid #f2f2f7;">
                                                    Project
                                                </div>
                                                <div style="font-size: 7px; color: #444; padding: 3px 0;">Agent</div>
                                                <div style="font-size: 7px; color: #444; padding: 3px 0;">Domain</div>
                                                <div style="font-size: 7px; color: #444; padding: 3px 0;">Store</div>
                                            </div>

                                            <div style="background: #f6f8fa; border-top: 1px solid #eaeaea; padding: 6px 8px; font-size: 7px; color: #57606a; text-align: left; line-height: 1.2;">
                                                进入 Vercel 点击搜索栏右侧黑色「+」，在弹出菜单中点击「Project」。
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <!-- 第 5 步：Vercel Import Git 仓库列表 (复刻最新截图 1/2) -->
                                <div class="applemusic-tutorial-card" data-index="4">
                                    <div class="applemusic-phone-mockup">
                                        <div class="applemusic-phone-notch"></div>
                                        <div class="applemusic-phone-screen" style="padding-top: 22px; background: #ffffff; display: flex; flex-direction: column; justify-content: space-between; position: relative;">
                                            <div class="applemusic-tutorial-bubble" style="bottom: 50px; right: 10px; z-index: 25;">
                                                5 找到仓库点 Import
                                            </div>

                                            <div style="padding: 4px 8px; text-align: left;">
                                                <div style="font-size: 9px; font-weight: 800; color: #000; margin-bottom: 4px;">Let's build something new</div>

                                                <div style="font-size: 7.5px; font-weight: 700; color: #000; margin-bottom: 4px;">Import Git Repository</div>

                                                <!-- 账号选择框 -->
                                                <div style="background: #ffffff; border: 1px solid #eaeaea; border-radius: 4px; padding: 3px 5px; font-size: 6.5px; color: #000; display: flex; align-items: center; justify-content: space-between; margin-bottom: 4px;">
                                                    <span>your-username</span>
                                                    <span style="color: #888;">▾</span>
                                                </div>

                                                <!-- 仓库项列表 (复刻截图) -->
                                                <div style="background: #ffffff; border: 1px solid #eaeaea; border-radius: 6px; overflow: hidden; display: flex; flex-direction: column;">
                                                    <div style="padding: 4px 6px; display: flex; align-items: center; justify-content: space-between; border-bottom: 1px solid #f2f2f7;">
                                                        <span style="font-size: 6.5px; color: #888;">project-demo</span>
                                                        <div style="background: #000; color: #fff; font-size: 6px; padding: 2px 4px; border-radius: 3px;">Import</div>
                                                    </div>
                                                    <div style="padding: 4px 6px; display: flex; align-items: center; justify-content: space-between; background: #f9f9fb;">
                                                        <span style="font-size: 7px; font-weight: 700; color: #000;">api-enhanced</span>
                                                        <div style="background: #000000; color: #ffffff; font-size: 6px; font-weight: 700; padding: 2px 6px; border-radius: 3px;">Import</div>
                                                    </div>
                                                </div>
                                            </div>

                                            <div style="background: #f6f8fa; border-top: 1px solid #eaeaea; padding: 6px 8px; font-size: 7px; color: #57606a; text-align: left; line-height: 1.2;">
                                                在列表找到刚 Fork 的「api-enhanced」，点击其右侧黑色「Import」按键。
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <!-- 第 6 步：Vercel New Project 配置与 Deploy (复刻最新截图 4) -->
                                <div class="applemusic-tutorial-card" data-index="5">
                                    <div class="applemusic-phone-mockup">
                                        <div class="applemusic-phone-notch"></div>
                                        <div class="applemusic-phone-screen" style="padding-top: 22px; background: #ffffff; display: flex; flex-direction: column; justify-content: space-between; position: relative;">
                                            <div class="applemusic-tutorial-bubble" style="bottom: 38px; left: 10px; z-index: 25;">
                                                6 保持默认 点 Deploy
                                            </div>

                                            <div style="padding: 4px 8px; text-align: left;">
                                                <div style="font-size: 9px; font-weight: 800; color: #000; margin-bottom: 3px;">New Project</div>

                                                <div style="background: #f6f8fa; border-radius: 4px; padding: 3px 5px; font-size: 6px; color: #57606a; margin-bottom: 4px;">
                                                    Importing from GitHub: <strong>api-enhanced</strong> (main)
                                                </div>

                                                <div style="display: flex; flex-direction: column; gap: 3px; font-size: 6.5px;">
                                                    <div>
                                                        <span style="color: #666;">Project Name</span>
                                                        <div style="background: #fff; border: 1px solid #d0d7de; border-radius: 3px; padding: 2px 4px; color: #000; margin-top: 1px;">api-enhanced</div>
                                                    </div>
                                                    <div>
                                                        <span style="color: #666;">Application Preset</span>
                                                        <div style="background: #fff; border: 1px solid #d0d7de; border-radius: 3px; padding: 2px 4px; color: #000; margin-top: 1px;">Express ▾</div>
                                                    </div>
                                                    <div>
                                                        <span style="color: #666;">Root Directory: ./</span>
                                                    </div>
                                                </div>

                                                <!-- 黑色 Deploy 按钮 (复刻截图) -->
                                                <div style="background: #000000; color: #ffffff; border-radius: 4px; padding: 4px; font-size: 7.5px; font-weight: 700; text-align: center; margin-top: 5px;">
                                                    Deploy
                                                </div>
                                            </div>

                                            <div style="background: #f6f8fa; border-top: 1px solid #eaeaea; padding: 6px 8px; font-size: 7px; color: #57606a; text-align: left; line-height: 1.2;">
                                                页面所有配置均无需修改，直接点击最下方黑色「Deploy」开始构建。
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <!-- 第 7 步：获取 Domains 域名填入下方输入框 -->
                                <div class="applemusic-tutorial-card" data-index="6">
                                    <div class="applemusic-phone-mockup">
                                        <div class="applemusic-phone-notch"></div>
                                        <div class="applemusic-phone-screen" style="padding-top: 22px; background: #ffffff; display: flex; flex-direction: column; justify-content: space-between; position: relative;">
                                            <div class="applemusic-tutorial-bubble" style="top: 48px; left: 10px; z-index: 25;">
                                                7 复制域名 填入下方
                                            </div>

                                            <div style="padding: 38px 8px 6px; text-align: left; display: flex; flex-direction: column; gap: 6px;">
                                                <div style="background: #f6f8fa; border: 1px solid #eaeaea; border-radius: 6px; padding: 5px 6px;">
                                                    <div style="font-size: 7px; color: #1a7f37; font-weight: 700; margin-bottom: 2px;">✓ Deployment Ready (构建完成)</div>
                                                    <div style="font-size: 6.5px; color: #57606a;">点击 Continue to Dashboard 进入项目页</div>
                                                </div>
                                                <div style="background: #f6f8fa; border: 1px dashed #0070f3; border-radius: 6px; padding: 6px;">
                                                    <div style="font-size: 6.5px; color: #57606a; margin-bottom: 2px;">顶部 <strong>Domains</strong> 专属地址：</div>
                                                    <div style="font-size: 7px; font-weight: 700; color: #0070f3; font-family: monospace; word-break: break-all;">
                                                        https://api-enhanced-xxx.vercel.app
                                                    </div>
                                                </div>
                                            </div>

                                            <div style="background: #f6f8fa; border-top: 1px solid #eaeaea; padding: 6px 8px; font-size: 7px; color: #57606a; text-align: left; line-height: 1.2;">
                                                复制以 https:// 开头、末尾无斜杠的域名，粘贴至下方输入框并点右上角保存。
                                            </div>
                                        </div>
                                    </div>
                                </div>

                            </div>
                        </div>
                        <!-- 滑动指示器 (7个圆点) -->
                        <div id="applemusic-source-tutorial-dots" class="applemusic-carousel-dots" style="margin-top: 6px; margin-bottom: 14px;">
                            <div class="applemusic-carousel-dot active" data-index="0"></div>
                            <div class="applemusic-carousel-dot" data-index="1"></div>
                            <div class="applemusic-carousel-dot" data-index="2"></div>
                            <div class="applemusic-carousel-dot" data-index="3"></div>
                            <div class="applemusic-carousel-dot" data-index="4"></div>
                            <div class="applemusic-carousel-dot" data-index="5"></div>
                            <div class="applemusic-carousel-dot" data-index="6"></div>
                        </div>
                    </div>

                    <!-- 自定义音乐源配置与启用开关（支持仅填写不启用） -->
                    <div style="padding: 0 20px 24px 20px; text-align: left;">
                        <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 8px;">
                            <div style="font-size: 13px; color: var(--text-secondary); font-weight: 600;">自定义音乐源地址</div>
                            <div style="display: flex; align-items: center; gap: 6px; cursor: pointer;" onclick="applemusicToggleCustomApiUsage()">
                                <span style="font-size: 12px; color: #1c1c1e; font-weight: 600;">启用自定义源</span>
                                <div class="applemusic-toggle" id="applemusic-custom-api-toggle" style="transform: scale(0.8); transform-origin: right center;"><div class="applemusic-toggle-thumb"></div></div>
                            </div>
                        </div>
                        <input type="text" id="applemusic-custom-api-input" placeholder="https://您的api地址" style="width: 100%; border: 1px solid rgba(0, 0, 0, 0.08); border-radius: 5px; padding: 11px 13px; font-size: 14px; color: #1c1c1e; background: #f2f2f7; outline: none; box-sizing: border-box;" oninput="applemusicCustomApiInput()">
                    </div>

                </div>
            </div>
        </div>

        <!-- ================= 音乐悬浮条自定义设置抽屉弹窗 ================= -->
        <div id="applemusic-modal-island-settings" class="applemusic-modal-overlay" onclick="applemusicCloseIslandDrawer()">
            <div class="applemusic-modal-content" style="height: 82vh; border-radius: 20px 20px 0 0; background: #ffffff;" onclick="event.stopPropagation()">
                <div class="applemusic-drawer-handle-bar"></div>
                <div class="applemusic-modal-header" style="border-bottom: 0.5px solid rgba(0,0,0,0.06); padding: 12px 20px;">
                    <div class="applemusic-modal-btn" onclick="applemusicCloseIslandDrawer()" style="width: 32px; height: 32px; border-radius: 50%; border: 1px solid rgba(0,0,0,0.08); display: flex; align-items: center; justify-content: center; color: #1c1c1e; background: rgba(255, 255, 255, 0.85); backdrop-filter: blur(20px); -webkit-backdrop-filter: blur(20px);">
                        <svg viewBox="0 0 24 24" width="18" height="18" stroke="currentColor" stroke-width="2" fill="none"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                    </div>
                    <div class="applemusic-modal-title" style="font-size: 17px; font-weight: 700; color: #1c1c1e; letter-spacing: -0.2px;">悬浮音乐条</div>
                    <div class="applemusic-modal-btn applemusic-create applemusic-active" onclick="applemusicSaveIslandDrawerSettings()" style="width: 32px; height: 32px; border-radius: 50%; background: #fa243c; display: flex; align-items: center; justify-content: center; color: #ffffff;">
                        <svg viewBox="0 0 24 24" width="20" height="20" stroke="currentColor" stroke-width="3" fill="none" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
                    </div>
                </div>

                <div class="applemusic-modal-body" style="padding: 16px 20px 40px; overflow-y: auto; display: block; text-align: left;">

                    <!-- 1. 实时视效微舞台 (Live Studio Deck) -->
                    <div style="background: radial-gradient(rgba(255,255,255,0.08) 1px, transparent 1px) 0 0/14px 14px, #18181b; border-radius: 14px; padding: 16px; margin-bottom: 16px; box-shadow: 0 8px 24px rgba(0,0,0,0.1); border: 1px solid rgba(255,255,255,0.08); position: relative; overflow: hidden;">
                        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 14px;">
                            <span style="font-size: 11px; font-weight: 700; color: #a1a1aa; letter-spacing: 0.8px; text-transform: uppercase;">Studio Deck · 视效实时同频</span>
                            <span style="font-size: 10px; background: rgba(255,255,255,0.15); color: #f4f4f5; padding: 2px 7px; border-radius: 4px; font-weight: 600;">Dynamic Island</span>
                        </div>
                        <div style="min-height: 80px; display: flex; align-items: center; justify-content: center; overflow: hidden; padding: 10px 0;">
                            <!-- 模拟悬浮条预览 -->
                            <div id="applemusic-island-drawer-preview" style="width: 230px; display: flex; flex-direction: column; align-items: center; transform: scale(var(--am-island-scale, 1)); transition: transform 0.2s cubic-bezier(0.2, 0.9, 0.3, 1);">
                                <div style="display: flex; align-items: center; width: 100%; padding: 0 2px;">
                                    <div style="width: 34px; height: 26px; display: flex; align-items: center; flex-shrink: 0;">
                                        <div style="width: 26px; height: 26px; border-radius: 50%; background: #37474F; box-shadow: 0 2px 8px rgba(0,0,0,0.5), 0 0 0 1px rgba(255,255,255,0.2); display: flex; align-items: center; justify-content: center;">
                                            <div style="width: 8px; height: 8px; border-radius: 50%; background: #fff;"></div>
                                        </div>
                                    </div>
                                    <div style="flex: 1; min-width: 0; padding: 0 6px; white-space: nowrap; overflow: hidden; font-family: 'Songti SC', serif;">
                                        <span style="font-size: 16px; font-weight: 700; color: var(--am-island-color, #ffffff); opacity: 0.95; text-shadow: 0 0 8px rgba(255,255,255,0.35);">音</span>
                                        <span style="font-size: 12px; font-weight: 500; color: var(--am-island-color, rgba(248, 250, 252, 0.7)); margin-left: 2px;">乐，让美好发生</span>
                                    </div>
                                    <div style="width: 26px; height: 26px; display: flex; align-items: center; justify-content: center; flex-shrink: 0;">
                                        <svg viewBox="0 0 24 24" width="16" height="16" style="fill: var(--am-island-color, #ffffff);"><path d="M6.51 18.87c.15.09.32.13.49.13s.36-.05.51-.14l10-6c.3-.18.49-.51.49-.86s-.18-.68-.49-.86l-10-6a.99.99 0 0 0-1.01-.01c-.31.18-.51.51-.51.87v12c0 .36.19.69.51.87Z"></path></svg>
                                    </div>
                                </div>
                                <div style="width: calc(100% - 20px); display: flex; flex-direction: column; gap: 1.5px; opacity: 0.5; margin-top: 2px;">
                                    <div style="width: 58%; height: 1px; background: linear-gradient(90deg, transparent 0%, var(--am-island-color, #ffffff) 80%, rgba(255,255,255,0.2) 100%);"></div>
                                    <div style="width: 100%; height: 0.5px; background: linear-gradient(90deg, transparent 0%, var(--am-island-color, #ffffff) 15%, var(--am-island-color, #ffffff) 85%, transparent 100%);"></div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- 2. 总开关卡片 (完全复刻歌词设置开关的极简现代白底黑灰样式) -->
                    <div style="background: #ffffff; border: 1px solid #e4e4e7; border-radius: 8px; padding: 14px 16px; box-shadow: 0 4px 16px rgba(0,0,0,0.03); display: flex; align-items: center; justify-content: space-between; margin-bottom: 14px;">
                        <div style="display: flex; align-items: center; gap: 12px;">
                            <div style="width: 36px; height: 36px; border-radius: 6px; background: #f4f4f5; display: flex; align-items: center; justify-content: center; color: #18181b;">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" height="20" width="20">
                                  <g id="Widgets-Fill"><path fill="currentColor" d="M10.1025 13.0049c0.5042 0.0513 0.8975 0.4774 0.8975 0.9951v6c-0.0001 0.5522 -0.4478 1 -1 1H4c-0.55221 0 -0.99987 -0.4478 -1 -1v-6l0.00488 -0.1025C3.05621 13.3933 3.48232 13 4 13h6zm10 0c0.5042 0.0513 0.8975 0.4774 0.8975 0.9951v6c-0.0001 0.5522 -0.4478 1 -1 1h-6c-0.5522 0 -0.9999 -0.4478 -1 -1v-6l0.0049 -0.1025C13.0562 13.3933 13.4823 13 14 13h6zM16.3691 2.22462c0.3928 -0.32035 0.9718 -0.29776 1.3379 0.06836l4 4 0.0684 0.07617c0.3202 0.39277 0.2977 0.97182 -0.0684 1.33789l-4 3.99996c-0.3661 0.366 -0.9451 0.3886 -1.3379 0.0684l-0.0761 -0.0684 -4 -3.99996c-0.3905 -0.39049 -0.3904 -1.02353 0 -1.41406l4 -4zm-6.2666 0.78027c0.5042 0.05134 0.8975 0.4774 0.8975 0.99512V10c-0.0001 0.5522 -0.4478 1 -1 1H4c-0.55221 0 -0.99987 -0.4478 -1 -1V4.00001l0.00488 -0.10254c0.05133 -0.50413 0.47744 -0.89746 0.99512 -0.89746h6z"></path></g>
                                </svg>
                            </div>
                            <div>
                                <div style="font-size: 15px; font-weight: 700; color: #18181b;">悬浮音乐条显示</div>
                                <div style="display: flex; align-items: center; gap: 5px; margin-top: 2px;">
                                    <div id="applemusic-island-status-dot" style="width: 6px; height: 6px; border-radius: 50%; background: #a1a1aa;"></div>
                                    <div id="applemusic-island-drawer-status" style="font-size: 12px; color: #71717a; font-weight: 500;">关闭</div>
                                </div>
                            </div>
                        </div>
                        <div class="applemusic-toggle" id="applemusic-island-drawer-toggle" onclick="applemusicToggleIslandDrawerSwitch()" style="background: #e4e4e7;">
                            <div class="applemusic-toggle-thumb"></div>
                        </div>
                    </div>

                    <!-- 3. 大小尺寸规格精调卡片 -->
                    <div style="background: #f7f7f8; border: 1px solid rgba(0,0,0,0.06); border-radius: 12px; padding: 14px 16px; margin-bottom: 14px;">
                        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px;">
                            <span style="font-size: 14px; font-weight: 600; color: #18181b;">尺寸缩放比例</span>
                            <div style="display: flex; align-items: center; gap: 3px;">
                                <input type="number" id="applemusic-island-scale-input" value="100" min="60" max="150" style="width: 48px; font-size: 13px; font-weight: 700; border: 1px solid #d4d4d8; border-radius: 4px; padding: 3px 4px; text-align: center; color: #18181b; background: #ffffff; outline: none;" oninput="applemusicChangeIslandScale(this.value)">
                                <span style="font-size: 12px; color: #71717a;">%</span>
                            </div>
                        </div>
                        <input type="range" id="applemusic-island-scale-slider" min="60" max="150" step="1" value="100" class="am-fl-mono-slider" oninput="applemusicChangeIslandScale(this.value)" style="margin-bottom: 12px;">

                        <!-- 快捷规格标签 -->
                        <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 8px;">
                            <div onclick="applemusicChangeIslandScale(80)" style="background: #ffffff; border: 0.5px solid #d4d4d8; border-radius: 6px; padding: 6px 0; text-align: center; font-size: 11px; font-weight: 600; color: #52525b; cursor: pointer;">80% 紧凑</div>
                            <div onclick="applemusicChangeIslandScale(100)" style="background: #ffffff; border: 0.5px solid #d4d4d8; border-radius: 6px; padding: 6px 0; text-align: center; font-size: 11px; font-weight: 600; color: #52525b; cursor: pointer;">100% 标准</div>
                            <div onclick="applemusicChangeIslandScale(125)" style="background: #ffffff; border: 0.5px solid #d4d4d8; border-radius: 6px; padding: 6px 0; text-align: center; font-size: 11px; font-weight: 600; color: #52525b; cursor: pointer;">125% 放大</div>
                        </div>
                    </div>

                    <!-- 4. 字体颜色与光轨调色卡片 -->
                    <div style="background: #f7f7f8; border: 1px solid rgba(0,0,0,0.06); border-radius: 12px; padding: 14px 16px; margin-bottom: 14px;">
                        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px;">
                            <span style="font-size: 14px; font-weight: 600; color: #18181b;">字体与音轨色彩</span>
                            <div style="display: flex; align-items: center; gap: 8px;">
                                <input type="text" id="applemusic-island-color-text" value="#ffffff" style="width: 70px; font-size: 12px; font-weight: 700; border: 1px solid #d4d4d8; border-radius: 4px; padding: 3px 5px; text-align: center; color: #18181b; background: #ffffff; outline: none;" onchange="applemusicChangeIslandColor(this.value)">
                                <input type="color" id="applemusic-island-color-input" value="#ffffff" style="border: 1px solid #d4d4d8; width: 26px; height: 26px; border-radius: 50%; cursor: pointer; background: transparent; padding: 0;" onchange="applemusicChangeIslandColor(this.value)">
                            </div>
                        </div>

                        <!-- 推荐色谱选择球 -->
                        <div style="display: flex; justify-content: space-between; align-items: center; padding-top: 4px;">
                            <div onclick="applemusicChangeIslandColor('#ffffff')" title="极简白" style="width: 24px; height: 24px; border-radius: 50%; background: #ffffff; border: 1.5px solid #d4d4d8; cursor: pointer; box-shadow: 0 1px 4px rgba(0,0,0,0.08);"></div>
                            <div onclick="applemusicChangeIslandColor('#e4e4e7')" title="冷雾银" style="width: 24px; height: 24px; border-radius: 50%; background: #e4e4e7; border: 1.5px solid #d4d4d8; cursor: pointer;"></div>
                            <div onclick="applemusicChangeIslandColor('#fa243c')" title="苹果红" style="width: 24px; height: 24px; border-radius: 50%; background: #fa243c; cursor: pointer;"></div>
                            <div onclick="applemusicChangeIslandColor('#ffd60a')" title="琥珀金" style="width: 24px; height: 24px; border-radius: 50%; background: #ffd60a; cursor: pointer;"></div>
                            <div onclick="applemusicChangeIslandColor('#30d158')" title="薄荷绿" style="width: 24px; height: 24px; border-radius: 50%; background: #30d158; cursor: pointer;"></div>
                            <div onclick="applemusicChangeIslandColor('#0a84ff')" title="冰川蓝" style="width: 24px; height: 24px; border-radius: 50%; background: #0a84ff; cursor: pointer;"></div>
                            <div onclick="applemusicChangeIslandColor('#bf5af2')" title="极光紫" style="width: 24px; height: 24px; border-radius: 50%; background: #bf5af2; cursor: pointer;"></div>
                        </div>
                    </div>

                    <!-- 5. 坐标复位按键 -->
                    <div onclick="applemusicResetIslandPosition()" style="display: flex; align-items: center; justify-content: center; gap: 6px; padding: 10px 0; background: #ffffff; border: 1px solid #d4d4d8; border-radius: 10px; font-size: 13px; font-weight: 600; color: #18181b; cursor: pointer; transition: background 0.2s;">
                        <svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"></path><path d="M3 3v5h5"></path></svg>
                        <span>复位悬浮条至屏幕顶部居中</span>
                    </div>

                </div>
            </div>
        </div>

        <!-- ================= FLOATING LYRICS SETTINGS 悬浮歌词设置页面 ================= -->
        <div id="applemusic-view-floating-lyrics-settings" class="applemusic-view-container" style="background-color: #ffffff; min-height: 100%; box-sizing: border-box; padding-top: max(52px, env(safe-area-inset-top)); padding-bottom: 90px;">
            <!-- 极简清爽顶栏（右上角留白，无复位按键） -->
            <div class="applemusic-playlist-header-top" style="padding: 6px 20px 14px; margin-bottom: 0; display: flex; align-items: center; justify-content: space-between;">
                <div class="applemusic-glass-btn applemusic-circle" onclick="applemusicSwitchView('settings')">
                    <svg viewBox="0 0 24 24"><path d="M15.41 16.59L10.83 12l4.58-4.59L14 6l-6 6 6 6 1.41-1.41z"/></svg>
                </div>
                <div style="font-size: 17px; font-weight: 600; color: #18181b; letter-spacing: -0.2px;">悬浮歌词</div>
                <div style="width: 40px; height: 40px;"></div>
            </div>

            <!-- 主控开关卡片（减小边框圆角至 8px，使用全新方框歌词 SVG 图标） -->
            <div style="padding: 0 20px 14px;">
                <div style="background: #ffffff; border: 1px solid #e4e4e7; border-radius: 8px; padding: 14px 16px; box-shadow: 0 4px 16px rgba(0,0,0,0.03); display: flex; align-items: center; justify-content: space-between;">
                    <div style="display: flex; align-items: center; gap: 12px;">
                        <div style="width: 36px; height: 36px; border-radius: 6px; background: #f4f4f5; display: flex; align-items: center; justify-content: center; color: #18181b;">
                            <svg class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor">
                                <path d="M800 992H224C118.4 992 32 905.6 32 800V224C32 118.4 118.4 32 224 32h576c105.6 0 192 86.4 192 192v576c0 105.6-86.4 192-192 192zM224 96c-70.4 0-128 57.6-128 128v576c0 70.4 57.6 128 128 128h576c70.4 0 128-57.6 128-128V224c0-70.4-57.6-128-128-128H224z"></path>
                                <path d="M416 752c-17.6 0-32-14.4-32-32V352c0-105.6 86.4-192 192-192h16c17.6 0 32 14.4 32 32s-14.4 32-32 32h-16c-70.4 0-128 57.6-128 128v368c0 17.6-14.4 32-32 32z"></path>
                                <path d="M576 320h256c17.6 0 32 14.4 32 32s-14.4 32-32 32H576c-17.6 0-32-14.4-32-32s14.4-32 32-32zM576 512h256c17.6 0 32 14.4 32 32s-14.4 32-32 32H576c-17.6 0-32-14.4-32-32s14.4-32 32-32zM576 704h256c17.6 0 32 14.4 32 32s-14.4 32-32 32H576c-17.6 0-32-14.4-32-32s14.4-32 32-32z"></path>
                                <path d="M304 864c-80 0-144-64-144-144s64-144 144-144 144 64 144 144-64 144-144 144z m0-224c-44.8 0-80 35.2-80 80s35.2 80 80 80 80-35.2 80-80-35.2-80-80-80z"></path>
                            </svg>
                        </div>
                        <div>
                            <div style="font-size: 15px; font-weight: 700; color: #18181b;">全局悬浮歌词</div>
                            <div style="display: flex; align-items: center; gap: 5px; margin-top: 2px;">
                                <div id="applemusic-fl-status-dot" style="width: 6px; height: 6px; border-radius: 50%; background: #a1a1aa;"></div>
                                <div id="applemusic-current-floating-lyrics-status" style="font-size: 12px; color: #71717a; font-weight: 500;">关闭</div>
                            </div>
                        </div>
                    </div>
                    <div class="applemusic-toggle" id="applemusic-floating-lyrics-toggle" onclick="applemusicToggleFloatingLyrics()" style="background: #e4e4e7;">
                        <div class="applemusic-toggle-thumb"></div>
                    </div>
                </div>
            </div>

            <!-- 动态视听黑胶模拟台（圆角缩减至 8px，全真视效实时同步） -->
            <div style="padding: 0 20px 20px;">
                <div style="background: #18181b; border-radius: 8px; padding: 14px; box-shadow: 0 6px 20px rgba(0,0,0,0.08); color: #ffffff; position: relative; overflow: hidden;">
                    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px;">
                        <div style="font-size: 11px; font-weight: 700; color: #a1a1aa; letter-spacing: 0.8px; text-transform: uppercase;">Studio Stage · 实时视效舱</div>
                        <div id="applemusic-fl-style-pill-name" style="font-size: 11px; background: rgba(255,255,255,0.12); color: #e4e4e7; padding: 2px 8px; border-radius: 4px; font-weight: 600;">错落几何风</div>
                    </div>
                    <div style="background: radial-gradient(rgba(255,255,255,0.08) 1px, transparent 1px) 0 0/14px 14px, #09090b; border: 1px solid rgba(255,255,255,0.08); border-radius: 6px; min-height: 90px; display: flex; align-items: center; justify-content: center; padding: 12px; text-align: center; box-sizing: border-box; overflow: hidden;">
                        <div id="applemusic-fl-settings-preview-box" style="width: 100%; display: flex; justify-content: center; align-items: center;">
                            <!-- 由 JS 实时注入完整的歌词视效结构 -->
                        </div>
                    </div>
                </div>
            </div>

            <!-- 4组图形化视效风格舱（2×2 工作舱设计，圆角减小） -->
            <div style="padding: 0 20px 20px;">
                <div style="font-size: 13px; color: #71717a; font-weight: 700; margin-bottom: 12px; letter-spacing: -0.1px;">视觉排版模式</div>
                <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 10px;">
                    <!-- 风格 1：错落几何风 -->
                    <div id="floating-style-card-1" onclick="applemusicSelectFloatingLyricsStyle(1)" class="applemusic-fl-modern-card active">
                        <div class="am-fl-card-vis am-fl-vis-1">
                            <div class="am-fl-mock-note">𝄞</div>
                            <div class="am-fl-mock-stagger">
                                <span>A</span><span>p</span><span>p</span><span>l</span><span>e</span>
                            </div>
                        </div>
                        <div class="am-fl-card-meta">
                            <div class="am-fl-card-name">错落几何</div>
                            <div class="am-fl-card-sub">微五线谱 · 穿插跳跃</div>
                        </div>
                    </div>

                    <!-- 风格 2：网易云双行 -->
                    <div id="floating-style-card-2" onclick="applemusicSelectFloatingLyricsStyle(2)" class="applemusic-fl-modern-card">
                        <div class="am-fl-card-vis am-fl-vis-2">
                            <div class="am-fl-mock-dual-line1"></div>
                            <div class="am-fl-mock-dual-line2"></div>
                        </div>
                        <div class="am-fl-card-meta">
                            <div class="am-fl-card-name">网易双行</div>
                            <div class="am-fl-card-sub">双行渐变 · 极简透明</div>
                        </div>
                    </div>

                    <!-- 风格 3：宋韵雨丝 -->
                    <div id="floating-style-card-3" onclick="applemusicSelectFloatingLyricsStyle(3)" class="applemusic-fl-modern-card">
                        <div class="am-fl-card-vis am-fl-vis-3">
                            <span class="am-fl-mock-serif-char">宋</span>
                            <div class="am-fl-mock-rain-line"></div>
                        </div>
                        <div class="am-fl-card-meta">
                            <div class="am-fl-card-name">宋韵雨丝</div>
                            <div class="am-fl-card-sub">首字淡雅 · 细雨纹理</div>
                        </div>
                    </div>

                    <!-- 风格 4：行书飘逸 -->
                    <div id="floating-style-card-4" onclick="applemusicSelectFloatingLyricsStyle(4)" class="applemusic-fl-modern-card">
                        <div class="am-fl-card-vis am-fl-vis-4">
                            <span class="am-fl-mock-cursive-char">逸</span>
                            <div class="am-fl-mock-brush-dot">「 」</div>
                        </div>
                        <div class="am-fl-card-meta">
                            <div class="am-fl-card-name">行书飘逸</div>
                            <div class="am-fl-card-sub">写意墨韵 · 质感轮转</div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- 参数精调工作台（圆角紧凑，CSS 高度提升至 150px） -->
            <div style="padding: 0 20px 24px;">
                <div style="font-size: 13px; color: #71717a; font-weight: 700; margin-bottom: 12px; letter-spacing: -0.1px;">控制与校准</div>

                <!-- 字体与调色双列 -->
                <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 10px; margin-bottom: 12px;">
                    <!-- 字号面板 -->
                    <div style="background: #fafafa; border: 1px solid #e4e4e7; border-radius: 8px; padding: 12px 14px; display: flex; flex-direction: column; justify-content: space-between; gap: 10px;">
                        <div style="display: flex; justify-content: space-between; align-items: center;">
                            <span style="font-size: 13px; font-weight: 600; color: #18181b;">字阶大小</span>
                            <div style="display: flex; align-items: center; gap: 2px;">
                                <input type="number" id="applemusic-fl-fontsize-input" value="18" min="12" max="48" style="width: 44px; font-size: 13px; font-weight: 700; border: 1px solid #d4d4d8; border-radius: 4px; padding: 3px 4px; text-align: center; color: #18181b; background: #ffffff; outline: none;" oninput="applemusicChangeFloatingLyricsSlider(this.value, 'fontSize')">
                                <span style="font-size: 11px; color: #71717a;">px</span>
                            </div>
                        </div>
                        <input type="range" id="applemusic-fl-fontsize-slider" min="12" max="48" step="1" value="18" class="am-fl-mono-slider" oninput="applemusicChangeFloatingLyricsSlider(this.value, 'fontSize')">
                    </div>

                    <!-- 调色面板 -->
                    <div style="background: #fafafa; border: 1px solid #e4e4e7; border-radius: 8px; padding: 12px 14px; display: flex; flex-direction: column; justify-content: space-between; gap: 10px;">
                        <div style="display: flex; justify-content: space-between; align-items: center;">
                            <span style="font-size: 13px; font-weight: 600; color: #18181b;">色谱色值</span>
                            <input type="text" id="applemusic-floating-lyrics-color-text" value="#ffffff" style="width: 64px; font-size: 12px; font-weight: 700; border: 1px solid #d4d4d8; border-radius: 4px; padding: 3px 4px; text-align: center; color: #18181b; background: #ffffff; outline: none;" onchange="applemusicChangeFloatingLyricsColor(this.value)">
                        </div>
                        <div style="display: flex; align-items: center; justify-content: space-between;">
                            <input type="color" id="applemusic-floating-lyrics-color-input" value="#ffffff" style="border: 1px solid #d4d4d8; width: 24px; height: 24px; border-radius: 50%; cursor: pointer; background: transparent; padding: 0;" onchange="applemusicChangeFloatingLyricsColor(this.value)">
                            <div style="display: flex; gap: 5px;">
                                <div onclick="applemusicChangeFloatingLyricsColor('#ffffff')" title="纯白" style="width: 18px; height: 18px; border-radius: 50%; background: #ffffff; border: 1px solid #d4d4d8; cursor: pointer;"></div>
                                <div onclick="applemusicChangeFloatingLyricsColor('#e4e4e7')" title="冷银" style="width: 18px; height: 18px; border-radius: 50%; background: #e4e4e7; border: 1px solid #d4d4d8; cursor: pointer;"></div>
                                <div onclick="applemusicChangeFloatingLyricsColor('#a1a1aa')" title="石墨灰" style="width: 18px; height: 18px; border-radius: 50%; background: #a1a1aa; cursor: pointer;"></div>
                                <div onclick="applemusicChangeFloatingLyricsColor('#ffd60a')" title="琥珀金" style="width: 18px; height: 18px; border-radius: 50%; background: #ffd60a; cursor: pointer;"></div>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- 空间坐标定位面板（复位按键内置于此） -->
                <div style="background: #fafafa; border: 1px solid #e4e4e7; border-radius: 8px; padding: 14px 16px; margin-bottom: 12px;">
                    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px;">
                        <span style="font-size: 13px; font-weight: 600; color: #18181b;">水平偏移 (X-Axis)</span>
                        <div style="display: flex; align-items: center; gap: 3px;">
                            <input type="number" id="applemusic-fl-x-input" value="0" style="width: 50px; font-size: 13px; font-weight: 700; border: 1px solid #d4d4d8; border-radius: 4px; padding: 3px 4px; text-align: center; color: #18181b; background: #ffffff; outline: none;" oninput="applemusicChangeFloatingLyricsSlider(this.value, 'x')">
                            <span style="font-size: 11px; color: #71717a;">px</span>
                        </div>
                    </div>
                    <input type="range" id="applemusic-fl-x-slider" min="-300" max="300" step="1" value="0" class="am-fl-mono-slider" oninput="applemusicChangeFloatingLyricsSlider(this.value, 'x')">

                    <div style="display: flex; justify-content: space-between; align-items: center; margin-top: 14px; margin-bottom: 10px;">
                        <span style="font-size: 13px; font-weight: 600; color: #18181b;">垂直偏移 (Y-Axis)</span>
                        <div style="display: flex; align-items: center; gap: 3px;">
                            <input type="number" id="applemusic-fl-y-input" value="0" style="width: 50px; font-size: 13px; font-weight: 700; border: 1px solid #d4d4d8; border-radius: 4px; padding: 3px 4px; text-align: center; color: #18181b; background: #ffffff; outline: none;" oninput="applemusicChangeFloatingLyricsSlider(this.value, 'y')">
                            <span style="font-size: 11px; color: #71717a;">px</span>
                        </div>
                    </div>
                    <input type="range" id="applemusic-fl-y-slider" min="-100" max="700" step="1" value="0" class="am-fl-mono-slider" oninput="applemusicChangeFloatingLyricsSlider(this.value, 'y')">

                    <!-- 内置复位胶囊按钮（黑白灰沉稳极简，脱离右上角） -->
                    <div onclick="applemusicResetFloatingLyricsPosition()" class="am-fl-reset-action-btn">
                        <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"></path><path d="M3 3v5h5"></path></svg>
                        <span>复位至屏幕默认居中</span>
                    </div>
                </div>

                <!-- 自定义终端 CSS 覆盖（高度提升至 150px） -->
                <div style="background: #fafafa; border: 1px solid #e4e4e7; border-radius: 8px; padding: 14px 16px;">
                    <div style="font-size: 13px; font-weight: 600; color: #18181b; margin-bottom: 8px; display: flex; justify-content: space-between; align-items: center;">
                        <span>样式拓展覆盖 (Custom CSS)</span>
                        <span style="font-size: 11px; color: #a1a1aa; font-family: monospace;">.css</span>
                    </div>
                    <textarea id="applemusic-floating-lyrics-custom-css" placeholder="/* 可在此输入样式选择器覆盖悬浮歌词层 */" style="width: 100%; height: 150px; border: 1px solid #d4d4d8; border-radius: 6px; outline: none; background: #ffffff; font-family: SFMono-Regular, Menlo, Monaco, Consolas, monospace; font-size: 12px; color: #18181b; padding: 10px; box-sizing: border-box; resize: vertical;" oninput="applemusicApplyFloatingLyricsCustomCss(this.value)"></textarea>
                </div>
            </div>
        </div>

        <!-- 已登录网易云账号详情居中弹窗 -->
        <div id="applemusic-user-profile-modal" style="display: none; position: fixed; inset: 0; z-index: 10000; align-items: center; justify-content: center; background: rgba(0,0,0,0.45); backdrop-filter: blur(10px); -webkit-backdrop-filter: blur(10px);" onclick="applemusicCloseUserProfileModal()">
            <div style="width: 85%; max-width: 310px; background: #ffffff; border-radius: 24px; padding: 24px 20px 20px; display: flex; flex-direction: column; align-items: center; box-shadow: 0 20px 45px rgba(0,0,0,0.25);" onclick="event.stopPropagation()">
                <div style="width: 100%; display: flex; align-items: center; justify-content: space-between; margin-bottom: 16px;">
                    <div style="font-size: 16px; font-weight: 700; color: #1c1c1e;">网易云账号</div>
                    <div onclick="applemusicCloseUserProfileModal()" style="width: 26px; height: 26px; border-radius: 50%; background: rgba(0,0,0,0.06); display: flex; align-items: center; justify-content: center; cursor: pointer; color: #8e8e93;">
                        <svg viewBox="0 0 24 24" width="14" height="14" stroke="currentColor" stroke-width="2.5" fill="none"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                    </div>
                </div>
                <!-- 用户头像与 VIP 角标 -->
                <div style="position: relative; width: 72px; height: 72px; margin-bottom: 12px;">
                    <img id="applemusic-user-modal-avatar" src="" style="width: 100%; height: 100%; border-radius: 50%; object-fit: cover; background: #eee;">
                    <div id="applemusic-user-modal-vip-badge" style="position: absolute; bottom: 0; right: 0; background: #222224; color: #fff; font-size: 9px; font-weight: 700; padding: 2px 5px; border-radius: 8px; display: none;">VIP</div>
                </div>
                <!-- 昵称与账号 -->
                <div id="applemusic-user-modal-name" style="font-size: 17px; font-weight: 700; color: #1c1c1e; margin-bottom: 4px; text-align: center;">-</div>
                <div id="applemusic-user-modal-uid" style="font-size: 12px; color: #8e8e93; margin-bottom: 20px; text-align: center;">UID: -</div>

                <!-- 退出登录按键 -->
                <div onclick="applemusicNeteaseLogout()" style="width: 100%; background: rgba(255, 59, 48, 0.1); color: #ff3b30; border-radius: 12px; padding: 12px 0; font-size: 15px; font-weight: 600; text-align: center; cursor: pointer; transition: transform 0.1s;">
                    退出登录
                </div>
            </div>
        </div>

        <!-- 扫码登录居中弹窗 -->
        <div id="applemusic-qr-modal" style="display: none; position: fixed; inset: 0; z-index: 10000; align-items: center; justify-content: center; background: rgba(0,0,0,0.5); backdrop-filter: blur(8px); -webkit-backdrop-filter: blur(8px);" onclick="applemusicCloseQrModal()">
            <div style="width: 85%; max-width: 320px; background: #ffffff; border-radius: 20px; padding: 20px 20px 24px; display: flex; flex-direction: column; align-items: center; box-shadow: 0 20px 40px rgba(0,0,0,0.25);" onclick="event.stopPropagation()">
                <div style="width: 100%; display: flex; align-items: center; justify-content: space-between; margin-bottom: 16px;">
                    <div style="font-size: 17px; font-weight: 700; color: #1c1c1e;">网易云扫码登录</div>
                    <div onclick="applemusicCloseQrModal()" style="width: 28px; height: 28px; border-radius: 50%; background: rgba(0,0,0,0.06); display: flex; align-items: center; justify-content: center; cursor: pointer; color: #8e8e93;">
                        <svg viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" stroke-width="2.5" fill="none"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                    </div>
                </div>
                <div id="applemusic-qr-img-container" style="width: 180px; height: 180px; background: #f2f2f7; border-radius: 14px; display: flex; align-items: center; justify-content: center; margin-bottom: 14px; overflow: hidden; border: 1px solid rgba(0,0,0,0.06);">
                    <span style="color: #8e8e93; font-size: 14px;">加载中...</span>
                </div>
                <div id="applemusic-qr-status" style="font-size: 13px; color: var(--text-secondary); font-weight: 500; text-align: center;">请使用网易云音乐 APP 扫码</div>
            </div>
        </div>

        <!-- 分享歌曲同频抽屉弹窗 (方案六无发光) -->
        <div id="applemusic-share-char-modal" class="applemusic-share-drawer-overlay" onclick="applemusicCloseShareCharModal()">
            <div class="applemusic-share-drawer" onclick="event.stopPropagation()">
                <div class="applemusic-drawer-handle-bar"></div>
                <div class="applemusic-share-header-row">
                    <span class="applemusic-share-title">分享歌曲</span>
                    <!-- 右上角纸飞机发送按钮 -->
                    <div class="applemusic-share-send-btn" id="applemusic-share-send-btn" onclick="applemusicExecuteSendShare()">
                        <svg viewBox="0 0 1024 1024"><path d="M923.663 92.57c-15.534-7.768-31.069-7.768-38.836 0L108.104 480.93c-15.534 0-23.302 15.535-23.302 31.069s7.768 31.069 15.535 31.069L286.75 659.577c15.535 7.768 31.07 7.768 46.604-7.767l411.663-372.827 15.534 7.767-372.827 396.13c-7.767 7.766-7.767 15.534-7.767 23.3v170.88c0 15.534 7.767 31.069 23.302 38.836 15.534 7.767 31.069 0 38.836-7.767l93.207-93.207 186.413 124.276c7.767 7.767 15.535 7.767 23.302 7.767h15.534c15.535-7.767 23.302-15.535 23.302-31.07l155.345-776.722c0-23.302 0-38.836-15.535-46.603z"/></svg>
                    </div>
                </div>

                <!-- 歌曲预览卡片 (带无损标签与律动波形) -->
                <div class="applemusic-share-song-card">
                    <img class="applemusic-share-song-cover" id="applemusic-share-preview-cover" src="" alt="cover">
                    <div class="applemusic-share-song-info">
                        <div class="applemusic-share-song-title" id="applemusic-share-preview-title">暂无播放</div>
                        <div class="applemusic-share-song-artist" id="applemusic-share-preview-artist">-</div>
                        <div class="applemusic-share-lossless-badge">
                            <svg viewBox="0 0 24 24" width="10" height="10" fill="currentColor"><path d="M12 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h4V3h-6z"/></svg>
                            <span>Apple 无损音频</span>
                        </div>
                    </div>
                    <!-- 律动波形条 -->
                    <div class="applemusic-share-sync-badge">
                        <div class="applemusic-share-sync-bar"></div>
                        <div class="applemusic-share-sync-bar"></div>
                        <div class="applemusic-share-sync-bar"></div>
                    </div>
                </div>

                <!-- 角色横向平铺选择列表 -->
                <div class="applemusic-share-char-row" id="applemusic-share-char-list">
                    <!-- 动态渲染角色头像列表 -->
                </div>
            </div>
        </div>

        <!-- 邀请一起听歌弹窗 -->
        <div id="applemusic-modal-invite-listen" class="applemusic-invite-overlay" onclick="applemusicCloseInviteModal()">
            <div class="applemusic-invite-glass-panel" onclick="event.stopPropagation()">
                <div class="applemusic-invite-header">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" id="Airbuds--Streamline-Solar" height="18" width="18">
                      <g id="Line Duotone/Electronic Devices/Airbuds">
                        <path id="Vector" stroke="#737373" stroke-linecap="round" d="M19.5 6v2.5" stroke-width="1.5"></path>
                        <path id="Vector_2" stroke="#737373" stroke-linecap="round" d="M4.5 6v2.5" stroke-width="1.5"></path>
                        <path id="Vector_3" stroke="#333333" d="M13.5 18v0.75c0 1.2426 1.0074 2.25 2.25 2.25S18 19.9926 18 18.75V18m-4.5 0V8.3125c0 -0.29016 0 -0.43524 0.006 -0.55784 0.1262 -2.56852 2.1801 -4.62245 4.7487 -4.74864C18.3773 3 18.5223 3 18.8125 3c0.1741 0 0.2611 0 0.3347 0.00361 1.5411 0.07571 2.7735 1.30808 2.8492 2.84919 0.0036 0.07355 0.0036 0.1606 0.0036 0.3347V8.3c0 1.65685 -1.3431 3 -3 3 -0.5523 0 -1 0.4477 -1 1V18m-4.5 0H18" stroke-width="1.5"></path>
                        <path id="Vector_4" stroke="#333333" d="M10.5 18v0.75c0 1.2426 -1.00736 2.25 -2.25 2.25S6 19.9926 6 18.75V18m4.5 0V8.3125c0 -0.29016 0 -0.43524 -0.006 -0.55784 -0.1262 -2.56852 -2.18014 -4.62245 -4.74866 -4.74864C5.62274 3 5.47766 3 5.1875 3c-0.1741 0 -0.26115 0 -0.3347 0.00361 -1.54111 0.07571 -2.77348 1.30808 -2.84919 2.84919C2 5.92635 2 6.0134 2 6.1875V8.3c0 1.65685 1.34315 3 3 3 0.55228 0 1 0.4477 1 1V18m4.5 0H6" stroke-width="1.5"></path>
                      </g>
                    </svg>
                    <span>音乐邀请</span>
                </div>
                <div class="applemusic-invite-carousel-container">
                    <div id="applemusic-invite-carousel" class="applemusic-invite-carousel">
                        <!-- 动态渲染角色卡片 -->
                    </div>
                </div>
                <div class="applemusic-invite-info">
                    <div id="applemusic-invite-char-name" class="applemusic-invite-name">选择角色</div>
                </div>
                <div class="applemusic-invite-actions">
                    <div class="applemusic-invite-btn cancel" onclick="applemusicCloseInviteModal()">取消</div>
                    <div class="applemusic-invite-btn confirm" onclick="applemusicConfirmInvite()">确认</div>
                </div>
            </div>
        </div>

        <!-- ================= ARTIST 歌手主页 ================= -->
        <div id="applemusic-view-artist" class="applemusic-view-container">
            <div class="applemusic-header-bg" id="applemusic-artist-header-bg"></div>

            <!-- 左上角固定按钮 (动态返回) -->
            <div class="applemusic-nav-btn-fixed applemusic-left applemusic-circle" onclick="applemusicSwitchView(window.applemusicArtistBackView || 'search')">
                <svg viewBox="0 0 24 24"><path d="M15.41 16.59L10.83 12l4.58-4.59L14 6l-6 6 6 6 1.41-1.41z"/></svg>
            </div>

            <!-- 右上角固定按钮 -->
            <div class="applemusic-nav-btn-fixed applemusic-right applemusic-pill">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" style="fill: none; stroke: currentColor; cursor: pointer;" stroke-linecap="round" stroke-linejoin="round" height="24" width="24" onclick="applemusicShareArtist()" title="分享艺人">
                  <path d="M8 9H7a2 2 0 0 0 -2 2v8a2 2 0 0 0 2 2h10a2 2 0 0 0 2 -2v-8a2 2 0 0 0 -2 -2h-1" stroke-width="2"></path>
                  <path d="M12 14V3" stroke-width="2"></path>
                  <path d="m9 6 3 -3 3 3" stroke-width="2"></path>
                </svg>
                <svg viewBox="0 0 24 24" style="cursor: pointer;" onclick="applemusicOpenArtistMoreMenu(event)" title="更多选项"><path d="M6 10c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm12 0c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm-6 0c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z"/></svg>
            </div>

            <!-- 歌手信息 -->
            <div class="applemusic-artist-info">
                <div class="applemusic-artist-name" id="applemusic-artist-page-name">歌手名字</div>
                <div class="applemusic-artist-actions">
                    <div class="applemusic-glass-btn applemusic-circle" onclick="applemusicOpenArtistBio()" title="艺人简介">
                        <svg viewBox="0 0 16 16" fill="currentColor" xmlns="http://www.w3.org/2000/svg" height="16" width="16">
                          <path d="M8 4c0.5522666666666667 0 1 -0.4477133333333333 1 -1S8.552266666666666 2 8 2s-1 0.4477133333333333 -1 1S7.447733333333333 4 8 4Zm-2 2.6666666666666665h1.3333333333333333v5.333333333333333H6v1.3333333333333333h4v-1.3333333333333333h-1.3333333333333333V5.333333333333333H6v1.3333333333333333Z" stroke-width="0.6667"></path>
                        </svg>
                    </div>
                    <div class="applemusic-btn-play-large" onclick="applemusicToggleArtistPlay(this)" title="播放">
                        <svg class="applemusic-artist-play-icon" viewBox="0 0 24 24" fill="currentColor"><path d="M6.51 18.87c.15.09.32.13.49.13s.36-.05.51-.14l10-6c.3-.18.49-.51.49-.86s-.18-.68-.49-.86l-10-6a.99.99 0 0 0-1.01-.01c-.31.18-.51.51-.51.87v12c0 .36.19.69.51.87Z"></path></svg>
                        <svg class="applemusic-artist-pause-icon" style="display:none;" viewBox="0 0 24 24" fill="currentColor"><rect x="6.25" y="4.5" width="4.5" height="15" rx="1"/><rect x="13.25" y="4.5" width="4.5" height="15" rx="1"/></svg>
                    </div>

                    <div class="applemusic-glass-btn applemusic-circle applemusic-star-btn" onclick="applemusicToggleArtistStar(this)">
                        <!-- 加上 style="fill: none !important;" 抵消 CSS 的强制实心 -->
                        <svg class="applemusic-star-outline" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-linejoin="round" stroke-linecap="round" stroke-width="2.8" style="fill: none !important;"><path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/></svg>
                        <svg class="applemusic-star-filled" style="display:none;" viewBox="0 0 24 24" fill="currentColor"><path d="M11.1 2.41c.31-.8 1.49-.8 1.8 0l2.2 5.67a1 1 0 00.83.6l6.05.46c.85.06 1.2 1.12.55 1.68l-4.64 3.97a1 1 0 00-.32 1l1.38 5.9c.2.85-.68 1.49-1.4 1.05l-5.18-3.15a1 1 0 00-1.04 0l-5.18 3.15c-.72.44-1.6-.2-1.4-1.05l1.38-5.9a1 1 0 00-.32-1L1.17 10.82c-.65-.56-.3-1.62.55-1.68l6.05-.46a1 1 0 00.83-.6l2.2-5.67z"/></svg>
                    </div>
                </div>
            </div>

            <!-- 最新发布 -->
            <div class="applemusic-latest-release" onclick="applemusicPlayArtistHotSong()" style="cursor: pointer;" title="播放热门单曲">
                <img src="" id="applemusic-artist-page-cover" class="applemusic-release-cover" alt="cover">
                <div class="applemusic-release-info">
                    <div class="applemusic-release-date">热门单曲</div>
                    <div class="applemusic-release-title" id="applemusic-artist-page-hot">暂无数据</div>
                    <div class="applemusic-release-count">网易云音乐</div>
                </div>
                <!-- 删除了下载按钮 -->
            </div>

            <!-- 歌曲排行 -->
            <div class="applemusic-top-songs">
                <div class="applemusic-section-title">
                    歌曲排行
                    <svg viewBox="0 0 24 24"><path d="M8.59 16.59L13.17 12 8.59 7.41 10 6l6 6-6 6-1.41-1.41z"/></svg>
                </div>
                <div id="applemusic-artist-top-songs-list">
                    <!-- 动态渲染歌手热门歌曲 -->
                </div>
            </div>

            <!-- 歌手页专属底部悬浮栏 (三段式) -->
            <div class="applemusic-artist-bottom-container">
                <!-- 左侧 Home -->
                <div class="applemusic-artist-bottom-btn" onclick="applemusicSwitchView('home')">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M12.71 2.29a.996.996 0 0 0-1.41 0l-8.01 8A1 1 0 0 0 3 11v9c0 1.1.9 2 2 2h3c.55 0 1-.45 1-1v-7h6v7c0 .55.45 1 1 1h3c1.1 0 2-.9 2-2v-9c0-.27-.11-.52-.29-.71z"></path></svg>
                </div>

                <!-- 中间 播放器胶囊 -->
                <div class="applemusic-artist-bottom-player-pill" onclick="applemusicOpenPlayer()">
                    <div class="applemusic-artist-bottom-cover" id="applemusic-artist-bottom-cover">
                        <svg viewBox="0 0 24 24"><path d="M12 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h4V3h-6z"/></svg>
                    </div>
                    <div class="applemusic-artist-bottom-info">
                        <div class="applemusic-artist-bottom-title" id="applemusic-artist-bottom-title">暂无播放</div>
                        <div class="applemusic-artist-bottom-artist" id="applemusic-artist-bottom-artist"></div>
                    </div>
                    <div class="applemusic-artist-bottom-controls">
                        <div class="applemusic-ctrl-playpause" onclick="event.stopPropagation(); applemusicTogglePlayPause(this)">
                            <svg class="applemusic-icon-pause" viewBox="0 0 24 24" fill="currentColor" style="display:none;"><rect x="6.25" y="4.5" width="4.5" height="15" rx="1"/><rect x="13.25" y="4.5" width="4.5" height="15" rx="1"/></svg>
                            <svg class="applemusic-icon-play" viewBox="0 0 24 24" fill="currentColor"><path d="M6.51 18.87c.15.09.32.13.49.13s.36-.05.51-.14l10-6c.3-.18.49-.51.49-.86s-.18-.68-.49-.86l-10-6a.99.99 0 0 0-1.01-.01c-.31.18-.51.51-.51.87v12c0 .36.19.69.51.87Z"></path></svg>
                        </div>
                    </div>
                </div>

                <!-- 右侧 Search -->
                <div class="applemusic-artist-bottom-btn" onclick="applemusicSwitchView('search')">
                    <svg viewBox="0 0 24 24"><path d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"/></svg>
                </div>
            </div>
        </div>

        <!-- ================= 底部悬浮 UI (纯净透明白液态玻璃) ================= -->
        <div class="applemusic-floating-ui">

            <!-- 迷你播放器 (点击打开全屏播放器) -->
            <div class="applemusic-mini-player applemusic-liquid-glass" onclick="applemusicOpenPlayer()">
                <div class="applemusic-player-cover-empty" id="applemusic-mini-cover">
                    <svg viewBox="0 0 24 24"><path d="M12 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h4V3h-6z"/></svg>
                </div>
                <div class="applemusic-player-info">
                    <div class="applemusic-player-title" id="applemusic-mini-title">暂无播放</div>
                </div>
                <div class="applemusic-player-controls">
                    <div class="applemusic-ctrl-playpause" onclick="event.stopPropagation(); applemusicTogglePlayPause(this)">
                        <svg class="applemusic-icon-pause" viewBox="0 0 24 24" fill="currentColor">
                            <rect x="6.25" y="4.5" width="4.5" height="15" rx="1"/>
                            <rect x="13.25" y="4.5" width="4.5" height="15" rx="1"/>
                        </svg>
                        <svg class="applemusic-icon-play" style="display:none;" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M6.51 18.87c.15.09.32.13.49.13s.36-.05.51-.14l10-6c.3-.18.49-.51.49-.86s-.18-.68-.49-.86l-10-6a.99.99 0 0 0-1.01-.01c-.31.18-.51.51-.51.87v12c0 .36.19.69.51.87Z"></path>
                        </svg>
                    </div>
                    <svg class="applemusic-ctrl-next" onclick="event.stopPropagation(); applemusicPlayNextSong();" viewBox="0 0 24 24" fill="currentColor" style="cursor: pointer;">
                        <path d="M13.3 11.14a1 1 0 0 1 0 1.72l-6.6 4.29A1 1 0 0 1 5.2 16.3V7.7a1 1 0 0 1 1.5-.85l6.6 4.29z"/>
                        <path d="M21.3 11.14a1 1 0 0 1 0 1.72l-6.6 4.29A1 1 0 0 1 13.2 16.3V7.7a1 1 0 0 1 1.5-.85l6.6 4.29z"/>
                    </svg>
                </div>
            </div>

            <!-- 底部导航栏 (4个SVG) -->
            <div class="applemusic-nav-bar applemusic-liquid-glass">

                <!-- Home -->
                <div class="applemusic-nav-item applemusic-nav-active" onclick="applemusicSwitchView('home', this)">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                        <path d="M12.71 2.29a.996.996 0 0 0-1.41 0l-8.01 8A1 1 0 0 0 3 11v9c0 1.1.9 2 2 2h3c.55 0 1-.45 1-1v-7h6v7c0 .55.45 1 1 1h3c1.1 0 2-.9 2-2v-9c0-.27-.11-.52-.29-.71z"></path>
                    </svg>
                    <span>Home</span>
                </div>

                <!-- Library -->
                <div class="applemusic-nav-item" onclick="applemusicSwitchView('library', this)">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                        <path d="M6 2h12v2H6zm13 4H5c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V8c0-1.1-.9-2-2-2m-2.5 11.25c0 .96-.78 1.75-1.75 1.75S13 18.21 13 17.25s.78-1.75 1.75-1.75c.27 0 .52.07.75.18v-4.75l-5-.83v6.16c0 .96-.78 1.75-1.75 1.75S7 17.22 7 16.26s.78-1.75 1.75-1.75c.27 0 .52.07.75.18V9.51c0-.15.06-.29.18-.38s.26-.13.41-.11l6 1c.24.04.42.25.42.49v6.75Z"></path>
                    </svg>
                    <span>Library</span>
                </div>

                <!-- Search -->
                <div class="applemusic-nav-item" onclick="applemusicSwitchView('search', this)">
                    <svg viewBox="0 0 24 24">
                        <path d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"/>
                    </svg>
                    <span>Search</span>
                </div>

            </div>
        </div>

        <!-- ================= 创建歌单弹窗 ================= -->
        <div id="applemusic-modal-create-playlist" class="applemusic-modal-overlay" onclick="applemusicCloseCreatePlaylistModal()">
            <div class="applemusic-modal-content" onclick="event.stopPropagation()">
                <div class="applemusic-modal-header" style="justify-content: center; padding: 6px 0 10px;">
                    <div class="applemusic-modal-title" style="font-size: 17px; font-weight: 700; color: #1c1c1e;">新建播放列表</div>
                </div>
                <div class="applemusic-modal-body" style="padding-top: 6px;">
                    <div class="applemusic-cover-upload-area" style="width: 140px; height: 140px; margin-bottom: 16px;" onclick="applemusicTriggerCoverUpload(event)">
                        <img id="applemusic-new-playlist-cover" src="">
                        <div class="applemusic-camera-icon-wrapper" id="applemusic-camera-icon-wrapper" style="width: 48px; height: 48px;">
                            <svg viewBox="0 0 24 24" style="width: 24px; height: 24px;"><path d="M4 4h3l2-2h6l2 2h3c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2zm8 3c-2.76 0-5 2.24-5 5s2.24 5 5 5 5-2.24 5-5-2.24-5-5-5zm0 8c-1.65 0-3-1.35-3-3s1.35-3 3-3 3 1.35 3 3-1.35 3-3 3z"/></svg>
                        </div>
                    </div>
                    <input type="file" id="applemusic-cover-file-input" accept="image/*" style="display:none;" onchange="applemusicHandleCoverFile(event)">
                    <div style="width: 100%; display: flex; justify-content: center; margin-top: 6px;">
                        <input type="text" id="applemusic-new-playlist-title" placeholder="播放列表标题" style="width: 100%; max-width: 260px; border: none; border-radius: 12px; padding: 9px 14px; font-size: 15px; font-weight: 600; color: #1c1c1e; background: #f2f2f7; outline: none; text-align: center; box-sizing: border-box;" oninput="applemusicCheckPlaylistTitle()">
                    </div>
                    <!-- 底部左侧取消、右侧确认按钮 -->
                    <div style="display: flex; gap: 12px; width: 100%; max-width: 260px; margin: 18px auto 0;">
                        <div onclick="applemusicCloseCreatePlaylistModal()" style="flex: 1; height: 42px; border-radius: 21px; background: #f2f2f7; color: #1c1c1e; font-size: 15px; font-weight: 600; display: flex; align-items: center; justify-content: center; cursor: pointer;">取消</div>
                        <div id="applemusic-btn-submit-playlist" onclick="applemusicSubmitCreatePlaylist()" style="flex: 1; height: 42px; border-radius: 21px; background: #fa243c; color: #ffffff; font-size: 15px; font-weight: 700; display: flex; align-items: center; justify-content: center; cursor: pointer; opacity: 0.35; pointer-events: none; transition: opacity 0.2s;">确认</div>
                    </div>
                </div>
            </div>
        </div>

        <!-- Apple Music 歌单封面上传菜单 -->
        <div class="icon-menu-overlay" id="applemusicCoverMenuOverlay" onclick="applemusicCloseCoverMenu()" style="z-index: 100000;">
            <div class="icon-menu" id="applemusicCoverMenu" onclick="event.stopPropagation()">
                <div class="icon-menu-item" onclick="document.getElementById('applemusic-cover-file-input').click(); applemusicCloseCoverMenu();">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 16V6a2 2 0 0 1 2-2h10"></path><rect x="8" y="8" width="14" height="14" rx="2" ry="2"></rect><circle cx="13.5" cy="13.5" r="1.5"></circle><path d="M8 18l4-4 2 2 3-3 5 5"></path></svg>
                    <span>照片图库</span>
                </div>
                <div class="icon-menu-item" onclick="applemusicOpenCoverUrlModal()">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"></path><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"></path></svg>
                    <span>使用 URL</span>
                </div>
            </div>
        </div>

        <!-- 添加至歌单抽屉 -->
        <div class="applemusic-playlist-drawer-overlay" id="applemusicPlaylistDrawerOverlay" onclick="applemusicClosePlaylistDrawer()">
            <div class="applemusic-playlist-drawer" onclick="event.stopPropagation()">
                <div class="applemusic-drawer-handle-bar"></div>
                <div class="applemusic-drawer-header">
                    <div class="applemusic-drawer-title" id="applemusic-drawer-main-title">添加到播放列表</div>
                    <div class="applemusic-drawer-btn cancel" onclick="applemusicClosePlaylistDrawer()">取消</div>
                </div>
                <div class="applemusic-drawer-list" id="applemusic-drawer-playlist-container">
                    <!-- 动态渲染歌单列表 -->
                </div>
                <div class="applemusic-drawer-bottom-bar">
                    <button class="applemusic-drawer-bottom-btn" id="applemusic-drawer-confirm-btn" onclick="applemusicExecuteAddToPlaylist()">完成添加</button>
                </div>
            </div>
        </div>

        <!-- ================= 编辑歌单抽屉 ================= -->
        <div id="applemusic-modal-edit-playlist" class="applemusic-modal-overlay" onclick="applemusicCloseEditPlaylistModal()">
            <div class="applemusic-modal-content" style="height: 90vh; position: relative; display: flex; flex-direction: column; overflow: hidden;" onclick="event.stopPropagation()">
                <div class="applemusic-modal-header" style="border-bottom: none; padding-bottom: 10px; flex-shrink: 0;">
                    <div class="applemusic-modal-btn" onclick="applemusicCloseEditPlaylistModal()" style="width: 32px; height: 32px; border-radius: 50%; border: 1px solid rgba(0,0,0,0.1); display: flex; align-items: center; justify-content: center; color: #000; background: rgba(255, 255, 255, 0.75); backdrop-filter: blur(20px); -webkit-backdrop-filter: blur(20px);">
                        <svg viewBox="0 0 24 24" width="20" height="20" stroke="currentColor" stroke-width="2" fill="none"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                    </div>
                    <div class="applemusic-modal-title">编辑播放清单</div>
                    <div class="applemusic-modal-btn applemusic-create applemusic-active" onclick="applemusicSaveEditedPlaylist()" style="width: 32px; height: 32px; border-radius: 50%; background: #fa243c; display: flex; align-items: center; justify-content: center; color: #fff;">
                        <svg viewBox="0 0 24 24" width="20" height="20" stroke="currentColor" stroke-width="3" fill="none" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
                    </div>
                </div>
                <div class="applemusic-modal-body" style="padding-top: 10px; overflow-y: auto; overflow-x: hidden; flex: 1; min-height: 0; display: block; width: 100%;">
                    <div style="display: flex; justify-content: center; margin-bottom: 20px;">
                        <div class="applemusic-cover-upload-area" style="width: 180px; height: 180px; margin-bottom: 0; border-radius: 12px; box-shadow: 0 4px 15px rgba(0,0,0,0.05);" onclick="applemusicTriggerEditCoverUpload(event)">
                            <img id="applemusic-edit-playlist-cover" src="" style="display: block;">
                            <div class="applemusic-camera-icon-wrapper" style="width: 48px; height: 48px; position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%);">
                                <svg viewBox="0 0 24 24" style="width: 24px; height: 24px;"><path d="M4 4h3l2-2h6l2 2h3c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2zm8 3c-2.76 0-5 2.24-5 5s2.24 5 5 5 5-2.24 5-5-2.24-5-5-5zm0 8c-1.65 0-3-1.35-3-3s1.35-3 3-3 3 1.35 3 3-1.35 3-3 3z"/></svg>
                            </div>
                        </div>
                    </div>
                    <div style="display: flex; justify-content: center; margin-bottom: 20px; padding: 0 20px;">
                        <input type="text" id="applemusic-edit-playlist-title" style="width: 80%; max-width: 260px; border: none; border-bottom: 1px solid rgba(0, 0, 0, 0.15); border-radius: 0; padding: 6px 0 8px; font-size: 16px; font-weight: 600; color: #1c1c1e; background: transparent; outline: none; text-align: center; box-sizing: border-box;" placeholder="歌单标题">
                    </div>
                    <div id="applemusic-edit-song-list" style="padding: 0 20px; padding-bottom: 80px; position: relative;">
                        <!-- 动态渲染歌曲列表 -->
                    </div>
                </div>
                <!-- 悬浮删除按钮 -->
                <div id="applemusic-edit-delete-btn" style="display: flex; position: absolute; bottom: 40px; left: 20px; width: 50px; height: 50px; border-radius: 50%; background: #fff; box-shadow: 0 4px 15px rgba(0,0,0,0.15); align-items: center; justify-content: center; cursor: pointer; color: #ff3b30; opacity: 0.5; pointer-events: none; transition: opacity 0.2s; z-index: 9999;" onclick="if(confirm('确定要删除选中的歌曲吗？')) applemusicDeleteSelectedSongs()">
                    <svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path><line x1="10" y1="11" x2="10" y2="17"></line><line x1="14" y1="11" x2="14" y2="17"></line></svg>
                </div>
            </div>
        </div>

        <!-- ================= 全局编辑歌单抽屉 ================= -->
        <div id="applemusic-modal-global-edit-playlist" class="applemusic-modal-overlay" onclick="applemusicCloseGlobalEditPlaylistModal()">
            <div class="applemusic-modal-content" style="height: 90vh; position: relative; display: flex; flex-direction: column; overflow: hidden;" onclick="event.stopPropagation()">
                <div class="applemusic-drawer-handle-bar"></div>
                <div class="applemusic-modal-header" style="border-bottom: none; padding-bottom: 10px; flex-shrink: 0;">
                    <div class="applemusic-modal-btn" onclick="applemusicCloseGlobalEditPlaylistModal()" style="width: 32px; height: 32px; border-radius: 50%; border: 1px solid rgba(0,0,0,0.1); display: flex; align-items: center; justify-content: center; color: #000; background: rgba(255, 255, 255, 0.75); backdrop-filter: blur(20px); -webkit-backdrop-filter: blur(20px);">
                        <svg viewBox="0 0 24 24" width="20" height="20" stroke="currentColor" stroke-width="2" fill="none"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                    </div>
                    <div class="applemusic-modal-title">编辑歌单</div>
                    <div class="applemusic-modal-btn applemusic-create applemusic-active" onclick="applemusicSaveGlobalEditedPlaylists()" style="width: 32px; height: 32px; border-radius: 50%; background: #fa243c; display: flex; align-items: center; justify-content: center; color: #fff;">
                        <svg viewBox="0 0 24 24" width="20" height="20" stroke="currentColor" stroke-width="3" fill="none" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
                    </div>
                </div>
                <div class="applemusic-modal-body" style="padding-top: 0; overflow-y: auto; overflow-x: hidden; flex: 1; min-height: 0; display: block; width: 100%;">
                    <!-- 顶部歌单轮播区 -->
                    <div style="padding-top: 10px; background: #ffffff; position: sticky; top: 0; z-index: 10; width: 100%;">
                        <div class="applemusic-local-carousel-wrapper">
                            <div id="applemusic-global-edit-carousel" class="applemusic-local-carousel">
                                <!-- 动态渲染歌单卡片 -->
                            </div>
                        </div>
                        <div id="applemusic-global-edit-playlist-name" class="applemusic-local-playlist-name">心动歌曲</div>
                        <!-- 滑动指示器 -->
                        <div id="applemusic-global-edit-carousel-dots" class="applemusic-carousel-dots"></div>
                    </div>

                    <div id="applemusic-global-edit-song-list" style="padding: 0 20px; padding-bottom: 80px; position: relative;">
                        <!-- 动态渲染歌曲列表 -->
                    </div>
                </div>
                <!-- 悬浮删除按钮 -->
                <div id="applemusic-global-edit-delete-btn" style="display: flex; position: absolute; bottom: 40px; left: 20px; width: 50px; height: 50px; border-radius: 50%; background: #fff; box-shadow: 0 4px 15px rgba(0,0,0,0.15); align-items: center; justify-content: center; cursor: pointer; color: #ff3b30; opacity: 0.5; pointer-events: none; transition: opacity 0.2s; z-index: 9999;" onclick="if(confirm('确定要删除选中的歌曲吗？')) applemusicGlobalDeleteSelectedSongs()">
                    <svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path><line x1="10" y1="11" x2="10" y2="17"></line><line x1="14" y1="11" x2="14" y2="17"></line></svg>
                </div>
            </div>
        </div>

        <!-- ================= 真实音频播放器 ================= -->
        <audio id="applemusic-audio-player" style="display: none;"></audio>

        <!-- ================= 全屏音乐播放页面 ================= -->
        <div class="applemusic-full-player" id="applemusic-full-player">
            <!-- 背景模糊层 -->
            <div class="applemusic-player-bg"></div>
            <div class="applemusic-player-bg-overlay"></div>

            <div class="applemusic-player-content" style="height: 100%; overflow: hidden; display: flex; flex-direction: column;">
                <!-- 顶部下拉条 -->
                <div class="applemusic-player-drag-handle" onclick="applemusicClosePlayer()">
                    <div class="applemusic-drag-bar"></div>
                </div>

                <!-- 主播放视图 -->
                <div id="applemusic-player-main-view" style="flex: 1; min-height: 0; display: flex; flex-direction: column; justify-content: center;">
                    <!-- 专辑封面 (点击切换歌词) -->
                    <div class="applemusic-player-cover-large" onclick="applemusicToggleLyricsView()" style="width: 100%; aspect-ratio: 1/1; border-radius: 12px; overflow: hidden; margin-bottom: clamp(12px, 2.5vh, 25px); flex-shrink: 1; min-height: 0; display: flex; justify-content: center; align-items: center;">
                        <img src="" alt="cover" id="applemusic-large-cover-img" style="background: #333; width: 100%; height: 100%; object-fit: cover;">
                    </div>

                    <!-- 歌曲信息 -->
                    <div class="applemusic-player-info-large">
                        <div class="applemusic-player-text-large">
                            <div class="applemusic-player-title-large" id="applemusic-large-title">暂无播放</div>
                            <div class="applemusic-player-artist-large" id="applemusic-large-artist">-</div>
                        </div>
                        <div class="applemusic-player-actions-large">
                            <!-- 收藏按钮 (点击切换状态) -->
                            <div class="applemusic-action-btn applemusic-star-btn" onclick="applemusicToggleStar(this)">
                                <!-- 空心微圆角五角星 (真正空心，加粗描边) -->
                                <svg class="applemusic-star-outline" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-linejoin="round" stroke-linecap="round">
                                    <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/>
                                </svg>
                                <!-- 实心微圆角五角星 -->
                                <svg class="applemusic-star-filled" style="display:none;" viewBox="0 0 24 24" fill="currentColor">
                                    <path d="M11.1 2.41c.31-.8 1.49-.8 1.8 0l2.2 5.67a1 1 0 00.83.6l6.05.46c.85.06 1.2 1.12.55 1.68l-4.64 3.97a1 1 0 00-.32 1l1.38 5.9c.2.85-.68 1.49-1.4 1.05l-5.18-3.15a1 1 0 00-1.04 0l-5.18 3.15c-.72.44-1.6-.2-1.4-1.05l1.38-5.9a1 1 0 00-.32-1L1.17 10.82c-.65-.56-.3-1.62.55-1.68l6.05-.46a1 1 0 00.83-.6l2.2-5.67z"/>
                                </svg>
                            </div>
                            <div class="applemusic-action-btn" onclick="applemusicOpenMoreMenu(event)">
                                <svg viewBox="0 0 24 24"><path d="M6 10c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm12 0c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm-6 0c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z"/></svg>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- 歌词视图 (点击任意歌词区域恢复音乐唱片) -->
                <div id="applemusic-player-lyrics-view" onclick="applemusicToggleLyricsView()" style="cursor: pointer;">
                    <!-- 头部区域阻止点击冒泡，防止点击按钮时切回封面 -->
                    <div class="applemusic-lyrics-header" onclick="event.stopPropagation();" style="cursor: default;">
                        <img src="" class="applemusic-lyrics-cover" id="applemusic-lyrics-cover-img" alt="cover">
                        <div class="applemusic-lyrics-info">
                            <div class="applemusic-lyrics-title" id="applemusic-lyrics-title">暂无播放</div>
                            <div class="applemusic-lyrics-artist" id="applemusic-lyrics-artist">-</div>
                        </div>

                        <!-- 注入与主封面完全一致的收藏和三个点 SVG -->
                        <div class="applemusic-lyrics-actions" style="display: flex; gap: 12px;">
                            <!-- 收藏按钮 (点击切换状态) -->
                            <div class="applemusic-action-btn applemusic-star-btn" onclick="applemusicToggleStar(this)">
                                <!-- 空心微圆角五角星 -->
                                <svg class="applemusic-star-outline" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-linejoin="round" stroke-linecap="round">
                                    <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/>
                                </svg>
                                <!-- 实心微圆角五角星 -->
                                <svg class="applemusic-star-filled" style="display:none;" viewBox="0 0 24 24" fill="currentColor">
                                    <path d="M11.1 2.41c.31-.8 1.49-.8 1.8 0l2.2 5.67a1 1 0 00.83.6l6.05.46c.85.06 1.2 1.12.55 1.68l-4.64 3.97a1 1 0 00-.32 1l1.38 5.9c.2.85-.68 1.49-1.4 1.05l-5.18-3.15a1 1 0 00-1.04 0l-5.18 3.15c-.72.44-1.6-.2-1.4-1.05l1.38-5.9a1 1 0 00-.32-1L1.17 10.82c-.65-.56-.3-1.62.55-1.68l6.05-.46a1 1 0 00.83-.6l2.2-5.67z"/>
                                </svg>
                            </div>
                            <!-- 三个点按钮 -->
                            <div class="applemusic-action-btn" onclick="applemusicOpenMoreMenu(event)">
                                <svg viewBox="0 0 24 24"><path d="M6 10c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm12 0c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm-6 0c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z"/></svg>
                            </div>
                        </div>
                    </div>

                    <div class="applemusic-lyrics-container" id="applemusic-lyrics-container">
                        <!-- 动态渲染歌词 -->
                    </div>
                </div>

                <!-- 播放列表视图 -->
                <div id="applemusic-player-list-view">
                    <!-- 当前播放头部 -->
                    <div class="applemusic-current-playing-header">
                        <img src="" id="applemusic-list-current-cover" class="applemusic-current-cover" alt="cover" style="background: #333;">
                        <div class="applemusic-current-info">
                            <div class="applemusic-current-title" id="applemusic-list-current-title">暂无播放</div>
                            <div class="applemusic-current-artist" id="applemusic-list-current-artist">-</div>
                        </div>
                        <div class="applemusic-current-actions">
                            <!-- 注入真实收藏逻辑，添加 star-btn 类名以便全局同步 -->
                            <div class="applemusic-action-btn applemusic-star-btn" onclick="applemusicToggleStar(this)">
                                <svg class="applemusic-star-outline" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-linejoin="round" stroke-linecap="round">
                                    <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/>
                                </svg>
                                <svg class="applemusic-star-filled" style="display:none;" viewBox="0 0 24 24" fill="currentColor">
                                    <path d="M11.1 2.41c.31-.8 1.49-.8 1.8 0l2.2 5.67a1 1 0 00.83.6l6.05.46c.85.06 1.2 1.12.55 1.68l-4.64 3.97a1 1 0 00-.32 1l1.38 5.9c.2.85-.68 1.49-1.4 1.05l-5.18-3.15a1 1 0 00-1.04 0l-5.18 3.15c-.72.44-1.6-.2-1.4-1.05l1.38-5.9a1 1 0 00-.32-1L1.17 10.82c-.65-.56-.3-1.62.55-1.68l6.05-.46a1 1 0 00.83-.6l2.2-5.67z"/>
                                </svg>
                            </div>
                            <div class="applemusic-action-btn" onclick="applemusicOpenMoreMenu(event)">
                                <svg viewBox="0 0 24 24"><path d="M6 10c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm12 0c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm-6 0c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z"/></svg>
                            </div>
                        </div>
                    </div>

                    <!-- 待播清单标题栏 -->
                    <div class="applemusic-up-next-header">
                        <div class="applemusic-up-next-title-area">
                            <div class="applemusic-up-next-title">待播清单</div>
                            <div class="applemusic-up-next-subtitle" id="applemusic-up-next-subtitle">来自未知</div>
                        </div>
                        <div class="applemusic-up-next-controls">
                            <!-- 1. 随机播放 -->
                            <div class="applemusic-control-pill" id="applemusic-btn-shuffle" onclick="applemusicToggleUpNextMode('shuffle')">
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" id="Shuffle-Fill--Streamline-Mingcute-Fill" height="18" width="18">
                                  <g fill="none" fill-rule="nonzero">
                                    <path d="M0 0v16h16V0H0Zm7.604666666666667 15.505333333333333 0.007333333333333332 0.0013333333333333333 0.047333333333333324 0.023333333333333334 0.013333333333333332 0.0026666666666666666 0.009333333333333332 -0.0026666666666666666 0.047333333333333324 -0.023999999999999997c0.006666666666666666 -0.002 0.012666666666666666 0 0.016 0.004l0.0026666666666666666 0.006666666666666666 0.011333333333333334 0.2853333333333333 -0.003333333333333333 0.013333333333333332 -0.006666666666666666 0.008666666666666666 -0.06933333333333333 0.049333333333333326 -0.009999999999999998 0.0026666666666666666 -0.008 -0.0026666666666666666 -0.06933333333333333 -0.049333333333333326 -0.008 -0.010666666666666666 -0.0026666666666666666 -0.011333333333333334 0.011333333333333334 -0.2846666666666666c0.0013333333333333333 -0.006666666666666666 0.005999999999999999 -0.011333333333333334 0.010666666666666666 -0.011999999999999999Zm-0.17666666666666667 -0.07533333333333334 0.009333333333333332 0.0013333333333333333 0.12266666666666666 0.062 0.006666666666666666 0.006666666666666666 0.002 0.007333333333333332 -0.011999999999999999 0.2866666666666666 -0.003333333333333333 0.008 -0.005333333333333333 0.005333333333333333 -0.134 0.06133333333333333c-0.008 0.0026666666666666666 -0.015333333333333332 0 -0.019333333333333334 -0.005333333333333333l-0.0026666666666666666 -0.009333333333333332 0.02266666666666667 -0.4093333333333333c0.002 -0.008 0.006666666666666666 -0.013333333333333332 0.013333333333333332 -0.014666666666666665Zm0.4766666666666666 0.0013333333333333333a0.015333333333333332 0.015333333333333332 0 0 1 0.018 0.004l0.004 0.009333333333333332 0.02266666666666667 0.4093333333333333c0 0.008 -0.004666666666666666 0.013333333333333332 -0.011333333333333334 0.016l-0.009999999999999998 -0.0013333333333333333 -0.134 -0.062 -0.006666666666666666 -0.005333333333333333 -0.002 -0.007333333333333332 -0.011999999999999999 -0.2866666666666666 0.002 -0.008 0.006666666666666666 -0.006666666666666666 0.12266666666666666 -0.06133333333333333Z" stroke-width="0.6667"></path>
                                    <path fill="currentColor" d="M11.867999999999999 2.122c-0.38799999999999996 -0.2033333333333333 -0.8493333333333333 0.09733333333333333 -0.8866666666666667 0.5766666666666667 -0.007333333333333332 0.08933333333333333 -0.014666666666666665 0.18999999999999997 -0.021333333333333333 0.30133333333333334a3.6666666666666665 3.6666666666666665 0 0 0 -3.2579999999999996 2.0266666666666664L7.333333333333333 5.764l-0.3686666666666667 -0.7373333333333334a3.6666666666666665 3.6666666666666665 0 0 0 -3.28 -2.0266666666666664H2.6666666666666665a1 1 0 1 0 0 2h1.0186666666666666a1.6666666666666665 1.6666666666666665 0 0 1 1.4906666666666668 0.9213333333333332L6.215333333333334 8l-1.04 2.0786666666666664A1.6666666666666665 1.6666666666666665 0 0 1 3.686 11H2.6666666666666665a1 1 0 1 0 0 2h1.0186666666666666a3.6666666666666665 3.6666666666666665 0 0 0 3.28 -2.0266666666666664L7.333333333333333 10.235999999999999l0.3686666666666667 0.7373333333333334a3.6666666666666665 3.6666666666666665 0 0 0 3.2566666666666664 2.0266666666666664c0.008 0.14266666666666666 0.016666666666666666 0.26866666666666666 0.026 0.3766666666666666 0.036 0.44733333333333336 0.456 0.704 0.84 0.5033333333333333 0.2533333333333333 -0.132 0.622 -0.3373333333333333 1.0606666666666666 -0.6226666666666667 0.44 -0.2853333333333333 0.782 -0.5406666666666666 1.0099999999999998 -0.722 0.3466666666666667 -0.27399999999999997 0.35933333333333334 -0.8106666666666666 0.03333333333333333 -1.0706666666666667a13.174 13.174 0 0 0 -1.0219999999999998 -0.7333333333333334 12.894 12.894 0 0 0 -1.0386666666666666 -0.6093333333333333c-0.38799999999999996 -0.2033333333333333 -0.8493333333333333 0.09733333333333333 -0.8866666666666667 0.5766666666666667 -0.007333333333333332 0.08933333333333333 -0.014666666666666665 0.18999999999999997 -0.021333333333333333 0.30133333333333334a1.6666666666666665 1.6666666666666665 0 0 1 -1.4693333333333334 -0.9213333333333332L8.451333333333332 8l1.04 -2.0786666666666664a1.6666666666666665 1.6666666666666665 0 0 1 1.4666666666666668 -0.9213333333333332c0.008666666666666666 0.14266666666666666 0.017333333333333333 0.26866666666666666 0.026666666666666665 0.3766666666666666 0.036 0.44733333333333336 0.456 0.704 0.84 0.5033333333333333a13 13 0 0 0 1.0606666666666666 -0.6226666666666667c0.44 -0.2853333333333333 0.782 -0.5413333333333333 1.0099999999999998 -0.722 0.3466666666666667 -0.27399999999999997 0.35933333333333334 -0.8106666666666666 0.03333333333333333 -1.0706666666666667a13.189333333333332 13.189333333333332 0 0 0 -1.0219999999999998 -0.7333333333333334 12.893333333333333 12.893333333333333 0 0 0 -1.0386666666666666 -0.6093333333333333Z" stroke-width="0.6667"></path>
                                  </g>
                                </svg>
                            </div>
                            <!-- 2. 列表循环 -->
                            <div class="applemusic-control-pill applemusic-active" id="applemusic-btn-repeat" onclick="applemusicToggleUpNextMode('repeat')">
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" id="Repeat-Bold--Streamline-Phosphor" height="18" width="18">
                                  <path d="M0.1606875 8.000725c0.0032 -3.04538125 2.471175 -5.51335 5.51655 -5.51655625h7.1860375l-0.2555 -0.254775c-0.47495625 -0.47495625 -0.25765 -1.28595 0.39115 -1.4598 0.30110625 -0.08068125 0.6223875 0.00540625 0.8428125 0.22583125L15.58380625 2.7375c0.3415875 0.3404 0.3415875 0.8935625 0 1.2339625l-1.74206875 1.74206875c-0.47495 0.47495625 -1.28595 0.25765 -1.45979375 -0.39115 -0.08068125 -0.30110625 0.0054 -0.6223875 0.22583125 -0.8428125l0.2555 -0.253325H5.6772375c-2.08359375 0.0024 -3.77208125 1.6908875 -3.77448125 3.77448125 -0.00056875 0.670525 -0.7267875 1.0889875 -1.30719375 0.75323125 -0.26890625 -0.15555625 -0.4346125 -0.44256875 -0.434875 -0.75323125Zm14.8075875 -0.8710375c-0.48106875 -0.00001875 -0.87103125 0.3899625 -0.87103125 0.8710375 -0.0024 2.08359375 -1.69089375 3.77208125 -3.7744875 3.7744875H3.136725l0.2555 -0.25478125c0.47495625 -0.47495 0.25765 -1.28595 -0.39115 -1.45979375 -0.30110625 -0.0806875 -0.6223875 0.0054 -0.8428125 0.22583125L0.4161875 12.0285375c-0.3415875 0.3404 -0.3415875 0.8935625 0 1.2339625l1.742075 1.74206875c0.47495 0.47495625 1.28595 0.25765 1.45979375 -0.39115 0.08068125 -0.30110625 -0.00540625 -0.6223875 -0.22583125 -0.8428125l-0.2555 -0.253325h7.18603125c3.04538125 -0.00320625 5.51335625 -2.471175 5.51655625 -5.51655625 0 -0.48104375 -0.3899875 -0.8710125 -0.8710375 -0.8710375Z" stroke-width="0.0625"></path>
                                </svg>
                            </div>
                            <!-- 3. 单曲循环 -->
                            <div class="applemusic-control-pill" id="applemusic-btn-repeat-one" onclick="applemusicToggleUpNextMode('repeat-one')">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 14" id="Arrow-Infinite-Loop--Streamline-Core" height="18" width="18">
                                  <g id="arrow-infinite-loop--arrow-diagram-loop-infinity-repeat">
                                    <path id="Union" fill="currentColor" fill-rule="evenodd" d="M11.1089 3.15527c0 -0.30334 -0.1828 -0.57682 -0.463 -0.69291 -0.2803 -0.11608 -0.6029 -0.05192 -0.81735 0.16258L7.91542 4.53807c-0.13026 0.12728 -0.21435 0.3016 -0.22479 0.4955 -0.00211 0.03829 -0.00129 0.07684 0.00253 0.1153 0.01209 0.12286 0.05381 0.23701 0.11794 0.33521 0.11285 0.17283 0.29509 0.29625 0.50717 0.33072 0.03966 0.00649 0.08018 0.00984 0.12124 0.00984h1.91609l0.0177 0.00042c0.0189 0.0005 0.0473 0.00136 0.0828 0.00279 0.0714 0.00287 0.1697 0.00794 0.2773 0.01662 0.243 0.01962 0.4375 0.05103 0.5162 0.07927 0.2621 0.09417 0.5001 0.24513 0.6971 0.44207 0.1969 0.19695 0.3479 0.435 0.4421 0.69712 0.0941 0.26212 0.1292 0.54182 0.1026 0.81907 -0.0046 0.04763 -0.0046 0.09559 0 0.14321 0.0266 0.27725 -0.0085 0.55695 -0.1026 0.81907 -0.0942 0.26212 -0.2452 0.50018 -0.4421 0.69712 -0.197 0.19694 -0.435 0.3479 -0.6971 0.44207 -0.2622 0.09413 -0.5419 0.12923 -0.8191 0.10263 -0.0238 -0.0023 -0.0477 -0.0034 -0.0716 -0.0034 -0.36949 0 -0.77391 -0.1991 -1.26526 -0.68372 -0.49086 -0.48414 -0.9614 -1.14446 -1.48162 -1.87889l-0.0225 -0.03176 0 -0.00001c-0.49343 -0.69665 -1.03512 -1.46146 -1.62984 -2.04804 -0.59551 -0.58734 -1.34877 -1.10227 -2.28188 -1.11546 -0.48594 -0.04155 -0.97526 0.02227 -1.4345 0.18725 -0.47025 0.16894 -0.89733 0.43976 -1.250646 0.79308 -0.353321 0.35332 -0.624145 0.7804 -0.793079 1.25065 -0.1608306 0.44768 -0.2255234 0.92396 -0.19019454 1.39781 -0.03532886 0.47385 0.02936394 0.95012 0.19019454 1.39781 0.168934 0.47025 0.439758 0.89728 0.793079 1.25068 0.353316 0.3533 0.780396 0.6241 1.250646 0.793 0.46116 0.1657 0.95266 0.2294 1.4406 0.1868 0.69267 -0.0191 1.35814 -0.2755 1.88476 -0.7268 0.31452 -0.2695 0.351 -0.743 0.08147 -1.05749 -0.26952 -0.31452 -0.74299 -0.351 -1.05752 -0.08147 -0.2692 0.23068 -0.61038 0.36036 -0.96484 0.36666 -0.01946 0.0003 -0.0389 0.0014 -0.05827 0.0033 -0.27725 0.0266 -0.55695 -0.0085 -0.81907 -0.10263 -0.26212 -0.09417 -0.50017 -0.24513 -0.69712 -0.44207 -0.19694 -0.19694 -0.3479 -0.435 -0.44207 -0.69712 -0.09416 -0.26212 -0.1292 -0.54182 -0.10261 -0.81907 0.00457 -0.04762 0.00457 -0.09558 0 -0.14321 -0.02659 -0.27725 0.00845 -0.55695 0.10261 -0.81907 0.09417 -0.26212 0.24513 -0.50017 0.44207 -0.69712 0.19695 -0.19694 0.435 -0.3479 0.69712 -0.44207 0.26212 -0.09416 0.54182 -0.1292 0.81907 -0.10261 0.0238 0.00228 0.0477 0.00343 0.07161 0.00343 0.36948 0 0.7739 0.19905 1.26525 0.68367 0.49086 0.48414 0.9614 1.14446 1.48162 1.87889l0.0225 0.03177c0.49343 0.69665 1.03512 1.46146 1.62984 2.04801 0.59551 0.5874 1.34877 1.1023 2.28188 1.1155 0.4859 0.0415 0.9753 -0.0223 1.4345 -0.1873 0.4703 -0.1689 0.8973 -0.4397 1.2506 -0.793 0.3534 -0.3534 0.6242 -0.78043 0.7931 -1.25068 0.1609 -0.44769 0.2255 -0.92396 0.1902 -1.39781 0.0353 -0.47385 -0.0293 -0.95013 -0.1902 -1.39781 -0.1689 -0.47025 -0.4397 -0.89733 -0.7931 -1.25065 -0.3533 -0.35332 -0.7803 -0.62414 -1.2506 -0.79308 -0.1983 -0.07123 -0.4394 -0.11249 -0.6478 -0.13753V3.15527Z" clip-rule="evenodd" stroke-width="1"></path>
                                  </g>
                                </svg>
                            </div>
                        </div>
                    </div>

                    <!-- 列表内容 -->
                    <div id="applemusic-up-next-container">
                        <!-- 动态渲染真实待播列表 -->
                    </div>
                </div>

                <!-- 进度条 -->
                <div class="applemusic-player-progress">
                    <div class="applemusic-progress-bar" id="applemusic-progress-bar" style="cursor: pointer;">
                        <div class="applemusic-progress-fill" id="applemusic-progress-fill" style="width: 0%;"></div>
                    </div>
                    <div class="applemusic-progress-time">
                        <span id="applemusic-time-current">0:00</span>
                        <span class="applemusic-dolby-icon">无损</span>
                        <span id="applemusic-time-duration">-0:00</span>
                    </div>
                </div>

                <!-- 控制按钮 -->
                <div class="applemusic-player-controls-large">
                    <!-- 上一首 (微圆角双三角形) -->
                    <svg class="applemusic-ctrl-prev" viewBox="0 0 24 24" fill="currentColor" onclick="applemusicPlayPrevSong()" style="cursor: pointer;">
                        <path d="M10.7 11.14a1 1 0 0 0 0 1.72l6.6 4.29A1 1 0 0 0 18.8 16.3V7.7a1 1 0 0 0-1.5-.85l-6.6 4.29z"/>
                        <path d="M2.7 11.14a1 1 0 0 0 0 1.72l6.6 4.29A1 1 0 0 0 10.8 16.3V7.7a1 1 0 0 0-1.5-.85l-6.6 4.29z"/>
                    </svg>

                    <!-- 播放/暂停 (点击切换) -->
                    <div class="applemusic-ctrl-playpause" onclick="applemusicTogglePlayPause(this)">
                        <!-- 暂停 (微圆角双竖线，减短加粗) -->
                        <svg class="applemusic-icon-pause" viewBox="0 0 24 24" fill="currentColor">
                            <rect x="6.25" y="4.5" width="4.5" height="15" rx="1"/>
                            <rect x="13.25" y="4.5" width="4.5" height="15" rx="1"/>
                        </svg>
                        <!-- 播放 (微圆角三角形) -->
                        <svg class="applemusic-icon-play" style="display:none;" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M6.51 18.87c.15.09.32.13.49.13s.36-.05.51-.14l10-6c.3-.18.49-.51.49-.86s-.18-.68-.49-.86l-10-6a.99.99 0 0 0-1.01-.01c-.31.18-.51.51-.51.87v12c0 .36.19.69.51.87Z"></path>
                        </svg>
                    </div>

                    <!-- 下一首 (微圆角双三角形) -->
                    <svg class="applemusic-ctrl-next" viewBox="0 0 24 24" fill="currentColor" onclick="applemusicPlayNextSong()" style="cursor: pointer;">
                        <path d="M13.3 11.14a1 1 0 0 1 0 1.72l-6.6 4.29A1 1 0 0 1 5.2 16.3V7.7a1 1 0 0 1 1.5-.85l6.6 4.29z"/>
                        <path d="M21.3 11.14a1 1 0 0 1 0 1.72l-6.6 4.29A1 1 0 0 1 13.2 16.3V7.7a1 1 0 0 1 1.5-.85l6.6 4.29z"/>
                    </svg>
                </div>

                <!-- 音量 -->
                <div class="applemusic-player-volume">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M17.6787 6.845V17.125C17.6794 17.5102 17.5904 17.8902 17.4187 18.235C17.2508 18.584 16.9916 18.8811 16.6687 19.095C16.3511 19.3143 15.9747 19.4328 15.5887 19.435C15.2039 19.4351 14.8278 19.3202 14.5088 19.105L10.5088 16.475C10.4312 16.4248 10.3411 16.3971 10.2487 16.395H8.41873C8.12829 16.3925 7.84187 16.3269 7.57938 16.2025C7.31688 16.0782 7.08459 15.8982 6.89871 15.675C6.51804 15.2295 6.31199 14.6609 6.31876 14.075V9.89499C6.3126 9.31214 6.51872 8.74698 6.89871 8.30499C7.08742 8.08729 7.32094 7.91291 7.58328 7.79382C7.84563 7.67473 8.13063 7.61373 8.41873 7.61499H10.3087C10.4029 7.61427 10.4943 7.58266 10.5688 7.52499L14.5688 4.89499C14.8943 4.68573 15.2718 4.57146 15.6587 4.565C16.0474 4.57001 16.4262 4.68816 16.7487 4.905C17.0661 5.12239 17.3211 5.41881 17.4887 5.76498C17.6309 6.10658 17.6958 6.4754 17.6787 6.845Z" fill="currentColor"/>
                    </svg>
                    <div class="applemusic-volume-bar" id="applemusic-volume-bar" style="cursor: pointer; touch-action: none;">
                        <div class="applemusic-volume-fill" id="applemusic-volume-fill"></div>
                    </div>
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M13.6507 6.86005V17.14C13.6514 17.5252 13.5624 17.9052 13.3907 18.25C13.2259 18.5981 12.9702 18.8952 12.6507 19.11C12.3281 19.3269 11.9493 19.445 11.5607 19.45C11.1758 19.4502 10.7997 19.3352 10.4806 19.12L6.48065 16.49C6.40304 16.4398 6.31304 16.4122 6.22064 16.41H4.35065C4.0602 16.4076 3.77378 16.3419 3.51129 16.2176C3.2488 16.0933 3.01657 15.9132 2.83069 15.69C2.45237 15.2431 2.2466 14.6755 2.25067 14.09V9.91003C2.24899 9.32796 2.45461 8.76431 2.83069 8.32004C3.01657 8.09685 3.2488 7.91682 3.51129 7.79248C3.77378 7.66814 4.0602 7.60248 4.35065 7.60004H6.25067C6.3477 7.59802 6.44186 7.56665 6.52069 7.51004L10.5207 4.88004C10.8415 4.66857 11.2164 4.55402 11.6006 4.55005C11.9893 4.55506 12.3681 4.6732 12.6907 4.89005C13.008 5.10743 13.263 5.40385 13.4307 5.75003C13.5875 6.09846 13.6628 6.47812 13.6507 6.86005Z" fill="currentColor"/>
                        <path d="M16.2508 16.5394C16.0528 16.5351 15.8636 16.4566 15.7208 16.3194C15.5803 16.1788 15.5015 15.9881 15.5015 15.7894C15.5015 15.5906 15.5803 15.4 15.7208 15.2594C16.1483 14.833 16.4875 14.3265 16.719 13.7688C16.9504 13.2111 17.0696 12.6132 17.0696 12.0094C17.0696 11.4056 16.9504 10.8077 16.719 10.25C16.4875 9.69233 16.1483 9.18578 15.7208 8.75939C15.6471 8.69073 15.588 8.60792 15.547 8.51592C15.506 8.42393 15.4839 8.32464 15.4822 8.22393C15.4804 8.12323 15.499 8.02319 15.5367 7.9298C15.5744 7.83642 15.6306 7.75157 15.7018 7.68035C15.773 7.60913 15.8578 7.553 15.9512 7.51528C16.0446 7.47756 16.1446 7.45903 16.2453 7.46081C16.346 7.46259 16.4453 7.48464 16.5373 7.52563C16.6293 7.56662 16.7122 7.62571 16.7808 7.6994C17.3486 8.26437 17.7992 8.93597 18.1067 9.67562C18.4141 10.4153 18.5724 11.2084 18.5724 12.0094C18.5724 12.8104 18.4141 13.6035 18.1067 14.3432C17.7992 15.0828 17.3486 15.7544 16.7808 16.3194C16.638 16.4566 16.4488 16.5351 16.2508 16.5394Z" fill="currentColor"/>
                        <path d="M18.5007 18.7793C18.4021 18.7804 18.3043 18.7614 18.2132 18.7236C18.1221 18.6858 18.0396 18.6299 17.9707 18.5593C17.8999 18.4904 17.8438 18.408 17.8054 18.3169C17.767 18.2259 17.7472 18.1281 17.7472 18.0293C17.7472 17.9305 17.767 17.8327 17.8054 17.7417C17.8438 17.6507 17.8999 17.5683 17.9707 17.4993C19.4216 16.0365 20.2358 14.0597 20.2358 11.9993C20.2358 9.93899 19.4216 7.96212 17.9707 6.49933C17.8999 6.43038 17.8438 6.34795 17.8054 6.25693C17.767 6.1659 17.7472 6.06812 17.7472 5.96933C17.7472 5.87054 17.767 5.77273 17.8054 5.6817C17.8438 5.59068 17.8999 5.50828 17.9707 5.43933C18.1113 5.29888 18.302 5.21997 18.5007 5.21997C18.6995 5.21997 18.8901 5.29888 19.0308 5.43933C20.7717 7.18463 21.7494 9.54915 21.7494 12.0143C21.7494 14.4795 20.7717 16.844 19.0308 18.5893C18.886 18.72 18.6955 18.7883 18.5007 18.7793Z" fill="currentColor"/>
                    </svg>
                </div>

                <!-- 底部图标 -->
                <div class="applemusic-player-bottom-actions">
                    <!-- 歌词气泡 -->
                    <svg id="applemusic-toggle-lyrics-btn" onclick="applemusicToggleLyricsView()" xmlns="http://www.w3.org/2000/svg" style="fill: none; color: rgba(255, 255, 255, 0.6); cursor: pointer;" viewBox="0 0 24 24" stroke-width="2.5" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" class="size-6">
                        <path d="M12 11v0.01"></path>
                        <path d="M8 11v0.01"></path>
                        <path d="M16 11v0.01"></path>
                        <path d="M18 4a3 3 0 0 1 3 3v8a3 3 0 0 1 -3 3h-5l-5 3v-3H6a3 3 0 0 1 -3 -3V7a3 3 0 0 1 3 -3z"></path>
                    </svg>
                    <!-- AirPlay / 播控 (点击邀请一起听歌) -->
                    <div id="applemusic-listen-together-btn" onclick="applemusicHandleListenTogetherClick()" style="display: flex; justify-content: center; align-items: center; cursor: pointer;">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" class="bi bi-headphones" viewBox="0 0 16 16" id="Headphones--Streamline-Bootstrap" style="width: 24px; height: 24px;">
                            <path d="M8 3a5 5 0 0 0 -5 5v1h1a1 1 0 0 1 1 1v3a1 1 0 0 1 -1 1H3a1 1 0 0 1 -1 -1V8a6 6 0 1 1 12 0v5a1 1 0 0 1 -1 1h-1a1 1 0 0 1 -1 -1v-3a1 1 0 0 1 1 -1h1V8a5 5 0 0 0 -5 -5" stroke-width="1"></path>
                        </svg>
                    </div>
                    <!-- 列表 (点击切换待播清单) -->
                    <div class="applemusic-list-btn-wrapper" onclick="applemusicTogglePlayerListView()">
                        <svg id="applemusic-toggle-list-btn" xmlns="http://www.w3.org/2000/svg" style="fill: none; color: rgba(255, 255, 255, 0.6); cursor: pointer;" viewBox="0 0 24 24" stroke-width="2.5" stroke="currentColor" class="size-6">
                          <path stroke-linecap="round" stroke-linejoin="round" d="M8.25 6.75h12M8.25 12h12m-12 5.25h12M3.75 6.75h.007v.008H3.75V6.75Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0ZM3.75 12h.007v.008H3.75V12Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm-.375 5.25h.007v.008H3.75v-.008Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z" />
                        </svg>
                        <!-- 播放模式角标 (默认隐藏) -->
                        <div class="applemusic-playmode-badge hidden" id="applemusic-playmode-badge">
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" height="12" width="12">
                                  <path d="M0.1606875 8.000725c0.0032 -3.04538125 2.471175 -5.51335 5.51655 -5.51655625h7.1860375l-0.2555 -0.254775c-0.47495625 -0.47495625 -0.25765 -1.28595 0.39115 -1.4598 0.30110625 -0.08068125 0.6223875 0.00540625 0.8428125 0.22583125L15.58380625 2.7375c0.3415875 0.3404 0.3415875 0.8935625 0 1.2339625l-1.74206875 1.74206875c-0.47495 0.47495625 -1.28595 0.25765 -1.45979375 -0.39115 -0.08068125 -0.30110625 0.0054 -0.6223875 0.22583125 -0.8428125l0.2555 -0.253325H5.6772375c-2.08359375 0.0024 -3.77208125 1.6908875 -3.77448125 3.77448125 -0.00056875 0.670525 -0.7267875 1.0889875 -1.30719375 0.75323125 -0.26890625 -0.15555625 -0.4346125 -0.44256875 -0.434875 -0.75323125Zm14.8075875 -0.8710375c-0.48106875 -0.00001875 -0.87103125 0.3899625 -0.87103125 0.8710375 -0.0024 2.08359375 -1.69089375 3.77208125 -3.7744875 3.7744875H3.136725l0.2555 -0.25478125c0.47495625 -0.47495 0.25765 -1.28595 -0.39115 -1.45979375 -0.30110625 -0.0806875 -0.6223875 0.0054 -0.8428125 0.22583125L0.4161875 12.0285375c-0.3415875 0.3404 -0.3415875 0.8935625 0 1.2339625l1.742075 1.74206875c0.47495 0.47495625 1.28595 0.25765 1.45979375 -0.39115 0.08068125 -0.30110625 -0.00540625 -0.6223875 -0.22583125 -0.8428125l-0.2555 -0.253325h7.18603125c3.04538125 -0.00320625 5.51335625 -2.471175 5.51655625 -5.51655625 0 -0.48104375 -0.3899875 -0.8710125 -0.8710375 -0.8710375Z" stroke-width="0.0625"></path>
                                </svg>
                                    </div>
                                </div>
                </div>
            </div>
        </div>

        <!-- Apple Music Playlists 播放列表页面右上角操作菜单 -->
        <div class="applemusic-more-menu-overlay" id="applemusicPlaylistsViewMenuOverlay" onclick="applemusicClosePlaylistsViewMenu()">
            <div class="applemusic-playlist-more-menu" id="applemusicPlaylistsViewMenu" onclick="event.stopPropagation()">
                <!-- 排序折叠栏 -->
                <div class="applemusic-playlist-more-menu-item" onclick="applemusicTogglePlaylistsSortMenu()">
                    <span>排序方式</span>
                    <svg id="applemusicPlaylistsSortChevron" viewBox="0 0 1024 1024" style="width: 20px; height: 20px; fill: currentColor; stroke: none !important; transition: transform 0.2s;"><path d="M44.032 451.584c-22.528 0-40.96 18.432-40.96 40.96v38.912c0 22.528 18.432 40.96 40.96 40.96h519.68c22.528 0 40.96-18.432 40.96-40.96v-38.912c0-22.528-18.432-40.96-40.96-40.96H44.032z m0 302.592c-22.528 0-40.96 18.432-40.96 40.96v38.912c0 22.528 18.432 40.96 40.96 40.96h519.68c22.528 0 40.96-18.432 40.96-40.96v-38.912c0-22.528-18.432-40.96-40.96-40.96H44.032z m519.68-484.352c22.528 0 40.96-18.432 40.96-40.96v-38.912c0-22.528-18.432-40.96-40.96-40.96H44.032c-22.528 0-40.96 18.432-40.96 40.96v38.912c0 22.528 18.432 40.96 40.96 40.96h519.68z m170.496-120.832c-22.528 0-40.96 18.432-40.96 40.96V834.56c0 22.528 18.432 40.96 40.96 40.96h38.912c15.36 0 28.16-8.192 35.328-20.48l212.48-212.48c0-22.528-18.432-40.96-40.96-40.96H814.08V189.952c0-22.528-18.432-40.96-40.96-40.96h-38.912z"></path></svg>
                </div>
                <div id="applemusicPlaylistsSortSubmenu" style="display: none; background: rgba(0,0,0,0.03); border-radius: 8px; margin: 0 8px 8px 8px; overflow: hidden;">
                    <div class="applemusic-playlist-more-menu-item submenu" onclick="applemusicSortCustomPlaylists('title')">
                        <span>按标题</span>
                    </div>
                    <div class="applemusic-playlist-more-menu-item submenu" onclick="applemusicSortCustomPlaylists('recentlyAdded')">
                        <span>最近添加</span>
                    </div>
                    <div class="applemusic-playlist-more-menu-item submenu" onclick="applemusicSortCustomPlaylists('songCount')">
                        <span>按歌曲数量</span>
                    </div>
                </div>

                <div class="applemusic-more-menu-item" onclick="applemusicClosePlaylistsViewMenu(); applemusicOpenGlobalEditPlaylistModal();">
                    <span>编辑歌单</span>
                    <svg viewBox="0 0 1024 1024" style="width: 20px; height: 20px; fill: currentColor; stroke: none !important;"><path d="M943.104 216.064q-8.192 9.216-15.36 16.384l-12.288 12.288q-6.144 6.144-11.264 10.24l-138.24-139.264q8.192-8.192 20.48-19.456t20.48-17.408q20.48-16.384 44.032-14.336t37.888 9.216q15.36 8.192 34.304 28.672t29.184 43.008q5.12 14.336 6.656 33.792t-15.872 36.864zM551.936 329.728l158.72-158.72 138.24 138.24q-87.04 87.04-158.72 157.696-30.72 29.696-59.904 58.88t-53.248 52.224-39.424 38.4l-18.432 18.432q-7.168 7.168-16.384 14.336t-20.48 12.288-31.232 12.288-41.472 13.824-40.96 12.288-29.696 6.656q-19.456 2.048-20.992-3.584t1.536-25.088q1.024-10.24 5.12-30.208t8.192-40.448 8.704-38.4 7.68-25.088q5.12-11.264 10.752-19.456t15.872-18.432zM899.072 478.208q21.504 0 40.96 10.24t19.456 41.984l0 232.448q0 28.672-10.752 52.736t-29.184 41.984-41.984 27.648-48.128 9.728l-571.392 0q-24.576 0-48.128-10.752t-41.472-29.184-29.184-43.52-11.264-53.76l0-570.368q0-20.48 11.264-42.496t29.184-39.936 40.448-29.696 45.056-11.776l238.592 0q28.672 0 40.448 20.992t11.776 42.496-11.776 41.472-40.448 19.968l-187.392 0q-21.504 0-34.816 14.848t-13.312 36.352l0 481.28q0 20.48 13.312 34.304t34.816 13.824l474.112 0q21.504 0 36.864-13.824t15.36-34.304l0-190.464q0-14.336 6.656-24.576t16.384-16.384 21.504-8.704 23.04-2.56z"></path></svg>
                </div>

                <div class="applemusic-more-menu-item" onclick="applemusicClosePlaylistsViewMenu(); applemusicOpenCreatePlaylistModal();">
                    <span>新建歌单</span>
                    <svg viewBox="0 0 1024 1024" style="width: 20px; height: 20px; fill: currentColor; stroke: none !important;"><path d="M252.8 142.272h582.4c27.776 0 41.6 14.208 41.6 42.688 0 28.416-13.824 42.624-41.6 42.624h-582.4c-27.712 0-41.6-14.208-41.6-42.624 0-28.48 13.888-42.688 41.6-42.688zM318.208 0h471.552c27.712 0 41.6 14.208 41.6 42.688 0 28.416-13.888 42.624-41.6 42.624H318.144c-27.712 0-41.6-14.208-41.6-42.624 0-28.48 13.888-42.688 41.6-42.688zM846.528 288c14.912 0 29.696 2.56 43.456 7.68 13.76 4.992 26.24 12.416 36.8 21.76 10.496 9.28 18.88 20.352 24.576 32.512 5.76 12.16 8.64 25.216 8.64 38.4v535.296c0 13.184-2.944 26.24-8.64 38.4-5.696 12.16-14.08 23.232-24.576 32.576-10.56 9.28-23.04 16.64-36.8 21.76-13.76 4.992-28.544 7.616-43.456 7.616H241.472c-14.912 0-29.696-2.56-43.456-7.68a115.456 115.456 0 0 1-36.8-21.76 100.48 100.48 0 0 1-24.576-32.512 90.368 90.368 0 0 1-8.64-38.4V388.352c0-26.624 11.968-52.16 33.28-70.976 21.248-18.816 50.112-29.376 80.192-29.376h605.056zM539.264 474.112a39.552 39.552 0 0 0-23.68 11.072 31.36 31.36 0 0 0-9.408 22.144v115.2H375.936l-4.736 0.256a39.552 39.552 0 0 0-23.68 11.072 31.36 31.36 0 0 0-9.408 22.144l0.256 4.224a32.512 32.512 0 0 0 12.544 20.864c6.912 5.376 15.808 8.32 24.96 8.32H506.24v99.328l0.32 4.224a32.448 32.448 0 0 0 12.48 20.864c6.912 5.376 15.808 8.32 25.024 8.32l4.736-0.192a39.552 39.552 0 0 0 23.68-11.072 31.36 31.36 0 0 0 9.408-22.144v-99.264h135.68l4.8-0.256a39.552 39.552 0 0 0 23.616-11.072 31.36 31.36 0 0 0 9.472-22.144l-0.32-4.224a32.448 32.448 0 0 0-12.544-20.864 40.832 40.832 0 0 0-24.96-8.32H581.76V507.264l-0.32-4.224a32.448 32.448 0 0 0-12.48-20.864 40.768 40.768 0 0 0-25.024-8.384l-4.736 0.256z"></path></svg>
                </div>
            </div>
        </div>

        <!-- Apple Music 歌单详情右上角更多菜单 -->
        <div class="applemusic-more-menu-overlay" id="applemusicPlaylistMoreMenuOverlay" onclick="applemusicClosePlaylistMoreMenu()">
            <div class="applemusic-playlist-more-menu" id="applemusicPlaylistMoreMenu" onclick="event.stopPropagation()">

                <!-- 排序折叠栏 -->
                <div class="applemusic-playlist-more-menu-item" onclick="applemusicToggleSortMenu()">
                    <span>排序方式</span>
                    <svg id="applemusicSortChevron" viewBox="0 0 1024 1024" style="width: 20px; height: 20px; fill: currentColor; stroke: none !important; transition: transform 0.2s;"><path d="M44.032 451.584c-22.528 0-40.96 18.432-40.96 40.96v38.912c0 22.528 18.432 40.96 40.96 40.96h519.68c22.528 0 40.96-18.432 40.96-40.96v-38.912c0-22.528-18.432-40.96-40.96-40.96H44.032z m0 302.592c-22.528 0-40.96 18.432-40.96 40.96v38.912c0 22.528 18.432 40.96 40.96 40.96h519.68c22.528 0 40.96-18.432 40.96-40.96v-38.912c0-22.528-18.432-40.96-40.96-40.96H44.032z m519.68-484.352c22.528 0 40.96-18.432 40.96-40.96v-38.912c0-22.528-18.432-40.96-40.96-40.96H44.032c-22.528 0-40.96 18.432-40.96 40.96v38.912c0 22.528 18.432 40.96 40.96 40.96h519.68z m170.496-120.832c-22.528 0-40.96 18.432-40.96 40.96V834.56c0 22.528 18.432 40.96 40.96 40.96h38.912c15.36 0 28.16-8.192 35.328-20.48l212.48-212.48c0-22.528-18.432-40.96-40.96-40.96H814.08V189.952c0-22.528-18.432-40.96-40.96-40.96h-38.912z"></path></svg>
                </div>
                <div id="applemusicSortSubmenu" style="display: none; background: rgba(0,0,0,0.03); border-radius: 8px; margin: 0 8px 8px 8px; overflow: hidden;">
                    <div class="applemusic-playlist-more-menu-item submenu" onclick="applemusicSortPlaylist('name')">
                        <span>按名称</span>
                    </div>
                    <div class="applemusic-playlist-more-menu-item submenu" onclick="applemusicSortPlaylist('artist')">
                        <span>按艺人</span>
                    </div>
                    <div class="applemusic-playlist-more-menu-item submenu" onclick="applemusicSortPlaylist('duration')">
                        <span>按时长</span>
                    </div>
                </div>

                <div class="applemusic-playlist-more-menu-item" onclick="applemusicOpenEditPlaylistModal()">
                    <span>编辑歌单</span>
                    <svg viewBox="0 0 1024 1024" style="width: 20px; height: 20px; fill: currentColor; stroke: none !important;"><path d="M943.104 216.064q-8.192 9.216-15.36 16.384l-12.288 12.288q-6.144 6.144-11.264 10.24l-138.24-139.264q8.192-8.192 20.48-19.456t20.48-17.408q20.48-16.384 44.032-14.336t37.888 9.216q15.36 8.192 34.304 28.672t29.184 43.008q5.12 14.336 6.656 33.792t-15.872 36.864zM551.936 329.728l158.72-158.72 138.24 138.24q-87.04 87.04-158.72 157.696-30.72 29.696-59.904 58.88t-53.248 52.224-39.424 38.4l-18.432 18.432q-7.168 7.168-16.384 14.336t-20.48 12.288-31.232 12.288-41.472 13.824-40.96 12.288-29.696 6.656q-19.456 2.048-20.992-3.584t1.536-25.088q1.024-10.24 5.12-30.208t8.192-40.448 8.704-38.4 7.68-25.088q5.12-11.264 10.752-19.456t15.872-18.432zM899.072 478.208q21.504 0 40.96 10.24t19.456 41.984l0 232.448q0 28.672-10.752 52.736t-29.184 41.984-41.984 27.648-48.128 9.728l-571.392 0q-24.576 0-48.128-10.752t-41.472-29.184-29.184-43.52-11.264-53.76l0-570.368q0-20.48 11.264-42.496t29.184-39.936 40.448-29.696 45.056-11.776l238.592 0q28.672 0 40.448 20.992t11.776 42.496-11.776 41.472-40.448 19.968l-187.392 0q-21.504 0-34.816 14.848t-13.312 36.352l0 481.28q0 20.48 13.312 34.304t34.816 13.824l474.112 0q21.504 0 36.864-13.824t15.36-34.304l0-190.464q0-14.336 6.656-24.576t16.384-16.384 21.504-8.704 23.04-2.56z"></path></svg>
                </div>
                <div class="applemusic-playlist-more-menu-item" onclick="applemusicTogglePlaylistPin()">
                    <span id="applemusic-playlist-pin-text">置顶歌单</span>
                    <svg viewBox="0 0 1024 1024" style="width: 26px !important; height: 26px !important; fill: currentColor; stroke: none !important; transform: translateX(2.5px);"><path d="M359.828 601.089l63.083 63.083C360.767 716.774 270.047 798.447 251.31 813.13c-47.659 37.375-89.829 49.389-89.829 49.389s12.014-42.171 49.389-89.829c14.683-18.738 96.355-109.456 148.958-171.601z m489.244-257.328L680.239 174.928c-17.897-17.897-46.867-17.897-64.714 0-17.897 17.897-17.897 46.868 0 64.714l13.447 13.447-246.599 174.172-54.58-54.531c-17.896-17.896-46.867-17.895-64.714 0-17.897 17.897-17.897 46.868 0 64.714L586.555 760.87c17.895 17.897 46.867 17.897 64.714 0 17.897-17.897 17.897-46.867 0-64.714l-54.531-54.531L770.91 394.976l13.447 13.447c17.897 17.895 46.868 17.896 64.714 0s17.895-46.819 0-64.666z"></path></svg>
                </div>
                <div class="applemusic-playlist-more-menu-item danger" onclick="applemusicDeleteCurrentPlaylist()">
                    <span>删除歌单</span>
                    <svg viewBox="0 0 1090 1024" style="width: 20px; height: 20px; fill: currentColor; stroke: none !important;"><path d="M1041.573137 144.201227H47.326931a47.390372 47.390372 0 0 0 0 94.717303h109.816245v581.245772a204.089462 204.089462 0 0 0 203.772257 203.835698h367.069202a204.089462 204.089462 0 0 0 203.835698-203.835698V238.791649h109.752804a47.326931 47.326931 0 1 0 0-94.590422z m-556.947897 580.421039a47.390372 47.390372 0 0 1-94.717304 0V427.338083a47.390372 47.390372 0 0 1 94.717304 0z m214.24001 0a47.390372 47.390372 0 0 1-94.717304 0V427.338083a47.390372 47.390372 0 0 1 94.717304 0z m-335.665944-629.968403h362.501456a47.326931 47.326931 0 1 0 0-94.653863H363.199306a47.326931 47.326931 0 0 0 0 94.653863z"></path></svg>
                </div>
            </div>
        </div>

        <!-- Apple Music 风格更多操作菜单 (悬浮定位气泡菜单) -->
        <div class="applemusic-more-menu-overlay" id="applemusicMoreMenuOverlay" onclick="applemusicCloseMoreMenu()">
            <div class="applemusic-more-menu" id="applemusicMoreMenu" onclick="event.stopPropagation()">
                <div class="applemusic-more-menu-item danger" onclick="if(confirm('确定要从播放列表删除吗？')) applemusicMenuRemoveFromQueue(event)">
                    <span>从播放列表删除</span>
                    <svg viewBox="0 0 1024 1024"><path d="M880 224H144a48 48 0 0 1 0-96h240a64 64 0 0 1 64-64h128a64 64 0 0 1 64 64h240a48 48 0 0 1 0 96z m-48 608a128 128 0 0 1-128 128H320a128 128 0 0 1-128-128V288h640v544zM448 464a48 48 0 0 0-96 0v288a48 48 0 0 0 96 0V464z m224 0a48 48 0 0 0-96 0v288a48 48 0 0 0 96 0V464z"></path></svg>
                </div>
                <div class="applemusic-more-menu-item" onclick="applemusicMenuAddToPlaylist(event)">
                    <span>添加至歌单列表...</span>
                    <svg viewBox="0 0 1024 1024"><path d="M128 256h426.667c25.6 0 42.666-17.067 42.666-42.667s-17.066-42.666-42.666-42.666H128c-25.6 0-42.667 21.333-42.667 42.666S102.4 256 128 256z m0 298.667h307.2c25.6 0 42.667-17.067 42.667-42.667S460.8 469.333 435.2 469.333H128c-25.6 0-42.667 17.067-42.667 42.667S102.4 554.667 128 554.667z m166.4 209.066H128c-25.6 0-42.667 17.067-42.667 42.667S102.4 849.067 128 849.067h166.4c25.6 0 42.667-17.067 42.667-42.667S320 763.733 294.4 763.733z m503.467-12.8c-8.534 59.734-51.2 119.467-115.2 153.6-98.134 51.2-209.067 38.4-247.467-38.4-38.4-72.533 4.267-174.933 102.4-230.4 59.733-34.133 128-38.4 179.2-21.333V128c0-17.067 8.533-34.133 25.6-38.4 17.067-8.533 34.133-4.267 46.933 8.533l140.8 132.267c17.067 17.067 17.067 42.667 0 59.733-17.066 17.067-42.666 17.067-59.733 0l-68.267-64v507.734l-4.266 17.066z"></path></svg>
                </div>
                <div class="applemusic-more-menu-item" onclick="applemusicCloseMoreMenu(); if(typeof applemusicShareSong === 'function') applemusicShareSong(window.applemusicCurrentPlayingSong);">
                    <span>分享歌曲...</span>
                    <svg viewBox="0 0 1024 1024"><path d="M455.457391 53.292522a44.521739 44.521739 0 0 1 5.209044 88.731826l-5.164522 0.311652h-40.915478A241.174261 241.174261 0 0 0 173.634783 373.804522l-0.222609 9.705739v225.903304a241.174261 241.174261 0 0 0 231.513043 240.951652l9.661218 0.222609h225.903304a241.174261 241.174261 0 0 0 240.996174-231.513043l0.178087-9.661218v-33.391304a44.521739 44.521739 0 0 1 88.776348-5.209044l0.26713 5.164522v33.391304a330.217739 330.217739 0 0 1-319.309913 330.084174l-10.907826 0.178087H414.586435A330.217739 330.217739 0 0 1 84.591304 620.27687l-0.178087-10.863305V383.510261A330.217739 330.217739 0 0 1 403.72313 53.426087l10.863305-0.133565h40.915478z m367.571479 58.100869a89.043478 89.043478 0 0 1 88.776347 82.365218l0.267131 6.678261v178.220521a44.521739 44.521739 0 0 1-88.731826 5.164522l-0.311652-5.164522V263.969391l-274.120348 274.120348a44.521739 44.521739 0 0 1-66.426435-59.080348l3.428174-3.917913 274.69913-274.69913h-115.801043a44.521739 44.521739 0 0 1-5.209044-88.731826l5.209044-0.267131h178.220522z"></path></svg>
                </div>
                <div class="applemusic-more-menu-item" onclick="applemusicSongMenuInviteClick()">
                    <span id="applemusic-song-menu-invite-text">邀请一起听歌</span>
                    <svg viewBox="0 0 1024 1024"><path d="M938.666667 264.021333V354.133333c0 70.698667-60.672 128-135.552 128-24.917333 0-45.141333 19.114667-45.141334 42.666667v211.2H554.666667V354.645333c0-12.373333 0-18.56 0.256-23.765333 5.717333-109.610667 98.517333-197.248 214.528-202.624 5.546667-0.256 12.117333-0.256 25.216-0.256 7.850667 0 11.776 0 15.104 0.170667 69.632 3.2 125.312 55.808 128.725333 121.557333 0.170667 3.114667 0.170667 6.826667 0.170667 14.293333zM864 256a32 32 0 0 0-64 0v106.666667a32 32 0 0 0 64 0V256z"></path><path d="M656.298667 896C600.192 896 554.666667 853.034667 554.666667 800h203.306666c0 53.034667-45.525333 96-101.674666 96z"></path><path d="M85.333333 264.021333V354.133333c0 70.698667 60.672 128 135.509334 128 24.96 0 45.226667 19.114667 45.226666 42.666667v211.2H469.333333V354.645333c0-12.373333 0-18.56-0.256-23.765333-5.717333-109.610667-98.517333-197.248-214.528-202.624C249.002667 128 242.432 128 229.333333 128c-7.850667 0-11.818667 0-15.104 0.170667-69.632 3.2-125.312 55.808-128.725333 121.557333C85.333333 252.842667 85.333333 256.554667 85.333333 264.021333zM160 256a32 32 0 0 1 64 0v106.666667a32 32 0 0 1-64 0V256z"></path><path d="M367.701333 896C423.808 896 469.333333 853.034667 469.333333 800H266.026667c0 53.034667 45.525333 96 101.674666 96z"></path></svg>
                </div>
                <div class="applemusic-more-menu-item" onclick="applemusicMenuToggleFavorite(event)">
                    <span id="applemusic-more-menu-fav-text">添加喜爱</span>
                    <span id="applemusic-more-menu-fav-icon" style="display: flex; align-items: center; justify-content: center; color: #8e8e93;">
                        <svg viewBox="0 0 1024 1024" style="width: 20px; height: 20px;" fill="#8e8e93"><path d="M32 407.584a279.584 279.584 0 0 1 480-194.944 279.584 279.584 0 0 1 480 194.944 278.144 278.144 0 0 1-113.024 224.512L562.592 892.8a96 96 0 0 1-124.416-1.952l-308.16-270.688A278.976 278.976 0 0 1 32 407.584z"></path></svg>
                    </span>
                </div>
            </div>
        </div>

        <!-- Apple Music 歌单内歌曲更多操作菜单 (悬浮卡片抽屉) -->
        <div class="applemusic-drawer-menu-overlay" id="applemusicSongMoreMenuOverlay" onclick="applemusicCloseSongMoreMenu()">
            <div class="applemusic-card-drawer" id="applemusicSongMoreMenu" onclick="event.stopPropagation()">
                <div class="applemusic-drawer-handle-bar"></div>
                <div class="song-header">
                    <svg class="applemusic-tiny-star" id="applemusic-song-menu-star" viewBox="0 0 24 24" fill="currentColor" style="display: none; width: 14px; height: 14px; fill: var(--theme-active); margin-right: 8px; flex-shrink: 0;"><path d="M11.1 2.41c.31-.8 1.49-.8 1.8 0l2.2 5.67a1 1 0 00.83.6l6.05.46c.85.06 1.2 1.12.55 1.68l-4.64 3.97a1 1 0 00-.32 1l1.38 5.9c.2.85-.68 1.49-1.4 1.05l-5.18-3.15a1 1 0 00-1.04 0l-5.18 3.15c-.72.44-1.6-.2-1.4-1.05l1.38-5.9a1 1 0 00-.32-1L1.17 10.82c-.65-.56-.3-1.62.55-1.68l6.05-.46a1 1 0 00.83-.6l2.2-5.67z"/></svg>
                    <img class="song-cover" id="applemusic-song-menu-cover" src="">
                    <div class="song-info">
                        <div class="song-title" id="applemusic-song-menu-title">歌曲名</div>
                        <div class="song-artist" id="applemusic-song-menu-artist">歌手名</div>
                    </div>
                    <div class="applemusic-song-menu-play-btn" onclick="applemusicSongMenuPlayDirect(event)" title="播放">
                        <svg viewBox="0 0 24 24" fill="currentColor"><path d="M6.51 18.87c.15.09.32.13.49.13s.36-.05.51-.14l10-6c.3-.18.49-.51.49-.86s-.18-.68-.49-.86l-10-6a.99.99 0 0 0-1.01-.01c-.31.18-.51.51-.51.87v12c0 .36.19.69.51.87Z"></path></svg>
                    </div>
                </div>
                <div class="menu-list">
                    <div class="menu-item" id="applemusic-song-menu-fav" onclick="applemusicSongMenuToggleFavorite()">
                        <span id="applemusic-song-menu-fav-icon" style="display: flex; align-items: center; justify-content: center; color: #8e8e93;">
                            <svg viewBox="0 0 1024 1024" style="width: 20px; height: 20px;" fill="#8e8e93"><path d="M32 407.584a279.584 279.584 0 0 1 480-194.944 279.584 279.584 0 0 1 480 194.944 278.144 278.144 0 0 1-113.024 224.512L562.592 892.8a96 96 0 0 1-124.416-1.952l-308.16-270.688A278.976 278.976 0 0 1 32 407.584z"></path></svg>
                        </span>
                        <span id="applemusic-song-menu-fav-text">喜爱</span>
                    </div>
                    <div class="menu-item" id="applemusic-song-menu-add-playlist" onclick="applemusicSongMenuAddToPlaylist()">
                        <svg viewBox="0 0 1024 1024"><path d="M128 256h426.667c25.6 0 42.666-17.067 42.666-42.667s-17.066-42.666-42.666-42.666H128c-25.6 0-42.667 21.333-42.667 42.666S102.4 256 128 256z m0 298.667h307.2c25.6 0 42.667-17.067 42.667-42.667S460.8 469.333 435.2 469.333H128c-25.6 0-42.667 17.067-42.667 42.667S102.4 554.667 128 554.667z m166.4 209.066H128c-25.6 0-42.667 17.067-42.667 42.667S102.4 849.067 128 849.067h166.4c25.6 0 42.667-17.067 42.667-42.667S320 763.733 294.4 763.733z m503.467-12.8c-8.534 59.734-51.2 119.467-115.2 153.6-98.134 51.2-209.067 38.4-247.467-38.4-38.4-72.533 4.267-174.933 102.4-230.4 59.733-34.133 128-38.4 179.2-21.333V128c0-17.067 8.533-34.133 25.6-38.4 17.067-8.533 34.133-4.267 46.933 8.533l140.8 132.267c17.067 17.067 17.067 42.667 0 59.733-17.066 17.067-42.666 17.067-59.733 0l-68.267-64v507.734l-4.266 17.066z"></path></svg>
                        <span>添加至歌单</span>
                    </div>
                    <div class="menu-item" id="applemusic-song-menu-share" onclick="applemusicSongMenuShare()">
                        <svg viewBox="0 0 1024 1024"><path d="M455.457391 53.292522a44.521739 44.521739 0 0 1 5.209044 88.731826l-5.164522 0.311652h-40.915478A241.174261 241.174261 0 0 0 173.634783 373.804522l-0.222609 9.705739v225.903304a241.174261 241.174261 0 0 0 231.513043 240.951652l9.661218 0.222609h225.903304a241.174261 241.174261 0 0 0 240.996174-231.513043l0.178087-9.661218v-33.391304a44.521739 44.521739 0 0 1 88.776348-5.209044l0.26713 5.164522v33.391304a330.217739 330.217739 0 0 1-319.309913 330.084174l-10.907826 0.178087H414.586435A330.217739 330.217739 0 0 1 84.591304 620.27687l-0.178087-10.863305V383.510261A330.217739 330.217739 0 0 1 403.72313 53.426087l10.863305-0.133565h40.915478z m367.571479 58.100869a89.043478 89.043478 0 0 1 88.776347 82.365218l0.267131 6.678261v178.220521a44.521739 44.521739 0 0 1-88.731826 5.164522l-0.311652-5.164522V263.969391l-274.120348 274.120348a44.521739 44.521739 0 0 1-66.426435-59.080348l3.428174-3.917913 274.69913-274.69913h-115.801043a44.521739 44.521739 0 0 1-5.209044-88.731826l5.209044-0.267131h178.220522z"></path></svg>
                        <span>分享</span>
                    </div>
                    <div class="menu-item" id="applemusic-song-menu-invite" onclick="applemusicSongMenuInviteClick()">
                        <svg viewBox="0 0 1024 1024"><path d="M938.666667 264.021333V354.133333c0 70.698667-60.672 128-135.552 128-24.917333 0-45.141333 19.114667-45.141334 42.666667v211.2H554.666667V354.645333c0-12.373333 0-18.56 0.256-23.765333 5.717333-109.610667 98.517333-197.248 214.528-202.624 5.546667-0.256 12.117333-0.256 25.216-0.256 7.850667 0 11.776 0 15.104 0.170667 69.632 3.2 125.312 55.808 128.725333 121.557333 0.170667 3.114667 0.170667 6.826667 0.170667 14.293333zM864 256a32 32 0 0 0-64 0v106.666667a32 32 0 0 0 64 0V256z"></path><path d="M656.298667 896C600.192 896 554.666667 853.034667 554.666667 800h203.306666c0 53.034667-45.525333 96-101.674666 96z"></path><path d="M85.333333 264.021333V354.133333c0 70.698667 60.672 128 135.509334 128 24.96 0 45.226667 19.114667 45.226666 42.666667v211.2H469.333333V354.645333c0-12.373333 0-18.56-0.256-23.765333-5.717333-109.610667-98.517333-197.248-214.528-202.624C249.002667 128 242.432 128 229.333333 128c-7.850667 0-11.818667 0-15.104 0.170667-69.632 3.2-125.312 55.808-128.725333 121.557333C85.333333 252.842667 85.333333 256.554667 85.333333 264.021333zM160 256a32 32 0 0 1 64 0v106.666667a32 32 0 0 1-64 0V256z"></path><path d="M367.701333 896C423.808 896 469.333333 853.034667 469.333333 800H266.026667c0 53.034667 45.525333 96 101.674666 96z"></path></svg>
                        <span id="applemusic-song-menu-invite-text">邀请一起听歌</span>
                    </div>
                    <div class="menu-item" id="applemusic-song-menu-edit-local" onclick="applemusicSongMenuEditLocal()" style="display: none;">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>
                        <span>编辑本地音乐</span>
                    </div>
                    <div class="menu-item" id="applemusic-song-menu-pin" onclick="applemusicSongMenuPin()">
                        <svg viewBox="0 0 1024 1024" style="transform: scale(1.1);"><path d="M359.828 601.089l63.083 63.083C360.767 716.774 270.047 798.447 251.31 813.13c-47.659 37.375-89.829 49.389-89.829 49.389s12.014-42.171 49.389-89.829c14.683-18.738 96.355-109.456 148.958-171.601z m489.244-257.328L680.239 174.928c-17.897-17.897-46.867-17.897-64.714 0-17.897 17.897-17.897 46.868 0 64.714l13.447 13.447-246.599 174.172-54.58-54.531c-17.896-17.896-46.867-17.895-64.714 0-17.897 17.897-17.897 46.868 0 64.714L586.555 760.87c17.895 17.897 46.867 17.897 64.714 0 17.897-17.897 17.897-46.867 0-64.714l-54.531-54.531L770.91 394.976l13.447 13.447c17.897 17.895 46.868 17.896 64.714 0s17.895-46.819 0-64.666z"></path></svg>
                        <span id="applemusic-song-pin-text">置顶</span>
                    </div>
                    <div class="menu-item" id="applemusic-song-menu-move" onclick="applemusicSongMenuMove()">
                        <svg viewBox="0 0 1024 1024"><path d="M768 208H595.349a223.478 223.478 0 0 1-147.964-56 223.473 223.473 0 0 0-147.964-56H256C149.961 96 64 181.961 64 288v448c0 106.038 85.961 192 192 192h512c106.039 0 192-85.962 192-192V400c0-106.039-85.961-192-192-192z m112 528c0 61.757-50.243 112-112 112H256c-61.757 0-112-50.243-112-112V288c0-61.758 50.243-112 112-112h43.421a143.372 143.372 0 0 1 94.995 35.953A303.263 303.263 0 0 0 595.349 288H768c61.757 0 112 50.242 112 112v336z"></path><path d="M690.783 471.577l-82.681-91.826c-7.899-8.772-18.796-13.236-29.739-13.235a39.868 39.868 0 0 0-26.752 10.274c-16.417 14.782-17.743 40.074-2.961 56.491L576.31 464H360c-22.092 0-40 17.908-40 40 0 22.091 17.908 40 40 40h304c22.092 0 40-17.909 40-40 0-8.139-2.461-15.688-6.636-22.005-1.66-3.69-3.728-7.25-6.581-10.418zM664 606.516H360c-22.092 0-40 17.908-40 40 0 8.139 2.461 15.688 6.636 22.005 1.66 3.69 3.729 7.25 6.581 10.418l82.681 91.826c7.899 8.772 18.796 13.235 29.739 13.235a39.863 39.863 0 0 0 26.752-10.274c16.417-14.782 17.743-40.074 2.961-56.491l-27.659-30.719H664c22.092 0 40-17.908 40-40s-17.908-40-40-40z"></path></svg>
                        <span>移动</span>
                    </div>
                    <div class="menu-item" id="applemusic-song-menu-play-later" onclick="applemusicSongMenuPlayLater()">
                        <svg viewBox="0 0 1024 1024"><path d="M876.416 810.496a53.333333 53.333333 0 0 1 0 106.666667H147.669333a53.333333 53.333333 0 0 1 0-106.666667h728.746667zM876.416 498.218667a53.333333 53.333333 0 0 1 0 106.666666H147.669333a53.333333 53.333333 0 0 1 0-106.666666h728.746667zM97.834667 131.242667c0-28.586667 31.018667-46.464 55.765333-32.170667l187.008 107.946667a37.248 37.248 0 0 1 0 64.426666L153.6 379.434667a37.162667 37.162667 0 0 1-55.765333-32.170667V131.242667zM876.373333 185.941333a53.333333 53.333333 0 0 1 0 106.666667h-360.277333a53.333333 53.333333 0 1 1 0-106.666667h360.277333z"></path></svg>
                        <span>随后播放</span>
                    </div>
                    <div class="menu-item danger" id="applemusic-song-menu-delete" onclick="if(confirm('确定要删除此歌曲吗？')) applemusicSongMenuDelete()">
                        <svg viewBox="0 0 1024 1024"><path d="M880 224H144a48 48 0 0 1 0-96h240a64 64 0 0 1 64-64h128a64 64 0 0 1 64 64h240a48 48 0 0 1 0 96z m-48 608a128 128 0 0 1-128 128H320a128 128 0 0 1-128-128V288h640v544zM448 464a48 48 0 0 0-96 0v288a48 48 0 0 0 96 0V464z m224 0a48 48 0 0 0-96 0v288a48 48 0 0 0 96 0V464z"></path></svg>
                        <span>删除</span>
                    </div>
                </div>
            </div>
        </div>

        <!-- Apple Music Library 右上角菜单 -->
        <div class="applemusic-more-menu-overlay" id="applemusicLibraryMenuOverlay" onclick="applemusicCloseLibraryMenu()">
            <div class="applemusic-more-menu" id="applemusicLibraryMenu" onclick="event.stopPropagation()">
                <div class="applemusic-more-menu-item" onclick="applemusicCloseLibraryMenu(); applemusicOpenCreatePlaylistModal();">
                    <span>创建歌单</span>
                    <svg viewBox="0 0 1024 1024" style="width: 20px !important; height: 20px !important; fill: currentColor; stroke: none !important;"><path d="M252.8 142.272h582.4c27.776 0 41.6 14.208 41.6 42.688 0 28.416-13.824 42.624-41.6 42.624h-582.4c-27.712 0-41.6-14.208-41.6-42.624 0-28.48 13.888-42.688 41.6-42.688zM318.208 0h471.552c27.712 0 41.6 14.208 41.6 42.688 0 28.416-13.888 42.624-41.6 42.624H318.144c-27.712 0-41.6-14.208-41.6-42.624 0-28.48 13.888-42.688 41.6-42.688zM846.528 288c14.912 0 29.696 2.56 43.456 7.68 13.76 4.992 26.24 12.416 36.8 21.76 10.496 9.28 18.88 20.352 24.576 32.512 5.76 12.16 8.64 25.216 8.64 38.4v535.296c0 13.184-2.944 26.24-8.64 38.4-5.696 12.16-14.08 23.232-24.576 32.576-10.56 9.28-23.04 16.64-36.8 21.76-13.76 4.992-28.544 7.616-43.456 7.616H241.472c-14.912 0-29.696-2.56-43.456-7.68a115.456 115.456 0 0 1-36.8-21.76 100.48 100.48 0 0 1-24.576-32.512 90.368 90.368 0 0 1-8.64-38.4V388.352c0-26.624 11.968-52.16 33.28-70.976 21.248-18.816 50.112-29.376 80.192-29.376h605.056zM539.264 474.112a39.552 39.552 0 0 0-23.68 11.072 31.36 31.36 0 0 0-9.408 22.144v115.2H375.936l-4.736 0.256a39.552 39.552 0 0 0-23.68 11.072 31.36 31.36 0 0 0-9.408 22.144l0.256 4.224a32.512 32.512 0 0 0 12.544 20.864c6.912 5.376 15.808 8.32 24.96 8.32H506.24v99.328l0.32 4.224a32.448 32.448 0 0 0 12.48 20.864c6.912 5.376 15.808 8.32 25.024 8.32l4.736-0.192a39.552 39.552 0 0 0 23.68-11.072 31.36 31.36 0 0 0 9.408-22.144v-99.264h135.68l4.8-0.256a39.552 39.552 0 0 0 23.616-11.072 31.36 31.36 0 0 0 9.472-22.144l-0.32-4.224a32.448 32.448 0 0 0-12.544-20.864 40.832 40.832 0 0 0-24.96-8.32H581.76V507.264l-0.32-4.224a32.448 32.448 0 0 0-12.48-20.864 40.768 40.768 0 0 0-25.024-8.384l-4.736 0.256z"></path></svg>
                </div>
                <div class="applemusic-more-menu-item" onclick="applemusicCloseLibraryMenu(); applemusicOpenGlobalEditPlaylistModal();">
                    <span>编辑歌单</span>
                    <svg viewBox="0 0 1024 1024" style="width: 20px; height: 20px; fill: currentColor; stroke: none !important;"><path d="M943.104 216.064q-8.192 9.216-15.36 16.384l-12.288 12.288q-6.144 6.144-11.264 10.24l-138.24-139.264q8.192-8.192 20.48-19.456t20.48-17.408q20.48-16.384 44.032-14.336t37.888 9.216q15.36 8.192 34.304 28.672t29.184 43.008q5.12 14.336 6.656 33.792t-15.872 36.864zM551.936 329.728l158.72-158.72 138.24 138.24q-87.04 87.04-158.72 157.696-30.72 29.696-59.904 58.88t-53.248 52.224-39.424 38.4l-18.432 18.432q-7.168 7.168-16.384 14.336t-20.48 12.288-31.232 12.288-41.472 13.824-40.96 12.288-29.696 6.656q-19.456 2.048-20.992-3.584t1.536-25.088q1.024-10.24 5.12-30.208t8.192-40.448 8.704-38.4 7.68-25.088q5.12-11.264 10.752-19.456t15.872-18.432zM899.072 478.208q21.504 0 40.96 10.24t19.456 41.984l0 232.448q0 28.672-10.752 52.736t-29.184 41.984-41.984 27.648-48.128 9.728l-571.392 0q-24.576 0-48.128-10.752t-41.472-29.184-29.184-43.52-11.264-53.76l0-570.368q0-20.48 11.264-42.496t29.184-39.936 40.448-29.696 45.056-11.776l238.592 0q28.672 0 40.448 20.992t11.776 42.496-11.776 41.472-40.448 19.968l-187.392 0q-21.504 0-34.816 14.848t-13.312 36.352l0 481.28q0 20.48 13.312 34.304t34.816 13.824l474.112 0q21.504 0 36.864-13.824t15.36-34.304l0-190.464q0-14.336 6.656-24.576t16.384-16.384 21.504-8.704 23.04-2.56z"></path></svg>
                </div>
                <div class="applemusic-more-menu-item" onclick="applemusicCloseLibraryMenu(); applemusicOpenImportPlaylistModal();">
                    <span>导入歌单</span>
                    <svg viewBox="0 0 24 24" style="width: 20px; height: 20px; fill: currentColor; stroke: none !important; transform: translateX(1.5px);">
                      <g id="Playlist-Download--Streamline-Ultimate.svg">
                        <path d="M17.5 11a6.5 6.5 0 1 0 6.5 6.5 6.51 6.51 0 0 0 -6.5 -6.5Zm2.39 7.31 -2 2.5a0.5 0.5 0 0 1 -0.78 0l-2 -2.5a0.5 0.5 0 0 1 0.39 -0.81h1a0.25 0.25 0 0 0 0.25 -0.25V14.5a0.75 0.75 0 0 1 1.5 0v2.75a0.25 0.25 0 0 0 0.25 0.25h1a0.5 0.5 0 0 1 0.39 0.81Z"></path>
                        <path d="M16.32 9.53a0.25 0.25 0 0 0 0.22 -0.25V2.5A2.47 2.47 0 0 0 14.1 0H2.43A2.47 2.47 0 0 0 0 2.5v12A2.47 2.47 0 0 0 2.43 17H9a0.24 0.24 0 0 0 0.24 -0.23 7.92 7.92 0 0 1 7.08 -7.24ZM11.19 8a1 1 0 0 1 -1 -1A1.78 1.78 0 0 0 9 5.23a0.19 0.19 0 0 0 -0.25 0.18V11a2.46 2.46 0 0 1 -2.43 2.5 2.5 2.5 0 0 1 0 -5h0.22a0.26 0.26 0 0 0 0.19 -0.06 0.27 0.27 0 0 0 0.08 -0.19V4a1 1 0 0 1 1 -1c1.52 0 4.38 0.84 4.38 4a1 1 0 0 1 -1 1Z"></path>
                      </g>
                    </svg>
                </div>
                <div class="applemusic-more-menu-item" onclick="applemusicCloseLibraryMenu(); applemusicOpenLocalMusicModal();">
                    <span>本地音乐</span>
                    <svg viewBox="0 0 1024 1024" style="width: 18.5px !important; height: 18.5px !important; fill: currentColor; stroke: none !important;"><path d="M576 256V0H224C170.98 0 128 42.98 128 96v832c0 53 42.98 96 96 96h576c53.02 0 96-42.98 96-96V320H641.8c-37.2 0-65.8-28.6-65.8-64z m115 166.2c8.2 6 13 15.6 13 25.8v320c0 35.24-43 64-96 64s-96-28.8-96-64 43-64 96-64c10.75 0 21.5 1.5 32 4v-152.8l-192 75V832c0 35.24-43 64-96 64s-96-28.8-96-64 43-64 96-64c10.75 0 21.5 1.5 32 4V542.6c0-14 9-26.4 22.6-30.6l256-94.5c9.4-2.9 20.2-1.3 28.4 4.7zM640 0v256h256L640 0z"></path></svg>
                </div>
                <div class="applemusic-more-menu-item" onclick="applemusicCloseLibraryMenu(); applemusicOpenSourceActionSheet();">
                    <span>更换音乐源</span>
                    <svg viewBox="0 0 1024 1024" style="width: 20px; height: 20px; fill: currentColor; stroke: none !important;"><path d="M377.984 85.333333h268.032c8.96 0 15.786667 0 21.76 0.64a111.914667 111.914667 0 0 1 92.117333 71.338667H264.106667a111.914667 111.914667 0 0 1 92.117333-71.338667c5.973333-0.64 12.8-0.64 21.76-0.64zM293.546667 201.514667c-53.418667 0-97.194667 35.84-111.786667 83.370666a119.466667 119.466667 0 0 0-0.896 2.986667c15.274667-5.12 31.146667-8.533333 47.274667-10.794667 41.514667-5.930667 93.952-5.930667 154.837333-5.930666h264.661333c60.885333 0 113.322667 0 154.837334 5.930666 16.085333 2.304 32 5.632 47.274666 10.794667a117.76 117.76 0 0 0-0.853333-2.986667c-14.634667-47.530667-58.410667-83.370667-111.786667-83.370666H293.504zM448 693.333333a32 32 0 1 1 0 64 32 32 0 0 1 0-64z"></path><path d="M639.786667 321.792c129.578667 0 194.389333 0 230.784 42.112 36.394667 42.112 27.818667 107.136 10.666666 237.226667l-16.213333 123.392c-13.44 102.016-20.138667 153.045333-54.613333 183.594666-34.432 30.549333-85.248 30.549333-186.88 30.549334H400.469333c-101.632 0-152.448 0-186.88-30.549334-34.474667-30.549333-41.173333-81.578667-54.613333-183.594666l-16.213333-123.392c-17.152-130.090667-25.728-195.114667 10.666666-237.226667 36.394667-42.112 101.205333-42.112 230.826667-42.112h255.530667zM544 448a32 32 0 0 0-64 0v186.794667A96 96 0 1 0 544 725.333333v-157.013333c28.586667 23.168 64.512 39.68 96 39.68a32 32 0 0 0 0-64c-13.013333 0-37.802667-9.344-60.416-29.44-22.144-19.626667-35.584-43.562667-35.584-66.56z"></path></svg>
                </div>

            </div>
        </div>

        <!-- Apple Music 歌手主页右上角更多菜单 -->
        <div class="applemusic-more-menu-overlay" id="applemusicArtistMoreMenuOverlay" onclick="applemusicCloseArtistMoreMenu()">
            <div class="applemusic-more-menu" id="applemusicArtistMoreMenu" onclick="event.stopPropagation()">
                <div class="applemusic-more-menu-item" onclick="applemusicArtistMenuToggleStar()">
                    <span id="applemusic-artist-menu-fav-text">收藏艺人</span>
                    <svg viewBox="0 0 1024 1024" style="width: 20px; height: 20px; fill: currentColor; stroke: none !important;"><path d="M781.186088 616.031873q17.338645 80.573705 30.59761 145.848606 6.119522 27.537849 11.219124 55.075697t9.689243 49.976096 7.649402 38.247012 4.079681 19.888446q3.059761 20.398406-9.179283 27.027888t-27.537849 6.629482q-5.099602 0-14.788845-3.569721t-14.788845-5.609562l-266.199203-155.027888q-72.414343 42.836653-131.569721 76.494024-25.498008 14.278884-50.486056 28.557769t-45.386454 26.517928-35.187251 20.398406-19.888446 10.199203q-10.199203 5.099602-20.908367 3.569721t-19.378486-7.649402-12.749004-14.788845-2.039841-17.848606q1.01992-4.079681 5.099602-19.888446t9.179283-37.737052 11.729084-48.446215 13.768924-54.055777q15.298805-63.23506 34.677291-142.788845-60.175299-52.015936-108.111554-92.812749-20.398406-17.338645-40.286853-34.167331t-35.697211-30.59761-26.007968-22.438247-11.219124-9.689243q-12.239044-11.219124-20.908367-24.988048t-6.629482-28.047809 11.219124-22.438247 20.398406-10.199203l315.155378-28.557769 117.290837-273.338645q6.119522-16.318725 17.338645-28.047809t30.59761-11.729084q10.199203 0 17.848606 4.589641t12.749004 10.709163 8.669323 12.239044 5.609562 10.199203l114.231076 273.338645 315.155378 29.577689q20.398406 5.099602 28.557769 12.239044t8.159363 22.438247q0 14.278884-8.669323 24.988048t-21.928287 26.007968z"></path></svg>
                </div>
                <div class="applemusic-more-menu-item" onclick="applemusicCloseArtistMoreMenu(); applemusicOpenEditArtistModal();">
                    <span>编辑艺人</span>
                    <svg viewBox="0 0 1024 1024" style="width: 20px; height: 20px; fill: currentColor; stroke: none !important;"><path d="M943.104 216.064q-8.192 9.216-15.36 16.384l-12.288 12.288q-6.144 6.144-11.264 10.24l-138.24-139.264q8.192-8.192 20.48-19.456t20.48-17.408q20.48-16.384 44.032-14.336t37.888 9.216q15.36 8.192 34.304 28.672t29.184 43.008q5.12 14.336 6.656 33.792t-15.872 36.864zM551.936 329.728l158.72-158.72 138.24 138.24q-87.04 87.04-158.72 157.696-30.72 29.696-59.904 58.88t-53.248 52.224-39.424 38.4l-18.432 18.432q-7.168 7.168-16.384 14.336t-20.48 12.288-31.232 12.288-41.472 13.824-40.96 12.288-29.696 6.656q-19.456 2.048-20.992-3.584t1.536-25.088q1.024-10.24 5.12-30.208t8.192-40.448 8.704-38.4 7.68-25.088q5.12-11.264 10.752-19.456t15.872-18.432zM899.072 478.208q21.504 0 40.96 10.24t19.456 41.984l0 232.448q0 28.672-10.752 52.736t-29.184 41.984-41.984 27.648-48.128 9.728l-571.392 0q-24.576 0-48.128-10.752t-41.472-29.184-29.184-43.52-11.264-53.76l0-570.368q0-20.48 11.264-42.496t29.184-39.936 40.448-29.696 45.056-11.776l238.592 0q28.672 0 40.448 20.992t11.776 42.496-11.776 41.472-40.448 19.968l-187.392 0q-21.504 0-34.816 14.848t-13.312 36.352l0 481.28q0 20.48 13.312 34.304t34.816 13.824l474.112 0q21.504 0 36.864-13.824t15.36-34.304l0-190.464q0-14.336 6.656-24.576t16.384-16.384 21.504-8.704 23.04-2.56z"></path></svg>
                </div>
                <div class="applemusic-more-menu-item" onclick="applemusicCloseArtistMoreMenu(); applemusicOpenArtistImportSongModal();">
                    <span>导入音乐</span>
                    <svg viewBox="0 0 1024 1024" style="width: 20px; height: 20px; fill: currentColor; stroke: none !important;"><path d="M841.565091 212.759273a65.908364 65.908364 0 0 1 65.908364 70.528l-36.910546 549.050182a83.712 83.712 0 0 1-83.048727 75.136H236.485818a82.385455 82.385455 0 0 1-82.385454-75.136l-37.573819-549.050182a65.908364 65.908364 0 0 1 65.908364-70.528z m-307.677091 141.847272l-4.084364 0.523637a26.368 26.368 0 0 0-18.455272 9.227636 38.888727 38.888727 0 0 0-6.586182 21.748364v244.538182a99.525818 99.525818 0 0 0-20.433455-5.934546 125.893818 125.893818 0 0 0-32.302545 0 163.467636 163.467636 0 0 0-37.573818 7.249455 88.32 88.32 0 0 0-35.595637 24.436363 50.757818 50.757818 0 0 0-17.140363 36.247273 65.908364 65.908364 0 0 0 11.205818 36.247273 87.773091 87.773091 0 0 0 33.617454 27.019636 92.602182 92.602182 0 0 0 47.453091 9.890909 131.828364 131.828364 0 0 0 44.218182-9.890909 90.996364 90.996364 0 0 0 27.682909-20.433454 58.658909 58.658909 0 0 0 14.498909-24.436364 65.908364 65.908364 0 0 0 3.293091-24.436364V443.508364a10.542545 10.542545 0 0 1 5.271273-9.890909c3.956364-1.314909 8.564364 0.663273 15.127273 6.586181a345.390545 345.390545 0 0 0 26.368 23.726546 89.774545 89.774545 0 0 0 35.584 16.430545 51.409455 51.409455 0 0 1 28.346181 11.869091 39.563636 39.563636 0 0 1 11.869091 25.704727 42.181818 42.181818 0 0 0 3.293091 14.49891 6.912 6.912 0 0 0 5.934546 4.654545q3.362909 1.28 7.912727-5.934545a52.072727 52.072727 0 0 0 5.934545-17.140364 51.409455 51.409455 0 0 0 0-22.411636 46.138182 46.138182 0 0 0-12.520727-24.436364 77.125818 77.125818 0 0 0-19.141818-17.838546l-17.140364-9.227636-19.118545-7.912727a150.935273 150.935273 0 0 1-23.074909-15.127273 107.438545 107.438545 0 0 1-25.041455-23.074909 175.325091 175.325091 0 0 1-15.813818-21.096727 65.92 65.92 0 0 0-12.520727-13.847273 15.813818 15.813818 0 0 0-15.127273-3.956364z m219.357091-238.08a81.733818 81.733818 0 0 1 79.755636 65.908364H190.347636a81.733818 81.733818 0 0 1 79.755637-65.908364z"></path></svg>
                </div>
                <div class="applemusic-more-menu-item" onclick="applemusicCloseArtistMoreMenu(); applemusicShareArtist();">
                    <span>分享艺人...</span>
                    <svg viewBox="0 0 1024 1024" style="width: 22px !important; height: 22px !important; fill: currentColor; stroke: none !important;"><path d="M237.1 589.6c0 40.7 7.2 77 19.4 113.2 48.3-131.3 176.6-226.4 329-226.4v40.7c0 53 65.1 83 110 50.5l214.3-155c35.4-25.6 35.4-75.5 0-101.1l-214.2-155c-44.8-32.4-110-2.5-110 50.5v42.9C393 251.4 237.1 402.6 237.1 589.6z m0 0"></path><path d="M895.7 561.6c-27.1 0-49 20.5-49 45.9v125.9c0 38.1-33 69-73.8 69H252.7c-40.8 0-73.8-30.9-73.8-69V371.2c0-38.1 33-69 73.8-69h50.6c27.1 0 49-20.5 49-45.9s-21.9-45.9-49-45.9h-50.6c-94.9 0-171.7 72-171.7 160.7v362.2C81 822.1 157.9 894 252.7 894h520.2c94.9 0 171.7-72 171.7-160.7V607.4c0.2-25.3-21.7-45.8-48.9-45.8z m0 0"></path></svg>
                </div>
                <div class="applemusic-more-menu-item" onclick="applemusicCloseArtistMoreMenu(); applemusicPlayArtistAllSongs();">
                    <span>播放热门歌曲</span>
                    <svg viewBox="0 0 1024 1024" style="width: 20px; height: 20px; fill: currentColor; stroke: none !important;"><path d="M512.1 63.9c-247.4 0-447.9 200.5-447.9 447.9 0 247.4 200.5 447.9 447.9 447.9S960 759.2 960 511.8c0.1-247.4-200.5-447.9-447.9-447.9z m210.5 480.2L413.7 722.4c-24.9 14.4-56-3.6-56-32.3V333.5c0-28.7 31.1-46.7 56-32.3l308.8 178.3c24.9 14.3 24.9 50.3 0.1 64.6z"></path></svg>
                </div>
            </div>
        </div>

        <!-- 歌手简介居中毛玻璃弹窗 -->
        <div id="applemusic-artist-bio-modal" class="applemusic-invite-overlay" onclick="applemusicCloseArtistBioModal()">
            <div class="applemusic-invite-glass-panel" style="width: 88%; max-width: 360px; max-height: 75vh; padding: 22px 20px;" onclick="event.stopPropagation()">
                <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 16px;">
                    <div style="display: flex; align-items: center; gap: 10px;">
                        <img id="applemusic-artist-bio-avatar" src="" style="width: 38px; height: 38px; border-radius: 50%; object-fit: cover; background: #eee;">
                        <div>
                            <div id="applemusic-artist-bio-name" style="font-size: 17px; font-weight: 700; color: #1c1c1e;">歌手名字</div>
                            <div style="font-size: 12px; color: #8e8e93;">艺人简介</div>
                        </div>
                    </div>
                    <div onclick="applemusicCloseArtistBioModal()" style="width: 28px; height: 28px; border-radius: 50%; background: rgba(0,0,0,0.06); display: flex; align-items: center; justify-content: center; cursor: pointer; color: #8e8e93;">
                        <svg viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" stroke-width="2.5" fill="none"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                    </div>
                </div>
                <div id="applemusic-artist-bio-desc" style="font-size: 14px; line-height: 1.6; color: #3a3a3c; overflow-y: auto; max-height: 50vh; white-space: pre-wrap; word-break: break-word; text-align: left; padding: 4px 2px;">
                    加载中...
                </div>
            </div>
        </div>

        <!-- ================= 编辑艺人弹窗 ================= -->
        <div id="applemusic-modal-edit-artist" class="applemusic-modal-overlay" onclick="applemusicCloseEditArtistModal()">
            <div class="applemusic-modal-content" style="height: 90vh; position: relative; display: flex; flex-direction: column; overflow: hidden;" onclick="event.stopPropagation()">
                <div class="applemusic-modal-header" style="border-bottom: none; padding-bottom: 10px; flex-shrink: 0;">
                    <div class="applemusic-modal-btn" onclick="applemusicCloseEditArtistModal()" style="width: 32px; height: 32px; border-radius: 50%; border: 1px solid rgba(0,0,0,0.1); display: flex; align-items: center; justify-content: center; color: #000; background: rgba(255, 255, 255, 0.75); backdrop-filter: blur(20px); -webkit-backdrop-filter: blur(20px);">
                        <svg viewBox="0 0 24 24" width="20" height="20" stroke="currentColor" stroke-width="2" fill="none"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                    </div>
                    <div class="applemusic-modal-title">编辑艺人</div>
                    <div class="applemusic-modal-btn applemusic-create applemusic-active" onclick="applemusicSaveEditedArtist()" style="width: 32px; height: 32px; border-radius: 50%; background: #fa243c; display: flex; align-items: center; justify-content: center; color: #fff;">
                        <svg viewBox="0 0 24 24" width="20" height="20" stroke="currentColor" stroke-width="3" fill="none" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
                    </div>
                </div>
                <div class="applemusic-modal-body" style="padding-top: 10px; overflow-y: auto; overflow-x: hidden; flex: 1; min-height: 0; display: block; width: 100%;">
                    <div style="display: flex; justify-content: center; margin-bottom: 20px;">
                        <div class="applemusic-cover-upload-area" style="width: 150px; height: 150px; margin-bottom: 0; border-radius: 50%; box-shadow: 0 4px 15px rgba(0,0,0,0.08); overflow: hidden;" onclick="applemusicTriggerEditArtistCoverUpload(event)">
                            <img id="applemusic-edit-artist-cover" src="" style="display: block; width: 100%; height: 100%; object-fit: cover;">
                            <div class="applemusic-camera-icon-wrapper" style="width: 48px; height: 48px; position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%);">
                                <svg viewBox="0 0 24 24" style="width: 24px; height: 24px;"><path d="M4 4h3l2-2h6l2 2h3c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2zm8 3c-2.76 0-5 2.24-5 5s2.24 5 5 5 5-2.24 5-5-2.24-5-5-5zm0 8c-1.65 0-3-1.35-3-3s1.35-3 3-3 3 1.35 3 3-1.35 3-3 3z"/></svg>
                            </div>
                        </div>
                    </div>
                    <div style="display: flex; justify-content: center; margin-bottom: 20px; padding: 0 20px;">
                        <input type="text" id="applemusic-edit-artist-name" style="width: 80%; max-width: 260px; border: none; border-bottom: 1px solid rgba(0, 0, 0, 0.15); border-radius: 0; padding: 6px 0 8px; font-size: 16px; font-weight: 600; color: #1c1c1e; background: transparent; outline: none; text-align: center; box-sizing: border-box;" placeholder="艺人名字">
                    </div>
                    <div id="applemusic-edit-artist-song-list" style="padding: 0 20px; padding-bottom: 80px; position: relative;">
                        <!-- 动态渲染艺人歌曲列表 -->
                    </div>
                </div>
                <!-- 悬浮删除按钮 -->
                <div id="applemusic-edit-artist-delete-btn" style="display: flex; position: absolute; bottom: 40px; left: 20px; width: 50px; height: 50px; border-radius: 50%; background: #fff; box-shadow: 0 4px 15px rgba(0,0,0,0.15); align-items: center; justify-content: center; cursor: pointer; color: #ff3b30; opacity: 0.5; pointer-events: none; transition: opacity 0.2s; z-index: 9999;" onclick="if(confirm('确定要删除选中的艺人歌曲吗？')) applemusicDeleteSelectedArtistSongs()">
                    <svg viewBox="0 0 1090 1024" style="width: 22px; height: 22px; fill: currentColor;"><path d="M1041.573137 144.201227H47.326931a47.390372 47.390372 0 0 0 0 94.717303h109.816245v581.245772a204.089462 204.089462 0 0 0 203.772257 203.835698h367.069202a204.089462 204.089462 0 0 0 203.835698-203.835698V238.791649h109.752804a47.326931 47.326931 0 1 0 0-94.590422z m-556.947897 580.421039a47.390372 47.390372 0 0 1-94.717304 0V427.338083a47.390372 47.390372 0 0 1 94.717304 0z m214.24001 0a47.390372 47.390372 0 0 1-94.717304 0V427.338083a47.390372 47.390372 0 0 1 94.717304 0z m-335.665944-629.968403h362.501456a47.326931 47.326931 0 1 0 0-94.653863H363.199306a47.326931 47.326931 0 0 0 0 94.653863z"></path></svg>
                </div>
            </div>
        </div>

        <!-- ================= 导入音乐至艺人多选抽屉 ================= -->
        <div id="applemusic-modal-artist-import-songs" class="applemusic-modal-overlay" onclick="applemusicCloseArtistImportSongModal()">
            <div class="applemusic-modal-content" style="height: 85vh; border-radius: 16px 16px 0 0; display: flex; flex-direction: column;" onclick="event.stopPropagation()">
                <div class="applemusic-drawer-handle-bar"></div>
                <div class="applemusic-modal-header" style="flex-shrink: 0;">
                    <div class="applemusic-modal-btn" onclick="applemusicCloseArtistImportSongModal()" style="width: 32px; height: 32px; border-radius: 50%; border: 1px solid rgba(0,0,0,0.1); display: flex; align-items: center; justify-content: center; color: #000; background: rgba(255, 255, 255, 0.75); backdrop-filter: blur(20px); -webkit-backdrop-filter: blur(20px);">
                        <svg viewBox="0 0 24 24" width="20" height="20" stroke="currentColor" stroke-width="2" fill="none"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                    </div>
                    <div class="applemusic-modal-title">导入音乐至艺人</div>
                    <div class="applemusic-modal-btn applemusic-create applemusic-active" onclick="applemusicExecuteArtistImportSongs()" style="width: 32px; height: 32px; border-radius: 50%; background: #fa243c; display: flex; align-items: center; justify-content: center; color: #fff;">
                        <svg viewBox="0 0 24 24" width="20" height="20" stroke="currentColor" stroke-width="3" fill="none" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
                    </div>
                </div>
                <div style="padding: 0 20px 10px; display: flex; justify-content: space-between; align-items: center; flex-shrink: 0;">
                    <span style="font-size: 13px; color: #8e8e93;">勾选需要加入艺人主页的歌曲</span>
                    <span onclick="applemusicToggleSelectAllArtistImport()" style="font-size: 13px; font-weight: 600; color: #fa243c; cursor: pointer;">全选</span>
                </div>
                <div class="applemusic-modal-body" id="applemusic-artist-import-song-list" style="padding: 0 20px 40px; overflow-y: auto; flex: 1; min-height: 0; display: block; width: 100%;">
                    <!-- 动态渲染曲库歌曲供选择 -->
                </div>
            </div>
        </div>

        <!-- ================= 本地音乐导入弹窗 ================= -->
        <div id="applemusic-modal-local-music" class="applemusic-modal-overlay" onclick="applemusicCloseLocalMusicModal()">
            <div class="applemusic-modal-content" style="height: 90vh; border-radius: 16px 16px 0 0;" onclick="event.stopPropagation()">
                <div class="applemusic-drawer-handle-bar"></div>
                <div class="applemusic-modal-header">
                    <div class="applemusic-modal-btn" onclick="applemusicCloseLocalMusicModal()" style="width: 32px; height: 32px; border-radius: 50%; border: 1px solid rgba(0,0,0,0.1); display: flex; align-items: center; justify-content: center; color: #000; background: rgba(255, 255, 255, 0.75); backdrop-filter: blur(20px); -webkit-backdrop-filter: blur(20px);">
                        <svg viewBox="0 0 24 24" width="20" height="20" stroke="currentColor" stroke-width="2" fill="none"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                    </div>
                    <div class="applemusic-modal-title">导入本地音乐</div>
                    <div class="applemusic-modal-btn applemusic-create applemusic-active" onclick="applemusicSubmitLocalMusic()" style="width: 32px; height: 32px; border-radius: 50%; background: #fa243c; display: flex; align-items: center; justify-content: center; color: #fff;">
                        <svg viewBox="0 0 24 24" width="20" height="20" stroke="currentColor" stroke-width="3" fill="none" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
                    </div>
                </div>
                <div class="applemusic-modal-body" style="padding: 0; overflow-y: auto; display: block; text-align: left;">

                    <!-- 顶部自定义封面区 -->
                    <div style="display: flex; justify-content: center; padding-top: 10px; margin-bottom: 16px;">
                        <div class="applemusic-cover-upload-area" style="width: 140px; height: 140px; margin-bottom: 0; border-radius: 8px; border: 1px solid rgba(0,0,0,0.08); box-shadow: 0 2px 8px rgba(0,0,0,0.03);" onclick="applemusicTriggerLocalCoverUpload(event)">
                            <img id="applemusic-local-song-cover" src="" style="display: none; width: 100%; height: 100%; object-fit: cover; border-radius: 8px;">
                            <div class="applemusic-camera-icon-wrapper" id="applemusic-local-camera-icon" style="width: 44px; height: 44px; background: #fa243c; position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%);">
                                <svg viewBox="0 0 24 24" style="width: 22px; height: 22px;"><path d="M4 4h3l2-2h6l2 2h3c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2zm8 3c-2.76 0-5 2.24-5 5s2.24 5 5 5 5-2.24 5-5-2.24-5-5-5zm0 8c-1.65 0-3-1.35-3-3s1.35-3 3-3 3 1.35 3 3-1.35 3-3 3z"/></svg>
                            </div>
                        </div>
                    </div>

                    <div style="padding: 0 20px 40px 20px;">
                        <div class="applemusic-settings-group" id="applemusic-local-playlist-group" style="margin: 0 0 14px 0; border-radius: 8px; border: 1px solid rgba(0,0,0,0.08); background: #f7f7f8;">
                            <div class="applemusic-settings-item" style="cursor: pointer;" onclick="applemusicOpenLocalPlaylistDrawer()">
                                <div class="applemusic-settings-label" style="width: auto; flex: 1;">添加到歌单</div>
                                <div class="applemusic-settings-value right-align text-blue" id="applemusic-local-playlist-name" style="font-size: 15px; color: #1c1c1e; font-weight: 600;">心动歌曲</div>
                                <svg class="arrow-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="width: 18px; height: 18px; stroke: #c7c7cc; margin-left: 8px;"><polyline points="9 18 15 12 9 6"></polyline></svg>
                            </div>
                        </div>

                        <div class="applemusic-settings-group" style="margin: 0 0 14px 0; border-radius: 8px; border: 1px solid rgba(0,0,0,0.08); background: #f7f7f8;">
                            <div class="applemusic-settings-item" style="flex-direction: column; align-items: flex-start; gap: 8px; border-bottom: none; padding-bottom: 16px;">
                                <div class="applemusic-settings-label">音频文件 (优先)</div>
                                <label class="applemusic-file-upload-btn">
                                    <span>📄 点击选择音频文件</span>
                                    <input type="file" id="applemusic-local-audio-file" accept="audio/*,video/mp4">
                                </label>
                                <div id="applemusic-local-audio-filename" style="font-size: 13px; color: #636366; margin-top: 4px; word-break: break-all;"></div>
                            </div>
                            <div class="applemusic-settings-item" style="flex-direction: column; align-items: flex-start; gap: 8px; border-top: 1px solid rgba(0,0,0,0.05);">
                                <div class="applemusic-settings-label">或 音频 URL (mp3/mp4)</div>
                                <input type="text" id="applemusic-local-audio-url" placeholder="https://..." style="width: 100%; border: none; outline: none; background: transparent; font-size: 15px; color: var(--text-main);">
                            </div>
                        </div>

                        <div class="applemusic-settings-group" style="margin: 0 0 14px 0; border-radius: 8px; border: 1px solid rgba(0,0,0,0.08); background: #f7f7f8;">
                            <div class="applemusic-settings-item" style="flex-direction: column; align-items: flex-start; gap: 8px;">
                                <div class="applemusic-settings-label">歌名 (选填)</div>
                                <input type="text" id="applemusic-local-song-name" placeholder="未知歌名" style="width: 100%; border: none; outline: none; background: transparent; font-size: 15px; color: var(--text-main);">
                            </div>
                            <div class="applemusic-settings-item" style="flex-direction: column; align-items: flex-start; gap: 8px;">
                                <div class="applemusic-settings-label">歌手 (选填)</div>
                                <input type="text" id="applemusic-local-song-artist" placeholder="未知歌手" style="width: 100%; border: none; outline: none; background: transparent; font-size: 15px; color: var(--text-main);">
                            </div>
                        </div>

                        <div class="applemusic-settings-group" style="margin: 0 0 14px 0; border-radius: 8px; border: 1px solid rgba(0,0,0,0.08); background: #f7f7f8;">
                            <div class="applemusic-settings-item" style="flex-direction: column; align-items: flex-start; gap: 8px; border-bottom: none; padding-bottom: 16px;">
                                <div class="applemusic-settings-label">歌词文件 (.lrc) (选填)</div>
                                <label class="applemusic-file-upload-btn">
                                    <span>📄 点击选择歌词文件</span>
                                    <input type="file" id="applemusic-local-lyric-file" accept=".lrc">
                                </label>
                                <div id="applemusic-local-lyric-filename" style="font-size: 13px; color: #636366; margin-top: 4px; word-break: break-all;"></div>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </div>

        <!-- ================= 导入歌单弹窗 ================= -->
        <div id="applemusic-modal-import-playlist" class="applemusic-modal-overlay" onclick="applemusicCloseImportPlaylistModal()">
            <div class="applemusic-modal-content" style="height: 85vh; border-radius: 16px 16px 0 0;" onclick="event.stopPropagation()">
                <div class="applemusic-drawer-handle-bar"></div>
                <div class="applemusic-modal-header">
                    <div class="applemusic-modal-btn" onclick="applemusicCloseImportPlaylistModal()" style="width: 32px; height: 32px; border-radius: 50%; border: 1px solid rgba(0,0,0,0.1); display: flex; align-items: center; justify-content: center; color: #000; background: rgba(255, 255, 255, 0.75); backdrop-filter: blur(20px); -webkit-backdrop-filter: blur(20px);">
                        <svg viewBox="0 0 24 24" width="20" height="20" stroke="currentColor" stroke-width="2" fill="none"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                    </div>
                    <div class="applemusic-modal-title">导入网易云歌单</div>
                    <div class="applemusic-modal-btn applemusic-create applemusic-active" onclick="applemusicExecuteImport()" style="width: 32px; height: 32px; border-radius: 50%; background: #fa243c; display: flex; align-items: center; justify-content: center; color: #fff;">
                        <svg viewBox="0 0 24 24" width="20" height="20" stroke="currentColor" stroke-width="3" fill="none" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
                    </div>
                </div>
                <div class="applemusic-modal-body" style="padding: 0; overflow-y: auto; overflow-x: hidden; display: block; text-align: center;">

                    <!-- 手机边框图文教程轮播区 -->
                    <div style="padding-top: 20px; background: #ffffff;">
                        <div class="applemusic-tutorial-carousel-wrapper">
                            <div id="applemusic-tutorial-carousel" class="applemusic-tutorial-carousel">

                                <!-- 教程卡片 1：网易云导入 (一张图显示所有步骤) -->
                                <div class="applemusic-tutorial-card active" data-index="0">
                                    <div class="applemusic-phone-mockup">
                                        <div class="applemusic-phone-notch"></div>
                                        <div class="applemusic-phone-screen mock-ui-bg">
                                            <div class="mock-nav"><div class="mock-back"></div><div class="mock-more"></div></div>
                                            <div class="mock-center-info">
                                                <div class="mock-big-cover"></div>
                                                <div class="mock-title-text">我喜欢的音乐</div>
                                                <div class="mock-author-text">xxx的歌单</div>
                                            </div>
                                            <div class="mock-action-row">
                                                <div class="mock-action-btn active-btn">
                                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 48 48">
                                                      <path fill="currentColor" d="M1.7001 44.7066c-0.3562 -0.1227 -0.6652 -0.3536 -0.8839 -0.6602 -0.2187 -0.3068 -0.3363 -0.6741 -0.3362 -1.0507 0 -8.266 1.66 -14.8764 4.9358 -19.6495C9.3735 17.5794 15.6165 14.4742 24 14.0886V5.0017c0 -0.3542 0.1041 -0.7007 0.2992 -0.9964 0.1952 -0.2957 0.4729 -0.5276 0.7987 -0.6669 0.3255 -0.1393 0.6851 -0.1799 1.0336 -0.1168 0.3486 0.0631 0.671 0.2272 0.9272 0.4718l19.9016 18.997c0.1769 0.169 0.3177 0.3719 0.4138 0.5968 0.0962 0.2249 0.1459 0.4669 0.1459 0.7116 0 0.2444 -0.0497 0.4865 -0.1459 0.7112 -0.0961 0.225 -0.2369 0.4281 -0.4138 0.5971L27.0587 44.3039c-0.2562 0.2447 -0.5786 0.4088 -0.9271 0.4719 -0.3486 0.0631 -0.7082 0.0224 -1.0337 -0.1169 -0.3258 -0.1393 -0.6035 -0.3712 -0.7986 -0.6669 -0.1952 -0.2956 -0.2993 -0.642 -0.2993 -0.9963v-9.0202c-5.0885 0.1538 -8.933 0.9782 -11.9941 2.5601 -3.3074 1.7097 -5.7058 4.2642 -8.2908 7.5762 -0.2319 0.297 -0.5507 0.5139 -0.9119 0.6209 -0.3612 0.1071 -0.7469 0.0987 -1.1031 -0.0238v-0.0023Z"></path>
                                                    </svg>
                                                    分享
                                                </div>
                                                <div class="mock-action-btn">
                                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 14">
                                                      <path fill="currentColor" fill-rule="evenodd" d="M6.998 0.046A6.954 6.954 0 1 1 4.099 13.32l-3.466 0.627a0.5 0.5 0 0 1 -0.556 -0.668l0.994 -2.646A6.954 6.954 0 0 1 6.998 0.046ZM5 7a1 1 0 1 1 -2 0 1 1 0 0 1 2 0Zm2 1a1 1 0 1 0 0 -2 1 1 0 0 0 0 2Zm3 0a1 1 0 1 0 0 -2 1 1 0 0 0 0 2Z" clip-rule="evenodd"></path>
                                                    </svg>
                                                    评论
                                                </div>
                                                <div class="mock-action-btn">
                                                    <svg viewBox="0 0 24 24" fill="currentColor"><path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v16z"></path></svg>
                                                    收藏
                                                </div>
                                            </div>

                                            <!-- 底部半透明分享面板 -->
                                            <div class="mock-share-overlay">
                                                <div class="mock-share-panel-v2">
                                                    <div class="mock-share-title">分享到</div>
                                                    <!-- 第一排：线框图标 -->
                                                    <div class="mock-share-row-v2 top-row">
                                                        <div class="mock-share-item">
                                                            <div class="mock-share-icon-circle">
                                                                <svg role="img" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" id="Neteasecloudmusic--Streamline-Simple-Icons" height="24" width="24"><path d="M13.046 9.388a3.919 3.919 0 0 0 -0.66 0.19c-0.809 0.312 -1.447 0.991 -1.666 1.775a2.269 2.269 0 0 0 -0.074 0.81c0.048 0.546 0.333 1.05 0.764 1.35a1.483 1.483 0 0 0 2.01 -0.286c0.406 -0.531 0.355 -1.183 0.24 -1.636 -0.098 -0.387 -0.22 -0.816 -0.345 -1.249a64.76 64.76 0 0 1 -0.269 -0.954zm-0.82 10.07c-3.984 0 -7.224 -3.24 -7.224 -7.223 0 -0.98 0.226 -3.02 1.884 -4.822A7.188 7.188 0 0 1 9.502 5.6a0.792 0.792 0 1 1 0.587 1.472 5.619 5.619 0 0 0 -2.795 2.462 5.538 5.538 0 0 0 -0.707 2.7 5.645 5.645 0 0 0 5.638 5.638c1.844 0 3.627 -0.953 4.542 -2.428 1.042 -1.68 0.772 -3.931 -0.627 -5.238a3.299 3.299 0 0 0 -1.437 -0.777c0.172 0.589 0.334 1.18 0.494 1.772 0.284 1.12 0.1 2.181 -0.519 2.989 -0.39 0.51 -0.956 0.888 -1.592 1.064a3.038 3.038 0 0 1 -2.58 -0.44 3.45 3.45 0 0 1 -1.44 -2.514c-0.04 -0.467 0.002 -0.93 0.128 -1.376 0.35 -1.256 1.356 -2.339 2.622 -2.826a5.5 5.5 0 0 1 0.823 -0.246l-0.134 -0.505c-0.37 -1.371 0.25 -2.579 1.547 -3.007 0.329 -0.109 0.68 -0.145 1.025 -0.105 0.792 0.09 1.476 0.592 1.709 1.023 0.258 0.507 -0.096 1.153 -0.706 1.153a0.788 0.788 0 0 1 -0.54 -0.213c-0.088 -0.08 -0.163 -0.174 -0.259 -0.247a0.825 0.825 0 0 0 -0.632 -0.166 0.807 0.807 0 0 0 -0.634 0.551c-0.056 0.191 -0.031 0.406 0.02 0.595 0.07 0.256 0.159 0.597 0.217 0.82 1.11 0.098 2.162 0.54 2.97 1.296 1.974 1.844 2.35 4.886 0.892 7.233 -1.197 1.93 -3.509 3.177 -5.889 3.177zM0 12c0 6.627 5.373 12 12 12s12 -5.373 12 -12S18.627 0 12 0 0 5.373 0 12Z" fill="#000000" stroke-width="1"></path></svg>
                                                            </div>
                                                            <div class="mock-share-text"></div>
                                                        </div>
                                                        <div class="mock-share-item">
                                                            <div class="mock-share-icon-circle">
                                                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 14" id="Mail-Send-Envelope--Streamline-Core" height="14" width="14"><g id="mail-send-envelope--envelope-email-message-unopened-sealed-close"><path id="Vector" stroke="#000000" stroke-linecap="round" stroke-linejoin="round" d="M12.5 1.75h-11c-0.552285 0 -1 0.44772 -1 1v8.5c0 0.5523 0.447715 1 1 1h11c0.5523 0 1 -0.4477 1 -1v-8.5c0 -0.55228 -0.4477 -1 -1 -1Z" stroke-width="1"></path><path id="Vector_2" stroke="#000000" stroke-linecap="round" stroke-linejoin="round" d="m0.5 3 5.86 3.52424c0.17969 0.10549 0.40615 0.16326 0.64 0.16326s0.46031 -0.05777 0.64 -0.16326L13.5 3" stroke-width="1"></path></g></svg>
                                                            </div>
                                                            <div class="mock-share-text"></div>
                                                        </div>
                                                        <div class="mock-share-item active">
                                                            <div class="mock-share-icon-circle">
                                                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"></path><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"></path></svg>
                                                            </div>
                                                            <div class="mock-share-text"></div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>

                                            <!-- 气泡提示 (全部在同一屏幕内) -->
                                            <div class="applemusic-tutorial-bubble bubble-step1">1 进入音乐App歌单</div>
                                            <div class="applemusic-tutorial-bubble bubble-step2">2 点击分享按钮</div>
                                            <div class="applemusic-tutorial-bubble bubble-step3">3 点击复制链接</div>
                                        </div>
                                    </div>
                                </div>

                                <!-- 教程卡片 2：链接格式说明 -->
                                <div class="applemusic-tutorial-card" data-index="1">
                                    <div class="applemusic-phone-mockup">
                                        <div class="applemusic-phone-notch"></div>
                                        <div class="applemusic-phone-screen mock-ui-bg" style="justify-content: center; padding: 20px 12px; align-items: center;">
                                            <div style="font-size: 13px; font-weight: 800; margin-bottom: 16px; color: #000;">链接格式说明</div>

                                            <div style="background: #fff; border-radius: 10px; padding: 10px; margin-bottom: 12px; width: 100%; box-shadow: 0 4px 12px rgba(0,0,0,0.05); text-align: left;">
                                                <div style="font-size: 11px; color: #ff3b30; font-weight: 800; margin-bottom: 4px; display: flex; align-items: center; gap: 4px;">
                                                    <svg viewBox="0 0 24 24" width="12" height="12" stroke="currentColor" stroke-width="3" fill="none" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                                                    错误格式
                                                </div>
                                                <div style="font-size: 9px; color: #8e8e93; word-break: break-all; font-weight: 500;">https://163cn.tv...</div>
                                            </div>

                                            <div style="background: #fff; border-radius: 10px; padding: 10px; margin-bottom: 20px; width: 100%; box-shadow: 0 4px 12px rgba(0,0,0,0.05); text-align: left;">
                                                <div style="font-size: 11px; color: #34c759; font-weight: 800; margin-bottom: 4px; display: flex; align-items: center; gap: 4px;">
                                                    <svg viewBox="0 0 24 24" width="12" height="12" stroke="currentColor" stroke-width="3" fill="none" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
                                                    正确格式
                                                </div>
                                                <div style="font-size: 9px; color: #8e8e93; word-break: break-all; font-weight: 500;">https://music.163.com/m/playlist?id=</div>
                                            </div>

                                            <div style="font-size: 10px; color: #fa243c; font-weight: 700; text-align: center; background: rgba(250,36,60,0.1); padding: 8px; border-radius: 8px; width: 100%;">
                                                ⚠️ 请确保导入的歌单为公开
                                            </div>
                                        </div>
                                    </div>
                                </div>

                            </div>
                        </div>
                        <!-- 滑动指示器 -->
                        <div id="applemusic-tutorial-dots" class="applemusic-carousel-dots">
                            <div class="applemusic-carousel-dot active" data-index="0"></div>
                            <div class="applemusic-carousel-dot" data-index="1"></div>
                        </div>
                    </div>

                    <!-- 胶囊输入框与解析按钮 -->
                    <div style="padding: 10px 20px 10px 20px;">
                        <div class="applemusic-capsule-input-wrapper">
                            <input type="text" id="applemusic-import-playlist-input" class="applemusic-capsule-input" placeholder="粘贴歌单链接/个人主页uid">
                            <div class="applemusic-parse-btn" onclick="applemusicParseImportInput()">解析</div>
                        </div>
                        <!-- 状态提示文字 -->
                        <div id="applemusic-import-status-text" style="font-size: 12px; color: #8e8e93; margin-top: 10px; text-align: center; display: none;"></div>
                    </div>

                    <!-- 新增：解析结果预览区 -->
                    <div id="applemusic-import-preview-area" style="display: none; padding: 0 20px 40px 20px; text-align: left;">
                        <div style="font-size: 14px; font-weight: 700; margin-bottom: 10px; display: flex; justify-content: space-between; color: var(--text-main);">
                            <span>解析结果 (请勾选需要导入的歌单)</span>
                            <span style="color: #000000; font-weight: 600; cursor: pointer;" onclick="applemusicSelectAllImport()">全选</span>
                        </div>
                        <div id="applemusic-import-preview-list" style="display: flex; flex-direction: column; gap: 10px;">
                            <!-- 动态渲染 -->
                        </div>
                    </div>

                </div>
            </div>
        </div>

    </div>

    <!-- ================= 悬浮歌词条 (全新白灰虚实双弦轨音乐条) ================= -->
    <div id="applemusic-dynamic-island" style="display: none;">
        <div class="am-track-main-row">
            <div class="applemusic-island-cover-wrapper" id="applemusic-island-cover-wrapper">
                <img src="data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7" class="applemusic-island-cover" id="applemusic-island-cover" alt="">
            </div>
            <div class="applemusic-island-lyric-container">
                <div class="applemusic-island-lyric-text" id="applemusic-island-lyric">
                    <span class="am-lyric-first">音</span><span class="am-lyric-rest">乐，让美好发生</span>
                </div>
            </div>
            <div class="applemusic-ctrl-playpause am-island-play-btn" onclick="event.stopPropagation(); applemusicTogglePlayPause(this)">
                <svg class="applemusic-icon-pause" viewBox="0 0 24 24" fill="currentColor">
                    <rect x="6.25" y="4.5" width="4.5" height="15" rx="1"/>
                    <rect x="13.25" y="4.5" width="4.5" height="15" rx="1"/>
                </svg>
                <svg class="applemusic-icon-play" style="display:none;" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M6.51 18.87c.15.09.32.13.49.13s.36-.05.51-.14l10-6c.3-.18.49-.51.49-.86s-.18-.68-.49-.86l-10-6a.99.99 0 0 0-1.01-.01c-.31.18-.51.51-.51.87v12c0 .36.19.69.51.87Z"></path>
                </svg>
            </div>
        </div>
        <!-- 底部虚实双弦微几何线条 (间距为 0px) -->
        <div class="am-bottom-rail">
            <div class="am-rail-top"></div>
            <div class="am-rail-bottom"></div>
        </div>
    </div>

    <!-- ================= 独立悬浮歌词浮窗 ================= -->
    <div id="applemusic-floating-lyrics-window" style="display: none;">
        <div id="applemusic-floating-lyrics-content"></div>
    </div>

    <!-- ================= 展开的音乐弹窗及遮罩 ================= -->
    <div id="applemusic-island-popup-overlay" onclick="applemusicCloseIslandPopup(event)">
        <div class="applemusic-island-popup" id="applemusic-island-popup" onclick="event.stopPropagation()">
            <!-- 主视图 -->
            <div id="applemusic-popup-main-view">
                <img src="" class="applemusic-popup-cover" id="applemusic-popup-cover" alt="cover">
                <div class="applemusic-popup-info-row">
                    <div class="applemusic-popup-text">
                        <div class="applemusic-popup-title" id="applemusic-popup-title">暂无播放</div>
                        <div class="applemusic-popup-artist" id="applemusic-popup-artist">-</div>
                    </div>
                    <div class="applemusic-popup-waveform">
                        <div></div><div></div><div></div><div></div>
                    </div>
                </div>
                <div class="applemusic-popup-progress-container">
                    <div class="applemusic-popup-progress-bar" id="applemusic-popup-progress-bar" style="cursor: pointer;">
                        <div class="applemusic-popup-progress-fill" id="applemusic-popup-progress-fill"></div>
                    </div>
                    <div class="applemusic-popup-time">
                        <span id="applemusic-popup-time-current">0:00</span>
                        <span id="applemusic-popup-time-duration">-0:00</span>
                    </div>
                </div>
                <div class="applemusic-popup-controls">
                    <div class="applemusic-popup-ctrl-left">
                        <div class="applemusic-action-btn applemusic-star-btn" onclick="applemusicToggleStar(this)" style="background: transparent; width: 40px; height: 40px; padding: 0;">
                            <!-- 未收藏状态：空心描边线条微加粗至 4.2 -->
                            <svg class="applemusic-star-outline applemusic-popup-ctrl-star" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 48 48">
                                <path stroke="#8E8E93" stroke-linejoin="round" stroke-linecap="round" stroke-width="4.2" d="M44.9994 19.4993H28.8747l-4.875 -14.99979 -4.8749 14.99979H3l13.1248 8.9999 -5.0624 14.9998 12.9373 -9.3749L36.937 43.499l-5.0624 -14.9998 13.1248 -8.9999Z"></path>
                            </svg>
                            <!-- 已收藏状态：保持原有实心样式与原浅灰色不变红 -->
                            <svg class="applemusic-star-filled applemusic-popup-ctrl-star" style="display:none;" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 48 48">
                                <path fill="#8E8E93" d="M36.937 44.9994c-0.3157 0.0013 -0.6238 -0.0972 -0.8803 -0.2812l-12.057 -8.7411 -12.0571 8.7411c-0.2576 0.1868 -0.5679 0.2869 -0.8861 0.2857 -0.3182 -0.0012 -0.6278 -0.1035 -0.884 -0.2922 -0.25623 -0.1887 -0.44579 -0.454 -0.54132 -0.7575 -0.09553 -0.3035 -0.09206 -0.6296 0.00994 -0.931L14.3436 29.095 2.1562 20.7373c-0.26398 -0.1809 -0.46322 -0.4414 -0.56861 -0.7436 -0.10538 -0.3021 -0.11139 -0.63 -0.01714 -0.9358 0.09425 -0.3058 0.28382 -0.5734 0.541 -0.7637 0.25719 -0.1904 0.56852 -0.2936 0.88849 -0.2944H18.0354l4.5374 -13.96392c0.0978 -0.30146 0.2885 -0.56423 0.5448 -0.7506 0.2564 -0.18637 0.5651 -0.28674 0.8821 -0.28674 0.3169 0 0.6257 0.10037 0.8821 0.28674 0.2563 0.18637 0.4469 0.44914 0.5447 0.7506L29.964 18.0045h15.0354c0.3203 -0.0002 0.6324 0.1023 0.8903 0.2922 0.258 0.19 0.4483 0.4577 0.5432 0.7637 0.0948 0.306 0.0892 0.6344 -0.0161 0.9369 -0.1053 0.3026 -0.3047 0.5635 -0.569 0.7446l-12.192 8.3531 4.6996 13.9245c0.0761 0.2253 0.0976 0.4657 0.0625 0.701 -0.0351 0.2354 -0.1257 0.459 -0.2642 0.6525 -0.1386 0.1934 -0.3212 0.3511 -0.5328 0.46 -0.2115 0.109 -0.446 0.166 -0.6839 0.1664Z"></path>
                            </svg>
                        </div>
                    </div>
                    <div class="applemusic-popup-ctrl-center">
                        <svg class="applemusic-popup-ctrl-icon" viewBox="0 0 24 24" onclick="applemusicPlayPrevSong()"><path d="M10.7 11.14a1 1 0 0 0 0 1.72l6.6 4.29A1 1 0 0 0 18.8 16.3V7.7a1 1 0 0 0-1.5-.85l-6.6 4.29z"/><path d="M2.7 11.14a1 1 0 0 0 0 1.72l6.6 4.29A1 1 0 0 0 10.8 16.3V7.7a1 1 0 0 0-1.5-.85l-6.6 4.29z"/></svg>
                        <div class="applemusic-ctrl-playpause" onclick="applemusicTogglePlayPause(this)" style="width: 60px; height: 60px; display: flex; align-items: center; justify-content: center;">
                            <!-- 替换为全屏播放器同款的暂停和播放 SVG -->
                            <svg class="applemusic-icon-pause applemusic-popup-ctrl-play" viewBox="0 0 24 24" fill="currentColor"><rect x="6.25" y="4.5" width="4.5" height="15" rx="1"/><rect x="13.25" y="4.5" width="4.5" height="15" rx="1"/></svg>
                            <svg class="applemusic-icon-play applemusic-popup-ctrl-play" style="display:none;" viewBox="0 0 24 24" fill="currentColor"><path d="M6.51 18.87c.15.09.32.13.49.13s.36-.05.51-.14l10-6c.3-.18.49-.51.49-.86s-.18-.68-.49-.86l-10-6a.99.99 0 0 0-1.01-.01c-.31.18-.51.51-.51.87v12c0 .36.19.69.51.87Z"></path></svg>
                        </div>
                        <svg class="applemusic-popup-ctrl-icon" viewBox="0 0 24 24" onclick="applemusicPlayNextSong()"><path d="M13.3 11.14a1 1 0 0 1 0 1.72l-6.6 4.29A1 1 0 0 1 5.2 16.3V7.7a1 1 0 0 1 1.5-.85l6.6 4.29z"/><path d="M21.3 11.14a1 1 0 0 1 0 1.72l-6.6 4.29A1 1 0 0 1 13.2 16.3V7.7a1 1 0 0 1 1.5-.85l6.6 4.29z"/></svg>
                    </div>
                    <div class="applemusic-popup-ctrl-right">
                        <!-- 新增列表按钮 -->
                        <svg class="applemusic-popup-ctrl-list" onclick="applemusicTogglePopupListView(event)" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2.5" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" d="M8.25 6.75h12M8.25 12h12m-12 5.25h12M3.75 6.75h.007v.008H3.75V6.75Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0ZM3.75 12h.007v.008H3.75V12Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm-.375 5.25h.007v.008H3.75v-.008Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z" />
                        </svg>
                    </div>
                </div>
                <div class="applemusic-popup-volume">
                    <svg viewBox="0 0 24 24"><path d="M11 5L6 9H2v6h4l5 4V5z"/></svg>
                    <div class="applemusic-popup-volume-bar">
                        <div class="applemusic-popup-volume-fill"></div>
                    </div>
                    <svg viewBox="0 0 24 24"><path d="M11 5L6 9H2v6h4l5 4V5zM16.5 12c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z"/></svg>
                </div>
                <div class="applemusic-popup-airplay">
                    <div class="applemusic-popup-airplay-btn">
                        <div id="applemusic-popup-airplay-icon-wrap" style="display: flex; align-items: center; justify-content: center;">
                            <svg viewBox="0 0 24 24" style="width: 16px; height: 16px; fill: #000;"><path d="M12 15l-4 5h8l-4-5zm9-11H3c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h4v-2H3V6h18v10h-4v2h4c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2z"/></svg>
                        </div>
                        <span id="applemusic-popup-airplay-text" style="margin-left: 6px;">同频共享</span>
                    </div>
                </div>
            </div>

            <!-- 列表视图 (默认隐藏) -->
            <div id="applemusic-popup-list-view" style="display:none; flex-direction: column; max-height: 400px;">
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 15px; flex-shrink: 0;">
                    <div style="font-size: 18px; font-weight: 700; color: #000;">待播清单</div>
                    <div class="applemusic-glass-btn applemusic-circle" style="width: 30px; height: 30px; background: rgba(0,0,0,0.05); border: none;" onclick="applemusicTogglePopupListView(event)">
                        <svg viewBox="0 0 24 24" style="width: 38px; height: 38px; fill: #000;"><path d="M15.41 16.59L10.83 12l4.58-4.59L14 6l-6 6 6 6 1.41-1.41z"/></svg>
                    </div>
                </div>
                <div id="applemusic-popup-list-container" style="overflow-y: auto; flex: 1; margin: 0 -10px; padding: 0 10px;">
                    <!-- 动态渲染 -->
                </div>
            </div>
        </div>
    </div>

    `;
    const anchor = document.currentScript;
    if (anchor && anchor.parentNode) {
        anchor.insertAdjacentHTML('afterend', html);
    } else {
        document.body.insertAdjacentHTML('beforeend', html);
    }

    // ================= 注入全屏播放器音量与进度条真实拖动逻辑 =================
    function initAppleMusicPlayerControls() {
        const audio = document.getElementById('applemusic-audio-player');
        const progressBar = document.getElementById('applemusic-progress-bar');
        const progressFill = document.getElementById('applemusic-progress-fill');
        const timeCurrent = document.getElementById('applemusic-time-current');
        const timeDuration = document.getElementById('applemusic-time-duration');
        const volumeBar = document.getElementById('applemusic-volume-bar');
        const volumeFill = document.getElementById('applemusic-volume-fill');

        if (!audio) return;

        // 格式化时间辅助函数
        function formatPlayerTime(seconds) {
            if (isNaN(seconds) || seconds < 0) return '0:00';
            const m = Math.floor(seconds / 60);
            const s = Math.floor(seconds % 60);
            return m + ':' + (s < 10 ? '0' : '') + s;
        }

        // ---------- 1. 音量条真实逻辑与拖拽支持 ----------
        if (volumeBar && volumeFill) {
            // 初始化音量条宽度为当前音频音量
            const initVol = audio.volume !== undefined ? audio.volume : 1;
            volumeFill.style.width = (initVol * 100) + '%';

            let isVolDragging = false;

            function updateVolumeByEvent(e) {
                const rect = volumeBar.getBoundingClientRect();
                if (rect.width <= 0) return;
                let ratio = (e.clientX - rect.left) / rect.width;
                ratio = Math.max(0, Math.min(1, ratio));
                audio.volume = ratio;
                volumeFill.style.width = (ratio * 100) + '%';
            }

            volumeBar.addEventListener('pointerdown', (e) => {
                isVolDragging = true;
                volumeBar.setPointerCapture(e.pointerId);
                updateVolumeByEvent(e);
                e.preventDefault();
            });

            volumeBar.addEventListener('pointermove', (e) => {
                if (!isVolDragging) return;
                updateVolumeByEvent(e);
            });

            const stopVolDrag = (e) => {
                if (isVolDragging) {
                    isVolDragging = false;
                    try { volumeBar.releasePointerCapture(e.pointerId); } catch (_) {}
                }
            };
            volumeBar.addEventListener('pointerup', stopVolDrag);
            volumeBar.addEventListener('pointercancel', stopVolDrag);

            // 监听系统/其他逻辑修改音量时的同步更新
            audio.addEventListener('volumechange', () => {
                if (!isVolDragging && volumeFill) {
                    volumeFill.style.width = (audio.volume * 100) + '%';
                }
            });
        }

        // ---------- 2. 音乐进度条拖拽支持 (Pointer Events 标准实现) ----------

        if (progressBar && progressFill) {
            let isProgressDragging = false;
            let lastValidRatio = 0;
            window.__applemusicIsProgressDragging = false;
            window.__applemusicIsSeeking = false;
            let seekFinishTimer = null;
            let lastDragEndTime = 0;

            function updateProgressUI(ratio) {
                ratio = Math.max(0, Math.min(1, ratio));
                lastValidRatio = ratio;
                progressFill.style.width = (ratio * 100) + '%';

                if (audio.duration && Number.isFinite(audio.duration) && audio.duration > 0) {
                    const curTime = ratio * audio.duration;
                    const remainTime = Math.max(0, audio.duration - curTime);
                    if (timeCurrent) timeCurrent.textContent = formatPlayerTime(curTime);
                    if (timeDuration) timeDuration.textContent = '-' + formatPlayerTime(remainTime);
                }
                return ratio;
            }

            function getRatioFromPointer(e) {
                const rect = progressBar.getBoundingClientRect();
                if (rect.width <= 0) return lastValidRatio;
                let clientX = e.clientX;
                if ((clientX === undefined || clientX === 0) && e.touches && e.touches.length > 0) {
                    clientX = e.touches[0].clientX;
                } else if ((clientX === undefined || clientX === 0) && e.changedTouches && e.changedTouches.length > 0) {
                    clientX = e.changedTouches[0].clientX;
                }
                if (clientX === undefined || isNaN(clientX)) return lastValidRatio;
                return Math.max(0, Math.min(1, (clientX - rect.left) / rect.width));
            }

            function handlePointerDown(e) {
                if (!audio.duration || !Number.isFinite(audio.duration)) return;
                isProgressDragging = true;
                window.__applemusicIsProgressDragging = true;
                window.__applemusicIsSeeking = true;
                clearTimeout(seekFinishTimer);

                try { progressBar.setPointerCapture(e.pointerId); } catch (_) {}
                const ratio = getRatioFromPointer(e);
                updateProgressUI(ratio);
                e.preventDefault();
            }

            function handlePointerMove(e) {
                if (!isProgressDragging) return;
                const ratio = getRatioFromPointer(e);
                updateProgressUI(ratio);
                e.preventDefault();
            }

            function handlePointerUp(e) {
                if (!isProgressDragging) return;
                isProgressDragging = false;
                lastDragEndTime = Date.now();

                try { progressBar.releasePointerCapture(e.pointerId); } catch (_) {}

                // 直接使用拖动期间最后确认的有效比例，坚决不使用松手瞬间可能归零的坐标再次计算
                if (audio.duration && Number.isFinite(audio.duration) && audio.duration > 0) {
                    const safeTime = Math.max(0, Math.min(audio.duration - 0.25, lastValidRatio * audio.duration));
                    if (typeof applemusicSeekToPosition === 'function') {
                        applemusicSeekToPosition(safeTime);
                    } else {
                        try { audio.currentTime = safeTime; } catch (_) {}
                    }
                }

                clearTimeout(seekFinishTimer);
                // 保持 600ms 保护窗口，彻底覆盖移动端触屏延迟合成的 click 干扰
                seekFinishTimer = setTimeout(() => {
                    window.__applemusicIsProgressDragging = false;
                    window.__applemusicIsSeeking = false;
                }, 600);
            }

            // A cancelled pointer gesture must never commit a new seek position.
            function handlePointerCancel(e) {
                if (!isProgressDragging) return;
                isProgressDragging = false;
                clearTimeout(seekFinishTimer);
                try { progressBar.releasePointerCapture(e.pointerId); } catch (_) {}
                window.__applemusicIsProgressDragging = false;
                window.__applemusicIsSeeking = false;
                if (Number.isFinite(audio.duration) && audio.duration > 0) {
                    updateProgressUI(audio.currentTime / audio.duration);
                }
            }

            progressBar.addEventListener('pointerdown', handlePointerDown);
            progressBar.addEventListener('pointermove', handlePointerMove);
            progressBar.addEventListener('pointerup', handlePointerUp);
            progressBar.addEventListener('pointercancel', handlePointerCancel);

            // 彻底拦截进度条上的原生 click 事件，进度条的所有交互（点击跳转与拖拽）均由 PointerEvents 纯净处理
            progressBar.addEventListener('click', (e) => {
                e.stopImmediatePropagation();
                e.preventDefault();
            }, true);

            // 跳转就绪监听
            audio.addEventListener('seeked', () => {
                clearTimeout(seekFinishTimer);
                seekFinishTimer = setTimeout(() => {
                    window.__applemusicIsProgressDragging = false;
                    window.__applemusicIsSeeking = false;
                }, 200);
            });

            // 正常播放时更新进度条 (拖拽与 Seek 缓冲期间均锁定)
            audio.addEventListener('timeupdate', () => {
                if (window.__applemusicIsProgressDragging || window.__applemusicIsSeeking) return;
                if (audio.duration && Number.isFinite(audio.duration) && audio.duration > 0) {
                    const pct = Math.max(0, Math.min(100, (audio.currentTime / audio.duration) * 100));
                    progressFill.style.width = pct + '%';
                    if (timeCurrent) timeCurrent.textContent = formatPlayerTime(audio.currentTime);
                    if (timeDuration) timeDuration.textContent = '-' + formatPlayerTime(Math.max(0, audio.duration - audio.currentTime));
                }
            });
        }
    }

    initAppleMusicPlayerControls();

    if (typeof initAppleMusicApp === 'function') initAppleMusicApp();
})();
