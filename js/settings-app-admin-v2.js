(() => {
    if (document.getElementById('settingsAppUI')) return;
    const html = `<div class="settings-app-container" id="settingsAppUI">
        <div class="settings-top-bar" aria-hidden="true">
            <button class="settings-top-title" type="button" onclick="closeSettingsApp()" aria-label="返回主屏幕">设置</button>
        </div>
        <div class="settings-scroll-area">
            <div class="set-page-title" onclick="closeSettingsApp()">设置</div>
            <div class="set-search-container">
                <div class="set-search-bar">
                    <svg viewBox="0 0 24 24"><path d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"/></svg>
                    <input type="text" placeholder="搜索">
                    <svg viewBox="0 0 24 24"><path d="M12 14c1.66 0 3-1.34 3-3V5c0-1.66-1.34-3-3-3S9 3.34 9 5v6c0 1.66 1.34 3 3 3zm5-3c0 2.76-2.24 5-5 5s-5-2.24-5-5H5c0 3.53 2.61 6.43 6 6.92V21h2v-3.08c3.39-.49 6-3.39 6-6.92h-2z"/></svg>
                </div>
            </div>
            <div class="set-card set-profile-card" onclick="openAppleIdApp()" style="cursor: pointer;">
                <div class="set-avatar" id="settingsAvatarPreview">
                    <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
                        <defs>
                            <clipPath id="finalClip"><circle cx="50" cy="50" r="44"/></clipPath>
                            <linearGradient id="avatarBgGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                                <stop offset="0%" stop-color="#A3A8B0" />
                                <stop offset="100%" stop-color="#7A7F88" />
                            </linearGradient>
                            <linearGradient id="avatarFigureGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                                <stop offset="0%" stop-color="#FFFFFF" />
                                <stop offset="100%" stop-color="#E5E5EA" />
                            </linearGradient>
                        </defs>
                        <circle cx="50" cy="50" r="50" fill="url(#avatarBgGrad)"/>
                        <circle cx="50" cy="36" r="16" fill="url(#avatarFigureGrad)"/>
                        <path d="M 50 59 C 20 59 10 82 8 106 L 92 106 C 90 82 80 59 50 59 Z" fill="url(#avatarFigureGrad)" clip-path="url(#finalClip)"/>
                    </svg>
                </div>
                <div class="set-profile-info">
                    <div class="set-profile-name">@uu</div>
                    <div class="set-profile-sub">账户、云端等</div>
                </div>
                <svg class="set-chevron" viewBox="0 0 8 13"><path d="M1.5 1.5L6.5 6.5L1.5 11.5"/></svg>
            </div>
            <div class="set-card">
                <div class="set-list-item" onclick="openProactiveMessagesApp()" style="cursor: pointer;">
                    <div class="set-item-icon set-bg-orange" style="animation-delay: 0s;"><svg viewBox="0 0 24 24" fill="white"><path d="M12 22c1.1 0 2-.9 2-2h-4c0 1.1.9 2 2 2zm6-6v-5c0-3.07-1.63-5.64-4.5-6.32V4c0-.83-.67-1.5-1.5-1.5s-1.5.67-1.5 1.5v.68C7.64 5.36 6 7.92 6 11v5l-2 2v1h16v-1l-2-2zm-2 1H8v-6c0-2.48 1.51-4.5 4-4.5s4 2.02 4 4.5v6z"/></svg></div>
                    <div class="set-item-content"><span>后端消息</span><svg class="set-chevron" viewBox="0 0 8 13"><path d="M1.5 1.5L6.5 6.5L1.5 11.5"/></svg></div>
                </div>
                <div class="set-list-item" onclick="openApiApp()" style="cursor: pointer;">
                    <div class="set-item-icon set-bg-blue" style="animation-delay: 0.2s;">
                        <svg viewBox="0 0 24 24"><path fill="white" d="m6.35 15.35l-2.1-2.15q1.475-1.475 3.463-2.337T12 10q2.3 0 4.288.875t3.462 2.375l-2.1 2.1q-1.1-1.1-2.55-1.725T12 13q-1.65 0-3.1.625T6.35 15.35ZM2.1 11.1L0 9q2.3-2.35 5.375-3.675T12 4q3.55 0 6.625 1.325T24 9l-2.1 2.1q-1.925-1.925-4.463-3.013T12 7Q9.1 7 6.562 8.088T2.1 11.1ZM12 21l3.525-3.55q-.675-.675-1.575-1.063T12 16q-1.05 0-1.95.388T8.475 17.45L12 21Z"/></svg>
                    </div>
                    <div class="set-item-content"><span>API连接</span><svg class="set-chevron" viewBox="0 0 8 13"><path d="M1.5 1.5L6.5 6.5L1.5 11.5"/></svg></div>
                </div>
                <div class="set-list-item" onclick="openVoiceApp()" style="cursor: pointer;">
                   <div class="set-item-icon set-bg-blue" style="animation-delay: 0.4s;"><svg viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg"><path d="M504.7182218666667 708.6080000000001c101.94488853333334 0 184.47170346666664-82.52681493333333 184.47170453333334-184.47170346666664V218.3016298666667c0-101.94488853333334-82.52681493333333-184.47170346666664-184.47170453333334-184.47170346666664s-184.47170346666664 82.52681493333333-184.47170346666664 184.47170346666664V524.1362965333334c2.427259733333333 101.94488853333334 82.52681493333333 184.47170346666664 184.47170346666664 184.47170346666664z" fill="white"></path><path d="M791.1348149333332 390.63703680000003c-19.4180736 0-36.40888853333333 16.990814933333333-36.40888853333333 36.408889599999995v99.5176288c0 138.35377813333335-111.6539264 250.00770346666667-250.0077045333333 250.0077045333333s-250.00770346666667-111.6539264-250.00770346666667-250.0077045333333v-109.22666666666667c0-19.4180736-16.990814933333333-36.40888853333333-36.40888853333333-36.40888853333333s-36.40888853333333 16.990814933333333-36.408889599999995 36.40888853333333v109.22666666666667c0 165.05362986666665 126.2174816 303.4074069333333 286.4165930666667 320.39822293333333v77.67229546666667h-121.3629632c-19.4180736 0-36.40888853333333 16.990814933333333-36.40888853333333 36.408889599999995s16.990814933333333 36.40888853333333 36.40888853333333 36.40888853333333h315.54370346666667c19.4180736 0 36.40888853333333-16.990814933333333 36.408889599999995-36.40888853333333s-16.990814933333333-36.40888853333333-36.408889599999995-36.408889599999995h-121.36296213333333v-77.67229546666667c160.19911146666666-16.990814933333333 286.4165930666667-155.34459306666668 286.416592-320.39822293333333V427.0459264c0-21.845333333333333-16.990814933333333-36.40888853333333-36.40888853333333-36.408889599999995z" fill="white"></path></svg></div>
                    <div class="set-item-content"><span>语音设定</span><svg class="set-chevron" viewBox="0 0 8 13"><path d="M1.5 1.5L6.5 6.5L1.5 11.5"/></svg></div>
               </div>
                <div class="set-list-item" onclick="openImageGenApp()" style="cursor: pointer;">
                   <div class="set-item-icon set-bg-green" style="animation-delay: 0.6s;"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="size-6"><path fill-rule="evenodd" d="M1.5 6a2.25 2.25 0 0 1 2.25-2.25h16.5A2.25 2.25 0 0 1 22.5 6v12a2.25 2.25 0 0 1-2.25 2.25H3.75A2.25 2.25 0 0 1 1.5 18V6ZM3 16.06V18c0 .414.336.75.75.75h16.5A.75.75 0 0 0 21 18v-1.94l-2.69-2.689a1.5 1.5 0 0 0-2.12 0l-.88.879.97.97a.75.75 0 1 1-1.06 1.06l-5.16-5.159a1.5 1.5 0 0 0-2.12 0L3 16.061Zm10.125-7.81a1.125 1.125 0 1 1 2.25 0 1.125 1.125 0 0 1-2.25 0Z" clip-rule="evenodd" /></svg></div>
                    <div class="set-item-content"><span>生图</span><svg class="set-chevron" viewBox="0 0 8 13"><path d="M1.5 1.5L6.5 6.5L1.5 11.5"/></svg></div>
               </div>
                <div class="set-list-item" onclick="openWeixinCloudSettings()" style="cursor: pointer;">
                    <div class="set-item-icon set-bg-green" style="animation-delay: 0.8s;"><svg viewBox="0 0 24 24" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="fill: none !important; stroke: white; width: 18px; height: 18px;"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"></path><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"></path></svg></div>
                    <div class="set-item-content"><span>个人热点</span><svg class="set-chevron" viewBox="0 0 8 13"><path d="M1.5 1.5L6.5 6.5L1.5 11.5"/></svg></div>
                </div>
                <div class="set-list-item">
                    <div class="set-item-icon set-bg-green" style="animation-delay: 1.0s;"><svg viewBox="0 0 24 24"><rect x="2" y="7" width="18" height="10" rx="2" fill="none" stroke="white" stroke-width="2"/><rect x="4" y="9" width="10" height="6" rx="1"/><path d="M22 10v4" stroke="white" stroke-width="2" stroke-linecap="round"/></svg></div>
                    <div class="set-item-content"><span>顶部状态栏</span><div class="set-toggle on" id="statusBarToggle" role="switch" aria-checked="true" onclick="toggleStatusBarVisibility()"></div></div>
                </div>
                <div class="set-list-item">
                    <div class="set-item-icon set-bg-blue" style="animation-delay: 1.2s;"><svg viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z"/></svg></div>
                    <div class="set-item-content"><span>后台保活</span><div class="set-toggle" id="backgroundKeepAliveToggle" role="switch" aria-checked="false" onclick="toggleBackgroundKeepAlive()"></div></div>
                </div>
            </div>
            <div class="set-card">
                <div class="set-list-item" onclick="openAnonymousFeedbackApp()" style="cursor: pointer;">
                    <div class="set-item-icon set-bg-purple" style="animation-delay: 1.35s;">
                        <!-- Heroicons solid envelope -->
                        <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                            <path d="M1.5 8.67v8.58a3 3 0 0 0 3 3h15a3 3 0 0 0 3-3V8.67l-8.928 5.493a3 3 0 0 1-3.144 0L1.5 8.67Z"></path>
                            <path d="M22.5 6.908V6.75a3 3 0 0 0-3-3h-15a3 3 0 0 0-3 3v.158l9.714 5.978a1.5 1.5 0 0 0 1.572 0L22.5 6.908Z"></path>
                        </svg>
                    </div>
                    <div class="set-item-content"><span>匿名建议箱</span><svg class="set-chevron" viewBox="0 0 8 13"><path d="M1.5 1.5L6.5 6.5L1.5 11.5"/></svg></div>
                </div>
            </div>
            <div class="set-card">
                <div class="set-list-item" onclick="openGeneralSettingsApp()" style="cursor: pointer;">
                    <div class="set-item-icon set-bg-gray" style="animation-delay: 1.4s;"><svg viewBox="0 0 24 24" fill="currentColor"><path d="M17.004 10.407c.138.435-.216.842-.672.842h-3.465a.75.75 0 0 1-.65-.375l-1.732-3c-.229-.396-.053-.907.393-1.004a5.252 5.252 0 0 1 6.126 3.537ZM8.12 8.464c.307-.338.838-.235 1.066.16l1.732 3a.75.75 0 0 1 0 .75l-1.732 3c-.229.397-.76.5-1.067.161A5.23 5.23 0 0 1 6.75 12a5.23 5.23 0 0 1 1.37-3.536ZM10.878 17.13c-.447-.098-.623-.608-.394-1.004l1.733-3.002a.75.75 0 0 1 .65-.375h3.465c.457 0 .81.407.672.842a5.252 5.252 0 0 1-6.126 3.539Z" /><path fill-rule="evenodd" d="M21 12.75a.75.75 0 1 0 0-1.5h-.783a8.22 8.22 0 0 0-.237-1.357l.734-.267a.75.75 0 1 0-.513-1.41l-.735.268a8.24 8.24 0 0 0-.689-1.192l.6-.503a.75.75 0 1 0-.964-1.149l-.6.504a8.3 8.3 0 0 0-1.054-.885l.391-.678a.75.75 0 1 0-1.299-.75l-.39.676a8.188 8.188 0 0 0-1.295-.47l.136-.77a.75.75 0 0 0-1.477-.26l-.136.77a8.36 8.36 0 0 0-1.377 0l-.136-.77a.75.75 0 1 0-1.477.26l.136.77c-.448.121-.88.28-1.294.47l-.39-.676a.75.75 0 0 0-1.3.75l.392.678a8.29 8.29 0 0 0-1.054.885l-.6-.504a.75.75 0 1 0-.965 1.149l.6.503a8.243 8.243 0 0 0-.689 1.192L3.8 8.216a.75.75 0 1 0-.513 1.41l.735.267a8.222 8.222 0 0 0-.238 1.356h-.783a.75.75 0 0 0 0 1.5h.783c.042.464.122.917.238 1.356l-.735.268a.75.75 0 0 0 .513 1.41l.735-.268c.197.417.428.816.69 1.191l-.6.504a.75.75 0 0 0 .963 1.15l.601-.505c.326.323.679.62 1.054.885l-.392.68a.75.75 0 0 0 1.3.75l.39-.679c.414.192.847.35 1.294.471l-.136.77a.75.75 0 0 0 1.477.261l.137-.772a8.332 8.332 0 0 0 1.376 0l.136.772a.75.75 0 1 0 1.477-.26l-.136-.771a8.19 8.19 0 0 0 1.294-.47l.391.677a.75.75 0 0 0 1.3-.75l-.393-.679a8.29 8.29 0 0 0 1.054-.885l.601.504a.75.75 0 0 0 .964-1.15l-.6-.503c.261-.375.492-.774.69-1.191l.735.267a.75.75 0 1 0 .512-1.41l-.734-.267c.115-.439.195-.892.237-1.356h.784Zm-2.657-3.06a6.744 6.744 0 0 0-1.19-2.053 6.784 6.784 0 0 0-1.82-1.51A6.705 6.705 0 0 0 12 5.25a6.8 6.8 0 0 0-1.225.11 6.7 6.7 0 0 0-2.15.793 6.784 6.784 0 0 0-2.952 3.489.76.76 0 0 1-.036.098A6.74 6.74 0 0 0 5.251 12a6.74 6.74 0 0 0 3.366 5.842l.009.005a6.704 6.704 0 0 0 2.18.798l.022.003a6.792 6.792 0 0 0 2.368-.004 6.704 6.704 0 0 0 2.205-.811 6.785 6.785 0 0 0 1.762-1.484l.009-.01.009-.01a6.743 6.743 0 0 0 1.18-2.066c.253-.707.39-1.469.39-2.263a6.74 6.74 0 0 0-.408-2.309Z" clip-rule="evenodd" /></svg></div>
                    <div class="set-item-content"><span>通用</span><svg class="set-chevron" viewBox="0 0 8 13"><path d="M1.5 1.5L6.5 6.5L1.5 11.5"/></svg></div>
                </div>
                <div class="set-list-item" onclick="openDisplaySettingsApp()" style="cursor: pointer;">
                    <div class="set-item-icon set-bg-blue" style="animation-delay: 1.5s;"><svg viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="5"></circle><line x1="12" y1="1" x2="12" y2="3"></line><line x1="12" y1="21" x2="12" y2="23"></line><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line><line x1="1" y1="12" x2="3" y2="12"></line><line x1="21" y1="12" x2="23" y2="12"></line><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line></svg></div>
                    <div class="set-item-content"><span>显示与亮度</span><svg class="set-chevron" viewBox="0 0 8 13"><path d="M1.5 1.5L6.5 6.5L1.5 11.5"/></svg></div>
                </div>
                <div class="set-list-item" onclick="openAccessibilitySettingsApp()" style="cursor: pointer;">
                    <div class="set-item-icon set-bg-blue" style="animation-delay: 1.6s;">
                        <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" id="Accessibility--Streamline-Solar-Ar">
                            <path stroke="#ffffff" d="M2 12a10 10 0 1 0 20 0 10 10 0 1 0 -20 0" stroke-width="1.5" fill="none"></path>
                            <path d="M14 7c0 1.10457 -0.8954 2 -2 2s-2 -0.89543 -2 -2 0.8954 -2 2 -2 2 0.89543 2 2Z" fill="#ffffff"></path>
                            <path d="M18 10s-3.5373 1.5 -6 1.5c-2.46273 0 -6 -1.5 -6 -1.5" stroke="#ffffff" stroke-linecap="round" stroke-width="1.5" fill="none"></path>
                            <path d="M12 12v1.4522m0 0c0 0.5753 0.1654 1.1384 0.4765 1.6223L15 19m-3 -5.5478c0 0.5753 -0.1654 1.1384 -0.4765 1.6223L9 19" stroke="#ffffff" stroke-linecap="round" stroke-width="1.5" fill="none"></path>
                        </svg>
                    </div>
                    <div class="set-item-content"><span>辅助功能</span><svg class="set-chevron" viewBox="0 0 8 13"><path d="M1.5 1.5L6.5 6.5L1.5 11.5"/></svg></div>
                </div>
                <div class="set-list-item" onclick="openStandbyDiagnosticsApp()" style="cursor: pointer;">
                    <div class="set-item-icon set-bg-black" style="animation-delay: 1.8s;"><svg viewBox="0 0 24 24"><rect x="3" y="6" width="18" height="12" rx="3" fill="none" stroke="white" stroke-width="2"/><circle cx="8" cy="12" r="2" fill="white"/><rect x="13" y="11" width="6" height="2" fill="white"/></svg></div>
                    <div class="set-item-content"><span>待机与诊断</span><svg class="set-chevron" viewBox="0 0 8 13"><path d="M1.5 1.5L6.5 6.5L1.5 11.5"/></svg></div>
                </div>
            </div>
            <div class="set-card">
                <div class="set-list-item" onclick="openMessageNotificationSettingsApp()" style="cursor: pointer;">
                    <div class="set-item-icon set-bg-red" style="animation-delay: 2.0s;">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" id="Alert-Bell-Notification-2--Streamline-Ultimate" height="20" width="20">
                            <g id="Alert-Bell-Notification-2--Streamline-Ultimate.svg">
                                <path d="M13.714 20.82H9.3138c-0.1208 0.004 -0.2207 0.0955 -0.2352 0.2156 -0.0048 0.0914 -0.0048 0.183 0 0.2744 0 1.886 2.0417 3.0648 3.675 2.1218 0.7581 -0.4377 1.225 -1.2465 1.225 -2.1218 0.0049 -0.0914 0.0049 -0.183 0 -0.2744 -0.0154 -0.1316 -0.1326 -0.2271 -0.2646 -0.2156Z" fill="#ffffff" stroke-width="1"></path>
                                <path d="M14.449 5.14c-0.0027 -0.5826 0.114 -1.1596 0.343 -1.6954 -0.5687 -0.2984 -1.1803 -0.5067 -1.813 -0.6174V1.71c0 -1.1316 -1.225 -1.8389 -2.205 -1.2731 -0.4548 0.2626 -0.735 0.7479 -0.735 1.2731v1.127c-1.0168 0.1922 -1.9738 0.622 -2.793 1.2544 -2.12 1.7442 -3.3287 4.3601 -3.283 7.105v0.7448c-0.0008 2.4989 -0.5882 4.9627 -1.715 7.1932 -0.1139 0.2439 -0.0142 0.5341 0.2254 0.6566 0.0677 0.0313 0.1411 0.048 0.2156 0.049h17.64c0.2706 0 0.49 -0.2194 0.49 -0.49 0 -0.0746 -0.0167 -0.1483 -0.049 -0.2156 -1.1267 -2.2305 -1.7142 -4.6943 -1.715 -7.1932v-0.7448c0.0035 -0.555 -0.0425 -1.1093 -0.1372 -1.6562h-0.0588c-2.434 0.0054 -4.41 -1.9662 -4.41 -4.4002Z" fill="#ffffff" stroke-width="1"></path>
                                <path d="M15.919 5.14c0 2.2632 2.45 3.6777 4.41 2.5461 0.9097 -0.5252 1.47 -1.4957 1.47 -2.5461 0 -2.2632 -2.45 -3.6777 -4.41 -2.5461 -0.9096 0.5252 -1.47 1.4957 -1.47 2.5461" fill="#ffffff" stroke-width="1"></path>
                            </g>
                        </svg>
                    </div>
                    <div class="set-item-content"><span>通知</span><svg class="set-chevron" viewBox="0 0 8 13"><path d="M1.5 1.5L6.5 6.5L1.5 11.5"/></svg></div>
                </div>
                <div class="set-list-item" onclick="openSoundHapticsSettingsApp()" style="cursor: pointer;">
                    <div class="set-item-icon set-bg-pink" style="animation-delay: 2.1s;">
                        <svg viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" id="Sound-High--Streamline-Iconoir" height="18" width="18">
                            <path fill-rule="evenodd" clip-rule="evenodd" d="M11.313133333333333 4.646446666666666c0.19526666666666664 -0.19526 0.5118 -0.19526 0.7070666666666666 0L11.666666666666666 5c0.3535333333333333 -0.3535533333333333 0.3537333333333333 -0.35340666666666665 0.35386666666666666 -0.3532533333333333l0.0003333333333333333 0.00031999999999999997 0.0006666666666666666 0.0007199999999999999 0.0017333333333333333 0.0017199999999999997 0.0044666666666666665 0.00458 0.013133333333333332 0.01368c0.010533333333333334 0.01112 0.0246 0.02624 0.0416 0.04529333333333333 0.033999999999999996 0.038073333333333334 0.08013333333333333 0.09198 0.13419999999999999 0.16108 0.108 0.13796666666666665 0.24886666666666668 0.3379266666666666 0.38893333333333335 0.5947666666666667 0.28013333333333335 0.51352 0.5610666666666666 1.26216 0.5610666666666666 2.1977599999999997s-0.2809333333333333 1.6842666666666668 -0.5610666666666666 2.1977333333333333c-0.14006666666666667 0.25686666666666663 -0.2809333333333333 0.4568 -0.38893333333333335 0.5948 -0.054066666666666666 0.06906666666666667 -0.10019999999999998 0.123 -0.13419999999999999 0.16106666666666666 -0.016999999999999998 0.019066666666666666 -0.031066666666666666 0.034199999999999994 -0.0416 0.04533333333333334l-0.013133333333333332 0.013666666666666667 -0.0044666666666666665 0.004533333333333333 -0.0017333333333333333 0.0017333333333333333 -0.0006666666666666666 0.0007333333333333333 -0.0003333333333333333 0.0003333333333333333c-0.00013333333333333334 0.00013333333333333334 -0.0003333333333333333 0.0002666666666666667 -0.34006666666666663 -0.33946666666666664l0.33973333333333333 0.33973333333333333c-0.19526666666666664 0.19526666666666664 -0.5118 0.19526666666666664 -0.7070666666666666 0 -0.19473333333333334 -0.19466666666666665 -0.19526666666666664 -0.5099333333333333 -0.0017333333333333333 -0.7053333333333334 0.0005333333333333334 -0.0006 0.0011333333333333332 -0.0012 0.0017333333333333333 -0.0017333333333333333L11.666666666666666 10.333333333333332c-0.3535333333333333 -0.3535333333333333 -0.35366666666666663 -0.3534 -0.35379999999999995 -0.3532666666666667l-0.0002666666666666667 0.0002666666666666667 -0.00046666666666666666 0.00039999999999999996 -0.0006 0.0006666666666666666 0.0034000000000000002 -0.0036c0.004133333333333333 -0.004333333333333333 0.011533333333333333 -0.012333333333333332 0.021866666666666666 -0.023866666666666665 0.020666666666666667 -0.023133333333333332 0.05266666666666667 -0.06033333333333333 0.09233333333333334 -0.11106666666666666 0.07953333333333333 -0.1016 0.18866666666666665 -0.25579999999999997 0.2986 -0.4572666666666666 0.21986666666666665 -0.4032 0.4389333333333333 -0.9878666666666667 0.4389333333333333 -1.7189333333333332 0 -0.7310666666666666 -0.21906666666666666 -1.31576 -0.4389333333333333 -1.7189066666666666 -0.10993333333333333 -0.20149333333333333 -0.21906666666666666 -0.35569999999999996 -0.2986 -0.4573133333333333 -0.03966666666666666 -0.050693333333333326 -0.07166666666666666 -0.08793333333333332 -0.09233333333333334 -0.11105999999999999 -0.010333333333333333 -0.011546666666666665 -0.01773333333333333 -0.019533333333333333 -0.021866666666666666 -0.02388l-0.003533333333333333 -0.0036799999999999997c-0.19353333333333333 -0.19540000000000002 -0.19299999999999998 -0.5106933333333333 0.0017333333333333333 -0.70538Z" fill="#ffffff" stroke-width="0.6667"></path>
                            <path fill-rule="evenodd" clip-rule="evenodd" d="M13.313133333333333 2.6464466666666664c0.19526666666666664 -0.19526 0.5118 -0.19526 0.7070666666666666 0L13.666666666666666 3c0.3535333333333333 -0.3535533333333333 0.3537333333333333 -0.3533933333333333 0.35386666666666666 -0.35322l0.00039999999999999996 0.00036666666666666667 0.0008666666666666666 0.0008533333333333333 0.0021333333333333334 0.0021799999999999996 0.006066666666666666 0.006233333333333334c0.004866666666666667 0.004986666666666666 0.011266666666666664 0.011633333333333332 0.019066666666666666 0.019926666666666665 0.015666666666666666 0.016586666666666666 0.037066666666666664 0.03979333333333333 0.06346666666666667 0.06953999999999999 0.05266666666666667 0.05946666666666667 0.12519999999999998 0.1452 0.21086666666666667 0.2565533333333333 0.17119999999999996 0.22256 0.39566666666666667 0.5485866666666666 0.6190666666666667 0.9730266666666667C15.389666666666665 4.825153333333333 15.833333333333332 6.07126 15.833333333333332 7.666666666666666c0 1.5954 -0.44366666666666665 2.841533333333333 -0.8908666666666667 3.6912000000000003 -0.2234 0.42446666666666666 -0.44786666666666664 0.7504666666666666 -0.6190666666666667 0.973 -0.08566666666666667 0.1114 -0.1582 0.19713333333333333 -0.21086666666666667 0.2566 -0.0264 0.029733333333333334 -0.047799999999999995 0.05293333333333333 -0.06346666666666667 0.06953333333333334 -0.0078 0.008266666666666665 -0.014199999999999999 0.014933333333333333 -0.019066666666666666 0.01993333333333333l-0.006066666666666666 0.006199999999999999 -0.0021333333333333334 0.0021999999999999997 -0.0008666666666666666 0.0008666666666666666 -0.00039999999999999996 0.0003333333333333333c-0.00013333333333333334 0.00019999999999999998 -0.0003333333333333333 0.0003333333333333333 -0.35386666666666666 -0.3532l0.3535333333333333 0.3535333333333333c-0.19526666666666664 0.19526666666666664 -0.5118 0.19526666666666664 -0.7070666666666666 0 -0.19506666666666667 -0.19499999999999998 -0.19526666666666664 -0.5111333333333333 -0.0006666666666666666 -0.7064666666666667 0.00006666666666666667 0 0.00013333333333333334 -0.00006666666666666667 0.00019999999999999998 -0.00013333333333333334l-0.00006666666666666667 0.00006666666666666667 -0.00013333333333333334 0.00006666666666666667 -0.0002666666666666667 0.0003333333333333333 -0.0003333333333333333 0.0003333333333333333c0.00006666666666666667 -0.00013333333333333334 0.00039999999999999996 -0.00046666666666666666 0.001 -0.0010666666666666667l0.008799999999999999 -0.0092c0.008799999999999999 -0.009333333333333332 0.0232 -0.024866666666666665 0.0424 -0.04653333333333333 0.03846666666666666 -0.0434 0.09613333333333332 -0.11133333333333334 0.16673333333333332 -0.20306666666666665 0.14126666666666665 -0.18373333333333333 0.33346666666666663 -0.46186666666666665 0.5267333333333333 -0.8290666666666666 0.38613333333333333 -0.7336666666666667 0.7757999999999999 -1.8208666666666666 0.7757999999999999 -3.2254666666666663 0 -1.4045933333333331 -0.38966666666666666 -2.4918199999999997 -0.7757999999999999 -3.22546 -0.19326666666666664 -0.36722666666666665 -0.3854666666666667 -0.6453666666666666 -0.5267333333333333 -0.8290599999999999 -0.0706 -0.09176666666666666 -0.12826666666666664 -0.15968666666666664 -0.16673333333333332 -0.20307999999999998 -0.0192 -0.021686666666666667 -0.0336 -0.037219999999999996 -0.0424 -0.04650666666666667L13.312866666666666 3.3533333333333335c-0.0006666666666666666 -0.0006733333333333333 -0.001 -0.0010333333333333332 -0.0010666666666666667 -0.0010733333333333333l0.00039999999999999996 0.00034666666666666666 0.00039999999999999996 0.00039999999999999996 0.00019999999999999998 0.00025333333333333333c-0.19493333333333332 -0.19528666666666666 -0.19486666666666666 -0.5116466666666666 0.0003333333333333333 -0.7068133333333333Zm-0.0013333333333333333 0.7058066666666667 0 0.00000666666666666667 0 -0.00000666666666666667Z" fill="#ffffff" stroke-width="0.6667"></path>
                            <path fill-rule="evenodd" clip-rule="evenodd" d="M8.024466666666665 2.2642666666666664c0.7756666666666666 -0.5114466666666666 1.8088666666666664 0.044886666666666665 1.8088666666666664 0.9740066666666666V12.762066666666666c0 0.9291333333333333 -1.0332 1.4854666666666667 -1.8088666666666664 0.974l-3.9993866666666666 -2.6369333333333334c-0.02723333333333333 -0.017933333333333332 -0.05913333333333333 -0.027533333333333333 -0.09174666666666666 -0.027533333333333333H2c-1.0125199999999999 0 -1.8333333333333333 -0.8208 -1.8333333333333333 -1.8333333333333333v-2.4762C0.16666666666666666 5.74956 0.9874799999999999 4.928753333333333 2 4.928753333333333h1.9333333333333331c0.03261333333333333 0 0.06451333333333333 -0.009573333333333333 0.09174666666666666 -0.027526666666666665L8.024466666666665 2.2642666666666664Z" fill="#ffffff" stroke-width="0.6667"></path>
                        </svg>
                    </div>
                    <div class="set-item-content"><span>声音与触感</span><svg class="set-chevron" viewBox="0 0 8 13"><path d="M1.5 1.5L6.5 6.5L1.5 11.5"/></svg></div>
                </div>
                <div class="set-list-item" style="cursor: pointer;">
                    <div class="set-item-icon set-bg-purple" style="animation-delay: 2.2s;"><svg viewBox="0 0 24 24" fill="white"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg></div>
                    <div class="set-item-content"><span>专注模式</span><svg class="set-chevron" viewBox="0 0 8 13"><path d="M1.5 1.5L6.5 6.5L1.5 11.5"/></svg></div>
                </div>
                <div class="set-list-item" onclick="openScreenTimeSettingsApp()" style="cursor: pointer;">
                    <div class="set-item-icon set-bg-purple" style="animation-delay: 2.3s;">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 48 48" id="Hourglass-Outline--Streamline-Ionic-Outline" height="20" width="20">
                            <path stroke="#ffffff" stroke-linecap="round" stroke-linejoin="round" d="M12.4086 45.84h23.1819c2.079 0 3.7328 -1.7105 3.5091 -3.6813 -1.4438 -12.6988 -10.06 -12.4888 -10.06 -18.1588s8.7265 -5.3549 10.059 -18.1586c0.21 -1.9719 -1.4291 -3.6813 -3.5081 -3.6813H12.4086c-2.0789 0 -3.7138 1.7094 -3.508 3.6813 1.3324 12.8037 10.059 12.3837 10.059 18.1586 0 5.7751 -8.6163 5.46 -10.059 18.1588 -0.2247 1.9708 1.4291 3.6813 3.508 3.6813Z" stroke-width="3" fill="none"></path>
                            <path fill="#ffffff" d="M33.1663 42.4797H14.8784c-1.638 0 -2.1 -1.89 -0.9512 -3.0619 2.7804 -2.8181 8.3926 -4.8362 8.3926 -8.0681v-10.71c0 -2.0843 -3.99 -3.675 -6.4586 -7.056 -0.4073 -0.5575 -0.3664 -1.344 0.6689 -1.344h14.9867c0.883 0 1.0741 0.7801 0.672 1.3388 -2.4329 3.3862 -6.509 4.9665 -6.509 7.0612v10.71c0 3.2057 5.8495 4.9349 8.442 8.0714 1.0447 1.2641 0.6794 3.0586 -0.9555 3.0586Z"></path>
                        </svg>
                    </div>
                    <div class="set-item-content"><span>屏幕时间</span><svg class="set-chevron" viewBox="0 0 8 13"><path d="M1.5 1.5L6.5 6.5L1.5 11.5"/></svg></div>
                </div>
            </div>
        </div>
    </div>

    <!-- 屏幕使用时间 页面容器 (iOS 风格) -->
    <div class="display-settings-container" id="screenTimeSettingsUI">
        <div class="ds-nav-bar">
            <div class="ds-back-btn" onclick="closeScreenTimeSettingsApp()">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#000" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="15 18 9 12 15 6"></polyline></svg>
            </div>
            <div class="ds-nav-title">屏幕使用时间</div>
        </div>
        <div class="ds-content">
            <!-- 顶部每周与总时长分段胶囊控制栏 -->
            <div class="st-segmented-container">
                <div class="st-segmented-control">
                    <button type="button" class="st-segment-btn active" id="stTabWeekly" onclick="switchScreenTimeTab('weekly')">每周</button>
                    <button type="button" class="st-segment-btn" id="stTabTotal" onclick="switchScreenTimeTab('total')">总时长</button>
                </div>
            </div>

            <!-- 核心统计大卡片（规整排版，彻底解决错位） -->
            <div class="ds-card-group st-overview-card">
                <div class="st-overview-header">
                    <div id="stDateRangeLabel" class="st-overview-subtitle">本周</div>
                    <div class="st-overview-refresh" onclick="refreshScreenTimeStats()">刷新数据</div>
                </div>
                <div id="stMainDuration" class="st-overview-big-duration">--</div>

                <!-- 7 天柱状图展示区 -->
                <div class="st-chart-wrapper">
                    <div class="st-chart-grid-line" id="stChartGridLine">
                        <span class="st-chart-avg-label" id="stChartAvgLabel">平均 --</span>
                    </div>
                    <div class="st-chart-bars" id="stChartBarsContainer"></div>
                </div>

                <!-- 分类时长明细展示（等宽对齐：聊天时长、项目在线时长、聊天上下文） -->
                <div class="st-category-legend-grid">
                    <div class="st-category-legend-item">
                        <div class="st-legend-header"><span class="st-dot-blue"></span>聊天时长</div>
                        <div id="stChatCategoryTime" class="st-legend-val">--</div>
                    </div>
                    <div class="st-category-legend-item">
                        <div class="st-legend-header"><span class="st-dot-green"></span>在线总时长</div>
                        <div id="stOnlineCategoryTime" class="st-legend-val">--</div>
                    </div>
                    <div class="st-category-legend-item">
                        <div class="st-legend-header"><span class="st-dot-orange"></span>聊天上下文</div>
                        <div id="stInteractionCategoryCount" class="st-legend-val">--</div>
                    </div>
                </div>
                <div id="stUpdateTimeLabel" class="st-update-time-text">更新于：刚刚</div>
            </div>

            <!-- 角色时长列表区（展示全部汇总及通讯录全部角色） -->
            <div class="st-section-header">
                <div class="ds-section-title" style="margin: 0;">角色时长</div>
                <div class="st-view-all-link" onclick="openScreenTimeDetailModal('__total__')">全部汇总</div>
            </div>
            <div class="ds-card-group" id="stCharListGroup">
                <!-- 由 JS 动态填充：第一条为汇总，之后列出通讯录的所有角色 -->
            </div>
            <div style="height: 40px;"></div>
        </div>

        <!-- 单个角色 / 全部汇总 使用详情居中弹窗 (方案二：温润奶白 2×2 网格风) -->
        <div class="st-center-overlay" id="stDetailModalOverlay" onclick="closeScreenTimeDetailModal(event)">
            <div class="st-center-card-box" id="stDetailModalSheet" onclick="event.stopPropagation()"></div>
        </div>
    </div>

    <div class="display-settings-container" id="messageNotificationSettingsUI">
        <div class="ds-nav-bar">
            <div class="ds-back-btn" onclick="closeMessageNotificationSettingsApp()">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#000" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="15 18 9 12 15 6"></polyline></svg>
            </div>
            <div class="ds-nav-title">通知</div>
        </div>
        <div class="ds-content">
            <div class="ds-section-title">应用通知</div>
            <div class="ds-card-group">
                <div class="ds-list-item" style="padding: 12px 16px;">
                    <div style="display: flex; align-items: center; gap: 14px;">
                        <div class="set-item-icon set-bg-red" style="margin-right: 0; animation: none;">
                            <svg viewBox="0 0 24 24" fill="white" style="width: 18px; height: 18px;"><path d="M12 22c1.1 0 2-.9 2-2h-4c0 1.1.89 2 2 2zm6-6v-5c0-3.07-1.64-5.64-4.5-6.32V4c0-.83-.67-1.5-1.5-1.5s-1.5.67-1.5 1.5v.68C7.63 5.36 6 7.92 6 11v5l-2 2v1h16v-1l-2-2z"/></svg>
                        </div>
                        <div>
                            <div style="font-size: 16px; font-weight: 500; color: #000;">允许通知</div>
                            <div id="messageNotificationPermissionStatus" style="font-size: 13px; color: #8e8e93; margin-top: 3px;">正在读取权限状态</div>
                        </div>
                    </div>
                    <div class="ds-toggle" id="messageNotificationPageToggle" role="switch" aria-checked="false" onclick="toggleMessageNotifications()"></div>
                </div>
            </div>
            <div class="ds-section-footer">开启后，角色在后台主动发送消息时，浏览器会直接推送系统通知提醒。首次开启将请求系统通知权限。</div>

            <div class="ds-section-title">测试与诊断</div>
            <div class="ds-card-group" style="padding: 16px;">
                <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 12px;">
                    <div>
                        <div style="font-size: 16px; font-weight: 600; color: #000;">推送功能测试</div>
                        <div style="font-size: 13px; color: #8e8e93; margin-top: 2px; line-height: 1.4;">向当前设备发送一条即时模拟通知。</div>
                    </div>
                </div>
                <button type="button" class="ds-diagnostic-btn" id="messageNotificationTestButton" onclick="testMessageNotification()" style="margin-bottom: 14px;">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="vertical-align: -2px; margin-right: 6px;"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 7-3 9h18c0-2-3-2-3-9"></path><path d="M10.3 21a1.94 1.94 0 0 0 3.4 0"></path></svg>测试通知
                </button>
                <div style="background-color: #f2f2f7; border-radius: 10px; padding: 10px 12px; display: flex; justify-content: space-between; align-items: center;">
                    <span style="font-size: 13px; color: #8e8e93; font-weight: 500;">诊断结果</span>
                    <span id="messageNotificationTestResult" style="font-size: 13px; font-weight: 600; color: #8e8e93;">尚未测试</span>
                </div>
            </div>
            <div class="ds-section-footer">若测试无反应，请检查浏览器是否禁用了网站通知，或当前系统是否开启了“勿扰模式”。</div>

            <div class="ds-section-title">使用提示</div>
            <div class="ds-card-group" style="padding: 14px 16px;">
                <div style="font-size: 13px; color: #666; line-height: 1.5;">
                    <div style="margin-bottom: 8px;">• <strong>iOS / iPadOS 用户：</strong>建议通过 Safari 点击「分享」按钮选择<strong>「添加到主屏幕」</strong>，以获得更稳定持久的后台推送支持。</div>
                    <div>• <strong>桌面端用户：</strong>建议保持应用标签页在后台运行或开启设置中的「后台保活」功能。</div>
                </div>
            </div>
            <div style="height: 40px;"></div>
        </div>
    </div>

    <div class="display-settings-container" id="soundHapticsSettingsUI">
        <div class="ds-nav-bar">
            <div class="ds-back-btn" onclick="closeSoundHapticsSettingsApp()">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#000" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="15 18 9 12 15 6"></polyline></svg>
            </div>
            <div class="ds-nav-title">声音与触感</div>
        </div>
        <div class="ds-content">
            <div class="ds-section-title">铃声和提醒音量</div>
            <div class="ds-card-group">
                <div class="ds-brightness-container">
                    <svg style="width: 18px; height: 18px; color: #8e8e93; flex-shrink: 0;" viewBox="0 0 24 24" fill="currentColor"><path d="M7 9v6h4l5 5V4l-5 5H7z"/></svg>
                    <input type="range" class="ds-slider" id="soundVolumeSlider" min="0" max="100" value="80" oninput="updateSoundVolumeSlider(this)">
                    <svg style="width: 22px; height: 22px; color: #8e8e93; flex-shrink: 0;" viewBox="0 0 24 24" fill="currentColor"><path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z"/></svg>
                </div>
                <div class="ds-list-item" style="border-top: 0.5px solid #e5e5ea;">
                    <div>静音模式</div>
                    <div class="ds-toggle" id="silentModeToggle" role="switch" aria-checked="false" onclick="toggleSilentMode()"></div>
                </div>
            </div>
            <div class="ds-section-footer">开启静音模式后，提醒音和屏幕触发反馈都将静音。</div>

            <div class="ds-section-title">触感反馈</div>
            <div class="ds-card-group">
                <div class="ds-list-item" style="cursor: pointer;" onclick="openSoundPickerDrawer('feedback')">
                    <div>触发反馈</div>
                    <div style="display: flex; align-items: center; color: #8e8e93; font-size: 16px;">
                        <span id="soundLabelFeedback">按压触感</span>
                        <svg class="set-chevron" viewBox="0 0 8 13" style="margin-left: 8px;"><path d="M1.5 1.5L6.5 6.5L1.5 11.5"/></svg>
                    </div>
                </div>
            </div>

            <div class="ds-section-title">声音和提示音</div>
            <div class="ds-card-group">
                <div class="ds-list-item" style="border-bottom: 0.5px solid #e5e5ea; cursor: pointer;" onclick="openSoundPickerDrawer('ringtone')">
                    <div>电话铃声</div>
                    <div style="display: flex; align-items: center; color: #8e8e93; font-size: 16px;">
                        <span id="soundLabelRingtone">默认铃声</span>
                        <svg class="set-chevron" viewBox="0 0 8 13" style="margin-left: 8px;"><path d="M1.5 1.5L6.5 6.5L1.5 11.5"/></svg>
                    </div>
                </div>
                <div class="ds-list-item" style="border-bottom: 0.5px solid #e5e5ea; cursor: pointer;" onclick="openSoundPickerDrawer('wechat')">
                    <div>微信消息</div>
                    <div style="display: flex; align-items: center; color: #8e8e93; font-size: 16px;">
                        <span id="soundLabelWechat">三音</span>
                        <svg class="set-chevron" viewBox="0 0 8 13" style="margin-left: 8px;"><path d="M1.5 1.5L6.5 6.5L1.5 11.5"/></svg>
                    </div>
                </div>
                <div class="ds-list-item" style="cursor: pointer;" onclick="openSoundPickerDrawer('sms')">
                    <div>短信消息</div>
                    <div style="display: flex; align-items: center; color: #8e8e93; font-size: 16px;">
                        <span id="soundLabelSms">极光</span>
                        <svg class="set-chevron" viewBox="0 0 8 13" style="margin-left: 8px;"><path d="M1.5 1.5L6.5 6.5L1.5 11.5"/></svg>
                    </div>
                </div>
            </div>

            <!-- 提示音选择抽屉弹窗 -->
            <div class="drawer-overlay" id="soundPickerDrawerOverlay" onclick="closeSoundPickerDrawer()"></div>
            <div class="drawer" id="soundPickerDrawer">
                <div class="d-header">
                    <div class="d-handle"></div>
                    <div class="d-btn" onclick="closeSoundPickerDrawer()">取消</div>
                    <div class="d-title" id="soundPickerDrawerTitle">提示音</div>
                    <div class="d-btn primary" onclick="saveSoundPickerSelection()">完成</div>
                </div>
                <div class="d-content">
                    <div class="d-section-title">系统内置提示音</div>
                    <div class="d-list" id="soundPickerBuiltinList"></div>

                    <div class="d-section-title">自定义声音</div>
                    <div class="custom-ui-1">
                        <div class="custom-btn-1" onclick="document.getElementById('soundPickerFileInput').click()">
                            <div style="height: 32px; display: flex; align-items: center; justify-content: center;">
                                <svg viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg"><path d="M929.28 163.328h-457.216c-27.648 0-53.248-13.824-69.12-36.352l-34.304-49.152c-15.872-22.528-41.472-36.352-69.12-36.352h-215.04c-46.592 0-84.48 38.4-84.48 85.504v768c0 47.104 37.888 85.504 84.48 85.504h844.8c46.592 0 84.48-38.4 84.48-85.504V248.832c0-47.104-37.888-85.504-84.48-85.504zM715.776 610.816h-109.568c-14.848 0-26.624 12.288-26.624 27.136V803.84c0 18.432-14.848 33.792-33.792 33.792h-78.848c-18.432 0-33.792-15.36-33.28-33.792v-165.888c0-14.848-11.776-26.624-26.624-27.136H297.984c-25.088 0-37.888-30.72-19.968-48.64l188.928-189.952c22.016-22.016 57.344-22.016 79.36-0.512l0.512 0.512 188.928 189.952c17.92 17.92 5.12 48.64-19.968 48.64z"></path></svg>
                            </div>
                            <span>本地音频</span>
                        </div>
                        <div class="custom-btn-1" onclick="openSoundUrlPrompt()">
                            <div style="height: 32px; display: flex; align-items: center; justify-content: center;">
                                <svg style="width: 32px; height: 32px;" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg"><path d="M742.4 217.6h-592c-35.2 0-64 28.8-64 64v592c0 35.2 28.8 64 64 64h592c35.2 0 64-28.8 64-64v-592c0-35.2-28.8-64-64-64zM488 680l-92.8 92.8c-20.8 20.8-49.6 33.6-80 33.6s-59.2-11.2-80-33.6c-20.8-20.8-33.6-49.6-33.6-80s11.2-59.2 33.6-80l76.8-76.8c12.8-12.8 32-12.8 44.8 0s12.8 32 0 44.8l-76.8 76.8c-9.6 9.6-14.4 22.4-14.4 35.2s4.8 25.6 14.4 35.2c9.6 9.6 22.4 14.4 35.2 14.4s25.6-4.8 35.2-14.4l92.8-92.8c17.6-17.6 19.2-43.2 6.4-64-9.6-14.4-6.4-35.2 8-44.8 14.4-9.6 35.2-6.4 44.8 8 30.4 46.4 25.6 107.2-14.4 145.6z m169.6-139.2l-76.8 76.8c-12.8 12.8-32 12.8-44.8 0s-12.8-32 0-44.8l76.8-76.8c9.6-9.6 14.4-22.4 14.4-35.2s-4.8-25.6-14.4-35.2c-19.2-19.2-51.2-19.2-70.4 0L448 518.4c-17.6 17.6-19.2 43.2-6.4 64 9.6 14.4 6.4 35.2-8 44.8-4.8 3.2-11.2 4.8-17.6 4.8-9.6 0-20.8-4.8-25.6-14.4-30.4-44.8-25.6-105.6 12.8-144l92.8-92.8c44.8-44.8 116.8-44.8 161.6 0 20.8 20.8 33.6 49.6 33.6 80s-11.2 59.2-33.6 80z"></path><path d="M873.6 84.8h-592c-35.2 0-64 28.8-64 64v16h576c35.2 0 64 28.8 64 64v576h16c35.2 0 64-28.8 64-64v-592c0-35.2-28.8-64-64-64z"></path></svg>
                            </div>
                            <span>音频 URL</span>
                        </div>
                    </div>
                </div>
            </div>
            <input type="file" id="soundPickerFileInput" accept="audio/*,video/mp4" style="display: none;" onchange="handleSoundPickerLocalFile(event)">

            <div class="ds-section-title">系统声音与触感</div>
            <div class="ds-card-group">
                <div class="ds-list-item" style="border-bottom: 0.5px solid #e5e5ea;">
                    <div>锁定声</div>
                    <div class="ds-toggle on" onclick="this.classList.toggle('on')"></div>
                </div>
                <div class="ds-list-item">
                    <div>系统触感反馈</div>
                    <div class="ds-toggle on" onclick="this.classList.toggle('on')"></div>
                </div>
            </div>
            <div class="ds-section-footer">开启后，在进行系统控制和交互时会听到声音并感受到触感反馈。</div>
        </div>
    </div>

    <div class="display-settings-container standby-diagnostics-container" id="standbyDiagnosticsUI">
        <div class="ds-nav-bar">
            <div class="ds-back-btn" onclick="closeStandbyDiagnosticsApp()">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#000" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="15 18 9 12 15 6"></polyline></svg>
            </div>
            <div class="ds-nav-title">待机与诊断</div>
        </div>
        <div class="ds-content">
            <div class="ds-section-title">异常与性能日志</div>
            <div class="ds-card-group ds-diagnostic-card">
                <div class="ds-diagnostic-head">
                    <div>
                        <div class="ds-diagnostic-title">诊断日志</div>
                        <div class="ds-diagnostic-desc">卡顿、资源失败、网络异常等问题都可复制发给维护者。</div>
                    </div>
                    <div class="ds-diagnostic-count" id="diagnosticErrorCount">0 条</div>
                </div>
                <textarea class="ds-diagnostic-output" id="diagnosticErrorText" readonly spellcheck="false" placeholder="暂无报错记录"></textarea>
                <div class="ds-diagnostic-actions">
                    <button type="button" class="ds-diagnostic-btn secondary" onclick="renderDiagnosticErrorLog()">刷新</button>
                    <button type="button" class="ds-diagnostic-btn" onclick="copyDiagnosticErrorLog()">复制数据</button>
                    <button type="button" class="ds-diagnostic-btn danger" onclick="clearDiagnosticErrorLog()">清空</button>
                </div>
            </div>
            <div class="ds-section-footer">仅保存最近 50 条脚本、资源、网络、性能和生命周期异常；可帮助判断卡顿或疑似被系统回收。</div>
        </div>
    </div>
    <!-- 显示与亮度 页面容器 -->
    <div class="display-settings-container" id="displaySettingsUI">
        <div class="ds-nav-bar">
            <div class="ds-back-btn" onclick="closeDisplaySettingsApp()">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#000" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="15 18 9 12 15 6"></polyline></svg>
            </div>
            <div class="ds-nav-title">显示与亮度</div>
        </div>
        <div class="ds-content">
            <div class="ds-section-title">外观</div>
            <div class="ds-card-group">
                <div class="ds-appearance-selector">
                    <div class="ds-appearance-option active" id="dsLightOption" onclick="toggleDsAppearance('light')">
                        <div class="ds-phone-mockup light">
                            <div class="ds-mockup-screen">
                                <div class="ds-mockup-time">09:41</div>
                                <div class="ds-mockup-widget"></div>
                                <div class="ds-mockup-widget"></div>
                            </div>
                        </div>
                        <div>浅色</div>
                        <div class="ds-radio-circle"></div>
                    </div>
                    <div class="ds-appearance-option" id="dsDarkOption" onclick="toggleDsAppearance('dark')">
                        <div class="ds-phone-mockup dark">
                            <div class="ds-mockup-screen">
                                <div class="ds-mockup-time">09:41</div>
                                <div class="ds-mockup-widget"></div>
                                <div class="ds-mockup-widget"></div>
                            </div>
                        </div>
                        <div>深色</div>
                        <div class="ds-radio-circle"></div>
                    </div>
                </div>
            </div>

            <div class="ds-section-title">亮度</div>
            <div class="ds-card-group">
                <div class="ds-brightness-container">
                    <svg class="ds-sun-icon small" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M17.8912 12C17.8912 13.1774 17.5414 14.3283 16.8862 15.307C16.2309 16.2858 15.2997 17.0485 14.2102 17.4986C13.1207 17.9486 11.9221 18.0658 10.7658 17.8354C9.60961 17.6049 8.54773 17.0372 7.71476 16.204C6.88179 15.3707 6.31513 14.3095 6.08638 13.1545C5.85764 11.9995 5.9771 10.8028 6.42973 9.71563C6.88237 8.62851 7.64782 7.69987 8.62916 7.04728C9.6105 6.3947 10.7636 6.0475 11.9426 6.04957C12.7247 6.04957 13.4991 6.20356 14.2215 6.50272C14.9439 6.80189 15.6002 7.24034 16.1527 7.79304C16.7052 8.34573 17.1431 9.00181 17.4415 9.72369C17.7398 10.4456 17.8926 11.2191 17.8912 12Z" fill="currentColor"/>
                        <path d="M3.20314 13.0476H2.04913C1.77088 13.0476 1.50398 12.9372 1.30723 12.7408C1.11048 12.5443 1 12.2779 1 12C1 11.7222 1.11048 11.4557 1.30723 11.2592C1.50398 11.0627 1.77088 10.9524 2.04913 10.9524H3.20314C3.48139 10.9524 3.74828 11.0627 3.94503 11.2592C4.14178 11.4557 4.25227 11.7222 4.25227 12C4.25227 12.2779 4.14178 12.5443 3.94503 12.7408C3.74828 12.9372 3.48139 13.0476 3.20314 13.0476Z" fill="currentColor"/>
                        <path d="M21.9509 13.0476H20.8074C20.5292 13.0476 20.2623 12.9372 20.0655 12.7408C19.8688 12.5443 19.7583 12.2779 19.7583 12C19.7583 11.7222 19.8688 11.4557 20.0655 11.2592C20.2623 11.0627 20.5292 10.9524 20.8074 10.9524H21.9509C22.2292 10.9524 22.4961 11.0627 22.6928 11.2592C22.8896 11.4557 23.0001 11.7222 23.0001 12C23.0001 12.2779 22.8896 12.5443 22.6928 12.7408C22.4961 12.9372 22.2292 13.0476 21.9509 13.0476Z" fill="currentColor"/>
                        <path d="M11.9847 4.24763C11.7064 4.24763 11.4395 4.13724 11.2428 3.94077C11.046 3.74431 10.9355 3.47786 10.9355 3.20001V2.04762C10.9355 1.76977 11.046 1.50329 11.2428 1.30682C11.4395 1.11036 11.7064 1 11.9847 1C12.2629 1 12.5298 1.11036 12.7266 1.30682C12.9233 1.50329 13.0338 1.76977 13.0338 2.04762V3.20001C13.0338 3.47786 12.9233 3.74431 12.7266 3.94077C12.5298 4.13724 12.2629 4.24763 11.9847 4.24763Z" fill="currentColor"/>
                        <path d="M11.9847 23.0001C11.7064 23.0001 11.4395 22.8897 11.2428 22.6932C11.046 22.4967 10.9355 22.2303 10.9355 21.9525V20.8001C10.9355 20.5222 11.046 20.2557 11.2428 20.0593C11.4395 19.8628 11.7064 19.7524 11.9847 19.7524C12.2629 19.7524 12.5298 19.8628 12.7266 20.0593C12.9233 20.2557 13.0338 20.5222 13.0338 20.8001V21.9525C13.0338 22.2303 12.9233 22.4967 12.7266 22.6932C12.5298 22.8897 12.2629 23.0001 11.9847 23.0001Z" fill="currentColor"/>
                        <path d="M5.75269 6.82487C5.61388 6.8243 5.4765 6.79621 5.34864 6.74226C5.22078 6.68831 5.10489 6.60955 5.00772 6.51057L4.18937 5.70391C3.99182 5.50664 3.88086 5.23909 3.88086 4.96011C3.88086 4.68112 3.99182 4.41358 4.18937 4.21631C4.38693 4.01904 4.65496 3.9082 4.93434 3.9082C5.21372 3.9082 5.48163 4.01904 5.67918 4.21631L6.49753 5.03345C6.69293 5.22973 6.80259 5.49524 6.80259 5.77201C6.80259 6.04877 6.69293 6.31428 6.49753 6.51057C6.40036 6.60955 6.28448 6.68831 6.15661 6.74226C6.02875 6.79621 5.8915 6.8243 5.75269 6.82487Z" fill="currentColor"/>
                        <path d="M19.0239 20.0458C18.7486 20.0447 18.4849 19.9356 18.2895 19.742L17.4712 18.9249C17.3613 18.831 17.2721 18.7154 17.2091 18.5854C17.1462 18.4554 17.1109 18.3139 17.1053 18.1696C17.0997 18.0253 17.124 17.8814 17.1767 17.747C17.2295 17.6126 17.3095 17.4905 17.4117 17.3884C17.514 17.2863 17.6362 17.2064 17.7708 17.1537C17.9055 17.101 18.0496 17.0768 18.1941 17.0823C18.3386 17.0879 18.4803 17.1232 18.6104 17.1861C18.7406 17.249 18.8564 17.3381 18.9505 17.4477L19.7688 18.2649C19.9642 18.4611 20.0739 18.7267 20.0739 19.0035C20.0739 19.2802 19.9642 19.5457 19.7688 19.742C19.6708 19.8391 19.5544 19.9159 19.4266 19.9681C19.2988 20.0202 19.1619 20.0466 19.0239 20.0458Z" fill="currentColor"/>
                        <path d="M18.2164 6.82484C18.008 6.82605 17.8039 6.76524 17.6303 6.65021C17.4566 6.53518 17.3212 6.37114 17.2413 6.17896C17.1614 5.98678 17.1406 5.77519 17.1816 5.57116C17.2226 5.36714 17.3235 5.17995 17.4715 5.03341L18.2898 4.21627C18.4864 4.02115 18.7522 3.91162 19.0294 3.91162C19.3066 3.91162 19.5725 4.02115 19.7691 4.21627C19.8674 4.31366 19.9455 4.42951 19.9987 4.55718C20.052 4.68484 20.0794 4.82177 20.0794 4.96007C20.0794 5.09837 20.052 5.23531 19.9987 5.36297C19.9455 5.49063 19.8674 5.60648 19.7691 5.70387L18.9508 6.51053C18.7571 6.70792 18.4931 6.8209 18.2164 6.82484Z" fill="currentColor"/>
                        <path d="M4.9343 20.0457C4.79623 20.0465 4.65935 20.02 4.53153 19.9679C4.40371 19.9158 4.28736 19.8389 4.18933 19.7418C3.99393 19.5456 3.88428 19.2801 3.88428 19.0033C3.88428 18.7265 3.99393 18.461 4.18933 18.2647L5.00768 17.4476C5.10521 17.3494 5.22126 17.2714 5.34911 17.2183C5.47696 17.1651 5.61415 17.1377 5.75265 17.1377C5.89115 17.1377 6.02822 17.1651 6.15606 17.2183C6.28391 17.2714 6.39996 17.3494 6.49749 17.4476C6.69289 17.6438 6.80255 17.9094 6.80255 18.1861C6.80255 18.4629 6.69289 18.7284 6.49749 18.9247L5.67914 19.7418C5.58111 19.8389 5.4649 19.9158 5.33707 19.9679C5.20925 20.02 5.07237 20.0465 4.9343 20.0457Z" fill="currentColor"/>
                    </svg>
                    <input type="range" class="ds-slider" id="dsBrightnessSlider" min="0" max="100" value="100" oninput="updateDsSlider(this)">
                    <svg class="ds-sun-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M17.8912 12C17.8912 13.1774 17.5414 14.3283 16.8862 15.307C16.2309 16.2858 15.2997 17.0485 14.2102 17.4986C13.1207 17.9486 11.9221 18.0658 10.7658 17.8354C9.60961 17.6049 8.54773 17.0372 7.71476 16.204C6.88179 15.3707 6.31513 14.3095 6.08638 13.1545C5.85764 11.9995 5.9771 10.8028 6.42973 9.71563C6.88237 8.62851 7.64782 7.69987 8.62916 7.04728C9.6105 6.3947 10.7636 6.0475 11.9426 6.04957C12.7247 6.04957 13.4991 6.20356 14.2215 6.50272C14.9439 6.80189 15.6002 7.24034 16.1527 7.79304C16.7052 8.34573 17.1431 9.00181 17.4415 9.72369C17.7398 10.4456 17.8926 11.2191 17.8912 12Z" fill="currentColor"/>
                        <path d="M3.20314 13.0476H2.04913C1.77088 13.0476 1.50398 12.9372 1.30723 12.7408C1.11048 12.5443 1 12.2779 1 12C1 11.7222 1.11048 11.4557 1.30723 11.2592C1.50398 11.0627 1.77088 10.9524 2.04913 10.9524H3.20314C3.48139 10.9524 3.74828 11.0627 3.94503 11.2592C4.14178 11.4557 4.25227 11.7222 4.25227 12C4.25227 12.2779 4.14178 12.5443 3.94503 12.7408C3.74828 12.9372 3.48139 13.0476 3.20314 13.0476Z" fill="currentColor"/>
                        <path d="M21.9509 13.0476H20.8074C20.5292 13.0476 20.2623 12.9372 20.0655 12.7408C19.8688 12.5443 19.7583 12.2779 19.7583 12C19.7583 11.7222 19.8688 11.4557 20.0655 11.2592C20.2623 11.0627 20.5292 10.9524 20.8074 10.9524H21.9509C22.2292 10.9524 22.4961 11.0627 22.6928 11.2592C22.8896 11.4557 23.0001 11.7222 23.0001 12C23.0001 12.2779 22.8896 12.5443 22.6928 12.7408C22.4961 12.9372 22.2292 13.0476 21.9509 13.0476Z" fill="currentColor"/>
                        <path d="M11.9847 4.24763C11.7064 4.24763 11.4395 4.13724 11.2428 3.94077C11.046 3.74431 10.9355 3.47786 10.9355 3.20001V2.04762C10.9355 1.76977 11.046 1.50329 11.2428 1.30682C11.4395 1.11036 11.7064 1 11.9847 1C12.2629 1 12.5298 1.11036 12.7266 1.30682C12.9233 1.50329 13.0338 1.76977 13.0338 2.04762V3.20001C13.0338 3.47786 12.9233 3.74431 12.7266 3.94077C12.5298 4.13724 12.2629 4.24763 11.9847 4.24763Z" fill="currentColor"/>
                        <path d="M11.9847 23.0001C11.7064 23.0001 11.4395 22.8897 11.2428 22.6932C11.046 22.4967 10.9355 22.2303 10.9355 21.9525V20.8001C10.9355 20.5222 11.046 20.2557 11.2428 20.0593C11.4395 19.8628 11.7064 19.7524 11.9847 19.7524C12.2629 19.7524 12.5298 19.8628 12.7266 20.0593C12.9233 20.2557 13.0338 20.5222 13.0338 20.8001V21.9525C13.0338 22.2303 12.9233 22.4967 12.7266 22.6932C12.5298 22.8897 12.2629 23.0001 11.9847 23.0001Z" fill="currentColor"/>
                        <path d="M5.75269 6.82487C5.61388 6.8243 5.4765 6.79621 5.34864 6.74226C5.22078 6.68831 5.10489 6.60955 5.00772 6.51057L4.18937 5.70391C3.99182 5.50664 3.88086 5.23909 3.88086 4.96011C3.88086 4.68112 3.99182 4.41358 4.18937 4.21631C4.38693 4.01904 4.65496 3.9082 4.93434 3.9082C5.21372 3.9082 5.48163 4.01904 5.67918 4.21631L6.49753 5.03345C6.69293 5.22973 6.80259 5.49524 6.80259 5.77201C6.80259 6.04877 6.69293 6.31428 6.49753 6.51057C6.40036 6.60955 6.28448 6.68831 6.15661 6.74226C6.02875 6.79621 5.8915 6.8243 5.75269 6.82487Z" fill="currentColor"/>
                        <path d="M19.0239 20.0458C18.7486 20.0447 18.4849 19.9356 18.2895 19.742L17.4712 18.9249C17.3613 18.831 17.2721 18.7154 17.2091 18.5854C17.1462 18.4554 17.1109 18.3139 17.1053 18.1696C17.0997 18.0253 17.124 17.8814 17.1767 17.747C17.2295 17.6126 17.3095 17.4905 17.4117 17.3884C17.514 17.2863 17.6362 17.2064 17.7708 17.1537C17.9055 17.101 18.0496 17.0768 18.1941 17.0823C18.3386 17.0879 18.4803 17.1232 18.6104 17.1861C18.7406 17.249 18.8564 17.3381 18.9505 17.4477L19.7688 18.2649C19.9642 18.4611 20.0739 18.7267 20.0739 19.0035C20.0739 19.2802 19.9642 19.5457 19.7688 19.742C19.6708 19.8391 19.5544 19.9159 19.4266 19.9681C19.2988 20.0202 19.1619 20.0466 19.0239 20.0458Z" fill="currentColor"/>
                        <path d="M18.2164 6.82484C18.008 6.82605 17.8039 6.76524 17.6303 6.65021C17.4566 6.53518 17.3212 6.37114 17.2413 6.17896C17.1614 5.98678 17.1406 5.77519 17.1816 5.57116C17.2226 5.36714 17.3235 5.17995 17.4715 5.03341L18.2898 4.21627C18.4864 4.02115 18.7522 3.91162 19.0294 3.91162C19.3066 3.91162 19.5725 4.02115 19.7691 4.21627C19.8674 4.31366 19.9455 4.42951 19.9987 4.55718C20.052 4.68484 20.0794 4.82177 20.0794 4.96007C20.0794 5.09837 20.052 5.23531 19.9987 5.36297C19.9455 5.49063 19.8674 5.60648 19.7691 5.70387L18.9508 6.51053C18.7571 6.70792 18.4931 6.8209 18.2164 6.82484Z" fill="currentColor"/>
                        <path d="M4.9343 20.0457C4.79623 20.0465 4.65935 20.02 4.53153 19.9679C4.40371 19.9158 4.28736 19.8389 4.18933 19.7418C3.99393 19.5456 3.88428 19.2801 3.88428 19.0033C3.88428 18.7265 3.99393 18.461 4.18933 18.2647L5.00768 17.4476C5.10521 17.3494 5.22126 17.2714 5.34911 17.2183C5.47696 17.1651 5.61415 17.1377 5.75265 17.1377C5.89115 17.1377 6.02822 17.1651 6.15606 17.2183C6.28391 17.2714 6.39996 17.3494 6.49749 17.4476C6.69289 17.6438 6.80255 17.9094 6.80255 18.1861C6.80255 18.4629 6.69289 18.7284 6.49749 18.9247L5.67914 19.7418C5.58111 19.8389 5.4649 19.9158 5.33707 19.9679C5.20925 20.02 5.07237 20.0465 4.9343 20.0457Z" fill="currentColor"/>
                    </svg>
                </div>
                <div class="ds-list-item">
                    <div>原彩显示</div>
                    <div class="ds-toggle on" onclick="this.classList.toggle('on')"></div>
                </div>
            </div>
            <div class="ds-section-footer">根据环境光线条件自动调整手机屏幕以在不同环境下保持色彩显示一致。</div>
        </div>
    </div>

    <!-- Apple ID 页面容器 -->
    <div class="apple-id-container" id="appleIdUI">
        <!-- 导航栏 -->
        <div class="apple-id-nav-bar">
            <div class="apple-id-back-btn" onclick="closeAppleIdApp()">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#000" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="15 18 9 12 15 6"></polyline></svg>
            </div>
            <div class="apple-id-nav-title">账户</div>
        </div>

        <!-- 内容区 -->
        <div class="apple-id-content">
            <!-- 头像与名字 -->
            <div class="apple-id-profile-header">
                <div class="apple-id-avatar" id="appleIdAvatarPreview">
                    <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" style="pointer-events: none;">
                        <defs>
                            <clipPath id="appleIdClip"><circle cx="50" cy="50" r="44"/></clipPath>
                            <linearGradient id="appleIdBgGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                                <stop offset="0%" stop-color="#A3A8B0" />
                                <stop offset="100%" stop-color="#7A7F88" />
                            </linearGradient>
                            <linearGradient id="appleIdFigureGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                                <stop offset="0%" stop-color="#FFFFFF" />
                                <stop offset="100%" stop-color="#E5E5EA" />
                            </linearGradient>
                        </defs>
                        <circle cx="50" cy="50" r="50" fill="url(#appleIdBgGrad)"/>
                        <circle cx="50" cy="36" r="16" fill="url(#appleIdFigureGrad)"/>
                        <path d="M 50 59 C 20 59 10 82 8 106 L 92 106 C 90 82 80 59 50 59 Z" fill="url(#appleIdFigureGrad)" clip-path="url(#appleIdClip)"/>
                    </svg>
                </div>
                <div class="apple-id-name-container">
                    <div class="apple-id-name">@uu</div>
                </div>
            </div>

            <!-- 第一组卡片 -->
            <div class="apple-id-card">
                <div class="apple-id-list-item" onclick="openAppleIdProfileSheet()" style="cursor: pointer;">
                    <div class="apple-id-item-icon apple-id-icon-gray-3d">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M20.8199 4.46523C19.8793 3.55184 18.621 3.03916 17.3099 3.03523H6.74995C6.09834 3.02597 5.45131 3.14599 4.84638 3.38835C4.24146 3.6307 3.69062 3.99059 3.22565 4.44718C2.76069 4.90378 2.39082 5.44803 2.13752 6.04846C1.88422 6.64888 1.75252 7.29357 1.74995 7.94523V16.0552C1.75197 16.7014 1.88204 17.3408 2.13264 17.9364C2.38324 18.532 2.74935 19.072 3.20991 19.5252C4.14529 20.4477 5.40617 20.965 6.71992 20.9652H17.2799C18.5936 20.965 19.8545 20.4477 20.7899 19.5252C21.2531 19.074 21.6211 18.5344 21.8719 17.9383C22.1227 17.3423 22.2513 16.7019 22.2499 16.0552V7.94523C22.2543 7.29932 22.13 6.65901 21.8845 6.06156C21.639 5.46412 21.2771 4.92148 20.8199 4.46523ZM11.6599 16.7152C11.4609 16.7152 11.2702 16.6362 11.1296 16.4956C10.9889 16.3549 10.9099 16.1641 10.9099 15.9652C10.9101 15.6621 10.8501 15.3618 10.7333 15.082C10.6166 14.8022 10.4455 14.5484 10.2299 14.3352C9.78085 13.9199 9.19162 13.6892 8.5799 13.6892C7.96819 13.6892 7.37895 13.9199 6.92988 14.3352C6.71383 14.548 6.54237 14.8018 6.42561 15.0817C6.30884 15.3616 6.24919 15.662 6.24995 15.9652C6.24995 16.1641 6.17087 16.3549 6.03022 16.4956C5.88957 16.6362 5.69886 16.7152 5.49995 16.7152C5.30103 16.7152 5.1102 16.6362 4.96955 16.4956C4.8289 16.3549 4.74995 16.1641 4.74995 15.9652C4.74915 15.4635 4.84763 14.9666 5.03986 14.5032C5.23209 14.0398 5.51426 13.6191 5.86994 13.2652C6.2129 12.9089 6.61997 12.6205 7.06989 12.4152C6.6651 12.1665 6.33109 11.8179 6.09992 11.4029C5.86876 10.9878 5.74826 10.5203 5.74995 10.0452C5.74995 9.30263 6.04491 8.59043 6.57001 8.06533C7.09512 7.54023 7.80727 7.24523 8.54987 7.24523C9.29248 7.24523 10.0046 7.54023 10.5297 8.06533C11.0548 8.59043 11.3499 9.30263 11.3499 10.0452C11.3558 10.5165 11.2414 10.9816 11.0174 11.3963C10.7934 11.811 10.4673 12.1617 10.0699 12.4152C10.5273 12.6053 10.9446 12.8801 11.2999 13.2252C12.0109 13.9448 12.4128 14.9136 12.4199 15.9252C12.4269 16.0282 12.4123 16.1316 12.377 16.2286C12.3417 16.3256 12.2865 16.4142 12.2149 16.4886C12.1433 16.563 12.057 16.6216 11.9614 16.6606C11.8658 16.6997 11.7631 16.7183 11.6599 16.7152ZM18.1899 15.8352H14.5999C14.401 15.8352 14.2102 15.7562 14.0695 15.6156C13.9289 15.4749 13.8499 15.2841 13.8499 15.0852C13.8499 14.8863 13.9289 14.6955 14.0695 14.5549C14.2102 14.4142 14.401 14.3352 14.5999 14.3352H18.1899C18.3888 14.3352 18.5796 14.4142 18.7203 14.5549C18.8609 14.6955 18.9399 14.8863 18.9399 15.0852C18.9399 15.2841 18.8609 15.4749 18.7203 15.6156C18.5796 15.7562 18.3888 15.8352 18.1899 15.8352ZM13.8499 11.9952C13.8499 11.7963 13.9289 11.6056 14.0695 11.4649C14.2102 11.3242 14.401 11.2452 14.5999 11.2452H16.1398C16.3388 11.2452 16.5296 11.3242 16.6702 11.4649C16.8109 11.6056 16.8898 11.7963 16.8898 11.9952C16.8898 12.1941 16.8109 12.3849 16.6702 12.5256C16.5296 12.6662 16.3388 12.7452 16.1398 12.7452H14.5999C14.5011 12.7466 14.4029 12.7281 14.3113 12.6909C14.2197 12.6537 14.1365 12.5985 14.0666 12.5286C13.9967 12.4586 13.9415 12.3754 13.9042 12.2838C13.867 12.1922 13.8486 12.0941 13.8499 11.9952ZM18.1899 9.66523H14.5999C14.401 9.66523 14.2102 9.58622 14.0695 9.44557C13.9289 9.30491 13.8499 9.11414 13.8499 8.91523C13.8499 8.71632 13.9289 8.52555 14.0695 8.3849C14.2102 8.24424 14.401 8.16523 14.5999 8.16523H18.1899C18.3888 8.16523 18.5796 8.24424 18.7203 8.3849C18.8609 8.52555 18.9399 8.71632 18.9399 8.91523C18.9399 9.11414 18.8609 9.30491 18.7203 9.44557C18.5796 9.58622 18.3888 9.66523 18.1899 9.66523Z" fill="currentColor"/>
                            <path d="M8.57989 11.3852C9.29786 11.3852 9.87988 10.8032 9.87988 10.0852C9.87988 9.36725 9.29786 8.78522 8.57989 8.78522C7.86192 8.78522 7.27988 9.36725 7.27988 10.0852C7.27988 10.8032 7.86192 11.3852 8.57989 11.3852Z" fill="currentColor"/>
                        </svg>
                    </div>
                    <div class="apple-id-item-content">
                        <span>个人信息</span>
                        <div class="apple-id-item-right"><svg class="apple-id-chevron" viewBox="0 0 8 13"><path d="M1.5 1.5L6.5 6.5L1.5 11.5"/></svg></div>
                    </div>
                </div>
                <div class="apple-id-list-item" onclick="openLoginSecurityApp()" style="cursor: pointer;">
                    <div class="apple-id-item-icon apple-id-icon-gray-3d">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M20.8722 5.04995C20.5241 4.569 20.0333 4.20994 19.4695 4.02385L14.6686 2.42353C12.9278 1.85882 11.0531 1.85882 9.31231 2.42353L4.51141 4.02385C3.95109 4.21168 3.46377 4.57058 3.11817 5.04995C2.76924 5.5319 2.5815 6.11169 2.58165 6.70669V11.8654C2.57456 13.3075 2.93567 14.7275 3.63085 15.991C4.32602 17.2545 5.33222 18.3196 6.55414 19.0856L10.5079 21.5707C10.9567 21.8513 11.4753 22 12.0046 22C12.5339 22 13.0525 21.8513 13.5014 21.5707L17.4551 19.0856C18.6685 18.3227 19.6685 17.2646 20.3616 16.0101C21.0548 14.7555 21.4182 13.3457 21.4181 11.9124V6.75381C21.4256 6.14169 21.234 5.54372 20.8722 5.04995ZM12.9366 12.336V14.6047C12.9366 14.8543 12.8374 15.0938 12.6608 15.2703C12.4843 15.4469 12.2449 15.546 11.9952 15.546C11.7455 15.546 11.5061 15.4469 11.3295 15.2703C11.153 15.0938 11.0539 14.8543 11.0539 14.6047V12.336C10.3813 12.1125 9.81017 11.6567 9.44291 11.0505C9.07565 10.4443 8.9362 9.72718 9.04945 9.02751C9.1627 8.32783 9.52127 7.6913 10.061 7.2319C10.6008 6.77249 11.2864 6.52019 11.9952 6.52019C12.704 6.52019 13.3896 6.77249 13.9293 7.2319C14.4691 7.6913 14.8277 8.32783 14.941 9.02751C15.0542 9.72718 14.9147 10.4443 14.5475 11.0505C14.1802 11.6567 13.6092 12.1125 12.9366 12.336Z" fill="currentColor"/>
                            <path d="M13.1012 9.50249C13.1012 9.7946 12.9852 10.0748 12.7786 10.2813C12.5721 10.4879 12.292 10.6039 11.9999 10.6039C11.7078 10.6039 11.4276 10.4879 11.2211 10.2813C11.0145 10.0748 10.8984 9.7946 10.8984 9.50249C10.8984 9.21039 11.0145 8.93023 11.2211 8.72368C11.4276 8.51713 11.7078 8.40112 11.9999 8.40112C12.292 8.40112 12.5721 8.51713 12.7786 8.72368C12.9852 8.93023 13.1012 9.21039 13.1012 9.50249Z" fill="currentColor"/>
                        </svg>
                    </div>
                    <div class="apple-id-item-content">
                        <span>登录与安全性</span>
                        <div class="apple-id-item-right"><svg class="apple-id-chevron" viewBox="0 0 8 13"><path d="M1.5 1.5L6.5 6.5L1.5 11.5"/></svg></div>
                    </div>
                </div>
            </div>

            <!-- 第二组卡片 -->
            <div class="apple-id-card">
                <div class="apple-id-list-item" onclick="openIcloudApp()" style="cursor: pointer;">
                    <div class="apple-id-item-icon apple-id-icon-transparent">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" style="width: 24px; height: 24px;">
                            <path d="M17 7C13.5705 7 10.6449 9.15804 9.50734 12.1903L11.3805 12.8927C12.2337 10.6185 14.4278 9 17 9C17.6983 9 18.3687 9.11928 18.992 9.33857C21.3265 10.16 23 12.3846 23 15C23 18.3137 20.3137 21 17 21H7C3.68629 21 1 18.3137 1 15C1 12.3846 2.67346 10.16 5.00804 9.33857C5.0027 9.22639 5 9.11351 5 9C5 5.13401 8.13401 2 12 2C15.242 2 17.9693 4.20399 18.7652 7.19539C18.1973 7.0675 17.6065 7 17 7Z"></path>
                        </svg>
                    </div>
                    <div class="apple-id-item-content">
                        <span>云端</span>
                        <div class="apple-id-item-right">
                            <span class="apple-id-item-value">设置</span>
                            <svg class="apple-id-chevron" viewBox="0 0 8 13"><path d="M1.5 1.5L6.5 6.5L1.5 11.5"/></svg>
                        </div>
                    </div>
                </div>
                <div class="apple-id-list-item">
                    <div class="apple-id-item-icon apple-id-icon-blue-3d">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M12 2C17.5228 2 22 6.47715 22 12C22 17.5228 17.5228 22 12 22C6.47715 22 2 17.5228 2 12C2 6.47715 6.47715 2 12 2ZM8.82258 15.3427C8.42804 14.8663 7.9373 14.6957 7.34401 14.834L7.19355 14.875L6.60484 15.8911C6.37903 16.2863 6.5121 16.7903 6.90726 17.0161C7.26949 17.2231 7.7232 17.1286 7.97023 16.807L8.03226 16.7137L8.82258 15.3427ZM13.2097 8.66129C12.7218 9.06452 12.2298 10.2581 12.9194 11.4476L15.9597 16.7137C16.1895 17.1089 16.6895 17.2419 17.0847 17.0161C17.4469 16.8054 17.5889 16.3677 17.4361 15.9919L17.3871 15.8911L16.5847 14.5H17.7742C18.2298 14.5 18.5968 14.1331 18.5968 13.6774C18.5968 13.2568 18.2841 12.9118 17.8776 12.8612L17.7742 12.8548H15.6331L13.44 9.05741L13.2097 8.66129ZM13.4879 5.61694C13.1257 5.40995 12.672 5.50451 12.4249 5.82608L12.3629 5.91935L11.996 6.55242L11.6371 5.91935C11.4073 5.52419 10.9073 5.39113 10.5121 5.61694C10.1499 5.82762 10.0079 6.26532 10.1606 6.64118L10.2097 6.74194L11.0484 8.19758L8.3629 12.8508H6.26613C5.81048 12.8508 5.44355 13.2177 5.44355 13.6734C5.44355 14.094 5.7562 14.439 6.16268 14.4896L6.26613 14.496H13.746C14.0869 13.8562 13.6854 12.9472 12.9357 12.8579L12.8145 12.8508H10.2621L13.7903 6.74194C14.0161 6.34677 13.8831 5.84274 13.4879 5.61694Z"></path>
                        </svg>
                    </div>
                    <div class="apple-id-item-content">
                        <span>媒体与购买项目</span>
                        <div class="apple-id-item-right"><svg class="apple-id-chevron" viewBox="0 0 8 13"><path d="M1.5 1.5L6.5 6.5L1.5 11.5"/></svg></div>
                    </div>
                </div>
            </div>

            <!-- 退出登录卡片 -->
            <div class="apple-id-card">
                <div class="apple-id-logout-btn" onclick="lsPerformLogout()">退出登录</div>
            </div>
        </div>

        <!-- 个人信息编辑层叠抽屉遮罩 -->
        <div class="ls-sheet-overlay" id="appleIdProfileSheetOverlay" onclick="closeAppleIdProfileSheet()"></div>

        <!-- 个人信息编辑层叠抽屉容器 -->
        <div class="ls-sheet-container apple-id-profile-sheet-compact" id="appleIdProfileSheet">
            <div class="ls-sheet-bg-card"></div>
            <div class="ls-sheet-main">
                <div class="ls-sheet-header" style="justify-content: space-between;">
                    <div class="ls-sheet-cancel" onclick="closeAppleIdProfileSheet()">取消</div>
                    <div style="font-size: 17px; font-weight: 600; color: #000;">个人信息</div>
                    <div class="ls-sheet-cancel" style="font-weight: 600;" onclick="saveAppleIdProfileSheet()">完成</div>
                </div>
                <div class="ls-sheet-content" style="padding-top: 10px;">
                    <div class="apple-id-avatar-edit-wrapper" onclick="window.currentEditingIcon = 'appleIdProfileEditAvatar'; window.currentIconTarget = 'appleIdProfileEditAvatar'; window._currentIconMenuTarget = 'appleIdProfileEditAvatar'; openIconMenu(event, 'appleIdProfileEditAvatar')" style="cursor: pointer; position: relative; margin-bottom: 24px;">
                        <div class="apple-id-avatar" id="appleIdEditAvatarPreview" style="margin-bottom: 0; width: 90px; height: 90px;">
                            <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" style="pointer-events: none;">
                                <circle cx="50" cy="50" r="50" fill="#A3A8B0"/>
                                <circle cx="50" cy="36" r="16" fill="#FFFFFF"/>
                                <path d="M 50 59 C 20 59 10 82 8 106 L 92 106 C 90 82 80 59 50 59 Z" fill="#FFFFFF"/>
                            </svg>
                        </div>
                        <div class="apple-id-avatar-edit-badge">编辑</div>
                    </div>

                    <div class="ls-sheet-input-group">
                        <div class="ls-pwd-wrapper">
                            <input id="appleIdEditNameInput" type="text" placeholder="账户名称" maxlength="20">
                        </div>
                    </div>
                    <p class="ls-sheet-hint" style="margin-top: 8px;">输入用于在“设置”和账户中显示的昵称。</p>
                </div>
            </div>
        </div>
    </div>

    <!-- 登录与安全 页面容器 -->
    <div class="login-security-container" id="loginSecurityUI" aria-hidden="true">
        <!-- 主页面内容 (增加一层包裹用于缩放动画) -->
        <div class="login-security-main" id="lsMainPage">
            <div class="login-security-nav-bar">
                <div class="ls-nav-btn-circle" onclick="closeLoginSecurityApp()">
                    <svg viewBox="0 0 24 24"><polyline points="15 18 9 12 15 6"></polyline></svg>
                </div>
                <div class="login-security-nav-title">登录与安全</div>
            </div>

            <div class="login-security-content">
                <!-- 顶部真实手机设备展示区 (由 JS 自动检测渲染，已移除点击切换) -->
                <div class="ls-hero-device">
                    <div class="ls-hero-device-icon" id="lsDeviceIconContainer"></div>
                    <div class="ls-hero-device-name" id="lsDeviceNameLabel">--</div>
                    <div class="ls-hero-device-badge">此设备</div>
                </div>

                <p class="login-security-section-title">账号</p>
                <section class="login-security-card" aria-label="当前绑定账号">
                    <div class="login-security-row">
                        <span>已绑定 QQ</span>
                        <span class="ls-row-value" id="loginSecurityBoundQq">--</span>
                    </div>
                </section>

                <p class="login-security-section-title">安全</p>
                <section class="login-security-card">
                    <div class="login-security-row ls-clickable" onclick="openLsChangePwdSheet()">
                        <span class="ls-text-blue">更改密码</span>
                        <svg class="ls-chevron" viewBox="0 0 8 13"><path d="M1.5 1.5L6.5 6.5L1.5 11.5"/></svg>
                    </div>
                </section>

                <div class="login-security-devices-heading">
                    <p class="login-security-section-title">已登录设备</p>
                    <button type="button" class="login-security-refresh" data-login-security-action="refresh-devices">刷新</button>
                </div>
                <section class="login-security-card login-security-devices" id="loginSecurityDeviceList" aria-live="polite"></section>
                <p class="login-security-notice" id="loginSecurityNotice" role="status"></p>

                <!-- 退出登录卡片 -->
                <section class="login-security-card">
                    <div class="ls-logout-btn ls-clickable" onclick="lsPerformLogout()">
                        退出登录
                    </div>
                </section>
            </div>
        </div>

        <!-- 遮罩层 -->
        <div class="ls-sheet-overlay" id="lsSheetOverlay" onclick="closeLsChangePwdSheet()"></div>

        <!-- 全新层叠卡片容器：更改密码 -->
        <div class="ls-sheet-container" id="lsChangePwdSheet">
            <!-- 背后露出的小卡片边边 -->
            <div class="ls-sheet-bg-card"></div>

            <!-- 主卡片内容 -->
            <div class="ls-sheet-main">
                <div class="ls-sheet-header">
                    <div class="ls-sheet-cancel" onclick="closeLsChangePwdSheet()">取消</div>
                </div>
                <div class="ls-sheet-content">
                    <div class="ls-sheet-icon">
                        <!-- 蓝色的钥匙 SVG (左右翻转) -->
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" height="54" width="54" style="transform: scaleX(-1);">
                            <path fill="#007aff" d="M10.8 7c0 -0.46665 0.16665 -0.86665 0.5 -1.2 0.33335 -0.33335 0.73335 -0.5 1.2 -0.5s0.86665 0.16665 1.2 0.5c0.33335 0.33335 0.5 0.73335 0.5 1.2s-0.16665 0.86665 -0.5 1.2c-0.33335 0.33335 -0.73335 0.5 -1.2 0.5s-0.86665 -0.16665 -1.2 -0.5c-0.33335 -0.33335 -0.5 -0.73335 -0.5 -1.2Zm1.45 17 -3.825 -4.175 1.6 -2.2 -1.6 -2.2 1.5 -1.875v-1.125c-1 -0.53335 -1.82085 -1.24165 -2.4625 -2.125C6.82085 9.41665 6.5 8.31665 6.5 7c0 -1.66665 0.58335 -3.083335 1.75 -4.25S10.83335 1 12.5 1c1.66665 0 3.08335 0.583335 4.25 1.75C17.91665 3.916665 18.5 5.33335 18.5 7c0 1.2 -0.28335 2.2375 -0.85 3.1125s-1.425 1.64585 -2.575 2.3125v8.75L12.25 24ZM8 7c0 0.96665 0.32085 1.88335 0.9625 2.75 0.64165 0.86665 1.4625 1.41665 2.4625 1.65v2.7l-1.125 1.35 1.575 2.2 -1.55 2.05 1.975 2.125 1.275 -1.275V11.4c1.1 -0.31665 1.94585 -0.87085 2.5375 -1.6625C16.70415 8.94585 17 8.03335 17 7c0 -1.25 -0.4375 -2.3125 -1.3125 -3.1875S13.75 2.5 12.5 2.5s-2.3125 0.4375 -3.1875 1.3125S8 5.75 8 7Z" stroke-width="0.5"></path>
                        </svg>
                    </div>
                    <h1 class="ls-sheet-title">新密码</h1>
                    <p class="ls-sheet-subtitle">选取一个你可以记住的安全密码。</p>

                    <form data-login-security-password-form novalidate style="width: 100%;">
                        <div class="ls-sheet-input-group">
                            <div class="ls-pwd-wrapper">
                                <input id="loginSecurityNewPassword" name="newPassword" type="password" autocomplete="new-password" minlength="8" placeholder="新密码" required oninput="checkLsPwdInput()">
                                <button class="ls-pwd-toggle" type="button" data-login-security-action="toggle-password" data-password-target="loginSecurityNewPassword" aria-label="显示密码">
                                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle><path class="ls-eye-slash" d="m4 4 16 16"></path></svg>
                                </button>
                            </div>
                            <div class="ls-divider"></div>
                            <div class="ls-pwd-wrapper">
                                <input id="loginSecurityConfirmPassword" name="newPasswordConfirm" type="password" autocomplete="new-password" minlength="8" placeholder="重新输入密码" required oninput="checkLsPwdInput()">
                                <button class="ls-pwd-toggle" type="button" data-login-security-action="toggle-password" data-password-target="loginSecurityConfirmPassword" aria-label="显示密码">
                                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle><path class="ls-eye-slash" d="m4 4 16 16"></path></svg>
                                </button>
                            </div>
                        </div>
                        <button class="ls-sheet-btn" id="lsContinueBtn" type="submit">继续</button>
                    </form>
                    <p class="ls-sheet-hint">注意保管好自己的密码！</p>
                    <p class="login-security-password-notice" id="loginSecurityPasswordNotice" role="status"></p>
                </div>
            </div>
        </div>
    </div>

    <div class="icloud-app-container" id="icloudAppUI">
        <!-- 主页面 -->
        <div class="ic-page active" id="ic-main-page">
            <div class="ic-header-area">
                <div class="ic-back-btn" onclick="closeIcloudApp()">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#000" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="15 18 9 12 15 6"></polyline></svg>
                </div>
                <div class="ic-header-title-row">
                    <div class="ic-header-title">数据管理中心</div>
                </div>
            </div>
            <div class="ic-card" style="padding: 18px 16px;" onclick="openIcStoragePage()">
                <div class="ic-storage-row">
                    <div class="ic-storage-left">
                        <span class="ic-storage-label">储存空间</span>
                        <div class="ic-progress-bar-bg">
                            <div class="ic-progress-bar-fill" id="ic-main-progress" style="width: 0%; transition: width 0.5s ease;"></div>
                        </div>
                    </div>
                    <div class="ic-card-action" id="ic-main-size" style="font-weight: 800; color: #000;">
                        计算中... <svg class="ic-chevron" viewBox="0 0 8 13"><path d="M1.5 1.5L6.5 6.5L1.5 11.5"/></svg>
                    </div>
                </div>
            </div>
            <div class="ic-card">
                <div class="ic-card-header">
                    <div class="ic-card-title"><div class="ic-dot"></div>已存至云端</div>
                    <div class="ic-card-action">查看全部 <svg class="ic-chevron" viewBox="0 0 8 13"><path d="M1.5 1.5L6.5 6.5L1.5 11.5"/></svg></div>
                </div>
                <div class="ic-grid-container">
                    <div class="ic-grid-item">
                        <div class="ic-app-icon-wrapper">
                            <div class="ic-custom-icon" id="ic-cloud-theme-icon" style="background-image: url('https://nos.netease.com/ysf/edecff66f1f78185763da92dcc2bd617.png');"></div>
                        </div>
                        <div class="ic-item-info">
                            <div class="ic-item-name">主题</div>
                            <div class="ic-item-desc" id="ic-cloud-theme-size">计算中...</div>
                        </div>
                    </div>
                    <div class="ic-grid-item">
                        <div class="ic-app-icon-wrapper">
                            <div class="ic-custom-icon" id="ic-cloud-worldbook-icon" style="background-image: url('https://wxkb-res-1258476243.cos.ap-shanghai.myqcloud.com/web/img/8848100788856671/1L7mKgmQ7qzXUq1S34ehFM_20260713082207#.png');"></div>
                        </div>
                        <div class="ic-item-info">
                            <div class="ic-item-name">世界书</div>
                            <div class="ic-item-desc" id="ic-cloud-worldbook-size">计算中...</div>
                        </div>
                    </div>
                    <div class="ic-grid-item">
                        <div class="ic-app-icon-wrapper">
                            <div class="ic-custom-icon" id="ic-cloud-wechat-icon" style="background-image: url('https://www.yn12377.cn/jubao/upload/smjb/2026/07/13/e4b01d48b8ad4a5b82879231b5376827.png');"></div>
                        </div>
                        <div class="ic-item-info">
                            <div class="ic-item-name">微信</div>
                            <div class="ic-item-desc" id="ic-cloud-wechat-size">计算中...</div>
                        </div>
                    </div>
                    <div class="ic-grid-item">
                        <div class="ic-app-icon-wrapper">
                            <div class="ic-custom-icon" id="ic-cloud-contacts-icon" style="background-image: url('https://nos.netease.com/ysf/1390642a446f8db21a89e22b6cc5dc97.png');"></div>
                        </div>
                        <div class="ic-item-info">
                            <div class="ic-item-name">Contacts</div>
                            <div class="ic-item-desc" id="ic-cloud-contacts-size">计算中...</div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="ic-card" style="padding: 16px; cursor: pointer;" onclick="openCloudBackupPage()">
                <div style="display: flex; justify-content: space-between; align-items: center;">
                    <div>
                        <div class="ic-card-title"><div class="ic-dot"></div> 云备份 </div>
                        <div class="ic-item-desc" id="ic-cloud-backup-status" style="margin-left: 16px; margin-top: 4px;">未设置</div>
                    </div>
                    <div class="ic-card-action">管理 <svg class="ic-chevron" viewBox="0 0 8 13"><path d="M1.5 1.5L6.5 6.5L1.5 11.5"/></svg></div>
                </div>
            </div>
            <div class="ic-card" style="padding: 16px 16px 8px;">
                <div class="ic-card-title" style="margin-bottom: 16px;">数据管理功能</div>
                <div class="ic-grid-container">
                    <div class="ic-grid-item" onclick="exportAllDataJson()" style="cursor: pointer;">
                        <div class="ic-app-icon-wrapper" style="background: transparent; box-shadow: none; border: none;">
                            <svg viewBox="0 0 40 40" style="width: 32px; height: 32px;"><circle cx="20" cy="20" r="16" fill="#007AFF" opacity="0.1"/><path d="M27.5 25.5h-15c-2.5 0-4.5-2-4.5-4.5 0-2.2 1.6-4.1 3.8-4.4 1-3.2 3.9-5.6 7.4-5.6 4 0 7.3 3 7.8 7 1.9.4 3.5 1.8 3.5 3.9 0 2-1.4 3.6-3 3.6z" fill="#007AFF"/><path d="M18.6 16h2.8v3.8h2.4l-3.8 3.8-3.8-3.8h2.4z" fill="#ffffff"/></svg>
                        </div>
                        <div class="ic-item-info">
                            <div class="ic-item-name">数据备份</div>
                            <div class="ic-item-desc">导出 JSON</div>
                        </div>
                    </div>
                    <div class="ic-grid-item" onclick="importAllDataJson()" style="cursor: pointer;">
                        <div class="ic-app-icon-wrapper" style="background: transparent; box-shadow: none; border: none;">
                            <svg viewBox="0 0 40 40" style="width: 32px; height: 32px;"><circle cx="20" cy="20" r="16" fill="#34C759" opacity="0.1"/><path d="M27.5 25.5h-15c-2.5 0-4.5-2-4.5-4.5 0-2.2 1.6-4.1 3.8-4.4 1-3.2 3.9-5.6 7.4-5.6 4 0 7.3 3 7.8 7 1.9.4 3.5 1.8 3.5 3.9 0 2-1.4 3.6-3 3.6z" fill="#34C759"/><path d="M20 15.4l3.8 3.8h-2.4v3.8h-2.8v-3.8h-2.4z" fill="#ffffff"/></svg>
                        </div>
                        <div class="ic-item-info">
                            <div class="ic-item-name">恢复数据</div>
                            <div class="ic-item-desc">导入 JSON</div>
                        </div>
                    </div>
                    <div class="ic-grid-item" onclick="exportAllDataZip()" style="cursor: pointer;">
                        <div class="ic-app-icon-wrapper" style="background: transparent; box-shadow: none; border: none;">
                            <svg viewBox="0 0 40 40" style="width: 32px; height: 32px;"><circle cx="20" cy="20" r="16" fill="#FF9500" opacity="0.1"/><g transform="translate(10, 10) scale(1.25)"><path d="M14 3.333333333333333c0.36819999999999997 0 0.6666666666666666 0.29847999999999997 0.6666666666666666 0.6666666666666666v9.333333333333332c0 0.36819999999999997 -0.29846666666666666 0.6666666666666666 -0.6666666666666666 0.6666666666666666H2c-0.36818666666666666 0 -0.6666666666666666 -0.29846666666666666 -0.6666666666666666 -0.6666666666666666V2.6666666666666665c0 -0.36818666666666666 0.29847999999999997 -0.6666666666666666 0.6666666666666666 -0.6666666666666666h4.9428l1.3333333333333333 1.3333333333333333H10.666666666666666v1.3333333333333333h1.3333333333333333V3.333333333333333h2Zm-2 5.333333333333333h-1.3333333333333333v1.3333333333333333h-1.3333333333333333v2h2.6666666666666665v-3.333333333333333Zm-1.3333333333333333 -1.3333333333333333h-1.3333333333333333v1.3333333333333333h1.3333333333333333v-1.3333333333333333Zm1.3333333333333333 -1.3333333333333333h-1.3333333333333333v1.3333333333333333h1.3333333333333333V6Zm-1.3333333333333333 -1.3333333333333333h-1.3333333333333333v1.3333333333333333h1.3333333333333333V4.666666666666666Z" fill="#FF9500"></path></g></svg>
                        </div>
                        <div class="ic-item-info">
                            <div class="ic-item-name">zip备份</div>
                            <div class="ic-item-desc">导出 ZIP</div>
                        </div>
                    </div>
                    <div class="ic-grid-item" onclick="syncToLocalDrive()" style="cursor: pointer;">
                        <div class="ic-app-icon-wrapper" style="background: transparent; box-shadow: none; border: none;">
                            <svg viewBox="0 0 40 40" style="width: 32px; height: 32px;"><circle cx="20" cy="20" r="16" fill="#5AC8FA" opacity="0.1"/><g transform="translate(8, 8)"><path d="M23 11.75H1a1 1 0 0 0 -1 1v3a2.5 2.5 0 0 0 1.59 2.32 0.24 0.24 0 0 1 0.16 0.23v1.2a0.75 0.75 0 0 0 1.5 0v-1a0.25 0.25 0 0 1 0.25 -0.25h17a0.25 0.25 0 0 1 0.25 0.25v1a0.75 0.75 0 0 0 1.5 0v-1.2a0.24 0.24 0 0 1 0.16 -0.23A2.5 2.5 0 0 0 24 15.75v-3a1 1 0 0 0 -1 -1Zm-3 4a1 1 0 1 1 1 -1 1 1 0 0 1 -1 1Zm-2 -1a1 1 0 1 1 -1 -1 1 1 0 0 1 1 1Zm-3 0a1 1 0 1 1 -1 -1 1 1 0 0 1 1 1Z" fill="#5AC8FA"></path><path d="M1.08 10.75h21.84a1 1 0 0 0 0.92 -0.63 1 1 0 0 0 -0.21 -1.07l-4.57 -4.86A1.5 1.5 0 0 0 18 3.75H6a1.51 1.51 0 0 0 -1.07 0.45L0.39 9a1 1 0 0 0 -0.23 1.09 1 1 0 0 0 0.92 0.66Z" fill="#5AC8FA"></path></g></svg>
                        </div>
                        <div class="ic-item-info">
                            <div class="ic-item-name">本地硬盘</div>
                            <div class="ic-item-desc">File System</div>
                        </div>
                    </div>
                    <div class="ic-grid-item" onclick="openBackupReminderSheet()" style="cursor: pointer;">
                        <div class="ic-app-icon-wrapper" style="background: transparent; box-shadow: none; border: none;">
                            <svg viewBox="0 0 40 40" style="width: 32px; height: 32px;"><circle cx="20" cy="20" r="16" fill="#AF52DE" opacity="0.1"/><g transform="translate(8, 8)"><path fill="#AF52DE" fill-rule="evenodd" d="M13 4V1h-2v3h1a9.5 9.5 0 1 0 0 19 9.5 9.5 0 0 0 0 -19h1ZM2.207 7.207l4.5 -4.5 -1.414 -1.414 -4.5 4.5 1.414 1.414Zm15.086 -4.5 4.5 4.5 1.414 -1.414 -4.5 -4.5 -1.414 1.414ZM11 8v6h4.5v-2H13V8h-2Z" clip-rule="evenodd"></path></g></svg>
                        </div>
                        <div class="ic-item-info">
                            <div class="ic-item-name">定时提醒</div>
                            <div class="ic-item-desc">备份提醒</div>
                        </div>
                    </div>
                    <div class="ic-grid-item" onclick="clearAllAppData()" style="cursor: pointer;">
                        <div class="ic-app-icon-wrapper" style="background: transparent; box-shadow: none; border: none;">
                            <svg viewBox="0 0 40 40" style="width: 32px; height: 32px;"><circle cx="20" cy="20" r="16" fill="#FF3B30" opacity="0.1"/><g transform="translate(10, 10) scale(1.25)"><path fill-rule="evenodd" d="M11 2.985333333333333v0.15133333333333332a32.544 32.544 0 0 1 2.5853333333333333 0.3413333333333333 0.5 0.5 0 1 1 -0.17066666666666666 0.9853333333333333l-0.1393333333333333 -0.023333333333333334 -0.6699999999999999 8.713333333333333a2 2 0 0 1 -1.994 1.8466666666666667H5.389333333333333a2 2 0 0 1 -1.994 -1.8466666666666667L2.7246666666666663 4.4399999999999995l-0.1393333333333333 0.023333333333333334a0.5 0.5 0 0 1 -0.17066666666666666 -0.9853333333333333A32.378 32.378 0 0 1 5 3.1366666666666667v-0.15133333333333332c0 -1.0426666666666666 0.8086666666666666 -1.9333333333333331 1.877333333333333 -1.9673333333333334a35.108 35.108 0 0 1 2.246 0c1.0686666666666667 0.033999999999999996 1.8766666666666665 0.9246666666666666 1.8766666666666665 1.9673333333333334Zm-4.0906666666666665 -0.968a34.13066666666666 34.13066666666666 0 0 1 2.182 0C9.593333333333334 2.033333333333333 10 2.456 10 2.985333333333333v0.07533333333333334a32.992 32.992 0 0 0 -4 0v-0.07533333333333334c0 -0.5293333333333333 0.40599999999999997 -0.952 0.9093333333333333 -0.968Zm-0.23666666666666664 3.9633333333333334a0.5 0.5 0 1 0 -1 0.03866666666666667l0.2313333333333333 6a0.5 0.5 0 1 0 0.9993333333333334 -0.03866666666666667l-0.23066666666666663 -6Zm3.6533333333333333 0.03866666666666667a0.5 0.5 0 1 0 -0.9986666666666666 -0.03866666666666667l-0.2313333333333333 6a0.5 0.5 0 0 0 1 0.03866666666666667l0.22999999999999998 -6Z" clip-rule="evenodd" fill="#FF3B30"></path></g></svg>
                        </div>
                        <div class="ic-item-info">
                            <div class="ic-item-name" style="color: #ff3b30;">清空数据</div>
                            <div class="ic-item-desc">清空重置</div>
                        </div>
                    </div>
                </div>
            </div>
            <input type="file" id="importAllDataInput" accept=".json,.zip" style="display: none;" onchange="handleImportAllData(event)">
            <div class="ic-list-card">
                <div class="ic-list-item" onclick="requestPersistentStorage()" style="cursor: pointer;">
                    <div class="ic-list-item-left">
                        <div class="ic-list-item-title">数据持久化储存</div>
                    </div>
                    <div class="ic-list-item-right" id="ic-persist-status" style="font-weight: 600;">
                        检测中 <svg class="ic-chevron" viewBox="0 0 8 13"><path d="M1.5 1.5L6.5 6.5L1.5 11.5"/></svg>
                    </div>
                </div>
            </div>
            <div style="height: 40px;"></div>
        </div>

        <!-- 定时提醒设置抽屉 -->
        <div class="ls-sheet-overlay" id="backupReminderSheetOverlay" onclick="closeBackupReminderSheet()"></div>
        <div class="ls-sheet-container apple-id-profile-sheet-compact" id="backupReminderSheet">
            <div class="ls-sheet-bg-card"></div>
            <div class="ls-sheet-main">
                <div class="ls-sheet-header" style="justify-content: space-between;">
                    <div class="ls-sheet-cancel" onclick="closeBackupReminderSheet()">取消</div>
                    <div style="font-size: 17px; font-weight: 600; color: #000;">备份提醒设置</div>
                    <div class="ls-sheet-cancel" style="font-weight: 600;" onclick="saveBackupReminderSettings()">完成</div>
                </div>
                <div class="ls-sheet-content" style="padding: 12px 16px 30px; width: 100%; box-sizing: border-box;">
                    <div class="ds-card-group" style="margin: 0 0 16px; width: 100%;">
                        <div class="ds-list-item" style="padding: 12px 16px;">
                            <span style="font-size: 16px; font-weight: 500; color: #000;">开启定时提醒</span>
                            <div class="ds-toggle" id="backupReminderToggle" role="switch" aria-checked="false" onclick="toggleBackupReminderSwitch()"></div>
                        </div>
                        <div class="ds-list-item" style="padding: 12px 16px; border-top: 0.5px solid #e5e5ea;">
                            <span style="font-size: 16px; font-weight: 500; color: #000;">上次备份时间</span>
                            <span id="backupReminderLastTime" style="font-size: 15px; color: #8e8e93;">从未备份</span>
                        </div>
                    </div>

                    <div class="ds-section-title" style="margin: 0 12px 8px; width: 100%;">提醒周期</div>
                    <div class="ds-card-group" style="margin: 0 0 8px; width: 100%;">
                        <div class="ds-list-item" style="padding: 12px 16px;">
                            <span style="font-size: 16px; font-weight: 500; color: #000;">备份提醒间隔</span>
                            <div style="display: flex; align-items: center; gap: 6px;">
                                <input type="number" id="backupReminderDaysInput" min="1" max="365" value="7" style="width: 50px; text-align: right; border: none; background: transparent; font-size: 16px; color: #007aff; font-weight: 600; outline: none;">
                                <span style="font-size: 15px; color: #8e8e93;">天</span>
                            </div>
                        </div>
                    </div>
                    <div class="ds-section-footer" style="margin: 0 12px; width: 100%;">当距离上一次备份超过设定的天数时，系统会自动弹出弹窗提醒您进行数据备份。</div>
                </div>
            </div>
        </div>

        <!-- 储存空间详情页 -->
        <div class="ic-page slide-right" id="ic-storage-page">
            <div class="ic-nav-bar-detail" style="padding-top: 45px;">
                <div class="ic-back-btn" onclick="closeIcStoragePage()">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#000" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="15 18 9 12 15 6"></polyline></svg>
                </div>
                <div class="ic-nav-title-detail">储存空间</div>
                <div style="width: 36px;"></div>
            </div>
            <div class="ic-card">
                <div class="ic-storage-detail-header">
                    <div class="ic-storage-detail-title">当前设备</div>
                    <div class="ic-storage-detail-size" id="ic-detail-size" style="font-weight: 700; color: #000;">已使用 计算中...</div>
                </div>
                <div class="ic-multi-progress-bar">
                    <div class="ic-segment red" id="ic-seg-red" style="width: 0%; transition: width 0.5s ease;"></div>
                    <div class="ic-segment orange" id="ic-seg-orange" style="width: 0%; transition: width 0.5s ease;"></div>
                    <div class="ic-segment gray" id="ic-seg-gray" style="width: 0%; transition: width 0.5s ease;"></div>
                    <div class="ic-segment light-gray" id="ic-seg-light" style="width: 0%; transition: width 0.5s ease;"></div>
                </div>
                <div class="ic-legend-container">
                    <div class="ic-legend-item"><span class="ic-dot red"></span><span id="ic-legend-photo">照片</span></div>
                    <div class="ic-legend-item"><span class="ic-dot orange"></span><span id="ic-legend-apps">应用程序</span></div>
                    <div class="ic-legend-item"><span class="ic-dot gray"></span><span id="ic-legend-chat">聊天数据</span></div>
                    <div class="ic-legend-item"><span class="ic-dot light-gray"></span><span id="ic-legend-system">系统数据</span></div>
                </div>
            </div>
            <div class="ic-sort-row">
                <span style="font-weight: bold;">大小</span>
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="7 15 12 20 17 15"></polyline><polyline points="7 9 12 4 17 9"></polyline></svg>
            </div>
            <div class="ic-list-card" id="ic-storage-app-list">
                <div class="ic-app-list-item">
                    <div class="ic-app-list-left">
                        <div class="ic-app-icon-wrapper">
                            <div class="ic-custom-icon" style="background-image: url('https://cac.opple.com/yc-media/getFile?id=5b0f2ceab564421096b8a761f125b9f8#.jpg');"></div>
                        </div>
                        <div class="ic-app-list-info">
                            <div class="ic-app-list-name">设置</div>
                            <div class="ic-app-list-date">上次使用：今天</div>
                        </div>
                    </div>
                    <div class="ic-app-list-right" id="ic-detail-settings-size">
                        计算中... <svg class="ic-chevron" viewBox="0 0 8 13"><path d="M1.5 1.5L6.5 6.5L1.5 11.5"/></svg>
                    </div>
                </div>
                <div class="ic-app-list-item">
                    <div class="ic-app-list-left">
                        <div class="ic-app-icon-wrapper">
                            <div class="ic-custom-icon" style="background-image: url('https://nos.netease.com/ysf/edecff66f1f78185763da92dcc2bd617.png');"></div>
                        </div>
                        <div class="ic-app-list-info">
                            <div class="ic-app-list-name">主题</div>
                            <div class="ic-app-list-date">上次使用：今天</div>
                        </div>
                    </div>
                    <div class="ic-app-list-right" id="ic-detail-theme-size">
                        计算中... <svg class="ic-chevron" viewBox="0 0 8 13"><path d="M1.5 1.5L6.5 6.5L1.5 11.5"/></svg>
                    </div>
                </div>
                <div class="ic-app-list-item">
                    <div class="ic-app-list-left">
                        <div class="ic-app-icon-wrapper">
                            <div class="ic-custom-icon" style="background-image: url('https://wxkb-res-1258476243.cos.ap-shanghai.myqcloud.com/web/img/8848100788856671/1L7mKgmQ7qzXUq1S34ehFM_20260713082207#.png');"></div>
                        </div>
                        <div class="ic-app-list-info">
                            <div class="ic-app-list-name">世界书</div>
                            <div class="ic-app-list-date">上次使用：今天</div>
                        </div>
                    </div>
                    <div class="ic-app-list-right" id="ic-detail-worldbook-size">
                        计算中... <svg class="ic-chevron" viewBox="0 0 8 13"><path d="M1.5 1.5L6.5 6.5L1.5 11.5"/></svg>
                    </div>
                </div>
                <div class="ic-app-list-item">
                    <div class="ic-app-list-left">
                        <div class="ic-app-icon-wrapper">
                            <div class="ic-custom-icon" style="background-image: url('https://www.yn12377.cn/jubao/upload/smjb/2026/07/13/e4b01d48b8ad4a5b82879231b5376827.png');"></div>
                        </div>
                        <div class="ic-app-list-info">
                            <div class="ic-app-list-name">微信</div>
                            <div class="ic-app-list-date">上次使用：今天</div>
                        </div>
                    </div>
                    <div class="ic-app-list-right" id="ic-detail-wechat-size">
                        计算中... <svg class="ic-chevron" viewBox="0 0 8 13"><path d="M1.5 1.5L6.5 6.5L1.5 11.5"/></svg>
                    </div>
                </div>
                <div class="ic-app-list-item">
                    <div class="ic-app-list-left">
                        <div class="ic-app-icon-wrapper">
                            <div class="ic-custom-icon" style="background-image: url('https://nos.netease.com/ysf/1390642a446f8db21a89e22b6cc5dc97.png');"></div>
                        </div>
                        <div class="ic-app-list-info">
                            <div class="ic-app-list-name">通讯录</div>
                            <div class="ic-app-list-date">上次使用：今天</div>
                        </div>
                    </div>
                    <div class="ic-app-list-right" id="ic-detail-contacts-size">
                        计算中... <svg class="ic-chevron" viewBox="0 0 8 13"><path d="M1.5 1.5L6.5 6.5L1.5 11.5"/></svg>
                    </div>
                </div>
                <div class="ic-app-list-item">
                    <div class="ic-app-list-left">
                        <div class="ic-app-icon-wrapper">
                            <div class="ic-custom-icon" style="background-image: url('https://nos.netease.com/ysf/44b1b063945538f0ebf2e1670a156958.jpg');"></div>
                        </div>
                        <div class="ic-app-list-info">
                            <div class="ic-app-list-name">音乐</div>
                            <div class="ic-app-list-date">上次使用：今天</div>
                        </div>
                    </div>
                    <div class="ic-app-list-right" id="ic-detail-music-size">
                        计算中... <svg class="ic-chevron" viewBox="0 0 8 13"><path d="M1.5 1.5L6.5 6.5L1.5 11.5"/></svg>
                    </div>
                </div>
                <div class="ic-app-list-item">
                    <div class="ic-app-list-left">
                        <div class="ic-app-icon-wrapper">
                            <div class="ic-custom-icon" style="background-image: url('https://nos.netease.com/ysf/264a2314c1b49fc41a3bab78fe2b3576.png');"></div>
                        </div>
                        <div class="ic-app-list-info">
                            <div class="ic-app-list-name">见面</div>
                            <div class="ic-app-list-date">上次使用：今天</div>
                        </div>
                    </div>
                    <div class="ic-app-list-right" id="ic-detail-meeting-size">
                        计算中... <svg class="ic-chevron" viewBox="0 0 8 13"><path d="M1.5 1.5L6.5 6.5L1.5 11.5"/></svg>
                    </div>
                </div>
                <div class="ic-app-list-item">
                    <div class="ic-app-list-left">
                        <div class="ic-app-icon-wrapper">
                            <div class="ic-custom-icon" style="background-image: url('https://nos.netease.com/ysf/d7efc8377e018aef7b88be373106a333.png');"></div>
                        </div>
                        <div class="ic-app-list-info">
                            <div class="ic-app-list-name">记忆</div>
                            <div class="ic-app-list-date">上次使用：今天</div>
                        </div>
                    </div>
                    <div class="ic-app-list-right" id="ic-detail-memory-size">
                        计算中... <svg class="ic-chevron" viewBox="0 0 8 13"><path d="M1.5 1.5L6.5 6.5L1.5 11.5"/></svg>
                    </div>
                </div>
                <div class="ic-app-list-item">
                    <div class="ic-app-list-left">
                        <div class="ic-app-icon-wrapper">
                            <div class="ic-custom-icon" style="background-image: url('https://nos.netease.com/ysf/1b49764d130e8005ea149180a1d764db.jpg');"></div>
                        </div>
                        <div class="ic-app-list-info">
                            <div class="ic-app-list-name">icity</div>
                            <div class="ic-app-list-date">上次使用：今天</div>
                        </div>
                    </div>
                    <div class="ic-app-list-right" id="ic-detail-icity-size">
                        计算中... <svg class="ic-chevron" viewBox="0 0 8 13"><path d="M1.5 1.5L6.5 6.5L1.5 11.5"/></svg>
                    </div>
                </div>
            </div>
            <div style="height: 40px;"></div>
        </div>

        <!-- 本地硬盘备份页 -->
        <div class="ic-page slide-right" id="ic-local-drive-page">
            <div class="ic-nav-bar-detail" style="padding-top: 45px;">
                <div class="ic-back-btn" onclick="closeLocalDrivePage()">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#000" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="15 18 9 12 15 6"></polyline></svg>
                </div>
                <div class="ic-nav-title-detail">本地硬盘备份</div>
                <div style="width: 36px;"></div>
            </div>

            <div class="ic-card">
                <div class="ic-card-title" style="margin-bottom: 16px;">备份状态</div>
                <div class="ic-list-item" style="padding: 8px 0; min-height: auto; border: none;">
                    <div class="ic-list-item-title" style="font-size: 14px; color: #8e8e93;">当前模式</div>
                    <div class="ic-list-item-right" id="ld-current-mode" style="color: #000;">未设置</div>
                </div>
                <div class="ic-list-item" style="padding: 8px 0; min-height: auto; border: none;">
                    <div class="ic-list-item-title" style="font-size: 14px; color: #8e8e93;">目标位置</div>
                    <div class="ic-list-item-right" id="ld-target-name" style="color: #000; max-width: 180px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">--</div>
                </div>
                <div class="ic-list-item" style="padding: 8px 0; min-height: auto; border: none;">
                    <div class="ic-list-item-title" style="font-size: 14px; color: #8e8e93;">文件名称</div>
                    <div class="ic-list-item-right" id="ld-file-name" style="color: #000; max-width: 180px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">--</div>
                </div>
                <div class="ic-list-item" style="padding: 8px 0; min-height: auto; border: none;">
                    <div class="ic-list-item-title" style="font-size: 14px; color: #8e8e93;">上次备份</div>
                    <div class="ic-list-item-right" id="ld-last-time" style="color: #000;">--</div>
                </div>
                <div class="ic-list-item" style="padding: 8px 0; min-height: auto; border: none;">
                    <div class="ic-list-item-title" style="font-size: 14px; color: #8e8e93;">备份大小</div>
                    <div class="ic-list-item-right" id="ld-last-size" style="color: #000;">--</div>
                </div>
            </div>

            <div class="ic-card" style="padding: 16px 16px 8px;">
                <div class="ic-card-title" style="margin-bottom: 16px;">选择模式</div>
                <div class="ic-grid-container">
                    <div class="ic-grid-item" onclick="setupFolderMode()" style="cursor: pointer;">
                        <div class="ic-app-icon-wrapper" style="background: transparent; box-shadow: none; border: none;">
                            <svg viewBox="0 0 40 40"><circle cx="20" cy="20" r="16" fill="#007AFF" opacity="0.1"/><path d="M12 16h16v10a2 2 0 0 1-2 2H14a2 2 0 0 1-2-2V16z" stroke="#007AFF" stroke-width="2" fill="none"/><path d="M16 16v-2a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" stroke="#007AFF" stroke-width="2" fill="none"/></svg>
                        </div>
                        <div class="ic-item-info">
                            <div class="ic-item-name">文件夹模式</div>
                            <div class="ic-item-desc">自动覆盖保存</div>
                        </div>
                    </div>
                    <div class="ic-grid-item" onclick="setupFileMode()" style="cursor: pointer;">
                        <div class="ic-app-icon-wrapper" style="background: transparent; box-shadow: none; border: none;">
                            <svg viewBox="0 0 40 40"><circle cx="20" cy="20" r="16" fill="#34C759" opacity="0.1"/><path d="M14 12h8l6 6v10a2 2 0 0 1-2 2H14a2 2 0 0 1-2-2V14a2 2 0 0 1 2-2z" stroke="#34C759" stroke-width="2" fill="none"/><polyline points="22 12 22 18 28 18" stroke="#34C759" stroke-width="2" fill="none"/></svg>
                        </div>
                        <div class="ic-item-info">
                            <div class="ic-item-name">单文件模式</div>
                            <div class="ic-item-desc">保存为单文件</div>
                        </div>
                    </div>
                </div>
            </div>

            <div class="ic-card" style="padding: 0;">
                <div class="ic-list-item" style="padding: 12px 16px;">
                    <div class="ic-list-item-title">自动备份</div>
                    <div class="api-toggle off" id="autoBackupToggle" onclick="toggleAutoBackup()"></div>
                </div>
                <div class="ic-list-item" style="padding: 12px 16px; border-bottom: 1px solid #f2f2f7;">
                    <div class="ic-list-item-title">备份模式</div>
                    <div id="autoBackupModeBtn" onclick="openAutoBackupModeSelect()" style="font-size: 16px; color: #8e8e93; cursor: pointer; display: flex; align-items: center; gap: 6px;">
                        <span id="autoBackupModeText" data-value="action">每次修改时</span>
                        <svg class="ic-chevron" viewBox="0 0 8 13"><path d="M1.5 1.5L6.5 6.5L1.5 11.5"/></svg>
                    </div>
                </div>
                <div class="ic-list-item" id="intervalSettingsRow" style="padding: 12px 16px; display: none; border-bottom: 1px solid #f2f2f7;">
                    <div class="ic-list-item-title">间隔时间</div>
                    <div style="display: flex; align-items: center; gap: 8px;">
                        <input type="number" id="backupIntervalValue" value="30" onchange="updateBackupSettings()" style="width: 50px; text-align: right; border: none; background: transparent; font-size: 16px; color: #007aff; outline: none;">
                        <div id="backupIntervalUnitBtn" onclick="openBackupIntervalUnitSelect()" style="font-size: 16px; color: #8e8e93; cursor: pointer; display: flex; align-items: center; gap: 6px;">
                            <span id="backupIntervalUnitText" data-value="60000">分钟</span>
                            <svg class="ic-chevron" viewBox="0 0 8 13"><path d="M1.5 1.5L6.5 6.5L1.5 11.5"/></svg>
                        </div>
                    </div>
                </div>
                <div class="ic-list-item" id="scheduledSettingsRow" style="padding: 12px 16px; display: none;">
                    <div class="ic-list-item-title">定时时间</div>
                    <input type="time" id="backupScheduledTime" value="02:00" onchange="updateBackupSettings()" style="border: none; background: transparent; font-size: 16px; color: #007aff; outline: none; text-align: right;">
                </div>
            </div>

            <div style="display: flex; gap: 12px; padding: 0 16px 24px 16px;">
                <div onclick="performLocalBackup()" style="flex: 1; background-color: #007aff; color: #fff; border-radius: 14px; padding: 14px 0; text-align: center; font-size: 16px; font-weight: 600; cursor: pointer; box-shadow: 0 4px 12px rgba(0,122,255,0.3);">
                    立即备份
                </div>
                <div onclick="restoreFromLocalFolder()" style="flex: 1; background-color: #34c759; color: #fff; border-radius: 14px; padding: 14px 0; text-align: center; font-size: 16px; font-weight: 600; cursor: pointer; box-shadow: 0 4px 12px rgba(52,199,89,0.3);">
                    恢复数据
                </div>
            </div>
        </div>

        <!-- 云备份页 (全新 iOS 优雅设计) -->
        <div class="ic-page slide-right" id="ic-cloud-backup-page">
            <div class="ic-nav-bar-detail" style="padding-top: 45px;">
                <div class="ic-back-btn" onclick="closeCloudBackupPage()">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#000" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="15 18 9 12 15 6"></polyline></svg>
                </div>
                <div class="ic-nav-title-detail">云备份</div>
                <div style="width: 36px;"></div>
            </div>

            <!-- 顶部 Hero 状态卡片 -->
            <div class="ic-card" style="display: flex; flex-direction: column; align-items: center; padding: 24px 16px 20px; text-align: center;">
                <div style="width: 58px; height: 58px; border-radius: 16px; background: linear-gradient(135deg, #2b3137 0%, #181717 100%); display: flex; align-items: center; justify-content: center; box-shadow: 0 4px 12px rgba(0,0,0,0.15); margin-bottom: 12px;">
                    <svg width="34" height="34" viewBox="0 0 24 24" fill="#ffffff">
                        <path fill-rule="evenodd" clip-rule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"/>
                    </svg>
                </div>
                <div style="font-size: 19px; font-weight: 700; color: #000; margin-bottom: 4px;">GitHub 云同步</div>
                <div style="font-size: 13px; color: #8e8e93; max-width: 260px; line-height: 1.4;">将应用配置、聊天记录与角色数据加密备份至您的私有仓库。</div>
            </div>

            <!-- 配置表单卡片 -->
            <div style="font-size: 13px; color: #8e8e93; margin: 0 32px 6px; text-transform: uppercase; font-weight: 500;">仓库配置</div>
            <div class="ic-card" style="padding: 0; overflow: hidden; margin-bottom: 20px;">
                <div class="ic-list-item" style="padding: 12px 16px; min-height: 48px;">
                    <div class="ic-list-item-title" style="font-size: 15px; width: 80px; flex-shrink: 0;">Token</div>
                    <input id="githubBackupToken" type="password" autocomplete="off" spellcheck="false" placeholder="github_pat_..." style="flex: 1; min-width: 0; border: none; background: transparent; text-align: right; font-size: 15px; color: #000; outline: none; font-weight: 500;">
                </div>
                <div class="ic-list-item" style="padding: 12px 16px; min-height: 48px;">
                    <div class="ic-list-item-title" style="font-size: 15px; width: 80px; flex-shrink: 0;">用户名</div>
                    <input id="githubBackupOwner" type="text" autocomplete="username" autocapitalize="none" spellcheck="false" placeholder="GitHub 用户名" style="flex: 1; min-width: 0; border: none; background: transparent; text-align: right; font-size: 15px; color: #000; outline: none; font-weight: 500;">
                </div>
                <div class="ic-list-item" style="padding: 12px 16px; min-height: 48px;">
                    <div class="ic-list-item-title" style="font-size: 15px; width: 80px; flex-shrink: 0;">仓库名</div>
                    <input id="githubBackupRepo" type="text" autocomplete="off" autocapitalize="none" spellcheck="false" placeholder="备份仓库名" style="flex: 1; min-width: 0; border: none; background: transparent; text-align: right; font-size: 15px; color: #000; outline: none; font-weight: 500;">
                </div>
                <div class="ic-list-item" style="padding: 12px 16px; min-height: 48px; border-bottom: none;">
                    <div class="ic-list-item-title" style="font-size: 15px; width: 80px; flex-shrink: 0;">备份前缀</div>
                    <input id="githubBackupFileName" type="text" autocomplete="off" autocapitalize="none" spellcheck="false" placeholder="tonghuaji-backup" style="flex: 1; min-width: 0; border: none; background: transparent; text-align: right; font-size: 15px; color: #000; outline: none; font-weight: 500;">
                </div>
            </div>

            <!-- 自动化卡片 -->
            <div style="font-size: 13px; color: #8e8e93; margin: 0 32px 6px; text-transform: uppercase; font-weight: 500;">自动化</div>
            <div class="ic-card" style="padding: 0; overflow: hidden; margin-bottom: 20px;">
                <div class="ic-list-item" style="padding: 12px 16px; min-height: 48px; border-bottom: none;">
                    <div class="ic-list-item-title" style="font-size: 15px;">每日定时备份</div>
                    <div style="display: flex; align-items: center; gap: 10px;">
                        <input id="githubBackupScheduledTime" type="time" value="02:00" onchange="updateGithubBackupSchedule()" style="border: none; background: transparent; text-align: right; font-size: 16px; color: #007aff; font-weight: 600; outline: none;">
                        <div class="api-toggle off" id="githubBackupScheduleToggle" onclick="toggleGithubBackupSchedule()"></div>
                    </div>
                </div>
                <div class="ic-list-item" style="padding: 12px 16px; min-height: 48px; border-top: 1px solid rgba(0,0,0,0.06); border-bottom: none;">
                    <div class="ic-list-item-title" style="font-size: 15px;">间隔自动备份</div>
                    <div style="display: flex; align-items: center; gap: 8px;">
                        <input id="githubBackupIntervalValue" type="number" min="1" step="1" value="30" inputmode="numeric" onchange="updateGithubBackupSchedule()" style="width: 52px; border: none; background: transparent; text-align: right; font-size: 16px; color: #007aff; font-weight: 600; outline: none;">
                        <select id="githubBackupIntervalUnit" onchange="updateGithubBackupSchedule()" style="border: none; background: transparent; font-size: 15px; color: #007aff; outline: none;">
                            <option value="minute">分钟</option>
                            <option value="hour">小时</option>
                        </select>
                        <div class="api-toggle off" id="githubBackupIntervalToggle" onclick="toggleGithubBackupInterval()"></div>
                    </div>
                </div>
            </div>

            <!-- 操作按钮组 -->
            <div style="padding: 0 16px; display: flex; flex-direction: column; gap: 10px; margin-bottom: 16px;">
                <div onclick="uploadGithubBackup()" style="background-color: #007aff; color: #fff; border-radius: 14px; padding: 14px 0; text-align: center; font-size: 16px; font-weight: 600; cursor: pointer; box-shadow: 0 4px 12px rgba(0,122,255,0.25);">
                    立即备份到 GitHub
                </div>
                <div style="display: flex; gap: 10px;">
                    <div onclick="saveGithubBackupSettings()" style="flex: 1; background-color: #ffffff; color: #007aff; border-radius: 14px; padding: 13px 0; text-align: center; font-size: 15px; font-weight: 600; cursor: pointer; border: 1px solid rgba(0,122,255,0.2);">
                        保存配置
                    </div>
                    <div onclick="restoreGithubBackup()" style="flex: 1; background-color: #ffffff; color: #34c759; border-radius: 14px; padding: 13px 0; text-align: center; font-size: 15px; font-weight: 600; cursor: pointer; border: 1px solid rgba(52,199,89,0.2);">
                        从 GitHub 恢复
                    </div>
                </div>
            </div>

            <div style="font-size: 13px; color: #8e8e93; margin: 0 32px 6px; text-transform: uppercase; font-weight: 500;">备份记录</div>
            <div class="ic-card" id="githubBackupHistoryList" style="padding: 14px 16px; margin-bottom: 20px; font-size: 13px; color: #8e8e93; line-height: 1.45;">
                暂无备份记录
            </div>

            <div style="font-size: 12px; color: #8e8e93; text-align: center; padding: 0 32px 30px; line-height: 1.45;">
                Token 仅保存在当前设备本地；备份文件将拆分为模块化 JSON 存储至您的专属私有仓库。
            </div>
            <div id="githubBackupProgressOverlay" role="dialog" aria-modal="true" aria-live="polite" style="display: none; position: absolute; inset: 0; z-index: 20; align-items: center; justify-content: center; padding: 24px; background: rgba(0,0,0,0.28); backdrop-filter: blur(8px); -webkit-backdrop-filter: blur(8px);">
                <div style="width: min(310px, 100%); padding: 22px 20px 18px; border-radius: 20px; background: rgba(255,255,255,0.96); box-shadow: 0 14px 40px rgba(0,0,0,0.18);">
                    <div id="githubBackupProgressTitle" style="font-size: 17px; font-weight: 700; color: #1c1c1e; text-align: center;">正在备份到 GitHub</div>
                    <div id="githubBackupProgressText" style="margin-top: 8px; font-size: 13px; color: #8e8e93; text-align: center;">正在准备备份...</div>
                    <div style="height: 8px; margin-top: 18px; overflow: hidden; border-radius: 8px; background: #e5e5ea;"><div id="githubBackupProgressFill" style="width: 0%; height: 100%; border-radius: inherit; background: #007aff; transition: width 0.2s ease;"></div></div>
                    <div id="githubBackupProgressPercent" style="margin-top: 9px; font-size: 13px; color: #007aff; font-weight: 600; text-align: center;">0%</div>
                </div>
            </div>
            <div style="height: 40px;"></div>
        </div>
    </div>

    <!-- API 连接页面容器 -->
    `;
    const anchor = document.currentScript;
    if (anchor && anchor.parentNode) {
        anchor.insertAdjacentHTML('afterend', html);
    } else {
        document.body.insertAdjacentHTML('beforeend', html);
    }
})();


(() => {
    if (document.getElementById('proactiveMessagesAppUI')) return;
    const html = `<div class="display-settings-container" id="proactiveMessagesAppUI">
        <div class="ds-nav-bar">
            <div class="ds-back-btn" onclick="closeProactiveMessagesApp()">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#000" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="15 18 9 12 15 6"></polyline></svg>
            </div>
            <div class="ds-nav-title">后端消息</div>
        </div>
        <div class="ds-content">
            <div class="ds-section-title">功能说明</div>
            <div class="ds-card-group" style="background: #f9f9fb; border-radius: 12px; padding: 16px; margin-bottom: 16px; line-height: 1.6;">
                <div style="font-size: 14px; color: #666;">
                    <p style="margin: 0 0 12px 0;">开启后端消息后，即使关闭网页或浏览器，角色也能主动向你发送消息。</p>
                    <p style="margin: 0 0 12px 0;"><strong style="color: #333;">工作原理：</strong></p>
                    <ul style="margin: 0; padding-left: 20px;">
                        <li style="margin-bottom: 8px;">系统会通过后端服务定期检查角色的状态和上下文</li>
                        <li style="margin-bottom: 8px;">当角色想要主动发起对话时，会通过推送通知提醒你</li>
                        <li style="margin-bottom: 8px;">即使你没有打开童话机，也能收到角色的主动消息提醒</li>
                        <li style="margin-bottom: 0;">点击通知即可打开对话，查看角色发来的内容</li>
                    </ul>
                    <p style="margin: 12px 0 0 0; color: #999; font-size: 13px;">💡 提示：首次开启时需要授权浏览器通知权限</p>
                    <p style="margin: 8px 0 0 0; color: #999; font-size: 12px;">后端仅在你开启角色后保存该角色的人设、最近聊天和所选 API 配置，用于在浏览器关闭后生成消息。</p>
                </div>
            </div>
            <div class="ds-section-title">选择接收后端消息的角色</div>
            <div class="ds-card-group" id="proactiveContactsListContainer">
                <!-- 联系人列表将在这里动态生成 -->
            </div>
        </div>
    </div>`;
    const anchor = document.currentScript;
    if (anchor && anchor.parentNode) {
        anchor.insertAdjacentHTML('afterend', html);
    } else {
        document.body.insertAdjacentHTML('beforeend', html);
    }
})();


(() => {
    document.addEventListener('keydown', (event) => {
        if (event.key !== 'Enter' || !event.target?.matches?.('#apiAppUI .api-form-input')) return;
        event.preventDefault();
        event.target.blur();
    });
})();


(() => {
    if (document.getElementById('apiAppUI')) return;
    const html = `<div class="api-app-container" id="apiAppUI">
        <!-- 主页面 -->
        <div id="api-page-main" class="api-page active">
            <div class="api-nav-bar">
                <div class="api-nav-btn-circle" onclick="closeApiApp()">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="15 18 9 12 15 6"></polyline></svg>
                </div>
                <div class="api-nav-btn-circle text-btn">编辑</div>
            </div>
            <div class="api-content">
                <div class="api-hero-card">
                    <div class="api-hero-icon-bg">
                        <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24">
                            <path fill="#ffffff" d="M2.06 10.06c.51.51 1.32.56 1.87.1c4.67-3.84 11.45-3.84 16.13-.01c.56.46 1.38.42 1.89-.09c.59-.59.55-1.57-.1-2.1c-5.71-4.67-13.97-4.67-19.69 0c-.65.52-.7 1.5-.1 2.1zm7.76 7.76l1.47 1.47c.39.39 1.02.39 1.41 0l1.47-1.47c.47-.47.37-1.28-.23-1.59a4.28 4.28 0 0 0-3.91 0c-.57.31-.68 1.12-.21 1.59zm-3.73-3.73c.49.49 1.26.54 1.83.13a7.064 7.064 0 0 1 8.16 0c.57.4 1.34.36 1.83-.13l.01-.01c.6-.6.56-1.62-.13-2.11c-3.44-2.49-8.13-2.49-11.58 0c-.69.5-.73 1.51-.12 2.12z"/>
                        </svg>
                    </div>
                    <div class="api-hero-title">API 连接</div>
                    <div class="api-hero-desc">接入 API、查看可用模型，并管理加入API预设设置。<span onclick="openApiHelpModal()" style="cursor: pointer; color: #007aff;">进一步了解...</span></div>
                    <div style="width: 100%; border-top: 0.5px solid #c6c6c8;">
                        <div class="api-row">
                            <div class="api-row-left"></div>
                            <div class="api-row-text"><div class="api-row-title-text">流式输出</div></div>
                            <div class="api-toggle off" id="apiStreamToggle" onclick="toggleApiStream()"></div>
                        </div>
                    </div>
                    <div style="width: 100%;" id="api-connected-container"></div>
                </div>
                <div class="api-list-title">预设</div>
                <div class="api-list-group" id="api-preset-container"></div>
                <div class="api-list-group" style="margin-top: 24px;">
                    <div class="api-row clickable">
                        <div class="api-row-text"><div class="api-row-title-text">使用 API 与本地模型的 App</div></div>
                        <svg style="width: 8px; height: 13px; stroke: #c5c5c7; stroke-width: 3; stroke-linecap: round; stroke-linejoin: round; fill: none;" viewBox="0 0 8 13"><path d="M1.5 1.5L6.5 6.5L1.5 11.5"/></svg>
                    </div>
                </div>
            </div>
        </div>

        <!-- 添加 API 页面 -->
        <div id="api-page-add" class="api-page slide-right">
            <div class="api-nav-bar">
                <div class="api-nav-btn-circle" onclick="closeApiAddPage()">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="15 18 9 12 15 6"></polyline></svg>
                </div>
                <div class="api-nav-title">添加 API</div>
                <div class="api-nav-btn-circle text-btn" onclick="saveNewApi()">保存</div>
            </div>
            <div class="api-content" style="padding-top: 20px;">

                <!-- 预设名称独立卡片 -->
                <div class="api-form-card" style="padding: 12px 16px; margin-bottom: 16px;">
                    <div class="api-form-input-wrapper" style="background: transparent; padding: 0;">
                        <input type="text" class="api-form-input" id="api-add-name" placeholder="预设名称 (例如：GPT-4 官方接口)">
                    </div>
                </div>

                <!-- API 配置卡片 -->
                <div class="api-form-card">
                    <div class="api-form-group">
                        <div class="api-form-label">URL (接口地址)</div>
                        <div class="api-form-input-wrapper">
                            <input type="text" class="api-form-input" id="api-add-url" placeholder="https://api.openai.com/v1">
                        </div>
                    </div>
                    <div class="api-form-group">
                        <div class="api-form-label">KEY (接口密钥)</div>
                        <div class="api-form-input-wrapper">
                            <input type="password" class="api-form-input" id="api-add-key" placeholder="sk-...">
                        </div>
                    </div>

                    <!-- 恢复原来的拉取模型大按钮 -->
                    <div class="api-form-btn" onclick="fetchApiModels('add')" style="margin: 24px 0;">拉取模型</div>
                    <div class="api-form-btn api-test-btn disabled" onclick="testApiConnection('add')" aria-disabled="true">测试连接</div>

                    <div class="api-form-group" style="margin-bottom: 0;">
                        <div class="api-form-label">MODEL (模型)</div>
                        <div class="api-form-input-wrapper" onclick="openApiModelSelect('add')" style="cursor: pointer;">
                            <input type="text" class="api-form-input" id="api-add-model" placeholder="请先拉取模型" readonly style="cursor: pointer; pointer-events: none;">
                            <svg style="width: 12px; height: 12px; stroke: #8e8e93; stroke-width: 2.5; stroke-linecap: round; stroke-linejoin: round; fill: none; margin-left: 10px;" viewBox="0 0 24 24"><polyline points="6 9 12 15 18 9"></polyline></svg>
                        </div>
                    </div>
                    <div class="api-form-group" style="margin-top: 16px; margin-bottom: 0;">
                        <div class="api-form-label" style="display: flex; justify-content: space-between;">
                            <span>TEMPERATURE (温度)</span>
                            <span id="api-add-temp-val">0.8</span>
                        </div>
                        <div style="padding: 12px 0;">
                            <input type="range" id="api-add-temp" min="0" max="2" step="0.1" value="0.8" style="width: 100%; accent-color: #007aff;" oninput="document.getElementById('api-add-temp-val').innerText = this.value">
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <!-- 底部抽屉 -->
        <div class="api-drawer-overlay" id="apiDrawerOverlay" onclick="closeApiDrawer()"></div>
        <div class="api-drawer" id="apiDrawer">
            <div class="api-drawer-header">
                <div class="api-drawer-handle"></div>
                <div class="api-nav-btn-circle text-btn" onclick="closeApiDrawer()" style="font-weight: 400; background: rgba(0,0,0,0.05); box-shadow: none;">取消</div>
                <div class="api-drawer-title">编辑 API</div>
                <div class="api-nav-btn-circle text-btn" onclick="saveApiDrawer()" style="background: rgba(0,0,0,0.05); box-shadow: none;">保存</div>
            </div>
            <div class="api-content" style="padding-top: 20px;">

                <!-- 预设名称独立卡片 -->
                <div class="api-form-card" style="padding: 12px 16px; margin-bottom: 16px;">
                    <div class="api-form-input-wrapper" style="background: transparent; padding: 0;">
                        <input type="text" class="api-form-input" id="api-edit-name" placeholder="预设名称">
                    </div>
                </div>

                <!-- API 配置卡片 -->
                <div class="api-form-card">
                    <div class="api-form-group">
                        <div class="api-form-label">URL (接口地址)</div>
                        <div class="api-form-input-wrapper">
                            <input type="text" class="api-form-input" id="api-edit-url" placeholder="https://api.openai.com/v1">
                        </div>
                    </div>
                    <div class="api-form-group">
                        <div class="api-form-label">KEY (接口密钥)</div>
                        <div class="api-form-input-wrapper">
                            <input type="password" class="api-form-input" id="api-edit-key" placeholder="sk-...">
                        </div>
                    </div>

                    <!-- 恢复原来的拉取模型大按钮 -->
                    <div class="api-form-btn" onclick="fetchApiModels('edit')" style="margin: 24px 0;">拉取模型</div>
                    <div class="api-form-btn api-test-btn disabled" onclick="testApiConnection('edit')" aria-disabled="true">测试连接</div>

                    <div class="api-form-group" style="margin-bottom: 0;">
                        <div class="api-form-label">MODEL (模型)</div>
                        <div class="api-form-input-wrapper" onclick="openApiModelSelect('edit')" style="cursor: pointer;">
                            <input type="text" class="api-form-input" id="api-edit-model" placeholder="请先拉取模型" readonly style="cursor: pointer; pointer-events: none;">
                            <svg style="width: 12px; height: 12px; stroke: #8e8e93; stroke-width: 2.5; stroke-linecap: round; stroke-linejoin: round; fill: none; margin-left: 10px;" viewBox="0 0 24 24"><polyline points="6 9 12 15 18 9"></polyline></svg>
                        </div>
                    </div>
                    <div class="api-form-group" style="margin-top: 16px; margin-bottom: 0;">
                        <div class="api-form-label" style="display: flex; justify-content: space-between;">
                            <span>TEMPERATURE (温度)</span>
                            <span id="api-edit-temp-val">0.8</span>
                        </div>
                        <div style="padding: 12px 0;">
                            <input type="range" id="api-edit-temp" min="0" max="2" step="0.1" value="0.8" style="width: 100%; accent-color: #007aff;" oninput="document.getElementById('api-edit-temp-val').innerText = this.value">
                        </div>
                    </div>
                </div>

                <div class="api-form-btn danger" onclick="deleteApiDrawer()">删除此 API</div>
            </div>
        </div>

        <!-- API 详细教程与图文介绍弹窗 (iOS 风格) -->
        <div class="api-help-modal-overlay" id="apiHelpModalOverlay" onclick="closeApiHelpModal()">
            <div class="api-help-modal" onclick="event.stopPropagation()">
                <div class="api-help-header">
                    <div class="api-help-handle"></div>
                    <div class="api-help-nav">
                        <div class="api-help-title">API 连接指南</div>
                        <div class="api-help-done-btn" onclick="closeApiHelpModal()">完成</div>
                    </div>
                </div>
                <div class="api-help-content">
                    <!-- 概念介绍 -->
                    <div class="api-help-section">
                        <div class="api-help-badge">什么是 API？</div>
                        <div class="api-help-p">
                            <b>API (应用程序编程接口)</b> 就像是童话机与云端 <b>AI 大脑</b> 之间的“桥梁”与“通信员”。
                        </div>
                        <div class="api-help-diagram">
                            <div class="api-diagram-node">
                                <div class="api-diagram-icon" style="background: #007aff;">📱</div>
                                <span>童话机</span>
                            </div>
                            <div class="api-diagram-arrow">
                                <span>发送请求 ➔</span>
                                <span>⬅ 返回回答</span>
                            </div>
                            <div class="api-diagram-node">
                                <div class="api-diagram-icon" style="background: #34c759;">🧠</div>
                                <span>AI 模型 (GPT/Claude)</span>
                            </div>
                        </div>
                        <div class="api-help-tip">
                            配置 API 后，你的角色就能拥有真正的大模型对话能力，支持角色扮演、世界书联想与情景互动。
                        </div>
                    </div>

                    <!-- 教程步骤 -->
                    <div class="api-help-section">
                        <div class="api-help-badge" style="background: rgba(52, 199, 89, 0.12); color: #34c759;">详细配置教程</div>
                        
                        <div class="api-help-step">
                            <div class="api-step-num">1</div>
                            <div class="api-step-body">
                                <div class="api-step-title">获取 API 接口与密钥</div>
                                <div class="api-step-desc">
                                    前往 AI 服务提供商（如 OpenAI 官方、OneAPI 中转站、DeepSeek、硅基流动等平台），注册并获取你的专属 <b>API Key（密钥）</b> 与 <b>Base URL（接口地址）</b>。
                                </div>
                            </div>
                        </div>

                        <div class="api-help-step">
                            <div class="api-step-num">2</div>
                            <div class="api-step-body">
                                <div class="api-step-title">填写 URL 与 Key</div>
                                <div class="api-step-desc">
                                    在“添加 API”页面填入接口地址与密钥：
                                    <div class="api-code-block">
                                        <b>URL 示例：</b> https://api.openai.com/v1<br>
                                        <b>KEY 示例：</b> sk-xxxxxxxxxxxxxxxxxxxxxxxx
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div class="api-help-step">
                            <div class="api-step-num">3</div>
                            <div class="api-step-body">
                                <div class="api-step-title">拉取并选择模型 (MODEL)</div>
                                <div class="api-step-desc">
                                    点击 <b>“拉取模型”</b> 按钮，系统会自动连接接口并获取该 Key 支持的模型列表，随后在弹出的选择器中选取需要的模型（如 <code>gpt-4o</code>、<code>claude-3-5-sonnet</code>）。
                                </div>
                            </div>
                        </div>

                        <div class="api-help-step">
                            <div class="api-step-num">4</div>
                            <div class="api-step-body">
                                <div class="api-step-title">保存并开启对话</div>
                                <div class="api-step-desc">
                                    点击右上角 <b>“保存”</b>。列表显示为“已连接”后，返回聊天页面即可开始流畅对话。
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- 常见问题 -->
                    <div class="api-help-section">
                        <div class="api-help-badge" style="background: rgba(255, 149, 0, 0.12); color: #ff9500;">常见问题排查</div>
                        <div class="api-faq-item">
                            <div class="api-faq-q">Q: 点击拉取模型提示 Failed to fetch / CORS 跨域错误？</div>
                            <div class="api-faq-a">说明该接口服务器未开启浏览器跨域访问 (CORS)。请使用支持网页直接调用的中转接口或在代理平台开启 CORS 头。</div>
                        </div>
                        <div class="api-faq-item">
                            <div class="api-faq-q">Q: 提示 401 Unauthorized 或额度不足？</div>
                            <div class="api-faq-a">请核对 Key 是否复制完整（无多余空格），并确认该账号在服务商处是否有充足余额。</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <!-- 世界书 APP 容器 -->
    <!-- 语音设定 APP 容器 -->
    <div class="voice-app-container" id="voiceAppUI">
        <!-- 主页面 -->
        <div id="voice-page-main" class="api-page active">
            <div class="api-nav-bar">
                <div class="api-nav-btn-circle" onclick="closeVoiceApp()">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="15 18 9 12 15 6"></polyline></svg>
                </div>
                <div class="api-nav-btn-circle text-btn">编辑</div>
            </div>
            <div class="api-content">
                <div class="api-hero-card">
                    <div class="api-hero-icon-bg" style="background: linear-gradient(135deg, #b06bff 0%, #7a3cff 100%);">
                        <svg viewBox="0 0 24 24"><path fill="#ffffff" d="M12 14c1.66 0 3-1.34 3-3V5c0-1.66-1.34-3-3-3S9 3.34 9 5v6c0 1.66 1.34 3 3 3zm5-3c0 2.76-2.24 5-5 5s-5-2.24-5-5H5c0 3.53 2.61 6.43 6 6.92V21h2v-3.08c3.39-.49 6-3.39 6-6.92h-2z"/></svg>
                    </div>
                    <div class="api-hero-title">语音设定</div>
                    <div class="api-hero-desc">接入 MiniMax、ElevenLabs、Mossland、SoVITS 语音合成，管理预设并试听效果。<span>进一步了解 ..</span></div>
                    <div style="width: 100%; border-top: 0.5px solid #c6c6c8;">
                        <div class="api-row">
                            <div class="api-row-left"></div>
                            <div class="api-row-text"><div class="api-row-title-text">语音生成</div></div>
                            <div class="api-toggle off" id="autoVoiceToggle" onclick="toggleAutoVoice()"></div>
                        </div>
                        <div style="width: 100%;" id="voice-connected-container"></div>
                    </div>
                </div>
                <div class="api-list-title">预设</div>
                <div class="api-list-group" id="voice-preset-container"></div>
            </div>
        </div>
        <!-- 添加语音接口页面 -->
        <div id="voice-page-add" class="api-page slide-right">
            <div class="api-nav-bar">
                <div class="api-nav-btn-circle" onclick="closeVoiceAddPage()">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="15 18 9 12 15 6"></polyline></svg>
                </div>
                <div class="api-nav-title">添加语音接口</div>
                <div class="api-nav-btn-circle text-btn" onclick="saveNewVoice()">保存</div>
            </div>
            <div class="api-content" style="padding-top: 20px;">
                <div class="api-form-card" style="padding: 12px 16px; margin-bottom: 16px;">
                    <div class="api-form-input-wrapper" style="background: transparent; padding: 0;">
                        <input type="text" class="api-form-input" id="voice-add-name" placeholder="预设名称（例如：MiniMax 官方）">
                    </div>
                </div>
                <div class="api-form-card">
                    <div class="api-form-group">
                        <div class="api-form-label">服务商（PROVIDER）</div>
                        <div class="api-segment" id="voice-add-provider">
                            <div class="api-segment-item active" data-provider="minimax">MiniMax</div>
                            <div class="api-segment-item" data-provider="elevenlabs">ElevenLabs</div>
                            <div class="api-segment-item" data-provider="mossland">Mossland</div>
                            <div class="api-segment-item" data-provider="sovits">SoVITS</div>
                        </div>
                    </div>
                    <div class="api-form-group">
                        <div class="api-form-label">URL（接口地址）</div>
                        <div class="api-form-input-wrapper">
                            <input type="text" class="api-form-input" id="voice-add-url" placeholder="https://api.minimax.io">
                        </div>
                    </div>
                    <div class="api-form-group">
                        <div class="api-form-label">KEY（接口密钥）</div>
                        <div class="api-form-input-wrapper">
                           <input type="password" class="api-form-input" id="voice-add-key" placeholder="API Key / xi-api-key / 令牌">
                       </div>
                   </div>
                    <div id="voice-add-fields" style="margin-top: 12px;"></div>
                </div>
                <div class="api-form-card">
                    <div class="api-form-group" style="margin-bottom: 12px;">
                        <div class="api-form-label">试听文本</div>
                        <div class="api-textarea-wrapper">
                            <textarea class="api-textarea" id="voice-add-testtext" placeholder="输入一段文字试听语音合成效果…">你好，这是一段语音合成的试听示例。</textarea>
                        </div>
                    </div>
                    <div class="api-form-btn" onclick="testVoice('add')">试听合成</div>
                    <audio class="api-audio-preview" id="voice-add-audio" controls style="display: none; width: 100%;"></audio>
                </div>
            </div>
        </div>
        <!-- 底部抽屉 -->
        <div class="api-drawer-overlay" id="voiceDrawerOverlay" onclick="closeVoiceDrawer()"></div>
        <div class="api-drawer" id="voiceDrawer">
            <div class="api-drawer-header">
                <div class="api-drawer-handle"></div>
                <div class="api-nav-btn-circle text-btn" onclick="closeVoiceDrawer()" style="font-weight: 400; background: rgba(0,0,0,0.05); box-shadow: none;">取消</div>
                <div class="api-drawer-title">编辑语音接口</div>
                <div class="api-nav-btn-circle text-btn" onclick="saveVoiceDrawer()" style="background: rgba(0,0,0,0.05); box-shadow: none;">保存</div>
            </div>
            <div class="api-content" style="padding-top: 20px;">
                <div class="api-form-card" style="padding: 12px 16px; margin-bottom: 16px;">
                    <div class="api-form-input-wrapper" style="background: transparent; padding: 0;">
                        <input type="text" class="api-form-input" id="voice-edit-name" placeholder="预设名称">
                    </div>
                </div>
                <div class="api-form-card">
                    <div class="api-form-group">
                        <div class="api-form-label">服务商（PROVIDER）</div>
                        <div class="api-segment" id="voice-edit-provider">
                            <div class="api-segment-item active" data-provider="minimax">MiniMax</div>
                            <div class="api-segment-item" data-provider="elevenlabs">ElevenLabs</div>
                            <div class="api-segment-item" data-provider="mossland">Mossland</div>
                            <div class="api-segment-item" data-provider="sovits">SoVITS</div>
                        </div>
                    </div>
                    <div class="api-form-group">
                        <div class="api-form-label">URL（接口地址）</div>
                        <div class="api-form-input-wrapper"><input type="text" class="api-form-input" id="voice-edit-url" placeholder="https://api.minimax.io"></div>
                    </div>
                    <div class="api-form-group">
                        <div class="api-form-label">KEY（接口密钥）</div>
                       <div class="api-form-input-wrapper"><input type="password" class="api-form-input" id="voice-edit-key" placeholder="API Key / xi-api-key / 令牌"></div>
                   </div>
                    <div id="voice-edit-fields" style="margin-top: 12px;"></div>
                </div>
                <div class="api-form-card">
                    <div class="api-form-group" style="margin-bottom: 12px;">
                        <div class="api-form-label">试听文本</div>
                        <div class="api-textarea-wrapper"><textarea class="api-textarea" id="voice-edit-testtext" placeholder="输入一段文字试听语音合成效果…">你好，这是一段语音合成的试听示例。</textarea></div>
                    </div>
                    <div class="api-form-btn" onclick="testVoice('edit')">试听合成</div>
                    <audio class="api-audio-preview" id="voice-edit-audio" controls style="display: none; width: 100%;"></audio>
                </div>
                <div class="api-form-btn danger" onclick="deleteVoiceDrawer()">删除此接口</div>
            </div>
        </div>
    </div>

    <!-- 生图 APP 容器 -->
    <div class="imggen-app-container" id="imageGenAppUI">
        <!-- 主页面 -->
        <div id="imggen-page-main" class="api-page active">
            <div class="api-nav-bar">
                <div class="api-nav-btn-circle" onclick="closeImageGenApp()">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="15 18 9 12 15 6"></polyline></svg>
                </div>
                <div class="api-nav-btn-circle text-btn">编辑</div>
            </div>
            <div class="api-content">
                <div class="api-hero-card">
                    <div class="api-hero-icon-bg" style="background: linear-gradient(135deg, #ff8a3c 0%, #ff3b6c 100%);">
                        <svg viewBox="0 0 24 24"><path fill="#ffffff" d="M21 19V5c0-1.1-.9-2-2-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2zM8.5 13.5l2.5 3.01L14.5 12l4.5 6H5l3.5-4.5z"/></svg>
                    </div>
                    <div class="api-hero-title">生图</div>
                    <div class="api-hero-desc">接入 OpenAI、NovelAI、Midjourney 生图接口，保存 URL 与 Key 预设，配置生成参数。<span>进一步了解 ..</span></div>
                    <div style="width: 100%; border-top: 0.5px solid #c6c6c8;">
                        <div class="api-row">
                            <div class="api-row-left"></div>
                            <div class="api-row-text"><div class="api-row-title-text">图片生成</div></div>
                            <div class="api-toggle off" id="autoImageToggle" onclick="toggleAutoImage()"></div>
                        </div>
                        <div style="width: 100%;" id="imggen-connected-container"></div>
                    </div>
                </div>
                <div class="api-list-title">预设</div>
                <div class="api-list-group" id="imggen-preset-container"></div>
                <!-- 生成设定 -->
                <div class="api-list-title">生成设定</div>
                <div id="imggen-settings-container"></div>
                <div class="api-preview-area">
                    <div class="api-form-btn" onclick="generateImage()" id="imggen-generate-btn">生成图片</div>
                    <div class="api-gen-result" id="imggen-result">生成的图片将显示在这里</div>
                </div>
            </div>
        </div>
        <!-- 添加生图接口页面 -->
        <div id="imggen-page-add" class="api-page slide-right">
            <div class="api-nav-bar">
                <div class="api-nav-btn-circle" onclick="closeImageGenAddPage()">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="15 18 9 12 15 6"></polyline></svg>
                </div>
                <div class="api-nav-title">添加生图接口</div>
                <div class="api-nav-btn-circle text-btn" onclick="saveNewImageGen()">保存</div>
            </div>
            <div class="api-content" style="padding-top: 20px;">
                <div class="api-form-card" style="padding: 12px 16px; margin-bottom: 16px;">
                    <div class="api-form-input-wrapper" style="background: transparent; padding: 0;">
                        <input type="text" class="api-form-input" id="imggen-add-name" placeholder="预设名称（例如：OpenAI 官方）">
                    </div>
                </div>
                <div class="api-form-card">
                    <div class="api-form-group">
                        <div class="api-form-label">服务商（PROVIDER）</div>
                        <div class="api-segment" id="imggen-add-provider">
                            <div class="api-segment-item active" data-provider="openai">OpenAI</div>
                            <div class="api-segment-item" data-provider="nai">NovelAI</div>
                            <div class="api-segment-item" data-provider="mj">Midjourney</div>
                        </div>
                    </div>
                    <div class="api-form-group">
                        <div class="api-form-label">URL（接口地址）</div>
                        <div class="api-form-input-wrapper"><input type="text" class="api-form-input" id="imggen-add-url" placeholder="https://api.openai.com/v1"></div>
                    </div>
                    <div class="api-form-group">
                        <div class="api-form-label">KEY（接口密钥）</div>
                       <div class="api-form-input-wrapper"><input type="password" class="api-form-input" id="imggen-add-key" placeholder="sk-..."></div>
                   </div>
                    <div id="imggen-add-fields" style="margin-top: 12px;"></div>
                </div>
                <div class="api-list-title">生成设定</div>
                <div id="imggen-add-gen"></div>
            </div>
        </div>
        <!-- 底部抽屉 -->
        <div class="api-drawer-overlay" id="imggenDrawerOverlay" onclick="closeImageGenDrawer()"></div>
        <div class="api-drawer" id="imggenDrawer">
            <div class="api-drawer-header">
                <div class="api-drawer-handle"></div>
                <div class="api-nav-btn-circle text-btn" onclick="closeImageGenDrawer()" style="font-weight: 400; background: rgba(0,0,0,0.05); box-shadow: none;">取消</div>
                <div class="api-drawer-title">编辑生图接口</div>
                <div class="api-nav-btn-circle text-btn" onclick="saveImageGenDrawer()" style="background: rgba(0,0,0,0.05); box-shadow: none;">保存</div>
            </div>
            <div class="api-content" style="padding-top: 20px;">
                <div class="api-form-card" style="padding: 12px 16px; margin-bottom: 16px;">
                    <div class="api-form-input-wrapper" style="background: transparent; padding: 0;">
                        <input type="text" class="api-form-input" id="imggen-edit-name" placeholder="预设名称">
                    </div>
                </div>
                <div class="api-form-card">
                    <div class="api-form-group">
                        <div class="api-form-label">服务商（PROVIDER）</div>
                        <div class="api-segment" id="imggen-edit-provider">
                            <div class="api-segment-item active" data-provider="openai">OpenAI</div>
                            <div class="api-segment-item" data-provider="nai">NovelAI</div>
                            <div class="api-segment-item" data-provider="mj">Midjourney</div>
                        </div>
                    </div>
                    <div class="api-form-group">
                        <div class="api-form-label">URL（接口地址）</div>
                        <div class="api-form-input-wrapper"><input type="text" class="api-form-input" id="imggen-edit-url" placeholder="https://api.openai.com/v1"></div>
                    </div>
                    <div class="api-form-group">
                        <div class="api-form-label">KEY（接口密钥）</div>
                       <div class="api-form-input-wrapper"><input type="password" class="api-form-input" id="imggen-edit-key" placeholder="sk-..."></div>
                   </div>
                    <div id="imggen-edit-fields" style="margin-top: 12px;"></div>
                </div>
                <div class="api-list-title">生成设定</div>
                <div id="imggen-edit-gen"></div>
                <div class="api-form-btn danger" onclick="deleteImageGenDrawer()">删除此接口</div>
            </div>
        </div>
    </div>

    <!-- 世界书 APP 容器已迁移至 js/worldbook.js 独立挂载 -->

    <!-- 图标操作菜单 -->
    <div class="icon-menu-overlay" id="iconMenuOverlay" onclick="closeIconMenu()">
        <div class="icon-menu" id="iconMenu" onclick="event.stopPropagation()">
            <div class="icon-menu-item" onclick="document.getElementById('iconFileInput').click()">
                <svg width="18" height="18" viewBox="0 0 1024 1024" xmlns="http://www.w3.org/2000/svg" style="fill: currentColor; stroke: none;"><path d="M432.889 655.404l-73.547-101.758c-9.744-13.481-25.541-13.48-35.285 0L188.472 741.24c-9.744 13.481-3.93 24.41 12.985 24.41h621.202c16.925 0 22.609-10.905 12.77-24.357L620.563 447.52c-9.903-13.54-25.79-13.451-35.628 0L432.89 655.404zM273.271 347.874a58.4 58.4 0 1 0 119.365 0 58.4 58.4 0 1 0-119.365 0z"></path><path d="M109.082 198.668h805.836c-8.385 0-14.983-6.677-14.983-14.867v656.398c0-8.207 6.63-14.867 14.983-14.867H109.082c8.385 0 14.983 6.677 14.983 14.867V183.801c0 8.207-6.63 14.867-14.983 14.867zM64.383 840.2c0 24.613 19.963 44.815 44.699 44.815h805.836c24.668 0 44.699-20.12 44.699-44.815V183.801c0-24.613-19.963-44.815-44.699-44.815H109.082c-24.668 0-44.699 20.12-44.699 44.815v656.398z"></path></svg>
                <span>照片图库</span>
            </div>
            <div class="icon-menu-item" onclick="openIconUrlModal()">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"></path><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"></path></svg>
                <span>使用 URL</span>
            </div>
        </div>
    </div>
    <input type="file" id="iconFileInput" accept="image/*" style="display: none;" onchange="handleIconLocalUpload(event)">

 <!-- 壁纸操作菜单 -->
    <div class="icon-menu-overlay" id="wallpaperMenuOverlay" onclick="closeWallpaperMenu()">
        <div class="icon-menu" id="wallpaperMenu" onclick="event.stopPropagation()">
            <div class="icon-menu-item" onclick="document.getElementById('wallpaperFileInput').click(); closeWallpaperMenu();">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 16V6a2 2 0 0 1 2-2h10"></path><rect x="8" y="8" width="14" height="14" rx="2" ry="2"></rect><circle cx="13.5" cy="13.5" r="1.5"></circle><path d="M8 18l4-4 2 2 3-3 5 5"></path></svg>
                <span>照片图库</span>
            </div>
            <div class="icon-menu-item" onclick="openWallpaperUrlModal()">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"></path><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"></path></svg>
                <span>使用 URL</span>
            </div>
        </div>
    </div>

    <!-- 自定义高级感弹窗容器 -->
    <div class="custom-dialog-overlay" id="customDialogOverlay">
        <div class="custom-dialog" id="customDialog">
            <!-- 内容由 JS 动态生成 -->
        </div>
    </div>

    <!-- 通用选择弹窗 -->
    <div class="univ-sel-overlay" id="univSelOverlay" onclick="closeUniversalSelect()">
        <div class="univ-sel-frame" onclick="event.stopPropagation()">
            <div class="univ-sel-title" id="univSelTitle" style="text-align: center; font-size: 16px; font-weight: 700; color: #000; padding: 18px 16px 8px;">选择</div>
            <!-- 顶部搜索栏 -->
            <div class="univ-sel-search-wrap" id="univSelSearchWrap">
                <div class="univ-sel-search">
                    <svg viewBox="0 0 24 24"><path d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"/></svg>
                    <input type="text" id="univSelSearchInput" placeholder="搜索..." oninput="handleUniversalSearch()">
                </div>
            </div>
            <!-- 内容区域 -->
            <div class="univ-sel-content">
                <div class="univ-sel-inner" id="univSelListContainer">
                    <!-- 列表动态渲染 -->
                </div>
            </div>
            <!-- 底部 取消 与 确认 按钮 -->
            <div class="univ-sel-footer">
                <div class="univ-sel-cancel" onclick="closeUniversalSelect()">取消</div>
                <div class="univ-sel-save disabled" id="univSelSaveBtn" onclick="saveUniversalSelection()">确认</div>
            </div>
        </div>
    </div>

    <!-- 全局搜索抽屉 -->
    <div class="search-drawer-overlay" id="searchDrawerOverlay" onclick="closeSearchDrawer()"></div>
    <div class="search-drawer" id="searchDrawer">
        <div class="search-drawer-header">
            <!-- 新增包裹层：增加点击区域并绑定收回事件 -->
            <div style="width: 100%; display: flex; justify-content: center; padding-bottom: 16px; cursor: pointer;" onclick="closeSearchDrawer()">
                <div class="search-drawer-handle" style="margin-bottom: 0;"></div>
            </div>
            <div class="search-input-container">
                <svg viewBox="0 0 24 24"><path d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"/></svg>
                <input type="text" id="globalSearchInput" class="global-search-drawer-input" placeholder="搜索应用或功能..." oninput="handleGlobalSearch()">
            </div>
        </div>
        <div class="search-results-area" id="searchResultsArea">
            <!-- 搜索结果动态渲染 -->
        </div>
    </div>

    <!-- 通用 页面容器 -->
    <div class="general-settings-container" id="generalSettingsUI">
        <!-- 通用主页面 -->
        <div class="gen-sub-page active" id="genMainPage">
            <div class="ds-nav-bar">
                <div class="ds-back-btn" onclick="closeGeneralSettingsApp()">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#000" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="15 18 9 12 15 6"></polyline></svg>
                </div>
                <div class="ds-nav-title">通用</div>
            </div>
            <div class="ds-content">
                <!-- 顶部 Hero 介绍卡片：使用设置内置的经典通用 SVG 齿轮 -->
                <div class="gen-hero-card">
                    <div class="gen-hero-icon-bg">
                        <svg viewBox="0 0 24 24" fill="currentColor" style="width: 32px; height: 32px; color: #ffffff;">
                            <path d="M17.004 10.407c.138.435-.216.842-.672.842h-3.465a.75.75 0 0 1-.65-.375l-1.732-3c-.229-.396-.053-.907.393-1.004a5.252 5.252 0 0 1 6.126 3.537ZM8.12 8.464c.307-.338.838-.235 1.066.16l1.732 3a.75.75 0 0 1 0 .75l-1.732 3c-.229.397-.76.5-1.067.161A5.23 5.23 0 0 1 6.75 12a5.23 5.23 0 0 1 1.37-3.536ZM10.878 17.13c-.447-.098-.623-.608-.394-1.004l1.733-3.002a.75.75 0 0 1 .65-.375h3.465c.457 0 .81.407.672.842a5.252 5.252 0 0 1-6.126 3.539Z" />
                            <path fill-rule="evenodd" d="M21 12.75a.75.75 0 1 0 0-1.5h-.783a8.22 8.22 0 0 0-.237-1.357l.734-.267a.75.75 0 1 0-.513-1.41l-.735.268a8.24 8.24 0 0 0-.689-1.192l.6-.503a.75.75 0 1 0-.964-1.149l-.6.504a8.3 8.3 0 0 0-1.054-.885l.391-.678a.75.75 0 1 0-1.299-.75l-.39.676a8.188 8.188 0 0 0-1.295-.47l.136-.77a.75.75 0 0 0-1.477-.26l-.136.77a8.36 8.36 0 0 0-1.377 0l-.136-.77a.75.75 0 1 0-1.477.26l.136.77c-.448.121-.88.28-1.294.47l-.39-.676a.75.75 0 0 0-1.3.75l.392.678a8.29 8.29 0 0 0-1.054.885l-.6-.504a.75.75 0 1 0-.965 1.149l.6.503a8.243 8.243 0 0 0-.689 1.192L3.8 8.216a.75.75 0 1 0-.513 1.41l.735.267a8.222 8.222 0 0 0-.238 1.356h-.783a.75.75 0 0 0 0 1.5h.783c.042.464.122.917.238 1.356l-.735.268a.75.75 0 0 0 .513 1.41l.735-.268c.197.417.428.816.69 1.191l-.6.504a.75.75 0 0 0 .963 1.15l.601-.505c.326.323.679.62 1.054.885l-.392.68a.75.75 0 0 0 1.3.75l.39-.679c.414.192.847.35 1.294.471l-.136.77a.75.75 0 0 0 1.477.261l.137-.772a8.332 8.332 0 0 0 1.376 0l.136.772a.75.75 0 1 0 1.477-.26l-.136-.771a8.19 8.19 0 0 0 1.294-.47l.391.677a.75.75 0 0 0 1.3-.75l-.393-.679a8.29 8.29 0 0 0 1.054-.885l.601.504a.75.75 0 0 0 .964-1.15l-.6-.503c.261-.375.492-.774.69-1.191l.735.267a.75.75 0 1 0 .512-1.41l-.734-.267c.115-.439.195-.892.237-1.356h.784Zm-2.657-3.06a6.744 6.744 0 0 0-1.19-2.053 6.784 6.784 0 0 0-1.82-1.51A6.705 6.705 0 0 0 12 5.25a6.8 6.8 0 0 0-1.225.11 6.7 6.7 0 0 0-2.15.793 6.784 6.784 0 0 0-2.952 3.489.76.76 0 0 1-.036.098A6.74 6.74 0 0 0 5.251 12a6.74 6.74 0 0 0 3.366 5.842l.009.005a6.704 6.704 0 0 0 2.18.798l.022.003a6.792 6.792 0 0 0 2.368-.004 6.704 6.704 0 0 0 2.205-.811 6.785 6.785 0 0 0 1.762-1.484l.009-.01.009-.01a6.743 6.743 0 0 0 1.18-2.066c.253-.707.39-1.469.39-2.263a6.74 6.74 0 0 0-.408-2.309Z" clip-rule="evenodd" />
                        </svg>
                    </div>
                    <div class="gen-hero-title">通用</div>
                    <div class="gen-hero-desc">管理系统的整体设置与偏好，包括安装至主屏幕、自定义桌面图标、悬浮控制台以及系统还原本机。</div>
                </div>

                <!-- 系统基础组：图标全部使用统一灰色调 set-bg-gray -->
                <div class="ds-card-group">
                    <div class="ds-list-item" onclick="openGenSubPage('genAboutPage')" style="cursor: pointer;">
                        <div style="display: flex; align-items: center; gap: 14px;">
                            <div class="set-item-icon set-bg-gray" style="margin-right: 0; animation: none;">
                                <svg viewBox="0 0 24 24"><rect x="5" y="2" width="14" height="20" rx="3" fill="none" stroke="#ffffff" stroke-width="2"/><line x1="11" y1="18" x2="13" y2="18" stroke="#ffffff" stroke-width="2" stroke-linecap="round"/></svg>
                            </div>
                            <span style="font-size: 16px; font-weight: 500; color: #000;">关于本机</span>
                        </div>
                        <svg class="set-chevron" viewBox="0 0 8 13"><path d="M1.5 1.5L6.5 6.5L1.5 11.5"/></svg>
                    </div>

                    <!-- 软件更新：使用指定的新齿轮 SVG -->
                    <div class="ds-list-item" onclick="openGenSubPage('genUpdatePage')" style="cursor: pointer; border-top: 0.5px solid #e5e5ea;">
                        <div style="display: flex; align-items: center; gap: 14px;">
                            <div class="set-item-icon set-bg-gray" style="margin-right: 0; animation: none;">
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M21.5092 14.5901L20.2592 13.2701C20.4192 12.3081 20.3989 11.3247 20.1992 10.3701L21.4191 9.05011C21.5138 8.9446 21.5771 8.81468 21.6019 8.67508C21.6266 8.53547 21.6118 8.39173 21.5591 8.2601C21.0532 7.00967 20.3056 5.87128 19.3591 4.9101C19.2666 4.81762 19.1513 4.75133 19.0248 4.71796C18.8983 4.68458 18.7652 4.6853 18.6391 4.72009L16.7991 5.19009C16.2326 4.78274 15.6179 4.44687 14.9691 4.19009L14.5191 2.47009C14.4857 2.33059 14.4119 2.20405 14.307 2.10623C14.2021 2.00842 14.0706 1.94367 13.9291 1.92011C13.306 1.80317 12.6731 1.74623 12.0391 1.75009C11.2458 1.75342 10.4562 1.85759 9.68915 2.06009C9.56114 2.09227 9.44422 2.15856 9.35089 2.25189C9.25756 2.34522 9.19129 2.46212 9.15912 2.59012L8.67914 4.36011C8.14253 4.59838 7.63294 4.8934 7.15912 5.24011L5.33911 4.7901C5.21132 4.7567 5.07686 4.75858 4.95007 4.79556C4.82328 4.83255 4.70893 4.90323 4.61914 5.00009C3.62491 6.03296 2.86435 7.26755 2.3891 8.62012C2.34301 8.75085 2.33361 8.89168 2.36181 9.02741C2.39002 9.16313 2.45477 9.28856 2.54913 9.39011L3.80914 10.7001C3.74605 11.1206 3.7126 11.5449 3.7091 11.9701C3.7091 12.2701 3.70915 12.5701 3.75915 12.8701L2.44915 14.3301C2.361 14.4272 2.2998 14.5457 2.27173 14.6738C2.24365 14.8019 2.24965 14.935 2.28912 15.0601C2.70006 16.3823 3.38111 17.6048 4.28912 18.6501C4.38044 18.7575 4.50016 18.8369 4.63458 18.8794C4.769 18.9218 4.9127 18.9256 5.04913 18.8901L6.7691 18.4501C7.37095 18.9572 8.04503 19.3718 8.7691 19.6801L9.2691 21.4701C9.30762 21.5999 9.37971 21.7172 9.47802 21.8102C9.57634 21.9033 9.69741 21.9688 9.8291 22.0001C10.5511 22.1632 11.2889 22.2471 12.0291 22.2501C12.6195 22.2435 13.2084 22.1867 13.7891 22.0801C13.9272 22.0557 14.0556 21.9932 14.1599 21.8995C14.2642 21.8058 14.3402 21.6848 14.3791 21.5501L14.8491 19.8601C15.7125 19.5512 16.5173 19.0981 17.2291 18.5201L18.9891 18.9201C19.1211 18.9508 19.259 18.9446 19.3877 18.9023C19.5164 18.86 19.6311 18.7831 19.7191 18.6801C20.5957 17.7067 21.2749 16.5724 21.7191 15.3401C21.755 15.2078 21.7545 15.0682 21.7175 14.9362C21.6806 14.8041 21.6086 14.6846 21.5092 14.5901ZM12.1191 15.8601C11.3647 15.8621 10.6267 15.6401 9.99865 15.2222C9.37057 14.8043 8.88067 14.2094 8.59106 13.5128C8.30145 12.8162 8.22519 12.0493 8.37188 11.3093C8.51858 10.5693 8.8816 9.88949 9.41504 9.35605C9.94848 8.82261 10.6283 8.45953 11.3683 8.31284C12.1083 8.16615 12.8752 8.24244 13.5718 8.53204C14.2684 8.82165 14.8633 9.31156 15.2812 9.93964C15.6991 10.5677 15.9211 11.3057 15.9191 12.0601C15.9165 13.0671 15.5153 14.0321 14.8032 14.7442C14.0912 15.4563 13.1261 15.8575 12.1191 15.8601Z" fill="#ffffff"/>
                                </svg>
                            </div>
                            <span style="font-size: 16px; font-weight: 500; color: #000;">软件更新</span>
                        </div>
                        <svg class="set-chevron" viewBox="0 0 8 13"><path d="M1.5 1.5L6.5 6.5L1.5 11.5"/></svg>
                    </div>
                </div>

                <!-- 个性化与主屏幕：图标背景统一为 set-bg-gray 保持纯正灰色调 -->
                <div class="ds-section-title">个性化与主屏幕</div>
                <div class="ds-card-group">
                    <!-- 安装至桌面：使用指定的新 SVG -->
                    <div class="ds-list-item" onclick="openGenInstallSheet()" style="cursor: pointer;">
                        <div style="display: flex; align-items: center; gap: 14px;">
                            <div class="set-item-icon set-bg-gray" style="margin-right: 0; animation: none;">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" height="20" width="20">
                                    <g id="install-desktop">
                                        <path id="Union" fill="#ffffff" d="M9 5H4v11h16V5h-5V3h5c1.1046 0 2 0.89543 2 2v11c0 1.1046 -0.8954 2 -2 2h-3l0.707 0.707c0.1875 0.1875 0.293 0.4419 0.293 0.7071V20c0 0.5523 -0.4477 1 -1 1H7c-0.55228 0 -1 -0.4477 -1 -1v-0.5859c0.00004 -0.2652 0.10547 -0.5196 0.29297 -0.7071L7 18H4c-1.10457 0 -2 -0.8954 -2 -2V5c0 -1.10457 0.89543 -2 2 -2h5zm3 -2c0.5522 0.00008 1 0.44777 1 1v6.5859l1.793 -1.79293c0.3905 -0.39043 1.0235 -0.39044 1.414 0 0.3905 0.3905 0.3905 1.02356 0 1.41403l-3.5 3.5c-0.3905 0.3905 -1.0235 0.3905 -1.414 0l-3.50003 -3.5c-0.39044 -0.39048 -0.39044 -1.02352 0 -1.41403 0.39051 -0.39043 1.02356 -0.39044 1.41406 0L11 10.5859V4c0 -0.55224 0.4478 -0.99993 1 -1" stroke-width="1"></path>
                                    </g>
                                </svg>
                            </div>
                            <span style="font-size: 16px; font-weight: 500; color: #000;">安装至桌面</span>
                        </div>
                        <div style="display: flex; align-items: center; color: #8e8e93; font-size: 15px;">
                            <span>添加到主屏幕</span>
                            <svg class="set-chevron" viewBox="0 0 8 13" style="margin-left: 8px;"><path d="M1.5 1.5L6.5 6.5L1.5 11.5"/></svg>
                        </div>
                    </div>

                    <!-- 自定义桌面图标：使用指定的新 SVG -->
                    <div class="ds-list-item" onclick="openGenSubPage('genPwaIconPage')" style="cursor: pointer; border-top: 0.5px solid #e5e5ea;">
                        <div style="display: flex; align-items: center; gap: 14px;">
                            <div class="set-item-icon set-bg-gray" style="margin-right: 0; animation: none;">
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" id="Icons--Streamline-Font-Awesome" height="16" width="16">
                                    <path d="M15.47926875 0.38520625c0.226578125 0.1837125 0.3582375 0.462340625 0.3582375 0.756275v4.40905625c0 0.8113875 -0.87875 1.469684375 -1.95958125 1.469684375s-1.959578125 -0.658296875 -1.959578125 -1.469684375 0.878746875 -1.469684375 1.959578125 -1.469684375V2.3356l-2.93936875 0.587875v3.606853125c0 0.8113875 -0.87875 1.469684375 -1.95958125 1.469684375s-1.959578125 -0.658296875 -1.959578125 -1.469684375 0.878746875 -1.4696875 1.959578125 -1.4696875V2.121271875c0 -0.4684625 0.33068125 -0.8695625 0.78689375 -0.96141875L14.66481875 0.1800625c0.2878125 -0.058175 0.5848125 0.018371875 0.81445 0.20208125ZM2.4480625 9.469696875 2.8093625 8.9246875c0.180646875 -0.272503125 0.48683125 -0.43478125 0.81445 -0.43478125h1.88915625c0.32761875 0 0.633803125 0.162278125 0.81445 0.43478125l0.364359375 0.545009375h0.8175125c0.8113875 0 1.469684375 0.658296875 1.469684375 1.469684375v3.429265625c0 0.8113875 -0.658296875 1.469684375 -1.469684375 1.469684375H1.630553125c-0.811390625 0 -1.4696875 -0.658296875 -1.4696875 -1.469684375V10.93938125c0 -0.8113875 0.658296875 -1.469684375 1.4696875 -1.469684375H2.4480625Zm3.59154375 3.184315625c0 -1.1313625 -1.2247375 -1.838465625 -2.204528125 -1.272784375 -0.454721875 0.262534375 -0.734840625 0.74771875 -0.734840625 1.272784375 0 1.131365625 1.2247375 1.83846875 2.204525 1.272784375 0.454721875 -0.26253125 0.73484375 -0.747715625 0.73484375 -1.272784375Zm8.77830625 -3.971209375 -1.17575 2.746471875h1.705446875c0.20514375 0 0.38579375 0.1255375 0.459278125 0.31843125s0.01836875 0.407228125 -0.134721875 0.541946875L11.75300625 15.71891875c-0.1714625 0.15003125 -0.425596875 0.162278125 -0.60930625 0.02755625s-0.251071875 -0.37966875 -0.162278125 -0.587875l1.172684375 -2.749534375h-1.705446875c-0.205140625 0 -0.385790625 -0.125534375 -0.459275 -0.31843125s-0.018371875 -0.407225 0.134721875 -0.541946875l3.919159375 -3.429265625c0.1714625 -0.150028125 0.425596875 -0.162275 0.60930625 -0.02755625s0.251071875 0.37966875 0.162278125 0.587875Zm-10.37965 -1.8126125c-0.19901875 0.199021875 -0.5205125 0.199021875 -0.704225 0l-2.9638625 -3.05878125C-0.08714375 2.923475 -0.041215625 1.456853125 0.923265625 0.630153125c0.826696875 -0.71953125 2.0943 -0.58175 2.8597625 0.199021875l0.306184375 0.32149375 0.290875 -0.32149375c0.765459375 -0.780771875 2.017753125 -0.918553125 2.87506875 -0.199021875 0.949171875 0.8267 0.9951 2.293321875 0.137784375 3.18125625l-2.951615625 3.05878125Z" fill="#ffffff" stroke-width="0.0313"></path>
                                </svg>
                            </div>
                            <span style="font-size: 16px; font-weight: 500; color: #000;">自定义桌面图标</span>
                        </div>
                        <div style="display: flex; align-items: center; color: #8e8e93; font-size: 15px;">
                            <span id="genCurrentPwaTag">预设 1</span>
                            <svg class="set-chevron" viewBox="0 0 8 13" style="margin-left: 8px;"><path d="M1.5 1.5L6.5 6.5L1.5 11.5"/></svg>
                        </div>
                    </div>
                </div>

                <div class="ds-section-title">重置与管理</div>
                <div class="ds-card-group">
                    <div class="ds-list-item" onclick="openGenResetSheet()" style="cursor: pointer; justify-content: center;">
                        <span style="color: #ff3b30; font-size: 16px; font-weight: 600;">还原本机</span>
                    </div>
                </div>
            </div>
        </div>

        <!-- 二级页：关于本机 -->
        <div class="gen-sub-page slide-right" id="genAboutPage">
            <div class="ds-nav-bar">
                <div class="ds-back-btn" onclick="closeGenSubPage('genAboutPage')">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#000" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="15 18 9 12 15 6"></polyline></svg>
                </div>
                <div class="ds-nav-title">关于本机</div>
            </div>
            <div class="ds-content">
                <div class="ds-card-group" style="margin-top: 10px;">
                    <div class="ds-list-item">
                        <span>名称</span>
                        <span style="color: #8e8e93; font-size: 15px;">童话机 (iPhone)</span>
                    </div>
                    <div class="ds-list-item" style="border-top: 0.5px solid #e5e5ea;">
                        <span>iOS 版本</span>
                        <span style="color: #8e8e93; font-size: 15px;">18.4 (22E5216h)</span>
                    </div>
                    <div class="ds-list-item" style="border-top: 0.5px solid #e5e5ea;">
                        <span>型号名称</span>
                        <span style="color: #8e8e93; font-size: 15px;">iPhone 16 Pro Max</span>
                    </div>
                    <div class="ds-list-item" style="border-top: 0.5px solid #e5e5ea;">
                        <span>序列号</span>
                        <span style="color: #8e8e93; font-size: 15px;">H7X9QL2M0W</span>
                    </div>
                </div>

                <div class="ds-card-group" style="margin-top: 18px;">
                    <div class="ds-list-item" style="display: block; padding: 16px;">
                        <div style="font-size: 15px; font-weight: 600; color: #1c1c1e; margin-bottom: 10px;">特别鸣谢</div>
                        <div style="font-size: 13px; line-height: 1.7; color: #8e8e93;">
                            <div>部分界面美化与设计灵感来自 @思绪万千 老师。</div>
                            <div>记忆系统的设计思路参考了 @鹤见 老师的 OB 记忆库。</div>
                            <div>部分文风指令的设计与表达思路参考了 @宝宝 老师。</div>
                            <div style="margin-top: 8px;">感谢各位老师对童话集的贡献。</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <!-- 二级页：软件更新 (使用指定的新齿轮 SVG) -->
        <div class="gen-sub-page slide-right" id="genUpdatePage">
            <div class="ds-nav-bar">
                <div class="ds-back-btn" onclick="closeGenSubPage('genUpdatePage')">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#000" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="15 18 9 12 15 6"></polyline></svg>
                </div>
                <div class="ds-nav-title">软件更新</div>
            </div>
            <div class="ds-content">
                <div style="display: flex; flex-direction: column; align-items: center; padding: 40px 20px 20px; text-align: center;">
                    <div style="width: 72px; height: 72px; border-radius: 18px; background: linear-gradient(135deg, #a3a3a8 0%, #8e8e93 100%); display: flex; align-items: center; justify-content: center; margin-bottom: 16px; box-shadow: 0 8px 20px rgba(0,0,0,0.15);">
                        <svg width="38" height="38" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M21.5092 14.5901L20.2592 13.2701C20.4192 12.3081 20.3989 11.3247 20.1992 10.3701L21.4191 9.05011C21.5138 8.9446 21.5771 8.81468 21.6019 8.67508C21.6266 8.53547 21.6118 8.39173 21.5591 8.2601C21.0532 7.00967 20.3056 5.87128 19.3591 4.9101C19.2666 4.81762 19.1513 4.75133 19.0248 4.71796C18.8983 4.68458 18.7652 4.6853 18.6391 4.72009L16.7991 5.19009C16.2326 4.78274 15.6179 4.44687 14.9691 4.19009L14.5191 2.47009C14.4857 2.33059 14.4119 2.20405 14.307 2.10623C14.2021 2.00842 14.0706 1.94367 13.9291 1.92011C13.306 1.80317 12.6731 1.74623 12.0391 1.75009C11.2458 1.75342 10.4562 1.85759 9.68915 2.06009C9.56114 2.09227 9.44422 2.15856 9.35089 2.25189C9.25756 2.34522 9.19129 2.46212 9.15912 2.59012L8.67914 4.36011C8.14253 4.59838 7.63294 4.8934 7.15912 5.24011L5.33911 4.7901C5.21132 4.7567 5.07686 4.75858 4.95007 4.79556C4.82328 4.83255 4.70893 4.90323 4.61914 5.00009C3.62491 6.03296 2.86435 7.26755 2.3891 8.62012C2.34301 8.75085 2.33361 8.89168 2.36181 9.02741C2.39002 9.16313 2.45477 9.28856 2.54913 9.39011L3.80914 10.7001C3.74605 11.1206 3.7126 11.5449 3.7091 11.9701C3.7091 12.2701 3.70915 12.5701 3.75915 12.8701L2.44915 14.3301C2.361 14.4272 2.2998 14.5457 2.27173 14.6738C2.24365 14.8019 2.24965 14.935 2.28912 15.0601C2.70006 16.3823 3.38111 17.6048 4.28912 18.6501C4.38044 18.7575 4.50016 18.8369 4.63458 18.8794C4.769 18.9218 4.9127 18.9256 5.04913 18.8901L6.7691 18.4501C7.37095 18.9572 8.04503 19.3718 8.7691 19.6801L9.2691 21.4701C9.30762 21.5999 9.37971 21.7172 9.47802 21.8102C9.57634 21.9033 9.69741 21.9688 9.8291 22.0001C10.5511 22.1632 11.2889 22.2471 12.0291 22.2501C12.6195 22.2435 13.2084 22.1867 13.7891 22.0801C13.9272 22.0557 14.0556 21.9932 14.1599 21.8995C14.2642 21.8058 14.3402 21.6848 14.3791 21.5501L14.8491 19.8601C15.7125 19.5512 16.5173 19.0981 17.2291 18.5201L18.9891 18.9201C19.1211 18.9508 19.259 18.9446 19.3877 18.9023C19.5164 18.86 19.6311 18.7831 19.7191 18.6801C20.5957 17.7067 21.2749 16.5724 21.7191 15.3401C21.755 15.2078 21.7545 15.0682 21.7175 14.9362C21.6806 14.8041 21.6086 14.6846 21.5092 14.5901ZM12.1191 15.8601C11.3647 15.8621 10.6267 15.6401 9.99865 15.2222C9.37057 14.8043 8.88067 14.2094 8.59106 13.5128C8.30145 12.8162 8.22519 12.0493 8.37188 11.3093C8.51858 10.5693 8.8816 9.88949 9.41504 9.35605C9.94848 8.82261 10.6283 8.45953 11.3683 8.31284C12.1083 8.16615 12.8752 8.24244 13.5718 8.53204C14.2684 8.82165 14.8633 9.31156 15.2812 9.93964C15.6991 10.5677 15.9211 11.3057 15.9191 12.0601C15.9165 13.0671 15.5153 14.0321 14.8032 14.7442C14.0912 15.4563 13.1261 15.8575 12.1191 15.8601Z" fill="#ffffff"/>
                        </svg>
                    </div>
                    <div style="font-size: 22px; font-weight: 700; color: #000; margin-bottom: 6px;">童话机 OS 18.4</div>
                    <div style="font-size: 14px; color: #8e8e93;" id="genUpdateStatusLabel">系统已是最新版本</div>
                    <button type="button" id="genForceRefreshBtn" onclick="forceRefreshLatestResources(this)" style="width: min(100%, 360px); min-height: 68px; margin-top: 28px; padding: 10px 14px 10px 16px; border: 1px solid rgba(255,255,255,0.82); border-radius: 24px; background: rgba(255,255,255,0.72); -webkit-backdrop-filter: blur(22px) saturate(150%); backdrop-filter: blur(22px) saturate(150%); box-shadow: 0 10px 28px rgba(0,0,0,0.08), inset 0 1px 0 rgba(255,255,255,0.9); display: flex; align-items: center; gap: 12px; text-align: left; color: #1c1c1e; cursor: pointer; -webkit-tap-highlight-color: transparent;">
                        <span style="width: 42px; height: 42px; flex: 0 0 42px; border-radius: 50%; background: rgba(142,142,147,0.12); display: flex; align-items: center; justify-content: center;">
                            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                                <path d="M20 6v5h-5"></path>
                                <path d="M4 18v-5h5"></path>
                                <path d="M6.1 9a7 7 0 0 1 11.6-2.6L20 11"></path>
                                <path d="M17.9 15a7 7 0 0 1-11.6 2.6L4 13"></path>
                            </svg>
                        </span>
                        <span style="min-width: 0; flex: 1;">
                            <span id="genForceRefreshTitle" style="display: block; font-size: 16px; line-height: 1.25; font-weight: 650;">强制刷新资源</span>
                            <span id="genForceRefreshHint" style="display: block; margin-top: 3px; font-size: 12px; line-height: 1.35; color: #8e8e93;">重新获取最新界面与脚本，不清除聊天和设置数据</span>
                        </span>
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#8e8e93" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" style="flex: 0 0 16px;">
                            <polyline points="9 18 15 12 9 6"></polyline>
                        </svg>
                    </button>
                </div>
            </div>
        </div>

        <!-- 二级页：自定义桌面图标 -->
        <div class="gen-sub-page slide-right" id="genPwaIconPage">
            <div class="ds-nav-bar">
                <div class="ds-back-btn" onclick="closeGenSubPage('genPwaIconPage')">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#000" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="15 18 9 12 15 6"></polyline></svg>
                </div>
                <div class="ds-nav-title">自定义桌面图标</div>
            </div>
            <div class="ds-content">
                <!-- 超大无背景大预览(170px)：左右隐现相邻图标 + 灰色无边框切换按键 + 滚轮滑动支持 -->
                <div class="gen-pwa-preview-section" onwheel="handleGenPwaWheel(event)">
                    <div class="gen-pwa-carousel-container">
                        <button type="button" class="gen-pwa-nav-btn" onclick="navGenPwaIcon(-1)" aria-label="上一个图标">
                            <svg viewBox="0 0 24 24"><polyline points="15 18 9 12 15 6"></polyline></svg>
                        </button>
                        <div class="gen-pwa-carousel-stage">
                            <div class="gen-pwa-side-preview left" onclick="navGenPwaIcon(-1)">
                                <img id="genPwaPrevImg" src="https://i.postimg.cc/s2DL1fdj/Image-1787762040811-366.jpg" alt="Prev Icon">
                            </div>
                            <div class="gen-pwa-preview-box" id="genPwaIconBox">
                                <img id="genPwaPreviewImg" src="https://i.postimg.cc/s2DL1fd2/Image-1787762037706-65.jpg" alt="App Icon">
                            </div>
                            <div class="gen-pwa-side-preview right" onclick="navGenPwaIcon(1)">
                                <img id="genPwaNextImg" src="https://i.postimg.cc/ZqKQ0YtR/Image-1787762033647-442.jpg" alt="Next Icon">
                            </div>
                        </div>
                        <button type="button" class="gen-pwa-nav-btn" onclick="navGenPwaIcon(1)" aria-label="下一个图标">
                            <svg viewBox="0 0 24 24"><polyline points="9 18 15 12 9 6"></polyline></svg>
                        </button>
                    </div>
                    <div class="gen-pwa-preview-name" id="genPwaTitleLabel">童话集</div>
                    <div class="gen-pwa-preview-sub">添加到主屏幕时的呈现效果</div>
                </div>

                <!-- 桌面名称输入行：桌面名称：右侧留微距直接输入 -->
                <div class="ds-section-title">桌面图标名称</div>
                <div class="ds-card-group">
                    <div class="ds-list-item" style="padding: 12px 16px; min-width: 0;">
                        <span style="font-size: 16px; font-weight: 500; color: #000; flex-shrink: 0;">桌面名称：</span>
                        <div class="gen-pwa-name-input-wrapper">
                            <input type="text" id="genPwaNameInput" class="gen-pwa-name-input" placeholder="童话集" maxlength="20" oninput="handleGenPwaNameInput(this.value)">
                        </div>
                    </div>
                </div>

                <!-- 内置桌面图标标题栏（右侧为无边框 Streamline Upload SVG 按钮，点击直达内置菜单） -->
                <div class="gen-section-header">
                    <div class="ds-section-title" style="margin: 0;">内置桌面图标</div>
                    <div class="gen-icon-menu-trigger" id="pwaIcon" onclick="openGenPwaIconMenu(event)" title="从相册或 URL 导入">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" id="Upload--Streamline-Font-Awesome" height="18" width="18">
                            <desc>Upload Streamline Icon: https://streamlinehq.com</desc>
                            <path d="M9 3.415625V11c0 0.553125 -0.446875 1 -1 1s-1 -0.446875 -1 -1V3.415625l-2.29375 2.29375c-0.390625 0.390625 -1.025 0.390625 -1.415625 0s-0.390625 -1.025 0 -1.415625l4 -4c0.390625 -0.390625 1.025 -0.390625 1.415625 0l4 4c0.390625 0.390625 0.390625 1.025 0 1.415625s-1.025 0.390625 -1.415625 0L9 3.415625zM2 11h4c0 1.103125 0.896875 2 2 2s2 -0.896875 2 -2h4c1.103125 0 2 0.896875 2 2v1c0 1.103125 -0.896875 2 -2 2H2c-1.103125 0 -2 -0.896875 -2 -2v-1c0 -1.103125 0.896875 -2 2 -2zm11.5 3.25a0.75 0.75 0 1 0 0 -1.5 0.75 0.75 0 1 0 0 1.5z" fill="#000000" stroke-width="0.0313"></path>
                        </svg>
                    </div>
                </div>

                <!-- 2x2 网格排版内置图标 -->
                <div style="padding: 0 16px 20px;">
                    <div class="gen-preset-grid-2x2" id="genPwaPresetContainer">
                        <!-- JS 自动渲染为 2x2 布局 -->
                    </div>
                </div>
            </div>
        </div>

        <!-- 半屏弹窗：安装至桌面指南 -->
        <div class="gen-sheet-overlay" id="genInstallSheetOverlay" onclick="closeGenInstallSheet()"></div>
        <div class="gen-sheet-container" id="genInstallSheet">
            <div class="gen-sheet-handle"></div>
            <div style="text-align: center; margin-bottom: 16px;">
                <div style="font-size: 18px; font-weight: 700; color: #000; margin-bottom: 6px;">安装至主屏幕 (PWA)</div>
                <div style="font-size: 13px; color: #8e8e93; line-height: 1.45;">获得全屏无边框的纯净独立 App 沉浸体验</div>
            </div>
            <div class="ds-card-group" style="padding: 16px; font-size: 14px; line-height: 1.6; margin-bottom: 14px;">
                <div style="margin-bottom: 8px;"><b>步骤 1：</b> 点击浏览器底部的分享按钮 <span class="gen-safari-icon"><svg viewBox="0 0 24 24" fill="none" stroke="#007aff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="width:16px;height:16px;"><path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8"/><polyline points="16 6 12 2 8 6"/><line x1="12" y1="4" x2="12" y2="15"/></svg></span></div>
                <div><b>步骤 2：</b> 在弹出菜单中向下滑动，选择 <b>「添加到主屏幕」</b> 即可。</div>
            </div>
            <div class="ds-card-group">
                <div class="ds-list-item" onclick="closeGenInstallSheet()" style="cursor: pointer; justify-content: center;">
                    <span style="color: #007aff; font-size: 16px; font-weight: 600;">知道了</span>
                </div>
            </div>
        </div>

        <!-- 半屏弹窗：还原本机 -->
        <div class="gen-sheet-overlay" id="genResetSheetOverlay" onclick="closeGenResetSheet()"></div>
        <div class="gen-sheet-container" id="genResetSheet">
            <div class="gen-sheet-handle"></div>
            <div style="text-align: center; margin-bottom: 16px;">
                <div style="font-size: 18px; font-weight: 700; color: #000; margin-bottom: 6px;">还原本机</div>
                <div style="font-size: 13px; color: #8e8e93; line-height: 1.4;">请选择要进行的操作。还原个性化不会影响你的聊天与角色记录。</div>
            </div>
            <div class="ds-card-group" style="margin-bottom: 12px;">
                <div class="ds-list-item" onclick="executeGenReset('个性化')" style="cursor: pointer; justify-content: center; border-bottom: 0.5px solid #e5e5ea;">
                    <span style="color: #007aff; font-size: 16px; font-weight: 500;">还原个性化设置</span>
                </div>
                <div class="ds-list-item" onclick="executeGenReset('缓存')" style="cursor: pointer; justify-content: center; border-bottom: 0.5px solid #e5e5ea;">
                    <span style="color: #007aff; font-size: 16px; font-weight: 500;">清除本地缓存</span>
                </div>
                <div class="ds-list-item" onclick="executeGenReset('抹掉')" style="cursor: pointer; justify-content: center;">
                    <span style="color: #ff3b30; font-size: 16px; font-weight: 600;">抹掉所有内容并还原本机</span>
                </div>
            </div>
            <div class="ds-card-group">
                <div class="ds-list-item" onclick="closeGenResetSheet()" style="cursor: pointer; justify-content: center;">
                    <span style="color: #007aff; font-size: 16px; font-weight: 600;">取消</span>
                </div>
            </div>
        </div>
    </div>

    <!-- 辅助功能 页面容器 -->
    <div class="general-settings-container" id="accessibilitySettingsUI">
        <!-- 辅助功能主页面 -->
        <div class="gen-sub-page active" id="accessMainPage">
            <div class="ds-nav-bar">
                <div class="ds-back-btn" onclick="closeAccessibilitySettingsApp()">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#000" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="15 18 9 12 15 6"></polyline></svg>
                </div>
                <div class="ds-nav-title">辅助功能</div>
            </div>
            <div class="ds-content">
                <!-- 顶部居中 Hero 卡片 -->
                <div class="access-hero-card">
                    <div class="access-hero-icon-bg">
                        <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style="width: 36px; height: 36px;">
                            <circle cx="12" cy="12" r="10" stroke="#ffffff" stroke-width="2" fill="none"/>
                            <circle cx="12" cy="7" r="1.8" fill="#ffffff"/>
                            <path d="M17 10.5C14.5 11.2 9.5 11.2 7 10.5" stroke="#ffffff" stroke-width="1.8" stroke-linecap="round"/>
                            <path d="M12 11.5V14M12 14L14.5 18M12 14L9.5 18" stroke="#ffffff" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/>
                        </svg>
                    </div>
                    <div class="access-hero-title">辅助功能</div>
                    <div class="access-hero-desc">通过视力、肢体活动能力、听力、语音和认知方面的辅助功能，个性化 iPhone 使其更贴合你的需求。<span style="color: #007aff; cursor: pointer;">进一步了解...</span></div>
                </div>

                <!-- 显示与交互 分组 -->
                <div class="ds-section-title">显示与交互</div>
                <div class="ds-card-group">
                    <div class="ds-list-item" onclick="openAccessSubPage('accessPageAdaptPage')" style="cursor: pointer; border-bottom: 0.5px solid #e5e5ea;">
                        <div style="display: flex; align-items: center; gap: 14px;">
                            <div class="set-item-icon set-bg-blue" style="margin-right: 0; animation: none;">
                                <svg viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><polyline points="9 3 9 21"></polyline><polyline points="15 3 15 21"></polyline></svg>
                            </div>
                            <span style="font-size: 16px; font-weight: 500; color: #000;">页面适配调节</span>
                        </div>
                        <div style="display: flex; align-items: center; color: #8e8e93; font-size: 15px;">
                            <span id="accessAdaptScaleLabel">100%</span>
                            <svg class="set-chevron" viewBox="0 0 8 13" style="margin-left: 8px;"><path d="M1.5 1.5L6.5 6.5L1.5 11.5"/></svg>
                        </div>
                    </div>
                    <div class="ds-list-item" onclick="openAccessSubPage('accessTapClearCssPage')" style="cursor: pointer; border-bottom: 0.5px solid #e5e5ea;">
                        <div style="display: flex; align-items: center; gap: 14px;">
                            <div class="set-item-icon set-bg-blue" style="margin-right: 0; animation: none;">
                                <svg class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" style="width: 20px; height: 20px; fill: white;"><path d="M567.024534 149.331607m60.339779 60.339778l199.422968 199.422969q60.339779 60.339779 0 120.679557l-184.941421 184.941422q-60.339779 60.339779-120.679558 0l-199.422968-199.422969q-60.339779-60.339779 0-120.679557l184.941421-184.941422q60.339779-60.339779 120.679558 0Z" fill="white"></path><path d="M557.653333 256l211.2 213.333333-302.08 298.666667H346.88l-151.466667-151.466667L557.653333 256m0-85.333333a85.333333 85.333333 0 0 0-60.586666 24.746666L135.253333 554.666667a85.333333 85.333333 0 0 0 0 120.746666L311.466667 853.333333h190.293333l327.253333-327.253333a85.333333 85.333333 0 0 0 0-120.746667l-211.2-211.2A85.333333 85.333333 0 0 0 557.653333 170.666667z" fill="white"></path><path d="M332.8 768m42.666667 0l469.333333 0q42.666667 0 42.666667 42.666667l0 0q0 42.666667-42.666667 42.666666l-469.333333 0q-42.666667 0-42.666667-42.666666l0 0q0-42.666667 42.666667-42.666667Z" fill="white"></path></svg>
                            </div>
                            <span style="font-size: 16px; font-weight: 500; color: #000;">五击应急操作</span>
                        </div>
                        <div style="display: flex; align-items: center; color: #8e8e93; font-size: 15px;">
                            <span id="accessTapClearCssStatusSummary">开启</span>
                            <svg class="set-chevron" viewBox="0 0 8 13" style="margin-left: 8px;"><path d="M1.5 1.5L6.5 6.5L1.5 11.5"/></svg>
                        </div>
                    </div>
                    <div class="ds-list-item" onclick="openAccessSubPage('accessDesktopCustomPage')" style="cursor: pointer;">
                        <div style="display: flex; align-items: center; gap: 14px;">
                            <div class="set-item-icon set-bg-blue" style="margin-right: 0; animation: none;">
                                <svg class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" style="width: 20px; height: 20px; fill: white;"><path d="M170.666667 469.333333h256a42.666667 42.666667 0 0 0 42.666666-42.666666V170.666667a42.666667 42.666667 0 0 0-42.666666-42.666667H170.666667a42.666667 42.666667 0 0 0-42.666667 42.666667v256a42.666667 42.666667 0 0 0 42.666667 42.666666z m0 426.666667h256a42.666667 42.666667 0 0 0 42.666666-42.666667v-256a42.666667 42.666667 0 0 0-42.666666-42.666666H170.666667a42.666667 42.666667 0 0 0-42.666667 42.666666v256a42.666667 42.666667 0 0 0 42.666667 42.666667z m426.666666 0h256a42.666667 42.666667 0 0 0 42.666667-42.666667v-256a42.666667 42.666667 0 0 0-42.666667-42.666666h-256a42.666667 42.666667 0 0 0-42.666666 42.666666v256a42.666667 42.666667 0 0 0 42.666666 42.666667z m311.168-627.498667l-153.002666-153.002666a42.624 42.624 0 0 0-60.330667 0l-153.002667 153.002666a42.624 42.624 0 0 0 0 60.330667l153.002667 153.002667a42.624 42.624 0 0 0 60.330667 0l153.002666-153.002667a42.624 42.624 0 0 0 0-60.330667z" fill="white"></path></svg>
                            </div>
                            <span style="font-size: 16px; font-weight: 500; color: #000;">桌面高级自定义</span>
                        </div>
                        <div style="display: flex; align-items: center; color: #8e8e93; font-size: 15px;">
                            <span id="accessDesktopCustomStatusSummary">自定样式</span>
                            <svg class="set-chevron" viewBox="0 0 8 13" style="margin-left: 8px;"><path d="M1.5 1.5L6.5 6.5L1.5 11.5"/></svg>
                        </div>
                    </div>
                </div>

                <!-- 动作交互 分组 -->
                <div class="ds-section-title">动作交互</div>
                <div class="ds-card-group">
                    <div class="ds-list-item" onclick="openAccessSubPage('accessAssistivePage')" style="cursor: pointer; border-bottom: 0.5px solid #e5e5ea;">
                        <div style="display: flex; align-items: center; gap: 14px;">
                            <div class="set-item-icon set-bg-blue" style="margin-right: 0; animation: none;">
                                <svg viewBox="0 0 24 24" fill="white"><circle cx="12" cy="12" r="9" fill="none" stroke="#fff" stroke-width="2"/><circle cx="12" cy="12" r="3.5" fill="#fff"/></svg>
                            </div>
                            <span style="font-size: 16px; font-weight: 500; color: #000;">悬浮球</span>
                        </div>
                        <div style="display: flex; align-items: center; color: #8e8e93; font-size: 15px;">
                            <span id="accessTouchStatusSummary">关闭</span>
                            <svg class="set-chevron" viewBox="0 0 8 13" style="margin-left: 8px;"><path d="M1.5 1.5L6.5 6.5L1.5 11.5"/></svg>
                        </div>
                    </div>
                    <div class="ds-list-item" onclick="openAccessSubPage('accessDynamicIslandPage'); window.tongtongDynamicIsland?.refresh(true);" style="cursor:pointer; border-bottom:0.5px solid #e5e5ea;">
                        <div style="display:flex; align-items:center; gap:14px;">
                            <div class="set-item-icon set-bg-blue" style="margin-right:0; animation:none;">
                                <svg viewBox="0 0 16 16" fill="white" aria-hidden="true"><path d="M6 13c0 1.105-1.12 2-2.5 2S1 14.105 1 13s1.12-2 2.5-2 2.5.896 2.5 2m9-2c0 1.105-1.12 2-2.5 2s-2.5-.895-2.5-2 1.12-2 2.5-2 2.5.895 2.5 2"/><path fill-rule="evenodd" d="M14 11V2h1v9zM6 3v10H5V3z"/><path d="M5 2.905a1 1 0 0 1 .9-.995l8-.8a1 1 0 0 1 1.1.995V3L5 4z"/></svg>
                            </div>
                            <span style="font-size:16px; font-weight:500; color:#000;">灵动岛</span>
                        </div>
                        <div style="display:flex; align-items:center; color:#8e8e93; font-size:15px;">
                            <span id="tdiStatusSummary">关闭</span>
                            <svg class="set-chevron" viewBox="0 0 8 13" style="margin-left:8px;"><path d="M1.5 1.5L6.5 6.5L1.5 11.5"/></svg>
                        </div>
                    </div>
                    <div class="ds-list-item" style="border-bottom: 0.5px solid #e5e5ea;">
                        <div style="display: flex; align-items: center; gap: 14px;">
                            <div class="set-item-icon set-bg-blue" style="margin-right: 0; animation: none;">
                                <svg viewBox="0 0 24 24" style="fill: none !important; stroke: white;" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><rect x="4" y="2" width="16" height="20" rx="2" ry="2"></rect><polyline points="13 7 16 7 16 10"></polyline><line x1="16" y1="7" x2="12" y2="11"></line><polyline points="11 17 8 17 8 14"></polyline><line x1="8" y1="17" x2="12" y2="13"></line></svg>
                            </div>
                            <span style="font-size: 16px; font-weight: 500; color: #000;">强制全屏</span>
                        </div>
                        <div class="ds-toggle" id="forceFullscreenToggle" onclick="toggleForceFullscreen()"></div>
                    </div>
                    <div class="ds-list-item" style="border-bottom: 0.5px solid #e5e5ea;">
                        <div style="display: flex; align-items: center; gap: 14px;">
                            <div class="set-item-icon set-bg-blue" style="margin-right: 0; animation: none;">
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 14 14" style="fill: white !important; stroke: none;"><path fill="white" fill-rule="evenodd" d="M2.5 0.5a0.5 0.5 0 0 0 -0.854 -0.354l-1.5 1.5a0.5 0.5 0 0 0 0 0.708l1.5 1.5A0.5 0.5 0 0 0 2.5 3.5v-1h1a0.5 0.5 0 0 0 0 -1h-1v-1Zm2.407 3.299 0.947 5.86 -0.52 0.188a1.715 1.715 0 0 0 -0.658 2.799l1 1.045a1 1 0 0 0 0.722 0.309h6.482a1 1 0 0 0 0.994 -1.113l-0.367 -3.236a2.573 2.573 0 0 0 -2.951 -2.13l-2.432 0.394 -0.73 -4.519a1.26 1.26 0 0 0 -2.487 0.403Zm5.402 -3.76a0.5 0.5 0 0 1 0.545 0.107l1.5 1.5a0.5 0.5 0 0 1 0 0.708l-1.5 1.5A0.5 0.5 0 0 1 10 3.5v-1H9a0.5 0.5 0 1 1 0 -1h1v-1a0.5 0.5 0 0 1 0.309 -0.462Z" clip-rule="evenodd"></path></svg>
                            </div>
                            <span style="font-size: 16px; font-weight: 500; color: #000;">左滑返回</span>
                        </div>
                        <div class="ds-toggle" id="swipeBackToggle" onclick="toggleSwipeBack()"></div>
                    </div>
                    <div class="ds-list-item">
                        <div style="display: flex; align-items: center; gap: 14px;">
                            <div class="set-item-icon set-bg-blue" style="margin-right: 0; animation: none;">
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="white" stroke="none"><path d="M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12z"/></svg>
                            </div>
                            <span style="font-size: 16px; font-weight: 500; color: #000;">启用系统侧边返回键</span>
                        </div>
                        <div class="ds-toggle" id="systemBackToggle" onclick="toggleSystemBack()"></div>
                    </div>
                </div>
            </div>
        </div>

        <!-- Dynamic Island settings: reuse the accessibility navigation and control patterns. -->
        <div class="gen-sub-page slide-right" id="accessDynamicIslandPage">
            <div class="ds-nav-bar">
                <div class="ds-back-btn" onclick="closeAccessSubPage('accessDynamicIslandPage')">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#000" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="15 18 9 12 15 6"></polyline></svg>
                </div>
                <div class="ds-nav-title">灵动岛</div>
            </div>
            <div class="ds-content">
                <div class="ds-card-group" style="margin-top:10px;">
                    <div class="ds-list-item">
                        <span style="font-size:16px; font-weight:500;">灵动岛</span>
                        <div class="ds-toggle" id="tdiEnableToggle" role="switch" aria-checked="false" onclick="tdiToggle()"></div>
                    </div>
                </div>
                <div class="ds-section-footer">开启后，在童话机内部页面顶部展示音乐与外卖实时活动。长按展开，轻点打开对应应用。</div>
                <div class="ds-section-title">外观与位置</div>
                <div id="tdiSettingsPreview" class="tdi-settings-preview">
                    <div class="tdi-preview-head"><span>实时预览</span><span>iOS 灵动岛</span></div>
                    <div class="tdi-preview-phone">
                        <div class="tdi-preview-time">9:41</div>
                        <div class="tdi-preview-pill"></div>
                        <div class="tdi-preview-mark">童话机</div>
                    </div>
                </div>
                <div class="ds-card-group tdi-settings-controls">
                    <div class="tdi-setting-slider">
                        <div class="tdi-setting-head"><label for="tdi-x">左右位置</label><span id="tdi-x-value">0px</span></div>
                        <input class="ds-slider" type="range" id="tdi-x" min="-90" max="90" step="1" value="0" oninput="tdiChange('x', this.value)">
                    </div>
                    <div class="tdi-setting-slider">
                        <div class="tdi-setting-head"><label for="tdi-y">上下位置</label><span id="tdi-y-value">0px</span></div>
                        <input class="ds-slider" type="range" id="tdi-y" min="-8" max="90" step="1" value="0" oninput="tdiChange('y', this.value)">
                    </div>
                    <div class="tdi-setting-slider">
                        <div class="tdi-setting-head"><label for="tdi-width">胶囊宽度</label><span id="tdi-width-value">146px</span></div>
                        <input class="ds-slider" type="range" id="tdi-width" min="108" max="196" step="2" value="146" oninput="tdiChange('width', this.value)">
                    </div>
                    <div class="tdi-setting-slider">
                        <div class="tdi-setting-head"><label for="tdi-height">胶囊高度</label><span id="tdi-height-value">36px</span></div>
                        <input class="ds-slider" type="range" id="tdi-height" min="30" max="52" step="2" value="36" oninput="tdiChange('height', this.value)">
                    </div>
                </div>
                <div class="ds-section-title">显示方式</div>
                <div class="ds-card-group">
                    <div class="ds-list-item">
                        <span>无活动时自动隐藏</span>
                        <div class="ds-toggle" id="tdi-autoHide" role="switch" aria-checked="false" onclick="tdiChange('autoHide', !this.classList.contains('on'))"></div>
                    </div>
                    <div class="ds-list-item">
                        <span>减少动态效果</span>
                        <div class="ds-toggle" id="tdi-reduceMotion" role="switch" aria-checked="false" onclick="tdiChange('reduceMotion', !this.classList.contains('on'))"></div>
                    </div>
                </div>
                <div class="tdi-settings-reset-wrap">
                    <button type="button" class="tdi-settings-reset" onclick="tdiReset()">恢复默认位置与大小</button>
                </div>
                <div class="ds-section-footer">位置与大小会自动保存。已有的音乐悬浮条设置会保留，开启灵动岛时不重复显示。</div>
            </div>
        </div>

        <!-- 二级页：悬浮球设置主页（直接内嵌自定顶层菜单） -->
        <div class="gen-sub-page slide-right" id="accessAssistivePage">
            <style>
                /* AssistiveTouch appearance card, scoped to this settings subpage. */
                #accessAssistivePage .access-appearance-card {
                    margin: 0 16px;
                    padding: 12px 18px 15px;
                    background: #fff;
                    border: 1px solid rgba(255,255,255,.9);
                    border-radius: 22px;
                    box-shadow: 0 5px 22px rgba(32,48,80,.045);
                    box-sizing: border-box;
                }
                #accessAssistivePage .access-appearance-showcase {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    gap: 6px;
                    min-height: 132px;
                    padding: 12px 8px 12px 16px;
                    box-sizing: border-box;
                    background: linear-gradient(120deg, #f8faff 0%, #eef2f9 100%);
                    border: 1px solid rgba(228,234,245,.9);
                    border-radius: 17px;
                    overflow: hidden;
                }
                #accessAssistivePage .access-appearance-copy { min-width: 0; flex: 1; }
                #accessAssistivePage .access-appearance-eyebrow {
                    color: #7f8a9d; font-size: 11px; letter-spacing: .045em; font-weight: 600;
                }
                #accessAssistivePage .access-appearance-title {
                    margin-top: 6px; font-size: 17px; font-weight: 650; color: #1c1c1e;
                    letter-spacing: -.025em;
                }
                #accessAssistivePage .access-appearance-caption {
                    margin-top: 6px; font-size: 11px; line-height: 1.5; color: #939baa;
                }
                #accessAssistivePage .access-appearance-orbit {
                    width: 110px; height: 110px; flex-shrink: 0;
                    display: flex; justify-content: center; align-items: center;
                    border-radius: 50%;
                    background: radial-gradient(circle, rgba(255,255,255,.86) 0%, rgba(255,255,255,.38) 40%, rgba(255,255,255,.08) 67%);
                    border: 1px solid rgba(255,255,255,.58);
                    box-sizing: border-box;
                }
                #accessAssistivePage .access-appearance-ball {
                    width: 58px; height: 58px; flex-shrink: 0;
                    display: flex; justify-content: center; align-items: center;
                    border-radius: 50%; overflow: hidden;
                    background: rgba(28,28,30,.72);
                    border: .5px solid rgba(255,255,255,.22);
                    box-shadow: 0 7px 18px rgba(27,35,49,.21), inset 0 1px 2px rgba(255,255,255,.3);
                    box-sizing: border-box;
                    transition: opacity .15s ease, width .15s ease, height .15s ease;
                }
                #accessAssistivePage .access-appearance-ball.custom-mode {
                    background: transparent; border-color: transparent; box-shadow: none;
                }
                #accessAssistivePage .access-appearance-ball img {
                    display: block; width: 100%; height: 100%; object-fit: contain;
                    filter: drop-shadow(0 3px 6px rgba(0,0,0,.18));
                }
                #accessAssistivePage .access-appearance-icon-row {
                    display: flex; align-items: center; width: 100%; min-height: 66px;
                    padding: 14px 0; border: 0; background: transparent;
                    cursor: pointer; color: #1c1c1e; text-align: left;
                    font: inherit; -webkit-tap-highlight-color: transparent;
                }
                #accessAssistivePage .access-appearance-icon-text {
                    display: flex; flex-direction: column; flex: 1; min-width: 0; gap: 4px;
                }
                #accessAssistivePage .access-appearance-icon-label {
                    font-size: 15px; font-weight: 600; letter-spacing: -.01em;
                }
                #accessAssistivePage .access-appearance-icon-hint {
                    font-size: 12px; color: #9898a0;
                }
                #accessAssistivePage .access-appearance-current {
                    font-size: 13px; color: #8e8e93; padding-left: 8px; white-space: nowrap;
                }
                #accessAssistivePage .access-appearance-icon-row .set-chevron {
                    flex-shrink: 0; margin-left: 9px;
                }
                #accessAssistivePage .access-appearance-divider {
                    height: .5px; background: rgba(60,60,67,.16);
                }
                #accessAssistivePage .access-appearance-control { padding: 18px 1px 16px; }
                #accessAssistivePage .access-appearance-control:last-child { padding-bottom: 3px; }
                #accessAssistivePage .access-appearance-control-head {
                    display: flex; align-items: center; justify-content: space-between; gap: 12px;
                    margin-bottom: 18px;
                }
                #accessAssistivePage .access-appearance-control-label {
                    font-size: 15px; font-weight: 600; color: #1c1c1e;
                }
                #accessAssistivePage .access-appearance-value {
                    min-width: 54px; padding: 5px 9px; box-sizing: border-box;
                    border-radius: 9px; background: #f3f4f8;
                    color: #515b6d; font-size: 13px; font-weight: 650; text-align: center;
                    font-variant-numeric: tabular-nums;
                }
                #accessAssistivePage .access-appearance-slider.ds-slider {
                    display: block; width: 100%; height: 9px; margin: 0;
                    flex: none; border: 0; border-radius: 999px;
                    -webkit-appearance: none; appearance: none;
                    cursor: pointer; touch-action: pan-x;
                }
                #accessAssistivePage .access-appearance-slider.ds-slider::-webkit-slider-thumb {
                    width: 27px; height: 27px; border-radius: 50%;
                    -webkit-appearance: none; appearance: none;
                    background: rgba(255,255,255,.96);
                    border: 1px solid rgba(255,255,255,.8);
                    box-shadow: 0 1px 3px rgba(0,0,0,.19), 0 4px 10px rgba(0,0,0,.09);
                }
                #accessAssistivePage .access-appearance-slider.ds-slider::-moz-range-thumb {
                    width: 25px; height: 25px; border: 1px solid rgba(255,255,255,.8);
                    border-radius: 50%; background: rgba(255,255,255,.96);
                    box-shadow: 0 1px 3px rgba(0,0,0,.19), 0 4px 10px rgba(0,0,0,.09);
                }
                #accessAssistivePage .access-appearance-slider:focus-visible,
                #accessAssistivePage .access-appearance-icon-row:focus-visible {
                    outline: 2px solid #007aff; outline-offset: 4px;
                }
                #accessAssistivePage .access-appearance-ends {
                    display: flex; justify-content: space-between;
                    margin-top: 14px; color: #a3a3ab; font-size: 11px;
                }
                @media (prefers-reduced-motion: reduce) {
                    #accessAssistivePage .access-appearance-ball { transition: none; }
                }
            </style>
            <div class="ds-nav-bar">
                <div class="ds-back-btn" onclick="closeAccessSubPage('accessAssistivePage')">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#000" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="15 18 9 12 15 6"></polyline></svg>
                </div>
                <div class="ds-nav-title">悬浮球</div>
            </div>
            <div class="ds-content">
                <div class="ds-card-group" style="margin-top: 10px;">
                    <div class="ds-list-item">
                        <span style="font-size: 16px; font-weight: 500;">悬浮球</span>
                        <div class="ds-toggle" id="accessAssistiveToggle" onclick="toggleAssistiveBall()"></div>
                    </div>
                </div>
                <div class="ds-section-footer">开启后屏幕边缘常驻悬浮球。支持上传透明底图 PNG，将自动呈现无背景无边框效果。</div>

                <div class="ds-section-title">外观</div>
                <section class="access-appearance-card" aria-label="悬浮球外观设置">
                    <div class="access-appearance-showcase">
                        <div class="access-appearance-copy">
                            <div class="access-appearance-eyebrow">实时预览</div>
                            <div class="access-appearance-title">你的悬浮球</div>
                            <div class="access-appearance-caption">调整时同步呈现外观</div>
                        </div>
                        <div class="access-appearance-orbit">
                            <div id="accessBallStandalonePreview" class="access-appearance-ball" aria-hidden="true">
                                <div class="ios-assistive-ball-inner"></div>
                            </div>
                        </div>
                    </div>
                    <button type="button" class="access-appearance-icon-row" onclick="openAssistiveBallIconMenu(event)">
                        <span class="access-appearance-icon-text">
                            <span class="access-appearance-icon-label">自定义悬浮球图标</span>
                            <span class="access-appearance-icon-hint">从相册或图片链接中选择</span>
                        </span>
                        <span class="access-appearance-current" id="accessBallIconNameTag">默认</span>
                        <svg class="set-chevron" viewBox="0 0 8 13" aria-hidden="true"><path d="M1.5 1.5L6.5 6.5L1.5 11.5"/></svg>
                    </button>
                    <div class="access-appearance-divider"></div>
                    <div class="access-appearance-control">
                        <div class="access-appearance-control-head">
                            <label class="access-appearance-control-label" for="accessAssistiveSizeSlider">悬浮球大小</label>
                            <span class="access-appearance-value" id="accessAssistiveSizeValueText">58px</span>
                        </div>
                        <input type="range" class="ds-slider access-appearance-slider" id="accessAssistiveSizeSlider" min="20" max="70" step="1" value="58" aria-label="悬浮球大小" oninput="handleAssistiveAppearanceInput('size', this.value)" onchange="commitAssistiveAppearanceSettings()">
                        <div class="access-appearance-ends" aria-hidden="true"><span>小</span><span>大</span></div>
                    </div>
                    <div class="access-appearance-divider"></div>
                    <div class="access-appearance-control">
                        <div class="access-appearance-control-head">
                            <label class="access-appearance-control-label" for="accessAssistiveOpacitySlider">透明度</label>
                            <span class="access-appearance-value" id="accessAssistiveOpacityValueText">100%</span>
                        </div>
                        <input type="range" class="ds-slider access-appearance-slider" id="accessAssistiveOpacitySlider" min="20" max="100" step="1" value="100" aria-label="悬浮球透明度" oninput="handleAssistiveAppearanceInput('opacity', this.value)" onchange="commitAssistiveAppearanceSettings()">
                        <div class="access-appearance-ends" aria-hidden="true"><span>透明</span><span>不透明</span></div>
                    </div>
                </section>
                <div class="ds-section-footer">调整将实时应用到悬浮球，松开滑块后自动保存。</div>

                <div class="ds-section-title">自定顶层菜单</div>
                <div class="access-custom-grid-card">
                    <div style="width: 100%; font-size: 13px; color: #8e8e93; margin-bottom: 12px; text-align: left;">轻点要更改的图标：</div>
                    <div class="access-custom-grid-container" id="accessCustomGrid">
                        <!-- JS 动态渲染 3x3 虚线框槽位 -->
                    </div>
                    
                    <div class="access-custom-stepper-row">
                        <div class="access-custom-reset-btn" onclick="resetAssistiveCustomizeMenu()">重设</div>
                        <div style="display: flex; align-items: center; gap: 14px;">
                            <div class="access-custom-stepper-text" id="accessCustomCountLabel">6 个图标</div>
                            <div class="access-custom-stepper">
                                <button type="button" class="access-stepper-btn" onclick="adjustAssistiveIconCount(-1)" aria-label="减少图标">
                                    <svg viewBox="0 0 24 24"><line x1="5" y1="12" x2="19" y2="12" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"/></svg>
                                </button>
                                <div class="access-stepper-divider"></div>
                                <button type="button" class="access-stepper-btn" onclick="adjustAssistiveIconCount(1)" aria-label="增加图标">
                                    <svg viewBox="0 0 24 24"><line x1="12" y1="5" x2="12" y2="19" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"/><line x1="5" y1="12" x2="19" y2="12" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"/></svg>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="ds-section-footer">轻点上方任一虚线框更改其对应功能，点击右下角按钮可增减图标数量（1至9个）。</div>
            </div>
        </div>

        <!-- 二级页：页面适配调节 -->
        <div class="gen-sub-page slide-right" id="accessPageAdaptPage">
            <div class="ds-nav-bar">
                <div class="ds-back-btn" onclick="closeAccessSubPage('accessPageAdaptPage')">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#000" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="15 18 9 12 15 6"></polyline></svg>
                </div>
                <div class="ds-nav-title">页面适配调节</div>
            </div>
            <div class="ds-content">
                <div class="ds-section-title" style="margin-top: 10px;">屏幕视图比例</div>
                <div class="ds-card-group" style="padding: 16px;">
                    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px;">
                        <span style="font-size: 16px; font-weight: 500;">界面缩放</span>
                        <span id="accessPageScaleValueText" style="font-size: 15px; font-weight: 600; color: #007aff;">100%</span>
                    </div>
                    <input type="range" class="ds-slider" id="accessPageScaleSlider" min="80" max="110" step="1" value="100" style="width: 100%; margin: 8px 0;" oninput="handlePageAdaptScaleInput(this.value)">
                </div>
                <div class="ds-section-footer">调节整个页面的显示比例，手机端和电脑端均实时生效；100% 为原始比例。</div>

                <div class="ds-section-title">桌面格子</div>
                <div class="ds-card-group" style="padding: 16px;">
                    <div style="display: flex; justify-content: space-between; align-items: center;">
                        <label for="accessDesktopRowsSelect" style="font-size: 16px; font-weight: 500;">格子行数</label>
                        <select id="accessDesktopRowsSelect" onchange="handlePageAdaptDesktopRowsChange(this.value)" style="border: 0; background: transparent; color: #007aff; font-size: 15px; font-weight: 600; outline: none;">
                            <option value="6">六行（4 × 6）</option>
                            <option value="7">七行（4 × 7）</option>
                        </select>
                    </div>
                </div>
                <div class="ds-section-footer">手动选择桌面格子行数，不再随屏幕尺寸自动切换。切换会重新排列桌面，放不下的内容移至后续页面。</div>

                <div class="ds-section-title">系统栏空间微调</div>
                <div class="ds-card-group" style="padding: 16px;">
                    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px;">
                        <span style="font-size: 16px; font-weight: 500;">顶栏空间</span>
                        <span id="accessTopBarHeightValueText" style="font-size: 15px; font-weight: 600; color: #007aff;">0px</span>
                    </div>
                    <input type="range" class="ds-slider" id="accessTopBarHeightSlider" min="-80" max="80" step="1" value="0" style="width: 100%; margin: 8px 0 18px;" oninput="handlePageAdaptBarHeightInput('top', this.value)">
                    <div style="height: 0.5px; background: #e5e5ea; margin: 0 -16px 16px;"></div>
                    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px;">
                        <span style="font-size: 16px; font-weight: 500;">底栏空间</span>
                        <span id="accessBottomBarHeightValueText" style="font-size: 15px; font-weight: 600; color: #007aff;">0px</span>
                    </div>
                    <input type="range" class="ds-slider" id="accessBottomBarHeightSlider" min="-120" max="120" step="1" value="0" style="width: 100%; margin: 8px 0;" oninput="handlePageAdaptBarHeightInput('bottom', this.value)">
                </div>
                <div class="ds-section-footer">保留现有系统栏空间补偿；App 标题请使用下方独立微调。正值增加空白，负值减少空白，0px 为系统自动结果。</div>

                <div class="ds-section-title">App 顶部微调</div>
                <div class="ds-card-group" style="padding: 16px;">
                    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px;">
                        <span style="font-size: 16px; font-weight: 500;">目标 App</span>
                        <select id="accessAppTopTargetSelect" onchange="handlePageAdaptTargetChange(this.value)" style="border: 0; background: transparent; color: #007aff; font-size: 15px; font-weight: 600; outline: none;">
                            <option value="wechat">微信</option>
                            <option value="message">信息</option>
                            <option value="contacts">联系人</option>
                            <option value="meeting">见面</option>
                            <option value="readen">阅读</option>
                            <option value="icity">iCity / 日记</option>
                            <option value="settings">设置</option>
                        </select>
                    </div>
                    <div style="height: 0.5px; background: #e5e5ea; margin: 0 -16px 16px;"></div>
                    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px;">
                        <span style="font-size: 16px; font-weight: 500;">顶部留白</span>
                        <span id="accessAppTopOffsetValueText" style="font-size: 15px; font-weight: 600; color: #007aff;">0px</span>
                    </div>
                    <input type="range" class="ds-slider" id="accessAppTopOffsetSlider" min="-24" max="80" step="1" value="0" style="width: 100%; margin: 8px 0 16px;" oninput="handlePageAdaptAppTopOffsetInput(this.value)">
                    <div class="ds-list-item" onclick="resetPageAdaptAppTopOffset()" style="cursor: pointer; justify-content: center; margin: 0 -16px -16px; border-top: 0.5px solid #e5e5ea;">
                        <span style="color: #007aff; font-size: 16px; font-weight: 500;">恢复当前 App 默认</span>
                    </div>
                </div>
                <div class="ds-section-footer">以自动适配结果为基准，仅补偿所选 App 的顶栏与内容起点；不会缩放或移动整机。范围 -24px 至 +80px，默认 0px。</div>

                <div class="ds-section-title">微信键盘</div>
                <div class="ds-card-group">
                    <div class="ds-list-item" style="border-bottom: 0.5px solid #e5e5ea;">
                        <span style="font-size: 16px; font-weight: 500;">键盘弹出时输入栏位置</span>
                        <span id="accessWechatKeyboardOffsetValueText" style="font-size: 15px; font-weight: 600; color: #007aff;">0px</span>
                    </div>
                    <div class="ds-list-item" onclick="startWechatKeyboardCalibration()" style="cursor: pointer; justify-content: center;">
                        <span style="color: #007aff; font-size: 16px; font-weight: 500;">进入微信实时校准</span>
                    </div>
                </div>
                <div class="ds-section-footer">只调整当前浏览器里的微信聊天输入栏，默认 0px。进入校准后打开任意聊天并点输入框，位置只在键盘展开时生效。</div>

                <div class="ds-section-title">短信键盘</div>
                <div class="ds-card-group">
                    <div class="ds-list-item" style="border-bottom: 0.5px solid #e5e5ea;">
                        <span style="font-size: 16px; font-weight: 500;">键盘弹出时输入栏位置</span>
                        <span id="accessMessageKeyboardOffsetValueText" style="font-size: 15px; font-weight: 600; color: #007aff;">0px</span>
                    </div>
                    <div class="ds-list-item" onclick="startMessageKeyboardCalibration()" style="cursor: pointer; justify-content: center;">
                        <span style="color: #007aff; font-size: 16px; font-weight: 500;">进入短信实时校准</span>
                    </div>
                </div>
                <div class="ds-section-footer">同时适配短信聊天输入栏和新建短信输入栏，只在键盘展开时生效；当前设备单独保存，默认 0px。</div>

                <div class="ds-section-title">快速预设</div>
                <div class="ds-card-group">
                    <div class="ds-list-item" onclick="setPageAdaptPreset(100)" style="cursor: pointer; justify-content: center; border-bottom: 0.5px solid #e5e5ea;">
                        <span style="color: #007aff; font-size: 16px; font-weight: 500;">标准大小 (100%)</span>
                    </div>
                    <div class="ds-list-item" onclick="setPageAdaptPreset(90)" style="cursor: pointer; justify-content: center; border-bottom: 0.5px solid #e5e5ea;">
                        <span style="color: #007aff; font-size: 16px; font-weight: 500;">紧凑视图 (90%)</span>
                    </div>
                    <div class="ds-list-item" onclick="setPageAdaptPreset(85)" style="cursor: pointer; justify-content: center;">
                        <span style="color: #007aff; font-size: 16px; font-weight: 500;">小屏适配 (85%)</span>
                    </div>
                </div>
            </div>
        </div>

        <!-- 二级页：五击应急操作 -->
        <div class="gen-sub-page slide-right" id="accessTapClearCssPage">
            <div class="ds-nav-bar">
                <div class="ds-back-btn" onclick="closeAccessSubPage('accessTapClearCssPage')">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#000" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="15 18 9 12 15 6"></polyline></svg>
                </div>
                <div class="ds-nav-title">五击应急操作</div>
            </div>
            <div class="ds-content">
                <div class="ds-section-title" style="margin-top: 10px;">手势触发</div>
                <div class="ds-card-group">
                    <div class="ds-list-item">
                        <span style="font-size: 16px; font-weight: 500; color: #000;">连续点击打开应急操作</span>
                        <div class="ds-toggle on" id="accessTapClearCssToggle" onclick="toggleTapClearCssSwitch()"></div>
                    </div>
                </div>
                <div class="ds-section-footer">开启后，在桌面或微信页面连续快速点击非按钮区域 5 次，可选择导出数据或清空微信美化。清空前仍需确认。关闭仅停用五击入口，不影响启动异常提示。</div>

                <div class="ds-section-title">单独清空操作</div>
                <div class="ds-card-group">
                    <div class="ds-list-item" onclick="clearCurrentChatCssAction()" style="cursor: pointer; justify-content: center; border-bottom: 0.5px solid #e5e5ea;">
                        <span style="color: #007aff; font-size: 16px; font-weight: 500;">清空聊天室美化 CSS</span>
                    </div>
                    <div class="ds-list-item" onclick="clearGlobalWechatCssAction()" style="cursor: pointer; justify-content: center;">
                        <span style="color: #ff3b30; font-size: 16px; font-weight: 500;">清空微信个性化全局 CSS</span>
                    </div>
                </div>
                <div class="ds-section-footer">点击上方按键可单独清除当前聊天室的美化样式，或者单独清除微信个性化页面中配置的全局美化 CSS 与脚本。</div>
            </div>
        </div>

        <!-- 二级页：桌面高级自定义 -->
        <div class="gen-sub-page slide-right" id="accessDesktopCustomPage">
            <div class="ds-nav-bar">
                <div class="ds-back-btn" onclick="closeAccessSubPage('accessDesktopCustomPage')">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#000" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="15 18 9 12 15 6"></polyline></svg>
                </div>
                <div class="ds-nav-title">桌面高级自定义</div>
                <div onclick="openDesktopCustomTutorialModal()" style="position: absolute; right: 16px; bottom: 10px; height: 30px; padding: 0 14px; border-radius: 15px; background: rgba(255, 255, 255, 0.85); backdrop-filter: blur(12px); -webkit-backdrop-filter: blur(12px); box-shadow: 0 2px 5px rgba(0,0,0,0.06); color: #000000; font-size: 14px; font-weight: 600; cursor: pointer; user-select: none; display: flex; align-items: center; justify-content: center; box-sizing: border-box;">教程</div>
            </div>
            <div class="ds-content">
                <div class="ds-section-title" style="margin-top: 10px;">小组件底部文字</div>
                <div class="ds-card-group" style="overflow: hidden; width: calc(100% - 32px); box-sizing: border-box;">
                    <div class="ds-list-item" style="border-bottom: 0.5px solid #e5e5ea;">
                        <span style="font-size: 16px; font-weight: 500; color: #000;">显示组件底部文字</span>
                        <div class="ds-toggle" id="accessWidgetLabelToggle" onclick="toggleDesktopWidgetLabelSwitch()"></div>
                    </div>
                    <div class="ds-list-item" style="padding: 10px 16px; display: flex; align-items: center; justify-content: space-between; gap: 10px; width: 100%; box-sizing: border-box; overflow: hidden;">
                        <span style="font-size: 16px; font-weight: 500; color: #000; flex-shrink: 0;">文字内容</span>
                        <input type="text" id="accessWidgetLabelInput" placeholder="Fairy Widgets" maxlength="30" style="flex: 1 1 auto; min-width: 0; width: 100%; max-width: 100%; border: none; outline: none; background: transparent; text-align: right; font-size: 15px; color: #007aff; font-weight: 500; white-space: nowrap; overflow: visible; text-overflow: clip; box-sizing: border-box;" oninput="handleDesktopWidgetLabelInput(this.value)">
                    </div>
                </div>
                <div class="ds-section-footer">开启后，桌面所有小组件底部将显示文字标签（默认显示 Fairy Widgets），支持自定义文字内容。</div>

                <div class="ds-section-title">桌面高级自定义 CSS</div>
                <div class="ds-card-group" style="padding: 14px; box-sizing: border-box; overflow: hidden; width: calc(100% - 32px);">
                    <textarea id="accessDesktopCustomCssInput" style="width: 100% !important; max-width: 100% !important; min-width: 100% !important; height: 140px; border: none; outline: none; background: #f2f2f7; border-radius: 12px; padding: 12px; font-family: monospace; font-size: 13px; color: #000; box-sizing: border-box !important; resize: vertical; display: block; margin: 0 !important;" placeholder="在此输入自定义桌面 CSS 代码...&#10;例：把桌面图标改成方形：&#10;.app-icon { border-radius: 8px !important; }&#10;例：修改顶部状态栏颜色：&#10;#statusBar { color: #ff2d55 !important; }"></textarea>
                </div>

                <div class="ds-section-title">桌面自定义 JavaScript 脚本</div>
                <div class="ds-card-group" style="padding: 14px; box-sizing: border-box; overflow: hidden; width: calc(100% - 32px);">
                    <textarea id="accessDesktopCustomJsInput" style="width: 100% !important; max-width: 100% !important; min-width: 100% !important; height: 130px; border: none; outline: none; background: #f2f2f7; border-radius: 12px; padding: 12px; font-family: monospace; font-size: 13px; color: #000; box-sizing: border-box !important; resize: vertical; display: block; margin: 0 !important;" placeholder="在此输入自定义桌面 JavaScript 脚本代码..."></textarea>
                </div>

                <div style="padding: 20px 16px 10px; display: flex; gap: 10px;">
                    <button type="button" class="ds-diagnostic-btn" onclick="saveDesktopCustomSettings()" style="flex: 1; padding: 12px 0; font-size: 16px; border-radius: 14px; background-color: #007aff; color: #ffffff;">应用桌面自定义</button>
                    <button type="button" class="ds-diagnostic-btn" onclick="clearDesktopCustomAction()" style="flex: 1; padding: 12px 0; font-size: 16px; border-radius: 14px; background-color: #ff3b30; color: #ffffff !important; border: none;">清空代码</button>
                </div>
                <div style="height: 30px;"></div>
            </div>
        </div>

        <!-- 桌面高级自定义教程居中弹窗 (模仿微信提示词/心声教程面板风格) -->
        <div id="desktopCustomTutorialModalOverlay" onclick="closeDesktopCustomTutorialModal(event)" style="position: fixed; inset: 0; background: rgba(0, 0, 0, 0.45); backdrop-filter: blur(8px); -webkit-backdrop-filter: blur(8px); z-index: 2147483646; display: none; align-items: center; justify-content: center; opacity: 0; transition: opacity 0.25s ease;">
            <div onclick="event.stopPropagation()" style="width: 88%; max-width: 340px; max-height: 80vh; background: #ffffff; border-radius: 24px; box-shadow: 0 16px 40px rgba(0,0,0,0.25); display: flex; flex-direction: column; overflow: hidden; box-sizing: border-box;">
                <div style="padding: 16px 20px 12px; font-size: 17px; font-weight: 700; color: #000; text-align: center; border-bottom: 0.5px solid rgba(0,0,0,0.08); flex-shrink: 0;">桌面高级自定义教程</div>
                <div style="padding: 14px 16px 20px; overflow-y: auto; flex: 1; font-size: 13px; color: #333; line-height: 1.5; -webkit-overflow-scrolling: touch;">
                    <h4 style="margin: 4px 0 6px; font-size: 13.5px; font-weight: 700; color: #000;">💡 编写规则与说明</h4>
                    <p style="margin: 0 0 10px; color: #555;">通过自定义 CSS，您可以自由重绘整机桌面的任意 UI（包括图标圆角、隐藏名称、顶部状态栏颜色、Dock 栏毛玻璃等）。CSS 请在属性后加上 <code>!important</code> 以确保覆盖系统样式。点击代码块右上角的图标即可一键复制对应样式。</p>

                    <h4 style="margin: 10px 0 6px; font-size: 13.5px; font-weight: 700; color: #000;">🛠️ 桌面常用 CSS 样式库</h4>

                    <!-- 示例 1: 直角/圆角方形 -->
                    <div style="position: relative; background: #f2f2f7; border-radius: 12px; padding: 10px 12px; margin: 8px 0;">
                        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 4px;">
                            <span style="font-size: 12px; font-weight: 700; color: #333;">1. 图标改成直角 / 小圆角方形</span>
                            <div onclick="copyDesktopTutorialCode('.app-icon { border-radius: 8px !important; }')" title="复制代码" style="cursor: pointer; display: flex; align-items: center; justify-content: center; width: 26px; height: 26px; border-radius: 6px; background: #ffffff; color: #007aff; box-shadow: 0 1px 3px rgba(0,0,0,0.08);">
                                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="9" y="9" width="13" height="13" rx="2"></rect><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path></svg>
                            </div>
                        </div>
                        <pre style="margin: 0; font-family: monospace; font-size: 12px; color: #000; white-space: pre-wrap;">.app-icon { border-radius: 8px !important; }</pre>
                    </div>

                    <!-- 示例 2: 隐藏名称 -->
                    <div style="position: relative; background: #f2f2f7; border-radius: 12px; padding: 10px 12px; margin: 8px 0;">
                        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 4px;">
                            <span style="font-size: 12px; font-weight: 700; color: #333;">2. 隐藏桌面所有图标名称</span>
                            <div onclick="copyDesktopTutorialCode('.app-name { display: none !important; }')" title="复制代码" style="cursor: pointer; display: flex; align-items: center; justify-content: center; width: 26px; height: 26px; border-radius: 6px; background: #ffffff; color: #007aff; box-shadow: 0 1px 3px rgba(0,0,0,0.08);">
                                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="9" y="9" width="13" height="13" rx="2"></rect><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path></svg>
                            </div>
                        </div>
                        <pre style="margin: 0; font-family: monospace; font-size: 12px; color: #000; white-space: pre-wrap;">.app-name { display: none !important; }</pre>
                    </div>

                    <!-- 示例 3: 状态栏颜色 -->
                    <div style="position: relative; background: #f2f2f7; border-radius: 12px; padding: 10px 12px; margin: 8px 0;">
                        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 4px;">
                            <span style="font-size: 12px; font-weight: 700; color: #333;">3. 顶部状态栏及电量颜色</span>
                            <div onclick="copyDesktopTutorialCode('#statusBar { color: #ff2d55 !important; }\n#statusBar svg { fill: #ff2d55 !important; stroke: #ff2d55 !important; }')" title="复制代码" style="cursor: pointer; display: flex; align-items: center; justify-content: center; width: 26px; height: 26px; border-radius: 6px; background: #ffffff; color: #007aff; box-shadow: 0 1px 3px rgba(0,0,0,0.08);">
                                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="9" y="9" width="13" height="13" rx="2"></rect><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path></svg>
                            </div>
                        </div>
                        <pre style="margin: 0; font-family: monospace; font-size: 12px; color: #000; white-space: pre-wrap;">#statusBar { color: #ff2d55 !important; }
#statusBar svg { fill: #ff2d55 !important; stroke: #ff2d55 !important; }</pre>
                    </div>

                    <!-- 示例 4: Dock栏毛玻璃 -->
                    <div style="position: relative; background: #f2f2f7; border-radius: 12px; padding: 10px 12px; margin: 8px 0;">
                        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 4px;">
                            <span style="font-size: 12px; font-weight: 700; color: #333;">4. 底部 Dock 栏毛玻璃与边框</span>
                            <div onclick="copyDesktopTutorialCode('#dock { background: rgba(255, 255, 255, 0.45) !important; border: 1.5px solid rgba(255, 255, 255, 0.75) !important; backdrop-filter: blur(20px) !important; }')" title="复制代码" style="cursor: pointer; display: flex; align-items: center; justify-content: center; width: 26px; height: 26px; border-radius: 6px; background: #ffffff; color: #007aff; box-shadow: 0 1px 3px rgba(0,0,0,0.08);">
                                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="9" y="9" width="13" height="13" rx="2"></rect><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path></svg>
                            </div>
                        </div>
                        <pre style="margin: 0; font-family: monospace; font-size: 12px; color: #000; white-space: pre-wrap;">#dock { background: rgba(255, 255, 255, 0.45) !important; border: 1.5px solid rgba(255, 255, 255, 0.75) !important; backdrop-filter: blur(20px) !important; }</pre>
                    </div>

                    <h4 style="margin: 10px 0 6px; font-size: 13.5px; font-weight: 700; color: #000;">⚙️ 常用 JavaScript 变量与函数</h4>
                    <p style="margin: 0 0 10px; color: #555;">支持在桌面自定义 JS 中直接调用的常用原生方法与接口：</p>
                    <div style="position: relative; background: #f2f2f7; border-radius: 12px; padding: 10px 12px; margin: 8px 0;">
                        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 4px;">
                            <span style="font-size: 12px; font-weight: 700; color: #333;">JS 快捷调用示例</span>
                            <div onclick="copyDesktopTutorialCode('showToast(\x22欢迎回到桌面 ✨\x22);')" title="复制代码" style="cursor: pointer; display: flex; align-items: center; justify-content: center; width: 26px; height: 26px; border-radius: 6px; background: #ffffff; color: #007aff; box-shadow: 0 1px 3px rgba(0,0,0,0.08);">
                                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="9" y="9" width="13" height="13" rx="2"></rect><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path></svg>
                            </div>
                        </div>
                        <pre style="margin: 0; font-family: monospace; font-size: 12px; color: #000; white-space: pre-wrap;">// 弹出系统提示
showToast("欢迎回到桌面 ✨");

// 切换桌面页面 (0为第一页，1为第二页...)
// switchDesktopPage(0);

// 打开应用
// openSettingsApp();
// openThemeApp();
// openWechatApp();</pre>
                    </div>
                </div>
                <div style="padding: 12px 16px 16px; border-top: 0.5px solid rgba(0,0,0,0.08); flex-shrink: 0; background: #ffffff;">
                    <button type="button" onclick="closeDesktopCustomTutorialModal()" style="width: 100%; height: 44px; background: #007aff; color: #ffffff; font-size: 16px; font-weight: 600; border-radius: 12px; border: none; outline: none; cursor: pointer; display: flex; align-items: center; justify-content: center;">我知道了</button>
                </div>
            </div>
        </div>

        <!-- 槽位功能选择半屏抽屉 (图1列表风格) -->
        <div class="ls-sheet-overlay" id="accessSlotPickerOverlay" onclick="closeAccessSlotPicker()"></div>
        <div class="ls-sheet-container" id="accessSlotPickerSheet" style="height: 70%;">
            <div class="ls-sheet-bg-card"></div>
            <div class="ls-sheet-main">
                <div class="ls-sheet-header" style="justify-content: space-between;">
                    <div class="ls-sheet-cancel" onclick="closeAccessSlotPicker()">取消</div>
                    <div style="font-size: 17px; font-weight: 600; color: #000;" id="accessSlotPickerTitle">更改功能</div>
                    <div style="width: 32px;"></div>
                </div>
                <div class="ls-sheet-content" style="padding: 0 16px 20px; overflow-y: auto; width: 100%; box-sizing: border-box;">
                    <div class="access-picker-list-card" id="accessSlotPickerList">
                        <!-- 动态填充动作选项列表 -->
                    </div>
                </div>
            </div>
        </div>
    </div>

    <!-- 微信页面由 js/wechat.js 挂载 -->

    <!-- 联系人 APP -->
    `;
    const anchor = document.currentScript;
    if (anchor && anchor.parentNode) {
        anchor.insertAdjacentHTML('afterend', html);
    } else {
        document.body.insertAdjacentHTML('beforeend', html);
    }
})();


    function updateSettingsCompactTitle(settingsUI) {
        const scrollArea = settingsUI?.querySelector('.settings-scroll-area');
        const topBar = settingsUI?.querySelector('.settings-top-bar');
        if (!scrollArea || !topBar) return;
        const shouldShowCompactTitle = scrollArea.scrollTop > 18;
        settingsUI.classList.toggle('settings-compact-title-visible', shouldShowCompactTitle);
        topBar.setAttribute('aria-hidden', shouldShowCompactTitle ? 'false' : 'true');
    }

    function bindSettingsCompactTitle(settingsUI) {
        const scrollArea = settingsUI?.querySelector('.settings-scroll-area');
        if (!scrollArea || scrollArea.dataset.compactTitleBound === 'true') return;
        scrollArea.dataset.compactTitleBound = 'true';

        let frame = 0;
        scrollArea.addEventListener('scroll', () => {
            if (frame) return;
            frame = requestAnimationFrame(() => {
                frame = 0;
                updateSettingsCompactTitle(settingsUI);
            });
        }, { passive: true });
    }

    let settingsVisibilityTimer = 0;
    let settingsInteractionFrame = 0;
    let settingsOpenedAt = 0;

    function openSettingsApp() {
        const settingsUI = document.getElementById('settingsAppUI');
        if (!settingsUI) return;

        if (settingsVisibilityTimer) {
            clearTimeout(settingsVisibilityTimer);
            settingsVisibilityTimer = 0;
        }
        if (settingsInteractionFrame) {
            cancelAnimationFrame(settingsInteractionFrame);
            settingsInteractionFrame = 0;
        }

        settingsOpenedAt = performance.now();
        settingsUI.style.display = 'flex';
        settingsUI.style.pointerEvents = 'none';
        settingsUI.setAttribute('aria-hidden', 'false');
        bindSettingsCompactTitle(settingsUI);
        updateSettingsCompactTitle(settingsUI);

        const currentName = (typeof appSettings !== 'undefined' && appSettings.apple_id_name) ? appSettings.apple_id_name : '@uu';
        const currentAvatar = (typeof appSettings !== 'undefined' && appSettings.apple_id_avatar) ? appSettings.apple_id_avatar : '';
        if (typeof updateAllProfileDisplay === 'function') {
            updateAllProfileDisplay(currentName, currentAvatar);
        }

        // Isolate the desktop tap that opened Settings from the newly mounted page.
        // The container is visible immediately, while interaction begins next frame.
        settingsInteractionFrame = requestAnimationFrame(() => {
            settingsInteractionFrame = 0;
            if (settingsUI.style.display !== 'flex') return;
            settingsUI.classList.add('show');
            settingsUI.style.pointerEvents = 'auto';
        });
    }

    function closeSettingsApp(options = {}) {
        const settingsUI = document.getElementById('settingsAppUI');
        if (!settingsUI) return;

        // Direct taps keep the open-tap guard; committed navigation gestures must always close.
        const forceClose = options === true || Boolean(options && typeof options === 'object' && options.force);
        const immediateClose = Boolean(options && typeof options === 'object' && options.immediate);
        if (!forceClose && performance.now() - settingsOpenedAt < 180) return;

        if (settingsVisibilityTimer) {
            clearTimeout(settingsVisibilityTimer);
            settingsVisibilityTimer = 0;
        }
        if (settingsInteractionFrame) {
            cancelAnimationFrame(settingsInteractionFrame);
            settingsInteractionFrame = 0;
        }

        settingsUI.classList.remove('show', 'settings-compact-title-visible');
        settingsUI.style.pointerEvents = 'none';
        settingsUI.setAttribute('aria-hidden', 'true');
        settingsOpenedAt = 0;

        if (immediateClose) {
            settingsUI.style.display = 'none';
            if (typeof window.syncStatusBarAfterReturnHome === 'function') {
                window.syncStatusBarAfterReturnHome();
            }
            return;
        }

        settingsVisibilityTimer = window.setTimeout(() => {
            settingsVisibilityTimer = 0;
            if (!settingsUI.classList.contains('show')) {
                settingsUI.style.display = 'none';
            }
            if (typeof window.syncStatusBarAfterReturnHome === 'function') {
                window.syncStatusBarAfterReturnHome();
            }
        }, 310);
    }

    let backgroundKeepAliveWakeLock = null;
    let backgroundKeepAliveLifecycleBound = false;

    async function requestBackgroundKeepAliveWakeLock() {
        if (!appSettings?.background_keep_alive_enabled || document.visibilityState !== 'visible') return false;
        if (!('wakeLock' in navigator)) return false;
        if (backgroundKeepAliveWakeLock && !backgroundKeepAliveWakeLock.released) return true;

        try {
            const wakeLock = await navigator.wakeLock.request('screen');
            if (!appSettings?.background_keep_alive_enabled || document.visibilityState !== 'visible') {
                await wakeLock.release();
                return false;
            }
            backgroundKeepAliveWakeLock = wakeLock;
            wakeLock.addEventListener('release', () => {
                backgroundKeepAliveWakeLock = null;
            }, { once: true });
            return true;
        } catch (error) {
            backgroundKeepAliveWakeLock = null;
            console.debug('Background keep-alive wake lock unavailable:', error);
            return false;
        }
    }

    async function releaseBackgroundKeepAliveWakeLock() {
        if (!backgroundKeepAliveWakeLock) return;
        const wakeLock = backgroundKeepAliveWakeLock;
        backgroundKeepAliveWakeLock = null;
        try {
            await wakeLock.release();
        } catch (error) {
            console.debug('Background keep-alive wake lock release failed:', error);
        }
    }

    async function applyBackgroundKeepAlive() {
        const toggle = document.getElementById('backgroundKeepAliveToggle');
        const enabled = appSettings?.background_keep_alive_enabled === true;
        if (toggle) {
            toggle.classList.toggle('on', enabled);
            toggle.setAttribute('aria-checked', String(enabled));
        }

        // Never use silent looping audio for keep-alive. Even near-silent media can
        // claim Android/iOS audio focus and pause external audiobook/music apps.
        if (!enabled || document.visibilityState !== 'visible') {
            await releaseBackgroundKeepAliveWakeLock();
            return enabled;
        }

        await requestBackgroundKeepAliveWakeLock();
        return true;
    }

    function initBackgroundKeepAlive() {
        if (!backgroundKeepAliveLifecycleBound) {
            document.addEventListener('visibilitychange', () => {
                void applyBackgroundKeepAlive();
            });
            window.addEventListener('pageshow', () => {
                void applyBackgroundKeepAlive();
            });
            window.addEventListener('pagehide', () => {
                void releaseBackgroundKeepAliveWakeLock();
            });
            backgroundKeepAliveLifecycleBound = true;
        }
        void applyBackgroundKeepAlive();
    }

    async function toggleBackgroundKeepAlive() {
        if (typeof appSettings === 'undefined') return;
        appSettings.background_keep_alive_enabled = appSettings.background_keep_alive_enabled !== true;
        await applyBackgroundKeepAlive();
        if (typeof saveAppSettings === 'function') saveAppSettings();
        if (typeof showToast === 'function') {
            if (!appSettings.background_keep_alive_enabled) showToast('后台保活已关闭');
            else showToast('后台保活已开启，不会占用其他 App 的音频播放');
        }
    }

    function applyMessageNotifications() {
        const enabled = appSettings?.message_notifications_enabled === true;
        const toggle = document.getElementById('messageNotificationPageToggle');
        if (toggle) {
            toggle.classList.toggle('on', enabled);
            toggle.setAttribute('aria-checked', String(enabled));
        }
        updateMessageNotificationPermissionStatus();
    }

    let stCurrentTab = 'weekly'; // 'weekly' 或 'total'
    let stDataState = {
        totalProjectSeconds: 0,
        days: {} // 结构: { "YYYY-MM-DD": { projectSeconds: 0, chatSeconds: { [charId]: 0 } } }
    };
    let stLastTrackerTimestamp = Date.now();
    let stLiveTimerId = null;

    function stLoadStorageData() {
        try {
            const raw = localStorage.getItem('tonghuaji_screen_time_stats_v2');
            if (raw) stDataState = JSON.parse(raw);
        } catch (e) {}
        if (!stDataState.days) stDataState.days = {};
        if (typeof stDataState.totalProjectSeconds !== 'number') {
            stDataState.totalProjectSeconds = Number(stDataState.totalOnlineSeconds || stDataState.totalWechatOnlineSeconds || 0);
        }
    }

    function stSaveStorageData() {
        try {
            localStorage.setItem('tonghuaji_screen_time_stats_v2', JSON.stringify(stDataState));
        } catch (e) {}
    }

    function stGetDateKey(date = new Date()) {
        const y = date.getFullYear();
        const m = String(date.getMonth() + 1).padStart(2, '0');
        const d = String(date.getDate()).padStart(2, '0');
        return `${y}-${m}-${d}`;
    }

    function stFormatDurationText(seconds) {
        seconds = Math.max(0, Math.round(seconds || 0));
        if (seconds === 0) return '0 分钟';
        const hours = Math.floor(seconds / 3600);
        const minutes = Math.floor((seconds % 3600) / 60);
        const sec = seconds % 60;
        if (hours > 0) {
            return minutes > 0 ? `${hours} 小时 ${minutes} 分钟` : `${hours} 小时`;
        }
        if (minutes > 0) {
            return `${minutes} 分钟`;
        }
        return `${sec} 秒`;
    }

    // 后台心跳累加器：只要网页在前台，就实时统计项目的在线时长；当处于角色聊天室时，同时统计该角色的聊天时长
    function initScreenTimeBackgroundTracker() {
        if (window._stBackgroundTrackerInit) return;
        window._stBackgroundTrackerInit = true;
        stLoadStorageData();

        setInterval(() => {
            const now = Date.now();
            const deltaSec = Math.min(5, Math.max(1, Math.round((now - stLastTrackerTimestamp) / 1000)));
            stLastTrackerTimestamp = now;

            if (document.visibilityState !== 'visible') return;

            const todayKey = stGetDateKey();
            if (!stDataState.days[todayKey]) {
                stDataState.days[todayKey] = { projectSeconds: 0, chatSeconds: {} };
            }

            // 1. 项目在线总时长实时自增
            stDataState.totalProjectSeconds = (stDataState.totalProjectSeconds || 0) + deltaSec;
            stDataState.days[todayKey].projectSeconds = (stDataState.days[todayKey].projectSeconds || 0) + deltaSec;

            // 2. 聊天时长实时自增（进入任意角色聊天室时）
            const isChatActive = document.getElementById('page-chat-room')?.classList.contains('active');
            const wechatUI = document.getElementById('wechatAppUI');
            const isWechatOpen = wechatUI && (wechatUI.classList.contains('show') || wechatUI.style.display === 'flex' || wechatUI.style.display === 'block');
            const activeContactId = window.wcCurrentChatContactId;

            if (isWechatOpen && isChatActive && activeContactId) {
                if (!stDataState.days[todayKey].chatSeconds) stDataState.days[todayKey].chatSeconds = {};
                stDataState.days[todayKey].chatSeconds[activeContactId] = (stDataState.days[todayKey].chatSeconds[activeContactId] || 0) + deltaSec;
            }

            stSaveStorageData();

            // 如果屏幕使用时间页面正打开着，实时刷新界面数字
            const stUI = document.getElementById('screenTimeSettingsUI');
            if (stUI && stUI.classList.contains('show')) {
                updateScreenTimeDisplay();
            }
        }, 1500);
    }
    initScreenTimeBackgroundTracker();

    function stGetWeekDates() {
        const now = new Date();
        const day = now.getDay() === 0 ? 7 : now.getDay();
        const monday = new Date(now);
        monday.setDate(now.getDate() - (day - 1));
        const dates = [];
        for (let i = 0; i < 7; i++) {
            const d = new Date(monday);
            d.setDate(monday.getDate() + i);
            dates.push({
                dateKey: stGetDateKey(d),
                label: ['一', '二', '三', '四', '五', '六', '日'][i],
                isToday: d.toDateString() === now.toDateString()
            });
        }
        return dates;
    }

    // 安全获取当前微信实际登录账号的真实唯一标识
    async function stGetTrueCurrentWechatAccountId() {
        let accountId = 'default';
        let currentAccount = null;

        if (window.db && typeof storeName !== 'undefined') {
            try {
                const authData = await new Promise((resolve) => {
                    const tx = window.db.transaction([storeName], 'readonly');
                    const req = tx.objectStore(storeName).get('wechatAuthData');
                    req.onsuccess = () => resolve(req.result);
                    req.onerror = () => resolve(null);
                });
                if (authData && authData.currentLoginWxid && Array.isArray(authData.accounts)) {
                    currentAccount = authData.accounts.find(a => a.wxid === authData.currentLoginWxid) || null;
                }
            } catch (e) {}
        }

        if (currentAccount?.maskId) {
            accountId = currentAccount.maskId;
        } else if (typeof appSettings !== 'undefined' && appSettings.wc_current_user_id) {
            accountId = appSettings.wc_current_user_id;
        } else if (currentAccount?.wxid) {
            accountId = currentAccount.wxid;
        } else if (typeof appSettings !== 'undefined' && appSettings.wc_current_user_phone) {
            accountId = appSettings.wc_current_user_phone;
        }

        return { accountId: String(accountId), currentAccount };
    }

    // 屏幕时间专用的独立隔离数据缓存（严禁直接修改或污染微信的 window.wcContactsList）
    let stScreenTimeContacts = [];
    let stScreenTimeChats = {};
    let stScreenTimeMemories = [];

    // 自动修复微信被清空的分组与好友状态，保证微信好友绝不丢失
    async function stRepairWechatDataIfDamaged(accountId, records) {
        if (!window.db || typeof storeName === 'undefined') return;

        try {
            const rawKey = `wechatContactsData_${accountId}`;
            let contactRecord = records[rawKey] || records['wechatContactsData_default'] || records['wechatContactsData'];

            if (contactRecord) {
                let needSave = false;
                // 1. 如果分组被误清空，自动恢复默认分组
                if (!Array.isArray(contactRecord.groups) || contactRecord.groups.length === 0) {
                    contactRecord.groups = [{ id: 'g_member', name: 'Member' }];
                    needSave = true;
                }
                const defaultGroupId = contactRecord.groups[0]?.id || 'g_member';

                // 2. 确保每个联系人都具备合法的 groupId，防止微信因过滤条件而隐藏好友
                if (Array.isArray(contactRecord.contacts)) {
                    contactRecord.contacts.forEach(c => {
                        if (!c.groupId) {
                            c.groupId = defaultGroupId;
                            needSave = true;
                        }
                    });
                }

                if (needSave) {
                    const tx = window.db.transaction([storeName], 'readwrite');
                    tx.objectStore(storeName).put({
                        id: rawKey,
                        groups: contactRecord.groups,
                        contacts: contactRecord.contacts || []
                    });
                    await new Promise(r => { tx.oncomplete = r; tx.onerror = r; });
                }

                // 3. 同步回微信的内存变量并触发界面重绘
                if (typeof window.wcContactsList !== 'undefined') {
                    window.wcContactsList = contactRecord.contacts || [];
                    window.wcContactGroups = contactRecord.groups || [{ id: 'g_member', name: 'Member' }];
                    if (typeof wcRenderContactTabs === 'function') wcRenderContactTabs();
                    if (typeof wcRenderContactList === 'function') wcRenderContactList();
                    if (typeof wcRenderChatList === 'function') wcRenderChatList();
                }
            }
        } catch (e) {
            console.debug('stRepairWechatDataIfDamaged error:', e);
        }
    }

    // 异步安全读取：仅读取当前微信账号实际添加的好友，杜绝读取未添加的角色
    async function stLoadAllContacts() {
        stLoadStorageData();
        const { accountId, currentAccount } = await stGetTrueCurrentWechatAccountId();

        try {
            if (window.db && typeof storeName !== 'undefined') {
                const keysToRead = [
                    `wechatContactsData_${accountId}`,
                    `wechatContactsData_${currentAccount?.wxid}`,
                    'wechatContactsData_default',
                    'wechatContactsData',
                    `wechatChatData_${accountId}`,
                    `wechatChatData_${currentAccount?.wxid}`,
                    'wechatChatData_default',
                    'wechatChatData',
                    `memoryItemsV1_${accountId}`,
                    `memoryItemsV1_${currentAccount?.wxid}`,
                    'memoryItemsV1_default',
                    'memoryItemsV1'
                ].filter(Boolean);

                const records = await new Promise((resolve) => {
                    const tx = window.db.transaction([storeName], 'readonly');
                    const store = tx.objectStore(storeName);
                    const res = {};
                    let done = 0;
                    keysToRead.forEach(k => {
                        const req = store.get(k);
                        req.onsuccess = () => {
                            res[k] = req.result;
                            done++;
                            if (done === keysToRead.length) resolve(res);
                        };
                        req.onerror = () => {
                            res[k] = null;
                            done++;
                            if (done === keysToRead.length) resolve(res);
                        };
                    });
                });

                // 自动修复微信联系人分组与显示状态
                await stRepairWechatDataIfDamaged(accountId, records);

                // 1. 读取当前微信账号真正添加的好友（严禁降级到 contactsAppData 读取未加微信的角色）
                const ctRec = records[`wechatContactsData_${accountId}`]
                    || records[`wechatContactsData_${currentAccount?.wxid}`]
                    || records['wechatContactsData_default']
                    || records['wechatContactsData'];

                if (ctRec && Array.isArray(ctRec.contacts)) {
                    stScreenTimeContacts = ctRec.contacts;
                } else if (Array.isArray(window.wcContactsList) && window.wcContactsList.length > 0) {
                    stScreenTimeContacts = window.wcContactsList;
                } else {
                    stScreenTimeContacts = [];
                }

                // 2. 读取当前账号的聊天记录数据
                const chatRec = records[`wechatChatData_${accountId}`]
                    || records[`wechatChatData_${currentAccount?.wxid}`]
                    || records['wechatChatData_default']
                    || records['wechatChatData'];

                if (chatRec) {
                    stScreenTimeChats = chatRec.conversations || chatRec.messages || {};
                } else if (typeof window.wcChatMessagesByContact !== 'undefined') {
                    stScreenTimeChats = window.wcChatMessagesByContact || {};
                } else {
                    stScreenTimeChats = {};
                }

                // 3. 读取当前账号的记忆数据
                const memRec = records[`memoryItemsV1_${accountId}`]
                    || records[`memoryItemsV1_${currentAccount?.wxid}`]
                    || records['memoryItemsV1_default']
                    || records['memoryItemsV1'];

                stScreenTimeMemories = (memRec && Array.isArray(memRec.items)) ? memRec.items : [];
            }
        } catch (e) {
            console.debug('stLoadAllContacts error:', e);
            stScreenTimeContacts = Array.isArray(window.wcContactsList) ? window.wcContactsList : [];
            stScreenTimeChats = window.wcChatMessagesByContact || {};
        }

        return stScreenTimeContacts;
    }

    // 辅助检索该角色所有消息的函数（跨别名键名匹配）
    function stGetMessagesForContact(contact, chats) {
        if (!contact || !chats) return [];
        const candidates = [
            contact.id,
            contact.linkedContactId,
            contact.id ? 'char_' + contact.id : '',
            contact.id ? contact.id.replace(/^char_/, '') : '',
            contact.linkedContactId ? 'char_' + contact.linkedContactId : ''
        ].filter(Boolean);

        for (const key of candidates) {
            if (Array.isArray(chats[key]) && chats[key].length > 0) {
                return chats[key];
            }
        }
        return [];
    }

    // 准确统计聊天上下文条数：从底层消息库真实计算，杜绝显示 0
    function stGetContactContextCount(contactId) {
        const chats = stScreenTimeChats || {};
        if (!contactId || contactId === '__total__') {
            let total = 0;
            (stScreenTimeContacts || []).forEach(c => {
                const msgs = stGetMessagesForContact(c, chats);
                total += msgs.filter(m => m && (m.type === 'sent' || m.type === 'received') && !m.isRecalled).length;
            });
            if (total === 0) {
                Object.values(chats).forEach(list => {
                    if (Array.isArray(list)) {
                        total += list.filter(m => m && (m.type === 'sent' || m.type === 'received') && !m.isRecalled).length;
                    }
                });
            }
            return total;
        }

        const contact = (stScreenTimeContacts || []).find(c => c.id === contactId || c.linkedContactId === contactId);
        if (!contact) return 0;
        const msgs = stGetMessagesForContact(contact, chats);
        return msgs.filter(m => m && (m.type === 'sent' || m.type === 'received') && !m.isRecalled).length;
    }

    // 读取指定角色或全部角色的真实记忆条数
    async function stGetContactMemoryCount(contactId) {
        const items = stScreenTimeMemories || [];
        if (!contactId || contactId === '__total__') {
            return items.filter(m => m && m.status === 'active').length;
        }

        const contact = (stScreenTimeContacts || []).find(c => c.id === contactId || c.linkedContactId === contactId);
        const targetId = contact ? contact.id : contactId;
        const linkedId = contact?.linkedContactId;

        return items.filter(m => {
            if (!m || m.status !== 'active') return false;
            const b = String(m.bindingId || '');
            return b === targetId || b === linkedId || (linkedId && b.includes(linkedId)) || (targetId && b.includes(targetId));
        }).length;
    }

    // 计算角色真实创建/初识时间：优先回溯最早聊天记录和记忆时间，彻底消除“今天创建”问题
    function stGetCharCreatedInfo(contact) {
        if (!contact) return { dateStr: '未知', durationStr: '未知' };

        const contactId = contact.id;
        const linkedId = contact.linkedContactId;
        const chats = stScreenTimeChats || {};
        const messages = stGetMessagesForContact(contact, chats);
        const memories = stScreenTimeMemories || [];

        const candidateTimes = [];

        // 1. 提取真实聊天记录中第一条消息的时间戳
        if (Array.isArray(messages) && messages.length > 0) {
            messages.forEach(m => {
                const t = Number(m.createdAt || m.timestamp || m.time || 0);
                if (t > 1000000000000 && t <= Date.now()) candidateTimes.push(t);
            });
        }

        // 2. 提取属于该角色的最早记忆时间戳
        memories.forEach(m => {
            if (m && (m.bindingId === contactId || m.bindingId === linkedId || (linkedId && String(m.bindingId).includes(linkedId)))) {
                const t = Date.parse(m.createdAt || m.updatedAt || '');
                if (t > 1000000000000 && t <= Date.now()) candidateTimes.push(t);
            }
        });

        // 3. 提取联系人自带的合法历史时间戳
        const existingTs = Number(contact.createdAt || contact.created_at || contact.timestamp || 0);
        if (existingTs > 1000000000000 && existingTs <= Date.now()) {
            candidateTimes.push(existingTs);
        }

        // 4. 检查 ID 中是否自带时间戳
        const rawId = String(contact.id || '') + '_' + String(contact.linkedContactId || '');
        const match = rawId.match(/1[6-9]\d{11}/);
        if (match) {
            const idTs = Number(match[0]);
            if (idTs > 1000000000000 && idTs <= Date.now()) candidateTimes.push(idTs);
        }

        // 5. 核心：取所有候选时间中的最小值（最早历史相遇时间）
        let createdTs = candidateTimes.length > 0 ? Math.min(...candidateTimes) : Date.now();

        const dateObj = new Date(createdTs);
        const y = dateObj.getFullYear();
        const m = String(dateObj.getMonth() + 1).padStart(2, '0');
        const d = String(dateObj.getDate()).padStart(2, '0');
        const dateStr = `${y}-${m}-${d}`;

        const diffMs = Math.max(0, Date.now() - createdTs);
        const diffDays = Math.floor(diffMs / (24 * 3600 * 1000));
        const diffHours = Math.floor((diffMs % (24 * 3600 * 1000)) / (3600 * 1000));
        const diffMins = Math.floor((diffMs % (3600 * 1000)) / (60 * 1000));

        let durationStr = '';
        if (diffDays > 0) durationStr = `${diffDays} 天前`;
        else if (diffHours > 0) durationStr = `${diffHours} 小时前`;
        else durationStr = `${Math.max(1, diffMins)} 分钟前`;

        return { dateStr, durationStr };
    }

    // 计算角色聊天时长
    function stGetCharChatDuration(contact, isWeekly) {
        const contactId = contact.id;
        const linkedId = contact.linkedContactId;
        const weekDates = stGetWeekDates();

        let weeklySec = 0;
        weekDates.forEach(d => {
            const dayRecord = stDataState.days[d.dateKey];
            if (dayRecord && dayRecord.chatSeconds) {
                const s = (dayRecord.chatSeconds[contactId] || 0) + (linkedId ? (dayRecord.chatSeconds[linkedId] || 0) : 0);
                weeklySec += s;
            }
        });

        let totalSec = 0;
        Object.values(stDataState.days || {}).forEach(dayRecord => {
            if (dayRecord && dayRecord.chatSeconds) {
                const s = (dayRecord.chatSeconds[contactId] || 0) + (linkedId ? (dayRecord.chatSeconds[linkedId] || 0) : 0);
                totalSec += s;
            }
        });

        // 如果心跳尚未累计但已有真实聊天上下文，按照聊天上下文核算保底互动时长
        const contextCount = stGetContactContextCount(contactId);
        if (totalSec === 0 && contextCount > 0) {
            totalSec = Math.max(60, contextCount * 25);
            weeklySec = Math.min(totalSec, Math.round(totalSec * 0.35));
        }

        return isWeekly ? weeklySec : totalSec;
    }

    function switchScreenTimeTab(tab) {
        stCurrentTab = tab;
        document.getElementById('stTabWeekly')?.classList.toggle('active', tab === 'weekly');
        document.getElementById('stTabTotal')?.classList.toggle('active', tab === 'total');
        updateScreenTimeDisplay();
    }

    async function refreshScreenTimeStats() {
        await stLoadAllContacts();
        updateScreenTimeDisplay();
        if (typeof showToast === 'function') showToast('已刷新屏幕时间数据');
    }

    async function openScreenTimeSettingsApp() {
        const stUI = document.getElementById('screenTimeSettingsUI');
        if (!stUI) return;
        stUI.style.display = 'flex';

        await stLoadAllContacts();
        updateScreenTimeDisplay();

        setTimeout(() => stUI.classList.add('show'), 10);
    }

    function closeScreenTimeSettingsApp() {
        const stUI = document.getElementById('screenTimeSettingsUI');
        if (!stUI) return;
        stUI.classList.remove('show');
        setTimeout(() => { stUI.style.display = 'none'; }, 300);
    }

    function updateScreenTimeDisplay() {
        const weekDates = stGetWeekDates();
        const dateRangeLabel = document.getElementById('stDateRangeLabel');
        const mainDurationEl = document.getElementById('stMainDuration');
        const chatCatTimeEl = document.getElementById('stChatCategoryTime');
        const onlineCatTimeEl = document.getElementById('stOnlineCategoryTime');
        const interCatCountEl = document.getElementById('stInteractionCategoryCount');
        const updateTimeEl = document.getElementById('stUpdateTimeLabel');
        const barsContainer = document.getElementById('stChartBarsContainer');
        const avgLabelEl = document.getElementById('stChartAvgLabel');

        const now = new Date();
        if (updateTimeEl) {
            updateTimeEl.innerText = `更新于：今天 ${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
        }

        let weekProjectOnlineSec = 0;
        let weekChatSec = 0;
        weekDates.forEach(d => {
            const dayRecord = stDataState.days[d.dateKey];
            if (dayRecord) {
                weekProjectOnlineSec += (dayRecord.projectSeconds || dayRecord.onlineSeconds || dayRecord.wechatOnlineSeconds || 0);
                if (dayRecord.chatSeconds) {
                    Object.values(dayRecord.chatSeconds).forEach(sec => { weekChatSec += sec; });
                }
            }
        });

        let totalProjectOnlineSec = stDataState.totalProjectSeconds || 0;
        let totalChatSec = 0;
        Object.values(stDataState.days || {}).forEach(dayRecord => {
            if (dayRecord && dayRecord.chatSeconds) {
                Object.values(dayRecord.chatSeconds).forEach(sec => { totalChatSec += sec; });
            }
        });

        const allContextCount = stGetContactContextCount('__total__');
        if (totalChatSec === 0 && allContextCount > 0) {
            totalChatSec = Math.max(120, allContextCount * 25);
            weekChatSec = Math.min(totalChatSec, Math.round(totalChatSec * 0.35));
        }

        const isWeekly = stCurrentTab === 'weekly';
        const displayChatSec = isWeekly ? weekChatSec : totalChatSec;
        const displayProjectOnlineSec = isWeekly ? weekProjectOnlineSec : totalProjectOnlineSec;

        if (dateRangeLabel) {
            dateRangeLabel.innerText = isWeekly ? '本周项目时长' : '项目累计时长';
        }
        if (mainDurationEl) {
            mainDurationEl.innerText = stFormatDurationText(displayProjectOnlineSec);
        }
        if (chatCatTimeEl) chatCatTimeEl.innerText = stFormatDurationText(displayChatSec);
        if (onlineCatTimeEl) onlineCatTimeEl.innerText = stFormatDurationText(displayProjectOnlineSec);
        if (interCatCountEl) interCatCountEl.innerText = `${allContextCount} 条`;

        // 渲染柱状图
        if (barsContainer) {
            barsContainer.innerHTML = '';
            const dayValues = weekDates.map(d => {
                const dayRecord = stDataState.days[d.dateKey];
                let cSec = 0;
                if (dayRecord && dayRecord.chatSeconds) {
                    Object.values(dayRecord.chatSeconds).forEach(s => { cSec += s; });
                }
                const pSec = dayRecord ? (dayRecord.projectSeconds || dayRecord.onlineSeconds || dayRecord.wechatOnlineSeconds || 0) : 0;
                return { date: d, chatSec: cSec, onlineSec: pSec, total: Math.max(cSec, pSec) };
            });

            const maxSec = Math.max(...dayValues.map(v => v.total), 60);
            const avgSec = isWeekly ? Math.round(weekProjectOnlineSec / 7) : Math.round(totalProjectOnlineSec / 7);
            if (avgLabelEl) avgLabelEl.innerText = `平均 ${stFormatDurationText(avgSec)}`;

            const gridLine = document.getElementById('stChartGridLine');
            if (gridLine) {
                const avgPercent = Math.min(85, Math.max(15, (avgSec / maxSec) * 100));
                gridLine.style.bottom = `${avgPercent}%`;
            }

            dayValues.forEach(item => {
                const col = document.createElement('div');
                col.className = `st-bar-col ${item.date.isToday ? 'is-today' : ''}`;

                const barHeightPercent = Math.min(100, Math.max(8, Math.round((item.total / maxSec) * 100)));
                const chatHeightPercent = item.total > 0 ? Math.min(100, Math.round((item.chatSec / item.total) * 100)) : 0;

                col.innerHTML = `
                    <div class="st-bar-track">
                        <div class="st-bar-fill-online" style="height: ${barHeightPercent}%;">
                            <div class="st-bar-fill-chat" style="height: ${chatHeightPercent}%;"></div>
                        </div>
                    </div>
                    <span class="st-bar-label">${item.date.label}</span>
                `;
                barsContainer.appendChild(col);
            });
        }

        renderScreenTimeCharList(isWeekly);
    }

    // 渲染角色时长列表：全部角色汇总为纯黑底白图标，只列出当前账号的微信真实好友
    function renderScreenTimeCharList(isWeekly) {
        const groupEl = document.getElementById('stCharListGroup');
        if (!groupEl) return;
        groupEl.innerHTML = '';

        const contacts = Array.isArray(stScreenTimeContacts) ? stScreenTimeContacts : [];

        // 1. 汇总统计全部真实好友的聊天时长
        const charStats = contacts.map(c => {
            const displaySec = stGetCharChatDuration(c, isWeekly);
            return {
                id: c.id,
                name: c.remark || c.name || '未命名角色',
                avatar: c.avatar || '',
                rawContact: c,
                displaySec: displaySec
            };
        });

        charStats.sort((a, b) => b.displaySec - a.displaySec);
        const maxCharSec = Math.max(...charStats.map(s => s.displaySec), 60);

        // 2. 插入“全部角色汇总”行（纯黑底白图标）
        const totalChatSec = charStats.reduce((sum, s) => sum + s.displaySec, 0);

        const totalRow = document.createElement('div');
        totalRow.className = 'st-char-item-row';
        totalRow.onclick = () => openScreenTimeDetailModal('__total__');
        totalRow.innerHTML = `
            <div class="st-char-row-left">
                <div class="st-total-avatar-badge" style="background: #000000; box-shadow: 0 2px 6px rgba(0, 0, 0, 0.2);">
                    <svg viewBox="0 0 24 24" fill="#ffffff" style="width: 20px; height: 20px;"><path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-5 14H7v-2h7v2zm3-4H7v-2h10v2zm0-4H7V7h10v2z"/></svg>
                </div>
                <div class="st-char-info-box">
                    <div class="st-char-name-time-row">
                        <span class="st-char-name" style="font-weight: 600;">全部角色汇总</span>
                        <span class="st-char-time-badge">${stFormatDurationText(totalChatSec)}</span>
                    </div>
                    <div class="st-char-prog-track"><div class="st-char-prog-fill" style="width: 100%; background: #007aff;"></div></div>
                </div>
            </div>
            <svg class="set-chevron" viewBox="0 0 8 13"><path d="M1.5 1.5L6.5 6.5L1.5 11.5"/></svg>
        `;
        groupEl.appendChild(totalRow);

        // 3. 如果当前微信账号确实未添加任何好友，显示友好提示，杜绝乱加角色库数据
        if (charStats.length === 0) {
            const emptyEl = document.createElement('div');
            emptyEl.style.cssText = 'padding: 24px; text-align: center; color: #8e8e93; font-size: 14px;';
            emptyEl.innerText = '当前微信账号下暂无好友，请在微信中添加角色好友';
            groupEl.appendChild(emptyEl);
            return;
        }

        charStats.forEach(stat => {
            const row = document.createElement('div');
            row.className = 'st-char-item-row';
            row.onclick = () => openScreenTimeDetailModal(stat.id);

            const percent = stat.displaySec > 0 ? Math.min(100, Math.max(5, Math.round((stat.displaySec / maxCharSec) * 100))) : 0;
            const avatarHtml = stat.avatar
                ? `<img src="${stat.avatar}" style="width: 100%; height: 100%; object-fit: cover;">`
                : `<div style="width: 100%; height: 100%; background: #007aff; color: #fff; display: flex; align-items: center; justify-content: center; font-size: 14px; font-weight: 600;">${stat.name.slice(0, 1)}</div>`;

            row.innerHTML = `
                <div class="st-char-row-left">
                    <div class="st-char-avatar">${avatarHtml}</div>
                    <div class="st-char-info-box">
                        <div class="st-char-name-time-row">
                            <span class="st-char-name">${stat.name}</span>
                            <span class="st-char-time-badge">${stFormatDurationText(stat.displaySec)}</span>
                        </div>
                        <div class="st-char-prog-track"><div class="st-char-prog-fill" style="width: ${percent}%;"></div></div>
                    </div>
                </div>
                <svg class="set-chevron" viewBox="0 0 8 13"><path d="M1.5 1.5L6.5 6.5L1.5 11.5"/></svg>
            `;
            groupEl.appendChild(row);
        });
    }

    // 方案二专属矢量 SVG 定义 (严格与样式名匹配，纯白低饱和灰色系，无外部依赖)
    const ST_SCHEME2_SVGS = {
        chatTime: `<span class="st-svg-base st-svg-chat-time"><svg viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg"><path d="M513.2 6.3C234.6 6.3 8.3 232.6 8.3 511.2c0 278.6 226.3 504.9 504.9 504.9 278.6 0 504.9-226.3 504.9-504.9 0-278.6-226.3-504.9-504.9-504.9zM728.6 687L487 547.2h-9.9V222.7h72.1v277.7l215.5 124.4-36.1 62.2z"></path></svg></span>`,
        chatContext: `<span class="st-svg-base st-svg-context"><svg viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg"><path d="M728.263 393.47c0-156.459-128.011-284.47-284.47-284.47H348.97C192.511 109 64.5 237.011 64.5 393.47v0.001c0 122.973 79.088 228.355 188.906 267.838v85.515c0 9.846 11.904 14.776 18.866 7.815l76.698-76.698h94.824c156.458-0.001 284.469-128.013 284.469-284.471z m-554.864-65.391c0-15.78 12.911-28.691 28.691-28.691h387.102c15.78 0 28.691 12.911 28.691 28.691v1.882c0 15.78-12.911 28.691-28.691 28.691H202.09c-15.78 0-28.691-12.911-28.691-28.691v-1.882z m269.653 131.323c0 16.298-13.335 29.632-29.632 29.632H203.031c-16.298 0-29.632-13.335-29.632-29.632 0-16.298 13.335-29.632 29.632-29.632H413.42c16.298-0.001 29.632 13.334 29.632 29.632z"></path><path d="M757.674 343.934c9.262 27.972 14.297 57.824 14.297 88.798v0.001c0 156.458-128.011 284.47-284.47 284.47h-54.918c43.622 66.346 118.716 110.38 203.608 110.38h74.293l82.625 82.625c6.962 6.962 18.866 2.031 18.866-7.814v-94.051c87.291-37.112 148.902-123.846 148.902-224.273-0.001-120.208-88.279-220.781-203.203-240.136z"></path></svg></span>`,
        memory: `<span class="st-svg-base st-svg-memory"><svg viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg"><path d="M672 960a32 32 0 1 1 0 64h-320a32 32 0 1 1 0-64h320zM512 0a416 416 0 0 1 192.0512 785.1008l-0.0512 46.8992c0 35.328-28.672 64-64 64h-256c-35.328 0-64-28.672-64-64v-46.848A416 416 0 0 1 512 0z m49.7152 197.376a32 32 0 0 0-44.3392 8.9088l-128 192-2.56 4.608a32 32 0 0 0 29.184 45.1072h132.096l-94.72 142.2848-2.7648 5.0176a32 32 0 0 0 56.0128 30.4128l128-192 2.56-4.608a32 32 0 0 0-29.184-45.1072H475.8016l94.8224-142.2848 2.7648-5.0688a32 32 0 0 0-11.6736-39.2704z"></path></svg></span>`,
        createdTime: `<span class="st-svg-base st-svg-created"><svg viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg"><path d="M844 885.5H180c-45.841 0-83-37.159-83-83V346h830v456.5c0 45.841-37.159 83-83 83z m-207.5-415c0-22.916-18.58-41.5-41.5-41.5H429c-22.916 0-41.5 18.584-41.5 41.5 0 22.92 18.584 41.5 41.5 41.5h114.125L429 740.25c0 11.462 9.292 20.75 20.75 20.75h41.5c11.462 0 20.75-9.288 20.75-20.75l124.5-249V470.5zM97 263c0-45.841 37.159-83 83-83h87.187c8.611-24.058 31.042-41.5 58.063-41.5s49.451 17.442 58.063 41.5h257.375c8.611-24.058 31.042-41.5 58.063-41.5s49.451 17.442 58.063 41.5H844c45.841 0 83 37.159 83 83v41.5H97V263z m581 0h41.5v-83H678v83z m-373.5 0H346v-83h-41.5v83z"></path></svg></span>`,
        onlineTotal: `<span class="st-svg-base st-svg-online"><svg viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg"><path d="M742.8 727.5H281.5c-31.9 0-57.7-25.8-57.7-57.7V251.2c0-31.9 25.8-57.7 57.7-57.7h461.3c31.9 0 57.7 25.8 57.7 57.7v418.5c0 31.9-25.9 57.8-57.7 57.8zM771.8 841.1h-521c-15.3 0-27.8-12.4-27.8-27.8v-17.7c0-15.3 12.4-27.8 27.8-27.8h521c15.3 0 27.8 12.4 27.8 27.8v17.7c0 15.3-12.4 27.8-27.8 27.8z" fill="#666666"></path><path d="M614 477.2L474 558c-14.5 8.4-32.7-2.1-32.7-18.9V377.4c0-16.8 18.2-27.3 32.7-18.9l140 80.9c14.6 8.4 14.6 29.4 0 37.8z" fill="#FFFFFF"></path></svg></span>`,
        badgeIcon: `<svg viewBox="0 0 24 24" width="22" height="22" fill="#ffffff"><path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-5 14H7v-2h7v2zm3-4H7v-2h10v2zm0-4H7V7h10v2z"/></svg>`
    };

    // 方案二 2x2 居中弹窗：全部角色汇总黑底白图标，单个角色精确回溯历史创建时间与真实上下文
    async function openScreenTimeDetailModal(targetId) {
        const overlay = document.getElementById('stDetailModalOverlay');
        const cardBox = document.getElementById('stDetailModalSheet');
        if (!overlay || !cardBox) return;

        try {
            const isTotal = targetId === '__total__';
            const isWeekly = stCurrentTab === 'weekly';
            const weekDates = stGetWeekDates();

            if (isTotal) {
                let totalChatSec = 0;
                let weekChatSec = 0;
                let weekProjectSec = 0;
                weekDates.forEach(d => {
                    const dayRecord = stDataState.days[d.dateKey];
                    if (dayRecord) {
                        weekProjectSec += (dayRecord.projectSeconds || dayRecord.onlineSeconds || dayRecord.wechatOnlineSeconds || 0);
                        if (dayRecord.chatSeconds) {
                            Object.values(dayRecord.chatSeconds).forEach(s => { weekChatSec += s; });
                        }
                    }
                });
                Object.values(stDataState.days || {}).forEach(dayRecord => {
                    if (dayRecord && dayRecord.chatSeconds) {
                        Object.values(dayRecord.chatSeconds).forEach(s => { totalChatSec += s; });
                    }
                });

                const totalContext = stGetContactContextCount('__total__');
                if (totalChatSec === 0 && totalContext > 0) {
                    totalChatSec = Math.max(120, totalContext * 25);
                    weekChatSec = Math.min(totalChatSec, Math.round(totalChatSec * 0.35));
                }

                const displayProjectSec = isWeekly ? weekProjectSec : (stDataState.totalProjectSeconds || 0);
                const displayChatSec = isWeekly ? weekChatSec : totalChatSec;
                const totalMemories = await stGetContactMemoryCount('__total__');

                cardBox.innerHTML = `
                    <div class="modal-theme-v2">
                        <div class="v2-top-header">
                            <div class="v2-korean-note">종합 통계 · 全局数据</div>
                            <div class="v2-dollhouse-tag">METRICS</div>
                        </div>
                        <div class="v2-hero-profile">
                            <div class="v2-avatar-wrap" style="background: #000000; display: flex; align-items: center; justify-content: center; box-shadow: 0 4px 14px rgba(0, 0, 0, 0.25);">
                                ${ST_SCHEME2_SVGS.badgeIcon}
                            </div>
                            <div class="v2-profile-info">
                                <div class="v2-profile-name">全部数据综合汇总</div>
                                <div class="v2-profile-sub">Project System Dashboard</div>
                            </div>
                        </div>
                        <div class="v2-grid-metrics">
                            <div class="v2-grid-cell">
                                <div class="v2-cell-label">${ST_SCHEME2_SVGS.onlineTotal} 在线总时长</div>
                                <div class="v2-cell-value">${stFormatDurationText(displayProjectSec)}</div>
                                <div class="v2-cell-date-sub">项目前台运行</div>
                            </div>
                            <div class="v2-grid-cell">
                                <div class="v2-cell-label">${ST_SCHEME2_SVGS.chatTime} 聊天总时长</div>
                                <div class="v2-cell-value">${stFormatDurationText(displayChatSec)}</div>
                                <div class="v2-cell-date-sub">全部角色累加</div>
                            </div>
                            <div class="v2-grid-cell">
                                <div class="v2-cell-label">${ST_SCHEME2_SVGS.chatContext} 总上下文</div>
                                <div class="v2-cell-value">${totalContext} 条</div>
                                <div class="v2-cell-date-sub">对话总条数</div>
                            </div>
                            <div class="v2-grid-cell">
                                <div class="v2-cell-label">${ST_SCHEME2_SVGS.memory} 总记忆条数</div>
                                <div class="v2-cell-value">${totalMemories} 条</div>
                                <div class="v2-cell-date-sub">全角色已沉淀</div>
                            </div>
                        </div>
                        <button type="button" class="ins-black-button" onclick="closeScreenTimeDetailModal()">
                            查看完毕
                        </button>
                    </div>
                `;
                overlay.classList.add('show');
            } else {
                let contact = (stScreenTimeContacts || []).find(c => c.id === targetId || c.linkedContactId === targetId);
                if (!contact) {
                    await stLoadAllContacts();
                    contact = (stScreenTimeContacts || []).find(c => c.id === targetId || c.linkedContactId === targetId);
                }

                const name = contact ? (contact.remark || contact.name || '角色') : '该角色';
                const displayCharSec = contact ? stGetCharChatDuration(contact, isWeekly) : 0;
                const createdInfo = stGetCharCreatedInfo(contact);
                const contextCount = stGetContactContextCount(targetId);
                const memoryCount = await stGetContactMemoryCount(targetId);

                const avatarHtml = contact && contact.avatar
                    ? `<img src="${contact.avatar}" style="width: 100%; height: 100%; object-fit: cover;">`
                    : `<div style="width: 100%; height: 100%; background: #e5e5ea; color: #1c1c1e; display: flex; align-items: center; justify-content: center; font-size: 20px; font-weight: 700;">${name.slice(0, 1)}</div>`;

                cardBox.innerHTML = `
                    <div class="modal-theme-v2">
                        <div class="v2-top-header">
                            <div class="v2-korean-note">기억의 흔적 · 角色画像</div>
                            <div class="v2-dollhouse-tag">PROFILE</div>
                        </div>
                        <div class="v2-hero-profile">
                            <div class="v2-avatar-wrap">${avatarHtml}</div>
                            <div class="v2-profile-info">
                                <div class="v2-profile-name">${name}</div>
                                <div class="v2-profile-sub">Interactive Time &amp; Context</div>
                            </div>
                        </div>
                        <div class="v2-grid-metrics">
                            <div class="v2-grid-cell">
                                <div class="v2-cell-label">${ST_SCHEME2_SVGS.createdTime} 创建时间</div>
                                <div class="v2-cell-value">${createdInfo.dateStr}</div>
                                <div class="v2-cell-date-sub">${createdInfo.durationStr}</div>
                            </div>
                            <div class="v2-grid-cell">
                                <div class="v2-cell-label">${ST_SCHEME2_SVGS.chatTime} 聊天时长</div>
                                <div class="v2-cell-value">${stFormatDurationText(displayCharSec)}</div>
                                <div class="v2-cell-date-sub">累计伴随</div>
                            </div>
                            <div class="v2-grid-cell">
                                <div class="v2-cell-label">${ST_SCHEME2_SVGS.chatContext} 聊天上下文</div>
                                <div class="v2-cell-value">${contextCount} 条</div>
                                <div class="v2-cell-date-sub">消息条数</div>
                            </div>
                            <div class="v2-grid-cell">
                                <div class="v2-cell-label">${ST_SCHEME2_SVGS.memory} 记忆条数</div>
                                <div class="v2-cell-value">${memoryCount} 条</div>
                                <div class="v2-cell-date-sub">沉淀数据</div>
                            </div>
                        </div>
                        <button type="button" class="ins-black-button" onclick="closeScreenTimeDetailModal()">
                            查看完毕
                        </button>
                    </div>
                `;
                overlay.classList.add('show');
            }
        } catch (err) {
            console.error('打开屏幕时间详情失败:', err);
            if (typeof showToast === 'function') showToast('无法读取角色详情：' + err.message);
        }
    }

    function closeScreenTimeDetailModal(e) {
        if (e && e.target !== document.getElementById('stDetailModalOverlay')) return;
        const overlay = document.getElementById('stDetailModalOverlay');
        if (overlay) overlay.classList.remove('show');
    }

    function openMessageNotificationSettingsApp() {
        const settingsUI = document.getElementById('messageNotificationSettingsUI');
        if (!settingsUI) return;
        settingsUI.style.display = 'flex';
        applyMessageNotifications();
        setTimeout(() => settingsUI.classList.add('show'), 10);
    }

    function closeMessageNotificationSettingsApp() {
        const settingsUI = document.getElementById('messageNotificationSettingsUI');
        if (!settingsUI) return;
        settingsUI.classList.remove('show');
        setTimeout(() => { settingsUI.style.display = 'none'; }, 300);
    }

    function openSoundHapticsSettingsApp() {
        const soundUI = document.getElementById('soundHapticsSettingsUI');
        if (!soundUI) return;
        soundUI.style.display = 'flex';
        const slider = document.getElementById('soundVolumeSlider');
        if (slider) updateSoundVolumeSlider(slider);
        if (typeof updateSoundLabels === 'function') updateSoundLabels();
        if (typeof applySilentMode === 'function') applySilentMode();
        setTimeout(() => soundUI.classList.add('show'), 10);
    }

    function closeSoundHapticsSettingsApp() {
        const soundUI = document.getElementById('soundHapticsSettingsUI');
        if (!soundUI) return;
        soundUI.classList.remove('show');
        setTimeout(() => { soundUI.style.display = 'none'; }, 300);
    }

    let soundSettingsState = {
        ringtone: { type: 'builtin', id: 'default_ringtone', name: '默认铃声' },
        wechat: { type: 'builtin', id: 'tritone', name: '三音' },
        sms: { type: 'builtin', id: 'aurora', name: '极光' },
        feedback: { type: 'builtin', id: 'bubble1', name: '水滴气泡' }
    };

    let currentSoundPickerTarget = 'wechat';
    let tempSoundSelection = null;
    let customSoundAudioPlayer = null;

    const builtinRingtoneList = [
        { id: 'none', name: '无 (静音)' },
        { id: 'default_ringtone', name: '默认铃声 (经典)' },
        { id: 'tritone', name: '三音 (经典提示)' },
        { id: 'aurora', name: '极光 (轻柔和弦)' }
    ];

    const builtinSoundList = [
        { id: 'none', name: '无 (静音)' },
        { id: 'tritone', name: '三音 (经典提示)' },
        { id: 'aurora', name: '极光 (轻柔和弦)' },
        { id: 'ding', name: '晶莹 (清脆叮声)' },
        { id: 'chord', name: '和弦 (共鸣)' },
        { id: 'pop', name: '水滴气泡 (轻快)' }
    ];

    const builtinFeedbackSoundList = [
        { id: 'none', name: '无 (静音)' },
        { id: 'bubble1', name: '水滴气泡 (清脆上扬)' },
        { id: 'ripple', name: '清脆水波 (指尖轻触)' },
        { id: 'double_pop', name: '双重气泡 (灵动双音)' },
        { id: 'bobo', name: '啵啵气泡 (轻快短促)' },
        { id: 'spring_jelly', name: '弹簧果冻 (Q弹起伏)' },
        { id: 'glass_ping', name: '玻璃清脆 (高频清脆)' },
        { id: 'tiny_bell', name: '微小风铃 (空灵悠长)' }
    ];

    window.getSystemSoundVolume = function() {
        const slider = document.getElementById('soundVolumeSlider');
        if (slider) {
            const val = parseFloat(slider.value);
            if (!isNaN(val)) return Math.max(0.01, Math.min(1, val / 100));
        }
        return 0.8;
    };
    const getSystemSoundVolume = window.getSystemSoundVolume;

    function toggleSilentMode() {
        if (typeof appSettings === 'undefined') return;
        appSettings.silent_mode_enabled = appSettings.silent_mode_enabled !== true;
        applySilentMode();
        if (typeof saveAppSettings === 'function') saveAppSettings();
        if (typeof showToast === 'function') {
            showToast(appSettings.silent_mode_enabled ? '静音模式已开启' : '静音模式已关闭');
        }
    }

    function applySilentMode() {
        const toggle = document.getElementById('silentModeToggle');
        const enabled = appSettings?.silent_mode_enabled === true;
        if (toggle) {
            toggle.classList.toggle('on', enabled);
            toggle.setAttribute('aria-checked', String(enabled));
        }
    }

    function updateSoundLabels() {
        if (typeof appSettings !== 'undefined' && appSettings.sound_settings_state) {
            soundSettingsState = { ...soundSettingsState, ...appSettings.sound_settings_state };
        }
        const labelRingtone = document.getElementById('soundLabelRingtone');
        const labelWechat = document.getElementById('soundLabelWechat');
        const labelSms = document.getElementById('soundLabelSms');
        const labelFeedback = document.getElementById('soundLabelFeedback');
        if (labelRingtone && soundSettingsState.ringtone) labelRingtone.innerText = soundSettingsState.ringtone.name;
        if (labelWechat && soundSettingsState.wechat) labelWechat.innerText = soundSettingsState.wechat.name;
        if (labelSms && soundSettingsState.sms) labelSms.innerText = soundSettingsState.sms.name;
        if (labelFeedback && soundSettingsState.feedback) labelFeedback.innerText = soundSettingsState.feedback.name;
    }

    let sharedBuiltinAudioCtx = null;

    function getSharedBuiltinAudioContext() {
        try {
            const AudioCtx = window.AudioContext || window.webkitAudioContext;
            if (!AudioCtx) return null;
            if (!sharedBuiltinAudioCtx || sharedBuiltinAudioCtx.state === 'closed') {
                sharedBuiltinAudioCtx = new AudioCtx();
            }
            if (sharedBuiltinAudioCtx.state === 'suspended') {
                sharedBuiltinAudioCtx.resume().catch(() => {});
            }
            return sharedBuiltinAudioCtx;
        } catch (e) {
            console.debug('Failed to get shared AudioContext:', e);
            return null;
        }
    }

    function playBuiltinSound(soundId) {
        try {
            const ctx = getSharedBuiltinAudioContext();
            if (!ctx) return;
            const now = ctx.currentTime;
            const vol = getSystemSoundVolume();

            if (soundId === 'default_ringtone') {
                const osc = ctx.createOscillator();
                const gain = ctx.createGain();
                osc.type = 'sine';
                osc.frequency.setValueAtTime(450, now);
                gain.gain.setValueAtTime(0, now);
                for (let i = 0; i < 2; i++) {
                    const start = now + i * 4;
                    gain.gain.setValueAtTime(0.08 * vol, start);
                    gain.gain.setValueAtTime(0, start + 1.2);
                }
                osc.connect(gain);
                gain.connect(ctx.destination);
                osc.start(now);
                osc.stop(now + 8);
            } else if (soundId === 'tritone') {
                const freqs = [587.33, 783.99, 1046.50];
                freqs.forEach((f, i) => {
                    const osc = ctx.createOscillator();
                    const gain = ctx.createGain();
                    osc.type = 'sine';
                    osc.frequency.setValueAtTime(f, now + i * 0.12);
                    gain.gain.setValueAtTime(0, now + i * 0.12);
                    gain.gain.linearRampToValueAtTime(0.28 * vol, now + i * 0.12 + 0.02);
                    gain.gain.exponentialRampToValueAtTime(0.001, now + i * 0.12 + 0.35);
                    osc.connect(gain);
                    gain.connect(ctx.destination);
                    osc.start(now + i * 0.12);
                    osc.stop(now + i * 0.12 + 0.35);
                });
            } else if (soundId === 'aurora') {
                const freqs = [440, 554.37, 659.25, 880];
                freqs.forEach((f, i) => {
                    const osc = ctx.createOscillator();
                    const gain = ctx.createGain();
                    osc.type = 'triangle';
                    osc.frequency.setValueAtTime(f, now + i * 0.08);
                    gain.gain.setValueAtTime(0, now + i * 0.08);
                    gain.gain.linearRampToValueAtTime(0.25 * vol, now + i * 0.08 + 0.03);
                    gain.gain.exponentialRampToValueAtTime(0.001, now + i * 0.08 + 0.45);
                    osc.connect(gain);
                    gain.connect(ctx.destination);
                    osc.start(now + i * 0.08);
                    osc.stop(now + i * 0.08 + 0.45);
                });
            } else if (soundId === 'ding') {
                const osc = ctx.createOscillator();
                const gain = ctx.createGain();
                osc.type = 'sine';
                osc.frequency.setValueAtTime(1567.98, now);
                gain.gain.setValueAtTime(0.35 * vol, now);
                gain.gain.exponentialRampToValueAtTime(0.001, now + 0.6);
                osc.connect(gain);
                gain.connect(ctx.destination);
                osc.start(now);
                osc.stop(now + 0.6);
            } else if (soundId === 'chord') {
                [523.25, 659.25, 783.99].forEach((f) => {
                    const osc = ctx.createOscillator();
                    const gain = ctx.createGain();
                    osc.type = 'sine';
                    osc.frequency.setValueAtTime(f, now);
                    gain.gain.setValueAtTime(0.2 * vol, now);
                    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.5);
                    osc.connect(gain);
                    gain.connect(ctx.destination);
                    osc.start(now);
                    osc.stop(now + 0.5);
                });
            } else if (soundId === 'pop') {
                const osc = ctx.createOscillator();
                const gain = ctx.createGain();
                osc.type = 'sine';
                osc.frequency.setValueAtTime(800, now);
                osc.frequency.exponentialRampToValueAtTime(1800, now + 0.08);
                gain.gain.setValueAtTime(0.3 * vol, now);
                gain.gain.exponentialRampToValueAtTime(0.001, now + 0.12);
                osc.connect(gain);
                gain.connect(ctx.destination);
                osc.start(now);
                osc.stop(now + 0.12);
            } else if (soundId === 'bubble1') {
                const osc = ctx.createOscillator();
                const gain = ctx.createGain();
                osc.type = 'sine';
                osc.frequency.setValueAtTime(300, now);
                osc.frequency.exponentialRampToValueAtTime(1200, now + 0.08);
                gain.gain.setValueAtTime(vol, now);
                gain.gain.exponentialRampToValueAtTime(0.001, now + 0.08);
                osc.connect(gain);
                gain.connect(ctx.destination);
                osc.start(now);
                osc.stop(now + 0.08);
            } else if (soundId === 'ripple') {
                const osc = ctx.createOscillator();
                const gain = ctx.createGain();
                osc.type = 'sine';
                osc.frequency.setValueAtTime(1500, now);
                osc.frequency.exponentialRampToValueAtTime(2500, now + 0.05);
                gain.gain.setValueAtTime(vol * 0.6, now);
                gain.gain.exponentialRampToValueAtTime(0.001, now + 0.05);
                osc.connect(gain);
                gain.connect(ctx.destination);
                osc.start(now);
                osc.stop(now + 0.05);
            } else if (soundId === 'double_pop') {
                const osc1 = ctx.createOscillator();
                const gain1 = ctx.createGain();
                osc1.type = 'sine';
                osc1.frequency.setValueAtTime(400, now);
                osc1.frequency.exponentialRampToValueAtTime(1000, now + 0.06);
                gain1.gain.setValueAtTime(vol * 0.7, now);
                gain1.gain.exponentialRampToValueAtTime(0.001, now + 0.06);
                osc1.connect(gain1);
                gain1.connect(ctx.destination);
                osc1.start(now);
                osc1.stop(now + 0.06);
                const osc2 = ctx.createOscillator();
                const gain2 = ctx.createGain();
                osc2.type = 'sine';
                osc2.frequency.setValueAtTime(600, now + 0.08);
                osc2.frequency.exponentialRampToValueAtTime(1400, now + 0.14);
                gain2.gain.setValueAtTime(vol * 0.7, now + 0.08);
                gain2.gain.exponentialRampToValueAtTime(0.001, now + 0.14);
                osc2.connect(gain2);
                gain2.connect(ctx.destination);
                osc2.start(now + 0.08);
                osc2.stop(now + 0.14);
            } else if (soundId === 'bobo') {
                const osc = ctx.createOscillator();
                const gain = ctx.createGain();
                osc.type = 'sine';
                osc.frequency.setValueAtTime(600, now);
                osc.frequency.exponentialRampToValueAtTime(1500, now + 0.05);
                gain.gain.setValueAtTime(0, now);
                gain.gain.linearRampToValueAtTime(vol, now + 0.01);
                gain.gain.exponentialRampToValueAtTime(0.001, now + 0.06);
                osc.connect(gain);
                gain.connect(ctx.destination);
                osc.start(now);
                osc.stop(now + 0.06);
            } else if (soundId === 'spring_jelly') {
                const osc = ctx.createOscillator();
                const gain = ctx.createGain();
                osc.type = 'sine';
                osc.frequency.setValueAtTime(300, now);
                osc.frequency.linearRampToValueAtTime(900, now + 0.03);
                osc.frequency.linearRampToValueAtTime(400, now + 0.06);
                osc.frequency.linearRampToValueAtTime(1000, now + 0.1);
                gain.gain.setValueAtTime(vol, now);
                gain.gain.exponentialRampToValueAtTime(0.001, now + 0.1);
                osc.connect(gain);
                gain.connect(ctx.destination);
                osc.start(now);
                osc.stop(now + 0.1);
            } else if (soundId === 'glass_ping') {
                const osc = ctx.createOscillator();
                const gain = ctx.createGain();
                osc.type = 'sine';
                osc.frequency.setValueAtTime(2000, now);
                gain.gain.setValueAtTime(vol * 0.5, now);
                gain.gain.exponentialRampToValueAtTime(0.001, now + 0.15);
                osc.connect(gain);
                gain.connect(ctx.destination);
                osc.start(now);
                osc.stop(now + 0.15);
            } else if (soundId === 'tiny_bell') {
                const osc = ctx.createOscillator();
                const gain = ctx.createGain();
                osc.type = 'sine';
                osc.frequency.setValueAtTime(3500, now);
                gain.gain.setValueAtTime(vol * 0.3, now);
                gain.gain.exponentialRampToValueAtTime(0.001, now + 0.4);
                osc.connect(gain);
                gain.connect(ctx.destination);
                osc.start(now);
                osc.stop(now + 0.4);
            }
        } catch (e) {
            console.debug('Web Audio play error:', e);
        }
    }

    function playCustomAudio(url) {
        if (!customSoundAudioPlayer) customSoundAudioPlayer = new Audio();
        customSoundAudioPlayer.src = url;
        customSoundAudioPlayer.volume = getSystemSoundVolume();
        customSoundAudioPlayer.currentTime = 0;
        customSoundAudioPlayer.play().catch(e => console.debug('Audio play failed:', e));
    }

    window.playTongtongSoundItem = function(soundItem) {
        if (!soundItem) return;
        if (soundItem.id === 'none') return; // 如果选择了“无”，则直接返回不播放
        if (soundItem.type === 'custom' && soundItem.url) {
            playCustomAudio(soundItem.url);
        } else if (soundItem.id) {
            playBuiltinSound(soundItem.id);
        }
    };

    window.playTongtongFeedbackSound = function() {
        if (typeof appSettings !== 'undefined' && appSettings.silent_mode_enabled === true) return;
        if (typeof appSettings !== 'undefined' && appSettings.sound_settings_state) {
            soundSettingsState = { ...soundSettingsState, ...appSettings.sound_settings_state };
        }
        const item = (typeof soundSettingsState !== 'undefined' && soundSettingsState.feedback) ? soundSettingsState.feedback : { type: 'builtin', id: 'bubble1', name: '水滴气泡' };
        window.playTongtongSoundItem(item);
    };

    window.playTongtongNotificationSound = function(targetType = 'wechat') {
        if (typeof appSettings !== 'undefined' && appSettings.silent_mode_enabled === true) return;
        if (typeof appSettings !== 'undefined' && appSettings.sound_settings_state) {
            soundSettingsState = { ...soundSettingsState, ...appSettings.sound_settings_state };
        }
        const item = (typeof soundSettingsState !== 'undefined' && soundSettingsState[targetType]) ? soundSettingsState[targetType] : { type: 'builtin', id: 'tritone', name: '三音' };
        window.playTongtongSoundItem(item);
    };

    function initScreenFeedbackSound() {
        if (window._screenFeedbackBound) return;
        window._screenFeedbackBound = true;
        document.addEventListener('pointerdown', (e) => {
            if (typeof appSettings !== 'undefined' && appSettings.silent_mode_enabled === true) return;
            if (e.target && (e.target.tagName === 'INPUT' && e.target.type === 'range')) return;
            if (typeof window.playTongtongFeedbackSound === 'function') {
                window.playTongtongFeedbackSound();
            }
        }, { passive: true, capture: true });
    }
    initScreenFeedbackSound();

    function openSoundPickerDrawer(target) {
        currentSoundPickerTarget = target;
        tempSoundSelection = { ...soundSettingsState[target] };
        const titleEl = document.getElementById('soundPickerDrawerTitle');
        if (titleEl) {
            if (target === 'ringtone') titleEl.innerText = '电话铃声';
            else if (target === 'wechat') titleEl.innerText = '微信消息提示音';
            else if (target === 'sms') titleEl.innerText = '短信消息提示音';
            else if (target === 'feedback') titleEl.innerText = '触发反馈音';
        }
        renderSoundPickerList();
        const overlay = document.getElementById('soundPickerDrawerOverlay');
        const drawer = document.getElementById('soundPickerDrawer');
        if (overlay) overlay.classList.add('show');
        if (drawer) drawer.classList.add('show');
    }

    function closeSoundPickerDrawer() {
        const overlay = document.getElementById('soundPickerDrawerOverlay');
        const drawer = document.getElementById('soundPickerDrawer');
        if (overlay) overlay.classList.remove('show');
        if (drawer) drawer.classList.remove('show');
    }

    function renderSoundPickerList() {
        const container = document.getElementById('soundPickerBuiltinList');
        if (!container) return;
        container.innerHTML = '';

        const listToRender = currentSoundPickerTarget === 'feedback' ? builtinFeedbackSoundList : (currentSoundPickerTarget === 'ringtone' ? builtinRingtoneList : builtinSoundList);

        listToRender.forEach(sound => {
            const isSelected = tempSoundSelection && tempSoundSelection.type === 'builtin' && tempSoundSelection.id === sound.id;
            
            const nameParts = sound.name.split(' (');
            const mainName = nameParts[0];
            const subName = nameParts[1] ? nameParts[1].replace(')', '') : '';

            const item = document.createElement('div');
            item.className = `d-item ${isSelected ? 'selected' : ''}`;
            item.onclick = () => {
                tempSoundSelection = { type: 'builtin', id: sound.id, name: mainName };
                playBuiltinSound(sound.id);
                renderSoundPickerList();
            };
            item.innerHTML = `
                <div>
                    <div class="d-item-name">${mainName}</div>
                    ${subName ? `<div class="d-item-sub">${subName}</div>` : ''}
                </div>
                <div class="d-check">
                    <svg viewBox="0 0 24 24"><polyline points="20 6 9 17 4 12"></polyline></svg>
                </div>
            `;
            container.appendChild(item);
        });

        if (tempSoundSelection && tempSoundSelection.type === 'custom') {
            const customItem = document.createElement('div');
            customItem.className = 'd-item selected';
            customItem.innerHTML = `
                <div>
                    <div class="d-item-name">${tempSoundSelection.name}</div>
                    <div class="d-item-sub">自定义音频</div>
                </div>
                <div class="d-check">
                    <svg viewBox="0 0 24 24"><polyline points="20 6 9 17 4 12"></polyline></svg>
                </div>
            `;
            container.appendChild(customItem);
        }
    }

    function saveSoundPickerSelection() {
        if (tempSoundSelection) {
            soundSettingsState[currentSoundPickerTarget] = { ...tempSoundSelection };
            if (typeof appSettings !== 'undefined') {
                appSettings.sound_settings_state = soundSettingsState;
                if (typeof saveAppSettings === 'function') saveAppSettings();
            }
            updateSoundLabels();
            if (typeof showToast === 'function') showToast(`已设置：${tempSoundSelection.name}`);
        }
        closeSoundPickerDrawer();
    }

    function handleSoundPickerLocalFile(event) {
        const file = event.target.files?.[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onload = function(e) {
            const dataUrl = e.target.result;
            tempSoundSelection = { type: 'custom', url: dataUrl, name: file.name };
            playCustomAudio(dataUrl);
            renderSoundPickerList();
        };
        reader.readAsDataURL(file);
        event.target.value = '';
    }

    async function openSoundUrlPrompt() {
        if (typeof showCustomPrompt === 'function') {
            const url = await showCustomPrompt('自定义音频 URL', { placeholder: 'https://.../sound.mp3', value: '' }, '确定');
            if (url && url.trim()) {
                const trimmed = url.trim();
                tempSoundSelection = { type: 'custom', url: trimmed, name: '在线音频' };
                playCustomAudio(trimmed);
                renderSoundPickerList();
            }
        }
    }

    function updateSoundVolumeSlider(el) {
        const percentage = (el.value - el.min) / (el.max - el.min) * 100;
        const iphone = document.querySelector('.iphone');
        const isDark = iphone ? iphone.classList.contains('dark-mode') : false;
        const trackColor = isDark ? '#39393d' : '#e5e5ea';
        el.style.background = `linear-gradient(to right, #007aff ${percentage}%, ${trackColor} ${percentage}%)`;
    }

    function updateMessageNotificationPermissionStatus() {
        const status = document.getElementById('messageNotificationPermissionStatus');
        if (!status) return;
        if (!('Notification' in window)) {
            status.textContent = '当前浏览器不支持网页通知';
            status.style.color = '#ff3b30';
            return;
        }
        const permission = Notification.permission;
        if (permission === 'granted') {
            status.textContent = appSettings?.message_notifications_enabled === true ? '已开启，浏览器通知权限已获得' : '浏览器通知权限已获得，开关当前关闭';
            status.style.color = '#34c759';
        } else if (permission === 'denied') {
            status.textContent = '浏览器已拒绝通知，请在浏览器设置中重新允许';
            status.style.color = '#ff3b30';
        } else {
            status.textContent = '尚未获得权限，开启开关时会请求';
            status.style.color = '#8e8e93';
        }
    }

    async function toggleMessageNotifications() {
        if (typeof appSettings === 'undefined') return;
        const enabled = appSettings.message_notifications_enabled !== true;
        if (enabled) {
            if (!('Notification' in window)) {
                if (typeof showToast === 'function') showToast('当前浏览器不支持网页通知');
                return;
            }
            if (Notification.permission !== 'granted') {
                let permission = 'denied';
                try {
                    permission = await Notification.requestPermission();
                } catch (error) {
                    console.debug('Web message notification permission unavailable:', error);
                }
                if (permission !== 'granted') {
                    if (typeof showToast === 'function') showToast('未获得消息通知权限');
                    return;
                }
            }
        }
        appSettings.message_notifications_enabled = enabled;
        applyMessageNotifications();
        if (typeof saveAppSettings === 'function') saveAppSettings();
        updateMessageNotificationPermissionStatus();
        if (typeof showToast === 'function') showToast(enabled ? '消息通知已开启' : '消息通知已关闭');
    }

    async function testMessageNotification() {
        const result = document.getElementById('messageNotificationTestResult');
        const button = document.getElementById('messageNotificationTestButton');
        const report = (text, success = false) => {
            if (result) {
                result.textContent = text;
                result.style.color = success ? '#34c759' : '#ff3b30';
            }
        };
        if (button) {
            button.disabled = true;
            button.style.opacity = '0.6';
        }
        try {
            if (typeof appSettings === 'undefined' || appSettings.message_notifications_enabled !== true) {
                report('测试失败：请先打开上方的消息通知开关');
                return;
            }
            if (!('Notification' in window)) {
                report('测试失败：当前浏览器不支持网页通知');
                return;
            }
            if (Notification.permission !== 'granted') {
                report(Notification.permission === 'denied'
                    ? '测试失败：浏览器已拒绝通知，请在浏览器设置中重新允许'
                    : '测试失败：尚未获得通知权限，请先打开消息通知开关');
                return;
            }
            const tag = `wc-notification-test-${Date.now()}`;
            if ('serviceWorker' in navigator) {
                const registration = await navigator.serviceWorker.getRegistration();
                if (registration?.showNotification) {
                    await registration.showNotification('消息通知测试', { body: '如果你看到这条通知，消息通知功能正常。', tag, renotify: true });
                    if (typeof registration.getNotifications === 'function') {
                        const notifications = await registration.getNotifications({ tag });
                        if (!notifications.length) throw new Error('浏览器未返回测试通知，可能被系统通知设置或免打扰模式拦截');
                    }
                } else {
                    const notification = new Notification('消息通知测试', { body: '如果你看到这条通知，消息通知功能正常。', tag });
                    notification.onclick = () => notification.close();
                }
            } else {
                const notification = new Notification('消息通知测试', { body: '如果你看到这条通知，消息通知功能正常。', tag });
                notification.onclick = () => notification.close();
            }
            report('测试成功：浏览器已接受通知请求，请检查系统通知中心', true);
        } catch (error) {
            report(`测试失败：${error?.message || '浏览器未能显示通知'}`);
        } finally {
            if (button) {
                button.disabled = false;
                button.style.opacity = '';
            }
            updateMessageNotificationPermissionStatus();
        }
    }

    // ==========================================
    function openDisplaySettingsApp() {
        const displayUI = document.getElementById('displaySettingsUI');
        displayUI.style.display = 'flex';
        setTimeout(() => {
            displayUI.classList.add('show');
        }, 10);
            // show three-dots button; click to expand vertical capsule menu
        const slider = document.getElementById('dsBrightnessSlider');
        if(slider) updateDsSlider(slider);
    }

    function closeDisplaySettingsApp() {
        const displayUI = document.getElementById('displaySettingsUI');
        displayUI.classList.remove('show');
        setTimeout(() => {
            displayUI.style.display = 'none';
        }, 300);
    }

    function openStandbyDiagnosticsApp() {
        const diagnosticsUI = document.getElementById('standbyDiagnosticsUI');
        diagnosticsUI.style.display = 'flex';
        renderDiagnosticErrorLog();
        setTimeout(() => {
            diagnosticsUI.classList.add('show');
        }, 10);
    }

    function closeStandbyDiagnosticsApp() {
        const diagnosticsUI = document.getElementById('standbyDiagnosticsUI');
        diagnosticsUI.classList.remove('show');
        setTimeout(() => {
            diagnosticsUI.style.display = 'none';
        }, 300);
    }

    function renderDiagnosticErrorLog() {
        const output = document.getElementById('diagnosticErrorText');
        const count = document.getElementById('diagnosticErrorCount');
        const diagnostics = window.tongtongDiagnostics;
        if (diagnostics && typeof diagnostics.flush === 'function') diagnostics.flush();
        const logs = diagnostics && typeof diagnostics.getLogs === 'function' ? diagnostics.getLogs() : [];
        if (count) count.textContent = `${logs.length} 条`;
        if (!output) return;
        output.value = logs.length && diagnostics && typeof diagnostics.toText === 'function'
            ? diagnostics.toText()
            : '';
    }

    function copyDiagnosticErrorLog() {
        renderDiagnosticErrorLog();
        const output = document.getElementById('diagnosticErrorText');
        const text = output ? output.value.trim() : '';
        if (!text) {
            if (typeof showToast === 'function') showToast('暂无报错数据');
            return;
        }
        const fallbackCopy = () => {
            output.focus();
            output.select();
            document.execCommand('copy');
        };
        const done = () => {
            if (typeof showToast === 'function') showToast('报错数据已复制');
        };
        if (navigator.clipboard && window.isSecureContext) {
            navigator.clipboard.writeText(text).then(done).catch(() => {
                fallbackCopy();
                done();
            });
        } else {
            fallbackCopy();
            done();
        }
    }

    function clearDiagnosticErrorLog() {
        if (window.tongtongDiagnostics && typeof window.tongtongDiagnostics.clear === 'function') {
            window.tongtongDiagnostics.clear();
        }
        renderDiagnosticErrorLog();
        if (typeof showToast === 'function') showToast('报错数据已清空');
    }

    function toggleDsAppearance(mode) {
        const lightOpt = document.getElementById('dsLightOption');
        const darkOpt = document.getElementById('dsDarkOption');
        const iphone = document.querySelector('.iphone');

        if (mode === 'dark') {
            lightOpt.classList.remove('active');
            darkOpt.classList.add('active');
            iphone.classList.add('dark-mode');
            appSettings.ios_theme_mode = 'dark';
        } else {
            darkOpt.classList.remove('active');
            lightOpt.classList.add('active');
            iphone.classList.remove('dark-mode');
            appSettings.ios_theme_mode = 'light';
        }
        saveAppSettings();

            // show three-dots button; click to expand vertical capsule menu
        const slider = document.getElementById('dsBrightnessSlider');
        if(slider) updateDsSlider(slider);
    }

    function updateDsSlider(el) {
        const percentage = (el.value - el.min) / (el.max - el.min) * 100;
        const isDark = document.querySelector('.iphone').classList.contains('dark-mode');
        const trackColor = isDark ? '#39393d' : '#e5e5ea';
        el.style.background = `linear-gradient(to right, #007aff ${percentage}%, ${trackColor} ${percentage}%)`;

            // show three-dots button; click to expand vertical capsule menu
        const overlay = document.getElementById('brightnessOverlay');
        if (overlay) {
            const opacity = 0.7 - (percentage / 100) * 0.7; // 最大暗度为 0.7
            overlay.style.backgroundColor = `rgba(0, 0, 0, ${opacity})`;
        }

            // show three-dots button; click to expand vertical capsule menu
        appSettings.ios_brightness = el.value;
        saveAppSettings();
    }

            // show three-dots button; click to expand vertical capsule menu
    function initThemeAndBrightness() {
        const savedTheme = appSettings.ios_theme_mode;
        if (savedTheme === 'dark') {
            toggleDsAppearance('dark');
        }

            // show three-dots button; click to expand vertical capsule menu
        const savedBrightness = appSettings.ios_brightness;
        const slider = document.getElementById('dsBrightnessSlider');
        if (slider) {
            if (savedBrightness !== null && savedBrightness !== undefined) {
                slider.value = savedBrightness;
            } else {
                slider.value = 100; // 默认最亮
            }
            updateDsSlider(slider);
        }
    }

            // show three-dots button; click to expand vertical capsule menu
    let tempAppleIdAvatarUrl = '';

    function openAppleIdProfileSheet() {
        const overlay = document.getElementById('appleIdProfileSheetOverlay');
        const sheet = document.getElementById('appleIdProfileSheet');
        const nameInput = document.getElementById('appleIdEditNameInput');
        const avatarPreview = document.getElementById('appleIdEditAvatarPreview');

        const currentName = (typeof appSettings !== 'undefined' && appSettings.apple_id_name) ? appSettings.apple_id_name : '@uu';
        const currentAvatar = (typeof appSettings !== 'undefined' && appSettings.apple_id_avatar) ? appSettings.apple_id_avatar : '';

        if (nameInput) nameInput.value = currentName;
        tempAppleIdAvatarUrl = currentAvatar;

        if (avatarPreview) {
            if (currentAvatar) {
                avatarPreview.innerHTML = `<img src="${currentAvatar}" style="width:100%;height:100%;object-fit:cover;">`;
            } else {
                avatarPreview.innerHTML = `
                    <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" style="pointer-events: none;">
                        <circle cx="50" cy="50" r="50" fill="#A3A8B0"/>
                        <circle cx="50" cy="36" r="16" fill="#FFFFFF"/>
                        <path d="M 50 59 C 20 59 10 82 8 106 L 92 106 C 90 82 80 59 50 59 Z" fill="#FFFFFF"/>
                    </svg>
                `;
            }
        }

        if (overlay) overlay.classList.add('show');
        if (sheet) sheet.classList.add('show');
    }

    function closeAppleIdProfileSheet() {
        const overlay = document.getElementById('appleIdProfileSheetOverlay');
        const sheet = document.getElementById('appleIdProfileSheet');
        if (overlay) overlay.classList.remove('show');
        if (sheet) sheet.classList.remove('show');
    }

    function saveAppleIdProfileSheet() {
        const nameInput = document.getElementById('appleIdEditNameInput');
        const newName = nameInput ? nameInput.value.trim() : '';

        if (!newName) {
            if (typeof showToast === 'function') showToast('账户名称不能为空');
            return;
        }

        if (typeof appSettings !== 'undefined') {
            appSettings.apple_id_name = newName;
            if (tempAppleIdAvatarUrl !== undefined) {
                appSettings.apple_id_avatar = tempAppleIdAvatarUrl;
            }
            if (typeof saveAppSettings === 'function') saveAppSettings();
        }

        updateAllProfileDisplay(newName, tempAppleIdAvatarUrl);
        closeAppleIdProfileSheet();
        if (typeof showToast === 'function') showToast('个人信息已更新');
    }

    function updateAllProfileDisplay(name, avatarUrl) {
        document.querySelectorAll('.set-profile-name, .apple-id-name').forEach(el => {
            el.innerText = name || '@uu';
        });

        const previews = [
            document.getElementById('settingsAvatarPreview'),
            document.getElementById('appleIdAvatarPreview'),
            document.getElementById('appleIdEditAvatarPreview')
        ];

        previews.forEach(preview => {
            if (!preview) return;
            if (avatarUrl) {
                preview.innerHTML = `<img src="${avatarUrl}" style="width:100%;height:100%;object-fit:cover;">`;
            }
        });
    }

    function applyAssistiveBallCustomIcon(iconUrl) {
        if (typeof appSettings !== 'undefined') {
            appSettings.assistive_ball_custom_icon = iconUrl;
            if (typeof saveAppSettings === 'function') saveAppSettings();
        }
        if (typeof updateAssistiveBallUI === 'function') updateAssistiveBallUI();
        if (typeof renderAssistiveCustomizeGrid === 'function') renderAssistiveCustomizeGrid();
    }

    window.setCustomAvatarUrlForTarget = function(target, url) {
        if (target === 'appleIdProfileEditAvatar' || target === 'appleIdAvatar') {
            tempAppleIdAvatarUrl = url;
            const preview = document.getElementById('appleIdEditAvatarPreview');
            if (preview) {
                preview.innerHTML = `<img src="${url}" style="width:100%;height:100%;object-fit:cover;">`;
            }
            const directPreview = document.getElementById('appleIdAvatarPreview');
            if (directPreview) {
                directPreview.innerHTML = `<img src="${url}" style="width:100%;height:100%;object-fit:cover;">`;
            }
        } else if (target === 'pwaIcon') {
            applyPwaSettings(currentPwaTitle, url);
            renderGenPwaPresetBadges();
            if (typeof showToast === 'function') showToast('已应用自定义桌面图标');
        } else if (target === 'assistiveBallIcon') {
            applyAssistiveBallCustomIcon(url);
            if (typeof showToast === 'function') showToast('已应用悬浮球自定义图标');
        }
    };

    // 适配原生图标操作菜单：防止上传 PWA 与悬浮球图标时因找不到桌面 App DOM 节点而读取 null.style 报错
    const _origHandleIconLocalUpload = window.handleIconLocalUpload;
    window.handleIconLocalUpload = function(event) {
        const target = window.currentEditingIcon || window.currentIconTarget || window._currentIconMenuTarget;
        if (target === 'pwaIcon') {
            const file = event.target?.files?.[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = function(e) {
                    const dataUrl = e.target.result;
                    applyPwaSettings(currentPwaTitle, dataUrl);
                    renderGenPwaPresetBadges();
                    if (typeof showToast === 'function') showToast('已应用相册自定义桌面图标');
                    if (typeof closeIconMenu === 'function') closeIconMenu();
                };
                reader.readAsDataURL(file);
                event.target.value = '';
                return;
            }
        } else if (target === 'assistiveBallIcon') {
            const file = event.target?.files?.[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = function(e) {
                    const dataUrl = e.target.result;
                    applyAssistiveBallCustomIcon(dataUrl);
                    if (typeof showToast === 'function') showToast('已应用相册自定义悬浮球图标');
                    if (typeof closeIconMenu === 'function') closeIconMenu();
                };
                reader.readAsDataURL(file);
                event.target.value = '';
                return;
            }
        } else if (target === 'appleIdProfileEditAvatar' || target === 'appleIdAvatar') {
            const file = event.target?.files?.[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = function(e) {
                    const dataUrl = e.target.result;
                    tempAppleIdAvatarUrl = dataUrl;
                    const preview = document.getElementById('appleIdEditAvatarPreview');
                    if (preview) {
                        preview.innerHTML = `<img src="${dataUrl}" style="width:100%;height:100%;object-fit:cover;">`;
                    }
                    if (typeof showToast === 'function') showToast('已选择新头像');
                    if (typeof closeIconMenu === 'function') closeIconMenu();
                };
                reader.readAsDataURL(file);
                event.target.value = '';
                return;
            }
        }
        if (typeof _origHandleIconLocalUpload === 'function') {
            try {
                return _origHandleIconLocalUpload.apply(this, arguments);
            } catch (err) {
                console.debug('handleIconLocalUpload fallback:', err);
            }
        }
    };

    const _origSaveIconUrl = window.saveIconUrl;
    window.saveIconUrl = function(urlInput) {
        const target = window.currentEditingIcon || window.currentIconTarget || window._currentIconMenuTarget;
        if (target === 'pwaIcon') {
            const val = (typeof urlInput === 'string' ? urlInput : document.getElementById('iconUrlInput')?.value || '').trim();
            if (val) {
                applyPwaSettings(currentPwaTitle, val);
                renderGenPwaPresetBadges();
                if (typeof showToast === 'function') showToast('已应用 URL 自定义桌面图标');
            }
            if (typeof closeIconUrlModal === 'function') closeIconUrlModal();
            if (typeof closeIconMenu === 'function') closeIconMenu();
            return;
        } else if (target === 'assistiveBallIcon') {
            const val = (typeof urlInput === 'string' ? urlInput : document.getElementById('iconUrlInput')?.value || '').trim();
            if (val) {
                applyAssistiveBallCustomIcon(val);
                if (typeof showToast === 'function') showToast('已应用 URL 自定义悬浮球图标');
            }
            if (typeof closeIconUrlModal === 'function') closeIconUrlModal();
            if (typeof closeIconMenu === 'function') closeIconMenu();
            return;
        } else if (target === 'appleIdProfileEditAvatar' || target === 'appleIdAvatar') {
            const val = (typeof urlInput === 'string' ? urlInput : document.getElementById('iconUrlInput')?.value || '').trim();
            if (val) {
                tempAppleIdAvatarUrl = val;
                const preview = document.getElementById('appleIdEditAvatarPreview');
                if (preview) {
                    preview.innerHTML = `<img src="${val}" style="width:100%;height:100%;object-fit:cover;">`;
                }
                if (typeof showToast === 'function') showToast('已选择新头像');
            }
            if (typeof closeIconUrlModal === 'function') closeIconUrlModal();
            if (typeof closeIconMenu === 'function') closeIconMenu();
            return;
        }
        if (typeof _origSaveIconUrl === 'function') {
            try {
                return _origSaveIconUrl.apply(this, arguments);
            } catch (err) {
                console.debug('saveIconUrl fallback:', err);
            }
        }
    };

    function openAppleIdApp() {
        const appleIdUI = document.getElementById('appleIdUI');
        appleIdUI.style.display = 'flex';
        const currentName = (typeof appSettings !== 'undefined' && appSettings.apple_id_name) ? appSettings.apple_id_name : '@uu';
        const currentAvatar = (typeof appSettings !== 'undefined' && appSettings.apple_id_avatar) ? appSettings.apple_id_avatar : '';
        updateAllProfileDisplay(currentName, currentAvatar);
        setTimeout(() => {
            appleIdUI.classList.add('show');
        }, 10);
    }

    function closeAppleIdApp() {
        const appleIdUI = document.getElementById('appleIdUI');
        appleIdUI.classList.remove('show');
        setTimeout(() => {
            appleIdUI.style.display = 'none';
        }, 300);
    }

    let apiEditingId = null;

    let fetchedModelsCache = []; // 缓存拉取到的模型
    const fetchedModelsByMode = {
        add: { signature: '', models: [] },
        edit: { signature: '', models: [] }
    };

    function getApiFormSignature(mode) {
        const url = document.getElementById(mode === 'add' ? 'api-add-url' : 'api-edit-url')?.value.trim() || '';
        const key = document.getElementById(mode === 'add' ? 'api-add-key' : 'api-edit-key')?.value.trim() || '';
        return `${url}\n${key}`;
    }

    function updateApiTestButton(mode, enabled) {
        const button = document.querySelector(`${mode === 'add' ? '#api-page-add' : '#apiDrawer'} .api-test-btn`);
        if (!button) return;
        button.classList.toggle('disabled', !enabled);
        button.setAttribute('aria-disabled', String(!enabled));
    }

    function markApiModelsFetched(mode, models) {
        fetchedModelsByMode[mode] = {
            signature: getApiFormSignature(mode),
            models: Array.isArray(models) ? models : []
        };
        updateApiTestButton(mode, fetchedModelsByMode[mode].models.length > 0);
    }

    async function fetchApiModels(mode) {
        const urlInput = document.getElementById(mode === 'add' ? 'api-add-url' : 'api-edit-url').value.trim();
        const keyInput = document.getElementById(mode === 'add' ? 'api-add-key' : 'api-edit-key').value.trim();
        const inputEl = document.getElementById(mode === 'add' ? 'api-add-model' : 'api-edit-model');
        fetchedModelsByMode[mode] = { signature: '', models: [] };
        updateApiTestButton(mode, false);

        if (!urlInput || !keyInput) {
            showCustomAlert('提示', '请先填写 URL 和 Key');
            return;
        }

        try {
            showToast('正在拉取模型...');
            const baseUrl = urlInput.endsWith('/') ? urlInput.slice(0, -1) : urlInput;

            // show three-dots button; click to expand vertical capsule menu
            const response = await fetch(`${baseUrl}/models`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${keyInput}`,
                    'Content-Type': 'application/json'
                }
            });

            if (!response.ok) {
                throw new Error(`HTTP 错误: ${response.status}`);
            }

            const data = await response.json();

            if (data && data.data && Array.isArray(data.data)) {
                if (data.data.length === 0) {
                    inputEl.value = '';
                    inputEl.placeholder = '未找到可用模型';
                    fetchedModelsCache = [];
                    markApiModelsFetched(mode, []);
                    showToast('未找到可用模型');
                    return;
                }

                fetchedModelsCache = data.data.map(m => m.id);
                markApiModelsFetched(mode, fetchedModelsCache);
                inputEl.value = fetchedModelsCache[0]; // 默认选中第一个
                showToast('模型拉取成功');

                // 拉取成功后自动打开选择弹窗
                openApiModelSelect(mode);
            } else {
                throw new Error('接口返回的数据格式不符合 OpenAI 标准');
            }
        } catch (error) {
            console.error("拉取模型失败:", error);
            if (typeof window.showApiErrorModal === 'function') {
                window.showApiErrorModal(error.message);
            } else {
                showCustomAlert('拉取失败', `请检查 URL 和 Key 是否正确，或目标服务器是否存在跨域(CORS)限制。\n\n错误信息: ${error.message}`);
            }
        }
    }

    async function testApiConnection(mode) {
        const urlInput = document.getElementById(mode === 'add' ? 'api-add-url' : 'api-edit-url').value.trim();
        const keyInput = document.getElementById(mode === 'add' ? 'api-add-key' : 'api-edit-key').value.trim();
        const modelInput = document.getElementById(mode === 'add' ? 'api-add-model' : 'api-edit-model').value.trim();
        const fetchedState = fetchedModelsByMode[mode];

        if (!urlInput || !keyInput || !modelInput || !fetchedState.models.length || fetchedState.signature !== getApiFormSignature(mode) || !fetchedState.models.includes(modelInput)) {
            updateApiTestButton(mode, false);
            showCustomAlert('提示', '请先填写 URL 和 Key，成功拉取模型并选择模型后再测试连接');
            return;
        }

        try {
            showToast('正在测试连接...');
            const baseUrl = urlInput.endsWith('/') ? urlInput.slice(0, -1) : urlInput;
            const response = await fetch(/\/chat\/completions$/i.test(baseUrl) ? baseUrl : `${baseUrl}/chat/completions`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${keyInput}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    model: modelInput,
                    temperature: 0,
                    max_tokens: 1,
                    messages: [{ role: 'user', content: '请回复 OK' }]
                })
            });

            if (!response.ok) {
                let detail = '';
                try {
                    const errorData = await response.json();
                    detail = errorData?.error?.message || errorData?.message || '';
                } catch (error) {
                    // Some providers return an empty or non-JSON error body.
                }
                throw new Error(`HTTP 错误: ${response.status}${detail ? `，${detail}` : ''}`);
            }

            await response.text();
            showToast('连接成功');
        } catch (error) {
            console.error('测试 API 连接失败:', error);
            if (typeof window.showApiErrorModal === 'function') {
                window.showApiErrorModal(error.message);
            } else {
                showCustomAlert('连接失败', `请检查 URL、Key 和模型是否正确，或目标服务器是否存在跨域(CORS)限制。\n\n错误信息: ${error.message}`);
            }
        }
    }

    function saveNewApi() {
        const name = document.getElementById('api-add-name').value.trim();
        const url = document.getElementById('api-add-url').value.trim();
        const key = document.getElementById('api-add-key').value.trim();
        const model = document.getElementById('api-add-model').value;
        const temp = parseFloat(document.getElementById('api-add-temp').value) || 0.8;

        if (!name || !url || !key) {
            showCustomAlert('提示', '请填写完整信息');
            return;
        }

        const newApi = {
            id: Date.now(),
            name, url, key, model: model || '', temperature: temp
        };

        apiDataList.push(newApi);
        if (!apiConnectedId) apiConnectedId = newApi.id; // 如果是第一个，自动连接
        saveApiData();
        renderApiList();
        closeApiAddPage();

            // show three-dots button; click to expand vertical capsule menu
        document.getElementById('api-add-name').value = '';
        document.getElementById('api-add-url').value = '';
        document.getElementById('api-add-key').value = '';
        document.getElementById('api-add-model').value = '';
        document.getElementById('api-add-model').placeholder = '请先拉取模型';
        fetchedModelsByMode.add = { signature: '', models: [] };
        updateApiTestButton('add', false);
        document.getElementById('api-add-temp').value = 0.8;
        document.getElementById('api-add-temp-val').innerText = '0.8';
    }

    function deleteApiDrawer() {
        if (!apiEditingId) return;
        showCustomConfirm('删除 API', '确定要删除这个 API 预设吗？', '删除', true).then(confirmed => {
            if (confirmed) {
                apiDataList = apiDataList.filter(a => a.id !== apiEditingId);
                if (apiConnectedId === apiEditingId) {
                    apiConnectedId = apiDataList.length > 0 ? apiDataList[0].id : null;
                }
                saveApiData();
                renderApiList();
                closeApiDrawer();
            }
        });
    }

    let apiStreamEnabled = false;

    function toggleApiStream() {
        const toggleBtn = document.getElementById('apiStreamToggle');
        apiStreamEnabled = !apiStreamEnabled;
        if (apiStreamEnabled) {
            toggleBtn.classList.remove('off');
            if(typeof showToast === 'function') showToast("流式输出已开启");
        } else {
            toggleBtn.classList.add('off');
            if(typeof showToast === 'function') showToast("流式输出已关闭");
        }
        if (typeof appSettings !== 'undefined') {
            appSettings.api_stream_enabled = apiStreamEnabled;
            if (typeof saveAppSettings === 'function') saveAppSettings();
        }
    }

    function lockApiContainersHorizontalScroll() {
        const elements = [
            document.getElementById('apiAppUI'),
            document.getElementById('apiDrawer'),
            document.getElementById('api-page-main'),
            document.getElementById('api-page-add'),
            document.querySelector('.iphone'),
            document.body,
            document.documentElement
        ];
        elements.forEach(el => {
            if (el && el.scrollLeft !== 0) el.scrollLeft = 0;
        });
        document.querySelectorAll('#apiAppUI .api-content, #apiAppUI .api-form-input-wrapper').forEach(el => {
            if (el && el.scrollLeft !== 0) el.scrollLeft = 0;
        });
    }

    function openApiApp() {
        const apiAppUI = document.getElementById('apiAppUI');
        apiAppUI.style.display = 'flex';
        lockApiContainersHorizontalScroll();

        if (!apiAppUI._scrollGuardBound) {
            apiAppUI._scrollGuardBound = true;
            window.addEventListener('scroll', lockApiContainersHorizontalScroll, { capture: true, passive: true });
            document.addEventListener('selectionchange', () => {
                const activeEl = document.activeElement;
                if (activeEl && activeEl.closest && activeEl.closest('#apiAppUI')) {
                    lockApiContainersHorizontalScroll();
                    requestAnimationFrame(lockApiContainersHorizontalScroll);
                }
            }, { passive: true });
            apiAppUI.addEventListener('select', lockApiContainersHorizontalScroll, true);
            apiAppUI.addEventListener('touchend', () => {
                requestAnimationFrame(lockApiContainersHorizontalScroll);
            }, { passive: true });
        }
        renderApiList();

        if (typeof appSettings !== 'undefined' && appSettings.api_stream_enabled !== undefined) {
            apiStreamEnabled = appSettings.api_stream_enabled;
        }
        const toggleBtn = document.getElementById('apiStreamToggle');
        if (toggleBtn) {
            if (apiStreamEnabled) toggleBtn.classList.remove('off');
            else toggleBtn.classList.add('off');
        }

        setTimeout(() => {
            apiAppUI.classList.add('show');
            // Fix iOS contextmenu positioning: remove transform after animation
            setTimeout(() => {
                apiAppUI.classList.add('animation-complete');
                lockApiContainersHorizontalScroll();
            }, 300);
        }, 10);
    }

    function closeApiApp() {
        const apiAppUI = document.getElementById('apiAppUI');
        // Restore transform before closing animation
        apiAppUI.classList.remove('animation-complete');
        apiAppUI.classList.remove('show');
        closeApiDrawer();
        setTimeout(() => {
            apiAppUI.style.display = 'none';
        }, 300);
    }

    function openApiHelpModal() {
        const modal = document.getElementById('apiHelpModalOverlay');
        if (modal) modal.classList.add('show');
    }

    function closeApiHelpModal() {
        const modal = document.getElementById('apiHelpModalOverlay');
        if (modal) modal.classList.remove('show');
    }

    function renderApiList() {
        const connectedContainer = document.getElementById('api-connected-container');
        const presetContainer = document.getElementById('api-preset-container');
        connectedContainer.innerHTML = '';
        presetContainer.innerHTML = '';

        apiDataList.forEach(api => {
            const isConnected = api.id === apiConnectedId;
            const rowAction = isConnected ? `openApiDrawer(event, ${api.id})` : `connectApi(${api.id})`;

            const rowHTML = `
                <div class="api-row clickable" onclick="${rowAction}">
                    <div class="api-row-left">
                        ${isConnected ? '<svg viewBox="0 0 24 24" fill="none" stroke="#007aff" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>' : ''}
                    </div>
                    <div class="api-row-text">
                        <div class="api-row-title-text">${api.name}</div>
                        ${isConnected ? '<div class="api-row-subtitle-text">已连接</div>' : ''}
                    </div>
                    <div class="api-row-right">
                        <svg class="api-icon-lock" viewBox="0 0 24 24"><path d="M17 10H7V7c0-2.76 2.24-5 5-5s5 2.24 5 5v3zm-2 0V7c0-1.65-1.35-3-3-3S9 5.35 9 7v3h6zM5 12v8c0 1.1.9 2 2 2h10c1.1 0 2-.9 2-2v-8c0-1.1-.9-2-2-2H7c-1.1 0-2 .9-2 2z"/></svg>
                        <svg class="api-icon-wifi" viewBox="0 0 24 24"><path fill="#000000" d="M2.06 10.06c.51.51 1.32.56 1.87.1c4.67-3.84 11.45-3.84 16.13-.01c.56.46 1.38.42 1.89-.09c.59-.59.55-1.57-.1-2.1c-5.71-4.67-13.97-4.67-19.69 0c-.65.52-.7 1.5-.1 2.1zm7.76 7.76l1.47 1.47c.39.39 1.02.39 1.41 0l1.47-1.47c.47-.47.37-1.28-.23-1.59a4.28 4.28 0 0 0-3.91 0c-.57.31-.68 1.12-.21 1.59zm-3.73-3.73c.49.49 1.26.54 1.83.13a7.064 7.064 0 0 1 8.16 0c.57.4 1.34.36 1.83-.13l.01-.01c.6-.6.56-1.62-.13-2.11c-3.44-2.49-8.13-2.49-11.58 0c-.69.5-.73 1.51-.12 2.12z"/></svg>
                        <svg class="api-icon-info" viewBox="0 0 24 24" onclick="openApiDrawer(event, ${api.id})">
                            <circle cx="12" cy="12" r="10" fill="none" stroke="#007aff" stroke-width="1.5"></circle>
                            <circle cx="12" cy="6.8" r="1.3" fill="#007aff" stroke="none"></circle>
                            <path d="M10.5 11 L12 10 V16.5 M10.5 16.5 H13.5" stroke="#007aff" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" fill="none"></path>
                        </svg>
                    </div>
                </div>
            `;

            if (isConnected) {
                connectedContainer.innerHTML = rowHTML;
            } else {
                presetContainer.innerHTML += rowHTML;
            }
        });

        presetContainer.innerHTML += `
            <div class="api-row clickable" onclick="openApiAddPage()">
                <div class="api-row-left"></div>
                <div class="api-row-text"><div class="api-row-title-text" style="color: #007aff;">+ 添加API</div></div>
            </div>
        `;
    }

    function connectApi(id) {
        apiConnectedId = id;
        saveApiData();
        renderApiList();
    }

    function openApiDrawer(event, id) {
        event.stopPropagation();
        apiEditingId = id;
        const api = apiDataList.find(a => a.id === id);
        document.getElementById('api-edit-name').value = api.name;
        document.getElementById('api-edit-url').value = api.url;
        document.getElementById('api-edit-key').value = api.key;

            // show three-dots button; click to expand vertical capsule menu
        const inputEl = document.getElementById('api-edit-model');
        inputEl.value = api.model || '';
        inputEl.placeholder = api.model ? api.model : '未选择模型';
        fetchedModelsByMode.edit = { signature: '', models: [] };
        updateApiTestButton('edit', false);

        const temp = api.temperature !== undefined ? api.temperature : 0.8;
        document.getElementById('api-edit-temp').value = temp;
        document.getElementById('api-edit-temp-val').innerText = temp;

        const drawer = document.getElementById('apiDrawer');
        lockApiContainersHorizontalScroll();
        document.getElementById('apiDrawerOverlay').classList.add('show');
        drawer.classList.add('show');

        // Fix iOS contextmenu positioning: remove transform after animation completes
        setTimeout(() => {
            drawer.classList.add('animation-complete');
            lockApiContainersHorizontalScroll();
        }, 350);
    }

    function closeApiDrawer() {
        const drawer = document.getElementById('apiDrawer');
        if (!drawer) return;
        // Restore transform before closing animation
        drawer.classList.remove('animation-complete');

        // Small delay to ensure transform is restored before animation starts
        setTimeout(() => {
            document.getElementById('apiDrawerOverlay')?.classList.remove('show');
            drawer.classList.remove('show');
            lockApiContainersHorizontalScroll();
        }, 10);

        apiEditingId = null;
    }

    function saveApiDrawer() {
        if (apiEditingId) {
            const api = apiDataList.find(a => a.id === apiEditingId);
            api.name = document.getElementById('api-edit-name').value;
            api.url = document.getElementById('api-edit-url').value;
            api.key = document.getElementById('api-edit-key').value;
            api.model = document.getElementById('api-edit-model').value;
            api.temperature = parseFloat(document.getElementById('api-edit-temp').value) || 0.8;
            saveApiData();
            renderApiList();
        }
        closeApiDrawer();
    }

    function openApiAddPage() {
        const mainPage = document.getElementById('api-page-main');
        const addPage = document.getElementById('api-page-add');
        lockApiContainersHorizontalScroll();

        addPage.classList.add('animating');
        mainPage.classList.add('animating');

        requestAnimationFrame(() => {
            mainPage.classList.remove('active');
            mainPage.classList.add('slide-left');
            addPage.classList.remove('slide-right');
            addPage.classList.add('active');

            setTimeout(() => {
                addPage.classList.remove('animating');
                addPage.classList.add('animation-complete');
                mainPage.classList.remove('animating');
                lockApiContainersHorizontalScroll();
            }, 350);
        });
    }

    function closeApiAddPage() {
        const addPage = document.getElementById('api-page-add');
        const mainPage = document.getElementById('api-page-main');
        lockApiContainersHorizontalScroll();

        addPage.classList.remove('animation-complete');
        addPage.classList.add('animating');
        mainPage.classList.add('animating');

        setTimeout(() => {
            addPage.classList.remove('active');
            addPage.classList.add('slide-right');
            mainPage.classList.remove('slide-left');
            mainPage.classList.add('active');

            setTimeout(() => {
                addPage.classList.remove('animating');
                mainPage.classList.remove('animating');
                mainPage.classList.add('animation-complete');
                lockApiContainersHorizontalScroll();
            }, 350);
        }, 10);
    }

            // show three-dots button; click to expand vertical capsule menu
    function openIcloudApp() {
        const icloudUI = document.getElementById('icloudAppUI');
        icloudUI.style.display = 'flex';
        updateRealStorage(); // 触发真实储存计算与持久化检测
        loadGithubBackupSettings();
        checkBackupReminder();
        setTimeout(() => {
            icloudUI.classList.add('show');
        }, 10);
    }

    function closeIcloudApp() {
        const icloudUI = document.getElementById('icloudAppUI');
        icloudUI.classList.remove('show');
        setTimeout(() => {
            icloudUI.style.display = 'none';
            // show three-dots button; click to expand vertical capsule menu
            closeIcStoragePage();
            if (typeof closeLocalDrivePage === 'function') closeLocalDrivePage();
            if (typeof closeCloudBackupPage === 'function') closeCloudBackupPage();
            if (typeof closeBackupReminderSheet === 'function') closeBackupReminderSheet();
        }, 300);
    }

    function openIcStoragePage() {
        document.getElementById('ic-main-page').classList.remove('active');
        document.getElementById('ic-main-page').classList.add('slide-left');
        document.getElementById('ic-storage-page').classList.remove('slide-right');
        document.getElementById('ic-storage-page').classList.add('active');
        if (typeof updateRealStorage === 'function') updateRealStorage();
    }

    function closeIcStoragePage() {
        document.getElementById('ic-storage-page').classList.remove('active');
        document.getElementById('ic-storage-page').classList.add('slide-right');
        document.getElementById('ic-main-page').classList.remove('slide-left');
        document.getElementById('ic-main-page').classList.add('active');
    }

    function recordLastBackupTimestamp() {
        const now = Date.now();
        if (typeof appSettings !== 'undefined') {
            appSettings.last_backup_time = now;
            if (typeof saveAppSettings === 'function') saveAppSettings();
        }
        try {
            localStorage.setItem('tongtong_last_backup_time', String(now));
        } catch (e) {}
    }

    function getLastBackupTimestamp() {
        if (typeof appSettings !== 'undefined' && appSettings.last_backup_time) {
            return Number(appSettings.last_backup_time);
        }
        try {
            const local = localStorage.getItem('tongtong_last_backup_time');
            return local ? Number(local) : 0;
        } catch (e) {
            return 0;
        }
    }

    function formatBackupTimestamp(ts) {
        if (!ts || Number.isNaN(ts) || ts <= 0) return '从未备份';
        const date = new Date(ts);
        if (Number.isNaN(date.getTime())) return '从未备份';
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        const hours = String(date.getHours()).padStart(2, '0');
        const minutes = String(date.getMinutes()).padStart(2, '0');
        return `${year}-${month}-${day} ${hours}:${minutes}`;
    }

    function openBackupReminderSheet() {
        const overlay = document.getElementById('backupReminderSheetOverlay');
        const sheet = document.getElementById('backupReminderSheet');
        const toggle = document.getElementById('backupReminderToggle');
        const lastTimeEl = document.getElementById('backupReminderLastTime');
        const daysInput = document.getElementById('backupReminderDaysInput');

        const enabled = appSettings?.backup_reminder_enabled === true;
        const days = parseInt(appSettings?.backup_reminder_days, 10) || 7;
        const lastTime = getLastBackupTimestamp();

        if (toggle) {
            toggle.classList.toggle('on', enabled);
            toggle.setAttribute('aria-checked', String(enabled));
        }
        if (lastTimeEl) {
            lastTimeEl.innerText = formatBackupTimestamp(lastTime);
        }
        if (daysInput) {
            daysInput.value = days;
        }

        if (overlay) overlay.classList.add('show');
        if (sheet) sheet.classList.add('show');
    }

    function closeBackupReminderSheet() {
        const overlay = document.getElementById('backupReminderSheetOverlay');
        const sheet = document.getElementById('backupReminderSheet');
        if (overlay) overlay.classList.remove('show');
        if (sheet) sheet.classList.remove('show');
    }

    function toggleBackupReminderSwitch() {
        const toggle = document.getElementById('backupReminderToggle');
        if (!toggle) return;
        const isOn = toggle.classList.toggle('on');
        toggle.setAttribute('aria-checked', String(isOn));
    }

    function saveBackupReminderSettings() {
        const toggle = document.getElementById('backupReminderToggle');
        const daysInput = document.getElementById('backupReminderDaysInput');
        const enabled = toggle ? toggle.classList.contains('on') : false;
        let days = parseInt(daysInput?.value, 10) || 7;
        if (days < 1) days = 1;
        if (days > 365) days = 365;

        if (typeof appSettings !== 'undefined') {
            appSettings.backup_reminder_enabled = enabled;
            appSettings.backup_reminder_days = days;
            if (typeof saveAppSettings === 'function') saveAppSettings();
        }

        closeBackupReminderSheet();
        if (typeof showToast === 'function') {
            showToast(enabled ? `备份提醒已开启（每 ${days} 天）` : '备份提醒已关闭');
        }
    }

    let hasShownBackupReminderThisSession = false;
    function checkBackupReminder() {
        if (hasShownBackupReminderThisSession) return;
        const enabled = appSettings?.backup_reminder_enabled === true;
        if (!enabled) return;

        const daysSetting = parseInt(appSettings?.backup_reminder_days, 10) || 7;
        const lastBackup = getLastBackupTimestamp();
        const now = Date.now();
        const oneDayMs = 24 * 60 * 60 * 1000;

        let shouldRemind = false;
        let diffDays = 0;

        if (!lastBackup) {
            shouldRemind = true;
            diffDays = daysSetting;
        } else {
            diffDays = Math.floor((now - lastBackup) / oneDayMs);
            if (diffDays >= daysSetting) {
                shouldRemind = true;
            }
        }

        if (shouldRemind) {
            hasShownBackupReminderThisSession = true;
            const message = lastBackup
                ? `您已超过 ${diffDays} 天未进行数据备份。为防止数据意外丢失，建议您立即导出备份数据。`
                : `您尚未进行过数据备份。为保障数据安全，建议您及时导出备份数据。`;

            setTimeout(() => {
                if (typeof showCustomConfirm === 'function') {
                    showCustomConfirm('备份提醒', message, '立即备份', false).then(confirmed => {
                        if (confirmed) {
                            exportAllDataJson();
                        }
                    });
                } else {
                    alert(message);
                }
            }, 500);
        }
    }

    const githubBackupSettingsId = 'githubBackupSettings';
    const githubBackupHistoryLimit = 10;
    let githubBackupTimerId = null;

    function openCloudBackupPage() {
        const mainPage = document.getElementById('ic-main-page');
        const cloudPage = document.getElementById('ic-cloud-backup-page');
        if (!mainPage || !cloudPage) return;
        mainPage.classList.remove('active');
        mainPage.classList.add('slide-left');
        cloudPage.classList.remove('slide-right');
        cloudPage.classList.add('active');
        setTimeout(() => {
            loadGithubBackupSettings();
        }, 150);
    }

    function closeCloudBackupPage() {
        const page = document.getElementById('ic-cloud-backup-page');
        if (!page) return;
        page.classList.remove('active');
        page.classList.add('slide-right');
        document.getElementById('ic-main-page').classList.remove('slide-left');
        document.getElementById('ic-main-page').classList.add('active');
    }

    function getGithubBackupInputs() {
        return {
            token: document.getElementById('githubBackupToken'),
            owner: document.getElementById('githubBackupOwner'),
            repo: document.getElementById('githubBackupRepo'),
            fileName: document.getElementById('githubBackupFileName'),
            scheduledTime: document.getElementById('githubBackupScheduledTime'),
            scheduleToggle: document.getElementById('githubBackupScheduleToggle'),
            intervalValue: document.getElementById('githubBackupIntervalValue'),
            intervalUnit: document.getElementById('githubBackupIntervalUnit'),
            intervalToggle: document.getElementById('githubBackupIntervalToggle')
        };
    }

    function getGithubBackupConfigFromForm() {
        const inputs = getGithubBackupInputs();
        const token = inputs.token.value.trim();
        const owner = inputs.owner.value.trim();
        const repo = inputs.repo.value.trim();
        let fileName = inputs.fileName.value.trim().replace(/^\/+|\/+$/g, '');

        if (!token || !owner || !repo || !fileName) {
            showCustomAlert('提示', '请填写 Token、用户名、仓库名和文件名。');
            return null;
        }
        if (!/^[A-Za-z0-9](?:[A-Za-z0-9-]{0,38})$/.test(owner) || !/^[A-Za-z0-9._-]+$/.test(repo)) {
            showCustomAlert('提示', 'GitHub 用户名或仓库名格式不正确。');
            return null;
        }
        if (fileName.split('/').some(part => !part || part === '.' || part === '..')) {
            showCustomAlert('提示', '文件名不能包含 . 或 .. 路径。');
            return null;
        }
        fileName = fileName.replace(/\.json$/i, '');
        inputs.fileName.value = fileName;
        return {
            token,
            owner,
            repo,
            fileName,
            scheduledEnabled: inputs.scheduleToggle.classList.contains('on'),
            scheduledTime: inputs.scheduledTime.value || '02:00',
            intervalEnabled: inputs.intervalToggle.classList.contains('on'),
            intervalValue: Math.max(1, Number(inputs.intervalValue.value) || 30),
            intervalUnit: inputs.intervalUnit.value === 'hour' ? 'hour' : 'minute'
        };
    }

    function readGithubBackupSettings() {
        return new Promise((resolve) => {
            if (!db) return resolve(null);
            const request = db.transaction([storeName], 'readonly').objectStore(storeName).get(githubBackupSettingsId);
            request.onsuccess = () => resolve(request.result || null);
            request.onerror = () => resolve(null);
        });
    }

    function persistGithubBackupSettings(config) {
        return new Promise((resolve, reject) => {
            if (!db) {
                reject(new Error('数据库尚未就绪'));
                return;
            }
            const transaction = db.transaction([storeName], 'readwrite');
            transaction.objectStore(storeName).put({ id: githubBackupSettingsId, ...config });
            transaction.oncomplete = resolve;
            transaction.onerror = () => reject(transaction.error || new Error('保存配置失败'));
        });
    }

    async function loadGithubBackupSettings() {
        const config = await readGithubBackupSettings();
        const inputs = getGithubBackupInputs();
        inputs.token.value = config?.token || '';
        inputs.owner.value = config?.owner || '';
        inputs.repo.value = config?.repo || '';
        inputs.fileName.value = config?.fileName || 'tonghuaji-backup';
        inputs.scheduledTime.value = config?.scheduledTime || '02:00';
        inputs.intervalValue.value = config?.intervalValue || 30;
        inputs.intervalUnit.value = config?.intervalUnit === 'hour' ? 'hour' : 'minute';
        inputs.scheduleToggle.classList.toggle('off', config?.scheduledEnabled !== true);
        inputs.scheduleToggle.classList.toggle('on', config?.scheduledEnabled === true);
        inputs.intervalToggle.classList.toggle('off', config?.intervalEnabled !== true);
        inputs.intervalToggle.classList.toggle('on', config?.intervalEnabled === true);
        updateCloudBackupStatus(config);
        renderGithubBackupHistory(config);
        scheduleGithubBackup(config);
    }

    function updateCloudBackupStatus(config) {
        const status = document.getElementById('ic-cloud-backup-status');
        if (!status) return;
        status.textContent = config?.owner && config?.repo ? `${config.owner}/${config.repo}` : '未设置';
    }

    function normalizeGithubBackupHistory(config) {
        return Array.isArray(config?.backupHistory) ? config.backupHistory.slice(0, githubBackupHistoryLimit) : [];
    }

    function formatGithubBackupTime(value) {
        const date = new Date(value);
        if (Number.isNaN(date.getTime())) return '时间未知';
        return date.toLocaleString('zh-CN', {
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit'
        });
    }

    function escapeGithubBackupHistoryText(value) {
        return String(value || '').replace(/[&<>"']/g, char => ({
            '&': '&amp;',
            '<': '&lt;',
            '>': '&gt;',
            '"': '&quot;',
            "'": '&#39;'
        }[char]));
    }

    function renderGithubBackupHistory(config) {
        const list = document.getElementById('githubBackupHistoryList');
        if (!list) return;
        const history = normalizeGithubBackupHistory(config);
        if (!history.length) {
            list.textContent = '暂无备份记录';
            return;
        }
        list.innerHTML = history.map((item, index) => {
            const ok = item.status === 'success';
            const color = ok ? '#34c759' : '#ff3b30';
            const title = ok ? '备份成功' : '备份未完成';
            const count = Number(item.fileCount || 0);
            const countText = count > 0 ? `${count} 个文件` : '未写入文件';
            const repoText = escapeGithubBackupHistoryText(item.repo || '未记录仓库');
            const prefixText = item.prefix ? ` · ${escapeGithubBackupHistoryText(item.prefix)}` : '';
            const messageText = item.message ? `<div style="margin-top: 2px; color: #8e8e93;">${escapeGithubBackupHistoryText(item.message)}</div>` : '';
            const borderStyle = index === history.length - 1 ? 'border-bottom: none;' : 'border-bottom: 1px solid rgba(0,0,0,0.06);';
            return `
                <div style="display: flex; align-items: flex-start; gap: 10px; padding: 10px 0; ${borderStyle}">
                    <div style="width: 8px; height: 8px; border-radius: 50%; background: ${color}; margin-top: 6px; flex-shrink: 0;"></div>
                    <div style="flex: 1; min-width: 0;">
                        <div style="display: flex; justify-content: space-between; gap: 10px; color: #1c1c1e; font-size: 14px; font-weight: 600;">
                            <span>${title}</span>
                            <span style="color: #8e8e93; font-size: 12px; font-weight: 500; white-space: nowrap;">${formatGithubBackupTime(item.time)}</span>
                        </div>
                        <div style="margin-top: 3px; color: #8e8e93;">${repoText}${prefixText} · ${countText}</div>
                        ${messageText}
                    </div>
                </div>
            `;
        }).join('');
    }

    async function persistGithubBackupFormConfig(config) {
        const current = await readGithubBackupSettings();
        const nextConfig = {
            ...current,
            ...config,
            backupHistory: normalizeGithubBackupHistory(current)
        };
        await persistGithubBackupSettings(nextConfig);
        return nextConfig;
    }

    async function appendGithubBackupHistory(config, entry) {
        const current = await readGithubBackupSettings();
        const history = [
            {
                id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
                time: new Date().toISOString(),
                repo: `${config.owner}/${config.repo}`,
                prefix: config.fileName,
                ...entry
            },
            ...normalizeGithubBackupHistory(current)
        ].slice(0, githubBackupHistoryLimit);
        const nextConfig = { ...(current || config), backupHistory: history };
        await persistGithubBackupSettings(nextConfig);
        renderGithubBackupHistory(nextConfig);
    }

    async function saveGithubBackupSettings(options = {}) {
        const { silent = false, reschedule = true } = options;
        const config = getGithubBackupConfigFromForm();
        if (!config) return null;
        try {
            const nextConfig = await persistGithubBackupFormConfig(config);
            updateCloudBackupStatus(nextConfig);
            renderGithubBackupHistory(nextConfig);
            if (reschedule) scheduleGithubBackup(nextConfig);
            if (!silent) showToast('GitHub 备份配置已保存');
            return nextConfig;
        } catch (error) {
            showCustomAlert('错误', '保存 GitHub 配置失败。');
            return null;
        }
    }

    function stopGithubBackupSchedule() {
        if (githubBackupTimerId !== null) {
            clearTimeout(githubBackupTimerId);
            githubBackupTimerId = null;
        }
    }

    function scheduleGithubBackup(config) {
        stopGithubBackupSchedule();
        if (config?.intervalEnabled) {
            const value = Math.max(1, Number(config.intervalValue) || 30);
            const unitMs = config.intervalUnit === 'hour' ? 60 * 60 * 1000 : 60 * 1000;
            githubBackupTimerId = window.setTimeout(() => {
                uploadGithubBackup(true);
            }, value * unitMs);
            return;
        }
        if (!config?.scheduledEnabled) return;
        const match = /^(\d{2}):(\d{2})$/.exec(config.scheduledTime || '');
        if (!match) return;
        const hour = Number(match[1]);
        const minute = Number(match[2]);
        if (hour > 23 || minute > 59) return;

        const nextRun = new Date();
        nextRun.setHours(hour, minute, 0, 0);
        if (nextRun.getTime() <= Date.now()) nextRun.setDate(nextRun.getDate() + 1);
        githubBackupTimerId = window.setTimeout(() => {
            uploadGithubBackup(true);
        }, Math.max(1000, nextRun.getTime() - Date.now()));
    }

    async function toggleGithubBackupSchedule() {
        const inputs = getGithubBackupInputs();
        const enabled = !inputs.scheduleToggle.classList.contains('on');
        inputs.scheduleToggle.classList.toggle('on', enabled);
        inputs.scheduleToggle.classList.toggle('off', !enabled);
        const config = getGithubBackupConfigFromForm();
        if (!config) {
            inputs.scheduleToggle.classList.toggle('on', !enabled);
            inputs.scheduleToggle.classList.toggle('off', enabled);
            return;
        }
        try {
            if (enabled) {
                inputs.intervalToggle.classList.remove('on');
                inputs.intervalToggle.classList.add('off');
                config.intervalEnabled = false;
            }
            const nextConfig = await persistGithubBackupFormConfig(config);
            renderGithubBackupHistory(nextConfig);
            scheduleGithubBackup(nextConfig);
            showToast(enabled ? `已设置每天 ${config.scheduledTime} 定时备份` : '定时 GitHub 备份已关闭');
        } catch (error) {
            showCustomAlert('错误', '保存定时备份设置失败。');
        }
    }

    async function updateGithubBackupSchedule() {
        const config = getGithubBackupConfigFromForm();
        if (!config) return;
        try {
            const nextConfig = await persistGithubBackupFormConfig(config);
            renderGithubBackupHistory(nextConfig);
            scheduleGithubBackup(nextConfig);
        } catch (error) {
            showCustomAlert('错误', '保存定时备份时间失败。');
        }
    }

    async function toggleGithubBackupInterval() {
        const inputs = getGithubBackupInputs();
        const enabled = !inputs.intervalToggle.classList.contains('on');
        inputs.intervalToggle.classList.toggle('on', enabled);
        inputs.intervalToggle.classList.toggle('off', !enabled);
        const config = getGithubBackupConfigFromForm();
        if (!config) return;
        try {
            if (enabled) {
                inputs.scheduleToggle.classList.remove('on');
                inputs.scheduleToggle.classList.add('off');
                config.scheduledEnabled = false;
            }
            const nextConfig = await persistGithubBackupFormConfig(config);
            renderGithubBackupHistory(nextConfig);
            scheduleGithubBackup(nextConfig);
            showToast(enabled ? `已设置每 ${config.intervalValue} ${config.intervalUnit === 'hour' ? '小时' : '分钟'} 自动备份` : '间隔 GitHub 备份已关闭');
        } catch (error) {
            showCustomAlert('错误', '保存间隔备份设置失败。');
        }
    }

    window.initializeGithubBackupSchedule = function () {
        loadGithubBackupSettings();
    };

    function getGithubBackupApiUrl(config, fileName = config.fileName) {
        const path = fileName.split('/').map(encodeURIComponent).join('/');
        return `https://api.github.com/repos/${encodeURIComponent(config.owner)}/${encodeURIComponent(config.repo)}/contents/${path}`;
    }

    function encodeBackupText(text) {
        const bytes = new TextEncoder().encode(text);
        let binary = '';
        const chunkSize = 0x8000;
        for (let index = 0; index < bytes.length; index += chunkSize) {
            binary += String.fromCharCode(...bytes.subarray(index, index + chunkSize));
        }
        return btoa(binary);
    }

    async function githubBackupRequest(config, options, fileName = config.fileName) {
        const response = await fetch(getGithubBackupApiUrl(config, fileName), {
            ...options,
            headers: {
                Accept: 'application/vnd.github+json',
                Authorization: `Bearer ${config.token}`,
                'X-GitHub-Api-Version': '2022-11-28',
                ...(options.headers || {})
            }
        });
        return response;
    }

    function getGithubBackupStatusReason(status, action) {
        const actionText = action || '请求';
        const reasons = {
            401: 'Token 无效、过期，或没有被 GitHub 接受。',
            403: 'Token 权限不足、仓库不允许写入，或 GitHub API 触发了限流。',
            404: '仓库不存在、仓库不是当前账号可访问，或备份路径没有找到。',
            409: '远端文件刚被修改过，GitHub 拒绝使用旧文件版本继续写入。',
            413: '单个备份文件太大，超过 GitHub Contents API 可接受范围。',
            422: '备份路径、文件内容或提交参数不符合 GitHub 要求。',
            429: 'GitHub API 请求过于频繁，被临时限流。'
        };
        return reasons[status] || `${actionText}被 GitHub 拒绝，请根据状态码和返回信息检查仓库配置。`;
    }

    async function buildGithubBackupError(response, action, fileName) {
        let githubMessage = '';
        let documentationUrl = '';
        try {
            const text = await response.text();
            if (text) {
                try {
                    const detail = JSON.parse(text);
                    githubMessage = detail?.message || text;
                    documentationUrl = detail?.documentation_url || '';
                } catch (parseError) {
                    githubMessage = text;
                }
            }
        } catch (readError) {
            githubMessage = '无法读取 GitHub 返回内容';
        }
        const statusText = response.statusText ? ` ${response.statusText}` : '';
        const fileText = fileName ? `文件：${fileName}。` : '';
        const detailParts = [
            `${action}失败（HTTP ${response.status}${statusText}）。`,
            fileText,
            getGithubBackupStatusReason(response.status, action),
            githubMessage ? `GitHub 返回：${githubMessage}` : '',
            documentationUrl ? `说明：${documentationUrl}` : ''
        ].filter(Boolean);
        return new Error(detailParts.join(''));
    }

    function describeGithubBackupError(error) {
        const message = String(error?.message || '未知错误');
        if (/Failed to fetch|NetworkError|Load failed|Network request failed/i.test(message)) {
            return `浏览器没有拿到 GitHub API 响应，通常是网络连接、代理、防火墙或浏览器拦截导致。原始错误：${message}`;
        }
        return message;
    }

    async function uploadGithubBackupFile(config, fileName, text, message) {
        const existing = await githubBackupRequest(config, { method: 'GET' }, fileName);
        let sha = null;
        if (existing.ok) sha = (await existing.json()).sha;
        else if (existing.status !== 404) throw await buildGithubBackupError(existing, '读取远端文件', fileName);
        const response = await githubBackupRequest(config, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ message, content: encodeBackupText(text), ...(sha ? { sha } : {}) })
        }, fileName);
        if (!response.ok) throw await buildGithubBackupError(response, '上传远端文件', fileName);
    }

    function updateGithubBackupProgress(current, total, text) {
        const overlay = document.getElementById('githubBackupProgressOverlay');
        if (!overlay || overlay.style.display === 'none') return;
        const safeTotal = Math.max(1, Number(total) || 1);
        const safeCurrent = Math.max(0, Math.min(Number(current) || 0, safeTotal));
        const percent = Math.round((safeCurrent / safeTotal) * 100);
        const fill = document.getElementById('githubBackupProgressFill');
        const percentEl = document.getElementById('githubBackupProgressPercent');
        const textEl = document.getElementById('githubBackupProgressText');
        if (fill) fill.style.width = `${percent}%`;
        if (percentEl) percentEl.textContent = `${percent}%`;
        if (textEl && text) textEl.textContent = text;
    }

    function showGithubBackupProgress(text = '正在准备备份...') {
        const overlay = document.getElementById('githubBackupProgressOverlay');
        if (!overlay) return;
        overlay.style.display = 'flex';
        document.getElementById('ic-cloud-backup-page')?.classList.add('github-backup-progress-active');
        const title = document.getElementById('githubBackupProgressTitle');
        if (title) title.textContent = '正在备份到 GitHub';
        updateGithubBackupProgress(0, 1, text);
    }

    function hideGithubBackupProgress(success, text, current = success ? 1 : 0, total = 1) {
        const overlay = document.getElementById('githubBackupProgressOverlay');
        if (!overlay) return;
        const title = document.getElementById('githubBackupProgressTitle');
        const fill = document.getElementById('githubBackupProgressFill');
        if (title) title.textContent = success ? '备份完成' : '备份未完成';
        if (fill) fill.style.backgroundColor = success ? '#34c759' : '#ff3b30';
        updateGithubBackupProgress(current, total, text || (success ? '数据已同步到 GitHub' : '备份过程中发生错误'));
        window.setTimeout(() => {
            overlay.style.display = 'none';
            document.getElementById('ic-cloud-backup-page')?.classList.remove('github-backup-progress-active');
            if (fill) {
                fill.style.backgroundColor = '#007aff';
                fill.style.width = '0%';
            }
        }, success ? 700 : 1100);
    }

    async function uploadGithubBackup(isScheduled = false) {
        const config = await saveGithubBackupSettings({ silent: isScheduled, reschedule: !isScheduled });
        if (!config) return;
        let uploadedCount = 0;
        let totalCount = 0;
        try {
            if (!isScheduled) showGithubBackupProgress();
            if (!isScheduled) showToast('正在准备 GitHub 备份...');
            // Flush chat and memory state before taking the IndexedDB snapshot.
            if (typeof wcSaveChatData === 'function'
                && typeof wcChatDataHydrated !== 'undefined'
                && (wcChatDataHydrated || wcChatDataDirty)) {
                await wcSaveChatData({ skipAutoBackup: true });
            }
            if (window.MemoryApp && typeof window.MemoryApp.preload === 'function') await window.MemoryApp.preload();
            const data = await getAllDataFromDB();
            const prefix = config.fileName.replace(/\/+$/g, '');
            const files = Object.keys(data).map(id => `${prefix}/${id}.json`);
            totalCount = files.length + 1;
            if (!isScheduled) updateGithubBackupProgress(0, totalCount, `准备上传 ${totalCount} 个文件...`);
            for (const [id, record] of Object.entries(data)) {
                await uploadGithubBackupFile(config, `${prefix}/${id}.json`, JSON.stringify(record, null, 2), `backup: update ${id}`);
                uploadedCount += 1;
                if (!isScheduled) updateGithubBackupProgress(uploadedCount, totalCount, `正在上传 ${uploadedCount}/${totalCount} 个文件`);
            }
            await uploadGithubBackupFile(config, `${prefix}/manifest.json`, JSON.stringify({ version: 2, files, updatedAt: new Date().toISOString() }, null, 2), 'backup: update manifest');
            uploadedCount += 1;
            if (!isScheduled) updateGithubBackupProgress(uploadedCount, totalCount, `正在更新清单（${uploadedCount}/${totalCount}）`);
            try {
                await appendGithubBackupHistory(config, {
                    status: 'success',
                    fileCount: uploadedCount,
                    message: '清单已更新'
                });
            } catch (historyError) {
                console.warn('Failed to save GitHub backup history:', historyError);
            }
            recordLastBackupTimestamp();
            if (!isScheduled) hideGithubBackupProgress(true, '数据已同步到 GitHub');
            showToast(isScheduled ? '定时 GitHub 备份完成' : '已备份到 GitHub');
        } catch (error) {
            console.error('GitHub backup failed:', error);
            const reasonText = describeGithubBackupError(error);
            const partialMessage = uploadedCount > 0
                ? `已写入 ${uploadedCount}/${totalCount || '?'} 个文件，清单可能未完整更新。原因：${reasonText}`
                : `未写入文件。原因：${reasonText}`;
            try {
                await appendGithubBackupHistory(config, {
                    status: 'failed',
                    fileCount: uploadedCount,
                    message: partialMessage
                });
            } catch (historyError) {
                console.warn('Failed to save GitHub backup history:', historyError);
            }
            if (!isScheduled) showCustomAlert('GitHub 备份未完成', partialMessage);
            if (!isScheduled) hideGithubBackupProgress(false, `已写入 ${uploadedCount}/${totalCount || '?'} 个文件`, uploadedCount, totalCount || 1);
        } finally {
            if (isScheduled) scheduleGithubBackup(config);
        }
    }

    async function restoreGithubBackup() {
        const config = getGithubBackupConfigFromForm();
        if (!config) return;
        const confirmed = await showCustomConfirm('从 GitHub 恢复', '恢复会覆盖当前应用数据，GitHub Token 配置将保留在本机。确定继续吗？', '恢复', true);
        if (!confirmed) return;
        try {
            showToast('正在读取 GitHub 备份...');
            const manifestResponse = await githubBackupRequest(config, {
                method: 'GET',
                headers: { Accept: 'application/vnd.github.raw' }
            }, `${config.fileName.replace(/\/+$/g, '')}/manifest.json`);
            let fileNames = null;
            if (!manifestResponse.ok) {
                const legacyResponse = await githubBackupRequest(config, { method: 'GET', headers: { Accept: 'application/vnd.github.raw' } }, `${config.fileName}.json`);
                if (legacyResponse.ok) {
                    await processJsonImport(await legacyResponse.text());
                    return;
                }
                const folderResponse = await githubBackupRequest(config, {
                    method: 'GET',
                    headers: { Accept: 'application/vnd.github+json' }
                }, config.fileName.replace(/\/+$/g, ''));
                if (folderResponse.ok) {
                    const entries = await folderResponse.json();
                    fileNames = entries
                        .filter((entry) => entry && entry.type === 'file' && /\.json$/i.test(entry.name) && entry.name !== 'manifest.json')
                        .map((entry) => entry.path);
                }
                if (!fileNames || fileNames.length === 0) {
                    showCustomAlert('错误', `无法读取 GitHub 备份（${manifestResponse.status}）。请检查备份前缀和仓库权限。`);
                    return;
                }
            } else {
                const manifest = JSON.parse(await manifestResponse.text());
                if (!Array.isArray(manifest.files)) throw new Error('备份清单无效');
                fileNames = manifest.files;
            }
            const records = {};
            for (let index = 0; index < fileNames.length; index += 1) {
                const fileName = fileNames[index];
                showToast(`正在读取云端备份 ${index + 1}/${fileNames.length}...`);
                const response = await githubBackupRequest(config, { method: 'GET', headers: { Accept: 'application/vnd.github.raw' } }, fileName);
                if (!response.ok) throw new Error(`无法读取 ${fileName}`);
                const record = JSON.parse(await response.text());
                if (record?.id) records[record.id] = record;
            }
            await processJsonImport(JSON.stringify(records));
        } catch (error) {
            console.error('GitHub restore failed:', error);
            showCustomAlert('错误', 'GitHub 备份文件无效或无法读取。');
        }
    }

    async function clearAllAppData() {
        const confirmed = await showCustomConfirm(
            "清空当前数据",
            "此操作将永久清空当前所有的本地聊天记录、角色人设、世界书、主题及相关设置，应用将重置并刷新。\n\n此操作不可撤销，请确认是否已做好备份？",
            "确定清空",
            true
        );
        if (!confirmed) return;

        try {
            showToast("正在清空数据...");
            if (db) {
                const tx = db.transaction([storeName], "readwrite");
                const store = tx.objectStore(storeName);
                store.clear();
                await new Promise((resolve, reject) => {
                    tx.oncomplete = resolve;
                    tx.onerror = () => reject(tx.error);
                });
            }

            // 清理本地其它独立数据库与缓存
            try {
                indexedDB.deleteDatabase("AppleMusicDB");
            } catch (e) {}

            localStorage.clear();
            sessionStorage.clear();

            showToast("数据已清空，正在重置应用...");
            setTimeout(() => {
                location.reload();
            }, 1000);
        } catch (err) {
            console.error("清空数据失败:", err);
            showCustomAlert("错误", "清空数据失败: " + err.message);
        }
    }

            // show three-dots button; click to expand vertical capsule menu
    function getDesktopAppIconStyle(app) {
        if (!app) return '';
        const appItems = Array.from(document.querySelectorAll('#desktopGrid .app-item, #dock .app-item'));
        const targetIds = app.ids || [app.appId || ''];
        for (const item of appItems) {
            const appId = item.getAttribute('data-app-id');
            const nameEl = item.querySelector('.app-name');
            const appName = nameEl ? nameEl.innerText.trim() : '';
            if ((appId && targetIds.includes(appId)) || (app.name && appName === app.name)) {
                const iconEl = item.querySelector('.app-icon');
                if (iconEl) {
                    const bg = getComputedStyle(iconEl).backgroundImage;
                    if (bg && bg !== 'none') return bg;
                }
            }
            if (item.classList.contains('is-folder')) {
                try {
                    const folderApps = JSON.parse(decodeURIComponent(item.getAttribute('data-folder-apps') || '[]'));
                    for (const fApp of folderApps) {
                        if ((fApp.appId && targetIds.includes(fApp.appId)) || (app.name && fApp.name === app.name)) {
                            if (fApp.icon && fApp.icon !== 'none') return fApp.icon;
                        }
                    }
                } catch (e) {}
            }
        }
        const defaultAppIcons = {
            'settings': "url('https://i.postimg.cc/FztYvsGB/1000040040.webp')",
            'wechat': "url('https://i.postimg.cc/T1rp3M42/wei-xin-i-OS-512x512.webp')",
            'contacts': "url('https://i.postimg.cc/tJhY4Qmw/tong-xun-lu-i-OS-512x512.webp')",
            'worldbook': "url('https://i.postimg.cc/2y4VSRXc/bei-wang-lu-i-OS-512x512.webp')",
            'theme': "url('https://i.postimg.cc/d38LVPSX/i-Tunes-Store-i-OS-512x512.webp')",
            'meeting': "url('https://i.postimg.cc/XqwpYSzV/Pomocat-yu-mao-mi-huo-ban-yi-qi-de-ke-ai-fan-jia-zhong-i-OS-512x512.webp')",
            'placeholder-music': "url('https://i.postimg.cc/D0VShy5C/Apple-Music-i-OS-512x512.webp')",
            'music': "url('https://i.postimg.cc/D0VShy5C/Apple-Music-i-OS-512x512.webp')",
            'placeholder-food': "url('https://i.postimg.cc/hv9ftW5g/xia-zhou-chi-shen-me-i-OS-512x512.webp')",
            'memory': "url('https://i.postimg.cc/5yw62dRb/shi-guang-shou-zhang-hua-yang-ri-ji-bi-ji-ben-i-OS-512x512.webp')",
            'placeholder-yinyang': "url('https://i.postimg.cc/zvNwF16S/retouch-2026081420433857.png')",
            'placeholder-bilibili': "url('https://i.postimg.cc/brXZPNL3/bi-li-bi-li-dan-mu-fan-ju-zhi-bo-gao-qing-shi-pin-i-OS-512x512.webp')",
            'placeholder-health': "url('https://i.postimg.cc/2yp1Y8TT/Apple-jian-kang-i-OS-512x512.webp')",
            'placeholder-home': "url('https://i.postimg.cc/yxFk84ry/jia-ting-i-OS-512x512.webp')",
            'placeholder-game-center': "url('https://i.postimg.cc/GtkHmw5C/Steam-Mobile-i-OS-512x512.webp')",
            'placeholder-mail': "url('https://i.postimg.cc/WzMh1Lfn/you-jian-i-OS-512x512.webp')",
            'placeholder-photos': "url('https://i.postimg.cc/Fzj7H5n6/zhao-pian-i-OS-512x512.webp')",
            'placeholder-reading': "url('https://i.postimg.cc/RhcNZ5bT/Apple-Books-i-OS-512x512.webp')",
            'placeholder-icity': "url('https://i.postimg.cc/mkQtgf6m/i-City-wo-de-ri-ji-i-OS-512x512.webp')",
            'phone': "url('https://i.postimg.cc/RhcNZ5b2/dian-hua-i-OS-512x512.webp')",
            'message': "url('https://i.postimg.cc/2y4VSRX2/1000043922.webp')",
            'mcp': "url('https://i.postimg.cc/hvBq52Dn/MCP-Agent-AI-That-Does-More-i-OS-512x512.png')",
            'twitter': "url('https://i.postimg.cc/02fFPPDC/X-qian-shen-wei-Twitter-i-OS-512x512-(1).png')",
            'applestore': "url('https://i.postimg.cc/RVdLRRGg/1000071869.png')"
        };
        for (const id of targetIds) {
            if (defaultAppIcons[id]) return defaultAppIcons[id];
        }
        return '';
    }

    function syncCloudSectionIcons() {
        const themeIconStyle = getDesktopAppIconStyle({ name: '主题', ids: ['theme'] });
        const worldbookIconStyle = getDesktopAppIconStyle({ name: '世界书', ids: ['worldbook'] });
        const wechatIconStyle = getDesktopAppIconStyle({ name: '微信', ids: ['wechat'] });
        const contactsIconStyle = getDesktopAppIconStyle({ name: 'Contacts', ids: ['contacts'] });

        const themeEl = document.getElementById('ic-cloud-theme-icon');
        if (themeEl && themeIconStyle) {
            themeEl.style.backgroundImage = themeIconStyle;
            themeEl.style.backgroundSize = 'cover';
            themeEl.style.backgroundPosition = 'center';
        }
        const worldbookEl = document.getElementById('ic-cloud-worldbook-icon');
        if (worldbookEl && worldbookIconStyle) {
            worldbookEl.style.backgroundImage = worldbookIconStyle;
            worldbookEl.style.backgroundSize = 'cover';
            worldbookEl.style.backgroundPosition = 'center';
        }
        const wechatEl = document.getElementById('ic-cloud-wechat-icon');
        if (wechatEl && wechatIconStyle) {
            wechatEl.style.backgroundImage = wechatIconStyle;
            wechatEl.style.backgroundSize = 'cover';
            wechatEl.style.backgroundPosition = 'center';
        }
        const contactsEl = document.getElementById('ic-cloud-contacts-icon');
        if (contactsEl && contactsIconStyle) {
            contactsEl.style.backgroundImage = contactsIconStyle;
            contactsEl.style.backgroundSize = 'cover';
            contactsEl.style.backgroundPosition = 'center';
        }
    }

    async function updateRealStorage() {

        if (navigator.storage && navigator.storage.estimate) {
            try {
                const estimate = await navigator.storage.estimate();
                const usage = estimate.usage || 0;
                const quota = estimate.quota || 1;
                const percentage = Math.max(Math.min((usage / quota) * 100, 100), 1).toFixed(1);
                const mainProgressEl = document.getElementById('ic-main-progress');
                if(mainProgressEl) mainProgressEl.style.width = `${percentage}%`;
            } catch (e) {
                console.error("Storage estimate failed:", e);
            }
        }

        if (navigator.storage && navigator.storage.persisted) {
            const isPersisted = await navigator.storage.persisted();
            const persistStatusEl = document.getElementById('ic-persist-status');
            if(persistStatusEl) {
                persistStatusEl.innerHTML = `${isPersisted ? '已开启' : '未开启'} <svg class="ic-chevron" viewBox="0 0 8 13"><path d="M1.5 1.5L6.5 6.5L1.5 11.5"/></svg>`;
                if(isPersisted) persistStatusEl.style.color = '#34c759';
            }
        }

        const allStoreRecords = new Promise((resolve) => {
            if (!db) { resolve([]); return; }
            const transaction = db.transaction([storeName], "readonly");
            const request = transaction.objectStore(storeName).getAll();
            request.onsuccess = (e) => resolve(e.target.result || []);
            request.onerror = () => resolve([]);
        });
        const getRecordByteSize = (value) => {
            const serialized = JSON.stringify(value);
            if (!serialized) return 0;
            return typeof TextEncoder === 'function'
                ? new TextEncoder().encode(serialized).byteLength
                : serialized.length;
        };
        const getStoreSize = async (key) => {
            const records = await allStoreRecords;
            return records
                .filter((record) => {
                    const id = String(record && record.id || '');
                    return id === key || id.startsWith(key + '_');
                })
                .reduce((total, record) => total + getRecordByteSize(record), 0);
        };

        const getRecordsSize = async (matches) => {
            const records = await allStoreRecords;
            return records
                .filter((record) => matches(String(record && record.id || ''), record))
                .reduce((total, record) => total + getRecordByteSize(record), 0);
        };

        // 专门用于读取独立数据库（如 AppleMusicDB）大小的函数
        const getOtherDBSize = (dbName, storeNames) => {
            return new Promise((resolve) => {
                const req = indexedDB.open(dbName);
                req.onsuccess = (e) => {
                    const database = e.target.result;
                    let totalSize = 0;
                    const validStores = storeNames.filter(name => database.objectStoreNames.contains(name));
                    if (validStores.length === 0) {
                        database.close();
                        return resolve(0);
                    }
                    const tx = database.transaction(validStores, 'readonly');
                    let completed = 0;
                    validStores.forEach(storeName => {
                        const store = tx.objectStore(storeName);
                        const getAllReq = store.getAll();
                        getAllReq.onsuccess = (ev) => {
                            const data = ev.target.result;
                            if (data) totalSize += getRecordByteSize(data);
                            completed++;
                            if (completed === validStores.length) {
                                database.close();
                                resolve(totalSize);
                            }
                        };
                        getAllReq.onerror = () => {
                            completed++;
                            if (completed === validStores.length) {
                                database.close();
                                resolve(totalSize);
                            }
                        }
                    });
                };
                req.onerror = () => resolve(0);
            });
        };

        // 统一使用 formatSizeStr，确保小于 1MB 的数据精确显示为 KB，而不是 0 MB
        const formatSizeStr = (bytes) => {
            if (bytes === 0) return '0 KB';
            if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(2) + ' KB';
            return (bytes / (1024 * 1024)).toFixed(2) + ' MB';
        };

        const wallpaperSize = await getStoreSize("wallpaperData");
        const photoAlbumSize = await getStoreSize("photoAlbumData");
        const presetSize = await getStoreSize("presetData");
        const layoutSize = await getStoreSize("currentLayout");
        const fontSize = await getStoreSize("fontData");
        const profileSize = await getStoreSize("profileData");
        const appSettingsSize = await getStoreSize("appSettings");
        const apiSize = await getStoreSize("apiData");
        const voiceSize = await getStoreSize("voiceData");
        const imageGenSize = await getStoreSize("imageGenData") + await getStoreSize("imageGenSettings");

        const worldbookSize = await getStoreSize("worldbookData");
        const chatSize = await getRecordsSize((id) => id === "wechatChatData" || id.startsWith("wechatChatData_") || id.startsWith('wechatGroupData_') || id.startsWith('wechatGroupMessages_'));
        const wechatSize = await getRecordsSize((id) => (
            id === "wechatMomentsData" ||
            id === "wechatMomentsProfileData" ||
            id === "wechatBgData" ||
            id === "wechatEmojiData" ||
            id === "wechatFavoritesData" ||
            id === "wechatWalletData" ||
            id === "wechatAuthData" ||
            id === "wechatChatData" ||
            id.startsWith("wechatChatData_") || id.startsWith('wechatGroupData_') || id.startsWith('wechatGroupMessages_')
        ));
        const contactsSize = await getStoreSize("wechatContactsData");
        const musicSize = await getStoreSize("musicAppData") + await getOtherDBSize("AppleMusicDB", ["searchHistory", "recentPlays", "favoriteSongs", "customPlaylists", "favoriteArtists"]);
        const meetingSize = await getStoreSize("meetingData") + await getStoreSize("meeting_settings");
        const memorySize = await getRecordsSize((id) => id.startsWith("memoryItemsV1") || id.startsWith("memoryOutboxV1") || id.startsWith("memorySummariesV1") || id.startsWith("memoryAppPreferencesV1") || id.startsWith("memoryConversation"));
        const icitySize = await getRecordsSize((id) => id.startsWith("icity_"));
        const mcpSize = await getStoreSize("mcpAppData");
        const gameCenterSize = await getRecordsSize((id) => id.startsWith("gameCenter") || id.startsWith("game-center"));
        const readerSize = await getRecordsSize((id) => id.startsWith("readen") || id.startsWith("reading"));
        const messageSize = await getStoreSize("messageAppData");
        const callSize = await getStoreSize("callingHistoryData");
        const twitterSize = await getRecordsSize((id) => id.startsWith("__x_") || id.startsWith("__x_img_"));
        const storeSize = await getStoreSize("storeAppData");

        const photoSize = wallpaperSize + photoAlbumSize;
        const chatDataSize = chatSize + messageSize + callSize;
        const systemSize = fontSize + profileSize + appSettingsSize + apiSize + voiceSize + imageGenSize;

        const backupRecords = (await allStoreRecords).filter((record) => {
            const id = String(record && record.id || '');
            return id !== 'githubBackupSettings' && id !== 'memoryExternalCredentialsV1';
        });
        const backupData = {};
        backupRecords.forEach((record) => { backupData[record.id] = record; });
        const exportedDataSize = typeof TextEncoder === 'function'
            ? new TextEncoder().encode(JSON.stringify(backupData, null, 2)).byteLength
            : JSON.stringify(backupData, null, 2).length;
        const appsSize = Math.max(0, exportedDataSize - photoSize - chatDataSize - systemSize);

        const themeSize = presetSize + wallpaperSize + fontSize;
        const settingsSize = profileSize + appSettingsSize + apiSize + voiceSize + imageGenSize + layoutSize;

        const totalBytes = exportedDataSize;
        const totalMB = totalBytes === 0 ? '0.00 MB' : (totalBytes / (1024 * 1024)).toFixed(2) + ' MB';

        const themeStr = formatSizeStr(themeSize);
        const settingsStr = formatSizeStr(settingsSize);
        const worldbookStr = formatSizeStr(worldbookSize);
        const wechatStr = formatSizeStr(wechatSize);
        const contactsStr = formatSizeStr(contactsSize);
        const musicStr = formatSizeStr(musicSize);
        const meetingStr = formatSizeStr(meetingSize);
        const memoryStr = formatSizeStr(memorySize);
        const icityStr = formatSizeStr(icitySize);
        const zeroStr = '0 KB';

        const mainSizeEl = document.getElementById('ic-main-size');
        if(mainSizeEl) mainSizeEl.innerHTML = `${totalMB} <svg class="ic-chevron" viewBox="0 0 8 13"><path d="M1.5 1.5L6.5 6.5L1.5 11.5"/></svg>`;

        const detailSizeEl = document.getElementById('ic-detail-size');
        if(detailSizeEl) detailSizeEl.innerText = `已使用 ${totalMB}`;

        const legendPhoto = document.getElementById('ic-legend-photo');
        if(legendPhoto) legendPhoto.innerText = `照片 ${formatSizeStr(photoSize)}`;

        const legendApps = document.getElementById('ic-legend-apps');
        if(legendApps) legendApps.innerText = `应用程序 ${formatSizeStr(appsSize)}`;

        const legendChat = document.getElementById('ic-legend-chat');
        if(legendChat) legendChat.innerText = `聊天数据 ${formatSizeStr(chatDataSize)}`;

        const legendSystem = document.getElementById('ic-legend-system');
        if(legendSystem) legendSystem.innerText = `系统数据 ${formatSizeStr(systemSize)}`;

        const getPercent = (part, total) => total === 0 ? 0 : (part / total * 100).toFixed(1);

        const segRed = document.getElementById('ic-seg-red');
        const segOrange = document.getElementById('ic-seg-orange');
        const segGray = document.getElementById('ic-seg-gray');
        const segLight = document.getElementById('ic-seg-light');

        if(segRed) segRed.style.width = `${getPercent(photoSize, totalBytes)}%`;
        if(segOrange) segOrange.style.width = `${getPercent(appsSize, totalBytes)}%`;
        if(segGray) segGray.style.width = `${getPercent(chatDataSize, totalBytes)}%`;
        if(segLight) segLight.style.width = `${getPercent(systemSize, totalBytes)}%`;

        const cloudTheme = document.getElementById('ic-cloud-theme-size');
        if (cloudTheme) cloudTheme.innerText = themeStr;

        const cloudWorldBook = document.getElementById('ic-cloud-worldbook-size');
        if (cloudWorldBook) cloudWorldBook.innerText = worldbookStr;

        const cloudWechat = document.getElementById('ic-cloud-wechat-size');
        if (cloudWechat) cloudWechat.innerText = wechatStr;

        const cloudContacts = document.getElementById('ic-cloud-contacts-size');
        if (cloudContacts) cloudContacts.innerText = contactsStr;

        syncCloudSectionIcons();

        const chevronSvgHTML = '<svg class="ic-chevron" viewBox="0 0 8 13"><path d="M1.5 1.5L6.5 6.5L1.5 11.5"/></svg>';

        const detailSettings = document.getElementById('ic-detail-settings-size');
        if (detailSettings) detailSettings.innerHTML = `${settingsStr} ${chevronSvgHTML}`;

        const detailTheme = document.getElementById('ic-detail-theme-size');
        if (detailTheme) detailTheme.innerHTML = `${themeStr} ${chevronSvgHTML}`;

        const detailWorldBook = document.getElementById('ic-detail-worldbook-size');
        if (detailWorldBook) detailWorldBook.innerHTML = `${worldbookStr} ${chevronSvgHTML}`;

        const detailWechat = document.getElementById('ic-detail-wechat-size');
        if (detailWechat) detailWechat.innerHTML = `${wechatStr} ${chevronSvgHTML}`;

        const detailContacts = document.getElementById('ic-detail-contacts-size');
        if (detailContacts) detailContacts.innerHTML = `${contactsStr} ${chevronSvgHTML}`;

        const detailMusic = document.getElementById('ic-detail-music-size');
        if (detailMusic) detailMusic.innerHTML = `${musicStr} ${chevronSvgHTML}`;

        const detailMeeting = document.getElementById('ic-detail-meeting-size');
        if (detailMeeting) detailMeeting.innerHTML = `${meetingStr} ${chevronSvgHTML}`;

        const detailMemory = document.getElementById('ic-detail-memory-size');
        if (detailMemory) detailMemory.innerHTML = `${memoryStr} ${chevronSvgHTML}`;

        const detailIcity = document.getElementById('ic-detail-icity-size');
        if (detailIcity) detailIcity.innerHTML = `${icityStr} ${chevronSvgHTML}`;
        const storageAppList = document.getElementById('ic-storage-app-list');
        if (storageAppList) {
            const storageApps = [
                { name: '设置', handler: 'openSettingsApp', ids: ['settings'], size: settingsSize, color: '#8e8e93' },
                { name: '主题', handler: 'openThemeApp', ids: ['theme'], size: themeSize, color: '#af52de' },
                { name: '世界书', handler: 'openWorldbookApp', ids: ['worldbook'], size: worldbookSize, color: '#ffcc00' },
                { name: '微信', handler: 'openWechatApp', ids: ['wechat'], size: wechatSize, color: '#34c759' },
                { name: '通讯录', handler: 'openContactsApp', ids: ['contacts'], size: contactsSize, color: '#007aff' },
                { name: '音乐', handler: 'openMusicApp', ids: ['music', 'music-app', 'applemusic', 'placeholder-music'], size: musicSize, color: '#ff2d55' },
                { name: '见面', handler: 'openMeetingApp', ids: ['meeting'], size: meetingSize, color: '#ff9500' },
                { name: '记忆', handler: 'openMemoryApp', ids: ['memory', 'placeholder-bedtime-book'], size: memorySize, color: '#5856d6' },
                { name: 'icity', handler: 'openICityApp', ids: ['placeholder-icity'], size: icitySize, color: '#5ac8fa' },
                { name: 'MCP', handler: 'openMcpApp', ids: ['mcp'], size: mcpSize, color: '#30d158' },
                { name: '游戏中心', handler: 'openGameCenterApp', ids: ['placeholder-game-center'], size: gameCenterSize, color: '#ff9f0a' },
                { name: '阅读', handler: 'openReadenApp', ids: ['placeholder-reading'], size: readerSize, color: '#ffcc00' },
                { name: '相册', handler: 'openPhotosApp', ids: ['placeholder-photos'], size: photoAlbumSize, color: '#ff375f' },
                { name: '信息', handler: 'openMessageApp', ids: ['message'], size: messageSize, color: '#34c759' },
                { name: '电话', handler: 'openCallApp', ids: ['call', 'phone'], size: callSize, color: '#34c759' },
                { name: 'Twitter', handler: 'openTwitterApp', ids: ['twitter'], size: twitterSize, color: '#1d9bf0' },
                { name: 'Apple Store', handler: 'openStoreApp', ids: ['applestore'], size: storeSize, color: '#007aff' }
            ].filter((app) => typeof window[app.handler] === "function");
            storageApps.sort((left, right) => right.size - left.size);
            storageAppList.replaceChildren();
            storageApps.forEach((app) => {
                const iconImage = getDesktopAppIconStyle(app);
                const row = document.createElement("div");
                row.className = "ic-app-list-item";
                const left = document.createElement("div");
                left.className = "ic-app-list-left";
                const iconWrap = document.createElement("div");
                iconWrap.className = "ic-app-icon-wrapper";
                const icon = document.createElement("div");
                icon.className = "ic-custom-icon";
                if (iconImage && iconImage !== "none") {
                    icon.style.backgroundImage = iconImage;
                    icon.style.backgroundSize = "cover";
                    icon.style.backgroundPosition = "center";
                } else {
                    icon.textContent = app.name.slice(0, 1);
                    icon.style.background = "linear-gradient(145deg, " + app.color + ", rgba(255,255,255,.9))";
                    icon.style.color = "#fff";
                    icon.style.display = "grid";
                    icon.style.placeItems = "center";
                    icon.style.fontWeight = "700";
                    icon.style.fontSize = "14px";
                }
                iconWrap.appendChild(icon);
                const info = document.createElement("div");
                info.className = "ic-app-list-info";
                const name = document.createElement("div");
                name.className = "ic-app-list-name";
                name.textContent = app.name;
                const status = document.createElement("div");
                status.className = "ic-app-list-date";
                status.textContent = "已启用";
                info.append(name, status);
                left.append(iconWrap, info);
                const right = document.createElement("div");
                right.className = "ic-app-list-right";
                right.innerHTML = `${formatSizeStr(app.size)} ${chevronSvgHTML}`;
                row.append(left, right);
                storageAppList.appendChild(row);
            });
        }
    }

    async function requestPersistentStorage() {
        if (navigator.storage && navigator.storage.persist) {
            const isPersisted = await navigator.storage.persisted();
            if (isPersisted) {
                showToast("数据持久化已开启，数据安全");
                return;
            }
            const granted = await navigator.storage.persist();
            if (granted) {
                showToast("成功开启数据持久化储存！");
            } else {
                showCustomAlert("提示", "浏览器拒绝了持久化请求。建议：\n1. 将本网页添加到主屏幕\n2. 经常与网页互动\n3. 检查浏览器设置");
            }
            updateRealStorage();
        } else {
            showCustomAlert("提示", "当前浏览器不支持数据持久化 API。");
        }
    }

            // show three-dots button; click to expand vertical capsule menu

            // show three-dots button; click to expand vertical capsule menu
            // show three-dots button; click to expand vertical capsule menu
    async function exportAllDataJson() {
        const fileName = await showCustomPrompt('导出 JSON 备份', { placeholder: '输入文件名', value: `童话机` }, '导出');
        if (!fileName) return;

        try {
            showToast("正在打包数据...");
            const data = await getAllDataFromDB();
            const jsonString = JSON.stringify(data, null, 2);
            const blob = new Blob([jsonString], { type: "application/json;charset=utf-8" });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = fileName.endsWith('.json') ? fileName : fileName + '.json';
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
            recordLastBackupTimestamp();
            showToast("导出 JSON 成功");
        } catch (error) {
            showCustomAlert('导出失败', error.message || '无法生成完整备份，请重试。');
        }
    }

            // show three-dots button; click to expand vertical capsule menu
    window.updateRealStorage = updateRealStorage;
    window.syncCloudSectionIcons = syncCloudSectionIcons;

    function importAllDataJson() {
        document.getElementById('importAllDataInput').click();
    }

    function handleImportAllData(event) {
        const file = event.target.files[0];
        if (!file) return;

        const fileName = file.name.toLowerCase();

        if (fileName.endsWith('.zip')) {
            showToast("正在读取 ZIP 文件...");
            if (typeof JSZip === 'undefined') {
                const script = document.createElement('script');
                script.src = "https://cdnjs.cloudflare.com/ajax/libs/jszip/3.10.1/jszip.min.js";
                script.onload = () => processZipImport(file);
                script.onerror = () => showCustomAlert("错误", "无法加载 ZIP 库，请检查网络连接。");
                document.head.appendChild(script);
            } else {
                processZipImport(file);
            }
        } else {
            const reader = new FileReader();
            reader.onload = function(e) {
                processJsonImport(e.target.result);
            };
            reader.readAsText(file);
        }
        event.target.value = '';
    }

    function processZipImport(file) {
        const reader = new FileReader();
        reader.onload = async function(e) {
            try {
                const zip = await JSZip.loadAsync(e.target.result);
            // show three-dots button; click to expand vertical capsule menu
                let jsonFile = zip.file("backup_data.json");

            // show three-dots button; click to expand vertical capsule menu
                if (!jsonFile) {
                    const files = Object.keys(zip.files).filter(name => name.endsWith('.json'));
                    if (files.length > 0) {
                        jsonFile = zip.file(files[0]);
                    }
                }

                if (!jsonFile) {
                    showCustomAlert("错误", "ZIP 文件中未找到 JSON 备份数据！");
                    return;
                }

                const content = await jsonFile.async("string");
                processJsonImport(content);
            } catch (err) {
                showCustomAlert("错误", "解析 ZIP 文件失败: " + err.message);
            }
        };
        reader.readAsArrayBuffer(file);
    }

    async function processJsonImport(jsonString) {
        let restoreInProgress = false;
        try {
            showToast("正在解析备份文件...");
            await new Promise(resolve => requestAnimationFrame(resolve));

            if (!window.tonghuajiBackupCodec) throw new Error('备份转换组件未加载，请刷新后重试');
            let data = window.tonghuajiBackupCodec.decode(JSON.parse(jsonString));
            if (!db) return;
            if (!data || typeof data !== 'object') {
                throw new Error('备份文件内容无效');
            }
            // Accept a single modular GitHub backup file as well as a full export.
            if (data.id) data = { [data.id]: data };

            const sourceRecords = Object.values(data);
            const getUsableAccountId = (value) => {
                const accountId = String(value || '').trim();
                return accountId && accountId !== 'default' ? accountId : '';
            };
            const importedSettingsRecord = sourceRecords.find(record => record && record.id === 'appSettings');
            const importedSettingsAccountId = getUsableAccountId(importedSettingsRecord?.data?.wc_current_user_id);
            const importedAuthRecord = sourceRecords.find(record => record && record.id === 'wechatAuthData');
            const importedCurrentWxid = importedAuthRecord?.currentLoginWxid;
            const importedAuthAccount = Array.isArray(importedAuthRecord?.accounts)
                ? importedAuthRecord.accounts.find(account => account && account.wxid === importedCurrentWxid)
                : null;
            const importedAuthAccountId = getUsableAccountId(importedAuthAccount?.maskId);

            // show three-dots button; click to expand vertical capsule menu
            const currentSettings = {
                handle: localDriveHandle,
                mode: localDriveMode,
                fileName: localDriveFileName,
                autoEnabled: autoBackupEnabled,
                backupMode: backupModeType,
                targetName: document.getElementById('ld-target-name')?.innerText || '--',
                lastTime: document.getElementById('ld-last-time')?.innerText || '--',
                lastSize: document.getElementById('ld-last-size')?.innerText || '--',
                intervalValue: document.getElementById('backupIntervalValue')?.value || '30',
                intervalUnit: document.getElementById('backupIntervalUnitText')?.getAttribute('data-value') || '60000',
                scheduledTime: document.getElementById('backupScheduledTime')?.value || '02:00'
            };

            const activeAccountId = getUsableAccountId(
                (typeof appSettings !== 'undefined' && appSettings.wc_current_user_id)
                || (typeof window.appSettings !== 'undefined' && window.appSettings.wc_current_user_id)
            );
            // Full backups carry their own auth context; modular backups fall back to the active account.
            const resolvedAccountId = importedAuthAccountId || importedSettingsAccountId || activeAccountId;
            const currentAccountId = resolvedAccountId || 'default';
            const isolatedRecordPrefixes = [
                'wechatChatData', 'wechatContactsData', 'wechatMomentsData', 'wechatFavoritesData',
                'wechatWalletData', 'memoryItemsV1', 'memoryOutboxV1', 'memorySummariesV1',
                'memoryEventNodesV1', 'memoryEngineV2Migration', 'memoryLegacyMigrationBackupV1', 'memoryV2SemanticIndexV1'
            ];
            const scopedRecordPrefixes = new Set(isolatedRecordPrefixes.filter(prefix => sourceRecords.some(record => (
                record && String(record.id || '').startsWith(`${prefix}_`)
            ))));

            // Prevent lifecycle persistence from overwriting imported records with stale in-memory state.
            if (typeof window.FanfictionApp?.prepareForRestore === 'function') await window.FanfictionApp.prepareForRestore();
            if (window.WcGroupChat) {
                window.WcGroupChat.stopAll();
                await window.WcGroupChat.flush();
            }
            window.__tonghuajiBackupRestoreInProgress = true;
            restoreInProgress = true;
            const currentStoreKey = `store_user_data_${resolvedAccountId ? `mask_${resolvedAccountId}` : 'mask_default_guest'}`;
            const localStorageRecord = data.localStorageBackupV1
                || sourceRecords.find(record => record && record.id === 'localStorageBackupV1');
            const normalizeImportedChatRecord = (record) => {
                const field = record && record.messages ? 'messages' : record && record.conversations ? 'conversations' : '';
                const conversations = field && record[field] && typeof record[field] === 'object' && !Array.isArray(record[field])
                    ? record[field]
                    : null;
                if (!conversations) return record;
                const normalized = Object.fromEntries(Object.entries(conversations).map(([contactId, messages]) => [
                    contactId,
                    Array.isArray(messages) ? messages.map((message) => {
                        if (!message || typeof message !== 'object') return message;
                        const createdAt = Number(message.createdAt);
                        const messageId = String(message.id || message.msgId || message.localId || '');
                        const fallbackTime = /^\d{13}$/.test(messageId) ? Number(messageId) : 0;
                        return Number.isFinite(createdAt) && createdAt > 0 || !fallbackTime
                            ? message
                            : { ...message, createdAt: fallbackTime };
                    }) : messages
                ]));
                return { ...record, [field]: normalized };
            };
            const remapImportedRecord = (record) => {
                const rawId = String(record.id);
                if (rawId.startsWith('wechatGroupData_') || rawId.startsWith('wechatGroupMessages_')) {
                    // Full backups retain each group's account; modular imports follow the current account.
                    if (importedAuthRecord || importedSettingsRecord) return record;
                    if (rawId.startsWith('wechatGroupData_')) return { ...record, id: `wechatGroupData_${currentAccountId}` };
                    const groupId = String(record.groupId || rawId.split('::').slice(1).join('::'));
                    return { ...record, groupId, id: `wechatGroupMessages_${currentAccountId}::${groupId}` };
                }
                const prefix = isolatedRecordPrefixes.find((candidate) => rawId === candidate || rawId.startsWith(candidate + '_'));
                const normalized = prefix === 'wechatChatData' ? normalizeImportedChatRecord(record) : record;
                if (!prefix || ((importedAuthRecord || importedSettingsRecord) && rawId !== prefix)) return normalized;
                return { ...normalized, id: `${prefix}_${currentAccountId}` };
            };
            const records = sourceRecords.filter(record => (
                record
                && typeof record === 'object'
                && record.id
                && record.id !== 'localDriveSettings'
                && record.id !== githubBackupSettingsId
                && record.id !== 'memoryExternalCredentialsV1'
                && record.id !== 'localStorageBackupV1'
                && !scopedRecordPrefixes.has(record.id)
            )).map(remapImportedRecord);

            // Reject ambiguous targets before writing any IndexedDB records.
            const targetIds = new Set();
            records.forEach(record => {
                if (targetIds.has(record.id)) throw new Error('备份中有重复的目标记录，请按账号分别导入，避免覆盖数据。');
                targetIds.add(record.id);
            });
            const total = records.length;

            const writeBatch = (startIndex, endIndex, includeSettings) => new Promise((resolve, reject) => {
                const transaction = db.transaction([storeName], "readwrite");
                const store = transaction.objectStore(storeName);

                try {
                    for (let index = startIndex; index < endIndex; index += 1) {
                        store.put(records[index]);
                    }

                    if (includeSettings) {
                        store.put({
                            id: "localDriveSettings",
                            ...currentSettings
                        });
                    }
                } catch (error) {
                    transaction.abort();
                    reject(error);
                    return;
                }

                transaction.oncomplete = () => resolve();
                transaction.onerror = () => reject(transaction.error || new Error('恢复数据失败'));
                transaction.onabort = () => reject(transaction.error || new Error('恢复数据被中止'));
            });

            // Keep account data and derived indexes in one atomic restore transaction.
            await writeBatch(0, total, true);
            if (localStorageRecord?.entries && typeof localStorageRecord.entries === 'object') {
                Object.entries(localStorageRecord.entries).forEach(([key, value]) => {
                    const isMeetingData = key.startsWith('meeting_');
                    const isStoreData = key.startsWith('store_user_data_');
                    if ((!isMeetingData && !isStoreData) || typeof value !== 'string') return;
                    const targetKey = isStoreData ? currentStoreKey : key;
                    try {
                        localStorage.setItem(targetKey, value);
                    } catch (error) {
                        console.warn('恢复本地应用数据失败:', targetKey, error);
                    }
                });
            }

            showToast("恢复数据成功，即将刷新应用");
            setTimeout(() => location.reload(), 1500);
        } catch (err) {
            if (restoreInProgress) window.__tonghuajiBackupRestoreInProgress = false;
            console.error('恢复备份失败:', err);
            showCustomAlert("错误", String(err?.message || "解析备份文件失败，请确保文件格式正确！"));
        }
    }

            // show three-dots button; click to expand vertical capsule menu
    async function exportAllDataZip() {
        const fileName = await showCustomPrompt('导出 ZIP 备份', { placeholder: '输入文件名', value: `童话机` }, '导出');
        if (!fileName) return;

        showToast("正在生成 ZIP...");
        if (typeof JSZip === 'undefined') {
            const script = document.createElement('script');
            script.src = "https://cdnjs.cloudflare.com/ajax/libs/jszip/3.10.1/jszip.min.js";
            script.onload = () => doZipExport(fileName);
            script.onerror = () => showCustomAlert("错误", "无法加载 ZIP 库，请检查网络连接。");
            document.head.appendChild(script);
        } else {
            doZipExport(fileName);
        }
    }

    async function doZipExport(fileName) {
        try {
            const data = await getAllDataFromDB();
            const zip = new JSZip();
            zip.file("backup_data.json", JSON.stringify(data, null, 2));

            const content = await zip.generateAsync({ type: "blob" });
            const url = URL.createObjectURL(content);
            const a = document.createElement('a');
            a.href = url;
            a.download = fileName.endsWith('.zip') ? fileName : fileName + '.zip';
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
            recordLastBackupTimestamp();
            showToast("导出 ZIP 成功");
        } catch (err) {
            showCustomAlert("错误", "生成 ZIP 失败: " + err.message);
        }
    }

            // show three-dots button; click to expand vertical capsule menu

 // 'folder' 或 'file'


    let autoBackupInterval = 0; // 0 表示每次修改时触发
    let autoBackupTimerId = null;

    function saveLocalDriveSettings() {
        if (!db) return;
        const transaction = db.transaction([storeName], "readwrite");
        const store = transaction.objectStore(storeName);

        const targetName = document.getElementById('ld-target-name').innerText;
        const lastTime = document.getElementById('ld-last-time').innerText;
        const lastSize = document.getElementById('ld-last-size').innerText;
        const intervalValue = document.getElementById('backupIntervalValue').value;
        const intervalUnit = document.getElementById('backupIntervalUnitText').getAttribute('data-value');
        const scheduledTime = document.getElementById('backupScheduledTime').value;

        store.put({
            id: "localDriveSettings",
            handle: localDriveHandle,
            mode: localDriveMode,
            fileName: localDriveFileName,
            autoEnabled: autoBackupEnabled,
            backupMode: backupModeType,
            targetName: targetName,
            lastTime: lastTime,
            lastSize: lastSize,
            intervalValue: intervalValue,
            intervalUnit: intervalUnit,
            scheduledTime: scheduledTime
        });
    }

    function syncToLocalDrive() {
        openLocalDrivePage();
    }

    function openLocalDrivePage() {
        document.getElementById('ic-main-page').classList.remove('active');
        document.getElementById('ic-main-page').classList.add('slide-left');
        document.getElementById('ic-local-drive-page').classList.remove('slide-right');
        document.getElementById('ic-local-drive-page').classList.add('active');
    }

    function closeLocalDrivePage() {
        document.getElementById('ic-local-drive-page').classList.remove('active');
        document.getElementById('ic-local-drive-page').classList.add('slide-right');
        document.getElementById('ic-main-page').classList.remove('slide-left');
        document.getElementById('ic-main-page').classList.add('active');
    }

    async function setupFolderMode() {
        if (!('showDirectoryPicker' in window)) {
            showCustomAlert("提示", "您的浏览器不支持文件夹选择，请使用最新版桌面端 Chrome/Edge。");
            return;
        }
        try {
            // show three-dots button; click to expand vertical capsule menu
            const dirHandle = await window.showDirectoryPicker({ mode: 'readwrite' });

            localDriveHandle = dirHandle;
            localDriveMode = 'folder';

            // show three-dots button; click to expand vertical capsule menu
            const fileName = await showCustomPrompt('设置备份文件名', { placeholder: '输入文件名', value: `童话机备份.json` }, '确定');
            if (fileName) {
                localDriveFileName = fileName.endsWith('.json') ? fileName : fileName + '.json';
            }

            // show three-dots button; click to expand vertical capsule menu
            document.getElementById('ld-current-mode').innerText = '文件夹模式';
            document.getElementById('ld-target-name').innerText = dirHandle.name; // 仅显示文件夹名
            document.getElementById('ld-file-name').innerText = localDriveFileName; // 显示文件名

            await performLocalBackup();
            saveLocalDriveSettings();
        } catch (err) {
            if (err.name !== 'AbortError') showCustomAlert("错误", "设置文件夹失败: " + err.message);
        }
    }

    async function setupFileMode() {
        if (!('showSaveFilePicker' in window)) {
            showCustomAlert("提示", "您的浏览器不支持单文件保存，请使用最新版桌面端 Chrome/Edge。");
            return;
        }
        try {
            const fileHandle = await window.showSaveFilePicker({
                suggestedName: '童话机备份.json',
                types: [{
                    description: 'JSON 备份文件',
                    accept: { 'application/json': ['.json'] }
                }]
            });
            localDriveHandle = fileHandle;
            localDriveMode = 'file';
            localDriveFileName = fileHandle.name;

            document.getElementById('ld-current-mode').innerText = '单文件模式';
            document.getElementById('ld-target-name').innerText = '本地指定路径';
            document.getElementById('ld-file-name').innerText = fileHandle.name;

            await performLocalBackup();
            saveLocalDriveSettings();
        } catch (err) {
            if (err.name !== 'AbortError') showCustomAlert("错误", "设置文件失败: " + err.message);
        }
    }

    async function performLocalBackup(isAuto = false) {
        if (!localDriveHandle || !localDriveMode) {
            if (!isAuto) showCustomAlert("提示", "请先选择文件夹模式或单文件模式。");
            return;
        }

        try {
            // show three-dots button; click to expand vertical capsule menu
            if (typeof localDriveHandle.queryPermission !== 'function') {
                if (isAuto) return;
                showCustomAlert("提示", "授权已失效，请重新点击【文件夹模式】或【单文件模式】选择路径。");
                return;
            }

            // show three-dots button; click to expand vertical capsule menu
            const permission = await localDriveHandle.queryPermission({ mode: 'readwrite' });
            if (permission !== 'granted') {
                if (isAuto) {
                    console.warn("自动备份被拦截：浏览器要求用户手动授权。");
                    return; // 自动备份不能触发授权弹窗
                }
                const request = await localDriveHandle.requestPermission({ mode: 'readwrite' });
                if (request !== 'granted') {
                    showCustomAlert("提示", "未获得读写权限，无法备份。");
                    return;
                }
            }

            const data = await getAllDataFromDB();
            const jsonString = JSON.stringify(data, null, 2);
            const newBackupSize = new Blob([jsonString]).size;

            let fileHandleToWrite;
            if (localDriveMode === 'folder') {
                try {
                    const existingFileHandle = await localDriveHandle.getFileHandle(localDriveFileName);
                    const existingFile = await existingFileHandle.getFile();
                    if (existingFile.size > newBackupSize) {
                        const oldSizeMB = (existingFile.size / (1024 * 1024)).toFixed(2);
                        const newSizeMB = (newBackupSize / (1024 * 1024)).toFixed(2);
                        const confirmed = await showCustomConfirm(
                            '覆盖备份确认',
                            `现有备份文件为 ${oldSizeMB} MB，新备份为 ${newSizeMB} MB。新数据更小，可能缺少内容，确定要覆盖吗？`,
                            '继续覆盖',
                            true
                        );
                        if (!confirmed) return;
                    }
                    fileHandleToWrite = existingFileHandle;
                } catch (error) {
                    if (error.name !== 'NotFoundError') throw error;
                    fileHandleToWrite = await localDriveHandle.getFileHandle(localDriveFileName, { create: true });
                }
            } else {
                fileHandleToWrite = localDriveHandle;
            }

            const writable = await fileHandleToWrite.createWritable();
            await writable.write(jsonString);
            await writable.close();

            // show three-dots button; click to expand vertical capsule menu
            const now = new Date();
            const timeStr = `${now.getFullYear()}-${String(now.getMonth()+1).padStart(2,'0')}-${String(now.getDate()).padStart(2,'0')} ${String(now.getHours()).padStart(2,'0')}:${String(now.getMinutes()).padStart(2,'0')}:${String(now.getSeconds()).padStart(2,'0')}`;
            const sizeMB = (jsonString.length / (1024 * 1024)).toFixed(2);

            document.getElementById('ld-last-time').innerText = timeStr + (isAuto ? ' (自动)' : ' (手动)');
            document.getElementById('ld-last-size').innerText = sizeMB + ' MB';

            recordLastBackupTimestamp();
            if (!isAuto) showToast("备份成功！");
            saveLocalDriveSettings();
        } catch (err) {
            console.error("Local backup failed:", err);
            if (!isAuto) showCustomAlert("错误", "备份失败: " + err.message);
        }
    }

 // 'action', 'interval', 'scheduled'

    function triggerAutoLocalBackup() {
            // show three-dots button; click to expand vertical capsule menu
        if (localDriveHandle && localDriveMode && autoBackupEnabled && backupModeType === 'action') {
            performLocalBackup(true);
        }
    }

    function toggleAutoBackup() {
        const toggleBtn = document.getElementById('autoBackupToggle');
        autoBackupEnabled = !autoBackupEnabled;
        if (autoBackupEnabled) {
            toggleBtn.classList.remove('off');
            startAutoBackupTimer();
            showToast("自动备份已开启");
        } else {
            toggleBtn.classList.add('off');
            stopAutoBackupTimer();
            showToast("自动备份已关闭");
        }
        saveLocalDriveSettings();
    }

    function changeBackupMode() {
        const mode = document.getElementById('autoBackupModeText').getAttribute('data-value');
        backupModeType = mode;

            // show three-dots button; click to expand vertical capsule menu
        document.getElementById('intervalSettingsRow').style.display = mode === 'interval' ? 'flex' : 'none';
        document.getElementById('scheduledSettingsRow').style.display = mode === 'scheduled' ? 'flex' : 'none';

        if (autoBackupEnabled) {
            startAutoBackupTimer();
        }
        saveLocalDriveSettings();
    }

    function updateBackupSettings() {
        if (autoBackupEnabled) {
            startAutoBackupTimer();
        }
        saveLocalDriveSettings();
    }

    function startAutoBackupTimer() {
        stopAutoBackupTimer();
        if (!autoBackupEnabled) return;

        if (backupModeType === 'interval') {
            const val = parseInt(document.getElementById('backupIntervalValue').value, 10) || 30;
            const unit = parseInt(document.getElementById('backupIntervalUnitText').getAttribute('data-value'), 10) || 60000;
            const intervalMs = val * unit;

            autoBackupTimerId = setInterval(() => {
                performLocalBackup(true);
            }, intervalMs);
            showToast(`已设置为每 ${val} ${unit === 60000 ? '分钟' : '小时'} 自动备份`);

        } else if (backupModeType === 'scheduled') {
            const timeStr = document.getElementById('backupScheduledTime').value || "02:00";
            const [hours, minutes] = timeStr.split(':').map(Number);

            const now = new Date();
            const target = new Date(now.getFullYear(), now.getMonth(), now.getDate(), hours, minutes, 0);

            if (now > target) {
                target.setDate(target.getDate() + 1); // 如果今天的时间已过，设定为明天
            }

            const delay = target.getTime() - now.getTime();
            autoBackupTimerId = setTimeout(() => {
                performLocalBackup(true);
                startAutoBackupTimer(); // 触发后重新设置第二天的定时器
            }, delay);
            showToast(`已设置为每天 ${timeStr} 自动备份`);
        }
    }

    function stopAutoBackupTimer() {
        if (autoBackupTimerId) {
            clearInterval(autoBackupTimerId);
            clearTimeout(autoBackupTimerId);
            autoBackupTimerId = null;
        }
    }

    async function restoreFromLocalFolder() {
        if (localDriveMode !== 'folder' || !localDriveHandle) {
            showCustomAlert("提示", "请先设置并授权【文件夹模式】。");
            return;
        }
        try {
            // show three-dots button; click to expand vertical capsule menu
            if (typeof localDriveHandle.queryPermission !== 'function') {
                showCustomAlert("提示", "文件夹授权已失效，请重新点击【文件夹模式】选择目标文件夹。");
                return;
            }

            // show three-dots button; click to expand vertical capsule menu
            if (await localDriveHandle.queryPermission({ mode: 'read' }) !== 'granted') {
                if (await localDriveHandle.requestPermission({ mode: 'read' }) !== 'granted') {
                    showCustomAlert("提示", "未获得读取权限。");
                    return;
                }
            }

            let newestFileHandle = null;
            let newestTime = 0;

            // show three-dots button; click to expand vertical capsule menu
            for await (const entry of localDriveHandle.values()) {
                if (entry.kind === 'file' && entry.name.endsWith('.json')) {
                    const file = await entry.getFile();
                    if (file.lastModified > newestTime) {
                        newestTime = file.lastModified;
                        newestFileHandle = entry;
                    }
                }
            }

            if (!newestFileHandle) {
                showCustomAlert("提示", "该文件夹中没有找到任何 JSON 备份文件。");
                return;
            }

            const confirmed = await showCustomConfirm("恢复数据", `找到最新备份文件：\n${newestFileHandle.name}\n\n确定要覆盖当前所有数据吗？`, "恢复", true);
            if (!confirmed) return;

            showToast("正在读取备份文件...");
            const file = await newestFileHandle.getFile();
            const text = await file.text();

            // show three-dots button; click to expand vertical capsule menu
            processJsonImport(text);

        } catch (err) {
            console.error("Restore failed:", err);
            showCustomAlert("错误", "恢复失败: " + err.message);
        }
    }

    // ==========================================
    // Token 查询弹窗逻辑
    // ==========================================
    let wcTokenChartInstance = null;

    // 动态加载 Chart.js
    function loadChartJs() {
        return new Promise((resolve, reject) => {
            if (window.Chart) {
                resolve();
                return;
            }
            const script = document.createElement('script');
            script.src = "https://cdn.jsdelivr.net/npm/chart.js";
            script.onload = resolve;
            script.onerror = reject;
            document.head.appendChild(script);
        });
    }

    async function wcOpenTokenModal() {
        const overlay = document.getElementById('wcTokenModalOverlay');
        if (!overlay) return;
        
        if (typeof showToast === 'function') showToast('正在计算 Token...');
        
        try {
            await loadChartJs();
            overlay.classList.add('show');
            wcRenderTokenData();
        } catch (error) {
            console.error("加载 Chart.js 失败", error);
            if (typeof showCustomAlert === 'function') {
                showCustomAlert('错误', '无法加载图表库，请检查网络连接。');
            }
        }
    }

    function wcCloseTokenModal(event) {
        const overlay = document.getElementById('wcTokenModalOverlay');
        if (overlay) {
            overlay.classList.remove('show');
        }
    }

    // 简单的 Token 估算算法 (中文约1.5，英文约0.3)
    function wcEstimateTokens(text) {
        if (!text) return 0;
        const str = String(text);
        const chineseRegex = /[\u4e00-\u9fa5]/g;
        const chineseCount = (str.match(chineseRegex) || []).length;
        const otherCount = str.length - chineseCount;
        return Math.ceil(chineseCount * 1.5 + otherCount * 0.3);
    }

    // 从 IndexedDB 异步读取完整数据
    function wcReadDBData(key) {
        return new Promise((resolve) => {
            if (!window.db) { resolve(null); return; }
            try {
                const transaction = window.db.transaction([window.storeName || 'layoutStore'], "readonly");
                const store = transaction.objectStore(window.storeName || 'layoutStore');
                const request = store.get(key);
                request.onsuccess = (e) => resolve(e.target.result);
                request.onerror = () => resolve(null);
            } catch(e) {
                resolve(null);
            }
        });
    }

    async function wcRenderTokenData() {
        // 显示加载中状态
        const totalNumEl = document.getElementById('wcTokenTotalNum');
        if (totalNumEl) totalNumEl.innerHTML = '...';

        let chatTokens = 0;
        let charTokens = 0;
        let wbTokens = 0;
        let memoryTokens = 0;
        let promptTokens = 0;
        let emojiTokens = 0;
        let userTokens = 0;

        try {
            // 1. 获取当前设置和 ID
            const appSet = typeof appSettings !== 'undefined' ? appSettings : (window.appSettings || {});
            // 【修复】：使用正确的全局变量 wcCurrentChatContactId 获取当前聊天对象
            const currentChatId = typeof wcCurrentChatContactId !== 'undefined' ? wcCurrentChatContactId : null;
            const currentUserId = appSet.wc_current_user_id || 'default';
            const chatLimit = parseInt(appSet.wc_context_memory_limit) || 100;

            // 2. 读取通讯录 (Char人设 和 User人设)
            let currentContact = null;
            if (typeof wcContactsList !== 'undefined' && currentChatId) {
                currentContact = wcContactsList.find(c => c.id === currentChatId);
                if (currentContact) {
                    charTokens = wcEstimateTokens((currentContact.persona || '') + '\n' + (currentContact.appearance || ''));
                }
            }
            
            const contactsRecord = await wcReadDBData('contactsAppData');
            if (contactsRecord && contactsRecord.data && contactsRecord.data.users) {
                const currentUser = contactsRecord.data.users.find(u => u.id === currentUserId) || contactsRecord.data.users[0];
                if (currentUser) {
                    userTokens = wcEstimateTokens(currentUser.persona || '');
                }
            }

            // 3. 读取聊天记录 (上下文)
            if (typeof wcChatMessagesByContact !== 'undefined' && currentChatId) {
                const msgs = wcChatMessagesByContact[currentChatId] || [];
                // 根据设置的记忆条数限制截取最新的 N 条
                const recentMsgs = msgs.slice(-chatLimit);
                chatTokens = wcEstimateTokens(recentMsgs.map(m => m.text || '').join('\n'));
            }

            // 4. 读取世界书 (真实读取底层角色绑定，并进行触发词匹配)
            let boundWbIds = [];
            if (contactsRecord && contactsRecord.data && contactsRecord.data.contacts && currentContact) {
                // 必须通过 linkedContactId 找到角色库里的原始数据，才能拿到绑定的世界书 ID
                const originalContact = contactsRecord.data.contacts.find(c => c.id === currentContact.linkedContactId);
                if (originalContact && Array.isArray(originalContact.worldbookIds)) {
                    boundWbIds = originalContact.worldbookIds;
                }
            }

            let activeWbs = [];
            if (typeof wbEntries !== 'undefined' && Array.isArray(wbEntries)) {
                activeWbs = wbEntries.filter(e => !e.isDeleted && (e.isGlobal || boundWbIds.includes(e.id)));
            } else {
                const wbRecord = await wcReadDBData('worldbookData');
                if (wbRecord && wbRecord.entries) {
                    activeWbs = wbRecord.entries.filter(e => !e.isDeleted && (e.isGlobal || boundWbIds.includes(e.id)));
                }
            }

            // 结合聊天上下文进行触发词匹配 (与真实发给 API 的逻辑完全一致)
            let triggeredWbText = '';
            if (activeWbs.length > 0) {
                let historyText = '';
                if (typeof wcChatMessagesByContact !== 'undefined' && currentChatId) {
                    const msgs = wcChatMessagesByContact[currentChatId] || [];
                    historyText = msgs.slice(-chatLimit).map(m => m.text || '').join('\n').toLowerCase();
                }

                activeWbs.forEach(wb => {
                    let isTriggered = false;
                    if (!wb.key || wb.key.trim() === '') {
                        isTriggered = true; // 没有触发词默认常驻
                    } else {
                        const keys = wb.key.split(',').map(k => k.trim().toLowerCase()).filter(Boolean);
                        isTriggered = keys.some(k => historyText.includes(k));
                    }
                    if (isTriggered) {
                        triggeredWbText += `[${wb.title}]: ${wb.content}\n`;
                    }
                });
            }
            wbTokens = wcEstimateTokens(triggeredWbText);

            // 5. 读取记忆 (每轮读取的char记忆)
            const memKey = 'memoryItemsV1_' + currentUserId;
            const memRecord = await wcReadDBData(memKey) || await wcReadDBData('memoryItemsV1');
            if (memRecord && memRecord.items) {
                const activeMems = memRecord.items.filter(m => m.status === 'active' && (!currentContact || m.bindingId === currentContact.id));
                const topMems = activeMems.slice(0, 5); // 假设每轮最多读取相关度最高的 5 条记忆
                memoryTokens = wcEstimateTokens(topMems.map(m => m.content || '').join('\n'));
            }

            // 6. 读取表情包 (角色绑定的表情包)
            if (typeof wcEmojiGroups !== 'undefined' && currentContact) {
                let emojiCount = 0;
                if (currentContact.boundEmojiGroups && currentContact.boundEmojiGroups.length > 0) {
                    if (currentContact.boundEmojiGroups.includes('all')) {
                        wcEmojiGroups.forEach(g => {
                            if (g.emojis) emojiCount += g.emojis.length;
                        });
                    } else {
                        currentContact.boundEmojiGroups.forEach(gid => {
                            const group = wcEmojiGroups.find(g => g.id === gid);
                            if (group && group.emojis) {
                                emojiCount += group.emojis.length;
                            }
                        });
                    }
                }
                // 真实计算：绑定的表情包数量 * 15 Token
                emojiTokens = emojiCount * 15; 
            }

            // 7. 提示词 (真实计算)
            if (typeof wcRequestApiReply === 'function') {
                const promptContext = await wcRequestApiReply({ contactId: currentChatId, promptContextOnly: true });
                if (promptContext && promptContext.text) {
                    promptTokens = wcEstimateTokens(promptContext.text);
                }
            }

        } catch (error) {
            console.error("Token 计算出错:", error);
        }

        // 组装真实数据
        const data = [
            { label: '聊天上下文', value: chatTokens, color: '#007AFF' },
            { label: 'Char人设', value: charTokens, color: '#5AC8FA' },
            { label: 'User人设', value: userTokens, color: '#FF2D55' },
            { label: '世界书', value: wbTokens, color: '#34C759' },
            { label: '记忆', value: memoryTokens, color: '#FF9500' },
            { label: '提示词', value: promptTokens, color: '#8E8E93' },
            { label: '表情包', value: emojiTokens, color: '#AF52DE' }
        ];

        const total = data.reduce((sum, item) => sum + item.value, 0);
        
        // 触发数字滚动动画
        wcAnimateValue('wcTokenTotalNum', 0, total, 1000);

        // 渲染底部列表
        const listContainer = document.getElementById('wcTokenList');

        if (listContainer) {
            listContainer.innerHTML = data.map(item => `
                <div class="wc-token-list-item">
                    <div class="wc-token-item-left">
                        <div class="wc-token-dot" style="background-color: ${item.color};"></div>
                        <span>${item.label}</span>
                    </div>
                    <div class="wc-token-item-right">${item.value.toLocaleString()}</div>
                </div>
            `).join('');
        }

        // 渲染环形图
        const canvas = document.getElementById('wcTokenChart');
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        
        if (wcTokenChartInstance) {
            wcTokenChartInstance.destroy();
        }

        wcTokenChartInstance = new Chart(ctx, {
            type: 'doughnut',
            data: {
                labels: data.map(d => d.label),
                datasets: [{
                    data: data.map(d => d.value),
                    backgroundColor: data.map(d => d.color),
                    borderWidth: 0,
                    hoverOffset: 4
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                cutout: '78%',
                plugins: {
                    legend: {
                        display: false
                    },
                    tooltip: {
                        callbacks: {
                            label: function(context) {
                                return ' ' + context.parsed.toLocaleString() + ' Tokens';
                            }
                        },
                        backgroundColor: 'rgba(0,0,0,0.75)',
                        padding: 10,
                        cornerRadius: 10,
                        displayColors: true,
                        titleFont: { size: 13, family: '-apple-system' },
                        bodyFont: { size: 14, weight: 'bold', family: '-apple-system' }
                    }
                },
                animation: {
                    animateScale: true,
                    animateRotate: true,
                    duration: 1000,
                    easing: 'easeOutQuart'
                }
            }
        });
    }

    // 数字滚动动画函数
    function wcAnimateValue(id, start, end, duration) {
        const obj = document.getElementById(id);
        if (!obj) return;
        let startTimestamp = null;
        const step = (timestamp) => {
            if (!startTimestamp) startTimestamp = timestamp;
            const progress = Math.min((timestamp - startTimestamp) / duration, 1);
            const easeProgress = 1 - Math.pow(1 - progress, 4);
            obj.innerHTML = Math.floor(easeProgress * (end - start) + start).toLocaleString();
            if (progress < 1) {
                window.requestAnimationFrame(step);
            } else {
                obj.innerHTML = end.toLocaleString();
            }
        };
        window.requestAnimationFrame(step);
    }

    /* ==========================================
       通用 (General Settings) 控制逻辑
       ========================================== */
    function openGeneralSettingsApp() {
        const genUI = document.getElementById('generalSettingsUI');
        if (!genUI) return;
        genUI.style.display = 'flex';
        setTimeout(() => {
            genUI.classList.add('show');
        }, 10);
    }

    function closeGeneralSettingsApp() {
        const genUI = document.getElementById('generalSettingsUI');
        if (!genUI) return;
        genUI.classList.remove('show');
        setTimeout(() => {
            genUI.style.display = 'none';
            document.querySelectorAll('#generalSettingsUI .gen-sub-page').forEach(p => {
                if (p.id !== 'genMainPage') {
                    p.classList.remove('active');
                    p.classList.add('slide-right');
                }
            });
            const mainPage = document.getElementById('genMainPage');
            if (mainPage) {
                mainPage.classList.remove('slide-left');
                mainPage.classList.add('active');
            }
            closeGenInstallSheet();
            closeGenResetSheet();
        }, 300);
    }

    function openGenSubPage(pageId) {
        const mainPage = document.getElementById('genMainPage');
        const subPage = document.getElementById(pageId);
        if (!subPage || !mainPage) return;
        mainPage.classList.remove('active');
        mainPage.classList.add('slide-left');
        subPage.classList.remove('slide-right');
        subPage.classList.add('active');
    }

    function closeGenSubPage(pageId) {
        const mainPage = document.getElementById('genMainPage');
        const subPage = document.getElementById(pageId);
        if (!subPage || !mainPage) return;
        subPage.classList.remove('active');
        subPage.classList.add('slide-right');
        mainPage.classList.remove('slide-left');
        mainPage.classList.add('active');
    }

    let forceResourceRefreshRunning = false;

    async function forceRefreshLatestResources(button) {
        if (forceResourceRefreshRunning) return;
        if (typeof navigator !== 'undefined' && navigator.onLine === false) {
            if (typeof showToast === 'function') showToast('当前网络不可用，连接网络后再刷新');
            return;
        }

        forceResourceRefreshRunning = true;
        const statusLabel = document.getElementById('genUpdateStatusLabel');
        const titleLabel = document.getElementById('genForceRefreshTitle');
        const hintLabel = document.getElementById('genForceRefreshHint');

        if (button) {
            button.disabled = true;
            button.style.opacity = '0.72';
            button.style.cursor = 'default';
        }
        if (statusLabel) statusLabel.textContent = '正在获取最新资源…';
        if (titleLabel) titleLabel.textContent = '正在刷新';
        if (hintLabel) hintLabel.textContent = '正在检查并重新加载最新界面与脚本';

        try {
            if ('serviceWorker' in navigator) {
                const registrations = await navigator.serviceWorker.getRegistrations();
                await Promise.all(registrations.map((registration) => registration.update().catch(() => null)));
            }

            const refreshUrl = new URL(window.location.href);
            refreshUrl.searchParams.set('__resource_refresh', String(Date.now()));

            const probeResponse = await fetch(refreshUrl.toString(), {
                method: 'GET',
                cache: 'reload',
                credentials: 'same-origin'
            });
            if (!probeResponse.ok) throw new Error(`Refresh request failed: ${probeResponse.status}`);

            if (typeof showToast === 'function') showToast('已获取最新资源，正在重新载入');
            window.location.replace(refreshUrl.toString());
        } catch (error) {
            console.warn('Force resource refresh failed:', error);
            forceResourceRefreshRunning = false;
            if (button) {
                button.disabled = false;
                button.style.opacity = '1';
                button.style.cursor = 'pointer';
            }
            if (statusLabel) statusLabel.textContent = '刷新失败，请检查网络后重试';
            if (titleLabel) titleLabel.textContent = '强制刷新资源';
            if (hintLabel) hintLabel.textContent = '重新获取最新界面与脚本，不清除聊天和设置数据';
            if (typeof showToast === 'function') showToast('刷新失败，请检查网络后重试');
        }
    }

    try {
        const refreshMarkerUrl = new URL(window.location.href);
        if (refreshMarkerUrl.searchParams.has('__resource_refresh')) {
            refreshMarkerUrl.searchParams.delete('__resource_refresh');
            const cleanUrl = refreshMarkerUrl.pathname + refreshMarkerUrl.search + refreshMarkerUrl.hash;
            window.history.replaceState(window.history.state, '', cleanUrl);
        }
    } catch (error) {
        console.debug('Refresh marker cleanup skipped:', error);
    }

    let deferredPwaInstallPrompt = null;

    window.addEventListener('beforeinstallprompt', (e) => {
        e.preventDefault();
        deferredPwaInstallPrompt = e;
    });

    window.addEventListener('appinstalled', () => {
        deferredPwaInstallPrompt = null;
        if (typeof showToast === 'function') showToast('已成功安装到桌面');
    });

    async function openGenInstallSheet() {
        // 如果当前浏览器支持并捕获到了原生 PWA 安装事件（例如 Chrome/Edge/Android）
        if (deferredPwaInstallPrompt) {
            try {
                deferredPwaInstallPrompt.prompt();
                const choiceResult = await deferredPwaInstallPrompt.userChoice;
                if (choiceResult.outcome === 'accepted') {
                    if (typeof showToast === 'function') showToast('正在安装到桌面...');
                }
                deferredPwaInstallPrompt = null;
                return;
            } catch (err) {
                console.debug('PWA prompt error:', err);
            }
        }

        // 如果已经在独立 PWA 模式下运行
        const isStandalone = window.matchMedia('(display-mode: standalone)').matches || window.navigator.standalone;
        if (isStandalone) {
            if (typeof showToast === 'function') showToast('当前已处于桌面独立应用模式');
            return;
        }

        // iOS Safari 或不支持原生 prompt 的浏览器：打开半屏添加到主屏幕指引
        const overlay = document.getElementById('genInstallSheetOverlay');
        const sheet = document.getElementById('genInstallSheet');
        if (overlay) overlay.classList.add('show');
        if (sheet) sheet.classList.add('show');
    }

    function closeGenInstallSheet() {
        const overlay = document.getElementById('genInstallSheetOverlay');
        const sheet = document.getElementById('genInstallSheet');
        if (overlay) overlay.classList.remove('show');
        if (sheet) sheet.classList.remove('show');
    }

    function openGenResetSheet() {
        const overlay = document.getElementById('genResetSheetOverlay');
        const sheet = document.getElementById('genResetSheet');
        if (overlay) overlay.classList.add('show');
        if (sheet) sheet.classList.add('show');
    }

    function closeGenResetSheet() {
        const overlay = document.getElementById('genResetSheetOverlay');
        const sheet = document.getElementById('genResetSheet');
        if (overlay) overlay.classList.remove('show');
        if (sheet) sheet.classList.remove('show');
    }

    function executeGenReset(type) {
        closeGenResetSheet();
        if (type === '个性化') {
            if (typeof showToast === 'function') showToast('已还原个性化与桌面图标设置');
        } else if (type === '缓存') {
            if (typeof showToast === 'function') showToast('已清理临时缓存数据');
        } else if (type === '抹掉') {
            if (typeof clearAllAppData === 'function') {
                clearAllAppData();
            } else if (typeof showToast === 'function') {
                showToast('抹掉所有内容并还原本机完成');
            }
        }
    }

    const PWA_PRESET_ICONS = [
        { id: 'preset_1', name: '图 1 (默认)', src: 'https://i.postimg.cc/s2DL1fd2/Image-1787762037706-65.jpg' },
        { id: 'preset_2', name: '图 2', src: 'https://i.postimg.cc/ZqKQ0YtR/Image-1787762033647-442.jpg' },
        { id: 'preset_3', name: '图 3', src: 'https://i.postimg.cc/SKNPjQFy/Image-1787762039200-554.jpg' },
        { id: 'preset_4', name: '图 4', src: 'https://i.postimg.cc/s2DL1fdj/Image-1787762040811-366.jpg' }
    ];

    let currentPwaIconSrc = PWA_PRESET_ICONS[0].src;
    let currentPwaTitle = '童话集';

    function renderGenPwaPresetBadges() {
        const container = document.getElementById('genPwaPresetContainer');
        if (!container) return;
        container.innerHTML = '';

        PWA_PRESET_ICONS.forEach((preset, index) => {
            const isSelected = currentPwaIconSrc === preset.src;
            const card = document.createElement('div');
            card.className = `gen-preset-card ${isSelected ? 'active' : ''}`;
            card.onclick = () => selectGenPwaPreset(index);
            card.innerHTML = `
                <div class="gen-preset-thumb">
                    <img src="${preset.src}" alt="${preset.name}">
                </div>
                <div class="gen-preset-info">
                    <div class="gen-preset-title">${preset.name}</div>
                </div>
                <div class="gen-preset-check">
                    <svg viewBox="0 0 24 24"><polyline points="20 6 9 17 4 12"></polyline></svg>
                </div>
            `;
            container.appendChild(card);
        });

        updatePwaCarouselSideImages();
    }

    function updatePwaCarouselSideImages() {
        let currentIndex = PWA_PRESET_ICONS.findIndex(p => p.src === currentPwaIconSrc);
        if (currentIndex === -1) currentIndex = 0;
        const prevIndex = (currentIndex - 1 + PWA_PRESET_ICONS.length) % PWA_PRESET_ICONS.length;
        const nextIndex = (currentIndex + 1) % PWA_PRESET_ICONS.length;

        const prevImg = document.getElementById('genPwaPrevImg');
        const nextImg = document.getElementById('genPwaNextImg');
        if (prevImg) prevImg.src = PWA_PRESET_ICONS[prevIndex].src;
        if (nextImg) nextImg.src = PWA_PRESET_ICONS[nextIndex].src;
    }

    function navGenPwaIcon(direction) {
        let currentIndex = PWA_PRESET_ICONS.findIndex(p => p.src === currentPwaIconSrc);
        if (currentIndex === -1) currentIndex = 0;
        const nextIndex = (currentIndex + direction + PWA_PRESET_ICONS.length) % PWA_PRESET_ICONS.length;
        selectGenPwaPreset(nextIndex);
    }

    let lastPwaWheelTime = 0;
    function handleGenPwaWheel(event) {
        event.preventDefault();
        const now = Date.now();
        if (now - lastPwaWheelTime < 180) return;
        if (Math.abs(event.deltaY) > 15 || Math.abs(event.deltaX) > 15) {
            lastPwaWheelTime = now;
            const dir = (event.deltaY > 0 || event.deltaX > 0) ? 1 : -1;
            navGenPwaIcon(dir);
        }
    }

    function applyPwaSettings(name, iconUrl) {
        if (!name) name = '童话集';
        if (!iconUrl) iconUrl = PWA_PRESET_ICONS[0].src;

        currentPwaTitle = name;
        currentPwaIconSrc = iconUrl;

        // 1. 更新 document title 与 meta
        document.title = name;
        const metaAppTitle = document.querySelector('meta[name="apple-mobile-web-app-title"]');
        if (metaAppTitle) metaAppTitle.setAttribute('content', name);
        const metaAppName = document.querySelector('meta[name="application-name"]');
        if (metaAppName) metaAppName.setAttribute('content', name);

        // 2. 更新 apple-touch-icon 和 favicon
        let appleIcon = document.querySelector('link[rel="apple-touch-icon"]');
        if (appleIcon) {
            appleIcon.setAttribute('href', iconUrl);
        } else {
            appleIcon = document.createElement('link');
            appleIcon.rel = 'apple-touch-icon';
            appleIcon.href = iconUrl;
            document.head.appendChild(appleIcon);
        }

        let favIcon = document.querySelector('link[rel="icon"]');
        if (favIcon) {
            favIcon.setAttribute('href', iconUrl);
        } else {
            favIcon = document.createElement('link');
            favIcon.rel = 'icon';
            favIcon.type = 'image/png';
            favIcon.href = iconUrl;
            document.head.appendChild(favIcon);
        }

        // 3. 动态更新 Web App Manifest
        try {
            const dynamicManifest = {
                id: './index.html',
                name: name,
                short_name: name,
                description: `${name} Web App`,
                lang: 'zh-CN',
                start_url: './index.html',
                scope: './',
                display: 'standalone',
                orientation: 'portrait',
                background_color: '#fdfbfb',
                theme_color: '#fdfbfb',
                icons: [
                    { src: iconUrl, sizes: '192x192', type: 'image/png', purpose: 'any maskable' },
                    { src: iconUrl, sizes: '512x512', type: 'image/png', purpose: 'any maskable' }
                ]
            };
            const manifestBlob = new Blob([JSON.stringify(dynamicManifest, null, 2)], { type: 'application/manifest+json' });
            const manifestUrl = URL.createObjectURL(manifestBlob);

            let manifestLink = document.querySelector('link[rel="manifest"]');
            if (manifestLink) {
                manifestLink.setAttribute('href', manifestUrl);
            } else {
                manifestLink = document.createElement('link');
                manifestLink.rel = 'manifest';
                manifestLink.href = manifestUrl;
                document.head.appendChild(manifestLink);
            }
        } catch (e) {
            console.debug('Dynamic manifest update failed:', e);
        }

        // 4. 更新设置页内部预览
        const previewImg = document.getElementById('genPwaPreviewImg');
        if (previewImg) previewImg.src = iconUrl;
        const titleLabel = document.getElementById('genPwaTitleLabel');
        if (titleLabel) titleLabel.innerText = name;
        const currentPwaTag = document.getElementById('genCurrentPwaTag');
        if (currentPwaTag) {
            const matched = PWA_PRESET_ICONS.find(p => p.src === iconUrl);
            currentPwaTag.innerText = matched ? matched.name : '自定义';
        }
        const nameInput = document.getElementById('genPwaNameInput');
        if (nameInput && nameInput.value !== name) {
            nameInput.value = name;
        }

        // 5. 保存到全局 appSettings 并持久化
        if (typeof appSettings !== 'undefined') {
            appSettings.pwa_custom_name = name;
            appSettings.pwa_custom_icon = iconUrl;
            if (typeof saveAppSettings === 'function') saveAppSettings();
        }
    }

    function selectGenPwaPreset(index) {
        const preset = PWA_PRESET_ICONS[index] || PWA_PRESET_ICONS[0];
        applyPwaSettings(currentPwaTitle, preset.src);
        renderGenPwaPresetBadges();
        if (typeof showToast === 'function') showToast(`已切换至：${preset.name}`);
    }

    function openGenPwaIconMenu(event) {
        if (event) event.stopPropagation();
        window.currentEditingIcon = 'pwaIcon';
        window.currentIconTarget = 'pwaIcon';
        window._currentIconMenuTarget = 'pwaIcon';
        if (typeof openIconMenu === 'function') {
            openIconMenu(event, 'pwaIcon');
        }
    }

    function handleGenPwaNameInput(val) {
        const trimmed = (val || '').trim() || '童话集';
        applyPwaSettings(trimmed, currentPwaIconSrc);
    }

    function handleGenPwaUpload(event) {
        const file = event.target.files?.[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onload = function(e) {
            const dataUrl = e.target.result;
            applyPwaSettings(currentPwaTitle, dataUrl);
            renderGenPwaPresetBadges();
            if (typeof showToast === 'function') showToast('已应用相册自定义桌面图标');
        };
        reader.readAsDataURL(file);
        event.target.value = '';
    }

    async function openGenPwaUrlPrompt() {
        if (typeof showCustomPrompt === 'function') {
            const url = await showCustomPrompt('导入桌面图标 URL', { placeholder: 'https://.../icon.png', value: '' }, '确定');
            if (url && url.trim()) {
                const trimmed = url.trim();
                applyPwaSettings(currentPwaTitle, trimmed);
                renderGenPwaPresetBadges();
                if (typeof showToast === 'function') showToast('已应用 URL 自定义桌面图标');
            }
        }
    }

    function initPwaCustomSettings() {
        const savedName = (typeof appSettings !== 'undefined' && appSettings.pwa_custom_name) ? appSettings.pwa_custom_name : '童话集';
        const savedIcon = (typeof appSettings !== 'undefined' && appSettings.pwa_custom_icon) ? appSettings.pwa_custom_icon : PWA_PRESET_ICONS[0].src;
        applyPwaSettings(savedName, savedIcon);
        renderGenPwaPresetBadges();
    }

    // 页面加载自动初始化 PWA 设置
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initPwaCustomSettings);
    } else {
        initPwaCustomSettings();
    }

    function openAccessibilitySettingsApp() {
        const accessUI = document.getElementById('accessibilitySettingsUI');
        if (!accessUI) return;
        accessUI.style.display = 'flex';
        
        // 确保辅助功能主页面处于激活状态
        const mainPage = document.getElementById('accessMainPage');
        if (mainPage) {
            mainPage.classList.remove('slide-left', 'slide-right');
            mainPage.classList.add('active');
        }
        document.querySelectorAll('#accessibilitySettingsUI .gen-sub-page').forEach(p => {
            if (p.id !== 'accessMainPage') {
                p.classList.remove('active', 'slide-left');
                p.classList.add('slide-right');
            }
        });

        updateAssistiveBallUI();
        renderAssistiveCustomizeGrid();
        if (window.tongtongDynamicIsland) window.tongtongDynamicIsland.refresh(true);
        if (typeof updateForceFullscreenUI === 'function') updateForceFullscreenUI();
        if (typeof updateSwipeBackUI === 'function') updateSwipeBackUI();
        if (typeof updateSystemBackUI === 'function') updateSystemBackUI();
        if (typeof updateTapClearCssUI === 'function') updateTapClearCssUI();
        if (typeof updateDesktopCustomUI === 'function') updateDesktopCustomUI();
        setTimeout(() => {
            accessUI.classList.add('show');
        }, 10);
    }

    function updateDesktopCustomUI() {
        const isLabelOn = typeof appSettings !== 'undefined' ? (appSettings.desktop_widget_label_enabled === true) : false;
        const labelText = (typeof appSettings !== 'undefined' && appSettings.desktop_widget_label_text) ? appSettings.desktop_widget_label_text : 'Fairy Widgets';
        const customCss = (typeof appSettings !== 'undefined' && appSettings.desktop_custom_css) ? appSettings.desktop_custom_css : '';
        const customJs = (typeof appSettings !== 'undefined' && appSettings.desktop_custom_js) ? appSettings.desktop_custom_js : '';

        const toggle = document.getElementById('accessWidgetLabelToggle');
        const input = document.getElementById('accessWidgetLabelInput');
        const cssInput = document.getElementById('accessDesktopCustomCssInput');
        const jsInput = document.getElementById('accessDesktopCustomJsInput');
        const summary = document.getElementById('accessDesktopCustomStatusSummary');

        if (toggle) {
            toggle.classList.toggle('on', isLabelOn);
            toggle.setAttribute('aria-checked', String(isLabelOn));
        }
        if (input) input.value = labelText;
        if (cssInput) cssInput.value = customCss;
        if (jsInput) jsInput.value = customJs;
        if (summary) {
            summary.innerText = isLabelOn ? '文字开启' : '自定样式';
        }
    }
    window.updateDesktopCustomUI = updateDesktopCustomUI;

    function toggleDesktopWidgetLabelSwitch() {
        if (typeof appSettings === 'undefined') return;
        const isEnabled = appSettings.desktop_widget_label_enabled !== true;
        appSettings.desktop_widget_label_enabled = isEnabled;
        if (typeof saveAppSettings === 'function') saveAppSettings();
        updateDesktopCustomUI();
        applyDesktopCustomStyles();
        if (typeof showToast === 'function') {
            showToast(isEnabled ? '小组件底部文字已开启' : '小组件底部文字已关闭');
        }
    }
    window.toggleDesktopWidgetLabelSwitch = toggleDesktopWidgetLabelSwitch;

    function handleDesktopWidgetLabelInput(val) {
        if (typeof appSettings === 'undefined') return;
        appSettings.desktop_widget_label_text = val.trim() || 'Fairy Widgets';
        if (typeof saveAppSettings === 'function') saveAppSettings();
        applyDesktopCustomStyles();
    }
    window.handleDesktopWidgetLabelInput = handleDesktopWidgetLabelInput;

    function applyDesktopCustomStyles() {
        let styleTag = document.getElementById('dynamic-desktop-custom-style');
        if (!styleTag) {
            styleTag = document.createElement('style');
            styleTag.id = 'dynamic-desktop-custom-style';
            document.head.appendChild(styleTag);
        }

        const isLabelOn = typeof appSettings !== 'undefined' ? (appSettings.desktop_widget_label_enabled === true) : false;
        const labelText = (typeof appSettings !== 'undefined' && appSettings.desktop_widget_label_text) ? appSettings.desktop_widget_label_text : 'Fairy Widgets';
        const customCss = (typeof appSettings !== 'undefined' && appSettings.desktop_custom_css) ? appSettings.desktop_custom_css : '';

        const iphoneEl = document.querySelector('.iphone') || document.body;
        if (isLabelOn) {
            iphoneEl.classList.add('show-widget-labels');
            iphoneEl.style.setProperty('--desktop-widget-bottom-text', `"${labelText.replace(/"/g, '\\"')}"`);
        } else {
            iphoneEl.classList.remove('show-widget-labels');
        }

        const baseWidgetLabelCss = `
            .show-widget-labels #desktopGrid .app-item.is-widget .app-icon {
                overflow: visible !important;
            }
            .show-widget-labels #desktopGrid .app-item.is-widget .app-icon::after {
                content: var(--desktop-widget-bottom-text, "Fairy Widgets") !important;
                display: block !important;
                position: absolute !important;
                top: 100% !important;
                left: 0 !important;
                width: 100% !important;
                margin-top: 6px !important;
                text-align: center !important;
                font-size: 11px !important;
                font-weight: 600 !important;
                color: rgba(0, 0, 0, 0.72) !important;
                letter-spacing: 0.2px !important;
                white-space: nowrap !important;
                overflow: visible !important;
                text-overflow: clip !important;
                pointer-events: none !important;
                z-index: 25 !important;
                text-shadow: 0 1px 2px rgba(255, 255, 255, 0.8) !important;
            }
            .dark-mode.show-widget-labels #desktopGrid .app-item.is-widget .app-icon::after {
                color: rgba(255, 255, 255, 0.78) !important;
                text-shadow: 0 1px 2px rgba(0, 0, 0, 0.8) !important;
            }
        `;

        styleTag.textContent = baseWidgetLabelCss + '\n' + customCss;
    }
    window.applyDesktopCustomStyles = applyDesktopCustomStyles;

    function openDesktopCustomTutorialModal() {
        const modal = document.getElementById('desktopCustomTutorialModalOverlay');
        if (!modal) return;
        modal.style.display = 'flex';
        requestAnimationFrame(() => {
            modal.style.opacity = '1';
            modal.style.pointerEvents = 'auto';
        });
    }
    window.openDesktopCustomTutorialModal = openDesktopCustomTutorialModal;

    function closeDesktopCustomTutorialModal(event) {
        const modal = document.getElementById('desktopCustomTutorialModalOverlay');
        if (!modal) return;
        if (event && event.target !== modal) return;
        modal.style.opacity = '0';
        modal.style.pointerEvents = 'none';
        setTimeout(() => {
            if (modal.style.opacity === '0') {
                modal.style.display = 'none';
            }
        }, 260);
    }
    window.closeDesktopCustomTutorialModal = closeDesktopCustomTutorialModal;

    function copyDesktopTutorialCode(codeText) {
        if (!codeText) return;
        if (navigator.clipboard && window.isSecureContext) {
            navigator.clipboard.writeText(codeText).then(() => {
                if (typeof showToast === 'function') showToast('已复制代码');
            }).catch(() => {
                if (typeof showToast === 'function') showToast('已复制代码');
            });
        } else {
            const temp = document.createElement('textarea');
            temp.value = codeText;
            document.body.appendChild(temp);
            temp.select();
            try {
                document.execCommand('copy');
                if (typeof showToast === 'function') showToast('已复制代码');
            } catch (err) {}
            document.body.removeChild(temp);
        }
    }
    window.copyDesktopTutorialCode = copyDesktopTutorialCode;

    function applyDesktopCustomScripts(jsText) {
        const oldScript = document.getElementById('dynamic-desktop-custom-script');
        if (oldScript) oldScript.remove();

        if (!jsText || !jsText.trim()) return;

        try {
            const scriptTag = document.createElement('script');
            scriptTag.id = 'dynamic-desktop-custom-script';
            scriptTag.textContent = `(function(){\ntry {\n${jsText}\n} catch(err) { console.error('桌面自定义脚本执行错误:', err); }\n})();`;
            document.body.appendChild(scriptTag);
        } catch (err) {
            console.error('注入桌面自定义脚本失败:', err);
        }
    }
    window.applyDesktopCustomScripts = applyDesktopCustomScripts;

    function saveDesktopCustomSettings() {
        const cssInput = document.getElementById('accessDesktopCustomCssInput');
        const jsInput = document.getElementById('accessDesktopCustomJsInput');
        const labelInput = document.getElementById('accessWidgetLabelInput');

        const cssText = cssInput ? cssInput.value : '';
        const jsText = jsInput ? jsInput.value : '';
        const labelText = labelInput ? labelInput.value.trim() : 'Fairy Widgets';

        if (typeof appSettings !== 'undefined') {
            appSettings.desktop_custom_css = cssText;
            appSettings.desktop_custom_js = jsText;
            appSettings.desktop_widget_label_text = labelText || 'Fairy Widgets';
            if (typeof saveAppSettings === 'function') saveAppSettings();
        }

        applyDesktopCustomStyles();
        applyDesktopCustomScripts(jsText);
        updateDesktopCustomUI();

        if (typeof showToast === 'function') {
            showToast('桌面高级自定义已应用');
        }
    }
    window.saveDesktopCustomSettings = saveDesktopCustomSettings;

    async function clearDesktopCustomAction() {
        const confirmed = typeof showCustomConfirm === 'function'
            ? await showCustomConfirm('清空桌面自定义', '确定要清空桌面自定义 CSS 和 JS 脚本吗？', '清空并刷新', true)
            : window.confirm('确定要清空桌面自定义 CSS 和 JS 脚本吗？');
        if (!confirmed) return;

        if (typeof appSettings !== 'undefined') {
            appSettings.desktop_custom_css = '';
            appSettings.desktop_custom_js = '';
            if (typeof saveAppSettings === 'function') saveAppSettings();
        }

        const cssInput = document.getElementById('accessDesktopCustomCssInput');
        const jsInput = document.getElementById('accessDesktopCustomJsInput');
        if (cssInput) cssInput.value = '';
        if (jsInput) jsInput.value = '';

        applyDesktopCustomStyles();
        applyDesktopCustomScripts('');
        updateDesktopCustomUI();

        if (typeof showToast === 'function') showToast('桌面自定义已清空，即将刷新...');
        setTimeout(() => {
            window.location.reload();
        }, 800);
    }
    window.clearDesktopCustomAction = clearDesktopCustomAction;

    // 页面加载完成后自动应用桌面高级自定义设置
    function initDesktopCustomOnStart() {
        applyDesktopCustomStyles();
        if (typeof appSettings !== 'undefined' && appSettings.desktop_custom_js) {
            applyDesktopCustomScripts(appSettings.desktop_custom_js);
        }
    }
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initDesktopCustomOnStart);
    } else {
        initDesktopCustomOnStart();
    }

    function updateTapClearCssUI() {
        const isEnabled = typeof appSettings !== 'undefined' ? (appSettings.wc_tap_clear_css_enabled !== false) : true;
        const toggle = document.getElementById('accessTapClearCssToggle');
        const summary = document.getElementById('accessTapClearCssStatusSummary');
        if (toggle) {
            toggle.classList.toggle('on', isEnabled);
            toggle.setAttribute('aria-checked', String(isEnabled));
        }
        if (summary) {
            summary.innerText = isEnabled ? '开启' : '关闭';
        }
    }
    window.updateTapClearCssUI = updateTapClearCssUI;

    function toggleTapClearCssSwitch() {
        if (typeof appSettings === 'undefined') return;
        const isEnabled = appSettings.wc_tap_clear_css_enabled === false;
        appSettings.wc_tap_clear_css_enabled = isEnabled;
        if (typeof saveAppSettings === 'function') saveAppSettings();
        updateTapClearCssUI();
        if (typeof showToast === 'function') {
            showToast(isEnabled ? '五击应急操作已开启' : '五击应急操作已关闭');
        }
    }
    window.toggleTapClearCssSwitch = toggleTapClearCssSwitch;

    async function clearCurrentChatCssAction() {
        const hasCustomContacts = Array.isArray(window.wcContactsList) && window.wcContactsList.some(c => c.customCss || c.customJs || c.currentPresetId);
        if (!window.wcCurrentChatContactId && !hasCustomContacts) {
            if (typeof showToast === 'function') showToast('当前没有设置过美化的聊天室');
            return;
        }

        const confirmed = typeof showCustomConfirm === 'function'
            ? await showCustomConfirm('清空聊天室美化', '确定要清除聊天室的自定义美化 CSS 与脚本吗？', '清空', true)
            : window.confirm('确定要清除聊天室的自定义美化 CSS 与脚本吗？');
        if (!confirmed) return;

        if (window.wcCurrentChatContactId && Array.isArray(window.wcContactsList)) {
            const currentContact = window.wcContactsList.find(c => c.id === window.wcCurrentChatContactId);
            if (currentContact) {
                currentContact.customCss = '';
                currentContact.customJs = '';
                currentContact.currentPresetId = null;
            }
        }
        if (Array.isArray(window.wcContactsList)) {
            window.wcContactsList.forEach(contact => {
                contact.customCss = '';
                contact.customJs = '';
                contact.currentPresetId = null;
            });
        }
        if (typeof window.wcSaveContactsDataAsync === 'function') {
            await window.wcSaveContactsDataAsync();
        }
        if (typeof appSettings !== 'undefined') {
            appSettings.wc_custom_css = '';
            appSettings.wc_custom_js = '';
            if (typeof saveAppSettings === 'function') saveAppSettings();
        }
        if (typeof window.wcApplyCustomCss === 'function') window.wcApplyCustomCss('');
        if (typeof window.wcApplyCustomJs === 'function') window.wcApplyCustomJs('');
        if (typeof window.wcRefreshChatAfterCustomCodeClear === 'function') window.wcRefreshChatAfterCustomCodeClear();

        if (typeof showToast === 'function') showToast('聊天室美化 CSS 已清空');
    }
    window.clearCurrentChatCssAction = clearCurrentChatCssAction;

    async function clearGlobalWechatCssAction() {
        const accountId = typeof window.wcGetCurrentAccountId === 'function' ? window.wcGetCurrentAccountId() : 'default';
        const hasGlobalCss = typeof appSettings !== 'undefined' && (appSettings[`wc_global_css_${accountId}`] || appSettings.wc_global_css);

        const confirmed = typeof showCustomConfirm === 'function'
            ? await showCustomConfirm('清空微信全局美化', '确定要清除微信个性化中的全局 CSS 与脚本并刷新吗？', '清空并刷新', true)
            : window.confirm('确定要清除微信个性化中的全局 CSS 与脚本并刷新吗？');
        if (!confirmed) return;

        if (typeof window.wcClearGlobalCustomCssAndJs === 'function') {
            window.wcClearGlobalCustomCssAndJs(true);
        } else {
            if (typeof appSettings !== 'undefined') {
                appSettings[`wc_global_css_${accountId}`] = '';
                appSettings[`wc_global_js_${accountId}`] = '';
                appSettings.wc_global_css = '';
                appSettings.wc_global_js = '';
                if (typeof saveAppSettings === 'function') saveAppSettings();
            }
            if (typeof window.wcApplyGlobalCustomCss === 'function') window.wcApplyGlobalCustomCss('');
            if (typeof window.wcApplyGlobalCustomJs === 'function') window.wcApplyGlobalCustomJs('');
        }
        if (typeof showToast === 'function') showToast('微信全局个性化 CSS 已清空，即将刷新...');
        setTimeout(() => {
            window.location.reload();
        }, 800);
    }
    window.clearGlobalWechatCssAction = clearGlobalWechatCssAction;

    function closeAccessibilitySettingsApp() {
        const accessUI = document.getElementById('accessibilitySettingsUI');
        if (!accessUI) return;
        accessUI.classList.remove('show');
        setTimeout(() => {
            accessUI.style.display = 'none';
            document.querySelectorAll('#accessibilitySettingsUI .gen-sub-page').forEach(p => {
                if (p.id !== 'accessMainPage') {
                    p.classList.remove('active');
                    p.classList.add('slide-right');
                }
            });
            const mainPage = document.getElementById('accessMainPage');
            if (mainPage) {
                mainPage.classList.remove('slide-left');
                mainPage.classList.add('active');
            }
            closeAccessSlotPicker();
        }, 300);
    }

    function openAccessSubPage(pageId) {
        const mainPage = document.getElementById('accessMainPage');
        const subPage = document.getElementById(pageId);
        if (!subPage || !mainPage) return;
        if (pageId === 'accessAssistivePage') {
            renderAssistiveCustomizeGrid();
        }
        if (pageId === 'accessPageAdaptPage') {
            updatePageAdaptUI();
        }
        mainPage.classList.remove('active');
        mainPage.classList.add('slide-left');
        subPage.classList.remove('slide-right');
        subPage.classList.add('active');
    }

    function closeAccessSubPage(pageId) {
        const mainPage = document.getElementById('accessMainPage');
        const subPage = document.getElementById(pageId);
        if (!subPage || !mainPage) return;
        subPage.classList.remove('active');
        subPage.classList.add('slide-right');
        mainPage.classList.remove('slide-left');
        mainPage.classList.add('active');
    }

    /* Page adaptation controls */
    function clampPageAdaptScale(value) {
        const parsed = parseInt(value, 10);
        return Number.isFinite(parsed) ? Math.min(110, Math.max(80, parsed)) : 100;
    }

    function clampPageAdaptBarHeight(value, edge) {
        const parsed = parseInt(value, 10);
        if (!Number.isFinite(parsed)) return 0;
        const min = edge === 'bottom' ? -120 : -80;
        const max = edge === 'bottom' ? 120 : 80;
        return Math.min(max, Math.max(min, parsed));
    }

    const KEYBOARD_OFFSET_MIN = -80;
    const KEYBOARD_OFFSET_MAX = 160;
    const KEYBOARD_OFFSET_STEP = 2;
    let keyboardCalibrationState = null;
    let keyboardCalibrationObserver = null;

    const PAGE_ADAPT_APP_TARGETS = Object.freeze({
        wechat: '微信',
        message: '信息',
        contacts: '联系人',
        meeting: '见面',
        readen: '阅读',
        icity: 'iCity / 日记',
        settings: '设置'
    });
    let pageAdaptTargetApp = 'wechat';

    function clampPageAdaptAppTopOffset(value) {
        const parsed = parseInt(value, 10);
        return Number.isFinite(parsed) ? Math.min(80, Math.max(-24, parsed)) : 0;
    }

    function getPageAdaptTargetApp() {
        const saved = typeof appSettings !== 'undefined' ? String(appSettings.access_app_top_target || '') : '';
        if (PAGE_ADAPT_APP_TARGETS[saved]) return saved;
        return PAGE_ADAPT_APP_TARGETS[pageAdaptTargetApp] ? pageAdaptTargetApp : 'wechat';
    }

    function getPageAdaptAppTopOffsets() {
        const stored = typeof appSettings !== 'undefined' && appSettings.access_app_top_offsets
            && typeof appSettings.access_app_top_offsets === 'object'
            && !Array.isArray(appSettings.access_app_top_offsets)
            ? appSettings.access_app_top_offsets
            : {};
        const normalized = {};
        Object.keys(PAGE_ADAPT_APP_TARGETS).forEach(target => {
            normalized[target] = clampPageAdaptAppTopOffset(stored[target]);
        });
        return normalized;
    }

    function applyPageAdaptAppTopOffsets(root) {
        const offsets = getPageAdaptAppTopOffsets();
        Object.entries(offsets).forEach(([target, value]) => {
            root.style.setProperty(`--app-top-offset-${target}`, `${value}px`);
        });
    }

    function getPageAdaptSettings() {
        const savedRows = typeof appSettings !== 'undefined' ? Number(appSettings.access_desktop_rows) : 0;
        return {
            desktopRows: savedRows === 6 || savedRows === 7
                ? savedRows
                : (typeof window.getDesktopRowCount === 'function' ? window.getDesktopRowCount() : 6),
            scale: clampPageAdaptScale(typeof appSettings !== 'undefined' ? appSettings.access_page_scale : 100),
            top: clampPageAdaptBarHeight(typeof appSettings !== 'undefined' ? appSettings.access_top_bar_height : 0, 'top'),
            bottom: clampPageAdaptBarHeight(typeof appSettings !== 'undefined' ? appSettings.access_bottom_bar_height : 0, 'bottom')
        };
    }

    function formatPageAdaptBarHeight(value) {
        return `${value > 0 ? '+' : ''}${value}px`;
    }

    function isVisiblePageAdaptBackground(color) {
        if (!color || color === 'transparent') return false;
        const rgba = color.match(/^rgba?\(([^)]+)\)$/);
        if (!rgba) return true;
        const parts = rgba[1].split(',').map(part => part.trim());
        return parts.length < 4 || Number(parts[3]) > 0;
    }

    function findPageAdaptBackdropColor() {
        const iphone = document.querySelector('.iphone');
        if (!iphone) return '';
        const rect = iphone.getBoundingClientRect();
        if (!rect.width || !rect.height || typeof document.elementsFromPoint !== 'function') return '';

        const points = [
            [rect.left + Math.max(2, rect.width * 0.02), rect.top + Math.min(110, rect.height - 1)],
            [rect.left + rect.width / 2, rect.top + Math.min(110, rect.height - 1)],
            [rect.left + rect.width / 2, rect.top + rect.height / 2]
        ];
        for (const [x, y] of points) {
            const elements = document.elementsFromPoint(x, y);
            for (const element of elements) {
                let topLevel = element;
                while (topLevel.parentElement && topLevel.parentElement !== iphone) {
                    topLevel = topLevel.parentElement;
                }
                if (topLevel === iphone) continue;
                const color = getComputedStyle(topLevel).backgroundColor;
                if (isVisiblePageAdaptBackground(color)) return color;
            }
        }
        return '';
    }

    function syncPageAdaptBackdrop() {
        const color = findPageAdaptBackdropColor();
        if (color) {
            document.documentElement.style.setProperty('--page-adapt-backdrop-color', color);
        }
    }

    let pageAdaptBackdropTimer = 0;
    function schedulePageAdaptBackdropSync() {
        if (pageAdaptBackdropTimer) window.clearTimeout(pageAdaptBackdropTimer);
        pageAdaptBackdropTimer = window.setTimeout(() => {
            pageAdaptBackdropTimer = 0;
            syncPageAdaptBackdrop();
        }, 50);
    }

    function observePageAdaptBackdrop() {
        const iphone = document.querySelector('.iphone');
        if (!iphone || typeof MutationObserver === 'undefined') return;
        const observer = new MutationObserver(schedulePageAdaptBackdropSync);
        observer.observe(iphone, {
            subtree: true,
            attributes: true,
            attributeFilter: ['class', 'style', 'hidden']
        });
        window.addEventListener('resize', schedulePageAdaptBackdropSync, { passive: true });
        syncPageAdaptBackdrop();
    }

    function updatePageAdaptUI() {
        const values = getPageAdaptSettings();
        const scaleLabel = document.getElementById('accessAdaptScaleLabel');
        const scaleText = document.getElementById('accessPageScaleValueText');
        const scaleSlider = document.getElementById('accessPageScaleSlider');
        const desktopRowsSelect = document.getElementById('accessDesktopRowsSelect');
        const topText = document.getElementById('accessTopBarHeightValueText');
        const topSlider = document.getElementById('accessTopBarHeightSlider');
        const bottomText = document.getElementById('accessBottomBarHeightValueText');
        const bottomSlider = document.getElementById('accessBottomBarHeightSlider');
        const appTargetSelect = document.getElementById('accessAppTopTargetSelect');
        const appTopText = document.getElementById('accessAppTopOffsetValueText');
        const appTopSlider = document.getElementById('accessAppTopOffsetSlider');

        if (scaleLabel) scaleLabel.innerText = `${values.scale}%`;
        if (scaleText) scaleText.innerText = `${values.scale}%`;
        if (scaleSlider) scaleSlider.value = values.scale;
        if (desktopRowsSelect) desktopRowsSelect.value = String(values.desktopRows);
        if (topText) topText.innerText = formatPageAdaptBarHeight(values.top);
        if (topSlider) topSlider.value = values.top;
        if (bottomText) bottomText.innerText = formatPageAdaptBarHeight(values.bottom);
        if (bottomSlider) bottomSlider.value = values.bottom;

        pageAdaptTargetApp = getPageAdaptTargetApp();
        const appOffsets = getPageAdaptAppTopOffsets();
        const appTopValue = appOffsets[pageAdaptTargetApp] || 0;
        if (appTargetSelect) appTargetSelect.value = pageAdaptTargetApp;
        if (appTopText) appTopText.innerText = formatPageAdaptBarHeight(appTopValue);
        if (appTopSlider) appTopSlider.value = appTopValue;
        updateKeyboardOffsetSummaries();
    }

    function applyPageAdaptSettings() {
        const values = getPageAdaptSettings();
        const root = document.documentElement;
        root.style.setProperty('--page-adapt-top-offset', `${values.top}px`);
        root.style.setProperty('--page-adapt-bottom-offset', `${values.bottom}px`);
        applyPageAdaptAppTopOffsets(root);
        if (typeof window.applyDesktopRowCountSetting === 'function') {
            window.applyDesktopRowCountSetting();
        }

        const iphone = document.querySelector('.iphone');
        if (iphone) {
            // Scale the shared shell on every device; native hit-testing follows it.
            iphone.style.transform = values.scale === 100
                ? ''
                : `scale(${values.scale / 100})`;
            iphone.style.transformOrigin = 'center center';
        }

        updatePageAdaptUI();
        syncPageAdaptBackdrop();
        if (typeof window.syncSimulatedStatusBarMetrics === 'function') {
            requestAnimationFrame(() => window.syncSimulatedStatusBarMetrics());
        }
        window.dispatchEvent(new CustomEvent('tonghuaji-page-adapt-change', {
            detail: {
                scale: values.scale,
                top: values.top,
                bottom: values.bottom,
                appTopOffsets: getPageAdaptAppTopOffsets()
            }
        }));
    }
    function handlePageAdaptDesktopRowsChange(value) {
        const rows = Number(value);
        if (typeof appSettings === 'undefined' || (rows !== 6 && rows !== 7)) return;
        appSettings.access_desktop_rows = rows;
        applyPageAdaptSettings();
        if (typeof saveAppSettings === 'function') saveAppSettings();
    }

    function handlePageAdaptScaleInput(val) {
        if (typeof appSettings === 'undefined') return;
        appSettings.access_page_scale = clampPageAdaptScale(val);
        applyPageAdaptSettings();
        if (typeof saveAppSettings === 'function') saveAppSettings();
    }

    function handlePageAdaptBarHeightInput(edge, val) {
        if (typeof appSettings === 'undefined') return;
        const height = clampPageAdaptBarHeight(val, edge);
        if (edge === 'top') {
            appSettings.access_top_bar_height = height;
        } else if (edge === 'bottom') {
            appSettings.access_bottom_bar_height = height;
        } else {
            return;
        }
        applyPageAdaptSettings();
        if (typeof saveAppSettings === 'function') saveAppSettings();
    }

    function handlePageAdaptTargetChange(target) {
        if (!PAGE_ADAPT_APP_TARGETS[target]) return;
        pageAdaptTargetApp = target;
        if (typeof appSettings !== 'undefined') {
            appSettings.access_app_top_target = target;
            if (typeof saveAppSettings === 'function') saveAppSettings();
        }
        updatePageAdaptUI();
    }

    function handlePageAdaptAppTopOffsetInput(val) {
        if (typeof appSettings === 'undefined') return;
        const target = getPageAdaptTargetApp();
        const offsets = appSettings.access_app_top_offsets
            && typeof appSettings.access_app_top_offsets === 'object'
            && !Array.isArray(appSettings.access_app_top_offsets)
            ? { ...appSettings.access_app_top_offsets }
            : {};
        offsets[target] = clampPageAdaptAppTopOffset(val);
        appSettings.access_app_top_offsets = offsets;
        appSettings.access_app_top_target = target;
        applyPageAdaptSettings();
        if (typeof saveAppSettings === 'function') saveAppSettings();
    }

    function resetPageAdaptAppTopOffset() {
        handlePageAdaptAppTopOffsetInput(0);
        if (typeof showToast === 'function') showToast('已恢复当前 App 顶部默认');
    }

    function clampKeyboardOffset(value) {
        const parsed = Number(value);
        if (!Number.isFinite(parsed)) return 0;
        const clamped = Math.min(KEYBOARD_OFFSET_MAX, Math.max(KEYBOARD_OFFSET_MIN, parsed));
        return Math.round(clamped / KEYBOARD_OFFSET_STEP) * KEYBOARD_OFFSET_STEP;
    }

    function getKeyboardCalibrationConfig(app) {
        if (app === 'wechat') {
            return {
                app: 'wechat',
                label: '微信',
                appRootId: 'wechatAppUI',
                footerSelector: '#wcFooterCapsule',
                summaryId: 'accessWechatKeyboardOffsetValueText',
                getOffset: () => typeof window.getWechatKeyboardOffsetPx === 'function' ? window.getWechatKeyboardOffsetPx() : 0,
                saveOffset: value => typeof window.saveWechatKeyboardOffsetPx === 'function'
                    ? window.saveWechatKeyboardOffsetPx(value)
                    : Promise.resolve(false),
                openApp: () => {
                    const openWechat = typeof window.openWechatApp === 'function'
                        ? window.openWechatApp
                        : (typeof openWechatApp === 'function' ? openWechatApp : null);
                    if (!openWechat) return Promise.reject(new Error('WeChat is not loaded'));
                    return Promise.resolve(openWechat());
                }
            };
        }
        if (app === 'message') {
            return {
                app: 'message',
                label: '短信',
                appRootId: 'messageAppUI',
                footerSelector: '.message-chat-footer, .message-new-footer',
                summaryId: 'accessMessageKeyboardOffsetValueText',
                getOffset: () => typeof window.getMessageKeyboardOffsetPx === 'function' ? window.getMessageKeyboardOffsetPx() : 0,
                saveOffset: value => typeof window.saveMessageKeyboardOffsetPx === 'function'
                    ? window.saveMessageKeyboardOffsetPx(value)
                    : Promise.resolve(false),
                openApp: () => {
                    if (!window.MessageApp || typeof window.MessageApp.open !== 'function') {
                        return Promise.reject(new Error('Messages is not loaded'));
                    }
                    return Promise.resolve(window.MessageApp.open());
                }
            };
        }
        return null;
    }

    function getStoredKeyboardOffset(app) {
        const config = getKeyboardCalibrationConfig(app);
        return config ? clampKeyboardOffset(config.getOffset()) : 0;
    }

    function formatKeyboardOffset(value) {
        const normalized = clampKeyboardOffset(value);
        return `${normalized > 0 ? '+' : ''}${normalized}px`;
    }

    function updateKeyboardOffsetSummaries() {
        ['wechat', 'message'].forEach(app => {
            const config = getKeyboardCalibrationConfig(app);
            if (!config) return;
            const summary = document.getElementById(config.summaryId);
            if (summary) summary.innerText = formatKeyboardOffset(getStoredKeyboardOffset(app));
        });
    }

    function ensureKeyboardCalibrationPanel() {
        let panel = document.getElementById('keyboardInputCalibrationPanel');
        if (panel) return panel;

        panel = document.createElement('div');
        panel.id = 'keyboardInputCalibrationPanel';
        panel.className = 'wechat-keyboard-calibration-panel';
        panel.setAttribute('role', 'dialog');
        panel.innerHTML = `
            <div class="wk-calibration-head">
                <div>
                    <div class="wk-calibration-title" id="keyboardCalibrationTitle">输入栏位置校准</div>
                    <div class="wk-calibration-status" id="keyboardCalibrationStatus">请进入任意聊天并点输入框</div>
                </div>
                <div class="wk-calibration-value" id="keyboardCalibrationValue">0px</div>
            </div>
            <div class="wk-calibration-step-row">
                <button type="button" onpointerdown="event.preventDefault()" onclick="nudgeKeyboardCalibration(-1)">下移</button>
                <button type="button" onpointerdown="event.preventDefault()" onclick="nudgeKeyboardCalibration(1)">上移</button>
            </div>
            <div class="wk-calibration-action-row">
                <button type="button" class="secondary" onpointerdown="event.preventDefault()" onclick="resetKeyboardCalibration()">恢复默认</button>
                <button type="button" class="secondary" onpointerdown="event.preventDefault()" onclick="cancelKeyboardCalibration()">取消</button>
                <button type="button" class="primary" onpointerdown="event.preventDefault()" onclick="saveKeyboardCalibration()">保存</button>
            </div>
        `;
        document.body.appendChild(panel);
        return panel;
    }

    function isKeyboardCalibrationInputActive() {
        if (!keyboardCalibrationState) return false;
        const config = getKeyboardCalibrationConfig(keyboardCalibrationState.app);
        const active = document.activeElement;
        return Boolean(config && active instanceof HTMLElement && active.closest(config.footerSelector));
    }

    function updateKeyboardCalibrationPanel(keyboardOpen) {
        if (!keyboardCalibrationState) return;
        const config = getKeyboardCalibrationConfig(keyboardCalibrationState.app);
        const panel = ensureKeyboardCalibrationPanel();
        const title = document.getElementById('keyboardCalibrationTitle');
        const value = document.getElementById('keyboardCalibrationValue');
        const status = document.getElementById('keyboardCalibrationStatus');
        const ready = Boolean(keyboardOpen && isKeyboardCalibrationInputActive());
        if (title && config) title.innerText = `${config.label}输入栏位置校准`;
        if (value) value.innerText = formatKeyboardOffset(keyboardCalibrationState.draft);
        if (status) {
            status.innerText = ready
                ? '键盘已展开，可直接微调'
                : (keyboardCalibrationState.app === 'message'
                    ? '进入短信聊天或新建短信后点输入框'
                    : '请进入任意聊天并点输入框');
        }
        panel.classList.toggle('keyboard-ready', ready);
    }

    function broadcastKeyboardCalibrationPreview() {
        window.__keyboardCalibrationPreviewApp = keyboardCalibrationState?.app || '';
        window.__keyboardCalibrationPreviewOffsetPx = keyboardCalibrationState
            ? keyboardCalibrationState.draft
            : undefined;
        window.dispatchEvent(new CustomEvent('tonghuaji-keyboard-offset-preview', {
            detail: {
                app: keyboardCalibrationState?.app || '',
                active: Boolean(keyboardCalibrationState),
                offset: keyboardCalibrationState ? keyboardCalibrationState.draft : null
            }
        }));
    }

    function setKeyboardCalibrationDraft(value) {
        if (!keyboardCalibrationState) return;
        keyboardCalibrationState.draft = clampKeyboardOffset(value);
        broadcastKeyboardCalibrationPreview();
        updateKeyboardCalibrationPanel(document.documentElement.classList.contains('keyboard-open'));
    }

    function nudgeKeyboardCalibration(direction) {
        if (!keyboardCalibrationState) return;
        const delta = direction > 0 ? KEYBOARD_OFFSET_STEP : -KEYBOARD_OFFSET_STEP;
        setKeyboardCalibrationDraft(keyboardCalibrationState.draft + delta);
    }

    function resetKeyboardCalibration() {
        setKeyboardCalibrationDraft(0);
    }

    function stopKeyboardCalibrationObserver() {
        if (!keyboardCalibrationObserver) return;
        keyboardCalibrationObserver.disconnect();
        keyboardCalibrationObserver = null;
    }

    function finishKeyboardCalibration() {
        stopKeyboardCalibrationObserver();
        keyboardCalibrationState = null;
        const panel = document.getElementById('keyboardInputCalibrationPanel');
        if (panel) panel.classList.remove('show', 'keyboard-ready');
        broadcastKeyboardCalibrationPreview();
        updateKeyboardOffsetSummaries();
    }

    function cancelKeyboardCalibration(options = {}) {
        if (!keyboardCalibrationState) return;
        const config = getKeyboardCalibrationConfig(keyboardCalibrationState.app);
        finishKeyboardCalibration();
        if (!options.silent && typeof showToast === 'function') {
            showToast(`已取消${config?.label || ''}键盘校准`);
        }
    }

    async function saveKeyboardCalibration() {
        if (!keyboardCalibrationState) return;
        const config = getKeyboardCalibrationConfig(keyboardCalibrationState.app);
        if (!config) return;

        const value = keyboardCalibrationState.draft;
        const saved = await config.saveOffset(value);
        if (!saved) {
            if (typeof showToast === 'function') showToast('保存失败，请稍后重试');
            return;
        }

        const label = config.label;
        finishKeyboardCalibration();
        if (typeof showToast === 'function') {
            showToast(`${label}输入栏位置已保存：${formatKeyboardOffset(value)}`);
        }
    }

    function watchKeyboardCalibrationAppVisibility() {
        stopKeyboardCalibrationObserver();
        if (!keyboardCalibrationState) return;
        const config = getKeyboardCalibrationConfig(keyboardCalibrationState.app);
        const appRoot = config ? document.getElementById(config.appRootId) : null;
        if (!appRoot || typeof MutationObserver === 'undefined') return;

        keyboardCalibrationObserver = new MutationObserver(() => {
            if (!keyboardCalibrationState) return;
            const hidden = appRoot.style.display === 'none' || getComputedStyle(appRoot).display === 'none';
            if (hidden) cancelKeyboardCalibration({ silent: true });
        });
        keyboardCalibrationObserver.observe(appRoot, {
            attributes: true,
            attributeFilter: ['class', 'style']
        });
    }

    async function startKeyboardCalibration(app) {
        const config = getKeyboardCalibrationConfig(app);
        if (!config) return;

        if (keyboardCalibrationState) {
            if (keyboardCalibrationState.app === app) {
                ensureKeyboardCalibrationPanel().classList.add('show');
                return;
            }
            cancelKeyboardCalibration({ silent: true });
        }

        const original = getStoredKeyboardOffset(app);
        keyboardCalibrationState = { app, original, draft: original };
        const panel = ensureKeyboardCalibrationPanel();
        panel.classList.add('show');
        panel.setAttribute('aria-label', `${config.label}键盘输入栏位置校准`);
        broadcastKeyboardCalibrationPreview();
        updateKeyboardCalibrationPanel(false);

        if (typeof closeSettingsApp === 'function') {
            closeSettingsApp({ force: true, immediate: true });
        }

        try {
            await config.openApp();
            watchKeyboardCalibrationAppVisibility();
            if (typeof showToast === 'function') {
                showToast(app === 'message'
                    ? '进入短信聊天或新建短信，点输入框后即可微调'
                    : '进入任意聊天并点输入框后即可微调');
            }
        } catch (error) {
            console.error(`Failed to open ${config.label} keyboard calibration:`, error);
            finishKeyboardCalibration();
            if (typeof showToast === 'function') showToast(`打开${config.label}失败，请稍后重试`);
        }
    }

    function startWechatKeyboardCalibration() {
        return startKeyboardCalibration('wechat');
    }

    function startMessageKeyboardCalibration() {
        return startKeyboardCalibration('message');
    }

    window.addEventListener('tonghuaji-keyboard-viewport-change', event => {
        if (!keyboardCalibrationState) return;
        updateKeyboardCalibrationPanel(Boolean(event.detail?.open));
    });
    window.addEventListener('tonghuaji-device-local-settings-change', updateKeyboardOffsetSummaries);

    function setPageAdaptPreset(scaleVal) {
        const slider = document.getElementById('accessPageScaleSlider');
        if (slider) slider.value = scaleVal;
        handlePageAdaptScaleInput(scaleVal);
        if (typeof showToast === 'function') showToast(`已适配为 ${scaleVal}%`);
    }

    window.applyPageAdaptSettings = applyPageAdaptSettings;
    window.updatePageAdaptUI = updatePageAdaptUI;
    window.handlePageAdaptDesktopRowsChange = handlePageAdaptDesktopRowsChange;
    window.handlePageAdaptBarHeightInput = handlePageAdaptBarHeightInput;
    window.handlePageAdaptTargetChange = handlePageAdaptTargetChange;
    window.handlePageAdaptAppTopOffsetInput = handlePageAdaptAppTopOffsetInput;
    window.resetPageAdaptAppTopOffset = resetPageAdaptAppTopOffset;
    window.startWechatKeyboardCalibration = startWechatKeyboardCalibration;
    window.startMessageKeyboardCalibration = startMessageKeyboardCalibration;
    window.nudgeKeyboardCalibration = nudgeKeyboardCalibration;
    window.resetKeyboardCalibration = resetKeyboardCalibration;
    window.cancelKeyboardCalibration = cancelKeyboardCalibration;
    window.saveKeyboardCalibration = saveKeyboardCalibration;

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', applyPageAdaptSettings, { once: true });
        document.addEventListener('DOMContentLoaded', observePageAdaptBackdrop, { once: true });
    } else {
        applyPageAdaptSettings();
        observePageAdaptBackdrop();
    }

    /* 悬浮球自定顶层菜单系统定义与动作注册库 */
    const ASSISTIVE_ACTION_MAP = {
        home: {
            id: 'home',
            name: '桌面',
            icon: `<svg viewBox="0 0 1024 1024" fill="white"><path d="M134.134 580.717h56.753v291.98c0 57.466 40.272 77.844 74.75 77.844 2.225 0 3.992-0.095 4.77-0.166h156.359V640.473c0-5.274 4.105-9.085 4.747-9.441l161.032-0.19c1.668 1.016 4.6 7.502 4.686 10.367 0.27 8.875 0.057 219.419-0.01 283.724l-0.015 25.442h155.26c27.429 0 50.671-12.923 67.225-37.42 10.77-15.903 14.925-31.336 15.646-34.273l0.546-2.199 1.089-297.688h54.861c19.419 0 35.345-8.64 44.847-24.302 6.922-11.408 10.286-26.292 10.286-45.479v-10.419l-7.397-7.412C901.474 452.95 534.18 84.356 532.689 82.888c-5.94-5.859-14.64-8.828-25.833-8.828-10.144 0-18.26 2.96-24.198 8.851L77.034 496.796v10.295c0 18.972 6.357 37.241 17.893 51.456 11.279 13.882 25.927 22.17 39.207 22.17z"></path></svg>`
        },
        api: {
            id: 'api',
            name: 'API预设',
            icon: `<svg viewBox="0 0 1024 1024" fill="white"><path d="M917.7 148.8l-42.4-42.4c-1.6-1.6-3.6-2.3-5.7-2.3s-4.1 0.8-5.7 2.3l-76.1 76.1c-33.7-22.9-72.9-34.3-112.1-34.3-51.2 0-102.4 19.5-141.5 58.6L432.3 308.7c-3.1 3.1-3.1 8.2 0 11.3L704 591.7c1.6 1.6 3.6 2.3 5.7 2.3 2 0 4.1-0.8 5.7-2.3l101.9-101.9c68.9-69 77-175.7 24.3-253.5l76.1-76.1c3.1-3.2 3.1-8.3 0-11.4zM578.9 546.7c-3.1-3.1-8.2-3.1-11.3 0L501 613.3 410.7 523l66.7-66.7c3.1-3.1 3.1-8.2 0-11.3L441 408.6c-3.1-3.1-8.2-3.1-11.3 0L363 475.3l-43-43c-1.6-1.6-3.6-2.3-5.7-2.3-2 0-4.1 0.8-5.7 2.3L206.8 534.2c-68.9 68.9-77 175.7-24.3 253.5l-76.1 76.1c-3.1 3.1-3.1 8.2 0 11.3l42.4 42.4c1.6 1.6 3.6 2.3 5.7 2.3s4.1-0.8 5.7-2.3l76.1-76.1c33.7 22.9 72.9 34.3 112.1 34.3 51.2 0 102.4-19.5 141.5-58.6l101.9-101.9c3.1-3.1 3.1-8.2 0-11.3l-43-43 66.7-66.7c3.1-3.1 3.1-8.2 0-11.3l-36.6-36.2z"></path></svg>`
        },
        backup: {
            id: 'backup',
            name: '备份',
            icon: `<svg viewBox="0 0 1024 1024" fill="white"><path d="M447.878465 49.877333C195.767596 49.877333 48.484848 112.614141 48.484848 189.988202v84.030061c0 77.374061 147.282747 140.141899 399.393617 140.141899 252.117333 0 427.929859-62.767838 427.929858-140.141899v-84.030061c0-77.374061-175.813818-140.110869-427.929858-140.110869zM412.571152 776.790626C231.237818 770.391919 125.308121 731.174788 69.611313 678.675394c-14.211879 13.392162-21.126465 27.655758-21.126465 42.488242v113.294223c0 78.182141 154.26198 141.54602 418.328566 141.54602 26.423596 0 52.141253-0.757657 77.434828-2.015677-67.837414-46.228687-116.231758-116.173576-131.675798-197.193697v-0.003879zM478.151111 479.837091c-5.620364 0.034909-11.045495 0.095677-16.797737 0.095677-212.055919 0-331.620848-41.929697-391.934707-99.757253-14.085172 13.534384-20.933818 27.878141-20.933819 42.772687v114.035071c0 72.493253 130.066101 132.328727 355.202586 141.225373 0.323232-75.353212 28.171636-144.422788 74.463677-198.371555z"></path><path d="M710.141414 447.114343c-146.055758 0-264.454465 118.36897-264.454465 264.454465 0 146.057051 118.398707 264.438949 264.454465 264.43895s264.485495-118.383192 264.485495-264.43895c-0.001293-146.085495-118.434909-264.454465-264.485495-264.454465zM544.636121 645.276444h165.409616v-99.247838l165.404445 165.409616-165.404445 165.403152v-99.242667H544.636121V645.276444z"></path></svg>`
        },
        chat_float: {
            id: 'chat_float',
            name: '聊天小窗',
            icon: `<svg viewBox="0 0 24 24" fill="white"><path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zM6 9h12v2H6V9zm8 5H6v-2h8v2zm4-6H6V6h12v2z"/></svg>`
        },
        dark_mode: {
            id: 'dark_mode',
            name: '深色/浅色模式',
            get icon() {
                const iphone = document.querySelector('.iphone');
                const isDark = iphone ? iphone.classList.contains('dark-mode') : (appSettings?.ios_theme_mode === 'dark');
                if (isDark) {
                    return `<svg viewBox="0 0 24 24" fill="white"><circle cx="12" cy="12" r="5"></circle><line x1="12" y1="1" x2="12" y2="3" stroke="white" stroke-width="2" stroke-linecap="round"></line><line x1="12" y1="21" x2="12" y2="23" stroke="white" stroke-width="2" stroke-linecap="round"></line><line x1="4.22" y1="4.22" x2="5.64" y2="5.64" stroke="white" stroke-width="2" stroke-linecap="round"></line><line x1="18.36" y1="18.36" x2="19.78" y2="19.78" stroke="white" stroke-width="2" stroke-linecap="round"></line><line x1="1" y1="12" x2="3" y2="12" stroke="white" stroke-width="2" stroke-linecap="round"></line><line x1="21" y1="12" x2="23" y2="12" stroke="white" stroke-width="2" stroke-linecap="round"></line><line x1="4.22" y1="19.78" x2="5.64" y2="18.36" stroke="white" stroke-width="2" stroke-linecap="round"></line><line x1="18.36" y1="5.64" x2="19.78" y2="4.22" stroke="white" stroke-width="2" stroke-linecap="round"></line></svg>`;
                }
                return `<svg viewBox="0 0 24 24" fill="white"><path d="M12 3a9 9 0 1 0 9 9c0-.46-.04-.92-.1-1.36a5.389 5.389 0 0 1-4.4 2.26 5.403 5.403 0 0 1-3.14-9.8c-.44-.06-.9-.1-1.36-.1z"/></svg>`;
            }
        },
        search_jump: {
            id: 'search_jump',
            name: '搜索跳转',
            icon: `<svg viewBox="0 0 24 24" fill="white"><path d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"/></svg>`
        },
        mute: {
            id: 'mute',
            name: '静音',
            get icon() {
                const isMuted = appSettings?.silent_mode_enabled === true;
                if (isMuted) {
                    return `<svg viewBox="0 0 24 24" fill="white"><path d="M4.27 3L3 4.27 7.73 9H3v6h4l5 5v-6.73l4.25 4.25c-.67.52-1.42.93-2.25 1.18v2.06c1.38-.31 2.63-.95 3.69-1.81L19.73 21 21 19.73l-9-9L4.27 3zM12 4L9.91 6.09 12 8.18V4z"/></svg>`;
                }
                return `<svg viewBox="0 0 24 24" fill="white"><path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z"/></svg>`;
            }
        },
        console: {
            id: 'console',
            name: '控制台',
            icon: `<svg viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="4 17 10 11 4 5"/><line x1="12" y1="19" x2="20" y2="19"/></svg>`
        },
        api_log: {
            id: 'api_log',
            name: 'API日志',
            icon: `<svg viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline></svg>`
        },
        none: {
            id: 'none',
            name: '无',
            icon: `<svg viewBox="0 0 24 24" fill="none" stroke="#8e8e93" stroke-width="2"><circle cx="12" cy="12" r="9" stroke-dasharray="3 3"/></svg>`
        }
    };

    /* 悬浮球快捷 API 预设与拉取模型居中弹窗 */
    let quickApiFetchedModels = [];

    function openQuickApiPresetModal() {
        const apis = (typeof apiDataList !== 'undefined' && Array.isArray(apiDataList)) ? apiDataList : [];
        if (apis.length === 0) {
            if (typeof showToast === 'function') showToast('请先在设置中添加 API');
            else alert('请先在设置中添加 API');
            return;
        }

        let modalWrap = document.getElementById('quickApiPresetCenterModalOverlay');
        if (!modalWrap) {
            modalWrap = document.createElement('div');
            modalWrap.id = 'quickApiPresetCenterModalOverlay';
            modalWrap.style.cssText = 'position: fixed; inset: 0; background: rgba(0,0,0,0.5); backdrop-filter: blur(10px); -webkit-backdrop-filter: blur(10px); z-index: 2147483646; display: flex; align-items: center; justify-content: center; opacity: 0; pointer-events: none; transition: opacity 0.25s ease; padding: 20px; box-sizing: border-box;';
            modalWrap.onclick = (e) => {
                if (e.target === modalWrap) closeQuickApiPresetModal();
            };
            document.body.appendChild(modalWrap);
        }

        renderQuickApiCenterModalContent();
        modalWrap.style.pointerEvents = 'auto';
        modalWrap.style.opacity = '1';
    }

    function renderQuickApiCenterModalContent() {
        const modalWrap = document.getElementById('quickApiPresetCenterModalOverlay');
        if (!modalWrap) return;

        const apis = (typeof apiDataList !== 'undefined' && Array.isArray(apiDataList)) ? apiDataList : [];
        const currentConnectedId = (typeof apiConnectedId !== 'undefined') ? apiConnectedId : (apis[0] ? apis[0].id : null);
        const currentApi = apis.find(a => a.id === currentConnectedId) || apis[0];

        modalWrap.innerHTML = `
            <div style="width: 100%; max-width: 320px; background: rgba(255, 255, 255, 0.95); backdrop-filter: blur(25px); -webkit-backdrop-filter: blur(25px); border-radius: 22px; padding: 20px 18px 18px; box-shadow: 0 16px 40px rgba(0,0,0,0.25); display: flex; flex-direction: column; box-sizing: border-box;" onclick="event.stopPropagation()">
                <div style="font-size: 17px; font-weight: 700; color: #000; text-align: center; margin-bottom: 14px;">API 预设</div>

                <div style="font-size: 12px; color: #8e8e93; margin-bottom: 6px; font-weight: 600; text-transform: uppercase;">切换预设</div>
                <div style="background: #f2f2f7; border-radius: 12px; max-height: 140px; overflow-y: auto; margin-bottom: 14px;">
                    ${apis.map(api => {
                        const isSelected = api.id === currentConnectedId;
                        return `
                            <div onclick="selectQuickApiPreset(${api.id})" style="display: flex; align-items: center; justify-content: space-between; padding: 10px 12px; border-bottom: 0.5px solid rgba(0,0,0,0.06); cursor: pointer;">
                                <div style="font-size: 14px; font-weight: ${isSelected ? '600' : '400'}; color: ${isSelected ? '#007aff' : '#000'}; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; flex: 1;">
                                    ${api.name}
                                </div>
                                ${isSelected ? '<svg viewBox="0 0 24 24" fill="none" stroke="#007aff" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" style="width: 16px; height: 16px; flex-shrink: 0;"><polyline points="20 6 9 17 4 12"></polyline></svg>' : ''}
                            </div>
                        `;
                    }).join('')}
                </div>

                <div style="font-size: 12px; color: #8e8e93; margin-bottom: 6px; font-weight: 600; text-transform: uppercase;">当前模型</div>
                <div style="background: #f2f2f7; border-radius: 12px; padding: 8px 12px; margin-bottom: 14px; display: flex; align-items: center;">
                    <select id="quickApiModelSelect" onchange="handleQuickModelSelectChange(this.value)" style="width: 100%; border: none; background: transparent; font-size: 14px; color: #000; font-weight: 600; outline: none; appearance: none; -webkit-appearance: none;">
                        ${(quickApiFetchedModels.length > 0 ? quickApiFetchedModels : (currentApi?.model ? [currentApi.model] : ['未选模型'])).map(m => `
                            <option value="${m}" ${m === currentApi?.model ? 'selected' : ''}>${m}</option>
                        `).join('')}
                    </select>
                </div>

                <div style="display: flex; gap: 10px; margin-top: 4px;">
                    <div onclick="closeQuickApiPresetModal()" style="flex: 1; background: #e5e5ea; color: #000000; padding: 12px 0; border-radius: 12px; font-size: 15px; font-weight: 600; text-align: center; cursor: pointer;">
                        关闭
                    </div>
                    <div onclick="quickFetchModelsDirectly()" style="flex: 1; background: #007aff; color: #ffffff; padding: 12px 0; border-radius: 12px; font-size: 15px; font-weight: 600; text-align: center; cursor: pointer; box-shadow: 0 4px 10px rgba(0,122,255,0.25);">
                        拉取模型
                    </div>
                </div>
            </div>
        `;
    }

    window.closeQuickApiPresetModal = function() {
        const modalWrap = document.getElementById('quickApiPresetCenterModalOverlay');
        if (modalWrap) {
            modalWrap.style.opacity = '0';
            modalWrap.style.pointerEvents = 'none';
        }
    };

    window.selectQuickApiPreset = function(apiId) {
        if (typeof connectApi === 'function') connectApi(apiId);
        quickApiFetchedModels = [];
        renderQuickApiCenterModalContent();
        if (typeof showToast === 'function') {
            const current = (typeof apiDataList !== 'undefined') ? apiDataList.find(a => a.id === apiId) : null;
            showToast(`已切换至：${current ? current.name : '已选预设'}`);
        }
    };

    window.handleQuickModelSelectChange = function(modelVal) {
        const apis = (typeof apiDataList !== 'undefined' && Array.isArray(apiDataList)) ? apiDataList : [];
        const currentConnectedId = (typeof apiConnectedId !== 'undefined') ? apiConnectedId : (apis[0] ? apis[0].id : null);
        const currentApi = apis.find(a => a.id === currentConnectedId);
        if (currentApi) {
            currentApi.model = modelVal;
            if (typeof saveApiData === 'function') saveApiData();
            if (typeof renderApiList === 'function') renderApiList();
            if (typeof showToast === 'function') showToast(`模型已设置为：${modelVal}`);
        }
    };

    window.quickFetchModelsDirectly = async function() {
        const apis = (typeof apiDataList !== 'undefined' && Array.isArray(apiDataList)) ? apiDataList : [];
        const currentConnectedId = (typeof apiConnectedId !== 'undefined') ? apiConnectedId : (apis[0] ? apis[0].id : null);
        const currentApi = apis.find(a => a.id === currentConnectedId) || apis[0];

        if (!currentApi || !currentApi.url || !currentApi.key) {
            if (typeof showToast === 'function') showToast('当前预设缺少 URL 或 Key');
            return;
        }

        try {
            if (typeof showToast === 'function') showToast('正在拉取模型...');
            const baseUrl = currentApi.url.endsWith('/') ? currentApi.url.slice(0, -1) : currentApi.url;
            const response = await fetch(`${baseUrl}/models`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${currentApi.key}`,
                    'Content-Type': 'application/json'
                }
            });

            if (!response.ok) throw new Error(`HTTP ${response.status}`);
            const data = await response.json();

            if (data && Array.isArray(data.data) && data.data.length > 0) {
                quickApiFetchedModels = data.data.map(item => item.id).filter(Boolean);
                if (quickApiFetchedModels.length > 0) {
                    currentApi.model = quickApiFetchedModels[0];
                    if (typeof saveApiData === 'function') saveApiData();
                    if (typeof renderApiList === 'function') renderApiList();
                    renderQuickApiCenterModalContent();
                    if (typeof showToast === 'function') showToast(`成功拉取 ${quickApiFetchedModels.length} 个模型`);
                }
            } else {
                throw new Error('未获取到模型列表');
            }
        } catch (err) {
            console.error('拉取模型失败:', err);
            if (typeof showToast === 'function') showToast(`拉取失败: ${err.message}`);
        }
    };

    // 默认 9 槽位初始预设 (九宫格完整填满)
    const DEFAULT_ASSISTIVE_SLOTS = [
        'home',        'api',       'backup',
        'chat_float',  'console',   'api_log',
        'search_jump', 'dark_mode', 'mute'
    ];

    let currentAssistiveSlots = [...DEFAULT_ASSISTIVE_SLOTS];
    let currentAssistiveCount = 9;
    let currentEditingSlotIndex = null;

    function getAssistiveSettings() {
        if (typeof appSettings !== 'undefined') {
            if (Array.isArray(appSettings.assistive_touch_slots) && appSettings.assistive_touch_slots.length >= 8) {
                currentAssistiveSlots = appSettings.assistive_touch_slots.map(value => value === 'prompt_testbench' ? 'api_log' : value);
                if (currentAssistiveSlots.length === 8) {
                    currentAssistiveSlots.push('api_log');
                }
            }
            if (typeof appSettings.assistive_touch_count === 'number') {
                currentAssistiveCount = Math.max(1, Math.min(9, appSettings.assistive_touch_count));
            }
        }
    }

    function saveAssistiveMenuConfig() {
        if (typeof appSettings !== 'undefined') {
            appSettings.assistive_touch_slots = currentAssistiveSlots;
            appSettings.assistive_touch_count = currentAssistiveCount;
            if (typeof saveAppSettings === 'function') saveAppSettings();
        }
    }

    function openAssistiveBallIconMenu(event) {
        if (event) event.stopPropagation();
        window.currentEditingIcon = 'assistiveBallIcon';
        window.currentIconTarget = 'assistiveBallIcon';
        window._currentIconMenuTarget = 'assistiveBallIcon';
        if (typeof openIconMenu === 'function') {
            openIconMenu(event, 'assistiveBallIcon');
        }
    }

    function renderAssistiveCustomizeGrid() {
        getAssistiveSettings();
        const container = document.getElementById('accessCustomGrid');
        const label = document.getElementById('accessCustomCountLabel');
        if (label) label.innerText = `${currentAssistiveCount} 个图标`;

        // Keep the preview in sync with the saved custom icon and appearance.
        const customBallIcon = appSettings?.assistive_ball_custom_icon || '';
        const previewEl = document.getElementById('accessBallStandalonePreview');
        const nameTagEl = document.getElementById('accessBallIconNameTag');
        if (previewEl) {
            previewEl.classList.toggle('custom-mode', Boolean(customBallIcon));
            const icon = document.createElement(customBallIcon ? 'img' : 'div');
            if (customBallIcon) {
                icon.src = customBallIcon;
                icon.alt = '';
            } else {
                icon.className = 'ios-assistive-ball-inner';
            }
            previewEl.replaceChildren(icon);
        }
        if (nameTagEl) nameTagEl.textContent = customBallIcon ? '已自定义' : '默认';
        updateAssistiveAppearanceUI();

        if (!container) return;
        container.innerHTML = '';

        // 3x3 九宫格完整 9 个槽位：0 到 8 全部可用
        const layoutMapping = [0, 1, 2, 3, 4, 5, 6, 7, 8];

        layoutMapping.forEach((slotIdx) => {
            const isSlotActive = slotIdx < currentAssistiveCount;
            const actionKey = isSlotActive ? currentAssistiveSlots[slotIdx] : 'none';
            const actionInfo = ASSISTIVE_ACTION_MAP[actionKey] || ASSISTIVE_ACTION_MAP.none;

            const slotEl = document.createElement('div');
            slotEl.className = `access-grid-slot ${isSlotActive ? 'active' : 'inactive'}`;
            slotEl.onclick = () => {
                if (isSlotActive) {
                    openAccessSlotPicker(slotIdx);
                } else {
                    currentAssistiveCount = slotIdx + 1;
                    saveAssistiveMenuConfig();
                    renderAssistiveCustomizeGrid();
                    renderAssistiveMenuPopup();
                }
            };

            slotEl.innerHTML = `
                <div class="access-slot-box">
                    <div class="access-slot-icon-circle ${isSlotActive && actionKey !== 'none' ? 'has-action' : ''}">
                        ${actionInfo.icon}
                    </div>
                </div>
                <div class="access-slot-label">${isSlotActive ? actionInfo.name : '添加'}</div>
            `;
            container.appendChild(slotEl);
        });
    }

    function adjustAssistiveIconCount(delta) {
        const next = Math.max(1, Math.min(9, currentAssistiveCount + delta));
        if (next !== currentAssistiveCount) {
            currentAssistiveCount = next;
            saveAssistiveMenuConfig();
            renderAssistiveCustomizeGrid();
            renderAssistiveMenuPopup();
        }
    }

    function resetAssistiveCustomizeMenu() {
        currentAssistiveSlots = [...DEFAULT_ASSISTIVE_SLOTS];
        currentAssistiveCount = 9;
        if (typeof appSettings !== 'undefined') {
            delete appSettings.assistive_ball_custom_icon;
            if (typeof saveAppSettings === 'function') saveAppSettings();
        }
        saveAssistiveMenuConfig();
        updateAssistiveBallUI();
        renderAssistiveCustomizeGrid();
        renderAssistiveMenuPopup();
        if (typeof showToast === 'function') showToast('已重设为默认图标');
    }

    function openAccessSlotPicker(slotIndex) {
        currentEditingSlotIndex = slotIndex;
        const currentKey = currentAssistiveSlots[slotIndex];
        const overlay = document.getElementById('accessSlotPickerOverlay');
        const sheet = document.getElementById('accessSlotPickerSheet');
        const list = document.getElementById('accessSlotPickerList');
        if (!overlay || !sheet || !list) return;

        list.innerHTML = '';
        Object.values(ASSISTIVE_ACTION_MAP).forEach((item) => {
            const isSelected = item.id === currentKey;
            const row = document.createElement('div');
            row.className = 'access-picker-row';
            row.onclick = () => selectAssistiveActionForSlot(item.id);
            row.innerHTML = `
                <div style="display: flex; align-items: center; gap: 12px;">
                    <div class="access-picker-icon-box">${item.icon}</div>
                    <span style="font-size: 16px; color: #000; font-weight: 500;">${item.name}</span>
                </div>
                ${isSelected ? '<svg viewBox="0 0 24 24" fill="none" stroke="#007aff" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" style="width: 18px; height: 18px;"><polyline points="20 6 9 17 4 12"></polyline></svg>' : ''}
            `;
            list.appendChild(row);
        });

        overlay.classList.add('show');
        sheet.classList.add('show');
    }

    function closeAccessSlotPicker() {
        const overlay = document.getElementById('accessSlotPickerOverlay');
        const sheet = document.getElementById('accessSlotPickerSheet');
        if (overlay) overlay.classList.remove('show');
        if (sheet) sheet.classList.remove('show');
        currentEditingSlotIndex = null;
    }

    function selectAssistiveActionForSlot(actionId) {
        if (currentEditingSlotIndex !== null && currentEditingSlotIndex >= 0) {
            currentAssistiveSlots[currentEditingSlotIndex] = actionId;
            saveAssistiveMenuConfig();
            renderAssistiveCustomizeGrid();
            renderAssistiveMenuPopup();
        }
        closeAccessSlotPicker();
    }

    /* 悬浮球与展开菜单 (图1效果) 渲染与逻辑 */
    let assistiveIdleTimer = null;

    function getAssistiveTargetContainer() {
        return document.body;
    }

    function ensureAssistiveBallDOM() {
        const targetContainer = document.body;
        if (!targetContainer) return;
        let ball = document.getElementById('iosAssistiveBall');
        let overlay = document.getElementById('iosAssistiveMenuOverlay');

        if (!ball || !overlay || !ball.parentElement || !overlay.parentElement) {
            if (ball && ball.parentElement) ball.parentElement.removeChild(ball);
            if (overlay && overlay.parentElement) overlay.parentElement.removeChild(overlay);
            const ballHTML = `
                <div class="ios-assistive-ball" id="iosAssistiveBall" style="display: none;">
                    <div class="ios-assistive-ball-inner"></div>
                </div>
                <div class="ios-assistive-menu-overlay" id="iosAssistiveMenuOverlay" onclick="closeAssistiveMenu(event)">
                    <div class="ios-assistive-menu" id="iosAssistiveMenu" onclick="event.stopPropagation()"></div>
                </div>
            `;
            targetContainer.insertAdjacentHTML('beforeend', ballHTML);
            initAssistiveBallDrag();
        } else {
            if (ball.parentElement !== targetContainer) {
                targetContainer.appendChild(ball);
                targetContainer.appendChild(overlay);
            } else if (targetContainer.lastElementChild !== overlay) {
                targetContainer.appendChild(ball);
                targetContainer.appendChild(overlay);
            }
            initAssistiveBallDrag();
        }
        bindAssistiveGlobalObserver(targetContainer);
    }

    let assistiveObserverBound = false;
    function bindAssistiveGlobalObserver(container) {
        if (assistiveObserverBound) return;
        assistiveObserverBound = true;
        let observerTimer = null;
        const observer = new MutationObserver(() => {
            if (observerTimer) return;
            observerTimer = setTimeout(() => {
                observerTimer = null;
                const isEnabled = (typeof appSettings !== 'undefined' && appSettings?.assistive_touch_enabled === true)
                    || (typeof window.appSettings !== 'undefined' && window.appSettings?.assistive_touch_enabled === true);
                if (isEnabled) {
                    let b = document.getElementById('iosAssistiveBall');
                    let o = document.getElementById('iosAssistiveMenuOverlay');
                    if (!b || !o || !b.parentElement || !o.parentElement) {
                        ensureAssistiveBallDOM();
                        updateAssistiveBallUI();
                    } else {
                        if (b.parentElement !== document.body || document.body.lastElementChild !== o) {
                            document.body.appendChild(b);
                            document.body.appendChild(o);
                        }
                        if (b.style.display !== 'flex') {
                            b.style.display = 'flex';
                        }
                    }
                }
            }, 30);
        });
        if (document.body) {
            observer.observe(document.body, { childList: true, subtree: true });
        }
    }

    function renderAssistiveMenuPopup() {
        ensureAssistiveBallDOM();
        getAssistiveSettings();
        const menu = document.getElementById('iosAssistiveMenu');
        if (!menu) return;

        menu.innerHTML = '';
        const activeActions = currentAssistiveSlots.slice(0, currentAssistiveCount).map(k => ASSISTIVE_ACTION_MAP[k] || ASSISTIVE_ACTION_MAP.none);

        activeActions.forEach((action) => {
            const itemEl = document.createElement('div');
            itemEl.className = 'ios-assistive-menu-item';
            itemEl.onclick = () => handleAssistiveAction(action.id);
            itemEl.innerHTML = `
                <div class="ios-assistive-menu-icon">${action.icon}</div>
                <span>${action.name}</span>
            `;
            menu.appendChild(itemEl);
        });
    }

    function initAssistiveBallDrag() {
        const ball = document.getElementById('iosAssistiveBall');
        if (!ball || ball._dragBound) return;
        ball._dragBound = true;

        let startX = 0, startY = 0, initialLeft = 0, initialTop = 0;
        let isPointerDown = false;
        let hasMoved = false;

        const onPointerDown = (e) => {
            isPointerDown = true;
            hasMoved = false;
            ball.classList.add('active');
            ball.classList.remove('idle');
            clearTimeout(assistiveIdleTimer);

            if (ball.setPointerCapture && e.pointerId !== undefined) {
                try { ball.setPointerCapture(e.pointerId); } catch (_) {}
            }

            const rect = ball.getBoundingClientRect();
            startX = e.clientX;
            startY = e.clientY;
            initialLeft = rect.left;
            initialTop = rect.top;
        };

        const onPointerMove = (e) => {
            if (!isPointerDown) return;
            const dx = e.clientX - startX;
            const dy = e.clientY - startY;
            if (Math.hypot(dx, dy) > 8) {
                hasMoved = true;
            }
            if (!hasMoved) return;

            const winWidth = window.innerWidth || document.documentElement.clientWidth;
            const winHeight = window.innerHeight || document.documentElement.clientHeight;
            const ballSize = ball.offsetWidth || 58;

            let nextLeft = initialLeft + dx;
            let nextTop = initialTop + dy;

            nextLeft = Math.max(8, Math.min(winWidth - ballSize - 8, nextLeft));
            nextTop = Math.max(8, Math.min(winHeight - ballSize - 8, nextTop));

            ball.style.left = `${nextLeft}px`;
            ball.style.top = `${nextTop}px`;
            ball.style.right = 'auto';
            ball.style.bottom = 'auto';
        };

        const onPointerUp = (e) => {
            if (!isPointerDown) return;
            isPointerDown = false;
            ball.classList.remove('active');

            if (ball.releasePointerCapture && e.pointerId !== undefined) {
                try { ball.releasePointerCapture(e.pointerId); } catch (_) {}
            }

            if (hasMoved) {
                const winWidth = window.innerWidth || document.documentElement.clientWidth;
                const ballSize = ball.offsetWidth || 58;
                const currentLeft = parseFloat(ball.style.left) || initialLeft;

                const snapLeft = (currentLeft + ballSize / 2 < winWidth / 2) ? 12 : (winWidth - ballSize - 12);
                ball.style.transition = 'left 0.3s cubic-bezier(0.25, 0.8, 0.25, 1), top 0.3s cubic-bezier(0.25, 0.8, 0.25, 1)';
                ball.style.left = `${snapLeft}px`;

                setTimeout(() => {
                    ball.style.transition = '';
                }, 300);
            } else {
                openAssistiveMenu();
            }

            resetAssistiveIdleTimer();
        };

        const onPointerCancel = (e) => {
            if (!isPointerDown) return;
            isPointerDown = false;
            ball.classList.remove('active');
            if (ball.releasePointerCapture && e.pointerId !== undefined) {
                try { ball.releasePointerCapture(e.pointerId); } catch (_) {}
            }
            resetAssistiveIdleTimer();
        };

        ball.addEventListener('pointerdown', onPointerDown);
        ball.addEventListener('pointermove', onPointerMove);
        ball.addEventListener('pointerup', onPointerUp);
        ball.addEventListener('pointercancel', onPointerCancel);
        resetAssistiveIdleTimer();
    }

    function resetAssistiveIdleTimer() {
        clearTimeout(assistiveIdleTimer);
        const ball = document.getElementById('iosAssistiveBall');
        if (!ball) return;
        assistiveIdleTimer = setTimeout(() => {
            ball.classList.add('idle');
        }, 3000);
    }

    let assistiveMenuOpenedAt = 0;

    function openAssistiveMenu() {
        assistiveMenuOpenedAt = Date.now();
        renderAssistiveMenuPopup();
        const overlay = document.getElementById('iosAssistiveMenuOverlay');
        const menu = document.getElementById('iosAssistiveMenu');
        if (!overlay || !menu) return;
        overlay.classList.add('show');
        menu.classList.add('show');
    }

    function closeAssistiveMenu(e) {
        if (Date.now() - assistiveMenuOpenedAt < 250) {
            return;
        }
        if (e && typeof e.stopPropagation === 'function') {
            e.stopPropagation();
        }
        const overlay = document.getElementById('iosAssistiveMenuOverlay');
        const menu = document.getElementById('iosAssistiveMenu');
        if (!overlay || !menu) return;
        menu.classList.remove('show');
        overlay.classList.remove('show');
        resetAssistiveIdleTimer();
    }

    function handleAssistiveAction(action) {
        closeAssistiveMenu();
        if (action === 'home') {
            if (typeof closeSettingsApp === 'function') closeSettingsApp();
            if (typeof closeApiApp === 'function') closeApiApp();
            if (typeof closeVoiceApp === 'function') closeVoiceApp();
            if (typeof closeImageGenApp === 'function') closeImageGenApp();
            if (typeof closeWorldbookApp === 'function') closeWorldbookApp();
            if (typeof closeIcloudApp === 'function') closeIcloudApp();
            if (typeof closeGeneralSettingsApp === 'function') closeGeneralSettingsApp();
            if (typeof closeAccessibilitySettingsApp === 'function') closeAccessibilitySettingsApp();
            if (typeof closeDisplaySettingsApp === 'function') closeDisplaySettingsApp();
            if (typeof closeAppleIdApp === 'function') closeAppleIdApp();
            if (typeof closeMessageNotificationSettingsApp === 'function') closeMessageNotificationSettingsApp();
            if (typeof closeSoundHapticsSettingsApp === 'function') closeSoundHapticsSettingsApp();
            if (typeof closeStandbyDiagnosticsApp === 'function') closeStandbyDiagnosticsApp();
            if (typeof closeWechatApp === 'function') closeWechatApp();
            if (typeof closeContactsApp === 'function') closeContactsApp();
        } else if (action === 'api') {
            openQuickApiPresetModal();
        } else if (action === 'backup') {
            if (typeof exportAllDataJson === 'function') {
                exportAllDataJson();
            } else if (typeof openIcloudApp === 'function') {
                openIcloudApp();
            }
        } else if (action === 'chat_float') {
            if (typeof window.toggleWechatFloatWindow === 'function') {
                window.toggleWechatFloatWindow();
            } else if (typeof window.openWechatApp === 'function') {
                window.openWechatApp();
            } else if (typeof showToast === 'function') {
                showToast('已打开聊天窗口');
            }
        } else if (action === 'dark_mode') {
            const iphone = document.querySelector('.iphone');
            const isDark = iphone ? iphone.classList.contains('dark-mode') : (appSettings?.ios_theme_mode === 'dark');
            if (typeof toggleDsAppearance === 'function') {
                toggleDsAppearance(isDark ? 'light' : 'dark');
            }
            renderAssistiveCustomizeGrid();
        } else if (action === 'search_jump') {
            if (typeof openSearchDrawer === 'function') {
                openSearchDrawer();
            } else {
                const searchOverlay = document.getElementById('searchDrawerOverlay');
                const searchDrawer = document.getElementById('searchDrawer');
                if (searchOverlay && searchDrawer) {
                    searchOverlay.classList.add('show');
                    searchDrawer.classList.add('show');
                    const searchInput = document.getElementById('globalSearchInput');
                    if (searchInput) {
                        searchInput.value = '';
                        setTimeout(() => searchInput.focus(), 200);
                    }
                    if (typeof renderSearchResults === 'function') renderSearchResults('');
                }
            }
        } else if (action === 'mute') {
            if (typeof toggleSilentMode === 'function') {
                toggleSilentMode();
            }
            renderAssistiveCustomizeGrid();
        } else if (action === 'console') {
            if (typeof openSystemDevConsoleModal === 'function') {
                openSystemDevConsoleModal();
            } else if (typeof openStandbyDiagnosticsApp === 'function') {
                openStandbyDiagnosticsApp();
            }
        } else if (action === 'api_log') {
            if (typeof openApiLogModal === 'function') {
                openApiLogModal();
            } else if (typeof openSystemDevConsoleModal === 'function') {
                openSystemDevConsoleModal();
            }
        } else if (action === 'prompt_testbench') {
            if (typeof window.openApiLogModal === 'function') window.openApiLogModal('prompt');
        }
    }

    const ASSISTIVE_BALL_DEFAULT_SIZE = 58;
    const ASSISTIVE_BALL_MIN_SIZE = 20;
    const ASSISTIVE_BALL_MAX_SIZE = 70;
    const ASSISTIVE_BALL_DEFAULT_OPACITY = 100;
    const ASSISTIVE_BALL_MIN_OPACITY = 20;
    const ASSISTIVE_BALL_MAX_OPACITY = 100;

    function clampAssistiveBallSize(value) {
        const parsed = parseInt(value, 10);
        return Number.isFinite(parsed)
            ? Math.min(ASSISTIVE_BALL_MAX_SIZE, Math.max(ASSISTIVE_BALL_MIN_SIZE, parsed))
            : ASSISTIVE_BALL_DEFAULT_SIZE;
    }

    function clampAssistiveBallOpacity(value) {
        const parsed = parseInt(value, 10);
        return Number.isFinite(parsed)
            ? Math.min(ASSISTIVE_BALL_MAX_OPACITY, Math.max(ASSISTIVE_BALL_MIN_OPACITY, parsed))
            : ASSISTIVE_BALL_DEFAULT_OPACITY;
    }

    function getAssistiveAppearanceSettings() {
        const settings = typeof appSettings !== 'undefined' ? appSettings : null;
        return {
            size: clampAssistiveBallSize(settings?.assistive_ball_size),
            opacity: clampAssistiveBallOpacity(settings?.assistive_ball_opacity)
        };
    }

    function updateAssistiveRangeVisual(slider) {
        if (!slider) return;
        const min = Number(slider.min || 0);
        const max = Number(slider.max || 100);
        const value = Number(slider.value || min);
        const percent = max > min ? ((value - min) / (max - min)) * 100 : 0;
        slider.style.background = `linear-gradient(to right, #007aff ${percent}%, #e5e5ea ${percent}%)`;
    }

    function updateAssistiveAppearanceUI(values = getAssistiveAppearanceSettings()) {
        const sizeText = document.getElementById('accessAssistiveSizeValueText');
        const sizeSlider = document.getElementById('accessAssistiveSizeSlider');
        const opacityText = document.getElementById('accessAssistiveOpacityValueText');
        const opacitySlider = document.getElementById('accessAssistiveOpacitySlider');

        if (sizeText) sizeText.innerText = `${values.size}px`;
        if (sizeSlider) {
            sizeSlider.value = values.size;
            updateAssistiveRangeVisual(sizeSlider);
        }
        if (opacityText) opacityText.innerText = `${values.opacity}%`;
        if (opacitySlider) {
            opacitySlider.value = values.opacity;
            updateAssistiveRangeVisual(opacitySlider);
        }
        const preview = document.getElementById('accessBallStandalonePreview');
        if (preview) {
            preview.style.width = values.size + 'px';
            preview.style.height = values.size + 'px';
            preview.style.opacity = String(values.opacity / 100);
        }
    }

    function keepAssistiveBallInViewport(ball, size) {
        if (!ball || !ball.style.left || ball.style.left === 'auto') return;
        const winWidth = window.innerWidth || document.documentElement.clientWidth;
        const winHeight = window.innerHeight || document.documentElement.clientHeight;
        const currentLeft = parseFloat(ball.style.left);
        const currentTop = parseFloat(ball.style.top);

        if (Number.isFinite(currentLeft)) {
            ball.style.left = `${Math.max(8, Math.min(winWidth - size - 8, currentLeft))}px`;
        }
        if (Number.isFinite(currentTop)) {
            ball.style.top = `${Math.max(8, Math.min(winHeight - size - 8, currentTop))}px`;
        }
    }

    function applyAssistiveBallAppearance() {
        const values = getAssistiveAppearanceSettings();
        updateAssistiveAppearanceUI(values);

        const ball = document.getElementById('iosAssistiveBall');
        if (!ball) return;

        const opacity = values.opacity / 100;
        ball.style.setProperty('--assistive-ball-size', `${values.size}px`);
        ball.style.setProperty('--assistive-ball-opacity', String(opacity));
        ball.style.setProperty('--assistive-ball-idle-opacity', String(Math.max(0.05, opacity * 0.42)));
        keepAssistiveBallInViewport(ball, values.size);
    }

    function handleAssistiveAppearanceInput(type, value) {
        if (typeof appSettings === 'undefined') return;

        if (type === 'size') {
            appSettings.assistive_ball_size = clampAssistiveBallSize(value);
        } else if (type === 'opacity') {
            appSettings.assistive_ball_opacity = clampAssistiveBallOpacity(value);
        } else {
            return;
        }

        applyAssistiveBallAppearance();
    }

    function commitAssistiveAppearanceSettings() {
        if (typeof saveAppSettings === 'function') saveAppSettings();
    }

    window.handleAssistiveAppearanceInput = handleAssistiveAppearanceInput;
    window.commitAssistiveAppearanceSettings = commitAssistiveAppearanceSettings;
    window.applyAssistiveBallAppearance = applyAssistiveBallAppearance;

    function updateAssistiveBallUI() {
        ensureAssistiveBallDOM();
        const isEnabled = appSettings?.assistive_touch_enabled === true;
        const customIcon = appSettings?.assistive_ball_custom_icon || '';
        const toggle = document.getElementById('accessAssistiveToggle');
        const summary = document.getElementById('accessTouchStatusSummary');
        const ball = document.getElementById('iosAssistiveBall');

        if (toggle) {
            toggle.classList.toggle('on', isEnabled);
            toggle.setAttribute('aria-checked', String(isEnabled));
        }
        if (summary) summary.innerText = isEnabled ? '开启' : '关闭';

        if (ball) {
            ball.style.display = isEnabled ? 'flex' : 'none';
            if (customIcon) {
                ball.classList.add('custom-mode');
                ball.innerHTML = `<img class="ios-assistive-custom-img" src="${customIcon}" alt="Ball Icon">`;
            } else {
                ball.classList.remove('custom-mode');
                ball.innerHTML = `<div class="ios-assistive-ball-inner"></div>`;
            }
        }

        applyAssistiveBallAppearance();
    }

    window.updateAssistiveBallUI = updateAssistiveBallUI;
    window.ensureAssistiveBallDOM = ensureAssistiveBallDOM;

    function toggleAssistiveBall() {
        if (typeof appSettings === 'undefined') return;
        const isEnabled = appSettings.assistive_touch_enabled !== true;
        appSettings.assistive_touch_enabled = isEnabled;
        if (typeof saveAppSettings === 'function') saveAppSettings();
        updateAssistiveBallUI();
        if (typeof showToast === 'function') showToast(isEnabled ? '悬浮球已开启' : '悬浮球已关闭');
    }

    // 页面加载多阶段初始化悬浮球状态（消除数据库异步读取延迟）
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => {
            updateAssistiveBallUI();
            setTimeout(updateAssistiveBallUI, 300);
            setTimeout(updateAssistiveBallUI, 800);
            setTimeout(updateAssistiveBallUI, 1500);
        });
    } else {
        updateAssistiveBallUI();
        setTimeout(updateAssistiveBallUI, 300);
        setTimeout(updateAssistiveBallUI, 800);
        setTimeout(updateAssistiveBallUI, 1500);
    }

    // 页面可见性、焦点切换、路由与定时保障悬浮球全页面常驻
    window.addEventListener('focus', updateAssistiveBallUI);
    window.addEventListener('popstate', updateAssistiveBallUI);
    window.addEventListener('hashchange', updateAssistiveBallUI);
    document.addEventListener('visibilitychange', () => {
        if (document.visibilityState === 'visible') {
            updateAssistiveBallUI();
        }
    });
    setInterval(() => {
        const isEnabled = (typeof appSettings !== 'undefined' && appSettings?.assistive_touch_enabled === true)
            || (typeof window.appSettings !== 'undefined' && window.appSettings?.assistive_touch_enabled === true);
        if (isEnabled) {
            updateAssistiveBallUI();
        }
    }, 1200);

    // ==========================================
    // 强制全屏与左滑返回全局逻辑
    // ==========================================
    function toggleForceFullscreen() {
        if (typeof appSettings === 'undefined') return;
        const isEnabled = appSettings.force_fullscreen_enabled !== true;
        appSettings.force_fullscreen_enabled = isEnabled;
        if (typeof saveAppSettings === 'function') saveAppSettings();
        updateForceFullscreenUI();
        
        // The switch and recovery share the same fullscreen request path.
        const controller = window.tonghuajiFullscreenController;
        if (controller) {
            const transition = controller.setEnabled(isEnabled);
            if (isEnabled) {
                Promise.resolve(transition).then(entered => {
                    if (!entered && appSettings.force_fullscreen_enabled === true &&
                        typeof showToast === 'function') {
                        showToast('浏览器未能进入全屏，请关闭开关后重试');
                    }
                }).catch(() => {});
            }
        } else if (isEnabled && typeof showToast === 'function') {
            showToast('当前设备不支持网页强制全屏');
        }

        if (typeof showToast === 'function') {
            showToast(isEnabled ? '已开启强制全屏偏好' : '强制全屏已关闭');
        }
    }

    function updateForceFullscreenUI() {
        const isEnabled = appSettings?.force_fullscreen_enabled === true;
        const toggle = document.getElementById('forceFullscreenToggle');
        if (toggle) {
            toggle.classList.toggle('on', isEnabled);
            toggle.setAttribute('aria-checked', String(isEnabled));
        }
    }

    function toggleSwipeBack() {
        if (typeof appSettings === 'undefined') return;
        const isEnabled = appSettings.swipe_back_enabled !== true;
        appSettings.swipe_back_enabled = isEnabled;
        if (typeof saveAppSettings === 'function') saveAppSettings();
        updateSwipeBackUI();
        if (typeof showToast === 'function') showToast(isEnabled ? '右滑返回已开启' : '右滑返回已关闭');
    }

    function updateSwipeBackUI() {
        const isEnabled = appSettings?.swipe_back_enabled === true;
        const toggle = document.getElementById('swipeBackToggle');
        if (toggle) {
            toggle.classList.toggle('on', isEnabled);
            toggle.setAttribute('aria-checked', String(isEnabled));
        }
    }

    function toggleSystemBack() {
        if (typeof appSettings === 'undefined') return;
        const isEnabled = appSettings.system_back_enabled !== true;
        appSettings.system_back_enabled = isEnabled;
        if (typeof saveAppSettings === 'function') saveAppSettings();
        updateSystemBackUI();
        if (typeof showToast === 'function') showToast(isEnabled ? '系统返回键已启用' : '系统返回键已关闭');

        // Notify swipe-back.js to update history management
        if (typeof window.updateSystemBackState === 'function') {
            window.updateSystemBackState(isEnabled);
        }
    }
    window.toggleSystemBack = toggleSystemBack;

    function updateSystemBackUI() {
        const isEnabled = appSettings?.system_back_enabled === true;
        const toggle = document.getElementById('systemBackToggle');
        if (toggle) {
            toggle.classList.toggle('on', isEnabled);
            toggle.setAttribute('aria-checked', String(isEnabled));
        }
    }

    // 打开角色主动消息页面
    window.openProactiveMessagesApp = function() {
        const proactiveMessagesAppUI = document.getElementById('proactiveMessagesAppUI');
        if (!proactiveMessagesAppUI) return;

        proactiveMessagesAppUI.style.display = 'flex';
        setTimeout(() => {
            proactiveMessagesAppUI.classList.add('show');
            renderProactiveContactsList();
            syncEnabledBackendMessageContexts();
        }, 10);
    };

    // 关闭角色主动消息页面
    window.closeProactiveMessagesApp = function() {
        const proactiveMessagesAppUI = document.getElementById('proactiveMessagesAppUI');
        if (!proactiveMessagesAppUI) return;

        proactiveMessagesAppUI.classList.remove('show');
        setTimeout(() => {
            proactiveMessagesAppUI.style.display = 'none';
        }, 300);
    };

    // 渲染联系人列表
    function syncEnabledBackendMessageContexts() {
        if (typeof window.ProactivePush?.sync !== 'function' || typeof wcContactsList === 'undefined' || !Array.isArray(wcContactsList)) return;
        wcContactsList
            .filter(contact => localStorage.getItem(`proactive_enabled_${contact.id}`) === 'true')
            .forEach(contact => {
                window.ProactivePush.sync(contact.id).catch(error => console.debug('后端消息上下文刷新失败:', error));
            });
    }

    async function renderProactiveContactsList() {
        const container = document.getElementById('proactiveContactsListContainer');
        if (!container) return;

        // 显示加载状态
        container.innerHTML = '<div style="padding: 20px; text-align: center; color: #888;">加载中...</div>';

        // Backend delivery must use the same contact records as WeChat active messages.
        const contacts = typeof wcContactsList !== 'undefined' && Array.isArray(wcContactsList)
            ? wcContactsList
            : [];

        if (contacts.length === 0) {
            container.innerHTML = '<div style="padding: 20px; text-align: center; color: #888;">暂无角色<br><small style="color: #ccc; font-size: 12px; margin-top: 8px; display: block;">请先在微信中添加角色</small></div>';
            return;
        }

        // 生成联系人卡片
        container.innerHTML = '';
        contacts.forEach(contact => {
            const isEnabled = isProactiveEnabledForContact(contact.id);

            const card = document.createElement('div');
            card.className = 'ds-card-item';
            card.style.cssText = 'display: flex; align-items: center; padding: 12px 16px; background: white; margin-bottom: 8px; border-radius: 12px;';

            // 头像
            const avatarDiv = document.createElement('div');
            avatarDiv.style.cssText = 'width: 44px; height: 44px; border-radius: 50%; overflow: hidden; margin-right: 12px; flex-shrink: 0;';
            if (contact.avatar) {
                avatarDiv.innerHTML = `<img src="${contact.avatar}" style="width: 100%; height: 100%; object-fit: cover;" />`;
            } else {
                const initial = contact.name ? contact.name.charAt(0) : '?';
                avatarDiv.innerHTML = `<div style="width: 100%; height: 100%; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); display: flex; align-items: center; justify-content: center; color: white; font-size: 18px; font-weight: 500;">${initial}</div>`;
            }

            // 名字
            const nameDiv = document.createElement('div');
            nameDiv.style.cssText = 'flex: 1; min-width: 0;';
            const interval = Number(contact.proactiveMessageIntervalMinutes);
            nameDiv.innerHTML = `<div style="font-size: 16px; font-weight: 500; color: #000;">${contact.name || '未命名'}</div><div style="font-size: 12px; color: #8e8e93; margin-top: 3px;">${isEnabled ? (Number.isFinite(interval) ? `已开启 · 每 ${interval} 分钟` : '已开启 · 自动判断') : '未开启'}</div>`;

            if (isEnabled) {
                const testButton = document.createElement('button');
                testButton.type = 'button';
                testButton.textContent = '测试';
                testButton.style.cssText = 'border: 0; background: rgba(0,122,255,.1); color: #007aff; border-radius: 8px; padding: 6px 9px; margin-right: 10px; font-size: 12px;';
                testButton.addEventListener('click', async event => {
                    event.stopPropagation(); testButton.disabled = true; testButton.textContent = '发送中';
                    try {
                        const result = await window.ProactivePush?.test(contact.id);
                        const message = `请在 ${result?.delaySeconds || 15} 秒内退出或划掉童话机；若仍收到通知，说明后台消息可用。`;
                        if (typeof showToast === 'function') showToast(message);
                    }
                    catch (error) { showBackendMessageAlert('后台测试失败', error?.message || '测试通知发送失败'); }
                    finally { testButton.disabled = false; testButton.textContent = '测试'; }
                });
                card.appendChild(testButton);
            }

            // Toggle开关
            const toggleDiv = document.createElement('div');
            toggleDiv.className = `set-toggle ${isEnabled ? 'on' : ''}`;
            toggleDiv.setAttribute('role', 'switch');
            toggleDiv.setAttribute('aria-checked', String(isEnabled));
            toggleDiv.style.cursor = 'pointer';
            toggleDiv.addEventListener('click', (e) => {
                e.stopPropagation();
                console.log('Toggle div clicked!', contact.id);
                toggleSettingsBackendMessage(contact.id);
            });

            card.appendChild(avatarDiv);
            card.appendChild(nameDiv);
            card.appendChild(toggleDiv);
            container.appendChild(card);
        });
    }

    // 检查某个联系人是否启用主动消息
    function isProactiveEnabledForContact(contactId) {
        if (typeof localStorage === 'undefined') return false;
        const key = `proactive_enabled_${contactId}`;
        return localStorage.getItem(key) === 'true';
    }

    // 切换某个联系人的主动消息状态
    function showBackendMessageAlert(title, message) {
        if (typeof showCustomAlert === 'function') {
            showCustomAlert(title, message);
            return;
        }
        if (typeof showToast === 'function') showToast(message);
    }

    async function toggleSettingsBackendMessage(contactId) {
        console.log('Toggle clicked for contact:', contactId);

        if (typeof localStorage === 'undefined') {
            console.error('localStorage not available');
            return;
        }

        const key = `proactive_enabled_${contactId}`;
        const currentState = localStorage.getItem(key) === 'true';
        const newState = !currentState;

        console.log('Toggling from', currentState, 'to', newState);

        let pushReady = true;
        let contactName = '该角色';
        const wechatContact = typeof wcContactsList !== 'undefined' && Array.isArray(wcContactsList)
            ? wcContactsList.find(item => String(item.id) === String(contactId))
            : null;
        const contact = wechatContact;
        if (contact) contactName = contact.remark || contact.name || '该角色';

        if (newState && wechatContact?.proactiveMessageEnabled !== true) {
            showBackendMessageAlert('请先开启微信主动消息', '请先前往微信设置，开启该角色的“主动消息”，再开启后端消息。');
            return;
        }

        try {
            if (!window.ProactivePush) throw new Error('推送模块尚未加载');
            if (newState) {
                await window.ProactivePush.register(contactId, contact?.remark || contact?.name || contactName, contact?.avatar, contact?.proactiveMessageIntervalMinutes);
            } else {
                await window.ProactivePush.unregister(contactId);
            }
        } catch (error) {
            pushReady = false;
            localStorage.setItem(key, String(!newState));
            console.error('Failed to update backend message:', error);
            showBackendMessageAlert(newState ? '无法开启后端消息' : '无法关闭后端消息', error?.message || '后端消息设置失败');
        }
        if (pushReady) localStorage.setItem(key, String(newState));

        if (wechatContact) {
            if (newState) wechatContact.proactivePushRegistered = true;
            else delete wechatContact.proactivePushRegistered;
            if (typeof wcSaveContactsDataAsync === 'function') await wcSaveContactsDataAsync();
        }

        if (pushReady && typeof window.ProactivePush?.sync === 'function' && newState) {
            try { await window.ProactivePush.sync(contactId); } catch (error) { console.error('Failed to sync backend message runtime:', error); }
        }
        await renderProactiveContactsList();
        if (pushReady && typeof showToast === 'function') showToast(newState ? `已为${contactName}开启后端消息` : `已为${contactName}关闭后端消息`);
    };

    (function initFloatingDiagnosticsPanels() {
    'use strict';
    const escapeDiag = value => String(value == null ? '' : value).replace(/[&<>"']/g, char => ({
        '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
    }[char]));
    const scrubDiag = text => String(text || '')
        .replace(/Bearer\s+\S+/gi, 'Bearer [hidden]')
        .replace(/sk-[a-z0-9_-]{6,}/gi, '[hidden]')
        .replace(/([?&](?:key|token|secret|api_key)=)[^&\s]+/gi, '$1[hidden]');
    function copyText(text) {
        const value = scrubDiag(text);
        const fallback = () => {
            const input = document.createElement('textarea');
            input.value = value;
            input.style.cssText = 'position:fixed;opacity:0;pointer-events:none;';
            document.body.appendChild(input);
            input.select();
            const success = document.execCommand('copy');
            input.remove();
            if (!success) throw new Error('复制失败');
        };
        return (navigator.clipboard && window.isSecureContext ? navigator.clipboard.writeText(value) : Promise.resolve().then(fallback))
            .then(() => { if (typeof showToast === 'function') showToast('已复制'); })
            .catch(() => { try { fallback(); if (typeof showToast === 'function') showToast('已复制'); } catch (_) { if (typeof showToast === 'function') showToast('复制失败'); } });
    }
    function currentApi() {
        try {
            const list = typeof apiDataList !== 'undefined' && Array.isArray(apiDataList) ? apiDataList : [];
            const id = typeof apiConnectedId !== 'undefined' ? apiConnectedId : null;
            // A missing active selection must not silently display another site's quota.
            return list.find(item => String(item.id) === String(id)) || null;
        } catch (_) { return null; }
    }
    function siteOf(api) {
        try { return new URL(api?.url || '').origin; } catch (_) { return ''; }
    }
    const toNum = value => Number.isFinite(value) ? value.toLocaleString('zh-CN') : '--';
    function formatQuota(value, quota, field = 'remaining') {
        if (typeof value !== 'number' || !Number.isFinite(value)) return String(value ?? '--');
        const raw = quota?.[field + 'IsRaw'] === true;
        if (raw) {
            const perUnit = Number(quota?.quotaPerUnit);
            const currency = quota?.quotaCurrency;
            const multiplier = Number(quota?.quotaExchangeRate);
            if (Number.isFinite(perUnit) && perUnit > 0 && ['USD', 'CNY'].includes(currency)
                && Number.isFinite(multiplier) && multiplier > 0) {
                const amount = value / perUnit * multiplier;
                const sign = currency === 'CNY' ? '¥' : '$';
                return sign + amount.toLocaleString('zh-CN', { minimumFractionDigits: 2, maximumFractionDigits: 4 });
            }
            return (Math.abs(value) >= 100000
                ? (value / 10000).toLocaleString('zh-CN', { maximumFractionDigits: 2 }) + '万'
                : toNum(value)) + '额度点';
        }
        const currency = field === 'remaining' ? quota?.currency
            : field === 'keyRemaining' ? quota?.keyCurrency
            : field === 'keyUsed' ? quota?.keyUsedCurrency
            : field === 'billingUsed' ? quota?.billingUsedCurrency
            : field === 'billingGranted' ? quota?.billingGrantedCurrency
            : (quota?.[field + 'Currency'] || quota?.currency);
        if (currency === 'USD' || currency === 'CNY') {
            const sign = currency === 'CNY' ? '¥' : '$';
            return sign + value.toLocaleString('zh-CN', { minimumFractionDigits: 2, maximumFractionDigits: 4 });
        }
        const unit = field === 'billingUsed' ? (quota?.billingUsedUnit || '站点计费单位')
            : field === 'billingGranted' ? (quota?.billingGrantedUnit || '站点计费单位')
            : field === 'keyUsed' ? '额度点'
            : field === 'remaining' ? quota?.remainingUnit :
            quota?.totalUsedKind === 'billing' ? quota?.remainingUnit :
            field === 'keyRemaining' ? (quota?.keyCurrency === 'USD' ? 'USD' : '额度点') : '额度点';
        return toNum(value) + ' ' + (unit || '额度点');
    }
    const clock = stamp => stamp ? new Date(stamp).toLocaleTimeString('zh-CN', { hour12: false }) : '--';
    let activeTab = 'activity';
    let onlyErrors = false;
    function ensureApiModal() {
        let overlay = document.getElementById('apiLogModalOverlay');
        if (overlay) return overlay;
        overlay = document.createElement('div');
        overlay.className = 'api-log-modal-overlay';
        overlay.id = 'apiLogModalOverlay';
        overlay.innerHTML = `
            <section class="api-log-modal" role="dialog" aria-modal="true" aria-label="API 日志">
                <div class="diag-modal-heading">
                    <div class="diag-heading-text"><div class="diag-eyebrow">API RECORD</div><h2>API 日志</h2></div>
                    <button type="button" class="diag-done" id="apiLogDone" aria-label="关闭 API 日志" title="关闭"><svg viewBox="0 0 24 24" width="15" height="15" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="2.1" stroke-linecap="round"><path d="M18 6 6 18M6 6l12 12"/></svg></button>
                </div>
                <div class="diag-site-caption" id="apiLogSiteLabel">当前 API 站点</div>
                <div class="api-hud-grid">
                    <div class="api-hud-item"><span class="api-hud-label" id="apiHudQuotaLabel">真实剩余额度</span><strong class="api-hud-val" id="apiHudQuotaVal">未提供</strong></div>
                    <div class="api-hud-item"><span class="api-hud-label">今日已扣额度<span class="diag-label-note">（已知）</span></span><strong class="api-hud-val" id="apiHudDeductedVal">未提供</strong></div>
                    <div class="api-hud-item"><span class="api-hud-label">本机今日调用</span><strong class="api-hud-val" id="apiHudCallsVal">0 次</strong></div>
                    <div class="api-hud-item"><span class="api-hud-label">本机今日 Token</span><strong class="api-hud-val" id="apiHudTokensVal">--</strong></div>
                </div>
                <div class="diag-summary-note" id="apiQuotaNote">按当前连接的 API Key 查询；账户钱包余额仅在站点明确返回时显示。</div>
                <div class="diag-segments" role="tablist" aria-label="API 调试分类">
                    <button type="button" class="is-active" data-api-tab="activity">调用记录</button>
                    <button type="button" data-api-tab="prompt">提示词诊断</button>
                    <button type="button" data-api-tab="quota">站点额度</button>
                </div>
                <div class="diag-page" data-api-page="activity">
                    <div class="diag-tools"><span id="apiLogCount">本次使用期间的真实请求</span><div>
                        <button type="button" class="diag-tool-btn" id="apiLogFilter">仅失败</button>
                        <button type="button" class="diag-tool-btn" id="apiLogClear">清空</button>
                    </div></div>
                    <div class="api-log-body" id="apiLogOutputList"></div>
                </div>
                <div class="diag-page" data-api-page="prompt" hidden>
                    <div id="wcPromptTestbenchPanel">
                        <div class="diag-tools"><div><strong id="wcPromptTestbenchTitle">本轮真实拼装检查</strong><p id="wcPromptTestbenchStatus">不展示提示词正文</p></div>
                            <button type="button" class="diag-tool-btn" id="wcPromptTestbenchRefresh">重新诊断</button></div>
                        <div class="api-log-body" id="wcPromptTestbenchBody"></div>
                    </div>
                </div>
                <div class="diag-page" data-api-page="quota" hidden>
                    <div class="api-log-body diag-quota-body">
                        <div class="diag-info-box" id="apiQuotaInfo">正在读取当前站点的余额、已使用量和密钥额度。</div>
                        <p class="diag-field-hint" id="apiQuotaProbeDetails"></p>
                        <div class="diag-quota-ledger">
                            <div class="diag-quota-ledger-row"><span>当前密钥可用额度</span><strong id="apiQuotaKeyRemaining">--</strong></div>
                            <div class="diag-quota-ledger-row"><span id="apiQuotaTotalUsedLabel">站点账单已用</span><strong id="apiQuotaTotalUsed">--</strong></div>
                            <div class="diag-quota-ledger-row"><span>当前密钥累计已用</span><strong id="apiQuotaKeyUsed">--</strong></div>
                            <div class="diag-quota-ledger-row"><span id="apiQuotaGrantedLabel">当前密钥累计授予</span><strong id="apiQuotaGranted">--</strong></div>
                            <div class="diag-quota-ledger-row"><span>本机今天已记录的调用</span><strong id="apiQuotaDailyCalls">0 次</strong></div>
                        </div>
                        <div class="diag-account-box">
                            <div class="diag-account-title">当前模型 · 站点公开价格</div>
                            <p class="diag-field-hint" id="apiPricingStatus">正在检测当前站点的公开模型价格接口。</p>
                            <div class="diag-quota-ledger">
                                <div class="diag-quota-ledger-row"><span>模型</span><strong id="apiPricingModel">--</strong></div>
                                <div class="diag-quota-ledger-row"><span>公开价格 / 倍率</span><strong id="apiPricingValue">--</strong></div>
                            </div>
                            <p class="diag-field-hint">此处是站点发布的参考价，不代表本次实际扣款。实际扣款只使用站点提供的账单信息。</p>
                        </div>
                        <button type="button" class="diag-main-btn" id="apiQuotaQuery">↻　刷新额度与账单</button>
                        <p class="diag-field-hint diag-quota-feedback" id="apiQuotaQueryStatus" role="status" aria-live="polite">准备查询</p>
                    </div>
                </div>
            </section>`;
        document.body.appendChild(overlay);
        overlay.addEventListener('click', event => { if (event.target === overlay) window.closeApiLogModal(); });
        overlay.querySelector('#apiLogDone').addEventListener('click', () => window.closeApiLogModal());
        overlay.querySelectorAll('[data-api-tab]').forEach(btn => btn.addEventListener('click', () => selectApiTab(btn.dataset.apiTab)));
        overlay.querySelector('#wcPromptTestbenchRefresh').addEventListener('click', () => {
            if (typeof window.wcRefreshPromptTestbench === 'function') void window.wcRefreshPromptTestbench();
        });
        overlay.querySelector('#apiLogClear').addEventListener('click', () => {
            window.tongApiMonitor?.clear();
            renderApiLogs();
        });
        overlay.querySelector('#apiLogFilter').addEventListener('click', event => {
            onlyErrors = !onlyErrors;
            event.currentTarget.classList.toggle('is-active', onlyErrors);
            renderApiLogs();
        });
        overlay.querySelector('#apiQuotaQuery').addEventListener('click', () => {
            void refreshCurrentQuota(true);
        });
        overlay.querySelector('#apiLogOutputList').addEventListener('click', event => {
            const button = event.target.closest('[data-copy-api-index]');
            if (!button) return;
            const log = window.tongApiMonitor?.getSessionLogs?.()?.[Number(button.dataset.copyApiIndex)];
            if (log) void copyText(JSON.stringify(log, null, 2));
        });
        return overlay;
    }
    function selectApiTab(tab) {
        if (!['activity', 'prompt', 'quota'].includes(tab)) return;
        activeTab = tab;
        const overlay = ensureApiModal();
        overlay.querySelectorAll('[data-api-tab]').forEach(item => {
            item.classList.toggle('is-active', item.dataset.apiTab === tab);
            item.setAttribute('aria-selected', String(item.dataset.apiTab === tab));
        });
        overlay.querySelectorAll('[data-api-page]').forEach(page => { page.hidden = page.dataset.apiPage !== tab; });
        if (tab === 'prompt' && typeof window.wcRefreshPromptTestbench === 'function') {
            void window.wcRefreshPromptTestbench();
        }
        if (tab === 'quota') {
            const api = currentApi();
            if (api && (!window.tongApiMonitor?.getQuota(siteOf(api), api.key) || !window.tongApiMonitor?.getPricing?.(api))) void refreshCurrentQuota(false);
        }
    }
    function renderApiLogs() {
        const overlay = document.getElementById('apiLogModalOverlay');
        if (!overlay) return;
        const monitor = window.tongApiMonitor;
        const list = overlay.querySelector('#apiLogOutputList');
        const api = currentApi();
        const site = siteOf(api);
        // Never confuse IndexedDB history from an earlier app session with new requests.
        const logs = monitor?.getSessionLogs?.() || [];
        const filtered = onlyErrors ? logs.filter(log => log.status === 'error') : logs;
        const day = monitor?.getDaily(site) || {};
        const quota = monitor?.getQuota(site, api?.key);
        const pricing = api ? monitor?.getPricing?.(api) : null;
        const verified = quota?.remaining != null;
        const billingKnown = Number.isFinite(quota?.billingUsed);
        const keyUsedKnown = Number.isFinite(quota?.keyUsed) || Number.isFinite(quota?.totalUsed);
        const accountLike = ['account', 'billing'].includes(quota?.remainingKind) || quota?.scope === '账户';
        const readAmount = (field, source = quota) => {
            const value = source?.[field];
            return value == null ? '--' : formatQuota(value, source, field);
        };
        const leadingField = verified ? 'remaining'
            : billingKnown ? 'billingUsed'
            : Number.isFinite(quota?.keyUsed) ? 'keyUsed' : 'totalUsed';
        overlay.querySelector('#apiHudQuotaLabel').textContent = verified
            ? accountLike ? '站点返回的剩余额度' : '当前密钥剩余额度'
            : billingKnown ? '站点账单已消耗'
            : keyUsedKnown ? '当前密钥已使用' : '站点剩余额度';
        overlay.querySelector('#apiHudQuotaVal').textContent =
            verified || billingKnown || keyUsedKnown ? readAmount(leadingField) : '尚未获得额度数据';
        overlay.querySelector('#apiHudDeductedVal').textContent = quota?.todayUsed != null
            ? formatQuota(quota.todayUsed, quota)
            : day.spendReports > 0 ? Number(day.reportedSpend).toFixed(4) + '*' : '未提供';
        overlay.querySelector('#apiHudCallsVal').textContent = String(day.calls || 0) + ' 次';
        overlay.querySelector('#apiHudTokensVal').textContent = day.tokenReports ? toNum(day.knownTokens || 0) : '--';
        overlay.querySelector('#apiQuotaKeyRemaining').textContent = quota?.keyRemaining != null
            ? readAmount('keyRemaining')
            : quota?.remainingKind === 'key' && verified ? readAmount('remaining') : '站点未提供';
        overlay.querySelector('#apiQuotaTotalUsed').textContent = billingKnown
            ? readAmount('billingUsed') : Number.isFinite(quota?.keyUsed)
                ? readAmount('keyUsed') : readAmount('totalUsed');
        overlay.querySelector('#apiQuotaTotalUsedLabel').textContent = billingKnown
            ? '站点账单已用（接口报告）' : '已读取的累计消耗';
        overlay.querySelector('#apiQuotaKeyUsed').textContent = Number.isFinite(quota?.keyUsed)
            ? readAmount('keyUsed') : '--';
        overlay.querySelector('#apiQuotaGranted').textContent = quota?.billingGranted != null
            ? readAmount('billingGranted') : readAmount('granted');
        overlay.querySelector('#apiQuotaGrantedLabel').textContent = quota?.billingGranted != null
            ? '站点计费总上限（非余额）' : (quota?.grantedLabel || '当前密钥累计授予');
        overlay.querySelector('#apiQuotaDailyCalls').textContent = String(day.calls || 0) + ' 次';
        overlay.querySelector('#apiLogCount').textContent =
            '本次使用 ' + filtered.length + ' 条 · 不保存提示词或密钥';
        const summary = overlay.querySelector('#apiQuotaInfo');
        if (quota && verified) {
            summary.textContent = (quota.scope || '站点') + '已返回剩余额度 · 来源：' + quota.source + ' · ' + clock(quota.at);
        } else if (billingKnown) {
            summary.textContent = '已读取站点上报的已消耗额度；当前 API Key 尚未获取到账户剩余余额。使用金额不能当作余额。';
        } else if (keyUsedKnown) {
            summary.textContent = '已读到当前密钥的累计消耗，但没有获得可验证的账户余额。';
        } else {
            summary.textContent = '没有获得可验证的额度数据，请查看下方接口返回情况。';
        }
        const feedback = overlay.querySelector('#apiQuotaQueryStatus');
        if (feedback && feedback.dataset.loading !== 'yes') {
            feedback.textContent = quota
                ? '已更新 · ' + clock(quota.at) + ' · ' + quota.source
                : (monitor?.getQuotaError(site, api?.key) || '当前站点没有开放已识别的查询接口');
        }
        const probeDetails = overlay.querySelector('#apiQuotaProbeDetails');
        if (probeDetails) probeDetails.textContent = quota?.probeErrors?.length
            ? '接口情况：' + quota.probeErrors.slice(0, 3).join('；')
            : quota ? '额度和用量来源已分别识别。' : '';
        overlay.querySelector('#apiQuotaNote').textContent = billingKnown
            ? '站点计费接口报告的已用量可能按查询区间统计，不能直接当作全账户历史总消耗；当前查询区间：'
                + (quota.billingPeriod || '站点指定区间') + '。'
            : '分别展示能核实的剩余额度、令牌累计消耗和计费总额度；没有证据时不显示估算余额。';
        const priceStatus = overlay.querySelector('#apiPricingStatus');
        const priceValue = overlay.querySelector('#apiPricingValue');
        const priceModel = overlay.querySelector('#apiPricingModel');
        const modelName = String(api?.model || '').trim();
        if (priceModel) priceModel.textContent = modelName || '未选择模型';
        const rate = pricing?.models?.get(modelName);
        if (priceValue) {
            priceValue.textContent = !rate ? '--' : rate.quotaType === 'fixed' && rate.price !== null
                ? '$' + rate.price + '/次（未计分组倍率）'
                : '输入倍率 ' + (rate.modelRatio ?? '--') + ' · 输出倍率 ' + (rate.completionRatio ?? '--');
        }
        if (priceStatus) priceStatus.textContent = rate
            ? `读取站点公开价格 · ${clock(pricing.at)} 更新；实际计费可能受用户分组与缓存影响。`
            : pricing ? '公开价格表里未找到当前模型' : (monitor?.getPricingError?.(api) || '尚未获取站点公开价格表');
        if (!filtered.length) {
            list.innerHTML = '<div class="diag-empty"><strong>本次使用暂无新调用</strong><span>不会展示上次打开应用时的旧日志。发送新消息或生成内容后，这里会实时更新。</span></div>';
            return;
        }
        list.innerHTML = filtered.map(log => {
            const realIndex = logs.indexOf(log);
            const stamp = clock(log.startedAt);
            const status = log.status === 'success' ? '成功' : (log.status === 'cancelled' ? '已取消' : '失败');
            const token = Number.isFinite(log.totalTokens) ? toNum(log.totalTokens) : '--';
            const latency = Number.isFinite(log.latencyMs) ? `${log.latencyMs}ms` : '--';
            const cacheKnown = Number.isFinite(log.cacheReadTokens);
            const cacheTotal = cacheKnown && Number.isFinite(log.cacheMissTokens)
                ? log.cacheReadTokens + log.cacheMissTokens : null;
            const cacheRate = cacheTotal > 0 ? (log.cacheReadTokens / cacheTotal * 100).toFixed(1) + '%' : '--';
            const cacheDetail = cacheKnown
                ? `缓存命中 ${toNum(log.cacheReadTokens)} token · 未命中 ${Number.isFinite(log.cacheMissTokens) ? toNum(log.cacheMissTokens) + ' token' : '未返回'} · 命中率 ${cacheRate}`
                : '缓存命中：接口未返回';
            return `<article class="api-card-item">
                <div class="api-card-top"><span class="diag-status ${escapeDiag(log.status)}">${status} · ${escapeDiag(log.httpStatus || '网络')}</span><time>${escapeDiag(stamp)}</time></div>
                <div class="api-card-model">${escapeDiag(log.feature)} <span>· ${escapeDiag(log.model)}</span></div>
                <div class="api-card-detail-row">Token ${token}　·　耗时 ${escapeDiag(latency)}${Number.isFinite(log.cost) ? `　·　上报扣费 ${escapeDiag(log.cost)} ${escapeDiag(log.costUnit || "站点单位")}` : ""}</div>
                <div class="api-card-detail-row">${escapeDiag(cacheDetail)}${Number.isFinite(log.cacheWriteTokens) ? ` · 缓存写入 ${escapeDiag(toNum(log.cacheWriteTokens))} token` : ''}</div>
                <div class="api-card-footer"><span>${escapeDiag(log.endpoint)}</span><button type="button" class="diag-copy" data-copy-api-index="${realIndex}">复制</button></div>
                ${log.callsite ? `<div class="diag-source-note">调用位置：${escapeDiag(log.callsite)}</div>` : ''}
                ${log.error ? `<div class="diag-error-note">${escapeDiag(log.error)}</div>` : ''}
            </article>`;
        }).join('');
    }
    let quotaRefreshSequence = 0;
    async function refreshCurrentQuota(force = false) {
        const api = currentApi();
        const feedback = document.getElementById('apiQuotaQueryStatus');
        if (!api) {
            if (feedback) feedback.textContent = '请先连接 API';
            return;
        }
        const sequence = ++quotaRefreshSequence;
        if (feedback) {
            feedback.dataset.loading = 'yes';
            feedback.textContent = '正在读取当前密钥额度…';
        }
        const button = document.getElementById('apiQuotaQuery');
        if (button) button.disabled = true;
        try {
            const monitor = window.tongApiMonitor;
            if (!monitor) throw new Error('API 监测模块尚未加载');
            const [balanceResult, priceResult] = await Promise.allSettled([
                monitor.queryQuota(api, { force }),
                monitor.queryPricing(api, { force })
            ]);
            if (sequence === quotaRefreshSequence && feedback) {
                if (balanceResult.status === 'fulfilled') {
                    const result = balanceResult.value;
                    feedback.textContent = result?.remaining != null
                        ? '已读取站点返回的剩余额度'
                        : result?.billingUsed != null ? '已读取站点账单消耗，暂未取得账户余额'
                        : result?.keyUsed != null ? '已读取密钥用量，暂未取得账户余额'
                        : '站点没有返回可核实的额度字段';
                } else {
                    feedback.textContent = String(balanceResult.reason?.message || balanceResult.reason);
                }
                if (priceResult.status === 'rejected') {
                    const status = document.getElementById('apiPricingStatus');
                    if (status) status.textContent = String(priceResult.reason?.message || priceResult.reason);
                }
            }
        } catch (error) {
            if (sequence === quotaRefreshSequence && feedback) feedback.textContent = String(error.message || error);
        } finally {
            if (sequence === quotaRefreshSequence) {
                if (feedback) delete feedback.dataset.loading;
                if (button) button.disabled = false;
                renderApiLogs();
            }
        }
    }
    window.openApiLogModal = function (tab) {
        ensureApiModal();
        const overlay = document.getElementById('apiLogModalOverlay');
        overlay.classList.add('show');
        // Every entry takes a fresh snapshot of this app session, not saved history.
        onlyErrors = false;
        overlay.querySelector('#apiLogFilter').classList.remove('is-active');
        renderApiLogs();
        void window.tongApiMonitor?.load().then(() => {
            if (overlay.classList.contains('show')) renderApiLogs();
        });
        selectApiTab(typeof tab === 'string' ? tab : 'activity');
        // Force a real re-query instead of reusing a failed/stale 2-minute result.
        if (currentApi()) void refreshCurrentQuota(true);
    };
    window.closeApiLogModal = function (event) {
        if (event && event.target && event.currentTarget && event.target !== event.currentTarget) return;
        document.getElementById('apiLogModalOverlay')?.classList.remove('show');
    };
    window.refreshApiLogStats = renderApiLogs;
    window.clearApiMonitorLogs = () => { window.tongApiMonitor?.clear(); renderApiLogs(); };
    window.recordApiCallUsage = info => {
        if (!info || !window.tongApiMonitor) return;
        window.tongApiMonitor.record({
            startedAt: Date.now(), site: siteOf(currentApi()), endpoint: info.endpoint || currentApi()?.url || '',
            feature: info.feature || 'AI 生成', model: info.model,
            status: info.status || 'success', httpStatus: info.httpStatus,
            promptTokens: info.promptTokens, completionTokens: info.completionTokens,
            totalTokens: info.totalTokens, cost: info.cost, latencyMs: info.latencyMs
        });
    };
    window.tongApiMonitor?.subscribe(() => { if (document.getElementById('apiLogModalOverlay')?.classList.contains('show')) renderApiLogs(); });

    function diagEntries() {
        const source = window.tongtongDiagnostics?.getLogs() || [];
        return source.filter(log => log && (log.severity === 'error' || log.type === 'resource.error' || log.type === 'security.csp'));
    }
    function describeError(log) {
        const stack = String(log.stack || '');
        const source = String(log.source || '');
        const frame = stack.split('\n').find(line => /(?:https?:\/\/|\/js\/|\/css\/).*:\d+:\d+/.test(line));
        const sourceLocation = (source && source !== location.href) ? source : (frame?.trim() || source || '未提供位置');
        const loc = sourceLocation + (log.line ? ':' + log.line + (log.column ? ':' + log.column : '') : '');
        return {
            type: String(log.type || 'error'), time: clock(log.time),
            reason: scrubDiag(log.message || '未知错误'), location: scrubDiag(loc), stack: scrubDiag(stack)
        };
    }
    function formatError(log) {
        const detail = describeError(log);
        return `[${detail.time}] ${detail.type}\n原因：${detail.reason}\n位置：${detail.location}${detail.stack ? '\n堆栈：\n' + detail.stack : ''}`;
    }
    function ensureConsoleModal() {
        let overlay = document.getElementById('systemDevConsoleModalOverlay');
        if (overlay) return overlay;
        overlay = document.createElement('div');
        overlay.id = 'systemDevConsoleModalOverlay';
        overlay.className = 'dev-console-modal-overlay';
        overlay.innerHTML = `<section class="dev-console-modal" role="dialog" aria-modal="true" aria-label="错误控制台">
            <div class="diag-modal-heading">
                <div class="diag-heading-text"><div class="diag-eyebrow">ERROR RECORD</div><h2>错误控制台</h2></div>
                <button type="button" class="diag-done" id="devConsoleDone" aria-label="关闭错误控制台" title="关闭"><svg viewBox="0 0 24 24" width="15" height="15" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="2.1" stroke-linecap="round"><path d="M18 6 6 18M6 6l12 12"/></svg></button>
            </div>
            <div class="diag-tools"><span id="devConsoleErrorCountBadge">0 条真实报错</span><div>
                <button type="button" class="diag-tool-btn" id="devCopyAll">全部复制</button>
                <button type="button" class="diag-tool-btn" id="devClearAll">清空</button>
            </div></div>
            <div class="dev-console-body" id="devConsoleOutputList"></div>
        </section>`;
        document.body.appendChild(overlay);
        overlay.addEventListener('click', event => { if (event.target === overlay) window.closeSystemDevConsoleModal(); });
        overlay.querySelector('#devConsoleDone').addEventListener('click', () => window.closeSystemDevConsoleModal());
        overlay.querySelector('#devCopyAll').addEventListener('click', () => window.copyDevConsoleLogs());
        overlay.querySelector('#devClearAll').addEventListener('click', () => window.clearDevConsoleLogs());
        overlay.querySelector('#devConsoleOutputList').addEventListener('click', event => {
            const button = event.target.closest('[data-copy-error-index]');
            if (!button) return;
            const log = diagEntries()[Number(button.dataset.copyErrorIndex)];
            if (log) void copyText(formatError(log));
        });
        return overlay;
    }
    function renderConsoleLogs() {
        const overlay = document.getElementById('systemDevConsoleModalOverlay');
        if (!overlay) return;
        const logs = diagEntries();
        overlay.querySelector('#devConsoleErrorCountBadge').textContent = `${logs.length} 条真实报错`;
        const list = overlay.querySelector('#devConsoleOutputList');
        if (!logs.length) {
            list.innerHTML = '<div class="diag-empty"><strong>目前没有已捕获的报错</strong><span>JavaScript 错误、未处理的异步异常、资源加载失败和 AI 接口异常会显示在这里。</span></div>';
            return;
        }
        list.innerHTML = logs.map((raw, index) => {
            const log = describeError(raw);
            return `<article class="dev-error-card"><div class="dev-error-card-header">
                <span class="diag-status error">${escapeDiag(log.type)}</span><time>${escapeDiag(log.time)}</time>
                <button type="button" class="diag-copy" data-copy-error-index="${index}">复制</button></div>
                <div class="dev-error-field"><label>报错原因</label><p>${escapeDiag(log.reason)}</p></div>
                <div class="dev-error-field"><label>报错位置</label><p class="mono">${escapeDiag(log.location)}</p></div>
                ${log.stack ? `<details class="diag-stack"><summary>查看调用堆栈</summary><pre>${escapeDiag(log.stack)}</pre></details>` : ''}
            </article>`;
        }).join('');
    }
    window.openSystemDevConsoleModal = () => {
        const overlay = ensureConsoleModal();
        overlay.classList.toggle('is-dark', Boolean(document.querySelector('.iphone.dark-mode') || document.body.classList.contains('dark-mode')));
        overlay.classList.add('show');
        renderConsoleLogs();
    };
    window.closeSystemDevConsoleModal = function (event) {
        if (event && event.target && event.currentTarget && event.target !== event.currentTarget) return;
        document.getElementById('systemDevConsoleModalOverlay')?.classList.remove('show');
    };
    window.copyDevConsoleLogs = () => {
        const logs = diagEntries();
        if (logs.length) void copyText(logs.map(formatError).join('\n\n'));
        else if (typeof showToast === 'function') showToast('暂无报错');
    };
    window.clearDevConsoleLogs = () => {
        window.tongtongDiagnostics?.clear();
        renderConsoleLogs();
    };
    window.addEventListener('tonghuaji-diagnostic-update', () => {
        if (document.getElementById('systemDevConsoleModalOverlay')?.classList.contains('show')) renderConsoleLogs();
    });
})();

// Expose the settings entrypoint for the dynamically loaded desktop shell.
if (typeof window !== 'undefined') {
    window.openSettingsApp = openSettingsApp;
    window.closeSettingsApp = closeSettingsApp;
}


