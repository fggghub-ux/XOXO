{
    const themeAppHTML = `<div class="theme-app-container" id="themeAppUI">
        <!-- 顶部导航栏 -->
        <div class="ios-top-bar">
            <div class="ios-back-btn" onclick="closeThemeApp()">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#000" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="15 18 9 12 15 6"></polyline></svg>
            </div>
            <div class="ios-top-title" id="topBarTitle">Themes</div>
            <div class="ios-top-right-group">
                <div class="ios-save-btn" id="topRightBtn" onclick="handleTopRightBtn()">Save</div>
                <div class="widget-done-btn" id="widgetDoneBtn" onclick="exitWidgetEditMode()">完成</div>
                <div class="ios-menu-btn widget-view-btn" id="widgetViewBtn" onclick="toggleWidgetViewMode()" style="display: none;" title="toggle list / carousel view">
                    <svg id="widgetIconList" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#000" stroke-width="2.5" stroke-linecap="round"><line x1="8" y1="6" x2="21" y2="6"></line><line x1="8" y1="12" x2="21" y2="12"></line><line x1="8" y1="18" x2="21" y2="18"></line><line x1="3" y1="6" x2="3.01" y2="6"></line><line x1="3" y1="12" x2="3.01" y2="12"></line><line x1="3" y1="18" x2="3.01" y2="18"></line></svg>
                    <svg id="widgetIconCard" style="display:none;" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#000" stroke-width="2.5" stroke-linecap="round"><rect x="3" y="4" width="18" height="16" rx="3" ry="3"></rect><line x1="3" y1="10" x2="21" y2="10"></line></svg>
                </div>
                <div class="ios-menu-btn" id="themeMenuBtn" onclick="toggleThemeMenu()" style="display: none; background: rgba(255,255,255,0.8); backdrop-filter: blur(12px); -webkit-backdrop-filter: blur(12px);">
                    <svg id="menuIconList" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#000" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><line x1="8" y1="6" x2="21" y2="6"></line><line x1="8" y1="12" x2="21" y2="12"></line><line x1="8" y1="18" x2="21" y2="18"></line><line x1="3" y1="6" x2="3.01" y2="6"></line><line x1="3" y1="12" x2="3.01" y2="12"></line><line x1="3" y1="18" x2="3.01" y2="18"></line></svg>
                    <svg id="menuIconDots" style="display: none;" width="20" height="20" viewBox="0 0 24 24" fill="#000" stroke="none"><circle cx="5" cy="12" r="2.5"></circle><circle cx="12" cy="12" r="2.5"></circle><circle cx="19" cy="12" r="2.5"></circle></svg>
                    <svg id="menuIconChevron" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#000" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" style="display: none;"><polyline points="6 9 12 15 18 9"></polyline></svg>
                </div>
            </div>
        </div>

        <!-- Widget vertical capsule menu (click 3-dots to expand) -->
        <div class="theme-dropdown-menu" id="widgetToolbarMenu" style="display:none; z-index: 260;">
            <div class="dropdown-btn" onclick="enterWidgetEditMode(); closeWidgetMenus();">
                <div class="dropdown-icon-circle">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#000" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>
                </div>
                <span>编辑</span>
            </div>
            <button type="button" class="dropdown-btn widget-add-action" onclick="handleAddWidget()">
                <div class="dropdown-icon-circle">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#000" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
                </div>
                <span>添加</span>
            </button>
            <div class="dropdown-btn" onclick="document.getElementById('widgetJsonInput').click(); closeWidgetMenus();">
                <div class="dropdown-icon-circle">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#000" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="17 8 12 3 7 8"></polyline><line x1="12" y1="3" x2="12" y2="15"></line></svg>
                </div>
                <span>导入</span>
            </div>

            <input type="file" accept="application/json,.json" id="widgetJsonInput" onchange="handleWidgetJsonImport(event)" style="display: none;">
        </div>
        <!-- 下拉菜单 -->
        <div class="theme-dropdown-menu" id="themeDropdownMenu">
            <div class="dropdown-btn" onclick="togglePresetEditMode(); toggleThemeMenu();">
                <div class="dropdown-icon-circle">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#000" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>
                </div>
                <span>编辑</span>
            </div>
            <div class="dropdown-btn" onclick="openExportCurrentThemeModal(); toggleThemeMenu();">
                <div class="dropdown-icon-circle">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#000" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg>
                </div>
                <span>导出</span>
            </div>
            <div class="dropdown-btn" onclick="document.getElementById('importPresetInput').click(); toggleThemeMenu();">
                <div class="dropdown-icon-circle">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#000" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="17 8 12 3 7 8"></polyline><line x1="12" y1="3" x2="12" y2="15"></line></svg>
                </div>
                <span>导入</span>
            </div>
        </div>

        <!-- 底部 iOS 风格导航栏 -->
        <div class="bottom-nav-wrapper" id="themeTopTabs">
            <div class="nav-capsule-main">
                <div class="theme-tab-item active" onclick="switchThemeTab('theme', this)">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" id="Reason-Studios-Logo--Streamline-Logos-Block" height="24" width="24">
                      <path fill="currentColor" fill-rule="evenodd" d="M5 1a4 4 0 0 0 -4 4v14a4 4 0 0 0 4 4h14a4 4 0 0 0 4 -4V5a4 4 0 0 0 -4 -4H5Zm0.039 6.91 6.574 -3.806a0.773 0.773 0 0 1 0.774 0l6.574 3.806a0.773 0.773 0 0 1 0.386 0.67v6.84a0.773 0.773 0 0 1 -0.386 0.67l-6.573 3.806a0.773 0.773 0 0 1 -0.775 0L5.039 16.09a0.773 0.773 0 0 1 -0.386 -0.67V8.58c0 -0.277 0.147 -0.532 0.386 -0.67Zm2.234 1.545L12 6.909l4.727 2.546L12 11.636v5.819l-4.727 -2.91v-5.09Z" clip-rule="evenodd" stroke-width="1"></path>
                    </svg>
                    <span class="theme-tab-text">Icons</span>
                </div>
                <div class="theme-tab-item" onclick="switchThemeTab('wallpaper', this)">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" id="Wallpaper--Streamline-Solar" height="24" width="24">
                      <g id="Bold Duotone/Video Audio Sound/Wallpaper">
                        <path id="Vector" fill="currentColor" d="M15.721 7.34875c0 1.0275 -0.833 1.86046 -1.8605 1.86046s-1.8604 -0.83296 -1.8604 -1.86046c0 -1.02751 0.8329 -1.86047 1.8604 -1.86047s1.8605 0.83296 1.8605 1.86047Z" stroke-width="1"></path>
                        <path id="Vector_2" fill="currentColor" fill-rule="evenodd" d="M16.0854 2.10839c-0.8065 -0.10842 -1.8319 -0.10841 -3.1041 -0.10839h-1.9625c-1.27219 -0.00002 -2.2976 -0.00003 -3.10408 0.10839 -0.83731 0.11258 -1.54231 0.35341 -2.10223 0.91333s-0.80075 1.26492 -0.91332 2.10223c-0.10843 0.80648 -0.10842 1.8319 -0.1084 3.10407V15.772c-0.00002 1.2722 -0.00003 2.2976 0.1084 3.104 0.11257 0.8374 0.3534 1.5424 0.91332 2.1023 0.55992 0.5599 1.26492 0.8007 2.10223 0.9133C8.7212 22 9.74661 22 11.0188 22h1.9625c1.2722 0 2.2976 0 3.1041 -0.1084 0.8373 -0.1126 1.5423 -0.3534 2.1022 -0.9133 0.5599 -0.5599 0.8008 -1.2649 0.9134 -2.1023 0.1084 -0.8064 0.1084 -1.8319 0.1083 -3.104V8.22803c0.0001 -1.27218 0.0001 -2.29759 -0.1083 -3.10408 -0.1126 -0.83731 -0.3535 -1.54231 -0.9134 -2.10223 -0.5599 -0.55992 -1.2649 -0.80075 -2.1022 -0.91333Zm0.7232 14.52181 0.9861 1.0406c0.0188 -0.5368 0.0193 -1.1754 0.0193 -1.9499V8.27907c0 -1.33527 -0.0015 -2.26654 -0.0959 -2.96919 -0.0918 -0.68258 -0.2597 -1.04404 -0.5171 -1.3015 -0.2575 -0.25745 -0.6189 -0.42531 -1.3015 -0.51708 -0.7027 -0.09447 -1.6339 -0.09595 -2.9692 -0.09595h-1.8605c-1.33524 0 -2.2665 0.00148 -2.96915 0.09595 -0.68259 0.09177 -1.04405 0.25963 -1.3015 0.51708 -0.25745 0.25746 -0.42531 0.61892 -0.51708 1.3015 -0.09447 0.70265 -0.09595 1.63392 -0.09595 2.96919V12.904l0.0033 -0.0033c0.91682 -0.9407 2.33521 -0.8762 3.18334 0.1183l2.94034 3.4478c0.2355 0.2761 0.5453 0.2887 0.783 0.0928l0.2044 -0.1684c1.0759 -0.8867 2.5513 -0.7708 3.5081 0.239Z" clip-rule="evenodd" stroke-width="1"></path>
                        <g id="Group">
                          <path id="Vector_3" fill="currentColor" d="M5.01606 4.5H5c-0.4645 0 -0.69675 0 -0.89109 0.03078 -1.06973 0.16943 -1.9087 1.0084 -2.07813 2.07813C2 6.80325 2 7.0355 2 7.5v9c0 0.4645 0 0.6968 0.03078 0.8911 0.16943 1.0697 1.0084 1.9087 2.07813 2.0781C4.30325 19.5 4.5355 19.5 5 19.5h0.01606c-0.04971 -0.199 -0.08748 -0.407 -0.11665 -0.624 -0.10843 -0.8064 -0.10841 -1.8318 -0.10839 -3.104V8.22802c-0.00002 -1.27217 -0.00004 -2.29759 0.10839 -3.10407 0.02917 -0.21694 0.06694 -0.425 0.11665 -0.62395Z" stroke-width="1"></path>
                          <path id="Vector_4" fill="currentColor" d="M18.9845 19.5c0.0498 -0.199 0.0875 -0.407 0.1167 -0.624 0.1084 -0.8064 0.1084 -1.8318 0.1084 -3.104V8.22803c0 -1.27215 0 -2.29761 -0.1084 -3.10408 -0.0292 -0.21694 -0.0669 -0.425 -0.1167 -0.62395H19c0.4645 0 0.6968 0 0.8911 0.03078 1.0697 0.16943 1.9087 1.0084 2.0781 2.07813C22 6.80325 22 7.0355 22 7.5v9c0 0.4645 0 0.6968 -0.0308 0.8911 -0.1694 1.0697 -1.0084 1.9087 -2.0781 2.0781 -0.1943 0.0308 -0.4266 0.0308 -0.8911 0.0308h-0.0155Z" stroke-width="1"></path>
                        </g>
                      </g>
                    </svg>
                    <span class="theme-tab-text">Wallpapers</span>
                </div>
                <div class="theme-tab-item" onclick="switchThemeTab('font', this)">
                   <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" height="24" width="24">
                      <g id="text-style">
                        <path id="Union" fill="currentColor" d="M18 4c0.8284 0 1.5 0.67157 1.5 1.5V7c0 0.82843 -0.6716 1.5 -1.5 1.5s-1.5 -0.67157 -1.5 -1.5h-3v10h0.5c0.8284 0 1.5 0.6716 1.5 1.5S14.8284 20 14 20h-4c-0.82843 0 -1.5 -0.6716 -1.5 -1.5S9.17157 17 10 17h0.5V7h-3c0 0.82843 -0.67157 1.5 -1.5 1.5S4.5 7.82843 4.5 7V5.5C4.5 4.67157 5.17157 4 6 4z" stroke-width="1"></path>
                      </g>
                    </svg>
                    <span class="theme-tab-text">Fonts</span>
                </div>
                <div class="theme-tab-item" onclick="switchThemeTab('widget', this)">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" id="Widget-14--Streamline-Solar" height="24" width="24">
                      <g id="Bold Duotone/Settings Fine Tuning/Widget 14">
                        <path id="Vector" fill="currentColor" d="M2 17.5C2 15.0147 4.01472 13 6.5 13h2.7c0.63006 0 0.9451 0 1.1857 0.1226 0.2117 0.1079 0.3838 0.28 0.4917 0.4917C11 13.8549 11 14.1699 11 14.8v2.7c0 2.4853 -2.01472 4.5 -4.5 4.5S2 19.9853 2 17.5Z" stroke-width="1"></path>
                        <path id="Vector_2" fill="currentColor" d="M13 6.5C13 4.01472 15.0147 2 17.5 2S22 4.01472 22 6.5 19.9853 11 17.5 11h-3.2143c-0.1492 0 -0.2239 0 -0.2867 -0.0071 -0.5215 -0.0587 -0.9332 -0.4704 -0.9919 -0.9919C13 9.93818 13 9.86355 13 9.71429V6.5Z" stroke-width="1"></path>
                        <g id="Group">
                          <path id="Vector_3" fill="currentColor" d="M2 6.5C2 4.01472 4.01472 2 6.5 2S11 4.01472 11 6.5v3c0 0.34874 0 0.5231 -0.0383 0.6662 -0.1041 0.3882 -0.4073 0.6914 -0.7955 0.7955C10.0231 11 9.84874 11 9.5 11h-3C4.01472 11 2 8.98528 2 6.5Z" stroke-width="1"></path>
                          <path id="Vector_4" fill="currentColor" d="M13 14.5c0 -0.3487 0 -0.5231 0.0383 -0.6662 0.1041 -0.3882 0.4073 -0.6914 0.7955 -0.7955C13.9769 13 14.1513 13 14.5 13h3c2.4853 0 4.5 2.0147 4.5 4.5S19.9853 22 17.5 22 13 19.9853 13 17.5v-3Z" stroke-width="1"></path>
                        </g>
                      </g>
                    </svg>
                    <span class="theme-tab-text">Widgets</span>
                </div>
            </div>
            <div class="nav-capsule-standalone">
                <div class="theme-tab-item" onclick="switchThemeTab('preset', this)">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" id="Shipment-Star--Streamline-Ultimate" height="24" width="24">
                      <g id="Shipment-Star--Streamline-Ultimate.svg">
                        <path d="M8.49 14a3.24 3.24 0 0 1 3 -2h1.21a0.25 0.25 0 0 0 0.23 -0.15l0.82 -1.91 0.05 -0.11a3.35 3.35 0 0 1 1.79 -1.61 0.25 0.25 0 0 0 0.16 -0.22V6.5a0.25 0.25 0 0 0 -0.25 -0.25H1a0.25 0.25 0 0 0 -0.25 0.25v9a1.5 1.5 0 0 0 1.5 1.5h6.13a0.24 0.24 0 0 0 0.21 -0.12 0.23 0.23 0 0 0 0 -0.24 3.2 3.2 0 0 1 -0.1 -2.64Z" fill="currentColor" stroke-width="1"></path>
                        <path d="M9 4.5a0.25 0.25 0 0 0 0.25 0.25h5.35a0.24 0.24 0 0 0 0.23 -0.16 0.25 0.25 0 0 0 -0.05 -0.27L11.9 1.44A1.52 1.52 0 0 0 10.84 1H9.25a0.25 0.25 0 0 0 -0.25 0.25Z" fill="currentColor" stroke-width="1"></path>
                        <path d="M7.25 4.75a0.25 0.25 0 0 0 0.25 -0.25V1.25A0.25 0.25 0 0 0 7.25 1H5.66a1.52 1.52 0 0 0 -1.06 0.44L1.72 4.32a0.25 0.25 0 0 0 -0.05 0.27 0.23 0.23 0 0 0 0.23 0.16Z" fill="currentColor" stroke-width="1"></path>
                        <path d="M20 22.83a1.27 1.27 0 0 0 1.5 -0.17 1.24 1.24 0 0 0 0.32 -1.45l-1.24 -2.81a0.26 0.26 0 0 1 0.07 -0.29l2.2 -2a1.26 1.26 0 0 0 0.29 -1.37A1.23 1.23 0 0 0 22 14h-2.5a0.25 0.25 0 0 1 -0.23 -0.15l-1.34 -3.12a1.29 1.29 0 0 0 -2.31 0l-1.34 3.11A0.25 0.25 0 0 1 14 14h-2.5a1.24 1.24 0 0 0 -1.17 0.76 1.28 1.28 0 0 0 0.32 1.39l2.19 1.95a0.26 0.26 0 0 1 0.06 0.29l-1.2 2.82a1.26 1.26 0 0 0 0.3 1.45 1.28 1.28 0 0 0 0.87 0.34 1.39 1.39 0 0 0 0.64 -0.17l3.11 -1.75a0.21 0.21 0 0 1 0.24 0Z" fill="currentColor" stroke-width="1"></path>
                      </g>
                    </svg>
                    <span class="theme-tab-text">Themes</span>
                </div>
            </div>
        </div>

        <div class="theme-content-area">

            <section class="desktop-icon-appearance-card" id="desktopIconAppearancePanel" aria-label="桌面图标外观">
                <div class="desktop-appearance-heading">
                    <div>
                        <div class="desktop-appearance-title">桌面图标外观</div>
                        <div class="desktop-appearance-hint">仅调整桌面与 Dock，不影响应用内部配色</div>
                    </div>
                    <div class="desktop-appearance-preview">
                        <div class="theme-app-icon" id="desktopAppearancePreviewIcon"></div>
                        <span id="desktopAppearancePreviewName">主题</span>
                    </div>
                </div>
                <div class="desktop-appearance-control">
                    <div class="desktop-appearance-label"><label for="desktopAppearanceRadius">图标圆角</label><output id="desktopAppearanceRadiusValue" for="desktopAppearanceRadius">16px</output></div>
                    <input id="desktopAppearanceRadius" class="desktop-appearance-slider" type="range" min="0" max="30" step="1" value="16" oninput="updateDesktopIconAppearance('radius', this.value)" onchange="updateDesktopIconAppearance('radius', this.value, true)">
                </div>
                <div class="desktop-appearance-color-row">
                    <label for="desktopAppearanceNameColor">APP 名称颜色</label>
                    <div class="desktop-appearance-color-actions">
                        <input id="desktopAppearanceNameColor" type="color" value="#555555" aria-label="APP 名称颜色" oninput="updateDesktopIconAppearance('labelColor', this.value)" onchange="updateDesktopIconAppearance('labelColor', this.value, true)">
                        <button type="button" onclick="resetDesktopIconAppearanceColor('labelColor')">默认</button>
                    </div>
                </div>
                <div class="desktop-appearance-control desktop-appearance-mode">
                    <div class="desktop-appearance-label">默认图标质感</div>
                    <div class="desktop-appearance-segments" role="group" aria-label="默认图标质感">
                        <button type="button" data-icon-style="light" aria-pressed="true" onclick="setDesktopIconAppearanceStyle('light')">浅色</button>
                        <button type="button" data-icon-style="dark" aria-pressed="false" onclick="setDesktopIconAppearanceStyle('dark')">深色</button>
                    </div>
                </div>
            </section>

            <!-- 主题网格 -->
            <div class="theme-grid-container" id="themeAppGrid"></div>

            <!-- 预设库区域 -->
            <div class="preset-container" id="presetAppGrid" style="display: none;">
                <div class="preset-scroll-area">
                    <div class="preset-empty-hint" id="presetEmptyHint">当前暂无可用主题</div>
                    <div class="preset-grid" id="presetGridContent"></div>
                </div>
                <div class="preset-bottom-fixed">
                    <input type="file" id="importPresetInput" accept=".json" style="display: none;" onchange="importPreset(event)">
                    <div class="save-preset-btn" id="presetActionBtn" onclick="handlePresetAction()">+ 保存主题为预设</div>
                </div>
            </div>

            <!-- 壁纸区域 -->
            <div class="wallpaper-carousel-container" id="wallpaperAppGrid">
                <div class="carousel-scroll" id="carouselScroll" onscroll="updatePagination()">
                    <!-- 卡片将通过 JS 动态渲染 -->
                </div>
                <div class="pagination" id="pagination"></div>
                <div class="info-card">
                    <div class="info-text">
                        <div class="info-title">从锁定屏幕更改墙纸</div>
                        <div class="info-desc">按住锁定屏幕添加、编辑墙纸和小组件，或在不同墙纸和小组件之间切换。</div>
                    </div>
                    <div class="info-img" id="infoClock">00:00</div>
                </div>
                <input type="file" id="wallpaperFileInput" accept="image/*" style="display:none;" onchange="handleWallpaperUpload(event)">
            </div>

            <!-- 字体区域 -->
            <div class="font-app-container" id="fontAppGrid">
                <div class="font-section-title">PREVIEW</div>
                <div class="font-ios-card">
                    <div class="font-preview-box" id="globalFontPreview">
                        <div class="font-preview-text" id="fontPreviewText">
                            The quick brown fox jumps over the lazy dog.<br>
                            探索宇宙的奥秘，感受科技的魅力。
                        </div>
                    </div>
                </div>

                <div class="font-section-title">FONT SIZE</div>
                <div class="font-ios-card">
                    <div class="font-slider-container">
                        <div class="font-slider-icon-small">A</div>
                        <input type="range" class="font-ios-slider" id="fontSizeSlider" min="12" max="36" value="18" oninput="updateFontSize()">
                        <div class="font-slider-icon-large">A</div>
                    </div>
                </div>

                <div class="font-section-title">IMPORT FONTS</div>
                <div class="font-ios-card">
                    <div class="font-list-item" onclick="document.getElementById('fontFileInput').click()">
                        <div class="font-item-icon font-icon-blue">
                            <svg viewBox="0 0 24 24"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="17 8 12 3 7 8"></polyline><line x1="12" y1="3" x2="12" y2="15"></line></svg>
                        </div>
                        <div class="font-item-content">
                            <div class="font-item-title">从本地文件导入</div>
                            <div class="font-item-subtitle">支持 .ttf, .otf 格式</div>
                        </div>
                        <input type="file" id="fontFileInput" accept=".ttf,.otf,.woff,.woff2" style="display: none;" onchange="handleLocalFont(event)">
                    </div>
                    <div class="font-list-item" onclick="openUrlFontModal()">
                        <div class="font-item-icon font-icon-green">
                            <svg viewBox="0 0 24 24"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"></path><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"></path></svg>
                        </div>
                        <div class="font-item-content">
                            <div class="font-item-title">通过 URL 安装</div>
                            <div class="font-item-subtitle">输入直链下载并应用字体</div>
                        </div>
                    </div>
                </div>

                <div class="font-section-title">MY FONTS</div>
                <div class="font-ios-card" id="fontListContainer">
                    <div class="font-list-item font-item-padding active" data-font="default" onclick="selectFont('default', this)">
                        <div class="font-item-inner">
                            <div class="font-item-content">
                                <div class="font-name-text">系统默认 (苹方)</div>
                                <div class="font-preview-subtext">The quick brown fox / 探索宇宙</div>
                            </div>
                            <div class="font-checkmark">
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <!-- 小组件区域 (Widget) -->
            <div class="widget-app-container" id="widgetAppGrid" style="display: none;">
                <div class="widget-segment-control">
                    <div class="widget-segment-indicator" id="widgetSegmentIndicator"></div>
                    <button class="widget-segment-btn active" onclick="switchWidgetTab(0)">推荐</button>
                    <button class="widget-segment-btn" onclick="switchWidgetTab(1)">自定义组件</button>
                </div>
                <div class="widget-empty-state" id="widgetEmptyState">
                    <svg viewBox="0 0 24 24" fill="none" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="18" height="18" rx="4" ry="4"></rect><line x1="9" y1="9" x2="15" y2="15"></line><line x1="15" y1="9" x2="9" y2="15"></line></svg>
                    <p>此目录暂无组件<br>请点击右上角菜单添加</p>
                </div>
                <div class="widget-content-area" id="widgetContentArea">
                    <div class="widget-carousel-container" id="widgetCarousel">
                        <div class="widget-carousel-track" id="widgetTrack"></div>
                        <div class="widget-pagination" id="widgetPagination"></div>
                    </div>
                    <div class="widget-list-container" id="widgetList"></div>
                </div>
            </div>
        </div>

        <!-- 预设详情页 -->
        <div id="presetDetailPage">
            <div class="detail-header">
                <div class="detail-back-btn" onclick="closePresetDetail()">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#000" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="15 18 9 12 15 6"></polyline></svg>
                </div>
                <div class="detail-title">主题详情</div>
                <div class="detail-export-btn" onclick="toggleDetailMenu()">
                    <svg id="detailMenuIconList" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#000" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><line x1="8" y1="6" x2="21" y2="6"></line><line x1="8" y1="12" x2="21" y2="12"></line><line x1="8" y1="18" x2="21" y2="18"></line><line x1="3" y1="6" x2="3.01" y2="6"></line><line x1="3" y1="12" x2="3.01" y2="12"></line><line x1="3" y1="18" x2="3.01" y2="18"></line></svg>
                    <svg id="detailMenuIconChevron" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#000" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" style="display: none;"><polyline points="6 9 12 15 18 9"></polyline></svg>
                </div>
            </div>

            <!-- 详情页下拉菜单 -->
            <div class="detail-dropdown-menu" id="detailDropdownMenu">
                <div class="dropdown-btn" onclick="editPresetName(); toggleDetailMenu();">
                    <div class="dropdown-icon-circle">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#000" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>
                    </div>
                    <span>编辑</span>
                </div>
                <div class="dropdown-btn" onclick="compressPreset(); toggleDetailMenu();">
                    <div class="dropdown-icon-circle">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#000" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="4 14 10 14 10 20"></polyline><polyline points="20 10 14 10 14 4"></polyline><line x1="14" y1="10" x2="21" y2="3"></line><line x1="3" y1="21" x2="10" y2="14"></line></svg>
                    </div>
                    <span>压缩</span>
                </div>
                <div class="dropdown-btn" onclick="openExportModal(); toggleDetailMenu();">
                    <div class="dropdown-icon-circle">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#000" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg>
                    </div>
                    <span>导出</span>
                </div>
            </div>

            <div class="detail-content">
                <div class="preview-carousel">
                    <div class="preview-phone-mockup">
                        <!-- 1:1 桌面还原容器 -->
                        <div class="preview-scale-container" id="previewScaleContainer"></div>
                    </div>
                </div>
                <div class="preset-info-box">
                    <div class="info-name-wrapper">
                        <div class="info-name" id="detailName">主题名称</div>
                    </div>
                    <div class="info-meta">
                        <div class="info-date" id="detailDate">创建于：--</div>
                        <div class="info-size-box">
                            <div class="info-size" id="detailSize">0.00 MB</div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="detail-bottom-bar">
                <button class="apply-btn" onclick="applyCurrentDetailTheme()">应用该预设主题</button>
            </div>
        </div>
        <!-- Widget 全局弹窗 -->
        <div class="widget-overlay" id="widgetOverlay" onclick="closeWidgetMenus()"></div>
        <div class="widget-context-menu" id="widgetContextMenu">
            <div class="widget-ctx-item" onclick="widgetCtxAction('edit')"><svg viewBox="0 0 24 24" fill="none" stroke="#1d1d1f" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"></path><circle cx="12" cy="13" r="4"></circle></svg><span class="widget-ctx-text">编辑</span></div>
            <div class="widget-ctx-item" onclick="widgetCtxAction('export')"><svg viewBox="0 0 24 24" fill="none" stroke="#1d1d1f" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"></path></svg><span class="widget-ctx-text">导出</span></div>
            <div class="widget-ctx-item" onclick="widgetCtxAction('delete')" style="color: #ff3b30;"><svg viewBox="0 0 24 24" fill="none" stroke="#ff3b30" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg><span class="widget-ctx-text">删除</span></div>
        </div>
        <div class="widget-editor-modal" id="widgetEditorModal">
            <div class="ios-top-bar" style="height:60px; padding: 16px 20px; border-bottom: 1px solid rgba(0,0,0,0.05); background:#f2f2f7; border-radius: 24px 24px 0 0;">
                <button type="button" class="widget-editor-action" onclick="closeWidgetEditor()">取消</button>
                <div style="font-size: 16px; font-weight: 600; color: #000;">编辑组件</div>
                <button type="button" class="widget-editor-action widget-editor-save" onclick="saveWidgetEditor()">保存</button>
            </div>
            <div style="padding: 80px 20px 20px; display: flex; flex-direction: column; gap: 16px; flex: 1; overflow-y: auto; overflow-x: hidden;">
                <div>
                    <div style="font-size: 12px; color: #8e8e93; margin-left: 8px; font-weight: 600; margin-bottom: 6px;">组件名称</div>
                    <input type="text" id="widgetEditName" placeholder="输入组件名称" style="width: 100%; background: #fff; border: none; border-radius: 12px; padding: 14px; font-size: 15px; outline: none;; box-sizing: border-box;">
                </div>
                <div>
                    <div style="font-size: 12px; color: #8e8e93; margin-left: 8px; font-weight: 600; margin-bottom: 6px;">尺寸设置（二选一）</div>
                    <div style="display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 8px; margin-bottom: 12px; text-align: center;">
                        <label class="widget-size-preset">
                            <input type="radio" name="widgetPresetSize" value="2x2" onchange="handleWidgetPresetChange(this)">
                            <span>2×2</span>
                        </label>
                        <label class="widget-size-preset">
                            <input type="radio" name="widgetPresetSize" value="4x2" onchange="handleWidgetPresetChange(this)">
                            <span>4×2</span>
                        </label>
                        <label class="widget-size-preset">
                            <input type="radio" name="widgetPresetSize" value="4x4" onchange="handleWidgetPresetChange(this)">
                            <span>4×4</span>
                        </label>
                        <label class="widget-size-preset">
                            <input type="radio" name="widgetPresetSize" value="1x2" onchange="handleWidgetPresetChange(this)">
                            <span>1×2</span>
                        </label>
                        <label class="widget-size-preset">
                            <input type="radio" name="widgetPresetSize" value="2x1" onchange="handleWidgetPresetChange(this)">
                            <span>2×1</span>
                        </label>
                        <label class="widget-size-preset">
                            <input type="radio" name="widgetPresetSize" value="4x1" onchange="handleWidgetPresetChange(this)">
                            <span>4×1</span>
                        </label>
                    </div>
                    <div id="widgetCustomSizeBtn" onclick="openCustomSizePicker()" style="width: 100%; background: #fff; border: none; border-radius: 12px; padding: 14px; font-size: 15px; color: #8e8e93; outline: none; display: flex; align-items: center; justify-content: space-between; cursor: pointer;">
                        <span id="widgetCustomSizeLabel">自定义大小</span>
                        <span style="font-size: 18px; color: #c7c7cc;">›</span>
                    </div>
                </div>
                <div style="flex:1; display:flex; flex-direction:column;">
                    <div class="widget-code-preview" id="widgetCodePreview">
                        <div style="display:flex; align-items:center; justify-content:space-between; margin:0 8px 6px;">
                            <div style="font-size:12px; color:#8e8e93; font-weight:600;">实时预览</div>
                            <div id="widgetCodePreviewSize" style="font-size:12px; color:#8e8e93;">1 × 1</div>
                        </div>
                        <div class="widget-code-preview-stage" id="widgetCodePreviewStage">
                            <iframe class="widget-code-preview-frame" id="widgetCodePreviewFrame" sandbox="allow-scripts allow-forms" title="组件实时预览"></iframe>
                        </div>
                    </div>
                    <div style="font-size: 12px; color: #8e8e93; margin-left: 8px; margin-top: 16px; font-weight: 600; margin-bottom: 6px;">HTML / CSS / JS 代码</div>
                    <textarea id="widgetEditContent" oninput="scheduleWidgetCodePreview()" placeholder="&lt;style&gt;...&lt;/style&gt;&#10;&lt;div class='widget'&gt;...&lt;/div&gt;" style="width: 100%; flex: 1; min-height: 260px; background: #1e1e1e; border: none; border-radius: 12px; padding: 14px; font-size: 13px; color: #d4d4d4; font-family: monospace; outline: none; resize: none;"></textarea>
                </div>
            </div>
        </div>
    </div>

        <!-- 自定义尺寸选择弹窗 -->
        <div class="widget-custom-size-picker" id="customSizePicker">
            <div class="picker-header">
                <div style="font-size:15px;color:#007aff;cursor:pointer;" onclick="closeCustomSizePicker()">取消</div>
                <div class="picker-title">自定义尺寸</div>
                <div style="font-size:15px;color:#007aff;font-weight:600;cursor:pointer;" onclick="confirmCustomSize()">完成</div>
            </div>
            <div class="picker-body">
                <div class="picker-row">
                    <div class="picker-label">宽（列）</div>
                    <div class="picker-stepper">
                        <button class="stepper-btn" onclick="stepCustomSize('w', -1)">−</button>
                        <span class="stepper-val" id="customW">1</span>
                        <button class="stepper-btn" onclick="stepCustomSize('w', 1)">＋</button>
                    </div>
                </div>
                <div class="picker-row">
                    <div class="picker-label">高（行）</div>
                    <div class="picker-stepper">
                        <button class="stepper-btn" onclick="stepCustomSize('h', -1)">−</button>
                        <span class="stepper-val" id="customH">1</span>
                        <button class="stepper-btn" onclick="stepCustomSize('h', 1)">＋</button>
                    </div>
                </div>
                <div style="font-size:12px;color:#8e8e93;text-align:center;">1 列 = 约 80px，1 行 = 约 80px，最大 4 列 × 7 行</div>
            </div>
        </div>

    <!-- 设置 APP UI 容器 -->


`;
    const themeAppHost = document.getElementById('contactsAppUI');
    if (themeAppHost) {
        themeAppHost.insertAdjacentHTML('beforebegin', themeAppHTML);
    } else {
        document.body.insertAdjacentHTML('beforeend', themeAppHTML);
    }
}
    const themeAppUI = document.getElementById('themeAppUI');
    const themeAppGrid = document.getElementById('themeAppGrid');
    let currentEditingApps = [];


    const DESKTOP_ICON_APPEARANCE_DEFAULTS = Object.freeze({
        radius: 16, labelColor: null, style: 'light'
    });

    function getDesktopIconAppearance() {
        const saved = appSettings.desktop_icon_appearance || {};
        const radiusNumber = Number(saved.radius);
        const validateColor = value => typeof value === 'string' && /^#[0-9a-f]{6}$/i.test(value) ? value : null;
        return {
            radius: Number.isFinite(radiusNumber) ? Math.min(30, Math.max(0, Math.round(radiusNumber))) : DESKTOP_ICON_APPEARANCE_DEFAULTS.radius,
            labelColor: validateColor(saved.labelColor),
            style: ['light', 'dark'].includes(saved.style) ? saved.style : DESKTOP_ICON_APPEARANCE_DEFAULTS.style
        };
    }

    function syncDesktopIconAppearanceControls(appearance = getDesktopIconAppearance()) {
        const panel = document.getElementById('desktopIconAppearancePanel');
        if (!panel) return;
        panel.hidden = currentActiveTab !== 'theme';
        const radius = document.getElementById('desktopAppearanceRadius');
        if (radius) radius.value = appearance.radius;
        const radiusText = document.getElementById('desktopAppearanceRadiusValue');
        if (radiusText) radiusText.textContent = appearance.radius + 'px';
        const nameColor = document.getElementById('desktopAppearanceNameColor');
        if (nameColor) nameColor.value = appearance.labelColor || '#555555';
        panel.querySelectorAll('[data-icon-style]').forEach(button => {
            button.setAttribute('aria-pressed', String(button.dataset.iconStyle === appearance.style));
        });
        const preview = document.getElementById('desktopAppearancePreviewIcon');
        if (preview && !preview.dataset.iconReady && typeof window.applyBuiltinDesktopIcon === 'function') {
            if (window.applyBuiltinDesktopIcon(preview, 'theme', null)) preview.dataset.iconReady = 'true';
        }
        const previewName = document.getElementById('desktopAppearancePreviewName');
        if (previewName) previewName.style.color = appearance.labelColor || '';
    }

    function applyDesktopIconAppearance() {
        const appearance = getDesktopIconAppearance();
        // Normalize previously saved glass preferences to the remaining light mode.
        const previousAppearance = appSettings.desktop_icon_appearance;
        const needsMigration = previousAppearance &&
            (['tintColor', 'customDarkness'].some(key => Object.prototype.hasOwnProperty.call(previousAppearance, key)) ||
             ['glass', 'default'].includes(previousAppearance.style));
        if (needsMigration) {
            appSettings.desktop_icon_appearance = appearance;
            if (typeof saveAppSettings === 'function') saveAppSettings();
        }
        const root = document.documentElement;
        root.style.setProperty('--desktop-icon-radius', appearance.radius + 'px');
        root.style.setProperty('--desktop-icon-editor-radius', Math.round(appearance.radius * 56 / 60) + 'px');
        root.style.setProperty('--desktop-icon-label-color', appearance.labelColor || '#555555');
        root.style.removeProperty('--desktop-custom-icon-darkness');
        root.style.removeProperty('--desktop-icon-tint-color');
        root.dataset.desktopIconStyle = appearance.style;
        root.dataset.desktopLabelCustom = appearance.labelColor ? 'true' : 'false';
        delete root.dataset.desktopIconTint;
        syncDesktopIconAppearanceControls(appearance);
    }

    function updateDesktopIconAppearance(key, value, persist = false) {
        if (!['radius', 'labelColor', 'style'].includes(key)) return;
        const appearance = getDesktopIconAppearance();
        appearance[key] = key === 'radius' ? Number(value) : value;
        appSettings.desktop_icon_appearance = appearance;
        applyDesktopIconAppearance();
        if (persist && typeof saveAppSettings === 'function') saveAppSettings();
    }

    function resetDesktopIconAppearanceColor(key) {
        if (key !== 'labelColor') return;
        updateDesktopIconAppearance(key, null, true);
    }

    function setDesktopIconAppearanceStyle(style) {
        if (!['light', 'dark'].includes(style)) return;
        updateDesktopIconAppearance('style', style, true);
    }

    window.applyDesktopIconAppearance = applyDesktopIconAppearance;
    window.updateDesktopIconAppearance = updateDesktopIconAppearance;
    window.resetDesktopIconAppearanceColor = resetDesktopIconAppearanceColor;
    window.setDesktopIconAppearanceStyle = setDesktopIconAppearanceStyle;
    applyDesktopIconAppearance();

    function openThemeApp() {
        if (themeVisibilityTimer) {
            clearTimeout(themeVisibilityTimer);
            themeVisibilityTimer = 0;
        }

        themeAppUI.style.display = 'flex';
            // show three-dots button; click to expand vertical capsule menu
        setTimeout(() => {
            themeAppUI.classList.add('show');
        }, 10);
        loadAppsIntoThemeUI();
        syncDesktopIconAppearanceControls();
    }

    let themeVisibilityTimer = 0;

    function closeThemeApp(options = {}) {
        const immediateClose = options === true || Boolean(options && typeof options === 'object' && options.immediate);

        if (themeVisibilityTimer) {
            clearTimeout(themeVisibilityTimer);
            themeVisibilityTimer = 0;
        }

        themeAppUI.classList.remove('show');

        if (immediateClose) {
            themeAppUI.style.display = 'none';
            if (typeof window.syncStatusBarAfterReturnHome === 'function') window.syncStatusBarAfterReturnHome();
            return;
        }

        themeVisibilityTimer = window.setTimeout(() => {
            themeVisibilityTimer = 0;
            if (!themeAppUI.classList.contains('show')) {
                themeAppUI.style.display = 'none';
                if (typeof window.syncStatusBarAfterReturnHome === 'function') window.syncStatusBarAfterReturnHome();
            }
        }, 300);
    }

    window.openThemeApp = openThemeApp;
    window.closeThemeApp = closeThemeApp;

    function loadAppsIntoThemeUI() {
        themeAppGrid.innerHTML = '';
        currentEditingApps = [];
        
        let indexCounter = 0;

        const allApps = document.querySelectorAll('#desktopGrid .app-item:not(.is-widget), #dock .app-item:not(.is-widget)');
        allApps.forEach((appEl) => {
            if (appEl.classList.contains('is-folder')) {
                try {
                    const folderApps = JSON.parse(decodeURIComponent(appEl.getAttribute('data-folder-apps') || '[]'));
                    folderApps.forEach((fApp, fIndex) => {
                        const appName = fApp.name;
                        const appIcon = fApp.icon || '';
                        let appId = fApp.appId;
                        
                        if (!appId) {
                            if (appName === '设置' || (appIcon && appIcon.includes('1000040040'))) appId = 'settings';
                            else if (appName === 'wechat' || appName === '微信' || (appIcon && appIcon.includes('wei-xin'))) appId = 'wechat';
                            else if (appName === 'Contacts' || (appIcon && appIcon.includes('tong-xun-lu'))) appId = 'contacts';
                            else if (appName === '世界书' || (appIcon && appIcon.includes('bei-wang-lu'))) appId = 'worldbook';
                            else if (appName === '见面' || (appIcon && appIcon.includes('Pomocat'))) appId = 'meeting';
                            else if (appName === '音乐' || (appIcon && appIcon.includes('Apple-Music'))) appId = 'placeholder-music';
                            else if (appName === '厨神驾到' || (appIcon && appIcon.includes('xia-zhou-chi-shen-me'))) appId = 'placeholder-food';
                            else if (appName === '今日') appId = 'placeholder-today';
                            else if (appName === '记忆' || (appIcon && appIcon.includes('shi-guang-shou-zhang'))) appId = 'memory';
                            else if (appName === '问爻' || (appIcon && appIcon.includes('yinyang'))) appId = 'placeholder-yinyang';
                            else if (appName === 'B站' || (appIcon && appIcon.includes('bi-li-bi-li'))) appId = 'placeholder-bilibili';
                            else if (appName === '健康' || (appIcon && appIcon.includes('Apple-jian-kang'))) appId = 'placeholder-health';
                            else if (appName === '家居' || (appIcon && appIcon.includes('jia-ting'))) appId = 'placeholder-home';
                            else if (appName === '游戏中心' || (appIcon && appIcon.includes('Steam-Mobile'))) appId = 'placeholder-game-center';
                            else if (appName === '邮件' || (appIcon && appIcon.includes('you-jian'))) appId = 'placeholder-mail';
                            else if (appName === '相册' || (appIcon && appIcon.includes('zhao-pian'))) appId = 'placeholder-photos';
                            else if (appName === '阅读' || (appIcon && appIcon.includes('Apple-Books'))) appId = 'placeholder-reading';
                            else if (appName === '同人') appId = 'fanfiction';
                            else if ((appName === 'icity' || appName === 'Diary') || (appIcon && appIcon.includes('i-City'))) appId = 'placeholder-icity';
                            else if (appName === '电话' || (appIcon && appIcon.includes('dian-hua'))) appId = 'phone';
                            else if (appName === '信息' || (appIcon && appIcon.includes('1000043922'))) appId = 'message';
                            else if (appName === '主题' || (appIcon && appIcon.includes('i-Tunes-Store'))) appId = 'theme';
                            else if (appName === 'MCP' || (appIcon && appIcon.includes('MCP-Agent'))) appId = 'mcp';
                            else if (appName === 'Twitter' || appName === '推特' || (appIcon && appIcon.includes('Twitter-i-OS'))) appId = 'twitter';
                            else if (appName === 'Apple store' || appName === 'Apple Store' || (appIcon && appIcon.includes('1000071869'))) appId = 'applestore';
                        }

                        currentEditingApps.push({
                            isFolderApp: true,
                            folderElement: appEl,
                            folderIndex: fIndex,
                            originalName: appName,
                            currentName: appName,
                            currentIcon: appIcon,
                            appId: appId,
                            iconHTML: ''
                        });
                        renderThemeAppCard(appName, appIcon, indexCounter++, appId, '');
                    });
                } catch (e) {
                    console.error("Failed to parse folder apps", e);
                }
            } else {
                const nameEl = appEl.querySelector('.app-name');
                const iconEl = appEl.querySelector('.app-icon');
                if (!nameEl) return; 
                
                const appName = nameEl.innerText;
                const appIcon = iconEl.style.backgroundImage;
                let appId = appEl.getAttribute('data-app-id');
                const iconHTML = iconEl.innerHTML;
                
                if (!appId) {
                    if (appName === '设置' || (appIcon && appIcon.includes('1000040040'))) appId = 'settings';
                    else if (appName === 'wechat' || appName === '微信' || (appIcon && appIcon.includes('wei-xin'))) appId = 'wechat';
                    else if (appName === 'Contacts' || (appIcon && appIcon.includes('tong-xun-lu'))) appId = 'contacts';
                    else if (appName === '世界书' || (appIcon && appIcon.includes('bei-wang-lu'))) appId = 'worldbook';
                    else if (appName === '见面' || (appIcon && appIcon.includes('Pomocat'))) appId = 'meeting';
                    else if (appName === '音乐' || (appIcon && appIcon.includes('Apple-Music'))) appId = 'placeholder-music';
                    else if (appName === '厨神驾到' || (appIcon && appIcon.includes('xia-zhou-chi-shen-me'))) appId = 'placeholder-food';
                    else if (appName === '今日') appId = 'placeholder-today';
                    else if (appName === '记忆' || (appIcon && appIcon.includes('shi-guang-shou-zhang'))) appId = 'memory';
                    else if (appName === '问爻' || (appIcon && appIcon.includes('yinyang'))) appId = 'placeholder-yinyang';
                    else if (appName === 'B站' || (appIcon && appIcon.includes('bi-li-bi-li'))) appId = 'placeholder-bilibili';
                    else if (appName === '健康' || (appIcon && appIcon.includes('Apple-jian-kang'))) appId = 'placeholder-health';
                    else if (appName === '家居' || (appIcon && appIcon.includes('jia-ting'))) appId = 'placeholder-home';
                    else if (appName === '游戏中心' || (appIcon && appIcon.includes('Steam-Mobile'))) appId = 'placeholder-game-center';
                    else if (appName === '邮件' || (appIcon && appIcon.includes('you-jian'))) appId = 'placeholder-mail';
                    else if (appName === '相册' || (appIcon && appIcon.includes('zhao-pian'))) appId = 'placeholder-photos';
                    else if (appName === '阅读' || (appIcon && appIcon.includes('Apple-Books'))) appId = 'placeholder-reading';
                            else if (appName === '同人') appId = 'fanfiction';
                    else if ((appName === 'icity' || appName === 'Diary') || (appIcon && appIcon.includes('i-City'))) appId = 'placeholder-icity';
                    else if (appName === '电话' || (appIcon && appIcon.includes('dian-hua'))) appId = 'phone';
                    else if (appName === '信息' || (appIcon && appIcon.includes('1000043922'))) appId = 'message';
                    else if (appName === '主题' || (appIcon && appIcon.includes('i-Tunes-Store'))) appId = 'theme';
                    else if (appName === 'MCP' || (appIcon && appIcon.includes('MCP-Agent'))) appId = 'mcp';
                    else if (appName === 'Twitter' || appName === '推特' || (appIcon && appIcon.includes('Twitter-i-OS'))) appId = 'twitter';
                    else if (appName === 'Apple store' || appName === 'Apple Store' || (appIcon && appIcon.includes('1000071869'))) appId = 'applestore';
                }

                currentEditingApps.push({
                    isFolderApp: false,
                    element: appEl,
                    originalName: appName,
                    currentName: appName,
                    currentIcon: appIcon,
                    appId: appId,
                    iconHTML: iconHTML
                });

                renderThemeAppCard(appName, appIcon, indexCounter++, appId, iconHTML);
            }
        });
    }

    function renderThemeAppCard(name, icon, index, appId, iconHTML) {
        const card = document.createElement('div');
        card.className = 'theme-app-card';
        
        const cameraSvg = `<svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#ffffff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"></path><circle cx="12" cy="13" r="4"></circle></svg>`;
        const themeSvg = `<svg class="theme-icon" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#8e8e93" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="13.5" cy="6.5" r=".5"/><circle cx="17.5" cy="10.5" r=".5"/><circle cx="8.5" cy="7.5" r=".5"/><circle cx="6.5" cy="12.5" r=".5"/><path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10c.926 0 1.648-.746 1.648-1.688 0-.437-.18-.835-.437-1.125-.29-.289-.438-.652-.438-1.125a1.64 1.64 0 0 1 1.668-1.668h1.996c3.051 0 5.555-2.503 5.555-5.554C21.965 6.012 17.461 2 12 2z"/></svg>`;
        const resetSvg = `<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/><path d="M3 3v5h5"/></svg>`;

            // show three-dots button; click to expand vertical capsule menu
        const originalName = document.createElement('div');
        originalName.className = 'theme-original-name';
        originalName.textContent = name;

        const resetButton = document.createElement('div');
        resetButton.className = 'theme-reset-btn';
        resetButton.title = '恢复默认';
        resetButton.innerHTML = resetSvg;
        resetButton.addEventListener('click', () => resetThemeApp(index));

        const iconWrapper = document.createElement('div');
        iconWrapper.className = 'theme-icon-wrapper';
        const iconElement = document.createElement('div');
        iconElement.className = 'theme-app-icon';
        iconElement.id = `theme-icon-${index}`;
        if (typeof window.applyBuiltinDesktopIcon === 'function' && window.applyBuiltinDesktopIcon(iconElement, appId, icon)) {
            // Built-in SVG icons are rendered locally without image requests.
        } else if (icon && icon !== 'none') {
            iconElement.style.backgroundImage = icon;
            iconElement.style.backgroundColor = 'transparent';
            iconElement.classList.add('has-custom-icon');
        } else if (appId === 'placeholder-today' || name === '今日') {
            iconElement.innerHTML = iconHTML || '';
            iconElement.classList.add('today-calendar-icon');
            iconElement.style.backgroundColor = '#fff';
        }
        iconElement.addEventListener('click', event => openIconMenu(event, index));
        iconWrapper.appendChild(iconElement);

        const textWrapper = document.createElement('div');
        textWrapper.className = 'theme-text-wrapper';
        const themeIconTemplate = document.createElement('template');
        themeIconTemplate.innerHTML = themeSvg;
        const themeIcon = themeIconTemplate.content.firstElementChild;
        const nameInput = document.createElement('span');
        nameInput.className = 'theme-app-name-input';
        nameInput.id = `theme-name-${index}`;
        nameInput.contentEditable = 'true';
        nameInput.textContent = name;
        nameInput.addEventListener('keydown', event => {
            if (event.key === 'Enter') {
                event.preventDefault();
                nameInput.blur();
            }
        });
        nameInput.addEventListener('blur', () => updateThemeAppName(index, nameInput.innerText));
        textWrapper.append(themeIcon, nameInput);
        card.append(originalName, resetButton, iconWrapper, textWrapper);
        themeAppGrid.appendChild(card);
    }

            // show three-dots button; click to expand vertical capsule menu
    let currentIconIndex = null;
    let pendingWidgetImageApply = null;

    function openWidgetImageMenu(anchor, onApply) {
        if (!anchor || typeof onApply !== 'function') return;
        pendingWidgetImageApply = onApply;
        // Clear unrelated settings targets before reusing the icon upload menu.
        window.currentEditingIcon = null;
        window.currentIconTarget = null;
        window._currentIconMenuTarget = null;
        openIconMenu({ currentTarget: anchor, target: anchor }, 'widgetImage');
    }
    window.openWidgetImageMenu = openWidgetImageMenu;

    function openIconMenu(event, index) {
        if (index !== 'widgetImage') pendingWidgetImageApply = null;
        currentIconIndex = index;
        const overlay = document.getElementById('iconMenuOverlay');
        const menu = document.getElementById('iconMenu');

        const iphone = document.querySelector('.iphone');
        const appHost = event.currentTarget?.closest?.('#themeAppUI, #settingsAppUI, #wechatAppUI') || iphone;
        if (appHost && overlay.parentElement !== appHost) appHost.appendChild(overlay);
        overlay.style.position = 'absolute';
        overlay.style.inset = '0';

        overlay.style.display = 'block';
        
            // show three-dots button; click to expand vertical capsule menu
        const rect = event.currentTarget?.getBoundingClientRect?.() || event.target.getBoundingClientRect();
        const overlayRect = overlay.getBoundingClientRect();
            // show three-dots button; click to expand vertical capsule menu
        let top = rect.bottom - overlayRect.top - 15;
        let left = rect.left - overlayRect.left;
        
            // show three-dots button; click to expand vertical capsule menu
        if (left + 240 > overlayRect.width) {
            left = overlayRect.width - 250;
        }
        if (top + 130 > overlayRect.height) {
            // show three-dots button; click to expand vertical capsule menu
            top = rect.top - overlayRect.top - 120;
        }
        
        menu.style.top = top + 'px';
        menu.style.left = left + 'px';
    }

    function closeIconMenu() {
        document.getElementById('iconMenuOverlay').style.display = 'none';
    }

    function handleIconLocalUpload(event) {
        const file = event.target.files[0];
        if (currentIconIndex === 'widgetImage') {
            event.target.value = '';
            closeIconMenu();
            if (!file || !pendingWidgetImageApply) return;
            if (!file.type.startsWith('image/') || typeof window.prepareWidgetImageData !== 'function') {
                if (typeof window.showToast === 'function') window.showToast('请选择有效的图片');
                return;
            }
            const imageApply = pendingWidgetImageApply;
            window.prepareWidgetImageData(file)
                .then(imageData => {
                    if (currentIconIndex === 'widgetImage' && pendingWidgetImageApply === imageApply) {
                        applyIconToApp(imageData);
                    }
                })
                .catch(error => {
                    console.error('Widget image read failed:', error);
                    if (typeof window.showToast === 'function') window.showToast('图片读取失败');
                });
            return;
        }
        if (file) {
            const reader = new FileReader();
            reader.onload = function(e) {
                if (currentIconIndex === 'wcMomentsBg' || currentIconIndex === 'wcMomentsAvatar') {
                    // 朋友圈背景和头像不压缩，直接使用原图
                    applyIconToApp(e.target.result);
                } else {
                    const img = new Image();
                    img.onload = function() {
                        const canvas = document.createElement('canvas');
                        const ctx = canvas.getContext('2d');
                        
                        const MAX_SIZE = 256;
                        let width = img.width;
                        let height = img.height;
                        
                        if (width > height) {
                            if (width > MAX_SIZE) {
                                height *= MAX_SIZE / width;
                                width = MAX_SIZE;
                            }
                        } else {
                            if (height > MAX_SIZE) {
                                width *= MAX_SIZE / height;
                                height = MAX_SIZE;
                            }
                        }
                        
                        canvas.width = width;
                        canvas.height = height;
                        ctx.drawImage(img, 0, 0, width, height);
                        
                        const base64Url = canvas.toDataURL('image/webp', 0.95);
                        applyIconToApp(base64Url);
                    };
                    img.src = e.target.result;
                }
            };
            reader.readAsDataURL(file);
        }
        event.target.value = '';
        closeIconMenu();
    }

    function openIconUrlModal() {
        const isWidgetImage = currentIconIndex === 'widgetImage';
        const imageApply = pendingWidgetImageApply;
        closeIconMenu();
        showCustomPrompt(isWidgetImage ? '使用 URL 导入图片' : '使用 URL 上传图标', 'https://...', '确定').then(url => {
            if (!url || !url.trim()) return;
            if (isWidgetImage) {
                if (currentIconIndex !== 'widgetImage' || pendingWidgetImageApply !== imageApply) return;
                try {
                    const imageUrl = new URL(url.trim());
                    if (imageUrl.protocol !== 'http:' && imageUrl.protocol !== 'https:') throw new Error('Invalid image URL');
                    applyIconToApp(imageUrl.href);
                } catch (error) {
                    if (typeof window.showToast === 'function') window.showToast('请输入有效的图片 URL');
                }
                return;
            }
            applyIconToApp(url.trim());
        });
    }

    function applyIconToApp(url) {
        if (currentIconIndex === null) return;

        if (currentIconIndex === 'widgetImage') {
            const imageApply = pendingWidgetImageApply;
            pendingWidgetImageApply = null;
            currentIconIndex = null;
            if (typeof imageApply === 'function') imageApply(url);
            return;
        }
        
        if (currentIconIndex === 'widgetAvatar') {
            if (window.currentWidgetAvatarTarget) {
                window.currentWidgetAvatarTarget.style.backgroundImage = `url('${url}')`;
                window.currentWidgetAvatarTarget.style.backgroundSize = 'cover';
                if (typeof saveLayout === 'function') saveLayout(); // 触发桌面保存
            }
            return;
        }

        if (currentIconIndex === 'wcMomentsBg') {
            wcMomentsProfile.bg = url;
            document.getElementById('wcMomentsEditBgPreview').style.backgroundImage = `url('${url}')`;
            return;
        }
        if (currentIconIndex === 'wcMomentsAvatar') {
            wcMomentsProfile.avatar = url;
            const avatarPreview = document.getElementById('wcMomentsEditAvatarPreview');
            avatarPreview.innerHTML = '';
            avatarPreview.style.backgroundImage = `url('${url}')`;
            avatarPreview.style.backgroundSize = 'cover';
            avatarPreview.style.backgroundPosition = 'center';
            return;
        }

            // show three-dots button; click to expand vertical capsule menu
        if (currentIconIndex === 'appleIdAvatar') {
            const appleIdAvatar = document.getElementById('appleIdAvatarPreview');
            const settingsAvatar = document.getElementById('settingsAvatarPreview');
            
            if (appleIdAvatar) {
                appleIdAvatar.innerHTML = ''; // 清空默认的 SVG
                appleIdAvatar.style.backgroundImage = `url('${url}')`;
                appleIdAvatar.style.backgroundSize = 'cover';
                appleIdAvatar.style.backgroundPosition = 'center';
            }
            if (settingsAvatar) {
                settingsAvatar.innerHTML = ''; // 同步清空设置页面的 SVG
                settingsAvatar.style.backgroundImage = `url('${url}')`;
                settingsAvatar.style.backgroundSize = 'cover';
                settingsAvatar.style.backgroundPosition = 'center';
            }
            saveProfileData(url);
            return;
        }

            // show three-dots button; click to expand vertical capsule menu
        const iconElement = document.getElementById(`theme-icon-${currentIconIndex}`);
        iconElement.style.backgroundImage = `url('${url}')`;
        iconElement.style.backgroundColor = 'transparent';
        iconElement.innerHTML = ''; // Clear calendar or built-in SVG before showing user artwork.
        iconElement.classList.remove('builtin-svg-icon');
        iconElement.style.removeProperty('--builtin-icon-bg');
        iconElement.classList.remove('today-calendar-icon'); // 移除日历专属样式，防止遮挡图片
        iconElement.classList.add('has-custom-icon');
        currentEditingApps[currentIconIndex].currentIcon = `url('${url}')`;
    }

    function updateThemeAppName(index, newName) {
        currentEditingApps[index].currentName = newName.trim() || currentEditingApps[index].originalName;
    }

    function resetThemeApp(index) {
        const appData = currentEditingApps[index];
        document.getElementById(`theme-icon-${index}`)?.classList.remove('has-custom-icon');
        
        const defaultApps = [
            { name: '设置', appId: 'settings', icon: null },
            { name: 'wechat', appId: 'wechat', icon: null },
            { name: 'Contacts', appId: 'contacts', icon: null }, 
            { name: '世界书', appId: 'worldbook', icon: null },
                        { name: '见面', appId: 'meeting', icon: null },
            { name: '音乐', appId: 'placeholder-music', icon: null },
            { name: '今日', appId: 'placeholder-today', icon: null },
            { name: '记忆', appId: 'memory', icon: null },
            { name: 'B站', appId: 'placeholder-bilibili', icon: null },
            { name: '健康', appId: 'placeholder-health', icon: null },
            { name: '游戏中心', appId: 'placeholder-game-center', icon: null },
            { name: '相册', appId: 'placeholder-photos', icon: null },
            { name: '阅读', appId: 'placeholder-reading', icon: null },
            { name: 'Diary', appId: 'placeholder-icity', icon: null },
            { name: '电话', appId: 'call', icon: null },
            { name: '信息', appId: 'message', icon: null },
            { name: '主题', appId: 'theme', icon: null },
            { name: 'MCP', appId: 'mcp', icon: null },
            { name: 'Twitter', appId: 'twitter', icon: null },
            { name: 'Apple store', appId: 'applestore', icon: null }
        ];

        const defaultApp = defaultApps.find(a => a.appId === appData.appId) || defaultApps.find(a => a.name === appData.originalName);

        
        if (defaultApp) {
            appData.currentName = defaultApp.name;
            appData.currentIcon = defaultApp.icon || '';
            
            document.getElementById(`theme-name-${index}`).innerText = defaultApp.name;
            
            const iconEl = document.getElementById(`theme-icon-${index}`);
            if (typeof window.applyBuiltinDesktopIcon === 'function' && window.applyBuiltinDesktopIcon(iconEl, defaultApp.appId, defaultApp.icon)) {
                // Restore the embedded filled icon for this app.
            } else if (defaultApp.icon) {
                iconEl.style.backgroundImage = defaultApp.icon;
                iconEl.style.backgroundColor = 'transparent';
                iconEl.innerHTML = '';
                iconEl.classList.remove('builtin-svg-icon', 'today-calendar-icon');
            } else {
                iconEl.style.backgroundImage = 'none';
                if (appData.appId === 'placeholder-today' || defaultApp.appId === 'placeholder-today') {
                    iconEl.style.backgroundColor = '#fff';
                    iconEl.innerHTML = appData.iconHTML || '';
                    iconEl.classList.add('today-calendar-icon');
                } else {
                    iconEl.style.backgroundColor = '#e5e5ea';
                    iconEl.innerHTML = '';
                    iconEl.classList.remove('today-calendar-icon');
                }
            }
        } else {
            appData.currentName = appData.originalName;
            appData.currentIcon = '';
            document.getElementById(`theme-name-${index}`).innerText = appData.originalName;
            const iconEl = document.getElementById(`theme-icon-${index}`);
            iconEl.style.backgroundImage = 'none';
            iconEl.style.backgroundColor = '#e5e5ea';
            iconEl.innerHTML = '';
            iconEl.classList.remove('today-calendar-icon');
        }
    }

    function saveThemeChanges() {
        const folderUpdates = new Map();

        currentEditingApps.forEach(appData => {
            if (appData.isFolderApp) {
                if (!folderUpdates.has(appData.folderElement)) {
                    try {
                        folderUpdates.set(appData.folderElement, JSON.parse(decodeURIComponent(appData.folderElement.getAttribute('data-folder-apps') || '[]')));
                    } catch(e) {
                        folderUpdates.set(appData.folderElement, []);
                    }
                }
                const fApps = folderUpdates.get(appData.folderElement);
                if (fApps[appData.folderIndex]) {
                    fApps[appData.folderIndex].name = appData.currentName;
                    fApps[appData.folderIndex].icon = appData.currentIcon && appData.currentIcon !== 'none' ? appData.currentIcon : null;
                    if (appData.appId) fApps[appData.folderIndex].appId = appData.appId;
                }
            } else {
                const nameEl = appData.element.querySelector('.app-name');
                const iconEl = appData.element.querySelector('.app-icon');
                
                if (nameEl) nameEl.innerText = appData.currentName;
                if (iconEl) {
                    if (appData.currentIcon && appData.currentIcon !== 'none'
                        && !(typeof window.isBuiltinDesktopIcon === 'function' && window.isBuiltinDesktopIcon(appData.appId, appData.currentIcon))) {
                        iconEl.classList.remove('builtin-svg-icon');
                        iconEl.style.removeProperty('--builtin-icon-bg');
                        iconEl.style.backgroundImage = appData.currentIcon;
                        iconEl.style.backgroundColor = 'transparent';
                        iconEl.classList.add('has-custom-icon');
                        iconEl.innerHTML = ''; 
                        iconEl.classList.remove('today-calendar-icon'); 
                    } else {
                        iconEl.style.backgroundImage = '';
                        iconEl.style.backgroundColor = '';
                        iconEl.classList.remove('has-custom-icon');
                        if (!(typeof window.applyBuiltinDesktopIcon === 'function' && window.applyBuiltinDesktopIcon(iconEl, appData.appId, null))) {
                            iconEl.classList.remove('builtin-svg-icon');
                            iconEl.innerHTML = '';
                        }
                    }
                }
            }
        });

        folderUpdates.forEach((fApps, folderEl) => {
            folderEl.setAttribute('data-folder-apps', encodeURIComponent(JSON.stringify(fApps)));
            const iconEl = folderEl.querySelector('.app-icon');
            if (iconEl) {
                iconEl.innerHTML = fApps.slice(0, 9).map(window.getDesktopMiniIconMarkup).join('');
            }
        });
        
        if (typeof saveLayout === 'function') saveLayout();
        if (typeof syncCloudSectionIcons === 'function') syncCloudSectionIcons();
        if (typeof updateRealStorage === 'function') updateRealStorage();
        closeThemeApp();
    }

            // show three-dots button; click to expand vertical capsule menu
 // 记录当前所在的 Tab

    function switchThemeTab(tabName, element) {
        currentActiveTab = tabName;
        syncDesktopIconAppearanceControls();
        themeAppUI.classList.toggle('is-widget-tab', tabName === 'widget');
            // show three-dots button; click to expand vertical capsule menu
        const tabs = document.querySelectorAll('#themeTopTabs .theme-tab-item');
        tabs.forEach(tab => tab.classList.remove('active'));
        element.classList.add('active');

        const themeGrid = document.getElementById('themeAppGrid');
        const wallpaperGrid = document.getElementById('wallpaperAppGrid');
        const presetGrid = document.getElementById('presetAppGrid');
        const fontGrid = document.getElementById('fontAppGrid');
        const topBarTitle = document.getElementById('topBarTitle');
        const topRightBtn = document.getElementById('topRightBtn');

            // show three-dots button; click to expand vertical capsule menu
        if (isPresetEditMode) togglePresetEditMode();
            // show three-dots button; click to expand vertical capsule menu
        if (isFontEditMode) toggleFontEditMode();

            // show three-dots button; click to expand vertical capsule menu
        document.getElementById('themeDropdownMenu').classList.remove('show');
        if (document.getElementById('menuIconList')) {
            document.getElementById('menuIconList').style.display = 'block';
            document.getElementById('menuIconChevron').style.display = 'none';
        }

        if (tabName === 'theme') {
            topBarTitle.innerText = 'Icons';
            topRightBtn.innerText = 'Save';
            topRightBtn.style.display = 'block';
            document.getElementById('themeMenuBtn').style.display = 'none';
            themeGrid.style.display = 'grid';
            wallpaperGrid.style.display = 'none';
            presetGrid.style.display = 'none';
            if(fontGrid) fontGrid.style.display = 'none';
            hideWidgetChrome();
        } else if (tabName === 'wallpaper') {
            topBarTitle.innerText = 'Wallpapers';
            topRightBtn.style.display = 'none'; // 壁纸页不需要右上角按钮
            document.getElementById('themeMenuBtn').style.display = 'none';
            themeGrid.style.display = 'none';
            wallpaperGrid.style.display = 'flex';
            presetGrid.style.display = 'none';
            if(fontGrid) fontGrid.style.display = 'none';
            hideWidgetChrome();
            renderWallpapers();
            
            const now = new Date();
            document.getElementById('infoClock').textContent = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
        } else if (tabName === 'preset') {
            topBarTitle.innerText = 'Themes';
            topRightBtn.style.display = 'none';
            document.getElementById('themeMenuBtn').style.display = 'flex';
            themeGrid.style.display = 'none';
            wallpaperGrid.style.display = 'none';
            presetGrid.style.display = 'flex';
            if(fontGrid) fontGrid.style.display = 'none';
            hideWidgetChrome();
            renderPresets();
        } else if (tabName === 'font') {
            topBarTitle.innerText = 'Fonts';
            topRightBtn.innerText = 'Edit';
            topRightBtn.style.display = 'block';
            document.getElementById('themeMenuBtn').style.display = 'none';
            themeGrid.style.display = 'none';
            wallpaperGrid.style.display = 'none';
            presetGrid.style.display = 'none';
            if(fontGrid) fontGrid.style.display = 'flex';
            hideWidgetChrome();
        } else if (tabName === 'widget') {
            topBarTitle.innerText = "Widgets";
            topRightBtn.style.display = "none";
            document.getElementById("widgetDoneBtn").style.display = "none";
            // show three-dots button; click to expand vertical capsule menu
            const mb = document.getElementById("themeMenuBtn"); if (mb) mb.style.display = "flex";
            const di = document.getElementById("menuIconDots"); if (di) di.style.display = "block";
            const vb = document.getElementById('widgetViewBtn'); if (vb) vb.style.display = 'flex';
            const li = document.getElementById("menuIconList"); if (li) li.style.display = "none";
            const ch = document.getElementById("menuIconChevron"); if (ch) ch.style.display = "none";
            const wgc = document.getElementById("widgetToolbarMenu"); if (wgc) { wgc.style.display = "flex"; wgc.classList.remove("show"); }
            themeGrid.style.display = "none";
            wallpaperGrid.style.display = "none";
            presetGrid.style.display = "none";
            if(fontGrid) fontGrid.style.display = "none";
            document.getElementById("widgetAppGrid").style.display = "flex";
            if (typeof renderWidgetViews === "function") renderWidgetViews(false);
        }
    }

            // show three-dots button; click to expand vertical capsule menu


    function renderWallpapers() {
        const carouselScroll = document.getElementById('carouselScroll');
        const pagination = document.getElementById('pagination');
        if (!carouselScroll || !pagination) return;
        
        carouselScroll.innerHTML = '';
        pagination.innerHTML = '';

        wallpapers.forEach((wp, index) => {
            const card = document.createElement('div');
            card.className = 'wallpaper-card';

            if (wp.isAdd) {
                card.innerHTML = `
                    <div class="card-title">新墙纸</div>
                    <div class="screens-container">
                        <div class="screen-preview">
                            <div class="add-btn" onclick="openWallpaperMenu(event)">
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
                            </div>
                        </div>
                        <div class="screen-preview"></div>
                    </div>
                `;
            } else {
                const isSelected = currentWallpaperSrc === wp.src ? 'selected' : '';
                card.innerHTML = `
                    <div class="delete-btn" onclick="deleteWallpaper('${wp.id}')">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>
                    </div>
                    <div class="card-title">已存墙纸</div>
                    <div class="screens-container">
                        <div class="screen-preview ${isSelected}" style="background-image: url('${wp.src}')" onclick="setDesktopWallpaper('${wp.src}')"></div>
                        <div class="screen-preview ${isSelected}" style="background-image: url('${wp.src}')" onclick="setDesktopWallpaper('${wp.src}')"></div>
                    </div>
                `;
            }
            carouselScroll.appendChild(card);

            const dot = document.createElement('div');
            dot.className = 'dot';
            if (index === 0) dot.classList.add('active');
            pagination.appendChild(dot);
        });

        updatePagination();
    }

    function handleWallpaperUpload(event) {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = function(e) {
                const img = new Image();
                img.onload = function() {
                    const canvas = document.createElement('canvas');
                    const ctx = canvas.getContext('2d');
                    
            // show three-dots button; click to expand vertical capsule menu
            // show three-dots button; click to expand vertical capsule menu
                    const MAX_WIDTH = 1170;
                    const MAX_HEIGHT = 2532;
                    
                    let width = img.width;
                    let height = img.height;
                    
            // show three-dots button; click to expand vertical capsule menu
                    if (width > MAX_WIDTH || height > MAX_HEIGHT) {
                        const ratio = Math.min(MAX_WIDTH / width, MAX_HEIGHT / height);
                        width = Math.round(width * ratio);
                        height = Math.round(height * ratio);
                    }
                    
                    canvas.width = width;
                    canvas.height = height;
                    ctx.drawImage(img, 0, 0, width, height);
                    
            // show three-dots button; click to expand vertical capsule menu
                    const base64Url = canvas.toDataURL('image/jpeg', 0.95);
                    
                    const newWallpaper = {
                        id: Date.now().toString(),
                        isAdd: false,
                        src: base64Url
                    };
                    wallpapers.splice(1, 0, newWallpaper); // 插入到添加按钮后面
                    renderWallpapers();
                    saveWallpaperData();
                    
                    const carouselScroll = document.getElementById('carouselScroll');
                    setTimeout(() => {
                        carouselScroll.scrollTo({ left: carouselScroll.clientWidth, behavior: 'smooth' });
                    }, 100);
                };
                img.src = e.target.result;
            };
            reader.readAsDataURL(file);
        }
        event.target.value = '';
    }

    function openWallpaperMenu(event) {
        const overlay = document.getElementById('wallpaperMenuOverlay');
        const menu = document.getElementById('wallpaperMenu');
        const app = document.getElementById('themeAppUI');
        if (!overlay || !menu || !app) return;
        if (overlay.parentElement !== app) app.appendChild(overlay);
        overlay.style.position = 'absolute';
        overlay.style.inset = '0';
        overlay.style.width = '100%';
        overlay.style.height = '100%';
        overlay.style.zIndex = '10000';
        
        overlay.style.display = 'block';
        
            // show three-dots button; click to expand vertical capsule menu
        const rect = event.target.closest('.add-btn').getBoundingClientRect();
        const appRect = app.getBoundingClientRect();
        const menuWidth = 240;
        const menuHeight = 130;
        let top = rect.bottom + 10;
        let left = rect.left - 100; // 稍微往左偏移一点，避免超出屏幕
        
        if (left + 240 > window.innerWidth) {
            left = window.innerWidth - 250;
        }
        if (top + 130 > window.innerHeight) {
            top = rect.top - 120;
        }
        
        top = rect.bottom - appRect.top + 10;
        left = rect.left - appRect.left - 100;
        const maxLeft = Math.max(8, appRect.width - menuWidth - 8);
        const maxTop = Math.max(8, appRect.height - menuHeight - 8);
        left = Math.min(Math.max(8, left), maxLeft);
        if (top > maxTop) top = rect.top - appRect.top - menuHeight - 10;
        top = Math.min(Math.max(8, top), maxTop);

        menu.style.top = top + 'px';
        menu.style.left = left + 'px';
    }

    function closeWallpaperMenu() {
        document.getElementById('wallpaperMenuOverlay').style.display = 'none';
    }

    function openWallpaperUrlModal() {
        closeWallpaperMenu();
        showCustomPrompt('使用 URL 上传壁纸', 'https://...', '确定').then(url => {
            if (url && url.trim()) {
                const newWallpaper = { id: Date.now().toString(), isAdd: false, src: url.trim() };
                wallpapers.splice(1, 0, newWallpaper);
                renderWallpapers();
                saveWallpaperData();
                const carouselScroll = document.getElementById('carouselScroll');
                setTimeout(() => { carouselScroll.scrollTo({ left: carouselScroll.clientWidth, behavior: 'smooth' }); }, 100);
            }
        });
    }

    function deleteWallpaper(id) {
        showCustomConfirm('删除墙纸', '确定要删除这张壁纸吗？', '删除', true).then(confirmed => {
            if(confirmed) {
                const wpToDelete = wallpapers.find(wp => wp.id === id);
                wallpapers = wallpapers.filter(wp => wp.id !== id);
                
            // show three-dots button; click to expand vertical capsule menu
                if (wpToDelete && currentWallpaperSrc === wpToDelete.src) {
                    applyWallpaperToDesktop(null);
                }
                
                renderWallpapers();
                saveWallpaperData();
            }
        });
    }

    function setDesktopWallpaper(src) {
        applyWallpaperToDesktop(src);
        renderWallpapers(); // 重新渲染以更新选中状态边框
        saveWallpaperData();
    }

    let paginationRafId = null;
    function updatePagination() {
        if (paginationRafId) return;
        paginationRafId = requestAnimationFrame(() => {
            const carouselScroll = document.getElementById('carouselScroll');
            const pagination = document.getElementById('pagination');
            if (!carouselScroll || !pagination) {
                paginationRafId = null;
                return;
            }

            const scrollLeft = carouselScroll.scrollLeft;
            const cardWidth = carouselScroll.clientWidth;
            const currentIndex = Math.round(scrollLeft / cardWidth);
            
            const dots = pagination.querySelectorAll('.dot');
            dots.forEach((dot, index) => {
                if (index === currentIndex) {
                    dot.classList.add('active');
                } else {
                    dot.classList.remove('active');
                }
            });
            paginationRafId = null;
        });
    }

            // show three-dots button; click to expand vertical capsule menu

    let isPresetEditMode = false;
    let selectedPresets = new Set();

            // show three-dots button; click to expand vertical capsule menu
    function handleTopRightBtn() {
        if (currentActiveTab === 'theme') {
            saveThemeChanges(); // 在 Icons 页面，执行保存
        } else if (currentActiveTab === 'preset') {
            togglePresetEditMode(); // 在 Themes 页面，切换编辑模式
        } else if (currentActiveTab === 'font') {
            toggleFontEditMode(); // 在 Fonts 页面，切换编辑模式
        }
    }

            // show three-dots button; click to expand vertical capsule menu
    function toggleThemeMenu() {
        const menu = document.getElementById('themeDropdownMenu');
        const isShowing = menu.classList.toggle('show');
        
        const iconList = document.getElementById('menuIconList');
        const iconChevron = document.getElementById('menuIconChevron');
        if (iconList && iconChevron) {
            if (isShowing) {
                iconList.style.display = 'none';
                iconChevron.style.display = 'block';
            } else {
                iconList.style.display = 'block';
                iconChevron.style.display = 'none';
            }
        }
    }

            // show three-dots button; click to expand vertical capsule menu
    function togglePresetEditMode() {
        isPresetEditMode = !isPresetEditMode;
        selectedPresets.clear(); // 清空选中状态
        
        const topRightBtn = document.getElementById('topRightBtn');
        const menuBtn = document.getElementById('themeMenuBtn');
        const actionBtn = document.getElementById('presetActionBtn');
        
        if (isPresetEditMode) {
            topRightBtn.innerText = 'Cancel';
            topRightBtn.style.display = 'block';
            menuBtn.style.display = 'none';
            actionBtn.innerText = '删除所选预设';
            actionBtn.classList.add('delete-mode');
        } else {
            topRightBtn.style.display = 'none';
            menuBtn.style.display = 'flex';
            actionBtn.innerText = '+ 保存主题为预设';
            actionBtn.classList.remove('delete-mode');
        }
        renderPresets();
    }

            // show three-dots button; click to expand vertical capsule menu
    function handlePresetAction() {
        if (isPresetEditMode) {
            // show three-dots button; click to expand vertical capsule menu
            if (selectedPresets.size === 0) return;
            showCustomConfirm('删除预设', `确定要删除选中的 ${selectedPresets.size} 个预设吗？`, '删除', true).then(confirmed => {
                if (confirmed) {
                    presets = presets.filter(p => !selectedPresets.has(p.id));
                    savePresetData();
                    togglePresetEditMode(); // 删除后退出编辑模式
                }
            });
        } else {
            // show three-dots button; click to expand vertical capsule menu
            openPresetModal();
        }
    }

    function calculatePresetSize(preset) {
            // show three-dots button; click to expand vertical capsule menu
            // show three-dots button; click to expand vertical capsule menu
            // show three-dots button; click to expand vertical capsule menu
        const jsonString = JSON.stringify(preset);
        const totalBytes = jsonString.length;
        const sizeMB = totalBytes / (1024 * 1024);
        return sizeMB < 0.01 && sizeMB > 0 ? 0.01 : sizeMB;
    }

    function renderPresets() {
        const presetGridContent = document.getElementById('presetGridContent');
        const emptyHint = document.getElementById('presetEmptyHint');
        if (!presetGridContent) return;
        presetGridContent.innerHTML = '';

        if (presets.length === 0) {
            if(emptyHint) emptyHint.style.display = 'block';
        } else {
            if(emptyHint) emptyHint.style.display = 'none';
        }

        presets.forEach(preset => {
            const card = document.createElement('div');
            card.className = `preset-card ${isPresetEditMode ? 'edit-mode' : ''} ${selectedPresets.has(preset.id) ? 'selected' : ''}`;
            
            card.onclick = () => {
                if (isPresetEditMode) {
            // show three-dots button; click to expand vertical capsule menu
                    if (selectedPresets.has(preset.id)) {
                        selectedPresets.delete(preset.id);
                        card.classList.remove('selected');
                    } else {
                        selectedPresets.add(preset.id);
                        card.classList.add('selected');
                    }
            // show three-dots button; click to expand vertical capsule menu
                    const actionBtn = document.getElementById('presetActionBtn');
                    actionBtn.innerText = selectedPresets.size > 0 ? `删除所选预设 (${selectedPresets.size})` : '删除所选预设';
                } else {
            // show three-dots button; click to expand vertical capsule menu
                    openPresetDetail(preset.id);
                }
            };

            const hasWallpaper = !!preset.wallpaper;
            const bgStyle = hasWallpaper ? `background-image: url('${preset.wallpaper}')` : '';
            const bgClass = hasWallpaper ? 'preset-bg' : 'preset-bg default-bg';
            const timeClass = hasWallpaper ? 'preset-lock-time has-bg' : 'preset-lock-time';
            const timeStr = "09:41"; // 模拟 iOS 经典锁屏时间

            card.innerHTML = `
                <div class="preset-img-wrapper">
                    <div class="${bgClass}" style="${bgStyle}"></div>
                    <div class="${timeClass}">${timeStr}</div>
                    <div class="preset-check-circle"></div>
                </div>
                <div class="preset-name">${preset.name}</div>
            `;
            presetGridContent.appendChild(card);
        });
    }

    function openPresetModal() {
        showCustomPrompt('主题预设', '输入预设名称...', '保存').then(inputVal => {
            if (inputVal === null) return;
            if (!inputVal.trim()) {
                showCustomAlert("提示", "请输入预设名称！");
                return;
            }
            saveCurrentAsPreset(inputVal.trim());
        });
    }

    function getPresetPages(preset) {
        if (preset && Array.isArray(preset.pages) && preset.pages.length > 0) return preset.pages;
        return [preset && Array.isArray(preset.desktop) ? preset.desktop : []];
    }

    function captureCurrentDesktopLayout() {
        const pages = typeof window.getDesktopPagesSnapshot === 'function'
            ? window.getDesktopPagesSnapshot()
            : [typeof window.serializeDesktopGrid === 'function' ? window.serializeDesktopGrid() : []];
        return {
            pages,
            desktop: pages[0] || [],
            dock: typeof window.serializeDockApps === 'function' ? window.serializeDockApps() : [],
            currentPage: typeof window.getCurrentDesktopPageIndex === 'function'
                ? window.getCurrentDesktopPageIndex()
                : 0,
            desktopRows: typeof window.getDesktopRowCount === 'function'
                ? window.getDesktopRowCount()
                : 6
        };
    }

    function saveCurrentAsPreset(inputVal) {
            // show three-dots button; click to expand vertical capsule menu
        const layout = captureCurrentDesktopLayout();

        const now = new Date();
        const dateStr = `${now.getFullYear()}年${String(now.getMonth() + 1).padStart(2, '0')}月${String(now.getDate()).padStart(2, '0')}日`;

        const newPreset = {
            id: Date.now(),
            name: inputVal,
            date: dateStr,
            wallpaper: currentWallpaperSrc,
            pages: layout.pages,
            desktop: layout.desktop,
            dock: layout.dock,
            currentPage: layout.currentPage,
            desktopRows: layout.desktopRows
        };
        
            // show three-dots button; click to expand vertical capsule menu
        newPreset.sizeMB = calculatePresetSize(newPreset);

        presets.push(newPreset);
        savePresetData();
        renderPresets();
        
        const scrollArea = document.querySelector('.preset-scroll-area');
        setTimeout(() => {
            scrollArea.scrollTo({ top: scrollArea.scrollHeight, behavior: 'smooth' });
        }, 100);
    }

    let currentDetailPresetId = null;

    function openPresetDetail(id) {
        const preset = presets.find(p => p.id === id);
        if (!preset) return;
        
        currentDetailPresetId = id;
        
        document.getElementById('detailName').innerText = preset.name;
        document.getElementById('detailDate').innerText = '创建于：' + (preset.date || '未知时间');
        
            // show three-dots button; click to expand vertical capsule menu
        let sizeMB = preset.sizeMB || 15.0;
        let sizeKB = sizeMB * 1024;
        document.getElementById('detailSize').innerText = sizeKB < 1024 ? sizeKB.toFixed(2) + ' KB' : sizeMB.toFixed(2) + ' MB';
        
        const carousel = document.querySelector('.preview-carousel');
        carousel.innerHTML = ''; // 清空现有的手机模型
        
        const previewPages = getPresetPages(preset);
        const previewPageIndex = Math.max(0, Math.min(Number(preset.currentPage) || 0, previewPages.length - 1));
        
        previewPages.forEach((page, pageIndex) => {
            let desktopHTML = '<div class="desktop-grid" style="position: absolute; top: 0; left: 0; width: 100%; height: calc(100% - 180px); overflow: hidden;"><div class="desktop-page" style="display: grid; width: 375px; height: 100%; padding: 0 20px; box-sizing: border-box; grid-template-columns: repeat(4, 76.25px); column-gap: 10px; row-gap: 15px;">';
            for (let i = 0; i < 28; i++) {
                const appData = page.find(d => d.index === i);
                if (appData) {
                    if (appData.isFolder) {
                        const folderApps = appData.apps || [];
                        const miniIconsHTML = folderApps.slice(0, 9).map(window.getDesktopMiniIconMarkup).join('');
                        desktopHTML += `<div class="desktop-slot" style="width: 76.25px; height: 80px; display: flex; flex-direction: column; align-items: center; justify-content: flex-start;"><div class="app-item is-folder"><div class="app-icon folder-icon">${miniIconsHTML}</div><div class="app-name">${appData.name || '文件夹'}</div></div></div>`;
                    } else if (appData.isWidget || appData.widgetContent) {
                        const widgetContent = typeof window.normalizeStoredWidgetContent === 'function'
                            ? window.normalizeStoredWidgetContent(appData.widgetContent)
                            : (appData.widgetContent || '');
                        
                        let cols = 1, rows = 1;
                        if (appData.presetSize) {
                            const parts = appData.presetSize.split('x').map(Number);
                            if (parts.length === 2 && parts[0] > 0 && parts[1] > 0) {
                                cols = parts[0];
                                rows = parts[1];
                            }
                        } else if (appData.width && appData.height) {
                            cols = Math.max(1, Math.round(parseInt(appData.width, 10) / 140));
                            rows = Math.max(1, Math.round(parseInt(appData.height, 10) / 140));
                        }
                        cols = Math.min(4, Math.max(1, cols));
                        rows = Math.min(6, Math.max(1, rows));

                        const widgetWidth = cols * 76.25 + (cols - 1) * 10;
                        const widgetHeight = rows * 80 + (rows - 1) * 15;
                        
                        let frameHTML = '';
                        if (window.makeDesktopWidgetFrameHTML) {
                            frameHTML = window.makeDesktopWidgetFrameHTML(widgetContent);
                        }

                        desktopHTML += `<div class="desktop-slot" style="width: 76.25px; height: 80px; position: relative; display: block; overflow: visible;"><div class="app-item is-widget" style="width: ${widgetWidth}px; height: ${widgetHeight}px; position: absolute; left: 0; top: 0; margin: 0; z-index: 10;"><div class="app-icon" style="background: transparent; box-shadow: none; border-radius: 20px; overflow: hidden; width: ${widgetWidth}px; height: ${widgetHeight}px; position: absolute; left: 0; top: 0; z-index: 10;">${frameHTML}</div></div></div>`;
                    } else {
                        const builtinSvg = typeof window.getBuiltinDesktopIconSvg === 'function'
                            ? window.getBuiltinDesktopIconSvg(appData.appId, appData.icon) : '';
                        const safeIcon = !builtinSvg && appData.icon ? appData.icon.replace(/"/g, "'") : '';
                        const iconStyle = builtinSvg
                            ? `--builtin-icon-bg: ${window.getBuiltinDesktopIconBackground(appData.appId)}; --builtin-icon-fg: ${window.getBuiltinDesktopIconForeground(appData.appId)};`
                            : (safeIcon ? `background-image: ${safeIcon};` : '');
                        const customClass = builtinSvg && appData.appId !== 'placeholder-today'
                            ? 'builtin-svg-icon' : (safeIcon ? 'has-custom-icon' : '');
                        
                        let innerHTML = builtinSvg;
                        let extraClass = '';
                        if (appData.appId === 'placeholder-today' && (builtinSvg || !appData.icon)) {
                            extraClass = 'today-calendar-icon';
                            innerHTML = window.getTodayCalendarIconHtml
                                ? window.getTodayCalendarIconHtml() : '';
                        }
                        
                        desktopHTML += `<div class="desktop-slot" style="width: 76.25px; height: 80px; display: flex; flex-direction: column; align-items: center; justify-content: flex-start;"><div class="app-item"><div class="app-icon ${customClass} ${extraClass}" style="${iconStyle}">${innerHTML}</div><div class="app-name">${appData.name || ''}</div></div></div>`;
                    }
                } else {
                    desktopHTML += `<div class="desktop-slot" style="width: 76.25px; height: 80px;"></div>`;
                }
            }
            desktopHTML += '</div></div>';

            if (previewPages.length > 1) {
                desktopHTML += '<div class="desktop-page-dots" style="position:absolute;left:50%;bottom:125px;transform:translateX(-50%);">';
                previewPages.forEach((_, index) => {
                    desktopHTML += `<span class="desktop-page-dot ${index === pageIndex ? 'active' : ''}"></span>`;
                });
                desktopHTML += '</div>';
            }

            let dockHTML = '<div class="dock" style="bottom: 15px;">';
            if (preset.dock) {
                preset.dock.forEach(appData => {
                    if (appData.isFolder) {
                        const folderApps = appData.apps || [];
                        const miniIconsHTML = folderApps.slice(0, 9).map(window.getDesktopMiniIconMarkup).join('');
                        dockHTML += `<div class="app-item is-folder"><div class="app-icon folder-icon">${miniIconsHTML}</div></div>`;
                    } else {
                        const builtinSvg = typeof window.getBuiltinDesktopIconSvg === 'function'
                            ? window.getBuiltinDesktopIconSvg(appData.appId, appData.icon) : '';
                        const safeIcon = !builtinSvg && appData.icon ? appData.icon.replace(/"/g, "'") : '';
                        const iconStyle = builtinSvg
                            ? `--builtin-icon-bg: ${window.getBuiltinDesktopIconBackground(appData.appId)}; --builtin-icon-fg: ${window.getBuiltinDesktopIconForeground(appData.appId)};`
                            : (safeIcon ? `background-image: ${safeIcon};` : '');
                        const customClass = builtinSvg ? 'builtin-svg-icon' : (safeIcon ? 'has-custom-icon' : '');
                        dockHTML += `<div class="app-item"><div class="app-icon ${customClass}" style="${iconStyle}">${builtinSvg}</div></div>`;
                    }
                });
            }
            dockHTML += '</div>';

            const mockup = document.createElement('div');
            mockup.className = 'preview-phone-mockup';
            
            const scaleContainer = document.createElement('div');
            scaleContainer.className = 'preview-scale-container';
            scaleContainer.style.backgroundImage = preset.wallpaper ? `url('${preset.wallpaper}')` : '';
            scaleContainer.style.pointerEvents = 'none';
            scaleContainer.innerHTML = desktopHTML + dockHTML;
            
            mockup.appendChild(scaleContainer);
            carousel.appendChild(mockup);
        });
        
        const detailPage = document.getElementById('presetDetailPage');
        detailPage.style.display = 'flex';
        setTimeout(() => {
            detailPage.classList.add('show');
            if (previewPages.length > 1 && carousel.children[previewPageIndex]) {
                const targetMockup = carousel.children[previewPageIndex];
                carousel.scrollTo({
                    left: targetMockup.offsetLeft - (carousel.clientWidth / 2) + (targetMockup.clientWidth / 2),
                    behavior: 'smooth'
                });
            }
        }, 10);
    }

    function toggleDetailMenu() {
        const menu = document.getElementById('detailDropdownMenu');
        const isShowing = menu.classList.toggle('show');
        
        const iconList = document.getElementById('detailMenuIconList');
        const iconChevron = document.getElementById('detailMenuIconChevron');
        if (iconList && iconChevron) {
            if (isShowing) {
                iconList.style.display = 'none';
                iconChevron.style.display = 'block';
            } else {
                iconList.style.display = 'block';
                iconChevron.style.display = 'none';
            }
        }
    }

    function closePresetDetail() {
        const detailPage = document.getElementById('presetDetailPage');
        document.getElementById('detailDropdownMenu').classList.remove('show'); // 关闭时隐藏菜单
        
            // show three-dots button; click to expand vertical capsule menu
        const iconList = document.getElementById('detailMenuIconList');
        const iconChevron = document.getElementById('detailMenuIconChevron');
        if (iconList && iconChevron) {
            iconList.style.display = 'block';
            iconChevron.style.display = 'none';
        }

        detailPage.classList.remove('show');
        setTimeout(() => {
            detailPage.style.display = 'none';
            currentDetailPresetId = null;
        }, 300);
    }

    let isExportingCurrentTheme = false;

    function openExportCurrentThemeModal() {
        isExportingCurrentTheme = true;
        showCustomPrompt('导出主题', { placeholder: '输入导出文件名称...', value: '当前主题' }, '导出').then(fileName => {
            if (fileName === null) return;
            exportCurrentUsingTheme(fileName.trim() || '当前主题');
        });
    }

    function openExportModal() {
        isExportingCurrentTheme = false;
        if (!currentDetailPresetId) return;
        const preset = presets.find(p => p.id === currentDetailPresetId);
        if (!preset) return;
        
        showCustomPrompt('导出主题', { placeholder: '输入导出文件名称...', value: preset.name }, '导出').then(fileName => {
            if (fileName === null) return;
            exportCurrentPreset(fileName.trim() || preset.name);
        });
    }

    function exportCurrentPreset(fileName) {
        if (!currentDetailPresetId) return;
        const preset = presets.find(p => p.id === currentDetailPresetId);
        if (!preset) return;
        
        const jsonString = JSON.stringify(preset, null, 2);
        const blob = new Blob([jsonString], { type: "application/json;charset=utf-8" });
        const url = URL.createObjectURL(blob);
        
        const downloadAnchorNode = document.createElement('a');
        downloadAnchorNode.setAttribute("href", url);
        downloadAnchorNode.setAttribute("download", fileName + ".json");
        document.body.appendChild(downloadAnchorNode);
        downloadAnchorNode.click();
        document.body.removeChild(downloadAnchorNode);
        URL.revokeObjectURL(url);
    }

    function extractBase64FromUrl(cssUrl) {
        if (!cssUrl) return null;
        const match = cssUrl.match(/url\(['"]?(data:image\/[^'"]+)['"]?\)/);
        return match ? match[1] : null;
    }

    function compressImageBase64(base64Str, maxWidth, quality, callback) {
        if (!base64Str || !base64Str.startsWith('data:image')) {
            callback(base64Str);
            return;
        }
        const img = new Image();
        img.onload = function() {
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');
            let width = img.width;
            let height = img.height;
            
            if (width > maxWidth) {
                height *= maxWidth / width;
                width = maxWidth;
            }
            
            canvas.width = width;
            canvas.height = height;
            ctx.drawImage(img, 0, 0, width, height);
            
            callback(canvas.toDataURL('image/webp', quality));
        };
        img.onerror = function() {
            callback(base64Str);
        };
        img.src = base64Str;
    }

    function compressPreset() {
        if (!currentDetailPresetId) return;
        const preset = presets.find(p => p.id === currentDetailPresetId);
        if (!preset) return;

        const sizeEl = document.getElementById('detailSize');
        sizeEl.innerText = '压缩中...';

        let tasks = [];

            // show three-dots button; click to expand vertical capsule menu
        if (preset.wallpaper && preset.wallpaper.startsWith('data:image')) {
            tasks.push(new Promise(resolve => {
                compressImageBase64(preset.wallpaper, 1080, 0.8, (newBase64) => {
                    preset.wallpaper = newBase64;
                    resolve();
                });
            }));
        }

            // show three-dots button; click to expand vertical capsule menu
        const presetPages = getPresetPages(preset);
        presetPages.forEach(page => {
            page.forEach(app => {
                if (app.icon) {
                    const base64 = extractBase64FromUrl(app.icon);
                    if (base64) {
                        tasks.push(new Promise(resolve => {
                            compressImageBase64(base64, 256, 0.9, (newBase64) => {
                                app.icon = `url('${newBase64}')`;
                                resolve();
                            });
                        }));
                    }
                }
            });
        });
        preset.pages = presetPages;
        preset.desktop = presetPages[0] || [];

            // show three-dots button; click to expand vertical capsule menu
        if (preset.dock) {
            preset.dock.forEach(app => {
                if (app.icon) {
                    const base64 = extractBase64FromUrl(app.icon);
                    if (base64) {
                        tasks.push(new Promise(resolve => {
                            compressImageBase64(base64, 256, 0.9, (newBase64) => {
                                app.icon = `url('${newBase64}')`;
                                resolve();
                            });
                        }));
                    }
                }
            });
        }

        Promise.all(tasks).then(() => {
            // show three-dots button; click to expand vertical capsule menu
            preset.sizeMB = calculatePresetSize(preset);
            
            // show three-dots button; click to expand vertical capsule menu
            let finalSizeKB = preset.sizeMB * 1024;
            document.getElementById('detailSize').innerText = finalSizeKB < 1024 ? finalSizeKB.toFixed(2) + ' KB' : preset.sizeMB.toFixed(2) + ' MB';
            
            savePresetData();
            
            showToast('压缩完成');
        });
    }

    function applyCurrentDetailTheme() {
        if (currentDetailPresetId) {
            applyPreset(currentDetailPresetId);
            closePresetDetail();
        }
    }

    function applyPreset(id) {
        const preset = presets.find(p => p.id === id);
        if (!preset) return;

            // show three-dots button; click to expand vertical capsule menu
        applyWallpaperToDesktop(preset.wallpaper);
        saveWallpaperData();

            // show three-dots button; click to expand vertical capsule menu
        if ((preset.pages || preset.desktop) && preset.dock) {
            renderLayout(getPresetPages(preset), preset.dock, preset.currentPage || 0, preset.desktopRows);
        }

        saveLayout();
        
        if (document.getElementById('themeAppUI').classList.contains('show')) {
            loadAppsIntoThemeUI();
        }
        
        showToast("已应用预设主题！");
    }

    function importPreset(event) {
        const file = event.target.files[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onload = function(e) {
            try {
                let importedData = JSON.parse(e.target.result);

                // 兼容数组形式 [ { ... } ]
                if (Array.isArray(importedData)) {
                    importedData = importedData[0];
                }

                // 兼容外部包装对象 { preset: ... } 或 { theme: ... } 或 { data: ... }
                if (importedData && typeof importedData === 'object') {
                    if (importedData.preset && typeof importedData.preset === 'object') {
                        importedData = importedData.preset;
                    } else if (importedData.theme && typeof importedData.theme === 'object') {
                        importedData = importedData.theme;
                    } else if (importedData.data && typeof importedData.data === 'object' && (importedData.data.pages || importedData.data.desktop || importedData.data.dock)) {
                        importedData = importedData.data;
                    }
                }

                if (!importedData || typeof importedData !== 'object') {
                    showCustomAlert('错误', '无效的主题文件！');
                    return;
                }

                // 智能命名兜底：支持 name / title / themeName / 文件名
                const rawName = importedData.name || importedData.title || importedData.themeName || '';
                const fallbackName = (file.name || '').replace(/\.[^/.]+$/, '').trim() || '导入主题';
                importedData.name = (typeof rawName === 'string' && rawName.trim()) ? rawName.trim() : fallbackName;

                // 兼容桌面布局字段 (pages / desktop / desktopGrid / grid / dock)
                const hasDesktopData = Array.isArray(importedData.pages) ||
                                       Array.isArray(importedData.desktop) ||
                                       Array.isArray(importedData.desktopGrid) ||
                                       Array.isArray(importedData.grid) ||
                                       Array.isArray(importedData.dock);

                if (hasDesktopData) {
                    if (!importedData.desktop && (importedData.desktopGrid || importedData.grid)) {
                        importedData.desktop = importedData.desktopGrid || importedData.grid;
                    }

                    const importedPages = getPresetPages(importedData);
                    importedData.pages = importedPages;
                    importedData.desktop = importedPages[0] || [];
                    importedData.currentPage = Math.max(0, Math.min(Number(importedData.currentPage) || 0, importedPages.length - 1));
                    importedData.dock = Array.isArray(importedData.dock) ? importedData.dock : [];
                    importedData.id = Date.now(); // 重新分配ID避免冲突

                    const now = new Date();
                    importedData.date = importedData.date || `${now.getFullYear()}年${String(now.getMonth() + 1).padStart(2, '0')}月${String(now.getDate()).padStart(2, '0')}日`;
                    importedData.sizeMB = calculatePresetSize(importedData);

                    // 保持往后添加，默认主题仍在最前面
                    presets.push(importedData);
                    savePresetData();
                    renderPresets();

                    // 平滑滚动到底部，确保新添加的预设卡片立即进入视野
                    const scrollArea = document.querySelector('.preset-scroll-area');
                    if (scrollArea) {
                        setTimeout(() => {
                            scrollArea.scrollTo({ top: scrollArea.scrollHeight, behavior: 'smooth' });
                        }, 100);
                    }

                    if (typeof showToast === 'function') {
                        showToast('导入成功！');
                    }
                } else {
                    showCustomAlert('错误', '无效的主题文件！未找到桌面布局数据。');
                }
            } catch (err) {
                console.error('导入主题失败:', err);
                showCustomAlert('错误', '解析文件失败，请确保是有效的 JSON 文件！');
            }
        };
        reader.readAsText(file);
        event.target.value = '';
    }

    function exportCurrentUsingTheme(themeName) {
        const layout = captureCurrentDesktopLayout();

        const currentTheme = {
            name: themeName,
            wallpaper: currentWallpaperSrc,
            pages: layout.pages,
            desktop: layout.desktop,
            dock: layout.dock,
            currentPage: layout.currentPage,
            desktopRows: layout.desktopRows
        };

        const jsonString = JSON.stringify(currentTheme, null, 2);
        const blob = new Blob([jsonString], { type: "application/json;charset=utf-8" });
        const url = URL.createObjectURL(blob);
        
        const downloadAnchorNode = document.createElement('a');
        downloadAnchorNode.setAttribute("href", url);
        downloadAnchorNode.setAttribute("download", themeName + ".json");
        document.body.appendChild(downloadAnchorNode);
        downloadAnchorNode.click();
        document.body.removeChild(downloadAnchorNode);
        URL.revokeObjectURL(url);
    }

    function editPresetName() {
        if (!currentDetailPresetId) return;
        const preset = presets.find(p => p.id === currentDetailPresetId);
        if (!preset) return;
        
        showCustomPrompt('编辑主题名称', { placeholder: '输入新的主题名称...', value: preset.name }, '保存').then(newName => {
            if (newName === null) return;
            if (newName.trim() !== "") {
                preset.name = newName.trim();
                document.getElementById('detailName').innerText = preset.name;
                savePresetData();
                renderPresets();
            } else {
                showCustomAlert("提示", "名称不能为空！");
            }
        });
    }

            // show three-dots button; click to expand vertical capsule menu

    let isFontEditMode = false;
 // 存储字体数据
 // 当前选中的字体

            // show three-dots button; click to expand vertical capsule menu
            // show three-dots button; click to expand vertical capsule menu
    const loadedCustomFontFaces = new Map();
    let fontSelectionVersion = 0;
    let requestedFontFamily = 'default';
    let fontSelectionQueue = Promise.resolve();
    let localFontImportPending = false;
    const fontRecoveryKey = 'tonghuaji-font-load-pending-v1';
    const isIOSFontRuntime = /iPad|iPhone|iPod/.test(navigator.userAgent)
        || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);

    // This device-only crash marker contains no font or user data.
    function readFontLoadMarker() {
        try { return localStorage.getItem(fontRecoveryKey) || ''; }
        catch (_) { return 'unavailable'; }
    }

    function writeFontLoadMarker(id) {
        try {
            if (id) localStorage.setItem(fontRecoveryKey, id);
            else localStorage.removeItem(fontRecoveryKey);
        } catch (_) { /* Storage may be disabled in private browsing. */ }
    }

    function releaseCustomFontFaces(keepId = '') {
        for (const [id, face] of loadedCustomFontFaces) {
            if (id === keepId) continue;
            document.fonts.delete(face);
            loadedCustomFontFaces.delete(id);
        }
    }

    async function validateLocalFontBlob(blob) {
        const limit = (isIOSFontRuntime ? 16 : 64) * 1024 * 1024;
        const message = isIOSFontRuntime
            ? '此字体文件或解压后大小超过 iOS 的 16MB 保护上限，请换用精简字库。'
            : '字体文件超过 64MB，请换用较小的字体文件。';
        if (!blob.size || blob.size > limit) throw new Error(message);
        // Read only the header; compressed WOFF files may expand far beyond their file size.
        const header = new DataView(await blob.slice(0, 20).arrayBuffer());
        if (header.byteLength < 12) throw new Error('字体文件不完整，请更换字体文件。');
        const signature = header.getUint32(0);
        if (![0x00010000, 0x4f54544f, 0x74727565, 0x774f4646, 0x774f4632].includes(signature)) {
            throw new Error('文件内容不是支持的 TTF、OTF、WOFF 或 WOFF2 字体。');
        }
        if (signature === 0x774f4646 || signature === 0x774f4632) {
            if (header.byteLength < 20 || !header.getUint32(16)) throw new Error('压缩字体文件不完整。');
            if (header.getUint32(16) > limit) throw new Error(message);
        }
    }

    function normalizeImportedFontUrl(value) {
        const raw = String(value || '').trim();
        if (!raw) return '';
        try {
            const parsed = new URL(raw, window.location.href);
            if (parsed.protocol !== 'http:' && parsed.protocol !== 'https:') return '';
            return parsed.href;
        } catch (error) {
            return '';
        }
    }

    function escapeFontFaceUrl(value) {
        return String(value || '')
            .replace(/\\/g, '\\\\')
            .replace(/"/g, '\\"')
            .replace(/\r?\n/g, '');
    }

    function getRemoteFontCandidates(url) {
        const normalized = normalizeImportedFontUrl(url);
        if (!normalized) return [];
        const candidates = [];
        if (window.location && /^https?:$/.test(window.location.protocol)) {
            candidates.push(window.location.origin + '/api/tools/font-proxy?url=' + encodeURIComponent(normalized));
        }
        candidates.push(normalized);
        return candidates;
    }

    async function loadRemoteFontFace(fontFamily, url) {
        const candidates = getRemoteFontCandidates(url);
        let lastError = null;

        for (const candidate of candidates) {
            try {
                const source = 'url("' + escapeFontFaceUrl(candidate) + '")';
                const loadedFont = await new FontFace(fontFamily, source).load();
                document.fonts.add(loadedFont);
                loadedCustomFontFaces.set(fontFamily, loadedFont);
                return loadedFont;
            } catch (error) {
                lastError = error;
            }
        }

        throw lastError || new Error('No valid font URL');
    }

    async function loadStoredFontFace(font) {
        if (!font) throw new Error('Missing font data');
        if (loadedCustomFontFaces.has(font.id)) return loadedCustomFontFaces.get(font.id);

        if (font.type === 'url') {
            return loadRemoteFontFace(font.id, font.url);
        }

        if (font.type !== 'local' || !font.data) {
            throw new Error('Missing local font data');
        }

        let objectUrl = '';
        try {
            let source = font.data;
            let blob = font.data instanceof Blob ? font.data : null;
            if (!blob && (font.data instanceof ArrayBuffer || ArrayBuffer.isView(font.data))) {
                blob = new Blob([font.data]);
            }
            if (!blob && typeof source === 'string') {
                const dataUrl = source.replace(/^url\(["']?/, '').replace(/["']?\)$/, '');
                if (dataUrl.startsWith('data:')) {
                    const limit = (isIOSFontRuntime ? 16 : 64) * 1024 * 1024;
                    if (dataUrl.length > limit * 1.4 + 1024) throw new Error('旧字体数据过大，请删除后换用精简字库。');
                    blob = await (await fetch(dataUrl)).blob();
                }
            }
            if (blob) {
                await validateLocalFontBlob(blob);
                objectUrl = URL.createObjectURL(blob);
                source = 'url("' + escapeFontFaceUrl(objectUrl) + '")';
            }
            const loadedFont = await new FontFace(font.id, source).load();
            document.fonts.add(loadedFont);
            loadedCustomFontFaces.set(font.id, loadedFont);
            return loadedFont;
        } finally {
            if (objectUrl) URL.revokeObjectURL(objectUrl);
        }
    }

    async function restoreFonts() {
        const selected = currentSelectedFont;
        const interrupted = isIOSFontRuntime && readFontLoadMarker();
        if (interrupted) writeFontLoadMarker('');
        for (const font of customFonts) {
            const num = parseInt(String(font.id).split('_')[1]);
            if (num > customFontCount) customFontCount = num;
            // Build the list without decoding every saved font at startup.
            addFontToList(font.name, font.id, true);
        }
        const targetId = interrupted ? 'default' : selected;
        const targetItem = document.querySelector(`.font-list-item[data-font="${targetId}"]`);
        await selectFont(targetItem ? targetId : 'default', targetItem, true);
        if (interrupted) {
            void saveFontData({ skipAutoBackup: true });
            if (typeof showToast === 'function') showToast('上次字体加载未完成，已恢复系统字体；原字体仍保留在主题中。');
        }

        const fontRequest = db.transaction([storeName], "readonly").objectStore(storeName).get("fontData");
        fontRequest.onsuccess = (e) => {
            const fData = e.target.result;
            if (fData && fData.size) {
                document.getElementById('fontSizeSlider').value = fData.size;
                updateFontSize(true);
            }
        };
    }

    function toggleFontEditMode() {
        isFontEditMode = !isFontEditMode;
        const topRightBtn = document.getElementById('topRightBtn');
        const previewText = document.getElementById('fontPreviewText');
        const fontList = document.getElementById('fontListContainer');

        if (isFontEditMode) {
            topRightBtn.innerText = 'Done';
            topRightBtn.style.color = '#ff3b30';
            previewText.contentEditable = "true";
            previewText.classList.add('editable');
            fontList.classList.add('font-edit-mode');
        } else {
            topRightBtn.innerText = 'Edit';
            topRightBtn.style.color = '#000';
            previewText.contentEditable = "false";
            previewText.classList.remove('editable');
            fontList.classList.remove('font-edit-mode');
        }
    }

    function updateFontSize(isRestore = false) {
        const size = document.getElementById('fontSizeSlider').value;
        document.getElementById('fontPreviewText').style.fontSize = size + 'px';

            // show three-dots button; click to expand vertical capsule menu
        const scale = size / 18;
        
        let styleTag = document.getElementById('dynamic-global-font-size');
        if (!styleTag) {
            styleTag = document.createElement('style');
            styleTag.id = 'dynamic-global-font-size';
            document.head.appendChild(styleTag);
        }
        
            // show three-dots button; click to expand vertical capsule menu
        styleTag.textContent = `
            .app-name { font-size: ${12 * scale}px !important; }
            .theme-app-name-input { font-size: ${13 * scale}px !important; }
            .font-item-title, .font-name-text { font-size: ${16 * scale}px !important; }
            .font-item-subtitle, .font-preview-subtext { font-size: ${13 * scale}px !important; }
            .preset-name { font-size: ${12 * scale}px !important; }
            .card-title { font-size: ${16 * scale}px !important; }
            .info-title { font-size: ${15 * scale}px !important; }
            .info-desc { font-size: ${13 * scale}px !important; }
            .detail-title { font-size: ${17 * scale}px !important; }
            .info-name { font-size: ${22 * scale}px !important; }
            .save-preset-btn { font-size: ${15 * scale}px !important; }
        `;
        window.dispatchEvent(new Event('app-font-change'));

        if (!isRestore) {
            saveFontData({ skipAutoBackup: true }); // Persist the setting without a full backup on every slider event.
        }
    }

    function selectFont(fontFamily, element, isRestore = false) {
        if (isFontEditMode) return Promise.resolve(false);
        const version = ++fontSelectionVersion;
        requestedFontFamily = fontFamily;
        const task = fontSelectionQueue.then(() => performFontSelection(fontFamily, element, isRestore, version));
        fontSelectionQueue = task.catch(error => {
            console.error('Font selection failed:', error);
            return false;
        });
        return fontSelectionQueue;
    }

    async function performFontSelection(fontFamily, element, isRestore, version) {
        if (version !== fontSelectionVersion) return false;
        if (fontFamily !== 'default' && !loadedCustomFontFaces.has(fontFamily)) {
            const font = customFonts.find(item => item.id === fontFamily);
            if (!font) return false;
            // Remove the old face before decoding a replacement on memory-constrained iOS.
            if (isIOSFontRuntime) {
                applySelectedFont('default', null, true);
                releaseCustomFontFaces();
                writeFontLoadMarker(fontFamily);
            }
            try {
                await loadStoredFontFace(font);
            } catch (error) {
                if (version !== fontSelectionVersion) return false;
                writeFontLoadMarker('');
                applySelectedFont('default', document.querySelector('.font-list-item[data-font="default"]'), false);
                showCustomAlert('字体未启用', error.message || '字体加载失败，请更换字体。');
                return false;
            }
        }
        if (version !== fontSelectionVersion) {
            // A later tap owns the selection; discard this late load.
            const face = loadedCustomFontFaces.get(fontFamily);
            if (face && currentSelectedFont !== fontFamily) {
                document.fonts.delete(face);
                loadedCustomFontFaces.delete(fontFamily);
            }
            return false;
        }
        applySelectedFont(fontFamily, element, isRestore);
        releaseCustomFontFaces(fontFamily);
        if (isIOSFontRuntime && fontFamily !== 'default') {
            // Keep the marker through layout/painting, where native font crashes can occur.
            setTimeout(() => {
                if (version === fontSelectionVersion) writeFontLoadMarker('');
            }, 3000);
        } else writeFontLoadMarker('');
        return true;
    }

    function applySelectedFont(fontFamily, element, isRestore = false) {
        document.querySelectorAll('#fontListContainer .font-list-item').forEach(el => el.classList.remove('active'));
        if (element) element.classList.add('active');

        currentSelectedFont = fontFamily;
        if (!isRestore) saveFontData({ skipAutoBackup: true }); // Persist the selection without a full backup.

        const previewBox = document.getElementById('globalFontPreview');
        
        const defaultFontStack = '\"PingFang SC\", \"PingFang TC\", -apple-system, BlinkMacSystemFont, \"Helvetica Neue\", \"Microsoft YaHei\", sans-serif';
        const fontStack = fontFamily === 'default' ? defaultFontStack : `\"${fontFamily}\", ${defaultFontStack}`;
        if (previewBox) previewBox.style.fontFamily = fontStack;
        document.documentElement.style.setProperty('--app-global-font-family', fontStack);
        if (typeof window.syncAllWidgetFonts === 'function') {
            window.syncAllWidgetFonts();
        }
        window.dispatchEvent(new Event('app-font-change'));
    }

    // Share the existing font library and validated loader with the meeting document.
    window.getMeetingFontSettings = () => ({
        family: currentSelectedFont || 'default',
        size: Number(document.getElementById('fontSizeSlider')?.value) || 18,
        choices: [{ id: 'default', name: '系统默认（苹方）' },
            ...customFonts.map(font => ({ id: font.id, name: font.name }))]
    });
    window.loadMeetingFontFace = family => {
        const task = fontSelectionQueue.then(async () => {
            if (family === 'default') return null;
            const font = customFonts.find(item => item.id === family);
            if (!font) throw new Error('此字体已移除，请重新选择');
            // Reuse an already decoded face instead of decoding a second copy in the iframe.
            const meetingFonts = document.getElementById('meetingAppFrame')?.contentDocument?.fonts;
            if (meetingFonts) {
                for (const face of meetingFonts) {
                    if (face.family.replace(/^['"]|['"]$/g, '') === family && face.status === 'loaded') return face;
                }
            }
            const face = await loadStoredFontFace(font);
            if (currentSelectedFont !== family) {
                document.fonts.delete(face);
                loadedCustomFontFaces.delete(family);
            }
            return face;
        });
        fontSelectionQueue = task.catch(() => {});
        return task;
    };
    window.dispatchEvent(new Event('app-font-change'));

    function addFontToList(fontName, fontFamily, isRestore = false) {
        const fontList = document.getElementById('fontListContainer');
        const newItem = document.createElement('div');
        newItem.className = 'font-list-item font-item-padding';
        newItem.setAttribute('data-font', fontFamily);
        newItem.onclick = function(e) { 
            if(e.target.closest('.delete-font-btn') || e.target.closest('.font-swipe-btn')) return;
            if(this.classList.contains('swiped')) {
                this.querySelector('.font-item-inner').style.transform = 'translateX(0)';
                this.classList.remove('swiped');
                currentFontSwipeItem = null;
                return;
            }
            selectFont(fontFamily, this); 
        };
        
        const swipeActions = document.createElement('div');
        swipeActions.className = 'font-swipe-actions';
        const editButton = document.createElement('div');
        editButton.className = 'font-swipe-btn font-swipe-edit';
        editButton.textContent = '编辑';
        editButton.addEventListener('click', () => openEditFontModal(fontFamily));
        const deleteSwipeButton = document.createElement('div');
        deleteSwipeButton.className = 'font-swipe-btn font-swipe-delete';
        deleteSwipeButton.textContent = '删除';
        deleteSwipeButton.addEventListener('click', () => deleteFont(deleteSwipeButton, fontFamily));
        swipeActions.append(editButton, deleteSwipeButton);

        const itemInner = document.createElement('div');
        itemInner.className = 'font-item-inner';
        const content = document.createElement('div');
        content.className = 'font-item-content';
        const name = document.createElement('div');
        name.className = 'font-name-text';
        name.style.fontFamily = fontFamily;
        name.textContent = fontName;
        const preview = document.createElement('div');
        preview.className = 'font-preview-subtext';
        preview.style.fontFamily = fontFamily;
        preview.textContent = 'The quick brown fox / 探索宇宙';
        content.append(name, preview);

        const checkmark = document.createElement('div');
        checkmark.className = 'font-checkmark';
        checkmark.innerHTML = '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>';
        const deleteButton = document.createElement('div');
        deleteButton.className = 'delete-font-btn';
        deleteButton.innerHTML = '<svg viewBox="0 0 24 24" fill="none" stroke-linecap="round" stroke-linejoin="round"><line x1="5" y1="12" x2="19" y2="12"></line></svg>';
        deleteButton.addEventListener('click', () => deleteFont(deleteButton, fontFamily));
        itemInner.append(content, checkmark, deleteButton);
        newItem.append(swipeActions, itemInner);
        fontList.appendChild(newItem);
        
        if (!isRestore) {
            void selectFont(fontFamily, newItem);
        }
    }

    function deleteFont(btnElement, fontFamily) {
        const listItem = btnElement.closest('.font-list-item');
        const isActive = listItem.classList.contains('active');
        listItem.remove();

            // show three-dots button; click to expand vertical capsule menu
        customFonts = customFonts.filter(f => f.id !== fontFamily);
        if (requestedFontFamily === fontFamily || isActive) {
            ++fontSelectionVersion;
            requestedFontFamily = 'default';
        }
        const face = loadedCustomFontFaces.get(fontFamily);
        if (face) document.fonts.delete(face);
        loadedCustomFontFaces.delete(fontFamily);
        if (readFontLoadMarker() === fontFamily) writeFontLoadMarker('');
        if (isActive) {
            const defaultItem = document.querySelector('#fontListContainer .font-list-item[data-font="default"]');
            applySelectedFont('default', defaultItem, true);
        }
        saveFontData({ skipAutoBackup: true });
    }

    async function handleLocalFont(event) {
        const input = event.target;
        const file = input && input.files ? input.files[0] : null;
        if (!file) return;

        input.value = '';

        const extension = (file.name.split('.').pop() || '').toLowerCase();
        if (!['ttf', 'otf', 'woff', 'woff2'].includes(extension)) {
            showCustomAlert('错误', '请选择 TTF、OTF、WOFF 或 WOFF2 字体文件！');
            return;
        }

        if (!file.size) {
            showCustomAlert('错误', '字体文件为空，无法导入！');
            return;
        }

        if (localFontImportPending) return;
        localFontImportPending = true;
        let fontFamily = '';
        let imported = false;
        try {
            const fontBlob = file.slice(0, file.size, file.type || 'application/octet-stream');
            await validateLocalFontBlob(fontBlob);
            const nextFontCount = customFontCount + 1;
            fontFamily = `CustomFont_${nextFontCount}`;
            const fontName = file.name.replace(/\.[^/.]+$/, '') || `本地字体 ${nextFontCount}`;
            customFontCount = nextFontCount;
            customFonts.push({ id: fontFamily, name: fontName, type: 'local', data: fontBlob, mimeType: fontBlob.type || '' });
            imported = true;
            // Finish the Blob write before allocating the native decoded font.
            const saved = await saveFontData({ skipAutoBackup: true });
            if (!saved) throw new Error('字体保存失败，请检查设备存储空间后重试。');
            addFontToList(fontName, fontFamily, true);
            const item = document.querySelector(`.font-list-item[data-font="${fontFamily}"]`);
            await selectFont(fontFamily, item);
        } catch (error) {
            if (imported) {
                customFonts = customFonts.filter(font => font.id !== fontFamily);
                void saveFontData({ skipAutoBackup: true });
            }
            showCustomAlert('字体导入失败', error.message || '请检查文件是否损坏或更换字体。');
            console.error('Local font import failed:', error);
        } finally {
            localFontImportPending = false;
        }
    }

    function openUrlFontModal() {
        showCustomPrompt('导入字体', [
            { placeholder: '输入字体名称 (选填)' },
            { placeholder: 'https://...' }
        ], '安装').then(async res => {
            if (res === null) return;

            const values = Array.isArray(res) ? res : ['', res];
            let fontName = String(values[0] || '').trim();
            const url = normalizeImportedFontUrl(values[1]);

            if (!url) {
                showCustomAlert('提示', '请输入有效的 http/https 字体 URL！');
                return;
            }

            const nextFontCount = customFontCount + 1;
            const fontFamily = `UrlFont_${nextFontCount}`;
            if (!fontName) fontName = `网络字体 ${nextFontCount}`;

            try {
                customFontCount = nextFontCount;
                customFonts.push({ id: fontFamily, name: fontName, type: 'url', url: url });
                const saved = await saveFontData({ skipAutoBackup: true });
                if (!saved) {
                    customFonts = customFonts.filter(font => font.id !== fontFamily);
                    throw new Error('Failed to persist remote font');
                }
                addFontToList(fontName, fontFamily);
            } catch (error) {
                showCustomAlert('错误', '字体加载失败。请确认链接可访问并直接返回 TTF、OTF、WOFF 或 WOFF2 字体文件。');
                console.error('URL 字体导入失败:', error);
            }
        });
    }

            // show three-dots button; click to expand vertical capsule menu
    let fontTouchStartX = 0;
    let currentFontSwipeItem = null;
    let currentEditFontId = null;

    document.addEventListener('touchstart', function(e) {
        const item = e.target.closest('#fontListContainer .font-list-item');
        if (item && !isFontEditMode && item.getAttribute('data-font') !== 'default') {
            fontTouchStartX = e.touches[0].clientX;
            if (currentFontSwipeItem && currentFontSwipeItem !== item) {
                currentFontSwipeItem.querySelector('.font-item-inner').style.transform = 'translateX(0)';
                currentFontSwipeItem.classList.remove('swiped');
                currentFontSwipeItem = null;
            }
        } else if (currentFontSwipeItem) {
            currentFontSwipeItem.querySelector('.font-item-inner').style.transform = 'translateX(0)';
            currentFontSwipeItem.classList.remove('swiped');
            currentFontSwipeItem = null;
        }
    });

    document.addEventListener('touchmove', function(e) {
        if (!fontTouchStartX) return;
        const item = e.target.closest('#fontListContainer .font-list-item');
        if (item && !isFontEditMode && item.getAttribute('data-font') !== 'default') {
            const touchCurrentX = e.touches[0].clientX;
            const diff = touchCurrentX - fontTouchStartX;
            if (diff < -30) { // 左滑展开
                if (e.cancelable) e.preventDefault();
                item.querySelector('.font-item-inner').style.transform = 'translateX(-130px)';
                item.classList.add('swiped');
                currentFontSwipeItem = item;
            } else if (diff > 30 && currentFontSwipeItem === item) { // 右滑收起
                if (e.cancelable) e.preventDefault();
                item.querySelector('.font-item-inner').style.transform = 'translateX(0)';
                item.classList.remove('swiped');
                currentFontSwipeItem = null;
            }
        }
    }, { passive: false });

    document.addEventListener('touchend', function(e) {
        fontTouchStartX = 0;
    });

    function openEditFontModal(fontId) {
        currentEditFontId = fontId;
        const fontData = customFonts.find(f => f.id === fontId);
        if (!fontData) return;
        
        if (currentFontSwipeItem) {
            currentFontSwipeItem.querySelector('.font-item-inner').style.transform = 'translateX(0)';
            currentFontSwipeItem.classList.remove('swiped');
            currentFontSwipeItem = null;
        }

        showCustomPrompt('编辑字体名称', { placeholder: '输入新的字体名称...', value: fontData.name }, '保存').then(newName => {
            if (newName === null) {
                currentEditFontId = null;
                return;
            }
            if (newName.trim() !== "") {
                fontData.name = newName.trim();
                saveFontData();
                const listItem = document.querySelector(`.font-list-item[data-font="${currentEditFontId}"]`);
                if (listItem) {
                    const nameEl = listItem.querySelector('.font-name-text');
                    if (nameEl) nameEl.innerText = fontData.name;
                }
                currentEditFontId = null;
            } else {
                showCustomAlert("提示", "名称不能为空！");
                currentEditFontId = null;
            }
        });
    }

            // show three-dots button; click to expand vertical capsule menu


