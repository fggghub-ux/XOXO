{
    const icityProCrownSvg = (className, size) => {
        const crownPaths = '<path d="M149.051 553.387c15.918-141.372 174.609-252.783 368.405-252.783 193.802 0 352.493 111.411 368.407 252.783H149.051z m0 0" fill="#ED462B"></path><path d="M517.456 838.934V183.573s-52.428 346.406-229.375 346.406c-137.625 0-177.883-135.754-177.883-135.754l88.942 444.709h318.316z m0 0" fill="#FFD821"></path><path d="M517.456 838.934V183.573s52.431 346.406 229.376 346.406c137.629 0 177.887-135.754 177.887-135.754l-88.945 444.709H517.456z m0 0" fill="#FFAA29"></path><path d="M423.836 623.6c0 51.709 41.914 93.625 93.62 93.625 51.708 0 93.626-41.916 93.626-93.625 0-51.707-41.918-93.621-93.626-93.621-51.706 0-93.62 41.914-93.62 93.621z m0 0" fill="#ED462B"></path><path d="M243.61 848.295h547.695c24.34 0 44.469 20.129 44.469 44.473 0 24.34-20.129 44.469-44.469 44.469H243.61c-24.34 0-44.469-20.129-44.469-44.469 0-24.344 20.129-44.473 44.469-44.473z m0 0" fill="#F2C907"></path><path d="M63.387 426.995c0 31.023 25.148 56.172 56.172 56.172 31.027 0 56.176-25.149 56.176-56.172 0-31.027-25.149-56.176-56.176-56.176-31.024 0-56.172 25.149-56.172 56.176z m0 0" fill="#FFC000"></path><path d="M859.18 426.995c0 31.023 25.152 56.172 56.176 56.172s56.172-25.149 56.172-56.172a56.175 56.175 0 0 0-28.086-48.648 56.163 56.163 0 0 0-56.172 0 56.17 56.17 0 0 0-28.09 48.648z m0 0M451.922 183.573a65.539 65.539 0 0 0 98.305 56.758 65.535 65.535 0 0 0 32.766-56.758c0-36.195-29.34-65.535-65.536-65.535-36.195 0-65.535 29.34-65.535 65.535z m0 0" fill="#FFC000"></path><path d="M517.456 529.979V623.6h-93.62l93.62-93.621z m0 0" fill="#FFC2B4"></path>';
        const identity = className === 'crown-icon' ? ' id="btn-profile-top-crown" style="cursor: pointer;"' : '';
        return '<svg xmlns="http://www.w3.org/2000/svg" class="icity-pro-crown-svg ' + className + '"' + identity + ' viewBox="0 0 1024 1024" width="' + size + '" height="' + size + '" role="img" aria-label="Pro 皇冠">' + crownPaths + '</svg>';
    };
    const icityHTML = `<div class="icity-new-app-wrapper" id="icityNewAppUI" style="display: none; position: fixed; inset: 0; z-index: 1800; background-color: #EFEFF4;">
    <div class="icity-app-inner-container" style="width: 100%; max-width: 430px; height: 100%; margin: 0 auto; background-color: #F1EFEF; position: relative; display: flex; flex-direction: column; box-shadow: 0 0 20px rgba(0,0,0,0.05); overflow: hidden;">

        <!-- ================= 视图 0：微信账号登录页 (原图星空 + 地球风) ================= -->
        <div id="view-bind-account" class="view-container icity-star-login-view" style="position: absolute; inset: 0; z-index: 50; overflow: hidden; background: linear-gradient(180deg, #121829 0%, #1a2544 35%, #253966 70%, #2f4b82 100%);">
            <!-- 顶部返回/关闭按钮 -->
            <header style="width: 100%; display: flex; align-items: center; justify-content: space-between; padding: calc(12px + var(--icity-top-safe-offset, 0px)) 18px 0; z-index: 20; position: absolute; top: 0; left: 0; box-sizing: border-box;">
                <div id="btn-back-bind-account" onclick="closeICityApp()" style="cursor: pointer; display: flex; align-items: center; justify-content: center; width: 36px; height: 36px; color: #FFFFFF;">
                    <svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" stroke-width="2.2" fill="none" stroke-linecap="round" stroke-linejoin="round"><polyline points="15 18 9 12 15 6"></polyline></svg>
                </div>
            </header>

            <main class="content-scroll" style="padding: calc(64px + var(--icity-top-safe-offset, 0px)) 26px 40px; display: flex; flex-direction: column; align-items: center; position: relative; z-index: 10; min-height: 100%; box-sizing: border-box;">
                <!-- 顶部纯白巨幅 Logo -->
                <div class="icity-login-logo-title" style="font-size: 54px; font-weight: 800; color: #FFFFFF; letter-spacing: -1.5px; text-shadow: 0 4px 16px rgba(0,0,0,0.3); margin-top: 10px; line-height: 1;">Diary</div>
                <div class="icity-login-logo-sub" style="font-size: 17px; font-weight: 600; color: #FFFFFF; letter-spacing: 2px; margin-top: 10px; margin-bottom: 30px; text-shadow: 0 2px 8px rgba(0,0,0,0.25);">Diary 快捷登录</div>

                <!-- 账号选择胶囊卡片容器 -->
                <div id="bind-account-list-container" style="width: 100%; display: flex; flex-direction: column; gap: 14px; margin-bottom: 16px;"></div>

                <!-- 绿色大胶囊操作按钮 -->
                <button type="button" id="btn-quick-login-action" style="width: 100%; height: 50px; border-radius: 25px; background: #25C85A; color: #FFFFFF; font-size: 18px; font-weight: 700; border: none; outline: none; box-shadow: 0 6px 20px rgba(37,200,90,0.35); cursor: pointer; display: flex; align-items: center; justify-content: center; letter-spacing: 2px;">
                    快捷登录
                </button>
            </main>

            <!-- 底部萌系卡通地球与白云浮层 -->
            <div class="icity-cartoon-earth-bg" style="position: absolute; bottom: -180px; left: 50%; transform: translateX(-50%); width: 560px; height: 420px; border-radius: 50%; pointer-events: none; z-index: 1;">
                <div class="earth-ocean" style="width: 100%; height: 100%; border-radius: 50%; background: linear-gradient(180deg, #4491E0 0%, #2A6DB5 100%); position: relative; overflow: hidden; box-shadow: 0 -10px 40px rgba(42,109,181,0.3);">
                    <!-- 陆地色块 -->
                    <div style="position: absolute; top: 30px; left: 160px; width: 140px; height: 110px; background: #8BC34A; border-radius: 40% 60% 70% 30% / 40% 50% 60% 50%; opacity: 0.95;"></div>
                    <div style="position: absolute; top: 70px; right: 110px; width: 150px; height: 130px; background: #7CB342; border-radius: 60% 40% 50% 50% / 50% 60% 40% 60%; opacity: 0.95;"></div>
                    <div style="position: absolute; top: 110px; left: 210px; width: 100px; height: 80px; background: #9CCC65; border-radius: 50%; opacity: 0.9;"></div>
                </div>
                <!-- 卡通云朵 -->
                <div class="earth-cloud cloud-1" style="position: absolute; top: -14px; left: 100px; width: 84px; height: 32px; background: #FFFFFF; border-radius: 20px; box-shadow: 0 6px 16px rgba(0,0,0,0.15); opacity: 0.96;">
                    <div style="position: absolute; top: -14px; left: 18px; width: 34px; height: 34px; background: #FFFFFF; border-radius: 50%;"></div>
                    <div style="position: absolute; top: -8px; left: 40px; width: 26px; height: 26px; background: #FFFFFF; border-radius: 50%;"></div>
                </div>
                <div class="earth-cloud cloud-2" style="position: absolute; top: 12px; right: 120px; width: 96px; height: 36px; background: #FFFFFF; border-radius: 20px; box-shadow: 0 6px 16px rgba(0,0,0,0.15); opacity: 0.96;">
                    <div style="position: absolute; top: -16px; left: 24px; width: 40px; height: 40px; background: #FFFFFF; border-radius: 50%;"></div>
                    <div style="position: absolute; top: -10px; left: 52px; width: 28px; height: 28px; background: #FFFFFF; border-radius: 50%;"></div>
                </div>
            </div>
        </div>

        <!-- ================= 视图 1：主页 ================= -->
        <div id="view-home" class="view-container active">
            <header class="header-home">
                <div class="header-title" onclick="closeICityApp()" style="cursor: pointer;">Diary · 我的日记</div>
                <div class="header-icons">
                    <!-- 1. 收件盘 + 内部数字1 -->
                    <svg viewBox="0 0 24 24" style="fill: currentColor; stroke: none;">
                        <path fill-rule="evenodd" d="M6.912 3a3 3 0 0 0-2.868 2.118l-2.411 7.838a3 3 0 0 0-.133.882V18a3 3 0 0 0 3 3h15a3 3 0 0 0 3-3v-4.162c0-.299-.045-.596-.133-.882l-2.412-7.838A3 3 0 0 0 17.088 3H6.912Zm13.823 9.75-2.213-7.191A1.5 1.5 0 0 0 17.088 4.5H6.912a1.5 1.5 0 0 0-1.434 1.059L3.265 12.75H6.11a3 3 0 0 1 2.684 1.658l.256.513a1.5 1.5 0 0 0 1.342.829h3.218a1.5 1.5 0 0 0 1.342-.83l.256-.512a3 3 0 0 1 2.684-1.658h2.844Z" clip-rule="evenodd" />
                        <text x="12" y="12.5" font-size="9" font-weight="bold" fill="currentColor" text-anchor="middle" font-family="sans-serif">1</text>
                    </svg>

                    <!-- 2. 搜索/雷达 -->
                    <svg viewBox="0 0 24 24">
                        <circle cx="11" cy="11" r="7"></circle>
                        <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                    </svg>

                    <!-- 3. 日历 + 内部圆润实心五角星 -->
                    <svg id="btn-home-calendar" viewBox="0 0 24 24" style="fill: currentColor; stroke: none; cursor: pointer;">
                        <path fill-rule="evenodd" d="M6.75 2.25A.75.75 0 0 1 7.5 3v1.5h9V3A.75.75 0 0 1 18 3v1.5h.75a3 3 0 0 1 3 3v11.25a3 3 0 0 1-3 3H5.25a3 3 0 0 1-3-3V7.5a3 3 0 0 1 3-3H6V3a.75.75 0 0 1 .75-.75Zm13.5 9a1.5 1.5 0 0 0-1.5-1.5H5.25a1.5 1.5 0 0 0-1.5 1.5v7.5a1.5 1.5 0 0 0 1.5 1.5h13.5a1.5 1.5 0 0 0 1.5-1.5v-7.5Z" clip-rule="evenodd" />
                        <g transform="translate(6, 8.5) scale(0.5)">
                            <path d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z" fill="currentColor"/>
                        </g>
                    </svg>
                </div>
            </header>

            <main class="content-scroll">
                <div class="card-box write-prompt editor-wrapper" id="inline-editor">
                    <div class="collapsed-view">
                        <div class="avatar sync-avatar"></div>
                        <div class="write-text">写点什么</div>
                    </div>

                    <div class="expanded-view">
                        <div class="editor-header">
                            <div class="avatar sync-avatar"></div>
                            <svg class="expand-icon" id="collapse-editor" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M15 3h6v6M9 21H3v-6M21 3l-7 7M3 21l7-7"/></svg>
                        </div>
                        <textarea class="editor-textarea" placeholder="写点什么吧"></textarea>

                        <div class="image-preview-area">
                            <img class="preview-img" src="" alt="预览图">
                            <div class="remove-img-btn">✕</div>
                        </div>
                        <input type="file" class="input-camera" accept="image/*" style="display: none;">

                        <div class="selected-location-display">
                            <svg viewBox="0 0 24 24"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"></path></svg>
                            <span class="location-text-top"></span>
                            <span class="clear-loc-btn">×</span>
                        </div>

                        <div class="editor-footer">
                            <div class="editor-tools">
                                <div class="tool-icon btn-camera">
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
                                        <path stroke-linecap="round" stroke-linejoin="round" d="M6.827 6.175A2.31 2.31 0 0 1 5.186 7.23c-.38.054-.757.112-1.134.175C2.999 7.58 2.25 8.507 2.25 9.574V18a2.25 2.25 0 0 0 2.25 2.25h15A2.25 2.25 0 0 0 21.75 18V9.574c0-1.067-.75-1.994-1.802-2.169a47.865 47.865 0 0 0-1.134-.175 2.31 2.31 0 0 1-1.64-1.055l-.822-1.316a2.192 2.192 0 0 0-1.736-1.039 48.774 48.774 0 0 0-5.232 0 2.192 2.192 0 0 0-1.736 1.039l-.821 1.316Z" />
                                        <path stroke-linecap="round" stroke-linejoin="round" d="M16.5 12.75a4.5 4.5 0 1 1-9 0 4.5 4.5 0 0 1 9 0ZM18.75 10.5h.008v.008h-.008V10.5Z" />
                                    </svg>
                                </div>
                                <div class="tool-icon btn-location">
                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor">
                                        <path d="M8 3.52003125c-2.1554625 -0.00009375 -3.50260625 2.3332 -2.42495625 4.1999375 1.07764375 1.86673125 3.771975 1.86685 4.8497875 0.00021875 0.24579375 -0.4256875 0.3752 -0.908575 0.3752 -1.400125 0 -1.5464625 -1.25356875 -2.8001 -2.80003125 -2.80003125Zm0 4.48005c-1.293275 0.00005625 -2.1015625 -1.399925 -1.454975 -2.5199625 0.6465875 -1.1200375 2.2631875 -1.1201125 2.909875 -0.00013125 0.147475 0.2554125 0.22511875 0.54514375 0.22511875 0.840075 0 0.92781875 -0.7522 1.679975 -1.68001875 1.68001875ZM8 0.16c-3.40050625 0.00385625 -6.15620625 2.75955625 -6.1600625 6.1600625 0 2.19801875 1.0157125 4.52764375 2.94003125 6.73756875 0.8646625 0.99860625 1.8378375 1.89781875 2.90153125 2.681025 0.1928875 0.135125 0.4497125 0.135125 0.64260625 0 1.06173125 -0.78353125 2.0330125 -1.6827375 2.895925 -2.681025 1.92151875 -2.209925 2.94003125 -4.53955 2.94003125 -6.73756875C14.15620625 2.91955625 11.40050625 0.16385625 8 0.16Zm0 14.42014375c-1.1571125 -0.91000625 -5.04005 -4.25254375 -5.04005 -8.26008125 0 -3.87983125 4.20004375 -6.30473125 7.560075 -4.3648125 1.5594 0.90031875 2.520025 2.564175 2.520025 4.3648125 0 4.0061375 -3.8829375 7.350075 -5.04005 8.26008125Z" stroke-width="0.0625"></path>
                                    </svg>
                                </div>
                                <div class="tool-icon btn-diary">
                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="-0.5 -0.5 16 16" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round">
                                        <path d="M2.5 12.1875A1.5625 1.5625 0 0 1 4.0625 10.625H12.5" stroke-width="1"></path>
                                        <path d="M4.0625 1.25H12.5v12.5H4.0625A1.5625 1.5625 0 0 1 2.5 12.1875v-9.375A1.5625 1.5625 0 0 1 4.0625 1.25z" stroke-width="1"></path>
                                    </svg>
                                    <span class="display-diary"></span>
                                </div>
                            </div>
                            <div class="editor-actions">
                                <span class="public-status">
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
                                      <path stroke-linecap="round" stroke-linejoin="round" d="M12 21a9.004 9.004 0 0 0 8.716-6.747M12 21a9.004 9.004 0 0 1-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 0 1 7.843 4.582M12 3a8.997 8.997 0 0 0-7.843 4.582m15.686 0A11.953 11.953 0 0 1 12 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0 1 21 12c0 .778-.099 1.533-.284 2.253m0 0A17.919 17.919 0 0 1 12 16.5c-3.162 0-6.133-.815-8.716-2.247m0 0A9.015 9.015 0 0 1 3 12c0-1.605.42-3.113 1.157-4.418" />
                                    </svg>
                                    公开
                                </span>
                                <button class="send-btn btn-send">
                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" height="16" width="16">
                                      <path d="M15.413215625 0.33158125c0.309246875 0.21433125 0.471525 0.584815625 0.41335 0.955303125l-1.95959375 12.737359375c-0.045928125 0.297 -0.226578125 0.557259375 -0.489896875 0.704228125s-0.57869375 0.165340625 -0.857321875 0.048990625l-3.661990625 -1.521746875 -2.097378125 2.268840625c-0.27250625 0.297003125 -0.70116875 0.39498125 -1.077778125 0.2480125s-0.621559375 -0.51133125 -0.621559375 -0.915496875v-2.559721875c0 -0.122475 0.045928125 -0.238825 0.1286 -0.32761875l5.1316875 -5.60015c0.1775875 -0.1929 0.1714625 -0.4899 -0.01225 -0.6736125s-0.4807125 -0.195959375 -0.673609375 -0.02143125L3.407640625 11.207328125l-2.703628125 -1.353346875C0.37945625 9.691703125 0.17125 9.367146875 0.1620625 9.005846875s0.18065 -0.69810625 0.4929625 -0.87875625l13.71715625 -7.838375c0.32761875 -0.186775 0.731784375 -0.168403125 1.041034375 0.042865625Z" fill="currentColor" stroke-width="0.0313"></path>
                                    </svg>
                                    发送
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="card-box monthly-record">
                    <span class="record-tag" id="icity-home-month-label">本月记录</span>
                    <span class="record-text" id="icity-home-month-text">本月大事记、心情、感受...</span>
                    <svg class="record-arrow" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <polyline points="9 18 15 12 9 6"></polyline>
                    </svg>
                </div>

                <div class="card-box" id="home-feed"></div>
            </main>
        </div>

        <!-- ================= 视图 2：世界 ================= -->
        <div id="view-world" class="view-container">
            <header class="top-tabs-wrapper">
                <div class="segmented-control">
                    <div class="segment-btn" id="tab-world-all">世界</div>
                    <div class="segment-btn active" id="tab-world-friends">朋友</div>
                    <div class="segment-btn" id="tab-world-notices"><span style="font-weight: 700; font-size: 16px;">@</span> 通知</div>
                    <div class="segment-btn" id="tab-world-likes">
                        <svg viewBox="0 0 24 24" style="width: 15px; height: 15px; fill: none; stroke: currentColor; stroke-width: 2.5; stroke-linecap: round; stroke-linejoin: round; transform: translateY(1px);">
                            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
                        </svg>
                        喜欢
                    </div>
                </div>
            </header>

            <main class="content-scroll">
                <div id="content-world-all" style="display: none;">
                    <div class="card-box" style="padding: 30px; text-align: center; color: var(--text-light);">世界日记流</div>
                </div>
                <div id="content-world-friends" style="display: block;">
                    <div class="card-box" id="world-feed"></div>
                </div>
                <div id="content-world-notices" style="display: none;">
                    <div class="card-box" style="padding: 30px; text-align: center; color: var(--text-light);">暂无通知</div>
                </div>
                <div id="content-world-likes" style="display: none;">
                    <div class="card-box" style="padding: 30px; text-align: center; color: var(--text-light);">暂无喜欢</div>
                </div>
            </main>
        </div>

        <!-- ================= 视图 3：通讯录/私信 ================= -->
        <div id="view-message" class="view-container">
            <header class="top-tabs-wrapper">
                <div class="segmented-control">
                    <div class="segment-btn active" id="tab-msg-contacts">通讯录</div>
                    <div class="segment-btn" id="tab-msg-dms">私信</div>
                </div>
                <div class="header-right-icon">
                    <svg id="icon-msg-contacts" viewBox="0 0 24 24" style="display: block; width: 24px; height: 24px;">
                        <circle cx="9" cy="8" r="4" fill="currentColor"></circle>
                        <path d="M9 14c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" fill="currentColor"></path>
                        <line x1="19" y1="8" x2="19" y2="14" stroke="currentColor" stroke-width="2" stroke-linecap="round"></line>
                        <line x1="22" y1="11" x2="16" y2="11" stroke="currentColor" stroke-width="2" stroke-linecap="round"></line>
                    </svg>
                    <svg id="icon-msg-dms" viewBox="0 0 16 16" style="display: none; width: 22px; height: 22px; fill: none; stroke: currentColor; stroke-width: 1.2; stroke-linejoin: round;">
                        <path d="M3.638513333333333 12.123133333333332C2.239333333333333 11.117999999999999 1.3339866666666667 9.600066666666667 1.3339866666666667 7.938533333333333c0 -3.0564199999999997 2.983533333333333 -5.538466666666666 6.6666799999999995 -5.538466666666666 3.683133333333333 0 6.666666666666666 2.4820466666666663 6.666666666666666 5.538466666666666 0 3.0564 -2.983533333333333 5.538466666666666 -6.666666666666666 5.538466666666666 -0.7613333333333332 0 -1.5020733333333331 -0.1026 -2.1810866666666664 -0.3077333333333333 -0.061726666666666666 -0.020466666666666668 -0.14403333333333332 -0.020466666666666668 -0.20576 -0.020466666666666668 -0.12345999999999999 0 -0.24691333333333332 0.040999999999999995 -0.3497933333333333 0.10253333333333332l-1.4609066666666666 0.8410666666666666c-0.04115333333333333 0.020466666666666668 -0.08230666666666667 0.040999999999999995 -0.12345333333333333 0.040999999999999995 -0.12345999999999999 0 -0.22633999999999999 -0.10253333333333332 -0.22633999999999999 -0.22566666666666668 0 -0.06153333333333333 0.020573333333333332 -0.10253333333333332 0.04115333333333333 -0.16406666666666667 0.020573333333333332 -0.020533333333333334 0.20576 -0.6974666666666667 0.30863999999999997 -1.1077333333333332 0 -0.040999999999999995 0.020573333333333332 -0.10253333333333332 0.020573333333333332 -0.14353333333333332 0 -0.16413333333333333 -0.061726666666666666 -0.2872 -0.18518 -0.36926666666666663Z"></path>
                        <path d="M8 5v6M5 8h6" stroke-linecap="round"></path>
                    </svg>
                </div>
            </header>

            <main class="content-scroll">
                <div id="content-msg-contacts" style="display: block;">
                    <div class="diary-books-scroll">
                        <div class="diary-book-card diary-new" id="btn-create-diary" style="cursor: pointer;">
                            <div class="plus-icon">+</div>
                            <div class="text">新建<br>日记本</div>
                        </div>
                    </div>

                    <!-- 市民好友列表板块 (纯正 Diary 卡片风格) -->
                    <div class="card-box" id="contacts-friends-section" style="padding: 14px 16px; margin-bottom: 8px;">
                        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 6px;">
                            <div style="font-size: 15px; font-weight: 700; color: var(--text-main);">市民好友</div>
                            <div style="font-size: 12px; color: var(--text-light);" id="contacts-friends-count">0 位市民</div>
                        </div>
                        <div id="contacts-friends-list" style="display: flex; flex-direction: column;">
                            <div style="font-size: 13px; color: var(--text-light); text-align: center; padding: 16px 0;">暂无市民好友，点击右上角添加市民</div>
                        </div>
                    </div>

                    <div class="card-box qa-section" id="btn-open-qa" style="cursor: pointer;">
                        <div class="qa-header">
                            <div class="qa-title">我的 Q&A 问答</div>
                            <div class="qa-percent">0%</div>
                        </div>

                        <div class="qa-icons">
                            <div class="qa-icon-circle" style="background-color: #4DB6AC;">
                                <svg viewBox="0 0 24 24" fill="white" width="20" height="20"><path d="M18 4l2 4h-3l-2-4h-2l2 4h-3l-2-4H8l2 4H7L5 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V4h-4z"/></svg>
                            </div>
                            <div class="qa-icon-circle" style="background-color: #7986CB;">
                                <svg viewBox="0 0 24 24" fill="white" width="20" height="20"><path d="M18 2H6c-1.1 0-2 .9-2 2v16c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zM6 4h5v8l-2.5-1.5L6 12V4z"/></svg>
                            </div>
                            <div class="qa-icon-circle" style="background-color: #FFB74D;">
                                <svg viewBox="0 0 24 24" fill="white" width="20" height="20"><path d="M12 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h4V3h-6z"/></svg>
                            </div>
                            <div class="qa-icon-circle" style="background-color: #81C784;">
                                <svg viewBox="0 0 24 24" fill="white" width="20" height="20"><path d="M11 9H9V2H7v7H5V2H3v7c0 2.12 1.66 3.84 3.75 3.97V22h2.5v-9.03C11.34 12.84 13 11.12 13 9V2h-2v7zm5-3v8h2.5v8H21V2c-2.76 0-5 2.24-5 4z"/></svg>
                            </div>
                            <div class="qa-icon-circle" style="background-color: #64B5F6;">
                                <svg viewBox="0 0 24 24" fill="white" width="20" height="20"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z"/></svg>
                            </div>
                        </div>

                        <div class="qa-subtitle">找到与你兴趣相投的人</div>
                        <div class="divider"></div>

                        <div class="similar-interests" data-qa-open-matches="true">
                            <div class="similar-left">
                                <span class="icon">
                                    <svg viewBox="0 0 24 24" fill="currentColor" width="22" height="22">
                                        <path d="M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5c-1.66 0-3 1.34-3 3s1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5C6.34 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z"/>
                                    </svg>
                                </span>
                                <span>相同爱好的人</span>
                            </div>
                            <svg class="svg-arrow" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                <polyline points="9 18 15 12 9 6"></polyline>
                            </svg>
                        </div>
                    </div>
                </div>

                <div id="content-msg-dms" style="display: none;">
                    <div class="card-box" style="padding: 30px; text-align: center; color: var(--text-light);">暂无私信</div>
                </div>
            </main>
        </div>
        <!-- ================= 视图 4：个人主页 ================= -->
        <div id="view-profile" class="view-container">
            <main class="content-scroll" style="padding-top: 0;">
                <!-- 顶部背景与导航 -->
                <div class="profile-header-bg">
                    <div class="top-nav-transparent">
                        <!-- 左侧设置图标 -->
                        <svg id="btn-app-settings-top" style="cursor: pointer;" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.325.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 0 1 1.37.49l1.296 2.247a1.125 1.125 0 0 1-.26 1.431l-1.003.827c-.293.241-.438.613-.43.992a7.723 7.723 0 0 1 0 .255c-.008.378.137.75.43.991l1.004.827c.424.35.534.955.26 1.43l-1.298 2.247a1.125 1.125 0 0 1-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.47 6.47 0 0 1-.22.128c-.331.183-.581.495-.644.869l-.213 1.281c-.09.543-.56.94-1.11.94h-2.594c-.55 0-1.019-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 0 1-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 0 1-1.369-.49l-1.297-2.247a1.125 1.125 0 0 1 .26-1.431l1.004-.827c.292-.24.437-.613.43-.991a6.932 6.932 0 0 1 0-.255c.007-.38-.138-.751-.43-.992l-1.004-.827a1.125 1.125 0 0 1-.26-1.43l1.297-2.247a1.125 1.125 0 0 1 1.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.086.22-.128.332-.183.582-.495.644-.869l.214-1.28Z" />
                            <path stroke-linecap="round" stroke-linejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                        </svg>
                        <!-- 右侧图标 -->
                        <div class="top-right-icons">
                            ${icityProCrownSvg('crown-icon', 24)}
                            <svg id="btn-profile-top-plane" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 14" style="cursor: pointer;">

                                <path fill="currentColor" fill-rule="evenodd" d="M11.6876 0.102955c0.3062 -0.11137522 0.6379 -0.1336913 0.9564 -0.0642399 0.3224 0.0702849 0.6178 0.2316089 0.8512 0.4648469 0.2333 0.233242 0.3948 0.528598 0.4652 0.850968 0.0696 0.31855 0.0472 0.65019 -0.0643 0.95641L10.3892 12.8157l-0.0003 0.0009c-0.0927 0.2803 -0.2559 0.5321 -0.474 0.7312 -0.21729 0.1984 -0.48174 0.3379 -0.76814 0.4051 -0.28685 0.0698 -0.58695 0.0639 -0.87087 -0.0172 -0.28354 -0.0809 -0.5412 -0.2341 -0.74778 -0.4444l-1.81186 -1.8025 -1.88987 0.9766c-0.19632 0.1015 -0.43162 0.0917 -0.61887 -0.0256 -0.18724 -0.1174 -0.29859 -0.3249 -0.29286 -0.5458l0.08129 -3.13225L0.499262 6.46654l-0.00023 -0.00023C0.29945 6.26698 0.152492 6.0212 0.0713907 5.75102c-0.08042446 -0.26792 -0.0935805 -0.55149 -0.0383546 -0.82564 0.0556164 -0.29919 0.1895279 -0.57832 0.3881279 -0.80899 0.200197 -0.23253 0.45886 -0.40736 0.749226 -0.50649l0.00421 -0.00143 0.00001 0.00001L11.6876 0.102955Zm0.6901 1.157065c-0.0886 -0.01932 -0.1809 -0.0128 -0.2659 0.01877 -0.0066 0.00245 -0.0132 0.00479 -0.0199 0.00701L1.57256 4.79345c-0.07913 0.02734 -0.14956 0.07514 -0.20412 0.13852 -0.05494 0.06381 -0.0918 0.14109 -0.10682 0.22385l-0.00281 0.01447c-0.01513 0.07346 -0.01176 0.14951 0.00981 0.22135 0.02156 0.07184 0.06065 0.13723 0.1138 0.1903l0.00024 0.00023 1.9481 1.94696 6.32941 -4.17668c0.21682 -0.14308 0.50713 -0.09628 0.66793 0.10769 0.1609 0.20397 0.1388 0.49716 -0.0509 0.67468L4.22461 9.79994l-0.03295 1.26966 1.35545 -0.7005c0.24119 -0.1246 0.53526 -0.0793 0.72774 0.1122l2.13771 2.1266 0.00648 0.0065 -0.00005 0c0.05514 0.0565 0.12411 0.0977 0.20012 0.1194 0.076 0.0217 0.15637 0.0232 0.23313 0.0043l0.0077 -0.0019 0.00002 0.0001c0.07914 -0.0184 0.15217 -0.0569 0.2121 -0.1116 0.05993 -0.0547 0.10473 -0.1239 0.13013 -0.2008l0.00066 -0.002L12.7134 1.90622c0.0022 -0.00668 0.0046 -0.01332 0.007 -0.01992 0.0316 -0.08479 0.0381 -0.17683 0.0188 -0.26519s-0.0636 -0.16938 -0.1277 -0.2334c-0.064 -0.06403 -0.1452 -0.10837 -0.2338 -0.12769Z" clip-rule="evenodd"></path>
                            </svg>
                        </div>
                    </div>
                </div>

                <!-- 用户信息区 -->
                <div class="profile-info-section">
                    <div class="avatar-wrapper"></div>
                    <div class="user-name">未命名市民</div>
                    <div class="user-handle">@diary_user</div>

                    <div class="user-tags">
                        <div class="tag-pill" data-icity-badge-entry="titles" style="cursor: pointer;"><span style="color:#C7C7CC">+</span> 我的市民称号</div>
                        <div class="tag-pill" data-icity-badge-entry="badges" style="cursor: pointer;"><span style="color:#C7C7CC">+</span> 勋章</div>
                    </div>

                    <div class="user-location">
                        <svg viewBox="0 0 24 24"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"></path></svg>
                        首尔
                    </div>

                    <!-- 操作按钮 -->
                    <div class="action-buttons">
                        <div class="btn-action" id="btn-edit-profile" style="cursor: pointer;">
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M12.8995 6.85453L17.1421 11.0972L7.24264 20.9967H3V16.754L12.8995 6.85453ZM14.3137 5.44032L16.435 3.319C16.8256 2.92848 17.4587 2.92848 17.8492 3.319L20.6777 6.14743C21.0682 6.53795 21.0682 7.17112 20.6777 7.56164L18.5563 9.68296L14.3137 5.44032Z"></path></svg>
                            修改资料
                        </div>
                        <div class="btn-action" id="btn-profile-dm" style="cursor: pointer;">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 10 10">
                                <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" d="M2.92356 2.83667h4.15287" stroke-width="1"></path>
                                <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" d="M2.92356 5.16333h2.76858" stroke-width="1"></path>
                                <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" d="M9.5 6.5c0 0.26522 -0.10536 0.51957 -0.29289 0.70711C9.01957 7.39464 8.76522 7.5 8.5 7.5H5l-2.5 2v-2h-1c-0.26522 0 -0.51957 -0.10536 -0.707107 -0.29289C0.605357 7.01957 0.5 6.76522 0.5 6.5v-5c0 -0.26522 0.105357 -0.51957 0.292893 -0.707107C0.98043 0.605357 1.23478 0.5 1.5 0.5h7c0.26522 0 0.51957 0.105357 0.70711 0.292893C9.39464 0.98043 9.5 1.23478 9.5 1.5z" stroke-width="1"></path>
                            </svg>
                            私信
                        </div>
                        <div class="btn-action">
                            ${icityProCrownSvg('upgrade-crown-icon', 20)} 升级
                        </div>
                        <div class="btn-action icon-only" id="btn-app-settings-bottom" style="cursor: pointer;">
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                                <path fill-rule="evenodd" d="M11.078 2.25c-.917 0-1.699.663-1.85 1.567L9.05 4.889c-.02.12-.115.26-.297.348a7.493 7.493 0 0 0-.986.57c-.166.115-.334.126-.45.083L6.3 5.508a1.875 1.875 0 0 0-2.282.819l-.922 1.597a1.875 1.875 0 0 0 .432 2.385l.84.692c.095.078.17.229.154.43a7.598 7.598 0 0 0 0 1.139c.015.2-.059.352-.153.43l-.841.692a1.875 1.875 0 0 0-.432 2.385l.922 1.597a1.875 1.875 0 0 0 2.282.818l1.019-.382c.115-.043.283-.031.45.082.312.214.641.405.985.57.182.088.277.228.297.35l.178 1.071c.151.904.933 1.567 1.85 1.567h1.844c.916 0 1.699-.663 1.85-1.567l.178-1.072c.02-.12.114-.26.297-.349.344-.165.673-.356.985-.57.167-.114.335-.125.45-.082l1.02.382a1.875 1.875 0 0 0 2.28-.819l.923-1.597a1.875 1.875 0 0 0-.432-2.385l-.84-.692c-.095-.078-.17-.229-.154-.43a7.614 7.614 0 0 0 0-1.139c-.016-.2.059-.352.153-.43l.84-.692c.708-.582.891-1.59.433-2.385l-.922-1.597a1.875 1.875 0 0 0-2.282-.818l-1.02.382c-.114.043-.282.031-.449-.083a7.49 7.49 0 0 0-.985-.57c-.183-.087-.277-.227-.297-.348l-.179-1.072a1.875 1.875 0 0 0-1.85-1.567h-1.843ZM12 15.75a3.75 3.75 0 1 0 0-7.5 3.75 3.75 0 0 0 0 7.5Z" clip-rule="evenodd" />
                            </svg>
                        </div>
                    </div>

                    <!-- 数据统计 -->
                    <div class="stats-row">
                        <div class="stat-item"><span class="stat-num" id="profile-stat-follower-count">0</span> 关注者</div>
                        <div class="stat-item"><span class="stat-num" id="profile-stat-friend-count">0</span> 朋友</div>
                        <div class="stat-item"><span class="stat-num" id="profile-stat-diary-count">0</span> 日记</div>
                        <div class="stat-item"><span class="stat-num" id="profile-stat-liked-count">0</span> 被喜欢</div>
                    </div>
                </div>

                <!-- 个人主页新结构 -->
                <div class="profile-feed" style="padding-bottom: 20px;">

                    <!-- 1. 最近日记卡片 -->
                    <div class="card-box" style="display: flex; flex-direction: column;">
                        <div id="profile-recent-posts">
                            <!-- JS 动态注入最多两篇日记 -->
                        </div>
                        <div class="profile-more-btn" id="btn-profile-more-diary">
                            更多日记 <span id="profile-more-diary-count">0</span>
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="9 18 15 12 9 6"></polyline></svg>
                        </div>
                    </div>

                    <!-- 2. 日记本卡片 -->
                    <div class="card-box" style="display: flex; flex-direction: column;">
                        <div class="profile-diary-books-area" id="profile-diary-books-container">
                            <!-- JS 动态注入日记本 -->
                        </div>
                        <div class="profile-more-btn">
                            更多日记本 <span id="profile-more-book-count">0</span>
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="9 18 15 12 9 6"></polyline></svg>
                        </div>
                    </div>

                    <!-- 3. 功能列表 -->
                    <div class="card-box">
                        <div class="profile-list-item" id="btn-profile-photos" style="cursor: pointer;">
                            <div class="icon-wrapper" style="background-color: #FF7043;">
                                <svg viewBox="0 0 24 24"><path d="M21 19V5c0-1.1-.9-2-2-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2zM8.5 13.5l2.5 3.01L14.5 12l4.5 6H5l3.5-4.5z"/></svg>
                            </div>
                            <div class="text">我的相册</div>
                            <div class="arrow"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="9 18 15 12 9 6"></polyline></svg></div>
                        </div>

                        <div class="profile-list-item" id="btn-profile-archived">
                            <div class="icon-wrapper" style="background-color: #B0BEC5;">
                                <svg viewBox="0 0 1024 1024" width="18" height="18" fill="currentColor"><path d="M960 533.333v256a128 128 0 0 1-128 128H192a128 128 0 0 1-128-128v-256h294.443a86.39 86.39 0 0 0 8.832 11.862l3.477 3.669 90.496 90.517a85.333 85.333 0 0 0 117.29 3.2l3.414-3.2 90.496-90.517a85.501 85.501 0 0 0 12.288-15.53H960z m-437.333-128a64 64 0 0 1 32.298 119.254l4.331 30.506a37.013 37.013 0 1 1-73.259 0l4.352-30.485a64 64 0 0 1 32.278-119.275z m224-298.666C864.49 106.667 960 202.176 960 320v128l-272.79-0.021a85.077 85.077 0 0 0-11.306-16.107l-3.456-3.69-90.517-90.518a85.333 85.333 0 0 0-117.27-3.2l-3.413 3.2-90.496 90.517a85.333 85.333 0 0 0-14.784 19.798L64 448V320c0-117.824 95.51-213.333 213.333-213.333h469.334z"></path></svg>
                            </div>
                            <div class="text">我封存的日记</div>
                            <div class="arrow"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="9 18 15 12 9 6"></polyline></svg></div>
                        </div>

                        <div class="profile-list-item" id="btn-profile-replies" style="cursor: pointer;">
                            <div class="icon-wrapper" style="background-color: #7986CB;">
                                <svg viewBox="0 0 1024 1024" width="18" height="18" fill="currentColor"><path d="M940.7 464.3L631.6 173.7c-16.8-15.8-43.9-3.5-43.9 19.9v127.6c-224.8 27.9-399 218.9-399 451.3 0 18 1.1 35.8 3.3 53.3 2.2 17.8 25 23.3 36 9.1 83.2-107.1 213-176.2 359.2-176.2h0.4v143.8c0 24.1 28.3 36.1 44.8 19.1l309.1-318.2c10.7-11 10.3-28.7-0.8-39.1z"></path></svg>
                            </div>
                            <div class="text">我的回复</div>
                            <div class="arrow"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="9 18 15 12 9 6"></polyline></svg></div>
                        </div>

                        <div class="profile-list-item" id="btn-profile-calendar" style="cursor: pointer;">
                            <div class="icon-wrapper" style="background-color: #EF5350;">
                                <svg viewBox="0 0 1024 1024" width="18" height="18" fill="currentColor"><path d="M64 409.6v467.2c0 19.2 6.4 38.4 19.2 57.6 12.8 19.2 38.4 32 64 32h729.6c32 0 57.6-19.2 76.8-44.8 6.4-12.8 6.4-25.6 6.4-38.4V409.6H64z m608 160c-6.4 0-12.8 6.4-19.2 6.4H364.8c-12.8 0-19.2-12.8-25.6-25.6 0-6.4 0-12.8 6.4-19.2 6.4-6.4 12.8-6.4 19.2-6.4h288c12.8 0 25.6 12.8 25.6 25.6 0 6.4 0 12.8-6.4 19.2z m275.2-396.8c-19.2-19.2-38.4-38.4-70.4-38.4h-121.6V256c0 25.6-25.6 51.2-51.2 51.2s-51.2-25.6-51.2-51.2V140.8H371.2V256c0 25.6-25.6 51.2-51.2 51.2-32 0-51.2-25.6-51.2-51.2V140.8H153.6h-6.4c-32 0-64 19.2-76.8 51.2-6.4 12.8-6.4 32-6.4 44.8v121.6h896V224c0-19.2-6.4-32-12.8-51.2z m0 0"></path><path d="M294.4 89.6V262.4c0 6.4 0 12.8 6.4 19.2H320c12.8 0 25.6-12.8 25.6-25.6V108.8v-19.2c0-6.4 0-12.8-6.4-19.2C332.8 64 326.4 64 320 64c-12.8 0-25.6 12.8-25.6 25.6z m384 0V262.4c0 6.4 0 12.8 6.4 19.2 6.4 6.4 12.8 6.4 19.2 6.4 12.8 0 25.6-12.8 25.6-25.6V108.8v-19.2c0-6.4 0-12.8-6.4-19.2-6.4-6.4-12.8-6.4-19.2-6.4-12.8 0-25.6 12.8-25.6 25.6z m0 0"></path></svg>
                            </div>
                            <div class="text">我的日历</div>
                            <div class="arrow"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="9 18 15 12 9 6"></polyline></svg></div>
                        </div>

                        <div class="profile-list-item" id="btn-profile-badges-entry" role="button" tabindex="0" aria-label="查看我的市民勋章" style="cursor: pointer;">
                            <div class="icon-wrapper" style="background-color: #FFB74D;">
                                <svg viewBox="0 0 24 24"><circle cx="12" cy="8" r="7"></circle><polyline points="8.21 13.89 7 23 12 20 17 23 15.79 13.88"></polyline></svg>
                            </div>
                            <div class="text">我的市民勋章</div>
                            <div class="arrow"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="9 18 15 12 9 6"></polyline></svg></div>
                        </div>
                    </div>
                </div>
            </main>
        </div>

        <!-- ================= 视图 13：角色主页 ================= -->
        <div id="view-char-profile" class="view-container">
            <main class="content-scroll" style="padding-top: 0; background-color: #F1EFEF;">
                <!-- 顶部背景与导航 -->
                <div class="char-profile-header-bg" id="char-profile-bg">
                    <div class="top-nav-transparent">
                        <!-- 左侧返回图标 -->
                        <svg id="btn-back-char-profile" style="cursor: pointer; width: 28px; height: 28px; filter: drop-shadow(0 1px 2px rgba(0,0,0,0.3));" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                            <polyline points="15 18 9 12 15 6"></polyline>
                        </svg>
                    </div>
                </div>

                <!-- 用户信息区 -->
                <div class="char-profile-info-section">
                    <div class="char-avatar-wrapper" id="char-profile-avatar"></div>
                    <div class="char-user-name" id="char-profile-name">名字</div>
                    <div class="char-user-handle" id="char-profile-handle">@handle</div>
                    
                    <div class="char-user-bio" id="char-profile-bio">“待我 如初”</div>

                    <div class="char-user-location" id="char-profile-location">
                        <svg viewBox="0 0 24 24"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"></path></svg>
                        <span>驻马店市</span>
                    </div>

                    <!-- 操作按钮 -->
                    <div class="char-action-buttons">
                        <div class="btn-action btn-green">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
                            加好友
                        </div>
                        <div class="btn-action btn-outline" id="btn-char-dm">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 10 10">
                                <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" d="M2.92356 2.83667h4.15287" stroke-width="1"></path>
                                <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" d="M2.92356 5.16333h2.76858" stroke-width="1"></path>
                                <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" d="M9.5 6.5c0 0.26522 -0.10536 0.51957 -0.29289 0.70711C9.01957 7.39464 8.76522 7.5 8.5 7.5H5l-2.5 2v-2h-1c-0.26522 0 -0.51957 -0.10536 -0.707107 -0.29289C0.605357 7.01957 0.5 6.76522 0.5 6.5v-5c0 -0.26522 0.105357 -0.51957 0.292893 -0.707107C0.98043 0.605357 1.23478 0.5 1.5 0.5h7c0.26522 0 0.51957 0.105357 0.70711 0.292893C9.39464 0.98043 9.5 1.23478 9.5 1.5z" stroke-width="1"></path>
                            </svg>
                            私信
                        </div>
                        <button type="button" class="btn-action btn-outline icon-only" id="btn-edit-char-profile" aria-label="修改角色资料" title="修改资料" style="background: transparent; cursor: pointer;">
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="currentColor" stroke="none" aria-hidden="true" focusable="false" style="display: block; flex-shrink: 0;"><circle cx="5" cy="12" r="2"></circle><circle cx="12" cy="12" r="2"></circle><circle cx="19" cy="12" r="2"></circle></svg>
                        </button>
                    </div>

                    <!-- 数据统计 -->
                    <div class="char-stats-row">
                        <div class="stat-item"><span class="stat-num" id="char-stat-follower">2</span> 关注者</div>
                        <div class="stat-item"><span class="stat-num" id="char-stat-friend">2</span> 朋友</div>
                        <div class="stat-item"><span class="stat-num" id="char-stat-diary">100</span> 日记</div>
                        <div class="stat-item"><span class="stat-num" id="char-stat-liked">48</span> 被喜欢</div>
                    </div>
                </div>

                <!-- 个人主页新结构 -->
                <div class="char-profile-feed" style="padding-bottom: 20px;">
                    <!-- 1. 最近日记卡片 -->
                    <div class="card-box" style="display: flex; flex-direction: column;">
                        <div id="char-profile-recent-posts">
                            <!-- JS 动态注入 -->
                        </div>
                        <div class="char-profile-more-btn" id="btn-char-more-diary">
                            更多日记 <span id="char-more-diary-count">0</span>
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="9 18 15 12 9 6"></polyline></svg>
                        </div>
                    </div>

                    <!-- 1.5. 角色拥有的日记本 (含共同合写日记本 & Pro会员专属私密日记本) -->
                    <div class="card-box" style="display: flex; flex-direction: column; margin-bottom: 8px;">
                        <div style="padding: 12px 16px 4px; font-size: 13px; font-weight: 600; color: var(--text-sub); display: flex; justify-content: space-between; align-items: center;">
                            <span>市民日记本</span>
                            <span style="font-size: 11px; color: var(--text-light);">含共同日记本与专属密本</span>
                        </div>
                        <div class="diary-books-scroll" id="char-diary-books-scroll" style="padding: 10px 14px 14px;">
                            <!-- JS 动态注入该角色关联的日记本 -->
                        </div>
                    </div>

                    <!-- 2. 照片墙 -->
                    <div class="card-box" style="display: flex; flex-direction: column;">
                        <div class="char-photo-grid" id="char-profile-photos">
                            <!-- JS 动态注入 -->
                        </div>
                        <div class="char-profile-more-btn" id="btn-char-more-photos">
                            更多照片 <span id="char-more-photo-count">0</span>
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="9 18 15 12 9 6"></polyline></svg>
                        </div>
                    </div>
                </div>
            </main>
        </div>

        <!-- ================= 视图 4.5：日记列表/封存页 ================= -->
        <div id="view-diary-list" class="view-container" style="background-color: #F1EFEF;">
            <header class="header-diary-list">
                <div class="back-btn" id="btn-back-diary-list">
                    <svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round"><polyline points="15 18 9 12 15 6"></polyline></svg>
                </div>
                <div class="title" id="diary-list-header-title">用户名 · 全部日记</div>
                <div class="right-placeholder"></div>
            </header>

            <div class="diary-filter-tabs">
                <div class="filter-tab active" data-filter="all">全部</div>
                <div class="filter-tab" data-filter="public">公开</div>
                <div class="filter-tab" data-filter="friends">仅好友</div>
                <div class="filter-tab" data-filter="private">私密</div>
                <div class="filter-tab" data-filter="archived">已封存</div>
                <div class="filter-tab" data-filter="retro">补写</div>
            </div>

            <main class="content-scroll" style="padding-top: 8px;">
                <div id="diary-list-feed"></div>
            </main>
        </div>

        <!-- ================= 视图 5：日记本详情页 ================= -->
        <div id="view-diary-detail" class="view-container">
            <header class="header-diary-detail">
                <div class="back-btn" id="btn-back-diary-detail">
                    <svg viewBox="0 0 24 24" width="28" height="28" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round"><polyline points="15 18 9 12 15 6"></polyline></svg>
                </div>
                <div class="title" id="detail-page-header-title">yuiieo的日记本</div>
                <div class="right-icon" id="btn-diary-book-calendar" style="cursor: pointer;">
                    <svg viewBox="0 0 24 24" width="24" height="24" style="fill: currentColor; stroke: none;">
                        <path fill-rule="evenodd" d="M6.75 2.25A.75.75 0 0 1 7.5 3v1.5h9V3A.75.75 0 0 1 18 3v1.5h.75a3 3 0 0 1 3 3v11.25a3 3 0 0 1-3 3H5.25a3 3 0 0 1-3-3V7.5a3 3 0 0 1 3-3H6V3a.75.75 0 0 1 .75-.75Zm13.5 9a1.5 1.5 0 0 0-1.5-1.5H5.25a1.5 1.5 0 0 0-1.5 1.5v7.5a1.5 1.5 0 0 0 1.5 1.5h13.5a1.5 1.5 0 0 0 1.5-1.5v-7.5Z" clip-rule="evenodd" />
                        <g transform="translate(6, 8.5) scale(0.5)">
                            <path d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z" fill="currentColor"/>
                        </g>
                    </svg>
                </div>
            </header>
            <main class="content-scroll" style="padding-top: 0;">
                <div class="card-box diary-detail-top-card">
                    <div class="diary-detail-cover" id="detail-page-cover"></div>
                    <div class="diary-detail-info">
                        <div class="diary-detail-title-row">
                            <div class="diary-detail-title-text" id="detail-page-title">日记本名称</div>
                            <div class="diary-detail-more" style="position: relative; cursor: pointer;" id="btn-diary-detail-more">
                                <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor"><circle cx="5" cy="12" r="2"></circle><circle cx="12" cy="12" r="2"></circle><circle cx="19" cy="12" r="2"></circle></svg>

                                <div class="popover-menu" id="diary-detail-menu" style="display: none; top: 100%; right: 0; transform: none; margin-top: 8px; margin-right: 0; z-index: 9999;">
                                    <div class="menu-row">
                                        <div class="menu-item text-red" id="menu-diary-delete">
                                            <svg class="icon-red" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path><line x1="10" y1="11" x2="10" y2="17"></line><line x1="14" y1="11" x2="14" y2="17"></line></svg>
                                            删除
                                        </div>
                                        <div class="menu-item" id="menu-diary-edit">
                                            <svg class="icon-yellow" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>
                                            编辑日记本
                                        </div>
                                    </div>
                                    <div class="menu-row">
                                        <div class="menu-item" id="menu-diary-pin">
                                            <svg class="icon-green" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="17" x2="12" y2="22"></line><path d="M5 17h14v-1.76a2 2 0 0 0-1.11-1.79l-1.78-.9A2 2 0 0 1 15 10.6V6a3 3 0 0 0-3-3h0a3 3 0 0 0-3 3v4.6a2 2 0 0 1-1.11 1.79l-1.78.9A2 2 0 0 0 5 15.24Z"></path></svg>
                                            置顶日记本
                                        </div>
                                        <div class="menu-item" id="menu-diary-visibility">
                                            <svg class="icon-gray" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg>
                                            修改权限
                                        </div>
                                    </div>
                                    <div class="menu-row">
                                        <div class="menu-item" id="menu-diary-invite">
                                            <svg class="icon-blue" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="8.5" cy="7" r="4"></circle><line x1="20" y1="8" x2="20" y2="14"></line><line x1="23" y1="11" x2="17" y2="11"></line></svg>
                                            邀请好友
                                        </div>
                                        <div class="menu-item" id="menu-diary-ai-summary">
                                            <svg class="icon-yellow" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"></path></svg>
                                            阶段总结
                                        </div>
                                    </div>
                                    <div class="menu-row">
                                        <div class="menu-item" id="menu-diary-export-pdf">
                                            <svg class="icon-gray" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M6 9V2h12v7"></path><path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"></path><rect x="6" y="14" width="12" height="8"></rect></svg>
                                            导出 PDF
                                        </div>
                                        <div class="menu-item" id="menu-diary-export-video">
                                            <svg class="icon-green" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="23 7 16 12 23 17 23 7"></polygon><rect x="1" y="5" width="15" height="14" rx="2" ry="2"></rect></svg>
                                            制作影片
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="diary-detail-stats">
                            <span id="detail-page-count"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"></path></svg> 0日记</span>
                            <span id="detail-page-time"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg> 刚刚</span>
                            <span id="detail-page-visibility"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg> 仅自己</span>
                        </div>
                    </div>
                </div>

                <div class="card-box write-prompt editor-wrapper" id="inline-editor-detail">
                    <div class="collapsed-view">
                        <div class="avatar sync-avatar"></div>
                        <div class="write-text">写点什么</div>
                    </div>

                    <div class="expanded-view">
                        <div class="editor-header">
                            <div class="avatar sync-avatar"></div>
                            <svg class="expand-icon" id="collapse-editor-detail" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M15 3h6v6M9 21H3v-6M21 3l-7 7M3 21l7-7"/></svg>
                        </div>
                        <textarea class="editor-textarea" placeholder="写点什么吧"></textarea>

                        <div class="image-preview-area">
                            <img class="preview-img" src="" alt="预览图">
                            <div class="remove-img-btn">✕</div>
                        </div>
                        <input type="file" class="input-camera" accept="image/*" style="display: none;">

                        <div class="selected-location-display">
                            <svg viewBox="0 0 24 24"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"></path></svg>
                            <span class="location-text-top"></span>
                            <span class="clear-loc-btn">×</span>
                        </div>

                        <div class="editor-footer">
                            <div class="editor-tools">
                                <div class="tool-icon btn-camera">
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
                                        <path stroke-linecap="round" stroke-linejoin="round" d="M6.827 6.175A2.31 2.31 0 0 1 5.186 7.23c-.38.054-.757.112-1.134.175C2.999 7.58 2.25 8.507 2.25 9.574V18a2.25 2.25 0 0 0 2.25 2.25h15A2.25 2.25 0 0 0 21.75 18V9.574c0-1.067-.75-1.994-1.802-2.169a47.865 47.865 0 0 0-1.134-.175 2.31 2.31 0 0 1-1.64-1.055l-.822-1.316a2.192 2.192 0 0 0-1.736-1.039 48.774 48.774 0 0 0-5.232 0 2.192 2.192 0 0 0-1.736 1.039l-.821 1.316Z" />
                                        <path stroke-linecap="round" stroke-linejoin="round" d="M16.5 12.75a4.5 4.5 0 1 1-9 0 4.5 4.5 0 0 1 9 0ZM18.75 10.5h.008v.008h-.008V10.5Z" />
                                    </svg>
                                </div>
                                <div class="tool-icon btn-location">
                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor">
                                        <path d="M8 3.52003125c-2.1554625 -0.00009375 -3.50260625 2.3332 -2.42495625 4.1999375 1.07764375 1.86673125 3.771975 1.86685 4.8497875 0.00021875 0.24579375 -0.4256875 0.3752 -0.908575 0.3752 -1.400125 0 -1.5464625 -1.25356875 -2.8001 -2.80003125 -2.80003125Zm0 4.48005c-1.293275 0.00005625 -2.1015625 -1.399925 -1.454975 -2.5199625 0.6465875 -1.1200375 2.2631875 -1.1201125 2.909875 -0.00013125 0.147475 0.2554125 0.22511875 0.54514375 0.22511875 0.840075 0 0.92781875 -0.7522 1.679975 -1.68001875 1.68001875ZM8 0.16c-3.40050625 0.00385625 -6.15620625 2.75955625 -6.1600625 6.1600625 0 2.19801875 1.0157125 4.52764375 2.94003125 6.73756875 0.8646625 0.99860625 1.8378375 1.89781875 2.90153125 2.681025 0.1928875 0.135125 0.4497125 0.135125 0.64260625 0 1.06173125 -0.78353125 2.0330125 -1.6827375 2.895925 -2.681025 1.92151875 -2.209925 2.94003125 -4.53955 2.94003125 -6.73756875C14.15620625 2.91955625 11.40050625 0.16385625 8 0.16Zm0 14.42014375c-1.1571125 -0.91000625 -5.04005 -4.25254375 -5.04005 -8.26008125 0 -3.87983125 4.20004375 -6.30473125 7.560075 -4.3648125 1.5594 0.90031875 2.520025 2.564175 2.520025 4.3648125 0 4.0061375 -3.8829375 7.350075 -5.04005 8.26008125Z" stroke-width="0.0625"></path>
                                    </svg>
                                </div>
                                <div class="tool-icon btn-diary">
                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="-0.5 -0.5 16 16" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round">
                                        <path d="M2.5 12.1875A1.5625 1.5625 0 0 1 4.0625 10.625H12.5" stroke-width="1"></path>
                                        <path d="M4.0625 1.25H12.5v12.5H4.0625A1.5625 1.5625 0 0 1 2.5 12.1875v-9.375A1.5625 1.5625 0 0 1 4.0625 1.25z" stroke-width="1"></path>
                                    </svg>
                                    <span class="display-diary"></span>
                                </div>
                            </div>
                            <div class="editor-actions">
                                <span class="public-status">
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
                                      <path stroke-linecap="round" stroke-linejoin="round" d="M12 21a9.004 9.004 0 0 0 8.716-6.747M12 21a9.004 9.004 0 0 1-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 0 1 7.843 4.582M12 3a8.997 8.997 0 0 0-7.843 4.582m15.686 0A11.953 11.953 0 0 1 12 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0 1 21 12c0 .778-.099 1.533-.284 2.253m0 0A17.919 17.919 0 0 1 12 16.5c-3.162 0-6.133-.815-8.716-2.247m0 0A9.015 9.015 0 0 1 3 12c0-1.605.42-3.113 1.157-4.418" />
                                    </svg>
                                    公开
                                </span>
                                <button class="send-btn btn-send">
                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" height="16" width="16">
                                      <path d="M15.413215625 0.33158125c0.309246875 0.21433125 0.471525 0.584815625 0.41335 0.955303125l-1.95959375 12.737359375c-0.045928125 0.297 -0.226578125 0.557259375 -0.489896875 0.704228125s-0.57869375 0.165340625 -0.857321875 0.048990625l-3.661990625 -1.521746875 -2.097378125 2.268840625c-0.27250625 0.297003125 -0.70116875 0.39498125 -1.077778125 0.2480125s-0.621559375 -0.51133125 -0.621559375 -0.915496875v-2.559721875c0 -0.122475 0.045928125 -0.238825 0.1286 -0.32761875l5.1316875 -5.60015c0.1775875 -0.1929 0.1714625 -0.4899 -0.01225 -0.6736125s-0.4807125 -0.195959375 -0.673609375 -0.02143125L3.407640625 11.207328125l-2.703628125 -1.353346875C0.37945625 9.691703125 0.17125 9.367146875 0.1620625 9.005846875s0.18065 -0.69810625 0.4929625 -0.87875625l13.71715625 -7.838375c0.32761875 -0.186775 0.731784375 -0.168403125 1.041034375 0.042865625Z" fill="currentColor" stroke-width="0.0313"></path>
                                    </svg>
                                    发送
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="card-box" id="diary-detail-feed"></div>
            </main>
        </div>

        <!-- ================= 视图 5.5：专属日记本全屏日历页 ================= -->
        <div id="view-diary-book-calendar" class="view-container" style="background-color: #F1EFEF;">
            <header class="header-single-post">
                <div class="back-btn" id="btn-back-diary-book-calendar" style="cursor: pointer;">
                    <svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round"><polyline points="15 18 9 12 15 6"></polyline></svg>
                </div>
                <div class="title" id="diary-book-calendar-nav-title">我的日历 · Calendar</div>
                <div class="right-placeholder" style="width: 40px;"></div>
            </header>

            <!-- 年份切换栏 -->
            <div class="calendar-year-switcher">
                <div class="arrow-btn" id="btn-book-cal-prev-year">
                    <svg viewBox="0 0 24 24"><polyline points="15 18 9 12 15 6"></polyline></svg>
                </div>
                <div class="year-text" id="book-cal-current-year-display">2026</div>
                <div class="arrow-btn" id="btn-book-cal-next-year">
                    <svg viewBox="0 0 24 24"><polyline points="9 6 15 12 9 18"></polyline></svg>
                </div>
            </div>

            <main class="content-scroll" style="padding-top: 10px;">
                <!-- 顶部仿原图日记本封面与统计卡片 -->
                <div class="card-box" id="book-cal-stat-card" style="margin: 0 6px 12px 6px; padding: 16px; display: flex; align-items: center; gap: 20px; background: #FFFFFF;">
                    <div id="book-cal-cover" style="width: 80px; height: 110px; border-radius: 4px 12px 12px 4px; box-shadow: 0 4px 12px rgba(0,0,0,0.12); flex-shrink: 0;"></div>
                    <div style="display: flex; flex-direction: column; gap: 8px;">
                        <div style="font-size: 16px; color: var(--text-sub);"><span style="font-weight: 500;">记录 </span><strong style="font-size: 24px; color: var(--text-main);" id="book-cal-stat-days">0</strong><span style="font-weight: 500;"> 天</span></div>
                        <div style="font-size: 16px; color: var(--text-sub);"><span style="font-weight: 500;">写下 </span><strong style="font-size: 24px; color: var(--text-main);" id="book-cal-stat-diaries">0</strong><span style="font-weight: 500;"> 篇日记</span></div>
                        <div style="font-size: 16px; color: var(--text-sub);"><span style="font-weight: 500;">获得 </span><strong style="font-size: 24px; color: var(--text-main);" id="book-cal-stat-likes">0</strong><span style="font-weight: 500;"> 个喜欢</span></div>
                    </div>
                </div>

                <!-- 1月~12月打卡天数矩阵 -->
                <div class="card-box" style="margin: 0 6px 20px 6px; padding: 18px 14px; background: #FFFFFF;">
                    <div id="book-cal-matrix-container" style="display: flex; flex-direction: column; gap: 10px;">
                        <!-- 动态渲染 1~12月 点阵打卡图 -->
                    </div>
                </div>
            </main>
        </div>

        <!-- ================= 视图 6：个人设置页 ================= -->
        <div id="view-settings" class="view-container">
            <header class="header-settings">
                <div class="back-btn" id="btn-back-settings">
                    <svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round"><polyline points="15 18 9 12 15 6"></polyline></svg>
                </div>
                <div class="title">个人设置</div>
                <div class="done-btn" id="btn-done-settings">完成</div>
            </header>

            <main class="content-scroll">
                <div class="media-edit-section">
                    <div class="media-box" id="btn-edit-avatar" style="cursor: pointer;">
                        <div class="media-preview avatar-preview" id="settings-avatar-preview" style="background-size: cover; background-position: center;">🍬</div>
                        <div class="media-label">修改头像</div>
                    </div>
                    <input type="file" id="input-settings-avatar" accept="image/*" style="display: none;">

                    <div class="media-box" id="btn-edit-bg" style="cursor: pointer;">
                        <div class="media-preview bg-preview" id="settings-bg-preview" style="background-size: cover; background-position: center;">🌅</div>
                        <div class="media-label">修改背景</div>
                    </div>
                    <input type="file" id="input-settings-bg" accept="image/*" style="display: none;">
                </div>

                <div class="settings-group">
                    <div class="settings-item" id="btn-edit-nickname">
                        <div class="item-label">昵称</div>
                        <input type="text" class="item-value text-blue" id="settings-nickname-val" value="未命名市民" placeholder="请输入昵称" style="border:none; outline:none; background:transparent; text-align:left; flex:1; font-size:14px; min-width:0; padding:0;">
                    </div>
                    <div class="settings-item" id="btn-edit-icity-id">
                        <div class="item-label">Diary ID</div>
                        <input type="text" class="item-value" id="settings-icity-id-val" value="diary_user" placeholder="请输入 Diary ID" style="border:none; outline:none; background:transparent; text-align:left; flex:1; font-size:14px; min-width:0; padding:0; color:var(--text-sub);">
                        <div class="pill-btn">转生卡</div>
                    </div>
                    <div class="settings-item" id="btn-edit-email" style="position: relative; z-index: 20;">
                        <div class="item-label">绑定微信</div>
                        <input type="text" class="item-value" id="settings-email-val" placeholder="输入微信ID或点击选择" style="border:none; outline:none; background:transparent; text-align:left; flex:1; color:var(--text-sub); font-size:14px; min-width:0; padding:0;">
                        <div class="pill-btn" id="settings-wechat-bind-pill" style="cursor:pointer; flex-shrink:0;">绑定</div>
                        <div class="wechat-bind-dropdown" id="wechat-bind-dropdown" style="left: 116px; right: 16px; width: auto; margin-top: 0;"></div>
                    </div>
                    <div class="settings-item" id="btn-edit-gender" style="cursor: pointer;">
                        <div class="item-label">性别</div>
                        <div class="item-value right-align text-blue" id="settings-gender-val">男生</div>
                        <svg class="arrow-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="9 18 15 12 9 6"></polyline></svg>
                    </div>
                    <div class="settings-item" id="btn-edit-location" style="cursor: pointer;">
                        <div class="item-label">所在地</div>
                        <div class="item-value text-light" id="settings-location-val">可选</div>
                    </div>
                    <div class="settings-item" id="btn-edit-bio" style="cursor: pointer; flex-direction: column; align-items: flex-start; gap: 6px; padding-top: 12px; padding-bottom: 12px;">
                        <div class="item-label" style="width: auto;">关于我</div>
                        <div class="item-value text-light" id="settings-bio-val" style="font-size: 13px;">介绍一下自己</div>
                    </div>
                </div>

                <div class="settings-group">
                    <div class="settings-item">
                        <div class="item-label" style="width: auto; flex: 1;">Diary 市民称号 <span class="pro-tag">Pro</span></div>
                        <svg class="arrow-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="9 18 15 12 9 6"></polyline></svg>
                    </div>
                    <div class="settings-item" data-icity-open-badges role="button" tabindex="0" aria-label="查看 Diary 市民徽章" style="cursor: pointer;">
                        <div class="item-label" style="width: auto; flex: 1;">Diary 市民徽章 <span class="pro-tag">Pro</span></div>
                        <div class="item-value right-align text-blue" data-icity-badge-value>未设置</div>
                        <svg class="arrow-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="9 18 15 12 9 6"></polyline></svg>
                    </div>
                    <div class="settings-item" id="btn-settings-earth-day" style="cursor: pointer;">
                        <div class="item-label" style="width: auto; flex: 1;">我来到地球的日子</div>
                        <div class="item-value right-align text-blue" id="val-settings-earth-day">已设置</div>
                        <svg class="arrow-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="9 18 15 12 9 6"></polyline></svg>
                    </div>
                    <div class="settings-item" id="btn-edit-diary-style" style="cursor: pointer;">
                        <div class="item-label" style="width: auto; flex: 1;">自定义日记文风</div>
                        <div class="item-value right-align text-light" id="val-diary-style-summary" style="font-size: 13px;">点击自定义</div>
                        <svg class="arrow-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="9 18 15 12 9 6"></polyline></svg>
                    </div>
                    <div class="settings-item">
                        <div class="item-label" style="width: auto; flex: 1;">社交网络</div>
                        <svg class="arrow-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="9 18 15 12 9 6"></polyline></svg>
                    </div>
                </div>

                <div class="settings-group">
                    <div class="settings-item">
                        <div class="item-label" style="width: auto; flex: 1;">账号与安全</div>
                        <svg class="arrow-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="9 18 15 12 9 6"></polyline></svg>
                    </div>
                    <div class="settings-item">
                        <div class="item-label" style="width: auto; flex: 1;">推送设置</div>
                        <svg class="arrow-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="9 18 15 12 9 6"></polyline></svg>
                    </div>
                    <div class="settings-item">
                        <div class="item-label" style="width: auto; flex: 1;">隐私设置</div>
                        <svg class="arrow-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="9 18 15 12 9 6"></polyline></svg>
                    </div>
                    <div class="settings-item">
                        <div class="item-label" style="width: auto; flex: 1;">密码设置</div>
                        <svg class="arrow-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="9 18 15 12 9 6"></polyline></svg>
                    </div>
                </div>

                <div class="settings-group">
                    <div class="settings-item">
                        <div class="item-label" style="width: auto; flex: 1;">更多设置</div>
                        <svg class="arrow-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="9 18 15 12 9 6"></polyline></svg>
                    </div>
                </div>

                <div class="settings-group">
                    <div class="settings-item" style="cursor: pointer;">
                        <div class="item-label" style="width: auto; flex: 1; color: #FF3B30;">退出账号</div>
                    </div>
                </div>
            </main>
        </div>
        <!-- ================= 视图 8：程序设置页 ================= -->
        <div id="view-app-settings" class="view-container">
            <header class="header-settings">
                <div class="back-btn" id="btn-back-app-settings">
                    <svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round"><polyline points="15 18 9 12 15 6"></polyline></svg>
                </div>
                <div class="title">程序设置</div>
                <div class="done-btn" id="btn-done-app-settings">完成</div>
            </header>

            <main class="content-scroll" style="padding-top: 0;">
                <!-- 用户信息 -->
                <div class="settings-group" style="margin-top: 0;">
                    <div class="settings-item" id="btn-app-settings-profile" style="padding: 12px 16px; cursor: pointer;">
                        <div class="item-label" style="width: auto; flex: 1; display: flex; align-items: center; gap: 12px;">
                            <div class="avatar sync-avatar" style="width: 44px; height: 44px; font-size: 24px; border-radius: 50%; background-color: #F0F4C3; display: flex; justify-content: center; align-items: center;">🍬</div>
                            <div style="display: flex; flex-direction: column; gap: 2px;">
                                <div class="user-name" id="app-settings-nickname" style="font-size: 16px; font-weight: 600; color: var(--text-main);">未命名市民</div>
                                <div class="user-handle" id="app-settings-icity-id" style="font-size: 13px; color: var(--text-sub); font-weight: normal;">diary_user</div>
                            </div>
                        </div>
                        <div class="item-value right-align" style="font-size: 14px;">修改资料</div>
                        <svg class="arrow-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="9 18 15 12 9 6"></polyline></svg>
                    </div>
                </div>

                <!-- 账户与安全 -->
                <div class="settings-group">
                    <div class="settings-item" style="cursor: pointer;">
                        <div class="item-label" style="width: auto; flex: 1;">账户与安全</div>
                        <div class="item-value right-align" style="font-size: 14px;">Diary ID / 登录邮箱</div>
                        <svg class="arrow-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="9 18 15 12 9 6"></polyline></svg>
                    </div>
                    <div class="settings-item" style="cursor: pointer;">
                        <div class="item-label" style="width: auto; flex: 1;">Diary 市民称号 <span class="pro-tag">Pro</span></div>
                        <svg class="arrow-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="9 18 15 12 9 6"></polyline></svg>
                    </div>
                    <div class="settings-item" data-icity-open-badges role="button" tabindex="0" aria-label="查看 Diary 市民徽章" style="cursor: pointer;">
                        <div class="item-label" style="width: auto; flex: 1;">Diary 市民徽章 <span class="pro-tag">Pro</span></div>
                        <div class="item-value right-align text-blue" data-icity-badge-value style="font-size: 14px;">未设置</div>
                        <svg class="arrow-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="9 18 15 12 9 6"></polyline></svg>
                    </div>
                    <div class="settings-item" id="btn-app-settings-earth-day" style="cursor: pointer;">
                        <div class="item-label" style="width: auto; flex: 1;">我来到地球的日子</div>
                        <div class="item-value right-align text-blue" id="val-app-settings-earth-day" style="font-size: 14px;">已设置</div>
                        <svg class="arrow-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="9 18 15 12 9 6"></polyline></svg>
                    </div>
                    <div class="settings-item" id="btn-app-edit-diary-style" style="cursor: pointer;">
                        <div class="item-label" style="width: auto; flex: 1;">自定义日记文风</div>
                        <div class="item-value right-align text-light" style="font-size: 13px;">点击自定义</div>
                        <svg class="arrow-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="9 18 15 12 9 6"></polyline></svg>
                    </div>
                    <div class="settings-item" style="cursor: pointer;">
                        <div class="item-label" style="width: auto; flex: 1;">推送设置</div>
                        <svg class="arrow-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="9 18 15 12 9 6"></polyline></svg>
                    </div>
                    <div class="settings-item" style="cursor: pointer;">
                        <div class="item-label" style="width: auto; flex: 1;">隐私设置</div>
                        <svg class="arrow-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="9 18 15 12 9 6"></polyline></svg>
                    </div>
                </div>

                <!-- 排序与封存 -->
                <div class="settings-group">
                    <div class="settings-item" style="cursor: pointer;">
                        <div class="item-label" style="width: auto; flex: 1;">个人主页模块排序 <span class="pro-tag">Pro</span></div>
                        <svg class="arrow-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="9 18 15 12 9 6"></polyline></svg>
                    </div>
                    <div class="settings-item" style="cursor: pointer;">
                        <div class="item-label" style="width: auto; flex: 1;">日记本排序 <span class="pro-tag">Pro</span></div>
                        <svg class="arrow-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="9 18 15 12 9 6"></polyline></svg>
                    </div>
                    <div class="settings-item" style="cursor: pointer;">
                        <div class="item-label" style="width: auto; flex: 1;">我的封存日记</div>
                        <svg class="arrow-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="9 18 15 12 9 6"></polyline></svg>
                    </div>
                </div>

                <!-- 主题与字体 -->
                <div class="settings-group">
                    <div class="settings-item" style="cursor: pointer;">
                        <div class="item-label" style="width: auto; flex: 1;">皮肤</div>
                        <div class="item-value right-align text-blue" style="font-size: 14px;">白昼主题</div>
                        <svg class="arrow-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="9 18 15 12 9 6"></polyline></svg>
                    </div>
                    <div class="settings-item" style="cursor: pointer;">
                        <div class="item-label" style="width: auto; flex: 1;">日记内页字体</div>
                        <div class="item-value right-align text-blue" style="font-size: 14px;">自动</div>
                        <svg class="arrow-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="9 18 15 12 9 6"></polyline></svg>
                    </div>
                </div>

                <!-- 提醒设置 -->
                <div class="settings-group">
                    <div class="settings-item">
                        <div class="item-label" style="width: auto; flex: 1;">每天提醒写日记</div>
                        <label class="switch">
                            <input type="checkbox" checked>
                            <span class="slider"></span>
                        </label>
                    </div>
                    <div class="settings-item" style="cursor: pointer;">
                        <div class="item-label" style="width: auto; flex: 1;">提醒时间</div>
                        <div class="item-value right-align text-blue" style="font-size: 14px;">20:33</div>
                        <svg class="arrow-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="9 18 15 12 9 6"></polyline></svg>
                    </div>
                </div>

                <!-- 缓存清理 -->
                <div class="settings-group">
                    <div class="settings-item" id="btn-clear-list-cache" style="cursor: pointer;">
                        <div class="item-label" style="width: auto; flex: 1;">清空列表缓存</div>
                        <div class="item-value right-align" id="val-list-cache" style="font-size: 14px;">11.3 MB</div>
                    </div>
                    <div class="settings-item" id="btn-clear-img-cache" style="cursor: pointer;">
                        <div class="item-label" style="width: auto; flex: 1;">清空图片缓存</div>
                        <div class="item-value right-align" id="val-img-cache" style="font-size: 14px;">3.4 MB</div>
                    </div>
                </div>

                <!-- 退出账号 -->
                <div class="settings-group">
                    <div class="settings-item" style="cursor: pointer;">
                        <div class="item-label" style="width: auto; flex: 1; color: #FF3B30;">退出账号</div>
                    </div>
                </div>

                <!-- 关于 -->
                <div class="settings-group">
                    <div class="settings-item" style="cursor: pointer;">
                        <div class="item-label" style="width: auto; flex: 1;">关于</div>
                        <div class="item-value right-align" style="font-size: 14px;">1.12 (Build 656)</div>
                        <svg class="arrow-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="9 18 15 12 9 6"></polyline></svg>
                    </div>
                </div>
            </main>
        </div>

        <!-- ================= 视图 20：自定义日记文风全屏页 ================= -->
        <div id="view-diary-style-setting" class="view-container" style="background-color: var(--bg-main);">
            <header class="header-settings" style="align-items: center; padding: var(--icity-top-safe-offset) 16px 0 16px; height: var(--icity-compact-header-height);">
                <div class="back-btn" id="btn-back-diary-style" style="width: auto; gap: 2px; cursor: pointer;">
                    <svg viewBox="0 0 24 24" width="20" height="20" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round"><polyline points="15 18 9 12 15 6"></polyline></svg>
                </div>
                <div class="title" style="bottom: auto; position: static; transform: none;">日记文风设置</div>
                <div class="done-btn" id="btn-save-diary-style" style="background-color: #34C759; color: white; padding: 4px 14px; border-radius: 4px; font-size: 13px; font-weight: 600; cursor: pointer;">保存</div>
            </header>

            <main class="content-scroll" style="padding: 12px 14px 60px;">
                <div style="font-size: 12px; color: var(--text-light); margin-bottom: 8px; line-height: 1.5;">
                    设置生成角色日记时遵循的核心文风美学提示词。AI 角色撰写日记时将优先遵从该设定。
                </div>
                <div class="card-box" style="padding: 12px; margin: 0 0 14px 0; background: var(--white); border-radius: 6px;">
                    <textarea id="input-custom-diary-style" style="width: 100%; min-height: 220px; border: none; outline: none; background: transparent; font-size: 14px; line-height: 1.6; color: var(--text-main); font-family: inherit; resize: vertical; box-sizing: border-box;" placeholder="输入自定义日记文风提示词..."></textarea>
                </div>
                <button type="button" id="btn-reset-diary-style" style="width: 100%; height: 42px; border-radius: 8px; border: 1px solid var(--border-color); background: var(--white); color: var(--text-sub); font-size: 14px; font-weight: 600; cursor: pointer;">恢复默认文风</button>
            </main>
        </div>

        <!-- ================= 视图 9：我来到地球的日子设置页 ================= -->
        <div id="view-earth-day" class="view-container">
            <header class="header-settings" style="align-items: center; padding: var(--icity-top-safe-offset) 16px 0 16px; height: var(--icity-compact-header-height);">
                <div class="back-btn" id="btn-back-earth-day" style="width: auto; gap: 2px; cursor: pointer;">
                    <svg viewBox="0 0 24 24" width="20" height="20" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round"><polyline points="15 18 9 12 15 6"></polyline></svg>
                </div>
                <div class="title" style="bottom: auto; position: static; transform: none;">我来到地球的日子</div>
                <div class="done-btn" id="btn-save-earth-day" style="background-color: #34C759; color: white; padding: 4px 12px; border-radius: 4px; font-size: 13px; font-weight: 500; cursor: pointer;">保存</div>
            </header>

            <main class="content-scroll" style="padding-top: 0;">
                <div style="padding: 16px 16px 8px 16px; font-size: 13px; color: var(--text-sub);">日记预览</div>
                <div class="card-box" style="padding: 16px; margin-bottom: 8px;">
                    <div class="single-post-header" style="margin-bottom: 12px;">
                        <div class="avatar sync-avatar" style="width: 36px; height: 36px; font-size: 20px; border-radius: 50%; background-color: #F0F4C3; display: flex; justify-content: center; align-items: center;">🍬</div>
                        <div class="user-info">
                            <div class="name user-name">未命名市民</div>
                            <div class="username user-handle">@diary_user</div>
                        </div>
                    </div>
                    <div style="font-size: 15px; color: var(--text-main); margin-bottom: 12px; font-weight: 500;">为日记添加个人时间线，记录来到地球的每一天。</div>
                    <div style="font-size: 12px; color: var(--text-light); display: flex; align-items: center; gap: 4px;" id="preview-earth-day-container">
                        <svg viewBox="0 0 24 24" style="width: 14px; height: 14px; fill: none; stroke: currentColor; stroke-width: 2;"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>
                        <span>2026-08-05 23:16</span> <span style="color: #E0E0E0; margin: 0 4px;">|</span> <span id="preview-earth-day-text">来到地球第 8672 天</span>
                    </div>
                </div>
                <div style="text-align: center; font-size: 12px; color: var(--text-light); margin-bottom: 16px;">
                    *每一篇日记会显示你来到地球的天数，<br>你可以尝试自己的文案哦
                </div>

                <div style="padding: 16px 16px 8px 16px; font-size: 13px; color: var(--text-sub); display: flex; align-items: center; gap: 4px;">
                    <svg viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" stroke-width="2" fill="none"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"></path></svg> 自定义
                </div>
                <div class="settings-group" style="margin-top: 0;">
                    <div class="settings-item">
                        <div class="item-label" style="width: auto; flex: 1;">在日记中显示「我来到地球的日子」</div>
                        <label class="switch">
                            <input type="checkbox" id="switch-earth-day-show" checked>
                            <span class="slider"></span>
                        </label>
                    </div>
                    <div class="settings-item">
                        <div class="item-label" style="width: auto;">自定义文案</div>
                        <input type="text" id="input-earth-day-text" value="来到地球第" style="flex: 1; text-align: right; border: none; outline: none; font-size: 14px; color: var(--theme-blue); background: transparent;">
                    </div>
                    <div class="settings-item" style="cursor: pointer;">
                        <div class="item-label" style="width: auto; flex: 1;">谁可以看</div>
                        <div class="item-value right-align" style="font-size: 14px;">仅自己</div>
                        <svg class="arrow-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="9 18 15 12 9 6"></polyline></svg>
                    </div>
                </div>

                <div class="settings-group">
                    <div class="settings-item">
                        <div class="item-label" style="width: auto; flex: 1;">在日记提醒中显示</div>
                        <label class="switch">
                            <input type="checkbox" checked>
                            <span class="slider"></span>
                        </label>
                    </div>
                </div>

                <div class="settings-group">
                    <div class="settings-item">
                        <div class="item-label" style="width: auto; flex: 1;">出生日期</div>
                        <input type="date" id="input-earth-day-birth" style="border: none; outline: none; font-size: 14px; color: var(--theme-blue); background: transparent; text-align: right; font-family: inherit;">
                    </div>
                    <div class="settings-item" id="btn-clear-birth" style="cursor: pointer;">
                        <div class="item-label" style="width: auto; flex: 1; color: #FF3B30;">清除出生日期</div>
                    </div>
                </div>

                <div style="text-align: center; font-size: 11px; color: var(--text-light); margin-top: 16px;">
                    每 365 天可修改一次，上次修改：2026-08-05 23:12
                </div>
            </main>
        </div>

        <!-- ================= 视图 7：单篇日记详情页 ================= -->
        <div id="view-single-post" class="view-container" style="background-color: #F1EFEF;">
            <header class="header-single-post">
                <div class="back-btn" id="btn-back-single-post">
                    <svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round"><polyline points="15 18 9 12 15 6"></polyline></svg>
                </div>
                <div class="title" id="single-post-header-title">用户名 · 日记</div>
                <div class="right-placeholder" style="width: 40px; display: flex; justify-content: flex-end; align-items: center;">
                    <div id="btn-single-post-send-ai-interaction" style="cursor: pointer; display: flex; align-items: center; justify-content: center; width: 32px; height: 32px; color: var(--text-sub);" title="生成互动评论">
                        <svg viewBox="0 0 1024 1024" width="20" height="20" fill="currentColor">
                            <path d="M865.278009 7.040021a118.38108 118.38108 0 0 1 155.795348 86.082045 118.38108 118.38108 0 0 1-4.384485 65.255743h0.14615l-261.607573 784.165046h-0.073075a118.38108 118.38108 0 0 1-85.132073 77.970749 116.846511 116.846511 0 0 1-111.219756-31.568288v0.073075l-140.449653-139.79198-147.245603 76.216955a36.537371 36.537371 0 0 1-53.344561-33.395157l6.138279-237.931356L34.856651 464.999423A116.773436 116.773436 0 0 1 2.92299 359.625646H2.77684a118.38108 118.38108 0 0 1 78.189973-90.904978l0.292299-0.073075 784.091971-261.607572z m49.763898 67.082612a45.306339 45.306339 0 0 0-26.599205 2.192242L104.49688 337.849373h0.073074a45.452489 45.452489 0 0 0-29.887569 34.856652l-0.146149 0.876897a43.844845 43.844845 0 0 0 11.911183 39.825734l200.22479 200.22479a36.537371 36.537371 0 0 1 10.741987 26.81843l-4.969082 191.74812 116.042688-59.921287 5.480606-2.338392a36.537371 36.537371 0 0 1 37.048894 8.842044l159.37601 158.572188 0.365374 0.365374a43.990994 43.990994 0 0 0 41.798752 11.911182l0.511523-0.073074a45.306339 45.306339 0 0 0 32.737484-29.960644v-0.073075l261.607573-784.091971 0.438448-1.169196a45.306339 45.306339 0 0 0-32.810559-60.067437z"></path>
                            <path d="M935.356685 29.69319a36.537371 36.537371 0 0 1 46.767835 56.121401l-697.863777 581.674939a36.537371 36.537371 0 0 1-46.767835-56.121401L935.356685 29.69319z"></path>
                        </svg>
                    </div>
                </div>
            </header>

            <main class="content-scroll" style="padding-bottom: 60px; padding-top: 0;">
                <div class="single-post-card">
                    <div class="single-post-header">
                        <div class="avatar" id="single-post-avatar">🍦</div>
                        <div class="user-info">
                            <div class="name" id="single-post-name">用户名</div>
                            <div class="username" id="single-post-handle">@handle</div>
                        </div>
                    </div>

                    <div class="single-post-content" id="single-post-text">内容</div>
                    <div id="single-post-img-container"></div>

                    <div class="single-post-meta" id="single-post-location-container" style="display: none; margin-bottom: 8px; color: var(--theme-blue);">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M17.5 19H9a7 7 0 1 1 6.71-9h1.79a4.5 4.5 0 1 1 0 9Z"></path></svg>
                        <span id="single-post-location"></span>
                    </div>

                    <div class="single-post-meta" style="justify-content: space-between;">
                        <div style="display: flex; align-items: center; gap: 4px;">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>
                            <span id="single-post-time">2026-08-05 23:12</span> <span id="single-post-earth-day"><span style="color: #E0E0E0; margin: 0 4px;">|</span> 来到地球第 8672 天</span>
                        </div>
                        <div id="single-post-visibility" style="display: flex; align-items: center; gap: 4px; color: var(--text-light);">
                            <!-- 动态插入权限图标和文字 -->
                        </div>
                    </div>

                    <!-- 小纸条渲染容器 -->
                    <div id="single-post-notes-container"></div>

                    <div class="single-post-actions">
                        <div class="single-action-btn btn-like">
                            <svg viewBox="0 0 24 24" style="width: 20px; height: 20px; fill: none; stroke: currentColor; stroke-width: 2;"><path stroke-linecap="round" stroke-linejoin="round" d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"></path></svg>
                            喜欢
                        </div>
                        <div class="single-action-btn btn-note">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" id="Bookmark-Add--Streamline-Rounded-Material" stroke="currentColor" stroke-width="0.5">
                                <path fill="currentColor" d="m12 18 -4.9 2.1c-0.5 0.21665 -0.975 0.177 -1.425 -0.119 -0.45 -0.29585 -0.675 -0.7145 -0.675 -1.256V4.375c0 -0.4 0.15 -0.75 0.45 -1.05 0.3 -0.3 0.65 -0.45 1.05 -0.45h6.5c0.2125 0 0.39065 0.072335 0.5345 0.217 0.14365 0.1445 0.2155 0.323665 0.2155 0.5375 0 0.213665 -0.07185 0.391335 -0.2155 0.533 -0.14385 0.141665 -0.322 0.2125 -0.5345 0.2125H6.5v14.35l5.5 -2.325 5.5 2.325v-7.6c0 -0.2125 0.07235 -0.39065 0.217 -0.5345 0.1445 -0.14365 0.32365 -0.2155 0.5375 -0.2155 0.21365 0 0.39135 0.07185 0.533 0.2155 0.14165 0.14385 0.2125 0.322 0.2125 0.5345v7.6c0 0.5415 -0.225 0.96015 -0.675 1.256 -0.45 0.296 -0.925 0.33565 -1.425 0.119L12 18Zm0 -13.625H6.5h7.25H12Zm5.5 2.25h-1.5c-0.2125 0 -0.3906 -0.07235 -0.53425 -0.217 -0.14385 -0.1445 -0.21575 -0.32365 -0.21575 -0.5375 0 -0.21365 0.0719 -0.39135 0.21575 -0.533 0.14365 -0.14165 0.32175 -0.2125 0.53425 -0.2125h1.5v-1.5c0 -0.2125 0.07235 -0.390665 0.217 -0.5345 0.1445 -0.143665 0.32365 -0.2155 0.5375 -0.2155 0.21365 0 0.39135 0.071835 0.533 0.2155 0.14165 0.143835 0.2125 0.322 0.2125 0.5345v1.5h1.5c0.2125 0 0.39065 0.07235 0.5345 0.217 0.14365 0.1445 0.2155 0.32365 0.2155 0.5375 0 0.21365 -0.07185 0.39135 -0.2155 0.533 -0.14385 0.14165 -0.322 0.2125 -0.5345 0.2125h-1.5v1.5c0 0.2125 -0.07235 0.3906 -0.217 0.53425 -0.1445 0.14385 -0.32365 0.21575 -0.5375 0.21575 -0.21365 0 -0.39135 -0.0719 -0.533 -0.21575 -0.14165 -0.14365 -0.2125 -0.32175 -0.2125 -0.53425v-1.5Z"></path>
                            </svg>
                            小纸条
                        </div>
                        <div class="single-action-btn btn-save">
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none">
                                <path d="M 13 5 L 6 5 C 4.895 5 4 5.895 4 7 L 4 19 C 4 20.105 4.895 21 6 21 L 18 21 C 19.105 21 20 20.105 20 19 L 20 12" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                                <g transform="translate(9, 1.5) scale(0.85)">
                                    <path fill="currentColor" d="m15.6757625 8.11543125 -5.59984375 5.59985c-0.30465 0.30498125 -0.8252125 0.1658125 -0.9370125 -0.2505125 -0.0127625 -0.0475125 -0.01920625 -0.0964875 -0.0191625 -0.14568125v-2.783825c-3.99689375 0.22679375 -6.73731875 2.818825 -7.5066 3.63990625 -0.4419625 0.47199375 -1.2291375 0.28855 -1.41691875 -0.3302 -0.03343125 -0.1101625 -0.0438625 -0.22601875 -0.0306375 -0.3403875 0.2596875 -2.2581375 1.49655625 -4.430175 3.4831 -6.11573125 1.64985625 -1.3999625 3.65530625 -2.2882375 5.47105625 -2.44363125V2.11939375c-0.00034375 -0.431075 0.4661 -0.70086875 0.83959375 -0.48561875 0.04261875 0.02455625 0.0818125 0.054625 0.116575 0.08943125l5.59985 5.59984375c0.21898125 0.2187375 0.21898125 0.57364375 0 0.79238125Z"></path>
                                </g>
                            </svg>
                            存为图片
                        </div>
                        <div class="single-action-btn btn-more">
                            <svg viewBox="0 0 24 24" fill="currentColor" stroke="none"><circle cx="4" cy="12" r="2.5"></circle><circle cx="12" cy="12" r="2.5"></circle><circle cx="20" cy="12" r="2.5"></circle></svg>

                            <div class="menu-overlay" id="menuOverlay" style="display: none;"></div>

                            <div class="popover-menu" id="popoverMenu" style="display: none;">
                                <div class="menu-row">
                                    <div class="menu-item text-red" id="menu-delete">
                                        <svg class="icon-red" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path><line x1="10" y1="11" x2="10" y2="17"></line><line x1="14" y1="11" x2="14" y2="17"></line></svg>
                                        删除
                                    </div>
                                    <div class="menu-item">
                                        <svg class="icon-gray" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="21 8 21 21 3 21 3 8"></polyline><rect x="1" y="3" width="22" height="5"></rect><line x1="10" y1="12" x2="14" y2="12"></line></svg>
                                        封存
                                    </div>
                                </div>
                                <div class="menu-row">
                                    <div class="menu-item" id="menu-edit">
                                        <svg class="icon-yellow" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>
                                        编辑内容
                                    </div>
                                    <div class="menu-item" id="menu-pin">
                                        <svg class="icon-green" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="17" x2="12" y2="22"></line><path d="M5 17h14v-1.76a2 2 0 0 0-1.11-1.79l-1.78-.9A2 2 0 0 1 15 10.6V6a3 3 0 0 0-3-3h0a3 3 0 0 0-3 3v4.6a2 2 0 0 1-1.11 1.79l-1.78.9A2 2 0 0 0 5 15.24Z"></path></svg>
                                        置顶日记
                                    </div>
                                </div>
                                <div class="menu-row">
                                    <div class="menu-item" id="menu-diary">
                                        <svg class="icon-blue" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"></path></svg>
                                        选择日记本
                                    </div>
                                </div>
                                <div class="menu-row">
                                    <div class="menu-item" id="menu-visibility">修改权限</div>
                                </div>
                                <div class="menu-row">
                                    <div class="menu-item">复制日记链接</div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- 评论区 -->
                    <div class="single-post-comments-section" id="comments-section">
                        <div class="comments-header">
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="-0.5 -0.5 16 16" style="width: 14px; height: 14px; fill: none; stroke: currentColor;"><path stroke-linecap="round" stroke-linejoin="round" d="M11.875 2.5H3.125a1.25 1.25 0 0 0 -1.25 1.25v6.25a1.25 1.25 0 0 0 1.25 1.25h1.9925000000000002c0.625 0 1.1325 0.5068750000000001 1.1325 1.1325 0 0.505 0.61 0.7575 0.9668749999999999 0.400625l1.166875 -1.166875A1.25 1.25 0 0 1 9.2675 11.25H11.875a1.25 1.25 0 0 0 1.25 -1.25V3.75a1.25 1.25 0 0 0 -1.25 -1.25z" stroke-width="1.2"></path></svg>
                            <span id="comments-count">0 条评论</span>
                            <svg class="toggle-icon" viewBox="0 0 24 24" style="width: 14px; height: 14px; fill: none; stroke: currentColor; stroke-width: 2;"><polyline points="6 9 12 15 18 9"></polyline></svg>
                        </div>
                        <div id="single-post-comments-container"></div>
                    </div>

                </div>
            </main>

            <div class="single-post-comment-bar">
                <input type="text" class="single-post-comment-input" placeholder="我要评论">
                <button class="single-post-comment-send">
                    <svg viewBox="0 0 16 16"><path d="M15.413215625 0.33158125c0.309246875 0.21433125 0.471525 0.584815625 0.41335 0.955303125l-1.95959375 12.737359375c-0.045928125 0.297 -0.226578125 0.557259375 -0.489896875 0.704228125s-0.57869375 0.165340625 -0.857321875 0.048990625l-3.661990625 -1.521746875 -2.097378125 2.268840625c-0.27250625 0.297003125 -0.70116875 0.39498125 -1.077778125 0.2480125s-0.621559375 -0.51133125 -0.621559375 -0.915496875v-2.559721875c0 -0.122475 0.045928125 -0.238825 0.1286 -0.32761875l5.1316875 -5.60015c0.1775875 -0.1929 0.1714625 -0.4899 -0.01225 -0.6736125s-0.4807125 -0.195959375 -0.673609375 -0.02143125L3.407640625 11.207328125l-2.703628125 -1.353346875C0.37945625 9.691703125 0.17125 9.367146875 0.1620625 9.005846875s0.18065 -0.69810625 0.4929625 -0.87875625l13.71715625 -7.838375c0.32761875 -0.186775 0.731784375 -0.168403125 1.041034375 0.042865625Z"></path></svg>
                    发送
                </button>
            </div>
        </div>

        <!-- ================= 视图 10：独立私信聊天页 ================= -->
        <div id="view-chat" class="view-container" style="background-color: var(--bg-main); position: relative; width: 100%; height: 100%; overflow: hidden;">
            <header class="header-single-post" style="background-color: var(--bg-main); border-bottom: 0.5px solid var(--border-color); height: var(--icity-nav-header-height); box-sizing: border-box; width: 100%;">
                <div class="back-btn" id="btn-back-chat" style="cursor: pointer;">
                    <svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" stroke-width="2.2" fill="none" stroke-linecap="round" stroke-linejoin="round"><polyline points="15 18 9 12 15 6"></polyline></svg>
                </div>
                <div style="flex: 1; display: flex; flex-direction: column; align-items: center; justify-content: center;">
                    <div id="chat-room-title" style="font-size: 16px; font-weight: 800; color: var(--text-main); line-height: 1.2;">私信</div>
                    <div id="chat-room-handle" style="font-size: 11px; color: var(--text-light); line-height: 1.2; margin-top: 2px;">@xxxx</div>
                </div>
                <button type="button" id="btn-delete-chat-thread" aria-label="删除当前私信会话" title="删除会话" style="border: none; background: transparent; color: var(--text-light); width: 36px; height: 36px; cursor: pointer;">
                    <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M3 6h18M9 6V3h6v3M5 6l1 15h12l1-15M10 10v7m4-7v7"></path></svg>
                </button>
                <div class="chat-header-right-btn" id="btn-chat-to-profile" style="width: 40px; display: flex; justify-content: flex-end; cursor: pointer; color: var(--text-light);">
                    <svg viewBox="0 0 24 24" width="22" height="22" fill="currentColor"><circle cx="5" cy="12" r="2"></circle><circle cx="12" cy="12" r="2"></circle><circle cx="19" cy="12" r="2"></circle></svg>
                </div>
            </header>

            <main class="content-scroll" id="chat-messages-container" style="padding: 16px 12px 85px 12px; display: flex; flex-direction: column; gap: 14px; background-color: var(--bg-main); width: 100%; box-sizing: border-box;">
                <div style="padding: 30px; text-align: center; color: var(--text-light); font-size: 13px;">暂无私信记录</div>
            </main>

            <div class="chat-bottom-bar" style="position: absolute; bottom: 0; left: 0; right: 0; width: 100%; box-sizing: border-box; background-color: var(--bg-main); border-top: 0.5px solid var(--border-color); padding: 8px 12px calc(8px + env(safe-area-inset-bottom, 0px)); display: flex; align-items: center; gap: 8px; z-index: 20;">
                <div style="flex: 1; min-width: 0; position: relative;">
                    <input type="text" class="chat-message-input" id="input-chat-message" enterkeyhint="send" placeholder="输入消息" style="width: 100%; height: 38px; border: 1px solid var(--border-color); border-radius: 4px; padding: 0 40px 0 10px; font-size: 14px; outline: none; background: var(--white); color: var(--text-main); box-sizing: border-box;">
                    <button type="button" id="btn-send-chat-text" aria-label="只发送文字" title="只发送文字，可连续发送" style="position: absolute; right: 0; top: 0; width: 38px; height: 38px; border: none; background: transparent; color: var(--text-sub); display: grid; place-items: center; cursor: pointer;">
                        <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 19V5m-6 6 6-6 6 6"></path></svg>
                    </button>
                </div>
                <button type="button" class="chat-message-send-btn" id="btn-send-chat-message" aria-label="调取 API 生成回复" title="调取 API 生成回复" style="height: 38px; padding: 0 14px; background-color: #34C759; color: #FFFFFF; border: none; border-radius: 6px; font-size: 14px; font-weight: 600; display: flex; align-items: center; gap: 5px; cursor: pointer; white-space: nowrap; flex-shrink: 0; box-sizing: border-box;">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" height="15" width="15" fill="currentColor">
                        <path d="M15.413215625 0.33158125c0.309246875 0.21433125 0.471525 0.584815625 0.41335 0.955303125l-1.95959375 12.737359375c-0.045928125 0.297 -0.226578125 0.557259375 -0.489896875 0.704228125s-0.57869375 0.165340625 -0.857321875 0.048990625l-3.661990625 -1.521746875 -2.097378125 2.268840625c-0.27250625 0.297003125 -0.70116875 0.39498125 -1.077778125 0.2480125s-0.621559375 -0.51133125 -0.621559375 -0.915496875v-2.559721875c0 -0.122475 0.045928125 -0.238825 0.1286 -0.32761875l5.1316875 -5.60015c0.1775875 -0.1929 0.1714625 -0.4899 -0.01225 -0.6736125s-0.4807125 -0.195959375 -0.673609375 -0.02143125L3.407640625 11.207328125l-2.703628125 -1.353346875C0.37945625 9.691703125 0.17125 9.367146875 0.1620625 9.005846875s0.18065 -0.69810625 0.4929625 -0.87875625l13.71715625 -7.838375c0.32761875 -0.186775 0.731784375 -0.168403125 1.041034375 0.042865625Z"></path>
                    </svg>
                    发送
                </button>
            </div>
        </div>

        <!-- ================= 视图 11：Q&A 问答页 ================= -->
        <div id="view-qa-page" class="view-container" style="background-color: #F1EFEF;">
            <header class="header-settings" style="align-items: center; padding: var(--icity-top-safe-offset) 16px 0 16px; height: var(--icity-compact-header-height);">
                <div class="back-btn" id="btn-back-qa-page" style="width: 40px; cursor: pointer;">
                    <svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round"><polyline points="15 18 9 12 15 6"></polyline></svg>
                </div>
                <div class="title" style="bottom: auto; position: static; transform: none;">
                    <span class="qa-title-pill">Q & A</span>
                </div>
                <div style="width: 40px; display: flex; justify-content: flex-end; color: var(--text-main);">
                    <span class="qa-header-link" data-qa-open-matches="true">同好</span>
                </div>
            </header>
            <main class="content-scroll" style="padding-top: 0;">
                <section id="icity-qa-overview">
                    <div class="qa-page-subheader"><div class="left">QA 分类</div><div class="right" id="icity-qa-total-progress">已完成 0/44题</div></div>
                    <div class="qa-grid">
                        <div class="qa-category-card" data-qa-category="关于我"><div class="qa-cat-icon" style="background-color: #AECBFA;">📋</div><div class="qa-cat-info"><div class="qa-cat-top"><span class="qa-cat-name">关于我</span><span class="qa-cat-percent">0%</span></div><div class="qa-progress-track"><div class="qa-progress-fill"></div></div></div></div>
                        <div class="qa-category-card" data-qa-category="电影"><div class="qa-cat-icon" style="background-color: #80CBC4;">🎬</div><div class="qa-cat-info"><div class="qa-cat-top"><span class="qa-cat-name">电影</span><span class="qa-cat-percent">0%</span></div><div class="qa-progress-track"><div class="qa-progress-fill"></div></div></div></div>
                        <div class="qa-category-card" data-qa-category="阅读"><div class="qa-cat-icon" style="background-color: #9FA8DA;">📘</div><div class="qa-cat-info"><div class="qa-cat-top"><span class="qa-cat-name">阅读</span><span class="qa-cat-percent">0%</span></div><div class="qa-progress-track"><div class="qa-progress-fill"></div></div></div></div>
                        <div class="qa-category-card" data-qa-category="音乐"><div class="qa-cat-icon" style="background-color: #FFCC80;">💿</div><div class="qa-cat-info"><div class="qa-cat-top"><span class="qa-cat-name">音乐</span><span class="qa-cat-percent">0%</span></div><div class="qa-progress-track"><div class="qa-progress-fill"></div></div></div></div>
                        <div class="qa-category-card" data-qa-category="美食料理"><div class="qa-cat-icon" style="background-color: #C5E1A5;">🍣</div><div class="qa-cat-info"><div class="qa-cat-top"><span class="qa-cat-name">美食料理</span><span class="qa-cat-percent">0%</span></div><div class="qa-progress-track"><div class="qa-progress-fill"></div></div></div></div>
                        <div class="qa-category-card" data-qa-category="旅游"><div class="qa-cat-icon" style="background-color: #90CAF9;">🌍</div><div class="qa-cat-info"><div class="qa-cat-top"><span class="qa-cat-name">旅游</span><span class="qa-cat-percent">0%</span></div><div class="qa-progress-track"><div class="qa-progress-fill"></div></div></div></div>
                        <div class="qa-category-card" data-qa-category="二次元"><div class="qa-cat-icon" style="background-color: #FFAB91;">🐰</div><div class="qa-cat-info"><div class="qa-cat-top"><span class="qa-cat-name">二次元</span><span class="qa-cat-percent">0%</span></div><div class="qa-progress-track"><div class="qa-progress-fill"></div></div></div></div>
                        <div class="qa-category-card" data-qa-category="艺术历史"><div class="qa-cat-icon" style="background-color: #B39DDB;">🖼️</div><div class="qa-cat-info"><div class="qa-cat-top"><span class="qa-cat-name">艺术历史</span><span class="qa-cat-percent">0%</span></div><div class="qa-progress-track"><div class="qa-progress-fill"></div></div></div></div>
                        <div class="qa-category-card" data-qa-category="游戏"><div class="qa-cat-icon" style="background-color: #BBDEFB;">🎮</div><div class="qa-cat-info"><div class="qa-cat-top"><span class="qa-cat-name">游戏</span><span class="qa-cat-percent">0%</span></div><div class="qa-progress-track"><div class="qa-progress-fill"></div></div></div></div>
                        <div class="qa-category-card" data-qa-category="体育"><div class="qa-cat-icon" style="background-color: #A5D6A7;">🏋️</div><div class="qa-cat-info"><div class="qa-cat-top"><span class="qa-cat-name">体育</span><span class="qa-cat-percent">0%</span></div><div class="qa-progress-track"><div class="qa-progress-fill"></div></div></div></div>
                        <div class="qa-category-card" data-qa-category="品牌消费"><div class="qa-cat-icon" style="background-color: #FFCC80;">🎁</div><div class="qa-cat-info"><div class="qa-cat-top"><span class="qa-cat-name">品牌消费</span><span class="qa-cat-percent">0%</span></div><div class="qa-progress-track"><div class="qa-progress-fill"></div></div></div></div>
                    </div>
                    <div class="qa-bottom-setting" id="icity-qa-visibility-setting" style="cursor: pointer;"><div class="left"><span>🐣</span> 我的 Q&A 权限</div><div class="right"><span id="icity-qa-visibility-value">公开</span><svg viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" stroke-width="2" fill="none"><polyline points="9 18 15 12 9 6"></polyline></svg></div></div>
                </section>
                <section id="icity-qa-question-panel" class="icity-qa-panel" style="display: none;">
                    <!-- 顶部衔接卡片：模仿 Diary 风格 -->
                    <div class="card-box icity-qa-top-header-card">
                        <div class="icity-qa-top-header-row">
                            <div class="icity-qa-top-header-left">
                                <span class="icity-qa-top-header-title" id="icity-qa-question-title">分类问题</span>
                            </div>
                            <span class="icity-qa-top-header-progress" id="icity-qa-question-progress">0/0</span>
                        </div>
                        <div class="icity-qa-ai-row">
                            <select id="icity-qa-character-select"><option value="">选择角色</option></select>
                            <button type="button" data-qa-action="generate-character">生成角色答案</button>
                            <button type="button" data-qa-action="regenerate-character" class="qa-secondary-action">重新生成</button>
                        </div>
                    </div>
                    <div id="icity-qa-question-list" style="display: flex; flex-direction: column;"></div>
                </section>
                <section id="icity-qa-match-panel" class="icity-qa-panel" style="display: none;">
                    <div class="card-box icity-qa-top-header-card" style="margin-bottom: 6px;">
                        <div class="icity-qa-top-header-row">
                            <span class="icity-qa-top-header-title">相同爱好的人</span>
                        </div>
                        <div style="font-size: 12px; color: var(--text-light); margin-top: 6px;">根据你与角色已填写的答案，使用本地算法计算相似度</div>
                    </div>
                    <div id="icity-qa-match-list" style="display: flex; flex-direction: column;"></div>
                </section>
            </main>
        </div>

        <!-- ================= 视图 12：我的日历页 ================= -->
        <div id="view-calendar" class="view-container" style="background-color: #F1EFEF;">
            <header class="header-single-post">
                <div class="back-btn" id="btn-back-calendar">
                    <svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round"><polyline points="15 18 9 12 15 6"></polyline></svg>
                </div>
                <div class="title">我的日历 · Calendar</div>
                <div class="right-placeholder"></div>
            </header>

            <!-- 年份切换栏 -->
            <div class="calendar-year-switcher">
                <div class="arrow-btn" id="btn-cal-prev-year">
                    <svg viewBox="0 0 24 24"><polyline points="15 18 9 12 15 6"></polyline></svg>
                </div>
                <div class="year-text" id="cal-current-year-display">2026</div>
                <div class="arrow-btn" id="btn-cal-next-year">
                    <svg viewBox="0 0 24 24"><polyline points="9 6 15 12 9 18"></polyline></svg>
                </div>
            </div>

            <!-- 年度记录卡片入口 -->
            <div class="card-box icity-calendar-annual-entry-card" id="btn-calendar-annual-card" style="margin: 8px 6px 0 6px; padding: 12px 14px; background: var(--white); display: flex; align-items: center; justify-content: space-between; cursor: pointer;">
                <div style="display: flex; align-items: center; gap: 10px;">
                    <span style="font-size: 20px; line-height: 1;">🎞️</span>
                    <div>
                        <div style="font-size: 14px; font-weight: 700; color: var(--text-main);" id="calendar-annual-card-title">2026 年度记录</div>
                        <div style="font-size: 11px; color: var(--text-light); margin-top: 2px;">查看年度总结报告、日志与足迹...</div>
                    </div>
                </div>
                <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="color: var(--text-light);"><polyline points="9 18 15 12 9 6"></polyline></svg>
            </div>

            <main class="content-scroll" style="padding-top: 8px;" id="calendar-feed">
                <!-- 动态渲染日历 -->
            </main>
            <section id="icity-monthly-record-panel" class="icity-monthly-record-panel" style="display: none;">
                <div class="icity-monthly-panel-header">
                    <button type="button" id="btn-back-monthly-record">‹</button>
                    <span id="icity-monthly-record-title">月度记录</span>
                    <span></span>
                </div>
                <div id="icity-monthly-source-summary" class="icity-monthly-source-summary"></div>
                <div class="icity-monthly-actions">
                    <button type="button" id="btn-generate-monthly-record">生成记录</button>
                    <button type="button" id="btn-regenerate-monthly-record">重新生成</button>
                    <button type="button" id="btn-delete-monthly-record" class="monthly-secondary-action">删除</button>
                </div>
                <div id="icity-monthly-record-fields"></div>
                <button type="button" id="btn-save-monthly-record" class="icity-monthly-save-button">保存修改</button>
            </section>
        </div>

        <!-- ================= 视图 14：全局搜索独立页 ================= -->
        <div id="view-search" class="view-container" style="background-color: #F1EFEF;">
            <header class="header-settings" style="align-items: center; padding: calc(var(--icity-top-safe-offset, 20px) + 16px) 16px 12px 16px; height: auto; box-sizing: border-box;">
                <div class="search-page-input-wrapper" style="flex: 1; display: flex; align-items: center; background: #E5E5EA; border-radius: 10px; padding: 7px 12px; gap: 8px;">
                    <svg viewBox="0 0 24 24" width="16" height="16" stroke="#8E8E93" stroke-width="2.5" fill="none"><circle cx="11" cy="11" r="7"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
                    <input type="text" id="input-global-search" placeholder="搜索日记正文、地点、作者..." style="border:none; outline:none; background:transparent; font-size:14px; width:100%; color:var(--text-main);">
                    <div id="btn-clear-search-input" style="display:none; cursor:pointer; color:#8E8E93; font-size:14px;">✕</div>
                </div>
                <div id="btn-cancel-search" style="margin-left: 12px; color: var(--theme-blue); font-size: 15px; cursor: pointer; white-space: nowrap;">取消</div>
            </header>

            <div class="diary-filter-tabs" id="search-filter-tabs" style="display: none;">
                <div class="filter-tab active" data-search-scope="all">全部结果</div>
                <div class="filter-tab" data-search-scope="mine">我的日记</div>
                <div class="filter-tab" data-search-scope="friends">好友动态</div>
            </div>

            <main class="content-scroll" style="padding: 10px 12px 60px;">
                <!-- 搜索历史与发现容器 -->
                <div id="search-default-panel">
                    <div style="display: flex; justify-content: space-between; align-items: center; margin: 8px 4px 12px;">
                        <span style="font-size: 13px; font-weight: 600; color: var(--text-sub);">搜索历史</span>
                        <span id="btn-clear-search-history" style="font-size: 12px; color: var(--text-light); cursor: pointer;">清空</span>
                    </div>
                    <div id="search-history-tags" style="display: flex; flex-wrap: wrap; gap: 8px; margin-bottom: 20px;">
                        <!-- 动态历史标签 -->
                    </div>

                    <div style="font-size: 13px; font-weight: 600; color: var(--text-sub); margin: 0 4px 12px;">常用搜索标签</div>
                    <div style="display: flex; flex-wrap: wrap; gap: 8px;">
                        <div class="search-tag-chip" data-keyword="生活">生活</div>
                        <div class="search-tag-chip" data-keyword="天气">天气</div>
                        <div class="search-tag-chip" data-keyword="日常">日常</div>
                        <div class="search-tag-chip" data-keyword="驻马店">驻马店</div>
                        <div class="search-tag-chip" data-keyword="喜欢">喜欢</div>
                    </div>
                </div>

                <!-- 搜索结果渲染容器 -->
                <div id="search-results-list" style="display: none;"></div>
            </main>
        </div>

        <!-- ================= 居中弹窗：Diary Pro 荣誉市民弹窗 (高精还原参考图视觉) ================= -->
        <div class="modal-overlay" id="modal-vip">
            <div class="vip-white-dialog" role="dialog" aria-modal="true">
                <!-- 右上角圆形叉号关闭按钮 -->
                <div class="vip-white-close" id="close-vip-modal">
                    <svg viewBox="0 0 24 24" width="15" height="15" stroke="currentColor" stroke-width="2.6" fill="none"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                </div>

                <!-- 顶部专属书本插画：内嵌指定书本 SVG -->
                <div class="vip-top-book-box">
                    <div class="vip-book-container">
                        <div class="vip-book-inner-badge">
                            <span class="vip-book-badge-brand">Diary</span>
                            <span class="vip-book-badge-pro">Pro</span>
                        </div>
                        <svg class="vip-book-center-svg" viewBox="0 0 1426 1024" version="1.1" xmlns="http://www.w3.org/2000/svg">
                            <path d="M811.94113 1024c-14.713925 0-37.096926-46.281982-37.096926-46.995384 194.491335-31.657232 390.677001-63.314465 605.678656-98.092833V144.820691H1426.804842v774.487504c-2.764434 38.34538-42.358269 103.443351-66.25725 104.691805z m-743.276147 0C44.587651 1022.66237 1.248454 954.175738 0 916.722111V144.909867h48.511365v733.377689c215.001655 35.135069 408.690412 66.792302 603.092571 98.092832 0 0-22.293826 46.817034-36.918575 47.262911z m679.159105-725.708613A222.046504 222.046504 0 0 1 958.723678 38.34538C1066.447444 18.994339 1177.113995 13.465471 1302.583645 0c0 320.496038-0.445877 764.321519-0.445876 764.321519l0.445876 75.977358a1428.053296 1428.053296 0 0 0-554.759557 82.308804z m-64.830445 624.227119zM128.055735 840.031351l0.624227-75.888183S128.234085 320.317687 128.234085 0C253.971262 13.376295 364.370287 18.905164 472.629104 38.16703a221.868153 221.868153 0 0 1 210.364539 260.035182v624.227118a1433.136288 1433.136288 0 0 0-554.937908-82.397979z" fill="currentColor"></path>
                        </svg>
                    </div>
                </div>

                <!-- 居中标题与副标 -->
                <div class="vip-white-header">
                    <div class="vip-brand-row">
                        <span>Diary</span>
                        <span class="vip-pro-pill" id="vip-badge-tag">Pro</span>
                    </div>
                    <div class="vip-premium-sub">Go Premium</div>
                </div>

                <!-- 会员已激活状态信息展示区 -->
                <div class="vip-active-card" id="vip-active-info-card" style="display: none;">
                    <div class="vip-active-header">
                        <span>Diary Pro 荣誉市民</span>
                        <span style="font-size: 11px; padding: 2px 6px; border-radius: 4px; background: rgba(37,200,90,0.15); color: #25C85A;">生效中</span>
                    </div>
                    <div class="vip-active-row">
                        <span>激活时间</span>
                        <span id="vip-active-start-time">--</span>
                    </div>
                    <div class="vip-active-row">
                        <span>到期时间</span>
                        <span id="vip-active-end-time">--</span>
                    </div>
                    <button type="button" class="vip-renew-btn" id="btn-vip-show-plans">续费 Pro 荣誉市民</button>
                </div>

                <!-- 核心真实特权清单列表（带绿色粗体勾选图标，无任何emoji） -->
                <div class="vip-features-list">
                    <div class="vip-feature-item">
                        <svg class="vip-feature-check" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
                        <span>使用「转生卡」重塑 Diary ID 身份</span>
                    </div>
                    <div class="vip-feature-item">
                        <svg class="vip-feature-check" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
                        <span>探秘角色专属「内心私密日记本」</span>
                    </div>
                    <div class="vip-feature-item">
                        <svg class="vip-feature-check" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
                        <span>解锁「时光回溯」补写任意历史日记</span>
                    </div>
                    <div class="vip-feature-item">
                        <svg class="vip-feature-check" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
                        <span>佩戴市民专属称号与 4 枚徽章插槽</span>
                    </div>
                    <div class="vip-feature-item">
                        <svg class="vip-feature-check" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
                        <span>解锁九宫格多图与胶片平铺图片版式</span>
                    </div>
                    <div class="vip-feature-item">
                        <svg class="vip-feature-check" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
                        <span>相册上传自选封面打造个性日记本</span>
                    </div>
                    <div class="vip-feature-item">
                        <svg class="vip-feature-check" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
                        <span>一键装订导出 A5 纯净排版日记书 (PDF)</span>
                    </div>
                    <div class="vip-feature-item">
                        <svg class="vip-feature-check" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
                        <span>本地逐帧渲染生成日记纪录影片 (MP4)</span>
                    </div>
                    <div class="vip-feature-item">
                        <svg class="vip-feature-check" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
                        <span>专属 AI 阶段性生活总结与年度记忆报告</span>
                    </div>
                </div>

                <!-- 底部操作按钮区域：关联微信钱包支付 -->
                <div class="vip-actions-area" id="vip-subscription-actions-area">
                    <button type="button" class="vip-plan-btn is-active" id="btn-vip-buy-month" data-plan="month">
                        ${icityProCrownSvg('vip-crown-icon', 32)}
                        <span class="vip-plan-text">1 Month: $2.99</span>
                    </button>
                    <button type="button" class="vip-plan-btn is-inactive" id="btn-vip-buy-year" data-plan="year">
                        <span class="vip-plan-text">1 Year: <span class="vip-plan-price-highlight">$14.99</span> / year</span>
                    </button>
                </div>
            </div>
        </div>

        <!-- ================= 模态窗：添加市民好友完整面板 ================= -->
        <div class="modal-overlay" id="modal-add-contact">
            <div class="create-diary-content" style="height: 75%; max-height: 520px; width: 92%; max-width: 380px; background-color: var(--bg-main); border-radius: 14px; padding: 0; display: flex; flex-direction: column;">
                <div class="create-diary-header" style="background-color: var(--bg-main); border-bottom: 0.5px solid var(--border-color); height: 48px; display: flex; align-items: center; justify-content: space-between; padding: 0 16px;">
                    <div class="modal-title" style="font-size: 16px; font-weight: 700; color: var(--text-main);">添加市民好友</div>
                    <div id="close-add-contact-modal" style="cursor: pointer; color: var(--text-sub); font-size: 14px; font-weight: 500;">关闭</div>
                </div>
                <div style="padding: 10px 14px; background: var(--bg-main);">
                    <div style="display: flex; align-items: center; background: #E5E5EA; border-radius: 8px; padding: 6px 10px; gap: 6px;">
                        <svg viewBox="0 0 24 24" width="15" height="15" stroke="#8E8E93" stroke-width="2.5" fill="none"><circle cx="11" cy="11" r="7"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
                        <input type="text" id="input-search-candidate-contact" placeholder="按姓名、账号搜索市民" style="border:none; outline:none; background:transparent; font-size:13px; width:100%; color:var(--text-main);">
                    </div>
                </div>
                <div class="content-scroll" id="add-contact-list-container" style="flex: 1; padding: 0 14px 14px; overflow-y: auto;">
                    <!-- 动态注入候选市民好友列表 -->
                </div>
            </div>
        </div>

        <!-- ================= 模态窗：发起新私信完整面板 ================= -->
        <div class="modal-overlay" id="modal-new-dm">
            <div class="create-diary-content" style="height: 75%; max-height: 520px; width: 92%; max-width: 380px; background-color: var(--bg-main); border-radius: 14px; padding: 0; display: flex; flex-direction: column;">
                <div class="create-diary-header" style="background-color: var(--bg-main); border-bottom: 0.5px solid var(--border-color); height: 48px; display: flex; align-items: center; justify-content: space-between; padding: 0 16px;">
                    <div class="modal-title" style="font-size: 16px; font-weight: 700; color: var(--text-main);">发起私信</div>
                    <div id="close-new-dm-modal" style="cursor: pointer; color: var(--text-sub); font-size: 14px; font-weight: 500;">关闭</div>
                </div>
                <div style="padding: 10px 14px; background: var(--bg-main);">
                    <div style="display: flex; align-items: center; background: #E5E5EA; border-radius: 8px; padding: 6px 10px; gap: 6px;">
                        <svg viewBox="0 0 24 24" width="15" height="15" stroke="#8E8E93" stroke-width="2.5" fill="none"><circle cx="11" cy="11" r="7"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
                        <input type="text" id="input-search-dm-target" placeholder="搜索联系人发起对话" style="border:none; outline:none; background:transparent; font-size:13px; width:100%; color:var(--text-main);">
                    </div>
                </div>
                <div class="content-scroll" id="new-dm-target-list-container" style="flex: 1; padding: 0 14px 14px; overflow-y: auto;">
                    <!-- 动态注入可选联系人列表 -->
                </div>
            </div>
        </div>

        <!-- ================= 模态窗：邀请角色共同写日记完整面板 ================= -->
        <div class="modal-overlay" id="modal-invite-coauthor">
            <div class="create-diary-content" style="height: 68%; max-height: 480px; width: 92%; max-width: 380px; background-color: var(--bg-main); border-radius: 14px; padding: 0; display: flex; flex-direction: column;">
                <div class="create-diary-header" style="background-color: var(--bg-main); border-bottom: 0.5px solid var(--border-color); height: 48px; display: flex; align-items: center; justify-content: space-between; padding: 0 16px;">
                    <div class="modal-title" style="font-size: 16px; font-weight: 700; color: var(--text-main);">邀请好友共同记录</div>
                    <div id="close-invite-coauthor-modal" style="cursor: pointer; color: var(--text-sub); font-size: 14px; font-weight: 500;">取消</div>
                </div>
                <div style="padding: 10px 14px; font-size: 12px; color: var(--text-sub); line-height: 1.4;">
                    选择要邀请的市民好友。被邀请的好友将会共同在这本日记本中记录生活，日记本也将展示在其主页。
                </div>
                <div class="content-scroll" id="invite-coauthor-list-container" style="flex: 1; padding: 0 14px 14px; overflow-y: auto;">
                    <!-- 动态注入好友列表 -->
                </div>
            </div>
        </div>

        <!-- ================= 模态窗：市民徽章与称号完整面板 ================= -->
        <div class="modal-overlay" id="icity-badge-panel">
            <div class="icity-badge-modal" role="dialog" aria-modal="true"></div>
        </div>

        <!-- ================= 视图 16：日记内页字体管理独立页 ================= -->
        <div id="view-font-management" class="view-container" style="background-color: #F1EFEF;">
            <header class="header-single-post">
                <div class="back-btn" id="btn-back-font-mgr">
                    <svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round"><polyline points="15 18 9 12 15 6"></polyline></svg>
                </div>
                <div class="title">日记内页字体</div>
                <div class="right-placeholder"></div>
            </header>

            <main class="content-scroll" style="padding: 12px 14px 60px;">
                <!-- 实时字体效果预览框 -->
                <div class="card-box" style="padding: 18px; margin-bottom: 12px;">
                    <div style="font-size: 12px; color: var(--text-light); margin-bottom: 8px;">字体效果实时预览</div>
                    <div id="font-preview-sample" style="font-size: 17px; line-height: 1.6; color: var(--text-main); font-family: inherit;">
                        在晴朗的午后，写下一篇关于今天阳光与晚风的日记。时间在这里慢慢流动，每一行字都是生活留下的刻度。
                    </div>
                </div>

                <!-- 字体源管理列表 -->
                <div class="card-box" style="margin-bottom: 12px; overflow: hidden;">
                    <div style="padding: 14px 16px; border-bottom: 0.5px solid var(--border-color); font-size: 14px; font-weight: 600; color: var(--text-sub);">
                        系统预设字体
                    </div>
                    <div class="settings-item font-option-row" data-font-name="" data-font-url="" style="cursor: pointer; justify-content: space-between;">
                        <div class="item-label" style="width: auto;">系统默认字体 (San Francisco)</div>
                        <div class="font-check-mark" style="color: var(--theme-blue); font-weight: 700;">✓</div>
                    </div>
                </div>

                <!-- 上传通道 -->
                <div class="card-box" style="margin-bottom: 12px; overflow: hidden;">
                    <div style="padding: 14px 16px; border-bottom: 0.5px solid var(--border-color); font-size: 14px; font-weight: 600; color: var(--text-sub);">
                        导入新字体
                    </div>
                    <div class="settings-item" id="btn-trigger-local-font" style="cursor: pointer;">
                        <div class="item-label" style="width: auto; flex: 1;">从手机/本地文件导入字体 (.ttf / .otf / .woff2)</div>
                        <svg class="arrow-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="9 18 15 12 9 6"></polyline></svg>
                    </div>
                    <div class="settings-item" id="btn-trigger-url-font" style="cursor: pointer;">
                        <div class="item-label" style="width: auto; flex: 1;">从网络 URL 安装字体</div>
                        <svg class="arrow-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="9 18 15 12 9 6"></polyline></svg>
                    </div>
                </div>
            </main>
        </div>

        <!-- ================= 视图 18：我的回复全屏独立页 ================= -->
        <div id="view-replies-page" class="view-container" style="background-color: #F1EFEF;">
            <header class="header-single-post">
                <div class="back-btn" id="btn-back-replies-page" style="cursor: pointer;">
                    <svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round"><polyline points="15 18 9 12 15 6"></polyline></svg>
                </div>
                <div class="title">我的回复</div>
                <div class="right-placeholder" style="width: 40px;"></div>
            </header>

            <main class="content-scroll" style="padding: 10px 12px 60px;" id="replies-page-list-container">
                <!-- 动态注入我的回复 -->
            </main>
        </div>

        <!-- ================= 视图 21：我的相册全屏独立页 ================= -->
        <div id="view-photos-page" class="view-container" style="background-color: #F1EFEF;">
            <header class="header-single-post">
                <div class="back-btn" id="btn-back-photos-page" style="cursor: pointer;">
                    <svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round"><polyline points="15 18 9 12 15 6"></polyline></svg>
                </div>
                <div class="title" id="photos-page-header-title">我的相册</div>
                <div class="right-placeholder" style="width: 40px;"></div>
            </header>

            <main class="content-scroll" style="padding: 8px 6px 60px;" id="photos-page-scroll">
                <div class="card-box" style="padding: 12px 14px; margin-bottom: 8px; display: flex; justify-content: space-between; align-items: center;">
                    <span style="font-size: 14px; font-weight: 700; color: var(--text-main);">全部照片</span>
                    <span style="font-size: 12px; color: var(--text-light);" id="photos-page-total-stat">共 0 张</span>
                </div>
                <div id="photos-page-grid-container" style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 4px;">
                    <!-- 动态注入我的所有日记照片 -->
                </div>
            </main>
        </div>

        <!-- ================= 视图 19：Diary 市民称号与勋章合并全屏页 ================= -->
        <div id="view-citizen-title-page" class="view-container" style="background-color: var(--bg-main);">
            <header class="header-single-post">
                <div class="back-btn" id="btn-back-citizen-title" style="cursor: pointer; width: 40px; display: flex; align-items: center;">
                    <svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" stroke-width="2.2" fill="none" stroke-linecap="round" stroke-linejoin="round"><polyline points="15 18 9 12 15 6"></polyline></svg>
                </div>
                <div class="title" id="combined-citizen-header-title" style="font-size: 16px; font-weight: 700; color: var(--text-main);">Diary 市民称号</div>
                <div style="width: 60px; display: flex; justify-content: flex-end;">
                    <button type="button" id="btn-save-citizen-title" class="title-header-save-btn">保存</button>
                </div>
            </header>

            <main class="content-scroll" style="padding: 6px 0 60px 0;">
                <!-- 顶部市民身份预览卡片 -->
                <div class="card-box title-preview-header">
                    <div class="title-preview-avatar sync-avatar" id="title-preview-avatar"></div>
                    <div class="title-preview-info">
                        <div class="title-preview-name-row" style="display: flex; align-items: center; gap: 6px; flex-wrap: wrap;">
                            <span class="title-preview-name" id="title-preview-name">未命名市民</span>
                            <span class="title-preview-tag" id="title-preview-pill">Pro</span>
                            <span id="title-preview-badges" style="display: inline-flex; align-items: center; gap: 2px; font-size: 15px;"></span>
                        </div>
                        <div class="title-preview-sub" id="title-preview-handle">@diary_user</div>
                    </div>
                </div>

                <!-- 选择称号背景颜色卡片 -->
                <div class="card-box" style="padding: 12px 14px; margin: 0 6px 8px 6px; background: var(--white);">
                    <div class="title-section-hint" style="margin-bottom: 8px;">选择称号背景颜色</div>
                    <div class="title-color-palette" id="title-color-palette"></div>
                </div>

                <!-- 切换栏与下方内容合并的一整张大卡片 -->
                <div class="card-box citizen-unified-card">
                    <!-- 交互栏：市民称号 & 市民徽章 -->
                    <div class="title-badge-switch-nav">
                        <div class="switch-nav-item active" id="tab-switch-citizen-titles" data-switch="titles">
                            <span class="nav-icon">${icityProCrownSvg('title-crown-icon', 18)}</span>
                            <span>市民称号</span>
                        </div>
                        <div class="switch-nav-item" id="tab-switch-citizen-badges" data-switch="badges">
                            <span class="nav-icon">
                                <svg viewBox="0 0 1024 1024" width="18" height="18">
                                    <path d="M625.28 550.4H398.72c-47.36 0-85.76-38.4-85.76-85.76l-60.16-378.24c0-47.36 38.4-85.12 85.76-85.76h348.16c47.36 0 85.12 38.4 85.76 85.76l-60.16 378.88c-1.28 46.72-39.68 85.12-87.04 85.12z" fill="#2E26AF"></path>
                                    <path d="M577.28 0.64H337.92c-47.36 0-85.12 38.4-85.76 85.76l60.16 378.88c0.64 46.72 38.4 85.12 85.76 85.12 47.36 0 442.88-424.96 179.2-549.76z" fill="#4848C1"></path>
                                    <path d="M468.48 0.64H337.92c-47.36 0-85.12 38.4-85.76 85.76l37.76 236.16S593.28 138.88 468.48 0.64z" fill="#6565D6"></path>
                                    <path d="M474.88 1012.48l-327.04-181.76c-23.04-13.44-37.12-37.76-37.12-64.64V402.56c0-26.88 14.08-51.2 37.12-64.64l327.04-181.76c23.04-13.44 51.84-13.44 74.88 0l327.04 181.76c23.04 13.44 37.12 37.76 37.12 64.64v363.52c0 26.88-14.08 51.2-37.12 64.64l-327.04 181.76c-23.68 13.44-51.84 13.44-74.88 0z" fill="#FEB633"></path>
                                    <path d="M913.28 652.16v113.28c0 26.88-14.08 51.2-37.12 64.64l-327.04 181.76c-23.04 13.44-51.84 13.44-74.88 0L147.2 830.08c-23.04-13.44-37.12-37.76-37.12-64.64v-107.52s25.6-11.52 64 61.44c29.44 56.32 182.4 119.04 246.4 164.48 24.96 23.04 58.24 35.2 92.16 35.2 21.76-2.56 42.88-7.68 63.36-14.72 94.08-42.88 181.12-100.48 257.92-169.6 30.72-43.52 44.16-82.56 79.36-82.56z" fill="#FFA820"></path>
                                    <path d="M797.44 291.2L548.48 154.24c-23.68-13.44-51.84-13.44-74.88 0L146.56 336s-3.2 106.24 266.88 144.64c269.44 38.4 69.76 10.24 69.76 10.24s264.96-16.64 314.24-199.68z" fill="#FFCB34"></path>
                                    <path d="M548.48 440.96l23.04 46.08c5.12 12.16 16.64 20.48 30.08 22.4l51.2 7.04c15.36 1.92 28.16 12.8 32.64 27.52 4.48 14.72 0.64 30.72-10.24 41.6l-37.12 35.84c-9.6 9.6-14.08 23.04-11.52 35.84l8.96 50.56c2.56 15.36-3.84 30.72-16 39.68s-28.8 10.24-42.88 3.2l-45.44-24.32c-11.52-6.4-25.6-6.4-37.76 0l-45.44 24.32c-13.44 7.04-30.08 5.76-42.88-3.2a41.024 41.024 0 0 1-16-39.68l8.96-50.56a38.912 38.912 0 0 0-11.52-35.84l-37.12-35.84a41.6 41.6 0 0 1-10.24-41.6c4.48-14.72 17.28-25.6 32.64-27.52l51.2-7.04c13.44-1.92 24.32-10.24 30.72-22.4l23.04-46.08c6.4-13.44 20.48-21.76 35.2-21.76 15.36 0 29.44 8.32 36.48 21.76z" fill="#FFFFFF"></path>
                                </svg>
                            </span>
                            <span>市民徽章</span>
                        </div>
                    </div>

                    <!-- 选项卡 1：市民称号板块 -->
                    <div id="panel-content-citizen-titles">
                        <div class="title-group-subtitle" style="margin-top: 4px;">特定称号</div>
                        <div class="title-chips-grid" id="title-chips-specific"></div>

                        <div class="title-group-subtitle" style="margin-top: 18px;">心情状态</div>
                        <div class="title-chips-grid" id="title-chips-moods"></div>
                    </div>

                    <!-- 选项卡 2：市民徽章板块 (参考图风格 Emoji 网格) -->
                    <div id="panel-content-citizen-badges" style="display: none;">
                        <div class="badge-selected-header">
                            当前选择 <span id="badge-selected-count">0/4</span>
                        </div>
                        <div class="badge-selected-slots" id="badge-selected-slots">
                            <!-- 动态注入 4 个卡槽 -->
                        </div>

                        <div id="badge-categories-container">
                            <!-- 动态注入分类及对应的 Emoji 网格 -->
                        </div>
                    </div>
                </div>
            </main>
        </div>

        <!-- ================= 分离式悬浮底栏 (全局共享) ================= -->
        <div class="floating-nav-wrapper" id="main-bottom-nav">

            <!-- 左侧胶囊：包含主页、世界、私信、个人主页 -->
            <nav class="nav-left-pill">
                <!-- 1. 主页按钮 -->
                <div class="nav-item active" id="tab-home">
                    <svg class="icon-inactive" viewBox="0 0 24 24" style="fill: currentColor; stroke: none; width: 26px; height: 26px;">
                        <path fill="currentColor" d="M20.15 4a0.5 0.5 0 0 1 -0.4 -0.49V2a2 2 0 0 0 -2 -2H5.25a3 3 0 0 0 -3 3v18a3 3 0 0 0 3 3h14.5a2 2 0 0 0 2 -2V6a2 2 0 0 0 -1.6 -2Zm-2.9 9.25a0.26 0.26 0 0 1 -0.43 0.18l-1.89 -1.9a0.27 0.27 0 0 0 -0.36 0l-1.89 1.9a0.26 0.26 0 0 1 -0.28 0 0.25 0.25 0 0 1 -0.15 -0.23V5.75a0.25 0.25 0 0 1 0.25 -0.25H17a0.25 0.25 0 0 1 0.25 0.25Zm0.5 -9.54a0.25 0.25 0 0 1 -0.25 0.29H5.25a1 1 0 0 1 0 -2H17.5a0.25 0.25 0 0 1 0.25 0.25Z"></path>
                    </svg>
                    <svg class="icon-active" viewBox="0 0 24 24" style="fill: currentColor; stroke: none; width: 26px; height: 26px;">
                        <path fill="currentColor" d="M4 3.1001c2.80634 0 5.51847 0.86462 7.7988 2.59961h0.001L12 5.84912l0.2002 -0.14941C13.3684 4.8108 14.6505 4.15195 16 3.71924v8.68066l2.5 -2.5 2.5 1.5V3.1001h2c0.5523 0 1 0.44771 1 1v15c0 0.5523 -0.4477 1 -1 1h-3c-2.3908 0 -4.6756 0.7339 -6.5938 2.1953l-0.0058 0.0049 -0.8008 0.5996c-0.3555 0.2665 -0.8437 0.2665 -1.1992 0l-0.8008 -0.5996 -0.0058 -0.0049C8.67558 20.834 6.39076 20.1001 4 20.1001H1c-0.552285 0 -1 -0.4477 -1 -1v-15c0 -0.55229 0.447715 -1 1 -1zm0 12c1.72922 0 3.43034 0.4309 5 1.2227v-2.2002c-1.57921 -0.6605 -3.26873 -1.0225 -5 -1.0225zm0 -5c1.72922 0 3.43034 0.4309 5 1.2227V9.12256C7.42079 8.46207 5.73127 8.1001 4 8.1001z"></path>
                    </svg>
                </div>

                <!-- 2. 世界按钮 -->
                <div class="nav-item" id="tab-world">
                    <svg viewBox="0 0 24 24" style="fill: currentColor; stroke: none; width: 30px; height: 30px;">
                        <g>
                            <path fill="currentColor" d="M12 2c5.5228 0 10 4.47715 10 10 0 5.5228 -4.4772 10 -10 10 -5.52285 0 -10 -4.4772 -10 -10C2 6.47715 6.47715 2 12 2m4 4c0 1.10457 -0.8954 2 -2 2h-1v1c0 1.1046 -0.8954 2 -2 2v3h-0.9297c-0.66867 0 -1.29313 -0.3342 -1.66405 -0.8906L7 11H6v1c0 1.0205 -0.76457 1.8601 -1.75195 1.9824C5.13005 17.4417 8.26604 20 12 20v-2c0 -1.1046 0.8954 -2 2 -2h1.5c0 -1.1046 0.8954 -2 2 -2h2.248c0.1646 -0.6392 0.252 -1.3094 0.252 -2 0 -2.96077 -1.6093 -5.54437 -4 -6.92773zm1.9141 4.75L15.5 13.1641 14.0859 11.75 16.5 9.33594z"></path>
                        </g>
                    </svg>
                </div>

                <!-- 3. 私聊/通讯录按钮 -->
                <div class="nav-item" id="tab-message">
                    <svg viewBox="0 0 16 16" style="fill: currentColor; stroke: none; width: 28px; height: 28px;">
                        <path fill="currentColor" fill-rule="evenodd" d="M3.2026666666666666 14.429333333333332A4.471333333333333 4.471333333333333 0 0 0 4 14.5a4.480666666666666 4.480666666666666 0 0 0 2.3886666666666665 -0.6859999999999999c0.516 0.12133333333333332 1.056 0.186 1.611333333333333 0.186 3.548 0 6.5 -2.6466666666666665 6.5 -6 0 -3.3533333333333335 -2.952 -6 -6.5 -6s-6.5 2.6466666666666665 -6.5 6c0 1.6059999999999999 0.6833333333333332 3.058 1.7826666666666666 4.128 0.15466666666666667 0.15066666666666667 0.18466666666666667 0.2853333333333333 0.16933333333333334 0.362a2.4866666666666664 2.4866666666666664 0 0 1 -0.5426666666666666 1.1239999999999999 0.5 0.5 0 0 0 0.29333333333333333 0.8153333333333334ZM5.5 7.25a0.75 0.75 0 1 0 0 1.5 0.75 0.75 0 0 0 0 -1.5ZM7.25 8a0.75 0.75 0 1 1 1.5 0 0.75 0.75 0 0 1 -1.5 0Zm3.25 -0.75a0.75 0.75 0 1 0 0 1.5 0.75 0.75 0 0 0 0 -1.5Z" clip-rule="evenodd"></path>
                    </svg>
                </div>

                <!-- 4. 个人主页 -->
                <div class="nav-item" id="tab-profile">
                    <div class="nav-avatar"></div>
                </div>
            </nav>

            <!-- 右侧独立圆形：钢笔发布按钮 -->
            <div class="nav-right-circle" id="btn-publish">
                <svg viewBox="0 0 14 14" style="fill: currentColor; stroke: none; width: 24px; height: 24px;">
                    <g>
                        <path fill="currentColor" fill-rule="evenodd" d="M8.30819 0.922483 6.75003 3.00002c0.04699 0.03525 0.09174 0.074 0.13385 0.1161l4.00002 4c0.0421 0.04213 0.0809 0.08691 0.1161 0.13392l2.0776 -1.55816c0.4868 -0.36513 0.5374 -1.0768 0.1071 -1.5071L9.81529 0.815376C9.38498 0.385067 8.67332 0.435644 8.30819 0.922483ZM1.38101 5.25366 0.165741 12.9504 3.11615 9.99998l-0.30808 -0.30807c-0.24408 -0.24408 -0.24408 -0.63981 0 -0.88389 0.24408 -0.24408 0.63981 -0.24408 0.88388 0l1.5 1.49998c0.24408 0.2441 0.24408 0.6398 0 0.8839 -0.24407 0.2441 -0.6398 0.2441 -0.88388 0l-0.30804 -0.308 -2.9504 2.9504 7.69672 -1.2153c0.44506 -0.0703 0.78816 -0.4295 0.83792 -0.8773L10 8 6.00001 4l-3.74167 0.41574c-0.44782 0.04976 -0.80705 0.39286 -0.87733 0.83792Z" clip-rule="evenodd"></path>
                    </g>
                </svg>
            </div>

        </div>
        <!-- ================= 居中发布弹窗 ================= -->
        <div class="modal-overlay" id="publish-modal">
            <div class="modal-content editor-wrapper">
                <div class="modal-header">
                    <div class="modal-title-area">
                        <div class="avatar sync-avatar"></div>
                        <input type="text" class="modal-title-input" placeholder="标题 (可选)">
                    </div>
                    <div class="modal-close" id="close-modal" aria-label="关闭">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                    </div>
                </div>

                <textarea class="editor-textarea" placeholder="写点什么吧"></textarea>

                <!-- 图片预览区 -->
                <div class="image-preview-area">
                    <img class="preview-img" src="" alt="预览图">
                    <div class="remove-img-btn">✕</div>
                </div>
                <input type="file" class="input-camera" accept="image/*" style="display: none;">

                <!-- 选中的位置显示区 -->
                <div class="selected-location-display">
                    <svg viewBox="0 0 24 24"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"></path></svg>
                    <span class="location-text-top"></span>
                    <span class="clear-loc-btn">×</span>
                </div>

                <div class="editor-footer">
                    <div class="editor-tools">
                        <!-- 1. 照相机 SVG -->
                        <div class="tool-icon btn-camera">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
                                <path stroke-linecap="round" stroke-linejoin="round" d="M6.827 6.175A2.31 2.31 0 0 1 5.186 7.23c-.38.054-.757.112-1.134.175C2.999 7.58 2.25 8.507 2.25 9.574V18a2.25 2.25 0 0 0 2.25 2.25h15A2.25 2.25 0 0 0 21.75 18V9.574c0-1.067-.75-1.994-1.802-2.169a47.865 47.865 0 0 0-1.134-.175 2.31 2.31 0 0 1-1.64-1.055l-.822-1.316a2.192 2.192 0 0 0-1.736-1.039 48.774 48.774 0 0 0-5.232 0 2.192 2.192 0 0 0-1.736 1.039l-.821 1.316Z" />
                                <path stroke-linecap="round" stroke-linejoin="round" d="M16.5 12.75a4.5 4.5 0 1 1-9 0 4.5 4.5 0 0 1 9 0ZM18.75 10.5h.008v.008h-.008V10.5Z" />
                            </svg>
                        </div>
                        <!-- 2. 位置 SVG -->
                        <div class="tool-icon btn-location">
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor">
                                <path d="M8 3.52003125c-2.1554625 -0.00009375 -3.50260625 2.3332 -2.42495625 4.1999375 1.07764375 1.86673125 3.771975 1.86685 4.8497875 0.00021875 0.24579375 -0.4256875 0.3752 -0.908575 0.3752 -1.400125 0 -1.5464625 -1.25356875 -2.8001 -2.80003125 -2.80003125Zm0 4.48005c-1.293275 0.00005625 -2.1015625 -1.399925 -1.454975 -2.5199625 0.6465875 -1.1200375 2.2631875 -1.1201125 2.909875 -0.00013125 0.147475 0.2554125 0.22511875 0.54514375 0.22511875 0.840075 0 0.92781875 -0.7522 1.679975 -1.68001875 1.68001875ZM8 0.16c-3.40050625 0.00385625 -6.15620625 2.75955625 -6.1600625 6.1600625 0 2.19801875 1.0157125 4.52764375 2.94003125 6.73756875 0.8646625 0.99860625 1.8378375 1.89781875 2.90153125 2.681025 0.1928875 0.135125 0.4497125 0.135125 0.64260625 0 1.06173125 -0.78353125 2.0330125 -1.6827375 2.895925 -2.681025 1.92151875 -2.209925 2.94003125 -4.53955 2.94003125 -6.73756875C14.15620625 2.91955625 11.40050625 0.16385625 8 0.16Zm0 14.42014375c-1.1571125 -0.91000625 -5.04005 -4.25254375 -5.04005 -8.26008125 0 -3.87983125 4.20004375 -6.30473125 7.560075 -4.3648125 1.5594 0.90031875 2.520025 2.564175 2.520025 4.3648125 0 4.0061375 -3.8829375 7.350075 -5.04005 8.26008125Z" stroke-width="0.0625"></path>
                            </svg>
                        </div>
                        <!-- 3. 书本 SVG -->
                        <div class="tool-icon btn-diary">
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="-0.5 -0.5 16 16" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round">
                                <path d="M2.5 12.1875A1.5625 1.5625 0 0 1 4.0625 10.625H12.5" stroke-width="1"></path>
                                <path d="M4.0625 1.25H12.5v12.5H4.0625A1.5625 1.5625 0 0 1 2.5 12.1875v-9.375A1.5625 1.5625 0 0 1 4.0625 1.25z" stroke-width="1"></path>
                            </svg>
                            <span class="display-diary"></span>
                        </div>
                        <div class="tool-icon btn-ai-draft-action" title="AI 整理成草稿">
                            <svg viewBox="0 0 1024 1024" fill="currentColor">
                                <path d="M721.14 220.28a77.44 77.44 0 0 1 77.36 77.36 9.1 9.1 0 0 0 18.2 0A77.44 77.44 0 0 1 894 220.28a9.1 9.1 0 1 0 0-18.2 77.44 77.44 0 0 1-77.34-77.36 9.1 9.1 0 0 0-18.2 0A77.44 77.44 0 0 1 721.14 202a9.1 9.1 0 0 0 0 18.2zM237.04 591.76a5.54 5.54 0 0 0-5.54-5.54 47.06 47.06 0 0 1-47.02-47.02 5.54 5.54 0 0 0-11.06 0 47.06 47.06 0 0 1-47.02 47.02 5.54 5.54 0 0 0 0 11.06 47.06 47.06 0 0 1 47.02 47.02 5.54 5.54 0 1 0 11.06 0 47.08 47.08 0 0 1 47.02-47.02 5.54 5.54 0 0 0 5.54-5.52zM403.12 804.78a77.44 77.44 0 0 1-77.36-77.36 9.1 9.1 0 1 0-18.2 0 77.44 77.44 0 0 1-77.36 77.36 9.1 9.1 0 1 0 0 18.2 77.44 77.44 0 0 1 77.36 77.36 9.1 9.1 0 1 0 18.2 0 77.44 77.44 0 0 1 77.36-77.36 9.1 9.1 0 0 0 0-18.2zM873.6 683.58L346.1 156a120 120 0 0 0-169.72 169.7L704 853.3a120 120 0 1 0 169.7-169.72zM210.32 190a72 72 0 0 1 101.84 0l124.78 124.78-101.82 101.82-124.8-124.78a72.1 72.1 0 0 1 0-101.82z m629.34 629.34a72.1 72.1 0 0 1-101.82 0L369.06 450.56l101.82-101.82 368.78 368.78a72 72 0 0 1 0 101.82z"></path>
                            </svg>
                        </div>
                    </div>
                    <div class="editor-actions">
                        <span class="public-status">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
                              <path stroke-linecap="round" stroke-linejoin="round" d="M12 21a9.004 9.004 0 0 0 8.716-6.747M12 21a9.004 9.004 0 0 1-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 0 1 7.843 4.582M12 3a8.997 8.997 0 0 0-7.843 4.582m15.686 0A11.953 11.953 0 0 1 12 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0 1 21 12c0 .778-.099 1.533-.284 2.253m0 0A17.919 17.919 0 0 1 12 16.5c-3.162 0-6.133-.815-8.716-2.247m0 0A9.015 9.015 0 0 1 3 12c0-1.605.42-3.113 1.157-4.418" />
                            </svg>
                            公开
                        </span>
                        <button class="send-btn btn-send">
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" height="16" width="16">
                              <path d="M15.413215625 0.33158125c0.309246875 0.21433125 0.471525 0.584815625 0.41335 0.955303125l-1.95959375 12.737359375c-0.045928125 0.297 -0.226578125 0.557259375 -0.489896875 0.704228125s-0.57869375 0.165340625 -0.857321875 0.048990625l-3.661990625 -1.521746875 -2.097378125 2.268840625c-0.27250625 0.297003125 -0.70116875 0.39498125 -1.077778125 0.2480125s-0.621559375 -0.51133125 -0.621559375 -0.915496875v-2.559721875c0 -0.122475 0.045928125 -0.238825 0.1286 -0.32761875l5.1316875 -5.60015c0.1775875 -0.1929 0.1714625 -0.4899 -0.01225 -0.6736125s-0.4807125 -0.195959375 -0.673609375 -0.02143125L3.407640625 11.207328125l-2.703628125 -1.353346875C0.37945625 9.691703125 0.17125 9.367146875 0.1620625 9.005846875s0.18065 -0.69810625 0.4929625 -0.87875625l13.71715625 -7.838375c0.32761875 -0.186775 0.731784375 -0.168403125 1.041034375 0.042865625Z" fill="currentColor" stroke-width="0.0313"></path>
                            </svg>
                            发送
                        </button>
                    </div>
                </div>
            </div>
        </div>

        <!-- ================= 新建日记本弹窗 ================= -->
        <div class="modal-overlay" id="create-diary-modal">
            <div class="create-diary-content">
                <div class="create-diary-header">
                    <div class="back-btn" id="close-create-diary">
                        <svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round"><polyline points="15 18 9 12 15 6"></polyline></svg>
                    </div>
                    <div class="modal-title">新建日记本</div>
                    <button class="header-done-btn" id="btn-done-top">
                        <svg viewBox="0 0 24 24" width="18" height="18" stroke="currentColor" stroke-width="4" fill="none" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
                        完成
                    </button>
                </div>
                <div class="create-diary-body">
                    <div class="create-diary-inner-card">
                        <div class="create-diary-input-group">
                            <div class="create-diary-input-icon">
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" height="18" width="18"><path d="M14.03076875 0.16H3.7784625c-1.3322375 0.0000625 -2.41230625 1.08006875 -2.41230625 2.41230625v12.66461875c0 0.33308125 0.26999375 0.6030875 0.603075 0.603075h10.85538125c0.46425 -0.00001875 0.7544125 -0.5026 0.52226875 -0.9046375 -0.107725 -0.186575 -0.306825 -0.30150625 -0.52226875 -0.30151875H2.57230625c0 -0.6661375 0.5400125 -1.20615 1.20615625 -1.20615h10.25230625c0.3330625 -0.00001875 0.603075 -0.27001875 0.603075 -0.60308125V0.763075c0 -0.33306875 -0.27000625 -0.603075 -0.603075 -0.603075Zm-0.603075 12.0615375H3.7784625c-0.42355 -0.000575 -0.83970625 0.11100625 -1.20615625 0.3234V2.57230625c0 -0.6661625 0.53999375 -1.20618125 1.20615625 -1.20615h9.64923125Z"></path></svg>
                            </div>
                            <input type="text" id="input-diary-name" placeholder="输入日记本名称">
                        </div>

                        <div class="create-diary-input-group">
                            <div class="create-diary-input-icon">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 16 16" height="18" width="18"><path d="M12 12a1 1 0 0 0 1 -1V8.558a1 1 0 0 0 -1 -1h-1.388q0 -0.527 0.062 -1.054 0.093 -0.558 0.31 -0.992t0.559 -0.683q0.34 -0.279 0.868 -0.279V3q-0.868 0 -1.52 0.372a3.3 3.3 0 0 0 -1.085 0.992 4.9 4.9 0 0 0 -0.62 1.458A7.7 7.7 0 0 0 9 7.558V11a1 1 0 0 0 1 1zm-6 0a1 1 0 0 0 1 -1V8.558a1 1 0 0 0 -1 -1H4.612q0 -0.527 0.062 -1.054 0.094 -0.558 0.31 -0.992 0.217 -0.434 0.559 -0.683 0.34 -0.279 0.868 -0.279V3q-0.868 0 -1.52 0.372a3.3 3.3 0 0 0 -1.085 0.992 4.9 4.9 0 0 0 -0.62 1.458A7.7 7.7 0 0 0 3 7.558V11a1 1 0 0 0 1 1z"></path></svg>
                            </div>
                            <input type="text" placeholder="一句话描述这本日记">
                        </div>

                        <div class="create-diary-section-title">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 24 24" height="20" width="20" style="transform: scaleX(-1);"><path d="M15.425 23H10.15V15.05h1.875v-3.325H2V3.9h3.575V2H20v5.5H5.575v-2.1H3.5v4.825h10.025v4.825h1.9V23Zm-3.775 -1.5h2.275v-4.95H11.65V21.5Zm-4.575 -15.5H18.5V3.5H7.075v2.5Z"></path></svg>
                            选择一个封面
                        </div>

                        <div class="create-diary-cover-grid">
                            <div class="create-diary-cover-item create-diary-custom-cover" id="btn-custom-cover" style="cursor: pointer;">
                                <div class="plus">+</div>
                                <div class="text">自选封面</div>
                            </div>
                            <input type="file" id="input-custom-cover" accept="image/*" style="display: none;">
                            <div class="create-diary-cover-item"></div>
                            <div class="create-diary-cover-item"></div>
                            <div class="create-diary-cover-item"></div>
                            <div class="create-diary-cover-item"></div>
                            <div class="create-diary-cover-item"></div>
                            <div class="create-diary-cover-item"></div>
                            <div class="create-diary-cover-item"></div>
                            <div class="create-diary-cover-item"></div>
                            <div class="create-diary-cover-item"></div>
                            <div class="create-diary-cover-item"></div>
                            <div class="create-diary-cover-item"></div>
                        </div>

                        <div class="create-diary-visibility">
                            <div class="create-diary-visibility-left">
                                <svg viewBox="0 0 24 24" width="18" height="18" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon></svg>
                                谁可以看见
                            </div>
                            <div class="create-diary-visibility-right" id="btn-visibility" style="cursor: pointer;">
                                <span class="create-diary-visibility-text" id="text-visibility">仅自己</span>
                                <svg class="create-diary-visibility-arrow" viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round"><polyline points="9 18 15 12 9 6"></polyline></svg>
                            </div>
                        </div>
                        <div class="create-diary-hint">
                            温馨提示：日记本的权限设置只会影响「日记本」的可见性，每篇日记的隐私要单独设置哦~
                        </div>
                    </div>
                </div>
                <div class="create-diary-footer">
                    <button class="create-diary-bottom-btn" id="btn-done-bottom">
                        <svg viewBox="0 0 24 24" width="18" height="18" stroke="currentColor" stroke-width="4" fill="none" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
                        完成
                    </button>
                </div>
            </div>
        </div>

        <!-- ================= 全屏小纸条弹窗 ================= -->
        <div id="modal-note" class="editor-wrapper">
            <div class="note-header">
                <div class="note-title-area">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="0.2">
                        <path fill="currentColor" d="m12 18 -4.9 2.1c-0.5 0.21665 -0.975 0.177 -1.425 -0.119 -0.45 -0.29585 -0.675 -0.7145 -0.675 -1.256V4.375c0 -0.4 0.15 -0.75 0.45 -1.05 0.3 -0.3 0.65 -0.45 1.05 -0.45h6.5c0.2125 0 0.39065 0.072335 0.5345 0.217 0.14365 0.1445 0.2155 0.323665 0.2155 0.5375 0 0.213665 -0.07185 0.391335 -0.2155 0.533 -0.14385 0.141665 -0.322 0.2125 -0.5345 0.2125H6.5v14.35l5.5 -2.325 5.5 2.325v-7.6c0 -0.2125 0.07235 -0.39065 0.217 -0.5345 0.1445 -0.14365 0.32365 -0.2155 0.5375 -0.2155 0.21365 0 0.39135 0.07185 0.533 0.2155 0.14165 0.14385 0.2125 0.322 0.2125 0.5345v7.6c0 0.5415 -0.225 0.96015 -0.675 1.256 -0.45 0.296 -0.925 0.33565 -1.425 0.119L12 18Zm0 -13.625H6.5h7.25H12Zm5.5 2.25h-1.5c-0.2125 0 -0.3906 -0.07235 -0.53425 -0.217 -0.14385 -0.1445 -0.21575 -0.32365 -0.21575 -0.5375 0 -0.21365 0.0719 -0.39135 0.21575 -0.533 0.14365 -0.14165 0.32175 -0.2125 0.53425 -0.2125h1.5v-1.5c0 -0.2125 0.07235 -0.390665 0.217 -0.5345 0.1445 -0.143665 0.32365 -0.2155 0.5375 -0.2155 0.21365 0 0.39135 0.071835 0.533 0.2155 0.14165 0.143835 0.2125 0.322 0.2125 0.5345v1.5h1.5c0.2125 0 0.39065 0.07235 0.5345 0.217 0.14365 0.1445 0.2155 0.32365 0.2155 0.5375 0 0.21365 -0.07185 0.39135 -0.2155 0.533 -0.14385 0.14165 -0.322 0.2125 -0.5345 0.2125h-1.5v1.5c0 0.2125 -0.07235 0.3906 -0.217 0.53425 -0.1445 0.14385 -0.32365 0.21575 -0.5375 0.21575 -0.21365 0 -0.39135 -0.0719 -0.533 -0.21575 -0.14165 -0.14365 -0.2125 -0.32175 -0.2125 -0.53425v-1.5Z"></path>
                    </svg>
                    <input type="text" class="note-title-input" placeholder="小纸条标题 (可选)">
                </div>
                <div class="note-close" id="close-note">
                    <svg viewBox="0 0 24 24" fill="none"><path d="M18 6L6 18M6 6l12 12" stroke-linecap="round" stroke-linejoin="round"/></svg>
                </div>
            </div>
            <div class="note-body">
                <textarea class="note-textarea editor-textarea" placeholder=""></textarea>

                <!-- 图片预览区 -->
                <div class="image-preview-area">
                    <img class="preview-img" src="" alt="预览图">
                    <div class="remove-img-btn">✕</div>
                </div>
                <input type="file" class="input-camera" accept="image/*" style="display: none;">

                <!-- 选中的位置显示区 -->
                <div class="selected-location-display">
                    <svg viewBox="0 0 24 24"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"></path></svg>
                    <span class="location-text-top"></span>
                    <span class="clear-loc-btn">×</span>
                </div>
            </div>
            <div class="note-footer">
                <div class="note-tools editor-tools">
                    <div class="tool-icon btn-camera">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" d="M6.827 6.175A2.31 2.31 0 0 1 5.186 7.23c-.38.054-.757.112-1.134.175C2.999 7.58 2.25 8.507 2.25 9.574V18a2.25 2.25 0 0 0 2.25 2.25h15A2.25 2.25 0 0 0 21.75 18V9.574c0-1.067-.75-1.994-1.802-2.169a47.865 47.865 0 0 0-1.134-.175 2.31 2.31 0 0 1-1.64-1.055l-.822-1.316a2.192 2.192 0 0 0-1.736-1.039 48.774 48.774 0 0 0-5.232 0 2.192 2.192 0 0 0-1.736 1.039l-.821 1.316Z" />
                            <path stroke-linecap="round" stroke-linejoin="round" d="M16.5 12.75a4.5 4.5 0 1 1-9 0 4.5 4.5 0 0 1 9 0ZM18.75 10.5h.008v.008h-.008V10.5Z" />
                        </svg>
                    </div>
                    <div class="tool-icon btn-location">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor">
                            <path d="M8 3.52003125c-2.1554625 -0.00009375 -3.50260625 2.3332 -2.42495625 4.1999375 1.07764375 1.86673125 3.771975 1.86685 4.8497875 0.00021875 0.24579375 -0.4256875 0.3752 -0.908575 0.3752 -1.400125 0 -1.5464625 -1.25356875 -2.8001 -2.80003125 -2.80003125Zm0 4.48005c-1.293275 0.00005625 -2.1015625 -1.399925 -1.454975 -2.5199625 0.6465875 -1.1200375 2.2631875 -1.1201125 2.909875 -0.00013125 0.147475 0.2554125 0.22511875 0.54514375 0.22511875 0.840075 0 0.92781875 -0.7522 1.679975 -1.68001875 1.68001875ZM8 0.16c-3.40050625 0.00385625 -6.15620625 2.75955625 -6.1600625 6.1600625 0 2.19801875 1.0157125 4.52764375 2.94003125 6.73756875 0.8646625 0.99860625 1.8378375 1.89781875 2.90153125 2.681025 0.1928875 0.135125 0.4497125 0.135125 0.64260625 0 1.06173125 -0.78353125 2.0330125 -1.6827375 2.895925 -2.681025 1.92151875 -2.209925 2.94003125 -4.53955 2.94003125 -6.73756875C14.15620625 2.91955625 11.40050625 0.16385625 8 0.16Zm0 14.42014375c-1.1571125 -0.91000625 -5.04005 -4.25254375 -5.04005 -8.26008125 0 -3.87983125 4.20004375 -6.30473125 7.560075 -4.3648125 1.5594 0.90031875 2.520025 2.564175 2.520025 4.3648125 0 4.0061375 -3.8829375 7.350075 -5.04005 8.26008125Z" stroke-width="0.0625"></path>
                    </svg>
                </div>
            </div>
            <button class="note-send-btn" id="btn-send-note">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" height="16" width="16">
                    <path d="M15.413215625 0.33158125c0.309246875 0.21433125 0.471525 0.584815625 0.41335 0.955303125l-1.95959375 12.737359375c-0.045928125 0.297 -0.226578125 0.557259375 -0.489896875 0.704228125s-0.57869375 0.165340625 -0.857321875 0.048990625l-3.661990625 -1.521746875 -2.097378125 2.268840625c-0.27250625 0.297003125 -0.70116875 0.39498125 -1.077778125 0.2480125s-0.621559375 -0.51133125 -0.621559375 -0.915496875v-2.559721875c0 -0.122475 0.045928125 -0.238825 0.1286 -0.32761875l5.1316875 -5.60015c0.1775875 -0.1929 0.1714625 -0.4899 -0.01225 -0.6736125s-0.4807125 -0.195959375 -0.673609375 -0.02143125L3.407640625 11.207328125l-2.703628125 -1.353346875C0.37945625 9.691703125 0.17125 9.367146875 0.1620625 9.005846875s0.18065 -0.69810625 0.4929625 -0.87875625l13.71715625 -7.838375c0.32761875 -0.186775 0.731784375 -0.168403125 1.041034375 0.042865625Z" fill="currentColor" stroke-width="0.0313"></path>
                </svg>
                发送
            </button>
        </div>
    </div>

    <!-- ================= 弹窗 1：选择地理位置 (真实搜索) ================= -->
    <div class="modal-overlay" id="modal-location">
        <div class="modal-content">
            <div class="modal-header">
                <div class="back-btn close-location">
                    <svg viewBox="0 0 24 24" width="20" height="20" stroke="currentColor" stroke-width="2" fill="none"><polyline points="15 18 9 12 15 6"></polyline></svg> 返回
                </div>
                <div class="title">选择地理位置</div>
                <div class="right-placeholder"></div>
            </div>

            <div class="map-area">
                <div id="real-map"></div>
                <div class="search-bar-wrapper">
                    <div class="search-bar">
                        <svg viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" stroke-width="2" fill="none"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
                        <input type="text" id="loc-search-input" placeholder="搜索附近位置 (如: 北京)">
                    </div>
                </div>
            </div>

            <div class="location-list" id="search-results">
                <div class="loc-item loc-selectable" data-name="">
                    <div class="loc-title" style="color: var(--theme-blue);">不显示地理位置</div>
                </div>
            </div>
        </div>
    </div>

    <!-- ================= 弹窗 2：选择日记本 (分离卡片 + 贴边) ================= -->
    <div class="modal-overlay" id="modal-diary">
        <div class="modal-content">
            <div class="modal-header">
                <div class="back-btn close-diary">
                    <svg viewBox="0 0 24 24" width="20" height="20" stroke="currentColor" stroke-width="2" fill="none"><polyline points="15 18 9 12 15 6"></polyline></svg>
                </div>
                <div class="title">选择日记本</div>
                <div class="right-placeholder"></div>
            </div>

            <div class="diary-modal-body">
                <div class="diary-status-card" id="diary-status-text">未选择日记本</div>

                <div class="diary-list-card">
                    <div class="diary-scroll-area">
                        <div class="diary-item-wrapper">
                            <div class="diary-book diary-new">
                                <div class="plus-circle">+</div>
                                <div class="text">新建<br>日记本</div>
                            </div>
                            <div style="height: 18px;"></div>
                        </div>

                        <div class="diary-item-wrapper diary-selectable" data-name="好好好">
                            <div class="diary-book diary-blue">
                                <div class="stamp">
                                    <svg viewBox="0 0 24 24" width="12" height="12" fill="currentColor"><path d="M21 10.12h-6.78l2.74-2.82c-2.73-2.7-7.15-2.8-9.88-.1-2.73 2.71-2.73 7.08 0 9.79s7.15 2.71 9.88 0C18.32 15.65 19 14.08 19 12.1h2c0 2.5-1.06 4.85-2.95 6.64-3.83 3.79-10.05 3.79-13.88 0-3.83-3.79-3.83-9.95 0-13.74 3.83-3.79 10.05-3.79 13.88 0l2.95-3.04V10.12zM12.5 8v4.25l3.5 2.08-.72 1.21L11 13V8h1.5z"></path></svg>
                                </div>
                                <div class="title">好好好</div>
                                <div class="bottom-info">
                                    <span>0</span>
                                    <svg viewBox="0 0 24 24" width="10" height="10" fill="currentColor"><path d="M18 8h-1V6c0-2.76-2.24-5-5-5S7 3.24 7 6v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2zM9 6c0-1.66 1.34-3 3-3s3 1.34 3 3v2H9V6zm9 14H6V10h12v10zm-6-3c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2z"></path></svg>
                                </div>
                            </div>
                            <div class="radio-circle"></div>
                        </div>
                    </div>
                </div>
            </div>

            <div class="diary-modal-footer">
                <button class="btn-done-large" id="btn-confirm-diary">
                    <svg viewBox="0 0 24 24" width="18" height="18" stroke="currentColor" stroke-width="3" fill="none" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
                    完成
                </button>
            </div>
        </div>
    </div>

    </div> <!-- 结束 icity-app-inner-container -->
</div> <!-- 结束 icity-new-app-wrapper -->`;
    document.body.insertAdjacentHTML('beforeend', icityHTML);

    // 1. 鍒掑畾鍔垮姏鑼冨洿锛氬彧鍦ㄨ繖涓鍣ㄥ唴瀵绘壘鍏冪礌锛岀粷瀵归槻姝㈠啿绐?
    const icityRoot = document.getElementById('icityNewAppUI');
    const $ = (selector) => icityRoot ? icityRoot.querySelector(selector) : null;
    const $$ = (selector) => icityRoot ? icityRoot.querySelectorAll(selector) : [];
(() => {
    // 1. 划定势力范围：只在这个容器内寻找元素，绝对防止冲突
    const icityRoot = document.getElementById('icityNewAppUI');
    const $ = (selector) => icityRoot ? icityRoot.querySelector(selector) : null;
    const $$ = (selector) => icityRoot ? icityRoot.querySelectorAll(selector) : [];

    function showIcityFeedback(message) {
        const text = String(message || '').trim();
        if (!text) return;
        if (typeof window.showToast === 'function') {
            window.showToast(text);
            return;
        }
        const toast = document.createElement('div');
        toast.setAttribute('role', 'status');
        toast.textContent = text;
        toast.style.cssText = 'position:fixed;left:50%;bottom:calc(28px + env(safe-area-inset-bottom, 0px));transform:translateX(-50%);z-index:9999;max-width:min(86vw, 360px);padding:10px 14px;border-radius:14px;background:rgba(28,28,30,.92);color:#fff;font-size:13px;line-height:1.4;text-align:center;box-shadow:0 8px 24px rgba(0,0,0,.18);';
        document.body.appendChild(toast);
        window.setTimeout(() => toast.remove(), 2600);
    }

    // ================= 暴露给全局的打开/关闭方法 =================
    window.openICityApp = function() {
        const ui = document.getElementById('icityNewAppUI');
        if (ui) {
            ui.style.display = 'block';
            if (typeof window.applyStatusBarVisibility === 'function') window.applyStatusBarVisibility();
            // 同步当前微信面具账号，确保进入即读取该账号隔离数据
            const activeAccId = getIcityActiveAccountId();
            if (activeAccId) {
                currentIcitySessionAccountId = activeAccId;
            }
            // Let the app shell paint before loading the larger Diary dataset.
            window.requestAnimationFrame(() => loadData());
        }
    };

    window.closeICityApp = function() {
        const ui = document.getElementById('icityNewAppUI');
        if (ui) {
            ui.style.display = 'none';
        }
    };

    // ================= 数据存储逻辑 (接入全局 layoutStore + 面具账号动态隔离) =================
    let currentIcitySessionAccountId = '';

    function getIcityActiveAccountId() {
        if (currentIcitySessionAccountId) return currentIcitySessionAccountId;
        if (typeof wcGetCurrentAccountId === 'function') {
            try {
                const id = wcGetCurrentAccountId();
                if (id) return String(id).trim();
            } catch (e) {}
        }
        if (typeof appSettings !== 'undefined' && appSettings?.wc_current_user_id) {
            return String(appSettings.wc_current_user_id).trim();
        }
        try {
            const stored = localStorage.getItem('icity_active_mask_account_id');
            if (stored) return stored;
        } catch (e) {}
        return '';
    }

    const ICITY_USER_SCOPED_KEYS = new Set([
        'icity_profile',
        'icity_feeds',
        'icity_diaries',
        'icity_dms',
        'icity_character_profiles',
        'icity_qa_data',
        'icity_badges_data',
        'icity_monthly_records',
        'icity_annual_reports',
        'icity_notifications',
        'icity_relationships',
        'icity_search_history',
        'icity_pdf_export_preferences',
        'icity_video_export_preferences'
    ]);

    function getIcityStorageKey(key) {
        if (!ICITY_USER_SCOPED_KEYS.has(key)) return key;
        const accountId = getIcityActiveAccountId();
        return accountId ? `${key}_${accountId}` : key;
    }

    async function getIcityData(key, defaultVal) {
        const storageKey = getIcityStorageKey(key);
        return new Promise((resolve) => {
            if (!window.db) return resolve(defaultVal);
            const tx = window.db.transaction(['layoutStore'], 'readonly');
            const req = (window.CharacterRecordCleanup?.wrap(tx.objectStore('layoutStore')) || tx.objectStore('layoutStore')).get(storageKey);
            req.onsuccess = () => {
                if (req.result && req.result.data !== undefined) {
                    resolve(req.result.data);
                } else if (storageKey !== key) {
                    // 若分账号下未写入过，检查旧版全局键作为初始兜底迁移
                    const fallbackReq = (window.CharacterRecordCleanup?.wrap(tx.objectStore('layoutStore')) || tx.objectStore('layoutStore')).get(key);
                    fallbackReq.onsuccess = () => {
                        if (fallbackReq.result && fallbackReq.result.data !== undefined) {
                            resolve(fallbackReq.result.data);
                        } else {
                            resolve(defaultVal);
                        }
                    };
                    fallbackReq.onerror = () => resolve(defaultVal);
                } else {
                    resolve(defaultVal);
                }
            };
            req.onerror = () => resolve(defaultVal);
        });
    }

    async function getIcityRecord(key, defaultVal) {
        const storageKey = getIcityStorageKey(key);
        return new Promise((resolve) => {
            if (!window.db) return resolve(defaultVal);
            const tx = window.db.transaction(['layoutStore'], 'readonly');
            const req = (window.CharacterRecordCleanup?.wrap(tx.objectStore('layoutStore')) || tx.objectStore('layoutStore')).get(storageKey);
            req.onsuccess = () => resolve(req.result || defaultVal);
            req.onerror = () => resolve(defaultVal);
        });
    }

    let icityLastStorageWarningAt = 0;

    async function warnIcityStorageCapacity(key, data) {
        if (typeof navigator === 'undefined' || !navigator.storage?.estimate) return;
        try {
            const estimate = await navigator.storage.estimate();
            const usage = Number(estimate.usage || 0);
            const quota = Number(estimate.quota || 0);
            if (!quota) return;
            const serialized = JSON.stringify({ id: key, data });
            const payloadSize = typeof Blob === 'function' ? new Blob([serialized]).size : serialized.length * 2;
            const projectedUsage = usage + payloadSize;
            if (projectedUsage / quota >= 0.9 && Date.now() - icityLastStorageWarningAt > 30000) {
                icityLastStorageWarningAt = Date.now();
                if (typeof window.showToast === 'function') {
                    window.showToast('本地存储空间接近上限，请先备份后再继续添加大图片');
                }
            }
        } catch (error) {
            console.warn('Diary 存储容量预警失败:', error);
        }
    }

    async function saveIcityData(key, data) {
        const storageKey = getIcityStorageKey(key);
        await warnIcityStorageCapacity(storageKey, data);
        if (!window.db) {
            const error = new Error('Diary 数据库尚未准备好，内容未保存');
            error.key = storageKey;
            throw error;
        }
        return new Promise((resolve, reject) => {
            let settled = false;
            const fail = (message, cause) => {
                if (settled) return;
                settled = true;
                const error = new Error(message);
                error.key = storageKey;
                if (cause) error.cause = cause;
                console.error('Diary 数据保存失败:', error);
                reject(error);
            };
            try {
                const tx = window.db.transaction(['layoutStore'], 'readwrite');
                const req = (window.CharacterRecordCleanup?.wrap(tx.objectStore('layoutStore')) || tx.objectStore('layoutStore')).put({ id: storageKey, data });
                tx.oncomplete = () => {
                    if (settled) return;
                    settled = true;
                    if (typeof triggerAutoLocalBackup === 'function') triggerAutoLocalBackup();
                    resolve(true);
                };
                tx.onerror = event => fail('Diary 数据保存失败', event.target?.error);
                tx.onabort = event => fail('Diary 数据保存事务已中止', event.target?.error);
                req.onerror = event => fail('Diary 数据保存失败', event.target?.error);
            } catch (error) {
                fail('Diary 数据库事务异常', error);
            }
        });
    }

    const icityDataLocks = new Map();

    async function withIcityDataLock(key, defaultValue, updater) {
        const storageKey = getIcityStorageKey(key);
        const previous = icityDataLocks.get(storageKey) || Promise.resolve();
        const operation = previous.catch(() => {}).then(async () => {
            const current = await getIcityData(key, defaultValue);
            const next = await updater(current);
            if (next !== undefined) await saveIcityData(key, next);
            return next === undefined ? current : next;
        });
        icityDataLocks.set(storageKey, operation);
        try {
            return await operation;
        } finally {
            if (icityDataLocks.get(storageKey) === operation) icityDataLocks.delete(storageKey);
        }
    }

    const ICITY_QA_DATA_KEY = 'icity_qa_data';
    const ICITY_QA_QUESTIONS = [
        ['关于我', '你最希望别人先了解你的哪一点？'], ['关于我', '独处时你最常做什么？'], ['关于我', '你更看重计划还是临场发挥？'], ['关于我', '最近让你觉得满足的一件小事是什么？'],
        ['电影', '你最喜欢哪类电影？'], ['电影', '你会反复观看哪部电影？'], ['电影', '看电影时你最在意故事、画面还是演员？'], ['电影', '你喜欢在电影院还是在家看电影？'],
        ['阅读', '最近读过最喜欢的一本书是什么？'], ['阅读', '你偏爱小说、非虚构还是漫画？'], ['阅读', '你会做读书笔记吗？'], ['阅读', '哪类文字最容易让你沉浸？'],
        ['音乐', '你最近循环播放的歌是什么？'], ['音乐', '什么场景最适合听音乐？'], ['音乐', '你更喜欢现场演出还是耳机独听？'], ['音乐', '哪种音乐会迅速改变你的心情？'],
        ['美食料理', '你最喜欢的一道食物是什么？'], ['美食料理', '你能接受辣味到什么程度？'], ['美食料理', '你更喜欢自己做饭还是出门吃？'], ['美食料理', '有哪种食物是你绝对不会吃的？'],
        ['旅游', '你最想去哪里旅行？'], ['旅游', '旅行时你会做详细攻略吗？'], ['旅游', '你更喜欢自然风景还是城市街区？'], ['旅游', '旅途中你最想留下什么纪念？'],
        ['二次元', '你喜欢哪类动漫或漫画？'], ['二次元', '你最喜欢的虚构角色是谁？'], ['二次元', '你会收集周边或同人作品吗？'], ['二次元', '你更喜欢热血、日常还是奇幻作品？'],
        ['艺术历史', '哪种艺术形式最打动你？'], ['艺术历史', '你喜欢逛博物馆或展览吗？'], ['艺术历史', '你最想了解哪段历史？'], ['艺术历史', '你会因为一件作品专程去一个地方吗？'],
        ['游戏', '你平时玩什么类型的游戏？'], ['游戏', '你更在意剧情、操作还是社交？'], ['游戏', '哪款游戏让你记了很久？'], ['游戏', '你喜欢和别人一起玩游戏吗？'],
        ['体育', '你平时关注或参与什么运动？'], ['体育', '你喜欢看比赛还是亲自上场？'], ['体育', '哪项运动最能让你放松？'], ['体育', '你会为喜欢的队伍或选手长期加油吗？'],
        ['品牌消费', '你买东西最重视什么？'], ['品牌消费', '你更愿意买经典款还是尝试新品？'], ['品牌消费', '有什么东西你愿意为质量多花钱？'], ['品牌消费', '你会因为朋友推荐而改变购买决定吗？']
    ].map((item, index) => ({ id: 'qa_' + String(index + 1), category: item[0], text: item[1] }));

    function getIcityQaDefaultData() {
        return { version: 1, questions: ICITY_QA_QUESTIONS, userAnswers: {}, characterAnswers: {}, visibility: '公开' };
    }

    async function getIcityQaData() {
        const stored = await getIcityData(ICITY_QA_DATA_KEY, {});
        const defaults = getIcityQaDefaultData();
        return Object.assign(defaults, stored || {}, {
            questions: ICITY_QA_QUESTIONS,
            userAnswers: stored?.userAnswers && typeof stored.userAnswers === 'object' ? stored.userAnswers : {},
            characterAnswers: stored?.characterAnswers && typeof stored.characterAnswers === 'object' ? stored.characterAnswers : {},
            visibility: normalizeIcityVisibility(stored?.visibility || defaults.visibility)
        });
    }

    function getIcityQaAnswerValue(answer) {
        return typeof answer === 'object' ? String(answer?.value || '').trim() : String(answer || '').trim();
    }

    function getIcityQaCompletedCount(data, category) {
        return ICITY_QA_QUESTIONS.filter(question => (!category || question.category === category) && getIcityQaAnswerValue(data.userAnswers?.[question.id])).length;
    }

    function getIcityQaCategoryQuestions(category) {
        return ICITY_QA_QUESTIONS.filter(question => question.category === category);
    }

    function showIcityQaToast(message) {
        if (typeof window.showToast === 'function') window.showToast(message);
        else console.warn(message);
    }

    function getIcityQaCharacters(contactsData, wechatContactsData) {
        const candidates = getIcityReactionContactCandidates(contactsData, wechatContactsData);
        const seen = new Set();
        return candidates.map(item => ({
            id: String(item.contact.id),
            name: String(item.contact.name || item.wechatContact?.name || '未命名角色').trim(),
            persona: String(item.contact.persona || item.wechatContact?.persona || '').trim(),
            appearance: String(item.contact.appearance || item.wechatContact?.appearance || '').trim(),
            avatar: String(item.contact.avatar || item.wechatContact?.avatar || '').trim()
        })).filter(item => item.id && item.name && !seen.has(item.id) && seen.add(item.id));
    }

    function getIcityQaCharacterAnswer(characterAnswers, characterId, questionId) {
        return getIcityQaAnswerValue(characterAnswers?.[String(characterId)]?.[questionId]);
    }

    function getIcityQaTokens(value) {
        const normalized = String(value || '').toLowerCase().replace(/[，。！？、；：,.!?;:/|\\s]+/g, '');
        const tokens = new Set();
        if (!normalized) return tokens;
        Array.from(normalized).forEach(char => tokens.add(char));
        for (let index = 0; index < normalized.length - 1; index += 1) tokens.add(normalized.slice(index, index + 2));
        return tokens;
    }

    function calculateIcityQaSimilarity(data, characterId) {
        const pairs = ICITY_QA_QUESTIONS.map(question => ({
            question,
            userAnswer: getIcityQaAnswerValue(data.userAnswers?.[question.id]),
            characterAnswer: getIcityQaCharacterAnswer(data.characterAnswers, characterId, question.id)
        })).filter(item => item.userAnswer && item.characterAnswer);
        if (!pairs.length) return { score: 0, common: [], differences: [], answered: 0 };
        let total = 0;
        const common = [];
        const differences = [];
        pairs.forEach(item => {
            const left = item.userAnswer.toLowerCase();
            const right = item.characterAnswer.toLowerCase();
            let score = left === right ? 1 : 0;
            if (!score) {
                const leftTokens = getIcityQaTokens(left);
                const rightTokens = getIcityQaTokens(right);
                const union = new Set([...leftTokens, ...rightTokens]);
                const overlap = [...leftTokens].filter(token => rightTokens.has(token)).length;
                score = union.size ? overlap / union.size : 0;
            }
            total += score;
            if (score >= 0.35) common.push(item.question.text);
            else differences.push(item.question.text);
        });
        return { score: Math.round((total / pairs.length) * 100), common: common.slice(0, 3), differences: differences.slice(0, 3), answered: pairs.length };
    }

    async function generateIcityCharacterQaAnswers(characterId, category, force) {
        const [data, contactsData, wechatContactsData, feeds] = await Promise.all([getIcityQaData(), getContactsData(), getWechatContactsData(), getFeeds()]);
        const character = getIcityQaCharacters(contactsData, wechatContactsData).find(item => item.id === String(characterId));
        if (!character) throw new Error('未找到该角色');
        const questions = getIcityQaCategoryQuestions(category);
        const existing = data.characterAnswers?.[character.id] || {};
        if (!force && questions.every(question => getIcityQaAnswerValue(existing[question.id]))) return data;
        const api = await getConnectedIcityApi();
        const recentDiary = feeds.filter(post => String(post?.characterId || '') === character.id && String(post?.text || '').trim()).slice(-8).map(post => String(post.text).slice(0, 500));
        const prompt = [
            '请根据角色资料回答下面这一组 Diary Q&A。',
            '必须保持角色设定，不要替用户回答，不要编造角色未体现的重要经历。',
            '每个答案用自然、具体的简体中文，答案可以是“不确定”或“暂时没有”，但不要留空。',
            '只输出 JSON，不要 Markdown。格式：{"answers":{"qa_1":"答案"}}',
            '角色资料：' + JSON.stringify({ name: character.name, persona: character.persona, appearance: character.appearance }),
            '角色近期 Diary 日记：' + JSON.stringify(recentDiary),
            '问题：' + JSON.stringify(questions.map(question => ({ id: question.id, text: question.text })))
        ].join('\n');
        const content = await requestIcityChatCompletion(api, [{ role: 'system', content: '你是 Diary 角色问答生成器，只输出结构化 JSON。' }, { role: 'user', content: prompt }], { temperature: 0.75, emptyMessage: 'API 没有返回角色 Q&A' });
        const parsed = parseIcityJsonObject(content);
        const answers = parsed?.answers && typeof parsed.answers === 'object' ? parsed.answers : parsed;
        const nextAnswers = Object.assign({}, existing);
        questions.forEach(question => {
            const value = String(answers?.[question.id] || '').trim();
            if (value) nextAnswers[question.id] = { value, generatedAt: Date.now() };
        });
        if (!Object.keys(nextAnswers).length) throw new Error('AI 没有返回可用的角色答案');
        data.characterAnswers[character.id] = nextAnswers;
        await saveIcityData(ICITY_QA_DATA_KEY, data);
        return data;
    }

    function renderIcityQaOverview(data) {
        const total = ICITY_QA_QUESTIONS.length;
        const completed = getIcityQaCompletedCount(data);
        const totalProgress = $('#icity-qa-total-progress');
        if (totalProgress) totalProgress.textContent = '已完成 ' + completed + '/' + total + '题';
        const homeProgress = $('#btn-open-qa .qa-percent');
        if (homeProgress) homeProgress.textContent = Math.round((completed / total) * 100) + '%';
        const visibility = $('#icity-qa-visibility-value');
        if (visibility) visibility.textContent = normalizeIcityVisibility(data.visibility);
        $$('.qa-category-card').forEach(card => {
            const category = card.dataset.qaCategory;
            const questions = getIcityQaCategoryQuestions(category);
            const done = getIcityQaCompletedCount(data, category);
            const percent = questions.length ? Math.round((done / questions.length) * 100) : 0;
            const percentNode = card.querySelector('.qa-cat-percent');
            const fill = card.querySelector('.qa-progress-fill');
            if (percentNode) percentNode.textContent = percent + '%';
            if (fill) fill.style.width = percent + '%';
        });
    }

    async function openIcityQaCategory(category, selectedCharacterId) {
        const data = await getIcityQaData();
        const overview = $('#icity-qa-overview');
        const panel = $('#icity-qa-question-panel');
        const matchPanel = $('#icity-qa-match-panel');
        const title = $('#icity-qa-question-title');
        const progress = $('#icity-qa-question-progress');
        const list = $('#icity-qa-question-list');
        const select = $('#icity-qa-character-select');
        if (!overview || !panel || !list) return;
        overview.style.display = 'none';
        if (matchPanel) matchPanel.style.display = 'none';
        panel.style.display = 'block';
        if (title) title.textContent = category;
        const questions = getIcityQaCategoryQuestions(category);
        if (progress) progress.textContent = getIcityQaCompletedCount(data, category) + '/' + questions.length;
        list.dataset.qaCategory = category;
        const [contactsData, wechatContactsData] = await Promise.all([getContactsData(), getWechatContactsData()]);
        const characters = getIcityQaCharacters(contactsData, wechatContactsData);
        if (select) {
            select.innerHTML = '<option value="">选择角色</option>' + characters.map(character => '<option value="' + escapeIcityHtml(character.id) + '">' + escapeIcityHtml(character.name) + '</option>').join('');
            if (selectedCharacterId) select.value = String(selectedCharacterId);
        }
        const chosenCharacterId = select?.value || '';
        list.innerHTML = questions.map(question => {
            const answer = getIcityQaAnswerValue(data.userAnswers?.[question.id]);
            const characterAnswer = chosenCharacterId ? getIcityQaCharacterAnswer(data.characterAnswers, chosenCharacterId, question.id) : '';
            const roleText = characterAnswer || (chosenCharacterId ? '尚未生成该题答案' : '选择角色后可生成角色答案');
            return '<article class="qa-question-card" data-question-id="' + escapeIcityHtml(question.id) + '">' +
                '<div class="qa-q-row"><span class="qa-badge-q">Q</span><div class="qa-question-text">' + escapeIcityHtml(question.text) + '</div></div>' +
                '<div class="qa-a-row"><span class="qa-badge-a">A</span><div class="qa-input-wrap"><textarea data-qa-answer="' + escapeIcityHtml(question.id) + '" rows="1" placeholder="">' + escapeIcityHtml(answer) + '</textarea></div></div>' +
                (chosenCharacterId ? '<div class="qa-character-answer"><span>角色答案</span>' + escapeIcityHtml(roleText) + '</div>' : '') +
                '<div class="qa-question-footer"><span class="qa-save-status">已自动保存</span><button type="button" data-qa-action="clear-answer" data-question-id="' + escapeIcityHtml(question.id) + '">清空</button></div>' +
                '</article>';
        }).join('');
    }

    async function renderIcityQaMatches() {
        const data = await getIcityQaData();
        const overview = $('#icity-qa-overview');
        const questionPanel = $('#icity-qa-question-panel');
        const panel = $('#icity-qa-match-panel');
        const list = $('#icity-qa-match-list');
        if (!overview || !panel || !list) return;
        overview.style.display = 'none';
        if (questionPanel) questionPanel.style.display = 'none';
        panel.style.display = 'block';
        if (!getIcityQaCompletedCount(data)) {
            list.innerHTML = '<div class="qa-empty-state">先回答至少一题，再查看同好匹配。</div>';
            return;
        }
        const [contactsData, wechatContactsData] = await Promise.all([getContactsData(), getWechatContactsData()]);
        const characters = getIcityQaCharacters(contactsData, wechatContactsData);
        if (!characters.length) {
            list.innerHTML = '<div class="qa-empty-state">还没有可匹配的角色。</div>';
            return;
        }
        const matches = characters.map(character => ({ character, match: calculateIcityQaSimilarity(data, character.id) })).sort((left, right) => right.match.score - left.match.score);
        list.innerHTML = matches.map(item => {
            const character = item.character;
            const match = item.match;
            const common = match.common.length ? match.common.join('、') : '继续回答更多问题后会更准确';
            const difference = match.differences.length ? match.differences.join('、') : '暂未发现明显差异';
            return '<article class="qa-match-card"><div class="qa-match-top"><div class="qa-match-avatar">' + escapeIcityHtml((character.name || '角').slice(0, 1)) + '</div><div><div class="qa-match-name">' + escapeIcityHtml(character.name) + '</div><div class="qa-match-score">' + match.score + '% 相似 · 已比较 ' + match.answered + ' 题</div></div></div><div class="qa-match-line"><span>共同兴趣</span>' + escapeIcityHtml(common) + '</div><div class="qa-match-line"><span>主要差异</span>' + escapeIcityHtml(difference) + '</div></article>';
        }).join('');
    }

    async function openIcityQaPage() {
        const data = await getIcityQaData();
        $$('.view-container').forEach(view => view.classList.remove('active'));
        if (mainBottomNav) mainBottomNav.style.display = 'none';
        const view = $('#view-qa-page');
        if (view) view.classList.add('active');
        $('#icity-qa-overview').style.display = 'block';
        $('#icity-qa-question-panel').style.display = 'none';
        $('#icity-qa-match-panel').style.display = 'none';
        renderIcityQaOverview(data);
    }

    function getProfile() { return getIcityData('icity_profile', {}); }
    function getFeeds() { return getIcityData('icity_feeds', []); }
    function getContactsData() { return getIcityData('contactsAppData', { contacts: [] }); }
    async function getApiData() {
        const fallback = { list: [], connectedId: null };
        const record = await getIcityRecord('apiData', fallback);
        if (Array.isArray(record?.list)) return record;
        if (Array.isArray(record?.data?.list)) return record.data;
        return fallback;
    }
    async function getWechatContactsData() {
        const fallback = { contacts: [] };
        const [profile, authData, globalContactsData] = await Promise.all([
            getProfile(),
            getWechatAuthData(),
            getIcityRecord('wechatContactsData', fallback)
        ]);
        const bindingWxid = String(profile?.wechatBinding?.wxid || '').trim();
        const matchedAccount = Array.isArray(authData?.accounts)
            ? authData.accounts.find(account => String(account?.wxid || '').trim() === bindingWxid)
            : null;
        const accountId = String(
            profile?.wechatBinding?.maskId ||
            matchedAccount?.maskId ||
            matchedAccount?.id ||
            (typeof appSettings !== 'undefined' ? appSettings.wc_current_user_id : '') ||
            ''
        ).trim();
        if (!accountId) return globalContactsData || fallback;
        const accountContactsData = await getIcityRecord(`wechatContactsData_${accountId}`, null);
        return accountContactsData || globalContactsData || fallback;
    }
    function getWechatChatData() { return getIcityRecord('wechatChatData', { conversations: {} }); }
    function getWechatAuthData() { return getIcityRecord('wechatAuthData', { id: 'wechatAuthData', accounts: [], currentLoginWxid: null }); }

    const ICITY_DIARY_STYLE_PROMPT = '采用偏晋江言情的细腻叙事质感：文字清透、克制、带情绪张力，不堆砌华丽辞藻，也不依赖密集比喻，而是通过动作、停顿、视线、距离、语气变化和环境细节传递情绪。空间描写应具有镜头感，先以全景交代场所，再用近景捕捉人物位置与动作，最后以特写落到手指、眼神、衣角、呼吸等细节；转场以自然的时间、动作、声音或视线衔接为主，闪回只能由具体事物触发。环境描写以衬托和流动式为主，雨声、风、灯光、窗影、街道、人群都应服务当前情绪，而不是单独展示风景。视角必须受当前叙事人物认知范围限制，只写其能看见、听见、知道和合理推测到的内容，禁止上帝视角，也不要直接解释另一人物真实心理。句式长短结合，动作和冲突处多用短句制造节奏，情绪发酵与环境描写可用稍长句拉开呼吸感；段落不要过碎，每次情绪或动作重心变化时自然分段。语言要有修饰感但不过分浮夸，优先使用准确动词和具体名词，少用连续比喻与空洞形容词。推进方式交替使用情节因果、冲突升级、对话、时间、空间和描写推进，让每一句都推动信息、情绪或关系。气氛通过天气、光线、声音、空间距离和人物行为共同营造，不直接宣布暧昧、心动或难过，而让读者从停顿、靠近、躲闪和未说出口的话中感受到。情感以含蓄为主、爆发为辅，只有积累到临界点时才允许宣之于口。生成时遵循“事件发生—人物感知—人物反应—关系变化”的逻辑，避免无意义抒情。示例质感：“她没抬头，只把杯子往旁边推了一点。玻璃杯底擦过桌面，发出很轻的一声。对面的人没有说话，过了两秒，才伸手替她把快掉下去的袖口折好。”不要直接解释心动，让动作、停顿和距离承载情绪。标点必须规范，逗号用于句内停顿，句号负责节奏收束，省略号只用于真正的迟疑和未尽之意，不滥用破折号、感叹号与连续省略号；分段服从镜头、动作与情绪变化，保持阅读流畅。';
    const ICITY_DIARY_CHAT_CONTEXT_LIMIT = 12;
    const ICITY_DIARY_MEMORY_TIMEOUT_MS = 300;
    const ICITY_DIARY_IMAGE_PROBABILITY = 0.35;
    const ICITY_IMAGE_PLACEHOLDER_URL = 'https://nos.netease.com/ysf/f8351d4c8de1d1407e5044b639f6bddf.png';
    const ICITY_DEFAULT_AUTO_DIARY_TIME = '20:33';
    const ICITY_VISIBILITY_OPTIONS = [
        { label: '公开', value: '公开' },
        { label: '仅好友可见', value: '仅好友可见' },
        { label: '私人', value: '私人' }
    ];
    let icityAutoDiaryTimer = null;
    let icityAutoDiaryRunning = false;
    let icityPostInteractionsLock = new Set();
    
    function observeIcityDiaryMemoryEvent(post) {
        if (!post || post.authorType !== 'user' || !String(post.text || '').trim()) return;
        if (typeof window.MemoryV2?.observeExternalEvent !== 'function') return;
        const visibility = normalizeIcityVisibility(post.visibility || '公开');
        void window.MemoryV2.observeExternalEvent({
            sourceApp: 'diary',
            sourceId: String(post.id || post.createdAt || Date.now()),
            actor: 'user',
            text: String(post.text || ''),
            occurredAt: post.occurredAt || post.createdAt || Date.now(),
            visibility,
            private: visibility === '私人'
        }).catch(error => console.warn('Diary diary memory event skipped:', error));
    }

    async function saveFeed(feed) {
        return withIcityDataLock('icity_feeds', [], feeds => {
            const nextFeeds = Array.isArray(feeds) ? feeds : [];
            const index = nextFeeds.findIndex(item => String(item?.id) === String(feed?.id));
            if (index !== -1) nextFeeds[index] = feed;
            else nextFeeds.push(feed);
            return nextFeeds;
        });
    }
    
    async function deleteFeed(id) {
        const result = await withIcityDataLock('icity_feeds', [], feeds => {
            return (Array.isArray(feeds) ? feeds : [])
                .filter(item => String(item?.id) !== String(id));
        });
        if (typeof window.MemoryV2?.removeExternalEventObservation === 'function') {
            void window.MemoryV2.removeExternalEventObservation({
                sourceApp: 'diary',
                sourceId: String(id)
            }).catch(error => console.warn('Diary diary memory cleanup skipped:', error));
        }
        return result;
    }
    
    async function patchProfileData(patch) {
        return withIcityDataLock('icity_profile', {}, profile => {
            const nextProfile = profile && typeof profile === 'object' ? profile : {};
            Object.assign(nextProfile, patch);
            return nextProfile;
        });
    }

    async function saveProfileData(key, value) {
        return patchProfileData({ [key]: value });
    }

    function getApiCompletionUrl(url) {
        const base = String(url || '').trim().replace(/\/+$/, '');
        return /\/chat\/completions$/i.test(base) ? base : base + '/chat/completions';
    }

    async function getConnectedIcityApi() {
        const apiRecord = await getApiData();
        const apiList = Array.isArray(apiRecord?.list) ? apiRecord.list : [];
        const api = apiList.find(item => item.id === apiRecord?.connectedId) || apiList[0];
        if (!api?.url || !api?.key || !api?.model) throw new Error('请先在 API 连接中配置并连接一个模型');
        return api;
    }

    async function requestIcityChatCompletion(api, messages, options = {}) {
        const response = await fetch(getApiCompletionUrl(api.url), {
            method: 'POST',
            headers: {
                Authorization: 'Bearer ' + api.key,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                model: api.model,
                temperature: options.temperature ?? api.temperature ?? 0.8,
                messages
            })
        });
        if (!response.ok) throw new Error('API 请求失败：HTTP ' + response.status);
        const result = await response.json();
        const content = readModelContent(result);
        if (!content) throw new Error(options.emptyMessage || 'API 没有返回内容');
        return content;
    }

    function readModelContent(result) {
        return String(result?.choices?.[0]?.message?.content ?? result?.choices?.[0]?.text ?? result?.output_text ?? '').trim();
    }

    function getWechatAccountLabel(account) {
        const name = String(account?.name || '').trim();
        const wxid = String(account?.wxid || '').trim();
        if (name && wxid) return `${name} · ${wxid}`;
        return name || wxid || '未命名微信账户';
    }

    function normalizeIcityAvatarBackground(avatar) {
        let value = String(avatar || '').trim();
        if (!value) return '';
        const bgImgMatch = value.match(/background-image\s*:\s*([^;]+)/i);
        if (bgImgMatch) {
            value = bgImgMatch[1].trim();
        }
        const gradient = /^(?:linear|radial)-gradient\([a-zA-Z0-9%#., ()+_-]+\)$/i;
        if (gradient.test(value)) return value;
        const rawUrl = value.match(/^url\(\s*["']?([^"')]+)["']?\s*\)$/i)?.[1] || value;
        if (!/^(?:data:image\/|blob:|https?:\/\/)/i.test(rawUrl)) return '';
        return `url("${rawUrl.replace(/\\/g, '\\\\').replace(/"/g, '\\"')}")`;
    }

    function getIcityAvatarStyle(avatar) {
        const background = normalizeIcityAvatarBackground(avatar);
        return background
            ? `background-image: ${background.replace(/"/g, "'")}; background-size: cover; background-position: center;`
            : 'background-image: linear-gradient(to bottom right, #888, #ccc);';
    }

    function applyIcityProfileIdentity(profile) {
        const nickname = String(profile?.nickname || '').trim();
        const avatar = normalizeIcityAvatarBackground(profile?.avatar);
        if (nickname) {
            const profileName = $('.user-name');
            const appSettingsNickname = $('#app-settings-nickname');
            const settingsNicknameVal = $('#settings-nickname-val');
            if (profileName) profileName.textContent = nickname;
            if (appSettingsNickname) appSettingsNickname.textContent = nickname;
            if (settingsNicknameVal) {
                if (settingsNicknameVal.tagName === 'INPUT') settingsNicknameVal.value = nickname;
                else settingsNicknameVal.textContent = nickname;
            }
        }
        if (avatar) {
            $$('.sync-avatar, .avatar-wrapper, #tab-profile .nav-avatar, #settings-avatar-preview').forEach(el => {
                el.style.backgroundImage = avatar;
                el.style.backgroundSize = 'cover';
                el.style.backgroundPosition = 'center';
                el.innerHTML = '';
            });
        }
    }

    function getBoundWechatAccount(profile, authData) {
        const wxid = String(profile?.wechatBinding?.wxid || '').trim();
        const accounts = Array.isArray(authData?.accounts) ? authData.accounts : [];
        if (!wxid) return null;
        return accounts.find(account => String(account?.wxid || '') === wxid) || null;
    }

    function updateIcityWechatBindingUi(profile = {}, authData = null) {
        const settingsEmailVal = $('#settings-email-val');
        const bindPill = $('#settings-wechat-bind-pill');
        const boundAccount = authData ? getBoundWechatAccount(profile, authData) : profile.wechatBinding;
        if (settingsEmailVal) {
            settingsEmailVal.value = boundAccount ? (boundAccount.wxid || boundAccount.name) : '';
            settingsEmailVal.placeholder = boundAccount ? '已绑定' : '输入微信ID或点击选择';
        }
        if (bindPill) bindPill.textContent = boundAccount ? '更换' : '绑定';
    }

    async function openIcityBindAccountPage() {
        $$('.view-container').forEach(v => v.classList.remove('active'));
        if ($('#main-bottom-nav')) $('#main-bottom-nav').style.display = 'none';
        const bindView = $('#view-bind-account');
        if (bindView) bindView.classList.add('active');
        await renderIcityBindAccountList();
    }

    let selectedAccountForQuickLogin = null;

    async function renderIcityBindAccountList() {
        const list = $('#bind-account-list-container');
        if (!list) return;
        list.innerHTML = '<div style="padding: 20px; text-align: center; color: #FFFFFF; font-size: 13px;">正在寻找市民账号...</div>';

        const [authData, contactsData] = await Promise.all([getWechatAuthData(), getContactsData()]);
        const accounts = Array.isArray(authData?.accounts) ? authData.accounts.filter(a => a?.wxid) : [];
        const users = Array.isArray(contactsData?.users) ? contactsData.users : (Array.isArray(contactsData?.data?.users) ? contactsData.data.users : []);

        if (accounts.length === 0) {
            list.innerHTML = '<div class="icity-login-account-capsule" style="justify-content: center; color: #8E8E93; font-size: 13px;">未检测到微信账号，可直接在微信中创建</div>';
            return;
        }

        list.innerHTML = '';
        selectedAccountForQuickLogin = null;

        accounts.forEach((account, idx) => {
            const matchedUser = users.find(u =>
                (account.maskId && u.id === account.maskId) ||
                (account.id && u.id === account.id) ||
                (account.phone && u.phone === account.phone) ||
                (account.name && u.name === account.name) ||
                (account.wxid && (u.phone === account.wxid || u.id === account.wxid))
            );

            const rawAvatar = account.avatar
                || matchedUser?.avatar
                || (typeof appSettings !== 'undefined' && appSettings.wc_current_user_name === account.name ? appSettings.wc_current_user_avatar : '')
                || (typeof appSettings !== 'undefined' && appSettings.wc_current_user_phone === account.wxid ? appSettings.wc_current_user_avatar : '')
                || (typeof appSettings !== 'undefined' && appSettings.wc_current_user_id === account.maskId ? appSettings.wc_current_user_avatar : '')
                || '';

            const avatarStyle = getIcityAvatarStyle(rawAvatar);
            const name = String(account.name || matchedUser?.name || '微信用户').trim();
            const wxid = String(account.wxid || '--').trim();

            const fullAccount = {
                ...account,
                avatar: rawAvatar,
                name: name
            };

            const item = document.createElement('div');
            item.className = 'icity-login-account-capsule' + (idx === 0 ? ' is-selected' : '');
            if (idx === 0) selectedAccountForQuickLogin = fullAccount;

            item.innerHTML = `
                <div class="account-avatar" style="${avatarStyle}"></div>
                <div class="account-info">
                    <div class="account-name">${escapeIcityHtml(name)}</div>
                    <div class="account-sub">微信号：${escapeIcityHtml(wxid)}</div>
                </div>
                <div class="account-check-icon">✓</div>
            `;

            item.addEventListener('click', () => {
                list.querySelectorAll('.icity-login-account-capsule').forEach(el => el.classList.remove('is-selected'));
                item.classList.add('is-selected');
                selectedAccountForQuickLogin = fullAccount;
            });

            list.appendChild(item);
        });

        // Bind the quick login button to the selected WeChat account.
        const btnQuickLogin = $('#btn-quick-login-action');
        if (btnQuickLogin) {
            btnQuickLogin.onclick = async () => {
                if (!selectedAccountForQuickLogin) {
                    if (typeof window.showToast === 'function') window.showToast('请先选择一个登录账号');
                    return;
                }

                await saveIcityWechatBinding(selectedAccountForQuickLogin);
                $$('.view-container').forEach(v => v.classList.remove('active'));
                if ($('#main-bottom-nav')) $('#main-bottom-nav').style.display = 'flex';
                switchView('home');
                if (typeof renderAllFeeds === 'function') await renderAllFeeds();
                if (typeof window.showToast === 'function') window.showToast(`欢迎回来，${selectedAccountForQuickLogin.name}`);
            };
        }
    }

    async function logoutIcityAccount() {
        const confirmed = typeof window.showCustomConfirm === 'function'
            ? await window.showCustomConfirm('退出账号', '确定要退出当前绑定的微信账号吗？退出后需重新绑定账号方可进入。', '退出', true)
            : confirm('确定要退出当前绑定的微信账号吗？');
        if (!confirmed) return;

        // 1. 清理内存缓存和全局状态
        cachedWechatAccounts = null;
        window.currentSinglePostId = null;
        window.editingDiaryBookId = null;
        window.editingPostId = null;
        window.editingNoteId = null;
        viewStack = [];

        // 2. 关闭所有可能残留的弹窗与菜单
        $$('.modal-overlay').forEach(modal => modal.classList.remove('active'));
        const menuOverlay = $('#menuOverlay');
        if (menuOverlay) menuOverlay.style.display = 'none';
        const popoverMenu = $('#popoverMenu');
        if (popoverMenu) popoverMenu.style.display = 'none';

        // 3. 清空数据库中的绑定与会话账号
        await saveProfileData('wechatBinding', null);
        currentIcitySessionAccountId = '';
        try { localStorage.removeItem('icity_active_mask_account_id'); } catch (e) {}

        const profile = await getProfile();
        updateIcityWechatBindingUi(profile, null);

        // 4. 重置市民身份至默认游客状态
        applyIcityProfileIdentity({ nickname: '未命名市民', avatar: '' });
        const nameInput = $('#settings-nickname-val');
        if (nameInput) nameInput.value = '未命名市民';
        const emailInput = $('#settings-email-val');
        if (emailInput) {
            emailInput.value = '';
            emailInput.placeholder = '输入微信ID或点击选择';
        }

        if (typeof window.showToast === 'function') window.showToast('已退出当前账号');

        // 5. 打开绑定登录界面
        await openIcityBindAccountPage();
    }

    async function saveIcityWechatBinding(account) {
        const targetAccountId = String(account.maskId || account.id || account.wxid || '').trim();
        if (targetAccountId) {
            currentIcitySessionAccountId = targetAccountId;
            try { localStorage.setItem('icity_active_mask_account_id', targetAccountId); } catch (e) {}
        }

        const binding = {
            wxid: account.wxid || '',
            name: account.name || '',
            phone: account.phone || '',
            maskId: account.maskId || '',
            avatar: account.avatar || ''
        };
        const profilePatch = {
            wechatBinding: binding,
            nickname: binding.name || account.wxid || 'diary_user'
        };
        if (binding.avatar) profilePatch.avatar = normalizeIcityAvatarBackground(binding.avatar);
        const profile = await patchProfileData(profilePatch);
        applyIcityProfileIdentity(profile);
        updateIcityWechatBindingUi({ wechatBinding: binding }, { accounts: [binding] });
        if (typeof renderAllFeeds === 'function') await renderAllFeeds();
        if (typeof refreshDiaryList === 'function') await refreshDiaryList();
        if (typeof window.showToast === 'function') window.showToast('已绑定微信账户');
    }

    let cachedWechatAccounts = null; // 增加内存缓存

    async function openIcityWechatBindingPicker(filterText = '') {
        // 只有第一次打开时才查数据库，后续全部走内存，极速响应
        if (!cachedWechatAccounts) {
            const authData = await getWechatAuthData();
            cachedWechatAccounts = Array.isArray(authData?.accounts) ? authData.accounts.filter(account => account?.wxid) : [];
        }
        
        let accounts = cachedWechatAccounts;
        
        if (!accounts.length) {
            if (typeof window.showToast === 'function') window.showToast('请先在微信中注册或登录账户');
            else alert('请先在微信中注册或登录账户');
            return false;
        }

        if (filterText) {
            const lowerFilter = filterText.toLowerCase();
            accounts = accounts.filter(acc => 
                (acc.name && acc.name.toLowerCase().includes(lowerFilter)) || 
                (acc.wxid && acc.wxid.toLowerCase().includes(lowerFilter))
            );
        }
        
        const dropdown = $('#wechat-bind-dropdown');
        if (dropdown) {
            dropdown.innerHTML = '';
            
            if (accounts.length === 0) {
                dropdown.innerHTML = '<div style="padding: 12px 16px; color: var(--text-light); font-size: 13px; text-align: center;">无匹配账号</div>';
            } else {
                accounts.forEach(account => {
                    const item = document.createElement('div');
                    item.className = 'wechat-bind-item';
                    
                    const avatarStyle = account.avatar ? `background-image: url('${account.avatar}')` : '';
                    
                    item.innerHTML = `
                        <div class="wechat-bind-avatar" style="${avatarStyle}"></div>
                        <div class="wechat-bind-info">
                            <div class="wechat-bind-name">${escapeIcityHtml(account.name || '未命名')}</div>
                            <div class="wechat-bind-wxid">${escapeIcityHtml(account.wxid)}</div>
                        </div>
                    `;
                    
                    item.addEventListener('click', async (e) => {
                        e.stopPropagation();
                        const input = $('#settings-email-val');
                        if (input) input.value = account.wxid || account.name;
                        
                        // 立即收回下拉框，不让用户等待
                        dropdown.classList.remove('active');
                        
                        // 然后在后台执行绑定逻辑
                        await saveIcityWechatBinding(account);
                    });
                    
                    dropdown.appendChild(item);
                });
            }

            dropdown.classList.add('active');

            if (window._closeWechatDropdown) {
                document.removeEventListener('click', window._closeWechatDropdown);
            }
            
            window._closeWechatDropdown = (e) => {
                if (!e.target.closest('#btn-edit-email')) {
                    dropdown.classList.remove('active');
                    document.removeEventListener('click', window._closeWechatDropdown);
                }
            };
            
            setTimeout(() => {
                document.addEventListener('click', window._closeWechatDropdown);
            }, 0);

            return true;
        }
        return false;
    }

    async function ensureIcityWechatBoundForPosting() {
        const [profile, authData] = await Promise.all([getProfile(), getWechatAuthData()]);
        const boundAccount = getBoundWechatAccount(profile, authData);
        if (boundAccount) return boundAccount;
        updateIcityWechatBindingUi(profile, authData);
        
        if (typeof window.showToast === 'function') window.showToast('请先绑定微信账户');
        else alert('请先绑定微信账户');
        
        await openIcityBindAccountPage();
        return false;
    }

    function normalizeIcityVisibility(value) {
        const normalized = String(value || '').trim();
        if (normalized === '仅自己') return '私人';
        return ICITY_VISIBILITY_OPTIONS.some(item => item.value === normalized) ? normalized : '公开';
    }

    function getIcityVisibilityIcon(value) {
        const visibility = normalizeIcityVisibility(value);
        if (visibility === '仅好友可见') {
            return '<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z" /></svg>';
        }
        if (visibility === '私人') {
            return '<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" /></svg>';
        }
        return '<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M12 21a9.004 9.004 0 008.716-6.747M12 21a9.004 9.004 0 01-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 017.843 4.582M12 3a8.997 8.997 0 00-7.843 4.582m15.686 0A11.953 11.953 0 0112 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0121 12c0 .778-.099 1.533-.284 2.253m0 0A17.919 17.919 0 0112 16.5c-3.162 0-6.133-.815-8.716-2.247m0 0A9.015 9.015 0 013 12c0-1.605.42-3.113 1.157-4.418" /></svg>';
    }

    function updateIcityVisibilityButton(element, value) {
        if (!element) return;
        const visibility = normalizeIcityVisibility(value);
        element.dataset.visibility = visibility;
        element.innerHTML = `${getIcityVisibilityIcon(visibility)}\n${visibility}`;
    }

    function openIcityVisibilityPicker(currentValue, onSelect) {
        if (typeof window.openUniversalSelect !== 'function') {
            if (typeof window.showToast === 'function') window.showToast('权限选择弹窗暂不可用');
            return;
        }
        window.openUniversalSelect({
            title: '日记修改权限',
            items: ICITY_VISIBILITY_OPTIONS,
            currentValue: normalizeIcityVisibility(currentValue),
            searchable: false,
            onSelect
        });
        keepIcityDialogAboveApp();
    }

    function escapeIcityHtml(value) {
        return String(value ?? '').replace(/[&<>"']/g, char => ({
            '&': '&amp;',
            '<': '&lt;',
            '>': '&gt;',
            '"': '&quot;',
            "'": '&#39;'
        }[char]));
    }

    function getIcitySafeCoverBackground(value) {
        const background = String(value || '').trim();
        if (/^(?:#[0-9a-f]{3,8}|rgba?\([^;"']+\)|hsla?\([^;"']+\)|(?:linear|radial)-gradient\([^;"']+\))$/i.test(background)) return background;
        return 'linear-gradient(135deg, #6C8EF5, #9B6EF3)';
    }

    function isIcityRenderableImage(src) {
        const value = String(src || '').trim();
        return /^(?:data:image\/|blob:|https?:\/\/)/i.test(value);
    }

    function getIcityPostImages(post) {
        const rawImages = Array.isArray(post?.images) && post.images.length
            ? post.images
            : (post?.img ? [post.img] : []);
        const images = rawImages.map(item => String(item || '').trim()).filter(isIcityRenderableImage).slice(0, 9);
        if (images.length) return images;
        const legacyImage = String(post?.img || '').trim();
        return isIcityRenderableImage(legacyImage) ? [legacyImage] : [];
    }

    function getIcityImageLayout(post) {
        const allowed = ['single-column', 'two-column', 'three-column', 'horizontal'];
        const layout = String(post?.imageLayout || 'single-column');
        return allowed.includes(layout) ? layout : 'single-column';
    }

    function renderIcityImageItem(src, desc, index) {
        if (src === ICITY_IMAGE_PLACEHOLDER_URL) {
            return '<div class="icity-image-placeholder icity-gallery-item" data-image-index="' + index + '">' +
                '<div class="placeholder-desc-text">' + escapeIcityHtml(desc || '图片生成中') + '</div>' +
                '</div>';
        }
        return '<img class="icity-gallery-image icity-gallery-item" data-image-index="' + index + '" src="' + escapeIcityHtml(src) + '" alt="日记图片">';
    }

    function renderIcityFeedImage(post) {
        const images = getIcityPostImages(post);
        if (!images.length) return '';
        const desc = String(post?.imgDescription || post?.text || '').trim();
        if (images.length === 1) {
            return renderIcityImageItem(images[0], desc, 0);
        }
        const layout = getIcityImageLayout(post);
        return '<div class="icity-image-gallery icity-image-layout-' + layout + '" data-image-count="' + images.length + '">' +
            images.map((src, index) => renderIcityImageItem(src, desc, index)).join('') +
            '</div>';
    }

    function getDiaryCharacterCandidates(contactsData, wechatContactsData = null) {
        const contacts = Array.isArray(contactsData?.contacts) ? contactsData.contacts : [];
        const wechatContacts = wechatContactsData ? getWechatContactsList(wechatContactsData) : [];
        const friendCharacterIds = new Set();
        wechatContacts.forEach(contact => {
            const linkedContactId = String(contact?.linkedContactId || '').trim();
            const id = String(contact?.id || '').trim();
            if (linkedContactId) friendCharacterIds.add(linkedContactId);
            if (id.startsWith('char_')) friendCharacterIds.add(id.slice(5));
        });
        if (!wechatContacts.length) return contacts.filter(contact => String(contact?.name || '').trim());
        const candidates = contacts.filter(contact => {
            const contactId = String(contact?.id || '').trim();
            if (!String(contact?.name || '').trim()) return false;
            return !wechatContactsData || friendCharacterIds.has(contactId);
        });
        return candidates.length ? candidates : contacts.filter(contact => String(contact?.name || '').trim());
    }

    function pickDiaryCharacter(contactsData, wechatContactsData = null) {
        const candidates = getDiaryCharacterCandidates(contactsData, wechatContactsData);
        if (!candidates.length) return null;
        return candidates[Math.floor(Math.random() * candidates.length)];
    }

    function getWechatContactsList(record) {
        if (Array.isArray(record?.contacts)) return record.contacts;
        if (Array.isArray(record)) return record;
        return [];
    }

    function collectIcityWechatAuthorIds(contact) {
        const ids = [];
        const add = value => {
            const id = String(value || '').trim();
            if (id) ids.push(id);
        };
        add(contact?.id);
        add(contact?.wxid);
        add(contact?.wechatId);
        add(contact?.account);
        add(contact?.phone);
        const linkedContactId = String(contact?.linkedContactId || '').trim();
        if (linkedContactId) {
            add(linkedContactId);
            add('char_' + linkedContactId);
        }
        return ids;
    }

    function getIcityPostAuthorId(post) {
        const directId = String(post?.authorWechatId || post?.wechatId || post?.wechatWxid || '').trim();
        if (directId) return directId;
        const characterId = String(post?.characterId || '').trim();
        return characterId ? 'char_' + characterId : '';
    }

    function getIcityVisibleAuthorIds(boundAccount, wechatContactsData) {
        const visibleIds = new Set();
        String(boundAccount?.wxid || '').trim() && visibleIds.add(String(boundAccount.wxid).trim());
        getWechatContactsList(wechatContactsData).forEach(contact => {
            collectIcityWechatAuthorIds(contact).forEach(id => visibleIds.add(id));
        });
        return visibleIds;
    }

    function getIcityRelationshipKeys(value) {
        const raw = String(value || '').trim();
        if (!raw) return [];
        const normalized = raw.replace(/^@/, '');
        return Array.from(new Set([raw, normalized]));
    }

    function getIcityPostRelationshipIds(post) {
        const ids = [];
        const add = value => getIcityRelationshipKeys(value).forEach(id => ids.push(id));
        add(getIcityPostAuthorId(post));
        add(post?.authorWechatId);
        add(post?.wechatId);
        add(post?.wechatWxid);
        add(post?.user);
        add(post?.handle);
        const characterId = String(post?.characterId || '').trim();
        if (characterId) {
            add(characterId);
            add('char_' + characterId);
        }
        return Array.from(new Set(ids));
    }

    async function buildIcityVisibilityContext() {
        const [profile, authData, wechatContactsData, relationshipData] = await Promise.all([
            getProfile(),
            getWechatAuthData(),
            getWechatContactsData(),
            getIcityRelationshipsData()
        ]);
        const boundAccount = getBoundWechatAccount(profile, authData);
        const currentWxid = String(boundAccount?.wxid || '').trim();
        const friendAuthorIds = new Set();
        const blockedAuthorIds = new Set();
        (relationshipData?.items || []).forEach(item => {
            const keys = [
                ...getIcityRelationshipKeys(item.targetId),
                ...(item.targetType === 'character' ? getIcityRelationshipKeys('char_' + item.targetId) : [])
            ];
            if (item.friend && !item.blocked) keys.forEach(key => friendAuthorIds.add(key));
            if (item.blocked) keys.forEach(key => blockedAuthorIds.add(key));
        });
        return {
            profile,
            authData,
            wechatContactsData,
            boundAccount,
            currentWxid,
            friendAuthorIds,
            blockedAuthorIds
        };
    }

    function isIcityPostBlocked(post, context) {
        return getIcityPostRelationshipIds(post).some(id => context.blockedAuthorIds.has(id));
    }

    function isIcityPostFriend(post, context) {
        return getIcityPostRelationshipIds(post).some(id => context.friendAuthorIds.has(id));
    }

    function isIcityFeedVisibleToBoundWechat(post, context) {
        if (!post || isIcityPostBlocked(post, context)) return false;
        const visibility = normalizeIcityVisibility(post.visibility);
        const isMine = isCurrentIcityUserPost(post, context.boundAccount, { requireIdentity: visibility === '私人' });
        if (visibility === '私人') return isMine;
        if (visibility === '仅好友可见') return isMine || isIcityPostFriend(post, context);
        return true;
    }

    function filterIcityFeedsByVisibility(sourceFeeds, context) {
        return (Array.isArray(sourceFeeds) ? sourceFeeds : [])
            .filter(post => isIcityFeedVisibleToBoundWechat(post, context));
    }

    async function getVisibleIcityFeeds(feeds) {
        const sourceFeeds = Array.isArray(feeds) ? feeds : await getFeeds();
        const context = await buildIcityVisibilityContext();
        const profiles = await getIcityData('icity_character_profiles', {});
        return filterIcityFeedsByVisibility(sourceFeeds, context).map(post => {
            if (post.authorType !== 'character') return post;
            const local = profiles[getIcityDmThreadId({ characterId: post.characterId || post.authorWechatId, handle: post.handle, user: post.user })];
            return local ? { ...post, user: local.name || post.user, authorWechatName: local.name || post.authorWechatName,
                handle: local.handle || post.handle, avatar: local.avatar || post.avatar, authorWechatAvatar: local.avatar || post.authorWechatAvatar } : post;
        });
    }

    function getIcityStoredFollowerCount(profile) {
        if (Array.isArray(profile?.followers)) return profile.followers.length;
        if (Array.isArray(profile?.followerIds)) return profile.followerIds.length;
        const count = Number(profile?.followerCount || 0);
        return Number.isFinite(count) && count > 0 ? Math.floor(count) : 0;
    }

    function getIcityFriendCount(boundAccount, wechatContactsData) {
        if (!boundAccount) return 0;
        const friendKeys = new Set();
        getWechatContactsList(wechatContactsData).forEach(contact => {
            const key = String(
                contact?.wxid ||
                contact?.wechatId ||
                contact?.id ||
                contact?.linkedContactId ||
                contact?.name ||
                ''
            ).trim();
            if (key) friendKeys.add(key);
        });
        return friendKeys.size;
    }

    function getIcityPostLikeCount(post) {
        if (Array.isArray(post?.likedBy)) return post.likedBy.length;
        if (Array.isArray(post?.likedUsers)) return post.likedUsers.length;
        const count = Number(post?.likeCount ?? post?.likesCount ?? post?.likes ?? 0);
        if (Number.isFinite(count) && count > 0) return Math.floor(count);
        return post?.isLiked ? 1 : 0;
    }

    async function getIcityProfileStats(visibleFeeds) {
        const [profile, relationshipData] = await Promise.all([
            getProfile(),
            getIcityRelationshipsData()
        ]);
        const feeds = Array.isArray(visibleFeeds) ? visibleFeeds : [];
        return {
            followers: getIcityStoredFollowerCount(profile),
            friends: (relationshipData?.items || []).filter(item => item.friend && !item.blocked).length,
            diaries: feeds.length,
            liked: feeds.reduce((total, post) => total + getIcityPostLikeCount(post), 0)
        };
    }

    function getIcityFontLabel(profile) {
        return profile?.icityFontName ? String(profile.icityFontName).trim() : '自动';
    }

    function normalizeIcityGender(value) {
        const gender = String(value || '').trim();
        if (gender === '男' || gender === '男生') return '男';
        if (gender === '女' || gender === '女生') return '女';
        return '保密';
    }

    function getIcityGlobalTheme() {
        if (document.querySelector('.iphone')?.classList.contains('dark-mode')) return 'night';
        if (typeof appSettings !== 'undefined' && appSettings?.ios_theme_mode === 'dark') return 'night';
        return 'day';
    }

    function hasIcityThemeOverride(profile) {
        return profile?.icityThemeManual === true || Object.prototype.hasOwnProperty.call(profile || {}, 'icityTheme');
    }

    function resolveIcityTheme(profile) {
        if (!hasIcityThemeOverride(profile)) return getIcityGlobalTheme();
        return String(profile?.icityTheme || 'day').trim() === 'night' ? 'night' : 'day';
    }

    function applyIcityTheme(profile) {
        const wrapper = $('#icityNewAppUI');
        if (!wrapper) return;
        const theme = resolveIcityTheme(profile);
        const isNight = theme === 'night';
        wrapper.classList.toggle('theme-night', isNight);
        wrapper.classList.toggle('theme-day', !isNight);
        wrapper.style.backgroundColor = isNight ? '#050506' : '#EFEFF4';
        const innerContainer = wrapper.querySelector('.icity-app-inner-container');
        if (innerContainer) innerContainer.style.backgroundColor = isNight ? '#111111' : '#F1EFEF';
        wrapper.querySelectorAll('.view-container').forEach(view => {
            view.style.backgroundColor = isNight ? '#111111' : '';
        });
    }

    function applyIcityFont(profile) {
        const wrapper = $('#icityNewAppUI');
        if (!wrapper) return;
        const fontData = String(profile?.icityFontData || '').trim();
        const fontName = String(profile?.icityFontName || '').trim();
        if (fontData && fontName) {
            wrapper.classList.add('uses-custom-font');
            wrapper.style.setProperty('--icity-custom-font', `'${fontName.replace(/'/g, "\\'")}'`);
            let style = document.getElementById('icityCustomFontStyle');
            if (!style) {
                style = document.createElement('style');
                style.id = 'icityCustomFontStyle';
                document.head.appendChild(style);
            }
            style.textContent = `
                @font-face {
                    font-family: '${fontName.replace(/'/g, "\\'")}';
                    src: url('${fontData}');
                }
            `;
        } else {
            wrapper.classList.remove('uses-custom-font');
            wrapper.style.removeProperty('--icity-custom-font');
            const style = document.getElementById('icityCustomFontStyle');
            if (style) style.remove();
        }
    }

    function applyIcityPreferenceUi(profile = {}) {
        const theme = resolveIcityTheme(profile);
        const fontLabel = getIcityFontLabel(profile);
        const autoDiaryEnabled = profile.autoDiaryEnabled === true;
        const autoDiaryTime = String(profile.autoDiaryTime || ICITY_DEFAULT_AUTO_DIARY_TIME).trim();
        $$('[data-icity-pref="skin"]').forEach(el => { el.textContent = theme === 'night' ? '黑夜主题' : '白昼主题'; });
        $$('[data-icity-pref="font"]').forEach(el => { el.textContent = fontLabel; });
        $$('[data-icity-pref="auto-diary-switch"]').forEach(el => {
            const input = el.querySelector('input');
            if (input) input.checked = autoDiaryEnabled;
        });
        $$('[data-icity-pref="reminder-time"]').forEach(el => { el.textContent = autoDiaryTime; });
        applyIcityTheme(profile);
        applyIcityFont(profile);
    }

    async function setIcityTheme(theme) {
        const normalized = theme === 'night' ? 'night' : 'day';
        applyIcityTheme({ icityTheme: normalized, icityThemeManual: true });
        try {
            const profile = await patchProfileData({ icityTheme: normalized, icityThemeManual: true });
            applyIcityPreferenceUi({ ...profile, icityTheme: normalized, icityThemeManual: true });
        } catch (error) {
            applyIcityTheme({ icityTheme: normalized, icityThemeManual: true });
            throw error;
        }
    }

    async function setIcityFontPreference(fontData, fontName) {
        const profile = await patchProfileData({
            icityFontData: fontData || '',
            icityFontName: fontName || ''
        });
        applyIcityPreferenceUi(profile);
        return profile;
    }

    async function setIcityAutoDiaryEnabled(enabled) {
        const profile = await saveProfileData('autoDiaryEnabled', enabled === true);
        applyIcityPreferenceUi(profile);
        updateIcityAutoDiaryScheduler();
    }

    async function setIcityAutoDiaryTime(timeText) {
        const normalized = String(timeText || '').trim();
        if (!/^\d{2}:\d{2}$/.test(normalized)) throw new Error('请输入 24 小时时间，例如 20:33');
        const profile = await saveProfileData('autoDiaryTime', normalized);
        applyIcityPreferenceUi(profile);
        updateIcityAutoDiaryScheduler();
    }

    function stopIcityAutoDiaryScheduler() {
        if (icityAutoDiaryTimer) {
            clearInterval(icityAutoDiaryTimer);
            icityAutoDiaryTimer = null;
        }
    }

    async function maybeRunIcityAutoDiary() {
        const [profile, authData] = await Promise.all([getProfile(), getWechatAuthData()]);
        if (profile.autoDiaryEnabled !== true) return;
        const boundAccount = getBoundWechatAccount(profile, authData);
        if (!boundAccount) return;
        const api = await getConnectedIcityApi().catch(() => null);
        if (!api) return;
        const timeText = String(profile.autoDiaryTime || ICITY_DEFAULT_AUTO_DIARY_TIME).trim();
        const now = new Date();
        const currentText = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
        const todayText = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
        if (currentText !== timeText || profile.lastAutoDiaryDate === todayText) return;
        if (icityAutoDiaryRunning) return;
        icityAutoDiaryRunning = true;
        try {
            const result = await generateCharacterDiaryFromPublishButton(null);
            if (result) {
                await saveProfileData('lastAutoDiaryDate', todayText);
            }
        } finally {
            icityAutoDiaryRunning = false;
        }
    }

    function updateIcityAutoDiaryScheduler() {
        stopIcityAutoDiaryScheduler();
        icityAutoDiaryTimer = setInterval(() => {
            maybeRunIcityAutoDiary().catch(error => console.warn('Diary auto diary scheduler failed:', error));
        }, 60 * 1000);
        maybeRunIcityAutoDiary().catch(error => console.warn('Diary auto diary immediate check failed:', error));
    }

    function isIcityWorldOnlyPost(post) {
        return post?.scope === 'world'
            || post?.scope === 'friends'
            || post?.authorType === 'passerby'
            || post?.authorType === 'character';
    }

    function isCurrentIcityUserPost(post, boundAccount, options = {}) {
        if (isIcityWorldOnlyPost(post) || post?.authorType === 'character') return false;
        const authorId = getIcityPostAuthorId(post);
        const currentWxid = String(boundAccount?.wxid || '').trim();
        if (authorId) return Boolean(currentWxid && authorId === currentWxid);
        return options.requireIdentity ? false : post?.authorType === 'user';
    }

    async function getIcitySinglePostIdentity(post) {
        const [profile, authData] = await Promise.all([getProfile(), getWechatAuthData()]);
        const boundAccount = getBoundWechatAccount(profile, authData);
        if (isCurrentIcityUserPost(post, boundAccount)) {
            const name = String(boundAccount?.name || profile?.nickname || post?.user || '未命名市民').trim();
            const handle = profile?.icityId ? '@' + profile.icityId : (boundAccount?.wxid ? '@' + boundAccount.wxid : (post?.handle || '@diary_user'));
            const avatar = boundAccount?.avatar || profile?.avatar || post?.authorWechatAvatar || post?.avatar || '';
            return { name, handle, avatar, authorType: 'user', isCurrentUser: true };
        }
        return {
            name: post?.authorWechatName || post?.user || '未命名市民',
            handle: post?.handle || '@diary_user',
            avatar: post?.authorWechatAvatar || post?.avatar || '',
            authorType: post?.authorType || 'passerby',
            characterId: getIcityCleanCharacterId(post?.characterId || (post?.authorType === 'character' ? post?.authorWechatId : '')),
            isCurrentUser: false
        };
    }

    function parseIcityJsonArray(content) {
        const raw = String(content || '').trim();
        if (!raw) return [];
        const fenced = raw.match(/```(?:json)?\s*([\s\S]*?)```/i);
        const source = fenced ? fenced[1].trim() : raw;
        const start = source.indexOf('[');
        const end = source.lastIndexOf(']');
        const jsonText = start >= 0 && end > start ? source.slice(start, end + 1) : source;
        try {
            const parsed = JSON.parse(jsonText);
            return Array.isArray(parsed) ? parsed : [];
        } catch (error) {
            return source.split(/\n{2,}|(?:^|\n)\s*\d+[.、]\s*/).map(text => ({ text: text.trim() })).filter(item => item.text);
        }
    }

    function pickIcityPasserbyAvatar(index) {
        const palettes = [
            ['#8AB4F8', '#B5EAD7'],
            ['#FFB340', '#FFD6A5'],
            ['#CDB4DB', '#FFC8DD'],
            ['#90CAF9', '#A5D6A7'],
            ['#B0BEC5', '#F8BBD0']
        ];
        const pair = palettes[index % palettes.length];
        return `linear-gradient(135deg, ${pair[0]}, ${pair[1]})`;
    }

    function pickIcityPasserbyName(index) {
        const names = [
            '小夏', '阿宁', '林晓', '周屿', '安然', '陈默', '许言', '顾北',
            '宋予', '叶舟', '沈知', '苏禾', '唐棠', '陆野', '姜梨', '白川',
            '温言', '江澈', '夏屿', '程然', '乔安', '何夕', '岑晚', '简一'
        ];
        return names[index % names.length];
    }

    function buildIcityPasserbyFallbackComment(post, target, index) {
        const snippets = [
            String(post?.text || '').trim().slice(0, 24),
            String(post?.location || '').trim(),
            String(post?.diary || '').trim()
        ].filter(Boolean);
        const snippet = snippets[0] || '这条日记';
        const opening = ['刚刷到这个瞬间', '路过时停了一下', '本来只是随便看看'];
        const reaction = target?.type === 'passerby'
            ? ['感觉很真实', '有点被戳到', '细节挺有画面感', '莫名很共情']
            : ['说得很轻，但情绪很满', '看完有点安静下来', '像是把心事藏进了字里'];
        const ending = ['，尤其是这个片段。', '，越看越有代入感。', '，挺难不多想。'];
        return `${opening[index % opening.length]}，${snippet}${reaction[index % reaction.length]}${ending[index % ending.length]}`;
    }

    async function requestWorldPasserbyDiaries(api) {
        const count = Math.floor(Math.random() * 3) + 8;
        const prompt = [
            `请为 Diary 的“世界”频道随机生成 ${count} 条路人日记。`,
            '作者是普通路人，不是用户、不是现有角色，也不要引用任何联系人。',
            '路人日记要像真实用户刚刚发到世界频道的生活记录，具体、自然、有生活细节，不要空话。',
            '每条内容都要有不同的人、不同生活场景和不同情绪，避免重复句式和模板感。',
            '人物名字要像真实中文昵称，不要使用“路人1”“路人2”这种敷衍命名。',
            '只输出 JSON 数组，不要 Markdown，不要解释。每项字段：user、handle、text、location。'
        ].join('\n');
        const content = await requestIcityChatCompletion(api, [
            { role: 'system', content: '你是 Diary 世界频道的路人日记生成器，只输出可解析 JSON。' },
            { role: 'user', content: prompt }
        ], { temperature: 1, emptyMessage: 'API 没有返回路人日记内容' });
        const parsed = parseIcityJsonArray(content).slice(0, count).map((item, index) => ({
            user: String(item?.user || pickIcityPasserbyName(index)).trim(),
            handle: String(item?.handle || `@passerby_${Date.now()}_${index + 1}`).trim(),
            text: String(item?.text || '').trim(),
            location: String(item?.location || '').trim()
        })).filter(item => item.text);
        while (parsed.length < count) {
            const index = parsed.length;
            parsed.push({
                user: pickIcityPasserbyName(index),
                handle: `@passerby_${Date.now()}_${index + 1}`,
                text: buildIcityPasserbyFallbackComment({ text: `刚刚生成的世界日记 ${index + 1}` }, { type: 'passerby' }, index),
                location: ''
            });
        }
        return parsed;
    }

    function parseIcityJsonObject(content) {
        const raw = String(content || '').trim();
        if (!raw) return {};
        const fenced = raw.match(/```(?:json)?\s*([\s\S]*?)```/i);
        const source = fenced ? fenced[1].trim() : raw;
        const start = source.indexOf('{');
        const end = source.lastIndexOf('}');
        const jsonText = start >= 0 && end > start ? source.slice(start, end + 1) : source;
        try {
            const parsed = JSON.parse(jsonText);
            return parsed && typeof parsed === 'object' && !Array.isArray(parsed) ? parsed : {};
        } catch (error) {
            return {};
        }
    }

    function sampleIcityItems(items, count) {
        const source = Array.isArray(items) ? items.slice() : [];
        const result = [];
        while (source.length && result.length < count) {
            const index = Math.floor(Math.random() * source.length);
            result.push(source.splice(index, 1)[0]);
        }
        return result;
    }

    function getWechatContactForCharacter(contact, wechatContactsData) {
        const contacts = getWechatContactsList(wechatContactsData);
        const characterId = String(contact?.id || '').trim();
        if (!characterId) return null;
        const linkedId = 'char_' + characterId;
        return contacts.find(item => item && (
            String(item.linkedContactId || '') === characterId ||
            String(item.id || '') === linkedId
        )) || null;
    }

    function getIcityReactionContactCandidates(contactsData, wechatContactsData, excludeCharacterId = '') {
        const contacts = Array.isArray(contactsData?.contacts) ? contactsData.contacts : [];
        const wechatContacts = getWechatContactsList(wechatContactsData);
        const cleanExcludeId = getIcityCleanCharacterId(excludeCharacterId);

        const candidates = [];
        const seen = new Set();

        // 优先从微信通讯录取（含最新头像和真实备注）
        wechatContacts.forEach(wechatContact => {
            const rawId = wechatContact?.linkedContactId || wechatContact?.id || '';
            const cleanId = getIcityCleanCharacterId(rawId);
            const name = String(wechatContact?.remark || wechatContact?.name || '').trim();
            if (!cleanId || !name || seen.has(cleanId)) return;
            if (cleanExcludeId && cleanId === cleanExcludeId) return;

            seen.add(cleanId);
            const originalContact = contacts.find(c => getIcityCleanCharacterId(c?.id) === cleanId);
            candidates.push({
                contact: {
                    id: cleanId,
                    name: name,
                    persona: originalContact?.persona || wechatContact.persona || wechatContact.description || '',
                    appearance: originalContact?.appearance || wechatContact.appearance || '',
                    avatar: wechatContact.avatar || originalContact?.avatar || ''
                },
                wechatContact
            });
        });

        // 补充 ContactsApp 中尚未加微信的好友
        contacts.forEach(contact => {
            const cleanId = getIcityCleanCharacterId(contact?.id);
            if (!cleanId || seen.has(cleanId)) return;
            if (cleanExcludeId && cleanId === cleanExcludeId) return;
            if (!String(contact?.name || '').trim()) return;

            seen.add(cleanId);
            candidates.push({
                contact: {
                    id: cleanId,
                    name: String(contact.name).trim(),
                    persona: contact.persona || '',
                    appearance: contact.appearance || '',
                    avatar: contact.avatar || ''
                },
                wechatContact: null
            });
        });

        return candidates;
    }

    function createIcityAutoComment(target, text, index) {
        const now = new Date();
        const timeString = `${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')} ${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
        const avatar = target.avatar || pickIcityPasserbyAvatar(index);
        const finalText = target.type === 'passerby' && String(text || '').trim().length < 12
            ? buildIcityPasserbyFallbackComment({ text }, target, index)
            : text;
        return {
            id: Date.now() + index + Math.floor(Math.random() * 1000),
            text: finalText,
            user: target.name,
            avatar: target.avatar || avatar || '',
            avatarStyle: getIcityAvatarStyle(avatar),
            time: timeString,
            isAutoGenerated: true,
            authorType: target.type,
            characterId: target.type === 'contact' ? getIcityCleanCharacterId(target.characterId) : null,
            handle: target.handle || ''
        };
    }

    function createIcityDmId(prefix) {
        if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') return crypto.randomUUID();
        return (prefix || 'icity_dm') + '_' + Date.now() + '_' + Math.random().toString(16).slice(2);
    }

    function getIcityCleanCharacterId(value) {
        const str = String(value || '').trim();
        if (!str) return '';
        return str.replace(/^char_/, '');
    }

    function getIcityDmThreadId(target) {
        if (target?.threadId) return String(target.threadId).trim().toLowerCase();
        const cleanCharId = getIcityCleanCharacterId(target?.characterId || target?.authorWechatId || target?.wechatId || target?.id);
        if (cleanCharId) return 'icity_thread_char_' + cleanCharId.toLowerCase();
        const fallback = target?.handle || target?.user || 'unknown';
        return 'icity_thread_' + String(fallback).trim().toLowerCase();
    }

    function normalizeIcityDmMessage(message) {
        const normalized = message && typeof message === 'object' ? Object.assign({}, message) : {};
        const target = {
            threadId: normalized.threadId,
            characterId: normalized.characterId || normalized.authorWechatId,
            handle: normalized.handle,
            user: normalized.user
        };
        normalized.id = normalized.id || createIcityDmId('icity_dm');
        normalized.threadId = normalized.threadId || getIcityDmThreadId(target);
        normalized.characterId = normalized.characterId ? getIcityCleanCharacterId(normalized.characterId) : null;
        normalized.text = String(normalized.text || '').trim();
        normalized.createdAt = Number(normalized.createdAt || Date.now());
        normalized.isFromMe = normalized.isFromMe === true;
        normalized.status = normalized.status || (normalized.isFromMe ? 'sent' : 'received');
        normalized.replyToPostId = normalized.replyToPostId || normalized.postId || null;
        return normalized;
    }

    async function getIcityDms() {
        const stored = await getIcityData('icity_dms', []);
        return (Array.isArray(stored) ? stored : []).map(normalizeIcityDmMessage);
    }

    function getIcityDmReplyingSet() {
        if (!(window.icityDmReplying instanceof Set)) window.icityDmReplying = new Set();
        return window.icityDmReplying;
    }

    window.currentIcityChatTarget = null;

    async function applyIcityCharacterProfile(info, identifier) {
        const threadId = getIcityDmThreadId({ ...identifier, characterId: info.characterId });
        const profiles = await getIcityData('icity_character_profiles', {});
        const local = profiles[threadId] || {};
        return { ...info, ...local, characterId: info.characterId, threadId };
    }

    async function refreshIcityCharacterProfile(target) {
        const info = await resolveIcityLiveCharacterInfo(target);
        const fields = { '#char-profile-name': info.name, '#char-profile-handle': info.handle,
            '#char-profile-bio': info.bio, '#char-profile-location span': info.location };
        Object.entries(fields).forEach(([selector, value]) => {
            if (value !== undefined && $(selector)) $(selector).textContent = value;
        });
        if ($('#char-profile-avatar')) $('#char-profile-avatar').style.cssText = getIcityAvatarStyle(info.avatar);
        if ($('#char-profile-bg')) $('#char-profile-bg').style.backgroundImage = normalizeIcityAvatarBackground(
            info.background !== undefined ? info.background : info.avatar) || 'none';
        window.currentViewingIcityProfileTarget = { ...target, characterId: info.characterId, threadId: info.threadId };
        return info;
    }

    async function openIcityCharacterProfileEditor() {
        const target = window.currentViewingIcityProfileTarget;
        if (!target) return;
        const info = await resolveIcityLiveCharacterInfo(target);
        const accountId = getIcityActiveAccountId();
        let modal = $('#modal-edit-char-profile');
        if (!modal) {
            modal = document.createElement('div');
            modal.id = 'modal-edit-char-profile';
            modal.className = 'modal-overlay';
            modal.style.cssText = 'display: none; position: absolute; inset: 0; z-index: 300; background: rgba(0,0,0,.3); align-items: center; justify-content: center; padding: 20px; box-sizing: border-box;';
            modal.innerHTML = '<style>#modal-edit-char-profile form{width:100%;max-height:85%;overflow:auto;background:var(--bg-main);color:var(--text-main);border-radius:18px;padding:20px;box-sizing:border-box;display:grid;gap:14px}#modal-edit-char-profile label{display:grid;gap:6px;font-size:13px}#modal-edit-char-profile input,#modal-edit-char-profile textarea{width:100%;min-width:0;box-sizing:border-box;border:1px solid var(--border-color);border-radius:8px;background:var(--white);color:var(--text-main);padding:10px;font:inherit}#modal-edit-char-profile button{border:0;border-radius:8px;padding:10px 16px;background:var(--white);color:var(--text-main);font:inherit;cursor:pointer}</style>' +
                '<form role="dialog" aria-modal="true" aria-label="修改角色资料">' +
                '<strong>修改资料</strong><span style="font-size:12px;color:var(--text-light)">仅在日记 App 内生效</span>' +
                '<label>昵称<input name="name" required maxlength="40"></label>' +
                '<label>Diary ID<input name="handle" required maxlength="60"></label>' +
                '<label>简介<textarea name="bio" rows="3" maxlength="500"></textarea></label>' +
                '<label>所在地<input name="location" maxlength="80"></label>' +
                '<label>更换头像<input type="file" name="avatar" accept="image/*"></label>' +
                '<label>更换背景<input type="file" name="background" accept="image/*"></label>' +
                '<div style="display:flex;justify-content:flex-end;gap:8px"><button type="button" data-cancel>取消</button><button type="submit" style="background:#34C759;color:#fff">保存</button></div></form>';
            icityRoot.querySelector('.icity-app-inner-container').appendChild(modal);
            modal.querySelector('[data-cancel]').onclick = () => { modal.style.display = 'none'; };
            modal.onclick = event => { if (event.target === modal) modal.style.display = 'none'; };
        }
        const form = modal.querySelector('form');
        form.reset();
        const values = { ...info, bio: info.bio ?? $('#char-profile-bio')?.textContent ?? '', location: info.location ?? $('#char-profile-location span')?.textContent ?? '' };
        ['name', 'handle', 'bio', 'location'].forEach(key => { form.elements.namedItem(key).value = values[key] || ''; });
        form.onsubmit = async event => {
            event.preventDefault();
            const saveButton = form.querySelector('[type="submit"]');
            if (saveButton.disabled) return;
            saveButton.disabled = true;
            try {
                const local = {};
                ['name', 'handle', 'bio', 'location'].forEach(key => { local[key] = form.elements.namedItem(key).value.trim(); });
                if (!local.name || !local.handle.replace(/^@/, '').trim()) throw new Error('请填写昵称和 Diary ID');
                local.handle = '@' + local.handle.replace(/^@+/, '');
                for (const key of ['avatar', 'background']) {
                    const file = form.elements.namedItem(key).files[0];
                    if (file) local[key] = await readIcityImageFile(file);
                }
                await withIcityDataLock('icity_character_profiles', {}, stored => {
                    if (getIcityActiveAccountId() !== accountId) throw new Error('账号已切换，请重新编辑');
                    return { ...stored, [info.threadId]: { ...stored[info.threadId], ...local } };
                });
                modal.style.display = 'none';
                await refreshIcityCharacterProfile(target);
                if (window.currentIcityChatTarget && getIcityDmThreadId(window.currentIcityChatTarget) === info.threadId) {
                    const live = await resolveIcityLiveCharacterInfo(window.currentIcityChatTarget);
                    Object.assign(window.currentIcityChatTarget, { user: live.name, handle: live.handle, avatar: live.avatar });
                    $('#chat-room-title').textContent = live.name;
                    $('#chat-room-handle').textContent = live.handle;
                }
                await Promise.all([renderIcityChatMessages(), renderIcityDmList(), renderIcityContactsFriendsList(), renderAllFeeds()]);
                showIcityFeedback('资料已保存');
            } catch (error) {
                showIcityFeedback(error.message || '资料保存失败，请重试');
            } finally {
                saveButton.disabled = false;
            }
        };
        modal.style.display = 'flex';
    }

    function isIcityDmInThread(message, target) {
        if (message.threadId === getIcityDmThreadId(target)) return true;
        const targetId = getIcityCleanCharacterId(target.characterId);
        const messageId = getIcityCleanCharacterId(message.characterId);
        if (targetId && messageId) return targetId === messageId;
        if (messageId) return false;
        return Boolean((target.handle && message.handle === target.handle) || (target.user && message.user === target.user));
    }

    const icityDmRevisions = new Map();
    function getIcityDmRevisionKey(target) {
        return getIcityStorageKey('icity_dms') + ':' + getIcityDmThreadId(target);
    }

    async function deleteIcityDm(target, messageId) {
        if (!target || !confirm(messageId ? '确定删除这条私信吗？' : '确定删除与该角色的全部私信吗？')) return;
        const revisionKey = getIcityDmRevisionKey(target);
        icityDmRevisions.set(revisionKey, (icityDmRevisions.get(revisionKey) || 0) + 1);
        try {
            await withIcityDataLock('icity_dms', [], stored => (Array.isArray(stored) ? stored : []).filter(message =>
                messageId ? String(message.id) !== String(messageId) : !isIcityDmInThread(message, target)));
            await renderIcityChatMessages();
            await renderIcityDmList();
        } catch (error) {
            showIcityFeedback(error.message || '私信删除失败，请重试');
        }
    }

    async function resolveIcityLiveCharacterInfo(identifier) {
        if (!identifier) return { name: '', avatar: '', handle: '', characterId: '' };
        const cleanId = getIcityCleanCharacterId(identifier?.characterId || identifier?.authorWechatId || identifier?.id || (typeof identifier === 'string' ? identifier : ''));
        const [contactsData, wechatContactsData] = await Promise.all([getContactsData(), getWechatContactsData()]);
        const contacts = Array.isArray(contactsData?.contacts) ? contactsData.contacts : [];
        const wechatContacts = getWechatContactsList(wechatContactsData);

        let matched = null;
        if (cleanId) {
            matched = contacts.find(c => String(c?.id || '').trim() === cleanId)
                || wechatContacts.find(w => String(w?.linkedContactId || '').trim() === cleanId || String(w?.id || '').replace(/^char_/, '').trim() === cleanId);
        }
        if (!matched && !cleanId && identifier?.user) {
            const targetUser = String(identifier.user).trim();
            matched = wechatContacts.find(w => String(w?.remark || w?.name || '').trim() === targetUser)
                || contacts.find(c => String(c?.name || '').trim() === targetUser);
        }
        if (!matched && !cleanId && identifier?.handle) {
            const targetHandle = String(identifier.handle).replace(/^@/, '').trim();
            matched = wechatContacts.find(w => String(w?.wxid || w?.account || '').trim() === targetHandle)
                || contacts.find(c => String(c?.security?.account || '').trim() === targetHandle);
        }

        if (matched) {
            const finalCharId = getIcityCleanCharacterId(matched.linkedContactId || matched.id);
            const liveAvatar = matched.avatar || '';
            const liveName = matched.remark || matched.name || identifier?.user || '市民';
            const liveHandle = matched.wxid ? '@' + matched.wxid : (matched.security?.account ? '@' + matched.security.account : (identifier?.handle || '@icity'));
            return applyIcityCharacterProfile({
                characterId: finalCharId,
                name: liveName,
                avatar: liveAvatar,
                handle: liveHandle
            }, identifier);
        }

        return applyIcityCharacterProfile({
            characterId: cleanId || '',
            name: identifier?.user || identifier?.name || '市民',
            avatar: identifier?.avatar || '',
            handle: identifier?.handle || '@icity'
        }, identifier);
    }

    async function openIcityChatRoom(target) {
        const liveInfo = await resolveIcityLiveCharacterInfo(target);
        const resolvedTarget = {
            ...target,
            threadId: liveInfo.threadId,
            characterId: liveInfo.characterId || target?.characterId,
            user: liveInfo.name || target?.user,
            handle: liveInfo.handle || target?.handle,
            avatar: liveInfo.avatar || target?.avatar
        };
        window.currentIcityChatTarget = resolvedTarget;
        $$('.view-container').forEach(v => v.classList.remove('active'));
        if (mainBottomNav) mainBottomNav.style.display = 'none';
        
        const chatTitle = $('#chat-room-title');
        const chatHandle = $('#chat-room-handle');
        if (chatTitle) chatTitle.textContent = resolvedTarget.user || '私信';
        if (chatHandle) chatHandle.textContent = resolvedTarget.handle || '@diary_user';
        
        const btnToProfile = $('#btn-chat-to-profile');
        if (btnToProfile) btnToProfile.onclick = () => openCharProfileById(
            resolvedTarget.characterId, resolvedTarget.user, resolvedTarget.handle, resolvedTarget.avatar);

        const viewChatEl = $('#view-chat');
        if (viewChatEl) viewChatEl.classList.add('active');
        await renderIcityChatMessages();
    }

    async function renderIcityChatMessages() {
        const chatContainer = $('#chat-messages-container');
        if (!chatContainer || !window.currentIcityChatTarget) return;

        const target = window.currentIcityChatTarget;
        const liveTarget = await resolveIcityLiveCharacterInfo(target);
        const threadId = getIcityDmThreadId(liveTarget);
        const dms = await getIcityDms();

        const messages = dms.filter(message => isIcityDmInThread(message, { ...target, ...liveTarget }));
        messages.sort((a, b) => Number(a.createdAt || 0) - Number(b.createdAt || 0));

        const [profile, authData] = await Promise.all([getProfile(), getWechatAuthData()]);
        const boundAccount = getBoundWechatAccount(profile, authData);
        const myAvatar = boundAccount?.avatar || profile?.avatar || '';

        if (!messages.length && !getIcityDmReplyingSet().has(threadId)) {
            chatContainer.innerHTML = '<div style="padding: 30px; text-align: center; color: var(--text-light); font-size: 13px;">暂无私信记录，开始聊天吧~</div>';
            return;
        }

        const messageMarkup = messages.map(message => {
            const isMe = message.isFromMe === true;
            // 角色头像永远从 liveTarget 中读取最新头像，杜绝旧头像残留
            const avatar = isMe ? myAvatar : (liveTarget.avatar || message.avatar || '');
            const avatarStyle = getIcityAvatarStyle(avatar);
            const retryMarkup = isMe && message.status === 'failed'
                ? '<div class="icity-dm-reply-error">' + escapeIcityHtml(message.replyError || '自动回复失败') + '<button type="button" class="icity-dm-retry" data-message-id="' + escapeIcityHtml(message.id) + '">重试</button></div>'
                : '';
            return '<div class="chat-bubble-row ' + (isMe ? 'is-me' : 'is-other') + '">' +
                '<div class="chat-bubble-avatar" style="' + avatarStyle + '"></div>' +
                '<div class="chat-bubble-box">' + escapeIcityHtml(message.text) + retryMarkup + '</div>' +
                '<button type="button" class="icity-dm-delete" data-message-id="' + escapeIcityHtml(message.id) + '" aria-label="删除这条私信" style="border: none; background: transparent; color: var(--text-light); padding: 8px 4px; font-size: 11px; cursor: pointer; flex-shrink: 0; align-self: center;">删除</button>' +
                '</div>';
        }).join('');

        const typingMarkup = getIcityDmReplyingSet().has(threadId)
            ? '<div class="icity-dm-typing"><span></span><span></span><span></span> 对方正在输入…</div>'
            : '';
        chatContainer.innerHTML = messageMarkup + typingMarkup;

        chatContainer.querySelectorAll('.icity-dm-retry').forEach(button => {
            bindIcityTap(button, () => retryIcityDmReply(button.dataset.messageId));
        });
        chatContainer.querySelectorAll('.icity-dm-delete').forEach(button => {
            bindIcityTap(button, () => deleteIcityDm(target, button.dataset.messageId));
        });
        setTimeout(() => { chatContainer.scrollTop = chatContainer.scrollHeight; }, 50);
    }

    async function renderIcityDmList() {
        const container = $('#content-msg-dms');
        if (!container) return;
        const dms = (await getIcityDms()).slice().sort((a, b) => Number(b.createdAt || 0) - Number(a.createdAt || 0));
        if (!dms.length) {
            container.innerHTML = '<div class="card-box" style="padding: 30px; text-align: center; color: var(--text-light);">暂无私信</div>';
            return;
        }

        // 按唯一稳定的角色 ID 或规范 threadId 聚合会话，不再因改名备注割裂为多个
        const threads = new Map();
        for (const dm of dms) {
            const cleanId = getIcityCleanCharacterId(dm.characterId);
            const stableKey = cleanId ? ('char_' + cleanId) : (dm.threadId || dm.handle || dm.user || 'unknown');
            if (!threads.has(stableKey)) {
                threads.set(stableKey, dm);
            }
        }

        const items = await Promise.all(Array.from(threads.values()).map(async (dm) => {
            const liveInfo = await resolveIcityLiveCharacterInfo({
                threadId: dm.threadId,
                characterId: dm.characterId,
                user: dm.user,
                handle: dm.handle,
                avatar: dm.avatar
            });
            const date = new Date(Number(dm.createdAt || Date.now()));
            const time = `${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')} ${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}`;
            const avatarStyle = getIcityAvatarStyle(liveInfo.avatar || dm.avatar);
            const displayName = liveInfo.name || dm.user || '联系人';
            const displayHandle = liveInfo.handle || dm.handle || '@icity';

            return `
                <div class="card-box icity-dm-conversation-item" data-thread="${escapeIcityHtml(dm.threadId)}" data-cid="${escapeIcityHtml(liveInfo.characterId || dm.characterId || '')}" data-user="${escapeIcityHtml(displayName)}" data-handle="${escapeIcityHtml(displayHandle)}" style="margin-bottom: 8px; cursor: pointer;">
                    <div class="entry-item" style="display: flex; align-items: center; gap: 12px;">
                        <div class="avatar" style="${avatarStyle}"></div>
                        <div style="min-width: 0; flex: 1;">
                            <div class="name" style="display: flex; justify-content: space-between; gap: 8px;">
                                <span>${escapeIcityHtml(displayName)}</span>
                                <span style="font-size: 12px; font-weight: 400; color: var(--text-light); white-space: nowrap;">${time}</span>
                            </div>
                            <div class="username">${escapeIcityHtml(displayHandle)}</div>
                            <div style="margin-top: 5px; color: var(--text-sub); font-size: 13px; line-height: 1.4; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">${escapeIcityHtml(dm.text)}</div>
                        </div>
                        <button type="button" class="icity-delete-thread" aria-label="删除私信会话" style="border: none; background: transparent; color: var(--text-light); padding: 10px 2px; cursor: pointer;">删除</button>
                    </div>
                </div>
            `;
        }));

        container.innerHTML = items.join('');

        container.querySelectorAll('.icity-dm-conversation-item').forEach(item => {
            const target = { threadId: item.dataset.thread, characterId: item.dataset.cid || '', user: item.dataset.user, handle: item.dataset.handle };
            bindIcityTap(item, event => {
                if (!event.target.closest('.icity-delete-thread')) openIcityChatRoom(target);
            });
            bindIcityTap(item.querySelector('.icity-delete-thread'), event => {
                event.stopPropagation();
                return deleteIcityDm(target);
            });
        });
    }

    async function appendIcityIncomingMessage(target, text, post) {
        const cleanText = String(text || '').trim();
        if (!cleanText) return false;
        const liveInfo = await resolveIcityLiveCharacterInfo(target);
        const resolvedTarget = {
            ...target,
            characterId: liveInfo.characterId || target?.characterId,
            user: liveInfo.name || target?.name || target?.user,
            handle: liveInfo.handle || target?.handle,
            avatar: liveInfo.avatar || target?.avatar
        };
        const threadId = getIcityDmThreadId(resolvedTarget);

        // 去重防抖检查：防止并发产生一模一样的重复回复
        const currentDms = await getIcityDms();
        const now = Date.now();
        const hasDuplicateRecent = currentDms.some(dm => 
            dm.threadId === threadId &&
            !dm.isFromMe &&
            dm.text === cleanText &&
            Math.abs(now - Number(dm.createdAt || 0)) < 15000
        );
        if (hasDuplicateRecent) {
            return false;
        }

        const incoming = normalizeIcityDmMessage({
            id: createIcityDmId('icity_dm'),
            threadId,
            characterId: resolvedTarget.characterId || null,
            user: resolvedTarget.user || '联系人',
            handle: resolvedTarget.handle || '@icity',
            avatar: resolvedTarget.avatar || '',
            text: cleanText,
            postId: post?.id || null,
            replyToPostId: post?.id || null,
            createdAt: now,
            isFromMe: false,
            status: 'received',
            isAutoGenerated: true
        });

        await withIcityDataLock('icity_dms', [], stored => {
            const nextDms = Array.isArray(stored) ? stored : [];
            nextDms.push(incoming);
            return nextDms;
        });

        await renderIcityDmList();
        if (window.currentIcityChatTarget && getIcityDmThreadId(window.currentIcityChatTarget) === threadId) {
            await renderIcityChatMessages();
        }
        return true;
    }

    async function getIcityFullContextForCharacter(target, currentDmMessages = []) {
        const [contactsData, wechatContactsData, wechatChatData, profile, feeds, authData] = await Promise.all([
            getContactsData(),
            getWechatContactsData(),
            getWechatChatData(),
            getProfile(),
            getFeeds(),
            getWechatAuthData()
        ]);
        const contacts = Array.isArray(contactsData?.contacts) ? contactsData.contacts : [];
        const cleanId = getIcityCleanCharacterId(target?.characterId || target?.id);
        // Stable IDs take precedence over names and remarks, which can collide.
        const character = (cleanId
            ? contacts.find(c => getIcityCleanCharacterId(c?.id) === cleanId)
            : contacts.find(c => String(c?.name || '').trim() === String(target?.name || target?.user || '').trim())) || {};
        const charId = cleanId || String(character?.id || '');

        const characterIdentity = { ...character, id: charId };
        const wechatContactId = charId ? getWechatContactIdForCharacter(characterIdentity, wechatContactsData) : '';
        const wechatContact = charId ? getWechatContactForCharacter(characterIdentity, wechatContactsData) : null;

        // 1. Char 完整人设与外观
        const charName = String(character?.name || wechatContact?.remark || wechatContact?.name || target?.name || target?.user || '角色').trim();
        const charPersona = String(character?.persona || wechatContact?.persona || wechatContact?.description || character?.description || target?.persona || '').trim();
        const charAppearance = String(character?.appearance || wechatContact?.appearance || target?.appearance || '').trim();

        // 2. User 人设与称谓
        const users = Array.isArray(contactsData?.users) ? contactsData.users : [];
        const boundAccount = getBoundWechatAccount(profile, authData);
        const activeUserId = boundAccount?.maskId || (typeof appSettings !== 'undefined' ? appSettings.wc_current_user_id : null);
        const currentUser = users.find(u => String(u.id) === String(activeUserId));
        const userName = String(currentUser?.name || boundAccount?.name || profile?.nickname || 'User').trim();
        const userPersona = String(currentUser?.persona || profile?.bio || '').trim();

        // 3. 绑定的对应世界书
        let worldbookText = '';
        if (typeof wbEntries !== 'undefined' && Array.isArray(wbEntries)) {
            const boundWbIds = Array.isArray(character?.worldbookIds) ? character.worldbookIds : (Array.isArray(wechatContact?.worldbookIds) ? wechatContact.worldbookIds : []);
            const activeWbs = wbEntries.filter(e => !e.isDeleted && (e.isGlobal || boundWbIds.includes(e.id)));
            worldbookText = activeWbs.map(wb => `[${wb.title}]: ${wb.content}`).join('\n').slice(0, 4000);
        }

        // 4. 微信真实历史聊天上下文
        const wechatChatContext = formatDiaryChatContext({ ...characterIdentity, name: charName }, wechatChatData, wechatContactId);

        // 5. 记忆库与近期经历摘要
        const memoryContext = await getDiaryMemoryContext(character, wechatContactId, wechatChatContext);

        // 6. Diary 双方私信上下文
        const icityDmsContext = Array.isArray(currentDmMessages) ? currentDmMessages.slice(-16).map(m => {
            const speaker = m.isFromMe ? userName : charName;
            return `${speaker}: ${m.text || ''}`;
        }).filter(line => !line.endsWith(': ')).join('\n') : '';

        // 7. Diary 近期日记动态
        const recentDiary = feeds.filter(post => {
            if (post?.authorType !== 'character') return false;
            const postCharId = getIcityCleanCharacterId(post?.characterId || post?.authorWechatId);
            if (charId && postCharId) return postCharId === charId;
            return String(post?.user || '').trim() === charName;
        }).slice(-5).map(post => String(post?.text || '').slice(0, 400)).filter(Boolean);

        return {
            charId,
            charName,
            charPersona,
            charAppearance,
            userName,
            userPersona,
            worldbookText,
            wechatChatContext,
            memoryContext,
            icityDmsContext,
            recentDiary
        };
    }

    async function getIcityDmTargetContext(target, messages) {
        return getIcityFullContextForCharacter(target, messages);
    }

    async function generateIcityDmAutoReply(userMessage, target) {
        if (!target) return;
        const threadId = getIcityDmThreadId(target);
        const replying = getIcityDmReplyingSet();
        if (replying.has(threadId)) return;
        replying.add(threadId);
        let source = null;
        const revisionKey = getIcityDmRevisionKey(target);
        const revision = icityDmRevisions.get(revisionKey) || 0;
        const canCommit = () => getIcityDmRevisionKey(target) === revisionKey && (icityDmRevisions.get(revisionKey) || 0) === revision;
        try {
            await renderIcityChatMessages();
            const dms = await getIcityDms();
            const messages = dms.filter(message => isIcityDmInThread(message, target))
                .sort((a, b) => Number(a.createdAt || 0) - Number(b.createdAt || 0));
            if (userMessage) {
                source = messages.find(message => String(message.id) === String(userMessage.id));
                if (!source || !source.isFromMe || source.replyStatus === 'completed') return;
            } else {
                // An empty send requests a reply without inserting a fictitious user message.
                const latest = messages[messages.length - 1];
                if (latest?.isFromMe && latest.replyStatus !== 'completed') source = latest;
            }
            const context = await getIcityFullContextForCharacter(target, messages);
            const api = await getConnectedIcityApi();
            const prompt = [
                `请以 ${context.charName} 的第一人称回复来自 ${context.userName} 的 Diary 私信。`,
                '【核心要求】',
                `1. 必须 100% 保持 ${context.charName} 的人设、说话口吻、性格特点与情感距离。`,
                '2. 参考你们在微信中的过往经历、共同记忆以及在 Diary 上的互动氛围，语气自然鲜活，拒绝 AI 味与刻板客服腔。',
                '3. 回复长短与语气完全由角色人设与当前话题自然决定，不要拘泥于固定字数。',
                '4. 只输出 JSON，不要任何 Markdown 标记。格式：{"reply":"回复内容"}',
                '',
                '【角色设定】',
                JSON.stringify({
                    name: context.charName,
                    persona: context.charPersona || '暂无详细设定',
                    appearance: context.charAppearance || ''
                }),
                '',
                '【用户资料】',
                JSON.stringify({
                    name: context.userName,
                    persona: context.userPersona || '普通市民'
                }),
                '',
                context.worldbookText ? `【世界书设定】\n${context.worldbookText}\n` : '',
                context.memoryContext ? `【共同记忆与经历】\n${context.memoryContext}\n` : '',
                context.wechatChatContext ? `【微信聊天历史记录】\n${context.wechatChatContext}\n` : '',
                context.recentDiary.length ? `【角色在 Diary 的近期日记】\n${JSON.stringify(context.recentDiary)}\n` : '',
                '【Diary 私信上下文】',
                context.icityDmsContext || '暂无私信记录，请按角色与用户的关系自然开启私信话题。',
                source
                    ? `【本次回复目标】结合以上私信，回应 ${context.userName} 连续发来的消息；自然接话，不必逐条作答。最近一条：${source.text}`
                    : '【本次生成要求】自然延续私信话题；没有记录时主动开口。用户只是点击了生成按钮，没有发送新文字，不要虚构用户说过的话。'
            ].filter(Boolean).join('\n');

            const content = await requestIcityChatCompletion(api, [
                { role: 'system', content: `你是 ${context.charName}，在 Diary 社交应用中与 ${context.userName} 进行私人信件/私信交流。只输出合法 JSON。` },
                { role: 'user', content: prompt }
            ], { temperature: 0.85, emptyMessage: 'API 没有返回私信回复' });
            const parsed = parseIcityJsonObject(content);
            const reply = String(parsed?.reply || '').trim();
            if (!reply) throw new Error('AI 没有返回私信内容');

            await withIcityDataLock('icity_dms', [], stored => {
                const nextDms = Array.isArray(stored) ? stored : [];
                if (!canCommit()) return undefined;
                if (source) {
                    const latestSource = nextDms.find(message => String(message.id) === String(source.id));
                    if (!latestSource || latestSource.replyStatus === 'completed') return undefined;
                    latestSource.replyStatus = 'completed';
                    latestSource.status = 'sent';
                    latestSource.replyError = '';
                    latestSource.replyGeneratedAt = Date.now();
                }
                nextDms.push(normalizeIcityDmMessage({
                    id: createIcityDmId('icity_dm'),
                    threadId,
                    characterId: context.charId,
                    user: target.user || context.charName,
                    handle: target.handle || '@icity',
                    avatar: target.avatar || '',
                    text: reply,
                    createdAt: Date.now(),
                    isFromMe: false,
                    status: 'received',
                    replyToMessageId: source?.id || null,
                    replyToPostId: null
                }));
                return nextDms;
            });
        } catch (error) {
            if (!canCommit()) return;
            if (source) await withIcityDataLock('icity_dms', [], stored => {
                if (!canCommit()) return undefined;
                const nextDms = Array.isArray(stored) ? stored : [];
                const latestSource = nextDms.find(message => String(message.id) === String(source.id));
                if (!latestSource) return undefined;
                latestSource.status = 'failed';
                latestSource.replyStatus = 'failed';
                latestSource.replyError = error.message || '私信回复生成失败';
                return nextDms;
            });
            showIcityQaToast(error.message || '私信自动回复失败');
        } finally {
            replying.delete(threadId);
            await renderIcityChatMessages();
            await renderIcityDmList();
        }
    }

    async function retryIcityDmReply(messageId) {
        const dms = await getIcityDms();
        const message = dms.find(item => String(item.id) === String(messageId));
        if (!message || !message.isFromMe) return;
        await withIcityDataLock('icity_dms', [], stored => {
            const nextDms = Array.isArray(stored) ? stored : [];
            const targetMessage = nextDms.find(item => String(item.id) === String(messageId));
            if (!targetMessage) return undefined;
            targetMessage.status = 'pending';
            targetMessage.replyStatus = 'pending';
            targetMessage.replyError = '';
            return nextDms;
        });
        await renderIcityChatMessages();
        await generateIcityDmAutoReply(message, window.currentIcityChatTarget);
    }

    async function requestIcityPostReaction(api, post, target, authorIdentity) {
        let fullContext = null;
        if (target.type === 'contact') {
            const threadId = getIcityDmThreadId(target);
            const messages = (await getIcityDms()).filter(message => message.threadId === threadId)
                .sort((a, b) => Number(a.createdAt || 0) - Number(b.createdAt || 0));
            fullContext = await getIcityFullContextForCharacter(target, messages);
        }
        const canSendDm = target.type === 'contact';

        const prompt = [
            '请为 Diary 这篇日记生成评论与私信互动。',
            '【身份边界】',
            '你只扮演下方的互动角色，使用自己的设定、性格和说话习惯。日记中的“我”属于日记作者，禁止套用作者人设或把作者的经历当成自己的经历。',
            'comment 和 dm 是两个不同场景，必须分别确定收件人，不得沿用上一场景的“你”。',
            '【公开评论任务】',
            'comment 发表在这篇日记下，面对日记作者：根据公开内容自然留言，不必总结全文。评论中的“你”指作者。',
            !authorIdentity?.isCurrentUser ? '作者不是当前用户。你与用户的微信聊天、记忆和私信不等于你与作者的经历，不能把这些关系移用到作者身上。' : '',
            canSendDm ? [
                '【给用户的私信任务】',
                `dm 的唯一收件人是当前用户 ${fullContext.userName}，不是日记作者角色。你是 ${fullContext.charName}，正在单独与 ${fullContext.userName} 聊天；私信里的“你”始终指 ${fullContext.userName}。`,
                '按你与用户的关系、平时说话方式和私聊上下文自然开口。日记可以是找用户聊天的契机，话题也可以顺势转到你们自己的生活、关心、分享或想说的小事；没有自然想说的话就留空。',
                '私信要像直接发给这个人的聊天消息，能让用户自然接话。不要把公开评论复制或换个称呼再发，不要写成日记点评、读后感、公开留言或泛泛评价，不要为了私信而套用固定开场白。',
                !authorIdentity?.isCurrentUser
                    ? `若提到这篇日记，用作者姓名 ${authorIdentity?.name || '日记作者'} 或第三人称指代作者，不要对 ${fullContext.userName} 说“你写的日记”，也不要把作者的遭遇、心情或身份安到用户身上。`
                    : '这篇日记确实是用户写的，但私信仍须切换到你们的一对一聊天，回应用户这个人，不要继续写公开评论。',
                '【私信收件人资料】',
                JSON.stringify({ name: fullContext.userName, persona: fullContext.userPersona || '暂无详细设定' })
            ].filter(Boolean).join('\n') : '路人仅生成公开评论，dm 必须为空字符串。',
            '只输出 JSON，不要任何 Markdown 标记。格式：{"comment":"公开评论内容","dm":"直接给当前用户的私信或空字符串"}',
            '',
            '【日记作者】',
            JSON.stringify(authorIdentity),
            post?.authorType === 'character'
                ? '作者身份：通讯录中的另一位角色，不是用户。评论中的“你”指日记作者；正文提到的用户是第三方，不得混淆。'
                : `作者身份：${authorIdentity?.isCurrentUser ? '当前用户' : '另一位市民'}。`,
            '【日记内容】',
            String(post.text || '').slice(0, 2000),
            '',
            target.type === 'contact'
                ? [
                    '【互动角色详细设定】',
                    `姓名：${fullContext?.charName || target.name}`,
                    `人设设定：\n${fullContext?.charPersona || '暂无'}`,
                    fullContext?.worldbookText ? `世界书背景：\n${fullContext.worldbookText}` : '',
                    fullContext?.memoryContext ? `【你与私信收件人 ${fullContext.userName} 的记忆，与其他日记作者无关】\n${fullContext.memoryContext}` : '',
                    fullContext?.wechatChatContext ? `【你与私信收件人 ${fullContext.userName} 的微信聊天，“用户”仅指收件人】\n${fullContext.wechatChatContext}` : '',
                    fullContext?.icityDmsContext ? `【你与 ${fullContext.userName} 现有的 Diary 私信，用于延续私聊】\n${fullContext.icityDmsContext}` : ''
                ].filter(Boolean).join('\n')
                : `【路人设定】\n姓名：${target.name}，作为普通市民随笔留下真实生活流感受。`
        ].join('\n');

        const content = await requestIcityChatCompletion(api, [
            { role: 'system', content: '你是 Diary 社交互动引擎。只扮演指定的互动角色：comment 是给日记作者的公开评论；dm 始终是给当前用户的一对一聊天消息，即使日记由其他角色发布也不改变私信收件人。两个场景分别写作，不混用称呼、经历或人设。只输出 JSON。' },
            { role: 'user', content: prompt }
        ], { temperature: 0.88, emptyMessage: 'API 没有返回日记互动内容' });

        const parsed = parseIcityJsonObject(content);
        return {
            comment: String(parsed.comment || '').trim().replace(/^["“”]+|["“”]+$/g, ''),
            dm: canSendDm ? String(parsed.dm || '').trim().replace(/^["“”]+|["“”]+$/g, '') : ''
        };
    }

    async function generateIcityPostInteractions(post, options = {}) {
        if (!post || normalizeIcityVisibility(post.visibility) !== '公开' || post.autoInteractionsGeneratedAt) return post;
        const postLockKey = String(post.id);
        if (icityPostInteractionsLock.has(postLockKey)) return post;
        icityPostInteractionsLock.add(postLockKey);
        try {
            const api = await getConnectedIcityApi();
            const [contactsData, wechatContactsData] = await Promise.all([
                getContactsData(),
                getWechatContactsData()
            ]);
            const authorIdentity = await getIcitySinglePostIdentity(post);
            const candidates = getIcityReactionContactCandidates(contactsData, wechatContactsData, options.excludeCharacterId);
            const contactTargets = sampleIcityItems(candidates, Math.min(candidates.length, 3)).map(item => ({
                type: 'contact',
                characterId: item.contact.id,
                name: item.contact.name || item.wechatContact?.name || '联系人',
                persona: item.contact.persona || '',
                appearance: item.contact.appearance || '',
                avatar: item.contact.avatar || item.wechatContact?.avatar || '',
                handle: item.wechatContact?.wxid ? '@' + item.wechatContact.wxid : '@' + String(item.contact.name || 'Diary').trim()
            }));

            const passerbyTargets = sampleIcityItems([0, 1, 2, 3, 4], Math.floor(Math.random() * 2) + 1).map((index) => ({
                type: 'passerby',
                name: pickIcityPasserbyName(index),
                avatar: pickIcityPasserbyAvatar(index)
            }));
            const targets = contactTargets.concat(passerbyTargets);
            if (!targets.length) return post;

            const comments = [];
            for (const [index, target] of targets.entries()) {
                try {
                    const reaction = await requestIcityPostReaction(api, post, target, authorIdentity);
                    if (reaction.comment) {
                        comments.push(createIcityAutoComment(target, reaction.comment, index));
                    }
                    if (target.type === 'contact' && reaction.dm) {
                        await appendIcityIncomingMessage(target, reaction.dm, post);
                    }
                } catch (error) {
                    console.warn('Diary post reaction generation failed:', error);
                }
            }

            if (!comments.length) return post;
            const feeds = await getFeeds();
            const index = feeds.findIndex(item => item.id === post.id);
            if (index === -1 || feeds[index].autoInteractionsGeneratedAt) return post;
            feeds[index].comments = Array.isArray(feeds[index].comments) ? feeds[index].comments.concat(comments) : comments;
            feeds[index].autoInteractionsGeneratedAt = Date.now();
            feeds[index].autoInteractionScope = normalizeIcityVisibility(post.visibility);
            await saveFeed(feeds[index]);
            return feeds[index];
        } catch (error) {
            console.warn('Diary post interactions skipped:', error);
            return post;
        } finally {
            icityPostInteractionsLock.delete(postLockKey);
        }
    }

    function getWechatMessageMap(record) {
        if (!record || typeof record !== 'object') return {};
        if (record.conversations && typeof record.conversations === 'object') return record.conversations;
        if (record.messagesByContact && typeof record.messagesByContact === 'object') return record.messagesByContact;
        if (record.chatMessagesByContact && typeof record.chatMessagesByContact === 'object') return record.chatMessagesByContact;
        return record;
    }

    function getWechatContactIdForCharacter(contact, wechatContactsData) {
        const contacts = getWechatContactsList(wechatContactsData);
        const characterId = String(contact?.id || '');
        if (!characterId) return '';
        const linkedId = 'char_' + characterId;
        const matched = contacts.find(item => item && (String(item.linkedContactId || '') === characterId || String(item.id || '') === linkedId));
        return String(matched?.id || linkedId);
    }

    function getWechatContactForCharacter(contact, wechatContactsData) {
        const contacts = getWechatContactsList(wechatContactsData);
        const characterId = String(contact?.id || '');
        if (!characterId) return null;
        const linkedId = 'char_' + characterId;
        return contacts.find(item => item && (String(item.linkedContactId || '') === characterId || String(item.id || '') === linkedId)) || null;
    }

    function formatDiaryChatContext(contact, wechatChatData, wechatContactId) {
        const messageMap = getWechatMessageMap(wechatChatData);
        const messages = Array.isArray(messageMap?.[wechatContactId]) ? messageMap[wechatContactId] : [];
        return messages
            .filter(message => message && (message.type === 'sent' || message.type === 'received') && String(message.text || '').trim())
            .slice(-ICITY_DIARY_CHAT_CONTEXT_LIMIT)
            .map(message => {
                const speaker = message.type === 'sent' ? '用户' : (contact.name || '角色');
                const prefix = message.isVoice ? '[语音] ' : '';
                return `${speaker}：${prefix}${String(message.text || '').trim()}`;
            })
            .join('\n')
            .slice(0, 4000);
    }

    function normalizeDiaryMemoryItems(items, limit) {
        const seen = new Set();
        return (Array.isArray(items) ? items : [])
            .map(item => String(item?.content || item?.text || item?.memory || item || '').trim())
            .filter(content => {
                if (!content || seen.has(content)) return false;
                seen.add(content);
                return true;
            })
            .slice(0, limit);
    }

    async function getDiaryMemoryContext(contact, wechatContactId, chatContext) {
        if (!wechatContactId) return '';
        const query = [contact.name, contact.persona, chatContext].map(value => String(value || '').trim()).filter(Boolean).join('\n').slice(-3000);
        const memories = [];
        try {
            if (typeof window.MemoryApp?.preload === 'function') await window.MemoryApp.preload();
            if (typeof window.MemoryApp?.getPromptMemories === 'function') {
                memories.push(...normalizeDiaryMemoryItems(window.MemoryApp.getPromptMemories(wechatContactId, 6), 6));
            }
            if (typeof window.MemoryApp?.getPromptSummary === 'function') {
                const summary = String(window.MemoryApp.getPromptSummary(wechatContactId) || '').trim();
                if (summary) memories.push(summary);
            }
            if (query && typeof window.MemoryApp?.getRelevantFragmentsAsync === 'function') {
                const fragments = await window.MemoryApp.getRelevantFragmentsAsync(wechatContactId, query, 3, 'icity_diary_' + Date.now());
                memories.push(...normalizeDiaryMemoryItems(fragments, 3));
            } else if (query && typeof window.MemoryApp?.getRelevantFragments === 'function') {
                memories.push(...normalizeDiaryMemoryItems(window.MemoryApp.getRelevantFragments(wechatContactId, query, 3, 'icity_diary_' + Date.now()), 3));
            }
            if (query && typeof window.MemorySync?.search === 'function') {
                const external = await Promise.race([
                    window.MemorySync.search(wechatContactId, query).catch(() => []),
                    new Promise(resolve => setTimeout(() => resolve([]), ICITY_DIARY_MEMORY_TIMEOUT_MS))
                ]);
                memories.push(...normalizeDiaryMemoryItems(external, 6));
            }
        } catch (error) {
            console.warn('Diary diary memory context unavailable:', error);
        }
        return normalizeDiaryMemoryItems(memories, 12).join('\n');
    }

    function formatIcityFeedContextPost(post, label) {
        const lines = [
            `${label} ${post?.time || ''}`.trim(),
            String(post?.text || '').trim(),
            post?.diary ? `\u65e5\u8bb0\u672c\uff1a${String(post.diary).trim()}` : '',
            post?.location ? `\u4f4d\u7f6e\uff1a${String(post.location).trim()}` : ''
        ].filter(Boolean);
        const notes = Array.isArray(post?.notes) ? post.notes : [];
        const comments = Array.isArray(post?.comments) ? post.comments : [];
        if (notes.length) {
            lines.push('\u7eb8\u6761\uff1a' + notes.map(note => String(note?.text || '').trim()).filter(Boolean).join(' / '));
        }
        if (comments.length) {
            lines.push('\u8bc4\u8bba\uff1a' + comments.map(comment => `${comment?.user || '\u7528\u6237'}\uff1a${String(comment?.text || '').trim()}`).filter(item => !item.endsWith('\uff1a')).join(' / '));
        }
        return lines.join('\n').slice(0, 1400);
    }

    async function getIcityCharacterFeedContext(contact, wechatContactId) {
        const feeds = await getFeeds();
        if (!Array.isArray(feeds) || !feeds.length) return '';
        const authorIds = new Set(collectIcityWechatAuthorIds({
            ...contact,
            id: wechatContactId,
            linkedContactId: contact?.id
        }));
        const characterPosts = feeds.filter(post => {
            if (post?.authorType !== 'character') return false;
            const postAuthorId = getIcityPostAuthorId(post);
            return Boolean(postAuthorId && authorIds.has(postAuthorId))
                || String(post?.characterId || '') === String(contact?.id || '');
        });
        const userPosts = feeds.filter(post => post?.authorType === 'user');
        const recentCharacterPosts = characterPosts.slice().sort((a, b) => Number(b?.id || 0) - Number(a?.id || 0)).slice(0, 6);
        const recentUserPosts = userPosts.slice().sort((a, b) => Number(b?.id || 0) - Number(a?.id || 0)).slice(0, 6);
        const sections = [];
        if (recentCharacterPosts.length) {
            sections.push('\u3010\u89d2\u8272\u81ea\u5df1\u53d1\u5e03\u7684 Diary \u65e5\u8bb0\u3011\n'
                + recentCharacterPosts.map(post => formatIcityFeedContextPost(post, '\u89d2\u8272\u65e5\u8bb0')).join('\n---\n'));
        }
        if (recentUserPosts.length) {
            sections.push('\u3010\u7528\u6237\u5728 Diary \u5199\u4e0b\u7684\u65e5\u8bb0\u3001\u7eb8\u6761\u548c\u8bc4\u8bba\u3011\n'
                + recentUserPosts.map(post => formatIcityFeedContextPost(post, '\u7528\u6237\u65e5\u8bb0')).join('\n---\n'));
        }
        return sections.join('\n\n').slice(0, 9000);
    }

    async function buildCharacterDiaryContext(contact) {
        const [wechatContactsData, wechatChatData, profile, contactsData, feeds] = await Promise.all([
            getWechatContactsData(),
            getWechatChatData(),
            getProfile(),
            getContactsData(),
            getFeeds()
        ]);
        const wechatContactId = getWechatContactIdForCharacter(contact, wechatContactsData);
        const wechatContact = getWechatContactForCharacter(contact, wechatContactsData);
        const chatContext = formatDiaryChatContext(contact, wechatChatData, wechatContactId);
        const memoryContext = await getDiaryMemoryContext(contact, wechatContactId, chatContext);
        const icityContext = await getIcityCharacterFeedContext(contact, wechatContactId);
        const diaryTimeContext = await buildCharacterDiaryTimeContext(contact, profile, wechatContact);

        // 1. 获取 User 人设与名字
        const users = Array.isArray(contactsData?.users) ? contactsData.users : [];
        const currentUser = users.find(u => u.id === (typeof appSettings !== 'undefined' ? appSettings.wc_current_user_id : null));
        const userPersona = currentUser?.persona || profile?.bio || '无特定设定';
        const userName = currentUser?.name || profile?.nickname || 'User';

        // 2. 获取上一篇日记
        const characterPosts = feeds.filter(post => post?.authorType === 'character' && (String(post?.characterId || '') === String(contact?.id || '') || String(post?.authorWechatId || '') === String(wechatContactId || '')));
        const previousDiary = characterPosts.sort((a, b) => Number(b.id) - Number(a.id))[0]?.text || '无上一篇日记';

        // 3. 获取绑定的世界书
        let worldbookContext = '';
        if (typeof wbEntries !== 'undefined' && Array.isArray(wbEntries)) {
            const boundWbIds = Array.isArray(contact?.worldbookIds) ? contact.worldbookIds : (Array.isArray(wechatContact?.worldbookIds) ? wechatContact.worldbookIds : []);
            const activeWbs = wbEntries.filter(e => !e.isDeleted && (e.isGlobal || boundWbIds.includes(e.id)));
            activeWbs.forEach(wb => {
                worldbookContext += `[${wb.title}]: ${wb.content}\n`;
            });
        }
        if (!worldbookContext) worldbookContext = '无绑定的世界书设定';

        return { chatContext, memoryContext, icityContext, wechatContactId, diaryTimeContext, userPersona, userName, previousDiary, worldbookContext };
    }

    function formatIcityDiaryDate(date = new Date()) {
        const weekDays = ['星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六'];
        return `${date.getFullYear()}年${date.getMonth() + 1}月${date.getDate()}日${weekDays[date.getDay()]}`;
    }

    async function buildCharacterDiaryTimeContext(contact, profile = {}, wechatContact = null) {
        const todayText = formatIcityDiaryDate(new Date());
        const locations = [
            wechatContact?.weatherLocation,
            contact?.weatherLocation,
            profile?.location && profile.location !== '可选' ? profile.location : ''
        ].map(value => String(value || '').trim()).filter(Boolean);
        const location = locations[0] || '';
        let weatherText = '';
        if (location && typeof window.wcGetRealWeather === 'function') {
            try {
                weatherText = await window.wcGetRealWeather(location);
            } catch (error) {
                console.warn('Diary diary weather context unavailable:', error);
            }
        }
        return {
            todayText,
            location,
            weatherText: String(weatherText || '').trim()
        };
    }

    function buildDiaryImagePrompt(contact, diaryText) {
        return [
            `请为${contact.name || '角色'}这篇 Diary 日记生成一张生活流配图。`,
            '画面要像手机日记里的随手拍，真实、温暖、日常，不要海报感，不要文字，不要水印。',
            '优先呈现日记中具体的空间、物件、天气、光线和动作；如果人物入镜，要贴合角色外貌和气质。',
            contact.appearance ? `角色外貌：${contact.appearance}` : '',
            contact.persona ? `角色人设：${contact.persona}` : '',
            `日记正文：${String(diaryText || '').slice(0, 1200)}`
        ].filter(Boolean).join('\n');
    }

    async function maybeGenerateCharacterDiaryImage(contact, diaryText, wechatContactId) {
        if (Math.random() >= ICITY_DIARY_IMAGE_PROBABILITY) return { img: '', images: [], imageLayout: 'single-column', imgDescription: '' };
        const description = buildDiaryImagePrompt(contact, diaryText);
        if (typeof window.generateChatImage !== 'function') {
            return { img: ICITY_IMAGE_PLACEHOLDER_URL, images: [ICITY_IMAGE_PLACEHOLDER_URL], imageLayout: 'single-column', imgDescription: description };
        }
        try {
            const img = await window.generateChatImage(description, wechatContactId);
            const firstImage = img || ICITY_IMAGE_PLACEHOLDER_URL;
            return { img: firstImage, images: [firstImage], imageLayout: 'single-column', imgDescription: description };
        } catch (error) {
            console.warn('Diary diary image generation failed:', error);
            return { img: '', images: [], imageLayout: 'single-column', imgDescription: '' };
        }
    }

    async function requestCharacterDiary(contact, api) {
        const diaryContext = await buildCharacterDiaryContext(contact);
        const diaryDateLine = `${diaryContext.diaryTimeContext.todayText} 天气：${diaryContext.diaryTimeContext.weatherText || '按聊天氛围写一个自然天气短语'}`;
        const charName = contact.name || '角色';
        const userName = diaryContext.userName;

        const profileData = await getProfile();
        const activeStylePrompt = (profileData.customDiaryStylePrompt && profileData.customDiaryStylePrompt.trim()) 
            ? profileData.customDiaryStylePrompt.trim() 
            : ICITY_DIARY_STYLE_PROMPT;

        const prompt = [
            `请你完全沉浸入 ${charName} 的身份，以第一人称视角（“我”）在 Diary 社交软件上写一篇私人日记。`,
            '',
            '【核心叙事与行为逻辑】',
            `这是一篇剖析内心、自我独白的日记。行为逻辑根源：${charName} 的日记必须深深植根于其背景、核心价值观、内在动机与人生经历。`,
            `严禁对 ${charName} 与 ${userName} 的人设特点、性格特质进行“漫画式放大”或“标签化极端化”处理。保持人物情感的复杂性、真实性与立体感。你需要回想近期与 ${userName} 的相处细节、${userName} 说过的话或做过的具体小事，以及这些日常碎片在你内心引起的细微心理变化。自然地流露对 ${userName} 的真实感受（具体感受必须由人设和聊天上下文决定，拒绝突兀表白、拒绝油腻与套路化）。`,
            '',
            '【文风与美学要求】',
            `文风需文艺细腻，符合 ${charName} 的心理与性格特征，并严格遵循以下 Diary 生活流审美：`,
            `1. ${activeStylePrompt}`,
            '2. 禁用浮夸的比喻，改为以“白描”直述动作、微反应（如喉结滚动、指尖蜷缩、垂下的眼睫）和日常空间（如厨房、便利店、沙发、昏暗的阳台）来传递隐秘的情感与亲密。',
            '3. 善用感官细节营造质感（如衣服上的洗衣液气味、热汤的蒸汽、晚风的温度、雨后的泥土味）。',
            '4. 若在日记中回忆对话，需保持自然口语化，并穿插动作来控制叙事节奏。',
            '5. 叙事逻辑连贯，整体保持平淡、温暖、克制的生活流基调。',
            '',
            '【格式与输出规范】',
            `1. 第一行必须写成完整日期与天气，固定以“${diaryContext.diaryTimeContext.todayText} 天气：”开头，例如：${diaryDateLine}`,
            '2. 必须像真实角色刚刚在 Diary 里发布的一篇生活记录。',
            '3. 只输出日记正文，不要标题，不要使用任何 Markdown 格式（如加粗、斜体、列表），不要编造图片链接，不要任何解释性文字。',
            '4. 字数要求：不少于 500 字。',
            '',
            '【参考上下文与设定】',
            '以下是你写日记必须参考的背景信息：',
            '',
            '--- 角色人设 ---',
            JSON.stringify({
                name: charName,
                persona: contact.persona || '',
                appearance: contact.appearance || '',
                npcs: Array.isArray(contact.npcs) ? contact.npcs : []
            }),
            '',
            '--- 用户人设 ---',
            `名字：${userName}`,
            `设定：${diaryContext.userPersona}`,
            '',
            '--- 世界书设定 ---',
            diaryContext.worldbookContext,
            '',
            '--- 记忆库记忆 ---',
            diaryContext.memoryContext || '暂无可用记忆。',
            '',
            '--- 聊天上下文记录 ---',
            diaryContext.chatContext || '暂无可用聊天上下文。',
            '',
            '--- 上一篇日记（作为衔接参考） ---',
            diaryContext.previousDiary,
            '',
            `现在，请基于以上要求，开始撰写 ${charName} 的日记：`
        ].join('\n');

        const content = await requestIcityChatCompletion(api, [
            { role: 'system', content: '你是 Diary 角色日记生成器。严格按用户要求输出角色第一人称日记正文。' },
            { role: 'user', content: prompt }
        ], { emptyMessage: 'API 没有返回日记内容' });
        return { content, diaryContext };
    }

    async function saveWorldPasserbyDiaries(items) {
        if (!Array.isArray(items) || !items.length) return 0;
        const now = new Date();
        const timeString = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
        let savedCount = 0;
        for (const [index, item] of items.entries()) {
            await saveFeed({
                id: Date.now() + index + 1,
                text: item.text,
                img: '',
                imgDescription: '',
                location: item.location,
                diary: '',
                time: timeString,
                visibility: '公开',
                scope: 'world',
                user: item.user || `路人${index + 1}`,
                handle: item.handle || `@passerby_${index + 1}`,
                avatar: pickIcityPasserbyAvatar(index),
                authorType: 'passerby'
            });
            savedCount += 1;
        }
        return savedCount;
    }

    function showIcityDiaryWritingNotice() {
        const host = $('#main-bottom-nav')?.parentElement;
        if (!host) return;

        let status = $('#icity-publish-status');
        if (!status) {
            status = document.createElement('div');
            status.id = 'icity-publish-status';
            status.className = 'icity-publish-status';
            status.setAttribute('role', 'status');
            status.setAttribute('aria-live', 'polite');
            host.appendChild(status);
        }

        status.textContent = '正在写日记中';
        status.classList.add('is-visible');
    }

    function hideIcityDiaryWritingNotice() {
        $('#icity-publish-status')?.classList.remove('is-visible');
    }

    function ensureCharacterDiaryPickerModal() {
        let modal = $('#character-diary-picker-modal');
        if (modal) return modal;
        modal = document.createElement('div');
        modal.id = 'character-diary-picker-modal';
        modal.className = 'modal-overlay';
        modal.innerHTML = `
            <div class="character-diary-picker-content" role="dialog" aria-modal="true" aria-labelledby="character-diary-picker-title">
                <div class="character-diary-picker-header">
                    <button type="button" class="character-diary-picker-close" data-character-diary-action="close">\u53d6\u6d88</button>
                    <h2 id="character-diary-picker-title">\u9009\u62e9\u89d2\u8272\u751f\u6210\u65e5\u8bb0</h2>
                    <button type="button" class="character-diary-picker-select-all" data-character-diary-action="select-all">\u5168\u9009</button>
                </div>
                <p class="character-diary-picker-status" data-character-diary-status>\u8bf7\u9009\u62e9\u8981\u751f\u6210\u65e5\u8bb0\u7684\u89d2\u8272</p>
                <div class="character-diary-picker-list" data-character-diary-list></div>
                <div class="character-diary-picker-footer">
                    <button type="button" class="character-diary-picker-confirm" data-character-diary-action="confirm">\u5f00\u59cb\u751f\u6210</button>
                </div>
            </div>`;
        const root = document.querySelector('#icityNewAppUI .icity-app-inner-container') || document.getElementById('icityNewAppUI') || document.body;
        root.appendChild(modal);
        modal.addEventListener('click', event => {
            if (event.target === modal || event.target.closest('[data-character-diary-action="close"]')) {
                modal.classList.remove('active');
            }
        });
        return modal;
    }

    function renderCharacterDiaryPicker(modal, candidates) {
        const list = modal.querySelector('[data-character-diary-list]');
        const status = modal.querySelector('[data-character-diary-status]');
        const selectAllButton = modal.querySelector('[data-character-diary-action="select-all"]');
        const selectedIds = new Set();
        const updateStatus = () => {
            const selectedCount = selectedIds.size;
            status.textContent = `${selectedCount ? `\u5df2\u9009\u62e9 ${selectedCount} \u4f4d\u89d2\u8272` : '\u8bf7\u9009\u62e9\u89d2\u8272'} \u00b7 ${candidates.length} \u4f4d\u53ef\u7528`;
            selectAllButton.textContent = selectedCount === candidates.length ? '\u53d6\u6d88\u5168\u9009' : '\u5168\u9009';
        };
        list.replaceChildren();
        candidates.forEach(candidate => {
            const id = String(candidate.id || '');
            const item = document.createElement('button');
            item.type = 'button';
            item.className = 'character-diary-picker-item';
            item.dataset.characterId = id;
            item.setAttribute('aria-pressed', 'false');
            const avatar = document.createElement('span');
            avatar.className = 'character-diary-picker-avatar';
            avatar.style.cssText = getIcityAvatarStyle(candidate.avatar || '');
            const name = document.createElement('span');
            name.className = 'character-diary-picker-name';
            name.textContent = candidate.name || '\u89d2\u8272';
            const check = document.createElement('span');
            check.className = 'character-diary-picker-check';
            check.textContent = '\u2713';
            item.append(avatar, name, check);
            item.addEventListener('click', () => {
                if (selectedIds.has(id)) selectedIds.delete(id);
                else selectedIds.add(id);
                item.classList.toggle('is-selected', selectedIds.has(id));
                item.setAttribute('aria-pressed', String(selectedIds.has(id)));
                updateStatus();
            });
            list.appendChild(item);
        });
        selectAllButton.onclick = () => {
            const shouldSelectAll = selectedIds.size !== candidates.length;
            selectedIds.clear();
            if (shouldSelectAll) candidates.forEach(candidate => selectedIds.add(String(candidate.id || '')));
            list.querySelectorAll('.character-diary-picker-item').forEach(item => {
                const selected = selectedIds.has(item.dataset.characterId);
                item.classList.toggle('is-selected', selected);
                item.setAttribute('aria-pressed', String(selected));
            });
            updateStatus();
        };
        modal.querySelector('[data-character-diary-action="confirm"]').onclick = () => {
            const selected = candidates.filter(candidate => selectedIds.has(String(candidate.id || '')));
            if (!selected.length) {
                if (typeof window.showToast === 'function') window.showToast('\u8bf7\u5148\u9009\u62e9\u89d2\u8272');
                return;
            }
            modal.classList.remove('active');
            generateCharacterDiaryFromPublishButton($('#btn-publish'), selected).catch(error => {
                console.error('Diary character diary picker failed:', error);
            });
        };
        updateStatus();
    }

    async function openCharacterDiaryPicker(trigger) {
        if (trigger?.dataset.generating === 'true') return;
        try {
            const boundWechatAccount = await ensureIcityWechatBoundForPosting();
            if (!boundWechatAccount) return;
            await getConnectedIcityApi();
            const [contactsData, wechatContactsData] = await Promise.all([
                getContactsData(),
                getWechatContactsData()
            ]);
            const candidates = getDiaryCharacterCandidates(contactsData, wechatContactsData);
            if (!candidates.length) {
                if (typeof window.showToast === 'function') window.showToast('\u8bf7\u5148\u5728\u8054\u7cfb\u4eba\u4e2d\u521b\u5efa\u89d2\u8272');
                return;
            }
            const modal = ensureCharacterDiaryPickerModal();
            renderCharacterDiaryPicker(modal, candidates);
            modal.classList.add('active');
        } catch (error) {
            console.error('Diary character diary picker could not open:', error);
            if (typeof window.showToast === 'function') window.showToast(error?.message || '\u65e5\u8bb0\u751f\u6210\u914d\u7f6e\u4e0d\u53ef\u7528');
        }
    }

    async function generateCharacterDiaryFromPublishButton(trigger, selectedCharacters = null) {
        if (trigger?.dataset.generating === 'true') return;
        
        try {
            const boundWechatAccount = await ensureIcityWechatBoundForPosting();
            if (!boundWechatAccount) return;

            const [contactsData, wechatContactsData] = await Promise.all([
                getContactsData(),
                getWechatContactsData()
            ]);
            const candidates = getDiaryCharacterCandidates(contactsData, wechatContactsData);
            const characters = Array.isArray(selectedCharacters) && selectedCharacters.length
                ? candidates.filter(candidate => selectedCharacters.some(selected => String(selected.id || '') === String(candidate.id || '')))
                : [pickDiaryCharacter(contactsData, wechatContactsData)].filter(Boolean);
            if (!characters.length) {
                if (typeof window.showToast === 'function') window.showToast('请先在联系人中创建角色');
                else showIcityFeedback('请先在联系人中创建角色');
                return;
            }

            if (trigger) {
                trigger.dataset.generating = 'true';
                trigger.classList.add('is-generating');
                trigger.setAttribute('aria-busy', 'true');
            }

            showIcityDiaryWritingNotice();
            const api = await getConnectedIcityApi();
            const worldPasserbyPromise = requestWorldPasserbyDiaries(api).catch(error => {
                console.warn('Diary world passerby diary generation failed:', error);
                return [];
            });
            for (const character of characters) {
                const diaryResult = await requestCharacterDiary(character, api);
                const text = diaryResult.content;
                const imageData = await maybeGenerateCharacterDiaryImage(character, text, diaryResult.diaryContext.wechatContactId);
                const now = new Date();
                const timeString = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
                const characterPost = {
                    id: Date.now() + Math.floor(Math.random() * 1000),
                    text,
                    img: imageData.img,
                    images: Array.isArray(imageData.images) ? imageData.images : (imageData.img ? [imageData.img] : []),
                    imageLayout: imageData.imageLayout || 'single-column',
                    imgDescription: imageData.imgDescription,
                    location: '',
                    diary: '',
                    time: timeString,
                    visibility: '公开',
                    scope: 'friends',
                    user: character.name || '角色',
                    handle: character.security?.account ? '@' + character.security.account : '@' + String(character.name || 'character').trim(),
                    avatar: character.avatar || '',
                    authorWechatId: diaryResult.diaryContext.wechatContactId || getWechatContactIdForCharacter(character, wechatContactsData),
                    authorWechatName: character.name || '',
                    authorWechatAvatar: character.avatar || '',
                    authorType: 'character',
                    characterId: character.id || null
                };
                await saveFeed(characterPost);
                await generateIcityPostInteractions(characterPost, { excludeCharacterId: character.id });
            }
            const worldPasserbyItems = await worldPasserbyPromise;
            await saveWorldPasserbyDiaries(worldPasserbyItems);
            await renderAllFeeds();
            switchView('world');
            switchWorldTab(1);
            if (typeof window.showToast === 'function') window.showToast(`已为 ${characters.length} 位角色生成日记`);
            return true;
        } catch (error) {
            console.error('Diary character diary generation failed:', error);
            if (typeof window.showToast === 'function') window.showToast(error?.message || '角色日记生成失败');
            return false;
        } finally {
            hideIcityDiaryWritingNotice();
            if (trigger) {
                delete trigger.dataset.generating;
                trigger.classList.remove('is-generating');
                trigger.removeAttribute('aria-busy');
            }
        }
    }
    
    function createIcityDiaryBookId(diary, index) {
        const existingId = String(diary?.id || '').trim();
        if (existingId) return existingId;
        const seed = String(diary?.createdAt || diary?.name || 'book')
            .replace(/[^a-zA-Z0-9_-]+/g, '_')
            .slice(0, 48);
        return 'diarybook_' + seed + '_' + index;
    }

    async function getDiaries() {
        const stored = await getIcityData('icity_diaries', []);
        const diaries = Array.isArray(stored) ? stored : [];
        let changed = false;
        const normalized = diaries.map((diary, index) => {
            if (diary?.id) return diary;
            changed = true;
            return { ...diary, id: createIcityDiaryBookId(diary, index) };
        });
        if (changed && window.db) {
            saveIcityData('icity_diaries', normalized).catch(error => console.error('Failed to backfill diary book ids', error));
        }
        return normalized;
    }

    async function ensureIcityDiaryBookBindings(diaries, feeds) {
        const books = Array.isArray(diaries) ? diaries : [];
        const nameMap = new Map();
        books.forEach(book => {
            const name = String(book?.name || '').trim();
            if (!name) return;
            const list = nameMap.get(name) || [];
            list.push(book);
            nameMap.set(name, list);
        });
        let changed = false;
        const nextFeeds = (Array.isArray(feeds) ? feeds : []).map(post => {
            if (post?.diaryId) return post;
            const matches = nameMap.get(String(post?.diary || '').trim()) || [];
            if (matches.length !== 1) return post;
            changed = true;
            return { ...post, diaryId: matches[0].id };
        });
        if (changed) {
            await withIcityDataLock('icity_feeds', [], stored => {
                const latest = Array.isArray(stored) ? stored : [];
                return latest.map(post => {
                    if (post?.diaryId) return post;
                    const matches = nameMap.get(String(post?.diary || '').trim()) || [];
                    return matches.length === 1 ? { ...post, diaryId: matches[0].id } : post;
                });
            });
        }
        return nextFeeds;
    }

    async function saveDiary(diary) {
        if (!diary.id) diary.id = Date.now() + '_' + Math.random().toString(36).substr(2, 9);
        return withIcityDataLock('icity_diaries', [], diaries => {
            const nextDiaries = Array.isArray(diaries) ? diaries : [];
            const index = nextDiaries.findIndex(item => String(item?.id) === String(diary.id));
            if (index !== -1) nextDiaries[index] = diary;
            else nextDiaries.push(diary);
            return nextDiaries;
        });
    }
    
    async function deleteDiary(id) {
        return withIcityDataLock('icity_diaries', [], diaries => {
            return (Array.isArray(diaries) ? diaries : [])
                .filter(item => String(item?.id) !== String(id));
        });
    }

    function readIcityLegacyStore(oldDb, storeName, mode = 'all') {
        if (!oldDb.objectStoreNames.contains(storeName)) return Promise.resolve(mode === 'one' ? null : []);
        return new Promise((resolve, reject) => {
            try {
                const transaction = oldDb.transaction(storeName, 'readonly');
                const request = mode === 'one'
                    ? (window.CharacterRecordCleanup?.wrap(transaction.objectStore(storeName)) || transaction.objectStore(storeName)).get('me')
                    : (window.CharacterRecordCleanup?.wrap(transaction.objectStore(storeName)) || transaction.objectStore(storeName)).getAll();
                request.onsuccess = () => resolve(request.result || (mode === 'one' ? null : []));
                request.onerror = event => reject(event.target?.error || new Error('读取旧 Diary 数据失败'));
                transaction.onerror = event => reject(event.target?.error || new Error('读取旧 Diary 事务失败'));
            } catch (error) {
                reject(error);
            }
        });
    }

    function getIcityMigrationRecordId(record, namespace, index) {
        const existingId = String(record?.id ?? '').trim();
        if (existingId) return existingId;
        const basis = String(record?.createdAt || record?.occurredAt || record?.name || record?.text || 'record')
            .replace(/[^a-zA-Z0-9_-]+/g, '_')
            .slice(0, 72);
        return 'legacy_' + namespace + '_' + index + '_' + basis;
    }

    function mergeIcityLegacyRecords(current, legacy, namespace) {
        const merged = Array.isArray(current) ? current.slice() : [];
        const ids = new Set(merged.map(record => String(record?.id ?? '').trim()).filter(Boolean));
        (Array.isArray(legacy) ? legacy : []).forEach((record, index) => {
            const id = getIcityMigrationRecordId(record, namespace, index);
            if (ids.has(id)) return;
            merged.push(Object.assign({}, record, { id }));
            ids.add(id);
        });
        return merged;
    }

    // 数据迁移逻辑 (将旧版独立的 iCityDB 数据自动迁移到全局 layoutStore)
    function migrateOldICityDB() {
        if (!window.db) {
            setTimeout(migrateOldICityDB, 100);
            return;
        }
        const req = indexedDB.open('iCityDB', 2);
        req.onerror = () => {
            if (typeof window.showToast === 'function') window.showToast('旧版 Diary 数据迁移失败，可稍后重试');
        };
        req.onsuccess = event => {
            const oldDb = event.target.result;
            (async () => {
                try {
                    const migrationMarker = await getIcityData('icity_migrated_v2', null);
                    if (migrationMarker) return;
                    const [oldProfile, oldFeeds, oldDiaries, currentProfile, currentFeeds, currentDiaries] = await Promise.all([
                        readIcityLegacyStore(oldDb, 'profile', 'one'),
                        readIcityLegacyStore(oldDb, 'feeds'),
                        readIcityLegacyStore(oldDb, 'diaries'),
                        getProfile(),
                        getFeeds(),
                        getDiaries()
                    ]);
                    const mergedProfile = Object.assign({}, currentProfile || {});
                    if (oldProfile && typeof oldProfile === 'object') {
                        Object.entries(oldProfile).forEach(([key, value]) => {
                            if (key === 'id') return;
                            if (mergedProfile[key] === undefined || mergedProfile[key] === null || mergedProfile[key] === '') {
                                mergedProfile[key] = value;
                            }
                        });
                    }
                    const mergedFeeds = mergeIcityLegacyRecords(currentFeeds, oldFeeds, 'feed');
                    const mergedDiaries = mergeIcityLegacyRecords(currentDiaries, oldDiaries, 'diary');
                    const writes = [];
                    if (Object.keys(mergedProfile).length) writes.push(saveIcityData('icity_profile', mergedProfile));
                    if (mergedFeeds.length !== (Array.isArray(currentFeeds) ? currentFeeds.length : 0)) writes.push(saveIcityData('icity_feeds', mergedFeeds));
                    if (mergedDiaries.length !== (Array.isArray(currentDiaries) ? currentDiaries.length : 0)) writes.push(saveIcityData('icity_diaries', mergedDiaries));
                    await Promise.all(writes);
                    await saveIcityData('icity_migrated_v2', {
                        completedAt: Date.now(),
                        feeds: mergedFeeds.length,
                        diaries: mergedDiaries.length
                    });
                } catch (error) {
                    console.error('Diary 旧库迁移失败:', error);
                    if (typeof window.showToast === 'function') window.showToast('旧版 Diary 数据迁移失败，可稍后重试');
                } finally {
                    oldDb.close();
                }
            })();
        };
    }
    migrateOldICityDB();

    function loadData() {
        const currentMonth = new Date().getMonth() + 1;
        const recordTag = $('#view-home .record-tag');
        if (recordTag) {
            recordTag.textContent = `${currentMonth}月记录`;
        }

        getProfile().then((data) => {
            if (data && Object.keys(data).length > 0) {
                if (data.nickname) {
                    const settingsNicknameVal = $('#settings-nickname-val');
                    if(settingsNicknameVal) {
                        if (settingsNicknameVal.tagName === 'INPUT') settingsNicknameVal.value = data.nickname;
                        else settingsNicknameVal.textContent = data.nickname;
                    }
                    const userName = $('.user-name');
                    if(userName) userName.textContent = data.nickname;
                    const appSettingsName = $('#app-settings-nickname');
                    if(appSettingsName) appSettingsName.textContent = data.nickname;
                }
                if (data.avatar) {
                    const settingsAvatarPreview = $('#settings-avatar-preview');
                    if(settingsAvatarPreview) {
                        settingsAvatarPreview.style.backgroundImage = data.avatar;
                        settingsAvatarPreview.innerHTML = '';
                    }
                    const avatarWrapper = $('.avatar-wrapper');
                    if(avatarWrapper) {
                        avatarWrapper.style.backgroundImage = data.avatar;
                        avatarWrapper.style.backgroundSize = 'cover';
                        avatarWrapper.style.backgroundPosition = 'center';
                    }
                    
                    $$('.sync-avatar').forEach(el => {
                        el.style.backgroundImage = data.avatar;
                        el.style.backgroundSize = 'cover';
                        el.style.backgroundPosition = 'center';
                        el.innerHTML = '';
                    });
                    const navAvatar = $('#tab-profile .nav-avatar');
                    if (navAvatar) {
                        navAvatar.style.backgroundImage = data.avatar;
                        navAvatar.style.backgroundSize = 'cover';
                        navAvatar.style.backgroundPosition = 'center';
                    }
                } else {
                    $$('.sync-avatar').forEach(el => {
                        el.style.backgroundImage = 'linear-gradient(to bottom right, #888, #ccc)';
                        el.innerHTML = '';
                    });
                    const navAvatar = $('#tab-profile .nav-avatar');
                    if (navAvatar) {
                        navAvatar.style.backgroundImage = 'linear-gradient(to bottom right, #888, #ccc)';
                    }
                }
                if (data.bg) {
                    const settingsBgPreview = $('#settings-bg-preview');
                    if(settingsBgPreview) {
                        settingsBgPreview.style.backgroundImage = data.bg;
                        settingsBgPreview.innerHTML = '';
                    }
                    const profileHeaderBg = $('.profile-header-bg');
                    if(profileHeaderBg) {
                        profileHeaderBg.style.backgroundImage = data.bg;
                        profileHeaderBg.style.backgroundSize = 'cover';
                        profileHeaderBg.style.backgroundPosition = 'center';
                    }
                }
                if (data.bio) {
                    const settingsBioVal = $('#settings-bio-val');
                    if(settingsBioVal) {
                        settingsBioVal.textContent = data.bio;
                        settingsBioVal.style.color = data.bio === '介绍一下自己' ? 'var(--text-light)' : 'var(--text-main)';
                    }
                }
                if (data.icityId) {
                    const settingsIcityIdVal = $('#settings-icity-id-val');
                    if(settingsIcityIdVal) {
                        if (settingsIcityIdVal.matches('input, textarea, select')) settingsIcityIdVal.value = data.icityId;
                        else settingsIcityIdVal.textContent = data.icityId;
                    }
                    const userHandle = $('.user-handle');
                    if(userHandle) userHandle.textContent = '@' + data.icityId;
                    const appSettingsId = $('#app-settings-icity-id');
                    if(appSettingsId) appSettingsId.textContent = data.icityId;
                }
                if (data.autoHd) {
                    const valAutoHd = $('#val-setting-auto-hd');
                    if(valAutoHd) valAutoHd.textContent = data.autoHd;
                }
                if (data.uploadSize) {
                    const valUploadSize = $('#val-setting-upload-size');
                    if(valUploadSize) valUploadSize.textContent = data.uploadSize;
                }
                if (data.gender) {
                    const settingsGenderVal = $('#settings-gender-val');
                    if(settingsGenderVal) settingsGenderVal.textContent = normalizeIcityGender(data.gender);
                }
                if (data.location) {
                    const settingsLocationVal = $('#settings-location-val');
                    if(settingsLocationVal) {
                        settingsLocationVal.textContent = data.location;
                        settingsLocationVal.style.color = data.location === '可选' ? 'var(--text-light)' : 'var(--text-main)';
                    }
                    const userLocation = $('.user-location');
                    if (userLocation && data.location !== '可选') {
                        userLocation.innerHTML = '<svg viewBox="0 0 24 24"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"></path></svg> ' + data.location;
                    }
                }
                
                const valSettings = $('#val-settings-earth-day');
                const valAppSettings = $('#val-app-settings-earth-day');
                const statusText = data.birthDate ? '已设置' : '未设置';
                if (valSettings) valSettings.textContent = statusText;
                if (valAppSettings) valAppSettings.textContent = statusText;
            }
            getWechatAuthData().then(async authData => {
                updateIcityWechatBindingUi(data || {}, authData);
                const boundAccount = getBoundWechatAccount(data || {}, authData);
                if (!boundAccount) {
                    await openIcityBindAccountPage();
                } else {
                    const bindView = $('#view-bind-account');
                    if (bindView && bindView.classList.contains('active')) {
                        bindView.classList.remove('active');
                        if ($('#main-bottom-nav')) $('#main-bottom-nav').style.display = 'flex';
                        switchView('home');
                    }
                }
            });
            applyIcityPreferenceUi(data || {});
            updateIcityAutoDiaryScheduler();
            renderIcityDmList();
            if (typeof renderIcityContactsFriendsList === 'function') renderIcityContactsFriendsList();
            if (typeof renderAllFeeds === 'function') renderAllFeeds();
        });

        refreshDiaryList();
    }

    async function openCharProfileById(charId, fallbackName, fallbackHandle, fallbackAvatar) {
        const feeds = await getVisibleIcityFeeds(await getFeeds());
        const cleanId = getIcityCleanCharacterId(charId);
        const matchedPost = feeds.find(p => 
            (cleanId && getIcityCleanCharacterId(p.characterId) === cleanId) ||
            (fallbackHandle && p.handle === fallbackHandle) || 
            (fallbackName && p.user === fallbackName)
        );
        if (matchedPost) {
            openCharProfile(matchedPost.id);
        } else {
            const activeView = $('.view-container.active');
            if (activeView && activeView.id !== 'view-char-profile') {
                previousView = activeView.id.replace('view-', '');
                viewStack.push(previousView);
            }
            $$('.view-container').forEach(v => v.classList.remove('active'));
            if (mainBottomNav) mainBottomNav.style.display = 'none';
            const nameEl = $('#char-profile-name');
            const handleEl = $('#char-profile-handle');
            const avatarEl = $('#char-profile-avatar');
            const bgEl = $('#char-profile-bg');
            if (nameEl) nameEl.textContent = fallbackName || '市民';
            if (handleEl) handleEl.textContent = fallbackHandle || '@diary_user';
            const avatarCss = getIcityAvatarStyle(fallbackAvatar);
            if (avatarEl) avatarEl.style.cssText = avatarCss;
            if (bgEl) bgEl.style.backgroundImage = avatarCss.replace('background-image:', '').replace(';', '');
            window.currentViewingProfileCharacterId = cleanId || '';
            if ($('#char-profile-bio')) $('#char-profile-bio').textContent = '';
            if ($('#char-profile-location span')) $('#char-profile-location span').textContent = '';
            await refreshIcityCharacterProfile({ characterId: cleanId, user: fallbackName, handle: fallbackHandle, avatar: fallbackAvatar });
            const viewCharProfile = $('#view-char-profile');
            if (viewCharProfile) viewCharProfile.classList.add('active');
        }
    }

    async function renderIcityContactsFriendsList() {
        const container = $('#contacts-friends-list');
        const countEl = $('#contacts-friends-count');
        if (!container) return;

        const [contactsData, wechatContactsData, profile, relationshipData] = await Promise.all([
            getContactsData(),
            getWechatContactsData(),
            getProfile(),
            getIcityRelationshipsData()
        ]);

        const profiles = await getIcityData('icity_character_profiles', {});
        const candidates = getDiaryCharacterCandidates(contactsData, wechatContactsData);
        const friendIdSet = new Set(Array.isArray(profile?.addedFriendIds) ? profile.addedFriendIds.map(String) : []);
        (relationshipData?.items || []).forEach(item => {
            if (item.friend && !item.blocked) {
                friendIdSet.add(String(item.targetId));
                if (String(item.targetId).startsWith('char_')) friendIdSet.add(String(item.targetId).slice(5));
            }
        });

        const friendCharacters = candidates.filter(c => {
            const cleanId = String(c.id || '');
            const wechatContact = getWechatContactForCharacter(c, wechatContactsData);
            const wechatId = String(wechatContact?.id || '');
            const wxid = String(wechatContact?.wxid || '');
            const name = String(c.name || '');
            return friendIdSet.has(cleanId) ||
                   friendIdSet.has('char_' + cleanId) ||
                   (wechatId && friendIdSet.has(wechatId)) ||
                   (wxid && friendIdSet.has(wxid)) ||
                   friendIdSet.has(name);
        });

        if (countEl) countEl.textContent = `${friendCharacters.length} 位市民`;

        if (!friendCharacters.length) {
            container.innerHTML = '<div style="font-size: 13px; color: var(--text-light); text-align: center; padding: 14px 0;">暂无市民好友，点击右上角添加市民</div>';
            return;
        }

        container.innerHTML = friendCharacters.map((c, idx) => {
            const local = profiles[getIcityDmThreadId({ characterId: c.id })] || {};
            const avatar = local.avatar || c.avatar;
            const avatarStyle = getIcityAvatarStyle(avatar);
            const cleanId = String(c.id || '');
            const name = String(local.name || c.name || '市民');
            const bio = local.bio ?? (c.persona ? c.persona.slice(0, 24) : '生活在 Diary 的市民');
            const handle = local.handle || (c.security?.account ? '@' + c.security.account : '@' + name);
            const isLast = idx === friendCharacters.length - 1;

            return `
                <div class="contact-friend-row" data-cid="${escapeIcityHtml(cleanId)}" data-name="${escapeIcityHtml(name)}" data-handle="${escapeIcityHtml(handle)}" data-avatar="${escapeIcityHtml(avatar || '')}" style="display: flex; align-items: center; justify-content: space-between; padding: 11px 0; ${isLast ? '' : 'border-bottom: 0.5px solid var(--border-color);'} cursor: pointer;">
                    <div style="display: flex; align-items: center; gap: 10px; flex: 1; min-width: 0;">
                        <div class="avatar" style="${avatarStyle}; width: 38px; height: 38px; font-size: 16px; flex-shrink: 0;"></div>
                        <div style="flex: 1; min-width: 0;">
                            <div style="font-size: 14px; font-weight: 600; color: var(--text-main);">${escapeIcityHtml(name)}</div>
                            <div style="font-size: 12px; color: var(--text-light); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; margin-top: 2px;">${escapeIcityHtml(bio)}</div>
                        </div>
                    </div>
                    <div class="btn-friend-send-dm" data-cid="${escapeIcityHtml(cleanId)}" data-name="${escapeIcityHtml(name)}" data-handle="${escapeIcityHtml(handle)}" data-avatar="${escapeIcityHtml(avatar || '')}" style="color: var(--theme-green); font-size: 13px; font-weight: 600; display: flex; align-items: center; gap: 3px; padding: 4px 6px; cursor: pointer; flex-shrink: 0;">
                        <span>发私信</span>
                        <svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><polyline points="9 18 15 12 9 6"></polyline></svg>
                    </div>
                </div>
            `;
        }).join('');

        container.querySelectorAll('.contact-friend-row').forEach(row => {
            bindIcityTap(row, (e) => {
                if (e.target.closest('.btn-friend-send-dm')) return;
                const cid = row.dataset.cid;
                const name = row.dataset.name;
                const handle = row.dataset.handle;
                const avatar = row.dataset.avatar;
                openCharProfileById(cid, name, handle, avatar);
            });
        });

        container.querySelectorAll('.btn-friend-send-dm').forEach(btn => {
            bindIcityTap(btn, (e) => {
                e.stopPropagation();
                const cid = btn.dataset.cid;
                const user = btn.dataset.name;
                const handle = btn.dataset.handle;
                const avatar = btn.dataset.avatar;
                openIcityChatRoom({ characterId: cid, user, handle, avatar });
            });
        });
    }

    function refreshDiaryList() {
        const scrollArea = $('.diary-books-scroll');
        const newBtn = $('#btn-create-diary');
        const profileBooksContainer = $('#profile-diary-books-container');
        const profileMoreBookCount = $('#profile-more-book-count');

        if (scrollArea && newBtn) {
            scrollArea.innerHTML = '';
            scrollArea.appendChild(newBtn);
        }
        
        if (profileBooksContainer) {
            profileBooksContainer.innerHTML = '';
        }
        
        getDiaries().then(async (diaries) => {
            diaries.sort((a, b) => {
                if (a.isPinned && !b.isPinned) return -1;
                if (!a.isPinned && b.isPinned) return 1;
                return b.createdAt - a.createdAt;
            });
            
            if (profileMoreBookCount) {
                profileMoreBookCount.textContent = diaries.length;
            }

            for (const diary of diaries) {
                if (scrollArea && newBtn) {
                    await renderDiaryCard(diary, scrollArea, newBtn);
                }
                if (profileBooksContainer) {
                    await renderDiaryCard(diary, profileBooksContainer, null);
                }
            }
            
            if (profileBooksContainer && diaries.length === 0) {
                profileBooksContainer.innerHTML = '<div style="width: 100%; text-align: center; color: var(--text-light); font-size: 13px; padding: 10px 0;">暂无日记本</div>';
            }
        });
    }

    // ================= 通讯录右上角：添加市民好友完整业务逻辑 =================
    const iconMsgContactsBtn = $('#icon-msg-contacts');
    const modalAddContact = $('#modal-add-contact');
    const closeAddContactModal = $('#close-add-contact-modal');
    const inputSearchCandidateContact = $('#input-search-candidate-contact');
    const addContactListContainer = $('#add-contact-list-container');

    async function openAddContactPanel() {
        if (!modalAddContact) return;
        modalAddContact.classList.add('active');
        if (inputSearchCandidateContact) inputSearchCandidateContact.value = '';
        await renderAddContactCandidates('');
    }

    async function renderAddContactCandidates(keyword = '') {
        if (!addContactListContainer) return;
        addContactListContainer.innerHTML = '<div style="padding: 20px; text-align: center; color: var(--text-light); font-size: 13px;">加载市民列表中...</div>';

        const [contactsData, wechatContactsData, profile] = await Promise.all([
            getContactsData(),
            getWechatContactsData(),
            getProfile()
        ]);

        const candidates = getDiaryCharacterCandidates(contactsData, wechatContactsData);
        const myFriendIds = new Set(Array.isArray(profile?.addedFriendIds) ? profile.addedFriendIds : []);

        const kw = String(keyword || '').trim().toLowerCase();
        const filtered = candidates.filter(c => {
            const name = String(c.name || '').toLowerCase();
            const bio = String(c.persona || '').toLowerCase();
            return !kw || name.includes(kw) || bio.includes(kw);
        });

        if (!filtered.length) {
            addContactListContainer.innerHTML = '<div style="padding: 30px; text-align: center; color: var(--text-light); font-size: 13px;">未找到匹配市民</div>';
            return;
        }

        addContactListContainer.innerHTML = filtered.map(c => {
            const cid = String(c.id || '');
            const isFriend = myFriendIds.has(cid);
            const avatarStyle = getIcityAvatarStyle(c.avatar);
            const bio = c.persona ? c.persona.slice(0, 24) : '生活在 Diary 的居民';

            return `
                <div class="card-box" style="margin: 0 0 8px 0; padding: 12px; display: flex; align-items: center; gap: 10px; background: var(--white);">
                    <div class="avatar" style="${avatarStyle}; width: 40px; height: 40px; font-size: 18px; flex-shrink: 0;"></div>
                    <div style="flex: 1; min-width: 0;">
                        <div style="font-size: 15px; font-weight: 600; color: var(--text-main);">${escapeIcityHtml(c.name)}</div>
                        <div style="font-size: 12px; color: var(--text-light); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; margin-top: 2px;">${escapeIcityHtml(bio)}</div>
                    </div>
                    <button type="button" class="btn-toggle-friend-status" data-cid="${cid}" style="padding: 6px 14px; border-radius: 16px; font-size: 12px; font-weight: 600; border: none; cursor: pointer; white-space: nowrap; ${isFriend ? 'background: #E5E5EA; color: var(--text-sub);' : 'background: #34C759; color: #FFFFFF;'}">
                        ${isFriend ? '已是好友' : '+ 加好友'}
                    </button>
                </div>
            `;
        }).join('');

        addContactListContainer.querySelectorAll('.btn-toggle-friend-status').forEach(btn => {
            bindIcityTap(btn, async (e) => {
                const cid = btn.dataset.cid;
                let friendIds = Array.isArray(profile?.addedFriendIds) ? [...profile.addedFriendIds] : [];
                if (friendIds.includes(cid)) {
                    friendIds = friendIds.filter(id => id !== cid);
                    if (typeof window.showToast === 'function') window.showToast('已取消好友关系');
                } else {
                    friendIds.push(cid);
                    if (typeof window.showToast === 'function') window.showToast('成功添加为好友！');
                }
                profile.addedFriendIds = friendIds;
                await saveProfileData('addedFriendIds', friendIds);
                await renderAddContactCandidates(inputSearchCandidateContact ? inputSearchCandidateContact.value : '');
                if (typeof renderIcityContactsFriendsList === 'function') await renderIcityContactsFriendsList();
                if (typeof renderAllFeeds === 'function') renderAllFeeds();
            });
        });
    }

    if (iconMsgContactsBtn) {
        bindIcityTap(iconMsgContactsBtn, openAddContactPanel);
    }

    if (closeAddContactModal && modalAddContact) {
        bindIcityTap(closeAddContactModal, () => modalAddContact.classList.remove('active'));
        modalAddContact.addEventListener('click', (e) => {
            if (e.target === modalAddContact) modalAddContact.classList.remove('active');
        });
    }

    if (inputSearchCandidateContact) {
        inputSearchCandidateContact.addEventListener('input', (e) => {
            renderAddContactCandidates(e.target.value);
        });
    }

    // ================= 私信右上角：发起新私信完整业务逻辑 =================
    const iconMsgDmsBtn = $('#icon-msg-dms');
    const modalNewDm = $('#modal-new-dm');
    const closeNewDmModal = $('#close-new-dm-modal');
    const inputSearchDmTarget = $('#input-search-dm-target');
    const newDmTargetListContainer = $('#new-dm-target-list-container');

    async function openNewDmPanel() {
        if (!modalNewDm) return;
        modalNewDm.classList.add('active');
        if (inputSearchDmTarget) inputSearchDmTarget.value = '';
        await renderNewDmCandidates('');
    }

    async function renderNewDmCandidates(keyword = '') {
        if (!newDmTargetListContainer) return;
        newDmTargetListContainer.innerHTML = '<div style="padding: 20px; text-align: center; color: var(--text-light); font-size: 13px;">加载好友中...</div>';

        const [contactsData, wechatContactsData] = await Promise.all([
            getContactsData(),
            getWechatContactsData()
        ]);

        const profiles = await getIcityData('icity_character_profiles', {});
        const candidates = getDiaryCharacterCandidates(contactsData, wechatContactsData).map(character => {
            const local = profiles[getIcityDmThreadId({ characterId: character.id })] || {};
            return { ...character, name: local.name || character.name, avatar: local.avatar || character.avatar, diaryHandle: local.handle };
        });
        const kw = String(keyword || '').trim().toLowerCase();
        const filtered = candidates.filter(c => {
            const name = String(c.name || '').toLowerCase();
            return !kw || name.includes(kw);
        });

        if (!filtered.length) {
            newDmTargetListContainer.innerHTML = '<div style="padding: 30px; text-align: center; color: var(--text-light); font-size: 13px;">未找到可私信的市民</div>';
            return;
        }

        newDmTargetListContainer.innerHTML = filtered.map(c => {
            const avatarStyle = getIcityAvatarStyle(c.avatar);
            const handle = c.diaryHandle || (c.security?.account ? '@' + c.security.account : '@' + (c.name || 'user'));
            return `
                <div class="card-box dm-candidate-row" data-cid="${escapeIcityHtml(c.id)}" data-name="${escapeIcityHtml(c.name)}" data-handle="${escapeIcityHtml(handle)}" data-avatar="${escapeIcityHtml(c.avatar || '')}" style="margin: 0 0 8px 0; padding: 12px; display: flex; align-items: center; gap: 12px; background: var(--white); cursor: pointer;">
                    <div class="avatar" style="${avatarStyle}; width: 38px; height: 38px; font-size: 16px; flex-shrink: 0;"></div>
                    <div style="flex: 1; min-width: 0;">
                        <div style="font-size: 15px; font-weight: 600; color: var(--text-main);">${escapeIcityHtml(c.name)}</div>
                        <div style="font-size: 12px; color: var(--text-light); margin-top: 2px;">${escapeIcityHtml(handle)}</div>
                    </div>
                    <div style="color: var(--theme-green); font-size: 13px; font-weight: 600; display: flex; align-items: center; gap: 3px;">
                        <span>发私信</span>
                        <svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><polyline points="9 18 15 12 9 6"></polyline></svg>
                    </div>
                </div>
            `;
        }).join('');

        newDmTargetListContainer.querySelectorAll('.dm-candidate-row').forEach(row => {
            bindIcityTap(row, () => {
                const user = row.dataset.name;
                const handle = row.dataset.handle;
                const avatar = row.dataset.avatar;
                if (modalNewDm) modalNewDm.classList.remove('active');
                openIcityChatRoom({ characterId: row.dataset.cid, user, handle, avatar });
            });
        });
    }

    if (iconMsgDmsBtn) {
        bindIcityTap(iconMsgDmsBtn, openNewDmPanel);
    }

    if (closeNewDmModal && modalNewDm) {
        bindIcityTap(closeNewDmModal, () => modalNewDm.classList.remove('active'));
        modalNewDm.addEventListener('click', (e) => {
            if (e.target === modalNewDm) modalNewDm.classList.remove('active');
        });
    }

    if (inputSearchDmTarget) {
        inputSearchDmTarget.addEventListener('input', (e) => {
            renderNewDmCandidates(e.target.value);
        });
    }

    async function renderDiaryCard(diary, container, insertAfterElement) {
        const isProfileContainer = container && container.id === 'profile-diary-books-container';
        const newCard = document.createElement('div');
        newCard.className = 'diary-book-card';
        newCard.style.cursor = 'pointer';
        newCard.style.background = diary.coverBg;
        newCard.style.color = 'white';
        newCard.style.alignItems = 'flex-start';
        newCard.style.justifyContent = 'flex-start';
        newCard.style.padding = '12px';
        newCard.style.position = 'relative';

        if (isProfileContainer) {
            // 个人主页日记本只显示纯封面
            newCard.innerHTML = '';
        } else {
            // 通讯录页面日记本：只显示封面、数量以及权限 SVG（不显示文本与stamp SVG）
            const allFeeds = await getFeeds();
            const diaryCount = allFeeds.filter(p => String(p?.diaryId || '') === String(diary.id)).length;
            const visibility = normalizeIcityVisibility(diary.visibility);

            let visSvg = '';
            if (visibility === '私人' || visibility === '仅自己') {
                // 私人锁 SVG
                visSvg = '<svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg>';
            } else if (visibility === '仅好友可见') {
                // 仅好友 SVG
                visSvg = '<svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" stroke-width="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>';
            } else {
                // 公开地球 SVG
                visSvg = '<svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"></circle><line x1="2" y1="12" x2="22" y2="12"></line><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path></svg>';
            }

            newCard.innerHTML = `
                <div class="bottom-info" style="position: absolute; bottom: 8px; left: 10px; right: 10px; display: flex; justify-content: space-between; align-items: center; font-size: 12px; opacity: 0.95; color: #FFFFFF; font-weight: 600; text-shadow: 0 1px 2px rgba(0,0,0,0.3);">
                    <span>${diaryCount}</span>
                    <span style="display: flex; align-items: center;">${visSvg}</span>
                </div>
            `;
        }
        
        newCard.addEventListener('click', () => {
            if (typeof openDiaryDetail === 'function') openDiaryDetail(diary);
        });
        
        if (insertAfterElement) {
            insertAfterElement.insertAdjacentElement('afterend', newCard);
        } else {
            container.appendChild(newCard);
        }
    }

    // 移除旧的 initDB 调用，因为现在依赖全局 window.db
    // ================= 视图切换逻辑 =================
    const tabHome = $('#tab-home');
    const tabWorld = $('#tab-world');
    const tabMessage = $('#tab-message');
    const tabProfile = $('#tab-profile');
    
    const viewHome = $('#view-home');
    const viewWorld = $('#view-world');
    const viewMessage = $('#view-message');
    const viewProfile = $('#view-profile');

    function switchView(viewName) {
        if(tabHome) tabHome.classList.remove('active');
        if(tabWorld) tabWorld.classList.remove('active');
        if(tabMessage) tabMessage.classList.remove('active');
        if(tabProfile) tabProfile.classList.remove('active');
        
        if(viewHome) viewHome.classList.remove('active');
        if(viewWorld) viewWorld.classList.remove('active');
        if(viewMessage) viewMessage.classList.remove('active');
        if(viewProfile) viewProfile.classList.remove('active');

        if (viewName === 'home') {
            if(tabHome) tabHome.classList.add('active');
            if(viewHome) viewHome.classList.add('active');
        } else if (viewName === 'world') {
            if(tabWorld) tabWorld.classList.add('active');
            if(viewWorld) viewWorld.classList.add('active');
        } else if (viewName === 'message') {
            if(tabMessage) tabMessage.classList.add('active');
            if(viewMessage) viewMessage.classList.add('active');
        } else if (viewName === 'profile') {
            if(tabProfile) tabProfile.classList.add('active');
            if(viewProfile) viewProfile.classList.add('active');
        }
    }

    if(tabHome) tabHome.addEventListener('click', () => switchView('home'));
    if(tabWorld) tabWorld.addEventListener('click', () => switchView('world'));
    if(tabMessage) tabMessage.addEventListener('click', () => switchView('message'));
    if(tabProfile) tabProfile.addEventListener('click', () => switchView('profile'));

    // ================= 交互 1：主页「写点什么」卡片展开与收起 =================
    const inlineEditor = $('#inline-editor');
    const collapseIcon = $('#collapse-editor');

    if (inlineEditor) {
        inlineEditor.addEventListener('click', function(e) {
            if (!this.classList.contains('expanded')) {
                this.classList.add('expanded');
                setTimeout(() => {
                    const textarea = this.querySelector('.editor-textarea');
                    if(textarea) textarea.focus();
                }, 300);
            }
        });
    }

    if (collapseIcon) {
        collapseIcon.addEventListener('click', function(e) {
            e.stopPropagation(); 
            if(inlineEditor) inlineEditor.classList.remove('expanded');
        });
    }

    document.addEventListener('click', function(e) {
        if (inlineEditor && inlineEditor.classList.contains('expanded') && !inlineEditor.contains(e.target)) {
            inlineEditor.classList.remove('expanded');
        }
    });

    // ================= 交互 1.5：详情页「写点什么」卡片展开与收起 =================
    const inlineEditorDetail = $('#inline-editor-detail');
    const collapseIconDetail = $('#collapse-editor-detail');

    if (inlineEditorDetail && collapseIconDetail) {
        inlineEditorDetail.addEventListener('click', function(e) {
            if (!this.classList.contains('expanded')) {
                this.classList.add('expanded');
                setTimeout(() => {
                    const textarea = this.querySelector('.editor-textarea');
                    if(textarea) textarea.focus();
                }, 300);
            }
        });

        collapseIconDetail.addEventListener('click', function(e) {
            e.stopPropagation(); 
            inlineEditorDetail.classList.remove('expanded');
        });

        document.addEventListener('click', function(e) {
            if (inlineEditorDetail.classList.contains('expanded') && !inlineEditorDetail.contains(e.target)) {
                inlineEditorDetail.classList.remove('expanded');
            }
        });
    }

    // ================= 交互 2：点击钢笔生成角色日记 =================
    const btnPublish = $('#btn-publish');
    const publishModal = $('#publish-modal');
    const closeModal = $('#close-modal');

    if (btnPublish) {
        btnPublish.setAttribute('role', 'button');
        btnPublish.setAttribute('aria-label', '生成角色日记');
        btnPublish.title = '生成角色日记';
        let lastPublishPointerAt = 0;
        const triggerPublishGeneration = event => {
            if (Date.now() - lastPublishPointerAt < 700 || btnPublish.dataset.generating === 'true') return;
            lastPublishPointerAt = Date.now();
            if (event?.cancelable) event.preventDefault();
            event?.stopPropagation();
            openCharacterDiaryPicker(btnPublish).catch(error => {
                console.error('Diary publish button failed:', error);
            });
        };
        btnPublish.addEventListener('pointerup', triggerPublishGeneration, { passive: false });
        btnPublish.addEventListener('touchend', triggerPublishGeneration, { passive: false });
        btnPublish.addEventListener('click', triggerPublishGeneration);
    }

    if (closeModal && publishModal) {
        closeModal.addEventListener('click', () => {
            resetIcityDiaryDateControl(publishModal.querySelector('.editor-wrapper') || publishModal);
            publishModal.classList.remove('active');
        });
    }

    if (publishModal) {
        publishModal.addEventListener('click', (e) => {
            if (e.target === publishModal) {
                resetIcityDiaryDateControl(publishModal.querySelector('.editor-wrapper') || publishModal);
                publishModal.classList.remove('active');
            }
        });
    }

    // ================= 交互 3：点击新建日记本弹出居中弹窗 =================
    const btnCreateDiary = $('#btn-create-diary');
    const createDiaryModal = $('#create-diary-modal');
    const closeCreateDiary = $('#close-create-diary');

    if (btnCreateDiary && createDiaryModal) {
        btnCreateDiary.addEventListener('click', () => {
            createDiaryModal.classList.add('active');
        });
    }

    if (closeCreateDiary && createDiaryModal) {
        closeCreateDiary.addEventListener('click', () => {
            createDiaryModal.classList.remove('active');
        });
    }

    if (createDiaryModal) {
        createDiaryModal.addEventListener('click', (e) => {
            if (e.target === createDiaryModal) {
                createDiaryModal.classList.remove('active');
            }
        });
    }

    // ================= 交互 4：自选封面上传与预览逻辑 =================
    const btnCustomCover = $('#btn-custom-cover');
    const inputCustomCover = $('#input-custom-cover');

    if (btnCustomCover && inputCustomCover) {
        btnCustomCover.addEventListener('click', () => {
            inputCustomCover.click();
        });

        inputCustomCover.addEventListener('change', function(e) {
            const file = e.target.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = function(event) {
                    btnCustomCover.style.backgroundImage = `url(${event.target.result})`;
                    btnCustomCover.style.backgroundSize = 'cover';
                    btnCustomCover.style.backgroundPosition = 'center';
                    btnCustomCover.innerHTML = ''; 
                    
                    selectedCoverBg = `url(${event.target.result}) center/cover`;
                    $$('.create-diary-cover-item').forEach(c => c.classList.remove('selected'));
                    btnCustomCover.classList.add('selected');
                };
                reader.readAsDataURL(file);
            }
        });
    }

    // ================= 交互 5：真实创建日记本逻辑 =================
    const btnVisibility = $('#btn-visibility');
    const textVisibility = $('#text-visibility');
    let selectedDiaryVisibility = normalizeIcityVisibility(textVisibility?.textContent || '公开');
    if (textVisibility) textVisibility.textContent = selectedDiaryVisibility;

    if (btnVisibility && textVisibility) {
        btnVisibility.addEventListener('click', () => {
            openIcityVisibilityPicker(selectedDiaryVisibility, value => {
                selectedDiaryVisibility = normalizeIcityVisibility(value);
                textVisibility.textContent = selectedDiaryVisibility;
            });
        });
    }

    let selectedCoverBg = 'linear-gradient(to bottom, #5AB1D8, #3A90C2)'; 
    const coverItems = $$('.create-diary-cover-item');
    
    coverItems.forEach(item => {
        item.addEventListener('click', function() {
            if(this.id !== 'btn-custom-cover') {
                coverItems.forEach(c => c.classList.remove('selected'));
                this.classList.add('selected');
                selectedCoverBg = window.getComputedStyle(this).background;
            }
        });
    });

    const btnDoneTop = $('#btn-done-top');
    const btnDoneBottom = $('#btn-done-bottom');
    const inputDiaryName = $('#input-diary-name');

    async function createNewDiary() {
        if (!inputDiaryName) return;
        const diaryName = inputDiaryName.value.trim() || '未命名日记本';
        const visibility = normalizeIcityVisibility(selectedDiaryVisibility || textVisibility?.textContent || '公开');
        const diaries = await getDiaries();
        const editingId = window.editingDiaryBookId ? String(window.editingDiaryBookId) : '';
        const duplicate = diaries.some(diary =>
            String(diary?.id || '') !== editingId &&
            String(diary?.name || '').trim() === diaryName
        );
        if (duplicate) {
            if (typeof window.showToast === 'function') window.showToast('已有同名日记本，请换一个名称');
            return;
        }

        try {
            if (editingId) {
                const diary = diaries.find(item => String(item?.id || '') === editingId);
                if (!diary) return;
                diary.name = diaryName;
                diary.coverBg = selectedCoverBg;
                diary.visibility = visibility;
                await ensureIcityDiaryBookBindings(diaries, await getFeeds());
                await saveDiary(diary);
                await withIcityDataLock('icity_feeds', [], stored => {
                    const latest = Array.isArray(stored) ? stored : [];
                    return latest.map(post =>
                        String(post?.diaryId || '') === String(diary.id)
                            ? { ...post, diary: diaryName }
                            : post
                    );
                });
                await refreshDiaryList();
                if (window.currentDiaryBook && String(window.currentDiaryBook.id) === String(diary.id)) {
                    window.currentDiaryBook = diary;
                    const detailPageTitle = $('#detail-page-title');
                    const detailPageCover = $('#detail-page-cover');
                    const detailPageVisibility = $('#detail-page-visibility');
                    if (detailPageTitle) detailPageTitle.textContent = diary.name;
                    if (detailPageCover) detailPageCover.style.background = diary.coverBg;
                    if (detailPageVisibility) detailPageVisibility.textContent = diary.visibility;
                    await renderIcityDiaryBookDetail(diary, currentIcityDiaryBookTab);
                }
                if (createDiaryModal) createDiaryModal.classList.remove('active');
                inputDiaryName.value = '';
                window.editingDiaryBookId = null;
                return;
            }

            const newDiary = {
                id: 'diarybook_' + Date.now() + '_' + Math.random().toString(36).slice(2, 8),
                name: diaryName,
                coverBg: selectedCoverBg,
                visibility,
                createdAt: Date.now(),
                isPinned: false
            };
            await saveDiary(newDiary);
            await refreshDiaryList();
            if (createDiaryModal) createDiaryModal.classList.remove('active');
            inputDiaryName.value = '';
            switchView('message');
        } catch (error) {
            console.error('Diary diary book save failed:', error);
            if (typeof window.showToast === 'function') window.showToast('日记本保存失败，请重试');
        }
    }

    if (btnDoneTop) btnDoneTop.addEventListener('click', createNewDiary);
    if (btnDoneBottom) btnDoneBottom.addEventListener('click', createNewDiary);
    // ================= 交互 6：日记本详情页跳转逻辑 =================
    const viewDiaryDetail = $('#view-diary-detail');
    const mainBottomNav = $('#main-bottom-nav');
    const btnBackDiaryDetail = $('#btn-back-diary-detail');
    
    const detailPageTitle = $('#detail-page-title');
    const detailPageCover = $('#detail-page-cover');


    // ================= Phase 6: independent diary-book tabs =================
    let currentIcityDiaryBookTab = 'diary';
    let currentIcityDiaryBookDateKey = null;
    let currentIcityDiaryBookRenderToken = 0;

    function getIcityDiaryBookCollaboratorKeys(book) {
        const keys = new Set();
        const collaboratorIds = Array.isArray(book?.collaboratorIds) ? book.collaboratorIds : [];
        collaboratorIds.forEach(value => {
            const key = String(value || '').trim();
            if (!key) return;
            keys.add(key);
            keys.add(key.replace(/^char_/, ''));
            if (!key.startsWith('char_')) keys.add('char_' + key);
        });
        return keys;
    }

    function isIcityDiaryBookCollaboratorPost(post, book) {
        if (!post || (post.authorType !== 'character' && !post.characterId)) return false;
        const collaboratorKeys = getIcityDiaryBookCollaboratorKeys(book);
        const postKeys = [
            post.characterId,
            post.authorWechatId,
            post.wechatId,
            getIcityPostAuthorId(post)
        ].map(value => String(value || '').trim()).filter(Boolean);
        return postKeys.some(key => collaboratorKeys.has(key) || collaboratorKeys.has(key.replace(/^char_/, '')));
    }

    async function getIcityDiaryBookEntries(book) {
        const diaries = await getDiaries();
        const allFeeds = await getFeeds();
        const boundFeeds = await ensureIcityDiaryBookBindings(diaries, allFeeds);
        const visibleFeeds = await getVisibleIcityFeeds(boundFeeds);
        const isPrivateBook = normalizeIcityVisibility(book?.visibility) === '私人';
        const [profile, authData] = await Promise.all([getProfile(), getWechatAuthData()]);
        const boundAccount = getBoundWechatAccount(profile, authData);
        const bookIdStr = String(book?.id || '');
        const bookNameStr = String(book?.name || '').trim();
        return visibleFeeds
            .filter(post => {
                const pId = String(post?.diaryId || '');
                const pName = String(post?.diary || '').trim();
                return (bookIdStr && pId === bookIdStr) || (bookNameStr && pName === bookNameStr);
            })
            .filter(post => {
                if (!isPrivateBook) return true;
                return isCurrentIcityUserPost(post, boundAccount) || isIcityDiaryBookCollaboratorPost(post, book);
            })
            .sort((a, b) => getIcityPostOccurredAt(b) - getIcityPostOccurredAt(a));
    }

    function formatIcityDiaryBookDate(timestamp) {
        const date = getIcityDateObject(getIcityPostOccurredAt({ occurredAt: timestamp }));
        if (Number.isNaN(date.getTime())) return '未知日期';
        return date.getFullYear() + '年' + (date.getMonth() + 1) + '月' + date.getDate() + '日';
    }

    function renderIcityDiaryBookEntry(post) {
        const text = String(post?.text || '').trim();
        const imageHtml = renderIcityFeedImage(post);
        const locHtml = post.location ? `
            <div class="entry-location" style="color: var(--text-light); font-size: 13px;">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="width: 16px; height: 16px; margin-right: 2px; transform: translateY(1px);"><path d="M17.5 19H9a7 7 0 1 1 6.71-9h1.79a4.5 4.5 0 1 1 0 9Z"></path></svg>
                ${escapeIcityHtml(post.location)}
            </div>` : '<div></div>';

        const likeSvg = post.isLiked 
            ? `<svg viewBox="0 0 24 24" style="width: 16px; height: 16px; fill: #FF3B30; stroke: #FF3B30; stroke-width: 2;"><path stroke-linecap="round" stroke-linejoin="round" d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"></path></svg>`
            : `<svg viewBox="0 0 24 24" style="width: 16px; height: 16px; fill: none; stroke: currentColor; stroke-width: 2;"><path stroke-linecap="round" stroke-linejoin="round" d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"></path></svg>`;

        const noteSvg = (post.notes && post.notes.length > 0)
            ? `<div style="display: flex; align-items: center; gap: 2px; color: #8AB4F8;">
                  <svg viewBox="0 0 24 24" style="width: 16px; height: 16px; fill: #8AB4F8; stroke: #8AB4F8; stroke-width: 1.5; stroke-linejoin: round;"><path d="M17 3H7c-1.1 0-2 .9-2 2v16l7-3 7 3V5c0-1.1-.9-2-2-2z"></path></svg>
                  <span style="font-size: 12px; font-weight: 600;">${post.notes.length}</span>
               </div>`
            : '';

        const occurredDate = getIcityDateObject(getIcityPostOccurredAt(post));
        const timeDisplay = post.time || (Number.isNaN(occurredDate.getTime()) ? '刚刚' : `${String(occurredDate.getHours()).padStart(2, '0')}:${String(occurredDate.getMinutes()).padStart(2, '0')}`);

        return `
            <div class="card-box entry-item" data-id="${escapeIcityHtml(post.id)}" style="cursor: pointer; margin-bottom: 8px;">
                <div class="entry-content">${escapeIcityHtml(text)}</div>
                ${imageHtml}
                <div class="entry-footer">
                    ${locHtml}
                    <div class="entry-actions">
                        ${likeSvg}
                        ${noteSvg}
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="-0.5 -0.5 16 16" style="width: 18px; height: 18px; fill: none; stroke: currentColor;"><path stroke-linecap="round" stroke-linejoin="round" d="M11.875 2.5H3.125a1.25 1.25 0 0 0 -1.25 1.25v6.25a1.25 1.25 0 0 0 1.25 1.25h1.9925000000000002c0.625 0 1.1325 0.5068750000000001 1.1325 1.1325 0 0.505 0.61 0.7575 0.9668749999999999 0.400625l1.166875 -1.166875A1.25 1.25 0 0 1 9.2675 11.25H11.875a1.25 1.25 0 0 0 1.25 -1.25V3.75a1.25 1.25 0 0 0 -1.25 -1.25z" stroke-width="1.2"></path></svg>
                        <div class="entry-time">
                            <svg viewBox="0 0 24 24" style="width: 16px; height: 16px; fill: none; stroke: currentColor; stroke-width: 2;"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>
                            ${escapeIcityHtml(timeDisplay)}
                        </div>
                        <svg viewBox="0 0 24 24" style="width: 16px; height: 16px; fill: currentColor; stroke: none;"><circle cx="12" cy="5" r="1.5"></circle><circle cx="12" cy="12" r="1.5"></circle><circle cx="12" cy="19" r="1.5"></circle></svg>
                    </div>
                </div>
            </div>
        `;
    }

    function renderIcityDiaryBookFeed(entries) {
        if (!entries.length) {
            return '<div class="card-box icity-diary-book-empty">这个日记本还没有可显示的日记</div>';
        }
        return entries.map(renderIcityDiaryBookEntry).join('');
    }

    function renderIcityDiaryBookCalendar(entries) {
        if (!entries.length) {
            return '<div class="card-box icity-diary-book-empty">这个日记本还没有可显示的日期</div>';
        }

        const byDate = {};
        entries.forEach(entry => {
            const dateKey = getIcityDateKey(getIcityPostOccurredAt(entry));
            if (!dateKey) return;
            if (!byDate[dateKey]) byDate[dateKey] = [];
            byDate[dateKey].push(entry);
        });

        const monthKeys = Array.from(new Set(entries.map(entry => getIcityMonthKey(getIcityPostOccurredAt(entry)))))
            .filter(Boolean)
            .sort()
            .reverse();
        const selectedEntries = currentIcityDiaryBookDateKey
            ? (byDate[currentIcityDiaryBookDateKey] || [])
            : [];

        let selectedHtml = '';
        if (currentIcityDiaryBookDateKey) {
            selectedHtml = '<div class="icity-diary-book-calendar-selected">' +
                '<div class="icity-diary-book-calendar-selected-header">' +
                '<strong>' + escapeIcityHtml(currentIcityDiaryBookDateKey) + '</strong>' +
                '<button type="button" class="icity-diary-book-calendar-clear">返回月份</button>' +
                '</div>' +
                (selectedEntries.length ? selectedEntries.map(renderIcityDiaryBookEntry).join('') : '<div class="icity-diary-book-empty">这一天没有可显示的日记</div>') +
                '</div>';
        }

        const monthHtml = monthKeys.map(monthKey => {
            const parts = monthKey.split('-');
            const year = Number(parts[0]);
            const month = Number(parts[1]);
            const firstWeekday = new Date(year, month - 1, 1).getDay();
            const totalDays = new Date(year, month, 0).getDate();
            let cells = '';
            for (let index = 0; index < firstWeekday; index += 1) {
                cells += '<span class="icity-diary-book-calendar-blank"></span>';
            }
            for (let day = 1; day <= totalDays; day += 1) {
                const dateKey = year + '-' + String(month).padStart(2, '0') + '-' + String(day).padStart(2, '0');
                const count = (byDate[dateKey] || []).length;
                cells += '<button type="button" class="icity-diary-book-calendar-day' +
                    (count ? ' has-entry' : '') +
                    (dateKey === currentIcityDiaryBookDateKey ? ' is-selected' : '') +
                    '" data-diary-book-date="' + dateKey + '">' +
                    '<span>' + day + '</span>' +
                    (count ? '<em>' + count + '</em>' : '') +
                    '</button>';
            }
            return '<div class="card-box icity-diary-book-calendar-card">' +
                '<div class="icity-diary-book-calendar-title">' + year + '年' + month + '月</div>' +
                '<div class="icity-diary-book-calendar-weekdays"><span>日</span><span>一</span><span>二</span><span>三</span><span>四</span><span>五</span><span>六</span></div>' +
                '<div class="icity-diary-book-calendar-grid">' + cells + '</div>' +
                '</div>';
        }).join('');

        return selectedHtml + '<div class="icity-diary-book-calendar-list">' + monthHtml + '</div>';
    }

    function renderIcityDiaryBookGallery(entries) {
        const items = [];
        entries.forEach(entry => {
            getIcityPostImages(entry).forEach((src, index) => {
                items.push(
                    '<div class="icity-diary-book-gallery-item entry-item" data-id="' + escapeIcityHtml(entry?.id) + '" data-diary-book-image-index="' + index + '">' +
                    '<img src="' + escapeIcityHtml(src) + '" alt="日记图片">' +
                    '<div>' + escapeIcityHtml(formatIcityDiaryBookDate(getIcityPostOccurredAt(entry))) + '</div>' +
                    '</div>'
                );
            });
        });
        if (!items.length) {
            return '<div class="card-box icity-diary-book-empty">这个日记本还没有可显示的图片</div>';
        }
        return '<div class="icity-diary-book-gallery">' + items.join('') + '</div>';
    }

    function renderIcityDiaryBookAiOutput(book) {
        const output = $('#icity-diary-book-ai-output');
        if (!output) return;
        const summaryText = String(book?.phaseSummary || '').trim();
        if (!summaryText) {
            output.innerHTML = '';
            output.style.display = 'none';
            return;
        }

        output.innerHTML = `
            <div class="card-box icity-diary-book-ai-card">
                <div class="icity-diary-book-ai-card-header">
                    <span class="header-tag">
                        <svg viewBox="0 0 24 24" width="13" height="13" fill="currentColor"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"></path></svg>
                        阶段总结 · AI
                    </span>
                    <span style="font-size: 11px; color: var(--text-light);">本册生活脉络</span>
                </div>
                <div class="icity-diary-book-ai-card-body">${escapeIcityHtml(summaryText)}</div>
            </div>
        `;
        output.style.display = 'block';
    }

    function ensureIcityDiaryBookControls() {
        const tabs = $('#icity-diary-book-tabs');
        if (tabs) tabs.remove();
        const actions = $('#icity-diary-book-ai-actions');
        if (actions) actions.remove();

        let output = $('#icity-diary-book-ai-output');
        const inlineEditor = $('#inline-editor-detail');
        const topCard = $('.diary-detail-top-card');

        if (!output) {
            output = document.createElement('div');
            output.id = 'icity-diary-book-ai-output';
            output.className = 'icity-diary-book-ai-output';
        }

        // 精准放置在“写点什么”展开卡片的正下方
        if (inlineEditor) {
            inlineEditor.insertAdjacentElement('afterend', output);
        } else if (topCard) {
            topCard.insertAdjacentElement('afterend', output);
        }
    }

    function ensurePhaseSummaryResultModal() {
        let modal = $('#modal-phase-summary-result');
        if (modal) return modal;
        modal = document.createElement('div');
        modal.id = 'modal-phase-summary-result';
        modal.className = 'modal-overlay';
        modal.innerHTML = `
            <div class="phase-summary-modal-content" role="dialog" aria-modal="true">
                <div class="phase-summary-modal-header">
                    <div style="font-size: 16px; font-weight: 700; color: var(--text-main);" id="phase-summary-modal-title">阶段总结</div>
                    <div class="modal-close" id="close-phase-summary-modal" style="width: 26px; height: 26px; border-radius: 50%; background: rgba(0,0,0,0.06); display: flex; align-items: center; justify-content: center; cursor: pointer; color: #8E8E93;">✕</div>
                </div>
                <div class="phase-summary-modal-body" id="phase-summary-modal-text"></div>
                <div class="phase-summary-modal-footer">
                    <button type="button" id="btn-save-phase-summary" style="background: #25C85A; color: #FFF; border: none; border-radius: 6px; padding: 7px 18px; font-size: 14px; font-weight: 600; cursor: pointer;">保存到日记本</button>
                </div>
            </div>
        `;
        const host = document.querySelector('#icityNewAppUI .icity-app-inner-container') || document.getElementById('icityNewAppUI') || document.body;
        host.appendChild(modal);

        const closeBtn = modal.querySelector('#close-phase-summary-modal');
        if (closeBtn) closeBtn.onclick = () => modal.classList.remove('active');
        modal.addEventListener('click', (e) => {
            if (e.target === modal) modal.classList.remove('active');
        });
        return modal;
    }

    async function runIcityDiaryBookAiAction(action) {
        const book = window.currentDiaryBook;
        if (!book || action !== 'summary') return;

        const entries = await getIcityDiaryBookEntries(book);
        if (!entries.length) {
            if (typeof window.showToast === 'function') window.showToast('该日记本暂无可总结的日记记录');
            else showIcityFeedback('该日记本暂无可总结的日记记录');
            return;
        }

        // 1. 弹出 Diary 原生确认对话框替代原生 confirm
        let confirmed = false;
        if (typeof window.showCustomConfirm === 'function') {
            confirmed = await window.showCustomConfirm(
                '生成阶段总结',
                `是否结合《${book.name}》的现有记录，由 AI 为你整理一份专属的阶段生活总结？`,
                '开始生成',
                false
            );
        } else {
            confirmed = confirm(`是否结合《${book.name}》的现有记录，由 AI 为你整理一份专属的阶段生活总结？`);
        }
        if (!confirmed) return;

        if (typeof window.showToast === 'function') window.showToast('正在整理日记并生成阶段总结…');

        const source = entries.slice(0, 16).map(entry => {
            return '[' + formatIcityDiaryBookDate(getIcityPostOccurredAt(entry)) + '] ' + String(entry.text || '').slice(0, 300);
        }).join('\n');

        try {
            const api = await getConnectedIcityApi();
            const instruction = '请返回 JSON：{"summary":"根据日记提炼出的阶段生活与心境总结，字数约 200~350 字，文字克制温暖、贴近生活流。"}。';
            const raw = await requestIcityChatCompletion(api, [
                { role: 'system', content: '你是 Diary 生活整理助手，专门负责将生活日记提炼为情感细腻的阶段总结。' },
                { role: 'user', content: '日记本名称：' + String(book.name || '') + '\n' + instruction + '\n日记内容：\n' + source }
            ], { temperature: 0.65 });

            const result = parseIcityJsonObject(raw);
            const summaryVal = String(result.summary || result.text || raw || '').trim();
            if (!summaryVal) throw new Error('未能生成有效的总结内容');

            // 2. 弹出 Diary 风格的日记展示弹窗显示生成内容
            const modal = ensurePhaseSummaryResultModal();
            const titleEl = modal.querySelector('#phase-summary-modal-title');
            const bodyEl = modal.querySelector('#phase-summary-modal-text');
            const saveBtn = modal.querySelector('#btn-save-phase-summary');

            if (titleEl) titleEl.textContent = `《${book.name}》阶段总结`;
            if (bodyEl) bodyEl.textContent = summaryVal;

            modal.classList.add('active');

            saveBtn.onclick = async () => {
                book.phaseSummary = summaryVal;
                await saveDiary(book);
                modal.classList.remove('active');
                renderIcityDiaryBookAiOutput(book);
                if (typeof window.showToast === 'function') window.showToast('阶段总结已成功收录！');
            };
        } catch (error) {
            const message = error?.message || '生成阶段总结失败';
            if (typeof window.showToast === 'function') window.showToast(message);
            else showIcityFeedback(message);
        }
    }

    async function renderIcityDiaryBookDetail(book, tab = 'diary') {
        if (!book) return;
        const renderToken = ++currentIcityDiaryBookRenderToken;
        const entries = await getIcityDiaryBookEntries(book);
        if (renderToken !== currentIcityDiaryBookRenderToken || window.currentDiaryBook?.id !== book.id) return;
        ensureIcityDiaryBookControls();

        const countEl = $('#detail-page-count');
        const timeEl = $('#detail-page-time');
        const visibilityEl = $('#detail-page-visibility');
        const latestTimestamp = entries.length ? getIcityPostOccurredAt(entries[0]) : 0;
        if (countEl) {
            countEl.innerHTML = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2 2.5 2.5 0 0 1 6.5 2z"></path></svg> ' + entries.length + '日记';
        }
        if (timeEl) {
            timeEl.innerHTML = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg> ' + (latestTimestamp ? formatIcityDiaryBookDate(latestTimestamp) : '暂无记录');
        }
        if (visibilityEl) {
            visibilityEl.innerHTML = getIcityVisibilityIcon(book.visibility) + ' ' + normalizeIcityVisibility(book.visibility);
        }

        renderIcityDiaryBookAiOutput(book);

        const feed = $('#diary-detail-feed');
        if (!feed) return;
        feed.classList.remove('card-box');
        feed.innerHTML = renderIcityDiaryBookFeed(entries);
    }

    window.openDiaryDetail = function(diary) {
        rememberIcitySourceView();
        window.currentDiaryBook = diary;
        currentIcityDiaryBookTab = 'diary';
        currentIcityDiaryBookDateKey = null;

        $$('.view-container').forEach(v => v.classList.remove('active'));
        if(mainBottomNav) mainBottomNav.style.display = 'none';

        const userNameElement = $('.user-name');
        const userName = userNameElement ? userNameElement.textContent : '我';
        const headerTitle = $('#detail-page-header-title');
        if(headerTitle) headerTitle.textContent = userName + '的日记本';

        if(detailPageTitle) detailPageTitle.textContent = diary.name;
        if(detailPageCover) detailPageCover.style.background = diary.coverBg;

        // 同步详情页内嵌写日记框的日记本信息
        const inlineEditorDetailEl = $('#inline-editor-detail');
        if (inlineEditorDetailEl) {
            const detailDisplayDiary = inlineEditorDetailEl.querySelector('.display-diary');
            const detailBtnDiary = inlineEditorDetailEl.querySelector('.btn-diary');
            if (detailDisplayDiary) detailDisplayDiary.textContent = diary.name;
            if (detailBtnDiary) detailBtnDiary.classList.add('active');
        }

        ensureIcityDiaryBookControls();
        if(viewDiaryDetail) viewDiaryDetail.classList.add('active');
        renderIcityDiaryBookDetail(diary, currentIcityDiaryBookTab).catch(error => {
            console.error('Failed to render diary book detail', error);
        });
    };

    if (btnBackDiaryDetail) {
        btnBackDiaryDetail.addEventListener('click', () => {
            currentIcityDiaryBookDateKey = null;
            currentIcityDiaryBookTab = 'diary';
            if(viewDiaryDetail) viewDiaryDetail.classList.remove('active');
            restoreIcitySourceView('message');
        });
    }

    // ================= 交互 6.5：日记本专属全屏日历视图 =================
    const btnDiaryBookCalendar = $('#btn-diary-book-calendar');
    const viewDiaryBookCalendar = $('#view-diary-book-calendar');
    const btnBackDiaryBookCalendar = $('#btn-back-diary-book-calendar');
    const bookCalYearDisplay = $('#book-cal-current-year-display');
    const btnBookCalPrevYear = $('#btn-book-cal-prev-year');
    const btnBookCalNextYear = $('#btn-book-cal-next-year');

    let currentBookCalendarYear = new Date().getFullYear();

    async function openDiaryBookCalendarView() {
        if (!window.currentDiaryBook) return;
        $$('.view-container').forEach(v => v.classList.remove('active'));
        if (mainBottomNav) mainBottomNav.style.display = 'none';
        
        currentBookCalendarYear = new Date().getFullYear();
        if (viewDiaryBookCalendar) viewDiaryBookCalendar.classList.add('active');
        await renderDiaryBookCalendar(currentBookCalendarYear);
    }

    if (btnDiaryBookCalendar) {
        btnDiaryBookCalendar.addEventListener('click', openDiaryBookCalendarView);
    }

    if (btnBackDiaryBookCalendar) {
        btnBackDiaryBookCalendar.addEventListener('click', () => {
            if (viewDiaryBookCalendar) viewDiaryBookCalendar.classList.remove('active');
            if (viewDiaryDetail) viewDiaryDetail.classList.add('active');
        });
    }

    if (btnBookCalPrevYear) {
        btnBookCalPrevYear.addEventListener('click', () => {
            currentBookCalendarYear--;
            renderDiaryBookCalendar(currentBookCalendarYear);
        });
    }

    if (btnBookCalNextYear) {
        btnBookCalNextYear.addEventListener('click', () => {
            currentBookCalendarYear++;
            renderDiaryBookCalendar(currentBookCalendarYear);
        });
    }

    async function renderDiaryBookCalendar(targetYear) {
        const book = window.currentDiaryBook;
        if (!book) return;

        if (bookCalYearDisplay) bookCalYearDisplay.textContent = targetYear;

        const navTitle = $('#diary-book-calendar-nav-title');
        if (navTitle) navTitle.textContent = `${book.name} · Calendar`;

        const coverEl = $('#book-cal-cover');
        if (coverEl) coverEl.style.background = book.coverBg;

        const entries = await getIcityDiaryBookEntries(book);
        
        // 统计总数据
        const daysSet = new Set();
        let totalLikes = 0;
        entries.forEach(post => {
            const dateStr = getIcityDateKey(getIcityPostOccurredAt(post));
            if (dateStr) daysSet.add(dateStr);
            totalLikes += getIcityPostLikeCount(post);
        });

        const statDays = $('#book-cal-stat-days');
        const statDiaries = $('#book-cal-stat-diaries');
        const statLikes = $('#book-cal-stat-likes');
        if (statDays) statDays.textContent = daysSet.size;
        if (statDiaries) statDiaries.textContent = entries.length;
        if (statLikes) statLikes.textContent = totalLikes;

        // 筛选该日历年份下的日记天数集合
        const yearDaysSet = new Set();
        entries.forEach(post => {
            const occ = getIcityPostOccurredAt(post);
            const d = getIcityDateObject(occ);
            if (d.getFullYear() === targetYear) {
                const dateKey = getIcityDateKey(occ);
                if (dateKey) yearDaysSet.add(dateKey);
            }
        });

        const today = new Date();
        const isCurrentYear = today.getFullYear() === targetYear;
        const currentMonthIdx = today.getMonth() + 1;
        const currentDay = today.getDate();

        const matrixContainer = $('#book-cal-matrix-container');
        if (!matrixContainer) return;

        let matrixHtml = '';
        for (let m = 1; m <= 12; m++) {
            const daysInMonth = new Date(targetYear, m, 0).getDate();
            let squaresHtml = '';

            for (let day = 1; day <= daysInMonth; day++) {
                const dateKey = `${targetYear}-${String(m).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
                const hasDiary = yearDaysSet.has(dateKey);
                const isToday = isCurrentYear && m === currentMonthIdx && day === currentDay;

                let squareClass = 'book-matrix-square';
                if (isToday) squareClass += ' is-today';
                else if (hasDiary) squareClass += ' has-diary';

                squaresHtml += `<div class="${squareClass}" data-date="${dateKey}" title="${dateKey}"></div>`;
            }

            matrixHtml += `
                <div class="book-matrix-row">
                    <span class="book-matrix-month-label">${m}月</span>
                    <div class="book-matrix-grid">
                        ${squaresHtml}
                    </div>
                </div>
            `;
        }

        matrixContainer.innerHTML = matrixHtml;

        matrixContainer.querySelectorAll('.book-matrix-square.has-diary').forEach(sq => {
            bindIcityTap(sq, () => {
                const dateKey = sq.dataset.date;
                if (dateKey) openIcityDayDiaryList(dateKey);
            });
        });
    }

    // ================= 交互 7：个人设置页跳转逻辑 =================
    const btnEditProfile = $('#btn-edit-profile');
    const viewSettings = $('#view-settings');
    const btnBackSettings = $('#btn-back-settings');
    const btnDoneSettings = $('#btn-done-settings');

    if (btnEditProfile) {
        btnEditProfile.addEventListener('click', () => {
            $$('.view-container').forEach(v => v.classList.remove('active'));
            if(mainBottomNav) mainBottomNav.style.display = 'none';
            if(viewSettings) viewSettings.classList.add('active');
        });
    }

    function closeSettings() {
        if(viewSettings) viewSettings.classList.remove('active');
        if(mainBottomNav) mainBottomNav.style.display = 'flex';
        switchView('profile');
    }

    if (btnBackSettings) btnBackSettings.addEventListener('click', closeSettings);
    if (btnDoneSettings) btnDoneSettings.addEventListener('click', closeSettings);

    // ================= 交互 7.5：程序设置页跳转逻辑 =================
    const btnAppSettingsTop = $('#btn-app-settings-top');
    const btnAppSettingsBottom = $('#btn-app-settings-bottom');
    const viewAppSettings = $('#view-app-settings');
    const btnBackAppSettings = $('#btn-back-app-settings');
    const btnDoneAppSettings = $('#btn-done-app-settings');

    function openAppSettings() {
        $$('.view-container').forEach(v => v.classList.remove('active'));
        if (viewSinglePost) viewSinglePost.style.setProperty('--icity-keyboard-offset', '0px');
        if(mainBottomNav) mainBottomNav.style.display = 'none';
        if(viewAppSettings) viewAppSettings.classList.add('active');
    }

    function closeAppSettings() {
        if(viewAppSettings) viewAppSettings.classList.remove('active');
        if(mainBottomNav) mainBottomNav.style.display = 'flex';
        switchView('profile');
    }

    if (btnAppSettingsTop) btnAppSettingsTop.addEventListener('click', openAppSettings);
    if (btnAppSettingsBottom) btnAppSettingsBottom.addEventListener('click', openAppSettings);
    if (btnBackAppSettings) btnBackAppSettings.addEventListener('click', closeAppSettings);
    if (btnDoneAppSettings) btnDoneAppSettings.addEventListener('click', closeAppSettings);

    const btnAppSettingsProfile = $('#btn-app-settings-profile');
    if (btnAppSettingsProfile) {
        btnAppSettingsProfile.addEventListener('click', () => {
            if(viewAppSettings) viewAppSettings.classList.remove('active');
            if(viewSettings) viewSettings.classList.add('active');
        });
    }

    function pruneIcityUnusedSettings() {
        const roots = [viewSettings, viewAppSettings].filter(Boolean);
        const labelsToRemove = ['推送设置', '隐私设置', '个人主页模块排序', '日记本排序', '清空列表缓存', '清空图片缓存', '关于'];
        let logoutIndex = 0;
        roots.forEach(root => {
            root.querySelectorAll('.settings-item').forEach(item => {
                const text = String(item.textContent || '').replace(/\s+/g, ' ').trim();
                if (labelsToRemove.some(label => text.includes(label))) {
                    const group = item.closest('.settings-group');
                    item.remove();
                    if (group && !group.querySelector('.settings-item')) {
                        group.remove();
                    }
                    return;
                }
                if (!text.includes('退出登录') && !text.includes('切换账户') && !text.includes('退出账号')) return;
                const label = item.querySelector('.item-label');
                if (label) {
                    label.textContent = '退出账号';
                    label.style.color = '#FF3B30';
                }
                logoutIndex += 1;
                item.id = logoutIndex === 1 ? 'btn-logout-wechat-account' : `btn-logout-wechat-account-${logoutIndex}`;
                bindIcityTap(item, async () => {
                    await logoutIcityAccount();
                });
            });
            root.querySelectorAll('.settings-group').forEach(group => {
                if (!group.querySelector('.settings-item')) {
                    group.remove();
                }
            });
        });
    }

    function findIcitySettingItem(root, labelText) {
        if (!root) return null;
        return Array.from(root.querySelectorAll('.settings-item')).find(item => {
            const label = item.querySelector('.item-label');
            return String(label?.textContent || '').includes(labelText);
        }) || null;
    }

    function openIcityFontUpload() {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = '.ttf,.otf,.woff,.woff2,font/*';
        input.style.display = 'none';
        input.addEventListener('change', () => {
            const file = input.files && input.files[0];
            input.remove();
            if (!file) return;
            const reader = new FileReader();
            reader.onload = async event => {
                await setIcityFontPreference(event.target.result, file.name.replace(/\.[^.]+$/, '') || file.name);
                if (typeof window.showToast === 'function') window.showToast('字体已应用到 Diary');
            };
            reader.onerror = () => {
                if (typeof window.showToast === 'function') window.showToast('字体读取失败');
            };
            reader.readAsDataURL(file);
        }, { once: true });
        document.body.appendChild(input);
        input.click();
    }

    async function openIcityFontUrlUpload() {
        if (typeof window.showCustomPrompt !== 'function') return;
        const url = await window.showCustomPrompt('使用 URL 上传字体', { placeholder: 'https://example.com/font.woff2' }, '安装');
        const fontUrl = String(url || '').trim();
        if (!/^https?:\/\//i.test(fontUrl)) return;
        const filename = fontUrl.split(/[/?#]/).filter(Boolean).pop() || 'Diary Font';
        await setIcityFontPreference(fontUrl, filename.replace(/\.[^.]+$/, '') || filename);
        if (typeof window.showToast === 'function') window.showToast('字体已应用到 Diary');
    }

    async function openIcityFontPicker() {
        const existing = document.getElementById('icityFontSourceOverlay');
        if (existing) existing.remove();
        const profile = await getProfile();
        const currentFont = getIcityFontLabel(profile);

        const overlay = document.createElement('div');
        overlay.id = 'icityFontSourceOverlay';
        overlay.className = 'icity-time-picker-overlay';
        overlay.style.zIndex = '2800';

        overlay.innerHTML = `
            <div class="modal-content" style="width: 90%; max-width: 360px; height: auto; padding: 18px; border-radius: 14px; background: var(--white); box-shadow: 0 10px 30px rgba(0,0,0,0.18);">
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 14px;">
                    <div style="font-size: 17px; font-weight: 700; color: var(--text-main);">日记内页字体</div>
                    <div id="close-font-modal" style="font-size: 14px; color: var(--theme-blue); cursor: pointer;">完成</div>
                </div>
                <div style="padding: 12px; background: #F6F6F9; border-radius: 8px; margin-bottom: 14px; font-size: 13px; color: var(--text-sub);">
                    当前字体：<span style="font-weight: 600; color: var(--theme-blue);">${escapeIcityHtml(currentFont)}</span>
                </div>
                <div style="display: flex; flex-direction: column; gap: 8px;">
                    <button type="button" id="btn-font-default" style="padding: 12px; border: 1px solid var(--border-color); background: var(--white); border-radius: 8px; text-align: left; font-size: 14px; cursor: pointer; color: var(--text-main);">
                        恢复默认字体 (系统自动)
                    </button>
                    <button type="button" id="btn-font-upload-local" style="padding: 12px; border: 1px solid var(--border-color); background: var(--white); border-radius: 8px; text-align: left; font-size: 14px; cursor: pointer; color: var(--text-main); display: flex; justify-content: space-between; align-items: center;">
                        <span>本地文件上传字体 (.ttf, .woff2)</span>
                        <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2"><polyline points="9 18 15 12 9 6"></polyline></svg>
                    </button>
                    <button type="button" id="btn-font-upload-url" style="padding: 12px; border: 1px solid var(--border-color); background: var(--white); border-radius: 8px; text-align: left; font-size: 14px; cursor: pointer; color: var(--text-main); display: flex; justify-content: space-between; align-items: center;">
                        <span>使用在线 URL 上传字体</span>
                        <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2"><polyline points="9 18 15 12 9 6"></polyline></svg>
                    </button>
                </div>
            </div>
        `;

        const host = document.querySelector('#icityNewAppUI .icity-app-inner-container') || document.getElementById('icityNewAppUI') || document.body;
        host.appendChild(overlay);

        overlay.querySelector('#close-font-modal').onclick = () => overlay.remove();
        overlay.querySelector('#btn-font-default').onclick = async () => {
            await setIcityFontPreference('', '');
            overlay.remove();
            if (typeof window.showToast === 'function') window.showToast('已恢复默认字体');
        };
        overlay.querySelector('#btn-font-upload-local').onclick = () => {
            overlay.remove();
            openIcityFontUpload();
        };
        overlay.querySelector('#btn-font-upload-url').onclick = () => {
            overlay.remove();
            openIcityFontUrlUpload();
        };
    }

    function openIcityTimeWheelPicker(currentTime) {
        const existing = document.getElementById('icityTimeWheelOverlay');
        if (existing) existing.remove();
        const [rawHour, rawMinute] = String(currentTime || ICITY_DEFAULT_AUTO_DIARY_TIME).split(':');
        const hour = Math.min(23, Math.max(0, Number(rawHour) || 0));
        const minute = Math.min(59, Math.max(0, Number(rawMinute) || 0));
        const overlay = document.createElement('div');
        overlay.id = 'icityTimeWheelOverlay';
        overlay.className = 'icity-time-picker-overlay';
        if ($('#icityNewAppUI')?.classList.contains('theme-night')) overlay.classList.add('theme-night');
        overlay.innerHTML = `
            <div class="icity-time-picker" role="dialog" aria-modal="true" aria-label="选择定时写日记时间">
                <div class="icity-time-picker-header">
                    <button type="button" data-icity-time-action="cancel">取消</button>
                    <div>提醒时间</div>
                    <button type="button" data-icity-time-action="confirm">完成</button>
                </div>
                <div class="icity-time-wheel-row">
                    <div class="icity-time-wheel" data-icity-time-wheel="hour"></div>
                    <div class="icity-time-separator">:</div>
                    <div class="icity-time-wheel" data-icity-time-wheel="minute"></div>
                </div>
            </div>
        `;
        const hourWheel = overlay.querySelector('[data-icity-time-wheel="hour"]');
        const minuteWheel = overlay.querySelector('[data-icity-time-wheel="minute"]');
        const createOptions = (wheel, total, selected) => {
            for (let index = 0; index < total; index += 1) {
                const option = document.createElement('button');
                option.type = 'button';
                option.className = 'icity-time-wheel-option';
                option.dataset.value = String(index).padStart(2, '0');
                option.textContent = option.dataset.value;
                option.addEventListener('click', () => {
                    wheel.scrollTo({ top: index * 44, behavior: 'smooth' });
                });
                wheel.appendChild(option);
            }
            wheel.dataset.value = String(selected).padStart(2, '0');
            requestAnimationFrame(() => { wheel.scrollTop = selected * 44; });
        };
        const syncWheel = wheel => {
            const max = wheel.querySelectorAll('.icity-time-wheel-option').length - 1;
            const index = Math.min(max, Math.max(0, Math.round(wheel.scrollTop / 44)));
            wheel.dataset.value = String(index).padStart(2, '0');
            wheel.querySelectorAll('.icity-time-wheel-option').forEach((option, optionIndex) => {
                option.classList.toggle('active', optionIndex === index);
            });
        };
        createOptions(hourWheel, 24, hour);
        createOptions(minuteWheel, 60, minute);
        [hourWheel, minuteWheel].forEach(wheel => {
            let scrollTimer = null;
            wheel.addEventListener('scroll', () => {
                clearTimeout(scrollTimer);
                scrollTimer = setTimeout(() => syncWheel(wheel), 50);
            }, { passive: true });
            syncWheel(wheel);
        });

        overlay.addEventListener('click', event => {
            if (event.target === overlay || event.target.closest('[data-icity-time-action="cancel"]')) {
                overlay.remove();
                return;
            }
            if (event.target.closest('[data-icity-time-action="confirm"]')) {
                const value = `${hourWheel.dataset.value}:${minuteWheel.dataset.value}`;
                overlay.remove();
                setIcityAutoDiaryTime(value).catch(error => {
                    if (typeof window.showToast === 'function') window.showToast(error.message);
                });
            }
        });
        const host = document.querySelector('#icityNewAppUI .icity-app-inner-container') || document.getElementById('icityNewAppUI') || document.body;
        host.appendChild(overlay);
    }

    function setupIcityPreferenceControls() {
        [viewSettings, viewAppSettings].filter(Boolean).forEach(root => {
            const skinItem = findIcitySettingItem(root, '皮肤');
            const fontItem = findIcitySettingItem(root, '日记内页字体');
            const autoDiaryItem = findIcitySettingItem(root, '每天提醒写日记') || findIcitySettingItem(root, '每天定时写日记');
            const reminderItem = findIcitySettingItem(root, '提醒时间');
            const archivedItem = findIcitySettingItem(root, '我的封存日记');

            if (skinItem) {
                const value = skinItem.querySelector('.item-value');
                if (value) value.dataset.icityPref = 'skin';
                bindIcityTap(skinItem, async () => {
                    const profile = await getProfile();
                    if (typeof window.openUniversalSelect !== 'function') return;
                    window.openUniversalSelect({
                        title: '皮肤',
                        items: [
                            { label: '白昼主题', value: 'day' },
                            { label: '黑夜主题', value: 'night' }
                        ],
                        currentValue: resolveIcityTheme(profile),
                        onSelect: value => setIcityTheme(value)
                    });
                    keepIcityDialogAboveApp();
                });
            }

            if (fontItem) {
                const value = fontItem.querySelector('.item-value');
                if (value) value.dataset.icityPref = 'font';
                bindIcityTap(fontItem, openFontManagementView);
            }

            if (archivedItem) {
                bindIcityTap(archivedItem, () => openDiaryListView('archived'));
            }

            if (autoDiaryItem) {
                const label = autoDiaryItem.querySelector('.item-label');
                const input = autoDiaryItem.querySelector('input[type="checkbox"]');
                const switchEl = autoDiaryItem.querySelector('.switch');
                if (label) label.textContent = '每天定时写日记';
                if (switchEl) switchEl.dataset.icityPref = 'auto-diary-switch';
                if (input) {
                    input.checked = false;
                    input.addEventListener('change', () => setIcityAutoDiaryEnabled(input.checked));
                }
            }

            if (reminderItem) {
                const value = reminderItem.querySelector('.item-value');
                if (value) value.dataset.icityPref = 'reminder-time';
                bindIcityTap(reminderItem, async () => {
                    const profile = await getProfile();
                    const currentTime = profile.autoDiaryTime || ICITY_DEFAULT_AUTO_DIARY_TIME;
                    openIcityTimeWheelPicker(currentTime);
                });
            }
        });
    }

    pruneIcityUnusedSettings();
    setupIcityPreferenceControls();

    const btnClearListCache = $('#btn-clear-list-cache');
    const valListCache = $('#val-list-cache');
    if (btnClearListCache && valListCache) {
        btnClearListCache.addEventListener('click', () => {
            if (valListCache.textContent === '0.0 MB') {
                showIcityFeedback('列表缓存已是最新，无需清理');
                return;
            }
            if (confirm('确定要清空列表缓存吗？')) {
                valListCache.textContent = '0.0 MB';
                showIcityFeedback('列表缓存已清空');
            }
        });
    }

    const btnClearImgCache = $('#btn-clear-img-cache');
    const valImgCache = $('#val-img-cache');
    if (btnClearImgCache && valImgCache) {
        btnClearImgCache.addEventListener('click', () => {
            if (valImgCache.textContent === '0.0 MB') {
                showIcityFeedback('图片缓存已是最新，无需清理');
                return;
            }
            if (confirm('确定要清空图片缓存吗？')) {
                valImgCache.textContent = '0.0 MB';
                showIcityFeedback('图片缓存已清空');
            }
        });
    }

    const btnSettingAutoHd = $('#btn-setting-auto-hd');
    const valSettingAutoHd = $('#val-setting-auto-hd');
    if (btnSettingAutoHd && valSettingAutoHd) {
        btnSettingAutoHd.addEventListener('click', () => {
            const options = ['不加载', '仅 Wi-Fi', '始终加载'];
            let current = valSettingAutoHd.textContent;
            let nextIdx = (options.indexOf(current) + 1) % options.length;
            valSettingAutoHd.textContent = options[nextIdx];
            saveProfileData('autoHd', options[nextIdx]); 
        });
    }

    const btnSettingUploadSize = $('#btn-setting-upload-size');
    const valSettingUploadSize = $('#val-setting-upload-size');
    if (btnSettingUploadSize && valSettingUploadSize) {
        btnSettingUploadSize.addEventListener('click', () => {
            const options = ['高清 (约600KB)', '原图', '标清 (约200KB)'];
            let current = valSettingUploadSize.textContent;
            let nextIdx = (options.indexOf(current) + 1) % options.length;
            valSettingUploadSize.textContent = options[nextIdx];
            saveProfileData('uploadSize', options[nextIdx]); 
        });
    }

    function keepIcityDialogAboveApp() {
        requestAnimationFrame(() => {
            ['customPromptOverlay', 'univSelOverlay'].forEach(id => {
                const overlay = document.getElementById(id);
                if (!overlay) return;
                if (typeof window.syncOverlayToActiveView === 'function') {
                    window.syncOverlayToActiveView(overlay);
                    return;
                }
                const iphone = document.querySelector('.iphone');
                if (!iphone) return;
                if (overlay.parentElement !== iphone) iphone.appendChild(overlay);
                overlay.style.position = 'absolute';
                overlay.style.inset = '0';
                overlay.style.width = '100%';
                overlay.style.height = '100%';
                overlay.style.zIndex = '999999';
            });
        });
    }

    async function icityShowPrompt(title, value = '', confirmText = '确定') {
        if (typeof window.showCustomPrompt !== 'function') {
            if (typeof window.showToast === 'function') window.showToast('通用输入弹窗暂不可用');
            return null;
        }
        const result = window.showCustomPrompt(title, { placeholder: title, value }, confirmText);
        keepIcityDialogAboveApp();
        return result;
    }

    function bindIcityTap(element, handler) {
        if (!element || typeof handler !== 'function') return;
        let startX = 0;
        let startY = 0;
        let isScrolling = false;
        let lastTapAt = 0;

        element.addEventListener('touchstart', (e) => {
            if (e.touches && e.touches.length > 0) {
                startX = e.touches[0].clientX;
                startY = e.touches[0].clientY;
                isScrolling = false;
            }
        }, { passive: true });

        element.addEventListener('touchmove', (e) => {
            if (e.touches && e.touches.length > 0) {
                const moveX = Math.abs(e.touches[0].clientX - startX);
                const moveY = Math.abs(e.touches[0].clientY - startY);
                if (moveX > 8 || moveY > 8) {
                    isScrolling = true;
                }
            }
        }, { passive: true });

        element.addEventListener('touchend', (e) => {
            if (isScrolling) return; // 滑动中，严格拦截，禁止触发
            const now = Date.now();
            if (now - lastTapAt < 400) return;
            lastTapAt = now;
            if (e.cancelable) e.preventDefault();
            e.stopPropagation();
            Promise.resolve(handler(e)).catch(error => console.error('Diary tap handler failed:', error));
        }, { passive: false });

        element.addEventListener('click', (e) => {
            if (isScrolling) return;
            const now = Date.now();
            if (now - lastTapAt < 400) return;
            lastTapAt = now;
            Promise.resolve(handler(e)).catch(error => console.error('Diary click handler failed:', error));
        });
    }

    // 彻底废除旧的全局强行代理 forwardTap，避免滑屏误触
    function bindIcitySettingsTapDelegation() {}

    // ================= 交互 8：真实修改资料逻辑 =================
    const btnEditAvatar = $('#btn-edit-avatar');
    const inputSettingsAvatar = $('#input-settings-avatar');
    const settingsAvatarPreview = $('#settings-avatar-preview');
    const profileAvatar = $('.avatar-wrapper'); 

    const btnEditBg = $('#btn-edit-bg');
    const inputSettingsBg = $('#input-settings-bg');
    const settingsBgPreview = $('#settings-bg-preview');
    const profileBg = $('.profile-header-bg'); 

    const btnEditNickname = $('#btn-edit-nickname');
    const settingsNicknameVal = $('#settings-nickname-val');
    const profileName = $('.user-name'); 

    if (settingsNicknameVal) {
        // 监听输入框失去焦点或回车，自动保存
        settingsNicknameVal.addEventListener('change', async (e) => {
            const newName = e.target.value.trim();
            if (newName !== '') {
                if (profileName) profileName.textContent = newName;
                await saveProfileData('nickname', newName); 
            }
        });
    }

    const btnEditBio = $('#btn-edit-bio');
    const settingsBioVal = $('#settings-bio-val');
    const profileHandle = $('.user-handle'); 

    if (btnEditAvatar && inputSettingsAvatar) {
        btnEditAvatar.addEventListener('click', () => inputSettingsAvatar.click());
        inputSettingsAvatar.addEventListener('change', function(e) {
            const file = e.target.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = function(event) {
                    const imgUrl = `url(${event.target.result})`;
                    if(settingsAvatarPreview) {
                        settingsAvatarPreview.style.backgroundImage = imgUrl;
                        settingsAvatarPreview.innerHTML = ''; 
                    }
                    if (profileAvatar) {
                        profileAvatar.style.backgroundImage = imgUrl;
                        profileAvatar.style.backgroundSize = 'cover';
                        profileAvatar.style.backgroundPosition = 'center';
                    }
                    const navAvatar = $('#tab-profile .nav-avatar');
                    if (navAvatar) {
                        navAvatar.style.backgroundImage = imgUrl;
                        navAvatar.style.backgroundSize = 'cover';
                        navAvatar.style.backgroundPosition = 'center';
                    }
                    saveProfileData('avatar', imgUrl); 
                };
                reader.readAsDataURL(file);
            }
        });
    }

    if (btnEditBg && inputSettingsBg) {
        btnEditBg.addEventListener('click', () => inputSettingsBg.click());
        inputSettingsBg.addEventListener('change', function(e) {
            const file = e.target.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = function(event) {
                    const imgUrl = `url(${event.target.result})`;
                    if(settingsBgPreview) {
                        settingsBgPreview.style.backgroundImage = imgUrl;
                        settingsBgPreview.innerHTML = ''; 
                    }
                    if (profileBg) {
                        profileBg.style.backgroundImage = imgUrl;
                        profileBg.style.backgroundSize = 'cover';
                        profileBg.style.backgroundPosition = 'center';
                    }
                    saveProfileData('bg', imgUrl); 
                };
                reader.readAsDataURL(file);
            }
        });
    }

    if (btnEditBio && settingsBioVal) {
        bindIcityTap(btnEditBio, async () => {
            const currentBio = settingsBioVal.textContent === '介绍一下自己' ? '' : settingsBioVal.textContent;
            const newBio = await icityShowPrompt('请输入关于我', currentBio);
            if (newBio !== null) {
                const finalBio = newBio.trim() === '' ? '介绍一下自己' : newBio.trim();
                settingsBioVal.textContent = finalBio;
                settingsBioVal.style.color = finalBio === '介绍一下自己' ? 'var(--text-light)' : 'var(--text-main)';
                saveProfileData('bio', finalBio); 
            }
        });
    }

    const settingsIcityIdVal = $('#settings-icity-id-val');
    if (settingsIcityIdVal) {
        settingsIcityIdVal.addEventListener('change', async (e) => {
            const profile = await getProfile();
            if (!isIcityProUser(profile)) {
                if (typeof window.showToast === 'function') window.showToast('修改 Diary ID 需要使用 Pro 转生卡');
                openVipCenterView();
                settingsIcityIdVal.value = profile.icityId || 'diary_user';
                return;
            }
            const newId = e.target.value.trim();
            if (newId !== '') {
                if (profileHandle) profileHandle.textContent = '@' + newId;
                const appSettingsId = $('#app-settings-icity-id');
                if (appSettingsId) appSettingsId.textContent = newId;
                await saveProfileData('icityId', newId);
                if (typeof window.showToast === 'function') window.showToast('Diary ID 已更新');
            }
        });
    }

    // 绑定设置页 Diary ID「转生卡」专属道具权限
    const btnRebirthPill = $('#btn-edit-icity-id .pill-btn');
    if (btnRebirthPill) {
        bindIcityTap(btnRebirthPill, async (e) => {
            e.stopPropagation();
            const profile = await getProfile();
            if (!isIcityProUser(profile)) {
                if (typeof window.showToast === 'function') {
                    window.showToast('市民档案已归档。需激活 Diary Pro 荣誉市民以获取「转生卡」，重塑全新身份。');
                }
                openVipCenterView();
                return;
            }

            const currentId = profile.icityId || 'diary_user';
            const newId = await icityShowPrompt('市民转生仪式：请输入新的 Diary ID', currentId);
            if (newId && newId.trim() && newId.trim() !== currentId) {
                const cleanId = newId.trim().replace(/^@/, '');
                await saveProfileData('icityId', cleanId);
                if (settingsIcityIdVal) settingsIcityIdVal.value = cleanId;
                if (profileHandle) profileHandle.textContent = '@' + cleanId;
                const appSettingsId = $('#app-settings-icity-id');
                if (appSettingsId) appSettingsId.textContent = cleanId;
                if (typeof window.showToast === 'function') window.showToast(`转生成功！新身份 @${cleanId} 已生效`);
                if (typeof renderAllFeeds === 'function') renderAllFeeds();
            }
        });
    }

    const btnEditEmail = $('#btn-edit-email');
    const settingsEmailVal = $('#settings-email-val');
    const bindPill = $('#settings-wechat-bind-pill');
    
    if (btnEditEmail) {
        btnEditEmail.addEventListener('click', async (e) => {
            if (e.target === settingsEmailVal || e.target === bindPill) return;
            await openIcityWechatBindingPicker(settingsEmailVal ? settingsEmailVal.value.trim() : '');
        });
    }
    
    if (settingsEmailVal) {
        settingsEmailVal.addEventListener('click', async (e) => {
            e.stopPropagation();
            await openIcityWechatBindingPicker(settingsEmailVal.value.trim());
        });
        
        settingsEmailVal.addEventListener('input', async (e) => {
            // 输入时直接调用，因为内部已经有了缓存，不会再卡顿
            await openIcityWechatBindingPicker(e.target.value.trim());
        });
    }
    
    if (bindPill) {
        bindPill.addEventListener('click', async (e) => {
            e.stopPropagation();
            const dropdown = $('#wechat-bind-dropdown');
            const manualWxid = settingsEmailVal.value.trim();
            
            if (manualWxid) {
                // 立即收回下拉框
                if (dropdown) dropdown.classList.remove('active');
                
                if (!cachedWechatAccounts) {
                    const authData = await getWechatAuthData();
                    cachedWechatAccounts = Array.isArray(authData?.accounts) ? authData.accounts : [];
                }
                const account = cachedWechatAccounts.find(a => a.wxid === manualWxid || a.name === manualWxid) || { wxid: manualWxid, name: manualWxid };
                await saveIcityWechatBinding(account);
            } else {
                // 如果输入框为空，且下拉框已经打开，点击按钮则收回下拉框
                if (dropdown && dropdown.classList.contains('active')) {
                    dropdown.classList.remove('active');
                } else {
                    await openIcityWechatBindingPicker('');
                }
            }
        });
    }

    const btnEditGender = $('#btn-edit-gender');
    const settingsGenderVal = $('#settings-gender-val');
    if (btnEditGender && settingsGenderVal) {
        bindIcityTap(btnEditGender, async () => {
            if (typeof window.openUniversalSelect !== 'function') return;
            const currentGender = normalizeIcityGender(settingsGenderVal.textContent);
            window.openUniversalSelect({
                title: '性别',
                items: [
                    { label: '男', value: '男' },
                    { label: '女', value: '女' },
                    { label: '保密', value: '保密' }
                ],
                currentValue: currentGender,
                searchable: false,
                onSelect: async value => {
                    const gender = normalizeIcityGender(value);
                    settingsGenderVal.textContent = gender;
                    await saveProfileData('gender', gender);
                }
            });
            keepIcityDialogAboveApp();
        });
    }

    const btnEditLocation = $('#btn-edit-location');
    const settingsLocationVal = $('#settings-location-val');
    const profileLocation = $('.user-location'); 
    if (btnEditLocation && settingsLocationVal) {
        bindIcityTap(btnEditLocation, async () => {
            const currentLocation = settingsLocationVal.textContent === '可选' ? '' : settingsLocationVal.textContent;
            const newLocation = await icityShowPrompt('请输入所在地', currentLocation);
            if (newLocation !== null) {
                const finalLocation = newLocation.trim() === '' ? '可选' : newLocation.trim();
                settingsLocationVal.textContent = finalLocation;
                settingsLocationVal.style.color = finalLocation === '可选' ? 'var(--text-light)' : 'var(--text-main)';
                
                if (profileLocation && finalLocation !== '可选') {
                    profileLocation.innerHTML = '<svg viewBox="0 0 24 24"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"></path></svg> ' + finalLocation;
                }
                saveProfileData('location', finalLocation); 
            }
        });
    }
    // ================= 统一编辑器与真实发布逻辑 =================
    function loadDiariesToModal() {
        const diaryScrollArea = $('#modal-diary .diary-scroll-area');
        if(!diaryScrollArea) return;
        
        const newBtnHtml = `
            <div class="diary-item-wrapper" id="modal-btn-create-diary">
                <div class="diary-book diary-new">
                    <div class="plus-circle">+</div>
                    <div class="text">新建<br>日记本</div>
                </div>
                <div style="height: 18px;"></div>
            </div>
        `;
        diaryScrollArea.innerHTML = newBtnHtml;
        
        const modalBtnCreateDiary = $('#modal-btn-create-diary');
        if(modalBtnCreateDiary) {
            modalBtnCreateDiary.addEventListener('click', () => {
                const modalDiary = $('#modal-diary');
                const createDiaryModal = $('#create-diary-modal');
                if(modalDiary) modalDiary.classList.remove('active');
                if(createDiaryModal) createDiaryModal.classList.add('active');
            });
        }

        getDiaries().then(async (diaries) => {
            const allFeeds = await getFeeds();
            const boundFeeds = await ensureIcityDiaryBookBindings(diaries, allFeeds);
            diaries.forEach(diary => {
                const count = boundFeeds.filter(p => String(p?.diaryId || '') === String(diary.id)).length;
                const vis = normalizeIcityVisibility(diary.visibility);
                let visSvg = '';
                if (vis === '私人' || vis === '仅自己') {
                    visSvg = '<svg viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg>';
                } else if (vis === '仅好友可见') {
                    visSvg = '<svg viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor" stroke-width="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>';
                } else {
                    visSvg = '<svg viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"></circle><line x1="2" y1="12" x2="22" y2="12"></line><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path></svg>';
                }

                const div = document.createElement('div');
                div.className = 'diary-item-wrapper diary-selectable';
                div.dataset.name = diary.name;
                div.dataset.id = String(diary.id);
                div.innerHTML = `
                    <div class="diary-book diary-blue" style="background: ${escapeIcityHtml(getIcitySafeCoverBackground(diary.coverBg))}; position: relative;">
                        <div class="bottom-info" style="position: absolute; bottom: 8px; left: 8px; right: 8px; display: flex; justify-content: space-between; align-items: center; font-size: 11px; opacity: 0.95; color: #FFFFFF; font-weight: 600;">
                            <span>${count}</span>
                            <span style="display: flex; align-items: center;">${visSvg}</span>
                        </div>
                    </div>
                    <div class="radio-circle"></div>
                `;
                
                div.addEventListener('click', function() {
                    $$('.diary-selectable').forEach(el => el.classList.remove('selected'));
                    this.classList.add('selected');
                    window.tempSelectedDiary = this.dataset.name;
                    window.tempSelectedDiaryId = this.dataset.id;
                    const statusText = $('#diary-status-text');
                    if(statusText) {
                        statusText.textContent = `已选择：${window.tempSelectedDiary}`;
                        statusText.style.color = 'var(--text-main)';
                    }
                });
                diaryScrollArea.appendChild(div);
            });
        });
    }
    

    function getIcityPostOccurredAt(post) {
        const candidates = [post?.occurredAt, post?.createdAt, post?.id];
        const value = candidates.map(item => Number(item)).find(item => Number.isFinite(item) && item > 0);
        return value || 0;
    }

    function getIcityDateObject(timestamp) {
        const value = Number(timestamp);
        return Number.isFinite(value) && value > 0 ? new Date(value) : new Date(NaN);
    }

    function getIcityDateKey(timestamp) {
        const value = Number(timestamp);
        if (!Number.isFinite(value) || value <= 0) return '';
        const date = new Date(value);
        if (Number.isNaN(date.getTime())) return '';
        return date.getFullYear() + '-' + String(date.getMonth() + 1).padStart(2, '0') + '-' + String(date.getDate()).padStart(2, '0');
    }

    function getIcityMonthKey(timestamp) {
        const value = Number(timestamp);
        if (!Number.isFinite(value) || value <= 0) return '';
        const date = new Date(value);
        if (Number.isNaN(date.getTime())) return '';
        return date.getFullYear() + '-' + String(date.getMonth() + 1).padStart(2, '0');
    }

    function getIcityBirthdayStart(profile) {
        const raw = String(profile?.birthDate || '').trim();
        const match = raw.match(/^(\d{4})-(\d{2})-(\d{2})$/);
        if (match) return new Date(Number(match[1]), Number(match[2]) - 1, Number(match[3])).getTime();
        const parsed = Date.parse(raw);
        return Number.isFinite(parsed) ? new Date(new Date(parsed).getFullYear(), new Date(parsed).getMonth(), new Date(parsed).getDate()).getTime() : null;
    }

    function setIcityDiaryDateInputs(control, timestamp) {
        const dateInput = control?.querySelector('.icity-retroactive-date');
        const timeInput = control?.querySelector('.icity-retroactive-time');
        if (!dateInput || !timeInput) return;
        const date = new Date(Number(timestamp));
        if (Number.isNaN(date.getTime())) return;
        dateInput.value = getIcityDateKey(date.getTime());
        timeInput.value = String(date.getHours()).padStart(2, '0') + ':' + String(date.getMinutes()).padStart(2, '0');
    }

    function updateIcityDiaryDateControl(control) {
        if (!control) return;
        control.hidden = true;
        control.style.display = 'none';
        const editor = control.closest('.editor-wrapper');
        const textarea = editor?.querySelector('.editor-textarea');
        if (!textarea) return;
        const isCalendarDraft = control.dataset.calendarDraft === 'true';
        if (!isCalendarDraft) {
            textarea.placeholder = '写点什么吧';
            return;
        }
        const dateInput = control.querySelector('.icity-retroactive-date');
        if (dateInput && dateInput.value) {
            const parts = dateInput.value.split('-').map(Number);
            textarea.placeholder = (parts.length === 3 && parts.every(Number.isFinite))
                ? `补写 ${parts[0]}年${parts[1]}月${parts[2]}日`
                : '补写日记...';
        }
    }

    function ensureIcityDiaryDateControl(editor) {
        if (!editor) return null;
        const textarea = editor.querySelector('.editor-textarea');
        if (!textarea) return null;
        let control = editor.querySelector('.icity-diary-date-control');
        if (control) return control;

        control = document.createElement('div');
        control.className = 'icity-diary-date-control';
        control.style.display = 'none'; // 彻底隐藏外显条，由 placeholder 表达
        control.hidden = true;
        control.innerHTML = '<input type="date" class="icity-retroactive-date" aria-hidden="true" tabindex="-1">' +
            '<input type="time" class="icity-retroactive-time" aria-hidden="true" tabindex="-1">';
        textarea.insertAdjacentElement('afterend', control);
        setIcityDiaryDateInputs(control, Date.now());

        // 为编辑器底栏的 .btn-ai-draft-action 绑定 AI 整理功能
        const aiDraftBtn = editor.querySelector('.btn-ai-draft-action');
        if (aiDraftBtn && !aiDraftBtn.dataset.bound) {
            aiDraftBtn.dataset.bound = 'true';
            aiDraftBtn.addEventListener('click', async (event) => {
                event.preventDefault();
                event.stopPropagation();
                const source = String(textarea.value || '').trim();
                if (!source) {
                    showIcityFeedback('先写一点日记素材，再整理成草稿');
                    return;
                }
                aiDraftBtn.style.opacity = '0.4';
                aiDraftBtn.style.pointerEvents = 'none';
                try {
                    const api = await getConnectedIcityApi();
                    const prompt = [
                        '请把用户提供的日记素材整理成一篇自然、清晰的 Diary 日记草稿。',
                        '只使用素材中明确出现的事实，不得补充或推断重要事实，不得虚构人物、时间、地点或事件。',
                        '只输出 JSON，不要 Markdown。格式：{"draft":"整理后的日记"}',
                        '用户素材：' + source.slice(0, 5000)
                    ].join('\n');
                    const content = await requestIcityChatCompletion(api, [
                        { role: 'system', content: '你是 Diary 日记草稿整理器，只输出结构化 JSON。' },
                        { role: 'user', content: prompt }
                    ], { temperature: 0.45, emptyMessage: 'API 没有返回日记草稿' });
                    const parsed = parseIcityJsonObject(content);
                    const draft = String(parsed?.draft || '').trim() || String(content || '').trim();
                    if (!draft) throw new Error('AI 没有返回可用的日记草稿');
                    textarea.value = draft;
                    textarea.dispatchEvent(new Event('input', { bubbles: true }));
                    if (typeof window.showToast === 'function') window.showToast('已整理为草稿，请确认后再发布');
                } catch (error) {
                    showIcityFeedback(error?.message || '日记草稿整理失败');
                } finally {
                    aiDraftBtn.style.opacity = '1';
                    aiDraftBtn.style.pointerEvents = 'auto';
                }
            });
        }
        return control;
    }

    function setIcityDiaryDateControl(editor, post) {
        const control = ensureIcityDiaryDateControl(editor);
        if (!control) return;
        const occurrence = getIcityPostOccurredAt(post);
        const created = Number(post?.createdAt || post?.id || occurrence);
        control.dataset.calendarDraft = post?.isRetroactive === true || getIcityDateKey(occurrence) !== getIcityDateKey(created) ? 'true' : 'false';
        setIcityDiaryDateInputs(control, occurrence);
        updateIcityDiaryDateControl(control);
    }

    function resetIcityDiaryDateControl(editor) {
        const control = ensureIcityDiaryDateControl(editor);
        if (!control) return;
        control.dataset.calendarDraft = 'false';
        setIcityDiaryDateInputs(control, Date.now());
        updateIcityDiaryDateControl(control);
    }

    async function resolveIcityDiaryTiming(editor, existingPost) {
        const control = ensureIcityDiaryDateControl(editor);
        if (control?.dataset.calendarDraft !== 'true') {
            const occurredAt = existingPost ? getIcityPostOccurredAt(existingPost) : Date.now();
            const isRetro = existingPost?.isRetroactive === true || getIcityDateKey(occurredAt) !== getIcityDateKey(Number(existingPost?.createdAt || existingPost?.id || occurredAt));
            if (isRetro && !isIcityProUser(await getProfile())) {
                throw new Error('时光机补写历史日记为 Diary Pro 荣誉市民专享特权');
            }
            return {
                occurredAt,
                isRetroactive: isRetro
            };
        }

        const profile = await getProfile();
        if (!isIcityProUser(profile)) {
            openVipCenterView();
            throw new Error('时光机补写历史日记为 Diary Pro 荣誉市民专享特权');
        }

        const dateValue = control.querySelector('.icity-retroactive-date')?.value || '';
        const timeValue = control.querySelector('.icity-retroactive-time')?.value || '';
        const dateParts = dateValue.split('-').map(Number);
        const timeParts = timeValue.split(':').map(Number);
        if (dateParts.length !== 3 || dateParts.some(value => !Number.isFinite(value)) || timeParts.length < 2 || timeParts.some(value => !Number.isFinite(value))) {
            throw new Error('请选择有效的补写日期和时间');
        }
        const occurredAt = new Date(dateParts[0], dateParts[1] - 1, dateParts[2], timeParts[0], timeParts[1], 0, 0).getTime();
        if (!Number.isFinite(occurredAt)) throw new Error('请选择有效的补写日期和时间');
        if (occurredAt > Date.now()) throw new Error('补写日期不能晚于今天');
        const birthdayStart = getIcityBirthdayStart(await getProfile());
        if (birthdayStart !== null && occurredAt < birthdayStart) throw new Error('补写日期不能早于生日卡日期');
        return { occurredAt, isRetroactive: getIcityDateKey(occurredAt) !== getIcityDateKey(Date.now()) };
    }

    async function openIcityCalendarDiaryComposer(dateKey) {
        const dateParts = String(dateKey || '').split('-').map(Number);
        if (dateParts.length !== 3 || dateParts.some(value => !Number.isFinite(value))) return;
        const selectedAt = new Date(dateParts[0], dateParts[1] - 1, dateParts[2], 12, 0, 0, 0).getTime();
        if (!Number.isFinite(selectedAt)) return;
        if (selectedAt > Date.now()) {
            showIcityBadgeToast('只能补写今天或过去的日期');
            return;
        }
        const birthdayStart = getIcityBirthdayStart(await getProfile());
        if (birthdayStart !== null && selectedAt < birthdayStart) {
            showIcityBadgeToast('补写日期不能早于生日卡日期');
            return;
        }

        const modal = $('#publish-modal');
        if (!modal) return;
        window.editingPostId = null;
        const editor = modal.querySelector('.editor-wrapper') || modal;
        const textarea = modal.querySelector('.editor-textarea');
        const titleInput = modal.querySelector('.modal-title-input');
        if (textarea) textarea.value = '';
        if (titleInput) titleInput.value = '';
        clearIcityEditorImages(editor);
        const clearLocation = modal.querySelector('.clear-loc-btn');
        if (clearLocation) clearLocation.click();
        const diaryLabel = modal.querySelector('.display-diary');
        const diaryButton = modal.querySelector('.btn-diary');
        if (diaryLabel) diaryLabel.textContent = '';
        if (diaryButton) diaryButton.classList.remove('active');

        const control = ensureIcityDiaryDateControl(editor);
        if (control) {
            control.dataset.calendarDraft = 'true';
            setIcityDiaryDateInputs(control, selectedAt);
            updateIcityDiaryDateControl(control);
        }
        if (textarea) {
            textarea.placeholder = `补写 ${dateParts[0]}年${dateParts[1]}月${dateParts[2]}日`;
        }
        modal.classList.add('active');
        setTimeout(() => textarea?.focus(), 80);
    }

    function getIcityEditorImages(editor) {
        if (!editor) return [];
        if (Array.isArray(editor.__icityImages)) {
            return editor.__icityImages.slice(0, 9);
        }
        const legacyImage = editor.querySelector('.preview-img')?.getAttribute('src') || '';
        return isIcityRenderableImage(legacyImage) ? [legacyImage] : [];
    }

    function getIcityEditorLayout(editor) {
        const allowed = ['single-column', 'two-column', 'three-column', 'horizontal'];
        const select = editor?.querySelector('.icity-image-layout-select');
        const layout = String(select?.value || editor?.__icityImageLayout || 'single-column');
        return allowed.includes(layout) ? layout : 'single-column';
    }

    function updateIcityImageLayoutControl(editor) {
        const control = editor?.querySelector('.icity-image-layout-control');
        if (!control) return;
        control.style.display = getIcityEditorImages(editor).length ? 'flex' : 'none';
    }

    function renderIcityEditorImagePreview(editor) {
        const area = editor?.querySelector('.image-preview-area');
        if (!area) return;
        const legacyImg = area.querySelector('.preview-img');
        const legacyRemove = area.querySelector('.remove-img-btn');
        const images = getIcityEditorImages(editor);
        const camera = editor.querySelector('.btn-camera');
        if (camera) camera.classList.toggle('active', images.length > 0);
        area.classList.toggle('icity-multi-image-area', images.length > 0);
        if (!images.length) {
            area.style.display = 'none';
            if (legacyImg) {
                legacyImg.src = '';
                legacyImg.style.display = '';
            }
            if (legacyRemove) legacyRemove.style.display = '';
            area.querySelector('.icity-multi-image-preview')?.remove();
            updateIcityImageLayoutControl(editor);
            return;
        }

        area.style.display = 'block';
        if (legacyImg) legacyImg.style.display = 'none';
        if (legacyRemove) legacyRemove.style.display = 'none';
        let preview = area.querySelector('.icity-multi-image-preview');
        if (!preview) {
            preview = document.createElement('div');
            preview.className = 'icity-multi-image-preview';
            area.appendChild(preview);
        }
        preview.dataset.layout = getIcityEditorLayout(editor);
        preview.innerHTML = images.map((src, index) =>
            '<div class="icity-editor-image-item">' +
                '<img src="' + escapeIcityHtml(src) + '" alt="已选图片">' +
                '<div class="icity-editor-image-actions">' +
                    '<button type="button" data-image-up="' + index + '" aria-label="上移">↑</button>' +
                    '<button type="button" data-image-down="' + index + '" aria-label="下移">↓</button>' +
                    '<button type="button" data-image-remove="' + index + '" aria-label="删除">×</button>' +
                '</div>' +
            '</div>'
        ).join('') + '<button type="button" class="icity-image-add-button" data-image-add="true">添加图片</button>';

        preview.querySelectorAll('[data-image-remove]').forEach(button => {
            button.addEventListener('click', event => {
                event.preventDefault();
                event.stopPropagation();
                const index = Number(button.dataset.imageRemove);
                editor.__icityImages.splice(index, 1);
                renderIcityEditorImagePreview(editor);
            });
        });
        preview.querySelectorAll('[data-image-up]').forEach(button => {
            button.addEventListener('click', event => {
                event.preventDefault();
                event.stopPropagation();
                const index = Number(button.dataset.imageUp);
                if (index > 0) {
                    const images = editor.__icityImages;
                    [images[index - 1], images[index]] = [images[index], images[index - 1]];
                    renderIcityEditorImagePreview(editor);
                }
            });
        });
        preview.querySelectorAll('[data-image-down]').forEach(button => {
            button.addEventListener('click', event => {
                event.preventDefault();
                event.stopPropagation();
                const index = Number(button.dataset.imageDown);
                const images = editor.__icityImages;
                if (index >= 0 && index < images.length - 1) {
                    [images[index], images[index + 1]] = [images[index + 1], images[index]];
                    renderIcityEditorImagePreview(editor);
                }
            });
        });
        const addButton = preview.querySelector('[data-image-add]');
        if (addButton) {
            addButton.addEventListener('click', event => {
                event.preventDefault();
                event.stopPropagation();
                editor.querySelector('.input-camera')?.click();
            });
        }
        updateIcityImageLayoutControl(editor);
    }

    function ensureIcityImageLayoutControl(editor) {
        if (!editor) return null;
        let control = editor.querySelector('.icity-image-layout-control');
        if (control) return control;
        const area = editor.querySelector('.image-preview-area');
        if (!area) return null;
        control = document.createElement('label');
        control.className = 'icity-image-layout-control';
        control.innerHTML = '<span>图片版式</span><select class="icity-image-layout-select">' +
            '<option value="single-column">单列竖排</option>' +
            '<option value="two-column">双列</option>' +
            '<option value="three-column">三列</option>' +
            '<option value="horizontal">横排平铺</option>' +
            '</select>';
        area.insertAdjacentElement('afterend', control);
        const select = control.querySelector('.icity-image-layout-select');
        if (select) {
            select.value = editor.__icityImageLayout || 'single-column';
            select.addEventListener('change', () => {
                editor.__icityImageLayout = select.value;
                renderIcityEditorImagePreview(editor);
            });
        }
        updateIcityImageLayoutControl(editor);
        return control;
    }

    function setIcityEditorImages(editor, images, layout) {
        if (!editor) return;
        const nextImages = (Array.isArray(images) ? images : [])
            .map(item => String(item || '').trim())
            .filter(isIcityRenderableImage)
            .slice(0, 9);
        editor.__icityImages = nextImages;
        editor.__icityImageLayout = getIcityImageLayout({ imageLayout: layout || editor.__icityImageLayout });
        const select = editor.querySelector('.icity-image-layout-select');
        if (select) select.value = editor.__icityImageLayout;
        renderIcityEditorImagePreview(editor);
    }

    function clearIcityEditorImages(editor) {
        if (!editor) return;
        editor.__icityImages = [];
        editor.__icityImageLayout = 'single-column';
        const input = editor.querySelector('.input-camera');
        if (input) input.value = '';
        const select = editor.querySelector('.icity-image-layout-select');
        if (select) select.value = 'single-column';
        renderIcityEditorImagePreview(editor);
    }

    function readIcityImageFile(file) {
        return new Promise((resolve, reject) => {
            if (!file || !String(file.type || '').startsWith('image/')) {
                reject(new Error('请选择有效的图片文件'));
                return;
            }
            const reader = new FileReader();
            reader.onload = event => {
                const source = String(event.target?.result || '');
                const image = new Image();
                image.onload = () => {
                    const maxDimension = 2048;
                    const sourceWidth = image.naturalWidth || image.width;
                    const sourceHeight = image.naturalHeight || image.height;
                    const scale = Math.min(1, maxDimension / Math.max(sourceWidth, sourceHeight));
                    const width = Math.max(1, Math.round(sourceWidth * scale));
                    const height = Math.max(1, Math.round(sourceHeight * scale));
                    const canvas = document.createElement('canvas');
                    canvas.width = width;
                    canvas.height = height;
                    const context = canvas.getContext('2d');
                    if (!context) {
                        resolve(source);
                        return;
                    }
                    context.drawImage(image, 0, 0, width, height);
                    const outputType = String(file.type || '').toLowerCase() === 'image/png' && scale === 1
                        ? 'image/png'
                        : 'image/jpeg';
                    const compressed = canvas.toDataURL(outputType, outputType === 'image/jpeg' ? 0.82 : undefined);
                    resolve(compressed.length < source.length ? compressed : source);
                };
                image.onerror = () => reject(new Error('图片解码失败'));
                image.src = source;
            };
            reader.onerror = () => reject(new Error('图片读取失败'));
            reader.readAsDataURL(file);
        });
    }

    let currentActiveEditor = null; 
    
    $$('.editor-wrapper').forEach(editor => {
        const btnCamera = editor.querySelector('.btn-camera');
        const inputCamera = editor.querySelector('.input-camera');
        const previewArea = editor.querySelector('.image-preview-area');
        const previewImg = editor.querySelector('.preview-img');
        const btnRemoveImg = editor.querySelector('.remove-img-btn');
        
        const btnLocation = editor.querySelector('.btn-location');
        const locDisplay = editor.querySelector('.selected-location-display');
        const locText = editor.querySelector('.location-text-top');
        const clearLocBtn = editor.querySelector('.clear-loc-btn');
        
        const btnDiary = editor.querySelector('.btn-diary');
        const displayDiary = editor.querySelector('.display-diary');
        
        const btnSend = editor.querySelector('.btn-send');
        const textarea = editor.querySelector('.editor-textarea');
        ensureIcityDiaryDateControl(editor);
        ensureIcityImageLayoutControl(editor);
        renderIcityEditorImagePreview(editor);

        const publicStatus = editor.querySelector('.public-status');
        if (publicStatus) {
            const statusOptions = [
                {
                    text: '公开',
                    svg: `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M12 21a9.004 9.004 0 0 0 8.716-6.747M12 21a9.004 9.004 0 0 1-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 0 1 7.843 4.582M12 3a8.997 8.997 0 0 0-7.843 4.582m15.686 0A11.953 11.953 0 0 1 12 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0 1 21 12c0 .778-.099 1.533-.284 2.253m0 0A17.919 17.919 0 0 1 12 16.5c-3.162 0-6.133-.815-8.716-2.247m0 0A9.015 9.015 0 0 1 3 12c0-1.605.42-3.113 1.157-4.418" /></svg>`
                },
                {
                    text: '仅好友可见',
                    svg: `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z" /></svg>`
                },
                {
                    text: '私人',
                    svg: `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" /></svg>`
                }
            ];
            publicStatus.style.cursor = 'pointer';
            publicStatus.addEventListener('click', () => {
                openIcityVisibilityPicker(publicStatus.dataset.visibility || publicStatus.textContent, value => {
                    updateIcityVisibilityButton(publicStatus, value);
                });
            });
            updateIcityVisibilityButton(publicStatus, publicStatus.dataset.visibility || publicStatus.textContent || '公开');
        }

        if(btnCamera && inputCamera) {
            btnCamera.addEventListener('click', () => inputCamera.click());
            inputCamera.multiple = true;
            inputCamera.addEventListener('change', async (e) => {
                const files = Array.from(e.target.files || []).filter(file => file.type.startsWith('image/'));
                if (!files.length) return;
                const currentImages = getIcityEditorImages(editor);
                const remaining = Math.max(0, 9 - currentImages.length);
                if (files.length > remaining) {
                    showIcityFeedback('单篇日记最多选择 9 张图片');
                }
                const nextFiles = files.slice(0, remaining);
                try {
                    const loadedImages = await Promise.all(nextFiles.map(readIcityImageFile));
                    editor.__icityImages = currentImages.concat(loadedImages.filter(isIcityRenderableImage)).slice(0, 9);
                    renderIcityEditorImagePreview(editor);
                } catch (error) {
                    showIcityFeedback('图片读取失败，请重试');
                } finally {
                    inputCamera.value = '';
                }
            });
            btnRemoveImg.addEventListener('click', () => {
                clearIcityEditorImages(editor);
            });
        }

        if(btnLocation) {
            btnLocation.addEventListener('click', () => {
                currentActiveEditor = editor;
                const modalLocation = $('#modal-location');
                if(modalLocation) {
                    modalLocation.classList.add('active');
                    setTimeout(() => { initMap(); if(map) map.invalidateSize(); }, 250);
                }
            });
            clearLocBtn.addEventListener('click', () => {
                locText.textContent = '';
                locDisplay.style.display = 'none';
                btnLocation.classList.remove('active');
            });
        }

        if(btnDiary) {
            btnDiary.addEventListener('click', () => {
                currentActiveEditor = editor;
                loadDiariesToModal(); 
                const modalDiary = $('#modal-diary');
                if(modalDiary) modalDiary.classList.add('active');
            });
        }

        if(btnSend) {
            btnSend.addEventListener('click', async () => {
                const text = textarea.value.trim();
                const images = getIcityEditorImages(editor);
                const imgSrc = images[0] || '';
                const hasImg = images.length > 0;
                const loc = locText.textContent;
                const diary = displayDiary.textContent;

                if (!text && !hasImg) {
                    showIcityFeedback('写点什么或者发张图片吧！');
                    return;
                }

                if (editor.dataset.submitting === 'true') return;
                editor.dataset.submitting = 'true';
                btnSend.disabled = true;
                try {
                const boundWechatAccount = await ensureIcityWechatBoundForPosting();
                if (!boundWechatAccount) return;

                let existingPost = null;
                if (window.editingPostId) {
                    const currentFeeds = await getFeeds();
                    existingPost = currentFeeds.find(post => post.id == window.editingPostId) || null;
                }
                let diaryTiming;
                try {
                    diaryTiming = await resolveIcityDiaryTiming(editor, existingPost);
                } catch (error) {
                    showIcityFeedback(error?.message || '日记时间无效');
                    return;
                }

                const createdAt = Date.now();
                const now = new Date(diaryTiming.occurredAt);
                const hours = String(now.getHours()).padStart(2, '0');
                const minutes = String(now.getMinutes()).padStart(2, '0');
                const timeString = `${hours}:${minutes}`;

                const visibilityText = normalizeIcityVisibility(editor.querySelector('.public-status')?.dataset.visibility || editor.querySelector('.public-status')?.textContent || '公开');
                const userNameEl = $('.user-name');
                const userHandleEl = $('.user-handle');

                const isDetailEditor = editor.id === 'inline-editor-detail' || (viewDiaryDetail && viewDiaryDetail.classList.contains('active'));
                const defaultDiaryId = (isDetailEditor && window.currentDiaryBook) ? String(window.currentDiaryBook.id) : '';
                const defaultDiaryName = (isDetailEditor && window.currentDiaryBook) ? String(window.currentDiaryBook.name) : '';
                const finalDiaryId = window.tempSelectedDiaryId || defaultDiaryId || '';
                const finalDiaryName = diary || defaultDiaryName || '';

                const post = {
                    id: createdAt,
                    createdAt: createdAt,
                    occurredAt: diaryTiming.occurredAt,
                    isRetroactive: diaryTiming.isRetroactive,
                    text: text,
                    img: imgSrc,
                    images: images,
                    imageLayout: getIcityEditorLayout(editor),
                    location: loc,
                    diary: finalDiaryName,
                    diaryId: finalDiaryId,
                    time: timeString,
                    visibility: visibilityText,
                    handle: boundWechatAccount.wxid ? '@' + boundWechatAccount.wxid : (userHandleEl ? userHandleEl.textContent : '@me'),
                    user: boundWechatAccount.name || (userNameEl ? userNameEl.textContent : 'Diary'),
                    avatar: boundWechatAccount.avatar || '',
                    authorWechatId: boundWechatAccount.wxid || '',
                    authorWechatName: boundWechatAccount.name || '',
                    authorWechatAvatar: boundWechatAccount.avatar || '',
                    authorType: 'user'
                };

                let savedPost = null;
                if (window.editingPostId) {
                    let feeds = await getFeeds();
                    const index = feeds.findIndex(p => p.id == window.editingPostId);
                    if (index !== -1) {
                        feeds[index].text = text;
                        feeds[index].img = imgSrc;
                        feeds[index].images = images;
                        feeds[index].imageLayout = getIcityEditorLayout(editor);
                        feeds[index].location = loc;
                        feeds[index].diary = finalDiaryName || feeds[index].diary;
                        feeds[index].diaryId = finalDiaryId || feeds[index].diaryId || '';
                        feeds[index].createdAt = Number(feeds[index].createdAt || feeds[index].id || createdAt);
                        feeds[index].occurredAt = diaryTiming.occurredAt;
                        feeds[index].isRetroactive = diaryTiming.isRetroactive;
                        feeds[index].time = timeString;
                        feeds[index].visibility = visibilityText;
                        feeds[index].user = boundWechatAccount.name || feeds[index].user;
                        feeds[index].handle = boundWechatAccount.wxid ? '@' + boundWechatAccount.wxid : feeds[index].handle;
                        feeds[index].avatar = boundWechatAccount.avatar || feeds[index].avatar || '';
                        feeds[index].authorWechatId = boundWechatAccount.wxid || feeds[index].authorWechatId || '';
                        feeds[index].authorWechatName = boundWechatAccount.name || feeds[index].authorWechatName || '';
                        feeds[index].authorWechatAvatar = boundWechatAccount.avatar || feeds[index].authorWechatAvatar || '';
                        feeds[index].authorType = 'user';
                        await saveFeed(feeds[index]);
                        savedPost = feeds[index];
                    }
                    window.editingPostId = null;
                    
                    const viewSinglePost = $('#view-single-post');
                    if (viewSinglePost && viewSinglePost.classList.contains('active')) {
                        const singlePostText = $('#single-post-text');
                        if(singlePostText) singlePostText.textContent = text;
                        const imgContainer = $('#single-post-img-container');
                        if(imgContainer) {
                            imgContainer.innerHTML = renderIcityFeedImage(feeds[index]);
                        }
                    }
                } else {
                    await saveFeed(post);
                    savedPost = post;
                }

                if (!savedPost) throw new Error('日记保存失败，请保留草稿后重试');
                observeIcityDiaryMemoryEvent(savedPost);
                window.editingPostId = null;

                // 移除发布日记后自动调取 API 生成评论互动，改由详情页小飞机手动按需触发
                renderAllFeeds();
                if (window.currentDiaryBook && viewDiaryDetail && viewDiaryDetail.classList.contains('active')) {
                    renderIcityDiaryBookDetail(window.currentDiaryBook, currentIcityDiaryBookTab).catch(error => console.error('Failed to refresh diary book after post save', error));
                }

                textarea.value = '';
                clearIcityEditorImages(editor);
                if(clearLocBtn) clearLocBtn.click();
                displayDiary.textContent = '';
                btnDiary.classList.remove('active');
                resetIcityDiaryDateControl(editor);
                
                editor.classList.remove('expanded');
                const publishModal = $('#publish-modal');
                if(publishModal) publishModal.classList.remove('active');
            } catch (error) {
                console.error('Diary post save failed:', error);
                if (typeof window.showToast === 'function') window.showToast(error?.message || '日记保存失败，草稿已保留');
            } finally {
                delete editor.dataset.submitting;
                btnSend.disabled = false;
            }
            });
        }
    });

    // 3. 全局位置弹窗逻辑
    let map = null, marker = null, searchTimeout = null;

    function initMap() {
        if (typeof L === 'undefined') {
            const mapArea = $('#real-map');
            if (mapArea) mapArea.innerHTML = '<div style="display:flex; height:100%; justify-content:center; align-items:center; color:#888; font-size:14px; background:#EAE6DF;">正在重新加载地图引擎...</div>';
            
            const script = document.createElement('script');
            script.src = 'https://npm.elemecdn.com/leaflet@1.9.4/dist/leaflet.js';
            script.onload = () => {
                if (mapArea) mapArea.innerHTML = ''; 
                buildMap(); 
            };
            script.onerror = () => {
                if (mapArea) mapArea.innerHTML = '<div style="display:flex; height:100%; justify-content:center; align-items:center; color:#888; font-size:14px; background:#EAE6DF;">地图加载失败，请检查网络或运行环境</div>';
            };
            document.head.appendChild(script);
            return; 
        }
        buildMap();
    }

    function buildMap() {
        if (map) return; 
        const realMapEl = $('#real-map');
        if(!realMapEl) return;
        map = L.map(realMapEl).setView([39.9042, 116.4074], 12);
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(map);
        
        const avatarEl = $('.avatar-wrapper');
        let bgImage = 'linear-gradient(to bottom right, #888, #ccc)';
        if (avatarEl && avatarEl.style.backgroundImage) {
            bgImage = avatarEl.style.backgroundImage;
        }
        
        const userAvatarIcon = L.divIcon({
            className: 'custom-pin',
            html: `<div style="width: 32px; height: 32px; border-radius: 50%; border: 2px solid white; box-shadow: 0 2px 6px rgba(0,0,0,0.3); background-image: ${bgImage}; background-size: cover; background-position: center; transform: translate(-8px, -16px);"></div>`,
            iconSize: [16, 16], iconAnchor: [8, 16]
        });

        marker = L.marker([39.9042, 116.4074], {icon: userAvatarIcon}).addTo(map);
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (pos) => {
                    map.setView([pos.coords.latitude, pos.coords.longitude], 14);
                    marker.setLatLng([pos.coords.latitude, pos.coords.longitude]);
                }, () => {}
            );
        }
    }

    $$('.close-location').forEach(btn => btn.addEventListener('click', () => {
        const modalLocation = $('#modal-location');
        if(modalLocation) modalLocation.classList.remove('active');
    }));
    
    function selectLocation(name, lat, lon) {
        if(currentActiveEditor) {
            const locText = currentActiveEditor.querySelector('.location-text-top');
            const locDisplay = currentActiveEditor.querySelector('.selected-location-display');
            const btnLoc = currentActiveEditor.querySelector('.btn-location');
            
            if (name) {
                if(locText) locText.textContent = name;
                if(locDisplay) locDisplay.style.display = 'flex';
                if(btnLoc) btnLoc.classList.add('active');
                if (lat && lon && map) {
                    map.setView([lat, lon], 15);
                    marker.setLatLng([lat, lon]);
                }
            } else {
                if(locText) locText.textContent = '';
                if(locDisplay) locDisplay.style.display = 'none';
                if(btnLoc) btnLoc.classList.remove('active');
            }
        }
        const modalLocation = $('#modal-location');
        if(modalLocation) modalLocation.classList.remove('active');
    }

    const locSelectableEmpty = $('.loc-selectable[data-name=""]');
    if(locSelectableEmpty) locSelectableEmpty.addEventListener('click', () => selectLocation(''));
    
    const locSearchInput = $('#loc-search-input');
    if(locSearchInput) {
        locSearchInput.addEventListener('input', (e) => {
            clearTimeout(searchTimeout);
            const query = e.target.value.trim();
            const searchResults = $('#search-results');
            if(!searchResults) return;
            const defaultOption = `<div class="loc-item loc-selectable" data-name=""><div class="loc-title" style="color: var(--theme-blue);">不显示地理位置</div></div>`;
            
            if (!query) { searchResults.innerHTML = defaultOption; return; }
            searchResults.innerHTML = defaultOption + `<div class="loading-text">搜索中...</div>`;

            searchTimeout = setTimeout(() => {
                fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&limit=10&accept-language=zh-CN`)
                .then(res => res.json())
                .then(data => {
                    searchResults.innerHTML = defaultOption;
                    if (data.length === 0) { searchResults.innerHTML += `<div class="loading-text">未找到相关位置</div>`; return; }
                    data.forEach(item => {
                        const shortName = item.name || item.display_name.split(',')[0];
                        const div = document.createElement('div');
                        div.className = 'loc-item loc-selectable';
                        div.innerHTML = `<div class="loc-info"><div class="loc-title">${escapeIcityHtml(shortName)}</div><div class="loc-subtitle">${escapeIcityHtml(item.display_name)}</div></div>`;
                        div.addEventListener('click', () => selectLocation(shortName, item.lat, item.lon));
                        searchResults.appendChild(div);
                    });
                }).catch(() => { searchResults.innerHTML = defaultOption + `<div class="loading-text">搜索失败</div>`; });
            }, 600); 
        });
    }

    // 4. 全局日记本弹窗逻辑
    $$('.close-diary').forEach(btn => btn.addEventListener('click', () => {
        const modalDiary = $('#modal-diary');
        if(modalDiary) modalDiary.classList.remove('active');
    }));
    
    const btnConfirmDiary = $('#btn-confirm-diary');
    if(btnConfirmDiary) {
        btnConfirmDiary.addEventListener('click', () => {
            if (window.tempSelectedDiary && currentActiveEditor) {
                const displayDiary = currentActiveEditor.querySelector('.display-diary');
                const btnDiary = currentActiveEditor.querySelector('.btn-diary');
                if(displayDiary) displayDiary.textContent = window.tempSelectedDiary;
                if(btnDiary) btnDiary.classList.add('active');
            }
            const modalDiary = $('#modal-diary');
            if(modalDiary) modalDiary.classList.remove('active');
        });
    }

    // 5. 渲染动态流
    async function renderAllFeeds() {
        const visibilityContext = await buildIcityVisibilityContext();
        let feeds = filterIcityFeedsByVisibility(await getFeeds(), visibilityContext);
        
        feeds.sort((a, b) => {
            if (a.isPinned && !b.isPinned) return -1;
            if (!a.isPinned && b.isPinned) return 1;
            return getIcityPostOccurredAt(b) - getIcityPostOccurredAt(a);
        });

        const homeFeed = $('#home-feed');
        const worldFriendsFeed = $('#world-feed');
        const worldAllFeed = $('#content-world-all');
        const profileFeed = $('#profile-feed');
        const detailFeed = $('#diary-detail-feed');
        
        if(homeFeed) homeFeed.classList.remove('card-box');
        if(worldFriendsFeed) worldFriendsFeed.classList.remove('card-box');
        if(worldAllFeed) worldAllFeed.classList.remove('card-box');
        if(profileFeed) profileFeed.classList.remove('card-box');
        if(detailFeed) detailFeed.classList.remove('card-box');

        const emptyHtml = '<div class="card-box" style="padding: 30px; text-align: center; color: var(--text-light);">还没有日记，快去写一篇吧~</div>';
        if (feeds.length === 0) {
            if(homeFeed) homeFeed.innerHTML = emptyHtml;
            if(worldFriendsFeed) worldFriendsFeed.innerHTML = emptyHtml;
            if(worldAllFeed) worldAllFeed.innerHTML = emptyHtml;
            if(profileFeed) profileFeed.innerHTML = emptyHtml;
            if(detailFeed && !(viewDiaryDetail && viewDiaryDetail.classList.contains('active') && window.currentDiaryBook)) detailFeed.innerHTML = emptyHtml;
            return;
        }

        const profileData = visibilityContext.profile;
        const boundAccount = visibilityContext.boundAccount;
        
        const personalFeeds = feeds.filter(post => isCurrentIcityUserPost(post, boundAccount));
        const userName = profileData.nickname || '未命名市民';
        const userHandle = profileData.icityId ? '@' + profileData.icityId : '@diary_user';
        
        const avatarStyle = getIcityAvatarStyle(profileData.avatar);

        let homeHtml = '';
        let profileHtml = '';
        let detailHtml = '';
        let worldFriendsHtml = '';
        let worldAllHtml = '';

        let lastDateStr = '';
        let currentGroupHtml = '';
        let currentProfileGroupHtml = '';
        let currentDetailGroupHtml = '';

        const days = ['星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六'];

        function renderPostCitizenTitleTag(titleText, titleColor) {
            const text = String(titleText || '').trim();
            if (!text || text === '无') return '';
            const color = String(titleColor || '#8AB4F8').trim();
            return `<span class="icity-citizen-title-tag" style="background-color: ${escapeIcityHtml(color)};">${escapeIcityHtml(text)}</span>`;
        }

        const myCitizenTitleTag = renderPostCitizenTitleTag(profileData.citizenTitleText, profileData.citizenTitleColor);

        feeds.forEach((post) => {
            const occurredAt = getIcityPostOccurredAt(post);
            const postDate = getIcityDateObject(occurredAt);
            const dateKey = getIcityDateKey(occurredAt);
            const displayDateStr = Number.isNaN(postDate.getTime())
                ? '未知日期'
                : `${postDate.getMonth() + 1}月${postDate.getDate()}日 · ${days[postDate.getDay()]}<br>${postDate.getFullYear()}`;

            let imgHtml = renderIcityFeedImage(post);
            let locHtml = post.location ? `
                <div class="entry-location" style="color: var(--text-light); font-size: 13px;">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="width: 16px; height: 16px; margin-right: 2px; transform: translateY(1px);"><path d="M17.5 19H9a7 7 0 1 1 6.71-9h1.79a4.5 4.5 0 1 1 0 9Z"></path></svg>
                    ${escapeIcityHtml(post.location)} 23°C
                </div>` : '<div></div>';
            
            let likeSvg = post.isLiked 
                ? `<svg viewBox="0 0 24 24" style="width: 16px; height: 16px; fill: #FF3B30; stroke: #FF3B30; stroke-width: 2;"><path stroke-linecap="round" stroke-linejoin="round" d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"></path></svg>`
                : `<svg viewBox="0 0 24 24" style="width: 16px; height: 16px; fill: none; stroke: currentColor; stroke-width: 2;"><path stroke-linecap="round" stroke-linejoin="round" d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"></path></svg>`;

            let noteSvg = (post.notes && post.notes.length > 0)
                ? `<div style="display: flex; align-items: center; gap: 2px; color: #8AB4F8;">
                      <svg viewBox="0 0 24 24" style="width: 16px; height: 16px; fill: #8AB4F8; stroke: #8AB4F8; stroke-width: 1.5; stroke-linejoin: round;"><path d="M17 3H7c-1.1 0-2 .9-2 2v16l7-3 7 3V5c0-1.1-.9-2-2-2z"></path></svg>
                      <span style="font-size: 12px; font-weight: 600;">${post.notes.length}</span>
                   </div>`
                : '';

            const entryBody = `
                <div class="entry-content">${escapeIcityHtml(post.text)}</div>
                ${imgHtml}
                <div class="entry-footer">
                    ${locHtml}
                    <div class="entry-actions">
                        ${likeSvg}
                        ${noteSvg}
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="-0.5 -0.5 16 16" style="width: 18px; height: 18px; fill: none; stroke: currentColor;"><path stroke-linecap="round" stroke-linejoin="round" d="M11.875 2.5H3.125a1.25 1.25 0 0 0 -1.25 1.25v6.25a1.25 1.25 0 0 0 1.25 1.25h1.9925000000000002c0.625 0 1.1325 0.5068750000000001 1.1325 1.1325 0 0.505 0.61 0.7575 0.9668749999999999 0.400625l1.166875 -1.166875A1.25 1.25 0 0 1 9.2675 11.25H11.875a1.25 1.25 0 0 0 1.25 -1.25V3.75a1.25 1.25 0 0 0 -1.25 -1.25z" stroke-width="1.2"></path></svg>
                        <div class="entry-time">
                            <svg viewBox="0 0 24 24" style="width: 16px; height: 16px; fill: none; stroke: currentColor; stroke-width: 2;"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>
                            ${escapeIcityHtml(post.time)}
                        </div>
                        <svg viewBox="0 0 24 24" style="width: 16px; height: 16px; fill: currentColor; stroke: none;"><circle cx="12" cy="5" r="1.5"></circle><circle cx="12" cy="12" r="1.5"></circle><circle cx="12" cy="19" r="1.5"></circle></svg>
                    </div>
                </div>
            `;

            const plainEntry = `<div class="entry-item" data-id="${escapeIcityHtml(post.id)}" style="cursor: pointer;">${entryBody}</div>`;

            const isMine = isCurrentIcityUserPost(post, boundAccount);
            const isFriend = isIcityPostFriend(post, visibilityContext);
            const isPasserby = post.authorType === 'passerby' || post.scope === 'world';

            if (isMine) {
                if (dateKey !== lastDateStr) {
                    if (lastDateStr !== '') {
                        homeHtml += currentGroupHtml + `</div>`;
                        profileHtml += currentProfileGroupHtml + `</div>`;
                        detailHtml += currentDetailGroupHtml + `</div>`;
                    }

                    const headerHtml = `
                        <div class="feed-header-home">
                            <div class="avatar" style="${avatarStyle}"></div>
                            <div class="user-info">
                                <div class="name" style="display: flex; align-items: center; flex-wrap: wrap;">
                                    <span>${escapeIcityHtml(userName)}</span>${myCitizenTitleTag}
                                </div>
                                <div class="username">${escapeIcityHtml(userHandle)}</div>
                            </div>
                            <div class="feed-date">
                                ${displayDateStr}
                            </div>
                        </div>
                    `;

                    currentGroupHtml = `<div class="card-box">${headerHtml}${plainEntry}`;
                    currentProfileGroupHtml = `<div class="card-box">${plainEntry}`;
                    currentDetailGroupHtml = `<div class="card-box">${plainEntry}`;
                    lastDateStr = dateKey;
                } else {
                    currentGroupHtml += plainEntry;
                    currentProfileGroupHtml += plainEntry;
                    currentDetailGroupHtml += plainEntry;
                }
            }

            const postAvatarStyle = getIcityAvatarStyle(post.authorWechatAvatar || post.avatar || profileData.avatar);
            const postTitleTag = isMine ? myCitizenTitleTag : renderPostCitizenTitleTag(post.citizenTitleText, post.citizenTitleColor);

            if (isFriend || isPasserby) {
                const worldEntryHtml = `
                <div class="card-box entry-item" data-id="${escapeIcityHtml(post.id)}" style="cursor: pointer; border-bottom: none;">
                    <div class="entry-user-header">
                        <div class="avatar char-avatar-clickable" style="${postAvatarStyle}"></div>
                        <div class="user-info">
                            <div class="name" style="display: flex; align-items: center; flex-wrap: wrap;">
                                <span>${escapeIcityHtml(post.user)}</span>${postTitleTag}
                            </div>
                            <div class="username">${escapeIcityHtml(post.handle)} ${post.diary ? '· ' + escapeIcityHtml(post.diary) : ''}</div>
                        </div>
                    </div>
                    ${entryBody}
                </div>
                `;
                
                if (isFriend) {
                    worldFriendsHtml += worldEntryHtml;
                } else if (isPasserby) {
                    worldAllHtml += worldEntryHtml;
                }
            }
        });
        
        if (lastDateStr !== '') {
            homeHtml += currentGroupHtml + `</div>`;
            detailHtml += currentDetailGroupHtml + `</div>`;
        }

        if(homeFeed) homeFeed.innerHTML = personalFeeds.length ? homeHtml : emptyHtml;
        if(detailFeed && !(viewDiaryDetail && viewDiaryDetail.classList.contains('active') && window.currentDiaryBook)) detailFeed.innerHTML = personalFeeds.length ? detailHtml : emptyHtml;
        if(worldFriendsFeed) worldFriendsFeed.innerHTML = worldFriendsHtml || emptyHtml;
        if(worldAllFeed) worldAllFeed.innerHTML = worldAllHtml || emptyHtml;

        const profileRecentContainer = $('#profile-recent-posts');
        const profileFollowerCount = $('#profile-stat-follower-count');
        const profileFriendCount = $('#profile-stat-friend-count');
        const profileStatCount = $('#profile-stat-diary-count');
        const profileLikedCount = $('#profile-stat-liked-count');
        const profileMoreCount = $('#profile-more-diary-count');
        
        if (profileRecentContainer) {
            if (personalFeeds.length === 0) {
                profileRecentContainer.innerHTML = '<div style="padding: 30px; text-align: center; color: var(--text-light); font-size: 14px;">还没有日记，快去写一篇吧~</div>';
            } else {
                const recentFeeds = personalFeeds.slice(0, 2);
                let recentHtml = '';
                
                recentFeeds.forEach(post => {
                    let imgHtml = renderIcityFeedImage(post);
                    let locHtml = post.location ? `
                        <div class="entry-location" style="color: var(--text-light); font-size: 13px;">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="width: 16px; height: 16px; margin-right: 2px; transform: translateY(1px);"><path d="M17.5 19H9a7 7 0 1 1 6.71-9h1.79a4.5 4.5 0 1 1 0 9Z"></path></svg>
                            ${escapeIcityHtml(post.location)} 23°C
                        </div>` : '<div></div>';
                    
                    let likeSvg = post.isLiked 
                        ? `<svg viewBox="0 0 24 24" style="width: 16px; height: 16px; fill: #FF3B30; stroke: #FF3B30; stroke-width: 2;"><path stroke-linecap="round" stroke-linejoin="round" d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"></path></svg>`
                        : `<svg viewBox="0 0 24 24" style="width: 16px; height: 16px; fill: none; stroke: currentColor; stroke-width: 2;"><path stroke-linecap="round" stroke-linejoin="round" d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"></path></svg>`;

                    let noteSvg = (post.notes && post.notes.length > 0)
                        ? `<div style="display: flex; align-items: center; gap: 2px; color: #8AB4F8;">
                              <svg viewBox="0 0 24 24" style="width: 16px; height: 16px; fill: #8AB4F8; stroke: #8AB4F8; stroke-width: 1.5; stroke-linejoin: round;"><path d="M17 3H7c-1.1 0-2 .9-2 2v16l7-3 7 3V5c0-1.1-.9-2-2-2z"></path></svg>
                              <span style="font-size: 12px; font-weight: 600;">${post.notes.length}</span>
                           </div>`
                        : '';

                    const entryBody = `
                        <div class="entry-content">${escapeIcityHtml(post.text)}</div>
                        ${imgHtml}
                        <div class="entry-footer">
                            ${locHtml}
                            <div class="entry-actions">
                                ${likeSvg}
                                ${noteSvg}
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="-0.5 -0.5 16 16" style="width: 18px; height: 18px; fill: none; stroke: currentColor;"><path stroke-linecap="round" stroke-linejoin="round" d="M11.875 2.5H3.125a1.25 1.25 0 0 0 -1.25 1.25v6.25a1.25 1.25 0 0 0 1.25 1.25h1.9925000000000002c0.625 0 1.1325 0.5068750000000001 1.1325 1.1325 0 0.505 0.61 0.7575 0.9668749999999999 0.400625l1.166875 -1.166875A1.25 1.25 0 0 1 9.2675 11.25H11.875a1.25 1.25 0 0 0 1.25 -1.25V3.75a1.25 1.25 0 0 0 -1.25 -1.25z" stroke-width="1.2"></path></svg>
                                <div class="entry-time">
                                    <svg viewBox="0 0 24 24" style="width: 16px; height: 16px; fill: none; stroke: currentColor; stroke-width: 2;"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>
                                    ${escapeIcityHtml(post.time)}
                                </div>
                                <svg viewBox="0 0 24 24" style="width: 16px; height: 16px; fill: currentColor; stroke: none;"><circle cx="12" cy="5" r="1.5"></circle><circle cx="12" cy="12" r="1.5"></circle><circle cx="12" cy="19" r="1.5"></circle></svg>
                            </div>
                        </div>
                    `;

                    recentHtml += `<div class="entry-item" data-id="${escapeIcityHtml(post.id)}" style="cursor: pointer;">${entryBody}</div>`;
                });
                profileRecentContainer.innerHTML = recentHtml;
            }
            
            const profileStats = await getIcityProfileStats(personalFeeds);
            if (profileFollowerCount) profileFollowerCount.textContent = profileStats.followers;
            if (profileFriendCount) profileFriendCount.textContent = profileStats.friends;
            if (profileStatCount) profileStatCount.textContent = profileStats.diaries;
            if (profileLikedCount) profileLikedCount.textContent = profileStats.liked;
            if (profileMoreCount) profileMoreCount.textContent = profileStats.diaries;
        }
    }

    // ================= 交互 9：点击帖子进入单篇详情页 =================
    const viewSinglePost = $('#view-single-post');
    const btnBackSinglePost = $('#btn-back-single-post');
    let previousView = 'home'; 
    let viewStack = []; 
    let icitySourceView = 'home';
    let icitySourceScrollTop = 0;

    function rememberIcitySourceView() {
        const activeView = $('.view-container.active');
        if (!activeView) return;
        const viewName = activeView.id.replace(/^view-/, '');
        if (['home', 'world', 'message', 'profile'].includes(viewName)) icitySourceView = viewName;
        const scrollArea = activeView.querySelector('.content-scroll');
        icitySourceScrollTop = scrollArea ? scrollArea.scrollTop : 0;
    }

    function restoreIcitySourceView(fallback = 'home') {
        const targetView = ['home', 'world', 'message', 'profile'].includes(icitySourceView) ? icitySourceView : fallback;
        if (mainBottomNav) mainBottomNav.style.display = 'flex';
        switchView(targetView);
        const sourceView = $('#view-' + targetView);
        const scrollArea = sourceView?.querySelector('.content-scroll');
        if (scrollArea) window.requestAnimationFrame(() => scrollArea.scrollTo(0, icitySourceScrollTop));
    }
    window.currentSinglePostId = null; 

    $$('.content-scroll').forEach(scrollArea => {
        scrollArea.addEventListener('click', function(e) {
            const avatarClickable = e.target.closest('.char-avatar-clickable');
            if (avatarClickable) {
                e.stopPropagation();
                const entryItem = avatarClickable.closest('.entry-item');
                const postId = entryItem.getAttribute('data-id');
                if (postId) {
                    openCharProfile(postId);
                }
                return;
            }

            const entryItem = e.target.closest('.entry-item');
            if (entryItem) {
                const postId = entryItem.getAttribute('data-id');
                if (postId) {
                    openSinglePost(postId);
                }
            }
        });
    });

    window.addEventListener('contacts:characters-deleted', event => {
        if (!event.detail?.recordsPurged || !window.CharacterRecordCleanup) return;
        const target = window.currentIcityChatTarget;
        if (target && !window.CharacterRecordCleanup.clean({ id: 'icity_dms', data: target })?.data) {
            window.currentIcityChatTarget = null;
            switchView('message');
        }
        void renderAllFeeds().catch(error => console.warn('Deleted character diary refresh failed:', error));
    });

    window.currentViewingProfileCharacterId = '';

    async function openCharProfile(postId) {
        const feeds = await getVisibleIcityFeeds(await getFeeds());
        const post = feeds.find(p => p.id == postId);
        if (!post) return;

        window.currentViewingProfileCharacterId = getIcityCleanCharacterId(post.characterId || post.authorWechatId);

        const activeView = $('.view-container.active');
        if (activeView && activeView.id !== 'view-char-profile') {
            previousView = activeView.id.replace('view-', '');
            viewStack.push(previousView);
        }

        $$('.view-container').forEach(v => v.classList.remove('active'));
        if(mainBottomNav) mainBottomNav.style.display = 'none';

        const bg = $('#char-profile-bg');
        const avatar = $('#char-profile-avatar');
        const name = $('#char-profile-name');
        const handle = $('#char-profile-handle');
        const bio = $('#char-profile-bio');
        const location = $('#char-profile-location span');
        
        const avatarStyle = getIcityAvatarStyle(post.authorWechatAvatar || post.avatar);
        if(bg) bg.style.backgroundImage = avatarStyle.replace('background-image:', '').replace(';', '');
        if(avatar) avatar.style.cssText = avatarStyle;
        if(name) name.textContent = post.user || '未知角色';
        if(handle) handle.textContent = post.handle || '@unknown';
        
        let personaText = '“待我 如初”';
        let locText = '未知';
        if (post.authorType === 'character' && post.authorWechatId) {
            const wechatContactsData = await getWechatContactsData();
            const contacts = getWechatContactsList(wechatContactsData);
            const contact = contacts.find(c => c.id === post.authorWechatId || c.linkedContactId === post.characterId);
            if (contact) {
                if (contact.persona) personaText = `“${contact.persona.slice(0, 20)}...”`;
                if (contact.weatherLocation) locText = contact.weatherLocation;
            }
        }
        if(bio) bio.textContent = personaText;
        if(location) location.textContent = locText;

        const authorPosts = feeds.filter(p => p.authorWechatId === post.authorWechatId || (p.user === post.user && p.handle === post.handle));
        
        const statDiary = $('#char-stat-diary');
        const statLiked = $('#char-stat-liked');
        if(statDiary) statDiary.textContent = authorPosts.length;
        if(statLiked) statLiked.textContent = authorPosts.reduce((sum, p) => sum + getIcityPostLikeCount(p), 0);

        const recentPostsContainer = $('#char-profile-recent-posts');
        if (recentPostsContainer) {
            let html = '';
            authorPosts.slice(0, 3).forEach(p => {
                let likeSvg = p.isLiked 
                    ? `<svg viewBox="0 0 24 24" style="fill: #FF3B30; stroke: #FF3B30;"><path stroke-linecap="round" stroke-linejoin="round" d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"></path></svg>`
                    : `<svg viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"></path></svg>`;
                
                html += `
                    <div class="char-simple-post entry-item" data-id="${p.id}" style="cursor: pointer;">
                        <div class="char-simple-post-text text-truncate-2">${p.text}</div>
                        <div class="char-simple-post-actions">
                            ${likeSvg}
                            <svg viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path></svg>
                            <div class="char-simple-post-time">
                                <svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>
                                ${p.time}
                            </div>
                            <svg viewBox="0 0 24 24" style="fill: currentColor; stroke: none;"><circle cx="12" cy="5" r="1.5"></circle><circle cx="12" cy="12" r="1.5"></circle><circle cx="12" cy="19" r="1.5"></circle></svg>
                        </div>
                    </div>
                `;
            });
            recentPostsContainer.innerHTML = html;
            $('#char-more-diary-count').textContent = authorPosts.length;
        }

        // ================= 渲染角色日记本：合写日记本 + 角色私密日记本 =================
        const charDiaryScroll = $('#char-diary-books-scroll');
        if (charDiaryScroll) {
            charDiaryScroll.innerHTML = '';
            const allDiaries = await getDiaries();
            const profile = await getProfile();
            const isVip = profile.isProMember === true;
            const charIdentifier = post.authorWechatId || post.characterId || post.user;

            // 1. 用户与该角色共同合写的日记本
            const coauthoredDiaries = allDiaries.filter(d => Array.isArray(d.collaboratorIds) && d.collaboratorIds.includes(String(charIdentifier)));

            coauthoredDiaries.forEach(d => {
                const bookEl = document.createElement('div');
                bookEl.className = 'diary-book-card';
                bookEl.style.cssText = `background: ${d.coverBg}; cursor: pointer; position: relative; min-width: 90px; height: 120px; border-radius: 4px 12px 12px 4px; padding: 8px;`;
                bookEl.innerHTML = `
                    <div style="position: absolute; top: 6px; left: 8px; font-size: 10px; background: rgba(0,0,0,0.4); color: #FFF; padding: 1px 5px; border-radius: 4px;">合写本</div>
                    <div class="bottom-info" style="position: absolute; bottom: 8px; left: 8px; right: 8px; display: flex; justify-content: space-between; align-items: center; font-size: 11px; color: #FFF; font-weight: 600;">
                        <span>${feeds.filter(f => String(f?.diaryId || '') === String(d.id)).length}</span>
                        <svg viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"></circle><line x1="2" y1="12" x2="22" y2="12"></line><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path></svg>
                    </div>
                `;
                bookEl.onclick = () => openDiaryDetail(d);
                charDiaryScroll.appendChild(bookEl);
            });

            // 2. 角色专属【私密日记本】（Pro VIP 专享查看）
            const privateSecretBook = document.createElement('div');
            privateSecretBook.className = 'diary-book-card';
            privateSecretBook.style.cssText = `background: linear-gradient(135deg, #2C2C2E, #1C1C1E); cursor: pointer; position: relative; min-width: 90px; height: 120px; border-radius: 4px 12px 12px 4px; padding: 8px; border: 1px solid rgba(255,183,64,0.3);`;
            privateSecretBook.innerHTML = `
                <div style="position: absolute; top: 6px; left: 8px; font-size: 10px; background: var(--tag-orange); color: #FFF; padding: 1px 5px; border-radius: 4px; font-weight: bold;">密本 · PRO</div>
                <div style="position: absolute; top: 38px; left: 0; right: 0; text-align: center; color: var(--tag-orange); font-size: 18px;">🔒</div>
                <div class="bottom-info" style="position: absolute; bottom: 8px; left: 8px; right: 8px; display: flex; justify-content: space-between; align-items: center; font-size: 11px; color: #E5E5EA; font-weight: 600;">
                    <span>${isVip ? '已解锁' : '未解锁'}</span>
                    <svg viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg>
                </div>
            `;

            privateSecretBook.onclick = () => {
                if (!isVip) {
                    if (typeof window.showToast === 'function') window.showToast('需激活 Diary Pro 荣誉市民方可解锁角色私密日记本');
                    openVipCenterView();
                } else {
                    const secretDiaryObj = {
                        name: `${post.user}的内心密本`,
                        coverBg: 'linear-gradient(135deg, #2C2C2E, #1C1C1E)',
                        visibility: '私人'
                    };
                    openDiaryDetail(secretDiaryObj);
                }
            };
            charDiaryScroll.appendChild(privateSecretBook);
        }

        const photosContainer = $('#char-profile-photos');
        if (photosContainer) {
            const postsWithImg = authorPosts.filter(p => p.img && p.img !== ICITY_IMAGE_PLACEHOLDER_URL);
            let html = '';
            postsWithImg.slice(0, 4).forEach(p => {
                html += `<img src="${p.img}">`;
            });
            photosContainer.innerHTML = html;
            $('#char-more-photo-count').textContent = postsWithImg.length;
        }

        // 联动角色主页的“加好友”按键
        const btnCharAddFriend = $('.char-action-buttons .btn-green, .char-action-buttons .btn-outline');
        if (btnCharAddFriend) {
            const currentProfile = await getProfile();
            const friends = Array.isArray(currentProfile.addedFriendIds) ? currentProfile.addedFriendIds : [];
            const isFriendNow = friends.includes(String(post.characterId || post.authorWechatId || post.user));
            
            btnCharAddFriend.innerHTML = isFriendNow 
                ? '已是好友' 
                : `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg> 加好友`;
            btnCharAddFriend.className = isFriendNow ? 'btn-action btn-outline' : 'btn-action btn-green';

            btnCharAddFriend.onclick = async () => {
                const cid = String(post.characterId || post.authorWechatId || post.user);
                let friendIds = Array.isArray(currentProfile.addedFriendIds) ? [...currentProfile.addedFriendIds] : [];
                if (friendIds.includes(cid)) {
                    friendIds = friendIds.filter(id => id !== cid);
                    btnCharAddFriend.innerHTML = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg> 加好友`;
                    btnCharAddFriend.className = 'btn-action btn-green';
                    if (typeof window.showToast === 'function') window.showToast('已取消好友关系');
                } else {
                    friendIds.push(cid);
                    btnCharAddFriend.textContent = '已是好友';
                    btnCharAddFriend.className = 'btn-action btn-outline';
                    if (typeof window.showToast === 'function') window.showToast('已成功添加为好友！');
                }
                currentProfile.addedFriendIds = friendIds;
                await saveProfileData('addedFriendIds', friendIds);
                if (typeof renderIcityContactsFriendsList === 'function') await renderIcityContactsFriendsList();
                if (typeof renderAllFeeds === 'function') renderAllFeeds();
            };
        }

        await refreshIcityCharacterProfile({ characterId: window.currentViewingProfileCharacterId, user: post.user, handle: post.handle, avatar: post.authorWechatAvatar || post.avatar });
        const viewCharProfile = $('#view-char-profile');
        if(viewCharProfile) viewCharProfile.classList.add('active');
    }

    bindIcityTap($('#btn-edit-char-profile'), openIcityCharacterProfileEditor);

    const btnBackCharProfile = $('#btn-back-char-profile');
    if (btnBackCharProfile) {
        btnBackCharProfile.addEventListener('click', () => {
            const viewCharProfile = $('#view-char-profile');
            if(viewCharProfile) viewCharProfile.classList.remove('active');
            
            let targetView = viewStack.pop() || 'home';
            
            if (['home', 'world', 'message', 'profile'].includes(targetView)) {
                if(mainBottomNav) mainBottomNav.style.display = 'flex';
                switchView(targetView);
            } else {
                const prevEl = $('#view-' + targetView);
                if (prevEl) prevEl.classList.add('active');
                if(mainBottomNav) mainBottomNav.style.display = 'none';
            }
        });
    }

    async function openSinglePost(postId) {
        const feeds = await getVisibleIcityFeeds(await getFeeds());
        const post = feeds.find(p => p.id == postId);
        if (!post) return;

        window.currentSinglePostId = postId;

        const activeView = $('.view-container.active');
        if (activeView && activeView.id !== 'view-single-post') {
            previousView = activeView.id.replace('view-', '');
            viewStack.push(previousView);
        }

        $$('.view-container').forEach(v => v.classList.remove('active'));
        if(mainBottomNav) mainBottomNav.style.display = 'none';

        const singlePostHeaderTitle = $('#single-post-header-title');
        const singlePostName = $('#single-post-name');
        const singlePostHandle = $('#single-post-handle');
        const singlePostText = $('#single-post-text');
        const postIdentity = await getIcitySinglePostIdentity(post);
        const profileData = await getProfile();
        const authData = await getWechatAuthData();
        const boundAccount = getBoundWechatAccount(profileData, authData);
        const isUserPost = isCurrentIcityUserPost(post, boundAccount);
        const titleText = isUserPost ? (profileData.citizenTitleText || post.citizenTitleText) : post.citizenTitleText;
        const titleColor = isUserPost ? (profileData.citizenTitleColor || post.citizenTitleColor) : post.citizenTitleColor;
        const titleTagHtml = (titleText && titleText !== '无')
            ? `<span class="icity-citizen-title-tag" style="background-color: ${escapeIcityHtml(titleColor || '#8AB4F8')};">${escapeIcityHtml(titleText)}</span>`
            : '';

        if(singlePostHeaderTitle) singlePostHeaderTitle.textContent = `${postIdentity.name} · 日记`;
        if(singlePostName) singlePostName.innerHTML = `<span style="vertical-align: middle;">${escapeIcityHtml(postIdentity.name)}</span>${titleTagHtml}`;
        if(singlePostHandle) singlePostHandle.textContent = postIdentity.handle;
        if(singlePostText) singlePostText.textContent = post.text;
        
        const imgContainer = $('#single-post-img-container');
        if(imgContainer) {
            imgContainer.innerHTML = renderIcityFeedImage(post);
        }

        const date = getIcityDateObject(getIcityPostOccurredAt(post));
        const singlePostTime = $('#single-post-time');
        if (singlePostTime) {
            singlePostTime.textContent = Number.isNaN(date.getTime())
                ? '未知日期'
                : `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')} ${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}`;
        }

        const locContainer = $('#single-post-location-container');
        const locText = $('#single-post-location');
        if(locContainer && locText) {
            if (post.location) {
                locText.textContent = post.location + ' 23°C';
                locContainer.style.display = 'flex';
                locContainer.style.alignItems = 'center';
                locContainer.style.gap = '4px';
            } else {
                locContainer.style.display = 'none';
            }
        }

        const earthDayContainer = $('#single-post-earth-day');
        if (earthDayContainer) {
            const profileData = await getProfile();
            const earthDayEnabled = profileData.earthDayEnabled !== false; 
            const earthDayText = profileData.earthDayText || '来到地球第';
            const birthDateStr = profileData.birthDate;

            if (earthDayEnabled && birthDateStr) {
                const birthDate = new Date(birthDateStr);
                const postDate = getIcityDateObject(getIcityPostOccurredAt(post));
                const diffTime = postDate - birthDate;
                if (diffTime >= 0) {
                    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
                    earthDayContainer.innerHTML = `<span style="color: #E0E0E0; margin: 0 4px;">|</span> ${earthDayText} ${diffDays} 天`;
                    earthDayContainer.style.display = 'inline';
                } else {
                    earthDayContainer.style.display = 'none';
                }
            } else {
                earthDayContainer.style.display = 'none';
            }
        }

        const visibilityContainer = $('#single-post-visibility');
        if (visibilityContainer) {
            let visibilitySvg = '';
            if (post.visibility === '仅好友可见') {
                visibilitySvg = `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" style="width: 14px; height: 14px;"><path stroke-linecap="round" stroke-linejoin="round" d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z" /></svg>`;
            } else if (post.visibility === '私人') {
                visibilitySvg = `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" style="width: 14px; height: 14px;"><path stroke-linecap="round" stroke-linejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" /></svg>`;
            } else {
                visibilitySvg = `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" style="width: 14px; height: 14px;"><path stroke-linecap="round" stroke-linejoin="round" d="M12 21a9.004 9.004 0 0 0 8.716-6.747M12 21a9.004 9.004 0 0 1-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 0 1 7.843 4.582M12 3a8.997 8.997 0 0 0-7.843 4.582m15.686 0A11.953 11.953 0 0 1 12 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0 1 21 12c0 .778-.099 1.533-.284 2.253m0 0A17.919 17.919 0 0 1 12 16.5c-3.162 0-6.133-.815-8.716-2.247m0 0A9.015 9.015 0 0 1 3 12c0-1.605.42-3.113 1.157-4.418" /></svg>`;
            }
            visibilityContainer.innerHTML = `${visibilitySvg} <span>${escapeIcityHtml(post.visibility || '公开')}</span>`;
        }

        const singleAvatar = $('#single-post-avatar');
        if(singleAvatar) {
            singleAvatar.setAttribute('style', getIcityAvatarStyle(postIdentity.avatar));
            singleAvatar.innerHTML = '';
            singleAvatar.style.cursor = 'pointer';
            singleAvatar.onclick = (e) => {
                e.stopPropagation();
                openCharProfile(postId);
            };
        }

        const commentsSection = $('#comments-section');
        const commentsContainer = $('#single-post-comments-container');
        const commentsCount = $('#comments-count');
        
        if (commentsSection && commentsContainer && commentsCount) {
            if (post.comments && post.comments.length > 0) {
                const [contactsDataForComments, wechatContactsDataForComments] = await Promise.all([
                    getContactsData(),
                    getWechatContactsData()
                ]);
                const charCandidates = getIcityReactionContactCandidates(contactsDataForComments, wechatContactsDataForComments);
                const charAvatarMap = new Map();
                charCandidates.forEach(item => {
                    const cName = String(item.contact?.name || item.wechatContact?.name || '').trim();
                    const cAvatar = item.contact?.avatar || item.wechatContact?.avatar || '';
                    if (cName && cAvatar) charAvatarMap.set(cName, cAvatar);
                });

                commentsSection.style.display = 'block'; 
                commentsCount.textContent = `${post.comments.length} 条评论`;
                let commentsHtml = '';
                
                post.comments.sort((a, b) => {
                    if (a.isPinned && !b.isPinned) return -1;
                    if (!a.isPinned && b.isPinned) return 1;
                    return 0;
                });

                post.comments.forEach(comment => {
                    const isPinnedText = comment.isPinned ? '取消置顶' : '置顶';
                    const pinTag = comment.isPinned ? '<span style="color: var(--theme-green); font-weight: 600;">已置顶 · </span>' : '';
                    let commentAvatar = comment.avatar || '';
                    if (!commentAvatar && comment.avatarStyle) {
                        const parsedBg = normalizeIcityAvatarBackground(comment.avatarStyle);
                        if (parsedBg && !parsedBg.includes('linear-gradient')) {
                            commentAvatar = parsedBg;
                        }
                    }
                    if (!commentAvatar && comment.user && charAvatarMap.has(comment.user)) {
                        commentAvatar = charAvatarMap.get(comment.user);
                    }
                    const safeAvatarStyle = getIcityAvatarStyle(commentAvatar || comment.avatarStyle || '');
                    
                    commentsHtml += `
                        <div class="comment-item">
                            <div class="comment-avatar" style="${safeAvatarStyle}"></div>
                            <div class="comment-main">
                                <div class="comment-header-row">
                                    <div class="comment-name">${escapeIcityHtml(comment.user)}</div>
                                    <div class="comment-actions">
                                        <div class="time" style="color: var(--text-light);">${pinTag}${escapeIcityHtml(comment.time)}</div>
                                        <div style="position: relative; display: flex; align-items: center;">
                                            <div class="more-btn comment-more-btn" data-comment-id="${escapeIcityHtml(comment.id)}">
                                                <svg viewBox="0 0 24 24" style="width: 20px; height: 20px; fill: currentColor; stroke: none;"><circle cx="12" cy="5" r="2"></circle><circle cx="12" cy="12" r="2"></circle><circle cx="12" cy="19" r="2"></circle></svg>
                                            </div>
                                            
                                            <div class="popover-menu comment-popover-menu" id="comment-menu-${comment.id}" style="display: none; width: 140px; z-index: 101; right: 0; top: 100%; transform: none; margin-top: 8px;">
                                                <div class="menu-row">
                                                    <div class="menu-item text-red comment-menu-delete" data-comment-id="${escapeIcityHtml(comment.id)}">
                                                        <svg class="icon-red" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path><line x1="10" y1="11" x2="10" y2="17"></line><line x1="14" y1="11" x2="14" y2="17"></line></svg>
                                                        删除
                                                    </div>
                                                    <div class="menu-item comment-menu-edit" data-comment-id="${escapeIcityHtml(comment.id)}">
                                                        <svg class="icon-yellow" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>
                                                        编辑
                                                    </div>
                                                </div>
                                                <div class="menu-row">
                                                    <div class="menu-item comment-menu-pin" data-comment-id="${escapeIcityHtml(comment.id)}">
                                                        <svg class="icon-green" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="17" x2="12" y2="22"></line><path d="M5 17h14v-1.76a2 2 0 0 0-1.11-1.79l-1.78-.9A2 2 0 0 1 15 10.6V6a3 3 0 0 0-3-3h0a3 3 0 0 0-3 3v4.6a2 2 0 0 1-1.11 1.79l-1.78.9A2 2 0 0 0 5 15.24Z"></path></svg>
                                                        ${isPinnedText}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div class="comment-content">${escapeIcityHtml(comment.text)}</div>
                            </div>
                        </div>
                    `;
                });
                commentsContainer.innerHTML = commentsHtml;
            } else {
                commentsSection.style.display = 'none'; 
                commentsContainer.innerHTML = '';
            }
        }

        const btnLike = $('.single-action-btn.btn-like');
        if(btnLike) {
            const likeSvg = btnLike.querySelector('svg');
            if (post.isLiked) {
                btnLike.classList.add('liked');
                likeSvg.style.fill = '#FF3B30';
                likeSvg.style.stroke = '#FF3B30';
                btnLike.style.color = '#FF3B30';
            } else {
                btnLike.classList.remove('liked');
                likeSvg.style.fill = 'none';
                likeSvg.style.stroke = 'currentColor';
                btnLike.style.color = '#B3B3B3';
            }
        }

        const menuPin = $('#menu-pin');
        if (menuPin) {
            menuPin.innerHTML = `<svg class="icon-green" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="17" x2="12" y2="22"></line><path d="M5 17h14v-1.76a2 2 0 0 0-1.11-1.79l-1.78-.9A2 2 0 0 1 15 10.6V6a3 3 0 0 0-3-3h0a3 3 0 0 0-3 3v4.6a2 2 0 0 1-1.11 1.79l-1.78.9A2 2 0 0 0 5 15.24Z"></path></svg>
                                ${post.isPinned ? '取消置顶' : '置顶日记'}`;
        }

        const notesContainer = $('#single-post-notes-container');
        const actionsContainer = $('.single-post-actions'); 
        
        if (notesContainer) {
            if (post.notes && post.notes.length > 0) {
                let notesHtml = '';
                
                let needsSave = false;
                post.notes.forEach((note, idx) => { 
                    if (!note.id) {
                        note.id = 'old_' + Date.now() + '_' + idx; 
                        needsSave = true;
                    }
                });
                if (needsSave) {
                    saveFeed(post);
                }

                post.notes.sort((a, b) => {
                    if (a.isPinned && !b.isPinned) return -1;
                    if (!a.isPinned && b.isPinned) return 1;
                    return 0;
                });

                post.notes.forEach(note => {
                    let noteImgHtml = isIcityRenderableImage(note.img) ? `<img src="${escapeIcityHtml(note.img)}" style="width:100%; border-radius:8px; margin-bottom:12px; max-height:300px; object-fit:cover;">` : '';
                    let noteLocHtml = note.location ? `
                        <div class="single-post-note-meta-left">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M17.5 19H9a7 7 0 1 1 6.71-9h1.79a4.5 4.5 0 1 1 0 9Z"></path></svg>
                            ${escapeIcityHtml(note.location)} 23°C
                        </div>` : '<div></div>';
                        
                    notesHtml += `
                        <div class="ticket-divider has-notch"><div class="ticket-divider-left"></div></div>
                        <div class="single-post-note-item">
                            <div class="single-post-note-text">${escapeIcityHtml(note.text)}</div>
                            ${noteImgHtml}
                            <div class="single-post-note-meta">
                                ${noteLocHtml}
                                <div style="display:flex; align-items:center; gap:8px;">
                                    <span style="${note.isPinned ? 'color: var(--theme-green); font-weight: 600;' : ''}">${note.isPinned ? '已置顶 · ' : ''}${escapeIcityHtml(note.time)}</span>
                                    
                                    <div style="position: relative; display: flex; align-items: center;">
                                        <svg class="note-more-btn" data-note-id="${escapeIcityHtml(note.id)}" viewBox="0 0 24 24" fill="currentColor" style="width:16px; height:16px; color:var(--text-light); cursor:pointer;"><circle cx="12" cy="5" r="2"></circle><circle cx="12" cy="12" r="2"></circle><circle cx="12" cy="19" r="2"></circle></svg>
                                        
                                        <div class="popover-menu note-popover-menu" id="note-menu-${note.id}" style="display: none; width: 140px; z-index: 101;">
                                            <div class="menu-row">
                                                <div class="menu-item text-red note-menu-delete" data-note-id="${escapeIcityHtml(note.id)}">
                                                    <svg class="icon-red" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path><line x1="10" y1="11" x2="10" y2="17"></line><line x1="14" y1="11" x2="14" y2="17"></line></svg>
                                                    删除
                                                </div>
                                                <div class="menu-item note-menu-edit" data-note-id="${escapeIcityHtml(note.id)}">
                                                    <svg class="icon-yellow" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>
                                                    编辑
                                                </div>
                                            </div>
                                            <div class="menu-row">
                                                <div class="menu-item note-menu-pin" data-note-id="${escapeIcityHtml(note.id)}">
                                                    <svg class="icon-green" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="17" x2="12" y2="22"></line><path d="M5 17h14v-1.76a2 2 0 0 0-1.11-1.79l-1.78-.9A2 2 0 0 1 15 10.6V6a3 3 0 0 0-3-3h0a3 3 0 0 0-3 3v4.6a2 2 0 0 1-1.11 1.79l-1.78.9A2 2 0 0 0 5 15.24Z"></path></svg>
                                                    ${note.isPinned ? '取消置顶' : '置顶'}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    `;
                });
                notesHtml += `<div class="ticket-divider"></div>`;
                notesContainer.innerHTML = notesHtml;
                
                if (actionsContainer) actionsContainer.style.borderTop = 'none';
            } else {
                notesContainer.innerHTML = '';
                if (actionsContainer) actionsContainer.style.borderTop = '0.5px solid var(--border-color)';
            }
        }

        if(viewSinglePost) viewSinglePost.classList.add('active');
        requestAnimationFrame(updateSinglePostKeyboardOffset);
    }

    if (btnBackSinglePost) {
        btnBackSinglePost.addEventListener('click', () => {
            if(viewSinglePost) viewSinglePost.classList.remove('active');
            if(viewSinglePost) viewSinglePost.style.setProperty('--icity-keyboard-offset', '0px');
            
            let targetView = viewStack.pop() || 'home';
            
            if (['home', 'world', 'message', 'profile'].includes(targetView)) {
                if(mainBottomNav) mainBottomNav.style.display = 'flex';
                switchView(targetView);
            } else {
                const prevEl = $('#view-' + targetView);
                if (prevEl) prevEl.classList.add('active');
                if(mainBottomNav) mainBottomNav.style.display = 'none';
            }
        });
    }

    // ================= 交互 10：详情页更多操作菜单 =================
    const btnMoreAction = $('.single-action-btn.btn-more');
    const popoverMenu = $('#popoverMenu');
    const menuOverlay = $('#menuOverlay');

    if (btnMoreAction && popoverMenu && menuOverlay) {
        btnMoreAction.addEventListener('click', (e) => {
            e.stopPropagation(); 
            if (popoverMenu.style.display === 'none' || popoverMenu.style.display === '') {
                popoverMenu.style.display = 'flex';
                menuOverlay.style.display = 'block'; 
            } else {
                popoverMenu.style.display = 'none';
                menuOverlay.style.display = 'none'; 
            }
        });

        menuOverlay.addEventListener('click', (e) => {
            e.stopPropagation();
            popoverMenu.style.display = 'none';
            menuOverlay.style.display = 'none';
            $$('.note-popover-menu, .comment-popover-menu').forEach(m => m.style.display = 'none');
        });

        document.addEventListener('click', () => {
            popoverMenu.style.display = 'none';
            menuOverlay.style.display = 'none';
            $$('.note-popover-menu, .comment-popover-menu').forEach(m => m.style.display = 'none');
        });

        popoverMenu.addEventListener('click', (e) => {
            e.stopPropagation();
        });
    }

    // ================= 真实功能：单篇日记存为精美图片 =================
    const btnSavePostImage = $('.single-action-btn.btn-save');
    if (btnSavePostImage) {
        bindIcityTap(btnSavePostImage, async () => {
            if (!window.currentSinglePostId) return;
            const feeds = await getFeeds();
            const post = feeds.find(p => p.id == window.currentSinglePostId);
            if (!post) return;

            if (typeof window.showToast === 'function') window.showToast('正在生成日记图片...');

            try {
                // 1. 创建离屏高分 Canvas
                const canvas = document.createElement('canvas');
                const ctx = canvas.getContext('2d');
                const width = 750; // 2x 导出宽度
                canvas.width = width;

                // 2. 预排版计算高度
                ctx.font = '28px -apple-system, BlinkMacSystemFont, sans-serif';
                const padding = 44;
                const contentWidth = width - padding * 2;
                
                const wrapText = (text, maxWidth) => {
                    const lines = [];
                    const paragraphs = String(text || '').split('\n');
                    paragraphs.forEach(para => {
                        let currentLine = '';
                        for (let char of para) {
                            const testLine = currentLine + char;
                            if (ctx.measureText(testLine).width > maxWidth && currentLine.length > 0) {
                                lines.push(currentLine);
                                currentLine = char;
                            } else {
                                currentLine = testLine;
                            }
                        }
                        lines.push(currentLine);
                    });
                    return lines;
                };

                const textLines = wrapText(post.text || '', contentWidth);
                let estimatedHeight = 160 + textLines.length * 44 + 160;
                
                // Load all data images for the export.
                const exportImages = getIcityPostImages(post).filter(src => /^data:image\//i.test(src));
                const exportImageLayout = getIcityImageLayout(post);
                const exportColumns = exportImageLayout === 'single-column'
                    ? 1
                    : (exportImageLayout === 'two-column' ? 2 : (exportImageLayout === 'three-column' ? 3 : Math.min(exportImages.length, 3)));
                const exportGap = 16;
                const exportCellWidth = (contentWidth - exportGap * (exportColumns - 1)) / exportColumns;
                const exportCellHeight = exportColumns === 1 ? 340 : 240;
                const exportRows = exportImages.length ? Math.ceil(exportImages.length / exportColumns) : 0;
                const exportImageElements = [];
                for (const src of exportImages) {
                    const image = new Image();
                    image.src = src;
                    await new Promise(resolve => {
                        image.onload = resolve;
                        image.onerror = resolve;
                    });
                    if (image.complete && image.naturalWidth > 0) exportImageElements.push(image);
                }
                if (exportImageElements.length) {
                    estimatedHeight += exportRows * exportCellHeight + Math.max(0, exportRows - 1) * exportGap + 30;
                }

                // 是否有小纸条
                const notes = Array.isArray(post.notes) ? post.notes : [];
                if (notes.length > 0) {
                    estimatedHeight += notes.length * 90 + 50;
                }

                canvas.height = estimatedHeight;

                // 3. 绘制精致背景
                ctx.fillStyle = '#F5F5F7';
                ctx.fillRect(0, 0, width, canvas.height);

                // 白色日记卡片
                ctx.fillStyle = '#FFFFFF';
                ctx.shadowColor = 'rgba(0,0,0,0.06)';
                ctx.shadowBlur = 20;
                ctx.shadowOffsetY = 8;
                ctx.roundRect ? ctx.roundRect(24, 24, width - 48, canvas.height - 48, 20) : ctx.fillRect(24, 24, width - 48, canvas.height - 48);
                ctx.fill();
                ctx.shadowColor = 'transparent';

                // 4. 绘制顶栏：作者名与发布时间
                ctx.fillStyle = '#111111';
                ctx.font = 'bold 32px -apple-system, BlinkMacSystemFont, sans-serif';
                ctx.fillText(post.user || 'Diary 市民', padding + 10, 86);

                ctx.fillStyle = '#8E8E93';
                ctx.font = '22px -apple-system, BlinkMacSystemFont, sans-serif';
                ctx.fillText(post.time ? `${post.time} · Diary 我的日记` : 'Diary 我的日记', padding + 10, 122);

                // 5. 绘制正文
                ctx.fillStyle = '#222222';
                ctx.font = '28px -apple-system, BlinkMacSystemFont, sans-serif';
                let currentY = 180;
                textLines.forEach(line => {
                    ctx.fillText(line, padding + 10, currentY);
                    currentY += 44;
                });

                // Draw the selected images using the saved layout.
                if (exportImageElements.length) {
                    currentY += 10;
                    exportImageElements.forEach((image, index) => {
                        const row = Math.floor(index / exportColumns);
                        const column = index % exportColumns;
                        const x = padding + 10 + column * (exportCellWidth + exportGap);
                        const y = currentY + row * (exportCellHeight + exportGap);
                        ctx.drawImage(image, x, y, exportCellWidth, exportCellHeight);
                    });
                    currentY += exportRows * exportCellHeight + Math.max(0, exportRows - 1) * exportGap;
                }

                // 7. 绘制小纸条
                if (notes.length > 0) {
                    currentY += 20;
                    ctx.strokeStyle = '#E5E5EA';
                    ctx.lineWidth = 1;
                    ctx.beginPath();
                    ctx.moveTo(padding + 10, currentY);
                    ctx.lineTo(width - padding - 10, currentY);
                    ctx.stroke();
                    currentY += 34;

                    notes.forEach(note => {
                        ctx.fillStyle = '#007AFF';
                        ctx.font = 'bold 20px -apple-system, BlinkMacSystemFont, sans-serif';
                        ctx.fillText('📌 小纸条', padding + 10, currentY);
                        ctx.fillStyle = '#333333';
                        ctx.font = '24px -apple-system, BlinkMacSystemFont, sans-serif';
                        ctx.fillText(note.text || '', padding + 110, currentY);
                        currentY += 46;
                    });
                }

                // 8. 绘制底部 Diary Watermark
                currentY += 30;
                ctx.fillStyle = '#C7C7CC';
                ctx.font = '20px -apple-system, BlinkMacSystemFont, sans-serif';
                ctx.fillText('来自 Diary · 每一天的生活刻度', padding + 10, currentY);

                // 9. 导出下载
                const dataUrl = canvas.toDataURL('image/png');
                const downloadLink = document.createElement('a');
                downloadLink.download = `Diary_Diary_${post.id}.png`;
                downloadLink.href = dataUrl;
                downloadLink.click();

                if (typeof window.showToast === 'function') window.showToast('日记图片已成功导出！');
            } catch (err) {
                console.error('导出日记图片失败:', err);
                if (typeof window.showToast === 'function') window.showToast('导出失败，请重试');
            }
        });
    }

    const btnNoteAction = $('.single-action-btn.btn-note');
    const modalNote = $('#modal-note');
    const closeNote = $('#close-note');
    const btnSendNote = $('#btn-send-note');

    if (btnNoteAction && modalNote) {
        btnNoteAction.addEventListener('click', () => {
            modalNote.classList.add('active');
            setTimeout(() => {
                const textarea = modalNote.querySelector('.note-textarea');
                if(textarea) textarea.focus();
            }, 100);
        });

        if(closeNote) {
            closeNote.addEventListener('click', () => {
                modalNote.classList.remove('active');
            });
        }

        if(btnSendNote) {
            btnSendNote.addEventListener('click', async () => {
                const text = modalNote.querySelector('.note-textarea').value.trim();
                const imgSrc = modalNote.querySelector('.preview-img').getAttribute('src');
                const loc = modalNote.querySelector('.location-text-top').textContent;
                
                if (!text && (!imgSrc || imgSrc === '')) {
                    showIcityFeedback('写点什么或者发张图片吧！');
                    return;
                }
                
                if (!window.currentSinglePostId) return;
                
                let feeds = await getFeeds();
                const index = feeds.findIndex(p => p.id == window.currentSinglePostId);
                if (index !== -1) {
                    if (!feeds[index].notes) feeds[index].notes = [];
                    
                    if (window.editingNoteId) {
                        const noteIndex = feeds[index].notes.findIndex(n => n.id == window.editingNoteId);
                        if (noteIndex !== -1) {
                            feeds[index].notes[noteIndex].text = text;
                            feeds[index].notes[noteIndex].img = imgSrc;
                            feeds[index].notes[noteIndex].location = loc;
                        }
                        window.editingNoteId = null;
                    } else {
                        const now = new Date();
                        const hours = String(now.getHours()).padStart(2, '0');
                        const minutes = String(now.getMinutes()).padStart(2, '0');
                        const timeString = `${now.getFullYear()}-${String(now.getMonth()+1).padStart(2,'0')}-${String(now.getDate()).padStart(2,'0')} ${hours}:${minutes}`;
                        
                        feeds[index].notes.push({
                            id: Date.now(), 
                            text: text,
                            img: imgSrc,
                            location: loc,
                            time: timeString,
                            isPinned: false 
                        });
                    }
                    
                    await saveFeed(feeds[index]);
                    
                    openSinglePost(window.currentSinglePostId);
                    renderAllFeeds(); 
                }
                
                modalNote.querySelector('.note-textarea').value = '';
                modalNote.querySelector('.note-title-input').value = '';
                const btnRemoveImg = modalNote.querySelector('.remove-img-btn');
                if(btnRemoveImg) btnRemoveImg.click();
                const clearLocBtn = modalNote.querySelector('.clear-loc-btn');
                if(clearLocBtn) clearLocBtn.click();
                
                modalNote.classList.remove('active');
            });
        }
    }

    const btnLikeAction = $('.single-action-btn.btn-like');
    if (btnLikeAction) {
        btnLikeAction.addEventListener('click', async function() {
            if (!window.currentSinglePostId) return;
            let feeds = await getFeeds();
            const index = feeds.findIndex(p => p.id == window.currentSinglePostId);
            if (index === -1) return;

            const svg = this.querySelector('svg');
            if (this.classList.contains('liked')) {
                this.classList.remove('liked');
                svg.style.fill = 'none';
                svg.style.stroke = 'currentColor';
                this.style.color = '#B3B3B3';
                feeds[index].isLiked = false;
            } else {
                this.classList.add('liked');
                svg.style.fill = '#FF3B30';
                svg.style.stroke = '#FF3B30';
                this.style.color = '#FF3B30';
                feeds[index].isLiked = true;
            }
            await saveFeed(feeds[index]);
            renderAllFeeds();
        });
    }

    const menuDelete = $('#menu-delete');
    if (menuDelete) {
        menuDelete.addEventListener('click', async () => {
            if (!window.currentSinglePostId) return;
            if (confirm('确定要删除这篇日记吗？')) {
                await deleteFeed(window.currentSinglePostId);
                renderAllFeeds();
                
                if(popoverMenu) popoverMenu.style.display = 'none';
                if(menuOverlay) menuOverlay.style.display = 'none';
                const viewSinglePost = $('#view-single-post');
                if(viewSinglePost) viewSinglePost.classList.remove('active');
                if(mainBottomNav) mainBottomNav.style.display = 'flex';
                switchView(previousView);
            }
        });
    }

    const menuEdit = $('#menu-edit');
    if (menuEdit) {
        menuEdit.addEventListener('click', async () => {
            if (!window.currentSinglePostId) return;
            const feeds = await getFeeds();
            const post = feeds.find(p => p.id == window.currentSinglePostId);
            if (post) {
                window.editingPostId = post.id;
                const publishModal = $('#publish-modal');
                if(publishModal) {
                    ensureIcityDiaryDateControl(publishModal);
                    setIcityDiaryDateControl(publishModal, post);
                    const textarea = publishModal.querySelector('.editor-textarea');
                    if(textarea) textarea.value = post.text;
                    
                    const btnCamera = publishModal.querySelector('.btn-camera');
                    setIcityEditorImages(publishModal, getIcityPostImages(post), getIcityImageLayout(post));
                    if (btnCamera) btnCamera.classList.toggle('active', getIcityPostImages(post).length > 0);
                    const locDisplay = publishModal.querySelector('.selected-location-display');
                    const locText = publishModal.querySelector('.location-text-top');
                    const btnLocation = publishModal.querySelector('.btn-location');
                    if (post.location) {
                        if(locText) locText.textContent = post.location;
                        if(locDisplay) locDisplay.style.display = 'flex';
                        if(btnLocation) btnLocation.classList.add('active');
                    } else {
                        if(locText) locText.textContent = '';
                        if(locDisplay) locDisplay.style.display = 'none';
                        if(btnLocation) btnLocation.classList.remove('active');
                    }

                    const displayDiary = publishModal.querySelector('.display-diary');
                    const btnDiary = publishModal.querySelector('.btn-diary');
                    if (post.diary) {
                        if(displayDiary) displayDiary.textContent = post.diary;
                        if(btnDiary) btnDiary.classList.add('active');
                    } else {
                        if(displayDiary) displayDiary.textContent = '';
                        if(btnDiary) btnDiary.classList.remove('active');
                    }

                    const publicStatus = publishModal.querySelector('.public-status');
                    if (publicStatus) updateIcityVisibilityButton(publicStatus, post.visibility || '公开');
                    publishModal.classList.add('active');
                }
                if(popoverMenu) popoverMenu.style.display = 'none';
                if(menuOverlay) menuOverlay.style.display = 'none';
            }
        });
    }

    const menuPin = $('#menu-pin');
    if (menuPin) {
        menuPin.addEventListener('click', async () => {
            if (!window.currentSinglePostId) return;
            let feeds = await getFeeds();
            const index = feeds.findIndex(p => p.id == window.currentSinglePostId);
            if (index !== -1) {
                feeds[index].isPinned = !feeds[index].isPinned;
                await saveFeed(feeds[index]);
                renderAllFeeds();
                
                menuPin.innerHTML = `<svg class="icon-green" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="17" x2="12" y2="22"></line><path d="M5 17h14v-1.76a2 2 0 0 0-1.11-1.79l-1.78-.9A2 2 0 0 1 15 10.6V6a3 3 0 0 0-3-3h0a3 3 0 0 0-3 3v4.6a2 2 0 0 1-1.11 1.79l-1.78.9A2 2 0 0 0 5 15.24Z"></path></svg>
                                    ${feeds[index].isPinned ? '取消置顶' : '置顶日记'}`;
                showIcityFeedback(feeds[index].isPinned ? '已置顶' : '已取消置顶');
            }
            if(popoverMenu) popoverMenu.style.display = 'none';
            if(menuOverlay) menuOverlay.style.display = 'none';
        });
    }

    const menuDiary = $('#menu-diary');
    if (menuDiary) {
        menuDiary.addEventListener('click', () => {
            if (!window.currentSinglePostId) return;
            window.modifyingDiaryPostId = window.currentSinglePostId;
            loadDiariesToModal();
            const modalDiary = $('#modal-diary');
            if(modalDiary) modalDiary.classList.add('active');
            if(popoverMenu) popoverMenu.style.display = 'none';
            if(menuOverlay) menuOverlay.style.display = 'none';
        });
    }

    const btnConfirmDiaryReplace = $('#btn-confirm-diary');
    if(btnConfirmDiaryReplace) {
        const newBtnConfirmDiary = btnConfirmDiaryReplace.cloneNode(true);
        btnConfirmDiaryReplace.parentNode.replaceChild(newBtnConfirmDiary, btnConfirmDiaryReplace);
        
        newBtnConfirmDiary.addEventListener('click', async () => {
            if (window.tempSelectedDiary) {
                if (window.modifyingDiaryPostId) {
                    let feeds = await getFeeds();
                    const index = feeds.findIndex(p => p.id == window.modifyingDiaryPostId);
                    if (index !== -1) {
                        feeds[index].diary = window.tempSelectedDiary;
                        feeds[index].diaryId = window.tempSelectedDiaryId || feeds[index].diaryId || '';
                        await saveFeed(feeds[index]);
                        renderAllFeeds();
                        showIcityFeedback('已修改日记本为：' + window.tempSelectedDiary);
                    }
                    window.modifyingDiaryPostId = null;
                } else if (currentActiveEditor) {
                    const displayDiary = currentActiveEditor.querySelector('.display-diary');
                    const btnDiary = currentActiveEditor.querySelector('.btn-diary');
                    if(displayDiary) displayDiary.textContent = window.tempSelectedDiary;
                    if(btnDiary) btnDiary.classList.add('active');
                }
            }
            const modalDiary = $('#modal-diary');
            if(modalDiary) modalDiary.classList.remove('active');
        });
    }

    const menuVisibility = $('#menu-visibility');
    if (menuVisibility) {
        menuVisibility.addEventListener('click', async () => {
            if (!window.currentSinglePostId) return;
            let feeds = await getFeeds();
            const index = feeds.findIndex(p => p.id == window.currentSinglePostId);
            if (index !== -1) {
                const options = ['公开', '仅好友可见', '私人'];
                let currentIdx = options.indexOf(feeds[index].visibility);
                if (currentIdx === -1) currentIdx = 0;
                const nextIdx = (currentIdx + 1) % options.length;
                feeds[index].visibility = options[nextIdx];
                
                await saveFeed(feeds[index]);
                renderAllFeeds();
                showIcityFeedback('权限已修改为：' + options[nextIdx]);
            }
            if(popoverMenu) popoverMenu.style.display = 'none';
            if(menuOverlay) menuOverlay.style.display = 'none';
        });
    }

    // ================= 交互 11：日记本详情页更多操作菜单 =================
    const btnDiaryDetailMore = $('#btn-diary-detail-more');
    const diaryDetailMenu = $('#diary-detail-menu');
    
    if (btnDiaryDetailMore && diaryDetailMenu) {
        btnDiaryDetailMore.addEventListener('click', (e) => {
            e.stopPropagation();
            if (diaryDetailMenu.style.display === 'none') {
                diaryDetailMenu.style.display = 'flex';
                if(menuOverlay) menuOverlay.style.display = 'block';
            } else {
                diaryDetailMenu.style.display = 'none';
                if(menuOverlay) menuOverlay.style.display = 'none';
            }
        });

        const menuDiaryDelete = $('#menu-diary-delete');
        if(menuDiaryDelete) {
            menuDiaryDelete.addEventListener('click', () => {
                if (!window.currentDiaryBook) return;
                if (confirm('确定要删除这个日记本吗？')) {
                    deleteDiary(window.currentDiaryBook.id).then(() => {
                        currentIcityDiaryBookDateKey = null;
                        currentIcityDiaryBookTab = 'diary';
                        currentIcityDiaryBookRenderToken += 1;
                        window.currentDiaryBook = null;
                        refreshDiaryList();
                        const viewDiaryDetail = $('#view-diary-detail');
                        if(viewDiaryDetail) viewDiaryDetail.classList.remove('active');
                        if(mainBottomNav) mainBottomNav.style.display = 'flex';
                        switchView('message');
                    });
                }
                diaryDetailMenu.style.display = 'none';
                if(menuOverlay) menuOverlay.style.display = 'none';
            });
        }

        const menuDiaryEdit = $('#menu-diary-edit');
        if(menuDiaryEdit) {
            menuDiaryEdit.addEventListener('click', () => {
                if (!window.currentDiaryBook) return;
                
                const inputDiaryName = $('#input-diary-name');
                const textVisibility = $('#text-visibility');
                if(inputDiaryName) inputDiaryName.value = window.currentDiaryBook.name;
                selectedDiaryVisibility = normalizeIcityVisibility(window.currentDiaryBook.visibility || '公开');
                if(textVisibility) textVisibility.textContent = selectedDiaryVisibility;
                
                selectedCoverBg = window.currentDiaryBook.coverBg;
                $$('.create-diary-cover-item').forEach(c => c.classList.remove('selected'));
                let found = false;
                $$('.create-diary-cover-item').forEach(c => {
                    if (c.id !== 'btn-custom-cover' && window.getComputedStyle(c).background === selectedCoverBg) {
                        c.classList.add('selected');
                        found = true;
                    }
                });
                if (!found) {
                    const btnCustom = $('#btn-custom-cover');
                    if(btnCustom) {
                        btnCustom.classList.add('selected');
                        btnCustom.style.backgroundImage = selectedCoverBg;
                        btnCustom.innerHTML = '';
                    }
                }
                
                window.editingDiaryBookId = window.currentDiaryBook.id;
                
                const createDiaryModal = $('#create-diary-modal');
                if(createDiaryModal) createDiaryModal.classList.add('active');
                
                diaryDetailMenu.style.display = 'none';
                if(menuOverlay) menuOverlay.style.display = 'none';
            });
        }

        const menuDiaryPin = $('#menu-diary-pin');
        if(menuDiaryPin) {
            menuDiaryPin.addEventListener('click', () => {
                if (!window.currentDiaryBook) return;
                window.currentDiaryBook.isPinned = !window.currentDiaryBook.isPinned;
                saveDiary(window.currentDiaryBook).then(() => {
                    refreshDiaryList();
                    
                    menuDiaryPin.innerHTML = `<svg class="icon-green" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="17" x2="12" y2="22"></line><path d="M5 17h14v-1.76a2 2 0 0 0-1.11-1.79l-1.78-.9A2 2 0 0 1 15 10.6V6a3 3 0 0 0-3-3h0a3 3 0 0 0-3 3v4.6a2 2 0 0 1-1.11 1.79l-1.78.9A2 2 0 0 0 5 15.24Z"></path></svg>
                                        ${window.currentDiaryBook.isPinned ? '取消置顶' : '置顶日记本'}`;
                    showIcityFeedback(window.currentDiaryBook.isPinned ? '已置顶日记本' : '已取消置顶');
                });
                diaryDetailMenu.style.display = 'none';
                if(menuOverlay) menuOverlay.style.display = 'none';
            });
        }

        const menuDiaryVisibility = $('#menu-diary-visibility');
        if(menuDiaryVisibility) {
            menuDiaryVisibility.addEventListener('click', () => {
                if (!window.currentDiaryBook) return;
                diaryDetailMenu.style.display = 'none';
                if(menuOverlay) menuOverlay.style.display = 'none';
                openIcityVisibilityPicker(window.currentDiaryBook.visibility, value => {
                    window.currentDiaryBook.visibility = normalizeIcityVisibility(value);
                    saveDiary(window.currentDiaryBook).then(() => {
                        const visibilityEl = $('#detail-page-visibility');
                        if(visibilityEl) visibilityEl.innerHTML = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg> ' + window.currentDiaryBook.visibility;
                        if (typeof window.showToast === 'function') window.showToast('日记本权限已修改为：' + window.currentDiaryBook.visibility);
                        renderIcityDiaryBookDetail(window.currentDiaryBook, currentIcityDiaryBookTab).catch(error => console.error('Failed to refresh diary book visibility', error));
                    });
                });
            });
        }

        const menuDiaryAiSummary = $('#menu-diary-ai-summary');
        if (menuDiaryAiSummary) {
            menuDiaryAiSummary.addEventListener('click', () => {
                diaryDetailMenu.style.display = 'none';
                if (menuOverlay) menuOverlay.style.display = 'none';
                runIcityDiaryBookAiAction('summary');
            });
        }

        const menuDiaryExportPdf = $('#menu-diary-export-pdf');
        if (menuDiaryExportPdf) {
            menuDiaryExportPdf.addEventListener('click', () => {
                diaryDetailMenu.style.display = 'none';
                if (menuOverlay) menuOverlay.style.display = 'none';
                stage10OpenPdfExportPanel('book', window.currentDiaryBook || null);
            });
        }

        const menuDiaryExportVideo = $('#menu-diary-export-video');
        if (menuDiaryExportVideo) {
            menuDiaryExportVideo.addEventListener('click', () => {
                diaryDetailMenu.style.display = 'none';
                if (menuOverlay) menuOverlay.style.display = 'none';
                stage11OpenVideoExportPanel('book', window.currentDiaryBook || null);
            });
        }

        const menuDiaryInvite = $('#menu-diary-invite');
        if(menuDiaryInvite) {
            menuDiaryInvite.addEventListener('click', async () => {
                diaryDetailMenu.style.display = 'none';
                if(menuOverlay) menuOverlay.style.display = 'none';
                
                if (!window.currentDiaryBook) return;
                
                const modalInvite = $('#modal-invite-coauthor');
                const inviteContainer = $('#invite-coauthor-list-container');
                const closeInvite = $('#close-invite-coauthor-modal');
                
                if (!modalInvite || !inviteContainer) return;
                modalInvite.classList.add('active');
                
                if (closeInvite) {
                    closeInvite.onclick = () => modalInvite.classList.remove('active');
                }

                const [contactsData, wechatContactsData] = await Promise.all([getContactsData(), getWechatContactsData()]);
                const candidates = getDiaryCharacterCandidates(contactsData, wechatContactsData);
                const currentCollaborators = Array.isArray(window.currentDiaryBook.collaboratorIds) ? window.currentDiaryBook.collaboratorIds : [];

                if (!candidates.length) {
                    inviteContainer.innerHTML = '<div style="padding: 24px; text-align: center; color: var(--text-light); font-size: 13px;">暂无可选的市民角色</div>';
                    return;
                }

                inviteContainer.innerHTML = candidates.map(c => {
                    const cid = String(c.id || '');
                    const isJoined = currentCollaborators.includes(cid);
                    const avatarCss = getIcityAvatarStyle(c.avatar);
                    return `
                        <div class="card-box" style="margin: 0 0 8px 0; padding: 12px; display: flex; align-items: center; justify-content: space-between; background: var(--white);">
                            <div style="display: flex; align-items: center; gap: 10px;">
                                <div class="avatar" style="${avatarCss}; width: 36px; height: 36px;"></div>
                                <div>
                                    <div style="font-size: 14px; font-weight: 600; color: var(--text-main);">${escapeIcityHtml(c.name)}</div>
                                    <div style="font-size: 11px; color: var(--text-light);">${escapeIcityHtml(c.persona ? c.persona.slice(0, 18) : '市民')}</div>
                                </div>
                            </div>
                            <button type="button" class="btn-toggle-coauthor" data-cid="${cid}" style="padding: 5px 12px; border-radius: 12px; border: none; font-size: 12px; font-weight: 600; cursor: pointer; ${isJoined ? 'background: #E5E5EA; color: var(--text-sub);' : 'background: #34C759; color: #FFF;'}">
                                ${isJoined ? '已加入合写' : '邀请合写'}
                            </button>
                        </div>
                    `;
                }).join('');

                inviteContainer.querySelectorAll('.btn-toggle-coauthor').forEach(btn => {
                    btn.onclick = async () => {
                        const cid = btn.dataset.cid;
                        let collabs = Array.isArray(window.currentDiaryBook.collaboratorIds) ? [...window.currentDiaryBook.collaboratorIds] : [];
                        if (collabs.includes(cid)) {
                            collabs = collabs.filter(id => id !== cid);
                            btn.textContent = '邀请合写';
                            btn.style.background = '#34C759';
                            btn.style.color = '#FFF';
                            if (typeof window.showToast === 'function') window.showToast('已取消该角色合写资格');
                        } else {
                            collabs.push(cid);
                            btn.textContent = '已加入合写';
                            btn.style.background = '#E5E5EA';
                            btn.style.color = 'var(--text-sub)';
                            if (typeof window.showToast === 'function') window.showToast('已成功邀请角色共同合写！');
                        }
                        window.currentDiaryBook.collaboratorIds = collabs;
                        await saveDiary(window.currentDiaryBook);
                    };
                });
            });
        }
    }

    // ================= 交互 12：小纸条菜单全局事件委托 =================
    document.addEventListener('click', function(e) {
        if (e.target.closest('.note-popover-menu') && !e.target.closest('.menu-item')) {
            e.stopPropagation();
            return;
        }

        const moreBtn = e.target.closest('.note-more-btn');
        if (moreBtn) {
            e.stopPropagation();
            const noteId = moreBtn.getAttribute('data-note-id');
            const menu = $('#note-menu-' + noteId);
            const overlay = $('#menuOverlay');
            
            $$('.note-popover-menu').forEach(m => m.style.display = 'none');
            
            if (menu && menu.style.display === 'none') {
                menu.style.display = 'flex';
                if(overlay) overlay.style.display = 'block';
            } else if(menu) {
                menu.style.display = 'none';
                if(overlay) overlay.style.display = 'none';
            }
            return;
        }

        const deleteBtn = e.target.closest('.note-menu-delete');
        if (deleteBtn) {
            e.stopPropagation();
            const noteId = deleteBtn.getAttribute('data-note-id');
            if (confirm('确定要删除这张小纸条吗？')) {
                getFeeds().then(feeds => {
                    const postIndex = feeds.findIndex(p => p.id == window.currentSinglePostId);
                    if (postIndex !== -1) {
                        feeds[postIndex].notes = feeds[postIndex].notes.filter(n => n.id != noteId);
                        saveFeed(feeds[postIndex]).then(() => {
                            openSinglePost(window.currentSinglePostId);
                            renderAllFeeds(); 
                        });
                    }
                });
            }
            $$('.note-popover-menu').forEach(m => m.style.display = 'none');
            const overlay = $('#menuOverlay');
            if(overlay) overlay.style.display = 'none';
            return;
        }

        const pinBtn = e.target.closest('.note-menu-pin');
        if (pinBtn) {
            e.stopPropagation();
            const noteId = pinBtn.getAttribute('data-note-id');
            getFeeds().then(feeds => {
                const postIndex = feeds.findIndex(p => p.id == window.currentSinglePostId);
                if (postIndex !== -1) {
                    const noteIndex = feeds[postIndex].notes.findIndex(n => n.id == noteId);
                    if (noteIndex !== -1) {
                        feeds[postIndex].notes[noteIndex].isPinned = !feeds[postIndex].notes[noteIndex].isPinned;
                        saveFeed(feeds[postIndex]).then(() => {
                            openSinglePost(window.currentSinglePostId);
                        });
                    }
                }
            });
            $$('.note-popover-menu').forEach(m => m.style.display = 'none');
            const overlay = $('#menuOverlay');
            if(overlay) overlay.style.display = 'none';
            return;
        }

        const editBtn = e.target.closest('.note-menu-edit');
        if (editBtn) {
            e.stopPropagation();
            const noteId = editBtn.getAttribute('data-note-id');
            getFeeds().then(feeds => {
                const postIndex = feeds.findIndex(p => p.id == window.currentSinglePostId);
                if (postIndex !== -1) {
                    const note = feeds[postIndex].notes.find(n => n.id == noteId);
                    if (note) {
                        window.editingNoteId = noteId; 
                        
                        const modalNote = $('#modal-note');
                        if(modalNote) {
                            const textarea = modalNote.querySelector('.note-textarea');
                            if(textarea) textarea.value = note.text || '';
                            
                            const previewArea = modalNote.querySelector('.image-preview-area');
                            const previewImg = modalNote.querySelector('.preview-img');
                            const btnCamera = modalNote.querySelector('.btn-camera');
                            if (note.img) {
                                if(previewImg) previewImg.src = note.img;
                                if(previewArea) previewArea.style.display = 'block';
                                if(btnCamera) btnCamera.classList.add('active');
                            } else {
                                if(previewImg) previewImg.src = '';
                                if(previewArea) previewArea.style.display = 'none';
                                if(btnCamera) btnCamera.classList.remove('active');
                            }

                            const locDisplay = modalNote.querySelector('.selected-location-display');
                            const locText = modalNote.querySelector('.location-text-top');
                            const btnLocation = modalNote.querySelector('.btn-location');
                            if (note.location) {
                                if(locText) locText.textContent = note.location;
                                if(locDisplay) locDisplay.style.display = 'flex';
                                if(btnLocation) btnLocation.classList.add('active');
                            } else {
                                if(locText) locText.textContent = '';
                                if(locDisplay) locDisplay.style.display = 'none';
                                if(btnLocation) btnLocation.classList.remove('active');
                            }

                            modalNote.classList.add('active');
                        }
                    }
                }
            });
            $$('.note-popover-menu').forEach(m => m.style.display = 'none');
            const overlay = $('#menuOverlay');
            if(overlay) overlay.style.display = 'none';
            return;
        }
    });

    // ================= 交互 13：发送评论 =================
    const btnSendComment = $('.single-post-comment-send');
    const inputComment = $('.single-post-comment-input');
    let isSendingSinglePostComment = false;

    // Read the shared keyboard inset so only the diary comment bar moves.
    function updateSinglePostKeyboardOffset() {
        const singlePostView = $('#view-single-post');
        if (!singlePostView) return;
        const inset = getComputedStyle(document.documentElement)
            .getPropertyValue('--keyboard-inset-bottom')
            .trim() || '0px';
        singlePostView.style.setProperty('--icity-keyboard-offset', inset);
    }

    window.addEventListener('tonghuaji-keyboard-viewport-change', updateSinglePostKeyboardOffset);
    
    async function submitSinglePostComment() {
        if (!inputComment || isSendingSinglePostComment) return;
        const text = inputComment.value.trim();
        if (!text) {
            if (typeof window.showToast === 'function') window.showToast('请输入评论内容');
            else showIcityFeedback('请输入评论内容');
            return;
        }

        const postId = window.currentSinglePostId;
        if (postId == null) {
            if (typeof window.showToast === 'function') window.showToast('当前日记不可评论');
            return;
        }

        isSendingSinglePostComment = true;
        if (btnSendComment) {
            btnSendComment.disabled = true;
            btnSendComment.setAttribute('aria-busy', 'true');
        }
        try {
            const feeds = await getFeeds();
            const index = feeds.findIndex(post => post.id == postId);
            if (index === -1) {
                if (typeof window.showToast === 'function') window.showToast('未找到这篇日记');
                return;
            }
            if (!Array.isArray(feeds[index].comments)) feeds[index].comments = [];

            const now = new Date();
            const mm = String(now.getMonth() + 1).padStart(2, '0');
            const dd = String(now.getDate()).padStart(2, '0');
            const hh = String(now.getHours()).padStart(2, '0');
            const min = String(now.getMinutes()).padStart(2, '0');
            const timeString = `${mm}-${dd} ${hh}:${min}`;

            const userNameEl = $('.user-name');
            const userName = userNameEl ? userNameEl.textContent : '我';
            const avatarEl = $('.avatar-wrapper');
            let avatarStyle = 'background-image: linear-gradient(to bottom right, #888, #ccc);';
            if (avatarEl && avatarEl.style.backgroundImage) {
                const bgImg = avatarEl.style.backgroundImage.replace(/"/g, "'");
                avatarStyle = `background-image: ${bgImg}; background-size: cover; background-position: center;`;
            }

            feeds[index].comments.push({
                id: Date.now(),
                text,
                user: userName,
                avatarStyle,
                time: timeString
            });
            await saveFeed(feeds[index]);

            inputComment.value = '';
            await openSinglePost(postId);
            updateSinglePostKeyboardOffset();
            setTimeout(() => {
                const scrollArea = $('#view-single-post .content-scroll');
                if (scrollArea) scrollArea.scrollTop = scrollArea.scrollHeight;
            }, 100);
        } catch (error) {
            console.error('Diary comment submission failed:', error);
            if (typeof window.showToast === 'function') window.showToast('评论发送失败，请重试');
        } finally {
            isSendingSinglePostComment = false;
            if (btnSendComment) {
                btnSendComment.disabled = false;
                btnSendComment.removeAttribute('aria-busy');
            }
        }
    }

    if (btnSendComment && inputComment) {
        btnSendComment.type = 'button';
        btnSendComment.setAttribute('aria-label', '发送评论');
        bindIcityTap(btnSendComment, submitSinglePostComment);
        inputComment.addEventListener('keydown', event => {
            if (event.key !== 'Enter' || event.isComposing) return;
            event.preventDefault();
            submitSinglePostComment();
        });
    }

    // ================= 交互 14：评论区折叠与菜单操作 =================
    document.addEventListener('click', function(e) {
        const commentsHeader = e.target.closest('.comments-header');
        if (commentsHeader) {
            const container = $('#single-post-comments-container');
            const icon = commentsHeader.querySelector('.toggle-icon');
            if(container && icon) {
                if (container.style.display === 'none') {
                    container.style.display = 'block';
                    icon.style.transform = 'rotate(0deg)';
                } else {
                    container.style.display = 'none';
                    icon.style.transform = 'rotate(-90deg)'; 
                }
            }
            return;
        }

        const commentMoreBtn = e.target.closest('.comment-more-btn');
        if (commentMoreBtn) {
            e.stopPropagation();
            const commentId = commentMoreBtn.getAttribute('data-comment-id');
            const menu = $('#comment-menu-' + commentId);
            const overlay = $('#menuOverlay');
            
            $$('.comment-popover-menu, .note-popover-menu, #popoverMenu, #diary-detail-menu').forEach(m => m.style.display = 'none');
            
            if (menu && menu.style.display === 'none') {
                menu.style.display = 'flex';
                if(overlay) overlay.style.display = 'block';
            } else if(menu) {
                menu.style.display = 'none';
                if(overlay) overlay.style.display = 'none';
            }
            return;
        }

        const commentDeleteBtn = e.target.closest('.comment-menu-delete');
        if (commentDeleteBtn) {
            e.stopPropagation();
            const commentId = commentDeleteBtn.getAttribute('data-comment-id');
            if (confirm('确定要删除这条评论吗？')) {
                getFeeds().then(feeds => {
                    const postIndex = feeds.findIndex(p => p.id == window.currentSinglePostId);
                    if (postIndex !== -1 && feeds[postIndex].comments) {
                        feeds[postIndex].comments = feeds[postIndex].comments.filter(c => c.id != commentId);
                        saveFeed(feeds[postIndex]).then(() => {
                            openSinglePost(window.currentSinglePostId);
                        });
                    }
                });
            }
            $$('.comment-popover-menu').forEach(m => m.style.display = 'none');
            const overlay = $('#menuOverlay');
            if(overlay) overlay.style.display = 'none';
            return;
        }

        const commentEditBtn = e.target.closest('.comment-menu-edit');
        if (commentEditBtn) {
            e.stopPropagation();
            const commentId = commentEditBtn.getAttribute('data-comment-id');
            getFeeds().then(async feeds => {
                const postIndex = feeds.findIndex(p => p.id == window.currentSinglePostId);
                if (postIndex !== -1 && feeds[postIndex].comments) {
                    const comment = feeds[postIndex].comments.find(c => c.id == commentId);
                    if (comment) {
                        const newText = await icityShowPrompt('编辑评论', comment.text);
                        if (newText !== null && newText.trim() !== '') {
                            comment.text = newText.trim();
                            saveFeed(feeds[postIndex]).then(() => {
                                openSinglePost(window.currentSinglePostId);
                            });
                        }
                    }
                }
            });
            $$('.comment-popover-menu').forEach(m => m.style.display = 'none');
            const overlay = $('#menuOverlay');
            if(overlay) overlay.style.display = 'none';
            return;
        }

        const commentPinBtn = e.target.closest('.comment-menu-pin');
        if (commentPinBtn) {
            e.stopPropagation();
            const commentId = commentPinBtn.getAttribute('data-comment-id');
            getFeeds().then(feeds => {
                const postIndex = feeds.findIndex(p => p.id == window.currentSinglePostId);
                if (postIndex !== -1 && feeds[postIndex].comments) {
                    const commentIndex = feeds[postIndex].comments.findIndex(c => c.id == commentId);
                    if (commentIndex !== -1) {
                        feeds[postIndex].comments[commentIndex].isPinned = !feeds[postIndex].comments[commentIndex].isPinned;
                        saveFeed(feeds[postIndex]).then(() => {
                            openSinglePost(window.currentSinglePostId);
                        });
                    }
                }
            });
            $$('.comment-popover-menu').forEach(m => m.style.display = 'none');
            const overlay = $('#menuOverlay');
            if(overlay) overlay.style.display = 'none';
            return;
        }
    });

    // ================= 交互 15：世界页面顶栏 Tab 切换逻辑 =================
    const tabWorldAll = $('#tab-world-all');
    const tabWorldFriends = $('#tab-world-friends');
    const tabWorldNotices = $('#tab-world-notices');
    const tabWorldLikes = $('#tab-world-likes');

    const contentWorldAll = $('#content-world-all');
    const contentWorldFriends = $('#content-world-friends');
    const contentWorldNotices = $('#content-world-notices');
    const contentWorldLikes = $('#content-world-likes');

    const worldTabs = [tabWorldAll, tabWorldFriends, tabWorldNotices, tabWorldLikes];
    const worldContents = [contentWorldAll, contentWorldFriends, contentWorldNotices, contentWorldLikes];

    function switchWorldTab(activeIndex) {
        worldTabs.forEach((tab, index) => {
            if (tab) {
                if (index === activeIndex) {
                    tab.classList.add('active');
                } else {
                    tab.classList.remove('active');
                }
            }
        });

        worldContents.forEach((content, index) => {
            if (content) {
                content.style.display = (index === activeIndex) ? 'block' : 'none';
            }
        });
    }

    if (tabWorldAll) tabWorldAll.addEventListener('click', () => switchWorldTab(0));
    if (tabWorldFriends) tabWorldFriends.addEventListener('click', () => switchWorldTab(1));
    if (tabWorldNotices) tabWorldNotices.addEventListener('click', () => switchWorldTab(2));
    if (tabWorldLikes) tabWorldLikes.addEventListener('click', () => switchWorldTab(3));

    // ================= 交互 16：通讯录/私信页面顶栏 Tab 切换逻辑 =================
    const tabMsgContacts = $('#tab-msg-contacts');
    const tabMsgDms = $('#tab-msg-dms');
    const contentMsgContacts = $('#content-msg-contacts');
    const contentMsgDms = $('#content-msg-dms');
    const iconMsgContacts = $('#icon-msg-contacts');
    const iconMsgDms = $('#icon-msg-dms');

    function switchMsgTab(tabName) {
        if (tabName === 'contacts') {
            if(tabMsgContacts) tabMsgContacts.classList.add('active');
            if(tabMsgDms) tabMsgDms.classList.remove('active');
            if(contentMsgContacts) contentMsgContacts.style.display = 'block';
            if(contentMsgDms) contentMsgDms.style.display = 'none';
            if (iconMsgContacts) iconMsgContacts.style.display = 'block';
            if (iconMsgDms) iconMsgDms.style.display = 'none';
            if (typeof renderIcityContactsFriendsList === 'function') renderIcityContactsFriendsList();
        } else if (tabName === 'dms') {
            if(tabMsgDms) tabMsgDms.classList.add('active');
            if(tabMsgContacts) tabMsgContacts.classList.remove('active');
            if(contentMsgDms) contentMsgDms.style.display = 'block';
            if(contentMsgContacts) contentMsgContacts.style.display = 'none';
            if (iconMsgContacts) iconMsgContacts.style.display = 'none';
            if (iconMsgDms) iconMsgDms.style.display = 'block';
            renderIcityDmList();
        }
    }

    if (tabMsgContacts) tabMsgContacts.addEventListener('click', () => switchMsgTab('contacts'));
    if (tabMsgDms) tabMsgDms.addEventListener('click', () => switchMsgTab('dms'));

    // ================= 交互 20：日历页逻辑 =================
    const btnProfileCalendar = $('#btn-profile-calendar');
    const btnHomeCalendar = $('#btn-home-calendar');
    const viewCalendar = $('#view-calendar');
    const btnBackCalendar = $('#btn-back-calendar');
    const calendarFeed = $('#calendar-feed');
    const calCurrentYearDisplay = $('#cal-current-year-display');
    const btnCalPrevYear = $('#btn-cal-prev-year');
    const btnCalNextYear = $('#btn-cal-next-year');


    const ICITY_MONTHLY_RECORDS_KEY = 'icity_monthly_records';

    function getIcityMonthlyRecordTitle(monthKey) {
        const parts = String(monthKey || '').split('-');
        return parts.length === 2 ? parts[0] + '年' + Number(parts[1]) + '月记录' : '月度记录';
    }

    async function getIcityMonthlyRecords() {
        const stored = await getIcityData(ICITY_MONTHLY_RECORDS_KEY, []);
        return Array.isArray(stored) ? stored : [];
    }

    async function getIcityMonthlySource(monthKey) {
        const [feeds, dms] = await Promise.all([getVisibleIcityFeeds(await getFeeds()), getIcityDms()]);
        const inMonth = timestamp => getIcityMonthKey(timestamp) === monthKey;
        const monthFeeds = feeds.filter(post => inMonth(getIcityPostOccurredAt(post)));
        const interactions = monthFeeds.flatMap(post => Array.isArray(post?.comments) ? post.comments.map(comment => ({
            type: 'comment',
            user: comment.user || comment.name || '市民',
            text: comment.text || '',
            createdAt: comment.createdAt || post.createdAt || post.id
        })) : []).concat(dms.filter(message => inMonth(message.createdAt)).map(message => ({
            type: message.isFromMe ? '私信发送' : '私信收到',
            user: message.user || '联系人',
            text: message.text || '',
            createdAt: message.createdAt
        })));
        return {
            feeds: monthFeeds.map(post => ({
                id: post.id,
                user: post.user || '市民',
                text: String(post.text || '').slice(0, 1000),
                location: post.location || '',
                occurredAt: getIcityPostOccurredAt(post)
            })),
            interactions: interactions.slice(-80)
        };
    }

    function getIcityMonthlyFieldDefinitions() {
        return [
            { key: 'majorEvents', label: '本月大事', type: 'array', placeholder: '一行一件事' },
            { key: 'moodSummary', label: '情绪变化', type: 'text', placeholder: '记录本月的情绪变化' },
            { key: 'relationshipSummary', label: '重要人物与关系', type: 'text', placeholder: '记录真实发生的关系变化' },
            { key: 'books', label: '书籍', type: 'array', placeholder: '一行一项' },
            { key: 'movies', label: '电影', type: 'array', placeholder: '一行一项' },
            { key: 'series', label: '剧集', type: 'array', placeholder: '一行一项' },
            { key: 'discoveries', label: '新发现与关键词', type: 'array', placeholder: '一行一项' },
            { key: 'customText', label: '补充记录', type: 'text', placeholder: '写下你想保留的内容' }
        ];
    }

    async function saveIcityMonthlyRecord(record) {
        const records = await getIcityMonthlyRecords();
        const index = records.findIndex(item => item.monthKey === record.monthKey);
        if (index >= 0) records[index] = record;
        else records.push(record);
        await saveIcityData(ICITY_MONTHLY_RECORDS_KEY, records);
        return record;
    }

    async function generateIcityMonthlyRecord(monthKey, force) {
        const source = await getIcityMonthlySource(monthKey);
        if (!source.feeds.length && !source.interactions.length) throw new Error('这个月还没有足够的日记或互动，暂时无法生成记录');
        const records = await getIcityMonthlyRecords();
        const existing = records.find(item => item.monthKey === monthKey);
        if (existing && !force) return existing;
        const api = await getConnectedIcityApi();
        const prompt = [
            '请总结指定月份的 Diary 记录。',
            '只能使用提供的日记和真实互动，不得编造事件、关系、书籍、电影或剧集。',
            '没有证据的字段返回空数组或“暂无明确记录”。',
            '只输出 JSON，不要 Markdown。格式：{"majorEvents":[],"moodSummary":"","relationshipSummary":"","books":[],"movies":[],"series":[],"discoveries":[],"customText":""}',
            '月份：' + monthKey,
            '该月数据：' + JSON.stringify(source)
        ].join('\n');
        const content = await requestIcityChatCompletion(api, [
            { role: 'system', content: '你是 Diary 月度记录整理器，只输出结构化 JSON。' },
            { role: 'user', content: prompt }
        ], { temperature: 0.55, emptyMessage: 'API 没有返回月度记录' });
        const parsed = parseIcityJsonObject(content);
        const toArray = value => Array.isArray(value) ? value.map(item => String(item || '').trim()).filter(Boolean).slice(0, 20) : [];
        const record = {
            monthKey,
            majorEvents: toArray(parsed.majorEvents),
            moodSummary: String(parsed.moodSummary || '').trim(),
            relationshipSummary: String(parsed.relationshipSummary || '').trim(),
            books: toArray(parsed.books),
            movies: toArray(parsed.movies),
            series: toArray(parsed.series),
            discoveries: toArray(parsed.discoveries),
            customText: String(parsed.customText || '').trim(),
            generatedAt: Date.now(),
            updatedAt: Date.now()
        };
        return saveIcityMonthlyRecord(record);
    }

    function renderIcityMonthlyFields(record) {
        const container = $('#icity-monthly-record-fields');
        if (!container) return;
        const data = record || { monthKey: '', majorEvents: [], moodSummary: '', relationshipSummary: '', books: [], movies: [], series: [], discoveries: [], customText: '' };
        container.innerHTML = getIcityMonthlyFieldDefinitions().map(field => {
            const value = field.type === 'array' ? (Array.isArray(data[field.key]) ? data[field.key].join('\n') : '') : String(data[field.key] || '');
            return '<label class="icity-monthly-field"><span>' + escapeIcityHtml(field.label) + '</span><textarea data-monthly-field="' + field.key + '" placeholder="' + escapeIcityHtml(field.placeholder) + '">' + escapeIcityHtml(value) + '</textarea></label>';
        }).join('');
    }

    async function renderIcityMonthlyRecord(monthKey) {
        const panel = $('#icity-monthly-record-panel');
        const title = $('#icity-monthly-record-title');
        const sourceSummary = $('#icity-monthly-source-summary');
        if (!panel) return;
        const records = await getIcityMonthlyRecords();
        const record = records.find(item => item.monthKey === monthKey) || { monthKey };
        const source = await getIcityMonthlySource(monthKey);
        window.currentIcityMonthlyKey = monthKey;
        if (title) title.textContent = getIcityMonthlyRecordTitle(monthKey);
        if (sourceSummary) sourceSummary.textContent = '本月有 ' + source.feeds.length + ' 篇可见日记、' + source.interactions.length + ' 条真实互动';
        renderIcityMonthlyFields(record);
        panel.style.display = 'block';
        if (calendarFeed) calendarFeed.style.display = 'none';
        const annualCardBtn = $('#btn-calendar-annual-card');
        if (annualCardBtn) annualCardBtn.style.display = 'none';
    }

    async function openIcityMonthlyRecord(monthKey) {
        $$('.view-container').forEach(view => view.classList.remove('active'));
        if (mainBottomNav) mainBottomNav.style.display = 'none';
        if (viewCalendar) viewCalendar.classList.add('active');
        await renderIcityMonthlyRecord(monthKey);
    }

    async function refreshIcityHomeMonthlyRecord() {
        const monthKey = getIcityMonthKey(new Date());
        const records = await getIcityMonthlyRecords();
        const record = records.find(item => item.monthKey === monthKey);
        const label = $('#icity-home-month-label');
        const text = $('#icity-home-month-text');
        if (label) label.textContent = String(new Date().getMonth() + 1) + '月记录';
        if (text) text.textContent = record?.moodSummary || '本月大事记、心情、感受...';
    }

    let currentCalendarYear = new Date().getFullYear();

    async function openCalendarView() {
        rememberIcitySourceView();
        $$('.view-container').forEach(v => v.classList.remove('active'));
        if(mainBottomNav) mainBottomNav.style.display = 'none';
        
        currentCalendarYear = new Date().getFullYear();
        ensureIcityAnnualReportControls();
        await renderCalendar(currentCalendarYear);
        
        if(viewCalendar) viewCalendar.classList.add('active');
    }

    if (btnProfileCalendar) btnProfileCalendar.addEventListener('click', openCalendarView);
    if (btnHomeCalendar) btnHomeCalendar.addEventListener('click', openCalendarView);

    if (btnBackCalendar) {
        btnBackCalendar.addEventListener('click', () => {
            if(viewCalendar) {
                viewCalendar.classList.remove('active');
                const mainHeader = viewCalendar.querySelector('.header-single-post');
                if (mainHeader) mainHeader.style.display = 'flex';
            }
            restoreIcitySourceView('home');
        });
    }

    if (btnCalPrevYear) {
        btnCalPrevYear.addEventListener('click', () => {
            currentCalendarYear--;
            renderCalendar(currentCalendarYear);
        });
    }
    if (btnCalNextYear) {
        btnCalNextYear.addEventListener('click', () => {
            currentCalendarYear++;
            renderCalendar(currentCalendarYear);
        });
    }

    async function renderCalendar(targetYear) {
        if (calCurrentYearDisplay) calCurrentYearDisplay.textContent = targetYear;
        const annualCardTitle = $('#calendar-annual-card-title');
        if (annualCardTitle) annualCardTitle.textContent = `${targetYear} 年度记录`;
        const annualCardBtn = $('#btn-calendar-annual-card');
        if (annualCardBtn && !annualCardBtn.dataset.bound) {
            annualCardBtn.dataset.bound = 'true';
            bindIcityTap(annualCardBtn, () => openIcityAnnualReport(currentCalendarYear));
        }
        const [feeds, records] = await Promise.all([getVisibleIcityFeeds(await getFeeds()), getIcityMonthlyRecords()]);
        const diaryDates = new Set();
        feeds.forEach(post => {
            const dateKey = getIcityDateKey(getIcityPostOccurredAt(post));
            if (dateKey) diaryDates.add(dateKey);
        });

        const today = new Date();
        const realCurrentYear = today.getFullYear();
        const realCurrentMonth = today.getMonth() + 1;
        const todayStr = getIcityDateKey(today.getTime());
        const monthsToRender = [];
        for (let m = 1; m <= 12; m++) {
            monthsToRender.push({
                year: targetYear,
                month: m,
                en: ['JAN','FEB','MAR','APR','MAY','JUN','JUL','AUG','SEP','OCT','NOV','DEC'][m - 1],
                cn: ['一月','二月','三月','四月','五月','六月','七月','八月','九月','十月','十一月','十二月'][m - 1]
            });
        }

        let html = '<div class="card-box" style="margin-bottom: 20px;">';
        monthsToRender.forEach(month => {
            const monthKey = month.year + '-' + String(month.month).padStart(2, '0');
            const record = records.find(item => item.monthKey === monthKey);
            const firstDay = new Date(month.year, month.month - 1, 1).getDay();
            const daysInMonth = new Date(month.year, month.month, 0).getDate();
            let gridHtml = '';
            for (let index = 0; index < firstDay; index += 1) gridHtml += '<div class="calendar-day empty"></div>';
            let diaryCount = 0;
            for (let day = 1; day <= daysInMonth; day += 1) {
                const dateStr = getIcityDateKey(new Date(month.year, month.month - 1, day).getTime());
                const hasDiary = diaryDates.has(dateStr);
                const isToday = dateStr === todayStr;
                if (hasDiary) diaryCount += 1;
                const className = 'calendar-day' + (hasDiary ? ' has-diary' : (isToday ? ' is-today' : ''));
                gridHtml += '<button type="button" class="' + className + '" data-calendar-date="' + dateStr + '" aria-label="' + dateStr + ' 写日记">' + day + '</button>';
            }
            const description = record?.moodSummary || (record ? '已保存月度记录，点击查看' : '写点什么... 本月大事记、心情、感受...');
            html += '<div class="calendar-month-block" id="cal-month-' + monthKey + '" data-month-key="' + monthKey + '">' +
                '<div class="calendar-month-header icity-monthly-record-entry" data-month-key="' + monthKey + '">' +
                '<div class="calendar-month-tag">月度记录</div><div class="calendar-month-desc">' + escapeIcityHtml(description) + '</div>' +
                '<svg class="calendar-month-arrow" viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2"><polyline points="9 18 15 12 9 6"></polyline></svg></div>' +
                '<div class="calendar-body"><div class="calendar-left-info"><div class="calendar-month-en">' + month.en + '</div><div class="calendar-month-cn">' + month.cn + '</div><div class="calendar-year-text">' + month.year + '</div>' +
                '<div class="calendar-diary-count"><svg viewBox="0 0 24 24" width="10" height="10" fill="currentColor" stroke="none"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"></path></svg> ' + diaryCount + '</div><button type="button" class="icity-month-stream-entry" data-month-stream="' + monthKey + '">本月日记</button></div>' +
                '<div class="calendar-grid">' + gridHtml + '</div></div></div>';
        });
        html += '</div>';
        if (calendarFeed) {
            calendarFeed.innerHTML = html;
            calendarFeed.style.display = 'block';
            calendarFeed.querySelectorAll('.icity-monthly-record-entry').forEach(entry => {
                bindIcityTap(entry, () => openIcityMonthlyRecord(entry.dataset.monthKey));
            });
            calendarFeed.querySelectorAll('.calendar-day[data-calendar-date]').forEach(day => {
                bindIcityTap(day, () => openIcityDayDiaryList(day.dataset.calendarDate));
            });
            calendarFeed.querySelectorAll('[data-month-stream]').forEach(entry => {
                bindIcityTap(entry, () => openIcityMonthDiaryList(entry.dataset.monthStream));
            });
        }
        const panel = $('#icity-monthly-record-panel');
        if (panel) panel.style.display = 'none';
        const annualPanel = $('#icity-annual-report-panel');
        if (annualPanel) annualPanel.style.display = 'none';
        const calendarYearSwitcher = viewCalendar?.querySelector('.calendar-year-switcher');
        if (calendarYearSwitcher) calendarYearSwitcher.style.display = 'flex';
        if (annualCardBtn) annualCardBtn.style.display = 'flex';
        setTimeout(() => {
            const viewCalendarEl = $('#view-calendar');
            const scrollContainer = viewCalendarEl?.querySelector('.content-scroll');
            if (!scrollContainer) return;
            const monthElement = $('#cal-month-' + realCurrentYear + '-' + String(realCurrentMonth).padStart(2, '0'));
            scrollContainer.scrollTop = targetYear === realCurrentYear ? Math.max(0, (monthElement?.offsetTop || 0) - 105) : 0;
        }, 50);
    }


    if ($('#btn-back-monthly-record')) {
        bindIcityTap($('#btn-back-monthly-record'), async () => {
            const panel = $('#icity-monthly-record-panel');
            if (panel) panel.style.display = 'none';
            if (calendarFeed) calendarFeed.style.display = 'block';
            const annualCardBtn = $('#btn-calendar-annual-card');
            if (annualCardBtn) annualCardBtn.style.display = 'flex';
            await renderCalendar(currentCalendarYear);
        });
    }

    async function saveCurrentIcityMonthlyEdits() {
        const monthKey = window.currentIcityMonthlyKey;
        if (!monthKey) return;
        const records = await getIcityMonthlyRecords();
        const existing = records.find(item => item.monthKey === monthKey) || { monthKey };
        getIcityMonthlyFieldDefinitions().forEach(field => {
            const node = document.querySelector('[data-monthly-field="' + field.key + '"]');
            const value = node?.value || '';
            existing[field.key] = field.type === 'array' ? value.split('\n').map(item => item.trim()).filter(Boolean) : value.trim();
        });
        existing.updatedAt = Date.now();
        await saveIcityMonthlyRecord(existing);
        await refreshIcityHomeMonthlyRecord();
        showIcityQaToast('月度记录已保存');
        await renderIcityMonthlyRecord(monthKey);
    }

    if ($('#btn-save-monthly-record')) bindIcityTap($('#btn-save-monthly-record'), saveCurrentIcityMonthlyEdits);
    if ($('#btn-delete-monthly-record')) {
        bindIcityTap($('#btn-delete-monthly-record'), async () => {
            const monthKey = window.currentIcityMonthlyKey;
            if (!monthKey) return;
            const records = await getIcityMonthlyRecords();
            await saveIcityData(ICITY_MONTHLY_RECORDS_KEY, records.filter(item => item.monthKey !== monthKey));
            showIcityQaToast('月度记录已删除');
            await renderIcityMonthlyRecord(monthKey);
        });
    }
    const generateMonthly = async force => {
        const monthKey = window.currentIcityMonthlyKey;
        if (!monthKey) return;
        const button = force ? $('#btn-regenerate-monthly-record') : $('#btn-generate-monthly-record');
        if (button) { button.disabled = true; button.textContent = '生成中…'; }
        try {
            await generateIcityMonthlyRecord(monthKey, force);
            showIcityQaToast('月度记录已生成');
            await renderIcityMonthlyRecord(monthKey);
        } catch (error) {
            showIcityQaToast(error.message || '月度记录生成失败');
        } finally {
            if (button) { button.disabled = false; button.textContent = force ? '重新生成' : '生成记录'; }
        }
    };
    if ($('#btn-generate-monthly-record')) bindIcityTap($('#btn-generate-monthly-record'), () => generateMonthly(false));
    if ($('#btn-regenerate-monthly-record')) bindIcityTap($('#btn-regenerate-monthly-record'), () => generateMonthly(true));


    // ================= Phase 7: annual memory report =================
    const ICITY_ANNUAL_REPORTS_KEY = 'icity_annual_reports';
    let currentIcityAnnualReportYear = new Date().getFullYear();

    function getIcityAnnualYear(timestamp) {
        const date = getIcityDateObject(getIcityPostOccurredAt({ occurredAt: timestamp }));
        return Number.isNaN(date.getTime()) ? 0 : date.getFullYear();
    }

    function getIcityAnnualMonthKey(timestamp) {
        const date = getIcityDateObject(getIcityPostOccurredAt({ occurredAt: timestamp }));
        if (Number.isNaN(date.getTime())) return '';
        return date.getFullYear() + '-' + String(date.getMonth() + 1).padStart(2, '0');
    }

    function getIcityAnnualMonthLabel(monthKey) {
        const parts = String(monthKey || '').split('-');
        return parts.length === 2 ? Number(parts[1]) + '月' : '未知';
    }

    function getIcityAnnualDayStreak(feeds) {
        const dates = Array.from(new Set(feeds.map(post => getIcityDateKey(getIcityPostOccurredAt(post))).filter(Boolean))).sort();
        if (!dates.length) return 0;
        let longest = 1;
        let current = 1;
        for (let index = 1; index < dates.length; index += 1) {
            const previous = new Date(dates[index - 1] + 'T12:00:00').getTime();
            const next = new Date(dates[index] + 'T12:00:00').getTime();
            if (next - previous === 86400000) {
                current += 1;
                longest = Math.max(longest, current);
            } else {
                current = 1;
            }
        }
        return longest;
    }

    function getIcityAnnualKeywordRanking(feeds) {
        const stopWords = new Set([
            '今天', '昨天', '明天', '然后', '因为', '所以', '自己', '我们', '你们', '他们',
            '这个', '那个', '一些', '觉得', '已经', '时候', '可以', '一个', '没有', '就是',
            '以及', '还有', '现在', '日记', '记录', '真的', '事情', '什么', '怎么', '不是',
            '的话', '起来', '看到', '回来', '开始'
        ]);
        const counts = new Map();
        feeds.forEach(post => {
            const text = String(post?.text || '').toLowerCase();
            const tokens = text.match(/[\u4e00-\u9fff]{2,8}|[a-z][a-z0-9_-]{2,}/gi) || [];
            tokens.forEach(token => {
                const value = token.trim();
                if (!value || stopWords.has(value)) return;
                counts.set(value, (counts.get(value) || 0) + 1);
            });
        });
        return Array.from(counts.entries())
            .sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]))
            .slice(0, 8)
            .map(item => ({ text: item[0], count: item[1] }));
    }

    function getIcityAnnualMoodTrend(feeds) {
        const positiveWords = ['开心', '快乐', '幸福', '喜欢', '期待', '轻松', '满足', '温柔', '顺利', '惊喜', '治愈'];
        const negativeWords = ['难过', '生气', '焦虑', '疲惫', '孤独', '失落', '压力', '烦恼', '害怕', '委屈', '崩溃'];
        const monthMap = new Map();
        feeds.forEach(post => {
            const monthKey = getIcityAnnualMonthKey(getIcityPostOccurredAt(post));
            if (!monthKey) return;
            const text = String(post?.text || '') + ' ' + String(post?.mood || post?.emotion || post?.feeling || '');
            const entry = monthMap.get(monthKey) || { positive: 0, negative: 0, total: 0 };
            positiveWords.forEach(word => { if (text.includes(word)) entry.positive += 1; });
            negativeWords.forEach(word => { if (text.includes(word)) entry.negative += 1; });
            entry.total += 1;
            monthMap.set(monthKey, entry);
        });
        return Array.from(monthMap.entries()).sort((a, b) => a[0].localeCompare(b[0])).map(item => {
            const value = item[1];
            let label = '平稳';
            if (value.positive > value.negative) label = '偏积极';
            else if (value.negative > value.positive) label = '偏低落';
            return { monthKey: item[0], label, positive: value.positive, negative: value.negative, total: value.total };
        });
    }

    function getIcityAnnualAchievements(source) {
        const stats = source.stats;
        const achievements = [];
        if (stats.diaryCount > 0) achievements.push({ icon: '✍️', title: '留下第一笔', desc: '这一年认真写下了至少一篇日记' });
        if (stats.longestStreak >= 7) achievements.push({ icon: '🔥', title: '连续记录', desc: '最长连续记录 ' + stats.longestStreak + ' 天' });
        if (stats.diaryCount >= 30) achievements.push({ icon: '📚', title: '记录成册', desc: '这一年写下了至少 30 篇日记' });
        if (stats.locationCount >= 3) achievements.push({ icon: '🗺️', title: '走过不同地方', desc: '记录过 ' + stats.locationCount + ' 个地点' });
        if (stats.multiImageDiaryCount > 0) achievements.push({ icon: '🖼️', title: '图文并茂', desc: '有 ' + stats.multiImageDiaryCount + ' 篇日记使用了多图' });
        if (stats.retroactiveCount > 0) achievements.push({ icon: '🕰️', title: '把记忆补回来', desc: '补写过 ' + stats.retroactiveCount + ' 篇历史日记' });
        if (stats.likedCount >= 10) achievements.push({ icon: '💛', title: '被看见', desc: '日记获得了 ' + stats.likedCount + ' 次喜欢' });
        return achievements;
    }

    async function getIcityAnnualSource(year) {
        const [visibleFeeds, profile, authData] = await Promise.all([
            getVisibleIcityFeeds(await getFeeds()),
            getProfile(),
            getWechatAuthData()
        ]);
        const boundAccount = getBoundWechatAccount(profile, authData);
        const yearFeeds = visibleFeeds.filter(post => getIcityAnnualYear(getIcityPostOccurredAt(post)) === Number(year));
        const myFeeds = yearFeeds.filter(post => isCurrentIcityUserPost(post, boundAccount));
        const monthlyMap = new Map();
        for (let month = 1; month <= 12; month += 1) {
            const monthKey = String(year) + '-' + String(month).padStart(2, '0');
            monthlyMap.set(monthKey, { monthKey, count: 0 });
        }
        const locationMap = new Map();
        myFeeds.forEach(post => {
            const monthKey = getIcityAnnualMonthKey(getIcityPostOccurredAt(post));
            if (monthlyMap.has(monthKey)) monthlyMap.get(monthKey).count += 1;
            const location = String(post?.location || '').trim();
            if (location) locationMap.set(location, (locationMap.get(location) || 0) + 1);
        });

        const characterMap = new Map();
        yearFeeds.forEach(post => {
            if (post?.authorType !== 'character' && !post?.characterId) return;
            const name = String(post?.user || post?.authorWechatName || '角色').trim() || '角色';
            characterMap.set(name, (characterMap.get(name) || 0) + 1);
        });
        myFeeds.forEach(post => {
            (Array.isArray(post?.comments) ? post.comments : []).forEach(comment => {
                const name = String(comment?.user || comment?.name || comment?.authorName || '').trim();
                if (name) characterMap.set(name, (characterMap.get(name) || 0) + 1);
            });
        });

        const stats = {
            diaryCount: myFeeds.length,
            likedCount: myFeeds.reduce((sum, post) => sum + getIcityPostLikeCount(post), 0),
            locationCount: locationMap.size,
            commentCount: myFeeds.reduce((sum, post) => sum + (Array.isArray(post?.comments) ? post.comments.length : 0), 0),
            multiImageDiaryCount: myFeeds.filter(post => getIcityPostImages(post).length > 1).length,
            retroactiveCount: myFeeds.filter(post => post?.isRetroactive === true).length,
            longestStreak: getIcityAnnualDayStreak(myFeeds)
        };
        const monthly = Array.from(monthlyMap.values());
        const locations = Array.from(locationMap.entries()).sort((a, b) => b[1] - a[1]).slice(0, 6).map(item => ({ name: item[0], count: item[1] }));
        const characters = Array.from(characterMap.entries()).sort((a, b) => b[1] - a[1]).slice(0, 6).map(item => ({ name: item[0], count: item[1] }));
        const moodTrend = getIcityAnnualMoodTrend(myFeeds);
        const themes = getIcityAnnualKeywordRanking(myFeeds);
        const source = { year: Number(year), stats, monthly, locations, characters, moodTrend, themes, myFeeds, achievements: [] };
        source.achievements = getIcityAnnualAchievements(source);
        source.aiContext = {
            year: Number(year),
            stats,
            monthly,
            locations,
            characters,
            moodTrend,
            themes,
            entries: myFeeds.slice(0, 30).map(post => ({
                date: getIcityDateKey(getIcityPostOccurredAt(post)),
                text: String(post?.text || '').slice(0, 240)
            }))
        };
        return source;
    }

    async function getIcityAnnualReports() {
        const stored = await getIcityData(ICITY_ANNUAL_REPORTS_KEY, []);
        return Array.isArray(stored) ? stored : [];
    }

    async function saveIcityAnnualReport(report) {
        const reports = await getIcityAnnualReports();
        const index = reports.findIndex(item => Number(item?.year) === Number(report.year));
        if (index >= 0) reports[index] = report;
        else reports.push(report);
        await saveIcityData(ICITY_ANNUAL_REPORTS_KEY, reports);
        return report;
    }

    function renderIcityAnnualStat(label, value) {
        return '<div class="icity-annual-stat-card"><span>' + escapeIcityHtml(label) + '</span><strong>' + escapeIcityHtml(String(value ?? '')) + '</strong></div>';
    }

    function renderIcityAnnualReportBody(source, savedReport) {
        const stats = source.stats;
        const maxMonthCount = Math.max(1, ...source.monthly.map(item => item.count));
        const monthlyHtml = source.monthly.map(item => {
            const percent = Math.round(item.count / maxMonthCount * 100);
            return '<div class="icity-annual-month-row"><span>' + getIcityAnnualMonthLabel(item.monthKey) + '</span><div class="icity-annual-month-track"><i style="width:' + percent + '%"></i></div><strong>' + item.count + '</strong></div>';
        }).join('');
        const locationsHtml = source.locations.length ? source.locations.map(item => '<span class="icity-annual-chip">' + escapeIcityHtml(item.name) + ' · ' + item.count + '</span>').join('') : '<span class="icity-annual-muted">暂无地点记录</span>';
        const themesHtml = source.themes.length ? source.themes.map(item => '<span class="icity-annual-chip">' + escapeIcityHtml(item.text) + ' · ' + item.count + '</span>').join('') : '<span class="icity-annual-muted">暂无主题记录</span>';
        const charactersHtml = source.characters.length ? source.characters.map(item => '<span class="icity-annual-chip">' + escapeIcityHtml(item.name) + ' · ' + item.count + '</span>').join('') : '<span class="icity-annual-muted">暂无角色互动记录</span>';
        const moodHtml = source.moodTrend.length ? source.moodTrend.map(item => '<div class="icity-annual-mood-row"><span>' + getIcityAnnualMonthLabel(item.monthKey) + '</span><em>' + item.label + '</em><small>积极 ' + item.positive + ' · 低落 ' + item.negative + '</small></div>').join('') : '<span class="icity-annual-muted">暂无足够文本用于情绪趋势统计</span>';
        const achievementHtml = source.achievements.length ? source.achievements.map(item => '<div class="icity-annual-achievement"><span class="icity-annual-achievement-icon">' + item.icon + '</span><div><strong>' + escapeIcityHtml(item.title) + '</strong><small>' + escapeIcityHtml(item.desc) + '</small></div></div>').join('') : '<div class="icity-annual-muted">继续记录，解锁你的年度隐藏成就</div>';
        const savedHtml = savedReport?.summary ? '<div class="icity-annual-summary-text">' + escapeIcityHtml(savedReport.summary) + '</div><div class="icity-annual-updated">更新于 ' + escapeIcityHtml(new Date(savedReport.updatedAt || 0).toLocaleString()) + '</div>' : '<div class="icity-annual-muted">还没有 AI 年度总结。统计已经由本地数据生成，点击下方按钮可请求文字归纳。</div>';

        return '<div class="icity-annual-stats-grid">' +
            renderIcityAnnualStat('日记', stats.diaryCount) +
            renderIcityAnnualStat('被喜欢', stats.likedCount) +
            renderIcityAnnualStat('最长连续', stats.longestStreak + '天') +
            renderIcityAnnualStat('地点', stats.locationCount) +
            renderIcityAnnualStat('评论', stats.commentCount) +
            renderIcityAnnualStat('多图日记', stats.multiImageDiaryCount) +
            '</div>' +
            '<section class="icity-annual-section"><h3>月度分布</h3><div class="icity-annual-month-list">' + monthlyHtml + '</div></section>' +
            '<section class="icity-annual-section"><h3>情绪变化</h3><div class="icity-annual-mood-list">' + moodHtml + '</div></section>' +
            '<section class="icity-annual-section"><h3>常见地点</h3><div class="icity-annual-chip-list">' + locationsHtml + '</div></section>' +
            '<section class="icity-annual-section"><h3>高频主题</h3><div class="icity-annual-chip-list">' + themesHtml + '</div></section>' +
            '<section class="icity-annual-section"><h3>重要角色与关系线索</h3><div class="icity-annual-chip-list">' + charactersHtml + '</div></section>' +
            '<section class="icity-annual-section"><h3>隐藏成就</h3><div class="icity-annual-achievement-list">' + achievementHtml + '</div></section>' +
            '<section class="icity-annual-section icity-annual-summary-section"><h3>我的这一年</h3>' + savedHtml + '</section>';
    }

    function ensureIcityAnnualReportControls() {
        if (!viewCalendar) return;
        const headerRight = viewCalendar.querySelector('.header-single-post .right-placeholder');
        const legacyBtn = $('#btn-open-icity-annual-report');
        if (legacyBtn) legacyBtn.remove();
        let panel = $('#icity-annual-report-panel');
        if (!panel) {
            panel = document.createElement('section');
            panel.id = 'icity-annual-report-panel';
            panel.className = 'icity-annual-report-panel';
            panel.style.display = 'none';
            panel.innerHTML = `
                <header style="position: sticky; top: 0; z-index: 20; background: var(--bg-main); margin: 0 -6px 10px -6px;">
                    <div class="header-settings" style="height: var(--icity-compact-header-height); padding: var(--icity-top-safe-offset) 16px 8px; box-shadow: none; border-bottom: 0.5px solid var(--border-color); position: relative;">
                        <div class="back-btn" data-annual-action="back" style="cursor: pointer; width: 40px; display: flex; align-items: center;">
                            <svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round"><polyline points="15 18 9 12 15 6"></polyline></svg>
                        </div>
                        <div class="title" style="bottom: 8px; position: absolute; left: 50%; transform: translateX(-50%); font-size: 16px; font-weight: 700; color: var(--text-main);" id="icity-annual-report-title">年度回忆</div>
                        <div style="width: 40px;"></div>
                    </div>
                    <div class="calendar-year-switcher" style="padding: 10px 20px; border-radius: 0; box-shadow: none; border-bottom: 0.5px solid var(--border-color); background: var(--white); position: static;">
                        <div class="arrow-btn" data-annual-action="prev">
                            <svg viewBox="0 0 24 24"><polyline points="15 18 9 12 15 6"></polyline></svg>
                        </div>
                        <div class="year-text" id="icity-annual-report-year">2026</div>
                        <div class="arrow-btn" data-annual-action="next">
                            <svg viewBox="0 0 24 24"><polyline points="9 6 15 12 9 18"></polyline></svg>
                        </div>
                    </div>
                </header>

                <div class="card-box" style="margin: 0 0 10px 0; padding: 12px 14px; background: var(--white); display: flex; gap: 8px;">
                    <button type="button" data-annual-action="generate" style="flex: 1; height: 38px; border-radius: 6px; border: none; background: #34C759; color: #FFF; font-size: 13px; font-weight: 600; cursor: pointer;">生成年度总结</button>
                    <button type="button" data-annual-action="regenerate" style="height: 38px; padding: 0 14px; border-radius: 6px; border: 1px solid var(--border-color); background: var(--white); color: var(--text-sub); font-size: 13px; font-weight: 500; cursor: pointer;">重新生成</button>
                </div>
                <div id="icity-annual-report-body"></div>
            `;
            viewCalendar.insertBefore(panel, calendarFeed);
            panel.querySelector('[data-annual-action="back"]').addEventListener('click', () => {
                panel.style.display = 'none';
                const mainHeader = viewCalendar?.querySelector('.header-single-post');
                if (mainHeader) mainHeader.style.display = 'flex';
                if (calendarFeed) calendarFeed.style.display = 'block';
                const annualCard = $('#btn-calendar-annual-card');
                if (annualCard) annualCard.style.display = 'flex';
                const switcher = viewCalendar?.querySelector('.calendar-year-switcher');
                if (switcher) switcher.style.display = 'flex';
                renderCalendar(currentCalendarYear);
            });
            panel.querySelector('[data-annual-action="prev"]').addEventListener('click', () => {
                currentIcityAnnualReportYear -= 1;
                renderIcityAnnualReport(currentIcityAnnualReportYear);
            });
            panel.querySelector('[data-annual-action="next"]').addEventListener('click', () => {
                currentIcityAnnualReportYear += 1;
                renderIcityAnnualReport(currentIcityAnnualReportYear);
            });
            panel.querySelector('[data-annual-action="generate"]').addEventListener('click', () => generateIcityAnnualSummary(false));
            panel.querySelector('[data-annual-action="regenerate"]').addEventListener('click', () => generateIcityAnnualSummary(true));
        }
    }

    async function renderIcityAnnualReport(year) {
        ensureIcityAnnualReportControls();
        const panel = $('#icity-annual-report-panel');
        const body = $('#icity-annual-report-body');
        const title = $('#icity-annual-report-title');
        const yearNode = $('#icity-annual-report-year');
        if (!panel || !body) return;
        currentIcityAnnualReportYear = Number(year) || new Date().getFullYear();
        const [source, reports] = await Promise.all([getIcityAnnualSource(currentIcityAnnualReportYear), getIcityAnnualReports()]);
        const savedReport = reports.find(item => Number(item?.year) === currentIcityAnnualReportYear);
        if (title) title.textContent = currentIcityAnnualReportYear + ' 年度回忆';
        if (yearNode) yearNode.textContent = currentIcityAnnualReportYear;
        body.innerHTML = renderIcityAnnualReportBody(source, savedReport);
    }

    async function openIcityAnnualReport(year) {
        currentIcityAnnualReportYear = Number(year) || new Date().getFullYear();
        ensureIcityAnnualReportControls();
        const mainHeader = viewCalendar?.querySelector('.header-single-post');
        if (mainHeader) mainHeader.style.display = 'none';
        const panel = $('#icity-annual-report-panel');
        const monthlyPanel = $('#icity-monthly-record-panel');
        if (monthlyPanel) monthlyPanel.style.display = 'none';
        if (calendarFeed) calendarFeed.style.display = 'none';
        const calendarYearSwitcher = viewCalendar?.querySelector('.calendar-year-switcher');
        if (calendarYearSwitcher) calendarYearSwitcher.style.display = 'none';
        const annualCard = $('#btn-calendar-annual-card');
        if (annualCard) annualCard.style.display = 'none';
        if (panel) panel.style.display = 'block';
        await renderIcityAnnualReport(currentIcityAnnualReportYear);
    }

    async function generateIcityAnnualSummary(force) {
        const year = currentIcityAnnualReportYear;
        const source = await getIcityAnnualSource(year);
        if (!source.stats.diaryCount) {
            showIcityQaToast('这一年还没有可总结的日记');
            return;
        }
        const reports = await getIcityAnnualReports();
        if (!force && reports.some(item => Number(item?.year) === year && String(item?.summary || '').trim())) {
            await renderIcityAnnualReport(year);
            return;
        }
        const buttons = [document.querySelector('[data-annual-action="generate"]'), document.querySelector('[data-annual-action="regenerate"]')].filter(Boolean);
        buttons.forEach(button => { button.disabled = true; button.textContent = '生成中…'; });
        try {
            const api = await getConnectedIcityApi();
            const fence = String.fromCharCode(96).repeat(3);
            const content = await requestIcityChatCompletion(api, [
                { role: 'system', content: '你是 Diary 年度回忆整理器。只根据提供的记录写一段克制、具体、不夸张的中文年度总结，不编造事实。统计数字若被提及，只能使用输入中的本地统计。' },
                { role: 'user', content: '请为 ' + year + ' 年写一段“我的这一年”总结。以下统计由本地代码计算，不能修改：' + JSON.stringify(source.aiContext) }
            ], { temperature: 0.65 });
            const summary = String(content || '').replace(new RegExp('^' + fence + '(?:text|markdown)?\\s*', 'i'), '').replace(new RegExp('\\s*' + fence + '$'), '').trim().slice(0, 2200);
            if (!summary) throw new Error('AI 没有返回年度总结');
            await saveIcityAnnualReport({ year, summary, updatedAt: Date.now() });
            showIcityQaToast('年度总结已保存');
            await renderIcityAnnualReport(year);
        } catch (error) {
            showIcityQaToast(error?.message || '年度总结生成失败');
        } finally {
            buttons.forEach(button => {
                button.disabled = false;
                button.textContent = button.dataset.annualAction === 'regenerate' ? '重新生成' : '生成年度总结';
            });
        }
    }

    // ================= 交互 16.5：我来到地球的日子设置页 =================
    const viewEarthDay = $('#view-earth-day');
    const btnBackEarthDay = $('#btn-back-earth-day');
    const btnSaveEarthDay = $('#btn-save-earth-day');
    const btnSettingsEarthDay = $('#btn-settings-earth-day');
    const btnAppSettingsEarthDay = $('#btn-app-settings-earth-day');
    
    const switchEarthDayShow = $('#switch-earth-day-show');
    const inputEarthDayText = $('#input-earth-day-text');
    const inputEarthDayBirth = $('#input-earth-day-birth');
    const previewEarthDayContainer = $('#preview-earth-day-container');
    const previewEarthDayText = $('#preview-earth-day-text');
    const btnClearBirth = $('#btn-clear-birth');

    function updateEarthDayPreview() {
        if(!inputEarthDayText || !inputEarthDayBirth || !switchEarthDayShow || !previewEarthDayText) return;
        const text = inputEarthDayText.value || '来到地球第';
        const birthStr = inputEarthDayBirth.value;
        if (switchEarthDayShow.checked && birthStr) {
            const birthDate = new Date(birthStr);
            const today = new Date();
            const diffTime = today - birthDate;
            if (diffTime >= 0) {
                const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
                previewEarthDayText.textContent = `${text} ${diffDays} 天`;
                previewEarthDayText.previousElementSibling.style.display = 'inline'; 
                previewEarthDayText.style.display = 'inline';
            } else {
                previewEarthDayText.textContent = `${text} 0 天`;
                previewEarthDayText.previousElementSibling.style.display = 'inline';
                previewEarthDayText.style.display = 'inline';
            }
        } else {
            previewEarthDayText.previousElementSibling.style.display = 'none'; 
            previewEarthDayText.style.display = 'none';
        }
    }

    async function openEarthDaySettings() {
        const profileData = await getProfile();
        if(switchEarthDayShow) switchEarthDayShow.checked = profileData.earthDayEnabled !== false;
        if(inputEarthDayText) inputEarthDayText.value = profileData.earthDayText || '来到地球第';
        if(inputEarthDayBirth) inputEarthDayBirth.value = profileData.birthDate || '';
        
        updateEarthDayPreview();

        $$('.view-container').forEach(v => v.classList.remove('active'));
        if(mainBottomNav) mainBottomNav.style.display = 'none';
        if(viewEarthDay) viewEarthDay.classList.add('active');
    }

    if (btnSettingsEarthDay) btnSettingsEarthDay.addEventListener('click', openEarthDaySettings);
    if (btnAppSettingsEarthDay) btnAppSettingsEarthDay.addEventListener('click', openEarthDaySettings);

    if (btnBackEarthDay) {
        btnBackEarthDay.addEventListener('click', () => {
            if(viewEarthDay) viewEarthDay.classList.remove('active');
            const viewSettings = $('#view-settings');
            if(viewSettings) viewSettings.classList.add('active');
        });
    }

    if (btnSaveEarthDay) {
        btnSaveEarthDay.addEventListener('click', () => {
            if(switchEarthDayShow) saveProfileData('earthDayEnabled', switchEarthDayShow.checked);
            if(inputEarthDayText) saveProfileData('earthDayText', inputEarthDayText.value);
            if(inputEarthDayBirth) saveProfileData('birthDate', inputEarthDayBirth.value);
            
            const statusText = (inputEarthDayBirth && inputEarthDayBirth.value) ? '已设置' : '未设置';
            const valSettings = $('#val-settings-earth-day');
            const valAppSettings = $('#val-app-settings-earth-day');
            if (valSettings) valSettings.textContent = statusText;
            if (valAppSettings) valAppSettings.textContent = statusText;

            showIcityFeedback('保存成功');
            if(viewEarthDay) viewEarthDay.classList.remove('active');
            const viewSettings = $('#view-settings');
            if(viewSettings) viewSettings.classList.add('active');
        });
    }

    if (switchEarthDayShow) switchEarthDayShow.addEventListener('change', updateEarthDayPreview);
    if (inputEarthDayText) inputEarthDayText.addEventListener('input', updateEarthDayPreview);
    if (inputEarthDayBirth) inputEarthDayBirth.addEventListener('change', updateEarthDayPreview);
    
    if (btnClearBirth) {
        btnClearBirth.addEventListener('click', () => {
            if(inputEarthDayBirth) inputEarthDayBirth.value = '';
            updateEarthDayPreview();
        });
    }

    // ================= 交互 17：私信聊天室交互与占位按键真实逻辑注入 =================
    const btnProfileDm = $('#btn-profile-dm');
    const viewChat = $('#view-chat');
    const btnBackChat = $('#btn-back-chat');
    const btnSendChatMessage = $('#btn-send-chat-message');
    const inputChatMessage = $('#input-chat-message');

    let icityDmSending = false;
    async function sendIcityDmText(target) {
        const text = inputChatMessage?.value.trim();
        if (!target || !text) return true;
        const draft = inputChatMessage.value;
        const accountId = getIcityActiveAccountId();
        const message = normalizeIcityDmMessage({
            id: createIcityDmId('my_dm'), threadId: getIcityDmThreadId(target),
            characterId: target.characterId || null, user: target.user, handle: target.handle,
            avatar: target.avatar, text, createdAt: Date.now(), isFromMe: true,
            status: 'sent', replyStatus: 'idle', replyToPostId: null
        });
        await withIcityDataLock('icity_dms', [], stored => {
            if (accountId !== getIcityActiveAccountId()) throw new Error('账号已切换，请重新发送');
            const nextDms = Array.isArray(stored) ? stored : [];
            nextDms.push(message);
            return nextDms;
        });
        if (window.currentIcityChatTarget === target && inputChatMessage.value === draft) inputChatMessage.value = '';
        await renderIcityChatMessages();
        await renderIcityDmList();
        return true;
    }

    async function submitIcityDm(requestReply) {
        const target = window.currentIcityChatTarget;
        const hasText = Boolean(inputChatMessage?.value.trim());
        if (!target || icityDmSending) return;
        if (requestReply && !hasText) {
            if (getIcityDmReplyingSet().has(getIcityDmThreadId(target))) return;
            await generateIcityDmAutoReply(null, target);
            return;
        }
        icityDmSending = true;
        try {
            await sendIcityDmText(target);
        } catch (error) {
            showIcityFeedback(error.message || '消息未保存，请重试');
            return;
        } finally {
            icityDmSending = false;
        }
        updateIcityDmSendButton();
    }

    function updateIcityDmSendButton() {
        if (!btnSendChatMessage) return;
        const label = inputChatMessage?.value.trim() ? '发送私信' : '调取 API 生成回复';
        btnSendChatMessage.title = label;
        btnSendChatMessage.setAttribute('aria-label', label);
    }

    bindIcityTap($('#btn-send-chat-text'), () => submitIcityDm(false));
    bindIcityTap(btnSendChatMessage, () => submitIcityDm(true));
    bindIcityTap($('#btn-delete-chat-thread'), () => deleteIcityDm(window.currentIcityChatTarget));
    inputChatMessage?.addEventListener('input', updateIcityDmSendButton);
    inputChatMessage?.addEventListener('keydown', event => {
        if (event.key === 'Enter' && !event.isComposing && event.keyCode !== 229) {
            event.preventDefault();
            submitIcityDm(false);
        }
    });

    if (btnProfileDm) {
        bindIcityTap(btnProfileDm, () => {
            switchView('message');
            switchMsgTab('dms');
        });
    }

        const btnCharDm = $('#btn-char-dm');
    if (btnCharDm) {
    bindIcityTap(btnCharDm, () => {
    const charName = $('#char-profile-name')?.textContent || '角色';
    const charHandle = $('#char-profile-handle')?.textContent || '@character';
    const charAvatar = $('#char-profile-avatar')?.style?.backgroundImage || '';
    const charId = window.currentViewingProfileCharacterId || '';
    openIcityChatRoom({ characterId: charId, user: charName, handle: charHandle, avatar: charAvatar });
    });
    }

    // The relationship feature owns the character profile friend action.

    // 主页月度记录点击直达日历
    const btnMonthlyRecord = $('.card-box.monthly-record');
    if (btnMonthlyRecord) {
        bindIcityTap(btnMonthlyRecord, () => openIcityMonthlyRecord(getIcityMonthKey(new Date())));
        refreshIcityHomeMonthlyRecord();
    }

    // 主页收件盘：直达私信
    const headerIcons = $$('.header-icons svg');
    if (headerIcons[0]) {
        bindIcityTap(headerIcons[0], () => {
            switchView('message');
            switchMsgTab('dms');
        });
    }

    // 主页搜索按键：打开独立搜索完整页面
    if (headerIcons[1]) {
        bindIcityTap(headerIcons[1], () => {
            openGlobalSearchView();
        });
    }

    // 个人升级 Pro 会员按钮逻辑：打开独立会员中心
    const btnUpgrade = $('.action-buttons .btn-action:nth-child(3)');
    if (btnUpgrade) {
        bindIcityTap(btnUpgrade, () => {
            openVipCenterView();
        });
    }

    const btnProfileTopCrown = $('#btn-profile-top-crown');
    if (btnProfileTopCrown) {
        bindIcityTap(btnProfileTopCrown, () => {
            openVipCenterView();
        });
    }

    // 绑定个人主页右上角小飞机按键：进入自定义日记文风与提示词全屏页
    const btnProfileTopPlane = $('#btn-profile-top-plane');
    if (btnProfileTopPlane) {
        bindIcityTap(btnProfileTopPlane, () => {
            openDiaryStyleSettingView('profile');
        });
    }

    // ================= 自定义日记文风页面交互逻辑 =================
    const btnEditDiaryStyle = $('#btn-edit-diary-style');
    const btnAppEditDiaryStyle = $('#btn-app-edit-diary-style');
    const viewDiaryStyleSetting = $('#view-diary-style-setting');
    const btnBackDiaryStyle = $('#btn-back-diary-style');
    const btnSaveDiaryStyle = $('#btn-save-diary-style');
    const btnResetDiaryStyle = $('#btn-reset-diary-style');
    const inputCustomDiaryStyle = $('#input-custom-diary-style');
    let diaryStyleSourceView = 'settings';

    async function openDiaryStyleSettingView(fromView = 'settings') {
        diaryStyleSourceView = fromView;
        const profile = await getProfile();
        if (inputCustomDiaryStyle) {
            inputCustomDiaryStyle.value = profile.customDiaryStylePrompt || ICITY_DIARY_STYLE_PROMPT;
        }
        $$('.view-container').forEach(v => v.classList.remove('active'));
        if (mainBottomNav) mainBottomNav.style.display = 'none';
        if (viewDiaryStyleSetting) viewDiaryStyleSetting.classList.add('active');
    }

    if (btnEditDiaryStyle) {
        bindIcityTap(btnEditDiaryStyle, () => openDiaryStyleSettingView('settings'));
    }
    if (btnAppEditDiaryStyle) {
        bindIcityTap(btnAppEditDiaryStyle, () => openDiaryStyleSettingView('app-settings'));
    }

    if (btnBackDiaryStyle) {
        bindIcityTap(btnBackDiaryStyle, () => {
            if (viewDiaryStyleSetting) viewDiaryStyleSetting.classList.remove('active');
            if (diaryStyleSourceView === 'profile') {
                if (mainBottomNav) mainBottomNav.style.display = 'flex';
                switchView('profile');
            } else if (diaryStyleSourceView === 'app-settings') {
                const appSettings = $('#view-app-settings');
                if (appSettings) appSettings.classList.add('active');
            } else {
                const viewSettings = $('#view-settings');
                if (viewSettings) viewSettings.classList.add('active');
            }
        });
    }

    if (btnSaveDiaryStyle) {
        bindIcityTap(btnSaveDiaryStyle, async () => {
            const val = inputCustomDiaryStyle ? inputCustomDiaryStyle.value.trim() : '';
            await saveProfileData('customDiaryStylePrompt', val);
            if (typeof window.showToast === 'function') window.showToast('日记文风设定已保存');
            if (viewDiaryStyleSetting) viewDiaryStyleSetting.classList.remove('active');
            const viewSettings = $('#view-settings');
            if (viewSettings) viewSettings.classList.add('active');
        });
    }

    if (btnResetDiaryStyle) {
        bindIcityTap(btnResetDiaryStyle, () => {
            if (inputCustomDiaryStyle) {
                inputCustomDiaryStyle.value = ICITY_DIARY_STYLE_PROMPT;
            }
            if (typeof window.showToast === 'function') window.showToast('已重置为默认文风设定');
        });
    }

    if (btnBackChat) {
        btnBackChat.addEventListener('click', () => {
            if(viewChat) viewChat.classList.remove('active');
            if(mainBottomNav) mainBottomNav.style.display = 'flex';
            switchView('message');
            switchMsgTab('dms');
        });
    }

    // ================= 交互 18：通讯录 Q&A card interaction =================
    const btnOpenQa = $('#btn-open-qa');
    const viewQaPage = $('#view-qa-page');
    const btnBackQaPage = $('#btn-back-qa-page');
    const qaCategoryCards = $$('.qa-category-card');
    const qaQuestionPanel = $('#icity-qa-question-panel');
    const qaMatchPanel = $('#icity-qa-match-panel');

    if (btnOpenQa && viewQaPage) bindIcityTap(btnOpenQa, openIcityQaPage);
    $$('[data-qa-open-matches]').forEach(element => bindIcityTap(element, renderIcityQaMatches));
    qaCategoryCards.forEach(card => bindIcityTap(card, () => openIcityQaCategory(card.dataset.qaCategory)));

    if ($('#icity-qa-visibility-setting')) {
        bindIcityTap($('#icity-qa-visibility-setting'), async () => {
            const data = await getIcityQaData();
            openIcityVisibilityPicker(data.visibility, async value => {
                data.visibility = normalizeIcityVisibility(value);
                await saveIcityData(ICITY_QA_DATA_KEY, data);
                renderIcityQaOverview(data);
            });
        });
    }

    if (qaQuestionPanel) {
        qaQuestionPanel.addEventListener('change', async event => {
            const target = event.target;
            if (target.matches('#icity-qa-character-select')) {
                const category = $('#icity-qa-question-list')?.dataset.qaCategory || '';
                if (category) await openIcityQaCategory(category, target.value);
                return;
            }
            if (!target.matches('[data-qa-answer]')) return;
            const data = await getIcityQaData();
            data.userAnswers[target.dataset.qaAnswer] = { value: target.value.trim(), updatedAt: Date.now() };
            await saveIcityData(ICITY_QA_DATA_KEY, data);
            const list = $('#icity-qa-question-list');
            const category = list?.dataset.qaCategory || '';
            const progress = $('#icity-qa-question-progress');
            if (progress) progress.textContent = getIcityQaCompletedCount(data, category) + '/' + getIcityQaCategoryQuestions(category).length;
            renderIcityQaOverview(data);
        });
        qaQuestionPanel.addEventListener('click', async event => {
            const actionElement = event.target.closest('[data-qa-action]');
            const action = actionElement?.dataset.qaAction;
            if (!action) return;
            if (action === 'back-overview') {
                const data = await getIcityQaData();
                qaQuestionPanel.style.display = 'none';
                if (qaMatchPanel) qaMatchPanel.style.display = 'none';
                $('#icity-qa-overview').style.display = 'block';
                renderIcityQaOverview(data);
                return;
            }
            if (action === 'clear-answer') {
                const data = await getIcityQaData();
                data.userAnswers[actionElement.dataset.questionId] = { value: '', updatedAt: Date.now() };
                await saveIcityData(ICITY_QA_DATA_KEY, data);
                await openIcityQaCategory($('#icity-qa-question-list')?.dataset.qaCategory || '');
                renderIcityQaOverview(data);
                return;
            }
            if (action === 'generate-character' || action === 'regenerate-character') {
                const select = $('#icity-qa-character-select');
                const category = $('#icity-qa-question-list')?.dataset.qaCategory || '';
                const characterId = select?.value || '';
                if (!characterId || !category) {
                    showIcityQaToast('请先选择角色');
                    return;
                }
                const button = actionElement;
                button.disabled = true;
                button.textContent = '生成中…';
                try {
                    const data = await generateIcityCharacterQaAnswers(characterId, category, action === 'regenerate-character');
                    showIcityQaToast('角色答案已保存');
                    await openIcityQaCategory(category, characterId);
                    renderIcityQaOverview(data);
                } catch (error) {
                    showIcityQaToast(error.message || '角色答案生成失败');
                } finally {
                    button.disabled = false;
                    button.textContent = action === 'regenerate-character' ? '重新生成' : '生成角色答案';
                }
            }
        });
    }

    if (btnBackQaPage) {
        btnBackQaPage.addEventListener('click', () => {
            const questionPanel = $('#icity-qa-question-panel');
            const matchPanel = $('#icity-qa-match-panel');
            const overview = $('#icity-qa-overview');

            // 如果当前在做题面板或同好匹配面板，优先退回 QA 分类总览
            if ((questionPanel && questionPanel.style.display !== 'none') || 
                (matchPanel && matchPanel.style.display !== 'none')) {
                if (questionPanel) questionPanel.style.display = 'none';
                if (matchPanel) matchPanel.style.display = 'none';
                if (overview) overview.style.display = 'block';
                getIcityQaData().then(data => renderIcityQaOverview(data));
                return;
            }

            // 否则完全退出 QA 页面返回通讯录
            if (viewQaPage) viewQaPage.classList.remove('active');
            if (mainBottomNav) mainBottomNav.style.display = 'flex';
            switchView('message');
        });
    }

    // ================= 交互 19：日记列表/封存页逻辑 =================
    const btnProfileMoreDiary = $('#btn-profile-more-diary');
    const btnProfileArchived = $('#btn-profile-archived');
    const viewDiaryList = $('#view-diary-list');
    const btnBackDiaryList = $('#btn-back-diary-list');
    const diaryListHeaderTitle = $('#diary-list-header-title');
    const filterTabs = $$('.filter-tab');
    const diaryListFeed = $('#diary-list-feed');

    async function openDiaryListView(initialFilter) {
        currentDiaryListDateKey = null;
        currentDiaryListMonthKey = null;
        $$('.view-container').forEach(v => v.classList.remove('active'));
        if(mainBottomNav) mainBottomNav.style.display = 'none';
        
        const profileData = await getProfile();
        const userName = profileData.nickname || '未命名市民';
        const titleSuffix = initialFilter === 'archived' ? '封存日记' : (initialFilter === 'retro' ? '补写日记' : '全部日记');
        if(diaryListHeaderTitle) diaryListHeaderTitle.textContent = `${userName} · ${titleSuffix}`;

        filterTabs.forEach(tab => {
            if (tab.getAttribute('data-filter') === initialFilter) {
                tab.classList.add('active');
            } else {
                tab.classList.remove('active');
            }
        });

        await renderDiaryListFeed(initialFilter);

        if(viewDiaryList) viewDiaryList.classList.add('active');
    }

    if (btnProfileMoreDiary) {
        btnProfileMoreDiary.addEventListener('click', () => openDiaryListView('all'));
    }
    if (btnProfileArchived) {
        btnProfileArchived.addEventListener('click', () => openDiaryListView('archived'));
    }

    if (btnBackDiaryList) {
        btnBackDiaryList.addEventListener('click', () => {
            currentDiaryListDateKey = null;
            currentDiaryListMonthKey = null;
            if(viewDiaryList) viewDiaryList.classList.remove('active');
            if(mainBottomNav) mainBottomNav.style.display = 'flex';
            switchView('profile');
        });
    }

    filterTabs.forEach(tab => {
        tab.addEventListener('click', async function() {
            currentDiaryListDateKey = null;
            currentDiaryListMonthKey = null;
            filterTabs.forEach(t => t.classList.remove('active'));
            this.classList.add('active');
            const filterType = this.getAttribute('data-filter');
            
            const profileData = await getProfile();
            const userName = profileData.nickname || '未命名市民';
            const titleSuffix = filterType === 'archived' ? '封存日记' : (filterType === 'retro' ? '补写日记' : '全部日记');
            if(diaryListHeaderTitle) diaryListHeaderTitle.textContent = `${userName} · ${titleSuffix}`;

            await renderDiaryListFeed(filterType);
        });
    });


    let currentDiaryListDateKey = null;
    let currentDiaryListMonthKey = null;

    function formatIcityDiaryScopeTitle(scope, key) {
        const parts = String(key || '').split('-').map(Number);
        if (scope === 'day' && parts.length === 3 && parts.every(Number.isFinite)) return parts[0] + '年' + parts[1] + '月' + parts[2] + '日 · 日记';
        if (scope === 'month' && parts.length === 2 && parts.every(Number.isFinite)) return parts[0] + '年' + parts[1] + '月 · 日记';
        return '日记';
    }

    async function openIcityScopedDiaryList(scope, key) {
        currentDiaryListDateKey = scope === 'day' ? key : null;
        currentDiaryListMonthKey = scope === 'month' ? key : null;
        $$('.view-container').forEach(view => view.classList.remove('active'));
        if (mainBottomNav) mainBottomNav.style.display = 'none';
        filterTabs.forEach(tab => tab.classList.remove('active'));
        if (diaryListHeaderTitle) diaryListHeaderTitle.textContent = formatIcityDiaryScopeTitle(scope, key);
        await renderDiaryListFeed(scope);
        if (viewDiaryList) viewDiaryList.classList.add('active');
    }

    async function openIcityDayDiaryList(dateKey) {
        if (dateKey) await openIcityCalendarDiaryComposer(dateKey);
    }

    async function openIcityMonthDiaryList(monthKey) {
        if (monthKey) await openIcityScopedDiaryList('month', monthKey);
    }

    async function renderDiaryListFeed(filterType) {
        let feeds = await getVisibleIcityFeeds(await getFeeds());
        const [profile, authData] = await Promise.all([getProfile(), getWechatAuthData()]);
        const boundAccount = getBoundWechatAccount(profile, authData);
        const userFeeds = feeds.filter(post => isCurrentIcityUserPost(post, boundAccount));
        
        let filteredFeeds = userFeeds.filter(post => {
            if (filterType === 'all') return !post.isArchived;
            if (filterType === 'public') return post.visibility === '公开' && !post.isArchived;
            if (filterType === 'friends') return post.visibility === '仅好友可见' && !post.isArchived;
            if (filterType === 'private') return post.visibility === '私人' && !post.isArchived;
            if (filterType === 'archived') return post.isArchived === true;
            if (filterType === 'retro') return post.isRetroactive === true && !post.isArchived;
            if (filterType === 'day') return !post.isArchived && currentDiaryListDateKey && getIcityDateKey(getIcityPostOccurredAt(post)) === currentDiaryListDateKey;
            if (filterType === 'month') return !post.isArchived && currentDiaryListMonthKey && getIcityMonthKey(getIcityPostOccurredAt(post)) === currentDiaryListMonthKey;
            return true;
        });

        filteredFeeds.sort((a, b) => getIcityPostOccurredAt(b) - getIcityPostOccurredAt(a));

        if (filteredFeeds.length === 0) {
            let emptyText = '没有日记';
            if (filterType === 'archived') emptyText = '没有封存的日记';
            else if (filterType === 'private') emptyText = '没有私密日记';
            else if (filterType === 'retro') emptyText = '没有补写日记';
            else if (filterType === 'day') emptyText = '这一天没有日记';
            else if (filterType === 'month') emptyText = '这个月没有日记';
            
            if(diaryListFeed) {
                diaryListFeed.innerHTML = `
                    <div class="card-box" style="padding: 30px; text-align: center; display: flex; flex-direction: column; gap: 8px;">
                        <div style="font-size: 15px; font-weight: 600; color: #4A90E2;">${emptyText}</div>
                        <div style="font-size: 13px; color: var(--text-light);">卷轴空空如也</div>
                    </div>
                `;
            }
            return;
        }

        let html = '';
        filteredFeeds.forEach(post => {
            let imgHtml = renderIcityFeedImage(post);
            let locHtml = post.location ? `
                <div class="entry-location" style="color: var(--text-light); font-size: 13px;">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="width: 16px; height: 16px; margin-right: 2px; transform: translateY(1px);"><path d="M17.5 19H9a7 7 0 1 1 6.71-9h1.79a4.5 4.5 0 1 1 0 9Z"></path></svg>
                    ${escapeIcityHtml(post.location)} 23°C
                </div>` : '<div></div>';
            
            const occurredDate = getIcityDateObject(getIcityPostOccurredAt(post));
            const occurredDateLabel = occurredDate.getFullYear() + '年' + (occurredDate.getMonth() + 1) + '月' + occurredDate.getDate() + '日';
            const occurredTimeLabel = post.time || String(occurredDate.getHours()).padStart(2, '0') + ':' + String(occurredDate.getMinutes()).padStart(2, '0');
            const retroBadge = post.isRetroactive ? '<span class="icity-retroactive-badge">补写</span>' : '';

            let likeSvg = post.isLiked 
                ? `<svg viewBox="0 0 24 24" style="width: 16px; height: 16px; fill: #FF3B30; stroke: #FF3B30; stroke-width: 2;"><path stroke-linecap="round" stroke-linejoin="round" d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"></path></svg>`
                : `<svg viewBox="0 0 24 24" style="width: 16px; height: 16px; fill: none; stroke: currentColor; stroke-width: 2;"><path stroke-linecap="round" stroke-linejoin="round" d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"></path></svg>`;

            let noteSvg = (post.notes && post.notes.length > 0)
                ? `<div style="display: flex; align-items: center; gap: 2px; color: #8AB4F8;">
                      <svg viewBox="0 0 24 24" style="width: 16px; height: 16px; fill: #8AB4F8; stroke: #8AB4F8; stroke-width: 1.5; stroke-linejoin: round;"><path d="M17 3H7c-1.1 0-2 .9-2 2v16l7-3 7 3V5c0-1.1-.9-2-2-2z"></path></svg>
                      <span style="font-size: 12px; font-weight: 600;">${post.notes.length}</span>
                   </div>`
                : '';

            const listTitleText = profile.citizenTitleText || post.citizenTitleText;
            const listTitleColor = profile.citizenTitleColor || post.citizenTitleColor;
            const listTitleTag = (listTitleText && listTitleText !== '无')
                ? `<span class="icity-citizen-title-tag" style="background-color: ${escapeIcityHtml(listTitleColor || '#8AB4F8')};">${escapeIcityHtml(listTitleText)}</span>`
                : '';

            const entryBody = `
                <div class="entry-user-header" style="margin-bottom: 8px; display: flex; align-items: center;">
                    <div class="avatar" style="${getIcityAvatarStyle(post.authorWechatAvatar || post.avatar || profile.avatar)}; width: 28px; height: 28px; font-size: 14px;"></div>
                    <div class="user-info" style="margin-left: 8px;">
                        <div class="name" style="font-size: 14px; display: flex; align-items: center; flex-wrap: wrap;">
                            <span>${escapeIcityHtml(userName)}</span>${listTitleTag}
                        </div>
                        <div class="username" style="font-size: 11px;">${escapeIcityHtml(userHandle)}</div>
                    </div>
                </div>
                <div class="entry-content">${escapeIcityHtml(post.text)}</div>
                ${retroBadge}
                ${imgHtml}
                <div class="entry-footer">
                    ${locHtml}
                    <div class="entry-actions">
                        ${likeSvg}
                        ${noteSvg}
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="-0.5 -0.5 16 16" style="width: 18px; height: 18px; fill: none; stroke: currentColor;"><path stroke-linecap="round" stroke-linejoin="round" d="M11.875 2.5H3.125a1.25 1.25 0 0 0 -1.25 1.25v6.25a1.25 1.25 0 0 0 1.25 1.25h1.9925000000000002c0.625 0 1.1325 0.5068750000000001 1.1325 1.1325 0 0.505 0.61 0.7575 0.9668749999999999 0.400625l1.166875 -1.166875A1.25 1.25 0 0 1 9.2675 11.25H11.875a1.25 1.25 0 0 0 1.25 -1.25V3.75a1.25 1.25 0 0 0 -1.25 -1.25z" stroke-width="1.2"></path></svg>
                        <div class="entry-time">
                            <svg viewBox="0 0 24 24" style="width: 16px; height: 16px; fill: none; stroke: currentColor; stroke-width: 2;"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>
                            ${retroBadge}${occurredDateLabel} ${occurredTimeLabel}
                        </div>
                        <svg viewBox="0 0 24 24" style="width: 16px; height: 16px; fill: currentColor; stroke: none;"><circle cx="12" cy="5" r="1.5"></circle><circle cx="12" cy="12" r="1.5"></circle><circle cx="12" cy="19" r="1.5"></circle></svg>
                    </div>
                </div>
            `;

            html += `<div class="card-box entry-item" data-id="${escapeIcityHtml(post.id)}" style="cursor: pointer; border-bottom: none;">${entryBody}</div>`;
        });

        if(diaryListFeed) diaryListFeed.innerHTML = html;
    }

    // ================= 模块一：全局搜索独立页真实逻辑 =================
    const viewSearch = $('#view-search');
    const inputGlobalSearch = $('#input-global-search');
    const btnClearSearchInput = $('#btn-clear-search-input');
    const btnCancelSearch = $('#btn-cancel-search');
    const searchDefaultPanel = $('#search-default-panel');
    const searchResultsList = $('#search-results-list');
    const searchFilterTabs = $('#search-filter-tabs');
    const searchHistoryTagsContainer = $('#search-history-tags');
    const btnClearSearchHistory = $('#btn-clear-search-history');

    let currentSearchScope = 'all';
    let icitySearchToken = 0;
    let icitySearchDebounceTimer = null;

    function escapeIcityRegExp(value) {
        return String(value || '').replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    }

    async function getSearchHistory() {
        return getIcityData('icity_search_history', ['生活', '晴天', '驻马店']);
    }

    async function saveSearchHistoryItem(keyword) {
        const word = String(keyword || '').trim();
        if (!word) return;
        await withIcityDataLock('icity_search_history', ['生活', '晴天', '驻马店'], stored => {
            const list = Array.isArray(stored) ? stored.map(item => String(item || '').trim()).filter(Boolean) : [];
            const next = list.filter(item => item !== word);
            next.unshift(word);
            return next.slice(0, 15);
        });
        renderSearchHistory();
    }

    async function renderSearchHistory() {
        if (!searchHistoryTagsContainer) return;
        const list = await getSearchHistory();
        if (!list.length) {
            searchHistoryTagsContainer.innerHTML = '<span style="font-size: 12px; color: var(--text-light);">暂无搜索历史</span>';
            return;
        }
        searchHistoryTagsContainer.innerHTML = list.map(item => `
            <div class="search-tag-chip" data-keyword="${escapeIcityHtml(item)}">${escapeIcityHtml(item)}</div>
        `).join('');
        searchHistoryTagsContainer.querySelectorAll('.search-tag-chip').forEach(tag => {
            bindIcityTap(tag, () => {
                if (inputGlobalSearch) {
                    inputGlobalSearch.value = tag.dataset.keyword;
                    doSearch(tag.dataset.keyword, { recordHistory: true });
                }
            });
        });
    }

    async function openGlobalSearchView() {
        rememberIcitySourceView();
        $$('.view-container').forEach(v => v.classList.remove('active'));
        if (mainBottomNav) mainBottomNav.style.display = 'none';
        if (viewSearch) viewSearch.classList.add('active');
        if (inputGlobalSearch) {
            inputGlobalSearch.value = '';
            setTimeout(() => inputGlobalSearch.focus(), 150);
        }
        if (searchDefaultPanel) searchDefaultPanel.style.display = 'block';
        if (searchResultsList) searchResultsList.style.display = 'none';
        if (searchFilterTabs) searchFilterTabs.style.display = 'none';
        await renderSearchHistory();
    }

    async function doSearch(rawKeyword, options = {}) {
        const normalizedKeyword = String(rawKeyword || '').trim();
        const keyword = normalizedKeyword.toLowerCase();
        const searchToken = ++icitySearchToken;
        if (!keyword) {
            if (searchDefaultPanel) searchDefaultPanel.style.display = 'block';
            if (searchResultsList) searchResultsList.style.display = 'none';
            if (searchFilterTabs) searchFilterTabs.style.display = 'none';
            return;
        }

        if (options.recordHistory) await saveSearchHistoryItem(normalizedKeyword);
        if (searchDefaultPanel) searchDefaultPanel.style.display = 'none';
        if (searchResultsList) searchResultsList.style.display = 'block';
        if (searchFilterTabs) searchFilterTabs.style.display = 'flex';

        const feeds = await getVisibleIcityFeeds(await getFeeds());
        const [profile, authData] = await Promise.all([getProfile(), getWechatAuthData()]);
        if (searchToken !== icitySearchToken) return;
        const boundAccount = getBoundWechatAccount(profile, authData);

        const matched = feeds.filter(post => {
            const isMine = isCurrentIcityUserPost(post, boundAccount);
            if (currentSearchScope === 'mine' && !isMine) return false;
            if (currentSearchScope === 'friends' && isMine) return false;

            const notes = Array.isArray(post.notes)
                ? post.notes.map(note => typeof note === 'string' ? note : (note?.text || note?.content || '')).join(' ')
                : String(post.notes || '');
            const searchableText = [
                post.text,
                post.location,
                post.user,
                post.diary,
                notes
            ].map(value => String(value || '').toLowerCase()).join(' ');
            return searchableText.includes(keyword);
        });

        matched.sort((a, b) => getIcityPostOccurredAt(b) - getIcityPostOccurredAt(a));

        if (!matched.length) {
            searchResultsList.innerHTML = `
                <div class="card-box" style="padding: 40px 20px; text-align: center; color: var(--text-light);">
                    <div style="font-size: 16px; font-weight: 600; margin-bottom: 6px;">未找到匹配内容</div>
                    <div style="font-size: 13px;">换个关键词试试看吧</div>
                </div>
            `;
            return;
        }

        searchResultsList.innerHTML = matched.map(post => {
            const safeText = escapeIcityHtml(post.text || '');
            const highlightedText = safeText.replace(new RegExp(`(${escapeIcityRegExp(keyword)})`, 'gi'), '<span style="color:#FF9500; font-weight:700;">$1</span>');
            return `
                <div class="card-box entry-item" data-id="${escapeIcityHtml(post.id)}" style="cursor: pointer; margin-bottom: 8px;">
                    <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 8px;">
                        <div class="avatar" style="${getIcityAvatarStyle(post.avatar)}; width: 28px; height: 28px; font-size: 14px;"></div>
                        <div style="font-size: 13px; font-weight: 600; color: var(--text-main);">${escapeIcityHtml(post.user || '市民')}</div>
                        <div style="font-size: 11px; color: var(--text-light); margin-left: auto;">${post.isRetroactive ? '<span class="icity-retroactive-badge icity-retroactive-badge-inline">补写</span>' : ''} ${escapeIcityHtml(post.time || '未知日期')}</div>
                    </div>
                    <div class="entry-content" style="font-size: 14px; -webkit-line-clamp: 3;">${highlightedText}</div>
                    ${renderIcityFeedImage(post)}
                    ${post.location ? `<div style="font-size: 12px; color: var(--theme-blue); margin-top: 6px;">📍 ${escapeIcityHtml(post.location)}</div>` : ''}
                </div>
            `;
        }).join('');

        searchResultsList.querySelectorAll('.entry-item').forEach(item => {
            bindIcityTap(item, async () => {
                const id = item.getAttribute('data-id');
                if (id) {
                    await saveSearchHistoryItem(inputGlobalSearch?.value || normalizedKeyword);
                    openSinglePost(id);
                }
            });
        });
    }

    if (inputGlobalSearch) {
        inputGlobalSearch.addEventListener('input', (e) => {
            const val = e.target.value;
            if (btnClearSearchInput) btnClearSearchInput.style.display = val ? 'block' : 'none';
            clearTimeout(icitySearchDebounceTimer);
            icitySearchDebounceTimer = setTimeout(() => doSearch(val), 220);
        });
        inputGlobalSearch.addEventListener('keydown', (e) => {
            if (e.key !== 'Enter') return;
            e.preventDefault();
            clearTimeout(icitySearchDebounceTimer);
            doSearch(inputGlobalSearch.value, { recordHistory: true });
        });
    }

    if (btnClearSearchInput) {
        bindIcityTap(btnClearSearchInput, () => {
            if (inputGlobalSearch) {
                inputGlobalSearch.value = '';
                btnClearSearchInput.style.display = 'none';
                doSearch('');
            }
        });
    }

    if (btnCancelSearch) {
        bindIcityTap(btnCancelSearch, () => {
            if (viewSearch) viewSearch.classList.remove('active');
            restoreIcitySourceView('home');
        });
    }

    if (btnClearSearchHistory) {
        bindIcityTap(btnClearSearchHistory, async () => {
            await saveIcityData('icity_search_history', []);
            renderSearchHistory();
        });
    }

    $$('#search-default-panel .search-tag-chip').forEach(chip => {
        bindIcityTap(chip, () => {
            if (inputGlobalSearch) {
                inputGlobalSearch.value = chip.dataset.keyword;
                if (btnClearSearchInput) btnClearSearchInput.style.display = 'block';
                doSearch(chip.dataset.keyword, { recordHistory: true });
            }
        });
    });

    $$('#search-filter-tabs .filter-tab').forEach(tab => {
        bindIcityTap(tab, () => {
            $$('#search-filter-tabs .filter-tab').forEach(t => t.classList.remove('active'));
            tab.classList.add('active');
            currentSearchScope = tab.dataset.searchScope || 'all';
            if (inputGlobalSearch) doSearch(inputGlobalSearch.value);
        });
    });

    // ================= 模块二：Diary Pro 会员中心居中弹窗逻辑 =================
    const modalVip = $('#modal-vip');
    const closeVipModal = $('#close-vip-modal');
    const btnVipBuyMonth = $('#btn-vip-buy-month');
    const btnVipBuyYear = $('#btn-vip-buy-year');
    const vipBadgeTag = $('#vip-badge-tag');
    const vipActiveInfoCard = $('#vip-active-info-card');
    const vipStartTimeEl = $('#vip-active-start-time');
    const vipEndTimeEl = $('#vip-active-end-time');
    const btnVipShowPlans = $('#btn-vip-show-plans');
    const vipActionsArea = $('#vip-subscription-actions-area');

    let currentSelectedVipPlan = 'month'; // 'month' 或 'year'
    const crownImgHtml = icityProCrownSvg('vip-crown-icon', 32);

    function formatIcityFullTime(timestamp) {
        const d = new Date(Number(timestamp || Date.now()));
        if (Number.isNaN(d.getTime())) return '--';
        return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')} ${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`;
    }

    function isIcityProUser(profile) {
        if (!profile) return false;
        if (profile.isProMember !== true) return false;
        if (profile.proExpiresAt && Number(profile.proExpiresAt) < Date.now()) return false;
        return true;
    }

    function updateVipPlanButtonsUi() {
        if (!btnVipBuyMonth || !btnVipBuyYear) return;

        if (currentSelectedVipPlan === 'month') {
            btnVipBuyMonth.className = 'vip-plan-btn is-active';
            btnVipBuyMonth.innerHTML = `${crownImgHtml}<span class="vip-plan-text">1 Month: $2.99 (¥21)</span>`;

            btnVipBuyYear.className = 'vip-plan-btn is-inactive';
            btnVipBuyYear.innerHTML = `<span class="vip-plan-text">1 Year: <span class="vip-plan-price-highlight">$14.99 (¥105)</span> / year</span>`;
        } else {
            btnVipBuyYear.className = 'vip-plan-btn is-active';
            btnVipBuyYear.innerHTML = `${crownImgHtml}<span class="vip-plan-text">1 Year: $14.99 (¥105) / year</span>`;

            btnVipBuyMonth.className = 'vip-plan-btn is-inactive';
            btnVipBuyMonth.innerHTML = `<span class="vip-plan-text">1 Month: <span class="vip-plan-price-highlight">$2.99 (¥21)</span></span>`;
        }
    }

    async function openVipCenterView() {
        if (!modalVip) return;
        currentSelectedVipPlan = 'month';
        updateVipPlanButtonsUi();
        modalVip.classList.add('active');

        const profile = await getProfile();
        const isVip = isIcityProUser(profile);

        if (vipBadgeTag) {
            vipBadgeTag.textContent = isVip ? '已激活' : 'Pro';
            vipBadgeTag.style.background = isVip ? '#25C85A' : '#FF6628';
        }

        if (isVip && profile.proActivatedAt && profile.proExpiresAt) {
            if (vipActiveInfoCard) vipActiveInfoCard.style.display = 'flex';
            if (vipStartTimeEl) vipStartTimeEl.textContent = formatIcityFullTime(profile.proActivatedAt);
            if (vipEndTimeEl) vipEndTimeEl.textContent = formatIcityFullTime(profile.proExpiresAt);
            if (vipActionsArea) vipActionsArea.style.display = 'none';
        } else {
            if (vipActiveInfoCard) vipActiveInfoCard.style.display = 'none';
            if (vipActionsArea) vipActionsArea.style.display = 'flex';
        }
    }

    if (btnVipShowPlans && vipActionsArea) {
        bindIcityTap(btnVipShowPlans, () => {
            vipActionsArea.style.display = 'flex';
            btnVipShowPlans.style.display = 'none';
        });
    }

    if (closeVipModal && modalVip) {
        bindIcityTap(closeVipModal, () => {
            modalVip.classList.remove('active');
        });
        modalVip.addEventListener('click', (e) => {
            if (e.target === modalVip) modalVip.classList.remove('active');
        });
    }

    async function activateIcityProMembership(planType = 'month') {
        const profile = await getProfile();
        const now = Date.now();
        const durationMs = planType === 'year' ? 365 * 24 * 60 * 60 * 1000 : 30 * 24 * 60 * 60 * 1000;
        const currentExpires = (profile.isProMember && profile.proExpiresAt && Number(profile.proExpiresAt) > now)
            ? Number(profile.proExpiresAt)
            : now;

        const newExpires = currentExpires + durationMs;
        const activatedTime = profile.proActivatedAt || now;

        await patchProfileData({
            isProMember: true,
            proActivatedAt: activatedTime,
            proExpiresAt: newExpires
        });

        if (vipBadgeTag) {
            vipBadgeTag.textContent = '已激活';
            vipBadgeTag.style.background = '#25C85A';
        }

        if (typeof window.showToast === 'function') {
            window.showToast(`恭喜！Diary Pro 荣誉市民（${planType === 'year' ? '年度' : '月度'}）已生效`);
        }
        if (modalVip) modalVip.classList.remove('active');
    }

    // 核心支付与激活调度器：关联微信钱包 (Apple Pay 逻辑)
    async function triggerIcityProPayment(planType) {
        const isYear = planType === 'year';
        const rmbAmount = isYear ? 105.00 : 21.00;
        const planName = isYear ? '年度' : '月度';

        if (typeof window.wcOpenApplePay === 'function') {
            window.wcOpenApplePay({
                amount: rmbAmount,
                payee: 'Diary 荣誉市民中心',
                title: `Diary Pro ${planName}订阅`,
                onSuccess: async () => {
                    await activateIcityProMembership(planType);
                }
            });
        } else {
            // 环境未挂载微信钱包时的平稳降级
            const confirmed = confirm(`确认使用零钱/Apple Pay 支付 ¥${rmbAmount.toFixed(2)} 订购 Diary Pro ${planName}？`);
            if (confirmed) {
                await activateIcityProMembership(planType);
            }
        }
    }

    if (btnVipBuyMonth) {
        bindIcityTap(btnVipBuyMonth, async () => {
            if (currentSelectedVipPlan !== 'month') {
                currentSelectedVipPlan = 'month';
                updateVipPlanButtonsUi();
            } else {
                await triggerIcityProPayment('month');
            }
        });
    }

    if (btnVipBuyYear) {
        bindIcityTap(btnVipBuyYear, async () => {
            if (currentSelectedVipPlan !== 'year') {
                currentSelectedVipPlan = 'year';
                updateVipPlanButtonsUi();
            } else {
                await triggerIcityProPayment('year');
            }
        });
    }

    // ================= 模块三：日记内页字体管理独立页真实逻辑 =================
    const viewFontMgr = $('#view-font-management');
    const btnBackFontMgr = $('#btn-back-font-mgr');
    const fontPreviewSample = $('#font-preview-sample');
    const btnTriggerLocalFont = $('#btn-trigger-local-font');
    const btnTriggerUrlFont = $('#btn-trigger-url-font');

    async function openFontManagementView() {
        $$('.view-container').forEach(v => v.classList.remove('active'));
        if (mainBottomNav) mainBottomNav.style.display = 'none';
        if (viewFontMgr) viewFontMgr.classList.add('active');
        await updateFontManagementUi();
    }

    async function updateFontManagementUi() {
        const profile = await getProfile();
        const currentFont = profile.icityFontName || '';
        if (fontPreviewSample) {
            fontPreviewSample.style.fontFamily = currentFont ? `'${currentFont}', sans-serif` : 'inherit';
        }
        const defaultMark = viewFontMgr?.querySelector('.font-option-row .font-check-mark');
        if (defaultMark) {
            defaultMark.style.display = currentFont ? 'none' : 'block';
        }
    }

    if (btnBackFontMgr) {
        bindIcityTap(btnBackFontMgr, () => {
            if (viewFontMgr) viewFontMgr.classList.remove('active');
            if (mainBottomNav) mainBottomNav.style.display = 'none';
            if (viewAppSettings) viewAppSettings.classList.add('active');
        });
    }

    const defaultFontRow = viewFontMgr?.querySelector('.font-option-row');
    if (defaultFontRow) {
        bindIcityTap(defaultFontRow, async () => {
            await setIcityFontPreference('', '');
            await updateFontManagementUi();
            if (typeof window.showToast === 'function') window.showToast('已恢复系统默认字体');
        });
    }

    if (btnTriggerLocalFont) {
        bindIcityTap(btnTriggerLocalFont, () => {
            openIcityFontUpload();
            setTimeout(updateFontManagementUi, 800);
        });
    }

    if (btnTriggerUrlFont) {
        bindIcityTap(btnTriggerUrlFont, async () => {
            await openIcityFontUrlUpload();
            await updateFontManagementUi();
        });
    }


    // ================= Stage 8: citizen badges and titles =================
    const ICITY_BADGES_DATA_KEY = 'icity_badges_data';
    const ICITY_BADGE_MAX_WORN = 3;
    let currentIcityBadgePanelTab = 'badges';

    const ICITY_BADGE_CATALOG = [
        { id: 'first-diary', label: '初次记录', icon: '✍️', category: '记录成就', description: '发布第一篇日记', rule: source => source.diaryCount >= 1 },
        { id: 'five-diaries', label: '五次落笔', icon: '📝', category: '记录成就', description: '累计发布 5 篇日记', rule: source => source.diaryCount >= 5 },
        { id: 'ten-diaries', label: '十页心事', icon: '📖', category: '记录成就', description: '累计发布 10 篇日记', rule: source => source.diaryCount >= 10 },
        { id: 'thirty-diaries', label: '月光档案员', icon: '🌙', category: '记录成就', description: '累计发布 30 篇日记', rule: source => source.diaryCount >= 30 },
        { id: 'hundred-diaries', label: '百日留痕', icon: '🏛️', category: '记录成就', description: '累计发布 100 篇日记', rule: source => source.diaryCount >= 100 },
        { id: 'seven-day-streak', label: '七日不缺席', icon: '🔥', category: '记录成就', description: '连续记录 7 天', rule: source => source.longestStreak >= 7 },
        { id: 'thirty-day-streak', label: '三十日同行', icon: '🌟', category: '记录成就', description: '连续记录 30 天', rule: source => source.longestStreak >= 30 },
        { id: 'retroactive-writer', label: '把昨天写完', icon: '⏪', category: '记录成就', description: '完成一次补写日记', rule: source => source.retroactiveCount >= 1 },
        { id: 'image-keeper', label: '图像收藏家', icon: '🖼️', category: '技能', description: '在日记中保存图片', rule: source => source.imageDiaryCount >= 1 },
        { id: 'multi-image', label: '九宫格叙事', icon: '🧩', category: '技能', description: '在一篇日记中保存多张图片', rule: source => source.multiImageCount >= 1 },
        { id: 'monthly-recorder', label: '月度回望者', icon: '🗓️', category: '记录成就', description: '完成一份月度记录', rule: source => source.monthlyRecordCount >= 1 },
        { id: 'calendar-keeper', label: '时间整理师', icon: '📅', category: '技能', description: '在 3 个不同月份留下记录', rule: source => source.monthCount >= 3 },
        { id: 'annual-reviewer', label: '年度拾光者', icon: '🎞️', category: '记录成就', description: '保存一份年度回顾', rule: source => source.annualReportCount >= 1 },
        { id: 'book-collector', label: '日记本收藏家', icon: '📚', category: '记录成就', description: '拥有 3 本日记本', rule: source => source.diaryBookCount >= 3 },
        { id: 'location-explorer', label: '三城漫游', icon: '📍', category: '兴趣', description: '在 3 个地点记录生活', rule: source => source.locationCount >= 3 },
        { id: 'city-walker', label: '城市漫步者', icon: '🚶', category: '兴趣', description: '在 8 个地点记录生活', rule: source => source.locationCount >= 8 },
        { id: 'foodie', label: '人间烟火', icon: '🍜', category: '食物', description: '记录过美食或用餐时刻', aiEligible: true, rule: source => source.keywordCounts.food >= 1 },
        { id: 'coffee-time', label: '咖啡时间', icon: '☕', category: '食物', description: '记录过咖啡、茶或饮品', aiEligible: true, rule: source => source.keywordCounts.coffee >= 1 },
        { id: 'sweet-tooth', label: '甜味偏爱', icon: '🍰', category: '食物', description: '记录过甜点或甜食', aiEligible: true, rule: source => source.keywordCounts.sweet >= 1 },
        { id: 'book-lover', label: '书页漫游', icon: '📚', category: '兴趣', description: '记录过阅读与书籍', aiEligible: true, rule: source => source.keywordCounts.reading >= 1 },
        { id: 'movie-night', label: '散场之后', icon: '🎬', category: '兴趣', description: '记录过电影或剧集', aiEligible: true, rule: source => source.keywordCounts.movie >= 1 },
        { id: 'music-listener', label: '耳机里的风', icon: '🎧', category: '兴趣', description: '记录过音乐或演出', aiEligible: true, rule: source => source.keywordCounts.music >= 1 },
        { id: 'game-player', label: '游戏人生', icon: '🎮', category: '兴趣', description: '记录过游戏时光', aiEligible: true, rule: source => source.keywordCounts.game >= 1 },
        { id: 'traveler', label: '出发的人', icon: '🧳', category: '兴趣', description: '记录过旅行与远方', aiEligible: true, rule: source => source.keywordCounts.travel >= 1 },
        { id: 'photographer', label: '光影采集者', icon: '📷', category: '技能', description: '记录过摄影或镜头', aiEligible: true, rule: source => source.keywordCounts.photo >= 1 || source.imageDiaryCount >= 3 },
        { id: 'coder', label: '问题解决者', icon: '💻', category: '职业', description: '记录过代码、开发或技术', aiEligible: true, rule: source => source.keywordCounts.coding >= 1 },
        { id: 'designer', label: '灵感设计师', icon: '🎨', category: '职业', description: '记录过设计、绘画或创作', aiEligible: true, rule: source => source.keywordCounts.design >= 1 },
        { id: 'learner', label: '持续学习者', icon: '🌱', category: '职业', description: '记录过学习、课程或考试', aiEligible: true, rule: source => source.keywordCounts.learning >= 1 },
        { id: 'worker', label: '认真生活家', icon: '🧑‍💼', category: '职业', description: '记录过工作与职场日常', aiEligible: true, rule: source => source.keywordCounts.work >= 1 },
        { id: 'sunny-heart', label: '晴日心情', icon: '☀️', category: '情绪', description: '记录过 3 次积极情绪', aiEligible: true, rule: source => source.positiveCount >= 3 },
        { id: 'gentle-heart', label: '温柔观察员', icon: '🌼', category: '情绪', description: '记录过温柔、治愈或满足', aiEligible: true, rule: source => source.keywordCounts.gentle >= 1 },
        { id: 'low-tide-writer', label: '低潮记录者', icon: '🌧️', category: '情绪', description: '诚实记录过低落时刻', aiEligible: true, rule: source => source.negativeCount >= 1 },
        { id: 'wish-maker', label: '愿望收集者', icon: '✨', category: '愿望', description: '写下 2 个愿望或想去的地方', aiEligible: true, rule: source => source.wishCount >= 2 },
        { id: 'future-facing', label: '向未来走', icon: '🛤️', category: '愿望', description: '记录过计划、目标或期待', aiEligible: true, rule: source => source.keywordCounts.future >= 1 },
        { id: 'character-friend', label: '角色相遇', icon: '🤝', category: '人物关系', description: '与角色或联系人产生互动', aiEligible: true, rule: source => source.relationshipCount >= 1 },
        { id: 'conversation-starter', label: '对话发起人', icon: '💬', category: '人物关系', description: '累计发出 3 条私信', aiEligible: true, rule: source => source.sentDmCount >= 3 },
        { id: 'reply-keeper', label: '回应收藏家', icon: '💌', category: '人物关系', description: '收到或写下 3 条评论', aiEligible: true, rule: source => source.commentCount >= 3 },
        { id: 'long-form', label: '长句呼吸', icon: '🪶', category: '技能', description: '写过 3 篇较长的日记', aiEligible: true, rule: source => source.longEntryCount >= 3 }
    ];

    const ICITY_TITLE_CATALOG = [
        { id: 'new-citizen', label: '初来市民', description: '发布第一篇日记', rule: source => source.diaryCount >= 1 },
        { id: 'daily-recorder', label: '日常记录者', description: '累计发布 10 篇日记', rule: source => source.diaryCount >= 10 },
        { id: 'steady-recorder', label: '稳定记录者', description: '连续记录 7 天', rule: source => source.longestStreak >= 7 },
        { id: 'memory-archivist', label: '记忆档案员', description: '累计发布 30 篇日记', rule: source => source.diaryCount >= 30 },
        { id: 'city-observer', label: '城市观察家', description: '在 3 个地点记录生活', rule: source => source.locationCount >= 3 },
        { id: 'everyday-poet', label: '生活诗人', description: '写过 3 篇较长的日记', rule: source => source.longEntryCount >= 3 },
        { id: 'warm-hearted', label: '温暖市民', description: '记录过 3 次积极情绪', rule: source => source.positiveCount >= 3 },
        { id: 'wish-chaser', label: '愿望追光者', description: '写下 2 个愿望或想去的地方', rule: source => source.wishCount >= 2 },
        { id: 'social-citizen', label: '热心邻居', description: '与角色或联系人产生 3 次互动', rule: source => source.relationshipCount >= 3 },
        { id: 'multi-skilled', label: '多面市民', description: '解锁 3 个不同类别的徽章', rule: source => source.unlockedCategoryCount >= 3 }
    ];

    function getIcityBadgesData() {
        return getIcityData(ICITY_BADGES_DATA_KEY, {
            version: 2,
            wornTitleId: '',
            wornBadgeIds: [],
            aiRecommendations: [],
            knownUnlockedBadgeIds: [],
            unlockHistoryInitialized: false,
            updatedAt: 0
        }).then(data => {
            const value = data && typeof data === 'object' ? data : {};
            return {
                version: 2,
                wornTitleId: String(value.wornTitleId || ''),
                wornBadgeIds: Array.isArray(value.wornBadgeIds) ? value.wornBadgeIds.map(String).slice(0, ICITY_BADGE_MAX_WORN) : [],
                aiRecommendations: Array.isArray(value.aiRecommendations)
                    ? value.aiRecommendations.map(item => ({
                        id: String(item?.id || ''),
                        reason: String(item?.reason || '')
                    })).filter(item => item.id)
                    : [],
                knownUnlockedBadgeIds: Array.isArray(value.knownUnlockedBadgeIds)
                    ? Array.from(new Set(value.knownUnlockedBadgeIds.map(String))).filter(id => getIcityBadgeById(id))
                    : [],
                unlockHistoryInitialized: value.unlockHistoryInitialized === true,
                updatedAt: Number(value.updatedAt || 0)
            };
        });
    }

    async function saveIcityBadgesData(data) {
        const next = Object.assign({
            version: 2,
            wornTitleId: '',
            wornBadgeIds: [],
            aiRecommendations: [],
            knownUnlockedBadgeIds: [],
            unlockHistoryInitialized: false,
            updatedAt: Date.now()
        }, data || {});
        next.wornBadgeIds = Array.from(new Set((Array.isArray(next.wornBadgeIds) ? next.wornBadgeIds : []).map(String))).slice(0, ICITY_BADGE_MAX_WORN);
        next.knownUnlockedBadgeIds = Array.from(new Set((Array.isArray(next.knownUnlockedBadgeIds) ? next.knownUnlockedBadgeIds : []).map(String)))
            .filter(id => getIcityBadgeById(id));
        next.unlockHistoryInitialized = next.unlockHistoryInitialized === true;
        next.updatedAt = Date.now();
        await saveIcityData(ICITY_BADGES_DATA_KEY, next);
        return next;
    }

    function getIcityBadgeById(id) {
        return ICITY_BADGE_CATALOG.find(item => item.id === String(id));
    }

    function getIcityTitleById(id) {
        return ICITY_TITLE_CATALOG.find(item => item.id === String(id));
    }

    function countIcityBadgeKeywords(text, groups) {
        return Object.keys(groups).reduce((result, key) => {
            result[key] = groups[key].reduce((count, word) => count + (text.includes(word) ? 1 : 0), 0);
            return result;
        }, {});
    }

    async function getIcityBadgeSource() {
        const [visibleFeeds, profile, authData, diaries, dms, monthlyRecords, annualReports] = await Promise.all([
            getVisibleIcityFeeds(await getFeeds()),
            getProfile(),
            getWechatAuthData(),
            getDiaries(),
            getIcityDms(),
            typeof getIcityMonthlyRecords === 'function' ? getIcityMonthlyRecords() : Promise.resolve([]),
            typeof getIcityAnnualReports === 'function' ? getIcityAnnualReports() : Promise.resolve([])
        ]);
        const boundAccount = getBoundWechatAccount(profile, authData);
        const personalFeeds = visibleFeeds.filter(post => isCurrentIcityUserPost(post, boundAccount));
        const text = personalFeeds.map(post => [
            post?.text,
            post?.mood,
            post?.emotion,
            post?.feeling,
            post?.title,
            post?.location
        ].filter(Boolean).join(' ')).join('\n');
        const commentList = personalFeeds.flatMap(post => Array.isArray(post?.comments) ? post.comments : []);
        const dmsFromMe = dms.filter(message => message?.isFromMe);
        const commentUsers = commentList.map(comment => String(comment?.user || comment?.name || '').trim()).filter(Boolean);
        const dmUsers = dms.map(message => String(message?.user || message?.handle || '').trim()).filter(Boolean);
        const relationshipUsers = new Set(commentUsers.concat(dmUsers));
        const locationSet = new Set(personalFeeds.map(post => String(post?.location || '').trim()).filter(Boolean));
        const monthSet = new Set(personalFeeds.map(post => getIcityMonthKey(getIcityDateObject(getIcityPostOccurredAt(post)))).filter(Boolean));
        const keywordCounts = countIcityBadgeKeywords(text, {
            food: ['美食', '吃饭', '吃了', '餐厅', '火锅', '面馆', '烧烤', '料理', '午餐', '晚餐', '早餐', '食堂'],
            coffee: ['咖啡', '拿铁', '茶', '饮品', '奶茶'],
            sweet: ['蛋糕', '甜点', '甜品', '冰淇淋', '糖果'],
            reading: ['阅读', '读书', '书店', '小说', '书籍', '看书'],
            movie: ['电影', '剧集', '电视剧', '影院', '追剧'],
            music: ['音乐', '歌曲', '耳机', '演唱会', '乐队'],
            game: ['游戏', '打机', '副本', '排位'],
            travel: ['旅行', '旅游', '出发', '远方', '机场', '车站'],
            photo: ['摄影', '照片', '拍照', '镜头', '相机'],
            coding: ['代码', '编程', '开发', '程序', '调试', '软件'],
            design: ['设计', '绘画', '创作', '灵感', '画画'],
            learning: ['学习', '课程', '考试', '复习', '读研', '上课'],
            work: ['工作', '上班', '会议', '同事', '项目', '加班'],
            gentle: ['温柔', '治愈', '满足', '安心', '平静', '感谢'],
            future: ['计划', '目标', '期待', '明天', '以后', '将来']
        });
        const positiveWords = ['开心', '快乐', '幸福', '喜欢', '期待', '轻松', '满足', '温柔', '顺利', '惊喜', '治愈'];
        const negativeWords = ['难过', '生气', '焦虑', '疲惫', '孤独', '失落', '压力', '烦恼', '害怕', '委屈', '崩溃'];
        const wishMatches = text.match(/想去|希望|梦想|愿望|想要|以后想|有一天/g) || [];
        const relationshipCount = relationshipUsers.size + visibleFeeds.filter(post => post?.authorType === 'character').length;
        const imageDiaryCount = personalFeeds.filter(post => getIcityPostImages(post).length > 0).length;
        const multiImageCount = personalFeeds.filter(post => getIcityPostImages(post).length > 1).length;
        const longEntryCount = personalFeeds.filter(post => String(post?.text || '').trim().length >= 120).length;
        const source = {
            feeds: visibleFeeds,
            personalFeeds,
            text,
            diaryCount: personalFeeds.length,
            diaryBookCount: Array.isArray(diaries) ? diaries.length : 0,
            imageDiaryCount,
            multiImageCount,
            locationCount: locationSet.size,
            monthCount: monthSet.size,
            longestStreak: typeof getIcityAnnualDayStreak === 'function' ? getIcityAnnualDayStreak(personalFeeds) : 0,
            retroactiveCount: personalFeeds.filter(post => post?.isRetroactive === true).length,
            monthlyRecordCount: Array.isArray(monthlyRecords) ? monthlyRecords.length : 0,
            annualReportCount: Array.isArray(annualReports) ? annualReports.length : 0,
            commentCount: commentList.length,
            relationshipCount,
            sentDmCount: dmsFromMe.length,
            longEntryCount,
            positiveCount: positiveWords.reduce((count, word) => count + (text.includes(word) ? 1 : 0), 0),
            negativeCount: negativeWords.reduce((count, word) => count + (text.includes(word) ? 1 : 0), 0),
            wishCount: wishMatches.length,
            keywordCounts
        };
        const unlocked = ICITY_BADGE_CATALOG.filter(item => {
            try { return Boolean(item.rule(source)); } catch (error) { return false; }
        });
        source.unlockedBadgeIds = unlocked.map(item => item.id);
        source.unlockedCategoryCount = new Set(unlocked.map(item => item.category)).size;
        return source;
    }

    function getIcityBadgeDisplayItems(data) {
        return (Array.isArray(data?.wornBadgeIds) ? data.wornBadgeIds : [])
            .map(getIcityBadgeById)
            .filter(Boolean);
    }

    function getIcityBadgeProgress(item, source) {
        const metricTargets = {
            'first-diary': ['diaryCount', 1, '篇日记'], 'five-diaries': ['diaryCount', 5, '篇日记'], 'ten-diaries': ['diaryCount', 10, '篇日记'], 'thirty-diaries': ['diaryCount', 30, '篇日记'], 'hundred-diaries': ['diaryCount', 100, '篇日记'],
            'seven-day-streak': ['longestStreak', 7, '天连续记录'], 'thirty-day-streak': ['longestStreak', 30, '天连续记录'], 'retroactive-writer': ['retroactiveCount', 1, '次补写'], 'image-keeper': ['imageDiaryCount', 1, '篇含图日记'], 'multi-image': ['multiImageCount', 1, '篇多图日记'],
            'monthly-recorder': ['monthlyRecordCount', 1, '份月度记录'], 'calendar-keeper': ['monthCount', 3, '个月份'], 'annual-reviewer': ['annualReportCount', 1, '份年度回顾'], 'book-collector': ['diaryBookCount', 3, '本日记本'],
            'location-explorer': ['locationCount', 3, '个地点'], 'city-walker': ['locationCount', 8, '个地点'], 'sunny-heart': ['positiveCount', 3, '次积极情绪'], 'wish-maker': ['wishCount', 2, '个愿望'],
            'character-friend': ['relationshipCount', 1, '次互动'], 'conversation-starter': ['sentDmCount', 3, '条私信'], 'reply-keeper': ['commentCount', 3, '条评论'], 'long-form': ['longEntryCount', 3, '篇长日记']
        };
        const keywordTargets = {
            foodie: ['food', '次美食记录'], 'coffee-time': ['coffee', '次饮品记录'], 'sweet-tooth': ['sweet', '次甜食记录'], 'book-lover': ['reading', '次阅读记录'],
            'movie-night': ['movie', '次影视记录'], 'music-listener': ['music', '次音乐记录'], 'game-player': ['game', '次游戏记录'], traveler: ['travel', '次旅行记录'],
            coder: ['coding', '次技术记录'], designer: ['design', '次创作记录'], learner: ['learning', '次学习记录'], worker: ['work', '次工作记录'],
            'gentle-heart': ['gentle', '次温柔记录'], 'low-tide-writer': ['negative', '次低潮记录'], 'future-facing': ['future', '次未来记录']
        };
        const metric = metricTargets[item.id];
        if (metric) {
            const [key, target, unit] = metric;
            return Math.min(Number(source?.[key] || 0), target) + '/' + target + ' ' + unit;
        }
        if (item.id === 'photographer') {
            const photoMentions = Number(source?.keywordCounts?.photo || 0);
            const images = Number(source?.imageDiaryCount || 0);
            return photoMentions ? '已记录摄影' : Math.min(images, 3) + '/3 篇含图日记';
        }
        const keyword = keywordTargets[item.id];
        if (keyword) {
            const [key, unit] = keyword;
            const count = key === 'negative' ? Number(source?.negativeCount || 0) : Number(source?.keywordCounts?.[key] || 0);
            return count ? '已完成 ' + count + unit : '0/1 ' + unit;
        }
        return item.description;
    }

    function showIcityBadgeUnlockNotice(badgeIds) {
        const badges = badgeIds.map(getIcityBadgeById).filter(Boolean);
        if (!badges.length) return;
        const app = $('#icityNewAppUI') || document.body;
        const previous = app.querySelector('.icity-badge-unlock-notice');
        if (previous) previous.remove();
        const notice = document.createElement('div');
        notice.className = 'icity-badge-unlock-notice';
        notice.innerHTML = '<div class="icity-badge-unlock-orb">' + badges[0].icon + '</div><div><strong>解锁新市民徽章</strong><span>' + escapeIcityHtml(badges.map(item => item.label).join('、')) + '</span></div><i aria-hidden="true">›</i>';
        app.appendChild(notice);
        bindIcityBadgeAction(notice, () => openIcityBadgeManager('badges'));
        window.setTimeout(() => { if (notice.isConnected) notice.remove(); }, 4800);
    }

    function showIcityBadgeToast(message) {
        if (typeof window.showToast === 'function') window.showToast(message);
        else if (typeof showIcityQaToast === 'function') showIcityQaToast(message);
    }

    function ensureIcityBadgePanel() {
        let panel = $('#icity-badge-panel');
        const container = $('.icity-app-inner-container') || document.querySelector('.icity-app-inner-container') || document.body;
        if (!panel) {
            panel = document.createElement('div');
            panel.id = 'icity-badge-panel';
            panel.className = 'modal-overlay';
            panel.innerHTML = '<div class="icity-badge-modal" role="dialog" aria-modal="true"></div>';
            container.appendChild(panel);
        } else if (panel.parentElement !== container) {
            container.appendChild(panel);
        }
        if (!panel.dataset.dismissBound) {
            panel.dataset.dismissBound = 'true';
            panel.addEventListener('click', event => {
                if (event.target === panel) panel.classList.remove('active');
            });
        }
        return panel;
    }

    // ================= 全屏市民勋章独立页逻辑 =================
    let currentBadgesPageFilter = 'all';

    async function openIcityBadgesPage() {
        rememberIcitySourceView();
        $$('.view-container').forEach(v => v.classList.remove('active'));
        if (mainBottomNav) mainBottomNav.style.display = 'none';
        const view = $('#view-badges-page');
        if (view) view.classList.add('active');
        await renderIcityBadgesPage();
    }

    async function renderIcityBadgesPage() {
        const grid = $('#badges-page-grid-container');
        const totalStat = $('#badges-page-total-stat');
        const wornIndicator = $('#badges-page-worn-indicator');
        if (!grid) return;

        grid.innerHTML = '<div style="padding: 30px; text-align: center; color: var(--text-light); width: 100%; grid-column: 1 / -1;">正在统计市民勋章数据...</div>';

        const [data, source] = await Promise.all([getIcityBadgesData(), getIcityBadgeSource()]);
        const unlockedIds = new Set(source.unlockedBadgeIds || []);
        const wornIds = new Set(data.wornBadgeIds || []);

        if (totalStat) totalStat.textContent = `${unlockedIds.size}/${ICITY_BADGE_CATALOG.length}`;

        const filter = currentBadgesPageFilter;
        const filteredBadges = ICITY_BADGE_CATALOG.filter(badge => {
            if (filter === 'all') return true;
            if (filter === 'worn') return wornIds.has(badge.id);
            if (filter === 'unlocked') return unlockedIds.has(badge.id);
            return badge.category === filter;
        });

        if (!filteredBadges.length) {
            grid.innerHTML = '<div class="card-box" style="padding: 30px; text-align: center; color: var(--text-light); grid-column: 1 / -1;">该分类暂无勋章记录</div>';
            return;
        }

        grid.innerHTML = filteredBadges.map(item => {
            const unlocked = unlockedIds.has(item.id);
            const isWorn = wornIds.has(item.id);
            const progress = getIcityBadgeProgress(item, source);
            return `
                <div class="card-box icity-badge-page-card ${isWorn ? 'is-worn' : ''} ${!unlocked ? 'is-locked' : ''}" data-badge-id="${escapeIcityHtml(item.id)}" style="cursor: pointer;">
                    <div class="badge-card-icon-wrap">
                        <span class="badge-icon-emoji">${item.icon}</span>
                        ${isWorn ? '<span class="badge-status-pill">佩戴中</span>' : (!unlocked ? '<span class="badge-lock-tag">🔒</span>' : '')}
                    </div>
                    <div class="badge-card-name">${escapeIcityHtml(item.label)}</div>
                    <div class="badge-card-desc">${escapeIcityHtml(item.description)}</div>
                    <div class="badge-card-footer">
                        <span class="badge-progress-text">${escapeIcityHtml(progress)}</span>
                        <span class="badge-action-text">${isWorn ? '点击取下' : (unlocked ? '点击佩戴' : '未解锁')}</span>
                    </div>
                </div>
            `;
        }).join('');

        grid.querySelectorAll('.icity-badge-page-card').forEach(card => {
            bindIcityTap(card, async () => {
                const id = card.dataset.badgeId;
                await toggleIcityBadge(id);
                await renderIcityBadgesPage();
            });
        });
    }

    const btnBackBadgesPage = $('#btn-back-badges-page');
    if (btnBackBadgesPage) {
        bindIcityTap(btnBackBadgesPage, () => {
            const view = $('#view-badges-page');
            if (view) view.classList.remove('active');
            restoreIcitySourceView('profile');
        });
    }

    $$('#badges-filter-tabs .filter-tab').forEach(tab => {
        bindIcityTap(tab, () => {
            $$('#badges-filter-tabs .filter-tab').forEach(t => t.classList.remove('active'));
            tab.classList.add('active');
            currentBadgesPageFilter = tab.dataset.badgeCat || 'all';
            renderIcityBadgesPage();
        });
    });

    // ================= 全屏“我的回复”独立页逻辑 =================
    async function openIcityRepliesPage() {
        rememberIcitySourceView();
        $$('.view-container').forEach(v => v.classList.remove('active'));
        if (mainBottomNav) mainBottomNav.style.display = 'none';
        const view = $('#view-replies-page');
        if (view) view.classList.add('active');

        const [profile, identity] = await Promise.all([getProfile(), getIcitySocialIdentity()]);
        const userName = profile?.nickname || identity.name || '我';
        const headerTitle = $('#replies-page-header-title') || view?.querySelector('.title');
        if (headerTitle) headerTitle.textContent = `${userName} · 回复`;

        await renderIcityRepliesPage();
    }

    async function renderIcityRepliesPage() {
        const list = $('#replies-page-list-container');
        if (!list) return;

        list.innerHTML = '<div style="padding: 30px; text-align: center; color: var(--text-light); font-size: 13px;">加载我的回复中...</div>';

        const [feeds, identity, profile] = await Promise.all([
            getFeeds(),
            getIcitySocialIdentity(),
            getProfile()
        ]);

        const myReplies = [];
        (Array.isArray(feeds) ? feeds : []).forEach(post => {
            if (Array.isArray(post.comments)) {
                post.comments.forEach(comment => {
                    const isMine = (comment.actorId && comment.actorId === identity.id) ||
                                  (comment.user && comment.user === identity.name) ||
                                  (comment.handle && comment.handle === identity.handle) ||
                                  (comment.user && comment.user === (profile.nickname || ''));
                    if (isMine) {
                        myReplies.push({
                            post,
                            comment
                        });
                    }
                });
            }
        });

        myReplies.sort((a, b) => Number(b.comment.createdAt || b.comment.id || 0) - Number(a.comment.createdAt || a.comment.id || 0));

        if (!myReplies.length) {
            list.innerHTML = `
                <div class="card-box" style="padding: 40px 20px; text-align: center; color: var(--text-light); margin: 0 6px;">
                    <div style="font-size: 15px; font-weight: 600; margin-bottom: 6px; color: var(--text-sub);">暂无回复记录</div>
                    <div style="font-size: 13px;">你在日记详情页发表的评论与回复将汇总于此</div>
                </div>
            `;
            return;
        }

        const fallbackAvatarStyle = getIcityAvatarStyle(profile.avatar || identity.avatar || '');

        list.innerHTML = `
            <div class="icity-replies-list">
                ${myReplies.map(({ post, comment }) => {
                    const time = comment.time || '刚刚';
                    const postAuthor = post.user || '市民';
                    const postSnippet = post.text ? post.text.slice(0, 60) + (post.text.length > 60 ? '...' : '') : '原篇日记';
                    const userAvatar = comment.avatar || profile.avatar || identity.avatar || '';
                    const avatarStyle = userAvatar ? getIcityAvatarStyle(userAvatar) : fallbackAvatarStyle;

                    return `
                        <div class="icity-reply-card-item" data-post-id="${escapeIcityHtml(post.id)}">
                            <div class="icity-reply-avatar" style="${avatarStyle}"></div>
                            <div class="icity-reply-main">
                                <div class="icity-reply-top-row">
                                    <div class="icity-reply-target-title">
                                        <span class="icity-reply-author-name">${escapeIcityHtml(postAuthor)}</span> 的日记
                                    </div>
                                    <div class="icity-reply-time">
                                        <svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>
                                        <span>${escapeIcityHtml(time)}</span>
                                    </div>
                                </div>
                                <div class="icity-reply-content">
                                    ${escapeIcityHtml(comment.text)}
                                </div>
                                <div class="icity-reply-quote-box">
                                    ${escapeIcityHtml(postSnippet)}
                                </div>
                            </div>
                        </div>
                    `;
                }).join('')}
            </div>
        `;

        list.querySelectorAll('.icity-reply-card-item').forEach(card => {
            bindIcityTap(card, () => {
                const pid = card.dataset.postId;
                if (pid) openSinglePost(pid);
            });
        });
    }

    const btnProfileReplies = $('#btn-profile-replies');
    if (btnProfileReplies) {
        bindIcityTap(btnProfileReplies, openIcityRepliesPage);
    }

    const btnBackRepliesPage = $('#btn-back-replies-page');
    if (btnBackRepliesPage) {
        bindIcityTap(btnBackRepliesPage, () => {
            const view = $('#view-replies-page');
            if (view) view.classList.remove('active');
            restoreIcitySourceView('profile');
        });
    }

    // ================= 全屏“我的相册”独立页逻辑 =================
    async function openIcityPhotosPage() {
        rememberIcitySourceView();
        $$('.view-container').forEach(v => v.classList.remove('active'));
        if (mainBottomNav) mainBottomNav.style.display = 'none';
        const view = $('#view-photos-page');
        if (view) view.classList.add('active');

        const [profile, identity] = await Promise.all([getProfile(), getIcitySocialIdentity()]);
        const userName = profile?.nickname || identity.name || '我';
        const headerTitle = $('#photos-page-header-title');
        if (headerTitle) headerTitle.textContent = `${userName} · 相册`;

        await renderIcityPhotosPage();
    }

    async function renderIcityPhotosPage() {
        const grid = $('#photos-page-grid-container');
        const totalStat = $('#photos-page-total-stat');
        if (!grid) return;

        grid.innerHTML = '<div style="padding: 30px; text-align: center; color: var(--text-light); grid-column: 1 / -1; font-size: 13px;">正在整理我的照片...</div>';

        const [visibleFeeds, profile, authData] = await Promise.all([
            getVisibleIcityFeeds(await getFeeds()),
            getProfile(),
            getWechatAuthData()
        ]);
        const boundAccount = getBoundWechatAccount(profile, authData);
        const myFeeds = visibleFeeds.filter(post => isCurrentIcityUserPost(post, boundAccount));

        const photoItems = [];
        myFeeds.forEach(post => {
            const images = getIcityPostImages(post);
            images.forEach((imgUrl, idx) => {
                if (imgUrl && imgUrl !== ICITY_IMAGE_PLACEHOLDER_URL) {
                    photoItems.push({
                        postId: post.id,
                        imgUrl: imgUrl,
                        dateStr: stage11VideoDateLabel(getIcityPostOccurredAt(post), false)
                    });
                }
            });
        });

        if (totalStat) totalStat.textContent = `共 ${photoItems.length} 张照片`;

        if (!photoItems.length) {
            grid.innerHTML = `
                <div class="card-box" style="padding: 40px 20px; text-align: center; color: var(--text-light); grid-column: 1 / -1;">
                    <div style="font-size: 15px; font-weight: 600; margin-bottom: 6px; color: var(--text-sub);">相册空空如也</div>
                    <div style="font-size: 13px;">在日记中添加照片后，将自动收录于此</div>
                </div>
            `;
            return;
        }

        grid.innerHTML = photoItems.map(item => `
            <div class="icity-photo-grid-cell entry-item" data-id="${escapeIcityHtml(item.postId)}" style="aspect-ratio: 1; border-radius: 4px; overflow: hidden; background: #E5E5EA; cursor: pointer; position: relative;">
                <img src="${escapeIcityHtml(item.imgUrl)}" style="width: 100%; height: 100%; object-fit: cover; display: block;" alt="日记照片">
            </div>
        `).join('');

        grid.querySelectorAll('.icity-photo-grid-cell').forEach(cell => {
            bindIcityTap(cell, () => {
                const pid = cell.dataset.id;
                if (pid) openSinglePost(pid);
            });
        });
    }

    const btnProfilePhotos = $('#btn-profile-photos');
    if (btnProfilePhotos) {
        bindIcityTap(btnProfilePhotos, openIcityPhotosPage);
    }

    const btnBackPhotosPage = $('#btn-back-photos-page');
    if (btnBackPhotosPage) {
        bindIcityTap(btnBackPhotosPage, () => {
            const view = $('#view-photos-page');
            if (view) view.classList.remove('active');
            restoreIcitySourceView('profile');
        });
    }

    // ================= 个人主页市民徽章与称号独立全屏页 =================
    const btnProfileBadgesEntry = $('#btn-profile-badges-entry');
    if (btnProfileBadgesEntry) {
        bindIcityTap(btnProfileBadgesEntry, () => openCombinedCitizenPage('badges'));
    }

    // ================= 模块：Diary 市民称号与徽章合并页逻辑 =================
    const TITLE_COLOR_PRESETS = [
        '#F06553', '#FFA742', '#F78DA7', '#FFD152', '#8BC34A',
        '#8AB4F8', '#4FC3F7', '#9FA8DA', '#4DB6AC', '#2C2C2E', '#A1887F', '#B0BEC5'
    ];

    const TITLE_SPECIFIC_ITEMS = [
        'Pro', 'Highness', 'Lord', '龙年大吉', '马年大吉', '一马当先',
        '热心市民', '吃瓜群众', '路人', '无'
    ];

    const TITLE_MOOD_ITEMS = [
        '普通', '开心', '热心', '伤心', '哭泣', '微笑', '冷漠', '爆笑',
        '愤怒', '发呆', '焦虑', '警觉', '积极', '乐观', '加班', '犯困',
        '自由', '专业', '资深', '内卷', '实习', '业余', '独立', '好学',
        '修炼', '闭关', '失业', '退休', '摸鱼', '悠闲', '懒惰', '沉默',
        '高雅', '光明', '黑暗', '激情', '奔跑', '蹦跳', '回旋', '健忘',
        '中年', '高龄', '精致', '好奇', '可爱', '孤独', '虚构', '无意识',
        '异世界', '神经质', '强迫症', '无所事事', '全栈', '闪电', '勇敢',
        '倒立', '夜归', '早起', '熬夜', '神秘', '未成年', '肉食', '素食',
        '和平', '隐身', '匿名', '梦游', '肆业', '逃课', '不良', '从良',
        '专注', '冷酷', '宿醉', '觉醒', '暴走', '倦怠', '崭新', '漫长',
        '叹息', '秘密', '天然', '转职', '人形', '专心', '隐退', '冰冷',
        '白', '黑', '青', '粉色', '柔和', '奇迹', '偶像', '恶魔',
        '金主', '失信', '搞笑', '悲情', '伤病', '慢热', '披星戴月',
        '锦衣夜行', '废寝忘食', '一日三秋', '举世无双', '冰冻三尺', '春风十里'
    ];

    let selectedCitizenTitleText = 'Pro';
    let selectedCitizenTitleColor = '#8AB4F8';
    let currentCombinedCitizenTab = 'titles';
    let tempWornBadgeIds = [];
    let cachedCitizenBadgeSource = null;

    async function openCombinedCitizenPage(initialTab = 'titles') {
        rememberIcitySourceView();
        $$('.view-container').forEach(v => v.classList.remove('active'));
        if (mainBottomNav) mainBottomNav.style.display = 'none';

        const view = $('#view-citizen-title-page');
        if (view) view.classList.add('active');

        const [profile, badgeData, source] = await Promise.all([
            getProfile(),
            getIcityBadgesData(),
            getIcityBadgeSource()
        ]);

        cachedCitizenBadgeSource = source;
        selectedCitizenTitleText = profile.citizenTitleText || badgeData.wornTitleText || 'Pro';
        selectedCitizenTitleColor = profile.citizenTitleColor || '#8AB4F8';
        tempWornBadgeIds = Array.isArray(badgeData.wornBadgeIds) ? [...badgeData.wornBadgeIds].slice(0, 4) : [];

        const previewName = $('#title-preview-name');
        const previewHandle = $('#title-preview-handle');
        const previewAvatar = $('#title-preview-avatar');

        if (previewName) previewName.textContent = profile.nickname || '未命名市民';
        if (previewHandle) previewHandle.textContent = profile.icityId ? '@' + profile.icityId : '@diary_user';
        if (previewAvatar && profile.avatar) {
            previewAvatar.style.backgroundImage = profile.avatar;
            previewAvatar.style.backgroundSize = 'cover';
            previewAvatar.style.backgroundPosition = 'center';
            previewAvatar.innerHTML = '';
        }

        switchCombinedCitizenTab(initialTab);
        renderCitizenTitleColorPalette();
        await renderCitizenTitleChips();
        renderCitizenBadgesEmojiView();
        updateCitizenTitlePreview();
    }

    function switchCombinedCitizenTab(tabName) {
        currentCombinedCitizenTab = tabName;
        const tabTitles = $('#tab-switch-citizen-titles');
        const tabBadges = $('#tab-switch-citizen-badges');
        const contentTitles = $('#panel-content-citizen-titles');
        const contentBadges = $('#panel-content-citizen-badges');
        const headerTitle = $('#combined-citizen-header-title');

        if (tabName === 'titles') {
            if (tabTitles) tabTitles.classList.add('active');
            if (tabBadges) tabBadges.classList.remove('active');
            if (contentTitles) contentTitles.style.display = 'block';
            if (contentBadges) contentBadges.style.display = 'none';
            if (headerTitle) headerTitle.textContent = 'Diary 市民称号';
        } else {
            if (tabBadges) tabBadges.classList.add('active');
            if (tabTitles) tabTitles.classList.remove('active');
            if (contentBadges) contentBadges.style.display = 'block';
            if (contentTitles) contentTitles.style.display = 'none';
            if (headerTitle) headerTitle.textContent = 'Diary 市民徽章';
            renderCitizenBadgesEmojiView();
        }
    }

    const tabSwitchTitles = $('#tab-switch-citizen-titles');
    const tabSwitchBadges = $('#tab-switch-citizen-badges');
    if (tabSwitchTitles) bindIcityTap(tabSwitchTitles, () => switchCombinedCitizenTab('titles'));
    if (tabSwitchBadges) bindIcityTap(tabSwitchBadges, () => switchCombinedCitizenTab('badges'));

    function updateCitizenTitlePreview() {
        const previewPill = $('#title-preview-pill');
        const previewBadges = $('#title-preview-badges');
        if (previewPill) {
            if (!selectedCitizenTitleText || selectedCitizenTitleText === '无') {
                previewPill.style.display = 'none';
            } else {
                previewPill.style.display = 'inline-block';
                previewPill.textContent = selectedCitizenTitleText;
                previewPill.style.background = selectedCitizenTitleColor;
            }
        }

        if (previewBadges) {
            const icons = tempWornBadgeIds.map(id => {
                const b = getIcityBadgeById(id);
                return b ? b.icon : '';
            }).filter(Boolean);
            previewBadges.innerHTML = icons.join(' ');
        }
    }

    function renderCitizenBadgesEmojiView() {
        const slotsContainer = $('#badge-selected-slots');
        const countText = $('#badge-selected-count');
        const categoriesContainer = $('#badge-categories-container');
        if (!slotsContainer || !categoriesContainer) return;

        if (countText) countText.textContent = `${tempWornBadgeIds.length}/4`;

        // 渲染 4 个当前选择卡槽
        let slotsHtml = '';
        for (let i = 0; i < 4; i++) {
            const badgeId = tempWornBadgeIds[i];
            const badge = badgeId ? getIcityBadgeById(badgeId) : null;
            if (badge) {
                slotsHtml += `
                    <div class="badge-slot-box has-badge" data-slot-index="${i}">
                        <span class="badge-slot-emoji">${badge.icon}</span>
                        <div class="badge-slot-remove" data-remove-id="${badge.id}">✕</div>
                    </div>
                `;
            } else {
                slotsHtml += `<div class="badge-slot-box"></div>`;
            }
        }
        slotsContainer.innerHTML = slotsHtml;

        slotsContainer.querySelectorAll('.badge-slot-remove').forEach(btn => {
            bindIcityTap(btn, (e) => {
                e.stopPropagation();
                const id = btn.dataset.removeId;
                tempWornBadgeIds = tempWornBadgeIds.filter(x => x !== id);
                renderCitizenBadgesEmojiView();
                updateCitizenTitlePreview();
            });
        });

        // 勋章 Emoji 列表按类别分组展示
        const unlockedIds = new Set(cachedCitizenBadgeSource?.unlockedBadgeIds || []);

        const categories = [
            { name: '市民勋章', items: ICITY_BADGE_CATALOG.filter(b => b.category === '记录成就') },
            { name: '我的心情', items: ICITY_BADGE_CATALOG.filter(b => b.category === '情绪') },
            { name: '我的爱好', items: ICITY_BADGE_CATALOG.filter(b => b.category === '兴趣' || b.category === '食物') },
            { name: '我的职业', items: ICITY_BADGE_CATALOG.filter(b => b.category === '职业' || b.category === '技能' || b.category === '人物关系') }
        ];

        let catsHtml = '';
        categories.forEach(cat => {
            if (!cat.items.length) return;
            const itemsHtml = cat.items.map(b => {
                const isWorn = tempWornBadgeIds.includes(b.id);
                const isUnlocked = unlockedIds.has(b.id);
                const statusClass = isUnlocked ? 'is-unlocked' : 'is-locked';

                return `
                    <div class="badge-emoji-btn ${statusClass} ${isWorn ? 'is-worn' : ''}" data-badge-id="${escapeIcityHtml(b.id)}" data-unlocked="${isUnlocked}">
                        <span class="badge-icon-symbol">${b.icon}</span>
                        <span class="badge-name-text">${escapeIcityHtml(b.label)}</span>
                    </div>
                `;
            }).join('');

            catsHtml += `
                <div class="badge-group-title">${escapeIcityHtml(cat.name)}</div>
                <div class="badge-emoji-grid">${itemsHtml}</div>
            `;
        });

        categoriesContainer.innerHTML = catsHtml;

        categoriesContainer.querySelectorAll('.badge-emoji-btn').forEach(btn => {
            bindIcityTap(btn, () => {
                const bid = btn.dataset.badgeId;
                const isUnlocked = btn.dataset.unlocked === 'true';

                if (!isUnlocked && !tempWornBadgeIds.includes(bid)) {
                    const badgeObj = getIcityBadgeById(bid);
                    const desc = badgeObj ? badgeObj.description : '尚未达成解锁条件';
                    if (typeof window.showToast === 'function') window.showToast(`该勋章尚未解锁（${desc}）`);
                    return;
                }

                if (tempWornBadgeIds.includes(bid)) {
                    tempWornBadgeIds = tempWornBadgeIds.filter(x => x !== bid);
                } else {
                    if (tempWornBadgeIds.length >= 4) {
                        if (typeof window.showToast === 'function') window.showToast('最多同时佩戴 4 枚勋章');
                        return;
                    }
                    tempWornBadgeIds.push(bid);
                }
                renderCitizenBadgesEmojiView();
                updateCitizenTitlePreview();
            });
        });
    }

    function renderCitizenTitleColorPalette() {
        const palette = $('#title-color-palette');
        if (!palette) return;

        palette.innerHTML = TITLE_COLOR_PRESETS.map(color => {
            const isSelected = selectedCitizenTitleColor.toLowerCase() === color.toLowerCase();
            return `
                <div class="title-color-swatch ${isSelected ? 'is-selected' : ''}" data-color="${color}" style="background-color: ${color};">
                    ${isSelected ? '<span class="title-color-check">✓</span>' : ''}
                </div>
            `;
        }).join('');

        palette.querySelectorAll('.title-color-swatch').forEach(swatch => {
            bindIcityTap(swatch, () => {
                selectedCitizenTitleColor = swatch.dataset.color;
                renderCitizenTitleColorPalette();
                updateCitizenTitlePreview();
            });
        });
    }

    async function renderCitizenTitleChips() {
        const containerSpecific = $('#title-chips-specific');
        const containerAchievements = $('#title-chips-achievements');
        const containerMoods = $('#title-chips-moods');

        const source = await getIcityBadgeSource();

        const renderChip = (label, isLocked = false) => {
            const isSelected = selectedCitizenTitleText === label;
            return `
                <div class="title-choice-chip ${isSelected ? 'is-selected' : ''} ${isLocked ? 'is-locked' : ''}" data-title="${escapeIcityHtml(label)}" data-locked="${isLocked}">
                    <span class="title-radio-circle">${isSelected ? '✓' : ''}</span>
                    <span class="title-chip-label">${escapeIcityHtml(label)}</span>
                    ${isLocked ? '<span style="font-size:10px; opacity:0.6; margin-left:2px;">🔒</span>' : ''}
                </div>
            `;
        };

        if (containerSpecific) {
            containerSpecific.innerHTML = TITLE_SPECIFIC_ITEMS.map(item => renderChip(item, false)).join('');
        }

        if (containerAchievements) {
            containerAchievements.innerHTML = ICITY_TITLE_CATALOG.map(title => {
                const canUnlock = title.rule(source);
                return renderChip(title.label, !canUnlock);
            }).join('');
        }

        if (containerMoods) {
            containerMoods.innerHTML = TITLE_MOOD_ITEMS.map(item => renderChip(item, false)).join('');
        }

        $$('#view-citizen-title-page .title-choice-chip').forEach(chip => {
            bindIcityTap(chip, () => {
                if (chip.dataset.locked === 'true') {
                    if (typeof window.showToast === 'function') window.showToast('该成就称号尚未解锁，请完成对应记录');
                    return;
                }
                selectedCitizenTitleText = chip.dataset.title;
                $$('#view-citizen-title-page .title-choice-chip').forEach(c => {
                    c.classList.remove('is-selected');
                    const radio = c.querySelector('.title-radio-circle');
                    if (radio) radio.textContent = '';
                });
                chip.classList.add('is-selected');
                const radio = chip.querySelector('.title-radio-circle');
                if (radio) radio.textContent = '✓';
                updateCitizenTitlePreview();
            });
        });
    }

    const btnBackCitizenTitle = $('#btn-back-citizen-title');
    if (btnBackCitizenTitle) {
        bindIcityTap(btnBackCitizenTitle, () => {
            const view = $('#view-citizen-title-page');
            if (view) view.classList.remove('active');
            restoreIcitySourceView('profile');
        });
    }

    const btnSaveCitizenTitle = $('#btn-save-citizen-title');
    if (btnSaveCitizenTitle) {
        bindIcityTap(btnSaveCitizenTitle, async () => {
            const profile = await getProfile();
            const badgeData = await getIcityBadgesData();

            profile.citizenTitleText = selectedCitizenTitleText;
            profile.citizenTitleColor = selectedCitizenTitleColor;
            badgeData.wornTitleText = selectedCitizenTitleText;
            badgeData.wornBadgeIds = [...tempWornBadgeIds];

            await saveProfileData('citizenTitleText', selectedCitizenTitleText);
            await saveProfileData('citizenTitleColor', selectedCitizenTitleColor);
            await saveIcityBadgesData(badgeData);

            // 实时刷新个人主页称号标签
            const titlePill = $('[data-icity-badge-entry="titles"]');
            if (titlePill) {
                if (selectedCitizenTitleText && selectedCitizenTitleText !== '无') {
                    titlePill.innerHTML = '<span style="color:#C7C7CC; margin-right:2px;">+</span> ' + escapeIcityHtml(selectedCitizenTitleText);
                    titlePill.style.backgroundColor = selectedCitizenTitleColor;
                    titlePill.style.color = '#FFFFFF';
                    titlePill.style.borderColor = selectedCitizenTitleColor;
                } else {
                    titlePill.innerHTML = '<span style="color:#C7C7CC; margin-right:2px;">+</span> 我的市民称号';
                    titlePill.style.backgroundColor = 'transparent';
                    titlePill.style.color = 'var(--text-sub)';
                    titlePill.style.borderColor = 'var(--border-color)';
                }
            }

            // 实时刷新个人主页勋章标签
            const badgePill = $('[data-icity-badge-entry="badges"]');
            if (badgePill) {
                badgePill.innerHTML = '<span style="color:#C7C7CC; margin-right:2px;">+</span> ' + (tempWornBadgeIds.length ? `已佩戴 ${tempWornBadgeIds.length} 枚` : '勋章');
            }

            if (typeof window.showToast === 'function') window.showToast('市民称号与徽章已保存生效');
            const view = $('#view-citizen-title-page');
            if (view) view.classList.remove('active');
            restoreIcitySourceView('profile');
            if (typeof renderAllFeeds === 'function') renderAllFeeds();
        });
    }

    // Use one explicit click handler for badge controls to avoid duplicate touch and click binding.
    function bindIcityBadgeAction(element, handler) {
        if (!element || typeof handler !== 'function') return;
        if (!/^(BUTTON|A)$/.test(element.tagName)) {
            element.setAttribute('role', 'button');
            element.tabIndex = 0;
        }
        element.onclick = event => {
            event?.preventDefault?.();
            event?.stopPropagation?.();
            Promise.resolve(handler(event)).catch(error => console.error('Diary badge action failed:', error));
        };
        element.onkeydown = event => {
            if (event.key !== 'Enter' && event.key !== ' ') return;
            event.preventDefault();
            element.click();
        };
    }

    function bindIcityBadgeEntry(element, tabName) {
        if (!element) return;
        element.dataset.icityBadgeEntry = tabName;
        element.setAttribute('aria-label', tabName === 'titles' ? '打开市民称号' : '打开市民徽章');
        if (element.dataset.icityBadgeTapBound === tabName) return;
        element.dataset.icityBadgeTapBound = tabName;
        bindIcityTap(element, () => openIcityBadgeManager(tabName));
    }

    function installIcityBadgeEntryDelegation() {
        const titleTag = $('[data-icity-badge-entry="titles"]');
        if (titleTag && !titleTag.dataset.titleTapBound) {
            titleTag.dataset.titleTapBound = 'true';
            delete titleTag.dataset.icityBadgeTapBound;
            bindIcityTap(titleTag, () => openCombinedCitizenPage('titles'));
        }

        const badgeTag = $('[data-icity-badge-entry="badges"]');
        if (badgeTag && !badgeTag.dataset.badgeTapBound) {
            badgeTag.dataset.badgeTapBound = 'true';
            delete badgeTag.dataset.icityBadgeTapBound;
            bindIcityTap(badgeTag, () => openCombinedCitizenPage('badges'));
        }

        $$('.settings-item[data-icity-open-badges]').forEach(el => {
            if (!el.dataset.icityBadgeOpenTap) {
                el.dataset.icityBadgeOpenTap = 'true';
                bindIcityTap(el, () => openCombinedCitizenPage('badges'));
            }
        });

        const settingsTitleItem = findIcitySettingItem(viewSettings, 'Diary 市民称号');
        if (settingsTitleItem && !settingsTitleItem.dataset.titleOpenBound) {
            settingsTitleItem.dataset.titleOpenBound = 'true';
            bindIcityTap(settingsTitleItem, () => openCombinedCitizenPage('titles'));
        }

        const appSettingsTitleItem = findIcitySettingItem(viewAppSettings, 'Diary 市民称号');
        if (appSettingsTitleItem && !appSettingsTitleItem.dataset.titleOpenBound) {
            appSettingsTitleItem.dataset.titleOpenBound = 'true';
            bindIcityTap(appSettingsTitleItem, () => openCombinedCitizenPage('titles'));
        }
    }

    function renderIcityBadgeProfileLabels(data, source) {
        const badges = getIcityBadgeDisplayItems(data);
        const unlockedCount = Array.isArray(source?.unlockedBadgeIds) ? source.unlockedBadgeIds.length : 0;
        const totalCount = ICITY_BADGE_CATALOG.length;
        const badgeLabel = badges.length ? '已佩戴 ' + badges.length + ' 枚' : '勋章';
        const view = $('#view-profile');
        if (!view) return;
        const titleEntry = view.querySelector('[data-icity-badge-entry="titles"]') || view.querySelectorAll('.user-tags .tag-pill')[0];
        const badgeEntry = view.querySelector('[data-icity-badge-entry="badges"]') || view.querySelectorAll('.user-tags .tag-pill')[1];
        
        getProfile().then(profile => {
            const currentTitleText = profile?.citizenTitleText || (data?.wornTitleText || '');
            const currentTitleColor = profile?.citizenTitleColor || '#8AB4F8';
            if (titleEntry) {
                if (currentTitleText && currentTitleText !== '无') {
                    titleEntry.innerHTML = '<span style="color:#C7C7CC; margin-right:2px;">+</span> ' + escapeIcityHtml(currentTitleText);
                    titleEntry.style.backgroundColor = currentTitleColor;
                    titleEntry.style.color = '#FFFFFF';
                    titleEntry.style.borderColor = currentTitleColor;
                } else {
                    titleEntry.innerHTML = '<span style="color:#C7C7CC; margin-right:2px;">+</span> 我的市民称号';
                    titleEntry.style.backgroundColor = 'transparent';
                    titleEntry.style.color = 'var(--text-sub)';
                    titleEntry.style.borderColor = 'var(--border-color)';
                }
            }
        });

        if (badgeEntry) {
            badgeEntry.innerHTML = '<span style="color:#C7C7CC; margin-right:2px;">+</span> ' + (badges.length ? badgeLabel : '勋章');
            badgeEntry.classList.toggle('icity-badge-tag-active', Boolean(badges.length));
        }

        $$('[data-icity-badge-value]').forEach(element => {
            element.textContent = badges.length
                ? '已佩戴 ' + badges.length + ' 枚'
                : '已获得 ' + unlockedCount + '/' + totalCount;
        });

        const legacyStrip = $('#icity-profile-badge-strip');
        if (legacyStrip) legacyStrip.remove();
    }

    function renderIcityWornBadgesOnCards(data, source) {
        const wornBadges = getIcityBadgeDisplayItems(data);
        const title = getIcityTitleById(data?.wornTitleId);
        const cards = $$('.icity-new-app-wrapper .entry-item[data-id]');
        const postMap = new Map((source?.personalFeeds || []).map(post => [String(post.id), post]));
        cards.forEach(card => {
            const post = postMap.get(String(card.dataset.id));
            if (!post || !isCurrentIcityUserPost(post, source.boundAccount)) return;
            let inline = card.querySelector('.icity-worn-badges-inline');
            if (!inline) {
                inline = document.createElement('div');
                inline.className = 'icity-worn-badges-inline';
                const footer = card.querySelector('.entry-footer');
                if (footer) footer.before(inline);
                else card.appendChild(inline);
            }
            inline.innerHTML = (title ? '<span class="icity-inline-title">🏷️ ' + escapeIcityHtml(title.label) + '</span>' : '') +
                wornBadges.map(item => '<span>' + item.icon + ' ' + escapeIcityHtml(item.label) + '</span>').join('');
            inline.style.display = title || wornBadges.length ? 'flex' : 'none';
            bindIcityBadgeAction(inline, () => openIcityBadgeManager('badges'));
        });
    }

    async function refreshIcityBadgeUi() {
        const [data, source] = await Promise.all([getIcityBadgesData(), getIcityBadgeSource()]);
        source.boundAccount = getBoundWechatAccount(await getProfile(), await getWechatAuthData());
        const unlockedIds = source.unlockedBadgeIds || [];
        const canPersist = Boolean(window.db && window.db.objectStoreNames?.contains('layoutStore'));
        if (!data.unlockHistoryInitialized) {
            data.unlockHistoryInitialized = true;
            data.knownUnlockedBadgeIds = unlockedIds;
            if (canPersist) await saveIcityBadgesData(data);
        } else {
            const knownIds = new Set(data.knownUnlockedBadgeIds || []);
            const justUnlocked = unlockedIds.filter(id => !knownIds.has(id));
            if (justUnlocked.length || knownIds.size !== unlockedIds.length) {
                data.knownUnlockedBadgeIds = unlockedIds;
                if (canPersist) await saveIcityBadgesData(data);
            }
            if (justUnlocked.length) showIcityBadgeUnlockNotice(justUnlocked);
        }
        renderIcityBadgeProfileLabels(data, source);
        renderIcityWornBadgesOnCards(data, source);
    }

    async function closeIcityBadgeManager() {
        const panel = $('#icity-badge-panel');
        if (panel) panel.classList.remove('active');
    }

    async function renderIcityBadgeManager() {
        const panel = ensureIcityBadgePanel();
        const modal = panel.querySelector('.icity-badge-modal');
        panel.classList.add('active');
        modal.innerHTML = '<div class="icity-badge-modal-header"><div><div class="icity-badge-modal-kicker">Diary 身份收藏</div><h2>市民徽章与称号</h2></div><button type="button" class="icity-badge-close" data-icity-badge-close aria-label="关闭">×</button></div><div class="icity-badge-modal-body"><div class="icity-badge-empty-state">正在读取市民徽章…</div></div>';
        bindIcityBadgeAction(modal.querySelector('[data-icity-badge-close]'), closeIcityBadgeManager);
        let data;
        let source;
        try {
            [data, source] = await Promise.all([getIcityBadgesData(), getIcityBadgeSource()]);
        } catch (error) {
            modal.innerHTML = '<div class="icity-badge-modal-header"><div><div class="icity-badge-modal-kicker">Diary 身份收藏</div><h2>市民徽章与称号</h2></div><button type="button" class="icity-badge-close" data-icity-badge-close aria-label="关闭">×</button></div><div class="icity-badge-modal-body"><div class="icity-badge-empty-state">徽章资料暂未准备好，请稍后重试。</div><button type="button" data-icity-badge-retry>重新加载</button></div>';
            bindIcityBadgeAction(modal.querySelector('[data-icity-badge-close]'), closeIcityBadgeManager);
            bindIcityBadgeAction(modal.querySelector('[data-icity-badge-retry]'), renderIcityBadgeManager);
            return;
        }
        const unlockedIds = new Set(source.unlockedBadgeIds);
        const recommendationMap = new Map((data.aiRecommendations || []).map(item => [item.id, item]));
        const wornBadges = getIcityBadgeDisplayItems(data);
        const wornTitle = getIcityTitleById(data.wornTitleId);
        const availableTitles = ICITY_TITLE_CATALOG.filter(item => item.rule(source));
        const recommendedBadges = ICITY_BADGE_CATALOG.filter(item => recommendationMap.has(item.id));
        const tabs = '<div class="icity-badge-tabs">' +
            '<button type="button" data-icity-badge-tab="badges" class="' + (currentIcityBadgePanelTab === 'badges' ? 'active' : '') + '">勋章佩戴</button>' +
            '<button type="button" data-icity-badge-tab="titles" class="' + (currentIcityBadgePanelTab === 'titles' ? 'active' : '') + '">市民称号</button>' +
            '</div>';
        const header = '<div class="icity-badge-modal-header">' +
            '<div><div class="icity-badge-modal-kicker">CITY BADGES</div><h2>市民身份管理</h2><p>点击佩戴或卸下，身份徽章将随你点亮 Diary。</p></div>' +
            '<button type="button" class="icity-badge-close" data-icity-badge-close aria-label="关闭">×</button>' +
            '</div>';
        let body = '';
        if (currentIcityBadgePanelTab === 'titles') {
            body = '<div class="icity-badge-section-title">市民称号 · 点击佩戴</div>' +
                (availableTitles.length ? availableTitles.map(item => {
                    const active = item.id === data.wornTitleId;
                    return '<div class="icity-title-option ' + (active ? 'active' : '') + '">' +
                        '<div><strong>🏷️ ' + escapeIcityHtml(item.label) + '</strong><span>' + escapeIcityHtml(item.description) + '</span></div>' +
                        '<button type="button" data-icity-wear-title="' + item.id + '">' + (active ? '卸下' : '佩戴') + '</button></div>';
                }).join('') : '<div class="icity-badge-empty-state">尚未解锁任何称号，发布第一篇日记即可解锁「初来市民」。</div>');
        } else {
            body = '<div class="icity-badge-section-title">已点亮 ' + unlockedIds.size + ' / ' + ICITY_BADGE_CATALOG.length + ' 枚 · 佩戴中 ' + wornBadges.length + '/' + ICITY_BADGE_MAX_WORN + '</div>' +
                '<div class="icity-badge-grid">' + ICITY_BADGE_CATALOG.map(item => {
                    const unlocked = unlockedIds.has(item.id);
                    const active = data.wornBadgeIds.includes(item.id);
                    const recommendation = recommendationMap.get(item.id);
                    const canWear = unlocked || Boolean(recommendation);
                    const progress = getIcityBadgeProgress(item, source);
                    const interactive = active || canWear;
                    return '<article class="icity-badge-card ' + (active ? 'active ' : '') + (!canWear ? 'locked' : '') + '" ' +
                        (interactive ? 'data-icity-wear-badge="' + item.id + '" role="button" tabindex="0" aria-label="' + escapeIcityHtml((active ? '取下' : '佩戴') + item.label) + '"' : 'aria-disabled="true"') + '>' +
                        '<div class="icity-badge-icon">' + item.icon + (active ? '<span class="icity-badge-check">✓</span>' : !canWear ? '<span class="icity-badge-lock">🔒</span>' : '') + '</div>' +
                        '<div class="icity-badge-card-main"><strong>' + escapeIcityHtml(item.label) + '</strong><span>' + escapeIcityHtml(item.description) + '</span><small>' + escapeIcityHtml(item.category) + (recommendation ? ' · 推荐' : '') + '</small></div>' +
                        '<div class="icity-badge-progress">' + escapeIcityHtml(progress) + '</div><div class="icity-badge-state">' + (active ? '佩戴中' : canWear ? '可佩戴' : '未解锁') + '</div>' +
                    '</article>';
                }).join('') + '</div>' +
                '<div class="icity-badge-ai-box"><div><strong>AI 智能推荐徽章</strong><p>' + (recommendedBadges.length ? '根据日记内容已为你推荐 ' + recommendedBadges.length + ' 枚兴趣徽章。' : '根据你的日记文字与生活足迹，挖掘适合你的专属勋章。') + '</p></div><button type="button" data-icity-badge-ai>智能挖掘</button></div>';
        }
        modal.innerHTML = header + tabs + '<div class="icity-badge-modal-body">' + body + '</div>';
        panel.classList.add('active');
        panel.querySelectorAll('[data-icity-badge-close]').forEach(button => bindIcityBadgeAction(button, closeIcityBadgeManager));
        panel.querySelectorAll('[data-icity-badge-tab]').forEach(button => bindIcityBadgeAction(button, () => {
            currentIcityBadgePanelTab = button.dataset.icityBadgeTab || 'badges';
            renderIcityBadgeManager();
        }));
        panel.querySelectorAll('[data-icity-wear-title]').forEach(button => bindIcityBadgeAction(button, () => toggleIcityTitle(button.dataset.icityWearTitle)));
        panel.querySelectorAll('[data-icity-wear-badge]').forEach(button => bindIcityBadgeAction(button, () => toggleIcityBadge(button.dataset.icityWearBadge)));
        const aiButton = panel.querySelector('[data-icity-badge-ai]');
        if (aiButton) bindIcityBadgeAction(aiButton, requestIcityBadgeRecommendations);
    }

    async function openIcityBadgeManager(tabName) {
        currentIcityBadgePanelTab = tabName === 'titles' ? 'titles' : 'badges';
        await renderIcityBadgeManager();
    }

    async function toggleIcityTitle(titleId) {
        const title = getIcityTitleById(titleId);
        if (!title) return;
        const data = await getIcityBadgesData();
        const source = await getIcityBadgeSource();
        if (data.wornTitleId === title.id) {
            data.wornTitleId = '';
            showIcityBadgeToast(`已卸下称号：${title.label}`);
        } else {
            if (!title.rule(source)) {
                showIcityBadgeToast('该称号尚未解锁');
                return;
            }
            data.wornTitleId = title.id;
            showIcityBadgeToast(`已佩戴称号：${title.label}`);
        }
        await saveIcityBadgesData(data);
        await refreshIcityBadgeUi();
        const modal = $('#icity-badge-panel');
        if (modal && modal.classList.contains('active')) {
            await renderIcityBadgeManager();
        }
    }

    async function toggleIcityBadge(badgeId) {
        const badge = getIcityBadgeById(badgeId);
        if (!badge) return;
        const data = await getIcityBadgesData();
        const source = await getIcityBadgeSource();
        const recommendation = (data.aiRecommendations || []).some(item => item.id === badge.id);
        const isWorn = data.wornBadgeIds.includes(badge.id);
        if (isWorn) {
            data.wornBadgeIds = data.wornBadgeIds.filter(id => id !== badge.id);
            showIcityBadgeToast(`已取下勋章：${badge.label}`);
        } else {
            if (!source.unlockedBadgeIds.includes(badge.id) && !recommendation) {
                showIcityBadgeToast('该勋章尚未解锁');
                return;
            }
            if (data.wornBadgeIds.length >= ICITY_BADGE_MAX_WORN) {
                showIcityBadgeToast('最多同时佩戴 ' + ICITY_BADGE_MAX_WORN + ' 枚勋章');
                return;
            }
            data.wornBadgeIds.push(badge.id);
            showIcityBadgeToast(`已佩戴勋章：${badge.label}`);
        }
        await saveIcityBadgesData(data);
        await refreshIcityBadgeUi();
        const modal = $('#icity-badge-panel');
        if (modal && modal.classList.contains('active')) {
            await renderIcityBadgeManager();
        }
    }

    async function requestIcityBadgeRecommendations() {
        const panel = ensureIcityBadgePanel();
        const button = panel.querySelector('[data-icity-badge-ai]');
        if (button) {
            button.disabled = true;
            button.textContent = '分析中…';
        }
        try {
            const [api, source] = await Promise.all([getConnectedIcityApi(), getIcityBadgeSource()]);
            const candidates = ICITY_BADGE_CATALOG.filter(item => item.aiEligible).map(item => ({
                id: item.id,
                name: item.label,
                category: item.category,
                description: item.description
            }));
            const content = await requestIcityChatCompletion(api, [
                { role: 'system', content: '你是 Diary 兴趣徽章推荐器。只根据用户提供的日记内容推荐，不编造用户没有表达过的兴趣。只输出 JSON。' },
                { role: 'user', content: '从候选徽章中推荐最多 5 个最贴合用户记录的徽章。返回格式：{"badgeIds":["..."],"reasons":{"badge-id":"一句中文理由"}}。候选：' + JSON.stringify(candidates) + '\n用户记录：' + source.text.slice(0, 6000) }
            ], { temperature: 0.35, emptyMessage: 'API 没有返回徽章推荐' });
            const parsed = parseIcityJsonObject(content) || {};
            const validIds = new Set(candidates.map(item => item.id));
            const ids = (Array.isArray(parsed.badgeIds) ? parsed.badgeIds : [])
                .map(String)
                .filter(id => validIds.has(id))
                .filter((id, index, list) => list.indexOf(id) === index)
                .slice(0, 5);
            if (!ids.length) throw new Error('AI 没有返回可用的徽章推荐');
            const reasons = parsed.reasons && typeof parsed.reasons === 'object' ? parsed.reasons : {};
            const data = await getIcityBadgesData();
            data.aiRecommendations = ids.map(id => ({ id, reason: String(reasons[id] || '与你的记录气质相符') }));
            await saveIcityBadgesData(data);
            showIcityBadgeToast('AI 推荐已更新，请确认后再佩戴');
            await renderIcityBadgeManager();
        } catch (error) {
            showIcityBadgeToast(error?.message || '徽章推荐失败');
        } finally {
            const nextButton = panel.querySelector('[data-icity-badge-ai]');
            if (nextButton) {
                nextButton.disabled = false;
                nextButton.textContent = '开始推荐';
            }
        }
    }

    async function initializeIcityBadgeFeature() {
        installIcityBadgeEntryDelegation();
        const tabProfileButton = $('#tab-profile');
        if (tabProfileButton && !tabProfileButton.dataset.icityBadgeBound) {
            tabProfileButton.dataset.icityBadgeBound = 'true';
            tabProfileButton.addEventListener('click', () => {
                setTimeout(() => {
                    installIcityBadgeEntryDelegation();
                    refreshIcityBadgeUi();
                }, 0);
            });
        }
        const originalRenderAllFeeds = renderAllFeeds;
        renderAllFeeds = async function() {
            const result = await originalRenderAllFeeds.apply(this, arguments);
            installIcityBadgeEntryDelegation();
            await refreshIcityBadgeUi();
            return result;
        };
        try {
            await refreshIcityBadgeUi();
            installIcityBadgeEntryDelegation();
        } catch (error) {
            console.warn('Unable to initialize citizen badges:', error);
        }
    }

    initializeIcityBadgeFeature();



    // ================= Stage 9: notifications, likes, replies and relationships =================
    const ICITY_SOCIAL_NOTIFICATIONS_KEY = 'icity_notifications';
    const ICITY_SOCIAL_RELATIONSHIPS_KEY = 'icity_relationships';
    let icitySocialPendingReply = null;

    function getIcitySocialNotificationTypeLabel(type) {
        const labels = {
            mention: '@ 提醒',
            reply: '回复',
            comment: '评论',
            like: '喜欢',
            follow: '关系'
        };
        return labels[String(type || '')] || '通知';
    }

    function getIcitySocialActorKey(actor) {
        if (actor && typeof actor === 'object') {
            return String(
                actor.actorId ||
                actor.userId ||
                actor.wxid ||
                actor.id ||
                actor.handle ||
                actor.user ||
                actor.name ||
                ''
            ).trim();
        }
        return String(actor || '').trim();
    }

    function isIcityCurrentSocialActor(actor, identity) {
        const actorKey = getIcitySocialActorKey(actor);
        if (!actorKey || !identity) return false;
        return [identity.id, identity.handle, identity.name]
            .map(value => String(value || '').trim())
            .filter(Boolean)
            .includes(actorKey);
    }

    async function getIcitySocialIdentity() {
        const [profile, authData] = await Promise.all([getProfile(), getWechatAuthData()]);
        const boundAccount = getBoundWechatAccount(profile, authData);
        const name = String(profile?.nickname || boundAccount?.name || '我').trim() || '我';
        const handle = String(profile?.icityId || boundAccount?.wxid || 'diary_user').trim();
        const id = String(boundAccount?.wxid || boundAccount?.maskId || profile?.icityId || handle).trim();
        return {
            id,
            name,
            handle: handle.startsWith('@') ? handle : '@' + handle,
            avatar: String(boundAccount?.avatar || profile?.avatar || '').trim()
        };
    }

    function normalizeIcitySocialNotification(item) {
        if (!item || typeof item !== 'object') return null;
        const id = String(item.id || '').trim();
        if (!id) return null;
        return {
            id,
            type: String(item.type || 'comment'),
            postId: item.postId ?? null,
            commentId: item.commentId ?? null,
            actorId: String(item.actorId || '').trim(),
            actorName: String(item.actorName || '市民').trim(),
            actorHandle: String(item.actorHandle || '').trim(),
            actorAvatar: String(item.actorAvatar || '').trim(),
            text: String(item.text || '').trim(),
            createdAt: Number(item.createdAt || Date.now()),
            read: item.read === true
        };
    }

    async function getIcitySocialNotifications() {
        const stored = await getIcityData(ICITY_SOCIAL_NOTIFICATIONS_KEY, []);
        const list = Array.isArray(stored) ? stored : [];
        return list.map(normalizeIcitySocialNotification).filter(Boolean)
            .sort((a, b) => b.createdAt - a.createdAt);
    }

    async function saveIcitySocialNotifications(notifications) {
        const incoming = (Array.isArray(notifications) ? notifications : [])
            .map(normalizeIcitySocialNotification)
            .filter(Boolean);
        return withIcityDataLock(ICITY_SOCIAL_NOTIFICATIONS_KEY, [], stored => {
            const map = new Map((Array.isArray(stored) ? stored : [])
                .map(normalizeIcitySocialNotification)
                .filter(Boolean)
                .map(item => [item.id, item]));
            incoming.forEach(item => map.set(item.id, item));
            return Array.from(map.values())
                .sort((a, b) => b.createdAt - a.createdAt)
                .slice(0, 200);
        });
    }

    function getIcitySocialNotificationId(type, postId, actorId, extraId) {
        return ['icity_notice', type, String(postId || 'none'), String(actorId || 'unknown'), String(extraId || 'none')].join('_');
    }

    async function syncIcitySocialNotifications() {
        const [feeds, identity, existing, profile, authData, contactsData, wechatContactsData] = await Promise.all([
            getVisibleIcityFeeds(await getFeeds()),
            getIcitySocialIdentity(),
            getIcitySocialNotifications(),
            getProfile(),
            getWechatAuthData(),
            getContactsData(),
            getWechatContactsData()
        ]);
        const socialCharAvatarMap = new Map();
        getIcityReactionContactCandidates(contactsData, wechatContactsData).forEach(item => {
            const cName = String(item.contact?.name || item.wechatContact?.name || '').trim();
            const cAvatar = item.contact?.avatar || item.wechatContact?.avatar || '';
            if (cName && cAvatar) socialCharAvatarMap.set(cName, cAvatar);
        });
        const boundAccount = getBoundWechatAccount(profile, authData);
        const notificationMap = new Map(existing.map(item => [item.id, item]));
        const upsert = item => {
            const old = notificationMap.get(item.id);
            notificationMap.set(item.id, Object.assign({
                read: old?.read === true,
                createdAt: Date.now()
            }, item, {
                read: old?.read === true
            }));
        };

        feeds.forEach(post => {
            const postId = String(post?.id || '');
            if (!postId) return;
            const postTitle = String(post?.text || '').trim().slice(0, 48) || '你的日记';
            const comments = Array.isArray(post?.comments) ? post.comments : [];
            comments.forEach(comment => {
                const actorId = getIcitySocialActorKey(comment) || String(comment?.user || '市民').trim();
                if (!actorId || isIcityCurrentSocialActor(comment, identity)) return;
                const commentText = String(comment?.text || '').trim();
                const mentionName = String(identity.name || '').replace(/^@/, '');
                const mentionHandle = String(identity.handle || '').replace(/^@/, '');
                const isMention = Boolean(
                    (mentionName && commentText.includes('@' + mentionName)) ||
                    (mentionHandle && commentText.includes('@' + mentionHandle))
                );
                const isReply = Boolean(
                    comment?.replyToCommentId ||
                    comment?.parentCommentId ||
                    isIcityCurrentSocialActor(comment?.replyToUser || comment?.replyToActor, identity)
                );
                if (!isCurrentIcityUserPost(post, boundAccount) && !isMention && !isReply) return;
                const type = isMention ? 'mention' : (isReply ? 'reply' : 'comment');
                const id = getIcitySocialNotificationId(type, postId, actorId, comment?.id);
                const text = isMention
                    ? (String(comment?.user || '市民') + ' 在日记中提到了你')
                    : (isReply
                        ? (String(comment?.user || '市民') + ' 回复了你的评论')
                        : (String(comment?.user || '市民') + ' 评论了你的日记'));

                const actorName = String(comment?.user || comment?.name || '市民');
                let resolvedAvatar = comment?.avatar || '';
                if (!resolvedAvatar && socialCharAvatarMap.has(actorName)) {
                    resolvedAvatar = socialCharAvatarMap.get(actorName);
                }

                upsert({
                    id,
                    type,
                    postId: post.id,
                    commentId: comment?.id ?? null,
                    actorId,
                    actorName: actorName,
                    actorHandle: String(comment?.handle || ''),
                    actorAvatar: resolvedAvatar,
                    text: text + ' · ' + postTitle,
                    createdAt: Number(comment?.createdAt || post?.createdAt || post?.id || Date.now())
                });
            });

            const likedBy = Array.isArray(post?.likedBy)
                ? post.likedBy
                : (Array.isArray(post?.likedUsers) ? post.likedUsers : []);
            if (!isCurrentIcityUserPost(post, boundAccount, { requireIdentity: true })) return;
            likedBy.forEach(actor => {
                if (isIcityCurrentSocialActor(actor, identity)) return;
                const actorId = getIcitySocialActorKey(actor);
                if (!actorId) return;
                const id = getIcitySocialNotificationId('like', postId, actorId, '');
                upsert({
                    id,
                    type: 'like',
                    postId: post.id,
                    actorId,
                    actorName: String(actor?.name || actor?.user || actor?.nickname || actorId),
                    actorHandle: String(actor?.handle || ''),
                    actorAvatar: String(actor?.avatar || ''),
                    text: String(actor?.name || actor?.user || '市民') + ' 喜欢了你的日记 · ' + postTitle,
                    createdAt: Number(actor?.createdAt || post?.updatedAt || post?.createdAt || Date.now())
                });
            });
        });

        const next = Array.from(notificationMap.values())
            .sort((a, b) => b.createdAt - a.createdAt)
            .slice(0, 200);
        const previousJson = JSON.stringify(existing);
        const nextJson = JSON.stringify(next);
        if (previousJson !== nextJson) await saveIcitySocialNotifications(next);
        return next;
    }

    function getIcitySocialNotificationTime(timestamp) {
        const date = new Date(Number(timestamp || 0));
        if (Number.isNaN(date.getTime())) return '';
        const now = Date.now();
        const diff = Math.max(0, now - date.getTime());
        if (diff < 60000) return '刚刚';
        if (diff < 3600000) return Math.floor(diff / 60000) + '分钟前';
        if (diff < 86400000) return Math.floor(diff / 3600000) + '小时前';
        return String(date.getMonth() + 1).padStart(2, '0') + '-' + String(date.getDate()).padStart(2, '0');
    }

    function updateIcitySocialUnreadBadge(count) {
        if (!tabWorldNotices) return;
        let badge = tabWorldNotices.querySelector('.icity-social-unread-badge');
        if (!count) {
            if (badge) badge.remove();
            return;
        }
        if (!badge) {
            badge = document.createElement('span');
            badge.className = 'icity-social-unread-badge';
            tabWorldNotices.appendChild(badge);
        }
        badge.textContent = count > 99 ? '99+' : String(count);
    }

    async function markIcitySocialNotificationRead(notificationId) {
        const list = await getIcitySocialNotifications();
        const item = list.find(notification => notification.id === String(notificationId));
        if (!item || item.read) return list;
        item.read = true;
        const next = await saveIcitySocialNotifications(list);
        updateIcitySocialUnreadBadge(next.filter(notification => !notification.read).length);
        return next;
    }

    async function renderIcitySocialNotifications() {
        const container = $('#content-world-notices');
        if (!container) return;
        const [notifications, allFeeds, contactsData, wechatContactsData] = await Promise.all([
            syncIcitySocialNotifications(),
            getFeeds(),
            getContactsData(),
            getWechatContactsData()
        ]);
        const feedMap = new Map((Array.isArray(allFeeds) ? allFeeds : []).map(p => [String(p.id), p]));
        const charAvatarMap = new Map();
        getIcityReactionContactCandidates(contactsData, wechatContactsData).forEach(item => {
            const name = String(item.contact?.name || item.wechatContact?.name || '').trim();
            const avatar = item.contact?.avatar || item.wechatContact?.avatar || '';
            if (name && avatar) charAvatarMap.set(name, avatar);
        });

        const unreadCount = notifications.filter(item => !item.read).length;
        updateIcitySocialUnreadBadge(unreadCount);

        if (!notifications.length) {
            container.innerHTML = '<div class="card-box icity-social-empty"><div class="icity-social-empty-icon">@</div><strong>暂无互动通知</strong><span>当有市民评论、回复或喜欢你的日记时，将在这里呈现</span></div>';
            return;
        }

        container.innerHTML =
            '<div class="icity-social-toolbar">' +
                '<strong>全部通知 ' + (unreadCount > 0 ? '<span style="color: #4A90E2; font-weight: normal;">(' + unreadCount + '条未读)</span>' : '') + '</strong>' +
                '<button type="button" data-icity-social-mark-read>全部已读</button>' +
            '</div>' +
            '<div class="icity-social-list">' +
            notifications.map(notification => {
                const unreadClass = notification.read ? '' : ' unread';
                const post = feedMap.get(String(notification.postId || ''));
                const postSnippet = post ? (post.text ? post.text.slice(0, 36) + (post.text.length > 36 ? '...' : '') : '日记图片') : '原篇日记';
                const commentText = (notification.type !== 'like' && post && Array.isArray(post.comments))
                    ? (post.comments.find(c => String(c.id) === String(notification.commentId))?.text || '')
                    : '';

                let actorAvatar = notification.actorAvatar || '';
                if (!actorAvatar && charAvatarMap.has(notification.actorName)) {
                    actorAvatar = charAvatarMap.get(notification.actorName);
                }

                return '<article class="card-box icity-social-notification-card' + unreadClass + '" data-icity-notification-id="' + escapeIcityHtml(notification.id) + '" data-icity-notification-post="' + escapeIcityHtml(String(notification.postId || '')) + '">' +
                    '<div class="icity-social-notification-avatar" style="' + getIcityAvatarStyle(actorAvatar) + '"></div>' +
                    '<div class="icity-social-notification-main">' +
                        '<div class="icity-social-notification-top">' +
                            '<strong>' + escapeIcityHtml(notification.actorName) + '</strong>' +
                            '<span>' + getIcitySocialNotificationTime(notification.createdAt) + '</span>' +
                        '</div>' +
                        (commentText ? '<div class="icity-social-notification-text">' + escapeIcityHtml(commentText) + '</div>' : '') +
                        '<div class="notification-post-quote"><span>原日记：</span>' + escapeIcityHtml(postSnippet) + '</div>' +
                    '</div>' +
                    '<span class="icity-social-notification-dot"></span>' +
                '</article>';
            }).join('') +
            '</div>';

        const markRead = container.querySelector('[data-icity-social-mark-read]');
        if (markRead) {
            markRead.addEventListener('click', async event => {
                event.stopPropagation();
                const next = (await getIcitySocialNotifications()).map(item => Object.assign({}, item, { read: true }));
                await saveIcitySocialNotifications(next);
                await renderIcitySocialNotifications();
            });
        }
        container.querySelectorAll('[data-icity-notification-id]').forEach(card => {
            card.addEventListener('click', async () => {
                const notificationId = card.dataset.icityNotificationId;
                const postId = card.dataset.icityNotificationPost;
                await markIcitySocialNotificationRead(notificationId);
                if (postId) await openSinglePost(postId);
            });
        });
    }

    function isIcityPostLikedByCurrentUser(post, identity) {
        if (post?.isLiked === true) return true;
        const likedBy = Array.isArray(post?.likedBy)
            ? post.likedBy
            : (Array.isArray(post?.likedUsers) ? post.likedUsers : []);
        return likedBy.some(actor => isIcityCurrentSocialActor(actor, identity));
    }

    async function renderIcityLikedDiaries() {
        const container = $('#content-world-likes');
        if (!container) return;
        const [feeds, identity, profile] = await Promise.all([
            getVisibleIcityFeeds(await getFeeds()),
            getIcitySocialIdentity(),
            getProfile()
        ]);
        const liked = feeds.filter(post => isIcityPostLikedByCurrentUser(post, identity))
            .sort((a, b) => getIcityPostOccurredAt(b) - getIcityPostOccurredAt(a));

        if (!liked.length) {
            container.innerHTML = '<div class="card-box" style="padding: 40px 20px; text-align: center; color: var(--text-light);"><div style="font-size: 32px; margin-bottom: 8px; color: #FF3B30; opacity: 0.65;">♥</div><div style="font-size: 15px; font-weight: 600; color: var(--text-main); margin-bottom: 4px;">暂无喜欢的日记</div><div style="font-size: 13px; color: var(--text-sub);">在世界或朋友频道点击爱心，心动的日记将收录在这里</div></div>';
            return;
        }

        const renderPostCitizenTitleTag = (titleText, titleColor) => {
            const text = String(titleText || '').trim();
            if (!text || text === '无') return '';
            const color = String(titleColor || '#8AB4F8').trim();
            return `<span class="icity-citizen-title-tag" style="background-color: ${escapeIcityHtml(color)};">${escapeIcityHtml(text)}</span>`;
        };

        const myCitizenTitleTag = renderPostCitizenTitleTag(profile.citizenTitleText, profile.citizenTitleColor);

        container.innerHTML = liked.map(post => {
            const isMine = isCurrentIcityUserPost(post, identity);
            const postAvatarStyle = getIcityAvatarStyle(post.authorWechatAvatar || post.avatar || profile.avatar);
            const postTitleTag = isMine ? myCitizenTitleTag : renderPostCitizenTitleTag(post.citizenTitleText, post.citizenTitleColor);
            const postUserName = isMine ? (profile.nickname || post.user || '未命名市民') : (post.user || '市民');
            const postUserHandle = isMine ? (profile.icityId ? '@' + profile.icityId : (post.handle || '@diary_user')) : (post.handle || '@diary');
            const imgHtml = renderIcityFeedImage(post);
            const locHtml = post.location ? `
                <div class="entry-location" style="color: var(--text-light); font-size: 13px;">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="width: 16px; height: 16px; margin-right: 2px; transform: translateY(1px);"><path d="M17.5 19H9a7 7 0 1 1 6.71-9h1.79a4.5 4.5 0 1 1 0 9Z"></path></svg>
                    ${escapeIcityHtml(post.location)} 23°C
                </div>` : '<div></div>';

            const likeSvg = `<div class="entry-like-btn" data-post-id="${escapeIcityHtml(post.id)}" style="cursor: pointer; display: flex; align-items: center;"><svg viewBox="0 0 24 24" style="width: 16px; height: 16px; fill: #FF3B30; stroke: #FF3B30; stroke-width: 2;"><path stroke-linecap="round" stroke-linejoin="round" d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"></path></svg></div>`;

            const noteSvg = (post.notes && post.notes.length > 0)
                ? `<div style="display: flex; align-items: center; gap: 2px; color: #8AB4F8;">
                      <svg viewBox="0 0 24 24" style="width: 16px; height: 16px; fill: #8AB4F8; stroke: #8AB4F8; stroke-width: 1.5; stroke-linejoin: round;"><path d="M17 3H7c-1.1 0-2 .9-2 2v16l7-3 7 3V5c0-1.1-.9-2-2-2z"></path></svg>
                      <span style="font-size: 12px; font-weight: 600;">${post.notes.length}</span>
                   </div>`
                : '';

            return `
                <div class="card-box entry-item" data-id="${escapeIcityHtml(post.id)}" style="cursor: pointer; border-bottom: none;">
                    <div class="entry-user-header">
                        <div class="avatar char-avatar-clickable" data-is-mine="${isMine}" style="${postAvatarStyle}"></div>
                        <div class="user-info">
                            <div class="name" style="display: flex; align-items: center; flex-wrap: wrap;">
                                <span>${escapeIcityHtml(postUserName)}</span>${postTitleTag}
                            </div>
                            <div class="username">${escapeIcityHtml(postUserHandle)} ${post.diary ? '· ' + escapeIcityHtml(post.diary) : ''}</div>
                        </div>
                    </div>
                    <div class="entry-content">${escapeIcityHtml(post.text)}</div>
                    ${imgHtml}
                    <div class="entry-footer">
                        ${locHtml}
                        <div class="entry-actions">
                            ${likeSvg}
                            ${noteSvg}
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="-0.5 -0.5 16 16" style="width: 18px; height: 18px; fill: none; stroke: currentColor;"><path stroke-linecap="round" stroke-linejoin="round" d="M11.875 2.5H3.125a1.25 1.25 0 0 0 -1.25 1.25v6.25a1.25 1.25 0 0 0 1.25 1.25h1.9925000000000002c0.625 0 1.1325 0.5068750000000001 1.1325 1.1325 0 0.505 0.61 0.7575 0.9668749999999999 0.400625l1.166875 -1.166875A1.25 1.25 0 0 1 9.2675 11.25H11.875a1.25 1.25 0 0 0 1.25 -1.25V3.75a1.25 1.25 0 0 0 -1.25 -1.25z" stroke-width="1.2"></path></svg>
                            <div class="entry-time">
                                <svg viewBox="0 0 24 24" style="width: 16px; height: 16px; fill: none; stroke: currentColor; stroke-width: 2;"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>
                                ${escapeIcityHtml(post.time || '刚刚')}
                            </div>
                            <svg viewBox="0 0 24 24" style="width: 16px; height: 16px; fill: currentColor; stroke: none;"><circle cx="12" cy="5" r="1.5"></circle><circle cx="12" cy="12" r="1.5"></circle><circle cx="12" cy="19" r="1.5"></circle></svg>
                        </div>
                    </div>
                </div>
            `;
        }).join('');

        container.querySelectorAll('.entry-item').forEach(card => {
            card.addEventListener('click', event => {
                const likeBtn = event.target.closest('.entry-like-btn');
                if (likeBtn) {
                    event.stopPropagation();
                    const pid = likeBtn.dataset.postId;
                    if (pid) toggleIcitySocialLike(pid, false);
                    return;
                }
                const avatar = event.target.closest('.char-avatar-clickable');
                if (avatar) {
                    event.stopPropagation();
                    if (avatar.dataset.isMine === 'true') {
                        switchView('profile');
                    } else {
                        openCharProfile(card.dataset.id);
                    }
                    return;
                }
                openSinglePost(card.dataset.id);
            });
        });
    }

    async function toggleIcitySocialLike(postId, reopenDetail = false) {
        const feeds = await getFeeds();
        const index = feeds.findIndex(post => String(post.id) === String(postId));
        if (index === -1) return;
        const identity = await getIcitySocialIdentity();
        const post = feeds[index];
        const likedBy = Array.isArray(post.likedBy)
            ? post.likedBy.slice()
            : (Array.isArray(post.likedUsers) ? post.likedUsers.slice() : []);
        const actorIndex = likedBy.findIndex(actor => isIcityCurrentSocialActor(actor, identity));
        if (actorIndex >= 0) {
            likedBy.splice(actorIndex, 1);
            post.isLiked = false;
        } else {
            likedBy.push({
                id: identity.id,
                name: identity.name,
                handle: identity.handle,
                avatar: identity.avatar,
                createdAt: Date.now()
            });
            post.isLiked = true;
        }
        post.likedBy = likedBy;
        await saveFeed(post);
        await syncIcitySocialNotifications();
        if (typeof renderAllFeeds === 'function') await renderAllFeeds();
        if (reopenDetail && typeof openSinglePost === 'function') await openSinglePost(postId);
        if (contentWorldLikes?.style.display !== 'none') await renderIcityLikedDiaries();
        if (contentWorldNotices?.style.display !== 'none') await renderIcitySocialNotifications();
    }

    function bindIcitySocialLikeTarget(target, postId) {
        if (!target || target.dataset.icitySocialLikeBound === 'true') return;
        target.dataset.icitySocialLikeBound = 'true';
        target.addEventListener('click', event => {
            event.preventDefault();
            event.stopPropagation();
            toggleIcitySocialLike(postId, false);
        });
    }

    function decorateIcitySocialLikeTargets() {
        document.querySelectorAll('.icity-new-app-wrapper .entry-item[data-id] .entry-actions, .icity-new-app-wrapper .entry-item[data-id] .char-simple-post-actions').forEach(actions => {
            const target = actions.firstElementChild;
            const entry = actions.closest('.entry-item');
            if (!target || !entry) return;
            bindIcitySocialLikeTarget(target, entry.dataset.id);
        });
    }

    function setIcitySocialReplyTarget(comment) {
        icitySocialPendingReply = comment ? {
            id: String(comment.id || ''),
            user: String(comment.user || comment.name || '市民')
        } : null;
        if (inputComment) {
            inputComment.placeholder = icitySocialPendingReply
                ? '回复 ' + icitySocialPendingReply.user
                : '我要评论';
            if (icitySocialPendingReply) inputComment.focus();
        }
    }

    function clearIcitySocialReplyTarget() {
        setIcitySocialReplyTarget(null);
    }

    function decorateIcityCommentRows(post) {
        const container = $('#single-post-comments-container');
        if (!container || !Array.isArray(post?.comments)) return;
        const displayedComments = post.comments.slice().sort((a, b) => {
            if (a.isPinned && !b.isPinned) return -1;
            if (!a.isPinned && b.isPinned) return 1;
            return 0;
        });
        const rows = container.querySelectorAll('.comment-item');
        rows.forEach((row, index) => {
            const comment = displayedComments[index];
            if (!comment) return;
            let button = row.querySelector('.icity-comment-reply-button');
            if (!button) {
                button = document.createElement('button');
                button.type = 'button';
                button.className = 'icity-comment-reply-button';
                button.textContent = '回复';
                const content = row.querySelector('.comment-content');
                if (content) content.insertAdjacentElement('afterend', button);
            }
            button.dataset.icityReplyComment = String(comment.id || '');
            button.onclick = event => {
                event.preventDefault();
                event.stopPropagation();
                setIcitySocialReplyTarget(comment);
            };
        });
    }

    async function submitIcitySocialComment() {
        if (!inputComment || window.icitySocialCommentSending) return;
        const text = inputComment.value.trim();
        if (!text) {
            showIcityBadgeToast('请输入评论内容');
            return;
        }
        const postId = window.currentSinglePostId;
        if (postId == null) {
            showIcityBadgeToast('当前日记不可评论');
            return;
        }
        window.icitySocialCommentSending = true;
        if (btnSendComment) btnSendComment.disabled = true;
        try {
            const feeds = await getFeeds();
            const index = feeds.findIndex(post => String(post.id) === String(postId));
            if (index === -1) throw new Error('未找到这篇日记');
            const identity = await getIcitySocialIdentity();
            if (!Array.isArray(feeds[index].comments)) feeds[index].comments = [];
            const now = new Date();
            const timeString = String(now.getMonth() + 1).padStart(2, '0') + '-' + String(now.getDate()).padStart(2, '0') + ' ' + String(now.getHours()).padStart(2, '0') + ':' + String(now.getMinutes()).padStart(2, '0');
            const reply = icitySocialPendingReply;
            feeds[index].comments.push({
                id: 'icity_comment_' + Date.now() + '_' + Math.random().toString(36).slice(2, 7),
                text,
                user: identity.name,
                handle: identity.handle,
                actorId: identity.id,
                avatar: identity.avatar,
                avatarStyle: identity.avatar ? getIcityAvatarStyle(identity.avatar) : '',
                time: timeString,
                createdAt: Date.now(),
                replyToCommentId: reply?.id || null,
                replyToUser: reply?.user || ''
            });
            await saveFeed(feeds[index]);
            inputComment.value = '';
            clearIcitySocialReplyTarget();
            await syncIcitySocialNotifications();
            await openSinglePost(postId);
            await renderAllFeeds();
            updateSinglePostKeyboardOffset();
            setTimeout(() => {
                const scrollArea = $('#view-single-post .content-scroll');
                if (scrollArea) scrollArea.scrollTop = scrollArea.scrollHeight;
            }, 100);
        } catch (error) {
            console.error('Diary social comment submission failed:', error);
            showIcityBadgeToast(error?.message || '评论发送失败，请重试');
        } finally {
            window.icitySocialCommentSending = false;
            if (btnSendComment) btnSendComment.disabled = false;
        }
    }

    function interceptIcitySocialCommentSubmit() {
        if (btnSendComment && btnSendComment.dataset.icitySocialSubmitBound !== 'true') {
            btnSendComment.dataset.icitySocialSubmitBound = 'true';
            btnSendComment.addEventListener('click', event => {
                event.preventDefault();
                event.stopImmediatePropagation();
                submitIcitySocialComment();
            }, true);
        }
        if (inputComment && inputComment.dataset.icitySocialSubmitBound !== 'true') {
            inputComment.dataset.icitySocialSubmitBound = 'true';
            inputComment.addEventListener('keydown', event => {
                if (event.key !== 'Enter' || event.isComposing) return;
                event.preventDefault();
                event.stopImmediatePropagation();
                submitIcitySocialComment();
            }, true);
        }
    }

    function normalizeIcityRelationshipItem(item) {
        if (!item || typeof item !== 'object') return null;
        const targetId = String(item.targetId || item.id || '').trim();
        if (!targetId) return null;
        return {
            targetId,
            targetType: String(item.targetType || 'character'),
            name: String(item.name || '市民').trim(),
            handle: String(item.handle || '').trim(),
            avatar: String(item.avatar || '').trim(),
            friend: item.friend === true || item.status === 'friend',
            following: item.following === true || item.status === 'following',
            blocked: item.blocked === true || item.status === 'blocked',
            special: item.special === true || item.status === 'special',
            updatedAt: Number(item.updatedAt || Date.now())
        };
    }

    async function getIcityRelationshipsData() {
        const stored = await getIcityData(ICITY_SOCIAL_RELATIONSHIPS_KEY, { version: 1, items: [] });
        const rawItems = Array.isArray(stored) ? stored : stored?.items;
        const items = (Array.isArray(rawItems) ? rawItems : [])
            .map(normalizeIcityRelationshipItem)
            .filter(Boolean);
        const profile = await getProfile();
        const legacyFriends = Array.isArray(profile?.addedFriendIds) ? profile.addedFriendIds.map(String) : [];
        legacyFriends.forEach(targetId => {
            const current = items.find(item => item.targetId === targetId);
            if (current) current.friend = true;
            else items.push(normalizeIcityRelationshipItem({ targetId, friend: true }));
        });
        return { version: 1, items };
    }

    async function saveIcityRelationshipsData(data) {
        const next = {
            version: 1,
            items: (Array.isArray(data?.items) ? data.items : [])
                .map(normalizeIcityRelationshipItem)
                .filter(Boolean)
        };
        await saveIcityData(ICITY_SOCIAL_RELATIONSHIPS_KEY, next);
        return next;
    }

    function getIcityRelationshipTarget(post) {
        return {
            targetId: String(post?.characterId || post?.authorWechatId || post?.user || post?.handle || '').trim(),
            targetType: post?.authorType === 'character' ? 'character' : 'user',
            name: String(post?.user || '市民').trim(),
            handle: String(post?.handle || '').trim(),
            avatar: String(post?.authorWechatAvatar || post?.avatar || '').trim()
        };
    }

    async function toggleIcityRelationship(target, field) {
        if (!target?.targetId) return;
        const profile = await getProfile();
        const legacyFriends = Array.isArray(profile?.addedFriendIds) ? profile.addedFriendIds.map(String) : [];
        let nextRelationship = null;
        await withIcityDataLock(ICITY_SOCIAL_RELATIONSHIPS_KEY, { version: 1, items: [] }, stored => {
            const rawItems = Array.isArray(stored) ? stored : stored?.items;
            const items = (Array.isArray(rawItems) ? rawItems : [])
                .map(normalizeIcityRelationshipItem)
                .filter(Boolean);
            legacyFriends.forEach(targetId => {
                const existing = items.find(item => item.targetId === targetId);
                if (existing) existing.friend = true;
                else items.push(normalizeIcityRelationshipItem({ targetId, friend: true }));
            });
            let item = items.find(entry => entry.targetId === target.targetId);
            if (!item) {
                item = normalizeIcityRelationshipItem(target);
                items.push(item);
            }
            item[field] = !item[field];
            if (field === 'blocked' && item.blocked) {
                item.friend = false;
                item.following = false;
                item.special = false;
            }
            if (field !== 'blocked' && item[field] && item.blocked) item.blocked = false;
            item.updatedAt = Date.now();
            nextRelationship = item;
            return { version: 1, items };
        });
        if (field === 'friend') {
            const nextFriends = nextRelationship.friend
                ? Array.from(new Set(legacyFriends.concat(nextRelationship.targetId)))
                : legacyFriends.filter(id => id !== nextRelationship.targetId);
            await patchProfileData({ addedFriendIds: nextFriends });
        }
        if (typeof window.showToast === 'function') window.showToast(nextRelationship[field] ? ('已设置为' + (field === 'friend' ? '好友' : field === 'following' ? '关注' : field === 'special' ? '特别关注' : '黑名单')) : '已取消该关系');
        await renderIcityRelationshipControls(target);
        if (typeof renderIcityContactsFriendsList === 'function') await renderIcityContactsFriendsList();
        if (typeof renderAllFeeds === 'function') await renderAllFeeds();
    }

    async function renderIcityRelationshipControls(postOrTarget) {
        const view = $('#view-char-profile');
        const actionArea = view?.querySelector('.char-action-buttons');
        if (!view || !actionArea) return;
        let target = postOrTarget;
        if (!target?.targetId) {
            const feeds = await getFeeds();
            const post = feeds.find(item => String(item.id) === String(postOrTarget));
            target = getIcityRelationshipTarget(post);
        }
        if (!target?.targetId) return;
        const data = await getIcityRelationshipsData();
        let relationship = data.items.find(item => item.targetId === target.targetId);
        if (!relationship) relationship = normalizeIcityRelationshipItem(target);
        let friendButton = actionArea.querySelector('.btn-action');
        if (!friendButton) return;
        friendButton.dataset.icityRelationshipFriend = 'true';
        friendButton.innerHTML = relationship.friend ? '已是好友' : '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg> 加好友';
        friendButton.className = relationship.friend ? 'btn-action btn-outline' : 'btn-action btn-green';
        friendButton.onclick = () => toggleIcityRelationship(target, 'friend');

        let panel = view.querySelector('#icity-relationship-actions');
        if (!panel) {
            panel = document.createElement('div');
            panel.id = 'icity-relationship-actions';
            panel.className = 'icity-relationship-actions';
            actionArea.insertAdjacentElement('afterend', panel);
        }
        panel.innerHTML =
            '<button type="button" data-icity-relationship="following"></button>' +
            '<button type="button" data-icity-relationship="special"></button>' +
            '<button type="button" data-icity-relationship="blocked"></button>';
        const labels = {
            following: relationship.following ? '已关注' : '关注',
            special: relationship.special ? '已特别关注' : '特别关注',
            blocked: relationship.blocked ? '已拉黑' : '拉黑'
        };
        panel.querySelectorAll('[data-icity-relationship]').forEach(button => {
            const field = button.dataset.icityRelationship;
            button.textContent = labels[field];
            button.classList.toggle('active', Boolean(relationship[field]));
            button.classList.toggle('danger', field === 'blocked');
            button.addEventListener('click', event => {
                event.stopPropagation();
                toggleIcityRelationship(target, field);
            });
        });
    }

    async function initializeIcitySocialFeature() {
        const stage9OriginalOpenSinglePost = openSinglePost;
        openSinglePost = async function() {
            const result = await stage9OriginalOpenSinglePost.apply(this, arguments);
            const post = (await getFeeds()).find(item => String(item.id) === String(window.currentSinglePostId));
            if (post) decorateIcityCommentRows(post);
            return result;
        };

        const stage9OriginalOpenCharProfile = openCharProfile;
        openCharProfile = async function() {
            const result = await stage9OriginalOpenCharProfile.apply(this, arguments);
            const post = (await getFeeds()).find(item => String(item.id) === String(arguments[0]));
            if (post) await renderIcityRelationshipControls(post);
            return result;
        };

        const stage9OriginalProfileStats = getIcityProfileStats;
        getIcityProfileStats = async function(visibleFeeds) {
            const stats = await stage9OriginalProfileStats(visibleFeeds);
            const relationships = await getIcityRelationshipsData();
            stats.friends = relationships.items.filter(item => item.friend && !item.blocked).length;
            return stats;
        };

        const stage9OriginalRenderAllFeeds = renderAllFeeds;
        renderAllFeeds = async function() {
            const result = await stage9OriginalRenderAllFeeds.apply(this, arguments);
            decorateIcitySocialLikeTargets();
            if (contentWorldLikes?.style.display !== 'none') await renderIcityLikedDiaries();
            if (contentWorldNotices?.style.display !== 'none') await renderIcitySocialNotifications();
            return result;
        };

        interceptIcitySocialCommentSubmit();

        // 绑定详情页右上角小飞机：手动弹出互动对象选择弹窗生成评论
        function ensurePostInteractionPickerModal() {
            let modal = $('#modal-post-generate-interactions');
            if (modal) return modal;
            modal = document.createElement('div');
            modal.id = 'modal-post-generate-interactions';
            modal.className = 'modal-overlay';
            modal.innerHTML = `
                <div class="interaction-picker-content" role="dialog" aria-modal="true">
                    <div class="interaction-picker-header">
                        <div class="interaction-picker-title">选择互动市民</div>
                        <div style="font-size: 12px; color: var(--text-light);" id="interaction-picker-summary">已选 0 位</div>
                    </div>
                    <div class="interaction-picker-body" id="interaction-picker-list">
                        <!-- 动态生成路人与角色勾选列表 -->
                    </div>
                    <div class="interaction-picker-footer">
                        <button type="button" class="interaction-picker-btn btn-cancel" id="btn-cancel-post-interaction">取消</button>
                        <button type="button" class="interaction-picker-btn btn-confirm" id="btn-confirm-post-interaction">确认生成</button>
                    </div>
                </div>
            `;
            const host = document.querySelector('#icityNewAppUI .icity-app-inner-container') || document.getElementById('icityNewAppUI') || document.body;
            host.appendChild(modal);

            const cancelBtn = modal.querySelector('#btn-cancel-post-interaction');
            if (cancelBtn) {
                bindIcityTap(cancelBtn, () => modal.classList.remove('active'));
            }
            modal.addEventListener('click', (e) => {
                if (e.target === modal) modal.classList.remove('active');
            });
            return modal;
        }

        async function openPostInteractionPicker() {
            if (!window.currentSinglePostId) return;
            const feeds = await getFeeds();
            const post = feeds.find(p => String(p.id) === String(window.currentSinglePostId));
            if (!post) {
                showIcityBadgeToast('未找到该日记');
                return;
            }

            const modal = ensurePostInteractionPickerModal();
            const listContainer = modal.querySelector('#interaction-picker-list');
            const summaryText = modal.querySelector('#interaction-picker-summary');
            const confirmBtn = modal.querySelector('#btn-confirm-post-interaction');

            listContainer.innerHTML = '<div style="padding: 24px; text-align: center; color: var(--text-light); font-size: 13px;">加载市民候选中...</div>';
            modal.classList.add('active');

            const [contactsData, wechatContactsData] = await Promise.all([
                getContactsData(),
                getWechatContactsData()
            ]);

            const candidates = getIcityReactionContactCandidates(contactsData, wechatContactsData, post.characterId);
            const selectedCharIds = new Set();
            let includePasserby = false;

            const updateSummary = () => {
                const total = selectedCharIds.size + (includePasserby ? 1 : 0);
                if (summaryText) summaryText.textContent = total ? `已选 ${total} 项` : '未选择';
            };

            // 渲染路人 NPC 独立项 + 各个真实 Char 角色
            let itemsHtml = `
                <div class="interaction-option-item" data-type="passerby">
                    <div class="interaction-option-avatar" style="background: linear-gradient(135deg, #FFB340, #FFD6A5); color: #FFF;">👥</div>
                    <div class="interaction-option-info">
                        <div class="interaction-option-name">路人 NPC</div>
                        <div class="interaction-option-desc">随机生成 1~2 位路过市民的随笔留言</div>
                    </div>
                    <div class="interaction-option-check">✓</div>
                </div>
            `;

            candidates.forEach(c => {
                const cid = String(c.contact.id);
                const name = c.contact.name || '角色';
                const persona = c.contact.persona ? c.contact.persona.slice(0, 20) : 'Diary 市民';
                const avatarStyle = getIcityAvatarStyle(c.contact.avatar || c.wechatContact?.avatar || '');

                itemsHtml += `
                    <div class="interaction-option-item" data-type="character" data-cid="${escapeIcityHtml(cid)}">
                        <div class="interaction-option-avatar" style="${avatarStyle}"></div>
                        <div class="interaction-option-info">
                            <div class="interaction-option-name">${escapeIcityHtml(name)}</div>
                            <div class="interaction-option-desc">${escapeIcityHtml(persona)}</div>
                        </div>
                        <div class="interaction-option-check">✓</div>
                    </div>
                `;
            });

            listContainer.innerHTML = itemsHtml;
            updateSummary();

            listContainer.querySelectorAll('.interaction-option-item').forEach(item => {
                bindIcityTap(item, () => {
                    const type = item.dataset.type;
                    if (type === 'passerby') {
                        includePasserby = !includePasserby;
                        item.classList.toggle('is-selected', includePasserby);
                    } else {
                        const cid = item.dataset.cid;
                        if (selectedCharIds.has(cid)) {
                            selectedCharIds.delete(cid);
                            item.classList.remove('is-selected');
                        } else {
                            selectedCharIds.add(cid);
                            item.classList.add('is-selected');
                        }
                    }
                    updateSummary();
                });
            });

            confirmBtn.onclick = async () => {
                if (!selectedCharIds.size && !includePasserby) {
                    showIcityBadgeToast('请先勾选要生成评论的市民或路人');
                    return;
                }

                confirmBtn.disabled = true;
                confirmBtn.textContent = '生成中…';

                try {
                    const api = await getConnectedIcityApi();
                    const authorIdentity = await getIcitySinglePostIdentity(post);

                    const targets = [];
                    // 1. 装配角色
                    candidates.forEach(c => {
                        const cid = String(c.contact.id);
                        if (selectedCharIds.has(cid)) {
                            targets.push({
                                type: 'contact',
                                characterId: c.contact.id,
                                name: c.contact.name || '联系人',
                                persona: c.contact.persona || '',
                                appearance: c.contact.appearance || '',
                                avatar: c.contact.avatar || c.wechatContact?.avatar || '',
                                handle: c.wechatContact?.wxid ? '@' + c.wechatContact.wxid : '@' + String(c.contact.name || 'Diary').trim()
                            });
                        }
                    });

                    // 2. 装配路人
                    if (includePasserby) {
                        const count = Math.floor(Math.random() * 2) + 1;
                        for (let i = 0; i < count; i++) {
                            targets.push({
                                type: 'passerby',
                                name: pickIcityPasserbyName(i),
                                avatar: pickIcityPasserbyAvatar(i)
                            });
                        }
                    }

                    const comments = [];
                    for (const [index, target] of targets.entries()) {
                        try {
                            const reaction = await requestIcityPostReaction(api, post, target, authorIdentity);
                            if (reaction.comment) {
                                comments.push(createIcityAutoComment(target, reaction.comment.slice(0, 150), index));
                            }
                        } catch (err) {
                            console.warn('单条评论生成失败:', err);
                        }
                    }

                    if (!comments.length) {
                        throw new Error('未生成到评论内容，请重试');
                    }

                    const currentFeeds = await getFeeds();
                    const targetIdx = currentFeeds.findIndex(p => String(p.id) === String(post.id));
                    if (targetIdx !== -1) {
                        if (!Array.isArray(currentFeeds[targetIdx].comments)) currentFeeds[targetIdx].comments = [];
                        currentFeeds[targetIdx].comments.push(...comments);
                        await saveFeed(currentFeeds[targetIdx]);
                    }

                    modal.classList.remove('active');
                    showIcityBadgeToast(`成功生成 ${comments.length} 条评论互动！`);
                    await openSinglePost(post.id);
                    await renderAllFeeds();
                } catch (error) {
                    console.error('手动触发生成互动失败:', error);
                    showIcityBadgeToast(error?.message || '生成互动失败');
                } finally {
                    confirmBtn.disabled = false;
                    confirmBtn.textContent = '确认生成';
                }
            };
        }

        const btnSendAiInteraction = $('#btn-single-post-send-ai-interaction');
        if (btnSendAiInteraction && !btnSendAiInteraction.dataset.bound) {
            btnSendAiInteraction.dataset.bound = 'true';
            bindIcityTap(btnSendAiInteraction, openPostInteractionPicker);
        }

        if (btnLikeAction && btnLikeAction.dataset.icitySocialLikeBound !== 'true') {
            btnLikeAction.dataset.icitySocialLikeBound = 'true';
            btnLikeAction.addEventListener('click', event => {
                event.preventDefault();
                event.stopImmediatePropagation();
                toggleIcitySocialLike(window.currentSinglePostId, true);
            }, true);
        }

        if (tabWorldNotices) {
            tabWorldNotices.addEventListener('click', () => renderIcitySocialNotifications());
        }
        if (tabWorldLikes) {
            tabWorldLikes.addEventListener('click', () => renderIcityLikedDiaries());
        }

        try {
            await syncIcitySocialNotifications();
            decorateIcitySocialLikeTargets();
            updateIcitySocialUnreadBadge((await getIcitySocialNotifications()).filter(item => !item.read).length);
        } catch (error) {
            console.warn('Unable to initialize social interactions:', error);
        }
    }

    initializeIcitySocialFeature();


    // ================= Stage 10: 可打印日记 PDF 导出 =================
    const ICITY_PDF_EXPORT_PREFS_KEY = 'icity_pdf_export_preferences';
    const ICITY_PDF_EXPORT_COVER_PRESETS = {
        blue: {
            label: '晴空蓝',
            background: 'linear-gradient(135deg, #244b74 0%, #6e9bc5 52%, #d6e6f2 100%)'
        },
        warm: {
            label: '纸张暖棕',
            background: 'linear-gradient(135deg, #6c4437 0%, #c28d67 48%, #f3dfbd 100%)'
        },
        ink: {
            label: '墨色夜航',
            background: 'linear-gradient(135deg, #17202b 0%, #394c63 52%, #9eb6c8 100%)'
        }
    };

    function getIcityPdfExportPrefs() {
        return getIcityData(ICITY_PDF_EXPORT_PREFS_KEY, {}).catch(() => ({}));
    }

    async function saveIcityPdfExportPrefs(prefs) {
        await saveIcityData(ICITY_PDF_EXPORT_PREFS_KEY, {
            scope: String(prefs?.scope || 'year'),
            year: String(prefs?.year || ''),
            month: String(prefs?.month || ''),
            bookId: String(prefs?.bookId || ''),
            cover: String(prefs?.cover || 'blue'),
            layout: String(prefs?.layout || 'classic')
        });
    }

    function stage10FormatPdfDate(timestamp, includeWeekday = true) {
        const date = getIcityDateObject(getIcityPostOccurredAt({ occurredAt: timestamp }));
        if (Number.isNaN(date.getTime())) return '未记录日期';
        return date.toLocaleDateString('zh-CN', includeWeekday
            ? { year: 'numeric', month: 'long', day: 'numeric', weekday: 'short' }
            : { year: 'numeric', month: 'long', day: 'numeric' });
    }

    function stage10GetPdfAuthor(post) {
        return String(post?.authorName || post?.author || post?.wxName || post?.nickname || '我').trim() || '我';
    }

    function stage10GetPdfEntryText(post) {
        return String(post?.text || post?.content || post?.body || '').trim();
    }

    function stage10GetPdfLocation(post) {
        return String(post?.location || post?.place || post?.city || '').trim();
    }

    function stage10ShowPdfToast(message) {
        if (typeof window.showToast === 'function') window.showToast(message);
        else console.warn(message);
    }

    async function stage10GetUserDiaryFeeds() {
        const visibleFeeds = await getVisibleIcityFeeds(await getFeeds());
        const [profile, authData] = await Promise.all([getProfile(), getWechatAuthData()]);
        const boundAccount = getBoundWechatAccount(profile, authData);
        return visibleFeeds
            .filter(post => isCurrentIcityUserPost(post, boundAccount))
            .sort((a, b) => getIcityPostOccurredAt(b) - getIcityPostOccurredAt(a));
    }

    function stage10GetYearOptions(feeds) {
        const years = new Set([new Date().getFullYear()]);
        (Array.isArray(feeds) ? feeds : []).forEach(post => {
            const year = getIcityAnnualYear(getIcityPostOccurredAt(post));
            if (year) years.add(year);
        });
        return Array.from(years).sort((a, b) => b - a);
    }

    function stage10GetMonthOptions(feeds) {
        const months = new Set([getIcityMonthKey(Date.now())]);
        (Array.isArray(feeds) ? feeds : []).forEach(post => {
            const month = getIcityMonthKey(getIcityPostOccurredAt(post));
            if (month) months.add(month);
        });
        return Array.from(months).filter(Boolean).sort((a, b) => b.localeCompare(a));
    }

    function stage10GetMonthLabel(monthKey) {
        const match = String(monthKey || '').match(/^(\d{4})-(\d{2})$/);
        return match ? match[1] + '年' + Number(match[2]) + '月' : '选择月份';
    }

    function stage10GetBookLabel(book) {
        const name = String(book?.name || '未命名日记本').trim();
        const count = Array.isArray(book?.diaryIds) ? book.diaryIds.length : 0;
        return count ? name + ' · ' + count + '篇' : name;
    }

    function stage10PopulatePdfSelect(select, options, selectedValue) {
        if (!select) return;
        select.innerHTML = options.map(option => (
            '<option value="' + escapeIcityHtml(String(option.value)) + '">' +
            escapeIcityHtml(String(option.label)) +
            '</option>'
        )).join('');
        if (selectedValue !== undefined && selectedValue !== null && Array.from(select.options).some(option => option.value === String(selectedValue))) {
            select.value = String(selectedValue);
        } else if (select.options.length) {
            select.selectedIndex = 0;
        }
    }

    function stage10SetPdfScope(panel, scope) {
        const nextScope = ['year', 'month', 'book'].includes(scope) ? scope : 'year';
        panel.dataset.scope = nextScope;
        panel.querySelectorAll('[data-icity-pdf-scope]').forEach(button => {
            button.classList.toggle('active', button.dataset.icityPdfScope === nextScope);
            button.setAttribute('aria-selected', button.dataset.icityPdfScope === nextScope ? 'true' : 'false');
        });
        panel.querySelectorAll('[data-icity-pdf-field]').forEach(field => {
            field.hidden = field.dataset.icityPdfField !== nextScope;
        });
    }

    function stage10EnsurePdfExportPanel() {
        let panel = $('#icity-pdf-export-panel');
        if (panel) return panel;
        panel = document.createElement('div');
        panel.id = 'icity-pdf-export-panel';
        panel.className = 'modal-overlay icity-pdf-export-panel';
        panel.innerHTML =
            '<div class="icity-pdf-export-modal" role="dialog" aria-modal="true" aria-labelledby="icity-pdf-export-title">' +
                '<div class="icity-modal-custom-header">' +
                    '<div class="back-btn icity-pdf-export-close" style="cursor: pointer; display: flex; align-items: center; color: var(--text-sub); width: 40px;">' +
                        '<svg viewBox="0 0 24 24" width="22" height="22" stroke="currentColor" stroke-width="2" fill="none"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>' +
                    '</div>' +
                    '<div class="modal-title" id="icity-pdf-export-title">导出日记 PDF</div>' +
                    '<div style="width: 40px;"></div>' +
                '</div>' +
                '<div class="icity-modal-custom-body">' +
                    '<div class="card-box" style="padding: 12px 14px;">' +
                        '<div style="font-size: 12px; color: var(--text-light); line-height: 1.4; margin-bottom: 10px;">选择导出范围与装帧版式，调起打印面板即可存为 PDF。</div>' +
                        '<div class="segmented-control" style="width: 100%; display: flex; box-sizing: border-box;" role="tablist" aria-label="导出范围">' +
                            '<div class="segment-btn active" data-icity-pdf-scope="year" role="tab" style="flex: 1;">年度</div>' +
                            '<div class="segment-btn" data-icity-pdf-scope="month" role="tab" style="flex: 1;">月份</div>' +
                            '<div class="segment-btn" data-icity-pdf-scope="book" role="tab" style="flex: 1;">日记本</div>' +
                        '</div>' +
                    '</div>' +
                    '<div class="card-box icity-pdf-export-fields" style="overflow: hidden;">' +
                        '<div class="icity-export-setting-row" data-icity-pdf-field="year"><span class="setting-row-label">目标年份</span><select class="setting-row-select" id="icity-pdf-export-year"></select></div>' +
                        '<div class="icity-export-setting-row" data-icity-pdf-field="month"><span class="setting-row-label">目标月份</span><select class="setting-row-select" id="icity-pdf-export-month"></select></div>' +
                        '<div class="icity-export-setting-row" data-icity-pdf-field="book"><span class="setting-row-label">所属日记本</span><select class="setting-row-select" id="icity-pdf-export-book"></select></div>' +
                        '<div class="icity-export-setting-row"><span class="setting-row-label">封面风格</span><select class="setting-row-select" id="icity-pdf-export-cover">' +
                            '<option value="blue">晴空蓝 (Blue)</option><option value="warm">纸张暖棕 (Warm)</option><option value="ink">墨色夜航 (Ink)</option>' +
                        '</select></div>' +
                        '<div class="icity-export-setting-row"><span class="setting-row-label">内页布局</span><select class="setting-row-select" id="icity-pdf-export-layout">' +
                            '<option value="classic">经典 · 图文单栏</option><option value="compact">紧凑 · 图片双栏</option><option value="gallery">相册 · 图片优先</option>' +
                        '</select></div>' +
                    '</div>' +
                    '<div class="icity-pdf-export-status" data-icity-pdf-status aria-live="polite" style="font-size: 12px; color: var(--theme-blue); padding: 0 4px 4px; min-height: 18px; text-align: center;"></div>' +
                '</div>' +
                '<div class="icity-modal-custom-footer">' +
                    '<button type="button" class="create-diary-bottom-btn icity-pdf-export-submit">' +
                        '<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M6 9V2h12v7"></path><path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"></path><rect x="6" y="14" width="12" height="8"></rect></svg>' +
                        '生成并预览 PDF' +
                    '</button>' +
                '</div>' +
            '</div>';
        const host = document.querySelector('#icityNewAppUI .icity-app-inner-container') || document.getElementById('icityNewAppUI') || document.body;
        host.appendChild(panel);
        panel.querySelectorAll('[data-icity-pdf-scope]').forEach(button => {
            button.addEventListener('click', () => stage10SetPdfScope(panel, button.dataset.icityPdfScope));
        });
        const closePanel = () => panel.classList.remove('active');
        panel.querySelector('.icity-pdf-export-close')?.addEventListener('click', closePanel);
        panel.addEventListener('click', event => {
            if (event.target === panel) closePanel();
        });
        panel.querySelector('.icity-pdf-export-submit')?.addEventListener('click', () => {
            stage10ExportPdfFromPanel(panel).catch(error => {
                console.error('Failed to export diary PDF', error);
                const status = panel.querySelector('[data-icity-pdf-status]');
                if (status) status.textContent = '导出失败，请稍后重试。';
                stage10ShowPdfToast('PDF 导出失败，请稍后重试');
            });
        });
        stage10SetPdfScope(panel, 'year');
        return panel;
    }

    async function stage10OpenPdfExportPanel(preferredScope = 'year', preferredBook = null) {
        const profile = await getProfile();
        if (!isIcityProUser(profile)) {
            if (typeof window.showToast === 'function') window.showToast('导出精美 A5 日记书 (PDF) 为 Diary Pro 荣誉市民专享');
            openVipCenterView();
            return;
        }
        const panel = stage10EnsurePdfExportPanel();
        const [prefs, feeds, books] = await Promise.all([
            getIcityPdfExportPrefs(),
            stage10GetUserDiaryFeeds(),
            getDiaries()
        ]);
        const safeBooks = (Array.isArray(books) ? books : []).filter(Boolean).sort((a, b) => {
            const pinDiff = Number(Boolean(b?.pinned)) - Number(Boolean(a?.pinned));
            return pinDiff || String(a?.name || '').localeCompare(String(b?.name || ''), 'zh-CN');
        });
        panel._stage10Books = safeBooks;
        const currentBookId = String(preferredBook?.id || prefs?.bookId || safeBooks[0]?.id || '');
        const currentYear = String(prefs?.year || currentCalendarYear || new Date().getFullYear());
        const currentMonth = String(prefs?.month || getIcityMonthKey(Date.now()));
        const currentScope = preferredBook ? 'book' : (['year', 'month', 'book'].includes(preferredScope) ? preferredScope : (prefs?.scope || 'year'));
        stage10PopulatePdfSelect(
            panel.querySelector('#icity-pdf-export-year'),
            stage10GetYearOptions(feeds).map(year => ({ value: year, label: year + '年' })),
            currentYear
        );
        stage10PopulatePdfSelect(
            panel.querySelector('#icity-pdf-export-month'),
            stage10GetMonthOptions(feeds).map(month => ({ value: month, label: stage10GetMonthLabel(month) })),
            currentMonth
        );
        stage10PopulatePdfSelect(
            panel.querySelector('#icity-pdf-export-book'),
            safeBooks.map(book => ({ value: book.id, label: stage10GetBookLabel(book) })),
            currentBookId
        );
        const cover = panel.querySelector('#icity-pdf-export-cover');
        const layout = panel.querySelector('#icity-pdf-export-layout');
        if (cover) cover.value = ICITY_PDF_EXPORT_COVER_PRESETS[prefs?.cover] ? prefs.cover : 'blue';
        if (layout) layout.value = ['classic', 'compact', 'gallery'].includes(prefs?.layout) ? prefs.layout : 'classic';
        const status = panel.querySelector('[data-icity-pdf-status]');
        if (status) status.textContent = '';
        stage10SetPdfScope(panel, currentScope);
        panel.classList.add('active');
    }

    async function stage10BuildPdfSource(panel) {
        const scope = panel.dataset.scope || 'year';
        const year = String(panel.querySelector('#icity-pdf-export-year')?.value || new Date().getFullYear());
        const month = String(panel.querySelector('#icity-pdf-export-month')?.value || getIcityMonthKey(Date.now()));
        const bookId = String(panel.querySelector('#icity-pdf-export-book')?.value || '');
        const books = Array.isArray(panel._stage10Books) ? panel._stage10Books : await getDiaries();
        let entries = [];
        let title = '';
        let subtitle = '';
        let book = null;
        if (scope === 'book') {
            book = (Array.isArray(books) ? books : []).find(item => String(item?.id || '') === bookId) || window.currentDiaryBook || null;
            if (!book) return null;
            entries = await getIcityDiaryBookEntries(book);
            title = String(book.name || '我的日记本').trim();
            subtitle = '日记本 · ' + entries.length + '篇';
        } else {
            const feeds = await stage10GetUserDiaryFeeds();
            entries = scope === 'month'
                ? feeds.filter(post => getIcityMonthKey(getIcityPostOccurredAt(post)) === month)
                : feeds.filter(post => getIcityAnnualYear(getIcityPostOccurredAt(post)) === Number(year));
            title = scope === 'month' ? stage10GetMonthLabel(month) + '日记' : year + '年日记';
            subtitle = 'Diary 日记集 · ' + entries.length + '篇';
        }
        entries = entries.sort((a, b) => getIcityPostOccurredAt(a) - getIcityPostOccurredAt(b));
        if (!entries.length) return { scope, year, month, book, entries, title, subtitle, empty: true };
        const monthlyRecords = scope === 'month' ? await getIcityMonthlyRecords() : [];
        const annualReports = scope === 'year' ? await getIcityAnnualReports() : [];
        const monthlyRecord = monthlyRecords.find(item => String(item?.monthKey || item?.month || '') === month);
        const annualReport = annualReports.find(item => Number(item?.year) === Number(year));
        const record = monthlyRecord || annualReport || null;
        const recordText = String(record?.summary || record?.content || record?.text || record?.report || '').trim();
        return {
            scope,
            year,
            month,
            book,
            entries,
            title,
            subtitle,
            preface: String(book?.intro || '').trim(),
            phaseSummary: String(book?.phaseSummary || '').trim(),
            recordText,
            record
        };
    }

    function stage10RenderPdfImages(post, layout) {
        const images = getIcityPostImages(post);
        if (!images.length) return '';
        const imageClass = layout === 'compact' ? ' compact' : (layout === 'gallery' ? ' gallery' : '');
        return '<div class="icity-pdf-images' + imageClass + '">' + images.map((src, index) => {
            if (src === ICITY_IMAGE_PLACEHOLDER_URL) {
                return '<div class="icity-pdf-image-placeholder">图片生成中 · ' + (index + 1) + '</div>';
            }
            return '<img src="' + escapeIcityHtml(src) + '" alt="日记图片 ' + (index + 1) + '">';
        }).join('') + '</div>';
    }

    function stage10RenderPdfNotes(post) {
        const notes = Array.isArray(post?.notes) ? post.notes.filter(note => String(note?.text || note?.content || '').trim()) : [];
        if (!notes.length) return '';
        return '<div class="icity-pdf-notes">' + notes.map(note => (
            '<div class="icity-pdf-note"><span>小纸条</span><p>' +
            escapeIcityHtml(String(note?.text || note?.content || '').trim()) +
            '</p></div>'
        )).join('') + '</div>';
    }

    function stage10RenderPdfEntry(post, layout, index) {
        const text = stage10GetPdfEntryText(post);
        const location = stage10GetPdfLocation(post);
        return '<article class="icity-pdf-entry">' +
            '<div class="icity-pdf-entry-meta"><span>' + String(index + 1).padStart(2, '0') + '</span><time>' +
                escapeIcityHtml(stage10FormatPdfDate(getIcityPostOccurredAt(post))) +
            '</time></div>' +
            '<h3>' + escapeIcityHtml(text ? text.slice(0, 54) : '日记记录') + '</h3>' +
            '<div class="icity-pdf-entry-byline">' + escapeIcityHtml(stage10GetPdfAuthor(post)) +
                (location ? ' · ' + escapeIcityHtml(location) : '') + '</div>' +
            (text ? '<p class="icity-pdf-entry-text">' + escapeIcityHtml(text) + '</p>' : '') +
            stage10RenderPdfImages(post, layout) +
            stage10RenderPdfNotes(post) +
        '</article>';
    }

    function stage10BuildPdfPrintHtml(source, options) {
        const cover = ICITY_PDF_EXPORT_COVER_PRESETS[options.cover] || ICITY_PDF_EXPORT_COVER_PRESETS.blue;
        const entries = Array.isArray(source.entries) ? source.entries : [];
        const firstDate = entries.length ? stage10FormatPdfDate(getIcityPostOccurredAt(entries[0]), false) : '';
        const lastDate = entries.length ? stage10FormatPdfDate(getIcityPostOccurredAt(entries[entries.length - 1]), false) : '';
        const range = firstDate && lastDate && firstDate !== lastDate ? firstDate + ' — ' + lastDate : (firstDate || lastDate);
        const preface = source.preface || source.recordText || ('这本日记集收录了 ' + entries.length + ' 篇记录。');
        const summary = source.phaseSummary || (source.scope === 'book' ? '' : '按时间整理的生活切片，留住当时的心情、地点和片段。');
        let lastMonth = '';
        let entryPages = '';
        entries.forEach((post, index) => {
            const monthKey = getIcityMonthKey(getIcityPostOccurredAt(post));
            if (monthKey !== lastMonth) {
                lastMonth = monthKey;
                entryPages += '<div class="icity-pdf-chapter"><span>CHAPTER</span><strong>' +
                    escapeIcityHtml(stage10GetMonthLabel(monthKey)) + '</strong></div>';
            }
            entryPages += stage10RenderPdfEntry(post, options.layout, index);
        });
        const safeTitle = escapeIcityHtml(source.title || '我的日记集');
        const safeSubtitle = escapeIcityHtml(source.subtitle || '');
        const html =
            '<!doctype html><html lang="zh-CN"><head><meta charset="utf-8"><title>' + safeTitle + '</title>' +
            '<style>' +
                '@page{size:A5;margin:12mm 13mm}' +
                '*{box-sizing:border-box}' +
                'html,body{margin:0;padding:0;background:#f6f1e9;color:#2f3540;font-family:-apple-system,BlinkMacSystemFont,"PingFang SC","Microsoft YaHei",sans-serif}' +
                'body{font-size:12px;line-height:1.75}' +
                '.icity-pdf-page{page-break-after:always;break-after:page}' +
                '.icity-pdf-cover{min-height:184mm;padding:26mm 13mm 18mm;border-radius:5mm;color:#fff;display:flex;flex-direction:column;justify-content:space-between;background:' + cover.background + ';box-shadow:0 5mm 12mm rgba(30,45,58,.15)}' +
                '.icity-pdf-kicker{font-size:10px;letter-spacing:.22em;opacity:.75}' +
                '.icity-pdf-cover h1{font-size:31px;line-height:1.18;margin:18mm 0 5mm;font-weight:700;letter-spacing:.03em}' +
                '.icity-pdf-cover p{margin:0;opacity:.86;font-size:12px}' +
                '.icity-pdf-cover-footer{font-size:10px;opacity:.72;display:flex;justify-content:space-between;gap:8mm}' +
                '.icity-pdf-preface{min-height:184mm;padding:14mm 5mm;page-break-after:always;break-after:page}' +
                '.icity-pdf-preface h2{font-size:22px;margin:0 0 8mm;color:#26384a}' +
                '.icity-pdf-preface p{white-space:pre-wrap;margin:0 0 8mm;font-size:13px}' +
                '.icity-pdf-stat{display:inline-flex;margin:0 3mm 3mm 0;padding:2mm 4mm;border-radius:999px;background:#e5edf2;color:#486172}' +
                '.icity-pdf-chapter{page-break-before:always;break-before:page;padding:23mm 5mm 10mm;color:#436b82}' +
                '.icity-pdf-chapter span{display:block;font-size:10px;letter-spacing:.2em;opacity:.7}' +
                '.icity-pdf-chapter strong{display:block;margin-top:4mm;font-size:25px}' +
                '.icity-pdf-entry{padding:0 5mm 10mm;margin:0 0 8mm;border-bottom:1px solid #dbe0e3;break-inside:avoid}' +
                '.icity-pdf-entry-meta{display:flex;align-items:center;gap:4mm;color:#78909c;font-size:10px}' +
                '.icity-pdf-entry-meta span{width:8mm;height:8mm;display:inline-flex;align-items:center;justify-content:center;border-radius:50%;background:#dae8ee;color:#466879}' +
                '.icity-pdf-entry h3{font-size:17px;line-height:1.35;margin:4mm 0 1mm;color:#2d4455}' +
                '.icity-pdf-entry-byline{font-size:10px;color:#8899a2}' +
                '.icity-pdf-entry-text{white-space:pre-wrap;font-size:12px;margin:5mm 0;color:#3e4a53}' +
                '.icity-pdf-images{display:grid;grid-template-columns:1fr;gap:3mm;margin-top:5mm}' +
                '.icity-pdf-images.compact{grid-template-columns:repeat(2,minmax(0,1fr))}' +
                '.icity-pdf-images.gallery{grid-template-columns:repeat(2,minmax(0,1fr));gap:2mm}' +
                '.icity-pdf-images img{display:block;width:100%;max-height:92mm;object-fit:cover;border-radius:2mm;break-inside:avoid}' +
                '.icity-pdf-images.gallery img{max-height:58mm}' +
                '.icity-pdf-image-placeholder{min-height:28mm;display:flex;align-items:center;justify-content:center;border:1px dashed #b6c3c8;border-radius:2mm;color:#87949b;background:#f0f4f5}' +
                '.icity-pdf-notes{margin-top:5mm;padding:3mm 4mm;border-left:2px solid #d9aa68;background:#fbf4e9;break-inside:avoid}' +
                '.icity-pdf-note{display:flex;gap:3mm;margin:1mm 0}.icity-pdf-note span{flex:none;color:#a16b2f;font-size:10px}.icity-pdf-note p{margin:0;white-space:pre-wrap}' +
                '.icity-pdf-empty{padding:30mm 5mm;text-align:center;color:#83919a}' +
                '@media print{html,body{background:#fff}.icity-pdf-cover{box-shadow:none}.icity-pdf-entry{border-color:#dfe4e6}}' +
            '</style></head><body>' +
                '<section class="icity-pdf-page icity-pdf-cover">' +
                    '<div><div class="icity-pdf-kicker">ICITY · DIARY ARCHIVE</div><h1>' + safeTitle + '</h1><p>' + safeSubtitle + '</p></div>' +
                    '<div class="icity-pdf-cover-footer"><span>' + escapeIcityHtml(range) + '</span><span>' + entries.length + ' 篇记录</span></div>' +
                '</section>' +
                '<section class="icity-pdf-preface"><h2>写在前面</h2><p>' + escapeIcityHtml(preface) + '</p>' +
                    (summary ? '<p>' + escapeIcityHtml(summary) + '</p>' : '') +
                    '<div><span class="icity-pdf-stat">' + entries.length + ' 篇日记</span>' +
                    (range ? '<span class="icity-pdf-stat">' + escapeIcityHtml(range) + '</span>' : '') + '</div></section>' +
                (entries.length ? entryPages : '<section class="icity-pdf-empty">这个范围内还没有可导出的日记。</section>') +
            '</body></html>';
        return html;
    }

    async function stage10PrintPdf(source, options, panel) {
        const iframe = document.createElement('iframe');
        iframe.setAttribute('aria-hidden', 'true');
        iframe.className = 'icity-pdf-print-frame';
        iframe.style.cssText = 'position:fixed;right:0;bottom:0;width:1px;height:1px;border:0;opacity:0;pointer-events:none;';
        document.body.appendChild(iframe);
        const printDocument = iframe.contentDocument;
        printDocument.open();
        printDocument.write(stage10BuildPdfPrintHtml(source, options));
        printDocument.close();
        const images = Array.from(printDocument.images || []);
        await Promise.all(images.map(image => image.complete ? Promise.resolve() : new Promise(resolve => {
            image.addEventListener('load', resolve, { once: true });
            image.addEventListener('error', resolve, { once: true });
        })));
        const cleanup = () => {
            if (iframe.parentNode) iframe.parentNode.removeChild(iframe);
        };
        if (iframe.contentWindow) {
            iframe.contentWindow.addEventListener('afterprint', cleanup, { once: true });
            iframe.contentWindow.focus();
            window.setTimeout(() => {
                try {
                    iframe.contentWindow.print();
                } catch (error) {
                    console.error('Failed to open browser print dialog', error);
                    stage10ShowPdfToast('浏览器打印面板未能打开');
                }
            }, 250);
        }
        window.setTimeout(cleanup, 120000);
        if (panel) panel.classList.remove('active');
    }

    async function stage10ExportPdfFromPanel(panel) {
        const status = panel.querySelector('[data-icity-pdf-status]');
        if (status) status.textContent = '正在整理日记和图片…';
        const source = await stage10BuildPdfSource(panel);
        if (!source || source.empty) {
            if (status) status.textContent = '当前范围没有可导出的日记。';
            stage10ShowPdfToast('当前范围没有可导出的日记');
            return;
        }
        const options = {
            cover: panel.querySelector('#icity-pdf-export-cover')?.value || 'blue',
            layout: panel.querySelector('#icity-pdf-export-layout')?.value || 'classic'
        };
        await saveIcityPdfExportPrefs({
            scope: panel.dataset.scope || 'year',
            year: panel.querySelector('#icity-pdf-export-year')?.value || '',
            month: panel.querySelector('#icity-pdf-export-month')?.value || '',
            bookId: panel.querySelector('#icity-pdf-export-book')?.value || '',
            cover: options.cover,
            layout: options.layout
        });
        if (status) status.textContent = '正在打开打印面板…';
        await stage10PrintPdf(source, options, panel);
    }

    function stage10EnsureCalendarPdfButton() {
        const placeholder = viewCalendar?.querySelector('.right-placeholder');
        if (!placeholder) return;
        let actions = placeholder.querySelector('.icity-calendar-export-actions');
        if (!actions) {
            actions = document.createElement('div');
            actions.className = 'icity-calendar-export-actions';
            placeholder.appendChild(actions);
        }
        if ($('#btn-icity-pdf-export-calendar')) return;
        const button = document.createElement('button');
        button.type = 'button';
        button.id = 'btn-icity-pdf-export-calendar';
        button.className = 'icity-calendar-icon-btn';
        button.title = '导出 PDF';
        button.setAttribute('aria-label', '导出 PDF');
        button.innerHTML = '<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M6 9V2h12v7"></path><path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"></path><rect x="6" y="14" width="12" height="8"></rect></svg>';
        bindIcityTap(button, () => stage10OpenPdfExportPanel('year'));
        actions.prepend(button);
    }

    function stage10EnsureDiaryBookPdfButton() {
        if (typeof ensureIcityDiaryBookControls === 'function') ensureIcityDiaryBookControls();
        const actions = $('#icity-diary-book-ai-actions');
        if (!actions || $('#btn-icity-pdf-export-book')) return;
        const button = document.createElement('button');
        button.type = 'button';
        button.id = 'btn-icity-pdf-export-book';
        button.className = 'icity-diary-book-ai-btn icity-pdf-book-export-button';
        button.textContent = '导出 PDF';
        bindIcityTap(button, () => stage10OpenPdfExportPanel('book', window.currentDiaryBook || null));
        actions.appendChild(button);
    }

    const stage10OriginalOpenDiaryDetail = window.openDiaryDetail;
    if (typeof stage10OriginalOpenDiaryDetail === 'function') {
        window.openDiaryDetail = function stage10OpenDiaryDetailWithPdf() {
            const result = stage10OriginalOpenDiaryDetail.apply(this, arguments);
            window.setTimeout(stage10EnsureDiaryBookPdfButton, 0);
            return result;
        };
    }

    window.openIcityPdfExportPanel = stage10OpenPdfExportPanel;
    stage10EnsureCalendarPdfButton();
    window.setTimeout(stage10EnsureDiaryBookPdfButton, 0);


    // ================= Stage 11: Diary video export =================
    const ICITY_VIDEO_EXPORT_PREFS_KEY = 'icity_video_export_preferences';
    const ICITY_VIDEO_EXPORT_TEMPLATES = {
        cinematic: {
            label: '夜航电影',
            background: ['#101821', '#263b4b'],
            foreground: '#F7FBFD',
            muted: '#B6CBD5',
            accent: '#84C6D6',
            panel: 'rgba(255,255,255,.12)'
        },
        paper: {
            label: '纸张日记',
            background: ['#F0E6D4', '#B88463'],
            foreground: '#2D2730',
            muted: '#6A5A58',
            accent: '#A45E42',
            panel: 'rgba(255,255,255,.66)'
        },
        dawn: {
            label: '清晨留白',
            background: ['#E8F1F2', '#A7C1C5'],
            foreground: '#243C45',
            muted: '#5E747A',
            accent: '#4C8B98',
            panel: 'rgba(255,255,255,.58)'
        }
    };

    function getIcityVideoExportPrefs() {
        return getIcityData(ICITY_VIDEO_EXPORT_PREFS_KEY, {}).catch(() => ({}));
    }

    async function saveIcityVideoExportPrefs(prefs) {
        await saveIcityData(ICITY_VIDEO_EXPORT_PREFS_KEY, {
            scope: String(prefs?.scope || 'range'),
            entryId: String(prefs?.entryId || ''),
            bookId: String(prefs?.bookId || ''),
            startDate: String(prefs?.startDate || ''),
            endDate: String(prefs?.endDate || ''),
            template: String(prefs?.template || 'cinematic'),
            subtitle: String(prefs?.subtitle || 'film'),
            duration: Number(prefs?.duration || 4)
        });
    }

    function stage11VideoToast(message) {
        if (typeof window.showToast === 'function') window.showToast(message);
        else console.warn(message);
    }

    function stage11VideoDateLabel(timestamp, withWeekday = true) {
        const date = getIcityDateObject(getIcityPostOccurredAt({ occurredAt: timestamp }));
        if (Number.isNaN(date.getTime())) return '未记录日期';
        return date.toLocaleDateString('zh-CN', withWeekday
            ? { year: 'numeric', month: 'long', day: 'numeric', weekday: 'short' }
            : { year: 'numeric', month: 'long', day: 'numeric' });
    }

    function stage11VideoDateInput(timestamp) {
        return getIcityDateKey(getIcityPostOccurredAt({ occurredAt: timestamp }));
    }

    function stage11VideoEntryText(entry) {
        return String(entry?.text || entry?.content || entry?.body || '').trim();
    }

    function stage11VideoEntryAuthor(entry) {
        return String(entry?.authorName || entry?.author || entry?.wxName || entry?.nickname || '我').trim() || '我';
    }

    function stage11VideoEntryLocation(entry) {
        return String(entry?.location || entry?.place || entry?.city || '').trim();
    }

    function stage11VideoEntryLabel(entry) {
        const text = stage11VideoEntryText(entry).replace(/\s+/g, ' ');
        const preview = text ? text.slice(0, 30) + (text.length > 30 ? '…' : '') : '无正文日记';
        return stage11VideoDateLabel(getIcityPostOccurredAt(entry), false) + ' · ' + preview;
    }

    function stage11VideoStatus(panel, message, progress = null) {
        const status = panel?.querySelector('[data-icity-video-status]');
        if (status) status.textContent = message || '';
        const progressBar = panel?.querySelector('[data-icity-video-progress]');
        if (progressBar && progress !== null) {
            progressBar.style.width = Math.max(0, Math.min(100, Number(progress))) + '%';
        }
    }

    function stage11PopulateVideoSelect(select, options, selectedValue) {
        if (!select) return;
        select.innerHTML = options.map(option => (
            '<option value="' + escapeIcityHtml(String(option.value)) + '">' +
            escapeIcityHtml(String(option.label)) +
            '</option>'
        )).join('');
        if (selectedValue !== undefined && selectedValue !== null && Array.from(select.options).some(option => option.value === String(selectedValue))) {
            select.value = String(selectedValue);
        } else if (select.options.length) {
            select.selectedIndex = 0;
        }
    }

    function stage11SetVideoScope(panel, scope) {
        const nextScope = ['single', 'range', 'book'].includes(scope) ? scope : 'range';
        panel.dataset.scope = nextScope;
        panel.querySelectorAll('[data-icity-video-scope]').forEach(button => {
            button.classList.toggle('active', button.dataset.icityVideoScope === nextScope);
            button.setAttribute('aria-selected', button.dataset.icityVideoScope === nextScope ? 'true' : 'false');
        });
        panel.querySelectorAll('[data-icity-video-field]').forEach(field => {
            field.hidden = field.dataset.icityVideoField !== nextScope;
        });
    }

    function stage11EnsureVideoPanel() {
        let panel = $('#icity-video-export-panel');
        if (panel) return panel;
        panel = document.createElement('div');
        panel.id = 'icity-video-export-panel';
        panel.className = 'modal-overlay icity-video-export-panel';
        panel.innerHTML =
            '<div class="icity-video-export-modal" role="dialog" aria-modal="true" aria-labelledby="icity-video-export-title">' +
                '<div class="icity-modal-custom-header">' +
                    '<div class="back-btn icity-video-export-close" style="cursor: pointer; display: flex; align-items: center; color: var(--text-sub);">' +
                        '<svg viewBox="0 0 24 24" width="22" height="22" stroke="currentColor" stroke-width="2" fill="none"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>' +
                    '</div>' +
                    '<div class="modal-title" id="icity-video-export-title">制作日记影片</div>' +
                    '<div style="width: 28px;"></div>' +
                '</div>' +
                '<div class="icity-modal-custom-body">' +
                    '<div class="card-box" style="margin: 0 0 10px 0; padding: 12px 14px; background: #FFFFFF;">' +
                        '<div style="font-size: 12px; color: var(--text-light); line-height: 1.4; margin-bottom: 10px;">日记影片在本地引擎渲染生成，适合分享或存入相册留念。</div>' +
                        '<div class="segmented-control" style="width: 100%; display: flex; box-sizing: border-box;" role="tablist" aria-label="影片内容范围">' +
                            '<div class="segment-btn" data-icity-video-scope="single" role="tab" style="flex: 1;">单篇</div>' +
                            '<div class="segment-btn active" data-icity-video-scope="range" role="tab" style="flex: 1;">日期范围</div>' +
                            '<div class="segment-btn" data-icity-video-scope="book" role="tab" style="flex: 1;">日记本</div>' +
                        '</div>' +
                    '</div>' +
                    '<div class="card-box icity-video-export-fields" style="margin: 0 0 10px 0; padding: 6px 14px; background: #FFFFFF;">' +
                        '<div class="icity-export-setting-row" data-icity-video-field="single"><span class="setting-row-label">目标日记</span><select class="setting-row-select" id="icity-video-export-entry"></select></div>' +
                        '<div class="icity-export-setting-row" data-icity-video-field="range"><span class="setting-row-label">开始日期</span><input class="setting-row-select" id="icity-video-export-start" type="date"></div>' +
                        '<div class="icity-export-setting-row" data-icity-video-field="range"><span class="setting-row-label">结束日期</span><input class="setting-row-select" id="icity-video-export-end" type="date"></div>' +
                        '<div class="icity-export-setting-row" data-icity-video-field="book"><span class="setting-row-label">所属日记本</span><select class="setting-row-select" id="icity-video-export-book"></select></div>' +
                        '<div class="icity-export-setting-row"><span class="setting-row-label">影片滤镜</span><select class="setting-row-select" id="icity-video-export-template">' +
                            '<option value="cinematic">夜航电影 (Cinematic)</option><option value="paper">纸张日记 (Paper)</option><option value="dawn">清晨留白 (Dawn)</option>' +
                        '</select></div>' +
                        '<div class="icity-export-setting-row"><span class="setting-row-label">字幕样式</span><select class="setting-row-select" id="icity-video-export-subtitle">' +
                            '<option value="film">电影底栏</option><option value="paper">纸张卡片</option><option value="none">不显示底栏</option>' +
                        '</select></div>' +
                        '<div class="icity-export-setting-row" style="border-bottom: none;"><span class="setting-row-label">每页停留</span><select class="setting-row-select" id="icity-video-export-duration">' +
                            '<option value="3">3 秒</option><option value="4">4 秒 (推荐)</option><option value="6">6 秒</option><option value="8">8 秒</option>' +
                        '</select></div>' +
                    '</div>' +
                    '<div class="card-box icity-video-preview-wrap" style="margin: 0 0 10px 0; padding: 12px; background: #FFFFFF; display: flex; justify-content: center;">' +
                        '<canvas id="icity-video-preview-canvas" width="360" height="640" style="max-height: 180px; border-radius: 8px; border: 1px solid var(--border-color);"></canvas>' +
                    '</div>' +
                    '<div class="icity-video-progress" style="margin: 0 4px 6px; height: 4px; background: #E5E5EA; border-radius: 2px; overflow: hidden;"><span data-icity-video-progress style="display: block; height: 100%; width: 0; background: #34C759; transition: width 0.2s;"></span></div>' +
                    '<div class="icity-video-export-status" data-icity-video-status aria-live="polite" style="font-size: 12px; color: var(--theme-blue); padding: 0 4px 6px; min-height: 18px; text-align: center;"></div>' +
                '</div>' +
                '<div class="icity-modal-custom-footer">' +
                    '<button type="button" class="create-diary-bottom-btn icity-video-export-submit" style="width: 100%; height: 46px; border-radius: 23px; background: #25C85A; color: #FFFFFF; font-size: 16px; font-weight: 700; border: none; cursor: pointer; display: flex; align-items: center; justify-content: center; gap: 6px; box-shadow: 0 4px 14px rgba(37,200,90,0.3);">' +
                        '<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="23 7 16 12 23 17 23 7"></polygon><rect x="1" y="5" width="15" height="14" rx="2" ry="2"></rect></svg>' +
                        '生成并导出影片' +
                    '</button>' +
                '</div>' +
            '</div>';
        const host = document.querySelector('#icityNewAppUI .icity-app-inner-container') || document.getElementById('icityNewAppUI') || document.body;
        host.appendChild(panel);
        panel.querySelectorAll('[data-icity-video-scope]').forEach(button => {
            button.addEventListener('click', () => stage11SetVideoScope(panel, button.dataset.icityVideoScope));
        });
        const closePanel = () => {
            if (!panel.dataset.generating) panel.classList.remove('active');
        };
        panel.querySelector('.icity-video-export-close')?.addEventListener('click', closePanel);
        panel.querySelector('.back-btn')?.addEventListener('click', closePanel);
        panel.addEventListener('click', event => {
            if (event.target === panel) closePanel();
        });
        const submitBtn = panel.querySelector('.icity-video-export-submit');
        if (submitBtn) {
            bindIcityTap(submitBtn, () => {
                stage11ExportVideoFromPanel(panel).catch(error => {
                    console.error('Failed to export diary video', error);
                    stage11VideoStatus(panel, '影片生成失败，请稍后重试。');
                    stage11VideoToast('影片生成失败，请稍后重试');
                });
            });
        }
        stage11SetVideoScope(panel, 'range');
        return panel;
    }

    async function stage11OpenVideoExportPanel(preferredScope = 'range', preferredBook = null) {
        const profile = await getProfile();
        if (!isIcityProUser(profile)) {
            if (typeof window.showToast === 'function') window.showToast('本地渲染生成日记纪录影片 (MP4) 为 Diary Pro 荣誉市民专享');
            openVipCenterView();
            return;
        }
        const panel = stage11EnsureVideoPanel();
        const [prefs, feeds, books] = await Promise.all([
            getIcityVideoExportPrefs(),
            stage10GetUserDiaryFeeds(),
            getDiaries()
        ]);
        const entries = (Array.isArray(feeds) ? feeds : [])
            .filter(Boolean)
            .sort((a, b) => getIcityPostOccurredAt(b) - getIcityPostOccurredAt(a));
        const safeBooks = (Array.isArray(books) ? books : []).filter(Boolean).sort((a, b) => {
            const pinDiff = Number(Boolean(b?.pinned)) - Number(Boolean(a?.pinned));
            return pinDiff || String(a?.name || '').localeCompare(String(b?.name || ''), 'zh-CN');
        });
        panel._stage11Entries = entries;
        panel._stage11Books = safeBooks;
        const latestEntry = entries[0];
        const earliestEntry = entries[entries.length - 1];
        const startDate = String(prefs?.startDate || stage11VideoDateInput(earliestEntry || { occurredAt: Date.now() }));
        const endDate = String(prefs?.endDate || stage11VideoDateInput(latestEntry || { occurredAt: Date.now() }));
        const selectedEntryId = String(prefs?.entryId || latestEntry?.id || '');
        const selectedBookId = String(preferredBook?.id || prefs?.bookId || safeBooks[0]?.id || '');
        const currentScope = preferredBook
            ? 'book'
            : (['single', 'range', 'book'].includes(preferredScope) ? preferredScope : (prefs?.scope || 'range'));
        stage11PopulateVideoSelect(
            panel.querySelector('#icity-video-export-entry'),
            entries.map(entry => ({ value: entry.id, label: stage11VideoEntryLabel(entry) })),
            selectedEntryId
        );
        stage11PopulateVideoSelect(
            panel.querySelector('#icity-video-export-book'),
            safeBooks.map(book => ({ value: book.id, label: String(book.name || '未命名日记本').trim() })),
            selectedBookId
        );
        const start = panel.querySelector('#icity-video-export-start');
        const end = panel.querySelector('#icity-video-export-end');
        if (start) start.value = startDate;
        if (end) end.value = endDate;
        const template = panel.querySelector('#icity-video-export-template');
        const subtitle = panel.querySelector('#icity-video-export-subtitle');
        const duration = panel.querySelector('#icity-video-export-duration');
        if (template) template.value = ICITY_VIDEO_EXPORT_TEMPLATES[prefs?.template] ? prefs.template : 'cinematic';
        if (subtitle) subtitle.value = ['film', 'paper', 'none'].includes(prefs?.subtitle) ? prefs.subtitle : 'film';
        if (duration) duration.value = ['3', '4', '6', '8'].includes(String(prefs?.duration)) ? String(prefs.duration) : '4';
        const videoMimeType = stage11VideoMimeType();
        const submitButton = panel.querySelector('.icity-video-export-submit');
        if (submitButton) {
            submitButton.disabled = !videoMimeType;
            submitButton.title = videoMimeType ? '' : '当前设备不支持 MP4/WebM 视频编码';
        }
        stage11VideoStatus(panel, videoMimeType ? '' : '当前设备不支持本地影片导出。');
        const preview = panel.querySelector('#icity-video-preview-canvas');
        if (preview) {
            const previewContext = preview.getContext('2d');
            previewContext.clearRect(0, 0, preview.width, preview.height);
        }
        stage11SetVideoScope(panel, currentScope);
        panel.classList.add('active');
    }

    async function stage11BuildVideoSource(panel) {
        const scope = panel.dataset.scope || 'range';
        const allEntries = Array.isArray(panel._stage11Entries) ? panel._stage11Entries : await stage10GetUserDiaryFeeds();
        const books = Array.isArray(panel._stage11Books) ? panel._stage11Books : await getDiaries();
        let entries = [];
        let title = '我的日记影片';
        let subtitle = '';
        let book = null;
        if (scope === 'single') {
            const entryId = String(panel.querySelector('#icity-video-export-entry')?.value || '');
            const entry = allEntries.find(item => String(item?.id) === entryId) || allEntries[0];
            if (entry) entries = [entry];
            title = '一篇日记';
            subtitle = entry ? stage11VideoDateLabel(getIcityPostOccurredAt(entry), false) : '';
        } else if (scope === 'book') {
            const bookId = String(panel.querySelector('#icity-video-export-book')?.value || '');
            book = (Array.isArray(books) ? books : []).find(item => String(item?.id || '') === bookId) || window.currentDiaryBook || null;
            if (book) entries = await getIcityDiaryBookEntries(book);
            title = String(book?.name || '我的日记本').trim();
            subtitle = book ? '日记本 · ' + entries.length + '篇' : '';
        } else {
            const startValue = String(panel.querySelector('#icity-video-export-start')?.value || '');
            const endValue = String(panel.querySelector('#icity-video-export-end')?.value || '');
            const startDate = startValue && endValue && startValue > endValue ? endValue : startValue;
            const endDate = startValue && endValue && startValue > endValue ? startValue : endValue;
            entries = allEntries.filter(entry => {
                const dateKey = stage11VideoDateInput(entry);
                return (!startDate || dateKey >= startDate) && (!endDate || dateKey <= endDate);
            });
            title = startDate && endDate && startDate === endDate
                ? stage11VideoDateLabel(new Date(startDate + 'T12:00:00').getTime(), false) + '日记'
                : '日期范围日记';
            subtitle = startDate && endDate ? startDate + ' — ' + endDate : '';
        }
        entries = entries.filter(Boolean).sort((a, b) => getIcityPostOccurredAt(a) - getIcityPostOccurredAt(b));
        if (!entries.length) return { scope, title, subtitle, book, entries, empty: true };
        const firstDate = stage11VideoDateLabel(getIcityPostOccurredAt(entries[0]), false);
        const lastDate = stage11VideoDateLabel(getIcityPostOccurredAt(entries[entries.length - 1]), false);
        const range = firstDate === lastDate ? firstDate : firstDate + ' — ' + lastDate;
        return {
            scope,
            title,
            subtitle,
            book,
            entries,
            range,
            preface: String(book?.intro || '').trim()
        };
    }

    function stage11LoadVideoImage(src) {
        const value = String(src || '').trim();
        if (!value || value === ICITY_IMAGE_PLACEHOLDER_URL) return Promise.resolve(null);
        return new Promise(resolve => {
            const image = new Image();
            let settled = false;
            const finish = result => {
                if (settled) return;
                settled = true;
                resolve(result);
            };
            image.onload = () => finish(image);
            image.onerror = () => finish(null);
            if (/^https?:\/\//i.test(value)) image.crossOrigin = 'anonymous';
            image.src = value;
            window.setTimeout(() => finish(null), 12000);
        });
    }

    async function stage11PrepareVideoFrames(source, options, panel) {
        const frames = [
            { kind: 'title', duration: 2600 }
        ];
        const totalEntries = source.entries.length;
        for (let entryIndex = 0; entryIndex < totalEntries; entryIndex += 1) {
            const entry = source.entries[entryIndex];
            const imageSources = getIcityPostImages(entry);
            const loadedImages = await Promise.all(imageSources.map(src => stage11LoadVideoImage(src)));
            const usableImages = loadedImages.filter(Boolean);
            if (!usableImages.length) {
                frames.push({ kind: 'entry', entry, entryIndex, image: null, imageIndex: 0, imageCount: 0, duration: options.duration * 1000 });
            } else {
                usableImages.forEach((image, imageIndex) => {
                    frames.push({
                        kind: 'entry',
                        entry,
                        entryIndex,
                        image,
                        imageIndex,
                        imageCount: usableImages.length,
                        duration: options.duration * 1000
                    });
                });
            }
            stage11VideoStatus(panel, '正在读取图片 ' + (entryIndex + 1) + '/' + totalEntries + '…', 8 + (entryIndex / Math.max(1, totalEntries)) * 28);
        }
        frames.push({ kind: 'outro', duration: 2300 });
        return frames;
    }

    function stage11RoundRectPath(context, x, y, width, height, radius) {
        const r = Math.min(radius, width / 2, height / 2);
        context.beginPath();
        context.moveTo(x + r, y);
        context.arcTo(x + width, y, x + width, y + height, r);
        context.arcTo(x + width, y + height, x, y + height, r);
        context.arcTo(x, y + height, x, y, r);
        context.arcTo(x, y, x + width, y, r);
        context.closePath();
    }

    function stage11DrawWrappedText(context, text, x, y, maxWidth, lineHeight, maxLines) {
        const value = String(text || '').trim();
        if (!value) return 0;
        const paragraphs = value.split(/\n+/);
        const lines = [];
        paragraphs.forEach(paragraph => {
            let line = '';
            Array.from(paragraph).forEach(character => {
                const nextLine = line + character;
                if (context.measureText(nextLine).width > maxWidth && line) {
                    lines.push(line);
                    line = character;
                } else {
                    line = nextLine;
                }
            });
            if (line) lines.push(line);
        });
        const visibleLines = lines.slice(0, maxLines || lines.length);
        visibleLines.forEach((line, index) => context.fillText(line, x, y + index * lineHeight));
        return visibleLines.length;
    }

    function stage11DrawVideoImage(context, image, x, y, width, height, radius) {
        if (!image) return;
        const ratio = Math.min(width / image.width, height / image.height);
        const drawWidth = image.width * ratio;
        const drawHeight = image.height * ratio;
        const drawX = x + (width - drawWidth) / 2;
        const drawY = y + (height - drawHeight) / 2;
        context.save();
        stage11RoundRectPath(context, x, y, width, height, radius);
        context.clip();
        context.fillStyle = 'rgba(255,255,255,.16)';
        context.fillRect(x, y, width, height);
        context.drawImage(image, drawX, drawY, drawWidth, drawHeight);
        context.restore();
    }

    function stage11DrawVideoFrame(context, frame, source, options) {
        const theme = ICITY_VIDEO_EXPORT_TEMPLATES[options.template] || ICITY_VIDEO_EXPORT_TEMPLATES.cinematic;
        const width = context.canvas.width;
        const height = context.canvas.height;
        const gradient = context.createLinearGradient(0, 0, width, height);
        gradient.addColorStop(0, theme.background[0]);
        gradient.addColorStop(1, theme.background[1]);
        context.fillStyle = gradient;
        context.fillRect(0, 0, width, height);
        context.fillStyle = theme.panel;
        context.beginPath();
        context.arc(width * .86, height * .13, width * .32, 0, Math.PI * 2);
        context.fill();
        context.beginPath();
        context.arc(width * .1, height * .84, width * .25, 0, Math.PI * 2);
        context.fill();

        if (frame.kind === 'title') {
            context.fillStyle = theme.accent;
            context.font = '700 24px sans-serif';
            context.fillText('ICITY · DIARY FILM', 66, 132);
            context.fillStyle = theme.foreground;
            context.font = '700 64px sans-serif';
            stage11DrawWrappedText(context, source.title || '我的日记影片', 66, 270, width - 132, 78, 3);
            context.fillStyle = theme.muted;
            context.font = '24px sans-serif';
            stage11DrawWrappedText(context, source.subtitle || source.range || '每一天都值得被记住', 66, 530, width - 132, 38, 3);
            context.fillStyle = theme.foreground;
            context.font = '500 22px sans-serif';
            context.fillText(source.entries.length + ' 篇日记', 66, height - 168);
            context.fillStyle = theme.muted;
            context.font = '20px sans-serif';
            context.fillText(source.range || 'Diary · 我的日记', 66, height - 122);
            return;
        }

        if (frame.kind === 'outro') {
            context.fillStyle = theme.accent;
            context.font = '700 24px sans-serif';
            context.fillText('THE END', 66, 150);
            context.fillStyle = theme.foreground;
            context.font = '700 52px sans-serif';
            stage11DrawWrappedText(context, '把日子留在这里', 66, 290, width - 132, 70, 2);
            context.fillStyle = theme.muted;
            context.font = '24px sans-serif';
            context.fillText('Diary · 每一天的生活刻度', 66, height - 130);
            return;
        }

        const entry = frame.entry;
        const text = stage11VideoEntryText(entry);
        const location = stage11VideoEntryLocation(entry);
        const dateLabel = stage11VideoDateLabel(getIcityPostOccurredAt(entry));
        const imageBoxX = 54;
        const imageBoxY = 120;
        const imageBoxWidth = width - 108;
        const imageBoxHeight = 430;
        context.fillStyle = theme.accent;
        context.font = '700 20px sans-serif';
        context.fillText(String(frame.entryIndex + 1).padStart(2, '0'), 58, 66);
        context.fillStyle = theme.muted;
        context.font = '20px sans-serif';
        context.fillText(dateLabel, 112, 66);
        if (frame.image) {
            context.fillStyle = 'rgba(0,0,0,.14)';
            stage11RoundRectPath(context, imageBoxX + 8, imageBoxY + 10, imageBoxWidth, imageBoxHeight, 22);
            context.fill();
            context.fillStyle = theme.panel;
            stage11RoundRectPath(context, imageBoxX, imageBoxY, imageBoxWidth, imageBoxHeight, 22);
            context.fill();
            stage11DrawVideoImage(context, frame.image, imageBoxX, imageBoxY, imageBoxWidth, imageBoxHeight, 22);
        } else {
            context.fillStyle = theme.panel;
            stage11RoundRectPath(context, imageBoxX, imageBoxY, imageBoxWidth, imageBoxHeight, 22);
            context.fill();
            context.fillStyle = theme.muted;
            context.font = '24px sans-serif';
            context.fillText('这一页没有可渲染图片', imageBoxX + 42, imageBoxY + imageBoxHeight / 2);
        }
        const textTop = frame.image ? 620 : 200;
        context.fillStyle = theme.foreground;
        context.font = '700 30px sans-serif';
        stage11DrawWrappedText(context, text ? text.slice(0, 80) : '日记记录', 58, textTop, width - 116, 42, 2);
        context.fillStyle = theme.muted;
        context.font = '20px sans-serif';
        context.fillText(stage11VideoEntryAuthor(entry) + (location ? ' · ' + location : ''), 58, textTop + 104);
        context.fillStyle = theme.foreground;
        context.font = '22px sans-serif';
        stage11DrawWrappedText(context, text, 58, textTop + 158, width - 116, 34, frame.image ? 5 : 12);
        const notes = Array.isArray(entry?.notes)
            ? entry.notes.map(note => String(note?.text || note?.content || '').trim()).filter(Boolean)
            : [];
        if (notes.length && frame.imageIndex === 0) {
            const noteText = '小纸条 · ' + notes.join(' / ').slice(0, 90);
            context.fillStyle = theme.panel;
            stage11RoundRectPath(context, 58, height - 180, width - 116, 82, 16);
            context.fill();
            context.fillStyle = theme.accent;
            context.font = '18px sans-serif';
            stage11DrawWrappedText(context, noteText, 80, height - 130, width - 160, 28, 2);
        }
        if (options.subtitle !== 'none') {
            const label = options.subtitle === 'paper' ? dateLabel + ' · ' + stage11VideoEntryAuthor(entry) : 'Diary · ' + dateLabel;
            context.fillStyle = options.subtitle === 'paper' ? 'rgba(255,255,255,.72)' : 'rgba(0,0,0,.26)';
            stage11RoundRectPath(context, 54, height - 66, width - 108, 40, 20);
            context.fill();
            context.fillStyle = options.subtitle === 'paper' ? theme.foreground : '#FFFFFF';
            context.font = '16px sans-serif';
            context.fillText(label.slice(0, 58), 76, height - 40);
        }
    }

    function stage11AnimationFrame() {
        return new Promise(resolve => window.requestAnimationFrame(resolve));
    }

    async function stage11HoldVideoFrame(context, frame, previousFrame, source, options, duration, progressCallback) {
        const transitionDuration = previousFrame ? 360 : 0;
        const start = performance.now();
        let currentTime = 0;
        while (currentTime < duration) {
            const elapsed = performance.now() - start;
            currentTime = Math.min(duration, elapsed);
            const transitionProgress = transitionDuration ? Math.min(1, currentTime / transitionDuration) : 1;
            context.clearRect(0, 0, context.canvas.width, context.canvas.height);
            if (previousFrame && transitionProgress < 1) {
                context.save();
                context.globalAlpha = 1 - transitionProgress;
                stage11DrawVideoFrame(context, previousFrame, source, options);
                context.restore();
            }
            context.save();
            context.globalAlpha = transitionProgress;
            stage11DrawVideoFrame(context, frame, source, options);
            context.restore();
            if (progressCallback) progressCallback(currentTime / Math.max(1, duration));
            await stage11AnimationFrame();
        }
    }

    function stage11VideoMimeType() {
        if (!window.MediaRecorder || typeof MediaRecorder.isTypeSupported !== 'function') return '';
        const candidates = [
            'video/mp4;codecs=avc1.42E01E,mp4a.40.2',
            'video/mp4;codecs=avc1.4D401E,mp4a.40.2',
            'video/mp4',
            'video/webm;codecs=vp9',
            'video/webm;codecs=vp8',
            'video/webm'
        ];
        return candidates.find(type => MediaRecorder.isTypeSupported(type)) || '';
    }

    async function stage11RenderVideo(source, options, panel) {
        if (!window.MediaRecorder || typeof HTMLCanvasElement === 'undefined' || !HTMLCanvasElement.prototype.captureStream) {
            throw new Error('当前浏览器不支持本地影片生成');
        }
        const mimeType = stage11VideoMimeType();
        if (!mimeType) throw new Error('当前浏览器不支持 MP4/WebM 编码');
        const canvas = panel.querySelector('#icity-video-preview-canvas');
        if (!canvas) throw new Error('找不到影片画布');
        canvas.width = 720;
        canvas.height = 1280;
        const context = canvas.getContext('2d');
        if (!context) throw new Error('当前浏览器无法创建影片画布');
        stage11VideoStatus(panel, '正在准备影片画面…', 2);
        const frames = await stage11PrepareVideoFrames(source, options, panel);
        const stream = canvas.captureStream(24);
        const chunks = [];
        const recorder = new MediaRecorder(stream, { mimeType });
        const stopped = new Promise((resolve, reject) => {
            recorder.ondataavailable = event => {
                if (event.data && event.data.size) chunks.push(event.data);
            };
            recorder.onerror = event => reject(event.error || new Error('MediaRecorder error'));
            recorder.onstop = () => resolve(new Blob(chunks, { type: mimeType }));
        });
        panel.dataset.generating = 'true';
        recorder.start(1000);
        try {
            for (let index = 0; index < frames.length; index += 1) {
                const frame = frames[index];
                const previousFrame = index > 0 ? frames[index - 1] : null;
                const frameProgress = (frameProgressValue) => {
                    const totalProgress = 38 + ((index + frameProgressValue) / frames.length) * 58;
                    stage11VideoStatus(panel, '正在生成影片 ' + Math.round(totalProgress) + '%', totalProgress);
                };
                await stage11HoldVideoFrame(context, frame, previousFrame, source, options, frame.duration, frameProgress);
            }
            await new Promise(resolve => window.setTimeout(resolve, 260));
            recorder.stop();
            const blob = await stopped;
            stream.getTracks().forEach(track => track.stop());
            const url = URL.createObjectURL(blob);
            const link = document.createElement('a');
            const safeName = String(source.title || 'Diary_Diary_Film').replace(/[\\/:*?"<>|]/g, '_').slice(0, 64);
            link.download = safeName + (mimeType.startsWith('video/mp4') ? '.mp4' : '.webm');
            link.href = url;
            link.click();
            window.setTimeout(() => URL.revokeObjectURL(url), 2000);
            stage11VideoStatus(panel, '影片已生成，正在下载…', 100);
            return blob;
        } catch (error) {
            if (recorder.state !== 'inactive') recorder.stop();
            stream.getTracks().forEach(track => track.stop());
            throw error;
        } finally {
            delete panel.dataset.generating;
        }
    }

    async function stage11ExportVideoFromPanel(panel) {
        if (panel.dataset.generating) return;
        const button = panel.querySelector('.icity-video-export-submit');
        if (button) button.disabled = true;
        try {
            const source = await stage11BuildVideoSource(panel);
            if (!source || source.empty) {
                stage11VideoStatus(panel, '当前范围没有可制作的日记。');
                stage11VideoToast('当前范围没有可制作的日记');
                return;
            }
            const options = {
                template: panel.querySelector('#icity-video-export-template')?.value || 'cinematic',
                subtitle: panel.querySelector('#icity-video-export-subtitle')?.value || 'film',
                duration: Number(panel.querySelector('#icity-video-export-duration')?.value || 4)
            };
            await saveIcityVideoExportPrefs({
                scope: panel.dataset.scope || 'range',
                entryId: panel.querySelector('#icity-video-export-entry')?.value || '',
                bookId: panel.querySelector('#icity-video-export-book')?.value || '',
                startDate: panel.querySelector('#icity-video-export-start')?.value || '',
                endDate: panel.querySelector('#icity-video-export-end')?.value || '',
                template: options.template,
                subtitle: options.subtitle,
                duration: options.duration
            });
            await stage11RenderVideo(source, options, panel);
            stage11VideoToast('日记影片已生成并开始下载');
        } catch (error) {
            console.error('Diary diary video export failed:', error);
            stage11VideoStatus(panel, error?.message || '当前设备暂不支持影片导出。');
            stage11VideoToast(error?.message || '当前设备暂不支持影片导出');
        } finally {
            if (button) button.disabled = false;
        }
    }

    function stage11EnsureCalendarVideoButton() {
        const placeholder = viewCalendar?.querySelector('.right-placeholder');
        if (!placeholder) return;
        let actions = placeholder.querySelector('.icity-calendar-export-actions');
        if (!actions) {
            actions = document.createElement('div');
            actions.className = 'icity-calendar-export-actions';
            placeholder.appendChild(actions);
        }
        if ($('#btn-icity-video-export-calendar')) return;
        const button = document.createElement('button');
        button.type = 'button';
        button.id = 'btn-icity-video-export-calendar';
        button.className = 'icity-calendar-icon-btn';
        button.title = '制作影片';
        button.setAttribute('aria-label', '制作影片');
        button.innerHTML = '<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="23 7 16 12 23 17 23 7"></polygon><rect x="1" y="5" width="15" height="14" rx="2" ry="2"></rect></svg>';
        bindIcityTap(button, () => stage11OpenVideoExportPanel('range'));
        actions.appendChild(button);
    }

    function stage11EnsureDiaryBookVideoButton() {
        if (typeof ensureIcityDiaryBookControls === 'function') ensureIcityDiaryBookControls();
        const actions = $('#icity-diary-book-ai-actions');
        if (!actions || $('#btn-icity-video-export-book')) return;
        const button = document.createElement('button');
        button.type = 'button';
        button.id = 'btn-icity-video-export-book';
        button.className = 'icity-diary-book-ai-btn icity-video-book-export-button';
        button.textContent = '制作影片';
        bindIcityTap(button, () => stage11OpenVideoExportPanel('book', window.currentDiaryBook || null));
        actions.appendChild(button);
    }

    const stage11OriginalOpenDiaryDetail = window.openDiaryDetail;
    if (typeof stage11OriginalOpenDiaryDetail === 'function') {
        window.openDiaryDetail = function stage11OpenDiaryDetailWithVideo() {
            const result = stage11OriginalOpenDiaryDetail.apply(this, arguments);
            window.setTimeout(stage11EnsureDiaryBookVideoButton, 0);
            return result;
        };
    }

    window.openIcityVideoExportPanel = stage11OpenVideoExportPanel;
    stage11EnsureCalendarVideoButton();
    window.setTimeout(stage11EnsureDiaryBookVideoButton, 0);


})();
}


